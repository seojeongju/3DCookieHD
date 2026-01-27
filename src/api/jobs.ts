import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 채용공고 목록 조회
// GET /api/jobs
// ============================================
app.get('/', async (c) => {
    try {
        const { DB } = c.env;

        // 쿼리 파라미터
        const status = c.req.query('status');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '12');
        const offset = (page - 1) * limit;

        // WHERE 조건 구성
        let whereClause = 'WHERE 1=1';
        const params: any[] = [];

        if (status) {
            whereClause += ' AND status = ?';
            params.push(status);
        }

        // 전체 개수 조회
        const countQuery = `SELECT COUNT(*) as total FROM jobs ${whereClause}`;
        const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
        const total = countResult?.total || 0;

        // 목록 조회
        const query = `
      SELECT * FROM jobs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

        const result = await DB.prepare(query).bind(...params, limit, offset).all();

        return c.json({
            success: true,
            data: result.results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return c.json({ success: false, error: '채용공고 목록 조회 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 채용공고 상세 조회
// GET /api/jobs/:id
// ============================================
app.get('/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        const job = await DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();

        if (!job) {
            return c.json({ success: false, error: '채용공고를 찾을 수 없습니다' }, 404);
        }

        return c.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        return c.json({ success: false, error: '채용공고 조회 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 채용공고 생성 (관리자 전용)
// POST /api/jobs
// ============================================
app.post('/', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const body = await c.req.json();

        const { title, company, job_type, location, salary, requirements, description, status } = body;

        if (!title) {
            return c.json({ success: false, error: '제목은 필수입니다' }, 400);
        }

        const result = await DB.prepare(`
      INSERT INTO jobs (
        title, company, job_type, location, salary, 
        requirements, description, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            title,
            company || '와우쓰리디홍대센터',
            job_type,
            location,
            salary,
            requirements,
            description,
            status || 'active'
        ).run();

        return c.json({
            success: true,
            data: {
                id: result.meta.last_row_id,
                message: '채용공고가 등록되었습니다'
            }
        }, 201);
    } catch (error) {
        console.error('Error creating job:', error);
        return c.json({ success: false, error: '채용공고 등록 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 채용공고 수정 (관리자 전용)
// PUT /api/jobs/:id
// ============================================
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();

        const job = await DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();
        if (!job) {
            return c.json({ success: false, error: '채용공고를 찾을 수 없습니다' }, 404);
        }

        const { title, company, job_type, location, salary, requirements, description, status } = body;

        await DB.prepare(`
      UPDATE jobs 
      SET title = ?, company = ?, job_type = ?, location = ?, salary = ?,
          requirements = ?, description = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
            title ?? job.title,
            company ?? job.company,
            job_type ?? job.job_type,
            location ?? job.location,
            salary ?? job.salary,
            requirements ?? job.requirements,
            description ?? job.description,
            status ?? job.status,
            id
        ).run();

        return c.json({
            success: true,
            message: '채용공고가 수정되었습니다'
        });
    } catch (error) {
        console.error('Error updating job:', error);
        return c.json({ success: false, error: '채용공고 수정 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 채용공고 삭제 (관리자 전용)
// DELETE /api/jobs/:id
// ============================================
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        await DB.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run();

        return c.json({
            success: true,
            message: '채용공고가 삭제되었습니다'
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        return c.json({ success: false, error: '채용공고 삭제 중 오류가 발생했습니다' }, 500);
    }
});

export default app;
