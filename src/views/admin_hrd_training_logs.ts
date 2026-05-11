
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdTrainingLogsHtml = (sidebar = hrdSidebar('training-logs')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 훈련일지 현황 - 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
                    <div class="flex flex-wrap justify-between items-start sm:items-center gap-3">
                        <div class="min-w-0">
                            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight break-words">통합 훈련일지 현황</h1>
                            <p class="text-gray-500 mt-1 text-sm break-words">모든 교육 과정의 훈련일지 작성 및 NCS 이수 현황을 관리합니다.</p>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                            <button onclick="loadLogSummary()" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm" title="새로고침">
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
                                <i class="fas fa-book-open text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">작성된 전체 일지</div>
                                <div class="text-2xl font-black text-gray-800" id="stat-total-logs">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-history text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">배정 훈련시간</div>
                                <div class="text-2xl font-black text-gray-800" id="stat-month-hours">0h</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mr-4 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-exclamation-circle text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">미작성 과정</div>
                                <div class="text-2xl font-black text-gray-800 text-rose-600" id="stat-pending-courses">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mr-4 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-chart-line text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">평균 이수율</div>
                                <div class="text-2xl font-black text-gray-800"><span id="stat-avg-ncs">0</span>%</div>
                            </div>
                        </div>
                    </div>

                    <!-- 필터 및 검색 -->
                    <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div class="flex flex-wrap items-center gap-2 lg:gap-3">
                                <div class="relative min-w-[130px] shrink-0">
                                    <input type="month" id="targetMonth" onchange="loadLogSummary()" class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-gray-700 shadow-inner">
                                    <i class="fas fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-xs"></i>
                                </div>
                                <select id="courseStatusFilter" onchange="loadLogSummary()" class="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner whitespace-nowrap shrink-0" title="과정 상태">
                                    <option value="all">전체 과정</option>
                                    <option value="recruiting">모집중</option>
                                    <option value="in_progress">진행중</option>
                                    <option value="completed">마감</option>
                                    <option value="closed">종료</option>
                                </select>
                                <select id="statusFilter" onchange="filterCourses()" class="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner whitespace-nowrap shrink-0">
                                    <option value="all">전체 현황</option>
                                    <option value="pending">미작성만</option>
                                    <option value="active">작성완료</option>
                                </select>
                                <select id="sortBy" onchange="filterCourses()" class="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner whitespace-nowrap shrink-0">
                                    <option value="latest" selected>최신순</option>
                                    <option value="title">과정명순</option>
                                    <option value="logs">일지많은순</option>
                                    <option value="ncs">이수율높은순</option>
                                </select>
                            </div>
                            <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 w-full lg:min-w-[240px] lg:max-w-[320px] shadow-inner group focus-within:ring-2 focus-within:ring-indigo-500 transition-all border border-transparent shrink-0">
                                <i class="fas fa-search text-gray-400 mr-2 text-sm group-focus-within:text-indigo-500"></i>
                                <input type="text" id="courseSearch" oninput="filterCourses()" placeholder="과정명·강사명 검색" class="bg-transparent border-none outline-none text-sm w-full font-medium min-w-0">
                            </div>
                        </div>
                    </div>

                    <!-- 과정별 일지 리스트 테이블 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50/50">
                                    <tr>
                                        <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[min(320px,30%)]">과정 정보</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">상태</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">담당 강사</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">작성된 전체 일지</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">배정 훈련시간</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">최근 작성일</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">NCS 이수율</th>
                                        <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody" class="bg-white divide-y divide-gray-50">
                                    <!-- 데이터 로드됨 -->
                                </tbody>
                            </table>
                        </div>
                        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="order-2 sm:order-1 inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-[11px] font-bold text-gray-500">
                                총 <span id="total-count" class="mx-1.5 text-indigo-600 font-extrabold">0</span>건
                                <div class="mx-3 w-px h-3 bg-gray-200"></div>
                                표시: <span id="current-range" class="ml-1.5 text-gray-900 font-extrabold text-xs">0-0</span>
                            </div>
                            <div class="order-1 sm:order-2 flex items-center p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm" id="paginationControls"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let courseSummaryData = [];
        let filteredData = [];
        let currentPage = 1;
        const itemsPerPage = 10;
        const token = localStorage.getItem('token');

        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mmValue = String(today.getMonth() + 1).padStart(2, '0');
            const targetMonthInput = document.getElementById('targetMonth');
            if (targetMonthInput) {
                targetMonthInput.value = \`\${yyyy}-\${mmValue}\`;
            }
            loadLogSummary();
        });

        async function loadLogSummary() {
            const monthInput = document.getElementById('targetMonth');
            if (!monthInput) return;
            const month = monthInput.value;
            const tbody = document.getElementById('summaryTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-20 text-center text-gray-400 font-medium"><i class="fas fa-circle-notch fa-spin mr-2"></i> 데이터 로딩 중...</td></tr>';
            }

            const courseStatusEl = document.getElementById('courseStatusFilter');
            const courseStatus = courseStatusEl ? courseStatusEl.value : 'all';
            try {
                const response = await fetch('/api/hrd/training-logs/summary?month=' + encodeURIComponent(month) + '&status=' + encodeURIComponent(courseStatus), {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    courseSummaryData = result.data || [];
                    updateStats();
                    filterCourses();
                } else {
                    if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-20 text-center text-red-500">데이터 로드 실패: ' + result.error + '</td></tr>';
                }
            } catch (e) {
                console.error(e);
                if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-20 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function updateStats() {
            const data = courseSummaryData || [];
            const totalLogs = data.reduce((acc, c) => acc + (c.log_count || 0), 0);
            const totalHours = data.reduce((acc, c) => acc + (c.total_hours || 0), 0);
            const pending = data.filter(c => (c.log_count || 0) === 0).length;
            const avgNcs = data.length > 0 ? Math.round(data.reduce((acc, c) => acc + (c.ncs_rate || 0), 0) / data.length) : 0;

            const elTotalLogs = document.getElementById('stat-total-logs');
            const elMonthHours = document.getElementById('stat-month-hours');
            const elPending = document.getElementById('stat-pending-courses');
            const elAvgNcs = document.getElementById('stat-avg-ncs');

            if (elTotalLogs) elTotalLogs.textContent = totalLogs;
            if (elMonthHours) elMonthHours.innerHTML = \`\${totalHours}<span class="text-sm ml-0.5">h</span>\`;
            if (elPending) elPending.textContent = pending;
            if (elAvgNcs) elAvgNcs.textContent = avgNcs;
        }

        function filterCourses() {
            const searchInput = document.getElementById('courseSearch');
            const statusFilterInput = document.getElementById('statusFilter');
            const sortByInput = document.getElementById('sortBy');
            
            if (!searchInput || !statusFilterInput || !sortByInput) return;

            const search = searchInput.value.toLowerCase();
            const statusFilter = statusFilterInput.value;
            const sortBy = sortByInput.value || 'latest';

            let filtered = (courseSummaryData || []).filter(c => 
                (c.title.toLowerCase().includes(search) || (c.teacher_name && c.teacher_name.toLowerCase().includes(search)))
            );

            if (statusFilter === 'pending') {
                filtered = filtered.filter(c => (c.log_count || 0) === 0);
            } else if (statusFilter === 'active') {
                filtered = filtered.filter(c => (c.log_count || 0) > 0);
            }

            // Sorting
            filtered.sort((a, b) => {
                if (sortBy === 'latest') return (b.id ?? 0) - (a.id ?? 0);
                if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
                if (sortBy === 'logs') return (b.log_count || 0) - (a.log_count || 0);
                if (sortBy === 'ncs') return (b.ncs_rate || 0) - (a.ncs_rate || 0);
                return 0;
            });

            filteredData = filtered;
            currentPage = 1;
            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            const pageData = filtered.slice(0, itemsPerPage);
            renderSummaryTable(pageData, { total, page: 1, limit: itemsPerPage, totalPages });
        }

        function goToPage(page) {
            currentPage = page;
            const start = (page - 1) * itemsPerPage;
            const pageData = filteredData.slice(start, start + itemsPerPage);
            const total = filteredData.length;
            const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            renderSummaryTable(pageData, { total, page, limit: itemsPerPage, totalPages });
        }

        function renderSummaryTable(data, pagination) {
            const tbody = document.getElementById('summaryTableBody');
            if (!tbody) return;
            const totalCountEl = document.getElementById('total-count');
            const currentRangeEl = document.getElementById('current-range');
            const controlsEl = document.getElementById('paginationControls');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-20 text-center text-gray-400">조건에 맞는 과정이 없습니다.</td></tr>';
                if (totalCountEl) totalCountEl.textContent = '0';
                if (currentRangeEl) currentRangeEl.textContent = '0-0';
                if (controlsEl) controlsEl.innerHTML = '';
                return;
            }
            const { total, page, limit, totalPages } = pagination || {};
            const startIndex = total && page ? (page - 1) * limit : 0;
            const endIndex = startIndex + data.length;
            if (totalCountEl) totalCountEl.textContent = (total ?? data.length).toLocaleString();
            if (currentRangeEl) currentRangeEl.textContent = total != null ? \`\${startIndex + 1}-\${endIndex}\` : \`1-\${data.length}\`;

            function statusBadgeClass(s) {
                if (s === '모집중') return 'bg-sky-50 text-sky-600 ring-sky-100';
                if (s === '진행중') return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
                if (s === '상시모집') return 'bg-amber-50 text-amber-600 ring-amber-100';
                if (s === '마감' || s === '종료') return 'bg-slate-100 text-slate-600 ring-slate-200';
                return 'bg-gray-50 text-gray-600 ring-gray-100';
            }
            tbody.innerHTML = data.map(c => \`
                <tr class="hover:bg-indigo-50/30 transition-colors group border-b border-gray-50 last:border-0">
                    <td class="px-6 py-5 min-w-0 max-w-[320px] break-words align-top">
                        <div class="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors break-words">\${c.title}</div>
                        <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">회차 ID: \${c.id}</div>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-bold ring-1 \${statusBadgeClass(c.status_label || '')}">\${c.status_label || '-'}</span>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <div class="flex items-center justify-center">
                            <span class="text-sm text-gray-700 font-bold">\${c.teacher_name || '강사미지정'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="px-3 py-1 rounded-full \${c.log_count > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'} text-xs font-bold ring-1 \${c.log_count > 0 ? 'ring-indigo-100' : 'ring-rose-100'}">
                            \${c.log_count || 0}건
                        </span>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-black text-slate-700 whitespace-nowrap align-top">
                        \${c.total_hours || 0}h
                    </td>
                    <td class="px-6 py-5 text-center text-xs text-slate-500 font-medium whitespace-nowrap align-top">
                        \${c.last_log_date || '<span class="text-slate-300">기록없음</span>'}
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <div class="flex flex-col items-center">
                            <div class="text-sm font-black \${c.ncs_rate >= 90 ? 'text-emerald-600' : c.ncs_rate >= 50 ? 'text-indigo-600' : 'text-amber-500'}">\${c.ncs_rate || 0}%</div>
                            <div class="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                                <div class="h-full \${c.ncs_rate >= 90 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}" style="width: \${c.ncs_rate || 0}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-right whitespace-nowrap align-top">
                        <a href="/admin/courses/\${c.id}/lms/training-logs" class="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm hover:shadow-md active:scale-95 transform whitespace-nowrap">
                            일지 관리 <i class="fas fa-arrow-right ml-2 text-[10px]"></i>
                        </a>
                    </td>
                </tr>
            \`).join('');
            if (controlsEl && total != null && totalPages > 1) {
                let html = \`<button onclick="goToPage(\${Math.max(1, currentPage - 1)})" \${currentPage === 1 ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'}"><i class="fas fa-chevron-left text-[11px]"></i></button>\`;
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + 4);
                if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                for (let i = startPage; i <= endPage; i++) {
                    html += \`<button onclick="goToPage(\${i})" class="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black \${currentPage === i ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}">\${i}</button>\`;
                }
                html += \`<button onclick="goToPage(\${Math.min(totalPages, currentPage + 1)})" \${currentPage === totalPages ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'}"><i class="fas fa-chevron-right text-[11px]"></i></button>\`;
                controlsEl.innerHTML = html;
            } else if (controlsEl) controlsEl.innerHTML = '';
        }
    </script>
</body>
</html>
`;
