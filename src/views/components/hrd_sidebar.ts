export type HrdSidebarOptions = { alwaysVisible?: boolean };

export const hrdSidebar = (activeMenu: string, options?: HrdSidebarOptions) => {
    const alwaysVisible = options?.alwaysVisible === true;
    const backdropClass = alwaysVisible ? 'hidden' : 'fixed inset-0 bg-black/50 z-30 lg:hidden hidden transition-opacity';
    const toggleClass = alwaysVisible ? 'hidden' : 'lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-lg hover:bg-slate-800 transition';
    const wrapClass = alwaysVisible
        ? 'relative inset-y-0 left-0 z-40 flex-shrink-0 w-64 min-w-64'
        : 'fixed lg:relative inset-y-0 left-0 z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out flex-shrink-0 w-64 lg:min-w-64';
    return `
<!-- 모바일: 사이드바 백드롭 -->
<div id="adminSidebarBackdrop" class="${backdropClass}" aria-hidden="true"></div>
<!-- 모바일: 사이드바 열기 버튼 -->
<button type="button" id="adminSidebarToggle" aria-label="메뉴 열기" class="${toggleClass}">
  <i class="fas fa-bars"></i>
</button>
<!-- 사이드바 래퍼 -->
<div id="adminSidebarWrap" class="${wrapClass}">
<aside class="w-64 h-full bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl border-r border-slate-800">
    <!-- 로고 영역 -->
    <div class="h-20 flex items-center px-6 bg-[#0f172a] relative overflow-hidden shrink-0">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div class="flex items-center z-10">
            <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
                <i class="fas fa-university text-white text-lg"></i>
            </div>
            <div>
                <span id="sidebar-logo-brand" class="font-bold text-white text-base tracking-tight leading-tight block">WOW3D</span>
                <span id="sidebar-logo-sub" class="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">홍대센터 ADMIN</span>
            </div>
        </div>
    </div>

    <!-- 운영 과정 퀵 선택기 (Quick Selector) -->
    <div class="px-3 pb-4 border-b border-slate-800/50 shrink-0">
        <div class="px-3 mb-2">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70">운영 과정 바로가기</span>
        </div>
        <div class="relative group/selector">
            <select id="sidebarActiveCourseSelector" onchange="(function(v){ if(!v) return; var base = window.location.pathname.startsWith('/teacher') ? '/teacher' : '/admin'; location.href = base+'/courses/'+v+'/lms?type=hrd'; })(this.value)" class="w-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition cursor-pointer hover:bg-slate-800">
                <option value="">진행 중인 과정 선택</option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <!-- 대시보드 -->
        <div class="px-3 mb-2 mt-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">메인</span>
        </div>
        <a href="/admin" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'dashboard' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative overflow-hidden">
            ${activeMenu === 'dashboard' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chart-pie w-6 text-lg ${activeMenu === 'dashboard' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-semibold text-[14px]">대시보드</span>
        </a>
        <a href="/admin/schedule" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'schedule' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'schedule' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-calendar-day w-6 text-lg ${activeMenu === 'schedule' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">통합 일정 관리</span>
        </a>

        <!-- 교육·과정 (LMS) -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">교육·과정</span>
        </div>
        <div class="space-y-1">
        <a href="/admin/courses" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${(activeMenu === 'courses' || activeMenu === 'courses-register') ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
                ${(activeMenu === 'courses' || activeMenu === 'courses-register') ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
                <i class="fas fa-graduation-cap w-6 text-lg ${(activeMenu === 'courses' || activeMenu === 'courses-register') ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
                <span class="font-medium text-[14px]">교육운영 관리</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/register" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-register' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-plus-circle w-6 text-sm ${activeMenu === 'courses-register' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">일반과정등록</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/categories" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-categories' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-tags w-6 text-sm ${activeMenu === 'courses-categories' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">과정분류관리</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/approved" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-approved' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-check-double w-6 text-sm ${activeMenu === 'courses-approved' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">승인받은 과정</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/sessions" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-sessions' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-calendar-plus w-6 text-sm ${activeMenu === 'courses-sessions' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">회차별 과정개설</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/sessions/enrollments" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-session-enrollments' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-user-plus w-6 text-sm ${activeMenu === 'courses-session-enrollments' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">수강생 등록</span>
            </a>
            <a data-role="admin-only" href="/admin/courses/copy" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'courses-copy' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-copy w-6 text-sm ${activeMenu === 'courses-copy' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">회차별 과정복사</span>
            </a>
        </div>

        <a href="/admin/students" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'students' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'students' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-user-graduate w-6 text-lg ${activeMenu === 'students' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">훈련생 관리</span>
        </a>

        <a href="/admin/attendance" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'attendance' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'attendance' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-clock w-6 text-lg ${activeMenu === 'attendance' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">출석 관리</span>
        </a>

        <a href="/admin/training-logs" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'training-logs' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'training-logs' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-pen-nib w-6 text-lg ${activeMenu === 'training-logs' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">훈련 일지</span>
        </a>

        <a href="/admin/assignments" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'assignments' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'assignments' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-tasks w-6 text-lg ${activeMenu === 'assignments' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">과제 관리</span>
        </a>

        <a href="/admin/counseling" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'counseling' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'counseling' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-comment-medical w-6 text-lg ${activeMenu === 'counseling' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">상담 일지</span>
        </a>

        <a href="/admin/exams" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'exams' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'exams' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-file-signature w-6 text-lg ${activeMenu === 'exams' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">시험/문제 관리</span>
        </a>

        <a href="/admin/grades" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'grades' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'grades' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chart-line w-6 text-lg ${activeMenu === 'grades' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">성적/채점 관리</span>
        </a>

        <a href="/admin/surveys" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'surveys' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'surveys' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-poll w-6 text-lg ${activeMenu === 'surveys' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">설문 관리</span>
        </a>

        <!-- NCS -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">NCS</span>
        </div>
        <a href="/admin/ncs-eval" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'ncs-eval' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'ncs-eval' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-certificate w-6 text-lg ${activeMenu === 'ncs-eval' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">NCS 평가 관리</span>
        </a>
        <a href="/admin/ncs/viewer" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'ncs-viewer' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'ncs-viewer' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-sitemap w-6 text-lg ${activeMenu === 'ncs-viewer' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">NCS 분류보기</span>
        </a>

        <!-- 인력·시설 (관리자 전용) -->
        <div data-role="admin-only" class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">인력·시설</span>
        </div>
        <a data-role="admin-only" href="/admin/personnel" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'personnel' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'personnel' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chalkboard-user w-6 text-lg ${activeMenu === 'personnel' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">교강사 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/facilities" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'facilities' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'facilities' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-building-circle-check w-6 text-lg ${activeMenu === 'facilities' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">훈련시설 관리</span>
        </a>
        <div data-role="admin-only" class="space-y-1">
            <a href="/admin/items" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'items' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
                ${activeMenu === 'items' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
                <i class="fas fa-boxes-stacked w-6 text-lg ${activeMenu === 'items' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
                <span class="font-medium text-[14px]">물품 관리</span>
            </a>
            <a href="/admin/items/transactions" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'items-transactions' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                 <i class="fas fa-exchange-alt w-6 text-sm ${activeMenu === 'items-transactions' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                 <span class="font-medium text-[13px]">입/출고 이력</span>
            </a>
        </div>

        <!-- 콘텐츠·커뮤니티 -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">콘텐츠·커뮤니티</span>
        </div>
        <a data-role="admin-only" href="/admin/users" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'users' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'users' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-user-group w-6 text-lg ${activeMenu === 'users' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">회원 관리</span>
        </a>
        <a href="/admin/posts" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'posts' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'posts' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-newspaper w-6 text-lg ${activeMenu === 'posts' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">게시판 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/partner-universities" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'partner-universities' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'partner-universities' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-university w-6 text-lg ${activeMenu === 'partner-universities' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">협력대학 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/jobs" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'jobs' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'jobs' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-briefcase w-6 text-lg ${activeMenu === 'jobs' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">채용공고 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/jobseekers" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'jobseekers' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'jobseekers' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-address-book w-6 text-lg ${activeMenu === 'jobseekers' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">인재풀 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/reviews" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'reviews' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'reviews' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-star w-6 text-lg ${activeMenu === 'reviews' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">수강후기 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/prototype-gallery" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'prototype-gallery' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'prototype-gallery' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-cube w-6 text-lg ${activeMenu === 'prototype-gallery' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">시제품 제작사진</span>
        </a>
        <a data-role="admin-only" href="/admin/education-gallery" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'education-gallery' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'education-gallery' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-images w-6 text-lg ${activeMenu === 'education-gallery' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">교육사진 갤러리</span>
        </a>
        <a data-role="admin-only" href="/admin/portfolio-gallery" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'portfolio-gallery' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'portfolio-gallery' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-briefcase w-6 text-lg ${activeMenu === 'portfolio-gallery' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">포트폴리오 갤러리</span>
        </a>
        <a data-role="admin-only" href="/admin/inquiries" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'inquiries' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'inquiries' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-headset w-6 text-lg ${activeMenu === 'inquiries' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">온라인 문의</span>
        </a>

        <!-- 슈퍼어드민 · 사이트관리 (관리자 전용) -->
        <div data-role="admin-only" class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">슈퍼어드민</span>
        </div>
        <div data-role="admin-only" class="space-y-1">
            <div class="flex items-center px-4 py-3 rounded-xl text-slate-400">
                <i class="fas fa-user-shield w-6 text-lg text-slate-500"></i>
                <span class="font-medium text-[14px]">관리자 설정</span>
            </div>
            <a href="/admin/ncs/upload" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'ncs-upload' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                <i class="fas fa-file-upload w-6 text-sm ${activeMenu === 'ncs-upload' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                <span class="font-medium text-[13px]">NCS 데이터 업로드</span>
            </a>
        </div>

        <div class="h-10"></div>
    </nav>
    
    <!-- 하단 프로필 섹션 -->
    <div class="p-4 bg-[#0f172a] border-t border-slate-800/50">
        <div class="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30">
            <div class="flex items-center">
                <div class="relative">
                    <div id="sidebar-avatar" class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">A</div>
                    <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                </div>
                <div class="ml-3 truncate">
                    <p id="sidebar-username" class="text-sm font-bold text-white truncate"></p>
                    <p id="sidebar-userrole" class="text-[10px] text-slate-500 font-medium uppercase tracking-tight truncate"></p>
                </div>
                <button id="logout-btn" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    </div>

</aside>
</div>

<script>
    // 모바일 사이드바 토글
    (function(){
        var wrap = document.getElementById('adminSidebarWrap');
        var backdrop = document.getElementById('adminSidebarBackdrop');
        var toggle = document.getElementById('adminSidebarToggle');
        function openSidebar(){ wrap && wrap.classList.add('translate-x-0'); wrap && wrap.classList.remove('-translate-x-full'); backdrop && backdrop.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
        function closeSidebar(){ wrap && wrap.classList.remove('translate-x-0'); wrap && wrap.classList.add('-translate-x-full'); backdrop && backdrop.classList.add('hidden'); document.body.style.overflow = ''; }
        if(toggle){ toggle.addEventListener('click', function(){ wrap && wrap.classList.contains('-translate-x-full') ? openSidebar() : closeSidebar(); }); }
        if(backdrop){ backdrop.addEventListener('click', closeSidebar); }
        if(wrap){ wrap.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeSidebar); }); }
        var mainWrap = document.getElementById('adminSidebarWrap') && document.getElementById('adminSidebarWrap').nextElementSibling;
        if(mainWrap) mainWrap.classList.add('pl-14', 'lg:pl-0');
    })();
    // 전역 logout 함수 정의
    window.logout = function() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/login';
        }
    };

    // 페이지 접근 권한 체크 (Role-based Access Control)
    (function(){
        const pathname = window.location.pathname;
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            window.location.href = '/login';
            return;
        }
        try {
            const user = JSON.parse(userStr);
            const role = user.role;

            // /admin 경로: 반드시 admin 역할이어야 함
            if (pathname.startsWith('/admin')) {
                if (role !== 'admin') {
                    console.warn('Unauthorized access to admin page. Redirecting...');
                    if (role === 'teacher') {
                        window.location.href = '/teacher';
                    } else if (role === 'student' || role === 'user') {
                        window.location.href = '/student';
                    } else {
                        window.location.href = '/';
                    }
                }
            }
            // /teacher 경로: admin 또는 teacher 역할이어야 함
            else if (pathname.startsWith('/teacher')) {
                if (role !== 'teacher' && role !== 'admin') {
                    console.warn('Unauthorized access to teacher page. Redirecting...');
                    if (role === 'student' || role === 'user') {
                        window.location.href = '/student';
                    } else {
                        window.location.href = '/login';
                    }
                }
            }

            // 사이드바 하단 프로필 표시 업데이트
            const avatarEl = document.getElementById('sidebar-avatar');
            const usernameEl = document.getElementById('sidebar-username');
            const roleEl = document.getElementById('sidebar-userrole');
            const logoBrandEl = document.getElementById('sidebar-logo-brand');
            const logoSubEl = document.getElementById('sidebar-logo-sub');

            if (avatarEl && user.name) {
                avatarEl.textContent = user.name.charAt(0);
            }
            if (usernameEl) {
                usernameEl.textContent = user.name || 'User';
            }
            if (roleEl) {
                const roleLabels = { admin: 'Super Admin', teacher: 'Instructor', student: 'Student', user: 'User' };
                roleEl.textContent = roleLabels[role] || role;
            }

            // 관리자가 아닌 경우 로고 및 메뉴 필터링
            if (role !== 'admin') {
                if (logoSubEl) logoSubEl.textContent = '홍대센터 LMS';
                
                // admin-only 요소들을 즉시 숨김
                document.querySelectorAll('[data-role="admin-only"]').forEach(el => {
                    (el as HTMLElement).style.display = 'none';
                });
            }
        } catch(e) {
            console.error('Auth check error:', e);
            window.location.href = '/login';
        }
    })();

    document.addEventListener('DOMContentLoaded', () => {
        const sidebarNav = document.querySelector('aside nav');
        if (sidebarNav) {
            const savedScrollTop = sessionStorage.getItem('sidebarScrollTop');
            if (savedScrollTop) {
                sidebarNav.scrollTop = parseInt(savedScrollTop, 10);
            }

            const links = sidebarNav.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    sessionStorage.setItem('sidebarScrollTop', sidebarNav.scrollTop);
                });
            });
        }
        
        // 로그아웃 버튼에 이벤트 리스너 추가
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.logout();
            });
        }

        // 사이드바 운영 과정 선택기 데이터 로드
        const courseSelector = document.getElementById('sidebarActiveCourseSelector');
        const token = localStorage.getItem('token');
        if (courseSelector && token) {
            fetch('/api/course-sessions?status=in_progress', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) {
                    res.data.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = s.id;
                        opt.textContent = '[' + (s.session_number || 1) + '차] ' + s.course_name;
                        courseSelector.appendChild(opt);
                    });
                    
                    // 현재 URL에서 courseId 추출하여 자동 선택 (admin 또는 teacher 경로 모두 지원)
                    const match = location.pathname.match(/\/(admin|teacher)\/courses\/(\d+)\/lms/);
                    if (match && match[2]) {
                        courseSelector.value = match[2];
                    }
                }
            })
            .catch(err => console.error('Sidebar course load error:', err));
        }
    });
</script>

<style>
/* 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b; 
    border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #334155; 
}

/* 활성화된 네비게이션 효과 */
.active-nav-glow {
    box-shadow: inset 0 0 15px -10px rgba(59, 130, 246, 0.5);
}
</style>
`;
};
