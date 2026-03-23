import { Hono } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();

/** 마이그레이션 미적용 DB에서도 목록 API가 동작하도록, status 컬럼 존재 여부 확인 */
async function studentPortfoliosHasStatusColumn(DB: D1Database): Promise<boolean> {
    try {
        const { results } = await DB.prepare('PRAGMA table_info(student_portfolios)').all();
        const rows = (results || []) as Array<{ name: string }>;
        return rows.some((r) => r.name === 'status');
    } catch {
        return false;
    }
}

/** Authorization 헤더로 관리자·강사 여부 (목록 전체 조회용) */
async function getStaffFromHeader(c: { req: { header: (n: string) => string | undefined } }): Promise<boolean> {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const payload = await verifyToken(auth.slice(7));
  const role = (payload?.role || '').toLowerCase();
  return role === 'admin' || role === 'teacher';
}

function normalizePortfolioStatus(raw: unknown): 'draft' | 'published' | 'hidden' {
  const s = String(raw || '').toLowerCase();
  if (s === 'draft' || s === 'hidden' || s === 'published') return s;
  return 'published';
}

// HTML 태그 제거 및 텍스트만 추출 (목록·요약용)
function stripHtml(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// 콘텐츠에서 첫 번째 이미지 URL 추출
function extractFirstImage(content: string): string {
    if (!content) return '';
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const match = content.match(imgRegex);
    return match ? match[1] : '';
}

// ============================================
// 포트폴리오 목록 조회
// GET /api/portfolios
// ============================================
app.get('/', async (c) => {
    try {
        const { DB } = c.env;
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 24;
        const search = c.req.query('search');
        const isFeatured = c.req.query('isFeatured') === 'true';
        const studentId = c.req.query('studentId');
        const courseId = c.req.query('courseId');
        const staff = await getStaffFromHeader(c);
        const hasStatusCol = await studentPortfoliosHasStatusColumn(DB);

        let where = "WHERE 1=1";
        const params: any[] = [];

        // 비로그인·일반 사용자: 공개(published)만 — status 컬럼이 있을 때만 필터 (미적용 DB 호환)
        if (!staff && hasStatusCol) {
            where += " AND (p.status IS NULL OR p.status = 'published')";
        }

        if (search) {
            where += " AND (p.title LIKE ? OR p.description LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (isFeatured) {
            where += " AND p.is_featured = 1";
        }
        if (studentId) {
            where += " AND p.student_id = ?";
            params.push(studentId);
        }
        if (courseId) {
            where += " AND p.course_id = ?";
            params.push(courseId);
        }

        // 전체 카운트 조회
        const countSql = `SELECT COUNT(*) as count FROM student_portfolios p ${where}`;
        let countStmt = DB.prepare(countSql);
        if (params.length > 0) countStmt = countStmt.bind(...params);
        const countRes = await countStmt.first() as any;
        const total = countRes ? countRes.count : 0;

        // 목록 조회
        const offset = (page - 1) * limit;
        const sql = `
            SELECT p.*, u.name as student_name, c.title as course_title
            FROM student_portfolios p
            LEFT JOIN users u ON p.student_id = u.id
            LEFT JOIN courses c ON p.course_id = c.id
            ${where}
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `;
        let stmt = DB.prepare(sql).bind(...params, limit, offset);
        const { results } = await stmt.all();

        const data = (results || []).map((p: any) => {
            // thumbnail_url이 없으면 description(HTML)에서 추출
            let thumb = p.thumbnail_url;
            if (!thumb && p.description) {
                thumb = extractFirstImage(p.description);
            }
            const st = normalizePortfolioStatus(p.status);
            const descriptionPlain = stripHtml(String(p.description || ''));
            return {
                ...p,
                status: st,
                thumbnail_url: thumb,
                is_featured: Boolean(p.is_featured),
                description_plain: descriptionPlain
            };
        });

        return c.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1
            }
        });
    } catch (error: any) {
        console.error('Error fetching portfolios:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

// ============================================
// 포트폴리오 상세 조회
// ============================================
app.get('/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        const post = await DB.prepare(`
            SELECT p.*, u.name as student_name, c.title as course_title
            FROM student_portfolios p
            LEFT JOIN users u ON p.student_id = u.id
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE p.id = ?
        `).bind(id).first() as any;

        if (!post) {
            return c.json({ success: false, error: '포트폴리오를 찾을 수 없습니다' }, 404);
        }

        const staff = await getStaffFromHeader(c);
        const st = normalizePortfolioStatus(post.status);
        if (!staff && st !== 'published') {
            return c.json({ success: false, error: '포트폴리오를 찾을 수 없습니다' }, 404);
        }

        let thumb = post.thumbnail_url;
        if (!thumb && post.description) {
            thumb = extractFirstImage(post.description);
        }

        return c.json({
            success: true,
            data: {
                ...post,
                status: st,
                thumbnail_url: thumb,
                is_featured: Boolean(post.is_featured),
                description_plain: stripHtml(String(post.description || ''))
            }
        });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

// ============================================
// 포트폴리오 등록
// ============================================
app.post('/', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const user = c.get('user');
        const body = await c.req.json();
        const { title, description, course_id, student_id, category, content_url, thumbnail_url, is_featured, teacher_feedback, status } = body;

        if (!title) return c.json({ success: false, error: '제목은 필수입니다' }, 400);

        const st = normalizePortfolioStatus(status);

        const result = await DB.prepare(`
            INSERT INTO student_portfolios (
                student_id, course_id, title, description, thumbnail_url, 
                content_url, category, is_featured, teacher_feedback, status,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
            student_id || user.userId,
            course_id || null,
            title,
            description || null,
            thumbnail_url || null,
            content_url || null,
            category || 'other',
            is_featured ? 1 : 0,
            teacher_feedback || null,
            st
        ).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

// ============================================
// 포트폴리오 수정
// ============================================
app.put('/:id', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();
        const { title, description, course_id, student_id, category, content_url, thumbnail_url, is_featured, teacher_feedback, status } = body;

        const st = normalizePortfolioStatus(status);

        await DB.prepare(`
            UPDATE student_portfolios 
            SET title=?, description=?, course_id=?, student_id=?, category=?, 
                content_url=?, thumbnail_url=?, is_featured=?, teacher_feedback=?, 
                status=?,
                updated_at=datetime('now')
            WHERE id=?
        `).bind(
            title, description, course_id || null, student_id, category,
            content_url, thumbnail_url, is_featured ? 1 : 0, teacher_feedback,
            st,
            id
        ).run();

        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

// ============================================
// 포트폴리오 삭제
// ============================================
app.delete('/:id', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        await DB.prepare('DELETE FROM student_portfolios WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

// ============================================
// 포트폴리오 추천 토글
// ============================================
app.post('/:id/featured', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const p = await DB.prepare(`SELECT is_featured FROM student_portfolios WHERE id = ?`).bind(id).first() as any;
        if (!p) return c.json({ success: false, error: 'Not Found' }, 404);

        const newStatus = p.is_featured ? 0 : 1;
        await DB.prepare('UPDATE student_portfolios SET is_featured=? WHERE id=?').bind(newStatus, id).run();

        return c.json({ success: true, data: { is_featured: Boolean(newStatus) } });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

export default app;