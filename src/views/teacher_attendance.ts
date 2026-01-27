import { teacherSidebar } from './components/teacher_sidebar';

export const teacherAttendanceHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출석 관리 - 강사 대시보드</title>
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
        ${teacherSidebar('attendance')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">출석 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">배정된 과정의 수강생 출석을 관리합니다.</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                        <a href="/teacher" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-arrow-left mr-1"></i> 대시보드로
                        </a>
                    </div>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-8">
                <!-- 과정 목록 섹션 -->
                <div id="coursesSection" class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chalkboard-teacher text-blue-500 mr-2"></i> 배정된 과정 목록
                    </h2>
                    <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="mt-4 text-gray-500">과정 목록을 불러오는 중...</p>
                        </div>
                    </div>
                </div>

                <!-- 출석 관리 섹션 (과정 선택 시 표시) -->
                <div id="attendanceSection" class="hidden">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <button onclick="backToCourses()" class="px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> 과정 목록으로
                            </button>
                            <h2 class="text-lg font-bold text-gray-800" id="selectedCourseTitle">
                                <i class="fas fa-calendar-check text-blue-500 mr-2"></i> 출석 관리
                            </h2>
                        </div>
                        <button onclick="saveAttendance()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center shadow-sm">
                            <i class="fas fa-save mr-2"></i> 출석 저장
                        </button>
                    </div>

                    <!-- 필터 카드 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">기준 날짜</label>
                                <input type="date" id="attendanceDate" onchange="loadAttendance()" 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       value="">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">상태 필터</label>
                                <select id="statusFilter" onchange="filterAttendance()" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">전체</option>
                                    <option value="present">출석</option>
                                    <option value="late">지각</option>
                                    <option value="early_leave">조퇴</option>
                                    <option value="absent">결석</option>
                                </select>
                            </div>
                            <div class="text-right">
                                <div class="text-sm text-gray-500">총 인원: <span id="totalStudents" class="font-bold text-gray-800">0</span>명</div>
                                <div class="text-xs text-blue-600 font-medium mt-1">출석률: <span id="attendanceRate">0</span>%</div>
                            </div>
                        </div>
                    </div>

                    <!-- 출석 리스트 테이블 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름 / 연락처</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">출석 상태</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">입실 시간</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">퇴실 시간</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">메모</th>
                                </tr>
                            </thead>
                            <tbody id="attendanceTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 출석 정보를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let allCourses = [];
        let selectedCourseId = null;
        let selectedCourseTitle = '';
        let attendanceData = [];
        let selectedDate = '';

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadCourses();
            // 오늘 날짜를 기본값으로 설정
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('attendanceDate').value = today;
            selectedDate = today;
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
        }

        async function loadCourses() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    allCourses = result.data || [];
                    renderCourses();
                } else {
                    console.error('Failed to load courses:', result.error);
                    document.getElementById('coursesContainer').innerHTML = 
                        '<div class="col-span-full text-center py-12 text-red-500">과정 목록을 불러오는데 실패했습니다.</div>';
                }
            } catch (error) {
                console.error('Error loading courses:', error);
                document.getElementById('coursesContainer').innerHTML = 
                    '<div class="col-span-full text-center py-12 text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function renderCourses() {
            const container = document.getElementById('coursesContainer');
            
            if (allCourses.length === 0) {
                container.innerHTML = \`
                    <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-chalkboard text-5xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">배정된 과정이 없습니다</h3>
                        <p class="text-gray-500 mb-4">관리자(원장)에게 과정 배정을 요청하세요.</p>
                        <a href="/teacher" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-arrow-left mr-2"></i> 대시보드로 돌아가기
                        </a>
                    </div>
                \`;
                return;
            }

            container.innerHTML = allCourses.map(course => {
                // 상태 뱃지
                let statusBadge = '';
                let statusColor = '';
                switch(course.status) {
                    case 'active':
                        statusBadge = '진행중';
                        statusColor = 'bg-green-100 text-green-800';
                        break;
                    case 'upcoming':
                        statusBadge = '예정';
                        statusColor = 'bg-blue-100 text-blue-800';
                        break;
                    case 'completed':
                        statusBadge = '완료';
                        statusColor = 'bg-gray-100 text-gray-800';
                        break;
                    case 'cancelled':
                        statusBadge = '취소';
                        statusColor = 'bg-red-100 text-red-800';
                        break;
                    default:
                        statusBadge = course.status || '미정';
                        statusColor = 'bg-gray-100 text-gray-800';
                }

                return \`
                    <div onclick="selectCourse(\${course.id}, '\${(course.title || '').replace(/'/g, "\\\\'")}')" 
                         class="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">\${course.title || '과정명 없음'}</h3>
                                <p class="text-sm text-gray-600 line-clamp-2 mb-3">\${course.description || '설명 없음'}</p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-bold \${statusColor} ml-2 flex-shrink-0">\${statusBadge}</span>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            \${course.campus_name ? \`
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt w-5 text-gray-400"></i>
                                    <span>\${course.campus_name}</span>
                                </div>
                            \` : ''}
                            <div class="flex items-center">
                                <i class="fas fa-user-graduate w-5 text-gray-400"></i>
                                <span>수강생: \${course.current_students || 0}명</span>
                            </div>
                            \${course.start_date ? \`
                                <div class="flex items-center">
                                    <i class="fas fa-calendar-alt w-5 text-gray-400"></i>
                                    <span>\${course.start_date.split('T')[0]}</span>
                                </div>
                            \` : ''}
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                <i class="fas fa-calendar-check mr-2"></i> 출석 관리
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        async function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            selectedCourseTitle = courseTitle;
            
            // UI 전환
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('attendanceSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').innerHTML = \`
                <i class="fas fa-calendar-check text-blue-500 mr-2"></i> \${courseTitle} - 출석 관리
            \`;
            
            // 출석 정보 로드
            await loadAttendance();
        }

        function backToCourses() {
            selectedCourseId = null;
            selectedCourseTitle = '';
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('attendanceSection').classList.add('hidden');
        }

        async function loadAttendance() {
            try {
                const token = localStorage.getItem('token');
                const dateInput = document.getElementById('attendanceDate');
                selectedDate = dateInput.value;
                
                if (!selectedCourseId || !selectedDate) {
                    alert('과정과 날짜를 선택해주세요.');
                    return;
                }

                // 출석 현황 조회
                const response = await fetch(\`/api/hrd/attendance?courseId=\${selectedCourseId}&date=\${selectedDate}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    attendanceData = result.data || [];
                    renderAttendance();
                    updateStatistics();
                } else {
                    console.error('Failed to load attendance:', result.error);
                    document.getElementById('attendanceTableBody').innerHTML = 
                        '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">출석 정보를 불러오는데 실패했습니다.</td></tr>';
                }
            } catch (error) {
                console.error('Error loading attendance:', error);
                document.getElementById('attendanceTableBody').innerHTML = 
                    '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function renderAttendance() {
            const tbody = document.getElementById('attendanceTableBody');
            const statusFilter = document.getElementById('statusFilter').value;
            
            // 상태 필터링
            let filteredData = attendanceData;
            if (statusFilter !== 'all') {
                filteredData = attendanceData.filter(a => a.status === statusFilter);
            }

            if (filteredData.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                            \${statusFilter !== 'all' ? '해당 상태의 수강생이 없습니다.' : '수강생이 없습니다.'}
                        </td>
                    </tr>
                \`;
                return;
            }

            tbody.innerHTML = filteredData.map((student, index) => {
                const studentId = student.id;
                const enrollmentId = student.enrollment_id;
                const status = student.status || 'absent';
                const inTime = student.in_time || '';
                const outTime = student.out_time || '';
                const memo = student.memo || '';

                // 상태 뱃지 색상
                let statusColor = '';
                let statusText = '';
                switch(status) {
                    case 'present':
                        statusColor = 'bg-green-100 text-green-800';
                        statusText = '출석';
                        break;
                    case 'late':
                        statusColor = 'bg-yellow-100 text-yellow-800';
                        statusText = '지각';
                        break;
                    case 'early_leave':
                        statusColor = 'bg-orange-100 text-orange-800';
                        statusText = '조퇴';
                        break;
                    case 'absent':
                        statusColor = 'bg-red-100 text-red-800';
                        statusText = '결석';
                        break;
                    default:
                        statusColor = 'bg-gray-100 text-gray-800';
                        statusText = '미처리';
                }

                return \`
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                    \${(student.name || '학생')[0]}
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-gray-900">\${student.name || '이름 없음'}</div>
                                    <div class="text-sm text-gray-500">\${student.phone || '-'}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <select 
                                class="status-select px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \${statusColor}"
                                data-student-id="\${studentId}"
                                data-enrollment-id="\${enrollmentId}"
                                onchange="updateStatusColor(this)">
                                <option value="present" \${status === 'present' ? 'selected' : ''}>출석</option>
                                <option value="late" \${status === 'late' ? 'selected' : ''}>지각</option>
                                <option value="early_leave" \${status === 'early_leave' ? 'selected' : ''}>조퇴</option>
                                <option value="absent" \${status === 'absent' ? 'selected' : ''}>결석</option>
                            </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <input type="time" 
                                   class="in-time-input px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   data-student-id="\${studentId}"
                                   value="\${inTime ? inTime.substring(0, 5) : ''}"
                                   placeholder="09:00">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <input type="time" 
                                   class="out-time-input px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   data-student-id="\${studentId}"
                                   value="\${outTime ? outTime.substring(0, 5) : ''}"
                                   placeholder="18:00">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <input type="text" 
                                   class="memo-input w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   data-student-id="\${studentId}"
                                   value="\${memo}"
                                   placeholder="메모 입력...">
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function updateStatusColor(select) {
            const status = select.value;
            let statusColor = '';
            switch(status) {
                case 'present':
                    statusColor = 'bg-green-100 text-green-800';
                    break;
                case 'late':
                    statusColor = 'bg-yellow-100 text-yellow-800';
                    break;
                case 'early_leave':
                    statusColor = 'bg-orange-100 text-orange-800';
                    break;
                case 'absent':
                    statusColor = 'bg-red-100 text-red-800';
                    break;
                default:
                    statusColor = 'bg-gray-100 text-gray-800';
            }
            select.className = \`status-select px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \${statusColor}\`;
        }

        function filterAttendance() {
            renderAttendance();
            updateStatistics();
        }

        function updateStatistics() {
            const total = attendanceData.length;
            const present = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            
            document.getElementById('totalStudents').textContent = total;
            document.getElementById('attendanceRate').textContent = rate;
        }

        async function saveAttendance() {
            try {
                const token = localStorage.getItem('token');
                
                if (!selectedCourseId || !selectedDate) {
                    alert('과정과 날짜를 선택해주세요.');
                    return;
                }

                // 테이블에서 출석 데이터 수집
                const attendances = [];
                const rows = document.querySelectorAll('#attendanceTableBody tr');
                
                rows.forEach(row => {
                    const statusSelect = row.querySelector('.status-select');
                    const inTimeInput = row.querySelector('.in-time-input');
                    const outTimeInput = row.querySelector('.out-time-input');
                    const memoInput = row.querySelector('.memo-input');
                    
                    if (statusSelect) {
                        const studentId = statusSelect.getAttribute('data-student-id');
                        const enrollmentId = statusSelect.getAttribute('data-enrollment-id');
                        const status = statusSelect.value;
                        const inTime = inTimeInput ? inTimeInput.value : '';
                        const outTime = outTimeInput ? outTimeInput.value : '';
                        const memo = memoInput ? memoInput.value : '';
                        
                        attendances.push({
                            studentId: parseInt(studentId),
                            enrollmentId: parseInt(enrollmentId),
                            status: status,
                            inTime: inTime || null,
                            outTime: outTime || null,
                            memo: memo || null
                        });
                    }
                });

                // API 호출
                const response = await fetch('/api/hrd/attendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        courseId: selectedCourseId,
                        date: selectedDate,
                        attendances: attendances
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('출석 정보가 저장되었습니다.');
                    // 다시 로드하여 최신 데이터 반영
                    await loadAttendance();
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('저장 중 오류가 발생했습니다: ' + (error.message || error));
            }
        }
    </script>
    <style>
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</body>
</html>
`;
