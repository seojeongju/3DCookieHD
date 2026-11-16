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
import {
  datesToTrainingDayLabels,
  getSessionTrainingDatesForLogs,
} from '../utils/session_training_dates';

const openingDocs = new Hono<{ Bindings: Bindings }>();
const requireStaff = requireRole('admin', 'teacher', 'instructor');

const DEFAULT_INSTITUTION = '와우쓰리디홍대센터';
/** 사이트·서류 공통 교육센터 로고 */
const DEFAULT_LOGO_URL = '/static/logo.png';

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
  logo_url: string;
  textbook_ids_json?: string | null;
  total_days: number | null;
  total_hours: number | null;
  daily_hours: number | null;
};

type UnitPeriod = {
  unit: number;
  start_date: string;
  end_date: string;
  training_days: number;
  allowed_absences: number;
};

function parseHm(v: string | null | undefined): { h: number; m: number } | null {
  const m = String(v || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return { h: parseInt(m[1], 10), m: parseInt(m[2], 10) };
}

function formatHmKorean(h: number, m: number): string {
  return `${h}시 ${String(m).padStart(2, '0')}분`;
}

function addMinutes(hm: { h: number; m: number }, add: number): { h: number; m: number } {
  const total = hm.h * 60 + hm.m + add;
  const norm = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { h: Math.floor(norm / 60), m: norm % 60 };
}

function minutesBetween(a: { h: number; m: number }, b: { h: number; m: number }): number {
  return b.h * 60 + b.m - (a.h * 60 + a.m);
}

/** OT 출결 규칙 문구용 — 수업 시작/종료 기준 */
function buildAttendanceRules(timeStart: string | null, timeEnd: string | null) {
  const start = parseHm(timeStart) || { h: 18, m: 30 };
  const end = parseHm(timeEnd) || { h: 22, m: 30 };
  const durationMin = Math.max(minutesBetween(start, end), 60);
  const half = Math.floor(durationMin / 2);
  const mid = addMinutes(start, half);
  const lateOk = addMinutes(start, 10);
  const earlyOk = addMinutes(end, -10);
  const outingLimitHours = Math.max(1, Math.floor(durationMin / 120));
  return {
    normal_time_label: `${String(start.h).padStart(2, '0')}:${String(start.m).padStart(2, '0')} ~ ${String(end.h).padStart(2, '0')}:${String(end.m).padStart(2, '0')} ( ${Math.round(durationMin / 60)}시간 )`,
    late_rule: `${formatHmKorean(lateOk.h, lateOk.m)}까지 입실 시 정상, ${formatHmKorean(addMinutes(lateOk, 1).h, addMinutes(lateOk, 1).m)}부터 ${formatHmKorean(mid.h, mid.m)}까지 지각, 이후 입실 시 결석(50%미만)`,
    early_rule: `${formatHmKorean(earlyOk.h, earlyOk.m)}부터 퇴실 시 정상, ${formatHmKorean(addMinutes(mid, 1).h, addMinutes(mid, 1).m)}부터 ${formatHmKorean(addMinutes(earlyOk, -1).h, addMinutes(earlyOk, -1).m)} 사이 조퇴, 이전 퇴실 시 결석(50%미만)`,
    outing_rule: `총 외출시간이 ${outingLimitHours}시간을 초과하면 결석`,
  };
}

function ymdAddDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 단위기간: 개강일부터 30일 단위로 분할 (HWP 예시와 동일) */
function buildUnitPeriods(trainingDates: string[], startDate: string | null, endDate: string | null): UnitPeriod[] {
  const dates = (trainingDates || []).map((d) => String(d).slice(0, 10)).filter(Boolean).sort();
  if (!dates.length) {
    if (!startDate || !endDate) return [];
    return [
      {
        unit: 1,
        start_date: String(startDate).slice(0, 10),
        end_date: String(endDate).slice(0, 10),
        training_days: 0,
        allowed_absences: 0,
      },
    ];
  }
  const start = String(startDate || dates[0]).slice(0, 10);
  const units: UnitPeriod[] = [];
  let unitStart = start;
  let unitIdx = 1;
  while (true) {
    const unitEndBound = ymdAddDays(unitStart, 29);
    const inUnit = dates.filter((d) => d >= unitStart && d <= unitEndBound);
    const remaining = dates.filter((d) => d > unitEndBound);
    const unitDates = remaining.length ? inUnit : dates.filter((d) => d >= unitStart);
    if (!unitDates.length) break;
    const trainingDays = unitDates.length;
    units.push({
      unit: unitIdx,
      start_date: unitDates[0],
      end_date: unitDates[unitDates.length - 1],
      training_days: trainingDays,
      allowed_absences: Math.floor(trainingDays * 0.2),
    });
    if (!remaining.length) break;
    unitStart = ymdAddDays(unitEndBound, 1);
    unitIdx += 1;
    if (unitIdx > 12) break;
  }
  return units;
}

async function loadInstitutionSettings(DB: D1Database): Promise<{ institution_name: string; logo_url: string }> {
  try {
    const { results } = await DB.prepare(
      `SELECT key, value FROM site_settings WHERE key IN ('institution_name', 'institution_logo')`
    ).all<{ key: string; value: string | null }>();
    let institution_name = DEFAULT_INSTITUTION;
    let logo_url = DEFAULT_LOGO_URL;
    for (const r of results || []) {
      if (r.key === 'institution_name' && String(r.value || '').trim()) {
        institution_name = String(r.value).trim();
      }
      if (r.key === 'institution_logo' && String(r.value || '').trim()) {
        logo_url = String(r.value).trim();
      }
    }
    return { institution_name, logo_url };
  } catch {
    return { institution_name: DEFAULT_INSTITUTION, logo_url: DEFAULT_LOGO_URL };
  }
}

async function loadSessionHeader(DB: D1Database, sessionId: number): Promise<SessionHeader | null> {
  const row = await DB.prepare(
    `SELECT s.id as session_id, s.approved_course_id, s.lms_course_id, s.session_number, s.session_name,
            s.status, s.recruitment_status, s.training_start_date, s.training_end_date,
            s.training_time_start, s.training_time_end, s.days_of_week, s.location, s.instructor_name,
            a.name as course_name, a.instructor_name as approved_instructor_name,
            a.textbook_ids_json, a.total_days, a.total_hours, a.daily_hours
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

  const inst = await loadInstitutionSettings(DB);

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
    institution_name: inst.institution_name,
    logo_url: inst.logo_url,
    textbook_ids_json: row.textbook_ids_json || null,
    total_days: row.total_days != null ? Number(row.total_days) : null,
    total_hours: row.total_hours != null ? Number(row.total_hours) : null,
    daily_hours: row.daily_hours != null ? Number(row.daily_hours) : null,
  };
}

async function loadTextbookNames(DB: D1Database, textbookIdsJson: string | null | undefined): Promise<string[]> {
  if (!textbookIdsJson) return [];
  let ids: number[] = [];
  try {
    const parsed = JSON.parse(String(textbookIdsJson));
    if (Array.isArray(parsed)) {
      ids = parsed.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0);
    }
  } catch {
    return [];
  }
  if (!ids.length) return [];
  const names: string[] = [];
  for (let i = 0; i < ids.length; i += 40) {
    const chunk = ids.slice(i, i + 40);
    const ph = chunk.map(() => '?').join(',');
    const { results } = await DB.prepare(`SELECT id, name FROM hrd_items WHERE id IN (${ph})`).bind(...chunk).all();
    const map = new Map<number, string>();
    for (const r of (results || []) as any[]) map.set(Number(r.id), String(r.name || ''));
    for (const id of chunk) {
      const n = map.get(id);
      if (n) names.push(n);
    }
  }
  return names;
}

function normalizeFundingCategory(v: string | null | undefined): 'gov' | 'general' {
  const s = String(v || '').trim().toLowerCase();
  if (s === 'general' || s === '일반') return 'general';
  return 'gov';
}

function fundingLabel(category: 'gov' | 'general'): string {
  return category === 'general' ? '일반' : '국비지원';
}

/** HWP「구분」열용 — 대상구분(국비/일반) + 지원유형 축약 */
function categoryLabel(studentType: string, packageType: string, fundingCategory?: string): string {
  const funding = fundingLabel(normalizeFundingCategory(fundingCategory));
  const pt = String(packageType || '').toLowerCase();
  const st = String(studentType || '').toLowerCase();
  let detail = '';
  if (pt === 'jobholder') detail = '재직자';
  else if (pt === 'unemployed') detail = '실업자';
  else if (pt === 'package1') detail = '패키지1';
  else if (pt === 'package2') detail = '패키지2';
  else if (pt === 'eitc') detail = '근로장려금';
  else if (pt === 'general') detail = '일반과정';
  else if (st === 'worker') detail = '재직자';
  else if (st === 'jobseeker') detail = '구직자';
  else if (st === 'student') detail = '학생';
  else if (st === 'general') detail = '일반';
  else detail = packageType || studentType || '';
  return detail ? `${funding}\n(${detail})` : funding;
}

async function ensureFundingCategoryColumn(DB: D1Database): Promise<void> {
  try {
    await DB.prepare(
      `ALTER TABLE hrd_student_details ADD COLUMN funding_category TEXT DEFAULT 'gov'`
    ).run();
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (!/duplicate column|already exists/i.test(msg) && !/no such table/i.test(msg)) {
      console.warn('ensureFundingCategoryColumn:', msg);
    }
  }
}

async function loadEnrolledTrainees(DB: D1Database, sessionId: number) {
  await ensureFundingCategoryColumn(DB);
  const { results } = await DB.prepare(
    `SELECT e.id AS enrollment_id, e.user_id, e.status AS enrollment_status, e.enrolled_at,
            u.name, u.phone, u.email, u.birthdate, u.gender, u.address,
            d.has_application, d.has_card, d.is_hrd_net_registered,
            d.type AS student_type, d.package_type, d.funding_category, d.status AS journey_status,
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
    const funding_category = normalizeFundingCategory(r.funding_category);
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
      funding_category,
      funding_label: fundingLabel(funding_category),
      category_label: categoryLabel(r.student_type || '', r.package_type || '', funding_category),
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

function filterTraineesByAudience(
  trainees: Awaited<ReturnType<typeof loadEnrolledTrainees>>,
  audience?: string
) {
  if (!audience || audience === 'all') return trainees;
  const filtered = trainees.filter((t) => t.funding_category === audience);
  return filtered.map((t, idx) => ({ ...t, no: idx + 1 }));
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
    const govCount = trainees.filter((t) => t.funding_category === 'gov').length;
    const generalCount = trainees.filter((t) => t.funding_category === 'general').length;
    const docs = OPENING_DOCS.map((doc) => {
      const external = openingDocExternalLink(sessionId, doc.linkType);
      const audience = doc.audience || 'all';
      const scoped = filterTraineesByAudience(trainees, audience);
      return {
        ...doc,
        audience,
        href:
          doc.status === 'ready'
            ? openingDocPrintPath(sessionId, doc.code)
            : doc.status === 'link' && external
              ? external
              : null,
        trainee_count: scoped.length,
      };
    });

    const readyCount = docs.filter((d) => d.status === 'ready' || d.status === 'link').length;

    return successResponse(c, {
      session: header,
      trainee_count: trainees.length,
      trainee_count_gov: govCount,
      trainee_count_general: generalCount,
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

    const allTrainees = await loadEnrolledTrainees(c.env.DB, sessionId);
    const trainees = filterTraineesByAudience(allTrainees, def.audience || 'all');
    const textbookNames = await loadTextbookNames(c.env.DB, header.textbook_ids_json);
    const trainingDates = await getSessionTrainingDatesForLogs(
      c.env.DB,
      sessionId,
      header.training_start_date,
      header.training_end_date,
      header.days_of_week,
      header.lms_course_id,
      header.session_name
    );
    const trainingDays = datesToTrainingDayLabels(trainingDates);
    const unitPeriods = buildUnitPeriods(trainingDates, header.training_start_date, header.training_end_date);
    const attendanceRules = buildAttendanceRules(header.training_time_start, header.training_time_end);
    const dayCount = trainingDates.length || header.total_days || 0;
    const hourCount =
      header.total_hours ||
      (header.daily_hours && dayCount ? Math.round(Number(header.daily_hours) * dayCount) : null) ||
      (dayCount ? dayCount * 4 : null);

    return successResponse(c, {
      doc: def,
      session: {
        ...header,
        textbook_names: textbookNames,
        textbook_label: textbookNames.length ? textbookNames.join(' / ') : '',
        sd_material_label: '3D프린터운용기능사 출력 연습용 SD카드 (마이크로 sd포함)',
        training_day_count: dayCount,
        training_hour_count: hourCount,
        unit_periods: unitPeriods,
        attendance_rules: attendanceRules,
      },
      trainees,
      training_dates: trainingDates,
      training_days: trainingDays,
      printed_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('opening-docs doc:', e);
    return errorResponse(c, '서류 데이터 조회 실패', 500);
  }
});

export default openingDocs;
