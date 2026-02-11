
import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 리뷰 목록 조회
// GET /api/reviews
// ============================================
app.get('/', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 10;
        const approved = c.req.query('approved'); // 0 or 1
        const offset = (page - 1) * limit;

        // 기본 쿼리
        let baseQuery = `
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN courses c ON r.course_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (approved !== undefined && approved !== '') {
            baseQuery += ` AND r.approved = ?`;
            params.push(approved);
        }

        // 전체 개수 조회
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
        const totalResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
        const total = totalResult?.total || 0;

        // 데이터 조회
        const dataQuery = `
            SELECT r.*, u.name as user_name, c.title as course_title
            ${baseQuery}
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;
        params.push(limit, offset);

        const { results } = await DB.prepare(dataQuery).bind(...params).all();

        return c.json({
            success: true,
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1
            }
        });

    } catch (e: any) {
        console.error('Error fetching reviews:', e);
        return c.json({ success: false, error: '리뷰 목록을 불러오는 중 오류가 발생했습니다.' }, 500);
    }
});

// ============================================
// 리뷰 승인/취소
// PUT /api/reviews/:id/approve
// ============================================
app.put('/:id/approve', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();
        const approved = body.approved ? 1 : 0;

        // 리뷰 존재 확인 및 course_id 획득
        const review = await DB.prepare('SELECT course_id FROM reviews WHERE id = ?').bind(id).first<{ course_id: number }>();
        if (!review) {
            return c.json({ success: false, error: '리뷰를 찾을 수 없습니다.' }, 404);
        }

        // 상태 업데이트
        await DB.prepare('UPDATE reviews SET approved = ?, updated_at = datetime(\'now\') WHERE id = ?')
            .bind(approved, id)
            .run();

        // 해당 과정의 평점 및 리뷰 수 업데이트
        await updateCourseRating(DB, review.course_id);

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Error approving review:', e);
        return c.json({ success: false, error: '리뷰 상태 변경 중 오류가 발생했습니다.' }, 500);
    }
});

// ============================================
// 리뷰 삭제
// DELETE /api/reviews/:id
// ============================================
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        // 리뷰 존재 확인 및 course_id 획득
        const review = await DB.prepare('SELECT course_id FROM reviews WHERE id = ?').bind(id).first<{ course_id: number }>();
        if (!review) {
            return c.json({ success: false, error: '리뷰를 찾을 수 없습니다.' }, 404);
        }

        // 삭제
        await DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();

        // 해당 과정의 평점 및 리뷰 수 업데이트
        await updateCourseRating(DB, review.course_id);

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Error deleting review:', e);
        return c.json({ success: false, error: '리뷰 삭제 중 오류가 발생했습니다.' }, 500);
    }
});

// ============================================
// Helper: 과정 평점 업데이트
// ============================================
async function updateCourseRating(DB: D1Database, courseId: number) {
    // 승인된 리뷰만 집계에 포함
    const result = await DB.prepare(`
        SELECT COUNT(*) as count, AVG(rating) as avg_rating
        FROM reviews
        WHERE course_id = ? AND approved = 1
    `).bind(courseId).first<{ count: number, avg_rating: number }>();

    const count = result?.count || 0;
    const rating = result?.avg_rating || 0; // null일 경우 0 처리

    // 소수점 첫째 자리까지만 저장 (선택 사항)
    const roundedRating = Math.round(rating * 10) / 10;

    await DB.prepare(`
        UPDATE courses
        SET review_count = ?, rating = ?
        WHERE id = ?
    `).bind(count, roundedRating, courseId).run();
}

export default app;