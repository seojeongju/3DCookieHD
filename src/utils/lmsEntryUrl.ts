import { getLatestCourseSessionRowForLmsCourseId, isRegisteredLmsCourseId } from '../lib/lmsCourseContext';
import { ensureDedicatedLmsCourseForSession, resolveSessionToLmsCourseId } from './sessionCourseResolution';

export type LmsEntryRole = 'admin' | 'teacher' | 'student';

export type LmsEntryCourse = {
  id: number;
  session_id?: number | null;
  lms_course_id?: number | null;
  is_hrd?: boolean;
};

/** HRD·일반 LMS 진입 URL (경로 = LMS courses.id, HRD는 session_id 쿼리 필수) */
export function buildLmsEntryUrl(
  role: LmsEntryRole,
  course: LmsEntryCourse,
  subPath?: string
): string {
  const sub = subPath ? `/${subPath.replace(/^\//, '')}` : '';
  const base = `/${role}/courses/`;

  if (course.is_hrd) {
    const lmsId =
      course.lms_course_id != null && Number(course.lms_course_id) > 0
        ? Number(course.lms_course_id)
        : null;
    const sid =
      course.session_id != null && Number(course.session_id) > 0
        ? Number(course.session_id)
        : Number(course.id);
    // 회차 PK를 LMS path로 쓰면 courses.id와 충돌해 원본 회차 일지가 열릴 수 있음
    if (!lmsId || !Number.isFinite(sid) || sid < 1) {
      return '#';
    }
    return `${base}${lmsId}/lms${sub}?type=hrd&session_id=${encodeURIComponent(String(sid))}`;
  }

  return `${base}${course.id}/lms${sub}`;
}

/**
 * 레거시 북마크·잘못된 링크 보정
 * - 경로 숫자가 course_sessions.id 인데 session_id 쿼리 없음 → lms_course_id + session_id 로 리다이렉트
 * - 경로 숫자가 courses.id 인데 session_id 없음 → 연결 회차 session_id 추가
 */
export async function resolveLegacyHrdLmsRedirect(
  db: D1Database,
  role: LmsEntryRole,
  pathId: string,
  pathname: string,
  rawSearch: string
): Promise<string | null> {
  const rawId = parseInt(pathId, 10);
  if (!Number.isFinite(rawId) || rawId < 1) return null;

  const search = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;
  const params = new URLSearchParams(search);
  let type = (params.get('type') || '').trim().toLowerCase();
  if (type.startsWith('hrd')) type = 'hrd';

  const hasSessionId = params.get('session_id');
  const subMatch = pathname.match(/\/lms(\/.*)?$/);
  const subPath = subMatch?.[1] || '';

  const isHrdPath = type === 'hrd' || pathname.includes('/lms');
  if (!isHrdPath) return null;

  const explicitSid =
    hasSessionId != null && String(hasSessionId).trim() !== ''
      ? parseInt(String(hasSessionId), 10)
      : NaN;

  // session_id가 있으면 해당 회차의 전용 LMS로 경로 보정
  if (Number.isFinite(explicitSid) && explicitSid >= 1) {
    const session = await db
      .prepare('SELECT id, lms_course_id FROM course_sessions WHERE id = ?')
      .bind(explicitSid)
      .first<{ id: number; lms_course_id: number | null }>();
    if (!session) return null;

    let lmsId =
      session.lms_course_id != null && Number(session.lms_course_id) > 0
        ? Number(session.lms_course_id)
        : null;
    if (!lmsId) {
      lmsId = await ensureDedicatedLmsCourseForSession(db, session.id);
    } else {
      const other = await db
        .prepare('SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1')
        .bind(lmsId, session.id)
        .first();
      if (other) {
        lmsId = await ensureDedicatedLmsCourseForSession(db, session.id);
      }
    }
    if (lmsId && rawId !== lmsId) {
      params.set('type', 'hrd');
      params.set('session_id', String(session.id));
      return `/${role}/courses/${lmsId}/lms${subPath}?${params.toString()}`;
    }
    return null;
  }

  const isLmsCourse = await isRegisteredLmsCourseId(db, rawId);

  if (isLmsCourse) {
    const session = await getLatestCourseSessionRowForLmsCourseId(db, rawId);
    if (!session) return null;
    params.set('type', 'hrd');
    params.set('session_id', String(session.id));
    return `/${role}/courses/${rawId}/lms${subPath}?${params.toString()}`;
  }

  const session = await db
    .prepare('SELECT id, lms_course_id FROM course_sessions WHERE id = ?')
    .bind(rawId)
    .first<{ id: number; lms_course_id: number | null }>();
  if (!session) return null;

  let lmsId =
    session.lms_course_id != null && Number(session.lms_course_id) > 0
      ? Number(session.lms_course_id)
      : null;
  if (!lmsId) {
    lmsId = await ensureDedicatedLmsCourseForSession(db, session.id);
  } else {
    const resolved = await resolveSessionToLmsCourseId(db, session.id);
    lmsId = resolved ?? (await ensureDedicatedLmsCourseForSession(db, session.id));
  }
  if (!lmsId) return null;

  params.set('type', 'hrd');
  params.set('session_id', String(session.id));
  return `/${role}/courses/${lmsId}/lms${subPath}?${params.toString()}`;
}

/** 브라우저 인라인 스크립트용 (teacher/admin 뷰 템플릿) */
export function lmsEntryUrlClientScript(): string {
  return `
function buildLmsEntryUrl(course, subPath) {
  var path = window.location.pathname || '';
  var role = (path === '/admin' || path.indexOf('/admin/') === 0) ? 'admin'
    : (path === '/teacher' || path.indexOf('/teacher/') === 0) ? 'teacher'
    : (path === '/student' || path.indexOf('/student/') === 0) ? 'student'
    : 'teacher';
  var sub = subPath ? ('/' + String(subPath).replace(/^\\//, '')) : '';
  if (course && course.is_hrd) {
    var lmsId = (course.lms_course_id != null && Number(course.lms_course_id) > 0)
      ? Number(course.lms_course_id) : null;
    var sid = (course.session_id != null && Number(course.session_id) > 0)
      ? Number(course.session_id) : Number(course.id);
    if (!lmsId || !Number.isFinite(lmsId) || lmsId < 1) return '#';
    if (!Number.isFinite(sid) || sid < 1) return '#';
    return '/' + role + '/courses/' + lmsId + '/lms' + sub + '?type=hrd&session_id=' + encodeURIComponent(String(sid));
  }
  var cid = Number(course && course.id);
  if (!Number.isFinite(cid) || cid < 1) return '#';
  return '/' + role + '/courses/' + cid + '/lms' + sub;
}
function escHtmlAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
/** HRD hub row to LMS URL — lms_course_id 없으면 '#' (회차 PK 폴백 금지) */
function buildHrdLmsHref(row, subPath) {
  if (!row) return '#';
  var sid = (row.session_id != null && Number(row.session_id) > 0) ? Number(row.session_id)
    : (row.id != null && Number(row.id) > 0 ? Number(row.id) : null);
  if (!sid) return '#';
  var lmsId = (row.lms_course_id != null && Number(row.lms_course_id) > 0) ? Number(row.lms_course_id) : null;
  if (!lmsId) return '#';
  return buildLmsEntryUrl({ id: lmsId, session_id: sid, lms_course_id: lmsId, is_hrd: true }, subPath);
}
async function ensureAndOpenHrdLms(sessionId, preferredLmsId, subPath) {
  var sid = Number(sessionId);
  if (!Number.isFinite(sid) || sid < 1) return;
  var lmsId = (preferredLmsId != null && Number(preferredLmsId) > 0) ? Number(preferredLmsId) : null;
  var token = localStorage.getItem('token') || '';
  if (!lmsId) {
    try {
      var res = await fetch('/api/hrd/training-logs/ensure-dedicated-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ courseId: sid })
      });
      var j = await res.json();
      if (!j.success || !j.resolvedCourseId) {
        alert((j && j.error) || 'LMS 연결에 실패했습니다.');
        return;
      }
      lmsId = Number(j.resolvedCourseId);
    } catch (e) {
      alert('LMS 연결 중 오류가 발생했습니다.');
      return;
    }
  }
  var href = buildLmsEntryUrl({ id: lmsId, session_id: sid, lms_course_id: lmsId, is_hrd: true }, subPath);
  if (href && href !== '#') location.href = href;
}`;
}
