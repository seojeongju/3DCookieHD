
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdTrainingLogsHtml = (sidebar = hrdSidebar('training-logs')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 훈련일지 현황 - 교육행정 시스템</title>
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
                            <h1 class="text-2xl font-bold text-gray-800">통합 훈련일지 현황</h1>
                            <p class="text-gray-600 mt-1">모든 교육 과정의 훈련일지 작성 및 NCS 이수 현황을 관리합니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- 요약 통계 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mr-4">
                                <i class="fas fa-book text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">총 작성 일지</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-total-logs">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mr-4">
                                <i class="fas fa-clock text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">이번 달 합계 시간</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-month-hours">0h</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mr-4">
                                <i class="fas fa-exclamation-triangle text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">미작성 과정</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-pending-courses">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mr-4">
                                <i class="fas fa-tasks text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">NCS 평균 달성률</div>
                                <div class="text-2xl font-bold text-gray-800"><span id="stat-avg-ncs">0</span>%</div>
                            </div>
                        </div>
                    </div>

                    <!-- 필터 및 검색 -->
                    <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="flex items-center space-x-4">
                                <div class="relative">
                                    <input type="month" id="targetMonth" onchange="loadLogSummary()" class="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700">
                                    <i class="fas fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                </div>
                            </div>
                            <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 w-full md:w-80">
                                <i class="fas fa-search text-gray-400 mr-2 text-sm"></i>
                                <input type="text" id="courseSearch" oninput="filterCourses()" placeholder="과정명 또는 강사명 검색..." class="bg-transparent border-none outline-none text-sm w-full">
                            </div>
                        </div>
                    </div>

                    <!-- 과정별 일지 리스트 테이블 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50/50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">과정 정보</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">강사</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">이번 달 일지</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">총 훈련 시간</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">최근 작성일</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">NCS 달성률</th>
                                    <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="summaryTableBody" class="bg-white divide-y divide-gray-50">
                                <!-- 데이터 로드됨 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let courseSummaryData = [];
        const token = localStorage.getItem('token');

        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mmValue = String(today.getMonth() + 1).padStart(2, '0');
            document.getElementById('targetMonth').value = \`\${yyyy}-\${mmValue}\`;
            loadLogSummary();
        });

        async function loadLogSummary() {
            const month = document.getElementById('targetMonth').value;
            const tbody = document.getElementById('summaryTableBody');
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium"><i class="fas fa-circle-notch fa-spin mr-2"></i> 데이터 로딩 중...</td></tr>';

            try {
                const response = await fetch('/api/hrd/training-logs/summary?month=' + month, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    courseSummaryData = result.data;
                    updateStats();
                    renderSummaryTable(courseSummaryData);
                } else {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-red-500">데이터 로드 실패: ' + result.error + '</td></tr>';
                }
            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function updateStats() {
            const totalLogs = courseSummaryData.reduce((acc, c) => acc + c.log_count, 0);
            const totalHours = courseSummaryData.reduce((acc, c) => acc + c.total_hours, 0);
            const pending = courseSummaryData.filter(c => c.log_count === 0).length;
            const avgNcs = courseSummaryData.length > 0 ? Math.round(courseSummaryData.reduce((acc, c) => acc + c.ncs_rate, 0) / courseSummaryData.length) : 0;

            document.getElementById('stat-total-logs').textContent = totalLogs;
            document.getElementById('stat-month-hours').innerHTML = \`\${totalHours}<span class="text-sm ml-0.5">h</span>\`;
            document.getElementById('stat-pending-courses').textContent = pending;
            document.getElementById('stat-avg-ncs').textContent = avgNcs;
        }

        function filterCourses() {
            const search = document.getElementById('courseSearch').value.toLowerCase();
            const filtered = courseSummaryData.filter(c => 
                c.title.toLowerCase().includes(search) || 
                c.teacher_name.toLowerCase().includes(search)
            );
            renderSummaryTable(filtered);
        }

        function renderSummaryTable(data) {
            const tbody = document.getElementById('summaryTableBody');
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400">조건에 맞는 과정이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(c => \`
                <tr class="hover:bg-gray-50/80 transition-colors group">
                    <td class="px-6 py-5">
                        <div class="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">\${c.title}</div>
                        <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Course ID: \${c.id}</div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex items-center justify-center">
                            <span class="text-sm text-gray-700 font-bold">\${c.teacher_name}</span>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="px-3 py-1 rounded-full \${c.log_count > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'} text-xs font-bold">
                            \${c.log_count}건
                        </span>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-bold text-gray-700">
                        \${c.total_hours}h
                    </td>
                    <td class="px-6 py-5 text-center text-xs text-gray-500 font-medium">
                        \${c.last_log_date || '<span class="text-gray-300">-</span>'}
                    </td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex flex-col items-center">
                            <div class="text-sm font-black \${c.ncs_rate >= 90 ? 'text-green-600' : c.ncs_rate >= 50 ? 'text-blue-600' : 'text-amber-500'}">\${c.ncs_rate}%</div>
                            <div class="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                <div class="h-full \${c.ncs_rate >= 90 ? 'bg-green-500' : 'bg-indigo-500'}" style="width: \${c.ncs_rate}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-right">
                        <a href="/admin/courses/\${c.id}/lms/training-logs" class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                            일지 작성 <i class="fas fa-edit ml-2 text-[10px]"></i>
                        </a>
                    </td>
                </tr>
            \`).join('');
        }
    </script>
</body>
</html>
`;
