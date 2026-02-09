import { hrdSidebar } from './components/hrd_sidebar';

/**
 * 회차별 시간표 편성 화면
 */
export function adminSessionTimetableHtml(sessionId: number): string {
    const sidebar = hrdSidebar('courses');

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
        body { font-family: 'Pretendard', 'Malgun Gothic', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
                <div class="flex items-center gap-4">
                    <h1 class="text-lg font-bold text-slate-800">3. 시간표 편성</h1>
                    <nav class="hidden sm:flex items-center text-xs text-slate-500 gap-2">
                        <span>HOME</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span>과정 / NCS 훈련과정</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span class="font-bold text-slate-700">3. 시간표 편성</span>
                    </nav>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="saveAll()" class="inline-flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded shadow-lg hover:bg-red-600 transition font-bold text-xs">
                        진행 상황 한눈에 보기
                    </button>
                    <button onclick="saveAll()" class="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded shadow-lg hover:bg-primary-700 transition font-bold text-xs ml-2">
                        <i class="fas fa-save"></i> 저장하기
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-auto p-6 bg-slate-50 custom-scrollbar">
                <!-- Top Info Section -->
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- Title & Tabs -->
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <i class="fas fa-cube"></i> NCS 회차별 훈련과정 - 3.시간표 편성
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800 mb-4">과정명 : <span id="sessionName" class="text-slate-900"></span></h2>
                        <div class="flex justify-center gap-2 mb-6">
                            <button class="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-600 transition">회차별 개설과정 상세보기</button>
                            <button class="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-600 transition">NCS 훈련과정 개설정보</button>
                            <button class="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-600 transition">교수계획서 실행</button>
                            <button class="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-600 transition">세부교수계획서 실행</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-6">
                        <!-- Left Navigation -->
                        <div class="col-span-2 space-y-1">
                            <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <a href="#" class="block px-4 py-3 text-slate-500 text-sm font-medium hover:bg-slate-50 border-b border-slate-100">1. 평가·교수학습 방법</a>
                                <a href="#" class="block px-4 py-3 text-slate-500 text-sm font-medium hover:bg-slate-50 border-b border-slate-100">2. 시설,장비</a>
                                <a href="#" class="block px-4 py-3 bg-white text-primary-600 font-bold border-l-4 border-l-primary-500">3. 시간표 편성</a>
                            </div>
                        </div>

                        <!-- Main Content Area -->
                        <div class="col-span-10 space-y-6">
                            <!-- Basic Info Box -->
                            <div class="bg-white rounded-lg border border-slate-200 p-6 text-center">
                                <h3 class="text-lg font-bold text-slate-700 mb-2">시간표 편성</h3>
                                <p class="text-xs text-slate-500 mb-6">훈련기간 및 교과목운영로드맵과 훈련교시 내용으로 시간표를 편성합니다.</p>
                                
                                <div class="bg-slate-50 rounded-lg p-6 border border-slate-100">
                                    <h4 class="font-bold text-slate-700 mb-4">훈련과정 운영 기본정보</h4>
                                    <div class="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-left max-w-2xl mx-auto">
                                        <div class="flex justify-between border-b border-slate-200 pb-2">
                                            <span class="font-bold text-slate-600">총 훈련일수</span>
                                            <span id="totalDays" class="text-slate-800 font-medium">-일</span>
                                        </div>
                                        <div class="flex justify-between border-b border-slate-200 pb-2">
                                            <span class="font-bold text-slate-600">총 훈련시간</span>
                                            <span id="sessionTotalHours" class="text-slate-800 font-medium">-시간</span>
                                        </div>
                                        <div class="flex justify-between border-b border-slate-200 pb-2">
                                            <span class="font-bold text-slate-600">훈련기간</span>
                                            <span id="sessionDateRange" class="text-slate-800 font-medium">-</span>
                                        </div>
                                        <div class="flex justify-between border-b border-slate-200 pb-2">
                                            <span class="font-bold text-slate-600">하루 훈련시간</span>
                                            <span id="dailyTrainingHours" class="text-slate-800 font-medium">-</span>
                                        </div>
                                        <div class="col-span-2 flex justify-between border-b border-slate-200 pb-2">
                                            <span class="font-bold text-slate-600">요일</span>
                                            <span class="text-slate-800 font-medium">월요일,화요일,수요일,목요일,금요일</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Subject Selection & Unit Selection -->
                            <div class="grid grid-cols-2 gap-6">
                                <!-- Subjects -->
                                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                                    <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 text-center">
                                        <h4 class="font-bold text-slate-700">교과목선택</h4>
                                        <p class="text-[10px] text-slate-500">각 교과목은 선택해주세요.</p>
                                    </div>
                                    <div id="subjectList" class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        <div class="text-center py-10 text-slate-400">Loading...</div>
                                    </div>
                                </div>
                                <!-- Units (Placeholder) -->
                                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                                    <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 text-center">
                                        <h4 class="font-bold text-slate-700">단원 요소 선택</h4>
                                        <p class="text-[10px] text-slate-500">클릭된 단원 요소를 선택해주세요.</p>
                                    </div>
                                    <div class="flex-1 flex items-center justify-center text-slate-300 text-xs">
                                        단원목록의 단원을 선택해주세요.
                                    </div>
                                </div>
                            </div>

                            <!-- Timetable Grid Section -->
                            <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-6 overflow-hidden">
                                <div class="text-center mb-6">
                                    <div class="text-2xl font-bold text-primary-600 mb-1">
                                        <span id="currentHours">0</span> / <span id="targetHours">42.0</span> 시간
                                    </div>
                                    <div class="text-xs text-slate-500">총 훈련시간 / 적용된 훈련시간입니다.</div>
                                    
                                    <div class="flex items-center justify-center gap-4 mt-4">
                                        <button onclick="prevWeek()" class="bg-primary-600 text-white w-8 h-8 rounded hover:bg-primary-700 transition"><i class="fas fa-chevron-left"></i></button>
                                        <div class="w-48 border border-slate-300 rounded px-4 py-2 text-sm font-bold bg-white flex items-center justify-between">
                                            <span id="weekText">1주차</span>
                                            <i class="fas fa-chevron-down text-slate-400"></i>
                                        </div>
                                        <button onclick="nextWeek()" class="bg-primary-600 text-white w-8 h-8 rounded hover:bg-primary-700 transition"><i class="fas fa-chevron-right"></i></button>
                                    </div>
                                    <div class="mt-2 text-xs text-red-500 font-bold">
                                        1. 각 교시시간은 시작시간 + 종료시간 + 휴식시간 포함하여 계산됩니다.<br>
                                        2. 교시는 단계별로 설정해주셔야 합니다. ex) 1교시, 3교시... (2교시 에러 발생)
                                    </div>
                                </div>

                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse min-w-[1000px]">
                                        <thead id="timetableHeader" class="bg-slate-50 border-y border-slate-200">
                                            <!-- Rendered via JS -->
                                        </thead>
                                        <tbody id="timetableBody" class="divide-y divide-slate-200">
                                            <!-- Rendered via JS -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Edit Period Config Modal (Hidden but functional) -->
    <div id="periodEditModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
             <h3 class="font-bold text-lg mb-4">교시 시간 설정</h3>
             <div class="space-y-4">
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">시작 시간</label>
                     <input type="time" id="editStartTime" class="w-full border rounded px-3 py-2">
                 </div>
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">종료 시간</label>
                     <input type="time" id="editEndTime" class="w-full border rounded px-3 py-2">
                 </div>
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">휴식 시간 (분)</label>
                     <input type="number" id="editBreakTime" class="w-full border rounded px-3 py-2">
                 </div>
             </div>
             <div class="mt-6 flex justify-end gap-2">
                 <button onclick="closePeriodEdit()" class="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded">취소</button>
                 <button onclick="savePeriodEdit()" class="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded hover:bg-primary-700">저장</button>
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
            var timetableData = [];
            var currentWeekStartDate = null;
            var activeSubjectId = null;
            var activePeriodConfigIdx = null; // For editing

            async function init() {
                try {
                    // Load Data
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
                        // Default to 8 periods (09:00 - 17:50) with lunch break (13:00-14:00)
                        periodConfigs = [
                             { period_number: 1, start_time: '09:00', end_time: '09:50', break_minute: 10 },
                             { period_number: 2, start_time: '10:00', end_time: '10:50', break_minute: 10 },
                             { period_number: 3, start_time: '11:00', end_time: '11:50', break_minute: 10 },
                             { period_number: 4, start_time: '12:00', end_time: '12:50', break_minute: 0 }, // Lunch start after this
                             // Lunch 13:00 - 14:00 (Break included in schedule logic or just gap?)
                             // Typically 12:50 + 10min break = 13:00. 13:00-14:00 Lunch. 
                             // So Period 5 starts at 14:00.
                             { period_number: 5, start_time: '14:00', end_time: '14:50', break_minute: 10 },
                             { period_number: 6, start_time: '15:00', end_time: '15:50', break_minute: 10 },
                             { period_number: 7, start_time: '16:00', end_time: '16:50', break_minute: 10 },
                             { period_number: 8, start_time: '17:00', end_time: '17:50', break_minute: 0 }
                        ];
                        // Auto-save default config to DB for persistence
                        fetch('/api/course-sessions/' + sessionId + '/timetable/config', {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({ configs: periodConfigs })
                        });
                    }

                    renderResources();
                    updateSessionDisplay();
                    
                    if (sessionInfo.training_start_date) {
                        var d = new Date(sessionInfo.training_start_date);
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
                document.getElementById('sessionName').textContent = sessionInfo.course_name + (sessionInfo.session_number ? \` [\${sessionInfo.session_number}차]\` : '');
                document.getElementById('sessionDateRange').textContent = sessionInfo.training_start_date + ' ~ ' + sessionInfo.training_end_date;
                document.getElementById('sessionTotalHours').textContent = (sessionInfo.total_hours || 0) + '시간';
                document.getElementById('targetHours').textContent = (sessionInfo.total_hours || 42).toFixed(1);

                // Calculate total days
                if (sessionInfo.training_start_date && sessionInfo.training_end_date) {
                    var start = new Date(sessionInfo.training_start_date);
                    var end = new Date(sessionInfo.training_end_date);
                    var diffTime = Math.abs(end - start);
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                    document.getElementById('totalDays').textContent = diffDays + '일';
                }

                // Daily hours estimation (simple)
                if (periodConfigs.length > 0) {
                     var start = periodConfigs[0].start_time;
                     var end = periodConfigs[periodConfigs.length-1].end_time;
                     document.getElementById('dailyTrainingHours').textContent = \`\${start} ~ \${end}\`;
                }
            }

            function renderResources() {
                var html = resources.subjects.map(s => {
                    var isActive = activeSubjectId === s.id;
                    var cls = isActive 
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
                        : 'border-slate-200 hover:border-primary-400 bg-white';
                    
                    return \`<div onclick="selectSubject(\${s.id})" class="p-4 border rounded-lg cursor-pointer transition group \${cls}">
                        <div class="text-center">
                            <div class="font-bold text-slate-800 text-sm mb-1">\${s.name}</div>
                            <div class="text-[10px] \${isActive ? 'text-red-500 font-bold' : 'text-slate-400'}">(교과목 설정 시간: 0 / 적용 시간: 0)</div>
                        </div>
                    </div>\`;
                }).join('');
                document.getElementById('subjectList').innerHTML = html || '<div class="text-center py-8 text-slate-400 text-xs text-red-500">편성된 교과목이 없습니다.<br>NCS 정보 등록에서 교과목을 편성해주세요.</div>';
            }

            window.selectSubject = function(id) {
                activeSubjectId = activeSubjectId === id ? null : id;
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
                // simple calculation based on loaded data (should be global ideally)
                var current = timetableData.length; // Assume 1 hour per cell roughly for demo
                document.getElementById('currentHours').textContent = current; 
            }

            function getDayDate(offset) {
                var d = new Date(currentWeekStartDate.getTime() + offset * 24 * 60 * 60 * 1000);
                return d.toISOString().substring(0, 10);
            }

            function getDayName(dateStr) {
                var days = ['일', '월', '화', '수', '목', '금', '토'];
                var d = new Date(dateStr);
                return days[d.getDay()];
            }

            function renderTimetableGrid() {
                var weekRange = getDayDate(0) + ' ~ ' + getDayDate(6);
                
                // Header
                var headerHtml = '<tr><th class="p-3 w-40 text-center text-slate-600 text-xs font-bold bg-slate-100 border-r border-slate-200">교시</th>';
                for(var i=0; i<7; i++) {
                    var date = getDayDate(i);
                    var dayName = getDayName(date);
                    var isToday = date === new Date().toISOString().substring(0, 10);
                    var style = '';
                    if (dayName === '토') style = 'text-blue-500';
                    if (dayName === '일') style = 'text-red-500';
                    
                    headerHtml += \`<th class="p-3 text-center border-l border-slate-200 min-w-[140px] \${isToday ? 'bg-amber-50' : 'bg-white'}">
                        <div class="flex items-center justify-center gap-1">
                            <i class="fas fa-check-square text-emerald-500"></i>
                            <span class="font-bold text-sm \${style}">\${date.substring(5)}(\${dayName})</span>
                        </div>
                    </th>\`;
                }
                headerHtml += '</tr>';
                document.getElementById('timetableHeader').innerHTML = headerHtml;

                // Body
                var bodyHtml = '';
                periodConfigs.forEach(function(period, idx) {
                    bodyHtml += '<tr class="border-b border-slate-200">';
                    
                    // Period Config Cell
                    bodyHtml += \`<td class="p-0 align-top border-r border-slate-200 bg-slate-50">
                        <div class="p-3 border-b border-slate-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">\${period.period_number}교시</span>
                                <span class="text-xs text-slate-400">미등록</span>
                            </div>
                            <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-0">
                        </div>
                        <div class="p-2 space-y-1">
                            <button onclick="editPeriod(\${idx})" class="w-full flex items-center justify-between px-2 py-1.5 bg-white border border-slate-200 rounded hover:border-primary-300 text-xs text-slate-600 group transition">
                                <span class="font-bold"><i class="far fa-clock mr-1 text-slate-400"></i> 시작</span>
                                <span class="group-hover:text-primary-600">\${period.start_time}</span>
                            </button>
                            <button onclick="editPeriod(\${idx})" class="w-full flex items-center justify-between px-2 py-1.5 bg-white border border-slate-200 rounded hover:border-primary-300 text-xs text-slate-600 group transition">
                                <span class="font-bold"><i class="far fa-clock mr-1 text-slate-400"></i> 종료</span>
                                <span class="group-hover:text-red-500">\${period.end_time}</span>
                            </button>
                            <button onclick="editPeriod(\${idx})" class="w-full flex items-center justify-between px-2 py-1.5 bg-white border border-slate-200 rounded hover:border-primary-300 text-xs text-slate-600 group transition">
                                <span class="font-bold"><i class="fas fa-couch mr-1 text-slate-400"></i> 휴식</span>
                                <span class="group-hover:text-amber-500">\${period.break_minute} <span class="text-[9px] font-normal">▼</span></span>
                            </button>
                        </div>
                    </td>\`;
                    
                    // Days Cells
                    for(var i=0; i<7; i++) {
                        var date = getDayDate(i);
                        var cellData = timetableData.find(t => t.training_date === date && t.period_number === period.period_number);
                        var subject = cellData ? resources.subjects.find(s => s.id === cellData.subject_id) : null;
                        var instructor = cellData ? resources.instructors.find(ins => ins.id === cellData.instructor_id) : null;
                        var location = cellData && cellData.location ? cellData.location : (sessionInfo.location || '제1 강의실');
                        
                        var content = '';
                        if (cellData && subject) {
                            var instructorName = instructor ? instructor.name : (sessionInfo.instructor_name || '미배정');
                            content = \`<div class="h-full flex flex-col items-center justify-center text-center p-2 relative group cursor-pointer hover:bg-slate-50 transition">
                                <div class="font-bold text-slate-700 text-xs mb-1 line-clamp-2" title="\${subject.name}">\${subject.name}</div>
                                <div class="text-[10px] text-slate-400 font-medium mb-1">&lt;\${instructorName}&gt;</div>
                                <div class="text-[10px] text-slate-400">(\${location})</div>
                                <button onclick="removeCell(event, '\${date}', \${period.period_number})" class="mt-2 text-white bg-red-400 hover:bg-red-500 text-[10px] font-bold px-3 py-1 rounded w-full opacity-80 hover:opacity-100 transition shadow-sm">삭제 -</button>
                            </div>\`;
                        } else {
                            content = \`<div onclick="assignCell('\${date}', \${period.period_number})" class="h-32 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition group">
                                <!-- Ghost element for hover effect -->
                            </div>\`;
                        }

                        bodyHtml += \`<td class="p-0 border-l border-slate-100 align-top relative">\${content}</td>\`;
                    }
                    bodyHtml += '</tr>';
                });
                document.getElementById('timetableBody').innerHTML = bodyHtml;
            }

            window.assignCell = function(date, periodNum) {
                if (!activeSubjectId) {
                    alert('좌측 [교과목 선택] 목록에서 배정할 과목을 먼저 선택해주세요.');
                    return;
                }
                var existingIdx = timetableData.findIndex(t => t.training_date === date && t.period_number === periodNum);
                var newData = {
                    training_date: date,
                    period_number: periodNum,
                    subject_id: activeSubjectId,
                    instructor_id: sessionInfo.instructor_id || null, 
                    location: sessionInfo.location || '제1 강의실',
                    is_excluded: 0
                };

                if (existingIdx >= 0) timetableData[existingIdx] = newData;
                else timetableData.push(newData);

                renderTimetableGrid();
                updateProgress();
            };

            window.removeCell = function(e, date, periodNum) {
                e.stopPropagation();
                if (!confirm('배정된 과목을 삭제하시겠습니까?')) return;
                timetableData = timetableData.filter(t => !(t.training_date === date && t.period_number === periodNum));
                renderTimetableGrid();
                updateProgress();
            };

            window.prevWeek = async function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
                var weekNum = parseInt(document.getElementById('weekText').textContent) || 1;
                document.getElementById('weekText').textContent = Math.max(1, weekNum - 1) + '주차';
                await loadTimetable();
                renderTimetableGrid();
            };

            window.nextWeek = async function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
                var weekNum = parseInt(document.getElementById('weekText').textContent) || 1;
                document.getElementById('weekText').textContent = (weekNum + 1) + '주차';
                await loadTimetable();
                renderTimetableGrid();
            };

            window.saveAll = async function() {
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ schedules: timetableData })
                });
                var json = await res.json();
                if (json.success) alert('시간표가 저장되었습니다.');
                else alert(json.error || '저장 실패');
            };

            // Period Config Editing
            window.editPeriod = function(idx) {
                activePeriodConfigIdx = idx;
                var p = periodConfigs[idx];
                document.getElementById('editStartTime').value = p.start_time;
                document.getElementById('editEndTime').value = p.end_time;
                document.getElementById('editBreakTime').value = p.break_minute;
                
                var modal = document.getElementById('periodEditModal');
                modal.classList.remove('hidden');
            };
            
            window.closePeriodEdit = function() {
                document.getElementById('periodEditModal').classList.add('hidden');
                activePeriodConfigIdx = null;
            };

            window.savePeriodEdit = async function() {
                if (activePeriodConfigIdx === null) return;
                
                var p = periodConfigs[activePeriodConfigIdx];
                p.start_time = document.getElementById('editStartTime').value;
                p.end_time = document.getElementById('editEndTime').value;
                p.break_minute = parseInt(document.getElementById('editBreakTime').value) || 0;
                
                // Save immediately
                var res = await fetch('/api/course-sessions/' + sessionId + '/timetable/config', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ configs: periodConfigs })
                });
                
                if ((await res.json()).success) {
                    closePeriodEdit();
                    renderTimetableGrid();
                } else {
                    alert('설정 저장 실패');
                }
            };

            init();
        })();
    </script>
</body>
</html>
    `;
}
