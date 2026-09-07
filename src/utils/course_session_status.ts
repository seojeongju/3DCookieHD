/**
 * 훈련과정(회차) 상태: 개강일·종료일·모집상황·진행상황에 따라 유효 상태를 계산합니다.
 * - recruitment_status = closed(모집 마감) + 미시작/진행중 → recruitment_closed (메인에「모집 마감」표시)
 * - recruitment_status = closed + 수업 종료 → completed
 * - status = closed(폐강) → 항상 closed
 * - status = completed(종료) → 항상 completed (관리자 수동 종료 존중)
 * - 오늘 < 개강일 → recruiting (모집중)
 * - 개강일 <= 오늘 <= 종료일 → in_progress (훈련중)
 * - 오늘 > 종료일 → completed (종료)
 * - always_open은 종료일이 지나면 completed, 아니면 always_open
 */
export type SessionLike = {
  status: string;
  training_start_date?: string | null;
  training_end_date?: string | null;
  /** 연동 홈페이지 모집상황: normal | suspended | closed(마감) */
  recruitment_status?: string | null;
};

/** 한국(Asia/Seoul) 기준 오늘 날짜 YYYY-MM-DD */
export function todayKST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** SQLite/D1용: UTC now + 9h ≈ KST 달력일 */
export const SQL_TODAY_KST = `date('now', '+9 hours')`;

/** 수업이 아직 끝나지 않았는지 (미시작 또는 진행중) */
function isCourseNotEnded(
  start: string | null,
  end: string | null,
  today: string,
  dbStatus: string
): boolean {
  if (end && today > end) return false;
  if (start && today < start) return true; // 미시작
  if (start && end && today >= start && today <= end) return true; // 진행중
  if (start && !end && today >= start) return true;
  if (!start && end && today <= end) return true;
  if (!start && !end) {
    return dbStatus === 'recruiting' || dbStatus === 'in_progress' || dbStatus === 'always_open';
  }
  return false;
}

export function getEffectiveSessionStatus(session: SessionLike, asOfDate?: string): string {
  const dbStatus = (session.status || '').trim().toLowerCase();
  const recruitment = (session.recruitment_status || '').trim().toLowerCase();
  const start = session.training_start_date ? String(session.training_start_date).trim().slice(0, 10) : null;
  const end = session.training_end_date ? String(session.training_end_date).trim().slice(0, 10) : null;
  const today = asOfDate ? asOfDate.slice(0, 10) : todayKST();

  if (dbStatus === 'closed') return 'closed';

  // 관리자「모집상황 > 마감」
  if (recruitment === 'closed') {
    if (dbStatus === 'completed') return 'completed';
    if (isCourseNotEnded(start, end, today, dbStatus)) return 'recruitment_closed';
    return 'completed';
  }

  // 관리자「진행상황 > 종료」수동 지정 존중
  if (dbStatus === 'completed') return 'completed';

  if (dbStatus === 'always_open') {
    if (end && today > end) return 'completed';
    return 'always_open';
  }

  if (start && today < start) return 'recruiting';
  if (end && today > end) return 'completed';
  if (start && end && today >= start && today <= end) return 'in_progress';
  if (start && !end && today >= start) return 'in_progress';
  if (!start && end && today <= end) return 'in_progress';

  return dbStatus || 'recruiting';
}

/**
 * 응답용 세션 객체에 effective status 적용 (status 필드를 유효 상태로 덮어씀)
 */
export function applyEffectiveStatus<T extends SessionLike>(row: T): T {
  return { ...row, status: getEffectiveSessionStatus(row) };
}

/**
 * 여러 행에 일괄 적용
 */
export function applyEffectiveStatusToList<T extends SessionLike>(rows: T[]): T[] {
  return rows.map((row) => applyEffectiveStatus(row));
}

/** 모집 마감이 아닌 경우 (NULL/빈값/normal/suspended) */
export function sqlWhereRecruitmentNotClosed(alias: string): string {
  const a = alias;
  return `(
    ${a}.recruitment_status IS NULL
    OR TRIM(COALESCE(${a}.recruitment_status, '')) = ''
    OR LOWER(TRIM(${a}.recruitment_status)) IN ('normal', 'suspended')
  )`;
}

export function sqlWhereRecruitmentClosed(alias: string): string {
  const a = alias;
  return `LOWER(TRIM(COALESCE(${a}.recruitment_status, ''))) = 'closed'`;
}

/** 날짜 기준 미시작 또는 진행중 (모집마감 여부와 무관) */
export function sqlWhereDateUpcomingOrInProgress(alias: string): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  return `(
    ${a}.status <> 'closed'
    AND ${a}.status <> 'completed'
    AND (
      (
        ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
        AND date(${a}.training_start_date) > ${today}
      )
      OR (
        ${a}.training_start_date IS NOT NULL AND ${a}.training_end_date IS NOT NULL
        AND length(trim(${a}.training_start_date)) > 0 AND length(trim(${a}.training_end_date)) > 0
        AND date(${a}.training_start_date) <= ${today} AND date(${a}.training_end_date) >= ${today}
      )
      OR (
        ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
        AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
        AND date(${a}.training_start_date) <= ${today}
      )
      OR (
        (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
        AND ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
        AND date(${a}.training_end_date) >= ${today}
      )
      OR (
        ${a}.status IN ('recruiting', 'in_progress', 'always_open')
        AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
        AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
      )
      OR (
        ${a}.status = 'always_open'
        AND (
          ${a}.training_end_date IS NULL
          OR length(trim(${a}.training_end_date)) = 0
          OR date(${a}.training_end_date) >= ${today}
        )
      )
    )
  )`;
}

/**
 * SQLite WHERE 절: getEffectiveSessionStatus(행) === target
 * @param alias course_sessions 테이블 별칭 (예: s)
 */
export function sqlWhereEffectiveStatusEquals(alias: string, target: 'in_progress' | 'recruiting' | 'completed'): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  if (target === 'in_progress') {
    return `(
      ${a}.status <> 'closed'
      AND ${a}.status <> 'completed'
      AND ${a}.status <> 'always_open'
      AND ${sqlWhereRecruitmentNotClosed(a)}
      AND (
        (
          ${a}.training_start_date IS NOT NULL AND ${a}.training_end_date IS NOT NULL
          AND length(trim(${a}.training_start_date)) > 0 AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_start_date) <= ${today} AND date(${a}.training_end_date) >= ${today}
        )
        OR (
          ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
          AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
          AND date(${a}.training_start_date) <= ${today}
        )
        OR (
          (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
          AND ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_end_date) >= ${today}
        )
        OR (
          ${a}.status = 'in_progress'
          AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
          AND (${a}.training_end_date IS NULL OR length(trim(${a}.training_end_date)) = 0)
        )
      )
    )`;
  }
  if (target === 'recruiting') {
    return `(
      ${a}.status <> 'closed'
      AND ${a}.status <> 'completed'
      AND ${a}.status <> 'always_open'
      AND ${sqlWhereRecruitmentNotClosed(a)}
      AND (
        (
          ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
          AND date(${a}.training_start_date) > ${today}
        )
        OR (
          ${a}.status = 'recruiting'
          AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0)
        )
      )
    )`;
  }
  // completed — 종료일 경과 + 관리자 종료 + 모집마감이지만 수업도 끝난 경우
  return `(
    ${a}.status = 'completed'
    OR (
      ${sqlWhereRecruitmentClosed(a)}
      AND NOT (${sqlWhereDateUpcomingOrInProgress(a)})
    )
    OR (
      ${a}.status <> 'closed'
      AND ${sqlWhereRecruitmentNotClosed(a)}
      AND (
        (
          ${a}.status = 'always_open'
          AND ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_end_date) < ${today}
        )
        OR (
          ${a}.training_end_date IS NOT NULL AND length(trim(${a}.training_end_date)) > 0
          AND date(${a}.training_end_date) < ${today}
          AND NOT (
            ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
            AND date(${a}.training_start_date) > ${today}
          )
        )
      )
    )
  )`;
}

/**
 * 홈·메인 교육과정 노출:
 * - 모집중 (개강 전)
 * - 진행중 (운영기간 중)
 * - 모집 마감 (관리자 마감, 단 수업 미시작·진행중이면 포함)
 * - 상시모집 (종료 전)
 * 수업이 완전히 끝난 과정·폐강은 제외
 */
export function sqlWhereEffectiveActive(alias: string): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  return `(
    ${a}.status <> 'closed'
    AND ${a}.status <> 'completed'
    AND (
      (
        ${sqlWhereRecruitmentNotClosed(a)}
        AND (
          ${sqlWhereEffectiveStatusEquals(a, 'recruiting')}
          OR ${sqlWhereEffectiveStatusEquals(a, 'in_progress')}
          OR (
            ${a}.status = 'always_open'
            AND (
              ${a}.training_end_date IS NULL
              OR length(trim(${a}.training_end_date)) = 0
              OR date(${a}.training_end_date) >= ${today}
            )
          )
        )
      )
      OR (
        ${sqlWhereRecruitmentClosed(a)}
        AND ${sqlWhereDateUpcomingOrInProgress(a)}
      )
    )
  )`;
}

/** 메인 목록 정렬: 모집중 → 모집마감 → 진행중 → 상시, 동일 그룹 내 개강일 가까운 순 */
export function sqlOrderHomeCourses(alias: string): string {
  const a = alias;
  const today = SQL_TODAY_KST;
  return `
    CASE
      WHEN ${sqlWhereRecruitmentClosed(a)} THEN 2
      WHEN ${a}.status = 'always_open' THEN 3
      WHEN ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
           AND date(${a}.training_start_date) > ${today} THEN 1
      WHEN ${a}.status = 'recruiting'
           AND (${a}.training_start_date IS NULL OR length(trim(${a}.training_start_date)) = 0) THEN 1
      ELSE 4
    END ASC,
    CASE
      WHEN ${a}.training_start_date IS NOT NULL AND length(trim(${a}.training_start_date)) > 0
           AND date(${a}.training_start_date) >= ${today}
        THEN date(${a}.training_start_date)
      ELSE date('9999-12-31')
    END ASC,
    ${a}.training_start_date DESC,
    ${a}.id DESC
  `;
}
