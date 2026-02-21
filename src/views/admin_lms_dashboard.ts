
import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsDashboardHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>학사관리 대시보드 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; }
        @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('dashboard')}

                <!-- 메인 컨텐츠 -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 요약 카드 -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">오늘 출석률</h3>
                    <i class="fas fa-user-check text-blue-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="todayAttendanceRate"><span class="skeleton inline-block w-16 h-8 rounded"></span></span>
                    <span class="text-sm text-gray-500 mb-1" id="todayAttendanceCount"></span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">진도율</h3>
                    <i class="fas fa-book-reader text-green-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="courseProgress"><span class="skeleton inline-block w-16 h-8 rounded"></span></span>
                    <span class="text-sm text-gray-500 mb-1" id="courseDayCount"></span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">상담 건수</h3>
                    <i class="fas fa-comments text-yellow-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="counselingCount"><span class="skeleton inline-block w-10 h-8 rounded"></span></span>
                    <span class="text-sm text-gray-500 mb-1" id="counselingPeriod"></span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">평균 성적</h3>
                    <i class="fas fa-star text-purple-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="averageScore"><span class="skeleton inline-block w-12 h-8 rounded"></span></span>
                    <span class="text-sm text-gray-500 mb-1" id="testedCount"></span>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- 왼쪽: 출결 현황 차트 -->
            <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">주간 출결 현황</h3>
                    <span class="text-xs text-gray-400" id="chartPeriodLabel"></span>
                </div>
                <canvas id="attendanceChart" height="200"></canvas>
            </div>

            <!-- 오른쪽: 오늘의 일정 및 할일 -->
            <div class="space-y-6">
                <!-- 오늘의 훈련 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">오늘의 훈련</h3>
                        <span class="text-xs text-gray-400" id="todayDateLabel"></span>
                    </div>
                    <div class="space-y-3" id="todayScheduleContainer">
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="skeleton w-24 h-3 rounded mb-2"></div>
                            <div class="skeleton w-40 h-4 rounded"></div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="skeleton w-24 h-3 rounded mb-2"></div>
                            <div class="skeleton w-36 h-4 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- 공지사항 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">과정 공지사항</h3>
                        <a id="noticesMoreLink" href="#" class="text-xs text-gray-500 hover:text-gray-700">더보기</a>
                    </div>
                    <ul class="space-y-3 text-sm text-gray-600" id="noticesContainer">
                        <li class="flex justify-between">
                            <span class="skeleton w-40 h-4 rounded"></span>
                            <span class="skeleton w-10 h-3 rounded"></span>
                        </li>
                        <li class="flex justify-between">
                            <span class="skeleton w-36 h-4 rounded"></span>
                            <span class="skeleton w-10 h-3 rounded"></span>
                        </li>
                        <li class="flex justify-between">
                            <span class="skeleton w-32 h-4 rounded"></span>
                            <span class="skeleton w-10 h-3 rounded"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- NCS 진행 현황 (Full Width) -->
        <div class="mt-8 bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">NCS 능력단위별 이수 현황 (훈련시간 기준)</h3>
                <div class="flex gap-4 text-xs font-semibold">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-blue-500 rounded-sm"></span> 이수시간</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-gray-100 rounded-sm"></span> 남은시간</span>
                </div>
            </div>
            <div id="ncsProgressRows" class="space-y-5">
                <div class="py-10 text-center text-gray-400">NCS 데이터를 불러오는 중...</div>
            </div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

        // 오늘 날짜
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayLabel = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

        document.addEventListener('DOMContentLoaded', () => {
            const todayDateEl = document.getElementById('todayDateLabel');
            if (todayDateEl) todayDateEl.textContent = todayLabel;

            loadAttendanceStats();
            loadCounselingStats();
            loadGradeStats();
            loadNcsProgress();
            loadWeeklyAttendanceChart();
            loadTodaySchedule();
            loadNotices();
            loadNcsSummary();
        });

        // ===== 1. 오늘 출석률 =====
        async function loadAttendanceStats() {
            const rateEl = document.getElementById('todayAttendanceRate');
            const countEl = document.getElementById('todayAttendanceCount');
            try {
                const res = await fetch('/api/hrd/attendance?courseId=' + courseId + '&date=' + todayStr, { headers });
                const result = await res.json();
                if (result.success) {
                    const data = result.data || [];
                    const total = data.length;
                    const present = data.filter(function(s) { return s.status === 'present' || s.status === 'late'; }).length;
                    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

                    rateEl.textContent = rate + '%';
                    countEl.textContent = '(' + present + '/' + total + '명)';
                } else {
                    rateEl.textContent = '--%';
                    countEl.textContent = '(데이터 없음)';
                }
            } catch (e) {
                console.error('출석 통계 로드 실패:', e);
                rateEl.textContent = '--%';
                countEl.textContent = '(로드 실패)';
            }
        }

        // ===== 2. 상담 건수 =====
        async function loadCounselingStats() {
            const countEl = document.getElementById('counselingCount');
            const periodEl = document.getElementById('counselingPeriod');
            try {
                const res = await fetch('/api/hrd/counseling?course_id=' + courseId, { headers });
                const result = await res.json();
                if (result.success) {
                    var logs = result.data || [];
                    countEl.textContent = logs.length + '건';

                    // 이번 달 상담 수
                    var thisMonth = todayStr.substring(0, 7);
                    var monthCount = logs.filter(function(l) { return (l.counseling_date || '').startsWith(thisMonth); }).length;
                    periodEl.textContent = '(이번달 ' + monthCount + '건)';
                } else {
                    countEl.textContent = '0건';
                    periodEl.textContent = '';
                }
            } catch (e) {
                console.error('상담 통계 로드 실패:', e);
                countEl.textContent = '-';
                periodEl.textContent = '';
            }
        }

        // ===== 3. 평균 성적 =====
        async function loadGradeStats() {
            const scoreEl = document.getElementById('averageScore');
            const testedEl = document.getElementById('testedCount');
            try {
                var res = await fetch('/api/hrd/grades/summary', { headers });
                var result = await res.json();
                if (result.success && result.data) {
                    // 해당 과정 찾기
                    var courseData = result.data.find(function(d) { return String(d.id) === String(courseId); });
                    if (courseData && courseData.avg_score > 0) {
                        scoreEl.textContent = courseData.avg_score + '점';
                        testedEl.textContent = '(' + courseData.tested_count + '명 응시)';
                    } else {
                        scoreEl.textContent = '미응시';
                        testedEl.textContent = '';
                    }
                } else {
                    scoreEl.textContent = '-';
                    testedEl.textContent = '';
                }
            } catch (e) {
                console.error('성적 통계 로드 실패:', e);
                scoreEl.textContent = '-';
                testedEl.textContent = '';
            }
        }

        // ===== 4. NCS 진도율 (요약 카드) =====
        async function loadNcsProgress() {
            try {
                var res = await fetch('/api/hrd/courses/' + courseId + '/ncs-summary');
                var result = await res.json();
                if (result.success && result.data.length > 0) {
                    var totalTarget = result.data.reduce(function(sum, item) { return sum + item.target_hours; }, 0);
                    var totalCurrent = result.data.reduce(function(sum, item) { return sum + item.current_hours; }, 0);
                    var overallPercent = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
                    
                    document.getElementById('courseProgress').textContent = overallPercent + '%';
                    document.getElementById('courseDayCount').textContent = '(' + totalCurrent + '/' + totalTarget + '시간)';
                } else {
                    document.getElementById('courseProgress').textContent = '0%';
                    document.getElementById('courseDayCount').textContent = '(NCS 미등록)';
                }
            } catch (e) {
                console.error('NCS 진도 로드 실패:', e);
                document.getElementById('courseProgress').textContent = '-';
                document.getElementById('courseDayCount').textContent = '';
            }
        }

        // ===== 5. 주간 출결 차트 =====
        async function loadWeeklyAttendanceChart() {
            var labels = [];
            var attendanceRates = [];
            var dayNames = ['일', '월', '화', '수', '목', '금', '토'];

            // 최근 5영업일 계산
            var businessDays = [];
            var d = new Date(today);
            while (businessDays.length < 5) {
                var dow = d.getDay();
                if (dow !== 0 && dow !== 6) {
                    businessDays.unshift(new Date(d));
                }
                d.setDate(d.getDate() - 1);
            }

            var periodLabel = document.getElementById('chartPeriodLabel');
            if (periodLabel && businessDays.length > 0) {
                var startLabel = businessDays[0].toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                var endLabel = businessDays[businessDays.length -1].toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                periodLabel.textContent = startLabel + ' ~ ' + endLabel;
            }

            for (var i = 0; i < businessDays.length; i++) {
                var dateStr = businessDays[i].toISOString().split('T')[0];
                labels.push(dayNames[businessDays[i].getDay()] + ' (' + businessDays[i].getDate() + '일)');

                try {
                    var res = await fetch('/api/hrd/attendance?courseId=' + courseId + '&date=' + dateStr, { headers });
                    var result = await res.json();
                    if (result.success) {
                        var data = result.data || [];
                        var total = data.length;
                        var present = data.filter(function(s) { return s.status === 'present' || s.status === 'late'; }).length;
                        attendanceRates.push(total > 0 ? Math.round((present / total) * 100) : 0);
                    } else {
                        attendanceRates.push(0);
                    }
                } catch (e) {
                    attendanceRates.push(0);
                }
            }

            var ctx = document.getElementById('attendanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '출석률 (%)',
                        data: attendanceRates,
                        backgroundColor: attendanceRates.map(function(v) { 
                            return v >= 80 ? 'rgba(34, 197, 94, 0.6)' : v >= 50 ? 'rgba(234, 179, 8, 0.6)' : 'rgba(239, 68, 68, 0.6)'; 
                        }),
                        borderColor: attendanceRates.map(function(v) { 
                            return v >= 80 ? 'rgba(34, 197, 94, 1)' : v >= 50 ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)'; 
                        }),
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(ctx) { return '출석률: ' + ctx.parsed.y + '%'; }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { callback: function(v) { return v + '%'; } }
                        }
                    }
                }
            });
        }

        // ===== 6. 오늘의 훈련 (시간표) =====
        async function loadTodaySchedule() {
            var container = document.getElementById('todayScheduleContainer');
            try {
                // 1) 교시 시간 설정 가져오기
                var configRes = await fetch('/api/course-sessions/' + courseId + '/timetable/config', { headers });
                var configResult = await configRes.json();

                // 2) 시간표 데이터 가져오기 (오늘 날짜 범위)
                var scheduleRes = await fetch('/api/course-sessions/' + courseId + '/timetable?start_date=' + todayStr + '&end_date=' + todayStr, { headers });
                var scheduleResult = await scheduleRes.json();

                // 3) 교과목/강사 리소스 가져오기 (subject_id → 이름 변환용)
                var resourceRes = await fetch('/api/course-sessions/' + courseId + '/timetable/resources', { headers });
                var resourceResult = await resourceRes.json();

                var configs = (configResult.success && configResult.data) ? configResult.data : [];
                var schedules = (scheduleResult.success && scheduleResult.data) ? scheduleResult.data : [];
                var subjects = (resourceResult.success && resourceResult.data && resourceResult.data.subjects) ? resourceResult.data.subjects : [];
                var instructors = (resourceResult.success && resourceResult.data && resourceResult.data.instructors) ? resourceResult.data.instructors : [];

                // subject_id/instructor_id → name 매핑 맵 생성
                var subjectMap = {};
                subjects.forEach(function(s) { subjectMap[s.id] = s.subject_name || s.name || ('-'); });
                var instructorMap = {};
                instructors.forEach(function(i) { instructorMap[i.id] = i.name || ''; });

                if (configs.length === 0 && schedules.length === 0) {
                    container.innerHTML = '<div class="text-center py-6 text-gray-400 text-sm fade-in"><i class="fas fa-calendar-times text-2xl mb-2 block"></i>등록된 시간표가 없습니다.</div>';
                    return;
                }

                var html = '';
                configs.sort(function(a, b) { return a.period_number - b.period_number; });

                for (var i = 0; i < configs.length; i++) {
                    var cfg = configs[i];
                    var schedule = schedules.find(function(s) { return s.period_number === cfg.period_number; });
                    
                    if (schedule && schedule.is_excluded) continue; // 제외된 교시 스킵

                    var subjectName = '-';
                    var instructorName = '';
                    if (schedule) {
                        subjectName = subjectMap[schedule.subject_id] || (schedule.subject_name || '-');
                        instructorName = instructorMap[schedule.instructor_id] || (schedule.instructor_name || '');
                    }

                    html += '<div class="p-3 bg-gray-50 rounded border border-gray-100 fade-in">';
                    html += '  <div class="text-xs text-gray-500 mb-1">' + cfg.period_number + '교시 (' + (cfg.start_time || '') + '~' + (cfg.end_time || '') + ')</div>';
                    html += '  <div class="font-medium text-gray-800">' + subjectName + '</div>';
                    if (instructorName) {
                        html += '  <div class="text-xs text-gray-400 mt-0.5"><i class="fas fa-user-tie mr-1"></i>' + instructorName + '</div>';
                    }
                    html += '</div>';
                }

                if (!html) {
                    html = '<div class="text-center py-6 text-gray-400 text-sm fade-in"><i class="fas fa-coffee text-2xl mb-2 block"></i>오늘은 배정된 수업이 없습니다.</div>';
                }

                // 훈련일지 작성 버튼
                html += '<div class="text-center mt-2">';
                html += '  <a href="training-logs" class="text-sm text-purple-600 hover:text-purple-800 font-medium">';
                html += '    <i class="fas fa-pen-alt mr-1"></i>훈련일지 작성하기';
                html += '  </a>';
                html += '</div>';

                container.innerHTML = html;
            } catch (e) {
                console.error('시간표 로드 실패:', e);
                container.innerHTML = '<div class="text-center py-6 text-gray-400 text-sm fade-in"><i class="fas fa-exclamation-triangle text-xl mb-2 block text-yellow-400"></i>시간표를 불러올 수 없습니다.</div>';
            }
        }

        // ===== 7. 과정 공지사항 =====
        async function loadNotices() {
            var container = document.getElementById('noticesContainer');
            var moreLink = document.getElementById('noticesMoreLink');

            // 더보기 링크 설정
            var isAdmin = window.location.pathname.startsWith('/admin');
            if (moreLink) {
                moreLink.href = isAdmin ? '/admin/posts' : '/teacher/posts';
            }

            try {
                var res = await fetch('/api/posts?course_id=' + courseId + '&limit=5&category=notice', { headers });
                var result = await res.json();
                if (result.success && result.data && result.data.length > 0) {
                    var posts = result.data;
                    container.innerHTML = posts.map(function(post) {
                        var dateStr = (post.created_at || '').split('T')[0];
                        var dateParts = dateStr.split('-');
                        var shortDate = dateParts.length >= 3 ? dateParts[1] + '.' + dateParts[2] : dateStr;
                        var title = post.title || post.content || '제목 없음';
                        if (title.length > 30) title = title.substring(0, 30) + '...';
                        return '<li class="flex justify-between items-center fade-in">' +
                            '<span class="truncate pr-2 hover:text-blue-600 cursor-pointer" onclick="window.open(\\'/posts/' + post.id + '\\')">' + 
                            (post.pinned ? '<i class="fas fa-thumbtack text-red-400 mr-1 text-xs"></i>' : '') +
                            title + '</span>' +
                            '<span class="text-gray-400 text-xs whitespace-nowrap">' + shortDate + '</span>' +
                            '</li>';
                    }).join('');
                } else {
                    container.innerHTML = '<li class="text-center text-gray-400 text-sm py-4 fade-in"><i class="far fa-bell-slash mr-1"></i>등록된 공지사항이 없습니다.</li>';
                }
            } catch (e) {
                console.error('공지사항 로드 실패:', e);
                container.innerHTML = '<li class="text-center text-gray-400 text-sm py-4">공지사항을 불러올 수 없습니다.</li>';
            }
        }

        // ===== 8. NCS 능력단위별 이수 현황 =====
        async function loadNcsSummary() {
            try {
                var res = await fetch('/api/hrd/courses/' + courseId + '/ncs-summary');
                var result = await res.json();
                
                if (result.success) {
                    var container = document.getElementById('ncsProgressRows');
                    if (result.data.length === 0) {
                        container.innerHTML = '<div class="py-10 text-center text-gray-400">배정된 NCS 능력단위가 없습니다.</div>';
                        return;
                    }

                    container.innerHTML = result.data.map(function(item) {
                        var percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        var limitedPercent = Math.min(percent, 100);
                        var barColor = percent >= 100 ? 'bg-green-500' : percent >= 60 ? 'bg-blue-500' : percent >= 30 ? 'bg-yellow-400' : 'bg-red-400';
                        return '<div class="group fade-in">' +
                            '<div class="flex justify-between text-sm mb-1.5">' +
                                '<span class="font-medium text-gray-700">[' + item.unit_code + '] ' + item.unit_name + '</span>' +
                                '<span class="text-xs text-gray-500 font-bold">' + item.current_hours + ' / ' + item.target_hours + '시간 (' + percent.toFixed(1) + '%)</span>' +
                            '</div>' +
                            '<div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">' +
                                '<div class="' + barColor + ' h-full rounded-full transition-all duration-1000" style="width: ' + limitedPercent + '%"></div>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                }
            } catch (e) { console.error(e); }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
