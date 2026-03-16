import { Hono } from 'hono';
import type { Bindings } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { authMiddleware } from '../middleware/auth';
import { resolveSessionToLmsCourseId } from '../utils/sessionCourseResolution';

const cbt = new Hono<{ Bindings: Bindings }>();

// ============================================================
// /api/cbt/exams  -  exams 테이블을 course_id 기준으로 관리 (course_id는 회차 ID 또는 과정 ID)
// ============================================================

// GET /api/cbt/exams?course_id=xxx  - 과정별 시험 목록 조회 (xxx = 회차 ID 또는 과정 ID)
cbt.get('/exams', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        if (!courseIdParam) {
            return errorResponse(c, 'course_id 파라미터가 필요합니다', 400);
        }
        const courseId = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
        if (courseId == null) {
            return successResponse(c, []);
        }

        const { results } = await c.env.DB.prepare(`
            SELECT 
                id, course_id, title, description, type,
                time_limit_minutes, start_time, end_time, is_active,
                created_at, updated_at
            FROM exams
            WHERE course_id = ?
            ORDER BY created_at DESC
        `).bind(courseId).all();

        return successResponse(c, results || []);
    } catch (e: any) {
        console.error('GET /api/cbt/exams error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/cbt/exams  - 시험 생성 (course_id는 회차 ID 또는 과정 ID, 회차면 lms_course_id로 저장)
cbt.post('/exams', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const {
            course_id,
            title,
            description,
            type,               // midterm | final | mock | practice
            time_limit_minutes,
            start_time,
            end_time,
            is_active = 1
        } = body;

        if (!course_id || !title) {
            return errorResponse(c, 'course_id와 title은 필수입니다', 400);
        }

        const resolvedCourseId = await resolveSessionToLmsCourseId(c.env.DB, course_id);
        if (resolvedCourseId == null) {
            return errorResponse(c, '해당 회차에 연결된 LMS 과정이 없습니다. 과정 연결을 먼저 해주세요.', 400);
        }

        // type 유효성 검사
        const validTypes = ['midterm', 'final', 'mock', 'practice'];
        const examType = validTypes.includes(type) ? type : 'practice';

        const result = await c.env.DB.prepare(`
            INSERT INTO exams (course_id, title, description, type, time_limit_minutes, start_time, end_time, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
            resolvedCourseId,
            title,
            description || null,
            examType,
            time_limit_minutes || 60,
            start_time || null,
            end_time || null,
            is_active
        ).run();

        const examId = result.meta.last_row_id;
        return successResponse(c, { id: examId }, '시험이 생성되었습니다');
    } catch (e: any) {
        console.error('POST /api/cbt/exams error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// PUT /api/cbt/exams/:id  - 시험 수정
cbt.put('/exams/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const {
            title, description, type,
            time_limit_minutes, start_time, end_time, is_active
        } = body;

        const validTypes = ['midterm', 'final', 'mock', 'practice'];
        const examType = validTypes.includes(type) ? type : 'practice';

        await c.env.DB.prepare(`
            UPDATE exams
            SET title=?, description=?, type=?, time_limit_minutes=?,
                start_time=?, end_time=?, is_active=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=?
        `).bind(
            title, description || null, examType,
            time_limit_minutes || 60, start_time || null, end_time || null,
            is_active ?? 1, id
        ).run();

        return successResponse(c, { id }, '시험이 수정되었습니다');
    } catch (e: any) {
        console.error('PUT /api/cbt/exams/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/cbt/exams/:id  - 시험 삭제
cbt.delete('/exams/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.batch([
            c.env.DB.prepare('DELETE FROM exam_questions WHERE exam_id = ?').bind(id),
            c.env.DB.prepare('DELETE FROM exams WHERE id = ?').bind(id),
        ]);
        return successResponse(c, { id }, '시험이 삭제되었습니다');
    } catch (e: any) {
        console.error('DELETE /api/cbt/exams/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/course-ability-units  - 해당 과정(회차)에 포함된 NCS 능력단위 목록
// ============================================================
cbt.get('/course-ability-units', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        if (!courseIdParam) {
            return errorResponse(c, 'course_id 파라미터가 필요합니다', 400);
        }
        const sessionId = parseInt(String(courseIdParam), 10);
        if (isNaN(sessionId)) {
            return successResponse(c, []);
        }

        const session: any = await c.env.DB.prepare(
            'SELECT approved_course_id FROM course_sessions WHERE id = ?'
        ).bind(sessionId).first();
        if (!session?.approved_course_id) {
            return successResponse(c, []);
        }

        const reg: any = await c.env.DB.prepare(
            'SELECT id FROM ncs_approved_registrations WHERE approved_course_id = ? LIMIT 1'
        ).bind(session.approved_course_id).first();
        if (!reg?.id) {
            return successResponse(c, []);
        }

        const { results: curriculumRows } = await c.env.DB.prepare(
            'SELECT id, ability_units_json FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(reg.id).all() as { results: { id: number; ability_units_json?: string }[] };

        type UnitEntry = { code: string; name: string };
        const map = new Map<string, string>();

        for (const row of curriculumRows || []) {
            if (!row.ability_units_json) continue;
            try {
                const parsed = JSON.parse(row.ability_units_json) as (string | { code?: string; name?: string })[];
                if (!Array.isArray(parsed)) continue;
                for (const u of parsed) {
                    const code = typeof u === 'string' ? u : (u?.code || '');
                    if (!code) continue;
                    const name = typeof u === 'object' && u?.name ? String(u.name).trim() : '';
                    if (!map.has(code)) {
                        map.set(code, name || '');
                    }
                }
            } catch (_) {
                /* ignore */
            }
        }

        const codes = [...map.keys()];
        if (codes.length === 0) {
            return successResponse(c, []);
        }

        for (const code of codes) {
            if (map.get(code)) continue;
            const unit: any = await c.env.DB.prepare('SELECT name FROM ncs_units WHERE code = ?').bind(code).first();
            if (unit?.name) {
                map.set(code, String(unit.name).trim());
            }
        }

        const list = codes.map((code) => ({ code, name: map.get(code) || code }));
        return successResponse(c, list);
    } catch (e: any) {
        console.error('GET /api/cbt/course-ability-units error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/questions  - exam_questions 테이블 활용
// ============================================================

// GET /api/cbt/questions?course_id=xxx  - 과정별 문제 목록 조회 (xxx = 회차 ID 또는 과정 ID)
cbt.get('/questions', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        const type = c.req.query('type');   // multiple_choice | short_answer | essay

        let sql = `
            SELECT 
                eq.id, eq.exam_id, eq.question_text, eq.question_type,
                eq.options, eq.correct_answer, eq.points, eq.order_index,
                eq.ncs_ability_unit_code, eq.ncs_ability_unit_name,
                e.title as exam_title, e.course_id
            FROM exam_questions eq
            JOIN exams e ON eq.exam_id = e.id
            WHERE 1=1
        `;
        const params: any[] = [];
        const courseId = courseIdParam ? await resolveSessionToLmsCourseId(c.env.DB, courseIdParam) : null;

        if (courseId != null) {
            sql += ' AND e.course_id = ?';
            params.push(courseId);
        }
        if (type) {
            sql += ' AND eq.question_type = ?';
            params.push(type);
        }

        sql += ' ORDER BY eq.id DESC';

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();
        return successResponse(c, results || []);
    } catch (e: any) {
        console.error('GET /api/cbt/questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/cbt/questions  - 문제 등록
cbt.post('/questions', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const {
            exam_id,        // 특정 시험에 연결
            course_id,      // exam_id가 없을 때: 이 과정의 첫 번째 시험에 연결
            question_text,
            question_type,  // multiple_choice | short_answer | essay
            options,        // 객관식 보기 (JSON 배열 or 문자열)
            correct_answer,
            points = 1,
            ncs_ability_unit_code,
            ncs_ability_unit_name
        } = body;

        if (!question_text) {
            return errorResponse(c, 'question_text는 필수입니다', 400);
        }

        // exam_id 결정: 없으면 course_id(회차 ID 또는 과정 ID)로 가장 최근 시험에 연결
        let targetExamId = exam_id ? parseInt(exam_id) : null;
        if (!targetExamId && course_id) {
            const resolvedCourseId = await resolveSessionToLmsCourseId(c.env.DB, course_id);
            if (resolvedCourseId == null) {
                return errorResponse(c, '해당 회차에 연결된 LMS 과정이 없습니다.', 400);
            }
            const latestExam: any = await c.env.DB.prepare(
                `SELECT id FROM exams WHERE course_id = ? ORDER BY created_at DESC LIMIT 1`
            ).bind(resolvedCourseId).first();

            if (latestExam) {
                targetExamId = latestExam.id;
            } else {
                // 과정에 시험이 없으면 기본 시험 생성 (연습문제 타입)
                const createResult = await c.env.DB.prepare(`
                    INSERT INTO exams (course_id, title, type, is_active, created_at, updated_at)
                    VALUES (?, '문제은행', 'practice', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `).bind(resolvedCourseId).run();
                targetExamId = createResult.meta.last_row_id;
            }
        }

        if (!targetExamId) {
            return errorResponse(c, 'exam_id 또는 course_id가 필요합니다', 400);
        }

        // options 처리
        const optionsStr = Array.isArray(options)
            ? JSON.stringify(options)
            : (typeof options === 'string' ? options : null);

        // 현재 최대 order_index 조회
        const maxOrder: any = await c.env.DB.prepare(
            'SELECT MAX(order_index) as max_idx FROM exam_questions WHERE exam_id = ?'
        ).bind(targetExamId).first();
        const nextOrder = ((maxOrder?.max_idx) || 0) + 1;

        const result = await c.env.DB.prepare(`
            INSERT INTO exam_questions 
                (exam_id, question_text, question_type, options, correct_answer, points, order_index, ncs_ability_unit_code, ncs_ability_unit_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            targetExamId,
            question_text,
            question_type || 'multiple_choice',
            optionsStr,
            correct_answer || null,
            points,
            nextOrder,
            ncs_ability_unit_code || null,
            ncs_ability_unit_name || null
        ).run();

        const questionId = result.meta.last_row_id;
        return successResponse(c, { id: questionId, exam_id: targetExamId }, '문제가 등록되었습니다');
    } catch (e: any) {
        console.error('POST /api/cbt/questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/cbt/questions/:id  - 문제 삭제
cbt.delete('/questions/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM exam_questions WHERE id = ?').bind(id).run();
        return successResponse(c, { id }, '문제가 삭제되었습니다');
    } catch (e: any) {
        console.error('DELETE /api/cbt/questions/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

export default cbt;
