(function () {
    if (!document.getElementById('approvedListBody')) return;
    var tipToggle = document.getElementById('approvedTipToggle');
    var tipContent = document.getElementById('approvedTipContent');
    var tipIcon = document.getElementById('approvedTipIcon');
    if (tipToggle && tipContent) {
        tipToggle.addEventListener('click', function () {
            var hidden = tipContent.classList.contains('hidden');
            tipContent.classList.toggle('hidden');
            if (tipIcon) tipIcon.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }
    var currentPage = 1;
    var categories = [];
    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) return;
                categories = json.data || [];
                var reLt = new RegExp('<', 'g');
                var selFilter = document.getElementById('approvedFilterCategory');
                if (selFilter) selFilter.innerHTML = '<option value="">전체</option>' + categories.map(function (c) { return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>'; }).join('');
            }).catch(function (e) { console.error(e); });
    }
    function buildQuery() {
        var categoryId = document.getElementById('approvedFilterCategory').value;
        var name = (document.getElementById('approvedFilterName').value || '').trim();
        var instructor = (document.getElementById('approvedFilterInstructor').value || '').trim();
        var from = document.getElementById('approvedFilterFrom').value;
        var to = document.getElementById('approvedFilterTo').value;
        var allPeriod = document.getElementById('approvedFilterAllPeriod').checked;
        var limit = parseInt(document.getElementById('approvedPageSize').value, 10) || 15;
        var params = new URLSearchParams();
        if (categoryId) params.set('category_id', categoryId);
        if (name) params.set('name', name);
        if (instructor) params.set('instructor_name', instructor);
        if (!allPeriod && from) params.set('period_from', from);
        if (!allPeriod && to) params.set('period_to', to);
        params.set('page', String(currentPage));
        params.set('limit', String(limit));
        return params.toString();
    }
    function loadApprovedList() {
        var tbody = document.getElementById('approvedListBody');
        tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>';
        fetch('/api/approved-courses?' + buildQuery(), { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) { tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-red-500">조회 실패</td></tr>'; return; }
                var list = json.data || [];
                var pagination = json.pagination || {};
                var reLt = new RegExp('<', 'g');
                var reQuot = /"/g;
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="9" class="p-12 text-center text-slate-400"><i class="fas fa-inbox text-3xl mb-3 block opacity-50"></i> 등록된 승인 과정이 없습니다.</td></tr>';
                } else {
                    var startNo = (pagination.page - 1) * (pagination.limit || 15) + 1;
                    tbody.innerHTML = list.map(function (item, i) {
                        var no = startNo + i;
                        var nameEsc = (item.name || '').replace(reQuot, '&quot;').replace(reLt, '&lt;');
                        var timeStr = [item.training_time_start, item.training_time_end].filter(Boolean).join('-') || '-';
                        var cap = item.capacity != null ? item.capacity + '명' : '-';

                        // Links
                        var links = [];
                        if (item.url_ncs) links.push('<a href="' + (item.url_ncs || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline mr-2" title="NCS교과"><i class="fas fa-book mr-1"></i>NCS</a>');
                        if (item.url_plan) links.push('<a href="' + (item.url_plan || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline mr-2" title="교수계획서"><i class="fas fa-file-alt mr-1"></i>계획서</a>');
                        if (item.url_detail_plan) links.push('<a href="' + (item.url_detail_plan || '').replace(reQuot, '&quot;') + '" target="_blank" class="text-xs text-primary-600 hover:underline" title="세부교수계획서"><i class="fas fa-list-alt mr-1"></i>세부</a>');
                        var linksHtml = links.length ? '<div class="mt-1 flex flex-wrap">' + links.join('') + '</div>' : '';

                        var statusBadge = item.status === 'inactive'
                            ? '<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">비활성</span>'
                            : '<span class="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold">활성</span>';

                        return '<tr class="hover:bg-slate-50/80 transition">' +
                            '<td class="p-3 text-center text-slate-500 text-xs">' + no + '</td>' +
                            '<td class="p-3 text-slate-600 text-xs font-medium">' + (item.category_name || '-') + '</td>' +
                            '<td class="p-3">' +
                            '<div class="font-bold text-slate-700 text-sm mb-0.5">' + nameEsc + '</div>' +
                            linksHtml +
                            '</td>' +
                            '<td class="p-3 text-slate-600 text-xs">' + (item.instructor_name || '-') + '</td>' +
                            '<td class="p-3 text-center text-slate-600 text-xs">' + timeStr + '</td>' +
                            '<td class="p-3 text-center text-slate-600 text-xs">' + cap + '</td>' +
                            '<td class="p-3 text-center text-slate-600 text-xs truncate max-w-[100px]" title="' + (item.approval_org || '') + '">' + (item.approval_org || '-') + '</td>' +
                            '<td class="p-3 text-center">' + statusBadge + '</td>' +
                            '<td class="p-3 text-right">' +
                            '<div class="flex items-center justify-end gap-1">' +
                            '<a href="/admin/courses/approved/register/' + item.id + '" class="p-1.5 text-slate-400 hover:text-primary-600 transition" title="수정"><i class="fas fa-pen"></i></a>' +
                            '<button type="button" class="btn-approved-delete p-1.5 text-slate-400 hover:text-red-500 transition" data-id="' + item.id + '" data-name="' + nameEsc + '" title="삭제"><i class="fas fa-trash-alt"></i></button>' +
                            '</div>' +
                            '</td>' +
                            '</tr>';
                    }).join('');
                    tbody.querySelectorAll('.btn-approved-delete').forEach(function (btn) {
                        btn.addEventListener('click', function () { window.deleteApproved(parseInt(btn.getAttribute('data-id'), 10), btn.getAttribute('data-name') || ''); });
                    });
                }
                renderPagination(pagination);
            })
            .catch(function () { tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-red-500">로드 실패</td></tr>'; });
    }
    function renderPagination(p) {
        var el = document.getElementById('approvedPagination');
        if (!el || !p || p.totalPages <= 1) { if (el) el.innerHTML = p ? 'Showing ' + (p.total || 0) + ' entries' : ''; return; }
        var html = '<span class="text-sm text-slate-600 mr-4">총 ' + (p.total || 0) + '건</span>';
        html += '<button type="button" class="approved-page-btn px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 transition" data-page="' + (p.page - 1) + '" ' + (p.page <= 1 ? 'disabled' : '') + '>이전</button>';
        for (var i = 1; i <= Math.min(5, p.totalPages); i++) {
            html += '<button type="button" class="approved-page-btn px-3 py-1.5 rounded-lg text-sm font-bold ' + (i === p.page ? 'bg-purple-600 text-white' : 'border border-slate-200 hover:bg-slate-50') + ' transition" data-page="' + i + '">' + i + '</button>';
        }
        html += '<button type="button" class="approved-page-btn px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 transition" data-page="' + (p.page + 1) + '" ' + (p.page >= p.totalPages ? 'disabled' : '') + '>다음</button>';
        el.innerHTML = html;
        el.querySelectorAll('.approved-page-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var page = parseInt(btn.getAttribute('data-page'), 10);
                if (page >= 1 && page <= p.totalPages) { currentPage = page; loadApprovedList(); }
            });
        });
    }
    window.deleteApproved = function (id, nameDisplay) {
        if (!confirm('다음 승인 과정을 삭제할까요?\n' + (nameDisplay || '').replace(/&quot;/g, '"').replace(/&lt;/g, '<'))) return;
        fetch('/api/approved-courses/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) { if (json.success) loadApprovedList(); else alert(json.error || '삭제 실패'); })
            .catch(function () { alert('삭제 중 오류가 발생했습니다.'); });
    };
    var btnSearch = document.getElementById('approvedBtnSearch');
    if (btnSearch) btnSearch.addEventListener('click', function () { currentPage = 1; loadApprovedList(); });

    var btnReset = document.getElementById('approvedBtnReset');
    if (btnReset) {
        btnReset.addEventListener('click', function () {
            var elCat = document.getElementById('approvedFilterCategory');
            var elName = document.getElementById('approvedFilterName');
            var elInst = document.getElementById('approvedFilterInstructor');
            var elFrom = document.getElementById('approvedFilterFrom');
            var elTo = document.getElementById('approvedFilterTo');
            var elAll = document.getElementById('approvedFilterAllPeriod');
            if (elCat) elCat.value = '';
            if (elName) elName.value = '';
            if (elInst) elInst.value = '';
            if (elFrom) elFrom.value = '';
            if (elTo) elTo.value = '';
            if (elAll) elAll.checked = true;
            currentPage = 1;
            loadApprovedList();
        });
    }
    var filterAllPeriod = document.getElementById('approvedFilterAllPeriod');
    if (filterAllPeriod) {
        filterAllPeriod.addEventListener('change', function () {
            var f = document.getElementById('approvedFilterFrom');
            var t = document.getElementById('approvedFilterTo');
            if (f) f.disabled = this.checked;
            if (t) t.disabled = this.checked;
        });
    }
    var selPageSize = document.getElementById('approvedPageSize');
    if (selPageSize) selPageSize.addEventListener('change', function () { currentPage = 1; loadApprovedList(); });

    var btnRefresh = document.getElementById('approvedBtnRefresh');
    if (btnRefresh) btnRefresh.addEventListener('click', function () { loadApprovedList(); });

    if (filterAllPeriod) {
        var elFrom = document.getElementById('approvedFilterFrom');
        var elTo = document.getElementById('approvedFilterTo');
        if (elFrom) elFrom.disabled = filterAllPeriod.checked;
        if (elTo) elTo.disabled = filterAllPeriod.checked;
    }

    loadCategories().then(function () { loadApprovedList(); });
})();
