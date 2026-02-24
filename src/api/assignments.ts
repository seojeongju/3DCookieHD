import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { resolveSessionToLmsCourseId } from '../utils/sessionCourseResolution';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// 과제 목록 조회 (과정별 또는 HRD 회차별)
app.get('/courses/:courseId', async (c) => {
    try {
        const courseId = c.req.param('courseId');
        const type = (c.req.query('type') || '').toLowerCase();
        const isHrd = type === 'hrd';

        let query = `
            SELECT a.*, u.name as teacher_name,
                   COUNT(DISTINCT s.id) as submission_count,
                   COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_count
            FROM assignments a
            LEFT JOIN users u ON a.teacher_id = u.id
            LEFT JOIN assignment_submissions s ON a.id = s.assignment_id
            WHERE ${isHrd ? 'a.session_id = ?' : 'a.course_id = ?'}
            GROUP BY a.id
            ORDER BY a.due_date DESC
        `;
        let { results } = await c.env.DB.prepare(query).bind(courseId).all();

        // Fallback: If HRD and no results, check if courseId is actually an approved_course_id
        if (isHrd && (!results || results.length === 0)) {
            const latestSession = await c.env.DB.prepare(
                'SELECT id FROM course_sessions WHERE approved_course_id = ? ORDER BY session_number DESC, id DESC LIMIT 1'
            ).bind(courseId).first<{ id: number }>();

            if (latestSession) {
                results = (await c.env.DB.prepare(query).bind(latestSession.id).all()).results;
            }
        }

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch assignments:', e);
        return c.json({ success: false, error: 'Failed to fetch assignments' }, 500);
    }
});

// 학생별 과제 목록 조회
app.get('/student/:studentId', async (c) => {
    try {
        const studentId = c.req.param('studentId');
        const { results } = await c.env.DB.prepare(`
            SELECT a.*, c.title as course_title,
                   s.id as submission_id, s.submitted_at, s.score, s.status, s.feedback
            FROM assignments a
            JOIN courses c ON a.course_id = c.id
            JOIN course_enrollments e ON c.id = e.course_id
            LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
            WHERE e.student_id = ? AND e.status = 'approved'
            ORDER BY a.due_date DESC
        `).bind(studentId, studentId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch student assignments:', e);
        return c.json({ success: false, error: 'Failed to fetch assignments' }, 500);
    }
});

// 과제 등록 (일반 과정 course_id / HRD 회차 session_id)
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { course_id, session_id, teacher_id, title, description, due_date, max_score, attachment_url } = body;
        const type = (body.type || '').toLowerCase();
        const isHrd = type === 'hrd';

        let courseId: number | null;
        let sessionId: number | null = null;

        if (isHrd) {
            sessionId = session_id != null ? Number(session_id) : (course_id != null ? Number(course_id) : null);
            if (sessionId == null || isNaN(sessionId)) {
                return c.json({ success: false, error: 'HRD 과제 등록 시 회차(session_id)가 필요합니다.' }, 400);
            }
            courseId = await resolveSessionToLmsCourseId(c.env.DB, sessionId);
            if (courseId == null) {
                return c.json({ success: false, error: '해당 회차에 연결된 LMS 과정이 없습니다. 훈련일지 등에서 과정 연결을 먼저 해주세요.' }, 400);
            }
        } else {
            courseId = course_id != null ? Number(course_id) : null;
            if (courseId == null || isNaN(courseId)) {
                return c.json({ success: false, error: '과정(course_id)이 필요합니다.' }, 400);
            }
        }

        const result = await c.env.DB.prepare(`
            INSERT INTO assignments (course_id, session_id, teacher_id, title, description, due_date, max_score, attachment_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(courseId, sessionId, teacher_id ?? null, title, description || null, due_date, max_score ?? 100, attachment_url || null).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create assignment:', e);
        return c.json({ success: false, error: 'Failed to create assignment' }, 500);
    }
});

// 과제 수정 (teacher_id 포함 — 배정 해제 시 null 가능)
app.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { title, description, due_date, max_score, attachment_url, teacher_id } = body;

        const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
        const params: any[] = [];
        if (title !== undefined) { updates.push('title = ?'); params.push(title); }
        if (description !== undefined) { updates.push('description = ?'); params.push(description); }
        if (due_date !== undefined) { updates.push('due_date = ?'); params.push(due_date); }
        if (max_score !== undefined) { updates.push('max_score = ?'); params.push(max_score); }
        if (attachment_url !== undefined) { updates.push('attachment_url = ?'); params.push(attachment_url); }
        if (teacher_id !== undefined) { updates.push('teacher_id = ?'); params.push(teacher_id === '' || teacher_id === null ? null : teacher_id); }
        if (params.length === 0) {
            return c.json({ success: false, error: 'No fields to update' }, 400);
        }
        params.push(id);
        await c.env.DB.prepare(`
            UPDATE assignments SET ${updates.join(', ')} WHERE id = ?
        `).bind(...params).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update assignment:', e);
        return c.json({ success: false, error: 'Failed to update assignment' }, 500);
    }
});

// 과제 삭제
app.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM assignments WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete assignment:', e);
        return c.json({ success: false, error: 'Failed to delete assignment' }, 500);
    }
});

// 과제 제출
app.post('/:assignmentId/submit', async (c) => {
    try {
        const assignmentId = c.req.param('assignmentId');
        const body = await c.req.json();
        const { student_id, content, attachment_url } = body;

        // 마감일 확인
        const assignment = await c.env.DB.prepare('SELECT due_date FROM assignments WHERE id = ?')
            .bind(assignmentId).first();

        const isLate = new Date() > new Date(assignment.due_date as string);
        const status = isLate ? 'late' : 'submitted';

        // 기존 제출 확인
        const existing = await c.env.DB.prepare(
            'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?'
        ).bind(assignmentId, student_id).first();

        if (existing) {
            // 업데이트
            await c.env.DB.prepare(`
                UPDATE assignment_submissions 
                SET content = ?, attachment_url = ?, submitted_at = CURRENT_TIMESTAMP, status = ?
                WHERE id = ?
            `).bind(content, attachment_url, status, existing.id).run();

            return c.json({ success: true, data: { id: existing.id } });
        } else {
            // 신규 제출
            const result = await c.env.DB.prepare(`
                INSERT INTO assignment_submissions (assignment_id, student_id, content, attachment_url, status)
                VALUES (?, ?, ?, ?, ?)
            `).bind(assignmentId, student_id, content, attachment_url, status).run();

            return c.json({ success: true, data: { id: result.meta.last_row_id } });
        }
    } catch (e) {
        console.error('Failed to submit assignment:', e);
        return c.json({ success: false, error: 'Failed to submit assignment' }, 500);
    }
});

// 과제 제출 목록 조회
app.get('/:assignmentId/submissions', async (c) => {
    try {
        const assignmentId = c.req.param('assignmentId');
        const { results } = await c.env.DB.prepare(`
            SELECT s.*, u.name as student_name, u.email as student_email
            FROM assignment_submissions s
            JOIN users u ON s.student_id = u.id
            WHERE s.assignment_id = ?
            ORDER BY s.submitted_at DESC
        `).bind(assignmentId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch submissions:', e);
        return c.json({ success: false, error: 'Failed to fetch submissions' }, 500);
    }
});

// 과제 채점
app.post('/submissions/:submissionId/grade', async (c) => {
    try {
        const submissionId = c.req.param('submissionId');
        const body = await c.req.json();
        const { score, feedback, graded_by } = body;

        await c.env.DB.prepare(`
            UPDATE assignment_submissions 
            SET score = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP, graded_by = ?, status = 'graded'
            WHERE id = ?
        `).bind(score, feedback, graded_by, submissionId).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to grade submission:', e);
        return c.json({ success: false, error: 'Failed to grade submission' }, 500);
    }
});

export default app;
