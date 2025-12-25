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

                    <div id="counselingList" class="space-y-4">
                        <!-- 타임라인 아이템들이 여기에 렌더링됨 -->
                        <div class="bg-white p-12 rounded-3xl border border-gray-100 text-center animate-fade-in">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-cloud-download-alt text-gray-300 text-2xl"></i>
                            </div>
                            <p class="text-gray-400 text-sm">데이터를 안전하게 불러오고 있습니다...</p>
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

    <script>
        let counselingData = [];
        let currentFilter = 'all';

        document.addEventListener('DOMContentLoaded', () => {
            initialize();
        });

        async function initialize() {
            await Promise.all([
                loadCourses(),
                loadStudents(),
                loadCounselingLogs()
            ]);
            
            setupEventListeners();
        }

        function setupEventListeners() {
            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadCounselingLogs();
            });
            
            document.getElementById('courseFilter').addEventListener('change', loadCounselingLogs);
            document.getElementById('dateFilter').addEventListener('change', loadCounselingLogs);
        }

        function setFilter(filter) {
            currentFilter = filter;
            
            // UI 업데이트
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
                const filtered = currentFilter === 'all' 
                    ? counselingData 
                    : counselingData.filter(log => log.category === currentFilter);

                renderLogs(filtered);
                updateStats(counselingData);
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

            // 날짜별 그룹화
            const grouped = {};
            data.forEach(log => {
                const date = log.counseling_date.split('T')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(log);
            });

            const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

            const categoryInfo = {
                academic: { label: '학사/학습', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
                attendance: { label: '출결/행정', color: 'bg-yellow-50 text-yellow-600', dot: 'bg-yellow-500' },
                career: { label: '취업/진로', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
                complaint: { label: '고충/건의', color: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
                other: { label: '기타 사항', color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-500' }
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
                                return \`
                                    <div class="group bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative">
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="flex items-center">
                                                <div class="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-100 border border-gray-100 shadow-inner">
                                                    <img src="\${log.student_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(log.student_name)}" class="w-full h-full object-cover">
                                                </div>
                                                <div>
                                                    <div class="flex items-center">
                                                        <span class="font-bold text-gray-900">\${log.student_name}</span>
                                                        <span class="ml-2 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase \${info.color}">\${info.label}</span>
                                                    </div>
                                                    <p class="text-[10px] text-gray-400 mt-0.5">\${log.course_title || '일반 상담'} · \${methodLabels[log.method] || '기타'}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-1">
                                                <button onclick="editLog(\${log.id})" class="w-8 h-8 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-600 transition flex items-center justify-center">
                                                    <i class="fas fa-edit text-sm"></i>
                                                </button>
                                                <button onclick="deleteLog(\${log.id})" class="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition flex items-center justify-center">
                                                    <i class="fas fa-trash-alt text-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="pl-0">
                                            <p class="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">\${log.content}</p>
                                            
                                            \${log.result ? \`
                                            <div class="bg-blue-50/50 rounded-2xl p-4 border border-blue-50 flex items-start">
                                                <i class="fas fa-check-circle text-blue-500 mt-0.5 mr-2"></i>
                                                <div>
                                                    <span class="text-[10px] font-black text-blue-700 uppercase tracking-wider block mb-1">조치 결과 및 계획</span>
                                                    <p class="text-xs text-blue-800">\${log.result}</p>
                                                </div>
                                            </div>\` : ''}
                                            
                                            <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                                <div class="flex items-center text-[10px] text-gray-400">
                                                    <i class="far fa-user mr-1.5"></i> 상담자: <span class="text-gray-600 ml-1 font-medium">\${log.counselor_name || '관리자'}</span>
                                                </div>
                                                \${log.next_counseling_date ? \`
                                                <div class="flex items-center text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                                                    <i class="far fa-clock mr-1.5"></i> 차기 상담: \${new Date(log.next_counseling_date).toLocaleDateString()}
                                                </div>\` : ''}
                                            </div>
                                        </div>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                \`;
            }).join('');
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
    </script>
</body>
</html>
`;
