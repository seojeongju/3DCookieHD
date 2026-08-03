/**
 * 훈련과정(회차) 상태: 개강일·종료일에 따라 유효 상태를 계산합니다.
 * - 오늘 < 개강일 → recruiting (모집중)
 * - 개강일 <= 오늘 <= 종료일 → in_progress (훈련중)
 * - 오늘 > 종료일 → completed (종료/마감)
 * - status가 closed(폐강)이면 항상 closed
 * - always_open은 종료일이 지나면 completed, 아니면 always_open
 */
export type SessionLike = {
  status: string;
  training_start_date?: string | null;
  training_end_date?: string | null;
};

/** 한국(Asia/Seoul) 기준 오늘 날짜 YYYY-MM-DD */
export function todayKST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** SQLite/D1용: UTC now + 9h ≈ KST 달력일 */
export const SQL_TODAY_KST = `date('now', '+9 hours')`;

export function getEffectiveSessionStatus(session: SessionLike, asOfDate?: string): string {
  const dbStatus = (session.status || '').trim().toLowerCase();
  const start = session.training_start_date ? String(session.training_start_date).trim().slice(0, 10) : null;
  const end = session.training_end_date ? String(session.training_end_date).trim().slice(0, 10) : null;
  const today = asOfDate ? asOfDate.slice(0, 10) : todayKST();

  if (dbStatus === 'closed') return 'closed';

  if (dbStatus === 'always_open') {
    if (end && today > end) return 'completed';
    return 'always_open';
  }

  if (start && today < start) return 'recruiting';
  if (end && today > end) return 'completed';
  if (start && end && today >= start && today <= end) return 'in_progress';
  if (start && !end && today >= start) return 'in_progress';
  if (!start && end && today <= end) return 'in_progress';

  return dbStatus || 'recruiting';
}

/**
 * 응답용 세션 객체에 effective status 적용 (status 필드를 유효 상태로 덮어씀)
 */
export function applyEffectiveStatus<T extends SessionLike>(row: T): T {
  return { ...row, status: getEffectiveSessionStatus(row) };
}

/**
 * 여러 행에 일괄 적용
 */
export function applyEffectiveStatusToList<T extends SessionLike>(rows: T[]): T[] {
  return rows.map((row) => applyEffectiveStatus(row));
}

/**
 * SQLite WHERE 절: getEffectiveSessionStatus(행) === target (개강일·종료일 기준, DB status만으로는 부족할 때 사용)
 * @param alias course_sessions 테이블 별칭 (예: s)
 */
export function sqlWhereEffectiveStatusEquals(alias: string, target: 'in_progress' | 'recruiting' | 'completed'): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  if (target === 'in_progress') {
    return `(
      ${a}.status <> 'closed'
      AND ${a}.status <> 'always_open'
      AND (
        (
          ${a}.training_start_date IS NOT NULL AND ${a}.training_end_date IS NOT NULL
          AND length(trim(${a}.training_start_date)) > 0 AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_start_date) <= ${today} AND date(${a}.training_end_date) >= ${today}
        )
        OR (
          ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
          AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
          AND date(${a}.training_start_date) <= ${today}
        )
        OR (
          (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
          AND ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_end_date) >= ${today}
        )
        OR (
          ${a}.status = 'in_progress'
          AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
          AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
        )
      )
    )`;
  }
  if (target === 'recruiting') {
    return `(
      ${a}.status <> 'closed'
      AND ${a}.status <> 'always_open'
      AND (
        (
          ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
          AND date(${a}.training_start_date) > ${today}
        )
        OR (
          ${a}.status = 'recruiting'
          AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
        )
      )
    )`;
  }
  // completed
  return `(
    ${a}.status <> 'closed'
    AND (
      (
        ${a}.status = 'always_open'
        AND ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
        AND date(${a}.training_end_date) < ${today}
      )
      OR (
        ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
        AND date(${a}.training_end_date) < ${today}
        AND NOT (
          ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
          AND date(${a}.training_start_date) > ${today}
        )
      )
    )
  )`;
}

/** 홈·공개 목록용: 모집중·진행중·상시모집(종료 전) */
export function sqlWhereEffectiveActive(alias: string): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  return `(
    ${sqlWhereEffectiveStatusEquals(a, 'recruiting')}
    OR ${sqlWhereEffectiveStatusEquals(a, 'in_progress')}
    OR (
      ${a}.status = 'always_open'
      AND (
        ${a}.training_end_date IS NULL
        OR length(trim(${a}.training_end_date)) = 0
        OR date(${a}.training_end_date) >= ${today}
      )
    )
  )`;
}
