import { hrdSidebar } from './components/hrd_sidebar';

const courseSubPageLayout = (
  activeMenu: string,
  title: string,
  description: string,
  icon: string,
  contentHtml: string
) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 과정 등록 기초 데이터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'] },
            borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
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
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar(activeMenu)}
        <main class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-100">
                        <i class="fas ${icon} text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-black text-slate-900 tracking-tight">${title}</h1>
                        <p class="text-sm font-medium text-slate-500 mt-0.5">${description}</p>
                    </div>
                </div>
                <a href="/admin/courses" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm text-slate-700">
                    <i class="fas fa-arrow-left"></i> 과정목록
                </a>
            </header>
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1600px] mx-auto space-y-8">
                    ${contentHtml}
                </div>
            </div>
        </main>
    </div>
</body>
</html>
`;

export const adminCoursesCategoriesHtml = () =>
  courseSubPageLayout(
    'courses-categories',
    '과정분류관리',
    '과정 등록을 위한 기초 데이터 — 카테고리(국비지원, 일반과정, 특강 등)를 등록·수정합니다.',
    'fa-tags',
    `
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
            <h2 class="font-black text-slate-800 tracking-tight">분류 목록</h2>
        </div>
        <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bento-card bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><i class="fas fa-book-open"></i></div>
                        <div>
                            <h3 class="font-bold text-slate-800">국비지원</h3>
                            <p class="text-xs text-slate-500">정부지원 훈련과정</p>
                        </div>
                    </div>
                </div>
                <div class="bento-card bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fas fa-graduation-cap"></i></div>
                        <div>
                            <h3 class="font-bold text-slate-800">일반과정</h3>
                            <p class="text-xs text-slate-500">일반 수강 과정</p>
                        </div>
                    </div>
                </div>
                <div class="bento-card bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><i class="fas fa-star"></i></div>
                        <div>
                            <h3 class="font-bold text-slate-800">특강</h3>
                            <p class="text-xs text-slate-500">단기 특별 강좌</p>
                        </div>
                    </div>
                </div>
            </div>
            <p class="mt-6 text-sm text-slate-500 text-center">기초 데이터로 등록한 분류는 과정등록 시 선택할 수 있습니다.</p>
        </div>
    </div>
    `
  );

export const adminCoursesApprovedHtml = () =>
  courseSubPageLayout(
    'courses-approved',
    '승인받은과정',
    '과정 등록을 위한 기초 데이터 — HRD넷 등 승인받은 과정 목록을 등록·조회합니다.',
    'fa-check-double',
    `
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80 flex justify-between items-center">
            <h2 class="font-black text-slate-800 tracking-tight">승인 과정 목록</h2>
            <button class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">새로고침</button>
        </div>
        <div class="p-8">
            <div class="rounded-2xl border border-slate-200/60 overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-6 py-3">과정명</th>
                            <th class="px-6 py-3">승인기관</th>
                            <th class="px-6 py-3">승인일</th>
                            <th class="px-6 py-3">상태</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr>
                            <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                                <i class="fas fa-inbox text-3xl mb-3 block"></i>
                                기초 데이터로 승인받은 과정을 등록하면 과정등록 시 선택할 수 있습니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
  );

export const adminCoursesSessionsHtml = () =>
  courseSubPageLayout(
    'courses-sessions',
    '회차별 과정개설',
    '과정 등록을 위한 기초 데이터 — 동일 과정의 회차(1기, 2기 등) 개설·관리합니다.',
    'fa-calendar-plus',
    `
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80 flex justify-between items-center">
            <h2 class="font-black text-slate-800 tracking-tight">회차 개설</h2>
            <a href="/admin/courses" class="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition">
                <i class="fas fa-plus mr-2"></i> 회차 개설
            </a>
        </div>
        <div class="p-8">
            <div class="rounded-2xl border border-slate-200/60 overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-6 py-3">기준과정</th>
                            <th class="px-6 py-3">회차</th>
                            <th class="px-6 py-3">교육기간</th>
                            <th class="px-6 py-3">상태</th>
                            <th class="px-6 py-3 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                                <i class="fas fa-calendar-plus text-3xl mb-3 block"></i>
                                기초 데이터로 회차를 등록해 두면 과정등록 시 해당 회차를 선택할 수 있습니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
  );

export const adminCoursesCopyHtml = () =>
  courseSubPageLayout(
    'courses-copy',
    '회차별 과정복사',
    '과정 등록을 위한 기초 데이터 — 기존 과정·회차를 복사해 새 회차를 빠르게 등록합니다.',
    'fa-copy',
    `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">복사할 과정 선택</h2>
            </div>
            <div class="p-6">
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" placeholder="과정명 검색..." class="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <ul class="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <li class="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm font-medium text-slate-700 cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition">검색 후 목록에서 선택하세요</li>
                </ul>
            </div>
        </div>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">복사 옵션</h2>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">새 회차명</label>
                    <input type="text" placeholder="예: 2025년 1기" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">복사할 항목</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> 교육일정</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> 강의계획</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> NCS 능력단위</label>
                    </div>
                </div>
                <button class="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <i class="fas fa-copy"></i> 과정 복사 실행
                </button>
            </div>
        </div>
    </div>
    <p class="text-sm text-slate-500 text-center">기초 데이터로 복사한 회차는 과정등록 시 바로 사용할 수 있습니다.</p>
    `
  );
