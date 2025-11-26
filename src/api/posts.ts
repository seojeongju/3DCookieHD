import { Hono } from 'hono';
import type { Bindings, JWTPayload, Post } from '../types';
import { authMiddleware, requireRole, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();

// ... (omitted)

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
