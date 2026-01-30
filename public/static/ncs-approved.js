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
        var mainJob = document.getElementById('ncsMainJob');

        if (!largeClass) return;

        if (largeClass.options.length <= 1) {
            largeClass.innerHTML = '<option value="">선택</option><option value="01">사업관리</option><option value="15">기계</option><option value="20">정보통신</option>';
        }

        function clearSelect(sel) {
            if (!sel) return;
            sel.innerHTML = '<option value="">선택</option>';
        }
        function clearUnitHidden() {
            if (unitCodeInput) unitCodeInput.value = '';
            if (unitNameInput) unitNameInput.value = '';
        }

        function loadTrainingByLarge() {
            var code = largeClass.value;
            clearUnitHidden();
            if (!code) {
                trainingCache = [];
                clearSelect(midClass);
                clearSelect(smallClass);
                if (mainJob) mainJob.value = '';
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
                    if (mainJob) mainJob.value = '';
                })
                .catch(function() {
                    trainingCache = [];
                    clearSelect(midClass);
                    clearSelect(smallClass);
                });
        }

        function loadSmallByMid() {
            var mid = midClass.value;
            clearUnitHidden();
            if (!mid) {
                clearSelect(smallClass);
                if (mainJob) mainJob.value = '';
                return;
            }
            var list = trainingCache.filter(function(item) { return item.midCode === mid; });
            var opts = ['<option value="">선택</option>'];
            list.forEach(function(item) {
                var code = (item.unitCode || '').replace(/"/g, '&quot;');
                var name = (item.unitName || item.smallName || '').replace(/</g, '&lt;');
                opts.push('<option value="' + code + '" data-code="' + code + '" data-name="' + name.replace(/"/g, '&quot;') + '">' + (item.unitCode ? item.unitCode + '. ' : '') + name + '</option>');
            });
            smallClass.innerHTML = opts.join('');
            if (mainJob) mainJob.value = '';
        }

        function onSmallChange() {
            var opt = smallClass.options[smallClass.selectedIndex];
            if (mainJob && opt && opt.value) {
                var code = opt.getAttribute('data-code') || opt.value;
                var name = opt.getAttribute('data-name') || opt.text;
                mainJob.value = (code ? code + '. ' : '') + name;
                if (unitCodeInput) unitCodeInput.value = code || '';
                if (unitNameInput) unitNameInput.value = name || '';
            } else {
                if (mainJob) mainJob.value = '';
                clearUnitHidden();
            }
        }

        largeClass.addEventListener('change', loadTrainingByLarge);
        midClass.addEventListener('change', loadSmallByMid);
        smallClass.addEventListener('change', onSmallChange);

        function buildPayload() {
            var ncsTab = panelNonNcs && panelNonNcs.classList.contains('hidden') ? 'ncs' : 'non_ncs';
            var courseTypeEl = document.querySelector('input[name="courseType"]:checked');
            var courseType = courseTypeEl ? courseTypeEl.value : '';
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
                non_ncs_overview: (document.getElementById('nonNcsOverview') && document.getElementById('nonNcsOverview').value) ? document.getElementById('nonNcsOverview').value.trim() : null
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
                        return;
                    }
                    showNcs();
                    var ct = document.querySelector('input[name="courseType"][value="' + (d.course_type || '향상') + '"]');
                    if (ct) ct.checked = true;
                    var ov = document.getElementById('ncsOverviewContent');
                    if (ov) ov.value = d.overview_content || '';
                    var dev = document.getElementById('ncsDevCategory');
                    if (dev) dev.value = d.dev_category || '';
                    if (mainJob) mainJob.value = (d.main_job_code ? d.main_job_code + '. ' : '') + (d.main_job_name || '');
                    if (unitCodeInput) unitCodeInput.value = d.unit_code || d.main_job_code || '';
                    if (unitNameInput) unitNameInput.value = d.unit_name || d.main_job_name || '';
                    if (!d.large_code || !largeClass) return;
                    largeClass.value = d.large_code;
                    loadTrainingByLarge().then(function() {
                        midClass.value = d.mid_code || '';
                        loadSmallByMid();
                        var ucode = d.unit_code || d.main_job_code;
                        var found = false;
                        for (var i = 0; i < smallClass.options.length; i++) {
                            if (smallClass.options[i].value === ucode) {
                                smallClass.selectedIndex = i;
                                found = true;
                                onSmallChange();
                                break;
                            }
                        }
                        if (!found && (d.main_job_code || d.main_job_name)) {
                            mainJob.value = (d.main_job_code ? d.main_job_code + '. ' : '') + (d.main_job_name || '');
                            if (unitCodeInput) unitCodeInput.value = d.unit_code || d.main_job_code || '';
                            if (unitNameInput) unitNameInput.value = d.unit_name || d.main_job_name || '';
                        }
                    });
                })
                .catch(function() { alert('조회 실패'); });
        }

        if (editId) {
            loadForEdit();
        }
    }

    if (step === 1) initStep1();
})();
