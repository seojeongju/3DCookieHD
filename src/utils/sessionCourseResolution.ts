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

    if (allowed.length === 0) return true;
    return allowed.includes(dow);
}

/**
 * 전체 회차 1:1 전용 LMS 과정 정합성 검사 및 정비
 * 1) lms_course_id가 누락되거나 중복된 회차에 1:1 전용 courses 발급
 * 2) 주말반에 잘못 들어간 평일 일지 등 요일 불일치 일지를 적절한 평일반 회차로 복구
 */
export async function normalizeAllCourseSessions(DB: D1Database): Promise<{
    totalSessions: number;
    fixedSessions: number;
    movedLogs: number;
    details: string[];
}> {
    const details: string[] = [];
    let fixedSessions = 0;
    let movedLogs = 0;

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

    // 2단계: 주말반/평일반 요일 불일치 일지 복구
    // 주말반 회차 목록 추출
    const weekendSessions = sessionList.filter(s => {
        const sn = s.session_name || '';
        const dow = s.days_of_week || '';
        return /주말/.test(sn) || (/일/.test(dow) && /토/.test(dow) && !/[월화수목금]/.test(dow));
    });

    const weekdaySessions = sessionList.filter(s => {
        const sn = s.session_name || '';
        const dow = s.days_of_week || '';
        return /평일/.test(sn) || /[월화수목금]/.test(dow);
    });

    for (const wSess of weekendSessions) {
        const wLmsId = Number(wSess.lms_course_id);
        if (!wLmsId) continue;

        // 이 주말반에 등록된 일지 중 월~금(1~5) 요일에 작성된 일지 검색
        const logs = await DB.prepare(`
            SELECT id, date, instructor_id, topic, course_id
            FROM training_logs
            WHERE course_id = ?
        `).bind(wLmsId).all();

        for (const log of (logs.results || []) as any[]) {
            const logDate = String(log.date || '').substring(0, 10);
            if (!logDate) continue;

            const isWeekend = isDateMatchingSessionDays(logDate, '일,토', '[주말반]');
            if (!isWeekend) {
                // 평일 일지 발견!
                // 대응하는 평일반 찾기 (동일 승인과정 우선, 강사 우선, 기간 매칭)
                let targetWeekdaySess = weekdaySessions.find(wd =>
                    Number(wd.approved_course_id) === Number(wSess.approved_course_id) &&
                    logDate >= String(wd.training_start_date || '').substring(0, 10) &&
                    logDate <= String(wd.training_end_date || '').substring(0, 10)
                );

                if (!targetWeekdaySess) {
                    targetWeekdaySess = weekdaySessions.find(wd =>
                        Number(wd.approved_course_id) === Number(wSess.approved_course_id)
                    );
                }

                if (!targetWeekdaySess && weekdaySessions.length > 0) {
                    targetWeekdaySess = weekdaySessions.find(wd =>
                        logDate >= String(wd.training_start_date || '').substring(0, 10) &&
                        logDate <= String(wd.training_end_date || '').substring(0, 10)
                    );
                }

                if (targetWeekdaySess && targetWeekdaySess.lms_course_id) {
                    const targetLmsId = Number(targetWeekdaySess.lms_course_id);
                    await DB.prepare('UPDATE training_logs SET course_id = ? WHERE id = ?')
                        .bind(targetLmsId, log.id).run();
                    movedLogs++;
                    details.push(`[일지 #${log.id} (${logDate})] 주말반(LMS #${wLmsId}) → 평일반(LMS #${targetLmsId}, 회차 #${targetWeekdaySess.id})으로 정상 복구`);
                }
            }
        }
    }

    return { totalSessions, fixedSessions, movedLogs, details };
}

