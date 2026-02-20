(function () {
    // 서버에서 주입한 ID 우선, 없으면 URL 경로에서 추출 (예: /admin/students/23/journey)
    var studentId = window.JOURNEY_STUDENT_ID;
    if (!studentId && typeof window !== 'undefined' && window.location && window.location.pathname) {
        var m = window.location.pathname.match(/\/admin\/students\/(\d+)\/journey/);
        if (m) studentId = m[1];
    }
    var coursesData = [];

    function redirectToLogin() {
        var redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/login?redirect=' + redirect;
    }
    function handleAuthResponse(r) {
        if (r.status === 401) {
            alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해 주세요.');
            redirectToLogin();
            return Promise.reject(new Error('UNAUTHORIZED'));
        }
        return r.json();
    }

    function translateStatus(s) {
        var m = { consulting: '상담중', registered: '등록완료', learning: '수강중', completed: '수료완료', dropout: '중도탈락' };
        return m[s] || s;
    }
    function translateType(t) {
        var m = { jobseeker: '구직자', worker: '재직자', general: '일반', student: '학생' };
        return m[t] || t;
    }

    function updateStepper(activeStage) {
        var stages = ['consulting', 'registered', 'learning', 'completed', 'employed'];
        var currentIdx = stages.indexOf(activeStage);
        if (currentIdx === -1) currentIdx = 0;
        var progress = (currentIdx / (stages.length - 1)) * 100;
        var progressBarr = document.getElementById('stepperProgress');
        if (progressBarr) progressBarr.style.width = progress + '%';
        document.querySelectorAll('.step-icon').forEach(function (icon) {
            var stage = icon.getAttribute('data-stage');
            var idx = stages.indexOf(stage);
            icon.className = 'w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon';
            var label = document.querySelector('.step-label[data-stage="' + stage + '"]');
            if (!label) return;
            label.className = 'text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label';
            if (idx < currentIdx) {
                icon.classList.add('border-emerald-500', 'text-emerald-500');
                label.classList.add('text-emerald-600');
            } else if (idx === currentIdx) {
                icon.classList.add('border-blue-500', 'text-blue-500', 'scale-125', 'shadow-lg', 'shadow-blue-500/20');
                label.classList.add('text-blue-600');
            } else {
                icon.classList.add('border-gray-100', 'text-gray-300');
            }
        });
    }

    window.switchTab = function (tab) {
        var tabs = ['timeline', 'details', 'courses', 'assignment'];
        tabs.forEach(function (t) {
            var btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
            var content = document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1));
            if (btn) btn.className = (t === tab) ? 'pb-4 text-sm font-black uppercase tab-active transition-all' : 'pb-4 text-sm font-black uppercase tab-inactive transition-all';
            if (content) content.classList.toggle('hidden', t !== tab);
        });

        if (tab === 'courses') {
            loadEnrolledSessions(studentId);
        } else if (tab === 'assignment') {
            loadAvailableSessions(studentId);
        }
    };

    window.updateStage = function (newStage) {
        if (!studentId) return;
        var stdStatus = document.getElementById('stdStatus');
        if (stdStatus) stdStatus.value = newStage;
        updateStepper(newStage);
    };

    function loadEnrolledSessions(sid) {
        var list = document.getElementById('enrolledCoursesList');
        if (!list) return;
        var token = localStorage.getItem('token');
        if (!token) { redirectToLogin(); return; }
        fetch('/api/hrd/students/' + sid + '/enrollments', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (!result.success) {
                    list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">수강 이력을 불러오지 못했습니다. (' + (result.error || '오류') + ')</div>';
                    return;
                }
                var data = result.data || [];
                if (data.length === 0) {
                    list.innerHTML = '<div class="text-start bg-gray-50 rounded-2xl p-8 text-gray-400 font-medium text-xs">등록된 수강 이력이 없습니다.</div>';
                    return;
                }
                list.innerHTML = data.map(function (item) {
                    var startDate = (item.training_start_date || '').split('T')[0];
                    var endDate = (item.training_end_date || '').split('T')[0];
                    var statusMap = { 'enrolled': '등록됨', 'completed': '수료', 'dropout': '중도탈락', 'cancelled': '취소됨' };
                    var sessionStatusMap = { 'recruiting': '모집중', 'in_progress': '진행중', 'completed': '종료' };

                    return '<div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">' +
                        '<div class="flex justify-between items-start gap-4 mb-4">' +
                        '<div class="min-w-0 flex-1">' +
                        '<span class="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg mb-2">' + (sessionStatusMap[item.session_status] || item.session_status) + '</span>' +
                        '<h5 class="font-bold text-gray-900 text-sm break-words whitespace-normal">' + (item.course_name || '과정명 없음').replace(/</g, '&lt;') + '</h5>' +
                        '<p class="text-xs text-gray-500 mt-1 break-words whitespace-normal">' + (item.session_name || (item.session_number + '차')).replace(/</g, '&lt;') + '</p>' +
                        '</div>' +
                        '<div class="text-right shrink-0">' +
                        '<span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">' + (statusMap[item.enrollment_status] || item.enrollment_status) + '</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="grid grid-cols-2 gap-4 text-xs">' +
                        '<div><span class="block text-gray-400 font-bold mb-1">교육 기간</span>' + startDate + ' ~ ' + endDate + '</div>' +
                        '<div><span class="block text-gray-400 font-bold mb-1">등록일</span>' + (item.enrolled_at || '').split('T')[0] + '</div>' +
                        '</div>' +
                        '<div class="mt-4 pt-4 border-t border-gray-50 flex gap-2 justify-end">' +
                        '<button onclick="window.location.href=\'/admin/courses/sessions/enrollments?sessionId=' + item.session_id + '\'" class="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition">수강자 관리 이동</button>' +
                        '</div>' +
                        '</div>';
                }).join('');
            })
            .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">오류가 발생했습니다.</div>'; });
    }

    function loadAvailableSessions(sid) {
        var list = document.getElementById('availableSessionsList');
        if (!list) return;
        var token = localStorage.getItem('token');
        if (!token) { redirectToLogin(); return; }
        list.innerHTML = '<div class="text-center text-gray-300 py-12 text-sm">로딩 중...</div>';

        fetch('/api/course-sessions/public?limit=50&status=recruiting', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (!result.success) {
                    list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">데이터를 불러오지 못했습니다.</div>';
                    return;
                }
                var data = result.data || [];
                if (data.length === 0) {
                    list.innerHTML = '<div class="text-start bg-gray-50 rounded-2xl p-8 text-gray-400 font-medium text-xs">현재 모집 중인 과정이 없습니다.</div>';
                    return;
                }
                list.innerHTML = data.map(function (item) {
                    var startDate = (item.training_start_date || '').split('T')[0];
                    var endDate = (item.training_end_date || '').split('T')[0];
                    return '<div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex justify-between items-center">' +
                        '<div class="min-w-0 flex-1">' +
                        '<h5 class="font-bold text-gray-900 text-sm">' + (item.course_name || '과정명 없음').replace(/</g, '&lt;') + '</h5>' +
                        '<p class="text-xs text-gray-500 mt-1">' + (item.session_name || (item.session_number + '차')).replace(/</g, '&lt;') + ' | ' + startDate + ' ~ ' + endDate + '</p>' +
                        '</div>' +
                        '<button onclick="window.assignSession(' + item.id + ')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shrink-0 ml-4">배정하기</button>' +
                        '</div>';
                }).join('');
            })
            .catch(function (e) {
                if (e && e.message === 'UNAUTHORIZED') return;
                list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">오류가 발생했습니다.</div>';
            });
    }

    window.assignSession = function (sessionId) {
        if (!confirm('훈련생을 이 과정에 배정하시겠습니까?')) return;
        var sid = document.getElementById('studentId').value;
        if (!sid) return;
        var token = localStorage.getItem('token');
        if (!token) { alert('로그인이 필요합니다.'); redirectToLogin(); return; }

        fetch('/api/course-sessions/' + sessionId + '/enrollments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ user_ids: [sid] })
        })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (result.success) {
                    alert('배정이 완료되었습니다.');
                    window.switchTab('courses');
                } else {
                    alert(result.error || '배정 실패');
                }
            })
            .catch(function (e) {
                if (e && e.message === 'UNAUTHORIZED') return;
                alert('배정 중 오류가 발생했습니다.');
            });
    };

    function loadCourses() {
        var token = localStorage.getItem('token');
        if (!token) { redirectToLogin(); return Promise.reject(); }
        return fetch('/api/course-sessions/public?limit=1000', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (result.success && result.data) {
                    coursesData = result.data.map(function (item) {
                        return {
                            id: item.id,
                            title: (item.course_name || '과정명 없음') + (item.session_number ? ' (' + item.session_number + '회차)' : '')
                        };
                    });
                    var select = document.getElementById('stdCourseId');
                    if (select) {
                        select.innerHTML = '<option value="">과정 선택</option>' + coursesData.map(function (c) {
                            return '<option value="' + c.id + '">' + (c.title || '').replace(/</g, '&lt;') + '</option>';
                        }).join('');
                    }
                }
            })
            .catch(function (e) { console.error(e); });
    }

    function loadStudentIntoPage() {
        if (!studentId) {
            alert('훈련생 ID가 없습니다.');
            window.location.href = '/admin/students';
            return;
        }
        var token = localStorage.getItem('token');
        if (!token) { redirectToLogin(); return; }
        fetch('/api/hrd/students/' + studentId, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(handleAuthResponse)
            .then(function (json) {
                if (!json) return;
                if (!json.success || !json.data) {
                    alert('훈련생을 불러올 수 없습니다.');
                    window.location.href = '/admin/students';
                    return;
                }
                var student = json.data;
                var courseTitle = coursesData.find(function (c) { return c.id == student.course_id; });
                courseTitle = courseTitle ? courseTitle.title : null;
                var displayCourse = (student.current_course_name || courseTitle) || '과정 미지정';

                document.getElementById('modalStdName').textContent = (student.name || '') + ' 훈련생';
                document.getElementById('modalStdIdDisplay').textContent = 'STUDENT ID: #' + student.id;
                document.getElementById('sidebarStdName').textContent = student.name || '-';
                document.getElementById('sidebarStdCourse').textContent = displayCourse;
                document.getElementById('studentId').value = student.id;
                document.getElementById('stdName').value = student.name || '';
                document.getElementById('stdBirthdate').value = student.birthdate || '';
                document.getElementById('stdPhone').value = student.phone || '';
                document.getElementById('stdEmail').value = student.email || '';
                document.getElementById('stdCourseId').value = student.course_id || '';
                document.getElementById('stdType').value = student.type || 'jobseeker';
                document.getElementById('stdGender').value = student.gender || 'M';
                document.getElementById('stdStatus').value = student.status || 'consulting';
                document.getElementById('stdStatusMemo').value = student.status_memo || '';
                document.getElementById('modalStdImage').src = student.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name || '');
                document.getElementById('stdProfileImage').value = student.profile_image || '';

                document.getElementById('stdAddress').value = student.address || '';
                document.getElementById('stdEducation').value = student.education || '';
                document.getElementById('stdCertifications').value = student.certifications || '';
                document.getElementById('stdPackageType').value = student.package_type || '';
                document.getElementById('stdPaymentMethod').value = student.payment_method || '';
                document.getElementById('stdPaymentDate').value = student.payment_date || '';
                document.getElementById('stdSelfPay').value = student.self_pay_amount || '';
                document.getElementById('stdHasApplication').checked = !!student.has_application;
                document.getElementById('stdHasCard').checked = !!student.has_card;
                document.getElementById('stdIsRegistered').checked = !!student.is_hrd_net_registered;

                document.getElementById('sidebarStdStatus').textContent = translateStatus(student.status);
                document.getElementById('sidebarStdType').textContent = translateType(student.type);

                var attEl = document.getElementById('sidebarAttendanceRate');
                if (attEl) attEl.textContent = (student.attendance_rate != null) ? (student.attendance_rate + '%') : '-';
                var consultEl = document.getElementById('consultCount');
                if (consultEl) consultEl.textContent = (student.consultation_count != null) ? String(student.consultation_count) : '0';

                updateStepper(student.status);
                loadConsultations(studentId);
            })
            .catch(function (e) {
                if (e && e.message === 'UNAUTHORIZED') return;
                alert('훈련생을 불러오는 중 오류가 발생했습니다.');
                window.location.href = '/admin/students';
            });
    }

    function loadConsultations(sid) {
        var list = document.getElementById('consultationList');
        if (!list) return;
        var token = localStorage.getItem('token');
        if (!token) { redirectToLogin(); return; }
        fetch('/api/hrd/students/' + sid + '/consultations', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (!result.success) return;
                var logs = result.data || [];
                var countElem = document.getElementById('consultCount');
                if (countElem) countElem.textContent = logs.length;
                if (logs.length === 0) {
                    list.innerHTML = '<div class="text-center text-gray-300 py-20 text-sm font-medium">작성된 상담 내역이 없습니다.</div>';
                    return;
                }
                window._consultationLogs = logs;
                var catStyles = { academic: 'bg-blue-50 text-blue-600', attendance: 'bg-yellow-50 text-yellow-600', career: 'bg-emerald-50 text-emerald-600', complaint: 'bg-red-50 text-red-600', other: 'bg-gray-50 text-gray-500' };
                var catLabels = { academic: '학사지휘', attendance: '출결행정', career: '취업비전', complaint: '고충상담', other: '기타' };
                function formatConsultDateTime(log) {
                    var datePart = (log.consult_date && log.consult_date.split('T')[0]) || (log.created_at && (log.created_at.split('T')[0] || log.created_at.split(' ')[0])) || '';
                    var timePart = '';
                    if (log.created_at) {
                        var created = String(log.created_at);
                        var t = created.indexOf('T') !== -1 ? created.split('T')[1] : (created.indexOf(' ') !== -1 ? created.split(' ')[1] : null);
                        if (t) timePart = t.substring(0, 5);
                    }
                    if (timePart) return datePart + ' ' + timePart;
                    return datePart;
                }
                list.innerHTML = logs.map(function (log) {
                    var isPrincipal = log.counselor_role === 'admin';
                    var dateTimeStr = formatConsultDateTime(log);
                    return '<div class="relative pl-10 timeline-item">' +
                        '<div class="absolute inset-y-0 left-[21px] w-0.5 bg-gray-100 timeline-line"></div>' +
                        '<div class="absolute left-0 top-0 w-11 h-11 bg-white border-2 ' + (isPrincipal ? 'border-blue-500' : 'border-gray-100') + ' rounded-2xl flex items-center justify-center z-10 shadow-sm">' +
                        '<i class="fas ' + (isPrincipal ? 'fa-user-tie text-blue-500' : 'fa-chalkboard-teacher text-gray-400') + ' text-sm"></i></div>' +
                        '<div class="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all">' +
                        '<div class="flex justify-between items-center mb-4">' +
                        '<div class="flex items-center gap-2">' +
                        '<span class="text-xs font-black text-gray-900">' + (log.memo || '관리자') + '</span>' +
                        '<span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ' + (isPrincipal ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400') + '">' + (isPrincipal ? 'Principal' : 'Instructor') + '</span>' +
                        '<span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ' + (catStyles[log.category] || catStyles.other) + '">' + (catLabels[log.category] || '일반') + '</span>' +
                        '</div>' +
                        '<span class="text-[10px] font-bold text-gray-500" title="상담 일시">' + dateTimeStr + '</span>' +
                        '</div>' +
                        '<p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">' + (log.message || '').replace(/</g, '&lt;') + '</p>' +
                        '<div class="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">' +
                        '<button type="button" onclick="window.editConsultation(\'' + sid + '\',' + log.id + ')" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition"><i class="fas fa-pen text-[10px]"></i> 수정</button>' +
                        '<button type="button" onclick="window.deleteConsultation(\'' + sid + '\',' + log.id + ')" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition"><i class="fas fa-trash-alt text-[10px]"></i> 삭제</button>' +
                        '</div></div></div>';
                }).join('');
            })
            .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">상담 목록을 불러오지 못했습니다.</div>'; });
    }

    window.addConsultationLog = function () {
        var sid = document.getElementById('studentId').value;
        if (!sid) return;
        var content = document.getElementById('consultContent').value;
        if (!content) return;
        var token = localStorage.getItem('token');
        if (!token) { alert('로그인이 필요합니다.'); redirectToLogin(); return; }
        var category = document.getElementById('consultCategory').value;
        var method = document.getElementById('consultMethod').value;
        var date = document.getElementById('consultDate').value || new Date().toISOString().split('T')[0];
        fetch('/api/hrd/students/' + sid + '/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ content: content, date: date, category: category, method: method, course_id: document.getElementById('stdCourseId').value })
        })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (result.success) {
                    document.getElementById('consultContent').value = '';
                    loadConsultations(sid);
                } else {
                    alert(result.error || '상담 등록 실패');
                }
            })
            .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; alert('상담 등록 중 오류가 발생했습니다.'); });
    };

    window.deleteConsultation = function (sid, logId) {
        if (!confirm('이 상담을 삭제할까요?')) return;
        var token = localStorage.getItem('token');
        if (!token) { alert('로그인이 필요합니다.'); redirectToLogin(); return; }
        fetch('/api/hrd/counseling/' + logId, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (result.success) {
                    loadConsultations(sid);
                } else {
                    alert(result.error || result.message || '삭제 실패');
                }
            })
            .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; alert('삭제 중 오류가 발생했습니다.'); });
    };

    function loadCounselorsIntoSelect(callback) {
        var select = document.getElementById('consultEditCounselorId');
        if (!select) { if (callback) callback(); return; }
        if (window._counselorsList && window._counselorsList.length >= 0) {
            select.innerHTML = '<option value="">선택하세요</option>' + (window._counselorsList.map(function (c) { return '<option value="' + c.id + '" class="text-gray-900">' + (c.name || '이름 없음') + '</option>'; }).join(''));
            if (callback) callback();
            return;
        }
        var token = localStorage.getItem('token');
        if (!token) { if (callback) callback(); return; }
        fetch('/api/hrd/counselors', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(handleAuthResponse)
            .then(function (res) {
                if (!res || !res.success) return;
                window._counselorsList = res.data || [];
                select.innerHTML = '<option value="">선택하세요</option>' + (window._counselorsList.map(function (c) { return '<option value="' + c.id + '" class="text-gray-900">' + (c.name || '이름 없음') + '</option>'; }).join(''));
                if (callback) callback();
            })
            .catch(function () { if (callback) callback(); });
    }

    window.editConsultation = function (sid, logId) {
        var logs = window._consultationLogs;
        if (!logs) return;
        var log = logs.find(function (l) { return l.id == logId; });
        if (!log) return;
        var modal = document.getElementById('consultEditModal');
        var dateInput = document.getElementById('consultEditDate');
        var categorySelect = document.getElementById('consultEditCategory');
        var methodSelect = document.getElementById('consultEditMethod');
        var contentArea = document.getElementById('consultEditContent');
        var logIdInput = document.getElementById('consultEditLogId');
        var counselorSelect = document.getElementById('consultEditCounselorId');
        if (!modal || !dateInput) return;
        var dateStr = (log.consult_date && log.consult_date.split('T')[0]) || (log.created_at && (log.created_at.split('T')[0] || log.created_at.split(' ')[0])) || '';
        logIdInput.value = logId;
        dateInput.value = dateStr;
        categorySelect.value = log.category || 'academic';
        methodSelect.value = log.method || 'face_to_face';
        contentArea.value = log.message || '';
        loadCounselorsIntoSelect(function () {
            if (counselorSelect) counselorSelect.value = (log.counselor_id != null && log.counselor_id !== '') ? String(log.counselor_id) : '';
        });
        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');
        window._consultEditStudentId = sid;
    };

    window.closeConsultEditModal = function () {
        var modal = document.getElementById('consultEditModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
        }
        window._consultEditStudentId = null;
    };

    (function bindConsultEditSubmit() {
        var btn = document.getElementById('consultEditSubmitBtn');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var logId = document.getElementById('consultEditLogId') && document.getElementById('consultEditLogId').value;
            var sid = window._consultEditStudentId;
            if (!logId || !sid) return;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); redirectToLogin(); return; }
            var counselorEl = document.getElementById('consultEditCounselorId');
            var body = {
                student_id: sid,
                counselor_id: counselorEl && counselorEl.value ? counselorEl.value : null,
                course_id: document.getElementById('stdCourseId') && document.getElementById('stdCourseId').value || null,
                counseling_date: document.getElementById('consultEditDate') && document.getElementById('consultEditDate').value,
                category: document.getElementById('consultEditCategory') && document.getElementById('consultEditCategory').value,
                method: document.getElementById('consultEditMethod') && document.getElementById('consultEditMethod').value,
                content: document.getElementById('consultEditContent') && document.getElementById('consultEditContent').value,
                result: null,
                next_counseling_date: null,
                counseling_type: 'academic',
                consultation_id: null
            };
            fetch('/api/hrd/counseling/' + logId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(body)
            })
                .then(handleAuthResponse)
                .then(function (result) {
                    if (!result) return;
                    if (result.success) {
                        window.closeConsultEditModal();
                        loadConsultations(sid);
                    } else {
                        alert(result.error || result.message || '수정 실패');
                    }
                })
                .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; alert('수정 중 오류가 발생했습니다.'); });
        });
    })();

    window.handleSaveStudent = function (e) {
        e.preventDefault();
        var id = document.getElementById('studentId').value;
        var formData = {
            id: id,
            name: document.getElementById('stdName').value.trim(),
            birthdate: document.getElementById('stdBirthdate').value || null,
            phone: document.getElementById('stdPhone').value.trim(),
            email: document.getElementById('stdEmail').value.trim() || null,
            course_id: document.getElementById('stdCourseId').value || null,
            type: document.getElementById('stdType').value,
            gender: document.getElementById('stdGender').value,
            status: document.getElementById('stdStatus').value || 'consulting',
            status_memo: document.getElementById('stdStatusMemo').value.trim() || null,
            profile_image: document.getElementById('stdProfileImage').value,
            address: document.getElementById('stdAddress').value.trim() || null,
            education: document.getElementById('stdEducation').value.trim() || null,
            certifications: document.getElementById('stdCertifications').value.trim() || null,
            package_type: document.getElementById('stdPackageType').value || null,
            payment_method: document.getElementById('stdPaymentMethod').value.trim() || null,
            payment_date: document.getElementById('stdPaymentDate').value || null,
            self_pay_amount: parseInt(document.getElementById('stdSelfPay').value, 10) || 0,
            has_application: document.getElementById('stdHasApplication').checked,
            has_card: document.getElementById('stdHasCard').checked,
            is_hrd_net_registered: document.getElementById('stdIsRegistered').checked
        };
        var token = localStorage.getItem('token');
        if (!token) { alert('로그인이 필요합니다.'); redirectToLogin(); return; }
        fetch('/api/hrd/students', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(formData)
        })
            .then(handleAuthResponse)
            .then(function (result) {
                if (!result) return;
                if (result.success) {
                    alert('훈련생 정보가 업데이트 되었습니다.');
                    loadStudentIntoPage();
                } else {
                    alert('업데이트 실패: ' + (result.error || '알 수 없는 오류'));
                }
            })
            .catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; alert('업데이트 중 오류가 발생했습니다.'); });
    };

    window.handleStdImage = function (input) {
        if (!input.files || !input.files[0]) return;
        var file = input.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var width = img.width, height = img.height;
                if (width > height) { if (width > 400) { height *= 400 / width; width = 400; } }
                else { if (height > 400) { width *= 400 / height; height = 400; } }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                document.getElementById('stdProfileImage').value = dataUrl;
                document.getElementById('modalStdImage').src = dataUrl;
            };
        };
    };

    document.addEventListener('DOMContentLoaded', function () {
        if (!localStorage.getItem('token')) {
            redirectToLogin();
            return;
        }
        var consultDate = document.getElementById('consultDate');
        if (consultDate) {
            var today = new Date().toISOString().split('T')[0];
            consultDate.value = today;
        }
        loadCourses().then(function () { loadStudentIntoPage(); }).catch(function (e) { if (e && e.message === 'UNAUTHORIZED') return; });
    });
})();
