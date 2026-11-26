import { lmsHeaderHtml } from './components/lms_header';
import { lmsNcsSubnavTabsHtml } from './components/lms_ncs_subnav';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsEvalExecHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 평가실행 - 교육과정 LMS</title>
  <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 overflow-hidden">
  <div class="${LMS_SHELL_ROOT_CLASS}">
    ${sidebar}
    <div class="${LMS_SHELL_COLUMN_CLASS}">
      ${lmsFixedHeaderBlock(`${lmsHeaderHtml('ncs-eval', 'hrd')}${lmsNcsSubnavTabsHtml('exec')}`)}
      ${lmsScrollMainOpen()}

        <div class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex justify-between items-end gap-4 flex-wrap">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">NCS 평가실행</h1>
                <p class="text-gray-600 mt-1 text-sm">HRDMARKET 방식과 동일한 목록형 실행 화면입니다.</p>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button type="button" data-round="1" onclick="switchRound(1)" class="px-4 py-2 rounded-xl border border-slate-200 bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition">1차평가(본평가)</button>
                <button type="button" data-round="2" onclick="switchRound(2)" class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">2차평가(재평가)</button>
                <button type="button" data-round="3" onclick="switchRound(3)" class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">3차평가(재평가)</button>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
              <div class="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2">
                <i class="fas fa-search text-gray-400 text-sm mr-2"></i>
                <input id="unitSearchInput" type="text" placeholder="능력단위명/코드/평가방법 검색" class="w-full text-sm outline-none text-gray-700" />
              </div>
              <button type="button" onclick="reloadCurrentRound()" class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                <i class="fas fa-rotate-right mr-1.5"></i>새로고침
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2" id="roundTitle">현재 차수: 1차평가(본평가)</p>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 class="font-bold text-gray-800 text-sm">[NCS] 능력단위 실행 목록</h2>
              <span id="planCount" class="text-xs text-gray-500">0건</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left min-w-[980px]">
                <thead class="bg-white border-b border-gray-100">
                  <tr>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500">교과목 / 능력단위</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500">평가방법</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500">평가예정일</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">계획 상태</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">평가 진행</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">이수 현황</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">바로가기</th>
                  </tr>
                </thead>
                <tbody id="execListBody" class="divide-y divide-gray-100">
                  <tr><td colspan="7" class="px-4 py-8 text-center text-sm text-gray-400">데이터를 불러오는 중...</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 class="text-lg font-black text-gray-800" id="selectedPlanTitle">계획을 선택해 주세요</h3>
                <p class="text-sm text-gray-500 mt-1" id="selectedPlanInfo">-</p>
              </div>
              <button onclick="saveResults()" id="btnSaveResults" disabled class="px-5 py-2 bg-green-600 text-white rounded-xl font-black text-sm opacity-50 cursor-not-allowed hover:bg-green-700 transition">
                <i class="fas fa-check-circle mr-2"></i>평가 결과 저장
              </button>
            </div>

            <div id="noSelection" class="mt-6 bg-gray-50 rounded-xl border border-gray-100 p-10 text-center text-gray-500 text-sm">
              목록에서 <strong>평가입력</strong>을 눌러 수강생 점수/의견을 입력해 주세요.
            </div>

            <div id="evaluationSection" class="hidden mt-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <div class="text-xs font-bold text-gray-500 uppercase tracking-widest">통과 기준</div>
                  <div class="text-2xl font-black text-gray-800 mt-1" id="selectedTargetScore">0점</div>
                </div>
                <div class="bg-gray-50 rounded-xl border border-gray-100 p-4 md:col-span-2">
                  <div class="text-xs font-bold text-gray-500 uppercase tracking-widest">평가방법 / 평가일자</div>
                  <div class="text-sm text-gray-800 mt-1" id="selectedMethodPlan">-</div>
                </div>
              </div>

              <!-- 하위 탭: 점수 채점 | 강사 대리 답안·파일 입력 | 시험지·평가문항·평가도구 -->
              <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                <button type="button" data-exec-subtab="grading" onclick="switchExecSubTab('grading')" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black transition">
                  <i class="fas fa-check-double mr-1.5"></i>1. 점수 채점 · 제출물 확인
                </button>
                <button type="button" data-exec-subtab="proxy" onclick="switchExecSubTab('proxy')" class="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-black hover:bg-gray-50 transition">
                  <i class="fas fa-file-circle-plus mr-1.5 text-sky-600"></i>2. 강사 대리 답안 · 파일 입력
                </button>
                <button type="button" data-exec-subtab="exam" onclick="switchExecSubTab('exam')" class="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-black hover:bg-gray-50 transition">
                  <i class="fas fa-book-open mr-1.5 text-amber-600"></i>3. 시험지 · 평가문항 · 평가도구 보기
                </button>
              </div>

              <!-- 탭 1: 점수 채점 및 학생별 제출물 확인 -->
              <div id="execSubPanel-grading" class="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th class="px-5 py-3 text-xs font-semibold text-gray-500">성명</th>
                      <th class="px-5 py-3 text-xs font-semibold text-gray-500">제출 답안 · 첨부파일 (대리입력)</th>
                      <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">점수</th>
                      <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-center">이수여부</th>
                      <th class="px-5 py-3 text-xs font-semibold text-gray-500">평가 의견</th>
                    </tr>
                  </thead>
                  <tbody id="resultTableBody" class="divide-y divide-gray-100">
                    <!-- JS -->
                  </tbody>
                </table>
              </div>

              <!-- 탭 2: 강사 대리 답안 · 첨부파일 입력 탭 -->
              <div id="execSubPanel-proxy" class="hidden space-y-4">
                <div class="rounded-xl border border-sky-200 bg-sky-50/60 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 class="text-sm font-black text-sky-900"><i class="fas fa-user-pen mr-1.5"></i>시험 시 파일이나 정답을 입력하지 못한 수강생을 위한 강사 대리 입력</h4>
                    <p class="text-xs text-sky-700 mt-0.5">수강생을 선택하여 답안(정답) 텍스트, 평가 결과물 첨부파일, 또는 포트폴리오 링크를 대신 등록할 수 있습니다.</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                    <label class="block text-xs font-black text-gray-700">1. 대상 수강생 선택</label>
                    <select id="proxyStudentSelect" onchange="onProxyStudentChange(this.value)" class="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-800 bg-white"></select>
                    <div id="proxyStudentExistingBox" class="pt-2 border-t border-gray-100"></div>
                  </div>
                  <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">제출 제목</label>
                        <input id="proxyTitleInput" type="text" placeholder="예: 1차 본평가 답안 및 실기 파일 (강사 대리입력)" class="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">외부 링크 (선택 · 구글드라이브/포트폴리오 URL)</label>
                        <input id="proxyUrlInput" type="url" placeholder="https://..." class="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                    </div>
                    <div>
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <label class="block text-xs font-bold text-gray-600">문항별 정답 / 답안 입력 (<span id="proxyQuestionCountLabel">문항 수에 맞춰 자동 표시</span>)</label>
                        <button type="button" onclick="addExtraProxyQuestionInput()" class="px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-[11px] font-black hover:bg-sky-100 transition">
                          <i class="fas fa-plus mr-1"></i>문항 입력란 추가
                        </button>
                      </div>
                      <div id="proxyNumberedAnswersBox" class="space-y-2.5"></div>
                      <div class="mt-3">
                        <label class="block text-[11px] font-bold text-gray-500 mb-1">추가 메모 / 종합 의견 (선택)</label>
                        <textarea id="proxyAnswerInput" rows="2" placeholder="추가 서술 답안이나 전체 메모가 있으면 입력하세요..." class="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"></textarea>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-600 mb-1">평가 결과물 파일 첨부 (다중 선택 가능 · CAD/STL/이미지/PDF/ZIP 등)</label>
                      <input id="proxyFileInput" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.zip,.rar,.stl,.step,.stp,.iges,.igs,.obj,.3mf,.f3d,.gcode,.mp4" class="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-sky-50 file:text-sky-700 file:text-xs file:font-black hover:file:bg-sky-100" />
                    </div>
                    <div class="flex justify-end">
                      <button type="button" id="proxySubmitBtn" onclick="submitProxyEvidence()" class="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-black hover:bg-sky-700 transition">
                        <i class="fas fa-cloud-arrow-up mr-1.5"></i>대리 답안 · 파일 저장
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 탭 3: 시험지 · 평가문항 · 평가도구 보기 -->
              <div id="execSubPanel-exam" class="hidden space-y-4">
                <div id="execExamSpecBody" class="space-y-4"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <script>
    const courseId = new URLSearchParams(window.location.search).get('session_id') || window.location.pathname.split('/')[3];
    const _sid = new URLSearchParams(window.location.search).get('session_id') || '';
    const isTeacherPath = window.location.pathname.startsWith('/teacher/');
    const basePrefix = isTeacherPath ? '/teacher' : '/admin';
    let activeRound = 1;
    let currentPlan = null;
    let studentResults = [];
    let plans = [];
    let planStatsCache = {};

    function setRoundTitle() {
      const titleEl = document.getElementById('roundTitle');
      if (!titleEl) return;
      if (activeRound === 1) titleEl.textContent = '현재 차수: 1차평가(본평가)';
      else if (activeRound === 2) titleEl.textContent = '현재 차수: 2차평가(재평가)';
      else titleEl.textContent = '현재 차수: 3차평가(재평가)';
    }

    function updateRoundTabUI() {
      document.querySelectorAll('button[data-round]').forEach(btn => {
        const r = parseInt(btn.dataset.round || '1', 10);
        const active = r === activeRound;
        btn.classList.toggle('bg-slate-900', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('hover:bg-slate-800', active);
        btn.classList.toggle('bg-white', !active);
        btn.classList.toggle('text-slate-700', !active);
      });
    }

    function switchRound(round) {
      activeRound = round;
      setRoundTitle();
      updateRoundTabUI();
      currentPlan = null;
      studentResults = [];
      document.getElementById('noSelection').classList.remove('hidden');
      document.getElementById('evaluationSection').classList.add('hidden');
      document.getElementById('btnSaveResults').disabled = true;
      document.getElementById('btnSaveResults').classList.add('opacity-50', 'cursor-not-allowed');
      document.getElementById('selectedPlanTitle').textContent = '계획을 선택해 주세요';
      document.getElementById('selectedPlanInfo').textContent = '-';
      loadPlans();
    }

    function statusDot(ok) {
      return ok
        ? '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600"><i class="fas fa-check text-[10px]"></i></span>'
        : '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500"><i class="fas fa-xmark text-[10px]"></i></span>';
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    async function ensurePlanStats(planId) {
      if (planStatsCache[planId]) return planStatsCache[planId];
      try {
        const res = await fetch('/api/ncs/evaluations/' + planId + (_sid ? '?session_id=' + encodeURIComponent(_sid) : ''), {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
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

    async function hydrateVisibleStats(list) {
      await Promise.all(list.map(p => ensurePlanStats(p.id)));
    }

    function getFilteredPlans() {
      const keyword = (document.getElementById('unitSearchInput')?.value || '').trim().toLowerCase();
      if (!keyword) return plans;
      return plans.filter(p => {
        const subj = String(p.subject_name || '').toLowerCase();
        const unit = String(p.unit_name || '').toLowerCase();
        const code = String(p.unit_code || '').toLowerCase();
        const method = String(p.method || '').toLowerCase();
        return subj.includes(keyword) || unit.includes(keyword) || code.includes(keyword) || method.includes(keyword);
      });
    }

    function renderExecList() {
      const body = document.getElementById('execListBody');
      const count = document.getElementById('planCount');
      if (!body) return;
      const list = getFilteredPlans();
      if (count) count.textContent = list.length + '건';
      if (list.length === 0) {
        body.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-gray-400">표시할 능력단위가 없습니다.</td></tr>';
        return;
      }

      body.innerHTML = list.map(plan => {
        const stats = planStatsCache[plan.id] || { total: 0, graded: 0, passed: 0 };
        const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
        const planDone = plan.status === 'confirmed' || plan.status === 'completed';
        const evalDone = stats.graded > 0;
        const mainTitle = plan.subject_name || plan.unit_name || '-';
        const subUnit = (plan.subject_name && plan.unit_name && plan.subject_name !== plan.unit_name)
          ? ((plan.unit_code ? '[' + plan.unit_code + '] ' : '') + plan.unit_name)
          : (plan.unit_code || '');
        const sidQ = _sid ? '&session_id=' + encodeURIComponent(_sid) : '';
        return \`
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-3">
              <div class="font-semibold text-gray-800">\${escapeHtml(mainTitle)}</div>
              <div class="text-xs text-gray-400 mt-0.5">\${escapeHtml(subUnit)}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">\${escapeHtml(plan.method || '-')}</td>
            <td class="px-4 py-3 text-sm text-gray-700">\${escapeHtml(plan.planned_date || '-')}</td>
            <td class="px-4 py-3 text-center">\${statusDot(planDone)}</td>
            <td class="px-4 py-3 text-center">
              \${statusDot(evalDone)}
              <div class="text-[11px] text-gray-500 mt-1">\${stats.graded}/\${stats.total}</div>
            </td>
            <td class="px-4 py-3 text-center text-sm font-semibold \${passRate >= 60 ? 'text-emerald-600' : 'text-amber-600'}">\${passRate}%</td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <button class="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition" onclick="selectPlan(\${plan.id})">평가입력</button>
                <a class="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition" href="\${basePrefix}/courses/\${courseId}/lms/ncs-eval-plan?evaluation_round=\${activeRound}\${sidQ}">계획서</a>
                <a class="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition" href="\${basePrefix}/courses/\${courseId}/lms/ncs-eval-result?evaluation_round=\${activeRound}\${sidQ}">결과</a>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function reloadCurrentRound() {
      await loadPlans();
    }

    document.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const r = parseInt(params.get('evaluation_round') || '1', 10);
      activeRound = [1,2,3].includes(r) ? r : 1;
      setRoundTitle();
      updateRoundTabUI();
      loadPlans();
      const searchInput = document.getElementById('unitSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          renderExecList();
        });
      }
    });

    async function loadPlans() {
      try {
        const body = document.getElementById('execListBody');
        if (body) body.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-gray-400">데이터를 불러오는 중...</td></tr>';

        const res = await fetch(\`/api/ncs/plans?courseId=\${courseId}&evaluation_round=\${activeRound}\` + (_sid ? '&session_id=' + encodeURIComponent(_sid) : ''), {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const json = await res.json();
        if (!json?.success) {
          var errText = json && json.error ? String(json.error) : ('HTTP ' + res.status);
          if (body) body.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-red-500">계획을 불러오지 못했습니다. <span class="text-xs text-gray-400">(' + escapeHtml(errText) + ')</span></td></tr>';
          return;
        }

        plans = Array.isArray(json.data) ? json.data : [];
        await hydrateVisibleStats(plans);
        renderExecList();
        const initPlanId = new URLSearchParams(window.location.search).get('plan_id');
        if (initPlanId && !currentPlan && plans.some(p => String(p.id) === String(initPlanId))) {
          await selectPlan(initPlanId);
        }

      } catch (e) {
        console.error(e);
        const body = document.getElementById('execListBody');
        if (body) body.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-red-500">오류가 발생했습니다.</td></tr>';
      }
    }

    async function selectPlan(planId) {
      try {
        const res = await fetch(\`/api/ncs/evaluations/\${planId}\` + (_sid ? '?session_id=' + encodeURIComponent(_sid) : ''), {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const result = await res.json();
        if (!result?.success) return;
        currentPlan = result.plan;
        studentResults = result.data || [];

        document.getElementById('noSelection').classList.add('hidden');
        document.getElementById('evaluationSection').classList.remove('hidden');
        const btn = document.getElementById('btnSaveResults');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');

        const matchedListPlan = plans.find(p => String(p.id) === String(planId));
        const displayName = (matchedListPlan && matchedListPlan.subject_name) || currentPlan.subject_name || currentPlan.unit_name || '-';
        currentPlan.subject_name = displayName;
        const unitLabel = currentPlan.unit_name && currentPlan.unit_name !== displayName
          ? \` | 능력단위: \${currentPlan.unit_code ? '[' + currentPlan.unit_code + '] ' : ''}\${currentPlan.unit_name}\`
          : '';
        document.getElementById('selectedPlanTitle').textContent = displayName;
        document.getElementById('selectedPlanInfo').textContent = \`평가방법: \${currentPlan.method} | 평가일: \${currentPlan.planned_date || '-'}\${unitLabel}\`;
        document.getElementById('selectedTargetScore').textContent = \`\${currentPlan.target_score}점\`;
        document.getElementById('selectedMethodPlan').textContent = \`\${currentPlan.method} / \${currentPlan.planned_date || '-'}\`;

        window._currentExamSpec = result.exam_spec || { schedule: null, questions: { rows: [], attachments: [] }, tools: { criteria_groups: [] } };
        renderResultTable();
        renderProxyPanel();
        renderExamSpecPanel();
        renderExecList();
      } catch (e) {
        console.error(e);
      }
    }

    function switchExecSubTab(tab) {
      ['grading', 'proxy', 'exam'].forEach(t => {
        const panel = document.getElementById('execSubPanel-' + t);
        const btn = document.querySelector('[data-exec-subtab="' + t + '"]');
        const active = t === tab;
        if (panel) panel.classList.toggle('hidden', !active);
        if (btn) {
          btn.className = active
            ? 'px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black transition'
            : 'px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-black hover:bg-gray-50 transition';
        }
      });
    }

    function openProxyForStudent(studentId) {
      switchExecSubTab('proxy');
      const sel = document.getElementById('proxyStudentSelect');
      if (sel) {
        sel.value = String(studentId);
        onProxyStudentChange(String(studentId));
      }
    }

    function unpackNcsQuestionBundle(raw) {
      var text = String(raw || '').trim();
      var start = '<' + '!--qimg-->';
      var mid = '<' + '!--/qimg--><' + '!--qbody-->';
      var end = '<' + '!--/qbody-->';
      var imgPart = '';
      if (text.indexOf(start) >= 0 && text.indexOf(mid) >= 0) {
        var sIdx = text.indexOf(start);
        var mIdx = text.indexOf(mid);
        imgPart = text.slice(sIdx + start.length, mIdx).trim();
        var bodyPart = text.slice(mIdx + mid.length);
        if (bodyPart.lastIndexOf(end) >= 0) bodyPart = bodyPart.slice(0, bodyPart.lastIndexOf(end));
        text = bodyPart.trim();
      } else {
        text = text.replace(/<!--\\/?qimg-->/gi, '').replace(/<!--\\/?qbody-->/gi, '').trim();
      }
      return { imgHtml: imgPart, bodyHtml: text };
    }

    function renderNcsQuestionRichHtml(raw) {
      var parts = unpackNcsQuestionBundle(raw);
      var imgHtml = '';
      if (parts.imgHtml && /<[a-z][^>]*>/i.test(parts.imgHtml)) {
        imgHtml = '<div class="mb-2">' + parts.imgHtml.replace(/<script[^]*?<\\/script>/gi, '') + '</div>';
      }
      var body = parts.bodyHtml;
      if (/<[a-z][^>]*>/i.test(body)) {
        return '<div class="[&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-1.5">' + imgHtml + body.replace(/<script[^]*?<\\/script>/gi, '') + '</div>';
      }
      return '<div class="whitespace-pre-wrap [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-1.5">' + imgHtml + escapeHtml(body) + '</div>';
    }

    function stripHtmlToText(html) {
      var parts = unpackNcsQuestionBundle(html);
      const tmp = document.createElement('div');
      tmp.innerHTML = String(parts.bodyHtml || '');
      return (tmp.textContent || tmp.innerText || '').replace(/\\s+/g, ' ').trim();
    }

    function formatNumberedCommentHtml(comment) {
      const raw = String(comment || '').trim();
      if (!raw) return '';
      const lines = raw.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
      const hasNumbered = lines.some(l => /^\\d+\\s*[\\.\\)\\ 번:]/.test(l));
      if (!hasNumbered && lines.length <= 1) {
        return '<div class="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 mt-0.5 whitespace-pre-wrap">' + escapeHtml(raw) + '</div>';
      }
      return '<div class="space-y-1 mt-1">' + lines.map(line => {
        const m = line.match(/^(\\d+)\\s*(?:[\\.\\)\\:]|번\\s*:?)\\s*(.*)$/);
        if (m) {
          return '<div class="flex items-start gap-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1">' +
            '<span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded bg-indigo-600 text-white text-[10px] font-black shrink-0">' + escapeHtml(m[1]) + '</span>' +
            '<span class="text-gray-800 font-medium break-all whitespace-pre-wrap">' + escapeHtml(m[2] || '-') + '</span>' +
          '</div>';
        }
        return '<div class="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 whitespace-pre-wrap">' + escapeHtml(line) + '</div>';
      }).join('') + '</div>';
    }

    function parseNumberedAnswersFromComment(comment) {
      const map = {};
      const extra = [];
      const lines = String(comment || '').split(/\\r?\\n/);
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const m = trimmed.match(/^(\\d+)\\s*(?:[\\.\\)\\:]|번\\s*:?)\\s*(.*)$/);
        if (m) {
          map[Number(m[1])] = m[2] || '';
        } else if (trimmed.startsWith('[비고]')) {
          extra.push(trimmed.replace(/^\\[비고\\]\\s*/, ''));
        } else {
          extra.push(trimmed);
        }
      });
      return { map, extra: extra.join('\\n') };
    }

    let extraProxyQuestionCount = 0;

    function renderProxyQuestionInputs(prefillComment) {
      const box = document.getElementById('proxyNumberedAnswersBox');
      const countLabel = document.getElementById('proxyQuestionCountLabel');
      const memoEl = document.getElementById('proxyAnswerInput');
      if (!box) return;
      const spec = window._currentExamSpec || {};
      const qRows = Array.isArray(spec?.questions?.rows) ? spec.questions.rows : [];
      const baseCount = qRows.length > 0 ? qRows.length : 1;
      const totalCount = baseCount + extraProxyQuestionCount;
      if (countLabel) {
        countLabel.textContent = qRows.length > 0 ? ('등록된 평가문항 ' + qRows.length + '개 기준') : ('총 ' + totalCount + '개 문항 입력란');
      }
      const parsed = parseNumberedAnswersFromComment(prefillComment || '');
      if (memoEl && prefillComment != null) {
        memoEl.value = parsed.extra || '';
      }

      let html = '';
      const activeStudentId = document.getElementById('proxyStudentSelect')?.value;
      const activeRow = studentResults.find(r => String(r.student_id) === String(activeStudentId));
      const stuEvList = (activeRow && Array.isArray(activeRow.evidence_list)) ? activeRow.evidence_list : [];

      for (let i = 0; i < totalCount; i++) {
        const q = qRows[i] || null;
        const qNo = q && q.no ? Number(q.no) : (i + 1);
        const qText = q ? stripHtmlToText(q.text) : '';
        const qParts = q ? unpackNcsQuestionBundle(q.text) : { imgHtml: '', bodyHtml: '' };
        const hasQImg = qParts.imgHtml && /<img\\b/i.test(qParts.imgHtml);
        const cleanPrompt = qText.replace(new RegExp('^' + qNo + '\\s*[\\.\\)]\\s*'), '');
        const val = parsed.map[qNo] != null ? parsed.map[qNo] : '';
        const qFiles = stuEvList.filter(ev => ev && ev.file_url && new RegExp('\\[문항\\s*' + qNo + '\\]').test(String(ev.file_name || '')));
        const qPhotos = qFiles.filter(f => f.file_type === 'image' || /\\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(String(f.file_url || '')) || /\\[사진\\]/.test(String(f.file_name || '')));
        const qDocs = qFiles.filter(f => !qPhotos.includes(f));
        html += '<div class="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-2.5">' +
          '<div class="flex items-start gap-2.5">' +
            '<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-xs font-black shrink-0 mt-0.5">1. 문항 ' + qNo + '</span>' +
            '<div class="flex-1 min-w-0">' +
              (cleanPrompt
                ? '<div class="flex flex-wrap items-center justify-between gap-2">' +
                    '<p class="text-xs font-bold text-gray-800 break-keep">' + escapeHtml(cleanPrompt) + '</p>' +
                    (q && q.score ? '<span class="text-[11px] font-black text-indigo-600 shrink-0">' + escapeHtml(q.score) + '점</span>' : '') +
                  '</div>'
                : '<p class="text-xs font-bold text-gray-600">' + qNo + '번 문항</p>') +
              (hasQImg ? '<div class="mt-2 [&_img]:max-h-40 [&_img]:rounded-lg">' + qParts.imgHtml + '</div>' : '') +
              (q && q.answer ? '<p class="text-[11px] text-emerald-700 font-semibold mt-1">기준 정답/키워드: ' + escapeHtml(q.answer) + '</p>' : '') +
            '</div>' +
          '</div>' +
          '<div>' +
            '<label class="block text-[11px] font-black text-sky-800 mb-1"><span class="inline-block px-1.5 py-0.5 rounded bg-sky-100 mr-1">2. 답변(메모)</span>' + qNo + '번 정답 / 답안</label>' +
            '<input type="text" data-proxy-qno="' + qNo + '" value="' + escapeHtml(val) + '" placeholder="' + qNo + '번 문항에 대한 학생의 정답 또는 답안을 입력하세요" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">' +
            '<div class="rounded-lg border border-amber-200 bg-white p-2.5">' +
              '<label class="block text-[11px] font-black text-amber-800 mb-1"><span class="inline-block px-1.5 py-0.5 rounded bg-amber-100 mr-1">3-1. 사진란</span>' + qNo + '번 사진/이미지 (멀티 첨부)</label>' +
              '<input type="file" data-proxy-qphoto="' + qNo + '" multiple accept="image/*" onchange="onProxyMultiFilePick(' + qNo + ', &#39;photo&#39;, this)" class="block w-full text-xs text-gray-600 file:mr-2 file:px-2.5 file:py-1.5 file:rounded-lg file:border file:border-amber-200 file:bg-amber-50 file:text-amber-800 file:text-xs file:font-bold hover:file:bg-amber-100 cursor-pointer" />' +
              '<div id="proxyQueuedPhotos_' + qNo + '" class="mt-1.5 space-y-1"></div>' +
              (qPhotos.length ? '<div class="mt-1.5 flex flex-wrap gap-1.5">' + qPhotos.map(f => '<a href="' + escapeHtml(f.file_url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50/60 border border-amber-200 text-[11px] font-bold text-amber-900"><i class="fas fa-image text-amber-600"></i>' + escapeHtml(f.file_name) + '</a>').join('') + '</div>' : '') +
            '</div>' +
            '<div class="rounded-lg border border-emerald-200 bg-white p-2.5">' +
              '<label class="block text-[11px] font-black text-emerald-800 mb-1"><span class="inline-block px-1.5 py-0.5 rounded bg-emerald-100 mr-1">3-2. 첨부파일란</span>' + qNo + '번 설계·문서 파일 (멀티 첨부)</label>' +
              '<input type="file" data-proxy-qfile="' + qNo + '" multiple accept=".stl,.step,.stp,.iges,.igs,.obj,.3mf,.f3d,.gcode,.dwg,.dxf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.txt,.zip,.rar,.7z,.mp4,image/*" onchange="onProxyMultiFilePick(' + qNo + ', &#39;file&#39;, this)" class="block w-full text-xs text-gray-600 file:mr-2 file:px-2.5 file:py-1.5 file:rounded-lg file:border file:border-emerald-200 file:bg-emerald-50 file:text-emerald-800 file:text-xs file:font-bold hover:file:bg-emerald-100 cursor-pointer" />' +
              '<div id="proxyQueuedFiles_' + qNo + '" class="mt-1.5 space-y-1"></div>' +
              (qDocs.length ? '<div class="mt-1.5 flex flex-wrap gap-1.5">' + qDocs.map(f => '<a href="' + escapeHtml(f.file_url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50/60 border border-emerald-200 text-[11px] font-bold text-sky-700"><i class="fas fa-paperclip text-emerald-600"></i>' + escapeHtml(f.file_name) + '</a>').join('') + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }
      box.innerHTML = html;
      for (let i = 0; i < totalCount; i++) {
        const q = qRows[i] || null;
        const qNo = q && q.no ? Number(q.no) : (i + 1);
        renderProxyQueuedList(qNo, 'photo');
        renderProxyQueuedList(qNo, 'file');
      }
    }

    window._proxyQueuedPhotos = {};
    window._proxyQueuedFiles = {};

    function onProxyMultiFilePick(qNo, kind, inputEl) {
      const store = kind === 'photo' ? window._proxyQueuedPhotos : window._proxyQueuedFiles;
      if (!Array.isArray(store[qNo])) store[qNo] = [];
      const picked = inputEl && inputEl.files ? Array.from(inputEl.files) : [];
      picked.forEach(f => {
        const exists = store[qNo].some(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified);
        if (!exists) store[qNo].push(f);
      });
      if (inputEl) inputEl.value = '';
      renderProxyQueuedList(qNo, kind);
    }

    function removeProxyQueuedFile(qNo, kind, idx) {
      const store = kind === 'photo' ? window._proxyQueuedPhotos : window._proxyQueuedFiles;
      if (Array.isArray(store[qNo])) store[qNo].splice(idx, 1);
      renderProxyQueuedList(qNo, kind);
    }

    function renderProxyQueuedList(qNo, kind) {
      const store = kind === 'photo' ? window._proxyQueuedPhotos : window._proxyQueuedFiles;
      const list = Array.isArray(store[qNo]) ? store[qNo] : [];
      const box = document.getElementById((kind === 'photo' ? 'proxyQueuedPhotos_' : 'proxyQueuedFiles_') + qNo);
      if (!box) return;
      if (!list.length) { box.innerHTML = ''; return; }
      const cls = kind === 'photo' ? 'border-amber-200 bg-amber-50/70 text-amber-900' : 'border-sky-200 bg-sky-50/70 text-sky-900';
      box.innerHTML = '<p class="text-[10px] font-bold text-gray-500">대기 중 (' + list.length + '개)</p>' +
        list.map((f, idx) =>
          '<div class="flex items-center justify-between gap-2 rounded border ' + cls + ' px-2 py-1 text-[11px]">' +
            '<span class="truncate font-semibold">' + escapeHtml(f.name) + '</span>' +
            '<button type="button" onclick="removeProxyQueuedFile(' + qNo + ', &#39;' + kind + '&#39;, ' + idx + ')" class="text-gray-400 hover:text-red-600 font-bold px-1"><i class="fas fa-xmark"></i></button>' +
          '</div>'
        ).join('');
    }

    function addExtraProxyQuestionInput() {
      // 현재 입력된 값 보존
      const currentCombined = collectProxyFormattedAnswers();
      extraProxyQuestionCount += 1;
      renderProxyQuestionInputs(currentCombined);
    }

    function collectProxyFormattedAnswers() {
      const inputs = Array.from(document.querySelectorAll('#proxyNumberedAnswersBox input[data-proxy-qno]'));
      const lines = [];
      let anyNumbered = false;
      inputs.forEach(inp => {
        const no = inp.getAttribute('data-proxy-qno');
        const v = String(inp.value || '').trim();
        if (v !== '') anyNumbered = true;
        lines.push(no + '. ' + v);
      });
      const memo = (document.getElementById('proxyAnswerInput')?.value || '').trim();
      const out = [];
      if (anyNumbered) {
        out.push(...lines);
      }
      if (memo) {
        out.push(anyNumbered ? ('[비고] ' + memo) : memo);
      }
      return out.join('\\n').trim();
    }

    function renderStudentEvidenceBadges(row) {
      const list = Array.isArray(row.evidence_list) ? row.evidence_list : [];
      const itemsHtml = list.length
        ? '<div class="space-y-1 mb-2">' + list.map(ev => {
            const hasUrl = ev.file_url && String(ev.file_url).trim() !== '';
            const linkPart = hasUrl
              ? '<a href="' + escapeHtml(ev.file_url) + '" target="_blank" rel="noopener" class="text-xs font-bold text-sky-700 hover:underline break-all"><i class="fas ' + (ev.file_type === 'link' ? 'fa-link' : 'fa-paperclip') + ' mr-1"></i>' + escapeHtml(ev.file_name || '제출파일') + '</a>'
              : '<span class="text-xs font-bold text-indigo-700"><i class="fas fa-pen-nib mr-1"></i>' + escapeHtml(ev.file_name || '답안 입력') + '</span>';
            const commentPart = ev.comment ? formatNumberedCommentHtml(ev.comment) : '';
            return '<div class="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 flex items-start justify-between gap-2">' +
              '<div class="min-w-0 flex-1">' + linkPart + commentPart + '</div>' +
              '<button type="button" onclick="deleteStudentEvidence(' + ev.id + ')" class="text-gray-400 hover:text-red-500 text-xs px-1" title="삭제"><i class="fas fa-trash-can"></i></button>' +
            '</div>';
          }).join('') + '</div>'
        : '<span class="inline-block text-xs text-gray-400 mr-2">미제출</span>';
      return itemsHtml +
        '<button type="button" onclick="openProxyForStudent(' + row.student_id + ')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition">' +
          '<i class="fas fa-plus"></i> 답안·파일 대리입력' +
        '</button>';
    }

    function renderResultTable() {
      const tbody = document.getElementById('resultTableBody');
      if (!tbody) return;
      tbody.innerHTML = studentResults.map(row => \`
        <tr class="hover:bg-gray-50 transition align-top">
          <td class="px-5 py-4">
            <div class="text-sm">
              <div class="font-bold text-gray-800">\${escapeHtml(row.name)}</div>
              <div class="text-[10px] text-gray-400">\${escapeHtml(row.phone || '')}</div>
            </div>
          </td>
          <td class="px-5 py-4 max-w-md">
            \${renderStudentEvidenceBadges(row)}
          </td>
          <td class="px-4 py-4 text-center">
            <input type="number" value="\${row.score ?? ''}"
              onchange="updateScore(\${row.student_id}, this.value)"
              class="w-20 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold">
          </td>
          <td class="px-4 py-4 text-center">
            <span class="px-2 py-1 rounded text-xs font-bold \${row.is_passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
              \${row.is_passed ? '이수 (Pass)' : '미이수 (Fail)'}
            </span>
          </td>
          <td class="px-5 py-4">
            <input type="text" value="\${escapeHtml(row.feedback || '')}"
              onchange="updateFeedback(\${row.student_id}, this.value)"
              placeholder="평가 의견 입력"
              class="w-full px-3 py-1 border rounded-lg text-sm">
          </td>
        </tr>
      \`).join('');
    }

    function renderProxyPanel() {
      const sel = document.getElementById('proxyStudentSelect');
      if (!sel) return;
      const prevVal = sel.value;
      sel.innerHTML = studentResults.map(r =>
        '<option value="' + r.student_id + '">' + escapeHtml(r.name) + ' (' + ((r.evidence_list || []).length) + '건 제출)</option>'
      ).join('');
      if (prevVal && studentResults.some(r => String(r.student_id) === String(prevVal))) {
        sel.value = prevVal;
      }
      onProxyStudentChange(sel.value);
    }

    function onProxyStudentChange(studentId) {
      const row = studentResults.find(r => String(r.student_id) === String(studentId));
      const box = document.getElementById('proxyStudentExistingBox');
      const titleInput = document.getElementById('proxyTitleInput');
      if (titleInput && currentPlan && row) {
        titleInput.value = (currentPlan.subject_name || currentPlan.unit_name || '본평가') + ' - ' + row.name + ' (강사 대리입력)';
      }
      const list = row && Array.isArray(row.evidence_list) ? row.evidence_list : [];
      const latestWithComment = list.find(ev => ev && String(ev.comment || '').trim() !== '');
      extraProxyQuestionCount = 0;
      window._proxyQueuedPhotos = {};
      window._proxyQueuedFiles = {};
      renderProxyQuestionInputs(latestWithComment ? latestWithComment.comment : '');
      if (!box) return;
      if (!row) {
        box.innerHTML = '<p class="text-xs text-gray-400">수강생을 선택하세요.</p>';
        return;
      }
      box.innerHTML = '<p class="text-xs font-bold text-gray-600 mb-2">' + escapeHtml(row.name) + ' 수강생 제출 내역 (' + list.length + '건)</p>' +
        (list.length
          ? '<div class="space-y-1.5 max-h-60 overflow-y-auto">' + list.map(ev => {
              const hasUrl = ev.file_url && String(ev.file_url).trim() !== '';
              return '<div class="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs flex items-start justify-between gap-2">' +
                '<div class="min-w-0 flex-1">' +
                  (hasUrl
                    ? '<a href="' + escapeHtml(ev.file_url) + '" target="_blank" rel="noopener" class="font-bold text-sky-700 hover:underline break-all"><i class="fas fa-paperclip mr-1"></i>' + escapeHtml(ev.file_name || '제출파일') + '</a>'
                    : '<span class="font-bold text-indigo-700"><i class="fas fa-pen-nib mr-1"></i>' + escapeHtml(ev.file_name || '답안 입력') + '</span>') +
                  (ev.comment ? formatNumberedCommentHtml(ev.comment) : '') +
                '</div>' +
                '<button type="button" onclick="deleteStudentEvidence(' + ev.id + ')" class="text-gray-400 hover:text-red-500 px-1" title="삭제"><i class="fas fa-trash-can"></i></button>' +
              '</div>';
            }).join('') + '</div>'
          : '<p class="text-xs text-gray-400">아직 등록된 답안이나 첨부파일이 없습니다.</p>');
    }

    async function uploadProxyFile(file, planId) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'evidence');
      fd.append('folder', 'ncs-evidence/' + planId);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: fd
      });
      const json = await res.json();
      if (!json || !json.success || !json.data || !json.data.url) {
        throw new Error((json && json.error) || (file.name + ' 업로드 실패'));
      }
      return json.data;
    }

    async function submitProxyEvidence() {
      if (!currentPlan) return;
      const studentId = document.getElementById('proxyStudentSelect')?.value;
      if (!studentId) { alert('대상 수강생을 선택하세요.'); return; }
      const title = (document.getElementById('proxyTitleInput')?.value || '').trim() || '강사 대리입력';
      const url = (document.getElementById('proxyUrlInput')?.value || '').trim();
      const answer = collectProxyFormattedAnswers();
      const fileInput = document.getElementById('proxyFileInput');
      const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
      const perQPhotoInputs = Array.from(document.querySelectorAll('#proxyNumberedAnswersBox input[data-proxy-qphoto]'));
      const perQFileInputs = Array.from(document.querySelectorAll('#proxyNumberedAnswersBox input[data-proxy-qfile]'));
      const perQFiles = [];
      Object.keys(window._proxyQueuedPhotos || {}).forEach(qNo => {
        (window._proxyQueuedPhotos[qNo] || []).forEach(f => perQFiles.push({ qNo, kind: 'photo', file: f }));
      });
      perQPhotoInputs.forEach(inp => {
        const qNo = inp.getAttribute('data-proxy-qphoto');
        const list = inp.files ? Array.from(inp.files) : [];
        list.forEach(f => perQFiles.push({ qNo, kind: 'photo', file: f }));
      });
      Object.keys(window._proxyQueuedFiles || {}).forEach(qNo => {
        (window._proxyQueuedFiles[qNo] || []).forEach(f => perQFiles.push({ qNo, kind: 'file', file: f }));
      });
      perQFileInputs.forEach(inp => {
        const qNo = inp.getAttribute('data-proxy-qfile');
        const list = inp.files ? Array.from(inp.files) : [];
        list.forEach(f => perQFiles.push({ qNo, kind: 'file', file: f }));
      });

      if (!files.length && !perQFiles.length && !url && !answer) {
        alert('문항별 정답/답안 내용을 입력하거나 사진/파일 또는 링크를 첨부해 주세요.');
        return;
      }

      const btn = document.getElementById('proxySubmitBtn');
      if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }
      try {
        const items = [];
        for (const qf of perQFiles) {
          const up = await uploadProxyFile(qf.file, currentPlan.id);
          const fType = qf.kind === 'photo' || String(qf.file.type || '').startsWith('image/') ? 'image' : 'document';
          const prefix = qf.kind === 'photo' ? ('[문항 ' + qf.qNo + '][사진] ') : ('[문항 ' + qf.qNo + '][첨부파일] ');
          items.push({ name: prefix + (up.originalName || qf.file.name), url: up.url, type: fType, comment: '' });
        }
        for (const f of files) {
          const up = await uploadProxyFile(f, currentPlan.id);
          const fType = String(f.type || '').startsWith('image/') ? 'image' : 'document';
          items.push({ name: title + ' · ' + (up.originalName || f.name), url: up.url, type: fType, comment: '' });
        }
        if (url) items.push({ name: title, url, type: 'link', comment: '' });
        if (answer) {
          // 기존 텍스트 전용 답안 행이 있으면 갱신을 위해 정리
          const stuRow = studentResults.find(r => String(r.student_id) === String(studentId));
          const prevEvs = (stuRow && Array.isArray(stuRow.evidence_list)) ? stuRow.evidence_list : [];
          for (const pe of prevEvs) {
            if (pe && (!pe.file_url || String(pe.file_url).trim() === '')) {
              try {
                await fetch('/api/ncs/evidence/' + pe.id, {
                  method: 'DELETE',
                  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
              } catch (_) {}
            }
          }
          items.push({ name: title, url: '', type: 'answer', comment: answer });
        }

        for (const it of items) {
          const res = await fetch('/api/ncs/evidence', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
              plan_id: currentPlan.id,
              student_id: Number(studentId),
              file_name: it.name,
              file_url: it.url,
              file_type: it.type,
              comment: it.comment
            })
          });
          const j = await res.json();
          if (!j?.success) throw new Error(j?.error || '제출 저장 실패');
        }

        if (document.getElementById('proxyUrlInput')) document.getElementById('proxyUrlInput').value = '';
        if (document.getElementById('proxyAnswerInput')) document.getElementById('proxyAnswerInput').value = '';
        if (fileInput) fileInput.value = '';
        alert('수강생 답안/첨부파일이 등록되었습니다.');
        await selectPlan(currentPlan.id);
      } catch (e) {
        console.error(e);
        alert(e.message || '저장 중 오류가 발생했습니다.');
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-cloud-arrow-up mr-1.5"></i>대리 답안 · 파일 저장'; }
      }
    }

    async function deleteStudentEvidence(evidenceId) {
      if (!confirm('이 제출물/답안을 삭제하시겠습니까?')) return;
      try {
        const res = await fetch('/api/ncs/evidence/' + evidenceId, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const j = await res.json();
        if (j?.success && currentPlan) {
          await selectPlan(currentPlan.id);
        } else {
          alert(j?.error || '삭제 실패');
        }
      } catch (e) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }

    function renderExamSpecPanel() {
      const box = document.getElementById('execExamSpecBody');
      if (!box) return;
      const spec = window._currentExamSpec || {};
      const q = spec.questions || { rows: [], attachments: [] };
      const tools = spec.tools || { criteria_groups: [] };
      const groups = Array.isArray(tools.criteria_groups) ? tools.criteria_groups : [];
      const rows = Array.isArray(q.rows) ? q.rows : [];
      const atts = Array.isArray(q.attachments) ? q.attachments : [];

      let html = '';
      if (groups.length) {
        html += '<div class="bg-white rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-black text-gray-800 mb-3"><i class="fas fa-list-check text-indigo-600 mr-1.5"></i>평가내용 (평가도구 수행준거)</h4>';
        groups.forEach(g => {
          html += '<div class="mb-3"><p class="text-xs font-black text-gray-800">' + escapeHtml(g.element_title || g.element_name || '수행준거') + '</p><ul class="mt-1 space-y-1">';
          const validLines = (g.lines || []).filter(l => l && String(l.text || '').trim());
          validLines.forEach((l, lIdx) => {
            html += '<li class="text-xs text-gray-700 pl-3 border-l-2 border-indigo-200"><span class="font-bold text-indigo-600 mr-1">' + (lIdx + 1) + '.</span>' + escapeHtml(l.text) + '</li>';
          });
          html += '</ul></div>';
        });
        html += '</div>';
      }

      html += '<div class="bg-white rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-black text-gray-800 mb-3"><i class="fas fa-pen-to-square text-amber-500 mr-1.5"></i>평가문항 및 문제 첨부파일 (' + rows.length + '문항)</h4>';
      if (rows.length) {
        html += '<div class="space-y-3">';
        rows.forEach((r, idx) => {
          html += '<div class="rounded-xl border border-gray-100 bg-gray-50 p-4">' +
            '<div class="flex items-center justify-between mb-2"><span class="text-xs font-black text-gray-800">문항 ' + (r.no || idx + 1) + (r.type ? ' (' + escapeHtml(r.type) + ')' : '') + '</span><span class="text-xs font-black text-indigo-600">' + (r.score || 0) + '점</span></div>' +
            '<div class="text-xs text-gray-700">' + renderNcsQuestionRichHtml(r.text || '') + '</div>' +
            (r.answer ? '<div class="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">정답/채점기준: ' + escapeHtml(r.answer) + '</div>' : '') +
          '</div>';
        });
        html += '</div>';
      } else {
        html += '<p class="text-xs text-gray-400">등록된 평가문항이 없습니다.</p>';
      }
      if (atts.length) {
        html += '<div class="mt-4 pt-3 border-t border-gray-100"><p class="text-xs font-black text-gray-600 mb-2">문제 첨부파일</p><div class="flex flex-wrap gap-2">' +
          atts.map(a => '<a href="' + escapeHtml(a.url || '') + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-sky-700 hover:bg-sky-50"><i class="fas fa-paperclip"></i>' + escapeHtml(a.name || '첨부파일') + '</a>').join('') +
        '</div></div>';
      }
      html += '</div>';
      box.innerHTML = html;
    }

    function updateScore(studentId, scoreRaw) {
      const idx = studentResults.findIndex(r => Number(r.student_id) === Number(studentId));
      if (idx < 0 || !currentPlan) return;
      const score = parseInt(scoreRaw, 10);
      studentResults[idx].score = Number.isFinite(score) ? score : null;
      studentResults[idx].is_passed = studentResults[idx].score != null && studentResults[idx].score >= currentPlan.target_score ? 1 : 0;
      renderResultTable();
    }

    function updateFeedback(studentId, feedback) {
      const idx = studentResults.findIndex(r => Number(r.student_id) === Number(studentId));
      if (idx < 0) return;
      studentResults[idx].feedback = feedback;
    }

    async function saveResults() {
      if (!currentPlan) return;
      try {
        const res = await fetch('/api/ncs/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            planId: currentPlan.id,
            results: studentResults.map(r => ({
              studentId: r.student_id,
              score: r.score,
              isPassed: r.is_passed,
              feedback: r.feedback
            }))
          })
        });
        const json = await res.json();
        if (json.success) {
          alert('평가 결과가 성공적으로 저장되었습니다.');
          selectPlan(currentPlan.id);
        } else {
          alert(json.error || '저장에 실패했습니다.');
        }
      } catch (e) {
        console.error(e);
        alert('저장 중 오류가 발생했습니다.');
      }
    }

  </script>
</body>
</html>
`;

