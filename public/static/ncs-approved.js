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
        var subClassSelect = document.getElementById('ncsSubClass');
        // Unit and Element selectors are only in Step 3 (Training System Diagram), not in Step 1
        var unitSelect = document.getElementById('ncsUnit');
        var elementSelect = document.getElementById('ncsElement');
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

        // 글로벌 상태를 사용하여 분류 이동 시에도 데이터 손실 방지
        if (!window.ncsStep1Jobs) window.ncsStep1Jobs = [];
        if (window.ncsPrimaryJobCode === undefined) window.ncsPrimaryJobCode = null;

        var jobRadioRequestCounter = 0;

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
            var year = (devCategory && devCategory.value) ? devCategory.value.trim() : '';
            largeClass.innerHTML = '<option value="">로딩 중...</option>';
            var token = localStorage.getItem('token');
            var url = '/api/ncs/approved/large-classes' + (year ? '?devCategory=' + encodeURIComponent(year) : '');

            return fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
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
            var requestId = ++jobRadioRequestCounter;
            var large = largeClass ? largeClass.value : '';
            var mid = midClass ? midClass.value : '';
            var small = smallClass ? smallClass.value : '';

            var wraps = jobRadioGroup.querySelectorAll('.ncs-job-radio-wrap');
            wraps.forEach(function (w) { w.remove(); });

            if (!large || !mid || !small) {
                jobRadioPlaceholder.style.display = '';
                jobRadioPlaceholder.textContent = '소분류 선택 후 직종을 선택하세요. (기존 선택 항목은 유지됩니다)';
                // 분류가 덜 선택되었어도 우측 리스트는 현재 상태 그대로 보여줘야 함
                updateSelectedJobsResult();
                return;
            }

            jobRadioPlaceholder.style.display = '';
            jobRadioPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 직종 목록을 불러오는 중...';

            var token = localStorage.getItem('token');
            var url = '/api/ncs/approved/jobs?l=' + encodeURIComponent(large) + '&m=' + encodeURIComponent(mid) + '&s=' + encodeURIComponent(small);

            fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (requestId !== jobRadioRequestCounter) return;
                    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
                        jobRadioPlaceholder.textContent = '해당 분류에 등록된 세분류(직종) 정보가 없거나 불러오지 못했습니다.';
                        return;
                    }

                    jobRadioPlaceholder.style.display = 'none';
                    var jobs = json.data;
                    var w = document.createElement('div');
                    w.className = 'ncs-job-radio-wrap space-y-2';

                    jobs.forEach(function (j) {
                        var esc = function (s) { var t = document.createElement('span'); t.textContent = s == null ? '' : s; return t.innerHTML; };
                        var subCode = (j.code || '').trim();
                        var name = (j.name || '').trim();
                        if (!subCode) return;

                        // 전체 직종코드 생성 (대+중+소+세)
                        var fullCode = large + mid + small + subCode;
                        var id = 'ncsJob_' + fullCode.replace(/\s/g, '_');
                        var isInStore = window.ncsStep1Jobs.some(function (x) { return (x.code || '') === fullCode; });

                        w.innerHTML += '<label class="flex items-center gap-3 cursor-pointer py-2 hover:bg-blue-50 px-2 rounded-xl transition-all group">' +
                            '<input type="checkbox" name="ncsJobCheck" class="ncs-job-check w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" value="' + esc(fullCode) + '" data-name="' + esc(name) + '" id="' + id + '"' + (isInStore ? ' checked' : '') + '> ' +
                            '<div class="flex flex-col min-w-0">' +
                            '<span class="text-[10px] text-blue-500 font-black uppercase tracking-wider leading-none mb-1">' + esc(fullCode) + '</span>' +
                            '<span class="text-sm font-semibold text-slate-700 group-hover:text-blue-900 leading-tight truncate">' + esc(name) + '</span>' +
                            '</div>' +
                            '</label>';
                    });

                    jobRadioGroup.appendChild(w);
                    w.querySelectorAll('.ncs-job-check').forEach(function (cb) {
                        cb.addEventListener('change', function () {
                            var fullCode = (cb.value || '').trim();
                            var name = (cb.getAttribute('data-name') || '').trim();
                            if (cb.checked) {
                                if (!window.ncsStep1Jobs.some(function (x) { return (x.code || '') === fullCode; })) {
                                    window.ncsStep1Jobs.push({ code: fullCode, name: name });
                                    // 첫 직종이면 자동으로 주직무로 설정
                                    if (window.ncsStep1Jobs.length === 1) window.ncsPrimaryJobCode = fullCode;
                                }
                            } else {
                                window.ncsStep1Jobs = window.ncsStep1Jobs.filter(function (x) { return (x.code || '') !== fullCode; });
                                if (window.ncsPrimaryJobCode === fullCode) {
                                    window.ncsPrimaryJobCode = window.ncsStep1Jobs.length > 0 ? window.ncsStep1Jobs[0].code : null;
                                }
                            }
                            updateSelectedJobsResult();
                        });
                    });
                    updateSelectedJobsResult();
                })
                .catch(function (e) {
                    console.error('Jobs fetch error:', e);
                    jobRadioPlaceholder.textContent = '직종 정보를 불러오는 중 오류가 발생했습니다.';
                });
        }

        function updateSelectedJobsResult() {
            if (!selectedJobsResult || !selectedJobsPlaceholder) return;
            var wrap = selectedJobsResult.querySelector('.ncs-selected-jobs-list');
            if (wrap) wrap.remove();
            selectedJobsPlaceholder.style.display = window.ncsStep1Jobs.length ? 'none' : '';
            selectedJobsPlaceholder.textContent = '왼쪽에서 직종을 선택하세요';
            if (window.ncsStep1Jobs.length === 0) return;
            var listEl = document.createElement('div');
            listEl.className = 'ncs-selected-jobs-list space-y-2';
            window.ncsStep1Jobs.forEach(function (it) {
                var isPrimary = window.ncsPrimaryJobCode === it.code;
                var line = document.createElement('div');
                line.className = 'flex items-center gap-2 px-3 py-2 border rounded-xl transition-all animate-in fade-in slide-in-from-left-2 duration-300 ' +
                    (isPrimary ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200' : 'bg-blue-50 border-blue-200');

                var primaryBtn = document.createElement('button');
                primaryBtn.type = 'button';
                primaryBtn.className = 'shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ' +
                    (isPrimary ? 'text-amber-500 bg-white shadow-sm' : 'text-slate-300 hover:text-amber-400');
                primaryBtn.innerHTML = '<i class="fas fa-star ' + (isPrimary ? '' : 'text-xs') + '"></i>';
                primaryBtn.setAttribute('title', isPrimary ? '주직종 (선택됨)' : '주직종으로 설정');
                primaryBtn.onclick = function () {
                    window.ncsPrimaryJobCode = it.code;
                    updateSelectedJobsResult();
                };

                var codeBadge = document.createElement('span');
                codeBadge.className = 'px-2 py-0.5 text-white text-[10px] font-black rounded-md shrink-0 shadow-sm ' +
                    (isPrimary ? 'bg-amber-600' : 'bg-blue-600');
                codeBadge.textContent = it.code || '';

                var span = document.createElement('span');
                span.className = 'flex-1 min-w-0 text-sm font-bold truncate ' + (isPrimary ? 'text-amber-900' : 'text-blue-900');
                span.textContent = it.name || '';
                if (isPrimary) {
                    var mainTag = document.createElement('span');
                    mainTag.className = 'ml-1 px-1.5 py-0.5 bg-amber-200 text-amber-800 text-[9px] font-bold rounded uppercase';
                    mainTag.textContent = 'MAIN';
                    span.appendChild(mainTag);
                }

                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ncs-selected-job-remove shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors';
                btn.setAttribute('title', '선택 해제');
                btn.setAttribute('data-code', it.code || '');
                var btnIcon = document.createElement('i');
                btnIcon.className = 'fas fa-times text-xs';
                btn.appendChild(btnIcon);

                line.appendChild(primaryBtn);
                line.appendChild(codeBadge);
                line.appendChild(span);
                line.appendChild(btn);
                listEl.appendChild(line);
            });
            selectedJobsResult.appendChild(listEl);
            listEl.querySelectorAll('.ncs-selected-job-remove').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var code = (btn.getAttribute('data-code') || '').trim();
                    window.ncsStep1Jobs = window.ncsStep1Jobs.filter(function (x) { return (x.code || '') !== code; });
                    if (window.ncsPrimaryJobCode === code) {
                        window.ncsPrimaryJobCode = window.ncsStep1Jobs.length > 0 ? window.ncsStep1Jobs[0].code : null;
                    }
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
        function loadTrainingByLarge(forceRefresh, onSuccess, onError) {
            var code = largeClass.value;
            showTrainingApiMessage('');
            if (!code) {
                trainingCache = [];
                clearSelect(midClass);
                clearSelect(smallClass);
                loadJobRadios();
                return Promise.resolve();
            }
            var url = '/api/ncs/approved/training?ncsLclasCd=' + encodeURIComponent(code);
            if (forceRefresh) url += '&refresh=true';
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
                        if (onError) onError();
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
                    if (onSuccess) onSuccess();
                })
                .catch(function () {
                    trainingCache = [];
                    clearSelect(midClass);
                    clearSelect(smallClass);
                    loadJobRadios();
                    showTrainingApiMessage('공공 API 연결 실패. 네트워크 또는 서버 상태를 확인하세요.', true);
                    if (onError) onError();
                });
        }

        function loadSmallByMid(forceRefresh, onSuccess, onError) {
            var mid = midClass.value;
            // clearUnitHidden();
            if (!mid) {
                clearSelect(smallClass);
                loadJobRadios();
                if (onSuccess) onSuccess();
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
            loadSubClassesBySmall();
            if (onSuccess) onSuccess();
        }

        function loadSubClassesBySmall(forceRefresh, onSuccess, onError) {
            var large = largeClass.value;
            var mid = midClass.value;
            var small = smallClass.value;
            clearSelect(subClassSelect);
            clearSelect(unitSelect);
            clearSelect(elementSelect);
            if (!large || !mid || !small) {
                if (onSuccess) onSuccess();
                return;
            }

            subClassSelect.innerHTML = '<option value="">로딩 중...</option>';
            var token = localStorage.getItem('token');
            var url = '/api/ncs/approved/jobs?l=' + encodeURIComponent(large) + '&m=' + encodeURIComponent(mid) + '&s=' + encodeURIComponent(small);
            if (forceRefresh) url += '&refresh=true';

            fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !Array.isArray(json.data)) {
                        subClassSelect.innerHTML = '<option value="">데이터 없음</option>';
                        if (onError) onError();
                        return;
                    }
                    var opts = ['<option value="">선택</option>'];
                    json.data.forEach(function (j) {
                        var fullCode = large + mid + small + j.code;
                        opts.push('<option value="' + fullCode + '" data-name="' + (j.name || '').replace(/"/g, '&quot;') + '">' + fullCode + '. ' + (j.name || '') + '</option>');
                    });
                    subClassSelect.innerHTML = opts.join('');
                    if (onSuccess) onSuccess();
                });
        }

        function loadUnitsByJob(forceRefresh, onSuccess, onError) {
            var jobCode = subClassSelect.value;
            clearSelect(unitSelect);
            clearSelect(elementSelect);
            if (!jobCode) {
                if (onSuccess) onSuccess();
                return;
            }

            if (unitSelect) unitSelect.innerHTML = '<option value="">로딩 중...</option>';
            var token = localStorage.getItem('token');
            var url = '/api/ncs/approved/units-by-job?jobCode=' + encodeURIComponent(jobCode);
            if (forceRefresh) url += '&refresh=true';

            fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (!json.success || !Array.isArray(json.data)) {
                        if (unitSelect) unitSelect.innerHTML = '<option value="">데이터 없음</option>';
                        if (onError) onError();
                        return;
                    }
                    window.currentUnitsData = json.data; // Cache for element lookups

                    if (unitSelect) {
                        var opts = ['<option value="">선택</option>'];
                        json.data.forEach(function (u) {
                            opts.push('<option value="' + u.code + '" data-name="' + (u.name || '').replace(/"/g, '&quot;') + '">[Lv.' + u.level + '] ' + u.name + '</option>');
                        });
                        unitSelect.innerHTML = opts.join('');
                    }

                    // 또한, 세분류 선택 시 "훈련직종" 리스트에 추가할지 물어보거나 자동 추가
                    // 또한, 세분류 선택 시 "훈련직종" 리스트에 추가할지 물어보거나 자동 추가
                    var name = subClassSelect.options[subClassSelect.selectedIndex].getAttribute('data-name');
                    if (!window.ncsStep1Jobs.some(function (x) { return x.code === jobCode; })) {
                        // Custom Confirm Modal Logic
                        var modalId = 'ncs-confirm-modal';
                        var existingModal = document.getElementById(modalId);
                        if (existingModal) existingModal.remove();

                        var modalHtml =
                            '<div id="' + modalId + '" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">' +
                            '<div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform scale-95 transition-all duration-300 overflow-hidden">' +
                            '<div class="p-6">' +
                            '<div class="flex items-start gap-4">' +
                            '<div class="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">' +
                            '<i class="fas fa-plus-circle text-2xl"></i>' +
                            '</div>' +
                            '<div class="flex-1">' +
                            '<h3 class="text-lg font-bold text-slate-800 mb-1">훈련직종 추가</h3>' +
                            '<p class="text-slate-600 text-sm leading-relaxed">' +
                            '선택하신 직종 <span class="font-bold text-blue-600">[' + name + ']</span>을(를)<br>과정의 훈련직종으로 추가하시겠습니까?' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">' +
                            '<button id="' + modalId + '-cancel" class="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">취소</button>' +
                            '<button id="' + modalId + '-confirm" class="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">추가하기</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        document.body.insertAdjacentHTML('beforeend', modalHtml);
                        var modal = document.getElementById(modalId);
                        var btnCancel = document.getElementById(modalId + '-cancel');
                        var btnConfirm = document.getElementById(modalId + '-confirm');

                        // Show animation
                        requestAnimationFrame(function () {
                            modal.classList.remove('opacity-0');
                            modal.querySelector('div').classList.remove('scale-95');
                            modal.querySelector('div').classList.add('scale-100');
                        });

                        var close = function () {
                            modal.classList.add('opacity-0');
                            modal.querySelector('div').classList.remove('scale-100');
                            modal.querySelector('div').classList.add('scale-95');
                            setTimeout(function () { modal.remove(); }, 300);
                        };

                        btnCancel.onclick = close;
                        btnConfirm.onclick = function () {
                            window.ncsStep1Jobs.push({ code: jobCode, name: name });
                            if (!window.ncsPrimaryJobCode) window.ncsPrimaryJobCode = jobCode;
                            updateSelectedJobsResult();
                            close();
                            showToast('훈련직종이 추가되었습니다.', 'success');
                        };
                    }
                    if (onSuccess) onSuccess();
                });
        }

        function loadElementsByUnit(forceRefresh, onSuccess, onError) {
            var unitCode = unitSelect.value;
            clearSelect(elementSelect);
            if (!unitCode || !window.currentUnitsData) {
                if (onSuccess) onSuccess();
                return;
            }

            var unit = window.currentUnitsData.find(function (u) { return u.code === unitCode; });
            if (!unit) {
                if (onSuccess) onSuccess();
                return;
            }

            // If elements exist and not forcing refresh, render them
            if (!forceRefresh && unit.elements && unit.elements.length > 0) {
                renderElements(unit.elements);
                if (onSuccess) onSuccess();
                return;
            }

            // Otherwise, fetch on-demand
            elementSelect.innerHTML = '<option value="">로딩 중...</option>';
            var token = localStorage.getItem('token');
            var url = '/api/ncs/approved/unit-elements/' + encodeURIComponent(unitCode);
            if (forceRefresh) url += '?refresh=true';
            fetch(url, {
                headers: token ? { 'Authorization': 'Bearer ' + token } : {}
            })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                        unit.elements = json.data; // Cache it
                        renderElements(unit.elements);
                        if (onSuccess) onSuccess();
                    } else {
                        elementSelect.innerHTML = '<option value="">데이터 없음</option>';
                        if (onError) onError();
                    }
                })
                .catch(function (e) {
                    console.error('Fetch elements failed:', e);
                    elementSelect.innerHTML = '<option value="">조회 실패</option>';
                    if (onError) onError();
                });
        }

        function renderElements(elements) {
            var opts = ['<option value="">선택</option>'];
            (elements || []).forEach(function (el, idx) {
                opts.push('<option value="' + idx + '">' + (idx + 1) + '. ' + (el.name || '') + '</option>');
            });
            elementSelect.innerHTML = opts.join('');
        }

        if (devCategory) {
            devCategory.addEventListener('change', function () {
                clearSelect(largeClass);
                clearSelect(midClass);
                clearSelect(smallClass);
                clearSelect(subClassSelect);
                clearSelect(unitSelect);
                clearSelect(elementSelect);
                loadLargeClasses();
            });
        }
        largeClass.addEventListener('change', loadTrainingByLarge);
        midClass.addEventListener('change', loadSmallByMid);
        smallClass.addEventListener('change', loadSubClassesBySmall);
        if (subClassSelect) subClassSelect.addEventListener('change', loadUnitsByJob);
        if (unitSelect) unitSelect.addEventListener('change', loadElementsByUnit);

        // ========== Refresh Buttons ==========
        var refreshLargeBtn = document.getElementById('refreshLargeClass');
        var refreshMidBtn = document.getElementById('refreshMidClass');
        var refreshSmallBtn = document.getElementById('refreshSmallClass');
        var refreshSubBtn = document.getElementById('refreshSubClass');
        var refreshUnitBtn = document.getElementById('refreshUnit');
        var refreshElementBtn = document.getElementById('refreshElement');

        function spinIcon(btn, spinning) {
            var icon = btn ? btn.querySelector('i') : null;
            if (!icon) return;
            if (spinning) {
                icon.classList.add('fa-spin');
                btn.disabled = true;
                btn.style.opacity = '0.5';
            } else {
                icon.classList.remove('fa-spin');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        }

        // 대분류 새로고침
        if (refreshLargeBtn) {
            refreshLargeBtn.addEventListener('click', function () {
                spinIcon(refreshLargeBtn, true);
                var token = localStorage.getItem('token');
                fetch('/api/ncs/approved/large-classes?refresh=true', {
                    headers: token ? { 'Authorization': 'Bearer ' + token } : {}
                })
                    .then(function (r) { return r.json(); })
                    .then(function (json) {
                        spinIcon(refreshLargeBtn, false);
                        if (json.success && Array.isArray(json.data)) {
                            var opts = ['<option value="">선택</option>'];
                            json.data.forEach(function (c) {
                                opts.push('<option value="' + c.code + '">' + c.code + '. ' + c.name + '</option>');
                            });
                            largeClass.innerHTML = opts.join('');
                            showToast('대분류 데이터를 새로고침했습니다.', 'success');
                        } else {
                            showToast('대분류 새로고침 실패', 'error');
                        }
                    })
                    .catch(function (e) {
                        spinIcon(refreshLargeBtn, false);
                        showToast('대분류 새로고침 중 오류 발생', 'error');
                        console.error(e);
                    });
            });
        }

        // 중분류 새로고침
        if (refreshMidBtn) {
            refreshMidBtn.addEventListener('click', function () {
                var large = largeClass.value;
                if (!large) {
                    showToast('먼저 대분류를 선택하세요.', 'warning');
                    return;
                }
                spinIcon(refreshMidBtn, true);
                loadTrainingByLarge(true, function () {
                    spinIcon(refreshMidBtn, false);
                    showToast('중분류 데이터를 새로고침했습니다.', 'success');
                }, function () {
                    spinIcon(refreshMidBtn, false);
                    showToast('중분류 새로고침 실패', 'error');
                });
            });
        }

        // 소분류 새로고침
        if (refreshSmallBtn) {
            refreshSmallBtn.addEventListener('click', function () {
                var mid = midClass.value;
                if (!mid) {
                    showToast('먼저 중분류를 선택하세요.', 'warning');
                    return;
                }
                spinIcon(refreshSmallBtn, true);
                // 소분류는 중분류와 함께 trainingCache에 포함되므로, 대분류 기준으로 전체 새로고침
                loadTrainingByLarge(true, function () {
                    // 중분류 선택값 복구
                    midClass.value = mid;
                    // 소분류 목록 갱신 (콜백에서 스피너 해제)
                    loadSmallByMid(false, function () {
                        spinIcon(refreshSmallBtn, false);
                        showToast('소분류 데이터를 새로고침했습니다.', 'success');
                    }, function () {
                        // 에러 시에도 스피너 해제
                        spinIcon(refreshSmallBtn, false);
                        showToast('소분류 데이터 처리 중 오류 발생', 'error');
                    });
                }, function () {
                    spinIcon(refreshSmallBtn, false);
                    showToast('공공 API로부터 최신 데이터를 가져오지 못했습니다.', 'error');
                });
            });
        }

        // 세분류/직종 새로고침
        if (refreshSubBtn) {
            refreshSubBtn.addEventListener('click', function () {
                var large = largeClass.value;
                var mid = midClass.value;
                var small = smallClass.value;
                if (!large || !mid || !small) {
                    showToast('먼저 소분류까지 선택하세요.', 'warning');
                    return;
                }
                spinIcon(refreshSubBtn, true);
                loadSubClassesBySmall(true, function () {
                    spinIcon(refreshSubBtn, false);
                    showToast('세분류/직종 데이터를 새로고침했습니다.', 'success');
                }, function () {
                    spinIcon(refreshSubBtn, false);
                    showToast('세분류/직종 새로고침 실패', 'error');
                });
            });
        }

        // 능력단위 새로고침
        if (refreshUnitBtn) {
            refreshUnitBtn.addEventListener('click', function () {
                var jobCode = subClassSelect.value;
                if (!jobCode) {
                    showToast('먼저 세분류/직종을 선택하세요.', 'warning');
                    return;
                }
                spinIcon(refreshUnitBtn, true);
                loadUnitsByJob(true, function () {
                    spinIcon(refreshUnitBtn, false);
                    showToast('능력단위 데이터를 새로고침했습니다.', 'success');
                }, function () {
                    spinIcon(refreshUnitBtn, false);
                    showToast('능력단위 새로고침 실패', 'error');
                });
            });
        }

        // 능력단위요소 새로고침
        if (refreshElementBtn) {
            refreshElementBtn.addEventListener('click', function () {
                var unitCode = unitSelect.value;
                if (!unitCode || !window.currentUnitsData) {
                    showToast('먼저 능력단위를 선택하세요.', 'warning');
                    return;
                }
                spinIcon(refreshElementBtn, true);
                loadElementsByUnit(true, function () {
                    spinIcon(refreshElementBtn, false);
                    showToast('능력단위요소 데이터를 새로고침했습니다.', 'success');
                }, function () {
                    spinIcon(refreshElementBtn, false);
                    showToast('능력단위요소 새로고침 실패', 'error');
                });
            });
        }

        // Toast notification helper
        function showToast(message, type) {
            var bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-amber-500';
            var toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 ' + bgColor + ' text-white px-6 py-3 rounded-xl shadow-lg z-50 opacity-0 transition-opacity duration-300';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(function () { toast.style.opacity = '1'; }, 10);
            setTimeout(function () {
                toast.style.opacity = '0';
                setTimeout(function () { document.body.removeChild(toast); }, 300);
            }, 3000);
        }

        // Update loadSmallByMid to chain correctly
        var originalLoadSmallByMid = loadSmallByMid;
        loadSmallByMid = function (forceRefresh, onSuccess, onError) {
            originalLoadSmallByMid(forceRefresh, onSuccess, onError);
            // loadSubClassesBySmall is already called at the end of original or added via listener
        };

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
            if (window.ncsStep1Jobs && window.ncsStep1Jobs.length) {
                mainJobs = window.ncsStep1Jobs.map(function (j) { return { code: j.code || '', name: j.name || '' }; });
            } else if (jobRadioGroup) {
                jobRadioGroup.querySelectorAll('.ncs-job-check:checked').forEach(function (cb) {
                    var code = (cb.value || '').trim();
                    var name = (cb.getAttribute('data-name') || '').trim();
                    if (code || name) mainJobs.push({ code: code, name: name });
                });
            }
            var approvedCourseIdEl = document.getElementById('ncsApprovedCourseId');
            var approvedCourseId = approvedCourseIdEl ? approvedCourseIdEl.value : null;

            var mainJob = null;
            if (window.ncsPrimaryJobCode && window.ncsStep1Jobs) {
                mainJob = window.ncsStep1Jobs.find(function (j) { return j.code === window.ncsPrimaryJobCode; });
            }
            // fallback if primary is missing but list exists
            if (!mainJob && mainJobs.length) mainJob = mainJobs[0];

            var payload = {
                approved_course_id: approvedCourseId,
                ncs_tab: ncsTab,
                course_type: courseType || null,
                main_job_code: mainJob ? mainJob.code : null,
                main_job_name: mainJob ? mainJob.name : null,
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
                                    console.log('Redirecting to Step 2 in Embedded Mode...');
                                    if (window.loadNcsStep) window.loadNcsStep(2);
                                    else console.error('window.loadNcsStep is not defined!');
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
                        var subCodeToSet = (d.main_job_code || d.sub_code || d.unit_code || '').toString().trim();
                        if (subCodeToSet.length > 8) subCodeToSet = subCodeToSet.slice(0, 8);
                        if (subCodeToSet.length === 2 && d.large_code && d.mid_code && d.small_code) subCodeToSet = (d.large_code + d.mid_code + d.small_code + subCodeToSet).slice(0, 8);
                        loadSubClassesBySmall(false, function () {
                            if (subClassSelect && subCodeToSet) subClassSelect.value = subCodeToSet;
                        });
                        window.ncsStep1Jobs.length = 0;
                        window.ncsPrimaryJobCode = d.main_job_code || null;
                        try {
                            var raw = d.main_jobs_json;
                            if (raw && typeof raw === 'string') {
                                var arr = JSON.parse(raw);
                                if (Array.isArray(arr)) arr.forEach(function (j) { if (j && (j.code || j.name)) window.ncsStep1Jobs.push({ code: (j.code || '').toString().trim(), name: (j.name || '').toString().trim() }); });
                            }
                        } catch (e) { }
                        if (window.ncsStep1Jobs.length === 0 && (d.main_job_code || d.unit_code)) {
                            var code = (d.unit_code || d.main_job_code || '').trim();
                            var name = (d.main_job_name || d.unit_name || '').trim();
                            window.ncsStep1Jobs.push({ code: code, name: name });
                            if (!window.ncsPrimaryJobCode) window.ncsPrimaryJobCode = code;
                        }
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
                        var hiddenEditId = document.getElementById('ncsApprovedEditId');
                        var courseId = window.NCS_EMBED_COURSE_ID;
                        if (courseId && (!hiddenEditId || !hiddenEditId.value)) {
                            var token = localStorage.getItem('token');
                            fetch('/api/ncs/approved/registrations/find-by-course/' + courseId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                                .then(function (r) { return r.json(); })
                                .then(function (findRes) {
                                    if (findRes.success && findRes.data && findRes.data.id) {
                                        if (hiddenEditId) hiddenEditId.value = String(findRes.data.id);
                                        editId = String(findRes.data.id);
                                        loadForEdit();
                                    }
                                })
                                .catch(function () { });
                        } else if (hiddenEditId && hiddenEditId.value) {
                            editId = hiddenEditId.value;
                            loadForEdit();
                        }
                    } else {
                        // alert(res.error || '과정 정보를 불러올 수 없습니다.');
                    }
                })
                .catch(function () { console.error('Embedded course load failed'); });
        } else {
            // loadApprovedCoursesList removed
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
                var currentMainCode = d.mainJobCode || '';
                var theadHtml = '<tr><th class="px-6 py-4 w-28 font-bold text-center border-r border-slate-200 bg-slate-100 text-slate-700">수준</th>';
                if (hasJobs) {
                    mainJobs.forEach(function (j) {
                        var isPrimary = (j.code && j.code === currentMainCode);
                        var jName = (j.name || '').trim() || (j.code || '직종');
                        var thClass = isPrimary
                            ? 'px-6 py-4 font-black text-center border-r border-slate-200 last:border-0 bg-blue-600 text-white min-w-[200px]'
                            : 'px-6 py-4 font-bold text-center border-r border-slate-200 last:border-0 bg-slate-100 text-slate-600 min-w-[200px]';

                        theadHtml += '<th class="' + thClass + '">' +
                            (isPrimary ? '<span class="block text-[10px] mb-1 opacity-80">주직종 (Primary)</span>' : '') +
                            esc(jName) +
                            '</th>';
                    });
                } else {
                    theadHtml += '<th class="px-6 py-4 font-bold text-center bg-slate-100 text-slate-700">능력단위</th>';
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
                                contentHtml = '<div class="flex flex-col gap-3">';
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

                                    var elementsHtml = '';
                                    if (x.elements && Array.isArray(x.elements) && x.elements.length > 0) {
                                        elementsHtml = '<div class="mt-2 pl-3 border-l-2 border-slate-100 space-y-1">';
                                        x.elements.forEach(function (el) {
                                            elementsHtml += '<div class="text-[10px] text-slate-400 flex items-start gap-1.5">' +
                                                '<i class="fas fa-dot-circle text-[6px] mt-1.5 opacity-30"></i>' +
                                                '<span class="leading-tight">' + esc(el.name) + '</span>' +
                                                '</div>';
                                        });
                                        elementsHtml += '</div>';
                                    }

                                    contentHtml += '<div class="flex flex-col">' +
                                        '<label class="' + className + '" data-unit-value="' + attrEsc(value) + '">' +
                                        '<div class="flex flex-col min-w-0 flex-1">' +
                                        (code ? '<span class="text-[9px] text-blue-500 font-black uppercase tracking-wider mb-0.5">' + esc(code) + '</span>' : '') +
                                        '<span class="text-xs leading-tight">' + esc(name) + '</span>' +
                                        '</div>' +
                                        '<input type="checkbox" class="ncs-step2-cb hidden" value="' + attrEsc(value) + '"' + (isChecked ? ' checked' : '') + ' onchange="updateUnitSelection(this)">' +
                                        '<i class="fas fa-check ' + (isChecked ? 'text-blue-600' : 'text-transparent group-hover:text-slate-300') + ' transition"></i>' +
                                        '</label>' +
                                        elementsHtml +
                                        '</div>';
                                });
                                contentHtml += '</div>';
                            }
                            rowHtml += '<td class="px-3 py-4 bg-slate-50/10 border-r border-slate-100 last:border-0 align-top min-w-[200px]">' + contentHtml + '</td>';
                        });
                    } else {
                        // ... simplified for non-job mode
                        var contentHtml = '<div class="flex flex-col gap-2">';
                        (allItems || []).forEach(function (x) {
                            var name = (x && x.name) ? x.name : String(x);
                            var value = x.code || name;
                            var isChecked = selectedSet[value] || selectedSet[name];
                            var className = isChecked ? 'cursor-pointer px-3 py-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm transition flex items-center justify-between group' : 'cursor-pointer px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-between group';
                            contentHtml += '<label class="' + className + '"><span class="flex-1 text-sm">' + esc(name) + '</span><input type="checkbox" class="ncs-step2-cb hidden" value="' + attrEsc(value) + '"' + (isChecked ? ' checked' : '') + ' onchange="updateUnitSelection(this)"><i class="fas fa-check ' + (isChecked ? 'text-blue-600' : 'text-transparent group-hover:text-slate-300') + ' transition"></i></label>';
                        });
                        contentHtml += '</div>';
                        rowHtml += '<td class="px-6 py-4 bg-slate-50/10">' + contentHtml + '</td>';
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
        var loader = document.getElementById('ncsStep3Loading');
        var ncsRowsCallback = document.getElementById('ncsCurriculumRows'); // Container
        var nonNcsRows = document.getElementById('nonNcsCurriculumRows');

        if (!form || !ncsRowsCallback || !nonNcsRows) return;

        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            if (loader) loader.classList.add('hidden');
            form.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        if (loader) loader.classList.remove('hidden');
        form.classList.add('hidden');

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

        function createJobSection(jobData, isPrimary) {
            var jobName = jobData.name;
            var jobCode = jobData.code;
            var isSynced = jobData.isSynced;
            var sect = document.createElement('div');
            sect.className = 'bg-white rounded-[1.5rem] border shadow-sm p-6 mb-8 job-section transition-all ' +
                (isPrimary ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-200');
            sect.dataset.jobName = jobName || 'unknown';

            var syncBadge = isSynced
                ? '<span class="px-1.5 py-0.5 bg-green-100 text-green-600 text-[9px] font-black rounded uppercase ml-2">SYNCED</span>'
                : '<span class="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-black rounded uppercase ml-2">NOT SYNCED</span>';

            sect.innerHTML =
                '<div class="flex items-center gap-3 mb-6">' +
                '<i class="fas fa-book-open ' + (isPrimary ? 'text-blue-600' : 'text-slate-400') + ' text-xl"></i>' +
                '<div>' +
                (isPrimary ? '<span class="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase mb-1 block w-fit">Primary Job</span>' : '') +
                '<div class="flex items-center"><h3 class="text-lg font-black text-slate-800">' + esc(jobName || '직종 미분류') + '</h3>' + syncBadge + '</div>' +
                (jobCode ? '<div class="text-[10px] text-slate-400 font-mono mt-0.5">' + esc(jobCode) + '</div>' : '') +
                '</div>' +
                '<div class="flex items-center gap-2 ml-auto">' +
                '<button type="button" class="btn-sync-job px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5" title="능력단위/요소 동기화">' +
                '<i class="fas fa-sync-alt"></i> DB 동기화' +
                '</button>' +
                '<span class="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded">NCS 능력단위 기반 교과목 편성</span>' +
                '</div>' +
                '</div>' +
                '<div class="space-y-4 job-subjects-container"></div>' +
                '<div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">' +
                '<button type="button" class="btn-add-subject px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-bold text-sm transition flex items-center gap-2">' +
                '<i class="fas fa-plus"></i> 교과목 추가' +
                '</button></div>';

            sect.querySelector('.btn-add-subject').addEventListener('click', function () {
                addSubjectRow(sect.querySelector('.job-subjects-container'), jobName);
            });

            sect.querySelector('.btn-sync-job').addEventListener('click', function () {
                var jobCodeClean = (jobCode || '').replace(/[^0-9]/g, '').slice(0, 8);
                if (jobCodeClean.length !== 8) {
                    alert('8자리 세분류 코드가 필요합니다. (현재: ' + jobCode + ')');
                    return;
                }

                if (!confirm('[' + jobName + '] 직종의 NCS 데이터를 DB로 동기화하시겠습니까?')) return;

                var btn = this;
                var originalHtml = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                var t = localStorage.getItem('token');
                fetch('/api/ncs/approved/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || '') },
                    body: JSON.stringify({
                        subClassCode: jobCodeClean,
                        subClassName: jobName
                    })
                })
                    .then(function (r) { return r.json(); })
                    .then(function (res) {
                        if (res.success) {
                            alert('동기화 완료!\n' + res.message);
                            if (window.loadNcsStep) window.loadNcsStep(3);
                            else window.location.reload();
                        } else {
                            alert('실패: ' + res.error);
                        }
                    })
                    .catch(function (err) { alert('오류: ' + err); })
                    .finally(function () {
                        btn.disabled = false;
                        btn.innerHTML = originalHtml;
                    });
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
                '<button type="button" class="btn-del-subject h-9 px-3 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition flex items-center gap-1.5" title="이 교과목 삭제"><i class="fas fa-trash-alt text-xs"></i> 삭제</button>' +
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
                            // Determine checked state: default to false for new selections, 
                            // but keep true for legacy string-based units to avoid resetting them.
                            var isElChecked = (savedUnit && typeof savedUnit === 'string') ? true : false;
                            if (savedElements) {
                                isElChecked = savedElements.some(function (selEl) { return selEl.code === el.code; });
                            }
                            return '<label class="flex items-start gap-2 text-xs text-slate-600 mb-1 cursor-pointer hover:text-blue-600">' +
                                '<input type="checkbox" class="mt-0.5 ncs-element-input text-blue-600 rounded" value="' + attrEsc(el.code) + '" data-unit-code="' + attrEsc(uCode) + '" ' + (isElChecked ? 'checked' : '') + '>' +
                                '<span class="leading-snug">[' + esc(el.code) + '] ' + esc(el.name) + '</span>' +
                                '</label>';
                        }).join('');
                    } else {
                        elHtml += '<div class="col-span-2 flex flex-col items-center py-4 bg-slate-100/50 rounded-lg border border-dashed border-slate-200">' +
                            '<span class="text-xs text-slate-400 italic">등록된 하위 요소가 없습니다.</span>' +
                            '</div>';
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

                    // [추가] 교과목명이 비어있으면 선택한 능력단위명으로 자동 채우기
                    if (cb.checked) {
                        var nameInp = row.querySelector('.ncs-curriculum-name');
                        if (nameInp && !nameInp.value.trim()) {
                            var uInfo = availableUnitsMap[cb.value];
                            if (uInfo) nameInp.value = uInfo.name;
                        }
                    }
                });
            });
        }

        // Logic to build payload (save logic)
        function buildCurriculumPayload() {
            var items = [];
            console.log('[DEBUG] --- buildCurriculumPayload start ---');

            // 1. NCS 직종 섹션 수집
            document.querySelectorAll('.job-section').forEach(function (sect) {
                var jobName = sect.dataset.jobName;

                sect.querySelectorAll('.ncs-curriculum-row').forEach(function (row) {
                    var nameInp = row.querySelector('.ncs-curriculum-name');
                    var rawName = nameInp ? nameInp.value.trim() : '';

                    var ability_units = [];
                    row.querySelectorAll('.ncs-unit-input:checked').forEach(function (unitCb) {
                        var uCode = unitCb.value;
                        var uInfo = availableUnitsMap[uCode];
                        if (!uInfo) return;

                        var selectedElements = [];
                        row.querySelectorAll('.ncs-element-input[data-unit-code="' + uCode + '"]:checked').forEach(function (elCb) {
                            var eCode = elCb.value;
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

                    // 이름이 비어있고 능력단위가 선택되어 있다면 첫 번째 능력단위명을 이름으로 사용
                    var finalName = rawName;
                    if (!finalName && ability_units.length > 0) {
                        finalName = ability_units[0].name;
                        if (nameInp) nameInp.value = finalName;
                    }

                    if (!finalName) {
                        console.warn('[DEBUG] Skipping row: still no name after fallback');
                        return;
                    }

                    items.push({
                        type: 'ncs',
                        name: finalName,
                        job_name: jobName,
                        ability_units: ability_units
                    });
                });
            });

            // 2. 직업기초 섹션 수집 (신규)
            document.querySelectorAll('.basic-section').forEach(function (sect) {
                sect.querySelectorAll('.ncs-curriculum-row').forEach(function (row) {
                    var nameInp = row.querySelector('.ncs-curriculum-name');
                    var rawName = nameInp ? nameInp.value.trim() : '';

                    var ability_units = [];
                    row.querySelectorAll('.ncs-unit-input:checked').forEach(function (unitCb) {
                        var uCode = unitCb.value;
                        var uInfo = availableUnitsMap[uCode];
                        if (!uInfo) return;
                        ability_units.push({ code: uInfo.code, name: uInfo.name, elements: [] });
                    });

                    var finalName = rawName;
                    if (!finalName && ability_units.length > 0) {
                        finalName = ability_units[0].name;
                        if (nameInp) nameInp.value = finalName;
                    }

                    if (!finalName) return;

                    items.push({ type: 'basic', name: finalName, ability_units: ability_units });
                });
            });

            // 3. 비NCS 섹션 수집
            if (nonNcsRows) {
                nonNcsRows.querySelectorAll('.nonncs-curriculum-row').forEach(function (row) {
                    var classEl = row.querySelector('.nonncs-curriculum-class');
                    var nameEl = row.querySelector('.nonncs-curriculum-name');
                    var classification = classEl ? classEl.value.trim() : '';
                    var name = nameEl ? nameEl.value.trim() : '';

                    if (!name && !classification) return;

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

            console.log('[DEBUG] Final Payload Items Count:', items.length);
            return { items: items };
        }

        // Add NON-NCS Helpers (template: #nonNcsRowTemplate, container: #nonNcsCurriculumRows)
        function getNonNcsRowTemplate() {
            var template = document.getElementById('nonNcsRowTemplate');
            if (template) {
                var row = template.querySelector('.nonncs-curriculum-row');
                if (row) return row;
            }
            return nonNcsRows.querySelector('.nonncs-curriculum-row');
        }
        function updateNonNcsHeaderButtons() {
            var rows = nonNcsRows.querySelectorAll('.nonncs-curriculum-row');
            var delBtn = document.getElementById('nonNcsCurriculumBtnDel');
            if (delBtn) {
                if (rows.length > 0) delBtn.classList.remove('hidden');
                else delBtn.classList.add('hidden');
            }
        }
        function addNonNcsRow() {
            var source = getNonNcsRowTemplate();
            if (!source) return;
            var clone = source.cloneNode(true);
            clone.querySelectorAll('input, select').forEach(function (i) { i.value = ''; });
            var u = clone.querySelector('.nonncs-units');
            if (u) { u.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-unit-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="단원명 입력"><button type="button" class="nonncs-unit-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button></div>'; }
            var o = clone.querySelector('.nonncs-objectives');
            if (o) { o.innerHTML = '<div class="flex gap-2"><input type="text" class="nonncs-obj-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="수행기준 입력"><button type="button" class="nonncs-obj-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button></div>'; }
            nonNcsRows.appendChild(clone);
            wireNonNcsRow(clone);
            updateNonNcsHeaderButtons();
        }
        function delNonNcsRow() {
            nonNcsRows.innerHTML = '';
            updateNonNcsHeaderButtons();
        }
        function delNonNcsRowByElement(rowEl) {
            if (rowEl && rowEl.parentNode === nonNcsRows) rowEl.remove();
            updateNonNcsHeaderButtons();
        }
        function wireNonNcsRow(row) {
            var units = row.querySelector('.nonncs-units');
            var objs = row.querySelector('.nonncs-objectives');
            var delBtn = row.querySelector('.nonncs-row-delete');
            if (delBtn) {
                delBtn.onclick = function () { delNonNcsRowByElement(row); };
            }
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

        // Note: 비NCS 추가/삭제 버튼은 커리큘럼 로드 완료 후 .then() 안에서 연결합니다 (DOM 준비 보장).
        // NCS add/del buttons are now handled per-job section

        function saveCurriculum(redirectToNext) {
            var payload = buildCurriculumPayload();
            console.log('[DEBUG] Curriculum Payload:', payload);
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
                            try { it.ability_units = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (e) { it.ability_units = []; }
                        });

                        // 1. Render Job Sections (NCS)
                        var currentMainCode = d.mainJobCode || '';
                        mainJobs.forEach(function (job) {
                            var jobName = job.name;
                            var isPrimary = (job.code && job.code === currentMainCode);
                            var sect = createJobSection(job, isPrimary);
                            var subContainer = sect.querySelector('.job-subjects-container');

                            var jobItems = ncsItems.filter(function (it) {
                                if (it.job_name === jobName) return true;
                                if (!it.job_name) {
                                    if (it.ability_units.length > 0) {
                                        var firstUCode = typeof it.ability_units[0] === 'string' ? it.ability_units[0] : it.ability_units[0].code;
                                        var uInfo = availableUnitsMap[firstUCode];
                                        if (uInfo && (uInfo.jobNames || []).includes(jobName)) return true;
                                    } else {
                                        if (mainJobs.indexOf(job) === 0) return true;
                                    }
                                }
                                return false;
                            });

                            jobItems.forEach(function (it) {
                                addSubjectRow(subContainer, jobName, it);
                            });

                            if (jobItems.length === 0) {
                                addSubjectRow(subContainer, jobName);
                            }

                            ncsRowsCallback.appendChild(sect);
                        });

                        // 2. Render Basic Ability Section
                        var basicAbilityInfo = d.basicAbility || [];
                        if (basicAbilityInfo.length > 0) {
                            var basicSect = document.createElement('div');
                            basicSect.className = 'bg-white rounded-[1.5rem] border border-emerald-200 shadow-sm p-6 mb-8 basic-section';
                            basicSect.innerHTML =
                                '<div class="flex items-center gap-3 mb-6">' +
                                '<i class="fas fa-graduation-cap text-emerald-600 text-xl"></i>' +
                                '<h3 class="text-lg font-black text-slate-800">직업기초능력 교과목 편성</h3>' +
                                '</div>' +
                                '<div class="space-y-4 basic-subjects-container"></div>' +
                                '<div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">' +
                                '<button type="button" class="btn-add-basic px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-bold text-sm transition flex items-center gap-2">' +
                                '<i class="fas fa-plus"></i> 교과목 추가' +
                                '</button></div>';

                            var basicContainer = basicSect.querySelector('.basic-subjects-container');
                            var basicItems = existingItems.filter(function (i) { return i.type === 'basic'; });

                            basicItems.forEach(function (it) {
                                try { it.ability_units = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (e) { }
                                addSubjectRow(basicContainer, null, it);
                            });

                            if (basicItems.length === 0) {
                                addSubjectRow(basicContainer, null);
                            }

                            basicSect.querySelector('.btn-add-basic').addEventListener('click', function () {
                                addSubjectRow(basicContainer, null);
                            });

                            ncsRowsCallback.appendChild(basicSect);
                        }

                        // Ensure Non-NCS Rows populated
                        var nonItems = existingItems.filter(function (i) { return i.type === 'non_ncs'; });
                        if (nonItems.length > 0) {
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
                            nonNcsRows.querySelectorAll('.nonncs-curriculum-row').forEach(function (r) { wireNonNcsRow(r); });
                            updateNonNcsHeaderButtons();
                        } else {
                            nonNcsRows.innerHTML = '';
                            updateNonNcsHeaderButtons();
                        }

                        if (loader) loader.classList.add('hidden');
                        form.classList.remove('hidden');
                        var addNonAgain = document.getElementById('nonNcsCurriculumBtnAdd');
                        var delNonAgain = document.getElementById('nonNcsCurriculumBtnDel');
                        if (addNonAgain) { addNonAgain.onclick = function () { addNonNcsRow(); }; }
                        if (delNonAgain) { delNonAgain.onclick = function () { delNonNcsRow(); }; }
                        updateNonNcsHeaderButtons();
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
            var totalHours = parseFloat(document.getElementById('ncsStep4TotalHours') && document.getElementById('ncsStep4TotalHours').value ? document.getElementById('ncsStep4TotalHours').value : 100) || 0;
            totalHours = Math.max(0, totalHours);
            var libPct = parseFloat(document.getElementById('ncsStep4LibPct') && document.getElementById('ncsStep4LibPct').value ? document.getElementById('ncsStep4LibPct').value : 0) || 0;
            var majorPct = parseFloat(document.getElementById('ncsStep4MajorPct') && document.getElementById('ncsStep4MajorPct').value ? document.getElementById('ncsStep4MajorPct').value : 0) || 0;
            var nonPct = parseFloat(document.getElementById('ncsStep4NonPct') && document.getElementById('ncsStep4NonPct').value ? document.getElementById('ncsStep4NonPct').value : 0) || 0;
            var libForceEl = document.getElementById('ncsStep4LibForce');
            var manualLib = !!(libForceEl && libForceEl.checked);
            var manualLibHours = 0;
            if (manualLib && totalHours > 0) {
                var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
                var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
                var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
                var libH = Math.max(0, parseInt(libDirectEl && libDirectEl.value ? libDirectEl.value : 0, 10) || 0);
                var majorH = Math.max(0, parseInt(majorDirectEl && majorDirectEl.value ? majorDirectEl.value : 0, 10) || 0);
                var nonH = Math.max(0, parseInt(nonDirectEl && nonDirectEl.value ? nonDirectEl.value : 0, 10) || 0);
                var sum = libH + majorH + nonH;
                if (sum > 0 && sum !== totalHours) {
                    libH = Math.round((libH / sum) * totalHours);
                    majorH = Math.round((majorH / sum) * totalHours);
                    nonH = totalHours - libH - majorH;
                }
                libH = Math.min(totalHours, Math.max(0, libH));
                majorH = Math.min(Math.max(0, totalHours - libH), Math.max(0, majorH));
                nonH = Math.max(0, totalHours - libH - majorH);
                manualLibHours = libH;
                libPct = totalHours ? Math.round((libH / totalHours) * 10000) / 100 : 0;
                majorPct = totalHours ? Math.round((majorH / totalHours) * 10000) / 100 : 0;
                nonPct = totalHours ? Math.round((nonH / totalHours) * 10000) / 100 : 0;
            }
            return { totalDays: totalDays, dailyHours: dailyHours, totalHours: totalHours, libPct: libPct, majorPct: majorPct, nonPct: nonPct, manualLib: manualLib, manualLibHours: manualLibHours };
        }

        function getLibHours(p) {
            if (!p) p = getParamsInputs();
            if (p.manualLib) return Math.min(p.manualLibHours || 0, p.totalHours || 0);
            return Math.round((p.totalHours || 0) * (p.libPct || 0) / 100);
        }

        function updatePctFromTotal() {
            var p = getParamsInputs();
            var total = p.totalHours || 0;
            var libH, majorH, nonH;
            var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
            var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
            var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
            var timeInputsRow = document.getElementById('ncsStep4TimeInputsRow');
            if (p.manualLib) {
                libH = Math.max(0, parseInt(libDirectEl && libDirectEl.value ? libDirectEl.value : 0, 10) || 0);
                majorH = Math.max(0, parseInt(majorDirectEl && majorDirectEl.value ? majorDirectEl.value : 0, 10) || 0);
                nonH = Math.max(0, parseInt(nonDirectEl && nonDirectEl.value ? nonDirectEl.value : 0, 10) || 0);
                var sum = libH + majorH + nonH;
                if (total > 0 && sum !== total) {
                    if (sum > 0) {
                        libH = Math.round((libH / sum) * total);
                        majorH = Math.round((majorH / sum) * total);
                        nonH = total - libH - majorH;
                    } else {
                        libH = Math.round(total * (p.libPct || 0) / 100);
                        majorH = Math.round(total * (p.majorPct || 0) / 100);
                        nonH = total - libH - majorH;
                    }
                }
                libH = Math.min(total, Math.max(0, libH));
                majorH = Math.min(Math.max(0, total - libH), Math.max(0, majorH));
                nonH = Math.max(0, total - libH - majorH);
                if (libDirectEl) libDirectEl.value = libH;
                if (majorDirectEl) majorDirectEl.value = majorH;
                if (nonDirectEl) nonDirectEl.value = nonH;
                var libPctVal = total ? Math.round((libH / total) * 10000) / 100 : 0;
                var majorPctVal = total ? Math.round((majorH / total) * 10000) / 100 : 0;
                var nonPctVal = total ? Math.round((nonH / total) * 10000) / 100 : 0;
                var libPctInput = document.getElementById('ncsStep4LibPct');
                var majorPctInput = document.getElementById('ncsStep4MajorPct');
                var nonPctInput = document.getElementById('ncsStep4NonPct');
                if (libPctInput) libPctInput.value = libPctVal;
                if (majorPctInput) majorPctInput.value = majorPctVal;
                if (nonPctInput) nonPctInput.value = nonPctVal;
                if (timeInputsRow) {
                    timeInputsRow.querySelectorAll('input').forEach(function (inp) { inp.readOnly = false; });
                }
            } else {
                libH = Math.min(total, Math.max(0, Math.round(total * (p.libPct || 0) / 100)));
                majorH = Math.min(Math.max(0, total - libH), Math.max(0, Math.round(total * (p.majorPct || 0) / 100)));
                nonH = Math.max(0, total - libH - majorH);
                if (libDirectEl) { libDirectEl.value = libH; libDirectEl.readOnly = true; }
                if (majorDirectEl) { majorDirectEl.value = majorH; majorDirectEl.readOnly = true; }
                if (nonDirectEl) { nonDirectEl.value = nonH; nonDirectEl.readOnly = true; }
                if (timeInputsRow) {
                    timeInputsRow.querySelectorAll('input').forEach(function (inp) { inp.readOnly = true; });
                }
            }
            var libEl = document.getElementById('ncsStep4LibHours');
            var majorEl = document.getElementById('ncsStep4MajorHours');
            var nonEl = document.getElementById('ncsStep4NonHours');
            var libInputWrap = document.getElementById('ncsStep4LibHoursInputWrap');
            var libInputEl = document.getElementById('ncsStep4LibHoursInput');
            var libPctInput = document.getElementById('ncsStep4LibPct');
            if (libEl) libEl.textContent = libH + ' 시간';
            if (majorEl) majorEl.textContent = majorH + ' 시간';
            if (nonEl) nonEl.textContent = nonH + ' 시간';
            var ratioHoursDisplays = document.querySelectorAll('.ncs-step4-ratio-hours-display');
            if (p.manualLib) {
                ratioHoursDisplays.forEach(function (el) { el.classList.add('hidden'); });
                if (libPctInput) libPctInput.disabled = true;
            } else {
                ratioHoursDisplays.forEach(function (el) { el.classList.remove('hidden'); });
                if (libInputWrap) libInputWrap.classList.add('hidden');
                if (libEl) libEl.classList.remove('hidden');
                if (libPctInput) libPctInput.disabled = false;
            }
        }

        function syncTimeInputsFromOne(changedField) {
            var total = parseFloat(document.getElementById('ncsStep4TotalHours') && document.getElementById('ncsStep4TotalHours').value ? document.getElementById('ncsStep4TotalHours').value : 0) || 0;
            total = Math.max(0, total);
            if (total <= 0) return;
            var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
            var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
            var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
            var libPctInput = document.getElementById('ncsStep4LibPct');
            var majorPctInput = document.getElementById('ncsStep4MajorPct');
            var nonPctInput = document.getElementById('ncsStep4NonPct');
            var libH = Math.max(0, parseInt(libDirectEl && libDirectEl.value ? libDirectEl.value : 0, 10) || 0);
            var majorH = Math.max(0, parseInt(majorDirectEl && majorDirectEl.value ? majorDirectEl.value : 0, 10) || 0);
            var nonH = Math.max(0, parseInt(nonDirectEl && nonDirectEl.value ? nonDirectEl.value : 0, 10) || 0);
            var libPct = parseFloat(libPctInput && libPctInput.value ? libPctInput.value : 0) || 0;
            var majorPct = parseFloat(majorPctInput && majorPctInput.value ? majorPctInput.value : 0) || 0;
            var nonPct = parseFloat(nonPctInput && nonPctInput.value ? nonPctInput.value : 0) || 0;
            var remaining, ratioSum;
            if (changedField === 'lib') {
                libH = Math.min(total, Math.max(0, libH));
                remaining = total - libH;
                ratioSum = majorPct + nonPct || 1;
                majorH = ratioSum > 0 ? Math.round(remaining * majorPct / ratioSum) : 0;
                nonH = Math.max(0, remaining - majorH);
            } else if (changedField === 'major') {
                majorH = Math.min(total, Math.max(0, majorH));
                remaining = total - majorH;
                ratioSum = libPct + nonPct || 1;
                libH = ratioSum > 0 ? Math.round(remaining * libPct / ratioSum) : 0;
                nonH = Math.max(0, remaining - libH);
            } else {
                nonH = Math.min(total, Math.max(0, nonH));
                remaining = total - nonH;
                ratioSum = libPct + majorPct || 1;
                libH = ratioSum > 0 ? Math.round(remaining * libPct / ratioSum) : 0;
                majorH = Math.max(0, remaining - libH);
            }
            if (libDirectEl) libDirectEl.value = libH;
            if (majorDirectEl) majorDirectEl.value = majorH;
            if (nonDirectEl) nonDirectEl.value = nonH;
            var libPctVal = total ? Math.round((libH / total) * 10000) / 100 : 0;
            var majorPctVal = total ? Math.round((majorH / total) * 10000) / 100 : 0;
            var nonPctVal = total ? Math.round((nonH / total) * 10000) / 100 : 0;
            if (libPctInput) libPctInput.value = libPctVal;
            if (majorPctInput) majorPctInput.value = majorPctVal;
            if (nonPctInput) nonPctInput.value = nonPctVal;
            var libEl = document.getElementById('ncsStep4LibHours');
            var majorEl = document.getElementById('ncsStep4MajorHours');
            var nonEl = document.getElementById('ncsStep4NonHours');
            if (libEl) libEl.textContent = libH + ' 시간';
            if (majorEl) majorEl.textContent = majorH + ' 시간';
            if (nonEl) nonEl.textContent = nonH + ' 시간';
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
            var totalH = p.totalHours || 0;
            if (!totalH) {
                var totalInput = document.getElementById('ncsStep4TotalHours');
                totalH = totalInput ? (parseFloat(totalInput.value) || 0) : 0;
            }
            var pct = totalH > 0 ? Math.round((applied / totalH) * 100) : 0;
            var calcEl = document.getElementById('ncsStep4CalculatedApplied');
            var percentEl = document.getElementById('ncsStep4PercentText');
            if (calcEl) calcEl.textContent = (totalH || p.totalHours || 0) + ' / ' + applied + ' 시간';
            if (percentEl) percentEl.textContent = '배정률 ' + pct + '%';
            else {
                var afterDot = calcEl && calcEl.nextElementSibling && calcEl.nextElementSibling.nextElementSibling;
                if (afterDot) afterDot.textContent = '배정률 ' + pct + '%';
            }
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
            var libH = getLibHours(p);
            var majorAlloc = p.manualLib ? Math.round((totalH - libH) * (p.majorPct || 0) / 100) : Math.round(totalH * (p.majorPct || 0) / 100);
            var nonAlloc = p.manualLib ? Math.round((totalH - libH) * (p.nonPct || 0) / 100) : Math.round(totalH * (p.nonPct || 0) / 100);
            if (tabBasic) tabBasic.textContent = '(' + basicAssigned + '/' + libH + ')시간';
            if (tabNcs) tabNcs.textContent = '(' + ncsAssigned + '/' + (libH + majorAlloc) + ')시간';
            if (tabNonncs) tabNonncs.textContent = '(' + nonAssigned + '/' + nonAlloc + ')시간';
        }

        function getAssignedHoursByCategory() {
            var basic = 0, ncs = 0, non = 0;
            step4Items.forEach(function (it) {
                var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + it.curriculum_id + '"]');
                if (!row) return;
                var theoryIn = row.querySelector('.ncs-step4-theory');
                var practiceIn = row.querySelector('.ncs-step4-practice');
                var sum = Math.max(0, parseInt(theoryIn && theoryIn.value ? theoryIn.value : 0, 10) || 0) + Math.max(0, parseInt(practiceIn && practiceIn.value ? practiceIn.value : 0, 10) || 0);
                if (isBasicItem(it)) basic += sum;
                else if ((it.type || '') === 'ncs') ncs += sum;
                else non += sum;
            });
            return { basic: basic, ncs: ncs, non: non };
        }

        function syncRatiosFromTable() {
            var total = parseFloat(document.getElementById('ncsStep4TotalHours') && document.getElementById('ncsStep4TotalHours').value ? document.getElementById('ncsStep4TotalHours').value : 0) || 0;
            total = Math.max(0, total);
            if (total <= 0 || !step4Items.length) return;
            var assigned = getAssignedHoursByCategory();
            var basicH = assigned.basic;
            var majorH = assigned.ncs;
            var nonH = assigned.non;
            var libPctInput = document.getElementById('ncsStep4LibPct');
            var majorPctInput = document.getElementById('ncsStep4MajorPct');
            var nonPctInput = document.getElementById('ncsStep4NonPct');
            var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
            var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
            var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
            var libPctVal = total ? Math.round((basicH / total) * 10000) / 100 : 0;
            var majorPctVal = total ? Math.round((majorH / total) * 10000) / 100 : 0;
            var nonPctVal = total ? Math.round((nonH / total) * 10000) / 100 : 0;
            if (libPctInput) libPctInput.value = libPctVal;
            if (majorPctInput) majorPctInput.value = majorPctVal;
            if (nonPctInput) nonPctInput.value = nonPctVal;
            if (libDirectEl) libDirectEl.value = basicH;
            if (majorDirectEl) majorDirectEl.value = majorH;
            if (nonDirectEl) nonDirectEl.value = nonH;
            var libEl = document.getElementById('ncsStep4LibHours');
            var majorEl = document.getElementById('ncsStep4MajorHours');
            var nonEl = document.getElementById('ncsStep4NonHours');
            if (libEl) libEl.textContent = basicH + ' 시간';
            if (majorEl) majorEl.textContent = majorH + ' 시간';
            if (nonEl) nonEl.textContent = nonH + ' 시간';
            updateCalculatedApplied();
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
            var libForceEl = document.getElementById('ncsStep4LibForce');
            if (libForceEl) libForceEl.addEventListener('change', function () {
                if (libForceEl.checked) {
                    var totalEl = document.getElementById('ncsStep4TotalHours');
                    var libPctEl = document.getElementById('ncsStep4LibPct');
                    var majorPctEl = document.getElementById('ncsStep4MajorPct');
                    var nonPctEl = document.getElementById('ncsStep4NonPct');
                    var total = parseInt(totalEl && totalEl.value ? totalEl.value : 0, 10) || 0;
                    var libPctVal = parseFloat(libPctEl && libPctEl.value ? libPctEl.value : 0) || 0;
                    var majorPctVal = parseFloat(majorPctEl && majorPctEl.value ? majorPctEl.value : 0) || 0;
                    var nonPctVal = parseFloat(nonPctEl && nonPctEl.value ? nonPctEl.value : 0) || 0;
                    var libInputEl = document.getElementById('ncsStep4LibHoursInput');
                    var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
                    var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
                    var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
                    if (libInputEl) libInputEl.value = Math.min(Math.round(total * libPctVal / 100), total);
                    if (libDirectEl) libDirectEl.value = Math.min(Math.round(total * libPctVal / 100), total);
                    if (majorDirectEl) majorDirectEl.value = Math.min(Math.round(total * majorPctVal / 100), total);
                    if (nonDirectEl) nonDirectEl.value = Math.min(Math.round(total * nonPctVal / 100), total);
                }
                updatePctFromTotal();
                updateCalculatedApplied();
            });
            var libHoursInputEl = document.getElementById('ncsStep4LibHoursInput');
            if (libHoursInputEl) {
                libHoursInputEl.addEventListener('input', function () { updatePctFromTotal(); updateCalculatedApplied(); });
                libHoursInputEl.addEventListener('change', function () { updatePctFromTotal(); updateCalculatedApplied(); });
            }
            var libDirectEl = document.getElementById('ncsStep4LibHoursDirect');
            var majorDirectEl = document.getElementById('ncsStep4MajorHoursDirect');
            var nonDirectEl = document.getElementById('ncsStep4NonHoursDirect');
            function onTimeDirectInput(field) {
                return function () {
                    var libForceEl = document.getElementById('ncsStep4LibForce');
                    if (libForceEl && libForceEl.checked) syncTimeInputsFromOne(field);
                    updateCalculatedApplied();
                };
            }
            if (libDirectEl) {
                libDirectEl.addEventListener('input', onTimeDirectInput('lib'));
                libDirectEl.addEventListener('change', onTimeDirectInput('lib'));
            }
            if (majorDirectEl) {
                majorDirectEl.addEventListener('input', onTimeDirectInput('major'));
                majorDirectEl.addEventListener('change', onTimeDirectInput('major'));
            }
            if (nonDirectEl) {
                nonDirectEl.addEventListener('input', onTimeDirectInput('non'));
                nonDirectEl.addEventListener('change', onTimeDirectInput('non'));
            }
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
                var nameCell = attrEsc(it.name || '');
                var abilityUnits = [];
                try { abilityUnits = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (e) { }
                var codes = abilityUnits.map(function (u) { return typeof u === 'string' ? u : (u.code || u.name || ''); }).filter(Boolean);
                if (codes.length) nameCell += ' <span class="text-slate-500 font-mono text-xs">(' + codes.map(attrEsc).join(', ') + ')</span>';
                var elementLines = buildAbilityUnitElementLines(it);
                if (elementLines.length) nameCell += '<br><span class="text-xs text-slate-500">능력단위요소명: ' + elementLines.join(' · ') + '</span>';
                var cp = it.classification_path;
                if (cp) {
                    var ncsLarge = (function (c) { var n = parseInt(c, 10); return isNaN(n) ? 'NCS' + c : 'NCS' + (n < 10 ? '00' : n < 100 ? '0' : '') + n; })(cp.largeCode);
                    var midPart = (cp.midCode || '') + (cp.midName ? ' ' + cp.midName : '');
                    var smallPart = (cp.smallCode || '') + (cp.smallName ? ' ' + cp.smallName : '');
                    var subPart = (cp.subCode || '') + (cp.subName ? ' ' + cp.subName : '');
                    nameCell += '<br><span class="text-slate-400 font-mono text-xs">' + attrEsc(ncsLarge + (cp.largeName ? ' ' + cp.largeName : '') + ' > ' + midPart + ' > ' + smallPart + ' > ' + subPart) + '</span>';
                }
                return '<tr class="ncs-step4-row" data-curriculum-id="' + attrEsc(String(it.curriculum_id)) + '" data-type="' + attrEsc(it.type || '') + '">' +
                    '<td class="px-4 py-2 text-slate-600">' + (i + 1) + '</td>' +
                    '<td class="px-4 py-2 font-medium text-slate-800">' + nameCell + '</td>' +
                    '<td class="px-4 py-2"><input type="number" min="0" step="1" class="ncs-step4-theory w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm" value="' + theory + '"></td>' +
                    '<td class="px-4 py-2"><input type="number" min="0" step="1" class="ncs-step4-practice w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm" value="' + practice + '"></td>' +
                    '<td class="px-4 py-2 ncs-step4-sum text-slate-700 font-medium">' + sum + '</td></tr>';
            }).join('');
            if (foot) foot.classList.remove('hidden');
            updateTotals();
            updatePctFromTotal();
            updateCalculatedApplied();
            syncRatiosFromTable();
            tbody.addEventListener('input', function () {
                updateTotals();
                updateCalculatedApplied();
                syncRatiosFromTable();
            });
            tbody.addEventListener('change', function () {
                updateTotals();
                updateCalculatedApplied();
                syncRatiosFromTable();
            });
            renderTabContent();
        }

        function isBasicItem(it) {
            return (it.type || '') === 'basic' || (it.classification && (String(it.classification).indexOf('기초') >= 0 || String(it.classification).indexOf('소양') >= 0));
        }

        function formatNcsLargeCode(code) {
            if (!code) return '';
            var n = parseInt(code, 10);
            if (isNaN(n)) return 'NCS' + String(code);
            return 'NCS' + (n < 10 ? '00' : n < 100 ? '0' : '') + n;
        }
        function buildAbilityUnitElementLines(it) {
            var abilityUnits = [];
            try { abilityUnits = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (e) { }
            var units = [];
            try { units = it.units_json ? JSON.parse(it.units_json) : []; } catch (e) { }
            var objectives = [];
            try { objectives = it.objectives_json ? JSON.parse(it.objectives_json) : []; } catch (e) { }
            function toCodeName(entry) {
                if (entry == null) return { code: '', name: '' };
                if (typeof entry === 'string') return { code: entry.trim(), name: '' };
                var c = (entry.code || entry.unit_code || '').toString().trim();
                var n = (entry.name || entry.unit_name || '').toString().trim();
                return { code: c, name: n };
            }
            var lines = [];
            if (Array.isArray(abilityUnits) && abilityUnits.length) {
                abilityUnits.forEach(function (entry) {
                    if (entry && typeof entry === 'object' && Array.isArray(entry.elements) && entry.elements.length) {
                        entry.elements.forEach(function (el) {
                            var cn = toCodeName(el);
                            if (cn.code || cn.name) lines.push((cn.code ? '[' + attrEsc(cn.code) + '] ' : '') + attrEsc(cn.name || cn.code));
                        });
                    }
                });
            }
            if (lines.length === 0 && Array.isArray(units) && units.length) {
                objectives = Array.isArray(objectives) ? objectives : [];
                units.forEach(function (u, i) {
                    var code = typeof u === 'string' ? u : (u && (u.code || u.unit_code));
                    var name = objectives[i] != null ? objectives[i] : (u && typeof u === 'object' ? (u.name || u.unit_name) : '');
                    if (code || name) lines.push((code ? '[' + attrEsc(code) + '] ' : '') + attrEsc(name || code || ''));
                });
            }
            if (lines.length === 0 && Array.isArray(abilityUnits) && abilityUnits.length) {
                abilityUnits.forEach(function (entry) {
                    var cn = toCodeName(entry);
                    if (cn.code || cn.name) lines.push((cn.code ? '[' + attrEsc(cn.code) + '] ' : '') + attrEsc(cn.name || cn.code));
                });
            }
            return lines;
        }
        function cardHtml(it, th, pr) {
            var abilityUnits = [];
            try { abilityUnits = it.ability_units_json ? JSON.parse(it.ability_units_json) : []; } catch (e) { }
            var unitLabel = abilityUnits.length ? abilityUnits.map(function (u) {
                var name = typeof u === 'string' ? u : (u.name || u.code);
                var code = typeof u === 'string' ? u : (u.code || '');
                return code ? (attrEsc(name) + ' <span class="text-slate-500 font-mono">(' + attrEsc(code) + ')</span>') : attrEsc(name);
            }).join(', ') : '—';
            var elementLines = buildAbilityUnitElementLines(it);
            var cp = it.classification_path;
            var midPart = cp ? (attrEsc(cp.midCode || '') + (cp.midName ? ' ' + attrEsc(cp.midName) : '')) : '';
            var smallPart = cp ? (attrEsc(cp.smallCode || '') + (cp.smallName ? ' ' + attrEsc(cp.smallName) : '')) : '';
            var subPart = cp ? (attrEsc(cp.subCode || '') + (cp.subName ? ' ' + attrEsc(cp.subName) : '')) : '';
            var fullClassLine = cp ? (formatNcsLargeCode(cp.largeCode) + (cp.largeName ? ' (' + attrEsc(cp.largeName) + ')' : '') + ' &gt; ' + midPart + ' &gt; ' + smallPart + ' &gt; ' + subPart + (cp.unitCode ? ' | 능력단위: ' + attrEsc(cp.unitCode) : '')) : '';

            return '<div class="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all mb-6" data-curriculum-id="' + it.curriculum_id + '">' +
                // Header Section
                '<div class="bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-100">' +
                '<div class="flex flex-wrap justify-between items-center gap-3">' +
                '<div class="flex-1 min-w-0">' +
                '<h4 class="text-lg font-black text-slate-800 flex items-center gap-2">' +
                '<i class="fas fa-book-open text-blue-600 text-sm"></i>' +
                attrEsc(it.name || '') +
                (abilityUnits.length ? ' <span class="text-slate-500 font-mono text-sm font-normal">(' + abilityUnits.map(function (u) { var c = typeof u === 'string' ? u : (u.code || ''); return attrEsc(c); }).filter(Boolean).join(', ') + ')</span>' : '') +
                '</h4>' +
                (fullClassLine ? '<p class="text-xs text-slate-500 mt-1"><span class="font-bold">전체분류:</span> <span class="font-mono">' + fullClassLine + '</span></p>' : '') +
                '<p class="text-xs text-slate-500 mt-1"><span class="font-bold">능력단위:</span> ' + unitLabel + '</p>' +
                (elementLines.length ? '<p class="text-xs text-slate-600 mt-1"><span class="font-bold">능력단위요소명:</span> ' + elementLines.join(' · ') + '</p>' : '') +
                '</div>' +
                '<div class="flex items-center gap-2">' +
                '<span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">' + (it.type === 'basic' ? '직업기초' : it.type === 'ncs' ? 'NCS' : '비NCS') + '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +

                // Content Section
                '<div class="p-6">' +
                // Training Hours Section
                '<div class="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-4">' +
                '<div class="flex items-center gap-2 mb-3">' +
                '<i class="fas fa-clock text-emerald-600"></i>' +
                '<label class="text-sm font-black text-slate-700 uppercase tracking-wider">훈련시간 설정</label>' +
                '</div>' +
                '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' +
                '<div>' +
                '<label class="block text-xs font-bold text-slate-500 mb-1.5">이론 시간</label>' +
                '<div class="flex items-center gap-2">' +
                '<input type="number" min="0" step="1" class="ncs-step4-theory curriculum-hour-input flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" data-curriculum-id="' + it.curriculum_id + '" data-kind="theory" value="' + th + '">' +
                '<span class="text-xs font-bold text-slate-400">시간</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<label class="block text-xs font-bold text-slate-500 mb-1.5">실습 시간</label>' +
                '<div class="flex items-center gap-2">' +
                '<input type="number" min="0" step="1" class="ncs-step4-practice curriculum-hour-input flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" data-curriculum-id="' + it.curriculum_id + '" data-kind="practice" value="' + pr + '">' +
                '<span class="text-xs font-bold text-slate-400">시간</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<label class="block text-xs font-bold text-slate-500 mb-1.5">합계</label>' +
                '<div class="flex items-center gap-2">' +
                '<input type="text" readonly class="curriculum-hour-total flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-black text-blue-600" value="' + (th + pr) + '">' +
                '<span class="text-xs font-bold text-slate-400">시간</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="mt-3 flex justify-end">' +
                '<button type="button" class="ncs-step4-distribute-btn px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2" data-curriculum-id="' + it.curriculum_id + '">' +
                '<i class="fas fa-balance-scale"></i> 이론/실습 균등 분배' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
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
            var libPctSend = p.libPct;
            var majorPctSend = p.majorPct;
            var nonPctSend = p.nonPct;
            var payload = {
                params: {
                    total_training_days: p.totalDays,
                    daily_training_hours: p.dailyHours,
                    total_training_hours: p.totalHours,
                    ncs_lib_arts_pct: libPctSend,
                    ncs_major_pct: majorPctSend,
                    non_ncs_pct: nonPctSend
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
            if (inp) { inp.value = e.target.value; updateTotals(); updateCalculatedApplied(); syncRatiosFromTable(); }

            // Update card total field
            var card = document.querySelector('[data-curriculum-id="' + cid + '"]');
            if (card) {
                var theoryInput = card.querySelector('.ncs-step4-theory');
                var practiceInput = card.querySelector('.ncs-step4-practice');
                var totalInput = card.querySelector('.curriculum-hour-total');
                if (theoryInput && practiceInput && totalInput) {
                    var t = parseInt(theoryInput.value) || 0;
                    var p = parseInt(practiceInput.value) || 0;
                    totalInput.value = t + p;
                }
            }
        });
        form.addEventListener('change', function (e) {
            if (!e.target || !e.target.matches || !e.target.matches('.curriculum-hour-input')) return;
            var cid = e.target.getAttribute('data-curriculum-id');
            var kind = e.target.getAttribute('data-kind');
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + cid + '"]');
            if (!row || !kind) return;
            var inp = row.querySelector(kind === 'theory' ? '.ncs-step4-theory' : '.ncs-step4-practice');
            if (inp) { inp.value = e.target.value; updateTotals(); updateCalculatedApplied(); syncRatiosFromTable(); }
        });
        form.addEventListener('click', function (e) {
            var btn = e.target && e.target.closest && e.target.closest('.ncs-step4-distribute-btn');
            if (!btn) return;
            var cid = btn.getAttribute('data-curriculum-id');
            if (!cid) return;
            var row = tbody.querySelector('.ncs-step4-row[data-curriculum-id="' + cid + '"]');
            if (!row && tbody.querySelectorAll('.ncs-step4-row').length) {
                tbody.querySelectorAll('.ncs-step4-row').forEach(function (tr) {
                    if (String(tr.getAttribute('data-curriculum-id')) === String(cid)) row = tr;
                });
            }
            var theoryIn = row ? row.querySelector('.ncs-step4-theory') : null;
            var practiceIn = row ? row.querySelector('.ncs-step4-practice') : null;
            var t = 0, p = 0;
            if (theoryIn && practiceIn) {
                t = Math.max(0, parseInt(theoryIn.value, 10) || 0);
                p = Math.max(0, parseInt(practiceIn.value, 10) || 0);
            }
            var card = btn.closest && btn.closest('[data-curriculum-id]');
            if ((t === 0 && p === 0) && card) {
                var cardTheory = card.querySelector('.ncs-step4-theory');
                var cardPractice = card.querySelector('.ncs-step4-practice');
                if (cardTheory && cardPractice) {
                    t = Math.max(0, parseInt(cardTheory.value, 10) || 0);
                    p = Math.max(0, parseInt(cardPractice.value, 10) || 0);
                }
            }
            var half = Math.round((t + p) / 2);
            if (card) {
                var cardTheory = card.querySelector('.ncs-step4-theory');
                var cardPractice = card.querySelector('.ncs-step4-practice');
                var cardTotal = card.querySelector('.curriculum-hour-total');
                if (cardTheory) cardTheory.value = half;
                if (cardPractice) cardPractice.value = half;
                if (cardTotal) cardTotal.value = half + half;
            }
            if (row && theoryIn && practiceIn) {
                theoryIn.value = half;
                practiceIn.value = half;
            }
            updateTotals();
            updateCalculatedApplied();
            syncRatiosFromTable();
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
                updatePctFromTotal();
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
        // 동시 실행 방지: 이미 실행 중이면 중복 호출 무시
        if (initStep5._running) return;
        initStep5._running = true;

        var regInput = document.getElementById('ncsApprovedRegIdStep5');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep5NoReg');
        var form = document.getElementById('ncsStep5Form');

        if (!form) { initStep5._running = false; return; }
        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            initStep5._running = false;
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var instructors = [];
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
            var objectives = [];
            try { objectives = item.objectives_json ? JSON.parse(item.objectives_json) : []; } catch (e) { }

            function toCodeName(entry) {
                if (entry == null) return { code: '', name: '' };
                if (typeof entry === 'string') return { code: entry.trim(), name: '' };
                var c = (entry.code || entry.unit_code || '').toString().trim();
                var n = (entry.name || entry.unit_name || '').toString().trim();
                return { code: c, name: n };
            }
            var unitCodeNameLines = [];
            if (Array.isArray(abilityUnits) && abilityUnits.length) {
                abilityUnits.forEach(function (entry) {
                    if (entry && typeof entry === 'object' && Array.isArray(entry.elements) && entry.elements.length) {
                        entry.elements.forEach(function (el) {
                            var cn = toCodeName(el);
                            if (cn.code || cn.name) unitCodeNameLines.push((cn.code ? '[' + esc(cn.code) + '] ' : '') + esc(cn.name || cn.code));
                        });
                    }
                });
            }
            if (unitCodeNameLines.length === 0 && Array.isArray(units) && units.length) {
                objectives = Array.isArray(objectives) ? objectives : [];
                units.forEach(function (u, i) {
                    var code = typeof u === 'string' ? u : (u && (u.code || u.unit_code));
                    var name = objectives[i] != null ? objectives[i] : (u && typeof u === 'object' ? (u.name || u.unit_name) : '');
                    if (code || name) unitCodeNameLines.push((code ? '[' + esc(code) + '] ' : '') + esc(name || code || ''));
                });
            }
            if (unitCodeNameLines.length === 0 && Array.isArray(abilityUnits) && abilityUnits.length) {
                abilityUnits.forEach(function (entry) {
                    var cn = toCodeName(entry);
                    if (cn.code || cn.name) unitCodeNameLines.push((cn.code ? '[' + esc(cn.code) + '] ' : '') + esc(cn.name || cn.code));
                });
            }
            var unitLabel = unitCodeNameLines.length ? unitCodeNameLines.join(', ') : '—';
            var abilityUnitBlock = unitCodeNameLines.length
                ? '<p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest pl-8">능력단위요소명</p><p class="text-sm text-slate-600 mt-1 pl-8">' + unitCodeNameLines.join(' · ') + '</p>'
                : '<p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest pl-8">능력단위(단원)명 : ' + esc(unitLabel) + '</p>';

            var mainInstructorIds = [];
            try { mainInstructorIds = item.main_instructor_ids_json ? JSON.parse(item.main_instructor_ids_json) : []; } catch (e) { }
            var teachingMethods = [];
            try { teachingMethods = item.teaching_methods_json ? JSON.parse(item.teaching_methods_json) : []; } catch (e) { teachingMethods = []; }
            // 중복 제거 (DB에 이미 중복 저장된 경우 대비)
            teachingMethods = teachingMethods.filter(function (v, i, a) { return v && a.indexOf(v) === i; });
            if (!teachingMethods.length) teachingMethods = [''];
            var evaluationMethods = [];
            try { evaluationMethods = item.evaluation_methods_json ? JSON.parse(item.evaluation_methods_json) : []; } catch (e) { evaluationMethods = []; }
            // 중복 제거 (DB에 이미 중복 저장된 경우 대비)
            evaluationMethods = evaluationMethods.filter(function (v, i, a) { return v && a.indexOf(v) === i; });
            if (!evaluationMethods.length) evaluationMethods = [''];
            var instructorChecks = instructors.map(function (ins) {
                var checked = mainInstructorIds.indexOf(ins.id) !== -1 ? 'checked' : '';
                return '<label class="flex items-center gap-2 text-sm cursor-pointer group"><input type="checkbox" class="ins-cb w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="' + ins.id + '" ' + checked + '> <span class="text-slate-600 group-hover:text-slate-900 transition-colors">' + esc(ins.name) + '</span></label>';
            }).join('');

            var evaluatorOpts = instructors.map(function (ins) {
                var sel = item.evaluator_id == ins.id ? 'selected' : '';
                return '<option value="' + ins.id + '" ' + sel + '>' + esc(ins.name) + '</option>';
            }).join('');

            return '<div class="curriculum-card bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all mb-10 overflow-hidden" data-id="' + item.id + '">' +
                '<div class="bg-gradient-to-r from-blue-50 to-slate-50 px-8 py-6 border-b border-slate-100">' +
                '<div class="flex flex-wrap justify-between items-start gap-4 mb-8">' +
                '<div>' +
                '<h5 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3"><i class="fas fa-book-open text-blue-600"></i> ' + esc(item.name) + '</h5>' +
                abilityUnitBlock +
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
                        ['강의법', '문답법', '토의법', '문제해결법', '구안법', '탐구학습', '협동학습', '개별지도 교수법', '목표도달학습', '문제중심학습', '기타', '혼합형'].map(function (opt) {
                            return '<option value="' + esc(opt) + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
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
                        ['포트폴리오', '문제해결 시나리오', '서술형 시험', '논술형 시험', '사례연구', '평가자 질문', '평가자 체크리스트', '피 평가자 체크리스트', '일지/저널', '역할연기', '구두발표', '작업장평가', '기타', '혼합형'].map(function (opt) {
                            return '<option value="' + esc(opt) + '" ' + (opt === m ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                        '</select>' +
                        '<button type="button" class="e-method-plus w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"><i class="fas fa-plus"></i></button>' +
                        '<button type="button" class="e-method-minus w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"><i class="fas fa-minus"></i></button>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // 교수학습방법/평가방법 +/- 버튼 리스너를 각 method-item에 직접 바인딩
        // (이벤트 delegation 대신 직접 attachment - 중복 바인딩 문제 없음)
        function makeMethodRow(isTeaching) {
            var cls = isTeaching ? 't-method-sel' : 'e-method-sel';
            var plusCls = isTeaching ? 't-method-plus' : 'e-method-plus';
            var minusCls = isTeaching ? 't-method-minus' : 'e-method-minus';
            var opts = isTeaching
                ? ['강의법','문답법','토의법','문제해결법','구안법','탐구학습','협동학습','개별지도 교수법','목표도달학습','문제중심학습','기타','혼합형']
                : ['포트폴리오','문제해결 시나리오','서술형 시험','논술형 시험','사례연구','평가자 질문','평가자 체크리스트','피 평가자 체크리스트','일지/저널','역할연기','구두발표','작업장평가','기타','혼합형'];
            var placeholder = isTeaching ? ':: 교수학습방법 선택 ::' : ':: 평가방법 선택 ::';

            var row = document.createElement('div');
            row.className = 'method-item flex gap-2';

            var select = document.createElement('select');
            select.className = cls + ' flex-1 px-5 py-3 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 shadow-sm';
            var emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.textContent = placeholder;
            select.appendChild(emptyOpt);
            opts.forEach(function(opt) {
                var o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                select.appendChild(o);
            });

            var btnPlus = document.createElement('button');
            btnPlus.type = 'button';
            btnPlus.className = plusCls + ' w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all';
            btnPlus.innerHTML = '<i class="fas fa-plus"></i>';

            var btnMinus = document.createElement('button');
            btnMinus.type = 'button';
            btnMinus.className = minusCls + ' w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all';
            btnMinus.innerHTML = '<i class="fas fa-minus"></i>';

            // +/- 리스너를 row에 직접 달기 (delegation 불필요)
            btnPlus.addEventListener('click', function(e) {
                e.stopPropagation();
                var container = btnPlus.closest(isTeaching ? '.t-methods-container' : '.e-methods-container');
                if (container) container.appendChild(makeMethodRow(isTeaching));
            });
            btnMinus.addEventListener('click', function(e) {
                e.stopPropagation();
                var container = btnMinus.closest(isTeaching ? '.t-methods-container' : '.e-methods-container');
                if (!container) return;
                var rows = container.querySelectorAll('.method-item');
                if (rows.length > 1) {
                    row.remove();
                } else {
                    select.value = '';
                }
            });

            row.appendChild(select);
            row.appendChild(btnPlus);
            row.appendChild(btnMinus);
            return row;
        }

        // 렌더링된 section 내 모든 .method-item에 +/- 리스너 부착
        function wireMethodButtons(section) {
            if (!section) return;
            section.querySelectorAll('.t-methods-container, .e-methods-container').forEach(function(mc) {
                var isTeaching = mc.classList.contains('t-methods-container');
                mc.querySelectorAll('.method-item').forEach(function(row) {
                    var sel = row.querySelector('select');
                    var plus = row.querySelector(isTeaching ? '.t-method-plus' : '.e-method-plus');
                    var minus = row.querySelector(isTeaching ? '.t-method-minus' : '.e-method-minus');
                    if (plus && !plus._wired) {
                        plus._wired = true;
                        plus.addEventListener('click', function(e) {
                            e.stopPropagation();
                            var container = plus.closest(isTeaching ? '.t-methods-container' : '.e-methods-container');
                            if (container) container.appendChild(makeMethodRow(isTeaching));
                        });
                    }
                    if (minus && !minus._wired) {
                        minus._wired = true;
                        minus.addEventListener('click', function(e) {
                            e.stopPropagation();
                            var container = minus.closest(isTeaching ? '.t-methods-container' : '.e-methods-container');
                            if (!container) return;
                            var rows = container.querySelectorAll('.method-item');
                            if (rows.length > 1) {
                                row.remove();
                            } else {
                                if (sel) sel.value = '';
                            }
                        });
                    }
                });
            });
        }

        Promise.all([
            apiFetch('/api/ncs/approved/registrations/' + regId),
            apiFetch('/api/ncs/approved/instructors'),
            apiFetch('/api/ncs/approved/registrations/' + regId + '/evaluation-teaching')
        ]).then(function (results) {
            var reg = results[0].success ? results[0].data : null;
            var allInstructors = results[1].success ? results[1].data : [];
            curriculum = results[2].success ? results[2].data : [];

            var courseInstructorNames = {};
            if (reg && reg.approved_course_id) {
                return apiFetch('/api/approved-courses/' + reg.approved_course_id).then(function (courseRes) {
                    if (courseRes.success && courseRes.data && courseRes.data.instructor_name) {
                        var names = String(courseRes.data.instructor_name).split(',');
                        names.forEach(function (n) { var t = n.trim(); if (t) courseInstructorNames[t] = true; });
                    }
                    instructors = Object.keys(courseInstructorNames).length
                        ? allInstructors.filter(function (ins) { return courseInstructorNames[ins.name]; })
                        : allInstructors;
                    return Promise.resolve();
                });
            }
            instructors = allInstructors;
            return Promise.resolve();
        }).then(function () {
            // form이 아직 DOM에 있는지 확인 (다른 step으로 이동했을 수 있음)
            if (!document.getElementById('ncsStep5Form')) { initStep5._running = false; return; }

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

            if (secLib) { secLib.innerHTML = libItems.length ? libItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>'; wireMethodButtons(secLib); }
            if (secMajor) { secMajor.innerHTML = majorItems.length ? majorItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>'; wireMethodButtons(secMajor); }
            if (secNon) { secNon.innerHTML = nonItems.length ? nonItems.map(renderSubjectCard).join('') : '<p class="text-center text-slate-400 py-8 text-sm">등록된 교과목이 없습니다.</p>'; wireMethodButtons(secNon); }

            initStep5._running = false;
        }).catch(function (err) {
            console.error(err);
            initStep5._running = false;
            alert('정보를 불러오는데 실패했습니다.');
        });

        function saveEvaluation(redirectToNext) {
            var items = [];
            // form 스코프로 한정 (document 전체 대신)
            var formEl = document.getElementById('ncsStep5Form');
            if (!formEl) return;
            formEl.querySelectorAll('.curriculum-card').forEach(function (card) {
                var id = parseInt(card.getAttribute('data-id'), 10);
                var instructorsSelected = [];
                card.querySelectorAll('.ins-cb:checked').forEach(function (cb) { instructorsSelected.push(parseInt(cb.value, 10)); });
                var evaluatorId = parseInt(card.querySelector('.evaluator-sel').value, 10) || null;
                var tMethods = [];
                card.querySelectorAll('.t-method-sel').forEach(function (s) { if (s.value) tMethods.push(s.value); });
                // 중복 제거
                tMethods = tMethods.filter(function (v, i, a) { return a.indexOf(v) === i; });
                var eMethods = [];
                card.querySelectorAll('.e-method-sel').forEach(function (s) { if (s.value) eMethods.push(s.value); });
                // 중복 제거
                eMethods = eMethods.filter(function (v, i, a) { return a.indexOf(v) === i; });
                var curItem = curriculum.filter(function (it) { return it.id === id; })[0];
                var textbookIds = [];
                var materialIds = [];
                if (curItem) {
                    try { textbookIds = curItem.textbook_ids_json ? JSON.parse(curItem.textbook_ids_json) : []; } catch (e) { }
                    try { materialIds = curItem.material_ids_json ? JSON.parse(curItem.material_ids_json) : []; } catch (e) { }
                }
                items.push({
                    id: id,
                    main_instructor_ids: instructorsSelected,
                    evaluator_id: evaluatorId,
                    teaching_methods: tMethods,
                    evaluation_methods: eMethods,
                    textbook_ids: textbookIds,
                    material_ids: materialIds
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
        if (btnSave5 && !btnSave5._step5Bound) {
            btnSave5._step5Bound = true;
            btnSave5.addEventListener('click', function () { saveEvaluation(false); });
        }
        if (btnNext5 && !btnNext5._step5Bound) {
            btnNext5._step5Bound = true;
            btnNext5.addEventListener('click', function () { saveEvaluation(true); });
        }
    }

    function initStep6() {
        var regInput = document.getElementById('ncsApprovedRegIdStep6');
        var regId = (regInput && regInput.value) ? regInput.value.trim() : '';
        var noReg = document.getElementById('ncsStep6NoReg');
        var form = document.getElementById('ncsStep6Form');
        var loadingEl = document.getElementById('ncsStep6Loading');
        var errorEl = document.getElementById('ncsStep6Error');
        var cardsEl = document.getElementById('ncsStep6Cards');
        var summaryEl = document.getElementById('ncsStep6Summary');

        if (!form) return;
        if (!regId) {
            if (noReg) noReg.classList.remove('hidden');
            form.classList.add('hidden');
            if (summaryEl) summaryEl.classList.add('hidden');
            return;
        }
        if (noReg) noReg.classList.add('hidden');
        form.classList.remove('hidden');

        var allFacilities = [];
        var allEquipment = [];
        var allTextbooks = [];
        var allMaterials = [];
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
            var selectedCount = selectedItems.length;

            var itemHtml = function (it) {
                var safe = function (s) { return String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
                var rn = it.room_number != null ? it.room_number : (it.roomNumber != null ? it.roomNumber : '');
                var label = safe(it.name) + (rn ? ' (' + safe(rn) + ')' : '') + (it.category ? ' <span class="text-slate-400 text-xs">' + safe(it.category) + '</span>' : '');
                return '<div class="list-item" data-id="' + it.id + '" role="option" tabindex="-1" title="클릭하면 반대쪽으로 이동">' +
                    '<span class="list-item-check" aria-hidden="true"></span>' +
                    '<span class="list-item-text">' + label + '</span></div>';
            };

            return '<div class="flex-1 dual-list-block" data-type="' + type + '">' +
                '<div class="dual-list-container" data-type="' + type + '">' +
                '<div class="list-box-wrapper list-box-left">' +
                '<div class="list-box-header"><span class="step6-pane-label step6-pane-label-left">좌측</span> 전체 목록 <span class="text-slate-500 font-normal text-[11px]">· 클릭 시 오른쪽 박스로 추가</span></div>' +
                '<div class="list-box-filter-wrap">' +
                '<input type="text" class="list-box-filter w-full" placeholder="검색..." aria-label="목록 검색"></div>' +
                '<div class="list-content available-list">' + availableItems.map(itemHtml).join('') + '</div>' +
                '</div>' +
                '<div class="list-box-wrapper list-box-right">' +
                '<div class="list-box-header"><span class="step6-pane-label step6-pane-label-right">우측</span> 선택됨 <span class="list-selected-count-inline">' + selectedCount + '</span>개 <span class="text-slate-500 font-normal text-[11px]">· 클릭 시 해제</span></div>' +
                '<div class="list-box-filter-wrap">' +
                '<input type="text" class="list-box-filter w-full" placeholder="검색..." aria-label="선택 목록 검색"></div>' +
                '<div class="list-content selected-list">' + selectedItems.map(itemHtml).join('') + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function createSectionAccordion(sectionType, title, contentHtml, initialCount) {
            var n = initialCount == null ? 0 : initialCount;
            return '<div class="step6-section-accordion border border-slate-200 rounded-xl overflow-hidden mb-4" data-section="' + sectionType + '">' +
                '<div class="step6-section-header flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 border-b border-slate-200 select-none" role="button" tabindex="0" aria-expanded="false">' +
                '<span class="text-sm font-bold text-slate-700">' + title + '</span>' +
                '<span class="step6-section-count text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">' + n + '개</span>' +
                '<i class="fas fa-chevron-down step6-section-chevron text-slate-400 text-xs transition-transform"></i>' +
                '</div>' +
                '<div class="step6-section-body overflow-hidden transition-all duration-200" style="max-height: 0;">' +
                '<div class="step6-section-body-inner p-4 bg-white">' + contentHtml + '</div>' +
                '</div>' +
                '</div>';
        }

        function updateDualListCount(dualListContainer) {
            if (!dualListContainer) return;
            var sel = dualListContainer.querySelector('.selected-list');
            var count = sel ? sel.querySelectorAll('.list-item').length : 0;
            var block = dualListContainer.closest('.dual-list-block');
            if (block) block.querySelectorAll('.list-selected-count, .list-selected-count-inline').forEach(function (el) { el.textContent = count; });
            var section = dualListContainer.closest('.step6-section-accordion');
            if (section) {
                var countEl = section.querySelector('.step6-section-count');
                if (countEl) countEl.textContent = count + '개';
            }
        }

        function renderSubjectCard(item, index) {
            var esc = function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
            var selectedFacilities = [];
            try { selectedFacilities = item.facility_ids_json ? JSON.parse(item.facility_ids_json) : []; } catch (e) { }
            var selectedEquipment = [];
            try { selectedEquipment = item.equipment_ids_json ? JSON.parse(item.equipment_ids_json) : []; } catch (e) { }
            var selectedTextbooks = [];
            try { selectedTextbooks = item.textbook_ids_json ? JSON.parse(item.textbook_ids_json) : []; } catch (e) { }
            var selectedMaterials = [];
            try { selectedMaterials = item.material_ids_json ? JSON.parse(item.material_ids_json) : []; } catch (e) { }

            var typeLabel = item.type === 'ncs' ? 'NCS 전공교과' : (item.type === 'basic' ? 'NCS 소양교과' : '비 NCS 교과');
            var hours = (Number(item.theory_hours) || 0) + (Number(item.practice_hours) || 0);
            var nFac = selectedFacilities.length;
            var nEqu = selectedEquipment.length;
            var nTx = selectedTextbooks.length;
            var nMt = selectedMaterials.length;
            var cardId = 'step6-card-' + (item.id || index);
            var bodyId = 'step6-body-' + (item.id || index);

            var sectionFac = createSectionAccordion('facilities', '시설(강의실/실습실) 매칭', createDualList('시설(강의실/실습실) 매칭', 'facilities', allFacilities, selectedFacilities), nFac);
            var sectionEqu = createSectionAccordion('equipment', '장비 및 기자재 매칭', createDualList('장비 및 기자재 매칭', 'equipment', allEquipment, selectedEquipment), nEqu);
            var sectionTx = createSectionAccordion('textbook', '교재 선택', createDualList('교재 선택', 'textbook', allTextbooks, selectedTextbooks), nTx);
            var sectionMt = createSectionAccordion('material', '훈련 재료 / 소모품', createDualList('훈련 재료 / 소모품', 'material', allMaterials, selectedMaterials), nMt);

            var header = '<div class="step6-card-header flex items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300" data-card-id="' + cardId + '" aria-expanded="true" aria-controls="' + bodyId + '">' +
                '<div class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shrink-0"><i class="fas fa-graduation-cap"></i></div>' +
                '<div class="flex-1 min-w-0">' +
                '<h4 class="text-lg font-black text-slate-800 truncate">' + esc(item.name) + '</h4>' +
                '<p class="text-xs font-bold text-slate-400 mt-0.5">' + typeLabel + ' &middot; ' + hours + '시간</p>' +
                '</div>' +
                '<div class="flex items-center gap-2 shrink-0">' +
                '<span class="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">시설 ' + nFac + '</span>' +
                '<span class="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">장비 ' + nEqu + '</span>' +
                '<span class="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">교재 ' + nTx + '</span>' +
                '<span class="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">소모품 ' + nMt + '</span>' +
                '<i class="fas fa-chevron-down step6-chevron text-slate-400 transition-transform"></i>' +
                '</div>' +
                '</div>';
            var body = '<div id="' + bodyId + '" class="step6-card-body border border-t-0 border-slate-200 rounded-b-2xl bg-slate-50/30" style="max-height: 2000px;">' +
                '<div class="step6-card-body-inner px-6 pb-6">' +
                sectionFac + sectionEqu + sectionTx + sectionMt +
                '</div></div>';

            return '<div class="step6-subject-card bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4" data-id="' + item.id + '" id="' + cardId + '">' + header + body + '</div>';
        }

        function updateSummary() {
            if (!summaryEl) return;
            var cards = document.querySelectorAll('.step6-subject-card');
            var n = cards.length;
            var subjectCountEl = document.getElementById('ncsStep6SubjectCount');
            if (subjectCountEl) subjectCountEl.textContent = n;

            var withFac = 0, withEqu = 0, totalTx = 0, totalMt = 0;
            cards.forEach(function (card) {
                if (card.querySelectorAll('.dual-list-container[data-type="facilities"] .selected-list .list-item').length > 0) withFac++;
                if (card.querySelectorAll('.dual-list-container[data-type="equipment"] .selected-list .list-item').length > 0) withEqu++;
                totalTx += card.querySelectorAll('.dual-list-container[data-type="textbook"] .selected-list .list-item').length;
                totalMt += card.querySelectorAll('.dual-list-container[data-type="material"] .selected-list .list-item').length;
            });

            var facEl = document.getElementById('ncsStep6FacilityBadge');
            var equEl = document.getElementById('ncsStep6EquipmentBadge');
            var txEl = document.getElementById('ncsStep6TextbookBadge');
            var mtEl = document.getElementById('ncsStep6MaterialBadge');
            if (facEl) facEl.textContent = '시설 배정: ' + withFac + '/' + n;
            if (equEl) equEl.textContent = '장비 배정: ' + withEqu + '/' + n;
            if (txEl) txEl.textContent = '교재: ' + totalTx;
            if (mtEl) mtEl.textContent = '소모품: ' + totalMt;
            summaryEl.classList.remove('hidden');
        }

        function wireEvents() {
            if (!cardsEl) return;
            cardsEl.addEventListener('click', function (e) {
                var sectionHeader = e.target.closest('.step6-section-header');
                if (sectionHeader) {
                    var section = sectionHeader.closest('.step6-section-accordion');
                    var sectionBody = section && section.querySelector('.step6-section-body');
                    var chevron = sectionHeader.querySelector('.step6-section-chevron');
                    var expanded = sectionBody && sectionBody.style.maxHeight && sectionBody.style.maxHeight !== '0px';
                    if (sectionBody) sectionBody.style.maxHeight = expanded ? '0' : '800px';
                    if (chevron) chevron.style.transform = expanded ? 'none' : 'rotate(-90deg)';
                    sectionHeader.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                    return;
                }

                var header = e.target.closest('.step6-card-header');
                if (header) {
                    var card = header.closest('.step6-subject-card');
                    var body = card.querySelector('.step6-card-body');
                    var chevron = header.querySelector('.step6-chevron');
                    var expanded = body && !body.classList.contains('collapsed');
                    if (body) body.classList.toggle('collapsed', expanded);
                    if (body) body.style.maxHeight = expanded ? '0' : '2000px';
                    if (chevron) chevron.style.transform = expanded ? 'rotate(-90deg)' : 'none';
                    header.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                    return;
                }

                var item = e.target.closest('.list-item');
                if (item) {
                    e.preventDefault();
                    e.stopPropagation();
                    var container = item.closest('.dual-list-container');
                    var leftList = container.querySelector('.available-list');
                    var rightList = container.querySelector('.selected-list');
                    item.classList.remove('selected');
                    if (item.parentElement === leftList) rightList.appendChild(item); else leftList.appendChild(item);
                    updateDualListCount(container);
                    var card = item.closest('.step6-subject-card');
                    if (card) updateCardBadges(card);
                    updateSummary();
                    return;
                }
            });

            cardsEl.addEventListener('dblclick', function (e) {
                var item = e.target.closest('.list-item');
                if (!item) return;
                e.preventDefault();
                var container = item.closest('.dual-list-container');
                var leftList = container.querySelector('.available-list');
                var rightList = container.querySelector('.selected-list');
                item.classList.remove('selected');
                if (item.parentElement === leftList) rightList.appendChild(item); else leftList.appendChild(item);
                updateDualListCount(container);
                var card = item.closest('.step6-subject-card');
                if (card) updateCardBadges(card);
                updateSummary();
            });

            cardsEl.addEventListener('input', function (e) {
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

        function updateCardBadges(card) {
            if (!card) return;
            var nFac = card.querySelectorAll('.dual-list-container[data-type="facilities"] .selected-list .list-item').length;
            var nEqu = card.querySelectorAll('.dual-list-container[data-type="equipment"] .selected-list .list-item').length;
            var nTx = card.querySelectorAll('.dual-list-container[data-type="textbook"] .selected-list .list-item').length;
            var nMt = card.querySelectorAll('.dual-list-container[data-type="material"] .selected-list .list-item').length;
            var header = card.querySelector('.step6-card-header');
            if (!header) return;
            var badges = header.querySelectorAll('.px-2.py-1.rounded-lg');
            if (badges.length >= 4) {
                badges[0].textContent = '시설 ' + nFac;
                badges[1].textContent = '장비 ' + nEqu;
                badges[2].textContent = '교재 ' + nTx;
                badges[3].textContent = '소모품 ' + nMt;
            }
            card.querySelectorAll('.step6-section-accordion').forEach(function (sec) {
                var type = sec.getAttribute('data-section');
                var cnt = 0;
                if (type === 'facilities') cnt = nFac;
                else if (type === 'equipment') cnt = nEqu;
                else if (type === 'textbook') cnt = nTx;
                else if (type === 'material') cnt = nMt;
                var ce = sec.querySelector('.step6-section-count');
                if (ce) ce.textContent = cnt + '개';
            });
        }

        function loadData() {
            if (loadingEl) loadingEl.classList.remove('hidden');
            if (errorEl) errorEl.classList.add('hidden');
            if (cardsEl) cardsEl.classList.add('hidden');
            if (summaryEl) summaryEl.classList.add('hidden');

            Promise.all([
                apiFetch('/api/hrd/facilities'),
                apiFetch('/api/ncs/approved/hrd-items?category=equipment'),
                apiFetch('/api/ncs/approved/hrd-items?category=textbook'),
                apiFetch('/api/ncs/approved/hrd-items?category=consumable'),
                apiFetch('/api/ncs/approved/registrations/' + regId + '/facilities-equipment')
            ]).then(function (results) {
                if (loadingEl) loadingEl.classList.add('hidden');
                allFacilities = Array.isArray(results[0].data) ? results[0].data : (results[0].success ? [] : allFacilities);
                allEquipment = Array.isArray(results[1].data) ? results[1].data : (results[1].success ? [] : allEquipment);
                allTextbooks = Array.isArray(results[2].data) ? results[2].data : (results[2].success ? [] : allTextbooks);
                allMaterials = Array.isArray(results[3].data) ? results[3].data : (results[3].success ? [] : allMaterials);
                curriculum = Array.isArray(results[4].data) ? results[4].data : (results[4].success ? [] : curriculum);

                if (errorEl) errorEl.classList.add('hidden');
                if (cardsEl) {
                    if (curriculum && curriculum.length) {
                        cardsEl.innerHTML = curriculum.map(function (item, i) { return renderSubjectCard(item, i); }).join('');
                        cardsEl.classList.remove('hidden');
                        wireEvents();
                        cardsEl.querySelectorAll('.dual-list-container').forEach(updateDualListCount);
                        updateSummary();
                    } else {
                        cardsEl.innerHTML = '<div class="text-center py-16 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500 font-medium">등록된 교과목이 없습니다.</p><p class="text-slate-400 text-sm mt-2">교과목편성(3단계)에서 먼저 교과목을 등록해 주세요.</p></div>';
                        cardsEl.classList.remove('hidden');
                    }
                }
                if (summaryEl && curriculum && curriculum.length) summaryEl.classList.remove('hidden');
            }).catch(function (err) {
                console.error(err);
                if (loadingEl) loadingEl.classList.add('hidden');
                if (errorEl) {
                    errorEl.classList.remove('hidden');
                    var retryBtn = document.getElementById('ncsStep6BtnRetry');
                    if (retryBtn) retryBtn.onclick = loadData;
                }
                if (cardsEl) {
                    if (curriculum && curriculum.length) {
                        cardsEl.innerHTML = curriculum.map(function (item, i) { return renderSubjectCard(item, i); }).join('');
                        wireEvents();
                        cardsEl.querySelectorAll('.dual-list-container').forEach(updateDualListCount);
                        updateSummary();
                    }
                    cardsEl.classList.remove('hidden');
                }
                if (summaryEl && curriculum && curriculum.length) summaryEl.classList.remove('hidden');
            });
        }

        var refreshBtn = document.getElementById('ncsStep6BtnRefresh');
        if (refreshBtn) refreshBtn.addEventListener('click', loadData);

        loadData();

        function saveFacilities(redirectToNext) {
            var items = [];
            var noFacilityEquipment = [];
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
                var textbookIds = [];
                card.querySelectorAll('.dual-list-container[data-type="textbook"] .selected-list .list-item').forEach(function (el) { textbookIds.push(parseInt(el.getAttribute('data-id'), 10)); });
                var materialIds = [];
                card.querySelectorAll('.dual-list-container[data-type="material"] .selected-list .list-item').forEach(function (el) { materialIds.push(parseInt(el.getAttribute('data-id'), 10)); });

                if (facilityIds.length === 0 && equipmentIds.length === 0) {
                    var nameEl = card.querySelector('.step6-card-header h4');
                    noFacilityEquipment.push(nameEl ? nameEl.textContent.trim() : '과목 #' + id);
                }
                items.push({
                    id: id,
                    facility_ids: facilityIds,
                    equipment_ids: equipmentIds,
                    textbook_ids: textbookIds,
                    material_ids: materialIds
                });
            });

            if (redirectToNext && noFacilityEquipment.length > 0 && !confirm('시설·장비가 배정되지 않은 교과목이 ' + noFacilityEquipment.length + '개 있습니다.\n그래도 설정 완료하시겠습니까?')) return;

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
        if (!window.NCS_EMBED_COURSE_ID) {
            console.error('loadNcsStep failed: window.NCS_EMBED_COURSE_ID is missing');
            return;
        }
        console.log('loadNcsStep executing for step:', stepNum, 'courseId:', window.NCS_EMBED_COURSE_ID);
        var loader = document.getElementById('ncsContentLoader');
        if (loader) loader.classList.remove('hidden');

        var url = '/api/ncs/approved/render-step?step=' + stepNum + '&courseId=' + window.NCS_EMBED_COURSE_ID;
        var token = localStorage.getItem('token');
        fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP Error: ' + r.status);
                return r.text();
            })
            .then(function (html) {
                console.log('Step content fetched successfully for step:', stepNum);
                if (loader) loader.classList.add('hidden');
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

    window.syncUnitElements = function (btn, unitCode) {
        if (!confirm('이 능력단위가 속한 직종의 NCS 데이터를 동기화하시겠습니까?\n(공공 API 호출로 인해 약 10~30초가 소요됩니다)')) return;
        var token = localStorage.getItem('token');
        var original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 동기화 중...';

        // 8자리 세분류 코드 추출 (능력단위 코드의 앞 8자리)
        var subClass = (unitCode || '').replace(/[^0-9]/g, '').substring(0, 8);

        fetch('/api/ncs/approved/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (token || '')
            },
            body: JSON.stringify({ subClassCode: subClass })
        })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) {
                    alert('동기화 성공! 화면을 다시 로드하여 데이터를 반영합니다.');
                    if (window.loadNcsStep) window.loadNcsStep(3); // Re-load current step
                    else location.reload();
                } else {
                    alert('동기화 실패: ' + json.error);
                    btn.disabled = false;
                    btn.innerHTML = original;
                }
            })
            .catch(function (e) {
                alert('오류 발생: ' + e);
                btn.disabled = false;
                btn.innerHTML = original;
            });
    };

})();

