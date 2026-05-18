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
                        activeTab === 'ncs-eval-dashboard' ||
                        activeTab === 'ncs-eval-plan' ||
                        activeTab === 'ncs-eval-exec' ||
                        activeTab === 'ncs-eval-result');
                const isActive =
                    (item.path === '' && activeTab === 'dashboard') ||
                    (item.path !== '' && (activeTab === item.path || isNcsCluster));
                return `<a href="${href}" class="px-2.5 sm:px-4 md:px-6 py-3 md:py-4 transition whitespace-nowrap flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] md:text-sm shrink-0 ${isActive ? 'bg-white text-indigo-700 font-bold rounded-t-xl' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                            <i class="fas ${item.icon} text-[10px] sm:text-xs opacity-90 shrink-0"></i><span class="leading-tight">${item.label}</span>
                        </a>`;
            }
        )
        .join('\n                        ');
    return `
    <!-- Top Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50 overflow-x-hidden max-w-[100vw]">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
            <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 py-3 sm:h-auto sm:min-h-[4.5rem] sm:py-0">
                <div class="flex items-start gap-3 min-w-0 flex-1">
                    <a href="/admin" id="lms-logo-link" class="flex flex-col items-start group min-w-0">
                        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-7 sm:h-9 w-auto max-w-[min(100%,180px)] object-contain object-left">
                            <span class="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] sm:text-[10px] font-bold rounded-full shrink-0">LMS</span>
                        </div>
                        <span class="text-[11px] sm:text-sm text-gray-600 font-bold tracking-wide group-hover:text-indigo-600 transition-colors mt-0.5 truncate max-w-full">학사관리 시스템</span>
                    </a>
                </div>
                <div class="flex items-center justify-end sm:justify-end shrink-0 w-full sm:w-auto">
                    <a href="/admin/courses" id="lms-back-link" title="과정 목록으로 이동" class="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 text-gray-800 hover:text-indigo-700 font-bold text-xs sm:text-sm whitespace-nowrap touch-manipulation">
                        <i class="fas fa-arrow-left text-xs shrink-0"></i><span class="hidden sm:inline">과정 목록으로</span><span class="inline sm:hidden">목록</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Course Header & Tabs -->
    <div class="bg-gradient-to-r from-purple-700 to-indigo-800 text-white overflow-x-hidden max-w-[100vw]">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 min-w-0">
            <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-start min-w-0">
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2 py-1 bg-white/20 rounded text-[10px] sm:text-xs font-semibold shrink-0 max-w-full sm:max-w-[70%] truncate inline-block align-middle" id="header-courseCategory">카테고리</span>
                        <span class="px-2 py-1 bg-green-500 rounded text-[10px] sm:text-xs font-semibold shrink-0" id="header-courseStatus">상태</span>
                    </div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words hyphens-auto leading-snug pr-1" id="header-courseTitle">과정 정보를 불러오는 중...</h1>
                    <p class="text-purple-100 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-x-4 sm:gap-y-1 text-xs sm:text-sm min-w-0">
                        <span class="min-w-0 break-all" id="header-coursePeriod"><i class="far fa-calendar-alt mr-1 shrink-0"></i> -</span>
                        <span class="min-w-0 break-words" id="header-courseSchedule"><i class="far fa-clock mr-1 shrink-0"></i> -</span>
                    </p>
                </div>
                <div class="flex md:flex-col items-center md:items-end justify-between gap-2 md:text-right shrink-0 pt-1 md:pt-0 border-t border-white/10 md:border-t-0 mt-1 md:mt-0 md:pl-4">
                    <div class="text-2xl sm:text-3xl font-bold tabular-nums" id="header-studentCount">0</div>
                    <div class="text-xs sm:text-sm text-purple-200">수강생 수</div>
                </div>
            </div>
        </div>
        
        <!-- Tab Menu Container with Horizontal Scroll, Arrows & More -->
        <div class="mt-3 sm:mt-4 border-t border-white/10 w-full min-w-0 relative group/menu">
            <div class="flex items-stretch min-w-0">
                <!-- Left arrow: scroll left -->
                <button type="button" id="lms-tab-scroll-left" aria-label="메뉴 왼쪽으로" class="hidden shrink-0 h-11 sm:h-12 w-9 sm:w-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl transition-all z-10 touch-manipulation">
                    <i class="fas fa-chevron-left text-sm"></i>
                </button>
                <!-- Scroll area with edge gradients -->
                <div class="flex-1 min-w-0 relative">
                    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-indigo-800 to-transparent pointer-events-none z-[5] opacity-0 transition-opacity" id="lms-fade-left"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-indigo-800 to-transparent pointer-events-none z-[5] opacity-0 transition-opacity" id="lms-fade-right"></div>
                    <div class="overflow-x-auto overflow-y-hidden scrollbar-hide px-1 sm:px-2 max-w-full touch-pan-x" id="lms-tab-menu" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;">
                    <div class="flex flex-nowrap py-0 min-w-max">
                        ${tabsHtml}
                        <!-- Crucial Spacer -->
                        <div class="w-6 sm:w-12 shrink-0"></div>
                    </div>
                    </div>
                </div>

                <!-- Right arrow: scroll right -->
                <button type="button" id="lms-tab-scroll-right" aria-label="메뉴 오른쪽으로" class="hidden shrink-0 h-11 sm:h-12 w-9 sm:w-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl transition-all z-10 touch-manipulation">
                    <i class="fas fa-chevron-right text-sm"></i>
                </button>

                <!-- More Button -->
                <div class="relative pl-1 pr-2 sm:px-4 bg-indigo-800/80 backdrop-blur shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)] z-10 shrink-0">
                    <button type="button" id="lms-more-menu-btn" onclick="toggleMoreMenu(event)" aria-label="메뉴 더보기" class="h-11 w-11 sm:h-12 sm:w-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all touch-manipulation">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <!-- More Dropdown (only overflowed / hidden tabs) -->
                    <div id="lms-more-dropdown" class="hidden absolute right-2 sm:right-4 top-14 w-[min(100vw-1rem,14rem)] max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] py-2">
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
                const sessionIdKeep = urlParams.get('session_id');
                
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
                        newHref += (newHref.includes('?') ? '&' : '?') + 'type=' + encodeURIComponent(type);
                    }
                    if (newHref && sessionIdKeep) {
                        newHref += (newHref.includes('?') ? '&' : '?') + 'session_id=' + encodeURIComponent(sessionIdKeep);
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
                    const sidQ = urlParams.get('session_id');
                    let type = urlParams.get('type') || '';
                    if (typeof type !== 'string') type = '';
                    if (type && type.startsWith('hrd')) type = 'hrd';
                    if (type === 'undefined') type = '';
                    if (!type && window.location.pathname.includes('/lms')) type = 'hrd';

                    // session_id 파라미터가 있으면 HRD 전용 API로 직접 조회 (ID 충돌 완전 우회)
                    let apiUrl;
                    if (sidQ && type === 'hrd') {
                        apiUrl = '/api/hrd/sessions/' + encodeURIComponent(sidQ);
                    } else {
                        apiUrl = '/api/courses/' + courseId;
                        const apiQs = new URLSearchParams();
                        if (type) apiQs.set('type', type);
                        if (sidQ) apiQs.set('session_id', sidQ);
                        const qStr = apiQs.toString();
                        if (qStr) apiUrl += '?' + qStr;
                    }

                    let response = await fetch(apiUrl, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    // 404인 경우 기존 /api/courses/ 방식으로 폴백
                    if (response.status === 404) {
                        apiUrl = '/api/courses/' + courseId + '?type=hrd' + (sidQ ? '&session_id=' + encodeURIComponent(sidQ) : '');
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
