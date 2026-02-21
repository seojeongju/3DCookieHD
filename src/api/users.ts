import { Hono } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { hashPassword } from '../utils/jwt';

type Variables = {
    user: JWTPayload;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 사용자 목록 조회 (관리자 전용)
// 미들웨어 순서: 인증 -> 관리자 체크
app.get('/', authMiddleware, requireAdmin, async (c) => {
    const db = c.env.DB;
    const { search, role, status } = c.req.query();

    // 이 시점에서 authMiddleware가 성공했다면 user는 반드시 존재해야 함
    const user = c.get('user');
    if (!user) {
        console.error('[Users API] User context missing after authMiddleware');
        return c.json({ success: false, error: 'Authentication context lost' }, 401);
    }

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
        console.error('[Users API] Load failed:', error);
        return c.json({ success: false, error: 'Failed to fetch users' }, 500);
    }
});

// 사용자 생성/등록 (관리자 전용)
app.post('/', authMiddleware, requireAdmin, async (c) => {
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

        // 비밀번호 생성 규칙: 전달된 비번이 없으면 전화번호 뒷자리 4자리, 그외 기본값
        let initialPassword = password;
        if (!initialPassword) {
            if (phone && phone.length >= 4) {
                // 숫자만 추출 후 마지막 4자리
                const digits = phone.replace(/[^0-9]/g, '');
                initialPassword = digits.slice(-4);
            }
            if (!initialPassword) initialPassword = 'changeme123';
        }

        // 비밀번호 해싱
        const hashedPassword = await hashPassword(initialPassword);

        const result = await db
            .prepare(`
                INSERT INTO users (name, email, phone, birthdate, role, status, password, is_initial_login, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
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
        console.error('[Users API] Create failed:', error);
        return c.json({ success: false, error: 'Failed to create user' }, 500);
    }
});

// 사용자 정보 수정 (관리자 전용)
app.put('/', authMiddleware, requireAdmin, async (c) => {
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
        console.error('[Users API] Update failed:', error);
        return c.json({ success: false, error: 'Failed to update user' }, 500);
    }
});

// 사용자별 삭제를 막는 배정 목록 조회 (관리자 전용)
app.get('/:id/assignments', authMiddleware, requireAdmin, async (c) => {
    const db = c.env.DB;
    const userId = parseInt(c.req.param('id'));
    if (!userId) {
        return c.json({ success: false, error: 'Invalid user ID' }, 400);
    }
    try {
        const [courses, trainingLogs, assignments] = await Promise.all([
            db.prepare(`
                SELECT id, title FROM courses WHERE teacher_id = ? ORDER BY title
            `).bind(userId).all(),
            db.prepare(`
                SELECT t.id, t.date, t.topic, c.title as course_title
                FROM training_logs t
                LEFT JOIN courses c ON t.course_id = c.id
                WHERE t.instructor_id = ?
                ORDER BY t.date DESC
            `).bind(userId).all(),
            db.prepare(`
                SELECT a.id, a.title, c.title as course_title
                FROM assignments a
                LEFT JOIN courses c ON a.course_id = c.id
                WHERE a.teacher_id = ?
                ORDER BY a.due_date DESC
            `).bind(userId).all()
        ]);
        return c.json({
            success: true,
            data: {
                courses: courses.results || [],
                training_logs: trainingLogs.results || [],
                assignments: assignments.results || []
            }
        });
    } catch (error) {
        console.error('[Users API] Assignments fetch failed:', error);
        return c.json({ success: false, error: 'Failed to fetch assignments' }, 500);
    }
});

// 사용자 삭제 (관리자 전용)
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const userId = parseInt(c.req.param('id'));

    if (!userId) {
        return c.json({ success: false, error: 'Invalid user ID' }, 400);
    }

    try {
        // 자기 자신은 삭제할 수 없도록 보호
        if (user && user.userId === userId) {
            return c.json({ success: false, error: 'Cannot delete your own account' }, 400);
        }

        // 삭제를 막는 배정 수집 (목록 포함해 400 응답에 반환)
        const courses = await db.prepare('SELECT id, title FROM courses WHERE teacher_id = ?').bind(userId).all();
        const trainingLogs = await db.prepare(`
            SELECT t.id, t.date, t.topic, c.title as course_title
            FROM training_logs t LEFT JOIN courses c ON t.course_id = c.id
            WHERE t.instructor_id = ?
        `).bind(userId).all();
        const assignments = await db.prepare(`
            SELECT a.id, a.title, c.title as course_title
            FROM assignments a LEFT JOIN courses c ON a.course_id = c.id
            WHERE a.teacher_id = ?
        `).bind(userId).all();

        const courseList = courses.results || [];
        const logList = trainingLogs.results || [];
        const assignList = assignments.results || [];

        if (logList.length > 0) {
            return c.json({
                success: false,
                error: '이 사용자는 훈련일지에 강사로 등록되어 있어 삭제할 수 없습니다. 아래 목록에서 배정을 해제한 후 삭제해 주세요.',
                assignments: { courses: courseList, training_logs: logList, assignments: assignList }
            }, 400);
        }
        if (assignList.length > 0) {
            return c.json({
                success: false,
                error: '이 사용자는 과제에 강사로 배정되어 있어 삭제할 수 없습니다. 아래 목록에서 배정을 해제한 후 삭제해 주세요.',
                assignments: { courses: courseList, training_logs: logList, assignments: assignList }
            }, 400);
        }
        if (courseList.length > 0) {
            return c.json({
                success: false,
                error: '이 사용자는 과정에 강사로 배정되어 있어 삭제할 수 없습니다. 아래 목록에서 배정을 해제한 후 삭제해 주세요.',
                assignments: { courses: courseList, training_logs: logList, assignments: assignList }
            }, 400);
        }

        await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('[Users API] Delete failed:', error);
        const msg = error instanceof Error ? error.message : String(error);
        if (/foreign key|constraint|FOREIGN KEY/i.test(msg)) {
            try {
                const courses = await db.prepare('SELECT id, title FROM courses WHERE teacher_id = ?').bind(userId).all();
                const trainingLogs = await db.prepare(`
                    SELECT t.id, t.date, t.topic, c.title as course_title
                    FROM training_logs t LEFT JOIN courses c ON t.course_id = c.id WHERE t.instructor_id = ?
                `).bind(userId).all();
                const assignments = await db.prepare(`
                    SELECT a.id, a.title, c.title as course_title
                    FROM assignments a LEFT JOIN courses c ON a.course_id = c.id WHERE a.teacher_id = ?
                `).bind(userId).all();
                return c.json({
                    success: false,
                    error: '이 사용자는 과정·훈련일지·과제 등에 연결되어 있어 삭제할 수 없습니다. 관련 배정을 해제한 후 삭제해 주세요.',
                    assignments: {
                        courses: courses.results || [],
                        training_logs: trainingLogs.results || [],
                        assignments: assignments.results || []
                    }
                }, 400);
            } catch (_) {
                return c.json({ success: false, error: '이 사용자는 과정·훈련일지·과제·교직원 등에 연결되어 있어 삭제할 수 없습니다. 관련 배정을 해제한 후 삭제해 주세요.' }, 400);
            }
        }
        return c.json({ success: false, error: 'Failed to delete user' }, 500);
    }
});

export default app;
