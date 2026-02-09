import { hrdSidebar } from './components/hrd_sidebar';

/**
 * 회차별 시간표 편성 화면
 */
export function adminSessionTimetableHtml(sessionId: number): string {
    const sidebar = hrdSidebar('courses'); // 교육과정 관리 메뉴 활성화

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시간표 편성 - 통합 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
                <div class="flex items-center gap-4">
                    <h1 class="text-lg font-bold text-slate-800">시간표 편성</h1>
                    <nav class="hidden sm:flex items-center text-xs text-slate-500 gap-2">
                        <span>홈</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span>과정관리</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span class="font-bold text-slate-700">시간표 편성</span>
                    </nav>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="saveAll()" class="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                        <i class="fas fa-save"></i> 설정 저장하기
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-auto p-6 bg-slate-100 flex gap-6 custom-scrollbar">
                <!-- Left Panel: Resources & Utils -->
                <div class="w-80 flex flex-col gap-6 shrink-0">
                    <!-- Session Info Card -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <div class="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1">SELECTED SESSION</div>
                        <h2 id="sessionName" class="font-bold text-slate-800 leading-tight mb-2">-</h2>
                        <div class="space-y-1.5 text-xs text-slate-500">
                            <div class="flex justify-between"><span>훈련기간</span> <span id="sessionDateRange">-</span></div>
                            <div class="flex justify-between"><span>총 훈련시간</span> <span id="sessionTotalHours">-</span></div>
                        </div>
                    </div>

                    <!-- Progress Card -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                         <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-bold text-slate-700">편성 현황</span>
                            <span id="progressText" class="text-[10px] font-black text-primary-600">0 / 0 시간</span>
                         </div>
                         <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div id="progressBar" class="bg-primary-500 h-full transition-all duration-500" style="width: 0%"></div>
                         </div>
                    </div>

                    <!-- Subjects Selection -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                        <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span class="font-bold text-slate-700 flex items-center gap-2">
                                <i class="fas fa-book-open text-primary-500"></i> 교과목 선택
                            </span>
                        </div>
                        <div id="subjectList" class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            <div class="text-center py-8 text-slate-400 text-xs">로딩 중...</div>
                        </div>
                    </div>
                </div>

                <!-- Right Panel: Timetable Grid -->
                <div class="flex-1 flex flex-col gap-4 min-w-0">
                    <!-- Week Navigation -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex items-center justify-between">
                        <div class="flex items-center gap-1">
                            <button onclick="prevWeek()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <div class="px-4 text-center">
                                <div id="weekText" class="font-black text-slate-800 text-lg tracking-tight">1주차</div>
                                <div id="weekRange" class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">2026-02-09 ~ 2026-02-15</div>
                            </div>
                            <button onclick="nextWeek()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="flex items-center gap-2">
                             <button onclick="copyPrevWeek()" class="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                                <i class="fas fa-copy mr-1"></i> 이전 주차 복사
                             </button>
                             <button onclick="openPeriodConfig()" class="px-3 py-2 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition">
                                <i class="fas fa-clock mr-1"></i> 교시 설정
                             </button>
                        </div>
                    </div>

                    <!-- Timetable Table -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col flex-1">
                        <div class="overflow-auto custom-scrollbar flex-1">
                            <table class="w-full border-collapse table-fixed min-w-[1200px]">
                                <thead id="timetableHeader" class="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                                    <!-- Rendered via JS -->
                                </thead>
                                <tbody id="timetableBody" class="divide-y divide-slate-100">
                                    <!-- Rendered via JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Period Config Modal -->
    <div id="periodModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-3xl w-[600px] shadow-2xl transform scale-95 transition-transform duration-300 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                <div>
                    <h3 class="text-xl font-black text-slate-800 tracking-tight">교시 시간 설정</h3>
                    <p class="text-xs text-slate-400 font-medium">훈련 교시별 시작/종료 및 휴게시간을 설정합니다.</p>
                </div>
                <button onclick="closePeriodConfig()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            <div class="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                <table class="w-full">
                    <thead>
                        <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th class="pb-3 text-left">교시</th>
                            <th class="pb-3 text-left">시작</th>
                            <th class="pb-3 text-left">종료</th>
                            <th class="pb-3 text-left">휴게(분)</th>
                            <th class="pb-3 text-right">삭제</th>
                        </tr>
                    </thead>
                    <tbody id="periodListBody" class="divide-y divide-slate-50">
                        <!-- JS Render -->
                    </tbody>
                </table>
                <button onclick="addPeriod()" class="w-full mt-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary-300 hover:text-primary-500 transition">
                    <i class="fas fa-plus-circle mr-2"></i> 교시 추가하기
                </button>
            </div>
            <div class="p-6 bg-slate-50 flex justify-end gap-3">
                <button onclick="closePeriodConfig()" class="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 transition">취소</button>
                <button onclick="savePeriodConfigs()" class="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">설정 적용</button>
            </div>
        </div>
    </div>

    <script>
        (function() {
            var sessionId = ${sessionId};
            var token = localStorage.getItem('token');
            var headers = token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
            
            var sessionInfo = null;
            var resources = { subjects: [], instructors: [] };
            var periodConfigs = [];
            var timetableData = []; // [{date, period, subject_id, instructor_id, location}]
            var currentWeekStartDate = null;
            var activeSubjectId = null;

            // Initialize
            async function init() {
                try {
                    // Load Master Data
                    var [sRes, rRes, cRes] = await Promise.all([
                        fetch('/api/course-sessions/public/' + sessionId),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/resources', { headers: headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/config', { headers: headers })
                    ]);
                    
                    var sj = await sRes.json();
                    var rj = await rRes.json();
                    var cj = await cRes.json();

                    sessionInfo = sj.data;
                    resources = rj.data;
                    periodConfigs = cj.data;

                    if (periodConfigs.length === 0) {
                        // Default periods if empty
                        periodConfigs = [
                             { period_number: 1, start_time: '19:00', end_time: '19:50', break_minute: 10 },
                             { period_number: 2, start_time: '20:00', end_time: '20:50', break_minute: 10 },
                             { period_number: 3, start_time: '21:00', end_time: '21:50', break_minute: 0 }
                        ];
                    }

                    renderResources();
                    updateSessionDisplay();
                    
                    // Set current week to session start date
                    if (sessionInfo.training_start_date) {
                        var d = new Date(sessionInfo.training_start_date);
                        // Move to Monday of that week
                        var day = d.getDay();
                        var diff = d.getDate() - day + (day === 0 ? -6 : 1);
                        currentWeekStartDate = new Date(d.setDate(diff));
                    } else {
                        currentWeekStartDate = new Date();
                    }

                    await loadTimetable();
                    renderTimetableGrid();
                } catch(e) { console.error(e); }
            }

            function updateSessionDisplay() {
                document.getElementById('sessionName').textContent = sessionInfo.course_name + (sessionInfo.session_number ? ' ' + sessionInfo.session_number + '차' : '');
                document.getElementById('sessionDateRange').textContent = sessionInfo.training_start_date + ' ~ ' + sessionInfo.training_end_date;
                document.getElementById('sessionTotalHours').textContent = (sessionInfo.total_hours || 0) + '시간';
            }

            function renderResources() {
                var html = resources.subjects.map(s => {
                    var cls = activeSubjectId === s.id ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50';
                    return '<div onclick="selectSubject(' + s.id + ')" class="p-3 border rounded-xl transition cursor-pointer group ' + cls + '">' +
                        '<div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-400 transition">' + s.classification + '</div>' +
                        '<div class="font-bold text-slate-700 text-xs leading-tight">' + s.name + '</div>' +
                        '</div>';
                }).join('');
                document.getElementById('subjectList').innerHTML = html || (
                    '<div class="text-center py-8 text-slate-400 text-xs">' +
                    '편성된 교과목이 없습니다.<br><br>' +
                    '<a href="/admin/courses/approved/register/' + sessionInfo.approved_course_id + '?tab=ncs" class="text-primary-600 font-bold hover:underline">' +
                    '<i class="fas fa-edit mr-1"></i> 교과목 편성하러 가기</a>' +
                    '</div>'
                );
            }

            window.selectSubject = function(id) {
                activeSubjectId = id;
                renderResources();
            };

            async function loadTimetable() {
                var start = currentWeekStartDate.toISOString().substring(0, 10);
                var end = new Date(currentWeekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable?start_date=' + start + '&end_date=' + end, { headers: headers });
                var json = await res.json();
                timetableData = json.data || [];
                updateProgress();
            }

            function updateProgress() {
                // In a real app, this should fetch global totals. For now, it's illustrative.
                // fetch('/api/course-sessions/' + sessionId + '/timetable/summary') ... 
                // Using dummy values for demo
                var scheduled = 0; // TBD: need a global sum API
                var total = sessionInfo.total_hours || 42;
                var pct = Math.min(100, (scheduled / total) * 100);
                document.getElementById('progressText').textContent = scheduled + ' / ' + total + ' 시간';
                document.getElementById('progressBar').style.width = pct + '%';
            }

            function getDayDate(offset) {
                var d = new Date(currentWeekStartDate.getTime() + offset * 24 * 60 * 60 * 1000);
                return d.toISOString().substring(0, 10);
            }

            function renderTimetableGrid() {
                var weekRange = getDayDate(0) + ' ~ ' + getDayDate(6);
                document.getElementById('weekRange').textContent = weekRange;
                
                var days = ['월', '화', '수', '목', '금', '토', '일'];
                
                // Header
                var headerHtml = '<tr><th class="p-4 w-40 text-left text-slate-400 text-[10px] font-black uppercase">Time / Day</th>';
                for(var i=0; i<7; i++) {
                    var date = getDayDate(i);
                    var isToday = date === new Date().toISOString().substring(0, 10);
                    var bg = isToday ? 'bg-primary-50' : '';
                    headerHtml += '<th class="p-4 text-center border-l border-slate-100 ' + bg + '">' +
                        '<div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">' + days[i] + '</div>' +
                        '<div class="font-black text-slate-800">' + date.substring(5) + '</div>' +
                        '</th>';
                }
                headerHtml += '</tr>';
                document.getElementById('timetableHeader').innerHTML = headerHtml;

                // Body
                var bodyHtml = '';
                periodConfigs.forEach(period => {
                    bodyHtml += '<tr class="group">';
                    // Time Col
                    bodyHtml += '<td class="p-4 align-top bg-slate-50/50">' +
                        '<div class="font-black text-slate-800 text-sm">' + period.period_number + '교시</div>' +
                        '<div class="text-[10px] text-slate-400 font-bold">' + period.start_time + ' ~ ' + period.end_time + '</div>' +
                        '</td>';
                    
                    for(var i=0; i<7; i++) {
                        var date = getDayDate(i);
                        var cellData = timetableData.find(t => t.training_date === date && t.period_number === period.period_number);
                        var subject = cellData ? resources.subjects.find(s => s.id === cellData.subject_id) : null;
                        var instructor = cellData ? resources.instructors.find(ins => ins.id === cellData.instructor_id) : null;

                        var content = '';
                        if (cellData && subject) {
                            content = '<div class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col justify-between group/card relative overflow-hidden">' +
                                '<div class="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>' +
                                '<div class="text-[9px] font-black text-primary-500 uppercase tracking-tighter mb-1">' + subject.classification + '</div>' +
                                '<div class="font-bold text-slate-800 text-xs mb-2 line-clamp-2 leading-tight">' + subject.name + '</div>' +
                                '<div class="flex items-center justify-between mt-auto">' +
                                    '<span class="text-[9px] text-slate-400 font-medium"><i class="fas fa-user-tie mr-1"></i>' + (instructor ? instructor.name : '미배정') + '</span>' +
                                    '<button onclick="removeCell(\''+date+'\','+period.period_number+')" class="w-5 h-5 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition opacity-0 group-hover/card:opacity-100"><i class="fas fa-times text-[8px]"></i></button>' +
                                '</div>' +
                                '</div>';
                        } else {
                            content = '<div onclick="assignCell(\''+date+'\','+period.period_number+')" class="h-20 border border-dashed border-slate-100 rounded-xl hover:border-primary-300 hover:bg-primary-50/30 transition-all flex items-center justify-center cursor-pointer group/add">' +
                                '<i class="fas fa-plus text-slate-100 group-hover/add:text-primary-300 transition text-lg"></i>' +
                                '</div>';
                        }

                        bodyHtml += '<td class="p-2 border-l border-slate-100 align-top">' + content + '</td>';
                    }
                    bodyHtml += '</tr>';
                });
                document.getElementById('timetableBody').innerHTML = bodyHtml;
            }

            window.assignCell = function(date, periodNum) {
                if (!activeSubjectId) {
                    alert('좌측에서 교과목을 먼저 선택해 주세요.');
                    return;
                }
                var existingIdx = timetableData.findIndex(t => t.training_date === date && t.period_number === periodNum);
                var newData = {
                    training_date: date,
                    period_number: periodNum,
                    subject_id: activeSubjectId,
                    instructor_id: sessionInfo.instructor_id || null, // Default to session instructor
                    location: sessionInfo.location || ''
                };

                if (existingIdx >= 0) timetableData[existingIdx] = newData;
                else timetableData.push(newData);

                renderTimetableGrid();
            };

            window.removeCell = function(date, periodNum) {
                timetableData = timetableData.filter(t => !(t.training_date === date && t.period_number === periodNum));
                renderTimetableGrid();
            };

            window.prevWeek = async function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
                await loadTimetable();
                renderTimetableGrid();
            };

            window.nextWeek = async function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
                await loadTimetable();
                renderTimetableGrid();
            };

            // Modal & Config
            window.openPeriodConfig = function() {
                var m = document.getElementById('periodModal');
                m.classList.remove('hidden');
                setTimeout(() => { m.classList.add('opacity-100'); m.firstElementChild.classList.remove('scale-95'); }, 10);
                renderPeriodList();
            };

            window.closePeriodConfig = function() {
                var m = document.getElementById('periodModal');
                m.classList.remove('opacity-100');
                m.firstElementChild.classList.add('scale-95');
                setTimeout(() => m.classList.add('hidden'), 300);
            };

            function renderPeriodList() {
                var tbody = document.getElementById('periodListBody');
                tbody.innerHTML = periodConfigs.sort((a,b)=>a.period_number - b.period_number).map((p, idx) => {
                    return '<tr>' +
                        '<td class="py-3 font-bold text-slate-700">' + p.period_number + '교시</td>' +
                        '<td class="py-3"><input type="time" value="' + p.start_time + '" onchange="updatePeriod('+idx+',\'start_time\',this.value)" class="bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 font-bold text-xs"></td>' +
                        '<td class="py-3"><input type="time" value="' + p.end_time + '" onchange="updatePeriod('+idx+',\'end_time\',this.value)" class="bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 font-bold text-xs"></td>' +
                        '<td class="py-3"><input type="number" value="' + p.break_minute + '" onchange="updatePeriod('+idx+',\'break_minute\',this.value)" class="w-16 bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 font-bold text-xs"></td>' +
                        '<td class="py-3 text-right"><button onclick="deletePeriod('+idx+')" class="text-slate-300 hover:text-red-500 transition"><i class="fas fa-trash-alt"></i></button></td>' +
                        '</tr>';
                }).join('');
            }

            window.addPeriod = function() {
                var max = periodConfigs.length > 0 ? Math.max(...periodConfigs.map(p => p.period_number)) : 0;
                periodConfigs.push({ period_number: max + 1, start_time: '09:00', end_time: '09:50', break_minute: 10 });
                renderPeriodList();
            };

            window.updatePeriod = function(idx, field, val) {
                periodConfigs[idx][field] = field === 'break_minute' ? parseInt(val, 10) : val;
            };

            window.deletePeriod = function(idx) {
                periodConfigs.splice(idx, 1);
                renderPeriodList();
            };

            window.savePeriodConfigs = async function() {
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable/config', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ configs: periodConfigs })
                });
                var json = await res.json();
                if (json.success) {
                    closePeriodConfig();
                    renderTimetableGrid();
                } else alert(json.error);
            };

            window.saveAll = async function() {
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ schedules: timetableData })
                });
                var json = await res.json();
                if (json.success) alert('시간표가 저장되었습니다.');
                else alert(json.error);
            };

            window.copyPrevWeek = async function() {
                if (!confirm('지난 주차의 시간표를 현재 주차로 복사하시겠습니까? (현재 데이터는 덮어씌워집니다)')) return;
                
                var prevStart = new Date(currentWeekStartDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
                var prevEnd = new Date(currentWeekStartDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
                
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable?start_date=' + prevStart + '&end_date=' + prevEnd, { headers: headers });
                var json = await res.json();
                var prevData = json.data || [];
                
                if (prevData.length === 0) {
                    alert('복사할 이전 주차의 데이터가 없습니다.');
                    return;
                }

                // Map to current week
                var newWeekData = [];
                prevData.forEach(p => {
                    var d = new Date(p.training_date);
                    d.setDate(d.getDate() + 7);
                    newWeekData.push({
                         ...p,
                         id: undefined,
                         training_date: d.toISOString().substring(0, 10)
                    });
                });

                // Update local storage and DB
                timetableData = timetableData.filter(t => {
                   var d = new Date(t.training_date);
                   return d < currentWeekStartDate || d >= new Date(currentWeekStartDate.getTime() + 7*24*60*60*1000);
                }).concat(newWeekData);

                renderTimetableGrid();
                alert('복사되었습니다. [저장하기]를 눌러 최종 반영하세요.');
            };

            init();
        })();
    </script>
</body>
</html>
    `;
}
