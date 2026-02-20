import { Hono } from 'hono';
import type { Bindings, JWTPayload, Course, Enrollment } from '../types';
import { authMiddleware, requireRole, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();

// ============================================
// 수강 신청 목록 조회
// GET /api/enrollments
// type=hrd & course_id=approved_course_id 이면 HRD 회차 수강생(course_session_enrollments) 반환
// ============================================
app.get('/', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');

    // 쿼리 파라미터
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status'); // pending, approved, rejected, completed, cancelled
    const courseId = c.req.query('course_id'); // 과정별 필터링 (legacy: courses.id / HRD: approved_courses.id)
    const typeHrd = c.req.query('type') === 'hrd';
    const offset = (page - 1) * limit;

    // HRD: course_id가 회차(session) ID이면 해당 회차 수강생만, 아니면 승인과정 기준 전체 회차 수강생
    if (typeHrd && courseId && (user.role === 'admin' || user.role === 'teacher')) {
      const courseIdNum = parseInt(String(courseId), 10);
      const asSession = await DB.prepare('SELECT id, approved_course_id FROM course_sessions WHERE id = ?').bind(courseIdNum).first<{ id: number; approved_course_id: number }>();
      const search = (c.req.query('search') || '').trim();
      const sessionOnly = true; // LMS 과정별 수강생 페이지는 해당 회차만 표시

      if (asSession?.id != null && sessionOnly) {
        // 해당 회차(session_id) 수강생만 조회 (approved, enrolled)
        let countQuery = `
          SELECT COUNT(*) as total FROM course_session_enrollments cse
          INNER JOIN users u ON cse.user_id = u.id
          WHERE cse.session_id = ? AND cse.status IN ('approved', 'enrolled')
        `;
        const countParams: any[] = [asSession.id];
        if (search) {
          countQuery += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
          countParams.push('%' + search + '%', '%' + search + '%');
        }
        const countRow = await DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();
        const total = countRow?.total ?? 0;

        let listQuery = `
          SELECT u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone,
                 cse.enrolled_at as enrolled_at, cse.status as status
          FROM course_session_enrollments cse
          INNER JOIN users u ON cse.user_id = u.id
          WHERE cse.session_id = ? AND cse.status IN ('approved', 'enrolled')
        `;
        const listParams: any[] = [asSession.id];
        if (search) {
          listQuery += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
          listParams.push('%' + search + '%', '%' + search + '%');
        }
        listQuery += ` ORDER BY u.name ASC, cse.enrolled_at ASC LIMIT ? OFFSET ?`;
        listParams.push(limit, offset);

        const { results } = await DB.prepare(listQuery).bind(...listParams).all();
        return c.json({
          success: true,
          data: results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
      }

      let approvedCourseId: number | null = asSession?.approved_course_id ?? null;
      if (approvedCourseId == null) {
        const asApproved = await DB.prepare('SELECT id FROM approved_courses WHERE id = ?').bind(courseIdNum).first<{ id: number }>();
        if (asApproved?.id != null) approvedCourseId = asApproved.id;
      }
      if (approvedCourseId == null) {
        return c.json({
          success: true,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 }
        });
      }

      let countQuery = `
        SELECT COUNT(DISTINCT cse.user_id) as total
        FROM course_session_enrollments cse
        INNER JOIN course_sessions cs ON cse.session_id = cs.id
        INNER JOIN users u ON cse.user_id = u.id
        WHERE cs.approved_course_id = ?
      `;
      const countParams: any[] = [approvedCourseId];
      if (search) {
        countQuery += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
        countParams.push('%' + search + '%', '%' + search + '%');
      }
      const countRow = await DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();
      const total = countRow?.total ?? 0;

      let listQuery = `
        SELECT u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone,
               MAX(cse.enrolled_at) as enrolled_at, 'approved' as status
        FROM course_session_enrollments cse
        INNER JOIN course_sessions cs ON cse.session_id = cs.id
        INNER JOIN users u ON cse.user_id = u.id
        WHERE cs.approved_course_id = ?
      `;
      const listParams: any[] = [approvedCourseId];
      if (search) {
        listQuery += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
        listParams.push('%' + search + '%', '%' + search + '%');
      }
      listQuery += ` GROUP BY u.id, u.name, u.email, u.phone ORDER BY enrolled_at DESC LIMIT ? OFFSET ?`;
      listParams.push(limit, offset);

      const { results } = await DB.prepare(listQuery).bind(...listParams).all();
      return c.json({
        success: true,
        data: results || [],
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    }

    // WHERE 조건 구성 (legacy enrollments)
    let whereClause = '';
    const params: any[] = [];

    // 강사인 경우 본인이 담당하는 과정의 수강생만 조회
    if (user.role === 'teacher') {
      // 과정 ID가 지정된 경우 해당 과정의 수강생만 조회
      if (courseId) {
        // 강사가 해당 과정의 담당자인지 확인
        const courseCheck = await DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(courseId).first<{ teacher_id: number }>();
        if (!courseCheck || courseCheck.teacher_id !== user.userId) {
          return c.json({ success: false, error: '권한이 없습니다' }, 403);
        }
        whereClause = 'WHERE e.course_id = ?';
        params.push(courseId);
        if (status) {
          whereClause += ' AND e.status = ?';
          params.push(status);
        }
      } else {
        // 과정 ID가 없으면 강사가 담당하는 모든 과정의 수강생 조회
        whereClause = 'WHERE c.teacher_id = ?';
        params.push(user.userId);
        if (status) {
          whereClause += ' AND e.status = ?';
          params.push(status);
        }
      }
    } else if (user.role !== 'admin') {
      // 일반 사용자는 본인 신청만 조회
      whereClause = 'WHERE e.user_id = ?';
      params.push(user.userId);

      if (status) {
        whereClause += ' AND e.status = ?';
        params.push(status);
      }
      if (courseId) {
        whereClause += ' AND e.course_id = ?';
        params.push(courseId);
      }
    } else {
      // 관리자는 모든 신청 조회 가능
      const conditions: string[] = [];
      if (status) {
        conditions.push('e.status = ?');
        params.push(status);
      }
      if (courseId) {
        conditions.push('e.course_id = ?');
        params.push(courseId);
      }
      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }
    }

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM enrollments e
      ${whereClause}
`;
    const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;

    // 목록 조회 (과정 기간 포함)
    const query = `
      SELECT
        e.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        c.title as course_title,
        c.category as course_category,
        c.thumbnail_url as course_thumbnail,
        c.start_date as course_start_date,
        c.end_date as course_end_date,
        cam.name as campus_name
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN campuses cam ON c.campus_id = cam.id
      ${whereClause}
      ORDER BY e.enrolled_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await DB.prepare(query).bind(...params, limit, offset).all();

    return c.json({
      success: true,
      data: result.results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return c.json({ success: false, error: '수강 신청 목록 조회 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 수강 신청 상세 조회
// GET /api/enrollments/:id
// ============================================
app.get('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');

    const query = `
      SELECT
e.*,
  u.name as user_name,
  u.email as user_email,
  u.phone as user_phone,
  c.title as course_title,
  c.category as course_category,
  c.description as course_description,
  c.duration_months,
  c.duration_hours,
  c.price,
  c.discount_price,
  c.thumbnail_url as course_thumbnail,
  cam.name as campus_name,
  cam.address as campus_address,
  cam.phone as campus_phone
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN campuses cam ON c.campus_id = cam.id
      WHERE e.id = ?
  `;

    const enrollment = await DB.prepare(query).bind(id).first();

    if (!enrollment) {
      return c.json({ success: false, error: '수강 신청을 찾을 수 없습니다' }, 404);
    }

    // 본인 또는 관리자만 조회 가능
    if (user.role !== 'admin' && enrollment.user_id !== user.userId) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    return c.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return c.json({ success: false, error: '수강 신청 조회 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 수강 신청 생성
// POST /api/enrollments
// ============================================
app.post('/', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const body = await c.req.json();

    const { course_id, payment_method, payment_amount } = body;

    // 필수 필드 검증
    if (!course_id) {
      return c.json({ success: false, error: '과정 ID는 필수입니다' }, 400);
    }

    // 과정 존재 여부 확인
    const course = await DB.prepare('SELECT * FROM courses WHERE id = ?').bind(course_id).first<Course>();
    if (!course) {
      return c.json({ success: false, error: '존재하지 않는 과정입니다' }, 404);
    }

    // 이미 신청한 과정인지 확인 (승인/진행중인 신청만)
    const existing = await DB.prepare(`
      SELECT * FROM enrollments 
      WHERE user_id = ? AND course_id = ?
  AND status IN('pending', 'approved', 'completed')
    `).bind(user.userId, course_id).first();

    if (existing) {
      return c.json({ success: false, error: '이미 신청한 과정입니다' }, 400);
    }

    // 정원 확인
    if (course.current_students >= course.max_students) {
      return c.json({ success: false, error: '정원이 마감되었습니다' }, 400);
    }

    // 수강 신청 생성
    const result = await DB.prepare(`
      INSERT INTO enrollments(
      user_id, course_id, status,
      payment_status, payment_method, payment_amount,
      enrolled_at
    ) VALUES(?, ?, 'pending', 'unpaid', ?, ?, datetime('now'))
      `).bind(
      user.userId,
      course_id,
      payment_method || null,
      payment_amount || course.discount_price || course.price
    ).run();

    // 과정 수강생 수 증가
    await DB.prepare(`
      UPDATE courses 
      SET current_students = current_students + 1 
      WHERE id = ?
  `).bind(course_id).run();

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        user_id: user.userId,
        course_id,
        status: 'pending',
        message: '수강 신청이 완료되었습니다. 승인을 기다려주세요.'
      }
    }, 201);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return c.json({ success: false, error: '수강 신청 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 수강 신청 상태 변경 (관리자 전용)
// PUT /api/enrollments/:id/status
// ============================================
app.put('/:id/status', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');
    const { status } = await c.req.json();

    // 상태 검증
    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return c.json({ success: false, error: '유효하지 않은 상태입니다' }, 400);
    }

    // 수강 신청 조회
    const enrollment = await DB.prepare('SELECT * FROM enrollments WHERE id = ?').bind(id).first();
    if (!enrollment) {
      return c.json({ success: false, error: '수강 신청을 찾을 수 없습니다' }, 404);
    }

    // 상태 업데이트
    await DB.prepare(`
      UPDATE enrollments 
      SET status = ?,
  completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END
      WHERE id = ?
  `).bind(status, status, id).run();

    return c.json({
      success: true,
      message: '상태가 변경되었습니다'
    });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return c.json({ success: false, error: '상태 변경 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 수강 신청 취소
// DELETE /api/enrollments/:id
// ============================================
app.delete('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');

    // 수강 신청 조회
    const enrollment = await DB.prepare('SELECT * FROM enrollments WHERE id = ?').bind(id).first<Enrollment>();

    if (!enrollment) {
      return c.json({ success: false, error: '수강 신청을 찾을 수 없습니다' }, 404);
    }

    // 본인 또는 관리자만 취소 가능
    if (user.role !== 'admin' && enrollment.user_id !== user.userId) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    // pending 또는 approved 상태만 취소 가능
    if (!['pending', 'approved'].includes(enrollment.status)) {
      return c.json({ success: false, error: '취소할 수 없는 상태입니다' }, 400);
    }

    // 상태를 cancelled로 변경
    await DB.prepare(`
      UPDATE enrollments 
      SET status = 'cancelled' 
      WHERE id = ?
  `).bind(id).run();

    // 과정 수강생 수 감소
    await DB.prepare(`
      UPDATE courses 
      SET current_students = current_students - 1 
      WHERE id = ?
  `).bind(enrollment.course_id).run();

    return c.json({
      success: true,
      message: '수강 신청이 취소되었습니다'
    });
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    return c.json({ success: false, error: '수강 신청 취소 중 오류가 발생했습니다' }, 500);
  }
});

export default app;
