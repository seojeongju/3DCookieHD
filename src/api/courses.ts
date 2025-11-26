// ============================================
// 과정 API
// ============================================

import { Hono } from 'hono';
import type { Bindings, Course, CourseFilter } from '../types';
import { successResponse, errorResponse, notFoundResponse, paginatedResponse } from '../utils/response';
import { getOne, getAll, execute, calculatePagination } from '../utils/database';

const courses = new Hono<{ Bindings: Bindings }>();

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

    if (filter.category) {
      conditions.push('c.category = ?');
      params.push(filter.category);
    }

    if (filter.status) {
      conditions.push('c.status = ?');
      params.push(filter.status);
    } else {
      conditions.push('c.status = ?');
      params.push('active');
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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 정렬 조건
    let orderBy = 'c.created_at DESC'; // 기본: 최신순
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

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      LEFT JOIN campuses camp ON c.campus_id = camp.id
      ${whereClause}
    `;

    const countResult = await getOne<{ total: number }>(c.env.DB, countQuery, params);
    const total = countResult?.total || 0;

    // 과정 목록 조회
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
    const id = c.req.param('id');

    // 조회수 증가
    await execute(
      c.env.DB,
      'UPDATE courses SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    // 과정 상세 정보 조회
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

    if (!course) {
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
courses.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      title, subtitle, category, description, curriculum,
      duration_months, duration_hours, price, discount_price,
      thumbnail_url, detail_images, campus_id, teacher_id,
      max_students, start_date, end_date, schedule, tags
    } = body;

    // 필수 필드 검증
    if (!title || !category) {
      return errorResponse(c, '과정명과 카테고리는 필수입니다', 400);
    }

    // 과정 생성
    const result = await execute(
      c.env.DB,
      `INSERT INTO courses (
        title, subtitle, category, description, curriculum,
        duration_months, duration_hours, price, discount_price,
        thumbnail_url, detail_images, campus_id, teacher_id,
        max_students, start_date, end_date, schedule, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, subtitle || null, category, description || null,
        curriculum ? JSON.stringify(curriculum) : null,
        duration_months || null, duration_hours || null, price || 0, discount_price || null,
        thumbnail_url || null,
        detail_images ? JSON.stringify(detail_images) : null,
        campus_id || null, teacher_id || null, max_students || 20,
        start_date || null, end_date || null, schedule || null,
        tags ? JSON.stringify(tags) : null
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
 * 과정 수정 (관리자 전용)
 */
courses.put('/:id', async (c) => {
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
      'title', 'subtitle', 'category', 'description',
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
 */
courses.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // 과정 존재 확인
    const course = await getOne<Course>(c.env.DB, 'SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return notFoundResponse(c, '과정을 찾을 수 없습니다');
    }

    // 수강생이 있는지 확인
    const enrollmentCount = await getOne<{ count: number }>(
      c.env.DB,
      'SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?',
      [id]
    );

    if (enrollmentCount && enrollmentCount.count > 0) {
      return errorResponse(c, '수강생이 있는 과정은 삭제할 수 없습니다', 400);
    }

    // 과정 삭제
    await execute(c.env.DB, 'DELETE FROM courses WHERE id = ?', [id]);

    return successResponse(c, null, '과정이 삭제되었습니다');

  } catch (error) {
    console.error('Delete course error:', error);
    return errorResponse(c, '과정 삭제 중 오류가 발생했습니다', 500);
  }
});

export default courses;
