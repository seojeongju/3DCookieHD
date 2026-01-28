export const teacherSidebar = (activeMenu: string) => `
<aside class="w-64 bg-slate-800 text-white flex flex-col shadow-xl z-20 flex-shrink-0">
    <!-- 로고 영역 -->
    <div class="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-700">
        <i class="fas fa-chalkboard-teacher text-blue-400 mr-3 text-xl"></i>
        <span class="font-bold text-lg tracking-tight">강사 전용 시스템</span>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div class="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">메인</div>
        <a href="/teacher" class="flex items-center px-6 py-3 ${activeMenu === 'dashboard' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-chart-pie w-6 ${activeMenu === 'dashboard' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">대시보드</span>
        </a>

        <!-- 학사 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">학사 관리</div>
        <a href="/teacher/courses" class="flex items-center px-6 py-3 ${activeMenu === 'courses' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-book w-6 ${activeMenu === 'courses' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">나의 강의 관리</span>
        </a>
        <a href="/teacher/students" class="flex items-center px-6 py-3 ${activeMenu === 'students' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-user-graduate w-6 ${activeMenu === 'students' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">수강생 관리</span>
        </a>
        <a href="/teacher/attendance" class="flex items-center px-6 py-3 ${activeMenu === 'attendance' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-clock w-6 ${activeMenu === 'attendance' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">출석 관리</span>
        </a>
        <a href="/teacher/exams" class="flex items-center px-6 py-3 ${activeMenu === 'exams' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-file-alt w-6 ${activeMenu === 'exams' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">시험 출제/채점</span>
        </a>
        <a href="/teacher/surveys" class="flex items-center px-6 py-3 ${activeMenu === 'surveys' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-poll w-6 ${activeMenu === 'surveys' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">설문 및 역량평가</span>
        </a>

        <a href="/teacher/posts" class="flex items-center px-6 py-3 ${activeMenu === 'posts' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-comments w-6 ${activeMenu === 'posts' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">게시판/공지</span>
        </a>

        <!-- 성과 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">성과 관리</div>
        <a href="/teacher/portfolios" class="flex items-center px-6 py-3 ${activeMenu === 'portfolios' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-briefcase w-6 ${activeMenu === 'portfolios' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">포트폴리오 관리</span>
        </a>

        <!-- 개인정보 관리 -->
        <div class="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">개인정보</div>
        <a href="/teacher/profile" class="flex items-center px-6 py-3 ${activeMenu === 'profile' ? 'bg-slate-700 border-r-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'} group">
            <i class="fas fa-user-edit w-6 ${activeMenu === 'profile' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}"></i>
            <span class="font-medium">개인정보 수정</span>
        </a>

        <div class="h-10"></div>
    </nav>
    
    <!-- 하단 프로필 섹션 -->
    <div class="p-4 bg-slate-900 border-t border-slate-700 shadow-inner">
        <div class="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30">
            <div class="flex items-center">
                <div class="relative">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">T</div>
                    <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div class="ml-3 truncate flex-1">
                    <p id="sidebar-teacher-name" class="text-sm font-bold text-white truncate">강사</p>
                    <p class="text-[10px] text-slate-500 font-medium uppercase tracking-tight truncate">Teacher</p>
                </div>
                <button id="logout-btn" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    </div>
</aside>
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
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const nameEl = document.getElementById('sidebar-teacher-name');
                if (nameEl && user.name) {
                    nameEl.textContent = user.name;
                }
            } catch(e) {}
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
`;
