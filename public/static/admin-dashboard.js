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

/* 공통 톤: 그래파이트 라이트 램프 + 블루 액센트 하나 */
var INK = '#171717', INK2 = '#525252', INK3 = '#737373', LINE = 'rgba(23,23,23,0.08)', ACCENT = '#2563eb';
var MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** 상태 점 + 텍스트 (알약 배지 대신) */
function statusDotHtml(text, color) {
    return '<span class="inline-flex items-center gap-1.5 text-[12px] text-[#525252]"><span class="w-1.5 h-1.5 rounded-full" style="background:' + color + '"></span>' + esc(text) + '</span>';
}

/** API가 내려준 유효 상태(개강·종료일 반영) → 점 색과 라벨 */
function sessionStatusBadgeHtml(st) {
    var s = (st || '').toLowerCase();
    var map = {
        in_progress: { t: '진행중', c: '#16a34a' },
        recruiting: { t: '모집중', c: ACCENT },
        completed: { t: '종료', c: '#a3a3a3' },
        always_open: { t: '상시모집', c: ACCENT },
        closed: { t: '폐강', c: '#dc2626' },
    };
    var m = map[s] || { t: st || '-', c: '#a3a3a3' };
    return statusDotHtml(m.t, m.c);
}

/** 시그니처: 회차 진행선 — 훈련 시작~종료 사이에서 오늘 위치 */
function sessionProgressHtml(startStr, endStr) {
    if (!startStr || !endStr) return '';
    var start = new Date(startStr + 'T00:00:00');
    var end = new Date(endStr + 'T00:00:00');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    if (isNaN(start) || isNaN(end) || end <= start) return '';
    var total = Math.round((end - start) / 86400000);
    var elapsed = Math.round((today - start) / 86400000);
    var pct = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
    var label = elapsed < 0 ? ('개강 ' + Math.abs(elapsed) + '일 전') : (elapsed > total ? '종료' : ('D+' + elapsed + ' · ' + pct + '%'));
    return '<div class="mt-4">' +
        '<div class="h-1 rounded-full bg-[#171717]/[0.06] overflow-hidden"><div class="h-full rounded-full bg-[#2563eb]" style="width:' + pct + '%"></div></div>' +
        '<div class="mt-1.5 flex justify-between text-[12px] text-[#737373] mono"><span>' + esc(startStr.substring(5, 10)) + '</span><span>' + esc(label) + '</span><span>' + esc(endStr.substring(5, 10)) + '</span></div>' +
        '</div>';
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
            var linkCls = 'focus-ring h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#171717]/[0.08] bg-white text-[13px] text-[#525252] hover:bg-[#f4f4f5] transition-colors duration-150';
            var html = result.data.map(function(session) {
                var sid = session.id;
                var lmsRaw = session.lms_course_id;
                var pathId = (lmsRaw != null && String(lmsRaw).trim() !== '') ? lmsRaw : sid;
                var hrdQs = 'type=hrd&session_id=' + encodeURIComponent(String(sid));
                var name = esc(session.course_name);
                var num = session.session_number || 1;
                var instructor = esc(session.instructor_name || '강사 미배정');
                return '<div class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5 flex flex-col">' +
                    '<div class="flex items-center justify-between gap-2">' + sessionStatusBadgeHtml(session.status) +
                    '<span class="text-[12px] text-[#737373] num">' + num + '회차</span></div>' +
                    '<h3 class="mt-3 text-[15px] font-medium truncate" title="' + name + '">' + name + '</h3>' +
                    '<p class="mt-1 text-[13px] text-[#525252] truncate">' + instructor + '</p>' +
                    sessionProgressHtml(session.training_start_date, session.training_end_date) +
                    '<div class="mt-4 grid grid-cols-4 gap-2">' +
                    '<a href="/admin/courses/' + pathId + '/lms/attendance?' + hrdQs + '" class="' + linkCls + '">출석</a>' +
                    '<a href="/admin/courses/' + pathId + '/lms/counseling?' + hrdQs + '" class="' + linkCls + '">상담</a>' +
                    '<a href="/admin/courses/' + pathId + '/lms/assignments?' + hrdQs + '" class="' + linkCls + '">과제</a>' +
                    '<a href="/admin/courses/sessions/' + sid + '/timetable" class="' + linkCls + '">시간표</a>' +
                    '</div>' +
                    '<a href="/admin/courses/' + pathId + '/lms?' + hrdQs + '" class="focus-ring mt-2 h-9 inline-flex items-center justify-center rounded-lg bg-[#171717] text-white text-[13px] hover:bg-[#2b2b2b] transition-colors duration-150">LMS 관리</a>' +
                    '</div>';
            }).join('');
            grid.innerHTML = html;
        } else {
            grid.innerHTML = '<div class="col-span-full py-12 text-center rounded-2xl border border-dashed border-[#171717]/[0.12] bg-white">' +
                '<p class="text-[14px]">진행 중인 과정이 없습니다</p>' +
                '<p class="mt-1 text-[13px] text-[#737373]">회차별 과정 개설에서 새 회차를 시작할 수 있습니다</p>' +
                '<a href="/admin/courses/sessions" class="focus-ring inline-flex items-center mt-4 text-[13px] text-[#1d4ed8] hover:underline">회차 관리로 이동</a>' +
                '</div>';
        }
    } catch (e) {
        console.error('Failed to load active sessions:', e);
        grid.innerHTML = '<div class="col-span-full py-8 text-center text-[13px] text-[#dc2626]">운영 중인 과정을 불러오지 못했습니다</div>';
    }
}

/** 순위 목록 한 줄: 순위 · 이름 · 얇은 막대 · 값 */
function rankedRowHtml(idx, label, value, max, unit, isTop) {
    var pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
    return '<li class="flex items-center gap-3">' +
        '<span class="w-5 text-[12px] text-[#737373] mono text-right">' + (idx + 1) + '</span>' +
        '<div class="flex-1 min-w-0">' +
        '<div class="flex items-baseline justify-between gap-3"><span class="text-[13px] truncate' + (isTop ? '' : ' text-[#525252]') + '">' + label + '</span>' +
        '<span class="text-[13px] mono shrink-0' + (isTop ? ' text-[#1d4ed8]' : ' text-[#525252]') + '">' + value.toLocaleString() + (unit ? '<span class="text-[#737373]"> ' + unit + '</span>' : '') + '</span></div>' +
        '<div class="mt-1.5 h-1 rounded-full bg-[#171717]/[0.06] overflow-hidden"><div class="h-full rounded-full ' + (isTop ? 'bg-[#2563eb]' : 'bg-[#a3a3a3]') + '" style="width:' + pct + '%"></div></div>' +
        '</div></li>';
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

            // 최근 7일 접속: 목록 + 얇은 막대 (오늘만 액센트)
            var trendList = document.getElementById('website-trend-list');
            var trend = Array.isArray(data.weeklyTrend) ? data.weeklyTrend : [];
            if (trendList) {
                if (trend.length) {
                    var maxPv = Math.max.apply(null, trend.map(function(t) { return Number(t.count) || 0; }));
                    var last = trend.length - 1;
                    trendList.innerHTML = trend.map(function(t, i) {
                        var d = new Date(t.date + 'T00:00:00');
                        var dayLabel = isNaN(d) ? t.date.substring(5) : (t.date.substring(5) + ' (' + ['일', '월', '화', '수', '목', '금', '토'][d.getDay()] + ')');
                        return rankedRowHtml(i, esc(dayLabel), Number(t.count) || 0, maxPv, '', i === last).replace(/<span class="w-5[^>]*>\d+<\/span>/, '');
                    }).join('');
                } else {
                    trendList.innerHTML = '<li class="text-[13px] text-[#737373]">집계된 접속이 없습니다</li>';
                }
            }

            var topPagesList = document.getElementById('top-pages-list');
            if (data.topPages && data.topPages.length > 0) {
                var maxCount = Math.max.apply(null, data.topPages.map(function(p) { return Number(p.count) || 0; }));
                topPagesList.innerHTML = data.topPages.map(function(p, idx) {
                    return rankedRowHtml(idx, esc(p.page_visited || ''), Number(p.count) || 0, maxCount, '', idx === 0);
                }).join('');
            } else {
                topPagesList.innerHTML = '<li class="text-[13px] text-[#737373]">집계된 데이터가 없습니다</li>';
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
                'present': { text: '출석', c: '#16a34a' },
                'late': { text: '지각', c: '#d97706' },
                'early_leave': { text: '조퇴', c: '#d97706' },
                'absent': { text: '결석', c: '#dc2626' },
                'pending': { text: '대기', c: '#a3a3a3' }
            };
            tbody.innerHTML = result.data.map(function(s) {
                var status = statusMap[s.status] || statusMap['pending'];
                var courseTitle = s.course_title || '과정 미정';
                var checkInTime = s.check_in_time || '-';
                return '<tr class="hover:bg-[#fafafa] transition-colors duration-150">' +
                    '<td class="px-5 h-11 text-[#171717] whitespace-nowrap">' + esc(s.student_name) + '</td>' +
                    '<td class="px-3 h-11 text-[#525252] max-w-[160px] truncate" title="' + esc(courseTitle) + '">' + esc(courseTitle) + '</td>' +
                    '<td class="px-3 h-11 text-[#525252] mono whitespace-nowrap">' + esc(checkInTime) + '</td>' +
                    '<td class="px-5 h-11 whitespace-nowrap">' + statusDotHtml(status.text, status.c) + '</td>' +
                '</tr>';
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="px-5 py-6 text-center text-[#737373]">오늘 출석 기록이 없습니다</td></tr>';
        }
    } catch (e) {
        console.error('Failed to load attendance:', e);
        document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="4" class="px-5 py-6 text-center text-[#dc2626]">출석 기록을 불러오지 못했습니다</td></tr>';
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
            renderPopularCourses(data.popularCourses);
            renderPendingList(data.pendingApprovals);
            renderAbnormalList(data.abnormalFacilities, data.abnormalItems);
        }
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

/** 주 차트: 월별 신규 회원 — 액센트 한 색, 이번 달만 점으로 강조, 조용한 격자와 모노 눈금 */
function initCharts(data) {
    var growthCtx = document.getElementById('growthChart').getContext('2d');
    var growthLabels = data.monthlyGrowth ? data.monthlyGrowth.map(function(item) { return item.month; }) : [];
    var growthData = data.monthlyGrowth ? data.monthlyGrowth.map(function(item) { return item.count; }) : [];
    var lastIdx = growthData.length - 1;
    new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: growthLabels,
            datasets: [{
                label: '신규 회원',
                data: growthData,
                borderColor: ACCENT,
                borderWidth: 2,
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                tension: 0.3,
                fill: true,
                pointRadius: growthData.map(function(_, i) { return i === lastIdx ? 4 : 0; }),
                pointHoverRadius: 4,
                pointBackgroundColor: ACCENT,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: INK, titleFont: { family: MONO, size: 12 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8, displayColors: false,
                    callbacks: { label: function(c) { return c.parsed.y.toLocaleString() + '명'; } } }
            },
            scales: {
                x: { grid: { display: false }, border: { color: LINE }, ticks: { color: INK3, font: { family: MONO, size: 11 } } },
                y: { beginAtZero: true, grid: { color: LINE }, border: { display: false }, ticks: { color: INK3, font: { family: MONO, size: 11 }, precision: 0, maxTicksLimit: 5 } }
            }
        }
    });
}

/** 수강생이 많은 과정: 차트 대신 순위 목록 (1위만 액센트) */
function renderPopularCourses(list) {
    var el = document.getElementById('popular-courses-list');
    if (!el) return;
    var rows = Array.isArray(list) ? list : [];
    if (!rows.length) {
        el.innerHTML = '<li class="text-[13px] text-[#737373]">집계된 과정이 없습니다</li>';
        return;
    }
    var max = Math.max.apply(null, rows.map(function(c) { return Number(c.student_count) || 0; }));
    el.innerHTML = rows.slice(0, 5).map(function(c, idx) {
        return rankedRowHtml(idx, esc(c.title || ''), Number(c.student_count) || 0, max, '명', idx === 0);
    }).join('');
}

function renderPendingList(list) {
    var container = document.getElementById('pending-approvals-list');
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<div class="px-5 py-6 text-center text-[13px] text-[#737373]">대기 중인 요청이 없습니다</div>';
        return;
    }
    container.innerHTML = list.map(function(item) {
        var name = esc(item.user_name || '');
        var title = esc(item.course_title || '');
        var dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) : '';
        return '<a href="/admin/enrollments" class="focus-ring px-5 h-14 flex items-center gap-3 hover:bg-[#fafafa] transition-colors duration-150">' +
            '<div class="flex-1 min-w-0"><p class="text-[13px] truncate">' + name + '</p><p class="text-[12px] text-[#737373] truncate">' + title + '</p></div>' +
            '<span class="text-[12px] text-[#737373] mono shrink-0">' + dateStr + '</span></a>';
    }).join('');
}

function renderAbnormalList(facilities, items) {
    var container = document.getElementById('abnormal-status-list');
    if (!container) return;
    var allItems = [];
    (facilities || []).forEach(function(f) { allItems.push({ type: 'facility', status: f.status, name: f.name, manager_main: f.manager_main }); });
    (items || []).forEach(function(i) { allItems.push({ type: 'item', status: i.status, name: i.name, facility_name: i.facility_name }); });
    if (allItems.length === 0) {
        container.innerHTML = '<div class="px-5 py-6 text-center text-[13px] text-[#737373]">점검이 필요한 시설·비품이 없습니다</div>';
        return;
    }
    var statusColor = { '점검필요': '#d97706', '수리중': '#dc2626', 'bad': '#d97706', 'broken': '#dc2626', 'repair': '#d97706' };
    var statusText = { 'bad': '상태 나쁨', 'broken': '고장', 'repair': '수리중' };
    container.innerHTML = allItems.map(function(item) {
        var isFacility = item.type === 'facility';
        var color = statusColor[item.status] || '#a3a3a3';
        var label = isFacility ? item.status : (statusText[item.status] || item.status);
        var subText = isFacility ? (item.manager_main || '담당자 없음') : (item.facility_name || '위치 미정');
        var href = isFacility ? '/admin/facilities' : '/admin/items';
        return '<a href="' + href + '" class="focus-ring px-5 h-14 flex items-center gap-3 hover:bg-[#fafafa] transition-colors duration-150">' +
            '<span class="w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-lg bg-[#f4f4f5] text-[#737373]"><i class="fas ' + (isFacility ? 'fa-building' : 'fa-cube') + ' text-[13px]"></i></span>' +
            '<div class="flex-1 min-w-0"><p class="text-[13px] truncate">' + esc(item.name || '') + '</p><p class="text-[12px] text-[#737373] truncate">' + esc(subText) + '</p></div>' +
            '<span class="shrink-0">' + statusDotHtml(label || '-', color) + '</span></a>';
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
        events: function(info, successCallback, failureCallback) {
            var qs = 'start=' + encodeURIComponent(info.startStr) + '&end=' + encodeURIComponent(info.endStr);
            fetch('/api/schedules/integrated?' + qs, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
                .then(function(r) { return r.json(); })
                .then(function(data) { successCallback(Array.isArray(data) ? data : []); })
                .catch(failureCallback);
        },
        eventClassNames: function(arg) {
            var props = arg.event.extendedProps;
            var cls = 'fc-event-' + (props.type || 'general');
            if (props.subType) cls += ' fc-event-' + props.type + '-' + props.subType;
            return [cls];
        },
        eventClick: function(info) { showEventDetail(info.event); },
        eventContent: function(arg) {
            // 분류는 색으로 이미 구분되므로 아이콘 없이 제목만
            return { html: '<div class="fc-content overflow-hidden truncate">' + esc(arg.event.title) + '</div>' };
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
        desc = '[상태] ' + sLabel + '\n[장소] ' + (props.roomId || '미정') + '\n' + desc;
        btnViewCourse.style.display = 'block';
        btnViewCourse.textContent = 'LMS 바로가기';
        btnViewCourse.onclick = function() {
            var sid = props.sessionId;
            if (sid != null && sid !== '') {
                location.href = '/admin/courses/' + encodeURIComponent(String(sid)) + '/lms?type=hrd&session_id=' + encodeURIComponent(String(sid));
            } else {
                location.href = '/admin/courses/' + event.id.split('-')[1] + '/lms?type=hrd';
            }
        };
    } else if (props.type === 'facility') {
        document.getElementById('modalEventName').textContent = '[시설예약] ' + event.title;
        btnViewCourse.style.display = 'block';
        btnViewCourse.textContent = '시설 관리';
        btnViewCourse.onclick = function() { location.href = '/admin/facilities'; };
        desc = '[목적] ' + (props.purpose || '-') + '\n[예약자] ' + (props.userName || '-') + '\n[내용] ' + desc;
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
        var statusText = props.status === 'pending' ? '<span class="text-[#1d4ed8]">답변 대기</span>' : '<span class="text-[#737373]">답변 완료</span>';
        desc = '[상태] ' + statusText + '\n[대상] ' + (props.clientName || '-') + '\n[연락처] ' + (props.phone || '-') + '\n[내용] ' + desc;
        if (props.memo) desc += '\n[상담원 메모] ' + props.memo;
        if (props.result) desc += '\n[결과] ' + props.result;
    } else {
        document.getElementById('modalEventName').textContent = '[일정] ' + event.title;
    }
    document.getElementById('modalDesc').innerHTML = desc.replace(/\n/g, '<br>') || '내용 없음';
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
        setTimeout(function() { if (calendar) calendar.updateSize(); }, 350);
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
        badge.textContent = '관리자' + (user.name ? ' · ' + user.name : '');
        badge.className = 'text-[12px] text-[#737373] truncate';
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
