import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 리뷰 목록 조회
// GET /api/reviews
// ============================================
app.get('/', async (c) => {
  try {
    const { DB } = c.env;
    
    // 쿼리 파라미터
    const course_id = c.req.query('course_id');
    const approved = c.req.query('approved'); // '1' or '0'
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;
    
    // WHERE 조건 구성
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (course_id) {
      whereClause += ' AND r.course_id = ?';
      params.push(course_id);
    }
    
    if (approved) {
      whereClause += ' AND r.approved = ?';
      params.push(approved === '1' ? 1 : 0);
    } else {
      // 기본적으로 승인된 리뷰만 표시
      whereClause += ' AND r.approved = 1';
    }
    
    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;
    const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;
    
    // 목록 조회
    const query = `
      SELECT 
        r.*,
        u.name as user_name,
        u.profile_image as user_profile_image,
        c.title as course_title,
        c.category as course_category
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN courses c ON r.course_id = c.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await DB.prepare(query).bind(...params, limit, offset).all();
    
    // images JSON 파싱
    const reviews = result.results.map((review: any) => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : []
    }));
    
    return c.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ success: false, error: '리뷰 목록 조회 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 리뷰 상세 조회
// GET /api/reviews/:id
// ============================================
app.get('/:id', async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');
    
    const query = `
      SELECT 
        r.*,
        u.name as user_name,
        u.profile_image as user_profile_image,
        c.title as course_title,
        c.category as course_category,
        c.thumbnail_url as course_thumbnail
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE r.id = ?
    `;
    
    const review = await DB.prepare(query).bind(id).first();
    
    if (!review) {
      return c.json({ success: false, error: '리뷰를 찾을 수 없습니다' }, 404);
    }
    
    // images JSON 파싱
    const reviewData = {
      ...review,
      images: review.images ? JSON.parse(review.images) : []
    };
    
    return c.json({
      success: true,
      data: reviewData
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return c.json({ success: false, error: '리뷰 조회 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 리뷰 작성
// POST /api/reviews
// ============================================
app.post('/', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const body = await c.req.json();
    
    const { course_id, enrollment_id, rating, title, content, images } = body;
    
    // 필수 필드 검증
    if (!course_id || !rating) {
      return c.json({ success: false, error: '과정 ID와 평점은 필수입니다' }, 400);
    }
    
    // 평점 검증 (1-5)
    if (rating < 1 || rating > 5) {
      return c.json({ success: false, error: '평점은 1-5 사이여야 합니다' }, 400);
    }
    
    // 수강 완료 여부 확인 (선택적)
    if (enrollment_id) {
      const enrollment = await DB.prepare(`
        SELECT * FROM enrollments 
        WHERE id = ? AND user_id = ? AND course_id = ?
      `).bind(enrollment_id, user.id, course_id).first();
      
      if (!enrollment) {
        return c.json({ success: false, error: '유효하지 않은 수강 신청입니다' }, 400);
      }
    }
    
    // 이미 리뷰를 작성했는지 확인
    const existingReview = await DB.prepare(`
      SELECT * FROM reviews 
      WHERE user_id = ? AND course_id = ?
    `).bind(user.id, course_id).first();
    
    if (existingReview) {
      return c.json({ success: false, error: '이미 리뷰를 작성하셨습니다' }, 400);
    }
    
    // 리뷰 생성
    const result = await DB.prepare(`
      INSERT INTO reviews (
        user_id, course_id, enrollment_id,
        rating, title, content, images,
        approved, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))
    `).bind(
      user.id,
      course_id,
      enrollment_id || null,
      rating,
      title || null,
      content || null,
      images ? JSON.stringify(images) : null
    ).run();
    
    // 과정 평점 업데이트
    await updateCourseRating(DB, course_id);
    
    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: '리뷰가 등록되었습니다. 관리자 승인 후 표시됩니다.'
      }
    }, 201);
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ success: false, error: '리뷰 작성 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 리뷰 수정
// PUT /api/reviews/:id
// ============================================
app.put('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // 리뷰 조회
    const review = await DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first();
    
    if (!review) {
      return c.json({ success: false, error: '리뷰를 찾을 수 없습니다' }, 404);
    }
    
    // 본인만 수정 가능
    if (review.user_id !== user.id) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }
    
    const { rating, title, content, images } = body;
    
    // 평점 검증
    if (rating && (rating < 1 || rating > 5)) {
      return c.json({ success: false, error: '평점은 1-5 사이여야 합니다' }, 400);
    }
    
    // 리뷰 수정 (승인 상태 초기화)
    await DB.prepare(`
      UPDATE reviews 
      SET rating = ?, title = ?, content = ?, images = ?,
          approved = 0, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      rating ?? review.rating,
      title ?? review.title,
      content ?? review.content,
      images ? JSON.stringify(images) : review.images,
      id
    ).run();
    
    // 과정 평점 업데이트
    await updateCourseRating(DB, review.course_id);
    
    return c.json({
      success: true,
      message: '리뷰가 수정되었습니다. 관리자 재승인이 필요합니다.'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return c.json({ success: false, error: '리뷰 수정 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 리뷰 삭제
// DELETE /api/reviews/:id
// ============================================
app.delete('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');
    
    // 리뷰 조회
    const review = await DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first();
    
    if (!review) {
      return c.json({ success: false, error: '리뷰를 찾을 수 없습니다' }, 404);
    }
    
    // 본인 또는 관리자만 삭제 가능
    if (user.role !== 'admin' && review.user_id !== user.id) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }
    
    // 리뷰 삭제
    await DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
    
    // 과정 평점 업데이트
    await updateCourseRating(DB, review.course_id);
    
    return c.json({
      success: true,
      message: '리뷰가 삭제되었습니다'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return c.json({ success: false, error: '리뷰 삭제 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 리뷰 승인/거부 (관리자 전용)
// PUT /api/reviews/:id/approve
// ============================================
app.put('/:id/approve', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');
    const { approved } = await c.req.json();
    
    // 리뷰 조회
    const review = await DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first();
    
    if (!review) {
      return c.json({ success: false, error: '리뷰를 찾을 수 없습니다' }, 404);
    }
    
    // 승인 상태 업데이트
    await DB.prepare('UPDATE reviews SET approved = ? WHERE id = ?')
      .bind(approved ? 1 : 0, id)
      .run();
    
    // 과정 평점 업데이트
    await updateCourseRating(DB, review.course_id);
    
    return c.json({
      success: true,
      message: approved ? '리뷰가 승인되었습니다' : '리뷰가 거부되었습니다'
    });
  } catch (error) {
    console.error('Error approving review:', error);
    return c.json({ success: false, error: '리뷰 승인 처리 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 도움이 됐어요 증가
// POST /api/reviews/:id/helpful
// ============================================
app.post('/:id/helpful', async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');
    
    await DB.prepare(`
      UPDATE reviews 
      SET helpful_count = helpful_count + 1 
      WHERE id = ?
    `).bind(id).run();
    
    return c.json({
      success: true,
      message: '도움이 됐어요를 눌렀습니다'
    });
  } catch (error) {
    console.error('Error updating helpful count:', error);
    return c.json({ success: false, error: '처리 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 헬퍼 함수: 과정 평점 업데이트
// ============================================
async function updateCourseRating(DB: any, course_id: number) {
  const result = await DB.prepare(`
    SELECT 
      COUNT(*) as review_count,
      AVG(rating) as avg_rating
    FROM reviews
    WHERE course_id = ? AND approved = 1
  `).bind(course_id).first();
  
  await DB.prepare(`
    UPDATE courses 
    SET rating = ?, review_count = ?
    WHERE id = ?
  `).bind(
    result.avg_rating ? parseFloat(result.avg_rating.toFixed(1)) : 0,
    result.review_count || 0,
    course_id
  ).run();
}

export default app;
