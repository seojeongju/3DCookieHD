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

/** 연동 홈페이지 노출용 컬럼 (0059). 없으면 무시 */
const LINKED_HOMEPAGE_COLS = `s.recruitment_status, s.representative_image_exposure, s.recruitment_grace_period,
  s.syllabus_exposure, s.main_slide_image_url, s.course_list_image_url, s.course_detail_description, s.session_name`;

/**
 * GET /api/course-sessions/public
 * 연동 홈페이지용 회차 목록 (인증 없음). 모집중/상시모집/진행중 위주 노출
 */
app.get('/public', async (c) => {
  try {
    const status = c.req.query('status');
    const categoryName = c.req.query('category');
    const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '12', 10)));
    const offset = (page - 1) * limit;
    const { DB } = c.env;

    // 1. 공통 필터 구성
    const params: (string | number)[] = [];

    // Status Filter
    let sessionStatusFilter = "";
    let generalStatusFilter = "";
    if (status && status.trim() !== '') {
      sessionStatusFilter = " AND s.status = ?";
      generalStatusFilter = " AND (CASE WHEN c.status = 'active' THEN 'recruiting' ELSE 'completed' END) = ?";
      params.push(status.trim());
    } else {
      sessionStatusFilter = " AND s.status IN ('recruiting', 'always_open', 'in_progress')";
      generalStatusFilter = " AND c.status = 'active'";
    }

    // Category Filter
    let sessionCategoryFilter = "";
    let generalCategoryFilter = "";
    if (categoryName && categoryName.trim() !== '') {
      sessionCategoryFilter = " AND cat.name LIKE ?";
      generalCategoryFilter = " AND c.category LIKE ?";
      params.push('%' + categoryName.trim() + '%');
    }

    // Parameters for UNION: we need to repeat params for both parts if they are identical
    // But D1 prepare doesn't support named parameters easily across UNION, so we duplicate
    const unionParams = [...params, ...params];

    // 2. 카운트 쿼리
    const totalRow = await DB.prepare(`
      SELECT SUM(total) as total FROM (
        SELECT COUNT(*) as total FROM course_sessions s
        LEFT JOIN approved_courses a ON a.id = s.approved_course_id
        LEFT JOIN course_categories cat ON cat.id = a.category_id
        WHERE (s.homepage_exposed = 1 OR s.homepage_exposed IS NULL) ${sessionStatusFilter} ${sessionCategoryFilter}
        UNION ALL
        SELECT COUNT(*) as total FROM courses c
        WHERE c.status != 'deleted' ${generalStatusFilter} ${generalCategoryFilter}
      )
    `).bind(...unionParams).first<{ total: number }>();

    const total = totalRow?.total ?? 0;

    // 3. 목록 데이터 (UNION)
    unionParams.push(limit, offset);
    const rows = await DB.prepare(`
      SELECT * FROM (
        SELECT 
          'session' as source,
          s.id,
          a.name as course_name,
          cat.name as category_name,
          s.status,
          s.training_start_date,
          s.training_end_date,
          s.instructor_name,
          COALESCE(NULLIF(s.course_list_image_url, ''), NULLIF(s.main_slide_image_url, ''), '/static/course_placeholder.jpg') as image_url,
          s.session_number,
          s.session_name
        FROM course_sessions s
        INNER JOIN approved_courses a ON a.id = s.approved_course_id
        LEFT JOIN course_categories cat ON cat.id = a.category_id
        WHERE (s.homepage_exposed = 1 OR s.homepage_exposed IS NULL) ${sessionStatusFilter} ${sessionCategoryFilter}
        
        UNION ALL
        
        SELECT 
          'general' as source,
          c.id,
          c.title as course_name,
          c.category as category_name,
          CASE WHEN c.status = 'active' THEN 'recruiting' ELSE 'completed' END as status,
          c.start_date as training_start_date,
          c.end_date as training_end_date,
          NULL as instructor_name,
          COALESCE(NULLIF(c.thumbnail_url, ''), '/static/course_placeholder.jpg') as image_url,
          NULL as session_number,
          NULL as session_name
        FROM courses c
        WHERE c.status != 'deleted' ${generalStatusFilter} ${generalCategoryFilter}
      )
      ORDER BY training_start_date DESC, id DESC
      LIMIT ? OFFSET ?
    `).bind(...unionParams).all();

    return c.json({
      success: true,
      data: rows.results || [],
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error('course-sessions unified public list:', e);
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/**
 * GET /api/course-sessions/public/:id
 * 연동 홈페이지용 회차 상세 (인증 없음)
 */
app.get('/public/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const source = c.req.query('source'); // 'session' | 'general'
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const { DB } = c.env;
    let row: Record<string, unknown> | null = null;

    if (source === 'general') {
      row = await DB.prepare(
        `SELECT 
          c.id, 
          c.title as course_name, 
          c.category as category_name, 
          CASE WHEN c.status = 'active' THEN 'recruiting' ELSE 'completed' END as status,
          c.start_date as training_start_date, 
          c.end_date as training_end_date,
          c.duration_hours as total_hours,
          c.thumbnail_url as image_url,
          c.description as course_detail_description,
          NULL as session_number,
          NULL as instructor_name,
          NULL as location,
          NULL as url_plan,
          'none' as syllabus_exposure
        FROM courses c
        WHERE c.id = ?`
      ).bind(id).first() as Record<string, unknown> | null;
    } else {
      try {
        row = await DB.prepare(
          `SELECT s.id, s.approved_course_id, s.session_number, s.session_name, s.status,
            s.training_start_date, s.training_end_date, s.instructor_name,
            s.target_audience, s.days_of_week, s.location,
            s.url_plan, s.url_detail_plan,
            ${LINKED_HOMEPAGE_COLS},
            a.name as course_name, a.total_hours, a.daily_hours, a.instructor_name as course_instructor,
            cat.name as category_name
           FROM course_sessions s
           INNER JOIN approved_courses a ON a.id = s.approved_course_id
           LEFT JOIN course_categories cat ON cat.id = a.category_id
           WHERE s.id = ?`
        ).bind(id).first() as Record<string, unknown> | null;
      } catch {
        row = await DB.prepare(
          `SELECT s.id, s.approved_course_id, s.session_number, s.session_name, s.status,
            s.training_start_date, s.training_end_date, s.instructor_name,
            s.target_audience, s.days_of_week, s.location,
            s.url_plan, s.url_detail_plan,
            a.name as course_name, a.total_hours, a.daily_hours,
            cat.name as category_name
           FROM course_sessions s
           INNER JOIN approved_courses a ON a.id = s.approved_course_id
           LEFT JOIN course_categories cat ON cat.id = a.category_id
           WHERE s.id = ?`
        ).bind(id).first() as Record<string, unknown> | null;
      }
    }
    if (!row) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('course-sessions public get:', e);
    return c.json({ success: false, error: '상세 조회 실패' }, 500);
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
    let rows: { results: Record<string, unknown>[] };
    try {
      rows = await DB.prepare(
        `SELECT s.id, s.approved_course_id, s.session_number, s.session_name, s.status,
                s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
                s.registered_at, s.created_at, s.homepage_exposed,
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
        .all() as { results: Record<string, unknown>[] };
    } catch (e) {
      if (!/session_name|homepage_exposed|no such column/i.test(String((e as Error)?.message ?? e))) throw e;
      rows = await DB.prepare(
        `SELECT s.id, s.approved_course_id, s.session_number, s.status,
                s.training_start_date, s.training_end_date, s.url_ncs, s.url_plan, s.url_detail_plan,
                s.registered_at, s.created_at, s.homepage_exposed,
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
        .all() as { results: Record<string, unknown>[] };
    }

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
      training_time_start?: string;
      training_time_end?: string;
      lunch_time_start?: string;
      lunch_time_end?: string;
      homepage_exposed?: number | boolean;
      session_name?: string;
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
    const trainingTimeStart = (body.training_time_start || '').trim() || null;
    const trainingTimeEnd = (body.training_time_end || '').trim() || null;
    const lunchTimeStart = (body.lunch_time_start || '').trim() || null;
    const lunchTimeEnd = (body.lunch_time_end || '').trim() || null;
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
    const homepageExposed = body.homepage_exposed === true || body.homepage_exposed === 1 ? 1 : 0;
    const sessionName = (body.session_name || '').trim() || null;

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
          training_start_date, training_end_date, training_time_start, training_time_end, lunch_time_start, lunch_time_end,
          url_ncs, url_plan, url_detail_plan, registered_at,
          recruitment_status, representative_image_exposure, recruitment_grace_period, syllabus_exposure,
          main_slide_image_url, course_list_image_url, course_detail_description, homepage_exposed, session_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(approvedCourseId, sessionNumber, status, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, trainingTimeStart, trainingTimeEnd, lunchTimeStart, lunchTimeEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure, mainSlideImageUrl, courseListImageUrl, courseDetailDescription, homepageExposed, sessionName)
        .run();
    } catch (err: unknown) {
      const msg = String(err && typeof err === 'object' && 'message' in err ? (err as Error).message : err);
      if (/session_name|no such column/i.test(msg) && /session_name/i.test(msg)) {
        return c.json({ success: false, error: '회차별과정명을 저장하려면 DB 마이그레이션 0062를 적용하세요. (npm run db:migrate:prod)' }, 400);
      }
      if (/homepage_exposed|training_time_start|training_time_end|lunch_time_start|lunch_time_end|recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msg)) {
        try {
          await DB.prepare(
            `INSERT INTO course_sessions (
              approved_course_id, session_number, status, instructor_name, target_audience, days_of_week, location,
              training_start_date, training_end_date, url_ncs, url_plan, url_detail_plan, registered_at,
              recruitment_status, representative_image_exposure, recruitment_grace_period, syllabus_exposure,
              main_slide_image_url, course_list_image_url, course_detail_description, session_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(approvedCourseId, sessionNumber, status, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure, mainSlideImageUrl, courseListImageUrl, courseDetailDescription, sessionName)
            .run();
        } catch (errFallback: unknown) {
          const msgF = String(errFallback && typeof errFallback === 'object' && 'message' in errFallback ? (errFallback as Error).message : errFallback);
          if (/recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msgF)) {
            try {
              await DB.prepare(
                `INSERT INTO course_sessions (
                  approved_course_id, session_number, status, instructor_name, target_audience, days_of_week, location,
                  training_start_date, training_end_date, url_ncs, url_plan, url_detail_plan, registered_at, session_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              )
                .bind(approvedCourseId, sessionNumber, status, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, sessionName)
                .run();
            } catch (err2: unknown) {
              const msg2 = String(err2 && typeof err2 === 'object' && 'message' in err2 ? (err2 as Error).message : err2);
              if (/session_name|instructor_name|target_audience|days_of_week|location|no such column/i.test(msg2)) {
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
          } else throw errFallback;
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
    const errMsg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : String(e);
    console.error('course-sessions create:', e);
    return c.json({ success: false, error: errMsg ? '등록 실패: ' + errMsg : '등록 실패' }, 500);
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
        `SELECT s.id, s.approved_course_id, s.session_number, s.session_name, s.status,
                s.training_start_date, s.training_end_date,
                s.training_time_start, s.training_time_end, s.lunch_time_start, s.lunch_time_end,
                s.url_ncs, s.url_plan, s.url_detail_plan,
                s.registered_at, s.created_at, s.target_audience, s.days_of_week, s.location,
                s.recruitment_status, s.representative_image_exposure, s.recruitment_grace_period,
                s.syllabus_exposure, s.main_slide_image_url, s.course_list_image_url, s.course_detail_description,
                s.homepage_exposed,
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
      training_time_start?: string;
      training_time_end?: string;
      lunch_time_start?: string;
      lunch_time_end?: string;
      homepage_exposed?: number | boolean;
      session_name?: string;
    }>();

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);

    const status = (body.status && STATUS_VALUES.includes(body.status as any)) ? body.status : undefined;
    const sessionName = (body.session_name || '').trim() || null;
    const instructorName = (body.instructor_name || '').trim() || null;
    const targetAudience = Array.isArray(body.target_audience) ? body.target_audience.join(',') : (typeof body.target_audience === 'string' ? body.target_audience.trim() : null) || null;
    const daysOfWeek = Array.isArray(body.days_of_week) ? body.days_of_week.join(',') : (typeof body.days_of_week === 'string' ? body.days_of_week.trim() : null) || null;
    const location = (body.location || '').trim() || null;
    const trainingStart = (body.training_start_date || '').trim() || null;
    const trainingEnd = (body.training_end_date || '').trim() || null;
    const trainingTimeStart = (body.training_time_start || '').trim() || null;
    const trainingTimeEnd = (body.training_time_end || '').trim() || null;
    const lunchTimeStart = (body.lunch_time_start || '').trim() || null;
    const lunchTimeEnd = (body.lunch_time_end || '').trim() || null;
    const homepageExposed = body.homepage_exposed === true || body.homepage_exposed === 1 ? 1 : (body.homepage_exposed === false || body.homepage_exposed === 0 ? 0 : null);
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
          training_time_start = ?, training_time_end = ?, lunch_time_start = ?, lunch_time_end = ?,
          url_ncs = ?, url_plan = ?, url_detail_plan = ?, registered_at = ?,
          recruitment_status = COALESCE(?, recruitment_status), representative_image_exposure = COALESCE(?, representative_image_exposure),
          recruitment_grace_period = COALESCE(?, recruitment_grace_period), syllabus_exposure = COALESCE(?, syllabus_exposure),
          main_slide_image_url = ?, course_list_image_url = ?, course_detail_description = ?,
          homepage_exposed = COALESCE(?, homepage_exposed), session_name = ?
         WHERE id = ?`
      )
        .bind(status ?? null, instructorName, targetAudience, daysOfWeek, location, trainingStart, trainingEnd, trainingTimeStart, trainingTimeEnd, lunchTimeStart, lunchTimeEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt, recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure, mainSlideImageUrl, courseListImageUrl, courseDetailDescription, homepageExposed ?? null, sessionName, id)
        .run();
    } catch (err: unknown) {
      const msg = String(err && typeof err === 'object' && 'message' in err ? (err as Error).message : err);
      if (/session_name|no such column/i.test(msg) && /session_name/i.test(msg)) {
        return c.json({ success: false, error: '회차별과정명을 저장하려면 DB 마이그레이션 0062를 적용하세요. (npm run db:migrate:prod)' }, 400);
      }
      if (/session_name|homepage_exposed|training_time_start|training_time_end|lunch_time_start|lunch_time_end|recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msg)) {
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
 * PATCH /api/course-sessions/:id
 * 홈페이지 노출 여부만 변경 (목록에서 등록/삭제용)
 */
app.patch('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const body = await c.req.json<{ homepage_exposed?: number | boolean }>();
    const val = body.homepage_exposed === true || body.homepage_exposed === 1 ? 1 : 0;
    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);
    try {
      await DB.prepare('UPDATE course_sessions SET homepage_exposed = ? WHERE id = ?').bind(val, id).run();
    } catch (e) {
      if (!/homepage_exposed|no such column/i.test(String((e as Error)?.message ?? e))) throw e;
      return c.json({ success: false, error: '홈페이지 노출 컬럼이 없습니다. 마이그레이션 0061을 적용하세요.' }, 400);
    }
    return c.json({ success: true, data: { homepage_exposed: val } });
  } catch (e) {
    console.error('course-sessions patch:', e);
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/**
 * POST /api/course-sessions/:id/copy
 * 회차별 과정 복사
 */
app.post('/:id/copy', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{
      new_session_name: string;
      copy_options: {
        schedule: boolean;
        plan: boolean;
        ncs: boolean;
      };
    }>();

    const { new_session_name, copy_options } = body;
    if (!new_session_name) return c.json({ success: false, error: '새 회차명을 입력하세요' }, 400);

    const { DB } = c.env;

    // 1. 원본 회차 조회
    const source = await DB.prepare('SELECT * FROM course_sessions WHERE id = ?').bind(id).first<any>();
    if (!source) return c.json({ success: false, error: '복사할 회차를 찾을 수 없습니다' }, 404);

    // 2. 새 회차 번호 계산 (같은 승인과정 내 최대 회차 + 1)
    const maxRow = await DB.prepare('SELECT MAX(session_number) as max_num FROM course_sessions WHERE approved_course_id = ?')
      .bind(source.approved_course_id).first<{ max_num: number }>();
    const newSessionNumber = (maxRow?.max_num || 0) + 1;

    // 3. 복사할 데이터 준비
    const approvedCourseId = source.approved_course_id;
    const status = 'recruiting';
    const instructorName = source.instructor_name;
    const location = source.location;
    const targetAudience = source.target_audience;

    // 옵션에 따른 복사
    const daysOfWeek = copy_options.schedule ? source.days_of_week : null;
    const trainingTimeStart = copy_options.schedule ? source.training_time_start : null;
    const trainingTimeEnd = copy_options.schedule ? source.training_time_end : null;
    const lunchTimeStart = copy_options.schedule ? source.lunch_time_start : null;
    const lunchTimeEnd = copy_options.schedule ? source.lunch_time_end : null;

    // 날짜는 초기화 (새로운 기수이므로)
    const trainingStart = null;
    const trainingEnd = null;

    const urlNcs = copy_options.ncs ? source.url_ncs : null;
    const urlPlan = copy_options.plan ? source.url_plan : null;
    const urlDetailPlan = copy_options.plan ? source.url_detail_plan : null;
    const courseDetailDescription = copy_options.plan ? source.course_detail_description : null;

    // 기타 설정 복사
    const recruitmentStatus = source.recruitment_status || 'normal';
    const representativeImageExposure = source.representative_image_exposure || 'expose';
    const recruitmentGracePeriod = source.recruitment_grace_period || 0;
    const syllabusExposure = source.syllabus_exposure || 'hide';
    const homepageExposed = source.homepage_exposed; // 홈페이지 노출여부는 그대로 복사할지? 보통은 신규 등록시 노출 안함이 안전하지만, "복사"의 의미상 설정값 유지.

    const mainSlideImageUrl = source.main_slide_image_url;
    const courseListImageUrl = source.course_list_image_url;

    const registeredAt = new Date().toISOString().split('T')[0]; // 오늘 날짜

    // 4. 삽입 실행
    let newSessionId: number | null = null;
    try {
      const result = await DB.prepare(
        `INSERT INTO course_sessions (
          approved_course_id, session_number, session_name, status, instructor_name, target_audience, days_of_week, location,
          training_start_date, training_end_date, training_time_start, training_time_end, lunch_time_start, lunch_time_end,
          url_ncs, url_plan, url_detail_plan, registered_at,
          recruitment_status, representative_image_exposure, recruitment_grace_period, syllabus_exposure,
          main_slide_image_url, course_list_image_url, course_detail_description, homepage_exposed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(approvedCourseId, newSessionNumber, new_session_name, status, instructorName, targetAudience, daysOfWeek, location,
          trainingStart, trainingEnd, trainingTimeStart, trainingTimeEnd, lunchTimeStart, lunchTimeEnd,
          urlNcs, urlPlan, urlDetailPlan, registeredAt,
          recruitmentStatus, representativeImageExposure, recruitmentGracePeriod, syllabusExposure,
          mainSlideImageUrl, courseListImageUrl, courseDetailDescription, homepageExposed)
        .run();
      newSessionId = result.meta.last_row_id;
    } catch (err: unknown) {
      const msg = String(err && typeof err === 'object' && 'message' in err ? (err as Error).message : err);
      // Fallback for missing columns (older schema compatibility)
      if (/homepage_exposed|training_time_start|training_time_end|lunch_time_start|lunch_time_end|recruitment_status|representative_image_exposure|recruitment_grace_period|syllabus_exposure|main_slide_image_url|course_list_image_url|course_detail_description|no such column/i.test(msg)) {
        try {
          const result2 = await DB.prepare(
            `INSERT INTO course_sessions (
              approved_course_id, session_number, session_name, status, instructor_name, target_audience, days_of_week, location,
              training_start_date, training_end_date, url_ncs, url_plan, url_detail_plan, registered_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(approvedCourseId, newSessionNumber, new_session_name, status, instructorName, targetAudience, daysOfWeek, location,
              trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt)
            .run();
          newSessionId = result2.meta.last_row_id;
        } catch (err2: unknown) {
          const msg2 = String(err2 && typeof err2 === 'object' && 'message' in err2 ? (err2 as Error).message : err2);
          if (/instructor_name|target_audience|days_of_week|location|no such column/i.test(msg2)) {
            const result3 = await DB.prepare(
              `INSERT INTO course_sessions (
                    approved_course_id, session_number, status, training_start_date, training_end_date,
                    url_ncs, url_plan, url_detail_plan, registered_at
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(approvedCourseId, newSessionNumber, status, trainingStart, trainingEnd, urlNcs, urlPlan, urlDetailPlan, registeredAt)
              .run();
            newSessionId = result3.meta.last_row_id;
          } else {
            throw err2;
          }
        }
      } else {
        throw err;
      }
    }

    return c.json({ success: true, message: '복사되었습니다', new_session_id: newSessionId });
  } catch (e) {
    const errMsg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : String(e);
    console.error('course-sessions copy:', e);
    return c.json({ success: false, error: '복사 실패: ' + errMsg }, 500);
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

/**
 * GET /api/course-sessions/:id/timetable/config
 * 교시 설정 조회
 */
app.get('/:id/timetable/config', authMiddleware, requireAdmin, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'), 10);
    const { DB } = c.env;
    const { results } = await DB.prepare('SELECT * FROM session_period_configs WHERE session_id = ? ORDER BY period_number ASC')
      .bind(sessionId)
      .all();
    return c.json({ success: true, data: results || [] });
  } catch (e) {
    console.error('timetable config get:', e);
    return c.json({ success: false, error: '설정 조회 실패' }, 500);
  }
});

/**
 * POST /api/course-sessions/:id/timetable/config
 * 교시 설정 일괄 저장
 */
app.post('/:id/timetable/config', authMiddleware, requireAdmin, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'), 10);
    const { configs } = await c.req.json<{ configs: any[] }>();
    const { DB } = c.env;

    // 기존 설정 삭제 후 새로 삽입
    await DB.prepare('DELETE FROM session_period_configs WHERE session_id = ?').bind(sessionId).run();

    if (configs && configs.length > 0) {
      const stmt = DB.prepare(`
        INSERT INTO session_period_configs (session_id, period_number, start_time, end_time, break_minute)
        VALUES (?, ?, ?, ?, ?)
      `);
      const batch = configs.map(cfg => stmt.bind(sessionId, cfg.period_number, cfg.start_time, cfg.end_time, cfg.break_minute || 10));
      await DB.batch(batch);
    }

    return c.json({ success: true, message: '저장되었습니다' });
  } catch (e) {
    console.error('timetable config post:', e);
    return c.json({ success: false, error: '저장 실패' }, 500);
  }
});

/**
 * GET /api/course-sessions/:id/timetable
 * 시간표 데이터 조회 (날짜 범위)
 */
app.get('/:id/timetable', authMiddleware, requireAdmin, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'), 10);
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const { DB } = c.env;

    let query = 'SELECT * FROM session_timetables WHERE session_id = ?';
    const params: any[] = [sessionId];

    if (startDate) {
      query += ' AND training_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND training_date <= ?';
      params.push(endDate);
    }
    query += ' ORDER BY training_date ASC, period_number ASC';

    const { results } = await DB.prepare(query).bind(...params).all();
    return c.json({ success: true, data: results || [] });
  } catch (e) {
    console.error('timetable get:', e);
    return c.json({ success: false, error: '조회 실패' }, 500);
  }
});

/**
 * POST /api/course-sessions/:id/timetable
 * 시간표 데이터 일괄 저장 (Upsert)
 */
app.post('/:id/timetable', authMiddleware, requireAdmin, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'), 10);
    const { schedules } = await c.req.json<{ schedules: any[] }>();
    const { DB } = c.env;

    if (!schedules || schedules.length === 0) return c.json({ success: true });

    // SQLite UPSERT 이용
    const stmt = DB.prepare(`
      INSERT INTO session_timetables (session_id, training_date, period_number, subject_id, instructor_id, location, is_excluded)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id, training_date, period_number) DO UPDATE SET
        subject_id = EXCLUDED.subject_id,
        instructor_id = EXCLUDED.instructor_id,
        location = EXCLUDED.location,
        is_excluded = EXCLUDED.is_excluded,
        updated_at = datetime('now')
    `);

    const batch = schedules.map(s =>
      stmt.bind(sessionId, s.training_date, s.period_number, s.subject_id || null, s.instructor_id || null, s.location || '', s.is_excluded ? 1 : 0)
    );
    await DB.batch(batch);

    return c.json({ success: true, message: '저장되었습니다' });
  } catch (e) {
    console.error('timetable post:', e);
    return c.json({ success: false, error: '저장 실패' }, 500);
  }
});

/**
 * GET /api/course-sessions/:id/timetable/resources
 * 시간표 편성에 필요한 자원(과목, 강사 리스트) 조회
 */
app.get('/:id/timetable/resources', authMiddleware, requireAdmin, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'), 10);
    const { DB } = c.env;

    // 1. 회차 정보 및 승인과정 ID 가져오기
    const session = await DB.prepare('SELECT approved_course_id FROM course_sessions WHERE id = ?').bind(sessionId).first<any>();
    if (!session) return c.json({ success: false, error: '회차 없음' }, 404);

    // 2. 해당 승인과정의 교과목 리스트 (NCS 등록 정보 기반)
    const registration = await DB.prepare('SELECT id FROM ncs_approved_registrations WHERE approved_course_id = ?').bind(session.approved_course_id).first<any>();
    let subjects: any[] = [];
    if (registration) {
      const { results } = await DB.prepare('SELECT id, name, type, classification FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC')
        .bind(registration.id)
        .all();
      subjects = results || [];
    }

    // 3. 강사 리스트 (강사 또는 관리자 권한)
    const { results: instructors } = await DB.prepare("SELECT id, name, email FROM users WHERE role IN ('admin', 'teacher') ORDER BY name ASC").all();

    return c.json({
      success: true,
      data: {
        subjects,
        instructors
      }
    });
  } catch (e) {
    console.error('timetable resources get:', e);
    return c.json({ success: false, error: '내역 조회 실패' }, 500);
  }
});

export default app;
