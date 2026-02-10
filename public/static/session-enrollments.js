(function () {
    var currentSessionId = null;
    var enrolledList = [];
    var candidateList = [];
    var coursesData = [];

    function token() {
        return localStorage.getItem('token') || '';
    }

    function headers() {
        var h = { 'Content-Type': 'application/json' };
        if (token()) h['Authorization'] = 'Bearer ' + token();
        return h;
    }

    function loadSessions() {
        var select = document.getElementById('enrollSessionSelect');
        if (!select) return Promise.resolve();
        return fetch('/api/course-sessions?limit=500', { headers: headers() })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) return;
                var list = json.data;
                coursesData = list;
                select.innerHTML = '<option value="">회차를 선택하세요</option>' + list.map(function (s) {
                    var label = (s.course_name || s.course_title || '과정') + ' - ' + (s.session_number || '') + '차';
                    if (s.session_name) label += ' ' + s.session_name;
                    return '<option value="' + s.id + '">' + (label || s.id).replace(/</g, '&lt;') + '</option>';
                }).join('');
            })
            .catch(function (e) { console.error(e); });
    }

    function loadEnrolled() {
        if (!currentSessionId) return;
        fetch('/api/course-sessions/' + currentSessionId + '/enrollments', { headers: headers() })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) return;
                enrolledList = json.data || [];
                var tbody = document.getElementById('enrolledListBody');
                var countEl = document.getElementById('enrolledCount');
                if (countEl) countEl.textContent = enrolledList.length + '명';
                if (!tbody) return;
                if (enrolledList.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-400 text-xs">등록된 수강생이 없습니다.</td></tr>';
                    loadCandidates();
                    return;
                }
                tbody.innerHTML = enrolledList.map(function (e) {
                    var name = (e.name || '').replace(/</g, '&lt;');
                    var phone = (e.phone || '').replace(/</g, '&lt;');
                    return '<tr class="hover:bg-slate-50 group">' +
                        '<td class="p-2 text-slate-700 font-medium cursor-pointer hover:text-blue-600 transition" onclick="window.location.href=\'/admin/students/' + e.user_id + '/journey\'" title="여정 관리로 이동">' +
                        name + ' <i class="fas fa-external-link-alt text-[10px] ml-1 opacity-0 group-hover:opacity-100 transition"></i></td>' +
                        '<td class="p-2 text-slate-600">' + phone + '</td>' +
                        '<td class="p-2 text-center">' +
                        '<button type="button" class="text-red-500 hover:text-red-700 text-xs font-bold enroll-remove" data-user-id="' + e.user_id + '">삭제</button>' +
                        '</td></tr>';
                }).join('');
                tbody.querySelectorAll('.enroll-remove').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var uid = btn.getAttribute('data-user-id');
                        if (!uid || !confirm('이 수강생을 등록에서 제거할까요?')) return;
                        fetch('/api/course-sessions/' + currentSessionId + '/enrollments/' + uid, {
                            method: 'DELETE',
                            headers: headers()
                        }).then(function (r) { return r.json(); }).then(function (res) {
                            if (res.success) {
                                loadEnrolled();
                                // loadEnrolled calls loadCandidates, so no explicit call needed here if we rely on loadEnrolled structure, 
                                // but loadEnrolled structure is being changed to call loadCandidates at the end.
                                // However, in the delete handler, we call loadEnrolled(), which will refresh enrolled list AND then candidate list.
                            } else {
                                alert(res.error || '삭제 실패');
                            }
                        }).catch(function () { alert('오류가 발생했습니다.'); });
                    });
                });
                loadCandidates();
            })
            .catch(function (e) { console.error(e); });
    }

    function loadCandidates() {
        if (!currentSessionId) return;
        fetch('/api/hrd/students', { headers: headers() }) // This API exists mostly for HRD student list.
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    candidateList = [];
                    renderCandidates();
                    return;
                }
                var enrolledIds = {};
                enrolledList.forEach(function (e) { enrolledIds[e.user_id] = true; });

                // Filter out already enrolled students
                candidateList = (json.data || []).filter(function (s) { return !enrolledIds[s.id]; });
                renderCandidates();
            })
            .catch(function (e) { console.error(e); candidateList = []; renderCandidates(); });
    }

    function renderCandidates() {
        var tbody = document.getElementById('candidateListBody');
        var search = (document.getElementById('enrollStudentSearch') && document.getElementById('enrollStudentSearch').value) || '';
        search = search.trim().toLowerCase();
        var filtered = candidateList;
        if (search) {
            filtered = candidateList.filter(function (s) {
                return (s.name && s.name.toLowerCase().indexOf(search) >= 0) ||
                    (s.phone && s.phone.indexOf(search) >= 0);
            });
        }
        if (!tbody) return;
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-400 text-xs">' +
                (candidateList.length === 0 ? '이미 모두 등록되었거나 훈련생이 없습니다.' : '검색 결과가 없습니다.') + '</td></tr>';
            return;
        }
        tbody.innerHTML = filtered.map(function (s) {
            var name = (s.name || '').replace(/</g, '&lt;');
            var phone = (s.phone || '').replace(/</g, '&lt;');
            return '<tr class="hover:bg-slate-50">' +
                '<td class="p-2 text-center"><input type="checkbox" class="enroll-cb" value="' + s.id + '"></td>' +
                '<td class="p-2 text-slate-700">' + name + '</td>' +
                '<td class="p-2 text-slate-600">' + phone + '</td></tr>';
        }).join('');
    }

    function applySession() {
        var select = document.getElementById('enrollSessionSelect');
        if (!select || !select.value) {
            document.getElementById('enrollContent').classList.add('hidden');
            document.getElementById('enrollEmptyState').classList.remove('hidden');
            var info = document.getElementById('enrollSessionInfo');
            if (info) info.classList.add('hidden');
            return;
        }
        currentSessionId = parseInt(select.value, 10);
        document.getElementById('enrollEmptyState').classList.add('hidden');
        document.getElementById('enrollContent').classList.remove('hidden');

        var summary = document.getElementById('enrollSessionSummary');
        if (summary) summary.classList.add('hidden'); // Hide simple summary since we use detailed info

        var info = document.getElementById('enrollSessionInfo');
        if (info) {
            var session = coursesData.find(function (s) { return s.id === currentSessionId; });
            if (session) {
                info.classList.remove('hidden');

                var cName = (session.course_name || session.course_title || '과정명 없음');
                var cNameEl = document.getElementById('enrollCourseName');
                if (cNameEl) cNameEl.textContent = cName;

                var detailEl = document.getElementById('enrollSessionDetail');
                if (detailEl) {
                    var parts = [];
                    if (session.session_number != null) parts.push('<span class="font-bold">' + session.session_number + '차</span>');
                    if (session.session_name) parts.push('<span>' + (session.session_name).replace(/</g, '&lt;') + '</span>');

                    var start = (session.training_start_date || '').substring(0, 10);
                    var end = (session.training_end_date || '').substring(0, 10);
                    if (start && end) {
                        parts.push('<span class="text-emerald-600"><i class="far fa-calendar-alt mr-1"></i>' + start + ' ~ ' + end + '</span>');
                    }
                    if (session.instructor_names) {
                        parts.push('<span class="text-slate-500"><i class="fas fa-chalkboard-teacher mr-1"></i>' + (session.instructor_names).replace(/</g, '&lt;') + '</span>');
                    }

                    detailEl.innerHTML = parts.join('<span class="text-emerald-300 mx-2">|</span>');
                }
            } else {
                info.classList.add('hidden');
            }
        }

        loadEnrolled();
    }

    function getSessionIdFromUrl() {
        if (typeof window.ENROLL_SESSION_ID !== 'undefined' && window.ENROLL_SESSION_ID !== null) {
            return parseInt(window.ENROLL_SESSION_ID, 10);
        }
        var m = /[?&]sessionId=(\d+)/.exec(window.location.search || '');
        return m ? parseInt(m[1], 10) : null;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var presetSessionId = getSessionIdFromUrl();

        loadSessions().then(function () {
            if (presetSessionId) {
                var select = document.getElementById('enrollSessionSelect');
                if (select && presetSessionId) {
                    select.value = String(presetSessionId);
                    applySession();
                }
            }
        });

        var loadBtn = document.getElementById('enrollLoadSession');
        if (loadBtn) loadBtn.addEventListener('click', applySession);

        var select = document.getElementById('enrollSessionSelect');
        if (select) select.addEventListener('change', function () {
            if (select.value) applySession();
            else {
                document.getElementById('enrollContent').classList.add('hidden');
                document.getElementById('enrollEmptyState').classList.remove('hidden');
            }
        });

        var selectAll = document.getElementById('enrollSelectAll');
        if (selectAll) {
            selectAll.addEventListener('change', function () {
                document.querySelectorAll('#candidateListBody .enroll-cb').forEach(function (cb) {
                    cb.checked = selectAll.checked;
                });
            });
        }

        var addBtn = document.getElementById('enrollAddSelected');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                if (!currentSessionId) {
                    alert('회차를 먼저 선택하세요.');
                    return;
                }
                var checked = [];
                document.querySelectorAll('#candidateListBody .enroll-cb:checked').forEach(function (cb) {
                    checked.push(parseInt(cb.value, 10));
                });
                if (checked.length === 0) {
                    alert('등록할 훈련생을 선택하세요.');
                    return;
                }
                addBtn.disabled = true;
                fetch('/api/course-sessions/' + currentSessionId + '/enrollments', {
                    method: 'POST',
                    headers: headers(),
                    body: JSON.stringify({ user_ids: checked })
                }).then(function (r) { return r.json(); }).then(function (res) {
                    addBtn.disabled = false;
                    if (res.success) {
                        loadEnrolled();
                        loadCandidates();
                        if (res.added !== undefined) alert(res.added + '명 등록되었습니다.');
                    } else {
                        alert(res.error || '등록 실패');
                    }
                }).catch(function () {
                    addBtn.disabled = false;
                    alert('오류가 발생했습니다.');
                });
            });
        }

        var searchInput = document.getElementById('enrollStudentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function () { renderCandidates(); });
            searchInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') renderCandidates(); });
        }
    });
})();
