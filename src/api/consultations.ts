import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

// 상담 신청 생성
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { name, phone, campus_name, category, message, privacy_agree } = body;

        // 유효성 검사
        if (!name || !phone || !privacy_agree) {
            return c.json({ success: false, error: '필수 항목을 입력해주세요.' }, 400);
        }

        const fullMessage = `[지점: ${campus_name || '미지정'}]\n[희망분야: ${category || '미지정'}]\n\n${message || ''}`;

        const { results } = await c.env.DB.prepare(
            `INSERT INTO consultations (name, phone, message, status) VALUES (?, ?, ?, 'pending') RETURNING id`
        ).bind(name, phone, fullMessage).run();

        return c.json({ success: true, data: { id: results[0].id } });
    } catch (e) {
        console.error('Failed to create consultation:', e);
        return c.json({ success: false, error: '상담 신청 중 오류가 발생했습니다.' }, 500);
    }
});

// 관리자: 상담 목록 조회
app.get('/', async (c) => {
    try {
        const { DB } = c.env;
        const query = c.req.query();
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const offset = (page - 1) * limit;
        const status = query.status;
        const search = query.search;

        let sql = `SELECT * FROM consultations WHERE 1=1`;
        const params: any[] = [];

        if (status && status !== 'all') {
            sql += ` AND status = ?`;
            params.push(status);
        }

        if (search) {
            sql += ` AND (name LIKE ? OR phone LIKE ? OR message LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const { results } = await DB.prepare(sql).bind(...params).all();

        // 전체 개수 조회
        let countSql = `SELECT count(*) as total FROM consultations WHERE 1=1`;
        const countParams: any[] = [];

        if (status && status !== 'all') {
            countSql += ` AND status = ?`;
            countParams.push(status);
        }

        if (search) {
            countSql += ` AND (name LIKE ? OR phone LIKE ? OR message LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const countResult = await DB.prepare(countSql).bind(...countParams).first<{ total: number }>();

        return c.json({
            success: true,
            data: results,
            pagination: {
                page,
                limit,
                total: countResult?.total || 0,
                totalPages: Math.ceil((countResult?.total || 0) / limit)
            }
        });
    } catch (e) {
        console.error('Failed to fetch consultations:', e);
        return c.json({ success: false, error: '목록 조회 실패' }, 500);
    }
});

// 관리자: 상담 상세 조회
app.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const item = await c.env.DB.prepare('SELECT * FROM consultations WHERE id = ?').bind(id).first();

        if (!item) {
            return c.json({ success: false, error: 'Not found' }, 404);
        }
        return c.json({ success: true, data: item });
    } catch (e) {
        return c.json({ success: false, error: '조회 실패' }, 500);
    }
});

// 관리자: 상담 상태/메모 수정 (답변)
app.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { status, memo } = body;

        await c.env.DB.prepare(
            `UPDATE consultations SET status = ?, memo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        ).bind(status || 'pending', memo, id).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update consultation:', e);
        return c.json({ success: false, error: '수정 실패' }, 500);
    }
});

export default app;
