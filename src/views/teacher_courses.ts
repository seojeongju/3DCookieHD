import { teacherSidebar } from './components/teacher_sidebar';

function teacherCoursesHtmlInner(activeSubMenu?: string) {
    const tab = activeSubMenu && ['students', 'attendance', 'assignments', 'exams', 'grades', 'surveys', 'ncs', 'employment'].includes(activeSubMenu) ? activeSubMenu : undefined;
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>나의 강의 관리 - 강사 대시보드</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-inner-shadow { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        @keyframes subtle-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .float-animation { animation: subtle-float 4s ease-in-out infinite; }
        /* 나의 강의 관리: 모바일에서 상세 필터 접기 (검색만 상시 노출) */
        @media (max-width: 1023px) {
            #teacherCoursesFilterDock[data-collapsed-mobile="true"] #teacherCoursesFilterExtra {
                display: none !important;
            }
            #teacherCoursesFilterDock[data-collapsed-mobile="false"] #teacherCoursesFilterToggle .teacher-filter-chevron {
                transform: rotate(180deg);
            }
            .teacher-courses-header-action {
                min-width: 44px;
                min-height: 44px;
            }
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-neutral-900">
    <div class="flex h-screen overflow-hidden">
        ${teacherSidebar('courses', tab)}
        <div class="flex-1 flex flex-col overflow-hidden bg-[#f1f3f5]">
            <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 overflow-x-hidden">
                <div class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 max-w-[1600px] mx-auto w-full min-w-0 pr-[max(1rem,env(safe-area-inset-right,0px))]">
                    <!-- 모바일: 제목 블록과 네비 버튼 행 분리 → 우측 아이콘 잘림 방지 -->
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 min-w-0">
                        <div class="flex items-start gap-3 sm:gap-5 min-w-0 flex-1">
                            <div class="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-lg shadow-brand-200 group transition-transform hover:scale-105 duration-500 shrink-0">
                                <i class="fas fa-chalkboard-teacher text-lg sm:text-xl lg:text-2xl group-hover:rotate-12 transition-transform duration-500"></i>
                            </div>
                            <div class="min-w-0 flex-1 pt-0.5">
                                <h1 class="text-[1.05rem] sm:text-xl lg:text-2xl font-outfit font-extrabold text-neutral-900 tracking-tight leading-snug break-keep">나의 강의 관리</h1>
                                <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                    <span class="text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1 bg-brand-50 text-brand-600 font-black rounded-full uppercase tracking-widest border border-brand-100 shrink-0">PRO EDUCATOR</span>
                                    <span class="hidden sm:inline-flex text-[10px] font-bold text-emerald-600 uppercase tracking-widest items-center gap-1 shrink-0">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                                    </span>
                                </div>
                                <p class="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-[0.12em] sm:tracking-[0.2em] mt-1 leading-snug line-clamp-2 sm:line-clamp-none">Education Management & LMS Hub</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-end gap-2 sm:gap-3 shrink-0 sm:shrink-0 w-full sm:w-auto min-w-0 border-t border-neutral-100/80 pt-3 sm:border-t-0 sm:pt-0">
                            <div class="hidden md:flex flex-col items-end mr-1 min-w-0 max-w-[140px] lg:max-w-none">
                                <span class="text-xs lg:text-sm font-black text-neutral-800 truncate text-right w-full" id="userNameDisplay">강사님</span>
                                <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span> Online
                                </span>
                            </div>
                            <a href="/teacher" class="teacher-courses-header-action w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-md text-neutral-500 hover:text-brand-600 transition-all border border-neutral-100 group touch-manipulation shrink-0" title="종합 대시보드">
                                <i class="fas fa-home text-base sm:text-lg group-hover:scale-110 transition-transform"></i>
                            </a>
                            <a href="/teacher/profile" class="teacher-courses-header-action w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-neutral-100 border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-brand-500 transition-all shrink-0 touch-manipulation block" title="강사 프로필">
                                <img src="https://ui-avatars.com/api/?name=Teacher&background=4f69f2&color=fff" alt="프로필" class="w-full h-full object-cover pointer-events-none">
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div class="max-w-[1600px] mx-auto">
                    <!-- Dashboard Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div class="glass border border-white/50 rounded-4xl p-8 shadow-premium flex flex-col justify-between group hover:border-brand-200 transition-all duration-500 hover:shadow-premium-hover">
                            <div class="flex justify-between items-start mb-8">
                                <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <i class="fas fa-book-open text-lg"></i>
                                </div>
                                <span class="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-50/50 px-2 py-1 rounded-lg">Current</span>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">진행중인 강의</h3>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-5xl font-outfit font-black text-neutral-900" id="activeCoursesCount">0</span>
                                    <span class="text-sm font-bold text-neutral-400 tracking-tight">개 과정</span>
                                </div>
                            </div>
                        </div>
                        <div class="glass border border-white/50 rounded-4xl p-8 shadow-premium flex flex-col justify-between group hover:border-emerald-200 transition-all duration-500 hover:shadow-premium-hover">
                            <div class="flex justify-between items-start mb-8">
                                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <i class="fas fa-users text-lg"></i>
                                </div>
                                <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50/50 px-2 py-1 rounded-lg">Impact</span>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">총 관리 학생</h3>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-5xl font-outfit font-black text-neutral-900" id="totalStudentsCount">0</span>
                                    <span class="text-sm font-bold text-neutral-400 tracking-tight">명 등록</span>
                                </div>
                            </div>
                        </div>
                        <div class="glass border border-white/50 rounded-4xl p-8 shadow-premium flex flex-col justify-between group hover:border-amber-200 transition-all duration-500 hover:shadow-premium-hover">
                            <div class="flex justify-between items-start mb-8">
                                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <i class="fas fa-calendar-check text-lg"></i>
                                </div>
                                <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50/50 px-2 py-1 rounded-lg">Weekly</span>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">평균 출석률</h3>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-5xl font-outfit font-black text-neutral-900">96</span>
                                    <span class="text-sm font-bold text-neutral-400 tracking-tight">% 성실도</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-neutral-900 rounded-4xl p-8 shadow-2xl shadow-neutral-200 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-700 relative overflow-hidden">
                            <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-600/10 rounded-full blur-[80px] group-hover:bg-brand-600/20 transition-all duration-1000"></div>
                            <div class="flex justify-between items-start mb-8 relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center group-hover:bg-white group-hover:text-neutral-900 transition-all duration-500 shadow-sm">
                                    <i class="fas fa-medal text-lg"></i>
                                </div>
                                <span class="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] px-2 py-1">PREMIUM</span>
                            </div>
                            <div class="relative z-10">
                                <h3 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 leading-none">강사 종합 평가</h3>
                                <div class="flex items-center gap-4">
                                    <span class="text-5xl font-outfit font-black text-white leading-none">S+</span>
                                    <div class="flex flex-col gap-1">
                                        <div class="flex gap-0.5">
                                            <i class="fas fa-star text-[10px] text-yellow-400"></i>
                                            <i class="fas fa-star text-[10px] text-yellow-400"></i>
                                            <i class="fas fa-star text-[10px] text-yellow-400"></i>
                                            <i class="fas fa-star text-[10px] text-yellow-400"></i>
                                            <i class="fas fa-star text-[10px] text-yellow-400"></i>
                                        </div>
                                        <span class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Master Educator</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- tab 안내 배너 -->
                    <div id="tabHintBanner" class="hidden mb-12 overflow-hidden relative group">
                        <div class="absolute inset-0 bg-brand-600 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                        <div class="px-8 py-6 border border-brand-100 rounded-4xl flex items-center gap-6 relative z-10">
                            <div class="w-14 h-14 rounded-3xl bg-brand-100/50 text-brand-600 flex items-center justify-center animate-bounce shadow-inner">
                                <i class="fas fa-map-marker-alt text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-outfit font-black text-neutral-900 tracking-tight" id="tabHintTitle">LMS 다이렉트 접근 활성화</h4>
                                <p class="text-sm font-medium text-neutral-500 mt-0.5" id="tabHintText">상세 관리 메뉴가 감지되었습니다. 과정을 선택하면 바로 관리 화면으로 이동합니다.</p>
                            </div>
                            <button onclick="this.closest('#tabHintBanner').classList.add('hidden')" class="w-10 h-10 rounded-2xl hover:bg-neutral-100 flex items-center justify-center text-neutral-300 hover:text-neutral-500 transition-all">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Filter Dock: 모바일은 검색·요약만 고정 높이, 상세 필터는 접기 -->
                    <div id="teacherCoursesFilterDock" data-collapsed-mobile="true" class="glass border border-white/60 rounded-2xl lg:rounded-[3rem] p-3 sm:p-4 lg:p-4 mb-8 lg:mb-12 shadow-premium relative lg:sticky lg:top-24 z-20 transition-all duration-500 border-white/80 hover:shadow-premium-hover grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_auto] lg:items-center gap-3 lg:gap-4">
                        <!-- 검색 (항상 노출 · 단일 입력) -->
                        <div class="relative group min-w-0 lg:col-start-3 lg:row-start-1">
                            <i class="fas fa-search absolute left-4 lg:left-7 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-500 transition-colors text-sm lg:text-base pointer-events-none"></i>
                            <input type="text" id="searchInput" placeholder="나의 강의 제목으로 검색해보세요"
                                   class="w-full min-h-[44px] pl-11 lg:pl-16 pr-4 py-2.5 lg:py-4 bg-neutral-50/50 border border-neutral-100 rounded-xl lg:rounded-[1.5rem] focus:bg-white focus:ring-4 lg:focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all font-bold text-neutral-900 text-sm touch-manipulation"
                                   onkeyup="if(event.key==='Enter') loadCourses()">
                        </div>

                        <!-- 모바일: 요약 + 상세 필터 토글 + 새로고침 -->
                        <div class="flex lg:hidden items-center gap-2 min-h-[44px]">
                            <button type="button" id="teacherCoursesFilterToggle" aria-expanded="false" aria-controls="teacherCoursesFilterExtra" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100/90 border border-neutral-200 text-[11px] font-black text-neutral-800 active:scale-[0.98] touch-manipulation shrink-0">
                                <i class="fas fa-sliders-h text-brand-600"></i>
                                <span data-toggle-label>상세 필터</span>
                                <i class="fas fa-chevron-down teacher-filter-chevron text-[10px] text-neutral-400 transition-transform duration-200"></i>
                            </button>
                            <span class="js-teacher-courses-search-result flex-1 text-center text-[10px] font-black text-neutral-500 uppercase tracking-wide truncate px-1">Searching...</span>
                            <button type="button" onclick="loadCourses()" aria-label="목록 새로고침" class="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 bg-brand-600 text-white rounded-xl hover:bg-neutral-900 transition-colors flex items-center justify-center shadow-lg touch-manipulation active:scale-95">
                                <i class="fas fa-sync-alt text-sm"></i>
                            </button>
                        </div>

                        <div id="teacherCoursesFilterExtra" class="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 lg:contents lg:gap-0">
                            <div class="relative group w-full sm:flex-1 min-w-0 lg:col-start-1 lg:row-start-1 lg:min-w-[140px] lg:max-w-[240px]">
                                <select id="categoryFilter" onchange="loadCourses()" class="w-full min-h-[44px] pl-4 sm:pl-6 pr-10 py-2.5 lg:py-4 bg-neutral-50/50 border border-neutral-100 rounded-xl lg:rounded-[1.5rem] focus:bg-white focus:ring-4 lg:focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all font-black text-neutral-800 text-xs appearance-none cursor-pointer touch-manipulation">
                                    <option value="">전체 카테고리</option>
                                    <option value="국비지원">국비지원</option>
                                    <option value="자격증">자격증</option>
                                    <option value="취업연계">취업연계</option>
                                    <option value="기타">기타</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none text-[8px] group-hover:text-brand-500 transition-colors"></i>
                            </div>
                            <div class="relative group w-full sm:flex-1 min-w-0 lg:col-start-2 lg:row-start-1 lg:min-w-[140px] lg:max-w-[240px]">
                                <select id="statusFilter" onchange="loadCourses()" class="w-full min-h-[44px] pl-4 sm:pl-6 pr-10 py-2.5 lg:py-4 bg-neutral-50/50 border border-neutral-100 rounded-xl lg:rounded-[1.5rem] focus:bg-white focus:ring-4 lg:focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all font-black text-neutral-800 text-xs appearance-none cursor-pointer touch-manipulation">
                                    <option value="">전체 운영상태</option>
                                    <option value="active">강의중 (Active)</option>
                                    <option value="recruiting">모집중 (Recruiting)</option>
                                    <option value="completed">종료 (Closed)</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none text-[8px] group-hover:text-brand-500 transition-colors"></i>
                            </div>
                            <div class="flex flex-wrap items-center justify-between gap-3 sm:justify-end lg:flex-nowrap w-full sm:flex-1 lg:w-auto lg:col-start-4 lg:row-start-1 lg:justify-end border-t border-neutral-100/90 lg:border-t-0 pt-3 sm:pt-3 lg:pt-0 mt-1 lg:mt-0 lg:pl-6 lg:border-l lg:border-neutral-100">
                                <div class="flex flex-col items-start sm:items-end gap-1">
                                    <span class="js-teacher-courses-search-result hidden lg:block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right w-full">Searching...</span>
                                    <div class="flex items-center gap-2 flex-wrap justify-end">
                                        <span class="text-[10px] font-bold text-neutral-400 uppercase">Per Page:</span>
                                        <select id="rowsPerPageTeacherCourses" onchange="setRowsPerPageTeacherCourses(parseInt(this.value,10))" class="bg-transparent font-black text-xs text-brand-600 outline-none cursor-pointer hover:underline min-h-[40px] touch-manipulation">
                                            <option value="12">12</option>
                                            <option value="24">24</option>
                                            <option value="48">48</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="button" onclick="loadCourses()" aria-label="목록 새로고침" class="hidden lg:flex w-14 h-14 bg-brand-600 text-white rounded-3xl hover:bg-neutral-900 transition-all duration-500 items-center justify-center shadow-2xl shadow-brand-200 hover:shadow-neutral-200 group overflow-hidden relative shrink-0 touch-manipulation">
                                    <i class="fas fa-sync-alt text-lg group-hover:rotate-180 transition-transform duration-700 relative z-10"></i>
                                    <div class="absolute inset-0 bg-gradient-to-tr from-brand-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 과정 목록 Grid -->
                    <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mb-20 min-h-[400px]">
                        <div class="col-span-full flex flex-col items-center justify-center py-40">
                            <div class="relative w-20 h-20 mb-10">
                                <div class="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
                                <div class="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p class="font-outfit font-black text-neutral-900 text-2xl tracking-tight">강의 데이터를 최적화하고 있습니다</p>
                            <p class="text-neutral-400 text-base mt-2 font-medium">실시간 학사 정보를 동기화하는 중입니다.</p>
                        </div>
                    </div>

                    <!-- 페이지네이션 -->
                    <div class="flex flex-col items-center justify-center py-16 border-t border-neutral-100/60">
                        <div id="paginationRangeTeacherCourses" class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.5em] mb-10 opacity-50"></div>
                        <nav id="paginationContainer" class="flex flex-wrap items-center justify-center gap-3"></nav>
                    </div>
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

        function setTeacherCoursesSearchResultText(text) {
            document.querySelectorAll('.js-teacher-courses-search-result').forEach(function(el) {
                el.textContent = text;
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            // 즉시 사용자 정보 로드
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.name) {
                const nameEl = document.getElementById('userNameDisplay');
                if (nameEl) nameEl.textContent = user.name + ' 강사님';
            }

            var dock = document.getElementById('teacherCoursesFilterDock');
            var filterToggle = document.getElementById('teacherCoursesFilterToggle');
            if (dock && filterToggle) {
                filterToggle.addEventListener('click', function() {
                    var collapsed = dock.getAttribute('data-collapsed-mobile') !== 'false';
                    dock.setAttribute('data-collapsed-mobile', collapsed ? 'false' : 'true');
                    filterToggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
                    var lab = filterToggle.querySelector('[data-toggle-label]');
                    if (lab) lab.textContent = collapsed ? '필터 접기' : '상세 필터';
                });
            }

            checkLogin();
            showTabHintIfNeeded();
            loadCourses();
        });

        function showTabHintIfNeeded() {
            const lmsTab = getLmsTab();
            const banner = document.getElementById('tabHintBanner');
            const titleEl = document.getElementById('tabHintTitle');
            const textEl = document.getElementById('tabHintText');
            if (!banner || !textEl) return;
            const labels = { students: '수강생 관리', attendance: '출석 관리', cbt: '평가 및 채점', surveys: '설문 및 역량진단' };
            if (lmsTab && labels[lmsTab]) {
                banner.classList.remove('hidden');
                titleEl.textContent = '「' + labels[lmsTab] + '」 직접 연결됨';
                textEl.textContent = '현재 ' + labels[lmsTab] + ' 모드가 활성화되었습니다. 과정을 클릭하면 해당 관리 페이지로 즉시 이동합니다.';
            }
        }

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
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
                    
                    setTeacherCoursesSearchResultText(total + ' COURSES FOUND');
                    
                    const activeCountEl = document.getElementById('activeCoursesCount');
                    const totalStudentsEl = document.getElementById('totalStudentsCount');
                    
                    if (activeCountEl) {
                        const activeCount = (result.data || []).filter(c => c.status === 'active' || c.status === 'open').length;
                        activeCountEl.textContent = activeCount;
                    }
                    if (totalStudentsEl) {
                        const totalStudents = (result.data || []).reduce((acc, c) => acc + (c.current_students || 0), 0);
                        totalStudentsEl.textContent = totalStudents;
                    }

                    if (p.limit) {
                        limit = p.limit;
                        const sel = document.getElementById('rowsPerPageTeacherCourses');
                        if (sel) sel.value = String(p.limit);
                    }
                    
                    const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || limit) + 1;
                    const end = Math.min(pageNum * (p.limit || limit), total);
                    document.getElementById('paginationRangeTeacherCourses').textContent = total > 0 ? start + ' - ' + end + ' OF ' + total + ' TOTAL COURSES' : '';
                    
                    renderCourses(result.data || []);
                    renderPagination(p);
                } else {
                    renderError('Data Fetch Failed');
                }
            } catch (error) {
                renderError('Connection Refused');
            }
        }

        function renderError(msg) {
            document.getElementById('coursesContainer').innerHTML = 
                '<div class="col-span-full flex flex-col items-center justify-center py-40 glass rounded-5xl border-rose-100 shadow-2xl">' +
                '<div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6"><i class="fas fa-exclamation-triangle text-2xl"></i></div>' +
                '<h3 class="text-2xl font-black text-neutral-900">' + msg + '</h3>' +
                '<p class="text-neutral-400 mt-2 font-medium">관리자에게 문의하거나 잠시 후 다시 시도해주세요.</p></div>';
        }

        function renderCourses(courses) {
            const container = document.getElementById('coursesContainer');
            if (!courses || courses.length === 0) {
                container.innerHTML = 
                    '<div class="col-span-full text-center py-40 glass rounded-5xl border-white/50 flex flex-col items-center">' +
                        '<div class="w-24 h-24 rounded-[2.5rem] bg-neutral-50 flex items-center justify-center text-neutral-200 mb-8 float-animation shadow-inner">' +
                            '<i class="fas fa-chalkboard-teacher text-5xl"></i>' +
                        '</div>' +
                        '<h3 class="text-3xl font-outfit font-black text-neutral-900 mb-3 tracking-tight">배정된 강의가 없습니다</h3>' +
                        '<p class="text-neutral-400 font-medium max-w-sm mx-auto">현재 배정된 강의가 없거나 필터 조건에 맞는 강의를 찾을 수 없습니다.</p>' +
                    '</div>';
                return;
            }

            container.innerHTML = courses.map(course => {
                const enrolledCount = course.current_students || 0;
                const maxStudents = course.max_students || 0;
                const progressPercent = maxStudents > 0 ? Math.round((enrolledCount / maxStudents) * 100) : (enrolledCount > 0 ? 100 : 0);
                
                let s = { label: 'PREPARING', class: 'bg-neutral-800 text-neutral-400', p: false };
                if (course.status === 'active' || course.status === 'open') s = { label: 'RUNNING', class: 'bg-emerald-600 shadow-emerald-100', p: true };
                else if (course.status === 'upcoming' || course.status === 'recruiting') s = { label: 'RECRUITING', class: 'bg-brand-600 shadow-brand-100', p: false };
                else if (course.status === 'completed' || course.status === 'closed') s = { label: 'FINISHED', class: 'bg-neutral-200 text-neutral-600', p: false };

                const safeTitle = (course.title || 'Untitled').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                const safeCat = (course.category || 'General').replace(/'/g, "&#39;");

                const thumb = course.thumbnail_url 
                    ? '<img src="' + course.thumbnail_url + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">'
                    : '<div class="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"><i class="fas fa-layer-group text-5xl text-neutral-300"></i></div>';

                return '<div class="group bg-white rounded-5xl border border-neutral-100 hover:shadow-premium-hover transition-all duration-700 flex flex-col">' +
                        '<div class="relative aspect-[16/11] overflow-hidden rounded-t-[3rem]">' +
                            thumb +
                            '<div class="absolute top-6 left-6 z-10"><span class="px-4 py-2 rounded-2xl glass border border-white/40 text-[10px] font-black text-neutral-900 tracking-widest shadow-xl uppercase">' + safeCat + '</span></div>' +
                            '<div class="absolute top-6 right-6 z-10">' +
                                '<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full ' + s.class + ' shadow-xl text-white">' +
                                (s.p ? '<div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>' : '') +
                                '<span class="text-[9px] font-black uppercase tracking-widest leading-none">' + s.label + '</span></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="p-8 lg:p-10 flex-1 flex flex-col">' +
                            '<h3 class="text-xl font-outfit font-black text-neutral-900 tracking-tight line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors duration-300 mb-8 h-14">' + safeTitle + '</h3>' +
                            '<div class="mt-auto">' +
                                '<div class="flex justify-between items-end mb-6 font-outfit">' +
                                    '<div class="flex flex-col"><span class="text-2xl font-black text-neutral-900">' + enrolledCount + '<span class="text-xs text-neutral-400 ml-1">/ ' + (maxStudents || '∞') + '</span></span><span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Enrolled</span></div>' +
                                    '<div class="flex flex-col items-end"><span class="text-sm font-black text-neutral-800">' + (course.start_date || 'TBD').split('T')[0] + '</span><span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Start Date</span></div>' +
                                '</div>' +
                                '<div class="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden mb-8 card-inner-shadow"><div class="bg-gradient-to-r from-brand-400 to-brand-700 h-full transition-all duration-1000 ease-out" style="width:' + progressPercent + '%"></div></div>' +
                                '<div class="flex gap-4">' +
                                    '<button onclick=\\'viewCourseDetail("' + course.id + '",' + (course.is_hrd ? "true" : "false") + ')\\' class="flex-1 px-8 py-5 bg-neutral-900 text-white rounded-3xl hover:bg-brand-600 transition-all duration-500 font-black text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 group-hover:shadow-2xl group-hover:shadow-brand-200"><i class="fas fa-door-open"></i> 강의실 입장</button>' +
                                    '<button onclick=\\'manageCourse("' + course.id + '",' + (course.is_hrd ? "true" : "false") + ')\\' class="w-16 h-16 bg-neutral-50 text-neutral-800 rounded-3xl hover:bg-white hover:shadow-xl hover:text-brand-600 transition-all border border-neutral-100 flex items-center justify-center"><i class="fas fa-cog text-xl"></i></button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }).join('');
        }

        function renderPagination(pg) {
            const container = document.getElementById('paginationContainer');
            if (!pg || !pg.totalPages || pg.totalPages <= 1) { container.innerHTML = ''; return; }
            const current = pg.page || 1;
            const total = pg.totalPages;
            let html = '<button onclick="loadCourses(' + (current-1) + ')" ' + (current<=1?'disabled':'') + ' class="px-6 py-4 rounded-2xl border border-neutral-100 font-black text-[10px] tracking-widest uppercase transition-all ' + (current<=1?'opacity-30 cursor-not-allowed bg-neutral-50':'bg-white hover:bg-neutral-50 hover:shadow-lg') + '">Prev</button>';
            for (let i=1; i<=total; i++) {
                if (i===1 || i===total || (i>=current-2 && i<=current+2)) {
                    html += '<button onclick="loadCourses(' + i + ')" class="w-12 h-12 rounded-2xl font-black text-xs transition-all ' + (i===current?'bg-brand-600 text-white shadow-xl shadow-brand-100':'bg-white border border-neutral-100 text-neutral-400 hover:bg-neutral-50') + '">' + i + '</button>';
                } else if (i===2 || i===total-1) { html += '<span class="px-2 text-neutral-300">...</span>'; }
            }
            html += '<button onclick="loadCourses(' + (current+1) + ')" ' + (current>=total?'disabled':'') + ' class="px-6 py-4 rounded-2xl border border-neutral-100 font-black text-[10px] tracking-widest uppercase transition-all ' + (current>=total?'opacity-30 cursor-not-allowed bg-neutral-50':'bg-white hover:bg-neutral-50 hover:shadow-lg') + '">Next</button>';
            container.innerHTML = html;
        }

        function getLmsTab() {
            const p = new URLSearchParams(window.location.search);
            const t = (p.get('tab') || '').toLowerCase();
            return ['students', 'attendance', 'exams', 'surveys'].includes(t) ? (t === 'exams' ? 'cbt' : t) : '';
        }

        function viewCourseDetail(cid, isHrd) {
            let url = '/teacher/courses/' + cid + '/lms' + (getLmsTab() ? '/' + getLmsTab() : '');
            if (isHrd) url += (url.includes('?') ? '&' : '?') + 'type=hrd';
            window.location.href = url;
        }
        function manageCourse(cid, isHrd) { viewCourseDetail(cid, isHrd); }
    </script>
</body>
</html>
`;
}

export const teacherCoursesHtml = (tab?: string) => teacherCoursesHtmlInner(tab);
