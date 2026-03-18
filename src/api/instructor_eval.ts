import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings }>();

/** 해당 회차의 교과목 목록 (교강사직무능력평가용: subject_name, instructor_id, instructor_name) */
app.get('/subjects', authMiddleware, async (c) => {
    try {
        const sessionId = c.req.query('session_id');
        if (!sessionId) return errorResponse(c, 'session_id is required', 400);
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') return errorResponse(c, '권한이 없습니다', 403);

        const { DB } = c.env;
        const query = `
            SELECT DISTINCT
                c.name as subject_name,
                st.instructor_id as instructor_id,
                u.name as instructor_name
            FROM session_timetable st
            LEFT JOIN ncs_approved_curriculum c ON st.subject_id = c.id
            LEFT JOIN users u ON st.instructor_id = u.id
            WHERE st.session_id = ? AND (st.is_excluded IS NULL OR st.is_excluded = 0)
            ORDER BY c.name ASC, u.name ASC
        `;
        const { results } = await DB.prepare(query).bind(sessionId).all();
        let list = (results || []).map((r: any) => ({
            subject_name: r.subject_name || '',
            instructor_id: r.instructor_id ?? null,
            instructor_name: r.instructor_name || '-',
        }));

        if (user.role === 'teacher') {
            list = list.filter((row: any) => row.instructor_id === user.userId);
        }
        return successResponse(c, list);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

/** 회차별 평가 현황: 교과목 + 원장/본인 평가 완료 여부 */
app.get('/list', authMiddleware, async (c) => {
    try {
        const sessionId = c.req.query('session_id');
        if (!sessionId) return errorResponse(c, 'session_id is required', 400);
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') return errorResponse(c, '권한이 없습니다', 403);

        const { DB } = c.env;
        const subjectsQuery = `
            SELECT DISTINCT c.name as subject_name, st.instructor_id as instructor_id, u.name as instructor_name
            FROM session_timetable st
            LEFT JOIN ncs_approved_curriculum c ON st.subject_id = c.id
            LEFT JOIN users u ON st.instructor_id = u.id
            WHERE st.session_id = ? AND (st.is_excluded IS NULL OR st.is_excluded = 0)
            ORDER BY c.name ASC
        `;
        const { results: subjectRows } = await DB.prepare(subjectsQuery).bind(sessionId).all();
        let subjects = (subjectRows || []).map((r: any) => ({
            subject_name: r.subject_name || '',
            instructor_id: r.instructor_id ?? null,
            instructor_name: r.instructor_name || '-',
        }));
        if (user.role === 'teacher') {
            subjects = subjects.filter((s: any) => s.instructor_id === user.userId);
        }

        const evalRows = await DB.prepare(`
            SELECT id, subject_name, instructor_id, evaluator_type, evaluator_id, total_score, created_at
            FROM instructor_competency_evaluations
            WHERE session_id = ?
        `).bind(sessionId).all();
        const evals = (evalRows.results || []) as any[];

        const list = subjects.map((s: any) => {
            // 동일 교과목에 강사가 여러 명일 때: 원장/본인 모두 해당 담당강사(instructor_id) 기준으로 매칭 (타입 혼동 방지로 == 사용)
            const adminEval = evals.find((e: any) => e.subject_name === s.subject_name && e.evaluator_type === 'admin' && (e.instructor_id == s.instructor_id || (e.instructor_id == null && s.instructor_id == null)));
            const selfEval = evals.find((e: any) => e.subject_name === s.subject_name && e.evaluator_type === 'self' && e.evaluator_id == s.instructor_id);
            const canAdmin = user.role === 'admin';
            const canSelf = user.role === 'admin' || (user.role === 'teacher' && s.instructor_id === user.userId);
            return {
                subject_name: s.subject_name,
                instructor_id: s.instructor_id,
                instructor_name: s.instructor_name,
                admin_done: !!adminEval,
                admin_eval_id: adminEval?.id ?? null,
                self_done: !!selfEval,
                self_eval_id: selfEval?.id ?? null,
                can_admin: canAdmin,
                can_self: canSelf,
            };
        });
        return successResponse(c, list);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

/** 회차별 평가 결과 전체 (결과 보기/인쇄용: 교과목별 원장·본인 평가 상세) */
app.get('/results', authMiddleware, async (c) => {
    try {
        const sessionId = c.req.query('session_id');
        if (!sessionId) return errorResponse(c, 'session_id is required', 400);
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') return errorResponse(c, '권한이 없습니다', 403);

        const { DB } = c.env;
        const rows = await DB.prepare(`
            SELECT e.*, u.name as evaluator_name, u2.name as instructor_name
            FROM instructor_competency_evaluations e
            LEFT JOIN users u ON e.evaluator_id = u.id
            LEFT JOIN users u2 ON e.instructor_id = u2.id
            WHERE e.session_id = ?
            ORDER BY e.subject_name ASC, e.evaluator_type ASC
        `).bind(sessionId).all();
        const evals = (rows.results || []) as any[];
        if (user.role === 'teacher') {
            const subjects = await DB.prepare(`
                SELECT DISTINCT c.name as subject_name, st.instructor_id
                FROM session_timetable st
                LEFT JOIN ncs_approved_curriculum c ON st.subject_id = c.id
                WHERE st.session_id = ?
            `).bind(sessionId).all();
            const mySubjects = ((subjects.results || []) as any[]).filter((s: any) => s.instructor_id === user.userId).map((s: any) => s.subject_name);
            const filtered = evals.filter((e: any) => mySubjects.includes(e.subject_name));
            return successResponse(c, filtered);
        }
        return successResponse(c, evals);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

/** 단건 조회 by query (수정 폼용). 원장 평가 시 instructor_id 필수(강사별 구분) */
app.get('/by-params', authMiddleware, async (c) => {
    try {
        const session_id = c.req.query('session_id');
        const subject_name = c.req.query('subject_name');
        const evaluator_type = c.req.query('evaluator_type');
        const instructor_id_param = c.req.query('instructor_id');
        if (!session_id || !subject_name || !evaluator_type) return errorResponse(c, 'session_id, subject_name, evaluator_type 필요', 400);
        const user = c.get('user');
        const { DB } = c.env;
        if (evaluator_type === 'admin') {
            const instructorId = instructor_id_param != null && instructor_id_param !== '' ? parseInt(String(instructor_id_param), 10) : null;
            const row = await DB.prepare(`
                SELECT * FROM instructor_competency_evaluations
                WHERE session_id=? AND subject_name=? AND evaluator_type=? AND evaluator_id=? AND (instructor_id=? OR (instructor_id IS NULL AND ? IS NULL))
            `).bind(session_id, subject_name, evaluator_type, user.userId, instructorId, instructorId).first();
            if (!row) return successResponse(c, null);
            return successResponse(c, row);
        }
        const row = await DB.prepare(`
            SELECT * FROM instructor_competency_evaluations
            WHERE session_id=? AND subject_name=? AND evaluator_type=? AND evaluator_id=?
        `).bind(session_id, subject_name, evaluator_type, user.userId).first();
        if (!row) return successResponse(c, null);
        return successResponse(c, row);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

/** 단건 조회 by id (수정 폼용) */
app.get('/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const user = c.get('user');
        const { DB } = c.env;
        const row = await DB.prepare(`
            SELECT * FROM instructor_competency_evaluations WHERE id = ?
        `).bind(id).first();
        if (!row) return notFoundResponse(c, '평가를 찾을 수 없습니다.');
        const r = row as any;
        if (user.role === 'teacher' && r.evaluator_id !== user.userId) return errorResponse(c, '권한이 없습니다', 403);
        return successResponse(c, r);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

/** 저장 (생성/수정). evaluator_type: admin | self */
app.post('/', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        if (user.role !== 'admin' && user.role !== 'teacher') return errorResponse(c, '권한이 없습니다', 403);
        const body = await c.req.json();
        const {
            session_id,
            subject_name,
            instructor_id,
            evaluator_type,
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15,
            suggestions,
            total_score,
        } = body;

        if (!session_id || !subject_name || !evaluator_type) return errorResponse(c, 'session_id, subject_name, evaluator_type 필요', 400);
        if (!['admin', 'self'].includes(evaluator_type)) return errorResponse(c, 'evaluator_type은 admin 또는 self', 400);
        if (evaluator_type === 'admin' && user.role !== 'admin') return errorResponse(c, '원장 평가는 관리자만 가능합니다', 403);
        if (evaluator_type === 'self' && user.role === 'teacher') {
            const { DB } = c.env;
            const subjects = await DB.prepare(`
                SELECT DISTINCT c.name as subject_name, st.instructor_id
                FROM session_timetable st
                LEFT JOIN ncs_approved_curriculum c ON st.subject_id = c.id
                WHERE st.session_id = ?
            `).bind(session_id).all();
            const subs = (subjects.results || []) as any[];
            const thisSubject = subs.find((s: any) => (s.subject_name || '') === subject_name);
            if (!thisSubject || thisSubject.instructor_id !== user.userId) return errorResponse(c, '해당 교과목 담당 강사만 본인 평가가 가능합니다', 403);
        }

        const { DB } = c.env;
        const evaluator_id = user.userId;
        const instructorId = instructor_id != null ? instructor_id : (evaluator_type === 'self' ? user.userId : null);
        const scores = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15].map((v: any) => (v == null || v === '') ? null : parseInt(String(v), 10));
        const total = total_score != null && total_score !== '' ? parseInt(String(total_score), 10) : (scores.filter((n: number | null) => n != null).reduce((a: number, b: number) => a + b, 0));

        const existing = await DB.prepare(`
            SELECT id FROM instructor_competency_evaluations
            WHERE session_id=? AND subject_name=? AND evaluator_type=? AND evaluator_id=? AND (instructor_id=? OR (instructor_id IS NULL AND ? IS NULL))
        `).bind(session_id, subject_name, evaluator_type, evaluator_id, instructorId, instructorId).first() as any;

        if (existing?.id) {
            await DB.prepare(`
                UPDATE instructor_competency_evaluations SET
                    instructor_id=?, q1=?, q2=?, q3=?, q4=?, q5=?, q6=?, q7=?, q8=?, q9=?, q10=?,
                    q11=?, q12=?, q13=?, q14=?, q15=?, suggestions=?, total_score=?, updated_at=datetime('now')
                WHERE id = ?
            `).bind(instructorId, ...scores, suggestions || null, total, existing.id).run();
            return successResponse(c, { id: existing.id }, '수정되었습니다.');
        }

        await DB.prepare(`
            INSERT INTO instructor_competency_evaluations
            (session_id, subject_name, instructor_id, evaluator_type, evaluator_id, q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15, suggestions, total_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            session_id, subject_name, instructorId, evaluator_type, evaluator_id,
            ...scores, suggestions || null, total
        ).run();
        const row = await DB.prepare('SELECT id FROM instructor_competency_evaluations WHERE session_id=? AND subject_name=? AND evaluator_type=? AND evaluator_id=? AND (instructor_id=? OR (instructor_id IS NULL AND ? IS NULL))')
            .bind(session_id, subject_name, evaluator_type, evaluator_id, instructorId, instructorId).first() as any;
        return successResponse(c, { id: row?.id }, '저장되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

export default app;
