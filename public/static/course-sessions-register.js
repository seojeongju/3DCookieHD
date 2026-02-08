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

    function loadApprovedCourseDetail(courseId) {
        var box = document.getElementById('sessionsCourseDetailBox');
        var nameEl = document.getElementById('sessionsPageCourseName');
        if (!courseId) {
            if (box) box.classList.add('hidden');
            if (nameEl) nameEl.innerHTML = '과정명 : <span class="text-slate-400">승인 과정을 선택하세요</span>';
            setTabPlanUrls(null, null);
            return Promise.resolve();
        }
        return fetch('/api/approved-courses/' + courseId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var c = json.data;
                function set(id, val) { var el = document.getElementById(id); if (el) el.value = val != null ? String(val) : ''; }
                function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val != null ? String(val) : ''; }
                set('sessionsDetailCourseName', c.name);
                set('sessionsDetailCategory', c.category_name || '');
                set('sessionsDetailHourlyRate', c.hourly_rate != null ? c.hourly_rate : '0');
                set('sessionsDetailTotalDays', c.total_days != null ? c.total_days : '');
                set('sessionsDetailTotalCost', c.total_cost != null ? c.total_cost : '0');
                set('sessionsDetailCapacity', c.capacity != null ? c.capacity : '');
                set('sessionsDetailTotalHours', c.total_hours != null ? c.total_hours : '');
                set('sessionsDetailDailyHours', c.daily_hours != null ? c.daily_hours : '');
                set('sessionsDetailGovSubsidy', c.gov_subsidy != null ? c.gov_subsidy : '0');
                var planText = document.getElementById('sessionsDetailPlanText');
                if (planText) planText.innerHTML = c.url_plan ? '<a href="' + (c.url_plan || '').replace(/"/g, '&quot;') + '" target="_blank" class="text-primary-600 hover:underline">등록됨 (클릭하여 열기)</a>' : '등록된 수업계획서가 없습니다.';
                function toTimeOnly(s) {
                    if (!s) return '';
                    s = String(s).trim();
                    if (/^\d{1,2}:\d{2}$/.test(s)) return s;
                    var idx = s.indexOf(' ');
                    if (idx >= 0) s = s.slice(idx + 1);
                    if (/^\d{1,2}:\d{2}/.test(s)) return s.slice(0, 5);
                    return s;
                }
                set('sessionsDetailTrainingStart', toTimeOnly(c.training_time_start));
                set('sessionsDetailTrainingEnd', toTimeOnly(c.training_time_end));
                if (box) box.classList.remove('hidden');
                if (nameEl) nameEl.innerHTML = '과정명 : <span class="font-medium text-slate-800">' + (c.name || '').replace(/</g, '&lt;') + '</span>';
                setTabPlanUrls(c.url_plan || null, c.url_detail_plan || null);
            })
            .catch(function() { if (box) box.classList.add('hidden'); });
    }

    function setTabPlanUrls(urlPlan, urlDetailPlan) {
        var aPlan = document.getElementById('sessionsTabUrlPlan');
        var aDetail = document.getElementById('sessionsTabUrlDetailPlan');
        if (aPlan) { aPlan.href = urlPlan || '#'; aPlan.style.pointerEvents = urlPlan ? 'auto' : 'none'; aPlan.classList.toggle('opacity-50', !urlPlan); }
        if (aDetail) { aDetail.href = urlDetailPlan || '#'; aDetail.style.pointerEvents = urlDetailPlan ? 'auto' : 'none'; aDetail.classList.toggle('opacity-50', !urlDetailPlan); }
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
                var instructorEl = document.getElementById('sessionsFormInstructor');
                if (instructorEl) instructorEl.value = d.instructor_name || '';
                document.getElementById('sessionsFormTrainingStart').value = (d.training_start_date || '').slice(0, 10);
                document.getElementById('sessionsFormTrainingEnd').value = (d.training_end_date || '').slice(0, 10);
                document.getElementById('sessionsFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('sessionsFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('sessionsFormUrlPlan').value = d.url_plan || '';
                document.getElementById('sessionsFormUrlDetailPlan').value = d.url_detail_plan || '';
                if (editId && approvedSel) approvedSel.disabled = true;
                if (editId && numEl) numEl.readOnly = true;
                loadApprovedCourseDetail(d.approved_course_id);
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
        var instructorEl = document.getElementById('sessionsFormInstructor');
        var instructorName = (instructorEl && instructorEl.value ? instructorEl.value : '').trim() || null;
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
                instructor_name: instructorName,
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
                instructor_name: instructorName,
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

    var approvedSel = document.getElementById('sessionsFormApprovedCourse');
    if (approvedSel) approvedSel.addEventListener('change', function() { loadApprovedCourseDetail(this.value || ''); });

    document.querySelectorAll('.session-detail-tab').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.session-detail-tab').forEach(function(b) { b.classList.remove('active', 'border-emerald-600', 'bg-white', 'text-emerald-700'); b.classList.add('border-transparent', 'text-slate-500'); });
            btn.classList.add('active', 'border-emerald-600', 'bg-white', 'text-emerald-700');
            btn.classList.remove('border-transparent', 'text-slate-500');
            var ncsContent = document.getElementById('sessionsTabContentNcs');
            if (ncsContent) ncsContent.classList.toggle('hidden', tab !== 'ncs');
        });
    });

    var approvedCourseIdFromQuery = getQueryParam('approvedCourseId');
    loadApprovedCourses().then(function() {
        if (editId) {
            loadSession(editId);
            return;
        }
        if (approvedCourseIdFromQuery) {
            var sel = document.getElementById('sessionsFormApprovedCourse');
            if (sel) sel.value = approvedCourseIdFromQuery;
            loadApprovedCourseDetail(approvedCourseIdFromQuery);
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
