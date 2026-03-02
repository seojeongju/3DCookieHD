// ============================================
// 과정 API
// ============================================

import { Hono } from 'hono';
import type { Bindings, Course, CourseFilter } from '../types';
import { successResponse, errorResponse, notFoundResponse, paginatedResponse } from '../utils/response';
import { verifyToken } from '../utils/jwt';
import { getOne, getAll, execute, calculatePagination } from '../utils/database';
import { authMiddleware, requireAdmin, requireTeacher } from '../middleware/auth';
import { verifyCourseOwnership } from '../middleware/ownership';

const courses = new Hono<{ Bindings: Bindings }>();

/** "HH:MM" 또는 "HH:MM:SS"를 자정 기준 분으로 변환 (시간대 무관) */
function timeToMinutesSinceMidnight(s: string | null | undefined): number | null {
  if (!s || typeof s !== 'string') return null;
  const parts = String(s).trim().substring(0, 8).split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** 입실·퇴실 시간으로 수강 분 계산 (자정 넘김 처리) */
function attendanceDurationMinutes(checkIn: string | null | undefined, checkOut: string | null | undefined): number {
  const inM = timeToMinutesSinceMidnight(checkIn);
  const outM = timeToMinutesSinceMidnight(checkOut);
  if (inM == null || outM == null) return 0;
  let diff = outM - inM;
  if (diff <= 0) diff += 24 * 60;
  return diff;
}

/**
 * GET /api/courses
 * 과정 목록 조회 (필터링, 검색, 정렬, 페이지네이션)
 */
courses.get('/', async (c) => {
  try {
    const query = c.req.query();

    // 필터 파라미터
    const filter: CourseFilter = {
      category: query.category,
      region: query.region,
      campus_id: query.campus_id ? parseInt(query.campus_id) : undefined,
      status: query.status as any,
      min_price: query.min_price ? parseInt(query.min_price) : undefined,
      max_price: query.max_price ? parseInt(query.max_price) : undefined,
      search: query.search,
      sort: (query.sort as any) || 'latest',
      page: parseInt(query.page || '1'),
      limit: parseInt(query.limit || '12')
    };

    const { limit, offset } = calculatePagination(filter.page!, filter.limit!);

    // WHERE 조건 구성
    const conditions: string[] = [];
    const params: any[] = [];

    let isTeacher = false;
    let teacherId: number | null = null;

    // 역할 기반 필터링 (강사는 본인 과정만)
    const authHeader = c.req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = await verifyToken(token);
        if (payload && payload.role === 'teacher') {
          isTeacher = true;
          teacherId = payload.userId;
          conditions.push('c.teacher_id = ?');
          params.push(payload.userId);
        }
      } catch (e) {
        // 토큰 오류 무시 (비로그인 처리)
      }
    }

    if (filter.category) {
      conditions.push('c.category = ?');
      params.push(filter.category);
    }

    if (filter.status) {
      conditions.push('c.status = ?');
      params.push(filter.status);
    }

    if (filter.campus_id) {
      conditions.push('c.campus_id = ?');
      params.push(filter.campus_id);
    }

    if (filter.region) {
      conditions.push('camp.region = ?');
      params.push(filter.region);
    }

    if (filter.min_price !== undefined) {
      conditions.push('c.price >= ?');
      params.push(filter.min_price);
    }

    if (filter.max_price !== undefined) {
      conditions.push('c.price <= ?');
      params.push(filter.max_price);
    }

    if (filter.search) {
      conditions.push('(c.title LIKE ? OR c.description LIKE ?)');
      const searchTerm = `%${filter.search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Year Filter
    const year = query.year;
    if (year) {
      conditions.push('c.start_date LIKE ?');
      params.push(`${year}-%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 정렬 조건
    let orderBy = 'c.created_at DESC';
    switch (filter.sort) {
      case 'popular':
        orderBy = 'c.current_students DESC, c.view_count DESC';
        break;
      case 'price_asc':
        orderBy = 'c.price ASC';
        break;
      case 'price_desc':
        orderBy = 'c.price DESC';
        break;
      case 'rating':
        orderBy = 'c.rating DESC, c.review_count DESC';
        break;
    }

    // 강사: legacy courses + HRD 배정 회차를 합쳐서 반환
    if (isTeacher && teacherId != null) {
      const legacyQuery = `
        SELECT c.*, camp.name as campus_name, camp.region as campus_region, u.name as teacher_name
        FROM courses c
        LEFT JOIN campuses camp ON c.campus_id = camp.id
        LEFT JOIN users u ON c.teacher_id = u.id
        ${whereClause}
        ORDER BY ${orderBy}
      `;
      const legacyList = await getAll<any>(c.env.DB, legacyQuery, params);
      const legacyCount = legacyList.length;

      const hrdRows = await c.env.DB.prepare(`
        SELECT DISTINCT s.id, s.session_number, s.session_name, s.status as session_status,
               s.training_start_date, s.training_end_date, a.name as course_name,
               cc.name as category_name
        FROM session_timetable st
        INNER JOIN course_sessions s ON st.session_id = s.id
        INNER JOIN approved_courses a ON s.approved_course_id = a.id
        LEFT JOIN course_categories cc ON a.category_id = cc.id
        WHERE st.instructor_id = ?
      `).bind(teacherId).all();

      const enrollmentCounts = new Map<number, number>();
      if (hrdRows.results && hrdRows.results.length > 0) {
        const sessionIds = [...new Set((hrdRows.results as any[]).map((r: any) => r.id))];
        for (const sid of sessionIds) {
          const r = await c.env.DB.prepare(
            'SELECT COUNT(*) as cnt FROM course_session_enrollments WHERE session_id = ?'
          ).bind(sid).first<{ cnt: number }>();
          enrollmentCounts.set(sid, r?.cnt ?? 0);
        }
      }

      const statusMap: Record<string, string> = {
        recruiting: 'upcoming',
        in_progress: 'active',
        always_open: 'active',
        completed: 'completed',
        closed: 'completed'
      };
      const hrdList = (hrdRows.results || []).map((r: any) => {
        const normStatus = statusMap[r.session_status] || r.session_status || 'active';
        const title = (r.course_name || '') + (r.session_number != null ? ' (' + r.session_number + '회차)' : '') + (r.session_name ? ' - ' + r.session_name : '');
        return {
          id: r.id,
          title,
          category: r.category_name || '국비지원',
          status: normStatus,
          start_date: r.training_start_date || null,
          thumbnail_url: null,
          current_students: enrollmentCounts.get(r.id) ?? 0,
          max_students: 0,
          teacher_name: null,
          campus_name: null,
          campus_region: null,
          is_hrd: true
        };
      });

      let merged = [...legacyList.map((c: any) => ({ ...c, is_hrd: false })), ...hrdList];
      if (filter.category) {
        merged = merged.filter((c: any) => (c.category || '') === filter.category);
      }
      if (filter.status) {
        merged = merged.filter((c: any) => (c.status || '') === filter.status);
      }
      if (filter.search) {
        const term = (filter.search || '').toLowerCase();
        merged = merged.filter((c: any) => (c.title || '').toLowerCase().includes(term));
      }
      merged.sort((a: any, b: any) => {
        const da = a.created_at || a.start_date || '';
        const db = b.created_at || b.start_date || '';
        return db.localeCompare(da);
      });
      const total = merged.length;
      const courseList = merged.slice(offset, offset + limit);
      return paginatedResponse(c, courseList, filter.page!, filter.limit!, total);
    }

    // 총 개수 조회 (비강사 또는 일반)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      LEFT JOIN campuses camp ON c.campus_id = camp.id
      ${whereClause}
    `;
    const countResult = await getOne<{ total: number }>(c.env.DB, countQuery, params);
    const total = countResult?.total || 0;

    const coursesQuery = `
      SELECT 
        c.*,
        camp.name as campus_name,
        camp.region as campus_region,
        u.name as teacher_name
      FROM courses c
      LEFT JOIN campuses camp ON c.campus_id = camp.id
      LEFT JOIN users u ON c.teacher_id = u.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const courseList = await getAll<Course>(
      c.env.DB,
      coursesQuery,
      [...params, limit, offset]
    );

    return paginatedResponse(c, courseList, filter.page!, filter.limit!, total);

  } catch (error) {
    console.error('Get courses error:', error);
    return errorResponse(c, '과정 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /api/courses/:id
 * 과정 상세 조회
 */
courses.get('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    let type = (c.req.query('type') || c.req.query('/type') || '').trim().toLowerCase();
    if (type === 'undefined' || type === '') type = '';

    if (type === 'hrd') {
      try {
        const sessionId = parseInt(idParam, 10);
        if (isNaN(sessionId)) return notFoundResponse(c, '잘못된 회차 ID입니다');

        const { DB } = c.env;

        // 1. 회차 정보 직접 조회
        let session = await DB.prepare(`
          SELECT 
            s.*,
            a.name as approved_course_name,
            a.instructor_name as approved_instructor_name,
            a.daily_hours,
            a.total_hours,
            a.total_days,
            cat.name as category_name
          FROM course_sessions s
          LEFT JOIN approved_courses a ON s.approved_course_id = a.id
          LEFT JOIN course_categories cat ON a.category_id = cat.id
          WHERE s.id = ?
        `).bind(sessionId).first<any>();

        // 2. 실패 시 과정 ID(approved_course_id)로 최신 회차 조회
        if (!session) {
          session = await DB.prepare(`
            SELECT 
              s.*,
              a.name as approved_course_name,
              a.instructor_name as approved_instructor_name,
              a.daily_hours,
              a.total_hours,
              a.total_days,
              cat.name as category_name
            FROM course_sessions s
            LEFT JOIN approved_courses a ON s.approved_course_id = a.id
            LEFT JOIN course_categories cat ON a.category_id = cat.id
            WHERE s.approved_course_id = ?
            ORDER BY s.session_number DESC, s.id DESC
            LIMIT 1
          `).bind(sessionId).first<any>();
        }

        if (!session) return notFoundResponse(c, '개설된 회차 정보를 찾을 수 없습니다');

        const dailyHoursResolved = session.daily_hours != null && Number(session.daily_hours) > 0
          ? Number(session.daily_hours)
          : (session.total_hours != null && session.total_days != null && Number(session.total_days) > 0 && Number(session.total_hours) > 0
            ? Math.round((Number(session.total_hours) / Number(session.total_days)) * 10) / 10
            : null);

        // 3. 프론트엔드 호환 필드 구성
        const realSessionId = session.id;
        const courseName = session.approved_course_name || '미지정 과정';
        const sessionNum = session.session_number || '1';
        const sessionNameSuffix = session.session_name ? ` - ${session.session_name}` : '';
        const fullTitle = `${courseName} (${sessionNum}회차)${sessionNameSuffix}`;

        // 4. 수강생 수 조회
        const studentCountResult = await DB.prepare(
          'SELECT COUNT(*) as count FROM course_session_enrollments WHERE session_id = ? AND status IN ("approved", "enrolled")'
        ).bind(realSessionId).first<{ count: number }>();

        // 5. 최종 데이터 반환 (daily_hours: 배정 훈련시간, 없으면 total_hours/total_days로 계산)
        return successResponse(c, {
          ...session,
          id: realSessionId, // 매우 중요: 이후 모든 LMS API는 이 ID를 사용함
          course_id: session.approved_course_id,
          title: fullTitle,
          name: fullTitle,
          teacher_name: session.instructor_name || session.approved_instructor_name,
          start_date: session.training_start_date,
          end_date: session.training_end_date,
          start_time: session.training_time_start,
          end_time: session.training_time_end,
          category: session.category_name || '국비지원',
          price: 0,
          current_students: studentCountResult?.count || 0,
          max_students: 0,
          status: session.status || 'active',
          daily_hours: dailyHoursResolved
        });
      } catch (err: any) {
        console.error('HRD Course Detail Critical Error:', err);
        return c.json({
          success: false,
          error: '회차 정보를 처리하는 중 오류가 발생했습니다: ' + err.message
        }, 500);
      }
    }

    // type 없이 :id 하나로 조회 — 먼저 courses, 없으면 회차(session)로 해석 (개설 과정 ID 일원화)
    const id = idParam;
    const course = await getOne<any>(
      c.env.DB,
      `SELECT 
        c.*,
        camp.name as campus_name,
        camp.region as campus_region,
        camp.address as campus_address,
        camp.phone as campus_phone,
        u.name as teacher_name,
        u.profile_image as teacher_profile_image
      FROM courses c
      LEFT JOIN campuses camp ON c.campus_id = camp.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?`,
      [id]
    );

    if (course) {
      // 조회수 증가 (legacy courses 테이블)
      await execute(
        c.env.DB,
        'UPDATE courses SET view_count = view_count + 1 WHERE id = ?',
        [id]
      );
    } else {
      // 과정에 없으면 회차 ID로 해석
      const sessionId = parseInt(id, 10);
      if (!isNaN(sessionId)) {
        let session = await c.env.DB.prepare(`
          SELECT s.*, a.name as approved_course_name, a.instructor_name as approved_instructor_name, a.daily_hours, cat.name as category_name
          FROM course_sessions s
          LEFT JOIN approved_courses a ON s.approved_course_id = a.id
          LEFT JOIN course_categories cat ON a.category_id = cat.id
          WHERE s.id = ?
        `).bind(sessionId).first<any>();
        if (!session) {
          session = await c.env.DB.prepare(`
            SELECT s.*, a.name as approved_course_name, a.instructor_name as approved_instructor_name, a.daily_hours, cat.name as category_name
            FROM course_sessions s
            LEFT JOIN approved_courses a ON s.approved_course_id = a.id
            LEFT JOIN course_categories cat ON a.category_id = cat.id
            WHERE s.approved_course_id = ?
            ORDER BY s.session_number DESC, s.id DESC
            LIMIT 1
          `).bind(sessionId).first<any>();
        }
        if (session) {
          const realSessionId = session.id;
          const courseName = session.approved_course_name || '미지정 과정';
          const sessionNum = session.session_number || '1';
          const sessionNameSuffix = session.session_name ? ` - ${session.session_name}` : '';
          const fullTitle = `${courseName} (${sessionNum}회차)${sessionNameSuffix}`;
          const studentCountResult = await c.env.DB.prepare(
            'SELECT COUNT(*) as count FROM course_session_enrollments WHERE session_id = ? AND status IN ("approved", "enrolled")'
          ).bind(realSessionId).first<{ count: number }>();
          return successResponse(c, {
            ...session,
            id: realSessionId,
            course_id: session.approved_course_id,
            title: fullTitle,
            name: fullTitle,
            teacher_name: session.instructor_name || session.approved_instructor_name,
            start_date: session.training_start_date,
            end_date: session.training_end_date,
            start_time: session.training_time_start,
            end_time: session.training_time_end,
            category: session.category_name || '국비지원',
            price: 0,
            current_students: studentCountResult?.count || 0,
            max_students: 0,
            status: session.status || 'active'
          });
        }
      }
      return notFoundResponse(c, '과정을 찾을 수 없습니다');
    }

    // JSON 필드 파싱
    if (course.curriculum) {
      try {
        course.curriculum = JSON.parse(course.curriculum);
      } catch { }
    }
    if (course.tags) {
      try {
        course.tags = JSON.parse(course.tags);
      } catch { }
    }
    if (course.detail_images) {
      try {
        course.detail_images = JSON.parse(course.detail_images);
      } catch { }
    }

    return successResponse(c, course);

  } catch (error) {
    console.error('Get course error:', error);
    return errorResponse(c, '과정 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /api/courses
 * 과정 생성 (관리자 전용)
 */
courses.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const {
      title, subtitle, subject, category, description, curriculum,
      duration_months, duration_hours, price, discount_price,
      thumbnail_url, detail_images, campus_id, teacher_id,
      max_students, start_date, end_date, schedule, tags, class_days
    } = body;

    // 필수 필드 검증
    if (!title || !category) {
      return errorResponse(c, '과정명과 카테고리는 필수입니다', 400);
    }

    // 과정 생성
    const result = await execute(
      c.env.DB,
      `INSERT INTO courses (
        title, subtitle, subject, category, description, curriculum,
        duration_months, duration_hours, price, discount_price,
        thumbnail_url, detail_images, campus_id, teacher_id,
        max_students, start_date, end_date, schedule, tags, class_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, subtitle || null, subject || null, category, description || null,
        curriculum ? JSON.stringify(curriculum) : null,
        duration_months || null, duration_hours || null, price || 0, discount_price || null,
        thumbnail_url || null,
        detail_images ? JSON.stringify(detail_images) : null,
        campus_id || null, teacher_id || null, max_students || 20,
        start_date || null, end_date || null, schedule || null,
        tags ? JSON.stringify(tags) : null,
        class_days ? JSON.stringify(class_days) : null
      ]
    );

    if (!result.success) {
      return errorResponse(c, '과정 생성에 실패했습니다', 500);
    }

    // 생성된 과정 조회
    const newCourse = await getOne<Course>(
      c.env.DB,
      'SELECT * FROM courses WHERE id = ?',
      [result.meta.last_row_id]
    );

    return successResponse(c, newCourse, '과정이 생성되었습니다', 201);

  } catch (error) {
    console.error('Create course error:', error);
    return errorResponse(c, '과정 생성 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /api/courses/:id
 * 과정 수정 (관리자 및 담당 강사)
 */
courses.put('/:id', authMiddleware, requireTeacher, verifyCourseOwnership, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    // 과정 존재 확인
    const course = await getOne<Course>(c.env.DB, 'SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return notFoundResponse(c, '과정을 찾을 수 없습니다');
    }

    // 업데이트할 필드 준비
    const updates: string[] = [];
    const params: any[] = [];

    const fields = [
      'title', 'subtitle', 'subject', 'category', 'description',
      'duration_months', 'duration_hours', 'price', 'discount_price',
      'thumbnail_url', 'campus_id', 'teacher_id', 'status',
      'max_students', 'start_date', 'end_date', 'schedule'
    ];

    fields.forEach(field => {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        // 빈 문자열을 null로 변환 (날짜 필드 등)
        if (body[field] === '') {
          params.push(null);
        } else {
          params.push(body[field]);
        }
      }
    });

    if (body.class_days !== undefined) {
      updates.push('class_days = ?');
      params.push(JSON.stringify(body.class_days));
    }

    // JSON 필드 처리
    if (body.curriculum !== undefined) {
      updates.push('curriculum = ?');
      params.push(JSON.stringify(body.curriculum));
    }
    if (body.tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(body.tags));
    }
    if (body.detail_images !== undefined) {
      updates.push('detail_images = ?');
      params.push(JSON.stringify(body.detail_images));
    }

    if (updates.length === 0) {
      return errorResponse(c, '수정할 내용이 없습니다', 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    // 과정 업데이트
    await execute(
      c.env.DB,
      `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // 업데이트된 과정 조회
    const updatedCourse = await getOne<Course>(
      c.env.DB,
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );

    return successResponse(c, updatedCourse, '과정이 수정되었습니다');

  } catch (error) {
    console.error('Update course error:', error);
    return errorResponse(c, '과정 수정 중 오류가 발생했습니다', 500);
  }
});

/**
 * DELETE /api/courses/:id
 * 과정 삭제 (관리자 전용)
 * FK 제약이 있지만 ON DELETE가 없는 테이블은 API에서 순서대로 정리 후 과정 삭제
 */
courses.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');

    // 과정 존재 확인
    const course = await getOne<Course>(c.env.DB, 'SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return notFoundResponse(c, '과정을 찾을 수 없습니다');
    }

    // 진행 중인 수강생(approved, pending)이 있는지 확인 — 취소(cancelled)된 수강은 제외
    const enrollmentCount = await getOne<{ count: number }>(
      c.env.DB,
      "SELECT COUNT(*) as count FROM enrollments WHERE course_id = ? AND status IN ('approved', 'pending')",
      [id]
    );

    if (enrollmentCount && enrollmentCount.count > 0) {
      return errorResponse(c, '수강생이 있는 과정은 삭제할 수 없습니다. 교육과정 수정에서 수강생 관리 → 수강 취소 후 삭제해 주세요.', 400);
    }

    // ON DELETE CASCADE/SET NULL이 없는 테이블: 과정 삭제 전 참조 제거 (순서 유지)
    const db = c.env.DB;

    // 1) 시험 관련: 제출 → 문제 → 시험
    await execute(db, 'DELETE FROM exam_submissions WHERE exam_id IN (SELECT id FROM exams WHERE course_id = ?)', [id]);
    await execute(db, 'DELETE FROM exam_questions WHERE exam_id IN (SELECT id FROM exams WHERE course_id = ?)', [id]);
    await execute(db, 'DELETE FROM exams WHERE course_id = ?', [id]);

    // 2) 평가 관련: student_scores → evaluations
    await execute(db, 'DELETE FROM student_scores WHERE evaluation_id IN (SELECT id FROM evaluations WHERE course_id = ?)', [id]);
    await execute(db, 'DELETE FROM evaluations WHERE course_id = ?', [id]);

    // 3) 훈련 일지, 취업 상태
    await execute(db, 'DELETE FROM training_logs WHERE course_id = ?', [id]);
    await execute(db, 'DELETE FROM employment_status WHERE course_id = ?', [id]);

    // 4) 포트폴리오는 course_id만 NULL 처리 (레코드 유지)
    await execute(db, "UPDATE posts SET course_id = NULL WHERE course_id = ? AND category = 'portfolio'", [id]);

    // 5) 설문은 ON DELETE SET NULL이 있으면 DB가 처리. 없으면 안전을 위해 NULL 처리
    try {
      await execute(db, 'UPDATE surveys SET course_id = NULL WHERE course_id = ?', [id]);
    } catch (_) {
      // surveys 테이블이 없거나 컬럼 구조가 다를 수 있음
    }

    // 과정 삭제 (enrollments, reviews 등 ON DELETE CASCADE 테이블은 DB가 처리)
    await execute(db, 'DELETE FROM courses WHERE id = ?', [id]);

    return successResponse(c, null, '과정이 삭제되었습니다');

  } catch (error) {
    console.error('Delete course error:', error);
    return errorResponse(c, '과정 삭제 중 오류가 발생했습니다', 500);
  }
});

// GET /api/courses/:id/grades - Get course gradebook (matrix). :id가 회차면 회차 기준, 아니면 과정 기준
courses.get('/:id/grades', async (c) => {
  const rawId = c.req.param('id');
  const type = (c.req.query('type') || '').toLowerCase();
  const idNum = parseInt(rawId, 10);
  if (isNaN(idNum)) return errorResponse(c, '잘못된 ID입니다', 400);
  // 회차 여부: type=hrd 이거나, courses에 없고 course_sessions에 있으면 회차
  let isHrd = type === 'hrd';
  if (!isHrd) {
    const inCourses = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(idNum).first();
    const inSessions = await c.env.DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(idNum).first();
    if (!inCourses && inSessions) isHrd = true;
  }
  const courseId = rawId;

  try {
    let exams: any[];
    let students: any[];
    let submissions: any[];

    if (isHrd) {
      // HRD 회차: 수강생 = course_session_enrollments, 컬럼 = 해당 회차 과제, 점수 = assignment_submissions
      const { results: studentsRows } = await c.env.DB.prepare(`
            SELECT u.id, u.name, u.email, u.phone
            FROM course_session_enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.session_id = ? AND e.status IN ('approved', 'enrolled')
            ORDER BY u.name ASC
      `).bind(courseId).all();
      students = studentsRows || [];

      const { results: assignmentsRows } = await c.env.DB.prepare(`
            SELECT id, title, max_score as total_points
            FROM assignments
            WHERE session_id = ?
            ORDER BY due_date ASC, id ASC
      `).bind(courseId).all();
      exams = (assignmentsRows || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        total_points: a.total_points ?? 100,
        time_limit_minutes: null,
        is_active: true
      }));

      const { results: subRows } = await c.env.DB.prepare(`
            SELECT s.assignment_id as exam_id, s.student_id, s.score as total_score, s.status
            FROM assignment_submissions s
            JOIN assignments a ON s.assignment_id = a.id
            WHERE a.session_id = ?
      `).bind(courseId).all();
      submissions = subRows || [];
    } else {
      // Legacy: 시험 기준 성적표
      const { results: examsRows } = await c.env.DB.prepare(`
            SELECT id, title, time_limit_minutes, is_active,
            (SELECT SUM(points) FROM exam_questions WHERE exam_id = exams.id) as total_points
            FROM exams
            WHERE course_id = ?
            ORDER BY created_at ASC
      `).bind(courseId).all();
      exams = examsRows || [];

      const { results: studentsRows } = await c.env.DB.prepare(`
            SELECT u.id, u.name, u.email, u.phone
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.course_id = ? AND e.status = 'approved'
            ORDER BY u.name ASC
      `).bind(courseId).all();
      students = studentsRows || [];

      const { results: subRows } = await c.env.DB.prepare(`
            SELECT s.exam_id, s.student_id, s.total_score, s.status
            FROM exam_submissions s
            JOIN exams e ON s.exam_id = e.id
            WHERE e.course_id = ?
      `).bind(courseId).all();
      submissions = subRows || [];
    }

    const studentGrades = students.map((std: any) => {
      const scores: any = {};
      let totalScore = 0;
      let itemCount = 0;

      exams.forEach((exam: any) => {
        const sub = submissions.find((s: any) => s.exam_id === exam.id && s.student_id === std.id) as any;
        if (sub && sub.total_score != null) {
          scores[exam.id] = sub.total_score;
          totalScore += sub.total_score;
          itemCount++;
        } else {
          scores[exam.id] = null;
        }
      });

      const average = itemCount > 0 ? totalScore / itemCount : 0;

      return {
        ...std,
        scores,
        totalScore,
        average: Math.round(average * 10) / 10
      };
    });

    studentGrades.sort((a: any, b: any) => b.totalScore - a.totalScore);
    studentGrades.forEach((std: any, index: number) => {
      std.rank = index + 1;
    });

    return successResponse(c, {
      exams,
      students: studentGrades
    });
  } catch (e: any) {
    return errorResponse(c, e.message, 500);
  }
});

/**
 * GET /api/courses/:id/attendance-info
 * HRD 회차 마감 여부 및 최종 훈련일 조회 (출결 페이지 초기 날짜 설정용)
 */
courses.get('/:id/attendance-info', async (c) => {
  try {
    const courseId = c.req.param('id');
    const type = c.req.query('type');
    if (type !== 'hrd') {
      return successResponse(c, { session_status: '', training_end_date: null, last_training_date: null });
    }
    const session = await getOne<any>(c.env.DB, `
      SELECT cs.training_end_date, cs.status as session_status
      FROM course_sessions cs
      WHERE cs.id = ?
    `, [courseId]);
    if (!session) {
      return successResponse(c, { session_status: '', training_end_date: null, last_training_date: null });
    }
    const trainingEndDate = (session.training_end_date || '').toString().substring(0, 10);
    let lastTrainingDate = trainingEndDate;
    const lastRow = await c.env.DB.prepare(`
      SELECT training_date FROM session_timetable
      WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
      ORDER BY training_date DESC LIMIT 1
    `).bind(courseId).first() as { training_date: string } | null;
    if (lastRow && lastRow.training_date) {
      lastTrainingDate = lastRow.training_date.toString().substring(0, 10);
    }
    return successResponse(c, {
      session_status: session.session_status || '',
      training_end_date: trainingEndDate || null,
      last_training_date: lastTrainingDate || trainingEndDate || null
    });
  } catch (e: any) {
    console.error('attendance-info error:', e);
    return errorResponse(c, e.message, 500);
  }
});

/**
 * GET /api/courses/:id/attendance
 * 특정 날짜의 출결 현황 조회. :id가 회차 ID면 회차 기준, 아니면 과정 기준
 */
courses.get('/:id/attendance', async (c) => {
  try {
    const courseId = c.req.param('id');
    const date = c.req.query('date'); // YYYY-MM-DD
    const type = c.req.query('type');
    const idNum = parseInt(courseId, 10);
    let isHrd = type === 'hrd';
    if (!isHrd && !isNaN(idNum)) {
      const inCourses = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(idNum).first();
      const inSessions = await c.env.DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(idNum).first();
      if (!inCourses && inSessions) isHrd = true;
    }

    if (!date) {
      return errorResponse(c, '날짜(date) 파라미터가 필요합니다', 400);
    }

    let students: any[] = [];
    let attendanceLogs: any[] = [];
    let defaultStartTime = '09:00';
    let defaultEndTime = '18:00';
    let sessionDetails: any = null;
    let allSessionLogs: any[] = [];
    // timetable 기반 훈련일 수 (isHrd 그룹 이후 학생 루프에서 사용되므로 바깜에 let 선언)
    let timetableTotalDays = 0;           // 과정 전체 훈련일 수 (finalRate 분모)
    let timetableProgressedDays = 0;      // 오늘까지 훈련일 수 (currentRate 분모)
    let allTimetableDates: string[] = []; // is_training_day 판별용 재사용

    if (isHrd) {
      // 0. 회차 정보 조회 (기본 시간 설정 + 마감 여부 + 훈련 기간)
      const session = await getOne<any>(c.env.DB, `
        SELECT cs.training_time_start, cs.training_time_end, cs.training_start_date, cs.training_end_date, cs.status as session_status, ac.total_days, ac.total_hours, ac.daily_hours
        FROM course_sessions cs
        JOIN approved_courses ac ON cs.approved_course_id = ac.id
        WHERE cs.id = ?
      `, [courseId]);
      if (session) {
        if (session.training_time_start) defaultStartTime = session.training_time_start;
        if (session.training_time_end) defaultEndTime = session.training_time_end;
        sessionDetails = session;
      }

      // 1. HRD 회차의 수강생 목록 조회 (배정된 학생 포함: approved, enrolled)
      students = await getAll<any>(c.env.DB, `
        SELECT u.id, u.name, u.phone, e.id as enrollment_id
        FROM course_session_enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.session_id = ? AND e.status IN ('approved', 'enrolled')
      `, [courseId]);

      // 2. 해당 날짜의 출결 기록 조회 (course_session_enrollments ID 사용)
      attendanceLogs = await getAll<any>(c.env.DB, `
        SELECT * FROM attendance_logs 
        WHERE enrollment_id IN (
          SELECT id FROM course_session_enrollments WHERE session_id = ?
        ) AND date = ?
      `, [courseId, date]);

      // 2-1. 전체 출석 기록 조회 (for rate calculation)
      allSessionLogs = await getAll<any>(c.env.DB, `
        SELECT enrollment_id, date, check_in_time as check_in, check_out_time as check_out, status
        FROM attendance_logs
        WHERE enrollment_id IN (
          SELECT id FROM course_session_enrollments WHERE session_id = ?
        )
      `, [courseId]);

      const today2 = new Date().toISOString().split('T')[0];
      const isClosed = (sessionDetails?.session_status || '') === 'closed';

      const { results: timetableRowsData } = await c.env.DB.prepare(`
        SELECT DISTINCT training_date FROM session_timetable
        WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
        ORDER BY training_date ASC
      `).bind(courseId).all() as { results: { training_date: string }[] };

      allTimetableDates = (timetableRowsData || []).map((r: any) => (r.training_date || '').toString().substring(0, 10)).filter(Boolean);
      timetableTotalDays = allTimetableDates.length;
      timetableProgressedDays = isClosed
        ? timetableTotalDays
        : allTimetableDates.filter(d => d <= today2).length;

    } else {
      // 1. 일반 과정의 수강생 목록 조회
      const studentsQuery = `
        SELECT 
          u.id, u.name, u.phone, e.id as enrollment_id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = ? AND e.status = 'approved'
      `;
      students = await getAll<any>(c.env.DB, studentsQuery, [courseId]);

      // 2. 해당 날짜의 출결 기록 조회
      const attendanceQuery = `
        SELECT * FROM attendance_logs 
        WHERE enrollment_id IN (
          SELECT id FROM enrollments WHERE course_id = ?
        ) AND date = ?
      `;
      attendanceLogs = await getAll<any>(c.env.DB, attendanceQuery, [courseId, date]);

      // 2-1. 전체 출결 기록 조회 (for rate calculation)  
      allSessionLogs = await getAll<any>(c.env.DB, `
        SELECT enrollment_id, status
        FROM attendance_logs 
        WHERE enrollment_id IN (
          SELECT id FROM enrollments WHERE course_id = ?
        )
      `, [courseId]);
    }

    // 3. 데이터 병합
    const result = students.map(student => {
      const log = attendanceLogs.find(l => l.enrollment_id === student.enrollment_id);

      const sLogs = allSessionLogs.filter(l => l.enrollment_id === student.enrollment_id);
      let attendance_rate = 0;
      let advanced_attendance: any = null;

      if (type === 'hrd' && sessionDetails) {
        const { total_days, total_hours, daily_hours, training_time_start, training_time_end } = sessionDetails;
        // daily_hours가 명시된 경우 시간 기반(단기) 처리
        // daily_hours가 없을 때만 total_days/total_hours 기준으로 장기 판별
        const isLongTerm = !daily_hours && (total_days >= 10 && total_hours >= 40);

        // ─── 실제 일일 수업 분 계산 ───────────────────────────────────
        // training_time_start/end(예: '19:00'/'22:30')가 있으면 실제 차이를 사용
        // → daily_hours 설정값이 잘못되어도 정확한 값이 반영됨
        // 없으면 daily_hours × 60으로 fallback
        function calcDailyMinutes(start: string, end: string): number {
          if (!start || !end) return 0;
          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);
          const diff = (eh * 60 + em) - (sh * 60 + sm);
          return diff > 0 ? diff : 0;
        }
        const actualDailyMinutes = training_time_start && training_time_end
          ? calcDailyMinutes(training_time_start, training_time_end)
          : (daily_hours || 0) * 60;   // fallback

        const byDate = new Map<string, { check_in?: string; check_out?: string; status?: string }>();
        sLogs.forEach(l => {
          const d = (l.date || '').toString().split('T')[0];
          if (!d) return;

          // 이미 그 날짜에 기록이 있으면, 더 '심각한' 상태를 유지하거나 데이터를 보완
          if (byDate.has(d)) {
            const existing = byDate.get(d)!;
            // 지각 + 조퇴가 각각 들어올 경우 '지각&조퇴'로 격상
            if ((existing.status === 'late' && l.status === 'early_leave') ||
              (existing.status === 'early_leave' && l.status === 'late')) {
              existing.status = 'late_and_early';
            } else if (l.status === 'absent' || l.status === 'absent_under_50') {
              existing.status = l.status; // 결석이 있으면 결석으로
            }
          } else {
            byDate.set(d, { check_in: l.check_in, check_out: l.check_out, status: l.status });
          }
        });

        const daysProgressed = byDate.size;
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        let earlyCount = 0;
        let outingCount = 0;
        let accumulatedMinutes = 0;

        byDate.forEach((day) => {
          const { status, check_in, check_out } = day;

          if (status === 'present') presentCount++;
          else if (status === 'absent' || status === 'absent_under_50') absentCount++;
          else if (status === 'late') lateCount++;
          else if (status === 'early_leave') earlyCount++;
          else if (status === 'public_leave') outingCount++;
          else if (status === 'late_and_early') {
            lateCount++;
            earlyCount++;
          }

          if (!isLongTerm) {
            // 결석(absent, absent_under_50)인 날은 0분
            // 그 외는 실제 수업 시간(training_time start~end) 기준 분 고정
            const isAbsent = status === 'absent' || status === 'absent_under_50';
            if (!isAbsent) {
              accumulatedMinutes += actualDailyMinutes;
            }
          }
        });

        if (isLongTerm) {
          // 지각/조퇴/외출 합산 3회당 결석 1일
          const penaltyDays = Math.floor((lateCount + earlyCount + outingCount) / 3);
          const totalAbsentConverted = absentCount + penaltyDays;

          const currentAttendanceRate = daysProgressed > 0
            ? Math.max(0, ((daysProgressed - totalAbsentConverted) / daysProgressed) * 100).toFixed(1)
            : '0.0';
          const finalAttendanceRate = total_days > 0
            ? Math.max(0, ((total_days - totalAbsentConverted) / total_days) * 100).toFixed(1)
            : '0.0';

          attendance_rate = parseFloat(currentAttendanceRate);
          advanced_attendance = {
            type: 'days',
            isLongTerm: true,
            daysProgressed,
            totalDays: total_days,
            absent: absentCount,
            late: lateCount,
            early: earlyCount,
            outing: outingCount,
            totalAbsentConverted,
            currentRate: currentAttendanceRate,
            finalRate: finalAttendanceRate
          };
        } else {
          // 단기(시간 기반) 과정
          // ▪ expectedTotalMinutes   : timetable 전체 훈련일 수 × actualDailyMinutes
          // ▪ expectedCurrentMinutes : timetable 오늘까지 훈련일 수 × actualDailyMinutes
          const expectedTotalMinutes = timetableTotalDays > 0
            ? Math.round(timetableTotalDays * actualDailyMinutes)
            : (total_hours > 0 ? Math.round(total_hours * 60) : 0);
          const expectedCurrentMinutes = timetableProgressedDays > 0
            ? Math.round(timetableProgressedDays * actualDailyMinutes)
            : (daysProgressed > 0 ? Math.round(daysProgressed * actualDailyMinutes) : 0);

          // 분자: 결석일 제외 실제 누적분 (클램핑 없음)
          const rawAccumulated = Math.round(accumulatedMinutes);

          // currentRate: 현재 진행일 기준 출석률
          const currentAttendanceRate = expectedCurrentMinutes > 0
            ? Math.min(100, (rawAccumulated / expectedCurrentMinutes) * 100).toFixed(1)
            : '0.0';
          // finalRate: 전체 과정 기준 수료 예상 출석률
          const finalAttendanceRate = expectedTotalMinutes > 0
            ? Math.min(100, (rawAccumulated / expectedTotalMinutes) * 100).toFixed(1)
            : '0.0';

          attendance_rate = parseFloat(currentAttendanceRate);
          advanced_attendance = {
            type: 'minutes',
            isLongTerm: false,
            accumulatedMinutes: rawAccumulated,
            expectedCurrentMinutes,
            expectedTotalMinutes,
            currentRate: currentAttendanceRate,
            finalRate: finalAttendanceRate,
            absent: absentCount,
            late: lateCount,
            early: earlyCount,
            outing: outingCount,
          };
        }
      } else {
        const totalLogs = sLogs.length;
        const absentLogs = sLogs.filter((l: any) => l.status === 'absent' || l.status === 'absent_under_50').length;
        attendance_rate = totalLogs > 0 ? Math.round(((totalLogs - absentLogs) / totalLogs) * 100) : 0;
      }

      return {
        id: student.id,
        enrollment_id: student.enrollment_id,
        name: student.name,
        phone: student.phone,
        check_in: log ? log.check_in_time : null,
        check_out: log ? log.check_out_time : null,
        status: log ? log.status : null, // 기록 없으면 null (프론트에서 처리)
        note: log ? log.note : null,
        has_log: !!log,
        attendance_rate,
        advanced_attendance
      };
    });

    const payload: Record<string, unknown> = {
      date,
      students: result,
      default_start_time: defaultStartTime,
      default_end_time: defaultEndTime
    };
    if (type === 'hrd' && sessionDetails) {
      if (sessionDetails.session_status) payload.session_status = sessionDetails.session_status;
      const dateStr = (date || '').toString().substring(0, 10);
      let isTrainingDay = false;
      // allTimetableDates는 위 isHrd 블록에서 이미 조회됨 → 재사용 (중복 DB 조회 없음)
      if (allTimetableDates.length > 0) {
        isTrainingDay = new Set(allTimetableDates).has(dateStr);
      } else {
        // timetable이 없으면 훈련 기간 범위로 판별 (fallback)
        const start = (sessionDetails.training_start_date || '').toString().substring(0, 10);
        const end = (sessionDetails.training_end_date || '').toString().substring(0, 10);
        if (start && end && dateStr >= start && dateStr <= end) isTrainingDay = true;
      }
      payload.is_training_day = isTrainingDay;
    }

    // ── 전체 과정 기간 누적 통계 (enrollment_id + 날짜 기준 중복 제거) ──
    const totalStats: Record<string, number> = {
      present: 0, late: 0, early_leave: 0, absent: 0,
      public_leave: 0, absent_under_50: 0, late_and_early: 0
    };
    // "enrollmentId_date" → 최종 상태 맵
    const byEnrollmentDate = new Map<string, string>();
    allSessionLogs.forEach((log: any) => {
      const d = (log.date || '').toString().split('T')[0];
      if (!d) return;
      const key = `${log.enrollment_id}_${d}`;
      const newStatus = log.status || 'present';
      const existing = byEnrollmentDate.get(key);
      if (!existing) {
        byEnrollmentDate.set(key, newStatus);
      } else {
        if ((existing === 'late' && newStatus === 'early_leave') ||
          (existing === 'early_leave' && newStatus === 'late')) {
          byEnrollmentDate.set(key, 'late_and_early');
        } else if (newStatus === 'absent' || newStatus === 'absent_under_50') {
          byEnrollmentDate.set(key, newStatus);
        }
      }
    });
    byEnrollmentDate.forEach((status) => {
      if (totalStats[status] !== undefined) totalStats[status]++;
    });
    payload.total_stats = totalStats;

    return successResponse(c, payload);

  } catch (error) {
    console.error('Get attendance error:', error);
    return errorResponse(c, '출결 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /api/courses/:id/attendance
 * 출결 기록 저장 (enrollment_id 기준이라 :id는 로그용)
 */
courses.post('/:id/attendance', async (c) => {
  try {
    const courseId = c.req.param('id');
    const body = await c.req.json();
    const { date, records } = body;

    if (!date || !records || !Array.isArray(records)) {
      return errorResponse(c, '유효하지 않은 데이터입니다', 400);
    }

    // 트랜잭션 처리가 이상적이나, D1은 아직 완벽한 트랜잭션을 지원하지 않을 수 있음 (배치 실행 권장)
    // 여기서는 루프를 돌며 처리 (성능 개선 필요 시 배치 쿼리로 변경)

    for (const record of records) {
      // 기존 기록 확인
      const existingLog = await getOne<any>(
        c.env.DB,
        'SELECT id FROM attendance_logs WHERE enrollment_id = ? AND date = ?',
        [record.enrollment_id, date]
      );

      if (existingLog) {
        // 업데이트
        await execute(
          c.env.DB,
          `UPDATE attendance_logs SET 
            check_in_time = ?, check_out_time = ?, status = ?, note = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [record.check_in || null, record.check_out || null, record.status, record.note || null, existingLog.id]
        );
      } else {
        // 신규 등록
        await execute(
          c.env.DB,
          `INSERT INTO attendance_logs (enrollment_id, date, check_in_time, check_out_time, status, note)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [record.enrollment_id, date, record.check_in || null, record.check_out || null, record.status, record.note || null]
        );
      }
    }

    return successResponse(c, null, '출결 기록이 저장되었습니다');

  } catch (error) {
    console.error('Save attendance error:', error);
    return errorResponse(c, '출결 저장 중 오류가 발생했습니다', 500);
  }
});

export default courses;
