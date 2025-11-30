
// ============================================
// CBT (Computer Based Training) API
// ============================================

import { Hono } from 'hono';
import type { Bindings } from '../types';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';
import { getOne, getAll, execute } from '../utils/database';

const cbt = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/cbt/exams
 * 시험 목록 조회
 */
cbt.get('/exams', async (c) => {
    try {
        const courseId = c.req.query('course_id');

        let query = 'SELECT * FROM exams';
        const params: any[] = [];

        if (courseId) {
            query += ' WHERE course_id = ?';
            params.push(courseId);
        }

        query += ' ORDER BY created_at DESC';

        const exams = await getAll<any>(c.env.DB, query, params);
        return successResponse(c, exams);
    } catch (error) {
        console.error('Get exams error:', error);
        return errorResponse(c, '시험 목록 조회 중 오류가 발생했습니다', 500);
    }
});

/**
 * POST /api/cbt/exams
 * 시험 생성
 */
cbt.post('/exams', async (c) => {
    try {
        const body = await c.req.json();
        const { course_id, title, description, type, start_time, end_time, time_limit_minutes, is_active } = body;

        if (!title || !start_time || !end_time) {
            return errorResponse(c, '필수 항목이 누락되었습니다', 400);
        }

        const result = await execute(
            c.env.DB,
            `INSERT INTO exams (course_id, title, description, type, start_time, end_time, time_limit_minutes, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [course_id, title, description, type, start_time, end_time, time_limit_minutes, is_active ? 1 : 0]
        );

        if (!result.success) {
            return errorResponse(c, '시험 생성 실패', 500);
        }

        return successResponse(c, { id: result.meta.last_row_id }, '시험이 생성되었습니다', 201);
    } catch (error) {
        console.error('Create exam error:', error);
        return errorResponse(c, '시험 생성 중 오류가 발생했습니다', 500);
    }
});

/**
 * GET /api/cbt/questions
 * 문제은행 목록 조회
 */
cbt.get('/questions', async (c) => {
    try {
        // TODO: 카테고리, 난이도 필터링 추가
        const questions = await getAll<any>(c.env.DB, 'SELECT * FROM question_bank ORDER BY created_at DESC LIMIT 50');
        return successResponse(c, questions);
    } catch (error) {
        console.error('Get questions error:', error);
        return errorResponse(c, '문제 목록 조회 중 오류가 발생했습니다', 500);
    }
});

/**
 * POST /api/cbt/questions
 * 문제 등록
 */
cbt.post('/questions', async (c) => {
    try {
        const body = await c.req.json();
        const { category, difficulty, question_text, question_type, options, correct_answer, explanation, image_url, tags } = body;

        if (!question_text || !question_type || !correct_answer) {
            return errorResponse(c, '필수 항목이 누락되었습니다', 400);
        }

        const result = await execute(
            c.env.DB,
            `INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, image_url, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [category, difficulty, question_text, question_type, options, correct_answer, explanation, image_url, tags]
        );

        if (!result.success) {
            return errorResponse(c, '문제 등록 실패', 500);
        }

        return successResponse(c, { id: result.meta.last_row_id }, '문제가 등록되었습니다', 201);
    } catch (error) {
        console.error('Create question error:', error);
        return errorResponse(c, '문제 등록 중 오류가 발생했습니다', 500);
    }
});

export default cbt;

/**
 * GET /api/cbt/student/exams
 * 학생용 시험 목록 조회 (응시 상태 포함)
 */
cbt.get('/student/exams', async (c) => {
    try {
        const courseId = c.req.query('course_id');
        // TODO: 현재 로그인한 학생 ID 가져오기 (미들웨어에서 c.get('user').id)
        // 여기서는 임시로 4번 학생(seed.sql의 student1)이라고 가정
        const studentId = 4;

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
    } catch (error) {
        console.error('Get student exams error:', error);
        return errorResponse(c, '시험 목록 조회 중 오류가 발생했습니다', 500);
    }
});

/**
 * GET /api/cbt/student/exams/:id/take
 * 시험 응시를 위한 상세 정보 및 문제 조회
 */
cbt.get('/student/exams/:id/take', async (c) => {
    try {
        const examId = c.req.param('id');
        const studentId = 4; // 임시

        // 1. 시험 정보 조회
        const exam = await getOne<any>(c.env.DB, 'SELECT * FROM exams WHERE id = ?', [examId]);
        if (!exam) return notFoundResponse(c, '시험을 찾을 수 없습니다');

        // 2. 이미 응시했는지 확인
        const submission = await getOne<any>(
            c.env.DB,
            'SELECT id FROM exam_submissions WHERE exam_id = ? AND student_id = ?',
            [examId, studentId]
        );
        if (submission) {
            return errorResponse(c, '이미 응시한 시험입니다', 400);
        }

        // 3. 문제 목록 조회 (정답 제외)
        const questions = await getAll<any>(
            c.env.DB,
            `SELECT id, question_text, question_type, options, points, order_index 
       FROM exam_questions 
       WHERE exam_id = ? 
       ORDER BY order_index ASC`,
            [examId]
        );

        return successResponse(c, { exam, questions });
    } catch (error) {
        console.error('Get exam take error:', error);
        return errorResponse(c, '시험 정보 조회 중 오류가 발생했습니다', 500);
    }
});

/**
 * POST /api/cbt/student/exams/:id/submit
 * 시험 답안 제출
 */
cbt.post('/student/exams/:id/submit', async (c) => {
    try {
        const examId = c.req.param('id');
        const studentId = 4; // 임시
        const body = await c.req.json();
        const { answers } = body; // { question_id: answer_value }

        // 1. 시험 정보 및 정답 조회
        const questions = await getAll<any>(
            c.env.DB,
            'SELECT id, question_type, correct_answer, points FROM exam_questions WHERE exam_id = ?',
            [examId]
        );

        let totalScore = 0;
        const answerRecords = [];

        // 2. 채점 및 데이터 준비
        for (const q of questions) {
            const studentAnswer = answers[q.id];
            let isCorrect = 0;
            let scoreAwarded = 0;

            if (studentAnswer) {
                // 객관식/단답형 자동 채점
                if (q.question_type === 'multiple_choice' || q.question_type === 'short_answer') {
                    if (String(studentAnswer).trim() === String(q.correct_answer).trim()) {
                        isCorrect = 1;
                        scoreAwarded = q.points;
                        totalScore += scoreAwarded;
                    }
                }
                // 서술형은 수동 채점 (일단 0점 처리)
            }

            answerRecords.push({
                question_id: q.id,
                student_answer: studentAnswer,
                is_correct: isCorrect,
                score_awarded: scoreAwarded
            });
        }

        // 3. 제출 기록 저장 (트랜잭션 필요)
        // 3-1. exam_submissions 저장
        const submissionResult = await execute(
            c.env.DB,
            `INSERT INTO exam_submissions (exam_id, student_id, started_at, submitted_at, total_score, status)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, 'submitted')`,
            [examId, studentId, new Date().toISOString(), totalScore] // started_at은 임시로 현재시간
        );

        if (!submissionResult.success) {
            throw new Error('Failed to save submission');
        }

        const submissionId = submissionResult.meta.last_row_id;

        // 3-2. exam_answers 저장
        for (const ans of answerRecords) {
            await execute(
                c.env.DB,
                `INSERT INTO exam_answers (submission_id, question_id, student_answer, is_correct, score_awarded)
         VALUES (?, ?, ?, ?, ?)`,
                [submissionId, ans.question_id, ans.student_answer, ans.is_correct, ans.score_awarded]
            );
        }

        return successResponse(c, { total_score: totalScore }, '시험이 제출되었습니다');

    } catch (error) {
        console.error('Submit exam error:', error);
        return errorResponse(c, '답안 제출 중 오류가 발생했습니다', 500);
    }
});
