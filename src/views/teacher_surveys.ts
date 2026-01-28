import { teacherSidebar } from './components/teacher_sidebar';

export const teacherSurveysHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설문/평가 관리 - 강사 모드</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
        <!-- 사이드바 -->
        ${teacherSidebar('surveys')}

        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">설문 및 역량평가 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">배정된 과정의 설문 및 역량평가를 생성하고 관리합니다.</p>
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
                    <div id="coursesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="mt-4 text-gray-500">과정 목록을 불러오는 중...</p>
                        </div>
                    </div>
                </div>

                <!-- 설문 목록 섹션 -->
                <div id="surveysSection" class="hidden">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <button onclick="backToCourses()" class="px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> 과정 목록으로
                            </button>
                            <h2 class="text-lg font-bold text-gray-800" id="selectedCourseTitle">
                                <i class="fas fa-poll text-blue-500 mr-2"></i> 설문 및 역량평가
                            </h2>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="openCreateModal('diagnosis')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm text-sm">
                                <i class="fas fa-chart-radar mr-2"></i> 역량 진단 생성
                            </button>
                            <button onclick="openCreateModal('survey')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm text-sm">
                                <i class="fas fa-poll mr-2"></i> 일반 설문 생성
                            </button>
                        </div>
                    </div>

                    <!-- 통계 요약 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-gray-700 text-sm">평가 진행률</h3>
                                <span class="p-2 bg-blue-100 text-blue-600 rounded-lg"><i class="fas fa-percent"></i></span>
                            </div>
                            <div class="text-3xl font-black text-gray-800 mb-1" id="stat-progress">0%</div>
                            <p class="text-xs text-gray-500">담당 과정 평균 참여율</p>
                            <div class="w-full bg-gray-100 rounded-full h-2 mt-4">
                                <div class="bg-blue-500 h-2 rounded-full" style="width: 0%" id="stat-progress-bar"></div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-gray-700 text-sm">평균 만족도</h3>
                                <span class="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><i class="fas fa-star"></i></span>
                            </div>
                            <div class="text-3xl font-black text-gray-800 mb-1" id="stat-satisfaction">0.0</div>
                            <p class="text-xs text-gray-500">5.0 만점 기준</p>
                            <div class="flex text-yellow-400 text-sm mt-3" id="stat-stars"></div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-gray-700 text-sm">진행중인 평가</h3>
                                <span class="p-2 bg-green-100 text-green-600 rounded-lg"><i class="fas fa-clock"></i></span>
                            </div>
                            <div class="text-3xl font-black text-gray-800 mb-1" id="stat-active">0</div>
                            <p class="text-xs text-gray-500">현재 참여 가능한 설문/평가</p>
                        </div>
                    </div>

                    <!-- 필터 및 설문 목록 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800 text-sm">등록된 평가 및 설문 목록</h3>
                            <select id="typeFilter" class="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5" onchange="filterSurveys()">
                                <option value="all">전체 유형</option>
                                <option value="diagnosis">역량 진단</option>
                                <option value="survey">일반 설문</option>
                            </select>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명/구분</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">참여현황</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="surveyList" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 생성 모달 -->
    <div id="createModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">새 평가 생성</h3>
                <button onclick="closeModal('createModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="createForm" onsubmit="handleSave(event)" class="p-6 space-y-4">
                <input type="hidden" id="surveyType">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">대상 과정</label>
                    <select id="targetCourseId" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">과정을 선택하세요</option>
                    </select>
                </div>
                <script>
                    // 과정 목록을 모달에 로드
                    (async () => {
                        try {
                            const token = localStorage.getItem('token');
                            const response = await fetch('/api/courses?limit=100', {
                                headers: { 'Authorization': 'Bearer ' + token }
                            });
                            const result = await response.json();
                            const courses = result.success ? result.data : (result.data || []);
                            const select = document.getElementById('targetCourseId');
                            if (select) {
                                courses.forEach(c => {
                                    const option = document.createElement('option');
                                    option.value = c.id;
                                    option.textContent = c.title;
                                    select.appendChild(option);
                                });
                            }
                        } catch (e) { console.error(e); }
                    })();
                </script>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">제목</label>
                    <input type="text" id="surveyTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="예: 1개월차 훈련과정 만족도 조사">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="surveyDesc" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">시작일</label>
                        <input type="date" id="startDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">종료일</label>
                        <input type="date" id="endDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="border-t pt-4 mt-6">
                    <div class="flex justify-between items-center mb-4">
                        <label class="block text-sm font-bold text-gray-700">문항 구성</label>
                        <button type="button" onclick="addQuestion()" class="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"><i class="fas fa-plus mr-1"></i> 문항 추가</button>
                    </div>
                    <div id="questionContainer" class="space-y-4"></div>
                </div>

                <div class="pt-6 flex justify-end gap-3">
                    <button type="button" onclick="closeModal('createModal')" class="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                    <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 결과 분석 모달 -->
    <div id="resultModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 class="text-xl font-bold text-gray-800">결과 분석</h3>
                <button onclick="closeModal('resultModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div id="chartContainer">
                        <h4 class="font-bold text-gray-700 mb-4 text-center">종합 역량 방사형 차트</h4>
                        <div class="relative h-64 w-full">
                            <canvas id="competencyChart"></canvas>
                        </div>
                    </div>
                    <div>
                         <h4 class="font-bold text-gray-700 mb-4">영역별 점수 상세</h4>
                         <div class="space-y-4" id="scoreDetails"></div>
                    </div>
                </div>
                
                <div class="border-t pt-6">
                     <h4 class="font-bold text-gray-700 mb-4">참여자 코멘트</h4>
                     <div class="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto text-sm text-gray-600 space-y-2" id="commentsList"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 템플릿: 문항 아이템 -->
    <template id="questionTemplate">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group question-item">
            <button type="button" onclick="removeQuestion(this)" class="absolute top-2 right-2 text-gray-300 hover:text-red-500"><i class="fas fa-trash"></i></button>
            <div class="grid grid-cols-1 gap-2">
                <input type="text" name="q_text" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 text-sm font-bold" placeholder="문항 내용을 입력하세요">
                <select name="q_type" class="w-32 px-2 py-1 border rounded text-xs text-gray-600" onchange="toggleOptions(this)">
                    <option value="rating">5점 척도</option>
                    <option value="choice">객관식</option>
                    <option value="text">서술형</option>
                </select>
                <div class="hidden options-area mt-2 space-y-1">
                    <input type="text" class="w-full px-2 py-1 border rounded text-xs" placeholder="옵션 1 (콤마로 구분하여 입력)">
                </div>
            </div>
        </div>
    </template>

    <script>
        let competencyChart = null;
        let selectedCourseId = null;
        let selectedCourseTitle = '';
        let allSurveys = [];
        
        document.addEventListener('DOMContentLoaded', async () => {
             checkLogin();
             await loadCourses();
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
            const nameEl = document.getElementById('teacherName');
            if (nameEl) nameEl.textContent = user.name || '강사님';
        }

        async function loadCourses() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const courses = result.success ? result.data : (result.data || []);
                const grid = document.getElementById('coursesGrid');
                
                if (courses.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">배정된 과정이 없습니다.</div>';
                    return;
                }

                if (courses.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">배정된 과정이 없습니다.</div>';
                    return;
                }

                grid.innerHTML = courses.map(course => \`
                    <div onclick="selectCourse(\${course.id}, '\${course.title.replace(/'/g, "\\'")}')" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition hover:border-blue-300">
                        <div class="flex items-start justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-800">\${course.title}</h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded">\${course.category || '일반'}</span>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex items-center">
                                <i class="fas fa-users w-5 text-gray-400"></i>
                                <span>수강생: \${course.current_students || 0}명</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar w-5 text-gray-400"></i>
                                <span>\${course.start_date ? new Date(course.start_date).toLocaleDateString() : '-'} ~ \${course.end_date ? new Date(course.end_date).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <button onclick="event.stopPropagation(); selectCourse(\${course.id}, '\${course.title.replace(/'/g, "\\'")}')" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                설문 관리하기
                            </button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Error loading courses:', error);
                const grid = document.getElementById('coursesGrid');
                if (grid) {
                    grid.innerHTML = '<div class="col-span-full text-center py-12 text-red-500">과정 목록을 불러오는데 실패했습니다.</div>';
                }
            }
        }

        function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            selectedCourseTitle = courseTitle;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('surveysSection').classList.remove('hidden');
            const titleEl = document.getElementById('selectedCourseTitle');
            if (titleEl) {
                titleEl.innerHTML = \`<i class="fas fa-poll text-blue-500 mr-2"></i> \${courseTitle} - 설문 및 역량평가\`;
            }
            loadSurveys();
            updateStats();
        }

        function backToCourses() {
            selectedCourseId = null;
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('surveysSection').classList.add('hidden');
        }

        async function loadSurveys() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/surveys/teacher', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                allSurveys = result.success ? result.data : (result.data || []);
                const filtered = selectedCourseId 
                    ? allSurveys.filter(s => s.course_id === selectedCourseId)
                    : allSurveys;
                
                const container = document.getElementById('surveyList');
                const typeFilter = document.getElementById('typeFilter')?.value || 'all';
                const finalFiltered = typeFilter !== 'all' 
                    ? filtered.filter(s => s.type === typeFilter)
                    : filtered;

                if (finalFiltered.length === 0) {
                    container.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">등록된 설문이 없습니다.</td></tr>';
                    return;
                }

                container.innerHTML = finalFiltered.map(s => {
                    const typeLabel = s.type === 'diagnosis' 
                        ? '<span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">역량진단</span>'
                        : '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">일반설문</span>';
                    
                    const statusLabel = s.status === 'active'
                        ? '<span class="text-green-600 font-bold text-xs"><i class="fas fa-circle text-[8px] mr-1"></i>진행중</span>'
                        : s.status === 'closed'
                        ? '<span class="text-gray-400 font-bold text-xs">마감됨</span>'
                        : '<span class="text-yellow-600 font-bold text-xs">임시저장</span>';
                    
                    const rate = s.total_target > 0 ? Math.round((s.response_count / s.total_target) * 100) : 0;

                    return \`
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4">
                                <div class="text-xs font-bold text-gray-500 mb-1">\${s.course_title || '-'}</div>
                                \${typeLabel}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-800">\${s.title}</td>
                            <td class="px-6 py-4 text-xs text-gray-500">\${s.start_date || '-'} ~ \${s.end_date || '-'}</td>
                            <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <span class="text-sm font-bold text-gray-700">\${s.response_count}/\${s.total_target}</span>
                                    <span class="text-xs text-gray-400">(\${rate}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-1.5 mt-1 max-w-[100px] mx-auto">
                                    <div class="bg-blue-500 h-1.5 rounded-full" style="width: \${rate}%"></div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">\${statusLabel}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button onclick="viewResults(\${s.id}, '\${s.type}')" class="text-blue-600 hover:text-blue-900 text-xs font-bold">결과분석</button>
                                <button onclick="editSurvey(\${s.id})" class="text-green-600 hover:text-green-900 text-xs">수정</button>
                                \${s.status === 'active' ? '<button onclick="closeSurvey(\${s.id})" class="text-red-500 hover:text-red-700 text-xs">마감</button>' : ''}
                                <button onclick="deleteSurvey(\${s.id})" class="text-red-600 hover:text-red-900 text-xs">삭제</button>
                            </td>
                        </tr>
                    \`;
                }).join('');
            } catch (error) {
                console.error('Error loading surveys:', error);
                document.getElementById('surveyList').innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-red-500">설문 목록을 불러오는데 실패했습니다.</td></tr>';
            }
        }

        window.filterSurveys = loadSurveys;
        const typeFilterEl = document.getElementById('typeFilter');
        if (typeFilterEl) {
            typeFilterEl.addEventListener('change', loadSurveys);
        }

        function updateStats() {
            const filtered = selectedCourseId 
                ? allSurveys.filter(s => s.course_id === selectedCourseId)
                : allSurveys;
            const active = filtered.filter(s => s.status === 'active').length;
            const totalResponses = filtered.reduce((sum, s) => sum + (s.response_count || 0), 0);
            const totalTarget = filtered.reduce((sum, s) => sum + (s.total_target || 0), 0);
            const progress = totalTarget > 0 ? Math.round((totalResponses / totalTarget) * 100) : 0;
            
            document.getElementById('stat-active').textContent = active;
            document.getElementById('stat-progress').textContent = progress + '%';
            document.getElementById('stat-progress-bar').style.width = progress + '%';
            
            // 평균 만족도는 rating 타입 설문의 평균 점수로 계산 (실제로는 API에서 계산 필요)
            document.getElementById('stat-satisfaction').textContent = '0.0';
            document.getElementById('stat-stars').innerHTML = '';
        }

        let currentSurveyId = null;

        /* Modal & Form Functions */
        window.openCreateModal = (type) => {
            currentSurveyId = null;
            document.getElementById('createForm').reset();
            document.getElementById('questionContainer').innerHTML = '';
            document.getElementById('surveyType').value = type;
            document.getElementById('modalTitle').textContent = type === 'diagnosis' ? '역량 진단 생성' : '새 설문 생성';
            const courseSelect = document.getElementById('targetCourseId');
            if (courseSelect) {
                courseSelect.value = selectedCourseId || '';
            }
            addQuestion();
            document.getElementById('createModal').classList.remove('hidden');
        };

        async function editSurvey(id) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/surveys/\${id}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('설문 정보를 불러오는데 실패했습니다.');
                    return;
                }
                
                const survey = result.data;
                currentSurveyId = id;
                document.getElementById('surveyType').value = survey.type;
                document.getElementById('modalTitle').textContent = '설문 수정';
                document.getElementById('targetCourseId').value = survey.course_id || '';
                document.getElementById('surveyTitle').value = survey.title || '';
                document.getElementById('surveyDesc').value = survey.description || '';
                document.getElementById('startDate').value = survey.start_date || '';
                document.getElementById('endDate').value = survey.end_date || '';
                
                const container = document.getElementById('questionContainer');
                container.innerHTML = '';
                
                if (survey.questions && survey.questions.length > 0) {
                    survey.questions.forEach((q, idx) => {
                        const tpl = document.getElementById('questionTemplate').content.cloneNode(true);
                        const qText = tpl.querySelector('[name="q_text"]');
                        const qType = tpl.querySelector('[name="q_type"]');
                        const optionsArea = tpl.querySelector('.options-area');
                        const optionsInput = optionsArea.querySelector('input');
                        
                        qText.value = q.question_text || '';
                        qType.value = q.question_type || 'rating';
                        
                        if (q.question_type === 'choice' && q.options && Array.isArray(q.options)) {
                            optionsInput.value = q.options.join(',');
                            optionsArea.classList.remove('hidden');
                        }
                        
                        container.appendChild(tpl);
                    });
                } else {
                    addQuestion();
                }
                
                document.getElementById('createModal').classList.remove('hidden');
            } catch (error) {
                console.error('Error loading survey:', error);
                alert('설문 정보를 불러오는데 실패했습니다.');
            }
        }

        window.closeModal = (id) => document.getElementById(id).classList.add('hidden');

        window.addQuestion = () => {
            const tpl = document.getElementById('questionTemplate').content.cloneNode(true);
            document.getElementById('questionContainer').appendChild(tpl);
        };

        window.removeQuestion = (btn) => btn.closest('.question-item').remove();

        window.toggleOptions = (select) => {
            const area = select.parentElement.querySelector('.options-area');
            if (select.value === 'choice') area.classList.remove('hidden');
            else area.classList.add('hidden');
        };

        window.handleSave = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                const questions = [];
                document.querySelectorAll('.question-item').forEach(qEl => {
                    const text = qEl.querySelector('[name="q_text"]').value;
                    const type = qEl.querySelector('[name="q_type"]').value;
                    let options = null;
                    
                    if (type === 'choice') {
                        const optionsText = qEl.querySelector('.options-area input').value;
                        options = optionsText.split(',').map(o => o.trim()).filter(o => o);
                    }
                    
                    questions.push({
                        question_text: text,
                        question_type: type,
                        options: options
                    });
                });

                const data = {
                    course_id: parseInt(document.getElementById('targetCourseId').value) || selectedCourseId,
                    type: document.getElementById('surveyType').value,
                    title: document.getElementById('surveyTitle').value,
                    description: document.getElementById('surveyDesc').value,
                    start_date: document.getElementById('startDate').value || null,
                    end_date: document.getElementById('endDate').value || null,
                    status: 'active',
                    questions: questions
                };

                const url = currentSurveyId ? \`/api/surveys/\${currentSurveyId}\` : '/api/surveys';
                const method = currentSurveyId ? 'PUT' : 'POST';

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
                    alert(currentSurveyId ? '설문이 수정되었습니다.' : '설문이 생성되었습니다.');
                    closeModal('createModal');
                    loadSurveys();
                    updateStats();
                } else {
                    alert('오류: ' + (result.error || '저장 실패'));
                }
            } catch (error) {
                console.error('Error saving survey:', error);
                alert('설문 저장 중 오류가 발생했습니다.');
            }
        };
        
        window.closeSurvey = async (id) => {
            if(!confirm('이 설문을 마감하시겠습니까?')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/surveys/\${id}/close\`, {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('마감 처리되었습니다.');
                    loadSurveys();
                    updateStats();
                } else {
                    alert('오류: ' + (result.error || '마감 실패'));
                }
            } catch (error) {
                console.error('Error closing survey:', error);
                alert('마감 처리 중 오류가 발생했습니다.');
            }
        };

        async function deleteSurvey(id) {
            if(!confirm('정말 이 설문을 삭제하시겠습니까? 모든 응답 데이터도 함께 삭제됩니다.')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/surveys/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadSurveys();
                    updateStats();
                } else {
                    alert('오류: ' + (result.error || '삭제 실패'));
                }
            } catch (error) {
                console.error('Error deleting survey:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        /* Results */
        window.viewResults = async (id, type) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/surveys/\${id}/results\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('결과를 불러오는데 실패했습니다.');
                    return;
                }
                
                const { survey, stats, question_stats, responses } = result.data;
                document.getElementById('resultModal').classList.remove('hidden');
                
                // 통계 요약 표시
                const chartContainer = document.getElementById('chartContainer');
                if (type === 'diagnosis' && question_stats && question_stats.length > 0) {
                    chartContainer.classList.remove('hidden');
                    if (competencyChart) competencyChart.destroy();
                    const ctx = document.getElementById('competencyChart').getContext('2d');
                    const ratingQuestions = question_stats.filter(q => q.question_type === 'rating');
                    
                    if (ratingQuestions.length > 0) {
                        const labels = ratingQuestions.map(q => q.question_text.length > 15 ? q.question_text.substring(0, 15) + '...' : q.question_text);
                        const data = ratingQuestions.map(q => q.average || 0);
                        
                        competencyChart = new Chart(ctx, {
                            type: 'radar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: '평균 점수',
                                    data: data,
                                    fill: true,
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                    borderColor: 'rgb(59, 130, 246)',
                                    pointBackgroundColor: 'rgb(59, 130, 246)',
                                    pointBorderColor: '#fff'
                                }]
                            },
                            options: { 
                                scales: { r: { suggestedMin: 0, suggestedMax: 5 } },
                                plugins: { legend: { display: false } }
                            }
                        });
                    } else {
                        chartContainer.classList.add('hidden');
                    }
                } else {
                    chartContainer.classList.add('hidden');
                }

                // 문항별 통계
                let scoreDetailsHtml = '';
                if (question_stats && question_stats.length > 0) {
                    scoreDetailsHtml = question_stats.map(q => {
                        const avg = q.average || 0;
                        const max = q.question_type === 'rating' ? 5 : 100;
                        return \`
                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="font-bold text-gray-700">\${q.question_text}</span>
                                    <span class="text-blue-600 font-bold">\${avg.toFixed(1)}점</span>
                                </div>
                                <div class="bg-gray-100 h-2 rounded-full">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width:\${(avg / max * 100)}%"></div>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">응답: \${q.total_responses}건</div>
                            </div>
                        \`;
                    }).join('');
                }
                document.getElementById('scoreDetails').innerHTML = scoreDetailsHtml || '<div class="text-gray-500">통계 데이터가 없습니다.</div>';
                
                // 서술형 답변 수집
                const textQuestions = question_stats?.filter(q => q.question_type === 'text') || [];
                let commentsHtml = '';
                if (textQuestions.length > 0 && responses && responses.length > 0) {
                    for (const resp of responses) {
                        try {
                            const respDetail = await fetch(\`/api/surveys/\${id}/responses/\${resp.id}\`, {
                                headers: { 'Authorization': 'Bearer ' + token }
                            }).then(r => r.json());
                            
                            if (respDetail.success && respDetail.data && respDetail.data.answers) {
                                respDetail.data.answers.forEach((answer: any) => {
                                    if (answer.question_type === 'text' && answer.answer_value) {
                                        commentsHtml += \`<div class="p-3 border-b border-gray-200">
                                            <div class="flex justify-between items-start mb-2">
                                                <div class="text-xs text-gray-500">\${resp.student_name || '익명'}</div>
                                                <div class="text-xs text-gray-400">\${new Date(resp.submitted_at).toLocaleDateString()}</div>
                                            </div>
                                            <div class="text-sm text-gray-700 whitespace-pre-wrap">\${answer.answer_value}</div>
                                        </div>\`;
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('Error loading response detail:', e);
                        }
                    }
                }
                document.getElementById('commentsList').innerHTML = commentsHtml || '<div class="p-2 text-gray-500">서술형 답변이 없습니다.</div>';
            } catch (error) {
                console.error('Error loading results:', error);
                alert('결과를 불러오는데 실패했습니다.');
            }
        };

    </script>
</body>
</html>
`;
