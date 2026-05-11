
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdAttendanceHtml = (sidebar = hrdSidebar('attendance')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 출석 현황 - 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div class="px-6 py-5 lg:px-8">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                                <i class="fas fa-calendar-check text-lg"></i>
                            </div>
                            <div>
                                <h1 class="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">출결 관리 현황</h1>
                                <p class="text-xs lg:text-sm text-gray-500 font-medium">실시간 과정별 출석 통계를 확인하고 출석부를 관리합니다.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                             <button onclick="location.href='/admin/attendance/print'" class="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95 text-xs font-bold shrink-0">
                                <i class="fas fa-print mr-2 text-[10px]"></i> 출석부 일괄 출력
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-8 pb-10">
                    
                    <!-- 요약 통계 그리드 -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <!-- 과정 수 -->
                        <div class="bg-white px-5 py-6 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
                            <div class="flex flex-col">
                                <span class="text-[11px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-primary-500 transition-colors">전체 과정 수</span>
                                <div class="flex items-end justify-between">
                                    <div class="text-2xl lg:text-3xl font-black text-gray-900" id="stat-total-courses">0</div>
                                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                                        <i class="fas fa-book-open text-sm lg:text-base"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 출격 인원 -->
                        <div class="bg-white px-5 py-6 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-green-200/40 transition-all duration-300 group">
                            <div class="flex flex-col">
                                <span class="text-[11px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-500 transition-colors">현재까지 출석</span>
                                <div class="flex items-end justify-between">
                                    <div class="text-2xl lg:text-3xl font-black text-gray-900" id="stat-total-present">0</div>
                                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-500 transition-all">
                                        <i class="fas fa-user-check text-sm lg:text-base"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 결석 인원 -->
                        <div class="bg-white px-5 py-6 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-red-200/40 transition-all duration-300 group">
                            <div class="flex flex-col">
                                <span class="text-[11px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">현재까지 결석</span>
                                <div class="flex items-end justify-between">
                                    <div class="text-2xl lg:text-3xl font-black text-gray-900" id="stat-total-absent">0</div>
                                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                        <i class="fas fa-user-xmark text-sm lg:text-base"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 출석률 -->
                        <div class="bg-white px-5 py-6 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-300 group relative overflow-hidden">
                            <div class="absolute -right-2 -bottom-2 w-20 h-20 bg-blue-50/30 rounded-full blur-2xl"></div>
                            <div class="flex flex-col relative z-10">
                                <span class="text-[11px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">평균 출석률</span>
                                <div class="flex items-end justify-between">
                                    <div class="text-2xl lg:text-3xl font-black text-gray-900"><span id="stat-avg-rate">0</span>%</div>
                                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                        <i class="fas fa-chart-line text-sm lg:text-base"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 유틸리티 바 (날짜 선택 & 과정 상태 필터 & 검색) -->
                    <div class="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 p-2 lg:p-3 border border-gray-100">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:gap-4">
                            <div class="flex flex-wrap items-center gap-2 lg:gap-3">
                                <div class="flex items-center p-1.5 lg:p-2 bg-gray-100/50 rounded-2xl">
                                    <div class="relative flex-shrink-0">
                                        <input type="date" id="targetDate" onchange="loadAttendanceSummary()" class="absolute inset-0 opacity-0 cursor-pointer">
                                        <div class="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 group hover:border-primary-300 transition-all">
                                            <i class="fas fa-calendar-days text-primary-500 text-xs"></i>
                                            <span id="displayDate" class="text-sm font-black text-gray-700">날짜 선택</span>
                                            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center bg-gray-100/50 rounded-2xl px-2 py-1.5">
                                    <i class="fas fa-filter text-gray-400 text-xs mr-2"></i>
                                    <label for="courseStatusFilter" class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-2 hidden sm:inline">과정 상태</label>
                                    <select id="courseStatusFilter" onchange="loadAttendanceSummary()" class="bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary-200">
                                        <option value="all">전체 과정 (마감/진행/모집 등)</option>
                                        <option value="recruiting">모집중</option>
                                        <option value="in_progress">진행중</option>
                                        <option value="always_open">상시모집</option>
                                        <option value="completed">마감</option>
                                        <option value="closed">종료</option>
                                    </select>
                                </div>
                                <div class="ml-auto px-4 hidden lg:block border-l border-gray-200">
                                    <span class="text-xs text-gray-400 font-bold uppercase tracking-tighter">모니터링 상태:</span>
                                    <span class="inline-flex items-center ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        <span class="w-1 h-1 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                        실시간
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center px-4 py-3 lg:py-4 bg-white border border-gray-100 shadow-inner rounded-2xl w-full sm:w-auto sm:min-w-[320px] focus-within:ring-2 focus-within:ring-primary-100 transition-all group">
                                <i class="fas fa-search text-gray-400 mr-3 text-sm group-focus-within:text-primary-500 transition-colors"></i>
                                <input type="text" id="courseSearch" oninput="filterCourses()" placeholder="과정명·강사명 검색 (상태 필터와 함께 사용)" class="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-700 placeholder:text-gray-300">
                            </div>
                        </div>
                    </div>

                    <!-- 테이블 섹션 -->
                    <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="min-w-full">
                                <thead>
                                    <tr class="bg-gray-50/50 border-b border-gray-100">
                                        <th class="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] w-[min(320px,30%)]">과정 정보</th>
                                        <th class="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">상태</th>
                                        <th class="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">강사명</th>
                                        <th class="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">등록 인원</th>
                                        <th class="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">현재까지 통계</th>
                                        <th class="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">출석률</th>
                                        <th class="px-8 py-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] whitespace-nowrap">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody" class="divide-y divide-gray-50">
                                    <!-- 로딩 스켈레톤 초기 표시 가능 -->
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- 페이지네이션 푸터 -->
                        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="order-2 sm:order-1 inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-[11px] font-bold text-gray-500">
                                총 <span id="total-count" class="mx-1.5 text-primary-600 font-extrabold">0</span>건 검색됨
                                <div class="mx-3 w-px h-3 bg-gray-200"></div>
                                표시 중 항목: <span id="current-range" class="ml-1.5 text-gray-900 font-extrabold text-xs tracking-tight">0-0</span>
                            </div>
                            <div class="order-1 sm:order-2 flex items-center p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm" id="paginationControls">
                                <!-- Pagination Buttons -->
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
            const statusEl = document.getElementById('courseStatusFilter');
            const courseStatus = statusEl ? statusEl.value : 'all';
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium"><i class="fas fa-circle-notch fa-spin mr-2"></i> 데이터 로딩 중...</td></tr>';

            try {
                const url = \`/api/hrd/attendance/summary?date=\${date}&page=\${currentPage}&limit=\${itemsPerPage}&search=\${encodeURIComponent(search)}&status=\${encodeURIComponent(courseStatus)}&stats=cumulative\`;
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
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-24 text-center"> <div class="flex flex-col items-center justify-center space-y-3"> <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"> <i class="fas fa-folder-open text-2xl"></i> </div> <p class="text-sm font-bold text-gray-400">조건에 맞는 과정이 없습니다.</p> <p class="text-[11px] text-gray-300">검색어, 날짜 또는 과정 상태를 확인해 주세요.</p> </div> </td></tr>';
                document.getElementById('total-count').textContent = '0';
                document.getElementById('current-range').textContent = '0-0';
                document.getElementById('paginationControls').innerHTML = '';
                return;
            }

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + pageData.length;

            document.getElementById('total-count').textContent = total;
            document.getElementById('current-range').textContent = \`\${startIndex + 1}-\\u2013\${endIndex}\`;

            function statusBadgeClass(s) {
                if (s === '모집중') return 'bg-sky-50 text-sky-600 ring-sky-100';
                if (s === '진행중') return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
                if (s === '상시모집') return 'bg-amber-50 text-amber-600 ring-amber-100';
                if (s === '마감' || s === '종료') return 'bg-slate-100 text-slate-600 ring-slate-200';
                return 'bg-gray-50 text-gray-600 ring-gray-100';
            }
            tbody.innerHTML = pageData.map(c => \`
                <tr class="hover:bg-primary-50/30 transition-all duration-300 group cursor-pointer" onclick="location.href='/admin/courses/\${c.id}/lms/attendance?type=\${c.type}'">
                    <td class="px-8 py-7 min-w-0 max-w-[320px] break-words align-top">
                        <div class="flex flex-col">
                            <div class="font-black text-gray-900 group-hover:text-primary-600 transition-colors text-sm lg:text-base mb-1.5 break-words">\${c.title}</div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="px-2 py-0.5 bg-gray-900 text-white text-[9px] font-black rounded-full uppercase tracking-widest whitespace-nowrap">\${c.type}</span>
                                <span class="text-[10px] text-gray-400 font-bold tracking-tight">\${c.type === 'hrd' ? '회차 ID' : '과정 ID'}: \${c.id}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-7 text-center whitespace-nowrap align-top">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-bold ring-1 \${statusBadgeClass(c.status_label || '')}">\${c.status_label || '-'}</span>
                    </td>
                    <td class="px-6 py-7 text-center whitespace-nowrap align-top">
                        <div class="inline-flex flex-col items-center">
                            <div class="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all mb-1.5">\${(c.teacher_name || '-').charAt(0)}</div>
                            <span class="text-xs text-gray-700 font-black">\${c.teacher_name || '-'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-7 text-center whitespace-nowrap align-top">
                         <span class="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 text-xs font-black rounded-lg border border-gray-100">\${c.total_students}명</span>
                    </td>
                    <td class="px-6 py-7 text-center whitespace-nowrap align-top">
                        <div class="flex items-center justify-center gap-1.5">
                            <div class="flex flex-col items-center px-3 py-2 bg-green-50 rounded-2xl min-w-[42px] border border-green-100/50">
                                <span class="text-[9px] font-black text-green-400 uppercase tracking-tighter mb-0.5">출석</span>
                                <span class="text-xs font-black text-green-700 font-mono">\${c.present}</span>
                            </div>
                            <div class="flex flex-col items-center px-3 py-2 bg-yellow-50 rounded-2xl min-w-[42px] border border-yellow-100/50">
                                <span class="text-[9px] font-black text-yellow-400 uppercase tracking-tighter mb-0.5">지각/조퇴</span>
                                <span class="text-xs font-black text-yellow-700 font-mono">\${c.late}</span>
                            </div>
                            <div class="flex flex-col items-center px-3 py-2 bg-red-50 rounded-2xl min-w-[42px] border border-red-100/50">
                                <span class="text-[9px] font-black text-red-400 uppercase tracking-tighter mb-0.5">결석</span>
                                <span class="text-xs font-black text-red-700 font-mono">\${c.absent}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-7 text-center whitespace-nowrap align-top">
                        <div class="flex flex-col items-center space-y-2">
                             <div class="text-[13px] font-black font-mono \${c.rate >= 90 ? 'text-green-600' : c.rate >= 70 ? 'text-primary-600' : 'text-red-500'}">\${c.rate}%</div>
                             <div class="w-16 lg:w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div class="h-full rounded-full \${c.rate >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' : c.rate >= 70 ? 'bg-gradient-to-r from-primary-400 to-primary-600' : 'bg-gradient-to-r from-red-400 to-red-600'}" style="width: \${c.rate}%"></div>
                             </div>
                        </div>
                    </td>
                    <td class="px-8 py-7 text-right whitespace-nowrap align-top">
                        <a href="/admin/courses/\${c.id}/lms/attendance?type=\${c.type}" class="inline-flex items-center px-5 py-2.5 bg-white border-2 border-gray-100 rounded-2xl text-[11px] font-black text-gray-700 hover:border-primary-500 hover:bg-primary-500 hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap">
                            출결 관리 <i class="fas fa-arrow-right-long ml-2 text-[10px]"></i>
                        </a>
                    </td>
                </tr>
            \`).join('');

            // 페이지네이션 컨트롤 렌더링
            let paginationHtml = '';
            
            // 이전 버튼
            paginationHtml += \`
                <button onclick="goToPage(\${Math.max(1, currentPage - 1)})" \${currentPage === 1 ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'} transition-all active:scale-90">
                    <i class="fas fa-chevron-left text-[11px]"></i>
                </button>
            \`;

            // 페이지 번호 (최대 5개 중심 노출 전략)
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

            for (let i = startPage; i <= endPage; i++) {
                paginationHtml += \`
                    <button onclick="goToPage(\${i})" class="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all \${currentPage === i ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}">
                        \${i}
                    </button>
                \`;
            }

            // 다음 버튼
            paginationHtml += \`
                <button onclick="goToPage(\${Math.min(totalPages, currentPage + 1)})" \${currentPage === totalPages ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'} transition-all active:scale-90">
                    <i class="fas fa-chevron-right text-[11px]"></i>
                </button>
            \`;

            document.getElementById('paginationControls').innerHTML = paginationHtml;
        }
    </script>
</body>
</html>
`;
