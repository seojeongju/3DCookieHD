(function() {
    var form = document.getElementById('approvedRegisterForm');
    if (!form) return;
    var formIdEl = document.getElementById('approvedFormId');
    var editId = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';

    var categoryNames = {};
    var textbookAll = [];
    var textbookSelected = [];
    var consumableAll = [];
    var consumableSelected = [];

    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var reLt = new RegExp('<', 'g');
                var sel = document.getElementById('approvedFormCategory');
                if (sel) {
                    (json.data || []).forEach(function(c) {
                        categoryNames[c.id] = c.name || '';
                    });
                    sel.innerHTML = '<option value="">선택</option>' + json.data.map(function(c) {
                        return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>';
                    }).join('');
                    sel.addEventListener('change', function() {
                        var label = document.getElementById('approvedNcsCourseLabel');
                        if (label) {
                            var id = sel.value;
                            var name = id ? (categoryNames[id] || '') : '';
                            label.textContent = name ? '해당과정은 NCS 훈련과정 (' + name + ') 입니다.' : '해당과정은 NCS 훈련과정 입니다. (과정분류 선택 시 표시)';
                        }
                    });
                }
            })
            .catch(function(e) { console.error(e); });
    }

    function loadPersonnel() {
        var container = document.getElementById('approvedFormInstructorList');
        if (!container) return;
        fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !Array.isArray(json.data)) {
                    container.innerHTML = '<span class="text-slate-500 text-sm">등록된 교직원이 없습니다.</span>';
                    return;
                }
                var list = json.data;
                container.innerHTML = list.map(function(p) {
                    var name = (p.name || '').trim() || '(이름 없음)';
                    var id = p.id != null ? p.id : '';
                    return '<label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"><input type="checkbox" class="approved-instructor-cb rounded text-emerald-600" value="' + id + '" data-name="' + name.replace(/"/g, '&quot;') + '"> <span class="text-sm text-slate-800">' + name.replace(/</g, '&lt;') + '</span></label>';
                }).join('');
            })
            .catch(function() {
                container.innerHTML = '<span class="text-slate-500 text-sm">교직원 목록을 불러올 수 없습니다.</span>';
            });
    }

    function renderDualList(allList, selectedList, allContainerId, selectedContainerId, allCountId, selectedCountId) {
        var allEl = document.getElementById(allContainerId);
        var selEl = document.getElementById(selectedContainerId);
        var allCountEl = document.getElementById(allCountId);
        var selCountEl = document.getElementById(selectedCountId);
        if (allEl) allEl.innerHTML = allList.length ? allList.map(function(item) {
            return '<label class="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer"><input type="checkbox" class="dual-list-cb" data-id="' + (item.id || '') + '" data-name="' + (item.name || '').replace(/"/g, '&quot;') + '"> <span>' + (item.name || '').replace(/</g, '&lt;') + '</span></label>';
        }).join('') : '<p class="text-slate-500 text-sm py-2">Empty list</p>';
        if (selEl) selEl.innerHTML = selectedList.length ? selectedList.map(function(item) {
            return '<label class="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer"><input type="checkbox" class="dual-list-selected-cb" data-id="' + (item.id || '') + '" data-name="' + (item.name || '').replace(/"/g, '&quot;') + '"> <span>' + (item.name || '').replace(/</g, '&lt;') + '</span></label>';
        }).join('') : '<p class="text-slate-500 text-sm py-2">Empty list</p>';
        if (allCountEl) allCountEl.textContent = allList.length;
        if (selCountEl) selCountEl.textContent = selectedList.length;
    }

    function updateTextbookCounts() {
        var a = document.getElementById('approvedTextbookAllCount');
        var s = document.getElementById('approvedTextbookSelectedCount');
        if (a) a.textContent = textbookAll.length;
        if (s) s.textContent = textbookSelected.length;
    }

    function updateConsumableCounts() {
        var a = document.getElementById('approvedConsumableAllCount');
        var s = document.getElementById('approvedConsumableSelectedCount');
        if (a) a.textContent = consumableAll.length;
        if (s) s.textContent = consumableSelected.length;
    }

    function initTextbookDualList() {
        textbookAll = [];
        textbookSelected = [];
        renderDualList(textbookAll, textbookSelected, 'approvedTextbookAllList', 'approvedTextbookSelectedList', 'approvedTextbookAllCount', 'approvedTextbookSelectedCount');
        document.getElementById('approvedTextbookAllCount').textContent = '0';
        document.getElementById('approvedTextbookSelectedCount').textContent = '0';
    }

    function initConsumableDualList() {
        consumableAll = [];
        consumableSelected = [];
        renderDualList(consumableAll, consumableSelected, 'approvedConsumableAllList', 'approvedConsumableSelectedList', 'approvedConsumableAllCount', 'approvedConsumableSelectedCount');
        document.getElementById('approvedConsumableAllCount').textContent = '0';
        document.getElementById('approvedConsumableSelectedCount').textContent = '0';
    }

    function loadCourse(id) {
        return fetch('/api/approved-courses/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var d = json.data;
                document.getElementById('approvedFormName').value = d.name || '';
                document.getElementById('approvedFormCategory').value = d.category_id != null ? d.category_id : '';
                var catSel = document.getElementById('approvedFormCategory');
                if (catSel && catSel.value && categoryNames[catSel.value]) {
                    var label = document.getElementById('approvedNcsCourseLabel');
                    if (label) label.textContent = '해당과정은 NCS 훈련과정 (' + categoryNames[catSel.value] + ') 입니다.';
                }
                document.getElementById('approvedFormCapacity').value = d.capacity != null ? d.capacity : '';
                document.getElementById('approvedFormTimeStart').value = (d.training_time_start || '').slice(0, 5) || '00:00';
                document.getElementById('approvedFormTimeEnd').value = (d.training_time_end || '').slice(0, 5) || '00:00';
                document.getElementById('approvedFormInstructor').value = d.instructor_name || '';
                document.getElementById('approvedFormApprovalOrg').value = d.approval_org || '';
                document.getElementById('approvedFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('approvedFormStatus').value = d.status || 'active';
                document.getElementById('approvedFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('approvedFormUrlPlan').value = d.url_plan || '';
                document.getElementById('approvedFormUrlDetailPlan').value = d.url_detail_plan || '';
            })
            .catch(function() { alert('조회 실패'); });
    }

    function submitForm(e) {
        e.preventDefault();
        var id = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';
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
        var btn = document.getElementById('approvedFormSubmit');
        if (btn) btn.disabled = true;
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(payload)
        })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (btn) btn.disabled = false;
                if (json.success) { window.location.href = '/admin/courses/approved'; return; }
                alert(json.error || '저장 실패');
            })
            .catch(function() {
                if (btn) btn.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
    }

    var planAttach = document.getElementById('approvedFormPlanAttach');
    if (planAttach) {
        planAttach.addEventListener('click', function() {
            alert('수업계획서 파일첨부는 추후 업로드 API 연동 후 사용 가능합니다.');
        });
    }

    var instructorAdd = document.getElementById('approvedFormInstructorAdd');
    if (instructorAdd) {
        instructorAdd.addEventListener('click', function() {
            var nameInput = document.getElementById('approvedFormInstructorNameQuick');
            var name = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
            if (!name) { alert('강사명을 입력하세요.'); return; }
            alert('간편등록된 강사는 인사 > 교직원관리에서 등록 후 여기 목록에 반영됩니다.');
        });
    }

    initTextbookDualList();
    initConsumableDualList();

    form.addEventListener('submit', submitForm);
    loadCategories().then(function() {
        loadPersonnel();
        if (editId) loadCourse(editId);
    });
})();
