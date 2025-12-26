import { Hono } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { hashPassword } from '../utils/jwt';

type Variables = {
    user: JWTPayload;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 모든 엔드포인트에 인증 및 관리자 권한 미들웨어 적용
app.use('*', authMiddleware);
app.use('*', requireAdmin);

// 사용자 목록 조회 (관리자 전용)
app.get('/', async (c) => {
    const db = c.env.DB;
    const { search, role, status } = c.req.query();

    try {
        let query = `
            SELECT 
                id, name, email, phone, birthdate, 
                role, status, profile_image, created_at
            FROM users
            WHERE 1=1
        `;
        const params: any[] = [];

        if (search) {
            query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (role) {
            query += ` AND role = ?`;
            params.push(role);
        }

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await db.prepare(query).bind(...params).all();

        return c.json({
            success: true,
            data: result.results || []
        });
    } catch (error) {
        console.error('사용자 목록 조회 실패:', error);
        return c.json({ success: false, error: 'Failed to fetch users' }, 500);
    }
});

// 사용자 생성/등록 (관리자 전용)
app.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { name, email, phone, birthdate, role, status, password } = body;

    if (!name || !email || !role) {
        return c.json({ success: false, error: 'Name, email, and role are required' }, 400);
    }

    try {
        // 이메일 중복 확인
        const existing = await db
            .prepare('SELECT id FROM users WHERE email = ?')
            .bind(email)
            .first();

        if (existing) {
            return c.json({ success: false, error: 'Email already exists' }, 409);
        }

        // 비밀번호 해싱 (기본 비밀번호: changeme123)
        const hashedPassword = await hashPassword(password || 'changeme123');

        const result = await db
            .prepare(`
                INSERT INTO users (name, email, phone, birthdate, role, status, password, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `)
            .bind(
                name,
                email,
                phone || null,
                birthdate || null,
                role,
                status || 'active',
                hashedPassword
            )
            .run();

        return c.json({
            success: true,
            data: { id: result.meta.last_row_id }
        });
    } catch (error) {
        console.error('사용자 생성 실패:', error);
        return c.json({ success: false, error: 'Failed to create user' }, 500);
    }
});

// 사용자 정보 수정 (관리자 전용)
app.put('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { id, name, email, phone, birthdate, role, status, password } = body;

    if (!id) {
        return c.json({ success: false, error: 'User ID is required' }, 400);
    }

    try {
        let query = `
            UPDATE users 
            SET name = ?, email = ?, phone = ?, birthdate = ?, role = ?, status = ?
        `;
        const params: any[] = [name, email, phone || null, birthdate || null, role, status || 'active'];

        // 비밀번호가 제공된 경우에만 업데이트
        if (password) {
            query += `, password = ?`;
            params.push(await hashPassword(password));
        }

        query += ` WHERE id = ?`;
        params.push(id);

        await db.prepare(query).bind(...params).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('사용자 정보 수정 실패:', error);
        return c.json({ success: false, error: 'Failed to update user' }, 500);
    }
});

// 사용자 삭제 (관리자 전용)
app.delete('/:id', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const userId = parseInt(c.req.param('id'));

    if (!userId) {
        return c.json({ success: false, error: 'Invalid user ID' }, 400);
    }

    try {
        // 자기 자신은 삭제할 수 없도록 보호
        if (user.userId === userId) {
            return c.json({ success: false, error: 'Cannot delete your own account' }, 400);
        }

        await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('사용자 삭제 실패:', error);
        return c.json({ success: false, error: 'Failed to delete user' }, 500);
    }
});

export default app;
