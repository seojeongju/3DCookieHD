import { teacherSidebar } from './components/teacher_sidebar';

export const teacherDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지능형 강사 대시보드 - 3D Cookie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
            },
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              },
              industry: {
                dark: '#0f172a',
                glass: 'rgba(255, 255, 255, 0.03)',
                border: 'rgba(255, 255, 255, 0.1)',
              }
            },
            borderRadius: {
              '3xl': '1.5rem',
              '4xl': '2rem',
            }
          }
        }
      }
    </script>
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        body { background-color: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 (Bento v2.0) -->
        ${teacherSidebar('dashboard')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            
            <!-- 상단 헤더 -->
            <header class="sticky top-0 z-20 px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        강사 전용 대시보드
                        <span class="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">핵심</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">지능형 학습 관리 시스템 V2.0 (강사 모드)</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200/60 group cursor-help transition-all hover:bg-white shadow-sm">
                        <i class="fas fa-clock text-blue-500 text-xs"></i>
                        <span id="current-time" class="text-xs font-black text-slate-700 tracking-tighter">00:00:00</span>
                    </div>
                    <button onclick="location.href='/'" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200/60 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <i class="fas fa-external-link-alt text-sm"></i>
                    </button>
                    <div class="h-8 w-px bg-slate-200 mx-2"></div>
                    <div class="flex items-center gap-3 pl-2">
                        <div class="text-right flex flex-col">
                            <span id="header-user-name" class="text-sm font-black text-slate-900">-</span>
                            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">지도 교수</span>
                        </div>
                        <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 border border-white/20">
                            <i class="fas fa-user-tie"></i>
                        </div>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-[1600px] mx-auto space-y-8 relative z-10">
                
                <!-- 0. 환영 메시지 및 상태 요약 -->
                <section class="animate-fade-in" style="animation-delay: 0.1s">
                    <div class="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                        <div class="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                        <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"></div>
                        
                        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <h2 class="text-3xl font-black tracking-tight mb-2">반갑습니다, <span id="welcome-name">-</span> 강사님.</h2>
                                <p class="text-indigo-200 text-sm font-medium max-w-lg leading-relaxed">오늘도 3D 기술의 미래를 위한 열정적인 강의 부탁드립니다. 담당하시는 교육생들의 성장을 위해 최적화된 교육 환경을 제공합니다.</p>
                                <div class="mt-6 flex gap-3">
                                    <div class="px-4 py-2 bg-white/10 border border-white/10 rounded-2xl flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span class="text-xs font-black uppercase tracking-widest text-indigo-100">시스템 정상 가동</span>
                                    </div>
                                    <div class="px-4 py-2 bg-indigo-500/30 border border-white/10 rounded-2xl flex items-center gap-2">
                                        <i class="fas fa-calendar-alt text-xs text-indigo-300"></i>
                                        <span id="welcome-date" class="text-xs font-black uppercase tracking-widest text-indigo-100">-</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-8 px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm">
                                <div class="text-center">
                                    <span class="block text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-1">총 수강인원</span>
                                    <span class="text-3xl font-black" id="stat-total-students">0</span>
                                    <span class="block text-[10px] font-black text-indigo-300 uppercase mt-1">명</span>
                                </div>
                                <div class="w-px h-12 bg-white/10 self-center"></div>
                                <div class="text-center">
                                    <span class="block text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-1">진행 중인 과정</span>
                                    <span class="text-3xl font-black" id="stat-my-courses">0</span>
                                    <span class="block text-[10px] font-black text-indigo-300 uppercase mt-1">개</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 1. 핵심 지표 섹션 (High Fidelity Bento Grid) -->
                <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style="animation-delay: 0.2s">
                    <!-- 담당 과정 바로가기 -->
                    <div onclick="location.href='/teacher/courses'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-blue-200">
                        <div class="flex justify-between items-start mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-blue-100">
                                <i class="fas fa-chalkboard-teacher text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">운영</span>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">학사 운영</span>
                            <h3 class="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">나의 강의 현황</h3>
                            <div class="mt-4 flex items-baseline gap-2">
                                <span id="card-my-courses" class="text-3xl font-black text-slate-900">-</span>
                                <span class="text-xs font-bold text-slate-400">강의</span>
                            </div>
                        </div>
                    </div>

                    <!-- 수강생 분석 바로가기 -->
                    <div onclick="location.href='/teacher/courses?tab=students'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-orange-200">
                        <div class="flex justify-between items-start mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm border border-orange-100">
                                <i class="fas fa-user-graduate text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-widest">분석</span>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">수강생 분석</span>
                            <h3 class="text-xl font-black text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">수강생 정밀 분석</h3>
                            <div class="mt-4 flex items-baseline gap-2">
                                <span id="card-total-students" class="text-3xl font-black text-slate-900">-</span>
                                <span class="text-xs font-bold text-slate-400">명</span>
                            </div>
                        </div>
                    </div>

                    <!-- 출석 관리 바로가기 -->
                    <div onclick="location.href='/teacher/courses?tab=attendance'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-emerald-200">
                        <div class="flex justify-between items-start mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                                <i class="fas fa-calendar-check text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest">관리</span>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">출결 현황</span>
                            <h3 class="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">출결 자동 추적</h3>
                            <div class="mt-4 flex items-baseline gap-2">
                                <span id="card-attendance-rate" class="text-3xl font-black text-slate-900">-</span>
                                <span class="text-xs font-bold text-slate-400">평균 출석률</span>
                            </div>
                        </div>
                    </div>

                    <!-- 채점 대기 바로가기 -->
                    <div onclick="location.href='/teacher/courses?tab=exams'" class="bento-card bg-white rounded-[2rem] p-6 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-purple-200">
                        <div class="flex justify-between items-start mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm border border-purple-100">
                                <i class="fas fa-clipboard-check text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full uppercase tracking-widest">평가</span>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">업무 알림</span>
                            <h3 class="text-xl font-black text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors">평가 채점 관리</h3>
                            <div class="mt-4 flex items-baseline gap-2">
                                <span id="card-pending-grading" class="text-3xl font-black text-slate-900">-</span>
                                <span class="text-xs font-bold text-slate-400">건</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="grid grid-cols-12 gap-6 animate-fade-in" style="animation-delay: 0.3s">
                    <!-- 2. 주간 강의 성과 그래프 (Large Widget) -->
                    <div class="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                        <div class="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 class="text-xl font-black text-slate-900 tracking-tight">주간 강의 성과 분석</h3>
                                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">학업 성취도 및 출석률 추이</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors">이번 주</button>
                                <button class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">지난 주</button>
                            </div>
                        </div>
                        <div class="h-64 relative z-10 flex items-center justify-center" id="weeklyChartWrap">
                            <p id="weeklyChartEmpty" class="text-slate-400 text-sm font-bold">데이터가 없습니다.</p>
                        </div>
                        <!-- Background decoration -->
                        <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </div>

                    <!-- 3. 주요 학사 알림 및 빠른 실행 (Side Widgets) -->
                    <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        
                        <!-- 알림 위젯 -->
                        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex-1">
                            <div class="flex justify-between items-start mb-6">
                                <div>
                                    <h3 class="text-xl font-black text-slate-900 tracking-tight">주요 학사 알림</h3>
                                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">채점 대기 등</p>
                                </div>
                                <div id="alerts-count-badge" class="px-2 py-1 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-rose-100 flex items-center gap-1 hidden">
                                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                    <span id="alerts-count">0</span>건
                                </div>
                            </div>
                            <div id="alerts-list" class="space-y-3">
                                <p class="text-sm text-slate-400 py-4 text-center">데이터를 불러오는 중...</p>
                            </div>
                        </div>

                        <!-- 빠른 실행 위젯 -->
                        <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                           <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent group-hover:opacity-100 transition-opacity"></div>
                           <div class="relative z-10">
                                <h3 class="text-xl font-black text-white tracking-tight mb-6">빠른 실행</h3>
                                <div class="grid grid-cols-2 gap-3">
                                    <a href="/teacher/posts" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-slate-400 group/btn">
                                        <i class="fas fa-bullhorn text-xl mb-2 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-bold">공지사항 작성</span>
                                    </a>
                                    <a href="/teacher/courses?tab=exams" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all text-slate-400 group/btn">
                                        <i class="fas fa-edit text-xl mb-2 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-bold">시험 출제</span>
                                    </a>
                                    <a href="/teacher/courses?tab=surveys" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition-all text-slate-400 group/btn">
                                        <i class="fas fa-poll text-xl mb-2 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-bold">설문 생성</span>
                                    </a>
                                    <a href="/teacher/courses?tab=attendance" class="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-orange-600 hover:border-orange-500 hover:text-white transition-all text-slate-400 group/btn">
                                        <i class="fas fa-qrcode text-xl mb-2 group-hover/btn:scale-110 transition-transform"></i>
                                        <span class="text-[10px] font-bold">QR 출결</span>
                                    </a>
                                </div>
                           </div>
                        </div>

                    </div>
                </div>
            </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 0.3s">
                    <!-- 2. 주간 스케줄 및 알림 (Left Column) -->
                    <div class="lg:col-span-2 space-y-8">
                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                        <i class="fas fa-calendar-alt text-sm"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-800 tracking-tight">강의 주간 지표</h3>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">주간 성과 분석</p>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest">필터</button>
                                    <button class="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition uppercase tracking-widest shadow-lg shadow-indigo-100">보고서</button>
                                </div>
                            </div>
                            <div class="p-8">
                                <div class="h-[300px] relative" id="performanceChartWrap">
                                    <canvas id="performanceChart"></canvas>
                                    <p id="performanceChartEmpty" class="hidden absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold">데이터가 없습니다.</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm">
                            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-100">
                                        <i class="fas fa-bell text-sm"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-800 tracking-tight">최근 학사 알림</h3>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">채점 대기 목록</p>
                                    </div>
                                </div>
                                <span id="recent-alerts-count" class="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest">0건</span>
                            </div>
                            <div id="recent-alerts-list" class="divide-y divide-slate-50">
                                <p class="text-sm text-slate-400 py-6 text-center">데이터를 불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 3. 빠른 작업 및 오늘의 강의 (Right Column) -->
                    <div class="space-y-8">
                        <section class="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
                             <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/10">
                                    <i class="fas fa-bolt text-sm"></i>
                                </div>
                                <h3 class="font-black tracking-tight">인텔리전스 액션</h3>
                            </div>
                            <div class="space-y-3">
                                <button onclick="location.href='/teacher/courses?tab=attendance'" class="w-full p-4 bg-white/10 hover:bg-white text-indigo-100 hover:text-indigo-900 border border-white/10 rounded-[1.5rem] font-black text-sm transition-all duration-300 flex items-center justify-between group">
                                    <span class="flex items-center gap-3">
                                        <i class="fas fa-qrcode text-indigo-400 group-hover:text-indigo-600 transition-colors"></i>
                                        QR 출결 시스템 가동
                                    </span>
                                    <i class="fas fa-chevron-right text-[10px] opacity-30 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <button onclick="location.href='/teacher/courses'" class="w-full p-4 bg-white/10 hover:bg-white text-indigo-100 hover:text-indigo-900 border border-white/10 rounded-[1.5rem] font-black text-sm transition-all duration-300 flex items-center justify-between group">
                                    <span class="flex items-center gap-3">
                                        <i class="fas fa-clipboard-list text-indigo-400 group-hover:text-indigo-600 transition-colors"></i>
                                        훈련일지 일괄 작성
                                    </span>
                                    <i class="fas fa-chevron-right text-[10px] opacity-30 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                            </div>
                        </section>

                        <section class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8">
                            <div class="flex justify-between items-center mb-8">
                                <h3 class="font-black text-slate-800 tracking-tight">진행 중인 강의</h3>
                                <button class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">전체 보기</button>
                            </div>
                            <div id="recent-courses-list" class="space-y-6">
                                <div class="animate-pulse space-y-4">
                                    <div class="h-12 bg-slate-100 rounded-2xl"></div>
                                    <div class="h-12 bg-slate-100 rounded-2xl"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            updateTime();
            setInterval(updateTime, 1000);
            loadDashboardData();
        });

        function emptyStr(v) {
            return (v !== undefined && v !== null && v !== '') ? String(v) : '데이터가 없습니다.';
        }

        function updateTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const timeEl = document.getElementById('current-time');
            if (timeEl) timeEl.textContent = timeStr;
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
            const dateEl = document.getElementById('welcome-date');
            if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', options);
        }

        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    location.href = '/login';
                    return;
                }

                const userStr = localStorage.getItem('user');
                const userName = userStr ? (JSON.parse(userStr).name || '') : '';
                document.getElementById('header-user-name').textContent = emptyStr(userName);
                document.getElementById('welcome-name').textContent = emptyStr(userName);
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.role !== 'teacher' && user.role !== 'admin') {
                        location.href = '/';
                        return;
                    }
                }

                const response = await fetch('/api/dashboard/teacher-stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                const noData = '데이터가 없습니다.';
                if (!result.success || !result.data) {
                    document.getElementById('stat-total-students').textContent = noData;
                    document.getElementById('stat-my-courses').textContent = noData;
                    document.getElementById('card-my-courses').textContent = noData;
                    document.getElementById('card-total-students').textContent = noData;
                    document.getElementById('card-attendance-rate').textContent = noData;
                    document.getElementById('card-pending-grading').textContent = noData;
                    document.getElementById('recent-courses-list').innerHTML = '<p class="text-sm text-slate-400 text-center py-4">데이터가 없습니다.</p>';
                    document.getElementById('alerts-list').innerHTML = '<p class="text-sm text-slate-400 py-4 text-center">데이터가 없습니다.</p>';
                    document.getElementById('recent-alerts-list').innerHTML = '<p class="text-sm text-slate-400 py-6 text-center">데이터가 없습니다.</p>';
                    initChart(null);
                    return;
                }

                const d = result.data;
                const myCourses = d.myCourses != null ? d.myCourses : noData;
                const totalStudents = d.totalStudents != null ? d.totalStudents : noData;
                const pendingGrading = d.pendingGrading != null ? d.pendingGrading : noData;
                const avgAttendance = d.avgAttendance != null ? d.avgAttendance : null;
                const recentCourses = d.recentCourses || [];
                const pendingGradingList = d.pendingGradingList || [];

                document.getElementById('stat-my-courses').textContent = myCourses;
                document.getElementById('stat-total-students').textContent = totalStudents;
                document.getElementById('card-my-courses').textContent = myCourses;
                document.getElementById('card-total-students').textContent = totalStudents;
                document.getElementById('card-pending-grading').textContent = pendingGrading;

                const attEl = document.getElementById('card-attendance-rate');
                if (avgAttendance != null && typeof avgAttendance === 'number') {
                    attEl.textContent = avgAttendance + '%';
                } else {
                    attEl.textContent = noData;
                }

                const listContainer = document.getElementById('recent-courses-list');
                if (!recentCourses.length) {
                    listContainer.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">데이터가 없습니다.</p>';
                } else {
                    const enrolledKey = recentCourses[0].enrolled_count != null ? 'enrolled_count' : 'student_count';
                    listContainer.innerHTML = recentCourses.slice(0, 3).map(course => {
                        const idStr = String(course.id).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                        const lmsUrl = "/admin/courses/" + idStr + "/lms";
                        return '<div class="flex items-center gap-4 group">' +
                            '<div class="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/50 group-hover:scale-105 transition-transform">' +
                                '<img src="' + (course.thumbnail || '/static/logo.png') + '" class="w-full h-full object-cover" alt="Course">' +
                            '</div>' +
                            '<div class="flex-1 min-w-0">' +
                                '<h4 class="text-sm font-black text-slate-800 truncate tracking-tight group-hover:text-blue-600 transition-colors">' + emptyStr(course.title) + '</h4>' +
                                '<div class="flex items-center gap-2 mt-1">' +
                                    '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">' + (course.category || '-') + '</span>' +
                                    '<span class="w-1 h-1 rounded-full bg-slate-300"></span>' +
                                    '<span class="text-[10px] font-bold text-blue-500">' + (course[enrolledKey] != null ? course[enrolledKey] : 0) + '명</span>' +
                                '</div>' +
                            '</div>' +
                            '<button onclick="location.href=\'' + lmsUrl + '\'" class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">' +
                                '<i class="fas fa-cog text-xs"></i>' +
                            '</button>' +
                        '</div>';
                    }).join('');
                }

                const alertsList = document.getElementById('alerts-list');
                const alertsCountBadge = document.getElementById('alerts-count-badge');
                const alertsCountEl = document.getElementById('alerts-count');
                if (pendingGradingList.length === 0) {
                    alertsList.innerHTML = '<p class="text-sm text-slate-400 py-4 text-center">데이터가 없습니다.</p>';
                    if (alertsCountBadge) alertsCountBadge.classList.add('hidden');
                } else {
                    if (alertsCountBadge) alertsCountBadge.classList.remove('hidden');
                    if (alertsCountEl) alertsCountEl.textContent = pendingGradingList.length;
                    alertsList.innerHTML = pendingGradingList.slice(0, 5).map(function (item) {
                        const rawTitle = item.exam_title || '시험';
                        const rawSub = (item.student_name || '학생') + ' - ' + (item.submitted_at ? item.submitted_at.split('T')[0] : '');
                        const title = String(rawTitle).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        const sub = String(rawSub).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        return '<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer group" onclick="location.href=\'/teacher/courses?tab=exams\'">' +
                            '<div class="flex gap-3">' +
                                '<div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"><i class="fas fa-file-signature"></i></div>' +
                                '<div><h4 class="font-bold text-slate-800 text-sm">채점 대기: ' + title + '</h4><p class="text-xs text-slate-500 mt-0.5">' + sub + '</p></div>' +
                            '</div></div>';
                    }).join('');
                }

                const recentAlertsList = document.getElementById('recent-alerts-list');
                const recentAlertsCount = document.getElementById('recent-alerts-count');
                if (recentAlertsCount) recentAlertsCount.textContent = pendingGradingList.length + '건';
                if (pendingGradingList.length === 0) {
                    recentAlertsList.innerHTML = '<p class="text-sm text-slate-400 py-6 text-center">데이터가 없습니다.</p>';
                } else {
                    recentAlertsList.innerHTML = pendingGradingList.slice(0, 5).map(function (item) {
                        const rawTitle = item.exam_title || '시험';
                        const rawSub = (item.student_name || '학생') + (item.submitted_at ? ' - ' + item.submitted_at.split('T')[0] : '');
                        const title = String(rawTitle).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        const sub = String(rawSub).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        return '<div class="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group" onclick="location.href=\'/teacher/courses?tab=exams\'">' +
                            '<div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0"><i class="fas fa-clipboard-check text-sm"></i></div>' +
                            '<div class="flex-1 min-w-0">' +
                                '<h4 class="font-bold text-slate-800 text-sm">채점 대기: ' + title + '</h4>' +
                                '<p class="text-xs text-slate-500 mt-1">' + sub + '</p>' +
                            '</div></div>';
                    }).join('');
                }

                initChart(avgAttendance);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                document.getElementById('stat-total-students').textContent = '데이터가 없습니다.';
                document.getElementById('stat-my-courses').textContent = '데이터가 없습니다.';
                document.getElementById('card-my-courses').textContent = '데이터가 없습니다.';
                document.getElementById('card-total-students').textContent = '데이터가 없습니다.';
                document.getElementById('card-attendance-rate').textContent = '데이터가 없습니다.';
                document.getElementById('card-pending-grading').textContent = '데이터가 없습니다.';
                document.getElementById('recent-courses-list').innerHTML = '<p class="text-sm text-slate-400 text-center py-4">데이터가 없습니다.</p>';
                document.getElementById('alerts-list').innerHTML = '<p class="text-sm text-slate-400 py-4 text-center">데이터가 없습니다.</p>';
                document.getElementById('recent-alerts-list').innerHTML = '<p class="text-sm text-slate-400 py-6 text-center">데이터가 없습니다.</p>';
                initChart(null);
            }
        }

        function initChart(avgAttendance) {
            const wrap = document.getElementById('performanceChartWrap');
            const emptyEl = document.getElementById('performanceChartEmpty');
            const canvas = document.getElementById('performanceChart');
            if (!canvas) return;

            if (avgAttendance == null || (typeof avgAttendance === 'number' && isNaN(avgAttendance))) {
                if (emptyEl) emptyEl.classList.remove('hidden');
                canvas.style.display = 'none';
                return;
            }
            if (emptyEl) emptyEl.classList.add('hidden');
            canvas.style.display = 'block';

            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            const val = typeof avgAttendance === 'number' ? avgAttendance : 0;
            const dataArr = [val, val, val, val, val, val, val];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['월', '화', '수', '목', '금', '토', '일'],
                    datasets: [{
                        label: '평균 출석률 (%)',
                        data: dataArr,
                        borderColor: '#3b82f6',
                        borderWidth: 4,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#3b82f6',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' } }
                    }
                }
            });
        }
    </script>
</body>
</html>
`;
