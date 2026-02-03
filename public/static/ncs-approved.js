(function () {
    var step = window.NCS_APPROVED_STEP || 1;
    // 임베디드 모드 체크
    var isEmbedded = !!window.NCS_EMBED_COURSE_ID;
    if (isEmbedded) {
        step = window.NCS_CURRENT_STEP || 1;
    }

    var trainingCache = [];

    // 임베디드 모드에서 등록 ID를 찾아서 주입하는 함수
    function ensureRegistrationId() {
        if (!isEmbedded || !window.NCS_EMBED_COURSE_ID) return Promise.resolve();
        // 이미 ID가 있는 경우 (HTML에 박혀있는 경우) 건너뜀
        var editInput = document.getElementById('ncsApprovedEditId') ||
            document.getElementById('ncsApprovedRegId') ||
            document.getElementById('ncsApprovedRegIdStep3') ||
            document.getElementById('ncsApprovedRegIdStep4') ||
            document.getElementById('ncsApprovedRegIdStep5') ||
            document.getElementById('ncsApprovedRegIdStep6');
        if (editInput && editInput.value) return Promise.resolve();

        var token = localStorage.getItem('token');
        return fetch('/api/ncs/approved/registrations/find-by-course/' + window.NCS_EMBED_COURSE_ID, {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success && json.data && json.data.id) {
                    var newId = json.data.id;
                    ['ncsApprovedEditId', 'ncsApprovedRegId', 'ncsApprovedRegIdStep3', 'ncsApprovedRegIdStep4', 'ncsApprovedRegIdStep5', 'ncsApprovedRegIdStep6'].forEach(function (id) {
                        var el = document.getElementById(id);
                        if (el) el.value = newId;
                    });
                }
            })
            .catch(function (e) { console.error('ensureRegistrationId failed', e); });
    }

    function initStep1() {
        var tabNcsOnly = document.getElementById('tabNcsOnly');
        var tabNonNcs = document.getElementById('tabNonNcs');
        var panelNcsOnly = document.getElementById('panelNcsOnly');
        var panelNonNcs = document.getElementById('panelNonNcs');
        var editInput = document.getElementById('ncsApprovedEditId');
        var unitCodeInput = document.getElementById('ncsUnitCode');
        var unitNameInput = document.getElementById('ncsUnitName');
        if (!tabNcsOnly || !panelNcsOnly) return;

        var editId = (editInput && editInput.value) ? editInput.value.trim() : '';

        function showNcs() {
            tabNcsOnly.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
            tabNcsOnly.classList.remove('text-slate-500');
            tabNonNcs.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
            tabNonNcs.classList.add('text-slate-500');
            panelNcsOnly.classList.remove('hidden');
            if (panelNonNcs) panelNonNcs.classList.add('hidden');
        }
        function showNonNcs() {
            tabNonNcs.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
            tabNonNcs.classList.remove('text-slate-500');
            tabNcsOnly.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
            tabNcsOnly.classList.add('text-slate-500');
            if (panelNonNcs) panelNonNcs.classList.remove('hidden');
            panelNcsOnly.classList.add('hidden');
        }

        tabNcsOnly.addEventListener('click', showNcs);
        if (tabNonNcs) tabNonNcs.addEventListener('click', showNonNcs);

        var devCategory = document.getElementById('ncsDevCategory');
        var largeClass = document.getElementById('ncsLargeClass');
        var midClass = document.getElementById('ncsMidClass');
        var smallClass = document.getElementById('ncsSmallClass');
        var jobRadioGroup = document.getElementById('ncsJobRadioGroup');
        var jobRadioPlaceholder = document.getElementById('ncsJobRadioPlaceholder');
        var selectedJobsResult = document.getElementById('ncsSelectedJobsResult');
        var selectedJobsPlaceholder = document.getElementById('ncsSelectedJobsPlaceholder');
        var trainingLevelEl = document.getElementById('ncsTrainingLevel');
        var bannerJobSearchLocked = document.getElementById('ncsBannerJobSearchLocked');
        var jobSearchSection = document.getElementById('ncsJobSearchSection');
        var btnDeleteDisabled = document.getElementById('ncsApprovedBtnDeleteDisabled');
        var btnDelete = document.getElementById('ncsApprovedBtnDelete');

        if (!largeClass) return;

        var selectedJobsStore = [];

        var largeClassesFallback = [
            { code: '01', name: '사업관리' }, { code: '02', name: '경영·회계·사무' }, { code: '03', name: '금융·보험' },
            { code: '04', name: '교육' }, { code: '05', name: '법무·보안' }, { code: '06', name: '보건·의료' },
            { code: '07', name: '사회복지·종교' }, { code: '08', name: '문화·예술·디자인·방송' }, { code: '09', name: '운송·물류' },
            { code: '10', name: '영업·판매·고객관리' }, { code: '11', name: '숙박·여행·오락·스포츠' }, { code: '12', name: '음식·조리' },
            { code: '13', name: '건설' }, { code: '14', name: '부동산·임대' }, { code: '15', name: '기계' },
            { code: '16', name: '금속·재료' }, { code: '17', name: '화학' }, { code: '18', name: '섬유·의복' },
            { code: '19', name: '전기·전자' }, { code: '20', name: '정보통신' }, { code: '21', name: '식품가공' },
            { code: '22', name: '인쇄·목재·가구·공예' }, { code: '23', name: '환경·에너지·안전' }, { code: '24', name: '농림·어업' }
        ];

        function fillLargeClass(list) {
            var opts = ['<option value="">선택</option>'];
            (list || []).forEach(function (it) {
                var c = (it.code || '').replace(/"/g, '&quot;');
                var n = (it.name || '').replace(/</g, '&lt;');
                opts.push('<option value="' + c + '">' + (c ? c + '. ' : '') + n + '</option>');
            });
            largeClass.innerHTML = opts.join('');
        }

        function loadLargeClasses() {
            largeClass.innerHTML = '<option value="">로딩 중...</option>';
            var token = localStorage.getItem('token');
            return fetch('/api/ncs/approved/large-classes', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (json.success && Array.isArray(json.data) && json.data.length) fillLargeClass(json.data);
                    else fillLargeClass(largeClassesFallback);
                })
                .catch(function () { fillLargeClass(largeClassesFallback); });
        }

        function clearSelect(sel) {
            if (!sel) return;
            sel.innerHTML = '<option value="">선택</option>';
        }
        function clearUnitHidden() {
            if (unitCodeInput) unitCodeInput.value = '';
            if (unitNameInput) unitNameInput.value = '';
        }
        function loadJobRadios() {
            if (!jobRadioGroup || !jobRadioPlaceholder) return;
            clearUnitHidden();
            var large = largeClass ? largeClass.value : '';
            var mid = midClass ? midClass.value : '';
            var small = smallClass ? smallClass.value : '';
            jobRadioPlaceholder.style.display = '';
            var wrap = jobRadioGroup.querySelector('.ncs-job-radio-wrap');
            if (wrap) wrap.remove();
            if (!mid || !small || !trainingCache.length) {
                jobRadioPlaceholder.textContent = '소분류 선택 후 직종을 선택하세요. 여러 직종을 선택할 수 있습니다. 능력단위·수준은 2단계 훈련이수체계도에서 선택합니다.';
                updateSelectedJobsResult();
                return;
            }
            var list = trainingCache.filter(function (item) { return item.midCode === mid && item.smallCode === small; });
            var jobByCode8 = {};
            list.forEach(function (item) {
                var raw = (item.unitCode || '').trim();
                var code8 = raw ? (raw.split('_')[0] || raw).slice(0, 8) : '';
                if (!code8) return;
                if (!jobByCode8[code8]) {
                    jobByCode8[code8] = {
                        code: code8,
                        name: (item.subClassName || item.unitName || item.smallName || '').trim()
                    };
                }
            });
            var jobs = Object.keys(jobByCode8).sort().map(function (k) { return jobByCode8[k]; });
            if (jobs.length === 0) {
                jobRadioPlaceholder.textContent = '이 소분류에 해당하는 직종이 없습니다.';
                updateSelectedJobsResult();
                return;
            }
            jobRadioPlaceholder.style.display = 'none';
            var w = document.createElement('div');
            w.className = 'ncs-job-radio-wrap space-y-2';
            jobs.forEach(function (j) {
                var esc = function (s) { var t = document.createElement('span'); t.textContent = s == null ? '' : s; return t.innerHTML; };
                var id = 'ncsJob_' + (j.code || '').replace(/\s/g, '_');
                var isInStore = selectedJobsStore.some(function (x) { return (x.code || '') === (j.code || ''); });
                w.innerHTML += '<label class="flex items-center gap-2 cursor-pointer py-1.5"><input type="checkbox" name="ncsJobCheck" class="ncs-job-check rounded text-blue-600" value="' + esc(j.code) + '" data-name="' + esc(j.name) + '" id="' + id + '"' + (isInStore ? ' checked' : '') + '> <span>주직종 ' + esc(j.code) + (j.name ? '. ' + j.name : '') + '</span></label>';
            });
            jobRadioGroup.appendChild(w);
            w.querySelectorAll('.ncs-job-check').forEach(function (cb) {
                cb.addEventListener('change', function () {
                    var code = (cb.value || '').trim();
                    var name = (cb.getAttribute('data-name') || '').trim();
                    if (cb.checked) {
                        if (!selectedJobsStore.some(function (x) { return (x.code || '') === code; })) {
                            selectedJobsStore.push({ code: code, name: name });
                        }
                    } else {
                        selectedJobsStore = selectedJobsStore.filter(function (x) { return (x.code || '') !== code; });
                    }
                    updateSelectedJobsResult();
                });
            });
            updateSelectedJobsResult();
        }

        function updateSelectedJobsResult() {
            if (!selectedJobsResult || !selectedJobsPlaceholder) return;
            var wrap = selectedJobsResult.querySelector('.ncs-selected-jobs-list');
            if (wrap) wrap.remove();
            selectedJobsPlaceholder.style.display = selectedJobsStore.length ? 'none' : '';
            selectedJobsPlaceholder.textContent = '왼쪽에서 직종을 선택하세요';
            if (selectedJobsStore.length === 0) return;
            var listEl = document.createElement('div');
            listEl.className = 'ncs-selected-jobs-list space-y-1';
            selectedJobsStore.forEach(function (it) {
                var line = document.createElement('div');
                line.className = 'flex items-center gap-2 text-slate-800 group';
                var icon = document.createElement('i');
                icon.className = 'fas fa-check text-blue-600 text-xs w-4 shrink-0';
                var span = document.createElement('span');
                span.className = 'flex-1 min-w-0';
                span.textContent = '주직종 ' + (it.code || '') + (it.name ? '. ' + it.name : '');
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ncs-selected-job-remove shrink-0 p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-300';
                btn.setAttribute('title', '선택 해제');
                btn.setAttribute('data-code', it.code || '');
                var btnIcon = document.createElement('i');
                btnIcon.className = 'fas fa-times text-xs';
                btn.appendChild(btnIcon);
                line.appendChild(icon);
                line.appendChild(span);
                line.appendChild(btn);
                listEl.appendChild(line);
            });
            selectedJobsResult.appendChild(listEl);
            listEl.querySelectorAll('.ncs-selected-job-remove').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var code = (btn.getAttribute('data-code') || '').trim();
                    selectedJobsStore = selectedJobsStore.filter(function (x) { return (x.code || '') !== code; });
                    var cbs = jobRadioGroup ? jobRadioGroup.querySelectorAll('.ncs-job-check') : [];
                    for (var i = 0; i < cbs.length; i++) { if (cbs[i].value === code) { cbs[i].checked = false; break; } }
                    updateSelectedJobsResult();
                });
            });
        }

        var apiMessageEl = document.getElementById('ncsTrainingApiMessage');
        function showTrainingApiMessage(text, isError) {
            if (!apiMessageEl) return;
            apiMessageEl.textContent = text || '';
            apiMessageEl.className = 'mt-2 text-sm ' + (isError ? 'text-red-600' : 'text-amber-600');
            if (text) apiMessageEl.classList.remove('hidden'); else apiMessageEl.classList.add('hidden');
        }
        function loadTrainingByLarge() {
            var code = largeClass.value;
            clearUnitHidden();
            showTrainingApiMessage('');
            if (!code) {
                trainingCache = [];
                clearSelect(midClass);
                clearSelect(smallClass);
                loadJobRadios();
                return Promise.resolve();
            }
            var url = '/api/ncs/approved/training?ncsLclasCd=' + encodeURIComponent(code);
            var token = localStorage.getItem('token');
            return fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json().catch(function () { return { success: false, error: '응답 파싱 실패' }; }); })
                .then(function (json) {
                    if (!json.success) {
                        trainingCache = [];
                        clearSelect(midClass);
                        clearSelect(smallClass);
                        loadJobRadios();
                        showTrainingApiMessage(json.error || '공공 API 조회 실패. 인증키 및 서비스 상태를 확인하세요.', true);
                        return;
                    }
                    var data = json.data || [];
                    if (data.length === 0 && json._meta && json._meta.hint) {
                        showTrainingApiMessage(json._meta.hint, false);
                    } else if (data.length > 0) {
                        showTrainingApiMessage('');
                    }
                    trainingCache = data;
                    var seen = {};
                    var mids = [];
                    trainingCache.forEach(function (item) {
                        var k = (item.midCode || '') + '|' + (item.midName || '');
                        if (!seen[k]) {
                            seen[k] = true;
                            mids.push({ code: item.midCode || '', name: item.midName || '' });
                        }
                    });
                    mids.sort(function (a, b) { return (a.code || '').localeCompare(b.code || '', 'ko'); });
                    var opts = ['<option value="">선택</option>'];
                    mids.forEach(function (m) {
                        opts.push('<option value="' + (m.code || '').replace(/"/g, '&quot;') + '">' + (m.code ? m.code + '. ' : '') + (m.name || '').replace(/</g, '&lt;') + '</option>');
                    });
                    midClass.innerHTML = opts.join('');
                    clearSelect(smallClass);
                    loadJobRadios();
                })
                .catch(function () {
                    trainingCache = [];
                    clearSelect(midClass);
                    clearSelect(smallClass);
                    loadJobRadios();
                    showTrainingApiMessage('공공 API 연결 실패. 네트워크 또는 서버 상태를 확인하세요.', true);
                });
        }

        function loadSmallByMid() {
            var mid = midClass.value;
            clearUnitHidden();
            if (!mid) {
                clearSelect(smallClass);
                loadJobRadios();
                return;
            }
            var list = trainingCache.filter(function (item) { return item.midCode === mid; });
            var seen = {};
            var smalls = [];
            list.forEach(function (item) {
                var k = (item.smallCode || '') + '|' + (item.smallName || '');
                if (!seen[k]) {
                    seen[k] = true;
                    smalls.push({ code: item.smallCode || '', name: item.smallName || '' });
                }
            });
            smalls.sort(function (a, b) { return (a.code || '').localeCompare(b.code || '', 'ko'); });
            var opts = ['<option value="">선택</option>'];
            smalls.forEach(function (s) {
                var sc = (s.code || '').replace(/"/g, '&quot;');
                var sn = (s.name || '').replace(/</g, '&lt;');
                opts.push('<option value="' + sc + '" data-name="' + sn.replace(/"/g, '&quot;') + '">' + (s.code ? s.code + '. ' : '') + sn + '</option>');
            });
            smallClass.innerHTML = opts.join('');
            loadJobRadios();
        }

        largeClass.addEventListener('change', loadTrainingByLarge);
        midClass.addEventListener('change', loadSmallByMid);
        smallClass.addEventListener('change', loadJobRadios);

        function buildPayload() {
            var ncsTab = panelNonNcs && panelNonNcs.classList.contains('hidden') ? 'ncs' : 'non_ncs';
            var courseTypeEl = document.querySelector('input[name="courseType"]:checked');
            var courseType = courseTypeEl ? courseTypeEl.value : '';
            var courseNameEl = document.getElementById('ncsCourseName');
            var prereqEl = document.getElementById('ncsPrereqSkill');
            var large = largeClass ? largeClass.value : '';
            var mid = midClass ? midClass.value : '';
            var small = smallClass ? smallClass.value : '';
            var mainJobs = [];
            if (selectedJobsStore && selectedJobsStore.length) {
                mainJobs = selectedJobsStore.map(function (j) { return { code: j.code || '', name: j.name || '' }; });
            } else if (jobRadioGroup) {
                jobRadioGroup.querySelectorAll('.ncs-job-check:checked').forEach(function (cb) {
                    var code = (cb.value || '').trim();
                    var name = (cb.getAttribute('data-name') || '').trim();
                    if (code || name) mainJobs.push({ code: code, name: name });
                });
            }
            var approvedCourseIdEl = document.getElementById('ncsApprovedCourseId');
            var approvedCourseId = approvedCourseIdEl ? approvedCourseIdEl.value : null;

            var payload = {
                approved_course_id: approvedCourseId,
                ncs_tab: ncsTab,
                course_type: courseType || null,
                main_jobs: mainJobs.length ? mainJobs : undefined,
                overview_content: (document.getElementById('ncsOverviewContent') && document.getElementById('ncsOverviewContent').value) ? document.getElementById('ncsOverviewContent').value.trim() : null,
                dev_category: (document.getElementById('ncsDevCategory') && document.getElementById('ncsDevCategory').value) ? document.getElementById('ncsDevCategory').value.trim() : null,
                large_code: large || null,
                mid_code: mid || null,
                small_code: small || null,
                unit_code: null,
                unit_name: null,
                non_ncs_course_name: (document.getElementById('nonNcsCourseName') && document.getElementById('nonNcsCourseName').value) ? document.getElementById('nonNcsCourseName').value.trim() : null,
                non_ncs_overview: (document.getElementById('nonNcsOverview') && document.getElementById('nonNcsOverview').value) ? document.getElementById('nonNcsOverview').value.trim() : null,
                course_name: (courseNameEl && courseNameEl.value) ? courseNameEl.value.trim() : null,
                training_level: (trainingLevelEl && trainingLevelEl.value) ? trainingLevelEl.value.trim() : null,
                prereq_skill: (prereqEl && prereqEl.value) ? prereqEl.value.trim() : null
            };
            return payload;
        }


        function doSave(redirectToStep2) {
            // Force strict check for embedded mode
            // Allow embedded mode if we are in Key Admin Pages (like course register) even if they start with /admin/
            var isRealEmbedded = isEmbedded && (!window.location.pathname.startsWith('/admin/') || window.location.pathname.indexOf('/courses/approved/register') !== -1);
            console.log('doSave executing. Redirect:', redirectToStep2, 'isEmbedded(global):', isEmbedded, 'isRealEmbedded:', isRealEmbedded);

            var btnSave = document.getElementById('ncsApprovedBtnSave');
            var btnNext = document.getElementById('ncsApprovedBtnNext');

            try {
                var payload = buildPayload();
                console.log('Payload built:', payload);

                var url = editId ? '/api/ncs/approved/registrations/' + editId : '/api/ncs/approved/registrations';
                var method = editId ? 'PUT' : 'POST';
                var token = localStorage.getItem('token');

                if (btnSave) btnSave.disabled = true;
                if (btnNext) btnNext.disabled = true;

                fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
                    body: JSON.stringify(payload)
                })
                    .then(function (r) { return r.json(); })
                    .then(function (json) {
                        console.log('Save response received:', json);
                        if (btnSave) btnSave.disabled = false;
                        if (btnNext) btnNext.disabled = false;

                        if (json.success) {
                            var responseId = json.data && json.data.id;
                            var idToUse = editId || responseId;

                            console.log('ID Resolution - editId:', editId, 'responseId:', responseId, 'idToUse:', idToUse);

                            if (redirectToStep2) {
                                if (isRealEmbedded) {
                                    if (window.loadNcsStep) window.loadNcsStep(2);
                                } else {
                                    var targetUrl = idToUse ? '/admin/ncs/approved/2?id=' + idToUse : '/admin/ncs/approved/list';
                                    console.log('Attempting navigation to Step 2:', targetUrl);
                                    window.location.href = targetUrl;
                                }
                            } else {
                                if (isRealEmbedded) {
                                    alert('저장되었습니다.');
                                    if (window.loadNcsStep) window.loadNcsStep(1);
                                } else {
                                    if (responseId && !editId) {
                                        // New registration, reload to apply context
                                        var targetUrl = '/admin/ncs/approved/1?id=' + responseId;
                                        console.log('New registration created. Reloading Step 1 context:', targetUrl);
                                        window.location.href = targetUrl;
                                        return;
                                    }
                                    alert('저장되었습니다.');
                                }
                            }
                            return;
                        }
                        console.error('Save reported failure:', json.error);
                        alert(json.error || '저장 실패');
                    })
                    .catch(function (e) {
                        console.error('Save fetch exception:', e);
                        if (btnSave) btnSave.disabled = false;
                        if (btnNext) btnNext.disabled = false;
                        alert('저장 중 오류가 발생했습니다: ' + e);
                    });
            } catch (e) {
                console.error('doSave setup exception:', e);
                if (btnSave) btnSave.disabled = false;
                if (btnNext) btnNext.disabled = false;
                alert('처리 중 오류가 발생했습니다: ' + e.message);
            }
        }

        function doDelete() {
            if (!editId || !confirm('이 과정개요를 삭제하시겠습니까?')) return;
            var token = localStorage.getItem('token');
            var btn = document.getElementById('ncsApprovedBtnDelete');
            if (btn) btn.disabled = true;
            fetch('/api/ncs/approved/registrations/' + editId, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + (token || '') }
            })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (btn) btn.disabled = false;
                    if (json.success) {
                        if (isEmbedded) {
                            alert('삭제되었습니다.');
                            if (window.loadNcsStep) window.loadNcsStep(1);
                        } else {
                            window.location.href = '/admin/ncs/approved/list';
                        }
                        return;
                    }
                    alert(json.error || '삭제 실패');
                })
                .catch(function () {
                    if (btn) btn.disabled = false;
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }

        var saveBtn = document.getElementById('ncsApprovedBtnSave');
        if (saveBtn) {
            // Remove old potential listeners by cloning or just reassigning onclick
            // Re-querying ensures we have the element, setting onclick overrides previous
            saveBtn.onclick = function () { doSave(false); };
        }

        var nextBtn = document.getElementById('ncsApprovedBtnNext');
        if (nextBtn) {
            nextBtn.onclick = function () { doSave(true); };
        }

        var delBtn = document.getElementById('ncsApprovedBtnDelete');
        if (delBtn) delBtn.onclick = doDelete;

        function setRegDate(val) {
            var el = document.getElementById('ncsRegDate');
            if (el) el.value = val || '';
        }

        function fillFormFromApprovedCourse(data) {
            var name = (data.name || '').trim();
            var regDate = (data.registered_at || data.created_at || '').toString().slice(0, 10);
            var cn = document.getElementById('ncsCourseName');
            var nn = document.getElementById('nonNcsCourseName');
            var hid = document.getElementById('ncsApprovedCourseId');
            if (cn) cn.value = name;
            if (nn) nn.value = name;
            setRegDate(regDate);
            if (hid) hid.value = data.id != null ? data.id : '';
            var container = document.getElementById('ncsApprovedCourseListContainer');
            if (container) {
                var items = container.querySelectorAll('.ncs-approved-course-item');
                items.forEach(function (el) { el.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50'); });
                var selected = container.querySelector('[data-approved-id="' + (data.id || '') + '"]');
                if (selected) selected.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
            }
            var firstForm = document.getElementById('ncsDevCategory') || document.getElementById('ncsCourseName');
            if (firstForm) firstForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function loadApprovedCoursesList() {
            var container = document.getElementById('ncsApprovedCourseListContainer');
            if (!container) return;
            var token = localStorage.getItem('token');
            fetch('/api/approved-courses?limit=50', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !Array.isArray(json.data)) {
                        var msg = json.error || '목록 로드 실패';
                        container.innerHTML = '<div class="py-4 text-center text-red-500 text-sm">승인받은 과정 목록을 불러올 수 없습니다: ' + msg + '</div>';
                        return;
                    }
                    var list = json.data;
                    if (list.length === 0) {
                        container.innerHTML = '<div class="py-4 text-center text-slate-500 text-sm">등록된 승인받은 과정이 없습니다. <a href="/admin/courses/approved/register" class="text-blue-600 hover:underline">교육과정 기초데이터에서 등록</a> 후 이용하세요.</div>';
                        return;
                    }
                    function esc(s) { var t = document.createElement('span'); t.textContent = s == null ? '' : s; return t.innerHTML; }
                    container.innerHTML = list.map(function (row) {
                        var id = row.id;
                        var name = esc(row.name || '-');
                        var cat = esc(row.category_name || '');
                        var reg = (row.registered_at || row.created_at || '').toString().slice(0, 10);
                        return '<button type="button" class="ncs-approved-course-item w-full text-left px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition flex flex-wrap items-center gap-2" data-approved-id="' + (id || '') + '">' +
                            '<span class="font-medium text-slate-800">' + name + '</span>' +
                            (cat ? '<span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">' + cat + '</span>' : '') +
                            (reg ? '<span class="text-xs text-slate-400">' + reg + '</span>' : '') +
                            '</button>';
                    }).join('');
                    container.querySelectorAll('.ncs-approved-course-item').forEach(function (btn) {
                        btn.addEventListener('click', function () {
                            var id = btn.getAttribute('data-approved-id');
                            if (!id) return;
                            fetch('/api/approved-courses/' + id, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                                .then(function (r) { return r.json(); })
                                .then(function (res) {
                                    if (res.success && res.data) fillFormFromApprovedCourse(res.data);
                                    else alert(res.error || '과정 정보를 불러올 수 없습니다.');
                                })
                                .catch(function () { alert('과정 정보를 불러오는 중 오류가 발생했습니다.'); });
                        });
                    });
                })
                .catch(function (e) {
                    console.error(e);
                    container.innerHTML = '<div class="py-4 text-center text-red-500 text-sm">목록을 불러오는 중 오류가 발생했습니다. (' + String(e) + ')</div>';
                });
        }

        function loadForEdit() {
            if (!editId) return;
            var token = localStorage.getItem('token');
            fetch('/api/ncs/approved/registrations/' + editId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !json.data) {
                        alert('조회 실패');
                        return;
                    }
                    var d = json.data;
                    if (d.ncs_tab === 'non_ncs') {
                        showNonNcs();
                        var n = document.getElementById('nonNcsCourseName');
                        var o = document.getElementById('nonNcsOverview');
                        if (n) n.value = d.non_ncs_course_name || '';
                        if (o) o.value = d.non_ncs_overview || '';
                        setRegDate((d.created_at || '').slice(0, 10));
                        return;
                    }
                    showNcs();
                    var ct = document.querySelector('input[name="courseType"][value="' + (d.course_type || '향상') + '"]');
                    if (ct) ct.checked = true;
                    var ov = document.getElementById('ncsOverviewContent');
                    if (ov) ov.value = d.overview_content || '';
                    var dev = document.getElementById('ncsDevCategory');
                    if (dev) dev.value = d.dev_category || '';
                    var cn = document.getElementById('ncsCourseName');
                    if (cn) cn.value = d.course_name || '';
                    var ps = document.getElementById('ncsPrereqSkill');
                    if (ps) ps.value = d.prereq_skill || '';
                    if (trainingLevelEl) trainingLevelEl.value = d.training_level || '';
                    var acid = document.getElementById('ncsApprovedCourseId');
                    if (acid) acid.value = d.approved_course_id || '';
                    setRegDate((d.created_at || '').slice(0, 10));
                    var hasTrainingSystem = !!(d.selected_training_elements_json && String(d.selected_training_elements_json).trim() && String(d.selected_training_elements_json).trim() !== '[]');
                    if (bannerJobSearchLocked) bannerJobSearchLocked.classList.toggle('hidden', !hasTrainingSystem);
                    if (jobSearchSection && hasTrainingSystem) {
                        jobSearchSection.querySelectorAll('select').forEach(function (sel) { sel.disabled = true; });
                    }
                    if (btnDeleteDisabled) { btnDeleteDisabled.classList.toggle('hidden', !hasTrainingSystem); if (hasTrainingSystem) btnDeleteDisabled.disabled = true; }
                    if (btnDelete) btnDelete.classList.toggle('hidden', hasTrainingSystem);
                    if (!d.large_code || !largeClass) return;
                    largeClass.value = d.large_code;
                    loadTrainingByLarge().then(function () {
                        midClass.value = d.mid_code || '';
                        loadSmallByMid();
                        smallClass.value = d.small_code || '';
                        selectedJobsStore.length = 0;
                        try {
                            var raw = d.main_jobs_json;
                            if (raw && typeof raw === 'string') {
                                var arr = JSON.parse(raw);
                                if (Array.isArray(arr)) arr.forEach(function (j) { if (j && (j.code || j.name)) selectedJobsStore.push({ code: (j.code || '').toString().trim(), name: (j.name || '').toString().trim() }); });
                            }
                        } catch (e) { }
                        if (selectedJobsStore.length === 0 && (d.main_job_code || d.unit_code)) selectedJobsStore.push({ code: (d.unit_code || d.main_job_code || '').trim(), name: (d.main_job_name || d.unit_name || '').trim() });
                        loadJobRadios();
                        updateSelectedJobsResult();
                    });
                })
                .catch(function () { alert('조회 실패'); });
        }

        if (isEmbedded && window.NCS_EMBED_COURSE_ID) {
            // 임베디드 모드: 특정 과정 ID로 데이터를 로드하여 폼 채우기
            var token = localStorage.getItem('token');
            fetch('/api/approved-courses/' + window.NCS_EMBED_COURSE_ID, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) {
                    if (!r.ok) throw new Error('Course not found');
                    return r.json();
                })
                .then(function (res) {
                    if (res.success && res.data) {
                        fillFormFromApprovedCourse(res.data);
                        // 수정 모드인 경우 (이미 NCS 등록 정보가 있는 경우) loadForEdit 호출
                        // 여기서 NCS 등록 정보가 있는지 어떻게 아나? -> API가 알려주면 좋겠지만, 
                        // 현재 구조에서는 NCS 등록 정보 ID를 모르므로, 
                        // /api/ncs/approved/registrations?course_id=... 같은 검색 API가 필요하거나
                        // ApprovedCourse 데이터 안에 ncs_reg_id가 있으면 좋음.

                        // 임시: 과정 ID로 등록 정보 조회 시도 (필요시 API 추가)
                        // 또는 사용자가 '등록' 버튼을 누르면 내부적으로 Check

                        // EditId가 있으면 loadForEdit 호출
                        // 부모 페이지에서 editId를 넘겨줬다면 HTML hidden input에 있을 것임.
                        var hiddenEditId = document.getElementById('ncsApprovedEditId');
                        if (hiddenEditId && hiddenEditId.value) {
                            editId = hiddenEditId.value;
                            loadForEdit();
                        }
                    } else {
                        // alert(res.error || '과정 정보를 불러올 수 없습니다.');
                    }
                })
                .catch(function () { console.error('Embedded course load failed'); });
        } else {
            loadApprovedCoursesList();
        }

        loadLargeClasses().then(function () {
            if (!editId) {
                var today = new Date();
                var y = today.getFullYear();
                var m = String(today.getMonth() + 1).padStart(2, '0');
                var d = String(today.getDate()).padStart(2, '0');
                setRegDate(y + '-' + m + '-' + d);
            }
            if (editId) loadForEdit();
        });
    }

    function initStep2() {
        var tbody = document.getElementById('ncsTrainingSystemBody');
        var regInput = document.getElementById('ncsApprovedRegId');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        if (!tbody) return;

        function esc(s) {
            if (s == null) return '';
            var el = document.createElement('span');
            el.textContent = s;
            return el.innerHTML;
        }
        function attrEsc(s) {
            return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        if (!regId) {
            tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-12 text-center text-slate-500">과정개요를 먼저 등록한 후 1단계에서 <strong>다음</strong>을 눌러 진행하세요. <a href="/admin/ncs/approved/1" class="text-emerald-600 hover:underline ml-1">1. 과정개요로 이동</a></td></tr>';
            return;
        }

        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-system', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-red-500">' + esc(json.error || '훈련이수체계도 조회 실패') + '</td></tr>';
                    return;
                }
                var d = json.data;
                var levels = d.levels || { 6: [], 5: [], 4: [], 3: [], 2: [] };
                var mainJobs = Array.isArray(d.mainJobs) && d.mainJobs.length ? d.mainJobs : (d.mainJob ? [d.mainJob] : []);
                var basicAbility = d.basicAbility || [];
                var selectedSet = {};
                (d.selected || []).forEach(function (n) { selectedSet[n] = true; });

                var hasJobs = mainJobs && mainJobs.length > 0;

                // Build Table Header
                var theadHtml = '<tr><th class="px-6 py-3 w-28 font-bold text-center border-r border-emerald-400">수준</th>';
                if (hasJobs) {
                    mainJobs.forEach(function (j) {
                        var jName = (j.name || '').trim() || (j.code || '직종');
                        theadHtml += '<th class="px-6 py-3 font-bold text-center border-r border-emerald-400 last:border-0">' + esc(jName) + '</th>';
                    });
                } else {
                    theadHtml += '<th class="px-6 py-3 font-bold text-center">능력단위</th>';
                }
                theadHtml += '</tr>';
                var thead = document.querySelector('#ncsApprovedStep2Container thead');
                if (thead) thead.innerHTML = theadHtml;

                var rows = [];
                function addSelectableRows(levelLabel, allItems) {
                    var rowHtml = '<tr class="border-b border-slate-100 last:border-0">';
                    rowHtml += '<td class="px-4 py-6 text-center font-bold text-slate-600 border-r border-slate-100">' + esc(levelLabel) + '</td>';

                    if (hasJobs) {
                        mainJobs.forEach(function (job) {
                            var jobName = (job.name || '').trim();
                            // If jobName is empty, it might be tricky. Assume valid jobs.
                            var jobItems = (allItems || []).filter(function (it) {
                                if (it.jobNames && Array.isArray(it.jobNames)) {
                                    return it.jobNames.includes(jobName);
                                }
                                return true;
                            });

                            var contentHtml = '';
                            if (!jobItems.length) {
                                contentHtml = '<span class="text-slate-300 text-xs">해당 없음</span>';
                            } else {
                                contentHtml = '<div class="flex flex-col gap-2">';
                                jobItems.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
                                jobItems.forEach(function (x) {
                                    var name = (x && x.name) ? x.name : String(x);
                                    if (!name) return;
                                    var code = (x && x.code) ? String(x.code).trim() : '';
                                    var value = code || name;
                                    var isChecked = selectedSet[value] || selectedSet[name];

                                    var className = isChecked
                                        ? 'cursor-pointer px-3 py-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm transition flex items-center justify-between group'
                                        : 'cursor-pointer px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-between group';

                                    contentHtml += '<label class="' + className + '" data-unit-value="' + attrEsc(value) + '">' +
                                        '<span class="flex-1 text-sm">' + esc(name) + '</span>' +
                                        '<input type="checkbox" class="ncs-step2-cb hidden" value="' + attrEsc(value) + '"' + (isChecked ? ' checked' : '') + ' onchange="updateUnitSelection(this)">' +
                                        '<i class="fas fa-check ' + (isChecked ? 'text-blue-600' : 'text-transparent group-hover:text-slate-300') + ' transition"></i>' +
                                        '</label>';
                                });
                                contentHtml += '</div>';
                            }
                            rowHtml += '<td class="px-3 py-4 bg-slate-50/30 border-r border-slate-100 last:border-0 align-top min-w-[200px]">' + contentHtml + '</td>';
                        });
                    } else {
                        var contentHtml = '<div class="flex flex-col gap-2">';
                        (allItems || []).forEach(function (x) {
                            var name = (x && x.name) ? x.name : String(x);
                            var value = x.code || name;
                            var isChecked = selectedSet[value] || selectedSet[name];
                            var className = isChecked ? 'cursor-pointer px-3 py-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm transition flex items-center justify-between group' : 'cursor-pointer px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-between group';
                            contentHtml += '<label class="' + className + '"><span class="flex-1 text-sm">' + esc(name) + '</span><input type="checkbox" class="ncs-step2-cb hidden" value="' + attrEsc(value) + '"' + (isChecked ? ' checked' : '') + ' onchange="updateUnitSelection(this)"><i class="fas fa-check ' + (isChecked ? 'text-blue-600' : 'text-transparent group-hover:text-slate-300') + ' transition"></i></label>';
                        });
                        contentHtml += '</div>';
                        rowHtml += '<td class="px-6 py-4 bg-slate-50/30">' + contentHtml + '</td>';
                    }
                    rowHtml += '</tr>';
                    rows.push(rowHtml);
                }

                window.updateUnitSelection = function (trigger) {
                    var val = trigger.value;
                    var checked = trigger.checked;
                    var allCbs = document.querySelectorAll('.ncs-step2-cb[value="' + CSS.escape(val) + '"]');
                    allCbs.forEach(function (cb) {
                        cb.checked = checked;
                        var p = cb.parentElement;
                        var i = p.querySelector('i');
                        if (checked) {
                            p.className = 'cursor-pointer px-3 py-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm transition flex items-center justify-between group';
                            if (i) i.className = 'fas fa-check text-blue-600 transition';
                        } else {
                            p.className = 'cursor-pointer px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-between group';
                            if (i) i.className = 'fas fa-check text-transparent group-hover:text-slate-300 transition';
                        }
                    });
                };

                addSelectableRows('6수준', levels[6]);
                addSelectableRows('5수준', levels[5]);
                addSelectableRows('4수준', levels[4]);
                addSelectableRows('3수준', levels[3]);
                addSelectableRows('2수준', levels[2]);

                var basicItems = basicAbility.length ? basicAbility : [];
                var basicRowHtml = '<tr class="border-b border-slate-100 last:border-0">';
                basicRowHtml += '<td class="px-4 py-6 text-center font-bold text-slate-600 w-28 border-r border-slate-100">직업<br>기초<br>능력</td>';
                basicRowHtml += '<td colspan="' + (hasJobs ? mainJobs.length : 1) + '" class="px-3 py-4 bg-slate-50/30">';
                if (!basicItems.length) {
                    basicRowHtml += '<span class="text-slate-300 text-sm">선택된 직업기초 능력이 없습니다.</span>';
                } else {
                    basicRowHtml += '<div class="grid grid-cols-2 md:grid-cols-3 gap-2">';
                    basicItems.forEach(function (x) {
                        var name = (x && x.name) ? x.name : String(x);
                        var value = x.code || name;
                        var isChecked = selectedSet[value] || selectedSet[name];
                        var className = isChecked
                            ? 'cursor-pointer px-3 py-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm transition flex items-center justify-between group'
                            : 'cursor-pointer px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-between group';
                        basicRowHtml += '<label class="' + className + '">' +
                            '<span class="flex-1 text-sm">' + esc(name) + '</span>' +
                            '<input type="checkbox" class="ncs-step2-cb hidden" value="' + attrEsc(value) + '"' + (isChecked ? ' checked' : '') + ' onchange="updateUnitSelection(this)">' +
                            '<i class="fas fa-check ' + (isChecked ? 'text-blue-600' : 'text-transparent group-hover:text-slate-300') + ' transition"></i>' +
                            '</label>';
                    });
                    basicRowHtml += '</div>';
                }
                basicRowHtml += '</td></tr>';
                rows.push(basicRowHtml);

                tbody.innerHTML = rows.join('');

                var btnSave = document.getElementById('ncsStep2BtnSave');
                var btnNext = document.getElementById('ncsStep2BtnNext');

                function saveStep2(redirectToNext) {
                    var selected = [];
                    tbody.querySelectorAll('.ncs-step2-cb:checked').forEach(function (cb) {
                        var v = (cb.value || '').trim();
                        if (v) selected.push(v);
                    });

                    if (btnSave) btnSave.disabled = true;
                    if (btnNext) btnNext.disabled = true;

                    fetch('/api/ncs/approved/registrations/' + regId + '/training-system-selection', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
                        body: JSON.stringify({ selected: selected })
                    })
                        .then(function (r) { return r.json(); })
                        .then(function (res) {
                            if (btnSave) btnSave.disabled = false;
                            if (btnNext) btnNext.disabled = false;
                            if (res.success) {
                                if (redirectToNext) {
                                    if (isEmbedded) {
                                        if (window.loadNcsStep) window.loadNcsStep(3);
                                    } else {
                                        window.location.href = '/admin/ncs/approved/3?id=' + regId;
                                    }
                                } else {
                                    alert('저장되었습니다.');
                                }
                            } else {
                                alert(res.error || '선택 저장 실패');
                            }
                        })
                        .catch(function () {
                            if (btnSave) btnSave.disabled = false;
                            if (btnNext) btnNext.disabled = false;
                            alert('선택 저장 중 오류가 발생했습니다.');
                        });
                }

                if (btnSave) btnSave.addEventListener('click', function () { saveStep2(false); });
                if (btnNext) btnNext.addEventListener('click', function () { saveStep2(true); });
            })
            .catch(function () {
                tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-red-500">훈련이수체계도를 불러오는데 실패했습니다.</td></tr>';
            });
    }

    function initStep3() {
        var regInput = document.getElementById('ncsApprovedRegIdStep3');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep3NoReg');
        var form = document.getElementById('ncsStep3Form');
        var ncsRowsCallback = document.getElementById('ncsCurriculumRows'); // Container
        var nonNcsRows = document.getElementById('nonNcsCurriculumRows');

        if (!form || !ncsRowsCallback || !nonNcsRows) return;

        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var trainingData = null;
        var availableUnitsMap = {}; // code -> unit object with elements
        var elementCountMap = {};

        // Helper: escape html
        function esc(s) {
            if (s == null) return '';
            var el = document.createElement('span');
            el.textContent = s;
            return el.innerHTML;
        }
        function attrEsc(s) {
            return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function createJobSection(jobName) {
            var sect = document.createElement('div');
            sect.className = 'bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 mb-8 job-section';
            sect.dataset.jobName = jobName || 'unknown';
            sect.innerHTML =
                '<div class="flex items-center gap-3 mb-6">' +
                '<i class="fas fa-book-open text-blue-600 text-xl"></i>' +
                '<h3 class="text-lg font-black text-slate-800">' + esc(jobName || '직종 미분류') + '</h3>' +
                '<span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">NCS 능력단위 기반 교과목 편성</span>' +
                '</div>' +
                '<div class="space-y-4 job-subjects-container"></div>' +
                '<div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">' +
                '<button type="button" class="btn-add-subject px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-bold text-sm transition flex items-center gap-2">' +
                '<i class="fas fa-plus"></i> 교과목 추가' +
                '</button></div>';

            sect.querySelector('.btn-add-subject').addEventListener('click', function () {
                addSubjectRow(sect.querySelector('.job-subjects-container'), jobName);
            });
            return sect;
        }

        function addSubjectRow(container, jobName, data) {
            data = data || {};
            var row = document.createElement('div');
            row.className = 'ncs-curriculum-row bg-slate-50 rounded-2xl p-5 border border-slate-200 relative group transition-all hover:border-blue-200 hover:shadow-md';

            var unitsHtml = '';
            var jobUnits = [];
            // Filter available units for this job
            Object.values(availableUnitsMap).forEach(function (u) {
                var uJobNames = u.jobNames || [];
                // Check if this unit belongs to the job. Strict match if jobName provided.
                if (!jobName || uJobNames.includes(jobName) || uJobNames.length === 0) {
                    jobUnits.push(u);
                }
            });
            // If jobUnits empty (e.g. data issue), fallback to all? No, stick to strict.

            row.innerHTML =
                '<div class="flex flex-wrap items-start gap-4">' +
                '<div class="w-full md:w-48 pt-1">' +
                '<label class="block text-xs font-bold text-slate-500 uppercase mb-1">교과목명</label>' +
                '<input type="text" class="ncs-curriculum-name w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" placeholder="교과목명 입력" value="' + attrEsc(data.name) + '">' +
                '</div>' +
                '<div class="flex-1 min-w-[300px]">' +
                '<label class="block text-xs font-bold text-slate-500 uppercase mb-1">능력단위 선택</label>' +
                '<div class="flex flex-wrap gap-2 ncs-unit-chips">' +
                // Render Unit Checkboxes (Chips)
                jobUnits.map(function (u) {
                    var isChecked = false;
                    if (data.ability_units) {
                        // Check if unit code is in ability_units list (handling objects or strings)
                        // data.ability_units might be [{code: ...}, {code: ...}] or ['code', ...]
                        isChecked = data.ability_units.some(function (sel) {
                            return (typeof sel === 'string' ? sel : sel.code) === u.code;
                        });
                    }
                    var activeClass = isChecked ? 'bg-white border-blue-500 text-blue-700 ring-2 ring-blue-100 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300';
                    return '<label class="cursor-pointer px-3 py-2 rounded-lg border text-sm transition select-none flex items-center gap-2 ' + activeClass + '">' +
                        '<input type="checkbox" class="ncs-unit-input hidden" value="' + attrEsc(u.code) + '" ' + (isChecked ? 'checked' : '') + '>' +
                        '<span>' + esc(u.name) + '</span>' +
                        '<i class="fas fa-check text-xs ' + (isChecked ? '' : 'hidden') + '"></i>' +
                        '</label>';
                }).join('') +
                '</div>' +
                // Container for Elements (Dynamic)
                '<div class="mt-4 space-y-3 ncs-elements-container"></div>' +
                '</div>' +
                '<button type="button" class="btn-del-subject w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="삭제"><i class="fas fa-times"></i></button>' +
                '</div>';

            container.appendChild(row);

            // Event Listeners
            var chips = row.querySelectorAll('.ncs-unit-input');
            var elContainer = row.querySelector('.ncs-elements-container');
            var btnDel = row.querySelector('.btn-del-subject');

            btnDel.addEventListener('click', function () {
                if (confirm('이 교과목을 삭제하시겠습니까?')) row.remove();
            });

            function renderElements() {
                elContainer.innerHTML = '';
                var checkedUnits = Array.from(row.querySelectorAll('.ncs-unit-input:checked')).map(function (cb) { return cb.value; });

                checkedUnits.forEach(function (uCode) {
                    var unit = availableUnitsMap[uCode];
                    if (!unit) return;
                    var elements = unit.elements || [];

                    var savedUnit = (data.ability_units || []).find(function (s) { return (typeof s === 'string' ? s : s.code) === uCode; });
                    // If savedUnit is object, use its elements. If string (legacy), select all by default?
                    var savedElements = (savedUnit && typeof savedUnit === 'object' && savedUnit.elements) ? savedUnit.elements : null;

                    var elHtml = '<div class="bg-slate-50/50 border border-slate-200 rounded-xl p-3">' +
                        '<div class="flex items-center gap-2 mb-2">' +
                        '<span class="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">' + esc(unit.name) + '</span>' +
                        '<span class="text-[10px] text-slate-400">능력단위요소 선택</span>' +
                        '</div>' +
                        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 pl-1">';

                    if (elements.length > 0) {
                        elHtml += elements.map(function (el) {
                            // Determine checked state
                            var isElChecked = true; // default true
                            if (savedElements) {
                                isElChecked = savedElements.some(function (selEl) { return selEl.code === el.code; });
                            }
                            return '<label class="flex items-start gap-2 text-xs text-slate-600 mb-1 cursor-pointer hover:text-blue-600">' +
                                '<input type="checkbox" class="mt-0.5 ncs-element-input text-blue-600 rounded" value="' + attrEsc(el.code) + '" data-unit-code="' + attrEsc(uCode) + '" ' + (isElChecked ? 'checked' : '') + '>' +
                                '<span class="leading-snug">' + esc(el.name) + '</span>' +
                                '</label>';
                        }).join('');
                    } else {
                        elHtml += '<span class="text-xs text-slate-400 italic col-span-2">등록된 하위 요소가 없습니다.</span>';
                    }
                    elHtml += '</div></div>';
                    elContainer.insertAdjacentHTML('beforeend', elHtml);
                });
            }

            // Initial render of elements
            renderElements();

            // When unit selection changes
            chips.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    // Update chip style
                    var label = cb.parentElement;
                    var icon = label.querySelector('.fa-check');
                    if (cb.checked) {
                        label.className = 'cursor-pointer px-3 py-2 rounded-lg border text-sm transition select-none flex items-center gap-2 bg-white border-blue-500 text-blue-700 ring-2 ring-blue-100 font-bold';
                        icon.classList.remove('hidden');
                    } else {
                        label.className = 'cursor-pointer px-3 py-2 rounded-lg border text-sm transition select-none flex items-center gap-2 bg-white border-slate-200 text-slate-600 hover:border-blue-300';
                        icon.classList.add('hidden');
                    }
                    renderElements();
                });
            });
        }

        // Logic to build payload (save logic)
        function buildCurriculumPayload() {
            var items = [];

            // Iterate Job Sections (NCS Items)
            document.querySelectorAll('.job-section').forEach(function (sect) {
                var jobName = sect.dataset.jobName;
                sect.querySelectorAll('.ncs-curriculum-row').forEach(function (row) {
                    var nameEl = row.querySelector('.ncs-curriculum-name');
                    var name = nameEl ? nameEl.value.trim() : '';
                    if (!name) return; // Skip empty names?

                    var ability_units = [];

                    // Iterate over checked units
                    row.querySelectorAll('.ncs-unit-input:checked').forEach(function (unitCb) {
                        var uCode = unitCb.value;
                        var uInfo = availableUnitsMap[uCode];
                        if (!uInfo) return;

                        // Find checked elements for this unit
                        var selectedElements = [];
                        row.querySelectorAll('.ncs-element-input[data-unit-code="' + uCode + '"]:checked').forEach(function (elCb) {
                            var eCode = elCb.value;
                            // Find element info in uInfo.elements
                            var eInfo = (uInfo.elements || []).find(function (e) { return e.code === eCode });
                            if (eInfo) {
                                selectedElements.push({ code: eInfo.code, name: eInfo.name });
                            }
                        });

                        ability_units.push({
                            code: uInfo.code,
                            name: uInfo.name,
                            elements: selectedElements
                        });
                    });

                    items.push({
                        type: 'ncs',
                        name: name,
                        job_name: jobName,
                        ability_units: ability_units
                    });
                });
            });

            // Iterate Non-NCS Items
            if (nonNcsRows) {
                nonNcsRows.querySelectorAll('.nonncs-curriculum-row').forEach(function (row) {
                    var classEl = row.querySelector('.nonncs-curriculum-class');
                    var nameEl = row.querySelector('.nonncs-curriculum-name');
                    var classification = classEl ? classEl.value.trim() : '';
                    var name = nameEl ? nameEl.value.trim() : '';

                    if (!name && !classification) return; // Skip empty

                    var units = [];
                    row.querySelectorAll('.nonncs-unit-item').forEach(function (inp) {
                        if (inp.value.trim()) units.push(inp.value.trim());
                    });

                    var objectives = [];
                    row.querySelectorAll('.nonncs-obj-item').forEach(function (inp) {
                        if (inp.value.trim()) objectives.push(inp.value.trim());
                    });

                    items.push({
                        type: 'non_ncs',
                        name: name,
                        classification: classification,
                        units: units,
                        objectives: objectives
                    });
                });
            }

            return { items: items };
        }

        // Add NON-NCS Helpers
        function addNonNcsRow() {
            // Reuse existing logic or simple re-implement
            var first = nonNcsRows.querySelector('.nonncs-curriculum-row');
            if (!first) return; // Expecting template row
            var clone = first.cloneNode(true);
            clone.querySelectorAll('input, select').forEach(function (i) { i.value = ''; });
            var u = clone.querySelector('.nonncs-units');
            if (u) { u.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="단원명 입력"><button type="button" class="nonncs-unit-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button></div>'; }
            var o = clone.querySelector('.nonncs-objectives');
            if (o) { o.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-obj-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="수행기준 입력"><button type="button" class="nonncs-obj-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button></div>'; }
            nonNcsRows.appendChild(clone);
            wireNonNcsRow(clone);
        }
        function delNonNcsRow() {
            var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
            if (rows.length > 1) rows[rows.length - 1].remove();
        }
        function wireNonNcsRow(row) {
            var units = row.querySelector('.nonncs-units');
            var objs = row.querySelector('.nonncs-objectives');
            function addUnit() {
                var t = units.querySelector('.flex');
                if (!t) return;
                var div = t.cloneNode(true);
                div.querySelector('input').value = '';
                units.appendChild(div);
            }
            function delUnit() {
                var items = units.querySelectorAll('.flex');
                if (items.length > 1) items[items.length - 1].remove();
            }
            function addObj() { //... same
                var t = objs.querySelector('.flex'); if (!t) return;
                var div = t.cloneNode(true); div.querySelector('input').value = ''; objs.appendChild(div);
            }
            function delObj() { //... same
                var items = objs.querySelectorAll('.flex'); if (items.length > 1) items[items.length - 1].remove();
            }
            if (units) {
                units.addEventListener('click', function (e) {
                    if (e.target.classList.contains('nonncs-unit-plus')) addUnit();
                    if (e.target.classList.contains('nonncs-unit-minus')) delUnit();
                });
            }
            if (objs) {
                objs.addEventListener('click', function (e) {
                    if (e.target.classList.contains('nonncs-obj-plus')) addObj();
                    if (e.target.classList.contains('nonncs-obj-minus')) delObj();
                });
            }
        }

        // Attach buttons
        var addNon = document.getElementById('nonNcsCurriculumBtnAdd');
        var delNon = document.getElementById('nonNcsCurriculumBtnDel');
        if (addNon) { addNon.removeEventListener('click', addNonNcsRow); addNon.addEventListener('click', addNonNcsRow); }
        if (delNon) { delNon.removeEventListener('click', delNonNcsRow); delNon.addEventListener('click', delNonNcsRow); }
        // Note: NCS add/del buttons are now handled per-job section

        function saveCurriculum(redirectToNext) {
            var payload = buildCurriculumPayload();
            var btnSave = document.getElementById('ncsStep3BtnSave');
            var btnNext = document.getElementById('ncsStep3BtnNext');
            if (btnSave) btnSave.disabled = true;
            if (btnNext) btnNext.disabled = true;
            var t = localStorage.getItem('token');
            fetch('/api/ncs/approved/registrations/' + regId + '/curriculum', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                body: JSON.stringify(payload)
            })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    if (json.success) {
                        if (redirectToNext) {
                            if (isEmbedded) { if (window.loadNcsStep) window.loadNcsStep(4); }
                            else { window.location.href = '/admin/ncs/approved/4?id=' + regId; }
                            return;
                        }
                        alert('저장되었습니다.');
                    } else {
                        alert(json.error || '저장 실패');
                    }
                })
                .catch(function () {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    alert('저장 중 오류가 발생했습니다.');
                });
        }

        var btnSave = document.getElementById('ncsStep3BtnSave');
        var btnNext = document.getElementById('ncsStep3BtnNext');
        // Clear old listeners by clone or just standard (re-assigning onclick might be cleaner if we want to remove old ones)
        if (btnSave) { var n = btnSave.cloneNode(true); btnSave.parentNode.replaceChild(n, btnSave); btnSave = n; btnSave.addEventListener('click', function () { saveCurriculum(false); }); }
        if (btnNext) { var n = btnNext.cloneNode(true); btnNext.parentNode.replaceChild(n, btnNext); btnNext = n; btnNext.addEventListener('click', function () { saveCurriculum(true); }); }


        // Init Load
        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-system', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    console.error('Failed to load training system');
                    return;
                }
                var d = json.data;
                var mainJobs = Array.isArray(d.mainJobs) && d.mainJobs.length ? d.mainJobs : (d.mainJob ? [d.mainJob] : []);
                var selected = d.selected || []; // Array of codes
                var elementsData = d.elements || []; // Array of {code, name, jobNames, elements: []}

                // Build availableUnitsMap
                elementsData.forEach(function (el) {
                    if (selected.includes(el.code)) {
                        availableUnitsMap[el.code] = el;
                    }
                });

                // Clear Container
                ncsRowsCallback.innerHTML = '';

                // Fetch saved curriculum to populate
                fetch('/api/ncs/approved/registrations/' + regId + '/curriculum', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                    .then(function (r) { return r.json(); })
                    .then(function (cJson) {
                        var existingItems = (cJson.success && cJson.data) ? cJson.data : [];
                        var ncsItems = existingItems.filter(function (i) { return i.type === 'ncs'; });

                        // Parse ability_units_json for existing items
                        ncsItems.forEach(function (it) {
                            try {
                                it.ability_units = it.ability_units_json ? JSON.parse(it.ability_units_json) : [];
                            } catch (e) { it.ability_units = []; }
                        });

                        // Render Job Sections
                        mainJobs.forEach(function (job) {
                            var jobName = job.name;
                            var sect = createJobSection(jobName);
                            var subContainer = sect.querySelector('.job-subjects-container');

                            // Find existing subjects for this job
                            // Note: Previous DB schema didn't have 'job_name'. We might need to guess or show all in first section if fallback.
                            // Better logic: If item.job_name matches. Or if items have units belonging to this job.

                            var jobItems = ncsItems.filter(function (it) {
                                if (it.job_name === jobName) return true;
                                if (!it.job_name) {
                                    // Try to infer from units
                                    if (it.ability_units.length > 0) {
                                        var firstUCode = typeof it.ability_units[0] === 'string' ? it.ability_units[0] : it.ability_units[0].code;
                                        var uInfo = availableUnitsMap[firstUCode];
                                        if (uInfo && (uInfo.jobNames || []).includes(jobName)) return true;
                                    } else {
                                        // Empty subject without job_name - maybe default to first job?
                                        if (mainJobs.indexOf(job) === 0) return true;
                                    }
                                }
                                return false;
                            });

                            jobItems.forEach(function (it) {
                                addSubjectRow(subContainer, jobName, it);
                            });

                            // If no items for this job, maybe add one empty row by default? 
                            if (jobItems.length === 0) {
                                // addSubjectRow(subContainer, jobName); // Optional
                            }

                            ncsRowsCallback.appendChild(sect);
                        });

                        // Ensure Non-NCS Rows populated
                        var nonItems = existingItems.filter(function (i) { return i.type === 'non_ncs'; });
                        var nonNcsR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                        // Clear default template if we have data
                        if (nonItems.length > 0) {
                            // If template row exists, use it for first, clone for others
                            // Easier: clear and rebuild using generic templating
                            // But I reused existing html logic above. It expects rows exist.
                            // Let's use ensureNonRows logic
                            function ensureNonRows(n) {
                                var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                                while (rows.length < n) { addNonNcsRow(); rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row'); }
                            }
                            ensureNonRows(Math.max(1, nonItems.length));

                            var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                            nonItems.forEach(function (it, i) {
                                var r = rows[i];
                                r.querySelector('.nonncs-curriculum-class').value = it.classification || '';
                                r.querySelector('.nonncs-curriculum-name').value = it.name || '';
                                var uCont = r.querySelector('.nonncs-units');
                                var oCont = r.querySelector('.nonncs-objectives');

                                var units = []; try { units = it.units_json ? JSON.parse(it.units_json) : []; } catch (e) { }
                                var objs = []; try { objs = it.objectives_json ? JSON.parse(it.objectives_json) : []; } catch (e) { }

                                function flexIn(val, ph) { return '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="' + ph + '" value="' + attrEsc(val) + '"><button type="button" class="nonncs-unit-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-unit-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>'; }

                                if (units.length) uCont.innerHTML = units.map(function (u) { return flexIn(u, '단원명 입력'); }).join('');
                                if (objs.length) oCont.innerHTML = objs.map(function (o) { return flexIn(o, '학습목표 입력').replace('nonncs-unit', 'nonncs-obj'); }).join('');
                            });
                        } else {
                            // wire default row
                            var first = nonNcsRows.querySelector('.nonncs-curriculum-row');
                            if (first) wireNonNcsRow(first);
                        }
                    });
            });
    }

    function initStep4() {
        var regInput = document.getElementById('ncsApprovedRegIdStep4');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep4NoReg');
        var form = document.getElementById('ncsStep4Form');
        var tbody = document.getElementById('ncsStep4HoursBody');
        var foot = document.getElementById('ncsStep4HoursFoot');
        var totalTheoryEl = document.getElementById('ncsStep4TotalTheory');
        var totalPracticeEl = document.getElementById('ncsStep4TotalPractice');
        var totalSumEl = document.getElementById('ncsStep4TotalSum');
        var step4Items = [];

        if (!tbody || !form) return;

        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            tbody.innerHTML = '';
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        function attrEsc(s) {
            return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function getParamsInputs() {
            var totalDays = parseInt(document.getElementById('ncsStep4TotalDays') && document.getElementById('ncsStep4TotalDays').value ? document.getElementById('ncsStep4TotalDays').value : 20, 10) || 0;
            var dailyHours = parseFloat(document.getElementById('ncsStep4DailyHours') && document.getElementById('ncsStep4DailyHours').value ? document.getElementById('ncsStep4DailyHours').value : 5) || 0;
            var totalHours = parseInt(document.getElementById('ncsStep4TotalHours') && document.getElementById('ncsStep4TotalHours').value ? document.getElementById('ncsStep4TotalHours').value : 100, 10) || 0;
            var libPct = parseFloat(document.getElementById('ncsStep4LibPct') && document.getElementById('ncsStep4LibPct').value ? document.getElementById('ncsStep4LibPct').value : 0) || 0;
            var majorPct = parseFloat(document.getElementById('ncsStep4MajorPct') && document.getElementById('ncsStep4MajorPct').value ? document.getElementById('ncsStep4MajorPct').value : 0) || 0;
            var nonPct = parseFloat(document.getElementById('ncsStep4NonPct') && document.getElementById('ncsStep4NonPct').value ? document.getElementById('ncsStep4NonPct').value : 0) || 0;
            return { totalDays: totalDays, dailyHours: dailyHours, totalHours: totalHours, libPct: libPct, majorPct: majorPct, nonPct: nonPct };
        }

        function updatePctFromTotal() {
            var p = getParamsInputs();
            var total = p.totalHours || 0;
            var libH = Math.round(total * (p.libPct || 0) / 100);
            var majorH = Math.round(total * (p.majorPct || 0) / 100);
            var nonH = Math.round(total * (p.nonPct || 0) / 100);
            var libEl = document.getElementById('ncsStep4LibHours');
            var majorEl = document.getElementById('ncsStep4MajorHours');
            var nonEl = document.getElementById('ncsStep4NonHours');
            if (libEl) libEl.value = libH;
            if (majorEl) majorEl.value = majorH;
            if (nonEl) nonEl.value = nonH;
        }

        function syncTotalHoursFromDays() {
            var totalDaysEl = document.getElementById('ncsStep4TotalDays');
            var dailyEl = document.getElementById('ncsStep4DailyHours');
            var totalEl = document.getElementById('ncsStep4TotalHours');
            if (!totalEl || !totalDaysEl || !dailyEl) return;
            var d = parseFloat(totalDaysEl.value) || 0;
            var h = parseFloat(dailyEl.value) || 0;
            if (d > 0 && h > 0) {
                totalEl.value = Math.round(d * h);
                updatePctFromTotal();
                updateCalculatedApplied();
            }
        }

        function updateCalculatedApplied() {
            var p = getParamsInputs();
            var applied = 0;
            tbody.querySelectorAll('.ncs-step4-row').forEach(function (tr) {
                var theoryIn = tr.querySelector('.ncs-step4-theory');
                var practiceIn = tr.querySelector('.ncs-step4-practice');
                applied += Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0) + Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
            });
            var calcEl = document.getElementById('ncsStep4CalculatedApplied');
            if (calcEl) calcEl.textContent = (p.totalHours || 0) + ' / ' + applied + ' 시간';
            var basicAssigned = 0, ncsAssigned = 0, nonAssigned = 0;
            function isBasic(it) {
                return (it.type || '') === 'basic' || (it.classification && (String(it.classification).indexOf('기초') >= 0 || String(it.classification).indexOf('소양') >= 0));
            }
            step4Items.forEach(function (it) {
                var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + it.curriculum_id + '"]');
                if (!row) return;
                var theoryIn = row.querySelector('.ncs-step4-theory');
                var practiceIn = row.querySelector('.ncs-step4-practice');
                var sum = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0) + Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
                if (isBasic(it)) basicAssigned += sum;
                else if ((it.type || '') === 'ncs') ncsAssigned += sum;
                else nonAssigned += sum;
            });
            var tabBasic = document.getElementById('ncsStep4TabBasic');
            var tabNcs = document.getElementById('ncsStep4TabNcs');
            var tabNonncs = document.getElementById('ncsStep4TabNonncs');
            var basicAlloc = p.totalHours ? Math.round(p.totalHours * (p.libPct || 0) / 100) : 0;
            if (tabBasic) tabBasic.textContent = '(' + basicAssigned + '/' + basicAlloc + ')시간';
            if (tabNcs) tabNcs.textContent = '(' + ncsAssigned + '/' + (p.totalHours ? Math.round(p.totalHours * (p.majorPct + p.libPct) / 100) : 0) + ')시간';
            if (tabNonncs) tabNonncs.textContent = '(' + nonAssigned + '/' + (p.totalHours ? Math.round(p.totalHours * p.nonPct / 100) : 0) + ')시간';
        }

        function wireParamsInputs() {
            var ids = ['ncsStep4TotalDays', 'ncsStep4DailyHours', 'ncsStep4TotalHours', 'ncsStep4LibPct', 'ncsStep4MajorPct', 'ncsStep4NonPct'];
            ids.forEach(function (id) {
                var el = document.getElementById(id);
                if (el) el.addEventListener('input', function () {
                    if (id === 'ncsStep4TotalDays' || id === 'ncsStep4DailyHours') syncTotalHoursFromDays();
                    updatePctFromTotal();
                    updateCalculatedApplied();
                });
            });
        }

        function renderRows(items) {
            step4Items = items || [];
            if (!items || !items.length) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">등록된 교과목이 없습니다. 3. 교과목편성에서 먼저 편성하세요.</td></tr>';
                if (foot) foot.classList.add('hidden');
                renderTabContent();
                return;
            }
            tbody.innerHTML = items.map(function (it, i) {
                var theory = Number(it.theory_hours) || 0;
                var practice = Number(it.practice_hours) || 0;
                var sum = theory + practice;
                return '<tr class="ncs-step4-row" data-curriculum-id="' + attrEsc(String(it.curriculum_id)) + '" data-type="' + attrEsc(it.type || '') + '">' +
                    '<td class="px-4 py-2 text-slate-600">' + (i + 1) + '</td>' +
                    '<td class="px-4 py-2 font-medium text-slate-800">' + attrEsc(it.name || '') + '</td>' +
                    '<td class="px-4 py-2"><input type="number" min="0" step="1" class="ncs-step4-theory w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm" value="' + theory + '"></td>' +
                    '<td class="px-4 py-2"><input type="number" min="0" step="1" class="ncs-step4-practice w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm" value="' + practice + '"></td>' +
                    '<td class="px-4 py-2 ncs-step4-sum text-slate-700 font-medium">' + sum + '</td></tr>';
            }).join('');
            if (foot) foot.classList.remove('hidden');
            updateTotals();
            updatePctFromTotal();
            updateCalculatedApplied();
            tbody.addEventListener('input', function () { updateTotals(); updateCalculatedApplied(); });
            tbody.addEventListener('change', function () { updateTotals(); updateCalculatedApplied(); });
            renderTabContent();
        }

        function isBasicItem(it) {
            return (it.type || '') === 'basic' || (it.classification && (String(it.classification).indexOf('기초') >= 0 || String(it.classification).indexOf('소양') >= 0));
        }

        function cardHtml(it, th, pr) {
            return '<div class="rounded-lg border border-slate-200 p-4 bg-white">' +
                '<div class="flex flex-wrap justify-between items-center gap-2 mb-3">' +
                '<span class="font-bold text-slate-800">교과목 : ' + attrEsc(it.name || '') + '</span>' +
                '<div class="flex gap-2"><button type="button" class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">교과목 총 훈련시간</button><button type="button" class="ncs-step4-distribute-btn px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700" data-curriculum-id="' + it.curriculum_id + '">시간분배</button></div></div>' +
                '<div class="flex items-center gap-4"><span class="text-sm text-slate-600">' + attrEsc(it.name || '') + '</span><input type="number" min="0" class="ncs-step4-theory w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm curriculum-hour-input" data-curriculum-id="' + it.curriculum_id + '" data-kind="theory" value="' + th + '"> 이론 <input type="number" min="0" class="ncs-step4-practice w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm curriculum-hour-input" data-curriculum-id="' + it.curriculum_id + '" data-kind="practice" value="' + pr + '"> 실습</div></div>';
        }

        function getItemHoursFromTable(curriculumId) {
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + curriculumId + '"]');
            if (!row) return { theory: 0, practice: 0 };
            var theoryIn = row.querySelector('.ncs-step4-theory');
            var practiceIn = row.querySelector('.ncs-step4-practice');
            var theory = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0);
            var practice = Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
            return { theory: theory, practice: practice };
        }

        function renderTabContent() {
            var basicList = document.getElementById('ncsStep4BasicSubjectList');
            var ncsList = document.getElementById('ncsStep4NcsSubjectList');
            var nonList = document.getElementById('ncsStep4NonncsSubjectList');
            var basicItems = step4Items.filter(isBasicItem);
            var ncsItems = step4Items.filter(function (it) { return (it.type || '') === 'ncs'; });
            var nonItems = step4Items.filter(function (it) { return (it.type || '') === 'non_ncs'; });
            function hoursFor(it) {
                var fromTable = getItemHoursFromTable(it.curriculum_id);
                return fromTable.theory !== 0 || fromTable.practice !== 0 ? fromTable : { theory: Number(it.theory_hours) || 0, practice: Number(it.practice_hours) || 0 };
            }
            if (basicList) {
                basicList.innerHTML = basicItems.length ? basicItems.map(function (it) {
                    var h = hoursFor(it);
                    return cardHtml(it, h.theory, h.practice);
                }).join('') : '<p class="text-slate-500 text-sm">직업기초능력 교과목이 없습니다.</p>';
            }
            if (ncsList) {
                ncsList.innerHTML = ncsItems.length ? ncsItems.map(function (it) {
                    var h = hoursFor(it);
                    return cardHtml(it, h.theory, h.practice);
                }).join('') : '<p class="text-slate-500 text-sm">NCS 교과목이 없습니다.</p>';
            }
            if (nonList) {
                nonList.innerHTML = nonItems.length ? nonItems.map(function (it) {
                    var h = hoursFor(it);
                    return cardHtml(it, h.theory, h.practice);
                }).join('') : '<p class="text-slate-500 text-sm">비 NCS 교과목이 없습니다.</p>';
            }
        }

        function updateTotals() {
            var theorySum = 0, practiceSum = 0;
            tbody.querySelectorAll('.ncs-step4-row').forEach(function (tr) {
                var theoryIn = tr.querySelector('.ncs-step4-theory');
                var practiceIn = tr.querySelector('.ncs-step4-practice');
                var sumEl = tr.querySelector('.ncs-step4-sum');
                var t = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0);
                var p = Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
                theorySum += t;
                practiceSum += p;
                if (sumEl) sumEl.textContent = t + p;
            });
            if (totalTheoryEl) totalTheoryEl.textContent = theorySum;
            if (totalPracticeEl) totalPracticeEl.textContent = practiceSum;
            if (totalSumEl) totalSumEl.textContent = theorySum + practiceSum;
        }

        function buildPayload() {
            var items = [];
            tbody.querySelectorAll('.ncs-step4-row').forEach(function (tr) {
                var cid = tr.getAttribute('data-curriculum-id');
                var theoryIn = tr.querySelector('.ncs-step4-theory');
                var practiceIn = tr.querySelector('.ncs-step4-practice');
                var theory = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0);
                var practice = Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
                if (cid) items.push({ curriculum_id: parseInt(cid, 10), theory_hours: theory, practice_hours: practice });
            });
            var p = getParamsInputs();
            var payload = {
                params: {
                    total_training_days: p.totalDays,
                    daily_training_hours: p.dailyHours,
                    total_training_hours: p.totalHours,
                    ncs_lib_arts_pct: p.libPct,
                    ncs_major_pct: p.majorPct,
                    non_ncs_pct: p.nonPct
                },
                items: items
            };
            return payload;
        }

        function saveHours(redirectToNext) {
            var p = getParamsInputs();
            var sumPct = (p.libPct || 0) + (p.majorPct || 0) + (p.nonPct || 0);
            if (Math.abs(sumPct - 100) > 0.01) {
                alert('훈련시간 비율은 100%로 설정하셔야 합니다. (현재: ' + sumPct.toFixed(1) + '%)');
                return;
            }
            var btnSave = document.getElementById('ncsStep4BtnSave');
            var btnNext = document.getElementById('ncsStep4BtnNext');
            if (btnSave) btnSave.disabled = true;
            if (btnNext) btnNext.disabled = true;
            var token = localStorage.getItem('token');
            fetch('/api/ncs/approved/registrations/' + regId + '/training-hours', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
                body: JSON.stringify(buildPayload())
            })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    if (json.success) {
                        if (redirectToNext) {
                            if (isEmbedded) {
                                if (window.loadNcsStep) window.loadNcsStep(5);
                            } else {
                                window.location.href = '/admin/ncs/approved/5?id=' + regId;
                            }
                            return;
                        }
                        alert('저장되었습니다.');
                    } else {
                        alert(json.error || '저장 실패');
                    }
                })
                .catch(function () {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    alert('저장 중 오류가 발생했습니다.');
                });
        }

        function switchTab(tabName) {
            document.querySelectorAll('.ncs-step4-tab').forEach(function (btn) {
                btn.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
                btn.classList.add('text-slate-500', 'hover:text-slate-700');
            });
            document.querySelectorAll('.ncs-step4-tab-content').forEach(function (div) { div.classList.add('hidden'); });
            var activeBtn = document.querySelector('.ncs-step4-tab[data-tab="' + tabName + '"]');
            var activeContent = document.getElementById('ncsStep4TabContent' + (tabName === 'basic' ? 'Basic' : tabName === 'ncs' ? 'Ncs' : 'Nonncs'));
            if (activeBtn) {
                activeBtn.classList.remove('text-slate-500', 'hover:text-slate-700');
                activeBtn.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
            }
            if (activeContent) activeContent.classList.remove('hidden');
        }

        document.querySelectorAll('.ncs-step4-tab').forEach(function (btn) {
            btn.addEventListener('click', function () { switchTab(btn.getAttribute('data-tab') || 'ncs'); });
        });

        form.addEventListener('input', function (e) {
            if (!e.target || !e.target.matches || !e.target.matches('.curriculum-hour-input')) return;
            var cid = e.target.getAttribute('data-curriculum-id');
            var kind = e.target.getAttribute('data-kind');
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + cid + '"]');
            if (!row || !kind) return;
            var inp = row.querySelector(kind === 'theory' ? '.ncs-step4-theory' : '.ncs-step4-practice');
            if (inp) { inp.value = e.target.value; updateTotals(); updateCalculatedApplied(); }
        });
        form.addEventListener('change', function (e) {
            if (!e.target || !e.target.matches || !e.target.matches('.curriculum-hour-input')) return;
            var cid = e.target.getAttribute('data-curriculum-id');
            var kind = e.target.getAttribute('data-kind');
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + cid + '"]');
            if (!row || !kind) return;
            var inp = row.querySelector(kind === 'theory' ? '.ncs-step4-theory' : '.ncs-step4-practice');
            if (inp) { inp.value = e.target.value; updateTotals(); updateCalculatedApplied(); }
        });
        form.addEventListener('click', function (e) {
            var btn = e.target && e.target.closest && e.target.closest('.ncs-step4-distribute-btn');
            if (!btn) return;
            var cid = btn.getAttribute('data-curriculum-id');
            if (!cid) return;
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + cid + '"]');
            if (!row) return;
            var theoryIn = row.querySelector('.ncs-step4-theory');
            var practiceIn = row.querySelector('.ncs-step4-practice');
            var t = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0);
            var p = Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
            var half = Math.round((t + p) / 2);
            if (theoryIn) theoryIn.value = half;
            if (practiceIn) practiceIn.value = half;
            updateTotals();
            updateCalculatedApplied();
            renderTabContent();
        });

        wireParamsInputs();

        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-hours', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) {
                    renderRows([]);
                    return;
                }
                var data = Array.isArray(json.data) ? json.data : [];
                var params = json.params || {};
                var totalDaysEl = document.getElementById('ncsStep4TotalDays');
                var dailyEl = document.getElementById('ncsStep4DailyHours');
                var totalEl = document.getElementById('ncsStep4TotalHours');
                var libPctEl = document.getElementById('ncsStep4LibPct');
                var majorPctEl = document.getElementById('ncsStep4MajorPct');
                var nonPctEl = document.getElementById('ncsStep4NonPct');
                if (totalDaysEl && params.total_training_days != null) totalDaysEl.value = params.total_training_days;
                if (dailyEl && params.daily_training_hours != null) dailyEl.value = params.daily_training_hours;
                if (totalEl && params.total_training_hours != null) totalEl.value = params.total_training_hours;
                if (libPctEl && params.ncs_lib_arts_pct != null) libPctEl.value = params.ncs_lib_arts_pct;
                if (majorPctEl && params.ncs_major_pct != null) majorPctEl.value = params.ncs_major_pct;
                if (nonPctEl && params.non_ncs_pct != null) nonPctEl.value = params.non_ncs_pct;
                renderRows(data);
            })
            .catch(function () {
                tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-red-500">훈련시간 정보를 불러오는데 실패했습니다.</td></tr>';
                if (foot) foot.classList.add('hidden');
            });

        var btnSave = document.getElementById('ncsStep4BtnSave');
        var btnNext = document.getElementById('ncsStep4BtnNext');
        if (btnSave) btnSave.addEventListener('click', function () { saveHours(false); });
        if (btnNext) btnNext.addEventListener('click', function () { saveHours(true); });
    }

    function initStep5() {
        var regInput = document.getElementById('ncsApprovedRegIdStep5');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep5NoReg');
        var form = document.getElementById('ncsStep5Form');

        if (!form) return;
        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var instructors = [];
        var textbooks = [];
        var materials = [];
        var curriculum = [];

        function getToken() { return localStorage.getItem('token'); }
        function apiFetch(url) {
            var t = getToken();
            return fetch(url, { headers: t ? { 'Authorization': 'Bearer ' + t } : {} }).then(function (r) { return r.json(); });
        }

        function renderSubjectCard(item) {
            var esc = function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

            var abilityUnits = [];
            try { abilityUnits = item.ability_units_json ? JSON.parse(item.ability_units_json) : []; } catch (e) { }
            var units = [];
            try { units = item.units_json ? JSON.parse(item.units_json) : []; } catch (e) { }

            var unitLabel = abilityUnits.length ? abilityUnits.join(', ') : (units.length ? units.join(', ') : '—');

            var mainInstructorIds = [];
            try { mainInstructorIds = item.main_instructor_ids_json ? JSON.parse(item.main_instructor_ids_json) : []; } catch (e) { }
            var teachingMethods = [];
            try { teachingMethods = item.teaching_methods_json ? JSON.parse(item.teaching_methods_json) : ['']; } catch (e) { teachingMethods = ['']; }
            if (!teachingMethods.length) teachingMethods = [''];
            var evaluationMethods = [];
            try { evaluationMethods = item.evaluation_methods_json ? JSON.parse(item.evaluation_methods_json) : ['']; } catch (e) { evaluationMethods = ['']; }
            if (!evaluationMethods.length) evaluationMethods = [''];
            var textbookIds = [];
            try { textbookIds = item.textbook_ids_json ? JSON.parse(item.textbook_ids_json) : []; } catch (e) { }
            var materialIds = [];
            try { materialIds = item.material_ids_json ? JSON.parse(item.material_ids_json) : []; } catch (e) { }

            var instructorChecks = instructors.map(function (ins) {
                var checked = mainInstructorIds.indexOf(ins.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm cursor-pointer group"><input type="checkbox" class="ins-cb w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="' + ins.id + '" ' + checked + '> <span class="text-slate-600 group-hover:text-slate-900 transition-colors">' + esc(ins.name) + '</span></label>';
            }).join('');

            var evaluatorOpts = instructors.map(function (ins) {
                var sel = item.evaluator_id == ins.id ? 'selected' : '';
                return '<option value="' + ins.id + '" ' + sel + '>' + esc(ins.name) + '</option>';
            }).join('');

            var textbookChecks = textbooks.map(function (tx) {
                var checked = textbookIds.indexOf(tx.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm cursor-pointer group"><input type="checkbox" class="tx-cb w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="' + tx.id + '" ' + checked + '> <span class="text-slate-600 group-hover:text-slate-900 transition-colors">' + esc(tx.name) + '</span></label>';
            }).join('');

            var materialChecks = materials.map(function (mt) {
                var checked = materialIds.indexOf(mt.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm cursor-pointer group"><input type="checkbox" class="mt-cb w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="' + mt.id + '" ' + checked + '> <span class="text-slate-600 group-hover:text-slate-900 transition-colors">' + esc(mt.name) + '</span></label>';
            }).join('');

            return '<div class="curriculum-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all mb-8" data-id="' + item.id + '">' +
                '<div class="flex flex-wrap justify-between items-start gap-4 mb-8">' +
                '<div>' +
                '<h5 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3"><i class="fas fa-book-open text-blue-600"></i> ' + esc(item.name) + '</h5>' +
                '<p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest pl-8">능력단위(단원)명 : ' + esc(unitLabel) + '</p>' +
                '</div>' +
                '</div>' +

                '<!-- Content Grid -->' +
                '<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">' +

                '<!-- 주강사 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">주강사 설정</label>' +
                '<div class="flex flex-wrap gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">' +
                (instructorChecks || '<span class="text-slate-400 text-xs italic">등록된 강사가 없습니다.</span>') +
                '</div>' +
                '</div>' +

                '<!-- 평가자 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">평가 책임자</label>' +
                '<select class="evaluator-sel w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-0 transition-all">' +
                '<option value="">:: 평가자 선택 ::</option>' +
                evaluatorOpts +
                '</select>' +
                '</div>' +

                '<!-- 교수학습방법 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">교수학습방법</label>' +
                '<div class="t-methods-container space-y-2">' +
                teachingMethods.map(function (m) {
                    return '<div class="method-item flex gap-2">' +
                        '<select class="t-method-sel flex-1 px-5 py-3 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 shadow-sm">' +
                        '<option value="">:: 교수학습방법 선택 ::</option>' +
                        ['강의', '토의·토론', '실습', '실기', '과제박람회', '현장견학', '프로젝트'].map(function (opt) {
                            return '<option value="' + opt + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                        '</select>' +
                        '<button type="button" class="t-method-plus w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"><i class="fas fa-plus"></i></button>' +
                        '<button type="button" class="t-method-minus w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"><i class="fas fa-minus"></i></button>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' +

                '<!-- 평가방법 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">수행능력 평가방법</label>' +
                '<div class="e-methods-container space-y-2">' +
                evaluationMethods.map(function (m) {
                    return '<div class="method-item flex gap-2">' +
                        '<select class="e-method-sel flex-1 px-5 py-3 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 shadow-sm">' +
                        '<option value="">:: 평가방법 선택 ::</option>' +
                        ['서술형시험', '논술형시험', '사례연구', '발표', '포트폴리오', '수행평가', '작업장평가'].map(function (opt) {
                            return '<option value="' + opt + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                        '</select>' +
                        '<button type="button" class="e-method-plus w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"><i class="fas fa-plus"></i></button>' +
                        '<button type="button" class="e-method-minus w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"><i class="fas fa-minus"></i></button>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' +

                '<!-- 교재 선택 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">교재 선택</label>' +
                '<div class="flex flex-wrap gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">' +
                (textbookChecks || '<span class="text-slate-400 text-xs italic">등록된 교재가 없습니다.</span>') +
                '</div>' +
                '</div>' +

                '<!-- 재료 선택 -->' +
                '<div class="space-y-4">' +
                '<label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">훈련 재료 / 소모품</label>' +
                '<div class="flex flex-wrap gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">' +
                (materialChecks || '<span class="text-slate-400 text-xs italic">등록된 재료가 없습니다.</span>') +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function wireEvents(container) {
            container.addEventListener('click', function (e) {
                var btnPlus = e.target.closest('.t-method-plus, .e-method-plus');
                var btnMinus = e.target.closest('.t-method-minus, .e-method-minus');

                if (btnPlus) {
                    var items = btnPlus.closest('.field-content');
                    var first = items.querySelector('.method-item');
                    if (first) {
                        var clone = first.cloneNode(true);
                        clone.querySelector('select').value = '';
                        items.appendChild(clone);
                    }
                }
                if (btnMinus) {
                    var items = btnMinus.closest('.field-content');
                    var rows = items.querySelectorAll('.method-item');
                    if (rows.length > 1) {
                        btnMinus.closest('.method-item').remove();
                    } else {
                        rows[0].querySelector('select').value = '';
                    }
                }
            });
        }

        Promise.all([
            apiFetch('/api/ncs/approved/instructors'),
            apiFetch('/api/ncs/approved/hrd-items?category=textbook'),
            apiFetch('/api/ncs/approved/hrd-items?category=equipment'),
            apiFetch('/api/ncs/approved/hrd-items?category=consumable'),
            apiFetch('/api/ncs/approved/registrations/' + regId + '/evaluation-teaching')
        ]).then(function (results) {
            instructors = results[0].success ? results[0].data : [];
            textbooks = results[1].success ? results[1].data : [];
            materials = (results[2].success ? results[2].data : []).concat(results[3].success ? results[3].data : []);
            curriculum = results[4].success ? results[4].data : [];

            var secLib = document.getElementById('sectionNcsLib');
            var secMajor = document.getElementById('sectionNcsMajor');
            var secNon = document.getElementById('sectionNonNcs');

            var libItems = curriculum.filter(function (it) {
                return (it.classification && (it.classification.indexOf('기초') !== -1 || it.classification.indexOf('소양') !== -1)) || it.type === 'basic';
            });
            var majorItems = curriculum.filter(function (it) {
                return it.type === 'ncs' && !((it.classification && (it.classification.indexOf('기초') !== -1 || it.classification.indexOf('소양') !== -1)) || it.type === 'basic');
            });
            var nonItems = curriculum.filter(function (it) { return it.type === 'non_ncs'; });

            if (secLib) secLib.innerHTML = libItems.length ? libItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>';
            if (secMajor) secMajor.innerHTML = majorItems.length ? majorItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>';
            if (secNon) secNon.innerHTML = nonItems.length ? nonItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>';

            wireEvents(form);
        }).catch(function (err) {
            console.error(err);
            alert('정보를 불러오는데 실패했습니다.');
        });

        function saveEvaluation(redirectToNext) {
            var items = [];
            document.querySelectorAll('.curriculum-card').forEach(function (card) {
                var id = parseInt(card.getAttribute('data-id'), 10);
                var instructorsSelected = [];
                card.querySelectorAll('.ins-cb:checked').forEach(function (cb) { instructorsSelected.push(parseInt(cb.value, 10)); });
                var evaluatorId = parseInt(card.querySelector('.evaluator-sel').value, 10) || null;
                var tMethods = [];
                card.querySelectorAll('.t-method-sel').forEach(function (s) { if (s.value) tMethods.push(s.value); });
                var eMethods = [];
                card.querySelectorAll('.e-method-sel').forEach(function (s) { if (s.value) eMethods.push(s.value); });
                var textbooksSelected = [];
                card.querySelectorAll('.tx-cb:checked').forEach(function (cb) { textbooksSelected.push(parseInt(cb.value, 10)); });
                var materialsSelected = [];
                card.querySelectorAll('.mt-cb:checked').forEach(function (cb) { materialsSelected.push(parseInt(cb.value, 10)); });

                items.push({
                    id: id,
                    main_instructor_ids: instructorsSelected,
                    evaluator_id: evaluatorId,
                    teaching_methods: tMethods,
                    evaluation_methods: eMethods,
                    textbook_ids: textbooksSelected,
                    material_ids: materialsSelected
                });
            });

            var btnSave = document.getElementById('ncsStep5BtnSave');
            var btnNext = document.getElementById('ncsStep5BtnNext');
            if (btnSave) btnSave.disabled = true;
            if (btnNext) btnNext.disabled = true;
            var t = getToken();
            fetch('/api/ncs/approved/registrations/' + regId + '/evaluation-teaching', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                body: JSON.stringify({ items: items })
            }).then(function (r) { return r.json(); }).then(function (json) {
                if (btnSave) btnSave.disabled = false;
                if (btnNext) btnNext.disabled = false;
                if (json.success) {
                    if (redirectToNext) {
                        if (isEmbedded) {
                            if (window.loadNcsStep) window.loadNcsStep(6);
                        } else {
                            window.location.href = '/admin/ncs/approved/6?id=' + regId;
                        }
                        return;
                    }
                    alert('저장되었습니다.');
                } else {
                    alert(json.error || '저장 실패');
                }
            }).catch(function () {
                if (btnSave) btnSave.disabled = false;
                if (btnNext) btnNext.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
        }

        var btnSave5 = document.getElementById('ncsStep5BtnSave');
        var btnNext5 = document.getElementById('ncsStep5BtnNext');
        if (btnSave5) btnSave5.addEventListener('click', function () { saveEvaluation(false); });
        if (btnNext5) btnNext5.addEventListener('click', function () { saveEvaluation(true); });
    }

    function initStep6() {
        var regInput = document.getElementById('ncsApprovedRegIdStep6');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep6NoReg');
        var form = document.getElementById('ncsStep6Form');

        if (!form) return;
        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var allFacilities = [];
        var allEquipment = [];
        var curriculum = [];

        function getToken() { return localStorage.getItem('token'); }
        function apiFetch(url) {
            var t = getToken();
            return fetch(url, { headers: t ? { 'Authorization': 'Bearer ' + t } : {} }).then(function (r) { return r.json(); });
        }

        function createDualList(title, type, allItems, selectedIds) {
            var selectedIdsSet = new Set(selectedIds || []);
            var availableItems = allItems.filter(function (it) { return !selectedIdsSet.has(it.id); });
            var selectedItems = allItems.filter(function (it) { return selectedIdsSet.has(it.id); });

            var itemHtml = function (it) {
                return '<div class="list-item" data-id="' + it.id + '">' + (it.name || '') + (it.room_number ? ' (' + it.room_number + ')' : '') + '</div>';
            };

            return '<div class="flex-1 space-y-3">' +
                '<div class="flex items-center gap-2 mb-3">' +
                '<span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>' +
                '<h5 class="text-xs font-black text-slate-500 uppercase tracking-widest">' + title + '</h5>' +
                '</div>' +
                '<div class="dual-list-container" data-type="' + type + '">' +
                '<!-- Available List -->' +
                '<div class="list-box-wrapper">' +
                '<div class="list-box-header">전체 목록</div>' +
                '<div class="px-3 py-2 border-b border-slate-100 bg-slate-50/30">' +
                '<input type="text" class="list-box-filter w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="필터링..."></div>' +
                '<div class="list-content available-list flex-1">' + availableItems.map(itemHtml).join('') + '</div>' +
                '</div>' +
                '<!-- Transfer Buttons -->' +
                '<div class="flex flex-row lg:flex-col justify-center items-center gap-1.5 px-1">' +
                '<button type="button" class="list-btn btn-move-right w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"><i class="fas fa-angle-right lg:rotate-0 rotate-90"></i></button>' +
                '<button type="button" class="list-btn btn-move-all-right w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"><i class="fas fa-angle-double-right lg:rotate-0 rotate-90"></i></button>' +
                '<button type="button" class="list-btn btn-move-left w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"><i class="fas fa-angle-left lg:rotate-0 rotate-90"></i></button>' +
                '<button type="button" class="list-btn btn-move-all-left w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"><i class="fas fa-angle-double-left lg:rotate-0 rotate-90"></i></button>' +
                '</div>' +
                '<!-- Selected List -->' +
                '<div class="list-box-wrapper">' +
                '<div class="list-box-header">선택된 목록</div>' +
                '<div class="px-3 py-2 border-b border-slate-100 bg-slate-50/30">' +
                '<input type="text" class="list-box-filter w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="필터링..."></div>' +
                '<div class="list-content selected-list flex-1">' + selectedItems.map(itemHtml).join('') + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function renderSubjectCard(item) {
            var esc = function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
            var selectedFacilities = [];
            try { selectedFacilities = item.facility_ids_json ? JSON.parse(item.facility_ids_json) : []; } catch (e) { }
            var selectedEquipment = [];
            try { selectedEquipment = item.equipment_ids_json ? JSON.parse(item.equipment_ids_json) : []; } catch (e) { }

            var typeLabel = item.type === 'ncs' ? 'NCS 전공교과' : (item.type === 'basic' ? 'NCS 소양교과' : '비 NCS 교과');
            var hours = (Number(item.theory_hours) || 0) + (Number(item.practice_hours) || 0);

            return '<div class="step6-subject-card bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md transition-all mb-12" data-id="' + item.id + '">' +
                '<div class="flex items-center gap-4 mb-10">' +
                '<div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">' +
                '<i class="fas fa-graduation-cap"></i>' +
                '</div>' +
                '<div>' +
                '<h4 class="text-2xl font-black text-slate-800 tracking-tight">' + esc(item.name) + '</h4>' +
                '<p class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">' + typeLabel + ' <span class="mx-2 opacity-50">|</span> ' + hours + ' 훈련시간</p>' +
                '</div>' +
                '</div>' +
                '<div class="flex flex-col xl:flex-row gap-12">' +
                createDualList('시설(강의실/실습실) 매칭', 'facilities', allFacilities, selectedFacilities) +
                createDualList('장비 및 기자재 매칭', 'equipment', allEquipment, selectedEquipment) +
                '</div>' +
                '</div>';
        }

        function wireEvents() {
            form.addEventListener('click', function (e) {
                var item = e.target.closest('.list-item');
                if (item) {
                    item.classList.toggle('selected');
                    return;
                }

                var btn = e.target.closest('.list-btn');
                if (!btn) return;

                var container = btn.closest('.dual-list-container');
                var leftList = container.querySelector('.available-list');
                var rightList = container.querySelector('.selected-list');

                if (btn.classList.contains('btn-move-right')) {
                    leftList.querySelectorAll('.list-item.selected').forEach(function (el) {
                        el.classList.remove('selected');
                        rightList.appendChild(el);
                    });
                } else if (btn.classList.contains('btn-move-all-right')) {
                    leftList.querySelectorAll('.list-item').forEach(function (el) {
                        el.classList.remove('selected');
                        rightList.appendChild(el);
                    });
                } else if (btn.classList.contains('btn-move-left')) {
                    rightList.querySelectorAll('.list-item.selected').forEach(function (el) {
                        el.classList.remove('selected');
                        leftList.appendChild(el);
                    });
                } else if (btn.classList.contains('btn-move-all-left')) {
                    rightList.querySelectorAll('.list-item').forEach(function (el) {
                        el.classList.remove('selected');
                        leftList.appendChild(el);
                    });
                }
            });

            form.addEventListener('input', function (e) {
                if (e.target.classList.contains('list-box-filter')) {
                    var val = e.target.value.toLowerCase();
                    var list = e.target.closest('.list-box-wrapper').querySelector('.list-content');
                    list.querySelectorAll('.list-item').forEach(function (item) {
                        var text = item.textContent.toLowerCase();
                        item.style.display = text.indexOf(val) !== -1 ? '' : 'none';
                    });
                }
            });
        }

        Promise.all([
            apiFetch('/api/ncs/approved/facilities'),
            apiFetch('/api/ncs/approved/hrd-items?category=equipment'),
            apiFetch('/api/ncs/approved/registrations/' + regId + '/facilities-equipment')
        ]).then(function (results) {
            allFacilities = results[0].success ? results[0].data : [];
            allEquipment = results[1].success ? results[1].data : [];
            curriculum = results[2].success ? results[2].data : [];

            form.innerHTML = curriculum.length ? curriculum.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-12">등록된 교과목이 없습니다.</p>';
            wireEvents();
        }).catch(function (err) {
            console.error(err);
            alert('정보를 불러오는데 실패했습니다.');
        });

        function saveFacilities(redirectToNext) {
            var items = [];
            document.querySelectorAll('.step6-subject-card').forEach(function (card) {
                var id = parseInt(card.getAttribute('data-id'), 10);
                var facilityIds = [];
                card.querySelectorAll('.dual-list-container[data-type="facilities"] .selected-list .list-item').forEach(function (el) {
                    facilityIds.push(parseInt(el.getAttribute('data-id'), 10));
                });
                var equipmentIds = [];
                card.querySelectorAll('.dual-list-container[data-type="equipment"] .selected-list .list-item').forEach(function (el) {
                    equipmentIds.push(parseInt(el.getAttribute('data-id'), 10));
                });

                items.push({
                    id: id,
                    facility_ids: facilityIds,
                    equipment_ids: equipmentIds
                });
            });

            var btnSave = document.getElementById('ncsStep6BtnSave');
            var btnNext = document.getElementById('ncsStep6BtnNext');
            if (btnSave) btnSave.disabled = true;
            if (btnNext) btnNext.disabled = true;
            var t = getToken();
            fetch('/api/ncs/approved/registrations/' + regId + '/facilities-equipment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                body: JSON.stringify({ items: items })
            }).then(function (r) { return r.json(); }).then(function (json) {
                if (btnSave) btnSave.disabled = false;
                if (btnNext) btnNext.disabled = false;
                if (json.success) {
                    if (redirectToNext) {
                        if (isEmbedded) {
                            alert('모든 설정이 완료되었습니다.');
                            if (window.loadNcsStep) window.loadNcsStep(1);
                        } else {
                            window.location.href = '/admin/ncs/approved/list';
                        }
                        return;
                    }
                    alert('저장되었습니다.');
                } else {
                    alert(json.error || '저장 실패');
                }
            }).catch(function () {
                if (btnSave) btnSave.disabled = false;
                if (btnNext) btnNext.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
        }

        var btnSave6 = document.getElementById('ncsStep6BtnSave');
        var btnNext6 = document.getElementById('ncsStep6BtnNext');
        if (btnSave6) btnSave6.addEventListener('click', function () { saveFacilities(false); });
        if (btnNext6) btnNext6.addEventListener('click', function () { saveFacilities(true); });
    }

    window.loadNcsStep = function (stepNum) {
        if (!window.NCS_EMBED_COURSE_ID) return;
        var url = '/api/ncs/approved/render-step?step=' + stepNum + '&courseId=' + window.NCS_EMBED_COURSE_ID;
        var token = localStorage.getItem('token');
        fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) { return r.text(); })
            .then(function (html) {
                var container = document.getElementById('ncsApprovedStepContent');
                if (container) {
                    container.innerHTML = html;
                    window.NCS_CURRENT_STEP = stepNum;

                    // Update Sidebar Active State
                    document.querySelectorAll('[id^="ncsStepLink_"]').forEach(function (btn) {
                        var s = parseInt(btn.id.split('_')[1], 10);
                        if (s === stepNum) {
                            btn.className = 'w-full flex items-center px-4 py-3 rounded-xl transition-all mb-1 bg-blue-600/10 text-blue-700 font-bold';
                        } else {
                            btn.className = 'w-full flex items-center px-4 py-3 rounded-xl transition-all mb-1 hover:bg-slate-50 text-slate-500 hover:text-slate-700';
                        }
                    });

                    // Initialize scripts
                    if (window.initNcsStepScripts) window.initNcsStepScripts(stepNum);

                    // Prevent Enter key from submitting form within steps
                    container.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                            e.preventDefault();
                        }
                    });
                }

            })
            .catch(function (e) {
                alert('단계 로딩 실패');
                console.error(e);
            });
    };

    window.initNcsStepScripts = function (s) {
        if (s === 1) initStep1();
        else if (s === 2) initStep2();
        else if (s === 3) initStep3();
        else if (s === 4) initStep4();
        else if (s === 5) initStep5();
        else if (s === 6) initStep6();
    };

    ensureRegistrationId().then(function () {
        if (step === 1) initStep1();
        else if (step === 2) initStep2();
        else if (step === 3) initStep3();
        else if (step === 4) initStep4();
        else if (step === 5) initStep5();
        else if (step === 6) initStep6();
    });

    // Global prevention for Enter key submission in NCS containers
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            var container = e.target.closest('#ncsApprovedStepContent, #approvedRegisterForm');
            if (container) {
                e.preventDefault();
            }
        }
    });

})();

