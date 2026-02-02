import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

/** GET /api/partner-universities - 공개 목록 (대학맞춤교육 페이지 슬라이드용) */
app.get('/', async (c) => {
  try {
    const rows = await c.env.DB.prepare(`
      SELECT id, name, logo_url, sort_order
      FROM partner_universities
      ORDER BY sort_order ASC, id ASC
    `).all();
    const list = (rows.results || []) as { id: number; name: string; logo_url: string | null; sort_order: number }[];
    return c.json({ success: true, data: list });
  } catch (e) {
    console.error('partner-universities list:', e);
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/** POST /api/partner-universities - 협력대학 추가 (관리자) */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{ name: string; logo_url?: string; sort_order?: number }>();
    const name = (body.name || '').trim();
    if (!name) return c.json({ success: false, error: '대학명을 입력하세요' }, 400);

    const logoUrl = (body.logo_url || '').trim() || null;
    const sortOrder = typeof body.sort_order === 'number' ? body.sort_order : 0;

    const maxSort = await c.env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) as mx FROM partner_universities').first<{ mx: number }>();
    const nextSort = (maxSort?.mx ?? 0) + 1;
    const order = sortOrder > 0 ? sortOrder : nextSort;

    await c.env.DB.prepare(`
      INSERT INTO partner_universities (name, logo_url, sort_order) VALUES (?, ?, ?)
    `).bind(name, logoUrl, order).run();

    const row = await c.env.DB.prepare('SELECT id, name, logo_url, sort_order, created_at FROM partner_universities ORDER BY id DESC LIMIT 1').first();
    return c.json({ success: true, data: row }, 201);
  } catch (e) {
    console.error('partner-universities create:', e);
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/** PUT /api/partner-universities/:id - 수정 (관리자) */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{ name?: string; logo_url?: string; sort_order?: number }>();
    const name = body.name !== undefined ? (body.name || '').trim() : undefined;
    if (name !== undefined && !name) return c.json({ success: false, error: '대학명을 입력하세요' }, 400);

    const existing = await c.env.DB.prepare('SELECT id FROM partner_universities WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '대학을 찾을 수 없습니다' }, 404);

    const updates: string[] = [];
    const params: unknown[] = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (body.logo_url !== undefined) { updates.push('logo_url = ?'); params.push((body.logo_url || '').trim() || null); }
    if (body.sort_order !== undefined) { updates.push('sort_order = ?'); params.push(body.sort_order); }
    if (updates.length === 0) return c.json({ success: false, error: '수정할 내용이 없습니다' }, 400);
    params.push(id);
    await c.env.DB.prepare(`UPDATE partner_universities SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

    const row = await c.env.DB.prepare('SELECT id, name, logo_url, sort_order, created_at FROM partner_universities WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: row });
  } catch (e) {
    console.error('partner-universities update:', e);
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/** DELETE /api/partner-universities/:id - 삭제 (관리자) */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    await c.env.DB.prepare('DELETE FROM partner_universities WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (e) {
    console.error('partner-universities delete:', e);
    return c.json({ success: false, error: '삭제 실패' }, 500);
  }
});

export default app;
