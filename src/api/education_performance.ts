import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

export type EducationPerformanceRow = {
  id: number;
  performed_at: string;
  title: string;
  category: string | null;
  sort_order: number;
  created_at: string;
};

/** GET /api/education-performance - 공개 목록 (교육실적 페이지용, 연도·일자 순) */
app.get('/', async (c) => {
  try {
    const rows = await c.env.DB.prepare(`
      SELECT id, performed_at, title, category, sort_order, created_at
      FROM education_performance
      ORDER BY performed_at DESC, sort_order ASC, id DESC
    `).all();
    const list = (rows.results || []) as EducationPerformanceRow[];
    return c.json({ success: true, data: list });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance list:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/** POST /api/education-performance - 실적 추가 (관리자) */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{ performed_at?: string; title?: string; category?: string; sort_order?: number }>();
    const performedAt = (body.performed_at != null ? String(body.performed_at) : '').trim();
    const title = (body.title != null ? String(body.title) : '').trim();
    if (!performedAt) return c.json({ success: false, error: '실적 일자를 입력하세요' }, 400);
    if (!title) return c.json({ success: false, error: '실적 내용을 입력하세요' }, 400);

    const category = body.category != null && String(body.category).trim() !== '' ? String(body.category).trim() : null;
    const sortOrder = typeof body.sort_order === 'number' ? body.sort_order : 0;

    await c.env.DB.prepare(`
      INSERT INTO education_performance (performed_at, title, category, sort_order) VALUES (?, ?, ?, ?)
    `).bind(performedAt, title, category, sortOrder).run();

    const row = await c.env.DB.prepare(`
      SELECT id, performed_at, title, category, sort_order, created_at FROM education_performance ORDER BY id DESC LIMIT 1
    `).first();
    return c.json({ success: true, data: row }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance create:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/** PUT /api/education-performance/:id - 수정 (관리자) */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{ performed_at?: string; title?: string; category?: string; sort_order?: number }>();
    const performedAt = body.performed_at !== undefined ? (body.performed_at || '').trim() : undefined;
    const title = body.title !== undefined ? (body.title || '').trim() : undefined;
    if (performedAt !== undefined && !performedAt) return c.json({ success: false, error: '실적 일자를 입력하세요' }, 400);
    if (title !== undefined && !title) return c.json({ success: false, error: '실적 내용을 입력하세요' }, 400);

    const existing = await c.env.DB.prepare('SELECT id FROM education_performance WHERE id = ?').bind(id).first();
    if (!existing) return c.json({ success: false, error: '해당 실적을 찾을 수 없습니다' }, 404);

    const updates: string[] = [];
    const params: unknown[] = [];
    if (performedAt !== undefined) { updates.push('performed_at = ?'); params.push(performedAt); }
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (body.category !== undefined) { updates.push('category = ?'); params.push((body.category || '').trim() || null); }
    if (body.sort_order !== undefined) { updates.push('sort_order = ?'); params.push(body.sort_order); }
    if (updates.length === 0) return c.json({ success: false, error: '수정할 내용이 없습니다' }, 400);
    params.push(id);
    await c.env.DB.prepare(`UPDATE education_performance SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

    const row = await c.env.DB.prepare(`
      SELECT id, performed_at, title, category, sort_order, created_at FROM education_performance WHERE id = ?
    `).bind(id).first();
    return c.json({ success: true, data: row });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance update:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/** DELETE /api/education-performance/:id - 삭제 (관리자) */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
    await c.env.DB.prepare('DELETE FROM education_performance WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance delete:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    return c.json({ success: false, error: '삭제 실패' }, 500);
  }
});

export default app;
