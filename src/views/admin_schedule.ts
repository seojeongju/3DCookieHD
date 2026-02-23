import { hrdSidebar } from './components/hrd_sidebar';

export const adminScheduleHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 일정 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <!-- FullCalendar -->
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
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
        .fc-event { cursor: pointer; border-radius: 4px; font-size: 0.85em; }
        .fc-toolbar-title { font-size: 1.25em !important; font-weight: bold; }
        .fc-button { background-color: #2563eb !important; border-color: #2563eb !important; }
        .fc-button:hover { background-color: #1d4ed8 !important; border-color: #1d4ed8 !important; }
        .fc-highlight { background: #e0effe !important; opacity: 0.7; }
    </style>
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('schedule')}
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-calendar-alt text-primary-600 mr-2"></i>통합 일정 관리
                    </h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">ADMIN</span>
                    </div>
                </div>
            </header>

            <div class="p-6 max-w-7xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked onchange="toggleSource('course')" class="form-checkbox text-blue-600 rounded">
                            <i class="fas fa-graduation-cap text-blue-500 w-4"></i>
                            <span class="text-sm font-medium text-gray-700">교육과정</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked onchange="toggleSource('facility')" class="form-checkbox text-green-600 rounded">
                            <i class="fas fa-door-open text-green-500 w-4"></i>
                            <span class="text-sm font-medium text-gray-700">시설예약</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked onchange="toggleSource('consultation')" class="form-checkbox text-orange-600 rounded">
                            <i class="fas fa-headset text-orange-500 w-4"></i>
                            <span class="text-sm font-medium text-gray-700">상담(문의)</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked onchange="toggleSource('hrd')" class="form-checkbox text-rose-600 rounded">
                            <i class="fas fa-user-friends text-rose-500 w-4"></i>
                            <span class="text-sm font-medium text-gray-700">면담(재학생)</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked onchange="toggleSource('general')" class="form-checkbox text-purple-600 rounded">
                            <i class="fas fa-calendar-check text-purple-500 w-4"></i>
                            <span class="text-sm font-medium text-gray-700">일반일정</span>
                        </label>
                    </div>
                    <button onclick="openAddEventModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 일정 등록
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-[800px]">
                    <div id="calendar" class="h-full"></div>
                </div>
            </div>
        </main>
    </div>

    <!-- 일정 상세 모달 -->
    <div id="eventModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">일정 상세</h3>
                <button onclick="closeModal('eventModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <span id="modalBadge" class="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700 mb-2 inline-block">-</span>
                    <h4 id="modalEventName" class="text-lg font-bold text-gray-900 mb-1"></h4>
                    <p id="modalTime" class="text-sm text-gray-500 flex items-center"><i class="far fa-clock mr-2"></i> <span></span></p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <div class="flex mb-2">
                        <span class="w-16 font-medium text-gray-500">장소</span>
                        <span id="modalLocation">-</span>
                    </div>
                    <div class="flex mb-2">
                        <span class="w-16 font-medium text-gray-500">분류</span>
                        <span id="modalCategory">-</span>
                    </div>
                    <div class="flex">
                        <span class="w-16 font-medium text-gray-500">설명</span>
                        <span id="modalDesc">-</span>
                    </div>
                </div>
                <div class="flex justify-end gap-2 pt-4">
                    <button id="btnViewCourse" class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium" style="display:none;">과정 바로가기</button>
                    <button onclick="closeModal('eventModal')" class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium">닫기</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 일정 등록 모달 -->
    <div id="addEventModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
             <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">새 일정 등록</h3>
                <button onclick="closeModal('addEventModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">일정 유형</label>
                    <div class="flex items-center gap-2">
                         <select id="eventType" class="w-full border rounded-lg px-3 py-2 bg-gray-50" onchange="handleTypeChange()">
                            <option value="facility">시설 예약</option>
                            <option value="schedule">일반 일정</option>
                            <option value="consultation">상담 등록</option>
                        </select>
                        <label class="flex items-center space-x-2 whitespace-nowrap hidden" id="allDayWrapper">
                            <input type="checkbox" id="eventAllDay" class="rounded text-blue-600">
                            <span class="text-sm text-gray-600">종일</span>
                        </label>
                    </div>
                </div>
                
                <!-- 시설 선택 (시설 예약용) -->
                <div id="facilityField">
                    <label class="block text-sm font-medium text-gray-700 mb-1">시설 선택</label>
                    <select id="facilitySelect" class="w-full border rounded-lg px-3 py-2">
                        <option value="">불러오는 중...</option>
                    </select>
                </div>

                <!-- 카테고리 선택 (일반 일정용) -->
                <div id="categoryField" class="hidden">
                    <label class="block text-sm font-medium text-gray-700 mb-1">일정 분류</label>
                    <select id="eventCategory" class="w-full border rounded-lg px-3 py-2">
                        <option value="general">일반</option>
                        <option value="academic">학사 일정</option>
                        <option value="holiday">공휴일/휴무</option>
                    </select>
                </div>

                <!-- 상담 유형 선택 (상담용) -->
                <div id="consultationTypeField" class="hidden">
                     <label class="block text-sm font-medium text-gray-700 mb-1">상담 유형</label>
                     <select id="consultationType" class="w-full border rounded-lg px-3 py-2">
                        <option value="visit">방문 상담</option>
                        <option value="phone">전화 상담</option>
                    </select>
                </div>

                <div id="titleField">
                    <label class="block text-sm font-medium text-gray-700 mb-1" id="labelTitle">예약 목적 (제목)</label>
                    <input type="text" id="eventTitle" class="w-full border rounded-lg px-3 py-2" placeholder="예: 3D 프린터 실습">
                </div>

                <div class="grid grid-cols-2 gap-4" id="userFields">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" id="labelUser">예약자명</label>
                        <input type="text" id="eventUserName" class="w-full border rounded-lg px-3 py-2" value="관리자">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input type="text" id="eventPhone" class="w-full border rounded-lg px-3 py-2" placeholder="010-0000-0000">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">시작 일시</label>
                        <input type="datetime-local" id="eventStart" class="w-full border rounded-lg px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">종료 일시</label>
                        <input type="datetime-local" id="eventEnd" class="w-full border rounded-lg px-3 py-2">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">내용/메모</label>
                    <textarea id="eventDesc" rows="3" class="w-full border rounded-lg px-3 py-2" placeholder="상세 내용을 입력하세요"></textarea>
                </div>
                
                <div class="flex justify-end pt-4">
                    <button onclick="submitEvent()" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-md transform transition hover:-translate-y-0.5">등록하기</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let calendar;

        document.addEventListener('DOMContentLoaded', function() {
            loadFacilities();
            const calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                },
                locale: 'ko',
                navLinks: true, 
                selectable: true,
                dayMaxEvents: true,
                events: '/api/schedules/integrated',
                eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false, hour12: false },
                eventClick: function(info) { showEventDetail(info.event); },
                select: function(info) { openAddEventModal(info); },
                eventClassNames: function(arg) {
                    const props = arg.event.extendedProps;
                    let cls = 'fc-event-' + (props.type || 'general');
                    if (props.subType) cls += ' fc-event-' + props.type + '-' + props.subType;
                    return [cls];
                },
                eventContent: function(arg) {
                    const props = arg.event.extendedProps;
                    let icon = '';
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
                    
                    return { html: '<div class="fc-content overflow-hidden text-[11px] py-0.5">' + icon + '<span>' + arg.event.title + '</span></div>' };
                }
            });
            calendar.render();
        });

        async function loadFacilities() {
            try {
                const res = await fetch('/api/hrd/facilities');
                const json = await res.json();
                if (json.success) {
                    const select = document.getElementById('facilitySelect');
                    select.innerHTML = '';
                    if (json.data.length === 0) {
                        select.innerHTML = '<option value="">등록된 시설 없음</option>';
                    } else {
                        json.data.forEach(fac => {
                            const opt = document.createElement('option');
                            opt.value = fac.id;
                            opt.textContent = fac.name;
                            select.appendChild(opt);
                        });
                    }
                }
            } catch (e) { console.error('Failed to load facilities:', e); }
        }

        function handleTypeChange() {
            const type = document.getElementById('eventType').value;
            const facilityField = document.getElementById('facilityField');
            const categoryField = document.getElementById('categoryField');
            const consultationTypeField = document.getElementById('consultationTypeField');
            const titleField = document.getElementById('titleField');
            const userFields = document.getElementById('userFields');
            const allDayWrapper = document.getElementById('allDayWrapper');
            
            const labelTitle = document.getElementById('labelTitle');
            const labelUser = document.getElementById('labelUser');
            
            // Default visibility
            facilityField.classList.add('hidden');
            categoryField.classList.add('hidden');
            consultationTypeField.classList.add('hidden');
            titleField.classList.remove('hidden');
            userFields.classList.remove('hidden');
            allDayWrapper.classList.add('hidden');

            if (type === 'facility') {
                facilityField.classList.remove('hidden');
                labelTitle.textContent = '예약 목적';
                labelUser.textContent = '예약자명';
                document.getElementById('eventUserName').value = '관리자';
            } else if (type === 'schedule') {
                categoryField.classList.remove('hidden');
                labelTitle.textContent = '일정 제목';
                userFields.classList.add('hidden'); // 일반 일정은 예약자 정보 불필요
                allDayWrapper.classList.remove('hidden');
            } else if (type === 'consultation') {
                consultationTypeField.classList.remove('hidden');
                titleField.classList.add('hidden'); // 상담은 제목 없음 (메시지로 대체)
                labelUser.textContent = '상담자(학생명)';
                document.getElementById('eventUserName').value = '';
            }
        }

        function showEventDetail(event) {
            const props = event.extendedProps;
            document.getElementById('modalEventName').textContent = event.title;
            
            const start = event.start;
            const end = event.end;
            let timeStr = event.allDay ? '종일' : start.toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'});
            if (!event.allDay && end) timeStr += ' ~ ' + end.toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'});
            document.getElementById('modalTime').querySelector('span').textContent = timeStr;

            document.getElementById('modalLocation').textContent = props.roomId || props.facilityName || '-';
            document.getElementById('modalCategory').textContent = props.category || (props.type === 'facility' ? '시설' : '-');
            
            let desc = props.description || '';
            const badge = document.getElementById('modalBadge');
            const btnViewCourse = document.getElementById('btnViewCourse');
            btnViewCourse.style.display = 'none';

            if (props.type === 'course') {
                const statusMap = { active: '진행중', recruiting: '모집중', in_progress: '진행중', upcoming: '모집중', closed: '마감', completed: '마감', preparing: '준비', always_open: '상시모집' };
                const statusColorMap = { active: 'green', recruiting: 'blue', in_progress: 'green', upcoming: 'blue', closed: 'gray', completed: 'gray', preparing: 'cyan', always_open: 'purple' };
                const s = props.status || 'active';
                const sLabel = statusMap[s] || s;
                
                badge.className = "px-2 py-1 rounded text-xs font-bold bg-" + (statusColorMap[s] || "blue") + "-100 text-" + (statusColorMap[s] || "blue") + "-700 mb-2 inline-block";
                badge.textContent = "교육과정(" + sLabel + ")";
                
                desc = "[상태] " + sLabel + "\\n[장소]" + (props.roomId || '미정') + '\\n' + desc;
                
                btnViewCourse.style.display = 'block';
                btnViewCourse.textContent = 'LMS 바로가기';
                btnViewCourse.onclick = () => location.href = '/admin/courses/' + event.id.split('-')[1] + '/lms';
            } else if (props.type === 'facility') {
                badge.className = 'px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 mb-2 inline-block';
                badge.textContent = '시설예약';
                desc = '[목적] ' + (props.purpose || '-') + '\\n[예약자] ' + (props.userName || '-') + '\\n[내용] ' + desc;
                btnViewCourse.style.display = 'block';
                btnViewCourse.textContent = '시설 관리';
                btnViewCourse.onclick = () => location.href = '/admin/facilities';
            } else if (props.type === 'consultation') {
                const isPending = props.status === 'pending';
                if (props.subType === 'hrd') {
                    badge.className = 'px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700 mb-2 inline-block';
                    badge.textContent = '재학생 면담';
                } else {
                    badge.className = isPending ? 'px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700 mb-2 inline-block' : 'px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700 mb-2 inline-block';
                    badge.textContent = props.isInquiry ? (isPending ? '온라인문의(신규)' : '온라인문의(완료)') : '상담';
                }
                
                if (props.isInquiry) {
                    btnViewCourse.style.display = 'block';
                    btnViewCourse.textContent = '문의 내역 보기';
                    btnViewCourse.onclick = () => location.href = '/admin/inquiries?id=' + event.id.split('-')[1];
                } else if (props.subType === 'hrd') {
                    btnViewCourse.style.display = 'block';
                    btnViewCourse.textContent = '상담 일지';
                    btnViewCourse.onclick = () => location.href = '/admin/counseling?search=' + encodeURIComponent(props.clientName || '');
                }

                const statusText = isPending ? '<span class="text-orange-500 font-bold">신규</span>' : '<span class="text-slate-500">답변완료</span>';
                desc = "[상태] " + statusText + "\\n[대상] " + (props.clientName||"-") + "\\n[연락처] " + (props.phone || "-") + "\\n[내용] " + desc;
                if(props.memo) desc += "\\n[상담원 메모] " + props.memo;
                if(props.result) desc += "\\n[결과] " + props.result;
            } else {
                badge.className = 'px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 mb-2 inline-block';
                badge.textContent = '일정';
            }

            document.getElementById('modalDesc').innerHTML = desc.replace(/\\n/g, '<br>') || '내용 없음';
            document.getElementById('eventModal').classList.remove('hidden');
        }

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function openAddEventModal(info) {
    // Reset fields
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDesc').value = '';
    document.getElementById('eventPhone').value = '';
    document.getElementById('eventUserName').value = '관리자';
    document.getElementById('eventAllDay').checked = false;

    const now = new Date();
    let start = now;
    let end = new Date(now.getTime() + 60 * 60 * 1000);

    if (info) {
        start = info.start;
        end = info.end;
        if (info.allDay) {
            document.getElementById('eventAllDay').checked = true;
            // FullCalendar returns next day 00:00 for exclusive end date
            const tempEnd = new Date(info.end);
            tempEnd.setDate(tempEnd.getDate() - 1);
            tempEnd.setHours(23, 59, 0, 0); // Set to end of day? Or just keep date.
            // For datetime-local input, we need time. 
            // If AllDay, create defaults 09:00 - 18:00
            start.setHours(9, 0, 0, 0);
            end = new Date(tempEnd);
            end.setHours(18, 0, 0, 0);
            if (start >= end) end = new Date(start.getTime() + 3600000);
        }
    }

    document.getElementById('eventStart').value = toLocalISOString(start);
    document.getElementById('eventEnd').value = toLocalISOString(end);

    // Trigger UI update
    handleTypeChange();

    document.getElementById('addEventModal').classList.remove('hidden');
}

function toLocalISOString(date) {
    const pad = n => n.toString().padStart(2, '0');
    return \`\${date.getFullYear()}-\${pad(date.getMonth()+1)}-\${pad(date.getDate())}T\${pad(date.getHours())}:\${pad(date.getMinutes())}\`;
        }

        async function submitEvent() {
            const type = document.getElementById('eventType').value;
            const start = document.getElementById('eventStart').value; 
            const end = document.getElementById('eventEnd').value;
            let title = document.getElementById('eventTitle').value;
            
            const payload = { type, start, end, description: document.getElementById('eventDesc').value, meta: {} };

            if (type === 'facility') {
                 if(!title) { alert('예약 목적을 입력해주세요.'); return; }
                 const facilityId = document.getElementById('facilitySelect').value;
                 if (!facilityId) { alert('시설을 선택해주세요.'); return; }
                 payload.title = title;
                 payload.meta = {
                     facilityId,
                     userName: document.getElementById('eventUserName').value,
                     phone: document.getElementById('eventPhone').value
                 };
            } else if (type === 'schedule') {
                 if(!title) { alert('일정 제목을 입력해주세요.'); return; }
                 payload.title = title;
                 payload.allDay = document.getElementById('eventAllDay').checked;
                 payload.meta = { category: document.getElementById('eventCategory').value };
            } else if (type === 'consultation') {
                 const name = document.getElementById('eventUserName').value;
                 if(!name) { alert('상담자명을 입력해주세요.'); return; }
                 payload.title = name + ' 상담'; // Backup title
                 payload.meta = {
                     clientName: name,
                     phone: document.getElementById('eventPhone').value,
                     consultationType: document.getElementById('consultationType').value
                 };
            }

            try {
                const res = await fetch('/api/schedules/events', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if(data.success) {
                    alert('일정이 등록되었습니다.');
                    closeModal('addEventModal');
                    calendar.refetchEvents();
                } else {
                    alert('등록 실패: ' + data.error);
                }
            } catch(e) { alert('오류 발생: ' + e.message); }
        }

        function toggleSource(type) {
             const isChecked = event.target.checked;
             if (isChecked) document.body.classList.remove('hide-' + type);
             else document.body.classList.add('hide-' + type);
        }
    </script>
    <style>
        .hide-course .fc-event-course { display: none !important; }
        .hide-facility .fc-event-facility { display: none !important; }
        .hide-consultation .fc-event-consultation-inquiry { display: none !important; }
        .hide-hrd .fc-event-consultation-hrd { display: none !important; }
        .hide-general .fc-event-schedule { display: none !important; }
    </style>
</body>
</html>
`;
