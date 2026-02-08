import { hrdSidebar } from './components/hrd_sidebar';

export const adminCoursesListHtml = (sidebar = hrdSidebar('courses-register')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 관리 - 통합 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
        @keyframes skeleton-shimmer { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .skeleton-row .skeleton-bar { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.2s ease-in-out infinite; border-radius: 4px; height: 14px; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
                <div class="flex items-center gap-4">
                    <h1 class="text-lg font-bold text-slate-800">교육과정 관리</h1>
                    <nav class="hidden sm:flex items-center text-xs text-slate-500 gap-2">
                        <span>홈</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span>과정관리</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span class="font-bold text-slate-700">교육과정 관리</span>
                    </nav>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right hidden md:block">
                        <p class="text-xs font-bold text-slate-700" id="loginUserName">관리자</p>
                        <p class="text-[10px] text-slate-400">최종접속: <span id="lastLoginTime">-</span></p>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="flex-1 overflow-auto p-6 custom-scrollbar bg-slate-50">
                <!-- 0. List type: 등록된 과정 / 일반과정 -->
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">리스트 구분</span>
                    <div class="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
                        <button type="button" id="tabListAll" class="list-type-tab px-4 py-2 rounded-lg text-sm font-bold transition-all bg-primary-600 text-white shadow-sm">
                            <i class="fas fa-list mr-1.5"></i> 등록된 과정
                        </button>
                        <button type="button" id="tabListGeneral" class="list-type-tab px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <i class="fas fa-graduation-cap mr-1.5"></i> 일반과정
                        </button>
                    </div>
                </div>

                <!-- 1. Search Filter Panel -->
                <div class="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
                    <div class="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <i class="fas fa-search text-slate-400"></i>
                        <h2 class="font-bold text-slate-700">통합 과정 검색</h2>
                    </div>
                    
                    <form id="searchForm" onsubmit="event.preventDefault(); loadCourses(1);" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Row 1 -->
                        <div class="space-y-1">
                            <label class="block text-xs font-bold text-slate-500">훈련년도/회차</label>
                            <div class="flex gap-1">
                                <select id="yearFilter" class="flex-1 py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                    <option value="">전체 년도</option>
                                    <option value="2026" selected>2026년</option>
                                    <option value="2025">2025년</option>
                                    <option value="2024">2024년</option>
                                </select>
                                <select id="sessionFilter" class="w-20 py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                    <option value="">전체</option>
                                    <option value="1">1회차</option>
                                    <option value="2">2회차</option>
                                    <option value="3">3회차</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-xs font-bold text-slate-500">과정 구분</label>
                            <select id="categoryFilter" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">전체 과정</option>
                                <option value="국비지원">국가기간 전략산업</option>
                                <option value="국민내일배움">국민내일배움카드</option>
                                <option value="일반과정">일반직무 (재직자)</option>
                                <option value="특강">단기 특강</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-xs font-bold text-slate-500">운영 상태</label>
                            <select id="statusFilter" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">전체 상태</option>
                                <option value="preparing">개강예정 (모집전)</option>
                                <option value="recruiting">훈련생 모집중</option>
                                <option value="in_progress">훈련 진행중</option>
                                <option value="completed">훈련 종료</option>
                                <option value="cancelled">폐강</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-xs font-bold text-slate-500">검색어</label>
                            <div class="flex gap-1">
                                <input type="text" id="searchInput" placeholder="과정명, 코드 입력" class="flex-1 py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <button type="submit" class="bg-slate-800 text-white px-4 rounded text-xs font-bold hover:bg-slate-700 transition">검색</button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 2. Data Grid -->
                <div class="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-340px)] min-h-[500px]">
                    <!-- Grid Toolbar -->
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-bold text-slate-700">검색결과 <span id="totalCount" class="text-primary-600">0</span>건 <span id="paginationRange" class="text-slate-400 font-normal text-xs"></span></span>
                            <button type="button" id="btnRefresh" class="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded transition" title="새로고침"><i class="fas fa-sync-alt text-xs"></i></button>
                            <div class="h-4 w-px bg-slate-300"></div>
                            <button type="button" class="text-xs text-slate-500 hover:text-red-600 transition flex items-center gap-1" onclick="deleteSelected()">
                                <i class="far fa-trash-alt"></i> 선택 삭제
                            </button>
                        </div>
                        <div class="flex items-center gap-2">
                             <a href="/admin/courses/sessions" class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                                <i class="fas fa-list-ul"></i> 회차별 관리
                            </a>
                            <button type="button" id="btnExportExcel" class="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 text-green-700 bg-green-50 rounded text-xs font-bold hover:bg-green-100 transition">
                                <i class="far fa-file-excel"></i> 엑셀 저장
                            </button>
                            <button onclick="openCreateModal()" class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700 transition shadow-sm">
                                <i class="fas fa-plus"></i> 과정 신규 등록
                            </button>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="flex-1 overflow-auto custom-scrollbar relative">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-100 text-slate-500 text-xs font-bold uppercase sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th class="p-3 w-10 text-center border-b border-slate-200"><input type="checkbox" id="checkAll" class="rounded border-slate-300"></th>
                                    <th class="p-3 w-16 text-center border-b border-slate-200">No.</th>
                                    <th class="p-3 w-28 text-center border-b border-slate-200">구분/회차</th>
                                    <th class="p-3 border-b border-slate-200">과정명 (NCS 직종)</th>
                                    <th class="p-3 w-40 text-center border-b border-slate-200">훈련 기간/시간</th>
                                    <th class="p-3 w-28 text-center border-b border-slate-200">정원/현원</th>
                                    <th class="p-3 w-24 text-center border-b border-slate-200">담당교사</th>
                                    <th class="p-3 w-28 text-right border-b border-slate-200">수강료</th>
                                    <th class="p-3 w-24 text-center border-b border-slate-200">상태</th>
                                    <th class="p-3 w-20 text-center border-b border-slate-200 border-l border-dashed border-slate-300">관리</th>
                                </tr>
                            </thead>
                            <tbody id="courseTableBody" class="text-sm divide-y divide-slate-100">
                                <tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-3/4 max-w-xs"></div><div class="skeleton-bar w-1/2 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>
                                <tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-4/5 max-w-xs"></div><div class="skeleton-bar w-2/5 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>
                                <tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-2/3 max-w-xs"></div><div class="skeleton-bar w-1/3 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>
                                <tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-3/4 max-w-xs"></div><div class="skeleton-bar w-2/5 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>
                                <tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-1/2 max-w-xs"></div><div class="skeleton-bar w-1/4 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="p-3 border-t border-slate-200 flex items-center justify-center gap-2 shrink-0 bg-slate-50" id="pagination">
                        <!-- Filled by JS -->
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Create Mode Select Modal -->
    <div id="createModeModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div class="bg-slate-800 text-white p-4 flex justify-between items-center">
                <h3 class="font-bold">신규 과정 등록 방식 선택</h3>
                <button onclick="closeCreateModal()" class="text-slate-400 hover:text-white"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 grid grid-cols-2 gap-4">
                <a href="/admin/courses/approved" class="block p-6 border-2 border-slate-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition group text-center">
                    <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition">
                        <i class="fas fa-file-import text-xl"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 mb-1">승인 과정 불러오기</h4>
                    <p class="text-xs text-slate-500">HRD-Net 승인 정보를 기반으로<br>빠르게 개설합니다.</p>
                </a>
                <button type="button" onclick="closeCreateModal(); openDirectInputModal();" class="block p-6 border-2 border-slate-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition group text-center">
                    <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition">
                        <i class="fas fa-pen text-xl"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 mb-1">직접 입력 등록</h4>
                    <p class="text-xs text-slate-500">기초 데이터 없이<br>모든 정보를 직접 입력합니다.</p>
                </button>
            </div>
            <div class="p-4 bg-slate-50 text-xs text-slate-500 text-center border-t border-slate-100">
                * NCS 국기/계좌제 과정은 반드시 '승인 과정 불러오기'를 권장합니다.
            </div>
        </div>
    </div>

    <!-- 직접 입력 등록 모달 -->
    <div id="directInputModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
                <h3 class="font-bold text-lg">과정 직접 입력 등록</h3>
                <button type="button" onclick="closeDirectInputModal()" class="text-slate-400 hover:text-white p-1"><i class="fas fa-times"></i></button>
            </div>
            <form id="directInputForm" class="p-6 overflow-y-auto space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">과정명 <span class="text-red-500">*</span></label>
                    <input type="text" name="title" required class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm" placeholder="과정명 입력">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">과정 구분 <span class="text-red-500">*</span></label>
                        <select name="category" required class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                            <option value="일반과정">일반직무 (재직자)</option>
                            <option value="국비지원">국가기간 전략산업</option>
                            <option value="국민내일배움">국민내일배움카드</option>
                            <option value="특강">단기 특강</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">담당교사</label>
                        <select name="teacher_id" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                            <option value="">미배정</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">설명</label>
                    <textarea name="description" rows="3" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm" placeholder="과정 설명 (선택)"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">시작일</label>
                        <input type="date" name="start_date" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">종료일</label>
                        <input type="date" name="end_date" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">정원</label>
                        <input type="number" name="max_students" min="1" value="20" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">수강료 (원)</label>
                        <input type="number" name="price" min="0" value="0" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">총 훈련시간</label>
                        <input type="number" name="duration_hours" min="0" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm" placeholder="시간">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">수업 시간/요일</label>
                    <input type="text" name="schedule" class="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm" placeholder="예: 월~금 09:00-18:00">
                </div>
            </form>
            <div class="p-4 border-t border-slate-100 flex justify-end gap-2 shrink-0 bg-slate-50">
                <button type="button" onclick="closeDirectInputModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100">취소</button>
                <button type="button" onclick="submitDirectInput()" class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">등록</button>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api/courses';
        const STORAGE_KEY = 'admin_courses_filter';
        let currentPage = 1;
        const ITEMS_PER_PAGE = 20;
        let listType = 'all';
        let lastCourseList = [];
        let lastTotalCount = 0;

        function saveFilter() {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                    listType: listType,
                    page: currentPage,
                    year: document.getElementById('yearFilter').value,
                    category: document.getElementById('categoryFilter').value,
                    status: document.getElementById('statusFilter').value,
                    search: document.getElementById('searchInput').value
                }));
            } catch (e) {}
        }
        function loadFilter() {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const s = JSON.parse(raw);
                if (s.listType) listType = s.listType;
                if (s.page) currentPage = parseInt(s.page, 10) || 1;
                const yearFilter = document.getElementById('yearFilter');
                const categoryFilter = document.getElementById('categoryFilter');
                const statusFilter = document.getElementById('statusFilter');
                const searchInput = document.getElementById('searchInput');
                if (yearFilter && s.year !== undefined) yearFilter.value = s.year;
                if (categoryFilter && s.category !== undefined) categoryFilter.value = s.category;
                if (statusFilter && s.status !== undefined) statusFilter.value = s.status;
                if (searchInput && s.search !== undefined) searchInput.value = s.search || '';
            } catch (e) {}
        }

        function updateListTypeUI() {
            const tabAll = document.getElementById('tabListAll');
            const tabGeneral = document.getElementById('tabListGeneral');
            const catFilter = document.getElementById('categoryFilter');
            if (listType === 'all') {
                tabAll.classList.add('bg-primary-600', 'text-white', 'shadow-sm');
                tabAll.classList.remove('bg-white', 'text-slate-600');
                tabGeneral.classList.remove('bg-primary-600', 'text-white', 'shadow-sm');
                tabGeneral.classList.add('text-slate-600');
                catFilter.value = catFilter.dataset.savedCategory || '';
            } else {
                tabGeneral.classList.add('bg-primary-600', 'text-white', 'shadow-sm');
                tabGeneral.classList.remove('text-slate-600');
                tabAll.classList.remove('bg-primary-600', 'text-white', 'shadow-sm');
                tabAll.classList.add('text-slate-600');
                catFilter.value = '일반과정';
            }
        }

        window.onload = function() {
            const token = localStorage.getItem('token');
            if(!token) window.location.href = '/login';
            loadFilter();
            updateListTypeUI();
            loadCourses(currentPage);

            document.getElementById('checkAll').addEventListener('change', function(e) {
                const checkboxes = document.querySelectorAll('.row-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
            });

            document.getElementById('tabListAll').addEventListener('click', function() {
                if (listType === 'all') return;
                listType = 'all';
                document.getElementById('categoryFilter').dataset.savedCategory = document.getElementById('categoryFilter').value;
                updateListTypeUI();
                loadCourses(1);
            });
            document.getElementById('tabListGeneral').addEventListener('click', function() {
                if (listType === 'general') return;
                listType = 'general';
                updateListTypeUI();
                loadCourses(1);
            });

            document.getElementById('btnExportExcel').addEventListener('click', exportExcel);
            document.getElementById('btnRefresh').addEventListener('click', function() { loadCourses(currentPage); });
            
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if(user) document.getElementById('loginUserName').textContent = user.name + ' 님';
            } catch(e){}
            document.getElementById('lastLoginTime').textContent = new Date().toLocaleTimeString();
        };

        function renderSkeleton() {
            const tbody = document.getElementById('courseTableBody');
            const skeletonHtml = [1,2,3,4,5].map(function() {
                return '<tr class="skeleton-row"><td class="p-3 text-center"><div class="skeleton-bar w-4 h-4 mx-auto rounded"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-6 inline-block"></div></td><td class="p-3"><div class="skeleton-bar w-20"></div></td><td class="p-3"><div class="skeleton-bar w-3/4 max-w-xs"></div><div class="skeleton-bar w-1/2 mt-2"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-24 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-12 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-16 inline-block"></div></td><td class="p-3 text-right"><div class="skeleton-bar w-14 inline-block"></div></td><td class="p-3 text-center"><div class="skeleton-bar w-14 inline-block rounded-full"></div></td><td class="p-3"></td></tr>';
            }).join('');
            tbody.innerHTML = skeletonHtml;
        }

        async function loadCourses(page) {
            currentPage = page;
            const tbody = document.getElementById('courseTableBody');
            renderSkeleton();
            
            // Filters
            const year = document.getElementById('yearFilter').value;
            const category = document.getElementById('categoryFilter').value;
            const status = document.getElementById('statusFilter').value;
            const search = document.getElementById('searchInput').value;
            
            // 리스트 구분: 일반과정 탭이면 카테고리 고정
            const effectiveCategory = listType === 'general' ? '일반과정' : (category || '');
            
            const params = new URLSearchParams({
                page: page,
                limit: ITEMS_PER_PAGE,
                sort: 'latest'
            });
            if(effectiveCategory) params.append('category', effectiveCategory);
            if(status) params.append('status', status);
            if(search) params.append('search', search);
            if(year) params.append('year', year);

            try {
                const res = await fetch(\`\${API_BASE}?\${params.toString()}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const json = await res.json();
                
                if(!json.success) {
                    throw new Error(json.message || '로드 실패');
                }

                const list = json.data || [];
                lastCourseList = list;
                lastTotalCount = json.pagination?.total ?? list.length;
                document.getElementById('totalCount').textContent = lastTotalCount.toLocaleString();
                const rangeEl = document.getElementById('paginationRange');
                if (lastTotalCount > 0) {
                    const from = (page - 1) * ITEMS_PER_PAGE + 1;
                    const to = Math.min(page * ITEMS_PER_PAGE, lastTotalCount);
                    rangeEl.textContent = '( ' + from + '-' + to + ' / ' + lastTotalCount + ' )';
                } else {
                    rangeEl.textContent = '';
                }

                if(list.length === 0) {
                    tbody.innerHTML = \`
                        <tr>
                            <td colspan="10" class="p-16 text-center flex flex-col items-center justify-center text-slate-400">
                                <i class="far fa-folder-open text-3xl mb-3 opacity-30"></i>
                                <span class="text-sm">조회된 과정 데이터가 없습니다.</span>
                                \${search ? '<span class="text-xs mt-1">검색조건을 변경해보세요.</span>' : '<button onclick="openCreateModal()" class="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded text-xs font-bold hover:bg-primary-100">신규 과정 등록하기</button>'}
                            </td>
                        </tr>
                    \`;
                    renderPagination(0);
                    return;
                }

                // Render Rows
                tbody.innerHTML = list.map((item, index) => {
                   const rowNum = (json.pagination?.total || 0) - ((page-1)*ITEMS_PER_PAGE) - index;
                   const statusInfo = getStatusBadge(item.status);
                   const days = item.class_days ? JSON.parse(item.class_days).length : 0;
                   const hours = item.duration_hours || '-';
                   
                   return \`
                        <tr class="hover:bg-slate-50 border-b border-slate-100 transition group">
                            <td class="p-3 text-center"><input type="checkbox" class="row-checkbox rounded border-slate-300" value="\${item.id}"></td>
                            <td class="p-3 text-center text-xs text-slate-500">\${rowNum}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold">\${item.category || '기타'}</span>
                                \${item.session_format ? '<div class="text-[10px] text-slate-400 mt-1">' + item.session_format + '</div>' : ''}
                            </td>
                            <td class="p-3">
                                <a href="/admin/courses/\${item.id}/lms" class="font-bold text-slate-700 hover:text-primary-600 hover:underline transition block mb-0.5">
                                    \${item.title}
                                </a>
                                <div class="text-[11px] text-slate-400">
                                    <i class="far fa-id-card mr-1"></i> 과목코드: \${item.code || '-'} 
                                    <span class="mx-1">|</span> NCS: \${item.ncs_name || '미지정'}
                                </div>
                            </td>
                            <td class="p-3 text-center text-xs text-slate-600">
                                <div class="font-bold">\${(item.start_date||'').substring(0,10)} ~ \${(item.end_date||'').substring(0,10)}</div>
                                <div class="text-slate-400 text-[10px] mt-0.5">\${days}일 / \${hours}시간</div>
                            </td>
                            <td class="p-3 text-center">
                                <div class="flex flex-col items-center">
                                    <span class="text-xs font-bold text-slate-700">\${item.current_students || 0} / \${item.max_students || '-'}</span>
                                    <div class="w-12 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                        <div class="h-full bg-primary-500" style="width: \${Math.min(100, ((item.current_students||0)/(item.max_students||1))*100)}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3 text-center text-xs text-slate-600">
                                \${item.teacher_name || '<span class="text-slate-300">미배정</span>'}
                            </td>
                            <td class="p-3 text-right text-xs font-bold text-slate-700">
                                \${item.price ? Number(item.price).toLocaleString() + '원' : '<span class="text-slate-300">무료</span>'}
                            </td>
                            <td class="p-3 text-center">
                                <span class="inline-flex px-2 py-1 rounded-full text-[10px] font-bold border \${statusInfo.cls}">
                                    \${statusInfo.label}
                                </span>
                            </td>
                            <td class="p-3 text-center border-l border-dashed border-slate-200">
                                <button onclick="window.location.href='/admin/courses/\${item.id}/lms'" class="text-slate-500 hover:text-primary-600 transition p-1.5" title="LMS 관리"><i class="fas fa-cog"></i></button>
                                <button onclick="deleteCourse(\${item.id})" class="text-slate-500 hover:text-red-500 transition p-1.5" title="삭제"><i class="far fa-trash-alt"></i></button>
                            </td>
                        </tr>
                   \`; 
                }).join('');

                renderPagination(json.pagination?.totalPages || 1);
                saveFilter();

            } catch(e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-red-500 text-sm">목록 로드 중 오류 발생: ' + e.message + '</td></tr>';
            }
        }

        function getStatusBadge(status) {
            switch(status) {
                case 'recruiting': return { label: '모집중', cls: 'bg-blue-50 text-blue-600 border-blue-100' };
                case 'in_progress': return { label: '훈련중', cls: 'bg-green-50 text-green-600 border-green-100' };
                case 'completed': return { label: '종료', cls: 'bg-slate-100 text-slate-500 border-slate-200' };
                case 'cancelled': return { label: '폐강', cls: 'bg-red-50 text-red-600 border-red-100' };
                case 'preparing': 
                default:
                    return { label: '준비중', cls: 'bg-orange-50 text-orange-600 border-orange-100' };
            }
        }

        function renderPagination(totalPages) {
            const container = document.getElementById('pagination');
            let html = '';
            
            // Prev
            html += \`<button onclick="loadCourses(\${Math.max(1, currentPage-1)})" class="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 \${currentPage===1?'opacity-50 cursor-not-allowed':''}"><i class="fas fa-chevron-left text-xs"></i></button>\`;
            
            // Pages (Simple range for now)
            for(let i=1; i<=totalPages; i++) {
                if(i === currentPage) {
                    html += \`<button onclick="loadCourses(\${i})" class="w-8 h-8 flex items-center justify-center rounded border border-primary-600 bg-primary-600 text-white font-bold text-xs shadow-sm">\${i}</button>\`;
                } else {
                    html += \`<button onclick="loadCourses(\${i})" class="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs">\${i}</button>\`;
                }
            }

            // Next
            html += \`<button onclick="loadCourses(\${Math.min(totalPages, currentPage+1)})" class="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 \${currentPage===totalPages?'opacity-50 cursor-not-allowed':''}"><i class="fas fa-chevron-right text-xs"></i></button>\`;
            
            container.innerHTML = html;
        }

        function openCreateModal() {
            document.getElementById('createModeModal').classList.remove('hidden');
        }
        function closeCreateModal() {
            document.getElementById('createModeModal').classList.add('hidden');
        }

        async function openDirectInputModal() {
            document.getElementById('directInputModal').classList.remove('hidden');
            document.getElementById('directInputForm').reset();
            const teacherSelect = document.querySelector('#directInputForm select[name="teacher_id"]');
            teacherSelect.innerHTML = '<option value="">미배정</option>';
            try {
                const res = await fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const json = await res.json();
                if (json.success && json.data && json.data.length) {
                    json.data.forEach(function(p) {
                        const opt = document.createElement('option');
                        opt.value = p.user_id || p.id || '';
                        opt.textContent = (p.name || '') + (p.position ? ' (' + p.position + ')' : '');
                        teacherSelect.appendChild(opt);
                    });
                }
            } catch (e) {}
        }
        function closeDirectInputModal() {
            document.getElementById('directInputModal').classList.add('hidden');
        }
        async function submitDirectInput() {
            const form = document.getElementById('directInputForm');
            const title = form.querySelector('[name="title"]').value.trim();
            if (!title) { alert('과정명을 입력하세요.'); return; }
            const category = form.querySelector('[name="category"]').value;
            const body = {
                title: title,
                category: category,
                description: form.querySelector('[name="description"]').value.trim() || null,
                start_date: form.querySelector('[name="start_date"]').value || null,
                end_date: form.querySelector('[name="end_date"]').value || null,
                max_students: parseInt(form.querySelector('[name="max_students"]').value, 10) || 20,
                price: parseInt(form.querySelector('[name="price"]').value, 10) || 0,
                duration_hours: parseInt(form.querySelector('[name="duration_hours"]').value, 10) || null,
                schedule: form.querySelector('[name="schedule"]').value.trim() || null,
                teacher_id: form.querySelector('[name="teacher_id"]').value || null
            };
            if (!body.teacher_id) delete body.teacher_id;
            try {
                const res = await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify(body)
                });
                const json = await res.json();
                if (json.success) {
                    alert('과정이 등록되었습니다.');
                    closeDirectInputModal();
                    loadCourses(1);
                } else {
                    alert(json.message || json.error || '등록 실패');
                }
            } catch (e) {
                alert('오류: ' + (e.message || e));
            }
        }

        async function deleteCourse(id) {
            if(!confirm('정말 삭제하시겠습니까? \\n(수강생이 있는 과정은 삭제할 수 없습니다)')) return;
            try {
                const res = await fetch(\`\${API_BASE}/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const json = await res.json();
                if(json.success) {
                    alert('삭제되었습니다.');
                    loadCourses(currentPage);
                } else {
                    alert(json.message || '삭제 실패');
                }
            } catch(e) {
                alert('오류 발생: ' + e.message);
            }
        }

        async function exportExcel() {
            const token = localStorage.getItem('token');
            const year = document.getElementById('yearFilter').value;
            const status = document.getElementById('statusFilter').value;
            const search = document.getElementById('searchInput').value;
            const effectiveCategory = listType === 'general' ? '일반과정' : document.getElementById('categoryFilter').value;
            const params = new URLSearchParams({ page: '1', limit: '10000', sort: 'latest' });
            if(effectiveCategory) params.append('category', effectiveCategory);
            if(status) params.append('status', status);
            if(search) params.append('search', search);
            if(year) params.append('year', year);
            try {
                const res = await fetch(API_BASE + '?' + params.toString(), { headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                if(!json.success || !json.data) { throw new Error(json.message || '조회 실패'); }
                const list = json.data || [];
                const BOM = '\uFEFF';
                const headers = ['No', '구분', '과정명', '과목코드', 'NCS직종', '시작일', '종료일', '훈련일수', '훈련시간', '정원', '현원', '담당교사', '수강료', '상태'];
                const rows = list.map((item, i) => {
                    const statusInfo = getStatusBadge(item.status);
                    let days = 0;
                    try {
                        if (item.class_days) days = (typeof item.class_days === 'string' ? JSON.parse(item.class_days) : item.class_days).length;
                    } catch (_) {}
                    return [
                        i + 1,
                        item.category || '기타',
                        (item.title || '').replace(/"/g, '""'),
                        item.code || '-',
                        item.ncs_name || '미지정',
                        (item.start_date || '').substring(0, 10),
                        (item.end_date || '').substring(0, 10),
                        days,
                        item.duration_hours || '-',
                        item.max_students || '-',
                        item.current_students || 0,
                        item.teacher_name || '미배정',
                        item.price ? Number(item.price).toLocaleString() : '무료',
                        statusInfo.label
                    ].map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',');
                });
                const csv = BOM + headers.map(h => '"' + h + '"').join(',') + '\\n' + rows.join('\\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = '과정목록_' + new Date().toISOString().slice(0,10) + '.csv';
                a.click();
                URL.revokeObjectURL(a.href);
            } catch(e) {
                alert('엑셀 저장 중 오류: ' + (e.message || e));
            }
        }

        async function deleteSelected() {
            const checked = document.querySelectorAll('.row-checkbox:checked');
            if(checked.length === 0) return alert('선택된 항목이 없습니다.');
            if(!confirm('선택한 ' + checked.length + '개 과정을 삭제하시겠습니까?\\n수강생이 있는 과정은 삭제할 수 없습니다.')) return;
            const token = localStorage.getItem('token');
            const ids = Array.from(checked).map(cb => cb.value);
            let done = 0, failedByEnrollment = 0, failedOther = 0;
            for (const id of ids) {
                try {
                    const res = await fetch(API_BASE + '/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                    const json = await res.json();
                    if (json.success) { done++; }
                    else if (json.message && json.message.indexOf('수강생') !== -1) { failedByEnrollment++; }
                    else { failedOther++; }
                } catch (_) { failedOther++; }
            }
            if (failedByEnrollment > 0 || failedOther > 0) {
                var msg = '삭제 완료: ' + done + '건.';
                if (failedByEnrollment > 0) msg += '\\n수강생이 있어 삭제할 수 없음: ' + failedByEnrollment + '건 (수강 취소 후 삭제 가능).';
                if (failedOther > 0) msg += '\\n기타 실패: ' + failedOther + '건.';
                alert(msg);
            } else if (done > 0) alert('선택한 ' + done + '건이 삭제되었습니다.');
            loadCourses(currentPage);
        }
    </script>
</body>
</html>
`;
