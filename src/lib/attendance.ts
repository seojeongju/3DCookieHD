/**
 * 출석률 계산 공통 유틸리티
 *
 * courses.ts / hrd.ts 등 모든 출석 관리에서 동일한 로직을 사용하기 위한 함수들.
 * 일일 수업 분 계산 및 출석 상태별 인정 분 계산을 담당한다.
 */

/**
 * 'HH:MM' 형식 시간 문자열을 분(number)으로 변환
 */
function timeToMinutes(t: string): number {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

/**
 * 실제 일일 수업 분 계산
 *
 * training_time_start / training_time_end 차이를 우선 사용.
 * 두 값이 없으면 daily_hours × 60 으로 fallback.
 *
 * @example
 * calcActualDailyMinutes('19:00', '22:30', 6) // → 210 (3.5h)
 * calcActualDailyMinutes('',      '',      6) // → 360 (6h, fallback)
 */
export function calcActualDailyMinutes(
    trainingStart: string | undefined | null,
    trainingEnd: string | undefined | null,
    dailyHours = 0
): number {
    if (trainingStart && trainingEnd) {
        const diff = timeToMinutes(trainingEnd) - timeToMinutes(trainingStart);
        return diff > 0 ? diff : 0;
    }
    return dailyHours * 60;
}

/**
 * 출석 상태 및 실제 체크인/아웃 시간 기반 출석 인정 분 계산
 *
 * | status          | 계산 방식                                                     |
 * |-----------------|---------------------------------------------------------------|
 * | present         | actualDailyMinutes 전체                                      |
 * | public_leave    | actualDailyMinutes 전체 (공가 = 출석 인정)                   |
 * | absent          | 0분                                                          |
 * | absent_under_50 | 0분                                                          |
 * | late            | max(checkIn, trainingStart) ~ trainingEnd (지각 시간 공제)   |
 * | early_leave     | trainingStart ~ min(checkOut, trainingEnd) (조퇴 시간 공제)  |
 * | late_and_early  | max(checkIn, trainingStart) ~ min(checkOut, trainingEnd)     |
 *
 * @param status            출석 상태
 * @param checkIn           실제 입실 시간 'HH:MM' (없으면 수업 시작으로 간주)
 * @param checkOut          실제 퇴실 시간 'HH:MM' (없으면 수업 종료로 간주)
 * @param trainingStart     수업 시작 시간 'HH:MM'
 * @param trainingEnd       수업 종료 시간 'HH:MM'
 * @param actualDailyMinutes 실제 일일 수업 분 (trainingEnd − trainingStart)
 */
export function calcAttendedMinutes(
    status: string | undefined | null,
    checkIn: string | undefined | null,
    checkOut: string | undefined | null,
    trainingStart: string,
    trainingEnd: string,
    actualDailyMinutes: number
): number {
    // ── 결석 ──────────────────────────────────────────────────────────────
    if (status === 'absent' || status === 'absent_under_50') return 0;

    // ── 정상 / 공가 / 상태 없음 ───────────────────────────────────────────
    if (!status || status === 'present' || status === 'public_leave') {
        return actualDailyMinutes;
    }

    // ── 지각 / 조퇴 / 지각&조퇴 ─────────────────────────────────────────
    // check_in 없으면 수업 시작, check_out 없으면 수업 종료로 간주
    const startMin = timeToMinutes(trainingStart);
    const endMin = timeToMinutes(trainingEnd);
    const inMin = checkIn ? timeToMinutes(checkIn) : startMin;
    const outMin = checkOut ? timeToMinutes(checkOut) : endMin;

    // 훈련 시간 범위(start ~ end) 내로 클램핑
    const effectiveIn = Math.max(inMin, startMin);
    const effectiveOut = Math.min(outMin, endMin);

    return Math.max(0, Math.min(effectiveOut - effectiveIn, actualDailyMinutes));
}
