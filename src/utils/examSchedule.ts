export type ExamScheduleStatus = 'upcoming' | 'open' | 'ended';

/** 현재 한국시간(KST, UTC+9)을 YYYY-MM-DDTHH:MM:SS 문자열로 반환 */
export function getNowKstIso(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19);
}

/** DB의 start_time / end_time 값을 KST 기준 YYYY-MM-DDTHH:MM:SS 로 정규화 */
export function normalizeExamDateTime(val?: string | null): string | null {
  if (!val) return null;
  const s = String(val).trim().replace(' ', 'T');
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19);
}

/** 시험의 현재 응시 가능 상태 계산 ('upcoming' | 'open' | 'ended') */
export function getExamScheduleStatus(
  startTime?: string | null,
  endTime?: string | null,
  nowKst: string = getNowKstIso()
): ExamScheduleStatus {
  const st = normalizeExamDateTime(startTime);
  const et = normalizeExamDateTime(endTime);
  if (st && nowKst < st) return 'upcoming';
  if (et && nowKst > et) return 'ended';
  return 'open';
}

export function hasExamSchedule(startTime?: string | null, endTime?: string | null): boolean {
  return !!(normalizeExamDateTime(startTime) || normalizeExamDateTime(endTime));
}

/** 실행일시가 설정된 경우 현재 시각(KST) 기준으로 자동 활성 여부(1: 진행중, 0: 대기/마감) 반환 */
export function getEffectiveExamActive(
  isActive: unknown,
  startTime?: string | null,
  endTime?: string | null,
  nowKst: string = getNowKstIso()
): number {
  if (hasExamSchedule(startTime, endTime)) {
    return getExamScheduleStatus(startTime, endTime, nowKst) === 'open' ? 1 : 0;
  }
  return Number(isActive) ? 1 : 0;
}

