(function() {
    if (!document.getElementById('sessionsListBody')) return;
    var tipToggle = document.getElementById('sessionsTipToggle');
    var tipContent = document.getElementById('sessionsTipContent');
    var tipIcon = document.getElementById('sessionsTipIcon');
    if (tipToggle && tipContent) {
        tipToggle.addEventListener('click', function() {
            var hidden = tipContent.classList.contains('hidden');
            tipContent.classList.toggle('hidden');
            if (tipIcon) tipIcon.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }
    var currentPage = 1;
    var STATUS_LABELS = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
    var STATUS_CLASS = { recruiting: 'bg-blue-100 text-blue-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-slate-100 text-slate-700', always_open: 'bg-slate-100 text-slate-500', closed: 'bg-red-100 text-red-700' };

    function buildQuery() {
        var params = new URLSearchParams();
        var categoryId = document.getElementById('sessionsFilterCategory').value;
        var status = document.getElementById('sessionsFilterStatus').value;
        var name = (document.getElementById('sessionsFilterName').value || '').trim();
        var instructor = (document.getElementById('sessionsFilterInstructor').value || '').trim();
        var trainingStart = document.getElementById('sessionsFilterTrainingStart').value;
        if (categoryId) params.set('category_id', categoryId);
        if (status) params.set('status', status);
        if (name) params.set('name', name);
        if (instructor) params.set('instructor_name', instructor);
        if (trainingStart) params.set('training_start_from', trainingStart);
        params.set('page', String(currentPage));
        params.set('limit', String(parseInt(document.getElementById('sessionsPageSize').value, 10) || 15));
        return params.toString();
    }

    function buildStatsQuery() {
        var params = new URLSearchParams();
        var categoryId = document.getElementById('sessionsFilterCategory').value;
        var name = (document.getElementById('sessionsFilterName').value || '').trim();
        var instructor = (document.getElementById('sessionsFilterInstructor').value || '').trim();
        var trainingStart = document.getElementById('sessionsFilterTrainingStart').value;
        if (categoryId) params.set('category_id', categoryId);
        if (name) params.set('name', name);
        if (instructor) params.set('instructor_name', instructor);
        if (trainingStart) params.set('training_start_from', trainingStart);
        return params.toString();
    }

    function loadStats() {
        var qs = buildStatsQuery();
        fetch('/api/course-sessions/stats?' + qs, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var data = json.data;
                var el = document.getElementById('sessionsStats');
                var html = '';
                ['recruiting', 'in_progress', 'completed', 'always_open', 'closed'].forEach(function(key) {
                    var cnt = data[key] != null ? data[key] : 0;
                    var label = STATUS_LABELS[key] || key;
                    var cls = STATUS_CLASS[key] || 'bg-slate-100 text-slate-600';
                    html += '<button type="button" class="sessions-stat-btn px-4 py-2 rounded-xl text-sm font-bold ' + cls + ' transition hover:opacity-90" data-status="' + key + '">' + label + ' ' + cnt + '건</button>';
                });
                el.innerHTML = html;
                el.querySelectorAll('.sessions-stat-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        document.getElementById('sessionsFilterStatus').value = btn.getAttribute('data-status');
                        currentPage = 1;
                        loadStats();
                        loadSessionsList();
                    });
                });
            })
            .catch(function() {});
    }

    function loadApprovedCourses() {
        return fetch('/api/approved-courses?limit=500', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return [];
                return json.data;
            })
            .catch(function() { return []; });
    }

    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success) return;
                var list = json.data || [];
                var sel = document.getElementById('sessionsFilterCategory');
                if (sel) sel.innerHTML = '<option value="">전체</option>' + list.map(function(c) { return '<option value="' + c.id + '">' + (c.name || '').replace(/</g, '&lt;') + '</option>'; }).join('');
            })
            .catch(function() {});
    }

    function loadSessionsList() {
        var tbody = document.getElementById('sessionsListBody');
        tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>';
        var token = localStorage.getItem('token');
        var qs = buildQuery();
        fetch('/api/course-sessions?' + qs, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success) {
                    tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-red-500">조회 실패</td></tr>';
                    return;
                }
                var list = json.data || [];
                var pagination = json.pagination || {};
                var summaryEl = document.getElementById('sessionsSummary');
                if (summaryEl) {
                    summaryEl.textContent = 'Showing ' + (pagination.total || 0) + ' entries';
                    summaryEl.classList.remove('hidden');
                }
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-12 text-center text-slate-400"><i class="fas fa-calendar-plus text-3xl mb-3 block"></i> 등록된 회차가 없습니다. 글등록 버튼으로 회차를 추가하세요.</td></tr>';
                } else {
                    var startNo = (pagination.page - 1) * (pagination.limit || 15) + 1;
                    var reLt = new RegExp('<', 'g');
                    var reQuot = /"/g;
                    tbody.innerHTML = list.map(function(item, i) {
                        var no = startNo + i;
                        var courseNameEsc = (item.course_name || '').replace(reQuot, '&quot;').replace(reLt, '&lt;');
                        var statusLabel = STATUS_LABELS[item.status] || item.status;
                        var statusCls = STATUS_CLASS[item.status] || 'bg-slate-100 text-slate-600';
                        var trainingRange = [item.training_start_date, item.training_end_date].filter(Boolean).join('~') || '-';
                        var regDate = item.registered_at || (item.created_at || '').slice(0, 10) || '-';
                        var links = [];
                        if (item.url_ncs) links.push('<a href="' + (item.url_ncs || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs mr-1">NCS</a>');
                        if (item.url_plan) links.push('<a href="' + (item.url_plan || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs mr-1">교수</a>');
                        if (item.url_detail_plan) links.push('<a href="' + (item.url_detail_plan || '').replace(reQuot, '&quot;') + '" target="_blank" rel="noopener" class="text-purple-600 hover:underline text-xs">세부</a>');
                        var linksHtml = links.length ? links.join('') : '-';
                        return '<tr class="hover:bg-slate-50/50">' +
                            '<td class="px-4 py-3 text-slate-500">' + no + '</td>' +
                            '<td class="px-4 py-3 font-medium text-slate-800 break-words max-w-[200px]">' + courseNameEsc + '</td>' +
                            '<td class="px-4 py-3 text-slate-600">' + (item.session_number != null ? item.session_number : '-') + '</td>' +
                            '<td class="px-4 py-3"><span class="px-2 py-1 rounded-lg text-xs font-bold ' + statusCls + '">' + statusLabel + '</span></td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + trainingRange + '</td>' +
                            '<td class="px-4 py-3 text-xs">' + linksHtml + '</td>' +
                            '<td class="px-4 py-3 text-slate-600 text-xs">' + regDate + '</td>' +
                            '<td class="px-4 py-3 text-right whitespace-nowrap">' +
                            '<button type="button" class="btn-session-edit inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition mr-1" data-id="' + item.id + '"><i class="fas fa-pen mr-1"></i>수정</button>' +
                            '<button type="button" class="btn-session-delete inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition" data-id="' + item.id + '"><i class="fas fa-trash-alt mr-1"></i>삭제</button>' +
                            '</td></tr>';
                    }).join('');
                    tbody.querySelectorAll('.btn-session-edit').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.openSessionEdit(parseInt(btn.getAttribute('data-id'), 10)); });
                    });
                    tbody.querySelectorAll('.btn-session-delete').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.deleteSession(parseInt(btn.getAttribute('data-id'), 10)); });
                    });
                }
                renderPagination(pagination);
            })
            .catch(function() { tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-red-500">로드 실패</td></tr>'; });
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
        el.querySelectorAll('.sessions-page-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var page = parseInt(btn.getAttribute('data-page'), 10);
                if (page >= 1 && page <= p.totalPages) { currentPage = page; loadSessionsList(); }
            });
        });
    }

    function openRegisterModal() {
        document.getElementById('sessionsFormModalTitle').textContent = '회차 등록';
        document.getElementById('sessionsFormSubmit').textContent = '등록';
        document.getElementById('sessionsFormId').value = '';
        document.getElementById('sessionsFormApprovedCourse').value = '';
        document.getElementById('sessionsFormSessionNumber').value = '';
        document.getElementById('sessionsFormStatus').value = 'recruiting';
        document.getElementById('sessionsFormTrainingStart').value = '';
        document.getElementById('sessionsFormTrainingEnd').value = '';
        document.getElementById('sessionsFormRegisteredAt').value = '';
        document.getElementById('sessionsFormUrlNcs').value = '';
        document.getElementById('sessionsFormUrlPlan').value = '';
        document.getElementById('sessionsFormUrlDetailPlan').value = '';
        document.getElementById('sessionsFormModal').classList.remove('hidden');
    }

    window.openSessionEdit = function(id) {
        fetch('/api/course-sessions/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) { alert('조회 실패'); return; }
                var d = json.data;
                document.getElementById('sessionsFormModalTitle').textContent = '회차 수정';
                document.getElementById('sessionsFormSubmit').textContent = '저장';
                document.getElementById('sessionsFormId').value = d.id;
                document.getElementById('sessionsFormApprovedCourse').value = d.approved_course_id != null ? d.approved_course_id : '';
                document.getElementById('sessionsFormApprovedCourse').disabled = true;
                document.getElementById('sessionsFormSessionNumber').value = d.session_number != null ? d.session_number : '';
                document.getElementById('sessionsFormSessionNumber').disabled = true;
                document.getElementById('sessionsFormStatus').value = d.status || 'recruiting';
                document.getElementById('sessionsFormTrainingStart').value = (d.training_start_date || '').slice(0, 10);
                document.getElementById('sessionsFormTrainingEnd').value = (d.training_end_date || '').slice(0, 10);
                document.getElementById('sessionsFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('sessionsFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('sessionsFormUrlPlan').value = d.url_plan || '';
                document.getElementById('sessionsFormUrlDetailPlan').value = d.url_detail_plan || '';
                document.getElementById('sessionsFormModal').classList.remove('hidden');
            })
            .catch(function() { alert('조회 실패'); });
    };

    function closeFormModal() {
        document.getElementById('sessionsFormModal').classList.add('hidden');
        document.getElementById('sessionsFormApprovedCourse').disabled = false;
        document.getElementById('sessionsFormSessionNumber').disabled = false;
    }

    function submitForm() {
        var id = document.getElementById('sessionsFormId').value;
        var approvedCourseId = document.getElementById('sessionsFormApprovedCourse').value;
        var sessionNumber = document.getElementById('sessionsFormSessionNumber').value;
        if (!approvedCourseId || !sessionNumber) { alert('승인받은 과정과 회차를 선택·입력하세요.'); return; }
        var payload = {
            approved_course_id: parseInt(approvedCourseId, 10),
            session_number: parseInt(sessionNumber, 10),
            status: document.getElementById('sessionsFormStatus').value || 'recruiting',
            training_start_date: (document.getElementById('sessionsFormTrainingStart').value || '').trim() || null,
            training_end_date: (document.getElementById('sessionsFormTrainingEnd').value || '').trim() || null,
            registered_at: (document.getElementById('sessionsFormRegisteredAt').value || '').trim() || null,
            url_ncs: (document.getElementById('sessionsFormUrlNcs').value || '').trim() || null,
            url_plan: (document.getElementById('sessionsFormUrlPlan').value || '').trim() || null,
            url_detail_plan: (document.getElementById('sessionsFormUrlDetailPlan').value || '').trim() || null
        };
        var url = id ? '/api/course-sessions/' + id : '/api/course-sessions';
        var method = id ? 'PUT' : 'POST';
        if (id) {
            delete payload.approved_course_id;
            delete payload.session_number;
        }
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(payload)
        })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (json.success) { closeFormModal(); loadStats(); loadSessionsList(); return; }
                alert(json.error || '저장 실패');
            })
            .catch(function() { alert('저장 중 오류가 발생했습니다.'); });
    }

    window.deleteSession = function(id) {
        if (!confirm('이 회차를 삭제할까요?')) return;
        fetch('/api/course-sessions/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) { if (json.success) { loadStats(); loadSessionsList(); } else alert(json.error || '삭제 실패'); })
            .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
    };

    document.getElementById('sessionsBtnSearch').addEventListener('click', function() { currentPage = 1; loadStats(); loadSessionsList(); });
    document.getElementById('sessionsBtnReset').addEventListener('click', function() {
        document.getElementById('sessionsFilterCategory').value = '';
        document.getElementById('sessionsFilterStatus').value = '';
        document.getElementById('sessionsFilterName').value = '';
        document.getElementById('sessionsFilterInstructor').value = '';
        document.getElementById('sessionsFilterTrainingStart').value = '';
        currentPage = 1;
        loadStats();
        loadSessionsList();
    });
    document.getElementById('sessionsPageSize').addEventListener('change', function() { currentPage = 1; loadSessionsList(); });
    document.getElementById('sessionsBtnRegister').addEventListener('click', function() {
        loadApprovedCourses().then(function(list) {
            var sel = document.getElementById('sessionsFormApprovedCourse');
            sel.innerHTML = '<option value="">선택</option>' + (list || []).map(function(c) { return '<option value="' + c.id + '">' + (c.name || '').replace(/</g, '&lt;') + '</option>'; }).join('');
            openRegisterModal();
        });
    });
    document.getElementById('sessionsBtnRefresh').addEventListener('click', function() { loadStats(); loadSessionsList(); });
    document.getElementById('sessionsFormModalClose').addEventListener('click', closeFormModal);
    document.getElementById('sessionsFormModalClose2').addEventListener('click', closeFormModal);
    document.getElementById('sessionsFormSubmit').addEventListener('click', submitForm);

    loadCategories().then(function() {
        loadStats();
        loadSessionsList();
    });
})();
