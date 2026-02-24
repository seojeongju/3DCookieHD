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
                (SELECT COUNT(*) FROM survey_responses sr WHERE sr.survey_id = s.id) as response_count
            FROM surveys s
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
            created_at: s.created_at
        }));

        return successResponse(c, list);
    } catch (e: any) {
        console.error('Error listing surveys:', e);
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
            created_at: s.created_at
        }));

        return successResponse(c, surveys);
    } catch (e: any) {
        console.error('Error fetching teacher surveys:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/surveys/my-pending (For Students)
app.get('/my-pending', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'student') {
            return errorResponse(c, '학생 권한이 필요합니다', 403);
        }

        const { DB } = c.env;
        const studentId = user.userId;

        // 학생이 수강 중인 과정의 활성 설문 조회
        const { results } = await DB.prepare(`
            SELECT 
                s.*,
                c.title as course_title,
                CASE WHEN sr.id IS NOT NULL THEN 'completed' ELSE 'pending' END as response_status
            FROM surveys s
            INNER JOIN enrollments e ON s.course_id = e.course_id
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN survey_responses sr ON s.id = sr.survey_id AND sr.student_id = ?
            WHERE e.user_id = ? 
                AND e.status = 'approved'
                AND s.status = 'active'
                AND (s.start_date IS NULL OR s.start_date <= date('now'))
                AND (s.end_date IS NULL OR s.end_date >= date('now'))
            ORDER BY s.created_at DESC
        `).bind(studentId, studentId).all();

        return successResponse(c, results || []);
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

        const survey: any = await DB.prepare(`
            SELECT s.*, c.title as course_title, c.teacher_id, u.name as teacher_name
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE s.id = ?
        `).bind(id).first();

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
                survey.teacher_name = session.session_instructor_name || session.approved_instructor_name || survey.teacher_name;
                survey.subject_title = courseName;
            }
        }

        if (user.role === 'teacher') {
            if (survey.session_id) {
                // 회차(session) 설문: 회차 담당 여부는 별도 컬럼이 없을 수 있어, 조회는 허용
            } else if (survey.teacher_id != null && survey.teacher_id !== user.userId) {
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

// GET /api/surveys/:id/results - Get survey results for analysis
app.get('/:id/results', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const id = c.req.param('id');
        const user = c.get('user');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.title as course_title, c.teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (user.role === 'teacher' && survey.teacher_id !== user.userId) {
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
                    stats.distribution = ratings.reduce((acc: any, r: number) => {
                        acc[r] = (acc[r] || 0) + 1;
                        return acc;
                    }, {});
                }
            } else if (q.question_type === 'choice') {
                const choices = answers.map((a: any) => a.answer_value).filter(c => c);
                stats.distribution = choices.reduce((acc: any, c: string) => {
                    acc[c] = (acc[c] || 0) + 1;
                    return acc;
                }, {});
            }

            return stats;
        }));

        // 전체 수강생 수
        const totalTarget: any = await DB.prepare(`
            SELECT COUNT(*) as total
            FROM enrollments
            WHERE course_id = ? AND status = 'approved'
        `).bind(survey.course_id).first();

        return successResponse(c, {
            survey,
            stats: {
                total_responses: responses.length,
                total_target: totalTarget?.total || 0,
                response_rate: totalTarget?.total > 0 ? (responses.length / totalTarget.total * 100).toFixed(1) : 0
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
        const { course_id, session_id, type, title, description, start_date, end_date, status, questions } = body;

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

        const finalQuestions = (type === 'post_lecture' && (!questions || !questions.length))
            ? POST_LECTURE_QUESTIONS.map((q, i) => ({ ...q, order_index: i + 1 }))
            : (questions && Array.isArray(questions) ? questions : []);

        const result = await DB.prepare(`
            INSERT INTO surveys (course_id, session_id, type, title, description, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            course_id || null,
            session_id || null,
            type || 'survey',
            type === 'post_lecture' ? (title || '강의 후 설문지') : title,
            description || null,
            start_date || null,
            end_date || null,
            status || 'active'
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
        const { course_id, session_id, type, title, description, start_date, end_date, status, questions } = body;

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (user.role === 'teacher') {
            if (survey.session_id != null) { /* 회차 설문 수정 허용 */ }
            else if (survey.teacher_id != null && survey.teacher_id !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 설문만 수정할 수 있습니다', 403);
            }
        }

        await DB.prepare(`
            UPDATE surveys 
            SET course_id = ?, session_id = ?, type = ?, title = ?, description = ?, start_date = ?, end_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(course_id || null, session_id != null ? session_id : survey.session_id, type, title, description || null, start_date || null, end_date || null, status || 'active', id).run();

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
            SELECT s.*, c.teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (user.role === 'teacher' && survey.teacher_id !== user.userId) {
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

// POST /api/surveys/:id/close - Close survey
app.post('/:id/close', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { DB } = c.env;
        const id = c.req.param('id');

        const survey: any = await DB.prepare(`
            SELECT s.*, c.teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(id).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (user.role === 'teacher' && survey.teacher_id !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 설문만 마감할 수 있습니다', 403);
        }

        await DB.prepare('UPDATE surveys SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind('closed', id).run();

        return successResponse(c, null, '설문이 마감되었습니다');
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
            SELECT s.*, c.teacher_id
            FROM surveys s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `).bind(surveyId).first();

        if (!survey) return notFoundResponse(c, 'Survey not found');

        if (user.role === 'teacher' && survey.teacher_id !== user.userId) {
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
