
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdAttendanceHtml = (sidebar = hrdSidebar('attendance')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 출석 현황 - 교육행정 시스템</title>
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
                            <h1 class="text-2xl font-bold text-gray-800">출결 관리</h1>
                            <p class="text-gray-600 mt-1">각 과정별 출결을 확인하고 관리합니다. 관리할 과정을 선택하세요.</p>
                        </div>
                        <div class="flex space-x-2">
                             <button onclick="location.href='/admin/attendance/print'" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center shadow-sm text-sm font-bold">
                                <i class="fas fa-print mr-2"></i> 출석부 일괄 출력
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
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mr-4">
                                <i class="fas fa-graduation-cap text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">관리 대상 과정</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-total-courses">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mr-4">
                                <i class="fas fa-user-check text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">오늘 출석 인원</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-total-present">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mr-4">
                                <i class="fas fa-user-times text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">오늘 결석 인원</div>
                                <div class="text-2xl font-bold text-gray-800" id="stat-total-absent">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mr-4">
                                <i class="fas fa-chart-line text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 font-medium">평균 출석률</div>
                                <div class="text-2xl font-bold text-gray-800"><span id="stat-avg-rate">0</span>%</div>
                            </div>
                        </div>
                    </div>

                    <!-- 필터 및 검색 -->
                    <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="flex items-center space-x-4">
                                <div class="relative">
                                    <input type="date" id="targetDate" onchange="loadAttendanceSummary()" class="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700">
                                    <i class="fas fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                </div>
                                <div class="text-sm text-gray-500 font-medium">
                                    기준: <span id="displayDate" class="text-blue-600 font-bold"></span>
                                </div>
                            </div>
                            <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 w-full md:w-80">
                                <i class="fas fa-search text-gray-400 mr-2 text-sm"></i>
                                <input type="text" id="courseSearch" oninput="filterCourses()" placeholder="과정명 또는 강사명 검색..." class="bg-transparent border-none outline-none text-sm w-full">
                            </div>
                        </div>
                    </div>

                    <!-- 과정 리스트 테이블 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50/50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">과정 정보</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">강사</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">총원</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">출석 / 지각 / 결석</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">미처리</th>
                                    <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">출석률</th>
                                    <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="summaryTableBody" class="bg-white divide-y divide-gray-50">
                                <!-- 데이터 로드됨 -->
                            </tbody>
                        </table>
                        
                        <!-- 페이지네이션 -->
                        <div class="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                            <div class="text-xs text-gray-500 font-medium">
                                전체 <span id="total-count" class="font-bold text-gray-700">0</span>개 과정 중 
                                <span id="current-range" class="font-bold text-gray-700">0-0</span> 표시
                            </div>
                            <div class="flex items-center space-x-1" id="paginationControls">
                                <!-- 페이지 버튼 로드됨 -->
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let currentPage = 1;
        const itemsPerPage = 10;
        const token = localStorage.getItem('token');

        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date();
            document.getElementById('targetDate').value = today.toISOString().split('T')[0];
            updateDisplayDate();
            loadAttendanceSummary();
        });

        function updateDisplayDate() {
            const dateVal = document.getElementById('targetDate').value;
            const dateObj = new Date(dateVal);
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            document.getElementById('displayDate').textContent = \`\${dateVal} (\${days[dateObj.getDay()]})\`;
        }

        async function loadAttendanceSummary() {
            const date = document.getElementById('targetDate').value;
            const search = document.getElementById('courseSearch').value;
            updateDisplayDate();
            
            const tbody = document.getElementById('summaryTableBody');
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium"><i class="fas fa-circle-notch fa-spin mr-2"></i> 데이터 로딩 중...</td></tr>';

            try {
                const url = \`/api/hrd/attendance/summary?date=\${date}&page=\${currentPage}&limit=\${itemsPerPage}&search=\${encodeURIComponent(search)}\`;
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    updateStats(result.stats);
                    renderSummaryTable(result.data, result.pagination);
                } else {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-red-500">데이터 로드 실패: ' + result.error + '</td></tr>';
                }
            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function updateStats(stats) {
            document.getElementById('stat-total-courses').textContent = stats.totalCourses;
            document.getElementById('stat-total-present').textContent = stats.totalPresent;
            document.getElementById('stat-total-absent').textContent = stats.totalAbsent;
            document.getElementById('stat-avg-rate').textContent = stats.avgRate;
        }

        function filterCourses() {
            currentPage = 1; // 검색 시 1페이지로 리셋
            loadAttendanceSummary();
        }

        function goToPage(page) {
            currentPage = page;
            loadAttendanceSummary();
        }

        function renderSummaryTable(pageData, pagination) {
            const tbody = document.getElementById('summaryTableBody');
            const { total, page, limit, totalPages } = pagination;
            
            if (pageData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400">조건에 맞는 과정이 없습니다.</td></tr>';
                document.getElementById('total-count').textContent = '0';
                document.getElementById('current-range').textContent = '0-0';
                document.getElementById('paginationControls').innerHTML = '';
                return;
            }

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + pageData.length;

            document.getElementById('total-count').textContent = total;
            document.getElementById('current-range').textContent = \`\${startIndex + 1}-\${endIndex}\`;

            tbody.innerHTML = pageData.map(c => \`
                <tr class="hover:bg-gray-50/80 transition-colors group cursor-pointer" onclick="location.href='/admin/courses/\${c.id}/lms/attendance?type=\${c.type}'">
                    <td class="px-6 py-5">
                        <div class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">\${c.title}</div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded uppercase tracking-wider">\${c.type}</span>
                            <span class="text-[10px] text-gray-400 font-semibold">ID: \${c.id}</span>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex items-center justify-center">
                            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 mr-2">\${c.teacher_name.charAt(0)}</div>
                            <span class="text-sm text-gray-700 font-bold">\${c.teacher_name}</span>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-bold text-gray-600">
                        \${c.total_students}명
                    </td>
                    <td class="px-6 py-5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <span class="px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-bold">\${c.present}</span>
                            <span class="px-2 py-1 rounded-md bg-yellow-50 text-yellow-600 text-xs font-bold">\${c.late}</span>
                            <span class="px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold">\${c.absent}</span>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-sm font-bold \${c.pending > 0 ? 'text-orange-500' : 'text-gray-300'}">\${c.pending}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex flex-col items-center">
                            <div class="text-sm font-black \${c.rate >= 90 ? 'text-green-600' : c.rate >= 70 ? 'text-blue-600' : 'text-red-500'}">\${c.rate}%</div>
                            <div class="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                <div class="h-full \${c.rate >= 90 ? 'bg-green-500' : c.rate >= 70 ? 'bg-blue-500' : 'bg-red-500'}" style="width: \${c.rate}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-right">
                        <a href="/admin/courses/\${c.id}/lms/attendance?type=\${c.type}" class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                            출결 관리 <i class="fas fa-chevron-right ml-2 text-[10px]"></i>
                        </a>
                    </td>
                </tr>
            \`).join('');

            // 페이지네이션 컨트롤 렌더링
            let paginationHtml = '';
            
            // 이전 버튼
            paginationHtml += \`
                <button onclick="goToPage(\${Math.max(1, currentPage - 1)})" \${currentPage === 1 ? 'disabled' : ''} class="w-8 h-8 flex items-center justify-center rounded-lg \${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'} transition">
                    <i class="fas fa-chevron-left text-[10px]"></i>
                </button>
            \`;

            // 페이지 번호
            for (let i = 1; i <= totalPages; i++) {
                if (totalPages > 7) {
                    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                        paginationHtml += \`
                            <button onclick="goToPage(\${i})" class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold \${currentPage === i ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-gray-100'} transition">
                                \${i}
                            </button>
                        \`;
                    } else if (i === currentPage - 3 || i === currentPage + 3) {
                        paginationHtml += '<span class="text-gray-300 text-xs px-1">...</span>';
                    }
                } else {
                    paginationHtml += \`
                        <button onclick="goToPage(\${i})" class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold \${currentPage === i ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-gray-100'} transition">
                            \${i}
                        </button>
                    \`;
                }
            }

            // 다음 버튼
            paginationHtml += \`
                <button onclick="goToPage(\${Math.min(totalPages, currentPage + 1)})" \${currentPage === totalPages ? 'disabled' : ''} class="w-8 h-8 flex items-center justify-center rounded-lg \${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'} transition">
                    <i class="fas fa-chevron-right text-[10px]"></i>
                </button>
            \`;

            document.getElementById('paginationControls').innerHTML = paginationHtml;
        }
    </script>
</body>
</html>
`;
