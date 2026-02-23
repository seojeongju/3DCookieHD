
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdSurveysHtml = (sidebar = hrdSidebar('surveys')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>종합 설문 관리 - 교육행정 시스템</title>
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
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">종합 설문 참여 현황</h1>
                            <p class="text-gray-500 mt-1 text-sm">모든 과정의 만족도 설문 및 각종 조사 참여 현황을 모니터링합니다.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="loadSurveySummary()" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- 요약 통계 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-poll-h text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">총 실시 설문 수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalSurveys">0건</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-users text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">평균 참여율</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight text-emerald-600" id="statGlobalRate">0%</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mr-4 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-reply-all text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">총 응답 수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalResponses">0명</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-check-circle text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">대상 인원</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalTarget">0명</div>
                            </div>
                        </div>
                    </div>

                    <!-- 회차별 설문 현황 목록 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="relative z-30 px-8 py-6 pb-8 border-b border-gray-50 bg-white/50 backdrop-blur-md space-y-4">
                            <div class="flex flex-wrap justify-between items-center gap-4">
                                <h3 class="font-black text-gray-800 text-lg uppercase tracking-tight">회차별 설문 참여 현황</h3>
                                <div class="flex items-center gap-3 flex-wrap">
                                    <select id="sortSelect" onchange="applyFilters()" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none relative z-10">
                                        <option value="name">과정명순</option>
                                        <option value="count">설문건수순</option>
                                        <option value="rate">참여율 높은순</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center gap-3 min-h-[2.5rem]">
                                <div class="flex bg-gray-100 p-1 rounded-xl">
                                    <button onclick="setFilterType('all'); applyFilters();" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-type-btn active bg-white text-indigo-600 shadow-sm" data-filter-type="all">전체</button>
                                    <button onclick="setFilterType('active'); applyFilters();" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-type-btn text-gray-500 hover:text-gray-700" data-filter-type="active">설문중</button>
                                </div>
                                <select id="statusFilter" onchange="applyFilters()" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none relative z-10" title="회차 상태">
                                    <option value="all">회차 상태: 전체</option>
                                    <option value="recruiting">모집중</option>
                                    <option value="in_progress">진행중</option>
                                    <option value="completed">마감</option>
                                    <option value="closed">종료</option>
                                    <option value="always_open">상시모집</option>
                                </select>
                                <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 min-w-[200px]">
                                    <i class="fas fa-search text-gray-400 mr-2 text-xs"></i>
                                    <input type="text" id="searchInput" oninput="applyFilters()" placeholder="과정명·강사명 검색" class="bg-transparent border-none outline-none text-sm w-full font-medium min-w-0">
                                </div>
                            </div>
                        </div>
                        <div class="overflow-x-auto relative z-0">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50">
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">교육 과정 정보</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">상태</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">담당 강사</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">총 설문 건수</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">전체 응답 수</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">대상 인원</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">통합 참여율</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">설문 상세</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody" class="divide-y divide-gray-50">
                                    <tr>
                                        <td colspan="8" class="px-8 py-20 text-center text-gray-400">
                                            <i class="fas fa-spinner fa-spin mr-2"></i> 설문 데이터를 불러오고 있습니다...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let allData = [];
        const token = localStorage.getItem('token');

        document.addEventListener('DOMContentLoaded', () => {
            loadSurveySummary();
        });

        async function loadSurveySummary() {
            try {
                const res = await fetch('/api/hrd/surveys/summary', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    allData = result.data || [];
                    updateStats(allData);
                    applyFilters();
                }
            } catch (e) {
                console.error(e);
            }
        }

        function updateStats(data) {
            const list = data && data.length ? data : [];
            const totalSurveys = list.reduce((acc, cur) => acc + (cur.survey_count || 0), 0);
            const totalResponses = list.reduce((acc, cur) => acc + (cur.response_count || 0), 0);
            const studentCount = list.reduce((acc, cur) => acc + (cur.student_count || 0), 0);
            const totalPossibleResponses = list.reduce((acc, cur) => acc + ((cur.survey_count || 0) * (cur.student_count || 0)), 0);
            const globalRate = totalPossibleResponses > 0 ? Math.round((totalResponses / totalPossibleResponses) * 100) : 0;

            const el1 = document.getElementById('statTotalSurveys');
            const el2 = document.getElementById('statGlobalRate');
            const el3 = document.getElementById('statTotalResponses');
            const el4 = document.getElementById('statTotalTarget');
            if (el1) el1.textContent = totalSurveys + '건';
            if (el2) el2.textContent = globalRate + '%';
            if (el3) el3.textContent = totalResponses + '명';
            if (el4) el4.textContent = studentCount + '명';
        }

        let currentFilterType = 'all';
        function setFilterType(type) {
            currentFilterType = type;
            document.querySelectorAll('.filter-type-btn').forEach(btn => {
                if (btn.dataset.filterType === type) {
                    btn.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.remove('text-gray-500');
                } else {
                    btn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.add('text-gray-500');
                }
            });
        }

        function applyFilters() {
            const statusVal = (document.getElementById('statusFilter') && document.getElementById('statusFilter').value) || 'all';
            const search = (document.getElementById('searchInput') && document.getElementById('searchInput').value.trim()) || '';
            const sortBy = (document.getElementById('sortSelect') && document.getElementById('sortSelect').value) || 'name';

            let filtered = allData;
            if (statusVal !== 'all') {
                filtered = filtered.filter(c => (String(c.status || '')).toLowerCase() === statusVal);
            }
            if (currentFilterType === 'active') {
                filtered = filtered.filter(c => (c.survey_count || 0) > 0);
            }
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(c =>
                    (c.title && c.title.toLowerCase().includes(q)) ||
                    (c.teacher_name && c.teacher_name.toLowerCase().includes(q))
                );
            }
            if (sortBy === 'name') {
                filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            } else if (sortBy === 'count') {
                filtered.sort((a, b) => (b.survey_count || 0) - (a.survey_count || 0));
            } else if (sortBy === 'rate') {
                filtered.sort((a, b) => (b.participation_rate || 0) - (a.participation_rate || 0));
            }
            renderSummaryTable(filtered);
        }

        function renderSummaryTable(data) {
            const tbody = document.getElementById('summaryTableBody');
            if (!tbody) return;
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-8 py-20 text-center text-gray-400">조건에 맞는 회차가 없습니다.</td></tr>';
                return;
            }
            const statusClass = (s) => {
                if (['active','in_progress','open'].includes(s)) return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
                if (['recruiting','always_open'].includes(s)) return 'bg-blue-50 text-blue-600 ring-blue-100';
                if (['completed','closed'].includes(s)) return 'bg-slate-100 text-slate-600 ring-slate-200';
                return 'bg-gray-50 text-gray-600 ring-gray-200';
            };
            tbody.innerHTML = data.map(c => \`
                <tr class="hover:bg-indigo-50/30 transition-colors group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">
                    <td class="px-8 py-5">
                        <div class="font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">\${c.title || '-'}</div>
                        <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">회차 ID: \${c.session_id != null ? c.session_id : (c.id != null ? c.id : '-')}</div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-bold ring-1 \${statusClass(c.status)}">\${c.status_label || c.status || '-'}</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-sm text-slate-600 font-black">\${c.teacher_name || '강사미지정'}</span>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-black text-slate-700">\${c.survey_count ?? 0}건</td>
                    <td class="px-6 py-5 text-center text-sm font-black text-indigo-500">\${c.response_count ?? 0}명</td>
                    <td class="px-6 py-5 text-center text-sm font-black text-slate-500">\${c.student_count ?? 0}명</td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex flex-col items-center">
                            <div class="text-[11px] font-black \${(c.participation_rate || 0) >= 80 ? 'text-emerald-500' : (c.participation_rate || 0) >= 50 ? 'text-indigo-500' : 'text-amber-500'} italic font-mono uppercase tracking-tighter">\${c.participation_rate ?? 0}%</div>
                            <div class="w-16 h-1.5 bg-slate-100/80 rounded-full mt-1.5 overflow-hidden shadow-inner ring-1 ring-white">
                                <div class="h-full transition-all duration-1000 ease-out \${(c.participation_rate || 0) >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${Math.min(100, c.participation_rate || 0)}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        \${(c.session_id != null || c.id != null) ? '<a href="/admin/courses/' + (c.session_id != null ? c.session_id : c.id) + '/lms/surveys" class="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm hover:shadow-md active:scale-95 transform whitespace-nowrap">설문 관리 <i class="fas fa-poll ml-2 text-[9px] opacity-50 group-hover:opacity-100"></i></a>' : '<span class="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-400 cursor-not-allowed whitespace-nowrap">회차 없음</span>'}
                    </td>
                </tr>
            \`).join('');
        }
    </script>
</body>
</html>
`;
