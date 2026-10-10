/**
 * 훈련일지의 회차 소속(training_logs.session_id) 관리
 * - 신규·수정 일지는 회차 PK(session_id)로 소속을 고정한다
 * - session_id가 없는 기존 일지(레거시)는 회차 LMS course_id + 운영기간 + 요일로만 추정해 보여준다
 * - 레거시 일지는 시간표(session_timetable)로 소속이 증명될 때만 session_id를 채운다
 */
import { allowedDowsForSession } from './sessionCourseResolution';

type DB = D1Database;

export type ScopeSession = {
  id: number;
  lms_course_id?: number | null;
  training_start_date?: string | null;
  training_end_date?: string | null;
  days_of_week?: string | null;
  session_name?: string | null;
};

let columnReady = false;

/** 운영 DB에 마이그레이션(0109)을 직접 적용하지 못하는 경우를 위해 요청 시 컬럼을 보장 */
export async function ensureTrainingLogSessionColumn(DB: DB): Promise<void> {
  if (columnReady) return;
  try {
    await DB.prepare('ALTER TABLE training_logs ADD COLUMN session_id INTEGER').run();
  } catch (e) {
    if (!/duplicate column/i.test(String((e as Error)?.message ?? e))) throw e;
  }
  await DB.prepare('CREATE INDEX IF NOT EXISTS idx_training_logs_session_date ON training_logs(session_id, date)').run();
  columnReady = true;
}

const ymd = (v?: string | null) => {
  const s = v ? String(v).slice(0, 10) : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};

/** 레거시 일지가 이 회차 것으로 추정될 수 있는 course_id 목록 (회차 LMS + 회차 PK로 저장된 옛 일지) */
async function legacyCourseIds(DB: DB, session: ScopeSession): Promise<number[]> {
  const ids: number[] = [];
  const lms = Number(session.lms_course_id);
  if (Number.isFinite(lms) && lms > 0) ids.push(lms);
  const sid = Number(session.id);
  if (sid !== lms) {
    // 회차 PK가 다른 LMS 과정 번호와 겹치면 그 과정 일지가 섞이므로 제외
    const collides = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(sid).first();
    if (!collides) ids.push(sid);
  }
  return ids;
}

/**
 * 회차 일지 조회 조건 (테이블 별칭 t)
 * - session_id가 이 회차인 일지
 * - 또는 session_id가 없고, 회차 course_id·운영기간·요일이 모두 맞는 레거시 일지
 */
export async function trainingLogScopeSql(DB: DB, session: ScopeSession): Promise<{ where: string; binds: unknown[] }> {
  const binds: unknown[] = [Number(session.id)];
  const ids = await legacyCourseIds(DB, session);
  if (ids.length === 0) return { where: 't.session_id = ?', binds };

  let legacy = `t.session_id IS NULL AND t.course_id IN (${ids.map(() => '?').join(',')})`;
  binds.push(...ids);
  const start = ymd(session.training_start_date);
  const end = ymd(session.training_end_date);
  if (start && end) {
    legacy += ' AND substr(t.date, 1, 10) BETWEEN ? AND ?';
    binds.push(start, end);
  }
  const dows = allowedDowsForSession(session.days_of_week, session.session_name);
  if (dows.length > 0 && dows.length < 7) {
    legacy += ` AND CAST(strftime('%w', substr(t.date, 1, 10)) AS INTEGER) IN (${dows.join(',')})`;
  }
  return { where: `(t.session_id = ? OR (${legacy}))`, binds };
}

export type SessionRef = { session_id: number; title: string };

export type LegacyLogReview = {
  id: number;
  date: string;
  course_id: number;
  topic: string | null;
  content_preview: string | null;
  instructor_name: string | null;
  created_at: string | null;
  /** 지금 이 일지가 보이는 회차 (일지 course_id를 쓰는 회차) */
  current_sessions: SessionRef[];
  /** 시간표상 그 날짜에 수업이 있는 회차 */
  timetable_sessions: SessionRef[];
  /** 운영기간·요일이 그 날짜와 맞는 회차 (시간표 미등록 회차 포함) */
  period_sessions: SessionRef[];
  reason: string;
};

/**
 * 레거시 일지(session_id 없음)의 소속 회차를 시간표로 판정한다.
 * 자동 확정 조건: 일지 course_id를 쓰는 회차들 중 그 날짜에 시간표가 있는 회차가 정확히 하나
 * apply=true 이면 확정된 건만 session_id를 기록한다 (course_id·내용은 건드리지 않음)
 */
export async function reviewLegacyTrainingLogs(DB: DB, apply: boolean): Promise<{
  total: number;
  assigned: number;
  needsReview: LegacyLogReview[];
  sessions: SessionRef[];
}> {
  await ensureTrainingLogSessionColumn(DB);
  const { results: logs } = await DB.prepare(`
    SELECT t.id, substr(t.date, 1, 10) AS date, t.course_id, t.topic, substr(t.content, 1, 120) AS content_preview,
           t.created_at, u.name AS instructor_name
    FROM training_logs t LEFT JOIN users u ON u.id = t.instructor_id
    WHERE t.session_id IS NULL
    ORDER BY t.date DESC, t.id DESC
  `).all<{ id: number; date: string; course_id: number; topic: string | null; content_preview: string | null; created_at: string | null; instructor_name: string | null }>();

  const { results: sessions } = await DB.prepare(`
    SELECT s.id, s.lms_course_id, a.name AS course_name, s.session_number, s.session_name,
           s.training_start_date, s.training_end_date, s.days_of_week
    FROM course_sessions s JOIN approved_courses a ON a.id = s.approved_course_id
    ORDER BY s.id DESC
  `).all<{
    id: number; lms_course_id: number | null; course_name: string; session_number: number; session_name: string | null;
    training_start_date: string | null; training_end_date: string | null; days_of_week: string | null;
  }>();
  const courseIds = new Set(
    ((await DB.prepare('SELECT id FROM courses').all<{ id: number }>()).results ?? []).map((r) => Number(r.id)),
  );

  const titleOf = new Map<number, string>();
  const sessionsByCourseId = new Map<number, number[]>();
  for (const s of sessions ?? []) {
    titleOf.set(s.id, `${s.course_name} (${s.session_number}회차${s.session_name ? ' - ' + s.session_name : ''})`);
    const add = (key: number) => sessionsByCourseId.set(key, [...(sessionsByCourseId.get(key) ?? []), s.id]);
    if (s.lms_course_id) add(Number(s.lms_course_id));
    if (!courseIds.has(Number(s.id))) add(Number(s.id));
  }
  const ref = (sid: number): SessionRef => ({ session_id: sid, title: titleOf.get(sid) ?? `회차 #${sid}` });
  const sessionsInPeriod = (date: string) => (sessions ?? []).filter((s) => {
    const start = ymd(s.training_start_date);
    const end = ymd(s.training_end_date);
    if (!start || !end || date < start || date > end) return false;
    const dows = allowedDowsForSession(s.days_of_week, s.session_name);
    return dows.length === 0 || dows.includes(new Date(`${date}T00:00:00Z`).getUTCDay());
  }).map((s) => s.id);

  const { results: timetable } = await DB.prepare(`
    SELECT DISTINCT session_id, substr(training_date, 1, 10) AS d
    FROM session_timetable WHERE is_excluded IS NULL OR is_excluded = 0
  `).all<{ session_id: number; d: string }>();
  const sessionsOnDate = new Map<string, number[]>();
  for (const r of timetable ?? []) sessionsOnDate.set(r.d, [...(sessionsOnDate.get(r.d) ?? []), Number(r.session_id)]);

  const needsReview: LegacyLogReview[] = [];
  const toAssign: [number, number][] = [];
  for (const log of logs ?? []) {
    const owners = sessionsByCourseId.get(Number(log.course_id)) ?? [];
    const onDate = sessionsOnDate.get(log.date) ?? [];
    const proven = owners.filter((sid) => onDate.includes(sid));

    let reason = '';
    if (owners.length === 0) reason = '일지 과정 번호에 연결된 회차가 없음';
    else if (proven.length === 0) reason = '연결 회차의 시간표에 해당 날짜 수업이 없음 (다른 회차 일지 혼입 의심)';
    else if (proven.length > 1) reason = '같은 과정 번호를 쓰는 회차가 여럿이고 모두 그 날짜 수업이 있음';

    if (!reason) {
      toAssign.push([log.id, proven[0]]);
    } else {
      needsReview.push({
        ...log,
        current_sessions: owners.map(ref),
        timetable_sessions: onDate.map(ref),
        period_sessions: sessionsInPeriod(log.date).filter((sid) => !onDate.includes(sid)).map(ref),
        reason,
      });
    }
  }

  if (apply && toAssign.length > 0) {
    const stmts = toAssign.map(([logId, sid]) =>
      DB.prepare('UPDATE training_logs SET session_id = ? WHERE id = ? AND session_id IS NULL').bind(sid, logId),
    );
    for (let i = 0; i < stmts.length; i += 50) await DB.batch(stmts.slice(i, i + 50));
  }

  return {
    total: (logs ?? []).length,
    assigned: toAssign.length,
    needsReview,
    sessions: (sessions ?? []).map((s) => ref(s.id)),
  };
}

/** 관리자 확인 후 레거시 일지를 특정 회차로 지정 (회차 LMS course_id도 함께 맞춤) */
export async function assignTrainingLogToSession(DB: DB, logId: number, sessionId: number): Promise<boolean> {
  await ensureTrainingLogSessionColumn(DB);
  const session = await DB.prepare('SELECT id, lms_course_id FROM course_sessions WHERE id = ?')
    .bind(sessionId).first<{ id: number; lms_course_id: number | null }>();
  if (!session) return false;
  const res = await DB.prepare(`
    UPDATE training_logs SET session_id = ?, course_id = COALESCE(?, course_id), updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(sessionId, session.lms_course_id, logId).run();
  return (res.meta?.changes ?? 0) > 0;
}
