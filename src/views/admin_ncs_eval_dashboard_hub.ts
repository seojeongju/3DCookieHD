import { hrdSidebar } from './components/hrd_sidebar';

const LS_COURSE_KEY = 'hrdNcsEvalDashCourseId';

/**
 * HRD 전역: 과정 선택만으로 NCS 본평가 계획(일정·문항·도구 등) 생성 여부를 차수별로 표시
 */
export const adminNcsEvalDashboardHubHtml = (sidebar = hrdSidebar('ncs-eval-dashboard-hub')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 본평가 계획 현황 대시보드 - 교육행정</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-100 min-h-screen">
  <div class="flex min-h-screen">
    ${sidebar}
    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8 py-4 max-w-[1600px] mx-auto w-full">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">NCS 본평가 · 계획 생성 현황</h1>
              <p class="text-slate-600 text-sm mt-1">과정을 선택하면 <strong>별도 메뉴 진입 없이</strong> 1~3차별 평가실시일자·문항·도구·채점기준 등 작성 여부를 확인할 수 있습니다.</p>
            </div>
            <nav class="flex flex-wrap gap-2 text-xs font-bold shrink-0">
              <a href="/admin/ncs-eval-plan" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">전역 계획서</a>
              <a href="/admin/ncs-eval-exec" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가실행</a>
              <a href="/admin/ncs-eval-result" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">평가결과</a>
              <a href="/admin/ncs-eval" class="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100">종합 현황</a>
            </nav>
          </div>
          <div class="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
            <label class="flex-1 min-w-0 block">
              <span class="text-xs font-black text-slate-500 uppercase tracking-wider">과정선택</span>
              <select id="hrdNcsDashCourseSelect" class="mt-1 w-full max-w-4xl px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none">
                <option value="">— 과정을 선택하세요 —</option>
              </select>
            </label>
            <button type="button" id="hrdNcsDashRefresh" class="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 shrink-0">
              <i class="fas fa-rotate-right mr-2"></i>새로고침
            </button>
          </div>
          <p class="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <i class="fas fa-triangle-exclamation mr-1"></i>
            LMS URL의 <strong>과정 ID</strong>(<code class="text-[11px] bg-amber-100 px-1 rounded">/admin/courses/숫자/lms/…</code>)과 동일한 항목을 선택해야 합니다. 연결된 회차가 없으면 표가 비거나 API 오류가 날 수 있습니다.
          </p>
        </div>
      </header>

      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full space-y-6">
        <p id="hrdDashHint" class="text-sm text-slate-500 py-6 text-center">위에서 <strong>과정</strong>을 선택하면 본평가 계획 현황이 표시됩니다.</p>
        <p id="hrdDashLoading" class="hidden text-sm text-slate-500 py-4 text-center"><i class="fas fa-spinner fa-spin mr-2"></i>현황을 불러오는 중…</p>
        <p id="hrdDashError" class="hidden text-sm text-rose-600 py-4 text-center font-bold"></p>
        <div id="hrdDashRounds" class="space-y-8"></div>
      </main>
    </div>
  </div>

  <script>
  (function() {
    var selectedCourseId = '';
    var dashboardData = null;
    /** 마지막으로 성공 조회·표에 반영된 LMS courses.id (드롭다운과 비동기 경합 시 잘못된 링크 방지) */
    var linkedLmsCourseId = '';
    var dashboardLoadSeq = 0;
    var token = localStorage.getItem('token');

    function lmsBase() {
      var cid = linkedLmsCourseId || selectedCourseId;
      return '/admin/courses/' + encodeURIComponent(cid) + '/lms/';
    }

    /** 사이드바 "운영 과정 바로가기" option value가 LMS courses.id와 맞을 때 현재 선택과 동기화 */
    function syncSidebarCourseSelector(cid) {
      try {
        var side = document.getElementById('sidebarActiveCourseSelector');
        if (!side || cid == null || String(cid).trim() === '') return;
        var v = String(cid).trim();
        for (var i = 0; i < side.options.length; i++) {
          if (side.options[i].value === v) {
            side.value = v;
            return;
          }
        }
      } catch (e) { /* ignore */ }
    }
    var Q = '?type=hrd';

    function escapeHtml(v) {
      return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function statusLabel(ok) {
      return ok
        ? '<span class="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black">설정완료</span>'
        : '<span class="inline-flex items-center px-2 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black">미설정</span>';
    }

    function statusLink(tab, round, ok, subjectId) {
      var href = lmsBase() + 'ncs-eval-plan' + Q +
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

    function renderRounds() {
      var roundsEl = document.getElementById('hrdDashRounds');
      if (!roundsEl || !dashboardData) return;
      if (!linkedLmsCourseId) return;

      var rounds = dashboardData.rounds || [];

      var html = '';
      var base = lmsBase();
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
              html += '<a class="px-2 py-1 rounded-lg bg-slate-800 text-white text-[10px] font-black hover:bg-slate-900" href="' + base + 'ncs-eval-exec' + planQ + '">실행</a>';
            }
            html += '<a class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700" href="' + base + 'ncs-eval-result' + rq + '">결과</a>';
            html += '</div></td></tr>';
          });
        }
        html += '</tbody></table></div></section>';
      });

      roundsEl.innerHTML = html;
    }

    async function loadCourseList() {
      var sel = document.getElementById('hrdNcsDashCourseSelect');
      if (!sel) return;
      try {
        var res = await fetch('/api/hrd/ncs-eval/summary', {
          headers: { 'Authorization': 'Bearer ' + (token || '') }
        });
        var json = await res.json();
        if (!json || !json.success) return;
        var list = Array.isArray(json.data) ? json.data : [];
        var saved = '';
        try { saved = localStorage.getItem('${LS_COURSE_KEY}') || ''; } catch (e) {}
        sel.innerHTML = '<option value="">— 과정을 선택하세요 —</option>' +
          list.map(function(c) {
            var id = String(c.id);
            var t = (c.title || '과정') + (c.teacher_name ? ' · ' + c.teacher_name : '');
            return '<option value="' + escapeHtml(id) + '">[' + escapeHtml(id) + '] ' + escapeHtml(t) + '</option>';
          }).join('');
        if (saved && list.some(function(c) { return String(c.id) === saved; })) {
          sel.value = saved;
          selectedCourseId = saved;
        }
        setTimeout(function() { syncSidebarCourseSelector(selectedCourseId); }, 0);
        setTimeout(function() { syncSidebarCourseSelector(selectedCourseId); }, 400);
        if (selectedCourseId) await loadDashboard();
      } catch (e) {
        console.error(e);
      }
    }

    async function loadDashboard() {
      var hint = document.getElementById('hrdDashHint');
      var loading = document.getElementById('hrdDashLoading');
      var errEl = document.getElementById('hrdDashError');
      var roundsEl = document.getElementById('hrdDashRounds');
      if (!selectedCourseId) {
        linkedLmsCourseId = '';
        if (hint) hint.classList.remove('hidden');
        if (loading) loading.classList.add('hidden');
        if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }
        if (roundsEl) roundsEl.innerHTML = '';
        dashboardData = null;
        return;
      }
      var reqId = String(selectedCourseId).trim();
      var mySeq = ++dashboardLoadSeq;
      linkedLmsCourseId = '';
      if (roundsEl) roundsEl.innerHTML = '';

      try { localStorage.setItem('${LS_COURSE_KEY}', selectedCourseId); } catch (e) {}
      if (hint) hint.classList.add('hidden');
      if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }
      if (loading) loading.classList.remove('hidden');
      try {
        var res = await fetch('/api/ncs/evaluation-dashboard-hub?course_id=' + encodeURIComponent(reqId), {
          headers: { 'Authorization': 'Bearer ' + (token || '') }
        });
        var json = await res.json();
        if (mySeq !== dashboardLoadSeq) return;
        if (String(selectedCourseId).trim() !== reqId) return;
        if (loading) loading.classList.add('hidden');
        if (!json || !json.success) {
          if (errEl) {
            errEl.textContent = (json && json.error) ? String(json.error) : '현황을 불러오지 못했습니다.';
            errEl.classList.remove('hidden');
          }
          dashboardData = null;
          linkedLmsCourseId = '';
          if (roundsEl) roundsEl.innerHTML = '';
          return;
        }
        var payload = json.data || {};
        var resolvedId = payload.course_id != null ? String(payload.course_id).trim() : reqId;
        if (resolvedId !== reqId) {
          console.warn('[ncs-dash-hub] course_id mismatch', reqId, resolvedId);
        }
        linkedLmsCourseId = resolvedId;
        dashboardData = payload;
        renderRounds();
      } catch (e) {
        console.error(e);
        if (mySeq === dashboardLoadSeq) {
          if (loading) loading.classList.add('hidden');
          linkedLmsCourseId = '';
          if (errEl) {
            errEl.textContent = '오류가 발생했습니다.';
            errEl.classList.remove('hidden');
          }
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      var sel = document.getElementById('hrdNcsDashCourseSelect');
      if (sel) {
        sel.addEventListener('change', function() {
          selectedCourseId = (sel.value || '').trim();
          syncSidebarCourseSelector(selectedCourseId);
          loadDashboard();
        });
      }
      var refBtn = document.getElementById('hrdNcsDashRefresh');
      if (refBtn) refBtn.addEventListener('click', function() { loadDashboard(); });
      loadCourseList();
    });
  })();
  </script>
</body>
</html>
`;
