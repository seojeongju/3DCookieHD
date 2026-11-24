import { lmsHeaderHtml } from './components/lms_header';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsStudentsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 관리 - 학사관리</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
</head>
<body class="bg-slate-50 overflow-hidden">
    <div class="${LMS_SHELL_ROOT_CLASS}">
        ${sidebar}
        
        <div class="${LMS_SHELL_COLUMN_CLASS}">
            ${lmsFixedHeaderBlock(lmsHeaderHtml('students'))}
            ${lmsScrollMainOpen()}

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
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">NCS 평가 대리입력</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody" class="divide-y divide-slate-50">
                        <tr>
                            <td colspan="5" class="px-8 py-20 text-center text-slate-400">
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
                    const _sidParam = new URLSearchParams(window.location.search).get('session_id');
                    let url = '/api/enrollments?course_id=' + courseId + '&page=' + page + '&limit=' + limit;
                    if (getUrlTypeHrd()) url += '&type=hrd';
                    if (_sidParam) url += '&session_id=' + encodeURIComponent(_sidParam);
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
                        '<td class="px-6 py-6 text-center" onclick="event.stopPropagation()">' +
                            '<button type="button" onclick="window.__openStudentNcsProxy(' + studentId + ', ' + JSON.stringify(s.user_name || '수강생').replace(/"/g, '&quot;') + ')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-black hover:bg-sky-600 hover:text-white transition">' +
                                '<i class="fas fa-file-circle-plus"></i> 답안·파일 대리입력' +
                            '</button>' +
                        '</td>' +
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
                if (e.target.closest('button, a')) return;
                const row = e.target.closest('tr[data-href]');
                if (row) location.href = row.getAttribute('data-href');
            });

            // NCS 평가 답안·첨부파일 강사 대리입력 모달
            let proxyPlansCache = null;
            let activeProxyStudent = { id: null, name: '' };

            async function ensureProxyPlans() {
                if (proxyPlansCache) return proxyPlansCache;
                const _sid = new URLSearchParams(window.location.search).get('session_id') || '';
                const all = [];
                for (const r of [1, 2, 3]) {
                    try {
                        const res = await fetch('/api/ncs/plans?courseId=' + encodeURIComponent(courseId) + '&evaluation_round=' + r + (_sid ? '&session_id=' + encodeURIComponent(_sid) : ''), {
                            headers: { 'Authorization': 'Bearer ' + getToken() }
                        });
                        const j = await res.json();
                        (Array.isArray(j?.data) ? j.data : []).forEach(p => all.push({ ...p, __round: r }));
                    } catch (_) {}
                }
                proxyPlansCache = all;
                return all;
            }

            window.__openStudentNcsProxy = async function(studentId, studentName) {
                activeProxyStudent = { id: Number(studentId), name: studentName || '수강생' };
                const modal = document.getElementById('studentNcsProxyModal');
                const nameEl = document.getElementById('ncsProxyStudentName');
                const planSel = document.getElementById('ncsProxyPlanSelect');
                if (!modal || !planSel) return;
                if (nameEl) nameEl.textContent = activeProxyStudent.name;
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                planSel.innerHTML = '<option value="">평가 계획을 불러오는 중...</option>';
                const plans = await ensureProxyPlans();
                if (!plans.length) {
                    planSel.innerHTML = '<option value="">등록된 NCS 본평가 계획이 없습니다</option>';
                    document.getElementById('ncsProxyExistingBox').innerHTML = '<p class="text-xs text-slate-400">먼저 NCS평가(본평가)관리 > 평가계획에서 계획을 저장해 주세요.</p>';
                    return;
                }
                planSel.innerHTML = plans.map(p => {
                    const label = '[' + p.__round + '차] ' + (p.subject_name || p.unit_name || '교과목') + (p.planned_date ? ' (' + p.planned_date + ')' : '');
                    return '<option value="' + p.id + '">' + label + '</option>';
                }).join('');
                await window.__onNcsProxyPlanChange(planSel.value);
            };

            window.__closeStudentNcsProxy = function() {
                const modal = document.getElementById('studentNcsProxyModal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            };

            let activeProxyQuestions = [];
            let extraModalQuestionCount = 0;

            function escHtml(v) {
                return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }

            function stripHtmlToPlain(html) {
                var clean = String(html || '')
                    .replace(/<!--qimg-->[\\s\\S]*?<!--\\/qimg-->/gi, '')
                    .replace(/<!--\\/?qimg-->/gi, '')
                    .replace(/<!--\\/?qbody-->/gi, '');
                const tmp = document.createElement('div');
                tmp.innerHTML = clean;
                return (tmp.textContent || tmp.innerText || '').replace(/\\s+/g, ' ').trim();
            }

            function formatModalNumberedComment(comment) {
                const raw = String(comment || '').trim();
                if (!raw) return '';
                const lines = raw.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
                const hasNumbered = lines.some(l => /^\\d+\\s*[\\.\\)\\ 번:]/.test(l));
                if (!hasNumbered && lines.length <= 1) {
                    return '<div class="text-slate-700 mt-1 whitespace-pre-wrap bg-white p-2 rounded border border-slate-100">' + escHtml(raw) + '</div>';
                }
                return '<div class="space-y-1 mt-1">' + lines.map(line => {
                    const m = line.match(/^(\\d+)\\s*(?:[\\.\\)\\:]|번\\s*:?)\\s*(.*)$/);
                    if (m) {
                        return '<div class="flex items-start gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1">' +
                            '<span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded bg-indigo-600 text-white text-[10px] font-black shrink-0">' + escHtml(m[1]) + '</span>' +
                            '<span class="text-slate-800 font-medium break-all whitespace-pre-wrap">' + escHtml(m[2] || '-') + '</span>' +
                        '</div>';
                    }
                    return '<div class="text-xs text-slate-600 bg-white rounded px-2 py-1 whitespace-pre-wrap">' + escHtml(line) + '</div>';
                }).join('') + '</div>';
            }

            function parseModalNumberedAnswers(comment) {
                const map = {};
                const extra = [];
                String(comment || '').split(/\\r?\\n/).forEach(line => {
                    const t = line.trim();
                    if (!t) return;
                    const m = t.match(/^(\\d+)\\s*(?:[\\.\\)\\:]|번\\s*:?)\\s*(.*)$/);
                    if (m) map[Number(m[1])] = m[2] || '';
                    else if (t.startsWith('[비고]')) extra.push(t.replace(/^\\[비고\\]\\s*/, ''));
                    else extra.push(t);
                });
                return { map, extra: extra.join('\\n') };
            }

            function renderModalQuestionInputs(prefillComment) {
                const box = document.getElementById('ncsProxyNumberedBox');
                const label = document.getElementById('ncsProxyQCountLabel');
                const memoEl = document.getElementById('ncsProxyAnswer');
                if (!box) return;
                const qRows = Array.isArray(activeProxyQuestions) ? activeProxyQuestions : [];
                const baseCount = qRows.length > 0 ? qRows.length : 1;
                const totalCount = baseCount + extraModalQuestionCount;
                if (label) label.textContent = qRows.length > 0 ? ('등록된 평가문항 ' + qRows.length + '개 기준') : ('총 ' + totalCount + '개 문항 입력란');
                const parsed = parseModalNumberedAnswers(prefillComment || '');
                if (memoEl && prefillComment != null) memoEl.value = parsed.extra || '';

                let html = '';
                for (let i = 0; i < totalCount; i++) {
                    const q = qRows[i] || null;
                    const qNo = q && q.no ? Number(q.no) : (i + 1);
                    const qText = q ? stripHtmlToPlain(q.text) : '';
                    const cleanPrompt = qText.replace(new RegExp('^' + qNo + '\\s*[\\.\\)]\\s*'), '');
                    const val = parsed.map[qNo] != null ? parsed.map[qNo] : '';
                    html += '<div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3">' +
                        '<div class="flex items-start gap-2.5">' +
                            '<span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black shrink-0 mt-0.5">' + qNo + '</span>' +
                            '<div class="flex-1 min-w-0 space-y-1.5">' +
                                (cleanPrompt
                                    ? '<p class="text-xs font-bold text-slate-800 break-keep">' + escHtml(cleanPrompt) + '</p>'
                                    : '<p class="text-xs font-bold text-slate-600">' + qNo + '번 문항 정답 / 답안</p>') +
                                '<input type="text" data-modal-qno="' + qNo + '" value="' + escHtml(val) + '" placeholder="' + qNo + '번 문항 정답 또는 답안을 입력하세요" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" />' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                }
                box.innerHTML = html;
            }

            window.__addModalProxyQuestion = function() {
                const cur = collectModalFormattedAnswers();
                extraModalQuestionCount += 1;
                renderModalQuestionInputs(cur);
            };

            function collectModalFormattedAnswers() {
                const inputs = Array.from(document.querySelectorAll('#ncsProxyNumberedBox input[data-modal-qno]'));
                const lines = [];
                let anyNum = false;
                inputs.forEach(inp => {
                    const no = inp.getAttribute('data-modal-qno');
                    const v = String(inp.value || '').trim();
                    if (v !== '') anyNum = true;
                    lines.push(no + '. ' + v);
                });
                const memo = (document.getElementById('ncsProxyAnswer')?.value || '').trim();
                const out = [];
                if (anyNum) out.push(...lines);
                if (memo) out.push(anyNum ? ('[비고] ' + memo) : memo);
                return out.join('\\n').trim();
            }

            window.__onNcsProxyPlanChange = async function(planId) {
                const box = document.getElementById('ncsProxyExistingBox');
                const titleInput = document.getElementById('ncsProxyTitle');
                const plans = proxyPlansCache || [];
                const plan = plans.find(p => String(p.id) === String(planId));
                if (titleInput && plan) {
                    titleInput.value = (plan.subject_name || plan.unit_name || '본평가') + ' - ' + activeProxyStudent.name + ' (강사 대리입력)';
                }
                if (!box || !planId || !activeProxyStudent.id) return;
                box.innerHTML = '<p class="text-xs text-slate-400">제출 내역 및 문항 조회 중...</p>';
                try {
                    const _sid = new URLSearchParams(window.location.search).get('session_id') || '';
                    const [evRes, evalRes] = await Promise.all([
                        fetch('/api/ncs/evidence?planId=' + encodeURIComponent(planId) + '&studentId=' + encodeURIComponent(activeProxyStudent.id), {
                            headers: { 'Authorization': 'Bearer ' + getToken() }
                        }),
                        fetch('/api/ncs/evaluations/' + encodeURIComponent(planId) + (_sid ? '?session_id=' + encodeURIComponent(_sid) : ''), {
                            headers: { 'Authorization': 'Bearer ' + getToken() }
                        })
                    ]);
                    const j = await evRes.json();
                    const evalJ = await evalRes.json();
                    activeProxyQuestions = Array.isArray(evalJ?.exam_spec?.questions?.rows) ? evalJ.exam_spec.questions.rows : [];
                    extraModalQuestionCount = 0;
                    const list = Array.isArray(j?.data) ? j.data : [];
                    const latestWithComment = list.find(ev => ev && String(ev.comment || '').trim() !== '');
                    renderModalQuestionInputs(latestWithComment ? latestWithComment.comment : '');
                    if (!list.length) {
                        box.innerHTML = '<p class="text-xs text-slate-400">아직 제출된 답안이나 첨부파일이 없습니다.</p>';
                        return;
                    }
                    box.innerHTML = '<div class="space-y-1.5">' + list.map(ev => {
                        const hasUrl = ev.file_url && String(ev.file_url).trim() !== '';
                        return '<div class="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs flex items-start justify-between gap-2">' +
                            '<div class="min-w-0 flex-1">' +
                                (hasUrl
                                    ? '<a href="' + escHtml(ev.file_url) + '" target="_blank" rel="noopener" class="font-bold text-sky-700 hover:underline break-all"><i class="fas fa-paperclip mr-1"></i>' + escHtml(ev.file_name || '제출파일') + '</a>'
                                    : '<span class="font-bold text-indigo-700"><i class="fas fa-pen-nib mr-1"></i>' + escHtml(ev.file_name || '답안 입력') + '</span>') +
                                (ev.comment ? formatModalNumberedComment(ev.comment) : '') +
                            '</div>' +
                            '<button type="button" onclick="window.__deleteNcsProxyEvidence(' + ev.id + ')" class="text-slate-400 hover:text-rose-500 px-1" title="삭제"><i class="fas fa-trash-can"></i></button>' +
                        '</div>';
                    }).join('') + '</div>';
                } catch (_) {
                    box.innerHTML = '<p class="text-xs text-rose-500">제출 내역을 불러오지 못했습니다.</p>';
                }
            };

            window.__deleteNcsProxyEvidence = async function(evId) {
                if (!confirm('이 제출물/답안을 삭제하시겠습니까?')) return;
                try {
                    const res = await fetch('/api/ncs/evidence/' + evId, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + getToken() }
                    });
                    const j = await res.json();
                    if (j?.success) {
                        await window.__onNcsProxyPlanChange(document.getElementById('ncsProxyPlanSelect').value);
                    } else {
                        alert(j?.error || '삭제 실패');
                    }
                } catch (_) {
                    alert('삭제 중 오류가 발생했습니다.');
                }
            };

            window.__submitStudentNcsProxy = async function() {
                const planId = document.getElementById('ncsProxyPlanSelect')?.value;
                if (!planId || !activeProxyStudent.id) { alert('평가 계획을 선택하세요.'); return; }
                const title = (document.getElementById('ncsProxyTitle')?.value || '').trim() || '강사 대리입력';
                const url = (document.getElementById('ncsProxyUrl')?.value || '').trim();
                const answer = collectModalFormattedAnswers();
                const fi = document.getElementById('ncsProxyFiles');
                const files = fi && fi.files ? Array.from(fi.files) : [];
                if (!files.length && !url && !answer) {
                    alert('문항별 정답/답안 내용을 입력하거나 파일 또는 링크를 첨부해 주세요.');
                    return;
                }
                const btn = document.getElementById('ncsProxySaveBtn');
                if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }
                try {
                    const items = [];
                    for (const f of files) {
                        const fd = new FormData();
                        fd.append('file', f);
                        fd.append('category', 'evidence');
                        fd.append('folder', 'ncs-evidence/' + planId);
                        const upRes = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + getToken() },
                            body: fd
                        });
                        const upJson = await upRes.json();
                        if (!upJson?.success || !upJson?.data?.url) throw new Error(upJson?.error || (f.name + ' 업로드 실패'));
                        const fType = String(f.type || '').startsWith('image/') ? 'image' : 'document';
                        items.push({ name: title + ' · ' + (upJson.data.originalName || f.name), url: upJson.data.url, type: fType });
                    }
                    if (url) items.push({ name: title, url, type: 'link' });
                    if (!items.length && answer) items.push({ name: title, url: '', type: 'answer' });

                    for (const it of items) {
                        const res = await fetch('/api/ncs/evidence', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + getToken()
                            },
                            body: JSON.stringify({
                                plan_id: Number(planId),
                                student_id: activeProxyStudent.id,
                                file_name: it.name,
                                file_url: it.url,
                                file_type: it.type,
                                comment: answer
                            })
                        });
                        const j = await res.json();
                        if (!j?.success) throw new Error(j?.error || '저장 실패');
                    }
                    document.getElementById('ncsProxyUrl').value = '';
                    document.getElementById('ncsProxyAnswer').value = '';
                    if (fi) fi.value = '';
                    alert('수강생 답안/첨부파일이 등록되었습니다.');
                    await window.__onNcsProxyPlanChange(planId);
                } catch (e) {
                    alert(e.message || '저장 중 오류가 발생했습니다.');
                } finally {
                    if (btn) { btn.disabled = false; btn.textContent = '대리 답안 · 파일 저장'; }
                }
            };

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

    <!-- 수강생 관리: 강사 대리 NCS 답안·파일 입력 모달 -->
    <div id="studentNcsProxyModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-sky-600">NCS 본평가 강사 대리 입력</span>
                    <h3 class="text-lg font-black text-slate-900 mt-0.5"><span id="ncsProxyStudentName">수강생</span> · 답안 및 첨부파일 등록</h3>
                </div>
                <button type="button" onclick="window.__closeStudentNcsProxy()" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                    <label class="block text-xs font-black text-slate-700 mb-1">1. 평가 교과목(계획) 선택</label>
                    <select id="ncsProxyPlanSelect" onchange="window.__onNcsProxyPlanChange(this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white"></select>
                </div>
                <div>
                    <label class="block text-xs font-black text-slate-700 mb-1">기존 제출 내역</label>
                    <div id="ncsProxyExistingBox" class="rounded-xl border border-slate-200 p-3 bg-white max-h-40 overflow-y-auto"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">제출 제목</label>
                        <input id="ncsProxyTitle" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">외부 링크 (선택)</label>
                        <input id="ncsProxyUrl" type="url" placeholder="https://..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                </div>
                <div>
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <label class="block text-xs font-bold text-slate-600">문항별 정답 / 답안 입력 (<span id="ncsProxyQCountLabel">문항 수에 맞춰 자동 표시</span>)</label>
                        <button type="button" onclick="window.__addModalProxyQuestion()" class="px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-[11px] font-black hover:bg-sky-100">
                            <i class="fas fa-plus mr-1"></i>문항 입력란 추가
                        </button>
                    </div>
                    <div id="ncsProxyNumberedBox" class="space-y-2"></div>
                    <div class="mt-2.5">
                        <label class="block text-[11px] font-bold text-slate-500 mb-1">추가 메모 / 종합 의견 (선택)</label>
                        <textarea id="ncsProxyAnswer" rows="2" placeholder="추가 서술 답안이나 메모가 있으면 입력하세요..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"></textarea>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">평가 결과물 파일 첨부 (다중 선택 가능)</label>
                    <input id="ncsProxyFiles" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.zip,.rar,.stl,.step,.stp,.iges,.igs,.obj,.3mf,.f3d,.gcode,.mp4" class="block w-full text-sm text-slate-600 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-sky-50 file:text-sky-700 file:text-xs file:font-black hover:file:bg-sky-100" />
                </div>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onclick="window.__closeStudentNcsProxy()" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100">닫기</button>
                <button type="button" id="ncsProxySaveBtn" onclick="window.__submitStudentNcsProxy()" class="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-black hover:bg-sky-700">대리 답안 · 파일 저장</button>
            </div>
        </div>
    </div>
</body>
</html>
 `;
