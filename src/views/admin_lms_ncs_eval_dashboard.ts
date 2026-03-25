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
          <div id="ncsDashFilterWrap" class="hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"></div>
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

    function statusIcon(ok) {
      return ok
        ? '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600" title="완료"><i class="fas fa-check text-xs"></i></span>'
        : '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-500" title="미완료"><i class="fas fa-xmark text-xs"></i></span>';
    }

    var dashboardData = null;
    var filterSubject = '';
    var filterSearch = '';

    function roundTitle(r) {
      if (r === 1) return '1차평가(본평가)';
      if (r === 2) return '2차평가(재평가)';
      return '3차평가(재평가)';
    }

    function roundSectionTitle(r) {
      return roundTitle(r) + ' 구현 계획 · 실행 현황';
    }

    function filteredRows(rows) {
      if (!Array.isArray(rows)) return [];
      return rows.filter(function(row) {
        if (filterSubject && String(row.subject_label || '') !== filterSubject) return false;
        if (filterSearch) {
          var k = filterSearch.toLowerCase();
          var blob = (row.subject_label + ' ' + row.method + ' ' + row.progress_label).toLowerCase();
          if (blob.indexOf(k) === -1) return false;
        }
        return true;
      });
    }

    function buildSubjectOptions(allRows) {
      var seen = {};
      var opts = [];
      (allRows || []).forEach(function(r) {
        var s = String(r.subject_label || '').trim();
        if (s && !seen[s]) {
          seen[s] = true;
          opts.push(s);
        }
      });
      opts.sort();
      return opts;
    }

    function renderFilterBar(subjectOpts) {
      return '<div class="flex flex-wrap items-end gap-3">' +
        '<label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex flex-col gap-1">' +
        '<span>교과목</span>' +
        '<select id="ncsDashFilterSubject" class="min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">' +
        '<option value="">전체</option>' +
        subjectOpts.map(function(s) {
          return '<option value="' + escapeHtml(s) + '"' + (filterSubject === s ? ' selected' : '') + '>' + escapeHtml(s) + '</option>';
        }).join('') +
        '</select></label>' +
        '<label class="flex-1 min-w-[180px] max-w-md text-xs font-bold text-slate-500 uppercase tracking-wider flex flex-col gap-1">' +
        '<span>검색</span>' +
        '<div class="flex rounded-xl border border-slate-200 bg-white overflow-hidden">' +
        '<span class="pl-3 flex items-center text-slate-400"><i class="fas fa-search text-sm"></i></span>' +
        '<input type="text" id="ncsDashSearch" class="flex-1 px-2 py-2 text-sm outline-none" placeholder="검색어 입력" value="' + escapeHtml(filterSearch) + '" />' +
        '</div></label>' +
        '<button type="button" id="ncsDashReset" class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50">초기화</button>' +
        '</div>';
    }

    function render() {
      var filterWrap = document.getElementById('ncsDashFilterWrap');
      var roundsEl = document.getElementById('ncsDashRounds');
      if (!filterWrap || !roundsEl || !dashboardData) return;

      var rounds = dashboardData.rounds || [];
      var allRowsFlat = [];
      rounds.forEach(function(block) {
        (block.rows || []).forEach(function(r) { allRowsFlat.push(r); });
      });
      var subjectOpts = buildSubjectOptions(allRowsFlat);

      filterWrap.classList.remove('hidden');
      filterWrap.innerHTML = renderFilterBar(subjectOpts);

      var html = '';
      rounds.forEach(function(block) {
        var r = block.round;
        var rows = filteredRows(block.rows || []);
        var badge = block.plan_confirmed
          ? '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fas fa-check"></i> 평가계획 확정</span>'
          : '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200"><i class="fas fa-xmark"></i> 평가계획 미확정</span>';

        html += '<section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">';
        html += '<div class="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">';
        html += '<h2 class="text-base sm:text-lg font-black text-slate-900">' + escapeHtml(roundSectionTitle(r)) + '</h2>';
        html += '<div class="flex flex-wrap items-center gap-3">' + badge + '</div>';
        html += '</div>';

        html += '<div class="overflow-x-auto">';
        html += '<table class="w-full text-left min-w-[1100px]">';
        html += '<thead><tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">';
        html += '<th class="px-3 py-3">교과목명</th>';
        html += '<th class="px-3 py-3">평가방법</th>';
        html += '<th class="px-3 py-3">평가진행일</th>';
        html += '<th class="px-3 py-3 text-center">평가실시일자</th>';
        html += '<th class="px-3 py-3 text-center">평가문항</th>';
        html += '<th class="px-3 py-3 text-center">평가도구</th>';
        html += '<th class="px-3 py-3 text-center">채점기준표</th>';
        html += '<th class="px-3 py-3 text-center">성취수준</th>';
        html += '<th class="px-3 py-3 text-center">평가도구검토</th>';
        html += '<th class="px-3 py-3 text-center">바로가기</th>';
        html += '</tr></thead><tbody class="divide-y divide-slate-100">';

        if (rows.length === 0) {
          html += '<tr><td colspan="10" class="px-4 py-10 text-center text-sm text-slate-400">표시할 평가 계획이 없습니다. <a class="text-sky-600 font-bold underline" href="' + lmsBase + 'ncs-eval-exec' + Q + '&evaluation_round=' + r + '">평가실행</a>에서 능력단위를 등록해 주세요.</td></tr>';
        } else {
          rows.forEach(function(row) {
            var rq = Q + (Q.indexOf('?') >= 0 ? '&' : '?') + 'evaluation_round=' + r;
            var planQ = rq + '&plan_id=' + encodeURIComponent(row.plan_id);
            html += '<tr class="hover:bg-slate-50/80">';
            html += '<td class="px-3 py-3 text-sm font-semibold text-slate-800">' + escapeHtml(row.subject_label) + '</td>';
            html += '<td class="px-3 py-3 text-sm text-slate-700">' + escapeHtml(row.method) + '</td>';
            html += '<td class="px-3 py-3 text-sm text-slate-700 whitespace-nowrap">' + escapeHtml(row.progress_label) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.schedule) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.questions) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.tools) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.rubric) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.achievement) + '</td>';
            html += '<td class="px-3 py-3 text-center">' + statusIcon(!!row.review) + '</td>';
            html += '<td class="px-3 py-3 text-center">';
            html += '<div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5">';
            if (row.scores_missing) {
              html += '<span class="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-black whitespace-nowrap">점수등록 누락</span>';
            }
            html += '<div class="flex flex-wrap justify-center gap-1">';
            html += '<a class="px-2 py-1 rounded-lg bg-sky-600 text-white text-[10px] font-black hover:bg-sky-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=schedule">일정</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black hover:bg-indigo-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=questions">문항</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-violet-600 text-white text-[10px] font-black hover:bg-violet-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=tools">도구</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-black hover:bg-amber-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=rubric">채점</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-teal-600 text-white text-[10px] font-black hover:bg-teal-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=achievement">성취</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-pink-600 text-white text-[10px] font-black hover:bg-pink-700" href="' + lmsBase + 'ncs-eval-plan' + rq + '&plan_tab=review">검토</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-slate-800 text-white text-[10px] font-black hover:bg-slate-900" href="' + lmsBase + 'ncs-eval-exec' + planQ + '">실행</a>';
            html += '<a class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700" href="' + lmsBase + 'ncs-eval-result' + rq + '">결과</a>';
            html += '</div></div></td>';
            html += '</tr>';
          });
        }
        html += '</tbody></table></div></section>';
      });

      roundsEl.innerHTML = html;

      var subSel = document.getElementById('ncsDashFilterSubject');
      if (subSel) {
        subSel.value = filterSubject;
        subSel.addEventListener('change', function() {
          filterSubject = subSel.value || '';
          render();
        });
      }
      var searchEl = document.getElementById('ncsDashSearch');
      if (searchEl) {
        searchEl.addEventListener('input', function() {
          filterSearch = (searchEl.value || '').trim();
          render();
        });
      }
      var resetBtn = document.getElementById('ncsDashReset');
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          filterSubject = '';
          filterSearch = '';
          render();
        });
      }
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
