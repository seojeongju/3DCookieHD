import { teacherSidebar } from './components/teacher_sidebar';

export const teacherStudentsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 관리 - 강사 대시보드</title>
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
        ${teacherSidebar('students')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">수강생 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">배정된 과정의 수강생을 확인하고 관리합니다.</p>
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

                <!-- 수강생 목록 섹션 (과정 선택 시 표시) -->
                <div id="studentsSection" class="hidden">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <button onclick="backToCourses()" class="px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> 과정 목록으로
                            </button>
                            <h2 class="text-lg font-bold text-gray-800" id="selectedCourseTitle">
                                <i class="fas fa-user-graduate text-blue-500 mr-2"></i> 수강생 목록
                            </h2>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="studentSearch" placeholder="수강생 검색..." 
                                   class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                   onkeyup="if(event.key==='Enter') filterStudents()">
                            <button onclick="filterStudents()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                                <i class="fas fa-search mr-2"></i> 검색
                            </button>
                        </div>
                    </div>

                    <!-- 수강생 목록 테이블 -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강생</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강 상태</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 수강생 목록을 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- 페이지네이션 -->
                    <div id="paginationContainer" class="mt-4 flex justify-center items-center gap-2"></div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let allCourses = [];
        let selectedCourseId = null;
        let selectedCourseTitle = '';
        let allStudents = [];
        let currentPage = 1;
        const limit = 20;

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadCourses();
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
                                <i class="fas fa-users mr-2"></i> 수강생 보기
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
            document.getElementById('studentsSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').innerHTML = \`
                <i class="fas fa-user-graduate text-blue-500 mr-2"></i> \${courseTitle} - 수강생 목록
            \`;
            
            // 수강생 목록 로드
            await loadStudents(1);
        }

        function backToCourses() {
            selectedCourseId = null;
            selectedCourseTitle = '';
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('studentsSection').classList.add('hidden');
            document.getElementById('studentSearch').value = '';
        }

        async function loadStudents(page = 1) {
            try {
                currentPage = page;
                const token = localStorage.getItem('token');
                
                if (!selectedCourseId) {
                    console.error('No course selected');
                    return;
                }

                // 과정별 수강생 조회 (course_id 파라미터 사용)
                const response = await fetch(\`/api/enrollments?course_id=\${selectedCourseId}&status=approved&page=\${page}&limit=\${limit}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    allStudents = result.data || [];
                    renderStudents();
                    renderPagination(result.pagination || {});
                } else {
                    console.error('Failed to load students:', result.error);
                    document.getElementById('studentsTableBody').innerHTML = 
                        '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">수강생 목록을 불러오는데 실패했습니다.</td></tr>';
                }
            } catch (error) {
                console.error('Error loading students:', error);
                document.getElementById('studentsTableBody').innerHTML = 
                    '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function renderStudents() {
            const tbody = document.getElementById('studentsTableBody');
            const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
            
            // 검색 필터링
            let filteredStudents = allStudents;
            if (searchTerm) {
                filteredStudents = allStudents.filter(s => 
                    (s.user_name && s.user_name.toLowerCase().includes(searchTerm)) ||
                    (s.user_email && s.user_email.toLowerCase().includes(searchTerm)) ||
                    (s.user_phone && s.user_phone.includes(searchTerm))
                );
            }

            if (filteredStudents.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                            \${searchTerm ? '검색 결과가 없습니다.' : '수강생이 없습니다.'}
                        </td>
                    </tr>
                \`;
                return;
            }

            tbody.innerHTML = filteredStudents.map(student => {
                // 상태 뱃지
                let statusBadge = '';
                let statusColor = '';
                switch(student.status) {
                    case 'approved':
                        statusBadge = '수강중';
                        statusColor = 'bg-green-100 text-green-800';
                        break;
                    case 'completed':
                        statusBadge = '수료';
                        statusColor = 'bg-blue-100 text-blue-800';
                        break;
                    case 'cancelled':
                        statusBadge = '취소';
                        statusColor = 'bg-red-100 text-red-800';
                        break;
                    default:
                        statusBadge = student.status || '미정';
                        statusColor = 'bg-gray-100 text-gray-800';
                }

                return \`
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                    \${(student.user_name || '학생')[0]}
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-gray-900">\${student.user_name || '이름 없음'}</div>
                                    <div class="text-sm text-gray-500">\${student.user_email || ''}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">\${student.user_phone || '-'}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 rounded-full text-xs font-bold \${statusColor}">\${statusBadge}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString('ko-KR') : '-'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick="viewStudentDetail(\${student.user_id}, \${student.id})" 
                                    class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-eye"></i> 상세
                            </button>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function filterStudents() {
            renderStudents();
        }

        function renderPagination(pagination) {
            const container = document.getElementById('paginationContainer');
            if (!pagination || pagination.totalPages <= 1) {
                container.innerHTML = '';
                return;
            }

            const pages = [];
            const totalPages = pagination.totalPages;
            const current = pagination.currentPage || currentPage;

            // 이전 버튼
            pages.push(\`
                <button onclick="loadStudents(\${current - 1})" 
                        \${current === 1 ? 'disabled class="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"' : 'class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"'}
                        \${current === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
            \`);

            // 페이지 번호
            const startPage = Math.max(1, current - 2);
            const endPage = Math.min(totalPages, current + 2);

            if (startPage > 1) {
                pages.push(\`<button onclick="loadStudents(1)" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">1</button>\`);
                if (startPage > 2) {
                    pages.push('<span class="px-3 py-2 text-gray-400">...</span>');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(\`
                    <button onclick="loadStudents(\${i})" 
                            class="px-3 py-2 border border-gray-300 rounded-lg \${i === current ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'} transition">
                        \${i}
                    </button>
                \`);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('<span class="px-3 py-2 text-gray-400">...</span>');
                }
                pages.push(\`<button onclick="loadStudents(\${totalPages})" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">\${totalPages}</button>\`);
            }

            // 다음 버튼
            pages.push(\`
                <button onclick="loadStudents(\${current + 1})" 
                        \${current === totalPages ? 'disabled class="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"' : 'class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"'}
                        \${current === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            \`);

            container.innerHTML = pages.join('');
        }

        function viewStudentDetail(userId, enrollmentId) {
            // 수강생 상세 정보 보기 (추후 구현)
            alert('수강생 상세 정보 기능은 준비 중입니다.\\n\\n수강생 ID: ' + userId + '\\n수강 신청 ID: ' + enrollmentId);
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
