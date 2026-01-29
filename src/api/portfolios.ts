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
        
        // teacher_feedback 필드 존재 여부 확인 및 추가
        try {
            await DB.prepare("SELECT teacher_feedback FROM student_portfolios LIMIT 1").first();
        } catch (e) {
            try {
                await DB.prepare("ALTER TABLE student_portfolios ADD COLUMN teacher_feedback TEXT").run();
            } catch (alterError) {
                // 필드 추가 실패해도 계속 진행
            }
        }
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
            // 강사가 담당하는 과정의 포트폴리오만 조회 (courses 테이블의 teacher_id 사용)
            query += " AND p.course_id IN (SELECT id FROM courses WHERE teacher_id = ?)";
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
// 학생: 본인만 등록. 강사/관리자: body.student_id 지정 가능.
// ============================================
app.post('/', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const user = c.get('user');
        const body = await c.req.json();
        const { title, description, thumbnail_url, content_url, category, course_id, student_id: bodyStudentId, teacher_feedback, is_featured } = body;

        if (!title) return errorResponse(c, '제목은 필수입니다', 400);

        let studentId: string = user.userId;

        if (user.role === 'admin') {
            if (bodyStudentId) studentId = bodyStudentId;
        } else if (user.role === 'teacher') {
            if (bodyStudentId) {
                const course = course_id
                    ? await DB.prepare('SELECT id, teacher_id FROM courses WHERE id = ?').bind(course_id).first() as { id: number; teacher_id: string | null } | null
                    : null;
                if (!course || course.teacher_id !== user.userId)
                    return errorResponse(c, '해당 과정에 대한 권한이 없습니다', 403);
                const enrolled = await DB.prepare(
                    'SELECT 1 FROM enrollments WHERE course_id = ? AND user_id = ? AND status = ?'
                ).bind(course_id, bodyStudentId, 'approved').first();
                if (!enrolled)
                    return errorResponse(c, '해당 과정의 수강생이 아닙니다', 403);
                studentId = bodyStudentId;
            }
        }

        const result = await DB.prepare(`
            INSERT INTO student_portfolios (student_id, course_id, title, description, thumbnail_url, content_url, category, teacher_feedback, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            studentId,
            course_id || null,
            title,
            description || null,
            thumbnail_url || null,
            content_url || null,
            category || 'other',
            teacher_feedback ?? null,
            is_featured ? 1 : 0
        ).run();

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
        const { title, description, thumbnail_url, content_url, category, course_id, teacher_feedback, is_featured } = body;

        // 권한 확인 (본인, 관리자, 또는 담당 강사)
        const existing: any = await DB.prepare(`
            SELECT p.student_id, p.course_id, c.teacher_id 
            FROM student_portfolios p
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE p.id = ?
        `).bind(id).first();
        if (!existing) return errorResponse(c, '포트폴리오를 찾을 수 없습니다', 404);
        
        let hasPermission = false;
        if (existing.student_id === user.userId || user.role === 'admin') {
            hasPermission = true;
        } else if (user.role === 'teacher' && existing.teacher_id === user.userId) {
            hasPermission = true;
        }
        
        if (!hasPermission) {
            return errorResponse(c, '권한이 없습니다', 403);
        }

        // teacher_feedback 필드 존재 여부 확인
        let hasTeacherFeedback = false;
        try {
            await DB.prepare("SELECT teacher_feedback FROM student_portfolios LIMIT 1").first();
            hasTeacherFeedback = true;
        } catch (e) {
            // 필드가 없으면 추가 시도
            try {
                await DB.prepare("ALTER TABLE student_portfolios ADD COLUMN teacher_feedback TEXT").run();
                hasTeacherFeedback = true;
            } catch (alterError) {
                console.warn('Failed to add teacher_feedback column:', alterError);
            }
        }

        // 동적 쿼리 생성
        const updateFields: string[] = [
            'title = ?', 'description = ?', 'thumbnail_url = ?', 
            'content_url = ?', 'category = ?', 'course_id = ?', 'is_featured = ?', 'updated_at = CURRENT_TIMESTAMP'
        ];
        const params: any[] = [title, description || null, thumbnail_url || null, content_url || null, category || 'other', course_id || null, is_featured ? 1 : 0];
        
        if (hasTeacherFeedback) {
            updateFields.splice(-1, 0, 'teacher_feedback = ?'); // updated_at 앞에 삽입
            params.splice(-1, 0, teacher_feedback || null);
        }
        
        params.push(id);

        await DB.prepare(`
            UPDATE student_portfolios 
            SET ${updateFields.join(', ')}
            WHERE id = ?
        `).bind(...params).run();

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

        // 권한 확인 (본인, 관리자, 또는 담당 강사)
        const existing: any = await DB.prepare(`
            SELECT p.student_id, p.course_id, c.teacher_id 
            FROM student_portfolios p
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE p.id = ?
        `).bind(id).first();
        if (!existing) return errorResponse(c, '포트폴리오를 찾을 수 없습니다', 404);
        
        let hasPermission = false;
        if (existing.student_id === user.userId || user.role === 'admin') {
            hasPermission = true;
        } else if (user.role === 'teacher' && existing.teacher_id === user.userId) {
            hasPermission = true;
        }
        
        if (!hasPermission) {
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
            // 강사는 본인이 담당하는 과정의 학생 것만 가능 (courses 테이블의 teacher_id 사용)
            const check: any = await DB.prepare(`
                SELECT 1 FROM student_portfolios p
                LEFT JOIN courses c ON p.course_id = c.id
                WHERE p.id = ? AND c.teacher_id = ?
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
