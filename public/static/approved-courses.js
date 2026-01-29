(function() {
    if (!document.getElementById('approvedListBody')) return;
    var tipToggle = document.getElementById('approvedTipToggle');
    var tipContent = document.getElementById('approvedTipContent');
    var tipIcon = document.getElementById('approvedTipIcon');
    if (tipToggle && tipContent) {
        tipToggle.addEventListener('click', function() {
            var hidden = tipContent.classList.contains('hidden');
            tipContent.classList.toggle('hidden');
            if (tipIcon) tipIcon.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }
    var currentPage = 1;
    var categories = [];
    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success) return;
                categories = json.data || [];
                var reLt = new RegExp('<', 'g');
                var selFilter = document.getElementById('approvedFilterCategory');
                var selForm = document.getElementById('approvedFormCategory');
                if (selFilter) selFilter.innerHTML = '<option value="">전체</option>' + categories.map(function(c) { return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>'; }).join('');
                if (selForm) selForm.innerHTML = '<option value="">선택</option>' + categories.map(function(c) { return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>'; }).join('');
            }).catch(function(e) { console.error(e); });
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
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success) { tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-red-500">조회 실패</td></tr>'; return; }
                var list = json.data || [];
                var pagination = json.pagination || {};
                var reLt = new RegExp('<', 'g');
                var reQuot = /"/g;
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-12 text-center text-slate-400"><i class="fas fa-inbox text-3xl mb-3 block"></i> 등록된 승인 과정이 없습니다. 승인받은 과정 등록 버튼으로 추가하세요.</td></tr>';
                } else {
                    var startNo = (pagination.page - 1) * (pagination.limit || 15) + 1;
                    tbody.innerHTML = list.map(function(item, i) {
                        var no = startNo + i;
                        var nameEsc = (item.name || '').replace(reQuot, '&quot;').replace(reLt, '&lt;');
                        var timeStr = [item.training_time_start, item.training_time_end].filter(Boolean).join('-') || '-';
                        var cap = item.capacity != null ? item.capacity : '-';
                        var regDate = item.registered_at || (item.created_at || '').slice(0, 10) || '-';
                        var statusLabel = item.status === 'inactive' ? '비활성' : '활성';
                        var links = [];
                        if (item.url_ncs) links.push('<a href="' + (item.url_ncs || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs mr-1">NCS</a>');
                        if (item.url_plan) links.push('<a href="' + (item.url_plan || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs mr-1">교수</a>');
                        if (item.url_detail_plan) links.push('<a href="' + (item.url_detail_plan || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs">세부</a>');
                        var linksHtml = links.length ? links.join('') : '-';
                        var approvalEsc = (item.approval_org || '').replace(reQuot, '&quot;').replace(reLt, '&lt;');
                        return '<tr class="hover:bg-slate-50/50">' +
                            '<td class="px-4 py-3 text-slate-500">' + no + '</td>' +
                            '<td class="px-4 py-3 font-medium text-slate-800 break-words max-w-[200px]">' + nameEsc + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + (item.category_name || '-') + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + timeStr + '</td>' +
                            '<td class="px-4 py-3 text-slate-600">' + cap + '</td>' +
                            '<td class="px-4 py-3 text-xs">' + linksHtml + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + regDate + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs max-w-[120px] truncate" title="' + approvalEsc + '">' + (item.approval_org || '-') + '</td>' +
                            '<td class="px-4 py-3 text-xs">' + statusLabel + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + (item.instructor_name || '-') + '</td>' +
                            '<td class="px-4 py-3 text-right whitespace-nowrap">' +
                            '<button type="button" class="btn-approved-edit inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition mr-1" data-id="' + item.id + '"><i class="fas fa-pen mr-1"></i>수정</button>' +
                            '<button type="button" class="btn-approved-delete inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition" data-id="' + item.id + '" data-name="' + nameEsc + '"><i class="fas fa-trash-alt mr-1"></i>삭제</button>' +
                            '</td></tr>';
                    }).join('');
                    tbody.querySelectorAll('.btn-approved-edit').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.openApprovedEdit(parseInt(btn.getAttribute('data-id'), 10)); });
                    });
                    tbody.querySelectorAll('.btn-approved-delete').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.deleteApproved(parseInt(btn.getAttribute('data-id'), 10), btn.getAttribute('data-name') || ''); });
                    });
                }
                renderPagination(pagination);
            })
            .catch(function() { tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-red-500">로드 실패</td></tr>'; });
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
        el.querySelectorAll('.approved-page-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var page = parseInt(btn.getAttribute('data-page'), 10);
                if (page >= 1 && page <= p.totalPages) { currentPage = page; loadApprovedList(); }
            });
        });
    }
    function openRegisterModal() {
        document.getElementById('approvedFormModalTitle').textContent = '승인받은 과정 등록';
        document.getElementById('approvedFormSubmit').textContent = '등록';
        document.getElementById('approvedFormId').value = '';
        document.getElementById('approvedFormName').value = '';
        document.getElementById('approvedFormCategory').value = '';
        document.getElementById('approvedFormCapacity').value = '';
        document.getElementById('approvedFormTimeStart').value = '';
        document.getElementById('approvedFormTimeEnd').value = '';
        document.getElementById('approvedFormInstructor').value = '';
        document.getElementById('approvedFormApprovalOrg').value = '';
        document.getElementById('approvedFormRegisteredAt').value = '';
        document.getElementById('approvedFormStatus').value = 'active';
        document.getElementById('approvedFormUrlNcs').value = '';
        document.getElementById('approvedFormUrlPlan').value = '';
        document.getElementById('approvedFormUrlDetailPlan').value = '';
        document.getElementById('approvedFormModal').classList.remove('hidden');
    }
    window.openApprovedEdit = function(id) {
        fetch('/api/approved-courses/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) { alert('조회 실패'); return; }
                var d = json.data;
                document.getElementById('approvedFormModalTitle').textContent = '승인받은 과정 수정';
                document.getElementById('approvedFormSubmit').textContent = '저장';
                document.getElementById('approvedFormId').value = d.id;
                document.getElementById('approvedFormName').value = d.name || '';
                document.getElementById('approvedFormCategory').value = d.category_id != null ? d.category_id : '';
                document.getElementById('approvedFormCapacity').value = d.capacity != null ? d.capacity : '';
                document.getElementById('approvedFormTimeStart').value = d.training_time_start || '';
                document.getElementById('approvedFormTimeEnd').value = d.training_time_end || '';
                document.getElementById('approvedFormInstructor').value = d.instructor_name || '';
                document.getElementById('approvedFormApprovalOrg').value = d.approval_org || '';
                document.getElementById('approvedFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('approvedFormStatus').value = d.status || 'active';
                document.getElementById('approvedFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('approvedFormUrlPlan').value = d.url_plan || '';
                document.getElementById('approvedFormUrlDetailPlan').value = d.url_detail_plan || '';
                document.getElementById('approvedFormModal').classList.remove('hidden');
            })
            .catch(function() { alert('조회 실패'); });
    };
    function closeFormModal() { document.getElementById('approvedFormModal').classList.add('hidden'); }
    function submitForm() {
        var id = document.getElementById('approvedFormId').value;
        var name = (document.getElementById('approvedFormName').value || '').trim();
        if (!name) { alert('과정명을 입력하세요.'); return; }
        var categoryId = document.getElementById('approvedFormCategory').value;
        var capacity = document.getElementById('approvedFormCapacity').value;
        var payload = {
            name: name,
            category_id: categoryId ? parseInt(categoryId, 10) : null,
            capacity: capacity !== '' ? parseInt(capacity, 10) : null,
            training_time_start: (document.getElementById('approvedFormTimeStart').value || '').trim() || null,
            training_time_end: (document.getElementById('approvedFormTimeEnd').value || '').trim() || null,
            instructor_name: (document.getElementById('approvedFormInstructor').value || '').trim() || null,
            approval_org: (document.getElementById('approvedFormApprovalOrg').value || '').trim() || null,
            registered_at: (document.getElementById('approvedFormRegisteredAt').value || '').trim() || null,
            status: document.getElementById('approvedFormStatus').value || 'active',
            url_ncs: (document.getElementById('approvedFormUrlNcs').value || '').trim() || null,
            url_plan: (document.getElementById('approvedFormUrlPlan').value || '').trim() || null,
            url_detail_plan: (document.getElementById('approvedFormUrlDetailPlan').value || '').trim() || null
        };
        var url = id ? '/api/approved-courses/' + id : '/api/approved-courses';
        var method = id ? 'PUT' : 'POST';
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(payload)
        })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (json.success) { closeFormModal(); loadApprovedList(); return; }
                alert(json.error || '저장 실패');
            })
            .catch(function() { alert('저장 중 오류가 발생했습니다.'); });
    }
    window.deleteApproved = function(id, nameDisplay) {
        if (!confirm('다음 승인 과정을 삭제할까요?\n' + (nameDisplay || '').replace(/&quot;/g, '"').replace(/&lt;/g, '<'))) return;
        fetch('/api/approved-courses/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) { if (json.success) loadApprovedList(); else alert(json.error || '삭제 실패'); })
            .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
    };
    document.getElementById('approvedBtnSearch').addEventListener('click', function() { currentPage = 1; loadApprovedList(); });
    document.getElementById('approvedBtnReset').addEventListener('click', function() {
        document.getElementById('approvedFilterCategory').value = '';
        document.getElementById('approvedFilterName').value = '';
        document.getElementById('approvedFilterInstructor').value = '';
        document.getElementById('approvedFilterFrom').value = '';
        document.getElementById('approvedFilterTo').value = '';
        document.getElementById('approvedFilterAllPeriod').checked = true;
        currentPage = 1;
        loadApprovedList();
    });
    document.getElementById('approvedFilterAllPeriod').addEventListener('change', function() {
        document.getElementById('approvedFilterFrom').disabled = this.checked;
        document.getElementById('approvedFilterTo').disabled = this.checked;
    });
    document.getElementById('approvedPageSize').addEventListener('change', function() { currentPage = 1; loadApprovedList(); });
    document.getElementById('approvedBtnRegister').addEventListener('click', openRegisterModal);
    document.getElementById('approvedBtnRefresh').addEventListener('click', function() { loadApprovedList(); });
    document.getElementById('approvedFormModalClose').addEventListener('click', closeFormModal);
    document.getElementById('approvedFormModalClose2').addEventListener('click', closeFormModal);
    document.getElementById('approvedFormSubmit').addEventListener('click', submitForm);
    document.getElementById('approvedFilterFrom').disabled = document.getElementById('approvedFilterAllPeriod').checked;
    document.getElementById('approvedFilterTo').disabled = document.getElementById('approvedFilterAllPeriod').checked;
    loadCategories().then(function() { loadApprovedList(); });
})();
