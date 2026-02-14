
import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsTrainingLogsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련일지 관리 - 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
    </style>
</head>
<body class="bg-gray-50 overflow-x-hidden">
    <div class="flex h-screen min-h-0 overflow-hidden">
        ${hrdSidebar('courses')}
        
        <div class="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
            <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
                ${lmsHeaderHtml('training-logs', 'hrd')}

    <!-- 서브 헤더 (훈련일지 전용) -->
     <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">훈련일지 관리 & NCS 연동</h1>
            <div class="flex gap-2">
                <button onclick="openLogModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                    <i class="fas fa-pen-nib mr-2"></i> 오늘 일지 작성
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- 왼쪽: NCS 이수 현황 -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-tasks text-indigo-500 mr-2"></i> NCS 이수 현황
                    </h3>
                    <div id="ncsProgress" class="space-y-4">
                        <div class="text-center text-gray-400 py-4 text-sm">기록을 불러오는 중...</div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽: 일지 목록 -->
            <div class="lg:col-span-3 min-w-0">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[640px]">
                        <thead class="bg-gray-50/50 border-b">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">일자</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">훈련 주제 및 내용</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">NCS 연동</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">시간</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24"></th>
                            </tr>
                        </thead>
                        <tbody id="logTableBody" class="divide-y divide-gray-50">
                            <!-- JS Load -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- 일지 등록 모달 -->
    <!-- 일지 등록 모달 -->
    <!-- 일지 등록 모달 -->
    <div id="logModal" class="fixed inset-0 bg-black/60 hidden z-[60] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] min-h-0 flex flex-col my-4 transform transition-all border border-gray-100 shadow-2xl">
            <!-- Header -->
            <div class="p-6 border-b flex-none flex justify-between items-center bg-gray-50 rounded-t-xl z-10 relative shrink-0">
                 <div class="flex items-center gap-2">
                    <i class="fas fa-calendar-check text-indigo-600 text-xl"></i>
                    <h3 class="text-xl font-bold text-gray-900" id="modalTitle">훈련일지 작성</h3>
                 </div>
                <button onclick="closeLogModal()" class="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"><i class="fas fa-times text-lg"></i></button>
            </div>

            <form id="logForm" onsubmit="handleSaveLog(event)" class="p-8 space-y-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar bg-white">
                <input type="hidden" id="logId">
                
                <!-- 상단 설정 바 (Administrative Fields) -->
                <div class="flex flex-wrap gap-4 items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div class="flex gap-4 items-center flex-1">
                         <div class="flex flex-col">
                            <label class="text-[10px] font-bold text-indigo-400 uppercase mb-1">훈련 시간 (H)</label>
                            <input type="number" id="logHours" value="8" min="0" max="24" class="px-3 py-1.5 border border-indigo-200 rounded-md text-sm w-20 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                         </div>
                         <div class="flex flex-col flex-1 max-w-md">
                            <label class="text-[10px] font-bold text-indigo-400 uppercase mb-1">NCS 능력단위</label>
                            <select id="logNcsUnitId" class="px-3 py-1.5 border border-indigo-200 rounded-md text-sm w-full font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="">선택 안함</option>
                            </select>
                         </div>
                    </div>
                    <div class="flex flex-col w-full md:w-auto md:min-w-[400px]">
                         <label class="text-[10px] font-bold text-indigo-400 uppercase mb-1">훈련 주제 <span class="text-red-400">*</span></label>
                         <input type="text" id="logTopic" class="px-3 py-1.5 border border-indigo-200 rounded-md text-sm w-full font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="주제를 입력하세요">
                    </div>
                </div>
            
                <!-- Paper Form Container (Visual Match to Print) -->
                <div class="border-2 border-gray-800 p-8 shadow-sm relative">
                    <div class="absolute top-0 left-0 bg-gray-800 text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">Print Preview Layout</div>
                    
                    <!-- Header Section -->
                    <div class="flex justify-between items-end mb-6 mt-4">
                        <h1 class="text-3xl font-black text-center w-full absolute left-0 right-0 pointer-events-none opacity-10 select-none">훈련일지</h1>
                        
                        <div class="ml-auto z-10">
                            <table class="border-collapse border border-gray-800 text-xs bg-white">
                                <tr>
                                   <td rowspan="2" class="border border-gray-800 bg-gray-50 font-bold p-1 text-center w-8">결<br>재</td>
                                   <td class="border border-gray-800 bg-gray-50 font-bold p-1 w-16 text-center">담 당</td>
                                   <td class="border border-gray-800 bg-gray-50 font-bold p-1 w-16 text-center">원 장</td>
                                </tr>
                                <tr>
                                   <td class="border border-gray-800 h-14 bg-gray-50/10 cursor-not-allowed"></td>
                                   <td class="border border-gray-800 h-14 bg-gray-50/10 cursor-not-allowed"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
            
                    <!-- Info Table -->
                    <table class="w-full border-collapse border border-gray-800 text-sm mb-4">
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-32">훈련기관명</td>
                            <td class="border border-gray-800 p-2 text-center font-medium">쓰리디쿠키 홍대센터</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-24">훈련일</td>
                            <td class="border border-gray-800 p-1 text-center bg-white">
                                <input type="date" id="logDate" required class="w-full text-center font-bold bg-transparent outline-none cursor-pointer text-gray-800 hover:text-indigo-600">
                            </td>
                        </tr>
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">훈련과정명</td>
                            <td class="border border-gray-800 p-2 text-center font-medium tracking-tight text-xs text-gray-800" id="logCourseName">-</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">재적</td>
                            <td class="border border-gray-800 p-2 text-center text-gray-400 italic">- 명</td>
                        </tr>
                    </table>
            
                    <!-- Attendance Input Table -->
                    <table class="w-full border-collapse border border-gray-800 text-sm mb-6">
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">출석</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttPresent" class="w-full h-full p-2 text-center font-bold outline-none text-indigo-600 focus:bg-indigo-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">결석</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttAbsent" class="w-full h-full p-2 text-center font-bold outline-none text-rose-600 focus:bg-rose-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">지각</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttLate" class="w-full h-full p-2 text-center font-bold outline-none text-amber-600 focus:bg-amber-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">조퇴</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttEarly" class="w-full h-full p-2 text-center font-bold outline-none text-amber-600 focus:bg-amber-50 transition-colors" placeholder="0"></td>
                        </tr>
                    </table>
            
                    <!-- Schedule Section -->
                    <div class="bg-gray-200 border border-gray-800 border-b-0 p-2 text-center font-bold text-sm">훈 련 사 항</div>
                    <table class="w-full border-collapse border border-gray-800 text-xs mb-0">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="border border-gray-800 p-2 w-12">교시</th>
                                <th class="border border-gray-800 p-2 w-40">훈련과목</th>
                                <th class="border border-gray-800 p-2 w-20">담당교사</th>
                                <th class="border border-gray-800 p-2">훈련 내용</th>
                                <th class="border border-gray-800 p-2 w-28">비고</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleTableBody">
                            <!-- JS Generated -->
                        </tbody>
                    </table>
                    <div class="flex justify-end mt-1 mb-2">
                         <button type="button" onclick="loadDailySchedule()" class="text-xs text-indigo-600 hover:text-indigo-800 underline font-bold px-2 py-1 flex items-center gap-1"><i class="fas fa-sync-alt"></i> 시간표 불러오기</button>
                    </div>
            
                    <!-- Footer Lists -->
                     <table class="w-full border-collapse border border-gray-800 border-t-0 text-xs mt-1">
                        <tr>
                             <td class="bg-gray-200 border-r border-b border-gray-800 p-2 w-32 text-center font-bold" rowspan="2">지시사항</td>
                             <td class="border-b border-gray-800 p-0 h-16 align-top">
                                <textarea id="logInstructions" class="w-full h-full resize-none outline-none p-2 focus:bg-gray-50 transition-colors" placeholder="지시사항을 입력하세요"></textarea>
                             </td>
                        </tr>
                     </table>
                     <table class="w-full border-collapse border border-gray-800 border-t-0 text-xs text-left">
                        <tr>
                             <td class="bg-gray-200 border-r border-gray-800 p-2 w-32 text-center font-bold" rowspan="5">특기<br>사항</td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">지각자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListLate" class="w-full h-full px-2 outline-none focus:bg-gray-50 transition-colors" placeholder="이름 입력 (쉼표로 구분)"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">결석자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListAbsent" class="w-full h-full px-2 outline-none focus:bg-gray-50 transition-colors" placeholder="이름 입력 (쉼표로 구분)"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">조퇴자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListEarly" class="w-full h-full px-2 outline-none focus:bg-gray-50 transition-colors" placeholder="이름 입력 (쉼표로 구분)"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-gray-800 p-2 w-24 text-center font-bold">기타사항</td>
                             <td class="border-gray-800 p-0 h-20 align-top">
                                <textarea id="logContent" class="w-full h-full resize-none outline-none p-2 leading-relaxed focus:bg-gray-50 transition-colors" placeholder="기타 전달사항 및 특이사항을 입력하세요"></textarea>
                             </td>
                        </tr>
                     </table>
                </div>
            
                <!-- Hidden elements picker (Legacy but maybe needed for NCS logic? kept hidden) -->
                <div id="elementsPicker" class="hidden"></div> 
            
                <div class="flex justify-center gap-3 pt-4">
                    <button type="button" onclick="closeLogModal()" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition shadow-sm">취소</button>
                    <button type="submit" class="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const rawId = window.location.pathname.split('/')[3];
        const courseId = rawId ? parseInt(rawId) : rawId;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        let assignedUnits = [];

        document.addEventListener('DOMContentLoaded', () => {
            const logDateInput = document.getElementById('logDate');
            if (logDateInput) {
                logDateInput.valueAsDate = new Date();
                logDateInput.addEventListener('change', () => {
                    loadDailySchedule();
                });
            }
            loadLogs();
            loadAssignedUnits();
            
            // 초기 로드시 오늘 날짜 시간표 로드 (신규 작성 시 편의)
            // 단, loadLogs()가 비동기이므로 시간차 두고 실행하거나, openLogModal() 시점에 실행하는게 나을 수도 있음.
            // 여기서는 일단 날짜 기본값이 오늘이므로 세팅만 함.
        });

        async function loadAssignedUnits() {
            try {
                const res = await fetch(\`/api/ncs/courses/\${courseId}\`);
                const result = await res.json();
                if (result.success) {
                    assignedUnits = result.data;
                    const select = document.getElementById('logNcsUnitId');
                    if (select) {
                        assignedUnits.forEach(u => {
                            const opt = document.createElement('option');
                            opt.value = u.ncs_unit_id;
                            opt.textContent = \`[\${u.code}] \${u.name}\`;
                            select.appendChild(opt);
                        });
                    }
                }
            } catch (e) { console.error(e); }
        }

        const unitSelect = document.getElementById('logNcsUnitId');
        if (unitSelect) {
            unitSelect.addEventListener('change', async (e) => {
                const unitId = e.target.value;
                const picker = document.getElementById('elementsPicker');
                const container = document.getElementById('elementCheckboxes');
                
                if (!unitId || !picker || !container) {
                    if (picker) picker.classList.add('hidden');
                    return;
                }

                try {
                    const res = await fetch(\`/api/ncs/units/\${unitId}/elements\`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const result = await res.json();
                    if (result.success && result.data.length > 0) {
                        picker.classList.remove('hidden');
                        container.innerHTML = result.data.map(el => \`
                            <label class="flex items-center gap-3 p-2.5 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-100 group">
                                <input type="checkbox" name="ncs_element" value="\${el.id}" class="w-5 h-5 text-indigo-600 rounded-lg border-gray-200 focus:ring-indigo-500 transition-all">
                                <div class="text-sm">
                                    <span class="font-black text-indigo-300 mr-2 uppercase tracking-tighter group-hover:text-indigo-500 transition-all font-mono">\${el.code}</span>
                                    <span class="text-gray-600 font-bold group-hover:text-indigo-900 transition-all">\${el.name}</span>
                                </div>
                            </label>
                        \`).join('');
                    } else {
                        picker.classList.add('hidden');
                    }
                } catch (e) { console.error(e); }
            });
        }

        async function loadLogs() {
            try {
                const res = await fetch(\`/api/hrd/training-logs?courseId=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    renderLogs(result.data);
                    calculateNcsProgress();
                }
            } catch (e) { console.error(e); }
        }

        function renderLogs(logs) {
            const tbody = document.getElementById('logTableBody');
            if (!tbody) return;
            if (!logs || logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">등록된 훈련일지가 없습니다.\\n새로운 일지를 작성하여 NCS 이수 시간을 관리하세요.</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(log => \`
                    <tr class="hover:bg-indigo-50/30 transition-all duration-200 group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">
                        <td class="px-6 py-5 whitespace-nowrap text-[11px] font-black text-indigo-300 uppercase tracking-widest">\${log.date}</td>
                        <td class="px-6 py-5">
                            <div class="font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">\${log.topic}</div>
                            <div class="text-xs text-gray-400 truncate max-w-lg font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all">\${log.content || '-'}</div>
                        </td>
                        <td class="px-6 py-5">
                            \${log.ncs_unit_name ? \`
                                <div class="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-md text-[9px] font-black border border-indigo-100/50 mb-1 shadow-sm">
                                    \${log.ncs_unit_code}
                                </div>
                                <div class="text-[10px] text-gray-500 font-black truncate leading-none opacity-60 group-hover:opacity-100 transition-all font-sans uppercase tracking-tighter">\${log.ncs_unit_name}</div>
                            \` : '<span class="text-gray-200 text-xs font-black tracking-widest leading-none">-</span>'}
                        </td>
                        <td class="px-6 py-5 text-center font-black text-slate-700 text-sm shadow-[inset_1px_0_0_0_rgba(248,250,252,1)] shadow-[inset_-1px_0_0_0_rgba(248,250,252,1)]">\${log.training_hours}h</td>
                        <td class="px-6 py-5 text-right">
                            <div class="flex items-center justify-end gap-2.5 transition-all">
                                <button onclick="printLog(\${log.id})" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-md transition-all rounded-xl active:scale-90">
                                    <i class="fas fa-print text-xs"></i>
                                </button>
                                <button onclick="editLog(\${JSON.stringify(log).replace(/"/g, '&quot;')})" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all rounded-xl active:scale-90">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <button onclick="deleteLog(\${log.id})" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-md transition-all rounded-xl active:scale-90">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                \`).join('');
        }

async function printLog(id) {
    try {
        // Fetch Data: Log, Session, Enrollments, AND All Logs for counting days
        const [logRes, sessionRes, enrollRes, allLogsRes] = await Promise.all([
            fetch('/api/hrd/training-logs/' + id, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/course-sessions/' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/enrollments?sessionId=' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/hrd/training-logs?courseId=' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json())
        ]);

        if (!logRes.success) throw new Error(logRes.error || '일지 로드 실패');

        const log = logRes.data;
        const session = sessionRes.success ? sessionRes.data : { course_name: '-', session_number: '', total_hours: 0, daily_hours: 0 };
        const enrollCount = (enrollRes.success && Array.isArray(enrollRes.data))
            ? enrollRes.data.filter(e => e.status === 'approved').length
            : 0;

        // Calculate Day Count (Nth day / Total days)
        let currentDayCount = 1;
        let totalDays = 0;

        if (allLogsRes.success && Array.isArray(allLogsRes.data)) {
            // Sort logs by date ascending
            const sortedLogs = allLogsRes.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const index = sortedLogs.findIndex(l => l.id === log.id);
            if (index !== -1) currentDayCount = index + 1;
        }

        if (session.total_hours && session.daily_hours) {
            totalDays = Math.ceil(session.total_hours / session.daily_hours);
        } else if (session.training_start_date && session.training_end_date) {
            // Fallback to date diff if hours are missing (though inaccurate for weekdays)
            const start = new Date(session.training_start_date);
            const end = new Date(session.training_end_date);
            const diffTime = Math.abs(end - start);
            totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        const scheduleDetails = log.schedule_details_json ? JSON.parse(log.schedule_details_json) : [];
        const attendance = log.attendance_summary_json ? JSON.parse(log.attendance_summary_json) : { present: '', absent: '', late: '', early: '' };
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[new Date(log.date).getDay()];

        // Schedule Rows
        let scheduleRows = '';
        for (let i = 1; i <= 8; i++) {
            const sch = scheduleDetails.find(s => s.period === i);
            scheduleRows += \`
                        <tr>
                            <td class="border border-black p-2 h-10 text-center">\${i}</td>
                            <td class="border border-black p-2 text-center font-bold text-sm">\${sch ? (sch.subject || '') : ''}</td>
                            <td class="border border-black p-2 text-center font-bold text-sm">\${sch ? (sch.instructor || '') : ''}</td>
                            <td class="border border-black p-2 text-left px-3 text-sm">\${sch ? (sch.content || '') : ''}</td>
                            <td class="border border-black p-2 text-center text-sm">\${sch ? (sch.note || '') : ''}</td>
                        </tr>
                    \`;
                }

                const popup = window.open('', '_blank', 'width=1100,height=1200,scrollbars=yes');
                if(!popup) { alert('팝업 차단을 해제해주세요.'); return; }

                const htmlContent = \`
                    <!DOCTYPE html>
                    <html lang="ko">
                    <head>
                        <meta charset="UTF-8">
                        <title>훈련일지 인쇄</title>
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
                        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
                            * { box-sizing: border-box; }
                            body { font-family: "Noto Sans KR", sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; background-color: #f3f4f6; }
                            table { border-collapse: collapse; width: 100%; border-spacing: 0; table-layout: fixed; }
                            td, th { border: 1px solid #000; padding: 0; vertical-align: middle; word-break: break-all; }
                            .container { width: 210mm; background: white; margin: 30px auto; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; }
                            
                            /* Header Area */
                            .header-area { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; position: relative; height: 100px; }
                            .title { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 2px; }
                            
                            /* Approval Box */
                            .approval-box { width: 200px; border: 1px solid #000; margin-left: auto; position: relative; z-index: 10; font-size: 12px; }
                            .approval-box td { text-align: center; }
                            .approval-label-cell { width: 30px; background-color: #f9fafb; font-weight: bold; }
                            .approval-role-cell { height: 24px; background-color: #f9fafb; font-weight: bold; }
                            .approval-sign-cell { height: 60px; }
                            
                            /* Info Tables */
                            .info-table { margin-bottom: 10px; font-size: 13px; }
                            .info-table .label { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 120px; padding: 8px; }
                            .info-table .value { padding: 8px 12px; text-align: center; font-weight: bold; }
                            .info-table .date-value { font-size: 13px; }
                            
                            /* Attendance Table */
                            .att-table { margin-bottom: 15px; font-size: 13px; }
                            .att-table .label { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 80px; padding: 8px; }
                            .att-table .value { text-align: center; padding: 8px; font-weight: bold; }
                            
                            /* Schedule Table */
                            .schedule-main-header { background-color: #d1d5db; font-weight: bold; text-align: center; padding: 8px; border-bottom: none; font-size: 14px; }
                            .schedule-table { margin-bottom: 0; font-size: 12px; }
                            .schedule-table th { background-color: #e5e7eb; padding: 8px; text-align: center; font-weight: bold; }
                            .col-period { width: 50px; }
                            .col-subject { width: 180px; }
                            .col-instructor { width: 100px; }
                            .col-content { }
                            .col-note { width: 120px; }
                            
                            /* Footer Tables */
                            .footer-table { margin-top: -1px; font-size: 12px; }
                            .footer-label-main { background-color: #d1d5db; font-weight: bold; text-align: center; width: 100px; }
                            .footer-label-sub { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 100px; }
                            .footer-content { padding: 5px 10px; text-align: left; }
                            
                            /* Print Control */
                            .print-controls { position: fixed; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); padding: 15px; text-align: center; z-index: 9999; display: flex; justify-content: center; gap: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
                            .btn { padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; border: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; color: white; transition: all 0.2s; }
                            .btn-blue { background-color: #3b82f6; }
                            .btn-blue:hover { background-color: #2563eb; }
                            .btn-orange { background-color: #f97316; }
                            .btn-orange:hover { background-color: #ea580c; }
                            .btn-gray { background-color: #6b7280; }
                            .btn-gray:hover { background-color: #4b5563; }
                            
                            @media print {
                                .print-controls { display: none !important; }
                                body { background: white; -webkit-print-color-adjust: exact; }
                                .container { width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
                                @page { margin: 10mm; size: A4 portrait; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-controls">
                            <!-- Mimicking the buttons in the screenshot -->
                            <button class="btn btn-blue" onclick="alert('이미지 삽입 기능은 준비중입니다.')"><i class="fas fa-image"></i> 이미지 삽입</button>
                            <button class="btn btn-orange" onclick="window.print()"><i class="fas fa-print"></i> 프린트</button>
                            <button class="btn btn-gray" onclick="window.close()"><i class="fas fa-times"></i> 닫기</button>
                        </div>

                        <div class="container">
                            <div class="header-area">
                                <div class="title">훈 련 일 지</div>
                                <table class="approval-box">
                                    <tr>
                                        <td rowspan="2" class="approval-label-cell">결<br>재</td>
                                        <td class="approval-role-cell">담 당</td>
                                        <td class="approval-role-cell">원 장</td>
                                    </tr>
                                    <tr>
                                        <td class="approval-sign-cell">
                                            <!-- Placeholder for sign/stamp -->
                                            <i class="fas fa-camera text-gray-200 text-lg"></i>
                                        </td>
                                        <td class="approval-sign-cell">
                                            <i class="fas fa-camera text-gray-200 text-lg"></i>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <table class="info-table">
                                <tr>
                                    <td class="label">훈련기관명</td>
                                    <td class="value">쓰리디쿠키 홍대센터(3D쿠키 홍대센터)</td>
                                    <td class="label">훈련일</td>
                                    <td class="value date-value">\${log.date} \${dayName}요일<br><span style="font-weight:normal; font-size:12px;">(\${currentDayCount}일 / \${totalDays}일)</span></td>
                                </tr>
                                <tr>
                                    <td class="label">훈련과정명</td>
                                    <td class="value">\${session.session_number ? session.session_number + '회차 ' : ''}\${session.course_name}</td>
                                    <td class="label">재적</td>
                                    <td class="value">\${enrollCount} 명</td>
                                </tr>
                            </table>

                            <table class="att-table">
                                <tr>
                                    <td class="label">출석</td>
                                    <td class="value">\${attendance.present || ''}</td>
                                    <td class="label">결석</td>
                                    <td class="value">\${attendance.absent || ''}</td>
                                    <td class="label">지각</td>
                                    <td class="value">\${attendance.late || ''}</td>
                                    <td class="label">조퇴</td>
                                    <td class="value">\${attendance.early || ''}</td>
                                </tr>
                            </table>

                            <table class="schedule-table" style="border-bottom:none;">
                                <tr>
                                    <td colspan="5" class="schedule-main-header">훈 련 사 항</td>
                                </tr>
                                <tr>
                                    <th class="col-period">교시</th>
                                    <th class="col-subject">훈련과목</th>
                                    <th class="col-instructor">담당교사</th>
                                    <th class="col-content">훈련 내용</th>
                                    <th class="col-note">비고<br>(불참자 등)</th>
                                </tr>
                                \${scheduleRows}
                            </table>
                            
                            <!-- Adding dummy rows if less than 8 periods? No, just sticking to 8 periods fixed loop as implemented -->
                            
                            <table class="footer-table">
                                <tr>
                                    <td class="footer-label-main">지시사항</td>
                                    <td colspan="2" class="footer-content" style="height: 60px;"></td>
                                </tr>
                                <tr>
                                    <td rowspan="4" class="footer-label-main">특기<br>사항</td>
                                    <td class="footer-label-sub">지각자</td>
                                    <td class="footer-content" style="height: 30px;"></td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">결석자</td>
                                    <td class="footer-content" style="height: 30px;"></td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">조퇴자</td>
                                    <td class="footer-content" style="height: 30px;"></td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">기타사항<br><span style="font-weight:normal; font-size:10px;">(전달사항, 외출자 등)</span></td>
                                    <td class="footer-content" style="height: 60px; vertical-align: top;">
                                        \${log.content || ''}
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top: 30px; text-align: center;" class="no-print">
                                <button class="btn btn-orange" style="margin-right: 10px;">문서수정</button>
                                <button class="btn" style="background-color: #ef4444;" onclick="window.close()">문서삭제</button>
                            </div>
                        </div>
                    </body>
                    </html>
                \`;
                
                popup.document.open();
                popup.document.write(htmlContent);
                popup.document.close();
            } catch(e) {
                console.error(e);
                alert('인쇄 오류: ' + e.message);
            }
        }

        async function deleteLog(id) {
            if (!confirm('정말로 이 일지를 삭제하시겠습니까?\\n관련 NCS 이수 시간도 함께 삭제됩니다.')) return;
            
            try {
                const res = await fetch(\`/api/hrd/training-logs/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    loadLogs();
                    calculateNcsProgress();
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
        
        window.printLog = printLog;
        window.deleteLog = deleteLog;

        async function calculateNcsProgress() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                const container = document.getElementById('ncsProgress');
                if (!container) return;
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        const isComplete = percent >= 100;
                        
                        return \`
                            <div class="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">\${item.unit_code}</span>
                                        <span class="text-xs font-black text-slate-700 truncate max-w-[120px] transition-colors group-hover:text-indigo-600 uppercase tracking-tight">\${item.unit_name}</span>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-[10px] font-black \${isComplete ? 'text-emerald-500' : 'text-indigo-500' }">\${item.current_hours} / \${item.target_hours}h</span>
                                        <span class="text-[10px] font-black text-slate-300 group-hover:text-indigo-300 transition-all font-mono italic">\${percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden shadow-inner ring-1 ring-slate-50">
                                    <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)] \${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    container.innerHTML = '<div class="text-center text-slate-400 py-10 text-xs font-bold border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 uppercase tracking-widest opacity-60">NCS 배정 정보 없음</div>';
                }
            } catch (e) {
                console.error(e);
                const container = document.getElementById('ncsProgress');
                if (container) container.innerHTML = '<div class="text-center text-rose-400 py-4 text-xs font-bold uppercase tracking-widest ring-1 ring-rose-50 rounded-xl bg-rose-50/10">데이터 로드 실패</div>';
            }
        }


        // --------------------------------------------------------------------------------------------------------------------------------
        // Schedule Functions (New)
        // --------------------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------------------
        // Schedule Functions (New)
        // --------------------------------------------------------------------------------------------------------------------------------
        async function loadDailySchedule() {
            const dateInput = document.getElementById('logDate');
            if (!courseId || !dateInput || !dateInput.value) {
                // alert('훈련 일자를 선택해주세요.');
                return;
            }
            
            const tbody = document.getElementById('scheduleTableBody');
            if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-gray-400 font-bold animate-pulse">시간표 불러오는 중...</td></tr>';

            try {
                const res = await fetch(\`/api/hrd/training-logs/daily-schedule?courseId=\${courseId}&date=\${dateInput.value}\`, {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    const existingData = null; 
                    renderScheduleTable(result.data, existingData);
                } else {
                     if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">시간표 조회 실패</td></tr>';
                }
            } catch (e) {
                console.error(e);
                if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">오류 발생</td></tr>';
            }
        }

        function renderScheduleTable(dbSchedules, savedDetails = null) {
            const tbody = document.getElementById('scheduleTableBody');
            if (!tbody) return;
            
            let html = '';
            for (let i = 1; i <= 8; i++) {
                const saved = savedDetails ? savedDetails.find(s => s.period === i) : null;
                const dbSch = dbSchedules ? dbSchedules.find(s => s.period_number === i) : null;

                const subject = saved ? saved.subject : (dbSch ? dbSch.subject_name : '');
                const instructor = saved ? saved.instructor : (dbSch ? dbSch.instructor_name : '');
                const content = saved ? saved.content : '';
                const note = saved ? saved.note : '';
                
                html += \`
                    <tr class="hover:bg-indigo-50/30 transition-colors group">
                        <td class="px-2 py-2 text-center border-r font-black text-gray-400 bg-gray-50/50">\${i}교시</td>
                        <td class="px-2 py-2 border-r"><input type="text" name="sch_subject_\${i}" value="\${subject || ''}" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300" placeholder="교과목"></td>
                        <td class="px-2 py-2 border-r"><input type="text" name="sch_instructor_\${i}" value="\${instructor || ''}" class="w-full px-3 py-2 border border-gray-200 rounded-md text-center text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300" placeholder="담당교사"></td>
                        <td class="px-2 py-2 border-r"><input type="text" name="sch_content_\${i}" value="\${content || ''}" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300" placeholder="훈련내용을 입력하세요"></td>
                        <td class="px-2 py-2"><input type="text" name="sch_note_\${i}" value="\${note || ''}" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300" placeholder="비고"></td>
                    </tr>
                \`;
            }
            tbody.innerHTML = html;
        }


        // --------------------------------------------------------------------------------------------------------------------------------
        // Modal & Form Logic
        // --------------------------------------------------------------------------------------------------------------------------------

        function openLogModal() {
            const elId = document.getElementById('logId');
            const elTopic = document.getElementById('logTopic');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elUnitId = document.getElementById('logNcsUnitId');
            const elPicker = document.getElementById('elementsPicker');
            const elDate = document.getElementById('logDate');

            // 초기화
            if (elId) elId.value = '';
            if (elTopic) elTopic.value = '';
            if (elContent) elContent.value = '';
            if (elHours) elHours.value = '8';
            if (elUnitId) {
                elUnitId.value = '';
                const event = new Event('change');
                elUnitId.dispatchEvent(event);
            }
            if (elPicker) elPicker.classList.add('hidden');
            if (elDate && !elDate.value) elDate.valueAsDate = new Date();
            
            // New Fields Reset
            ['logAttPresent', 'logAttAbsent', 'logAttLate', 'logAttEarly', 
             'logInstructions', 'logListLate', 'logListAbsent', 'logListEarly'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            
            // 시간표 초기화
            if (elDate && elDate.value) {
                loadDailySchedule(); 
            } else {
                renderScheduleTable(null, null); 
            }

            const elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 작성';
            
            setModalCourseName();
            
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }
        
        function setModalCourseName() {
            const el = document.getElementById('logCourseName');
            if (!el) return;
            const headerTitle = document.getElementById('header-courseTitle');
            const name = (headerTitle && headerTitle.textContent && !headerTitle.textContent.includes('불러오는 중')) 
                ? headerTitle.textContent.trim() 
                : '';
            if (name) {
                el.textContent = name;
                el.classList.remove('text-gray-400', 'italic');
                el.classList.add('text-gray-800');
            } else {
                el.textContent = '-';
                el.classList.add('text-gray-400', 'italic');
                el.classList.remove('text-gray-800');
            }
        }

        async function editLog(log) {
            const elId = document.getElementById('logId');
            const elDate = document.getElementById('logDate');
            const elTopic = document.getElementById('logTopic');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elUnitId = document.getElementById('logNcsUnitId');

            if (elId) elId.value = log.id;
            if (elDate) elDate.value = log.date;
            if (elTopic) elTopic.value = log.topic;
            if (elContent) elContent.value = log.content || ''; 
            if (elHours) elHours.value = log.training_hours;
            
            // Populate New Attendance Fields
            const fieldMap = {
                present: 'logAttPresent', absent: 'logAttAbsent', late: 'logAttLate', early: 'logAttEarly',
                instructions: 'logInstructions', late_list: 'logListLate', absent_list: 'logListAbsent', early_list: 'logListEarly'
            };
            
            if (log.attendance_summary_json) {
                try {
                    const att = JSON.parse(log.attendance_summary_json);
                    for (const [key, id] of Object.entries(fieldMap)) {
                        const el = document.getElementById(id);
                        if (el) el.value = att[key] || '';
                    }
                } catch(e) {}
            } else {
                 for (const id of Object.values(fieldMap)) {
                     const el = document.getElementById(id);
                     if (el) el.value = '';
                 }
            }
            
            if (elUnitId) {
                elUnitId.value = log.ncs_unit_id || '';
                const event = new Event('change');
                elUnitId.dispatchEvent(event);
                
                setTimeout(() => {
                    if (log.ncs_elements_json) {
                        try {
                            const selectedIds = JSON.parse(log.ncs_elements_json);
                            const checks = document.querySelectorAll('input[name="ncs_element"]');
                            checks.forEach(c => {
                                if (selectedIds.includes(parseInt(c.value))) c.checked = true;
                            });
                        } catch(e) {}
                    }
                }, 500);
            }

            // 시간표 데이터 복원
            if (log.schedule_details_json) {
                try {
                    const details = JSON.parse(log.schedule_details_json);
                    renderScheduleTable(null, details); 
                } catch(e) {
                    loadDailySchedule();
                }
            } else {
                loadDailySchedule(); 
            }

            const elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 수정';
            
            setModalCourseName();
            
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }

        function closeLogModal() { 
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.add('hidden'); 
        }

        async function handleSaveLog(e) {
            e.preventDefault();
            const elementIds = Array.from(document.querySelectorAll('input[name="ncs_element"]:checked')).map(i => parseInt(i.value));
            
            const idVal = document.getElementById('logId').value;
            const dateVal = document.getElementById('logDate').value;
            const topicVal = document.getElementById('logTopic').value;
            const contentVal = document.getElementById('logContent').value;
            const unitIdVal = document.getElementById('logNcsUnitId').value;
            const hoursVal = document.getElementById('logHours').value;

            // New Fields Collection
            const attSummary = {
                present: document.getElementById('logAttPresent')?.value || '',
                absent: document.getElementById('logAttAbsent')?.value || '',
                late: document.getElementById('logAttLate')?.value || '',
                early: document.getElementById('logAttEarly')?.value || '',
                instructions: document.getElementById('logInstructions')?.value || '',
                late_list: document.getElementById('logListLate')?.value || '',
                absent_list: document.getElementById('logListAbsent')?.value || '',
                early_list: document.getElementById('logListEarly')?.value || ''
            };

            // 시간표 데이터 수집
            const scheduleDetails = [];
            for(let i=1; i<=8; i++) {
                const subj = document.querySelector(\`input[name="sch_subject_\${i}"]\`)?.value || '';
                const inst = document.querySelector(\`input[name="sch_instructor_\${i}"]\`)?.value || '';
                const cont = document.querySelector(\`input[name="sch_content_\${i}"]\`)?.value || '';
                const note = document.querySelector(\`input[name="sch_note_\${i}"]\`)?.value || '';
                
                if(subj || inst || cont || note) {
                    scheduleDetails.push({
                        period: i,
                        subject: subj,
                        instructor: inst,
                        content: cont,
                        note: note
                    });
                }
            }

            const data = {
                id: idVal ? parseInt(idVal) : null,
                course_id: parseInt(courseId),
                instructor_id: user.id || null,
                date: dateVal,
                topic: topicVal,
                content: contentVal,
                teaching_method: '주입식/실습', 
                ncs_unit_id: unitIdVal ? parseInt(unitIdVal) : null,
                training_hours: parseInt(hoursVal),
                ncs_elements_json: JSON.stringify(elementIds),
                schedule_details_json: JSON.stringify(scheduleDetails),
                attendance_summary_json: JSON.stringify(attSummary)
            };

            try {
                const res = await fetch('/api/hrd/training-logs', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert(result.message);
                    closeLogModal();
                    loadLogs();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
