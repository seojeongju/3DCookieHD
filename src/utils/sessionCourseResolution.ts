/**
 * 회차(session) ID → LMS 과정(courses.id) 해석 (과제/훈련일지/시험/상담 등 공통)
 * - 과정명 풀네임만 매칭, 회차별 1:1 LMS 과정 (다른 회차에 연결된 과정은 사용하지 않음)
 */
export async function resolveSessionToLmsCourseId(DB: any, id: string | number): Promise<number | null> {
    const rawId = parseInt(String(id), 10);
    if (isNaN(rawId)) return null;

    const existsInCourses = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
    if (existsInCourses) return rawId;

    const session: any = await DB.prepare(`
        SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
        FROM course_sessions s
        JOIN approved_courses a ON s.approved_course_id = a.id
        WHERE s.id = ?
    `).bind(rawId).first();

    if (!session) return null;

    const expectedTitle = `${session.course_name || '과정'} (${session.session_number}회차${session.session_name ? ' - ' + session.session_name : ''})`.trim();

    let resolved: number | null = null;

    if (session.lms_course_id != null && session.lms_course_id > 0) {
        const existingCourse: any = await DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(session.lms_course_id).first();
        const titleMatches = existingCourse && existingCourse.title != null && (
            String(existingCourse.title).trim() === expectedTitle ||
            String(existingCourse.title).trim() === `${session.course_name || '과정'} (${session.session_number}회차)`.trim()
        );
        const otherSession: any = await DB.prepare(
            'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
        ).bind(session.lms_course_id, rawId).first();
        if (titleMatches && !otherSession) {
            resolved = Number(session.lms_course_id);
        } else if (existingCourse || otherSession) {
            try {
                await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, rawId).run();
            } catch (_) {}
        }
    }

    if (resolved == null) {
        const lmsCourse: any = await DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(expectedTitle).first();
        if (lmsCourse) {
            const otherSession: any = await DB.prepare(
                'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
            ).bind(lmsCourse.id, rawId).first();
            if (!otherSession) {
                resolved = lmsCourse.id;
                try {
                    await DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolved, rawId).run();
                } catch (_) {}
            }
        }
    }

    return resolved;
}

export type TrainingLogSessionRow = {
    id: number;
    status?: string;
    training_start_date?: string;
    training_end_date?: string;
    days_of_week?: string | null;
    excluded_dates?: string | null;
    session_name?: string | null;
};

const TRAINING_LOG_SESSION_SELECT = `
    SELECT s.id, s.status, s.training_start_date, s.training_end_date, s.days_of_week, s.excluded_dates, s.session_name, s.lms_course_id
    FROM course_sessions s
`;

/**
 * LMS courses.id / session_id / course_sessions.id 혼동 방지
 * - URL path의 courses.id(예: 25)와 course_sessions.id(예: 25)가 겹치면 lms_course_id 연결 회차를 우선
 */
export async function resolveTrainingLogSession(
    DB: D1Database,
    courseIdParam: string | number,
    sessionIdParam?: string | number | null
): Promise<TrainingLogSessionRow | null> {
    const rawId = parseInt(String(courseIdParam), 10);
    if (isNaN(rawId) || rawId < 1) return null;

    const explicitSid = sessionIdParam != null && String(sessionIdParam).trim() !== ''
        ? parseInt(String(sessionIdParam), 10)
        : NaN;

    const inCourses = await DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();

    if (inCourses) {
        if (Number.isFinite(explicitSid) && explicitSid >= 1) {
            const linked = await DB.prepare(
                `${TRAINING_LOG_SESSION_SELECT} WHERE s.id = ? AND s.lms_course_id = ?`
            ).bind(explicitSid, rawId).first() as TrainingLogSessionRow | null;
            if (linked) return linked;
        }
        const byLms = await DB.prepare(
            `${TRAINING_LOG_SESSION_SELECT} WHERE s.lms_course_id = ? ORDER BY COALESCE(s.session_number, 999999) DESC, s.id DESC LIMIT 1`
        ).bind(rawId).first() as TrainingLogSessionRow | null;
        if (byLms) return byLms;
    }

    if (Number.isFinite(explicitSid) && explicitSid >= 1) {
        const byExplicit = await DB.prepare(
            `${TRAINING_LOG_SESSION_SELECT} WHERE s.id = ?`
        ).bind(explicitSid).first() as TrainingLogSessionRow | null;
        if (byExplicit) return byExplicit;
    }

    const bySessionPk = await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.id = ?`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
    if (bySessionPk) return bySessionPk;

    const byApproved = await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.approved_course_id = ? ORDER BY s.session_number DESC, s.id DESC LIMIT 1`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
    if (byApproved) return byApproved;

    return await DB.prepare(
        `${TRAINING_LOG_SESSION_SELECT} WHERE s.lms_course_id = ? ORDER BY COALESCE(s.session_number, 999999) ASC, s.id ASC LIMIT 1`
    ).bind(rawId).first() as TrainingLogSessionRow | null;
}
