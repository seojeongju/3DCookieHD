import { hrdSidebar } from './components/hrd_sidebar';

export const adminDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관리자 대시보드 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'] },
            borderRadius: { '3xl': '1.5rem', '4xl': '2rem' }
          }
        }
      }
    </script>
    <style>
        .fc-event { cursor: pointer; border-radius: 4px; border: none; font-size: 0.8em; }
        .fc-header-toolbar { margin-bottom: 0.5rem !important; }
        .fc-button { padding: 0.2rem 0.5rem !important; font-size: 0.8em !important; }
        body.hide-course .fc-event-course { display: none !important; }
        body.hide-facility .fc-event-facility { display: none !important; }
        body.hide-consultation-inquiry .fc-event-consultation-inquiry { display: none !important; }
        body.hide-consultation-hrd .fc-event-consultation-hrd { display: none !important; }
        body.hide-general .fc-event-schedule { display: none !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
        
        /* Category Colors */
        .fc-event-course { background-color: #3b82f6 !important; border-color: #2563eb !important; color: white !important; }
        .fc-event-facility { background-color: #10b981 !important; border-color: #059669 !important; color: white !important; }
        .fc-event-consultation-inquiry { background-color: #f97316 !important; border-color: #ea580c !important; color: white !important; }
        .fc-event-consultation-hrd { background-color: #e11d48 !important; border-color: #be123c !important; color: white !important; }
        .fc-event-schedule { background-color: #a855f7 !important; border-color: #9333ea !important; color: white !important; }
    </style>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
        .sidebar-menu-item.active {
            background-color: #eff6ff;
            color: #2563eb;
            border-right: 3px solid #2563eb;
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-[100dvh] overflow-hidden min-h-0 min-w-0">
        <!-- 사이드바 -->
        ${hrdSidebar('dashboard')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 flex flex-col overflow-hidden relative min-h-0 min-w-0">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            <!-- 헤더 -->
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">종합 현황 대시보드</h1>
                    <span id="user-badge" class="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">ADMIN</span>
                </div>
                <div class="flex items-center gap-4">
                    <span id="header-clock" class="text-sm font-bold text-slate-600 tabular-nums">--:--:--</span>
                    <a href="/" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm text-slate-700">
                        <i class="fas fa-external-link-alt"></i> 홈페이지로 이동
                    </a>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
            <div class="max-w-[1600px] mx-auto space-y-8">
                <!-- 웰컴 + 핵심 지표 (Bento) -->
                <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div class="relative z-10 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h2 class="text-xl font-black text-white/95 tracking-tight">관리자 대시보드</h2>
                            <p class="text-sm font-medium text-slate-300 mt-1">시스템 종합 현황 · <span id="welcome-date" class="font-bold">--</span></p>
                        </div>
                        <div class="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 시스템 정상
                        </div>
                    </div>
                </div>

                <!-- 1. 핵심 지표 카드 섹션 (Bento Grid) -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div onclick="location.href='/admin/users'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm cursor-pointer group">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">전체 회원</h3>
                            <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <i class="fas fa-users text-sm"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="stat-total-students" class="text-2xl font-black text-slate-800">-</span>
                            <span class="ml-1 text-xs text-slate-500 font-medium">명</span>
                        </div>
                    </div>
                    <div onclick="location.href='/admin/courses'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm cursor-pointer group">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-purple-600 transition-colors">교육과정</h3>
                            <div class="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                <i class="fas fa-book-open text-sm"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline mb-2">
                            <span id="stat-active-courses" class="text-2xl font-black text-slate-800">-</span>
                            <span class="ml-1 text-xs text-slate-500 font-medium">개</span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <span class="flex items-center" title="운영중"><span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span><b id="stat-c-active" class="text-slate-700">0</b></span>
                            <span class="flex items-center" title="모집중"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span><b id="stat-c-recruiting" class="text-slate-700">0</b></span>
                            <span class="flex items-center" title="종료/마감"><span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></span><b id="stat-c-closed" class="text-slate-700">0</b></span>
                        </div>
                    </div>
                    <div onclick="location.href='/admin/enrollments'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm cursor-pointer group">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-green-600 transition-colors">이번 달 매출</h3>
                            <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                <i class="fas fa-won-sign text-sm"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline mb-2">
                            <span id="stat-monthly-revenue" class="text-2xl font-black text-slate-800">-</span>
                            <span class="ml-1 text-xs text-slate-500 font-medium">원</span>
                        </div>
                        <div class="flex flex-wrap gap-1 text-[9px] text-slate-500 font-medium">
                            <span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg">카드 <b id="stat-rev-card">0</b></span>
                            <span class="px-1.5 py-0.5 bg-green-50 text-green-600 rounded-lg">계좌 <b id="stat-rev-transfer">0</b></span>
                            <span class="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-lg">국비 <b id="stat-rev-gov">0</b></span>
                        </div>
                    </div>
                    <div onclick="location.href='/admin/inquiries'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm cursor-pointer group">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-red-600 transition-colors">온라인문의</h3>
                            <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                                <i class="fas fa-comment-dots text-sm"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline mb-2">
                            <span id="stat-new-inquiries" class="text-2xl font-black text-slate-800">-</span>
                            <span class="ml-1 text-xs text-red-500 font-medium">건</span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>신규 <b id="stat-inq-pending" class="text-slate-700">0</b></span>
                            <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>완료 <b id="stat-inq-completed" class="text-slate-700">0</b></span>
                        </div>
                    </div>
                    <div class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm group">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-indigo-600 transition-colors">사이트 접속</h3>
                            <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                <i class="fas fa-chart-line text-sm"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline mb-1">
                            <span id="stat-today-pv" class="text-2xl font-black text-slate-800">-</span>
                            <span class="ml-1 text-xs text-slate-500 font-medium">PV</span>
                            <span class="mx-1 text-slate-300">/</span>
                            <span id="stat-today-uv" class="text-lg font-black text-slate-600">-</span>
                            <span class="ml-0.5 text-[10px] text-slate-400 font-medium">UV</span>
                        </div>
                        <div class="text-[10px] text-slate-400 font-medium">오늘 접속 통계</div>
                    </div>
                </div>

                <!-- 1.1 현재 운영 중인 과정 (LMS Quick Access) -->
                <section class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black text-slate-800 tracking-tight">
                            <i class="fas fa-chalkboard-teacher text-primary-600 mr-2"></i>운영 중인 과정 (LMS 바로가기)
                        </h3>
                        <a href="/admin/courses/sessions" class="text-xs font-bold text-slate-500 hover:text-primary-600 transition uppercase tracking-widest">전체 회차 보기 <i class="fas fa-chevron-right ml-1"></i></a>
                    </div>
                    <div id="active-sessions-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-slate-400">
                        <!-- JS 영역에서 진행중인 회차를 카드 형태로 렌더링 -->
                        <div class="col-span-full py-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                            <i class="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                            <p class="text-xs font-bold">운영 중인 과정을 불러오고 있습니다...</p>
                        </div>
                    </div>
                </section>

                <!-- 1.5 통합 일정 모니터링 (Bento) -->
                <div class="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-200/60">
                    <div class="flex flex-wrap items-center justify-between mb-4 gap-4">
                        <div class="flex items-center cursor-pointer" onclick="toggleCalendarSection()">
                            <h3 class="text-lg font-black text-slate-800 mr-4 select-none tracking-tight"><i class="fas fa-calendar-check text-indigo-600 mr-2"></i>일정 모니터링 <i id="calToggleIcon" class="fas fa-chevron-up ml-2 text-slate-400 text-sm transition-transform duration-300"></i></h3>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600" onclick="event.stopPropagation()">
                                <label class="flex items-center space-x-1 cursor-pointer select-none">
                                    <input type="checkbox" checked onchange="toggleCalFilter('course')" class="form-checkbox text-blue-500 rounded">
                                    <i class="fas fa-graduation-cap text-blue-500"></i>
                                    <span>과정</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer select-none">
                                    <input type="checkbox" checked onchange="toggleCalFilter('facility')" class="form-checkbox text-green-500 rounded">
                                    <i class="fas fa-door-open text-green-500"></i>
                                    <span>시설</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer select-none">
                                    <input type="checkbox" checked onchange="toggleCalFilter('consultation-inquiry')" class="form-checkbox text-orange-500 rounded">
                                    <i class="fas fa-headset text-orange-500"></i>
                                    <span>상담</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer select-none">
                                    <input type="checkbox" checked onchange="toggleCalFilter('consultation-hrd')" class="form-checkbox text-rose-500 rounded">
                                    <i class="fas fa-user-friends text-rose-500"></i>
                                    <span>면담</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer select-none">
                                    <input type="checkbox" checked onchange="toggleCalFilter('general')" class="form-checkbox text-purple-500 rounded">
                                    <i class="fas fa-calendar-check text-purple-500"></i>
                                    <span>일반</span>
                                </label>
                            </div>
                        </div>
                        <a href="/admin/schedule" class="text-sm text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider">
                            전체 일정 보기 <i class="fas fa-chevron-right ml-1"></i>
                        </a>
                    </div>
                    <div id="calendar-section" class="transition-all duration-300 ease-in-out">
                         <div id="dashboardCalendar" style="height: 600px;" class="w-full transition-all duration-500 ease-in-out overflow-hidden origin-top"></div>
                    </div>
                </div>

                <!-- 2. 차트 영역 (Bento) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-200/60">
                        <h3 class="text-lg font-black text-slate-800 mb-4 tracking-tight">월별 가입자 추이</h3>
                        <div class="relative h-72">
                            <canvas id="growthChart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-200/60">
                        <h3 class="text-lg font-black text-slate-800 mb-4 tracking-tight">웹사이트 일별 접속 추이 (최근 7일)</h3>
                        <div class="relative h-72">
                            <canvas id="websiteTrendChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 2.5 하단 통계 영역 (Bento) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-200/60">
                        <h3 class="text-lg font-black text-slate-800 mb-4 tracking-tight">인기 과정 TOP 5</h3>
                        <div class="relative h-72">
                            <canvas id="popularCoursesChart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-200/60">
                        <h3 class="text-lg font-black text-slate-800 mb-4 tracking-tight">가장 많이 찾은 페이지 TOP 5</h3>
                        <div class="overflow-hidden mt-4">
                            <ul id="top-pages-list" class="space-y-4">
                                <!-- JS 주입 -->
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 3. 실시간 현황 영역 (Bento) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/80">
                            <h3 class="font-black text-slate-800 tracking-tight">
                                <i class="fas fa-clock text-green-500 mr-2"></i>실시간 출석 현황
                            </h3>
                            <a href="/admin/attendance" class="text-sm font-bold text-slate-500 hover:text-primary-600 uppercase tracking-wider">전체보기</a>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th class="px-6 py-3">이름</th>
                                        <th class="px-6 py-3">과정</th>
                                        <th class="px-6 py-3">시간</th>
                                        <th class="px-6 py-3">상태</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceTableBody" class="divide-y divide-slate-100">
                                    <tr><td colspan="4" class="px-6 py-4 text-center text-slate-400">데이터 로딩 중...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/80">
                            <h3 class="font-black text-slate-800 tracking-tight">
                                <i class="fas fa-tools text-red-500 mr-2"></i>시설/비품 점검
                            </h3>
                            <div class="flex space-x-2 text-sm font-bold">
                                <a href="/admin/facilities" class="text-slate-500 hover:text-primary-600">시설</a>
                                <span class="text-slate-300">|</span>
                                <a href="/admin/items" class="text-slate-500 hover:text-primary-600">물품</a>
                            </div>
                        </div>
                        <div id="abnormal-status-list" class="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
                            <div class="p-8 text-center text-slate-400">데이터를 불러오는 중...</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/80">
                            <h3 class="font-black text-slate-800 tracking-tight">
                                <i class="fas fa-check-circle text-orange-500 mr-2"></i>수강 승인 대기
                            </h3>
                            <a href="/admin/enrollments" class="text-sm font-bold text-slate-500 hover:text-primary-600 uppercase tracking-wider">전체보기</a>
                        </div>
                        <div id="pending-approvals-list" class="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
                            <div class="p-8 text-center text-slate-400">데이터를 불러오는 중...</div>
                        </div>
                    </div>
                </div>

                <!-- 4. 빠른 작업 (Bento) -->
                <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                        <h3 class="font-black text-slate-800 tracking-tight">
                            <i class="fas fa-bolt text-yellow-500 mr-2"></i> 빠른 작업
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onclick="location.href='/admin/courses?action=create'" class="bento-card flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-purple-200 text-purple-700 font-bold text-sm uppercase tracking-wider">
                                <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-2 text-purple-600">
                                    <i class="fas fa-plus"></i>
                                </div>
                                과정 개설
                            </button>
                            <button onclick="location.href='/admin/students'" class="bento-card flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-green-200 text-green-700 font-bold text-sm uppercase tracking-wider">
                                <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-2 text-green-600">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                훈련생 관리
                            </button>
                            <button onclick="openModal('createJobModal')" class="bento-card flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-blue-200 text-blue-700 font-bold text-sm uppercase tracking-wider">
                                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-2 text-blue-600">
                                    <i class="fas fa-briefcase"></i>
                                </div>
                                채용공고
                            </button>
                            <button onclick="location.href='/admin/posts'" class="bento-card flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-red-200 text-red-700 font-bold text-sm uppercase tracking-wider">
                                <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-2 text-red-600">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                게시판 관리
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </main>
    </div>

    <!-- 채용공고 등록 모달 (Bento) -->
    <div id="createJobModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200/60">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                <h3 class="text-xl font-black text-slate-800 tracking-tight">채용공고 등록</h3>
                <button onclick="closeModal('createJobModal')" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createJobForm" onsubmit="handleCreateJob(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-slate-700 font-bold text-sm mb-2">제목</label>
                            <input type="text" name="title" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-700 font-bold text-sm mb-2">회사명</label>
                                <input type="text" name="company" value="와우쓰리디홍대센터" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                            </div>
                            <div>
                                <label class="block text-slate-700 font-bold text-sm mb-2">고용 형태</label>
                                <select name="job_type" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="아르바이트">아르바이트</option>
                                    <option value="인턴">인턴</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-700 font-bold text-sm mb-2">근무지</label>
                                <input type="text" name="location" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                            </div>
                            <div>
                                <label class="block text-slate-700 font-bold text-sm mb-2">급여</label>
                                <input type="text" name="salary" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                            </div>
                        </div>
                        <div>
                            <label class="block text-slate-700 font-bold text-sm mb-2">자격 요건</label>
                            <textarea name="requirements" rows="3" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"></textarea>
                        </div>
                        <div>
                            <label class="block text-slate-700 font-bold text-sm mb-2">상세 내용</label>
                            <textarea name="description" rows="5" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeModal('createJobModal')" class="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition">취소</button>
                        <button type="submit" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold text-sm transition">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 공지사항 등록 모달 (Bento, 단일 - 이동 유도) -->
    <div id="createPostModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200/60">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center">
                <h3 class="text-xl font-black text-slate-800 tracking-tight">공지사항 작성</h3>
                <button onclick="closeModal('createPostModal')" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form onsubmit="handleCreatePost(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-slate-700 font-bold text-sm mb-2">제목</label>
                            <input type="text" name="title" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition">
                        </div>
                        <div>
                            <label class="block text-slate-700 font-bold text-sm mb-2">내용</label>
                            <textarea name="content" required rows="5" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"></textarea>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" name="is_pinned" id="postPinned" class="rounded text-primary-600 focus:ring-primary-500 h-4 w-4">
                            <label for="postPinned" class="text-slate-700 font-medium text-sm">상단 고정</label>
                        </div>
                        <div class="flex gap-3 pt-2">
                            <button type="button" onclick="closeModal('createPostModal')" class="flex-1 py-3 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</button>
                            <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold text-sm transition">등록하기</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 일정 상세 모달 (Bento) -->
    <div id="eventModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/60">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center">
                <h3 class="text-xl font-black text-slate-800 tracking-tight">일정 상세</h3>
                <button onclick="closeModal('eventModal')" class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <h4 id="modalEventName" class="text-lg font-black text-slate-900 mb-1 tracking-tight"></h4>
                    <p id="modalTime" class="text-sm text-slate-500 font-medium"></p>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl text-sm text-slate-700">
                    <p id="modalDesc" class="whitespace-pre-wrap"></p>
                </div>
                <div class="flex justify-end gap-2 pt-4">
                    <button id="btnViewCourse" class="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl text-sm font-bold transition" style="display:none;">바로가기</button>
                    <button onclick="closeModal('eventModal')" class="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition">닫기</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 전역 스코프에 logout 함수 정의
        window.logout = function logout() {
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.href = '/login';
            }
        };

        function openModal(id) {
            document.getElementById(id).classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        function updateHeaderClock() {
            const el = document.getElementById('header-clock');
            if (el) {
                const now = new Date();
                el.textContent = now.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
        }
        function updateWelcomeDate() {
            const el = document.getElementById('welcome-date');
            if (el) el.textContent = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateHeaderClock();
            updateWelcomeDate();
            setInterval(updateHeaderClock, 1000);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.role === 'teacher') {
                        const badge = document.getElementById('user-badge');
                        if (badge) {
                            badge.textContent = 'TEACHER';
                            badge.className = 'px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest';
                        }
                    }
                } catch(e) {}
            }
            loadDashboardStats();
            loadWebsiteStats();
            loadAttendance();
            loadActiveSessions();
            initDashboardCalendar();
        });

        async function loadActiveSessions() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/course-sessions?status=in_progress&limit=6', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const grid = document.getElementById('active-sessions-grid');
                
                if (result.success && result.data && result.data.length > 0) {
                    grid.innerHTML = result.data.map(session => {
                        const range = session.training_start_date && session.training_end_date 
                            ? \`\${session.training_start_date.substring(5, 10)} ~ \${session.training_end_date.substring(5, 10)}\`
                            : '일정 미정';
                        
                        return \`
                        <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all group animate-fade-in">
                            <div class="px-6 py-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase tracking-wider">진행중</span>
                                    <span class="text-[10px] font-bold text-slate-400"><i class="far fa-calendar-alt mr-1"></i> \${range}</span>
                                </div>
                                <h4 class="font-black text-slate-800 text-sm mb-1 truncate" title="\${session.course_name}">\${session.course_name}</h4>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-bold text-slate-500">\${session.session_number || 1}회차</span>
                                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span class="text-xs font-medium text-slate-400">\${session.instructor_name || '강사 미배정'}</span>
                                </div>
                            </div>
                            <div class="p-4 grid grid-cols-2 gap-2 bg-white">
                                <a href="/admin/courses/\${session.id}/lms/attendance" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition">
                                    <i class="fas fa-user-check text-[10px]"></i> 출석
                                </a>
                                <a href="/admin/courses/\${session.id}/lms/counseling" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition">
                                    <i class="fas fa-comments text-[10px]"></i> 상담
                                </a>
                                <a href="/admin/courses/\${session.id}/lms/assignments" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition">
                                    <i class="fas fa-tasks text-[10px]"></i> 과제
                                </a>
                                <a href="/admin/courses/sessions/\${session.id}/timetable" class="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition">
                                    <i class="far fa-calendar-alt text-[10px]"></i> 시간표
                                </a>
                            </div>
                            <div class="px-4 pb-4">
                                <a href="/admin/courses/\${session.id}/lms" class="w-full h-10 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-primary-700 transition shadow-sm">
                                    LMS 상세 관리 <i class="fas fa-arrow-right text-[10px]"></i>
                                </a>
                            </div>
                        </div>
                        \`;
                    }).join('');
                } else {
                    grid.innerHTML = \`
                        <div class="col-span-full py-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <i class="fas fa-chalkboard text-2xl"></i>
                            </div>
                            <h4 class="text-slate-800 font-bold">진행 중인 과정이 없습니다.</h4>
                            <p class="text-xs text-slate-400 mt-1">회차별 과정 개설 관리에서 새로운 과정을 시작해보세요.</p>
                            <a href="/admin/courses/sessions" class="inline-flex items-center gap-2 mt-4 text-primary-600 text-xs font-bold hover:underline">회차 관리로 이동 <i class="fas fa-chevron-right text-[10px]"></i></a>
                        </div>
                    \`;
                }
            } catch (e) {
                console.error('Failed to load active sessions:', e);
                document.getElementById('active-sessions-grid').innerHTML = '<div class="col-span-full p-8 text-center text-red-400">데이터 로드 실패</div>';
            }
        }

        async function loadWebsiteStats() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/dashboard/website-stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    document.getElementById('stat-today-pv').textContent = data.todayPV.toLocaleString();
                    document.getElementById('stat-today-uv').textContent = data.todayUV.toLocaleString();
                    
                    // Render Website Trend Chart
                    const trendCtx = document.getElementById('websiteTrendChart').getContext('2d');
                    new Chart(trendCtx, {
                        type: 'bar',
                        data: {
                            labels: data.weeklyTrend.map(t => t.date.substring(5)), // MM-DD
                            datasets: [{
                                label: '페이지뷰(PV)',
                                data: data.weeklyTrend.map(t => t.count),
                                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                                borderRadius: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } }
                        }
                    });

                    // Render Top Pages
                    const topPagesList = document.getElementById('top-pages-list');
                    if (data.topPages && data.topPages.length > 0) {
                        topPagesList.innerHTML = data.topPages.map((p, idx) => \`
                            <li class="flex items-center">
                                <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">\${idx + 1}</span>
                                <span class="text-sm text-slate-700 flex-1 truncate font-medium">\${p.page_visited}</span>
                                <span class="text-sm font-bold text-indigo-600">\${p.count.toLocaleString()} <small class="text-slate-400 font-normal ml-0.5">PV</small></span>
                            </li>
                        \`).join('');
                    } else {
                        topPagesList.innerHTML = '<li class="py-10 text-center text-slate-400">집계된 데이터가 없습니다.</li>';
                    }
                }
            } catch (e) {
                console.error('Failed to load website stats:', e);
            }
        }

        async function loadAttendance() {
            try {
                // 실시간 출석 현황 조회 (새로운 API 사용)
                const response = await fetch('/api/dashboard/today-attendance');
                const result = await response.json();
                const tbody = document.getElementById('attendanceTableBody');
                
                if (result.success && result.data.length > 0) {
                    const statusMap = {
                        'present': { text: '출석', class: 'bg-green-100 text-green-700' },
                        'late': { text: '지각', class: 'bg-yellow-100 text-yellow-700' },
                        'early_leave': { text: '조퇴', class: 'bg-orange-100 text-orange-700' },
                        'absent': { text: '결석', class: 'bg-red-100 text-red-700' },
                        'pending': { text: '대기', class: 'bg-slate-100 text-slate-700' }
                    };
                    
                    tbody.innerHTML = result.data.map(s => {
                        const status = statusMap[s.status] || statusMap['pending'];
                        const courseTitle = s.course_title ? (s.course_title.length > 15 ? s.course_title.substring(0, 15) + '...' : s.course_title) : '과정 미정';
                        const checkInTime = s.check_in_time || '-';
                        
                        return '<tr class="hover:bg-slate-50 transition-colors">' +
                            '<td class="px-6 py-4 font-medium text-slate-800">' + s.student_name + '</td>' +
                            '<td class="px-6 py-4 text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">' + courseTitle + '</td>' +
                            '<td class="px-6 py-4 text-slate-600">' + checkInTime + '</td>' +
                            '<td class="px-6 py-4"><span class="px-2 py-1 ' + status.class + ' rounded-full text-xs font-medium">' + status.text + '</span></td>' +
                        '</tr>';
                    }).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-slate-500">금일 출석 데이터가 없습니다.</td></tr>';
                }
            } catch (e) {
                console.error('Failed to load attendance:', e);
                document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-red-400">데이터 로드 실패</td></tr>';
            }
        }

        async function loadDashboardStats() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/dashboard/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    
                    // 1. Text Stats
                    document.getElementById('stat-total-students').textContent = data.totalStudents.toLocaleString();
                    document.getElementById('stat-active-courses').textContent = data.activeCourses.toLocaleString();
                    
                    // Course Breakdown
                    const breakdown = data.courseStatusBreakdown || {};
                    document.getElementById('stat-c-active').textContent = (breakdown['active'] || 0).toLocaleString();
                    document.getElementById('stat-c-recruiting').textContent = ((breakdown['recruiting'] || 0) + (breakdown['preparing'] || 0)).toLocaleString();
                    document.getElementById('stat-c-closed').textContent = ((breakdown['closed'] || 0) + (breakdown['completed'] || 0)).toLocaleString();

                    document.getElementById('stat-monthly-revenue').textContent = (data.monthlyRevenue || 0).toLocaleString();
                    
                    if (data.revenueBreakdown) {
                        document.getElementById('stat-rev-card').textContent = (data.revenueBreakdown.card || 0).toLocaleString();
                        document.getElementById('stat-rev-transfer').textContent = (data.revenueBreakdown.transfer || 0).toLocaleString();
                        document.getElementById('stat-rev-gov').textContent = (data.revenueBreakdown.gov || 0).toLocaleString();
                    }
                    document.getElementById('stat-new-inquiries').textContent = data.newInquiries || '0';
                    
                    if (data.inquiryStats) {
                        document.getElementById('stat-inq-pending').textContent = data.inquiryStats.pending || '0';
                        document.getElementById('stat-inq-completed').textContent = data.inquiryStats.completed || '0';
                    }

                    // 2. Charts
                    initCharts(data);

                    // 3. Pending List
                    renderPendingList(data.pendingApprovals);

                    // 4. Abnormal Status List
                    renderAbnormalList(data.abnormalFacilities, data.abnormalItems);
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        }

        function initCharts(data) {
            // Growth Chart
            const growthCtx = document.getElementById('growthChart').getContext('2d');
            const growthLabels = data.monthlyGrowth ? data.monthlyGrowth.map(item => item.month) : [];
            const growthData = data.monthlyGrowth ? data.monthlyGrowth.map(item => item.count) : [];

            new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: growthLabels,
                    datasets: [{
                        label: '신규 회원 수',
                        data: growthData,
                        borderColor: '#2563eb', // primary-600
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            // Popular Courses Chart
            const popularCtx = document.getElementById('popularCoursesChart').getContext('2d');
            const popLabels = data.popularCourses ? data.popularCourses.map(c => c.title.substring(0, 10) + '...') : [];
            const popData = data.popularCourses ? data.popularCourses.map(c => c.student_count) : [];

            new Chart(popularCtx, {
                type: 'bar',
                data: {
                    labels: popLabels,
                    datasets: [{
                        label: '수강생 수',
                        data: popData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y', // Horizontal Bar
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }

        function renderPendingList(list) {
            const container = document.getElementById('pending-approvals-list');
            if (!list || list.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-slate-500">대기 중인 항목이 없습니다.</div>';
                return;
            }

            container.innerHTML = list.map(item => \`
                <div class="px-6 py-4 flex items-center hover:bg-slate-50 transition">
                    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-800">\${item.user_name} - \${item.course_title}</p>
                        <p class="text-xs text-slate-500">수강 승인 요청</p>
                    </div>
                    <span class="ml-auto text-xs text-slate-400">\${new Date(item.created_at).toLocaleDateString()}</span>
                </div>
            \`).join('');
        }

        function renderAbnormalList(facilities, items) {
             const container = document.getElementById('abnormal-status-list');
             const allItems = [
                ...(facilities || []).map(f => ({ ...f, type: 'facility' })),
                ...(items || []).map(i => ({ ...i, type: 'item' }))
             ];

             if (allItems.length === 0) {
                 container.innerHTML = '<div class="p-6 text-center text-slate-500"><i class="fas fa-check-circle text-green-500 text-3xl mb-2 block"></i>모든 시설과 장비가<br>정상입니다.</div>';
                 return;
             }

             container.innerHTML = allItems.map(item => {
                 const isFacility = item.type === 'facility';
                 const statusColors = {
                     '점검필요': 'bg-yellow-100 text-yellow-700',
                     '수리중': 'bg-red-100 text-red-700',
                     'bad': 'bg-yellow-100 text-yellow-700',
                     'broken': 'bg-red-100 text-red-700',
                     'repair': 'bg-orange-100 text-orange-700'
                 };
                 const statusText = {
                     'bad': '상태나쁨', 'broken': '고장', 'repair': '수리중'
                 };
                 
                 const badgeClass = statusColors[item.status] || 'bg-slate-100 text-slate-700';
                 const badgeLabel = isFacility ? item.status : (statusText[item.status] || item.status);
                 const icon = isFacility ? 'fa-building' : 'fa-cubes';
                 const subText = isFacility ? (item.manager_main || '관리자 없음') : (item.facility_name || '위치 미정');

                 return \`
                    <div class="px-6 py-4 flex items-center hover:bg-slate-50 transition cursor-pointer" onclick="location.href='\${isFacility ? '/admin/facilities' : '/admin/items'}'">
                        <div class="w-10 h-10 rounded-full \${isFacility ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'} flex items-center justify-center mr-4">
                            <i class="fas \${icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between mb-1">
                                <h4 class="text-sm font-bold text-slate-800 truncate">\${item.name}</h4>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold \${badgeClass}">\${badgeLabel}</span>
                            </div>
                            <p class="text-xs text-slate-500 truncate">\${subText}</p>
                        </div>
                    </div>
                 \`;
             }).join('');
        }

        async function handleCreateJob(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('등록되었습니다.');
                    closeModal('createJobModal');
                    form.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch(e) { console.error(e); alert('오류 발생'); }
        }

        async function handleCreatePost(e) {
            e.preventDefault();
            const form = e.target;
            const data = {
                title: form.title.value,
                content: form.content.value,
                category: 'notice',
                is_pinned: form.is_pinned.checked ? 1 : 0
            };
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('공지사항이 등록되었습니다.');
                    closeModal('createPostModal');
                    form.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch(e) { console.error(e); alert('오류 발생'); }
        }
        let calendar;
        function initDashboardCalendar() {
            const calendarEl = document.getElementById('dashboardCalendar');
            if(!calendarEl) return;
            
            // Enforce initial expanded state
            calendarEl.style.height = '600px';
            calendarEl.style.opacity = '1';

            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'ko',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
                height: 600,
                events: '/api/schedules/integrated',
                eventClassNames: function(arg) {
                    const props = arg.event.extendedProps;
                    let cls = 'fc-event-' + (props.type || 'general');
                    if (props.subType) cls += ' fc-event-' + props.type + '-' + props.subType;
                    return [cls];
                },
                eventClick: function(info) { showEventDetail(info.event); },
                eventContent: function(arg) {
                    const props = arg.event.extendedProps;
                    let icon = '';
                    if (props.type === 'course') icon = '<i class="fas fa-graduation-cap mr-1"></i>';
                    else if (props.type === 'facility') icon = '<i class="fas fa-door-open mr-1"></i>';
                    else if (props.type === 'consultation') {
                        if (props.subType === 'hrd') icon = '<i class="fas fa-user-friends mr-1"></i>';
                        else icon = '<i class="fas fa-headset mr-1"></i>';
                    } else if (props.type === 'schedule') {
                        if (props.category === 'academic') icon = '<i class="fas fa-university mr-1"></i>';
                        else if (props.category === 'holiday') icon = '<i class="fas fa-umbrella-beach mr-1"></i>';
                        else icon = '<i class="fas fa-calendar-check mr-1"></i>';
                    } else icon = '<i class="fas fa-calendar mr-1"></i>';
                    
                    return { html: '<div class="fc-content overflow-hidden text-[10px]">' + icon + '<span>' + arg.event.title + '</span></div>' };
                }
            });
            calendar.render();
            // Force redraw to ensure correct height
            setTimeout(() => { calendar.updateSize(); }, 200);
            setTimeout(() => { calendar.updateSize(); }, 1000);
        }

        function toggleCalFilter(type) { document.body.classList.toggle('hide-' + type); }

        function showEventDetail(event) {
            const props = event.extendedProps;
            document.getElementById('modalEventName').textContent = event.title;
            
            let timeStr = event.allDay ? '종일' : (event.start ? event.start.toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'}) : '');
            if (!event.allDay && event.end) timeStr += ' ~ ' + event.end.toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'});
            document.getElementById('modalTime').textContent = timeStr;
            
            let desc = props.description || '';
            let btnViewCourse = document.getElementById('btnViewCourse');
            btnViewCourse.style.display = 'none';
            
            if (props.type === 'course') {
                 document.getElementById('modalEventName').textContent = '[교육과정] ' + event.title;
                 const statusMap = { active: '운영', recruiting: '모집', closed: '마감', completed: '마감', preparing: '준비' };
                 const s = props.status || 'active';
                 const sLabel = statusMap[s] || s;
                 
                 desc = "[상태] " + sLabel + "\\n[장소] " + (props.roomId || "미정") + "\\n" + desc;
                 
                 btnViewCourse.style.display = 'block';
                 btnViewCourse.textContent = 'LMS 바로가기';
                 btnViewCourse.onclick = () => location.href = '/admin/courses/' + event.id.split('-')[1] + '/lms';
            } else if (props.type === 'facility') {
                 document.getElementById('modalEventName').textContent = '[시설예약] ' + event.title;
                 btnViewCourse.style.display = 'block';
                 btnViewCourse.textContent = '시설 관리';
                 btnViewCourse.onclick = () => location.href = '/admin/facilities';
                 desc = '[목적] ' + (props.purpose||'-') + '\\n[예약자] ' + (props.userName||'-') + '\\n[내용] ' + desc;
            } else if (props.type === 'consultation') {
                 const isHrd = props.subType === 'hrd';
                 document.getElementById('modalEventName').textContent = (isHrd ? '[면담] ' : '[상담] ') + event.title;
                 if (isHrd) {
                     btnViewCourse.style.display = 'block';
                     btnViewCourse.textContent = '상담 일지';
                     btnViewCourse.onclick = () => location.href = '/admin/counseling?search=' + encodeURIComponent(props.clientName || '');
                 } else if (props.isInquiry) {
                     btnViewCourse.style.display = 'block';
                     btnViewCourse.textContent = '문의 내역 보기';
                     btnViewCourse.onclick = () => location.href = '/admin/inquiries?id=' + event.id.split('-')[1];
                 }
                 
                 const statusText = props.status === 'pending' ? '<span class="text-orange-500 font-bold">신규</span>' : '<span class="text-slate-500">답변완료</span>';
                 desc = "[상태] " + statusText + "\\n[대상] " + (props.clientName||"-") + "\\n[연락처] " + (props.phone || "-") + "\\n[내용] " + desc;
                 if(props.memo) desc += '\\n[상담원 메모] ' + props.memo;
                 if(props.result) desc += '\\n[결과] ' + props.result;
            } else {
                 document.getElementById('modalEventName').textContent = '[일정] ' + event.title;
            }

            document.getElementById('modalDesc').innerHTML = desc.replace(/\\n/g, '<br>') || '내용 없음';
            document.getElementById('eventModal').classList.remove('hidden');
        }
        function toggleCalendarSection() {
            const cal = document.getElementById('dashboardCalendar');
            const icon = document.getElementById('calToggleIcon');
            if (!cal || !icon) return;
            
            // Check inline style. Default (load) is 600px.
            if (cal.style.height === '0px') {
                cal.style.height = '600px';
                cal.style.opacity = '1';
                icon.style.transform = 'rotate(0deg)';
                setTimeout(() => { if(calendar) calendar.updateSize(); }, 550);
            } else {
                cal.style.height = '0px';
                cal.style.opacity = '0';
                icon.style.transform = 'rotate(180deg)';
            }
        }
    </script>
</body>
</html>
`;
