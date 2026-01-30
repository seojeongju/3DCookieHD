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
                    var mids = [];
                    trainingCache.forEach(function(item) {
                        var k = (item.midCode || '') + '|' + (item.midName || '');
                        if (!seen[k]) {
                            seen[k] = true;
                            mids.push({ code: item.midCode || '', name: item.midName || '' });
                        }
                    });
                    mids.sort(function(a, b) { return (a.code || '').localeCompare(b.code || '', 'ko'); });
                    var opts = ['<option value="">선택</option>'];
                    mids.forEach(function(m) {
                        opts.push('<option value="' + (m.code || '').replace(/"/g, '&quot;') + '">' + (m.code ? m.code + '. ' : '') + (m.name || '').replace(/</g, '&lt;') + '</option>');
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
            var smalls = [];
            list.forEach(function(item) {
                var k = (item.smallCode || '') + '|' + (item.smallName || '');
                if (!seen[k]) {
                    seen[k] = true;
                    smalls.push({ code: item.smallCode || '', name: item.smallName || '' });
                }
            });
            smalls.sort(function(a, b) { return (a.code || '').localeCompare(b.code || '', 'ko'); });
            var opts = ['<option value="">선택</option>'];
            smalls.forEach(function(s) {
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
                .then(function(r) { return r.json(); })
                .then(function(json) {
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
        if (saveBtn) saveBtn.addEventListener('click', function() { doSave(false); });
        var nextBtn = document.getElementById('ncsApprovedBtnNext');
        if (nextBtn) nextBtn.addEventListener('click', function() { doSave(true); });
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
        function row(levelLabel, cells) {
            var inner = cells.map(function(c) { return '<div class="py-1">' + esc(c) + '</div>'; }).join('');
            return '<tr class="align-top"><td class="px-4 py-3 font-medium text-slate-700">' + esc(levelLabel) + '</td><td class="px-4 py-3 text-slate-600">' + inner + '</td></tr>';
        }

        if (!regId) {
            tbody.innerHTML = '<tr><td colspan="2" class="px-4 py-12 text-center text-slate-500">과정개요를 먼저 등록한 후 1단계에서 <strong>다음</strong>을 눌러 진행하세요. <a href="/admin/ncs/approved/1" class="text-emerald-600 hover:underline ml-1">1. 과정개요로 이동</a></td></tr>';
            return;
        }

        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-system', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) {
                    tbody.innerHTML = '<tr><td colspan="2" class="px-4 py-8 text-center text-red-500">' + esc(json.error || '훈련이수체계도 조회 실패') + '</td></tr>';
                    return;
                }
                var d = json.data;
                var levels = d.levels || { 5: [], 4: [], 3: [] };
                var mainJob = d.mainJob || { code: null, name: null };
                var basicAbility = d.basicAbility || [];
                var rows = [];
                var l5 = (levels[5] || []).map(function(x) { return x.name; });
                var l4 = (levels[4] || []).map(function(x) { return x.name; });
                var l3 = (levels[3] || []).map(function(x) { return x.name; });
                if (l5.length) rows.push(row('5수준', l5));
                if (l4.length) rows.push(row('4수준', l4));
                if (l3.length) rows.push(row('3수준', l3));
                rows.push(row('직업 기초 능력', [basicAbility.length ? basicAbility.map(function(x) { return x.name; }).join(', ') : '선택된 직업기초 능력이 없습니다.']));
                var mainLabel = mainJob.name ? mainJob.name + (mainJob.code ? ' (' + mainJob.code + ')' : '') + ' (주직종(음영))' : '—';
                rows.push(row('직종', [mainLabel]));
                tbody.innerHTML = rows.join('');
            })
            .catch(function() {
                tbody.innerHTML = '<tr><td colspan="2" class="px-4 py-8 text-center text-red-500">훈련이수체계도를 불러오는데 실패했습니다.</td></tr>';
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

        function esc(s) {
            if (s == null) return '';
            var el = document.createElement('span');
            el.textContent = s;
            return el.innerHTML;
        }
        function fillUnitChecks(container) {
            if (!container) return;
            container.innerHTML = '';
            unitList.forEach(function(u) {
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
        function updateSelected(row) {
            var sel = row && row.querySelector('.ncs-curriculum-selected');
            if (!sel) return;
            var checked = row.querySelectorAll('.ncs-unit-cb:checked');
            var names = Array.prototype.map.call(checked, function(c) { return c.value || c.dataset.name; }).filter(Boolean);
            sel.textContent = names.length ? names.join(', ') : '';
        }
        function wireUnitChecks(row) {
            var container = row.querySelector('.ncs-curriculum-unit-checks');
            if (!container) return;
            container.addEventListener('change', function() { updateSelected(row); });
        }
        function addNcsRow() {
            var first = ncsRows.querySelector('.ncs-curriculum-row');
            if (!first) return;
            var clone = first.cloneNode(true);
            clone.querySelectorAll('input').forEach(function(i) { i.value = ''; });
            var sel = clone.querySelector('.ncs-curriculum-selected');
            if (sel) sel.textContent = '';
            var checks = clone.querySelector('.ncs-curriculum-unit-checks');
            if (checks) checks.innerHTML = '';
            ncsRows.appendChild(clone);
            fillUnitChecks(clone.querySelector('.ncs-curriculum-unit-checks'));
            wireUnitChecks(clone);
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
            clone.querySelectorAll('input, select').forEach(function(i) { i.value = ''; });
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
                units.addEventListener('click', function(e) {
                    if (e.target.classList.contains('nonncs-unit-plus')) addUnit();
                    if (e.target.classList.contains('nonncs-unit-minus')) delUnit();
                });
            }
            if (objs) {
                objs.addEventListener('click', function(e) {
                    if (e.target.classList.contains('nonncs-obj-plus')) addObj();
                    if (e.target.classList.contains('nonncs-obj-minus')) delObj();
                });
            }
        }

        var token = localStorage.getItem('token');
        fetch('/api/ncs/approved/registrations/' + regId + '/training-system', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (!json.success || !json.data) {
                    if (jobLabel) jobLabel.textContent = 'NCS 기반 교과';
                    unitList = [];
                } else {
                    var d = json.data;
                    var levels = d.levels || { 5: [], 4: [], 3: [] };
                    var main = d.mainJob || { name: null };
                    if (jobLabel) jobLabel.textContent = main.name ? main.name : 'NCS 기반 교과';
                    unitList = (levels[5] || []).concat(levels[4] || []).concat(levels[3] || []);
                }
                var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
                rows.forEach(function(r) {
                    fillUnitChecks(r.querySelector('.ncs-curriculum-unit-checks'));
                    wireUnitChecks(r);
                });
                var nonNcsR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                nonNcsR.forEach(function(r) { wireNonNcsRow(r); });
            })
            .catch(function() {
                if (jobLabel) jobLabel.textContent = 'NCS 기반 교과';
                unitList = [];
                var rows = ncsRows.querySelectorAll('.ncs-curriculum-row');
                rows.forEach(function(r) {
                    fillUnitChecks(r.querySelector('.ncs-curriculum-unit-checks'));
                    wireUnitChecks(r);
                });
                var nonNcsR = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
                nonNcsR.forEach(function(r) { wireNonNcsRow(r); });
            });

        var addNcs = document.getElementById('ncsCurriculumBtnAdd');
        var delNcs = document.getElementById('ncsCurriculumBtnDel');
        if (addNcs) addNcs.addEventListener('click', addNcsRow);
        if (delNcs) delNcs.addEventListener('click', delNcsRow);
        var addNon = document.getElementById('nonNcsCurriculumBtnAdd');
        var delNon = document.getElementById('nonNcsCurriculumBtnDel');
        if (addNon) addNon.addEventListener('click', addNonNcsRow);
        if (delNon) delNon.addEventListener('click', delNonNcsRow);
    }

    if (step === 1) initStep1();
    if (step === 2) initStep2();
    if (step === 3) initStep3();
})();
