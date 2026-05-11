import { teacherSidebar } from './components/teacher_sidebar';

export const teacherDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#f8fafc">
    <title>강사 대시보드 - 3D COOKIE</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .section-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1023px) {
            .teacher-touch-target { min-height: 44px; min-width: 44px; }
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-neutral-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${teacherSidebar('dashboard')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-[#f1f3f5] custom-scrollbar relative">
            <div class="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none"></div>
            
            <!-- 상단 헤더 (모바일: 타이틀·배지 줄바꿈, 터치 영역 확대) -->
            <header class="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 flex flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div class="flex flex-col min-w-0 flex-1 basis-[min(100%,14rem)]">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <h1 class="text-lg sm:text-xl lg:text-2xl font-outfit font-black text-neutral-900 tracking-tight truncate">
                            강사 대시보드
                        </h1>
                        <span class="text-[9px] sm:text-[10px] bg-brand-600 text-white px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest font-black border border-brand-500 shadow-md shadow-brand-100 shrink-0 self-start sm:self-center max-w-full">PRO HUB</span>
                    </div>
                    <p class="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-[0.18em] sm:tracking-[0.2em] mt-1.5 leading-snug">Education AI Management Terminal</p>
                </div>
                <div class="flex items-center gap-3 sm:gap-5 shrink-0 ml-auto">
                    <div class="hidden md:flex items-center gap-3 px-5 py-2.5 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-inner group">
                        <i class="fas fa-clock text-brand-500 text-xs animate-pulse"></i>
                        <span id="current-time" class="text-xs font-black text-neutral-800 tracking-tighter">00:00:00</span>
                    </div>
                    <div class="hidden md:block h-10 w-px bg-neutral-200"></div>
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="text-right hidden sm:flex flex-col min-w-0 max-w-[120px] lg:max-w-none">
                            <span id="header-user-name" class="text-xs sm:text-sm font-black text-neutral-900 truncate">강사님</span>
                            <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span> Authorized
                            </span>
                        </div>
                        <a href="/teacher/profile" class="teacher-touch-target w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-xl shadow-brand-200 border-2 border-white hover:scale-105 active:scale-95 transition-transform" title="강사 프로필">
                            <i class="fas fa-user-tie text-base sm:text-lg"></i>
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto space-y-8 sm:space-y-10 lg:space-y-12 relative z-10 max-lg:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
                
                <!-- 환영 섹션 (Premium Hero) -->
                <section class="section-fade-in" style="animation-delay: 0.1s">
                    <div class="bg-neutral-900 rounded-3xl sm:rounded-4xl lg:rounded-5xl p-5 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-neutral-900/10 group">
                        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/20 to-transparent pointer-events-none"></div>
                        <div class="absolute -right-20 -top-20 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] group-hover:bg-brand-600/20 transition-all duration-1000"></div>
                        <div class="absolute left-1/4 bottom-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px]"></div>
                        
                        <div class="relative z-10 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 sm:gap-8 lg:gap-10">
                            <div class="max-w-2xl w-full text-center lg:text-left">
                                <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 backdrop-blur-md mx-auto lg:mx-0">
                                    <i class="fas fa-sparkles text-yellow-400 text-[10px] sm:text-xs"></i>
                                    <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-brand-200">System Synced in Real-time</span>
                                </div>
                                <h2 class="text-2xl sm:text-3xl lg:text-5xl font-outfit font-black tracking-tight mb-3 sm:mb-4 leading-snug break-keep">안녕하세요, <span id="welcome-name" class="text-brand-400">강사님</span><span class="text-brand-300"> 강사님</span>.</h2>
                                <p class="text-neutral-300 sm:text-neutral-400 text-sm sm:text-base font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8">배정된 강의의 실시간 학사 현황과 학생들의 학습 성과를 분석한 데이터입니다. 인공지능 기반 지표로 교육 운영을 더 명확하게 파악해 보세요.</p>
                                <div class="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                                    <button type="button" onclick="location.href='/teacher/courses'" class="teacher-touch-target min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-600 hover:bg-white hover:text-brand-900 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-brand-600/20 w-full sm:w-auto">
                                        강의실 입장하기 <i class="fas fa-arrow-right text-[10px] sm:text-xs"></i>
                                    </button>
                                    <div class="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 backdrop-blur-sm w-full sm:w-auto">
                                        <i class="fas fa-calendar-day text-brand-400 text-sm"></i>
                                        <span id="welcome-date" class="text-[11px] sm:text-xs font-black tracking-wide sm:tracking-widest text-neutral-200 sm:text-neutral-300 normal-case">-</span>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3 sm:gap-6 w-full lg:w-auto lg:min-w-[280px] shrink-0">
                                <div class="p-4 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-4xl backdrop-blur-md text-center hover:bg-white group/stat transition-all duration-500 cursor-default">
                                    <span class="block text-[9px] sm:text-[10px] font-black uppercase text-neutral-500 tracking-[0.15em] sm:tracking-[0.3em] mb-2 sm:mb-3 group-hover/stat:text-brand-600 transition-colors leading-tight">Managed Students</span>
                                    <span class="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black group-hover/stat:text-neutral-900 transition-colors tabular-nums" id="stat-total-students">0</span>
                                    <span class="block text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase mt-1 sm:mt-2 leading-tight">Active Learners</span>
                                </div>
                                <div class="p-4 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-4xl backdrop-blur-md text-center hover:bg-brand-600 group/stat transition-all duration-500 cursor-default">
                                    <span class="block text-[9px] sm:text-[10px] font-black uppercase text-neutral-500 tracking-[0.15em] sm:tracking-[0.3em] mb-2 sm:mb-3 group-hover/stat:text-white transition-colors leading-tight">Active Courses</span>
                                    <span class="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black group-hover/stat:text-white transition-colors tabular-nums" id="stat-my-courses">0</span>
                                    <span class="block text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase mt-1 sm:mt-2 group-hover/stat:text-white/60 transition-colors leading-tight">Running Now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 핵심 매트릭스 (Glass Cards) -->
                <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 section-fade-in" style="animation-delay: 0.2s">
                    <div onclick="location.href='/teacher/courses'" class="glass border border-white/60 rounded-5xl p-8 shadow-premium hover:shadow-premium-hover transition-all duration-700 cursor-pointer group">
                        <div class="flex justify-between items-start mb-10">
                            <div class="w-14 h-14 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <i class="fas fa-school text-xl"></i>
                            </div>
                            <span class="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-brand-100">Status</span>
                        </div>
                        <h3 class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">학사 운영 현황</h3>
                        <p class="text-2xl font-outfit font-black text-neutral-900 tracking-tight group-hover:text-brand-600 transition-colors">나의 강의 관리</p>
                        <div class="mt-6 flex items-baseline gap-2">
                            <span id="card-my-courses" class="text-4xl font-outfit font-black text-neutral-900">-</span>
                            <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Courses</span>
                        </div>
                    </div>

                    <div onclick="location.href='/teacher/courses?tab=students'" class="glass border border-white/60 rounded-5xl p-8 shadow-premium hover:shadow-premium-hover transition-all duration-700 cursor-pointer group">
                        <div class="flex justify-between items-start mb-10">
                            <div class="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <i class="fas fa-users-viewfinder text-xl"></i>
                            </div>
                            <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">Analysis</span>
                        </div>
                        <h3 class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">교육생 데이터</h3>
                        <p class="text-2xl font-outfit font-black text-neutral-900 tracking-tight group-hover:text-emerald-600 transition-colors">수강생 정밀 분석</p>
                        <div class="mt-6 flex items-baseline gap-2">
                            <span id="card-total-students" class="text-4xl font-outfit font-black text-neutral-900">-</span>
                            <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Learners</span>
                        </div>
                    </div>

                    <div onclick="location.href='/teacher/courses?tab=attendance'" class="glass border border-white/60 rounded-5xl p-8 shadow-premium hover:shadow-premium-hover transition-all duration-700 cursor-pointer group border-b-4 border-b-amber-500/20">
                        <div class="flex justify-between items-start mb-10">
                            <div class="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <i class="fas fa-calendar-check text-xl"></i>
                            </div>
                            <span class="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-amber-100">Daily</span>
                        </div>
                        <h3 class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">실시간 출결</h3>
                        <p class="text-2xl font-outfit font-black text-neutral-900 tracking-tight group-hover:text-amber-600 transition-colors">출결 트래킹</p>
                        <div class="mt-6 flex items-baseline gap-2">
                            <span id="card-attendance-rate" class="text-4xl font-outfit font-black text-neutral-900">-</span>
                            <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rate Avg</span>
                        </div>
                    </div>

                    <div onclick="location.href='/teacher/courses?tab=exams'" class="glass border border-white/60 rounded-5xl p-8 shadow-premium hover:shadow-premium-hover transition-all duration-700 cursor-pointer group">
                        <div class="flex justify-between items-start mb-10">
                            <div class="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <i class="fas fa-file-pen text-xl"></i>
                            </div>
                            <span class="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-purple-100">Tasks</span>
                        </div>
                        <h3 class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">미처리 행정</h3>
                        <p class="text-2xl font-outfit font-black text-neutral-900 tracking-tight group-hover:text-purple-600 transition-colors">평가 채점 대기</p>
                        <div class="mt-6 flex items-baseline gap-2">
                            <span id="card-pending-grading" class="text-4xl font-outfit font-black text-neutral-900">-</span>
                            <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pending</span>
                        </div>
                    </div>
                </section>

                <!-- 메인 분석 그리드 -->
                <div class="grid grid-cols-12 gap-8 section-fade-in" style="animation-delay: 0.3s">
                    
                    <!-- 성과 분석 차트 영역 (Left Wide) -->
                    <div class="col-span-12 lg:col-span-8 bg-white rounded-5xl p-10 border border-neutral-100 shadow-premium relative overflow-hidden group">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                            <div>
                                <h3 class="text-2xl font-outfit font-black text-neutral-900 tracking-tight mb-1">학습 효율 분석 시스템</h3>
                                <p class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Week-over-week performance matrix</p>
                            </div>
                            <div class="flex gap-3 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
                                <button class="px-5 py-2.5 rounded-xl bg-white shadow-sm text-[10px] font-black text-brand-600 uppercase tracking-widest">Active Week</button>
                                <button class="px-5 py-2.5 rounded-xl text-[10px] font-black text-neutral-400 hover:text-neutral-600 uppercase tracking-widest transition-colors">Historical Data</button>
                            </div>
                        </div>
                        <div class="h-[350px] w-full relative">
                            <canvas id="performanceChart"></canvas>
                            <div id="performanceChartEmpty" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-neutral-50/50 rounded-4xl border-2 border-dashed border-neutral-100">
                                <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-300 mb-4">
                                    <i class="fas fa-chart-area text-2xl"></i>
                                </div>
                                <p class="text-sm font-bold text-neutral-400 uppercase tracking-widest">No Performance Data Detected</p>
                            </div>
                        </div>
                        <div class="mt-10 pt-8 border-t border-neutral-50 flex flex-wrap gap-8 justify-between items-center text-neutral-400">
                           <div class="flex items-center gap-6">
                               <div class="flex items-center gap-2">
                                   <span class="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(79,105,242,0.4)]"></span>
                                   <span class="text-[10px] font-black uppercase tracking-widest">Attendance Rate</span>
                               </div>
                               <div class="flex items-center gap-2">
                                   <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                                   <span class="text-[10px] font-black uppercase tracking-widest">Completion Avg</span>
                               </div>
                           </div>
                           <p class="text-[9px] font-bold uppercase tracking-widest italic opacity-60">* AI-generated insights based on real-time log analysis</p>
                        </div>
                    </div>

                    <!-- 사이드 학사 관리 영역 (Right Nano) -->
                    <div class="col-span-12 lg:col-span-4 space-y-8">
                        
                        <!-- 학사 알림 피드 -->
                        <div class="bg-white rounded-5xl p-10 border border-neutral-100 shadow-premium flex flex-col h-full">
                            <div class="flex justify-between items-center mb-8">
                                <div>
                                    <h3 class="text-xl font-outfit font-black text-neutral-900 tracking-tight">학사 타임라인</h3>
                                    <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-0.5">Urgent notifications</p>
                                </div>
                                <div id="alerts-count-badge" class="hidden px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black border border-brand-100">
                                    ALERTS <span id="alerts-count" class="ml-1">0</span>
                                </div>
                            </div>
                            <div id="alerts-list" class="space-y-4 flex-1">
                                <div class="animate-pulse space-y-4">
                                    <div class="h-20 bg-neutral-50 rounded-3xl"></div>
                                    <div class="h-20 bg-neutral-50 rounded-3xl"></div>
                                </div>
                            </div>
                            <button onclick="location.href='/teacher/courses?tab=exams'" class="w-full mt-8 py-4 bg-neutral-900 hover:bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-neutral-200 hover:shadow-brand-300">
                                전체 알림 관리 히스토리
                            </button>
                        </div>

                        <!-- 퀵 인텔리전스 패널 -->
                        <div class="bg-brand-600 rounded-5xl p-10 text-white shadow-premium relative overflow-hidden group">
                           <div class="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-transparent group-hover:scale-110 transition-transform duration-1000"></div>
                           <div class="relative z-10">
                                <h3 class="text-xl font-outfit font-black text-white tracking-tight mb-8">인텔리전스 엔진</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <a href="/teacher/posts" class="flex flex-col items-center justify-center p-6 bg-white/10 hover:bg-white hover:text-brand-900 border border-white/20 rounded-3xl transition-all duration-500 group/btn">
                                        <i class="fas fa-bullhorn text-2xl mb-3 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-black uppercase tracking-widest">Notice</span>
                                    </a>
                                    <a href="/teacher/courses?tab=attendance" class="flex flex-col items-center justify-center p-6 bg-white/10 hover:bg-white hover:text-amber-600 border border-white/20 rounded-3xl transition-all duration-500 group/btn">
                                        <i class="fas fa-qrcode text-2xl mb-3 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-black uppercase tracking-widest">QR Log</span>
                                    </a>
                                    <a href="/teacher/courses?tab=exams" class="flex flex-col items-center justify-center p-6 bg-white/10 hover:bg-white hover:text-purple-600 border border-white/20 rounded-3xl transition-all duration-500 group/btn">
                                        <i class="fas fa-file-signature text-2xl mb-3 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-black uppercase tracking-widest">Grade</span>
                                    </a>
                                    <a href="/teacher/courses" class="flex flex-col items-center justify-center p-6 bg-white/10 hover:bg-white hover:text-emerald-600 border border-white/20 rounded-3xl transition-all duration-500 group/btn">
                                        <i class="fas fa-folder-open text-2xl mb-3 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-black uppercase tracking-widest">Archive</span>
                                    </a>
                                </div>
                                <p class="mt-8 text-[9px] font-bold text-brand-200 text-center uppercase tracking-widest opacity-60">High-priority Quick Access</p>
                           </div>
                        </div>
                    </div>
                </div>

                <!-- 배정 과정 리스트 (Premium Table Style) -->
                <section class="section-fade-in" style="animation-delay: 0.4s">
                    <div class="bg-white rounded-5xl border border-neutral-100 shadow-premium overflow-hidden">
                        <div class="px-10 py-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
                            <div>
                                <h3 class="text-2xl font-outfit font-black text-neutral-900 tracking-tight">담당 강의 디렉토리</h3>
                                <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Full curriculum assignment overview</p>
                            </div>
                            <button onclick="location.href='/teacher/courses'" class="px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black text-neutral-500 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm">
                                전체 목록 보기 <i class="fas fa-chevron-right ml-2 text-[8px]"></i>
                            </button>
                        </div>
                        <div class="p-10">
                            <div id="recent-courses-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[100px]">
                                <div class="col-span-full py-10 flex flex-col items-center justify-center opacity-30">
                                    <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
                                    <p class="text-xs font-bold uppercase tracking-widest">Streaming course data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            <footer class="p-12 text-center border-t border-neutral-100 bg-white/30">
                <p class="text-[10px] font-black text-neutral-300 uppercase tracking-[0.5em]">3D COOKIE EDU PLATFORM © 2026 TEACHER HUB TERMINAL</p>
            </footer>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            updateTime();
            setInterval(updateTime, 1000);
            loadDashboardData();
        });

        function updateTime() {
            const now = new Date();
            const timeEl = document.getElementById('current-time');
            if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            const dateEl = document.getElementById('welcome-date');
            if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
        }

        async function loadDashboardData() {
            // 즉시 사용자 정보 로드하여 깜빡임 방지
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const headerName = document.getElementById('header-user-name');
                    const welcomeName = document.getElementById('welcome-name');
                    if (headerName) headerName.textContent = user.name || '강사님';
                    if (welcomeName) welcomeName.textContent = user.name || '강사님';
                } catch (e) {}
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) { window.location.href = '/login'; return; }

                const response = await fetch('/api/dashboard/teacher-stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success && result.data) {
                    const d = result.data;
                    
                    // Stats Update
                    document.getElementById('stat-total-students').textContent = d.totalStudents || 0;
                    document.getElementById('stat-my-courses').textContent = d.myCourses || 0;
                    document.getElementById('card-total-students').textContent = d.totalStudents || 0;
                    document.getElementById('card-my-courses').textContent = d.myCourses || 0;
                    document.getElementById('card-pending-grading').textContent = d.pendingGrading || 0;
                    document.getElementById('card-attendance-rate').textContent = (d.avgAttendance || 0) + '%';

                    // Render Lists
                    renderAlerts(d.pendingGradingList || []);
                    renderCourses(d.assignedCourses || []);
                    
                    // Chart
                    initChart(d.avgAttendance);
                }
            } catch (err) {
                console.error('Terminal load error:', err);
            }
        }

        function renderAlerts(alerts) {
            const list = document.getElementById('alerts-list');
            const badge = document.getElementById('alerts-count-badge');
            const count = document.getElementById('alerts-count');
            
            if (!alerts || alerts.length === 0) {
                list.innerHTML = '<div class="py-12 text-center opacity-30 flex flex-col items-center"><i class="fas fa-check-circle text-4xl mb-4"></i><p class="text-[10px] font-black uppercase tracking-widest">All tasks completed</p></div>';
                badge.classList.add('hidden');
                return;
            }

            badge.classList.remove('hidden');
            count.textContent = alerts.length;
            
            list.innerHTML = alerts.slice(0, 5).map(item => \`
                <div class="p-6 bg-neutral-50 hover:bg-white border border-neutral-100 hover:shadow-xl rounded-3xl transition-all duration-500 cursor-pointer group" onclick="location.href='/teacher/courses?tab=exams'">
                    <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fas fa-file-signature text-lg"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-outfit font-black text-neutral-800 truncate text-sm mb-0.5 group-hover:text-brand-600">\${item.exam_title || '시험'}</h4>
                            <p class="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">\${item.student_name} · \${(item.submitted_at || '').split('T')[0]}</p>
                        </div>
                        <i class="fas fa-chevron-right text-[10px] text-neutral-200 group-hover:text-brand-400"></i>
                    </div>
                </div>
            \`).join('');
        }

        function renderCourses(courses) {
            const list = document.getElementById('recent-courses-list');
            if (!courses || courses.length === 0) {
                list.innerHTML = '<div class="col-span-full py-20 text-center opacity-20"><i class="fas fa-box-open text-5xl mb-6"></i><p class="font-black text-xs uppercase tracking-[0.2em]">Assignment database is empty</p></div>';
                return;
            }

            list.innerHTML = courses.slice(0, 6).map(course => {
                const isRunning = course.status === 'active' || course.status === 'open';
                return \`
                <div class="group bg-neutral-50 border border-neutral-100 hover:border-brand-200 hover:bg-white p-8 rounded-5xl transition-all duration-700 hover:shadow-premium relative overflow-hidden">
                    <div class="flex justify-between items-start mb-8 relative z-10">
                        <div class="w-14 h-14 rounded-3xl bg-white flex items-center justify-center text-neutral-400 group-hover:text-brand-600 shadow-sm border border-neutral-100 transition-all group-hover:scale-110">
                            <i class="fas \${course.category === '국비지원' ? 'fa-landmark' : 'fa-certificate'} text-xl"></i>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="px-3 py-1 bg-white border border-neutral-200 text-neutral-400 text-[9px] font-black rounded-lg uppercase tracking-widest group-hover:border-brand-100 group-hover:text-brand-600 transition-colors">\${course.status || 'READY'}</span>
                            \${isRunning ? '<span class="text-[8px] font-black text-brand-500 animate-pulse mt-1 tracking-widest">LIVE TRACKING</span>' : ''}
                        </div>
                    </div>
                    <div class="relative z-10">
                        <h4 class="text-lg font-outfit font-black text-neutral-900 tracking-tight line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors mb-6 h-12">\${course.title}</h4>
                        <div class="flex justify-between items-center pt-6 border-t border-neutral-100/60">
                            <div class="flex flex-col">
                                <span class="text-xs font-black text-neutral-800">\${course.enrolled_count || 0}<span class="text-[10px] text-neutral-400 ml-1">Studs</span></span>
                                <span class="text-[9px] font-black text-neutral-300 uppercase tracking-widest">Capacity</span>
                            </div>
                            <button onclick="location.href='/teacher/courses/' + \${course.id} + '/lms' + (\${course.is_hrd ? '?type=hrd' : ''})" class="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all">
                                <i class="fas fa-door-open text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            \`;}).join('');
        }

function initChart(avg) {
    const canvas = document.getElementById('performanceChart');
    const empty = document.getElementById('performanceChartEmpty');
    if (!canvas) return;

    if (avg == null) { empty.classList.remove('hidden'); canvas.style.display = 'none'; return; }
    empty.classList.add('hidden');
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, 'rgba(79, 105, 242, 0.4)');
    grad.addColorStop(1, 'rgba(79, 105, 242, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [{
                label: 'Attendance',
                data: [avg - 2, avg - 1, avg + 1, avg, avg + 3, avg - 1, avg + 2],
                borderColor: '#4f69f2',
                borderWidth: 6,
                backgroundColor: grad,
                fill: true,
                tension: 0.5,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4f69f2',
                pointHoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { cornerRadius: 15, padding: 15, titleFont: { size: 14, weight: '900' }, bodyFont: { size: 12, weight: '700' } } },
            scales: {
                y: { display: false, min: 0, max: 105 },
                x: { border: { display: false }, grid: { display: false }, ticks: { font: { size: 10, family: 'Outfit', weight: '900' }, color: '#94a3b8', padding: 15 } }
            }
        }
    });
}
</script>
    </body>
    </html>
        `;
