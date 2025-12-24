import { Hono } from 'hono';
import { Bindings } from '../types';
import { execute, getOne } from '../utils/database';
import { hashPassword } from '../utils/jwt';

const setup = new Hono<{ Bindings: Bindings }>();

setup.get('/admin', async (c) => {
    try {
        const email = 'admin@example.com';
        const password = 'admin123';
        const hashedPassword = await hashPassword(password);

        // 기존 계정 확인
        const existing = await getOne(c.env.DB, 'SELECT * FROM users WHERE email = ?', [email]);

        if (existing) {
            // 비밀번호 업데이트
            await execute(c.env.DB, 'UPDATE users SET password = ?, role = ? WHERE email = ?', [hashedPassword, 'admin', email]);
            return c.json({ success: true, message: 'Admin updated' });
        } else {
            // 계정 생성
            await execute(c.env.DB, 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hashedPassword, '관리자', 'admin']);
            return c.json({ success: true, message: 'Admin created' });
        }
    } catch (e: any) {
        return c.json({ success: false, error: e.message });
    }
});

setup.get('/hrd-counseling-init', async (c) => {
    try {
        await execute(c.env.DB, `
            CREATE TABLE IF NOT EXISTS hrd_counseling_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                counselor_id INTEGER NOT NULL,
                course_id INTEGER,
                counseling_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                category TEXT,
                method TEXT,
                content TEXT,
                result TEXT,
                next_counseling_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
            )
        `);

        // Add sample data if empty
        const count: any = await c.env.DB.prepare('SELECT COUNT(*) as c FROM hrd_counseling_logs').first();
        if (count.c === 0) {
            await execute(c.env.DB, `
                INSERT INTO hrd_counseling_logs (student_id, counselor_id, category, method, content, result)
                VALUES (4, 1, 'career', 'face_to_face', '취업 관련 상담 진행. 포트폴리오 준비 상태 점검.', '이력서 피드백 완료')
            `);
        }

        return c.json({ success: true, message: 'HRD Counseling table initialized' });
    } catch (e: any) {
        return c.json({ success: false, error: e.message });
    }
});

export { setup as setupApi };
