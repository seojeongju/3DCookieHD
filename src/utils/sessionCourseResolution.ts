/**
 * 회차(session) ID → LMS 과정(courses.id) 해석 (과제/훈련일지/시험/상담 등 공통)
 * - 과정명 풀네임만 매칭, 회차별 1:1 LMS 과정 (다른 회차에 연결된 과정은 사용하지 않음)
 */
export async function resolveSessionToLmsCourseId(DB: any, id: string | number): Promise<number | null> {
    const rawId = parseInt(String(id), 10);
    if (isNaN(rawId)) return null;

    const existsInCourses = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
    if (existsInCourses) return rawId;

    const session: any = await DB.prepare(`
        SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
        FROM course_sessions s
        JOIN approved_courses a ON s.approved_course_id = a.id
        WHERE s.id = ?
    `).bind(rawId).first();

    if (!session) return null;

    const expectedTitle = `${session.course_name || '과정'} (${session.session_number}회차${session.session_name ? ' - ' + session.session_name : ''})`.trim();

    let resolved: number | null = null;

    if (session.lms_course_id != null && session.lms_course_id > 0) {
        const existingCourse: any = await DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(session.lms_course_id).first();
        const titleMatches = existingCourse && isExpectedLmsTitle(
            existingCourse.title,
            session.course_name,
            session.session_number,
            session.session_name
        );
        const otherSession: any = await DB.prepare(
            'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
        ).bind(session.lms_course_id, rawId).first();
        if (titleMatches && !otherSession) {
            resolved = Number(session.lms_course_id);
        } else if (existingCourse || otherSession) {
            try {
                await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, rawId).run();
            } catch (_) {}
        }
    }

    if (resolved == null) {
        const lmsCourse: any = await DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(expectedTitle).first();
        if (lmsCourse) {
            const otherSession: any = await DB.prepare(
                'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
            ).bind(lmsCourse.id, rawId).first();
            if (!otherSession) {
                resolved = lmsCourse.id;
                try {
                    await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolved, rawId).run();
                } catch (_) {}
            }
        }
    }

    return resolved;
}

export type TrainingLogSessionRow = {
    id: number;
    status?: string;
    training_start_date?: string;
    training_end_date?: string;
    days_of_week?: string | null;
    excluded_dates?: string | null;
    session_name?: string | null;
};

const TRAINING_LOG_SESSION_SELECT = `
    SELECT s.id, s.status, s.training_start_date, s.training_end_date, s.days_of_week, s.excluded_dates, s.session_name, s.lms_course_id
    FROM course_sessions s
`;

/** 회차 기대 LMS 과정 제목 (풀네임 / 회차만) */
export function expectedLmsTitlesForSession(courseName: string | null | undefined, sessionNumber: unknown, sessionName?: string | null): { full: string; short: string } {
  const base = (courseName || '과정').trim() || '과정';
  const num = sessionNumber != null && String(sessionNumber).trim() !== '' ? String(sessionNumber).trim() : '';
  const sn = (sessionName || '').trim();
  const short = `${base} (${num}회차)`.trim();
  const full = sn ? `${base} (${num}회차 - ${sn})`.trim() : short;
  return { full, short };
}

export function isExpectedLmsTitle(title: unknown, courseName: string | null | undefined, sessionNumber: unknown, sessionName?: string | null): boolean {
  const t = String(title ?? '').trim();
  if (!t) return false;
  const { full, short } = expectedLmsTitlesForSession(courseName, sessionNumber, sessionName);
  return t === full || t === short;
}

/**
 * 잘못된/공유 LMS에 묶인 일지 중 이 회차 운영기간에 해당하는 건만 전용 과정으로 이전
 */
async function migrateSessionPeriodLogs(
  DB: D1Database,
  fromCourseId: number,
  toCourseId: number,
  startDate?: string | null,
  endDate?: string | null
): Promise<void> {
  if (!fromCourseId || !toCourseId || fromCourseId === toCourseId) return;
  const start = startDate ? String(startDate).substring(0, 10) : '';
  const end = endDate ? String(endDate).substring(0, 10) : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return;
  try {
    const { results } = await DB.prepare(
      `SELECT id, date FROM training_logs WHERE course_id = ? AND date >= ? AND date <= ?`
    ).bind(fromCourseId, start, end).all();
    for (const row of results || []) {
      const logId = Number((row as any).id);
      const logDate = String((row as any).date || '').substring(0, 10);
      if (!logId || !logDate) continue;
      const clash = await DB.prepare(
        'SELECT id FROM training_logs WHERE course_id = ? AND date = ? LIMIT 1'
      ).bind(toCourseId, logDate).first();
      if (clash) continue;
      await DB.prepare('UPDATE training_logs SET course_id = ? WHERE id = ?').bind(toCourseId, logId).run();
    }
  } catch (e) {
    console.error('[migrateSessionPeriodLogs]', e);
  }
}

/**
 * 회차 전용 LMS courses.id 보장.
 * - 다른 회차와 lms_course_id를 공유하지 않음
 * - 제목이 회차(승인과정명·회차·회차명)와 일치할 때만 기존 연결 유지 (타 과정 일지 혼입 방지)
 * - 없으면 courses 행을 만들고 course_sessions.lms_course_id에 연결
 */
export async function ensureDedicatedLmsCourseForSession(
  DB: D1Database,
  sessionId: number
): Promise<number | null> {
  const sid = Number(sessionId);
  if (!Number.isFinite(sid) || sid < 1) return null;

  const session: any = await DB.prepare(`
    SELECT s.id, s.session_number, s.session_name, s.lms_course_id,
           s.training_start_date, s.training_end_date, a.name as course_name
    FROM course_sessions s
    JOIN approved_courses a ON s.approved_course_id = a.id
    WHERE s.id = ?
  `).bind(sid).first();
  if (!session) return null;

  const { full: expectedTitle, short: shortTitle } = expectedLmsTitlesForSession(
    session.course_name,
    session.session_number,
    session.session_name
  );
  let staleCourseId: number | null = null;

  if (session.lms_course_id != null && Number(session.lms_course_id) > 0) {
    const lmsId = Number(session.lms_course_id);
    const other = await DB.prepare(
      'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
    ).bind(lmsId, sid).first();
    const course: any = await DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(lmsId).first();
    const titleOk = course && isExpectedLmsTitle(course.title, session.course_name, session.session_number, session.session_name);
    // 제목이 회차와 일치하고 다른 회차와 공유하지 않을 때만 재사용
    if (course && !other && titleOk) return lmsId;
    if (course && (!titleOk || other)) {
      staleCourseId = lmsId;
      try {
        await DB.prepare('UPDATE course_sessions SET lms_course_id = NULL WHERE id = ?').bind(sid).run();
      } catch (_) { /* ignore */ }
    }
  }

  const findUnusedByTitle = async (title: string): Promise<number | null> => {
    const row: any = await DB.prepare('SELECT id, title FROM courses WHERE title = ? LIMIT 1').bind(title).first();
    if (row?.id == null) return null;
    const used = await DB.prepare(
      'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
    ).bind(row.id, sid).first();
    if (used) return null;
    return Number(row.id);
  };

  let dedicatedId = await findUnusedByTitle(expectedTitle);
  if (dedicatedId == null && shortTitle !== expectedTitle) {
    dedicatedId = await findUnusedByTitle(shortTitle);
  }

  if (dedicatedId == null) {
    const insert = await DB.prepare(
      `INSERT INTO courses (title, category, status) VALUES (?, '국비지원', 'active')`
    ).bind(expectedTitle).run();
    const newId = insert.meta?.last_row_id;
    if (newId == null) return null;
    dedicatedId = Number(newId);
  }

  try {
    await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(dedicatedId, sid).run();
  } catch (_) { /* ignore */ }

  // 잘못 연결됐던 LMS에 남아 있는 ‘이 회차 기간’ 일지만 전용 과정으로 이전
  if (staleCourseId != null && dedicatedId != null) {
    await migrateSessionPeriodLogs(
      DB,
      staleCourseId,
      dedicatedId,
      session.training_start_date,
      session.training_end_date
    );
  }

  return dedicatedId;
}

/**
 * LMS courses.id / session_id / course_sessions.id 혼동 방지
 * - 명시 session_id가 있으면 항상 해당 회차를 최우선
 */
export async function resolveTrainingLogSession(
    DB: D1Database,
    courseIdParam: string | number,
    sessionIdParam?: string | number | null
): Promise<TrainingLogSessionRow | null> {
    const rawId = parseInt(String(courseIdParam), 10);
    if (isNaN(rawId) || rawId < 1) return null;

    const explicitSid = sessionIdParam != null && String(sessionIdParam).trim() !== ''
        ? parseInt(String(sessionIdParam), 10)
        : NaN;

    // 1) 명시 회차 PK 최우선 (복사본 UI가 원본 LMS path를 쓰더라도 올바른 회차로 고정)
    if (Number.isFinite(explicitSid) && explicitSid >= 1) {
        const byExplicit = await DB.prepare(
            `${TRAINING_LOG_SESSION_SELECT} WHERE s.id = ?`
        ).bind(explicitSid).first() as TrainingLogSessionRow | null;
        if (byExplicit) return byExplicit;
    }

    const inCourses = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();

    if (inCourses) {
        const byLms = await DB.prepare(
            `${TRAINING_LOG_SESSION_SELECT} WHERE s.lms_course_id = ? ORDER BY COALESCE(s.session_number, 999999) DESC, s.id DESC LIMIT 1`
        ).bind(rawId).first() as TrainingLogSessionRow | null;
        if (byLms) return byLms;
    }

    const bySessionPk = await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.id = ?`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
    if (bySessionPk) return bySessionPk;

    const byApproved = await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.approved_course_id = ? ORDER BY s.session_number DESC, s.id DESC LIMIT 1`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
    if (byApproved) return byApproved;

    return await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.lms_course_id = ? ORDER BY COALESCE(s.session_number, 999999) ASC, s.id ASC LIMIT 1`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
}
