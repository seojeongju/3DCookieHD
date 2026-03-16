
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdExamsHtml = (sidebar = hrdSidebar('exams')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 시험/CBT 관리 - 교육행정 시스템</title>
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
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">통합 시험/CBT 현황</h1>
                            <p class="text-gray-500 mt-1 text-sm">모든 교육 과정의 시험 등록 현황 및 학생들의 응시율/평균 점수를 관리합니다.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="loadExamSummary()" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- 요약 통계 카드 -->
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

                    <!-- 시험/문제 구성 관리 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-8 py-6 border-b border-gray-50 bg-white/60 backdrop-blur-md">
                            <div class="flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h3 class="font-black text-gray-800 text-lg uppercase tracking-tight">시험·문제 구성</h3>
                                    <p class="text-xs text-gray-500 mt-1">회차와 시험을 선택한 뒤, 좌측 문제은행에서 문제를 가져와 우측 시험에 편성할 수 있습니다.</p>
                                </div>
                                <div class="flex flex-wrap gap-3 items-center">
                                    <select id="mgmtSessionSelect" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-3 py-2 min-w-[180px]" onchange="onMgmtSessionChange()">
                                        <option value="">회차 선택</option>
                                    </select>
                                    <select id="mgmtExamSelect" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl px-3 py-2 min-w-[180px]" onchange="onMgmtExamChange()">
                                        <option value="">시험 선택</option>
                                    </select>
                                    <button type="button" id="mgmtAddExamBtn" class="hidden inline-flex items-center px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition" onclick="openAddExamModal()">시험 추가</button>
                                    <a id="mgmtCbtLink" href="#" class="hidden text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 transition">이 회차에서 문제 등록</a>
                                </div>
                            </div>
                        </div>
                        <div class="px-8 py-6 bg-gray-50/60">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- 문제은행 -->
                                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex flex-col">
                                    <div class="flex justify-between items-center mb-3">
                                        <div>
                                            <div class="text-xs font-black text-slate-500 uppercase tracking-widest">문제은행</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">선택한 회차의 모든 시험·사전평가에서 생성된 문제 목록입니다.</div>
                                        </div>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <select id="bankCurriculumFilter" class="border border-gray-200 rounded-xl text-[11px] px-2.5 py-1.5 text-gray-600 min-w-[120px]" onchange="loadQuestionBank()">
                                                <option value="">전체 과목</option>
                                            </select>
                                            <select id="bankTypeFilter" class="border border-gray-200 rounded-xl text-[11px] px-2.5 py-1.5 text-gray-600" onchange="loadQuestionBank()">
                                                <option value="">전체 유형</option>
                                                <option value="multiple_choice">객관식</option>
                                                <option value="short_answer">단답형</option>
                                                <option value="essay">서술형</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 mb-3">
                                        <i class="fas fa-search text-gray-400 mr-2 text-xs"></i>
                                        <input id="bankKeywordInput" type="text" placeholder="문제 내용 검색" class="bg-transparent border-none outline-none text-xs w-full" onkeydown="if(event.key==='Enter'){loadQuestionBank();}">
                                    </div>
                                    <div id="bankList" class="flex-1 min-h-[160px] max-h-80 overflow-y-auto custom-scrollbar text-xs text-slate-600 space-y-2">
                                        <div class="text-center py-10 text-gray-400 text-xs">회차와 시험을 먼저 선택해 주세요.</div>
                                    </div>
                                    <div class="mt-3 flex justify-between items-center">
                                        <div class="text-[11px] text-slate-400" id="bankCountLabel"></div>
                                        <button type="button" onclick="importSelectedQuestions()" class="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed" id="importBtn" disabled>
                                            선택 문제 시험에 추가
                                        </button>
                                    </div>
                                </div>

                                <!-- 선택 시험의 문제 구성 -->
                                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex flex-col">
                                    <div class="flex justify-between items-center mb-3">
                                        <div>
                                            <div class="text-xs font-black text-slate-500 uppercase tracking-widest">선택된 시험의 문제 목록</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5" id="examInfoLabel">시험을 선택하면 이 영역에 문제가 표시됩니다.</div>
                                        </div>
                                    </div>
                                    <div id="examQuestionList" class="flex-1 min-h-[160px] max-h-80 overflow-y-auto custom-scrollbar text-xs text-slate-600 space-y-2">
                                        <div class="text-center py-10 text-gray-400 text-xs">시험을 선택해 주세요.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

    <script>
        let allData = [];
        let filteredData = [];
        let currentPage = 1;
        const itemsPerPage = 10;
        const token = localStorage.getItem('token');

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
                        \${(c.session_id != null) ? '<a href="/admin/courses/' + c.session_id + '/lms/cbt" class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm whitespace-nowrap">시험 관리</a><a href="/admin/courses/' + c.session_id + '/lms/cbt?tab=results" class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm whitespace-nowrap">결과</a>' : '<span class="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-400 cursor-not-allowed whitespace-nowrap">회차 없음</span>'}
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
        let bankQuestions = [];
        let examQuestions = [];
        let mgmtSubjects = [];

        function initExamMgmtSelectors() {
            const select = document.getElementById('mgmtSessionSelect');
            if (!select) return;
            const uniqueSessions = [];
            const seen = new Set();
            (allData || []).forEach(c => {
                const sid = c.session_id;
                if (sid != null && !seen.has(sid)) {
                    seen.add(sid);
                    uniqueSessions.push({ id: sid, title: c.title || \`회차 \${sid}\` });
                }
            });
            if (uniqueSessions.length === 0) {
                select.innerHTML = '<option value=\"\">회차 없음</option>';
                return;
            }
            select.innerHTML = '<option value=\"\">회차 선택</option>' + uniqueSessions.map(s =>
                \`<option value=\"\${s.id}\">\${s.title} (ID: \${s.id})</option>\`
            ).join('');
        }

        async function onMgmtSessionChange() {
            const select = document.getElementById('mgmtSessionSelect') as HTMLSelectElement | null;
            mgmtSessionId = select?.value || '';
            const examSelect = document.getElementById('mgmtExamSelect');
            mgmtExamId = '';
            const cbtLink = document.getElementById('mgmtCbtLink') as HTMLAnchorElement | null;
            const addExamBtn = document.getElementById('mgmtAddExamBtn');
            if (cbtLink) {
                if (mgmtSessionId) {
                    cbtLink.href = '/admin/courses/' + mgmtSessionId + '/lms/cbt';
                    cbtLink.classList.remove('hidden');
                } else {
                    cbtLink.href = '#';
                    cbtLink.classList.add('hidden');
                }
            }
            if (addExamBtn) {
                if (mgmtSessionId) addExamBtn.classList.remove('hidden');
                else addExamBtn.classList.add('hidden');
            }
            if (!mgmtSessionId) {
                mgmtSubjects = [];
                const curSel = document.getElementById('bankCurriculumFilter');
                if (curSel) curSel.innerHTML = '<option value=\"\">전체 과목</option>';
                if (examSelect) examSelect.innerHTML = '<option value=\"\">시험 선택</option>';
                document.getElementById('bankList')!.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">회차를 선택해 주세요.</div>';
                document.getElementById('examQuestionList')!.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">시험을 선택해 주세요.</div>';
                (document.getElementById('importBtn') as HTMLButtonElement | null)?.setAttribute('disabled', 'true');
                return;
            }
            try {
                const subRes = await fetch('/api/ncs/approved/syllabus/session/' + mgmtSessionId + '/subjects', { headers: { 'Authorization': 'Bearer ' + token } });
                const subJson = await subRes.json();
                mgmtSubjects = (subJson?.data?.subjects || []).map((s) => ({ id: s.id, name: s.name || ('과목 ' + s.id) }));
                const curSel = document.getElementById('bankCurriculumFilter');
                if (curSel) curSel.innerHTML = '<option value=\"\">전체 과목</option>' + mgmtSubjects.map((s) => '<option value=\"' + s.id + '\">' + (s.name || '').replace(/"/g, '&quot;') + '</option>').join('');
            } catch (_) { mgmtSubjects = []; }
            await loadMgmtExams();
            await loadQuestionBank();
        }

        async function loadMgmtExams() {
            const examSelect = document.getElementById('mgmtExamSelect');
            if (!examSelect || !mgmtSessionId) return;
            try {
                const res = await fetch(\`/api/cbt/exams?course_id=\${mgmtSessionId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                const exams = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!exams.length) {
                    examSelect.innerHTML = '<option value=\"\">시험 없음</option>';
                    document.getElementById('examQuestionList')!.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">선택된 회차에 등록된 시험이 없습니다.</div>';
                    return;
                }
                examSelect.innerHTML = '<option value=\"\">시험 선택</option>' + exams.map((e: any) =>
                    \`<option value=\"\${e.id}\">\${e.title}</option>\`
                ).join('');
            } catch (e) {
                console.error(e);
            }
        }

        async function onMgmtExamChange() {
            const select = document.getElementById('mgmtExamSelect') as HTMLSelectElement | null;
            mgmtExamId = select?.value || '';
            await loadExamQuestions();
            const label = document.getElementById('examInfoLabel');
            if (label) {
                label.textContent = mgmtExamId
                    ? \`시험 ID \${mgmtExamId}에 편성된 문제 목록입니다.\`
                    : '시험을 선택하면 이 영역에 문제가 표시됩니다.';
            }
        }

        async function loadQuestionBank() {
            const listEl = document.getElementById('bankList');
            const countEl = document.getElementById('bankCountLabel');
            const importBtn = document.getElementById('importBtn') as HTMLButtonElement | null;
            if (!listEl) return;
            if (!mgmtSessionId) {
                listEl.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">회차를 먼저 선택해 주세요.</div>';
                if (countEl) countEl.textContent = '';
                if (importBtn) importBtn.disabled = true;
                return;
            }
            const typeVal = (document.getElementById('bankTypeFilter') as HTMLSelectElement | null)?.value || '';
            const curriculumVal = (document.getElementById('bankCurriculumFilter') as HTMLSelectElement | null)?.value || '';
            const keyword = (document.getElementById('bankKeywordInput') as HTMLInputElement | null)?.value || '';
            try {
                const params = new URLSearchParams();
                params.set('course_id', mgmtSessionId);
                if (curriculumVal) params.set('curriculum_id', curriculumVal);
                if (typeVal) params.set('type', typeVal);
                if (keyword) params.set('keyword', keyword);
                const res = await fetch(\`/api/cbt/question-bank?\${params.toString()}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                bankQuestions = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!bankQuestions.length) {
                    listEl.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">조건에 맞는 문제가 없습니다.</div>';
                    if (countEl) countEl.textContent = '';
                    if (importBtn) importBtn.disabled = true;
                    return;
                }
                const subjectName = (cid) => (mgmtSubjects.find((s) => s.id === cid) || {}).name || '';
                listEl.innerHTML = bankQuestions.map((q: any, idx: number) => \`
                    <label class=\"flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-indigo-50/60 cursor-pointer\">
                        <input type=\"checkbox\" class=\"mt-0.5 bank-question-checkbox\" value=\"\${q.id}\">
                        <div class=\"flex-1 min-w-0\">
                            <div class=\"flex flex-wrap items-center gap-1 mb-0.5\">
                                <span class=\"px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase\">#\${q.id}</span>
                                <span class=\"px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600\">\${(q.question_type || '').replace('_', ' ')}</span>
                                \${q.curriculum_id && subjectName(q.curriculum_id) ? '<span class=\"px-1.5 py-0.5 rounded bg-violet-50 text-[10px] font-bold text-violet-700\">' + (subjectName(q.curriculum_id) || '').replace(/</g, '&lt;') + '</span>' : ''}
                                \${q.ncs_ability_unit_name ? \`<span class=\"px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-700\" title=\"NCS 능력단위\">\${q.ncs_ability_unit_name}</span>\` : ''}
                            </div>
                            <div class=\"text-[11px] text-slate-700 line-clamp-2\">\${q.question_text}</div>
                            <div class=\"text-[10px] text-slate-400 mt-0.5\">
                                \${(q.course_title || '') && (q.exam_title || '') ? \`\${q.course_title} · \${q.exam_title}\` : (q.exam_title || '')}
                            </div>
                        </div>
                    </label>
                \`).join('');
                if (countEl) countEl.textContent = \`총 \${bankQuestions.length}문항\`;
                if (importBtn) importBtn.disabled = !mgmtExamId;
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class=\"text-center py-10 text-red-400 text-xs\">문제은행을 불러오지 못했습니다.</div>';
                if (countEl) countEl.textContent = '';
                if (importBtn) importBtn.disabled = true;
            }
        }

        async function loadExamQuestions() {
            const listEl = document.getElementById('examQuestionList');
            if (!listEl) return;
            if (!mgmtExamId) {
                listEl.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">시험을 선택해 주세요.</div>';
                return;
            }
            try {
                const res = await fetch(\`/api/cbt/questions?exam_id=\${mgmtExamId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                examQuestions = json && json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (!examQuestions.length) {
                    listEl.innerHTML = '<div class=\"text-center py-10 text-gray-400 text-xs\">아직 편성된 문제가 없습니다. 좌측 문제은행에서 문제를 추가해 보세요.</div>';
                    return;
                }
                const subjectName = (cid) => (mgmtSubjects.find((s) => s.id === cid) || {}).name || '';
                listEl.innerHTML = examQuestions.map((q: any, idx: number) => \`
                    <div class=\"border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex gap-2 items-start\">
                        <div class=\"flex flex-col gap-0.5 shrink-0\">
                            <button type=\"button\" onclick=\"moveQuestionUp(\${q.id}, \${idx})\" \${idx === 0 ? 'disabled' : ''} class=\"p-1 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-30 disabled:cursor-not-allowed\" title=\"위로\"><i class=\"fas fa-chevron-up text-[10px]\"></i></button>
                            <button type=\"button\" onclick=\"moveQuestionDown(\${q.id}, \${idx})\" \${idx === examQuestions.length - 1 ? 'disabled' : ''} class=\"p-1 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-30 disabled:cursor-not-allowed\" title=\"아래로\"><i class=\"fas fa-chevron-down text-[10px]\"></i></button>
                        </div>
                        <div class=\"text-[11px] font-mono text-slate-400 pt-0.5 shrink-0\">\${idx + 1}.</div>
                        <div class=\"flex-1 min-w-0\">
                            <div class=\"flex flex-wrap items-center gap-1 mb-0.5\">
                                <span class=\"px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600\">\${(q.question_type || '').replace('_', ' ')}</span>
                                \${q.curriculum_id && subjectName(q.curriculum_id) ? '<span class=\"px-1.5 py-0.5 rounded bg-violet-50 text-[10px] font-bold text-violet-700\">' + (subjectName(q.curriculum_id) || '').replace(/</g, '&lt;') + '</span>' : ''}
                                \${q.ncs_ability_unit_name ? \`<span class=\"px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-700\" title=\"NCS 능력단위\">\${q.ncs_ability_unit_name}</span>\` : ''}
                            </div>
                            <div class=\"text-[11px] text-slate-800 line-clamp-2\">\${q.question_text}</div>
                        </div>
                        <button type=\"button\" onclick=\"removeQuestionFromExam(\${q.id})\" class=\"shrink-0 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50\" title=\"시험에서 제거\"><i class=\"fas fa-times text-[10px]\"></i></button>
                    </div>
                \`).join('');
            } catch (e) {
                console.error(e);
                listEl.innerHTML = '<div class=\"text-center py-10 text-red-400 text-xs\">시험 문제를 불러오지 못했습니다.</div>';
            }
        }

        async function importSelectedQuestions() {
            if (!mgmtExamId) {
                alert('먼저 시험을 선택해 주세요.');
                return;
            }
            const checkboxes = Array.from(document.querySelectorAll('.bank-question-checkbox')) as HTMLInputElement[];
            const selectedIds = checkboxes.filter(cb => cb.checked).map(cb => parseInt(cb.value, 10)).filter(v => !Number.isNaN(v));
            if (!selectedIds.length) {
                alert('가져올 문제를 선택해 주세요.');
                return;
            }
            try {
                const res = await fetch(\`/api/cbt/exams/\${mgmtExamId}/import-questions\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ question_ids: selectedIds })
                });
                const json = await res.json();
                if (json && json.success) {
                    alert('선택한 문제가 시험에 추가되었습니다.');
                    checkboxes.forEach(cb => { cb.checked = false; });
                    await loadExamQuestions();
                } else {
                    alert('문제 추가 실패: ' + (json.error || '알 수 없는 오류'));
                }
            } catch (e) {
                console.error(e);
                alert('문제 추가 중 오류가 발생했습니다.');
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
            } catch (e) { console.error(e); alert('순서 변경 중 오류가 발생했습니다.'); }
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
            } catch (e) { console.error(e); alert('순서 변경 중 오류가 발생했습니다.'); }
        }
        async function removeQuestionFromExam(questionId) {
            if (!confirm('이 문제를 시험에서 제거할까요? (문제 자체는 삭제되지 않고, 이 시험에서만 빠집니다.)')) return;
            try {
                const res = await fetch(\`/api/cbt/questions/\${questionId}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (json && json.success) {
                    await loadExamQuestions();
                } else {
                    alert('제거 실패: ' + (json.error || '알 수 없는 오류'));
                }
            } catch (e) {
                console.error(e);
                alert('제거 중 오류가 발생했습니다.');
            }
        }

        function openAddExamModal() {
            if (!mgmtSessionId) {
                alert('먼저 회차를 선택해 주세요.');
                return;
            }
            document.getElementById('addExamModal')?.classList.remove('hidden');
        }
        function closeAddExamModal() {
            document.getElementById('addExamModal')?.classList.add('hidden');
        }
        async function handleCreateExam(e) {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const fd = new FormData(form);
            const title = fd.get('title') as string;
            const type = fd.get('type') as string;
            const time_limit_minutes = parseInt(String(fd.get('time_limit_minutes')), 10) || 60;
            const start_time = (fd.get('start_time') as string) || null;
            const end_time = (fd.get('end_time') as string) || null;
            const description = (fd.get('description') as string) || null;
            if (!title?.trim()) {
                alert('시험명을 입력해 주세요.');
                return;
            }
            if (!mgmtSessionId) {
                alert('회차가 선택되지 않았습니다.');
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
                    const newId = json.data?.id;
                    if (newId) {
                        const examSelect = document.getElementById('mgmtExamSelect') as HTMLSelectElement | null;
                        if (examSelect) {
                            examSelect.value = String(newId);
                            mgmtExamId = String(newId);
                            onMgmtExamChange();
                        }
                    }
                } else {
                    alert('시험 생성 실패: ' + (json.error || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error(err);
                alert('시험 생성 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
