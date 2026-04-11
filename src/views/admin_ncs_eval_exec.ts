import { hrdSidebar } from './components/hrd_sidebar';

export const adminNcsEvalExecHtml = (sidebar = hrdSidebar('ncs-eval-exec')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 평가실행 - 교육행정 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shrink-0">
        <div class="px-6 py-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS 평가실행</h1>
              <p class="text-sm text-slate-500 mt-1">1차(본평가) / 2차(재평가) / 3차(재평가) 탭으로 차수를 선택합니다.</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
            <div class="flex flex-col sm:flex-row sm:items-end gap-4">
              <div class="flex-1">
                <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">과정 선택 *</label>
                <select id="ncsExecCourseSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm bg-white">
                  <option value="">과정 선택</option>
                </select>
                <p class="text-[11px] text-slate-500 mt-2">과정을 선택하면 1~3차 평가의 종합 진행현황이 표시됩니다.</p>
              </div>
              <div class="sm:w-[220px]">
                <button type="button" id="ncsExecReloadBtn" class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 transition">
                  <i class="fas fa-rotate-right mr-1.5"></i>종합현황 새로고침
                </button>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">교과목 선택</label>
              <select id="ncsExecSubjectSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm bg-white disabled:opacity-60" disabled>
                <option value="">전체 교과목</option>
              </select>
              <p class="text-[11px] text-slate-500 mt-2">과정 선택 시 해당 교과목 목록이 자동으로 채워집니다.</p>
            </div>
          </section>

          <section id="ncsExecSummarySection" class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5 hidden">
            <h2 class="text-lg font-black text-slate-900">종합 진행상황</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[11px] text-slate-500 font-black uppercase tracking-wider">전체 계획 수</p>
                <p id="summaryTotalPlans" class="mt-1 text-2xl font-black text-slate-900">0</p>
              </div>
              <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p class="text-[11px] text-emerald-700 font-black uppercase tracking-wider">계획 확정</p>
                <p id="summaryConfirmedPlans" class="mt-1 text-2xl font-black text-emerald-700">0</p>
              </div>
              <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
                <p class="text-[11px] text-sky-700 font-black uppercase tracking-wider">평가 입력 진행</p>
                <p id="summaryGradedPlans" class="mt-1 text-2xl font-black text-sky-700">0</p>
              </div>
              <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p class="text-[11px] text-amber-700 font-black uppercase tracking-wider">전체 이수율</p>
                <p id="summaryPassRate" class="mt-1 text-2xl font-black text-amber-700">0%</p>
              </div>
            </div>
          </section>

          <section id="ncsExecEmptySection" class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-8 text-center text-slate-500 text-sm">
            과정을 선택하면 종합 진행상황이 표시됩니다.
          </section>

          <section id="ncsExecRoundsSection" class="space-y-5 hidden">
            <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900">1차 평가실시일자 (본평가)</h3>
                <span id="round1Count" class="text-xs text-slate-500">0건</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-left">
                  <thead class="bg-white border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">교과목명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">능력단위명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">평가실시일시</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가계획서</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">1차 평가일자</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">1차 평가도구</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">1차 채점기준표</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">1차 성취수준</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가도구검토</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">바로가기</th>
                    </tr>
                  </thead>
                  <tbody id="round1Body" class="divide-y divide-slate-100">
                    <tr><td colspan="10" class="px-4 py-6 text-center text-sm text-slate-400">-</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900">2차 평가실시일자 (재평가)</h3>
                <span id="round2Count" class="text-xs text-slate-500">0건</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-left">
                  <thead class="bg-white border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">교과목명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">능력단위명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">평가실시일시</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가계획서</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">2차 평가일자</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">2차 평가도구</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">2차 채점기준표</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">2차 성취수준</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가도구검토</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">바로가기</th>
                    </tr>
                  </thead>
                  <tbody id="round2Body" class="divide-y divide-slate-100">
                    <tr><td colspan="10" class="px-4 py-6 text-center text-sm text-slate-400">-</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900">3차 평가실시일자 (재평가)</h3>
                <span id="round3Count" class="text-xs text-slate-500">0건</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-left">
                  <thead class="bg-white border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">교과목명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">능력단위명</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500">평가실시일시</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가계획서</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">3차 평가일자</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">3차 평가도구</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">3차 채점기준표</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">3차 성취수준</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">평가도구검토</th>
                      <th class="px-4 py-2 text-xs font-black text-slate-500 text-center">바로가기</th>
                    </tr>
                  </thead>
                  <tbody id="round3Body" class="divide-y divide-slate-100">
                    <tr><td colspan="10" class="px-4 py-6 text-center text-sm text-slate-400">-</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>

  <script>
    let selectedCourseId = '';
    let selectedSubjectId = '';
    let selectedSubjectName = '';
    const planStatsCache = {};

    function authHeaders() {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': 'Bearer ' + token } : {};
    }

    async function loadCourseOptions() {
      const sel = document.getElementById('ncsExecCourseSelect');
      if (!sel) return;
      try {
        const res = await fetch('/api/courses?limit=500&page=1', { headers: authHeaders() });
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json?.results) ? json.results : []);
        const opts = list.filter(c => c && c.id != null).map(c => {
          const st = c.status || '';
          const title = c.title || c.name || '과정';
          return { id: c.id, text: '[' + c.id + '] ' + title + (st ? ' (' + st + ')' : '') };
        });
        opts.forEach(o => {
          const opt = document.createElement('option');
          opt.value = String(o.id);
          opt.textContent = o.text;
          sel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function loadSubjectOptions(courseId) {
      const sel = document.getElementById('ncsExecSubjectSelect');
      if (!sel) return;
      sel.innerHTML = '<option value="">전체 교과목</option>';
      selectedSubjectId = '';
      selectedSubjectName = '';
      if (!courseId) {
        sel.disabled = true;
        return;
      }
      try {
        const sessRes = await fetch('/api/course-sessions?lms_course_id=' + encodeURIComponent(String(courseId)) + '&limit=100&page=1', {
          headers: authHeaders()
        });
        const sessJson = await sessRes.json();
        const sessions = Array.isArray(sessJson?.data) ? sessJson.data : [];
        const picked = sessions.reduce(function(best, s) {
          if (!best) return s;
          var bNum = Number(best.session_number) || 999;
          var sNum = Number(s.session_number) || 999;
          if (sNum < bNum) return s;
          if (sNum === bNum && (Number(s.id) || 0) < (Number(best.id) || 0)) return s;
          return best;
        }, null);
        if (!picked || picked.id == null) {
          sel.disabled = true;
          return;
        }
        const res = await fetch('/api/course-sessions/' + encodeURIComponent(String(picked.id)) + '/timetable/resources', {
          headers: authHeaders()
        });
        const json = await res.json();
        const subjects = Array.isArray(json?.data?.subjects) ? json.data.subjects : [];
        subjects.forEach((sub) => {
          if (!sub || sub.id == null) return;
          const opt = document.createElement('option');
          opt.value = String(sub.id);
          opt.textContent = String(sub.name || sub.job_name || '교과목');
          sel.appendChild(opt);
        });
        sel.disabled = false;
      } catch (e) {
        console.error(e);
        sel.disabled = true;
      }
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function statusIcon(ok) {
      return ok
        ? '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-600"><i class="fas fa-check text-[10px]"></i></span>'
        : '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-rose-500"><i class="fas fa-xmark text-[10px]"></i></span>';
    }

    async function fetchPlansByRound(courseId, round) {
      const res = await fetch('/api/ncs/plans?courseId=' + encodeURIComponent(String(courseId)) + '&evaluation_round=' + round, {
        headers: authHeaders()
      });
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    }

    async function ensurePlanStats(planId) {
      if (planStatsCache[planId]) return planStatsCache[planId];
      try {
        const res = await fetch('/api/ncs/evaluations/' + planId, { headers: authHeaders() });
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        const total = rows.length;
        const graded = rows.filter(r => r && r.score != null && String(r.score).trim() !== '').length;
        const passed = rows.filter(r => Number(r?.is_passed) === 1).length;
        planStatsCache[planId] = { total, graded, passed };
      } catch (e) {
        planStatsCache[planId] = { total: 0, graded: 0, passed: 0 };
      }
      return planStatsCache[planId];
    }

    function renderRoundTable(round, list) {
      const body = document.getElementById('round' + round + 'Body');
      const count = document.getElementById('round' + round + 'Count');
      if (!body) return;
      const filtered = (Array.isArray(list) ? list : []).filter((plan) => {
        if (!selectedSubjectId) return true;
        if (plan && plan.curriculum_id != null && String(plan.curriculum_id) === selectedSubjectId) return true;
        const subjectName = String(plan?.subject_name || '').trim();
        return !!selectedSubjectName && subjectName === selectedSubjectName;
      });
      if (count) count.textContent = filtered.length + '건';
      if (!filtered.length) {
        body.innerHTML = '<tr><td colspan="10" class="px-4 py-6 text-center text-sm text-slate-400">등록된 계획이 없습니다.</td></tr>';
        return;
      }
      body.innerHTML = filtered.map((plan) => {
        const stats = planStatsCache[plan.id] || { total: 0, graded: 0, passed: 0 };
        const planDocOk = plan.status === 'confirmed' || plan.status === 'completed';
        const evalDateOk = !!plan.planned_date;
        const evalToolOk = !!plan.method;
        const rubricOk = !!plan.target_score;
        const achievementOk = stats.graded > 0;
        const reviewOk = stats.total > 0 && stats.graded >= stats.total;
        const execUrl = '/admin/courses/' + selectedCourseId + '/lms/ncs-eval-exec?evaluation_round=' + round;
        const planUrl = '/admin/courses/' + selectedCourseId + '/lms/ncs-eval-plan?evaluation_round=' + round;
        const resultUrl = '/admin/courses/' + selectedCourseId + '/lms/ncs-eval-result?evaluation_round=' + round;
        return '<tr class="hover:bg-slate-50 transition">' +
          '<td class="px-3 py-2 text-xs text-slate-700">' + escapeHtml(plan.subject_name || '-') + '</td>' +
          '<td class="px-3 py-2 text-xs text-slate-700"><div class="font-semibold">' + escapeHtml(plan.unit_name || '-') + '</div><div class="text-[10px] text-slate-400">' + escapeHtml(plan.unit_code || '') + '</div></td>' +
          '<td class="px-3 py-2 text-xs text-slate-600">' + escapeHtml(plan.planned_date || '-') + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(planDocOk) + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(evalDateOk) + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(evalToolOk) + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(rubricOk) + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(achievementOk) + '</td>' +
          '<td class="px-3 py-2 text-center">' + statusIcon(reviewOk) + '</td>' +
          '<td class="px-3 py-2 text-center"><div class="flex items-center justify-center gap-1">' +
          '<a class="px-2 py-1 rounded border border-sky-200 bg-sky-50 text-[10px] font-black text-sky-700 hover:bg-sky-100 transition" href="' + execUrl + '">평가실행</a>' +
          '<a class="px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-black text-slate-700 hover:bg-slate-50 transition" href="' + planUrl + '">계획서</a>' +
          '<a class="px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-black text-slate-700 hover:bg-slate-50 transition" href="' + resultUrl + '">결과</a>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }

    function renderSummary(roundPlans) {
      const all = []
        .concat(roundPlans[1] || [], roundPlans[2] || [], roundPlans[3] || [])
        .filter((plan) => {
          if (!selectedSubjectId) return true;
          if (plan && plan.curriculum_id != null && String(plan.curriculum_id) === selectedSubjectId) return true;
          const subjectName = String(plan?.subject_name || '').trim();
          return !!selectedSubjectName && subjectName === selectedSubjectName;
        });
      const totalPlans = all.length;
      const confirmedPlans = all.filter(p => p.status === 'confirmed' || p.status === 'completed').length;
      const gradedPlans = all.filter(p => {
        const s = planStatsCache[p.id] || { graded: 0 };
        return s.graded > 0;
      }).length;
      const totalLearners = all.reduce((acc, p) => acc + Number((planStatsCache[p.id] || {}).total || 0), 0);
      const totalPassed = all.reduce((acc, p) => acc + Number((planStatsCache[p.id] || {}).passed || 0), 0);
      const passRate = totalLearners > 0 ? Math.round((totalPassed / totalLearners) * 100) : 0;
      document.getElementById('summaryTotalPlans').textContent = String(totalPlans);
      document.getElementById('summaryConfirmedPlans').textContent = String(confirmedPlans);
      document.getElementById('summaryGradedPlans').textContent = String(gradedPlans);
      document.getElementById('summaryPassRate').textContent = passRate + '%';
    }

    async function loadCourseOverview() {
      if (!selectedCourseId) return;
      const emptySection = document.getElementById('ncsExecEmptySection');
      const summarySection = document.getElementById('ncsExecSummarySection');
      const roundsSection = document.getElementById('ncsExecRoundsSection');
      if (emptySection) emptySection.classList.add('hidden');
      if (summarySection) summarySection.classList.remove('hidden');
      if (roundsSection) roundsSection.classList.remove('hidden');
      const roundPlans = { 1: [], 2: [], 3: [] };
      try {
        for (const round of [1, 2, 3]) {
          const plans = await fetchPlansByRound(selectedCourseId, round);
          roundPlans[round] = plans;
          await Promise.all(plans.map(p => ensurePlanStats(p.id)));
          renderRoundTable(round, plans);
        }
        renderSummary(roundPlans);
      } catch (e) {
        console.error(e);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadCourseOptions();
      const sel = document.getElementById('ncsExecCourseSelect');
      if (sel) {
        sel.addEventListener('change', async () => {
          selectedCourseId = sel.value || '';
          await loadSubjectOptions(selectedCourseId);
          if (!selectedCourseId) return;
          await loadCourseOverview();
        });
      }

      const subjectSel = document.getElementById('ncsExecSubjectSelect');
      if (subjectSel) {
        subjectSel.addEventListener('change', () => {
          selectedSubjectId = subjectSel.value || '';
          const selectedOpt = subjectSel.options[subjectSel.selectedIndex];
          selectedSubjectName = selectedOpt ? String(selectedOpt.textContent || '').trim() : '';
          if (!selectedSubjectId) selectedSubjectName = '';
          if (!selectedCourseId) return;
          loadCourseOverview();
        });
      }

      const reloadBtn = document.getElementById('ncsExecReloadBtn');
      if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
          if (!selectedCourseId) {
            alert('먼저 과정을 선택해 주세요.');
            return;
          }
          loadCourseOverview();
        });
      }
    });
  </script>
</body>
</html>
`;

