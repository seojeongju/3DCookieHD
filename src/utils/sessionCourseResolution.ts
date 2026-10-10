/**
 * 회차 PK → 연결된 LMS 과정(courses.id)
 * - 연결이 있으면 그대로 사용 (제목이 달라도 연결을 끊지 않음)
 * - 연결이 없을 때만, 다른 회차가 쓰지 않는 같은 제목의 과정을 찾아 연결
 */
export async function lmsCourseIdForSession(DB: any, sessionId: string | number): Promise<number | null> {
    const sid = parseInt(String(sessionId), 10);
    if (isNaN(sid) || sid < 1) return null;

    const session: any = await DB.prepare(`
        SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
        FROM course_sessions s
        JOIN approved_courses a ON s.approved_course_id = a.id
        WHERE s.id = ?
    `).bind(sid).first();
    if (!session) return null;

    if (session.lms_course_id != null && Number(session.lms_course_id) > 0) {
        const linked = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(session.lms_course_id).first();
        if (linked) return Number(session.lms_course_id);
    }

    const { full } = expectedLmsTitlesForSession(session.course_name, session.session_number, session.session_name);
    const byTitle: any = await DB.prepare(`
        SELECT c.id FROM courses c
        WHERE c.title = ? AND NOT EXISTS (SELECT 1 FROM course_sessions o WHERE o.lms_course_id = c.id AND o.id != ?)
        LIMIT 1
    `).bind(full, sid).first();
    if (!byTitle) return null;
    await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ? AND lms_course_id IS NULL').bind(byTitle.id, sid).run();
    return Number(byTitle.id);
}

/**
 * 회차 → LMS 과정. 연결(또는 같은 제목의 미사용 과정)이 있으면 그대로 쓰고,
 * 아무것도 없을 때만 전용 과정을 만든다. 다른 회차와 공유 중인 연결도 끊지 않는다.
 */
export async function lmsCourseIdForSessionOrCreate(DB: any, sessionId: string | number): Promise<number | null> {
    return (await lmsCourseIdForSession(DB, sessionId)) ?? (await ensureDedicatedLmsCourseForSession(DB, Number(sessionId)));
}

/**
 * 과정/회차 ID → LMS 과정(courses.id) 해석 (과제/시험/CBT/상담 등 공통)
 * - explicitSessionId가 있으면 회차로만 해석 (회차 PK와 LMS 과정 번호가 겹쳐도 안전)
 * - 없으면 id가 LMS 과정 번호인지 먼저 보고, 아니면 회차 PK로 본다
 */
export async function resolveSessionToLmsCourseId(
    DB: any,
    id: string | number | null | undefined,
    explicitSessionId?: string | number | null
): Promise<number | null> {
    const explicit = explicitSessionId != null && String(explicitSessionId).trim() !== ''
        ? parseInt(String(explicitSessionId), 10) : NaN;
    if (Number.isFinite(explicit) && explicit >= 1) return lmsCourseIdForSession(DB, explicit);

    const rawId = parseInt(String(id), 10);
    if (isNaN(rawId)) return null;

    const existsInCourses = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
    if (existsInCourses) return rawId;

    return lmsCourseIdForSession(DB, rawId);
}

export type TrainingLogSessionRow = {
    id: number;
    status?: string;
    training_start_date?: string;
    training_end_date?: string;
    days_of_week?: string | null;
    excluded_dates?: string | null;
    session_name?: string | null;
    lms_course_id?: number | null;
};

const TRAINING_LOG_SESSION_SELECT = `
    SELECT s.id, s.status, s.training_start_date, s.training_end_date, s.days_of_week, s.excluded_dates, s.session_name, s.lms_course_id
    FROM course_sessions s
`;

/** 회차 기대 LMS 과정 제목 (풀네임 / 회차만 / UI 표기 변형) */
export function expectedLmsTitlesForSession(courseName: string | null | undefined, sessionNumber: unknown, sessionName?: string | null): { full: string; short: string; altFull: string } {
  const base = (courseName || '과정').trim() || '과정';
  const num = sessionNumber != null && String(sessionNumber).trim() !== '' ? String(sessionNumber).trim() : '';
  const sn = (sessionName || '').trim();
  const short = `${base} (${num}회차)`.trim();
  const full = sn ? `${base} (${num}회차 - ${sn})`.trim() : short;
  // UI/헤더 표기: "과정명 (N회차) - 회차명"
  const altFull = sn ? `${base} (${num}회차) - ${sn}`.trim() : short;
  return { full, short, altFull };
}

export function isExpectedLmsTitle(title: unknown, courseName: string | null | undefined, sessionNumber: unknown, sessionName?: string | null): boolean {
  const t = String(title ?? '').trim();
  if (!t) return false;
  const { full, short, altFull } = expectedLmsTitlesForSession(courseName, sessionNumber, sessionName);
  if (t === full || t === short || t === altFull) return true;
  // 공백·하이픈 주변 차이 허용
  const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/\s*-\s*/g, ' - ').trim();
  const nt = norm(t);
  return nt === norm(full) || nt === norm(short) || nt === norm(altFull);
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
      `SELECT id, date FROM training_logs WHERE course_id = ? AND substr(date, 1, 10) >= ? AND substr(date, 1, 10) <= ?`
    ).bind(fromCourseId, start, end).all();
    for (const row of results || []) {
      const logId = Number((row as any).id);
      const logDate = String((row as any).date || '').substring(0, 10);
      if (!logId || !logDate) continue;
      const clash = await DB.prepare(
        `SELECT id FROM training_logs WHERE course_id = ? AND substr(date, 1, 10) = ? LIMIT 1`
      ).bind(toCourseId, logDate).first();
      if (clash) continue;
      await DB.prepare('UPDATE training_logs SET course_id = ? WHERE id = ?').bind(toCourseId, logId).run();
    }
  } catch (e) {
    console.error('[migrateSessionPeriodLogs]', e);
  }
}

/**
 * 회차 운영기간 일지 자동 회수 로직 비활성화
 * 주의: 동일 기간 내에 평일반/주말반/타과정이 동시 운영되므로,
 * 날짜 범위만으로 일지를 임의 이전(강탈)하면 타 과정 일지가 섞여 심각한 데이터 오염을 유발함.
 */
async function recoverOrphanPeriodLogs(
  _DB: D1Database,
  _sessionId: number,
  _dedicatedCourseId: number,
  _startDate?: string | null,
  _endDate?: string | null
): Promise<void> {
  // 타 과정 일지 혼입 방지를 위해 비활성화
  return;
}

/**
 * 회차 전용 LMS courses.id 보장.
 * - 다른 회차와 lms_course_id를 공유하지 않음 (1:1 보장)
 * - 유효한 전용 과정이 이미 연결되어 있으면 그대로 재사용
 * - 없거나 중복 공유된 경우, 새 courses 행을 생성하여 1:1로 확실하게 분리 연결
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

  const { full: expectedTitle, short: shortTitle, altFull } = expectedLmsTitlesForSession(
    session.course_name,
    session.session_number,
    session.session_name
  );

  // 1) 이미 lms_course_id가 있고 다른 회차와 공유되지 않는 경우
  if (session.lms_course_id != null && Number(session.lms_course_id) > 0) {
    const lmsId = Number(session.lms_course_id);
    const other = await DB.prepare(
      'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
    ).bind(lmsId, sid).first();
    const course: any = await DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(lmsId).first();

    // 다른 회차와 겹치지 않고 실제 존재하는 코스라면 그대로 유지
    if (course && !other) {
      // 제목이 비어있거나 다르면 제목만 동기화
      if (course.title !== expectedTitle) {
        try {
          await DB.prepare('UPDATE courses SET title = ? WHERE id = ?').bind(expectedTitle, lmsId).run();
        } catch (_) {}
      }
      return lmsId;
    }

    // 다른 회차와 겹치거나 코스가 없으면 기존 잘못된 연결 해제
    if (other || !course) {
      try {
        await DB.prepare('UPDATE course_sessions SET lms_course_id = NULL WHERE id = ?').bind(sid).run();
      } catch (_) {}
    }
  }

  // 2) 신규 전용 LMS 코스 발급
  const insert = await DB.prepare(
    `INSERT INTO courses (title, category, status) VALUES (?, '국비지원', 'active')`
  ).bind(expectedTitle).run();
  const newId = insert.meta?.last_row_id;
  if (newId == null) return null;
  const dedicatedId = Number(newId);

  try {
    await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(dedicatedId, sid).run();
  } catch (_) {}

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

/**
 * 일자의 요일이 회차 요일 규정(days_of_week / session_name)에 부합하는지 검증
 */
export function isDateMatchingSessionDays(dateStr: string, daysOfWeek?: string | null, sessionName?: string | null): boolean {
    if (!dateStr) return true;
    const parts = dateStr.substring(0, 10).split('-');
    if (parts.length !== 3) return true;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return true;
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay(); // 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토

    const allowed = allowedDowsForSession(daysOfWeek, sessionName);
    if (allowed.length === 0) return true;
    return allowed.includes(dow);
}

/** 회차 요일 규정(days_of_week, 없으면 회차명의 주말/평일)을 0=일 ~ 6=토 목록으로. 규정이 없으면 빈 배열 */
export function allowedDowsForSession(daysOfWeek?: string | null, sessionName?: string | null): number[] {
    const dayMap: Record<string, number> = {
        '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6,
        '일요일': 0, '월요일': 1, '화요일': 2, '수요일': 3, '목요일': 4, '금요일': 5, '토요일': 6,
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6,
    };

    const allowed: number[] = [];
    if (daysOfWeek) {
        const tokens = daysOfWeek.split(/[,/|\s]+/);
        for (const t of tokens) {
            const k = t.trim().toLowerCase();
            if (dayMap[k] !== undefined) allowed.push(dayMap[k]);
            else if (dayMap[t.trim()] !== undefined) allowed.push(dayMap[t.trim()]);
        }
    }

    if (allowed.length === 0 && sessionName && /주말/.test(sessionName)) {
        allowed.push(0, 6);
    }
    if (allowed.length === 0 && sessionName && /평일/.test(sessionName)) {
        allowed.push(1, 2, 3, 4, 5);
    }

    return [...new Set(allowed)];
}

/**
 * 전체 회차 1:1 전용 LMS 과정 정합성 검사 및 정비
 * - lms_course_id가 누락되거나 중복된 회차에 1:1 전용 courses 발급
 * - 일지 소속 판정은 시간표 근거로만 한다 (training_log_scope.reviewLegacyTrainingLogs)
 */
export async function normalizeAllCourseSessions(DB: D1Database): Promise<{
    totalSessions: number;
    fixedSessions: number;
    details: string[];
}> {
    const details: string[] = [];
    let fixedSessions = 0;

    const sessions = await DB.prepare(`
        SELECT s.id, s.approved_course_id, s.session_number, s.session_name,
               s.lms_course_id, s.days_of_week, s.training_start_date, s.training_end_date,
               a.name as course_name
        FROM course_sessions s
        JOIN approved_courses a ON s.approved_course_id = a.id
        ORDER BY s.id ASC
    `).all();

    const sessionList = (sessions.results || []) as any[];
    const totalSessions = sessionList.length;

    // 1단계: 1:1 전용 courses 연결 보장
    for (const sess of sessionList) {
        const sid = Number(sess.id);
        const dedicatedId = await ensureDedicatedLmsCourseForSession(DB, sid);
        if (dedicatedId && dedicatedId !== Number(sess.lms_course_id)) {
            fixedSessions++;
            details.push(`[회차 ${sid}] ${sess.course_name} (${sess.session_number}회차) 전용 LMS 코스 발급/보정: ${dedicatedId}`);
            sess.lms_course_id = dedicatedId;
        }
    }

    return { totalSessions, fixedSessions, details };
}

