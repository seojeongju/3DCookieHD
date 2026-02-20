import { teacherSidebar } from './components/teacher_sidebar';

function teacherCoursesHtmlInner(activeSubMenu?: string) {
  const tab = activeSubMenu && ['students', 'attendance', 'exams', 'surveys'].includes(activeSubMenu) ? activeSubMenu : undefined;
  return `
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
        ${teacherSidebar('courses', tab)}
        <div class="flex-1 flex flex-col overflow-hidden bg-[#f1f3f5]">
            <header class="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div class="px-10 py-6 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-200">
                            <i class="fas fa-chalkboard-teacher text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-black text-gray-900 tracking-tight">나의 강의 관리</h1>
                            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">학사 운영 관리 시스템</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider">책임 강사</span>
                        <a href="/teacher" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-gray-100">
                            <i class="fas fa-chart-pie"></i>
                        </a>
                    </div>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <!-- tab 안내 배너 (나의 강의 → LMS 특정 탭 직행 시) -->
                <div id="tabHintBanner" class="hidden mb-6 px-6 py-4 bg-blue-50 border border-blue-200/60 rounded-2xl flex items-center gap-3 text-blue-800">
                    <i class="fas fa-info-circle text-blue-500 text-lg"></i>
                    <p class="text-sm font-bold" id="tabHintText">과정을 선택하면 해당 과정의 LMS로 이동합니다.</p>
                </div>
                <!-- 필터 및 검색 (Bento Filter Card) -->
                <div class="bg-white border border-gray-200 rounded-[2rem] p-6 mb-10 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                    <div class="flex gap-4 items-center flex-wrap flex-1">
                        <div class="relative min-w-[180px]">
                            <select id="categoryFilter" onchange="loadCourses()" class="w-full pl-5 pr-10 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-700 text-xs appearance-none cursor-pointer">
                                <option value="">전체 카테고리</option>
                                <option value="국비지원">국비지원</option>
                                <option value="자격증">자격증</option>
                                <option value="취업연계">취업연계</option>
                                <option value="기타">기타</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
                        </div>
                        <div class="relative min-w-[150px]">
                            <select id="statusFilter" onchange="loadCourses()" class="w-full pl-5 pr-10 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-700 text-xs appearance-none cursor-pointer">
                                <option value="">전체 상태</option>
                                <option value="active">진행중</option>
                                <option value="upcoming">예정</option>
                                <option value="completed">완료</option>
                                <option value="cancelled">취소</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
                        </div>
                        <div class="relative flex-1 max-w-md group">
                            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors text-sm"></i>
                            <input type="text" id="searchInput" placeholder="강의명을 입력하세요" 
                                   class="w-full pl-12 pr-6 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 text-xs"
                                   onkeyup="if(event.key==='Enter') loadCourses()">
                        </div>
                        <button onclick="loadCourses()" class="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-black text-xs transition-all shadow-lg shadow-gray-200">
                             조회
                        </button>
                    </div>
                    <div class="flex items-center gap-3 pl-6 border-l border-gray-100 flex-wrap">
                        <span id="searchResultTextTeacherCourses" class="text-sm text-gray-500">검색결과 0건</span>
                        <label class="flex items-center gap-1.5 text-sm text-gray-500">
                            <span>페이지당</span>
                            <select id="rowsPerPageTeacherCourses" onchange="setRowsPerPageTeacherCourses(parseInt(this.value,10))" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="12">12</option>
                                <option value="24">24</option>
                                <option value="36">36</option>
                                <option value="50">50</option>
                            </select>
                            <span>건</span>
                        </label>
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">진행 중인 강의</span>
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
                <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div id="paginationRangeTeacherCourses" class="text-sm text-gray-600"></div>
                    <nav id="paginationContainer" class="flex flex-wrap items-center justify-center gap-1"></nav>
                </div>
            </main>
        </div>
    </div>

    <script>
        let currentPage = 1;
        let limit = 12;

        function setRowsPerPageTeacherCourses(n) {
            limit = n;
            const sel = document.getElementById('rowsPerPageTeacherCourses');
            if (sel) sel.value = String(n);
            loadCourses(1);
        }

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            showTabHintIfNeeded();
            loadCourses();
        });

        function showTabHintIfNeeded() {
            const lmsTab = getLmsTab();
            const banner = document.getElementById('tabHintBanner');
            const textEl = document.getElementById('tabHintText');
            if (!banner || !textEl) return;
            const labels = { students: '수강생', attendance: '출결관리', cbt: 'CBT/시험', surveys: '설문/평가' };
            if (lmsTab && labels[lmsTab]) {
                banner.classList.remove('hidden');
                textEl.textContent = '과정을 선택하면 해당 과정의 「' + labels[lmsTab] + '」 탭으로 바로 이동합니다.';
            }
        }

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
                let url = '/api/courses?page=' + page + '&limit=' + limit;
                if (category) url += '&category=' + encodeURIComponent(category);
                if (status) url += '&status=' + encodeURIComponent(status);
                if (search) url += '&search=' + encodeURIComponent(search);

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    const p = result.pagination || {};
                    const total = p.total != null ? p.total : 0;
                    const pageNum = p.page != null ? p.page : currentPage;
                    if (p.limit) {
                        limit = p.limit;
                        const sel = document.getElementById('rowsPerPageTeacherCourses');
                        if (sel) sel.value = String(p.limit);
                    }
                    document.getElementById('searchResultTextTeacherCourses').textContent = '검색결과 ' + total + '건';
                    document.getElementById('totalCount').textContent = total;
                    const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || limit) + 1;
                    const end = Math.min(pageNum * (p.limit || limit), total);
                    document.getElementById('paginationRangeTeacherCourses').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';
                    renderCourses(result.data || []);
                    renderPagination(p);
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
            console.log('Rendering courses (safe version)', courses);
            const container = document.getElementById('coursesContainer');
            
            if (!courses || courses.length === 0) {
                container.innerHTML = 
                    '<div class="col-span-full text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">' +
                        '<div class="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">' +
                            '<i class="fas fa-chalkboard text-4xl"></i>' +
                        '</div>' +
                        '<h3 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">배정된 강의가 존재하지 않습니다</h3>' +
                        '<p class="text-sm font-bold text-gray-400 uppercase tracking-widest">데이터베이스에 배정된 강의가 없습니다</p>' +
                        '<button onclick="location.href=\\'/teacher\\'" class="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl">' +
                            '대시보드로 돌아가기' +
                        '</button>' +
                    '</div>';
                return;
            }

            container.innerHTML = courses.map(course => {
                const enrolledCount = course.current_students || 0;
                const maxStudents = course.max_students || 0;
                const progressPercent = maxStudents > 0 ? Math.round((enrolledCount / maxStudents) * 100) : (enrolledCount > 0 ? 100 : 0);
                
                let statusInfo = { badge: '미정', class: 'bg-gray-100 text-gray-600' };
                switch(course.status) {
                    case 'active': case 'open': statusInfo = { badge: '운영중', class: 'bg-green-100 text-green-700' }; break;
                    case 'upcoming': case 'recruiting': statusInfo = { badge: '모집중', class: 'bg-blue-100 text-blue-700' }; break;
                    case 'completed': case 'closed': statusInfo = { badge: '종료', class: 'bg-gray-900 text-gray-400' }; break;
                    case 'cancelled': statusInfo = { badge: '취소', class: 'bg-red-100 text-red-700' }; break;
                }

                // Clean strings to prevent syntax errors (remove newlines, escape quotes)
                const safeTitle = (course.title || '제목 없음')
                    .replace(/\\n/g, ' ')
                    .replace(/'/g, "&#39;")
                    .replace(/"/g, "&quot;");
                    
                const safeCategory = (course.category || '일반')
                    .replace(/\\n/g, ' ')
                    .replace(/'/g, "&#39;")
                    .replace(/"/g, "&quot;");
                    
                const safeThumbnail = (course.thumbnail_url || '')
                    .replace(/\\n/g, '')
                    .replace(/'/g, "&#39;")
                    .replace(/"/g, "&quot;");

                const thumbnail = safeThumbnail 
                    ? '<img src="' + safeThumbnail + '" alt="' + safeTitle + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">'
                    : '<div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><i class="fas fa-cube text-5xl text-gray-300"></i></div>';
                
                const categoryBadge = '<span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg bg-white/90 backdrop-blur-md text-gray-900">' + safeCategory + '</span>';
                
                const statusBadge = '<div class="w-2 h-2 rounded-full ' + (course.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400') + '"></div>' +
                                    '<span class="text-[10px] font-black text-white uppercase tracking-widest">' + statusInfo.badge + '</span>';

                const titleSection = '<h3 class="text-xl font-black text-gray-900 tracking-tight line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">' + safeTitle + '</h3>';
                
                const studentsSection = maxStudents > 0
                    ? '<span class="text-xl font-black text-gray-900">' + enrolledCount + '</span><span class="text-[10px] font-bold text-gray-400">/ ' + maxStudents + '</span>'
                    : '<span class="text-xl font-black text-gray-900">' + enrolledCount + '</span><span class="text-[10px] font-bold text-gray-400">명</span>';
                                        
                const dateSection = '<span class="text-[11px] font-black text-gray-700">' + (course.start_date ? course.start_date.split('T')[0] : '미정') + '</span>';

                const courseIdSafe = JSON.stringify(course.id);
                const isHrd = course.is_hrd ? 'true' : 'false';

                return '<div class="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group">' +
                        '<div class="relative aspect-[16/10] overflow-hidden">' +
                            thumbnail +
                            '<div class="absolute top-6 left-6 flex gap-2">' + categoryBadge + '</div>' +
                            '<div class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">' +
                                '<div class="flex items-center gap-2">' + statusBadge + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="p-8 space-y-6">' +
                            '<div class="min-h-[64px]">' + titleSection + '</div>' +
                            '<div class="grid grid-cols-2 gap-4">' +
                                '<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">' +
                                    '<span class="block text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">수강생 현황</span>' +
                                    '<div class="flex items-baseline gap-1">' + studentsSection + '</div>' +
                                    '<div class="mt-2 w-full bg-gray-200 h-1 rounded-full overflow-hidden">' +
                                        '<div class="bg-blue-600 h-full rounded-full transition-all duration-1000" style="width: ' + progressPercent + '%"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">' +
                                    '<span class="block text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">강의 일정</span>' +
                                    '<div class="flex items-center gap-2 mt-1">' +
                                        '<i class="far fa-calendar-alt text-blue-500 text-xs"></i>' +
                                        dateSection +
                                    '</div>' +
                                    '<p class="text-[9px] font-bold text-gray-400 mt-1 uppercase">개강일</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="flex gap-3 pt-4 border-t border-gray-50">' +
                                '<button onclick=\\'viewCourseDetail(' + courseIdSafe + ',' + isHrd + ')\\' class="flex-1 px-4 py-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 group-hover:bg-blue-50">' +
                                     '<i class="fas fa-door-open text-xs"></i> 강의실 입장' +
                                '</button>' +
                                '<button onclick=\\'manageCourse(' + courseIdSafe + ',' + isHrd + ')\\' class="w-14 h-14 bg-gray-900 text-white rounded-2xl hover:bg-black flex items-center justify-center transition-all shadow-xl shadow-gray-200">' +
                                    '<i class="fas fa-cog"></i>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }).join('');
        }

        function renderPagination(pagination) {
            const container = document.getElementById('paginationContainer');
            if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) {
                container.innerHTML = '';
                return;
            }
            const totalPages = pagination.totalPages;
            const current = pagination.page != null ? pagination.page : (pagination.currentPage != null ? pagination.currentPage : currentPage);
            const radius = 2;
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - radius && i <= current + radius)) pages.push(i);
                else if (pages[pages.length - 1] !== '...') pages.push('...');
            }
            let html = '';
            html += '<button type="button" onclick="loadCourses(' + (current - 1) + ')" ' + (current <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (current <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
            pages.forEach(function(n) {
                if (n === '...') html += '<span class="px-2 py-2 text-gray-400">…</span>';
                else {
                    const active = n === current;
                    html += '<button type="button" onclick="loadCourses(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50') + '">' + n + '</button>';
                }
            });
            html += '<button type="button" onclick="loadCourses(' + (current + 1) + ')" ' + (current >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (current >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
            container.innerHTML = html;
        }

        function getLmsTab() {
            const params = new URLSearchParams(window.location.search);
            const tab = (params.get('tab') || '').toLowerCase();
            if (tab === 'students') return 'students';
            if (tab === 'attendance') return 'attendance';
            if (tab === 'exams') return 'cbt';
            if (tab === 'surveys') return 'surveys';
            return '';
        }

        function viewCourseDetail(courseId, isHrd) {
            const lmsTab = getLmsTab();
            let url = '/admin/courses/' + courseId + '/lms' + (lmsTab ? '/' + lmsTab : '');
            if (isHrd) url += (url.indexOf('?') >= 0 ? '&' : '?') + 'type=hrd';
            window.location.href = url;
        }

        function manageCourse(courseId, isHrd) {
            const lmsTab = getLmsTab();
            let url = '/admin/courses/' + courseId + '/lms' + (lmsTab ? '/' + lmsTab : '');
            if (isHrd) url += (url.indexOf('?') >= 0 ? '&' : '?') + 'type=hrd';
            window.location.href = url;
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
}

export const teacherCoursesHtml = (tab?: string) => teacherCoursesHtmlInner(tab);
