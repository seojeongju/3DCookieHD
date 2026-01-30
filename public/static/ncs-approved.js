(function () {
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
                var esc = function (s) { var t = document.createElement('span'); t.textContent = s; return t.innerHTML; };
                var w = document.createElement('div');
                w.className = 'ncs-main-job-pill-wrap inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm';
                w.innerHTML = '<span>● 주직종선택 ' + esc(code + (name ? '. ' + name : '')) + '</span><button type="button" class="ncs-main-job-remove text-red-500 hover:text-red-700"><i class="fas fa-times"></i></button>';
                mainJobPill.appendChild(w);
                w.querySelector('.ncs-main-job-remove').addEventListener('click', function () {
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
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !json.data) {
                        trainingCache = [];
                        clearSelect(midClass);
                        clearSelect(smallClass);
                        clearJobSelect();
                        return;
                    }
                    trainingCache = json.data;
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
                    clearJobSelect();
                })
                .catch(function () {
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
                opts.push('<option value="' + sc + '">' + (s.code ? s.code + '. ' : '') + sn + '</option>');
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
            var list = trainingCache.filter(function (item) { return item.midCode === mid && item.smallCode === small; });
            list.forEach(function (item) {
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

        function doSave(redirectToStep2) {
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
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (btn) btn.disabled = false;
                    if (json.success) {
                        if (redirectToStep2) {
                            var id = editId || (json.data && json.data.id);
                            window.location.href = id ? '/admin/ncs/approved/2?id=' + id : '/admin/ncs/approved/list';
                        } else {
                            window.location.href = '/admin/ncs/approved/list';
                        }
                        return;
                    }
                    alert(json.error || '저장 실패');
                })
                .catch(function () {
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
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (btn) btn.disabled = false;
                    if (json.success) {
                        window.location.href = '/admin/ncs/approved/list';
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
        if (saveBtn) saveBtn.addEventListener('click', function () { doSave(false); });
        var nextBtn = document.getElementById('ncsApprovedBtnNext');
        if (nextBtn) nextBtn.addEventListener('click', function () { doSave(true); });
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
                    var tl = document.getElementById('ncsTrainingLevel');
                    if (tl) tl.value = d.training_level || '';
                    var ps = document.getElementById('ncsPrereqSkill');
                    if (ps) ps.value = d.prereq_skill || '';
                    setRegDate((d.created_at || '').slice(0, 10));
                    if (!d.large_code || !largeClass) return;
                    largeClass.value = d.large_code;
                    loadTrainingByLarge().then(function () {
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
                .catch(function () { alert('조회 실패'); });
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
                var levels = d.levels || { 5: [], 4: [], 3: [] };
                var mainJob = d.mainJob || { code: null, name: null };
                var basicAbility = d.basicAbility || [];
                var selectedSet = {};
                (d.selected || []).forEach(function (n) { selectedSet[n] = true; });

                var rows = [];
                function addSelectableRows(levelLabel, items) {
                    (items || []).forEach(function (x) {
                        var name = (x && x.name) ? x.name : String(x);
                        if (!name) return;
                        var checked = selectedSet[name] ? ' checked' : '';
                        rows.push('<tr class="ncs-step2-selectable align-top">' +
                            '<td class="px-4 py-2"><label class="flex items-center justify-center"><input type="checkbox" class="ncs-step2-cb rounded text-blue-600" value="' + attrEsc(name) + '"' + checked + '></label></td>' +
                            '<td class="px-4 py-2 font-medium text-slate-700">' + esc(levelLabel) + '</td>' +
                            '<td class="px-4 py-2 text-slate-800">' + esc(name) + '</td></tr>');
                    });
                }
                addSelectableRows('5수준', levels[5]);
                addSelectableRows('4수준', levels[4]);
                addSelectableRows('3수준', levels[3]);
                if (basicAbility.length) addSelectableRows('직업 기초 능력', basicAbility);
                else rows.push('<tr class="align-top bg-slate-50/50"><td class="px-4 py-3"></td><td class="px-4 py-3 font-medium text-slate-700">직업 기초 능력</td><td class="px-4 py-3 text-slate-500">' + esc('선택된 직업기초 능력이 없습니다.') + '</td></tr>');

                var mainLabel = mainJob.name ? mainJob.name + (mainJob.code ? ' (' + mainJob.code + ')' : '') + ' (주직종(음영))' : '—';
                rows.push('<tr class="align-top bg-slate-50/50"><td class="px-4 py-3"></td><td class="px-4 py-3 font-medium text-slate-700">직종</td><td class="px-4 py-3 text-slate-800">' + esc(mainLabel) + '</td></tr>');

                tbody.innerHTML = rows.join('');

                var btnNext = document.getElementById('ncsStep2BtnNext');
                if (btnNext) {
                    btnNext.addEventListener('click', function () {
                        var selected = [];
                        tbody.querySelectorAll('.ncs-step2-cb:checked').forEach(function (cb) {
                            var v = (cb.value || '').trim();
                            if (v) selected.push(v);
                        });
                        btnNext.disabled = true;
                        fetch('/api/ncs/approved/registrations/' + regId + '/training-system-selection', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
                            body: JSON.stringify({ selected: selected })
                        })
                            .then(function (r) { return r.json(); })
                            .then(function (res) {
                                btnNext.disabled = false;
                                if (res.success) {
                                    window.location.href = '/admin/ncs/approved/3?id=' + regId;
                                } else {
                                    alert(res.error || '선택 저장 실패');
                                }
                            })
                            .catch(function () {
                                btnNext.disabled = false;
                                alert('선택 저장 중 오류가 발생했습니다.');
                            });
                    });
                }
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
        var jobLabel = document.getElementById('ncsCurriculumJobLabel');
        var ncsRows = document.getElementById('ncsCurriculumRows');
        var nonNcsRows = document.getElementById('nonNcsCurriculumRows');

        if (!form || !ncsRows || !nonNcsRows) return;

        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var unitList = [];
        var elementList = [];

        function esc(s) {
            if (s == null) return '';
            var el = document.createElement('span');
            el.textContent = s;
            return el.innerHTML;
        }
        function fillUnitChecks(container) {
            if (!container) return;
            container.innerHTML = '';
            unitList.forEach(function (u) {
                var label = document.createElement('label');
                label.className = 'flex items-center gap-2 text-sm text-slate-700';
                var cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'ncs-unit-cb rounded text-blue-600';
                cb.value = u.name;
                cb.dataset.name = u.name;
                label.appendChild(cb);
                label.appendChild(document.createTextNode(u.name));
                container.appendChild(label);
            });
        }
        function fillElementChecks(container) {
            if (!container) return;
            container.innerHTML = '';
            if (!elementList.length) {
                container.innerHTML = '<span class="text-slate-500 text-sm">등록된 능력단위요소가 없습니다. NCS 능력단위에 해당 직종의 요소가 등록되어 있으면 여기에 표시됩니다.</span>';
                return;
            }
            elementList.forEach(function (e) {
                var name = (e && e.name) ? e.name : String(e);
                if (!name) return;
                var label = document.createElement('label');
                label.className = 'flex items-center gap-2 text-sm text-slate-700';
                var cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'ncs-element-cb rounded text-blue-600';
                cb.value = name;
                cb.dataset.name = name;
                label.appendChild(cb);
                label.appendChild(document.createTextNode(name));
                container.appendChild(label);
            });
        }
        function updateSelected(row) {
            var sel = row && row.querySelector('.ncs-curriculum-selected');
            if (!sel) return;
            var checked = row.querySelectorAll('.ncs-unit-cb:checked');
            var names = Array.prototype.map.call(checked, function (c) { return c.value || c.dataset.name; }).filter(Boolean);
            sel.textContent = names.length ? names.join(', ') : '';
        }
        function toggleElementsSection(row, forceOpen) {
            var body = row && row.querySelector('.ncs-curriculum-elements-body');
            var btn = row && row.querySelector('.ncs-elements-toggle');
            var chevron = row && row.querySelector('.ncs-elements-chevron');
            if (!body || !btn) return;
            var open = forceOpen === undefined ? body.classList.contains('hidden') : !!forceOpen;
            if (open) {
                body.classList.remove('hidden');
                btn.setAttribute('aria-expanded', 'true');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
                if (chevron) chevron.style.transform = '';
            }
        }
        function updateElementsSectionVisibility(row) {
            var checked = row && row.querySelectorAll('.ncs-unit-cb:checked');
            var hasChecked = checked && checked.length > 0;
            toggleElementsSection(row, hasChecked);
        }
        function wireUnitChecks(row) {
            var container = row.querySelector('.ncs-curriculum-unit-checks');
            if (!container) return;
            container.addEventListener('change', function () {
                updateSelected(row);
                updateElementsSectionVisibility(row);
            });
            var toggleBtn = row.querySelector('.ncs-elements-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function () {
                    toggleElementsSection(row);
                });
            }
        }
        function addNcsRow() {
            var first = ncsRows.querySelector('.ncs-curriculum-row');
            if (!first) return;
            var clone = first.cloneNode(true);
            clone.querySelectorAll('input').forEach(function (i) { i.value = ''; });
            var checks = clone.querySelector('.ncs-curriculum-unit-checks');
            if (checks) checks.innerHTML = '';
            var elChecks = clone.querySelector('.ncs-curriculum-element-checks');
            if (elChecks) elChecks.innerHTML = '';
            ncsRows.appendChild(clone);
            fillUnitChecks(clone.querySelector('.ncs-curriculum-unit-checks'));
            fillElementChecks(clone.querySelector('.ncs-curriculum-element-checks'));
            wireUnitChecks(clone);
            toggleElementsSection(clone, false);
        }
        function delNcsRow() {
            var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
            if (rows.length <= 1) return;
            rows[rows.length - 1].remove();
        }
        function addNonNcsRow() {
            var first = nonNcsRows.querySelector('.nonncs-curriculum-row');
            if (!first) return;
            var clone = first.cloneNode(true);
            clone.querySelectorAll('input, select').forEach(function (i) { i.value = ''; });
            var u = clone.querySelector('.nonncs-units');
            if (u) {
                u.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="단원명 입력"><button type="button" class="nonncs-unit-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-unit-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
            }
            var o = clone.querySelector('.nonncs-objectives');
            if (o) {
                o.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-obj-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="학습목표(수행준거) 입력"><button type="button" class="nonncs-obj-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-obj-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
            }
            nonNcsRows.appendChild(clone);
            wireNonNcsRow(clone);
        }
        function delNonNcsRow() {
            var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
            if (rows.length <= 1) return;
            rows[rows.length - 1].remove();
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
                if (items.length <= 1) return;
                items[items.length - 1].remove();
            }
            function addObj() {
                var t = objs.querySelector('.flex');
                if (!t) return;
                var div = t.cloneNode(true);
                div.querySelector('input').value = '';
                objs.appendChild(div);
            }
            function delObj() {
                var items = objs.querySelectorAll('.flex');
                if (items.length <= 1) return;
                items[items.length - 1].remove();
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

        function buildCurriculumPayload() {
            var items = [];
            ncsRows.querySelectorAll('.ncs-curriculum-row').forEach(function (row) {
                var nameEl = row.querySelector('.ncs-curriculum-name');
                var name = (nameEl && nameEl.value) ? nameEl.value.trim() : '';
                var ability_units = [];
                row.querySelectorAll('.ncs-unit-cb:checked').forEach(function (cb) {
                    var v = (cb.value || cb.dataset.name || '').trim();
                    if (v) ability_units.push(v);
                });
                items.push({ type: 'ncs', name: name, ability_units: ability_units });
            });
            nonNcsRows.querySelectorAll('.nonncs-curriculum-row').forEach(function (row) {
                var nameEl = row.querySelector('.nonncs-curriculum-name');
                var classEl = row.querySelector('.nonncs-curriculum-class');
                var name = (nameEl && nameEl.value) ? nameEl.value.trim() : '';
                var classification = (classEl && classEl.value) ? classEl.value.trim() : '';
                var units = [];
                row.querySelectorAll('.nonncs-unit-item').forEach(function (i) {
                    var v = (i.value || '').trim();
                    if (v) units.push(v);
                });
                var objectives = [];
                row.querySelectorAll('.nonncs-obj-item').forEach(function (i) {
                    var v = (i.value || '').trim();
                    if (v) objectives.push(v);
                });
                items.push({ type: 'non_ncs', name: name, classification: classification, units: units, objectives: objectives });
            });
            return { items: items };
        }

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
                            window.location.href = '/admin/ncs/approved/4?id=' + regId;
                            return;
                        }
                        return;
                    }
                    alert(json.error || '저장 실패');
                })
                .catch(function () {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    alert('저장 중 오류가 발생했습니다.');
                });
        }

        function loadCurriculum() {
            var t = localStorage.getItem('token');
            fetch('/api/ncs/approved/registrations/' + regId + '/curriculum', { headers: t ? { 'Authorization': 'Bearer ' + t } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !Array.isArray(json.data)) return;
                    var items = json.data;
                    var ncsItems = items.filter(function (i) { return (i.type || '') === 'ncs'; });
                    var nonItems = items.filter(function (i) { return (i.type || '') === 'non_ncs'; });

                    function ensureNcsRows(n) {
                        var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
                        while (rows.length < n) { addNcsRow(); rows = ncsRows.querySelectorAll('.ncs-curriculum-row'); }
                        while (rows.length > n && rows.length > 1) { delNcsRow(); rows = ncsRows.querySelectorAll('.ncs-curriculum-row'); }
                    }
                    function ensureNonRows(n) {
                        var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                        while (rows.length < n) { addNonNcsRow(); rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row'); }
                        while (rows.length > n && rows.length > 1) { delNonNcsRow(); rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row'); }
                    }
                    ensureNcsRows(Math.max(1, ncsItems.length));
                    ensureNonRows(Math.max(1, nonItems.length));

                    var ncsR = ncsRows.querySelectorAll('.ncs-curriculum-row');
                    ncsItems.forEach(function (it, i) {
                        var row = ncsR[i];
                        if (!row) return;
                        var ne = row.querySelector('.ncs-curriculum-name');
                        if (ne) ne.value = it.name || '';
                        var ab = [];
                        try { ab = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (_) { }
                        row.querySelectorAll('.ncs-unit-cb').forEach(function (cb) {
                            cb.checked = ab.indexOf(cb.value || cb.dataset.name || '') !== -1;
                        });
                        updateSelected(row);
                        updateElementsSectionVisibility(row);
                    });
                    var nonR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                    nonItems.forEach(function (it, i) {
                        var row = nonR[i];
                        if (!row) return;
                        var ce = row.querySelector('.nonncs-curriculum-class');
                        if (ce) ce.value = it.classification || '';
                        var ne = row.querySelector('.nonncs-curriculum-name');
                        if (ne) ne.value = it.name || '';
                        var uu = row.querySelector('.nonncs-units');
                        var oo = row.querySelector('.nonncs-objectives');
                        var units = [];
                        try { units = it.units_json ? JSON.parse(it.units_json) : []; } catch (_) { }
                        var objs = [];
                        try { objs = it.objectives_json ? JSON.parse(it.objectives_json) : []; } catch (_) { }
                        var flexTpl = '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="단원명 입력"><button type="button" class="nonncs-unit-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-unit-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
                        var objTpl = '<div class="flex gap-2"><input type="text" class="nonncs-obj-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="학습목표(수행준거) 입력"><button type="button" class="nonncs-obj-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-obj-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
                        function attrEsc(s) {
                            return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        }
                        if (uu) {
                            uu.innerHTML = units.length ? units.map(function (u) {
                                return '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="단원명 입력" value="' + attrEsc(u) + '"><button type="button" class="nonncs-unit-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-unit-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
                            }).join('') : flexTpl;
                        }
                        if (oo) {
                            oo.innerHTML = objs.length ? objs.map(function (o) {
                                return '<div class="flex gap-2"><input type="text" class="nonncs-obj-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="학습목표(수행준거) 입력" value="' + attrEsc(o) + '"><button type="button" class="nonncs-obj-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button><button type="button" class="nonncs-obj-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button></div>';
                            }).join('') : objTpl;
                        }
                    });
                })
                .catch(function () { });
        }

        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-system', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    if (jobLabel) jobLabel.textContent = 'NCS 기반 교과';
                    unitList = [];
                } else {
                    var d = json.data;
                    var levels = d.levels || { 5: [], 4: [], 3: [] };
                    var main = d.mainJob || { name: null };
                    if (jobLabel) jobLabel.textContent = main.name ? main.name : 'NCS 기반 교과';
                    if (d.selected && Array.isArray(d.selected) && d.selected.length) {
                        unitList = d.selected.map(function (n) { return { name: n }; });
                    } else {
                        unitList = (levels[5] || []).concat(levels[4] || []).concat(levels[3] || []);
                    }
                    elementList = (d.elements && Array.isArray(d.elements)) ? d.elements : [];
                }
                var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
                rows.forEach(function (r) {
                    fillUnitChecks(r.querySelector('.ncs-curriculum-unit-checks'));
                    fillElementChecks(r.querySelector('.ncs-curriculum-element-checks'));
                    wireUnitChecks(r);
                    toggleElementsSection(r, false);
                });
                var nonNcsR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                nonNcsR.forEach(function (r) { wireNonNcsRow(r); });
                loadCurriculum();
            })
            .catch(function () {
                if (jobLabel) jobLabel.textContent = 'NCS 기반 교과';
                unitList = [];
                elementList = [];
                var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
                rows.forEach(function (r) {
                    fillUnitChecks(r.querySelector('.ncs-curriculum-unit-checks'));
                    fillElementChecks(r.querySelector('.ncs-curriculum-element-checks'));
                    wireUnitChecks(r);
                    toggleElementsSection(r, false);
                });
                var nonNcsR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                nonNcsR.forEach(function (r) { wireNonNcsRow(r); });
                loadCurriculum();
            });

        var addNcs = document.getElementById('ncsCurriculumBtnAdd');
        var delNcs = document.getElementById('ncsCurriculumBtnDel');
        if (addNcs) addNcs.addEventListener('click', addNcsRow);
        if (delNcs) delNcs.addEventListener('click', delNcsRow);
        var addNon = document.getElementById('nonNcsCurriculumBtnAdd');
        var delNon = document.getElementById('nonNcsCurriculumBtnDel');
        if (addNon) addNon.addEventListener('click', addNonNcsRow);
        if (delNon) delNon.addEventListener('click', delNonNcsRow);
        var btnSave = document.getElementById('ncsStep3BtnSave');
        var btnNext = document.getElementById('ncsStep3BtnNext');
        if (btnSave) btnSave.addEventListener('click', function () { saveCurriculum(false); });
        if (btnNext) btnNext.addEventListener('click', function () { saveCurriculum(true); });
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
                            window.location.href = '/admin/ncs/approved/5?id=' + regId;
                            return;
                        }
                        return;
                    }
                    alert(json.error || '저장 실패');
                })
                .catch(function () {
                    if (btnSave) btnSave.disabled = false;
                    if (btnNext) btnNext.disabled = false;
                    alert('저장 중 오류가 발생했습니다.');
                });
        }

        function switchTab(tabName) {
            document.querySelectorAll('.ncs-step4-tab').forEach(function (btn) {
                btn.classList.remove('bg-emerald-600', 'text-white');
                btn.classList.add('bg-slate-100', 'text-slate-600');
            });
            document.querySelectorAll('.ncs-step4-tab-content').forEach(function (div) { div.classList.add('hidden'); });
            var activeBtn = document.querySelector('.ncs-step4-tab[data-tab="' + tabName + '"]');
            var activeContent = document.getElementById('ncsStep4TabContent' + (tabName === 'basic' ? 'Basic' : tabName === 'ncs' ? 'Ncs' : 'Nonncs'));
            if (activeBtn) { activeBtn.classList.remove('bg-slate-100', 'text-slate-600'); activeBtn.classList.add('bg-emerald-600', 'text-white'); }
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
                return '<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="ins-cb rounded text-blue-600" value="' + ins.id + '" ' + checked + '> ' + esc(ins.name) + '</label>';
            }).join('');

            var evaluatorOpts = instructors.map(function (ins) {
                var sel = item.evaluator_id == ins.id ? 'selected' : '';
                return '<option value="' + ins.id + '" ' + sel + '>' + esc(ins.name) + '</option>';
            }).join('');

            var textbookChecks = textbooks.map(function (tx) {
                var checked = textbookIds.indexOf(tx.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="tx-cb rounded text-blue-600" value="' + tx.id + '" ' + checked + '> ' + esc(tx.name) + '</label>';
            }).join('');

            var materialChecks = materials.map(function (mt) {
                var checked = materialIds.indexOf(mt.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="mt-cb rounded text-blue-600" value="' + mt.id + '" ' + checked + '> ' + esc(mt.name) + '</label>';
            }).join('');

            return '<div class="curriculum-card space-y-4" data-id="' + item.id + '">' +
                '<div class="border-b border-slate-200 pb-4 mb-4">' +
                '<div class="flex justify-between items-start">' +
                '<div>' +
                '<h5 class="font-bold text-slate-800 text-lg">교과목 : ' + esc(item.name) + '</h5>' +
                '<p class="text-sm text-slate-500 mt-1">능력단위(단원)명 : ' + esc(unitLabel) + '</p>' +
                '</div>' +
                '<button type="button" class="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">교과목 편성내용</button>' +
                '</div>' +
                '</div>' +

                '<!-- 주강사 -->' +
                '<div class="field-row">' +
                '<div class="field-label">주강사</div>' +
                '<div class="field-content flex-row flex-wrap gap-x-6">' +
                (instructorChecks || '<span class="text-slate-400 text-xs text-center w-full">등록된 강사가 없습니다.</span>') +
                '</div>' +
                '</div>' +

                '<!-- 평가자 -->' +
                '<div class="field-row">' +
                '<div class="field-label">평가자</div>' +
                '<div class="field-content">' +
                '<select class="evaluator-sel w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">' +
                '<option value="">:: 평가자 선택 ::</option>' +
                evaluatorOpts +
                '</select>' +
                '</div>' +
                '</div>' +

                '<!-- 교수학습방법 -->' +
                '<div class="field-row">' +
                '<div class="field-label">교수학습방법</div>' +
                '<div class="field-content t-methods-container">' +
                teachingMethods.map(function (m) {
                    return '<div class="method-item">' +
                        '<select class="t-method-sel flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">' +
                        '<option value="">:: 교수학습방법 선택 ::</option>' +
                        ['강의', '토의·토론', '실습', '실기', '과제박람회', '현장견학', '프로젝트'].map(function (opt) {
                            return '<option value="' + opt + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                        '</select>' +
                        '<button type="button" class="btn-plus t-method-plus"><i class="fas fa-plus"></i></button>' +
                        '<button type="button" class="btn-minus t-method-minus"><i class="fas fa-minus"></i></button>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' +

                '<!-- 평가방법 -->' +
                '<div class="field-row">' +
                '<div class="field-label">평가방법</div>' +
                '<div class="field-content e-methods-container">' +
                evaluationMethods.map(function (m) {
                    return '<div class="method-item">' +
                        '<select class="e-method-sel flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">' +
                        '<option value="">:: 평가방법 선택 ::</option>' +
                        ['서술형시험', '논술형시험', '사례연구', '발표', '포트폴리오', '수행평가', '작업장평가'].map(function (opt) {
                            return '<option value="' + opt + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                        '</select>' +
                        '<button type="button" class="btn-plus e-method-plus"><i class="fas fa-plus"></i></button>' +
                        '<button type="button" class="btn-minus e-method-minus"><i class="fas fa-minus"></i></button>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' +

                '<!-- 교재 선택 -->' +
                '<div class="field-row">' +
                '<div class="field-label">교재 선택</div>' +
                '<div class="field-content flex-row flex-wrap gap-x-6">' +
                (textbookChecks || '<span class="text-slate-400 text-xs text-center w-full">등록된 교재가 없습니다.</span>') +
                '</div>' +
                '</div>' +

                '<!-- 재료 선택 -->' +
                '<div class="field-row">' +
                '<div class="field-label">재료 선택</div>' +
                '<div class="field-content flex-row flex-wrap gap-x-6">' +
                (materialChecks || '<span class="text-slate-400 text-xs text-center w-full">승인받은 과정 재료 미등록</span>') +
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

        document.getElementById('ncsStep5BtnSave').addEventListener('click', function () {
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

            var btn = this;
            btn.disabled = true;
            var t = getToken();
            fetch('/api/ncs/approved/registrations/' + regId + '/evaluation-teaching', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                body: JSON.stringify({ items: items })
            }).then(function (r) { return r.json(); }).then(function (json) {
                btn.disabled = false;
                if (json.success) {
                    alert('저장되었습니다.');
                } else {
                    alert(json.error || '저장 실패');
                }
            }).catch(function () {
                btn.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
        });
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

            return '<div class="flex-1">' +
                '<h5 class="text-sm font-bold text-slate-700 mb-2">' + title + '</h5>' +
                '<div class="dual-list-container" data-type="' + type + '">' +
                '<!-- 전체 목록 -->' +
                '<div class="list-box-wrapper left-box">' +
                '<div class="list-box-header">전체 목록</div>' +
                '<div class="list-box-toolbar"><input type="text" class="list-box-filter" placeholder="Filter"></div>' +
                '<div class="list-box-actions">' +
                '<button type="button" class="list-btn btn-move-all-right"><i class="fas fa-angle-double-right"></i></button>' +
                '<button type="button" class="list-btn btn-move-right"><i class="fas fa-angle-right"></i></button>' +
                '</div>' +
                '<div class="list-content available-list">' + availableItems.map(itemHtml).join('') + '</div>' +
                '</div>' +
                '<!-- 선택된 목록 -->' +
                '<div class="list-box-wrapper right-box">' +
                '<div class="list-box-header">선택된 목록</div>' +
                '<div class="list-box-toolbar"><input type="text" class="list-box-filter" placeholder="Filter"></div>' +
                '<div class="list-box-actions">' +
                '<button type="button" class="list-btn btn-move-left"><i class="fas fa-angle-left"></i></button>' +
                '<button type="button" class="list-btn btn-move-all-left"><i class="fas fa-angle-double-left"></i></button>' +
                '</div>' +
                '<div class="list-content selected-list">' + selectedItems.map(itemHtml).join('') + '</div>' +
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

            var typeLabel = item.type === 'ncs' ? 'NCS 전공교과' : (item.type === 'basic' ? 'NCS 소양교교' : '비 NCS 교과');
            var hours = (Number(item.theory_hours) || 0) + (Number(item.practice_hours) || 0);

            return '<div class="step6-subject-card" data-id="' + item.id + '">' +
                '<div class="mb-6">' +
                '<h4 class="text-lg font-bold text-slate-800">' + esc(item.name) + '</h4>' +
                '<p class="text-xs text-slate-500 mt-1">교과목 분류 : ' + typeLabel + ' / 총 훈련시간 : ' + hours + ' 시간</p>' +
                '</div>' +
                '<div class="flex flex-col lg:flex-row gap-8">' +
                createDualList('해당 교과목 훈련 장소 등록', 'facilities', allFacilities, selectedFacilities) +
                createDualList('해당 교과목 사용 장비 등록', 'equipment', allEquipment, selectedEquipment) +
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

        document.getElementById('ncsStep6BtnSave').addEventListener('click', function () {
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

            var btn = this;
            btn.disabled = true;
            var t = getToken();
            fetch('/api/ncs/approved/registrations/' + regId + '/facilities-equipment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                body: JSON.stringify({ items: items })
            }).then(function (r) { return r.json(); }).then(function (json) {
                btn.disabled = false;
                if (json.success) {
                    alert('저장되었습니다.');
                } else {
                    alert(json.error || '저장 실패');
                }
            }).catch(function () {
                btn.disabled = false;
                alert('저장 중 오류가 발생했습니다.');
            });
        });
    }

    if (step === 1) initStep1();
    else if (step === 2) initStep2();
    else if (step === 3) initStep3();
    else if (step === 4) initStep4();
    else if (step === 5) initStep5();
    else if (step === 6) initStep6();
})();
