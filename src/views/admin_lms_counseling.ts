import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsCounselingHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>과정별 상담 일지 - LMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7', 500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54' }
            }
          }
        }
      }
    </script>
    <style>
        body { font-family: 'Pretendard', sans-serif; }
        .glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .active-tab { border-bottom: 2px solid #3b82f6; color: #3b82f6; }
        .gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); }
        .gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f3f5; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
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
        
        .history-accordion { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .history-accordion.open { max-height: 2000px; }
        .history-toggle-icon { transition: transform 0.3s ease; }
        .history-toggle-icon.open { transform: rotate(180deg); }
        
        .inline-add-form { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.3s ease; opacity: 0; }
        .inline-add-form.open { max-height: 500px; opacity: 1; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b] overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('courses')}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('counseling')}

                <!-- 메인 컨텐츠 -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    <!-- 헤더 및 컨트롤 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 class="text-xl font-bold tracking-tight text-gray-900">과정별 상담 일지</h1>
                                <p class="text-xs text-gray-500 mt-1">이 과정에 등록된 훈련생들과의 상담 기록을 통합 관리합니다.</p>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="openModal()" class="gradient-blue text-white px-5 py-2.5 rounded-xl transition flex items-center shadow-lg shadow-blue-500/20 active:scale-95 text-sm font-bold">
                                    <i class="fas fa-plus-circle mr-2"></i> 신규 상담 작성
                                </button>
                            </div>
                        </div>

                        <!-- 필터 -->
                        <div class="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div class="relative flex-1 min-w-[240px]">
                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input type="text" id="searchInput" placeholder="훈련생 이름 검색..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all text-sm outline-none">
                            </div>
                            <div class="flex items-center space-x-2">
                                <button class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 category-filter active-tab" onclick="setFilter('all')">전체</button>
                                <button class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 category-filter" onclick="setFilter('academic')">학사/학습</button>
                                <button class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 category-filter" onclick="setFilter('attendance')">출결/행정</button>
                                <button class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 category-filter" onclick="setFilter('career')">취업/진로</button>
                                <button class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 category-filter" onclick="setFilter('complaint')">고충/건의</button>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-8">
                        <!-- 통계 (사이드) -->
                        <aside class="col-span-12 lg:col-span-3 space-y-6">
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                                <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
                                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">오늘의 상담</h4>
                                <div class="text-3xl font-black text-gray-900" id="todayCount">0</div>
                            </div>
                            <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group">
                                <i class="fas fa-comments absolute right-4 bottom-4 text-4xl opacity-20 transform group-hover:scale-110 transition"></i>
                                <h5 class="font-bold text-lg mb-2">상담 가이드</h5>
                                <p class="text-xs text-blue-100 leading-relaxed mb-3">훈련생의 고충을 경청하고 구체적인 해결 방안을 제시해주세요. 정기적인 상담은 중도 탈락을 예방합니다.</p>
                            </div>
                        </aside>

                        <!-- 타임라인 (메인) -->
                        <div class="col-span-12 lg:col-span-9">
                           <div id="counselingList" class="space-y-4 pb-20">
                                <!-- 로딩 -->
                                <div class="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                                    <i class="fas fa-circle-notch fa-spin text-gray-300 text-2xl mb-4"></i>
                                    <p class="text-gray-400 text-sm">상담 기록을 불러오고 있습니다...</p>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 상담 작성/수정 모달 -->
    <div id="counselingModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm hidden overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
        <div class="relative bg-white w-full max-w-2xl shadow-2xl rounded-[2rem] overflow-hidden animate-fade-in">
            <div class="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 id="modalTitle" class="text-xl font-bold text-gray-900">상담 일지 작성</h3>
                    <p class="text-xs text-gray-500 mt-1">이 과정의 훈련생에 대한 상담 기록을 작성합니다.</p>
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
                        <input type="date" id="counselingDate" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none">
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">대상 훈련생 <span class="text-red-500">*</span></label>
                        <select id="studentSelect" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none cursor-pointer appearance-none">
                            <option value="">훈련생 선택</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">상담 카테고리</label>
                        <select id="categorySelect" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none cursor-pointer appearance-none">
                            <option value="academic">학사/학습</option>
                            <option value="attendance">출결 관리</option>
                            <option value="career">취업/진로</option>
                            <option value="complaint">고충/건의</option>
                            <option value="other">기타 사항</option>
                        </select>
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">진행 방식</label>
                        <select id="methodSelect" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none cursor-pointer appearance-none">
                            <option value="face_to_face">대면 상담</option>
                            <option value="phone">유선 상담</option>
                            <option value="online">온라인(ZOOM/Talk)</option>
                            <option value="other">기타 방식</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-1.5 mb-6">
                    <label class="block text-sm font-semibold text-gray-700">상담 내용 <span class="text-red-500">*</span></label>
                    <textarea id="content" rows="5" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none resize-none" placeholder="상담 내용을 상세히 기록하세요."></textarea>
                </div>

                <div class="space-y-1.5 mb-8">
                    <label class="block text-sm font-semibold text-gray-700">조치 결과 및 계획</label>
                    <input type="text" id="result" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm outline-none" placeholder="조치 사항 또는 결과">
                </div>

                <div class="flex items-center justify-end border-t border-gray-100 pt-6 gap-3">
                    <button type="button" onclick="closeModal()" class="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition">취소</button>
                    <button type="submit" class="gradient-blue text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition transform active:scale-95">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const pathParts = window.location.pathname.split('/');
        const courseId = pathParts[pathParts.indexOf('courses') + 1];
        let counselingData = [];
        let currentFilter = 'all';

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('counselingDate').valueAsDate = new Date();
            loadStudents();
            loadCounselingLogs();

            document.getElementById('searchInput').addEventListener('keyup', (e) => {
                if(e.key === 'Enter') loadCounselingLogs();
            });
        });

        async function loadStudents() {
            try {
                const token = localStorage.getItem('token');
                // 해당 과정의 수강생 목록 (enrollments api 활용)
                const response = await fetch('/api/enrollments?course_id=' + courseId + '&status=approved', {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const select = document.getElementById('studentSelect');
                
                // enrollments API returns { data: [...] }
                const students = result.data || [];
                students.forEach(item => {
                    // item.student_id, item.user_name, item.user_email
                    // student_id is used for both Select Value.
                    const val = item.student_id; 
                    const opt = new Option(\`\${item.user_name} (\${item.user_email})\`, val);
                    select.add(opt);
                });
            } catch (e) {
                console.error('수강생 로드 실패', e);
            }
        }

        async function loadCounselingLogs() {
            const container = document.getElementById('counselingList');
            const search = document.getElementById('searchInput').value;
            const token = localStorage.getItem('token');

            try {
                let url = \`/api/hrd/counseling?course_id=\${courseId}&\`; 
                if (search) url += \`search=\${encodeURIComponent(search)}\`;
                
                const response = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await response.json();
                
                if (result.success) {
                    counselingData = result.data;
                    filterAndRender();
                    updateStats(counselingData);
                } else {
                    container.innerHTML = '<div class="text-center py-10 text-gray-400">데이터를 불러오지 못했습니다.</div>';
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-10 text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function setFilter(filter) {
            currentFilter = filter;
            const buttons = document.querySelectorAll('.category-filter');
            buttons.forEach(btn => {
                if (btn.textContent.includes(getCategoryLabel(filter)) || (filter==='all' && btn.textContent==='전체')) {
                    btn.classList.add('bg-blue-50', 'text-blue-600', 'active-tab');
                    btn.classList.remove('text-gray-500');
                    btn.classList.remove('bg-blue-50'); // remove old if needed, but handled by add
                } else {
                    btn.classList.remove('bg-blue-50', 'text-blue-600', 'active-tab');
                    btn.classList.add('text-gray-500');
                }
            });
            filterAndRender();
        }

        function getCategoryLabel(key) {
             const map = { all: '전체', academic: '학사', attendance: '출결', career: '취업', complaint: '고충' };
             return map[key] || key;
        }

        function filterAndRender() {
            let filtered = counselingData;
            if (currentFilter !== 'all') {
                filtered = counselingData.filter(c => c.category === currentFilter);
            }
            renderLogs(filtered);
        }

        function renderLogs(data) {
            const container = document.getElementById('counselingList');
            if (data.length === 0) {
                 container.innerHTML = \`
                    <div class="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
                        <i class="fas fa-folder-open text-gray-200 text-4xl mb-4"></i>
                        <p class="text-gray-400 font-medium">등록된 상담 일지가 없습니다.</p>
                    </div>\`;
                 return;
            }

            // Group by Date
            const grouped = {};
            data.forEach(log => {
                const d = log.counseling_date.split('T')[0];
                if(!grouped[d]) grouped[d] = [];
                grouped[d].push(log);
            });
            
            const sortedDates = Object.keys(grouped).sort((a,b) => b.localeCompare(a));
            
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
                    <div class="relative pl-8 timeline-item animate-fade-in">
                        <div class="timeline-line"></div>
                        <div class="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-indigo-50 rounded-xl flex items-center justify-center z-10 shadow-sm">
                            <i class="far fa-calendar-alt text-indigo-300 text-xs"></i>
                        </div>
                        <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">\${displayDate}</h4>
                        <div class="space-y-4 pb-10">
                            \${grouped[date].map(log => {
                                const info = categoryInfo[log.category] || categoryInfo.other;
                                return \`
                                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden group">
                                        <div class="p-6">
                                            <div class="flex items-start justify-between mb-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold">
                                                        \${log.student_name ? log.student_name[0] : 'S'}
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center gap-2">
                                                            <span class="font-bold text-gray-900">\${log.student_name}</span>
                                                            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase \${info.color}">\${info.label}</span>
                                                        </div>
                                                        <div class="text-[11px] text-gray-400 mt-0.5">\${methodLabels[log.method] || '기타'}</div>
                                                    </div>
                                                </div>
                                                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <button onclick="editLog(\${log.id})" class="p-2 text-gray-400 hover:text-blue-600 transition"><i class="fas fa-edit"></i></button>
                                                     <button onclick="deleteLog(\${log.id})" class="p-2 text-gray-400 hover:text-red-600 transition"><i class="fas fa-trash-alt"></i></button>
                                                </div>
                                            </div>
                                            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl mb-3">\${log.content}</p>
                                            
                                            \${log.result ? \`
                                            <div class="flex items-start gap-2 text-xs text-blue-800 bg-blue-50/50 p-3 rounded-lg">
                                                <i class="fas fa-check-circle mt-0.5 text-blue-500"></i>
                                                <span class="font-medium">\${log.result}</span>
                                            </div>\` : ''}
                                        </div>
                                        <div class="px-6 py-3 bg-gray-50/50 border-t border-gray-50 text-[10px] text-gray-400 flex justify-between">
                                            <span>작성자: \${log.counselor_name || '관리자'}</span>
                                        </div>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                 \`;
            }).join('');
        }

        function updateStats(data) {
            const today = new Date().toISOString().split('T')[0];
            const count = data.filter(d => d.counseling_date.split('T')[0] === today).length;
            document.getElementById('todayCount').textContent = count;
        }

        function openModal() {
            document.getElementById('counselingForm').reset();
            document.getElementById('logId').value = '';
            document.getElementById('modalTitle').textContent = '상담 일지 작성';
            document.getElementById('counselingDate').valueAsDate = new Date();
            document.getElementById('counselingModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('counselingModal').classList.add('hidden');
        }

        function editLog(id) {
            const log = counselingData.find(d => d.id === id);
            if(!log) return;
            document.getElementById('logId').value = log.id;
            document.getElementById('modalTitle').textContent = '상담 일지 수정';
            document.getElementById('studentSelect').value = log.student_id;
            document.getElementById('categorySelect').value = log.category;
            document.getElementById('methodSelect').value = log.method;
            document.getElementById('content').value = log.content;
            document.getElementById('result').value = log.result || '';
            document.getElementById('counselingDate').value = log.counseling_date.split('T')[0];
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
                course_id: courseId,
                category: document.getElementById('categorySelect').value,
                method: document.getElementById('methodSelect').value,
                content: document.getElementById('content').value,
                result: document.getElementById('result').value,
                counseling_date: document.getElementById('counselingDate').value,
                counselor_id: user.id
            };

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                if(res.ok) {
                    closeModal();
                    loadCounselingLogs();
                } else {
                    alert('저장 실패');
                }
            } catch(err) {
                console.error(err);
                alert('오류 발생');
            }
        }

        async function deleteLog(id) {
            if(!confirm('삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`/api/hrd/counseling/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if(res.ok) loadCounselingLogs();
            } catch(e) { console.error(e); }
        }
    </script>
</body>
</html>
`;
