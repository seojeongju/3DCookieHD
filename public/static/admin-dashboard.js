/* Admin dashboard - loaded by /admin page only */
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}
function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}
function updateHeaderClock() {
    var el = document.getElementById('header-clock');
    if (el) {
        var now = new Date();
        el.textContent = now.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}
function updateWelcomeDate() {
    var el = document.getElementById('welcome-date');
    if (el) el.textContent = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadActiveSessions() {
    var grid = document.getElementById('active-sessions-grid');
    if (!grid) return;
    try {
        var token = localStorage.getItem('token');
        var response = await fetch('/api/course-sessions?status=in_progress&limit=6', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.status === 401) {
            location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
            return;
        }
        var result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
            var html = result.data.map(function(session) {
                var range = session.training_start_date && session.training_end_date
                    ? (session.training_start_date.substring(5, 10) + ' ~ ' + session.training_end_date.substring(5, 10))
                    : '일정 미정';
                var sid = session.id;
                var name = esc(session.course_name);
                var num = session.session_number || 1;
                var instructor = esc(session.instructor_name || '강사 미배정');
                return '<div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all group animate-fade-in">' +
                    '<div class="px-6 py-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">' +
                    '<div class="flex items-center justify-between mb-2">' +
                    '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase tracking-wider">진행중</span>' +
                    '<span class="text-[10px] font-bold text-slate-400"><i class="far fa-calendar-alt mr-1"></i> ' + esc(range) + '</span></div>' +
                    '<h4 class="font-black text-slate-800 text-sm mb-1 truncate" title="' + name + '">' + name + '</h4>' +
                    '<div class="flex items-center gap-2">' +
                    '<span class="text-xs font-bold text-slate-500">' + num + '회차</span>' +
                    '<span class="w-1 h-1 rounded-full bg-slate-300"></span>' +
                    '<span class="text-xs font-medium text-slate-400">' + instructor + '</span></div></div>' +
                    '<div class="p-4 grid grid-cols-2 gap-2 bg-white">' +
                    '<a href="/admin/courses/' + sid + '/lms/attendance" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition"><i class="fas fa-user-check text-[10px]"></i> 출석</a>' +
                    '<a href="/admin/courses/' + sid + '/lms/counseling" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition"><i class="fas fa-comments text-[10px]"></i> 상담</a>' +
                    '<a href="/admin/courses/' + sid + '/lms/assignments" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition"><i class="fas fa-tasks text-[10px]"></i> 과제</a>' +
                    '<a href="/admin/courses/sessions/' + sid + '/timetable" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition"><i class="far fa-calendar-alt text-[10px]"></i> 시간표</a>' +
                    '</div>' +
                    '<div class="px-4 pb-4">' +
                    '<a href="/admin/courses/' + sid + '/lms" class="w-full h-10 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-primary-700 transition shadow-sm">LMS 상세 관리 <i class="fas fa-arrow-right text-[10px]"></i></a>' +
                    '</div></div>';
            }).join('');
            grid.innerHTML = html;
        } else {
            grid.innerHTML = '<div class="col-span-full py-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">' +
                '<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><i class="fas fa-chalkboard text-2xl"></i></div>' +
                '<h4 class="text-slate-800 font-bold">진행 중인 과정이 없습니다.</h4>' +
                '<p class="text-xs text-slate-400 mt-1">회차별 과정 개설 관리에서 새로운 과정을 시작해보세요.</p>' +
                '<a href="/admin/courses/sessions" class="inline-flex items-center gap-2 mt-4 text-primary-600 text-xs font-bold hover:underline">회차 관리로 이동 <i class="fas fa-chevron-right text-[10px]"></i></a>' +
                '</div>';
        }
    } catch (e) {
        console.error('Failed to load active sessions:', e);
        grid.innerHTML = '<div class="col-span-full p-8 text-center text-red-400">데이터 로드 실패</div>';
    }
}

async function loadWebsiteStats() {
    try {
        var token = localStorage.getItem('token');
        var response = await fetch('/api/dashboard/website-stats', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.status === 401) {
            location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
            return;
        }
        var result = await response.json();
        if (result.success) {
            var data = result.data;
            document.getElementById('stat-today-pv').textContent = data.todayPV.toLocaleString();
            document.getElementById('stat-today-uv').textContent = data.todayUV.toLocaleString();
            var trendCtx = document.getElementById('websiteTrendChart').getContext('2d');
            new Chart(trendCtx, {
                type: 'bar',
                data: {
                    labels: data.weeklyTrend.map(function(t) { return t.date.substring(5); }),
                    datasets: [{
                        label: '페이지뷰(PV)',
                        data: data.weeklyTrend.map(function(t) { return t.count; }),
                        backgroundColor: 'rgba(79, 70, 229, 0.6)',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
            var topPagesList = document.getElementById('top-pages-list');
            if (data.topPages && data.topPages.length > 0) {
                topPagesList.innerHTML = data.topPages.map(function(p, idx) {
                    return '<li class="flex items-center">' +
                        '<span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">' + (idx + 1) + '</span>' +
                        '<span class="text-sm text-slate-700 flex-1 truncate font-medium">' + (p.page_visited || '').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>' +
                        '<span class="text-sm font-bold text-indigo-600">' + (p.count || 0).toLocaleString() + ' <small class="text-slate-400 font-normal ml-0.5">PV</small></span>' +
                        '</li>';
                }).join('');
            } else {
                topPagesList.innerHTML = '<li class="py-10 text-center text-slate-400">집계된 데이터가 없습니다.</li>';
            }
        }
    } catch (e) {
        console.error('Failed to load website stats:', e);
    }
}

async function loadAttendance() {
    try {
        var response = await fetch('/api/dashboard/today-attendance');
        var result = await response.json();
        var tbody = document.getElementById('attendanceTableBody');
        if (result.success && result.data.length > 0) {
            var statusMap = {
                'present': { text: '출석', class: 'bg-green-100 text-green-700' },
                'late': { text: '지각', class: 'bg-yellow-100 text-yellow-700' },
                'early_leave': { text: '조퇴', class: 'bg-orange-100 text-orange-700' },
                'absent': { text: '결석', class: 'bg-red-100 text-red-700' },
                'pending': { text: '대기', class: 'bg-slate-100 text-slate-700' }
            };
            tbody.innerHTML = result.data.map(function(s) {
                var status = statusMap[s.status] || statusMap['pending'];
                var courseTitle = s.course_title ? (s.course_title.length > 15 ? s.course_title.substring(0, 15) + '...' : s.course_title) : '과정 미정';
                var checkInTime = s.check_in_time || '-';
                return '<tr class="hover:bg-slate-50 transition-colors">' +
                    '<td class="px-6 py-4 font-medium text-slate-800">' + s.student_name + '</td>' +
                    '<td class="px-6 py-4 text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">' + courseTitle + '</td>' +
                    '<td class="px-6 py-4 text-slate-600">' + checkInTime + '</td>' +
                    '<td class="px-6 py-4"><span class="px-2 py-1 ' + status.class + ' rounded-full text-xs font-medium">' + status.text + '</span></td>' +
                '</tr>';
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-slate-500">금일 출석 데이터가 없습니다.</td></tr>';
        }
    } catch (e) {
        console.error('Failed to load attendance:', e);
        document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-red-400">데이터 로드 실패</td></tr>';
    }
}

async function loadDashboardStats() {
    try {
        var token = localStorage.getItem('token');
        var response = await fetch('/api/dashboard/stats', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.status === 401) {
            location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
            return;
        }
        var result = await response.json();
        if (result.success) {
            var data = result.data;
            document.getElementById('stat-total-students').textContent = data.totalStudents.toLocaleString();
            document.getElementById('stat-active-courses').textContent = data.activeCourses.toLocaleString();
            var breakdown = data.courseStatusBreakdown || {};
            document.getElementById('stat-c-active').textContent = (breakdown['active'] || 0).toLocaleString();
            document.getElementById('stat-c-recruiting').textContent = ((breakdown['recruiting'] || 0) + (breakdown['preparing'] || 0)).toLocaleString();
            document.getElementById('stat-c-closed').textContent = ((breakdown['closed'] || 0) + (breakdown['completed'] || 0)).toLocaleString();
            document.getElementById('stat-monthly-revenue').textContent = (data.monthlyRevenue || 0).toLocaleString();
            if (data.revenueBreakdown) {
                document.getElementById('stat-rev-card').textContent = (data.revenueBreakdown.card || 0).toLocaleString();
                document.getElementById('stat-rev-transfer').textContent = (data.revenueBreakdown.transfer || 0).toLocaleString();
                document.getElementById('stat-rev-gov').textContent = (data.revenueBreakdown.gov || 0).toLocaleString();
            }
            document.getElementById('stat-new-inquiries').textContent = data.newInquiries || '0';
            if (data.inquiryStats) {
                document.getElementById('stat-inq-pending').textContent = data.inquiryStats.pending || '0';
                document.getElementById('stat-inq-completed').textContent = data.inquiryStats.completed || '0';
            }
            initCharts(data);
            renderPendingList(data.pendingApprovals);
            renderAbnormalList(data.abnormalFacilities, data.abnormalItems);
        }
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

function initCharts(data) {
    var growthCtx = document.getElementById('growthChart').getContext('2d');
    var growthLabels = data.monthlyGrowth ? data.monthlyGrowth.map(function(item) { return item.month; }) : [];
    var growthData = data.monthlyGrowth ? data.monthlyGrowth.map(function(item) { return item.count; }) : [];
    new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: growthLabels,
            datasets: [{
                label: '신규 회원 수',
                data: growthData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
    var popularCtx = document.getElementById('popularCoursesChart').getContext('2d');
    var popLabels = data.popularCourses ? data.popularCourses.map(function(c) { return c.title.substring(0, 10) + '...'; }) : [];
    var popData = data.popularCourses ? data.popularCourses.map(function(c) { return c.student_count; }) : [];
    new Chart(popularCtx, {
        type: 'bar',
        data: {
            labels: popLabels,
            datasets: [{
                label: '수강생 수',
                data: popData,
                backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });
}

function renderPendingList(list) {
    var container = document.getElementById('pending-approvals-list');
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-slate-500">대기 중인 항목이 없습니다.</div>';
        return;
    }
    container.innerHTML = list.map(function(item) {
        var name = (item.user_name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
        var title = (item.course_title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
        var dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : '';
        return '<div class="px-6 py-4 flex items-center hover:bg-slate-50 transition">' +
            '<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4"><i class="fas fa-user-clock"></i></div>' +
            '<div><p class="text-sm font-medium text-slate-800">' + name + ' - ' + title + '</p><p class="text-xs text-slate-500">수강 승인 요청</p></div>' +
            '<span class="ml-auto text-xs text-slate-400">' + dateStr + '</span></div>';
    }).join('');
}

function renderAbnormalList(facilities, items) {
    var container = document.getElementById('abnormal-status-list');
    if (!container) return;
    var allItems = [];
    (facilities || []).forEach(function(f) { allItems.push({ type: 'facility', status: f.status, name: f.name, manager_main: f.manager_main }); });
    (items || []).forEach(function(i) { allItems.push({ type: 'item', status: i.status, name: i.name, facility_name: i.facility_name }); });
    if (allItems.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-slate-500"><i class="fas fa-check-circle text-green-500 text-3xl mb-2 block"></i>모든 시설과 장비가<br>정상입니다.</div>';
        return;
    }
    var statusColors = { '점검필요': 'bg-yellow-100 text-yellow-700', '수리중': 'bg-red-100 text-red-700', 'bad': 'bg-yellow-100 text-yellow-700', 'broken': 'bg-red-100 text-red-700', 'repair': 'bg-orange-100 text-orange-700' };
    var statusText = { 'bad': '상태나쁨', 'broken': '고장', 'repair': '수리중' };
    container.innerHTML = allItems.map(function(item) {
        var isFacility = item.type === 'facility';
        var badgeClass = statusColors[item.status] || 'bg-slate-100 text-slate-700';
        var badgeLabel = isFacility ? item.status : (statusText[item.status] || item.status);
        var icon = isFacility ? 'fa-building' : 'fa-cubes';
        var subText = isFacility ? (item.manager_main || '관리자 없음') : (item.facility_name || '위치 미정');
        var href = isFacility ? '/admin/facilities' : '/admin/items';
        var nameEsc = (item.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var subEsc = (subText || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        return '<div class="px-6 py-4 flex items-center hover:bg-slate-50 transition cursor-pointer" onclick="location.href=\'' + href + '\'">' +
            '<div class="w-10 h-10 rounded-full ' + (isFacility ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600') + ' flex items-center justify-center mr-4"><i class="fas ' + icon + '"></i></div>' +
            '<div class="flex-1 min-w-0"><div class="flex justify-between mb-1"><h4 class="text-sm font-bold text-slate-800 truncate">' + nameEsc + '</h4>' +
            '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeClass + '">' + badgeLabel + '</span></div>' +
            '<p class="text-xs text-slate-500 truncate">' + subEsc + '</p></div></div>';
    }).join('');
}

async function handleCreateJob(e) {
    e.preventDefault();
    var form = e.target;
    var formData = new FormData(form);
    var data = {};
    formData.forEach(function(v, k) { data[k] = v; });
    try {
        var token = localStorage.getItem('token');
        var response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(data)
        });
        var result = await response.json();
        if (result.success) {
            alert('등록되었습니다.');
            closeModal('createJobModal');
            form.reset();
        } else {
            alert('오류: ' + result.error);
        }
    } catch (err) { console.error(err); alert('오류 발생'); }
}

async function handleCreatePost(e) {
    e.preventDefault();
    var form = e.target;
    var data = {
        title: form.title.value,
        content: form.content.value,
        category: 'notice',
        is_pinned: form.is_pinned.checked ? 1 : 0
    };
    try {
        var token = localStorage.getItem('token');
        var response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(data)
        });
        var result = await response.json();
        if (result.success) {
            alert('공지사항이 등록되었습니다.');
            closeModal('createPostModal');
            form.reset();
        } else {
            alert('오류: ' + result.error);
        }
    } catch (err) { console.error(err); alert('오류 발생'); }
}

var calendar;
function initDashboardCalendar() {
    var calendarEl = document.getElementById('dashboardCalendar');
    if (!calendarEl) return;
    calendarEl.style.height = '600px';
    calendarEl.style.opacity = '1';
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
        height: 600,
        events: '/api/schedules/integrated',
        eventClassNames: function(arg) {
            var props = arg.event.extendedProps;
            var cls = 'fc-event-' + (props.type || 'general');
            if (props.subType) cls += ' fc-event-' + props.type + '-' + props.subType;
            return [cls];
        },
        eventClick: function(info) { showEventDetail(info.event); },
        eventContent: function(arg) {
            var props = arg.event.extendedProps;
            var icon = '';
            if (props.type === 'course') icon = '<i class="fas fa-graduation-cap mr-1"></i>';
            else if (props.type === 'facility') icon = '<i class="fas fa-door-open mr-1"></i>';
            else if (props.type === 'consultation') {
                if (props.subType === 'hrd') icon = '<i class="fas fa-user-friends mr-1"></i>';
                else icon = '<i class="fas fa-headset mr-1"></i>';
            } else if (props.type === 'schedule') {
                if (props.category === 'academic') icon = '<i class="fas fa-university mr-1"></i>';
                else if (props.category === 'holiday') icon = '<i class="fas fa-umbrella-beach mr-1"></i>';
                else icon = '<i class="fas fa-calendar-check mr-1"></i>';
            } else icon = '<i class="fas fa-calendar mr-1"></i>';
            return { html: '<div class="fc-content overflow-hidden text-[10px]">' + icon + '<span>' + arg.event.title + '</span></div>' };
        }
    });
    calendar.render();
    setTimeout(function() { if (calendar) calendar.updateSize(); }, 200);
    setTimeout(function() { if (calendar) calendar.updateSize(); }, 1000);
}

function toggleCalFilter(type) { document.body.classList.toggle('hide-' + type); }

function showEventDetail(event) {
    var props = event.extendedProps;
    document.getElementById('modalEventName').textContent = event.title;
    var timeStr = event.allDay ? '종일' : (event.start ? event.start.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '');
    if (!event.allDay && event.end) timeStr += ' ~ ' + event.end.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('modalTime').textContent = timeStr;
    var desc = props.description || '';
    var btnViewCourse = document.getElementById('btnViewCourse');
    btnViewCourse.style.display = 'none';
    if (props.type === 'course') {
        document.getElementById('modalEventName').textContent = '[교육과정] ' + event.title;
        var statusMap = { active: '진행중', recruiting: '모집중', in_progress: '진행중', upcoming: '모집중', closed: '마감', completed: '마감', preparing: '준비', always_open: '상시모집' };
        var s = props.status || 'active';
        var sLabel = statusMap[s] || s;
        desc = '[상태] ' + sLabel + '\\n[장소] ' + (props.roomId || '미정') + '\\n' + desc;
        btnViewCourse.style.display = 'block';
        btnViewCourse.textContent = 'LMS 바로가기';
        btnViewCourse.onclick = function() { location.href = '/admin/courses/' + event.id.split('-')[1] + '/lms'; };
    } else if (props.type === 'facility') {
        document.getElementById('modalEventName').textContent = '[시설예약] ' + event.title;
        btnViewCourse.style.display = 'block';
        btnViewCourse.textContent = '시설 관리';
        btnViewCourse.onclick = function() { location.href = '/admin/facilities'; };
        desc = '[목적] ' + (props.purpose || '-') + '\\n[예약자] ' + (props.userName || '-') + '\\n[내용] ' + desc;
    } else if (props.type === 'consultation') {
        var isHrd = props.subType === 'hrd';
        document.getElementById('modalEventName').textContent = (isHrd ? '[면담] ' : '[상담] ') + event.title;
        if (isHrd) {
            btnViewCourse.style.display = 'block';
            btnViewCourse.textContent = '상담 일지';
            btnViewCourse.onclick = function() { location.href = '/admin/counseling?search=' + encodeURIComponent(props.clientName || ''); };
        } else if (props.isInquiry) {
            btnViewCourse.style.display = 'block';
            btnViewCourse.textContent = '문의 내역 보기';
            btnViewCourse.onclick = function() { location.href = '/admin/inquiries?id=' + event.id.split('-')[1]; };
        }
        var statusText = props.status === 'pending' ? '<span class="text-orange-500 font-bold">신규</span>' : '<span class="text-slate-500">답변완료</span>';
        desc = '[상태] ' + statusText + '\\n[대상] ' + (props.clientName || '-') + '\\n[연락처] ' + (props.phone || '-') + '\\n[내용] ' + desc;
        if (props.memo) desc += '\\n[상담원 메모] ' + props.memo;
        if (props.result) desc += '\\n[결과] ' + props.result;
    } else {
        document.getElementById('modalEventName').textContent = '[일정] ' + event.title;
    }
    document.getElementById('modalDesc').innerHTML = desc.replace(/\\n/g, '<br>') || '내용 없음';
    document.getElementById('eventModal').classList.remove('hidden');
}

function toggleCalendarSection() {
    var cal = document.getElementById('dashboardCalendar');
    var icon = document.getElementById('calToggleIcon');
    if (!cal || !icon) return;
    if (cal.style.height === '0px') {
        cal.style.height = '600px';
        cal.style.opacity = '1';
        icon.style.transform = 'rotate(0deg)';
        setTimeout(function() { if (calendar) calendar.updateSize(); }, 550);
    } else {
        cal.style.height = '0px';
        cal.style.opacity = '0';
        icon.style.transform = 'rotate(180deg)';
    }
}

function initAdminDashboard() {
    var userStr = localStorage.getItem('user');
    var token = localStorage.getItem('token');
    if (!userStr || !token) {
        location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
        return;
    }
    var user = null;
    try {
        user = JSON.parse(userStr);
    } catch (e) {}
    if (!user || user.role !== 'admin') {
        location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
        return;
    }
    updateHeaderClock();
    updateWelcomeDate();
    setInterval(updateHeaderClock, 1000);
    var badge = document.getElementById('user-badge');
    if (badge) {
        badge.textContent = 'ADMIN';
        badge.className = 'px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest';
    }
    loadDashboardStats();
    loadWebsiteStats();
    loadAttendance();
    loadActiveSessions();
    initDashboardCalendar();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
    initAdminDashboard();
}
