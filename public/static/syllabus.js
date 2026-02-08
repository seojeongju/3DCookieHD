(function() {
    var sessionId = typeof window.SYLLABUS_SESSION_ID !== 'undefined' ? String(window.SYLLABUS_SESSION_ID) : '';
    if (!sessionId) return;

    var token = localStorage.getItem('token');
    var headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
    var sessionData = null;
    var subjects = [];
    var registrationId = null;
    var currentCurriculumId = null;
    var currentSubjectName = '';

    var facilities = [];
    var equipment = [];
    var textbooks = [];
    var materials = [];
    var step6MasterLoaded = false;

    var el = function(id) { return document.getElementById(id); };
    var courseNameEl = el('syllabusCourseName');
    var tabsContainer = el('syllabusSubjectTabs');
    var formArea = el('syllabusFormArea');
    var emptyState = el('syllabusEmptyState');
    var subjectTitleSpan = el('syllabusSubjectTitle') ? el('syllabusSubjectTitle').querySelector('span') : null;

    function showForm(show) {
        if (formArea) formArea.classList.toggle('hidden', !show);
        if (emptyState) emptyState.classList.toggle('hidden', show);
    }

    function loadSubjects() {
        if (!tabsContainer) return;
        tabsContainer.innerHTML = '<span class="text-slate-400 text-sm">교과목 로딩 중...</span>';
        fetch('/api/ncs/approved/syllabus/session/' + encodeURIComponent(sessionId) + '/subjects', { headers: headers })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (!res.success || !res.data) {
                    tabsContainer.innerHTML = '<span class="text-red-500 text-sm">교과목 목록을 불러올 수 없습니다.</span>';
                    if (courseNameEl) courseNameEl.innerHTML = '과정명 : <span class="text-slate-400">-</span>';
                    return;
                }
                sessionData = res.data.session || {};
                subjects = res.data.subjects || [];
                registrationId = res.data.registration_id != null ? res.data.registration_id : null;
                var name = sessionData.course_name || '-';
                if (courseNameEl) courseNameEl.innerHTML = '과정명 : <span class="text-slate-700">' + escapeHtml(name) + '</span>';
                if (subjects.length === 0) {
                    tabsContainer.innerHTML = '<span class="text-slate-500 text-sm">등록된 교과목이 없습니다. NCS 훈련과정 개설정보에서 교과목 편성을 먼저 등록하세요.</span>';
                    return;
                }
                tabsContainer.innerHTML = '';
                subjects.forEach(function(subj) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'syllabus-subject-tab px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition';
                    btn.textContent = subj.name || ('과목 #' + subj.id);
                    btn.dataset.curriculumId = String(subj.id);
                    btn.dataset.subjectName = subj.name || '';
                    btn.addEventListener('click', function() { selectSubject(subj.id, subj.name); });
                    tabsContainer.appendChild(btn);
                });
            })
            .catch(function() {
                tabsContainer.innerHTML = '<span class="text-red-500 text-sm">연결 실패</span>';
                if (courseNameEl) courseNameEl.innerHTML = '과정명 : <span class="text-slate-400">-</span>';
            });
    }

    function escapeHtml(s) {
        if (s == null) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function getSubjectStep6(subj) {
        var f = [], e = [], t = [], m = [];
        if (subj) {
            try { f = subj.facility_ids_json ? JSON.parse(subj.facility_ids_json) : []; } catch (x) {}
            try { e = subj.equipment_ids_json ? JSON.parse(subj.equipment_ids_json) : []; } catch (x) {}
            try { t = subj.textbook_ids_json ? JSON.parse(subj.textbook_ids_json) : []; } catch (x) {}
            try { m = subj.material_ids_json ? JSON.parse(subj.material_ids_json) : []; } catch (x) {}
        }
        return { facilityIds: f, equipmentIds: e, textbookIds: t, materialIds: m };
    }

    function idToNames(ids, list) {
        if (!ids || !ids.length) return [];
        var map = {};
        (list || []).forEach(function(it) { map[it.id] = it.name || ''; });
        return ids.map(function(id) { return map[id] || ('#' + id); });
    }

    function renderStep6List(subj) {
        var listEl = el('syllabusStep6List');
        if (!listEl) return;
        if (!subj) {
            listEl.innerHTML = '<span class="text-slate-400">교과목 선택 시 여기에 시설·장비 목록이 표시됩니다.</span>';
            return;
        }
        if (!registrationId) {
            listEl.innerHTML = '<span class="text-slate-400">이 과정은 NCS 훈련과정이 연결되지 않았습니다. NCS 설계를 먼저 등록하면 시설·장비를 여기서 확인·수정할 수 있습니다.</span>';
            return;
        }
        var step6 = getSubjectStep6(subj);
        var fNames = idToNames(step6.facilityIds, facilities);
        var eNames = idToNames(step6.equipmentIds, equipment);
        var tNames = idToNames(step6.textbookIds, textbooks);
        var mNames = idToNames(step6.materialIds, materials);
        var parts = [];
        if (fNames.length) parts.push('<strong class="text-slate-600">시설:</strong> ' + escapeHtml(fNames.join(', ')));
        if (eNames.length) parts.push('<strong class="text-slate-600">장비:</strong> ' + escapeHtml(eNames.join(', ')));
        if (tNames.length) parts.push('<strong class="text-slate-600">교재:</strong> ' + escapeHtml(tNames.join(', ')));
        if (mNames.length) parts.push('<strong class="text-slate-600">소모품:</strong> ' + escapeHtml(mNames.join(', ')));
        if (parts.length === 0) {
            listEl.innerHTML = '<span class="text-slate-400">이 교과목에 배정된 시설·장비가 없습니다. 아래 "수정"에서 추가하거나 NCS 6단계에서 설정하세요.</span>';
        } else {
            listEl.innerHTML = '<div class="space-y-1.5">' + parts.map(function(p) { return '<div>' + p + '</div>'; }).join('') + '</div>';
        }
    }

    function loadStep6Master(cb) {
        if (step6MasterLoaded && cb) { cb(); return; }
        Promise.all([
            fetch('/api/ncs/approved/facilities', { headers: headers }).then(function(r) { return r.json(); }),
            fetch('/api/ncs/approved/hrd-items?category=equipment', { headers: headers }).then(function(r) { return r.json(); }),
            fetch('/api/ncs/approved/hrd-items?category=textbook', { headers: headers }).then(function(r) { return r.json(); }),
            fetch('/api/ncs/approved/hrd-items?category=consumable', { headers: headers }).then(function(r) { return r.json(); })
        ]).then(function(results) {
            facilities = (results[0].success && results[0].data) ? results[0].data : [];
            equipment = (results[1].success && results[1].data) ? results[1].data : [];
            textbooks = (results[2].success && results[2].data) ? results[2].data : [];
            materials = (results[3].success && results[3].data) ? results[3].data : [];
            step6MasterLoaded = true;
            if (cb) cb();
        }).catch(function() {
            if (cb) cb();
        });
    }

    function buildDualList(type, allItems, selectedIds, label) {
        var selectedSet = {};
        (selectedIds || []).forEach(function(id) { selectedSet[id] = true; });
        var available = allItems.filter(function(it) { return !selectedSet[it.id]; });
        var selected = allItems.filter(function(it) { return selectedSet[it.id]; });
        function itemHtml(it) {
            var name = escapeHtml(it.name || '');
            var sub = (it.room_number != null || it.roomNumber != null) ? ' <span class="text-slate-400 text-xs">(' + escapeHtml(String(it.room_number != null ? it.room_number : it.roomNumber)) + ')</span>' : '';
            return '<div class="syllabus-step6-list-item list-item border-b border-slate-100 last:border-0 py-1.5 px-2 cursor-pointer hover:bg-blue-50 rounded text-sm" data-id="' + it.id + '" data-type="' + type + '" role="option">' + name + sub + '</div>';
        }
        return '<div class="syllabus-step6-dual border border-slate-200 rounded-lg overflow-hidden" data-type="' + type + '">' +
            '<div class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1">' + escapeHtml(label) + '</div>' +
            '<div class="flex gap-2" style="min-height: 120px;">' +
            '<div class="flex-1 border-r border-slate-200 bg-slate-50/50 p-2 overflow-auto available-list">' +
            available.map(itemHtml).join('') +
            '</div>' +
            '<div class="flex-1 p-2 overflow-auto selected-list bg-blue-50/30">' +
            selected.map(itemHtml).join('') +
            '</div>' +
            '</div></div>';
    }

    function openStep6Edit() {
        if (!currentCurriculumId || !registrationId) {
            alert('시설·장비를 수정하려면 NCS 훈련과정이 연결된 회차여야 합니다.');
            return;
        }
        var subj = subjects.filter(function(s) { return s.id === currentCurriculumId; })[0];
        if (!subj) return;
        loadStep6Master(function() {
            var step6 = getSubjectStep6(subj);
            var content = el('syllabusStep6EditContent');
            if (!content) return;
            content.innerHTML =
                buildDualList('facilities', facilities, step6.facilityIds, '시설(강의실/실습실)') +
                buildDualList('equipment', equipment, step6.equipmentIds, '장비·기자재') +
                buildDualList('textbook', textbooks, step6.textbookIds, '교재') +
                buildDualList('material', materials, step6.materialIds, '훈련재료/소모품');
            el('syllabusStep6Edit').classList.remove('hidden');
            el('syllabusStep6List').classList.add('hidden');
            wireStep6DualLists();
        });
    }

    function wireStep6DualLists() {
        var editContent = el('syllabusStep6EditContent');
        if (!editContent) return;
        editContent.addEventListener('click', function(e) {
            var item = e.target.closest('.syllabus-step6-list-item');
            if (!item) return;
            var type = item.getAttribute('data-type');
            var list = item.closest('.available-list') || item.closest('.selected-list');
            if (!list) return;
            var dual = item.closest('.syllabus-step6-dual');
            var available = dual.querySelector('.available-list');
            var selected = dual.querySelector('.selected-list');
            if (list === available) {
                selected.appendChild(item);
            } else {
                available.appendChild(item);
            }
        });
    }

    function getSelectedIdsFromDual(type) {
        var dual = document.querySelector('.syllabus-step6-dual[data-type="' + type + '"]');
        if (!dual) return [];
        var sel = dual.querySelector('.selected-list');
        if (!sel) return [];
        var ids = [];
        sel.querySelectorAll('.syllabus-step6-list-item').forEach(function(el) {
            var id = parseInt(el.getAttribute('data-id'), 10);
            if (!isNaN(id)) ids.push(id);
        });
        return ids;
    }

    function saveStep6() {
        if (!registrationId) {
            alert('NCS 훈련과정이 연결되지 않은 회차입니다.');
            return;
        }
        var subj = subjects.filter(function(s) { return s.id === currentCurriculumId; })[0];
        if (!subj) return;

        var facilityIds = getSelectedIdsFromDual('facilities');
        var equipmentIds = getSelectedIdsFromDual('equipment');
        var textbookIds = getSelectedIdsFromDual('textbook');
        var materialIds = getSelectedIdsFromDual('material');

        var items = subjects.map(function(s) {
            if (s.id === currentCurriculumId) {
                return { id: s.id, facility_ids: facilityIds, equipment_ids: equipmentIds, textbook_ids: textbookIds, material_ids: materialIds };
            }
            var step6 = getSubjectStep6(s);
            return { id: s.id, facility_ids: step6.facilityIds, equipment_ids: step6.equipmentIds, textbook_ids: step6.textbookIds, material_ids: step6.materialIds };
        });

        var btn = el('syllabusStep6BtnSave');
        if (btn) btn.disabled = true;
        fetch('/api/ncs/approved/registrations/' + registrationId + '/facilities-equipment', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ items: items })
        }).then(function(r) { return r.json(); }).then(function(json) {
            if (btn) btn.disabled = false;
            if (json.success) {
                var s = subjects.filter(function(x) { return x.id === currentCurriculumId; })[0];
                if (s) {
                    s.facility_ids_json = JSON.stringify(facilityIds);
                    s.equipment_ids_json = JSON.stringify(equipmentIds);
                    s.textbook_ids_json = JSON.stringify(textbookIds);
                    s.material_ids_json = JSON.stringify(materialIds);
                }
                el('syllabusStep6Edit').classList.add('hidden');
                el('syllabusStep6List').classList.remove('hidden');
                renderStep6List(s);
                alert('시설·장비가 저장되었습니다.');
            } else {
                alert(json.error || '저장 실패');
            }
        }).catch(function() {
            if (btn) btn.disabled = false;
            alert('저장 중 오류가 발생했습니다.');
        });
    }

    function cancelStep6Edit() {
        el('syllabusStep6Edit').classList.add('hidden');
        el('syllabusStep6List').classList.remove('hidden');
        var subj = subjects.filter(function(s) { return s.id === currentCurriculumId; })[0];
        renderStep6List(subj);
    }

    function selectSubject(curriculumId, subjectName) {
        currentCurriculumId = curriculumId;
        currentSubjectName = subjectName || '';
        showForm(true);
        if (subjectTitleSpan) subjectTitleSpan.textContent = currentSubjectName;

        var courseNameCell = el('syllabusCourseNameCell');
        if (courseNameCell) courseNameCell.textContent = sessionData ? (sessionData.course_name || '-') : '-';

        var totalHours = sessionData && sessionData.total_hours != null ? String(sessionData.total_hours) : '';
        if (el('syllabusTrainingHours')) el('syllabusTrainingHours').value = totalHours;
        if (el('syllabusInstructors')) el('syllabusInstructors').value = sessionData && sessionData.instructor_name ? String(sessionData.instructor_name) : '';
        if (el('syllabusTeachingMethod')) el('syllabusTeachingMethod').value = '혼합형';

        loadNcsObjectives();

        var subj = subjects.filter(function(s) { return s.id === currentCurriculumId; })[0];
        renderStep6List(subj);
        el('syllabusStep6Edit').classList.add('hidden');
        el('syllabusStep6List').classList.remove('hidden');

        var linkNcs = el('syllabusStep6LinkNcs');
        var btnToggle = el('syllabusStep6BtnToggleEdit');
        if (linkNcs && registrationId) {
            linkNcs.href = '/admin/ncs/approved/6?id=' + encodeURIComponent(registrationId);
            linkNcs.classList.remove('hidden');
        } else if (linkNcs) {
            linkNcs.href = '#';
            linkNcs.classList.add('hidden');
        }
        if (btnToggle) btnToggle.style.display = registrationId ? '' : 'none';

        if (registrationId && subj) loadStep6Master(function() { renderStep6List(subj); });
        if (!registrationId && subj) renderStep6List(subj);
    }

    function loadNcsObjectives() {
        if (!currentCurriculumId) return;
        var objArea = el('syllabusLearningObjectives');
        var critArea = el('syllabusEvaluationCriteria');
        if (objArea) objArea.value = 'NCS에서 불러오는 중...';
        if (critArea) critArea.value = '';
        fetch('/api/ncs/approved/syllabus/objectives?curriculum_id=' + encodeURIComponent(currentCurriculumId), { headers: headers })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success && res.data) {
                    if (objArea) objArea.value = res.data.learning_objectives || '';
                    if (critArea) critArea.value = res.data.evaluation_criteria || '';
                } else {
                    if (objArea) objArea.value = '';
                    if (critArea) critArea.value = '';
                }
            })
            .catch(function() {
                if (objArea) objArea.value = '';
                if (critArea) critArea.value = '';
            });
    }

    function onLoadNcsClick() {
        if (!currentCurriculumId) return;
        loadNcsObjectives();
    }

    function onSaveDocClick() {
        alert('문서 저장 API 연동은 추후 구현 예정입니다. 현재는 학습목표·평가기준을 NCS에서 불러와 편집할 수 있습니다.');
    }

    if (el('syllabusLoadNcs')) el('syllabusLoadNcs').addEventListener('click', onLoadNcsClick);
    if (el('syllabusSaveDoc')) el('syllabusSaveDoc').addEventListener('click', onSaveDocClick);

    if (el('syllabusStep6BtnToggleEdit')) el('syllabusStep6BtnToggleEdit').addEventListener('click', openStep6Edit);
    if (el('syllabusStep6BtnSave')) el('syllabusStep6BtnSave').addEventListener('click', saveStep6);
    if (el('syllabusStep6BtnCancel')) el('syllabusStep6BtnCancel').addEventListener('click', cancelStep6Edit);

    loadSubjects();
})();
