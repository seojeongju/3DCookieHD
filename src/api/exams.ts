import { Hono } from 'hono';
import type { Bindings } from '../types';

const exams = new Hono<{ Bindings: Bindings }>();

// GET /api/exams - List all exams
exams.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT e.*, c.title as course_title 
            FROM exams e 
            LEFT JOIN courses c ON e.course_id = c.id 
            ORDER BY e.created_at DESC
        `).all();
        return c.json(results);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/exams/results - Get all exam results (Admin)
exams.get('/results', async (c) => {
    try {
        // exam_submissions 테이블 사용
        const { results } = await c.env.DB.prepare(`
            SELECT 
                es.id, es.total_score as score, es.submitted_at,
                u.name as student_name, u.email as student_email,
                e.title as exam_title,
                c.title as course_title
            FROM exam_submissions es
            JOIN users u ON es.student_id = u.id
            JOIN exams e ON es.exam_id = e.id
            LEFT JOIN courses c ON e.course_id = c.id
            ORDER BY es.submitted_at DESC
        `).all();
        return c.json(results);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/exams/my-results - Get logged-in student's results
exams.get('/my-results', async (c) => {
    try {
        const studentId = c.req.query('student_id');
        if (!studentId) return c.json({ error: 'Student ID required' }, 400);

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

        return c.json(results);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/exams/:id - Get exam details with questions
exams.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const exam = await c.env.DB.prepare('SELECT * FROM exams WHERE id = ?').bind(id).first();
        if (!exam) return c.json({ error: 'Exam not found' }, 404);

        // exam_questions 테이블 사용, order_index 사용
        const { results: questions } = await c.env.DB.prepare('SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options as string) : []
        }));

        return c.json({ ...exam, questions: parsedQuestions });
    } catch (e) {
        return c.json({ error: e.message }, 500);
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
    } catch (e) {
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
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// PUT /api/exams/:id - Update exam
exams.put('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const { title, course_id, description, time_limit, questions } = body;

        // exams 테이블 사용, time_limit_minutes 사용
        await c.env.DB.prepare(`
            UPDATE exams 
            SET title = ?, course_id = ?, description = ?, time_limit_minutes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(title, course_id, description, time_limit, id).run();

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
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// GET /api/exams/:id/take - Get exam for taking (hide correct answers)
exams.get('/:id/take', async (c) => {
    const id = c.req.param('id');
    try {
        const exam = await c.env.DB.prepare('SELECT * FROM exams WHERE id = ?').bind(id).first();
        if (!exam) return c.json({ error: 'Exam not found' }, 404);

        const { results: questions } = await c.env.DB.prepare('SELECT id, question_text, question_type, options, points, order_index FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: q.options ? JSON.parse(q.options as string) : []
        }));

        return c.json({ ...exam, questions: parsedQuestions });
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// POST /api/exams/:id/submit - Submit exam answers
exams.post('/:id/submit', async (c) => {
    const examId = c.req.param('id');
    try {
        const body = await c.req.json();
        const { student_id, answers } = body; // answers: { question_id: answer_value }

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
        `).bind(examId, student_id, score).run();

        const submissionId = submissionResult.meta.last_row_id;

        // Save individual answers to exam_answers
        // exam_answers: id, submission_id, question_id, student_answer, is_correct, score_awarded
        const answerStmt = c.env.DB.prepare(`
            INSERT INTO exam_answers (submission_id, question_id, student_answer, is_correct, score_awarded)
            VALUES (?, ?, ?, ?, ?)
        `);

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

        return c.json({
            success: true,
            score,
            totalPoints,
            resultId: submissionId
        });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default exams;
