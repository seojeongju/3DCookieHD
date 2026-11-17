/**
 * 개강서류 D03 — HRD 신고용 훈련시간표
 * 첨부 엑셀(…_시간표.xlsx「시간표(출력)」) 양식: 회차당 9일×4교시, 교과목·능력단위·강의실·강사
 */

export type HrdPeriodConfig = {
  period_number: number;
  start_time: string;
  end_time: string;
};

export type HrdTimetableSlot = {
  training_date: string;
  period_number: number;
  subject_name: string;
  ability_unit_name: string;
  instructor_name: string;
  location: string;
};

export type HrdDayColumn = {
  day_no: number;
  date: string;
  date_display: string;
  slots: Record<number, HrdTimetableSlot | null>;
};

export type HrdTimetablePage = {
  days: HrdDayColumn[];
};

export type HrdTimetablePack = {
  course_name: string;
  period_label: string;
  session_number: number | null;
  time_range_label: string;
  instructor_label: string;
  location_label: string;
  banner_title: string;
  sheet_title: string;
  institution_name: string;
  total_days: number;
  total_hours: number | null;
  periods: HrdPeriodConfig[];
  pages: HrdTimetablePage[];
};

function ymdParts(ymd: string): { y: number; m: number; d: number } | null {
  const m = String(ymd || '')
    .slice(0, 10)
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

function formatDotRange(start: string | null, end: string | null): string {
  const fmt = (ymd: string) => {
    const p = ymdParts(ymd);
    if (!p) return ymd;
    return `${p.y}.${String(p.m).padStart(2, '0')}.${String(p.d).padStart(2, '0')}`;
  };
  if (!start && !end) return '';
  return `${start ? fmt(start) : ''}${end ? `~${fmt(end)}` : ''}`;
}

function formatDateCell(ymd: string): string {
  const p = ymdParts(ymd);
  if (!p) return ymd;
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

function formatHm(t: string | null | undefined): string {
  const m = String(t || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})/);
  if (!m) return String(t || '').trim();
  return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
}

/** ability_units_json / units_json 에서 표시용 능력단위(또는 요소)명 추출 */
export function extractAbilityUnitLabel(
  abilityUnitsJson: string | null | undefined,
  unitsJson: string | null | undefined
): string {
  const tryParse = (raw: string | null | undefined): unknown => {
    if (!raw) return null;
    try {
      return JSON.parse(String(raw));
    } catch {
      return null;
    }
  };

  const au = tryParse(abilityUnitsJson);
  if (Array.isArray(au) && au.length) {
    const first = au[0];
    if (typeof first === 'string') {
      const s = first.trim();
      // 코드만 있으면 그대로 두고, 호출측에서 ncs_units 조회로 보강 가능
      return s;
    }
    if (first && typeof first === 'object') {
      const obj = first as {
        name?: string;
        code?: string;
        elements?: Array<string | { name?: string; code?: string }>;
      };
      const els = obj.elements;
      if (Array.isArray(els) && els.length) {
        const el0 = els[0];
        if (typeof el0 === 'string' && el0.trim()) return el0.trim();
        if (el0 && typeof el0 === 'object' && el0.name) return String(el0.name).trim();
      }
      if (obj.name) return String(obj.name).trim();
      if (obj.code) return String(obj.code).trim();
    }
  }

  const uj = tryParse(unitsJson);
  if (Array.isArray(uj) && uj.length) {
    const first = uj[0];
    if (typeof first === 'string') return first.trim();
    if (first && typeof first === 'object' && (first as any).name) {
      return String((first as any).name).trim();
    }
  }
  return '';
}

export type HrdRawSlot = {
  training_date: string;
  period_number: number | null;
  subject_name?: string | null;
  ability_unit_name?: string | null;
  instructor_name?: string | null;
  location?: string | null;
  is_excluded?: number | null;
};

export function buildHrdReportTimetable(input: {
  course_name: string;
  session_number: number | null;
  session_name: string | null;
  location: string | null;
  instructor_name: string | null;
  training_start_date: string | null;
  training_end_date: string | null;
  training_time_start: string | null;
  training_time_end: string | null;
  institution_name: string;
  total_hours: number | null;
  training_dates: string[];
  period_configs: HrdPeriodConfig[];
  slots: HrdRawSlot[];
  days_per_page?: number;
}): HrdTimetablePack {
  const daysPerPage = Math.max(1, input.days_per_page || 9);
  const dates = (input.training_dates || []).map((d) => String(d).slice(0, 10)).filter(Boolean).sort();

  let periods = (input.period_configs || [])
    .filter((p) => p && Number.isFinite(p.period_number))
    .map((p) => ({
      period_number: Number(p.period_number),
      start_time: formatHm(p.start_time),
      end_time: formatHm(p.end_time),
    }))
    .sort((a, b) => a.period_number - b.period_number);

  if (!periods.length) {
    // 시간표에 등장하는 교시 번호로 보강
    const nums = new Set<number>();
    for (const s of input.slots || []) {
      if (s.period_number != null && !s.is_excluded) nums.add(Number(s.period_number));
    }
    const sorted = [...nums].sort((a, b) => a - b);
    if (sorted.length) {
      periods = sorted.map((n) => ({
        period_number: n,
        start_time: formatHm(input.training_time_start) || '18:30',
        end_time: formatHm(input.training_time_end) || '22:30',
      }));
    } else {
      periods = [1, 2, 3, 4].map((n) => ({
        period_number: n,
        start_time: '18:30',
        end_time: '19:20',
      }));
    }
  }

  const slotMap = new Map<string, HrdRawSlot>();
  for (const s of input.slots || []) {
    if (s.is_excluded) continue;
    const d = String(s.training_date || '').slice(0, 10);
    const p = s.period_number != null ? Number(s.period_number) : null;
    if (!d || p == null || !Number.isFinite(p)) continue;
    slotMap.set(`${d}|${p}`, s);
  }

  const dayColumns: HrdDayColumn[] = dates.map((date, idx) => {
    const slots: Record<number, HrdTimetableSlot | null> = {};
    for (const p of periods) {
      const raw = slotMap.get(`${date}|${p.period_number}`);
      if (!raw) {
        slots[p.period_number] = null;
        continue;
      }
      slots[p.period_number] = {
        training_date: date,
        period_number: p.period_number,
        subject_name: String(raw.subject_name || '').trim(),
        ability_unit_name: String(raw.ability_unit_name || '').trim(),
        instructor_name: String(raw.instructor_name || input.instructor_name || '').trim(),
        location: String(raw.location || input.location || '').trim(),
      };
    }
    return {
      day_no: idx + 1,
      date,
      date_display: formatDateCell(date),
      slots,
    };
  });

  const pages: HrdTimetablePage[] = [];
  for (let i = 0; i < dayColumns.length; i += daysPerPage) {
    pages.push({ days: dayColumns.slice(i, i + daysPerPage) });
  }
  if (!pages.length) pages.push({ days: [] });

  const start = input.training_start_date
    ? String(input.training_start_date).slice(0, 10)
    : dates[0] || null;
  const end = input.training_end_date
    ? String(input.training_end_date).slice(0, 10)
    : dates[dates.length - 1] || null;
  const period_label = formatDotRange(start, end);
  const time_range_label = `${formatHm(input.training_time_start) || '18:30'} ~ ${formatHm(input.training_time_end) || '22:30'}`;

  // 강사: 시간표에 등장한 강사 + 회차 강사
  const instSet = new Set<string>();
  if (input.instructor_name) {
    String(input.instructor_name)
      .split(/[,/]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((n) => instSet.add(n));
  }
  for (const s of input.slots || []) {
    const n = String(s.instructor_name || '').trim();
    if (n) instSet.add(n);
  }
  const instructor_label = [...instSet].join('/') || '';

  let location_label = input.location || '';
  for (const s of input.slots || []) {
    if (s.location && String(s.location).trim()) {
      location_label = String(s.location).trim();
      break;
    }
  }

  const total_days = dates.length;
  const total_hours =
    input.total_hours != null
      ? Number(input.total_hours)
      : periods.length && total_days
        ? total_days * periods.length
        : null;

  const instShort = (input.institution_name || '와우쓰리디홍대센터').replace(/센터$/, '센터');
  const banner_title = `${instShort} (${period_label}) (총${total_days}회 / ${total_hours != null ? total_hours : '-'}시간)`;
  const sheet_title = `${input.course_name || '훈련과정'}_훈련시간표`;

  return {
    course_name: input.course_name || '',
    period_label,
    session_number: input.session_number,
    time_range_label,
    instructor_label,
    location_label: location_label || '제1강의실',
    banner_title,
    sheet_title,
    institution_name: input.institution_name || '',
    total_days,
    total_hours,
    periods,
    pages,
  };
}
