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
        
        <!-- Tab Menu -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex space-x-1 overflow-x-auto scrollbar-hide" id="lms-tab-menu">
                <a href="dashboard" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-tachometer-alt mr-2"></i>대시보드
                </a>
                <a href="students" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'students' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-graduate mr-2"></i>수강생
                </a>
                <a href="attendance" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'attendance' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-clock mr-2"></i>출결관리
                </a>
                <a href="training-logs" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'training-logs' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-book-open mr-2"></i>훈련일지
                </a>
                <a href="assignments" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'assignments' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-tasks mr-2"></i>과제관리
                </a>
                <a href="cbt" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'cbt' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-laptop-code mr-2"></i>CBT/시험
                </a>
                <a href="grades" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'grades' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-chart-bar mr-2"></i>성적관리
                </a>
                <a href="counseling" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'counseling' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-comments mr-2"></i>상담일지
                </a>
                <a href="ncs-eval" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'ncs-eval' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-check-double mr-2"></i>NCS평가
                </a>
                <a href="surveys" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'surveys' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-poll mr-2"></i>설문/평가
                </a>
                <a href="employment" class="px-6 py-3 rounded-t-lg transition whitespace-nowrap ${activeTab === 'employment' ? 'bg-white text-purple-700 font-bold border-b-2 border-purple-700' : 'text-purple-100 hover:bg-white/10 hover:text-white font-medium'}">
                    <i class="fas fa-user-tie mr-2"></i>취업관리
                </a>
            </div>
        </div>
    </div>
    
    <style>
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>

    <script>
        (function() {
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
                const courseId = pathParts[courseIdIndex];
                if (!courseId) return;

                const tabs = document.querySelectorAll('#lms-tab-menu a');
                const isAdminPath = window.location.pathname.startsWith('/admin');
                const isTeacherPath = window.location.pathname.startsWith('/teacher');
                
                const urlParams = new URLSearchParams(window.location.search);
                let type = urlParams.get('type') || '${defaultType}';
                if (type && type.startsWith('hrd')) type = 'hrd'; // Normalize type
                
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
                const courseId = pathParts[courseIdIndex];
                if (!courseId) return;

                try {
                    const token = localStorage.getItem('token');
                    const urlParams = new URLSearchParams(window.location.search);
                    let type = urlParams.get('type') || '${defaultType}';
                    if (type && type.startsWith('hrd')) type = 'hrd'; // Normalize type
                    let apiUrl = '/api/courses/' + courseId;
                    if (type) apiUrl += '?type=' + type;

                    let response = await fetch(apiUrl, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    // 404인 경우 HRD 과정일 수 있으므로 type=hrd로 재시도
                    if (response.status === 404 && !type) {
                        apiUrl = '/api/courses/' + courseId + '?type=hrd';
                        response = await fetch(apiUrl, {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                    }

                    const result = await response.json();
                    
                    if (result.success) {
                        const course = result.data;
                        document.getElementById('header-courseTitle').textContent = course.title;
                        document.getElementById('header-courseCategory').textContent = course.category || '기타';
                        
                        const statusEl = document.getElementById('header-courseStatus');
                        statusEl.textContent = course.status === 'open' ? '진행중' : '마감';
                        statusEl.className = course.status === 'open' ? 
                            'px-2 py-1 bg-green-500 rounded text-xs font-semibold' : 
                            'px-2 py-1 bg-red-500 rounded text-xs font-semibold';

                        const start = (course.start_date||'').split('T')[0];
                        const end = (course.end_date||'').split('T')[0];
                        document.getElementById('header-coursePeriod').innerHTML = '<i class="far fa-calendar-alt mr-1"></i> ' + start + ' ~ ' + end;
                        
                        let schedule = '-';
                        if (course.days && course.days.length > 0) {
                            schedule = course.days.join(',') + ' ' + (course.start_time||'') + '~' + (course.end_time||'');
                        } else if (course.schedule) {
                            schedule = course.schedule;
                        }
                        document.getElementById('header-courseSchedule').innerHTML = '<i class="far fa-clock mr-1"></i> ' + schedule;
                        
                        const countEl = document.getElementById('header-studentCount');
                        if (countEl) countEl.textContent = course.current_students || course.max_students || 0;
                    }
                } catch(e) { console.error('Header info load fail:', e); }
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
