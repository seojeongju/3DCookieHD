import { Hono } from 'hono';
import type { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function makeExcerpt(text: string, maxLen: number): string {
  const plain = stripHtml(text || '');
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen) + '…';
}

function extractFirstImage(content: string): string {
  if (!content) return '';
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imgRegex);
  return match ? match[1] : '';
}

function parsePostImages(raw: unknown): string[] {
  if (raw == null || raw === '') return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed.map((x) => String(x)) : [];
  } catch {
    return [];
  }
}

async function studentPortfoliosHasStatusColumn(DB: D1Database): Promise<boolean> {
  try {
    const { results } = await DB.prepare('PRAGMA table_info(student_portfolios)').all();
    const rows = (results || []) as Array<{ name: string }>;
    return rows.some((r) => r.name === 'status');
  } catch {
    return false;
  }
}

app.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const hasPortfolioStatus = await studentPortfoliosHasStatusColumn(DB);

    const [coursesRows, educationRows, prototypeRows, reviewRows, portfolioRows] = await Promise.all([
      DB.prepare(`
        SELECT
          s.id,
          a.name as course_name,
          cat.name as category_name,
          s.status,
          s.training_start_date,
          s.training_end_date,
          s.instructor_name,
          COALESCE(NULLIF(TRIM(s.course_list_image_url), ''), NULLIF(TRIM(s.main_slide_image_url), ''), '/static/course_placeholder.svg') as image_url,
          s.session_number,
          s.session_name
        FROM course_sessions s
        INNER JOIN approved_courses a ON a.id = s.approved_course_id
        LEFT JOIN course_categories cat ON cat.id = a.category_id
        WHERE (s.homepage_exposed = 1 OR s.homepage_exposed IS NULL)
          AND s.status IN ('recruiting', 'always_open', 'in_progress')
        ORDER BY s.training_start_date DESC, s.id DESC
        LIMIT 8
      `).all(),
      DB.prepare(`
        SELECT id, title, content, images, thumbnail_url, author_name, created_at
        FROM posts
        WHERE category = 'education_photo' AND status = 'published'
        ORDER BY created_at DESC
        LIMIT 24
      `).all(),
      DB.prepare(`
        SELECT id, title, content, images, thumbnail_url, author_name, created_at
        FROM posts
        WHERE category = 'prototype' AND status = 'published'
        ORDER BY created_at DESC
        LIMIT 12
      `).all(),
      DB.prepare(`
        SELECT id, title, content, author_name, rating, created_at
        FROM posts
        WHERE category = 'review' AND status = 'published'
        ORDER BY created_at DESC
        LIMIT 12
      `).all(),
      DB.prepare(`
        SELECT p.id, p.title, p.description, p.thumbnail_url, p.student_name, p.content_url, p.created_at
        FROM student_portfolios p
        ${hasPortfolioStatus ? "WHERE (p.status IS NULL OR p.status = 'published')" : ''}
        ORDER BY p.created_at DESC
        LIMIT 12
      `).all(),
    ]);

    const educationPhotos = (educationRows.results || []).map((p: any) => {
      const images = parsePostImages(p.images);
      const fallback = p.thumbnail_url || extractFirstImage(String(p.content || ''));
      const firstImage = images.length ? images[0] : fallback;
      return {
        id: p.id,
        title: p.title,
        author_name: p.author_name,
        created_at: p.created_at,
        image_url: firstImage || '',
        excerpt: makeExcerpt(String(p.content || ''), 80),
      };
    });

    const prototypes = (prototypeRows.results || []).map((p: any) => {
      const images = parsePostImages(p.images);
      const fallback = p.thumbnail_url || extractFirstImage(String(p.content || ''));
      const firstImage = images.length ? images[0] : fallback;
      return {
        id: p.id,
        title: p.title,
        author_name: p.author_name,
        created_at: p.created_at,
        image_url: firstImage || '',
        excerpt: makeExcerpt(String(p.content || ''), 80),
      };
    });

    const portfolios = (portfolioRows.results || []).map((p: any) => ({
      ...p,
      thumbnail_url: p.thumbnail_url || extractFirstImage(String(p.description || '')),
      description_plain: stripHtml(String(p.description || '')),
    }));

    const reviews = (reviewRows.results || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      author_name: r.author_name,
      rating: r.rating,
      created_at: r.created_at,
      excerpt: makeExcerpt(String(r.content || ''), 92),
    }));

    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1200');
    return c.json({
      success: true,
      data: {
        courses: coursesRows.results || [],
        educationPhotos,
        portfolios,
        prototypes,
        reviews,
      },
    });
  } catch (e) {
    console.error('home api error:', e);
    return c.json({ success: false, error: '홈 데이터 조회 실패' }, 500);
  }
});

export default app;

