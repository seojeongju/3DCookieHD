import { Hono } from 'hono';
import type { Bindings, User } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { getOne, getAll, execute } from '../utils/database';
import { hashPassword } from '../utils/jwt';

const hrd = new Hono<{ Bindings: Bindings }>();

// 테이블 생성 및 마이그레이션 (임시 - 인증 없이 허용)
hrd.get('/setup', async (c) => {
    try {
        const { DB } = c.env;

        // 1. 기본 테이블 생성
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

        // 2. 컬럼 추가 (존재하지 않을 경우를 대비해 try-catch로 감싸서 실행)
        const columnsToAdd = [
            "ALTER TABLE consultations ADD COLUMN consultation_type TEXT",
            "ALTER TABLE consultations ADD COLUMN course_round TEXT",
            "ALTER TABLE consultations ADD COLUMN employment_type TEXT",
            "ALTER TABLE consultations ADD COLUMN support_type TEXT",
            "ALTER TABLE consultations ADD COLUMN tsp_type TEXT",
            "ALTER TABLE consultations ADD COLUMN payment_method TEXT",
            "ALTER TABLE consultations ADD COLUMN payment_date TEXT",
            "ALTER TABLE consultations ADD COLUMN payment_amount INTEGER",
            "ALTER TABLE consultations ADD COLUMN has_hrd_card BOOLEAN",
            "ALTER TABLE consultations ADD COLUMN is_hrd_net_registered BOOLEAN",
            "ALTER TABLE consultations ADD COLUMN is_sms_sent BOOLEAN",
            "ALTER TABLE consultations ADD COLUMN birth_date TEXT",
            "ALTER TABLE consultations ADD COLUMN gender TEXT",
            "ALTER TABLE consultations ADD COLUMN address TEXT",
            "ALTER TABLE consultations ADD COLUMN education_level TEXT",
            "ALTER TABLE consultations ADD COLUMN certificates TEXT"
        ];

        for (const sql of columnsToAdd) {
            try {
                await execute(DB, sql);
            } catch (e) {
                // 컬럼이 이미 존재하면 에러가 발생할 수 있으므로 무시
                console.log(`Column add skipped or failed: ${sql}`);
            }
        }

        // 3. 상담 로그 테이블 생성
        await execute(DB, `
      CREATE TABLE IF NOT EXISTS consultation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        writer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
      )
    `);

        return successResponse(c, null, 'Database schema updated successfully');
    } catch (error) {
        return errorResponse(c, 'Table setup failed', 500);
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
        const body = await c.req.json();

        // 필수 필드 체크
        if (!body.name || !body.phone) {
            return errorResponse(c, '이름과 전화번호는 필수입니다', 400);
        }

        const keys = [
            'name', 'phone', 'email', 'course_id', 'status', 'memo', 'preferred_date',
            'consultation_type', 'course_round', 'employment_type', 'support_type', 'tsp_type',
            'payment_method', 'payment_date', 'payment_amount', 'has_hrd_card', 'is_hrd_net_registered', 'is_sms_sent',
            'birth_date', 'gender', 'address', 'education_level', 'certificates'
        ];

        const columns = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(key => body[key] !== undefined ? body[key] : null);

        const result = await execute(
            DB,
            `INSERT INTO consultations (${columns}) VALUES (${placeholders})`,
            values
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
        const body = await c.req.json();

        const keys = [
            'name', 'phone', 'email', 'course_id', 'status', 'memo', 'preferred_date',
            'consultation_type', 'course_round', 'employment_type', 'support_type', 'tsp_type',
            'payment_method', 'payment_date', 'payment_amount', 'has_hrd_card', 'is_hrd_net_registered', 'is_sms_sent',
            'birth_date', 'gender', 'address', 'education_level', 'certificates'
        ];

        const updates: string[] = [];
        const params: any[] = [];

        keys.forEach(key => {
            if (body[key] !== undefined) {
                updates.push(`${key} = ?`);
                params.push(body[key]);
            }
        });

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

// ============================================
// 상담 다이어리 (Consultation Logs) API
// ============================================

// 상담 로그 조회
hrd.get('/applicants/:id/logs', async (c) => {
    try {
        const { DB } = c.env;
        const consultationId = c.req.param('id');
        const logs = await getAll(
            DB,
            "SELECT * FROM consultation_logs WHERE consultation_id = ? ORDER BY created_at DESC",
            [consultationId]
        );
        return successResponse(c, logs || []);
    } catch (error) {
        console.error('Fetch logs error:', error);
        return errorResponse(c, '상담 로그 조회 실패', 500);
    }
});

// 상담 로그 추가
hrd.post('/applicants/:id/logs', async (c) => {
    try {
        const { DB } = c.env;
        const consultationId = c.req.param('id');
        const { content, writer } = await c.req.json();

        if (!content) return errorResponse(c, '내용을 입력해주세요', 400);

        const result = await execute(
            DB,
            "INSERT INTO consultation_logs (consultation_id, content, writer) VALUES (?, ?, ?)",
            [consultationId, content, writer || '관리자']
        );

        if (!result.success) return errorResponse(c, '로그 저장 실패', 500);

        return createdResponse(c, { id: result.meta.last_row_id }, '상담 내용이 저장되었습니다');
    } catch (error) {
        console.error('Create log error:', error);
        return errorResponse(c, '로그 저장 중 오류 발생', 500);
    }
});

// 상담 로그 삭제
hrd.delete('/applicants/logs/:logId', async (c) => {
    try {
        const { DB } = c.env;
        const logId = c.req.param('logId');
        await execute(DB, "DELETE FROM consultation_logs WHERE id = ?", [logId]);
        return successResponse(c, null, '삭제되었습니다');
    } catch (error) {
        console.error('Delete log error:', error);
        return errorResponse(c, '로그 삭제 중 오류 발생', 500);
    }
});

export default hrd;
