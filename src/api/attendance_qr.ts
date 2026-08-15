import { Hono } from 'hono';
import { Bindings, Variables } from '../types';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// QR코드 생성 (강사/관리자)
app.post('/sessions', async (c) => {
    try {
        const body = await c.req.json();
        const { course_id, session_date, session_type, duration_minutes, location_required, latitude, longitude, created_by } = body;

        // QR코드 생성 (UUID 기반)
        const qrCode = crypto.randomUUID();

        // 유효 시간 설정
        const now = new Date();
        const validFrom = now.toISOString();
        const validUntil = new Date(now.getTime() + (duration_minutes || 30) * 60000).toISOString();

        const result = await c.env.DB.prepare(`
            INSERT INTO attendance_qr_sessions (
                course_id, session_date, session_type, qr_code, 
                valid_from, valid_until, location_required, 
                latitude, longitude, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            course_id, session_date, session_type, qrCode,
            validFrom, validUntil, location_required ? 1 : 0,
            latitude, longitude, created_by
        ).run();

        return c.json({
            success: true,
            data: {
                id: result.meta.last_row_id,
                qr_code: qrCode,
                valid_from: validFrom,
                valid_until: validUntil
            }
        });
    } catch (e) {
        console.error('Failed to create QR session:', e);
        return c.json({ success: false, error: 'Failed to create QR session' }, 500);
    }
});

// QR코드 조회 (출석 체크용)
app.get('/sessions/:qrCode', async (c) => {
    try {
        const qrCode = c.req.param('qrCode');

        const session = await c.env.DB.prepare(`
            SELECT * FROM attendance_qr_sessions WHERE qr_code = ?
        `).bind(qrCode).first();

        if (!session) {
            return c.json({ success: false, error: 'Invalid QR code' }, 404);
        }

        // 유효 시간 확인
        const now = new Date();
        const validFrom = new Date(session.valid_from as string);
        const validUntil = new Date(session.valid_until as string);

        if (now < validFrom || now > validUntil) {
            return c.json({ success: false, error: 'QR code expired' }, 400);
        }

        return c.json({ success: true, data: session });
    } catch (e) {
        console.error('Failed to fetch QR session:', e);
        return c.json({ success: false, error: 'Failed to fetch QR session' }, 500);
    }
});

// 출석 체크인
app.post('/checkin', async (c) => {
    try {
        const body = await c.req.json();
        const { qr_code, student_id, latitude, longitude, device_info } = body;

        // QR 세션 조회
        const session = await c.env.DB.prepare(`
            SELECT * FROM attendance_qr_sessions WHERE qr_code = ?
        `).bind(qr_code).first();

        if (!session) {
            return c.json({ success: false, error: 'Invalid QR code' }, 404);
        }

        // 유효 시간 확인
        const now = new Date();
        const validFrom = new Date(session.valid_from as string);
        const validUntil = new Date(session.valid_until as string);

        if (now < validFrom || now > validUntil) {
            return c.json({ success: false, error: 'QR code expired' }, 400);
        }

        // 위치 확인 (필요한 경우)
        let status = 'present';
        if (session.location_required && latitude && longitude) {
            const distance = calculateDistance(
                session.latitude as number,
                session.longitude as number,
                latitude,
                longitude
            );

            if (distance > (session.radius_meters as number)) {
                return c.json({ success: false, error: 'Location out of range' }, 400);
            }
        }

        // 지각 여부: valid_from(출석 시작 시각) 기준으로 LATE_MINUTES 초과 시 지각 처리
        const LATE_MINUTES = 10;
        const sessionTime = new Date(session.valid_from as string);
        const lateThreshold = new Date(sessionTime.getTime() + LATE_MINUTES * 60000);
        if (now > lateThreshold) {
            status = 'late';
        }

        // 중복 체크인 확인
        const existing = await c.env.DB.prepare(`
            SELECT id FROM attendance_qr_checkins 
            WHERE session_id = ? AND student_id = ?
        `).bind(session.id, student_id).first();

        if (existing) {
            return c.json({ success: false, error: 'Already checked in' }, 400);
        }

        // 체크인 기록
        await c.env.DB.prepare(`
            INSERT INTO attendance_qr_checkins (
                session_id, student_id, latitude, longitude, device_info, status
            ) VALUES (?, ?, ?, ?, ?, ?)
        `).bind(session.id, student_id, latitude, longitude, device_info, status).run();

        try {
            await syncAttendanceLog(c.env.DB, {
                studentId: Number(student_id),
                qrCourseId: Number(session.course_id),
                hrdSessionId: body.session_id != null ? Number(body.session_id) : null,
                date: String(session.session_date || '').slice(0, 10),
                status,
            });
        } catch (syncErr) {
            console.error('QR 출석부 연동 실패:', syncErr);
        }

        return c.json({ success: true, data: { status } });
    } catch (e) {
        console.error('Failed to check in:', e);
        return c.json({ success: false, error: 'Failed to check in' }, 500);
    }
});

// 출석 현황 조회 (세션별)
app.get('/sessions/:sessionId/checkins', async (c) => {
    try {
        const sessionId = c.req.param('sessionId');

        const { results } = await c.env.DB.prepare(`
            SELECT c.*, u.name as student_name, u.email
            FROM attendance_qr_checkins c
            JOIN users u ON c.student_id = u.id
            WHERE c.session_id = ?
            ORDER BY c.check_in_time ASC
        `).bind(sessionId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch checkins:', e);
        return c.json({ success: false, error: 'Failed to fetch checkins' }, 500);
    }
});

// 과정별 QR 세션 목록
app.get('/course/:courseId', async (c) => {
    try {
        const courseId = c.req.param('courseId');

        const { results } = await c.env.DB.prepare(`
            SELECT s.*, u.name as creator_name,
                   COUNT(c.id) as checkin_count
            FROM attendance_qr_sessions s
            LEFT JOIN attendance_qr_checkins c ON s.id = c.session_id
            JOIN users u ON s.created_by = u.id
            WHERE s.course_id = ?
            GROUP BY s.id
            ORDER BY s.session_date DESC, s.session_type ASC
        `).bind(courseId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch sessions:', e);
        return c.json({ success: false, error: 'Failed to fetch sessions' }, 500);
    }
});

// Haversine formula로 거리 계산 (미터)
async function syncAttendanceLog(
    DB: D1Database,
    opts: { studentId: number; qrCourseId: number; hrdSessionId: number | null; date: string; status: string }
) {
    if (!opts.studentId || !opts.date) return;
    let enrollmentId: number | null = null;
    if (opts.hrdSessionId && !Number.isNaN(opts.hrdSessionId)) {
        const row = await DB.prepare(
            `SELECT id FROM course_session_enrollments
             WHERE session_id = ? AND user_id = ? AND status IN ('enrolled', 'approved')`
        ).bind(opts.hrdSessionId, opts.studentId).first<{ id: number }>();
        enrollmentId = row?.id ?? null;
    }
    if (!enrollmentId && opts.qrCourseId) {
        const bySession = await DB.prepare(
            `SELECT id FROM course_session_enrollments
             WHERE session_id = ? AND user_id = ? AND status IN ('enrolled', 'approved')`
        ).bind(opts.qrCourseId, opts.studentId).first<{ id: number }>();
        enrollmentId = bySession?.id ?? null;
    }
    if (!enrollmentId && opts.qrCourseId) {
        const byLms = await DB.prepare(
            `SELECT cse.id FROM course_session_enrollments cse
             JOIN course_sessions cs ON cs.id = cse.session_id
             WHERE cs.lms_course_id = ? AND cse.user_id = ? AND cse.status IN ('enrolled', 'approved')
             ORDER BY cse.id DESC LIMIT 1`
        ).bind(opts.qrCourseId, opts.studentId).first<{ id: number }>();
        enrollmentId = byLms?.id ?? null;
    }
    if (!enrollmentId) {
        const legacy = await DB.prepare(
            `SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'approved'`
        ).bind(opts.studentId, opts.qrCourseId).first<{ id: number }>();
        enrollmentId = legacy?.id ?? null;
    }
    if (!enrollmentId) return;

    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const checkIn = kst.toISOString().substring(11, 19);
    const logStatus = opts.status === 'late' ? 'late' : 'present';
    const existing = await DB.prepare(
        `SELECT id FROM attendance_logs WHERE enrollment_id = ? AND date = ?`
    ).bind(enrollmentId, opts.date).first<{ id: number }>();
    if (existing) {
        await DB.prepare(
            `UPDATE attendance_logs
             SET status = ?, check_in_time = COALESCE(check_in_time, ?), note = COALESCE(note, 'QR 출석'), updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`
        ).bind(logStatus, checkIn, existing.id).run();
    } else {
        await DB.prepare(
            `INSERT INTO attendance_logs (enrollment_id, date, status, check_in_time, note)
             VALUES (?, ?, ?, ?, 'QR 출석')`
        ).bind(enrollmentId, opts.date, logStatus, checkIn).run();
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export default app;
