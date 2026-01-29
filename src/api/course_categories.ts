import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/course-categories
 * 과정 분류 목록 조회 (시스템 기본값 + 사용자 설정값)
 */
app.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const rows = await DB.prepare(`
      SELECT id, name, is_system_default, sort_order, created_at
      FROM course_categories
      ORDER BY is_system_default DESC, sort_order ASC, id ASC
    `).all();
    const list = (rows.results || []) as { id: number; name: string; is_system_default: number; sort_order: number; created_at: string }[];
    return c.json({ success: true, data: list });
  } catch (e) {
    console.error('course-categories list:', e);
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/**
 * POST /api/course-categories
 * 사용자 설정 분류 추가
 */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{ name: string }>();
    const name = (body.name || '').trim();
    if (!name) return c.json({ success: false, error: '분류명을 입력하세요' }, 400);

    const { DB } = c.env;
    const maxSort = await DB.prepare('SELECT COALESCE(MAX(sort_order), 0) as mx FROM course_categories WHERE is_system_default = 0').first<{ mx: number }>();
    const sortOrder = (maxSort?.mx ?? 0) + 1;

    await DB.prepare(`
      INSERT INTO course_categories (name, is_system_default, sort_order) VALUES (?, 0, ?)
    `).bind(name, sortOrder).run();

    const row = await DB.prepare('SELECT id, name, is_system_default, sort_order, created_at FROM course_categories ORDER BY id DESC LIMIT 1').first();
    return c.json({ success: true, data: row }, 201);
  } catch (e: any) {
    if (e?.message && String(e.message).toLowerCase().includes('unique')) {
      return c.json({ success: false, error: '이미 등록된 분류명입니다' }, 400);
    }
    console.error('course-categories create:', e);
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/**
 * PUT /api/course-categories/:id
 * 사용자 설정 분류만 수정 가능
 */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{ name: string }>();
    const name = (body.name || '').trim();
    if (!name) return c.json({ success: false, error: '분류명을 입력하세요' }, 400);

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id, is_system_default FROM course_categories WHERE id = ?').bind(id).first<{ id: number; is_system_default: number }>();
    if (!existing) return c.json({ success: false, error: '분류를 찾을 수 없습니다' }, 404);
    if (existing.is_system_default === 1) return c.json({ success: false, error: '시스템 기본값은 수정할 수 없습니다' }, 400);

    await DB.prepare('UPDATE course_categories SET name = ? WHERE id = ?').bind(name, id).run();
    const row = await DB.prepare('SELECT id, name, is_system_default, sort_order, created_at FROM course_categories WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: row });
  } catch (e: any) {
    if (e?.message && String(e.message).toLowerCase().includes('unique')) {
      return c.json({ success: false, error: '이미 등록된 분류명입니다' }, 400);
    }
    console.error('course-categories update:', e);
    return c.json({ success: false, error: '수정 실패' }, 500);
  }
});

/**
 * DELETE /api/course-categories/:id
 * 사용자 설정 분류만 삭제 가능, 해당 분류를 사용 중인 과정이 있으면 삭제 불가
 */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const { DB } = c.env;
    const existing = await DB.prepare('SELECT id, name, is_system_default FROM course_categories WHERE id = ?').bind(id).first<{ id: number; name: string; is_system_default: number }>();
    if (!existing) return c.json({ success: false, error: '분류를 찾을 수 없습니다' }, 404);
    if (existing.is_system_default === 1) return c.json({ success: false, error: '시스템 기본값은 삭제할 수 없습니다' }, 400);

    const used = await DB.prepare('SELECT COUNT(*) as cnt FROM courses WHERE category = ?').bind(existing.name).first<{ cnt: number }>();
    if (used && used.cnt > 0) {
      return c.json({ success: false, error: '이 분류를 사용 중인 과정이 있어 삭제할 수 없습니다. 과정 설정을 먼저 변경하세요.' }, 400);
    }

    await DB.prepare('DELETE FROM course_categories WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: '삭제되었습니다' });
  } catch (e) {
    console.error('course-categories delete:', e);
    return c.json({ success: false, error: '삭제 실패' }, 500);
  }
});

export default app;
