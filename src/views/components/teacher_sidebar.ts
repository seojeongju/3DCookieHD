import { getSidebarPerformanceItems } from './lms_menu_config';

export const teacherSidebar = (activeMenu: string, activeSubMenu?: string) => {
    const performanceItems = getSidebarPerformanceItems();
    return `
<!-- 모바일: 사이드바 백드롭 -->
<div id="teacherSidebarBackdrop" class="fixed inset-0 bg-black/60 z-30 lg:hidden hidden transition-opacity backdrop-blur-sm" aria-hidden="true"></div>

<!-- 모바일: 사이드바 열기 버튼 -->
<button type="button" id="teacherSidebarToggle" aria-label="메뉴 열기" class="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl hover:bg-gray-800 border border-white/10 transition">
  <i class="fas fa-bars"></i>
</button>

<!-- 사이드바 래퍼 -->
<div id="teacherSidebarWrap" class="fixed lg:relative inset-y-0 left-0 z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-500 ease-out flex-shrink-0 w-72 lg:w-72">
<aside class="w-full h-full bg-gray-900 text-white flex flex-col shadow-2xl z-30 flex-shrink-0 border-r border-white/5 relative overflow-hidden">
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
    <div class="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]"></div>

    <!-- 로고 영역 (Bento Style) -->
    <div class="h-24 flex items-center px-8 relative z-10">
        <div class="flex items-center gap-4 group cursor-pointer" onclick="location.href='/teacher'">
            <div class="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500">
                <i class="fas fa-university text-xl text-white"></i>
            </div>
            <div class="flex flex-col">
                <span class="font-black text-lg tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">3D COOKIE</span>
                <span class="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">교수 지원 시스템</span>
            </div>
        </div>
    </div>



    <!-- 메뉴 영역 -->
    <nav class="flex-1 py-8 px-4 space-y-9 overflow-y-auto custom-scrollbar relative z-10">
        <!-- 메인 메뉴 -->
        <div class="space-y-1.5">
            <a href="/teacher" class="flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                <div class="w-8 flex justify-center">
                    <i class="fas fa-chart-line text-sm ${activeMenu === 'dashboard' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                </div>
                <span class="font-black text-sm tracking-tight">종합 대시보드</span>
            </a>
        </div>

        <!-- 학사 운영 -->
        <div class="space-y-3">
            <div class="px-5 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">학사 운영 관리</span>
            </div>
            <div class="space-y-1.5">
                <a href="/teacher/courses" class="flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group ${activeMenu === 'courses' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-chalkboard-teacher text-sm ${activeMenu === 'courses' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">나의 강의 관리</span>
                    ${activeMenu === 'courses' ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>' : ''}
                </a>
            </div>
        </div>

        <!-- 학생 성과 분석 (Accordion) -->
        <div class="space-y-3">
            <div class="px-5 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">학생 성과 분석</span>
            </div>
            
            <div class="space-y-1">
                <button onclick="toggleSidebarAccordion('performance-analysis')" class="w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group text-gray-400 hover:bg-white/5 hover:text-white justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 flex justify-center">
                            <i class="fas fa-chart-pie text-sm text-gray-400 group-hover:text-blue-400 transition-colors"></i>
                        </div>
                        <span class="font-black text-sm tracking-tight text-gray-300">통합 성과 관리</span>
                    </div>
                    <i id="arrow-performance-analysis" class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                </button>
                
                <div id="performance-analysis" class="hidden overflow-hidden transition-all duration-500 space-y-1 mt-1 pl-4">
                    ${performanceItems
                        .map(
                            (item) => {
                                const isPortfolios = item.onlySidebar === true;
                                const href = isPortfolios ? '/teacher/portfolios' : `/teacher/courses?tab=${item.tab}`;
                                const active = isPortfolios ? activeMenu === 'portfolios' : activeSubMenu === item.tab;
                                return `<a href="${href}" class="flex items-center px-5 py-3 rounded-xl transition-all duration-300 group ${active ? 'text-blue-400 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                        <i class="fas ${item.icon} w-6 text-xs transition-colors"></i>
                        <span class="font-bold text-[13px]">${item.label}</span>
                    </a>`;
                            }
                        )
                        .join('\n                    ')}
                </div>
            </div>
        </div>

        <!-- 커뮤니티 및 기타 -->
        <div class="space-y-3">
            <div class="px-5 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">기타 관리</span>
            </div>
            <div class="space-y-1.5">
                <a href="/teacher/posts" class="flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group ${activeMenu === 'posts' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-comments text-sm ${activeMenu === 'posts' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">커뮤니티 관리</span>
                </a>
            </div>
        </div>

        <!-- 설정 -->
        <div class="space-y-3 pb-8">
            <div class="px-5 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-600 shadow-[0_0_8px_rgba(75,85,99,0.5)]"></span>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">설정 및 정보</span>
            </div>
            <div class="space-y-1.5">
                <a href="/teacher/profile" class="flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group ${activeMenu === 'profile' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-user-gear text-sm ${activeMenu === 'profile' ? 'text-white' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">강사 프로필 수정</span>
                </a>
                <a href="/" class="flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group text-gray-400 hover:bg-white/5 hover:text-white">
                    <div class="w-8 flex justify-center">
                        <i class="fas fa-home text-sm text-gray-400 group-hover:text-blue-400 transition-colors"></i>
                    </div>
                    <span class="font-black text-sm tracking-tight">홈페이지로 이동</span>
                </a>
            </div>
        </div>
    </nav>
    
    <!-- 하단 프로필 세션 (Bento Style) -->
    <div class="p-6 mt-auto relative z-20">
        <div class="p-4 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden relative group transition-all duration-500 hover:bg-white/10">
            <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-3 relative z-10">
                <div class="relative">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg" id="sidebar-teacher-initial">
                        T
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-gray-900 rounded-full shadow-sm"></div>
                </div>
                <div class="flex flex-col min-w-0">
                    <span id="sidebar-teacher-name" class="text-sm font-black text-white truncate tracking-tight">강사님</span>
                    <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mt-0.5">인증된 교수자</span>
                </div>
                <button onclick="window.logout()" class="ml-auto w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-500 border border-white/5 group/logout" title="로그아웃">
                    <i class="fas fa-sign-out-alt text-sm group-hover/logout:rotate-12 transition-transform"></i>
                </button>
            </div>
        </div>
    </div>
</aside>
</div>

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
    border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>

<script>
    // 아코디언 토글 기능
    window.toggleSidebarAccordion = function(id) {
        const el = document.getElementById(id);
        const arrow = document.getElementById('arrow-' + id);
        if (el) {
            const isHidden = el.classList.contains('hidden');
            if (isHidden) {
                el.classList.remove('hidden');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                el.classList.add('hidden');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
    };

    // 현재 활성 메뉴 확인 및 아코디언 자동 열기
    (function() {
        const activeSub = '${activeSubMenu || ''}';
        const activeMain = '${activeMenu || ''}';
        const performanceMenus = ${JSON.stringify(performanceItems.map((i) => i.tab))};
        const isPerformanceActive = performanceMenus.includes(activeSub) || activeMain === 'portfolios';
        
        if (isPerformanceActive) {
            const el = document.getElementById('performance-analysis');
            const arrow = document.getElementById('arrow-performance-analysis');
            if (el) el.classList.remove('hidden');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
    })();

    // 모바일 사이드바 토글
    (function(){
        var wrap = document.getElementById('teacherSidebarWrap');
        var backdrop = document.getElementById('teacherSidebarBackdrop');
        var toggle = document.getElementById('teacherSidebarToggle');
        function openSidebar(){ 
            wrap && wrap.classList.add('translate-x-0'); 
            wrap && wrap.classList.remove('-translate-x-full'); 
            backdrop && backdrop.classList.remove('hidden'); 
            document.body.style.overflow = 'hidden'; 
        }
        function closeSidebar(){ 
            wrap && wrap.classList.remove('translate-x-0'); 
            wrap && wrap.classList.add('-translate-x-full'); 
            backdrop && backdrop.classList.add('hidden'); 
            document.body.style.overflow = ''; 
        }
        if(toggle){ toggle.addEventListener('click', function(){ 
            wrap && wrap.classList.contains('-translate-x-full') ? openSidebar() : closeSidebar(); 
        }); }
        if(backdrop){ backdrop.addEventListener('click', closeSidebar); }
        if(wrap){ wrap.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeSidebar); }); }
    })();

    // 전역 logout 함수 정의
    window.logout = function() {
        if (confirm('로그아웃 하시겠습니까? (Confirm Logout)')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/login';
        }
    };

    (function() {
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
    })();
</script>
`;
}

