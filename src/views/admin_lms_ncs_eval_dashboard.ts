import { lmsHeaderHtml } from './components/lms_header';
import { lmsNcsSubnavTabsHtml } from './components/lms_ncs_subnav';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsEvalDashboardHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 평가(본평가) 통합현황 - 교육과정 LMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        ${lmsHeaderHtml('ncs-eval-dashboard', 'hrd')}
        ${lmsNcsSubnavTabsHtml('dashboard')}

        <div class="bg-white border-b border-slate-200">
          <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 class="text-2xl font-black text-slate-900">NCS 평가(본평가) 관리 대시보드</h1>
            <p class="text-slate-600 mt-1 text-sm">평가계획 · 평가실행 · 평가결과 준비 현황을 차수별로 한눈에 확인하고, 각 메뉴로 바로 이동할 수 있습니다.</p>
          </div>
        </div>

        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <p class="text-sm text-slate-500" id="ncsDashLoading">불러오는 중…</p>
          <div id="ncsDashRounds" class="space-y-8"></div>
        </div>
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
      return '<a href="' + href + '" class="inline-flex items-center justify-center w-full" title="평가계획 이동">' + statusLabel(ok) + '</a>';
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
          ? '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fas fa-check"></i> 평가계획 확정</span>'
          : '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200"><i class="fas fa-xmark"></i> 평가계획 미확정</span>';

        html += '<section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">';
        html += '<div class="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">';
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

    async function load() {
      var loading = document.getElementById('ncsDashLoading');
      try {
        var res = await fetch('/api/ncs/evaluation-dashboard?course_id=' + encodeURIComponent(courseId), {
          headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
        });
        var json = await res.json();
        if (!json || !json.success) {
          if (loading) loading.textContent = (json && json.error) ? String(json.error) : '불러오기에 실패했습니다.';
          return;
        }
        dashboardData = json.data;
        if (loading) loading.remove();
        render();
      } catch (e) {
        console.error(e);
        if (loading) loading.textContent = '오류가 발생했습니다.';
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', load);
    } else {
      load();
    }
  })();
  </script>
</body>
</html>
`;
