(function () {
    if (!document.getElementById('sessionsListBody')) return;
    var tipToggle = document.getElementById('sessionsTipToggle');
    var tipContent = document.getElementById('sessionsTipContent');
    var tipIcon = document.getElementById('sessionsTipIcon');
    if (tipToggle && tipContent) {
        tipToggle.addEventListener('click', function () {
            var hidden = tipContent.classList.contains('hidden');
            tipContent.classList.toggle('hidden');
            if (tipIcon) tipIcon.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }
    var currentPage = 1;
    var STATUS_LABELS = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
    var STATUS_CLASS = { recruiting: 'bg-blue-100 text-blue-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-slate-100 text-slate-700', always_open: 'bg-slate-100 text-slate-500', closed: 'bg-red-100 text-red-700' };

    function getFilterValue(id) {
        var el = document.getElementById(id);
        return el && el.value != null ? el.value : '';
    }

    function getApprovedCourseIdFromUrl() {
        var match = /approved_course_id=([^&]+)/.exec(window.location.search || '');
        return match ? decodeURIComponent(match[1]) : '';
    }
    function buildQuery() {
        var params = new URLSearchParams();
        var approvedCourseId = getFilterValue('sessionsFilterApprovedCourseId') || getApprovedCourseIdFromUrl();
        var categoryId = getFilterValue('sessionsFilterCategory');
        var status = getFilterValue('sessionsFilterStatus');
        var name = (getFilterValue('sessionsFilterName') || '').trim();
        var instructor = (getFilterValue('sessionsFilterInstructor') || '').trim();
        var trainingStart = getFilterValue('sessionsFilterTrainingStart');
        if (approvedCourseId) params.set('approved_course_id', approvedCourseId);
        if (categoryId) params.set('category_id', categoryId);
        if (status) params.set('status', status);
        if (name) params.set('name', name);
        if (instructor) params.set('instructor_name', instructor);
        if (trainingStart) params.set('training_start_from', trainingStart);
        params.set('page', String(currentPage));
        var pageSizeEl = document.getElementById('sessionsPageSize');
        params.set('limit', String(parseInt(pageSizeEl && pageSizeEl.value ? pageSizeEl.value : 15, 10) || 15));
        return params.toString();
    }

    function buildStatsQuery() {
        var params = new URLSearchParams();
        var approvedCourseId = getFilterValue('sessionsFilterApprovedCourseId') || getApprovedCourseIdFromUrl();
        var categoryId = getFilterValue('sessionsFilterCategory');
        var name = (getFilterValue('sessionsFilterName') || '').trim();
        var instructor = (getFilterValue('sessionsFilterInstructor') || '').trim();
        var trainingStart = getFilterValue('sessionsFilterTrainingStart');
        if (approvedCourseId) params.set('approved_course_id', approvedCourseId);
        if (categoryId) params.set('category_id', categoryId);
        if (name) params.set('name', name);
        if (instructor) params.set('instructor_name', instructor);
        if (trainingStart) params.set('training_start_from', trainingStart);
        return params.toString();
    }

    function loadStats() {
        var qs = buildStatsQuery();
        fetch('/api/course-sessions/stats?' + qs, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var data = json.data;
                var el = document.getElementById('sessionsStats');
                if (!el) return;
                var html = '';
                ['recruiting', 'in_progress', 'completed', 'always_open', 'closed'].forEach(function (key) {
                    var cnt = data[key] != null ? data[key] : 0;
                    var label = STATUS_LABELS[key] || key;
                    var cls = STATUS_CLASS[key] || 'bg-slate-100 text-slate-600';
                    html += '<button type="button" class="sessions-stat-btn px-4 py-2 rounded-xl text-sm font-bold ' + cls + ' transition hover:opacity-90" data-status="' + key + '">' + label + ' ' + cnt + '건</button>';
                });
                el.innerHTML = html;
                el.querySelectorAll('.sessions-stat-btn').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var statusEl = document.getElementById('sessionsFilterStatus');
                        if (statusEl) statusEl.value = btn.getAttribute('data-status') || '';
                        currentPage = 1;
                        loadStats();
                        loadSessionsList();
                    });
                });
            })
            .catch(function () { });
    }

    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) return;
                var list = json.data || [];
                var sel = document.getElementById('sessionsFilterCategory');
                if (sel) sel.innerHTML = '<option value="">전체</option>' + list.map(function (c) { return '<option value="' + c.id + '">' + (c.name || '').replace(/</g, '&lt;') + '</option>'; }).join('');
            })
            .catch(function () { });
    }

    function loadSessionsList() {
        var tbody = document.getElementById('sessionsListBody');
        tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>';
        var token = localStorage.getItem('token');
        var qs = buildQuery();
        fetch('/api/course-sessions?' + qs, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) {
                    tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-red-500">조회 실패</td></tr>';
                    return;
                }
                var list = Array.isArray(json.data) ? json.data : [];
                var pagination = json.pagination || {};
                var summaryEl = document.getElementById('sessionsSummary');
                if (summaryEl) {
                    summaryEl.textContent = list.length === 0 ? '목록 없음' : '총 ' + (pagination.total || 0) + '건';
                    summaryEl.classList.remove('hidden');
                }
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" class="p-12 text-center text-slate-500"><i class="fas fa-calendar-plus text-3xl mb-3 block opacity-50"></i><p class="font-medium">등록된 회차가 없습니다.</p><p class="text-sm text-slate-400 mt-1">회차별 과정 신규 개설 버튼으로 첫 회차를 등록해 보세요.</p></td></tr>';
                } else {
                    var startNo = (pagination.page - 1) * (pagination.limit || 15) + 1;
                    var reLt = new RegExp('<', 'g');
                    var reQuot = /"/g;
                    tbody.innerHTML = list.map(function (item, i) {
                        var no = startNo + i;
                        var courseName = item.course_name || '';
                        var sessionNum = item.session_number != null ? String(item.session_number) + '회차' : '';
                        var sessionNamePart = (item.session_name || '').trim();
                        var parts = [courseName];
                        if (sessionNum) parts.push(sessionNum);
                        if (sessionNamePart) parts.push(sessionNamePart);
                        var displayName = parts.filter(Boolean).join(' + ');
                        var courseNameEsc = displayName.replace(reQuot, '&quot;').replace(reLt, '&lt;');
                        var statusLabel = STATUS_LABELS[item.status] || item.status;

                        var statusCls = '';
                        switch (item.status) {
                            case 'recruiting': statusCls = 'bg-blue-100 text-blue-700'; break;
                            case 'in_progress': statusCls = 'bg-green-100 text-green-700'; break;
                            case 'completed': statusCls = 'bg-slate-100 text-slate-500'; break;
                            case 'always_open': statusCls = 'bg-purple-100 text-purple-700'; break;
                            case 'closed': statusCls = 'bg-red-100 text-red-600'; break;
                            default: statusCls = 'bg-slate-100 text-slate-600';
                        }

                        var trainingRange = [item.training_start_date, item.training_end_date].filter(Boolean).join(' ~ ') || '-';
                        var regDate = item.registered_at || (item.created_at || '').slice(0, 10) || '-';
                        var isExposed = item.homepage_exposed === 1 || item.homepage_exposed === true;
                        var homepageBtn = isExposed
                            ? '<button type="button" class="btn-homepage-remove px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition" data-id="' + item.id + '" title="홈페이지에서 삭제">삭제</button>'
                            : '<button type="button" class="btn-homepage-register px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition" data-id="' + item.id + '" title="홈페이지에 등록">등록</button>';

                        // Links
                        var links = [];
                        if (item.url_ncs) links.push('<a href="' + (item.url_ncs || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline mr-2" title="NCS교과"><i class="fas fa-book mr-1"></i>NCS</a>');
                        if (item.url_plan) links.push('<a href="' + (item.url_plan || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline mr-2" title="교수계획서"><i class="fas fa-file-alt mr-1"></i>계획서</a>');
                        if (item.url_detail_plan) links.push('<a href="' + (item.url_detail_plan || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline" title="세부교수계획서"><i class="fas fa-list-alt mr-1"></i>세부</a>');
                        var linksHtml = links.length ? '<div class="mt-1 flex flex-wrap">' + links.join('') + '</div>' : '';

                        return '<tr class="hover:bg-slate-50/80 transition border-b border-slate-50">' +
                            '<td class="p-3 text-center text-slate-500 text-xs">' + no + '</td>' +
                            '<td class="p-3 min-w-[180px]">' +
                            '<div class="font-bold text-slate-700 text-sm mb-0.5 break-words whitespace-normal" title="' + courseNameEsc.replace(/"/g, '&quot;') + '">' + courseNameEsc + '</div>' +
                            linksHtml +
                            '</td>' +
                            '<td class="p-3 text-center font-bold text-slate-600 text-xs">' + (item.session_number != null ? item.session_number + '회차' : '-') + '</td>' +
                            '<td class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold ' + statusCls + '">' + statusLabel + '</span></td>' +
                            '<td class="p-3 text-center text-slate-600 text-xs">' + trainingRange + '</td>' +
                            '<td class="p-3 text-center text-slate-500 text-xs">' + regDate + '</td>' +
                            '<td class="p-3 text-center">' + homepageBtn + '</td>' +
                            '<td class="p-3 text-right">' +
                            '<div class="flex items-center justify-end gap-1 font-bold">' +
                            '<button type="button" class="btn-session-timetable px-2 py-1 text-[10px] bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition" data-id="' + item.id + '" title="시간표 편성"><i class="fas fa-calendar-alt mr-1"></i>시간표</button>' +
                            '<button type="button" class="btn-session-edit p-1.5 text-slate-400 hover:text-primary-600 transition" data-id="' + item.id + '" title="수정"><i class="fas fa-pen"></i></button>' +
                            '<button type="button" class="btn-session-delete p-1.5 text-slate-400 hover:text-red-500 transition" data-id="' + item.id + '" title="삭제"><i class="fas fa-trash-alt"></i></button>' +
                            '</div>' +
                            '</td>' +
                            '</tr>';
                    }).join('');
                    tbody.querySelectorAll('.btn-session-timetable').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.location.href = '/admin/courses/sessions/' + btn.getAttribute('data-id') + '/timetable'; });
                    });
                    tbody.querySelectorAll('.btn-session-edit').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.openSessionEdit(parseInt(btn.getAttribute('data-id'), 10)); });
                    });
                    tbody.querySelectorAll('.btn-session-delete').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.deleteSession(parseInt(btn.getAttribute('data-id'), 10)); });
                    });
                    tbody.querySelectorAll('.btn-homepage-register').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.setHomepageExposed(parseInt(btn.getAttribute('data-id'), 10), 1); });
                    });
                    tbody.querySelectorAll('.btn-homepage-remove').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.setHomepageExposed(parseInt(btn.getAttribute('data-id'), 10), 0); });
                    });
                }
                renderPagination(pagination);
            })
            .catch(function () { tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-red-500">목록을 불러올 수 없습니다.</td></tr>'; });
    }

    function renderPagination(p) {
        var el = document.getElementById('sessionsPagination');
        if (!el || !p || p.totalPages <= 1) { if (el) el.innerHTML = p ? '총 ' + (p.total || 0) + '건' : ''; return; }
        var html = '<span class="text-sm text-slate-600 mr-4">총 ' + (p.total || 0) + '건</span>';
        html += '<button type="button" class="sessions-page-btn px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 transition" data-page="' + (p.page - 1) + '" ' + (p.page <= 1 ? 'disabled' : '') + '>이전</button>';
        for (var i = 1; i <= Math.min(5, p.totalPages); i++) {
            html += '<button type="button" class="sessions-page-btn px-3 py-1.5 rounded-lg text-sm font-bold ' + (i === p.page ? 'bg-purple-600 text-white' : 'border border-slate-200 hover:bg-slate-50') + ' transition" data-page="' + i + '">' + i + '</button>';
        }
        html += '<button type="button" class="sessions-page-btn px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 transition" data-page="' + (p.page + 1) + '" ' + (p.page >= p.totalPages ? 'disabled' : '') + '>다음</button>';
        el.innerHTML = html;
        el.querySelectorAll('.sessions-page-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var page = parseInt(btn.getAttribute('data-page'), 10);
                if (page >= 1 && page <= p.totalPages) { currentPage = page; loadSessionsList(); }
            });
        });
    }

    window.openSessionEdit = function (id) {
        if (id) window.location.href = '/admin/courses/sessions/register/' + id;
    };

    window.deleteSession = function (id) {
        if (!confirm('이 회차를 삭제할까요?')) return;
        fetch('/api/course-sessions/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) { if (json.success) { loadStats(); loadSessionsList(); } else alert(json.error || '삭제 실패'); })
            .catch(function () { alert('삭제 중 오류가 발생했습니다.'); });
    };

    window.setHomepageExposed = function (id, val) {
        if (!id) return;
        var action = val === 1 ? '홈페이지에 등록' : '홈페이지에서 삭제';
        fetch('/api/course-sessions/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({ homepage_exposed: val })
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) { loadSessionsList(); }
                else alert(json.error || action + ' 실패');
            })
            .catch(function () { alert(action + ' 중 오류가 발생했습니다.'); });
    };

    var btnSearch = document.getElementById('sessionsBtnSearch');
    if (btnSearch) btnSearch.addEventListener('click', function () { currentPage = 1; loadStats(); loadSessionsList(); });
    var btnReset = document.getElementById('sessionsBtnReset');
    if (btnReset) btnReset.addEventListener('click', function () {
        ['sessionsFilterCategory', 'sessionsFilterStatus', 'sessionsFilterName', 'sessionsFilterInstructor', 'sessionsFilterTrainingStart'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = '';
        });
        currentPage = 1;
        loadStats();
        loadSessionsList();
    });
    var pageSizeEl = document.getElementById('sessionsPageSize');
    if (pageSizeEl) pageSizeEl.addEventListener('change', function () { currentPage = 1; loadSessionsList(); });
    var btnRefresh = document.getElementById('sessionsBtnRefresh');
    if (btnRefresh) btnRefresh.addEventListener('click', function () { loadStats(); loadSessionsList(); });

    loadCategories().then(function () {
        loadStats();
        loadSessionsList();
    });
})();
