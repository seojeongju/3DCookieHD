import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsEvalExecHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 평가실행 - 교육과정 LMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        ${lmsHeaderHtml('ncs-eval', 'hrd')}

        <div class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-end gap-4 flex-wrap">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">NCS 평가실행</h1>
                <p class="text-gray-600 mt-1 text-sm" id="roundTitle">차수: 1차평가(본평가)</p>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button type="button" data-round="1" onclick="switchRound(1)" class="px-4 py-2 rounded-xl border border-slate-200 bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition">1차평가(본평가)</button>
                <button type="button" data-round="2" onclick="switchRound(2)" class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">2차평가(재평가)</button>
                <button type="button" data-round="3" onclick="switchRound(3)" class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">3차평가(재평가)</button>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-1 space-y-6">
              <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 class="font-bold text-gray-800 text-sm">평가 계획 목록</h3>
                  <span class="text-xs text-gray-400" id="planCount">0건</span>
                </div>
                <div id="planList" class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  <div class="p-6 text-center text-gray-400 text-xs">계획을 불러오는 중...</div>
                </div>
              </section>
            </div>

            <div class="lg:col-span-3">
              <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
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
                  계획을 선택하면 수강생들의 점수/이수여부/평가의견을 입력할 수 있습니다.
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

                  <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table class="w-full text-left">
                      <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th class="px-6 py-3 text-xs font-semibold text-gray-500">성명</th>
                          <th class="px-6 py-3 text-xs font-semibold text-gray-500 text-center">점수</th>
                          <th class="px-6 py-3 text-xs font-semibold text-gray-500 text-center">이수여부</th>
                          <th class="px-6 py-3 text-xs font-semibold text-gray-500">평가 의견</th>
                        </tr>
                      </thead>
                      <tbody id="resultTableBody" class="divide-y divide-gray-100">
                        <!-- JS -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const courseId = window.location.pathname.split('/')[3];
    let activeRound = 1;
    let currentPlan = null;
    let studentResults = [];

    function setRoundTitle() {
      const titleEl = document.getElementById('roundTitle');
      if (!titleEl) return;
      if (activeRound === 1) titleEl.textContent = '차수: 1차평가(본평가)';
      else if (activeRound === 2) titleEl.textContent = '차수: 2차평가(재평가)';
      else titleEl.textContent = '차수: 3차평가(재평가)';
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
      loadPlans();
    }

    document.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const r = parseInt(params.get('evaluation_round') || '1', 10);
      activeRound = [1,2,3].includes(r) ? r : 1;
      setRoundTitle();
      updateRoundTabUI();
      loadPlans();
    });

    async function loadPlans() {
      try {
        const planListEl = document.getElementById('planList');
        const planCountEl = document.getElementById('planCount');
        if (!planListEl) return;

        planListEl.innerHTML = '<div class="p-6 text-center text-gray-400 text-xs">계획을 불러오는 중...</div>';

        const res = await fetch(\`/api/ncs/plans?courseId=\${courseId}&evaluation_round=\${activeRound}\`, {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const json = await res.json();
        if (!json?.success) {
          planListEl.innerHTML = '<div class="p-6 text-center text-red-500 text-xs">계획을 불러오지 못했습니다.</div>';
          if (planCountEl) planCountEl.textContent = '0건';
          return;
        }

        const list = Array.isArray(json.data) ? json.data : [];
        if (planCountEl) planCountEl.textContent = list.length + '건';

        if (list.length === 0) {
          planListEl.innerHTML = '<div class="p-6 text-center text-gray-400 text-xs">해당 차수의 평가 계획이 없습니다.</div>';
          return;
        }

        planListEl.innerHTML = list.map(plan => \`
          <div onclick="selectPlan(\${plan.id})" class="p-4 hover:bg-blue-50 cursor-pointer transition-colors \${currentPlan?.id === plan.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}">
            <div class="flex justify-between items-start mb-1">
              <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">\${plan.unit_code}</span>
              <span class="text-xs \${plan.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'} font-bold">\${plan.status === 'confirmed' ? '완료' : '진행중'}</span>
            </div>
            <h4 class="font-bold text-gray-800 text-sm mb-1">\${plan.unit_name}</h4>
            <div class="flex justify-between text-xs text-gray-500">
              <span>\${plan.method} | \${plan.planned_date || '일정 미정'}</span>
            </div>
          </div>
        \`).join('');

      } catch (e) {
        console.error(e);
        const planListEl = document.getElementById('planList');
        if (planListEl) planListEl.innerHTML = '<div class="p-6 text-center text-red-500 text-xs">오류가 발생했습니다.</div>';
      }
    }

    async function selectPlan(planId) {
      try {
        const res = await fetch(\`/api/ncs/evaluations/\${planId}\`, {
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

        document.getElementById('selectedPlanTitle').textContent = currentPlan.unit_name;
        document.getElementById('selectedPlanInfo').textContent = \`평가방법: \${currentPlan.method} | 평가일: \${currentPlan.planned_date || '-'}\`;
        document.getElementById('selectedTargetScore').textContent = \`\${currentPlan.target_score}점\`;
        document.getElementById('selectedMethodPlan').textContent = \`\${currentPlan.method} / \${currentPlan.planned_date || '-'}\`;

        renderResultTable();
        loadPlans();
      } catch (e) {
        console.error(e);
      }
    }

    function renderResultTable() {
      const tbody = document.getElementById('resultTableBody');
      if (!tbody) return;
      tbody.innerHTML = studentResults.map(row => \`
        <tr class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="text-sm">
                <div class="font-bold text-gray-800">\${row.name}</div>
                <div class="text-[10px] text-gray-400">\${row.phone || ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-center">
            <input type="number" value="\${row.score ?? ''}"
              onchange="updateScore(\${row.student_id}, this.value)"
              class="w-20 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold">
          </td>
          <td class="px-6 py-4 text-center">
            <span class="px-2 py-1 rounded text-xs font-bold \${row.is_passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
              \${row.is_passed ? '이수 (Pass)' : '미이수 (Fail)'}
            </span>
          </td>
          <td class="px-6 py-4">
            <input type="text" value="\${row.feedback || ''}"
              onchange="updateFeedback(\${row.student_id}, this.value)"
              placeholder="평가 의견 입력"
              class="w-full px-3 py-1 border rounded-lg text-sm">
          </td>
        </tr>
      \`).join('');
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

