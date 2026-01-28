import { Hono } from 'hono';
import type { Bindings, JWTPayload, Post } from '../types';
import { authMiddleware, requireRole, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();

// ============================================
// 게시글 목록 조회
// GET /api/posts
// ============================================
app.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const category = c.req.query('category');
    const search = c.req.query('search');
    const status = c.req.query('status');
    const offset = (page - 1) * limit;

    const base = `
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      params.push(category);
    }
    if (search) {
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      params.push(status);
    }

    const whereClauses: string[] = [];
    if (category && category !== 'all') whereClauses.push(' AND p.category = ?');
    if (search) whereClauses.push(' AND (p.title LIKE ? OR p.content LIKE ?)');
    if (status) whereClauses.push(' AND p.status = ?');
    const whereSql = whereClauses.join('');

    const countQuery = `SELECT COUNT(*) as total ${base}${whereSql}`;
    const totalResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = totalResult?.total || 0;

    const dataQuery = `
      SELECT p.*, u.name as author_name,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      ${base}${whereSql}
      ORDER BY p.pinned DESC, p.created_at DESC LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const { results } = await DB.prepare(dataQuery).bind(...dataParams).all();

    function parseImages(val: unknown): string[] {
      if (val == null || val === '') return [];
      try {
        if (typeof val === 'string') {
          const t = val.trim();
          if (t === '' || t === '[]' || t === 'null') return [];
          return JSON.parse(t) as string[];
        }
        if (Array.isArray(val)) return val;
        return [];
      } catch {
        return [];
      }
    }

    const posts = (results || []).map((post: any) => {
      let images = parseImages(post.images);

      if (images.length === 0 && post.content) {
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
        const match = post.content.match(imgRegex);
        if (match?.[1]) images = [match[1]];
      }

      return {
        ...post,
        images,
        pinned: Boolean(post.pinned)
      };
    });

    return c.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error?.message ?? error, error?.stack);
    return c.json({ success: false, error: '게시글 목록을 불러오는 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 게시글 상세 조회
// GET /api/posts/:id
// ============================================
app.get('/:id', async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');

    // 조회수 증가
    await DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();

    // 게시글 조회
    const post = await DB.prepare(`
      SELECT p.*, u.name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).bind(id).first();

    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    // 댓글 조회
    const { results: comments } = await DB.prepare(`
      SELECT c.*, u.name as author_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).bind(id).all();

    let images: string[] = [];
    try {
      if (post.images != null && post.images !== '') {
        const v = typeof post.images === 'string' ? JSON.parse(post.images) : post.images;
        images = Array.isArray(v) ? v : [];
      }
    } catch {
      images = [];
    }

    return c.json({
      success: true,
      data: {
        ...post,
        images,
        pinned: Boolean(post.pinned),
        comments: comments || []
      }
    });
  } catch (error: any) {
    console.error('Error fetching post:', error?.message ?? error, error?.stack);
    return c.json({ success: false, error: '게시글을 불러오는 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 게시글 작성
// POST /api/posts
// ============================================
app.post('/', authMiddleware, async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch (e: any) {
    console.error('POST /api/posts: invalid JSON body', e?.message ?? e);
    return c.json({ success: false, error: '요청 본문이 올바른 JSON이 아닙니다' }, 400);
  }

  try {
    const { DB } = c.env;
    const user = c.get('user');
    const { title, content, category, images, pinned, status } = body;

    const tit = title != null ? String(title).trim() : '';
    const cont = content != null ? String(content) : '';
    const cat = category != null ? String(category).trim() : '';

    if (!tit || !cat) {
      return c.json({ success: false, error: '제목, 카테고리는 필수입니다' }, 400);
    }
    if (!cont) {
      return c.json({ success: false, error: '내용은 필수입니다' }, 400);
    }

    if (cat === 'notice' && user.role !== 'admin') {
      return c.json({ success: false, error: '공지사항은 관리자만 작성할 수 있습니다' }, 403);
    }

    const pin = pinned === true || pinned === 1 || pinned === '1';
    if (pin && user.role !== 'admin') {
      return c.json({ success: false, error: '상단 고정은 관리자만 설정할 수 있습니다' }, 403);
    }

    let imagesJson: string;
    try {
      if (images == null) {
        imagesJson = '[]';
      } else if (Array.isArray(images)) {
        imagesJson = JSON.stringify(images);
      } else if (typeof images === 'string') {
        const t = images.trim();
        imagesJson = t === '' || t === '[]' ? '[]' : t;
      } else {
        imagesJson = '[]';
      }
    } catch {
      imagesJson = '[]';
    }

    const st = status && ['draft', 'published', 'hidden'].includes(String(status))
      ? String(status)
      : 'published';

    const result = await DB.prepare(`
      INSERT INTO posts (
        author_id, title, content, category, images,
        views, likes, pinned, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      user.userId,
      tit,
      cont,
      cat,
      imagesJson,
      pin ? 1 : 0,
      st
    ).run();

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: '게시글이 등록되었습니다'
      }
    }, 201);
  } catch (error: any) {
    console.error('Error creating post:', error?.message ?? error, error?.stack);
    return c.json({ success: false, error: '게시글 작성 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 게시글 수정
// PUT /api/posts/:id
// ============================================
app.put('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();

    // 게시글 조회
    const post = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first<Post>();

    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    // 본인 또는 관리자만 수정 가능
    if (user.role !== 'admin' && post.author_id !== user.userId) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    const { title, content, images, pinned, status } = body;

    // 게시글 수정
    await DB.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, images = ?,
          pinned = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      title ?? post.title,
      content ?? post.content,
      images ? JSON.stringify(images) : post.images,
      (pinned !== undefined && user.role === 'admin') ? (pinned ? 1 : 0) : post.pinned,
      status ?? post.status,
      id
    ).run();

    return c.json({
      success: true,
      message: '게시글이 수정되었습니다'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ success: false, error: '게시글 수정 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 게시글 삭제
// DELETE /api/posts/:id
// ============================================
app.delete('/:id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const id = c.req.param('id');

    // 게시글 조회
    const post = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();

    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    // 본인 또는 관리자만 삭제 가능
    if (user.role !== 'admin' && post.author_id !== user.userId) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    // 게시글 삭제 (댓글도 CASCADE로 삭제됨)
    await DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: '게시글이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ success: false, error: '게시글 삭제 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 댓글 작성
// POST /api/posts/:id/comments
// ============================================
app.post('/:id/comments', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const post_id = c.req.param('id');
    const body = await c.req.json();

    const { content, parent_id } = body;

    // 필수 필드 검증
    if (!content) {
      return c.json({ success: false, error: '댓글 내용은 필수입니다' }, 400);
    }

    // 게시글 존재 여부 확인
    const post = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(post_id).first();
    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    // 댓글 생성
    const result = await DB.prepare(`
      INSERT INTO comments (
        post_id, user_id, content, parent_id, created_at
      ) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(post_id, user.userId, content, parent_id || null).run();

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: '댓글이 등록되었습니다'
      }
    }, 201);
  } catch (error) {
    console.error('Error creating comment:', error);
    return c.json({ success: false, error: '댓글 작성 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 댓글 삭제
// DELETE /api/posts/:post_id/comments/:comment_id
// ============================================
app.delete('/:post_id/comments/:comment_id', authMiddleware, async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const comment_id = c.req.param('comment_id');

    // 댓글 조회
    const comment = await DB.prepare('SELECT * FROM comments WHERE id = ?').bind(comment_id).first();

    if (!comment) {
      return c.json({ success: false, error: '댓글을 찾을 수 없습니다' }, 404);
    }

    // 본인 또는 관리자만 삭제 가능
    if (user.role !== 'admin' && comment.user_id !== user.userId) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    // 댓글 삭제 (대댓글도 CASCADE로 삭제됨)
    await DB.prepare('DELETE FROM comments WHERE id = ?').bind(comment_id).run();

    return c.json({
      success: true,
      message: '댓글이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ success: false, error: '댓글 삭제 중 오류가 발생했습니다' }, 500);
  }
});

// ============================================
// 게시글 좋아요
// POST /api/posts/:id/like
// ============================================
app.post('/:id/like', async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');

    await DB.prepare(`
      UPDATE posts 
      SET likes = likes + 1 
      WHERE id = ?
    `).bind(id).run();

    return c.json({
      success: true,
      message: '좋아요를 눌렀습니다'
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return c.json({ success: false, error: '처리 중 오류가 발생했습니다' }, 500);
  }
});

export default app;
