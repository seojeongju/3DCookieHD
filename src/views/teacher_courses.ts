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
        <div class="flex-1 flex flex-col overflow-hidden bg-[#f1f3f5]">
            <header class="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div class="px-10 py-6 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-200">
                            <i class="fas fa-chalkboard-teacher text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-black text-gray-900 tracking-tight">나의 강의 관리 (My Course Management)</h1>
                            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Academic Operations Control System</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider">Lead Instructor</span>
                        <a href="/teacher" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-gray-100">
                            <i class="fas fa-chart-pie"></i>
                        </a>
                    </div>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <!-- 필터 및 검색 (Bento Filter Card) -->
                <div class="bg-white border border-gray-200 rounded-[2rem] p-6 mb-10 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                    <div class="flex gap-4 items-center flex-wrap flex-1">
                        <div class="relative min-w-[180px]">
                            <select id="categoryFilter" onchange="loadCourses()" class="w-full pl-5 pr-10 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-700 text-xs appearance-none cursor-pointer">
                                <option value="">전체 카테고리 (All Categories)</option>
                                <option value="국비지원">국비지원 (HRD Plan)</option>
                                <option value="자격증">자격증 (Certificate)</option>
                                <option value="취업연계">취업연계 (Carrier)</option>
                                <option value="기타">기타 (Others)</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
                        </div>
                        <div class="relative min-w-[150px]">
                            <select id="statusFilter" onchange="loadCourses()" class="w-full pl-5 pr-10 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-700 text-xs appearance-none cursor-pointer">
                                <option value="">전체 상태 (All Status)</option>
                                <option value="active">진행중 (Active)</option>
                                <option value="upcoming">예정 (Upcoming)</option>
                                <option value="completed">완료 (Completed)</option>
                                <option value="cancelled">취소 (Cancelled)</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
                        </div>
                        <div class="relative flex-1 max-w-md group">
                            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors text-sm"></i>
                            <input type="text" id="searchInput" placeholder="검색어를 입력하세요 (Search course title...)" 
                                   class="w-full pl-12 pr-6 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 text-xs"
                                   onkeyup="if(event.key==='Enter') loadCourses()">
                        </div>
                        <button onclick="loadCourses()" class="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-black text-xs transition-all shadow-lg shadow-gray-200">
                             조회 실행 (Search)
                        </button>
                    </div>
                    <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Active Courses</span>
                        <div class="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100" id="totalCount">0</div>
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
                    <div class="col-span-full text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">
                        <div class="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
                            <i class="fas fa-chalkboard text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">배정된 강의가 존재하지 않습니다</h3>
                        <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">No Assigned Courses in Database</p>
                        <button onclick="location.href='/teacher'" class="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl">
                            대시보드로 귀환 (Return to Dashboard)
                        </button>
                    </div>
                \`;
                return;
            }

            container.innerHTML = courses.map(course => {
                const enrolledCount = course.current_students || 0;
                const maxStudents = course.max_students || 0;
                const progressPercent = maxStudents > 0 ? Math.round((enrolledCount / maxStudents) * 100) : 0;
                
                let statusInfo = { badge: '미정', class: 'bg-gray-100 text-gray-600' };
                switch(course.status) {
                    case 'active': statusInfo = { badge: '운영중', class: 'bg-green-100 text-green-700' }; break;
                    case 'upcoming': statusInfo = { badge: '모집중', class: 'bg-blue-100 text-blue-700' }; break;
                    case 'completed': statusInfo = { badge: '종료', class: 'bg-gray-900 text-gray-400' }; break;
                    case 'cancelled': statusInfo = { badge: '취소', class: 'bg-red-100 text-red-700' }; break;
                }

                return \`
                    <div class="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                        <div class="relative aspect-[16/10] overflow-hidden">
                            \${course.thumbnail_url 
                                ? \`<img src="\${course.thumbnail_url}" alt="\${course.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">\`
                                : \`<div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <i class="fas fa-cube text-5xl text-gray-300"></i>
                                </div>\`
                            }
                            <div class="absolute top-6 left-6 flex gap-2">
                                <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg bg-white/90 backdrop-blur-md text-gray-900">\${course.category || 'GENERAL'}</span>
                            </div>
                            <div class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full \${course.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
                                    <span class="text-[10px] font-black text-white uppercase tracking-widest">\${statusInfo.badge} ( \${course.status} )</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-8 space-y-6">
                            <div class="min-h-[64px]">
                                <h3 class="text-xl font-black text-gray-900 tracking-tight line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">\${course.title || 'Untitled Course'}</h3>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <span class="block text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Students</span>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-xl font-black text-gray-900">\${enrolledCount}</span>
                                        <span class="text-[10px] font-bold text-gray-400">/ \${maxStudents}</span>
                                    </div>
                                    <div class="mt-2 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                        <div class="bg-blue-600 h-full rounded-full transition-all duration-1000" style="width: \${progressPercent}%"></div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <span class="block text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Schedule</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <i class="far fa-calendar-alt text-blue-500 text-xs"></i>
                                        <span class="text-[11px] font-black text-gray-700">\${course.start_date ? course.start_date.split('T')[0] : 'N/A'}</span>
                                    </div>
                                    <p class="text-[9px] font-bold text-gray-400 mt-1 uppercase">Commencement Date</p>
                                </div>
                            </div>

                            <div class="flex gap-3 pt-4 border-t border-gray-50">
                                <button onclick="viewCourseDetail(\${course.id})" class="flex-1 px-4 py-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-all font-black text-[10px] tracking-widest uppercase">
                                     강의 보기 (Overview)
                                </button>
                                <button onclick="manageCourse(\${course.id})" class="w-14 h-14 bg-gray-900 text-white rounded-2xl hover:bg-black flex items-center justify-center transition-all shadow-xl shadow-gray-200">
                                    <i class="fas fa-cog"></i>
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
