
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdAttendanceHtml = (sidebar = hrdSidebar('attendance')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출석 관리 - 통합 교육행정 시스템</title>
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
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">출석 관리</h1>
                            <p class="text-gray-600 mt-1">훈련생들의 출석 현황을 관리하고 출결을 입력합니다.</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="openPrintModal()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center shadow-sm">
                                <i class="fas fa-print mr-2"></i> 출석부 출력
                            </button>
                             <button onclick="saveAttendance()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                                <i class="fas fa-save mr-2"></i> 출석 저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- 필터 카드 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">과정 선택</label>
                                <select id="courseSelect" onchange="loadStudents()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">과정을 선택하세요</option>
                                    <!-- API로 로드됨 -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">기준 날짜</label>
                                <input type="date" id="attendanceDate" onchange="loadStudents()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">상태 필터</label>
                                <select id="statusFilter" onchange="filterStudents()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">전체</option>
                                    <option value="present">출석</option>
                                    <option value="late">지각/조퇴</option>
                                    <option value="absent">결석</option>
                                </select>
                            </div>
                            <div class="flex justify-end">
                                <div class="text-right">
                                    <div class="text-sm text-gray-500">총 인원: <span id="totalStudents" class="font-bold text-gray-800">0</span>명</div>
                                    <div class="text-xs text-blue-600 font-medium mt-1">출석률: <span id="attendanceRate">0</span>%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 출석 리스트 테이블 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름 / 연락처</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강생 유형</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">출석 상태</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">입실 시간</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">퇴실 시간</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">메모</th>
                                </tr>
                            </thead>
                            <tbody id="attendanceListBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        과정과 날짜를 선택해주세요.
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

    <!-- 출석부 출력 모달 -->
    <div id="printModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-800">월간 출석부 출력</h3>
                <button onclick="document.getElementById('printModal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">출력할 연/월</label>
                   <input type="month" id="printMonth" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div class="flex justify-end pt-2">
                    <button onclick="printAttendance()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold w-full">
                        <i class="fas fa-print mr-2"></i> 인쇄 미리보기
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStudents = [];
        let allStudents = [];

        document.addEventListener('DOMContentLoaded', () => {
            // 오늘 날짜로 초기화
            document.getElementById('attendanceDate').valueAsDate = new Date();
            loadCourses();
        });

        async function loadCourses() {
            try {
                // 운영 중인 과정만 로드
                const response = await fetch('/api/courses?status=open'); // API 확인 필요, 없으면 수정
                const result = await response.json();
                const select = document.getElementById('courseSelect');
                
                if (result.success) {
                    // 옵션 초기화 (첫 번째 옵션 유지)
                    while (select.options.length > 1) select.remove(1);

                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error('Failed to load courses:', e);
            }
        }

        async function loadStudents() {
            const courseId = document.getElementById('courseSelect').value;
            const date = document.getElementById('attendanceDate').value;
            const tbody = document.getElementById('attendanceListBody');

            if (!courseId) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">과정을 선택해주세요.</td></tr>';
                return;
            }

            try {
                // 특정 과정의 학생 및 해당 날짜 출석 정보 로드
                const url = '/api/hrd/attendance?courseId=' + courseId + '&date=' + date;
                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    allStudents = result.data;
                    filterStudents();
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-red-500">데이터 로드 실패</td></tr>';
                }
            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function filterStudents() {
            const statusFilter = document.getElementById('statusFilter').value;
            
            if (statusFilter === 'all') {
                currentStudents = [...allStudents];
            } else {
                currentStudents = allStudents.filter(s => s.status === statusFilter);
            }

            updateStats();
            renderTable();
        }

        function updateStats() {
            document.getElementById('totalStudents').textContent = allStudents.length;
            
            const presentCount = allStudents.filter(s => s.status === 'present').length;
            const rate = allStudents.length > 0 ? Math.round((presentCount / allStudents.length) * 100) : 0;
            document.getElementById('attendanceRate').textContent = rate;
            
            // 색상 표시
            const rateElem = document.getElementById('attendanceRate');
            if(rate >= 80) rateElem.className = 'font-bold text-green-600';
            else if(rate >= 50) rateElem.className = 'font-bold text-orange-600';
            else rateElem.className = 'font-bold text-red-600';
        }

        function renderTable() {
            const tbody = document.getElementById('attendanceListBody');
            
            if (currentStudents.length === 0) {
                 tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">해당하는 학생이 없습니다.</td></tr>';
                 return;
            }

            // Note: backticks must be escaped inside this string literal
            tbody.innerHTML = currentStudents.map((s, index) => \`
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs">
                                \${s.name.charAt(0)}
                            </div>
                            <div>
                                <div class="font-medium text-gray-900">\${s.name}</div>
                                <div class="text-xs text-gray-500">\${s.phone || '-'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                        \${s.package_type || '일반'}
                    </td>
                    <td class="px-6 py-4 text-center">
                        <select onchange="updateStudentStatus(\${index}, this.value)" class="px-2 py-1 rounded text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 \${getStatusColorClass(s.status)}">
                            <option value="pending" \${s.status === 'pending' ? 'selected' : ''}>미처리</option>
                            <option value="present" \${s.status === 'present' ? 'selected' : ''}>출석</option>
                            <option value="late" \${s.status === 'late' ? 'selected' : ''}>지각</option>
                            <option value="early_leave" \${s.status === 'early_leave' ? 'selected' : ''}>조퇴</option>
                            <option value="absent" \${s.status === 'absent' ? 'selected' : ''}>결석</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <input type="time" value="\${s.in_time || ''}" onchange="updateStudentData(\${index}, 'in_time', this.value)" class="text-sm border-gray-300 rounded px-2 py-1 w-24">
                    </td>
                    <td class="px-6 py-4 text-center">
                        <input type="time" value="\${s.out_time || ''}" onchange="updateStudentData(\${index}, 'out_time', this.value)" class="text-sm border-gray-300 rounded px-2 py-1 w-24">
                    </td>
                    <td class="px-6 py-4 text-center">
                        <input type="text" value="\${s.memo || ''}" onchange="updateStudentData(\${index}, 'memo', this.value)" class="text-sm border-gray-300 rounded px-2 py-1 w-full" placeholder="특이사항">
                    </td>
                </tr>
            \`).join('');
        }

        function getStatusColorClass(status) {
            switch(status) {
                case 'present': return 'bg-green-100 text-green-800 border-green-200';
                case 'late': 
                case 'early_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'absent': return 'bg-red-100 text-red-800 border-red-200';
                default: return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        }

        function updateStudentStatus(index, value) {
            // 원본 배열(allStudents) 업데이트를 위해 filter된 currentStudents의 ID를 찾아야 함
            const studentId = currentStudents[index].id;
            const originalIndex = allStudents.findIndex(s => s.id === studentId);
            
            if (originalIndex !== -1) {
                allStudents[originalIndex].status = value;
                // 필요시 타임스탬프 자동 입력 등의 로직 추가 가능
                if (value === 'present' && !allStudents[originalIndex].in_time) {
                    allStudents[originalIndex].in_time = '09:00';
                    allStudents[originalIndex].out_time = '18:00';
                }
                renderTable(); // 색상 업데이트를 위해 다시 렌더링
                updateStats();
            }
        }

        function updateStudentData(index, field, value) {
            const studentId = currentStudents[index].id;
            const originalIndex = allStudents.findIndex(s => s.id === studentId);
             if (originalIndex !== -1) {
                allStudents[originalIndex][field] = value;
            }
        }

        async function saveAttendance() {
            if (allStudents.length === 0) return;

            const courseId = document.getElementById('courseSelect').value;
            const date = document.getElementById('attendanceDate').value;
            
            if (!courseId) { alert('과정을 선택하세요.'); return; }

            const dataToSave = {
                courseId: courseId,
                date: date,
                attendances: allStudents.map(s => ({
                    studentId: s.id,
                    status: s.status,
                    inTime: s.in_time,
                    outTime: s.out_time,
                    memo: s.memo
                }))
            };

            try {
                const response = await fetch('/api/hrd/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('출석 정보가 저장되었습니다.');
                    loadStudents(); // 저장 후 재로드
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        function openPrintModal() {
            const courseSelect = document.getElementById('courseSelect');
            if (!courseSelect.value) {
                alert('먼저 과정을 선택해주세요.');
                return;
            }
            
            // Set default month to today YYYY-MM
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            // FIX: escaped backticks for string literal
            document.getElementById('printMonth').value = \`\${yyyy}-\${mm}\`;
            
            document.getElementById('printModal').classList.remove('hidden');
        }

        function printAttendance() {
            const courseSelect = document.getElementById('courseSelect');
            const courseId = courseSelect.value;
            const courseTitle = courseSelect.options[courseSelect.selectedIndex].text;
            const monthVal = document.getElementById('printMonth').value; // YYYY-MM
            
            if (!monthVal) { alert('날짜를 선택하세요'); return; }

            const [year, month] = monthVal.split('-');
            
            // FIX: escaped backticks
            const url = \`/admin/attendance/print?courseId=\${courseId}&courseTitle=\${encodeURIComponent(courseTitle)}&year=\${year}&month=\${month}\`;
            window.open(url, '_blank', 'width=1200,height=800');
            document.getElementById('printModal').classList.add('hidden');
        }
    </script>
</body>
</html>
`;
