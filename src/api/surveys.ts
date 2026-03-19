import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings }>();

/** 강의 후 설문지 고정 문항 (교육만족도 3, 솔루션/강사 3, 교육내용 4, 기타 1) */
const POST_LECTURE_QUESTIONS = [
    { question_text: '교육과정에 대해 전반적으로 만족한다.', question_type: 'rating' as const, options: null, order_index: 1 },
    { question_text: '교육 내용이 쉽게 구성되었으며, 전반적으로 이해 하였다', question_type: 'rating' as const, options: null, order_index: 2 },
    { question_text: '본 교육의 전반적인 만족도는?', question_type: 'rating' as const, options: null, order_index: 3 },
    { question_text: '강의 내용을 알기 쉽게 설명 했는가?', question_type: 'rating' as const, options: null, order_index: 4 },
    { question_text: '교수는 강의의 중요성을 잘 짚어주었는가?', question_type: 'rating' as const, options: null, order_index: 5 },
    { question_text: '교수가 전체적으로 분위기를 잘 이끌었는가?', question_type: 'rating' as const, options: null, order_index: 6 },
    { question_text: '강의에 포함된 내용이 흥미로웠는가?', question_type: 'rating' as const, options: null, order_index: 7 },
    { question_text: '왕성한 의욕을 갖도록 동기유발을 잘 하였는가?', question_type: 'rating' as const, options: null, order_index: 8 },
    { question_text: '교육목표에 적합한 교육계획을 수립하였는가?', question_type: 'rating' as const, options: null, order_index: 9 },
    { question_text: '강의 내용이 실력향상에 도움이 되었는가?', question_type: 'rating' as const, options: null, order_index: 10 },
    { question_text: '전반적인 교육 소감을 구체적으로 작성하여 주시기 바랍니다.', question_type: 'text' as const, options: null, order_index: 11 }
];

// GET /api/surveys - List surveys by course_id or session_id (for LMS 설문관리)
app.get('/', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') {
            return errorResponse(c, '권한이 없습니다', 403);
        }
        const courseId = c.req.query('course_id') ? parseInt(c.req.query('course_id')!, 10) : null;
        const sessionId = c.req.query('session_id') ? parseInt(c.req.query('session_id')!, 10) : null;
        if (!courseId && !sessionId) {
            return errorResponse(c, 'course_id 또는 session_id가 필요합니다', 400);
        }

        const { DB } = c.env;
        let query = `
            SELECT s.*,
                COALESCE(c.title, (SELECT ac.name || ' (' || cs.session_number || '회차)' FROM course_sessions cs LEFT JOIN approved_courses ac ON cs.approved_course_id = ac.id WHERE cs.id = s.session_id)) as course_title,
                (SELECT COUNT(*) FROM survey_responses sr WHERE sr.survey_id = s.id) as response_count
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (sessionId) {
            query += ' AND s.session_id = ?';
            params.push(sessionId);
        }
        if (courseId) {
            query += ' AND s.course_id = ?';
            params.push(courseId);
        }

        // teacher: only own courses (session은 회차 단위로 조회 허용)
        if (user.role === 'teacher') {
            if (sessionId) {
                const session: any = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(sessionId).first();
                if (!session) return successResponse(c, []);
            } else if (courseId) {
                const course: any = await DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(courseId).first();
                if (!course || course.teacher_id !== user.userId) return successResponse(c, []);
            }
        }

        query += ' ORDER BY s.created_at DESC';
        const { results } = await DB.prepare(query).bind(...params).all();

        let totalTarget = 0;
        if (sessionId) {
            const t: any = await DB.prepare(
                'SELECT COUNT(*) as total FROM course_session_enrollments WHERE session_id = ? AND status IN (\'approved\', \'enrolled\')'
            ).bind(sessionId).first();
            totalTarget = t?.total ?? 0;
        } else if (courseId) {
            const t: any = await DB.prepare(
                'SELECT COUNT(*) as total FROM enrollments WHERE course_id = ? AND status = \'approved\''
            ).bind(courseId).first();
            totalTarget = t?.total ?? 0;
        }

        const list = (results || []).map((s: any) => ({
            id: s.id,
            course_id: s.course_id,
            session_id: s.session_id,
            type: s.type,
            title: s.title,
            description: s.description,
            start_date: s.start_date,
            end_date: s.end_date,
            status: s.status,
            response_count: s.response_count || 0,
            total_target: totalTarget,
            created_at: s.created_at,
            subject_name: s.subject_name || null,
            course_title: s.course_title || s.session_title || null
        }));

        return successResponse(c, list);
    } catch (e: any) {
        console.error('Error listing surveys:', e);
        return errorResponse(c, e.message, 500);
    }
});

/**
 * GET /api/surveys/summary
 * 과정/회차별 설문 요약: 평균 만족도(5점 척도 rating 문항만 집계)
 */
app.get('/summary', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') {
            return errorResponse(c, '권한이 없습니다', 403);
        }
        const courseId = c.req.query('course_id') ? parseInt(c.req.query('course_id')!, 10) : null;
        const sessionId = c.req.query('session_id') ? parseInt(c.req.query('session_id')!, 10) : null;
        if (!courseId && !sessionId) {
            return errorResponse(c, 'course_id 또는 session_id가 필요합니다', 400);
        }

        const { DB } = c.env;
        let whereClause = '1=1';
        const params: (number | string)[] = [];
        if (sessionId) {
            whereClause = 's.session_id = ?';
            params.push(sessionId);
        } else if (courseId) {
            whereClause = 's.course_id = ?';
            params.push(courseId);
        }

        if (user.role === 'teacher') {
            if (sessionId) {
                const session: any = await DB.prepare('SELECT id FROM course_sessions WHERE id = ?').bind(sessionId).first();
                if (!session) return successResponse(c, { average_satisfaction: 0 });
            } else if (courseId) {
                const course: any = await DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(courseId).first();
                if (!course || course.teacher_id !== user.userId) return successResponse(c, { average_satisfaction: 0 });
            }
        }

        const row = await DB.prepare(`
            SELECT AVG(CAST(sa.answer_value AS REAL)) as avg_rating
            FROM survey_answers sa
            INNER JOIN survey_questions sq ON sa.question_id = sq.id AND sq.question_type = 'rating'
            INNER JOIN surveys s ON sq.survey_id = s.id
            WHERE ${whereClause} AND sa.answer_value IS NOT NULL AND TRIM(sa.answer_value) <> ''
        `).bind(...params).first<{ avg_rating: number | null }>();

        const average_satisfaction = row?.avg_rating != null && !isNaN(Number(row.avg_rating)) ? Math.round(Number(row.avg_rating) * 10) / 10 : 0;
        return successResponse(c, { average_satisfaction });
    } catch (e: any) {
        console.error('Error surveys summary:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/teacher - Get surveys for teacher's assigned courses
app.get('/teacher', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'teacher' && user.role !== 'admin') {
            return errorResponse(c, '강사 권한이 필요합니다', 403);
        }

        const { DB } = c.env;
        const teacherId = user.role === 'teacher' ? user.userId : null;

        let query = `
            SELECT 
                s.*,
                s.subject_name,
                c.title as course_title,
                c.teacher_id,
                (SELECT COUNT(*) FROM survey_responses sr WHERE sr.survey_id = s.id) as response_count,
                (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = s.course_id AND e.status = 'approved') as total_target
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (teacherId) {
            query += ' AND c.teacher_id = ?';
            params.push(teacherId);
        }

        query += ' ORDER BY s.created_at DESC';

        const { results } = await DB.prepare(query).bind(...params).all();

        const surveys = (results || []).map((s: any) => ({
            id: s.id,
            course_id: s.course_id,
            course_title: s.course_title,
            type: s.type,
            title: s.title,
            description: s.description,
            start_date: s.start_date,
            end_date: s.end_date,
            status: s.status,
            response_count: s.response_count || 0,
            total_target: s.total_target || 0,
            created_at: s.created_at,
            subject_name: s.subject_name || null
        }));

        return successResponse(c, surveys);
    } catch (e: any) {
        console.error('Error fetching teacher surveys:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/my-pending (For Students) — course_id 과정 + session_id(회차) 과정 모두 포함
app.get('/my-pending', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as { userId?: number; id?: number; role?: string } | undefined;
        const uid = user?.userId ?? user?.id;
        const role = (user?.role ?? '').toLowerCase();
        const allowedRoles = ['student', 'instructor', 'teacher'];
        if (uid == null || uid === 0 || !allowedRoles.includes(role)) {
            return errorResponse(c, '학생 권한이 필요합니다', 403);
        }

        const { DB } = c.env;
        const studentId = uid;

        // 1) course_id 기준: enrollments로 수강 중인 과정의 활성 설문
        const { results: byCourse } = await DB.prepare(`
            SELECT 
                s.id, s.course_id, s.session_id, s.type, s.title, s.description, s.start_date, s.end_date, s.status, s.created_at, s.subject_name,
                c.title as course_title,
                CASE WHEN sr.id IS NOT NULL THEN 'completed' ELSE 'pending' END as response_status
            FROM surveys s
            INNER JOIN enrollments e ON s.course_id = e.course_id AND e.user_id = ? AND e.status = 'approved'
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN survey_responses sr ON s.id = sr.survey_id AND sr.student_id = ?
            WHERE s.status = 'active'
                AND (s.start_date IS NULL OR s.start_date <= date('now'))
                AND (s.end_date IS NULL OR s.end_date >= date('now'))
        `).bind(studentId, studentId).all();

        // 2) session_id(회차) 기준: course_session_enrollments로 수강 중인 회차의 활성 설문
        const { results: bySession } = await DB.prepare(`
            SELECT 
                s.id, s.course_id, s.session_id, s.type, s.title, s.description, s.start_date, s.end_date, s.status, s.created_at, s.subject_name,
                (SELECT (ac.name || ' (' || cs.session_number || '회차' || CASE WHEN cs.session_name IS NOT NULL AND TRIM(cs.session_name) <> '' THEN ' - ' || cs.session_name ELSE '' END || ')')
                 FROM course_sessions cs LEFT JOIN approved_courses ac ON cs.approved_course_id = ac.id WHERE cs.id = s.session_id) as course_title,
                CASE WHEN sr.id IS NOT NULL THEN 'completed' ELSE 'pending' END as response_status
            FROM surveys s
            INNER JOIN course_session_enrollments cse ON s.session_id = cse.session_id AND cse.user_id = ? AND cse.status IN ('approved', 'enrolled')
            LEFT JOIN survey_responses sr ON s.id = sr.survey_id AND sr.student_id = ?
            WHERE s.session_id IS NOT NULL AND s.status = 'active'
                AND (s.start_date IS NULL OR s.start_date <= date('now'))
                AND (s.end_date IS NULL OR s.end_date >= date('now'))
        `).bind(studentId, studentId).all();

        const seen = new Set<number>();
        const merged: any[] = [];
        for (const row of (byCourse || [])) {
            const r = row as any;
            if (r.id && !seen.has(r.id as number)) { seen.add(r.id as number); merged.push(r); }
        }
        for (const row of (bySession || [])) {
            const r = row as any;
            if (r.id && !seen.has(r.id as number)) { seen.add(r.id as number); merged.push(r); }
        }
        merged.sort((a, b) => new Date((b.created_at || '')).getTime() - new Date((a.created_at || '')).getTime());

        return successResponse(c, merged);
    } catch (e: any) {
        console.error('Error fetching pending surveys:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/:id - Get survey details with questions
app.get('/:id', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');

        const surveyId = parseInt(id, 10);
        const survey: any = await DB.prepare(`
            SELECT 
                s.id, s.course_id, s.session_id, s.type, s.title, s.description, s.start_date, s.end_date, s.status, s.teacher_id, s.subject_name, s.created_at, s.updated_at,
                c.title as course_title, c.teacher_id as course_teacher_id, 
                u.name as teacher_name
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN users u ON s.teacher_id = u.id
            WHERE s.id = ?
        `).bind(surveyId).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (survey.session_id) {
            const session: any = await DB.prepare(`
                SELECT cs.session_number, cs.session_name, cs.training_start_date, cs.training_end_date,
                    ac.name as approved_course_name, ac.instructor_name as approved_instructor_name,
                    cs.instructor_name as session_instructor_name
                FROM course_sessions cs
                LEFT JOIN approved_courses ac ON cs.approved_course_id = ac.id
                WHERE cs.id = ?
            `).bind(survey.session_id).first();
            if (session) {
                const courseName = session.approved_course_name || '';
                const sessionNum = session.session_number || 1;
                const sessionNameSuffix = session.session_name ? ` - ${session.session_name}` : '';
                survey.course_title = `${courseName} (${sessionNum}회차)${sessionNameSuffix}`.trim();
                if (!survey.teacher_name) survey.teacher_name = session.session_instructor_name || session.approved_instructor_name;
                survey.subject_title = (survey.type === 'post_lecture' && survey.subject_name) ? survey.subject_name : courseName;
            }
        }
        if (!survey.teacher_name && survey.course_teacher_id) {
            const courseTeacher: any = await DB.prepare('SELECT name FROM users WHERE id = ?').bind(survey.course_teacher_id).first();
            if (courseTeacher) survey.teacher_name = courseTeacher.name;
        }

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher') {
            if (survey.session_id) {
                // 회차(session) 설문: 회차 담당 여부는 별도 컬럼이 없을 수 있어, 조회는 허용
            } else if (effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 설문만 조회할 수 있습니다', 403);
            }
        }

        const { results: questions } = await DB.prepare(`
            SELECT * FROM survey_questions 
            WHERE survey_id = ? 
            ORDER BY order_index ASC
        `).bind(id).all();

        const parsedQuestions = (questions || []).map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : []
        }));

        return successResponse(c, { ...survey, questions: parsedQuestions });
    } catch (e: any) {
        console.error('Error fetching survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/surveys/:id/submit - Student submits survey answers
app.post('/:id/submit', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'student') {
            return errorResponse(c, '학생만 설문에 참여할 수 있습니다', 403);
        }
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();
        const answers = Array.isArray(body.answers) ? body.answers : [];

        const survey: any = await DB.prepare('SELECT s.* FROM surveys s WHERE s.id = ?').bind(id).first();
        if (!survey) return notFoundResponse(c, '설문을 찾을 수 없습니다.');
        if (survey.status !== 'active') {
            return errorResponse(c, '진행 중인 설문이 아닙니다.', 400);
        }

        const studentId = user.userId;
        let allowed = false;
        if (survey.course_id) {
            const e: any = await DB.prepare('SELECT 1 FROM enrollments WHERE course_id = ? AND user_id = ? AND status = \'approved\' LIMIT 1')
                .bind(survey.course_id, studentId).first();
            allowed = !!e;
        }
        if (!allowed && survey.session_id) {
            const e: any = await DB.prepare('SELECT 1 FROM course_session_enrollments WHERE session_id = ? AND user_id = ? AND status IN (\'approved\', \'enrolled\') LIMIT 1')
                .bind(survey.session_id, studentId).first();
            allowed = !!e;
        }
        if (!allowed) return errorResponse(c, '해당 과정 수강생만 참여할 수 있습니다.', 403);

        const existing: any = await DB.prepare('SELECT id FROM survey_responses WHERE survey_id = ? AND student_id = ? LIMIT 1')
            .bind(id, studentId).first();
        if (existing) return errorResponse(c, '이미 참여한 설문입니다.', 400);

        const res = await DB.prepare('INSERT INTO survey_responses (survey_id, student_id) VALUES (?, ?)')
            .bind(id, studentId).run();
        const responseId = res.meta?.last_row_id;
        if (!responseId) return errorResponse(c, '응답 저장에 실패했습니다.', 500);

        for (const a of answers) {
            const qid = a.question_id;
            const val = a.answer_value != null ? String(a.answer_value).trim() : null;
            if (!qid) continue;
            await DB.prepare('INSERT INTO survey_answers (response_id, question_id, answer_value) VALUES (?, ?, ?)')
                .bind(responseId, qid, val || null).run();
        }

        return successResponse(c, { response_id: responseId }, '설문에 참여해 주셔서 감사합니다.');
    } catch (e: any) {
        console.error('Error submitting survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/surveys/:id/start - Set survey status to active (설문진행)
app.post('/:id/start', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') {
            return errorResponse(c, '권한이 없습니다', 403);
        }
        const { DB } = c.env;
        const id = c.req.param('id');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id as course_teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, '설문을 찾을 수 없습니다.');

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher') {
            if (survey.session_id != null) {
                // 회차 설문: 담당 여부는 session_timetable 등으로 확인할 수 있으나, 여기서는 허용
            } else if (effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 설문만 진행할 수 있습니다', 403);
            }
        }

        await DB.prepare('UPDATE surveys SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind('active', id).run();
        return successResponse(c, null, '설문이 진행 중으로 변경되었습니다.');
    } catch (e: any) {
        console.error('Error starting survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/:id/results - Get survey results for analysis
app.get('/:id/results', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.title as course_title, c.teacher_id as course_teacher_id, u.name as teacher_name
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN users u ON s.teacher_id = u.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (survey.session_id) {
            const session: any = await DB.prepare(`
                SELECT cs.session_number, cs.session_name, ac.name as approved_course_name,
                    cs.instructor_name as session_instructor_name, ac.instructor_name as approved_instructor_name
                FROM course_sessions cs
                LEFT JOIN approved_courses ac ON cs.approved_course_id = ac.id
                WHERE cs.id = ?
            `).bind(survey.session_id).first();
            if (session) {
                const courseName = session.approved_course_name || '';
                const sessionNum = session.session_number != null ? session.session_number : 1;
                const sessionNameSuffix = session.session_name ? ` - ${session.session_name}` : '';
                survey.course_title = `${courseName} (${sessionNum}회차)${sessionNameSuffix}`.trim();
                if (!survey.teacher_name) survey.teacher_name = session.session_instructor_name || session.approved_instructor_name;
                survey.subject_title = (survey.type === 'post_lecture' && survey.subject_name) ? survey.subject_name : courseName;
            }
        }
        if (!survey.teacher_name && survey.course_teacher_id) {
            const courseTeacher: any = await DB.prepare('SELECT name FROM users WHERE id = ?').bind(survey.course_teacher_id).first();
            if (courseTeacher) survey.teacher_name = courseTeacher.name;
        }
        if (!survey.subject_title) survey.subject_title = survey.subject_name || survey.course_title || '';

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher' && effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 설문만 조회할 수 있습니다', 403);
        }

        // 응답 통계
        const { results: responses } = await DB.prepare(`
            SELECT sr.*, u.name as student_name
            FROM survey_responses sr
            JOIN users u ON sr.student_id = u.id
            WHERE sr.survey_id = ?
            ORDER BY sr.submitted_at DESC
        `).bind(id).all();

        // 문항별 답변 통계
        const { results: questions } = await DB.prepare(`
            SELECT * FROM survey_questions 
            WHERE survey_id = ? 
            ORDER BY order_index ASC
        `).bind(id).all();

        const questionStats = await Promise.all((questions || []).map(async (q: any) => {
            const { results: answers } = await DB.prepare(`
                SELECT sa.answer_value
                FROM survey_answers sa
                WHERE sa.question_id = ?
            `).bind(q.id).all();

            let stats: any = {
                question_id: q.id,
                question_text: q.question_text,
                question_type: q.question_type,
                total_responses: answers.length,
                average: 0,
                distribution: {}
            };

            if (q.question_type === 'rating') {
                const ratings = answers.map((a: any) => parseFloat(a.answer_value) || 0).filter(r => r > 0);
                if (ratings.length > 0) {
                    stats.average = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
                    const dist = ratings.reduce((acc: any, r: number) => {
                        const k = Math.floor(r);
                        acc[k] = (acc[k] || 0) + 1;
                        return acc;
                    }, {} as Record<number, number>);
                    stats.distribution = { 1: dist[1] || 0, 2: dist[2] || 0, 3: dist[3] || 0, 4: dist[4] || 0, 5: dist[5] || 0 };
                } else {
                    stats.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                }
            } else if (q.question_type === 'choice') {
                const choices = answers.map((a: any) => a.answer_value).filter(c => c);
                stats.distribution = choices.reduce((acc: any, c: string) => {
                    acc[c] = (acc[c] || 0) + 1;
                    return acc;
                }, {});
            } else if (q.question_type === 'text') {
                stats.text_answers = answers.map((a: any) => (a.answer_value || '').trim()).filter(Boolean);
            }

            return stats;
        }));

        // 전체 수강생 수 (회차 설문이면 session_enrollments, 아니면 enrollments)
        let totalTargetCount = 0;
        if (survey.session_id) {
            const t: any = await DB.prepare(`
                SELECT COUNT(*) as total FROM course_session_enrollments
                WHERE session_id = ? AND status IN ('approved', 'enrolled')
            `).bind(survey.session_id).first();
            totalTargetCount = t?.total ?? 0;
        } else if (survey.course_id) {
            const t: any = await DB.prepare(`
                SELECT COUNT(*) as total FROM enrollments
                WHERE course_id = ? AND status = 'approved'
            `).bind(survey.course_id).first();
            totalTargetCount = t?.total ?? 0;
        }

        return successResponse(c, {
            survey,
            stats: {
                total_responses: responses.length,
                total_target: totalTargetCount,
                response_rate: totalTargetCount > 0 ? (responses.length / totalTargetCount * 100).toFixed(1) : 0
            },
            question_stats: questionStats,
            responses: responses || []
        });
    } catch (e: any) {
        console.error('Error fetching survey results:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/surveys - Create survey
app.post('/', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { DB } = c.env;
        const body = await c.req.json();
        const { course_id, session_id, type, title, description, start_date, end_date, status, questions, teacher_id: body_teacher_id, subject_name: body_subject_name } = body;

        if (user.role !== 'admin' && user.role !== 'teacher') {
            return errorResponse(c, '권한이 없습니다', 403);
        }

        // 강사 권한: course_id일 때만 담당 과정 확인 (session은 회차 단위로 생성 허용)
        if (user.role === 'teacher' && course_id) {
            const course: any = await DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정에만 설문을 생성할 수 있습니다', 403);
            }
        }

        // 담당 선생: 관리자는 body.teacher_id 사용, 강사는 로그인 본인으로 고정
        const teacher_id = user.role === 'admin' ? (body_teacher_id != null ? parseInt(String(body_teacher_id), 10) : null) : user.userId;

        const finalQuestions = (type === 'post_lecture' && (!questions || !questions.length))
            ? POST_LECTURE_QUESTIONS.map((q, i) => ({ ...q, order_index: i + 1 }))
            : (questions && Array.isArray(questions) ? questions : []);

        const result = await DB.prepare(`
            INSERT INTO surveys (course_id, session_id, type, title, description, start_date, end_date, status, teacher_id, subject_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            course_id || null,
            session_id || null,
            type || 'survey',
            type === 'post_lecture' ? (title || '강의 후 설문지') : title,
            description || null,
            start_date || null,
            end_date || null,
            status || 'active',
            teacher_id || null,
            type === 'post_lecture' ? (body_subject_name != null ? String(body_subject_name).trim() : null) : null
        ).run();

        const surveyId = result.meta.last_row_id;

        if (finalQuestions.length > 0) {
            const stmt = DB.prepare(`
                INSERT INTO survey_questions (survey_id, question_text, question_type, options, order_index)
                VALUES (?, ?, ?, ?, ?)
            `);

            const batch = finalQuestions.map((q: any, index: number) =>
                stmt.bind(
                    surveyId,
                    q.question_text,
                    q.question_type,
                    q.options ? JSON.stringify(q.options) : null,
                    index + 1
                )
            );

            await DB.batch(batch);
        }

        return successResponse(c, { id: surveyId }, '설문이 생성되었습니다');
    } catch (e: any) {
        console.error('Error creating survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// PUT /api/surveys/:id - Update survey
app.put('/:id', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { DB } = c.env;
        const id = c.req.param('id');
        const body = await c.req.json();
        const { course_id, session_id, type, title, description, start_date, end_date, status, questions, teacher_id: body_teacher_id, subject_name: body_subject_name } = body;

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id as course_teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher') {
            if (survey.session_id != null) { /* 회차 설문 수정 허용 */ }
            else if (effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 설문만 수정할 수 있습니다', 403);
            }
        }

        const final_teacher_id = user.role === 'teacher'
            ? user.userId
            : (body_teacher_id !== undefined ? (body_teacher_id != null ? parseInt(String(body_teacher_id), 10) : null) : survey.teacher_id);

        const updated_course_id = course_id !== undefined ? course_id : survey.course_id;
        const updated_session_id = session_id !== undefined ? session_id : survey.session_id;
        const updated_type = type !== undefined ? type : survey.type;
        const updated_start_date = start_date !== undefined ? start_date : survey.start_date;
        const updated_end_date = end_date !== undefined ? end_date : survey.end_date;
        const updated_status = status !== undefined ? status : survey.status;

        // 제목: post_lecture일 경우의 기본값 처리 포함
        let updated_title = title !== undefined ? title : survey.title;
        if (updated_type === 'post_lecture' && (!updated_title || updated_title.trim() === '')) {
            updated_title = '강의 후 설문지';
        }

        const updated_description = description !== undefined ? description : survey.description;
        const updated_subject_name = body_subject_name !== undefined
            ? (body_subject_name != null ? String(body_subject_name).trim() : null)
            : survey.subject_name;

        await DB.prepare(`
            UPDATE surveys 
            SET course_id = ?, 
                session_id = ?, 
                type = ?, 
                title = ?, 
                description = ?, 
                start_date = ?, 
                end_date = ?, 
                status = ?, 
                teacher_id = ?, 
                subject_name = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            updated_course_id || null,
            updated_session_id || null,
            updated_type,
            updated_title || '제목 없음',
            updated_description || null,
            updated_start_date || null,
            updated_end_date || null,
            updated_status,
            final_teacher_id,
            updated_subject_name || null,
            parseInt(id, 10)
        ).run();

        if (questions && Array.isArray(questions)) {
            await DB.prepare('DELETE FROM survey_questions WHERE survey_id = ?').bind(id).run();

            if (questions.length > 0) {
                const stmt = DB.prepare(`
                    INSERT INTO survey_questions (survey_id, question_text, question_type, options, order_index)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const batch = questions.map((q: any, index: number) =>
                    stmt.bind(
                        id,
                        q.question_text,
                        q.question_type,
                        q.options ? JSON.stringify(q.options) : null,
                        index + 1
                    )
                );

                await DB.batch(batch);
            }
        }

        return successResponse(c, null, '설문이 수정되었습니다');

    } catch (e: any) {
        console.error('Error updating survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/surveys/:id - Delete survey
app.delete('/:id', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { DB } = c.env;
        const id = c.req.param('id');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id as course_teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher' && effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 설문만 삭제할 수 있습니다', 403);
        }

        await DB.batch([
            DB.prepare('DELETE FROM survey_answers WHERE response_id IN (SELECT id FROM survey_responses WHERE survey_id = ?)').bind(id),
            DB.prepare('DELETE FROM survey_responses WHERE survey_id = ?').bind(id),
            DB.prepare('DELETE FROM survey_questions WHERE survey_id = ?').bind(id),
            DB.prepare('DELETE FROM surveys WHERE id = ?').bind(id)
        ]);

        return successResponse(c, null, '설문이 삭제되었습니다');
    } catch (e: any) {
        console.error('Error deleting survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/surveys/:id/close - Close survey (진행종료)
app.post('/:id/close', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') {
            return errorResponse(c, '권한이 없습니다', 403);
        }
        const { DB } = c.env;
        const id = c.req.param('id');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id as course_teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, '설문을 찾을 수 없습니다.');

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher') {
            if (survey.session_id != null) { /* 회차 설문 허용 */ }
            else if (effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 설문만 마감할 수 있습니다', 403);
            }
        }

        await DB.prepare('UPDATE surveys SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind('closed', id).run();
        return successResponse(c, null, '설문이 마감되었습니다.');
    } catch (e: any) {
        console.error('Error closing survey:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/:id/responses/:response_id - Get response details with answers
app.get('/:id/responses/:response_id', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { DB } = c.env;
        const surveyId = c.req.param('id');
        const responseId = c.req.param('response_id');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id as course_teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(surveyId).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        const effectiveTeacherId = survey.teacher_id != null ? survey.teacher_id : survey.course_teacher_id;
        if (user.role === 'teacher' && effectiveTeacherId != null && effectiveTeacherId !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 설문만 조회할 수 있습니다', 403);
        }

        const response: any = await DB.prepare(`
            SELECT sr.*, u.name as student_name
            FROM survey_responses sr
            JOIN users u ON sr.student_id = u.id
            WHERE sr.id = ? AND sr.survey_id = ?
        `).bind(responseId, surveyId).first();

        if (!response) return notFoundResponse(c, 'Response not found');

        const { results: answers } = await DB.prepare(`
            SELECT sa.*, sq.question_text, sq.question_type
            FROM survey_answers sa
            JOIN survey_questions sq ON sa.question_id = sq.id
            WHERE sa.response_id = ?
            ORDER BY sq.order_index ASC
        `).bind(responseId).all();

        return successResponse(c, {
            response,
            answers: answers || []
        });
    } catch (e: any) {
        console.error('Error fetching response:', e);
        return errorResponse(c, e.message, 500);
    }
});

export default app;
