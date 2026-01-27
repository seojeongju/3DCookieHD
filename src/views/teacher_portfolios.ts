import { teacherSidebar } from './components/teacher_sidebar';

export const teacherPortfoliosHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 관리 - 강사 대시보드</title>
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
        ${teacherSidebar('portfolios')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">포트폴리오 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">배정된 과정의 학생 포트폴리오를 관리합니다.</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                        <a href="/teacher" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-arrow-left mr-1"></i> 대시보드로
                        </a>
                    </div>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-8">
                <!-- 과정 목록 섹션 -->
                <div id="coursesSection" class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chalkboard-teacher text-blue-500 mr-2"></i> 배정된 과정 목록
                    </h2>
                    <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="mt-4 text-gray-500">과정 목록을 불러오는 중...</p>
                        </div>
                    </div>
                </div>

                <!-- 포트폴리오 관리 섹션 (과정 선택 시 표시) -->
                <div id="portfoliosSection" class="hidden">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <button onclick="backToCourses()" class="px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> 과정 목록으로
                            </button>
                            <h2 class="text-lg font-bold text-gray-800" id="selectedCourseTitle">
                                <i class="fas fa-briefcase text-blue-500 mr-2"></i> 포트폴리오 관리
                            </h2>
                        </div>
                        <button onclick="openAddPortfolioModal()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center shadow-sm">
                            <i class="fas fa-plus mr-2"></i> 포트폴리오 추가
                        </button>
                    </div>

                    <!-- 필터 -->
                    <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
                        <select id="categoryFilter" onchange="loadPortfolios()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">전체 카테고리</option>
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                        <select id="featuredFilter" onchange="loadPortfolios()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">전체</option>
                            <option value="true">우수작품만</option>
                        </select>
                        <input type="text" id="searchInput" placeholder="포트폴리오 검색..." 
                               class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                               onkeyup="if(event.key==='Enter') loadPortfolios()">
                        <button onclick="loadPortfolios()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                            <i class="fas fa-search mr-2"></i> 검색
                        </button>
                    </div>

                    <!-- 포트폴리오 그리드 -->
                    <div id="portfoliosContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="mt-4 text-gray-500">포트폴리오를 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 포트폴리오 추가/수정 모달 -->
    <div id="portfolioModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-black text-white" id="modalTitle">포트폴리오 추가</h3>
                        <p class="text-xs text-white/80 font-medium mt-1">학생 포트폴리오를 등록하거나 수정합니다</p>
                    </div>
                    <button onclick="closePortfolioModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <form id="portfolioForm" onsubmit="handleSavePortfolio(event)" class="flex-1 overflow-y-auto p-8">
                <input type="hidden" id="portfolioId">
                <input type="hidden" id="portfolioStudentId">
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">학생 선택 <span class="text-red-500">*</span></label>
                        <select id="portfolioStudentSelect" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">학생을 선택하세요</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">제목 <span class="text-red-500">*</span></label>
                        <input type="text" id="portfolioTitle" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                        <select id="portfolioCategory" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">설명</label>
                        <textarea id="portfolioDescription" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">썸네일 이미지</label>
                        <div class="flex gap-2">
                            <input type="text" id="portfolioThumbnail" placeholder="이미지 URL" class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <input type="file" id="thumbnailFile" accept="image/*" class="hidden" onchange="handleThumbnailUpload(this)">
                            <button type="button" onclick="document.getElementById('thumbnailFile').click()" class="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
                                <i class="fas fa-upload mr-2"></i> 업로드
                            </button>
                        </div>
                        <div id="thumbnailPreview" class="mt-2 hidden">
                            <img src="" class="max-h-40 rounded-lg border border-gray-200">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">포트폴리오 링크</label>
                        <input type="url" id="portfolioContentUrl" placeholder="https://..." class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">강사 조언/피드백</label>
                        <textarea id="portfolioTeacherFeedback" rows="4" placeholder="포트폴리오에 대한 조언이나 피드백을 입력하세요..." class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
                    </div>
                </div>

                <div class="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button type="button" onclick="closePortfolioModal()" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                        취소
                    </button>
                    <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                        <i class="fas fa-save mr-2"></i> 저장하기
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 포트폴리오 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/80 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div class="relative">
                <img id="modalThumbnail" src="" class="w-full h-80 object-cover rounded-t-3xl">
                <button onclick="closeDetailModal()" class="absolute top-6 right-6 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition backdrop-blur-md">
                    <i class="fas fa-times"></i>
                </button>
                <div class="absolute bottom-6 left-8">
                    <span id="modalCategory" class="px-3 py-1 bg-white/90 text-blue-600 text-[10px] font-black rounded-full shadow-sm uppercase tracking-widest mb-2 inline-block">CATEGORY</span>
                    <h3 id="modalTitle" class="text-3xl font-black text-white drop-shadow-lg">제목</h3>
                </div>
            </div>
            <div class="p-10">
                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-1">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Project Description</label>
                        <p id="modalDescription" class="text-gray-600 leading-relaxed text-lg font-medium"></p>
                        <div id="modalTeacherFeedback" class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <label class="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">강사 조언</label>
                            <p id="modalFeedbackText" class="text-sm text-gray-700"></p>
                        </div>
                    </div>
                    <div class="w-full md:w-64 space-y-6">
                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Metadata</label>
                            <div class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs"><i class="fas fa-user-graduate"></i></div>
                                    <div class="text-sm font-bold text-gray-700" id="modalStudent">학생명</div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs"><i class="fas fa-graduation-cap"></i></div>
                                    <div class="text-sm font-bold text-gray-500" id="modalCourse">교육과정명</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-3">
                            <a id="modalContentLink" href="#" target="_blank" class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition text-center shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                <i class="fas fa-external-link-alt"></i> 작품 상세보기
                            </a>
                            <button onclick="openEditPortfolioModal()" class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition flex items-center justify-center gap-2">
                                <i class="fas fa-edit"></i> 수정하기
                            </button>
                            <button id="modalFeaturedBtn" onclick="toggleFeatured()" class="w-full py-3 border-2 border-yellow-200 text-yellow-600 font-bold rounded-2xl hover:bg-yellow-50 transition flex items-center justify-center gap-2">
                                <i class="fas fa-star"></i> 추천 설정/해제
                            </button>
                            <button onclick="deletePortfolio()" class="w-full py-3 border-2 border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition flex items-center justify-center gap-2">
                                <i class="fas fa-trash"></i> 삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let allCourses = [];
        let selectedCourseId = null;
        let selectedCourseTitle = '';
        let allPortfolios = [];
        let currentPortfolio = null;
        let courseStudents = [];

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadCourses();
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
        }

        async function loadCourses() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    allCourses = result.data || [];
                    renderCourses();
                } else {
                    console.error('Failed to load courses:', result.error);
                    document.getElementById('coursesContainer').innerHTML = 
                        '<div class="col-span-full text-center py-12 text-red-500">과정 목록을 불러오는데 실패했습니다.</div>';
                }
            } catch (error) {
                console.error('Error loading courses:', error);
                document.getElementById('coursesContainer').innerHTML = 
                    '<div class="col-span-full text-center py-12 text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function renderCourses() {
            const container = document.getElementById('coursesContainer');
            
            if (allCourses.length === 0) {
                container.innerHTML = \`
                    <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-chalkboard text-5xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">배정된 과정이 없습니다</h3>
                        <p class="text-gray-500 mb-4">관리자(원장)에게 과정 배정을 요청하세요.</p>
                        <a href="/teacher" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-arrow-left mr-2"></i> 대시보드로 돌아가기
                        </a>
                    </div>
                \`;
                return;
            }

            container.innerHTML = allCourses.map(course => {
                let statusBadge = '';
                let statusColor = '';
                switch(course.status) {
                    case 'active':
                        statusBadge = '진행중';
                        statusColor = 'bg-green-100 text-green-800';
                        break;
                    case 'upcoming':
                        statusBadge = '예정';
                        statusColor = 'bg-blue-100 text-blue-800';
                        break;
                    case 'completed':
                        statusBadge = '완료';
                        statusColor = 'bg-gray-100 text-gray-800';
                        break;
                    case 'cancelled':
                        statusBadge = '취소';
                        statusColor = 'bg-red-100 text-red-800';
                        break;
                    default:
                        statusBadge = course.status || '미정';
                        statusColor = 'bg-gray-100 text-gray-800';
                }

                return \`
                    <div onclick="selectCourse(\${course.id}, '\${(course.title || '').replace(/'/g, "\\\\'")}')" 
                         class="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">\${course.title || '과정명 없음'}</h3>
                                <p class="text-sm text-gray-600 line-clamp-2 mb-3">\${course.description || '설명 없음'}</p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-bold \${statusColor} ml-2 flex-shrink-0">\${statusBadge}</span>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            \${course.campus_name ? \`
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt w-5 text-gray-400"></i>
                                    <span>\${course.campus_name}</span>
                                </div>
                            \` : ''}
                            <div class="flex items-center">
                                <i class="fas fa-user-graduate w-5 text-gray-400"></i>
                                <span>수강생: \${course.current_students || 0}명</span>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                <i class="fas fa-briefcase mr-2"></i> 포트폴리오 관리
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        async function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            selectedCourseTitle = courseTitle;
            
            // UI 전환
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('portfoliosSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').innerHTML = \`
                <i class="fas fa-briefcase text-blue-500 mr-2"></i> \${courseTitle} - 포트폴리오 관리
            \`;
            
            // 수강생 목록 로드
            await loadCourseStudents();
            // 포트폴리오 목록 로드
            await loadPortfolios();
        }

        async function loadCourseStudents() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/enrollments?course_id=\${selectedCourseId}&status=approved&limit=100\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    courseStudents = result.data || [];
                    // 학생 선택 드롭다운 업데이트
                    const select = document.getElementById('portfolioStudentSelect');
                    select.innerHTML = '<option value="">학생을 선택하세요</option>' + 
                        courseStudents.map(s => \`
                            <option value="\${s.user_id}">\${s.user_name || '이름 없음'}</option>
                        \`).join('');
                }
            } catch (error) {
                console.error('Error loading students:', error);
            }
        }

        function backToCourses() {
            selectedCourseId = null;
            selectedCourseTitle = '';
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('portfoliosSection').classList.add('hidden');
        }

        async function loadPortfolios() {
            try {
                const token = localStorage.getItem('token');
                const category = document.getElementById('categoryFilter').value;
                const featured = document.getElementById('featuredFilter').value;
                const search = document.getElementById('searchInput').value;

                let url = \`/api/portfolios?courseId=\${selectedCourseId}\`;
                if (category) url += \`&category=\${encodeURIComponent(category)}\`;
                if (featured) url += \`&isFeatured=\${featured}\`;

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    allPortfolios = result.data || [];
                    
                    // 검색 필터링
                    if (search) {
                        const searchLower = search.toLowerCase();
                        allPortfolios = allPortfolios.filter(p => 
                            (p.title && p.title.toLowerCase().includes(searchLower)) ||
                            (p.description && p.description.toLowerCase().includes(searchLower)) ||
                            (p.student_name && p.student_name.toLowerCase().includes(searchLower))
                        );
                    }
                    
                    renderPortfolios();
                } else {
                    console.error('Failed to load portfolios:', result.error);
                    document.getElementById('portfoliosContainer').innerHTML = 
                        '<div class="col-span-full text-center py-12 text-red-500">포트폴리오를 불러오는데 실패했습니다.</div>';
                }
            } catch (error) {
                console.error('Error loading portfolios:', error);
                document.getElementById('portfoliosContainer').innerHTML = 
                    '<div class="col-span-full text-center py-12 text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function renderPortfolios() {
            const container = document.getElementById('portfoliosContainer');
            
            if (allPortfolios.length === 0) {
                container.innerHTML = \`
                    <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">포트폴리오가 없습니다</h3>
                        <p class="text-gray-500 mb-4">학생 포트폴리오를 추가해보세요.</p>
                        <button onclick="openAddPortfolioModal()" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-plus mr-2"></i> 포트폴리오 추가
                        </button>
                    </div>
                \`;
                return;
            }

            container.innerHTML = allPortfolios.map(p => \`
                <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 cursor-pointer flex flex-col h-full" onclick="openDetailModal(\${p.id})">
                    <div class="relative overflow-hidden h-52">
                        <img src="\${p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" 
                             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span class="text-white text-sm font-black flex items-center gap-2">
                                <i class="fas fa-eye"></i> 상세보기
                            </span>
                        </div>
                        \${p.is_featured ? '<div class="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5"><i class="fas fa-star"></i> 우수작품</div>' : ''}
                        <div class="absolute top-4 right-4 px-2 py-1 bg-white/90 text-[9px] font-black rounded-lg shadow-sm text-gray-600 uppercase tracking-tighter">\${p.category || 'other'}</div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <h4 class="font-black text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">\${p.title || '제목 없음'}</h4>
                        <p class="text-[10px] text-blue-600 font-black mb-3 uppercase tracking-wider">\${p.course_title || '과정 정보 없음'}</p>
                        <p class="text-gray-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">\${p.description || '설명이 없습니다.'}</p>
                        <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">\${(p.student_name || '학생')[0]}</div>
                                <span class="text-xs font-black text-gray-500">\${p.student_name || '학생'}</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="event.stopPropagation(); openEditPortfolioModalById(\${p.id})" class="text-gray-400 hover:text-blue-600 transition-colors" title="수정">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <button onclick="event.stopPropagation(); deletePortfolioById(\${p.id})" class="text-gray-400 hover:text-red-600 transition-colors" title="삭제">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function openAddPortfolioModal() {
            document.getElementById('modalTitle').textContent = '포트폴리오 추가';
            document.getElementById('portfolioForm').reset();
            document.getElementById('portfolioId').value = '';
            document.getElementById('portfolioStudentId').value = '';
            document.getElementById('thumbnailPreview').classList.add('hidden');
            document.getElementById('portfolioModal').classList.remove('hidden');
        }

        function openEditPortfolioModal() {
            if (!currentPortfolio) return;
            openEditPortfolioModalById(currentPortfolio.id);
        }

        async function openEditPortfolioModalById(portfolioId) {
            try {
                const portfolio = allPortfolios.find(p => p.id === portfolioId);
                if (!portfolio) {
                    alert('포트폴리오를 찾을 수 없습니다.');
                    return;
                }

                currentPortfolio = portfolio;
                document.getElementById('modalTitle').textContent = '포트폴리오 수정';
                document.getElementById('portfolioId').value = portfolio.id;
                document.getElementById('portfolioStudentId').value = portfolio.student_id;
                document.getElementById('portfolioStudentSelect').value = portfolio.student_id;
                document.getElementById('portfolioTitle').value = portfolio.title || '';
                document.getElementById('portfolioCategory').value = portfolio.category || 'other';
                document.getElementById('portfolioDescription').value = portfolio.description || '';
                document.getElementById('portfolioThumbnail').value = portfolio.thumbnail_url || '';
                document.getElementById('portfolioContentUrl').value = portfolio.content_url || '';
                document.getElementById('portfolioTeacherFeedback').value = portfolio.teacher_feedback || '';
                
                if (portfolio.thumbnail_url) {
                    const preview = document.getElementById('thumbnailPreview');
                    preview.querySelector('img').src = portfolio.thumbnail_url;
                    preview.classList.remove('hidden');
                } else {
                    document.getElementById('thumbnailPreview').classList.add('hidden');
                }

                document.getElementById('portfolioModal').classList.remove('hidden');
            } catch (error) {
                console.error('Error opening edit modal:', error);
                alert('포트폴리오 정보를 불러오는데 실패했습니다.');
            }
        }

        function closePortfolioModal() {
            document.getElementById('portfolioModal').classList.add('hidden');
            currentPortfolio = null;
        }

        async function handleThumbnailUpload(input) {
            if (!input.files || !input.files[0]) return;
            
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'images');
            formData.append('folder', 'portfolios');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                
                const result = await response.json();
                if (result.success) {
                    const imageUrl = result.data.url;
                    document.getElementById('portfolioThumbnail').value = imageUrl;
                    const preview = document.getElementById('thumbnailPreview');
                    preview.querySelector('img').src = imageUrl;
                    preview.classList.remove('hidden');
                } else {
                    alert('이미지 업로드 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Image upload error:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        }

        async function handleSavePortfolio(event) {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const form = event.target;
                const portfolioId = document.getElementById('portfolioId').value;
                const studentId = document.getElementById('portfolioStudentSelect').value;
                
                const data = {
                    title: form.portfolioTitle.value,
                    description: form.portfolioDescription.value || null,
                    thumbnail_url: form.portfolioThumbnail.value || null,
                    content_url: form.portfolioContentUrl.value || null,
                    category: form.portfolioCategory.value,
                    course_id: selectedCourseId,
                    student_id: studentId,
                    teacher_feedback: form.portfolioTeacherFeedback.value || null
                };

                let url = '/api/portfolios';
                let method = 'POST';
                
                if (portfolioId) {
                    url = \`/api/portfolios/\${portfolioId}\`;
                    method = 'PUT';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert(portfolioId ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 등록되었습니다.');
                    closePortfolioModal();
                    await loadPortfolios();
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('저장 중 오류가 발생했습니다: ' + (error.message || error));
            }
        }

        function openDetailModal(portfolioId) {
            const portfolio = allPortfolios.find(p => p.id === portfolioId);
            if (!portfolio) return;

            currentPortfolio = portfolio;
            document.getElementById('modalThumbnail').src = portfolio.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800';
            document.getElementById('modalCategory').textContent = portfolio.category || 'other';
            document.getElementById('modalTitle').textContent = portfolio.title || '제목 없음';
            document.getElementById('modalDescription').textContent = portfolio.description || '설명이 공개되지 않았습니다.';
            document.getElementById('modalStudent').textContent = portfolio.student_name || '학생명 없음';
            document.getElementById('modalCourse').textContent = portfolio.course_title || '소속 과정 정보 없음';
            document.getElementById('modalContentLink').href = portfolio.content_url || '#';
            
            // 강사 조언 표시
            const feedbackDiv = document.getElementById('modalTeacherFeedback');
            const feedbackText = document.getElementById('modalFeedbackText');
            if (portfolio.teacher_feedback) {
                feedbackText.textContent = portfolio.teacher_feedback;
                feedbackDiv.classList.remove('hidden');
            } else {
                feedbackText.textContent = '아직 조언이 없습니다.';
                feedbackDiv.classList.remove('hidden');
            }
            
            const featureBtn = document.getElementById('modalFeaturedBtn');
            featureBtn.innerHTML = portfolio.is_featured 
                ? '<i class="fas fa-star"></i> 추천 해제' 
                : '<i class="far fa-star"></i> 우수작품 추천';

            document.getElementById('detailModal').classList.remove('hidden');
        }

        function closeDetailModal() {
            document.getElementById('detailModal').classList.add('hidden');
            currentPortfolio = null;
        }

        async function toggleFeatured() {
            if (!currentPortfolio) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/portfolios/\${currentPortfolio.id}/featured\`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ isFeatured: !currentPortfolio.is_featured })
                });

                const result = await response.json();
                if (result.success) {
                    currentPortfolio.is_featured = !currentPortfolio.is_featured;
                    closeDetailModal();
                    await loadPortfolios();
                } else {
                    alert('추천 설정 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Toggle featured error:', error);
                alert('추천 설정 중 오류가 발생했습니다.');
            }
        }

        async function deletePortfolio() {
            if (!currentPortfolio) return;
            await deletePortfolioById(currentPortfolio.id);
        }

        async function deletePortfolioById(portfolioId) {
            if (!confirm('정말 삭제하시겠습니까?')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/portfolios/\${portfolioId}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                const result = await response.json();
                if (result.success) {
                    alert('포트폴리오가 삭제되었습니다.');
                    closeDetailModal();
                    await loadPortfolios();
                } else {
                    alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    </script>
    <style>
        .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</body>
</html>
`;
