import { teacherSidebar } from './components/teacher_sidebar';

export const teacherStudentsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 성과 분석 - 3D Cookie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
            },
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              },
              industry: {
                dark: '#0f172a',
                glass: 'rgba(255, 255, 255, 0.03)',
                border: 'rgba(255, 255, 255, 0.1)',
              }
            }
          }
        }
      }
    </script>
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .glass-header { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('students')}

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <!-- 상단 헤더 -->
            <header class="glass-header sticky top-0 z-20 px-8 py-6 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        수강생 성과 분석
                        <span class="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">분석</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">수강생 데이터 리포지토리 및 성과 지능</p>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="location.href='/teacher'" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm">
                        <i class="fas fa-arrow-left"></i> 대시보드
                    </button>
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right flex flex-col uppercase tracking-tighter">
                            <span id="header-user-name" class="text-xs font-black text-slate-900">강사명</span>
                            <span class="text-[9px] font-black text-slate-400">분석 모드</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1400px] mx-auto space-y-8">
                    
                    <!-- 1. 과정 선택 섹션 -->
                    <div id="coursesSection" class="animate-fade-in" style="animation-delay: 0.1s">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                <i class="fas fa-layer-group text-sm"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-black text-slate-800 tracking-tight">분석 대상 과정 선택</h2>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">수강생 정보를 불러올 과정을 선택하세요</p>
                            </div>
                        </div>

                        <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- JS Load -->
                            <div class="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <i class="fas fa-circle-notch fa-spin text-3xl text-blue-500 mb-4"></i>
                                <p class="text-slate-400 font-black text-sm uppercase tracking-widest">과정 데이터를 불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 수강생 상세 분석 섹션 (Hidden by Default) -->
                    <div id="studentsSection" class="hidden animate-fade-in">
                        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
                            <div class="flex items-center gap-6">
                                <button onclick="backToCourses()" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-inner">
                                    <i class="fas fa-chevron-left text-sm"></i>
                                </button>
                                <div>
                                    <h2 class="text-2xl font-black text-slate-900 tracking-tight" id="selectedCourseTitle">과정 성과 분석</h2>
                                    <div class="flex items-center gap-3 mt-1">
                                        <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100/50">실시간 현황</span>
                                        <span id="studentCountLabel" class="text-xs font-bold text-slate-400">0명 수강생 조회됨</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <div class="relative flex-1 md:flex-none md:w-64">
                                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                                    <input type="text" id="studentSearch" placeholder="이름 또는 ID 검색..." 
                                           class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-sm font-medium tracking-tight"
                                           onkeyup="if(event.key==='Enter') loadStudents(1)">
                                </div>
                                <button type="button" onclick="loadStudents(1)" class="px-6 py-4 bg-indigo-600 text-white font-black text-[10px] rounded-2xl hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100">
                                    조회
                                </button>
                                <button type="button" onclick="loadStudents(1)" class="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition" title="새로고침"><i class="fas fa-sync-alt"></i></button>
                                <span id="searchResultTextTeacherStudents" class="text-sm text-slate-500"></span>
                                <label class="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span>페이지당</span>
                                    <select id="rowsPerPageTeacherStudents" onchange="setRowsPerPageTeacherStudents(parseInt(this.value,10))" class="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500">
                                        <option value="10">10</option>
                                        <option value="20" selected>20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                    <span>건</span>
                                </label>
                            </div>
                        </div>

                        <!-- 수강생 데이터 그리드 -->
                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/50 border-b border-slate-100">
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">수강생 정보</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">연락처</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">상태</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">등록일</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="studentsTableBody" class="divide-y divide-slate-50">
                                    <!-- JS Load -->
                                </tbody>
                            </table>
                        </div>

                        <!-- 풋터 & 페이지네이션 -->
                        <div class="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-8">
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">시스템 데이터 표시</p>
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full sm:w-auto">
                                <div id="paginationRangeTeacherStudents" class="text-sm text-slate-600"></div>
                                <nav id="paginationContainer" class="flex flex-wrap items-center justify-center gap-1"></nav>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let allCourses = [];
        let allStudents = [];
        let selectedCourseId = null;
        let currentPage = 1;
        let limit = 20;

        function setRowsPerPageTeacherStudents(n) {
            limit = n;
            document.getElementById('rowsPerPageTeacherStudents').value = String(n);
            loadStudents(1);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('header-user-name').textContent = user.name;
            }
            loadCourses();
        });

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
                    document.getElementById('coursesContainer').innerHTML = 
                        '<div class="col-span-full py-20 text-center text-red-500 font-black uppercase text-xs">학사 데이터를 동기화하지 못했습니다.</div>';
                }
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        }

        function renderCourses() {
            const container = document.getElementById('coursesContainer');
            if (allCourses.length === 0) {
                container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs">활성화된 학사 컨테이너가 없습니다</div>';
                return;
            }

            container.innerHTML = allCourses.map(course => 
                '<div onclick="selectCourse(' + course.id + ', \\'' + ((course.title || '').replace(/'/g, "\\\\'")) + '\\')" ' +
                     'class="bento-card bg-white rounded-[2rem] p-8 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-indigo-600/30">' +
                    '<div class="flex justify-between items-start mb-6">' +
                        '<div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-indigo-100">' +
                            '<i class="fas fa-terminal text-lg font-black underline"></i>' +
                        '</div>' +
                        '<span class="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-100 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-400 transition-all">Active</span>' +
                    '</div>' +
                    '<div>' +
                        '<span class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 underline decoration-2 underline-offset-4">Cluster ID: #' + course.id + '</span>' +
                        '<h3 class="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">' + course.title + '</h3>' +
                        '<p class="text-[11px] font-medium text-slate-400 line-clamp-2 mb-6 uppercase tracking-tight leading-relaxed">System parameters and core intelligence for this academic module.</p>' +
                        
                        '<div class="flex items-center justify-between pt-6 border-t border-slate-50">' +
                            '<div class="flex items-center gap-4">' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes</span>' +
                                    '<span class="text-sm font-black text-slate-700">' + (course.current_students || 0) + '</span>' +
                                '</div>' +
                                '<div class="w-px h-6 bg-slate-100"></div>' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</span>' +
                                    '<span class="text-sm font-black text-slate-700 font-mono text-[10px] uppercase">' + (course.campus_name || 'Global') + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">' +
                                '<i class="fas fa-chevron-right text-[10px]"></i>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            ).join('');
        }

        async function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('studentsSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').textContent = courseTitle;
            await loadStudents(1);
        }

        function backToCourses() {
            selectedCourseId = null;
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('studentsSection').classList.add('hidden');
        }

        async function loadStudents(page = 1) {
            if (!selectedCourseId) return;
            try {
                currentPage = page;
                document.getElementById('searchResultTextTeacherStudents').textContent = '';
                document.getElementById('paginationRangeTeacherStudents').textContent = '';
                const token = localStorage.getItem('token');
                const response = await fetch('/api/enrollments?course_id=' + selectedCourseId + '&status=approved&page=' + page + '&limit=' + limit, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    allStudents = result.data || [];
                    const p = result.pagination || {};
                    const total = p.total != null ? p.total : allStudents.length;
                    const totalPages = p.totalPages != null ? p.totalPages : 1;
                    const pageNum = p.page != null ? p.page : page;
                    if (p.limit) {
                        limit = p.limit;
                        const sel = document.getElementById('rowsPerPageTeacherStudents');
                        if (sel) sel.value = String(p.limit);
                    }
                    document.getElementById('searchResultTextTeacherStudents').textContent = '검색결과 ' + total + '건';
                    document.getElementById('studentCountLabel').textContent = total + '명 수강생 조회됨';
                    const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || limit) + 1;
                    const end = Math.min(pageNum * (p.limit || limit), total);
                    document.getElementById('paginationRangeTeacherStudents').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';
                    renderStudents();
                    renderPagination(totalPages, pageNum);
                }
            } catch (error) { console.error(error); }
        }

        function renderStudents() {
            const tbody = document.getElementById('studentsTableBody');
            const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
            let filtered = allStudents;
            if (searchTerm) {
                filtered = allStudents.filter(s => 
                    (s.user_name && s.user_name.toLowerCase().includes(searchTerm)) ||
                    (s.user_email && s.user_email.toLowerCase().includes(searchTerm))
                );
            }

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">조회된 수강생이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = filtered.map(student => 
                '<tr class="group hover:bg-slate-50/80 transition-all duration-300">' +
                    '<td class="px-8 py-6">' +
                        '<div class="flex items-center gap-4">' +
                            '<div class="relative">' +
                                '<div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200 border border-white/20">' +
                                    (student.user_name || 'S')[0] +
                                '</div>' +
                                '<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>' +
                            '</div>' +
                            '<div class="flex flex-col">' +
                                '<span class="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">' + (student.user_name || 'Unknown') + '</span>' +
                                '<span class="text-[10px] font-bold text-slate-400 tracking-tight">' + (student.user_email || 'No email registered') + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td class="px-6 py-6 font-mono text-xs font-bold text-slate-500 tracking-tighter">' +
                        (student.user_phone || '-') +
                    '</td>' +
                    '<td class="px-6 py-6 text-center">' +
                        '<span class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">수강중</span>' +
                    '</td>' +
                    '<td class="px-6 py-6 text-xs font-bold text-slate-400 tracking-widest uppercase">' +
                        (student.enrolled_at ? student.enrolled_at.split('T')[0] : '-') +
                    '</td>' +
                    '<td class="px-8 py-6 text-right">' +
                        '<div class="flex justify-end gap-2">' +
                            '<button onclick=\\'viewStudentDetail(' + JSON.stringify(student.user_id) + ')\\' class="px-4 py-2 bg-white border border-slate-200 text-[9px] font-black rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all uppercase tracking-widest shadow-sm">분석</button>' +
                            '<button class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">' +
                                '<i class="fas fa-ellipsis-h text-xs"></i>' +
                            '</button>' +
                        '</div>' +
                    '</td>' +
                '</tr>'
            ).join('');
        }

        function filterStudents() { renderStudents(); }

        function renderPagination(totalPages, pageNum) {
            const container = document.getElementById('paginationContainer');
            if (!totalPages || totalPages <= 1) { container.innerHTML = ''; return; }
            const current = pageNum != null ? pageNum : currentPage;
            const radius = 2;
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - radius && i <= current + radius)) pages.push(i);
                else if (pages[pages.length - 1] !== '...') pages.push('...');
            }
            let html = '';
            html += '<button type="button" onclick="loadStudents(' + (current - 1) + ')" ' + (current <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium ' + (current <= 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
            pages.forEach(function(n) {
                if (n === '...') html += '<span class="px-2 py-2 text-slate-400">…</span>';
                else {
                    const active = n === current;
                    html += '<button type="button" onclick="loadStudents(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50') + '">' + n + '</button>';
                }
            });
            html += '<button type="button" onclick="loadStudents(' + (current + 1) + ')" ' + (current >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium ' + (current >= totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
            container.innerHTML = html;
        }

        function viewStudentDetail(id) { alert('수강생 #' + id + ' 의 분석 리포트를 생성 중입니다.'); }
    </script>
</body>
</html>
`;
