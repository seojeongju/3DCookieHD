(function () {
    var form = document.getElementById('sessionsRegisterForm');
    if (!form) return;
    var formIdEl = document.getElementById('sessionsFormId');
    var editId = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';

    // --- 공강일(훈련 제외일) 상태 관리 ---
    var excludedDates = new Set(); // 'YYYY-MM-DD' 형식의 세트

    function renderExcludedDatesPreview() {
        var container = document.getElementById('sessionsExcludedDatesPreview');
        var hiddenInput = document.getElementById('sessionsFormExcludedDates');
        if (!container || !hiddenInput) return;

        var sorted = Array.from(excludedDates).sort();
        hiddenInput.value = sorted.join(',');

        if (sorted.length === 0) {
            container.innerHTML = '<span class="italic text-slate-400">중간 공강일이 없습니다.</span>';
            return;
        }

        container.innerHTML = sorted.map(function (d) {
            return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg font-bold">' +
                d + '<button type="button" class="text-rose-400 hover:text-rose-600 ml-1 btn-remove-excluded" data-date="' + d + '"><i class="fas fa-times"></i></button></span>';
        }).join('');

        container.querySelectorAll('.btn-remove-excluded').forEach(function (btn) {
            btn.addEventListener('click', function () {
                excludedDates.delete(btn.getAttribute('data-date'));
                renderExcludedDatesPreview();
                calculateTotalTrainingDays();
            });
        });
    }

    function loadApprovedCourses() {
        return fetch('/api/approved-courses?limit=500', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var reLt = new RegExp('<', 'g');
                var sel = document.getElementById('sessionsFormApprovedCourse');
                if (!sel) return;
                var list = Array.isArray(json.data) ? json.data : (json.data.list || json.data.items || []);
                sel.innerHTML = '<option value="">선택</option>' + list.map(function (c) {
                    var name = (c.name || '').replace(reLt, '&lt;');
                    return '<option value="' + c.id + '">' + name + '</option>';
                }).join('');
            })
            .catch(function (e) { console.error(e); });
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
            .then(function (r) { return r.json(); })
            .then(function (json) {
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
                if (!editId && c.instructor_name) {
                    setSelectedInstructors(c.instructor_name);
                }
            })
            .catch(function () { if (box) box.classList.add('hidden'); });
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
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    container.innerHTML = '<span class="text-slate-400">강사 목록을 불러올 수 없습니다. (직접 입력은 아래 없음)</span>';
                    return;
                }
                var rawList = Array.isArray(json.data) ? json.data : [];
                // 동일 이름 중복 제거 (배정값이 이름 문자열이라 체크박스가 이름당 1개여야 함)
                var seenNames = {};
                var list = [];
                rawList.forEach(function (instr) {
                    var key = String(instr.name || '').trim().toLowerCase();
                    if (!key || seenNames[key]) return;
                    seenNames[key] = true;
                    list.push(instr);
                });
                instructorListCache = list;
                var reLt = new RegExp('<', 'g');
                if (list.length === 0) {
                    container.innerHTML = '<span class="text-slate-400">등록된 강사가 없습니다.</span>';
                    return;
                }
                container.innerHTML = list.map(function (instr) {
                    var name = String(instr.name || '').trim().replace(reLt, '&lt;');
                    var idAttr = 'sessions-instructor-' + (instr.id || Math.random().toString(36).slice(2));
                    return '<label class="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-600"><input type="checkbox" class="sessions-instructor-cb rounded text-emerald-600" data-name="' + name.replace(/"/g, '&quot;') + '" id="' + idAttr + '"> ' + name + '</label>';
                }).join('');
            })
            .catch(function () {
                container.innerHTML = '<span class="text-slate-400">강사 목록을 불러올 수 없습니다.</span>';
            });
    }

    function getSelectedInstructorNames() {
        var names = [];
        document.querySelectorAll('.sessions-instructor-cb:checked').forEach(function (cb) {
            var n = cb.getAttribute('data-name');
            if (n) names.push(n);
        });
        return names.length ? names.join(', ') : null;
    }

    function setSelectedInstructors(commaSeparatedNames) {
        var set = {};
        (commaSeparatedNames || '').split(',').forEach(function (s) { var t = s.trim(); if (t) set[t] = true; });
        document.querySelectorAll('.sessions-instructor-cb').forEach(function (cb) {
            cb.checked = !!set[cb.getAttribute('data-name')];
        });
    }

    var facilitiesListCache = [];

    function loadFacilities() {
        var sel = document.getElementById('sessionsFormLocationSelect');
        if (!sel) return Promise.resolve();
        return fetch('/api/hrd/facilities', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var list = Array.isArray(json.data) ? json.data : [];
                facilitiesListCache = list;
                var reLt = new RegExp('<', 'g');
                var opts = list.map(function (f) {
                    var name = (f.name || '').replace(reLt, '&lt;');
                    return '<option value="' + name.replace(/"/g, '&quot;') + '">' + name + '</option>';
                }).join('');
                sel.innerHTML = '<option value="">등록된 훈련시설 선택 (또는 아래 직접 입력)</option>' + opts;
            })
            .catch(function (e) { console.error(e); });
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
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success && json.data && (json.data.url || json.data.publicUrl)) {
                    var url = json.data.url || json.data.publicUrl;
                    if (urlHidden) urlHidden.value = url;
                    if (infoSpan) infoSpan.textContent = file.name + ' (' + (file.size || 0) + ' Byte) 등록됨';
                } else {
                    alert(json.error || '업로드 실패');
                }
            })
            .catch(function () { alert('업로드 중 오류'); });
    }

    function loadSession(id) {
        return fetch('/api/course-sessions/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var d = json.data;
                var approvedSel = document.getElementById('sessionsFormApprovedCourse');
                if (approvedSel) approvedSel.value = d.approved_course_id != null ? d.approved_course_id : '';
                var numEl = document.getElementById('sessionsFormSessionNumber');
                if (numEl) numEl.value = d.session_number != null ? d.session_number : '';
                var sessionNameEl = document.getElementById('sessionsFormSessionName');
                if (sessionNameEl) sessionNameEl.value = (d.session_name || '').trim();
                var accessCodeEl = document.getElementById('sessionsFormAccessCode');
                if (accessCodeEl) accessCodeEl.value = (d.access_code || '').trim();
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
                document.querySelectorAll('input[name="sessionsTargetAudience"]').forEach(function (cb) {
                    cb.checked = (d.target_audience || '').split(',').map(function (s) { return s.trim(); }).indexOf(cb.value) >= 0;
                });
                document.querySelectorAll('input[name="sessionsDaysOfWeek"]').forEach(function (cb) {
                    cb.checked = (d.days_of_week || '').split(',').map(function (s) { return s.trim(); }).indexOf(cb.value) >= 0;
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

                // 공강일 로드
                excludedDates.clear();
                if (d.excluded_dates) {
                    d.excluded_dates.split(',').forEach(function (s) { if (s.trim()) excludedDates.add(s.trim()); });
                    renderExcludedDatesPreview();
                }

                setSessionCourseDetailContent(d.course_detail_description || '');
                if (formIdEl) formIdEl.value = id;
                if (id && approvedSel) approvedSel.disabled = true;
                // 회차는 개설·수정 모두 직접 설정 가능 (중복만 서버에서 검사)
                if (numEl) {
                    numEl.readOnly = false;
                    numEl.removeAttribute('readonly');
                }
                loadApprovedCourseDetail(d.approved_course_id).then(function () { updateSessionNamePreview(); });
                setTabPlanUrls(d.url_plan || null, d.url_detail_plan || null, id);
                calculateDailyHours();
                calculateTotalTrainingDays();
            })
            .catch(function () { alert('조회 실패'); });
    }

    function submitForm(e) {
        e.preventDefault();
        var id = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';
        var approvedCourseEl = document.getElementById('sessionsFormApprovedCourse');
        var approvedCourseId = approvedCourseEl ? approvedCourseEl.value : '';
        var sessionNumberEl = document.getElementById('sessionsFormSessionNumber');
        var sessionNumber = sessionNumberEl ? parseInt(sessionNumberEl.value, 10) : NaN;
        if (!approvedCourseId) { alert('승인받은 과정을 선택하세요.'); return; }
        if (isNaN(sessionNumber) || sessionNumber < 1) { alert('회차를 입력하세요 (1 이상).'); return; }
        var status = document.getElementById('sessionsFormStatus').value || 'recruiting';
        var instructorName = getSelectedInstructorNames();
        var targetAudience = [];
        document.querySelectorAll('input[name="sessionsTargetAudience"]:checked').forEach(function (cb) { targetAudience.push(cb.value); });
        var daysOfWeek = [];
        document.querySelectorAll('input[name="sessionsDaysOfWeek"]:checked').forEach(function (cb) { daysOfWeek.push(cb.value); });
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
        var accessCodeEl = document.getElementById('sessionsFormAccessCode');
        var accessCodeVal = (accessCodeEl && accessCodeEl.value) ? accessCodeEl.value.trim() : null;

        var url, method, payload;
        if (id) {
            url = '/api/course-sessions/' + id;
            method = 'PUT';
            payload = {
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
                session_name: sessionNameVal || null,
                access_code: accessCodeVal || null,
                excluded_dates: document.getElementById('sessionsFormExcludedDates').value || null
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
                session_name: sessionNameVal || null,
                access_code: accessCodeVal || null,
                excluded_dates: document.getElementById('sessionsFormExcludedDates').value || null
            };
        }
        var btn = document.getElementById('sessionsFormSubmit');
        if (btn) btn.disabled = true;
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(payload)
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (btn) btn.disabled = false;
                if (json.success) {
                    window.location.href = '/admin/courses/sessions';
                    return;
                }
                alert(json.error || '저장 실패');
            })
            .catch(function () {
                if (btn) btn.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
    }

    function getQueryParam(name) {
        var q = typeof window !== 'undefined' && window.location && window.location.search ? window.location.search.slice(1) : '';
        var params = {};
        q.split('&').forEach(function (pair) {
            var i = pair.indexOf('=');
            if (i >= 0) params[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent((pair.slice(i + 1) || '').replace(/\+/g, ' '));
        });
        return params[name] || '';
    }

    form.addEventListener('submit', submitForm);

    function suggestNextSessionNumber(approvedCourseId, force) {
        var numEl = document.getElementById('sessionsFormSessionNumber');
        if (!numEl || !approvedCourseId) return;
        // 이미 사용자가 입력한 값이 있으면 덮어쓰지 않음 (신규 개설 시 추천만)
        if (!force && String(numEl.value || '').trim() !== '') return;
        fetch('/api/course-sessions?approved_course_id=' + encodeURIComponent(approvedCourseId) + '&limit=500', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var list = Array.isArray(json.data) ? json.data : (json.data.list || []);
                var maxNum = 0;
                list.forEach(function (s) { if (s.session_number != null && s.session_number > maxNum) maxNum = s.session_number; });
                numEl.value = maxNum + 1;
                updateSessionNamePreview();
            })
            .catch(function () {
                if (!String(numEl.value || '').trim()) numEl.value = '1';
            });
    }

    var approvedSel = document.getElementById('sessionsFormApprovedCourse');
    if (approvedSel) approvedSel.addEventListener('change', function () {
        var cid = this.value || '';
        loadApprovedCourseDetail(cid);
        if (!editId && cid) suggestNextSessionNumber(cid, false);
    });
    var sessionNameInput = document.getElementById('sessionsFormSessionName');
    if (sessionNameInput) sessionNameInput.addEventListener('input', updateSessionNamePreview);
    if (sessionNameInput) sessionNameInput.addEventListener('change', updateSessionNamePreview);
    var sessionNumInput = document.getElementById('sessionsFormSessionNumber');
    if (sessionNumInput) sessionNumInput.addEventListener('input', updateSessionNamePreview);
    if (sessionNumInput) sessionNumInput.addEventListener('change', updateSessionNamePreview);

    var lunchNoneCb = document.getElementById('sessionsFormLunchNone');
    var lunchTimeWrap = document.getElementById('sessionsFormLunchTimeWrap');
    if (lunchNoneCb && lunchTimeWrap) {
        lunchNoneCb.addEventListener('change', function () {
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

    function calculateDailyHours() {
        var start = document.getElementById('sessionsFormTrainingTimeStart');
        var end = document.getElementById('sessionsFormTrainingTimeEnd');
        var lStart = document.getElementById('sessionsFormLunchTimeStart');
        var lEnd = document.getElementById('sessionsFormLunchTimeEnd');
        var preview = document.getElementById('sessionsDailyHoursPreview');
        if (!start || !end || !preview) return;

        var sVal = start.value;
        var eVal = end.value;
        if (!sVal || !eVal) {
            preview.textContent = '';
            return;
        }

        function toMinutes(t) {
            var p = t.split(':').map(Number);
            return p[0] * 60 + p[1];
        }

        var sMin = toMinutes(sVal);
        var eMin = toMinutes(eVal);
        if (eMin <= sMin) {
            preview.textContent = '(종료시간 오류)';
            return;
        }

        var total = eMin - sMin;

        var noLunch = document.getElementById('sessionsFormLunchNone').checked;
        if (!noLunch && lStart && lEnd && lStart.value && lEnd.value) {
            var lsMin = toMinutes(lStart.value);
            var leMin = toMinutes(lEnd.value);
            if (leMin > lsMin) {
                // Determine overlap with working hours
                var lunchStart = Math.max(sMin, lsMin);
                var lunchEnd = Math.min(eMin, leMin);
                if (lunchEnd > lunchStart) {
                    total -= (lunchEnd - lunchStart);
                }
            }
        }

        var h = Math.floor(total / 60);
        var m = total % 60;
        preview.textContent = '(일일 ' + h + '시간' + (m > 0 ? ' ' + m + '분' : '') + ')';

        // Also update total calculation Box if present
        calculateTotalTrainingDays();
    }

    ['sessionsFormTrainingTimeStart', 'sessionsFormTrainingTimeEnd', 'sessionsFormLunchTimeStart', 'sessionsFormLunchTimeEnd'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateDailyHours);
    });

    document.getElementById('sessionsFormLunchNone').addEventListener('change', calculateDailyHours);

    function parseLocalDate(s) {
        if (!s) return null;
        var p = s.split('-');
        if (p.length !== 3) return null;
        return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    }

    function calculateTotalTrainingDays() {
        var startInput = document.getElementById('sessionsFormTrainingStart');
        var endInput = document.getElementById('sessionsFormTrainingEnd');
        var resultBox = document.getElementById('sessionsCalculationResultBox');
        var calcDaysInput = document.getElementById('sessionsCalcTotalDays');
        var calcClassDaysInput = document.getElementById('sessionsCalcClassDays');
        if (!startInput || !endInput || !resultBox || !calcDaysInput || !calcClassDaysInput) return;

        var startVal = startInput.value;
        var endVal = endInput.value;
        var checkedDays = [];
        document.querySelectorAll('input[name="sessionsDaysOfWeek"]:checked').forEach(function (cb) {
            checkedDays.push(cb.value);
        });

        if (!startVal || !endVal || checkedDays.length === 0) {
            resultBox.classList.add('hidden');
            return;
        }

        var start = parseLocalDate(startVal);
        var end = parseLocalDate(endVal);

        if (end < start) {
            resultBox.classList.remove('hidden');
            calcDaysInput.value = '0';
            calcClassDaysInput.value = '종료일 오류';
            return;
        }

        var dayMap = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
        var targetDayNumbers = checkedDays.map(function (d) { return dayMap[d]; });

        var count = 0;
        var cur = new Date(start.getTime());
        var maxDays = 3650;
        var iterations = 0;
        while (cur <= end && iterations < maxDays) {
            var dateStr = cur.getFullYear() + '-' + String(cur.getMonth() + 1).padStart(2, '0') + '-' + String(cur.getDate()).padStart(2, '0');
            if (targetDayNumbers.indexOf(cur.getDay()) >= 0) {
                // 특정 요일에 해당할 때
                if (!excludedDates.has(dateStr)) {
                    // 공강일이 아닐 때만 카운트
                    count++;
                }
            } else {
                // 훈련 요일이 아닌데 공강일로 등록되어 있다면 제거 (정합성 유지)
                if (excludedDates.has(dateStr)) {
                    excludedDates.delete(dateStr);
                    setTimeout(renderExcludedDatesPreview, 0);
                }
            }
            cur.setDate(cur.getDate() + 1);
            iterations++;
        }

        calcDaysInput.value = count;
        calcClassDaysInput.value = startVal + ' ~ ' + endVal + ' (' + checkedDays.join(',') + ')';
        resultBox.classList.remove('hidden');

        // Update Total Hours if possible
        updateTotalSessionHours(count);
    }

    function updateTotalSessionHours(daysCount) {
        var dailyInfo = document.getElementById('sessionsDailyHoursPreview');
        if (!dailyInfo) return;
        var text = dailyInfo.textContent || '';
        // Extract hours and minutes from "(일일 H시간 M분)"
        var hMatch = text.match(/(\d+)시간/);
        var mMatch = text.match(/(\d+)분/);
        var hours = hMatch ? parseInt(hMatch[1], 10) : 0;
        var mins = mMatch ? parseInt(mMatch[1], 10) : 0;

        if ((hours > 0 || mins > 0) && daysCount > 0) {
            var totalMins = (hours * 60 + mins) * daysCount;
            var th = Math.floor(totalMins / 60);
            var tm = totalMins % 60;
            var totalStr = ' (총 ' + th + '시간' + (tm > 0 ? ' ' + tm + '분' : '') + ')';

            // Append to daily info or somewhere else? Let's add it to the daily info for visibility
            var baseText = text.replace(/ \(총 .*?\)/, '');
            dailyInfo.textContent = baseText + totalStr;
        }
    }

    var dateInputs = ['sessionsFormTrainingStart', 'sessionsFormTrainingEnd'];
    dateInputs.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateTotalTrainingDays);
    });

    document.querySelectorAll('input[name="sessionsDaysOfWeek"]').forEach(function (cb) {
        cb.addEventListener('change', calculateTotalTrainingDays);
    });


    document.querySelectorAll('.session-detail-tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.session-detail-tab').forEach(function (b) { b.classList.remove('active', 'border-emerald-600', 'bg-white', 'text-emerald-700'); b.classList.add('border-transparent', 'text-slate-500'); });
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
    if (mainSlideInput) mainSlideInput.addEventListener('change', function () {
        uploadSessionImage('sessionsFormMainSlideImage', 'sessionsFormMainSlideImageUrl', 'sessionsFormMainSlideImageInfo');
    });
    var courseListInput = document.getElementById('sessionsFormCourseListImage');
    if (courseListInput) courseListInput.addEventListener('change', function () {
        uploadSessionImage('sessionsFormCourseListImage', 'sessionsFormCourseListImageUrl', 'sessionsFormCourseListImageInfo');
    });

    // --- 멀티 이미지 업로드 로직 (교육사진 갤러리와 동일) ---
    function setupMultiImageUpload() {
        var dropZone = document.getElementById('multiImageDropZone');
        var input = document.getElementById('multiImageInput');
        if (!dropZone || !input) return;

        dropZone.addEventListener('click', function (e) {
            if (!e.target.closest('#multiImageThumbs')) input.click();
        });
        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault(); e.stopPropagation();
            dropZone.classList.add('border-emerald-400', 'bg-emerald-50');
        });
        dropZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            dropZone.classList.remove('border-emerald-400', 'bg-emerald-50');
        });
        dropZone.addEventListener('drop', function (e) {
            e.preventDefault(); e.stopPropagation();
            dropZone.classList.remove('border-emerald-400', 'bg-emerald-50');
            var files = e.dataTransfer && e.dataTransfer.files;
            if (files && files.length) handleMultiImageFiles(Array.from(files));
        });
        input.addEventListener('change', function () {
            var files = this.files;
            if (files && files.length) handleMultiImageFiles(Array.from(files));
            this.value = '';
        });
    }

    async function handleMultiImageFiles(files) {
        var imageFiles = files.filter(function (f) { return f.type.indexOf('image/') === 0; });
        if (imageFiles.length === 0) { alert('이미지 파일만 선택해 주세요.'); return; }

        var total = imageFiles.length;
        var progressEl = document.getElementById('multiImageProgress');
        var thumbsEl = document.getElementById('multiImageThumbs');
        progressEl.classList.remove('hidden');
        progressEl.textContent = '업로드 중 0 / ' + total + '...';
        thumbsEl.classList.remove('hidden');

        var editor = typeof tinymce !== 'undefined' ? tinymce.get('sessionsFormCourseDetailDescription') : null;

        for (var i = 0; i < imageFiles.length; i++) {
            progressEl.textContent = '업로드 중 ' + (i + 1) + ' / ' + total + '...';
            try {
                var url = await uploadResizedBoxImage(imageFiles[i]);
                var thumb = document.createElement('span');
                thumb.className = 'inline-block w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-100';
                thumb.innerHTML = '<img src="' + url + '" alt="" class="w-full h-full object-cover">';
                thumbsEl.appendChild(thumb);

                if (editor) {
                    editor.insertContent('<p><img src="' + url.replace(/"/g, '&quot;') + '" style="max-width:100%;height:auto"/></p>');
                }
            } catch (err) {
                console.error(err);
                progressEl.textContent = '업로드 중 ' + (i + 1) + '/' + total + ' - 오류: ' + (err.message || '실패');
            }
        }
        progressEl.textContent = total + '장 업로드 완료.';
    }

    async function uploadResizedBoxImage(blob) {
        var IMAGE_MAX = 1200;
        var IMAGE_QUALITY = 0.82;

        var resizedBlob = await new Promise((resolve, reject) => {
            var img = new Image();
            var url = URL.createObjectURL(blob);
            img.onload = function () {
                URL.revokeObjectURL(url);
                var w = img.naturalWidth, h = img.naturalHeight;
                if (w <= IMAGE_MAX && h <= IMAGE_MAX && blob.size < 200000) { resolve(blob); return; }
                var r = Math.min(IMAGE_MAX / w, IMAGE_MAX / h, 1);
                w = Math.round(w * r); h = Math.round(h * r);
                var canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                canvas.toBlob(function (b) { b ? resolve(b) : reject(new Error('Canvas toBlob failed')); }, 'image/jpeg', IMAGE_QUALITY);
            };
            img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
            img.src = url;
        });

        var file = new File([resizedBlob], 'session_detail_' + Date.now() + '.jpg', { type: 'image/jpeg' });
        var fd = new FormData();
        fd.append('file', file);
        fd.append('category', 'images');
        fd.append('folder', 'course-sessions/detail');

        var res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: fd
        });
        var json = await res.json();
        if (!json.success) throw new Error(json.error || '업로드 실패');
        return json.data.url || json.data.publicUrl || '';
    }

    function initSessionTinyMCE() {
        if (typeof tinymce === 'undefined') return;
        var el = document.getElementById('sessionsFormCourseDetailDescription');
        if (!el) return;
        if (tinymce.get('sessionsFormCourseDetailDescription')) return;
        tinymce.init({
            base_url: (typeof window !== 'undefined' && window.TINYMCE_BASE_URL) || 'https://cdn.jsdelivr.net/npm/tinymce@6.8.5',
            suffix: (typeof window !== 'undefined' && window.TINYMCE_SUFFIX) || '.min',
            selector: '#sessionsFormCourseDetailDescription',
            height: 480,
            menubar: false,
            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
            toolbar: 'undo redo | blocks | bold italic underline | fontfamily fontsize | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table code | help',
            content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }',
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            images_upload_handler: function (blobInfo, progress) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', '/api/upload');
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
                    xhr.upload.onprogress = function (e) {
                        progress(e.loaded / e.total * 100);
                    };
                    xhr.onload = function () {
                        if (xhr.status < 200 || xhr.status >= 300) {
                            reject('HTTP Error: ' + xhr.status);
                            return;
                        }
                        var json = JSON.parse(xhr.responseText);
                        if (!json || !json.success || !json.data || !json.data.url) {
                            reject('Invalid JSON: ' + xhr.responseText);
                            return;
                        }
                        // 반환된 URL을 resolve하여 에디터에 삽입
                        resolve(json.data.url);
                    };
                    xhr.onerror = function () {
                        reject('Image upload failed due to a network error.');
                    };
                    var formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    formData.append('category', 'images');
                    formData.append('folder', 'course-sessions/detail');
                    xhr.send(formData);
                });
            }
        });
    }

    // --- 달력 모달 로직 ---
    var calendarYear, calendarMonth;
    function openScheduleCalendar() {
        var startVal = document.getElementById('sessionsFormTrainingStart').value;
        if (!startVal) { alert('시작일을 먼저 선택하세요.'); return; }

        var date = parseLocalDate(startVal);
        calendarYear = date.getFullYear();
        calendarMonth = date.getMonth();

        renderCalendar();
        document.getElementById('scheduleCalendarModal').classList.remove('hidden');
    }

    function closeScheduleCalendar() {
        document.getElementById('scheduleCalendarModal').classList.add('hidden');
    }

    function renderCalendar() {
        var grid = document.getElementById('scheduleCalendarGrid');
        var title = document.getElementById('calendarMonthTitle');
        if (!grid || !title) return;

        title.textContent = calendarYear + '년 ' + (calendarMonth + 1) + '월';

        var firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        var daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

        var startInput = document.getElementById('sessionsFormTrainingStart').value;
        var endInput = document.getElementById('sessionsFormTrainingEnd').value;
        var start = parseLocalDate(startInput);
        var end = parseLocalDate(endInput);

        var checkedDays = [];
        document.querySelectorAll('input[name="sessionsDaysOfWeek"]:checked').forEach(function (cb) { checkedDays.push(cb.value); });
        var dayMap = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
        var targetDayNumbers = checkedDays.map(function (d) { return dayMap[d]; });

        var html = '';
        // Previous month empty spaces
        for (var i = 0; i < firstDay; i++) {
            html += '<div class="h-24 bg-slate-50/50 border-r border-b border-slate-100"></div>';
        }

        for (var d = 1; d <= daysInMonth; d++) {
            var cur = new Date(calendarYear, calendarMonth, d);
            var dateStr = cur.getFullYear() + '-' + String(cur.getMonth() + 1).padStart(2, '0') + '-' + String(cur.getDate()).padStart(2, '0');
            var isWeekend = cur.getDay() === 0 || cur.getDay() === 6;
            var isTrainingDay = targetDayNumbers.indexOf(cur.getDay()) >= 0;
            var inRange = start && end && cur >= start && cur <= end;
            var isExcluded = excludedDates.has(dateStr);

            var cellClass = "h-24 p-2 border-r border-b border-slate-100 transition-all cursor-pointer ";
            var bgColor = "bg-white hover:bg-slate-50";
            var textClass = isWeekend ? "text-rose-500" : "text-slate-700";

            if (!inRange) {
                bgColor = "bg-slate-50/50 opacity-40 cursor-not-allowed";
                textClass = "text-slate-400";
            } else if (isExcluded) {
                bgColor = "bg-rose-50 hover:bg-rose-100";
                textClass = "text-rose-600 font-bold saturate-150";
            } else if (isTrainingDay) {
                bgColor = "bg-emerald-50 hover:bg-emerald-100";
                textClass = "text-emerald-700 font-bold";
            }

            html += '<div class="' + cellClass + bgColor + '" onclick="window.toggleCalendarDate(\'' + dateStr + '\', ' + isTrainingDay + ', ' + inRange + ')">' +
                '<div class="flex justify-between items-start">' +
                '<span class="text-sm ' + textClass + '">' + d + '</span>' +
                (inRange ? (isExcluded ? '<span class="text-[9px] bg-rose-200 text-rose-700 px-1 rounded">공강</span>' : (isTrainingDay ? '<span class="text-[9px] bg-emerald-200 text-emerald-700 px-1 rounded">훈련</span>' : '')) : '') +
                '</div></div>';
        }

        // Next month empty spaces (to complete grid)
        var totalCells = firstDay + daysInMonth;
        var remaining = (7 - (totalCells % 7)) % 7;
        for (var i = 0; i < remaining; i++) {
            html += '<div class="h-24 bg-slate-50/50 border-r border-b border-slate-100"></div>';
        }

        grid.innerHTML = html;

        // Update counts in modal
        document.getElementById('calendarExcludedCount').textContent = excludedDates.size;
        // Total count in modal
        var startIn = document.getElementById('sessionsFormTrainingStart').value;
        var endIn = document.getElementById('sessionsFormTrainingEnd').value;
        if (startIn && endIn) {
            var s = parseLocalDate(startIn), e = parseLocalDate(endIn);
            var cnt = 0;
            var it = new Date(s.getTime());
            while (it <= e) {
                var ds = it.getFullYear() + '-' + String(it.getMonth() + 1).padStart(2, '0') + '-' + String(it.getDate()).padStart(2, '0');
                if (targetDayNumbers.indexOf(it.getDay()) >= 0 && !excludedDates.has(ds)) cnt++;
                it.setDate(it.getDate() + 1);
            }
            document.getElementById('calendarTotalCount').textContent = cnt;
        }
    }

    window.toggleCalendarDate = function (dateStr, isTrainingDay, inRange) {
        if (!inRange) return;
        if (!isTrainingDay) {
            alert('이 날은 훈련 요일이 아닙니다. 훈련 요일에 해당할 때만 공강으로 지정 가능합니다.');
            return;
        }

        if (excludedDates.has(dateStr)) {
            excludedDates.delete(dateStr);
        } else {
            excludedDates.add(dateStr);
        }
        renderCalendar();
        renderExcludedDatesPreview();
        calculateTotalTrainingDays();
    };

    document.getElementById('btnOpenScheduleCalendar').addEventListener('click', openScheduleCalendar);
    document.getElementById('btnCloseScheduleCalendar').addEventListener('click', closeScheduleCalendar);
    document.getElementById('btnApplySchedule').addEventListener('click', closeScheduleCalendar);
    document.getElementById('btnPrevMonth').addEventListener('click', function () {
        calendarMonth--;
        if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
        renderCalendar();
    });
    document.getElementById('btnNextMonth').addEventListener('click', function () {
        calendarMonth++;
        if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
        renderCalendar();
    });

    Promise.all([loadInstructors(), loadFacilities()]).then(function () {
        return loadApprovedCourses();
    }).then(function () {
        setupMultiImageUpload();
        setTimeout(function () { initSessionTinyMCE(); }, 150);
        if (editId) {
            loadSession(editId);
            return;
        }
        if (approvedCourseIdFromQuery) {
            var sel = document.getElementById('sessionsFormApprovedCourse');
            if (sel) sel.value = approvedCourseIdFromQuery;
            loadApprovedCourseDetail(approvedCourseIdFromQuery);
            suggestNextSessionNumber(approvedCourseIdFromQuery, false);
        }
    });

    // 시작일/종료일 변경 시 공강일 정합성 체크 유도
    ['sessionsFormTrainingStart', 'sessionsFormTrainingEnd'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', function () {
            calculateTotalTrainingDays(); // 여기서 내부적으로 요일이 안 맞으면 삭제함
        });
    });
    document.querySelectorAll('input[name="sessionsDaysOfWeek"]').forEach(function (cb) {
        cb.addEventListener('change', function () {
            calculateTotalTrainingDays(); // 여기서 정합성 체크
        });
    });
})();
