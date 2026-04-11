import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsNcsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 평가 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('ncs-eval', 'hrd')}

    <!-- 헤더 -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-end">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">NCS 평가 관리</h1>
                    <p class="text-gray-600 mt-1" id="courseTitle">과정명 로딩중...</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="const url = new URL(window.location.href); url.pathname = url.pathname.replace('/ncs-eval', '/ncs-report'); window.open(url.toString());" class="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition flex items-center shadow-sm">
                        <i class="fas fa-print mr-2"></i> 결과 보고서
                    </button>
                    <button onclick="openPlanModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 평가 계획 등록
                    </button>
                    <button onclick="saveResults()" id="btnSaveResults" class="hidden px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center shadow-sm">
                        <i class="fas fa-check-circle mr-2"></i> 평가 결과 저장
                    </button>
                </div>
            </div>
            <div class="mt-5 border-t border-slate-100 pt-4">
                <div class="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/70 p-2">
                    <button type="button" onclick="goToNcsPlanPage()" class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition">
                        <i class="fas fa-clipboard-list mr-1.5"></i>NCS평가계획
                    </button>
                    <button type="button" onclick="goToNcsExecPage()" class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition">
                        <i class="fas fa-play-circle mr-1.5"></i>NCS평가실행
                    </button>
                    <button type="button" onclick="goToNcsResultPage()" class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition">
                        <i class="fas fa-poll mr-1.5"></i>NCS평가결과
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <!-- 왼쪽: 평가 계획 목록 및 훈련 현황 -->
            <div class="lg:col-span-1 space-y-6">
                <section id="ncs-plan-section" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800">평가 계획 목록</h3>
                        <span class="text-xs text-gray-400" id="planCount">0건</span>
                    </div>
                    <div id="planList" class="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                        <div class="p-8 text-center text-gray-400">계획을 불러오는 중...</div>
                    </div>
                </section>

                <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800 text-sm">NCS 훈련 이수 현황</h3>
                        <i class="fas fa-chart-line text-blue-400"></i>
                    </div>
                    <div id="ncsProgress" class="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                        <div class="p-8 text-center text-gray-400 text-xs">데이터 로딩 중...</div>
                    </div>
                </section>

                <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800 text-sm">NCS평가(본평가)용 문제</h3>
                        <span class="text-xs text-gray-400" id="ncsQuestionsCount">0문항</span>
                    </div>
                    <div id="ncsCourseQuestionsList" class="divide-y divide-gray-100 max-h-[280px] overflow-y-auto p-2">
                        <div class="p-6 text-center text-gray-400 text-xs">불러오는 중...</div>
                    </div>
                    <p class="px-4 pb-3 text-[10px] text-gray-400">문제은행 페이지에서 이 회차를 선택 후 &quot;NCS평가(본평가)에 추가&quot;로 등록한 문제입니다.</p>
                </section>
            </div>

            <!-- 오른쪽: 평가 실행 및 결과 입력 -->
            <div class="lg:col-span-3">
                <div id="evaluationSection" class="hidden space-y-6">
                    <!-- 선택된 계획 정보 -->
                    <div id="ncs-execution-section" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded" id="selectedUnitCode">-</span>
                                <h2 class="text-xl font-bold text-gray-800 mt-1" id="selectedPlanTitle">평가를 선택해주세요</h2>
                                <p class="text-sm text-gray-500 mt-1" id="selectedPlanInfo">-</p>
                            </div>
                            <div class="text-right flex flex-col items-end gap-2">
                                <div>
                                    <span class="block text-xs text-gray-400 mb-1">통과 기준</span>
                                    <span class="text-lg font-bold text-purple-600" id="selectedTargetScore">0점</span>
                                </div>
                                <button onclick="if(!currentPlan) return; location.href='/api/ncs/plans/' + currentPlan.id + '/export-csv'" class="px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 rounded-lg text-xs font-bold transition flex items-center shadow-sm">
                                    <i class="fas fa-file-excel mr-1"></i> CSV 다운로드
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 결과 입력 테이블 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                <!-- JS 로 주입 -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 선택 전 안내 -->
                <div id="noSelection" class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-20 text-center">
                    <i class="fas fa-file-signature text-5xl text-gray-200 mb-4"></i>
                    <p class="text-gray-400 font-medium">왼쪽 목록에서 평가 계획을 선택하여<br>평가 결과를 입력하시거나 새로운 계획을 등록해주세요.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 계획 등록 모달 -->
    <div id="planModal" class="fixed inset-0 bg-black/50 hidden z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-xl font-bold text-gray-800">평가 계획 등록</h3>
                <button onclick="closePlanModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="planForm" onsubmit="handleSavePlan(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">NCS 능력단위 *</label>
                    <select id="planUnitId" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">능력단위 선택</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">평가 방법 *</label>
                    <select id="planMethod" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="서술형시험">서술형시험</option>
                        <option value="논술형시험">논술형시험</option>
                        <option value="작업장평가">작업장평가 (실기)</option>
                        <option value="포트폴리오">포트폴리오</option>
                        <option value="사례연구">사례연구</option>
                        <option value="구두발표">구두발표 (면접)</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">평가 일자</label>
                        <input type="date" id="planDate" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">통과 기준 점수</label>
                        <input type="number" id="planTargetScore" value="60" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div class="pt-4 flex gap-3">
                    <button type="button" onclick="closePlanModal()" class="flex-1 px-4 py-2 border rounded-lg text-gray-600 font-medium">취소</button>
                    <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">등록하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const courseId = new URLSearchParams(window.location.search).get('session_id') || window.location.pathname.split('/')[3];
        let currentPlan = null;
        let studentResults = [];

        function scrollToNcsSection(sectionId) {
            const el = document.getElementById(sectionId);
            if (!el) return;
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function goToNcsPlanPage() {
            const url = new URL(window.location.href);
            url.pathname = url.pathname.replace('/ncs-eval', '/ncs-eval-plan');
            window.location.href = url.toString();
        }

        function goToNcsExecPage() {
            const url = new URL(window.location.href);
            url.pathname = url.pathname.replace('/ncs-eval', '/ncs-eval-exec');
            window.location.href = url.toString();
        }

        function goToNcsResultPage() {
            const url = new URL(window.location.href);
            url.pathname = url.pathname.replace('/ncs-eval', '/ncs-eval-result');
            window.location.href = url.toString();
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadCourseInfo();
            loadAssignedUnits();
            loadPlans();
            calculateNcsProgress();
            loadNcsCourseQuestions();
        });

        async function loadNcsCourseQuestions() {
            const listEl = document.getElementById('ncsCourseQuestionsList');
            const countEl = document.getElementById('ncsQuestionsCount');
            if (!listEl) return;
            try {
                const res = await fetch(\`/api/cbt/ncs-course-questions?session_id=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const json = await res.json();
                const list = (json && json.success && Array.isArray(json.data)) ? json.data : [];
                if (countEl) countEl.textContent = list.length + '문항';
                if (list.length === 0) {
                    listEl.innerHTML = '<div class="p-6 text-center text-gray-400 text-xs">등록된 NCS평가(본평가)용 문제가 없습니다.<br>문제은행 페이지에서 이 회차를 선택 후 NCS평가(본평가)에 추가하세요.</div>';
                    return;
                }
                const diffLabel = (d) => (d === 'high' ? '상' : d === 'medium' ? '중' : d === 'low' ? '하' : '-');
                const typeLabel = (t) => (t === 'multiple_choice' ? '객관식' : t === 'short_answer' ? '단답형' : t === 'essay' ? '서술형' : (t || '').replace('_', ' '));
                listEl.innerHTML = list.map((q, idx) => \`
                    <div class="px-3 py-2.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition">
                        <div class="flex items-start gap-2">
                            <span class="shrink-0 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">\${idx + 1}</span>
                            <span class="shrink-0 px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-medium text-indigo-700" title="분류">\${String(q.category || '-').replace(/</g, '&lt;')}</span>
                            <span class="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600" title="문제유형">\${typeLabel(q.question_type)}</span>
                            <span class="shrink-0 px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-medium text-amber-700" title="난이도">\${diffLabel(q.difficulty)}</span>
                            <p class="text-[11px] text-slate-700 line-clamp-2 flex-1 min-w-0">\${String(q.question_text || '').replace(/</g, '&lt;')}</p>
                        </div>
                    </div>
                \`).join('');
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class="p-6 text-center text-red-400 text-xs">목록을 불러오지 못했습니다.</div>';
                if (countEl) countEl.textContent = '0문항';
            }
        }

        async function calculateNcsProgress() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                const container = document.getElementById('ncsProgress');
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        return \`
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition">
                                <div class="flex justify-between text-[10px] font-bold mb-1.5">
                                    <span class="text-gray-400">\${item.unit_code}</span>
                                    <span class="text-blue-600 font-black">\${item.current_hours} / \${item.target_hours}h (\${percent.toFixed(0)}%)</span>
                                </div>
                                <div class="text-[11px] font-bold text-gray-700 truncate mb-2">\${item.unit_name}</div>
                                <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden shadow-inner">
                                    <div class="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.4)]" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    container.innerHTML = '<div class="text-center text-gray-400 py-10 text-xs font-medium border-2 border-dashed rounded-xl">NCS 배정 정보가 없습니다.</div>';
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function loadCourseInfo() {
            try {
                const token = localStorage.getItem('token');
                const urlParams = new URLSearchParams(window.location.search);
                let type = urlParams.get('type') || '';
                if (typeof type !== 'string') type = '';
                // LMS 상단 헤더(lms_header)와 동일: 회차 ID가 courses 테이블 ID와 충돌할 때는 type=hrd로 course_sessions 기준 조회
                if (!type && window.location.pathname.includes('/lms')) type = 'hrd';
                if (type && type.startsWith('hrd')) type = 'hrd';
                if (type === 'undefined') type = 'hrd';

                let apiUrl = '/api/courses/' + courseId + (type ? '?type=' + encodeURIComponent(type) : '');
                let res = await fetch(apiUrl, { headers: { 'Authorization': 'Bearer ' + token } });
                if (res.status === 404) {
                    apiUrl = '/api/courses/' + courseId + '?type=hrd';
                    res = await fetch(apiUrl, { headers: { 'Authorization': 'Bearer ' + token } });
                }
                const result = await res.json();
                if (result.success) {
                    document.getElementById('courseTitle').textContent = result.data.title;
                }
            } catch (e) { console.error(e); }
        }

        async function loadAssignedUnits() {
            try {
                const res = await fetch(\`/api/ncs/courses/\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    const select = document.getElementById('planUnitId');
                    result.data.forEach(unit => {
                        const opt = document.createElement('option');
                        opt.value = unit.ncs_unit_id;
                        opt.textContent = \`[\${unit.code}] \${unit.name} (\${unit.level}수준)\`;
                        select.appendChild(opt);
                    });
                }
            } catch (e) { console.error(e); }
        }

        async function loadPlans() {
            try {
                const res = await fetch(\`/api/ncs/plans?courseId=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    const list = document.getElementById('planList');
                    document.getElementById('planCount').textContent = result.data.length + '건';
                    
                    if (result.data.length === 0) {
                        list.innerHTML = '<div class="p-8 text-center text-gray-400">등록된 평가 계획이 없습니다.</div>';
                        return;
                    }

                    list.innerHTML = result.data.map(plan => \`
                        <div onclick="selectPlan(\${plan.id})" class="p-4 hover:bg-blue-50 cursor-pointer transition-colors \${currentPlan?.id === plan.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}">
                            <div class="flex justify-between items-start mb-1">
                                <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">\${plan.unit_code}</span>
                                <span class="text-xs \${plan.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'} font-bold">\${plan.status === 'confirmed' ? '완료' : '진행중'}</span>
                            </div>
                            <h4 class="font-bold text-gray-800 text-sm mb-1">\${plan.unit_name}</h4>
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>\${plan.method} | \${plan.planned_date || '일정 미정'}</span>
                                <button onclick="deletePlan(event, \${plan.id})" class="text-gray-300 hover:text-red-500 transition"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    \`).join('');
                }
            } catch (e) { console.error(e); }
        }

        async function selectPlan(planId) {
            try {
                const res = await fetch(\`/api/ncs/evaluations/\${planId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    currentPlan = result.plan;
                    studentResults = result.data;
                    
                    document.getElementById('noSelection').classList.add('hidden');
                    document.getElementById('evaluationSection').classList.remove('hidden');
                    document.getElementById('btnSaveResults').classList.remove('hidden');
                    
                    document.getElementById('selectedPlanTitle').textContent = currentPlan.unit_name;
                    document.getElementById('selectedUnitCode').textContent = currentPlan.unit_code;
                    document.getElementById('selectedPlanInfo').textContent = \`평가방법: \${currentPlan.method} | 평가일: \${currentPlan.planned_date || '-'}\`;
                    document.getElementById('selectedTargetScore').textContent = \`\${currentPlan.target_score}점\`;
                    
                    renderResultTable();
                    loadPlans(); // 활성화 상태 표시 업데이트
                }
            } catch (e) { console.error(e); }
        }

        function renderResultTable() {
            const tbody = document.getElementById('resultTableBody');
            tbody.innerHTML = studentResults.map((row, idx) => \`
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="text-sm">
                                <div class="font-bold text-gray-800">\${row.name}</div>
                                <div class="text-[10px] text-gray-400">\${row.phone}</div>
                            </div>
                            <button onclick="viewEvidence(\${row.student_id}, '\${row.name}')" class="px-2 py-1 bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-600 rounded text-[10px] font-bold transition flex items-center gap-1">
                                <i class="fas fa-file-invoice"></i> 증빙자료
                            </button>
                            <button onclick="window.open('/admin/courses/\${courseId}/lms/ncs-report/\${row.student_id}')" class="px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded text-[10px] font-bold transition flex items-center gap-1">
                                <i class="fas fa-print"></i> 통지서
                            </button>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <input type="number" value="\${row.score || ''}" 
                            onchange="updateScore(\${idx}, this.value)"
                            class="w-20 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold">
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2 py-1 \${row.is_passed ? 'bg-green-101 text-green-700' : 'bg-red-101 text-red-700'} rounded text-xs font-bold">
                            \${row.is_passed ? '이수 (Pass)' : '미이수 (Fail)'}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <input type="text" value="\${row.feedback || ''}" 
                            onchange="studentResults[\${idx}].feedback = this.value"
                            placeholder="평가 의견 입력"
                            class="w-full px-3 py-1 border rounded-lg text-sm">
                    </td>
                </tr>
            \`).join('');
        }

        async function viewEvidence(studentId, studentName) {
            document.getElementById('evidenceTitle').textContent = studentName + ' - 증빙 자료';
            document.getElementById('evidenceModal').classList.remove('hidden');
            
            try {
                const res = await fetch(\`/api/ncs/evidence?planId=\${currentPlan.id}&studentId=\${studentId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                const container = document.getElementById('evidenceList');
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(f => \`
                        <div class="p-3 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-blue-50 text-blue-600 rounded-lg"><i class="fas fa-file"></i></div>
                                <div>
                                    <div class="text-sm font-bold text-gray-800">\${f.file_name}</div>
                                    <div class="text-[10px] text-gray-400">\${new Date(f.uploaded_at).toLocaleString()}</div>
                                </div>
                            </div>
                            <a href="\${f.file_url}" target="_blank" class="px-3 py-1 bg-white border text-xs font-bold rounded-lg hover:bg-gray-100">보기</a>
                        </div>
                    \`).join('');
                } else {
                    container.innerHTML = '<div class="py-10 text-center text-gray-400 text-sm">제출된 자료가 없습니다.</div>';
                }
            } catch (e) { console.error(e); }
        }

        function closeEvidenceModal() { document.getElementById('evidenceModal').classList.add('hidden'); }

        function updateScore(idx, score) {
            score = parseInt(score);
            studentResults[idx].score = score;
            studentResults[idx].is_passed = score >= currentPlan.target_score ? 1 : 0;
            renderResultTable();
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
                if ((await res.json()).success) {
                    alert('평가 결과가 성공적으로 저장되었습니다.');
                    selectPlan(currentPlan.id);
                }
            } catch (e) { console.error(e); }
        }

        function openPlanModal() { document.getElementById('planModal').classList.remove('hidden'); }
        function closePlanModal() { document.getElementById('planModal').classList.add('hidden'); }

        async function handleSavePlan(e) {
            e.preventDefault();
            const data = {
                course_id: parseInt(courseId),
                ncs_unit_id: parseInt(document.getElementById('planUnitId').value),
                method: document.getElementById('planMethod').value,
                planned_date: document.getElementById('planDate').value,
                target_score: parseInt(document.getElementById('planTargetScore').value)
            };

            try {
                const res = await fetch('/api/ncs/plans', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                if ((await res.json()).success) {
                    closePlanModal();
                    loadPlans();
                }
            } catch (e) { console.error(e); }
        }

        async function deletePlan(e, id) {
            e.stopPropagation();
            if (!confirm('이 평가 계획과 모든 하위 결과가 삭제됩니다. 계속하시겠습니까?')) return;
            try {
                const res = await fetch(\`/api/ncs/plans/\${id}\`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                if ((await res.json()).success) {
                    if (currentPlan?.id === id) {
                        currentPlan = null;
                        document.getElementById('evaluationSection').classList.add('hidden');
                        document.getElementById('noSelection').classList.remove('hidden');
                        document.getElementById('btnSaveResults').classList.add('hidden');
                    }
                    loadPlans();
                }
            } catch (e) { console.error(e); }
        }
    </script>
    <!-- 증빙 자료 확인 모달 -->
    <div id="evidenceModal" class="fixed inset-0 bg-black/60 hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
            <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800" id="evidenceTitle">증빙 자료</h3>
                <button onclick="closeEvidenceModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div id="evidenceList" class="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                <!-- JS Load -->
            </div>
            <div class="p-4 bg-gray-50 border-t text-center">
                <button onclick="closeEvidenceModal()" class="px-6 py-2 bg-white border rounded-lg text-sm font-bold shadow-sm">닫기</button>
            </div>
        </div>
    </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
