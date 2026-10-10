/**
 * 훈련생 여정 상태 자동 전환
 * - 집중 훈련(learning) 훈련생이 배정된 회차(폐강 제외)가 모두 종료되면 수료 완료(completed)로 전환
 * - 회차 종료 판정은 회차 유효 상태(종료일 다음 날부터 종료, 관리자 수동 종료 포함)와 동일
 * - 중도탈락·취업·상담·등록 상태와 관리자가 직접 지정한 수료 완료는 건드리지 않음
 *   (재수강 시 learning 전환은 회차 배정 API가 담당)
 */
import { sqlWhereEffectiveStatusEquals } from './course_session_status';

type D1Like = { prepare: (sql: string) => { bind: (...v: unknown[]) => { run: () => Promise<unknown> } } };

const ENDED_SESSION_SQL = sqlWhereEffectiveStatusEquals('cs', 'completed');

/**
 * @param userIds 지정 시 해당 훈련생만, 생략 시 전체 훈련생 대상
 */
export async function syncStudentCompletionStatus(DB: D1Like, userIds?: Array<number | string>): Promise<void> {
  const ids = (userIds ?? []).map((v) => Number(v)).filter((v) => Number.isInteger(v) && v > 0);
  if (userIds && ids.length === 0) return;
  const userFilter = userIds ? ` AND user_id IN (${ids.map(() => '?').join(',')})` : '';

  await DB.prepare(`
    UPDATE hrd_student_details
    SET status = 'completed', updated_at = CURRENT_TIMESTAMP
    WHERE status = 'learning'${userFilter}
      AND user_id IN (
        SELECT cse.user_id
        FROM course_session_enrollments cse
        JOIN course_sessions cs ON cs.id = cse.session_id
        WHERE cse.status IN ('enrolled', 'approved') AND cs.status <> 'closed'
        GROUP BY cse.user_id
        HAVING SUM(CASE WHEN ${ENDED_SESSION_SQL} THEN 0 ELSE 1 END) = 0
      )
  `).bind(...ids).run();
}
