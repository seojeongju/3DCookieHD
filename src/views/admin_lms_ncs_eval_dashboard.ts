import { lmsHeaderHtml } from './components/lms_header';
import { lmsNcsSubnavTabsHtml } from './components/lms_ncs_subnav';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, LMS_SHELL_SCROLL_CLASS, lmsFixedHeaderBlock } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsEvalDashboardHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 본평가 계획 현황 - 교육과정 LMS</title>
  <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="${LMS_SHELL_ROOT_CLASS}">
    ${sidebar}
    <div class="${LMS_SHELL_COLUMN_CLASS}">
      ${lmsFixedHeaderBlock(`${lmsHeaderHtml('ncs-eval-dashboard', 'hrd')}${lmsNcsSubnavTabsHtml('dashboard')}`)}
      <div class="${LMS_SHELL_SCROLL_CLASS} bg-slate-100">
        <header class="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8 py-4 max-w-[1600px] mx-auto w-full">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">NCS 본평가 · 계획 생성 현황 <span class="text-indigo-600 text-base sm:text-lg font-extrabold">(이 과정 LMS)</span></h1>
                <p class="text-slate-600 text-sm mt-1">현재 URL의 과정에 대해 <strong>1~3차</strong> 평가실시일자·문항·도구·채점기준 등 작성 여부를 확인합니다.</p>
              </div>
              <nav class="flex flex-wrap gap-2 text-xs font-bold shrink-0" aria-label="NCS 본평가 바로가기">
                <a id="ncsLmsDashNavPlan" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가계획</a>
                <a id="ncsLmsDashNavExec" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가실행</a>
                <a id="ncsLmsDashNavResult" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가결과</a>
                <span class="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 cursor-default">통합현황</span>
              </nav>
            </div>
            <div class="mt-4 flex flex-col lg:flex-row lg:items-end gap-3">
              <div class="flex-1 min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span class="text-xs font-black text-slate-500 uppercase tracking-wider">조회 중인 과정 (이 LMS만)</span>
                <p class="mt-1 text-sm text-slate-900" id="ncsLmsDashCourseLabel">
                  <span class="font-mono font-bold text-indigo-700" id="ncsLmsDashCourseIdDisplay"></span>
                  <span class="mx-1.5 text-slate-300">|</span>
                  <span id="ncsLmsDashCourseTitle" class="font-semibold">불러오는 중…</span>
                </p>
              </div>
              <div class="flex flex-wrap items-center gap-2 shrink-0">
                <a id="ncsLmsDashHubAllCourses" href="/admin/ncs-eval-dashboard-hub" class="hidden px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50 text-sm font-black text-indigo-900 hover:bg-indigo-100 whitespace-nowrap" title="모든 과정의 본평가 계획 현황">전체 과정 현황</a>
                <button type="button" id="ncsLmsDashRefresh" class="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  <i class="fas fa-rotate-right mr-2"></i>새로고침
                </button>
              </div>
            </div>
            <p class="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <i class="fas fa-circle-info mr-1 text-slate-400"></i>
              이 페이지는 URL의 <strong>과정 ID</strong> 한 건만 표시합니다. 다른 과정은 <strong>과정 목록</strong>에서 들어가거나, 관리자 메뉴 <strong>NCS평가(본평가)관리 → 본평가 · 전체 과정 현황</strong>에서 비교하세요. 회차·시간표와 연결이 없으면 표가 비거나 오류가 날 수 있습니다.
            </p>
          </div>
        </header>

        <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full space-y-6">
          <p id="ncsDashLoading" class="text-sm text-slate-500 py-4 text-center"><i class="fas fa-spinner fa-spin mr-2"></i>현황을 불러오는 중…</p>
          <p id="ncsDashError" class="hidden text-sm text-rose-600 py-4 text-center font-bold"></p>
          <div id="ncsDashRounds" class="space-y-8"></div>
        </main>
      </div>
    </div>
  </div>

  <script>
  (function() {
    var _sid = new URLSearchParams(window.location.search).get('session_id') || '';
    var _pathCourseId = window.location.pathname.split('/')[3] || '';
    /** LMS 경로의 과정 ID만 course_id로 사용. session_id는 회차 PK라 course_id에 넣으면 ncs_plan_documents 조회가 허브와 달라짐 */
    var courseId = _pathCourseId;
    var isTeacherPath = window.location.pathname.indexOf('/teacher/') === 0;
    var basePrefix = isTeacherPath ? '/teacher' : '/admin';
    var lmsBase = basePrefix + '/courses/' + _pathCourseId + '/lms/';

    function lmsQuery() {
      try {
        var p = new URLSearchParams(window.location.search);
        if (!p.get('type') && window.location.pathname.indexOf('/lms') !== -1) p.set('type', 'hrd');
        var s = p.toString();
        return s ? '?' + s : '';
      } catch (e) {
        return '?type=hrd';
      }
    }
    var Q = lmsQuery();

    function escapeHtml(v) {
      return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    var dashboardData = null;
    var dashboardLoadSeq = 0;
    var token = localStorage.getItem('token') || '';

    function wireNavLinks() {
      var planA = document.getElementById('ncsLmsDashNavPlan');
      var execA = document.getElementById('ncsLmsDashNavExec');
      var resA = document.getElementById('ncsLmsDashNavResult');
      if (planA) planA.href = lmsBase + 'ncs-eval-plan' + Q;
      if (execA) execA.href = lmsBase + 'ncs-eval-exec' + Q;
      if (resA) resA.href = lmsBase + 'ncs-eval-result' + Q;
    }

    async function loadCourseContextLabel() {
      var idDisp = document.getElementById('ncsLmsDashCourseIdDisplay');
      var titleEl = document.getElementById('ncsLmsDashCourseTitle');
      var hubA = document.getElementById('ncsLmsDashHubAllCourses');
      if (idDisp) idDisp.textContent = String(courseId || '—');
      if (hubA && !isTeacherPath) hubA.classList.remove('hidden');
      if (!titleEl) return;
      try {
        var res = await fetch('/api/courses/' + encodeURIComponent(courseId) + '?type=hrd' + (_sid ? '&session_id=' + encodeURIComponent(_sid) : ''), {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.status === 404) {
          res = await fetch('/api/courses/' + encodeURIComponent(courseId) + (_sid ? '?session_id=' + encodeURIComponent(_sid) : ''), {
            headers: { 'Authorization': 'Bearer ' + token }
          });
        }
        var json = await res.json();
        var t = '';
        if (json && json.success && json.data) {
          t = String(json.data.title || json.data.name || '').trim();
        }
        titleEl.textContent = t || '과정명을 불러오지 못했습니다';
      } catch (e) {
        console.error(e);
        titleEl.textContent = '과정명 조회 오류';
      }
    }

    function statusLabel(ok) {
      return ok
        ? '<span class="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black">설정완료</span>'
        : '<span class="inline-flex items-center px-2 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black">미설정</span>';
    }

    function statusLink(tab, round, ok, subjectId) {
      var href = lmsBase + 'ncs-eval-plan' + Q +
        '&evaluation_round=' + encodeURIComponent(String(round)) +
        '&plan_tab=' + encodeURIComponent(String(tab)) +
        '&focus=1' +
        (subjectId != null && String(subjectId).trim() !== '' ? ('&subject_id=' + encodeURIComponent(String(subjectId))) : '');
      var title = '평가계획 이동';
      return '<a href="' + href + '" class="inline-flex items-center justify-center w-full" title="' + title + '">' + statusLabel(ok) + '</a>';
    }

    function thRequired(label) {
      return '<span class="text-rose-500 font-black mr-0.5">!</span>' + label;
    }

    function roundPlanTitle(r) {
      if (r === 1) return '1차 평가실시계획 (본평가)';
      if (r === 2) return '2차 평가실시계획 (재평가)';
      return '3차 평가실시계획 (재평가)';
    }

    function render() {
      var roundsEl = document.getElementById('ncsDashRounds');
      if (!roundsEl || !dashboardData) return;

      var rounds = dashboardData.rounds || [];

      var html = '';
      rounds.forEach(function(block) {
        var r = block.round;
        var rows = block.rows || [];
        var badge = block.plan_confirmed
          ? '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fas fa-check"></i> 평가계획 완료</span>'
          : '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200"><i class="fas fa-xmark"></i> 평가계획 미완료</span>';

        html += '<section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">';
        html += '<div class="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">';
        html += '<h2 class="text-base sm:text-lg font-black text-slate-900">' + escapeHtml(roundPlanTitle(r)) + '</h2>';
        html += '<div class="flex flex-wrap items-center gap-3">' + badge + '</div>';
        html += '</div>';

        html += '<div class="overflow-x-auto">';
        html += '<table class="w-full text-left min-w-[1180px]">';
        html += '<thead><tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">';
        html += '<th class="px-3 py-3">교과목명</th>';
        html += '<th class="px-3 py-3">평가방법</th>';
        html += '<th class="px-3 py-3">평가진행일</th>';
        html += '<th class="px-3 py-3 text-center">평가실시일자</th>';
        html += '<th class="px-3 py-3 text-center">' + thRequired('평가문항') + '</th>';
        html += '<th class="px-3 py-3 text-center">' + thRequired('평가도구') + '</th>';
        html += '<th class="px-3 py-3 text-center">' + thRequired('채점기준표') + '</th>';
        html += '<th class="px-3 py-3 text-center">' + thRequired('성취수준') + '</th>';
        html += '<th class="px-3 py-3 text-center">평가도구검토</th>';
        html += '<th class="px-3 py-3 text-center">평가계획</th>';
        html += '</tr></thead><tbody class="divide-y divide-slate-100">';

        if (rows.length === 0) {
          html += '<tr><td colspan="10" class="px-4 py-10 text-center text-sm text-slate-400">과정에 등록된 교과목이 없습니다.</td></tr>';
        } else {
          rows.forEach(function(row) {
            var rq = Q + '&evaluation_round=' + r;
            var hasPlanDocs = !!row.plan_registered;
            var hasPlanId = row.plan_id != null && String(row.plan_id).trim() !== '' && String(row.plan_id).trim() !== 'null';
            var planQ = hasPlanId ? (rq + '&plan_id=' + encodeURIComponent(row.plan_id)) : '';
            html += '<tr class="hover:bg-slate-50/80">';
            html += '<td class="px-3 py-3 text-sm font-semibold text-slate-800">' +
              escapeHtml(row.subject_label) +
              (!hasPlanDocs ? ' <span class="ml-1 align-middle px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black border border-rose-200">미등록</span>' : '') +
              '</td>';
            html += '<td class="px-3 py-3 text-sm text-slate-700">' + escapeHtml(row.method) + '</td>';
            html += '<td class="px-3 py-3 text-sm text-slate-700 whitespace-nowrap">' + escapeHtml(row.progress_label) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('schedule', r, !!row.schedule, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('questions', r, !!row.questions, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('tools', r, !!row.tools, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('rubric', r, !!row.rubric, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('achievement', r, !!row.achievement, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusLink('review', r, !!row.review, row.ncs_unit_id) + '</td>';
            html += '<td class="px-3 py-3 text-center">';
            html += '<div class="flex flex-wrap justify-center gap-1">';
            if (row.scores_missing) {
              html += '<span class="w-full text-center mb-1 px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-black">점수등록 누락</span>';
            }
            if (hasPlanId) {
              html += '<a class="px-2 py-1 rounded-lg bg-slate-800 text-white text-[10px] font-black hover:bg-slate-900" href="' + lmsBase + 'ncs-eval-exec' + planQ + '">실행</a>';
            }
            html += '<a class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700" href="' + lmsBase + 'ncs-eval-result' + rq + '">결과</a>';
            html += '</div></td>';
            html += '</tr>';
          });
        }
        html += '</tbody></table></div></section>';
      });

      roundsEl.innerHTML = html;
    }

    async function loadDashboard() {
      var loading = document.getElementById('ncsDashLoading');
      var errEl = document.getElementById('ncsDashError');
      var roundsEl = document.getElementById('ncsDashRounds');
      var mySeq = ++dashboardLoadSeq;
      if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }
      if (loading) loading.classList.remove('hidden');
      if (roundsEl) roundsEl.innerHTML = '';
      dashboardData = null;

      try {
        var res = await fetch('/api/ncs/evaluation-dashboard-hub?course_id=' + encodeURIComponent(courseId) + (_sid ? '&session_id=' + encodeURIComponent(_sid) : ''), {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var json = await res.json();
        if (mySeq !== dashboardLoadSeq) return;
        if (loading) loading.classList.add('hidden');
        if (!json || !json.success) {
          if (errEl) {
            errEl.textContent = (json && json.error) ? String(json.error) : '현황을 불러오지 못했습니다.';
            errEl.classList.remove('hidden');
          }
          return;
        }
        var payload = json.data || {};
        var apiCid = payload.course_id != null ? String(payload.course_id).trim() : String(courseId);
        if (apiCid !== String(courseId)) {
          if (errEl) {
            errEl.textContent = '응답 과정 ID가 URL과 일치하지 않습니다. 새로고침 해 주세요.';
            errEl.classList.remove('hidden');
          }
          return;
        }
        dashboardData = payload;
        render();
      } catch (e) {
        console.error(e);
        if (mySeq === dashboardLoadSeq) {
          if (loading) loading.classList.add('hidden');
          if (errEl) {
            errEl.textContent = '오류가 발생했습니다.';
            errEl.classList.remove('hidden');
          }
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      wireNavLinks();
      void loadCourseContextLabel();
      void loadDashboard();
      var refBtn = document.getElementById('ncsLmsDashRefresh');
      if (refBtn) refBtn.addEventListener('click', function() { void loadDashboard(); });
    });
  })();
  </script>
</body>
</html>
`;
