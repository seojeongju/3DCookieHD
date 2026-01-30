(function() {
    var step = window.NCS_APPROVED_STEP || 1;
    var trainingCache = [];

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
            tabNcsOnly.classList.add('bg-emerald-600', 'text-white');
            tabNcsOnly.classList.remove('bg-slate-100', 'text-slate-600');
            tabNonNcs.classList.remove('bg-emerald-600', 'text-white');
            tabNonNcs.classList.add('bg-slate-100', 'text-slate-600');
            panelNcsOnly.classList.remove('hidden');
            if (panelNonNcs) panelNonNcs.classList.add('hidden');
        }
        function showNonNcs() {
            tabNonNcs.classList.add('bg-emerald-600', 'text-white');
            tabNonNcs.classList.remove('bg-slate-100', 'text-slate-600');
            tabNcsOnly.classList.remove('bg-emerald-600', 'text-white');
            tabNcsOnly.classList.add('bg-slate-100', 'text-slate-600');
            if (panelNonNcs) panelNonNcs.classList.remove('hidden');
            panelNcsOnly.classList.add('hidden');
        }

        tabNcsOnly.addEventListener('click', showNcs);
        if (tabNonNcs) tabNonNcs.addEventListener('click', showNonNcs);

        var largeClass = document.getElementById('ncsLargeClass');
        var midClass = document.getElementById('ncsMidClass');
        var smallClass = document.getElementById('ncsSmallClass');
        var jobSelect = document.getElementById('ncsJobSelect');
        var mainJobPill = document.getElementById('ncsMainJobPill');
        var mainJobPlaceholder = document.getElementById('ncsMainJobPlaceholder');

        if (!largeClass) return;

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
            (list || []).forEach(function(it) {
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
                .then(function(r) { return r.json(); })
                .then(function(json) {
                    if (json.success && Array.isArray(json.data) && json.data.length) fillLargeClass(json.data);
                    else fillLargeClass(largeClassesFallback);
                })
                .catch(function() { fillLargeClass(largeClassesFallback); });
        }

        function clearSelect(sel) {
            if (!sel) return;
            sel.innerHTML = '<option value="">선택</option>';
        }
        function clearJobSelect() {
            if (jobSelect) jobSelect.innerHTML = '';
        }
        function clearUnitHidden() {
            if (unitCodeInput) unitCodeInput.value = '';
            if (unitNameInput) unitNameInput.value = '';
        }
        function updatePill(code, name) {
            if (!mainJobPill || !mainJobPlaceholder) return;
            mainJobPlaceholder.style.display = code && name ? 'none' : '';
            var wrap = mainJobPill.querySelector('.ncs-main-job-pill-wrap');
            if (wrap) wrap.remove();
            if (code && name) {
                var esc = function(s) { var t = document.createElement('span'); t.textContent = s; return t.innerHTML; };
                var w = document.createElement('div');
                w.className = 'ncs-main-job-pill-wrap inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm';
                w.innerHTML = '<span>● 주직종선택 ' + esc(code + (name ? '. ' + name : '')) + '</span><button type="button" class="ncs-main-job-remove text-red-500 hover:text-red-700"><i class="fas fa-times"></i></button>';
                mainJobPill.appendChild(w);
                w.querySelector('.ncs-main-job-remove').addEventListener('click', function() {
                    clearUnitHidden();
                    updatePill('', '');
                    if (jobSelect) jobSelect.selectedIndex = -1;
                });
            }
        }

        function loadTrainingByLarge() {
            var code = largeClass.value;
            clearUnitHidden();
            updatePill('', '');
            if (!code) {
                trainingCache = [];
                clearSelect(midClass);
                clearSelect(smallClass);
                clearJobSelect();
                return Promise.resolve();
            }
            var url = '/api/ncs/approved/training?ncsLclasCd=' + encodeURIComponent(code);
            var token = localStorage.getItem('token');
            return fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function(r) { return r.json(); })
                .then(function(json) {
                    if (!json.success || !json.data) {
                        trainingCache = [];
                        clearSelect(midClass);
                        clearSelect(smallClass);
                        clearJobSelect();
                        return;
                    }
                    trainingCache = json.data;
                    var seen = {};
                    var opts = ['<option value="">선택</option>'];
                    trainingCache.forEach(function(item) {
                        var k = item.midCode + '|' + item.midName;
                        if (!seen[k]) {
                            seen[k] = true;
                            opts.push('<option value="' + (item.midCode || '').replace(/"/g, '&quot;') + '">' + (item.midName || '').replace(/</g, '&lt;') + '</option>');
                        }
                    });
                    midClass.innerHTML = opts.join('');
                    clearSelect(smallClass);
                    clearJobSelect();
                })
                .catch(function() {
                    trainingCache = [];
                    clearSelect(midClass);
                    clearSelect(smallClass);
                    clearJobSelect();
                });
        }

        function loadSmallByMid() {
            var mid = midClass.value;
            clearUnitHidden();
            updatePill('', '');
            clearJobSelect();
            if (!mid) {
                clearSelect(smallClass);
                return;
            }
            var list = trainingCache.filter(function(item) { return item.midCode === mid; });
            var seen = {};
            var opts = ['<option value="">선택</option>'];
            list.forEach(function(item) {
                var k = (item.smallCode || '') + '|' + (item.smallName || '');
                if (!seen[k]) {
                    seen[k] = true;
                    var sc = (item.smallCode || '').replace(/"/g, '&quot;');
                    var sn = (item.smallName || '').replace(/</g, '&lt;');
                    opts.push('<option value="' + sc + '">' + (item.smallCode ? item.smallCode + '. ' : '') + sn + '</option>');
                }
            });
            smallClass.innerHTML = opts.join('');
        }

        function loadJobBySmall() {
            var mid = midClass.value;
            var small = smallClass.value;
            clearUnitHidden();
            updatePill('', '');
            if (!jobSelect) return;
            jobSelect.innerHTML = '';
            if (!mid || !small) return;
            var list = trainingCache.filter(function(item) { return item.midCode === mid && item.smallCode === small; });
            list.forEach(function(item) {
                var opt = document.createElement('option');
                opt.value = (item.unitCode || '').replace(/"/g, '&quot;');
                opt.setAttribute('data-code', (item.unitCode || '').replace(/"/g, '&quot;'));
                opt.setAttribute('data-name', (item.unitName || item.smallName || '').replace(/"/g, '&quot;'));
                opt.textContent = (item.unitCode ? item.unitCode + '. ' : '') + (item.unitName || item.smallName || '');
                jobSelect.appendChild(opt);
            });
        }

        function onJobSelectChange() {
            var opt = jobSelect && jobSelect.options[jobSelect.selectedIndex];
            if (opt && opt.value) {
                var code = opt.getAttribute('data-code') || opt.value;
                var name = opt.getAttribute('data-name') || opt.textContent || '';
                if (unitCodeInput) unitCodeInput.value = code || '';
                if (unitNameInput) unitNameInput.value = name || '';
                updatePill(code, name);
            } else {
                clearUnitHidden();
                updatePill('', '');
            }
        }

        largeClass.addEventListener('change', loadTrainingByLarge);
        midClass.addEventListener('change', loadSmallByMid);
        smallClass.addEventListener('change', loadJobBySmall);
        if (jobSelect) jobSelect.addEventListener('change', onJobSelectChange);

        function buildPayload() {
            var ncsTab = panelNonNcs && panelNonNcs.classList.contains('hidden') ? 'ncs' : 'non_ncs';
            var courseTypeEl = document.querySelector('input[name="courseType"]:checked');
            var courseType = courseTypeEl ? courseTypeEl.value : '';
            var courseNameEl = document.getElementById('ncsCourseName');
            var levelEl = document.getElementById('ncsTrainingLevel');
            var prereqEl = document.getElementById('ncsPrereqSkill');
            var payload = {
                ncs_tab: ncsTab,
                course_type: courseType || null,
                main_job_code: (unitCodeInput && unitCodeInput.value) ? unitCodeInput.value.trim() : null,
                main_job_name: (unitNameInput && unitNameInput.value) ? unitNameInput.value.trim() : null,
                overview_content: (document.getElementById('ncsOverviewContent') && document.getElementById('ncsOverviewContent').value) ? document.getElementById('ncsOverviewContent').value.trim() : null,
                dev_category: (document.getElementById('ncsDevCategory') && document.getElementById('ncsDevCategory').value) ? document.getElementById('ncsDevCategory').value.trim() : null,
                large_code: largeClass.value || null,
                mid_code: midClass.value || null,
                small_code: smallClass.value || null,
                unit_code: (unitCodeInput && unitCodeInput.value) ? unitCodeInput.value.trim() : null,
                unit_name: (unitNameInput && unitNameInput.value) ? unitNameInput.value.trim() : null,
                non_ncs_course_name: (document.getElementById('nonNcsCourseName') && document.getElementById('nonNcsCourseName').value) ? document.getElementById('nonNcsCourseName').value.trim() : null,
                non_ncs_overview: (document.getElementById('nonNcsOverview') && document.getElementById('nonNcsOverview').value) ? document.getElementById('nonNcsOverview').value.trim() : null,
                course_name: (courseNameEl && courseNameEl.value) ? courseNameEl.value.trim() : null,
                training_level: (levelEl && levelEl.value) ? levelEl.value.trim() : null,
                prereq_skill: (prereqEl && prereqEl.value) ? prereqEl.value.trim() : null
            };
            return payload;
        }

        function doSave() {
            var payload = buildPayload();
            var url = editId ? '/api/ncs/approved/registrations/' + editId : '/api/ncs/approved/registrations';
            var method = editId ? 'PUT' : 'POST';
            var token = localStorage.getItem('token');
            var btn = document.getElementById('ncsApprovedBtnSave');
            if (btn) btn.disabled = true;
            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
                body: JSON.stringify(payload)
            })
                .then(function(r) { return r.json(); })
                .then(function(json) {
                    if (btn) btn.disabled = false;
                    if (json.success) {
                        window.location.href = '/admin/ncs/approved/list';
                        return;
                    }
                    alert(json.error || '저장 실패');
                })
                .catch(function() {
                    if (btn) btn.disabled = false;
                    alert('저장 중 오류가 발생했습니다.');
                });
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
                .then(function(r) { return r.json(); })
                .then(function(json) {
                    if (btn) btn.disabled = false;
                    if (json.success) {
                        window.location.href = '/admin/ncs/approved/list';
                        return;
                    }
                    alert(json.error || '삭제 실패');
                })
                .catch(function() {
                    if (btn) btn.disabled = false;
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }

        var saveBtn = document.getElementById('ncsApprovedBtnSave');
        if (saveBtn) saveBtn.addEventListener('click', doSave);
        var delBtn = document.getElementById('ncsApprovedBtnDelete');
        if (delBtn) delBtn.addEventListener('click', doDelete);

        function setRegDate(val) {
            var el = document.getElementById('ncsRegDate');
            if (el) el.value = val || '';
        }

        function loadForEdit() {
            if (!editId) return;
            var token = localStorage.getItem('token');
            fetch('/api/ncs/approved/registrations/' + editId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function(r) { return r.json(); })
                .then(function(json) {
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
                    var tl = document.getElementById('ncsTrainingLevel');
                    if (tl) tl.value = d.training_level || '';
                    var ps = document.getElementById('ncsPrereqSkill');
                    if (ps) ps.value = d.prereq_skill || '';
                    setRegDate((d.created_at || '').slice(0, 10));
                    if (!d.large_code || !largeClass) return;
                    largeClass.value = d.large_code;
                    loadTrainingByLarge().then(function() {
                        midClass.value = d.mid_code || '';
                        loadSmallByMid();
                        smallClass.value = d.small_code || '';
                        loadJobBySmall();
                        var ucode = d.unit_code || d.main_job_code;
                        var found = false;
                        if (jobSelect) {
                            for (var i = 0; i < jobSelect.options.length; i++) {
                                if (jobSelect.options[i].value === ucode) {
                                    jobSelect.selectedIndex = i;
                                    found = true;
                                    onJobSelectChange();
                                    break;
                                }
                            }
                        }
                        if (!found && (d.main_job_code || d.main_job_name)) {
                            if (unitCodeInput) unitCodeInput.value = d.unit_code || d.main_job_code || '';
                            if (unitNameInput) unitNameInput.value = d.unit_name || d.main_job_name || '';
                            updatePill(d.unit_code || d.main_job_code, d.unit_name || d.main_job_name);
                        }
                    });
                })
                .catch(function() { alert('조회 실패'); });
        }

        loadLargeClasses().then(function() {
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

    if (step === 1) initStep1();
})();
