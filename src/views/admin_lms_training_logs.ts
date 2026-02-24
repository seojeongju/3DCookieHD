
import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsTrainingLogsHtml = (sidebar: string = hrdSidebar('courses')) => `
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
        ${sidebar}
        
        <div class="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
            <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
                ${lmsHeaderHtml('training-logs', 'hrd')}

    <!-- 서브 헤더 (훈련일지 전용) -->
     <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">훈련일지 관리</h1>
            <div class="flex flex-wrap gap-2 items-center">
                <button onclick="openLogModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                    <i class="fas fa-pen-nib mr-2"></i> 오늘 일지 작성
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 일지 목록 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto mb-4">
            <table class="w-full text-left border-collapse min-w-[560px]">
                <thead class="bg-gray-50/50 border-b">
                    <tr>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">일자</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">훈련 주제 및 내용</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-28 text-center">작성자</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">시간</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24"></th>
                    </tr>
                </thead>
                <tbody id="logTableBody" class="divide-y divide-gray-50">
                    <!-- JS Load -->
                </tbody>
            </table>
        </div>
        
        <!-- Pagination Controls -->
        <div id="paginationControls" class="flex justify-center flex-wrap gap-2 mb-8"></div>
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
                
                <!-- 훈련일 아님 안내 -->
                <div id="logNotTrainingDayNotice" class="hidden mb-4 p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-center gap-2">
                    <i class="fas fa-calendar-times"></i>
                    <span>훈련일이 아닙니다. 해당 날짜에는 훈련일지 작성이 제한됩니다. 훈련일을 선택해 주세요.</span>
                </div>

                <div class="flex items-center gap-4 px-2">
                     <label class="font-bold text-gray-700 text-sm"><i class="fas fa-clock text-indigo-500 mr-1"></i> 해당일 일지 훈련시간(h)</label>
                     <input type="number" id="logHours" class="border border-gray-300 rounded-lg px-3 py-1.5 w-24 text-center outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold transition-all text-gray-700 bg-gray-50 focus:bg-white" min="0.5" max="24" step="0.1" placeholder="배정시간 (자동 로드, 소수 입력 가능)">
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
                            <td class="border border-gray-800 p-2 text-center font-medium" id="institution-name-display">쓰리디쿠키 홍대센터</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-24">훈련일</td>
                            <td class="border border-gray-800 p-1 text-center bg-white">
                                <select id="logDateSelect" class="w-full text-center font-bold bg-transparent outline-none cursor-pointer text-gray-800 hover:text-indigo-600 border-0 py-1" style="display:none;"></select>
                                <input type="date" id="logDateFallback" class="w-full text-center font-bold bg-transparent outline-none cursor-pointer text-gray-800 hover:text-indigo-600" style="display:none;">
                                <input type="hidden" id="logDate">
                            </td>
                        </tr>
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">훈련과정명</td>
                            <td class="border border-gray-800 p-2 text-center font-medium tracking-tight text-xs text-gray-800" id="logCourseName">-</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">재적</td>
                            <td class="border border-gray-800 p-2 text-center text-gray-800 font-bold" id="logEnrollCount">- 명</td>
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
                                <th class="border border-gray-800 p-2 min-w-[200px] w-52">훈련과목</th>
                                <th class="border border-gray-800 p-2 min-w-[120px] w-36">담당교사</th>
                                <th class="border border-gray-800 p-2">훈련 내용</th>
                                <th class="border border-gray-800 p-2 w-28">비고</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleTableBody">
                            <!-- JS Generated -->
                        </tbody>
                    </table>
                    <div class="flex justify-between mt-1 mb-2">
                         <button type="button" id="btnLoadAttendance" onclick="loadDailyAttendance()" class="text-xs text-rose-600 hover:text-rose-800 underline font-bold px-2 py-1 flex items-center gap-1"><i class="fas fa-users-viewfinder"></i> <span id="btnLoadAttText">출석 기록 불러오기</span></button>
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
                             <td class="bg-gray-200 border-r border-gray-800 p-2 w-32 text-center font-bold" rowspan="8">특기<br>사항</td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">지각자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListLate" class="w-full h-full px-2 outline-none focus:bg-yellow-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">결석자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListAbsent" class="w-full h-full px-2 outline-none focus:bg-red-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">조퇴자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListEarly" class="w-full h-full px-2 outline-none focus:bg-orange-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">공결자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListPublic" class="w-full h-full px-2 outline-none focus:bg-blue-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">50%미만결석</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListUnder50" class="w-full h-full px-2 outline-none focus:bg-red-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">지각&조퇴</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListLateEarly" class="w-full h-full px-2 outline-none focus:bg-yellow-50 transition-colors" placeholder="0명"></td>
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
                    <button type="submit" id="logFormSubmitBtn" class="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        var rawId = window.location.pathname.split('/')[3];
        var courseId = rawId ? parseInt(rawId) : rawId;
        var user = JSON.parse(localStorage.getItem('user') || '{}');
        var token = localStorage.getItem('token');
        var assignedUnits = [];
        var globalDailyHours = 8;
        var assignedHoursFromApi = null;
        var currentPage = 1;
        var instructorList = [];

        function onTrainingDateChange() {
            var elDate = document.getElementById('logDate');
            var elSelect = document.getElementById('logDateSelect');
            var elFallback = document.getElementById('logDateFallback');
            if (elSelect && elSelect.style.display !== 'none' && elSelect.value) {
                if (elDate) elDate.value = elSelect.value;
            }
            if (elFallback && elFallback.style.display !== 'none' && elFallback.value) {
                if (elDate) elDate.value = elFallback.value;
            }
            loadDailySchedule();
            loadDailyAttendance();
        }

        document.addEventListener('DOMContentLoaded', async function() {
            try {
                if (courseId) {
                   var res = await fetch('/api/courses/' + courseId + '?type=hrd');
                   var result = await res.json();
                   if (result.success && result.data) {
                       var dh = result.data.daily_hours;
                       if (dh != null && dh > 0) {
                           globalDailyHours = Number(dh);
                           var elH = document.getElementById('logHours');
                           if (elH) elH.value = globalDailyHours;
                       }
                   }
                }
            } catch(e) {}

            var logDateSelect = document.getElementById('logDateSelect');
            var logDateFallback = document.getElementById('logDateFallback');
            if (logDateSelect) logDateSelect.addEventListener('change', onTrainingDateChange);
            if (logDateFallback) logDateFallback.addEventListener('change', onTrainingDateChange);

            try {
                var personnelRes = await fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + token } });
                var personnelJson = await personnelRes.json();
                if (personnelJson.success && Array.isArray(personnelJson.data)) {
                    instructorList = (personnelJson.data || []).filter(function(p) { return p && (p.id || p.user_id); }).map(function(p) {
                        return { id: p.id || p.user_id, name: (p.name || '').trim() || ('ID ' + (p.id || p.user_id)) };
                    });
                }
            } catch (e) { console.error('personnel load', e); }

            loadLogs();
            loadAssignedUnits();
        });

        async function updateLogInstructor(logId, instructorId) {
            var val = (instructorId === '' || instructorId === null || instructorId === undefined) ? null : instructorId;
            try {
                var res = await fetch('/api/hrd/training-logs/' + logId, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ instructor_id: val })
                });
                var result = await res.json();
                if (result.success) {
                    loadLogs(currentPage);
                } else {
                    alert(result.error || '담당강사 변경에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('요청 중 오류가 발생했습니다.');
            }
        }

        async function loadAssignedUnits() {
            try {
                const res = await fetch('/api/ncs/courses/' + courseId);
                const result = await res.json();
                if (result.success) {
                    assignedUnits = result.data;
                    const select = document.getElementById('logNcsUnitId');
                    if (select) {
                        assignedUnits.forEach(u => {
                            const opt = document.createElement('option');
                            opt.value = u.ncs_unit_id;
                            opt.textContent = '[' + u.code + '] ' + u.name;
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
                    const res = await fetch('/api/ncs/units/' + unitId + '/elements', {
headers: { 'Authorization': 'Bearer ' + token }
                    });
const result = await res.json();
if (result.success && result.data.length > 0) {
    picker.classList.remove('hidden');
    container.innerHTML = result.data.map(el => 
                            '<label class="flex items-center gap-3 p-2.5 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-100 group">' +
                                '<input type="checkbox" name="ncs_element" value="' + el.id + '" class="w-5 h-5 text-indigo-600 rounded-lg border-gray-200 focus:ring-indigo-500 transition-all">' +
                                '<div class="text-sm">' +
                                    '<span class="font-black text-indigo-300 mr-2 uppercase tracking-tighter group-hover:text-indigo-500 transition-all font-mono">' + el.code + '</span>' +
                                    '<span class="text-gray-600 font-bold group-hover:text-indigo-900 transition-all">' + el.name + '</span>' +
                                '</div>' +
                            '</label>'
                        ).join('');
} else {
    picker.classList.add('hidden');
}
                } catch (e) { console.error(e); }
            });
        }

async function loadLogs(page = 1) {
    currentPage = page;
    var tbody = document.getElementById('logTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">로딩 중...</td></tr>';
    try {
        const res = await fetch('/api/hrd/training-logs?courseId=' + courseId + '&page=' + page + '&limit=10', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await res.json();
        if (result.success) {
            if (result.assignedDailyHours != null && result.assignedDailyHours > 0) {
                assignedHoursFromApi = Number(result.assignedDailyHours);
                globalDailyHours = assignedHoursFromApi;
            } else {
                assignedHoursFromApi = null;
            }
            const logs = result.pagination ? result.data : result.data;
            renderLogs(logs);
            if (result.pagination) {
                renderPagination(result.pagination);
            }
            calculateNcsProgress();
        }
    } catch (e) { console.error(e); }
}

function renderPagination(pagination) {
    const container = document.getElementById('paginationControls');
    if (!container) return;
    if (!pagination || pagination.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let html = '';
    let startPage = Math.max(1, pagination.page - 2);
    let endPage = Math.min(pagination.totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    html += '<button onclick="loadLogs(' + Math.max(1, pagination.page - 1) + ')" ' + (pagination.page === 1 ? 'disabled' : '') + ' class="w-10 h-10 flex items-center justify-center rounded-xl ' + (pagination.page === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600') + ' transition-all active:scale-90"><i class="fas fa-chevron-left text-[11px]"></i></button>';
    for (let i = startPage; i <= endPage; i++) {
        html += '<button onclick="loadLogs(' + i + ')" class="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ' + (pagination.page === i ? 'bg-indigo-600 text-white shadow-md active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600') + '">' + i + '</button>';
    }
    html += '<button onclick="loadLogs(' + Math.min(pagination.totalPages, pagination.page + 1) + ')" ' + (pagination.page === pagination.totalPages ? 'disabled' : '') + ' class="w-10 h-10 flex items-center justify-center rounded-xl ' + (pagination.page === pagination.totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600') + ' transition-all active:scale-90"><i class="fas fa-chevron-right text-[11px]"></i></button>';

    container.innerHTML = html;
}

function renderLogs(logs) {
    var tbody = document.getElementById('logTableBody');
    if (!tbody) return;
    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">등록된 훈련일지가 없습니다.\\n새로운 일지를 작성해보세요.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var tTopic = log.topic;
        var tContent = log.content;

        try {
            if (log.schedule_details_json) {
                var sch = typeof log.schedule_details_json === 'string' ? JSON.parse(log.schedule_details_json) : log.schedule_details_json;
                var p1 = sch.find(function (s) { return s.period == 1 || s.period === '1'; });
                if (p1) {
                    if (!tTopic || tTopic === '-') tTopic = p1.subject;
                    if (p1.content) tContent = p1.content;
                }
            }
        } catch (e) { }

        var topic = (tTopic || '-').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var content = (tContent || '-').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var currentInstructorId = (log.instructor_id != null && log.instructor_id !== '') ? String(log.instructor_id) : '';
        var instructorDisplay = (log.instructor_name || '미상').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var hasSavedHours = typeof log.training_hours !== 'undefined' && log.training_hours !== null && log.training_hours > 0;
        var fromApi = assignedHoursFromApi != null && assignedHoursFromApi > 0 ? (typeof assignedHoursFromApi === 'number' ? assignedHoursFromApi : parseFloat(assignedHoursFromApi)) : null;
        var fromCourse = globalDailyHours != null && globalDailyHours > 0 ? (typeof globalDailyHours === 'number' ? globalDailyHours : parseFloat(globalDailyHours)) : null;
        var assignedHours = fromApi != null ? fromApi : fromCourse;
        var reliableHours = assignedHours != null ? assignedHours : (hasSavedHours ? (typeof log.training_hours === 'number' ? log.training_hours : parseFloat(log.training_hours)) : null);
        var displayHoursText = reliableHours != null ? reliableHours + 'h' : '-';
        var authorCell = '';
        if (instructorList.length > 0) {
            var opts = '<option value="">선택</option>';
            for (var k = 0; k < instructorList.length; k++) {
                var inst = instructorList[k];
                var safeName = (inst.name || '').replace(/</g, '&lt;').replace(/"/g, '&quot;');
                var sel = (currentInstructorId === String(inst.id)) ? ' selected' : '';
                opts += '<option value="' + inst.id + '"' + sel + '>' + safeName + '</option>';
            }
            authorCell = '<td class="px-6 py-5 text-center"><select data-log-id="' + log.id + '" onchange="updateLogInstructor(' + log.id + ', this.value)" class="w-full max-w-[140px] mx-auto border border-gray-300 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">' + opts + '</select></td>';
        } else {
            authorCell = '<td class="px-6 py-5 text-center font-bold text-slate-600 text-sm">' + instructorDisplay + '</td>';
        }
        html += '<tr class="hover:bg-indigo-50/30 transition-all duration-200 group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">' +
            '<td class="px-6 py-5 whitespace-nowrap text-[11px] font-black text-indigo-300 uppercase tracking-widest">' + (log.date || '') + '</td>' +
            '<td class="px-6 py-5"><div class="font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">' + topic + '</div>' +
            '<div class="text-xs text-gray-400 truncate max-w-lg font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all">' + content + '</div></td>' +
            authorCell +
            '<td class="px-6 py-5 text-center font-black text-slate-700 text-sm">' + displayHoursText + '</td>' +
            '<td class="px-6 py-5 text-right"><div class="flex items-center justify-end gap-2.5 transition-all">' +
            '<button onclick="printLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-print text-xs"></i></button>' +
            '<button onclick="editLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-edit text-xs"></i></button>' +
            '<button onclick="deleteLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-trash-alt text-xs"></i></button>' +
            '</div></td></tr>';
    }
    tbody.innerHTML = html;
}

async function printLog(id) {
    try {
        // Fetch Data: Log, Session, Enrollments(실데이터), All Logs for day count
        // 훈련일 = log.date(실제 일지 저장일), 재적 = 해당 회차(courseId) 승인 수강생 수
        const [logRes, sessionRes, enrollRes, allLogsRes] = await Promise.all([
            fetch('/api/hrd/training-logs/' + id, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/course-sessions/' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/enrollments?course_id=' + courseId + '&type=hrd&limit=500', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/hrd/training-logs?courseId=' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json())
        ]);

        if (!logRes.success) throw new Error(logRes.error || '일지 로드 실패');

        const log = logRes.data;
        const session = sessionRes.success ? sessionRes.data : { course_name: '-', session_number: '', total_hours: 0, daily_hours: 0 };
        const enrollCount = (enrollRes.success && enrollRes.data != null)
            ? (enrollRes.pagination && typeof enrollRes.pagination.total === 'number' ? enrollRes.pagination.total : enrollRes.data.length)
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
            totalDays = Math.ceil(parseFloat(session.total_hours) / parseFloat(session.daily_hours));
        } else if (session.training_start_date && session.training_end_date) {
            // Fallback to date diff if hours are missing (though inaccurate for weekdays)
            const start = new Date(session.training_start_date);
            const end = new Date(session.training_end_date);
            const diffTime = Math.abs(end - start);
            totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        const scheduleDetails = log.schedule_details_json ? JSON.parse(log.schedule_details_json) : [];
        const attendance = log.attendance_summary_json ? JSON.parse(log.attendance_summary_json) : { 
            present: '', absent: '', late: '', early: '', 
            instructions: '', late_list: '', absent_list: '', early_list: '', public_list: '' 
        };
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[new Date(log.date).getDay()];

        // 훈련기관명: 설정에서 조회 (신규 설정 시 프린트에도 반영)
        let institutionName = '쓰리디쿠키 홍대센터(3D쿠키 홍대센터)';
        try {
            const instRes = await fetch('/api/settings/institution_name', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
            if (instRes.success && instRes.data) institutionName = instRes.data;
        } catch (e) {}

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
                                .no-print { display: none !important; }
                                #print-image-insert-area { border: none !important; padding: 0 !important; font-size: 0 !important; color: transparent !important; }
                                #print-image-insert-area img { display: block !important; }
                                body { background: white; -webkit-print-color-adjust: exact; }
                                .container { width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
                                @page { margin: 10mm; size: A4 portrait; }
                            }
                        </style>
                    </head>
                    <body>
                        <script>window.LOG_ID = \${id};</scr\${''}ipt>
                        <div class="print-controls">
                            <button class="btn btn-blue" onclick="insertPrintImage()"><i class="fas fa-image"></i> 이미지 삽입</button>
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
                                    <td class="value" id="institution-name-display-footer">\${(institutionName || '').replace(/</g, '&lt;').replace(/"/g, '&quot;')}</td>
                                    <td class="label">훈련일</td>
                                    <td class="value date-value">\${log.date} \${dayName}요일<br><span style="font-weight:normal; font-size:12px;">총 훈련일 \${totalDays || 0}일 / 작성일 \${currentDayCount || 1}일차</span></td>
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
                                    <td colspan="2" class="footer-content" style="height: 60px;">\${attendance.instructions || ''}</td>
                                </tr>
                                <tr>
                                    <td rowspan="7" class="footer-label-main">특기<br>사항</td>
                                    <td class="footer-label-sub">지각자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.late_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">결석자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.absent_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">조퇴자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.early_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">공결자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.public_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">50%미만결석</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.under50_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">지각&조퇴</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.late_early_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">기타사항<br><span style="font-weight:normal; font-size:10px;">(전달사항, 외출자 등)</span></td>
                                    <td class="footer-content" style="height: 60px; vertical-align: top;">
                                        \${log.content || ''}
                                    </td>
                                </tr>
                            </table>
                            <div id="print-image-insert-area" style="min-height: 60px; margin-top: 15px; padding: 10px; border: 1px dashed #d1d5db; border-radius: 8px; font-size: 12px; color: #9ca3af;">이미지 삽입 영역 (위 &#39;이미지 삽입&#39; 버튼으로 추가)</div>

                            <div style="margin-top: 30px; text-align: center;" class="no-print">
                                <button class="btn btn-orange" style="margin-right: 10px;" onclick="if(window.opener && window.opener.editLog) { window.opener.editLog(window.LOG_ID); window.close(); }"><i class="fas fa-edit"></i> 문서수정</button>
                                <button class="btn" style="background-color: #ef4444;" onclick="if(confirm('이 훈련일지를 삭제하시겠습니까?')) { if(window.opener && window.opener.deleteLog) { window.opener.deleteLog(window.LOG_ID); window.close(); }"><i class="fas fa-trash-alt"></i> 문서삭제</button>
                            </div>
                        </div>
                        <script>
                        function insertPrintImage() {
                            var input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = function() {
                                var f = this.files && this.files[0];
                                if (!f) return;
                                var r = new FileReader();
                                r.onload = function() {
                                    var div = document.getElementById('print-image-insert-area');
                                    if (div) {
                                        var img = document.createElement('img');
                                        img.src = r.result;
                                        img.style.maxWidth = '100%';
                                        img.style.maxHeight = '320px';
                                        img.style.display = 'block';
                                        img.style.marginTop = '8px';
                                        div.innerHTML = '';
                                        div.appendChild(img);
                                    }
                                };
                                r.readAsDataURL(f);
                            };
                            input.click();
                        }
                        </scr\${''}ipt>
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
                    loadLogs(currentPage);
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
        window.openLogModal = openLogModal;
        window.closeLogModal = closeLogModal;
        window.editLog = editLog;
        window.handleSaveLog = handleSaveLog;

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
        async function loadDailySchedule() {
            const dateInput = document.getElementById('logDate');
            if (!courseId || !dateInput || !dateInput.value) {
                // alert('훈련 일자를 선택해주세요.');
                return;
            }
            
            // 기존 내용 보존 처리
            const existingData = [];
            for (let i = 1; i <= 8; i++) {
                const subj = document.querySelector('input[name="sch_subject_' + i + '"]');
                const inst = document.querySelector('input[name="sch_instructor_' + i + '"]');
                const cont = document.querySelector('input[name="sch_content_' + i + '"]');
                const note = document.querySelector('input[name="sch_note_' + i + '"]');
                if (subj || inst || cont || note) {
                    existingData.push({
                        period: i,
                        subject: subj ? subj.value : '',
                        instructor: inst ? inst.value : '',
                        content: cont ? cont.value : '',
                        note: note ? note.value : ''
                    });
                }
            }
            
            const tbody = document.getElementById('scheduleTableBody');
            if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-gray-400 font-bold animate-pulse">시간표 불러오는 중...</td></tr>';

            try {
                const res = await fetch('/api/hrd/training-logs/daily-schedule?courseId=' + courseId + '&date=' + dateInput.value, {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    renderScheduleTable(result.data, existingData.length > 0 ? existingData : null);
                } else {
                     if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">시간표 조회 실패</td></tr>';
                     setTimeout(function() { renderScheduleTable(null, existingData.length > 0 ? existingData : null); }, 1000);
                }
            } catch (e) {
                console.error(e);
                if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">오류 발생</td></tr>';
                setTimeout(function() { renderScheduleTable(null, existingData.length > 0 ? existingData : null); }, 1000);
            }
        }

        async function loadDailyAttendance() {
            const dateInput = document.getElementById('logDate');
            if (!courseId || !dateInput || !dateInput.value) {
                showToast('먼저 훈련일을 선택해 주세요.', 'warn');
                return;
            }

            const btn = document.getElementById('btnLoadAttendance');
            const btnText = document.getElementById('btnLoadAttText');
            if (btn) btn.disabled = true;
            if (btnText) btnText.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i> 불러오는 중...';
            
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const isHrd = urlParams.get('type') === 'hrd' ? '&type=hrd' : '';
                const dateVal = dateInput.value;
                const res = await fetch('/api/courses/' + courseId + '/attendance?date=' + dateVal + isHrd, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                
                if (result.success && result.data) {
                    // 훈련일 여부 체크
                    window.notTrainingDay = result.data.is_training_day === false;
                    const notTrainingNoticeEl = document.getElementById('logNotTrainingDayNotice');
                    if (notTrainingNoticeEl) {
                        notTrainingNoticeEl.classList.toggle('hidden', !window.notTrainingDay);
                    }
                    
                    // 입력 필드 전체 비활성화 제어 (logDate와 취소 버튼은 제외)
                    const formInputs = document.querySelectorAll('#logForm input, #logForm textarea, #logForm select, #logForm button');
                    formInputs.forEach(el => {
                        if (el.id === 'logDate') return;
                        if (el.getAttribute('onclick') && el.getAttribute('onclick').includes('closeLogModal')) return;
                        
                        if (window.notTrainingDay) {
                            el.disabled = true;
                            if (el.tagName === 'BUTTON') {
                                el.classList.add('opacity-50', 'cursor-not-allowed');
                            } else {
                                el.classList.add('bg-gray-50', 'cursor-not-allowed');
                            }
                        } else {
                            el.disabled = false;
                            if (el.tagName === 'BUTTON') {
                                el.classList.remove('opacity-50', 'cursor-not-allowed');
                            } else {
                                el.classList.remove('bg-gray-50', 'cursor-not-allowed');
                            }
                        }
                    });

                    const students = result.data.students || [];
                    
                    const enrollEl = document.getElementById('logEnrollCount');
                    if (enrollEl) {
                        enrollEl.textContent = students.length + ' 명';
                        enrollEl.classList.remove('text-gray-400', 'italic');
                        enrollEl.classList.add('text-indigo-700', 'font-black');
                    }
                    
                    let p = 0, a = 0, l = 0, e = 0, pu = 0, u50 = 0, le = 0;
                    let lateList = [], absentList = [], earlyList = [], publicList = [], under50List = [], lateEarlyList = [];
                    
                    students.forEach(s => {
                        const st = s.status || 'present';
                        if (st === 'present') {
                            p++;
                        } else if (st === 'absent') { a++; absentList.push(s.name); }
                        else if (st === 'late') { l++; lateList.push(s.name); }
                        else if (st === 'early_leave') { e++; earlyList.push(s.name); }
                        else if (st === 'public_leave') { pu++; publicList.push(s.name); }
                        else if (st === 'absent_under_50') { u50++; under50List.push(s.name); }
                        else if (st === 'late_and_early') { le++; lateEarlyList.push(s.name); }
                    });
                    
                    const elP = document.getElementById('logAttPresent'); if (elP) { elP.value = p; flashField(elP); }
                    const elA = document.getElementById('logAttAbsent'); if (elA) { elA.value = a + u50; flashField(elA); }
                    const elL = document.getElementById('logAttLate');   if (elL) { elL.value = l; flashField(elL); }
                    const elE = document.getElementById('logAttEarly');  if (elE) { elE.value = e; flashField(elE); }
                    
                    const lstL = document.getElementById('logListLate');   if (lstL) { lstL.value = lateList.length > 0 ? lateList.join(', ') : '0명'; flashField(lstL); }
                    const lstA = document.getElementById('logListAbsent'); if (lstA) { lstA.value = absentList.length > 0 ? absentList.join(', ') : '0명'; flashField(lstA); }
                    const lstE = document.getElementById('logListEarly');  if (lstE) { lstE.value = earlyList.length > 0 ? earlyList.join(', ') : '0명'; flashField(lstE); }
                    const lstP = document.getElementById('logListPublic'); if (lstP) { lstP.value = publicList.length > 0 ? publicList.join(', ') : '0명'; flashField(lstP); }
                    const lstU = document.getElementById('logListUnder50'); if (lstU) { lstU.value = under50List.length > 0 ? under50List.join(', ') : '0명'; flashField(lstU); }
                    const lstLE = document.getElementById('logListLateEarly'); if (lstLE) { lstLE.value = lateEarlyList.length > 0 ? lateEarlyList.join(', ') : '0명'; flashField(lstLE); }

                    showToast('\u2705 \ucd9c\uc11d\uae30\ub85d \ubc18\uc601 \uc644\ub8cc (' + dateVal + ') \u2014 \uc7ac\uc801 ' + students.length + '\uba85 / \ucd9c ' + p + ' / \uacb0 ' + a + ' / \uc9c0\uac01 ' + l + ' / \uc870\ud1f4 ' + e + ' / \uacf5\uacb0 ' + pu, 'success');
                }
            } catch (err) {
                console.error('Failed to load attendance for log', err);
                showToast('출석 기록 불러오기 중 오류가 발생했습니다.', 'error');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.innerHTML = '출석 기록 불러오기';
            }
        }

        function flashField(el) {
            if (!el) return;
            el.style.transition = 'background-color 0.4s ease';
            el.style.backgroundColor = '#d1fae5';
            setTimeout(() => { el.style.backgroundColor = ''; }, 1500);
        }

        function showToast(msg, type = 'success') {
            const existing = document.getElementById('attToast');
            if (existing) existing.remove();
            const colors = { success: 'bg-emerald-600', warn: 'bg-amber-500', error: 'bg-red-600' };
            const toast = document.createElement('div');
            toast.id = 'attToast';
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-sm font-bold text-white max-w-lg text-center ' + (colors[type] || colors.success);
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.transition = 'opacity 0.4s'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 4500);
        }

        function renderScheduleTable(dbSchedules, savedDetails = null) {
            const tbody = document.getElementById('scheduleTableBody');
            if (!tbody) return;
            
            let html = '';
            for (let i = 1; i <= 8; i++) {
                const saved = savedDetails ? savedDetails.find(s => s.period === i || s.period === String(i)) : null;
                const dbSch = dbSchedules ? dbSchedules.find(s => s.period_number === i || s.period_number === String(i)) : null;

                var subject = (dbSch && dbSch.subject_name) ? dbSch.subject_name : (saved ? saved.subject : '');
                var instructor = (dbSch && dbSch.instructor_name) ? dbSch.instructor_name : (saved ? saved.instructor : '');
                var subjectTrim = (subject || '').toString().trim();
                if (!subjectTrim || subjectTrim === '교과목') { instructor = ''; }
                const content = saved ? saved.content : '';
                const note = saved ? saved.note : '';
                
                const isReadOnly = !!window.notTrainingDay;
                const disabledAttr = isReadOnly ? ' disabled' : '';
                const readonlyClass = isReadOnly ? ' bg-gray-50 cursor-not-allowed' : '';

                html += '<tr class="hover:bg-indigo-50/30 transition-colors group">' +
                        '<td class="px-2 py-2 text-center border-r font-black text-gray-400 bg-gray-50/50">' + i + '교시</td>' +
                        '<td class="px-2 py-2 border-r min-w-[200px] w-52"><input type="text" name="sch_subject_' + i + '" value="' + (subject || '') + '" class="w-full min-w-0 px-3 py-2 border border-gray-200 rounded-md text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="교과목"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2 border-r min-w-[120px] w-36"><input type="text" name="sch_instructor_' + i + '" value="' + (instructor || '') + '" class="w-full min-w-0 px-3 py-2 border border-gray-200 rounded-md text-center text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="담당교사"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2 border-r"><input type="text" name="sch_content_' + i + '" value="' + (content || '') + '" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="훈련내용을 입력하세요"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2"><input type="text" name="sch_note_' + i + '" value="' + (note || '') + '" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="비고"' + disabledAttr + '></td>' +
                    '</tr>';
            }
            tbody.innerHTML = html;
        }


        // --------------------------------------------------------------------------------------------------------------------------------
        // Modal & Form Logic
        // --------------------------------------------------------------------------------------------------------------------------------

        async function openLogModal() {
            const elId = document.getElementById('logId');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elDate = document.getElementById('logDate');
            const elDateSelect = document.getElementById('logDateSelect');
            const elDateFallback = document.getElementById('logDateFallback');

            if (elId) elId.value = '';
            if (elContent) elContent.value = '';
            if (elHours) elHours.value = (globalDailyHours != null && globalDailyHours > 0) ? String(Number(globalDailyHours)) : '';
            if (elDate) elDate.value = '';

            if (courseId) {
                try {
                    var res = await fetch('/api/courses/' + courseId + '?type=hrd', { headers: { 'Authorization': 'Bearer ' + token } });
                    var result = await res.json();
                    if (result.success && result.data) {
                        var dh = result.data.daily_hours;
                        if (dh != null && Number(dh) > 0) {
                            globalDailyHours = Number(dh);
                            if (elHours) elHours.value = String(Number(dh));
                        }
                    }
                    var datesRes = await fetch('/api/hrd/training-logs/training-dates?courseId=' + courseId, { headers: { 'Authorization': 'Bearer ' + token } });
                    var datesJson = await datesRes.json();
                    if (datesJson.success && datesJson.data) {
                        var dates = datesJson.data.dates || [];
                        if (dates.length > 0) {
                            if (elDateSelect) {
                                elDateSelect.innerHTML = '';
                                var today = new Date().toISOString().substring(0, 10);
                                var selected = dates.indexOf(today) >= 0 ? today : dates[0];
                                dates.forEach(function(d) {
                                    var opt = document.createElement('option');
                                    opt.value = d;
                                    var label = d;
                                    try {
                                        var dayNames = ['일','월','화','수','목','금','토'];
                                        var day = dayNames[new Date(d).getDay()];
                                        label = d + ' (' + day + ')';
                                    } catch(e) {}
                                    opt.textContent = label;
                                    if (d === selected) opt.selected = true;
                                    elDateSelect.appendChild(opt);
                                });
                                elDateSelect.style.display = '';
                                if (elDateFallback) elDateFallback.style.display = 'none';
                                if (elDate) elDate.value = selected;
                            }
                        } else {
                            if (elDateSelect) elDateSelect.style.display = 'none';
                            if (elDateFallback) {
                                elDateFallback.style.display = '';
                                var start = datesJson.data.training_start_date || '';
                                var end = datesJson.data.training_end_date || '';
                                if (start) elDateFallback.min = start.substring(0, 10);
                                if (end) elDateFallback.max = end.substring(0, 10);
                                elDateFallback.valueAsDate = new Date();
                                if (elDate) elDate.value = elDateFallback.value;
                            }
                        }
                    }
                } catch (e) {}
            }

            ['logAttPresent', 'logAttAbsent', 'logAttLate', 'logAttEarly',
             'logInstructions', 'logListLate', 'logListAbsent', 'logListEarly', 'logListPublic', 'logListUnder50', 'logListLateEarly'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });

            if (elDate && elDate.value) {
                loadDailySchedule();
                loadDailyAttendance();
            } else {
                renderScheduleTable(null, null);
            }

            var elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 작성';
            setModalCourseName();
            var elModal = document.getElementById('logModal');
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

        async function editLog(idOrLog) {
            const log = typeof idOrLog === 'object' && idOrLog !== null
                ? idOrLog
                : await fetch('/api/hrd/training-logs/' + idOrLog, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()).then(j => j.data || j);
            if (!log || !log.id) { alert('일지 정보를 불러올 수 없습니다.'); return; }
            const elId = document.getElementById('logId');
            const elDate = document.getElementById('logDate');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');

            if (elId) elId.value = log.id;
            if (elDate) elDate.value = log.date;
            var elDateSelect = document.getElementById('logDateSelect');
            var elDateFallback = document.getElementById('logDateFallback');
            if (elDateSelect && elDateSelect.style.display !== 'none') {
                if (elDateSelect.querySelector('option[value="' + log.date + '"]')) {
                    elDateSelect.value = log.date;
                } else {
                    var opt = document.createElement('option');
                    opt.value = log.date;
                    opt.textContent = log.date;
                    opt.selected = true;
                    elDateSelect.appendChild(opt);
                }
            } else if (elDateFallback) {
                elDateFallback.style.display = '';
                elDateFallback.value = log.date;
                if (elDateSelect) elDateSelect.style.display = 'none';
            }
            if (elContent) elContent.value = log.content || '';
            if (elHours) elHours.value = (log.training_hours != null && log.training_hours !== '') ? String(Number(log.training_hours)) : '';
            
            // Populate New Attendance Fields
            const fieldMap = {
                present: 'logAttPresent', absent: 'logAttAbsent', late: 'logAttLate', early: 'logAttEarly',
                instructions: 'logInstructions', late_list: 'logListLate', absent_list: 'logListAbsent', early_list: 'logListEarly',
                public_list: 'logListPublic', under50_list: 'logListUnder50', late_early_list: 'logListLateEarly'
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
            
            // NCS Unit fields disabled

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

        async function fetchInstitutionName() {
            try {
                const res = await fetch('/api/settings/institution_name');
                const result = await res.json();
                if (result.success && result.data) {
                    const el = document.getElementById('institution-name-display');
                    if (el) el.textContent = result.data;
                    const el2 = document.getElementById('institution-name-display-footer');
                    if (el2) el2.textContent = result.data;
                }
            } catch (e) { console.error(e); }
        }

        // Call fetchInstitutionName when appropriate
        document.addEventListener('DOMContentLoaded', fetchInstitutionName);

        async function handleSaveLog(e) {
            e.preventDefault();
            
            if (window.notTrainingDay) {
                alert('훈련일이 아닙니다. 해당 날짜에는 일지 저장이 불가합니다.');
                return;
            }

            var submitBtn = document.getElementById('logFormSubmitBtn');
            if (submitBtn && submitBtn.disabled) return;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '저장 중...';
            }

            const idVal = document.getElementById('logId').value;
            const dateVal = (document.getElementById('logDate') && document.getElementById('logDate').value) ? document.getElementById('logDate').value.trim() : '';
            const contentVal = document.getElementById('logContent').value;
            const hoursVal = document.getElementById('logHours').value;

            if (!dateVal) {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '저장'; }
                alert('훈련일을 선택해 주세요.');
                return;
            }

            // New Fields Collection (ES5-safe: no optional chaining)
            var logAttPresent = document.getElementById('logAttPresent');
            var logAttAbsent = document.getElementById('logAttAbsent');
            var logAttLate = document.getElementById('logAttLate');
            var logAttEarly = document.getElementById('logAttEarly');
            var logInstructions = document.getElementById('logInstructions');
            var logListLate = document.getElementById('logListLate');
            var logListAbsent = document.getElementById('logListAbsent');
            var logListEarly = document.getElementById('logListEarly');
            var logListPublic = document.getElementById('logListPublic');
            var logListUnder50 = document.getElementById('logListUnder50');
            var logListLateEarly = document.getElementById('logListLateEarly');
            var attSummary = {
                present: (logAttPresent && logAttPresent.value) || '',
                absent: (logAttAbsent && logAttAbsent.value) || '',
                late: (logAttLate && logAttLate.value) || '',
                early: (logAttEarly && logAttEarly.value) || '',
                instructions: (logInstructions && logInstructions.value) || '',
                late_list: (logListLate && logListLate.value) || '',
                absent_list: (logListAbsent && logListAbsent.value) || '',
                early_list: (logListEarly && logListEarly.value) || '',
                public_list: (logListPublic && logListPublic.value) || '',
                under50_list: (logListUnder50 && logListUnder50.value) || '',
                late_early_list: (logListLateEarly && logListLateEarly.value) || ''
            };

            // 시간표 데이터 수집 (ES5-safe: no optional chaining, no template literal in emitted script)
            var scheduleDetails = [];
            for (var i = 1; i <= 8; i++) {
                var subjEl = document.querySelector('input[name="sch_subject_' + i + '"]');
                var instEl = document.querySelector('input[name="sch_instructor_' + i + '"]');
                var contEl = document.querySelector('input[name="sch_content_' + i + '"]');
                var noteEl = document.querySelector('input[name="sch_note_' + i + '"]');
                var subj = (subjEl && subjEl.value) || '';
                var inst = (instEl && instEl.value) || '';
                var cont = (contEl && contEl.value) || '';
                var note = (noteEl && noteEl.value) || '';
                if (subj || inst || cont || note) {
                    scheduleDetails.push({
                        period: i,
                        subject: subj,
                        instructor: inst,
                        content: cont,
                        note: note
                    });
                }
            }

            var p1Subject = '-';
            if (scheduleDetails.length > 0) {
                var p1 = scheduleDetails.find(function(s) { return s.period == 1 || s.period === '1'; });
                if (p1 && p1.subject) p1Subject = p1.subject;
            }

            var data = {
                id: idVal ? parseInt(idVal) : null,
                course_id: parseInt(courseId),
                instructor_id: user.id || null,
                date: dateVal,
                topic: p1Subject,
                content: contentVal,
                teaching_method: '주입식/실습', 
                ncs_unit_id: null,
                training_hours: parseFloat(hoursVal) || 0,
                ncs_elements_json: null,
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
                    loadLogs(currentPage);
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '저장하기';
                }
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
