(function() {
    var sessionId = typeof window.SYLLABUS_SESSION_ID !== 'undefined' ? String(window.SYLLABUS_SESSION_ID) : '';
    if (!sessionId) return;

    var token = localStorage.getItem('token');
    var headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
    var sessionData = null;
    var subjects = [];
    var currentCurriculumId = null;
    var currentSubjectName = '';

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
        fetch('/api/ncs/approved/syllabus/session/' + encodeURIComponent(sessionId), { headers: headers })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (!res.success || !res.data) {
                    tabsContainer.innerHTML = '<span class="text-red-500 text-sm">교과목 목록을 불러올 수 없습니다.</span>';
                    if (courseNameEl) courseNameEl.innerHTML = '과정명 : <span class="text-slate-400">-</span>';
                    return;
                }
                sessionData = res.data.session || {};
                subjects = res.data.subjects || [];
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

    loadSubjects();
})();
