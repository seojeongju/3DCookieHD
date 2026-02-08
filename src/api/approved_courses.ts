import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

function parseIdsJson(row: Record<string, unknown>): Record<string, unknown> {
  const out = { ...row };
  ['textbook_ids_json', 'consumable_ids_json', 'equipment_ids_json', 'facility_ids_json'].forEach((key) => {
    const json = out[key];
    if (json != null && typeof json === 'string') {
      try {
        out[key.replace('_json', '')] = JSON.parse(json);
      } catch (_) { }
    }
    delete out[key];
  });
  return out;
}

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
              a.textbook_ids_json, a.consumable_ids_json, a.equipment_ids_json, a.facility_ids_json,
              c.name as category_name,
              (SELECT COUNT(*) FROM course_sessions s WHERE s.approved_course_id = a.id) as session_count
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE ${whereClause}
       ORDER BY COALESCE(a.registered_at, a.created_at) DESC, a.id DESC
       LIMIT ? OFFSET ?`
    )
      .bind(...params)
      .all();

    const list = (rows.results || []).map((r: Record<string, unknown>) => parseIdsJson(r)) as Record<string, unknown>[];
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
      textbook_ids?: number[];
      consumable_ids?: number[];
      equipment_ids?: number[];
      facility_ids?: number[];
      hourly_rate?: number | null;
      total_days?: number | null;
      total_cost?: number | null;
      total_hours?: number | null;
      daily_hours?: number | null;
      gov_subsidy?: number | null;
    }>();
    let name = (body.name || '').trim();
    if (!name) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      name = `[임시] ${dateStr} 등록 과정`;
    }


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
    const textbookIdsJson = Array.isArray(body.textbook_ids) ? JSON.stringify(body.textbook_ids) : null;
    const consumableIdsJson = Array.isArray(body.consumable_ids) ? JSON.stringify(body.consumable_ids) : null;
    const equipmentIdsJson = Array.isArray(body.equipment_ids) ? JSON.stringify(body.equipment_ids) : null;
    const facilityIdsJson = Array.isArray(body.facility_ids) ? JSON.stringify(body.facility_ids) : null;

    const hourlyRate = body.hourly_rate != null ? body.hourly_rate : null;
    const totalDays = body.total_days != null ? body.total_days : null;
    const totalCost = body.total_cost != null ? body.total_cost : null;
    const totalHours = body.total_hours != null ? body.total_hours : null;
    const dailyHours = body.daily_hours != null ? body.daily_hours : null;
    const govSubsidy = body.gov_subsidy != null ? body.gov_subsidy : null;

    const { DB } = c.env;
    await DB.prepare(
      `INSERT INTO approved_courses (
        name, category_id, training_time_start, training_time_end,
        capacity, url_ncs, url_plan, url_detail_plan, approval_org,
        status, instructor_name, registered_at,
        textbook_ids_json, consumable_ids_json, equipment_ids_json, facility_ids_json,
        hourly_rate, total_days, total_cost, total_hours, daily_hours, gov_subsidy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        textbookIdsJson,
        consumableIdsJson,
        equipmentIdsJson,
        facilityIdsJson,
        hourlyRate,
        totalDays,
        totalCost,
        totalHours,
        dailyHours,
        govSubsidy
      )
      .run();

    const row = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              a.textbook_ids_json, a.consumable_ids_json, a.equipment_ids_json, a.facility_ids_json,
              a.hourly_rate, a.total_days, a.total_cost, a.total_hours, a.daily_hours, a.gov_subsidy,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       ORDER BY a.id DESC LIMIT 1`
    ).first();
    const data = row ? parseIdsJson(row as Record<string, unknown>) : null;
    return c.json({ success: true, data }, 201);
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
              a.textbook_ids_json, a.consumable_ids_json, a.equipment_ids_json, a.facility_ids_json,
              a.hourly_rate, a.total_days, a.total_cost, a.total_hours, a.daily_hours, a.gov_subsidy,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE a.id = ?`
    )
      .bind(id)
      .first() as Record<string, unknown> | null;
    if (!row) return c.json({ success: false, error: '과정을 찾을 수 없습니다' }, 404);
    return c.json({ success: true, data: parseIdsJson(row) });
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
      textbook_ids?: number[];
      consumable_ids?: number[];
      equipment_ids?: number[];
      facility_ids?: number[];
      hourly_rate?: number | null;
      total_days?: number | null;
      total_cost?: number | null;
      total_hours?: number | null;
      daily_hours?: number | null;
      gov_subsidy?: number | null;
    }>();

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id FROM approved_courses WHERE id = ?')
      .bind(id)
      .first();
    if (!existing) return c.json({ success: false, error: '과정을 찾을 수 없습니다' }, 404);

    let name = (body.name || '').trim();
    if (!name) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      name = `[임시] ${dateStr} 수정 과정`;
    }


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
    const textbookIdsJson = Array.isArray(body.textbook_ids) ? JSON.stringify(body.textbook_ids) : null;
    const consumableIdsJson = Array.isArray(body.consumable_ids) ? JSON.stringify(body.consumable_ids) : null;
    const equipmentIdsJson = Array.isArray(body.equipment_ids) ? JSON.stringify(body.equipment_ids) : null;
    const facilityIdsJson = Array.isArray(body.facility_ids) ? JSON.stringify(body.facility_ids) : null;

    const hourlyRate = body.hourly_rate != null ? body.hourly_rate : null;
    const totalDays = body.total_days != null ? body.total_days : null;
    const totalCost = body.total_cost != null ? body.total_cost : null;
    const totalHours = body.total_hours != null ? body.total_hours : null;
    const dailyHours = body.daily_hours != null ? body.daily_hours : null;
    const govSubsidy = body.gov_subsidy != null ? body.gov_subsidy : null;

    await DB.prepare(
      `UPDATE approved_courses SET
        name = ?, category_id = ?, training_time_start = ?, training_time_end = ?,
        capacity = ?, url_ncs = ?, url_plan = ?, url_detail_plan = ?, approval_org = ?,
        status = ?, instructor_name = ?, registered_at = ?,
        textbook_ids_json = ?, consumable_ids_json = ?, equipment_ids_json = ?, facility_ids_json = ?,
        hourly_rate = ?, total_days = ?, total_cost = ?, total_hours = ?, daily_hours = ?, gov_subsidy = ?
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
        textbookIdsJson,
        consumableIdsJson,
        equipmentIdsJson,
        facilityIdsJson,
        hourlyRate,
        totalDays,
        totalCost,
        totalHours,
        dailyHours,
        govSubsidy,
        id
      )
      .run();

    const row = await DB.prepare(
      `SELECT a.id, a.name, a.category_id, a.training_time_start, a.training_time_end,
              a.capacity, a.url_ncs, a.url_plan, a.url_detail_plan, a.approval_org,
              a.status, a.instructor_name, a.registered_at, a.created_at,
              a.textbook_ids_json, a.consumable_ids_json, a.equipment_ids_json, a.facility_ids_json,
              a.hourly_rate, a.total_days, a.total_cost, a.total_hours, a.daily_hours, a.gov_subsidy,
              c.name as category_name
       FROM approved_courses a
       LEFT JOIN course_categories c ON c.id = a.category_id
       WHERE a.id = ?`
    )
      .bind(id)
      .first() as Record<string, unknown> | null;
    return c.json({ success: true, data: row ? parseIdsJson(row) : null });
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
