import { Hono } from 'hono';
import type { Bindings, JWTPayload, Post } from '../types';
import { authMiddleware, requireRole, requireAdmin } from '../middleware/auth';
import { verifyToken, hashPassword, verifyPassword } from '../utils/jwt';
import {
  removeEducationPerformanceByPostId,
  syncEducationPerformanceFromEducationPhotoPost,
} from '../utils/education_performance_sync';
import { normalizeGalleryTitleKey } from '../utils/gallery_title_normalize';
import { importRemoteImageFromUrl } from './upload';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();

const POST_HTML_CONTENT_LIMIT = 50 * 1024;

function parsePostImagesArray(raw: unknown): string[] {
  if (raw == null || raw === '') return [];
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(v) ? v.map((x) => String(x)) : [];
  } catch {
    return [];
  }
}

async function loadPostFullHtmlContent(post: any, R2: R2Bucket | undefined): Promise<string> {
  let content = post.content || '';
  const r2UrlMatch =
    content.match(/\[R2:(\/api\/upload\/files\/[^\]]+)\]/) || content.match(/URL: (\/api\/upload\/files\/[^\]]+)/);
  if (r2UrlMatch && r2UrlMatch[1] && R2) {
    try {
      const filePath = r2UrlMatch[1].replace('/api/upload/files/', '');
      const object = await R2.get(filePath);
      if (object) {
        const decoder = new TextDecoder('utf-8');
        content = decoder.decode(await object.arrayBuffer());
      }
    } catch (e) {
      console.error('loadPostFullHtmlContent:', e);
    }
  }
  return content;
}

function collectHrdmarketUrls(fullContent: string, images: string[]): string[] {
  const set = new Set<string>();
  const addFromText = (t: string) => {
    const normalized = String(t).replace(/&amp;/g, '&');
    const re = /https?:\/\/(?:[a-z0-9-]+\.)?hrdmarket\.co\.kr[^\s"'<>]*/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(normalized)) !== null) {
      let u = m[0];
      u = u.replace(/[),.;]+$/g, '');
      set.add(u);
    }
  };
  addFromText(fullContent);
  for (const im of images) addFromText(im);
  return [...set];
}

function replaceUrlsInString(s: string, map: Map<string, string>): string {
  let out = s;
  const pairs = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of pairs) {
    if (from === to) continue;
    out = out.split(from).join(to);
    const fromAmp = from.replace(/&/g, '&amp;');
    if (fromAmp !== from) {
      out = out.split(fromAmp).join(to.replace(/&/g, '&amp;'));
    }
  }
  return out;
}

async function persistMigratedPost(
  c: { env: Bindings; get: (k: 'user') => JWTPayload },
  post: any,
  newContent: string,
  newImages: string[]
): Promise<void> {
  const { DB, R2 } = c.env;
  const user = c.get('user');
  if (!R2) {
    throw new Error('R2가 필요합니다');
  }
  const imagesJson = JSON.stringify(newImages);

  let finalContent = newContent;
  if (newContent.length > POST_HTML_CONTENT_LIMIT) {
    const oldMatch =
      post.content &&
      (post.content.match(/\[R2:(\/api\/upload\/files\/[^\]]+)\]/) ||
        post.content.match(/URL: (\/api\/upload\/files\/[^\]]+)/));
    if (oldMatch && oldMatch[1]) {
      const oldPath = oldMatch[1].replace('/api/upload/files/', '');
      try {
        await R2.delete(oldPath);
      } catch {
        /* ignore */
      }
    }
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `posts/content/${timestamp}_${randomStr}_${user.userId}.html`;
    const encoder = new TextEncoder();
    await R2.put(filePath, encoder.encode(newContent), {
      httpMetadata: { contentType: 'text/html; charset=utf-8', cacheControl: 'public, max-age=31536000' },
      customMetadata: {
        originalName: `post_${timestamp}.html`,
        uploadedBy: user.userId.toString(),
        uploadedAt: new Date().toISOString(),
        postTitle: String(post.title || '').substring(0, 100),
      },
    });
    const contentUrl = `/api/upload/files/${filePath}`;
    finalContent = `[R2:${contentUrl}]`;
  } else {
    const oldMatch =
      post.content &&
      (post.content.match(/\[R2:(\/api\/upload\/files\/[^\]]+)\]/) ||
        post.content.match(/URL: (\/api\/upload\/files\/[^\]]+)/));
    if (oldMatch && oldMatch[1]) {
      const oldPath = oldMatch[1].replace('/api/upload/files/', '');
      try {
        await R2.delete(oldPath);
      } catch {
        /* ignore */
      }
    }
    finalContent = newContent;
  }

  await DB.prepare(`UPDATE posts SET content = ?, images = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(finalContent, imagesJson, post.id)
    .run();

  const epRow = await DB.prepare(
    `SELECT id, title, category, created_at, status FROM posts WHERE id = ?`
  )
    .bind(post.id)
    .first<{ id: number; title: string | null; category: string | null; created_at: string | null; status: string | null }>();
  if (epRow) {
    try {
      await syncEducationPerformanceFromEducationPhotoPost(DB, epRow);
    } catch (syncErr) {
      console.error('migrate-hrdmarket: education_performance sync failed', syncErr);
    }
  }
}

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
    const sort = c.req.query('sort') || 'created_at';
    const order = (c.req.query('order') || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (page - 1) * limit;

    const base = `
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN courses c ON p.course_id = c.id
      LEFT JOIN approved_courses ac ON p.course_id = ac.id
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

    const mine = c.req.query('mine');
    const authHeader = c.req.header('Authorization');
    let viewer: JWTPayload | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      viewer = await verifyToken(authHeader.substring(7));
    }

    const authorId = c.req.query('author_id');
    if (mine === '1' || mine === 'true') {
      if (!viewer) {
        return c.json({ success: false, error: '로그인이 필요합니다' }, 401);
      }
      whereClauses.push(' AND p.author_id = ?');
      params.push(viewer.userId);
    } else if (authorId) {
      if (!viewer || (Number(authorId) !== viewer.userId && viewer.role !== 'admin')) {
        return c.json({ success: false, error: '권한이 없습니다' }, 403);
      }
      whereClauses.push(' AND p.author_id = ?');
      params.push(Number(authorId));
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

    const isPrivileged =
      viewer?.role === 'admin' ||
      mine === '1' ||
      mine === 'true' ||
      (authorId && viewer && Number(authorId) === viewer.userId);

    if (!isPrivileged) {
      if (status && status !== 'published') {
        return c.json({ success: false, error: '권한이 없습니다' }, 403);
      }
      if (!status) {
        whereClauses.push(' AND p.status = ?');
        params.push('published');
      }
    }

    const whereSql = whereClauses.join('');

    const countQuery = `SELECT COUNT(*) as total ${base}${whereSql}`;
    const totalResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = totalResult?.total || 0;

    const dataQuery = `
      SELECT p.*, COALESCE(u.name, p.author_name) as author_name,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
      COALESCE(c.title, ac.name) as course_title
      ${base}${whereSql}
      ORDER BY p.pinned DESC, ${sort === 'created_at' ? 'p.created_at' : sort === 'title' ? 'p.title' : sort === 'views' ? 'p.views' : 'p.created_at'} ${order} LIMIT ? OFFSET ?
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

      const isQnaSecret = post.category === 'qna' && post.sub_category === 'secret';
      let outContent = displayContent;
      if (isQnaSecret) {
        outContent = '🔒 비밀글입니다. 내용은 작성자 본인(또는 관리자)만, 비회원 비밀글은 비밀번호 확인 후 볼 수 있습니다.';
      }

      return {
        ...post,
        content: outContent,
        images,
        pinned: Boolean(post.pinned),
        is_secret: Boolean(isQnaSecret)
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
// Q&A 비회원 비밀글 비밀번호 확인
// POST /api/posts/:id/verify-qna-password
// ============================================
app.post('/:id/verify-qna-password', async (c) => {
  try {
    const { DB } = c.env;
    const id = c.req.param('id');
    let body: { password?: string };
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, error: 'JSON 본문이 필요합니다' }, 400);
    }
    const password = body.password != null ? String(body.password) : '';

    const post = await DB.prepare(`
      SELECT p.*, COALESCE(u.name, p.author_name) as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).bind(id).first() as any;

    if (!post || post.category !== 'qna' || post.sub_category !== 'secret' || post.author_id != null) {
      return c.json({ success: false, error: '비밀번호 확인이 필요 없는 글입니다' }, 400);
    }
    if (!post.guest_password_hash) {
      return c.json({ success: false, error: '비밀번호가 설정되지 않은 글입니다' }, 400);
    }
    const ok = await verifyPassword(password, post.guest_password_hash);
    if (!ok) {
      return c.json({ success: false, error: '비밀번호가 일치하지 않습니다' }, 401);
    }

    await DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();

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
          }
        }
      } catch {
        /* ignore */
      }
    }

    delete post.guest_password_hash;
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
    console.error('verify-qna-password:', error);
    return c.json({ success: false, error: '처리 중 오류가 발생했습니다' }, 500);
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

    // 게시글 조회
    const post = await DB.prepare(`
      SELECT p.*, COALESCE(u.name, p.author_name) as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).bind(id).first() as any;

    if (!post) {
      return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
    }

    const authHeader = c.req.header('Authorization');
    let viewer: JWTPayload | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      viewer = await verifyToken(authHeader.substring(7));
    }

    const isPublished = post.status === 'published';
    if (!isPublished) {
      if (!viewer) {
        return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
      }
      if (viewer.role !== 'admin' && Number(post.author_id) !== Number(viewer.userId)) {
        return c.json({ success: false, error: '게시글을 찾을 수 없습니다' }, 404);
      }
    }

    const isQnaSecret = post.category === 'qna' && post.sub_category === 'secret';
    if (isQnaSecret) {
      const isAdmin = viewer?.role === 'admin';
      const isAuthor = viewer && post.author_id != null && Number(post.author_id) === Number(viewer.userId);
      const isGuestSecret = post.author_id == null && post.guest_password_hash;
      if (!isAdmin && !isAuthor) {
        if (isGuestSecret) {
          return c.json({
            success: false,
            error: '비밀글입니다. 비밀번호를 입력해 주세요.',
            code: 'QNA_SECRET_GUEST',
            needsPassword: true
          }, 403);
        }
        return c.json({
          success: false,
          error: '비밀글은 작성자만 열람할 수 있습니다.',
          code: 'QNA_SECRET_DENIED'
        }, 403);
      }
    }

    // 조회수 증가 (공개 열람 또는 권한 있는 비공개 열람 시에만)
    await DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();

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

    delete post.guest_password_hash;

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
app.post('/', async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch (e: any) {
    console.error('POST /api/posts: invalid JSON body', e?.message ?? e);
    return c.json({ success: false, error: '요청 본문이 올바른 JSON이 아닙니다' }, 400);
  }

  try {
    const { DB } = c.env;
    const authHeader = c.req.header('Authorization');
    let user: JWTPayload | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      user = await verifyToken(authHeader.substring(7));
    }

    const { title, content, category, images, pinned, status, course_id, enrollment_id, rating, created_at } = body;

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

    if (!user && cat !== 'qna') {
      return c.json({ success: false, error: '로그인이 필요합니다' }, 401);
    }

    // 공지사항, FAQ: 관리자만
    if ((cat === 'notice' || cat === 'faq') && (!user || user.role !== 'admin')) {
      return c.json({ success: false, error: '공지사항과 FAQ는 관리자만 작성할 수 있습니다' }, 403);
    }

    const { sub_category: bodySubCategory, content_url, teacher_feedback, author_id: bodyAuthorId } = body;

    let finalAuthorId: number | null = user ? user.userId : null;
    let guestAuthorName: string | null = null;
    let guestPasswordHash: string | null = null;
    let qnaSubCategory: string | null = null;

    if (cat === 'qna') {
      if (user) {
        const secret = body.qna_secret === true || body.qna_secret === '1' || body.sub_category === 'secret';
        qnaSubCategory = secret ? 'secret' : 'public';
        finalAuthorId = user.userId;
      } else {
        guestAuthorName = String(body.author_name || '').trim();
        if (!guestAuthorName) {
          return c.json({ success: false, error: '비회원 작성 시 작성자 이름은 필수입니다' }, 400);
        }
        const secret = body.qna_secret === true || body.qna_secret === '1' || body.sub_category === 'secret';
        qnaSubCategory = secret ? 'secret' : 'public';
        if (secret) {
          const pw = String(body.guest_password || '').trim();
          if (pw.length < 4) {
            return c.json({ success: false, error: '비밀글 비밀번호는 4자 이상이어야 합니다' }, 400);
          }
          guestPasswordHash = await hashPassword(pw);
        }
        finalAuthorId = null;
      }
    }

    // 강사 및 관리자가 학생의 포트폴리오/시제품·수강후기를 대신 올리는 경우 처리 (author_id 먼저 확정)
    if (user && bodyAuthorId != null && String(bodyAuthorId).trim() !== '' && Number(bodyAuthorId) !== user.userId) {
      if (user.role === 'admin') {
        finalAuthorId = Number(bodyAuthorId);
      } else if (user.role === 'teacher') {
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

    const resolvedSubCategory =
      cat === 'qna' && qnaSubCategory ? qnaSubCategory : (bodySubCategory != null ? String(bodySubCategory) : null);

    // 리뷰 특정 처리 (작성자 확정 후 중복·수강 검증)
    if (cat === 'review') {
      if (!course_id || !rating) {
        return c.json({ success: false, error: '과정 ID와 평점은 필수입니다' }, 400);
      }
      if (rating < 1 || rating > 5) {
        return c.json({ success: false, error: '평점은 1-5 사이여야 합니다' }, 400);
      }
      const existing = await DB.prepare('SELECT id FROM posts WHERE category = ? AND author_id = ? AND course_id = ?').bind('review', finalAuthorId, course_id).first();
      if (existing) {
        return c.json({ success: false, error: '해당 작성자는 이 과정에 이미 리뷰가 있습니다' }, 400);
      }

      if (user.role !== 'admin') {
        const legacyOk = await DB.prepare(`
          SELECT 1 as ok FROM enrollments
          WHERE user_id = ? AND course_id = ? AND status = 'approved'
        `).bind(finalAuthorId, Number(course_id)).first<{ ok: number }>();
        const hrdOk = await DB.prepare(`
          SELECT 1 as ok FROM course_session_enrollments e
          INNER JOIN course_sessions s ON e.session_id = s.id
          WHERE e.user_id = ? AND s.approved_course_id = ? AND e.status IN ('approved', 'enrolled')
        `).bind(finalAuthorId, Number(course_id)).first<{ ok: number }>();
        if (!legacyOk && !hrdOk) {
          return c.json({ success: false, error: '해당 과정의 승인된 수강 등록이 있어야 후기를 작성할 수 있습니다' }, 403);
        }
      }

      const authorExists = await DB.prepare('SELECT id FROM users WHERE id = ?').bind(finalAuthorId).first();
      if (!authorExists) {
        return c.json({ success: false, error: '존재하지 않는 작성자(사용자) ID입니다' }, 400);
      }
    }

    const pin = pinned === true || pinned === 1 || pinned === '1';
    if (pin && (!user || user.role !== 'admin')) {
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

    let st = status && ['draft', 'published', 'hidden'].includes(String(status))
      ? String(status)
      : 'published';

    // 수강후기: 학생·강사 작성분은 관리자 승인 전까지 비공개( hidden ). 관리자만 최초 공개 게시 가능.
    if (cat === 'review' && user && user.role !== 'admin') {
      st = 'hidden';
    }

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
        const uidPart = user?.userId != null ? String(user.userId) : `guest_${timestamp}`;
        const filePath = `posts/content/${timestamp}_${randomStr}_${uidPart}.html`;

        const encoder = new TextEncoder();
        const contentBuffer = encoder.encode(cont);

        await R2.put(filePath, contentBuffer, {
          httpMetadata: {
            contentType: 'text/html; charset=utf-8',
            cacheControl: 'public, max-age=31536000',
          },
          customMetadata: {
            originalName: `post_${timestamp}.html`,
            uploadedBy: String(user?.userId ?? 0),
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
      author_id: finalAuthorId,
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
        author_id, title, content, category, sub_category, author_name, guest_password_hash, images,
        views, likes, pinned, status, course_id, enrollment_id, rating, 
        content_url, teacher_feedback, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      finalAuthorId,
      tit,
      finalContent,
      cat,
      resolvedSubCategory,
      guestAuthorName,
      guestPasswordHash,
      imagesJson,
      pin ? 1 : 0,
      st,
      course_id || null,
      enrollment_id || null,
      rating != null ? Number(rating) : null,
      content_url || null,
      teacher_feedback || null,
      (created_at && user?.role === 'admin') ? created_at : new Date().toISOString().replace('T', ' ').substring(0, 19)
    ).run();

    if (cat === 'review' && course_id) {
      await updateCourseRating(DB, Number(course_id));
    }

    const newPostId = Number(result.meta.last_row_id);
    console.log('POST /api/posts: Insert successful', { id: newPostId });

    if (cat === 'education_photo') {
      const epRow = await DB.prepare(
        `SELECT id, title, category, created_at, status FROM posts WHERE id = ?`
      )
        .bind(newPostId)
        .first<{ id: number; title: string | null; category: string | null; created_at: string | null; status: string | null }>();
      if (epRow) {
        try {
          await syncEducationPerformanceFromEducationPhotoPost(DB, epRow);
        } catch (syncErr) {
          console.error('POST /api/posts: education_performance sync failed', syncErr);
        }
      }
    }

    return c.json({
      success: true,
      data: {
        id: newPostId,
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
        const ins = await DB.prepare(`
          INSERT INTO posts ( author_id, title, content, category, images, views, likes, pinned, status, created_at, updated_at )
          VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?, datetime('now'), datetime('now'))
        `).bind(user.userId, tit, finalContent, cat, imagesJson, st).run();
        const bulkId = Number(ins.meta.last_row_id);
        if (cat === 'education_photo') {
          const epRow = await DB.prepare(
            `SELECT id, title, category, created_at, status FROM posts WHERE id = ?`
          )
            .bind(bulkId)
            .first<{ id: number; title: string | null; category: string | null; created_at: string | null; status: string | null }>();
          if (epRow) {
            try {
              await syncEducationPerformanceFromEducationPhotoPost(DB, epRow);
            } catch (syncErr) {
              console.error('POST /api/posts/bulk: education_performance sync failed', syncErr);
            }
          }
        }
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

/** POST /api/posts/dedupe-education-photo-titles — 동일 제목(정규화) 중복 글 삭제, 최신 글(id 큰 것) 1건만 유지 */
app.post('/dedupe-education-photo-titles', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const { results } = await DB.prepare(
      `SELECT id, title FROM posts WHERE category = 'education_photo' ORDER BY id ASC`
    ).all<{ id: number; title: string | null }>();

    const groups = new Map<string, { id: number; title: string | null }[]>();
    for (const row of results || []) {
      const key = normalizeGalleryTitleKey(row.title);
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    const toDelete: number[] = [];
    let duplicateGroupCount = 0;
    for (const rows of groups.values()) {
      if (rows.length <= 1) continue;
      duplicateGroupCount++;
      rows.sort((a, b) => a.id - b.id);
      const keepIndex = rows.length - 1;
      for (let i = 0; i < rows.length; i++) {
        if (i !== keepIndex) {
          toDelete.push(rows[i].id);
        }
      }
    }

    let deleted = 0;
    const deletedIds: number[] = [];
    for (const delId of toDelete) {
      try {
        await removeEducationPerformanceByPostId(DB, delId);
        await DB.prepare('DELETE FROM posts WHERE id = ?').bind(delId).run();
        deleted++;
        deletedIds.push(delId);
      } catch (e) {
        console.error('dedupe-education-photo-titles: delete failed', delId, e);
      }
    }

    return c.json({
      success: true,
      data: {
        deleted,
        duplicate_groups: duplicateGroupCount,
        deleted_ids: deletedIds,
      },
    });
  } catch (e: unknown) {
    console.error('dedupe-education-photo-titles:', e);
    return c.json({ success: false, error: '중복 정리 실패' }, 500);
  }
});

function parseOptionalPostCategoryFilter(raw: unknown): string | null {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(s)) return null;
  return s;
}

/**
 * POST /api/posts/admin/migrate-hrdmarket-images
 * hrdmarket.co.kr 이미지 URL을 다운로드해 R2에 저장하고, 게시글 content·images의 URL을 우리 서버 경로로 치환합니다.
 * body: { dry_run?: boolean, limit?: number (1~40, 기본 8), offset?: number, category?: string (선택, 예: prototype, education_photo) }
 */
app.post('/admin/migrate-hrdmarket-images', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB, R2 } = c.env;
    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
    const dryRun = Boolean(body?.dry_run);
    const limit = Math.min(40, Math.max(1, Number(body?.limit) || 8));
    const offset = Math.max(0, Number(body?.offset) || 0);
    const categoryFilter = parseOptionalPostCategoryFilter(body?.category);
    if (body?.category != null && String(body.category).trim() !== '' && !categoryFilter) {
      return c.json({ success: false, error: 'category는 영문·숫자·_- 만, 최대 64자여야 합니다' }, 400);
    }

    const user = c.get('user');
    const origin = new URL(c.req.url).origin;

    const totalRow = categoryFilter
      ? await DB.prepare(`SELECT COUNT(*) as total FROM posts WHERE category = ?`)
          .bind(categoryFilter)
          .first<{ total: number }>()
      : await DB.prepare(`SELECT COUNT(*) as total FROM posts`).first<{ total: number }>();
    const totalPosts = totalRow?.total ?? 0;

    const { results: rows } = categoryFilter
      ? await DB.prepare(`SELECT * FROM posts WHERE category = ? ORDER BY id LIMIT ? OFFSET ?`)
          .bind(categoryFilter, limit, offset)
          .all()
      : await DB.prepare(`SELECT * FROM posts ORDER BY id LIMIT ? OFFSET ?`)
          .bind(limit, offset)
          .all();

    const list = Array.isArray(rows) ? rows : [];
    const reports: Array<Record<string, unknown>> = [];
    let updated = 0;
    let wouldUpdate = 0;
    let skipped = 0;
    let errors = 0;

    for (const post of list) {
      const p = post as any;
      try {
        const images = parsePostImagesArray(p.images);
        const fullContent = await loadPostFullHtmlContent(p, R2);
        const urls = collectHrdmarketUrls(fullContent, images);
        if (urls.length === 0) {
          skipped++;
          reports.push({ id: p.id, status: 'skipped', reason: 'no_hrdmarket_urls' });
          continue;
        }

        const urlMap = new Map<string, string>();
        let failReason: string | null = null;
        for (const u of urls) {
          if (dryRun) {
            urlMap.set(u, u);
            continue;
          }
          const r = await importRemoteImageFromUrl(c.env, user, origin, u, {
            category: 'images',
            folder: 'posts',
          });
          if (!r.success) {
            failReason = r.error;
            break;
          }
          urlMap.set(u, r.data.url);
          await new Promise((res) => setTimeout(res, 100));
        }

        if (failReason) {
          errors++;
          reports.push({ id: p.id, status: 'error', error: failReason, urls_found: urls.length });
          continue;
        }

        if (dryRun) {
          wouldUpdate++;
          reports.push({ id: p.id, status: 'would_migrate', url_count: urls.length });
          continue;
        }

        const newContent = replaceUrlsInString(fullContent, urlMap);
        const newImages = images.map((im) => replaceUrlsInString(im, urlMap));
        await persistMigratedPost(c, p, newContent, newImages);
        updated++;
        reports.push({ id: p.id, status: 'migrated', urls_replaced: urls.length });
      } catch (e: unknown) {
        errors++;
        const msg = e instanceof Error ? e.message : String(e);
        reports.push({ id: (post as any).id, status: 'error', error: msg });
      }
    }

    const rowCount = list.length;
    const nextOffset = offset + rowCount;
    const hasMore = nextOffset < totalPosts;

    return c.json({
      success: true,
      data: {
        dry_run: dryRun,
        batch: {
          limit,
          offset,
          next_offset: nextOffset,
          has_more: hasMore,
          total_posts: totalPosts,
          category: categoryFilter,
        },
        summary: {
          processed: rowCount,
          skipped_no_hrd: skipped,
          updated: dryRun ? 0 : updated,
          would_update: dryRun ? wouldUpdate : 0,
          errors,
        },
        posts: reports,
      },
    });
  } catch (e: unknown) {
    console.error('migrate-hrdmarket-images:', e);
    return c.json({ success: false, error: '마이그레이션 처리 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * GET /api/posts/admin/migrate-hrdmarket-images/status
 * DB의 content·images 컬럼 문자열에 'hrdmarket'이 남아 있는 글 수(빠른 확인). R2 전용 본문은 여기서 안 잡힐 수 있음.
 * query: category (선택) — 지정 시 해당 카테고리 글만 집계
 */
app.get('/admin/migrate-hrdmarket-images/status', authMiddleware, requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const q = c.req.query('category');
    const categoryFilter = parseOptionalPostCategoryFilter(q);
    if (q != null && String(q).trim() !== '' && !categoryFilter) {
      return c.json({ success: false, error: 'category 쿼리는 영문·숫자·_- 만, 최대 64자여야 합니다' }, 400);
    }

    const row = categoryFilter
      ? await DB.prepare(
          `
      SELECT COUNT(*) as n FROM posts
      WHERE category = ?
        AND (IFNULL(content,'') LIKE '%hrdmarket%' OR IFNULL(images,'') LIKE '%hrdmarket%')
    `,
        )
          .bind(categoryFilter)
          .first<{ n: number }>()
      : await DB.prepare(`
      SELECT COUNT(*) as n FROM posts
      WHERE IFNULL(content,'') LIKE '%hrdmarket%' OR IFNULL(images,'') LIKE '%hrdmarket%'
    `).first<{ n: number }>();
    return c.json({
      success: true,
      data: {
        posts_with_hrdmarket_in_db_columns: row?.n ?? 0,
        category: categoryFilter,
        note:
          '본문이 DB가 아니라 R2([R2:...])에만 있는 글은 이 숫자에 안 잡힐 수 있습니다. 최종 확인은 「미리보기」로 전체 스캔해 대상 합이 0인지 보세요.',
      },
    });
  } catch (e: unknown) {
    console.error('migrate-hrdmarket-images/status:', e);
    return c.json({ success: false, error: '조회 실패' }, 500);
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

    const { title, content, images, pinned, status, sub_category, content_url, teacher_feedback, created_at, category } = body;

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

    const { title: newTitle, content: newContent, images: newImages, pinned: newPinned, status: newStatus, rating: newRating, created_at: newCreatedAt } = body;

    let effectiveStatus = newStatus !== undefined ? newStatus : post.status;
    if (post.category === 'review' && user.role !== 'admin') {
      effectiveStatus = post.status;
    }

    const effectiveCategory =
      user.role === 'admin' && category !== undefined ? String(category).trim() : post.category;

    // 게시글 수정
    await DB.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, images = ?, category = ?,
          pinned = ?, status = ?, rating = ?, 
          sub_category = ?, content_url = ?, teacher_feedback = ?,
          created_at = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      newTitle ?? post.title,
      finalContent,
      imagesJsonForUpdate,
      effectiveCategory,
      (newPinned !== undefined && user.role === 'admin') ? (newPinned ? 1 : 0) : post.pinned,
      effectiveStatus,
      newRating ?? post.rating,
      sub_category !== undefined ? sub_category : post.sub_category,
      content_url !== undefined ? content_url : post.content_url,
      teacher_feedback !== undefined ? teacher_feedback : post.teacher_feedback,
      (newCreatedAt && user.role === 'admin') ? newCreatedAt : post.created_at,
      id
    ).run();

    if (post.category === 'review' && post.course_id) {
      await updateCourseRating(DB, Number(post.course_id));
    }

    const epRow = await DB.prepare(
      `SELECT id, title, category, created_at, status FROM posts WHERE id = ?`
    )
      .bind(id)
      .first<{ id: number; title: string | null; category: string | null; created_at: string | null; status: string | null }>();
    if (epRow) {
      try {
        await syncEducationPerformanceFromEducationPhotoPost(DB, epRow);
      } catch (syncErr) {
        console.error('PUT /api/posts/:id: education_performance sync failed', syncErr);
      }
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

    try {
      await removeEducationPerformanceByPostId(DB, Number(id));
    } catch (syncErr) {
      console.error('DELETE /api/posts/:id: education_performance cleanup failed', syncErr);
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
