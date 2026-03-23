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
  post_id: number | null;
  /** 갤러리 글과 연동된 항목이면 gallery, 직접 입력이면 manual */
  source?: 'gallery' | 'manual';
};

/** posts.created_at(ISO) → 교육실적 일자 표기 (예: 2024. 03) */
function performedAtFromPostCreated(createdAt: string | null | undefined): string {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}. ${m}`;
}

/** GET /api/education-performance - 공개 목록 (교육실적 페이지·홈 연동, 갤러리 글과 조인) */
app.get('/', async (c) => {
  try {
    const rows = await c.env.DB.prepare(`
      SELECT
        ep.id,
        ep.sort_order,
        ep.category,
        ep.created_at,
        ep.post_id,
        COALESCE(p.title, ep.title) AS title,
        COALESCE(
          CASE WHEN ep.post_id IS NOT NULL AND p.id IS NOT NULL THEN
            strftime('%Y', p.created_at) || '. ' || strftime('%m', p.created_at)
          END,
          ep.performed_at
        ) AS performed_at
      FROM education_performance ep
      LEFT JOIN posts p ON ep.post_id = p.id
      ORDER BY COALESCE(p.created_at, ep.created_at) DESC, ep.sort_order ASC, ep.id DESC
    `).all();

    const raw = (rows.results || []) as Record<string, unknown>[];
    const list: EducationPerformanceRow[] = raw.map((r) => ({
      id: Number(r.id),
      performed_at: String(r.performed_at ?? ''),
      title: String(r.title ?? ''),
      category: r.category != null ? String(r.category) : null,
      sort_order: Number(r.sort_order ?? 0),
      created_at: String(r.created_at ?? ''),
      post_id: r.post_id != null ? Number(r.post_id) : null,
      source: r.post_id != null ? 'gallery' : 'manual',
    }));

    return c.json({ success: true, data: list });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance list:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    if (msg.includes('no such column') && msg.includes('post_id')) {
      return c.json({ success: false, error: 'post_id 컬럼이 없습니다. 마이그레이션(0097)을 실행해 주세요.' }, 503);
    }
    return c.json({ success: false, error: '목록 조회 실패' }, 500);
  }
});

/** POST /api/education-performance - 실적 추가 (관리자). post_id 있으면 교육사진 갤러리 글과 연동 */
app.post('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{
      performed_at?: string;
      title?: string;
      category?: string;
      sort_order?: number;
      post_id?: number | null;
    }>();

    const postIdRaw = body.post_id;
    const postId =
      postIdRaw != null && postIdRaw !== '' && !Number.isNaN(Number(postIdRaw)) ? Number(postIdRaw) : null;

    if (postId != null) {
      const post = await c.env.DB.prepare(
        `SELECT id, title, created_at, category FROM posts WHERE id = ? AND category = 'education_photo'`
      )
        .bind(postId)
        .first<{ id: number; title: string; created_at: string; category: string }>();

      if (!post) {
        return c.json({ success: false, error: '교육사진 갤러리 글을 찾을 수 없습니다' }, 400);
      }

      const dup = await c.env.DB.prepare(`
        SELECT id FROM education_performance WHERE post_id = ?
      `)
        .bind(postId)
        .first();
      if (dup) {
        return c.json({ success: false, error: '이미 교육실적에 등록된 갤러리 글입니다' }, 409);
      }

      const performedAt = performedAtFromPostCreated(post.created_at);
      const title = (post.title || '').trim() || '교육사진';
      const category =
        body.category != null && String(body.category).trim() !== '' ? String(body.category).trim() : null;
      const sortOrder = typeof body.sort_order === 'number' ? body.sort_order : 0;

      await c.env.DB.prepare(`
        INSERT INTO education_performance (performed_at, title, category, sort_order, post_id)
        VALUES (?, ?, ?, ?, ?)
      `)
        .bind(performedAt, title, category, sortOrder, postId)
        .run();

      const row = await c.env.DB.prepare(`
        SELECT ep.id, ep.sort_order, ep.category, ep.created_at, ep.post_id,
          COALESCE(p.title, ep.title) AS title,
          COALESCE(
            CASE WHEN ep.post_id IS NOT NULL AND p.id IS NOT NULL THEN
              strftime('%Y', p.created_at) || '. ' || strftime('%m', p.created_at)
            END,
            ep.performed_at
          ) AS performed_at
        FROM education_performance ep
        LEFT JOIN posts p ON ep.post_id = p.id
        ORDER BY ep.id DESC LIMIT 1
      `).first();
      return c.json({ success: true, data: { ...row, source: 'gallery' } }, 201);
    }

    const performedAt = (body.performed_at != null ? String(body.performed_at) : '').trim();
    const title = (body.title != null ? String(body.title) : '').trim();
    if (!performedAt) return c.json({ success: false, error: '실적 일자를 입력하세요' }, 400);
    if (!title) return c.json({ success: false, error: '실적 내용을 입력하세요' }, 400);

    const category = body.category != null && String(body.category).trim() !== '' ? String(body.category).trim() : null;
    const sortOrder = typeof body.sort_order === 'number' ? body.sort_order : 0;

    await c.env.DB.prepare(`
      INSERT INTO education_performance (performed_at, title, category, sort_order, post_id)
      VALUES (?, ?, ?, ?, NULL)
    `)
      .bind(performedAt, title, category, sortOrder)
      .run();

    const row = await c.env.DB.prepare(`
      SELECT id, performed_at, title, category, sort_order, created_at, post_id FROM education_performance ORDER BY id DESC LIMIT 1
    `).first();
    return c.json({ success: true, data: { ...row, source: 'manual' } }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('education-performance create:', e);
    if (msg.includes('no such table') || msg.includes('education_performance')) {
      return c.json({ success: false, error: '교육실적 테이블이 없습니다. 마이그레이션(0083)을 실행해 주세요.' }, 503);
    }
    if (msg.includes('UNIQUE') && msg.includes('post_id')) {
      return c.json({ success: false, error: '이미 등록된 갤러리 글입니다' }, 409);
    }
    return c.json({ success: false, error: '등록 실패' }, 500);
  }
});

/** POST /api/education-performance/from-gallery - 교육사진 갤러리 글 여러 건을 실적에 일괄 반영 */
app.post('/from-gallery', authMiddleware, requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{ post_ids?: unknown }>();
    const raw = body.post_ids;
    const ids = Array.isArray(raw)
      ? raw.map((x) => Number(x)).filter((n) => !Number.isNaN(n) && n > 0)
      : [];

    if (ids.length === 0) {
      return c.json({ success: false, error: 'post_ids 배열이 필요합니다' }, 400);
    }

    let ok = 0;
    let skip = 0;
    let fail = 0;

    const maxSort = await c.env.DB.prepare(`
      SELECT COALESCE(MAX(sort_order), -1) AS m FROM education_performance
    `).first<{ m: number }>();
    let nextOrder = (maxSort?.m ?? -1) + 1;

    for (const postId of ids) {
      const post = await c.env.DB.prepare(
        `SELECT id, title, created_at FROM posts WHERE id = ? AND category = 'education_photo'`
      )
        .bind(postId)
        .first<{ id: number; title: string; created_at: string }>();

      if (!post) {
        fail++;
        continue;
      }

      const dup = await c.env.DB.prepare(`SELECT id FROM education_performance WHERE post_id = ?`).bind(postId).first();
      if (dup) {
        skip++;
        continue;
      }

      const performedAt = performedAtFromPostCreated(post.created_at);
      const title = (post.title || '').trim() || '교육사진';

      try {
        await c.env.DB.prepare(`
          INSERT INTO education_performance (performed_at, title, category, sort_order, post_id)
          VALUES (?, ?, NULL, ?, ?)
        `)
          .bind(performedAt, title, nextOrder++, postId)
          .run();
        ok++;
      } catch {
        fail++;
      }
    }

    return c.json({ success: true, data: { ok, skip, fail } });
  } catch (e: unknown) {
    console.error('education-performance from-gallery:', e);
    return c.json({ success: false, error: '일괄 등록 실패' }, 500);
  }
});

/** PUT /api/education-performance/:id - 수정 (관리자). 갤러리 연동 행은 일자·제목만 갤러리 기준(동기화) 또는 순서·카테고리만 */
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

    const body = await c.req.json<{
      performed_at?: string;
      title?: string;
      category?: string;
      sort_order?: number;
      sync_from_post?: boolean;
    }>();

    const existing = await c.env.DB.prepare(
      `SELECT id, post_id, performed_at, title FROM education_performance WHERE id = ?`
    )
      .bind(id)
      .first<{ id: number; post_id: number | null; performed_at: string; title: string }>();

    if (!existing) return c.json({ success: false, error: '해당 실적을 찾을 수 없습니다' }, 404);

    if (existing.post_id != null) {
      if (body.sync_from_post === true) {
        const post = await c.env.DB.prepare(`SELECT title, created_at FROM posts WHERE id = ?`)
          .bind(existing.post_id)
          .first<{ title: string; created_at: string }>();
        if (post) {
          const performedAt = performedAtFromPostCreated(post.created_at);
          const title = (post.title || '').trim() || '교육사진';
          await c.env.DB.prepare(
            `UPDATE education_performance SET performed_at = ?, title = ? WHERE id = ?`
          )
            .bind(performedAt, title, id)
            .run();
        }
      }

      const updates: string[] = [];
      const params: unknown[] = [];
      if (body.category !== undefined) {
        updates.push('category = ?');
        params.push((body.category || '').trim() || null);
      }
      if (body.sort_order !== undefined) {
        updates.push('sort_order = ?');
        params.push(body.sort_order);
      }
      if (updates.length > 0) {
        params.push(id);
        await c.env.DB.prepare(`UPDATE education_performance SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
      }

      const row = await c.env.DB.prepare(`
        SELECT ep.id, ep.sort_order, ep.category, ep.created_at, ep.post_id,
          COALESCE(p.title, ep.title) AS title,
          COALESCE(
            CASE WHEN ep.post_id IS NOT NULL AND p.id IS NOT NULL THEN
              strftime('%Y', p.created_at) || '. ' || strftime('%m', p.created_at)
            END,
            ep.performed_at
          ) AS performed_at
        FROM education_performance ep
        LEFT JOIN posts p ON ep.post_id = p.id
        WHERE ep.id = ?
      `)
        .bind(id)
        .first();
      return c.json({ success: true, data: { ...row, source: 'gallery' } });
    }

    const performedAt = body.performed_at !== undefined ? (body.performed_at || '').trim() : undefined;
    const title = body.title !== undefined ? (body.title || '').trim() : undefined;
    if (performedAt !== undefined && !performedAt) return c.json({ success: false, error: '실적 일자를 입력하세요' }, 400);
    if (title !== undefined && !title) return c.json({ success: false, error: '실적 내용을 입력하세요' }, 400);

    const updates: string[] = [];
    const params: unknown[] = [];
    if (performedAt !== undefined) {
      updates.push('performed_at = ?');
      params.push(performedAt);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (body.category !== undefined) {
      updates.push('category = ?');
      params.push((body.category || '').trim() || null);
    }
    if (body.sort_order !== undefined) {
      updates.push('sort_order = ?');
      params.push(body.sort_order);
    }
    if (updates.length === 0) return c.json({ success: false, error: '수정할 내용이 없습니다' }, 400);
    params.push(id);
    await c.env.DB.prepare(`UPDATE education_performance SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

    const row = await c.env.DB.prepare(`
      SELECT id, performed_at, title, category, sort_order, created_at, post_id FROM education_performance WHERE id = ?
    `)
      .bind(id)
      .first();
    return c.json({ success: true, data: { ...row, source: 'manual' } });
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
