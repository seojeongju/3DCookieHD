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
            var ncsLinkWrap = document.getElementById('sessionsNcsRegisterLinkWrap');
            if (ncsLinkWrap) ncsLinkWrap.classList.add('hidden');
            setTabPlanUrls(null, null, editId);
            return Promise.resolve();
        }
        return fetch('/api/approved-courses/' + courseId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var c = json.data;
                function toTimeOnly(s) {
                    if (!s) return '';
                    s = String(s).trim();
                    if (/^\d{1,2}:\d{2}$/.test(s)) return s;
                    var idx = s.indexOf(' ');
                    if (idx >= 0) s = s.slice(idx + 1);
                    if (/^\d{1,2}:\d{2}/.test(s)) return s.slice(0, 5);
                    return s;
                }
                var nameEl2 = document.getElementById('sessionsDetailCourseName');
                if (nameEl2) nameEl2.textContent = c.name || '';
                var parts = [];
                if (c.category_name) parts.push(c.category_name);
                if (c.total_hours != null) parts.push('총 ' + c.total_hours + '시간');
                if (c.capacity != null) parts.push('모집 ' + c.capacity + '명');
                if (c.total_cost != null && c.total_cost !== 0) parts.push('훈련비 ' + Number(c.total_cost).toLocaleString() + '원');
                var startT = toTimeOnly(c.training_time_start);
                var endT = toTimeOnly(c.training_time_end);
                if (startT && endT) parts.push('훈련 ' + startT + '~' + endT);
                var summaryEl = document.getElementById('sessionsCourseSummaryLine');
                if (summaryEl) summaryEl.textContent = parts.length ? parts.join(' · ') : '—';
                var planText = document.getElementById('sessionsDetailPlanText');
                if (planText) planText.innerHTML = c.url_plan ? '<a href="' + (c.url_plan || '').replace(/"/g, '&quot;') + '" target="_blank" class="text-emerald-600 hover:underline">등록됨 (클릭하여 열기)</a>' : '등록된 수업계획서가 없습니다.';
                var approvedLink = document.getElementById('sessionsApprovedCourseLink');
                if (approvedLink) { approvedLink.href = '/admin/courses/approved/register?id=' + courseId + '&tab=ncs'; }
                var ncsLinkWrap = document.getElementById('sessionsNcsRegisterLinkWrap');
                var ncsLink = document.getElementById('sessionsNcsRegisterLink');
                if (ncsLink) ncsLink.href = '/admin/courses/approved/register?id=' + courseId + '&tab=ncs';
                if (ncsLinkWrap) ncsLinkWrap.classList.remove('hidden');
                if (nameEl) nameEl.innerHTML = '과정명 : <span class="font-medium text-slate-800">' + (c.name || '').replace(/</g, '&lt;') + '</span>';
                if (box) box.classList.remove('hidden');
                setTabPlanUrls(c.url_plan || null, c.url_detail_plan || null, editId);
                updateSessionNamePreview();
            })
            .catch(function() { if (box) box.classList.add('hidden'); });
    }

    function updateSessionNamePreview() {
        var courseEl = document.getElementById('sessionsDetailCourseName');
        var courseName = courseEl ? (courseEl.textContent || '').trim() : '';
        var sessionNumEl = document.getElementById('sessionsFormSessionNumber');
        var sessionNum = (sessionNumEl && sessionNumEl.value) ? sessionNumEl.value.trim() : '';
        var sessionNameEl = document.getElementById('sessionsFormSessionName');
        var sessionPart = (sessionNameEl && sessionNameEl.value) ? sessionNameEl.value.trim() : '';
        var previewEl = document.getElementById('sessionsFormSessionNamePreview');
        if (!previewEl) return;
        var parts = [courseName];
        if (sessionNum) parts.push(sessionNum + '회차');
        if (sessionPart) parts.push(sessionPart);
        var full = parts.filter(Boolean).join(' + ');
        previewEl.textContent = full ? '미리보기: ' + full : '';
    }

    function setTabPlanUrls(urlPlan, urlDetailPlan, sessionId) {
        var aPlan = document.getElementById('sessionsTabUrlPlan');
        var aDetail = document.getElementById('sessionsTabUrlDetailPlan');
        var planHref = (sessionId ? '/admin/courses/sessions/' + sessionId + '/syllabus' : null) || urlPlan || '#';
        var planActive = !!(sessionId || urlPlan);
        if (aPlan) {
            aPlan.href = planHref;
            aPlan.style.pointerEvents = planActive ? 'auto' : 'none';
            aPlan.classList.toggle('opacity-50', !planActive);
            if (sessionId) aPlan.removeAttribute('target'); else aPlan.setAttribute('target', '_blank');
        }
        if (aDetail) { aDetail.href = urlDetailPlan || '#'; aDetail.style.pointerEvents = urlDetailPlan ? 'auto' : 'none'; aDetail.classList.toggle('opacity-50', !urlDetailPlan); }
    }

    var instructorListCache = [];

    function loadInstructors() {
        var container = document.getElementById('sessionsFormInstructorList');
        if (!container) return Promise.resolve();
        return fetch('/api/ncs/approved/instructors', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) {
                    container.innerHTML = '<span class="text-slate-400">강사 목록을 불러올 수 없습니다. (직접 입력은 아래 없음)</span>';
                    return;
                }
                var list = Array.isArray(json.data) ? json.data : [];
                instructorListCache = list;
                var reLt = new RegExp('<', 'g');
                if (list.length === 0) {
                    container.innerHTML = '<span class="text-slate-400">등록된 강사가 없습니다.</span>';
                    return;
                }
                container.innerHTML = list.map(function(instr) {
                    var name = (instr.name || '').replace(reLt, '&lt;');
                    var idAttr = 'sessions-instructor-' + (instr.id || Math.random().toString(36).slice(2));
                    return '<label class="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-600"><input type="checkbox" class="sessions-instructor-cb rounded text-emerald-600" data-name="' + name.replace(/"/g, '&quot;') + '" id="' + idAttr + '"> ' + name + '</label>';
                }).join('');
            })
            .catch(function() {
                container.innerHTML = '<span class="text-slate-400">강사 목록을 불러올 수 없습니다.</span>';
            });
    }

    function getSelectedInstructorNames() {
        var names = [];
        document.querySelectorAll('.sessions-instructor-cb:checked').forEach(function(cb) {
            var n = cb.getAttribute('data-name');
            if (n) names.push(n);
        });
        return names.length ? names.join(', ') : null;
    }

    function setSelectedInstructors(commaSeparatedNames) {
        var set = {};
        (commaSeparatedNames || '').split(',').forEach(function(s) { var t = s.trim(); if (t) set[t] = true; });
        document.querySelectorAll('.sessions-instructor-cb').forEach(function(cb) {
            cb.checked = !!set[cb.getAttribute('data-name')];
        });
    }

    var facilitiesListCache = [];

    function loadFacilities() {
        var sel = document.getElementById('sessionsFormLocationSelect');
        if (!sel) return Promise.resolve();
        return fetch('/api/hrd/facilities', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) return;
                var list = Array.isArray(json.data) ? json.data : [];
                facilitiesListCache = list;
                var reLt = new RegExp('<', 'g');
                var opts = list.map(function(f) {
                    var name = (f.name || '').replace(reLt, '&lt;');
                    return '<option value="' + name.replace(/"/g, '&quot;') + '">' + name + '</option>';
                }).join('');
                sel.innerHTML = '<option value="">등록된 훈련시설 선택 (또는 아래 직접 입력)</option>' + opts;
            })
            .catch(function(e) { console.error(e); });
    }

    function setLocationFromSelect() {
        var sel = document.getElementById('sessionsFormLocationSelect');
        var input = document.getElementById('sessionsFormLocation');
        if (sel && input && sel.value) input.value = sel.value;
    }

    function setLocationSelectFromValue(value) {
        var sel = document.getElementById('sessionsFormLocationSelect');
        if (!sel) return;
        var v = (value || '').trim();
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === v) {
                sel.selectedIndex = i;
                return;
            }
        }
        sel.selectedIndex = 0;
    }

    function setSessionCourseDetailContent(html) {
        if (typeof tinymce !== 'undefined' && tinymce.get('sessionsFormCourseDetailDescription')) {
            tinymce.get('sessionsFormCourseDetailDescription').setContent(html || '');
        } else {
            var el = document.getElementById('sessionsFormCourseDetailDescription');
            if (el) el.value = html || '';
        }
    }

    function getSessionCourseDetailContent() {
        if (typeof tinymce !== 'undefined' && tinymce.get('sessionsFormCourseDetailDescription')) {
            tinymce.triggerSave();
            return tinymce.get('sessionsFormCourseDetailDescription').getContent() || '';
        }
        var el = document.getElementById('sessionsFormCourseDetailDescription');
        return (el && el.value) ? el.value : '';
    }

    function uploadSessionImage(fileInputId, urlHiddenId, infoSpanId) {
        var fileInput = document.getElementById(fileInputId);
        var urlHidden = document.getElementById(urlHiddenId);
        var infoSpan = document.getElementById(infoSpanId);
        if (!fileInput || !fileInput.files || !fileInput.files[0]) return Promise.resolve();
        var file = fileInput.files[0];
        var fd = new FormData();
        fd.append('file', file);
        fd.append('category', 'images');
        fd.append('folder', 'course-sessions');
        return fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: fd
        })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (json.success && json.data && (json.data.url || json.data.publicUrl)) {
                    var url = json.data.url || json.data.publicUrl;
                    if (urlHidden) urlHidden.value = url;
                    if (infoSpan) infoSpan.textContent = file.name + ' (' + (file.size || 0) + ' Byte) 등록됨';
                } else {
                    alert(json.error || '업로드 실패');
                }
            })
            .catch(function() { alert('업로드 중 오류'); });
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
                var sessionNameEl = document.getElementById('sessionsFormSessionName');
                if (sessionNameEl) sessionNameEl.value = (d.session_name || '').trim();
                document.getElementById('sessionsFormStatus').value = d.status || 'recruiting';
                setSelectedInstructors(d.instructor_name || '');
                document.getElementById('sessionsFormTrainingStart').value = (d.training_start_date || '').slice(0, 10);
                document.getElementById('sessionsFormTrainingEnd').value = (d.training_end_date || '').slice(0, 10);
                function toTimeHHMM(s) {
                    if (!s) return '';
                    s = String(s).trim();
                    if (/^\d{1,2}:\d{2}$/.test(s)) return s;
                    if (/^\d{1,2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 5);
                    var idx = s.indexOf(' ');
                    if (idx >= 0) s = s.slice(idx + 1);
                    return /^\d{1,2}:\d{2}/.test(s) ? s.slice(0, 5) : '';
                }
                var ttStart = document.getElementById('sessionsFormTrainingTimeStart');
                var ttEnd = document.getElementById('sessionsFormTrainingTimeEnd');
                var ltStart = document.getElementById('sessionsFormLunchTimeStart');
                var ltEnd = document.getElementById('sessionsFormLunchTimeEnd');
                if (ttStart) ttStart.value = toTimeHHMM(d.training_time_start) || '';
                if (ttEnd) ttEnd.value = toTimeHHMM(d.training_time_end) || '';
                var lunchStartVal = toTimeHHMM(d.lunch_time_start) || '';
                var lunchEndVal = toTimeHHMM(d.lunch_time_end) || '';
                if (ltStart) ltStart.value = lunchStartVal || '12:00';
                if (ltEnd) ltEnd.value = lunchEndVal || '13:00';
                var lunchNoneEl = document.getElementById('sessionsFormLunchNone');
                var lunchWrap = document.getElementById('sessionsFormLunchTimeWrap');
                if (lunchNoneEl && lunchWrap) {
                    var noLunch = !lunchStartVal && !lunchEndVal;
                    lunchNoneEl.checked = noLunch;
                    lunchWrap.classList.toggle('hidden', noLunch);
                }
                document.getElementById('sessionsFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                var locationEl = document.getElementById('sessionsFormLocation');
                if (locationEl) locationEl.value = d.location || '';
                setLocationSelectFromValue(d.location || '');
                document.querySelectorAll('input[name="sessionsTargetAudience"]').forEach(function(cb) {
                    cb.checked = (d.target_audience || '').split(',').map(function(s) { return s.trim(); }).indexOf(cb.value) >= 0;
                });
                document.querySelectorAll('input[name="sessionsDaysOfWeek"]').forEach(function(cb) {
                    cb.checked = (d.days_of_week || '').split(',').map(function(s) { return s.trim(); }).indexOf(cb.value) >= 0;
                });
                var recruitmentSel = document.getElementById('sessionsFormRecruitmentStatus');
                if (recruitmentSel) recruitmentSel.value = d.recruitment_status || 'normal';
                var repExpose = document.querySelector('input[name="sessionsFormRepImageExposure"][value="' + (d.representative_image_exposure || 'expose') + '"]');
                if (repExpose) repExpose.checked = true;
                var graceEl = document.getElementById('sessionsFormRecruitmentGracePeriod');
                if (graceEl) graceEl.value = d.recruitment_grace_period != null ? d.recruitment_grace_period : '0';
                var syllExpose = document.querySelector('input[name="sessionsFormSyllabusExposure"][value="' + (d.syllabus_exposure || 'hide') + '"]');
                if (syllExpose) syllExpose.checked = true;
                var homepageExposedVal = d.homepage_exposed === 1 || d.homepage_exposed === true ? '1' : '0';
                var homepageExposedRadio = document.querySelector('input[name="sessionsFormHomepageExposed"][value="' + homepageExposedVal + '"]');
                if (homepageExposedRadio) homepageExposedRadio.checked = true;
                var mainUrlEl = document.getElementById('sessionsFormMainSlideImageUrl');
                if (mainUrlEl) mainUrlEl.value = d.main_slide_image_url || '';
                var mainInfo = document.getElementById('sessionsFormMainSlideImageInfo');
                if (mainInfo) mainInfo.textContent = d.main_slide_image_url ? '등록됨' : '';
                var listUrlEl = document.getElementById('sessionsFormCourseListImageUrl');
                if (listUrlEl) listUrlEl.value = d.course_list_image_url || '';
                var listInfo = document.getElementById('sessionsFormCourseListImageInfo');
                if (listInfo) listInfo.textContent = d.course_list_image_url ? '등록됨' : '';
                setSessionCourseDetailContent(d.course_detail_description || '');
                if (formIdEl) formIdEl.value = id;
                if (id && approvedSel) approvedSel.disabled = true;
                if (id && numEl) numEl.readOnly = true;
                loadApprovedCourseDetail(d.approved_course_id).then(function() { updateSessionNamePreview(); });
                setTabPlanUrls(d.url_plan || null, d.url_detail_plan || null, id);
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
        var instructorName = getSelectedInstructorNames();
        var targetAudience = [];
        document.querySelectorAll('input[name="sessionsTargetAudience"]:checked').forEach(function(cb) { targetAudience.push(cb.value); });
        var daysOfWeek = [];
        document.querySelectorAll('input[name="sessionsDaysOfWeek"]:checked').forEach(function(cb) { daysOfWeek.push(cb.value); });
        var locationEl = document.getElementById('sessionsFormLocation');
        var locationVal = (locationEl && locationEl.value ? locationEl.value : '').trim() || null;
        var trainingStart = (document.getElementById('sessionsFormTrainingStart').value || '').trim() || null;
        var trainingEnd = (document.getElementById('sessionsFormTrainingEnd').value || '').trim() || null;
        var trainingTimeStartEl = document.getElementById('sessionsFormTrainingTimeStart');
        var trainingTimeEndEl = document.getElementById('sessionsFormTrainingTimeEnd');
        var lunchTimeStartEl = document.getElementById('sessionsFormLunchTimeStart');
        var lunchTimeEndEl = document.getElementById('sessionsFormLunchTimeEnd');
        var lunchNoneEl = document.getElementById('sessionsFormLunchNone');
        var trainingTimeStart = (trainingTimeStartEl && trainingTimeStartEl.value ? trainingTimeStartEl.value : '').trim() || null;
        var trainingTimeEnd = (trainingTimeEndEl && trainingTimeEndEl.value ? trainingTimeEndEl.value : '').trim() || null;
        var noLunch = lunchNoneEl && lunchNoneEl.checked;
        var lunchTimeStart = noLunch ? null : ((lunchTimeStartEl && lunchTimeStartEl.value ? lunchTimeStartEl.value : '').trim() || null);
        var lunchTimeEnd = noLunch ? null : ((lunchTimeEndEl && lunchTimeEndEl.value ? lunchTimeEndEl.value : '').trim() || null);
        var registeredAt = (document.getElementById('sessionsFormRegisteredAt').value || '').trim() || null;
        var recruitmentStatus = (document.getElementById('sessionsFormRecruitmentStatus') && document.getElementById('sessionsFormRecruitmentStatus').value) || 'normal';
        var repExposeEl = document.querySelector('input[name="sessionsFormRepImageExposure"]:checked');
        var representativeImageExposure = repExposeEl ? repExposeEl.value : 'expose';
        var graceEl = document.getElementById('sessionsFormRecruitmentGracePeriod');
        var recruitmentGracePeriod = graceEl ? (parseInt(graceEl.value, 10) || 0) : 0;
        var syllExposeEl = document.querySelector('input[name="sessionsFormSyllabusExposure"]:checked');
        var syllabusExposure = syllExposeEl ? syllExposeEl.value : 'hide';
        var homepageExposedEl = document.querySelector('input[name="sessionsFormHomepageExposed"]:checked');
        var homepageExposed = homepageExposedEl && homepageExposedEl.value === '1' ? 1 : 0;
        var mainSlideUrl = (document.getElementById('sessionsFormMainSlideImageUrl') && document.getElementById('sessionsFormMainSlideImageUrl').value) || '';
        var courseListUrl = (document.getElementById('sessionsFormCourseListImageUrl') && document.getElementById('sessionsFormCourseListImageUrl').value) || '';
        var courseDetailDescription = getSessionCourseDetailContent();
        var sessionNameElForPayload = document.getElementById('sessionsFormSessionName');
        var sessionNameVal = (sessionNameElForPayload && sessionNameElForPayload.value) ? sessionNameElForPayload.value.trim() : null;

        var url, method, payload;
        if (id) {
            url = '/api/course-sessions/' + id;
            method = 'PUT';
            payload = {
                status: status,
                instructor_name: instructorName,
                target_audience: targetAudience.length ? targetAudience : null,
                days_of_week: daysOfWeek.length ? daysOfWeek : null,
                location: locationVal,
                training_start_date: trainingStart,
                training_end_date: trainingEnd,
                training_time_start: trainingTimeStart,
                training_time_end: trainingTimeEnd,
                lunch_time_start: lunchTimeStart,
                lunch_time_end: lunchTimeEnd,
                registered_at: registeredAt,
                homepage_exposed: homepageExposed,
                recruitment_status: recruitmentStatus,
                representative_image_exposure: representativeImageExposure,
                recruitment_grace_period: recruitmentGracePeriod,
                syllabus_exposure: syllabusExposure,
                main_slide_image_url: mainSlideUrl || null,
                course_list_image_url: courseListUrl || null,
                course_detail_description: courseDetailDescription || null,
                session_name: sessionNameVal || null
            };
        } else {
            url = '/api/course-sessions';
            method = 'POST';
            payload = {
                approved_course_id: parseInt(approvedCourseId, 10),
                session_number: sessionNumber,
                status: status,
                instructor_name: instructorName,
                target_audience: targetAudience.length ? targetAudience : null,
                days_of_week: daysOfWeek.length ? daysOfWeek : null,
                location: locationVal,
                training_start_date: trainingStart,
                training_end_date: trainingEnd,
                training_time_start: trainingTimeStart,
                training_time_end: trainingTimeEnd,
                lunch_time_start: lunchTimeStart,
                lunch_time_end: lunchTimeEnd,
                registered_at: registeredAt,
                homepage_exposed: homepageExposed,
                recruitment_status: recruitmentStatus,
                representative_image_exposure: representativeImageExposure,
                recruitment_grace_period: recruitmentGracePeriod,
                syllabus_exposure: syllabusExposure,
                main_slide_image_url: mainSlideUrl || null,
                course_list_image_url: courseListUrl || null,
                course_detail_description: courseDetailDescription || null,
                session_name: sessionNameVal || null
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
    var sessionNameInput = document.getElementById('sessionsFormSessionName');
    if (sessionNameInput) sessionNameInput.addEventListener('input', updateSessionNamePreview);
    if (sessionNameInput) sessionNameInput.addEventListener('change', updateSessionNamePreview);
    var sessionNumInput = document.getElementById('sessionsFormSessionNumber');
    if (sessionNumInput) sessionNumInput.addEventListener('input', updateSessionNamePreview);
    if (sessionNumInput) sessionNumInput.addEventListener('change', updateSessionNamePreview);

    var lunchNoneCb = document.getElementById('sessionsFormLunchNone');
    var lunchTimeWrap = document.getElementById('sessionsFormLunchTimeWrap');
    if (lunchNoneCb && lunchTimeWrap) {
        lunchNoneCb.addEventListener('change', function() {
            var noLunch = lunchNoneCb.checked;
            lunchTimeWrap.classList.toggle('hidden', noLunch);
            if (noLunch) {
                var ltStart = document.getElementById('sessionsFormLunchTimeStart');
                var ltEnd = document.getElementById('sessionsFormLunchTimeEnd');
                if (ltStart) ltStart.value = '';
                if (ltEnd) ltEnd.value = '';
            } else {
                var ltStart = document.getElementById('sessionsFormLunchTimeStart');
                var ltEnd = document.getElementById('sessionsFormLunchTimeEnd');
                if (ltStart && !ltStart.value) ltStart.value = '12:00';
                if (ltEnd && !ltEnd.value) ltEnd.value = '13:00';
            }
        });
    }

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
    var locationSelectEl = document.getElementById('sessionsFormLocationSelect');
    if (locationSelectEl) locationSelectEl.addEventListener('change', setLocationFromSelect);

    var mainSlideInput = document.getElementById('sessionsFormMainSlideImage');
    if (mainSlideInput) mainSlideInput.addEventListener('change', function() {
        uploadSessionImage('sessionsFormMainSlideImage', 'sessionsFormMainSlideImageUrl', 'sessionsFormMainSlideImageInfo');
    });
    var courseListInput = document.getElementById('sessionsFormCourseListImage');
    if (courseListInput) courseListInput.addEventListener('change', function() {
        uploadSessionImage('sessionsFormCourseListImage', 'sessionsFormCourseListImageUrl', 'sessionsFormCourseListImageInfo');
    });

    function initSessionTinyMCE() {
        if (typeof tinymce === 'undefined') return;
        var el = document.getElementById('sessionsFormCourseDetailDescription');
        if (!el) return;
        if (tinymce.get('sessionsFormCourseDetailDescription')) return;
        tinymce.init({
            selector: '#sessionsFormCourseDetailDescription',
            height: 320,
            menubar: false,
            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
            toolbar: 'undo redo | blocks | bold italic underline | fontfamily fontsize | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table code | help',
            content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }'
        });
    }

    Promise.all([loadInstructors(), loadFacilities()]).then(function() {
        return loadApprovedCourses();
    }).then(function() {
        setTimeout(function() { initSessionTinyMCE(); }, 150);
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
