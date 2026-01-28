
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdNcsEvalHtml = (sidebar = hrdSidebar('ncs-eval')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>종합 NCS 평가 관리 - 교육행정 시스템</title>
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
                            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">종합 NCS 평가 현황</h1>
                            <p class="text-gray-500 mt-1 text-sm">모든 과정의 NCS 능력단위별 평가 진행 상황 및 이수율을 모니터링합니다.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="loadNcsSummary()" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
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
                                <i class="fas fa-layer-group text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">총 과정 수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalCourses">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-check-double text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">평균 이수율</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight text-emerald-600" id="statGlobalRate">0%</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mr-4 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-tasks text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">평가 완료 단위 수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statEvaluatedUnits">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-medal text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">전체 평균 점수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statGlobalAvg">0.0점</div>
                            </div>
                        </div>
                    </div>

                    <!-- 과정별 NCS 현황 목록 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                            <div class="flex items-center gap-4">
                                <h3 class="font-black text-gray-800 text-lg uppercase tracking-tight">과정별 NCS 이수 현황</h3>
                                <div class="flex bg-gray-100 p-1 rounded-xl">
                                    <button onclick="filterCourses('all')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-btn active bg-white text-indigo-600 shadow-sm" data-filter="all">전체</button>
                                    <button onclick="filterCourses('active')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-btn text-gray-500 hover:text-gray-700" data-filter="active">진행중</button>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <select id="sortSelect" onchange="sortData()" class="bg-gray-50 border-none text-xs font-bold text-gray-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none">
                                    <option value="name">과정명순</option>
                                    <option value="rate">이수율 높은순</option>
                                    <option value="avg">평균점수 높은순</option>
                                </select>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50">
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">교육 과정 정보</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">담당 강사</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">편성 단위</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">평가 완료</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">평균 점수</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">이수율 (단위기준)</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">상세 관리</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody" class="divide-y divide-gray-50">
                                    <!-- 데이터 로드 중 -->
                                    <tr>
                                        <td colspan="7" class="px-8 py-20 text-center text-gray-400">
                                            <i class="fas fa-spinner fa-spin mr-2"></i> NCS 데이터를 불러오고 있습니다...
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
            loadNcsSummary();
        });

        async function loadNcsSummary() {
            try {
                const res = await fetch('/api/hrd/ncs-eval/summary', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    allData = result.data;
                    updateStats(allData);
                    filterCourses('all');
                }
            } catch (e) {
                console.error(e);
            }
        }

        function updateStats(data) {
            if (!data || data.length === 0) return;
            
            const totalCourses = data.length;
            const globalAvg = (data.reduce((acc, cur) => acc + (cur.avg_score || 0), 0) / (data.filter(c => c.total_evals > 0).length || 1)).toFixed(1);
            const evaluatedUnits = data.reduce((acc, cur) => acc + (cur.evaluated_count || 0), 0);
            const totalUnits = data.reduce((acc, cur) => acc + (cur.unit_count || 0), 0);
            const globalRate = totalUnits > 0 ? Math.round((evaluatedUnits / totalUnits) * 100) : 0;

            document.getElementById('statTotalCourses').textContent = totalCourses + '개 과정';
            document.getElementById('statGlobalRate').textContent = globalRate + '%';
            document.getElementById('statEvaluatedUnits').textContent = evaluatedUnits + '개 단위';
            document.getElementById('statGlobalAvg').textContent = globalAvg + '점';
        }

        function filterCourses(filter) {
            const btns = document.querySelectorAll('.filter-btn');
            btns.forEach(btn => {
                if (btn.dataset.filter === filter) {
                    btn.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.remove('text-gray-500');
                } else {
                    btn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.add('text-gray-500');
                }
            });

            let filtered = allData;
            if (filter === 'active') {
                filtered = allData.filter(c => c.unit_count > 0 && c.accomplishment_rate < 100);
            }
            
            renderSummaryTable(filtered);
        }

        function sortData() {
            const sortBy = document.getElementById('sortSelect').value;
            let sorted = [...allData];

            if (sortBy === 'name') {
                sorted.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === 'rate') {
                sorted.sort((a, b) => b.accomplishment_rate - a.accomplishment_rate);
            } else if (sortBy === 'avg') {
                sorted.sort((a, b) => b.avg_score - a.avg_score);
            }

            renderSummaryTable(sorted);
        }

        function renderSummaryTable(data) {
            const tbody = document.getElementById('summaryTableBody');
            if (!tbody) return;
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-8 py-20 text-center text-gray-400">조건에 맞는 과정이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(c => \`
                <tr class="hover:bg-indigo-50/30 transition-colors group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">
                    <td class="px-8 py-5">
                        <div class="font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">\${c.title}</div>
                        <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Course ID: \${c.id}</div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-sm text-slate-600 font-black">\${c.teacher_name || '강사미지정'}</span>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-black text-slate-700">
                        \${c.unit_count}개
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-black text-indigo-500">
                        \${c.evaluated_count}개
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-sm font-black text-slate-600 font-mono">\${c.avg_score}점</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex flex-col items-center">
                            <div class="text-[11px] font-black \${c.accomplishment_rate >= 80 ? 'text-emerald-500' : c.accomplishment_rate >= 40 ? 'text-indigo-500' : 'text-amber-500'} italic font-mono uppercase tracking-tighter">\${c.accomplishment_rate}%</div>
                            <div class="w-16 h-1.5 bg-slate-100/80 rounded-full mt-1.5 overflow-hidden shadow-inner ring-1 ring-white">
                                <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.4)] \${c.accomplishment_rate >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${c.accomplishment_rate}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <a href="/admin/courses/\${c.id}/lms/ncs-eval" class="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm hover:shadow-md active:scale-95 transform whitespace-nowrap">
                            평가 관리 <i class="fas fa-chevron-right ml-2 text-[9px] opacity-50 group-hover:opacity-100"></i>
                        </a>
                    </td>
                </tr>
            \`).join('');
        }
    </script>
</body>
</html>
`;
