const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const DAY_NAME_TO_NUM: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

export function normalizeTrainingDate(d: string | null | undefined): string {
  return (d || '').toString().substring(0, 10);
}

function parseLocalDateFromYmd(dateStr: string): Date | null {
  const normalized = normalizeTrainingDate(dateStr);
  const parts = normalized.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(day)) return null;
  return new Date(y, m, day);
}

/** days_of_week 문자열 정규화 (토요일→토, 공백 제거 등) */
export function normalizeDaysOfWeek(daysOfWeek: string | null | undefined): string {
  const alias: Record<string, string> = {
    일요일: '일', 월요일: '월', 화요일: '화', 수요일: '수', 목요일: '목', 금요일: '금', 토요일: '토',
    sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토',
  };
  return (daysOfWeek || '')
    .split(/[,/|]/)
    .map((s) => s.trim())
    .map((s) => alias[s.toLowerCase()] || alias[s] || s)
    .filter((s) => DAY_NAME_TO_NUM[s] !== undefined)
    .join(',');
}

export function inferDaysOfWeekFromSessionMeta(
  daysOfWeek: string | null | undefined,
  sessionName: string | null | undefined,
  timetableWeekdays?: number[]
): string {
  const normalized = normalizeDaysOfWeek(daysOfWeek);
  if (normalized) return normalized;
  const name = (sessionName || '').toString();
  if (/주말/.test(name)) return '토,일';
  if (timetableWeekdays && timetableWeekdays.length > 0) {
    const numToDay = ['일', '월', '화', '수', '목', '금', '토'];
    return timetableWeekdays.map((n) => numToDay[n]).filter(Boolean).join(',');
  }
  return '';
}

export function isDateInTrainingRange(
  date: string,
  start: string | null | undefined,
  end: string | null | undefined
): boolean {
  const d = normalizeTrainingDate(date);
  if (!d) return false;
  const s = normalizeTrainingDate(start);
  const e = normalizeTrainingDate(end);
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
}

export function filterDatesByTrainingRange(
  dates: string[],
  start: string | null | undefined,
  end: string | null | undefined
): string[] {
  return dates.filter((d) => isDateInTrainingRange(d, start, end));
}

export function generateWeekdayTrainingDates(start: string, end: string): string[] {
  return generateTrainingDatesFromDaysOfWeek(start, end, '월,화,수,목,금');
}

/** 회차 days_of_week(예: "토,일") 기준 훈련일 생성 */
export function generateTrainingDatesFromDaysOfWeek(
  start: string,
  end: string,
  daysOfWeek: string | null | undefined
): string[] {
  const allowedDays = normalizeDaysOfWeek(daysOfWeek)
    .split(',')
    .map((s) => s.trim())
    .map((s) => DAY_NAME_TO_NUM[s])
    .filter((n): n is number => n !== undefined);

  if (allowedDays.length === 0) return [];

  const startD = parseLocalDateFromYmd(start);
  const endD = parseLocalDateFromYmd(end);
  if (!startD || !endD) return [];

  const dates: string[] = [];
  for (let d = new Date(startD.getTime()); d <= endD; d.setDate(d.getDate() + 1)) {
    if (!allowedDays.includes(d.getDay())) continue;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${dayNum}`);
  }
  return dates;
}

export function mergeTrainingDates(...lists: string[][]): string[] {
  const merged = new Set<string>();
  for (const list of lists) {
    for (const d of list) {
      const normalized = normalizeTrainingDate(d);
      if (normalized) merged.add(normalized);
    }
  }
  return Array.from(merged).sort();
}

export type TrainingDayLabel = {
  dayNumber: number;
  date: string;
  dateShort: string;
  dayOfWeek: string;
};

export function datesToTrainingDayLabels(dates: string[]): TrainingDayLabel[] {
  return dates.map((d, i) => {
    const [y, m, day] = d.split('-');
    const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(day, 10));
    return {
      dayNumber: i + 1,
      date: d,
      dateShort: `${parseInt(m, 10)}/${parseInt(day, 10)}`,
      dayOfWeek: DAY_NAMES[dateObj.getDay()],
    };
  });
}

/** session_timetable에 등록된 훈련일 (운영기간 내) */
export async function getTimetableTrainingDates(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined
): Promise<string[]> {
  const start = normalizeTrainingDate(trainingStart);
  const end = normalizeTrainingDate(trainingEnd);

  let query = `
    SELECT DISTINCT training_date FROM session_timetable
    WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
  `;
  const binds: (number | string)[] = [sessionId];
  if (start) {
    query += ' AND training_date >= ?';
    binds.push(start);
  }
  if (end) {
    query += ' AND training_date <= ?';
    binds.push(end);
  }
  query += ' ORDER BY training_date ASC';

  const { results } = await DB.prepare(query).bind(...binds).all();
  return (results || [])
    .map((r: { training_date?: string }) => normalizeTrainingDate(r.training_date))
    .filter(Boolean);
}

/** 운영기간 + 요일 패턴으로 전체 훈련일 생성 */
export function generateScheduledTrainingDates(
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined,
  daysOfWeek?: string | null
): string[] {
  const start = normalizeTrainingDate(trainingStart);
  const end = normalizeTrainingDate(trainingEnd);
  if (!start || !end) return [];

  const fromDays = generateTrainingDatesFromDaysOfWeek(start, end, daysOfWeek);
  if (fromDays.length > 0) return fromDays;
  return generateWeekdayTrainingDates(start, end);
}

/** session_timetable 기반 훈련일 목록 (운영기간 내로 제한, 없으면 평일 fallback) */
export async function getSessionTrainingDates(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined,
  daysOfWeek?: string | null
): Promise<string[]> {
  const dates = await getTimetableTrainingDates(DB, sessionId, trainingStart, trainingEnd);
  if (dates.length > 0) return dates;
  return generateScheduledTrainingDates(trainingStart, trainingEnd, daysOfWeek);
}

export async function getTrainingLogDatesForCourse(
  DB: D1Database,
  lmsCourseId: number
): Promise<string[]> {
  const { results } = await DB.prepare(
    `SELECT DISTINCT date FROM training_logs WHERE course_id = ? ORDER BY date ASC`
  ).bind(lmsCourseId).all();
  return (results || [])
    .map((r: { date?: string }) => normalizeTrainingDate(r.date))
    .filter(Boolean);
}

export async function getTimetableWeekdays(
  DB: D1Database,
  sessionId: number
): Promise<number[]> {
  const { results } = await DB.prepare(`
    SELECT DISTINCT CAST(strftime('%w', training_date) AS INTEGER) AS dow
    FROM session_timetable
    WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
  `).bind(sessionId).all();
  return (results || [])
    .map((r: { dow?: number }) => Number(r.dow))
    .filter((n) => !isNaN(n) && n >= 0 && n <= 6);
}

/** 훈련일지용: 운영기간 전체 훈련일 + 시간표일 + 기존 일지 날짜 */
export async function getSessionTrainingDatesForLogs(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined,
  daysOfWeek: string | null | undefined,
  lmsCourseId: number | null | undefined,
  sessionName?: string | null
): Promise<string[]> {
  let start = normalizeTrainingDate(trainingStart);
  let end = normalizeTrainingDate(trainingEnd);

  const timetableDates = await getTimetableTrainingDates(DB, sessionId, start || null, end || null);
  if ((!start || !end) && timetableDates.length > 0) {
    if (!start) start = timetableDates[0];
    if (!end) end = timetableDates[timetableDates.length - 1];
  }

  const timetableWeekdays = await getTimetableWeekdays(DB, sessionId);
  const effectiveDays = inferDaysOfWeekFromSessionMeta(daysOfWeek, sessionName, timetableWeekdays);
  const scheduledDates = generateScheduledTrainingDates(start, end, effectiveDays);
  const logDates = lmsCourseId ? await getTrainingLogDatesForCourse(DB, lmsCourseId) : [];

  // 훈련일지 작성: 운영기간 내 전체 훈련일 표시 (공강 excluded_dates는 드롭다운에서 제외하지 않음)
  return mergeTrainingDates([scheduledDates, timetableDates, logDates]);
}

/** 운영기간 변경 시 범위 밖 시간표 정리 (출결·훈련일지는 삭제하지 않음) */
export async function pruneTimetableOutsideRange(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined
): Promise<void> {
  const start = normalizeTrainingDate(trainingStart);
  const end = normalizeTrainingDate(trainingEnd);
  if (!start && !end) return;

  let query = 'DELETE FROM session_timetable WHERE session_id = ?';
  const binds: (number | string)[] = [sessionId];
  if (start) {
    query += ' AND training_date < ?';
    binds.push(start);
  }
  if (end) {
    query += ' AND training_date > ?';
    binds.push(end);
  }
  await DB.prepare(query).bind(...binds).run();
}
