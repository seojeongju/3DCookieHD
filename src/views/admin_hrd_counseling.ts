import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdCounselingHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상담 관리 센터 - 3DCookie HD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
        .glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .active-tab { border-bottom: 2px solid #3b82f6; color: #3b82f6; }
        .gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); }
        .gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .timeline-line::before {
            content: '';
            position: absolute;
            left: 1.25rem;
            top: 2rem;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
        }
        .timeline-item:last-child .timeline-line::before { display: none; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        
        /* 아코디언 스타일 */
        .history-accordion { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .history-accordion.open { max-height: 2000px; }
        .history-toggle-icon { transition: transform 0.3s ease; }
        .history-toggle-icon.open { transform: rotate(180deg); }
        
        /* 인라인 추가 상담 폼 */
        .inline-add-form { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.3s ease; opacity: 0; }
        .inline-add-form.open { max-height: 500px; opacity: 1; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b]">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${hrdSidebar('counseling')}

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto">
            <!-- 고정 헤더 -->
            <header class="sticky top-0 z-30 glass-effect bg-white/80 border-b border-gray-200">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-xl font-bold tracking-tight text-gray-900">훈련생 상담 센터</h1>
                        <p class="text-xs text-gray-500 mt-0.5">통합 관리 및 데이터 기반 상담 기록 시스템</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button onclick="openModal()" class="gradient-blue text-white px-5 py-2.5 rounded-xl transition flex items-center shadow-lg shadow-blue-500/20 active:scale-95">
                            <i class="fas fa-plus-circle mr-2"></i> 신규 상담 작성
                        </button>
                    </div>
                </div>

                <!-- 탭/필터 라인 -->
                <div class="px-8 py-2 flex items-center space-x-6 text-sm font-medium border-t border-gray-100">
                    <button class="py-2 active-tab" onclick="setFilter('all')">전체 내역</button>
                    <button class="py-2 text-gray-500 hover:text-blue-600" onclick="setFilter('academic')">학사/학습</button>
                    <button class="py-2 text-gray-500 hover:text-blue-600" onclick="setFilter('attendance')">출결/행정</button>
                    <button class="py-2 text-gray-500 hover:text-blue-600" onclick="setFilter('career')">취업/진로</button>
                    <button class="py-2 text-gray-500 hover:text-blue-600" onclick="setFilter('complaint')">고충/건의</button>
                </div>
            </header>

            <div class="p-8 grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
                <!-- 왼쪽: 통계 및 검색 (3칸) -->
                <aside class="col-span-12 lg:col-span-3 space-y-6">
                    <!-- 요약 카드 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
                        <h4 class="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">오늘의 상담 현황</h4>
                        <div class="flex flex-col">
                            <span class="text-4xl font-bold text-gray-900" id="todayCount">0</span>
                            <span class="text-xs text-blue-600 font-medium mt-1">▲ 전일 대비 12% 증가</span>
                        </div>
                    </div>

                    <!-- 검색 필터 박스 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h4 class="text-sm font-semibold text-gray-900 mb-2">데이터 정교화 검색</h4>
                        <div class="space-y-3">
                            <div class="relative">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                                <input type="text" id="searchInput" placeholder="훈련생 이름 검색..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all text-sm outline-none">
                            </div>
                            <select id="courseFilter" class="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                                <option value="">모든 교육 과정</option>
                            </select>
                            <input type="date" id="dateFilter" class="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                            <button onclick="loadCounselingLogs()" class="w-full bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 transition active:scale-95 text-sm font-medium">
                                <i class="fas fa-filter mr-2"></i> 조건 검색 적용
                            </button>
                        </div>
                    </div>

                    <!-- 추천/기타 정보 -->
                    <div class="bg-blue-600 rounded-2xl shadow-sm p-6 text-white overflow-hidden relative group">
                        <i class="fas fa-lightbulb absolute right-4 bottom-4 text-4xl opacity-20 transform group-hover:scale-125 transition"></i>
                        <h5 class="font-bold text-lg mb-2">AI 상담 도우미</h5>
                        <p class="text-xs text-blue-100 leading-relaxed mb-4">현재까지 입력된 데이터를 바탕으로 개별 학생의 학습 패턴을 분석하고 있습니다.</p>
                        <button class="bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 px-4 rounded-lg backdrop-blur-sm transition">데이터 분석 보기</button>
                    </div>
                </aside>

                <!-- 중앙: 상담 타임라인 (9칸) -->
                <div class="col-span-12 lg:col-span-9 space-y-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-bold text-gray-900" id="listTitle">전체 상담 로그</h3>
                        <div class="flex items-center space-x-2 text-xs">
                            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span> 학사</span>
                            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span> 출결</span>
                            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> 취업</span>
                            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span> 고충</span>
                        </div>
                    </div>

                    <div id="counselingList" class="space-y-4 max-h-[600px] overflow-y-auto pr-2" onscroll="handleScroll(event)">
                        <!-- 타임라인 아이템들이 여기에 렌더링됨 -->
                        <div class="bg-white p-12 rounded-3xl border border-gray-100 text-center animate-fade-in">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-cloud-download-alt text-gray-300 text-2xl"></i>
                            </div>
                            <p class="text-gray-400 text-sm">데이터를 안전하게 불러오고 있습니다...</p>
                        </div>
                    </div>
                    
                    <!-- 페이지네이션 정보 및 더보기 버튼 -->
                    <div id="paginationInfo" class="hidden mt-4 text-center">
                        <div class="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100">
                            <span class="text-sm text-gray-500">
                                전체 <span id="totalLogsCount" class="font-bold text-gray-800">0</span>건 중 
                                <span id="displayedCount" class="font-bold text-blue-600">0</span>건 표시
                            </span>
                            <button id="loadMoreBtn" onclick="loadMoreLogs()" class="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition hidden">
                                <i class="fas fa-arrow-down mr-1"></i>더 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 고도화된 상담 작성/수정 모달 -->
    <div id="counselingModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm hidden overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
        <div class="relative bg-white w-full max-w-2xl shadow-2xl rounded-[2rem] overflow-hidden animate-fade-in group pointer-events-auto">
            <div class="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 id="modalTitle" class="text-xl font-bold text-gray-900">상담 리포트 작성</h3>
                    <p class="text-xs text-gray-500 mt-1">상담 내용을 구체적으로 기록하고 조치 결과를 관리합니다.</p>
                </div>
                <button onclick="closeModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            
            <form id="counselingForm" onsubmit="handleSave(event)" class="p-8">
                <input type="hidden" id="logId">
                
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담 일자 <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <i class="far fa-calendar absolute left-3.5 top-3 text-gray-400 pointer-events-none"></i>
                            <input type="date" id="counselingDate" required class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none">
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">대상 훈련생 <span class="text-red-500">*</span></label>
                        <select id="studentSelect" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none appearance-none cursor-pointer">
                            <option value="">훈련생 선택</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">관련 교육 과정</label>
                    <select id="courseSelect" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none cursor-pointer">
                        <option value="">과정 선택 (필수 아님)</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담 카테고리</label>
                        <div class="flex bg-gray-50 p-1 rounded-xl">
                            <select id="categorySelect" required class="w-full px-3 py-2 bg-transparent border-none text-sm outline-none cursor-pointer">
                                <option value="academic">학사/학습</option>
                                <option value="attendance">출결 관리</option>
                                <option value="career">취업/진로</option>
                                <option value="complaint">고충/건의</option>
                                <option value="other">기타 사항</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담 진행 방식</label>
                        <div class="flex bg-gray-50 p-1 rounded-xl">
                            <select id="methodSelect" required class="w-full px-3 py-2 bg-transparent border-none text-sm outline-none cursor-pointer">
                                <option value="face_to_face">대면 상담</option>
                                <option value="phone">유선 상담</option>
                                <option value="online">온라인(ZOOM/Talk)</option>
                                <option value="other">기타 방식</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">핵심 상담 내용 <span class="text-red-500">*</span></label>
                    <textarea id="content" rows="5" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none resize-none" placeholder="상담 내용을 논리적이고 구체적으로 기록해 주세요."></textarea>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">조치 결과</label>
                        <input type="text" id="result" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none" placeholder="조치 사항 또는 결과">
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">다음 상담 예정일</label>
                        <input type="date" id="nextCounselingDate" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button type="button" onclick="closeModal()" class="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition">창 닫기</button>
                    <div class="flex space-x-3">
                        <button type="submit" class="gradient-blue text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition transform active:scale-95">상담 내용 저장</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- 추가 상담 모달 -->
    <div id="appendModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm hidden overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
        <div class="relative bg-white w-full max-w-lg shadow-2xl rounded-[2rem] overflow-hidden animate-fade-in">
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-white">추가 상담 기록</h3>
                        <p class="text-xs text-white/80 mt-1">기존 상담 내용에 새로운 상담 기록을 추가합니다.</p>
                    </div>
                    <button onclick="closeAppendModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/80 transition">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>
            </div>
            
            <form id="appendForm" onsubmit="handleAppendSave(event)" class="p-8">
                <input type="hidden" id="appendLogId">
                
                <div class="mb-4">
                    <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                        <strong class="text-gray-800" id="appendStudentName">-</strong> 훈련생의 상담 기록에 내용을 추가합니다.
                    </div>
                </div>
                
                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">추가 상담 일자</label>
                    <input type="date" id="appendDate" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 text-sm outline-none">
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담 방식</label>
                        <select id="appendMethod" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none cursor-pointer">
                            <option value="face_to_face">대면 상담</option>
                            <option value="phone">유선 상담</option>
                            <option value="online">온라인</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담자</label>
                        <input type="text" id="appendCounselor" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none" placeholder="상담자 이름">
                    </div>
                </div>

                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">추가 상담 내용 <span class="text-red-500">*</span></label>
                    <textarea id="appendContent" rows="4" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 text-sm outline-none resize-none" placeholder="새로운 상담 내용을 입력하세요..."></textarea>
                </div>

                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">조치 결과 / 후속 계획</label>
                    <input type="text" id="appendResult" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 text-sm outline-none" placeholder="조치 사항이나 후속 계획">
                </div>

                <div class="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button type="button" onclick="closeAppendModal()" class="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition">취소</button>
                    <button type="submit" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition transform active:scale-95">
                        <i class="fas fa-plus-circle mr-2"></i>상담 내용 추가
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let counselingData = [];
        let currentFilter = 'all';
        
        // 페이지네이션 상태
        let filteredData = [];
        let displayCount = 3; // 초기 표시 개수
        const itemsPerPage = 3; // 한 번에 추가로 로드할 개수
        let isLoading = false;

        document.addEventListener('DOMContentLoaded', () => {
            initialize();
        });

        async function initialize() {
            const params = new URLSearchParams(window.location.search);
            const searchParam = params.get('search');
            if (searchParam) {
                document.getElementById('searchInput').value = searchParam;
            }

            await Promise.all([
                loadCourses(),
                loadStudents(),
                loadCounselingLogs()
            ]);
            
            setupEventListeners();
        }

        function setupEventListeners() {
            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    displayCount = itemsPerPage; // 검색 시 리셋
                    loadCounselingLogs();
                }
            });
            
            document.getElementById('courseFilter').addEventListener('change', () => {
                displayCount = itemsPerPage;
                loadCounselingLogs();
            });
            document.getElementById('dateFilter').addEventListener('change', () => {
                displayCount = itemsPerPage;
                loadCounselingLogs();
            });
        }

        function resetSearch() {
            document.getElementById('searchInput').value = '';
            document.getElementById('courseFilter').value = '';
            document.getElementById('dateFilter').value = '';
            
            const url = new URL(window.location.href);
            url.search = '';
            window.history.pushState({}, '', url);

            setFilter('all');
        }

        function setFilter(filter) {
            if (filter === 'all') {
                const params = new URLSearchParams(window.location.search);
                const searchParam = params.get('search');
                const currentInput = document.getElementById('searchInput').value;
                
                if (searchParam && currentInput === searchParam) {
                    resetSearch();
                    return; 
                }
            }

            currentFilter = filter;
            displayCount = itemsPerPage; 
            
            const buttons = document.querySelectorAll('header .active-tab, header .text-gray-500');
            buttons.forEach(btn => {
                if (btn.textContent.includes(getCategoryLabel(filter)) || (filter === 'all' && btn.textContent === '전체 내역')) {
                    btn.className = 'py-2 active-tab';
                } else {
                    btn.className = 'py-2 text-gray-500 hover:text-blue-600';
                }
            });

            loadCounselingLogs();
        }

        function getCategoryLabel(key) {
            const map = { all: '전체', academic: '학사', attendance: '출결', career: '취업', complaint: '고충', other: '기타' };
            return map[key] || key;
        }

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                const courses = result.data || result;

                const filterSelect = document.getElementById('courseFilter');
                const modalSelect = document.getElementById('courseSelect');

                courses.forEach(c => {
                    filterSelect.add(new Option(c.title, c.id));
                    modalSelect.add(new Option(c.title, c.id));
                });
            } catch (e) {
                console.error('코스 로드 실패', e);
            }
        }

        async function loadStudents() {
            try {
                const response = await fetch('/api/students');
                const result = await response.json();
                const students = result.data || result;

                const select = document.getElementById('studentSelect');
                students.sort((a,b) => a.name.localeCompare(b.name)).forEach(s => {
                    select.add(new Option(\`\${s.name} (\${s.email || '-'})\`, s.id));
                });
            } catch (e) {
                console.error('학생 로드 실패', e);
            }
        }

        async function loadCounselingLogs() {
            const listContainer = document.getElementById('counselingList');
            const search = document.getElementById('searchInput').value;
            const courseId = document.getElementById('courseFilter').value;
            const date = document.getElementById('dateFilter').value;

            try {
                let url = '/api/hrd/counseling?';
                if (search) url += \`search=\${encodeURIComponent(search)}&\`;
                if (courseId) url += \`course_id=\${courseId}&\`;
                if (date) url += \`date=\${date}&\`;
                
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                counselingData = result.success ? result.data : (Array.isArray(result) ? result : []);

                // 필터링 적용 (클라이언트 사이드 범주 필터)
                filteredData = currentFilter === 'all' 
                    ? counselingData 
                    : counselingData.filter(log => log.category === currentFilter);

                // 페이지네이션 적용하여 렌더링
                renderLogsWithPagination();
                updateStats(counselingData);
                updatePaginationUI();
            } catch (e) {
                console.error('로그 로드 실패', e);
                listContainer.innerHTML = \`<div class="p-10 text-red-500 text-center font-medium">데이터 로드 중 오류가 발생했습니다.</div>\`;
            }
        }

        function updateStats(data) {
            const today = new Date().toISOString().split('T')[0];
            const todayCount = data.filter(log => log.counseling_date.split('T')[0] === today).length;
            document.getElementById('todayCount').textContent = todayCount;
        }
        
        function updatePaginationUI() {
            const paginationInfo = document.getElementById('paginationInfo');
            const totalCount = document.getElementById('totalLogsCount');
            const displayedCountEl = document.getElementById('displayedCount');
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            
            if (filteredData.length > 0) {
                paginationInfo.classList.remove('hidden');
                totalCount.textContent = filteredData.length;
                displayedCountEl.textContent = Math.min(displayCount, filteredData.length);
                
                if (displayCount < filteredData.length) {
                    loadMoreBtn.classList.remove('hidden');
                } else {
                    loadMoreBtn.classList.add('hidden');
                }
            } else {
                paginationInfo.classList.add('hidden');
            }
        }
        
        function loadMoreLogs() {
            displayCount += itemsPerPage;
            renderLogsWithPagination();
            updatePaginationUI();
        }
        
        function handleScroll(event) {
            const container = event.target;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            // 스크롤이 하단 근처에 도달하면 (100px 여유)
            if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && displayCount < filteredData.length) {
                isLoading = true;
                displayCount += itemsPerPage;
                renderLogsWithPagination();
                updatePaginationUI();
                isLoading = false;
            }
        }
        
        function renderLogsWithPagination() {
            // displayCount만큼만 잘라서 렌더링
            const dataToRender = filteredData.slice(0, displayCount);
            renderLogs(dataToRender);
        }

        function renderLogs(data) {
            const container = document.getElementById('counselingList');
            if (data.length === 0) {
                container.innerHTML = \`
                    <div class="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center animate-fade-in">
                        <i class="fas fa-folder-open text-gray-200 text-4xl mb-4"></i>
                        <p class="text-gray-400">일치하는 상담 내역이 없습니다.</p>
                    </div>\`;
                return;
            }

            const grouped = {};
            data.forEach(log => {
                const date = log.counseling_date.split('T')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(log);
            });

            const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

            const categoryInfo = {
                academic: { label: '학사/학습', color: 'bg-blue-50 text-blue-600' },
                attendance: { label: '출결/행정', color: 'bg-yellow-50 text-yellow-600' },
                career: { label: '취업/진로', color: 'bg-green-50 text-green-600' },
                complaint: { label: '고충/건의', color: 'bg-red-50 text-red-600' },
                other: { label: '기타 사항', color: 'bg-gray-50 text-gray-600' }
            };

            const methodLabels = { face_to_face: '대면', phone: '유선', online: '온라인', other: '기타' };

            container.innerHTML = sortedDates.map(date => {
                const displayDate = new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
                return \`
                    <div class="relative pl-12 timeline-item animate-fade-in">
                        <div class="timeline-line"></div>
                        <div class="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center z-10 shadow-sm">
                            <i class="far fa-calendar-alt text-gray-400 text-sm"></i>
                        </div>
                        <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">\${displayDate}</h4>
                        <div class="space-y-4 pb-10">
                            \${grouped[date].map(log => {
                                const info = categoryInfo[log.category] || categoryInfo.other;
                                const entries = parseConsultEntries(log.content);
                                const latestEntry = entries[entries.length - 1];
                                const hasHistory = entries.length > 1;
                                
                                return \`
                                    <div class="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden" id="card-\${log.id}">
                                        <div class="p-6 pb-4">
                                            <div class="flex items-start justify-between mb-4">
                                                <div class="flex items-center">
                                                    <div class="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-100 border border-gray-100 shadow-inner">
                                                        <img src="\${log.student_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(log.student_name)}" class="w-full h-full object-cover">
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center flex-wrap gap-2">
                                                            \${hasHistory ? '<span onclick="toggleHistory(' + log.id + ')" class="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition">' + log.student_name + ' <i class="fas fa-chevron-down text-[10px] text-gray-400 ml-1"></i></span>' : '<span class="font-bold text-gray-900">' + log.student_name + '</span>'}
                                                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase \${info.color}">\${info.label}</span>
                                                            \${hasHistory ? '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-600"><i class="fas fa-layer-group mr-1"></i>' + entries.length + '회 상담</span>' : ''}
                                                        </div>
                                                        <p class="text-[10px] text-gray-400 mt-0.5">\${log.course_title || '일반 상담'} · \${methodLabels[log.method] || '기타'}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center space-x-1">
                                                    <button onclick="toggleInlineAdd(\${log.id})" title="추가 상담" class="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition flex items-center justify-center">
                                                        <i class="fas fa-plus text-sm"></i>
                                                    </button>
                                                    <button onclick="editLog(\${log.id})" title="수정" class="w-8 h-8 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-600 transition flex items-center justify-center">
                                                        <i class="fas fa-edit text-sm"></i>
                                                    </button>
                                                    <button onclick="deleteLog(\${log.id})" title="삭제" class="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition flex items-center justify-center">
                                                        <i class="fas fa-trash-alt text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div id="inline-add-\${log.id}" class="inline-add-form">
                                                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-4 border border-green-100">
                                                    <div class="flex items-center gap-2 mb-3">
                                                        <i class="fas fa-plus-circle text-green-600"></i>
                                                        <span class="text-sm font-bold text-green-800">추가 상담 기록</span>
                                                    </div>
                                                    <textarea id="inline-content-\${log.id}" rows="2" class="w-full px-3 py-2 bg-white border border-green-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 resize-none mb-3" placeholder="새로운 상담 내용을 입력하세요..."></textarea>
                                                    <div class="flex items-center justify-between">
                                                        <select id="inline-method-\${log.id}" class="px-2 py-1.5 bg-white border border-green-200 rounded-lg text-xs outline-none">
                                                            <option value="face_to_face">대면</option>
                                                            <option value="phone">유선</option>
                                                            <option value="online">온라인</option>
                                                        </select>
                                                        <div class="flex gap-2">
                                                            <button type="button" onclick="toggleInlineAdd(\${log.id})" class="px-3 py-1.5 text-gray-500 text-xs font-medium hover:text-gray-700">취소</button>
                                                            <button type="button" onclick="saveInlineAdd(\${log.id})" class="px-4 py-1.5 gradient-green text-white rounded-lg text-xs font-bold shadow-sm">
                                                                <i class="fas fa-check mr-1"></i>추가
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="bg-gray-50 rounded-2xl p-4 mb-3">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <span class="text-[10px] font-black text-gray-500 uppercase">최신 상담</span>
                                                    \${latestEntry.date ? '<span class="text-[10px] text-gray-400">' + latestEntry.date + '</span>' : ''}
                                                </div>
                                                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">\${latestEntry.content}</p>
                                            </div>
                                            
                                            \${hasHistory ? \`
                                            <button onclick="toggleHistory(\${log.id})" class="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-purple-600 hover:text-purple-700 transition">
                                                <i class="fas fa-history"></i>
                                                <span>이전 상담 내역 \${entries.length - 1}건 보기</span>
                                                <i class="fas fa-chevron-down history-toggle-icon" id="toggle-icon-\${log.id}"></i>
                                            </button>
                                            
                                            <div id="history-\${log.id}" class="history-accordion" data-total-entries="\${entries.length - 1}" data-show-count="2">
                                                <div class="space-y-2 pt-3 border-t border-gray-100" id="history-items-\${log.id}">
                                                    \${entries.slice(0, -1).reverse().slice(0, 2).map(function(entry, idx) {
                                                        return '<div class="bg-purple-50/50 rounded-xl p-3 border border-purple-100 history-entry-' + log.id + '">' +
                                                            '<div class="flex items-center gap-2 mb-1">' +
                                                                '<span class="w-5 h-5 rounded-full bg-purple-200 text-purple-700 text-[10px] font-bold flex items-center justify-center">' + (entries.length - 1 - idx) + '</span>' +
                                                                '<span class="text-[10px] font-bold text-purple-600">' + (entry.date || '초기 상담') + '</span>' +
                                                                (entry.method ? '<span class="text-[10px] text-purple-400">' + entry.method + '</span>' : '') +
                                                            '</div>' +
                                                            '<p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line pl-7">' + entry.content + '</p>' +
                                                        '</div>';
                                                    }).join('')}
                                                </div>
                                                \${entries.length - 1 > 2 ? '<div class="mt-3 text-center"><button onclick="loadMoreHistory(' + log.id + ', ' + JSON.stringify(entries.slice(0, -1).reverse()).replace(/"/g, "&quot;") + ')" id="load-more-history-' + log.id + '" class="px-4 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition"><i class="fas fa-ellipsis-h mr-1"></i>이전 상담 ' + (entries.length - 1 - 2) + '건 더 보기</button></div>' : ''}
                                            </div>
                                            \` : ''}
                                            
                                            \${log.result ? \`
                                            <div class="bg-blue-50/50 rounded-2xl p-4 mt-3 border border-blue-50 flex items-start">
                                                <i class="fas fa-check-circle text-blue-500 mt-0.5 mr-2"></i>
                                                <div>
                                                    <span class="text-[10px] font-black text-blue-700 uppercase tracking-wider block mb-1">조치 결과 및 계획</span>
                                                    <p class="text-xs text-blue-800">\${log.result}</p>
                                                </div>
                                            </div>\` : ''}
                                        </div>
                                        
                                        <div class="px-6 py-3 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                                            <div class="flex items-center text-[10px] text-gray-400">
                                                <i class="far fa-user mr-1.5"></i> 상담자: <span class="text-gray-600 ml-1 font-medium">\${log.counselor_name || '관리자'}</span>
                                            </div>
                                            \${log.next_counseling_date ? '<div class="flex items-center text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full"><i class="far fa-clock mr-1.5"></i> 차기 상담: ' + new Date(log.next_counseling_date).toLocaleDateString() + '</div>' : ''}
                                        </div>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function parseConsultEntries(content) {
            if (!content) return [{ content: '', date: '', method: '' }];
            
            var separator = '--- [추가 상담:';
            var parts = content.split(separator);
            var entries = [];
            
            if (parts[0].trim()) {
                entries.push({ content: parts[0].trim(), date: '', method: '' });
            }
            
            for (var i = 1; i < parts.length; i++) {
                var part = parts[i];
                var dateMatch = part.match(/^([^\\]]+)\\]/);
                var date = dateMatch ? dateMatch[1].trim() : '';
                
                var afterDate = dateMatch ? part.substring(dateMatch[0].length) : part;
                var lines = afterDate.split('\\n').filter(function(l) { return l.trim(); });
                
                var method = '';
                var contentLines = [];
                
                for (var j = 0; j < lines.length; j++) {
                    var line = lines[j];
                    if (line.indexOf('상담자:') !== -1 && line.indexOf('방식:') !== -1) {
                        var methodMatch = line.match(/방식:\\s*([^\\n]+)/);
                        method = methodMatch ? methodMatch[1].trim() : '';
                    } else if (line.indexOf('---') !== 0) {
                        contentLines.push(line);
                    }
                }
                
                entries.push({
                    content: contentLines.join('\\n').trim(),
                    date: date,
                    method: method
                });
            }
            
            return entries.length > 0 ? entries : [{ content: content, date: '', method: '' }];
        }
        
        // 현재 열린 아코디언 ID 추적
        var currentOpenHistoryId = null;
        
        function toggleHistory(logId) {
            var historyEl = document.getElementById('history-' + logId);
            var iconEl = document.getElementById('toggle-icon-' + logId);
            
            if (!historyEl || !iconEl) return;
            
            var isOpening = !historyEl.classList.contains('open');
            
            // 다른 열린 아코디언이 있으면 먼저 닫기
            if (currentOpenHistoryId && currentOpenHistoryId !== logId) {
                var prevHistoryEl = document.getElementById('history-' + currentOpenHistoryId);
                var prevIconEl = document.getElementById('toggle-icon-' + currentOpenHistoryId);
                if (prevHistoryEl && prevHistoryEl.classList.contains('open')) {
                    prevHistoryEl.classList.remove('open');
                    if (prevIconEl) prevIconEl.classList.remove('open');
                }
            }
            
            // 현재 아코디언 토글
            historyEl.classList.toggle('open');
            iconEl.classList.toggle('open');
            
            // 현재 열린 ID 업데이트
            if (isOpening) {
                currentOpenHistoryId = logId;
            } else {
                currentOpenHistoryId = null;
            }
        }
        
        // 서브 페이지네이션: 이전 상담 내역 더 보기
        var historyShowCounts = {}; // logId별 표시 개수 관리
        
        function loadMoreHistory(logId, allEntries) {
            // 현재 표시 개수 가져오기 (기본 2개에서 시작)
            if (!historyShowCounts[logId]) {
                historyShowCounts[logId] = 2;
            }
            
            // 2개 더 추가
            historyShowCounts[logId] += 2;
            var showCount = historyShowCounts[logId];
            
            var container = document.getElementById('history-items-' + logId);
            var loadMoreBtn = document.getElementById('load-more-history-' + logId);
            
            if (!container) return;
            
            // 기존 항목 제거
            container.innerHTML = '';
            
            // showCount만큼 다시 렌더링
            var entriesToShow = allEntries.slice(0, showCount);
            var totalEntries = allEntries.length;
            
            entriesToShow.forEach(function(entry, idx) {
                var entryHtml = '<div class="bg-purple-50/50 rounded-xl p-3 border border-purple-100 history-entry-' + logId + '">' +
                    '<div class="flex items-center gap-2 mb-1">' +
                        '<span class="w-5 h-5 rounded-full bg-purple-200 text-purple-700 text-[10px] font-bold flex items-center justify-center">' + (totalEntries - idx) + '</span>' +
                        '<span class="text-[10px] font-bold text-purple-600">' + (entry.date || '초기 상담') + '</span>' +
                        (entry.method ? '<span class="text-[10px] text-purple-400">' + entry.method + '</span>' : '') +
                    '</div>' +
                    '<p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line pl-7">' + entry.content + '</p>' +
                '</div>';
                container.innerHTML += entryHtml;
            });
            
            // 더 보기 버튼 업데이트
            if (loadMoreBtn) {
                var remaining = totalEntries - showCount;
                if (remaining <= 0) {
                    loadMoreBtn.parentElement.remove();
                } else {
                    loadMoreBtn.innerHTML = '<i class="fas fa-ellipsis-h mr-1"></i>이전 상담 ' + remaining + '건 더 보기';
                }
            }
        }
        
        // 현재 열린 인라인 폼 ID 추적
        var currentOpenInlineId = null;
        
        function toggleInlineAdd(logId) {
            var formEl = document.getElementById('inline-add-' + logId);
            if (!formEl) return;
            
            var isOpening = !formEl.classList.contains('open');
            
            // 다른 열린 인라인 폼이 있으면 먼저 닫기
            if (currentOpenInlineId && currentOpenInlineId !== logId) {
                var prevFormEl = document.getElementById('inline-add-' + currentOpenInlineId);
                if (prevFormEl && prevFormEl.classList.contains('open')) {
                    prevFormEl.classList.remove('open');
                }
            }
            
            // 현재 폼 토글
            formEl.classList.toggle('open');
            
            // 현재 열린 ID 업데이트
            if (isOpening) {
                currentOpenInlineId = logId;
                document.getElementById('inline-content-' + logId).focus();
            } else {
                currentOpenInlineId = null;
            }
        }
        
        async function saveInlineAdd(logId) {
            var log = counselingData.find(function(d) { return d.id === logId; });
            if (!log) return;
            
            var content = document.getElementById('inline-content-' + logId).value.trim();
            var method = document.getElementById('inline-method-' + logId).value;
            
            if (!content) {
                alert('상담 내용을 입력해주세요.');
                return;
            }
            
            var today = new Date().toISOString().split('T')[0];
            var methodLabels = { face_to_face: '대면', phone: '유선', online: '온라인', other: '기타' };
            var user = JSON.parse(localStorage.getItem('user') || '{}');
            var counselor = user.name || '관리자';
            
            var newEntry = '\\n\\n--- [추가 상담: ' + today + '] ---\\n상담자: ' + counselor + ' | 방식: ' + methodLabels[method] + '\\n' + content;
            var updatedContent = log.content + newEntry;
            
            try {
                var token = localStorage.getItem('token');
                var response = await fetch('/api/hrd/counseling/' + logId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        student_id: log.student_id,
                        course_id: log.course_id,
                        category: log.category,
                        method: log.method,
                        content: updatedContent,
                        result: log.result,
                        counseling_date: today,
                        next_counseling_date: log.next_counseling_date,
                        counselor_id: log.counselor_id
                    })
                });
                
                if (response.ok) {
                    toggleInlineAdd(logId);
                    loadCounselingLogs();
                } else {
                    alert('저장에 실패했습니다.');
                }
            } catch (err) {
                console.error(err);
                alert('네트워크 오류가 발생했습니다.');
            }
        }

        function openModal() {
            const form = document.getElementById('counselingForm');
            form.reset();
            document.getElementById('logId').value = '';
            document.getElementById('modalTitle').textContent = '상담 리포트 작성';
            document.getElementById('counselingDate').valueAsDate = new Date();
            document.getElementById('counselingModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('counselingModal').classList.add('hidden');
        }

        function editLog(id) {
            const log = counselingData.find(d => d.id === id);
            if (!log) return;

            document.getElementById('logId').value = log.id;
            document.getElementById('modalTitle').textContent = '상담 리포트 수정';
            document.getElementById('studentSelect').value = log.student_id;
            document.getElementById('courseSelect').value = log.course_id || '';
            document.getElementById('categorySelect').value = log.category;
            document.getElementById('methodSelect').value = log.method;
            document.getElementById('content').value = log.content;
            document.getElementById('result').value = log.result || '';
            document.getElementById('counselingDate').value = log.counseling_date.split('T')[0];
            
            if (log.next_counseling_date) {
                document.getElementById('nextCounselingDate').value = log.next_counseling_date.split('T')[0];
            } else {
                document.getElementById('nextCounselingDate').value = '';
            }

            document.getElementById('counselingModal').classList.remove('hidden');
        }

        async function handleSave(e) {
            e.preventDefault();
            const id = document.getElementById('logId').value;
            const method = id ? 'PUT' : 'POST';
            const url = id ? \`/api/hrd/counseling/\${id}\` : '/api/hrd/counseling';

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const data = {
                student_id: document.getElementById('studentSelect').value,
                course_id: document.getElementById('courseSelect').value || null,
                category: document.getElementById('categorySelect').value,
                method: document.getElementById('methodSelect').value,
                content: document.getElementById('content').value,
                result: document.getElementById('result').value,
                counseling_date: document.getElementById('counselingDate').value,
                next_counseling_date: document.getElementById('nextCounselingDate').value || null,
                counselor_id: user.id
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('상담 리포트가 성공적으로 저장되었습니다.');
                    closeModal();
                    loadCounselingLogs();
                } else {
                    const err = await response.json();
                    alert('저장 실패: ' + (err.error || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error(err);
                alert('네트워크 오류가 발생했습니다.');
            }
        }

        async function deleteLog(id) {
            if (!confirm('해당 상담 기록을 영구적으로 삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/hrd/counseling/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (response.ok) {
                    loadCounselingLogs();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
            }
        }

        // ========== 추가 상담 기능 ==========
        let appendTargetLog = null;

        function openAppendModal(logId) {
            const log = counselingData.find(d => d.id === logId);
            if (!log) return;
            
            appendTargetLog = log;
            document.getElementById('appendLogId').value = log.id;
            document.getElementById('appendStudentName').textContent = log.student_name;
            document.getElementById('appendDate').valueAsDate = new Date();
            document.getElementById('appendContent').value = '';
            document.getElementById('appendResult').value = '';
            
            // 상담자 기본값 설정
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            document.getElementById('appendCounselor').value = user.name || '관리자';
            
            document.getElementById('appendModal').classList.remove('hidden');
        }

        function closeAppendModal() {
            document.getElementById('appendModal').classList.add('hidden');
            appendTargetLog = null;
        }

        async function handleAppendSave(e) {
            e.preventDefault();
            
            if (!appendTargetLog) return;
            
            const appendDate = document.getElementById('appendDate').value;
            const appendMethod = document.getElementById('appendMethod').value;
            const appendCounselor = document.getElementById('appendCounselor').value || '관리자';
            const appendContent = document.getElementById('appendContent').value.trim();
            const appendResult = document.getElementById('appendResult').value.trim();
            
            if (!appendContent) {
                alert('추가 상담 내용을 입력해주세요.');
                return;
            }
            
            const methodLabels = { face_to_face: '대면', phone: '유선', online: '온라인', other: '기타' };
            
            // 기존 content에 새 내용을 추가하는 형식
            const newEntry = '\\n\\n--- [추가 상담: ' + appendDate + '] ---\\n상담자: ' + appendCounselor + ' | 방식: ' + (methodLabels[appendMethod] || appendMethod) + '\\n' + appendContent + (appendResult ? '\\n→ 조치/계획: ' + appendResult : '');
            const updatedContent = appendTargetLog.content + newEntry;
            
            // 결과도 업데이트 (최신 결과로 덮어쓰기)
            const updatedResult = appendResult || appendTargetLog.result;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/counseling/' + appendTargetLog.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        ...appendTargetLog,
                        content: updatedContent,
                        result: updatedResult,
                        // 마지막 상담일을 추가 상담일로 업데이트
                        counseling_date: appendDate
                    })
                });
                
                if (response.ok) {
                    alert('추가 상담 내용이 저장되었습니다.');
                    closeAppendModal();
                    loadCounselingLogs();
                } else {
                    const err = await response.json();
                    alert('저장 실패: ' + (err.error || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error(err);
                alert('네트워크 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
