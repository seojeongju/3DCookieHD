const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function normalizeTrainingDate(d: string | null | undefined): string {
  return (d || '').toString().substring(0, 10);
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

const DAY_NAME_TO_NUM: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

export function generateWeekdayTrainingDates(start: string, end: string): string[] {
  return generateTrainingDatesFromDaysOfWeek(start, end, '월,화,수,목,금');
}

/** 회차 days_of_week(예: "토,일") 기준 훈련일 생성 */
export function generateTrainingDatesFromDaysOfWeek(
  start: string,
  end: string,
  daysOfWeek: string | null | undefined
): string[] {
  const allowedDays = (daysOfWeek || '')
    .split(',')
    .map((s) => s.trim())
    .map((s) => DAY_NAME_TO_NUM[s])
    .filter((n): n is number => n !== undefined);

  if (allowedDays.length === 0) return [];

  const dates: string[] = [];
  const startD = new Date(start);
  const endD = new Date(end);
  if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return dates;

  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
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

/** session_timetable 기반 훈련일 목록 (운영기간 내로 제한, 없으면 평일 fallback) */
export async function getSessionTrainingDates(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined,
  daysOfWeek?: string | null
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
  const dates = (results || [])
    .map((r: { training_date?: string }) => normalizeTrainingDate(r.training_date))
    .filter(Boolean);

  if (dates.length > 0) return dates;
  if (start && end) {
    const fromDays = generateTrainingDatesFromDaysOfWeek(start, end, daysOfWeek);
    if (fromDays.length > 0) return fromDays;
    return generateWeekdayTrainingDates(start, end);
  }
  return [];
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

/** 훈련일지용: 시간표 훈련일 + 기존 일지 날짜(과거 일지 유지) */
export async function getSessionTrainingDatesForLogs(
  DB: D1Database,
  sessionId: number,
  trainingStart: string | null | undefined,
  trainingEnd: string | null | undefined,
  daysOfWeek: string | null | undefined,
  lmsCourseId: number | null | undefined
): Promise<string[]> {
  const timetableDates = await getSessionTrainingDates(
    DB,
    sessionId,
    trainingStart,
    trainingEnd,
    daysOfWeek
  );
  if (!lmsCourseId) return timetableDates;

  const logDates = await getTrainingLogDatesForCourse(DB, lmsCourseId);
  return mergeTrainingDates([timetableDates, logDates]);
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
