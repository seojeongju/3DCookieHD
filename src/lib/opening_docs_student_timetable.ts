/**
 * 개강서류 D02 — 수강생 배포용 시간표
 * 첨부 엑셀(02수강생배포용시간표) 양식: 6일×N블록 + 수료조건 안내
 */

export type StudentTimetableDay = {
  day_no: number;
  date: string;
  date_display: string;
  weekday: string;
  subject_name: string;
  instructor_name: string;
  time_label: string;
  unit_period: number | null;
  /** 일차 표시용 — 단위기간 경계에 "(1단위기간)" 등 */
  day_no_label: string;
  color_key: string;
};

export type StudentTimetableBlock = {
  days: StudentTimetableDay[];
};

export type StudentTimetablePack = {
  title_lines: string[];
  classroom_label: string;
  period_summary: string;
  time_label: string;
  blocks: StudentTimetableBlock[];
  days: StudentTimetableDay[];
  footer_notes: string;
  subject_colors: Record<string, string>;
};

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

/** 교과목별 배경색 (엑셀 샘플: 주황/노랑 계열) */
const PALETTE = ['FFC000', 'FFFF00', 'A9D08E', '9BC2E6', 'F4B183', 'D9A7E7', 'FFD966', 'BDD7EE'];

function ymdParts(ymd: string): { y: number; m: number; d: number } | null {
  const m = String(ymd || '')
    .slice(0, 10)
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

function weekdayOf(ymd: string): string {
  const p = ymdParts(ymd);
  if (!p) return '';
  const dt = new Date(p.y, p.m - 1, p.d);
  return WEEKDAY[dt.getDay()] || '';
}

function formatSlashDate(ymd: string): string {
  const p = ymdParts(ymd);
  if (!p) return ymd;
  return `${p.y}/${String(p.m).padStart(2, '0')}/${String(p.d).padStart(2, '0')}`;
}

function formatSlashDateShort(ymd: string): string {
  const p = ymdParts(ymd);
  if (!p) return ymd;
  return `${p.y}/${p.m}/${p.d}`;
}

function formatTimeLabel(start: string | null | undefined, end: string | null | undefined): string {
  const s = String(start || '').trim();
  const e = String(end || '').trim();
  if (!s && !e) return 'PM 18:30~22:20';
  const toDisp = (t: string) => {
    const m = t.match(/^(\d{1,2}):(\d{2})/);
    if (!m) return t;
    const h = parseInt(m[1], 10);
    const mm = m[2];
    if (h < 12) return `AM ${String(h).padStart(2, '0')}:${mm}`;
    if (h === 12) return `PM 12:${mm}`;
    return `PM ${String(h).padStart(2, '0')}:${mm}`;
  };
  if (s && e) return `${toDisp(s)}~${toDisp(e).replace(/^(AM|PM)\s/, '')}`;
  return s || e;
}

function daysOfWeekLabel(daysOfWeek: string | null | undefined): string {
  const raw = String(daysOfWeek || '').trim();
  if (!raw) return '';
  try {
    if (raw.startsWith('[')) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.map(String).join('');
    }
  } catch {
    /* ignore */
  }
  return raw.replace(/[\[\]"'\s,]/g, '');
}

export type TimetableSlotRow = {
  training_date: string;
  period_number?: number | null;
  subject_id?: number | null;
  subject_name?: string | null;
  instructor_id?: number | null;
  instructor_name?: string | null;
  location?: string | null;
  is_excluded?: number | null;
};

export type UnitPeriodLike = {
  unit: number;
  start_date: string;
  end_date: string;
  training_days: number;
  allowed_absences: number;
};

function pickDayAggregate(
  rows: TimetableSlotRow[],
  fallbackInstructor: string | null | undefined
): { subject_name: string; instructor_name: string; location: string | null } {
  const active = rows.filter((r) => !r.is_excluded && (r.subject_id || r.subject_name));
  if (!active.length) {
    return { subject_name: '', instructor_name: fallbackInstructor || '', location: null };
  }
  // 교시가 여러 개면 가장 많이 나온 교과목·교사 선택
  const subjCount = new Map<string, number>();
  const instCount = new Map<string, number>();
  let location: string | null = null;
  for (const r of active) {
    const sn = String(r.subject_name || '').trim() || '(교과목)';
    subjCount.set(sn, (subjCount.get(sn) || 0) + 1);
    const inn = String(r.instructor_name || '').trim() || String(fallbackInstructor || '').trim();
    if (inn) instCount.set(inn, (instCount.get(inn) || 0) + 1);
    if (!location && r.location) location = String(r.location).trim();
  }
  const subject_name = [...subjCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const instructor_name =
    [...instCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || fallbackInstructor || '';
  return { subject_name, instructor_name, location };
}

function colorKeyFor(subject: string): string {
  return subject.trim() || '_empty';
}

function buildSubjectColors(subjects: string[]): Record<string, string> {
  const uniq = [...new Set(subjects.filter(Boolean))];
  const map: Record<string, string> = {};
  uniq.forEach((s, i) => {
    map[s] = PALETTE[i % PALETTE.length];
  });
  return map;
}

function findUnitForDate(date: string, units: UnitPeriodLike[]): number | null {
  for (const u of units) {
    if (date >= u.start_date && date <= u.end_date) return u.unit;
  }
  return null;
}

function buildFooterNotes(opts: {
  start: string | null;
  end: string | null;
  totalDays: number;
  units: UnitPeriodLike[];
  institutionEmail?: string;
}): string {
  const start = opts.start ? formatSlashDate(opts.start) : '';
  const end = opts.end ? formatSlashDate(opts.end) : '';
  const total = opts.totalDays || 0;
  const absAll = Math.max(0, Math.floor(total * 0.2));
  const lateAll = 2;

  const unitLines = opts.units.map((u) => {
    const late = u.unit === 1 ? 1 : 1;
    const abs = u.allowed_absences;
    if (u.unit === opts.units.length && opts.units.length > 1) {
      return `${u.unit}. 단위기간${u.unit} : 수업일수 ${u.training_days}일중 결석${abs ? abs + '번' : 'x'} + 지각또는 조퇴 ${late}`;
    }
    return `${u.unit + 1}. 단위기간${u.unit} : 수업일수 ${u.training_days}일중 결석 ${abs}번  + 지각 또는 조퇴 ${late}번`;
  });

  // 엑셀 원본 번호 체계에 맞춤: 1=전체, 2~=단위기간, 마지막=과제
  const lines = [
    '<수료조건 모두 만족해야합니다.>',
    '',
    '** 수료조건 :',
    `1. ${start}~${end} 전체 기간 출석률 80%이상 (결석 ${absAll}번 + 지각 또는 조퇴 ${lateAll}번 까지 인정)`,
    ...unitLines.map((l, i) => l.replace(/^\d+\./, `${i + 2}.`)),
    `${unitLines.length + 2}. 과제 제출 및 평가 60점이상`,
    '',
    '지각 또는 조퇴가 3번이면 1번 결석 !!',
    '결석, 지각, 조퇴 NO ! ^^',
    '',
    '',
    '** 카드미지참시 휴대전화에 어플검색=>" 고용24, 고용노동부, 직업훈련을 입력 후 검색결과에서 [고용24 직업훈련 출결관리] / 아이폰은 [고용24 스마트폰 전용앱] 앱 설치" 설치하시고, 로그인 후 qr코드 출결하시기 바랍니다._당일 행정담당선생님에게 문의 하시기 바랍니다.',
    '',
    '* 결석, 지각, 조퇴시 전화 02-3144-3137, 혹은 문자(김순희 원장: 010-2529-9211) 주세요.',
    '<와우쓰리디 커뮤니티>',
    '* 밴드 : "3D쿠키홍대" 로 검색=>" 3D프린터FebLab-WOW3D|쿠키홍대센터 "',
    `* 이메일 : ${opts.institutionEmail || 'wow3d_hd@naver.com'}  * 홈페이지 : 3dcookiehd.com`,
  ];
  return lines.join('\n');
}

export function buildStudentDistributionTimetable(input: {
  course_name: string;
  session_number: number | null;
  session_name: string | null;
  location: string | null;
  training_start_date: string | null;
  training_end_date: string | null;
  training_time_start: string | null;
  training_time_end: string | null;
  days_of_week: string | null;
  instructor_name: string | null;
  training_dates: string[];
  timetable_rows: TimetableSlotRow[];
  unit_periods: UnitPeriodLike[];
  cols_per_block?: number;
}): StudentTimetablePack {
  const cols = Math.max(1, input.cols_per_block || 6);
  const dates = (input.training_dates || []).map((d) => String(d).slice(0, 10)).filter(Boolean).sort();
  const byDate = new Map<string, TimetableSlotRow[]>();
  for (const r of input.timetable_rows || []) {
    if (r.is_excluded) continue;
    const d = String(r.training_date || '').slice(0, 10);
    if (!d) continue;
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(r);
  }

  const time_label = formatTimeLabel(input.training_time_start, input.training_time_end);
  const dow = daysOfWeekLabel(input.days_of_week);
  const start = input.training_start_date ? String(input.training_start_date).slice(0, 10) : dates[0] || null;
  const end = input.training_end_date
    ? String(input.training_end_date).slice(0, 10)
    : dates[dates.length - 1] || null;
  const startWd = start ? weekdayOf(start) : '';
  const sessionLabel =
    input.session_number != null
      ? `${input.session_number}차`
      : input.session_name
        ? String(input.session_name)
        : '';

  const title_lines = [
    `${input.course_name || '훈련과정'}${sessionLabel ? ` + ${sessionLabel}` : ''}`,
    `기간 : ${start ? formatSlashDate(start) : ''}${end ? `~${formatSlashDate(end)}` : ''}${dow ? `(${dow})` : ''}`,
  ];

  // 강의실: 시간표 location 우선
  let classroom = input.location || '';
  for (const d of dates) {
    const agg = pickDayAggregate(byDate.get(d) || [], input.instructor_name);
    if (agg.location) {
      classroom = agg.location;
      break;
    }
  }

  const unit0 = input.unit_periods?.[0];
  const unitAbsHint = unit0
    ? `단위기간 : ${unit0.training_days}일중 ${unit0.allowed_absences}일결석+지각또는 조퇴 2회까지 인정`
    : '단위기간 : 출석률 80% 기준 결석·지각·조퇴 인정';

  const period_summary = `전체훈련기간 :${start ? formatSlashDateShort(start) : ''}${startWd ? `(${startWd})` : ''} ~ ${end ? formatSlashDateShort(end) : ''}${dow ? ` ${dow}` : ''} 총 ${dates.length}일\n${unitAbsHint}`;

  // 단위기간 마지막 날짜에 표기
  const unitEndMarks = new Map<string, number>();
  for (const u of input.unit_periods || []) {
    if (u.end_date) unitEndMarks.set(String(u.end_date).slice(0, 10), u.unit);
  }

  const days: StudentTimetableDay[] = dates.map((date, idx) => {
    const agg = pickDayAggregate(byDate.get(date) || [], input.instructor_name);
    const day_no = idx + 1;
    const unitMark = unitEndMarks.get(date);
    const day_no_label = unitMark != null ? `${day_no}(${unitMark}단위기간)` : String(day_no);
    return {
      day_no,
      date,
      date_display: formatSlashDate(date),
      weekday: weekdayOf(date),
      subject_name: agg.subject_name,
      instructor_name: agg.instructor_name,
      time_label,
      unit_period: findUnitForDate(date, input.unit_periods || []),
      day_no_label,
      color_key: colorKeyFor(agg.subject_name),
    };
  });

  const subject_colors = buildSubjectColors(days.map((d) => d.subject_name));
  const blocks: StudentTimetableBlock[] = [];
  for (let i = 0; i < days.length; i += cols) {
    blocks.push({ days: days.slice(i, i + cols) });
  }
  if (!blocks.length) blocks.push({ days: [] });

  const footer_notes = buildFooterNotes({
    start,
    end,
    totalDays: dates.length,
    units: input.unit_periods || [],
  });

  return {
    title_lines,
    classroom_label: `* 강의실 : ${classroom || '제1강의실'}`,
    period_summary,
    time_label,
    blocks,
    days,
    footer_notes,
    subject_colors,
  };
}

/** 구글시트/엑셀 공통 행 배열 (단순 표) */
export function studentTimetableToAoA(pack: StudentTimetablePack): (string | number)[][] {
  const cols = Math.max(...pack.blocks.map((b) => b.days.length), 6);
  const aoa: (string | number)[][] = [];
  aoa.push([pack.title_lines.join('\n')]);
  aoa.push([pack.classroom_label]);
  aoa.push([pack.period_summary]);

  for (const block of pack.blocks) {
    const days = block.days;
    const pad = (arr: (string | number)[]) => {
      while (arr.length < cols + 1) arr.push('');
      return arr;
    };
    aoa.push(pad(['', ...days.map((d) => d.day_no_label)]));
    aoa.push(pad(['시간', ...days.map((d) => d.date_display)]));
    aoa.push(pad([pack.time_label, ...days.map((d) => d.subject_name)]));
    aoa.push(pad(['', ...days.map(() => '')]));
    aoa.push(pad(['훈련교사', ...days.map((d) => d.instructor_name)]));
  }
  aoa.push([]);
  aoa.push([pack.footer_notes]);
  return aoa;
}
