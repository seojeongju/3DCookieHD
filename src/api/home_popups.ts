import { Hono } from 'hono';
import type { Bindings, Variables } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

type HomePopupRow = {
  id: number;
  title: string;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  is_active: number;
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

async function ensureHomePopupsTable(DB: D1Database): Promise<void> {
  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS home_popups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      link_url TEXT,
      link_label TEXT DEFAULT '바로가기',
      is_active INTEGER NOT NULL DEFAULT 0,
      start_at TEXT,
      end_at TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours'))
    )
  `).run();
}

function todayKST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function normalizeOptionalDate(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function sanitizeText(value: unknown, max = 2000): string {
  return String(value ?? '').trim().slice(0, max);
}

/** 공개: 메인에 표시할 활성 팝업 */
app.get('/public', async (c) => {
  try {
    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const today = todayKST();
    const result = await DB.prepare(`
      SELECT id, title, content, image_url, link_url, link_label, sort_order
      FROM home_popups
      WHERE is_active = 1
        AND (start_at IS NULL OR length(trim(start_at)) = 0 OR date(start_at) <= date(?))
        AND (end_at IS NULL OR length(trim(end_at)) = 0 OR date(end_at) >= date(?))
      ORDER BY sort_order ASC, id DESC
      LIMIT 10
    `).bind(today, today).all<HomePopupRow>();
    return successResponse(c, result.results || []);
  } catch (e) {
    console.error('home_popups public:', e);
    return errorResponse(c, '팝업을 불러오지 못했습니다.', 500);
  }
});

/** 관리자: 목록 */
app.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const result = await DB.prepare(`
      SELECT *
      FROM home_popups
      ORDER BY sort_order ASC, id DESC
    `).all<HomePopupRow>();
    return successResponse(c, result.results || []);
  } catch (e) {
    console.error('home_popups list:', e);
    return errorResponse(c, '팝업 목록을 불러오지 못했습니다.', 500);
  }
});

/** 관리자: 단건 */
app.get('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (!Number.isFinite(id) || id <= 0) return errorResponse(c, '잘못된 ID입니다.', 400);
    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const row = await DB.prepare('SELECT * FROM home_popups WHERE id = ?').bind(id).first<HomePopupRow>();
    if (!row) return errorResponse(c, '팝업을 찾을 수 없습니다.', 404);
    return successResponse(c, row);
  } catch (e) {
    console.error('home_popups get:', e);
    return errorResponse(c, '팝업 조회에 실패했습니다.', 500);
  }
});

/** 관리자: 생성 */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const title = sanitizeText(body.title, 120);
    if (!title) return errorResponse(c, '제목을 입력해 주세요.', 400);

    const content = sanitizeText(body.content, 5000);
    const imageUrl = sanitizeText(body.image_url, 500) || null;
    const linkUrl = sanitizeText(body.link_url, 500) || null;
    const linkLabel = sanitizeText(body.link_label, 40) || '바로가기';
    const isActive = body.is_active === true || body.is_active === 1 || body.is_active === '1' ? 1 : 0;
    const startAt = normalizeOptionalDate(body.start_at);
    const endAt = normalizeOptionalDate(body.end_at);
    const sortOrder = Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0;

    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const result = await DB.prepare(`
      INSERT INTO home_popups (
        title, content, image_url, link_url, link_label,
        is_active, start_at, end_at, sort_order, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+9 hours'))
    `).bind(
      title,
      content || null,
      imageUrl,
      linkUrl,
      linkLabel,
      isActive,
      startAt,
      endAt,
      sortOrder,
    ).run();

    return successResponse(c, { id: result.meta.last_row_id }, '팝업이 등록되었습니다.');
  } catch (e) {
    console.error('home_popups create:', e);
    return errorResponse(c, '팝업 등록에 실패했습니다.', 500);
  }
});

/** 관리자: 수정 */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (!Number.isFinite(id) || id <= 0) return errorResponse(c, '잘못된 ID입니다.', 400);
    const body = await c.req.json();
    const title = sanitizeText(body.title, 120);
    if (!title) return errorResponse(c, '제목을 입력해 주세요.', 400);

    const content = sanitizeText(body.content, 5000);
    const imageUrl = sanitizeText(body.image_url, 500) || null;
    const linkUrl = sanitizeText(body.link_url, 500) || null;
    const linkLabel = sanitizeText(body.link_label, 40) || '바로가기';
    const isActive = body.is_active === true || body.is_active === 1 || body.is_active === '1' ? 1 : 0;
    const startAt = normalizeOptionalDate(body.start_at);
    const endAt = normalizeOptionalDate(body.end_at);
    const sortOrder = Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0;

    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const existing = await DB.prepare('SELECT id FROM home_popups WHERE id = ?').bind(id).first();
    if (!existing) return errorResponse(c, '팝업을 찾을 수 없습니다.', 404);

    await DB.prepare(`
      UPDATE home_popups SET
        title = ?, content = ?, image_url = ?, link_url = ?, link_label = ?,
        is_active = ?, start_at = ?, end_at = ?, sort_order = ?,
        updated_at = datetime('now', '+9 hours')
      WHERE id = ?
    `).bind(
      title,
      content || null,
      imageUrl,
      linkUrl,
      linkLabel,
      isActive,
      startAt,
      endAt,
      sortOrder,
      id,
    ).run();

    return successResponse(c, { id }, '팝업이 수정되었습니다.');
  } catch (e) {
    console.error('home_popups update:', e);
    return errorResponse(c, '팝업 수정에 실패했습니다.', 500);
  }
});

/** 관리자: 활성 토글 */
app.patch('/:id/active', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (!Number.isFinite(id) || id <= 0) return errorResponse(c, '잘못된 ID입니다.', 400);
    const body = await c.req.json().catch(() => ({}));
    const isActive = body.is_active === true || body.is_active === 1 || body.is_active === '1' ? 1 : 0;
    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    const existing = await DB.prepare('SELECT id FROM home_popups WHERE id = ?').bind(id).first();
    if (!existing) return errorResponse(c, '팝업을 찾을 수 없습니다.', 404);
    await DB.prepare(`
      UPDATE home_popups
      SET is_active = ?, updated_at = datetime('now', '+9 hours')
      WHERE id = ?
    `).bind(isActive, id).run();
    return successResponse(c, { id, is_active: isActive }, isActive ? '팝업이 활성화되었습니다.' : '팝업이 비활성화되었습니다.');
  } catch (e) {
    console.error('home_popups toggle:', e);
    return errorResponse(c, '상태 변경에 실패했습니다.', 500);
  }
});

/** 관리자: 삭제 */
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (!Number.isFinite(id) || id <= 0) return errorResponse(c, '잘못된 ID입니다.', 400);
    const { DB } = c.env;
    await ensureHomePopupsTable(DB);
    await DB.prepare('DELETE FROM home_popups WHERE id = ?').bind(id).run();
    return successResponse(c, null, '팝업이 삭제되었습니다.');
  } catch (e) {
    console.error('home_popups delete:', e);
    return errorResponse(c, '팝업 삭제에 실패했습니다.', 500);
  }
});

export default app;
