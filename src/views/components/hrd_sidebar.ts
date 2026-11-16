import { changePasswordModalHtml } from './change_password_modal';
import { sidebarMobileBar, sidebarMobileCss } from './sidebar_mobile';

export const hrdSidebar = (activeMenu: string) => {
    const backdropClass = 'fixed inset-0 bg-black/50 z-30 lg:hidden hidden transition-opacity';
    const wrapClass = 'fixed lg:relative inset-y-0 left-0 z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out flex-shrink-0 w-64 lg:min-w-64';
    return `
<!-- 모바일: 사이드바 백드롭 -->
<div id="adminSidebarBackdrop" class="${backdropClass}" aria-hidden="true"></div>
<!-- 모바일: 상단 바 + 사이드바 열기 버튼 -->
${sidebarMobileBar('adminSidebarToggle', 'adminMobileBar', '/admin', '관리자')}
${sidebarMobileCss}
<!-- 사이드바 래퍼 -->
<div id="adminSidebarWrap" class="${wrapClass}">
<aside class="w-64 h-full bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl border-r border-slate-800">
    <!-- 로고 영역 -->
    <div class="h-16 flex items-center px-5 bg-[#0f172a] shrink-0">
        <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <i class="fas fa-university text-white text-[14px]"></i>
            </div>
            <div class="min-w-0">
                <span id="sidebar-logo-brand" class="font-medium text-white text-[15px] leading-tight block truncate">WOW3D</span>
                <span id="sidebar-logo-sub" class="text-[11px] text-slate-500 block truncate">홍대센터 관리자</span>
            </div>
        </div>
    </div>

    <!-- 운영 과정 퀵 선택기 (Quick Selector) -->
    <div class="px-3 pb-4 border-b border-slate-800/50 shrink-0">
        <div class="px-3 mb-2">
            <span class="text-[11px] text-slate-500">운영 과정 바로가기</span>
        </div>
        <div class="relative group/selector">
            <select id="sidebarActiveCourseSelector" onchange="(function(v){ if(!v) return; var parts=v.split('|'); var cid=parts[0]; var sid=parts[1]; var base = window.location.pathname.startsWith('/teacher') ? '/teacher' : '/admin'; var url = base+'/courses/'+cid+'/lms?type=hrd'; if(sid) url += '&session_id='+sid; location.href = url; })(this.value)" class="w-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-[13px] rounded-lg px-3 h-9 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors duration-150 cursor-pointer hover:bg-slate-800">
                <option value="">진행 중인 과정 선택</option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <!-- 대시보드 -->
        <div class="px-3 pt-2 pb-2">
            <span class="text-[11px] text-slate-500">메인</span>
        </div>
        <a href="/admin" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative overflow-hidden">
            <i class="fas fa-chart-pie w-5 text-[15px] ${activeMenu === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">대시보드</span>
        </a>
        <a href="/admin/schedule" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'schedule' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-calendar-day w-5 text-[15px] ${activeMenu === 'schedule' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">통합 일정 관리</span>
        </a>
        <a href="/admin/analytics" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'analytics' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-chart-line w-5 text-[15px] ${activeMenu === 'analytics' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">사이트 접속정보</span>
        </a>

        <!-- 교육·과정 (LMS) -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] text-slate-500">교육·과정</span>
        </div>
        <div class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu.startsWith('courses')) ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu.startsWith('courses')}">
                <div class="flex items-center">
                    <i class="fas fa-graduation-cap w-5 text-[15px] ${(activeMenu.startsWith('courses')) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">교육운영 관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu.startsWith('courses')) ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu.startsWith('courses')) ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/courses" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-list w-5 text-[13px] ${activeMenu === 'courses' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">교육운영 목록</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/register" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-register' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-plus-circle w-5 text-[13px] ${activeMenu === 'courses-register' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">일반과정등록</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/categories" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-categories' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-tags w-5 text-[13px] ${activeMenu === 'courses-categories' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">과정분류관리</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/approved" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-approved' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-check-double w-5 text-[13px] ${activeMenu === 'courses-approved' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">승인받은 과정</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/sessions" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-sessions' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-calendar-plus w-5 text-[13px] ${activeMenu === 'courses-sessions' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">회차별 과정개설</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/sessions/enrollments" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-session-enrollments' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-user-plus w-5 text-[13px] ${activeMenu === 'courses-session-enrollments' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">수강생 등록</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/opening-docs" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-opening-docs' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-folder-open w-5 text-[13px] ${activeMenu === 'courses-opening-docs' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">개강서류 준비</span>
                </a>
                <a data-role="admin-only" href="/admin/courses/copy" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'courses-copy' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-copy w-5 text-[13px] ${activeMenu === 'courses-copy' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">회차별 과정복사</span>
                </a>
            </div>
        </div>

        <a href="/admin/students" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'students' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-user-graduate w-5 text-[15px] ${activeMenu === 'students' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">수강생관리</span>
        </a>

        <a href="/admin/attendance" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'attendance' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-clock w-5 text-[15px] ${activeMenu === 'attendance' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">출석 관리</span>
        </a>

        <a href="/admin/training-logs" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'training-logs' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-pen-nib w-5 text-[15px] ${activeMenu === 'training-logs' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">훈련 일지</span>
        </a>

        <a href="/admin/assignments" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'assignments' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-tasks w-5 text-[15px] ${activeMenu === 'assignments' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">과제 관리</span>
        </a>

        <a href="/admin/counseling" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'counseling' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-comment-medical w-5 text-[15px] ${activeMenu === 'counseling' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">상담관리</span>
        </a>

        <div class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu.startsWith('exams')) ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu.startsWith('exams')}">
                <div class="flex items-center">
                    <i class="fas fa-file-signature w-5 text-[15px] ${(activeMenu.startsWith('exams')) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">사전평가관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu.startsWith('exams')) ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu.startsWith('exams')) ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/exams" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'exams' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-list w-5 text-[13px] ${activeMenu === 'exams' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">사전평가 목록</span>
                </a>
                <a href="/admin/exams/question-bank" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'exams-question-bank' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-database w-5 text-[13px] ${activeMenu === 'exams-question-bank' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">사전평가문제은행</span>
                </a>
            </div>
        </div>

        <div class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu.startsWith('ncs-eval')) ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu.startsWith('ncs-eval')}">
                <div class="flex items-center">
                    <i class="fas fa-certificate w-5 text-[15px] ${(activeMenu.startsWith('ncs-eval')) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">NCS평가(본평가)관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu.startsWith('ncs-eval')) ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu.startsWith('ncs-eval')) ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/ncs-eval-dashboard-hub" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-eval-dashboard-hub' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-table-columns w-5 text-[13px] ${activeMenu === 'ncs-eval-dashboard-hub' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">본평가 · 전체 과정 현황</span>
                </a>
                <a href="/admin/ncs-eval-plan" onclick="return typeof window.__hrdSidebarNcsLmsNav==='function' ? window.__hrdSidebarNcsLmsNav(event, 'ncs-eval-plan') : true;" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-eval-plan' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative" title="운영 과정 바로가기에서 과정을 고르면 해당 과정 LMS로 연결됩니다">
                    <i class="fas fa-clipboard-list w-5 text-[13px] ${activeMenu === 'ncs-eval-plan' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">NCS평가계획 <span class="text-slate-500 font-normal">(과정 선택)</span></span>
                </a>
                <a href="/admin/ncs-eval-exec" onclick="return typeof window.__hrdSidebarNcsLmsNav==='function' ? window.__hrdSidebarNcsLmsNav(event, 'ncs-eval-exec') : true;" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-eval-exec' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative" title="운영 과정 바로가기에서 과정을 고르면 해당 과정 LMS로 연결됩니다">
                    <i class="fas fa-play-circle w-5 text-[13px] ${activeMenu === 'ncs-eval-exec' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">NCS평가실행 <span class="text-slate-500 font-normal">(과정 선택)</span></span>
                </a>
                <a href="/admin/ncs-eval-result" onclick="return typeof window.__hrdSidebarNcsLmsNav==='function' ? window.__hrdSidebarNcsLmsNav(event, 'ncs-eval-result') : true;" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-eval-result' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative" title="운영 과정 바로가기에서 과정을 고르면 해당 과정 LMS로 연결됩니다">
                    <i class="fas fa-poll w-5 text-[13px] ${activeMenu === 'ncs-eval-result' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">NCS평가결과 <span class="text-slate-500 font-normal">(과정 선택)</span></span>
                </a>
            </div>
        </div>

        <a href="/admin/grades" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'grades' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-chart-line w-5 text-[15px] ${activeMenu === 'grades' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">성적관리</span>
        </a>

        <a href="/admin/surveys" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'surveys' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-poll w-5 text-[15px] ${activeMenu === 'surveys' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">설문 관리</span>
        </a>
        <a href="/admin/instructor-eval" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'instructor-eval' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-chalkboard-teacher w-5 text-[15px] ${activeMenu === 'instructor-eval' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">교강사직무능력평가</span>
        </a>

        <!-- NCS -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] text-slate-500">NCS</span>
        </div>
        <a href="/admin/ncs/viewer" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-viewer' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-sitemap w-5 text-[15px] ${activeMenu === 'ncs-viewer' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">NCS 분류보기</span>
        </a>

        <!-- 인력·시설 (관리자 전용) -->
        <div data-role="admin-only" class="px-3 pt-6 pb-2">
            <span class="text-[11px] text-slate-500">인력·시설</span>
        </div>
        <a data-role="admin-only" href="/admin/personnel" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'personnel' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-chalkboard-user w-5 text-[15px] ${activeMenu === 'personnel' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">교강사 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/facilities" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'facilities' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-building-circle-check w-5 text-[15px] ${activeMenu === 'facilities' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">훈련시설 관리</span>
        </a>
        <div data-role="admin-only" class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu.startsWith('items')) ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu.startsWith('items')}">
                <div class="flex items-center">
                    <i class="fas fa-boxes-stacked w-5 text-[15px] ${(activeMenu.startsWith('items')) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">물품 관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu.startsWith('items')) ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu.startsWith('items')) ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/items" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'items' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-list w-5 text-[13px] ${activeMenu === 'items' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">물품 목록</span>
                </a>
                <a href="/admin/items/transactions" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'items-transactions' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                     <i class="fas fa-exchange-alt w-5 text-[13px] ${activeMenu === 'items-transactions' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                     <span class="text-[13px]">입/출고 이력</span>
                </a>
            </div>
        </div>

        <!-- 콘텐츠·커뮤니티 -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] text-slate-500">콘텐츠·커뮤니티</span>
        </div>
        <a data-role="admin-only" href="/admin/users" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'users' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-user-group w-5 text-[15px] ${activeMenu === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">회원 관리</span>
        </a>
        <div class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu === 'posts' || activeMenu === 'reviews') ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu === 'posts' || activeMenu === 'reviews'}">
                <div class="flex items-center">
                    <i class="fas fa-newspaper w-5 text-[15px] ${(activeMenu === 'posts' || activeMenu === 'reviews') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">게시판 관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu === 'posts' || activeMenu === 'reviews') ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu === 'posts' || activeMenu === 'reviews') ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/posts" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'posts' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-clipboard-list w-5 text-[13px] ${activeMenu === 'posts' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">게시글 관리</span>
                </a>
                <a data-role="admin-only" href="/admin/reviews" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'reviews' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-star w-5 text-[13px] ${activeMenu === 'reviews' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">수강후기 관리</span>
                </a>
            </div>
        </div>
        <a data-role="admin-only" href="/admin/partner-universities" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'partner-universities' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-university w-5 text-[15px] ${activeMenu === 'partner-universities' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">협력대학 관리</span>
        </a>
        <a data-role="admin-only" href="/admin/education-performance" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'education-performance' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-chart-line w-5 text-[15px] ${activeMenu === 'education-performance' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">교육실적 관리</span>
        </a>
        <div data-role="admin-only" class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu === 'jobs' || activeMenu === 'jobseekers') ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu === 'jobs' || activeMenu === 'jobseekers'}">
                <div class="flex items-center">
                    <i class="fas fa-briefcase w-5 text-[15px] ${(activeMenu === 'jobs' || activeMenu === 'jobseekers') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">채용정보</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu === 'jobs' || activeMenu === 'jobseekers') ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu === 'jobs' || activeMenu === 'jobseekers') ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/jobs" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'jobs' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-building w-5 text-[13px] ${activeMenu === 'jobs' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">구인정보</span>
                </a>
                <a href="/admin/jobseekers" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'jobseekers' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-user-tie w-5 text-[13px] ${activeMenu === 'jobseekers' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">구직정보</span>
                </a>
            </div>
        </div>
        <div data-role="admin-only" class="space-y-0.5">
            <button type="button" class="sidebar-accordion-toggle flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-150 ${(activeMenu === 'prototype-gallery' || activeMenu === 'education-gallery' || activeMenu === 'portfolio-gallery') ? 'bg-slate-800 text-white open' : 'hover:bg-slate-800/60 hover:text-white'} group relative cursor-pointer" aria-expanded="${activeMenu === 'prototype-gallery' || activeMenu === 'education-gallery' || activeMenu === 'portfolio-gallery'}">
                <div class="flex items-center">
                    <i class="fas fa-photo-film w-5 text-[15px] ${(activeMenu === 'prototype-gallery' || activeMenu === 'education-gallery' || activeMenu === 'portfolio-gallery') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
                    <span class="text-[14px]">갤러리 관리</span>
                </div>
                <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform duration-200 chevron-icon ${(activeMenu === 'prototype-gallery' || activeMenu === 'education-gallery' || activeMenu === 'portfolio-gallery') ? 'rotate-180' : ''}"></i>
            </button>
            <div class="sidebar-submenu-content overflow-hidden transition-[max-height,opacity] duration-200 ${(activeMenu === 'prototype-gallery' || activeMenu === 'education-gallery' || activeMenu === 'portfolio-gallery') ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}">
                <a href="/admin/prototype-gallery" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'prototype-gallery' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-cube w-5 text-[13px] ${activeMenu === 'prototype-gallery' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">시제품 제작사진</span>
                </a>
                <a href="/admin/education-gallery" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'education-gallery' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-images w-5 text-[13px] ${activeMenu === 'education-gallery' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">교육사진 갤러리</span>
                </a>
                <a href="/admin/portfolio-gallery" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'portfolio-gallery' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                    <i class="fas fa-briefcase w-5 text-[13px] ${activeMenu === 'portfolio-gallery' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                    <span class="text-[13px]">포트폴리오 갤러리</span>
                </a>
            </div>
        </div>
        <a data-role="admin-only" href="/admin/inquiries" class="flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${activeMenu === 'inquiries' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'} group relative">
            <i class="fas fa-headset w-5 text-[15px] ${activeMenu === 'inquiries' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-150"></i>
            <span class="text-[14px]">온라인 문의</span>
        </a>

        <!-- 슈퍼어드민 · 사이트관리 (관리자 전용) -->
        <div data-role="admin-only" class="px-3 pt-6 pb-2">
            <span class="text-[11px] text-slate-500">슈퍼어드민</span>
        </div>
        <div data-role="admin-only" class="space-y-0.5">
            <a href="/admin/home-popups" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'home-popups' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                <i class="fas fa-window-restore w-5 text-[13px] ${activeMenu === 'home-popups' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                <span class="text-[13px]">메인 팝업 관리</span>
            </a>
            <a href="/admin/settings" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                <i class="fas fa-cog w-5 text-[13px] ${activeMenu === 'settings' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                <span class="text-[13px]">훈련기관 정보설정</span>
            </a>
            <a href="/admin/ncs/upload" class="flex items-center pl-9 pr-3 py-1.5 rounded-lg transition-colors duration-150 ${activeMenu === 'ncs-upload' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'} group relative">
                <i class="fas fa-file-upload w-5 text-[13px] ${activeMenu === 'ncs-upload' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors"></i>
                <span class="text-[13px]">NCS 데이터 업로드</span>
            </a>
        </div>

        <div class="h-10"></div>
    </nav>
    
    <!-- 하단 프로필 섹션 -->
    <div class="p-4 bg-[#0f172a] border-t border-slate-800/50">
        <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <div class="flex items-center">
                <div class="relative">
                    <div id="sidebar-avatar" class="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white text-[13px] font-medium">A</div>
                    <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                </div>
                <div class="ml-3 truncate">
                    <p id="sidebar-username" class="text-[13px] font-medium text-white truncate"></p>
                    <p id="sidebar-userrole" class="text-[11px] text-slate-500 truncate"></p>
                </div>
                <button type="button" onclick="typeof window.openChangePasswordModal==='function'&&window.openChangePasswordModal()" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors duration-150" title="비밀번호 변경">
                    <i class="fas fa-key"></i>
                </button>
                <button id="logout-btn" onclick="typeof window.logout==='function'&&window.logout()" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors duration-150" title="로그아웃">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    </div>

</aside>
</div>

<script src="/static/admin-sidebar.js"></script>

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
</style>
${changePasswordModalHtml()}
`;
};
