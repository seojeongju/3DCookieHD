import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const STATUS_VALUES = ['recruiting', 'in_progress', 'completed', 'always_open', 'closed'] as const;

const app = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/course-sessions/stats
 * 진행상황별 건수 (검색 조건 적용)
 */
app.get('/stats', authMiddleware, requireAdmin, async (c) => {
  try {
    const categoryId = c.req.query('category_id');
    const approvedCourseId = c.req.query('approved_course_id');
    const name = c.req.query('name');
    const instructorName = c.req.query('instructor_name');
    const trainingStartFrom = c.req.query('training_start_from');

    const { DB } = c.env;
    const params: (string | number)[] = [];
    const conditions: string[] = ['1=1'];
    if (approvedCourseId !== undefined && approvedCourseId !== '') {
      conditions.push('s.approved_course_id = ?');
      params.push(approvedCourseId);
    }
    if (categoryId !== undefined && categoryId !== '') {
      conditions.push('a.category_id = ?');
      params.push(categoryId);
    }
    if (name !== undefined && name !== '') {
      conditions.push('a.name LIKE ?');
      params.push('%' + name + '%');
    }
    if (instructorName !== undefined && instructorName !== '') {
      conditions.push('a.instructor_name LIKE ?');
      params.push('%' + instructorName + '%');
    }
    if (trainingStartFrom !== undefined && trainingStartFrom !== '') {
      conditions.push('s.training_start_date >= ?');
      params.push(trainingStartFrom);
    }
    const whereClause = conditions.join(' AND ');

    const rows = await DB.prepare(
      `SELECT s.status, COUNT(*) as cnt
       FROM course_sessions s
       INNER JOIN approved_courses a ON a.id = s.approved_course_id
       WHERE ${whereClause}
       GROUP BY s.status`
    )
      .bind(...params)
      .all();

    const list = (rows.results || []) as { status: string; cnt: number }[];
    const stats: Record<string, number> = {};
    STATUS_VALUES.forEach((s) => (stats[s] = 0));
    list.forEach((r) => (stats[r.status] = r.cnt));
    return c.json({ success: true, data: stats });
  } catch (e) {
    console.error('course-sessions stats:', e);
    return c.json({ success: false, error: '통계 조회 실패' }, 500);
  }
});

/**
 * GET /api/course-sessions
 * 회차별 과정 목록 (필터·페이지네이션)
 */
app.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const categoryId = c.req.query('category_id');
    const approvedCourseId = c.req.query('approved_course_id');
    const status = c.req.query('status');
    const name = c.req.query('name');
    const instructorName = c.req.query('instructor_name');
    const trainingStartFrom = c.req.query('training_start_from');
    const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '15', 10)));
    const offset = (page - 1) * limit;

    const { DB } = c.env;
    const params: (string | number)[] = [];
    const conditions: string[] = ['1=1'];
    if (approvedCourseId !== undefined && approvedCourseId !== '') {
      conditions.push('s.approved_course_id = ?');
      params.push(approvedCourseId);
    }
    if (categoryId !== undefined && categoryId !== '') {
      conditions.push('a.category_id = ?');
      params.push(categoryId);
    }
    if (status !== undefined && status !== '') {
      conditions.push('s.status = ?');
      params.push(status);
    }
    if (name !== undefined && name !== '') {
      conditions.push('a.name LIKE ?');
      params.push('%' + name + '%');
    }
    if (instructorName !== undefined && instructorName !== '') {
      conditions.push('a.instructor_name LIKE ?');
      params.push('%' + instructorName + '%');
    }
    if (trainingStartFrom !== undefined && trainingStartFrom !== '') {
      conditions.push('s.training_start_date >= ?');
      params.push(trainingStartFrom);
    }
    const whereClause = conditions.join(' AND ');

    const countRow = await DB.prepare(
      `SELECT COUNT(*) as total FROM course_sessions s INNER JOIN approved_courses a ON a.id = s.approved_course_id WHERE ${whereClause}`
    )
      .bind(...params)
      .first<{ total: number }>();
    const total = countRow?.total ?? 0;

    params.push(limit, offset);
    const rows = await DB.prepare(
      `SELECT s.id, s.approved_course_id, s.session_number, s.status,
              s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
              s.registered_at, s.created_at,
              a.name as course_name, a.category_id, a.instructor_name,
              c.name as category_name
       FROM course_sessions s
       INNER JOIN approved_courses a ON a.id = s.approved_course_id
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE ${whereClause}
       ORDER BY s.training_start_date DESC, s.id DESC
       LIMIT ? OFFSET ?`
    )
      .bind(...params)
      .all();

    const list = (rows.results || []) as Record<string, unknown>[];
    return c.json({
      success: true,
      data: list,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error('course-sessions list:', e);
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/**
 * POST /api/course-sessions
 */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{
      approved_course_id: number;
      session_number: number;
      status?: string;
      instructor_name?: string;
      target_audience?: string | string[];
      days_of_week?: string | string[];
      location?: string;
      training_start_date?: string;
      training_end_date?: string;
      url_ncs?: string;
      url_plan?: string;
      url_detail_plan?: string;
      registered_at?: string;
      recruitment_status?: string;
      representative_image_exposure?: string;
      recruitment_grace_period?: number;
      syllabus_exposure?: string;
      main_slide_image_url?: string;
      course_list_image_url?: string;
      course_detail_description?: string;
    }>();
    const approvedCourseId = body.approved_course_id;
    const sessionNumber = body.session_number;
    if (approvedCourseId == null || sessionNumber == null) {
      return c.json({ success: false, error: '승인과정 ID와 회차를 입력하세요' }, 400);
    }
    const status = (body.status && STATUS_VALUES.includes(body.status as any)) ? body.status : 'recruiting';
    const instructorName = (body.instructor_name || '').trim() || null;
    const targetAudience = Array.isArray(body.target_audience) ? body.target_audience.join(',') : (typeof body.target_audience === 'string' ? body.target_audience.trim() : null) || null;
    const daysOfWeek = Array.isArray(body.days_of_week) ? body.days_of_week.join(',') : (typeof body.days_of_week === 'string' ? body.days_of_week.trim() : null) || null;
    const location = (body.location || '').trim() || null;
    const trainingStart = (body.training_start_date || '').trim() || null;
    const trainingEnd = (body.training_end_date || '').trim() || null;
    const urlNcs = (body.url_ncs || '').trim() || null;
    const urlPlan = (body.url_plan || '').trim() || null;
    const urlDetailPlan = (body.url_detail_plan || '').trim() || null;
    const registeredAt = (body.registered_at || '').trim() || null;
    const recruitmentStatus = (body.recruitment_status || 'normal').trim() || 'normal';
    const representativeImageExposure = (body.representative_image_exposure || 'expose').trim() || 'expose';
    const recruitmentGracePeriod = typeof body.recruitment_grace_period === 'number' ? body.recruitment_grace_period : (parseInt(String(body.recruitment_grace_period || '0'), 10) || 0);
    const syllabusExposure = (body.syllabus_exposure || 'hide').trim() || 'hide';
    const mainSlideImageUrl = (body.main_slide_image_url || '').trim() || null;
    const courseListImageUrl = (body.course_list_image_url || '').trim() || null;
    const courseDetailDescription = (body.course_detail_description || '').trim() || null;

    const { DB } = c.env;
    const existing = await DB.prepare(
      'SELECT id FROM course_sessions WHERE approved_course_id = ? AND session_number = ?'
    )
      .bind(approvedCourseId, sessionNumber)
      .first();
    if (existing) return c.json({ success: false, error: '이미 같은 회차가 등록되어 있습니다' }, 400);

    try {
      await DB.prepare(
        `INSERT INTO course_sessions (
          approved_course_id, session_number, status, instructor_name, target_audience, days_of_week, location,
          training_start_date, training_end_date, url_ncs, url_plan, url_detail_plan, registered_at,
          recruitment_status, representative_image_exposure, recruitment_grace_period, syllabus_exposure,
          main_slide_image_url, course_list_image_url, course_detail_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(approvedCourseId, sessionNumber, status, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure, mainSlideImageUrl, courseListImageUrl, courseDetailDescription)
        .run();
    } catch (err: unknown) {
      const msg = String(err && typeof err === 'object' && 'message' in err ? (err as Error).message : err);
      if (/recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msg)) {
        try {
          await DB.prepare(
            `INSERT INTO course_sessions (
              approved_course_id, session_number, status, instructor_name, target_audience, days_of_week, location,
              training_start_date, training_end_date, url_ncs, url_plan, url_detail_plan, registered_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(approvedCourseId, sessionNumber, status, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt)
            .run();
        } catch (err2: unknown) {
          const msg2 = String(err2 && typeof err2 === 'object' && 'message' in err2 ? (err2 as Error).message : err2);
          if (/instructor_name|target_audience|days_of_week|location|no such column/i.test(msg2)) {
            await DB.prepare(
              `INSERT INTO course_sessions (
                approved_course_id, session_number, status, training_start_date, training_end_date,
                url_ncs, url_plan, url_detail_plan, registered_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(approvedCourseId, sessionNumber, status, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt)
              .run();
          } else throw err2;
        }
      } else throw err;
    }

    const row = await DB.prepare(
      `SELECT s.id, s.approved_course_id, s.session_number, s.status,
              s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
              s.registered_at, s.created_at, a.name as course_name, a.instructor_name, c.name as category_name
       FROM course_sessions s
       INNER JOIN approved_courses a ON a.id = s.approved_course_id
       LEFT JOIN course_categories c ON c.id = a.category_id
       ORDER BY s.id DESC LIMIT 1`
    ).first();
    return c.json({ success: true, data: row }, 201);
  } catch (e) {
    console.error('course-sessions create:', e);
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/**
 * GET /api/course-sessions/:id
 */
app.get('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const { DB } = c.env;
    let row: Record<string, unknown> | null = null;
    try {
      row = await DB.prepare(
        `SELECT s.id, s.approved_course_id, s.session_number, s.status,
                s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
                s.registered_at, s.created_at, s.target_audience, s.days_of_week, s.location,
                s.recruitment_status, s.representative_image_exposure, s.recruitment_grace_period,
                s.syllabus_exposure, s.main_slide_image_url, s.course_list_image_url, s.course_detail_description,
                a.name as course_name, a.instructor_name, c.name as category_name
         FROM course_sessions s
         INNER JOIN approved_courses a ON a.id = s.approved_course_id
         LEFT JOIN course_categories c ON c.id = a.category_id
         WHERE s.id = ?`
      )
        .bind(id)
        .first() as Record<string, unknown> | null;
    } catch {
      try {
        row = await DB.prepare(
          `SELECT s.id, s.approved_course_id, s.session_number, s.status,
                  s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
                  s.registered_at, s.created_at, s.target_audience, s.days_of_week, s.location,
                  a.name as course_name, a.instructor_name, c.name as category_name
           FROM course_sessions s
           INNER JOIN approved_courses a ON a.id = s.approved_course_id
           LEFT JOIN course_categories c ON c.id = a.category_id
           WHERE s.id = ?`
        )
          .bind(id)
          .first() as Record<string, unknown> | null;
      } catch {
        row = await DB.prepare(
          `SELECT s.id, s.approved_course_id, s.session_number, s.status,
                  s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
                  s.registered_at, s.created_at, a.name as course_name, a.instructor_name, c.name as category_name
           FROM course_sessions s
           INNER JOIN approved_courses a ON a.id = s.approved_course_id
           LEFT JOIN course_categories c ON c.id = a.category_id
           WHERE s.id = ?`
        )
          .bind(id)
          .first() as Record<string, unknown> | null;
      }
    }
    if (!row) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('course-sessions get:', e);
    return c.json({ success: false, error: '조회 실패' }, 500);
  }
});

/**
 * PUT /api/course-sessions/:id
 */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const body = await c.req.json<{
      status?: string;
      instructor_name?: string;
      target_audience?: string | string[];
      days_of_week?: string | string[];
      location?: string;
      training_start_date?: string;
      training_end_date?: string;
      url_ncs?: string;
      url_plan?: string;
      url_detail_plan?: string;
      registered_at?: string;
      recruitment_status?: string;
      representative_image_exposure?: string;
      recruitment_grace_period?: number;
      syllabus_exposure?: string;
      main_slide_image_url?: string;
      course_list_image_url?: string;
      course_detail_description?: string;
    }>();

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);

    const status = (body.status && STATUS_VALUES.includes(body.status as any)) ? body.status : undefined;
    const instructorName = (body.instructor_name || '').trim() || null;
    const targetAudience = Array.isArray(body.target_audience) ? body.target_audience.join(',') : (typeof body.target_audience === 'string' ? body.target_audience.trim() : null) || null;
    const daysOfWeek = Array.isArray(body.days_of_week) ? body.days_of_week.join(',') : (typeof body.days_of_week === 'string' ? body.days_of_week.trim() : null) || null;
    const location = (body.location || '').trim() || null;
    const trainingStart = (body.training_start_date || '').trim() || null;
    const trainingEnd = (body.training_end_date || '').trim() || null;
    const urlNcs = (body.url_ncs || '').trim() || null;
    const urlPlan = (body.url_plan || '').trim() || null;
    const urlDetailPlan = (body.url_detail_plan || '').trim() || null;
    const registeredAt = (body.registered_at || '').trim() || null;
    const recruitmentStatus = (body.recruitment_status || '').trim() || null;
    const representativeImageExposure = (body.representative_image_exposure || '').trim() || null;
    const recruitmentGracePeriod = body.recruitment_grace_period != null ? (typeof body.recruitment_grace_period === 'number' ? body.recruitment_grace_period : parseInt(String(body.recruitment_grace_period), 10) || 0) : null;
    const syllabusExposure = (body.syllabus_exposure || '').trim() || null;
    const mainSlideImageUrl = (body.main_slide_image_url || '').trim() || null;
    const courseListImageUrl = (body.course_list_image_url || '').trim() || null;
    const courseDetailDescription = (body.course_detail_description || '').trim() || null;

    try {
      await DB.prepare(
        `UPDATE course_sessions SET
          status = COALESCE(?, status), instructor_name = ?, target_audience = ?, days_of_week = ?, location = ?,
          training_start_date = ?, training_end_date = ?,
          url_ncs = ?, url_plan = ?, url_detail_plan = ?, registered_at = ?,
          recruitment_status = COALESCE(?, recruitment_status), representative_image_exposure = COALESCE(?, representative_image_exposure),
          recruitment_grace_period = COALESCE(?, recruitment_grace_period), syllabus_exposure = COALESCE(?, syllabus_exposure),
          main_slide_image_url = ?, course_list_image_url = ?, course_detail_description = ?
         WHERE id = ?`
      )
        .bind(status ?? null, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure, mainSlideImageUrl, courseListImageUrl, courseDetailDescription, id)
        .run();
    } catch (err: unknown) {
      const msg = String(err && typeof err === 'object' && 'message' in err ? (err as Error).message : err);
      if (/recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msg)) {
        try {
          await DB.prepare(
            `UPDATE course_sessions SET
              status = COALESCE(?, status), instructor_name = ?, target_audience = ?, days_of_week = ?, location = ?,
              training_start_date = ?, training_end_date = ?,
              url_ncs = ?, url_plan = ?, url_detail_plan = ?, registered_at = ?
             WHERE id = ?`
          )
            .bind(status ?? null, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, id)
            .run();
        } catch (err2: unknown) {
          const msg2 = String(err2 && typeof err2 === 'object' && 'message' in err2 ? (err2 as Error).message : err2);
          if (/instructor_name|target_audience|days_of_week|location|no such column/i.test(msg2)) {
            await DB.prepare(
              `UPDATE course_sessions SET
                status = COALESCE(?, status), training_start_date = ?, training_end_date = ?,
                url_ncs = ?, url_plan = ?, url_detail_plan = ?, registered_at = ?
               WHERE id = ?`
            )
              .bind(status ?? null, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, id)
              .run();
          } else throw err2;
        }
      } else throw err;
    }

    const row = await DB.prepare(
      `SELECT s.id, s.approved_course_id, s.session_number, s.status,
              s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
              s.registered_at, s.created_at, a.name as course_name, a.instructor_name, c.name as category_name
       FROM course_sessions s
       INNER JOIN approved_courses a ON a.id = s.approved_course_id
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE s.id = ?`
    )
      .bind(id)
      .first();
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('course-sessions update:', e);
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/**
 * DELETE /api/course-sessions/:id
 */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);
    await DB.prepare('DELETE FROM course_sessions WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: '삭제되었습니다' });
  } catch (e) {
    console.error('course-sessions delete:', e);
    return c.json({ success: false, error: '삭제 실패' }, 500);
  }
});

export default app;
