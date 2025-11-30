import { Hono } from 'hono';
import type { Bindings } from '../types';

const students = new Hono<{ Bindings: Bindings }>();

// GET /api/students - 전체 학생 목록 조회
students.get('/', async (c) => {
    try {
        const { search, status } = c.req.query();

        let query = `
            SELECT 
                u.id, u.name, u.email, u.phone, u.created_at,
                COUNT(DISTINCT e.id) as enrollment_count,
                COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) as completed_count,
                MAX(c.created_at) as last_contact_date
            FROM users u
            LEFT JOIN enrollments e ON u.id = e.user_id
            LEFT JOIN consultations c ON u.id = c.user_id
            WHERE u.role = 'student'
        `;

        const params: any[] = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// GET /api/students/:id - 특정 학생 상세 정보 조회
students.get('/:id', async (c) => {
    const studentId = c.req.param('id');

    try {
        // 1. 학생 기본 정보
        const student = await c.env.DB.prepare(`
            SELECT id, name, email, phone, profile_image, created_at
            FROM users
            WHERE id = ? AND role = 'student'
        `).bind(studentId).first();

        if (!student) {
            return c.json({ success: false, error: 'Student not found' }, 404);
        }

        // 2. 수강 이력
        const { results: enrollments } = await c.env.DB.prepare(`
            SELECT 
                e.id, e.status, e.progress, e.attendance, e.grade, 
                e.enrolled_at, e.completed_at,
                c.title as course_title, c.category, c.start_date, c.end_date
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
            ORDER BY e.enrolled_at DESC
        `).bind(studentId).all();

        // 3. 상담 이력
        const { results: consultations } = await c.env.DB.prepare(`
            SELECT 
                con.id, con.consultation_type, con.message, con.memo, 
                con.status, con.created_at, con.completed_date, con.updated_at,
                co.title as course_title,
                camp.name as campus_name,
                u.name as consultant_name
            FROM consultations con
            LEFT JOIN courses co ON con.course_id = co.id
            LEFT JOIN campuses camp ON con.campus_id = camp.id
            LEFT JOIN users u ON con.consultant_id = u.id
            WHERE con.user_id = ?
            ORDER BY con.created_at DESC
        `).bind(studentId).all();

        return c.json({
            success: true,
            data: {
                ...student,
                enrollments,
                consultations
            }
        });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// POST /api/students/:id/consultations - 학생에 대한 새 상담 기록 추가
students.post('/:id/consultations', async (c) => {
    const studentId = c.req.param('id');

    try {
        const body = await c.req.json();
        const { consultation_type, course_id, campus_id, message, memo, status, consultant_id } = body;

        // 학생 정보 확인
        const student = await c.env.DB.prepare(`
            SELECT name, email, phone FROM users WHERE id = ? AND role = 'student'
        `).bind(studentId).first();

        if (!student) {
            return c.json({ success: false, error: 'Student not found' }, 404);
        }

        // 상담 기록 추가
        const result = await c.env.DB.prepare(`
            INSERT INTO consultations (
                user_id, name, phone, email, campus_id, course_id,
                consultation_type, message, memo, status, consultant_id,
                completed_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            studentId,
            student.name,
            student.phone || '',
            student.email,
            campus_id || null,
            course_id || null,
            consultation_type || 'phone',
            message || '',
            memo || '',
            status || 'completed',
            consultant_id || null,
            status === 'completed' ? new Date().toISOString() : null
        ).run();

        return c.json({
            success: true,
            id: result.meta.last_row_id
        });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// PUT /api/students/:studentId/consultations/:consultationId - 상담 기록 수정
students.put('/:studentId/consultations/:consultationId', async (c) => {
    const consultationId = c.req.param('consultationId');

    try {
        const body = await c.req.json();
        const { memo, status, consultant_id, consultation_type, course_id } = body;

        await c.env.DB.prepare(`
            UPDATE consultations
            SET memo = ?, status = ?, consultant_id = ?, 
                consultation_type = ?, course_id = ?,
                completed_date = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            memo,
            status,
            consultant_id || null,
            consultation_type,
            course_id || null,
            status === 'completed' ? new Date().toISOString() : null,
            consultationId
        ).run();

        return c.json({ success: true });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// DELETE /api/students/:studentId/consultations/:consultationId - 상담 기록 삭제
students.delete('/:studentId/consultations/:consultationId', async (c) => {
    const consultationId = c.req.param('consultationId');

    try {
        await c.env.DB.prepare(`
            DELETE FROM consultations WHERE id = ?
        `).bind(consultationId).run();

        return c.json({ success: true });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// GET /api/consultations - 전체 상담 내역 조회 (관리자용)
students.get('/consultations/all', async (c) => {
    try {
        const { status, type, search } = c.req.query();

        let query = `
            SELECT 
                con.id, con.name, con.phone, con.email,
                con.consultation_type, con.message, con.memo, con.status,
                con.created_at, con.completed_date,
                co.title as course_title,
                camp.name as campus_name,
                u.name as consultant_name,
                student.name as student_name
            FROM consultations con
            LEFT JOIN courses co ON con.course_id = co.id
            LEFT JOIN campuses camp ON con.campus_id = camp.id
            LEFT JOIN users u ON con.consultant_id = u.id
            LEFT JOIN users student ON con.user_id = student.id
            WHERE 1=1
        `;

        const params: any[] = [];

        if (status) {
            query += ` AND con.status = ?`;
            params.push(status);
        }

        if (type) {
            query += ` AND con.consultation_type = ?`;
            params.push(type);
        }

        if (search) {
            query += ` AND (con.name LIKE ? OR con.phone LIKE ? OR con.email LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` ORDER BY con.created_at DESC LIMIT 200`;

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default students;
