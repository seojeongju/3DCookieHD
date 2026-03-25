import { getLmsTabItems } from './lms_menu_config';

export const lmsHeaderHtml = (activeTab = 'dashboard', defaultType = '') => {
    const tabItems = getLmsTabItems();
    const tabsHtml = tabItems
        .map(
            (item) => {
                const href = item.path === '' ? 'dashboard' : item.path;
                const isNcsCluster =
                    item.tab === 'ncs' &&
                    (activeTab === 'ncs-eval' ||
                        activeTab === 'ncs-eval-plan' ||
                        activeTab === 'ncs-eval-exec' ||
                        activeTab === 'ncs-eval-result');
                const isActive =
                    (item.path === '' && activeTab === 'dashboard') ||
                    (item.path !== '' && (activeTab === item.path || isNcsCluster));
                return `<a href="${href}" class="px-4 md:px-6 py-4 transition whitespace-nowrap flex items-center gap-2 text-[13px] md:text-sm ${isActive ? 'bg-white text-indigo-700 font-bold rounded-t-xl' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                            <i class="fas ${item.icon}"></i> ${item.label}
                        </a>`;
            }
        )
        .join('\n                        ');
    return `
    <!-- Top Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4">
                    <a href="/admin" id="lms-logo-link" class="flex flex-col items-start group">
                        <div class="flex items-center gap-2">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                            <span class="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">LMS</span>
                        </div>
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">학사관리 시스템</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin/courses" id="lms-back-link" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>과정 목록으로
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Course Header & Tabs -->
    <div class="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 bg-white/20 rounded text-xs font-semibold" id="header-courseCategory">카테고리</span>
                        <span class="px-2 py-1 bg-green-500 rounded text-xs font-semibold" id="header-courseStatus">상태</span>
                    </div>
                    <h1 class="text-3xl font-bold mb-2" id="header-courseTitle">과정 정보를 불러오는 중...</h1>
                    <p class="text-purple-100 flex items-center gap-4 text-sm">
                        <span id="header-coursePeriod"><i class="far fa-calendar-alt mr-1"></i> -</span>
                        <span id="header-courseSchedule"><i class="far fa-clock mr-1"></i> -</span>
                    </p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold mb-1" id="header-studentCount">0</div>
                    <div class="text-sm text-purple-200">수강생 수</div>
                </div>
            </div>
        </div>
        
        <!-- Tab Menu Container with Horizontal Scroll, Arrows & More -->
        <div class="mt-4 border-t border-white/10 w-full relative group/menu">
            <div class="flex items-center">
                <!-- Left arrow: scroll left -->
                <button type="button" id="lms-tab-scroll-left" aria-label="메뉴 왼쪽으로" class="hidden flex-shrink-0 h-12 w-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10">
                    <i class="fas fa-chevron-left text-sm"></i>
                </button>
                <!-- Scroll area with edge gradients -->
                <div class="flex-1 min-w-0 relative">
                    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-indigo-800 to-transparent pointer-events-none z-[5] opacity-0 transition-opacity" id="lms-fade-left"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-indigo-800 to-transparent pointer-events-none z-[5] opacity-0 transition-opacity" id="lms-fade-right"></div>
                    <div class="overflow-x-auto scrollbar-hide px-2" id="lms-tab-menu" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;">
                    <div class="flex flex-nowrap py-0 min-w-max">
                        ${tabsHtml}
                        <!-- Crucial Spacer -->
                        <div class="w-12 flex-shrink-0"></div>
                    </div>
                    </div>
                </div>

                <!-- Right arrow: scroll right -->
                <button type="button" id="lms-tab-scroll-right" aria-label="메뉴 오른쪽으로" class="hidden flex-shrink-0 h-12 w-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10">
                    <i class="fas fa-chevron-right text-sm"></i>
                </button>

                <!-- More Button -->
                <div class="relative px-2 sm:px-4 bg-indigo-800/80 backdrop-blur shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)] z-10 block">
                    <button id="lms-more-menu-btn" onclick="toggleMoreMenu(event)" class="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <!-- More Dropdown (only overflowed / hidden tabs) -->
                    <div id="lms-more-dropdown" class="hidden absolute right-4 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] py-2">
                        <div id="lms-dropdown-title" class="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">더보기</div>
                        <div id="lms-dropdown-items" class="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <!-- Only hidden tab items will be mirrored here by script -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <style>
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>

    <script>
        var LMS_TAB_SCROLL_STEP = 240;

        function updateLmsTabArrows() {
            var menu = document.getElementById('lms-tab-menu');
            var btnLeft = document.getElementById('lms-tab-scroll-left');
            var btnRight = document.getElementById('lms-tab-scroll-right');
            var fadeLeft = document.getElementById('lms-fade-left');
            var fadeRight = document.getElementById('lms-fade-right');
            if (!menu) return;
            var canScrollLeft = menu.scrollLeft > 0;
            var canScrollRight = menu.scrollLeft + menu.clientWidth < menu.scrollWidth - 1;
            if (btnLeft) {
                if (canScrollLeft) { btnLeft.classList.remove('hidden'); btnLeft.style.display = 'flex'; } else { btnLeft.classList.add('hidden'); btnLeft.style.display = 'none'; }
            }
            if (btnRight) {
                if (canScrollRight) { btnRight.classList.remove('hidden'); btnRight.style.display = 'flex'; } else { btnRight.classList.add('hidden'); btnRight.style.display = 'none'; }
            }
            if (fadeLeft) fadeLeft.style.opacity = canScrollLeft ? '1' : '0';
            if (fadeRight) fadeRight.style.opacity = canScrollRight ? '1' : '0';
        }

        function scrollLmsTabs(direction) {
            var menu = document.getElementById('lms-tab-menu');
            if (!menu) return;
            var step = typeof LMS_TAB_SCROLL_STEP === 'number' ? LMS_TAB_SCROLL_STEP : 240;
            menu.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
        }

        window.toggleMoreMenu = function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('lms-more-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('hidden');
                if (!dropdown.classList.contains('hidden')) {
                    mirrorTabsToDropdown();
                }
            }
        };

        function mirrorTabsToDropdown() {
            const tabMenu = document.getElementById('lms-tab-menu');
            const dropdownContainer = document.getElementById('lms-dropdown-items');
            if (!tabMenu || !dropdownContainer) return;

            const containerRect = tabMenu.getBoundingClientRect();
            const tabs = Array.from(tabMenu.querySelectorAll('a'));

            const overflowedTabs = tabs.filter(tab => {
                const r = tab.getBoundingClientRect();
                const overlaps = r.left < containerRect.right && r.right > containerRect.left;
                return !overlaps;
            });

            let html = '';
            if (overflowedTabs.length === 0) {
                html = '<div class="px-5 py-4 text-sm text-gray-400 text-center">모든 메뉴가 표시 중입니다.</div>';
            } else {
                overflowedTabs.forEach(tab => {
                    const isActive = tab.classList.contains('bg-white');
                    const href = tab.getAttribute('href');
                    const content = tab.innerHTML;
                    html += '<a href="' + href + '" class="flex items-center gap-3 px-5 py-3 text-sm transition-colors ' + (isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50') + '">' +
                            content +
                            '</a>';
                });
            }
            dropdownContainer.innerHTML = html;
        }

        document.addEventListener('click', () => {
            const dropdown = document.getElementById('lms-more-dropdown');
            if (dropdown) dropdown.classList.add('hidden');
        });

        (function() {
            var menu = document.getElementById('lms-tab-menu');
            var btnLeft = document.getElementById('lms-tab-scroll-left');
            var btnRight = document.getElementById('lms-tab-scroll-right');
            if (btnLeft) btnLeft.addEventListener('click', function() { scrollLmsTabs('left'); });
            if (btnRight) btnRight.addEventListener('click', function() { scrollLmsTabs('right'); });
            if (menu) {
                menu.addEventListener('scroll', updateLmsTabArrows);
                window.addEventListener('resize', updateLmsTabArrows);
                updateLmsTabArrows();
            }

            setTimeout(function() {
                var container = document.getElementById('lms-tab-menu');
                if (container) {
                    var activeTab = container.querySelector('.bg-white');
                    if (activeTab) {
                        activeTab.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
                    }
                    updateLmsTabArrows();
                }
            }, 300);
            function updateLmsLinks() {
                const userStr = localStorage.getItem('user');
                const logoLink = document.getElementById('lms-logo-link');
                const backLink = document.getElementById('lms-back-link');
                
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        if (user.role === 'teacher') {
                            if (logoLink) logoLink.setAttribute('href', '/teacher');
                            if (backLink) backLink.setAttribute('href', '/teacher/courses');
                        } else if (user.role === 'student' || user.role === 'user') {
                            if (logoLink) logoLink.setAttribute('href', '/student');
                            if (backLink) backLink.setAttribute('href', '/student');
                        } else if (user.role === 'admin') {
                            if (logoLink) logoLink.setAttribute('href', '/admin');
                            if (backLink) backLink.setAttribute('href', '/admin/courses');
                        }
                    } catch(e) {}
                }

                const pathParts = window.location.pathname.split('/');
                const courseIdIndex = pathParts.indexOf('courses') + 1;
                const rawId = pathParts[courseIdIndex];
                const courseId = rawId ? parseInt(rawId) : rawId;
                if (!courseId) return;

                const tabs = document.querySelectorAll('#lms-tab-menu a');
                const isAdminPath = window.location.pathname.startsWith('/admin');
                const isTeacherPath = window.location.pathname.startsWith('/teacher');
                
                const urlParams = new URLSearchParams(window.location.search);
                let type = urlParams.get('type') || '';
                if (type && type.startsWith('hrd')) type = 'hrd';
                if (type === 'undefined' || !type) type = window.location.pathname.includes('/lms') ? 'hrd' : '';
                
                const basePath = isAdminPath ? '/admin/courses/' + courseId + '/lms' : 
                               (isTeacherPath ? '/teacher/courses/' + courseId + '/lms' : '/student/courses/' + courseId + '/lms');

                tabs.forEach(link => {
                    const target = link.getAttribute('href'); 
                    let newHref = '';
                    if (target === 'dashboard') {
                        newHref = basePath;
                    } else if (!target.startsWith('/')) {
                        newHref = basePath + '/' + target;
                    }

                    if (newHref && type) {
                        newHref += (newHref.includes('?') ? '&' : '?') + 'type=' + type;
                    }
                    if (newHref) link.setAttribute('href', newHref);
                });
            }

            async function loadLmsHeaderInfo() {
                const pathParts = window.location.pathname.split('/');
                const courseIdIndex = pathParts.indexOf('courses') + 1;
                const rawId = pathParts[courseIdIndex];
                const courseId = rawId ? parseInt(rawId) : rawId;
                if (!courseId) return;

                try {
                    const token = localStorage.getItem('token');
                    const urlParams = new URLSearchParams(window.location.search);
                    let type = urlParams.get('type') || '';
                    if (typeof type !== 'string') type = '';
                    
                    // LMS 페이지인 경우 기본적으로 HRD(회차) 모드로 동작
                    if (!type && window.location.pathname.includes('/lms')) {
                        type = 'hrd';
                    }
                    if (type && type.startsWith('hrd')) type = 'hrd';
                    if (type === 'undefined') type = 'hrd';

                    let apiUrl = '/api/courses/' + courseId;
                    if (type) apiUrl += '?type=' + encodeURIComponent(type);

                    let response = await fetch(apiUrl, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    // 404인 경우 HRD 회차일 수 있으므로 type=hrd로 재시도
                    if (response.status === 404) {
                        apiUrl = '/api/courses/' + courseId + '?type=hrd';
                        response = await fetch(apiUrl, {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                    }

                    const result = await response.json();
                    const titleEl = document.getElementById('header-courseTitle');

                    if (result.success) {
                        const course = result.data;
                        titleEl.textContent = course.title;
                        document.getElementById('header-courseCategory').textContent = course.category || '기타';
                        
                        const statusEl = document.getElementById('header-courseStatus');
                        const statusLabels = {
                            recruiting: '모집중',
                            in_progress: '진행중',
                            open: '진행중',
                            active: '진행중',
                            always_open: '상시모집',
                            completed: '마감',
                            closed: '종료'
                        };
                        const statusLabel = statusLabels[course.status] || (['recruiting', 'in_progress', 'open', 'active', 'always_open'].includes(course.status) ? '진행중' : '마감');
                        const isClosed = ['completed', 'closed'].includes(course.status);
                        statusEl.textContent = statusLabel;
                        statusEl.className = isClosed
                            ? 'px-2 py-1 bg-slate-500 rounded text-xs font-semibold'
                            : course.status === 'recruiting'
                                ? 'px-2 py-1 bg-blue-500 rounded text-xs font-semibold'
                                : 'px-2 py-1 bg-green-500 rounded text-xs font-semibold';

                        const start = (course.start_date||'').split('T')[0];
                        const end = (course.end_date||'').split('T')[0];
                        document.getElementById('header-coursePeriod').innerHTML = '<i class="far fa-calendar-alt mr-1"></i> ' + start + ' ~ ' + end;
                        
                        let schedule = '-';
                        if (course.days && course.days.length > 0) {
                            schedule = course.days.join(',') + ' ' + (course.start_time||'') + '~' + (course.end_time||'');
                        } else if (course.start_time || course.end_time) {
                            schedule = (course.start_time||'') + ' ~ ' + (course.end_time||'');
                        } else if (course.schedule) {
                            schedule = course.schedule;
                        }
                        document.getElementById('header-courseSchedule').innerHTML = '<i class="far fa-clock mr-1"></i> ' + schedule;
                        
                        const countEl = document.getElementById('header-studentCount');
                        if (countEl) countEl.textContent = course.current_students || course.max_students || 0;
                    } else {
                        titleEl.textContent = '회차 정보를 불러올 수 없습니다.';
                    }
                } catch(e) {
                    console.error('Header info load fail:', e);
                    const titleEl = document.getElementById('header-courseTitle');
                    if (titleEl) titleEl.textContent = '회차 정보를 불러올 수 없습니다.';
                }
            }

            async function syncUserThenInit() {
                var token = localStorage.getItem('token');
                if (token) {
                    try {
                        var r = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
                        var res = await r.json();
                        if (res && res.success && res.data) {
                            localStorage.setItem('user', JSON.stringify(res.data));
                        }
                    } catch (e) {}
                }
                updateLmsLinks();
                loadLmsHeaderInfo();
                setTimeout(updateLmsLinks, 600);
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() { syncUserThenInit(); });
            } else {
                syncUserThenInit();
            }
        })();
    </script>
`;
};
