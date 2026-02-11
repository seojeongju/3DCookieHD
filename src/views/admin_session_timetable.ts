import { hrdSidebar } from "./components/hrd_sidebar";

export function adminSessionTimetableHtml(sessionId: number): string {
    const sidebar = hrdSidebar('courses');

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회차 시간표 편성 - WOW3D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        body { font-family: 'Inter', 'Noto Sans KR', sans-serif; }
        .grid-bg { background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 20px 20px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .sticky-col { position: sticky; left: 0; background: white; z-index: 10; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex overflow-hidden">
    ${sidebar}

    <main class="flex-1 flex flex-col min-w-0 bg-white shadow-2xl relative z-10 lg:rounded-l-[40px]">
        <!-- Header -->
        <header class="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                    <i class="fas fa-calendar-alt text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-black text-slate-800 tracking-tight" id="sessionName">과정 회차 시간표</h1>
                    <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Timetable Management System</p>
                </div>
            </div>
            
            <div class="flex items-center gap-3">
                <div class="flex bg-slate-100 p-1 rounded-xl mr-2">
                    <button onclick="prevWeek()" class="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition text-slate-500 hover:text-primary-600">
                        <i class="fas fa-chevron-left text-xs"></i>
                    </button>
                    <div id="weekText" class="px-4 flex items-center font-bold text-slate-700 text-sm min-w-[120px] justify-center">--월 --일 주</div>
                    <button onclick="nextWeek()" class="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition text-slate-500 hover:text-primary-600">
                        <i class="fas fa-chevron-right text-xs"></i>
                    </button>
                </div>

                <div class="h-8 w-[1px] bg-slate-200 mx-2"></div>

                <button onclick="showStatus()" class="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 transition shadow-lg shadow-slate-200">
                    <i class="fas fa-chart-bar"></i> 진행 상황
                </button>
                <button onclick="saveAll()" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                    저장하기
                </button>
                <button onclick="history.back()" class="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </header>

        <div class="flex-1 flex overflow-hidden">
            <!-- Left Panel: Resources -->
            <div class="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
                <div class="p-6 pb-2">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest">배정 교육 리소스</span>
                        <span class="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">항목 선택 후 그리드 클릭</span>
                    </div>
                    
                    <div class="relative group">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition"></i>
                        <input type="text" oninput="filterInstructors(this.value)" placeholder="강사명으로 검색..." class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition shadow-sm">
                    </div>
                </div>

                <div id="resourcePanel" class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    <!-- Dynamic Content -->
                    <div class="flex items-center justify-center h-40 text-slate-300">
                        <i class="fas fa-circle-notch fa-spin mr-2"></i> 로딩 중...
                    </div>
                </div>

                <div class="p-4 bg-white border-t border-slate-100">
                    <div class="bg-slate-50 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-2">
                             <span class="text-xs font-bold text-slate-500">배정 완료 현황</span>
                             <span class="text-xs font-black text-primary-600"><span id="currentHours">0</span> / <span id="targetHours">--</span> <span class="text-lg text-slate-400 font-normal">시간</span></span>
                        </div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div id="totalProgressBar" class="bg-primary-500 h-full rounded-full transition-all duration-500" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel: Grid -->
            <div class="flex-1 overflow-auto relative grid-bg custom-scrollbar p-8">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden inline-block min-w-full">
                    <table class="border-collapse table-fixed w-full">
                        <thead id="timetableHeader">
                            <!-- Dynamic -->
                        </thead>
                        <tbody id="timetableBody">
                            <!-- Dynamic -->
                        </tbody>
                    </table>
                </div>
                
                <div class="mt-8 flex gap-6 text-[11px] text-slate-400 font-medium">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 bg-blue-50 border border-blue-100 rounded"></div> 배정 완료</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 bg-slate-100 border border-slate-200 rounded"></div> 공휴일/일정제외</div>
                    <div class="flex items-center gap-2 text-slate-300 italic"><i class="fas fa-mouse-pointer"></i> 그리드를 클릭하여 배정하거나 수정할 수 있습니다.</div>
                </div>
            </div>
        </div>
    </main>

    <!-- Modals -->
    <div id="periodEditModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 class="text-lg font-black text-slate-800">교시 상세 설정</h3>
                <button onclick="closePeriodEdit()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-8 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 ml-1">시작 시간</label>
                        <input type="time" id="editStartTime" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 ml-1">종료 시간</label>
                        <input type="time" id="editEndTime" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 ml-1">쉬는 시간 (분)</label>
                    <input type="number" id="editBreakTime" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                </div>
                <div class="pt-4 flex gap-3">
                    <button onclick="deletePeriod()" class="flex-1 px-6 py-3 border border-red-100 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition">교시 삭제</button>
                    <button onclick="savePeriodEdit()" class="flex-1 px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">설정 저장</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Status Modal -->
    <div id="statusModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
        <div class="bg-slate-50 rounded-[32px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col transform scale-95 transition-transform duration-300">
            <div class="p-8 pb-4 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                        <i class="fas fa-chart-line text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-black text-slate-800">편성 현황 진단</h3>
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Real-time Timetable Analysis</p>
                    </div>
                </div>
                <button onclick="closeStatus()" class="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                <div class="grid grid-cols-3 gap-6 mb-8" id="statusSummary">
                    <!-- Dynamic -->
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 space-y-4">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-black text-slate-800 flex items-center gap-2">
                                <i class="fas fa-book-open text-primary-500"></i> 교과목별 편성 상세
                            </h4>
                            <span class="text-[10px] text-slate-400 font-bold">총 <span id="subjectCountText">0</span>개 항목</span>
                        </div>
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/50 border-b border-slate-100">
                                        <th class="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">교과목명 / NCS 분류</th>
                                        <th class="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">계획</th>
                                        <th class="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">편성</th>
                                        <th class="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-32">진척도</th>
                                        <th class="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">상태</th>
                                    </tr>
                                </thead>
                                <tbody id="statusSubjectBody" class="text-sm">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <h4 class="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                <i class="fas fa-user-tie text-blue-500"></i> 강사별 배정 시간
                            </h4>
                            <div id="statusInstructorList" class="space-y-2">
                                <!-- Dynamic -->
                            </div>
                        </div>

                        <div class="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <h4 class="text-sm font-black text-amber-800 mb-3 flex items-center gap-2">
                                <i class="fas fa-shield-alt"></i> 시스템 권장사항
                            </h4>
                            <ul id="statusWarnings" class="space-y-3 text-xs text-amber-700 font-medium leading-relaxed">
                                <!-- Dynamic -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 bg-white border-t border-slate-100 flex justify-end shrink-0">
                <button onclick="closeStatus()" class="px-8 py-3 bg-slate-800 text-white text-sm font-black rounded-xl hover:bg-slate-900 transition">확인 완료</button>
            </div>
        </div>
    </div>

    <div id="toast" class="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded shadow-lg transform translate-y-20 transition-transform duration-300 z-50 text-sm font-medium">
        메시지 표시 영역
    </div>

    <script>
        (function() {
            var sessionId = ${sessionId};
            var token = localStorage.getItem('token');
            var headers = token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
            
            var sessionInfo = {};
            var resources = { subjects: [], instructors: [] };
            var timetableData = [];
            var periodConfigs = [];
            
            var currentWeekStartDate = new Date();
            // 이번 주 월요일로 설정
            var day = currentWeekStartDate.getDay();
            var diff = currentWeekStartDate.getDate() - day + (day === 0 ? -6 : 1);
            currentWeekStartDate.setDate(diff);
            currentWeekStartDate.setHours(0,0,0,0);

            var activeSubjectId = null;
            var activeInstructorId = null;
            var instructorSearchTerm = "";
            var activePeriodConfigIdx = null;

            async function init() {
                try {
                    const [sRes, rRes, tRes, pRes] = await Promise.all([
                        fetch('/api/course-sessions/' + sessionId, { headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/resources', { headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable', { headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/periods', { headers })
                    ]);

                    const sJson = await sRes.json();
                    const rJson = await rRes.json();
                    const tJson = await tRes.json();
                    const pJson = await pRes.json();

                    if(sJson.success) {
                        sessionInfo = sJson.data;
                        document.getElementById('sessionName').textContent = (sessionInfo.course_name || '미지정 과정') + (sessionInfo.session_number ? ' [' + sessionInfo.session_number + '차]' : '');
                        document.getElementById('targetHours').textContent = (sessionInfo.total_hours || 42).toFixed(1);
                        
                        // 시작일이 있으면 해당 주로 이동
                        if (sessionInfo.training_start_date) {
                             const sd = new Date(sessionInfo.training_start_date);
                             const sdDay = sd.getDay();
                             const sdDiff = sd.getDate() - sdDay + (sdDay === 0 ? -6 : 1);
                             currentWeekStartDate = new Date(sd.setDate(sdDiff));
                             currentWeekStartDate.setHours(0,0,0,0);
                        }
                    }

                    if(rJson.success) resources = rJson.data;
                    if(tJson.success) timetableData = tJson.data || [];
                    if(pJson.success && pJson.data && pJson.data.length > 0) {
                        periodConfigs = pJson.data;
                    } else {
                        // 기본 8교시 설정
                        for(let i=1; i<=8; i++) {
                            periodConfigs.push({
                                period_number: i,
                                start_time: (9 + (i-1)).toString().padStart(2, '0') + ':00',
                                end_time: (9 + (i-1)).toString().padStart(2, '0') + ':50',
                                break_minute: 10
                            });
                        }
                    }

                    updateWeekText();
                    renderResources();
                    renderTimetableGrid();
                } catch(e) {
                    console.error(e);
                    showToast('데이터를 불러오는 중 오류가 발생했습니다.', true);
                }
            }

            init();

            // --- Rendering ---

            function renderResources() {
                const container = document.getElementById('resourcePanel');
                if(!container) return;

                let html = '';
                
                // Subjects
                html += '<div class="space-y-3"><div><span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">배정 교과목</span></div>';
                resources.subjects.forEach(s => {
                    let assignedCount = 0;
                    timetableData.forEach(t => {
                        if(t.subject_id === s.id && !t.is_excluded) assignedCount += getPeriodDuration(t.period_number);
                    });
                    
                    const isSelected = activeSubjectId === s.id;
                    const items = s.units_json ? JSON.parse(s.units_json) : [];

                    html += '<div onclick="selectSubject(' + s.id + ')" class="group cursor-pointer bg-white border ' + (isSelected ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-slate-100') + ' rounded-2xl p-4 transition-all hover:shadow-md">';
                    html += '<div class="flex justify-between items-start mb-2">';
                    html += '<div class="font-bold text-slate-800 text-sm line-clamp-1" title="' + (s.name || '').replace(/"/g, '&quot;') + '">' + (s.name || '') + '</div>';
                    if(isSelected) html += '<i class="fas fa-check-circle text-primary-500"></i>';
                    html += '</div>';
                    
                    html += '<div class="flex flex-wrap gap-1 mb-3">';
                    items.slice(0, 3).forEach(e => {
                        html += '<span class="text-[8px] font-mono bg-slate-100 text-slate-500 px-1 rounded border border-slate-200/50">' + e + '</span>';
                    });
                    if(items.length > 3) html += '<span class="text-[8px] text-slate-300">...</span>';
                    html += '</div>';

                    const pct = Math.min(Math.round((assignedCount / (s.total_time || 1)) * 100), 100);
                    html += '<div class="flex justify-between items-center text-[10px] mb-1"><span class="text-slate-400 font-bold">Progress</span><span class="' + (pct >= 100 ? 'text-emerald-500' : 'text-primary-600') + ' font-black">' + assignedCount.toFixed(1) + ' / ' + (s.total_time || 0) + 'H</span></div>';
                    html += '<div class="w-full bg-slate-100 h-1 rounded-full overflow-hidden leading-none"><div class="' + (pct >= 100 ? 'bg-emerald-500' : 'bg-primary-500') + ' h-full transition-all" style="width: ' + pct + '%"></div></div>';
                    html += '</div>';
                });
                html += '</div>';

                // Instructors
                html += '<div class="space-y-3 pt-4 border-t border-slate-100"><div><span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">담당 강사</span></div>';
                const filtered = resources.instructors.filter(i => i.name.includes(instructorSearchTerm));
                filtered.forEach(i => {
                    const isSelected = activeInstructorId === i.id;
                    html += '<div onclick="selectInstructor(' + i.id + ')" class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border ' + (isSelected ? 'bg-white border-primary-500 shadow-sm ring-2 ring-primary-500/10' : 'hover:bg-white border-transparent') + '">';
                    html += '<div class="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">' + i.name.charAt(0) + '</div>';
                    html += '<div><div class="text-sm font-bold ' + (isSelected ? 'text-primary-700' : 'text-slate-700') + '">' + i.name + '</div><div class="text-[10px] text-slate-400 font-medium">' + (i.major_field || '전문강사') + '</div></div>';
                    if(isSelected) html += '<i class="fas fa-check text-primary-500 ml-auto text-xs"></i>';
                    html += '</div>';
                });
                html += '</div>';

                container.innerHTML = html;
                updateHoursCount();
            }

            function getPeriodDuration(pNum) {
                const cfg = periodConfigs.find(c => c.period_number === pNum);
                if (!cfg) return 1;
                try {
                    const [sh, sm] = cfg.start_time.split(':').map(Number);
                    const [eh, em] = cfg.end_time.split(':').map(Number);
                    const diff = (eh * 60 + em) - (sh * 60 + sm);
                    return diff / 60; // 시간을 실수로 반환 (예: 50분 -> 0.83시간)
                } catch(e) { return 1; }
            }

            function updateHoursCount() {
                let total = 0;
                timetableData.forEach(t => {
                    if (t.subject_id && !t.is_excluded) {
                        total += getPeriodDuration(t.period_number);
                    }
                });
                document.getElementById('currentHours').textContent = total.toFixed(1);
                const target = parseFloat(document.getElementById('targetHours').textContent || '0');
                if (target > 0) {
                    const pct = Math.round((total / target) * 100);
                    document.getElementById('totalProgressBar').style.width = Math.min(pct, 100) + '%';
                }
            }

            function renderTimetableGrid() {
                const header = document.getElementById('timetableHeader');
                const body = document.getElementById('timetableBody');
                if(!header || !body) return;

                // Dates
                const dates = [];
                for(let i=0; i<7; i++) {
                    const d = new Date(currentWeekStartDate);
                    d.setDate(d.getDate() + i);
                    dates.push(d);
                }

                // Header
                const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
                let headHtml = '<tr><th class="w-24 p-4 border-r border-b border-slate-200 bg-slate-50 sticky left-0 z-20 shadow-sm"><span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">교시 / 일자</span></th>';
                dates.forEach((d, i) => {
                    const isToday = d.toDateString() === new Date().toDateString();
                    headHtml += '<th class="p-4 border-b border-slate-200 bg-slate-50 min-w-[140px] ' + (isToday ? 'bg-primary-50/50' : '') + '">';
                    headHtml += '<div class="text-[10px] font-bold ' + (isToday ? 'text-primary-600' : 'text-slate-400') + ' mb-1">' + dayNames[i] + '요일</div>';
                    headHtml += '<div class="text-sm font-black ' + (isToday ? 'text-primary-700' : 'text-slate-800') + '">' + (d.getMonth()+1) + '/' + d.getDate() + '</div>';
                    headHtml += '</th>';
                });
                headHtml += '</tr>';
                header.innerHTML = headHtml;

                // Body
                let bodyHtml = '';
                periodConfigs.sort((a,b) => a.period_number - b.period_number).forEach((cfg, idx) => {
                    bodyHtml += '<tr><td onclick="editPeriod(' + idx + ')" class="border-r border-b border-slate-100 p-3 bg-white hover:bg-slate-50 cursor-pointer sticky left-0 z-10 shadow-sm text-center group">';
                    bodyHtml += '<div class="font-black text-slate-800 text-sm group-hover:text-primary-600 transition">' + cfg.period_number + '교시</div>';
                    bodyHtml += '<div class="text-[9px] text-slate-400 font-bold mt-1">' + cfg.start_time + ' ~ ' + cfg.end_time + '</div>';
                    bodyHtml += '<div class="text-[8px] text-slate-300 mt-1"><i class="fas fa-cog"></i> 설정</div>';
                    bodyHtml += '</td>';

                    for(let i=0; i<7; i++) {
                        const d = dates[i];
                        const dateStr = d.toISOString().split('T')[0];
                        const cellData = timetableData.find(t => t.training_date === dateStr && t.period_number === cfg.period_number);
                        
                        const subject = cellData ? resources.subjects.find(s => s.id === cellData.subject_id) : null;
                        const instructor = cellData ? resources.instructors.find(ins => ins.id === cellData.instructor_id) : null;
                        const isExcluded = cellData && cellData.is_excluded;

                        let tdCls = 'border-l border-b border-slate-200 p-1 align-top hover:bg-slate-50 cursor-pointer transition h-20 relative';
                        if (subject) tdCls += ' bg-blue-50/30';
                        if (isExcluded) tdCls += ' bg-slate-100';

                        bodyHtml += '<td onclick="assignSlot(\'' + dateStr + '\', ' + cfg.period_number + ')" class="' + tdCls + '">';
                        if (isExcluded) {
                            bodyHtml += '<div class="w-full h-full flex items-center justify-center text-slate-300 text-[8px] font-bold italic">공휴일/제외</div>';
                        } else if (subject) {
                            bodyHtml += '<div class="bg-white border border-primary-200 rounded p-2 h-full shadow-sm flex flex-col justify-between hover:shadow-md transition relative group">';
                            bodyHtml += '<div class="font-bold text-xs text-slate-800 line-clamp-2 leading-tight">' + subject.name + '</div>';
                            bodyHtml += '<div class="flex justify-between items-end mt-1">';
                            bodyHtml += '<div class="text-[10px] text-slate-500">' + (instructor ? instructor.name : '<span class="text-slate-300">강사미정</span>') + '</div>';
                            bodyHtml += '<button onclick="removeSlot(event, \'' + dateStr + '\', ' + cfg.period_number + ')" class="text-slate-300 hover:text-red-500 w-5 h-5 flex items-center justify-center rounded transition"><i class="fas fa-times"></i></button>';
                            bodyHtml += '</div></div>';
                        } else {
                            bodyHtml += '<div class="h-full flex items-center justify-center text-slate-200 hover:text-primary-300 transition"><i class="fas fa-plus-circle text-lg"></i></div>';
                        }
                        bodyHtml += '</td>';
                    }
                    bodyHtml += '</tr>';
                });

                bodyHtml += '<tr><td class="w-24 p-2 border-r border-b border-slate-200 bg-slate-50 sticky left-0 z-10 shadow-sm text-center">';
                bodyHtml += '<button onclick="addPeriod()" class="w-full h-full py-4 text-primary-600 hover:text-primary-700 transition flex flex-col items-center justify-center gap-1 group">';
                bodyHtml += '<i class="fas fa-plus-circle text-lg group-hover:scale-110 transform transition"></i><span class="text-[9px] font-bold">교시 추가</span></button></td>';
                bodyHtml += '<td colspan="7" class="border-b border-slate-100 bg-slate-50/20"></td></tr>';

                body.innerHTML = bodyHtml;
                updateHoursCount();
            }

            // --- Interactions ---

            window.prevWeek = function () {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
                renderTimetableGrid();
                updateWeekText();
            }

            window.nextWeek = function () {
                currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
                renderTimetableGrid();
                updateWeekText();
            }

            function updateWeekText() {
                const m = currentWeekStartDate.getMonth() + 1;
                const d = currentWeekStartDate.getDate();
                document.getElementById('weekText').textContent = m + '월 ' + d + '일 주';
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
                renderResources();
            }

            window.removeSlot = function(e, date, periodNumber) {
                e.stopPropagation(); 
                let existingIdx = timetableData.findIndex(t => t.training_date === date && t.period_number === periodNumber);
                if (existingIdx > -1) {
                    timetableData.splice(existingIdx, 1);
                }
                renderTimetableGrid();
                renderResources();
            }

            window.addPeriod = function() {
                const lastCfg = periodConfigs[periodConfigs.length - 1];
                let nextStartTime = '09:00';
                let nextEndTime = '09:50';
                let nextNumber = 1;
                
                if (lastCfg) {
                    nextNumber = (lastCfg.period_number || 0) + 1;
                    try {
                        const [h, m] = lastCfg.end_time.split(':').map(Number);
                        const nextDate = new Date(1970, 0, 1, h, m + (lastCfg.break_minute || 10));
                        const nextEndDate = new Date(nextDate.getTime() + 50 * 60000);
                        
                        nextStartTime = nextDate.toTimeString().substring(0, 5);
                        nextEndTime = nextEndDate.toTimeString().substring(0, 5);
                    } catch(e) {}
                }

                periodConfigs.push({
                    period_number: nextNumber,
                    start_time: nextStartTime,
                    end_time: nextEndTime,
                    break_minute: 10
                });
                renderTimetableGrid();
                savePeriodConfig();
            }

            window.editPeriod = function(idx) {
                activePeriodConfigIdx = idx;
                const cfg = periodConfigs[idx];
                document.getElementById('editStartTime').value = cfg.start_time;
                document.getElementById('editEndTime').value = cfg.end_time;
                document.getElementById('editBreakTime').value = cfg.break_minute;
                
                const modal = document.getElementById('periodEditModal');
                modal.classList.remove('hidden');
                setTimeout(function() {
                    modal.classList.remove('opacity-0');
                    modal.querySelector('div').classList.remove('scale-95');
                }, 10);
            }

            window.closePeriodEdit = function() {
                const modal = document.getElementById('periodEditModal');
                modal.classList.add('opacity-0');
                modal.querySelector('div').classList.add('scale-95');
                setTimeout(function() {
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
                savePeriodConfig();
            }

            window.deletePeriod = function() {
                if (activePeriodConfigIdx === null) return;
                if (!confirm('이 교시를 삭제하시겠습니까?')) return;
                periodConfigs.splice(activePeriodConfigIdx, 1);
                periodConfigs.forEach(function(c, i) { c.period_number = i + 1; });
                closePeriodEdit();
                renderTimetableGrid();
                savePeriodConfig();
            }

            async function savePeriodConfig() {
                try {
                    await fetch('/api/course-sessions/' + sessionId + '/timetable/periods', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(periodConfigs)
                    });
                } catch(e) { console.error(e); }
            }

            window.saveAll = async function() {
                try {
                    const res = await fetch('/api/course-sessions/' + sessionId + '/timetable', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(timetableData)
                    });
                    const json = await res.json();
                    if(json.success) showToast('시간표가 정상적으로 저장되었습니다.');
                    else showToast('저장에 실패했습니다.', true);
                } catch(e) {
                    console.error(e);
                    showToast('통신 중 오류가 발생했습니다.', true);
                }
            }

            function showToast(msg, isError) {
                const t = document.getElementById('toast');
                t.textContent = msg;
                t.className = 'fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg transform transition-transform duration-300 z-50 text-sm font-bold flex items-center gap-2 ' + (isError ? 'bg-red-500 text-white' : 'bg-slate-800 text-white');
                requestAnimationFrame(function() { t.style.transform = 'translateY(0)'; });
                setTimeout(function() { t.style.transform = 'translateY(150%)'; }, 3000);
            }

            // --- Status Analysis ---

            window.showStatus = function() {
                const modal = document.getElementById('statusModal');
                if (!modal) return;
                
                const totalPlanned = sessionInfo.total_hours || 0;
                let totalAssigned = 0;
                timetableData.forEach(function(t) {
                    if (t.subject_id && !t.is_excluded) {
                        totalAssigned += getPeriodDuration(t.period_number);
                    }
                });
                const progress = totalPlanned > 0 ? Math.round((totalAssigned / totalPlanned) * 100) : 0;
                
                let sHtml = '<div class="bg-blue-50 p-4 rounded-xl border border-blue-100">' +
                    '<div class="text-blue-500 text-xs font-bold mb-1">총 훈련시간 편성률</div>' +
                    '<div class="flex items-end gap-2">' +
                        '<span class="text-3xl font-black text-blue-700">' + progress + '%</span>' +
                        '<span class="text-sm text-blue-600 mb-1">(' + totalAssigned.toFixed(1) + ' / ' + totalPlanned + ' 시간)</span>' +
                    '</div>' +
                    '<div class="w-full bg-blue-200 h-2 rounded-full mt-3 overflow-hidden">' +
                        '<div class="bg-blue-600 h-full rounded-full" style="width: ' + Math.min(progress, 100) + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">' +
                    '<div class="text-slate-500 text-xs font-bold mb-1">배정된 강사 수</div>' +
                    '<div class="text-2xl font-bold text-slate-800">' +
                        new Set(timetableData.filter(function(t) { return t.instructor_id && !t.is_excluded; }).map(function(t) { return t.instructor_id; })).size + 
                        ' <span class="text-sm font-normal text-slate-500">명</span>' +
                    '</div>' +
                '</div>' +
                '<div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">' +
                     '<div class="text-slate-500 text-xs font-bold mb-1">시스템 진단</div>' +
                     '<div class="text-lg font-bold text-slate-800 flex items-center gap-2 mt-1">' +
                        (totalAssigned < totalPlanned ? '<i class="fas fa-exclamation-circle text-amber-500"></i> <span class="text-sm font-medium text-slate-600">시간 부족</span>' : 
                          (totalAssigned > totalPlanned ? '<i class="fas fa-exclamation-triangle text-red-500"></i> <span class="text-sm font-medium text-slate-600">시간 초과</span>' : 
                          '<i class="fas fa-check-circle text-emerald-500"></i> <span class="text-sm font-medium text-slate-600">정상</span>')) +
                     '</div>' +
                '</div>';
                
                const summaryEl = document.getElementById('statusSummary');
                if (summaryEl) summaryEl.innerHTML = sHtml;

                const tbody = document.getElementById('statusSubjectBody');
                if (tbody) {
                    if (resources.subjects.length === 0) {
                         tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">등록된 교과목이 없습니다.</td></tr>';
                    } else {
                        tbody.innerHTML = resources.subjects.map(function(s) {
                            const planned = s.total_time || 0;
                            let assigned = 0;
                            timetableData.forEach(function(t) {
                                if (t.subject_id === s.id && !t.is_excluded) {
                                    assigned += getPeriodDuration(t.period_number);
                                }
                            });
                            const pct = planned > 0 ? Math.round((assigned / planned) * 100) : 0;
                            const sName = (s.name || '').toString().replace(/'/g, "\\'").replace(/\n/g, " ");
                            const jName = (s.main_job_name || '').toString().replace(/'/g, "\\'").replace(/\n/g, " ");

                            let statusBadge = '';
                            if (assigned === 0) statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">미배정</span>';
                            else if (assigned < planned) statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 cursor-pointer" title="' + (planned - assigned).toFixed(1) + '시간 부족">부족</span>';
                            else if (Math.abs(assigned - planned) < 0.01) statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-600">충족</span>';
                            else statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 cursor-pointer" title="' + (assigned - planned).toFixed(1) + '시간 초과">초과</span>';

                            return '<tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">' +
                                    '<td class="px-4 py-3">' +
                                        '<div class="font-bold text-slate-800 text-xs">' + sName + '</div>' +
                                        '<div class="text-[10px] text-primary-600 font-medium mb-1">' + (jName ? jName + ' (' + (s.main_job_code || '') + ')' : '') + '</div>' +
                                        '<div class="space-y-1">' +
                                            '<div class="text-[9px] text-slate-500 font-bold flex items-center gap-1">' +
                                                '<span class="px-1 bg-slate-100 rounded text-slate-400 text-[8px]">UNIT</span> ' + (s.ncs_classification_code || '-') +
                                            '</div>' +
                                        '</div></td>' +
                                    '<td class="px-4 py-3 text-center text-slate-600 text-xs">' + planned + '</td>' +
                                    '<td class="px-4 py-3 text-center text-xs font-bold ' + (assigned > planned ? 'text-red-600' : 'text-slate-800') + '">' + assigned.toFixed(1) + '</td>' +
                                    '<td class="px-4 py-3 align-middle">' +
                                        '<div class="flex items-center gap-2">' +
                                            '<div class="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">' +
                                                '<div class="h-full rounded-full ' + (assigned > planned ? 'bg-red-500' : (Math.abs(assigned - planned) < 0.01 ? 'bg-emerald-500' : 'bg-blue-500')) + '" style="width: ' + Math.min((assigned/planned)*100, 100) + '%"></div>' +
                                            '</div>' +
                                            '<span class="text-[10px] w-8 text-right text-slate-500">' + pct + '%</span>' +
                                        '</div>' +
                                    '</td>' +
                                    '<td class="px-4 py-3 text-center">' + statusBadge + '</td>' +
                                '</tr>';
                        }).join('');
                    }
                }

                const instructorCounts = {};
                timetableData.forEach(function(t) {
                    if(t.instructor_id && !t.is_excluded) {
                        instructorCounts[t.instructor_id] = (instructorCounts[t.instructor_id] || 0) + getPeriodDuration(t.period_number);
                    }
                });
                
                let iHtmlArr = [];
                const sortedInstructors = Object.keys(instructorCounts).sort(function(a,b) { return instructorCounts[b] - instructorCounts[a]; });
                if (sortedInstructors.length === 0) {
                     iHtmlArr.push('<div class="text-center text-slate-400 py-4 text-xs">아직 배정된 강사가 없습니다.</div>');
                } else {
                    sortedInstructors.forEach(function(id) {
                        const count = instructorCounts[id];
                        const info = resources.instructors.find(function(ins) { return ins.id == id; });
                        const name = info ? info.name : 'Unknown';
                        iHtmlArr.push('<div class="flex justify-between items-center text-sm p-2 bg-white border border-slate-100 rounded hover:bg-slate-50 transition">' +
                                '<div class="flex items-center gap-2">' +
                                    '<div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[10px]">' + name.charAt(0) + '</div>' +
                                    '<span class="font-medium text-slate-700 text-xs">' + name + '</span>' +
                                '</div>' +
                                '<div class="font-bold text-slate-800 text-xs">' + count.toFixed(1) + ' <span class="font-normal text-slate-400 text-[10px]">시간</span></div>' +
                            '</div>');
                    });
                }
                const iListEl = document.getElementById('statusInstructorList');
                if (iListEl) iListEl.innerHTML = '<div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">' + iHtmlArr.join('') + '</div>';

                const warnings = [];
                if (totalAssigned < totalPlanned) warnings.push('<li class="flex items-start gap-2"><i class="fas fa-exclamation-circle text-amber-500 mt-0.5"></i><span>총 훈련시간이 부족합니다. (' + (totalPlanned - totalAssigned).toFixed(1) + '시간 미편성)</span></li>');
                if (totalAssigned > totalPlanned) warnings.push('<li class="flex items-start gap-2"><i class="fas fa-exclamation-triangle text-red-500 mt-0.5"></i><span>총 훈련시간이 초과되었습니다. (' + (totalAssigned - totalPlanned).toFixed(1) + '시간 초과)</span></li>');
                const warnEl = document.getElementById('statusWarnings');
                if (warnEl) warnEl.innerHTML = warnings.length > 0 ? warnings.join('') : '<li class="flex items-center gap-2 text-emerald-600"><i class="fas fa-check-circle"></i><span>현재까지 특이사항이 발견되지 않았습니다.</span></li>';

                modal.classList.remove('hidden');
                setTimeout(function() {
                    modal.classList.remove('opacity-0');
                    const innerDiv = modal.querySelector('div');
                    if(innerDiv) innerDiv.classList.remove('scale-95');
                }, 10);
            }

            window.closeStatus = function() {
                const modal = document.getElementById('statusModal');
                if (!modal) return;
                modal.classList.add('opacity-0');
                const innerDiv = modal.querySelector('div');
                if(innerDiv) innerDiv.classList.add('scale-95');
                setTimeout(function() {
                    modal.classList.add('hidden');
                }, 300);
            }

        }) ();
    </script>
</body>
</html>
    `;
}
