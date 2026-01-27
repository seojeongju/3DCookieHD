import { teacherSidebar } from './components/teacher_sidebar';

export const teacherCoursesHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 강의 관리 - 강사 대시보드</title>
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
        ${teacherSidebar('courses')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">나의 강의 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">관리자가 배정한 담당 과정을 확인하고 관리합니다.</p>
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
                <!-- 필터 및 검색 -->
                <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div class="flex gap-4 items-center flex-wrap">
                        <select id="categoryFilter" onchange="loadCourses()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">전체 카테고리</option>
                            <option value="국비지원">국비지원</option>
                            <option value="자격증">자격증</option>
                            <option value="취업연계">취업연계</option>
                            <option value="기타">기타</option>
                        </select>
                        <select id="statusFilter" onchange="loadCourses()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">전체 상태</option>
                            <option value="active">진행중</option>
                            <option value="upcoming">예정</option>
                            <option value="completed">완료</option>
                            <option value="cancelled">취소</option>
                        </select>
                        <input type="text" id="searchInput" placeholder="과정명 검색..." 
                               class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                               onkeyup="if(event.key==='Enter') loadCourses()">
                        <button onclick="loadCourses()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                            <i class="fas fa-search mr-2"></i> 검색
                        </button>
                    </div>
                    <div class="text-sm text-gray-600">
                        총 <span id="totalCount" class="font-bold text-blue-600">0</span>개 과정
                    </div>
                </div>

                <!-- 과정 목록 -->
                <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                        <p class="mt-4 text-gray-500">과정 목록을 불러오는 중...</p>
                    </div>
                </div>

                <!-- 페이지네이션 -->
                <div id="paginationContainer" class="mt-8 flex justify-center items-center gap-2"></div>
            </main>
        </div>
    </div>

    <script>
        let currentPage = 1;
        const limit = 12;

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

        async function loadCourses(page = 1) {
            try {
                currentPage = page;
                const token = localStorage.getItem('token');
                const category = document.getElementById('categoryFilter').value;
                const status = document.getElementById('statusFilter').value;
                const search = document.getElementById('searchInput').value;

                // API 호출 (강사는 자동으로 본인 과정만 필터링됨)
                let url = \`/api/courses?page=\${page}&limit=\${limit}\`;
                if (category) url += \`&category=\${encodeURIComponent(category)}\`;
                if (status) url += \`&status=\${encodeURIComponent(status)}\`;
                if (search) url += \`&search=\${encodeURIComponent(search)}\`;

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    renderCourses(result.data || []);
                    renderPagination(result.pagination || {});
                    document.getElementById('totalCount').textContent = result.pagination?.total || 0;
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

        function renderCourses(courses) {
            const container = document.getElementById('coursesContainer');
            
            if (courses.length === 0) {
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

            container.innerHTML = courses.map(course => {
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

                // 카테고리 뱃지
                const categoryColors = {
                    '국비지원': 'bg-purple-100 text-purple-800',
                    '자격증': 'bg-orange-100 text-orange-800',
                    '취업연계': 'bg-blue-100 text-blue-800',
                    '기타': 'bg-gray-100 text-gray-800'
                };
                const categoryColor = categoryColors[course.category] || 'bg-gray-100 text-gray-800';

                return \`
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                        <div class="relative">
                            \${course.thumbnail_url 
                                ? \`<img src="\${course.thumbnail_url}" alt="\${course.title}" class="w-full h-48 object-cover">\`
                                : \`<div class="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <i class="fas fa-book text-5xl text-gray-400"></i>
                                </div>\`
                            }
                            <div class="absolute top-3 right-3 flex gap-2">
                                <span class="px-2 py-1 rounded-full text-xs font-bold \${statusColor}">\${statusBadge}</span>
                                <span class="px-2 py-1 rounded-full text-xs font-bold \${categoryColor}">\${course.category || '기타'}</span>
                            </div>
                        </div>
                        <div class="p-5">
                            <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">\${course.title || '과정명 없음'}</h3>
                            <p class="text-sm text-gray-600 mb-4 line-clamp-2">\${course.description || '설명 없음'}</p>
                            
                            <div class="space-y-2 mb-4 text-sm text-gray-600">
                                \${course.campus_name ? \`
                                    <div class="flex items-center">
                                        <i class="fas fa-map-marker-alt w-5 text-gray-400"></i>
                                        <span>\${course.campus_name}</span>
                                    </div>
                                \` : ''}
                                \${course.start_date ? \`
                                    <div class="flex items-center">
                                        <i class="fas fa-calendar-alt w-5 text-gray-400"></i>
                                        <span>시작일: \${course.start_date.split('T')[0]}</span>
                                    </div>
                                \` : ''}
                                <div class="flex items-center">
                                    <i class="fas fa-user-graduate w-5 text-gray-400"></i>
                                    <span>수강생: \${course.current_students || 0}명 / 최대 \${course.max_students || 0}명</span>
                                </div>
                                \${course.price ? \`
                                    <div class="flex items-center">
                                        <i class="fas fa-won-sign w-5 text-gray-400"></i>
                                        <span class="font-bold text-blue-600">\${course.price.toLocaleString()}원</span>
                                    </div>
                                \` : ''}
                            </div>

                            <div class="flex gap-2 pt-4 border-t border-gray-100">
                                <button onclick="viewCourseDetail(\${course.id})" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                    <i class="fas fa-eye mr-2"></i> 상세보기
                                </button>
                                <button onclick="manageCourse(\${course.id})" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                                    <i class="fas fa-cog mr-2"></i> 관리
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
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
                <button onclick="loadCourses(\${current - 1})" 
                        \${current === 1 ? 'disabled class="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"' : 'class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"'}
                        \${current === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
            \`);

            // 페이지 번호
            const startPage = Math.max(1, current - 2);
            const endPage = Math.min(totalPages, current + 2);

            if (startPage > 1) {
                pages.push(\`<button onclick="loadCourses(1)" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">1</button>\`);
                if (startPage > 2) {
                    pages.push('<span class="px-3 py-2 text-gray-400">...</span>');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(\`
                    <button onclick="loadCourses(\${i})" 
                            class="px-3 py-2 border border-gray-300 rounded-lg \${i === current ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'} transition">
                        \${i}
                    </button>
                \`);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('<span class="px-3 py-2 text-gray-400">...</span>');
                }
                pages.push(\`<button onclick="loadCourses(\${totalPages})" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">\${totalPages}</button>\`);
            }

            // 다음 버튼
            pages.push(\`
                <button onclick="loadCourses(\${current + 1})" 
                        \${current === totalPages ? 'disabled class="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"' : 'class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"'}
                        \${current === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            \`);

            container.innerHTML = pages.join('');
        }

        function viewCourseDetail(courseId) {
            // 과정 상세 페이지로 이동 (또는 모달로 표시)
            window.location.href = \`/courses/\${courseId}\`;
        }

        function manageCourse(courseId) {
            // 과정 관리 페이지로 이동 (수강생 관리, 출석 관리 등)
            alert('과정 관리 기능은 준비 중입니다.\\n\\n수강생 관리, 출석 관리 등의 기능이 제공될 예정입니다.');
            // 추후 구현: window.location.href = \`/teacher/courses/\${courseId}/manage\`;
        }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
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
