import { lmsHeaderHtml } from './components/lms_header';
import { lmsNcsSubnavTabsHtml } from './components/lms_ncs_subnav';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsEvalDashboardHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 본평가 계획 현황 - 교육과정 LMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
      <div class="shrink-0">
        ${lmsHeaderHtml('ncs-eval-dashboard', 'hrd')}
        ${lmsNcsSubnavTabsHtml('dashboard')}
      </div>
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-slate-100">
        <header class="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8 py-4 max-w-[1600px] mx-auto w-full">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">NCS 본평가 · 계획 생성 현황</h1>
                <p class="text-slate-600 text-sm mt-1"><strong>별도 메뉴 진입 없이</strong> 1~3차별 평가실시일자·문항·도구·채점기준 등 작성 여부를 확인할 수 있습니다.</p>
              </div>
              <nav class="flex flex-wrap gap-2 text-xs font-bold shrink-0" aria-label="NCS 본평가 바로가기">
                <a id="ncsLmsDashNavPlan" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가계획</a>
                <a id="ncsLmsDashNavExec" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가실행</a>
                <a id="ncsLmsDashNavResult" href="#" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가결과</a>
                <span class="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 cursor-default">통합현황</span>
              </nav>
            </div>
            <div class="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
              <label class="flex-1 min-w-0 block">
                <span class="text-xs font-black text-slate-500 uppercase tracking-wider">과정선택</span>
                <select id="ncsLmsDashCourseSelect" disabled class="mt-1 w-full max-w-4xl px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm opacity-100 cursor-default">
                  <option value="">불러오는 중…</option>
                </select>
              </label>
              <button type="button" id="ncsLmsDashRefresh" class="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 shrink-0">
                <i class="fas fa-rotate-right mr-2"></i>새로고침
              </button>
            </div>
            <p class="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <i class="fas fa-triangle-exclamation mr-1"></i>
              이 화면은 URL의 <strong>과정 ID</strong>(<code class="text-[11px] bg-amber-100 px-1 rounded">/admin/courses/숫자/lms/…</code>)로 조회합니다. HRD 본평가 계획 현황과 동일한 교과목 목록을 쓰려면 해당 ID가 <strong>개설 회차·시간표</strong>와 연결되어 있어야 합니다. 연결이 없으면 표가 비거나 API 오류가 날 수 있습니다.
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
    var courseId = window.location.pathname.split('/')[3];
    var isTeacherPath = window.location.pathname.indexOf('/teacher/') === 0;
    var basePrefix = isTeacherPath ? '/teacher' : '/admin';
    var lmsBase = basePrefix + '/courses/' + courseId + '/lms/';

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
    var token = localStorage.getItem('token') || '';

    function wireNavLinks() {
      var planA = document.getElementById('ncsLmsDashNavPlan');
      var execA = document.getElementById('ncsLmsDashNavExec');
      var resA = document.getElementById('ncsLmsDashNavResult');
      if (planA) planA.href = lmsBase + 'ncs-eval-plan' + Q;
      if (execA) execA.href = lmsBase + 'ncs-eval-exec' + Q;
      if (resA) resA.href = lmsBase + 'ncs-eval-result' + Q;
    }

    async function hydrateCourseSelectLabel() {
      var sel = document.getElementById('ncsLmsDashCourseSelect');
      if (!sel) return;
      var label = '[' + escapeHtml(courseId) + '] 과정';
      try {
        var res = await fetch('/api/hrd/ncs-eval/summary', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          var found = json.data.find(function(c) { return String(c.id) === String(courseId); });
          if (found) {
            var t = (found.title || '과정') + (found.teacher_name ? ' · ' + found.teacher_name : '');
            label = '[' + escapeHtml(String(courseId)) + '] ' + escapeHtml(t);
          }
        }
      } catch (e) { /* ignore */ }
      sel.innerHTML = '<option value="' + escapeHtml(String(courseId)) + '">' + label + '</option>';
      sel.value = String(courseId);
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
      if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }
      if (loading) loading.classList.remove('hidden');
      if (roundsEl) roundsEl.innerHTML = '';
      dashboardData = null;

      try {
        var res = await fetch('/api/ncs/evaluation-dashboard-hub?course_id=' + encodeURIComponent(courseId), {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var json = await res.json();
        if (loading) loading.classList.add('hidden');
        if (!json || !json.success) {
          if (errEl) {
            errEl.textContent = (json && json.error) ? String(json.error) : '현황을 불러오지 못했습니다.';
            errEl.classList.remove('hidden');
          }
          return;
        }
        dashboardData = json.data;
        render();
      } catch (e) {
        console.error(e);
        if (loading) loading.classList.add('hidden');
        if (errEl) {
          errEl.textContent = '오류가 발생했습니다.';
          errEl.classList.remove('hidden');
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      wireNavLinks();
      void hydrateCourseSelectLabel();
      var refBtn = document.getElementById('ncsLmsDashRefresh');
      if (refBtn) refBtn.addEventListener('click', function() { void loadDashboard(); });
      void loadDashboard();
    });
  })();
  </script>
</body>
</html>
`;
