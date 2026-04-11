/**
 * LMS 개설 과정(`courses.id`)·회차(`course_sessions.id`)·승인과정(`approved_courses.id`)은
 * 서로 다른 엔터티이나 PK 숫자가 겹칠 수 있다.
 *
 * 규칙 (LMS HRD 경로):
 * - URL·쿼리의 `course_id`가 LMS 개설 과정이면 `courses.id`로만 해석한다.
 * - 해당 회차는 반드시 `course_sessions.lms_course_id = courses.id` 로만 확정한다.
 * - 제목·승인과정명 LIKE 등으로 회차를 추정하지 않는다 (잘못된 회차 PK가 선택되는 근본 원인).
 *
 * 이 모듈의 함수는 위 규칙을 한곳에서만 정의한다.
 */

/** `courses` 테이블에 등록된 LMS 개설 과정 PK인지 */
export async function isRegisteredLmsCourseId(db: D1Database, courseId: number): Promise<boolean> {
    if (!Number.isFinite(courseId) || courseId < 1) return false;
    try {
        const r = await db.prepare('SELECT 1 AS o FROM courses WHERE id = ?').bind(courseId).first<{ o?: number }>();
        return !!(r && r.o);
    } catch {
        return false;
    }
}

/**
 * LMS `courses.id`에 연결된 최신 회차 1건 (`session_number`·`id` 내림차순).
 * `lms_course_id` 미설정 시 null (추정 조회 없음).
 */
export async function getLatestCourseSessionRowForLmsCourseId(
    db: D1Database,
    lmsCourseId: number
): Promise<LmsLinkedSessionRow | null> {
    if (!Number.isFinite(lmsCourseId) || lmsCourseId < 1) return null;
    try {
        const row = await db
            .prepare(
                `SELECT id, approved_course_id, instructor_name, lms_course_id, session_number
                 FROM course_sessions
                 WHERE lms_course_id = ?
                 ORDER BY session_number DESC, id DESC
                 LIMIT 1`
            )
            .bind(lmsCourseId)
            .first<LmsLinkedSessionRow>();
        return row ?? null;
    } catch {
        return null;
    }
}

export type LmsLinkedSessionRow = {
    id: number;
    approved_course_id: number;
    instructor_name: string | null;
    lms_course_id: number | null;
    session_number: number | null;
};

/** 시간표 API 등에서 쓰는 최소 회차 헤더 — `lms_course_id` 로만 조회 */
export async function getCourseSessionTimetableHeaderByLmsCourseId(
    db: D1Database,
    lmsCourseId: number
): Promise<{ id: number; approved_course_id: number; instructor_name: string | null } | null> {
    if (!Number.isFinite(lmsCourseId) || lmsCourseId < 1) return null;
    try {
        const row = await db
            .prepare(
                `SELECT id, approved_course_id, instructor_name FROM course_sessions
                 WHERE lms_course_id = ?
                 ORDER BY session_number DESC, id DESC
                 LIMIT 1`
            )
            .bind(lmsCourseId)
            .first<{ id: number; approved_course_id: number; instructor_name: string | null }>();
        return row ?? null;
    } catch {
        return null;
    }
}

/**
 * `ncs_plan_documents.course_id` 후보 ID 목록 — LMS 개설 과정 ID일 때만 사용.
 * 문서에 session PK 또는 순수 LMS 키가 섞여 저장될 수 있어 `courses.id` + 해당 `lms_course_id` 회차들을 합친다.
 */
export async function resolveNcsPlanDocumentCourseIdsForLmsCourse(
    db: D1Database,
    lmsCourseId: number
): Promise<number[]> {
    const ids = new Set<number>();
    if (!Number.isFinite(lmsCourseId) || lmsCourseId < 1) return [];

    ids.add(lmsCourseId);
    try {
        const { results } = await db
            .prepare('SELECT id FROM course_sessions WHERE lms_course_id = ?')
            .bind(lmsCourseId)
            .all();
        for (const r of results || []) {
            const sid = parseInt(String((r as { id?: unknown }).id), 10);
            if (Number.isFinite(sid) && sid >= 1) ids.add(sid);
        }
    } catch {
        /* ignore */
    }
    return [...ids];
}

/**
 * LMS 개설 과정 ID로 평가계획 문서를 찾을 때 `course_id IN (...)` 만 쓰면
 * `courses.id` 와 `course_sessions.id` 가 같은 숫자일 때 엉뚱한 행이 섞인다.
 * - 회차 PK 로 저장: 해당 회차의 `lms_course_id` 가 요청 LMS 와 일치
 * - LMS id 로만 저장: `course_id` 가 어느 회차 PK 와도 겹치지 않을 때(순수 LMS 키)
 */
export function sqlNcsPlanDocBelongsToLmsCourse(nAlias: string): string {
    return `(
      EXISTS (SELECT 1 FROM course_sessions s WHERE s.id = ${nAlias}.course_id AND s.lms_course_id = ?)
      OR (${nAlias}.course_id = ? AND NOT EXISTS (SELECT 1 FROM course_sessions s2 WHERE s2.id = ${nAlias}.course_id))
    )`;
}
