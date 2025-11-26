import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 구직자 목록 조회 (관리자 전용)
// GET /api/jobseekers
// ============================================
app.get('/', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;

        // 쿼리 파라미터
        const status = c.req.query('status');
        const search = c.req.query('search');
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

        if (search) {
            whereClause += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // 전체 개수 조회
        const countQuery = `SELECT COUNT(*) as total FROM jobseekers ${whereClause}`;
        const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>();
        const total = countResult?.total || 0;

        // 목록 조회
        const query = `
      SELECT * FROM jobseekers
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
        console.error('Error fetching jobseekers:', error);
        return c.json({ success: false, error: '구직자 목록 조회 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 구직자 상세 조회 (관리자 전용)
// GET /api/jobseekers/:id
// ============================================
app.get('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        const jobseeker = await DB.prepare('SELECT * FROM jobseekers WHERE id = ?').bind(id).first();

        if (!jobseeker) {
            return c.json({ success: false, error: '구직자 정보를 찾을 수 없습니다' }, 404);
        }

        return c.json({
            success: true,
            data: jobseeker
        });
    } catch (error) {
        console.error('Error fetching jobseeker:', error);
        return c.json({ success: false, error: '구직자 정보 조회 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 구직자 등록 (관리자 전용)
// POST /api/jobseekers
// ============================================
app.post('/', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const body = await c.req.json();

        const {
            name, birth_date, phone, email, address,
            education, career, skills, resume_file, portfolio_file,
            status, memo
        } = body;

        if (!name || !phone) {
            return c.json({ success: false, error: '이름과 연락처는 필수입니다' }, 400);
        }

        const result = await DB.prepare(`
      INSERT INTO jobseekers (
        name, birth_date, phone, email, address,
        education, career, skills, resume_file, portfolio_file,
        status, memo, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            name,
            birth_date || null,
            phone,
            email || null,
            address || null,
            education || null,
            career || null,
            skills || null,
            resume_file || null,
            portfolio_file || null,
            status || 'active',
            memo || null
        ).run();

        return c.json({
            success: true,
            data: {
                id: result.meta.last_row_id,
                message: '구직자가 등록되었습니다'
            }
        }, 201);
    } catch (error) {
        console.error('Error creating jobseeker:', error);
        return c.json({ success: false, error: '구직자 등록 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 구직자 정보 수정 (관리자 전용)
// PUT /api/jobseekers/:id
// ============================================
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();

        const jobseeker = await DB.prepare('SELECT * FROM jobseekers WHERE id = ?').bind(id).first();
        if (!jobseeker) {
            return c.json({ success: false, error: '구직자 정보를 찾을 수 없습니다' }, 404);
        }

        const {
            name, birth_date, phone, email, address,
            education, career, skills, resume_file, portfolio_file,
            status, memo
        } = body;

        await DB.prepare(`
      UPDATE jobseekers 
      SET name = ?, birth_date = ?, phone = ?, email = ?, address = ?,
          education = ?, career = ?, skills = ?, resume_file = ?, portfolio_file = ?,
          status = ?, memo = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
            name ?? jobseeker.name,
            birth_date ?? jobseeker.birth_date,
            phone ?? jobseeker.phone,
            email ?? jobseeker.email,
            address ?? jobseeker.address,
            education ?? jobseeker.education,
            career ?? jobseeker.career,
            skills ?? jobseeker.skills,
            resume_file ?? jobseeker.resume_file,
            portfolio_file ?? jobseeker.portfolio_file,
            status ?? jobseeker.status,
            memo ?? jobseeker.memo,
            id
        ).run();

        return c.json({
            success: true,
            message: '구직자 정보가 수정되었습니다'
        });
    } catch (error) {
        console.error('Error updating jobseeker:', error);
        return c.json({ success: false, error: '구직자 정보 수정 중 오류가 발생했습니다' }, 500);
    }
});

// ============================================
// 구직자 삭제 (관리자 전용)
// DELETE /api/jobseekers/:id
// ============================================
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');

        await DB.prepare('DELETE FROM jobseekers WHERE id = ?').bind(id).run();

        return c.json({
            success: true,
            message: '구직자 정보가 삭제되었습니다'
        });
    } catch (error) {
        console.error('Error deleting jobseeker:', error);
        return c.json({ success: false, error: '구직자 삭제 중 오류가 발생했습니다' }, 500);
    }
});

export default app;
