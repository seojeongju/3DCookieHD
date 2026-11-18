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
  resolveOpeningDocFunding,
  type OpeningDocAudience,
} from '../lib/opening_docs_catalog';
import { getEffectiveSessionStatus } from '../utils/course_session_status';
import {
  datesToTrainingDayLabels,
  getSessionTrainingDatesForLogs,
} from '../utils/session_training_dates';
import { buildStudentDistributionTimetable } from '../lib/opening_docs_student_timetable';
import { buildD02Csv, buildD02Workbook } from '../lib/opening_docs_d02_xlsx';
import {
  buildHrdReportTimetable,
  extractAbilityUnitLabel,
} from '../lib/opening_docs_hrd_timetable';
import { buildD03Csv, buildD03Workbook } from '../lib/opening_docs_d03_xlsx';

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

/** 국비 세부: 재직자 / 구직자(+기타 지원유형) */
function fundingDetailLabel(studentType: string, packageType: string): string {
  const pt = String(packageType || '').toLowerCase();
  const st = String(studentType || '').toLowerCase();
  if (pt === 'jobholder' || st === 'worker') return '재직자';
  if (pt === 'unemployed' || st === 'jobseeker') return '구직자';
  if (pt === 'package1') return '패키지1';
  if (pt === 'package2') return '패키지2';
  if (pt === 'eitc') return '근로장려금';
  if (pt === 'general') return '일반과정';
  if (st === 'student') return '학생';
  if (st === 'general') return '일반';
  return String(packageType || studentType || '').trim();
}

/** 대상구분 표시: 일반 / 국비(재직자) / 국비(구직자) … */
function fundingLabel(
  category: 'gov' | 'general',
  studentType?: string,
  packageType?: string
): string {
  if (category === 'general') return '일반';
  const detail = fundingDetailLabel(studentType || '', packageType || '');
  return detail ? `국비(${detail})` : '국비지원';
}

/** HWP「구분」열용 — 대상구분(국비/일반) + 재직·구직 등 세부 */
function categoryLabel(studentType: string, packageType: string, fundingCategory?: string): string {
  return fundingLabel(normalizeFundingCategory(fundingCategory), studentType, packageType);
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
      funding_detail: fundingDetailLabel(r.student_type || '', r.package_type || ''),
      funding_label: fundingLabel(funding_category, r.student_type || '', r.package_type || ''),
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
  if (!audience || audience === 'all') {
    return trainees.map((t, idx) => ({ ...t, no: idx + 1 }));
  }
  if (audience === 'none') return [];
  const filtered = trainees.filter((t) => t.funding_category === audience);
  return filtered.map((t, idx) => ({ ...t, no: idx + 1 }));
}

async function resolveAbilityUnitNames(
  DB: D1Database,
  codes: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const uniq = [...new Set(codes.map((c) => String(c || '').trim()).filter(Boolean))];
  for (let i = 0; i < uniq.length; i += 40) {
    const chunk = uniq.slice(i, i + 40);
    const ph = chunk.map(() => '?').join(',');
    try {
      const { results } = await DB.prepare(
        `SELECT code, name FROM ncs_units WHERE code IN (${ph})`
      )
        .bind(...chunk)
        .all();
      for (const r of (results || []) as any[]) {
        if (r.code && r.name) map.set(String(r.code), String(r.name));
      }
    } catch {
      /* ncs_units 없을 수 있음 */
    }
  }
  return map;
}

async function loadTimetableSlotRows(DB: D1Database, sessionId: number) {
  const { results } = await DB.prepare(
    `SELECT st.training_date, st.period_number, st.subject_id, st.instructor_id, st.location, st.is_excluded,
            c.name AS subject_name, c.ability_units_json, c.units_json, u.name AS instructor_name
     FROM session_timetable st
     LEFT JOIN ncs_approved_curriculum c ON c.id = st.subject_id
     LEFT JOIN users u ON u.id = st.instructor_id
     WHERE st.session_id = ?
     ORDER BY st.training_date ASC, st.period_number ASC`
  )
    .bind(sessionId)
    .all();

  const rows = (results || []).map((r: any) => {
    let abilityLabel = extractAbilityUnitLabel(r.ability_units_json, r.units_json);
    return {
      training_date: String(r.training_date || '').slice(0, 10),
      period_number: r.period_number != null ? Number(r.period_number) : null,
      subject_id: r.subject_id != null ? Number(r.subject_id) : null,
      subject_name: r.subject_name || null,
      ability_units_json: r.ability_units_json || null,
      units_json: r.units_json || null,
      ability_unit_name: abilityLabel || null,
      instructor_id: r.instructor_id != null ? Number(r.instructor_id) : null,
      instructor_name: r.instructor_name || null,
      location: r.location || null,
      is_excluded: r.is_excluded != null ? Number(r.is_excluded) : 0,
    };
  });

  // 코드만 있는 능력단위 → ncs_units 명칭 보강
  const codeLike = rows
    .map((r) => r.ability_unit_name || '')
    .filter((s) => /^[0-9]{8,}/.test(s) || /_\d+v\d+/i.test(s));
  if (codeLike.length) {
    const nameMap = await resolveAbilityUnitNames(DB, codeLike);
    for (const r of rows) {
      const key = String(r.ability_unit_name || '');
      if (nameMap.has(key)) r.ability_unit_name = nameMap.get(key)!;
    }
  }
  return rows;
}

async function loadPeriodConfigs(DB: D1Database, sessionId: number) {
  try {
    const { results } = await DB.prepare(
      `SELECT period_number, start_time, end_time FROM session_period_configs
       WHERE session_id = ? ORDER BY period_number ASC`
    )
      .bind(sessionId)
      .all();
    return (results || []).map((r: any) => ({
      period_number: Number(r.period_number),
      start_time: String(r.start_time || ''),
      end_time: String(r.end_time || ''),
    }));
  } catch {
    return [];
  }
}

type OrientationRegularEvalItem = {
  subject_name: string;
  ability_unit_label: string;
  ncs_type: string;
  method: string;
  eval_date: string;
};

type OrientationEvaluationSchedule = {
  pre_assessment_date: string | null;
  basic_survey_date: string | null;
  satisfaction_surveys: { label: string; eval_date: string }[];
  regular_evaluations: OrientationRegularEvalItem[];
};

function parseFirstEvalMethod(raw: any): string {
  if (!raw) return '';
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(arr) && arr.length > 0) {
      const first = arr[0];
      if (typeof first === 'string') return first.trim();
      if (first && typeof first === 'object') return String(first.name || first.method || first.title || '').trim();
    }
  } catch {
    /* ignore */
  }
  return '';
}

function extractAbilityUnitCodeAndName(abilityJson: any, unitsJson: any): { code: string; name: string } {
  const tryParse = (raw: any) => {
    if (!raw) return null;
    try {
      const p = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(p) ? p : null;
    } catch {
      return null;
    }
  };
  const arr = tryParse(abilityJson) || tryParse(unitsJson) || [];
  for (const item of arr) {
    if (!item) continue;
    if (typeof item === 'string') {
      const s = item.trim();
      if (s) return { code: /^[0-9]{8,}|_\d+v\d+/i.test(s) ? s : '', name: s };
    } else if (typeof item === 'object') {
      const code = String(item.code || item.unit_code || '').trim();
      const name = String(item.name || item.unit_name || item.title || '').trim();
      if (code || name) return { code, name };
    }
  }
  return { code: '', name: '' };
}

function normalizeEvalMethodLabel(method: string): string {
  const m = String(method || '').trim();
  if (!m) return '';
  const map: Record<string, string> = {
    checklist: '평가자 체크리스트',
    portfolio: '포트폴리오',
    written: '지필평가',
    practical: '작업형 실기',
    interview: '면접/구두발표',
    case_study: '사례연구',
    problem_solving: '문제해결 시나리오',
  };
  return map[m.toLowerCase()] || m;
}

async function loadOrientationEvaluationSchedule(
  DB: D1Database,
  sessionId: number,
  header: SessionHeader,
  timetableRows: Awaited<ReturnType<typeof loadTimetableSlotRows>>
): Promise<OrientationEvaluationSchedule> {
  const startDate = header.training_start_date ? String(header.training_start_date).slice(0, 10) : null;
  const endDate = header.training_end_date ? String(header.training_end_date).slice(0, 10) : null;

  // 1. 사전평가 실행일 (exams.type = 'practice' 의 start_time 또는 개강일)
  let preAssessmentDate: string | null = startDate;
  if (header.lms_course_id) {
    try {
      const examRow: any = await DB.prepare(
        `SELECT start_time, created_at FROM exams
         WHERE course_id = ? AND type = 'practice'
           AND (IFNULL(is_active, 0) = 1 OR start_time IS NOT NULL OR end_time IS NOT NULL)
         ORDER BY id DESC LIMIT 1`
      )
        .bind(header.lms_course_id)
        .first();
      const rawStart = examRow?.start_time ? String(examRow.start_time).slice(0, 10) : '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawStart)) {
        preAssessmentDate = rawStart;
      }
    } catch {
      /* exams 테이블 조회 실패 시 개강일 폴백 */
    }
  }

  // 2. 시간표에서 교과목별 마지막 훈련일(평가일 마지막날) 및 능력단위 수집
  const subjectMap = new Map<
    string,
    {
      subject_id: number | null;
      subject_name: string;
      ability_unit_name: string;
      ability_units_json: any;
      units_json: any;
      last_date: string;
      first_order: number;
    }
  >();
  let orderCounter = 0;
  for (const r of timetableRows) {
    if (r.is_excluded) continue;
    const subjName = String(r.subject_name || '').trim();
    if (!subjName) continue;
    const key = r.subject_id != null ? `id:${r.subject_id}` : `name:${subjName}`;
    const existing = subjectMap.get(key);
    const tDate = String(r.training_date || '').slice(0, 10);
    if (!existing) {
      subjectMap.set(key, {
        subject_id: r.subject_id,
        subject_name: subjName,
        ability_unit_name: String(r.ability_unit_name || '').trim(),
        ability_units_json: r.ability_units_json,
        units_json: r.units_json,
        last_date: tDate,
        first_order: orderCounter++,
      });
    } else {
      if (tDate && (!existing.last_date || tDate > existing.last_date)) {
        existing.last_date = tDate;
      }
      if (!existing.ability_unit_name && r.ability_unit_name) {
        existing.ability_unit_name = String(r.ability_unit_name).trim();
      }
    }
  }

  // 3. 교과목 상세(ncs_approved_curriculum: classification, evaluation_methods_json) 조회
  const currMetaById = new Map<number, { type: string; classification: string; evalMethod: string }>();
  const subjectIds = [...new Set([...subjectMap.values()].map((s) => s.subject_id).filter((id): id is number => id != null))];
  for (let i = 0; i < subjectIds.length; i += 40) {
    const chunk = subjectIds.slice(i, i + 40);
    const ph = chunk.map(() => '?').join(',');
    try {
      const { results } = await DB.prepare(
        `SELECT id, type, classification, evaluation_methods_json FROM ncs_approved_curriculum WHERE id IN (${ph})`
      )
        .bind(...chunk)
        .all();
      for (const row of (results || []) as any[]) {
        currMetaById.set(Number(row.id), {
          type: String(row.type || '').trim(),
          classification: String(row.classification || '').trim(),
          evalMethod: normalizeEvalMethodLabel(parseFirstEvalMethod(row.evaluation_methods_json)),
        });
      }
    } catch {
      /* 컬럼 없는 구형 스키마 무시 */
    }
  }

  // 4. ncs_evaluation_plans 조회 (평가방법, planned_date)
  type EvalPlanRow = {
    ncs_unit_id: number;
    unit_code: string;
    unit_name: string;
    method: string;
    planned_date: string;
  };
  const evalPlans: EvalPlanRow[] = [];
  if (header.lms_course_id) {
    try {
      const { results } = await DB.prepare(
        `SELECT p.ncs_unit_id, p.method, p.planned_date, u.code AS unit_code, u.name AS unit_name
         FROM ncs_evaluation_plans p
         JOIN ncs_units u ON p.ncs_unit_id = u.id
         WHERE p.course_id = ?
         ORDER BY COALESCE(NULLIF(p.planned_date, ''), '9999-12-31') ASC, p.id ASC`
      )
        .bind(header.lms_course_id)
        .all();
      for (const p of (results || []) as any[]) {
        evalPlans.push({
          ncs_unit_id: Number(p.ncs_unit_id),
          unit_code: String(p.unit_code || '').trim(),
          unit_name: String(p.unit_name || '').trim(),
          method: normalizeEvalMethodLabel(String(p.method || '')),
          planned_date: p.planned_date ? String(p.planned_date).slice(0, 10) : '',
        });
      }
    } catch {
      /* ncs_evaluation_plans 없을 수 있음 */
    }
  }

  // 5. 정기평가 행 구성
  const regularEvaluations: OrientationRegularEvalItem[] = [];
  const subjList = [...subjectMap.values()];

  if (subjList.length > 0) {
    // 코드->단위명 매핑 보강
    const codesToResolve: string[] = [];
    for (const s of subjList) {
      const parsed = extractAbilityUnitCodeAndName(s.ability_units_json, s.units_json);
      if (parsed.code) codesToResolve.push(parsed.code);
    }
    const unitNameMap = codesToResolve.length ? await resolveAbilityUnitNames(DB, codesToResolve) : new Map<string, string>();

    for (const s of subjList) {
      const meta = s.subject_id != null ? currMetaById.get(s.subject_id) : undefined;
      const parsed = extractAbilityUnitCodeAndName(s.ability_units_json, s.units_json);
      const code = parsed.code;
      const resolvedName = (code && unitNameMap.get(code)) || parsed.name || s.ability_unit_name || s.subject_name;

      // NCS / 비NCS 판별
      let ncsType = 'NCS';
      if (meta) {
        const cls = meta.classification.toLowerCase();
        const tp = meta.type.toLowerCase();
        if (tp === 'non_ncs' || cls.includes('비ncs') || cls.includes('비 ncs') || cls.includes('교양')) {
          ncsType = '비NCS';
        } else if (tp === 'ncs' || cls.includes('ncs')) {
          ncsType = 'NCS';
        } else if (!code) {
          ncsType = '비NCS';
        }
      } else if (!code) {
        ncsType = '비NCS';
      }

      // 평가계획 매칭 (코드 일치, CURRICULUM_id 일치, 또는 이름 일치)
      const matchedPlan = evalPlans.find((p) => {
        if (code && p.unit_code && p.unit_code === code) return true;
        if (s.subject_id != null && p.unit_code === `__CURRICULUM_${s.subject_id}`) return true;
        if (p.unit_name && (p.unit_name === resolvedName || p.unit_name === s.subject_name)) return true;
        return false;
      });

      const abilityUnitLabel =
        code && ncsType === 'NCS'
          ? `[${code}]\n${resolvedName}`
          : resolvedName;

      const method = matchedPlan?.method || meta?.evalMethod || (ncsType === 'NCS' ? '평가자 체크리스트' : '포트폴리오');
      const evalDate = matchedPlan?.planned_date || s.last_date || endDate || '';

      regularEvaluations.push({
        subject_name: s.subject_name,
        ability_unit_label: abilityUnitLabel,
        ncs_type: ncsType,
        method,
        eval_date: evalDate,
      });
    }
  } else if (evalPlans.length > 0) {
    // 시간표 미작성 시 평가계획에서 직접 구성
    for (const p of evalPlans) {
      const isCurr = p.unit_code.startsWith('__CURRICULUM_');
      const ncsType = isCurr || !p.unit_code ? '비NCS' : 'NCS';
      const abilityUnitLabel =
        !isCurr && p.unit_code ? `[${p.unit_code}]\n${p.unit_name}` : p.unit_name;
      regularEvaluations.push({
        subject_name: p.unit_name,
        ability_unit_label: abilityUnitLabel,
        ncs_type: ncsType,
        method: p.method || '포트폴리오',
        eval_date: p.planned_date || endDate || '',
      });
    }
  }

  // 날짜순 정렬
  regularEvaluations.sort((a, b) => (a.eval_date || '9999-12-31').localeCompare(b.eval_date || '9999-12-31'));

  const satisfactionSurveys = regularEvaluations.map((ev, idx) => ({
    label: `교과목 만족도조사 ${idx + 1}`,
    eval_date: ev.eval_date,
  }));

  return {
    pre_assessment_date: preAssessmentDate,
    basic_survey_date: startDate || preAssessmentDate,
    satisfaction_surveys: satisfactionSurveys,
    regular_evaluations: regularEvaluations,
  };
}

async function buildSessionDocContext(DB: D1Database, sessionId: number, header: SessionHeader) {
  const trainingDates = await getSessionTrainingDatesForLogs(
    DB,
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
  const textbookNames = await loadTextbookNames(DB, header.textbook_ids_json);
  const timetableRows = await loadTimetableSlotRows(DB, sessionId);
  const periodConfigs = await loadPeriodConfigs(DB, sessionId);
  const evaluationSchedule = await loadOrientationEvaluationSchedule(DB, sessionId, header, timetableRows);
  const studentTimetable = buildStudentDistributionTimetable({
    course_name: header.course_name,
    session_number: header.session_number,
    session_name: header.session_name,
    location: header.location,
    training_start_date: header.training_start_date,
    training_end_date: header.training_end_date,
    training_time_start: header.training_time_start,
    training_time_end: header.training_time_end,
    days_of_week: header.days_of_week,
    instructor_name: header.instructor_name,
    training_dates: trainingDates,
    timetable_rows: timetableRows,
    unit_periods: unitPeriods,
  });
  const hrdTimetable = buildHrdReportTimetable({
    course_name: header.course_name,
    session_number: header.session_number,
    session_name: header.session_name,
    location: header.location,
    instructor_name: header.instructor_name,
    training_start_date: header.training_start_date,
    training_end_date: header.training_end_date,
    training_time_start: header.training_time_start,
    training_time_end: header.training_time_end,
    institution_name: header.institution_name,
    total_hours: hourCount,
    training_dates: trainingDates,
    period_configs: periodConfigs,
    slots: timetableRows,
  });
  return {
    trainingDates,
    trainingDays,
    unitPeriods,
    attendanceRules,
    dayCount,
    hourCount,
    textbookNames,
    timetableRows,
    studentTimetable,
    hrdTimetable,
    evaluationSchedule,
  };
}

function openingDocDownloadPath(
  sessionId: number,
  code: string,
  format: string,
  funding?: OpeningDocAudience | null
): string {
  const base = `/api/opening-docs/${sessionId}/docs/${code}/download?format=${encodeURIComponent(format)}`;
  if (funding === 'gov' || funding === 'general') {
    return `${base}&funding=${funding}`;
  }
  return base;
}

function safeDownloadFilename(base: string, ext: string): string {
  const cleaned = String(base || 'opening-doc')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80);
  return `${cleaned}.${ext}`;
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

    const fundingParam = String(c.req.query('funding') || 'all').trim().toLowerCase();
    const hubFunding: OpeningDocAudience =
      fundingParam === 'gov' || fundingParam === 'general' ? fundingParam : 'all';

    const trainees = await loadEnrolledTrainees(c.env.DB, sessionId);
    const govTrainees = trainees.filter((t) => t.funding_category === 'gov');
    const govCount = govTrainees.length;
    const generalCount = trainees.filter((t) => t.funding_category === 'general').length;
    const govWorkerCount = govTrainees.filter((t) => t.funding_detail === '재직자').length;
    const govJobseekerCount = govTrainees.filter((t) => t.funding_detail === '구직자').length;
    const docs = OPENING_DOCS.map((doc) => {
      const external = openingDocExternalLink(sessionId, doc.linkType);
      const audience = (doc.audience || 'all') as OpeningDocAudience;
      const effective = resolveOpeningDocFunding(audience, hubFunding);
      const scoped = filterTraineesByAudience(trainees, effective);
      const countGov = filterTraineesByAudience(
        trainees,
        resolveOpeningDocFunding(audience, 'gov')
      ).length;
      const countGeneral = filterTraineesByAudience(
        trainees,
        resolveOpeningDocFunding(audience, 'general')
      ).length;
      const readyHref =
        doc.status === 'ready'
          ? openingDocPrintPath(sessionId, doc.code, hubFunding === 'all' ? null : hubFunding)
          : null;
      const fundForDl: OpeningDocAudience | null =
        hubFunding === 'all' ? null : hubFunding;
      const downloads =
        doc.status === 'ready'
          ? doc.code === 'D02' || doc.code === 'D03'
            ? {
                xlsx: openingDocDownloadPath(sessionId, doc.code, 'xlsx', fundForDl),
                gsheet: openingDocDownloadPath(sessionId, doc.code, 'gsheet', fundForDl),
                html: openingDocDownloadPath(sessionId, doc.code, 'html', fundForDl),
              }
            : {
                html: openingDocDownloadPath(sessionId, doc.code, 'html', fundForDl),
              }
          : doc.status === 'link' && external
            ? { link: external }
            : null;
      return {
        ...doc,
        audience,
        effective_audience: effective,
        href:
          readyHref ||
          (doc.status === 'link' && external ? external : null),
        href_gov:
          doc.status === 'ready' && audience !== 'general'
            ? openingDocPrintPath(sessionId, doc.code, 'gov')
            : null,
        href_general:
          doc.status === 'ready' && audience !== 'gov'
            ? openingDocPrintPath(sessionId, doc.code, 'general')
            : null,
        href_all:
          doc.status === 'ready' && audience === 'all'
            ? openingDocPrintPath(sessionId, doc.code)
            : audience === 'all'
              ? null
              : readyHref,
        downloads,
        trainee_count: scoped.length,
        trainee_count_gov: countGov,
        trainee_count_general: countGeneral,
      };
    });

    const readyCount = docs.filter((d) => d.status === 'ready' || d.status === 'link').length;

    return successResponse(c, {
      session: header,
      funding_filter: hubFunding,
      trainee_count: trainees.length,
      trainee_count_gov: govCount,
      trainee_count_gov_worker: govWorkerCount,
      trainee_count_gov_jobseeker: govJobseekerCount,
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

    const fundingParam = String(c.req.query('funding') || 'all').trim().toLowerCase();
    const effectiveFunding = resolveOpeningDocFunding(def.audience, fundingParam);
    const allTrainees = await loadEnrolledTrainees(c.env.DB, sessionId);
    const trainees = filterTraineesByAudience(allTrainees, effectiveFunding);
    const ctx = await buildSessionDocContext(c.env.DB, sessionId, header);

    return successResponse(c, {
      doc: {
        ...def,
        audience: def.audience || 'all',
        effective_audience: effectiveFunding,
      },
      funding_filter: effectiveFunding === 'none' ? fundingParam : effectiveFunding,
      session: {
        ...header,
        textbook_names: ctx.textbookNames,
        textbook_label: ctx.textbookNames.length ? ctx.textbookNames.join(' / ') : '',
        sd_material_label: '3D프린터운용기능사 출력 연습용 SD카드 (마이크로 sd포함)',
        training_day_count: ctx.dayCount,
        training_hour_count: ctx.hourCount,
        unit_periods: ctx.unitPeriods,
        attendance_rules: ctx.attendanceRules,
        evaluation_schedule: ctx.evaluationSchedule,
      },
      trainees,
      trainee_count_gov: allTrainees.filter((t) => t.funding_category === 'gov').length,
      trainee_count_gov_worker: allTrainees.filter(
        (t) => t.funding_category === 'gov' && t.funding_detail === '재직자'
      ).length,
      trainee_count_gov_jobseeker: allTrainees.filter(
        (t) => t.funding_category === 'gov' && t.funding_detail === '구직자'
      ).length,
      trainee_count_general: allTrainees.filter((t) => t.funding_category === 'general').length,
      training_dates: ctx.trainingDates,
      training_days: ctx.trainingDays,
      student_timetable: ctx.studentTimetable,
      hrd_timetable: ctx.hrdTimetable,
      printed_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('opening-docs doc:', e);
    return errorResponse(c, '서류 데이터 조회 실패', 500);
  }
});

/**
 * GET /api/opening-docs/:sessionId/docs/:docCode/download
 * format=xlsx|gsheet|csv|html
 */
openingDocs.get('/:sessionId/docs/:docCode/download', authMiddleware, requireStaff, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const docCode = String(c.req.param('docCode') || '').toUpperCase();
    const format = String(c.req.query('format') || 'html').trim().toLowerCase();
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
      return errorResponse(c, `연결 서류는 파일 다운로드 대신 화면에서 열어주세요: ${href || ''}`, 400);
    }

    const header = await loadSessionHeader(c.env.DB, sessionId);
    if (!header) return notFoundResponse(c, '회차를 찾을 수 없습니다');

    const fundingParam = String(c.req.query('funding') || 'all').trim().toLowerCase();
    const effectiveFunding = resolveOpeningDocFunding(def.audience, fundingParam);
    const allTrainees = await loadEnrolledTrainees(c.env.DB, sessionId);
    const trainees = filterTraineesByAudience(allTrainees, effectiveFunding);
    const ctx = await buildSessionDocContext(c.env.DB, sessionId, header);

    const baseName = `${def.code}_${header.course_name || '과정'}_${header.session_number != null ? header.session_number + '차' : '회차'}`;

    if (docCode === 'D02' && (format === 'xlsx' || format === 'excel')) {
      const buf = buildD02Workbook(ctx.studentTimetable, header.course_name || '수강생시간표');
      const filename = safeDownloadFilename(`${baseName}_수강생배포용시간표`, 'xlsx');
      return new Response(buf, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          'Cache-Control': 'no-store',
        },
      });
    }

    if (docCode === 'D02' && (format === 'gsheet' || format === 'csv' || format === 'google')) {
      const csv = buildD02Csv(ctx.studentTimetable);
      const filename = safeDownloadFilename(`${baseName}_수강생배포용시간표_구글시트`, 'csv');
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          'Cache-Control': 'no-store',
          'X-Google-Sheets-Hint': 'File > Import > Upload in Google Sheets',
        },
      });
    }

    if (docCode === 'D03' && (format === 'xlsx' || format === 'excel')) {
      const buf = buildD03Workbook(ctx.hrdTimetable, '시간표(출력)');
      const filename = safeDownloadFilename(`${baseName}_HRD신고용시간표`, 'xlsx');
      return new Response(buf, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          'Cache-Control': 'no-store',
        },
      });
    }

    if (docCode === 'D03' && (format === 'gsheet' || format === 'csv' || format === 'google')) {
      const csv = buildD03Csv(ctx.hrdTimetable);
      const filename = safeDownloadFilename(`${baseName}_HRD신고용시간표_구글시트`, 'csv');
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          'Cache-Control': 'no-store',
          'X-Google-Sheets-Hint': 'File > Import > Upload in Google Sheets',
        },
      });
    }

    // 공통 HTML 다운로드 (인쇄용 간이 문서)
    const fundingLabelText =
      effectiveFunding === 'gov' ? '국비지원' : effectiveFunding === 'general' ? '일반' : '전체';
    const tt = ctx.studentTimetable;
    const hrd = ctx.hrdTimetable;
    let bodyHtml = '';
    if (docCode === 'D03') {
      const pagesHtml = (hrd.pages || [])
        .map((page, pi) => {
          const days = page.days || [];
          const dayHead = days.map((d) => `<th colspan="2">${d.day_no}</th>`).join('');
          const dateHead = days.map((d) => `<th colspan="2">${escHtml(d.date_display)}</th>`).join('');
          const periodRows = (hrd.periods || [])
            .map((p) => {
              const cells = days
                .map((d) => {
                  const s = d.slots[p.period_number];
                  if (!s) return '<td></td><td></td>';
                  return `<td><div style="font-weight:700">${escHtml(s.subject_name)}</div><div style="font-size:10px">${escHtml(s.ability_unit_name)}</div><div style="font-size:10px;color:#334155">${escHtml(s.location)}</div></td><td style="writing-mode:horizontal-tb">${escHtml(s.instructor_name)}</td>`;
                })
                .join('');
              return `<tr><th>${p.period_number}</th><th style="font-size:10px">${escHtml(p.start_time)} ~ ${escHtml(p.end_time)}</th>${cells}</tr>`;
            })
            .join('');
          return `<section style="margin-bottom:24px;page-break-after:always">
            <h2 style="font-size:14px">HRD 신고용 시간표 ${pi + 1}</h2>
            <p><strong>교육과정</strong> ${escHtml(hrd.course_name)} · <strong>회차</strong> ${hrd.session_number != null ? hrd.session_number : '-'} · ${escHtml(hrd.period_label)}</p>
            <p>${escHtml(hrd.banner_title)}</p>
            <table border="1" cellpadding="4" style="border-collapse:collapse;width:100%;font-size:11px">
              <tr><th>교시</th><th>시간</th>${dayHead}</tr>
              <tr><th></th><th></th>${dateHead}</tr>
              ${periodRows}
            </table>
          </section>`;
        })
        .join('');
      bodyHtml = pagesHtml || '<div>시간표 데이터 없음</div>';
    } else if (docCode === 'D02') {
      const blockHtml = tt.blocks
        .map((block) => {
          const days = block.days;
          const cols = Math.max(days.length, 1);
          const dayNos = days.map((d) => `<td>${escHtml(d.day_no_label)}</td>`).join('');
          const dates = days.map((d) => `<td>${escHtml(d.date_display)}</td>`).join('');
          const subjs = days
            .map((d) => {
              const bg = tt.subject_colors[d.subject_name] || 'FFC000';
              return `<td style="background:#${bg};white-space:pre-line">${escHtml(d.subject_name)}</td>`;
            })
            .join('');
          const teachers = days.map((d) => `<td>${escHtml(d.instructor_name)}</td>`).join('');
          return `<table class="tt" style="width:100%;border-collapse:collapse;margin:8px 0;table-layout:fixed">
            <tr><td style="width:90px"></td>${dayNos}${cols < 6 ? '<td colspan="' + (6 - cols) + '"></td>' : ''}</tr>
            <tr><th>시간</th>${dates}</tr>
            <tr><th rowspan="1">${escHtml(tt.time_label)}</th>${subjs}</tr>
            <tr><th>훈련교사</th>${teachers}</tr>
          </table>`;
        })
        .join('');
      bodyHtml = `
        <h1 style="text-align:center;white-space:pre-line">${escHtml(tt.title_lines.join('\n'))}</h1>
        <p style="text-align:center;font-weight:700">${escHtml(tt.classroom_label)}</p>
        <p style="text-align:center;white-space:pre-line;background:#eef6ff;padding:8px;border:1px solid #ccc">${escHtml(tt.period_summary)}</p>
        ${blockHtml}
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:12px;border:1px solid #ccc;padding:10px">${escHtml(tt.footer_notes)}</pre>`;
    } else {
      const rows = trainees
        .map(
          (t) =>
            `<tr><td>${t.no}</td><td>${escHtml(t.funding_label)}</td><td>${escHtml(t.name)}</td><td>${escHtml(t.phone)}</td><td>${escHtml(t.birthdate)}</td></tr>`
        )
        .join('');
      bodyHtml = `
        <h1 style="text-align:center">${escHtml(def.title)}</h1>
        <p><strong>과정</strong> ${escHtml(header.course_name)}
          ${header.session_number != null ? `(${header.session_number}회차)` : ''}
          · 대상 ${escHtml(fundingLabelText)} · ${trainees.length}명</p>
        <p>${escHtml(String(header.training_start_date || '').slice(0, 10))} ~ ${escHtml(String(header.training_end_date || '').slice(0, 10))}
          · ${escHtml(header.instructor_name || '')} · ${escHtml(header.location || '')}</p>
        <p style="color:#64748b;font-size:12px">※ 서식 전체는 인쇄 화면에서 확인하고, 이 HTML은 명단·메타 요약 다운로드입니다. 완전한 양식은 인쇄 페이지에서 PDF/HTML로 저장하세요.</p>
        <p><a href="${openingDocPrintPath(sessionId, docCode, effectiveFunding === 'gov' || effectiveFunding === 'general' ? effectiveFunding : null)}">인쇄 화면 열기</a></p>
        <table style="width:100%;border-collapse:collapse" border="1" cellpadding="6">
          <thead><tr><th>NO</th><th>구분</th><th>성명</th><th>연락처</th><th>생년월일</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5" style="text-align:center">대상 없음</td></tr>'}</tbody>
        </table>`;
    }

    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><title>${escHtml(def.title)}</title>
      <style>
        body{font-family:"Malgun Gothic",sans-serif;font-size:12px;color:#111;padding:16px}
        table.tt th,table.tt td{border:1px solid #222;padding:6px;text-align:center;vertical-align:middle}
        table.tt th{background:#f3f4f6}
        @media print{.no-print{display:none}}
      </style></head><body>
      <div class="no-print" style="margin-bottom:12px">
        <button onclick="window.print()">인쇄 / PDF 저장</button>
      </div>
      ${bodyHtml}
      </body></html>`;

    const filename = safeDownloadFilename(`${baseName}_${def.title}`, 'html');
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('opening-docs download:', e);
    return errorResponse(c, '서류 다운로드 실패', 500);
  }
});

function escHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default openingDocs;
