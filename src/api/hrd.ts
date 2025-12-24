import { Hono } from 'hono';
import { Bindings } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 교강사 관리 API
// ============================================

// 교강사 목록 조회
app.get('/personnel', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT 
                u.id, u.name, u.phone, u.email, u.role, u.status as user_status,
                i.position, i.subject, i.type, i.status as instructor_status, i.joined_at
            FROM users u
            LEFT JOIN hrd_instructors i ON u.id = i.user_id
            WHERE u.role = 'teacher' OR u.role = 'admin'
        `).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch personnel:', e);
        return c.json({ success: false, error: '교강사 목록을 불러오는데 실패했습니다.' }, 500);
    }
});

// 교강사 등록
app.post('/personnel', async (c) => {
    try {
        const body = await c.req.json();
        const { email, name, phone, position, subject, type, joined_at } = body;

        // 1. 사용자 테이블에 있는지 확인
        let user: any = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        let userId: number;

        if (!user) {
            // 새 사용자 생성 (비밀번호는 기본값으로 설정 - 추후 변경 필요)
            const result = await c.env.DB.prepare(
                "INSERT INTO users (email, password, name, phone, role, status) VALUES (?, ?, ?, ?, 'teacher', 'active')"
            ).bind(email, 'temp_password', name, phone).run();
            userId = result.meta.last_row_id as number;
        } else {
            userId = user.id;
            // 역할 업데이트
            await c.env.DB.prepare("UPDATE users SET role = 'teacher' WHERE id = ?").bind(userId).run();
        }

        // 2. 강사 상세 정보 등록
        await c.env.DB.prepare(`
            INSERT OR REPLACE INTO hrd_instructors (user_id, position, subject, type, status, joined_at)
            VALUES (?, ?, ?, ?, 'active', ?)
        `).bind(userId, position, subject, type, joined_at).run();

        return c.json({ success: true, message: '교강사가 등록되었습니다.' });
    } catch (e) {
        console.error('Failed to register personnel:', e);
        return c.json({ success: false, error: '교강사 등록 실패' }, 500);
    }
});

// 교강사 승인 (가입 대기 -> 승인)
app.put('/personnel/:id/approve', async (c) => {
    try {
        const id = c.req.param('id');

        // 1. 사용자 상태 active로 변경
        await c.env.DB.prepare("UPDATE users SET status = 'active' WHERE id = ?").bind(id).run();

        // 2. hrd_instructors가 없으면 기본 레코드 생성
        const instructor = await c.env.DB.prepare("SELECT id FROM hrd_instructors WHERE user_id = ?").bind(id).first();
        if (!instructor) {
            await c.env.DB.prepare(`
                INSERT INTO hrd_instructors (user_id, status, type)
                VALUES (?, 'active', 'part')
            `).bind(id).run();
        }

        return c.json({ success: true, message: '승인되었습니다.' });
    } catch (e) {
        console.error('Failed to approve teacher:', e);
        return c.json({ success: false, error: '승인 처리 실패' }, 500);
    }
});

// 교강사 승인 거절 (가입 대기 -> 이용 정지)
app.put('/personnel/:id/reject', async (c) => {
    try {
        const id = c.req.param('id');
        // 사용자 상태 suspended로 변경
        await c.env.DB.prepare("UPDATE users SET status = 'suspended' WHERE id = ?").bind(id).run();
        return c.json({ success: true, message: '승인 거절(정지) 처리되었습니다.' });
    } catch (e) {
        console.error('Failed to reject teacher:', e);
        return c.json({ success: false, error: '거절 처리 실패' }, 500);
    }
});

// ============================================
// 물품 관리 API
// ============================================

// 물품 목록 조회
app.get('/items', async (c) => {
    try {
        const category = c.req.query('category');
        const search = c.req.query('search');

        let query = "SELECT * FROM hrd_items WHERE 1=1";
        const params: any[] = [];

        if (category && category !== 'all') {
            query += " AND category = ?";
            params.push(category);
        }

        if (search) {
            query += " AND (name LIKE ? OR model LIKE ?)";
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        query += " ORDER BY created_at DESC";

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch items:', e);
        return c.json({ success: false, error: '물품 목록 조회 실패' }, 500);
    }
});

// 물품 등록
app.post('/items', async (c) => {
    try {
        const body = await c.req.json();
        const { category, name, model, quantity, location, status, memo } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_items (category, name, model, quantity, location, status, memo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(category, name, model, parseInt(quantity), location, status, memo).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create item:', e);
        return c.json({ success: false, error: '물품 등록 실패' }, 500);
    }
});

// 물품 수정
app.put('/items', async (c) => {
    try {
        const body = await c.req.json();
        const { id, category, name, model, quantity, location, status, memo } = body;

        await c.env.DB.prepare(`
            UPDATE hrd_items 
            SET category = ?, name = ?, model = ?, quantity = ?, location = ?, status = ?, memo = ?
            WHERE id = ?
        `).bind(category, name, model, parseInt(quantity), location, status, memo, id).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update item:', e);
        return c.json({ success: false, error: '물품 수정 실패' }, 500);
    }
});

// 물품 삭제
app.delete('/items/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM hrd_items WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete item:', e);
        return c.json({ success: false, error: '물품 삭제 실패' }, 500);
    }
});

// ============================================
// 훈련생 관리 API
// ============================================

// 훈련생 목록 조회
app.get('/students', async (c) => {
    try {
        const search = c.req.query('search');
        const status = c.req.query('status');
        const type = c.req.query('type');

        let query = `
            SELECT 
                u.id, u.name, u.phone, u.email, 
                p.birthdate, p.gender, p.address, p.education, p.certifications,
                p.type, p.status, p.package_type, p.payment_method, p.payment_date,
                p.self_pay_amount, p.has_application, p.has_card, p.is_hrd_net_registered,
                p.status_memo, p.created_at,
                (SELECT date FROM consultations WHERE user_id = u.id ORDER BY date DESC LIMIT 1) as last_consult
            FROM users u
            LEFT JOIN hrd_student_profiles p ON u.id = p.user_id
            WHERE u.role = 'student'
        `;
        const params: any[] = [];

        if (search) {
            query += " AND (u.name LIKE ? OR u.phone LIKE ? OR p.birthdate LIKE ?)";
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (status) {
            query += " AND p.status = ?";
            params.push(status);
        }

        if (type) {
            query += " AND p.type = ?";
            params.push(type);
        }

        query += " ORDER BY p.created_at DESC";

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch students:', e);
        return c.json({ success: false, error: '훈련생 목록 조회 실패' }, 500);
    }
});

// 훈련생 등록
app.post('/students', async (c) => {
    try {
        const body = await c.req.json();
        const {
            name, email, phone, birthdate, gender, address, education,
            certifications, type, status, package_type, payment_method,
            payment_date, self_pay_amount, has_application, has_card,
            is_hrd_net_registered, status_memo
        } = body;

        // 1. 사용자 확인/생성
        let user: any = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email || `${Date.now()}@temp.com`).first();
        let userId: number;

        if (!user) {
            const result = await c.env.DB.prepare(
                "INSERT INTO users (email, password, name, phone, role, status) VALUES (?, ?, ?, ?, 'student', 'active')"
            ).bind(email || `${Date.now()}@temp.com`, 'temp_password', name, phone).run();
            userId = result.meta.last_row_id as number;
        } else {
            userId = user.id;
            await c.env.DB.prepare("UPDATE users SET role = 'student', name = ?, phone = ? WHERE id = ?")
                .bind(name, phone, userId).run();
        }

        // 2. 프로필 등록
        await c.env.DB.prepare(`
            INSERT OR REPLACE INTO hrd_student_profiles (
                user_id, birthdate, gender, address, education, certifications,
                type, status, package_type, payment_method, payment_date,
                self_pay_amount, has_application, has_card, is_hrd_net_registered, status_memo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            userId, birthdate, gender, address, education, certifications,
            type, status, package_type, payment_method, payment_date,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo
        ).run();

        return c.json({ success: true, data: { id: userId } });
    } catch (e) {
        console.error('Failed to register student:', e);
        return c.json({ success: false, error: '훈련생 등록 실패' }, 500);
    }
});

// 훈련생 수정
app.put('/students', async (c) => {
    try {
        const body = await c.req.json();
        const {
            id, name, email, phone, birthdate, gender, address, education,
            certifications, type, status, package_type, payment_method,
            payment_date, self_pay_amount, has_application, has_card,
            is_hrd_net_registered, status_memo
        } = body;

        // 1. 사용자 업데이트
        await c.env.DB.prepare("UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?")
            .bind(name, phone, email, id).run();

        // 2. 프로필 업데이트
        await c.env.DB.prepare(`
            UPDATE hrd_student_profiles SET
                birthdate = ?, gender = ?, address = ?, education = ?, certifications = ?,
                type = ?, status = ?, package_type = ?, payment_method = ?, payment_date = ?,
                self_pay_amount = ?, has_application = ?, has_card = ?, 
                is_hrd_net_registered = ?, status_memo = ?
            WHERE user_id = ?
        `).bind(
            birthdate, gender, address, education, certifications,
            type, status, package_type, payment_method, payment_date,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo, id
        ).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update student:', e);
        return c.json({ success: false, error: '훈련생 수정 실패' }, 500);
    }
});

// 상담 이력 조회
app.get('/students/:id/consultations', async (c) => {
    try {
        const id = c.req.param('id');
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC
        `).bind(id).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch consultations:', e);
        return c.json({ success: false, error: '상담 이력 조회 실패' }, 500);
    }
});

// 상담 이력 추가
app.post('/students/:id/consultations', async (c) => {
    try {
        const userId = c.req.param('id');
        const body = await c.req.json();
        const { content, manager, date } = body;

        await c.env.DB.prepare(`
            INSERT INTO consultations (user_id, message, memo, status, created_at, name, phone)
            SELECT ?, ?, ?, 'completed', ?, name, phone FROM users WHERE id = ?
        `).bind(userId, content, manager || '관리자', date || new Date().toISOString(), userId).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to add consultation:', e);
        return c.json({ success: false, error: '상담 이력 추가 실패' }, 500);
    }
});

// ============================================
// 훈련시설 관리 API
// ============================================

// 훈련시설 목록 조회
app.get('/facilities', async (c) => {
    try {
        const search = c.req.query('search');
        let query = "SELECT * FROM hrd_facilities WHERE 1=1";
        const params: any[] = [];

        if (search) {
            query += " AND name LIKE ?";
            params.push(`%${search}%`);
        }

        query += " ORDER BY name ASC";
        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facilities:', e);
        return c.json({ success: false, error: '훈련시설 목록 조회 실패' }, 500);
    }
});

// 훈련시설 등록
app.post('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { name, area, managerMain, managerSub, description } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_facilities (name, area, manager_main, manager_sub, description, status)
            VALUES (?, ?, ?, ?, ?, '양호')
        `).bind(name, parseFloat(area), managerMain, managerSub, description).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create facility:', e);
        return c.json({ success: false, error: '훈련시설 등록 실패' }, 500);
    }
});

// 훈련시설 수정
app.put('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { id, name, area, managerMain, managerSub, description, status } = body;

        await c.env.DB.prepare(`
            UPDATE hrd_facilities 
            SET name = ?, area = ?, manager_main = ?, manager_sub = ?, description = ?, status = ?
            WHERE id = ?
        `).bind(name, parseFloat(area), managerMain, managerSub, description, status, id).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update facility:', e);
        return c.json({ success: false, error: '훈련시설 수정 실패' }, 500);
    }
});

// 훈련시설 삭제
app.delete('/facilities/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM hrd_facilities WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete facility:', e);
        return c.json({ success: false, error: '훈련시설 삭제 실패' }, 500);
    }
});

// 시설 관리 대장 조회
app.get('/facilities/:id/maintenance', async (c) => {
    try {
        const id = c.req.param('id');
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_facility_maintenance 
            WHERE facility_id = ? 
            ORDER BY date DESC, created_at DESC
        `).bind(id).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch maintenance logs:', e);
        return c.json({ success: false, error: '시설 관리 대장 조회 실패' }, 500);
    }
});

// 시설 관리 대장 등록
app.post('/facilities/:id/maintenance', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { status, title, price, vendor, manager, memo, date } = body;

        await c.env.DB.prepare(`
            INSERT INTO hrd_facility_maintenance (facility_id, status, title, price, vendor, manager, memo, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(facilityId, status, title, parseInt(price || 0), vendor, manager || '관리자', memo, date || new Date().toISOString()).run();

        // 시설의 최종 점검일 및 상태 업데이트
        await c.env.DB.prepare(`
            UPDATE hrd_facilities SET last_check = ?, status = ? WHERE id = ?
        `).bind(date || new Date().toISOString(), status === 'repair' ? '점검필요' : '양호', facilityId).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to add maintenance log:', e);
        return c.json({ success: false, error: '시설 관리 대장 등록 실패' }, 500);
    }
});

// 시설 이미지 조회
app.get('/facilities/:id/images', async (c) => {
    try {
        const id = c.req.param('id');
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_facility_images WHERE facility_id = ? ORDER BY created_at DESC
        `).bind(id).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facility images:', e);
        return c.json({ success: false, error: '시설 이미지 조회 실패' }, 500);
    }
});

// 시설 이미지 등록 (실제 파일 업로드는 별도 처리하거나 URL만 저장)
app.post('/facilities/:id/images', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { name, size, url } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_facility_images (facility_id, name, size, url)
            VALUES (?, ?, ?, ?)
        `).bind(facilityId, name, size, url).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to add facility image:', e);
        return c.json({ success: false, error: '시설 이미지 등록 실패' }, 500);
    }
});

// 개별 이미지 삭제
app.delete('/facilities/images/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM hrd_facility_images WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete image:', e);
        return c.json({ success: false, error: '이미지 삭제 실패' }, 500);
    }
});

// 시설 내 물품 목록 조회
app.get('/facilities/:id/items', async (c) => {
    try {
        const id = c.req.param('id');
        // 1. Get facility name
        const facility: any = await c.env.DB.prepare("SELECT name FROM hrd_facilities WHERE id = ?").bind(id).first();
        if (!facility) return c.json({ success: false, error: '시설을 찾을 수 없습니다.' }, 404);

        // 2. Search items where location contains facility name (simple matching)
        const { results } = await c.env.DB.prepare("SELECT * FROM hrd_items WHERE location LIKE ?").bind(`%${facility.name}%`).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facility items:', e);
        return c.json({ success: false, error: '시설 물품 조회 실패' }, 500);
    }
});

// ============================================
// 출석 관리 API
// ============================================

// 출석 현황 조회 (특정 날짜, 특정 과정)
app.get('/attendance', async (c) => {
    try {
        const courseId = c.req.query('courseId');
        const date = c.req.query('date');

        if (!courseId || !date) {
            return c.json({ success: false, error: '과정과 날짜를 선택해주세요.' }, 400);
        }

        // 1. 해당 과정의 수강생 목록 및 출석 정보 조회 (통합된 attendance_logs 테이블 사용)
        // HRD 뷰 호환성을 위해 필드명 매핑 (check_in_time -> in_time 등)
        const query = `
            SELECT 
                u.id, u.name, u.phone,
                p.package_type,
                e.id as enrollment_id,
                al.status,
                al.check_in_time as in_time,
                al.check_out_time as out_time,
                al.note as memo
            FROM users u
            JOIN hrd_student_profiles p ON u.id = p.user_id
            JOIN enrollments e ON u.id = e.user_id
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id AND al.date = ?
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;

        const { results } = await c.env.DB.prepare(query).bind(date, courseId).all();

        // 데이터 포맷팅
        const resultData = results.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            package_type: row.package_type,
            status: row.status || 'pending', // 값이 없으면 미처리 상태
            in_time: row.in_time || '',
            out_time: row.out_time || '',
            memo: row.memo || ''
        }));

        return c.json({ success: true, data: resultData });
    } catch (e) {
        console.error('Failed to fetch attendance:', e);
        return c.json({ success: false, error: '출석 현황 조회 실패' }, 500);
    }
});

// 월간 출석부 조회 (출력용)
app.get('/attendance/monthly', async (c) => {
    try {
        const courseId = c.req.query('courseId');
        const year = c.req.query('year');
        const month = c.req.query('month'); // 1-12

        if (!courseId || !year || !month) {
            return c.json({ success: false, error: '필수 정보가 누락되었습니다.' }, 400);
        }

        const dateStr = `${year}-${month.toString().padStart(2, '0')}`; // YYYY-MM

        // 1. 수강생 목록 조회
        const studentsQuery = `
            SELECT u.id, u.name, u.phone, e.id as enrollment_id
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;
        const { results: students } = await c.env.DB.prepare(studentsQuery).bind(courseId).all();

        // 2. 해당 월의 출석 기록 조회
        // SQLite strftime('%Y-%m', date) uses matching pattern
        const logsQuery = `
            SELECT al.enrollment_id, al.date, al.status
            FROM attendance_logs al
            JOIN enrollments e ON al.enrollment_id = e.id
            WHERE e.course_id = ? AND strftime('%Y-%m', al.date) = ?
        `;
        const { results: logs } = await c.env.DB.prepare(logsQuery).bind(courseId, dateStr).all();

        // 3. 데이터 병합
        const data = students.map((s: any) => {
            const studentLogs = (logs as any[]).filter(l => l.enrollment_id === s.enrollment_id);
            // 날짜별 상태 맵 생성
            const attendanceMap: Record<number, string> = {};
            studentLogs.forEach(l => {
                const day = parseInt(l.date.split('-')[2]);
                attendanceMap[day] = l.status;
            });
            return {
                id: s.id,
                name: s.name,
                phone: s.phone,
                attendance: attendanceMap
            };
        });

        return c.json({ success: true, data });
    } catch (e) {
        console.error('Failed to fetch monthly attendance:', e);
        return c.json({ success: false, error: '월간 출석부 조회 실패' }, 500);
    }
});

// 출석 기록 저장 (일괄 처리)
app.post('/attendance', async (c) => {
    try {
        const body = await c.req.json();
        const { courseId, date, attendances } = body;

        if (!courseId || !date || !attendances) {
            return c.json({ success: false, error: '필수 정보가 누락되었습니다.' }, 400);
        }

        // 각 학생별로 처리 (D1 배치가 제한적이므로 반복문 사용하되, 최적화 고려)
        // enrollment_id 조회가 필요하므로 쿼리가 복잡해짐.
        // 프론트에서 user_id(studentId)를 보내주므로, 이를 통해 enrollment_id를 찾아야 함.

        for (const att of attendances) {
            // 1. Enrollment ID 조회
            const enrollment = await c.env.DB.prepare(
                "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?"
            ).bind(att.studentId, courseId).first();

            if (!enrollment) continue; // 수강 등록이 안된 학생은 무시

            const enrollmentId = enrollment.id;

            // 2. 기존 기록 확인
            const existingLog: any = await c.env.DB.prepare(
                "SELECT id FROM attendance_logs WHERE enrollment_id = ? AND date = ?"
            ).bind(enrollmentId, date).first();

            if (existingLog) {
                // 업데이트
                await c.env.DB.prepare(`
                    UPDATE attendance_logs 
                    SET status = ?, check_in_time = ?, check_out_time = ?, note = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(att.status, att.inTime, att.outTime, att.memo, existingLog.id).run();
            } else {
                // 신규 등록
                await c.env.DB.prepare(`
                    INSERT INTO attendance_logs (enrollment_id, date, status, check_in_time, check_out_time, note)
                    VALUES (?, ?, ?, ?, ?, ?)
                `).bind(enrollmentId, date, att.status, att.inTime, att.outTime, att.memo).run();
            }
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to save attendance:', e);
        return c.json({ success: false, error: '출석 저장 실패' }, 500);
    }
});

// 대시보드 통계 조회 (기존 코드 유지)
app.get('/stats', async (c) => {
    try {
        const studentCountResult = await c.env.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").first();
        const studentCount = studentCountResult ? studentCountResult.count : 0;
        const activeCourseCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM courses WHERE status = 'active'").first('count');
        const itemCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM hrd_items").first('count');
        const facilityCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM hrd_facilities").first('count');

        return c.json({
            success: true,
            data: {
                students: studentCount || 0,
                activeCourses: activeCourseCount || 0,
                items: itemCount || 0,
                facilities: facilityCount || 0,
                attendanceRate: await (async () => {
                    // 전체 출석 기록 수
                    const totalLogs: any = await c.env.DB.prepare("SELECT COUNT(*) as count FROM attendance_logs").first();
                    if (!totalLogs || totalLogs.count === 0) return 0;

                    // 출석(present) 또는 지각(late) 수
                    const presentLogs: any = await c.env.DB.prepare(
                        "SELECT COUNT(*) as count FROM attendance_logs WHERE status IN ('present', 'late')"
                    ).first();

                    const rate = (presentLogs.count / totalLogs.count) * 100;
                    return Math.round(rate * 10) / 10; // 소수점 첫째 자리까지 반올림
                })(),
                notifications: 3
            }
        });
    } catch (e) {
        console.error('Failed to fetch stats:', e);
        return c.json({ success: false, error: '통계 조회 실패' }, 500);
    }
});

// ==========================================
// 훈련생 상담 관리 API
// ==========================================

// GET /api/hrd/counseling - 상담 일지 목록 조회
app.get('/counseling', async (c) => {
    try {
        const studentId = c.req.query('student_id');
        const courseId = c.req.query('course_id');
        const search = c.req.query('search');

        let query = `
            SELECT 
                cl.*,
                u_student.name as student_name,
                u_counselor.name as counselor_name,
                c.title as course_title
            FROM hrd_counseling_logs cl
            LEFT JOIN users u_student ON cl.student_id = u_student.id
            LEFT JOIN users u_counselor ON cl.counselor_id = u_counselor.id
            LEFT JOIN courses c ON cl.course_id = c.id
            WHERE 1=1
        `;

        const params: any[] = [];

        if (studentId) {
            query += ' AND cl.student_id = ?';
            params.push(studentId);
        }

        if (courseId) {
            query += ' AND cl.course_id = ?';
            params.push(courseId);
        }

        if (search) {
            query += ' AND (u_student.name LIKE ? OR cl.content LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY cl.counseling_date DESC';

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/hrd/counseling - 상담 일지 등록
app.post('/counseling', async (c) => {
    try {
        const body = await c.req.json();
        // counselor_id should ideally come from auth token, but for now we accept it or default to 1 (admin)
        const counselorId = body.counselor_id || 1;

        await c.env.DB.prepare(`
            INSERT INTO hrd_counseling_logs (student_id, counselor_id, course_id, counseling_date, category, method, content, result, next_counseling_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            body.student_id, counselorId, body.course_id,
            body.counseling_date || new Date().toISOString(),
            body.category, body.method, body.content, body.result, body.next_counseling_date
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 등록되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// PUT /api/hrd/counseling/:id - 상담 일지 수정
app.put('/counseling/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        await c.env.DB.prepare(`
            UPDATE hrd_counseling_logs 
            SET course_id = ?, counseling_date = ?, category = ?, method = ?, content = ?, result = ?, next_counseling_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            body.course_id, body.counseling_date, body.category, body.method,
            body.content, body.result, body.next_counseling_date, id
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 수정되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/hrd/counseling/:id - 상담 일지 삭제
app.delete('/counseling/:id', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.DB.prepare('DELETE FROM hrd_counseling_logs WHERE id = ?').bind(id).run();
        return successResponse(c, { success: true }, '상담 일지가 삭제되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

export default app;
