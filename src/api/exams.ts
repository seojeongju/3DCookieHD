import { Hono } from 'hono';
import type { Bindings } from '../types';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';
import { authMiddleware } from '../middleware/auth';
import { getAll, execute } from '../utils/database';

const exams = new Hono<{ Bindings: Bindings }>();

// Auth middleware for all exam routes (or specific ones if preferred)
// exams.use('*', authMiddleware);

// GET /api/exams - List all exams
exams.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT e.*, c.title as course_title 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            ORDER BY e.created_at DESC
        `).all();
        return successResponse(c, results); // Wrapped in successResponse
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

// GET /api/exams/:id - Get exam details with questions (Admin view)
exams.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const exam = await c.env.DB.prepare('SELECT * FROM exams WHERE id = ?').bind(id).first();
        if (!exam) return notFoundResponse(c, 'Exam not found');

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

// POST /api/exams - Create new exam
exams.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { title, course_id, description, time_limit, questions } = body;

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
exams.delete('/:id', async (c) => {
    const id = c.req.param('id');
    try {
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
exams.put('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const { title, course_id, description, time_limit, is_active, questions } = body;

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

export default exams;
