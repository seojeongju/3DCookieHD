(function () {
    // 서버에서 주입한 ID 우선, 없으면 URL 경로에서 추출 (예: /admin/students/23/journey)
    var studentId = window.JOURNEY_STUDENT_ID;
    if (!studentId && typeof window !== 'undefined' && window.location && window.location.pathname) {
        var m = window.location.pathname.match(/\/admin\/students\/(\d+)\/journey/);
        if (m) studentId = m[1];
    }
    var coursesData = [];

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
        var isTimeline = tab === 'timeline';
        var tabTimeline = document.getElementById('tabTimeline');
        var tabDetails = document.getElementById('tabDetails');
        var contentTimeline = document.getElementById('contentTimeline');
        var contentDetails = document.getElementById('contentDetails');
        if (tabTimeline) tabTimeline.className = isTimeline ? 'pb-4 text-sm font-black uppercase tab-active transition-all' : 'pb-4 text-sm font-black uppercase tab-inactive transition-all';
        if (tabDetails) tabDetails.className = isTimeline ? 'pb-4 text-sm font-black uppercase tab-inactive transition-all' : 'pb-4 text-sm font-black uppercase tab-active transition-all';
        if (contentTimeline) contentTimeline.classList.toggle('hidden', !isTimeline);
        if (contentDetails) contentDetails.classList.toggle('hidden', isTimeline);
    };

    window.updateStage = function (newStage) {
        if (!studentId) return;
        var stdStatus = document.getElementById('stdStatus');
        if (stdStatus) stdStatus.value = newStage;
        updateStepper(newStage);
    };

    function loadCourses() {
        return fetch('/api/courses?limit=1000', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
            .then(function (r) { return r.json(); })
            .then(function (result) {
                if (result.success && result.data) {
                    coursesData = result.data;
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
        fetch('/api/hrd/students/' + studentId, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success || !json.data) {
                    alert('훈련생을 불러올 수 없습니다.');
                    window.location.href = '/admin/students';
                    return;
                }
                var student = json.data;
                var courseTitle = coursesData.find(function (c) { return c.id == student.course_id; });
                courseTitle = courseTitle ? courseTitle.title : '과정 미지정';

                document.getElementById('modalStdName').textContent = (student.name || '') + ' 훈련생';
                document.getElementById('modalStdIdDisplay').textContent = 'STUDENT ID: #' + student.id;
                document.getElementById('sidebarStdName').textContent = student.name || '-';
                document.getElementById('sidebarStdCourse').textContent = courseTitle;
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

                updateStepper(student.status);
                loadConsultations(studentId);
            })
            .catch(function () {
                alert('훈련생을 불러오는 중 오류가 발생했습니다.');
                window.location.href = '/admin/students';
            });
    }

    function loadConsultations(sid) {
        var list = document.getElementById('consultationList');
        if (!list) return;
        var token = localStorage.getItem('token');
        fetch('/api/hrd/students/' + sid + '/consultations', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (r) { return r.json(); })
            .then(function (result) {
                if (!result.success) return;
                var logs = result.data || [];
                var countElem = document.getElementById('consultCount');
                if (countElem) countElem.textContent = logs.length;
                if (logs.length === 0) {
                    list.innerHTML = '<div class="text-center text-gray-300 py-20 text-sm font-medium">작성된 상담 내역이 없습니다.</div>';
                    return;
                }
                var catStyles = { academic: 'bg-blue-50 text-blue-600', attendance: 'bg-yellow-50 text-yellow-600', career: 'bg-emerald-50 text-emerald-600', complaint: 'bg-red-50 text-red-600', other: 'bg-gray-50 text-gray-500' };
                var catLabels = { academic: '학사지휘', attendance: '출결행정', career: '취업비전', complaint: '고충상담', other: '기타' };
                list.innerHTML = logs.map(function (log) {
                    var isPrincipal = log.counselor_role === 'admin';
                    var dateStr = (log.consult_date && log.consult_date.split('T')[0]) || (log.created_at && log.created_at.split(' ')[0]) || '';
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
                        '<span class="text-[10px] font-bold text-gray-300">' + dateStr + '</span>' +
                        '</div>' +
                        '<p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">' + (log.message || '').replace(/</g, '&lt;') + '</p>' +
                        '</div></div>';
                }).join('');
            })
            .catch(function () { list.innerHTML = '<div class="text-center text-red-400 py-8 text-sm">상담 목록을 불러오지 못했습니다.</div>'; });
    }

    window.addConsultationLog = function () {
        var sid = document.getElementById('studentId').value;
        if (!sid) return;
        var content = document.getElementById('consultContent').value;
        if (!content) return;
        var category = document.getElementById('consultCategory').value;
        var method = document.getElementById('consultMethod').value;
        var date = document.getElementById('consultDate').value || new Date().toISOString().split('T')[0];
        var token = localStorage.getItem('token');
        fetch('/api/hrd/students/' + sid + '/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ content: content, manager: '자동', date: date, category: category, method: method, course_id: document.getElementById('stdCourseId').value })
        })
            .then(function (r) { return r.json(); })
            .then(function (result) {
                if (result.success) {
                    document.getElementById('consultContent').value = '';
                    loadConsultations(sid);
                } else {
                    alert(result.error || '상담 등록 실패');
                }
            })
            .catch(function () { alert('상담 등록 중 오류가 발생했습니다.'); });
    };

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
        fetch('/api/hrd/students', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(formData)
        })
            .then(function (r) { return r.json(); })
            .then(function (result) {
                if (result.success) {
                    alert('훈련생 정보가 업데이트 되었습니다.');
                    loadStudentIntoPage();
                } else {
                    alert('업데이트 실패: ' + (result.error || '알 수 없는 오류'));
                }
            })
            .catch(function () { alert('업데이트 중 오류가 발생했습니다.'); });
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
        var consultDate = document.getElementById('consultDate');
        if (consultDate) {
            var today = new Date().toISOString().split('T')[0];
            consultDate.value = today;
        }
        loadCourses().then(function () { loadStudentIntoPage(); });
    });
})();
