
import { hrdSidebar } from './components/hrd_sidebar';

export type AdminHrdExamsOptions = { questionBankOnly?: boolean };

export const adminHrdExamsHtml = (sidebar = hrdSidebar('exams'), options?: AdminHrdExamsOptions) => {
    const questionBankOnly = options?.questionBankOnly === true;
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${questionBankOnly ? '문제은행 - 교육행정 시스템' : '통합 시험/CBT 관리 - 교육행정 시스템'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
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
    ${questionBankOnly ? `
    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      .bento-card { transition: all 0.25s ease; }
      .bento-card:hover { box-shadow: 0 12px 24px -8px rgb(0 0 0 / 0.08); border-color: rgb(148 163 184 / 0.4); }
      .question-bank-dots { background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 20px 20px; }
    </style>
    ` : ''}
</head>
<body class="${questionBankOnly ? 'bg-slate-50 font-sans text-slate-900 antialiased' : 'bg-gray-50 font-sans'}">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <div class="${questionBankOnly ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60' : 'bg-white border-b border-gray-200'} flex-shrink-0">
                <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div class="flex justify-between items-center flex-wrap gap-3">
                        <div>
                            <h1 class="${questionBankOnly ? 'text-xl sm:text-2xl font-black text-slate-800 tracking-tight' : 'text-xl sm:text-2xl font-bold text-gray-800 tracking-tight'}">${questionBankOnly ? '문제은행' : '통합 시험/CBT 현황'}</h1>
                            <p class="${questionBankOnly ? 'text-slate-500 mt-1 text-sm' : 'text-gray-500 mt-1 text-sm'}">${questionBankOnly ? '전역 문제은행에서 문제를 등록·관리하고, 회차를 선택해 사전평가 또는 NCS평가로 편성할 수 있습니다.' : '모든 교육 과정의 시험 등록 현황 및 학생들의 응시율/평균 점수를 관리합니다.'}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="loadExamSummary()" class="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm hover:shadow" title="새로고침">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar ${questionBankOnly ? 'question-bank-dots' : ''}">
                <div class="max-w-7xl mx-auto space-y-6">
                    ${questionBankOnly ? '' : `<!-- 요약 통계 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-file-invoice text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">총 등록 시험</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalExams">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-user-edit text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">전체 응시 수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statTotalSubmissions">0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mr-4 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-chart-bar text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">전체 평균 점수</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight text-amber-600" id="statAvgScore">0.0</div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-all duration-300">
                            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <i class="fas fa-users text-xl"></i>
                            </div>
                            <div>
                                <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">평균 응시율</div>
                                <div class="text-2xl font-black text-gray-800 tracking-tight" id="statAvgRate">0%</div>
                            </div>
                        </div>
                    </div>

                    <!-- 과정별 현황 목록 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="relative z-30 px-8 py-6 pb-8 border-b border-gray-50 bg-white/50 backdrop-blur-md space-y-4">
                            <div class="flex flex-wrap justify-between items-center gap-4">
                                <h3 class="font-black text-gray-800 text-lg uppercase tracking-tight">과정별 시험 현황</h3>
                                <div class="flex items-center gap-3 flex-wrap">
                                    <select id="sortSelect" onchange="applyFilters()" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none relative z-10">
                                        <option value="latest" selected>최신순</option>
                                        <option value="name">과정명순</option>
                                        <option value="rate">응시율 높은순</option>
                                        <option value="score">평균점수 높은순</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center gap-3 min-h-[2.5rem]">
                                <div class="flex bg-gray-100 p-1 rounded-xl">
                                    <button onclick="setFilterType('all'); applyFilters();" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-type-btn active bg-white text-indigo-600 shadow-sm" data-filter-type="all">전체</button>
                                    <button onclick="setFilterType('active'); applyFilters();" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all filter-type-btn text-gray-500 hover:text-gray-700" data-filter-type="active">진행중</button>
                                </div>
                                <select id="statusFilter" onchange="applyFilters()" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none relative z-10" title="과정 상태">
                                    <option value="all">과정 상태: 전체</option>
                                    <option value="recruiting">모집중</option>
                                    <option value="in_progress">진행중</option>
                                    <option value="completed">마감</option>
                                    <option value="closed">종료</option>
                                    <option value="always_open">상시모집</option>
                                </select>
                                <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 min-w-[200px]">
                                    <i class="fas fa-search text-gray-400 mr-2 text-xs"></i>
                                    <input type="text" id="searchInput" oninput="applyFilters()" placeholder="과정명·강사명 검색" class="bg-transparent border-none outline-none text-sm w-full font-medium min-w-0">
                                </div>
                            </div>
                        </div>
                        <div class="overflow-x-auto relative z-0">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50">
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[min(320px,30%)]">교육 과정 정보</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">상태</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">담당 강사</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">등록 시험</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">응시 인원/전체</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">응시율</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">평균 점수</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="summaryTableBody" class="divide-y divide-gray-50">
                                    <tr>
                                        <td colspan="8" class="px-8 py-20 text-center text-gray-400">
                                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오고 있습니다...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="order-2 sm:order-1 inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-[11px] font-bold text-gray-500">
                                총 <span id="total-count" class="mx-1.5 text-indigo-600 font-extrabold">0</span>건
                                <div class="mx-3 w-px h-3 bg-gray-200"></div>
                                표시: <span id="current-range" class="ml-1.5 text-gray-900 font-extrabold text-xs">0-0</span>
                            </div>
                            <div class="order-1 sm:order-2 flex items-center p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm" id="paginationControls"></div>
                        </div>
                    </div>
                    `}

                    ${questionBankOnly ? `
                    <!-- 문제은행: 벤토 그리드 스타일 -->
                    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden bento-card">
                        <!-- 상단: 편성 설정 (글래스) -->
                        <div class="px-6 sm:px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md">
                            <h3 class="font-black text-slate-800 text-base sm:text-lg uppercase tracking-tight mb-1">편성 설정</h3>
                            <p class="text-xs text-slate-500 mb-4">추가 유형과 회차를 선택한 뒤, 좌측 문제을 선택해 우측으로 추가하세요.</p>
                            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">추가 유형</span>
                                    <div class="flex bg-slate-100 p-1 rounded-xl">
                                        <button type="button" id="addTypePre" onclick="setAddTargetType('pre')" class="add-type-btn px-4 py-2 rounded-lg text-xs font-bold transition bg-white text-indigo-600 shadow-sm border border-slate-200/60" data-type="pre"><i class="fas fa-clipboard-list mr-1.5 opacity-70"></i>사전평가</button>
                                        <button type="button" id="addTypeNcs" onclick="setAddTargetType('ncs')" class="add-type-btn px-4 py-2 rounded-lg text-xs font-bold transition text-slate-500 hover:text-slate-700" data-type="ncs"><i class="fas fa-certificate mr-1.5 opacity-70"></i>NCS평가</button>
                                    </div>
                                </div>
                                <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
                                <div class="flex items-center gap-2">
                                    <label class="text-[11px] font-bold text-slate-500 whitespace-nowrap">회차</label>
                                    <select id="mgmtSessionSelect" class="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 px-4 py-2.5 min-w-[200px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition" onchange="onMgmtSessionChange()">
                                        <option value="">회차 선택</option>
                                    </select>
                                </div>
                                <button type="button" id="mgmtAddExamBtn" class="hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm" onclick="openAddExamModal()"><i class="fas fa-plus"></i> 시험 추가</button>
                                <a id="mgmtCbtLink" href="#" class="hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition">이 회차 사전평가 관리</a>
                                <a id="rightPanelLink" href="#" class="hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50 transition">NCS평가관리에서 보기</a>
                            </div>
                        </div>
                        <div class="p-6 sm:p-8">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                <!-- 좌측: 문제은행 카드 -->
                                <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col overflow-hidden bento-card min-h-[420px]">
                                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                                        <div class="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h4 class="font-black text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2"><i class="fas fa-database text-indigo-500"></i> 문제은행 (전역)</h4>
                                                <p class="text-[11px] text-slate-500 mt-0.5">문제를 등록·검색한 뒤 체크하여 우측으로 편성하세요.</p>
                                            </div>
                                            <div class="inline-flex items-center gap-2">
                                                <button type="button" onclick="document.getElementById('bankPdfUploadInput').click()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition shadow-sm hover:shadow">
                                                    <i class="fas fa-file-pdf"></i> AI 문제 생성 (PDF)
                                                </button>
                                                <input type="file" id="bankPdfUploadInput" accept=".pdf" class="hidden" onchange="handleBankPdfUpload(this)">
                                                <button type="button" id="bankCreateQuestionBtn" onclick="openBankQuestionModal()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-sm hover:shadow">
                                                    <i class="fas fa-plus"></i> 문제 등록
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-2 mt-3">
                                            <div class="flex-1 min-w-[140px] flex items-center bg-white rounded-xl px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition">
                                                <i class="fas fa-search text-slate-400 mr-2 text-xs"></i>
                                                <input id="bankKeywordInput" type="text" placeholder="문제 내용 검색" class="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-400" onkeydown="if(event.key==='Enter'){loadQuestionBank();}">
                                            </div>
                                            <select id="bankTypeFilter" class="bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" onchange="loadQuestionBank()">
                                                <option value="">전체 유형</option>
                                                <option value="multiple_choice">객관식</option>
                                                <option value="short_answer">단답형</option>
                                                <option value="essay">서술형</option>
                                            </select>
                                            <select id="bankDifficultyFilter" class="bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" onchange="loadQuestionBank()">
                                                <option value="">난이도</option>
                                                <option value="low">하</option>
                                                <option value="medium">중</option>
                                                <option value="high">상</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="bankList" class="flex-1 min-h-[240px] max-h-[380px] overflow-y-auto custom-scrollbar p-4 space-y-3">
                                        <div class="flex flex-col items-center justify-center py-16 text-slate-400">
                                            <i class="fas fa-spinner fa-spin text-2xl mb-3"></i>
                                            <span class="text-xs font-medium">불러오는 중...</span>
                                        </div>
                                    </div>
                                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 flex-shrink-0">
                                        <span class="text-xs text-slate-500 font-medium" id="bankCountLabel"></span>
                                        <button type="button" onclick="importSelectedQuestions()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm" id="importBtn" disabled>
                                            <i class="fas fa-arrow-right"></i>
                                            <span id="importBtnLabel">선택 문제 추가</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- 우측: 편성 결과 카드 -->
                                <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col overflow-hidden bento-card min-h-[420px]">
                                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                                        <h4 class="font-black text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2" id="rightPanelTitle"><i class="fas fa-list-check text-indigo-500"></i> 이 회차 사전평가 문제</h4>
                                        <p class="text-[11px] text-slate-500 mt-0.5" id="examInfoLabel">회차를 선택하면 이 회차의 사전평가 문제가 표시됩니다.</p>
                                    </div>
                                    <div id="examQuestionList" class="flex-1 min-h-[240px] max-h-[380px] overflow-y-auto custom-scrollbar p-4 space-y-3">
                                        <div class="flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4">
                                            <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                                            <p class="text-xs font-medium">회차를 선택하면<br>편성된 문제가 여기 표시됩니다.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </main>
        </div>
    </div>

    <!-- 시험 추가 모달 -->
    <div id="addExamModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200/60">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-black text-gray-800 text-lg">시험 추가</h3>
                <button type="button" onclick="closeAddExamModal()" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><i class="fas fa-times"></i></button>
            </div>
            <form id="addExamForm" onsubmit="handleCreateExam(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">시험명</label>
                    <input type="text" name="title" required class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="예: 사전평가">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">시험 유형</label>
                    <select name="type" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20">
                        <option value="practice">연습문제</option>
                        <option value="mock">모의고사</option>
                        <option value="midterm">중간평가</option>
                        <option value="final">기말평가</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">제한 시간 (분)</label>
                    <input type="number" name="time_limit_minutes" value="60" min="1" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">시작 일시</label>
                        <input type="datetime-local" name="start_time" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">종료 일시</label>
                        <input type="datetime-local" name="end_time" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">설명 (선택)</label>
                    <textarea name="description" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="시험 안내 등"></textarea>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeAddExamModal()" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">취소</button>
                    <button type="submit" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700">생성</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 문제 등록 모달 (문제은행 전용) -->
    <div id="bankQuestionModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200/60 max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 id="bankQuestionModalTitle" class="font-black text-gray-800 text-lg">문제 등록</h3>
                <button type="button" onclick="closeBankQuestionModal()" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><i class="fas fa-times"></i></button>
            </div>
            <form id="bankQuestionForm" onsubmit="handleBankSaveQuestion(event)" class="p-6 space-y-4 text-sm">
                <input type="hidden" name="bank_question_id" id="bankQuestionId" value="">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">문제 유형</label>
                        <select name="question_type" id="bankQuestionType" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                            <option value="multiple_choice">객관식</option>
                            <option value="short_answer">단답형</option>
                            <option value="essay">서술형</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">난이도 (선택)</label>
                        <select name="difficulty" id="bankQuestionDifficulty" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                            <option value="">선택 안 함</option>
                            <option value="low">하</option>
                            <option value="medium">중</option>
                            <option value="high">상</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">분류 (선택)</label>
                    <select name="category" id="bankQuestionCategory" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <option value="">선택 안 함</option>
                        <option value="사전평가">사전평가</option>
                        <option value="NCS평가">NCS평가</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">질문 내용</label>
                    <textarea name="question_text" id="bankQuestionText" rows="3" required class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="문제를 입력하세요"></textarea>
                </div>
                <div id="bankOptionsArea" class="space-y-2">
                    <label class="block text-xs font-bold text-gray-600 mb-1">객관식 보기 (정답에 체크)</label>
                    <div class="flex items-center gap-2">
                        <input type="radio" name="correct_option" value="1" class="text-indigo-600">
                        <input type="text" name="option_1" placeholder="보기 1" class="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="radio" name="correct_option" value="2" class="text-indigo-600">
                        <input type="text" name="option_2" placeholder="보기 2" class="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="radio" name="correct_option" value="3" class="text-indigo-600">
                        <input type="text" name="option_3" placeholder="보기 3" class="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="radio" name="correct_option" value="4" class="text-indigo-600">
                        <input type="text" name="option_4" placeholder="보기 4" class="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                    </div>
                </div>
                <div id="bankAnswerArea" class="hidden">
                    <label class="block text-xs font-bold text-gray-600 mb-1">정답</label>
                    <input type="text" name="short_answer" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="정답을 입력하세요">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeBankQuestionModal()" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">취소</button>
                    <button type="submit" id="bankQuestionSubmitBtn" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700">등록하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 커스텀 알림 모달 (글래스/벤토 스타일) -->
    <div id="notifyModal" class="fixed inset-0 z-[60] hidden items-center justify-center p-4" aria-modal="true" role="dialog">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="closeNotifyModal()"></div>
        <div class="relative w-full max-w-md rounded-[2.5rem] border border-slate-200/60 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur-md overflow-hidden animate-notify-in">
            <div id="notifyModalIconWrap" class="flex justify-center pt-8 pb-2">
                <div id="notifyModalIcon" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"></div>
            </div>
            <div class="px-8 pb-2 text-center">
                <h3 id="notifyModalTitle" class="text-lg font-black text-gray-800 tracking-tight"></h3>
            </div>
            <div class="px-8 pb-6">
                <p id="notifyModalMessage" class="text-sm text-slate-600 leading-relaxed text-center"></p>
            </div>
            <div class="px-8 pb-8 flex justify-center">
                <button type="button" onclick="closeNotifyModal()" id="notifyModalConfirm" class="px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                    확인
                </button>
            </div>
        </div>
    </div>

    <!-- 확인 모달 (확인/취소, 글래스/벤토 스타일) -->
    <div id="confirmModal" class="fixed inset-0 z-[61] hidden items-center justify-center p-4" aria-modal="true" role="dialog">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="resolveConfirmModal(false)"></div>
        <div class="relative w-full max-w-md rounded-[2.5rem] border border-slate-200/60 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur-md overflow-hidden animate-notify-in">
            <div class="flex justify-center pt-8 pb-2">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-indigo-50 text-indigo-600">
                    <i class="fas fa-circle-question"></i>
                </div>
            </div>
            <div class="px-8 pb-2 text-center">
                <h3 id="confirmModalTitle" class="text-lg font-black text-gray-800 tracking-tight">확인</h3>
            </div>
            <div class="px-8 pb-6">
                <p id="confirmModalMessage" class="text-sm text-slate-600 leading-relaxed text-center"></p>
            </div>
            <div class="px-8 pb-8 flex justify-center gap-3">
                <button type="button" id="confirmModalCancel" onclick="resolveConfirmModal(false)" class="px-6 py-3 rounded-2xl text-sm font-bold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm">
                    취소
                </button>
                <button type="button" id="confirmModalOk" onclick="resolveConfirmModal(true)" class="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                    확인
                </button>
            </div>
        </div>
    </div>
    <style>
        @keyframes notify-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-notify-in { animation: notify-in 0.2s ease-out; }
        #notifyModal.flex { display: flex !important; }
        #confirmModal.flex { display: flex !important; }
    </style>

    <script>
        let allData = [];
        let filteredData = [];
        let currentPage = 1;
        const itemsPerPage = 10;
        const token = localStorage.getItem('token');

        function showNotifyModal(title, message, type) {
            type = type || 'info';
            const wrap = document.getElementById('notifyModal');
            const iconEl = document.getElementById('notifyModalIcon');
            const iconWrap = document.getElementById('notifyModalIconWrap');
            const titleEl = document.getElementById('notifyModalTitle');
            const msgEl = document.getElementById('notifyModalMessage');
            const btnEl = document.getElementById('notifyModalConfirm');
            if (!wrap || !iconEl || !titleEl || !msgEl || !btnEl) return;
            titleEl.textContent = title || '알림';
            msgEl.textContent = message || '';
            const styles = {
                success: { icon: 'fa-circle-check', bg: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700' },
                error: { icon: 'fa-circle-exclamation', bg: 'bg-red-500', iconBg: 'bg-red-50 text-red-600', btn: 'bg-red-600 hover:bg-red-700' },
                info: { icon: 'fa-circle-info', bg: 'bg-indigo-500', iconBg: 'bg-indigo-50 text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700' }
            };
            const s = styles[type] || styles.info;
            iconEl.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ' + s.iconBg;
            iconEl.innerHTML = '<i class="fas ' + s.icon + '"></i>';
            btnEl.className = 'px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ' + s.btn;
            wrap.classList.remove('hidden');
            wrap.classList.add('flex');
        }
        function closeNotifyModal() {
            const wrap = document.getElementById('notifyModal');
            if (wrap) { wrap.classList.add('hidden'); wrap.classList.remove('flex'); }
        }

        let confirmModalResolve = null;
        function showConfirmModal(title, message) {
            const wrap = document.getElementById('confirmModal');
            const titleEl = document.getElementById('confirmModalTitle');
            const msgEl = document.getElementById('confirmModalMessage');
            if (!wrap || !titleEl || !msgEl) return Promise.resolve(false);
            titleEl.textContent = title || '확인';
            msgEl.textContent = message || '';
            wrap.classList.remove('hidden');
            wrap.classList.add('flex');
            return new Promise(function (resolve) {
                confirmModalResolve = resolve;
            });
        }
        function resolveConfirmModal(ok) {
            const wrap = document.getElementById('confirmModal');
            if (wrap) { wrap.classList.add('hidden'); wrap.classList.remove('flex'); }
            if (typeof confirmModalResolve === 'function') {
                confirmModalResolve(!!ok);
                confirmModalResolve = null;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadExamSummary();
        });

        async function loadExamSummary() {
            try {
                const res = await fetch('/api/hrd/exams/summary', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    allData = result.data || [];
                    updateStats(allData);
                    applyFilters();
                    initExamMgmtSelectors();
                    loadQuestionBank();
                }
            } catch (e) {
                console.error(e);
            }
        }

        function updateStats(data) {
            const list = data && data.length ? data : [];
            const totalExams = list.reduce((acc, cur) => acc + (cur.exam_count || 0), 0);
            const totalSubmissions = list.reduce((acc, cur) => acc + (cur.total_submissions || 0), 0);
            const scoreSum = list.reduce((acc, cur) => acc + ((cur.avg_score || 0) * (cur.total_submissions || 0)), 0);
            const avgScore = totalSubmissions > 0 ? (scoreSum / totalSubmissions).toFixed(1) : '0.0';
            const validCourses = list.filter(c => (c.exam_count || 0) > 0 && (c.student_count || 0) > 0);
            const avgRate = validCourses.length > 0
                ? Math.round(validCourses.reduce((acc, cur) => acc + (cur.participation_rate || 0), 0) / validCourses.length)
                : 0;
            const el1 = document.getElementById('statTotalExams');
            const el2 = document.getElementById('statTotalSubmissions');
            const el3 = document.getElementById('statAvgScore');
            const el4 = document.getElementById('statAvgRate');
            if (el1) el1.textContent = totalExams.toLocaleString() + '건';
            if (el2) el2.textContent = totalSubmissions.toLocaleString() + '건';
            if (el3) el3.textContent = avgScore;
            if (el4) el4.textContent = avgRate + '%';
        }

        let currentFilterType = 'all';
        function setFilterType(type) {
            currentFilterType = type;
            document.querySelectorAll('.filter-type-btn').forEach(btn => {
                if (btn.dataset.filterType === type) {
                    btn.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.remove('text-gray-500');
                } else {
                    btn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
                    btn.classList.add('text-gray-500');
                }
            });
        }

        function applyFilters() {
            const statusVal = (document.getElementById('statusFilter') && document.getElementById('statusFilter').value) || 'all';
            const search = (document.getElementById('searchInput') && document.getElementById('searchInput').value.trim()) || '';
            const sortBy = (document.getElementById('sortSelect') && document.getElementById('sortSelect').value) || 'latest';

            let filtered = allData;
            if (statusVal !== 'all') {
                filtered = filtered.filter(c => (String(c.status || '')).toLowerCase() === statusVal);
            }
            if (currentFilterType === 'active') {
                filtered = filtered.filter(c => (c.exam_count || 0) > 0);
            }
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(c =>
                    (c.title && c.title.toLowerCase().includes(q)) ||
                    (c.teacher_name && c.teacher_name.toLowerCase().includes(q))
                );
            }
            if (sortBy === 'latest') {
                filtered.sort((a, b) => (b.session_id ?? b.id ?? 0) - (a.session_id ?? a.id ?? 0));
            } else if (sortBy === 'name') {
                filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            } else if (sortBy === 'rate') {
                filtered.sort((a, b) => (b.participation_rate || 0) - (a.participation_rate || 0));
            } else if (sortBy === 'score') {
                filtered.sort((a, b) => (b.avg_score || 0) - (a.avg_score || 0));
            }
            filteredData = filtered;
            currentPage = 1;
            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            const pageData = filtered.slice(0, itemsPerPage);
            renderSummaryTable(pageData, { total, page: 1, limit: itemsPerPage, totalPages });
        }

        function goToPage(page) {
            currentPage = page;
            const start = (page - 1) * itemsPerPage;
            const pageData = filteredData.slice(start, start + itemsPerPage);
            const total = filteredData.length;
            const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            renderSummaryTable(pageData, { total, page, limit: itemsPerPage, totalPages });
        }

        function renderSummaryTable(data, pagination) {
            const tbody = document.getElementById('summaryTableBody');
            if (!tbody) return;
            const totalCountEl = document.getElementById('total-count');
            const currentRangeEl = document.getElementById('current-range');
            const controlsEl = document.getElementById('paginationControls');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-8 py-20 text-center text-gray-400">조건에 맞는 과정이 없습니다.</td></tr>';
                if (totalCountEl) totalCountEl.textContent = '0';
                if (currentRangeEl) currentRangeEl.textContent = '0-0';
                if (controlsEl) controlsEl.innerHTML = '';
                return;
            }
            const { total, page, limit, totalPages } = pagination || {};
            const startIndex = total && page ? (page - 1) * limit : 0;
            const endIndex = startIndex + data.length;
            if (totalCountEl) totalCountEl.textContent = (total ?? data.length).toLocaleString();
            if (currentRangeEl) currentRangeEl.textContent = total != null ? \`\${startIndex + 1}-\${endIndex}\` : \`1-\${data.length}\`;
            const statusClass = (s) => {
                if (['active','in_progress','open'].includes(s)) return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
                if (['recruiting','always_open'].includes(s)) return 'bg-blue-50 text-blue-600 ring-blue-100';
                if (['completed','closed'].includes(s)) return 'bg-slate-100 text-slate-600 ring-slate-200';
                return 'bg-gray-50 text-gray-600 ring-gray-200';
            };
            const totalPossible = (c) => (c.exam_count || 0) * (c.student_count || 0) || 0;
            tbody.innerHTML = data.map(c => \`
                <tr class="hover:bg-indigo-50/30 transition-colors group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">
                    <td class="px-8 py-5 min-w-0 max-w-[320px] break-words align-top">
                        <div class="font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight break-words">\${c.title || '-'}</div>
                        <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">회차 ID: \${c.session_id != null ? c.session_id : '-'}</div>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-bold ring-1 \${statusClass(c.status)}">\${c.status_label || c.status || '-'}</span>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="text-sm text-slate-600 font-black">\${c.teacher_name || '강사미지정'}</span>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-black rounded-lg ring-1 ring-slate-200/50 shadow-sm">\${c.exam_count}건</span>
                    </td>
                    <td class="px-6 py-5 text-center text-sm font-black text-slate-700 whitespace-nowrap align-top">
                        \${c.total_submissions} / \${totalPossible(c)}
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <div class="flex flex-col items-center">
                            <div class="text-[11px] font-black \${(c.participation_rate || 0) >= 80 ? 'text-emerald-500' : (c.participation_rate || 0) >= 40 ? 'text-indigo-500' : 'text-amber-500'} italic font-mono uppercase tracking-tighter">\${c.participation_rate || 0}%</div>
                            <div class="w-16 h-1.5 bg-slate-100/80 rounded-full mt-1.5 overflow-hidden shadow-inner ring-1 ring-white">
                                <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.4)] \${(c.participation_rate || 0) >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${Math.min(100, c.participation_rate || 0)}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center whitespace-nowrap align-top">
                        <span class="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-black ring-1 ring-slate-200/50 shadow-sm">\${c.avg_score != null ? c.avg_score : 0}점</span>
                    </td>
                    <td class="px-8 py-5 text-right whitespace-nowrap align-top space-x-2">
                        \${(c.session_id != null) 
                            ? \`<a href="/admin/courses/\${c.session_id}/lms/cbt" class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm whitespace-nowrap">시험 관리</a>
                               <a href="/admin/courses/\${c.session_id}/lms/cbt?tab=results" class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm whitespace-nowrap">결과</a>\` 
                            : \`<span class="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-400 cursor-not-allowed whitespace-nowrap">회차 없음</span>\`}
                    </td>
                </tr>
            \`).join('');
            if (controlsEl && total != null && totalPages > 1) {
                let html = \`<button onclick="goToPage(\${Math.max(1, currentPage - 1)})" \${currentPage === 1 ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'}"><i class="fas fa-chevron-left text-[11px]"></i></button>\`;
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + 4);
                if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                for (let i = startPage; i <= endPage; i++) {
                    html += \`<button onclick="goToPage(\${i})" class="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black \${currentPage === i ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}">\${i}</button>\`;
                }
                html += \`<button onclick="goToPage(\${Math.min(totalPages, currentPage + 1)})" \${currentPage === totalPages ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl \${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'}"><i class="fas fa-chevron-right text-[11px]"></i></button>\`;
                controlsEl.innerHTML = html;
            } else if (controlsEl) controlsEl.innerHTML = '';
        }

        // ============================
        // 시험/문제 구성 관리 영역
        // ============================

        let mgmtSessionId = '';
        let mgmtExamId = '';
        let addTargetType = 'pre'; // 'pre' = 사전평가(시험에 추가), 'ncs' = NCS평가(해당 회차 NCS평가관리에 등록)
        let bankQuestions = [];
        let examQuestions = [];
        let mgmtSubjects = [];

        function getQuestionTypeLabel(type) {
            if (!type) return '';
            const t = String(type).toLowerCase();
            if (t === 'multiple_choice') return '객관식';
            if (t === 'short_answer') return '단답형';
            if (t === 'essay') return '서술형';
            return type.replace('_', ' ');
        }

        function setAddTargetType(type) {
            addTargetType = type;
            document.querySelectorAll('.add-type-btn').forEach(btn => {
                const isActive = (btn.getAttribute('data-type') === type);
                btn.classList.toggle('bg-white', isActive);
                btn.classList.toggle('text-indigo-600', isActive);
                btn.classList.toggle('shadow-sm', isActive);
                btn.classList.toggle('border', isActive);
                btn.classList.toggle('text-slate-500', !isActive);
            });
            const titleEl = document.getElementById('rightPanelTitle');
            const labelEl = document.getElementById('examInfoLabel');
            const linkEl = document.getElementById('rightPanelLink');
            const cbtLinkEl = document.getElementById('mgmtCbtLink');
            const importLabel = document.getElementById('importBtnLabel');
            const importBtn = document.getElementById('importBtn');
            if (type === 'ncs') {
                if (titleEl) titleEl.innerHTML = '<i class=\"fas fa-certificate text-amber-500\"></i> 이 회차의 NCS평가용 문제';
                if (labelEl) labelEl.textContent = '문제은행에서 NCS평가로 추가한 문제가 여기 표시됩니다.';
                if (linkEl) { linkEl.href = mgmtSessionId ? '/admin/courses/' + mgmtSessionId + '/lms/ncs-eval' : '#'; linkEl.classList.remove('hidden'); }
                if (cbtLinkEl) cbtLinkEl.classList.add('hidden');
                if (importLabel) importLabel.textContent = '선택 문제 NCS평가에 추가';
                if (importBtn) { importBtn.disabled = !mgmtSessionId; }
                if (mgmtSessionId) loadNcsCourseQuestions();
            } else {
                if (titleEl) titleEl.innerHTML = '<i class=\"fas fa-list-check text-indigo-500\"></i> 이 회차 사전평가 문제';
                if (labelEl) labelEl.textContent = '회차를 선택하면 이 회차의 사전평가 문제가 표시됩니다.';
                if (linkEl) linkEl.classList.add('hidden');
                if (cbtLinkEl && mgmtSessionId) cbtLinkEl.classList.remove('hidden');
                if (importLabel) importLabel.textContent = '선택 문제 추가';
                if (importBtn) { importBtn.disabled = !mgmtExamId; }
                if (mgmtExamId) loadExamQuestions();
            }
        }

        function initExamMgmtSelectors() {
            const select = document.getElementById('mgmtSessionSelect');
            if (!select) return;
            const uniqueSessions = [];
            const seen = new Set();
            // 상태 라벨 매핑 (HRD 화면들 공통 규칙)
            const statusMap = {
                recruiting: '모집중',
                in_progress: '진행중',
                completed: '종료',
                always_open: '상시모집',
                closed: '마감'
            };
            (allData || []).forEach(c => {
                const sid = c.session_id;
                if (sid != null && !seen.has(sid)) {
                    seen.add(sid);
                    uniqueSessions.push({
                        id: sid,
                        title: c.title || \`회차 \${sid}\`,
                        status: c.status,
                        status_label: c.status_label
                    });
                }
            });
            if (uniqueSessions.length === 0) {
                select.innerHTML = '<option value=\"\">회차 없음</option>';
                return;
            }
            select.innerHTML = '<option value=\"\">회차 선택</option>' + uniqueSessions.map(s => {
                const label = s.status_label || statusMap[String(s.status)] || '';
                const statusText = label ? \` (\${label})\` : '';
                return \`<option value=\"\${s.id}\">\${s.title}\${statusText} (ID: \${s.id})</option>\`;
            }).join('');
        }

        async function onMgmtSessionChange() {
            const select = document.getElementById('mgmtSessionSelect');
            mgmtSessionId = select?.value || '';
            mgmtExamId = '';
            const cbtLink = document.getElementById('mgmtCbtLink');
            const addExamBtn = document.getElementById('mgmtAddExamBtn');
            const bankCreateBtn = document.getElementById('bankCreateQuestionBtn');
            if (cbtLink) {
                if (mgmtSessionId) {
                    cbtLink.href = '/admin/courses/' + mgmtSessionId + '/lms/cbt';
                    if (addTargetType === 'pre') cbtLink.classList.remove('hidden');
                    else cbtLink.classList.add('hidden');
                } else {
                    cbtLink.href = '#';
                    cbtLink.classList.add('hidden');
                }
            }
            const rightPanelLinkEl = document.getElementById('rightPanelLink');
            if (rightPanelLinkEl && mgmtSessionId && addTargetType === 'ncs') {
                rightPanelLinkEl.href = '/admin/courses/' + mgmtSessionId + '/lms/ncs-eval';
                rightPanelLinkEl.classList.remove('hidden');
            } else if (rightPanelLinkEl && !mgmtSessionId) rightPanelLinkEl.classList.add('hidden');
            if (addExamBtn) {
                if (mgmtSessionId) addExamBtn.classList.remove('hidden');
                else addExamBtn.classList.add('hidden');
            }
            if (!mgmtSessionId) {
                mgmtSubjects = [];
                const examListEl = document.getElementById('examQuestionList'); if (examListEl) examListEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4\"><i class=\"fas fa-inbox text-4xl mb-3 opacity-50\"></i><p class=\"text-xs font-medium\">회차를 선택하면<br>편성된 문제가 여기 표시됩니다.</p></div>';
                document.getElementById('importBtn')?.setAttribute('disabled', 'true');
                const linkEl = document.getElementById('rightPanelLink'); if (linkEl) linkEl.href = '#';
                await loadQuestionBank();
                return;
            }
            try {
                const subRes = await fetch('/api/ncs/approved/syllabus/session/' + mgmtSessionId + '/subjects', { headers: { 'Authorization': 'Bearer ' + token } });
                const subJson = await subRes.json();
                mgmtSubjects = (subJson?.data?.subjects || []).map((s) => ({ id: s.id, name: s.name || ('과목 ' + s.id) }));
            } catch (_) { mgmtSubjects = []; }
            await loadMgmtExams();
            if (addTargetType === 'ncs') {
                await loadNcsCourseQuestions();
                const linkEl = document.getElementById('rightPanelLink'); if (linkEl) { linkEl.href = '/admin/courses/' + mgmtSessionId + '/lms/ncs-eval'; linkEl.classList.remove('hidden'); }
                document.getElementById('importBtn').disabled = false;
            }
            await loadQuestionBank();
        }

        async function loadMgmtExams() {
            if (!mgmtSessionId) return;
            try {
                const res = await fetch(\`/api/cbt/exams?course_id=\${mgmtSessionId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                const exams = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!exams.length) {
                    mgmtExamId = '';
                    const examListEl2 = document.getElementById('examQuestionList');
                    if (examListEl2) examListEl2.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-clipboard-list text-4xl text-slate-300 mb-3\"></i><p class=\"text-xs font-medium text-slate-500\">선택된 회차에 시험이 없습니다.</p><p class=\"text-[11px] text-slate-400 mt-1\">시험 추가 버튼으로 시험을 만든 뒤 문제를 편성하세요.</p></div>';
                    const importBtn = document.getElementById('importBtn');
                    if (importBtn && addTargetType === 'pre') importBtn.disabled = true;
                    return;
                }
                mgmtExamId = String(exams[0].id);
                if (addTargetType === 'pre') {
                    await loadExamQuestions();
                    const importBtn = document.getElementById('importBtn');
                    if (importBtn) importBtn.disabled = false;
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function loadNcsCourseQuestions() {
            const listEl = document.getElementById('examQuestionList');
            if (!listEl || !mgmtSessionId) return;
            listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-slate-400\"><i class=\"fas fa-spinner fa-spin text-2xl mb-3\"></i><span class=\"text-xs font-medium\">불러오는 중...</span></div>';
            try {
                const res = await fetch(\`/api/cbt/ncs-course-questions?session_id=\${mgmtSessionId}\`, { headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                const list = (json && json.success && Array.isArray(json.data)) ? json.data : [];
                if (list.length === 0) {
                    listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-certificate text-4xl text-amber-200 mb-3\"></i><p class=\"text-xs font-medium text-slate-500\">이 회차에 NCS평가용 문제가 없습니다.</p><p class=\"text-[11px] text-slate-400 mt-1\">좌측에서 문제를 선택한 뒤 &quot;선택 문제 NCS평가에 추가&quot;를 누르세요.</p></div>';
                    return;
                }
                listEl.innerHTML = list.map((q, idx) => \`
                    <div class="bento-card flex items-start gap-3 p-3 rounded-2xl border border-slate-200/60 bg-white hover:border-slate-300/60 transition-all shadow-sm">
                        <span class="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold">\${idx + 1}</span>
                        <span class="shrink-0 px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">\${getQuestionTypeLabel(q.question_type)}</span>
                        <p class="flex-1 min-w-0 text-xs text-slate-700 line-clamp-2 leading-relaxed">\${String(q.question_text || '').replace(/</g, '&lt;')}</p>
                    </div>
                \`).join('');
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-exclamation-circle text-4xl text-red-300 mb-3\"></i><p class=\"text-xs font-medium text-red-500\">NCS평가 문제 목록을 불러오지 못했습니다.</p></div>';
            }
        }

        async function loadQuestionBank() {
            const listEl = document.getElementById('bankList');
            const countEl = document.getElementById('bankCountLabel');
            const importBtn = document.getElementById('importBtn');
            if (!listEl) return;
            listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-slate-400\"><i class=\"fas fa-spinner fa-spin text-2xl mb-3\"></i><span class=\"text-xs font-medium\">불러오는 중...</span></div>';
            const typeVal = document.getElementById('bankTypeFilter')?.value || '';
            const difficultyVal = document.getElementById('bankDifficultyFilter')?.value || '';
            const keyword = document.getElementById('bankKeywordInput')?.value || '';
            try {
                const params = new URLSearchParams();
                params.set('global', '1');
                if (typeVal) params.set('type', typeVal);
                if (difficultyVal) params.set('difficulty', difficultyVal);
                if (keyword) params.set('keyword', keyword);
                const res = await fetch(\`/api/cbt/question-bank?\${params.toString()}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                bankQuestions = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!bankQuestions.length) {
                    listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-inbox text-4xl text-slate-300 mb-3\"></i><p class=\"text-xs font-medium text-slate-500\">조건에 맞는 문제가 없습니다.</p><p class=\"text-[11px] text-slate-400 mt-1\">문제 등록 버튼으로 새 문제를 추가해 보세요.</p></div>';
                    if (countEl) countEl.textContent = '';
                    if (importBtn) importBtn.disabled = true;
                    return;
                }
                listEl.innerHTML = bankQuestions.map((q) => {
                    const category = (q.category || q.course_title || '').toString().replace(/</g, '&lt;');
                    const isPre = category === '사전평가';
                    const isNcs = category === 'NCS평가';
                    const categoryBadge = isPre
                        ? '<span class=\"px-2 py-0.5 rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-700\" title=\"분류\">사전평가</span>'
                        : isNcs
                            ? '<span class=\"px-2 py-0.5 rounded-lg bg-amber-50 text-[10px] font-bold text-amber-700\" title=\"분류\">NCS평가</span>'
                            : (category ? '<span class=\"px-2 py-0.5 rounded-lg bg-violet-50 text-[10px] font-bold text-violet-600\">' + category + '</span>' : '<span class=\"px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400\">미분류</span>');
                    return \`<label class=\"bento-card flex items-start gap-3 p-3 rounded-2xl border border-slate-200/60 bg-white hover:border-slate-300/60 cursor-pointer transition-all shadow-sm\">
                        <input type=\"checkbox\" class=\"mt-1 bank-question-checkbox shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20\" value=\"\${q.id}\">
                        <div class=\"flex-1 min-w-0\">
                            <div class=\"flex flex-wrap items-center gap-1.5 mb-1.5\">
                                \${categoryBadge}
                                <span class=\"px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600\">#\${q.id}</span>
                                <span class=\"px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600\">\${getQuestionTypeLabel(q.question_type)}</span>
                                \${q.difficulty ? '<span class=\"px-2 py-0.5 rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600\">' + (q.difficulty === 'high' ? '상' : q.difficulty === 'low' ? '하' : '중') + '</span>' : ''}
                                \${q.ncs_ability_unit_name ? '<span class=\"px-2 py-0.5 rounded-lg bg-amber-50/80 text-[10px] font-bold text-amber-700\" title=\"NCS 능력단위\">' + String(q.ncs_ability_unit_name).replace(/</g, '&lt;') + '</span>' : ''}
                            </div>
                            <p class=\"text-xs text-slate-700 line-clamp-2 leading-relaxed\">\${String(q.question_text || '').replace(/</g, '&lt;')}</p>
                        </div>
                        <div class=\"flex items-center gap-1 shrink-0\" onclick=\"event.stopPropagation()\">
                            <button type=\"button\" onclick=\"event.stopPropagation(); openEditBankQuestion(\${q.id})\" class=\"px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50\">수정</button>
                            <button type=\"button\" onclick=\"event.stopPropagation(); deleteBankQuestion(\${q.id})\" class=\"px-2.5 py-1 rounded-lg border border-red-200 text-red-600 text-[11px] font-bold hover:bg-red-50\">삭제</button>
                        </div>
                    </label>\`;
                }).join('');
                if (countEl) countEl.textContent = \`총 \${bankQuestions.length}문항\`;
                if (importBtn) importBtn.disabled = addTargetType === 'ncs' ? !mgmtSessionId : !mgmtExamId;
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class=\"text-center py-10 text-red-400 text-xs\">문제은행을 불러오지 못했습니다.</div>';
                if (countEl) countEl.textContent = '';
                if (importBtn) importBtn.disabled = true;
            }
        }

        function openBankQuestionModal() {
            const idEl = document.getElementById('bankQuestionId');
            const titleEl = document.getElementById('bankQuestionModalTitle');
            const submitBtn = document.getElementById('bankQuestionSubmitBtn');
            if (idEl) idEl.value = '';
            if (titleEl) titleEl.textContent = '문제 등록';
            if (submitBtn) submitBtn.textContent = '등록하기';
            const modal = document.getElementById('bankQuestionModal');
            const typeSelect = document.getElementById('bankQuestionType');
            const textArea = document.getElementById('bankQuestionText');
            const categoryInput = document.getElementById('bankQuestionCategory');
            const difficultySelect = document.getElementById('bankQuestionDifficulty');
            if (typeSelect) typeSelect.value = 'multiple_choice';
            if (textArea) textArea.value = '';
            if (categoryInput) categoryInput.value = '';
            if (difficultySelect) difficultySelect.value = '';
            ['option_1','option_2','option_3','option_4'].forEach(function(name, idx) {
                const el = document.querySelector('#bankQuestionModal input[name=\"' + name + '\"]');
                if (el) el.value = '';
                const radio = document.querySelector('#bankQuestionModal input[name=\"correct_option\"][value=\"' + (idx + 1) + '\"]');
                if (radio) radio.checked = idx === 0;
            });
            const shortAns = document.querySelector('#bankQuestionModal input[name=\"short_answer\"]');
            if (shortAns) shortAns.value = '';
            const optArea = document.getElementById('bankOptionsArea');
            const ansArea = document.getElementById('bankAnswerArea');
            if (optArea && ansArea) {
                optArea.classList.remove('hidden');
                ansArea.classList.add('hidden');
            }
            if (modal) modal.classList.remove('hidden');
        }

        async function openEditBankQuestion(questionId) {
            const idEl = document.getElementById('bankQuestionId');
            const titleEl = document.getElementById('bankQuestionModalTitle');
            const submitBtn = document.getElementById('bankQuestionSubmitBtn');
            const modal = document.getElementById('bankQuestionModal');
            if (!idEl || !modal) return;
            try {
                const res = await fetch('/api/cbt/bank-questions/' + questionId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (!json || !json.success || !json.data) {
                    showNotifyModal('오류', (json && (json.error || json.message)) || '문제를 불러올 수 없습니다.', 'error');
                    return;
                }
                const q = json.data;
                idEl.value = String(q.id);
                if (titleEl) titleEl.textContent = '문제 수정';
                if (submitBtn) submitBtn.textContent = '수정하기';
                const typeSelect = document.getElementById('bankQuestionType');
                const textArea = document.getElementById('bankQuestionText');
                const categoryInput = document.getElementById('bankQuestionCategory');
                const difficultySelect = document.getElementById('bankQuestionDifficulty');
                if (typeSelect) typeSelect.value = q.question_type || 'multiple_choice';
                if (textArea) textArea.value = q.question_text || '';
                if (categoryInput) categoryInput.value = q.category || '';
                if (difficultySelect) difficultySelect.value = q.difficulty || '';
                const optArr = (typeof q.options === 'string' ? (function(){ try { return JSON.parse(q.options); } catch(_){ return []; } })() : (Array.isArray(q.options) ? q.options : []));
                const correctVal = q.correct_answer != null ? String(q.correct_answer) : '1';
                ['option_1','option_2','option_3','option_4'].forEach(function(name, idx) {
                    const el = document.querySelector('#bankQuestionModal input[name=\"' + name + '\"]');
                    if (el) el.value = optArr[idx] != null ? String(optArr[idx]) : '';
                    const radio = document.querySelector('#bankQuestionModal input[name=\"correct_option\"][value=\"' + (idx + 1) + '\"]');
                    if (radio) radio.checked = (correctVal === String(idx + 1));
                });
                const shortAns = document.querySelector('#bankQuestionModal input[name=\"short_answer\"]');
                if (shortAns) shortAns.value = (q.question_type !== 'multiple_choice' && q.correct_answer != null) ? String(q.correct_answer) : '';
                const optArea = document.getElementById('bankOptionsArea');
                const ansArea = document.getElementById('bankAnswerArea');
                if (optArea && ansArea) {
                    if ((q.question_type || 'multiple_choice') === 'multiple_choice') {
                        optArea.classList.remove('hidden');
                        ansArea.classList.add('hidden');
                    } else {
                        optArea.classList.add('hidden');
                        ansArea.classList.remove('hidden');
                    }
                }
                modal.classList.remove('hidden');
            } catch (err) {
                console.error(err);
                showNotifyModal('오류', '문제를 불러오는 중 오류가 발생했습니다.', 'error');
            }
        }

        async function deleteBankQuestion(questionId) {
            if (!(await showConfirmModal('문제 삭제', '이 문제를 삭제할까요?'))) return;
            try {
                const res = await fetch('/api/cbt/bank-questions/' + questionId, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (json && json.success) {
                    showNotifyModal('삭제 완료', '문제가 삭제되었습니다.', 'success');
                    await loadQuestionBank();
                } else {
                    showNotifyModal('삭제 실패', (json && (json.error || json.message)) || '삭제에 실패했습니다.', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotifyModal('오류', '삭제 중 오류가 발생했습니다.', 'error');
            }
        }

        function handleBankPdfUpload(input) {
            if (!input.files || !input.files[0]) return;
            const file = input.files[0];
            showNotifyModal('AI 문제 생성 (PDF)', \"PDF 파일 '\" + file.name + \"'을 분석하여 문제를 생성합니다. (현재는 데모 기능으로 실제 분석은 수행되지 않습니다.)\", 'info');
            input.value = '';
            // TODO: 실제 파일 업로드 및 AI 분석 API 호출 후 전역 문제은행에 등록
            // const formData = new FormData(); formData.append('file', file);
            // fetch('/api/cbt/ai-generate-bank', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: formData }).then(...).then(() => loadQuestionBank());
        }

        function closeBankQuestionModal() {
            const modal = document.getElementById('bankQuestionModal');
            if (modal) modal.classList.add('hidden');
        }

        document.getElementById('bankQuestionType')?.addEventListener('change', function (e) {
            const val = e.target.value;
            const optArea = document.getElementById('bankOptionsArea');
            const ansArea = document.getElementById('bankAnswerArea');
            if (!optArea || !ansArea) return;
            if (val === 'multiple_choice') {
                optArea.classList.remove('hidden');
                ansArea.classList.add('hidden');
            } else {
                optArea.classList.add('hidden');
                ansArea.classList.remove('hidden');
            }
        });

        async function handleBankSaveQuestion(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const editId = formData.get('bank_question_id');
            const isEdit = editId && String(editId).trim() !== '';
            const type = formData.get('question_type') || 'multiple_choice';
            const payload = {
                question_text: formData.get('question_text'),
                question_type: type,
                points: 1,
                difficulty: formData.get('difficulty') || undefined,
                category: formData.get('category') || undefined
            };
            if (type === 'multiple_choice') {
                payload.options = [
                    formData.get('option_1'),
                    formData.get('option_2'),
                    formData.get('option_3'),
                    formData.get('option_4')
                ];
                payload.correct_answer = formData.get('correct_option');
            } else {
                payload.correct_answer = formData.get('short_answer');
            }
            try {
                const url = isEdit ? '/api/cbt/bank-questions/' + String(editId).trim() : '/api/cbt/bank-questions';
                const method = isEdit ? 'PATCH' : 'POST';
                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json && json.success) {
                    showNotifyModal(isEdit ? '수정 완료' : '등록 완료', isEdit ? '문제가 수정되었습니다.' : '문제가 전역 문제은행에 등록되었습니다. 원하는 회차·시험을 선택한 뒤 "선택 문제 시험에 추가"로 편성하세요.', 'success');
                    closeBankQuestionModal();
                    form.reset();
                    const idEl = document.getElementById('bankQuestionId');
                    if (idEl) idEl.value = '';
                    await loadQuestionBank();
                } else {
                    showNotifyModal(isEdit ? '수정 실패' : '등록 실패', (json && (json.error || json.message)) || '알 수 없는 오류', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotifyModal('오류', (isEdit ? '수정' : '등록') + ' 중 오류가 발생했습니다.', 'error');
            }
        }

        async function loadExamQuestions() {
            const listEl = document.getElementById('examQuestionList');
            if (!listEl) return;
            if (!mgmtExamId) {
                listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4\"><i class=\"fas fa-inbox text-4xl mb-3 opacity-50\"></i><p class=\"text-xs font-medium\">회차·시험을 선택하면<br>편성된 문제가 여기 표시됩니다.</p></div>';
                return;
            }
            listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-slate-400\"><i class=\"fas fa-spinner fa-spin text-2xl mb-3\"></i><span class=\"text-xs font-medium\">불러오는 중...</span></div>';
            try {
                const res = await fetch(\`/api/cbt/questions?exam_id=\${mgmtExamId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                examQuestions = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!examQuestions.length) {
                    listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-clipboard-list text-4xl text-indigo-200 mb-3\"></i><p class=\"text-xs font-medium text-slate-500\">아직 편성된 문제가 없습니다.</p><p class=\"text-[11px] text-slate-400 mt-1\">좌측 문제은행에서 선택 후 &quot;선택 문제 추가&quot;를 누르세요.</p></div>';
                    return;
                }
                const subjectName = (cid) => (mgmtSubjects.find((s) => s.id === cid) || {}).name || '';
                listEl.innerHTML = examQuestions.map((q, idx) => \`
                    <div class="bento-card flex items-start gap-3 p-3 rounded-2xl border border-slate-200/60 bg-white hover:border-slate-300/60 transition-all shadow-sm">
                        <div class="flex flex-col gap-0.5 shrink-0">
                            <button type="button" onclick="moveQuestionUp(\${q.id}, \${idx})" \${idx === 0 ? 'disabled' : ''} class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition" title="위로"><i class="fas fa-chevron-up text-[10px]"></i></button>
                            <button type="button" onclick="moveQuestionDown(\${q.id}, \${idx})" \${idx === examQuestions.length - 1 ? 'disabled' : ''} class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition" title="아래로"><i class="fas fa-chevron-down text-[10px]"></i></button>
                        </div>
                        <span class="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">\${idx + 1}</span>
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">\${getQuestionTypeLabel(q.question_type)}</span>
                                \${q.curriculum_id && subjectName(q.curriculum_id)
                                    ? '<span class="px-2 py-0.5 rounded-lg bg-violet-50 text-[10px] font-bold text-violet-700">' +
                                      String(subjectName(q.curriculum_id) || '').replace(/</g, '&lt;') +
                                      '</span>'
                                    : ''}
                                \${q.ncs_ability_unit_name
                                    ? '<span class="px-2 py-0.5 rounded-lg bg-amber-50 text-[10px] font-bold text-amber-700" title="NCS 능력단위">' +
                                      String(q.ncs_ability_unit_name || '').replace(/</g, '&lt;') +
                                      '</span>'
                                    : ''}
                            </div>
                            <p class="text-xs text-slate-700 line-clamp-2 leading-relaxed">\${String(q.question_text || '').replace(/</g, '&lt;')}</p>
                        </div>
                        <button type="button" onclick="removeQuestionFromExam(\${q.id})" class="shrink-0 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition" title="시험에서 제거"><i class="fas fa-times text-xs"></i></button>
                    </div>
                \`).join('');
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class=\"flex flex-col items-center justify-center py-16 text-center px-4\"><i class=\"fas fa-exclamation-circle text-4xl text-red-300 mb-3\"></i><p class=\"text-xs font-medium text-red-500\">시험 문제를 불러오지 못했습니다.</p></div>';
            }
        }

        async function importSelectedQuestions() {
            const checkboxes = Array.from(document.querySelectorAll('.bank-question-checkbox'));
            const selectedBankIds = checkboxes.filter(cb => cb.checked).map(cb => parseInt(cb.value, 10)).filter(v => !Number.isNaN(v));
            if (!selectedBankIds.length) {
                showNotifyModal('안내', '가져올 문제를 선택해 주세요.', 'info');
                return;
            }
            if (addTargetType === 'ncs') {
                if (!mgmtSessionId) {
                    showNotifyModal('안내', '회차를 선택한 뒤 NCS평가에 추가해 주세요.', 'info');
                    return;
                }
                try {
                    const res = await fetch('/api/cbt/ncs-course-questions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ session_id: mgmtSessionId, question_bank_ids: selectedBankIds })
                    });
                    const json = await res.json();
                    if (json && json.success) {
                        showNotifyModal('추가 완료', '선택한 문제가 이 회차의 NCS평가관리에 등록되었습니다. NCS평가관리 페이지에서 확인하세요.', 'success');
                        checkboxes.forEach(cb => { cb.checked = false; });
                        await loadNcsCourseQuestions();
                    } else {
                        showNotifyModal('추가 실패', json.error || '알 수 없는 오류', 'error');
                    }
                } catch (e) {
                    console.error(e);
                    showNotifyModal('오류', '문제 추가 중 오류가 발생했습니다.', 'error');
                }
                return;
            }
            if (!mgmtExamId) {
                showNotifyModal('안내', '회차를 선택해 주세요. 해당 회차에 시험이 없으면 시험 추가 버튼으로 먼저 시험을 만드세요.', 'info');
                return;
            }
            try {
                const res = await fetch(\`/api/cbt/exams/\${mgmtExamId}/import-questions\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ question_bank_ids: selectedBankIds })
                });
                const json = await res.json();
                if (json && json.success) {
                    showNotifyModal('추가 완료', '선택한 문제가 시험에 추가되었습니다.', 'success');
                    checkboxes.forEach(cb => { cb.checked = false; });
                    await loadExamQuestions();
                } else {
                    showNotifyModal('추가 실패', json.error || '알 수 없는 오류', 'error');
                }
            } catch (e) {
                console.error(e);
                showNotifyModal('오류', '문제 추가 중 오류가 발생했습니다.', 'error');
            }
        }

        async function moveQuestionUp(questionId, index) {
            if (index <= 0 || !examQuestions.length) return;
            const curr = examQuestions[index];
            const prev = examQuestions[index - 1];
            if (!curr || !prev) return;
            try {
                await fetch(\`/api/cbt/questions/\${questionId}\`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ order_index: prev.order_index }) });
                await fetch(\`/api/cbt/questions/\${prev.id}\`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ order_index: curr.order_index }) });
                await loadExamQuestions();
            } catch (e) { console.error(e); showNotifyModal('오류', '순서 변경 중 오류가 발생했습니다.', 'error'); }
        }
        async function moveQuestionDown(questionId, index) {
            if (index >= examQuestions.length - 1 || !examQuestions.length) return;
            const curr = examQuestions[index];
            const next = examQuestions[index + 1];
            if (!curr || !next) return;
            try {
                await fetch(\`/api/cbt/questions/\${questionId}\`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ order_index: next.order_index }) });
                await fetch(\`/api/cbt/questions/\${next.id}\`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ order_index: curr.order_index }) });
                await loadExamQuestions();
            } catch (e) { console.error(e); showNotifyModal('오류', '순서 변경 중 오류가 발생했습니다.', 'error'); }
        }
        async function removeQuestionFromExam(questionId) {
            if (!(await showConfirmModal('시험에서 제거', '이 문제를 시험에서 제거할까요? (문제 자체는 삭제되지 않고, 이 시험에서만 빠집니다.)'))) return;
            try {
                const res = await fetch(\`/api/cbt/questions/\${questionId}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (json && json.success) {
                    await loadExamQuestions();
                } else {
                    showNotifyModal('제거 실패', json.error || '알 수 없는 오류', 'error');
                }
            } catch (e) {
                console.error(e);
                showNotifyModal('오류', '제거 중 오류가 발생했습니다.', 'error');
            }
        }

        function openAddExamModal() {
            if (!mgmtSessionId) {
                showNotifyModal('안내', '먼저 회차를 선택해 주세요.', 'info');
                return;
            }
            document.getElementById('addExamModal')?.classList.remove('hidden');
        }
        function closeAddExamModal() {
            document.getElementById('addExamModal')?.classList.add('hidden');
        }
        async function handleCreateExam(e) {
            e.preventDefault();
            const form = e.target;
            const fd = new FormData(form);
            const title = String(fd.get('title') || '');
            const type = String(fd.get('type') || '');
            const time_limit_minutes = parseInt(String(fd.get('time_limit_minutes')), 10) || 60;
            const start_time = (fd.get('start_time') && String(fd.get('start_time'))) || null;
            const end_time = (fd.get('end_time') && String(fd.get('end_time'))) || null;
            const description = (fd.get('description') && String(fd.get('description'))) || null;
            if (!title?.trim()) {
                showNotifyModal('안내', '시험명을 입력해 주세요.', 'info');
                return;
            }
            if (!mgmtSessionId) {
                showNotifyModal('안내', '회차가 선택되지 않았습니다.', 'info');
                return;
            }
            try {
                const res = await fetch('/api/cbt/exams', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        course_id: mgmtSessionId,
                        title: title.trim(),
                        type: type || 'practice',
                        time_limit_minutes,
                        start_time,
                        end_time,
                        description,
                        is_active: 1
                    })
                });
                const json = await res.json();
                if (json && json.success) {
                    closeAddExamModal();
                    form.reset();
                    await loadMgmtExams();
                } else {
                    showNotifyModal('생성 실패', json.error || '알 수 없는 오류', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotifyModal('오류', '시험 생성 중 오류가 발생했습니다.', 'error');
            }
        }
    </script>
</body>
</html>
`;
};
