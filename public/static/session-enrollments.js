(function () {
    var currentSessionId = null;
    var enrolledList = [];
    var droppedList = [];
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

    function sendPinEmail(userIds) {
        if (!currentSessionId) {
            alert('회차를 먼저 선택하세요.');
            return;
        }
        var body = {};
        if (userIds && userIds.length) body.user_ids = userIds;
        fetch('/api/course-sessions/' + currentSessionId + '/enrollments/send-pin', {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(body)
        }).then(function (r) { return r.json(); }).then(function (res) {
            if (res.success) alert((res.sent || 0) + '명에게 안내 메일을 보냈습니다.' + (res.failed ? (' (실패 ' + res.failed + '건)') : ''));
            else alert(res.error || '발송에 실패했습니다.');
        }).catch(function () { alert('발송 중 오류가 발생했습니다.'); });
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
                droppedList = json.dropped || [];
                renderDropped(droppedList, json.drop_reasons || {});
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
                        '<td class="p-2 text-center whitespace-nowrap">' +
                        '<button type="button" class="text-sky-600 hover:text-sky-800 text-xs font-bold enroll-send-pin mr-2" data-user-id="' + e.user_id + '">메일</button>' +
                        '<button type="button" class="text-rose-600 hover:text-rose-800 text-xs font-bold enroll-dropout mr-2" data-user-id="' + e.user_id + '" data-name="' + name.replace(/"/g, '&quot;') + '" title="수강 중 포기한 훈련생 — 기록 보존">중도탈락</button>' +
                        '<button type="button" class="text-slate-400 hover:text-slate-600 text-xs font-bold enroll-remove" data-user-id="' + e.user_id + '" title="잘못 등록한 경우만 — 출결 기록이 있으면 불가">등록 취소</button>' +
                        '</td></tr>';
                }).join('');
                tbody.querySelectorAll('.enroll-dropout').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        openDropoutModal(btn.getAttribute('data-user-id'), btn.getAttribute('data-name'));
                    });
                });
                tbody.querySelectorAll('.enroll-remove').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var uid = btn.getAttribute('data-user-id');
                        if (!uid || !confirm('잘못 등록한 수강생의 등록을 취소할까요?\n\n수강 중 포기한 경우에는 [중도탈락]을 사용하세요.')) return;
                        fetch('/api/course-sessions/' + currentSessionId + '/enrollments/' + uid, {
                            method: 'DELETE',
                            headers: headers()
                        }).then(function (r) { return r.json(); }).then(function (res) {
                            if (res.success) {
                                loadEnrolled();
                            } else if (res.code === 'HAS_ATTENDANCE') {
                                if (confirm(res.error + '\n\n지금 중도탈락으로 처리할까요?')) {
                                    var row = enrolledList.find(function (x) { return String(x.user_id) === String(uid); });
                                    openDropoutModal(uid, row ? row.name : '');
                                }
                            } else {
                                alert(res.error || '등록 취소 실패');
                            }
                        }).catch(function () { alert('오류가 발생했습니다.'); });
                    });
                });
                tbody.querySelectorAll('.enroll-send-pin').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var uid = btn.getAttribute('data-user-id');
                        if (!uid || !confirm('이 수강생에게 인증 코드 안내 메일을 보낼까요?')) return;
                        sendPinEmail([parseInt(uid, 10)]);
                    });
                });
                loadCandidates();
            })
            .catch(function (e) { console.error(e); });
    }

    function esc(v) {
        return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderDropped(list, reasons) {
        var tbody = document.getElementById('droppedListBody');
        var countEl = document.getElementById('droppedCount');
        if (countEl) countEl.textContent = list.length + '명';
        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-400 text-xs">중도탈락한 훈련생이 없습니다.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(function (d) {
            return '<tr class="hover:bg-rose-50/40">' +
                '<td class="p-2 text-slate-700 font-medium cursor-pointer hover:text-blue-600" onclick="window.location.href=\'/admin/students/' + d.user_id + '/journey\'">' + esc(d.name) + '</td>' +
                '<td class="p-2 text-slate-600 whitespace-nowrap">' + esc(d.dropped_at || '-') + '</td>' +
                '<td class="p-2"><span class="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold">' + esc(reasons[d.drop_reason] || d.drop_reason || '-') + '</span></td>' +
                '<td class="p-2 text-slate-500 text-xs">' + esc(d.drop_memo || '') + '</td>' +
                '<td class="p-2 text-center"><button type="button" class="text-emerald-600 hover:text-emerald-800 text-xs font-bold enroll-restore" data-user-id="' + d.user_id + '">수강 복귀</button></td>' +
                '</tr>';
        }).join('');
        tbody.querySelectorAll('.enroll-restore').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var uid = btn.getAttribute('data-user-id');
                if (!uid || !confirm('중도탈락을 취소하고 다시 수강 중으로 되돌릴까요?')) return;
                fetch('/api/course-sessions/' + currentSessionId + '/enrollments/' + uid + '/restore', {
                    method: 'POST',
                    headers: headers()
                }).then(function (r) { return r.json(); }).then(function (res) {
                    if (res.success) loadEnrolled();
                    else alert(res.error || '복귀 처리 실패');
                }).catch(function () { alert('오류가 발생했습니다.'); });
            });
        });
    }

    var dropoutUserId = null;

    function kstToday() {
        return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }

    function openDropoutModal(uid, name) {
        var modal = document.getElementById('dropoutModal');
        if (!modal || !uid) return;
        dropoutUserId = uid;
        document.getElementById('dropoutTarget').textContent = (name || '') + ' 훈련생을 이 회차에서 중도탈락 처리합니다.';
        document.getElementById('dropoutDate').value = kstToday();
        document.getElementById('dropoutReason').value = '';
        document.getElementById('dropoutMemo').value = '';
        modal.classList.remove('hidden');
    }

    function closeDropoutModal() {
        var modal = document.getElementById('dropoutModal');
        if (modal) modal.classList.add('hidden');
        dropoutUserId = null;
    }

    function submitDropout() {
        if (!dropoutUserId || !currentSessionId) return;
        var reason = document.getElementById('dropoutReason').value;
        if (!reason) {
            alert('중도탈락 사유를 선택하세요.');
            return;
        }
        var btn = document.getElementById('dropoutSubmit');
        btn.disabled = true;
        fetch('/api/course-sessions/' + currentSessionId + '/enrollments/' + dropoutUserId + '/dropout', {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({
                dropped_at: document.getElementById('dropoutDate').value,
                reason: reason,
                memo: document.getElementById('dropoutMemo').value
            })
        }).then(function (r) { return r.json(); }).then(function (res) {
            btn.disabled = false;
            if (res.success) {
                closeDropoutModal();
                loadEnrolled();
            } else {
                alert(res.error || '중도탈락 처리 실패');
            }
        }).catch(function () {
            btn.disabled = false;
            alert('오류가 발생했습니다.');
        });
    }

    // 이 회차 수강 중·중도탈락자를 뺀 전체 수강생 회원 (중도탈락자는 [수강 복귀]로 되돌림)
    function loadCandidates() {
        if (!currentSessionId) return;
        fetch('/api/course-sessions/' + currentSessionId + '/enrollment-candidates', { headers: headers() })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                candidateList = (json && json.success && json.data) ? json.data : [];
                renderCandidates();
            })
            .catch(function (e) { console.error(e); candidateList = []; renderCandidates(); });
    }

    var JOURNEY_LABELS = {
        consulting: ['상담', 'bg-slate-100 text-slate-500'],
        registered: ['등록·발급', 'bg-sky-50 text-sky-600'],
        learning: ['집중 훈련', 'bg-emerald-50 text-emerald-600'],
        completed: ['수료', 'bg-indigo-50 text-indigo-600'],
        employed: ['취업', 'bg-amber-50 text-amber-600'],
        dropout: ['중도탈락', 'bg-rose-50 text-rose-600']
    };

    function candidateStatusHtml(s) {
        var parts = [];
        var j = JOURNEY_LABELS[s.journey_status];
        if (j) parts.push('<span class="px-1.5 py-0.5 rounded-md text-[11px] font-bold ' + j[1] + '">' + j[0] + '</span>');
        if (s.account_status === 'pending') parts.push('<span class="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-600">승인 대기</span>');
        if (s.current_course) parts.push('<span class="text-[11px] text-slate-400" title="현재 수강 중인 회차">' + esc(s.current_course) + '</span>');
        return parts.join(' ') || '<span class="text-[11px] text-slate-300">-</span>';
    }

    function renderCandidates() {
        var tbody = document.getElementById('candidateListBody');
        var search = (document.getElementById('enrollStudentSearch') && document.getElementById('enrollStudentSearch').value) || '';
        search = search.trim().toLowerCase();
        var filtered = candidateList;
        if (search) {
            var digits = search.replace(/\D/g, '');
            filtered = candidateList.filter(function (s) {
                return (s.name && s.name.toLowerCase().indexOf(search) >= 0) ||
                    (s.email && s.email.toLowerCase().indexOf(search) >= 0) ||
                    (digits && s.phone && s.phone.replace(/\D/g, '').indexOf(digits) >= 0);
            });
        }
        var countEl = document.getElementById('candidateCount');
        if (countEl) countEl.textContent = search ? (filtered.length + ' / ' + candidateList.length + '명') : ('전체 ' + candidateList.length + '명');
        var selectAll = document.getElementById('enrollSelectAll');
        if (selectAll) selectAll.checked = false;
        if (!tbody) return;
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400 text-xs">' +
                (candidateList.length === 0 ? '등록할 수 있는 수강생 회원이 없습니다.' : '검색 결과가 없습니다.') + '</td></tr>';
            return;
        }
        tbody.innerHTML = filtered.map(function (s) {
            return '<tr class="hover:bg-slate-50 cursor-pointer" onclick="if(event.target.type!==\'checkbox\'){var cb=this.querySelector(\'.enroll-cb\');cb.checked=!cb.checked;}">' +
                '<td class="p-2 text-center"><input type="checkbox" class="enroll-cb" value="' + s.id + '"></td>' +
                '<td class="p-2 text-slate-700 font-medium">' + esc(s.name) +
                (s.email ? '<div class="text-[11px] text-slate-400 font-normal">' + esc(s.email) + '</div>' : '') + '</td>' +
                '<td class="p-2 text-slate-600 whitespace-nowrap">' + esc(s.phone || '-') + '</td>' +
                '<td class="p-2">' + candidateStatusHtml(s) + '</td></tr>';
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

        var sendAll = document.getElementById('enrollSendPin');
        if (sendAll) {
            sendAll.addEventListener('click', function () {
                if (!currentSessionId) {
                    alert('회차를 먼저 선택하세요.');
                    return;
                }
                if (!enrolledList.length) {
                    alert('등록된 수강생이 없습니다.');
                    return;
                }
                if (!confirm('등록된 수강생 전원에게 인증 코드 안내 메일을 보낼까요?')) return;
                sendPinEmail([]);
            });
        }

        var dropCancel = document.getElementById('dropoutCancel');
        if (dropCancel) dropCancel.addEventListener('click', closeDropoutModal);
        var dropSubmit = document.getElementById('dropoutSubmit');
        if (dropSubmit) dropSubmit.addEventListener('click', submitDropout);

        var searchInput = document.getElementById('enrollStudentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function () { renderCandidates(); });
            searchInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') renderCandidates(); });
        }
    });
})();
