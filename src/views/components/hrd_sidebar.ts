export const hrdSidebar = (activeMenu: string) => `
<aside class="w-64 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 flex-shrink-0 border-r border-slate-800">
    <!-- 로고 영역 -->
    <div class="h-20 flex items-center px-6 bg-[#0f172a] relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div class="flex items-center z-10">
            <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
                <i class="fas fa-university text-white text-lg"></i>
            </div>
            <div>
                <span class="font-bold text-white text-base tracking-tight leading-tight block">WOW3D</span>
                <span class="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">홍대센터 ADMIN</span>
            </div>
        </div>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <!-- 메인 그룹 -->
        <div class="px-3 mb-2 mt-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">Main Dashboard</span>
        </div>
        
        <a href="/admin" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'dashboard' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative overflow-hidden">
            ${activeMenu === 'dashboard' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chart-pie w-6 text-lg ${activeMenu === 'dashboard' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-semibold text-[14px]">대시보드</span>
        </a>

        <!-- 학사 행정 그룹 -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">LMS & Academic</span>
        </div>
        
        <a href="/admin/courses" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'courses' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
            ${activeMenu === 'courses' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-graduation-cap w-6 text-lg ${activeMenu === 'courses' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">교육과정 관리</span>
        </a>

        <a href="/admin/ncs" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'ncs' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'ncs' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-layer-group w-6 text-lg ${activeMenu === 'ncs' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">NCS 능력단위</span>
        </a>

        <a href="/admin/schedule" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'schedule' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'schedule' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-calendar-day w-6 text-lg ${activeMenu === 'schedule' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">통합 일정 관리</span>
        </a>

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

        <a href="/admin/counseling" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'counseling' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'counseling' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-comment-medical w-6 text-lg ${activeMenu === 'counseling' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">상담 일지</span>
        </a>

        <a href="/admin/exams" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'exams' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'exams' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-file-alt w-6 text-lg ${activeMenu === 'exams' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">시험/문제 관리</span>
        </a>

        <a href="/admin/grades" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'grades' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'grades' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chart-line w-6 text-lg ${activeMenu === 'grades' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">성적/채점 관리</span>
        </a>

        <!-- 운영 관리 그룹 -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">ERP & Operation</span>
        </div>

        <a href="/admin/personnel" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'personnel' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'personnel' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-chalkboard-user w-6 text-lg ${activeMenu === 'personnel' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">교강사 관리</span>
        </a>

        <div class="space-y-1">
            <a href="/admin/items" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'items' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
                ${activeMenu === 'items' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
                <i class="fas fa-boxes-stacked w-6 text-lg ${activeMenu === 'items' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
                <span class="font-medium text-[14px]">물품 관리</span>
            </a>
            
            <!-- 입/출고 관리 (Sub Menu) -->
            <a href="/admin/items/transactions" class="flex items-center px-4 py-2.5 ml-3 mr-2 rounded-lg transition-all duration-300 ${activeMenu === 'items-transactions' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'} group relative">
                 <i class="fas fa-exchange-alt w-6 text-sm ${activeMenu === 'items-transactions' ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors pl-1"></i>
                 <span class="font-medium text-[13px]">ㄴ 입/출고 이력</span>
            </a>
        </div>

        <a href="/admin/facilities" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'facilities' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'facilities' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-building-circle-check w-6 text-lg ${activeMenu === 'facilities' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">훈련시설 관리</span>
        </a>

        <!-- 서비스 관리 그룹 -->
        <div class="px-3 pt-6 pb-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-70">CMS & Career</span>
        </div>

        <a href="/admin/users" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'users' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'users' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-user-group w-6 text-lg ${activeMenu === 'users' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">회원 관리</span>
        </a>

        <a href="/admin/jobs" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'jobs' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'jobs' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-briefcase w-6 text-lg ${activeMenu === 'jobs' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">채용공고 관리</span>
        </a>

        <a href="/admin/jobseekers" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'jobseekers' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'jobseekers' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-address-book w-6 text-lg ${activeMenu === 'jobseekers' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">인재풀 관리</span>
        </a>

        <a href="/admin/reviews" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'reviews' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'reviews' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-star w-6 text-lg ${activeMenu === 'reviews' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">수강후기 관리</span>
        </a>

        <a href="/admin/posts" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'posts' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'posts' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-newspaper w-6 text-lg ${activeMenu === 'posts' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">게시판 관리</span>
        </a>

        <a href="/admin/inquiries" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === 'inquiries' ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white active-nav-glow' : 'hover:bg-slate-800/50 hover:text-white'} group relative">
             ${activeMenu === 'inquiries' ? '<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>' : ''}
            <i class="fas fa-headset w-6 text-lg ${activeMenu === 'inquiries' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors duration-300"></i>
            <span class="font-medium text-[14px]">온라인 문의 관리</span>
        </a>

        <div class="h-10"></div>
    </nav>
    
    <!-- 하단 프로필 섹션 -->
    <div class="p-4 bg-[#0f172a] border-t border-slate-800/50">
        <div class="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30">
            <div class="flex items-center">
                <div class="relative">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">A</div>
                    <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                </div>
                <div class="ml-3 truncate">
                    <p class="text-sm font-bold text-white truncate">최고 관리자</p>
                    <p class="text-[10px] text-slate-500 font-medium uppercase tracking-tight truncate">Super Admin</p>
                </div>
                <button id="logout-btn" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    </div>

</aside>

<script>
    // 전역 logout 함수 정의
    window.logout = function() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/login';
        }
    };

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
