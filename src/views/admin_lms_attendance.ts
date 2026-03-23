
import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsAttendanceHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출결 관리 - 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 font-sans overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('attendance')}

        <!-- Main Content -->
        <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div id="attendanceClosedNotice" class="hidden mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium flex items-center gap-2">
                <i class="fas fa-lock-open"></i>
                <span id="attendanceClosedNoticeText">마감된 과정입니다. <strong>관리자는 출석 수정이 가능합니다.</strong></span>
            </div>
            <div id="attendanceNotTrainingDayNotice" class="hidden mb-4 p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-center gap-2">
                <i class="fas fa-calendar-times"></i>
                <span>훈련일이 아닙니다. 해당 날짜에는 출석 입력이 불가합니다. 훈련일을 선택해 주세요.</span>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Toolbar -->
                <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input type="date" id="attendanceDate" onchange="loadAttendanceData()" class="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium">
                            <i class="fas fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div class="text-sm text-gray-500">
                            <span id="dateLabelText">출결 현황 기준일:</span> <span id="currentDateDisplay" class="font-bold text-purple-600"></span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="openPrintModalOrTrainee()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center text-sm font-bold">
                            <i class="fas fa-print mr-2"></i> 출석부 출력
                        </button>
                        <button id="btnSaveAttendance" onclick="saveAttendance()" class="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center shadow-lg shadow-purple-200 text-sm font-bold">
                            <i class="fas fa-save mr-2"></i> 변경사항 저장
                        </button>
                    </div>
                </div>

                <!-- Stats Summary -->
                <div class="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-4 px-6 pt-3 pb-1 bg-gray-50/50">
                    <div class="col-span-3 md:col-span-7 flex items-center justify-between mb-1">
                        <span class="text-[10px] text-gray-400" id="statsModeLabel">오늘 기준</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full font-bold hidden" id="statsCumulativeBadge" style="background:#e0e7ff;color:#3730a3;">📊 전체 기간 누적</span>
                    </div>
                </div>
                <div class="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-4 px-6 pb-6 bg-gray-50/50">
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">출석</div>
                        <div class="text-lg md:text-xl font-bold text-green-600" id="countPresent">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">지각</div>
                        <div class="text-lg md:text-xl font-bold text-yellow-600" id="countLate">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">조퇴</div>
                        <div class="text-lg md:text-xl font-bold text-orange-600" id="countEarly">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">결석</div>
                        <div class="text-lg md:text-xl font-bold text-red-600" id="countAbsent">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">공가</div>
                        <div class="text-lg md:text-xl font-bold text-blue-600" id="countPublic">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">50%미만</div>
                        <div class="text-lg md:text-xl font-bold text-red-700" id="countAbsentUnder50">0</div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <div class="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">지각&조퇴</div>
                        <div class="text-lg md:text-xl font-bold text-orange-700" id="countLateEarly">0</div>
                    </div>
                </div>

                <!-- Attendance Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">이름</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">연락처</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">출석 현황</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">입실시간</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">퇴실시간</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">상태</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">비고</th>
                            </tr>
                        </thead>
                        <tbody id="attendanceTableBody" class="bg-white divide-y divide-gray-100">
                            <tr>
                                <td colspan="7" class="px-6 py-12 text-center text-gray-400 font-medium">
                                    <i class="fas fa-circle-notch fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
            </div>
        </div>
    </div>

    <!-- Print Modal -->
    <div id="printModal" class="fixed inset-0 bg-black/50 hidden z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 class="text-xl font-bold text-gray-800 mb-4">출석부 출력</h3>
            <p class="text-gray-600 text-sm mb-6">출력할 월을 선택하세요. 해당 월 전체의 출결 내역이 생성됩니다.</p>
            <div class="space-y-4 mb-8">
                <label class="block text-sm font-bold text-gray-700 mb-1">출력 월 선택</label>
                <input type="month" id="printMonth" class="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div class="flex space-x-3">
                <button onclick="document.getElementById('printModal').classList.add('hidden')" class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-bold">취소</button>
                <button onclick="printAttendance()" class="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-200">출력 페이지 열기</button>
            </div>
        </div>
    </div>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const pathParts = window.location.pathname.split('/');
        const courseId = pathParts[3];
        const courseType = urlParams.get('type') || '';
        let students = [];

        // JWT 토큰에서 역할 파싱 (서명 검증 불필요 - UI 표시 용도)
        function getTokenRole() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return '';
                const payload = JSON.parse(atob(token.split('.')[1]));
                return (payload.role || '').toLowerCase();
            } catch(e) { return ''; }
        }
        const isAdmin = getTokenRole() === 'admin';

        document.addEventListener('DOMContentLoaded', async () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = \`\${yyyy}-\${mm}-\${dd}\`;
            let initialDate = dateStr;
            if (courseType === 'hrd') {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(\`/api/courses/\${courseId}/attendance-info?type=hrd\`, { headers: { 'Authorization': 'Bearer ' + (token || '') } });
                    const json = await res.json();
                    if (json && json.success && json.data) {
                        const st = (json.data.session_status || '').toLowerCase();
                        const closed = st === 'completed' || st === 'closed';
                        const lastDate = json.data.last_training_date || json.data.training_end_date;
                        if (closed && lastDate) {
                            initialDate = lastDate.toString().substring(0, 10);
                            document.getElementById('dateLabelText').textContent = '최종 마감일 (마감된 출석현황):';
                        }
                    }
                } catch (e) { /* ignore */ }
            }
            document.getElementById('attendanceDate').value = initialDate;
            document.getElementById('currentDateDisplay').textContent = initialDate;
            loadAttendanceData();
        });

        async function loadAttendanceData() {
            const date = document.getElementById('attendanceDate').value;
            document.getElementById('currentDateDisplay').textContent = date;
            
            try {
                const token = localStorage.getItem('token');
                
                let apiUrl = \`/api/courses/\${courseId}/attendance?date=\${date}\`;
                if (courseType) apiUrl += \`&type=\${courseType}\`;

                const response = await fetch(apiUrl, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const defStart = result.data.default_start_time || '09:00';
                    const defEnd = result.data.default_end_time || '18:00';
                    const sessionStatus = result.data.session_status || '';
                    window.sessionClosed = (courseType === 'hrd' && (sessionStatus === 'completed' || sessionStatus === 'closed'));
                    window.notTrainingDay = (courseType === 'hrd' && result.data.is_training_day === false);
                    // 전체 기간 누적 통계 저장
                    window.totalStats = result.data.total_stats || null;
                    const noticeEl = document.getElementById('attendanceClosedNotice');
                    const notTrainingNoticeEl = document.getElementById('attendanceNotTrainingDayNotice');
                    const btnSave = document.getElementById('btnSaveAttendance');
                    if (noticeEl) noticeEl.classList.toggle('hidden', !window.sessionClosed);
                    if (notTrainingNoticeEl) notTrainingNoticeEl.classList.toggle('hidden', !window.notTrainingDay);
                    // 관리자는 마감 과정도 편집 가능, 비훈련일은 관리자도 불가
                    const inputDisabled = (window.sessionClosed && !isAdmin) || window.notTrainingDay;
                    if (btnSave) { btnSave.disabled = inputDisabled; btnSave.classList.toggle('opacity-50', inputDisabled); btnSave.classList.toggle('cursor-not-allowed', inputDisabled); }
                    // 관리자용 배너 문구 업데이트
                    const noticeTextEl = document.getElementById('attendanceClosedNoticeText');
                    if (noticeTextEl && window.sessionClosed) {
                        if (isAdmin) {
                            noticeTextEl.innerHTML = '마감된 과정입니다. <strong style="color:#92400e">관리자 권한으로 출석 수정이 가능합니다.</strong>';
                            if (noticeEl) noticeEl.style.backgroundColor = '#fef3c7';
                        } else {
                            noticeTextEl.innerHTML = '마감된 과정입니다. 출석 수정이 제한됩니다.';
                        }
                    }
                    students = result.data.students.map(s => {
                        if (s.status === null && (!window.sessionClosed || isAdmin)) {
                            s.status = 'present';
                            s.check_in = defStart;
                            s.check_out = defEnd;
                        }
                        return s;
                    });
                    renderTable();
                    updateStats();
                } else {
                    document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">데이터 로드 실패</td></tr>';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function renderTable() {
            const tbody = document.getElementById('attendanceTableBody');
            // 관리자는 마감 과정도 편집 가능, 비훈련일은 불가
            const readOnly = (!!window.sessionClosed && !isAdmin) || !!window.notTrainingDay;
            const disAttr = readOnly ? ' disabled' : '';
            const roAttr = readOnly ? ' readonly' : '';
            tbody.innerHTML = students.map((student, index) => {
                let attendanceHtml = '<span class="text-gray-400 text-xs">-</span>';
                // 출석 현황: 검색일까지 누적 출석률 우선 (비훈련일·미기록일에도 API가 내려준 advanced_attendance/attendance_rate 표시)
                if (student.advanced_attendance) {
                    const adv = student.advanced_attendance;
                    const cRate = parseFloat(adv.currentRate);
                    let color = 'text-green-600';
                    let bg = 'bg-green-50';
                    if (cRate < 80) { color = 'text-red-600'; bg = 'bg-red-50'; }
                    else if (cRate < 90) { color = 'text-yellow-600'; bg = 'bg-yellow-50'; }
                    
                    let tooltipHtml = '';
                    if (adv.type === 'days') {
                        tooltipHtml = \`<div class="text-[10px] text-gray-500 mb-1">진행 <span class="text-gray-800 font-bold">\${adv.daysProgressed}일</span> / 총 \${adv.totalDays}일</div>\` +
                                      \`<div class="text-[10px] text-gray-500">결석 \${adv.absent}회 / 지각 \${adv.late}회 / 조퇴 \${adv.early}회</div>\` +
                                      \`<div class="text-[10px] text-rose-500 font-bold mt-1">환산결석: \${adv.totalAbsentConverted}일</div>\`;
                    } else {
                        tooltipHtml = \`<div class="text-[10px] text-gray-500 mb-1">실제 누적 <span class="text-gray-800 font-bold">\${adv.accumulatedMinutes ?? 0}분</span> / 과정 총 <span class="text-gray-800 font-bold">\${adv.expectedTotalMinutes ?? 0}분</span></div>\` +
                                      \`<div class="text-[10px] text-gray-500 mt-0.5">(출석일수×일일시간 기준 예상: \${adv.expectedCurrentMinutes ?? 0}분)</div>\` +
                                      \`<div class="text-[10px] text-gray-500 mt-1">결석 \${adv.absent}회 / 지각 \${adv.late}회 / 조퇴 \${adv.early}회</div>\`;
                    }
                    
                    attendanceHtml = \`
                        <div class="group relative inline-flex items-center gap-2 px-2 py-1 rounded \${bg}">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold \${color}">\${adv.currentRate}%</span>
                                <span class="text-[9px] font-medium text-gray-400 -mt-0.5">최종 \${adv.finalRate}%</span>
                            </div>
                            <i class="fas fa-info-circle text-[10px] text-gray-300"></i>
                            
                            <!-- Tooltip -->
                            <div class="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 opacity-0 transition-opacity group-hover:opacity-100 bg-white border border-gray-100 shadow-xl rounded-lg p-3 min-w-[160px]">
                                <h4 class="text-xs font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">\${adv.type === 'days' ? '장기(일수) 출석 상세' : '단기(시간) 출석 상세'}</h4>
                                \${tooltipHtml}
                            </div>
                        </div>
                    \`;
                } else if (student.attendance_rate !== undefined && student.attendance_rate !== null) {
                    const cRate = student.attendance_rate;
                    let color = 'text-green-600';
                    let bg = 'bg-green-50';
                    if (cRate < 80) { color = 'text-red-600'; bg = 'bg-red-50'; }
                    else if (cRate < 90) { color = 'text-yellow-600'; bg = 'bg-yellow-50'; }
                    
                    attendanceHtml = \`<div class="inline-flex px-2 py-1 rounded \${bg}"><span class="text-sm font-bold \${color}">\${cRate}%</span></div>\`;
                } else if (readOnly && student.has_log === false) {
                    attendanceHtml = '<span class="text-gray-500 text-xs font-medium">해당일 미기록</span>';
                }

                return \`
                <tr class="hover:bg-gray-50 transition" data-id="\${student.id}">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${student.name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">\${student.phone}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap relative">
                        \${attendanceHtml}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <input type="time" value="\${student.check_in || ''}" class="border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500\${readOnly ? ' bg-gray-50' : ''}" onchange="updateStudentData(\${index}, 'check_in', this.value)"\${disAttr}\${roAttr}>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <input type="time" value="\${student.check_out || ''}" class="border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500\${readOnly ? ' bg-gray-50' : ''}" onchange="updateStudentData(\${index}, 'check_out', this.value)"\${disAttr}\${roAttr}>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <select onchange="updateStudentData(\${index}, 'status', this.value)" class="border rounded-xl px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all \${getStatusColor(student.status)}\${readOnly ? ' bg-gray-50 cursor-not-allowed' : ' bg-white'}"\${disAttr}>
                            <option value="" \${(student.status == null || student.status === '') ? 'selected' : ''}>미입력</option>
                            <option value="present" \${student.status === 'present' ? 'selected' : ''}>출석</option>
                            <option value="late" \${student.status === 'late' ? 'selected' : ''}>지각</option>
                            <option value="early_leave" \${student.status === 'early_leave' ? 'selected' : ''}>조퇴</option>
                            <option value="absent" \${student.status === 'absent' ? 'selected' : ''}>결석</option>
                            <option value="public_leave" \${student.status === 'public_leave' ? 'selected' : ''}>공가</option>
                            <option value="absent_under_50" \${student.status === 'absent_under_50' ? 'selected' : ''}>50%미만결석</option>
                            <option value="late_and_early" \${student.status === 'late_and_early' ? 'selected' : ''}>지각&조퇴</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" value="\${student.note || ''}" placeholder="비고 입력" class="w-full border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500\${readOnly ? ' bg-gray-50' : ''}" onchange="updateStudentData(\${index}, 'note', this.value)"\${disAttr}\${roAttr}>
                    </td>
                </tr>
            \`;
            }).join('');
        }

        function getStatusColor(status) {
            if (status == null || status === '') return 'text-gray-500 font-medium';
            switch(status) {
                case 'present': return 'text-green-600 font-bold';
                case 'late': return 'text-yellow-600 font-bold';
                case 'early_leave': return 'text-orange-600 font-bold';
                case 'absent': return 'text-red-600 font-bold';
                case 'public_leave': return 'text-gray-600 font-bold';
                case 'absent_under_50': return 'text-red-700 font-bold';
                case 'late_and_early': return 'text-orange-700 font-bold';
                default: return '';
            }
        }

        function updateStudentData(index, field, value) {
            students[index][field] = value;
            if (field === 'status') {
                renderTable();
                updateStats();
            }
        }

        function updateStats() {
            // HRD 과정이면 서버에서 받은 전체 기간 누적 통계(total_stats) 사용
            const badgeEl = document.getElementById('statsCumulativeBadge');
            const labelEl = document.getElementById('statsModeLabel');
            if (courseType === 'hrd' && window.totalStats) {
                const s = window.totalStats;
                document.getElementById('countPresent').textContent = s.present || 0;
                document.getElementById('countLate').textContent = s.late || 0;
                document.getElementById('countEarly').textContent = s.early_leave || 0;
                document.getElementById('countAbsent').textContent = s.absent || 0;
                document.getElementById('countPublic').textContent = s.public_leave || 0;
                document.getElementById('countAbsentUnder50').textContent = s.absent_under_50 || 0;
                document.getElementById('countLateEarly').textContent = s.late_and_early || 0;
                if (badgeEl) badgeEl.classList.remove('hidden');
                if (labelEl) labelEl.textContent = '전체 과정 누적 횟수';
            } else {
                // 일반 과정: 현재 날짜 기준
                const counts = {
                    present: 0, late: 0, early_leave: 0, absent: 0, public_leave: 0, absent_under_50: 0, late_and_early: 0
                };
                students.forEach(s => {
                    if (s.status != null && s.status !== '' && counts[s.status] !== undefined) counts[s.status]++;
                });
                document.getElementById('countPresent').textContent = counts.present;
                document.getElementById('countLate').textContent = counts.late;
                document.getElementById('countEarly').textContent = counts.early_leave;
                document.getElementById('countAbsent').textContent = counts.absent;
                document.getElementById('countPublic').textContent = counts.public_leave;
                document.getElementById('countAbsentUnder50').textContent = counts.absent_under_50;
                document.getElementById('countLateEarly').textContent = counts.late_and_early;
                if (badgeEl) badgeEl.classList.add('hidden');
                if (labelEl) labelEl.textContent = '선택일 기준';
            }
        }

        async function saveAttendance() {
            // 관리자는 마감 과정도 저장 가능
            if (window.sessionClosed && !isAdmin) {
                alert('마감된 과정은 출석 수정이 제한됩니다. 관리자 계정으로 접속 후 수정하세요.');
                return;
            }
            if (window.notTrainingDay) {
                alert('훈련일이 아닙니다. 해당 날짜에는 출석 입력이 불가합니다.');
                return;
            }
            const date = document.getElementById('attendanceDate').value;
            
            try {
                const token = localStorage.getItem('token');
                let apiUrl = \`/api/courses/\${courseId}/attendance\`;
                if (courseType) apiUrl += \`?type=\${courseType}\`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        date: date,
                        records: students.map(s => ({
                           enrollment_id: s.enrollment_id,
                           check_in: s.check_in,
                           check_out: s.check_out,
                           status: s.status,
                           note: s.note
                        }))
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('저장되었습니다.');
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        function openPrintModalOrTrainee() {
            if (courseType === 'hrd') {
                window.open('/admin/attendance/print/trainee?sessionId=' + encodeURIComponent(courseId), '_blank', 'width=1200,height=800');
                return;
            }
            openPrintModal();
        }

        function openPrintModal() {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            document.getElementById('printMonth').value = \`\${yyyy}-\${mm}\`;
            document.getElementById('printModal').classList.remove('hidden');
        }

        function printAttendance() {
            const monthVal = document.getElementById('printMonth').value;
            if (!monthVal) { alert('날짜를 선택하세요'); return; }
            
            const [year, month] = monthVal.split('-');
            const courseTitle = document.getElementById('header-courseTitle')?.textContent || '과정';
            
            let url = \`/admin/attendance/print?courseId=\${courseId}&courseTitle=\${encodeURIComponent(courseTitle)}&year=\${year}&month=\${month}\`;
            if (courseType) url += \`&type=\${encodeURIComponent(courseType)}\`;
            window.open(url, '_blank', 'width=1200,height=800');
            document.getElementById('printModal').classList.add('hidden');
        }
    </script>
</body>
</html>
`;
