import { Hono } from 'hono';
import type { Bindings, User } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { getOne, getAll, execute } from '../utils/database';
import { hashPassword } from '../utils/jwt';

const hrd = new Hono<{ Bindings: Bindings }>();

// 테이블 생성 (임시 - 인증 없이 허용)
hrd.get('/setup', async (c) => {
    try {
        const { DB } = c.env;
        await execute(DB, `
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        course_id INTEGER,
        status TEXT DEFAULT 'pending',
        memo TEXT,
        preferred_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        return successResponse(c, null, 'Consultations table created');
    } catch (error) {
        return errorResponse(c, 'Table creation failed', 500);
    }
});

// 모든 라우트에 관리자 권한 필요
hrd.use('*', authMiddleware, requireAdmin);

// ============================================
// 교직원 관리 API
// ============================================

// 교직원 목록 조회
hrd.get('/personnel', async (c) => {
    try {
        const { DB } = c.env;
        // role이 teacher인 사용자 조회
        const users = await getAll<User>(
            DB,
            "SELECT id, email, name, phone, role, created_at FROM users WHERE role = 'teacher' ORDER BY created_at DESC"
        );
        return successResponse(c, users || []);
    } catch (error) {
        console.error('Fetch personnel error:', error);
        return errorResponse(c, '교직원 목록 조회 실패', 500);
    }
});

// 교직원 등록
hrd.post('/personnel', async (c) => {
    try {
        const { DB } = c.env;
        const { email, password, name, phone } = await c.req.json();

        if (!email || !password || !name) {
            return errorResponse(c, '이메일, 비밀번호, 이름은 필수입니다', 400);
        }

        // 이메일 중복 확인
        const existing = await getOne(DB, 'SELECT id FROM users WHERE email = ?', [email]);
        if (existing) {
            return errorResponse(c, '이미 존재하는 이메일입니다', 409);
        }

        const hashedPassword = await hashPassword(password);

        const result = await execute(
            DB,
            "INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, 'teacher')",
            [email, hashedPassword, name, phone || null]
        );

        if (!result.success) {
            return errorResponse(c, '교직원 등록 실패', 500);
        }

        return createdResponse(c, { id: result.meta.last_row_id }, '교직원이 등록되었습니다');
    } catch (error) {
        console.error('Create personnel error:', error);
        return errorResponse(c, '교직원 등록 중 오류 발생', 500);
    }
});

// 교직원 수정
hrd.put('/personnel/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const { name, phone, password, email } = await c.req.json();

        const updates: string[] = [];
        const params: any[] = [];

        if (name) { updates.push('name = ?'); params.push(name); }
        if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
        if (email) { updates.push('email = ?'); params.push(email); }
        if (password) {
            const hashedPassword = await hashPassword(password);
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        if (updates.length === 0) return errorResponse(c, '수정할 내용이 없습니다', 400);

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        await execute(DB, `UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

        return successResponse(c, null, '수정되었습니다');
    } catch (error) {
        console.error('Update personnel error:', error);
        return errorResponse(c, '수정 중 오류 발생', 500);
    }
});

// 교직원 삭제
hrd.delete('/personnel/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        await execute(DB, 'DELETE FROM users WHERE id = ?', [id]);
        return successResponse(c, null, '삭제되었습니다');
    } catch (error) {
        console.error('Delete personnel error:', error);
        return errorResponse(c, '삭제 중 오류 발생', 500);
    }
});

// ============================================
// 지원자(상담) 관리 API
// ============================================

// 지원자 목록 조회
hrd.get('/applicants', async (c) => {
    try {
        const { DB } = c.env;
        // consultations 테이블 조회 (course 정보 조인)
        const query = `
      SELECT c.*, co.title as course_name 
      FROM consultations c
      LEFT JOIN courses co ON c.course_id = co.id
      ORDER BY c.created_at DESC
    `;
        const applicants = await getAll(DB, query);
        return successResponse(c, applicants || []);
    } catch (error) {
        console.error('Fetch applicants error:', error);
        return errorResponse(c, '지원자 목록 조회 실패', 500);
    }
});

// 지원자 등록
hrd.post('/applicants', async (c) => {
    try {
        const { DB } = c.env;
        const { name, phone, email, course_id, status, memo, preferred_date } = await c.req.json();

        if (!name || !phone) {
            return errorResponse(c, '이름과 전화번호는 필수입니다', 400);
        }

        const result = await execute(
            DB,
            `INSERT INTO consultations (name, phone, email, course_id, status, memo, preferred_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, phone, email || null, course_id || null, status || 'pending', memo || null, preferred_date || null]
        );

        if (!result.success) {
            return errorResponse(c, '지원자 등록 실패', 500);
        }

        return createdResponse(c, { id: result.meta.last_row_id }, '지원자가 등록되었습니다');
    } catch (error) {
        console.error('Create applicant error:', error);
        return errorResponse(c, '지원자 등록 중 오류 발생', 500);
    }
});

// 지원자 수정
hrd.put('/applicants/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const { name, phone, email, course_id, status, memo, preferred_date } = await c.req.json();

        const updates: string[] = [];
        const params: any[] = [];

        if (name) { updates.push('name = ?'); params.push(name); }
        if (phone) { updates.push('phone = ?'); params.push(phone); }
        if (email !== undefined) { updates.push('email = ?'); params.push(email); }
        if (course_id !== undefined) { updates.push('course_id = ?'); params.push(course_id); }
        if (status) { updates.push('status = ?'); params.push(status); }
        if (memo !== undefined) { updates.push('memo = ?'); params.push(memo); }
        if (preferred_date !== undefined) { updates.push('preferred_date = ?'); params.push(preferred_date); }

        if (updates.length === 0) return errorResponse(c, '수정할 내용이 없습니다', 400);

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        await execute(DB, `UPDATE consultations SET ${updates.join(', ')} WHERE id = ?`, params);

        return successResponse(c, null, '수정되었습니다');
    } catch (error) {
        console.error('Update applicant error:', error);
        return errorResponse(c, '수정 중 오류 발생', 500);
    }
});

// 지원자 삭제
hrd.delete('/applicants/:id', async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        await execute(DB, 'DELETE FROM consultations WHERE id = ?', [id]);
        return successResponse(c, null, '삭제되었습니다');
    } catch (error) {
        console.error('Delete applicant error:', error);
        return errorResponse(c, '삭제 중 오류 발생', 500);
    }
});

export default hrd;
