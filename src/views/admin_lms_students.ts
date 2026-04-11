import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsStudentsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 관리 - 학사관리</title>
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
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
</head>
<body class="bg-slate-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('students')}

                <!-- 메인: 인박스 벤토 그리드 -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 요약 카드 (Bento Grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm border-l-4 border-indigo-500">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">전체 수강생</span>
                    <i class="fas fa-user-graduate text-indigo-500 text-xl"></i>
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight" id="summaryTotal">0</div>
                <div class="text-xs font-bold text-slate-400 mt-1">명</div>
            </div>
            <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm border-l-4 border-emerald-500">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">수강중</span>
                    <i class="fas fa-user-check text-emerald-500 text-xl"></i>
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight" id="summaryApproved">0</div>
                <div class="text-xs font-bold text-slate-400 mt-1">명</div>
            </div>
            <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm border-l-4 border-amber-500">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">대기</span>
                    <i class="fas fa-clock text-amber-500 text-xl"></i>
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight" id="summaryPending">0</div>
                <div class="text-xs font-bold text-slate-400 mt-1">명</div>
            </div>
            <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm border-l-4 border-slate-400">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">수료/기타</span>
                    <i class="fas fa-graduation-cap text-slate-500 text-xl"></i>
                </div>
                <div class="text-3xl font-black text-slate-900 tracking-tight" id="summaryOther">0</div>
                <div class="text-xs font-bold text-slate-400 mt-1">명</div>
            </div>
        </div>

        <!-- 수강생 목록 (Bento In-box) -->
        <div class="bento-card bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
            <div class="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <i class="fas fa-users text-lg"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight">수강생 목록</h2>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">과정별 수강 신청 현황</p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <div class="relative w-full sm:w-72">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input type="text" id="studentSearch" placeholder="이름 또는 이메일 검색..." 
                               class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all text-sm font-medium">
                    </div>
                    <span id="searchResultTextLms" class="text-sm text-slate-500"></span>
                    <label class="flex items-center gap-1.5 text-sm text-slate-500">
                        <span>페이지당</span>
                        <select id="rowsPerPageLms" onchange="window.__lmsSetRowsPerPage(parseInt(this.value,10))" class="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500">
                            <option value="10">10</option>
                            <option value="20" selected>20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select>
                        <span>건</span>
                    </label>
                </div>
            </div>
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/80 border-b border-slate-100">
                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">수강생 정보</th>
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">연락처</th>
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">상태</th>
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">등록일</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody" class="divide-y divide-slate-50">
                        <tr>
                            <td colspan="4" class="px-8 py-20 text-center text-slate-400">
                                <i class="fas fa-spinner fa-spin text-2xl mb-4 block"></i>
                                <span class="text-sm font-bold uppercase tracking-widest">수강생 목록을 불러오는 중...</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-8 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div id="paginationRangeLms" class="text-sm text-slate-600"></div>
                <nav id="paginationContainer" class="flex flex-wrap items-center justify-center gap-1"></nav>
            </div>
        </div>
    </div>

    <script>
        (function() {
            const pathParts = window.location.pathname.split('/');
            const courseIdIndex = pathParts.indexOf('courses') + 1;
            const courseId = new URLSearchParams(window.location.search).get('session_id') || pathParts[courseIdIndex];
            let allStudents = [];
            let currentPage = 1;
            let limit = 20;

            function getToken() { return localStorage.getItem('token'); }
            function setRowsPerPageLms(n) {
                limit = n;
                document.getElementById('rowsPerPageLms').value = String(n);
                loadStudents(1);
            }

            function getUrlTypeHrd() {
                try {
                    return (new URLSearchParams(window.location.search)).get('type') === 'hrd';
                } catch (_) { return false; }
            }

            async function loadStudents(page = 1) {
                if (!courseId) return;
                currentPage = page;
                document.getElementById('searchResultTextLms').textContent = '';
                document.getElementById('paginationRangeLms').textContent = '';
                const tbody = document.getElementById('studentsTableBody');
                tbody.innerHTML = '<tr><td colspan="4" class="px-8 py-12 text-center text-slate-400"><i class="fas fa-spinner fa-spin text-2xl mb-4 block"></i>불러오는 중...</td></tr>';
                try {
                    const search = document.getElementById('studentSearch').value.trim();
                    let url = '/api/enrollments?course_id=' + courseId + '&page=' + page + '&limit=' + limit;
                    if (getUrlTypeHrd()) url += '&type=hrd';
                    if (search) url += '&search=' + encodeURIComponent(search);
                    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + getToken() } });
                    const result = await res.json();
                    if (!result.success) {
                        tbody.innerHTML = '<tr><td colspan="4" class="px-8 py-12 text-center text-red-500">목록을 불러올 수 없습니다.</td></tr>';
                        return;
                    }
                    allStudents = result.data || [];
                    const p = result.pagination || {};
                    const total = p.total != null ? p.total : 0;
                    const totalPages = p.totalPages != null ? p.totalPages : 1;
                    const pageNum = p.page != null ? p.page : page;
                    if (p.limit) {
                        limit = p.limit;
                        const sel = document.getElementById('rowsPerPageLms');
                        if (sel) sel.value = String(p.limit);
                    }
                    document.getElementById('searchResultTextLms').textContent = '검색결과 ' + total + '건';
                    updateSummary(allStudents, result.pagination || {});
                    renderTable(allStudents);
                    const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || limit) + 1;
                    const end = Math.min(pageNum * (p.limit || limit), total);
                    document.getElementById('paginationRangeLms').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';
                    renderPagination(totalPages, pageNum);
                } catch (e) {
                    console.error(e);
                    tbody.innerHTML = '<tr><td colspan="4" class="px-8 py-12 text-center text-red-500">오류가 발생했습니다.</td></tr>';
                }
            }

            function updateSummary(list, pagination) {
                const total = (pagination && pagination.total != null) ? pagination.total : list.length;
                const approved = list.filter(s => (s.status || '').toLowerCase() === 'approved').length;
                const pending = list.filter(s => (s.status || '').toLowerCase() === 'pending').length;
                const other = list.length - approved - pending;
                document.getElementById('summaryTotal').textContent = total;
                document.getElementById('summaryApproved').textContent = approved;
                document.getElementById('summaryPending').textContent = pending;
                document.getElementById('summaryOther').textContent = other;
            }

            function renderTable(students) {
                const tbody = document.getElementById('studentsTableBody');
                const searchTerm = (document.getElementById('studentSearch').value || '').toLowerCase();
                const filtered = searchTerm
                    ? students.filter(s =>
                        (s.user_name && s.user_name.toLowerCase().includes(searchTerm)) ||
                        (s.user_email && s.user_email.toLowerCase().includes(searchTerm))
                    )
                    : students;
                if (filtered.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">조회된 수강생이 없습니다.</td></tr>';
                    return;
                }
                tbody.innerHTML = filtered.map(s => {
                    const statusClass = (s.status || '').toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (s.status || '').toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100';
                    const statusText = (s.status || '').toLowerCase() === 'approved' ? '수강중' : (s.status || '').toLowerCase() === 'pending' ? '대기' : (s.status || '');
                    const date = s.enrolled_at ? s.enrolled_at.split('T')[0] : '-';
                    const studentId = s.user_id || s.student_id; // ensure we get the ID
                    const isAdmin = window.location.pathname.startsWith('/admin');
                    const href = isAdmin
                        ? '/admin/students/' + studentId + '/journey'
                        : '/teacher/courses/' + courseId + '/lms/students/' + studentId + '/consultation?type=hrd';
                    return '<tr class="group hover:bg-slate-50/80 transition-all duration-300 cursor-pointer" data-href="' + href + '">' +
                        '<td class="px-8 py-6">' +
                            '<div class="flex items-center gap-4">' +
                                '<div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">' + ((s.user_name || 'S')[0]) + '</div>' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-sm font-black text-slate-900 tracking-tight">' + (s.user_name || '-') + '</span>' +
                                    '<span class="text-[10px] font-bold text-slate-400">' + (s.user_email || '-') + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</td>' +
                        '<td class="px-6 py-6 font-mono text-xs font-bold text-slate-500">' + (s.user_phone || '-') + '</td>' +
                        '<td class="px-6 py-6 text-center">' +
                            '<span class="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ' + statusClass + '">' + statusText + '</span>' +
                        '</td>' +
                        '<td class="px-6 py-6 text-xs font-bold text-slate-400 tracking-widest uppercase">' + date + '</td>' +
                    '</tr>';
                }).join('');
            }

            function renderPagination(totalPages, pageNum) {
                const container = document.getElementById('paginationContainer');
                if (!totalPages || totalPages <= 1) {
                    container.innerHTML = '';
                    return;
                }
                const current = pageNum != null ? pageNum : currentPage;
                const radius = 2;
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= current - radius && i <= current + radius)) pages.push(i);
                    else if (pages[pages.length - 1] !== '...') pages.push('...');
                }
                let html = '';
                html += '<button type="button" onclick="window.__lmsStudentsPage(' + (current - 1) + ')" ' + (current <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium ' + (current <= 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
                pages.forEach(function(n) {
                    if (n === '...') html += '<span class="px-2 py-2 text-slate-400">…</span>';
                    else {
                        const active = n === current;
                        html += '<button type="button" onclick="window.__lmsStudentsPage(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50') + '">' + n + '</button>';
                    }
                });
                html += '<button type="button" onclick="window.__lmsStudentsPage(' + (current + 1) + ')" ' + (current >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium ' + (current >= totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
                container.innerHTML = html;
            }

            window.__lmsStudentsPage = function(page) { loadStudents(page); };
            window.__lmsSetRowsPerPage = function(n) { setRowsPerPageLms(n); };

            document.getElementById('studentsTableBody').addEventListener('click', function(e) {
                const row = e.target.closest('tr[data-href]');
                if (row) location.href = row.getAttribute('data-href');
            });

            document.getElementById('studentSearch').addEventListener('keyup', function(e) {
                if (e.key === 'Enter') loadStudents(1);
            });

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() { loadStudents(1); });
            } else {
                loadStudents(1);
            }
        })();
    </script>
            </div>
        </div>
    </div>
</body>
</html>
 `;
