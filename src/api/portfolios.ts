import { Hono } from 'hono';
import type { Bindings, Variables } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// ============================================
// 포트폴리오 목록 조회 (공개 갤러리용)
// GET /api/portfolios
// ============================================
app.get('/', async (c) => {
    try {
        const { DB } = c.env;
        const category = c.req.query('category');
        const courseId = c.req.query('courseId');
        const teacherId = c.req.query('teacherId');
        const isFeatured = c.req.query('isFeatured');

        let query = `
            SELECT p.*, u.name as student_name, c.title as course_title
            FROM student_portfolios p
            JOIN users u ON p.student_id = u.id
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (category) {
            query += " AND p.category = ?";
            params.push(category);
        }
        if (courseId) {
            query += " AND p.course_id = ?";
            params.push(courseId);
        }
        if (teacherId) {
            query += " AND p.course_id IN (SELECT course_id FROM hrd_course_instructors WHERE instructor_id = ?)";
            params.push(teacherId);
        }
        if (isFeatured === 'true') {
            query += " AND p.is_featured = 1";
        }

        query += " ORDER BY p.created_at DESC";

        const { results } = await DB.prepare(query).bind(...params).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 내 포트폴리오 조회 (학생용)
// GET /api/portfolios/my
// ============================================
app.get('/my', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const user = c.get('user'); // authMiddleware sets this
        const studentId = user.userId;

        const query = `
            SELECT p.*, c.title as course_title
            FROM student_portfolios p
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE p.student_id = ?
            ORDER BY p.created_at DESC
        `;
        const { results } = await DB.prepare(query).bind(studentId).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 포트폴리오 등록
// POST /api/portfolios
// ============================================
app.post('/', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const user = c.get('user');
        const body = await c.req.json();
        const { title, description, thumbnail_url, content_url, category, course_id } = body;

        if (!title) return errorResponse(c, '제목은 필수입니다', 400);

        const result = await DB.prepare(`
            INSERT INTO student_portfolios (student_id, course_id, title, description, thumbnail_url, content_url, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(user.userId, course_id || null, title, description || null, thumbnail_url || null, content_url || null, category || 'other').run();

        return successResponse(c, { id: result.meta.last_row_id }, '포트폴리오가 등록되었습니다', 201);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 포트폴리오 수정
// PUT /api/portfolios/:id
// ============================================
app.put('/:id', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');
        const body = await c.req.json();
        const { title, description, thumbnail_url, content_url, category, course_id } = body;

        // 권한 확인 (본인 또는 관리자)
        const existing: any = await DB.prepare("SELECT student_id FROM student_portfolios WHERE id = ?").bind(id).first();
        if (!existing) return errorResponse(c, '포트폴리오를 찾을 수 없습니다', 404);
        if (existing.student_id !== user.userId && user.role !== 'admin') {
            return errorResponse(c, '권한이 없습니다', 403);
        }

        await DB.prepare(`
            UPDATE student_portfolios 
            SET title = ?, description = ?, thumbnail_url = ?, content_url = ?, category = ?, course_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(title, description, thumbnail_url, content_url, category, course_id || null, id).run();

        return successResponse(c, null, '포트폴리오가 수정되었습니다');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 포트폴리오 삭제
// DELETE /api/portfolios/:id
// ============================================
app.delete('/:id', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');

        // 권한 확인
        const existing: any = await DB.prepare("SELECT student_id FROM student_portfolios WHERE id = ?").bind(id).first();
        if (!existing) return errorResponse(c, '포트폴리오를 찾을 수 없습니다', 404);
        if (existing.student_id !== user.userId && user.role !== 'admin') {
            return errorResponse(c, '권한이 없습니다', 403);
        }

        await DB.prepare("DELETE FROM student_portfolios WHERE id = ?").bind(id).run();
        return successResponse(c, null, '포트폴리오가 삭제되었습니다');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 추천 포트폴리오 설정 (관리자 및 담당 강사)
// PATCH /api/portfolios/:id/featured
// ============================================
app.patch('/:id/featured', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');
        const { isFeatured } = await c.req.json();

        // 권한 확인
        if (user.role === 'admin') {
            // 관리자는 무조건 가능
        } else if (user.role === 'teacher') {
            // 강사는 본인이 담당하는 과정의 학생 것만 가능
            const check: any = await DB.prepare(`
                SELECT 1 FROM student_portfolios p
                JOIN hrd_course_instructors ci ON p.course_id = ci.course_id
                WHERE p.id = ? AND ci.instructor_id = ?
            `).bind(id, user.userId).first();
            if (!check) return errorResponse(c, '담당 과정의 학생이 아니거나 권한이 없습니다', 403);
        } else {
            return errorResponse(c, '권한이 없습니다', 403);
        }

        await DB.prepare("UPDATE student_portfolios SET is_featured = ? WHERE id = ?").bind(isFeatured ? 1 : 0, id).run();
        return successResponse(c, null, '추천 상태가 변경되었습니다');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

export default app;
