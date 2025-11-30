
export const adminLmsAttendanceHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출결 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="flex flex-col items-start group">
                        <div class="flex items-center gap-2">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                            <span class="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">LMS</span>
                        </div>
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">학사관리 시스템</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="#" id="backToDashboard" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>대시보드로
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">출결 관리</h1>
                    <p class="text-gray-600 mt-1" id="courseTitle">과정명 로딩중...</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input type="date" id="attendanceDate" class="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="fas fa-calendar text-gray-400"></i>
                        </div>
                    </div>
                    <button onclick="saveAttendance()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
                        <i class="fas fa-save mr-2"></i> 저장하기
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 통계 카드 -->
        <div class="grid grid-cols-5 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow p-4 text-center border-b-4 border-green-500">
                <div class="text-sm text-gray-500 mb-1">출석</div>
                <div class="text-2xl font-bold text-green-600" id="countPresent">0</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4 text-center border-b-4 border-yellow-500">
                <div class="text-sm text-gray-500 mb-1">지각</div>
                <div class="text-2xl font-bold text-yellow-600" id="countLate">0</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4 text-center border-b-4 border-orange-500">
                <div class="text-sm text-gray-500 mb-1">조퇴</div>
                <div class="text-2xl font-bold text-orange-600" id="countEarly">0</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4 text-center border-b-4 border-red-500">
                <div class="text-sm text-gray-500 mb-1">결석</div>
                <div class="text-2xl font-bold text-red-600" id="countAbsent">0</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4 text-center border-b-4 border-gray-500">
                <div class="text-sm text-gray-500 mb-1">공결</div>
                <div class="text-2xl font-bold text-gray-600" id="countPublic">0</div>
            </div>
        </div>

        <!-- 출결 테이블 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생명</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">입실시간</th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">퇴실시간</th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
                    </tr>
                </thead>
                <tbody id="attendanceTableBody" class="bg-white divide-y divide-gray-200">
                    <!-- 데이터 로드 -->
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        let students = [];
        let attendanceData = {};

        document.addEventListener('DOMContentLoaded', () => {
            // 오늘 날짜로 초기화
            document.getElementById('attendanceDate').valueAsDate = new Date();
            document.getElementById('backToDashboard').href = \`/admin/courses/\${courseId}/lms\`;
            
            loadCourseInfo();
            loadAttendance();
            
            // 날짜 변경 시 재조회
            document.getElementById('attendanceDate').addEventListener('change', loadAttendance);
        });

        async function loadCourseInfo() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/courses/\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('courseTitle').textContent = result.data.title;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function loadAttendance() {
            const date = document.getElementById('attendanceDate').value;
            
            try {
                const token = localStorage.getItem('token');
                // 1. 수강생 목록 조회
                // 2. 해당 날짜의 출결 기록 조회
                // (실제로는 API 하나로 합치는게 좋음: GET /api/courses/:id/attendance?date=YYYY-MM-DD)
                
                const response = await fetch(\`/api/courses/\${courseId}/attendance?date=\${date}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    students = result.data.students;
                    renderTable();
                    updateStats();
                } else {
                    document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">데이터 로드 실패</td></tr>';
                }
            } catch (error) {
                console.error('Error:', error);
                // 임시 더미 데이터 (API 미구현 시 테스트용)
                loadDummyData();
            }
        }

        function loadDummyData() {
            students = [
                { id: 1, name: '홍길동', phone: '010-1234-5678', check_in: '08:55', check_out: '18:05', status: 'present', note: '' },
                { id: 2, name: '김철수', phone: '010-2222-3333', check_in: '09:10', check_out: '18:00', status: 'late', note: '지하철 연착' },
                { id: 3, name: '이영희', phone: '010-4444-5555', check_in: '', check_out: '', status: 'absent', note: '병가' },
                { id: 4, name: '박민수', phone: '010-6666-7777', check_in: '08:50', check_out: '14:00', status: 'early_leave', note: '병원 예약' },
                { id: 5, name: '최수진', phone: '010-8888-9999', check_in: '08:58', check_out: '18:10', status: 'present', note: '' },
            ];
            renderTable();
            updateStats();
        }

        function renderTable() {
            const tbody = document.getElementById('attendanceTableBody');
            tbody.innerHTML = students.map((student, index) => \`
                <tr class="hover:bg-gray-50 transition" data-id="\${student.id}">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${student.name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">\${student.phone}</div>
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
            \`).join('');
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
                renderTable(); // 색상 업데이트를 위해 리렌더링
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
                const response = await fetch(\`/api/courses/\${courseId}/attendance\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        date: date,
                        records: students
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
    </script>
</body>
</html>
`;
