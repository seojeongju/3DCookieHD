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
