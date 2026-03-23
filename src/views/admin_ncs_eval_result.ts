import { hrdSidebar } from './components/hrd_sidebar';
import { lmsHeaderHtml } from './components/lms_header';

function resultPageScript(useFixedCourseId: boolean) {
  return `
  <script>
    const useFixedCourseId = ${useFixedCourseId ? 'true' : 'false'};
    const fixedCourseId = useFixedCourseId ? (window.location.pathname.split('/')[3] || '') : '';
    let selectedCourseId = useFixedCourseId ? fixedCourseId : '';
    let activeTab = 'grading';
    let gradingRound = 1;
    let docsRound = 1;
    let statsRound = 1;
    let selectedDocPlanId = '';

    function escapeHtml(v) {
      return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function statusLabel(st) {
      if (st === 'confirmed') return '<span class="px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">종료</span>';
      if (st === 'draft') return '<span class="px-2 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">진행중</span>';
      return '<span class="px-2 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">' + escapeHtml(st || '미정') + '</span>';
    }

    function roundLabel(n) {
      if (Number(n) === 1) return '1차평가(본평가)';
      if (Number(n) === 2) return '2차평가(재평가)';
      if (Number(n) === 3) return '3차평가(재평가)';
      return n + '차평가';
    }

    function setActiveTab(tabId) {
      activeTab = tabId;
      document.querySelectorAll('[data-ncs-result-tab-btn]').forEach(btn => {
        const active = btn.getAttribute('data-ncs-result-tab-btn') === tabId;
        btn.classList.toggle('bg-slate-900', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('border-slate-900', active);
        btn.classList.toggle('bg-white', !active);
        btn.classList.toggle('text-slate-700', !active);
        btn.classList.toggle('border-slate-200', !active);
      });
      document.querySelectorAll('[data-ncs-result-tab-panel]').forEach(panel => {
        panel.classList.toggle('hidden', panel.getAttribute('data-ncs-result-tab-panel') !== tabId);
      });
    }

    async function authFetch(url) {
      const token = localStorage.getItem('token');
      return fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
    }

    async function loadCourseOptions() {
      const sel = document.getElementById('ncsResultCourseSelect');
      if (!sel || useFixedCourseId) return;
      try {
        const res = await authFetch('/api/courses?limit=500&page=1');
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        list.forEach(c => {
          if (!c || c.id == null) return;
          const opt = document.createElement('option');
          opt.value = String(c.id);
          opt.textContent = '[' + c.id + '] ' + (c.title || c.name || '과정');
          sel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchPlansByRound(round) {
      if (!selectedCourseId) return [];
      const res = await authFetch('/api/ncs/plans?courseId=' + encodeURIComponent(selectedCourseId) + '&evaluation_round=' + round);
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    }

    function renderNoCourseMessage(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">먼저 과정을 선택해 주세요.</div>';
    }

    async function renderGradingTab() {
      const el = document.getElementById('ncsResultGradingBody');
      if (!el) return;
      if (!selectedCourseId) {
        renderNoCourseMessage('ncsResultGradingBody');
        return;
      }
      el.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">로딩 중...</div>';
      try {
        const plans = await fetchPlansByRound(gradingRound);
        if (!plans.length) {
          el.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">해당 차수의 평가 계획이 없습니다.</div>';
          return;
        }
        el.innerHTML = plans.map(plan => {
          const courseId = encodeURIComponent(selectedCourseId);
          const planId = encodeURIComponent(plan.id);
          const roundQ = encodeURIComponent(gradingRound);
          return '<div class="rounded-2xl border border-slate-200/70 bg-white p-4 flex items-center justify-between gap-3">' +
            '<div class="min-w-0">' +
              '<div class="flex items-center gap-2 mb-1">' +
                '<span class="px-2 py-0.5 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">[' + escapeHtml(plan.unit_code || '-') + ']</span>' +
                statusLabel(plan.status) +
              '</div>' +
              '<p class="font-bold text-slate-800 truncate">' + escapeHtml(plan.unit_name || '능력단위') + '</p>' +
              '<p class="text-xs text-slate-500 mt-1">평가일: ' + escapeHtml(plan.planned_date || '-') + ' · 방법: ' + escapeHtml(plan.method || '-') + '</p>' +
            '</div>' +
            '<a href="' + (useFixedCourseId ? ('/admin/courses/' + courseId + '/lms/ncs-eval-exec?evaluation_round=' + roundQ + '&plan_id=' + planId) : ('/admin/courses/' + courseId + '/lms/ncs-eval-exec?evaluation_round=' + roundQ + '&plan_id=' + planId)) + '" class="px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 text-xs font-black hover:bg-sky-100 transition whitespace-nowrap">채점 실행</a>' +
          '</div>';
        }).join('');
      } catch (e) {
        console.error(e);
        el.innerHTML = '<div class="p-6 text-center text-red-500 text-sm">데이터를 불러오지 못했습니다.</div>';
      }
    }

    async function loadDocPlanOptions() {
      const sel = document.getElementById('ncsResultDocPlanSelect');
      if (!sel) return;
      if (!selectedCourseId) {
        sel.innerHTML = '<option value="">과정을 먼저 선택해 주세요</option>';
        return;
      }
      sel.innerHTML = '<option value="">계획 선택</option>';
      const plans = await fetchPlansByRound(docsRound);
      plans.forEach(plan => {
        const opt = document.createElement('option');
        opt.value = String(plan.id);
        opt.textContent = '[' + (plan.unit_code || '-') + '] ' + (plan.unit_name || '능력단위') + ' · ' + (plan.planned_date || '-');
        sel.appendChild(opt);
      });
      if (selectedDocPlanId && plans.some(p => String(p.id) === String(selectedDocPlanId))) {
        sel.value = String(selectedDocPlanId);
      } else {
        selectedDocPlanId = '';
      }
    }

    async function renderDocResults() {
      const body = document.getElementById('ncsResultDocBody');
      if (!body) return;
      if (!selectedCourseId) {
        renderNoCourseMessage('ncsResultDocBody');
        return;
      }
      if (!selectedDocPlanId) {
        body.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">평가 계획을 선택해 주세요.</div>';
        return;
      }
      body.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">로딩 중...</div>';
      try {
        const res = await authFetch('/api/ncs/evaluations/' + encodeURIComponent(selectedDocPlanId));
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (!rows.length) {
          body.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">채점 결과가 없습니다.</div>';
          return;
        }
        body.innerHTML = '<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-slate-50 border-b border-slate-100"><tr>' +
          '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">성명</th>' +
          '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">점수</th>' +
          '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">이수여부</th>' +
          '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">채점결과문서</th>' +
          '</tr></thead><tbody class="divide-y divide-slate-100">' +
          rows.map(row => {
            const studentId = encodeURIComponent(row.student_id);
            const courseId = encodeURIComponent(selectedCourseId);
            const reportHref = (useFixedCourseId ? '/admin/courses/' + courseId + '/lms/ncs-report/' + studentId : '/admin/courses/' + courseId + '/lms/ncs-report/' + studentId);
            return '<tr>' +
              '<td class="px-4 py-3 text-sm font-semibold text-slate-800">' + escapeHtml(row.name || '-') + '</td>' +
              '<td class="px-4 py-3 text-sm text-slate-700 text-center">' + escapeHtml(row.score ?? '-') + '</td>' +
              '<td class="px-4 py-3 text-center">' + (row.is_passed ? '<span class="px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">이수</span>' : '<span class="px-2 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">미이수</span>') + '</td>' +
              '<td class="px-4 py-3"><a target="_blank" href="' + reportHref + '" class="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50">개인 결과문서</a></td>' +
            '</tr>';
          }).join('') +
          '</tbody></table></div>';
      } catch (e) {
        console.error(e);
        body.innerHTML = '<div class="p-6 text-center text-red-500 text-sm">채점결과문서를 불러오지 못했습니다.</div>';
      }
    }

    async function renderStatsTab() {
      const body = document.getElementById('ncsResultStatsBody');
      if (!body) return;
      if (!selectedCourseId) {
        renderNoCourseMessage('ncsResultStatsBody');
        return;
      }
      body.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">로딩 중...</div>';
      try {
        const plans = await fetchPlansByRound(statsRound);
        if (!plans.length) {
          body.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">해당 차수의 결과 데이터가 없습니다.</div>';
          return;
        }
        const statsRows = [];
        for (const plan of plans) {
          const res = await authFetch('/api/ncs/evaluations/' + encodeURIComponent(plan.id));
          const json = await res.json();
          const rows = Array.isArray(json?.data) ? json.data : [];
          const graded = rows.filter(r => r.score != null);
          const passCount = graded.filter(r => Number(r.is_passed) === 1).length;
          const avg = graded.length ? (graded.reduce((acc, r) => acc + Number(r.score || 0), 0) / graded.length) : 0;
          const passRate = graded.length ? (passCount / graded.length * 100) : 0;
          statsRows.push({
            plan,
            gradedCount: graded.length,
            passCount,
            avgScore: avg.toFixed(1),
            passRate: passRate.toFixed(1),
          });
        }

        const summary = statsRows.map((s, i) =>
          (i + 1) + '. [' + (s.plan.unit_code || '-') + '] ' + (s.plan.unit_name || '-') + ' / 평균 ' + s.avgScore + '점 / 이수율 ' + s.passRate + '%'
        ).join('\\n');

        body.innerHTML = '<div class="space-y-4">' +
          '<div class="overflow-x-auto rounded-2xl border border-slate-200/70">' +
            '<table class="w-full text-left">' +
              '<thead class="bg-slate-50 border-b border-slate-100"><tr>' +
                '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">능력단위</th>' +
                '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">채점완료</th>' +
                '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">이수인원</th>' +
                '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">평균점수</th>' +
                '<th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center">이수율</th>' +
              '</tr></thead>' +
              '<tbody class="divide-y divide-slate-100">' +
                statsRows.map(s =>
                  '<tr>' +
                    '<td class="px-4 py-3 text-sm font-semibold text-slate-800">[' + escapeHtml(s.plan.unit_code || '-') + '] ' + escapeHtml(s.plan.unit_name || '-') + '</td>' +
                    '<td class="px-4 py-3 text-center text-sm text-slate-700">' + s.gradedCount + '명</td>' +
                    '<td class="px-4 py-3 text-center text-sm text-slate-700">' + s.passCount + '명</td>' +
                    '<td class="px-4 py-3 text-center text-sm text-slate-700">' + s.avgScore + '점</td>' +
                    '<td class="px-4 py-3 text-center text-sm font-bold text-sky-700">' + s.passRate + '%</td>' +
                  '</tr>'
                ).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">' +
            '<label class="block text-xs font-black text-sky-700 uppercase tracking-widest mb-2">회의록 초안 (자동 요약)</label>' +
            '<textarea id="ncsMeetingMemo" class="w-full h-48 px-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm text-slate-700 focus:ring-4 focus:ring-sky-100 outline-none">' +
              'NCS 평가 결과 통계 회의록\\n\\n차수: ' + roundLabel(statsRound) + '\\n\\n' + summary + '\\n\\n종합 의견:\\n- 우수 항목 및 보완 항목을 검토하여 다음 평가 차수 운영 계획에 반영함.' +
            '</textarea>' +
          '</div>' +
        '</div>';
      } catch (e) {
        console.error(e);
        body.innerHTML = '<div class="p-6 text-center text-red-500 text-sm">결과통계를 불러오지 못했습니다.</div>';
      }
    }

    async function reloadAllTabs() {
      await renderGradingTab();
      await loadDocPlanOptions();
      await renderDocResults();
      await renderStatsTab();
    }

    function applyRoundBadges() {
      document.getElementById('gradingRoundLabel').textContent = roundLabel(gradingRound);
      document.getElementById('docsRoundLabel').textContent = roundLabel(docsRound);
      document.getElementById('statsRoundLabel').textContent = roundLabel(statsRound);
    }

    document.addEventListener('DOMContentLoaded', async () => {
      setActiveTab('grading');
      applyRoundBadges();
      if (useFixedCourseId) {
        const label = document.getElementById('fixedCourseHint');
        if (label) label.textContent = '현재 과정 ID: ' + fixedCourseId;
      } else {
        await loadCourseOptions();
      }

      const courseSel = document.getElementById('ncsResultCourseSelect');
      if (courseSel) {
        courseSel.addEventListener('change', async () => {
          selectedCourseId = courseSel.value;
          selectedDocPlanId = '';
          await reloadAllTabs();
        });
      }

      document.getElementById('gradingRoundSelect').addEventListener('change', async (e) => {
        gradingRound = parseInt(e.target.value, 10);
        applyRoundBadges();
        await renderGradingTab();
      });
      document.getElementById('docsRoundSelect').addEventListener('change', async (e) => {
        docsRound = parseInt(e.target.value, 10);
        applyRoundBadges();
        selectedDocPlanId = '';
        await loadDocPlanOptions();
        await renderDocResults();
      });
      document.getElementById('statsRoundSelect').addEventListener('change', async (e) => {
        statsRound = parseInt(e.target.value, 10);
        applyRoundBadges();
        await renderStatsTab();
      });

      document.getElementById('ncsResultDocPlanSelect').addEventListener('change', async (e) => {
        selectedDocPlanId = e.target.value || '';
        await renderDocResults();
      });

      if (useFixedCourseId) selectedCourseId = fixedCourseId;
      await reloadAllTabs();
    });
  </script>
  `;
}

function resultTabsHtml() {
  return `
  <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-4">
    <div class="flex flex-wrap gap-2">
      <button type="button" data-ncs-result-tab-btn="grading" onclick="setActiveTab('grading')" class="px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900 text-white text-sm font-black transition">
        종료된평가채점
      </button>
      <button type="button" data-ncs-result-tab-btn="docs" onclick="setActiveTab('docs')" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black transition hover:bg-slate-50">
        채점결과문서
      </button>
      <button type="button" data-ncs-result-tab-btn="stats" onclick="setActiveTab('stats')" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black transition hover:bg-slate-50">
        결과통계/회의록
      </button>
    </div>
  </section>

  <section data-ncs-result-tab-panel="grading" class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 class="text-lg font-black text-slate-900">종료된평가채점 <span id="gradingRoundLabel" class="text-sm text-sky-700"></span></h3>
      <select id="gradingRoundSelect" class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white">
        <option value="1">1차평가(본평가)</option>
        <option value="2">2차평가(재평가)</option>
        <option value="3">3차평가(재평가)</option>
      </select>
    </div>
    <div id="ncsResultGradingBody" class="space-y-3"></div>
  </section>

  <section data-ncs-result-tab-panel="docs" class="hidden bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 class="text-lg font-black text-slate-900">채점결과문서 <span id="docsRoundLabel" class="text-sm text-sky-700"></span></h3>
      <div class="flex items-center gap-2">
        <select id="docsRoundSelect" class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white">
          <option value="1">1차평가(본평가)</option>
          <option value="2">2차평가(재평가)</option>
          <option value="3">3차평가(재평가)</option>
        </select>
        <select id="ncsResultDocPlanSelect" class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white min-w-[260px]">
          <option value="">계획 선택</option>
        </select>
      </div>
    </div>
    <div id="ncsResultDocBody"></div>
  </section>

  <section data-ncs-result-tab-panel="stats" class="hidden bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 class="text-lg font-black text-slate-900">결과통계/회의록 <span id="statsRoundLabel" class="text-sm text-sky-700"></span></h3>
      <select id="statsRoundSelect" class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white">
        <option value="1">1차평가(본평가)</option>
        <option value="2">2차평가(재평가)</option>
        <option value="3">3차평가(재평가)</option>
      </select>
    </div>
    <div id="ncsResultStatsBody"></div>
  </section>
  `;
}

export const adminNcsEvalResultHtml = (sidebar = hrdSidebar('ncs-eval-result')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NCS평가결과 - 교육행정 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body class="bg-slate-50">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
        <div class="px-6 py-5">
          <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS평가결과</h1>
          <p class="text-sm text-slate-500 mt-1">종료된 평가 채점, 채점결과문서, 결과통계/회의록을 차수별(1/2/3차)로 확인합니다.</p>
        </div>
      </header>
      <main class="p-6 space-y-4">
        <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
          <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-[280px]">
              <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">과정 선택 *</label>
              <select id="ncsResultCourseSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 bg-white">
                <option value="">과정 선택</option>
              </select>
            </div>
            <p class="text-xs text-slate-500" id="fixedCourseHint"></p>
          </div>
        </section>
        ${resultTabsHtml()}
      </main>
    </div>
  </div>
  ${resultPageScript(false)}
</body>
</html>
`;

export const adminLmsNcsEvalResultHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LMS NCS평가결과</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      ${lmsHeaderHtml('ncs-eval', 'hrd')}
      <section class="px-6 py-6 border-b border-slate-200/60 bg-white">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">NCS평가결과</h2>
        <p class="text-sm text-slate-500 mt-1">과정 단위로 1차/2차/3차 평가 결과를 탭에서 확인합니다.</p>
      </section>
      <main class="p-6 space-y-4">
        <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
          <p id="fixedCourseHint" class="text-xs text-slate-500"></p>
        </section>
        ${resultTabsHtml()}
      </main>
    </div>
  </div>
  ${resultPageScript(true)}
</body>
</html>
`;
