import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/approved-courses
 * 승인받은 과정 목록 (필터·페이지네이션)
 */
app.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const categoryId = c.req.query('category_id');
    const name = c.req.query('name');
    const instructorName = c.req.query('instructor_name');
    const periodFrom = c.req.query('period_from');
    const periodTo = c.req.query('period_to');
    const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '15', 10)));
    const offset = (page - 1) * limit;

    const { DB } = c.env;
    const params: (string | number)[] = [];
    const conditions: string[] = ['1=1'];

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
    if (periodFrom !== undefined && periodFrom !== '') {
      conditions.push("COALESCE(a.registered_at, a.created_at) >= ?");
      params.push(periodFrom);
    }
    if (periodTo !== undefined && periodTo !== '') {
      conditions.push("COALESCE(a.registered_at, a.created_at) <= ?");
      params.push(periodTo);
    }

    const whereClause = conditions.join(' AND ');
    const countRow = await DB.prepare(
      `SELECT COUNT(*) as total FROM approved_courses a WHERE ${whereClause}`
    )
      .bind(...params)
      .first<{ total: number }>();
    const total = countRow?.total ?? 0;

    params.push(limit, offset);
    const rows = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE ${whereClause}
       ORDER BY COALESCE(a.registered_at, a.created_at) DESC, a.id DESC
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
    console.error('approved-courses list:', e);
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/**
 * POST /api/approved-courses
 * 승인받은 과정 등록
 */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{
      name: string;
      category_id?: number | null;
      training_time_start?: string;
      training_time_end?: string;
      capacity?: number | null;
      url_ncs?: string;
      url_plan?: string;
      url_detail_plan?: string;
      approval_org?: string;
      status?: string;
      instructor_name?: string;
      registered_at?: string;
    }>();
    const name = (body.name || '').trim();
    if (!name) return c.json({ success: false, error: '과정명을 입력하세요' }, 400);

    const categoryId = body.category_id != null ? body.category_id : null;
    const trainingTimeStart = (body.training_time_start || '').trim() || null;
    const trainingTimeEnd = (body.training_time_end || '').trim() || null;
    const capacity = body.capacity != null ? body.capacity : null;
    const urlNcs = (body.url_ncs || '').trim() || null;
    const urlPlan = (body.url_plan || '').trim() || null;
    const urlDetailPlan = (body.url_detail_plan || '').trim() || null;
    const approvalOrg = (body.approval_org || '').trim() || null;
    const status = (body.status || 'active').trim();
    const instructorName = (body.instructor_name || '').trim() || null;
    const registeredAt = (body.registered_at || '').trim() || null;

    const { DB } = c.env;
    await DB.prepare(
      `INSERT INTO approved_courses (
        name, category_id, training_time_start, training_time_end,
        capacity, url_ncs, url_plan, url_detail_plan, approval_org,
        status, instructor_name, registered_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        name,
        categoryId,
        trainingTimeStart,
        trainingTimeEnd,
        capacity,
        urlNcs,
        urlPlan,
        urlDetailPlan,
        approvalOrg,
        status,
        instructorName,
        registeredAt
      )
      .run();

    const row = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       ORDER BY a.id DESC LIMIT 1`
    ).first();
    return c.json({ success: true, data: row }, 201);
  } catch (e) {
    console.error('approved-courses create:', e);
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/**
 * GET /api/approved-courses/:id
 */
app.get('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const { DB } = c.env;
    const row = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE a.id = ?`
    )
      .bind(id)
      .first();
    if (!row) return c.json({ success: false, error: '과정을 찾을 수 없습니다' }, 404);
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('approved-courses get:', e);
    return c.json({ success: false, error: '조회 실패' }, 500);
  }
});

/**
 * PUT /api/approved-courses/:id
 */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{
      name?: string;
      category_id?: number | null;
      training_time_start?: string;
      training_time_end?: string;
      capacity?: number | null;
      url_ncs?: string;
      url_plan?: string;
      url_detail_plan?: string;
      approval_org?: string;
      status?: string;
      instructor_name?: string;
      registered_at?: string;
    }>();

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM approved_courses WHERE id = ?')
      .bind(id)
      .first();
    if (!existing) return c.json({ success: false, error: '과정을 찾을 수 없습니다' }, 404);

    const name = (body.name || '').trim();
    if (!name) return c.json({ success: false, error: '과정명을 입력하세요' }, 400);

    const categoryId = body.category_id != null ? body.category_id : null;
    const trainingTimeStart = (body.training_time_start || '').trim() || null;
    const trainingTimeEnd = (body.training_time_end || '').trim() || null;
    const capacity = body.capacity != null ? body.capacity : null;
    const urlNcs = (body.url_ncs || '').trim() || null;
    const urlPlan = (body.url_plan || '').trim() || null;
    const urlDetailPlan = (body.url_detail_plan || '').trim() || null;
    const approvalOrg = (body.approval_org || '').trim() || null;
    const status = (body.status || 'active').trim();
    const instructorName = (body.instructor_name || '').trim() || null;
    const registeredAt = (body.registered_at || '').trim() || null;

    await DB.prepare(
      `UPDATE approved_courses SET
        name = ?, category_id = ?, training_time_start = ?, training_time_end = ?,
        capacity = ?, url_ncs = ?, url_plan = ?, url_detail_plan = ?, approval_org = ?,
        status = ?, instructor_name = ?, registered_at = ?
       WHERE id = ?`
    )
      .bind(
        name,
        categoryId,
        trainingTimeStart,
        trainingTimeEnd,
        capacity,
        urlNcs,
        urlPlan,
        urlDetailPlan,
        approvalOrg,
        status,
        instructorName,
        registeredAt,
        id
      )
      .run();

    const row = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE a.id = ?`
    )
      .bind(id)
      .first();
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('approved-courses update:', e);
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/**
 * DELETE /api/approved-courses/:id
 */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM approved_courses WHERE id = ?')
      .bind(id)
      .first();
    if (!existing) return c.json({ success: false, error: '과정을 찾을 수 없습니다' }, 404);
    await DB.prepare('DELETE FROM approved_courses WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: '삭제되었습니다' });
  } catch (e) {
    console.error('approved-courses delete:', e);
    return c.json({ success: false, error: '삭제 실패' }, 500);
  }
});

export default app;
