export const studentDashboardHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#0f172a">
    <title>나의 강의실 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'] },
            colors: {
              primary: { 50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7', 500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54' }
            },
            borderRadius: { '3xl': '1.5rem', '4xl': '2rem' }
          }
        }
      }
    </script>
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .nav-side-btn.active { background: rgb(240 249 255); color: rgb(7 89 133); }
        .nav-side-btn.active span:first-child { background: rgb(224 242 254) !important; color: rgb(2 132 199) !important; }
        @media (max-width: 768px) {
            .touch-target { min-height: 44px; min-width: 44px; }
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden flex-col">
        <!-- 상단 헤더 (반응형) -->
        <header class="sticky top-0 z-20 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white/95 backdrop-blur-md border-b border-slate-200/60 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <a href="/" class="flex-shrink-0">
                    <img src="/static/logo.png" alt="WOW 3D" class="h-7 sm:h-8 w-auto">
                </a>
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                        <span class="truncate">나의 강의실</span>
                        <span class="text-[9px] sm:text-[10px] bg-sky-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-widest font-black flex-shrink-0">학생</span>
                    </h1>
                    <p class="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase truncate">지능형 학습 관리 시스템 (학생 모드)</p>
                </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <div class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-100 rounded-xl sm:rounded-2xl border border-slate-200/60">
                    <i class="fas fa-clock text-sky-500 text-[10px] sm:text-xs"></i>
                    <span id="current-time" class="text-[10px] sm:text-xs font-black text-slate-700 tracking-tighter">00:00:00</span>
                </div>
                <button onclick="location.href='/'" class="touch-target flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/60 text-slate-500 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm font-bold text-[10px] sm:text-xs" title="홈페이지로 이동">
                    <i class="fas fa-home text-sm"></i>
                    <span class="hidden sm:inline">홈페이지로 이동</span>
                </button>
                <div class="hidden sm:block h-6 md:h-8 w-px bg-slate-200"></div>
                <div class="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-white rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-sm">
                    <div class="hidden sm:block text-right flex flex-col min-w-0 max-w-[100px] md:max-w-none">
                        <span id="userName" class="text-xs sm:text-sm font-black text-slate-900 truncate">-</span>
                        <span class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Student</span>
                    </div>
                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-200 border border-white/20 flex-shrink-0">
                        <i class="fas fa-user-graduate text-xs sm:text-sm"></i>
                    </div>
                    <button onclick="logout()" class="touch-target w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0" title="로그아웃">
                        <i class="fas fa-sign-out-alt text-sm"></i>
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            <div class="relative z-10 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
                <!-- 환영 섹션 (반응형) -->
                <section class="animate-fade-in mb-6 sm:mb-8" style="animation-delay: 0.1s">
                    <div class="bg-sky-900 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-sky-900/20">
                        <div class="absolute top-0 right-0 w-[50%] sm:w-[40%] h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                        <div class="absolute -right-10 -top-10 sm:-right-20 sm:-top-20 w-40 h-40 sm:w-80 sm:h-80 bg-sky-600/20 rounded-full blur-[60px] sm:blur-[100px]"></div>
                        <div class="relative z-10 flex flex-col gap-6 sm:gap-8">
                            <div class="min-w-0">
                                <h2 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-1 sm:mb-2 break-keep">반갑습니다, <span id="welcome-name">-</span>님.</h2>
                                <p class="text-sky-200 text-xs sm:text-sm font-medium max-w-lg leading-relaxed">나의 강의실에서 수강 중인 과정, 시험, 성적, NCS·설문·포트폴리오를 한곳에서 확인하세요.</p>
                                <div class="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                                    <div class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl flex items-center gap-2">
                                        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-100">시스템 정상</span>
                                    </div>
                                    <div class="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500/30 border border-white/10 rounded-xl sm:rounded-2xl flex items-center gap-2">
                                        <i class="fas fa-calendar-alt text-[10px] sm:text-xs text-sky-300"></i>
                                        <span id="welcome-date" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-100">-</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-[2rem] backdrop-blur-sm">
                                <div class="flex flex-1 items-center justify-around sm:justify-center gap-4 sm:gap-8">
                                    <div class="text-center">
                                        <span class="block text-[9px] sm:text-[10px] font-black uppercase text-sky-300 tracking-[0.15em] sm:tracking-[0.2em] mb-1">수강 과정</span>
                                        <span class="text-2xl sm:text-3xl font-black" id="stat-enrollments">0</span>
                                        <span class="block text-[9px] sm:text-[10px] font-black text-sky-300 uppercase mt-1">개</span>
                                    </div>
                                    <div class="w-px h-10 sm:h-12 bg-white/10 self-center hidden sm:block"></div>
                                    <div class="text-center">
                                        <span class="block text-[9px] sm:text-[10px] font-black uppercase text-sky-300 tracking-[0.15em] sm:tracking-[0.2em] mb-1">진행 중 시험</span>
                                        <span class="text-2xl sm:text-3xl font-black" id="stat-active-exams">0</span>
                                        <span class="block text-[9px] sm:text-[10px] font-black text-sky-300 uppercase mt-1">건</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 animate-fade-in" style="animation-delay: 0.2s">
                    <!-- 왼쪽: 사이드 네비게이션 (기능별 그룹) -->
                    <div class="lg:col-span-4 xl:col-span-3">
                        <div class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-4 sm:mb-6">
                            <!-- 프로필 요약 -->
                            <div class="p-4 sm:p-5 bg-gradient-to-br from-sky-50 to-slate-50 border-b border-slate-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-11 h-11 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                                        <i class="fas fa-user-graduate text-sm"></i>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p id="profileName" class="text-sm font-black text-slate-800 truncate">-</p>
                                        <p id="profileEmail" class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">-</p>
                                    </div>
                                </div>
                            </div>
                            <nav class="p-3 sm:p-4 space-y-6">
                                <!-- 학습 -->
                                <div>
                                    <p class="px-3 py-1.5 text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                        <i class="fas fa-graduation-cap opacity-70"></i> 학습
                                    </p>
                                    <div class="space-y-1">
                                        <button onclick="switchTab('dashboard')" id="btn-dashboard" class="nav-side-btn active w-full text-left px-3.5 py-3 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group">
                                            <span class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors"><i class="fas fa-th-large text-[10px]"></i></span>
                                            <span>종합 대시보드</span>
                                        </button>
                                        <button onclick="switchTab('lectures')" id="btn-lectures" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-video text-[10px]"></i></span>
                                            <span>수강 중인 강의</span>
                                        </button>
                                        <button onclick="switchTab('exams')" id="btn-exams" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-book-open text-[10px]"></i></span>
                                            <span>나의 시험</span>
                                        </button>
                                        <button onclick="switchTab('grades')" id="btn-grades" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-chart-line text-[10px]"></i></span>
                                            <span>성적/결과</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- 평가·설문 -->
                                <div>
                                    <p class="px-3 py-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                        <i class="fas fa-clipboard-check opacity-70"></i> 평가·설문
                                    </p>
                                    <div class="space-y-1">
                                        <button onclick="switchTab('surveys')" id="btn-surveys" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-poll text-[10px]"></i></span>
                                            <span>설문/평가</span>
                                        </button>
                                        <button onclick="switchTab('ncs')" id="btn-ncs" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-certificate text-[10px]"></i></span>
                                            <span>NCS 평가</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- 성과 -->
                                <div>
                                    <p class="px-3 py-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                        <i class="fas fa-trophy opacity-70"></i> 성과
                                    </p>
                                    <div class="space-y-1">
                                        <button onclick="switchTab('portfolio')" id="btn-portfolio" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-images text-[10px]"></i></span>
                                            <span>포트폴리오</span>
                                        </button>
                                        <button onclick="switchTab('employment')" id="btn-employment" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-briefcase text-[10px]"></i></span>
                                            <span>취업 성과</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- 계정 -->
                                <div class="pt-2 border-t border-slate-100">
                                    <p class="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                        <i class="fas fa-cog opacity-70"></i> 계정
                                    </p>
                                    <div class="space-y-1">
                                        <button onclick="switchTab('profile')" id="btn-profile" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                            <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors"><i class="fas fa-user-edit text-[10px]"></i></span>
                                            <span>수강생 정보</span>
                                        </button>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <!-- 오른쪽: 메인 컨텐츠 (반응형) -->
                    <div class="lg:col-span-8 xl:col-span-9 min-w-0">
                        <div class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-4 sm:mb-6">
                            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-slate-100 flex items-center gap-3 sm:gap-4 bg-slate-50/50">
                                <div id="contentTitleIcon" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-100 flex-shrink-0">
                                    <i class="fas fa-edit text-xs sm:text-sm"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h2 id="contentTitle" class="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">종합 대시보드</h2>
                                    <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">인박스 컨텐츠</p>
                                </div>
                            </div>
                            <div id="contentArea" class="p-4 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[320px] overflow-x-auto">
                                <div class="text-center py-12">
                                    <i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i>
                                    <p class="text-slate-400 font-bold text-sm mt-4 uppercase tracking-widest">로딩 중...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadProfile();
            updateWelcomeTime();
            setInterval(updateWelcomeTime, 1000);
            loadStudentStats();
            switchTab('dashboard');
        });

        async function loadStudentStats() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const [enrRes, sessionEnrRes, examRes] = await Promise.all([
                    fetch('/api/enrollments?status=approved&limit=1', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch('/api/course-sessions/me/enrollments', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch('/api/exams', { headers: { 'Authorization': 'Bearer ' + token } })
                ]);
                const enrJson = await enrRes.json();
                const sessionEnrJson = await sessionEnrRes.json().catch(() => ({ success: false, data: [] }));
                const examJson = await examRes.json();
                const legacyCount = (enrJson.success && enrJson.pagination && typeof enrJson.pagination.total === 'number') ? enrJson.pagination.total : (Array.isArray(enrJson.data) ? enrJson.data.length : 0);
                const hrdCount = (sessionEnrJson.success && Array.isArray(sessionEnrJson.data)) ? sessionEnrJson.data.length : 0;
                const enrollments = legacyCount + hrdCount;
                const examList = Array.isArray(examJson) ? examJson : (examJson.data || []);
                const activeExams = examList.filter(e => e.is_active).length;
                const statEn = document.getElementById('stat-enrollments');
                const statEx = document.getElementById('stat-active-exams');
                if (statEn) statEn.textContent = enrollments;
                if (statEx) statEx.textContent = activeExams;
            } catch (e) { console.error(e); }
        }

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
        }

        function updateWelcomeTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const timeEl = document.getElementById('current-time');
            if (timeEl) timeEl.textContent = timeStr;
            const dateEl = document.getElementById('welcome-date');
            if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
        }

        window.onload = function() {
            var token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('user');
                location.href = '/login';
                return;
            }
            fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(result) {
                    if (!result || !result.success || !result.data) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        location.href = '/login';
                        return;
                    }
                    var user = result.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    // 관리자/강사도 학사관리 메뉴에서 '학생 대시보드'로 진입할 수 있으므로 리다이렉트하지 않음
                    document.getElementById('userName').textContent = user.name || '-';
                    document.getElementById('welcome-name').textContent = user.name || '-';
                    if (user.is_initial_login === 1 || user.is_initial_login === true) {
                        var modalEl = document.getElementById('initialLoginModal');
                        if (modalEl) modalEl.classList.remove('hidden');
                    }
                    updateWelcomeTime();
                    setInterval(updateWelcomeTime, 1000);
                    loadStudentStats();
                })
                .catch(function() {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    location.href = '/login';
                });
        };

        function closeInitialModal() {
            document.getElementById('initialLoginModal').classList.add('hidden');
            
            // 앞으로 다시 띄우지 않도록 서버 또는 로컬스토리지 앱데이트 (로그인 세션 동안만 막을지 영구적으로 막을지 결정)
            // 여기서는 사용자가 '다음에 하기'를 누르면 로컬 스토리지 정보를 업데이트하여 이번 세션에서는 다시 안 뜨게 함
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                user.is_initial_login = 0;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        
        function loadProfile() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('userName').textContent = user.name || '-';
                document.getElementById('profileName').textContent = user.name || '-';
                document.getElementById('profileEmail').textContent = user.email || '-';
                const welcomeName = document.getElementById('welcome-name');
                if (welcomeName) welcomeName.textContent = user.name || '학생';
            }
        }

        // 전역 logout 함수 정의 (관리자/강사와 동일)
        window.logout = function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.href = '/login';
            }
        };
        
        function logout() {
            window.logout();
        }

        var tabLabels = { dashboard: '종합 대시보드', exams: '진행 중인 시험', lectures: '수강 중인 강의', grades: '성적/결과', ncs: 'NCS 평가', surveys: '설문/평가', portfolio: '포트폴리오', employment: '취업 성과', profile: '수강생 정보' };
        var tabIcons = { dashboard: 'fa-th-large', exams: 'fa-edit', lectures: 'fa-video', grades: 'fa-history', ncs: 'fa-certificate', surveys: 'fa-poll', portfolio: 'fa-image', employment: 'fa-user-tie', profile: 'fa-user-edit' };

        function switchTab(tab) {
            var iconEl = document.getElementById('contentTitleIcon');
            if (iconEl && tabIcons[tab]) {
                iconEl.innerHTML = '<i class="fas ' + tabIcons[tab] + ' text-sm"></i>';
            }
            var navBtnBase = 'nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group ';
            var navBtnActive = navBtnBase + 'active font-black ';
            var navBtnInactive = navBtnBase + 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 ';
            var iconBase = 'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ';
            var iconInactive = iconBase + 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 ';
            var iconActive = iconBase + 'bg-sky-100 text-sky-600 ';
            ['dashboard', 'lectures', 'exams', 'grades', 'surveys', 'portfolio', 'ncs', 'employment', 'profile'].forEach(t => {
                const btn = document.getElementById('btn-' + t);
                if (btn) {
                    var isActive = t === tab;
                    btn.className = isActive ? navBtnActive : navBtnInactive;
                    var iconSpan = btn.querySelector('span:first-child');
                    if (iconSpan) iconSpan.className = isActive ? iconActive : iconInactive;
                }
            });

            const titleEl = document.getElementById('contentTitle');
            if (titleEl) titleEl.textContent = tabLabels[tab] || tab;

            if (tab === 'dashboard') loadDashboard();
            else if (tab === 'exams') loadExams();
            else if (tab === 'lectures') loadLectures();
            else if (tab === 'grades') loadGrades();
            else if (tab === 'ncs') loadNcsStatus();
            else if (tab === 'surveys') loadStudentSurveys();
            else if (tab === 'portfolio') loadStudentPortfolios();
            else if (tab === 'employment') loadEmploymentStatus();
            else if (tab === 'profile') loadProfileEdit();
        }

        async function loadProfileEdit() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i><p class="text-slate-400 font-bold text-sm mt-4 uppercase tracking-widest">로딩 중...</p></div>';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (!result.success || !result.data) {
                    container.innerHTML = '<div class="text-center py-12 text-red-500 font-bold">사용자 정보를 불러올 수 없습니다.</div>';
                    return;
                }
                const u = result.data;
                container.innerHTML = \`
                    <div class="max-w-2xl">
                        <div class="bento-card bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm">
                            <form id="profileEditForm" onsubmit="handleProfileUpdate(event)" class="space-y-6">
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">이메일 (변경 불가)</label>
                                    <input type="text" value="\${u.email || ''}" disabled class="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl font-medium text-slate-500 cursor-not-allowed">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">이름 *</label>
                                    <input type="text" id="profileEditName" required value="\${(u.name || '').replace(/"/g, '&quot;')}" class="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium text-slate-900" placeholder="이름을 입력하세요">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">연락처</label>
                                    <input type="tel" id="profileEditPhone" value="\${(u.phone || '').replace(/"/g, '&quot;')}" class="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium text-slate-900" placeholder="010-0000-0000">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">프로필 이미지 (선택)</label>
                                    <input type="hidden" id="profileEditImage" value="\${(u.profile_image || '').replace(/"/g, '&quot;')}">
                                    <div class="flex items-center gap-4">
                                        <div onclick="document.getElementById('profileEditImageFile').click()" class="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition overflow-hidden">
                                            <i id="profileEditImagePlaceholder" class="fas fa-camera text-2xl text-slate-400 \${u.profile_image ? 'hidden' : ''}"></i>
                                            <img id="profileEditImagePreview" src="" class="w-full h-full object-cover \${u.profile_image ? '' : 'hidden'}">
                                        </div>
                                        <div class="flex-1">
                                            <button type="button" onclick="document.getElementById('profileEditImageFile').click()" class="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-[10px] text-slate-600 uppercase tracking-widest hover:bg-sky-50 hover:border-sky-200 transition">로컬에서 이미지 선택</button>
                                            <p class="text-[10px] text-slate-400 mt-2 font-bold">JPG, PNG, GIF, WEBP (최대 50MB)</p>
                                        </div>
                                    </div>
                                    <input type="file" id="profileEditImageFile" accept="image/*" class="hidden" onchange="handleProfileImageUpload(this)">
                                </div>
                                <div class="pt-4 flex gap-3">
                                    <button type="submit" class="flex-1 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-slate-900 transition">
                                        <i class="fas fa-save mr-2"></i> 저장하기
                                    </button>
                                    <button type="button" onclick="switchTab('profile'); loadProfileEdit();" class="px-6 py-3.5 border border-slate-200 rounded-2xl font-black text-[10px] text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition">초기화</button>
                                </div>
                            </form>
                        </div>
                        <p class="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">이메일은 로그인 계정으로 변경할 수 없습니다.</p>
                    </div>
                \`;
                if (u.profile_image) {
                    var preview = document.getElementById('profileEditImagePreview');
                    if (preview) { preview.src = u.profile_image; preview.classList.remove('hidden'); }
                    var placeholder = document.getElementById('profileEditImagePlaceholder');
                    if (placeholder) placeholder.classList.add('hidden');
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-12 text-red-500 font-bold">정보를 불러오는 데 실패했습니다.</div>';
            }
        }

        async function handleProfileImageUpload(input) {
            if (!input || !input.files || !input.files[0]) return;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            var fd = new FormData();
            fd.append('file', input.files[0]);
            fd.append('category', 'images');
            fd.append('folder', 'profile');
            var preview = document.getElementById('profileEditImagePreview');
            var placeholder = document.getElementById('profileEditImagePlaceholder');
            var urlInput = document.getElementById('profileEditImage');
            try {
                var res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
                var result = await res.json();
                if (result.success && result.data && result.data.url) {
                    preview.src = result.data.url;
                    preview.classList.remove('hidden');
                    if (placeholder) placeholder.classList.add('hidden');
                    urlInput.value = result.data.url;
                } else {
                    alert('이미지 업로드 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error(err);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
            input.value = '';
        }

        async function handleProfileUpdate(e) {
            e.preventDefault();
            const name = document.getElementById('profileEditName').value.trim();
            const phone = document.getElementById('profileEditPhone').value.trim() || null;
            const profile_image = document.getElementById('profileEditImage').value.trim() || null;
            if (!name) { alert('이름을 입력해 주세요.'); return; }
            try {
                const res = await fetch('/api/auth/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({ name: name, phone: phone || undefined, profile_image: profile_image || undefined })
                });
                const result = await res.json();
                if (result.success) {
                    var userStr = localStorage.getItem('user');
                    if (userStr) {
                        var user = JSON.parse(userStr);
                        user.name = result.data.name;
                        user.phone = result.data.phone;
                        user.profile_image = result.data.profile_image;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                    loadProfile();
                    alert('프로필이 수정되었습니다.');
                } else {
                    alert(result.message || '수정에 실패했습니다.');
                }
            } catch (err) {
                console.error(err);
                alert('수정 중 오류가 발생했습니다.');
            }
        }

        async function loadDashboard() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i><p class="text-slate-400 font-bold text-sm mt-4 uppercase tracking-widest">로딩 중...</p></div>';
            try {
                const token = localStorage.getItem('token');
                const [resGeneral, resSession, resExams] = await Promise.all([
                    fetch('/api/enrollments?status=approved', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch('/api/course-sessions/me/enrollments', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch('/api/exams', { headers: { 'Authorization': 'Bearer ' + token } })
                ]);
                const jsonGeneral = await resGeneral.json();
                const jsonSession = await resSession.json();
                const examsJson = await resExams.json();
                const examList = Array.isArray(examsJson) ? examsJson : (examsJson.data || []);
                const activeExams = examList.filter(function(e) { return e.is_active; });

                const generalData = jsonGeneral.success ? (jsonGeneral.data || []) : [];
                const sessionData = jsonSession.success ? (jsonSession.data || []) : [];
                const allData = [].concat(sessionData, generalData);
                allData.sort(function(a, b) { return new Date(b.enrolled_at) - new Date(a.enrolled_at); });

                var statEn = document.getElementById('stat-enrollments');
                var statEx = document.getElementById('stat-active-exams');
                if (statEn) statEn.textContent = allData.length;
                if (statEx) statEx.textContent = activeExams.length;

                var html = '';
                html += '<div class="space-y-10">';

                html += '<section><h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><i class="fas fa-video text-sky-500"></i> 수강 중인 강의</h3>';
                if (allData.length === 0) {
                    html += '<div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center"><i class="fas fa-chalkboard text-5xl text-slate-300 mb-4"></i><p class="font-bold text-slate-500 mb-2">수강 중인 강의가 없습니다.</p><a href="/course-sessions" class="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100"><i class="fas fa-search"></i> 과정 둘러보기</a></div>';
                } else {
                    html += '<div class="space-y-6">';
                    allData.forEach(function(item) {
                        var linkUrl = item.session_id ? '/student/classroom/' + item.session_id : '/courses/' + item.course_id;
                        var linkText = item.session_id ? '강의실 입장' : '과정 상세';
                        var linkIcon = item.session_id ? 'fa-door-open' : 'fa-chevron-right';
                        var thumb = item.course_thumbnail || (item.session_id ? item.main_slide_image_url : item.thumbnail_url) || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400';
                        html += '<div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition"><div class="flex flex-col md:flex-row gap-6"><div class="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative"><img src="' + thumb + '" class="w-full h-full object-cover" alt="' + (item.course_title || '') + '">' + (item.has_access_code ? '<div class="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"><i class="fas fa-lock text-xs"></i></div>' : '') + '</div><div class="flex-1 flex flex-col justify-between"><div><div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest">' + (item.course_category || '일반') + '</span><span class="text-[10px] text-slate-400 font-bold"><i class="far fa-calendar-alt mr-1"></i> ' + new Date(item.enrolled_at).toLocaleDateString() + ' 등록</span></div><h3 class="text-xl font-black text-slate-800 tracking-tight mb-2">' + (item.course_title || '') + '</h3><p class="text-sm text-slate-600 mb-4 line-clamp-2">' + (item.course_category === '국비지원' ? '국비지원 과정입니다.' : '일반 과정입니다.') + '</p></div><div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100"><div class="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><span><i class="fas fa-check-circle text-emerald-500 mr-1"></i>승인됨</span><span><i class="fas fa-school mr-1"></i>' + (item.campus_name || '홍대센터') + '</span></div><a href="' + linkUrl + '" class="text-sky-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">' + linkText + ' <i class="fas ' + linkIcon + '"></i></a></div></div></div></div>';
                    });
                    html += '</div><div class="mt-4 flex justify-end"><button type="button" onclick="switchTab(&#39;lectures&#39;)" class="text-sky-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">수강 중인 강의 전체보기 <i class="fas fa-chevron-right"></i></button></div>';
                }
                html += '</section>';

                html += '<section><h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><i class="fas fa-book-open text-sky-500"></i> 진행 중인 시험</h3>';
                if (activeExams.length === 0) {
                    html += '<div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-8 text-center"><i class="fas fa-clipboard-check text-4xl text-slate-300 mb-3"></i><p class="font-bold text-slate-500 text-sm">현재 진행 중인 시험이 없습니다.</p></div>';
                } else {
                    html += '<div class="space-y-4">';
                    activeExams.slice(0, 5).forEach(function(exam) {
                        html += '<div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest">' + (exam.course_title || '일반') + '</span><span class="text-[10px] text-slate-400 font-bold"><i class="far fa-clock mr-1"></i> ' + (exam.time_limit_minutes || exam.time_limit || 0) + '분</span></div><h3 class="text-lg font-black text-slate-800 tracking-tight">' + (exam.title || '') + '</h3><p class="text-sm text-slate-600 mt-1">' + (exam.description || '설명 없음') + '</p></div><button type="button" onclick="location.href=&#39;/student/exam/' + exam.id + '&#39;" class="px-6 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100 whitespace-nowrap flex items-center gap-2"><i class="fas fa-pen-fancy"></i> 응시하기</button></div>';
                    });
                    html += '</div><div class="mt-4 flex justify-end"><button type="button" onclick="switchTab(&#39;exams&#39;)" class="text-sky-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">나의 시험 전체보기 <i class="fas fa-chevron-right"></i></button></div>';
                }
                html += '</section>';

                html += '</div>';
                container.innerHTML = html;
            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center py-12 text-red-500 font-bold">대시보드를 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadLectures() {
            try {
                const token = localStorage.getItem('token');
                // General & HRD Enrollments 병합
                const [resGeneral, resSession] = await Promise.all([
                    fetch('/api/enrollments?status=approved', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch('/api/course-sessions/me/enrollments', { headers: { 'Authorization': 'Bearer ' + token } })
                ]);
                
                const jsonGeneral = await resGeneral.json();
                const jsonSession = await resSession.json();

                const generalData = jsonGeneral.success ? (jsonGeneral.data || []) : [];
                const sessionData = jsonSession.success ? (jsonSession.data || []) : [];

                // Format session data to match general structure if needed, or just combine
                // Session data has session_id, general has course_id.
                
                // Combine
                const allData = [...sessionData, ...generalData];
                
                // Sort by enrolled_at desc
                allData.sort((a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at));

                const container = document.getElementById('contentArea');
                const statEl = document.getElementById('stat-enrollments');
                if (statEl) statEl.textContent = allData.length;

                if (allData.length === 0) {
                    container.innerHTML = \`
                        <div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center">
                            <i class="fas fa-chalkboard text-5xl text-slate-300 mb-4"></i>
                            <p class="font-bold text-slate-500 mb-2">수강 중인 강의가 없습니다.</p>
                            <a href="/course-sessions" class="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100">
                                <i class="fas fa-search"></i> 과정 둘러보기
                            </a>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = '<div class="space-y-6">' + allData.map(item => {
                    // Determine Link and Button Text
                    let linkUrl, linkText, linkIcon;
                    if (item.session_id) {
                        // It's a Session (HRD)
                        linkUrl = '/student/classroom/' + item.session_id;
                        linkText = '강의실 입장';
                        linkIcon = 'fa-door-open';
                    } else {
                        // It's a General Course
                        linkUrl = '/courses/' + item.course_id; // Or specific LMS for general courses if exists
                        linkText = '과정 상세';
                        linkIcon = 'fa-chevron-right';
                    }

                    // Handle thumbnail
                    const thumb = item.course_thumbnail || (item.session_id ? item.main_slide_image_url : item.thumbnail_url) || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400';
                    
                    // Handle access lock icon
                    const lockIcon = (item.has_access_code) ? '<i class="fas fa-lock text-amber-500 ml-2" title="접근 코드 필요"></i>' : '';

                    return \`
                    <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                <img src="\${thumb}" class="w-full h-full object-cover" alt="\${item.course_title}">
                                \${item.has_access_code ? '<div class="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"><i class="fas fa-lock text-xs"></i></div>' : ''}
                            </div>
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest">\${item.course_category || '일반'}</span>
                                        <span class="text-[10px] text-slate-400 font-bold"><i class="far fa-calendar-alt mr-1"></i> \${new Date(item.enrolled_at).toLocaleDateString()} 등록</span>
                                    </div>
                                    <h3 class="text-xl font-black text-slate-800 tracking-tight mb-2">\${item.course_title} \${lockIcon}</h3>
                                    <p class="text-sm text-slate-600 mb-4 line-clamp-2">\${item.course_category === '국비지원' ? '국비지원 과정입니다.' : '일반 과정입니다.'}</p>
                                </div>
                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <div class="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <span><i class="fas fa-check-circle text-emerald-500 mr-1"></i>승인됨</span>
                                        <span><i class="fas fa-school mr-1"></i>\${item.campus_name || '홍대센터'}</span>
                                    </div>
                                    <a href="\${linkUrl}" class="text-sky-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                                        \${linkText} <i class="fas \${linkIcon}"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                \`}).join('') + '</div>';
            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center py-12 text-red-500 font-bold">강의 목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exams = await response.json();
                const examList = Array.isArray(exams) ? exams : (exams.data || []);
                const container = document.getElementById('contentArea');
                const activeExams = examList.filter(e => e.is_active);

                const statEl = document.getElementById('stat-active-exams');
                if (statEl) statEl.textContent = activeExams.length;

                if (activeExams.length === 0) {
                    container.innerHTML = \`
                        <div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center">
                            <i class="fas fa-clipboard-check text-5xl text-slate-300 mb-4"></i>
                            <p class="font-bold text-slate-500">현재 진행 중인 시험이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = '<div class="space-y-6">' + activeExams.map(exam => \`
                    <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest">\${exam.course_title || '일반'}</span>
                                <span class="text-[10px] text-slate-400 font-bold"><i class="far fa-clock mr-1"></i> \${exam.time_limit_minutes || exam.time_limit || 0}분</span>
                            </div>
                            <h3 class="text-lg font-black text-slate-800 tracking-tight">\${exam.title}</h3>
                            <p class="text-sm text-slate-600 mt-1">\${exam.description || '설명 없음'}</p>
                        </div>
                        <button onclick="location.href='/student/exam/\${exam.id}'" class="px-6 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100 whitespace-nowrap flex items-center gap-2">
                            <i class="fas fa-pen-fancy"></i> 응시하기
                        </button>
                    </div>
                \`).join('') + '</div>';
            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center py-12 text-red-500 font-bold">목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadGrades() {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await fetch('/api/exams/my-results?student_id=' + user.id, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const results = Array.isArray(result) ? result : (result.data || []);
                
                const container = document.getElementById('contentArea');

                if (results.length === 0) {
                    container.innerHTML = \`
                        <div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center">
                            <i class="fas fa-folder-open text-5xl text-slate-300 mb-4"></i>
                            <p class="font-bold text-slate-500">응시한 시험 기록이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = '<div class="space-y-6">' + results.map(r => {
                    const scorePercent = (r.total_points ? (r.score / r.total_points) * 100 : 0);
                    let badgeClass = 'bg-slate-100 text-slate-800';
                    let statusText = '완료';
                    if (scorePercent >= 80) { badgeClass = 'bg-emerald-100 text-emerald-800'; statusText = '우수'; }
                    else if (scorePercent < 60) { badgeClass = 'bg-rose-100 text-rose-800'; statusText = '재시험 필요'; }
                    return \`
                        <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">\${r.course_title || '일반'}</span>
                                    <h3 class="text-lg font-black text-slate-800 tracking-tight">\${r.exam_title}</h3>
                                    <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">제출일: \${new Date(r.submitted_at).toLocaleString()}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${badgeClass}">\${statusText}</span>
                            </div>
                            <div class="flex items-end justify-between border-t border-slate-100 pt-4">
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">총점</p>
                                    <p class="text-2xl font-black text-slate-900">\${r.score} <span class="text-sm text-slate-400 font-bold">/ \${r.total_points}</span></p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">백분율</p>
                                    <p class="text-lg font-black text-sky-600">\${scorePercent.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    \`;
                }).join('') + '</div>';

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">성적을 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadNcsStatus() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const container = document.getElementById('contentArea');
                
                // 1. Fetch My Results
                const resResults = await fetch('/api/ncs/my-results?studentId=' + user.id);
                const dataResults = await resResults.json();
                
                // 2. Fetch Active Plans (for evidence upload)
                const resPlans = await fetch('/api/ncs/my-plans?studentId=' + user.id);
                const dataPlans = await resPlans.json();

                let html = \`
                    <div class="space-y-8">
                        <section>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span class="w-1 h-5 bg-sky-600 rounded"></span> 평가 결과 및 이수 현황
                            </h3>
                            <div class="grid grid-cols-1 gap-4">
                \`;

                if (dataResults.success && dataResults.data.length > 0) {
                    html += dataResults.data.map(r => \`
                        <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <div class="text-xs text-gray-400 font-medium mb-1">\${r.course_title}</div>
                                    <h4 class="font-bold text-gray-800">[\${r.unit_code}] \${r.unit_name}</h4>
                                </div>
                                <span class="px-2 py-1 \${r.is_passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-bold rounded">
                                    \${r.is_passed ? 'PASS' : 'FAIL'}
                                </span>
                            </div>
                            <div class="flex items-center gap-6 pt-3 border-t border-gray-50">
                                <div>
                                    <div class="text-[10px] text-gray-400">평가방법</div>
                                    <div class="text-sm font-medium">\${r.method}</div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-gray-400">득점</div>
                                    <div class="text-sm font-bold \${r.score >= r.target_score ? 'text-blue-600' : 'text-red-500'}">\${r.score}점</div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-gray-400">기준점수</div>
                                    <div class="text-sm font-medium">\${r.target_score}점</div>
                                </div>
                            </div>
                            \${r.feedback ? \`
                                <div class="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed italic border-l-2 border-gray-200">
                                    <i class="fas fa-quote-left mr-1 opacity-30"></i> \${r.feedback}
                                </div>
                            \` : ''}
                        </div>
                    \`).join('');
                } else {
                    html += '<div class="bento-card bg-slate-50 rounded-[2rem] p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 font-bold">아직 평가된 내역이 없습니다.</div>';
                }

                html += \`
                            </div>
                        </section>

                        <section class="mt-8">
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span class="w-1 h-5 bg-purple-600 rounded"></span> 증빙 자료 (포트폴리오) 제출
                            </h3>
                            <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                                <table class="w-full text-left">
                                    <thead class="bg-slate-50/80 border-b border-slate-100">
                                        <tr>
                                            <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">평가 예정 항목</th>
                                            <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">상태</th>
                                            <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32 text-right">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-50">
                \`;

                if (dataPlans.success && dataPlans.data.length > 0) {
                    html += dataPlans.data.map(p => \`
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-5">
                                <div class="text-[10px] text-sky-600 font-black uppercase tracking-widest mb-1">\${p.course_title}</div>
                                <div class="text-sm font-bold text-slate-800">[\${p.unit_code}] \${p.unit_name}</div>
                                <div class="flex flex-wrap gap-3 mt-2">
                                    <span class="text-[10px] text-slate-400 font-bold flex items-center gap-1"><i class="far fa-calendar-alt"></i> 예정: \${p.planned_date || '미정'}</span>
                                    <span class="text-[10px] text-slate-400 font-bold flex items-center gap-1"><i class="fas fa-vial"></i> 방법: \${p.method}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <div id="status-plan-\${p.id}" class="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    확인 중...
                                </div>
                            </td>
                            <td class="px-6 py-5 text-right">
                                <button onclick="openUploadModal(\${p.id}, '\${p.unit_name}', '\${p.course_title} - \${p.unit_name}')" class="px-4 py-2 bg-sky-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100 whitespace-nowrap">
                                    <i class="fas fa-upload mr-1"></i> 자료제출
                                </button>
                            </td>
                        </tr>
                    \`).join('');
                } else {
                    html += '<tr><td colspan="3" class="px-6 py-12 text-center text-slate-400 text-sm font-bold">진행 중인 평가 계획이 없습니다.</td></tr>';
                }

                html += \`
                                    </tbody>
                                </table>
                            </div>
                            <p class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                <i class="fas fa-info-circle mr-1 text-sky-500"></i> 실기 및 프로젝트 과제물은 클라우드 링크(Google Drive 등)를 통해 제출해 주세요. 제출 후 담당 강사가 확인 및 채점을 진행합니다.
                            </p>
                        </section>
                    </div>

                    <!-- 업로드 모달 (벤토 스타일) -->
                    <div id="uploadModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm hidden z-[70] flex items-center justify-center p-4">
                        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden">
                            <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-slate-900">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-100">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black tracking-tight uppercase text-sm">증빙 자료 제출</h3>
                                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">NCS 실기/과제 평가</p>
                                    </div>
                                </div>
                                <button onclick="closeUploadModal()" class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><i class="fas fa-times"></i></button>
                            </div>
                            <div class="p-8 space-y-6">
                                <input type="hidden" id="uploadPlanId">
                                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">대상 능력단위</label>
                                    <div id="uploadUnitName" class="text-sm font-black text-slate-800 tracking-tight leading-tight"></div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">제출물 제목 *</label>
                                    <input type="text" id="uploadFileName" placeholder="예: [과제1] 캐릭터 모델링 결과물" class="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium text-slate-900 transition">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">파일/링크 URL *</label>
                                    <input type="text" id="uploadFileUrl" placeholder="구글 드라이브, Notion 링크 등" class="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium text-slate-900 transition">
                                      <p class="text-[9px] text-slate-400 mt-2 font-bold leading-relaxed">자료가 여러 개인 경우 공유 폴더 링크를 제출해 주세요. 권한 설정(링크가 있는 모든 사용자가 보기 가능)을 반드시 확인해 주세요.</p>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">학생 의견/설명</label>
                                    <textarea id="uploadComment" rows="3" placeholder="제출물에 대한 설명을 적어주세요..." class="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium text-slate-900 transition"></textarea>
                                </div>
                                <div class="pt-2">
                                    <button onclick="submitEvidence()" class="w-full py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-slate-900 transition shadow-xl shadow-sky-100 uppercase text-xs tracking-widest">
                                        <i class="fas fa-check-circle mr-2"></i> 제출 완료하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;

                container.innerHTML = html;

                // Load check status for each plan
                if (dataPlans.success) {
                    dataPlans.data.forEach(p => checkEvidenceStatus(p.id));
                }

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">NCS 정보를 불러오는데 실패했습니다.</div>';
            }
        }

        async function checkEvidenceStatus(planId) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await fetch(\`/api/ncs/evidence?planId=\${planId}&studentId=\${user.id}\`);
                const result = await res.json();
                const statusSpan = document.getElementById('status-plan-' + planId);
                if (result.success && result.data.length > 0) {
                    statusSpan.innerHTML = '<i class="fas fa-check-circle mr-1 text-emerald-500"></i> 제출완료';
                    statusSpan.className = 'inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest';
                } else {
                    statusSpan.textContent = '미제출';
                    statusSpan.className = 'inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-[10px] font-black text-rose-500 uppercase tracking-widest';
                }
            } catch (e) { console.error(e); }
        }

        async function submitEvidence() {
            var elPlanId = document.getElementById('uploadPlanId');
            var elFileName = document.getElementById('uploadFileName');
            var elFileUrl = document.getElementById('uploadFileUrl');
            var elComment = document.getElementById('uploadComment');
            const planId = elPlanId ? elPlanId.value : '';
            const fileName = elFileName ? elFileName.value : '';
            const fileUrl = elFileUrl ? elFileUrl.value : '';
            const comment = elComment ? elComment.value : '';
            const user = JSON.parse(localStorage.getItem('user'));

            if (!fileName) return alert('제출물 제목을 입력해주세요.');
            if (!fileUrl) return alert('파일 URL 또는 링크를 입력해주세요.');

            try {
                const res = await fetch('/api/ncs/evidence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({
                        plan_id: parseInt(planId),
                        student_id: user.id,
                        file_name: fileName,
                        file_url: fileUrl,
                        file_type: 'link',
                        comment: comment
                    })
                });
                const result = await res.json();
                if (result.success) {
                    alert('성공적으로 제출되었습니다.');
                    closeUploadModal();
                    loadNcsStatus();
                } else {
                    alert(result.error || '제출에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('자료 제출 중 오류가 발생했습니다.');
            }
        }

        function openUploadModal(planId, unitName, defaultFileName = '') {
            var elPlanId = document.getElementById('uploadPlanId'); if (elPlanId) elPlanId.value = planId;
            document.getElementById('uploadUnitName').textContent = unitName;
            var elFileName = document.getElementById('uploadFileName'); if (elFileName) elFileName.value = defaultFileName;
            var elFileUrl = document.getElementById('uploadFileUrl'); if (elFileUrl) elFileUrl.value = '';
            var elComment = document.getElementById('uploadComment'); if (elComment) elComment.value = '';
            document.getElementById('uploadModal').classList.remove('hidden');
        }

        function closeUploadModal() { document.getElementById('uploadModal').classList.add('hidden'); }

        // --- 포트폴리오 기능 ---
        let myEnrollments = [];

        async function loadStudentPortfolios() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i></div>';

            try {
                // 1. 참여중인 과정 로드 (모달용)
                const enrollRes = await fetch('/api/enrollments?status=approved', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const enrollData = await enrollRes.json();
                if (enrollData.success) myEnrollments = enrollData.data;

                // 2. 포트폴리오 데이터 로드
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await fetch(\`/api/posts?category=portfolio&author_id=\${user.id}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                
                let html = \`
                    <div class="flex justify-end mb-6">
                        <button onclick="openPortfolioModal()" class="px-6 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition flex items-center gap-2 shadow-lg shadow-sky-100">
                            <i class="fas fa-plus"></i> 새 포트폴리오 추가
                        </button>
                    </div>
                \`;

                if (result.success && result.results && result.results.length > 0) {
                    html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">';
                    result.results.forEach(p => {
                        const thumbnail = (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : (typeof p.images === 'string' && p.images.startsWith('[') ? JSON.parse(p.images)[0] : null);
                        html += \`
                            <div class="bento-card bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden group hover:border-sky-200 transition">
                                <div class="relative h-40 overflow-hidden">
                                    <img src="\${thumbnail || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                    <div class="absolute top-3 right-3 px-2 py-1 bg-white/95 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-wider shadow-sm">\${p.sub_category || '기타'}</div>
                                </div>
                                <div class="p-6">
                                    <h4 class="font-black text-slate-800 mb-1 line-clamp-1 tracking-tight">\${p.title}</h4>
                                    <p class="text-sm text-slate-500 mb-4 line-clamp-2">\${p.description || '설명이 없습니다.'}</p>
                                    <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                                        <a href="\${p.content_url || '#'}" target="_blank" class="text-[10px] font-black text-sky-600 hover:text-slate-900 uppercase tracking-widest flex items-center gap-1">
                                            <i class="fas fa-link"></i> 링크보기
                                        </a>
                                        <button onclick="deletePortfolio(\${p.id})" class="text-slate-300 hover:text-red-500 transition p-2 rounded-xl hover:bg-red-50"><i class="fas fa-trash-alt text-sm"></i></button>
                                    </div>
                                </div>
                            </div>
                        \`;
                    });
                    html += '</div>';
                } else {
                    html += '<div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 py-20 text-center font-bold text-slate-500">등록된 포트폴리오가 없습니다.</div>';
                }
                container.innerHTML = html;
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-12 text-red-500">데이터를 불러오는 데 실패했습니다.</div>';
            }
        }

        function openPortfolioModal() {
            const courseSelect = document.getElementById('portfolioCourseId');
            courseSelect.innerHTML = '<option value="">소속 과정 선택 (선택사항)</option>' + 
                myEnrollments.map(e => \`<option value="\${e.course_id}">\${e.course_title}</option>\`).join('');
            
            document.getElementById('portfolioModal').classList.remove('hidden');
        }

        function closePortfolioModal() { document.getElementById('portfolioModal').classList.add('hidden'); }

        async function handleSavePortfolio(e) {
            e.preventDefault();
            const data = {
                title: document.getElementById('portfolioTitle').value,
                description: document.getElementById('portfolioDescription').value,
                thumbnail_url: document.getElementById('portfolioThumbnail').value,
                content_url: document.getElementById('portfolioContent').value,
                category: document.getElementById('portfolioCategory').value,
                course_id: document.getElementById('portfolioCourseId').value || null
            };

            try {
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({
                        title: data.title,
                        content: data.description,
                        category: 'portfolio',
                        sub_category: data.category,
                        images: data.thumbnail_url ? [data.thumbnail_url] : [],
                        content_url: data.content_url,
                        course_id: data.course_id
                    })
                });
                const result = await res.json();
                if (result.success) {
                    alert('포트폴리오가 등록되었습니다.');
                    closePortfolioModal();
                    loadStudentPortfolios();
                } else {
                    alert('등록 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) { 
                console.error(e); 
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        async function deletePortfolio(id) {
            if (!confirm('정말 삭제하시겠습니까?')) return;
            try {
                const res = await fetch(\`/api/posts/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    loadStudentPortfolios();
                } else {
                    alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) { 
                console.error(e); 
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function loadEmploymentStatus() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i></div>';

            try {
                const res = await fetch('/api/hrd/my-employment', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                
                if (result.success && result.data.length > 0) {
                    let html = '<div class="space-y-6">';
                    result.data.forEach(item => {
                        let statusText = ''; let statusClass = '';
                        switch(item.status) {
                            case 'employed': statusText = '취업 완료'; statusClass = 'bg-emerald-100 text-emerald-700'; break;
                            case 'seeking': statusText = '구직 중'; statusClass = 'bg-orange-100 text-orange-700'; break;
                            case 'further_education': statusText = '진학'; statusClass = 'bg-sky-100 text-sky-700'; break;
                            case 'military': statusText = '군입대'; statusClass = 'bg-slate-100 text-slate-700'; break;
                            default: statusText = '기타/미정'; statusClass = 'bg-slate-50 text-slate-400';
                        }
                        html += \`
                            <div class="bento-card bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-6 hover:border-sky-200 transition">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 class="font-black text-slate-800 text-lg tracking-tight">\${item.course_title}</h4>
                                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">이 과정에 대한 나의 현재 취업 정보입니다.</p>
                                    </div>
                                    <span class="px-3 py-1 \${statusClass} text-[10px] font-black rounded-full uppercase tracking-widest">\${statusText}</span>
                                </div>
                                <div class="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100">
                                    <div><div class="text-[10px] text-slate-400 uppercase font-black mb-1">취업처</div><div class="text-sm font-bold text-slate-700">\${item.company_name || '-'}</div></div>
                                    <div><div class="text-[10px] text-slate-400 uppercase font-black mb-1">직무</div><div class="text-sm font-bold text-slate-700">\${item.job_title || '-'}</div></div>
                                    <div><div class="text-[10px] text-slate-400 uppercase font-black mb-1">취업일자</div><div class="text-sm font-bold text-slate-700">\${item.employment_date || '-'}</div></div>
                                    <div><div class="text-[10px] text-slate-400 uppercase font-black mb-1">보험가입</div><div class="text-sm font-bold text-slate-700">\${item.insurance_covered ? '가입됨' : '미가입/미확인'}</div></div>
                                </div>
                                <div class="flex justify-end">
                                    <button onclick="openEmploymentModal(\${JSON.stringify(item).replace(/"/g, '&quot;')})" class="px-5 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-sky-100">정보 업데이트</button>
                                </div>
                            </div>
                        \`;
                    });
                    html += '</div>';
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 py-20 text-center font-bold text-slate-500">수강 승인된 과정이 없어 취업 정보를 등록할 수 없습니다.</div>';
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-12 text-red-500">데이터를 불러오는 데 실패했습니다.</div>';
            }
        }

        function openEmploymentModal(item) {
            document.getElementById('empCourseId').value = item.course_id;
            document.getElementById('empCourseTitle').textContent = item.course_title;
            document.getElementById('empStatus').value = item.status || 'seeking';
            document.getElementById('empCompanyName').value = item.company_name || '';
            document.getElementById('empJobTitle').value = item.job_title || '';
            document.getElementById('empDate').value = item.employment_date || '';
            document.getElementById('empInsurance').checked = !!item.insurance_covered;
            document.getElementById('empNotes').value = item.notes || '';
            document.getElementById('employmentModal').classList.remove('hidden');
        }

        function closeEmploymentModal() { document.getElementById('employmentModal').classList.add('hidden'); }

        async function loadStudentSurveys() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i><p class="mt-4 text-slate-500 font-bold">설문 목록을 불러오는 중...</p></div>';

            try {
                const token = localStorage.getItem('token');
                if (!token) { container.innerHTML = '<div class="text-center text-red-500">로그인이 필요합니다.</div>'; return; }
                const res = await fetch('/api/surveys/my-pending', { headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                const surveys = (json && json.success && Array.isArray(json.data)) ? json.data : [];

                if (surveys.length === 0) {
                    container.innerHTML = '<div class="bento-card bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center"><i class="fas fa-poll text-5xl text-slate-300 mb-4"></i><p class="font-bold text-slate-500">진행 중인 설문이 없습니다.</p></div>';
                    return;
                }

                const startStr = function(s) { return (s.start_date || '').split('T')[0]; };
                const endStr = function(s) { return (s.end_date || '').split('T')[0]; };
                const courseTitle = function(s) { return s.course_title || '-'; };
                const typeLabel = function(s) { return s.type === 'diagnosis' ? '역량진단' : (s.type === 'post_lecture' ? '강의후설문' : '설문조사'); };
                const typeClass = function(s) { return s.type === 'diagnosis' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'; };

                container.innerHTML = '<div class="space-y-6">' + surveys.map(function(s) {
                    var isPending = (s.response_status || '') === 'pending';
                    var badgeClass = isPending ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700';
                    var statusText = isPending ? '미참여' : '완료됨';
                    var btnClass = isPending ? 'px-6 py-3 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 shadow-lg shadow-sky-100 cursor-pointer' : 'px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase cursor-not-allowed';
                    var safeTitle = String(s.title || '-').replace(new RegExp('<', 'g'), '&lt;').replace(/"/g, '&quot;');
                    var safeCourse = String(courseTitle(s)).replace(new RegExp('<', 'g'), '&lt;').replace(/"/g, '&quot;');
                    return '<div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:border-sky-200 transition">' +
                        '<div class="flex flex-col md:flex-row justify-between items-center gap-4">' +
                        '<div class="flex-1">' +
                        '<div class="flex items-center gap-2 mb-2">' +
                        '<span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest">' + safeCourse + '</span>' +
                        '<span class="px-2 py-0.5 ' + typeClass(s) + ' text-[10px] font-black rounded-full uppercase tracking-widest">' + typeLabel(s) + '</span>' +
                        '</div>' +
                        '<h3 class="text-lg font-black text-slate-800 tracking-tight">' + safeTitle + '</h3>' +
                        '<p class="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider"><i class="far fa-calendar-alt mr-1"></i> ' + startStr(s) + ' ~ ' + endStr(s) + '</p>' +
                        '</div>' +
                        '<div class="flex items-center gap-4">' +
                        '<span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ' + badgeClass + '">' + statusText + '</span>' +
                        (isPending ? '<button type="button" onclick="openSurveyForm(' + s.id + ')" class="' + btnClass + '">참여하기</button>' : '<span class="' + btnClass + '">완료</span>') +
                        '</div></div></div>';
                }).join('') + '</div>';
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center text-red-500">목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function openSurveyForm(surveyId) {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i><p class="mt-4 text-slate-500 font-bold">설문을 불러오는 중...</p></div>';
            var token = localStorage.getItem('token');
            if (!token) { container.innerHTML = '<div class="text-center text-red-500">로그인이 필요합니다.</div>'; return; }
            try {
                var res = await fetch('/api/surveys/' + surveyId, { headers: { 'Authorization': 'Bearer ' + token } });
                var json = await res.json();
                if (!json || !json.success || !json.data) {
                    container.innerHTML = '<div class="text-center text-red-500">설문을 불러올 수 없습니다.</div><button type="button" onclick="loadStudentSurveys()" class="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">목록으로</button>';
                    return;
                }
                var survey = json.data;
                var questions = survey.questions || [];

                // 날짜 포맷
                var d = survey.created_at ? new Date(survey.created_at) : new Date();
                var y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
                var dayNames = ['일','월','화','수','목','금','토'];
                var dateStr = y + '. ' + m + '. ' + day + '. (' + dayNames[d.getDay()] + ')';

                var scaleLabels = ['매우 아니다','아니다','보통','그렇다','매우 그렇다'];

                // 4개 섹션 정의 (관리자 미리보기와 동일)
                var sections = [
                    { title: '교육만족도', start: 0, end: 3, isText: false },
                    { title: '솔루션 평가 및 강사 평가', start: 3, end: 6, isText: false },
                    { title: '교육내용평가', start: 6, end: 10, isText: false },
                    { title: '전반적인 교육 소감을 구체적으로 작성하여 주시기 바랍니다.', start: 10, end: 11, isText: true }
                ];

                var safeTitle = (survey.title || '강의 후 설문지').replace(/</g, '&lt;');
                var courseTitle = (survey.course_title || '-').replace(/</g, '&lt;');
                var subjectTitle = (survey.subject_title || survey.course_title || '-').replace(/</g, '&lt;');
                var teacherName = survey.teacher_name || '-';

                var html = '<button type="button" onclick="loadStudentSurveys()" class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition"><i class="fas fa-arrow-left"></i> 목록으로</button>';
                html += '<div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">';
                html += '<div class="p-8 md:p-10">';
                html += '<h1 class="text-2xl md:text-3xl font-black text-center text-gray-900 mb-4">' + safeTitle + '</h1>';
                var safeDesc = (survey.description || '수고하셨습니다.\n이 설문지는 오늘 배운 교과목에 대한 전반적인 사항을 객관적으로 파악하고, 이를 토대로 앞으로 교육을 하는데 기초 자료로 활용하고자 하는 것이 목적입니다. 여러분의 솔직하고 진지한 평가가 차후 보다 나은 교육으로 반영될 것입니다.').replace(/</g, '&lt;');
                html += '<p class="text-sm text-gray-600 text-center mb-8 leading-relaxed whitespace-pre-wrap">' + safeDesc + '</p>';

                // 교육 정보 테이블
                html += '<table class="w-full border border-gray-200 rounded-lg overflow-hidden mb-8 text-sm">';
                html += '<tr class="bg-gray-50"><td class="px-4 py-3 font-bold text-gray-600 w-28 border-b border-r border-gray-200">교육과정</td><td class="px-4 py-3 border-b border-gray-200">' + courseTitle + '</td></tr>';
                html += '<tr class="bg-gray-50"><td class="px-4 py-3 font-bold text-gray-600 border-r border-gray-200">교육과목</td><td class="px-4 py-3">' + subjectTitle + '</td></tr>';
                html += '<tr><td class="px-4 py-2 text-[10px] text-gray-400 border-r border-gray-200"></td><td class="px-4 py-2 text-xs text-gray-500">담당교사 : ' + teacherName + '</td></tr>';
                html += '<tr class="bg-gray-50"><td class="px-4 py-3 font-bold text-gray-600 border-r border-t border-gray-200">설문작성일</td><td class="px-4 py-3 border-t border-gray-200">' + dateStr + '</td></tr>';
                html += '</table>';

                // 설문 폼
                html += '<form id="studentSurveyForm" class="space-y-6">';
                html += '<input type="hidden" name="surveyId" value="' + surveyId + '">';

                sections.forEach(function(sec) {
                    var items = questions.slice(sec.start, sec.end);
                    if (items.length === 0 && !sec.isText) return;

                    html += '<div class="border border-gray-200 rounded-xl overflow-hidden">';
                    html += '<div class="bg-gray-100 px-4 py-3 font-bold text-gray-700 text-sm text-center">' + sec.title + '</div>';

                    if (sec.isText) {
                        var qLast = items[0];
                        var qIdLast = qLast ? qLast.id : 'text_0';
                        html += '<div class="p-4"><textarea name="q_' + qIdLast + '" rows="5" class="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none" placeholder="교육 소감을 작성해 주세요."></textarea></div>';
                    } else {
                        html += '<table class="w-full text-sm"><thead><tr><th class="text-left py-2 pl-4 font-medium text-gray-600 w-1/2">문항</th>';
                        for (var i = 5; i >= 1; i--) {
                            html += '<th class="py-2 text-center text-xs text-gray-500 font-medium">' + i + '<br><span class="text-[10px] font-normal">' + scaleLabels[i - 1] + '</span></th>';
                        }
                        html += '</tr></thead><tbody>';
                        items.forEach(function(q) {
                            html += '<tr class="border-t border-gray-100"><td class="py-3 pl-4 pr-2 text-gray-800">' + (q.question_text || '').replace(/</g,'&lt;') + '</td>';
                            for (var k = 5; k >= 1; k--) {
                                html += '<td class="py-3 text-center"><input type="radio" required name="q_' + q.id + '" value="' + k + '" class="w-4 h-4 cursor-pointer accent-sky-600"></td>';
                            }
                            html += '</tr>';
                        });
                        html += '</tbody></table>';
                    }
                    html += '</div>';
                });

                html += '<div class="pt-6 flex gap-3 justify-end">';
                html += '<button type="button" onclick="loadStudentSurveys()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">취소</button>';
                html += '<button type="submit" class="px-8 py-3 bg-sky-600 text-white rounded-xl font-black hover:bg-slate-900 transition shadow-lg shadow-sky-100"><i class="fas fa-paper-plane mr-2"></i>제출하기</button>';
                html += '</div>';
                html += '</form>';
                html += '</div></div>';

                container.innerHTML = html;
                document.getElementById('studentSurveyForm').addEventListener('submit', function(e) { e.preventDefault(); submitSurveyForm(surveyId); });
            } catch (err) {
                console.error(err);
                container.innerHTML = '<div class="text-center text-red-500">설문을 불러오는 중 오류가 발생했습니다.</div><button type="button" onclick="loadStudentSurveys()" class="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">목록으로</button>';
            }
        }


        async function submitSurveyForm(surveyId) {
            var form = document.getElementById('studentSurveyForm');
            if (!form) return;
            var answers = [];
            var seen = {};
            var inputs = form.querySelectorAll('input[name^="q_"], textarea[name^="q_"]');
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                var name = el.getAttribute('name');
                if (!name || name.indexOf('q_') !== 0) continue;
                var qid = name.replace('q_', '');
                if (seen[qid]) continue;
                seen[qid] = true;
                var val;
                if (el.type === 'radio') {
                    var checked = form.querySelector('input[name="' + name + '"]:checked');
                    val = checked ? checked.value : '';
                } else {
                    val = el.value || '';
                }
                answers.push({ question_id: parseInt(qid, 10), answer_value: val });
            }
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            var btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = '제출 중...'; }
            try {
                var res = await fetch('/api/surveys/' + surveyId + '/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ answers: answers })
                });
                var json = await res.json();
                if (json && json.success) {
                    alert(json.message || '설문에 참여해 주셔서 감사합니다.');
                    loadStudentSurveys();
                } else {
                    alert(json && json.error ? json.error : '제출에 실패했습니다.');
                    if (btn) { btn.disabled = false; btn.textContent = '제출하기'; }
                }
            } catch (e) {
                console.error(e);
                alert('제출 중 오류가 발생했습니다.');
                if (btn) { btn.disabled = false; btn.textContent = '제출하기'; }
            }
        }

        async function handleSaveEmployment(e) {
            e.preventDefault();
            const data = {
                course_id: parseInt(document.getElementById('empCourseId').value),
                status: document.getElementById('empStatus').value,
                company_name: document.getElementById('empCompanyName').value,
                job_title: document.getElementById('empJobTitle').value,
                employment_date: document.getElementById('empDate').value,
                insurance_covered: document.getElementById('empInsurance').checked,
                notes: document.getElementById('empNotes').value
            };

            try {
                const res = await fetch('/api/hrd/my-employment', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert('성공적으로 업데이트되었습니다.');
                    closeEmploymentModal();
                    loadEmploymentStatus();
                } else {
                    alert(result.error || '업데이트에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('업데이트 중 오류가 발생했습니다.');
            }
        }
    </script>

    <!-- 포트폴리오 등록 모달 (벤토 스타일) -->
    <div id="portfolioModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden">
            <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 class="font-black text-slate-900 tracking-tight uppercase text-sm">포트폴리오 등록</h3>
                <button onclick="closePortfolioModal()" class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><i class="fas fa-times"></i></button>
            </div>
            <form id="portfolioForm" onsubmit="handleSavePortfolio(event)" class="p-8 space-y-5">
                <div>
                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">작품 제목 *</label>
                    <input type="text" id="portfolioTitle" required class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium" placeholder="예: 3D 캐릭터 모델링">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">설명</label>
                    <textarea id="portfolioDescription" rows="3" class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium" placeholder="작품에 대한 간단한 설명"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">카테고리</label>
                        <select id="portfolioCategory" class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-bold">
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">소속 과정</label>
                        <select id="portfolioCourseId" class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-bold">
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">썸네일 이미지 URL</label>
                    <input type="url" id="portfolioThumbnail" class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium" placeholder="https://...">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">작품 링크 (URL)</label>
                    <input type="url" id="portfolioContent" class="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-medium" placeholder="Google Drive, Portfolio site 등">
                </div>
                <div class="pt-4 flex gap-3">
                    <button type="button" onclick="closePortfolioModal()" class="flex-1 py-3.5 border border-slate-200 rounded-2xl font-black text-[10px] text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition">취소</button>
                    <button type="submit" class="flex-1 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-slate-900 transition">등록하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 취업 정보 수정 모달 (벤토 스타일) -->
    <div id="employmentModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-200/60 overflow-hidden">
            <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 class="font-black text-slate-900 tracking-tight uppercase text-sm">취업 정보 업데이트</h3>
                <button onclick="closeEmploymentModal()" class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><i class="fas fa-times"></i></button>
            </div>
            <form onsubmit="handleSaveEmployment(event)" class="p-8 space-y-6">
                <input type="hidden" id="empCourseId">
                <div>
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">과정명</label>
                    <div id="empCourseTitle" class="font-bold text-gray-800 text-lg"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">현재 상태</label>
                        <select id="empStatus" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition uppercase text-xs font-bold">
                            <option value="seeking">구직 중</option>
                            <option value="employed">취업 완료</option>
                            <option value="further_education">진학</option>
                            <option value="military">군입대</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">업체명</label>
                        <input type="text" id="empCompanyName" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">직무</label>
                        <input type="text" id="empJobTitle" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">취업일자</label>
                        <input type="date" id="empDate" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div class="flex items-end pb-3">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="empInsurance" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                            <span class="text-xs font-bold text-gray-600">고용보험 가입</span>
                        </label>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">비고/메모</label>
                        <textarea id="empNotes" rows="2" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition text-sm"></textarea>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button type="button" onclick="closeEmploymentModal()" class="flex-1 py-4 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition">취소</button>
                    <button type="submit" class="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">저장하기</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- 초기 비밀번호 변경 권고 모달 -->
    <div id="initialLoginModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md hidden z-[80] flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden animate-fade-in">
            <div class="px-8 py-10 text-center">
                <div class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-sm border border-amber-100">
                    <i class="fas fa-shield-halved text-3xl"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">비밀번호 변경 안내</h3>
                <p class="text-slate-500 font-medium mb-8 leading-relaxed">
                    현재 초기 비밀번호(전화번호 뒷자리)를 사용 중입니다.<br>
                    안전을 위해 새로운 비밀번호로 변경하시는 것을 권장합니다.
                </p>
                
                <div class="flex flex-col gap-3">
                    <button onclick="location.href='/profile?tab=password'" class="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-slate-900 transition flex items-center justify-center gap-2">
                        <i class="fas fa-key"></i>
                        지금 비밀번호 변경하기
                    </button>
                    <button onclick="closeInitialModal()" class="w-full py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition">
                        다음에 변경하기 (현재 비번 계속 사용)
                    </button>
                </div>
                
                <p class="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    * 훈련생 본인 정보는 관리자만 수정 가능하며, 비밀번호만 직접 변경이 가능합니다.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;
