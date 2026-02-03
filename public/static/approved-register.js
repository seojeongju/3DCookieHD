(function () {
    var form = document.getElementById('approvedRegisterForm');
    if (!form) return;
    var formIdEl = document.getElementById('approvedFormId');
    var editId = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';

    var categoryNames = {};
    var textbookAll = [];
    var textbookSelected = [];
    var consumableAll = [];
    var consumableSelected = [];
    var equipmentAll = [];
    var equipmentSelected = [];
    var facilityAll = [];
    var facilitySelected = [];

    var token = function () { return localStorage.getItem('token'); };

    function loadHrdItems(category, setAll) {
        return fetch('/api/hrd/items?category=' + encodeURIComponent(category) + '&limit=500', { headers: token() ? { 'Authorization': 'Bearer ' + token() } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success && Array.isArray(json.data)) setAll(json.data.map(function (it) { return { id: it.id, name: (it.name || '').trim() || '-' }; }));
            })
            .catch(function (e) { console.error('loadHrdItems', category, e); });
    }

    function loadFacilities(setAll) {
        return fetch('/api/hrd/facilities', { headers: token() ? { 'Authorization': 'Bearer ' + token() } : {} })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success && Array.isArray(json.data)) setAll(json.data.map(function (it) { return { id: it.id, name: (it.name || '').trim() || '-' }; }));
            })
            .catch(function (e) { console.error('loadFacilities', e); });
    }

    function loadCategories() {
        return fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var reLt = new RegExp('<', 'g');
                var sel = document.getElementById('approvedFormCategory');
                if (sel) {
                    (json.data || []).forEach(function (c) {
                        categoryNames[c.id] = c.name || '';
                    });
                    sel.innerHTML = '<option value="">선택</option>' + json.data.map(function (c) {
                        return '<option value="' + c.id + '">' + (c.name || '').replace(reLt, '&lt;') + '</option>';
                    }).join('');
                    sel.addEventListener('change', function () {
                        var label = document.getElementById('approvedNcsCourseLabel');
                        if (label) {
                            var id = sel.value;
                            var name = id ? (categoryNames[id] || '') : '';
                            label.textContent = name ? '해당과정은 NCS 훈련과정 (' + name + ') 입니다.' : '해당과정은 NCS 훈련과정 입니다. (과정분류 선택 시 표시)';
                        }
                    });
                }
            })
            .catch(function (e) { console.error(e); });
    }

    function loadPersonnel() {
        var container = document.getElementById('approvedFormInstructorList');
        if (!container) return;
        fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !Array.isArray(json.data)) {
                    container.innerHTML = '<span class="text-slate-500 text-sm">등록된 교직원이 없습니다.</span>';
                    return;
                }
                var list = json.data;
                container.innerHTML = list.map(function (p) {
                    var name = (p.name || '').trim() || '(이름 없음)';
                    var id = p.id != null ? p.id : '';
                    return '<label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer shrink-0"><input type="checkbox" class="approved-instructor-cb rounded text-emerald-600" value="' + id + '" data-name="' + name.replace(/"/g, '&quot;') + '"> <span class="text-sm text-slate-800">' + name.replace(/</g, '&lt;') + '</span></label>';
                }).join('');

                // Add event listener for sync
                container.addEventListener('change', function (e) {
                    if (e.target.classList.contains('approved-instructor-cb')) {
                        var checkedNames = [];
                        container.querySelectorAll('.approved-instructor-cb:checked').forEach(function (cb) {
                            checkedNames.push(cb.getAttribute('data-name'));
                        });
                        var currentManual = document.getElementById('approvedFormInstructor').value || '';
                        // Keep manual entries that are not in the list if they are unique
                        var manualNames = currentManual.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
                        var allListNames = list.map(function (p) { return (p.name || '').trim(); });

                        var updatedManual = manualNames.filter(function (m) { return allListNames.indexOf(m) === -1; });
                        var finalNames = updatedManual.concat(checkedNames);
                        document.getElementById('approvedFormInstructor').value = finalNames.join(', ');
                    }
                });
            })
            .catch(function () {
                container.innerHTML = '<span class="text-slate-500 text-sm">교직원 목록을 불러올 수 없습니다.</span>';
            });
    }

    function renderDualList(allList, selectedList, allContainerId, selectedContainerId, allCountId, selectedCountId) {
        var allEl = document.getElementById(allContainerId);
        var selEl = document.getElementById(selectedContainerId);
        var allCountEl = document.getElementById(allCountId);
        var selCountEl = document.getElementById(selectedCountId);
        if (allEl) allEl.innerHTML = allList.length ? allList.map(function (item) {
            return '<label class="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer"><input type="checkbox" class="dual-list-cb" data-id="' + (item.id || '') + '" data-name="' + (item.name || '').replace(/"/g, '&quot;') + '"> <span>' + (item.name || '').replace(/</g, '&lt;') + '</span></label>';
        }).join('') : '<p class="text-slate-500 text-sm py-2">Empty list</p>';
        if (selEl) selEl.innerHTML = selectedList.length ? selectedList.map(function (item) {
            return '<label class="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer"><input type="checkbox" class="dual-list-selected-cb" data-id="' + (item.id || '') + '" data-name="' + (item.name || '').replace(/"/g, '&quot;') + '"> <span>' + (item.name || '').replace(/</g, '&lt;') + '</span></label>';
        }).join('') : '<p class="text-slate-500 text-sm py-2">Empty list</p>';
        if (allCountEl) allCountEl.textContent = allList.length;
        if (selCountEl) selCountEl.textContent = selectedList.length;
    }

    function updateTextbookCounts() {
        var a = document.getElementById('approvedTextbookAllCount');
        var s = document.getElementById('approvedTextbookSelectedCount');
        if (a) a.textContent = textbookAll.length;
        if (s) s.textContent = textbookSelected.length;
    }

    function updateConsumableCounts() {
        var a = document.getElementById('approvedConsumableAllCount');
        var s = document.getElementById('approvedConsumableSelectedCount');
        if (a) a.textContent = consumableAll.length;
        if (s) s.textContent = consumableSelected.length;
    }

    function updateEquipmentCounts() {
        var a = document.getElementById('approvedEquipmentAllCount');
        var s = document.getElementById('approvedEquipmentSelectedCount');
        if (a) a.textContent = equipmentAll.length;
        if (s) s.textContent = equipmentSelected.length;
    }

    function updateFacilityCounts() {
        var a = document.getElementById('approvedFacilityAllCount');
        var s = document.getElementById('approvedFacilitySelectedCount');
        if (a) a.textContent = facilityAll.length;
        if (s) s.textContent = facilitySelected.length;
    }

    function initTextbookDualList() {
        textbookSelected = textbookSelected || [];
        renderDualList(textbookAll, textbookSelected, 'approvedTextbookAllList', 'approvedTextbookSelectedList', 'approvedTextbookAllCount', 'approvedTextbookSelectedCount');
        updateTextbookCounts();
    }

    function initConsumableDualList() {
        consumableSelected = consumableSelected || [];
        renderDualList(consumableAll, consumableSelected, 'approvedConsumableAllList', 'approvedConsumableSelectedList', 'approvedConsumableAllCount', 'approvedConsumableSelectedCount');
        updateConsumableCounts();
    }

    function initEquipmentDualList() {
        equipmentSelected = equipmentSelected || [];
        renderDualList(equipmentAll, equipmentSelected, 'approvedEquipmentAllList', 'approvedEquipmentSelectedList', 'approvedEquipmentAllCount', 'approvedEquipmentSelectedCount');
        updateEquipmentCounts();
    }

    function initFacilityDualList() {
        facilitySelected = facilitySelected || [];
        renderDualList(facilityAll, facilitySelected, 'approvedFacilityAllList', 'approvedFacilitySelectedList', 'approvedFacilityAllCount', 'approvedFacilitySelectedCount');
        updateFacilityCounts();
    }

    function wireDualList(prefix, allArr, selectedArr, updateCounts) {
        var allListId = prefix + 'AllList';
        var selListId = prefix + 'SelectedList';
        function addSelected() {
            var container = document.getElementById(allListId);
            if (!container) return;
            var checked = container.querySelectorAll('.dual-list-cb:checked');
            checked.forEach(function (cb) {
                var id = cb.getAttribute('data-id');
                var name = cb.getAttribute('data-name') || '';
                var item = { id: id, name: name };
                var idx = allArr.findIndex(function (x) { return String(x.id) === String(id); });
                if (idx >= 0) {
                    allArr.splice(idx, 1);
                    selectedArr.push(item);
                }
            });
            renderDualList(allArr, selectedArr, allListId, selListId, prefix + 'AllCount', prefix + 'SelectedCount');
            updateCounts();
        }
        function addAll() {
            while (allArr.length) {
                var it = allArr.shift();
                selectedArr.push(it);
            }
            renderDualList(allArr, selectedArr, allListId, selListId, prefix + 'AllCount', prefix + 'SelectedCount');
            updateCounts();
        }
        function removeSelected() {
            var container = document.getElementById(selListId);
            if (!container) return;
            var checked = container.querySelectorAll('.dual-list-selected-cb:checked');
            checked.forEach(function (cb) {
                var id = cb.getAttribute('data-id');
                var name = cb.getAttribute('data-name') || '';
                var item = { id: id, name: name };
                var idx = selectedArr.findIndex(function (x) { return String(x.id) === String(id); });
                if (idx >= 0) {
                    selectedArr.splice(idx, 1);
                    allArr.push(item);
                }
            });
            renderDualList(allArr, selectedArr, allListId, selListId, prefix + 'AllCount', prefix + 'SelectedCount');
            updateCounts();
        }
        function removeAll() {
            while (selectedArr.length) {
                var it = selectedArr.shift();
                allArr.push(it);
            }
            renderDualList(allArr, selectedArr, allListId, selListId, prefix + 'AllCount', prefix + 'SelectedCount');
            updateCounts();
        }
        var addBtn = document.getElementById(prefix + 'Add');
        var addAllBtn = document.getElementById(prefix + 'AddAll');
        var remBtn = document.getElementById(prefix + 'Remove');
        var remAllBtn = document.getElementById(prefix + 'RemoveAll');
        if (addBtn) addBtn.addEventListener('click', addSelected);
        if (addAllBtn) addAllBtn.addEventListener('click', addAll);
        if (remBtn) remBtn.addEventListener('click', removeSelected);
        if (remAllBtn) remAllBtn.addEventListener('click', removeAll);
    }

    function applySelectedIds(allArr, selectedArr, ids) {
        if (!Array.isArray(ids)) return;
        var idSet = {};
        ids.forEach(function (id) { idSet[String(id)] = true; });
        for (var i = allArr.length - 1; i >= 0; i--) {
            if (idSet[String(allArr[i].id)]) {
                selectedArr.push(allArr.splice(i, 1)[0]);
            }
        }
    }

    function loadCourse(id) {
        return fetch('/api/approved-courses/' + id, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var d = json.data;
                document.getElementById('approvedFormName').value = d.name || '';
                document.getElementById('approvedFormCategory').value = d.category_id != null ? d.category_id : '';
                var catSel = document.getElementById('approvedFormCategory');
                if (catSel && catSel.value && categoryNames[catSel.value]) {
                    var label = document.getElementById('approvedNcsCourseLabel');
                    if (label) label.textContent = '해당과정은 NCS 훈련과정 (' + categoryNames[catSel.value] + ') 입니다.';
                }
                document.getElementById('approvedFormCapacity').value = d.capacity != null ? d.capacity : '';
                document.getElementById('approvedFormInstructor').value = d.instructor_name || '';
                document.getElementById('approvedFormApprovalOrg').value = d.approval_org || '';
                document.getElementById('approvedFormRegisteredAt').value = (d.registered_at || '').slice(0, 10);
                document.getElementById('approvedFormStatus').value = d.status || 'active';
                document.getElementById('approvedFormUrlNcs').value = d.url_ncs || '';
                document.getElementById('approvedFormUrlPlan').value = d.url_plan || '';
                document.getElementById('approvedFormUrlDetailPlan').value = d.url_detail_plan || '';

                // Add financial and time fields
                document.getElementById('approvedFormHourlyRate').value = d.hourly_rate != null ? d.hourly_rate : '';
                document.getElementById('approvedFormTotalDays').value = d.total_days != null ? d.total_days : '';
                document.getElementById('approvedFormTotalCost').value = d.total_cost != null ? d.total_cost : '';
                document.getElementById('approvedFormTotalHours').value = d.total_hours != null ? d.total_hours : '';
                document.getElementById('approvedFormDailyHours').value = d.daily_hours != null ? d.daily_hours : '';
                document.getElementById('approvedFormGovSubsidy').value = d.gov_subsidy != null ? d.gov_subsidy : '';

                applySelectedIds(textbookAll, textbookSelected, d.textbook_ids);
                applySelectedIds(consumableAll, consumableSelected, d.consumable_ids);
                applySelectedIds(equipmentAll, equipmentSelected, d.equipment_ids);
                applySelectedIds(facilityAll, facilitySelected, d.facility_ids);
                initTextbookDualList();
                initConsumableDualList();
                initEquipmentDualList();
                initFacilityDualList();

                // Sync instructor checkboxes
                var instructorStr = d.instructor_name || '';
                var instructorNames = instructorStr.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
                var container = document.getElementById('approvedFormInstructorList');
                if (container) {
                    container.querySelectorAll('.approved-instructor-cb').forEach(function (cb) {
                        var name = cb.getAttribute('data-name');
                        if (instructorNames.indexOf(name) !== -1) {
                            cb.checked = true;
                        }
                    });
                }
            })
            .catch(function () { alert('조회 실패'); });
    }

    function submitForm(e) {
        e.preventDefault();
        var id = (formIdEl && formIdEl.value) ? formIdEl.value.trim() : '';
        var name = (document.getElementById('approvedFormName').value || '').trim();
        if (!name) { alert('과정명을 입력하세요.'); return; }
        var categoryId = document.getElementById('approvedFormCategory').value;
        var capacity = document.getElementById('approvedFormCapacity').value;

        var hourlyRate = document.getElementById('approvedFormHourlyRate').value;
        var totalDays = document.getElementById('approvedFormTotalDays').value;
        var totalCost = document.getElementById('approvedFormTotalCost').value;
        var totalHours = document.getElementById('approvedFormTotalHours').value;
        var dailyHours = document.getElementById('approvedFormDailyHours').value;
        var govSubsidy = document.getElementById('approvedFormGovSubsidy').value;

        var payload = {
            name: name,
            category_id: categoryId ? parseInt(categoryId, 10) : null,
            capacity: capacity !== '' ? parseInt(capacity, 10) : null,
            training_time_start: null,
            training_time_end: null,
            instructor_name: (document.getElementById('approvedFormInstructor').value || '').trim() || null,
            approval_org: (document.getElementById('approvedFormApprovalOrg').value || '').trim() || null,
            registered_at: (document.getElementById('approvedFormRegisteredAt').value || '').trim() || null,
            status: document.getElementById('approvedFormStatus').value || 'active',
            url_ncs: (document.getElementById('approvedFormUrlNcs').value || '').trim() || null,
            url_plan: (document.getElementById('approvedFormUrlPlan').value || '').trim() || null,
            url_detail_plan: (document.getElementById('approvedFormUrlDetailPlan').value || '').trim() || null,
            textbook_ids: textbookSelected.map(function (i) { return parseInt(i.id, 10); }),
            consumable_ids: consumableSelected.map(function (i) { return parseInt(i.id, 10); }),
            equipment_ids: equipmentSelected.map(function (i) { return parseInt(i.id, 10); }),
            facility_ids: facilitySelected.map(function (i) { return parseInt(i.id, 10); }),

            hourly_rate: hourlyRate !== '' ? parseInt(hourlyRate, 10) : null,
            total_days: totalDays !== '' ? parseInt(totalDays, 10) : null,
            total_cost: totalCost !== '' ? parseInt(totalCost, 10) : null,
            total_hours: totalHours !== '' ? parseInt(totalHours, 10) : null,
            daily_hours: dailyHours !== '' ? parseFloat(dailyHours) : null,
            gov_subsidy: govSubsidy !== '' ? parseInt(govSubsidy, 10) : null
        };
        var url = id ? '/api/approved-courses/' + id : '/api/approved-courses';
        var method = id ? 'PUT' : 'POST';
        var btn = document.getElementById('approvedFormSubmit');
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
                    if (id) {
                        alert('저장되었습니다.');
                        window.location.reload();
                    } else {
                        alert('기본정보가 등록되었습니다.\n자동으로 NCS 설계 탭으로 이동합니다.');
                        window.location.href = '/admin/courses/approved/register?id=' + json.data.id + '&tab=ncs';
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

    var planAttach = document.getElementById('approvedFormPlanAttach');
    if (planAttach) {
        planAttach.addEventListener('click', function () {
            alert('수업계획서 파일첨부는 추후 업로드 API 연동 후 사용 가능합니다.');
        });
    }

    var instructorAdd = document.getElementById('approvedFormInstructorAdd');
    if (instructorAdd) {
        instructorAdd.addEventListener('click', function () {
            var nameInput = document.getElementById('approvedFormInstructorNameQuick');
            var name = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
            if (!name) { alert('강사명을 입력하세요.'); return; }

            var instructorInput = document.getElementById('approvedFormInstructor');
            var current = (instructorInput.value || '').trim();
            if (current) {
                var names = current.split(',').map(function (s) { return s.trim(); });
                if (names.indexOf(name) === -1) {
                    instructorInput.value = current + ', ' + name;
                }
            } else {
                instructorInput.value = name;
            }
            nameInput.value = '';
        });
    }


    form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();
        }
    });

    form.addEventListener('submit', submitForm);

    loadCategories().then(function () {
        loadPersonnel();
        Promise.all([
            loadHrdItems('textbook', function (arr) { textbookAll = arr || []; }),
            loadHrdItems('consumable', function (arr) { consumableAll = arr || []; }),
            loadHrdItems('equipment', function (arr) { equipmentAll = arr || []; }),
            loadFacilities(function (arr) { facilityAll = arr || []; })
        ]).then(function () {
            initTextbookDualList();
            initConsumableDualList();
            initEquipmentDualList();
            initFacilityDualList();
            wireDualList('approvedTextbook', textbookAll, textbookSelected, updateTextbookCounts);
            wireDualList('approvedConsumable', consumableAll, consumableSelected, updateConsumableCounts);
            wireDualList('approvedEquipment', equipmentAll, equipmentSelected, updateEquipmentCounts);
            wireDualList('approvedFacility', facilityAll, facilitySelected, updateFacilityCounts);
            if (editId) loadCourse(editId);

            // Auto Calculation Logic
            (function () {
                var elRate = document.getElementById('approvedFormHourlyRate');
                var elDays = document.getElementById('approvedFormTotalDays');
                var elTotalCost = document.getElementById('approvedFormTotalCost');
                var elTotalHours = document.getElementById('approvedFormTotalHours');
                var elDailyHours = document.getElementById('approvedFormDailyHours');
                var elSubsidy = document.getElementById('approvedFormGovSubsidy');

                function calc() {
                    var days = parseInt(elDays.value || '0', 10);
                    var daily = parseFloat(elDailyHours.value || '0');
                    var rate = parseInt(elRate.value || '0', 10);

                    // Calc Total Hours
                    var totalH = days * daily;
                    // Only update if it makes sense (not overwriting user specific override if we consider it authoritative? 
                    // Usually auto-calc is better for data consistency)
                    if (elTotalHours) elTotalHours.value = totalH;

                    // Calc Total Cost
                    var totalC = totalH * rate;
                    if (elTotalCost) elTotalCost.value = totalC;

                    // Calc Subsidy (Default to Equal to Cost if empty or we want to sync)
                    // Let's just update it if it's likely they are same for full funding
                    if (elSubsidy) elSubsidy.value = totalC;
                }

                var inputs = [elRate, elDays, elDailyHours];
                inputs.forEach(function (el) {
                    if (el) el.addEventListener('input', calc);
                });
                // Also trigger once on load if values exist? No, might overwrite DB data with calculated data which might be slightly different due to manual edits.
                // Best to only trigger on User Input.
            })();

            // Auto-switch tab if param exists
            var params = new URLSearchParams(window.location.search);
            var tab = params.get('tab');
            if (tab && window.switchTab) {
                // Ensure DOM is ready? We are already running.
                // Small delay to ensure animations/transitions work or just call it.
                setTimeout(function () { window.switchTab(tab); }, 100);
            }
        });
    });
})();
