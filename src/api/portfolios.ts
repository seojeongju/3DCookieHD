import { Hono } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';
import { importRemoteImageFromUrl, isBlockedRemoteHost } from './upload';

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

function extractVideos(content: string): string[] {
    const videos: string[] = [];
    if (!content) return videos;
    const iframes = content.matchAll(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const match of iframes) {
        if (match[1].includes('youtube') || match[1].includes('youtu.be') || match[1].includes('vimeo')) {
            videos.push(match[1]);
        }
    }
    const htmlVideos = content.matchAll(/<video[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const match of htmlVideos) {
        videos.push(match[1]);
    }
    return videos;
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

function normalizeExternalImageUrlCandidate(raw: string): string | null {
    let s = String(raw).trim();
    if (!s || s.startsWith('data:')) return null;
    if (s.startsWith('/api/upload/files/')) return null;
    if (s.startsWith('//')) s = 'https:' + s;
    try {
        const u = new URL(s);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        if (u.pathname.includes('/api/upload/files/')) return null;
        if (isBlockedRemoteHost(u.hostname)) return null;
        return u.toString();
    } catch {
        return null;
    }
}

/** 본문 HTML(img src) + 썸네일에 있는 http(s) 외부 이미지 URL 수집(이미 R2 경로는 제외) */
function collectPortfolioExternalImageUrls(description: string | null, thumbnailUrl: string | null): string[] {
    const set = new Set<string>();
    const add = (raw: string) => {
        const n = normalizeExternalImageUrlCandidate(raw);
        if (n) set.add(n);
    };
    if (thumbnailUrl) add(thumbnailUrl);
    const html = String(description || '');
    const imgQuoted = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = imgQuoted.exec(html)) !== null) add(m[1]);
    const imgBare = /<img[^>]+src=([^\s>]+)/gi;
    while ((m = imgBare.exec(html)) !== null) {
        let v = m[1].replace(/^["']|["']$/g, '');
        add(v);
    }
    return [...set];
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
            const videos = extractVideos(p.description || '');
            return {
                ...p,
                status: st,
                thumbnail_url: thumb,
                is_featured: Boolean(p.is_featured),
                description_plain: descriptionPlain,
                videos
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

/**
 * GET /api/portfolios/admin/migrate-external-images/status
 * 본문·썸네일에 아직 http(s) 문자열이 남아 있을 수 있는 건수(빠른 참고용).
 */
app.get('/admin/migrate-external-images/status', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const row = await DB.prepare(
            `
      SELECT COUNT(*) as n FROM student_portfolios
      WHERE IFNULL(description,'') LIKE '%http://%'
         OR IFNULL(description,'') LIKE '%https://%'
         OR IFNULL(thumbnail_url,'') LIKE 'http%'
    `,
        ).first<{ n: number }>();
        return c.json({
            success: true,
            data: {
                rows_with_http_in_db_columns: row?.n ?? 0,
                note: '본문에 외부 링크(비이미지)가 있으면 숫자에 포함될 수 있습니다. 최종 확인은 「미리보기」로 대상 합을 보세요.',
            },
        });
    } catch (e: unknown) {
        console.error('migrate-external-images/status:', e);
        return c.json({ success: false, error: '조회 실패' }, 500);
    }
});

/**
 * POST /api/portfolios/admin/migrate-external-images
 * 외부 http(s) 이미지 URL을 다운로드해 R2에 저장하고, description·thumbnail_url을 /api/upload/files/ 경로로 치환합니다.
 * body: { dry_run?: boolean, limit?: number (1~40, 기본 8), offset?: number }
 */
app.post('/admin/migrate-external-images', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB, R2 } = c.env;
        if (!R2) {
            return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
        }

        const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
        const dryRun = Boolean(body?.dry_run);
        const limit = Math.min(40, Math.max(1, Number(body?.limit) || 8));
        const offset = Math.max(0, Number(body?.offset) || 0);

        const user = c.get('user');
        const origin = new URL(c.req.url).origin;

        const totalRow = await DB.prepare(`SELECT COUNT(*) as total FROM student_portfolios`).first<{ total: number }>();
        const totalRows = totalRow?.total ?? 0;

        const { results: rows } = await DB.prepare(`SELECT * FROM student_portfolios ORDER BY id LIMIT ? OFFSET ?`)
            .bind(limit, offset)
            .all();

        const list = Array.isArray(rows) ? rows : [];
        const reports: Array<Record<string, unknown>> = [];
        let updated = 0;
        let wouldUpdate = 0;
        let skipped = 0;
        let errors = 0;

        for (const row of list) {
            const p = row as Record<string, unknown>;
            const id = p.id as number;
            try {
                const desc = p.description != null ? String(p.description) : '';
                const thumb = p.thumbnail_url != null ? String(p.thumbnail_url) : '';
                const urls = collectPortfolioExternalImageUrls(desc || null, thumb || null);
                if (urls.length === 0) {
                    skipped++;
                    reports.push({ id, status: 'skipped', reason: 'no_external_image_urls' });
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
                        folder: 'portfolios',
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
                    reports.push({ id, status: 'error', error: failReason, urls_found: urls.length });
                    continue;
                }

                if (dryRun) {
                    wouldUpdate++;
                    reports.push({ id, status: 'would_migrate', url_count: urls.length });
                    continue;
                }

                const newDesc = replaceUrlsInString(desc, urlMap);
                let thumbOut: string | null = null;
                if (p.thumbnail_url != null && String(p.thumbnail_url).trim() !== '') {
                    thumbOut = replaceUrlsInString(String(p.thumbnail_url), urlMap).trim() || null;
                }

                await DB.prepare(
                    `UPDATE student_portfolios SET description = ?, thumbnail_url = ?, updated_at = datetime('now') WHERE id = ?`,
                )
                    .bind(newDesc, thumbOut, id)
                    .run();

                updated++;
                reports.push({ id, status: 'migrated', urls_replaced: urls.length });
            } catch (e: unknown) {
                errors++;
                const msg = e instanceof Error ? e.message : String(e);
                reports.push({ id: (row as { id?: number }).id, status: 'error', error: msg });
            }
        }

        const rowCount = list.length;
        const nextOffset = offset + rowCount;
        const hasMore = nextOffset < totalRows;

        return c.json({
            success: true,
            data: {
                dry_run: dryRun,
                batch: {
                    limit,
                    offset,
                    next_offset: nextOffset,
                    has_more: hasMore,
                    total_portfolios: totalRows,
                },
                summary: {
                    processed: rowCount,
                    skipped_no_external: skipped,
                    updated: dryRun ? 0 : updated,
                    would_update: dryRun ? wouldUpdate : 0,
                    errors,
                },
                portfolios: reports,
            },
        });
    } catch (e: unknown) {
        console.error('migrate-external-images:', e);
        return c.json({ success: false, error: '마이그레이션 처리 중 오류가 발생했습니다' }, 500);
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
        
        const videos = extractVideos(post.description || '');

        return c.json({
            success: true,
            data: {
                ...post,
                status: st,
                thumbnail_url: thumb,
                is_featured: Boolean(post.is_featured),
                description_plain: stripHtml(String(post.description || '')),
                videos
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
        const { title, description, course_id, student_id, category, content_url, thumbnail_url, is_featured, teacher_feedback, status, created_at } = body;

        if (!title) return c.json({ success: false, error: '제목은 필수입니다' }, 400);

        const st = normalizePortfolioStatus(status);

        const result = await DB.prepare(`
            INSERT INTO student_portfolios (
                student_id, course_id, title, description, thumbnail_url, 
                content_url, category, is_featured, teacher_feedback, status,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(datetime(?), datetime('now')), datetime('now'))
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
            st,
            created_at || null
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
        const { title, description, course_id, student_id, category, content_url, thumbnail_url, is_featured, teacher_feedback, status, created_at } = body;

        const st = normalizePortfolioStatus(status);

        await DB.prepare(`
            UPDATE student_portfolios 
            SET title=?, description=?, course_id=?, student_id=?, category=?, 
                content_url=?, thumbnail_url=?, is_featured=?, teacher_feedback=?, 
                status=?,
                created_at=COALESCE(datetime(?), created_at),
                updated_at=datetime('now')
            WHERE id=?
        `).bind(
            title, description, course_id || null, student_id, category,
            content_url, thumbnail_url, is_featured ? 1 : 0, teacher_feedback,
            st,
            created_at || null,
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