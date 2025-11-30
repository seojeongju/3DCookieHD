import { Hono } from 'hono';
import type { Bindings } from '../types';

const exams = new Hono<{ Bindings: Bindings }>();

// GET /api/exams - List all exams
exams.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT e.*, c.title as course_title 
            FROM Exams e 
            LEFT JOIN Courses c ON e.course_id = c.id 
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
        const { results } = await c.env.DB.prepare(`
            SELECT 
                er.id, er.score, er.total_points, er.submitted_at,
                u.name as student_name, u.email as student_email,
                e.title as exam_title,
                c.title as course_title
            FROM ExamResults er
            JOIN Users u ON er.student_id = u.id
            JOIN Exams e ON er.exam_id = e.id
            LEFT JOIN Courses c ON e.course_id = c.id
            ORDER BY er.submitted_at DESC
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
                er.id, er.score, er.total_points, er.submitted_at,
                e.title as exam_title,
                c.title as course_title
            FROM ExamResults er
            JOIN Exams e ON er.exam_id = e.id
            LEFT JOIN Courses c ON e.course_id = c.id
            WHERE er.student_id = ?
            ORDER BY er.submitted_at DESC
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
        const exam = await c.env.DB.prepare('SELECT * FROM Exams WHERE id = ?').bind(id).first();
        if (!exam) return c.json({ error: 'Exam not found' }, 404);

        const { results: questions } = await c.env.DB.prepare('SELECT * FROM Questions WHERE exam_id = ? ORDER BY order_num ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: JSON.parse(q.options as string)
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

        const result = await c.env.DB.prepare(`
            INSERT INTO Exams (course_id, title, description, time_limit)
            VALUES (?, ?, ?, ?)
        `).bind(course_id, title, description, time_limit).run();

        const examId = result.meta.last_row_id;

        if (questions && questions.length > 0) {
            const stmt = c.env.DB.prepare(`
                INSERT INTO Questions (exam_id, question_text, question_type, options, correct_answer, points, order_num)
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
            c.env.DB.prepare('DELETE FROM Questions WHERE exam_id = ?').bind(id),
            c.env.DB.prepare('DELETE FROM Exams WHERE id = ?').bind(id)
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

        // Update Exam
        await c.env.DB.prepare(`
            UPDATE Exams 
            SET title = ?, course_id = ?, description = ?, time_limit = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(title, course_id, description, time_limit, id).run();

        // Update Questions if provided
        if (questions && Array.isArray(questions)) {
            // Delete existing questions
            await c.env.DB.prepare('DELETE FROM Questions WHERE exam_id = ?').bind(id).run();

            // Insert new questions
            if (questions.length > 0) {
                const stmt = c.env.DB.prepare(`
                    INSERT INTO Questions (exam_id, question_text, question_type, options, correct_answer, points, order_num)
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
        const exam = await c.env.DB.prepare('SELECT * FROM Exams WHERE id = ?').bind(id).first();
        if (!exam) return c.json({ error: 'Exam not found' }, 404);

        const { results: questions } = await c.env.DB.prepare('SELECT id, question_text, question_type, options, points, order_num FROM Questions WHERE exam_id = ? ORDER BY order_num ASC').bind(id).all();

        // Parse options JSON
        const parsedQuestions = questions.map((q: any) => ({
            ...q,
            options: JSON.parse(q.options as string)
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
        const { results: questions } = await c.env.DB.prepare('SELECT id, correct_answer, points, question_type FROM Questions WHERE exam_id = ?').bind(examId).all();

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
                // TODO: Add 'needs_grading' flag to ExamResults
            }
        });

        // Save result
        const result = await c.env.DB.prepare(`
            INSERT INTO ExamResults (exam_id, student_id, score, total_points, answers)
            VALUES (?, ?, ?, ?, ?)
        `).bind(examId, student_id, score, totalPoints, JSON.stringify(answers)).run();

        return c.json({
            success: true,
            score,
            totalPoints,
            resultId: result.meta.last_row_id
        });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});



export default exams;
