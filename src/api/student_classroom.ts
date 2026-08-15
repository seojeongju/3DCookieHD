import { Hono } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings; Variables: { user: JWTPayload } }>();
app.use('*', authMiddleware);

type EnrollmentRow = {
    enrollment_id: number;
    session_id: number;
    course_name: string | null;
    session_number: number | null;
    training_start_date: string | null;
    training_end_date: string | null;
    location: string | null;
    instructor_name: string | null;
    lms_course_id: number | null;
    approved_course_id: number | null;
    access_code: string | null;
};

async function requireEnrollment(c: { env: Bindings; get: (k: 'user') => JWTPayload }, sessionId: number): Promise<EnrollmentRow | null> {
    const user = c.get('user');
    if (!user?.userId || isNaN(sessionId)) return null;
    return (await c.env.DB.prepare(
        `SELECT cse.id as enrollment_id, cse.session_id, ac.name as course_name, cs.session_number,
                cs.training_start_date, cs.training_end_date, cs.location, cs.instructor_name,
                cs.lms_course_id, cs.approved_course_id, cs.access_code
         FROM course_session_enrollments cse
         JOIN course_sessions cs ON cs.id = cse.session_id
         LEFT JOIN approved_courses ac ON ac.id = cs.approved_course_id
         WHERE cse.session_id = ? AND cse.user_id = ? AND cse.status IN ('enrolled', 'approved')`
    ).bind(sessionId, user.userId).first()) as EnrollmentRow | null;
}

function todayYmd(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function attendanceLabel(status: string | null | undefined): string {
    const map: Record<string, string> = {
        present: '출석',
        attended: '출석',
        late: '지각',
        early: '조퇴',
        early_leave: '조퇴',
        absent: '결석',
        absent_under_50: '50%미만결석',
        public: '공결',
        excused: '공결',
        pending: '미처리',
    };
    if (!status) return '미처리';
    return map[status] || status;
}

function isAttendedStatus(status: string | null | undefined): boolean {
    return ['present', 'attended', 'late', 'early', 'early_leave', 'public', 'excused'].includes(String(status || ''));
}

async function loadTimetable(DB: D1Database, sessionId: number) {
    const { results } = await DB.prepare(
        `SELECT st.id, st.training_date, st.period_number, st.location, st.is_excluded,
                nac.name as subject_name, u.name as instructor_name,
                spc.start_time, spc.end_time
         FROM session_timetable st
         LEFT JOIN ncs_approved_curriculum nac ON nac.id = st.subject_id
         LEFT JOIN users u ON u.id = st.instructor_id
         LEFT JOIN session_period_configs spc
           ON spc.session_id = st.session_id AND spc.period_number = st.period_number
         WHERE st.session_id = ? AND IFNULL(st.is_excluded, 0) = 0
         ORDER BY st.training_date ASC, st.period_number ASC`
    ).bind(sessionId).all();
    return results || [];
}

app.get('/:sessionId/notices', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const ids: number[] = [];
    if (enrolled.lms_course_id) ids.push(enrolled.lms_course_id);
    if (enrolled.approved_course_id) ids.push(enrolled.approved_course_id);
    if (!ids.length) return c.json({ success: true, data: [] });
    const placeholders = ids.map(() => '?').join(',');
    const { results } = await c.env.DB.prepare(
        `SELECT p.id, p.title, p.content, p.created_at, p.pinned, p.category, u.name as author_name
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         WHERE IFNULL(p.status, 'published') = 'published'
           AND p.category IN ('notice', '공지', '공지사항')
           AND p.course_id IN (${placeholders})
         ORDER BY IFNULL(p.pinned, 0) DESC, p.created_at DESC
         LIMIT 50`
    ).bind(...ids).all();
    const list = (results || []).map((row: Record<string, unknown>) => {
        const raw = String(row.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return { ...row, excerpt: raw.slice(0, 140) };
    });
    return c.json({ success: true, data: list });
});

app.get('/:sessionId/materials', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const materials: Record<string, unknown>[] = [];
    if (enrolled.lms_course_id) {
        try {
            const { results } = await c.env.DB.prepare(
                `SELECT id, title, type, file_url, description, week, created_at
                 FROM course_materials WHERE course_id = ? ORDER BY week ASC, order_index ASC, id DESC`
            ).bind(enrolled.lms_course_id).all();
            for (const row of results || []) {
                materials.push({ source: 'material', ...row });
            }
        } catch {
            /* 테이블이 없거나 비어 있으면 과제 첨부만 사용 */
        }
    }
    const { results: assignmentFiles } = await c.env.DB.prepare(
        `SELECT id, title, attachment_url as file_url, due_date as created_at
         FROM assignments
         WHERE session_id = ? AND attachment_url IS NOT NULL AND TRIM(attachment_url) <> ''
         ORDER BY due_date DESC`
    ).bind(sessionId).all();
    for (const row of assignmentFiles || []) {
        materials.push({ source: 'assignment', type: 'file', ...row });
    }
    return c.json({ success: true, data: materials });
});

app.get('/:sessionId/surveys', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const userId = c.get('user').userId;
    const { results } = await c.env.DB.prepare(
        `SELECT s.id, s.course_id, s.session_id, s.type, s.title, s.description, s.start_date, s.end_date, s.status, s.subject_name,
                CASE WHEN sr.id IS NOT NULL THEN 'completed' ELSE 'pending' END as response_status
         FROM surveys s
         LEFT JOIN survey_responses sr ON sr.survey_id = s.id AND sr.student_id = ?
         WHERE s.status = 'active'
           AND (s.start_date IS NULL OR s.start_date <= date('now'))
           AND (s.end_date IS NULL OR s.end_date >= date('now'))
           AND (
                s.session_id = ?
                OR (s.course_id = ? AND s.session_id IS NULL)
           )
         ORDER BY s.created_at DESC`
    ).bind(userId, sessionId, enrolled.lms_course_id || 0).all();
    return c.json({ success: true, data: results || [] });
});

app.get('/:sessionId/timetable', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const rows = await loadTimetable(c.env.DB, sessionId);
    return c.json({ success: true, data: rows });
});

app.get('/:sessionId/exams', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const userId = c.get('user').userId;
    const courseId = enrolled.lms_course_id;
    if (!courseId) return c.json({ success: true, data: [] });
    const { results } = await c.env.DB.prepare(
        `SELECT e.id, e.title, e.description, e.type, e.start_time, e.end_time,
                e.time_limit_minutes, e.is_active, e.course_id,
                (SELECT 1 FROM exam_submissions WHERE exam_id = e.id AND student_id = ? LIMIT 1) as has_submitted
         FROM exams e
         WHERE e.course_id = ? AND IFNULL(e.is_active, 0) = 1
         ORDER BY e.created_at DESC`
    ).bind(userId, courseId).all();
    return c.json({ success: true, data: results || [] });
});

app.get('/:sessionId/assignments', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const userId = c.get('user').userId;
    let { results } = await c.env.DB.prepare(
        `SELECT a.id, a.title, a.description, a.due_date, a.max_score, a.attachment_url, a.session_id, a.course_id,
                u.name as teacher_name,
                s.id as submission_id, s.submitted_at, s.score, s.status as submission_status, s.feedback
         FROM assignments a
         LEFT JOIN users u ON a.teacher_id = u.id
         LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = ?
         WHERE a.session_id = ?
         ORDER BY a.due_date DESC`
    ).bind(userId, sessionId).all();
    if ((!results || results.length === 0) && enrolled.lms_course_id) {
        results = (await c.env.DB.prepare(
            `SELECT a.id, a.title, a.description, a.due_date, a.max_score, a.attachment_url, a.session_id, a.course_id,
                    u.name as teacher_name,
                    s.id as submission_id, s.submitted_at, s.score, s.status as submission_status, s.feedback
             FROM assignments a
             LEFT JOIN users u ON a.teacher_id = u.id
             LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = ?
             WHERE a.course_id = ? AND a.session_id IS NULL
             ORDER BY a.due_date DESC`
        ).bind(userId, enrolled.lms_course_id).all()).results;
    }
    return c.json({ success: true, data: results || [] });
});

app.get('/:sessionId/attendance', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const { results } = await c.env.DB.prepare(
        `SELECT date, status, check_in_time, check_out_time, note
         FROM attendance_logs
         WHERE enrollment_id = ?
         ORDER BY date DESC`
    ).bind(enrolled.enrollment_id).all();
    const logs = (results || []).map((row: Record<string, unknown>) => ({
        ...row,
        label: attendanceLabel(row.status as string),
        attended: isAttendedStatus(row.status as string),
    }));
    const attended = logs.filter((l: { attended: boolean }) => l.attended).length;
    return c.json({
        success: true,
        data: {
            logs,
            summary: {
                recorded: logs.length,
                attended,
                rate: logs.length ? Math.round((attended / logs.length) * 100) : 0,
            },
        },
    });
});

app.get('/:sessionId', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const enrolled = await requireEnrollment(c, sessionId);
    if (!enrolled) return c.json({ success: false, error: '이 강의실에 등록되어 있지 않습니다' }, 403);
    const today = todayYmd();
    const timetable = await loadTimetable(c.env.DB, sessionId);
    const upcoming = timetable.filter((row: { training_date?: string }) => String(row.training_date || '') >= today).slice(0, 6);
    const { results: logs } = await c.env.DB.prepare(
        `SELECT status FROM attendance_logs WHERE enrollment_id = ?`
    ).bind(enrolled.enrollment_id).all();
    const logRows = logs || [];
    const attended = logRows.filter((l: { status?: string }) => isAttendedStatus(l.status)).length;
    return c.json({
        success: true,
        data: {
            session_id: sessionId,
            course_name: enrolled.course_name,
            session_number: enrolled.session_number,
            training_start_date: enrolled.training_start_date,
            training_end_date: enrolled.training_end_date,
            location: enrolled.location,
            instructor_name: enrolled.instructor_name,
            has_access_code: enrolled.access_code ? 1 : 0,
            attendance: {
                recorded: logRows.length,
                attended,
                rate: logRows.length ? Math.round((attended / logRows.length) * 100) : 0,
            },
            upcoming,
        },
    });
});

export default app;
