import { Hono } from 'hono';
import type { Bindings } from '../types';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';
import { authMiddleware } from '../middleware/auth';
import { getAll, execute } from '../utils/database';
import { resolveSessionToLmsCourseId } from '../utils/sessionCourseResolution';

const exams = new Hono<{ Bindings: Bindings }>();

// Auth middleware for all exam routes (or specific ones if preferred)
// exams.use('*', authMiddleware);

// GET /api/exams - List all exams (with teacher/student filtering)
exams.get('/', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        let userId: number | null = null;
        let userRole: string | null = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const { verifyToken } = await import('../utils/jwt');
                const token = authHeader.substring(7);
                const payload = await verifyToken(token);
                if (payload) {
                    userId = payload.userId;
                    userRole = payload.role;
                }
            } catch (e) {
                // Token invalid or missing
            }
        }

        let query = `
            SELECT e.*, c.title as course_title, c.teacher_id
        `;
        if (userRole === 'student' && userId) {
            query += ` , (SELECT 1 FROM exam_submissions WHERE exam_id = e.id AND student_id = ? LIMIT 1) as has_submitted`;
        }
        query += `
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            WHERE 1=1
        `;
        const params: any[] = [];

        if (userRole === 'teacher' && userId) {
            query += ' AND c.teacher_id = ?';
            params.push(userId);
        } else if (userRole === 'student' && userId) {
            // 학생은 본인이 수강 승인된 과정의 시험만 볼 수 있음
            query += ` AND e.course_id IN (
                SELECT course_id FROM enrollments WHERE user_id = ? AND status = 'approved'
                UNION
                SELECT cs.lms_course_id 
                FROM course_session_enrollments cse
                JOIN course_sessions cs ON cse.session_id = cs.id
                WHERE cse.user_id = ? AND cse.status IN ('approved', 'enrolled') AND cs.lms_course_id IS NOT NULL
            )`;
            params.push(userId, userId);
        }

        query += ' ORDER BY e.created_at DESC';

        const bindParams = userRole === 'student' && userId ? [userId, ...params] : params;
        const { results } = await c.env.DB.prepare(query).bind(...bindParams).all();
        return successResponse(c, results || []);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/exams/results - Get all exam results (Admin)
// GET /api/exams/results - Get all exam results (Admin) with filtering
exams.get('/results', async (c) => {
    try {
        const queryTerm = c.req.query('query') || '';
        const courseId = c.req.query('course_id');

        let sql = `
            SELECT 
                es.id, es.total_score as score, es.submitted_at,
                u.name as student_name, u.email as student_email,
                e.title as exam_title, es.total_score,
                (SELECT SUM(points) FROM exam_questions WHERE exam_id = e.id) as total_points,
                c.title as course_title
            FROM exam_submissions es
            JOIN users u ON es.student_id = u.id
            JOIN exams e ON es.exam_id = e.id
            LEFT JOIN courses c ON e.course_id = c.id
            WHERE 1=1
        `;

        const params: any[] = [];

        if (queryTerm) {
            sql += ` AND (u.name LIKE ? OR e.title LIKE ?)`;
            params.push(`%${queryTerm}%`, `%${queryTerm}%`);
        }

        if (courseId) {
            sql += ` AND e.course_id = ?`;
            params.push(courseId);
        }

        sql += ` ORDER BY es.submitted_at DESC LIMIT 50`; // Pagination can be added later

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/exams/my-results - Get logged-in student's results
exams.get('/my-results', async (c) => {
    try {
        const studentId = c.req.query('student_id');
        if (!studentId) return errorResponse(c, 'Student ID required', 400);

        const { results } = await c.env.DB.prepare(`
            SELECT 
                es.id, es.total_score as score, es.submitted_at,
                e.title as exam_title,
                c.title as course_title
            FROM exam_submissions es
            JOIN exams e ON es.exam_id = e.id
            LEFT JOIN courses c ON e.course_id = c.id
            WHERE es.student_id = ?
            ORDER BY es.submitted_at DESC
        `).bind(studentId).all();

        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/exams/student/exams - List exams for a student based on course
exams.get('/student/exams', async (c) => {
    try {
        const courseId = c.req.query('course_id');
        // TODO: 현재 로그인한 학생 ID 가져오기 (미들웨어에서 c.get('user').id)
        // 여기서는 임시로 4번 학생(seed.sql의 student1)이라고 가정
        let studentId = 4;

        // 만약 쿼리로 student_id가 들어오면 그것을 우선 사용 (테스트용)
        const queryStudentId = c.req.query('student_id');
        if (queryStudentId) studentId = parseInt(queryStudentId);

        if (!courseId) {
            return errorResponse(c, 'course_id 파라미터가 필요합니다', 400);
        }

        const query = `
          SELECT 
            e.*,
            s.status as submission_status,
            s.total_score
          FROM exams e
          LEFT JOIN exam_submissions s ON e.id = s.exam_id AND s.student_id = ?
          WHERE e.course_id = ? AND e.is_active = 1
          ORDER BY e.start_time DESC
        `;

        const exams = await getAll<any>(c.env.DB, query, [studentId, courseId]);
        return successResponse(c, exams);
    } catch (error: any) {
        console.error('Get student exams error:', error);
        return errorResponse(c, '시험 목록 조회 중 오류가 발생했습니다', 500);
    }
});

// GET /api/exams/student/pre-assessment-combined?course_id= 또는 ?session_id= - 과정별 사전평가(연습) 통합 조회
exams.get('/student/pre-assessment-combined', async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        const sessionIdParam = c.req.query('session_id');
        if (!courseIdParam && !sessionIdParam) return errorResponse(c, 'course_id 또는 session_id가 필요합니다', 400);

        let userId: number | null = null;
        const authHeader = c.req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const { verifyToken } = await import('../utils/jwt');
                const payload = await verifyToken(authHeader.substring(7));
                if (payload) userId = payload.userId;
            } catch (_) {}
        }
        if (!userId) return errorResponse(c, '로그인이 필요합니다', 401);

        let courseId: number;
        if (sessionIdParam) {
            const sessionId = parseInt(String(sessionIdParam), 10);
            if (Number.isNaN(sessionId)) return errorResponse(c, '유효한 session_id가 아닙니다', 400);
            const row: any = await c.env.DB.prepare(`
                SELECT cs.lms_course_id AS course_id FROM course_sessions cs
                INNER JOIN course_session_enrollments cse ON cse.session_id = cs.id AND cse.user_id = ? AND cse.status IN ('approved', 'enrolled')
                WHERE cs.id = ?
            `).bind(userId, sessionId).first();
            if (!row || row.course_id == null) return errorResponse(c, '해당 회차에 대한 수강 권한이 없거나 회차에 연결된 과정이 없습니다', 403);
            courseId = row.course_id;
        } else {
            courseId = parseInt(String(courseIdParam), 10);
            if (Number.isNaN(courseId)) return errorResponse(c, '유효한 course_id가 아닙니다', 400);
        }

        const sqlExams = `
            SELECT e.id, e.title, e.time_limit_minutes, e.course_id
            FROM exams e
            WHERE e.course_id = ? AND e.type = 'practice' AND e.is_active = 1
            AND e.course_id IN (
                SELECT course_id FROM enrollments WHERE user_id = ? AND status = 'approved'
                UNION
                SELECT cs.lms_course_id FROM course_session_enrollments cse
                JOIN course_sessions cs ON cse.session_id = cs.id
                WHERE cse.user_id = ? AND cse.status IN ('approved', 'enrolled') AND cs.lms_course_id IS NOT NULL
            )
            ORDER BY e.created_at ASC
        `;
        let { results: exams } = await c.env.DB.prepare(sqlExams).bind(courseId, userId, userId).all() as { results: { id: number; title: string; time_limit_minutes?: number; course_id: number }[] };
        // course_id로 시험이 없으면 파라미터를 회차(session) ID로 해석해 LMS 과정 ID로 재조회
        if ((!exams || exams.length === 0) && courseIdParam && !sessionIdParam) {
            const resolved = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
            if (resolved != null && resolved !== courseId) {
                courseId = resolved;
                const next = await c.env.DB.prepare(sqlExams).bind(courseId, userId, userId).all() as { results: { id: number; title: string; time_limit_minutes?: number; course_id: number }[] };
                exams = next.results || [];
            }
        }

        const courseRow: any = await c.env.DB.prepare('SELECT title FROM courses WHERE id = ?').bind(courseId).first();
        const course_title = courseRow?.title || '';

        const out: { id: number; title: string; time_limit_minutes?: number; questions: any[] }[] = [];
        for (const exam of exams || []) {
            const { results: questions } = await c.env.DB.prepare(`
                SELECT id, question_text, question_type, options, points, order_index
                FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC
            `).bind(exam.id).all() as { results: any[] };
            const parsed = (questions || []).map((q: any) => {
                let options: any[] = [];
                if (q.options) {
                    try {
                        options = typeof q.options === 'string' ? JSON.parse(q.options) : (Array.isArray(q.options) ? q.options : []);
                    } catch (_) { options = []; }
                }
                return { ...q, options };
            });
            out.push({
                id: exam.id,
                title: exam.title,
                time_limit_minutes: exam.time_limit_minutes,
                questions: parsed
            });
        }
        return successResponse(c, { exams: out, course_title });
    } catch (e: any) {
        console.error('GET /api/exams/student/pre-assessment-combined error:', e);
        return errorResponse(c, e.message || '서버 오류', 500);
    }
});

// GET /api/exams/:id - Get exam details with questions
exams.get('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');
    try {
        const user = c.get('user');
        const exam: any = await c.env.DB.prepare(`
            SELECT e.*, c.teacher_id 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            WHERE e.id = ?
        `).bind(id).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

        // 강사는 본인이 담당하는 과정의 시험만 조회 가능
        if (user.role === 'teacher' && exam.teacher_id !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 시험만 조회할 수 있습니다', 403);
        }

        // exam_questions 테이블 사용, order_index 사용
        const { results: questions } = await c.env.DB.prepare('SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options as string) : []
        }));

        return successResponse(c, { ...exam, questions: parsedQuestions });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/exams/:id/status - Get exam stats and student submission status
exams.get('/:id/status', authMiddleware, async (c) => {
    const examId = c.req.param('id');
    try {
        const user = c.get('user');

        // 1. 시험 정보 및 과정 ID 조회
        const exam: any = await c.env.DB.prepare(`
            SELECT e.*, c.teacher_id 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            WHERE e.id = ?
        `).bind(examId).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

        // 강사는 본인이 담당하는 과정의 시험만 조회 가능
        if (user.role === 'teacher' && exam.teacher_id !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 시험만 조회할 수 있습니다', 403);
        }

        // 2. 전체 수강생 목록 조회 (해당 과정의 approved된 수강생)
        const { results: students } = await c.env.DB.prepare(`
            SELECT u.id, u.name, u.email, u.phone 
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.course_id = ? AND e.status = 'approved'
        `).bind(exam.course_id).all();

        // 3. 제출 내역 조회
        const { results: submissions } = await c.env.DB.prepare(`
            SELECT id, student_id, total_score, submitted_at, status
            FROM exam_submissions
            WHERE exam_id = ?
        `).bind(examId).all();

        // 4. 데이터 병합
        const studentStatus = students.map((std: any) => {
            const sub = submissions.find((s: any) => s.student_id === std.id);
            return {
                ...std,
                has_submitted: !!sub,
                submission_id: sub ? sub.id : null,
                score: sub ? sub.total_score : null,
                submitted_at: sub ? sub.submitted_at : null,
                status: sub ? sub.status : 'missing'
            };
        });

        // 통계 계산
        const submittedCount = submissions.length;
        const totalStudents = students.length;
        const averageScore = submittedCount > 0
            ? submissions.reduce((acc: number, curr: any) => acc + (curr.total_score || 0), 0) / submittedCount
            : 0;

        return successResponse(c, {
            exam,
            stats: {
                total_students: totalStudents,
                submitted_count: submittedCount,
                average_score: Math.round(averageScore * 10) / 10 // 소수점 1자리
            },
            students: studentStatus
        });

    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/exams - Create new exam
exams.post('/', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const { title, course_id, description, time_limit, questions } = body;

        // 강사는 본인이 담당하는 과정에만 시험 생성 가능
        if (user.role === 'teacher' && course_id) {
            const course: any = await c.env.DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정에만 시험을 생성할 수 있습니다', 403);
            }
        }

        // exams 테이블 사용, time_limit_minutes 사용
        const result = await c.env.DB.prepare(`
            INSERT INTO exams (course_id, title, description, time_limit_minutes, is_active)
            VALUES (?, ?, ?, ?, 1)
        `).bind(course_id, title, description, time_limit).run();

        const examId = result.meta.last_row_id;

        if (questions && questions.length > 0) {
            // exam_questions 테이블 사용, order_index 사용
            const stmt = c.env.DB.prepare(`
                INSERT INTO exam_questions (exam_id, question_text, question_type, options, correct_answer, points, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            const batch = questions.map((q: any, index: number) =>
                stmt.bind(examId, q.question_text, q.question_type, JSON.stringify(q.options), q.correct_answer, q.points, index + 1)
            );

            await c.env.DB.batch(batch);
        }

        return c.json({ success: true, id: examId });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// DELETE /api/exams/:id
exams.delete('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');
    try {
        const user = c.get('user');

        // 강사는 본인이 담당하는 과정의 시험만 삭제 가능
        if (user.role === 'teacher') {
            const exam: any = await c.env.DB.prepare(`
                SELECT e.course_id, c.teacher_id 
                FROM exams e 
                LEFT JOIN courses c ON e.course_id = c.id 
                WHERE e.id = ?
            `).bind(id).first();
            if (!exam || exam.teacher_id !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 시험만 삭제할 수 있습니다', 403);
            }
        }

        await c.env.DB.batch([
            c.env.DB.prepare('DELETE FROM exam_questions WHERE exam_id = ?').bind(id),
            c.env.DB.prepare('DELETE FROM exams WHERE id = ?').bind(id)
        ]);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// PUT /api/exams/:id - Update exam
exams.put('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const { title, course_id, description, time_limit, is_active, questions } = body;

        // 강사는 본인이 담당하는 과정의 시험만 수정 가능
        if (user.role === 'teacher') {
            const exam: any = await c.env.DB.prepare(`
                SELECT e.course_id, c.teacher_id 
                FROM exams e 
                LEFT JOIN courses c ON e.course_id = c.id 
                WHERE e.id = ?
            `).bind(id).first();
            if (!exam || exam.teacher_id !== user.userId) {
                return errorResponse(c, '본인이 담당하는 과정의 시험만 수정할 수 있습니다', 403);
            }
            // course_id 변경 시에도 본인 담당 과정인지 확인
            if (course_id && course_id !== exam.course_id) {
                const newCourse: any = await c.env.DB.prepare('SELECT teacher_id FROM courses WHERE id = ?').bind(course_id).first();
                if (!newCourse || newCourse.teacher_id !== user.userId) {
                    return errorResponse(c, '본인이 담당하는 과정으로만 변경할 수 있습니다', 403);
                }
            }
        }

        // exams 테이블 사용, time_limit_minutes 사용
        await c.env.DB.prepare(`
            UPDATE exams 
            SET title = ?, course_id = ?, description = ?, time_limit_minutes = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(title, course_id, description, time_limit, is_active, id).run();

        // Update Questions if provided
        if (questions && Array.isArray(questions)) {
            // Delete existing questions
            await c.env.DB.prepare('DELETE FROM exam_questions WHERE exam_id = ?').bind(id).run();

            // Insert new questions
            if (questions.length > 0) {
                const stmt = c.env.DB.prepare(`
                    INSERT INTO exam_questions (exam_id, question_text, question_type, options, correct_answer, points, order_index)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                const batch = questions.map((q: any, index: number) =>
                    stmt.bind(id, q.question_text, q.question_type, JSON.stringify(q.options), q.correct_answer, q.points, index + 1)
                );

                await c.env.DB.batch(batch);
            }
        }

        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// GET /api/exams/:id/take - Get exam for taking (Student view)
exams.get('/:id/take', async (c) => {
    const id = c.req.param('id');
    try {
        const exam = await c.env.DB.prepare('SELECT * FROM exams WHERE id = ?').bind(id).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

        // 정답을 제외하고 문제 목록 반환
        const { results: questions } = await c.env.DB.prepare('SELECT id, question_text, question_type, options, points, order_index FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options as string) : []
        }));

        // Frontend expects { exam, questions } structure
        return successResponse(c, { exam, questions: parsedQuestions });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/exams/:id/submit - Submit exam answers
exams.post('/:id/submit', async (c) => {
    const examId = c.req.param('id');
    try {
        const body = await c.req.json();
        // student_id는 authMiddleware를 통해 c.get('user').id로 가져오는게 정석이나
        // 현재 미들웨어 설정이 확실치 않으므로 body에서 받거나 없으면 테스트 계정(4) 사용
        const student_id = body.student_id;
        // 실제 운영시에는 아래와 같이 변경 권장:
        // const user = c.get('user');
        // if (!user) return errorResponse(c, 'Unauthorized', 401);
        // const student_id = user.id;

        const { answers } = body; // answers: { question_id: answer_value }

        if (!student_id && !body.student_id) {
            // 임시 Fallback for development if auth not fully wired
            // console.warn('No student_id provided, using test ID 4');
        }
        const effectiveStudentId = student_id || 4; // 임시 기본값

        // Get correct answers and types
        const { results: questions } = await c.env.DB.prepare('SELECT id, correct_answer, points, question_type FROM exam_questions WHERE exam_id = ?').bind(examId).all();

        let score = 0;
        let totalPoints = 0;

        questions.forEach((q: any) => {
            totalPoints += q.points;
            const studentAnswer = answers[q.id];

            if (q.question_type === 'multiple_choice') {
                if (studentAnswer == q.correct_answer) {
                    score += q.points;
                }
            } else if (q.question_type === 'short_answer') {
                // 단답형: 공백 제거 및 대소문자 무시 비교
                if (studentAnswer && q.correct_answer &&
                    studentAnswer.toString().trim().toLowerCase() === q.correct_answer.toString().trim().toLowerCase()) {
                    score += q.points;
                }
            } else if (q.question_type === 'essay') {
                // 서술형: 자동 채점 불가 (0점 처리, 추후 관리자 채점 필요)
            }
        });

        // Save submission to exam_submissions
        const submissionResult = await c.env.DB.prepare(`
            INSERT INTO exam_submissions (exam_id, student_id, total_score, submitted_at, status)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'submitted')
        `).bind(examId, effectiveStudentId, score).run();

        const submissionId = submissionResult.meta.last_row_id;

        // Save individual answers to exam_answers
        const answerStmt = c.env.DB.prepare(`
            INSERT INTO exam_answers (submission_id, question_id, student_answer, is_correct, score_awarded)
            VALUES (?, ?, ?, ?, ?)
        `);

        // Batch insert answers (using loop instead of batch for D1 simple compatibility with logic)
        // Note: D1 batch supports PreparedStatement arrays.
        const answerBatch = questions.map((q: any) => {
            const studentAnswer = answers[q.id];
            let isCorrect = 0;
            let scoreAwarded = 0;

            if (q.question_type === 'multiple_choice') {
                if (studentAnswer == q.correct_answer) {
                    isCorrect = 1;
                    scoreAwarded = q.points;
                }
            } else if (q.question_type === 'short_answer') {
                if (studentAnswer && q.correct_answer &&
                    studentAnswer.toString().trim().toLowerCase() === q.correct_answer.toString().trim().toLowerCase()) {
                    isCorrect = 1;
                    scoreAwarded = q.points;
                }
            }

            return answerStmt.bind(submissionId, q.id, studentAnswer, isCorrect, scoreAwarded);
        });

        await c.env.DB.batch(answerBatch);

        return successResponse(c, {
            score,
            totalPoints,
            resultId: submissionId
        }, '시험이 제출되었습니다');

    } catch (e: any) {
        console.error('Submit error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/exams/:id/grade - Grade essay questions manually (Teacher)
exams.post('/:id/grade', authMiddleware, async (c) => {
    const examId = c.req.param('id');
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const { submission_id, question_scores } = body; // question_scores: { question_id: score }

        // 시험 및 과정 확인
        const exam: any = await c.env.DB.prepare(`
            SELECT e.*, c.teacher_id 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            WHERE e.id = ?
        `).bind(examId).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

        // 강사는 본인이 담당하는 과정의 시험만 채점 가능
        if (user.role === 'teacher' && exam.teacher_id !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 시험만 채점할 수 있습니다', 403);
        }

        // 제출 내역 확인
        const submission: any = await c.env.DB.prepare('SELECT * FROM exam_submissions WHERE id = ? AND exam_id = ?').bind(submission_id, examId).first();
        if (!submission) return notFoundResponse(c, 'Submission not found');

        // 각 문제별 점수 업데이트 및 총점 재계산
        let newTotalScore = 0;
        const updatePromises = Object.entries(question_scores || {}).map(async ([questionId, score]: [string, any]) => {
            const qId = parseInt(questionId);
            const points = parseFloat(score) || 0;

            // 문제 정보 조회
            const question: any = await c.env.DB.prepare('SELECT points FROM exam_questions WHERE id = ? AND exam_id = ?').bind(qId, examId).first();
            if (!question) return;

            const maxPoints = question.points || 0;
            const awardedPoints = Math.min(Math.max(0, points), maxPoints); // 0 ~ maxPoints 사이로 제한

            // exam_answers 업데이트
            await c.env.DB.prepare(`
                UPDATE exam_answers 
                SET score_awarded = ?, is_correct = ?
                WHERE submission_id = ? AND question_id = ?
            `).bind(awardedPoints, awardedPoints === maxPoints ? 1 : 0, submission_id, qId).run();

            newTotalScore += awardedPoints;
        });

        await Promise.all(updatePromises);

        // 객관식/단답형 점수도 포함하여 총점 계산
        const { results: allAnswers } = await c.env.DB.prepare(`
            SELECT ea.score_awarded 
            FROM exam_answers ea
            WHERE ea.submission_id = ?
        `).bind(submission_id).all();

        const recalculatedTotal = allAnswers.reduce((sum: number, a: any) => sum + (a.score_awarded || 0), 0);

        // exam_submissions 총점 업데이트
        await c.env.DB.prepare(`
            UPDATE exam_submissions 
            SET total_score = ?, status = 'graded', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(recalculatedTotal, submission_id).run();

        return successResponse(c, {
            submission_id,
            total_score: recalculatedTotal
        }, '채점이 완료되었습니다');
    } catch (e: any) {
        console.error('Grade exam error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/exams/:id/my-result - Get logged-in student's submission result for this exam
exams.get('/:id/my-result', authMiddleware, async (c) => {
    const examId = c.req.param('id');
    try {
        const user = c.get('user');
        if (user.role !== 'student') {
            return errorResponse(c, '학생만 조회할 수 있습니다', 403);
        }
        const submission: any = await c.env.DB.prepare(`
            SELECT es.id, es.total_score, es.submitted_at, es.status
            FROM exam_submissions es
            WHERE es.exam_id = ? AND es.student_id = ?
        `).bind(examId, user.userId).first();
        if (!submission) {
            return notFoundResponse(c, '제출 내역이 없습니다');
        }
        const exam: any = await c.env.DB.prepare(`
            SELECT e.id, e.title, e.total_points
            FROM exams e WHERE e.id = ?
        `).bind(examId).first();
        return successResponse(c, {
            submission: { id: submission.id, total_score: submission.total_score, submitted_at: submission.submitted_at, status: submission.status },
            exam: exam ? { title: exam.title, total_points: exam.total_points } : null,
        });
    } catch (e: any) {
        return errorResponse(c, e?.message || '조회 실패', 500);
    }
});

// GET /api/exams/:id/submissions/:submission_id - Get submission details with answers for grading
exams.get('/:id/submissions/:submission_id', authMiddleware, async (c) => {
    const examId = c.req.param('id');
    const submissionId = c.req.param('submission_id');
    try {
        const user = c.get('user');

        // 시험 및 과정 확인
        const exam: any = await c.env.DB.prepare(`
            SELECT e.*, c.teacher_id 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            WHERE e.id = ?
        `).bind(examId).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

        // 강사는 본인이 담당하는 과정의 시험만 조회 가능
        if (user.role === 'teacher' && exam.teacher_id !== user.userId) {
            return errorResponse(c, '본인이 담당하는 과정의 시험만 조회할 수 있습니다', 403);
        }

        // 제출 내역 및 학생 정보
        const submission: any = await c.env.DB.prepare(`
            SELECT es.*, u.name as student_name, u.email as student_email
            FROM exam_submissions es
            JOIN users u ON es.student_id = u.id
            WHERE es.id = ? AND es.exam_id = ?
        `).bind(submissionId, examId).first();
        if (!submission) return notFoundResponse(c, 'Submission not found');

        // 문제 및 답안 조회
        const { results: questions } = await c.env.DB.prepare(`
            SELECT 
                q.id, q.question_text, q.question_type, q.options, q.correct_answer, q.points, q.order_index,
                ea.student_answer, ea.is_correct, ea.score_awarded
            FROM exam_questions q
            LEFT JOIN exam_answers ea ON q.id = ea.question_id AND ea.submission_id = ?
            WHERE q.exam_id = ?
            ORDER BY q.order_index ASC
        `).bind(submissionId, examId).all();

        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options as string) : [],
            student_answer: q.student_answer || '',
            is_correct: q.is_correct === 1,
            score_awarded: q.score_awarded || 0
        }));

        return successResponse(c, {
            submission,
            questions: parsedQuestions
        });
    } catch (e: any) {
        console.error('Get submission error:', e);
        return errorResponse(c, e.message, 500);
    }
});

export default exams;
