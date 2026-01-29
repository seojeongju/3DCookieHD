(function() {
    var form = document.getElementById('approvedRegisterForm');
    if (!form) return;
    var formIdEl = document.getElementById('approvedFormId');
    var editId = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';

    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var reLt = new RegExp('<', 'g');
                var sel = document.getElementById('approvedFormCategory');
                if (sel) sel.innerHTML = '<option value="">선택</option>' + json.data.map(function(c) { return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>'; }).join('');
            })
            .catch(function(e) { console.error(e); });
    }

    function loadCourse(id) {
        return fetch('/api/approved-courses/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var d = json.data;
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

    form.addEventListener('submit', submitForm);
    loadCategories().then(function() {
        if (editId) loadCourse(editId);
    });
})();
