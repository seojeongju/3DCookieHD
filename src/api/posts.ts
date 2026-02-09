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
    const authorId = c.req.query('author_id');
    if (authorId) {
      whereClauses.push(' AND p.author_id = ?');
      params.push(authorId);
    }
    const subCategory = c.req.query('sub_category');
    if (subCategory) {
      whereClauses.push(' AND p.sub_category = ?');
      params.push(subCategory);
    }
    const courseId = c.req.query('course_id');
    if (courseId) {
      whereClauses.push(' AND p.course_id = ?');
      params.push(courseId);
    }
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

      // R2에 저장된 콘텐츠는 목록에서 간단히 표시 (상세 조회에서 로드)
      let displayContent = post.content || '';
      if (post.content && (post.content.startsWith('[R2:') || post.content.includes('[콘텐츠가 R2 스토리지에 저장되었습니다'))) {
        displayContent = '[대용량 콘텐츠 - 상세보기에서 확인 가능]';
      }

      if (images.length === 0 && displayContent) {
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
        const match = displayContent.match(imgRegex);
        if (match?.[1]) images = [match[1]];
      }

      return {
        ...post,
        content: displayContent,
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
    `).bind(id).first() as any;

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

    // R2에 저장된 콘텐츠인지 확인하고 로드
    let finalContent = post.content || '';
    const r2UrlMatch = post.content && (
      post.content.match(/\[R2:(\/api\/upload\/files\/[^\]]+)\]/) ||
      post.content.match(/URL: (\/api\/upload\/files\/[^\]]+)/)
    );
    if (r2UrlMatch && r2UrlMatch[1]) {
      try {
        const { R2 } = c.env;
        if (R2) {
          const filePath = r2UrlMatch[1].replace('/api/upload/files/', '');
          const object = await R2.get(filePath);
          if (object) {
            const decoder = new TextDecoder('utf-8');
            finalContent = decoder.decode(await object.arrayBuffer());
            console.log('GET /api/posts/:id: Loaded content from R2', { filePath, contentLength: finalContent.length });
          }
        }
      } catch (r2Error: any) {
        console.error('GET /api/posts/:id: Failed to load content from R2', r2Error?.message ?? r2Error);
      }
    }

    return c.json({
      success: true,
      data: {
        ...post,
        content: finalContent,
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

    if (!user || !user.userId) {
      console.error('POST /api/posts: user not found or userId missing', { user });
      return c.json({ success: false, error: '인증 정보가 올바르지 않습니다' }, 401);
    }

    const { title, content, category, images, pinned, status, course_id, enrollment_id, rating } = body;

    const tit = title != null ? String(title).trim() : '';
    const cont = content != null ? String(content) : '';
    const cat = category != null ? String(category).trim() : '';

    if (!tit && cat !== 'review') {
      return c.json({ success: false, error: '제목은 필수입니다' }, 400);
    }
    if (!cat) {
      return c.json({ success: false, error: '카테고리는 필수입니다' }, 400);
    }
    if (!cont) {
      return c.json({ success: false, error: '내용은 필수입니다' }, 400);
    }

    // 리뷰 특정 처리
    if (cat === 'review') {
      if (!course_id || !rating) {
        return c.json({ success: false, error: '과정 ID와 평점은 필수입니다' }, 400);
      }
      if (rating < 1 || rating > 5) {
        return c.json({ success: false, error: '평점은 1-5 사이여야 합니다' }, 400);
      }
      // 중복 리뷰 확인
      const existing = await DB.prepare('SELECT id FROM posts WHERE category = ? AND author_id = ? AND course_id = ?').bind('review', user.userId, course_id).first();
      if (existing) {
        return c.json({ success: false, error: '이미 리뷰를 작성하셨습니다' }, 400);
      }
    }

    // 공지사항, FAQ: 관리자만 작성 가능 / Q&A: 관리자·수강생 작성 가능
    if ((cat === 'notice' || cat === 'faq') && user.role !== 'admin') {
      return c.json({ success: false, error: '공지사항과 FAQ는 관리자만 작성할 수 있습니다' }, 403);
    }

    let finalAuthorId = user.userId;
    const { sub_category, content_url, teacher_feedback, author_id: bodyAuthorId } = body;

    // 강사 및 관리자가 학생의 포트폴리오/시제품을 대신 올리는 경우 처리
    if (bodyAuthorId && Number(bodyAuthorId) !== user.userId) {
      if (user.role === 'admin') {
        finalAuthorId = Number(bodyAuthorId);
      } else if (user.role === 'teacher') {
        // 강사인 경우, 해당 학생이 본인의 과정을 수강하고 있는지 확인 (단순화된 검증)
        const enrollment = await DB.prepare(`
                SELECT e.id FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                WHERE e.user_id = ? AND c.teacher_id = ?
            `).bind(bodyAuthorId, user.userId).first();

        if (!enrollment) {
          return c.json({ success: false, error: '담당 학생의 게시물만 등록 가능합니다' }, 403);
        }
        finalAuthorId = Number(bodyAuthorId);
      } else {
        return c.json({ success: false, error: '본인의 게시물만 등록 가능합니다' }, 403);
      }
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

    // D1 TEXT 컬럼 크기 제한. 초과 시 R2에만 저장하고 DB에는 URL만 저장.
    const CONTENT_SIZE_LIMIT = 50 * 1024; // 50KB (D1 한계 회피)
    let finalContent = cont;
    let contentUrl: string | null = null;

    if (cont.length > CONTENT_SIZE_LIMIT) {
      const { R2 } = c.env;
      if (!R2) {
        return c.json({
          success: false,
          error: '콘텐츠가 너무 큽니다. R2 스토리지가 설정되지 않아 저장할 수 없습니다. 콘텐츠를 줄여 주세요.',
        }, 400);
      }
      try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filePath = `posts/content/${timestamp}_${randomStr}_${user.userId}.html`;

        const encoder = new TextEncoder();
        const contentBuffer = encoder.encode(cont);

        await R2.put(filePath, contentBuffer, {
          httpMetadata: {
            contentType: 'text/html; charset=utf-8',
            cacheControl: 'public, max-age=31536000',
          },
          customMetadata: {
            originalName: `post_${timestamp}.html`,
            uploadedBy: user.userId.toString(),
            uploadedAt: new Date().toISOString(),
            postTitle: tit.substring(0, 100),
          },
        });

        contentUrl = `/api/upload/files/${filePath}`;
        finalContent = `[R2:${contentUrl}]`;

        console.log('POST /api/posts: Content saved to R2', {
          contentLength: cont.length,
          contentUrl,
          filePath,
        });
      } catch (r2Error: any) {
        console.error('POST /api/posts: Failed to save content to R2', r2Error?.message ?? r2Error);
        return c.json({
          success: false,
          error: '콘텐츠가 너무 커서 R2 저장에 실패했습니다. 글을 나누거나 이미지를 줄여 주세요.',
        }, 400);
      }
    }

    // images JSON도 D1 한계 회피를 위해 길이 제한 (대략 50KB)
    if (imagesJson.length > CONTENT_SIZE_LIMIT) {
      return c.json({
        success: false,
        error: '첨부 이미지 정보가 너무 많습니다. 이미지 수를 줄여 주세요.',
      }, 400);
    }

    console.log('POST /api/posts: Inserting post', {
      author_id: user.userId,
      title: tit,
      category: cat,
      status: st,
      pinned: pin ? 1 : 0,
      imagesLength: imagesJson.length,
      contentLength: finalContent.length,
      contentUrl: contentUrl || 'stored in DB'
    });

    const result = await DB.prepare(`
      INSERT INTO posts (
        author_id, title, content, category, sub_category, images,
        views, likes, pinned, status, course_id, enrollment_id, rating, 
        content_url, teacher_feedback, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      finalAuthorId,
      tit,
      finalContent,
      cat,
      sub_category || null,
      imagesJson,
      pin ? 1 : 0,
      st,
      course_id || null,
      enrollment_id || null,
      rating != null ? Number(rating) : null,
      content_url || null,
      teacher_feedback || null
    ).run();

    if (cat === 'review' && course_id) {
      await updateCourseRating(DB, Number(course_id));
    }

    console.log('POST /api/posts: Insert successful', { id: result.meta.last_row_id });

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: '게시글이 등록되었습니다'
      }
    }, 201);
  } catch (error: any) {
    const errorMsg = error?.message ?? String(error);
    const errorStack = error?.stack;
    console.error('POST /api/posts: Error creating post', {
      message: errorMsg,
      stack: errorStack,
      error: error,
      body: JSON.stringify(body).substring(0, 500)
    });
    return c.json({
      success: false,
      error: `게시글 작성 중 오류가 발생했습니다: ${errorMsg}`
    }, 500);
  }
});

const BULK_MAX_ITEMS = 100;

// ============================================
// 게시글 일괄 작성 (CSV 등 대량 등록용, 1회 최대 100건)
// POST /api/posts/bulk
// ============================================
app.post('/bulk', authMiddleware, async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch (e: any) {
    return c.json({ success: false, error: '요청 본문이 올바른 JSON이 아닙니다' }, 400);
  }

  const rawItems = body?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return c.json({ success: false, error: 'items 배열이 비어있거나 없습니다' }, 400);
  }
  if (rawItems.length > BULK_MAX_ITEMS) {
    return c.json({ success: false, error: `1회 최대 ${BULK_MAX_ITEMS}건까지 등록 가능합니다` }, 400);
  }

  try {
    const { DB } = c.env;
    const user = c.get('user');
    if (!user || !user.userId) {
      return c.json({ success: false, error: '인증 정보가 올바르지 않습니다' }, 401);
    }

    const CONTENT_SIZE_LIMIT = 50 * 1024;
    const results: { ok: number; fail: number; errors: string[] } = { ok: 0, fail: 0, errors: [] };

    for (let idx = 0; idx < rawItems.length; idx++) {
      const item = rawItems[idx];
      const tit = item?.title != null ? String(item.title).trim() : '';
      const cont = item?.content != null ? String(item.content) : '';
      const cat = item?.category != null ? String(item.category).trim() : '';
      if (!tit || !cat) {
        results.fail++;
        results.errors.push(`[${idx + 1}] 제목·카테고리 필수`);
        continue;
      }

      let imagesJson = '[]';
      try {
        if (item.images != null) {
          if (Array.isArray(item.images)) imagesJson = JSON.stringify(item.images);
          else if (typeof item.images === 'string') imagesJson = item.images.trim() || '[]';
        }
      } catch {
        imagesJson = '[]';
      }
      if (imagesJson.length > CONTENT_SIZE_LIMIT) {
        results.fail++;
        results.errors.push(`[${idx + 1}] 이미지 정보 과다`);
        continue;
      }

      const st = item?.status && ['draft', 'published', 'hidden'].includes(String(item.status))
        ? String(item.status)
        : 'published';

      let finalContent = cont;
      if (cont.length > CONTENT_SIZE_LIMIT) {
        const { R2 } = c.env;
        if (!R2) {
          results.fail++;
          results.errors.push(`[${idx + 1}] 콘텐츠 과대( R2 미설정)`);
          continue;
        }
        try {
          const filePath = `posts/content/${Date.now()}_${idx}_${user.userId}.html`;
          await R2.put(filePath, new TextEncoder().encode(cont), {
            httpMetadata: { contentType: 'text/html; charset=utf-8', cacheControl: 'public, max-age=31536000' },
            customMetadata: { postTitle: tit.substring(0, 100) },
          });
          finalContent = `[R2:/api/upload/files/${filePath}]`;
        } catch (r2Err: any) {
          results.fail++;
          results.errors.push(`[${idx + 1}] R2 저장 실패`);
          continue;
        }
      }

      try {
        await DB.prepare(`
          INSERT INTO posts ( author_id, title, content, category, images, views, likes, pinned, status, created_at, updated_at )
          VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?, datetime('now'), datetime('now'))
        `).bind(user.userId, tit, finalContent, cat, imagesJson, st).run();
        results.ok++;
      } catch (insErr: any) {
        results.fail++;
        results.errors.push(`[${idx + 1}] ${(insErr?.message || 'DB 오류').substring(0, 80)}`);
      }
    }

    return c.json({
      success: true,
      data: {
        ok: results.ok,
        fail: results.fail,
        total: rawItems.length,
        errors: results.errors.length > 20 ? results.errors.slice(0, 20).concat([`... 외 ${results.errors.length - 20}건`]) : results.errors,
      },
    }, 200);
  } catch (error: any) {
    console.error('POST /api/posts/bulk:', error?.message ?? error);
    return c.json({ success: false, error: '일괄 등록 중 오류가 발생했습니다' }, 500);
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

    // 권한 확인
    let hasPermission = false;
    if (user.role === 'admin') {
      hasPermission = true;
    } else if (post.author_id === user.userId) {
      hasPermission = true;
    } else if (user.role === 'teacher') {
      // 강사인 경우, 해당 학생의 게시물(포트폴리오 등) 담당자인지 확인
      const enrollment = await DB.prepare(`
            SELECT e.id FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ? AND c.teacher_id = ?
        `).bind(post.author_id, user.userId).first();
      if (enrollment) hasPermission = true;
    }

    if (!hasPermission) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    const { title, content, images, pinned, status, sub_category, content_url, teacher_feedback } = body;

    // D1 TEXT 컬럼 크기 제한을 초과하면 R2에 저장
    const CONTENT_SIZE_LIMIT = 50 * 1024; // 50KB
    let finalContent: string = content ?? post.content;
    const imagesJsonForUpdate = images != null ? (Array.isArray(images) ? JSON.stringify(images) : (typeof images === 'string' ? images.trim() || '[]' : '[]')) : (post.images ?? '[]');

    if (imagesJsonForUpdate.length > CONTENT_SIZE_LIMIT) {
      return c.json({ success: false, error: '첨부 이미지 정보가 너무 많습니다. 이미지 수를 줄여 주세요.' }, 400);
    }

    if (content && content.length > CONTENT_SIZE_LIMIT) {
      const { R2 } = c.env;
      if (!R2) {
        return c.json({
          success: false,
          error: '콘텐츠가 너무 큽니다. R2 스토리지가 설정되지 않아 저장할 수 없습니다. 콘텐츠를 줄여 주세요.',
        }, 400);
      }
      try {
        // 기존 R2 파일이 있으면 삭제 ([R2:...] 또는 구 형식)
        const oldMatch = post.content && (
          post.content.match(/\[R2:(\/api\/upload\/files\/[^\]]+)\]/) ||
          post.content.match(/URL: (\/api\/upload\/files\/[^\]]+)/)
        );
        if (oldMatch && oldMatch[1]) {
          const oldFilePath = oldMatch[1].replace('/api/upload/files/', '');
          try {
            await R2.delete(oldFilePath);
            console.log('PUT /api/posts/:id: Deleted old R2 content', { oldFilePath });
          } catch (deleteError) {
            console.warn('PUT /api/posts/:id: Failed to delete old R2 content', deleteError);
          }
        }

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filePath = `posts/content/${timestamp}_${randomStr}_${user.userId}.html`;
        const encoder = new TextEncoder();
        const contentBuffer = encoder.encode(content);

        await R2.put(filePath, contentBuffer, {
          httpMetadata: { contentType: 'text/html; charset=utf-8', cacheControl: 'public, max-age=31536000' },
          customMetadata: {
            originalName: `post_${timestamp}.html`,
            uploadedBy: user.userId.toString(),
            uploadedAt: new Date().toISOString(),
            postTitle: (title ?? post.title).substring(0, 100),
          },
        });

        const contentUrl = `/api/upload/files/${filePath}`;
        finalContent = `[R2:${contentUrl}]`;
        console.log('PUT /api/posts/:id: Content saved to R2', { contentLength: content.length, contentUrl, filePath });
      } catch (r2Error: any) {
        console.error('PUT /api/posts/:id: Failed to save content to R2', r2Error?.message ?? r2Error);
        return c.json({
          success: false,
          error: '콘텐츠가 너무 커서 R2 저장에 실패했습니다. 글을 나누거나 이미지를 줄여 주세요.',
        }, 400);
      }
    }

    const { title: newTitle, content: newContent, images: newImages, pinned: newPinned, status: newStatus, rating: newRating } = body;

    // 게시글 수정
    await DB.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, images = ?,
          pinned = ?, status = ?, rating = ?, 
          sub_category = ?, content_url = ?, teacher_feedback = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      newTitle ?? post.title,
      finalContent,
      imagesJsonForUpdate,
      (newPinned !== undefined && user.role === 'admin') ? (newPinned ? 1 : 0) : post.pinned,
      newStatus ?? post.status,
      newRating ?? post.rating,
      sub_category !== undefined ? sub_category : post.sub_category,
      content_url !== undefined ? content_url : post.content_url,
      teacher_feedback !== undefined ? teacher_feedback : post.teacher_feedback,
      id
    ).run();

    if (post.category === 'review' && post.course_id) {
      await updateCourseRating(DB, Number(post.course_id));
    }

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
    const post = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first() as any;

    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    // 권한 확인
    let hasPermission = false;
    if (user.role === 'admin') {
      hasPermission = true;
    } else if (post.author_id === user.userId) {
      hasPermission = true;
    } else if (user.role === 'teacher') {
      const enrollment = await DB.prepare(`
            SELECT e.id FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ? AND c.teacher_id = ?
        `).bind(post.author_id, user.userId).first();
      if (enrollment) hasPermission = true;
    }

    if (!hasPermission) {
      return c.json({ success: false, error: '권한이 없습니다' }, 403);
    }

    // 게시글 삭제 (댓글도 CASCADE로 삭제됨)
    await DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

    if (post.category === 'review' && post.course_id) {
      await updateCourseRating(DB, Number(post.course_id));
    }

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
    const post = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(post_id).first() as any;
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

// ============================================
// 헬퍼 함수: 과정 평점 업데이트
// ============================================
async function updateCourseRating(DB: D1Database, course_id: number) {
  const result = await DB.prepare(`
    SELECT 
      COUNT(*) as review_count,
      AVG(rating) as avg_rating
    FROM posts
    WHERE course_id = ? AND category = 'review' AND status = 'published'
  `).bind(course_id).first<{ review_count: number; avg_rating: number }>();

  await DB.prepare(`
    UPDATE courses 
    SET rating = ?, review_count = ?
    WHERE id = ?
  `).bind(
    result?.avg_rating ? parseFloat(result.avg_rating.toFixed(1)) : 0,
    result?.review_count || 0,
    course_id
  ).run();
}

export default app;
