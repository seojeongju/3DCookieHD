// ============================================
// 개강서류(훈련생 하위) API
// ============================================

import { Hono } from 'hono';
import type { Bindings } from '../types';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';
import { authMiddleware, requireRole } from '../middleware/auth';
import {
  OPENING_DOCS,
  getOpeningDoc,
  openingDocExternalLink,
  openingDocPrintPath,
} from '../lib/opening_docs_catalog';
import { getEffectiveSessionStatus } from '../utils/course_session_status';

const openingDocs = new Hono<{ Bindings: Bindings }>();
const requireStaff = requireRole('admin', 'teacher', 'instructor');

const DEFAULT_INSTITUTION = '와우쓰리디홍대센터';

type SessionHeader = {
  session_id: number;
  approved_course_id: number;
  lms_course_id: number | null;
  session_number: number | null;
  session_name: string | null;
  course_name: string;
  instructor_name: string | null;
  location: string | null;
  training_start_date: string | null;
  training_end_date: string | null;
  training_time_start: string | null;
  training_time_end: string | null;
  days_of_week: string | null;
  status: string;
  effective_status: string;
  institution_name: string;
};

async function loadSessionHeader(DB: D1Database, sessionId: number): Promise<SessionHeader | null> {
  const row = await DB.prepare(
    `SELECT s.id as session_id, s.approved_course_id, s.lms_course_id, s.session_number, s.session_name,
            s.status, s.recruitment_status, s.training_start_date, s.training_end_date,
            s.training_time_start, s.training_time_end, s.days_of_week, s.location, s.instructor_name,
            a.name as course_name, a.instructor_name as approved_instructor_name
     FROM course_sessions s
     INNER JOIN approved_courses a ON a.id = s.approved_course_id
     WHERE s.id = ?`
  )
    .bind(sessionId)
    .first<any>();

  if (!row) return null;

  const effective = getEffectiveSessionStatus({
    status: row.status,
    recruitment_status: row.recruitment_status,
    training_start_date: row.training_start_date,
    training_end_date: row.training_end_date,
  });

  return {
    session_id: Number(row.session_id),
    approved_course_id: Number(row.approved_course_id),
    lms_course_id: row.lms_course_id != null ? Number(row.lms_course_id) : null,
    session_number: row.session_number != null ? Number(row.session_number) : null,
    session_name: row.session_name || null,
    course_name: row.course_name || '',
    instructor_name: row.instructor_name || row.approved_instructor_name || null,
    location: row.location || null,
    training_start_date: row.training_start_date || null,
    training_end_date: row.training_end_date || null,
    training_time_start: row.training_time_start || null,
    training_time_end: row.training_time_end || null,
    days_of_week: row.days_of_week || null,
    status: row.status || '',
    effective_status: effective,
    institution_name: DEFAULT_INSTITUTION,
  };
}

/** HWP「구분」열용 — 양식 예시(재직자/자영업자/일반)에 가깝게 축약 */
function categoryLabel(studentType: string, packageType: string): string {
  const pt = String(packageType || '').toLowerCase();
  const st = String(studentType || '').toLowerCase();
  if (pt === 'jobholder') return '재직자';
  if (pt === 'unemployed') return '일반\n(실업자)';
  if (pt === 'package1') return '취업성공\n패키지1';
  if (pt === 'package2') return '취업성공\n패키지2';
  if (pt === 'eitc') return '근로장려금';
  if (pt === 'general') return '일반';
  if (st === 'worker') return '재직자';
  if (st === 'jobseeker') return '구직자';
  if (st === 'student') return '학생';
  if (st === 'general') return '일반';
  return packageType || studentType || '';
}

async function loadEnrolledTrainees(DB: D1Database, sessionId: number) {
  const { results } = await DB.prepare(
    `SELECT e.id AS enrollment_id, e.user_id, e.status AS enrollment_status, e.enrolled_at,
            u.name, u.phone, u.email, u.birthdate, u.gender, u.address,
            d.has_application, d.has_card, d.is_hrd_net_registered,
            d.type AS student_type, d.package_type, d.status AS journey_status,
            d.payment_date, d.self_pay_amount, d.payment_method, d.status_memo
     FROM course_session_enrollments e
     INNER JOIN users u ON u.id = e.user_id
     LEFT JOIN hrd_student_details d ON d.user_id = u.id
     WHERE e.session_id = ? AND e.status IN ('approved', 'enrolled')
     ORDER BY u.name ASC, e.enrolled_at ASC`
  )
    .bind(sessionId)
    .all();

  return (results || []).map((r: any, idx: number) => {
    const selfPay = Number(r.self_pay_amount) || 0;
    const paymentDate = (r.payment_date || '').toString().trim();
    const hasSelfPay = !!(paymentDate || selfPay > 0);
    return {
      no: idx + 1,
      enrollment_id: Number(r.enrollment_id),
      user_id: Number(r.user_id),
      name: r.name || '',
      phone: r.phone || '',
      email: r.email || '',
      birthdate: r.birthdate || '',
      gender: r.gender || '',
      address: r.address || '',
      student_type: r.student_type || '',
      package_type: r.package_type || '',
      category_label: categoryLabel(r.student_type || '', r.package_type || ''),
      journey_status: r.journey_status || '',
      enrollment_status: r.enrollment_status || '',
      enrolled_at: r.enrolled_at || '',
      has_application: !!r.has_application,
      has_card: !!r.has_card,
      is_hrd_net_registered: !!r.is_hrd_net_registered,
      payment_date: paymentDate,
      self_pay_amount: selfPay,
      payment_method: r.payment_method || '',
      has_self_pay: hasSelfPay,
      status_memo: r.status_memo || '',
      /** OT참석은 아직 전용 필드 없음 — 인쇄 시 수기란 */
      ot_attended: null as boolean | null,
    };
  });
}

/** GET /api/opening-docs/catalog — 서류 목록 정의 */
openingDocs.get('/catalog', authMiddleware, requireStaff, (c) => {
  return successResponse(c, OPENING_DOCS);
});

/**
 * GET /api/opening-docs/:sessionId/pack
 * 허브용: 회차 헤더 + 서류 카드 상태 + 배정 인원
 */
openingDocs.get('/:sessionId/pack', authMiddleware, requireStaff, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      return errorResponse(c, '잘못된 회차 ID', 400);
    }

    const header = await loadSessionHeader(c.env.DB, sessionId);
    if (!header) return notFoundResponse(c, '회차를 찾을 수 없습니다');

    const trainees = await loadEnrolledTrainees(c.env.DB, sessionId);
    const docs = OPENING_DOCS.map((doc) => {
      const external = openingDocExternalLink(sessionId, doc.linkType);
      return {
        ...doc,
        href:
          doc.status === 'ready'
            ? openingDocPrintPath(sessionId, doc.code)
            : doc.status === 'link' && external
              ? external
              : null,
        trainee_count: trainees.length,
      };
    });

    const readyCount = docs.filter((d) => d.status === 'ready' || d.status === 'link').length;

    return successResponse(c, {
      session: header,
      trainee_count: trainees.length,
      docs,
      progress: {
        implemented: readyCount,
        total: docs.length,
      },
    });
  } catch (e) {
    console.error('opening-docs pack:', e);
    return errorResponse(c, '개강서류 팩 조회 실패', 500);
  }
});

/**
 * GET /api/opening-docs/:sessionId/docs/:docCode
 * 서류별 인쇄 데이터
 */
openingDocs.get('/:sessionId/docs/:docCode', authMiddleware, requireStaff, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const docCode = String(c.req.param('docCode') || '').toUpperCase();
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      return errorResponse(c, '잘못된 회차 ID', 400);
    }

    const def = getOpeningDoc(docCode);
    if (!def) return notFoundResponse(c, '서류를 찾을 수 없습니다');
    if (def.status === 'planned') {
      return errorResponse(c, '아직 구현되지 않은 서류입니다', 400);
    }
    if (def.status === 'link') {
      const href = openingDocExternalLink(sessionId, def.linkType);
      return successResponse(c, { doc: def, redirect: href });
    }

    const header = await loadSessionHeader(c.env.DB, sessionId);
    if (!header) return notFoundResponse(c, '회차를 찾을 수 없습니다');

    const trainees = await loadEnrolledTrainees(c.env.DB, sessionId);

    return successResponse(c, {
      doc: def,
      session: header,
      trainees,
      printed_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('opening-docs doc:', e);
    return errorResponse(c, '서류 데이터 조회 실패', 500);
  }
});

export default openingDocs;
