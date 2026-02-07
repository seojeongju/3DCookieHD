(function() {
    var form = document.getElementById('sessionsRegisterForm');
    if (!form) return;
    var formIdEl = document.getElementById('sessionsFormId');
    var editId = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';

    function loadApprovedCourses() {
        return fetch('/api/approved-courses?limit=500', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var reLt = new RegExp('<', 'g');
                var sel = document.getElementById('sessionsFormApprovedCourse');
                if (!sel) return;
                var list = Array.isArray(json.data) ? json.data : (json.data.list || json.data.items || []);
                sel.innerHTML = '<option value="">선택</option>' + list.map(function(c) {
                    var name = (c.name || '').replace(reLt, '&lt;');
                    return '<option value="' + c.id + '">' + name + '</option>';
                }).join('');
            })
            .catch(function(e) { console.error(e); });
    }

    function loadSession(id) {
        return fetch('/api/course-sessions/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var d = json.data;
                var approvedSel = document.getElementById('sessionsFormApprovedCourse');
                if (approvedSel) approvedSel.value = d.approved_course_id != null ? d.approved_course_id : '';
                var numEl = document.getElementById('sessionsFormSessionNumber');
                if (numEl) numEl.value = d.session_number != null ? d.session_number : '';
                document.getElementById('sessionsFormStatus').value = d.status || 'recruiting';
                document.getElementById('sessionsFormTrainingStart').value = (d.training_start_date || '').slice(0, 10);
                document.getElementById('sessionsFormTrainingEnd').value = (d.training_end_date || '').slice(0, 10);
                document.getElementById('sessionsFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('sessionsFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('sessionsFormUrlPlan').value = d.url_plan || '';
                document.getElementById('sessionsFormUrlDetailPlan').value = d.url_detail_plan || '';
                if (editId && approvedSel) approvedSel.disabled = true;
                if (editId && numEl) numEl.readOnly = true;
            })
            .catch(function() { alert('조회 실패'); });
    }

    function submitForm(e) {
        e.preventDefault();
        var id = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';
        var approvedCourseEl = document.getElementById('sessionsFormApprovedCourse');
        var approvedCourseId = approvedCourseEl ? approvedCourseEl.value : '';
        var sessionNumberEl = document.getElementById('sessionsFormSessionNumber');
        var sessionNumber = sessionNumberEl ? parseInt(sessionNumberEl.value, 10) : NaN;
        if (!id) {
            if (!approvedCourseId) { alert('승인받은 과정을 선택하세요.'); return; }
            if (isNaN(sessionNumber) || sessionNumber < 1) { alert('회차를 입력하세요 (1 이상).'); return; }
        }
        var status = document.getElementById('sessionsFormStatus').value || 'recruiting';
        var trainingStart = (document.getElementById('sessionsFormTrainingStart').value || '').trim() || null;
        var trainingEnd = (document.getElementById('sessionsFormTrainingEnd').value || '').trim() || null;
        var registeredAt = (document.getElementById('sessionsFormRegisteredAt').value || '').trim() || null;
        var urlNcs = (document.getElementById('sessionsFormUrlNcs').value || '').trim() || null;
        var urlPlan = (document.getElementById('sessionsFormUrlPlan').value || '').trim() || null;
        var urlDetailPlan = (document.getElementById('sessionsFormUrlDetailPlan').value || '').trim() || null;

        var url, method, payload;
        if (id) {
            url = '/api/course-sessions/' + id;
            method = 'PUT';
            payload = {
                status: status,
                training_start_date: trainingStart,
                training_end_date: trainingEnd,
                registered_at: registeredAt,
                url_ncs: urlNcs,
                url_plan: urlPlan,
                url_detail_plan: urlDetailPlan
            };
        } else {
            url = '/api/course-sessions';
            method = 'POST';
            payload = {
                approved_course_id: parseInt(approvedCourseId, 10),
                session_number: sessionNumber,
                status: status,
                training_start_date: trainingStart,
                training_end_date: trainingEnd,
                registered_at: registeredAt,
                url_ncs: urlNcs,
                url_plan: urlPlan,
                url_detail_plan: urlDetailPlan
            };
        }
        var btn = document.getElementById('sessionsFormSubmit');
        if (btn) btn.disabled = true;
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(payload)
        })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (btn) btn.disabled = false;
                if (json.success) {
                    window.location.href = '/admin/courses/sessions';
                    return;
                }
                alert(json.error || '저장 실패');
            })
            .catch(function() {
                if (btn) btn.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
    }

    function getQueryParam(name) {
        var q = typeof window !== 'undefined' && window.location && window.location.search ? window.location.search.slice(1) : '';
        var params = {};
        q.split('&').forEach(function(pair) {
            var i = pair.indexOf('=');
            if (i >= 0) params[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent((pair.slice(i + 1) || '').replace(/\+/g, ' '));
        });
        return params[name] || '';
    }

    form.addEventListener('submit', submitForm);
    var approvedCourseIdFromQuery = getQueryParam('approvedCourseId');
    loadApprovedCourses().then(function() {
        if (editId) {
            loadSession(editId);
            return;
        }
        if (approvedCourseIdFromQuery) {
            var sel = document.getElementById('sessionsFormApprovedCourse');
            if (sel) sel.value = approvedCourseIdFromQuery;
            var numEl = document.getElementById('sessionsFormSessionNumber');
            if (numEl) {
                fetch('/api/course-sessions?approved_course_id=' + encodeURIComponent(approvedCourseIdFromQuery) + '&limit=500', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        if (!json.success || !json.data) return;
                        var list = Array.isArray(json.data) ? json.data : (json.data.list || []);
                        var maxNum = 0;
                        list.forEach(function(s) { if (s.session_number != null && s.session_number > maxNum) maxNum = s.session_number; });
                        numEl.value = maxNum + 1;
                    })
                    .catch(function() { numEl.value = numEl.value || '1'; });
            }
        }
    });
})();
