/**
 * 회차 수강 중도탈락 처리
 * - 중도 포기는 수강 기록을 지우지 않고 status='dropped' + 탈락일·사유로 남긴다 (출결 이력 보존)
 * - 회차를 떠난 뒤 훈련생 여정 상태(hrd_student_details.status)를 다시 계산한다
 */
import { syncStudentCompletionStatus } from './student_journey_status';

export const DROP_REASONS: Record<string, string> = {
  employment: '취업',
  personal: '개인 사정',
  attendance: '출석 미달',
  other: '기타',
};

let columnsReady = false;

export async function ensureEnrollmentDropColumns(DB: D1Database): Promise<void> {
  if (columnsReady) return;
  for (const col of ['dropped_at TEXT', 'drop_reason TEXT', 'drop_memo TEXT']) {
    try {
      await DB.prepare(`ALTER TABLE course_session_enrollments ADD COLUMN ${col}`).run();
    } catch (e) {
      if (!/duplicate column/i.test(String((e as Error)?.message ?? e))) throw e;
    }
  }
  columnsReady = true;
}

/** 회차 표시명 뒤에 붙일 중도탈락 표기 (별칭 cse) */
export const DROPPED_SUFFIX_SQL = `CASE WHEN cse.status = 'dropped'
  THEN ' · 중도탈락' || CASE WHEN cse.dropped_at IS NOT NULL THEN ' (' || cse.dropped_at || ')' ELSE '' END
  ELSE '' END`;

/**
 * 회차에서 빠진 뒤 여정 상태 재계산 (집중 훈련 상태일 때만 변경)
 * - 다른 수강 중 회차가 있으면 집중 훈련 유지 (모두 종료됐으면 수료 완료)
 * - 없으면 중도탈락 이력이 있으면 중도탈락, 아니면 등록·발급으로 되돌림
 */
export async function recomputeJourneyAfterLeave(DB: D1Database, userId: number): Promise<void> {
  const active = await DB.prepare(
    `SELECT COUNT(*) AS n FROM course_session_enrollments cse
     JOIN course_sessions cs ON cs.id = cse.session_id
     WHERE cse.user_id = ? AND cse.status IN ('enrolled', 'approved') AND cs.status <> 'closed'`,
  ).bind(userId).first<{ n: number }>();
  if (Number(active?.n ?? 0) > 0) {
    await syncStudentCompletionStatus(DB, [userId]);
    return;
  }
  const dropped = await DB.prepare(
    `SELECT 1 AS ok FROM course_session_enrollments WHERE user_id = ? AND status = 'dropped' LIMIT 1`,
  ).bind(userId).first();
  await DB.prepare(
    `UPDATE hrd_student_details SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'learning'`,
  ).bind(dropped ? 'dropout' : 'registered', userId).run();
}
