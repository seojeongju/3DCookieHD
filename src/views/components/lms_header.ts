export const lmsHeaderHtml = (activeTab = 'dashboard', defaultType = '') => `
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
        
        <!-- Tab Menu Container with Horizontal Scroll Support -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
            <div class="flex space-x-1 overflow-x-auto scrollbar-hide py-1 pr-12" id="lms-tab-menu" style="scroll-behavior: smooth;">
                <a href="dashboard" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'dashboard' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-tachometer-alt"></i> 대시보드
                </a>
                <a href="students" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'students' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-graduate"></i> 수강생 관리
                </a>
                <a href="attendance" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'attendance' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-clock"></i> 출석 관리
                </a>
                <a href="training-logs" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'training-logs' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-book-open"></i> 훈련일지
                </a>
                <a href="assignments" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'assignments' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-tasks"></i> 과제관리
                </a>
                <a href="cbt" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'cbt' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-laptop-code"></i> 평가 및 채점
                </a>
                <a href="grades" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'grades' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-chart-bar"></i> 성적관리
                </a>
                <a href="counseling" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'counseling' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-comments"></i> 상담일지
                </a>
                <a href="ncs-eval" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'ncs-eval' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-check-double"></i> NCS평가
                </a>
                <a href="surveys" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'surveys' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-poll"></i> 설문 및 역량진단
                </a>
                <a href="employment" class="px-3 md:px-5 py-3 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm ${activeTab === 'employment' ? 'bg-white text-indigo-700 font-bold' : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-tie"></i> 취업관리
                </a>
                <!-- Spacer for scroll end visibility -->
                <div class="flex-shrink-0 w-8 h-1"></div>
            </div>
            
            <!-- Gradient Overlays for scroll indication - Fixed visibility -->
            <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-indigo-800 to-transparent pointer-events-none z-10 transition-opacity" id="scroll-edge-left"></div>
            <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-800 to-transparent pointer-events-none z-10 transition-opacity" id="scroll-edge-right"></div>
        </div>
    </div>
    
    <style>
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        #lms-tab-menu { -webkit-overflow-scrolling: touch; }
    </style>

    <script>
        (function() {
            // 스크롤 상태에 따른 그라데이션 노출 제어
            setTimeout(() => {
                const container = document.getElementById('lms-tab-menu');
                const leftEdge = document.getElementById('scroll-edge-left');
                const rightEdge = document.getElementById('scroll-edge-right');
                
                if (container && leftEdge && rightEdge) {
                    const updateScrollUI = () => {
                        const isScrollable = container.scrollWidth > container.clientWidth;
                        leftEdge.style.opacity = container.scrollLeft > 10 ? "1" : "0";
                        rightEdge.style.opacity = (container.scrollLeft + container.clientWidth < container.scrollWidth - 10) ? "1" : "0";
                    };
                    
                    container.addEventListener('scroll', updateScrollUI);
                    window.addEventListener('resize', updateScrollUI);
                    updateScrollUI();
                    
                    // 현재 활성화된 탭으로 스크롤 이동
                    const activeTab = container.querySelector('.bg-white');
                    if (activeTab) {
                        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            }, 500);
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
                        const isOpen = ['open', 'recruiting', 'active'].includes(course.status);
                        statusEl.textContent = isOpen ? '진행중' : '마감';
                        statusEl.className = isOpen ? 
                            'px-2 py-1 bg-green-500 rounded text-xs font-semibold' : 
                            'px-2 py-1 bg-red-500 rounded text-xs font-semibold';

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

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    updateLmsLinks();
                    loadLmsHeaderInfo();
                });
            } else {
                updateLmsLinks();
                loadLmsHeaderInfo();
            }
        })();
    </script>
`;
