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
        .timetable-cell:hover { background-color: #f1f5f9; cursor: pointer; }
        .timetable-cell.selected { border: 2px solid #0ea5e9; }
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
                    <button onclick="showStatus()" class="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded shadow hover:bg-slate-700 transition font-bold text-xs">
                        <i class="fas fa-chart-bar"></i> 진행 상황
                    </button>
                    <button onclick="window.open('/admin/courses/sessions/'+sessionId+'/timetable/print', '_blank')" class="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded shadow hover:bg-slate-700 transition font-bold text-xs ml-2">
                        <i class="fas fa-print"></i> 훈련세부시간표 출력
                    </button>
                    <button onclick="saveAll()" class="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded shadow-lg hover:bg-primary-700 transition font-bold text-xs ml-2">
                        <i class="fas fa-save"></i> 저장하기
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-auto p-6 bg-slate-50 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- Title & Session Info -->
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-bold text-slate-800 mb-2">과정명 : <span id="sessionName" class="text-slate-900">Loading...</span></h2>
                        <div class="flex justify-center gap-2 mb-6">
                           <!-- Buttons for navigation or action -->
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-6">
                        <!-- Left Navigation -->
                        <div class="col-span-2 space-y-1">
                            <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <a href="#" class="block px-4 py-3 text-slate-500 text-sm font-medium hover:bg-slate-50 border-b border-slate-100">1. 평가·교수학습 방법</a>
                                <a href="#" class="block px-4 py-3 text-slate-500 text-sm font-medium hover:bg-slate-50 border-b border-slate-100">2. 시설,장비</a>
                                <div class="block px-4 py-3 bg-primary-50 text-primary-700 font-bold border-l-4 border-l-primary-500">3. 시간표 편성</div>
                            </div>
                        </div>

                        <!-- Main Content Area -->
                        <div class="col-span-10 space-y-6">
                            <!-- Basic Info Box -->
                            <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                                <h3 class="text-lg font-bold text-slate-700 mb-4 border-b pb-2">훈련과정 운영 기본정보</h3>
                                <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    <div class="flex justify-between border-b border-slate-100 pb-1">
                                        <span class="font-bold text-slate-500">총 훈련일수</span>
                                        <span id="totalDays" class="font-medium">-일</span>
                                    </div>
                                    <div class="flex justify-between border-b border-slate-100 pb-1">
                                        <span class="font-bold text-slate-500">총 훈련시간</span>
                                        <span id="sessionTotalHours" class="font-medium">-시간</span>
                                    </div>
                                    <div class="flex justify-between border-b border-slate-100 pb-1">
                                        <span class="font-bold text-slate-500">훈련기간</span>
                                        <span id="sessionDateRange" class="font-medium">-</span>
                                    </div>
                                    <div class="flex justify-between border-b border-slate-100 pb-1">
                                        <span class="font-bold text-slate-500">하루 훈련시간</span>
                                        <span id="dailyTrainingHours" class="font-medium">-</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Resource Selection -->
                            <div class="grid grid-cols-2 gap-6 h-[500px]">
                                <!-- Subjects -->
                                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                                    <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                        <h4 class="font-bold text-slate-700">교과목 선택</h4>
                                        <span class="text-[10px] text-slate-400">클릭하여 선택 후 시간표에 배정</span>
                                    </div>
                                    <div id="subjectList" class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative">
                                        <div class="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">Loading...</div>
                                    </div>
                                </div>
                                <!-- Instructors -->
                                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                                    <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col gap-2">
                                        <div class="flex justify-between items-center">
                                            <h4 class="font-bold text-slate-700">담당 강사/교수 선택</h4>
                                            <label class="flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" onchange="toggleAllInstructors(this.checked)" class="rounded text-primary-600 focus:ring-primary-500 w-3 h-3">
                                                <span class="text-[10px] text-slate-500">전체 보기</span>
                                            </label>
                                        </div>
                                        <input type="text" placeholder="이름으로 검색..." onkeyup="filterInstructors(this.value)" class="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-primary-500">
                                    </div>
                                    <div id="instructorList" class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative">
                                        <div class="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">Loading...</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Timetable Grid -->
                            <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <div class="flex flex-col items-center mb-6 gap-2">
                                    <div class="text-3xl font-bold text-primary-600">
                                        <span id="currentHours">0</span> / <span id="targetHours">--</span> <span class="text-lg text-slate-400 font-normal">시간</span>
                                    </div>
                                    <div class="flex items-center gap-4 mt-2">
                                        <button onclick="prevWeek()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"><i class="fas fa-chevron-left text-slate-500"></i></button>
                                        <div class="px-4 py-1 bg-slate-100 rounded text-slate-700 font-bold" id="weekText">1주차</div>
                                        <button onclick="nextWeek()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"><i class="fas fa-chevron-right text-slate-500"></i></button>
                                    </div>
                                </div>

                                <div class="overflow-x-auto custom-scrollbar pb-2">
                                    <table class="w-full min-w-[1000px] border-collapse relative">
                                        <thead id="timetableHeader" class="bg-slate-50 border-y border-slate-200 sticky top-0 z-10"></thead>
                                        <tbody id="timetableBody" class="divide-y divide-slate-100"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Edit Period Config Modal -->
    <div id="periodEditModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 opacity-0">
        <div class="bg-white rounded-xl p-6 w-80 shadow-2xl transform transition-transform duration-300 scale-95">
             <h3 class="font-bold text-lg mb-4 text-slate-800">교시 시간 설정</h3>
             <div class="space-y-4">
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">시작 시간</label>
                     <input type="time" id="editStartTime" class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                 </div>
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">종료 시간</label>
                     <input type="time" id="editEndTime" class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                 </div>
                 <div>
                     <label class="block text-xs font-bold text-slate-500 mb-1">휴식 시간 (분)</label>
                     <input type="number" id="editBreakTime" class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                 </div>
             </div>
             <div class="mt-6 flex justify-end gap-2">
                 <button onclick="closePeriodEdit()" class="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded transition">취소</button>
                 <button onclick="savePeriodEdit()" class="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded hover:bg-primary-700 shadow transition">저장</button>
             </div>
        </div>
    </div>

    <!-- Toast/Notification -->
    <div id="toast" class="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded shadow-lg transform translate-y-20 transition-transform duration-300 z-50 text-sm font-medium">
        알림 메시지
    </div>

    <script>
        (function() {
            var sessionId = ${sessionId};
            var token = localStorage.getItem('token');
            var headers = token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
            
            var sessionInfo = {};
            var resources = { subjects: [], instructors: [] };
            var periodConfigs = [];
            var timetableData = [];
            var currentWeekStartDate = new Date();
            var activeSubjectId = null;
            var activeInstructorId = null;
            var activePeriodConfigIdx = null;
            var instructorSearchTerm = '';
            var showAllInstructors = false;

            // Initialize
            init();

            // ... (skip unchanged functions) ...
            
            window.toggleAllInstructors = function(checked) {
                showAllInstructors = checked;
                renderResources();
            }

            async function init() {
                try {
                    // Fetch all required data in parallel
                    const [sRes, rRes, cRes] = await Promise.allSettled([
                        fetch('/api/course-sessions/public/' + sessionId),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/resources', { headers: headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/config', { headers: headers })
                    ]);

                    // Handle Session Info
                    if (sRes.status === 'fulfilled' && sRes.value.ok) {
                        const sj = await sRes.value.json();
                        sessionInfo = sj.data || {};
                    } else {
                        showToast('훈련과정 정보를 불러오는데 실패했습니다.', true);
                    }

                    // Handle Resources
                    if (rRes.status === 'fulfilled' && rRes.value.ok) {
                        const rj = await rRes.value.json();
                        resources = rj.data || { subjects: [], instructors: [] };
                        // Ensure lists are arrays
                        if(!Array.isArray(resources.subjects)) resources.subjects = [];
                        if(!Array.isArray(resources.instructors)) resources.instructors = [];
                    } else {
                        console.error('Resources fetch failed', rRes);
                        resources = { subjects: [], instructors: [] };
                        showToast('교과목/강사 리스트를 불러오지 못했습니다.', true);
                    }

                    // Handle Config
                    if (cRes.status === 'fulfilled' && cRes.value.ok) {
                        const cj = await cRes.value.json();
                        periodConfigs = cj.data || [];
                    } else {
                         // Default fallback if fetch fails or first time
                        periodConfigs = [];
                    }

                    // Default Config Logic (if empty)
                    if (periodConfigs.length === 0) {
                        periodConfigs = [
                             { period_number: 1, start_time: '09:00', end_time: '09:50', break_minute: 10 },
                             { period_number: 2, start_time: '10:00', end_time: '10:50', break_minute: 10 },
                             { period_number: 3, start_time: '11:00', end_time: '11:50', break_minute: 10 },
                             { period_number: 4, start_time: '12:00', end_time: '12:50', break_minute: 0 },
                             { period_number: 5, start_time: '14:00', end_time: '14:50', break_minute: 10 },
                             { period_number: 6, start_time: '15:00', end_time: '15:50', break_minute: 10 },
                             { period_number: 7, start_time: '16:00', end_time: '16:50', break_minute: 10 },
                             { period_number: 8, start_time: '17:00', end_time: '17:50', break_minute: 0 }
                        ];
                        // Save default config
                        savePeriodConfig(periodConfigs, true);
                    }

                    // Render Initial State
                    renderSessionInfo();
                    renderResources();
                    
                    // Set Start Date
                    if (sessionInfo.training_start_date) {
                        var d = new Date(sessionInfo.training_start_date);
                        var day = d.getDay();
                        // Adjust to Monday
                        var diff = d.getDate() - day + (day === 0 ? -6 : 1); 
                        currentWeekStartDate = new Date(d.setDate(diff));
                    }

                    // Load Timetable Data
                    await loadTimetable();
                    renderTimetableGrid();

                } catch (e) {
                    console.error('Init error:', e);
                    showToast('심각한 오류가 발생했습니다. 새로고침해주세요.', true);
                }
            }

            // --- Fetch & Save Logic ---
            
            async function loadTimetable() {
                try {
                    // Load for current view range (or all session for simplicity)
                    // Currently loading ALL for session
                    const res = await fetch('/api/course-sessions/' + sessionId + '/timetable', { headers: headers });
                    if(res.ok) {
                        const json = await res.json();
                        timetableData = json.data || [];
                    }
                } catch(e) { console.error(e); }
            }

            window.saveAll = async function() {
                try {
                    // Send entire timetableData for now, or just changes?
                    // Currently logic handles bulk upsert
                    const res = await fetch('/api/course-sessions/' + sessionId + '/timetable', {
                        method: 'POST', 
                        headers: headers,
                        body: JSON.stringify({ schedules: timetableData })
                    });
                    if(res.ok) {
                        showToast('시간표가 성공적으로 저장되었습니다.');
                    } else {
                        showToast('저장에 실패했습니다.', true);
                    }
                } catch(e) {
                    showToast('저장 중 오류 발생', true);
                }
            }

            async function savePeriodConfig(configs, silent) {
                try {
                    await fetch('/api/course-sessions/' + sessionId + '/timetable/config', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ configs: configs })
                    });
                    if(!silent) showToast('교시 설정이 저장되었습니다.');
                } catch(e) { console.error(e); }
            }

            // --- Rendering Logic ---

            function renderSessionInfo() {
                document.getElementById('sessionName').textContent = (sessionInfo.course_name || '미지정 과정') + (sessionInfo.session_number ? \` [\${sessionInfo.session_number}차]\` : '');
                document.getElementById('sessionDateRange').textContent = (sessionInfo.training_start_date || '-') + ' ~ ' + (sessionInfo.training_end_date || '-');
                document.getElementById('sessionTotalHours').textContent = (sessionInfo.total_hours || 0) + '시간';
                document.getElementById('targetHours').textContent = (sessionInfo.total_hours || 42).toFixed(1);

                if (sessionInfo.training_start_date && sessionInfo.training_end_date) {
                    var s = new Date(sessionInfo.training_start_date);
                    var e = new Date(sessionInfo.training_end_date);
                    var diff = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
                    document.getElementById('totalDays').textContent = diff + '일';
                }

                if (periodConfigs.length > 0) {
                     document.getElementById('dailyTrainingHours').textContent = \`\${periodConfigs[0].start_time} ~ \${periodConfigs[periodConfigs.length-1].end_time}\`;
                }

                // Initial Highlight for instructor search if single instructor assigned
                if (!instructorSearchTerm && sessionInfo.instructor_name && resources.instructors.length > 0) {
                    // Optional: Pre-fill search? No, just highlight.
                }
            }

            function renderResources() {
                // Render Subjects
                const sList = document.getElementById('subjectList');
                if (resources.subjects.length === 0) {
                    sList.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs"><i class="fas fa-exclamation-triangle mb-2 text-amber-500"></i><span>등록된 교과목이 없습니다</span></div>';
                } else {
                    sList.innerHTML = resources.subjects.map(s => {
                        const isActive = activeSubjectId === s.id;
                        const cls = isActive ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm';
                        return \`<div onclick="selectSubject(\${s.id})" class="p-3 border rounded transition cursor-pointer mb-2 \${cls}">
                            <div class="flex justify-between items-start mb-1">
                                <div class="font-bold text-slate-800 text-sm line-clamp-1" title="\${s.name}">\${s.name}</div>
                                \${isActive ? '<i class="fas fa-check-circle text-primary-600 text-xs"></i>' : ''}
                            </div>
                            <div class="flex justify-between text-[11px] text-slate-500">
                                <span>\${s.ncs_classification_code || '분류없음'}</span>
                                <span class="\${isActive ? 'font-bold text-primary-700' : ''}">\${s.total_time || 0}H</span>
                            </div>
                        </div>\`;
                    }).join('');
                }

                // Render Instructors (with Filter)
                const iList = document.getElementById('instructorList');
                
                // Logic:
                // 1. If showAllInstructors is TRUE, show everyone (matching search).
                // 2. If showAllInstructors is FALSE, show ONLY assigned instructors (matching search).
                // 3. Exception: If NO instructors are assigned to the session, show everyone (fallback).
                
                const assignedRaw = sessionInfo.instructor_name || '';
                const hasAssigned = assignedRaw.trim().length > 0;
                
                // Parse assigned names for checking (handles comma separated)
                // We'll treat "Assigned" if the instructor's name appears in the sessionInfo.instructor_name string
                // This mimics the existing check: sessionInfo.instructor_name.includes(i.name)
                
                const effectiveShowAll = showAllInstructors || !hasAssigned;

                const filteredInstructors = resources.instructors.filter(i => {
                    // Search Filter
                    if (instructorSearchTerm && !i.name.toLowerCase().includes(instructorSearchTerm.toLowerCase())) {
                        return false;
                    }
                    
                    // Assigned Filter
                    if (!effectiveShowAll) {
                        return assignedRaw.includes(i.name); 
                    }
                    
                    return true;
                });

                if (filteredInstructors.length === 0) {
                    let msg = '결과가 없습니다';
                    if (!effectiveShowAll && hasAssigned) msg = '배정된 강사 중 검색 결과가 없습니다.<br>"전체 보기"를 체크해보세요.';
                    else if (!hasAssigned) msg = '등록된 강사가 없습니다';
                    
                    iList.innerHTML = \`<div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4"><span>\${msg}</span></div>\`;
                } else {
                   iList.innerHTML = filteredInstructors.map(i => {
                        const isActive = activeInstructorId === i.id;
                        const isAssigned = hasAssigned && assignedRaw.includes(i.name);
                        
                        const cls = isActive ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm';
                        return \`<div onclick="selectInstructor(\${i.id})" class="p-3 border rounded transition cursor-pointer mb-2 \${cls}">
                            <div class="flex justify-between items-center text-sm">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-slate-700">\${i.name}</span>
                                    \${isAssigned ? '<span class="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-bold">담당</span>' : ''}
                                </div>
                                \${isActive ? '<i class="fas fa-check-circle text-primary-600 text-xs"></i>' : ''}
                            </div>
                        </div>\`;
                   }).join('');
                }
            }

            function renderTimetableGrid() {
                const header = document.getElementById('timetableHeader');
                const body = document.getElementById('timetableBody');
                
                // Header (Dates)
                let headerHtml = '<tr><th class="w-16 bg-slate-50 border-r border-slate-200 text-center sticky left-0 z-20"></th>';
                const days = ['월', '화', '수', '목', '금', '토', '일'];
                
                for(let i=0; i<7; i++) {
                    const d = new Date(currentWeekStartDate);
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    
                    headerHtml += \`<th class="min-w-[140px] px-2 py-3 border-l border-b border-slate-200 font-bold text-sm text-center \${isToday ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-700'}">
                        <div>\${d.getMonth()+1}.\${d.getDate()} (\${days[(d.getDay() + 6) % 7]})</div>
                    </th>\`;
                }
                headerHtml += '</tr>';
                header.innerHTML = headerHtml;

                // Body (Periods)
                let bodyHtml = '';
                periodConfigs.forEach((cfg, idx) => {
                    bodyHtml += '<tr>';
                    
                    // Period Config Cell
                    bodyHtml += \`<td class="w-24 p-2 border-r border-b border-slate-200 bg-slate-50 align-top sticky left-0 z-10 shadow-sm">
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-center text-xs font-bold text-slate-700">
                                <span>\${cfg.period_number}교시</span>
                                <button onclick="editPeriod(\${idx})" class="text-slate-400 hover:text-primary-600 transition"><i class="fas fa-cog"></i></button>
                            </div>
                            <div class="text-[10px] text-slate-500 text-center border rounded px-1 py-0.5 bg-white cursor-pointer hover:border-primary-300 transition" onclick="editPeriod(\${idx})">
                                \${cfg.start_time}<br>~ \${cfg.end_time}
                            </div>
                            <div class="text-[9px] text-amber-600 text-center mt-1">
                                <i class="fas fa-mug-hot"></i> \${cfg.break_minute}분
                            </div>
                        </div>
                    </td>\`;

                    // Days Cells
                    for(let i=0; i<7; i++) {
                        const d = new Date(currentWeekStartDate);
                        d.setDate(d.getDate() + i);
                        const dateStr = d.toISOString().split('T')[0];
                        
                        const cellData = timetableData.find(t => t.training_date === dateStr && t.period_number === cfg.period_number) || {
                             training_date: dateStr, period_number: cfg.period_number, subject_id: null, instructor_id: null
                        };

                        const subject = resources.subjects.find(s => s.id === cellData.subject_id);
                        const instructor = resources.instructors.find(ins => ins.id === cellData.instructor_id);
                        
                        const hasAssignment = !!subject;
                        
                        bodyHtml += \`<td onclick="assignSlot('\${dateStr}', \${cfg.period_number})" class="border-l border-b border-slate-200 p-1 align-top hover:bg-slate-50 cursor-pointer transition h-20 relative group timetable-cell \${hasAssignment ? 'bg-blue-50/30' : ''}">
                             \${hasAssignment ? \`
                                <div class="bg-white border \${subject ? 'border-primary-200' : 'border-slate-200'} rounded p-2 h-full shadow-sm flex flex-col justify-between group-hover:shadow-md transition">
                                    <div class="font-bold text-xs text-slate-800 line-clamp-2 leading-tight">\${subject.name}</div>
                                    <div class="flex justify-between items-end mt-1">
                                        <div class="text-[10px] text-slate-500">\${instructor ? instructor.name : '<span class="text-slate-300">강사미정</span>'}</div>
                                        <button onclick="removeSlot(event, '\${dateStr}', \${cfg.period_number})" class="text-slate-300 hover:text-red-500 w-5 h-5 flex items-center justify-center rounded transition"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                             \` : \`
                                <div class="h-full flex items-center justify-center text-slate-200 group-hover:text-primary-300 transition">
                                    <i class="fas fa-plus-circle text-lg"></i>
                                </div>
                             \`}
                        </td>\`;
                    }
                    bodyHtml += '</tr>';
                });
                body.innerHTML = bodyHtml;
            }

            // --- Interactions ---

            window.prevWeek = function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
                renderTimetableGrid();
                updateWeekText();
            }

            window.nextWeek = function() {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
                renderTimetableGrid();
                updateWeekText();
            }
            
            function updateWeekText() {
                 const m = currentWeekStartDate.getMonth() + 1;
                 const d = currentWeekStartDate.getDate();
                 document.getElementById('weekText').textContent = \`\${m}월 \${d}일 주\`;
            }

            window.selectSubject = function(id) {
                activeSubjectId = (activeSubjectId === id) ? null : id;
                renderResources();
            }

            window.selectInstructor = function(id) {
                activeInstructorId = (activeInstructorId === id) ? null : id;
                renderResources();
            }
            
            window.filterInstructors = function(val) {
                instructorSearchTerm = val;
                renderResources();
            }

            window.assignSlot = function(date, periodNumber) {
                if (!activeSubjectId) {
                    showToast('먼저 교과목을 선택해주세요', true);
                    return;
                }

                let existingIdx = timetableData.findIndex(t => t.training_date === date && t.period_number === periodNumber);
                if (existingIdx > -1) {
                    timetableData[existingIdx].subject_id = activeSubjectId;
                    timetableData[existingIdx].instructor_id = activeInstructorId;
                    delete timetableData[existingIdx].is_excluded; 
                } else {
                    timetableData.push({
                        training_date: date,
                        period_number: periodNumber,
                        subject_id: activeSubjectId,
                        instructor_id: activeInstructorId,
                        session_id: sessionId
                    });
                }

                renderTimetableGrid();
            }

            window.removeSlot = function(e, date, periodNumber) {
                e.stopPropagation(); 
                let existingIdx = timetableData.findIndex(t => t.training_date === date && t.period_number === periodNumber);
                if (existingIdx > -1) {
                    timetableData.splice(existingIdx, 1);
                }
                renderTimetableGrid();
            }

            // --- Config Editing ---
            
            window.editPeriod = function(idx) {
                activePeriodConfigIdx = idx;
                const cfg = periodConfigs[idx];
                document.getElementById('editStartTime').value = cfg.start_time;
                document.getElementById('editEndTime').value = cfg.end_time;
                document.getElementById('editBreakTime').value = cfg.break_minute;
                
                const modal = document.getElementById('periodEditModal');
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modal.querySelector('div').classList.remove('scale-95');
                }, 10);
            }

            window.closePeriodEdit = function() {
                const modal = document.getElementById('periodEditModal');
                modal.classList.add('opacity-0');
                modal.querySelector('div').classList.add('scale-95');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }

            window.savePeriodEdit = function() {
                if (activePeriodConfigIdx === null) return;
                const cfg = periodConfigs[activePeriodConfigIdx];
                cfg.start_time = document.getElementById('editStartTime').value;
                cfg.end_time = document.getElementById('editEndTime').value;
                cfg.break_minute = parseInt(document.getElementById('editBreakTime').value) || 0;
                
                closePeriodEdit();
                renderTimetableGrid();
                savePeriodConfig(periodConfigs, true); 
            }

            // --- Utils ---
            
            function showToast(msg, isError) {
                const t = document.getElementById('toast');
                t.textContent = msg;
                t.className = \`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg transform transition-transform duration-300 z-50 text-sm font-bold flex items-center gap-2 \${isError ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}\`;
                
                requestAnimationFrame(() => {
                    t.style.transform = 'translateY(0)';
                });

                setTimeout(() => {
                    t.style.transform = 'translateY(150%)';
                }, 3000);
            }
            
            window.showStatus = function() {
                alert('진행 상황 보기 기능은 준비 중입니다.');
            }

        })();
    </script>
</body>
</html>
    `;
}
