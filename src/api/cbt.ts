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

// GET /api/cbt/questions
// - ?exam_id=XXX           : 특정 시험에 속한 문제 목록
// - ?course_id=XXX         : 과정(또는 회차) 기준 문제 목록 (xxx = 회차 ID 또는 과정 ID)
// - ?type=multiple_choice  : 문제 유형 필터
cbt.get('/questions', authMiddleware, async (c) => {
    try {
        const examIdParam = c.req.query('exam_id');
        const courseIdParam = c.req.query('course_id');
        const type = c.req.query('type');   // multiple_choice | short_answer | essay

        let sql = `
            SELECT 
                eq.id, eq.exam_id, eq.question_text, eq.question_type,
                eq.options, eq.correct_answer, eq.points, eq.order_index,
                e.title as exam_title, e.course_id,
                qb.difficulty,
                COALESCE(qb.category, ns.name) as category
            FROM exam_questions eq
            JOIN exams e ON eq.exam_id = e.id
            LEFT JOIN question_bank qb ON qb.id = eq.question_bank_id
            LEFT JOIN question_bank_ncs_subjects ns ON ns.id = qb.ncs_subject_id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (examIdParam) {
            const examId = parseInt(String(examIdParam), 10);
            if (!Number.isNaN(examId)) {
                sql += ' AND eq.exam_id = ?';
                params.push(examId);
            }
        } else if (courseIdParam) {
            const courseId = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
            if (courseId == null) {
                return successResponse(c, []);
            }
            sql += ' AND e.course_id = ?';
            params.push(courseId);
        }

        if (type) {
            sql += ' AND eq.question_type = ?';
            params.push(type);
        }

        sql += ' ORDER BY eq.order_index ASC, eq.id ASC';

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();
        return successResponse(c, results || []);
    } catch (e: any) {
        console.error('GET /api/cbt/questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/question-bank  - 재사용 가능한 문제은행 조회
// - global=1 또는 course_id 없음 → question_bank 테이블(전역 풀) 조회
// - course_id 있음 → 기존처럼 해당 과정의 exam_questions 조회 (호환)
// ============================================================

cbt.get('/question-bank', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        const globalParam = c.req.query('global');
        const examIdParam = c.req.query('exam_id');
        const curriculumIdParam = c.req.query('curriculum_id');
        const type = c.req.query('type');
        const difficulty = c.req.query('difficulty');
        const ncsUnitCode = c.req.query('ncs_unit_code');
        const keyword = c.req.query('keyword');

        const useGlobalBank = globalParam === '1' || !courseIdParam;

        if (useGlobalBank) {
            // 전역 문제은행: question_bank + ncs_subject 과목명 보강
            const ncsSubjectIdParam = c.req.query('ncs_subject_id');
            let sql = `
                SELECT qb.id, qb.question_text, qb.question_type, qb.options, qb.correct_answer,
                    qb.difficulty, qb.category, qb.points, qb.ncs_subject_id, qb.created_at,
                    ns.name AS ncs_subject_name
                FROM question_bank qb
                LEFT JOIN question_bank_ncs_subjects ns ON ns.id = qb.ncs_subject_id
                WHERE 1=1
            `;
            const params: any[] = [];
            if (type) {
                sql += ' AND qb.question_type = ?';
                params.push(type);
            }
            if (difficulty) {
                sql += ' AND qb.difficulty = ?';
                params.push(difficulty);
            }
            if (curriculumIdParam) {
                const cid = parseInt(String(curriculumIdParam), 10);
                if (!Number.isNaN(cid)) {
                    sql += ' AND qb.curriculum_id = ?';
                    params.push(cid);
                }
            }
            if (ncsSubjectIdParam) {
                const sid = parseInt(String(ncsSubjectIdParam), 10);
                if (!Number.isNaN(sid)) {
                    sql += ' AND qb.ncs_subject_id = ?';
                    params.push(sid);
                }
            }
            if (ncsUnitCode) {
                sql += ' AND qb.ncs_ability_unit_code = ?';
                params.push(ncsUnitCode);
            }
            if (keyword) {
                sql += ' AND qb.question_text LIKE ?';
                params.push(`%${keyword}%`);
            }
            sql += ' ORDER BY qb.id DESC';
            const { results } = await c.env.DB.prepare(sql).bind(...params).all();
            const rows = (results || []).map((r: any) => ({
                ...r,
                points: r.points ?? 1,
                exam_title: null,
                course_title: r.category || r.ncs_subject_name || null,
                order_index: 0
            }));
            return successResponse(c, rows);
        }

        // 기존: 해당 과정의 exam_questions
        let sql = `
            SELECT
                eq.id,
                eq.exam_id,
                eq.question_text,
                eq.question_type,
                eq.options,
                eq.correct_answer,
                eq.points,
                eq.order_index,
                eq.ncs_ability_unit_code,
                eq.ncs_ability_unit_name,
                eq.curriculum_id,
                eq.source_course_id,
                eq.source_exam_id,
                e.title AS exam_title,
                e.course_id,
                c.title AS course_title
            FROM exam_questions eq
            JOIN exams e ON eq.exam_id = e.id
            LEFT JOIN courses c ON e.course_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (examIdParam) {
            const examId = parseInt(String(examIdParam), 10);
            if (!Number.isNaN(examId)) {
                sql += ' AND eq.exam_id = ?';
                params.push(examId);
            }
        }

        if (courseIdParam) {
            const resolvedCourseId = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
            if (resolvedCourseId != null) {
                sql += ' AND e.course_id = ?';
                params.push(resolvedCourseId);
            }
        }

        if (curriculumIdParam) {
            const cid = parseInt(String(curriculumIdParam), 10);
            if (!Number.isNaN(cid)) {
                sql += ' AND eq.curriculum_id = ?';
                params.push(cid);
            }
        }
        if (type) {
            sql += ' AND eq.question_type = ?';
            params.push(type);
        }
        if (ncsUnitCode) {
            sql += ' AND eq.ncs_ability_unit_code = ?';
            params.push(ncsUnitCode);
        }
        if (keyword) {
            sql += ' AND eq.question_text LIKE ?';
            params.push(`%${keyword}%`);
        }

        sql += ' ORDER BY e.course_id ASC, e.id ASC, eq.order_index ASC, eq.id ASC';

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();
        return successResponse(c, results || []);
    } catch (e: any) {
        console.error('GET /api/cbt/question-bank error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/cbt/bank-questions  - 전역 문제은행에만 등록 (과정 무관)
cbt.post('/bank-questions', authMiddleware, async (c) => {
    try {
        const body = await c.req.json() as {
            question_text: string;
            question_type?: string;
            options?: string | string[] | null;
            correct_answer?: string | null;
            points?: number;
            difficulty?: string;
            category?: string | null;
            curriculum_id?: number | null;
            ncs_subject_id?: number | null;
            ncs_ability_unit_code?: string | null;
            ncs_ability_unit_name?: string | null;
        };
        const { question_text, question_type = 'multiple_choice', options, correct_answer, points = 1, difficulty, category, curriculum_id, ncs_subject_id, ncs_ability_unit_code, ncs_ability_unit_name } = body;
        if (!question_text || typeof question_text !== 'string') {
            return errorResponse(c, 'question_text는 필수입니다', 400);
        }
        const optionsStr = Array.isArray(options)
            ? JSON.stringify(options)
            : (typeof options === 'string' ? options : null);

        await c.env.DB.prepare(`
            INSERT INTO question_bank (
                question_text, question_type, options, correct_answer, 
                difficulty, category, points, ncs_ability_unit_code, 
                ncs_ability_unit_name, curriculum_id, ncs_subject_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
            question_text,
            question_type,
            optionsStr,
            correct_answer ?? null,
            difficulty ?? null,
            category ?? null,
            points,
            ncs_ability_unit_code ?? null,
            ncs_ability_unit_name ?? null,
            curriculum_id ?? null,
            ncs_subject_id ?? null
        ).run();

        const row: any = await c.env.DB.prepare('SELECT id FROM question_bank ORDER BY id DESC LIMIT 1').first();
        const id = row?.id ?? null;
        return successResponse(c, { id }, '문제가 문제은행에 등록되었습니다');
    } catch (e: any) {
        console.error('POST /api/cbt/bank-questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/cbt/ncs-curriculum-list  - 과정등록 시 설정된 NCS 교과목 전체 목록 (레거시/참고용)
cbt.get('/ncs-curriculum-list', authMiddleware, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT id, name FROM ncs_approved_curriculum
            ORDER BY registration_id ASC, sort_order ASC, id ASC
        `).all() as { results: { id: number; name: string }[] };
        const list = (results || []).map((r) => ({ id: r.id, name: r.name || '' }));
        return successResponse(c, list);
    } catch (e: any) {
        console.error('GET /api/cbt/ncs-curriculum-list error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ========== 문제은행 분류용 NCS 교과목 전용 (중복 없음, 관리자 추가/삭제) ==========
// GET /api/cbt/ncs-subjects  - 문제은행 분류용 교과목 목록
cbt.get('/ncs-subjects', authMiddleware, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT id, name, sort_order FROM question_bank_ncs_subjects
            ORDER BY sort_order ASC, name ASC, id ASC
        `).all() as { results: { id: number; name: string; sort_order?: number }[] };
        const list = (results || []).map((r) => ({ id: r.id, name: r.name || '' }));
        return successResponse(c, list);
    } catch (e: any) {
        console.error('GET /api/cbt/ncs-subjects error:', e);
        return successResponse(c, []);
    }
});

// POST /api/cbt/ncs-subjects  - 과목 추가 (body: name)
cbt.post('/ncs-subjects', authMiddleware, async (c) => {
    try {
        const body = await c.req.json() as { name?: string };
        const name = body.name != null ? String(body.name).trim() : '';
        if (!name) return errorResponse(c, '과목명이 필요합니다', 400);
        await c.env.DB.prepare(`
            INSERT INTO question_bank_ncs_subjects (name, sort_order) VALUES (?, (SELECT COALESCE(MAX(sort_order),0)+1 FROM question_bank_ncs_subjects))
        `).bind(name).run();
        const row: any = await c.env.DB.prepare('SELECT id, name FROM question_bank_ncs_subjects ORDER BY id DESC LIMIT 1').first();
        return successResponse(c, row || { id: null, name }, '과목이 추가되었습니다');
    } catch (e: any) {
        if (e.message && e.message.includes('UNIQUE')) return errorResponse(c, '이미 같은 이름의 과목이 있습니다', 400);
        console.error('POST /api/cbt/ncs-subjects error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/cbt/ncs-subjects/:id  - 과목 삭제
cbt.delete('/ncs-subjects/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (Number.isNaN(id)) return errorResponse(c, '유효한 ID가 아닙니다', 400);
        await c.env.DB.prepare('UPDATE question_bank SET ncs_subject_id = NULL WHERE ncs_subject_id = ?').bind(id).run();
        await c.env.DB.prepare('DELETE FROM question_bank_ncs_subjects WHERE id = ?').bind(id).run();
        return successResponse(c, { id }, '과목이 삭제되었습니다');
    } catch (e: any) {
        console.error('DELETE /api/cbt/ncs-subjects/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/cbt/bank-questions/:id  - 문제은행 단건 조회 (수정용)
cbt.get('/bank-questions/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (Number.isNaN(id)) return errorResponse(c, '유효한 ID가 아닙니다', 400);
        const row: any = await c.env.DB.prepare(
            'SELECT id, question_text, question_type, options, correct_answer, difficulty, category, points, curriculum_id, ncs_subject_id FROM question_bank WHERE id = ?'
        ).bind(id).first();
        if (!row) return errorResponse(c, '문제를 찾을 수 없습니다', 404);
        return successResponse(c, row);
    } catch (e: any) {
        console.error('GET /api/cbt/bank-questions/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// PATCH /api/cbt/bank-questions/:id  - 문제은행 수정
cbt.patch('/bank-questions/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (Number.isNaN(id)) return errorResponse(c, '유효한 ID가 아닙니다', 400);
        const body = await c.req.json() as {
            question_text?: string;
            question_type?: string;
            options?: string | string[] | null;
            correct_answer?: string | null;
            difficulty?: string;
            category?: string | null;
            curriculum_id?: number | null;
            ncs_subject_id?: number | null;
        };
        const row: any = await c.env.DB.prepare('SELECT id FROM question_bank WHERE id = ?').bind(id).first();
        if (!row) return errorResponse(c, '문제를 찾을 수 없습니다', 404);
        const question_text = body.question_text != null ? body.question_text : null;
        const question_type = body.question_type != null ? body.question_type : null;
        const optionsStr = body.options != null
            ? (Array.isArray(body.options) ? JSON.stringify(body.options) : (typeof body.options === 'string' ? body.options : null))
            : null;
        const correct_answer = body.correct_answer !== undefined ? body.correct_answer : null;
        const difficulty = body.difficulty !== undefined ? body.difficulty : null;
        const category = body.category !== undefined ? body.category : null;
        const curriculum_id = body.curriculum_id !== undefined ? body.curriculum_id : null;
        const ncs_subject_id = body.ncs_subject_id !== undefined ? body.ncs_subject_id : null;
        await c.env.DB.prepare(`
            UPDATE question_bank SET
                question_text = COALESCE(?, question_text),
                question_type = COALESCE(?, question_type),
                options = COALESCE(?, options),
                correct_answer = COALESCE(?, correct_answer),
                difficulty = COALESCE(?, difficulty),
                category = COALESCE(?, category),
                curriculum_id = COALESCE(?, curriculum_id),
                ncs_subject_id = COALESCE(?, ncs_subject_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(question_text, question_type, optionsStr, correct_answer, difficulty, category, curriculum_id, ncs_subject_id, id).run();
        return successResponse(c, { id }, '문제가 수정되었습니다');
    } catch (e: any) {
        console.error('PATCH /api/cbt/bank-questions/:id error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/cbt/bank-questions/:id  - 문제은행 삭제
cbt.delete('/bank-questions/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (Number.isNaN(id)) return errorResponse(c, '유효한 ID가 아닙니다', 400);
        await c.env.DB.prepare('DELETE FROM question_bank WHERE id = ?').bind(id).run();
        return successResponse(c, { id }, '문제가 삭제되었습니다');
    } catch (e: any) {
        console.error('DELETE /api/cbt/bank-questions/:id error:', e);
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
            ncs_ability_unit_name,
            curriculum_id,
            source_course_id,
            source_exam_id
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

        const optionsStr = Array.isArray(options)
            ? JSON.stringify(options)
            : (typeof options === 'string' ? options : null);

        // 1) 전역 문제은행(question_bank)에 먼저 등록 → LMS에서 만든 문제도 문제은행에 자동 반영
        await c.env.DB.prepare(`
            INSERT INTO question_bank (
                question_text, question_type, options, correct_answer, 
                difficulty, category, points, ncs_ability_unit_code, 
                ncs_ability_unit_name, curriculum_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
            question_text,
            question_type || 'multiple_choice',
            optionsStr,
            correct_answer || null,
            null, // difficulty
            null, // category
            points,
            ncs_ability_unit_code || null,
            ncs_ability_unit_name || null,
            curriculum_id || null
        ).run();

        const bankRow: any = await c.env.DB.prepare('SELECT id FROM question_bank ORDER BY id DESC LIMIT 1').first();
        const questionBankId = bankRow?.id ?? null;

        // 2) 해당 과정 시험의 exam_questions에 등록 (question_bank_id 연결)
        const maxOrder: any = await c.env.DB.prepare(
            'SELECT MAX(order_index) as max_idx FROM exam_questions WHERE exam_id = ?'
        ).bind(targetExamId).first();
        const nextOrder = ((maxOrder?.max_idx) || 0) + 1;

        const result = await c.env.DB.prepare(`
            INSERT INTO exam_questions 
                (exam_id, question_bank_id, question_text, question_type, options, correct_answer, points, order_index, ncs_ability_unit_code, ncs_ability_unit_name, curriculum_id, source_course_id, source_exam_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            targetExamId,
            questionBankId,
            question_text,
            question_type || 'multiple_choice',
            optionsStr,
            correct_answer || null,
            points,
            nextOrder,
            ncs_ability_unit_code || null,
            ncs_ability_unit_name || null,
            curriculum_id || null,
            source_course_id || null,
            source_exam_id || null
        ).run();

        const questionId = result.meta.last_row_id;
        return successResponse(c, { id: questionId, exam_id: targetExamId, question_bank_id: questionBankId }, '문제가 등록되었습니다');
    } catch (e: any) {
        console.error('POST /api/cbt/questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// PATCH /api/cbt/questions/:id  - 문제 수정 (내용 또는 순서)
// body에 question_text 있으면 내용 수정, order_index만 있으면 순서만 수정
cbt.patch('/questions/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json() as {
            order_index?: number;
            question_text?: string;
            question_type?: string;
            options?: string | string[];
            correct_answer?: string | null;
            points?: number;
        };
        if (body.question_text != null) {
            const optionsStr = Array.isArray(body.options)
                ? JSON.stringify(body.options)
                : (typeof body.options === 'string' ? body.options : null);
            await c.env.DB.prepare(`
                UPDATE exam_questions SET question_text = ?, question_type = ?, options = ?, correct_answer = ?, points = ?
                WHERE id = ?
            `).bind(
                body.question_text,
                body.question_type || 'multiple_choice',
                optionsStr,
                body.correct_answer ?? null,
                body.points ?? 1,
                id
            ).run();
            return successResponse(c, { id }, '수정되었습니다');
        }
        const orderIndex = body?.order_index;
        if (orderIndex != null && typeof orderIndex === 'number') {
            await c.env.DB.prepare('UPDATE exam_questions SET order_index = ? WHERE id = ?')
                .bind(Math.max(0, orderIndex), id).run();
            return successResponse(c, { id, order_index: orderIndex }, '수정되었습니다');
        }
        return errorResponse(c, 'question_text 또는 order_index가 필요합니다', 400);
    } catch (e: any) {
        console.error('PATCH /api/cbt/questions/:id error:', e);
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

// ============================================================
// NCS 과정별 평가용 문제 풀 (문제은행 → NCS평가관리 등록)
// ============================================================

// GET /api/cbt/ncs-available-for-student  - 수강 중인 회차 중 NCS 평가 문제가 있는 목록 (학생용)
cbt.get('/ncs-available-for-student', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as { userId: number };
        if (user?.userId == null) return errorResponse(c, '로그인이 필요합니다', 401);
        const { results: enrollments } = await c.env.DB.prepare(`
            SELECT e.session_id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
            FROM course_session_enrollments e
            JOIN course_sessions s ON s.id = e.session_id
            JOIN approved_courses a ON a.id = s.approved_course_id
            WHERE e.user_id = ? AND e.status = 'approved'
        `).bind(user.userId).all() as { results: any[] };
        const list: { session_id: number; session_name: string; course_title: string; question_count: number }[] = [];
        for (const row of enrollments || []) {
            const courseId = row.lms_course_id != null && row.lms_course_id > 0
                ? row.lms_course_id
                : await resolveSessionToLmsCourseId(c.env.DB, row.session_id);
            if (courseId == null) continue;
            const countRow: any = await c.env.DB.prepare(
                'SELECT COUNT(*) as cnt FROM ncs_course_questions WHERE course_id = ?'
            ).bind(courseId).first();
            const questionCount = Number(countRow?.cnt ?? 0);
            if (questionCount === 0) continue;
            const sessionName = [row.session_number, '회차', row.session_name].filter(Boolean).join(' ');
            list.push({
                session_id: row.session_id,
                session_name: sessionName || String(row.session_id),
                course_title: row.course_name || '',
                question_count: questionCount
            });
        }
        return successResponse(c, list);
    } catch (e: any) {
        console.error('GET /api/cbt/ncs-available-for-student error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// GET /api/cbt/ncs-course-questions?course_id= 또는 ?session_id=  - 해당 과정의 NCS평가용 문제 목록
cbt.get('/ncs-course-questions', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id') ?? c.req.query('session_id');
        if (!courseIdParam) return errorResponse(c, 'course_id 또는 session_id가 필요합니다', 400);
        const courseId = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
        if (courseId == null) return successResponse(c, []);

        const { results } = await c.env.DB.prepare(`
            SELECT n.id, n.course_id, n.question_bank_id, n.order_index, n.created_at,
                   q.question_text, q.question_type, q.options, q.correct_answer, q.difficulty,
                   COALESCE(q.category, ns.name) as category
            FROM ncs_course_questions n
            JOIN question_bank q ON q.id = n.question_bank_id
            LEFT JOIN question_bank_ncs_subjects ns ON ns.id = q.ncs_subject_id
            WHERE n.course_id = ?
            ORDER BY n.order_index ASC, n.id ASC
        `).bind(courseId).all() as { results: any[] };
        return successResponse(c, results || []);
    } catch (e: any) {
        console.error('GET /api/cbt/ncs-course-questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/cbt/ncs-submit  - NCS 평가 답안 제출 및 채점 (학생용, body: session_id, answers: { [ncs_question_id]: answer })
cbt.post('/ncs-submit', authMiddleware, async (c) => {
    try {
        const body = await c.req.json() as { session_id: string | number; answers: Record<string, string | number> };
        const sessionId = body.session_id != null ? String(body.session_id) : null;
        const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
        if (!sessionId) return errorResponse(c, 'session_id가 필요합니다', 400);
        const courseId = await resolveSessionToLmsCourseId(c.env.DB, sessionId);
        if (courseId == null) return errorResponse(c, '해당 회차를 찾을 수 없습니다', 404);
        const { results: rows } = await c.env.DB.prepare(`
            SELECT n.id, q.correct_answer, q.question_type
            FROM ncs_course_questions n
            JOIN question_bank q ON q.id = n.question_bank_id
            WHERE n.course_id = ?
            ORDER BY n.order_index ASC, n.id ASC
        `).bind(courseId).all() as { results: any[] };
        let score = 0;
        const total = (rows || []).length;
        for (const row of rows || []) {
            const key = String(row.id);
            const studentAnswer = answers[key] != null ? String(answers[key]).trim() : '';
            const correct = row.correct_answer != null ? String(row.correct_answer).trim() : '';
            if (row.question_type === 'multiple_choice') {
                if (studentAnswer === correct) score += 1;
            } else if (row.question_type === 'short_answer' || row.question_type === 'essay') {
                if (studentAnswer.toLowerCase() === correct.toLowerCase()) score += 1;
            }
        }
        return successResponse(c, { score, total, correct_count: score });
    } catch (e: any) {
        console.error('POST /api/cbt/ncs-submit error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/cbt/ncs-course-questions  - 문제은행 문제를 해당 회차 NCS평가에 등록 (body: session_id, question_bank_ids)
cbt.post('/ncs-course-questions', authMiddleware, async (c) => {
    try {
        const body = await c.req.json() as { session_id?: string | number; question_bank_ids?: number[] };
        const sessionId = body.session_id != null ? String(body.session_id) : null;
        if (!sessionId) return errorResponse(c, 'session_id가 필요합니다', 400);
        const courseId = await resolveSessionToLmsCourseId(c.env.DB, sessionId);
        if (courseId == null) return errorResponse(c, '해당 회차를 찾을 수 없습니다', 404);

        const raw = body.question_bank_ids || [];
        const questionBankIds = (Array.isArray(raw) ? raw : []).map((v) => parseInt(String(v), 10)).filter((v) => !Number.isNaN(v));
        if (questionBankIds.length === 0) return errorResponse(c, 'question_bank_ids 배열이 필요합니다', 400);

        const maxOrder: any = await c.env.DB.prepare('SELECT MAX(order_index) as mx FROM ncs_course_questions WHERE course_id = ?').bind(courseId).first();
        let nextOrder = ((maxOrder?.mx) ?? 0) + 1;
        const inserted: number[] = [];

        for (const bankId of questionBankIds) {
            const exists = await c.env.DB.prepare('SELECT id FROM ncs_course_questions WHERE course_id = ? AND question_bank_id = ?').bind(courseId, bankId).first();
            if (exists) continue;
            const row: any = await c.env.DB.prepare('SELECT id FROM question_bank WHERE id = ?').bind(bankId).first();
            if (!row) continue;
            await c.env.DB.prepare(
                'INSERT INTO ncs_course_questions (course_id, question_bank_id, order_index) VALUES (?, ?, ?)'
            ).bind(courseId, bankId, nextOrder++).run();
            const last: any = await c.env.DB.prepare('SELECT id FROM ncs_course_questions WHERE course_id = ? AND question_bank_id = ? ORDER BY id DESC LIMIT 1').bind(courseId, bankId).first();
            if (last?.id) inserted.push(last.id);
        }
        return successResponse(c, { course_id: courseId, inserted_count: inserted.length }, '선택한 문제가 NCS평가에 등록되었습니다.');
    } catch (e: any) {
        console.error('POST /api/cbt/ncs-course-questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/exams/:id/import-questions  - 다른 시험/과정의 문제를 복사하여 편성
// ============================================================

cbt.post('/exams/:id/import-questions', authMiddleware, async (c) => {
    try {
        const examIdParam = c.req.param('id');
        const targetExamId = parseInt(String(examIdParam), 10);
        if (Number.isNaN(targetExamId)) {
            return errorResponse(c, '유효한 시험 ID가 아닙니다', 400);
        }

        const targetExam: any = await c.env.DB.prepare(
            'SELECT id, course_id FROM exams WHERE id = ?'
        ).bind(targetExamId).first();

        if (!targetExam) {
            return errorResponse(c, '대상 시험을 찾을 수 없습니다', 404);
        }

        const targetCourseId: number | null = targetExam.course_id ?? null;

        const body = await c.req.json() as {
            question_ids?: number[] | string[];
            question_bank_ids?: number[] | string[];
            target_curriculum_id?: number;
        };

        const bankIdsRaw = body.question_bank_ids || [];
        const questionBankIds = (Array.isArray(bankIdsRaw) ? bankIdsRaw : [])
            .map((v) => parseInt(String(v), 10))
            .filter((v) => !Number.isNaN(v));

        const maxOrderRow: any = await c.env.DB.prepare(
            'SELECT MAX(order_index) as max_idx FROM exam_questions WHERE exam_id = ?'
        ).bind(targetExamId).first();
        let nextOrder: number = ((maxOrderRow?.max_idx) || 0) + 1;
        const insertedIds: number[] = [];

        // 1) 전역 문제은행(question_bank) ID로 추가 (기본 컬럼만 조회해 0088 미적용 DB 호환)
        if (questionBankIds.length > 0) {
            for (const bankId of questionBankIds) {
                const row: any = await c.env.DB.prepare(
                    `SELECT id, question_text, question_type, options, correct_answer FROM question_bank WHERE id = ?`
                ).bind(bankId).first();

                if (!row) continue;

                // 0088 추가 컬럼은 선택적 조회 (있으면 사용, 없으면 null/1)
                let points = 1, ncsCode: string | null = null, ncsName: string | null = null, curriculumId: number | null = null;
                try {
                    const ext: any = await c.env.DB.prepare(
                        `SELECT points, ncs_ability_unit_code, ncs_ability_unit_name, curriculum_id FROM question_bank WHERE id = ?`
                    ).bind(bankId).first();
                    if (ext) {
                        points = ext.points ?? 1;
                        ncsCode = ext.ncs_ability_unit_code ?? null;
                        ncsName = ext.ncs_ability_unit_name ?? null;
                        curriculumId = ext.curriculum_id ?? null;
                    }
                } catch (_) { /* 0088 미적용 시 무시 */ }

                const result = await c.env.DB.prepare(
                    `INSERT INTO exam_questions
                        (exam_id, question_bank_id, question_text, question_type, options, correct_answer, points, order_index,
                         ncs_ability_unit_code, ncs_ability_unit_name, curriculum_id, source_course_id, source_exam_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(
                    targetExamId,
                    bankId,
                    row.question_text,
                    row.question_type,
                    row.options ?? null,
                    row.correct_answer ?? null,
                    points,
                    nextOrder++,
                    ncsCode,
                    ncsName,
                    body.target_curriculum_id ?? curriculumId,
                    targetCourseId,
                    targetExamId
                ).run();

                const lastId = result.meta?.last_row_id;
                if (lastId != null) insertedIds.push(Number(lastId));
            }
            return successResponse(c, { exam_id: targetExamId, question_ids: insertedIds }, '문제가 시험에 추가되었습니다');
        }

        // 2) 기존: exam_questions ID로 복사
        const idsRaw = body.question_ids || [];
        const questionIds = (Array.isArray(idsRaw) ? idsRaw : [])
            .map((v) => parseInt(String(v), 10))
            .filter((v) => !Number.isNaN(v));

        if (questionIds.length === 0) {
            return errorResponse(c, 'question_ids 또는 question_bank_ids 배열이 필요합니다', 400);
        }

        const { results: rows } = await c.env.DB.prepare(
            `SELECT id, exam_id, question_text, question_type, options, correct_answer, points,
                    ncs_ability_unit_code, ncs_ability_unit_name, curriculum_id, source_course_id, source_exam_id
             FROM exam_questions
             WHERE id IN (${questionIds.map(() => '?').join(',')})`
        ).bind(...questionIds).all() as {
            results: {
                id: number;
                exam_id: number;
                question_text: string;
                question_type: string;
                options?: string | null;
                correct_answer?: string | null;
                points?: number | null;
                ncs_ability_unit_code?: string | null;
                ncs_ability_unit_name?: string | null;
                curriculum_id?: number | null;
                source_course_id?: number | null;
                source_exam_id?: number | null;
            }[];
        };

        if (!rows || rows.length === 0) {
            return errorResponse(c, '선택한 문제를 찾을 수 없습니다', 404);
        }

        for (const row of rows) {
            const result = await c.env.DB.prepare(
                `INSERT INTO exam_questions
                    (exam_id, question_text, question_type, options, correct_answer, points, order_index,
                     ncs_ability_unit_code, ncs_ability_unit_name, curriculum_id, source_course_id, source_exam_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                targetExamId,
                row.question_text,
                row.question_type,
                row.options || null,
                row.correct_answer || null,
                row.points ?? 1,
                nextOrder++,
                row.ncs_ability_unit_code || null,
                row.ncs_ability_unit_name || null,
                body.target_curriculum_id ?? row.curriculum_id ?? null,
                row.source_course_id ?? targetCourseId,
                row.source_exam_id ?? row.exam_id
            ).run();

            insertedIds.push(result.meta.last_row_id);
        }

        return successResponse(c, { exam_id: targetExamId, question_ids: insertedIds }, '문제가 시험에 추가되었습니다');
    } catch (e: any) {
        console.error('POST /api/cbt/exams/:id/import-questions error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/results  - 과정별 시험 결과 요약 (응시 수, 평균 점수)
// ============================================================
cbt.get('/results', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('course_id');
        if (!courseIdParam) return errorResponse(c, 'course_id 파라미터가 필요합니다', 400);
        const courseId = await resolveSessionToLmsCourseId(c.env.DB, courseIdParam);
        if (courseId == null) return successResponse(c, { exams: [] });

        const { results: exams } = await c.env.DB.prepare(`
            SELECT id, title, type, time_limit_minutes
            FROM exams WHERE course_id = ? ORDER BY created_at DESC
        `).bind(courseId).all() as { results: { id: number; title: string; type: string; time_limit_minutes?: number }[] };

        const { results: categoryRows } = await c.env.DB.prepare(`
            SELECT eq.exam_id, COALESCE(qb.category, ns.name) as category
            FROM exam_questions eq
            LEFT JOIN question_bank qb ON qb.id = eq.question_bank_id
            LEFT JOIN question_bank_ncs_subjects ns ON ns.id = qb.ncs_subject_id
            WHERE eq.exam_id IN (SELECT id FROM exams WHERE course_id = ?)
            AND (qb.category IS NOT NULL OR ns.name IS NOT NULL)
        `).bind(courseId).all() as { results: { exam_id: number; category: string | null }[] };

        const categoriesByExamId: Record<number, string[]> = {};
        for (const row of categoryRows || []) {
            if (row.category && row.exam_id != null) {
                if (!categoriesByExamId[row.exam_id]) categoriesByExamId[row.exam_id] = [];
                if (!categoriesByExamId[row.exam_id].includes(row.category))
                    categoriesByExamId[row.exam_id].push(row.category);
            }
        }

        const list: { id: number; title: string; type: string; time_limit_minutes?: number; submission_count: number; avg_score: number | null; max_score: number; category: string }[] = [];

        for (const exam of exams || []) {
            const stat: any = await c.env.DB.prepare(`
                SELECT COUNT(*) as cnt, AVG(total_score) as avg_score
                FROM exam_submissions WHERE exam_id = ? AND status IN ('submitted', 'graded')
            `).bind(exam.id).first();
            const maxRow: any = await c.env.DB.prepare(
                'SELECT COALESCE(SUM(points), 0) as total FROM exam_questions WHERE exam_id = ?'
            ).bind(exam.id).first();
            const categoryLabel = (categoriesByExamId[exam.id] && categoriesByExamId[exam.id].length)
                ? categoriesByExamId[exam.id].join(', ') : '-';
            list.push({
                id: exam.id,
                title: exam.title,
                type: exam.type,
                time_limit_minutes: exam.time_limit_minutes,
                submission_count: stat?.cnt ?? 0,
                avg_score: stat?.avg_score != null ? Math.round(stat.avg_score * 10) / 10 : null,
                max_score: maxRow?.total ?? 0,
                category: categoryLabel
            });
        }
        return successResponse(c, { exams: list });
    } catch (e: any) {
        console.error('GET /api/cbt/results error:', e);
        return errorResponse(c, e.message, 500);
    }
});

// ============================================================
// /api/cbt/exams/:examId/results  - 시험별 상세 결과 (제출 목록, 문제별 정답률)
// ============================================================
cbt.get('/exams/:examId/results', authMiddleware, async (c) => {
    try {
        const examId = parseInt(c.req.param('examId'), 10);
        if (Number.isNaN(examId)) return errorResponse(c, '유효한 시험 ID가 아닙니다', 400);

        const exam: any = await c.env.DB.prepare(
            'SELECT id, title, type, course_id FROM exams WHERE id = ?'
        ).bind(examId).first();
        if (!exam) return errorResponse(c, '시험을 찾을 수 없습니다', 404);

        const { results: submissions } = await c.env.DB.prepare(`
            SELECT es.id, es.student_id, es.total_score, es.submitted_at, es.status,
                   u.name as student_name
            FROM exam_submissions es
            LEFT JOIN users u ON u.id = es.student_id
            WHERE es.exam_id = ? ORDER BY es.submitted_at DESC
        `).bind(examId).all() as { results: { id: number; student_id: number; total_score?: number | null; submitted_at?: string | null; status: string; student_name?: string | null }[] };

        const { results: questionRows } = await c.env.DB.prepare(`
            SELECT eq.id as question_id, eq.order_index, eq.question_text, eq.points,
                   (SELECT COUNT(*) FROM exam_answers ea
                    INNER JOIN exam_submissions es ON es.id = ea.submission_id AND es.status IN ('submitted','graded')
                    WHERE ea.question_id = eq.id) as total_answered,
                   (SELECT COALESCE(SUM(ea.is_correct), 0) FROM exam_answers ea
                    INNER JOIN exam_submissions es ON es.id = ea.submission_id AND es.status IN ('submitted','graded')
                    WHERE ea.question_id = eq.id) as correct_count
            FROM exam_questions eq WHERE eq.exam_id = ? ORDER BY eq.order_index ASC, eq.id ASC
        `).bind(examId).all() as { results: { question_id: number; order_index: number; question_text: string; points: number; total_answered: number; correct_count: number }[] };

        const question_stats = (questionRows || []).map((q) => ({
            question_id: q.question_id,
            order_index: q.order_index,
            question_text: (q.question_text || '').substring(0, 80) + ((q.question_text || '').length > 80 ? '…' : ''),
            points: q.points,
            total_answered: q.total_answered,
            correct_count: q.correct_count,
            correct_rate: q.total_answered > 0 ? Math.round((q.correct_count / q.total_answered) * 100) : null
        }));

        return successResponse(c, {
            exam: { id: exam.id, title: exam.title, type: exam.type },
            submissions: submissions || [],
            question_stats
        });
    } catch (e: any) {
        console.error('GET /api/cbt/exams/:examId/results error:', e);
        return errorResponse(c, e.message, 500);
    }
});

export default cbt;
