
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
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Toolbar -->
                <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input type="date" id="attendanceDate" onchange="loadAttendanceData()" class="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium">
                            <i class="fas fa-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div class="text-sm text-gray-500">
                            출결 현황 기준일: <span id="currentDateDisplay" class="font-bold text-purple-600"></span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="openPrintModalOrTrainee()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center text-sm font-bold">
                            <i class="fas fa-print mr-2"></i> 출석부 출력
                        </button>
                        <button onclick="saveAttendance()" class="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center shadow-lg shadow-purple-200 text-sm font-bold">
                            <i class="fas fa-save mr-2"></i> 변경사항 저장
                        </button>
                    </div>
                </div>

                <!-- Stats Summary -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-gray-50/50">
                    <div class="bg-white p-4 rounded-xl border border-gray-100 text-center">
                        <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">출석</div>
                        <div class="text-xl font-bold text-green-600" id="countPresent">0</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-gray-100 text-center">
                        <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">지각</div>
                        <div class="text-xl font-bold text-yellow-600" id="countLate">0</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-gray-100 text-center">
                        <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">조퇴</div>
                        <div class="text-xl font-bold text-orange-600" id="countEarly">0</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-gray-100 text-center">
                        <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">결석</div>
                        <div class="text-xl font-bold text-red-600" id="countAbsent">0</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-gray-100 text-center">
                        <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">공결</div>
                        <div class="text-xl font-bold text-blue-600" id="countPublic">0</div>
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

        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = \`\${yyyy}-\${mm}-\${dd}\`;
            
            document.getElementById('attendanceDate').value = dateStr;
            document.getElementById('currentDateDisplay').textContent = dateStr;
            
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
                    
                    students = result.data.students.map(s => {
                        // 기록이 없으면 기본값 설정 (출석, 입실/퇴실 시간 자동 채움)
                        if (s.status === null) {
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
            tbody.innerHTML = students.map((student, index) => {
                let attendanceHtml = '<span class="text-gray-400 text-xs">-</span>';
                
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
                        tooltipHtml = \`<div class="text-[10px] text-gray-500 mb-1">진행 <span class="text-gray-800 font-bold">\${adv.expectedCurrentMinutes}분</span> / 총 \${adv.expectedTotalMinutes}분</div>\` +
                                      \`<div class="text-[10px] text-gray-500">결석 \${adv.absent}회 / 지각 \${adv.late}회 / 조퇴 \${adv.early}회</div>\`;
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
                } else if (student.attendance_rate !== undefined) {
                    const cRate = student.attendance_rate;
                    let color = 'text-green-600';
                    let bg = 'bg-green-50';
                    if (cRate < 80) { color = 'text-red-600'; bg = 'bg-red-50'; }
                    else if (cRate < 90) { color = 'text-yellow-600'; bg = 'bg-yellow-50'; }
                    
                    attendanceHtml = \`<div class="inline-flex px-2 py-1 rounded \${bg}"><span class="text-sm font-bold \${color}">\${cRate}%</span></div>\`;
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
                        <input type="time" value="\${student.check_in || ''}" class="border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500" onchange="updateStudentData(\${index}, 'check_in', this.value)">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <input type="time" value="\${student.check_out || ''}" class="border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500" onchange="updateStudentData(\${index}, 'check_out', this.value)">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <select class="border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500 \${getStatusColor(student.status)}" onchange="updateStudentData(\${index}, 'status', this.value)">
                            <option value="present" \${student.status === 'present' ? 'selected' : ''}>출석</option>
                            <option value="late" \${student.status === 'late' ? 'selected' : ''}>지각</option>
                            <option value="early_leave" \${student.status === 'early_leave' ? 'selected' : ''}>조퇴</option>
                            <option value="absent" \${student.status === 'absent' ? 'selected' : ''}>결석</option>
                            <option value="public_leave" \${student.status === 'public_leave' ? 'selected' : ''}>공결</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" value="\${student.note || ''}" placeholder="비고 입력" class="w-full border rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500" onchange="updateStudentData(\${index}, 'note', this.value)">
                    </td>
                </tr>
            \`;
            }).join('');
        }

        function getStatusColor(status) {
            switch(status) {
                case 'present': return 'text-green-600 font-bold';
                case 'late': return 'text-yellow-600 font-bold';
                case 'early_leave': return 'text-orange-600 font-bold';
                case 'absent': return 'text-red-600 font-bold';
                case 'public_leave': return 'text-gray-600 font-bold';
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
            const counts = {
                present: 0, late: 0, early_leave: 0, absent: 0, public_leave: 0
            };
            
            students.forEach(s => {
                if (counts[s.status] !== undefined) counts[s.status]++;
            });

            document.getElementById('countPresent').textContent = counts.present;
            document.getElementById('countLate').textContent = counts.late;
            document.getElementById('countEarly').textContent = counts.early_leave;
            document.getElementById('countAbsent').textContent = counts.absent;
            document.getElementById('countPublic').textContent = counts.public_leave;
        }

        async function saveAttendance() {
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
