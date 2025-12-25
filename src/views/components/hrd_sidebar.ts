export const hrdSidebar = (activeMenu: string) => `
<aside class="w-64 bg-slate-800 text-white flex flex-col shadow-xl z-20 flex-shrink-0">
    <!-- 로고 영역 -->
    <div class="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-700">
        <i class="fas fa-university text-blue-400 mr-3 text-xl"></i>
        <span class="font-bold text-lg tracking-tight">통합 교육행정 시스템</span>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div class="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">메인</div>
        <a href="/admin" class="flex items-center px-6 py-3 ${activeMenu === 'dashboard' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-chart-pie w-6 ${activeMenu === 'dashboard' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">대시보드</span>
        </a>

        <!-- 학사/행정 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">학사 행정 (LMS)</div>
        <a href="/admin/courses" class="flex items-center px-6 py-3 ${activeMenu === 'courses' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-book w-6 ${activeMenu === 'courses' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">교육과정 관리</span>
        </a>
        <a href="/admin/ncs" class="flex items-center px-6 py-3 ${activeMenu === 'ncs' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-tasks w-6 ${activeMenu === 'ncs' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">NCS 능력단위 관리</span>
        </a>
        <a href="/admin/students" class="flex items-center px-6 py-3 ${activeMenu === 'students' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-user-graduate w-6 ${activeMenu === 'students' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">훈련생 관리</span>
        </a>
        <a href="/admin/attendance" class="flex items-center px-6 py-3 ${activeMenu === 'attendance' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-clock w-6 ${activeMenu === 'attendance' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">출석 관리</span>
        </a>
        <a href="/admin/counseling" class="flex items-center px-6 py-3 ${activeMenu === 'counseling' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-comments w-6 ${activeMenu === 'counseling' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">상담 일지</span>
        </a>
        <a href="/admin/exams" class="flex items-center px-6 py-3 ${activeMenu === 'exams' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-file-alt w-6 ${activeMenu === 'exams' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">시험/문제 관리</span>
        </a>
        <a href="/admin/grades" class="flex items-center px-6 py-3 ${activeMenu === 'grades' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-chart-line w-6 ${activeMenu === 'grades' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">성적/채점 관리</span>
        </a>

        <!-- 운영 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">운영 관리 (ERP)</div>
        <a href="/admin/personnel" class="flex items-center px-6 py-3 ${activeMenu === 'personnel' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-chalkboard-teacher w-6 ${activeMenu === 'personnel' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">교강사 관리</span>
        </a>
        <a href="/admin/items" class="flex items-center px-6 py-3 ${activeMenu === 'items' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-boxes w-6 ${activeMenu === 'items' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">물품 관리</span>
        </a>
        <a href="/admin/facilities" class="flex items-center px-6 py-3 ${activeMenu === 'facilities' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-building w-6 ${activeMenu === 'facilities' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">훈련시설 관리</span>
        </a>

        <!-- 취업 지원 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">취업 지원 (Career)</div>
        <a href="/admin/jobs" class="flex items-center px-6 py-3 ${activeMenu === 'jobs' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
             <i class="fas fa-briefcase w-6 ${activeMenu === 'jobs' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">채용공고 관리</span>
        </a>
        <a href="/admin/jobseekers" class="flex items-center px-6 py-3 ${activeMenu === 'jobseekers' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-address-book w-6 ${activeMenu === 'jobseekers' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">인재풀 관리</span>
        </a>

        <!-- 홈페이지 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">홈페이지 관리 (CMS)</div>
        <a href="/admin/users" class="flex items-center px-6 py-3 ${activeMenu === 'users' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-users w-6 ${activeMenu === 'users' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">회원 관리</span>
        </a>
        <a href="/admin/reviews" class="flex items-center px-6 py-3 ${activeMenu === 'reviews' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-star w-6 ${activeMenu === 'reviews' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">수강후기 관리</span>
        </a>
        <a href="/admin/posts" class="flex items-center px-6 py-3 ${activeMenu === 'posts' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-newspaper w-6 ${activeMenu === 'posts' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">게시판 관리</span>
        </a>
        <!--
        <a href="/admin/qna" class="flex items-center px-6 py-3 ${activeMenu === 'qna' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-comments w-6 ${activeMenu === 'qna' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">문의 관리</span>
        </a>
         -->

        <div class="h-10"></div>
    </nav>
    
    <!-- 하단 프로필 -->
    <div class="p-4 bg-slate-900 border-t border-slate-700 shadow-inner">
        <div class="flex items-center px-2">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">A</div>
            <div class="ml-3">
                <p class="text-sm font-medium text-white">최고 관리자</p>
                <p class="text-xs text-slate-400">Super Admin</p>
            </div>
        </div>
    </div>

</aside>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const sidebarNav = document.querySelector('aside nav');
        if (sidebarNav) {
            /* 1. 이전에 저장된 스크롤 위치가 있으면 즉시 복원 */
            const savedScrollTop = sessionStorage.getItem('sidebarScrollTop');
            if (savedScrollTop) {
                sidebarNav.scrollTop = parseInt(savedScrollTop, 10);
            }

            /* 2. 메뉴 링크 클릭 시 현재 스크롤 위치 저장 */
            /* (페이지 이동 후에도 위치를 유지하기 위함) */
            const links = sidebarNav.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    sessionStorage.setItem('sidebarScrollTop', sidebarNav.scrollTop);
                });
            });
        }
    });
</script>
<style>
/* 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569; 
    border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b; 
}
</style>
`;
