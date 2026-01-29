export const teacherSidebar = (activeMenu: string) => `
<aside class="w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-30 flex-shrink-0 border-r border-white/5 relative">
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>

    <!-- 로고 영역 (Bento Style) -->
    <div class="h-24 flex items-center px-8 relative z-10 transition-all duration-500 ease-in-out">
        <div class="flex items-center gap-4 group cursor-pointer">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 overflow-hidden relative">
                <i class="fas fa-cube text-xl text-blue-400 group-hover:text-white transition-colors relative z-10"></i>
                <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="flex flex-col">
                <span class="font-black text-lg tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">3D COOKIE</span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">교수 지원 시스템</span>
            </div>
        </div>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
        <!-- 1. 학사 운영 -->
        <div class="space-y-2">
            <div class="px-4 flex items-center gap-3 mb-4">
                <span class="w-1 h-3 bg-blue-500 rounded-full"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">학사 운영 관리</span>
            </div>
            <div class="space-y-1">
                <a href="/teacher" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-border-all text-sm ${activeMenu === 'dashboard' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">종합 대시보드</span>
                </a>
                <a href="/teacher/courses" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'courses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-chalkboard-teacher text-sm ${activeMenu === 'courses' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">나의 강의 관리</span>
                    ${activeMenu === 'courses' ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>' : ''}
                </a>
            </div>
        </div>

        <!-- 2. 학생 성과 -->
        <div class="space-y-2">
            <div class="px-4 flex items-center gap-3 mb-4">
                <span class="w-1 h-3 bg-orange-500 rounded-full"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">학생 성과 관리</span>
            </div>
            <div class="space-y-1">
                <a href="/teacher/students" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-user-graduate text-sm ${activeMenu === 'students' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">수강생 분석</span>
                </a>
                <a href="/teacher/attendance" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'attendance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-calendar-check text-sm ${activeMenu === 'attendance' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">출석 관리</span>
                </a>
                <a href="/teacher/exams" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'exams' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-clipboard-check text-sm ${activeMenu === 'exams' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">평가 및 채점</span>
                </a>
                <a href="/teacher/surveys" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'surveys' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-poll text-sm ${activeMenu === 'surveys' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">설문 및 역량진단</span>
                </a>
            </div>
        </div>

        <!-- 3. 커뮤니케이션 -->
        <div class="space-y-2">
            <div class="px-4 flex items-center gap-3 mb-4">
                <span class="w-1 h-3 bg-purple-500 rounded-full"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">지식 공유 및 소통</span>
            </div>
            <div class="space-y-1">
                <a href="/teacher/posts" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'posts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-comments text-sm ${activeMenu === 'posts' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">커뮤니티 관리</span>
                </a>
                <a href="/teacher/portfolios" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'portfolios' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-briefcase text-sm ${activeMenu === 'portfolios' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">포트폴리오 관리</span>
                </a>
            </div>
        </div>

        <!-- 4. 시스템 설정 -->
        <div class="space-y-2 pb-8">
            <div class="px-4 flex items-center gap-3 mb-4">
                <span class="w-1 h-3 bg-gray-600 rounded-full"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">설정 및 정보</span>
            </div>
            <div class="space-y-1">
                <a href="/teacher/profile" class="flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeMenu === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-user-gear text-sm ${activeMenu === 'profile' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">강사 프로필 수정</span>
                </a>
            </div>
        </div>
    </nav>
    
    <!-- 하단 프로필 세션 (Bento Style) -->
    <div class="p-6 mt-auto relative z-20">
        <div class="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] shadow-2xl backdrop-blur-md overflow-hidden relative group">
            <div class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-3 relative z-10">
                <div class="relative">
                    <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg" id="sidebar-teacher-initial">
                        T
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-gray-900 rounded-full shadow-sm"></div>
                </div>
                <div class="flex flex-col min-w-0">
                    <span id="sidebar-teacher-name" class="text-sm font-black text-white truncate tracking-tight">강사</span>
                    <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest">인증된 강사</span>
                </div>
                <button onclick="window.logout()" class="ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-500 border border-white/5" title="로그아웃">
                    <i class="fas fa-sign-out-alt text-sm"></i>
                </button>
            </div>
        </div>
    </div>
</aside>

<style>
/* Bento Sidebar Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}
</style>

<script>
    // 전역 logout 함수 정의
    window.logout = function() {
        if (confirm('로그아웃 하시겠습니까? (Confirm Logout)')) {
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
                const initialEl = document.getElementById('sidebar-teacher-initial');
                
                if (nameEl && user.name) {
                    nameEl.textContent = user.name;
                    if (initialEl) initialEl.textContent = user.name[0];
                }
            } catch(e) {
                console.error('Error parsing user data in sidebar:', e);
            }
        }
    });
</script>
`;
