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

const TODAY = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export function getEffectiveSessionStatus(session: SessionLike, asOfDate?: string): string {
  const dbStatus = (session.status || '').trim().toLowerCase();
  const start = session.training_start_date ? String(session.training_start_date).trim().slice(0, 10) : null;
  const end = session.training_end_date ? String(session.training_end_date).trim().slice(0, 10) : null;
  const today = asOfDate ? asOfDate.slice(0, 10) : TODAY();

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
