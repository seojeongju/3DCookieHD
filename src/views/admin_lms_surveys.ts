import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsSurveysHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설문/평가 관리 - 와우쓰리디홍대센터</title>
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
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('surveys')}

    <!-- 서브 헤더 -->
    <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">역량 평가 및 설문 관리</h2>
                <div class="flex gap-2">
                    <button type="button" id="btnPostLectureSurvey" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center shadow-sm">
                        <i class="fas fa-clipboard-list mr-2"></i> 강의 후 설문지 생성
                    </button>
                    <button onclick="openCreateModal('diagnosis')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                        <i class="fas fa-chart-radar mr-2"></i> 역량 진단 생성
                    </button>
                    <button onclick="openCreateModal('survey')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-poll mr-2"></i> 일반 설문 생성
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 통계 요약 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">평가 진행률</h3>
                    <span class="p-2 bg-blue-100 text-blue-600 rounded-lg"><i class="fas fa-percent"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-progress">0%</div>
                <p class="text-sm text-gray-500">전체 수강생 대비 참여율</p>
                <div class="w-full bg-gray-100 rounded-full h-2 mt-4">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 0%" id="stat-progress-bar"></div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">평균 만족도</h3>
                    <span class="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><i class="fas fa-star"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-satisfaction">0.0</div>
                <p class="text-sm text-gray-500">5.0 만점 기준</p>
                <div class="flex text-yellow-400 text-sm mt-3" id="stat-stars">
                    <!-- 별점 렌더링 -->
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">진행중인 평가</h3>
                    <span class="p-2 bg-green-100 text-green-600 rounded-lg"><i class="fas fa-clock"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-active">0</div>
                <p class="text-sm text-gray-500">현재 참여 가능한 설문/평가</p>
            </div>
        </div>

        <!-- 설문/평가 목록 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-lg text-gray-800">등록된 평가 및 설문 목록</h3>
                <div class="flex gap-2">
                    <select id="filterType" class="text-sm border-gray-300 rounded-lg focus:ring-blue-500">
                        <option value="all">전체 보기</option>
                        <option value="post_lecture">강의 후 설문지</option>
                        <option value="diagnosis">역량 진단</option>
                        <option value="survey">일반 설문</option>
                    </select>
                </div>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">교과목</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">참여현황</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="surveyList" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>

    <!-- 강의 후 설문지 생성/수정 모달 -->
    <div id="postLectureModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-amber-50 rounded-t-xl">
                <h3 class="text-xl font-bold text-gray-800" id="postLectureModalTitle">강의 후 설문지</h3>
                <button type="button" onclick="closeModal('postLectureModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="postLectureForm" class="p-6 space-y-4">
                <input type="hidden" id="postLectureSurveyId" value="">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">제목</label>
                    <input type="text" id="postLectureTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" value="강의 후 설문지" placeholder="강의 후 설문지">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="postLectureDesc" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="설문 안내 문구">수고하셨습니다.
이 설문지는 오늘 배운 교과목에 대한 전반적인 사항을 객관적으로 파악하고, 이를 토대로 앞으로 교육을 하는데 기초 자료로 활용하고자 하는 것이 목적입니다. 여러분의 솔직하고 진지한 평가가 차후 보다 나은 교육으로 반영될 것입니다.</textarea>
                </div>
                <div id="postLectureSubjectListBlock">
                    <label class="block text-sm font-bold text-gray-700 mb-1">해당교과목 선택 <span class="text-amber-600 font-normal">(해당 과정의 교과목 전체 중 설문을 받을 교과목을 선택하세요)</span></label>
                    <input type="hidden" id="postLectureSubjectName" value="">
                    <div id="postLectureSubjectSelectWrap" class="relative">
                        <button type="button" id="postLectureSubjectTrigger" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-left flex items-center justify-between gap-2 hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition">
                            <span id="postLectureSubjectTriggerText" class="text-sm text-gray-500 truncate flex-1">선택하세요</span>
                            <i class="fas fa-chevron-down text-slate-400 text-xs shrink-0 transition-transform post-lecture-subject-chevron"></i>
                        </button>
                        <div id="postLectureSubjectList" class="absolute top-full left-0 right-0 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg z-20 max-h-[220px] overflow-y-auto custom-scrollbar hidden">불러오는 중...</div>
                    </div>
                </div>
                <div id="postLectureTeacherBlock" class="hidden">
                    <label class="block text-sm font-bold text-gray-700 mb-1">담당 선생</label>
                    <select id="postLectureTeacherId" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                        <option value="">선택하세요</option>
                    </select>
                </div>
                <div id="postLectureTeacherReadonlyBlock" class="hidden">
                    <label class="block text-sm font-bold text-gray-700 mb-1">담당 선생</label>
                    <p id="postLectureTeacherName" class="px-4 py-2 text-gray-700 font-medium">-</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">시작일</label>
                        <input type="date" id="postLectureStartDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">종료일</label>
                        <input type="date" id="postLectureEndDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                    </div>
                </div>

                <!-- 문항 편집 섹션 -->
                <div class="border-t pt-4 mt-2">
                    <div class="flex justify-between items-center mb-3">
                        <label class="block text-sm font-bold text-gray-700">설문 문항 편집</label>
                        <button type="button" onclick="addPostLectureQuestion()" class="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 font-bold"><i class="fas fa-plus mr-1"></i>문항 추가</button>
                    </div>
                    <div id="postLectureQuestions" class="space-y-3">
                        <!-- 문항들이 동적으로 로드됨 -->
                    </div>
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button type="button" onclick="closeModal('postLectureModal')" class="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                    <button type="submit" class="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700">저장</button>
                </div>
            </form>
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
                <input type="hidden" id="surveyId" value="">
                <input type="hidden" id="surveyType">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">제목</label>
                    <input type="text" id="surveyTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="예: 훈련과정 만족도 조사, 사전 역량 진단평가">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="surveyDesc" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="평가에 대한 안내 문구를 입력하세요."></textarea>
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
                    <div id="questionContainer" class="space-y-4">
                        <!-- 문항들이 여기에 추가됨 -->
                    </div>
                </div>

                <div class="pt-6 flex justify-end gap-3">
                    <button type="button" onclick="closeModal('createModal')" class="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                    <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">저장하기</button>
                </div>
            </form>
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
                <!-- 객관식 옵션 입력 영역 (숨김) -->
                <div class="hidden options-area mt-2 space-y-1">
                    <input type="text" class="w-full px-2 py-1 border rounded text-xs" placeholder="옵션 1 (콤마로 구분하여 입력: 예: 매우그렇다,그렇다,보통)">
                </div>
            </div>
        </div>
    </template>

    <script>
        const pathParts = window.location.pathname.split('/');
        const courseId = pathParts[pathParts.indexOf('courses') + 1];
        const urlParams = new URLSearchParams(window.location.search);
        const isHrd = (urlParams.get('type') || '').toLowerCase().startsWith('hrd') || window.location.pathname.indexOf('/lms') !== -1;
        let surveys = [];
        let currentUser = null;
        let teachersList = [];
        let pendingPostLectureTeacherId = null;
        let pendingPostLectureSubjectName = null;

        document.addEventListener('DOMContentLoaded', () => {
             var token = localStorage.getItem('token');
             if (token) {
                 fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
                     .then(function(r) { return r.json(); })
                     .then(function(res) { if (res && res.success && res.data) currentUser = res.data; })
                     .catch(function() {});
             }
             loadSurveys();
             var btn = document.getElementById('btnPostLectureSurvey');
             if (btn) btn.addEventListener('click', function() { openPostLectureModal(false); });
             var filter = document.getElementById('filterType');
             if (filter) filter.addEventListener('change', function() { loadSurveys(); });
             var list = document.getElementById('surveyList');
             if (list) list.addEventListener('click', function(e) {
                 var startBtn = e.target && e.target.closest && e.target.closest('.btn-survey-start');
                 if (startBtn) { startSurvey(parseInt(startBtn.getAttribute('data-id'), 10)); return; }
                 var closeBtn = e.target && e.target.closest && e.target.closest('.btn-survey-close');
                 if (closeBtn) { closeSurvey(parseInt(closeBtn.getAttribute('data-id'), 10)); return; }
                 var editBtn = e.target && e.target.closest && e.target.closest('.btn-edit-survey');
                 if (editBtn) {
                     var id = parseInt(editBtn.getAttribute('data-id'), 10);
                     var type = editBtn.getAttribute('data-type');
                     if (type === 'post_lecture') openPostLectureModal(true, id);
                     else openCreateModal(type, true, id);
                     return;
                 }
                 var delBtn = e.target && e.target.closest && e.target.closest('.btn-delete-survey');
                 if (delBtn) { deleteSurvey(parseInt(delBtn.getAttribute('data-id'), 10)); }
             });
             var postForm = document.getElementById('postLectureForm');
             if (postForm) postForm.addEventListener('submit', function(e) { e.preventDefault(); savePostLectureSurvey(); });
        });

        function getSurveysApiUrl() {
            var token = localStorage.getItem('token');
            if (!token) return null;
            if (isHrd && courseId) return '/api/surveys?session_id=' + encodeURIComponent(courseId);
            if (courseId) return '/api/surveys?course_id=' + encodeURIComponent(courseId);
            return null;
        }

        function getSummaryApiUrl() {
            if (!courseId) return null;
            if (isHrd) return '/api/surveys/summary?session_id=' + encodeURIComponent(courseId);
            return '/api/surveys/summary?course_id=' + encodeURIComponent(courseId);
        }

        function loadSatisfactionSummary() {
            var url = getSummaryApiUrl();
            if (!url) return;
            var token = localStorage.getItem('token');
            if (!token) return;
            fetch(url, { headers: { 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    var avg = (res && res.success && res.data && typeof res.data.average_satisfaction === 'number') ? res.data.average_satisfaction : 0;
                    var el = document.getElementById('stat-satisfaction');
                    var starsEl = document.getElementById('stat-stars');
                    if (el) el.textContent = avg.toFixed(1);
                    if (starsEl) {
                        var full = Math.floor(avg);
                        var half = avg - full >= 0.5 ? 1 : 0;
                        var empty = 5 - full - half;
                        var html = '';
                        for (var i = 0; i < full; i++) html += '<i class="fas fa-star text-yellow-400"></i>';
                        if (half) html += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
                        for (var i = 0; i < empty; i++) html += '<i class="far fa-star text-yellow-400"></i>';
                        starsEl.innerHTML = html || '<span class="text-gray-400 text-sm">응답 없음</span>';
                    }
                })
                .catch(function() {
                    var el = document.getElementById('stat-satisfaction');
                    var starsEl = document.getElementById('stat-stars');
                    if (el) el.textContent = '0.0';
                    if (starsEl) starsEl.innerHTML = '<span class="text-gray-400 text-sm">-</span>';
                });
        }

        function loadSurveys() {
            const tbody = document.getElementById('surveyList');
            const url = getSurveysApiUrl();
            if (!url) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">과정/회차 정보가 없습니다.</td></tr>';
                return;
            }
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> 불러오는 중...</td></tr>';
            fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res || !res.success) { surveys = []; }
                    else { surveys = Array.isArray(res.data) ? res.data : []; }
                    renderSurveyList();
                    updateStats();
                    loadSatisfactionSummary();
                })
                .catch(function() { surveys = []; renderSurveyList(); updateStats(); loadSatisfactionSummary(); });
        }

        function renderSurveyList() {
            const tbody = document.getElementById('surveyList');
            const filterVal = (document.getElementById('filterType') && document.getElementById('filterType').value) || 'all';
            let list = surveys;
            if (filterVal !== 'all') list = list.filter(function(s) { return s.type === filterVal; });

            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">등록된 설문이 없습니다. 위 버튼으로 생성해 주세요.</td></tr>';
                return;
            }

            tbody.innerHTML = list.map(function(s) {
                var typeLabel = s.type === 'post_lecture'
                    ? '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">강의후설문</span>'
                    : s.type === 'diagnosis'
                    ? '<span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">역량진단</span>'
                    : '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">일반설문</span>';
                var subjectCell = s.type === 'post_lecture' && (s.subject_name || '').trim()
                    ? '<span class="text-sm text-gray-700">' + String(s.subject_name || '').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;') + '</span>'
                    : '<span class="text-gray-400 text-sm">-</span>';
                var statusLabel = s.status === 'active'
                    ? '<span class="text-green-600 font-bold text-xs"><i class="fas fa-circle text-[8px] mr-1"></i>진행중</span>'
                    : s.status === 'draft'
                    ? '<span class="text-amber-600 font-bold text-xs">대기</span>'
                    : '<span class="text-gray-400 font-bold text-xs">종료됨</span>';
                var total = s.total_target || 0;
                var count = s.response_count || 0;
                var rate = total > 0 ? Math.round((count / total) * 100) : 0;
                var startDate = (s.start_date || '').split('T')[0];
                var endDate = (s.end_date || '').split('T')[0];
                var previewHref = '/admin/courses/' + courseId + '/lms/surveys/' + s.id + '/preview' + (isHrd ? '?type=hrd' : '');
                var typeAttr = String(s.type || '').split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
                var titleSafe = String(s.title || '-').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
                return '<tr class="hover:bg-gray-50 transition">' +
                    '<td class="px-6 py-4 whitespace-nowrap">' + typeLabel + '</td>' +
                    '<td class="px-6 py-4 font-medium text-gray-800">' + titleSafe + '</td>' +
                    '<td class="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" title="' + (s.subject_name || '').replace(/"/g, '&quot;') + '">' + subjectCell + '</td>' +
                    '<td class="px-6 py-4 text-xs text-gray-500">' + startDate + ' ~ ' + endDate + '</td>' +
                    '<td class="px-6 py-4 text-center"><div class="flex items-center justify-center gap-2"><span class="text-sm font-bold text-gray-700">' + count + '/' + total + '</span><span class="text-xs text-gray-400">(' + rate + '%)</span></div>' +
                    '<div class="w-full bg-gray-100 rounded-full h-1.5 mt-1 max-w-[100px] mx-auto"><div class="bg-blue-500 h-1.5 rounded-full" style="width:' + rate + '%"></div></div></td>' +
                    '<td class="px-6 py-4 text-center">' + statusLabel + '</td>' +
                    '<td class="px-6 py-4 text-right">' +
                    (s.status !== 'active' ? '<button type="button" class="btn-survey-start text-green-600 hover:underline text-xs font-bold mr-3" data-id="' + s.id + '">설문진행</button>' : '') +
                    (s.status === 'active' ? '<button type="button" class="btn-survey-close text-orange-600 hover:underline text-xs font-bold mr-3" data-id="' + s.id + '">진행종료</button>' : '') +
                    '<a href="' + previewHref + '" target="_blank" class="text-amber-600 hover:underline text-xs font-bold mr-3">미리보기</a>' +
                    '<a href="/admin/courses/' + courseId + '/lms/surveys/' + s.id + '/results' + (isHrd ? '?type=hrd' : '') + '" class="text-blue-600 hover:underline text-xs font-bold mr-3">결과분석</a>' +
                    '<button type="button" class="btn-edit-survey text-indigo-600 hover:underline text-xs font-bold mr-3" data-id="' + s.id + '" data-type="' + typeAttr + '">수정</button>' +
                    '<button type="button" class="btn-delete-survey text-red-600 hover:underline text-xs font-bold" data-id="' + s.id + '">삭제</button>' +
                    '</td></tr>';
            }).join('');
        }

        function updateStats() {
            var active = surveys.filter(function(s) { return s.status === 'active'; }).length;
            document.getElementById('stat-active').textContent = active;
            var totalTarget = surveys.length && surveys[0].total_target != null ? surveys[0].total_target : 0;
            var totalResp = surveys.reduce(function(a, s) { return a + (s.response_count || 0); }, 0);
            var rate = totalTarget > 0 ? Math.round((totalResp / (surveys.length * Math.max(totalTarget, 1))) * 100) : 0;
            if (surveys.length && totalTarget > 0) rate = Math.round((totalResp / (surveys.length * totalTarget)) * 100);
            rate = Math.min(100, rate);
            document.getElementById('stat-progress').textContent = rate + '%';
            document.getElementById('stat-progress-bar').style.width = rate + '%';
            document.getElementById('stat-satisfaction').textContent = '0.0';
            document.getElementById('stat-stars').innerHTML = '<span class="text-gray-400 text-sm">불러오는 중...</span>';
        }

        function showPostLectureTeacherBlock() {
            var blockSel = document.getElementById('postLectureTeacherBlock');
            var blockReadonly = document.getElementById('postLectureTeacherReadonlyBlock');
            if (!blockSel || !blockReadonly) return;
            blockSel.classList.add('hidden');
            blockReadonly.classList.add('hidden');
            if (currentUser && currentUser.role === 'admin') {
                blockSel.classList.remove('hidden');
                if (teachersList.length === 0) {
                    var token = localStorage.getItem('token');
                    if (token) {
                        fetch('/api/users?role=teacher&limit=500', { headers: { 'Authorization': 'Bearer ' + token } })
                            .then(function(r) { return r.json(); })
                            .then(function(res) {
                                if (res && res.success && Array.isArray(res.data)) {
                                    teachersList = res.data;
                                    var sel = document.getElementById('postLectureTeacherId');
                                    if (sel) {
                                        sel.innerHTML = '<option value="">선택하세요</option>' + teachersList.map(function(t) { return '<option value="' + t.id + '">' + (t.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</option>'; }).join('');
                                        if (pendingPostLectureTeacherId) { sel.value = String(pendingPostLectureTeacherId); pendingPostLectureTeacherId = null; }
                                    }
                                }
                            })
                            .catch(function() {});
                    }
                } else {
                    var sel = document.getElementById('postLectureTeacherId');
                    if (sel && sel.options.length <= 1) {
                        sel.innerHTML = '<option value="">선택하세요</option>' + teachersList.map(function(t) { return '<option value="' + t.id + '">' + (t.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</option>'; }).join('');
                    }
                }
            } else if (currentUser && currentUser.role === 'teacher') {
                blockReadonly.classList.remove('hidden');
                var nameEl = document.getElementById('postLectureTeacherName');
                if (nameEl) nameEl.textContent = currentUser.name || '(본인)';
            }
        }

        // 고정 문항 기본값 (신규 생성 시 표시)
        var DEFAULT_POST_LECTURE_QUESTIONS = [
            { question_text: '교육과정에 대해 전반적으로 만족한다.', question_type: 'rating' },
            { question_text: '교육 내용이 쉽게 구성되었으며, 전반적으로 이해 하였다', question_type: 'rating' },
            { question_text: '본 교육의 전반적인 만족도는?', question_type: 'rating' },
            { question_text: '강의 내용을 알기 쉽게 설명 했는가?', question_type: 'rating' },
            { question_text: '교수는 강의의 중요성을 잘 짚어주었는가?', question_type: 'rating' },
            { question_text: '교수가 전체적으로 분위기를 잘 이끌었는가?', question_type: 'rating' },
            { question_text: '강의에 포함된 내용이 흥미로웠는가?', question_type: 'rating' },
            { question_text: '왕성한 의욕을 갖도록 동기유발을 잘 하였는가?', question_type: 'rating' },
            { question_text: '교육목표에 적합한 교육계획을 수립하였는가?', question_type: 'rating' },
            { question_text: '강의 내용이 실력향상에 도움이 되었는가?', question_type: 'rating' },
            { question_text: '전반적인 교육 소감을 구체적으로 작성하여 주시기 바랍니다.', question_type: 'text' }
        ];

        function renderPostLectureQuestions(questions) {
            var container = document.getElementById('postLectureQuestions');
            if (!container) return;
            container.innerHTML = '';
            (questions || []).forEach(function(q, idx) {
                container.appendChild(buildPostLectureQuestionEl(q.question_text, q.question_type, idx));
            });
        }

        function buildPostLectureQuestionEl(text, type, idx) {
            var div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-2 items-start post-lecture-q-item';
            div.innerHTML =
                '<span class="text-xs font-bold text-gray-400 pt-2 min-w-[1.75rem] text-right">' + (idx + 1) + '.</span>' +
                '<div class="flex-1 space-y-1">' +
                '<input type="text" name="pl_q_text" value="' + (text || '').replace(/"/g, '&quot;') + '" class="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500" placeholder="문항 내용">' +
                '<select name="pl_q_type" class="px-2 py-1 border rounded text-xs text-gray-600">' +
                '<option value="rating"' + (type === 'rating' ? ' selected' : '') + '>5점 척도</option>' +
                '<option value="text"' + (type === 'text' ? ' selected' : '') + '>서술형</option>' +
                '<option value="choice"' + (type === 'choice' ? ' selected' : '') + '>객관식</option>' +
                '</select></div>' +
                '<button type="button" onclick="removePostLectureQuestion(this)" class="mt-1 text-gray-300 hover:text-red-500 flex-shrink-0"><i class="fas fa-trash"></i></button>';
            return div;
        }

        function addPostLectureQuestion() {
            var container = document.getElementById('postLectureQuestions');
            if (!container) return;
            var idx = container.querySelectorAll('.post-lecture-q-item').length;
            container.appendChild(buildPostLectureQuestionEl('', 'rating', idx));
            // 번호 갱신
            reindexPostLectureQuestions();
        }

        function removePostLectureQuestion(btn) {
            var item = btn.closest('.post-lecture-q-item');
            if (item) item.remove();
            reindexPostLectureQuestions();
        }

        function reindexPostLectureQuestions() {
            var container = document.getElementById('postLectureQuestions');
            if (!container) return;
            container.querySelectorAll('.post-lecture-q-item').forEach(function(el, i) {
                var numEl = el.querySelector('span');
                if (numEl) numEl.textContent = (i + 1) + '.';
            });
        }

        function openPostLectureModal(isEdit, surveyId) {
            var form = document.getElementById('postLectureForm');
            if (form) form.reset();
            
            var idEl = document.getElementById('postLectureSurveyId');
            var titleEl = document.getElementById('postLectureModalTitle');
            var subjectListBlock = document.getElementById('postLectureSubjectListBlock');
            if (subjectListBlock) subjectListBlock.style.display = isHrd ? 'block' : 'none';
            var subjectListEl = document.getElementById('postLectureSubjectList');
            if (subjectListEl && isHrd) document.getElementById('postLectureSubjectTriggerText').textContent = '불러오는 중...';
            showPostLectureTeacherBlock();
            if (!isEdit) {
                idEl.value = '';
                titleEl.textContent = '강의 후 설문지 생성';
                document.getElementById('postLectureTitle').value = '강의 후 설문지';
                document.getElementById('postLectureDesc').value = '수고하셨습니다.\n이 설문지는 오늘 배운 교과목에 대한 전반적인 사항을 객관적으로 파악하고, 이를 토대로 앞으로 교육을 하는데 기초 자료로 활용하고자 하는 것이 목적입니다. 여러분의 솔직하고 진지한 평가가 차후 보다 나은 교육으로 반영될 것입니다.';
                var today = new Date();
                var startDate = today.toISOString().split('T')[0];
                var endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                document.getElementById('postLectureStartDate').value = startDate;
                document.getElementById('postLectureEndDate').value = endDate;
                var subInput = document.getElementById('postLectureSubjectName');
                if (subInput) subInput.value = '';
                if (isHrd && courseId) loadSessionSubjects();
                var sel = document.getElementById('postLectureTeacherId');
                if (sel) sel.value = '';
                // 기본 문항 렌더링
                renderPostLectureQuestions(DEFAULT_POST_LECTURE_QUESTIONS);
            } else {
                titleEl.textContent = '강의 후 설문지 수정';
                idEl.value = String(surveyId);
                var token = localStorage.getItem('token');
                if (!token) { alert('로그인이 필요합니다.'); return; }
                // 문항 로딩 중 표시
                var qContainer = document.getElementById('postLectureQuestions');
                if (qContainer) qContainer.innerHTML = '<div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>문항 불러오는 중...</div>';
                fetch('/api/surveys/' + surveyId, { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (!res || !res.success || !res.data) { alert('설문 정보를 불러오지 못했습니다.'); return; }
                        var s = res.data;
                        document.getElementById('postLectureTitle').value = s.title || '강의 후 설문지';
                        document.getElementById('postLectureDesc').value = s.description || '';
                        document.getElementById('postLectureStartDate').value = (s.start_date || '').split('T')[0];
                        document.getElementById('postLectureEndDate').value = (s.end_date || '').split('T')[0];
                        var subInput = document.getElementById('postLectureSubjectName');
                        if (subInput) subInput.value = s.subject_name || '';
                        if (s.teacher_id) {
                            var sel = document.getElementById('postLectureTeacherId');
                            if (sel) {
                                if (sel.options.length > 1) sel.value = String(s.teacher_id);
                                else pendingPostLectureTeacherId = s.teacher_id;
                            }
                        }
                        if (isHrd && courseId) {
                            loadSessionSubjects();
                            pendingPostLectureSubjectName = s.subject_name || '';
                        }
                        // 기존 문항이 있으면 로드, 없으면 기본 문항
                        var qs = (s.questions && s.questions.length > 0) ? s.questions : DEFAULT_POST_LECTURE_QUESTIONS;
                        renderPostLectureQuestions(qs);
                    })
                    .catch(function() { alert('설문 정보를 불러오는 중 오류가 발생했습니다.'); });
            }
            document.getElementById('postLectureModal').classList.remove('hidden');
        }

        /** 해당 과정(회차)의 교과목 전체 리스트 로드 (날짜 무관) */
        function loadSessionSubjects() {
            var subjectListBlock = document.getElementById('postLectureSubjectListBlock');
            var subjectListEl = document.getElementById('postLectureSubjectList');
            var subjectNameInput = document.getElementById('postLectureSubjectName');
            var triggerBtn = document.getElementById('postLectureSubjectTrigger');
            var triggerText = document.getElementById('postLectureSubjectTriggerText');
            if (subjectNameInput) subjectNameInput.value = '';
            if (triggerText) { triggerText.textContent = '불러오는 중...'; triggerText.classList.remove('text-gray-800'); triggerText.classList.add('text-gray-500'); }

            if (!isHrd || !courseId) {
                if (triggerText) triggerText.textContent = '선택하세요';
                return;
            }
            if (subjectListEl) subjectListEl.classList.add('hidden');
            var token = localStorage.getItem('token');
            fetch('/api/hrd/training-logs/session-subjects?courseId=' + encodeURIComponent(courseId), { headers: { 'Authorization': 'Bearer ' + (token || '') } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res || !res.success || !Array.isArray(res.data)) {
                        if (subjectListEl) { subjectListEl.innerHTML = '<div class="p-4 text-slate-500 text-sm text-center">등록된 교과목이 없습니다.</div>'; subjectListEl.classList.add('hidden'); }
                        if (triggerText) triggerText.textContent = '등록된 교과목이 없습니다.';
                        return;
                    }
                    var rows = res.data;
                    if (rows.length === 0) {
                        if (subjectListEl) { subjectListEl.innerHTML = '<div class="p-4 text-slate-500 text-sm text-center">등록된 교과목이 없습니다.</div>'; subjectListEl.classList.add('hidden'); }
                        if (triggerText) triggerText.textContent = '등록된 교과목이 없습니다.';
                        return;
                    }
                    if (subjectListEl) {
                        subjectListEl.innerHTML = rows.map(function(r, idx) {
                            var sub = (r.subject_name || '-').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
                            var inst = (r.instructor_name || '-').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
                            var subRaw = (r.subject_name || '').trim();
                            var instRaw = (r.instructor_name || '').trim();
                            var label = subRaw + (instRaw ? ' / ' + instRaw : '');
                            return '<button type="button" class="post-lecture-subject-item w-full text-left px-4 py-3 border-b border-slate-200 last:border-b-0 flex items-center gap-3 hover:bg-amber-50 transition ' + (idx === 0 ? 'bg-amber-50 border-l-4 border-l-amber-500' : 'border-l-4 border-l-transparent') + '" data-subject="' + subRaw + '" data-instructor="' + instRaw + '" data-label="' + label.replace(/"/g, '&quot;') + '">' +
                                '<i class="fas fa-check-circle text-amber-500 ' + (idx === 0 ? '' : 'opacity-0') + ' subject-item-check"></i>' +
                                '<span class="flex-1 text-sm font-medium text-gray-800">' + sub + (inst ? ' <span class="text-slate-500 font-normal">/ ' + inst + '</span>' : '') + '</span>' +
                                '</button>';
                        }).join('');
                        subjectListEl.classList.add('hidden');

                        function closeSubjectDropdown() {
                            subjectListEl.classList.add('hidden');
                            if (triggerBtn && triggerBtn.querySelector('.post-lecture-subject-chevron')) triggerBtn.querySelector('.post-lecture-subject-chevron').classList.remove('rotate-180');
                        }
                        if (triggerBtn) {
                            triggerBtn.onclick = function(e) {
                                e.stopPropagation();
                                if (subjectListEl.classList.contains('hidden')) {
                                    subjectListEl.classList.remove('hidden');
                                    if (triggerBtn.querySelector('.post-lecture-subject-chevron')) triggerBtn.querySelector('.post-lecture-subject-chevron').classList.add('rotate-180');
                                    setTimeout(function() {
                                        document.addEventListener('click', function docClose() {
                                            closeSubjectDropdown();
                                            document.removeEventListener('click', docClose);
                                        }, 1);
                                    }, 0);
                                } else {
                                    closeSubjectDropdown();
                                }
                            };
                        }
                        subjectListEl.querySelectorAll('.post-lecture-subject-item').forEach(function(btn, idx) {
                            btn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                subjectListEl.querySelectorAll('.post-lecture-subject-item').forEach(function(b) {
                                    b.classList.remove('bg-amber-50', 'border-l-amber-500');
                                    b.classList.add('border-l-transparent');
                                    var icon = b.querySelector('.subject-item-check');
                                    if (icon) icon.classList.add('opacity-0');
                                });
                                btn.classList.add('bg-amber-50', 'border-l-amber-500');
                                btn.classList.remove('border-l-transparent');
                                var icon = btn.querySelector('.subject-item-check');
                                if (icon) icon.classList.remove('opacity-0');
                                if (subjectNameInput) subjectNameInput.value = (btn.getAttribute('data-subject') || '').trim();
                                var label = (btn.getAttribute('data-label') || '').trim();
                                if (triggerText) { triggerText.textContent = label || '선택하세요'; triggerText.classList.remove('text-gray-500'); triggerText.classList.add('text-gray-800'); }
                                closeSubjectDropdown();
                            });
                        });
                        if (pendingPostLectureSubjectName && subjectListEl) {
                            subjectListEl.querySelectorAll('.post-lecture-subject-item').forEach(function(b) {
                                if ((b.getAttribute('data-subject') || '').trim() === pendingPostLectureSubjectName) { b.click(); }
                            });
                            pendingPostLectureSubjectName = null;
                        } else if (rows.length > 0 && (rows[0].subject_name || '').trim()) {
                            var firstLabel = (rows[0].subject_name || '').trim() + ((rows[0].instructor_name || '').trim() ? ' / ' + (rows[0].instructor_name || '').trim() : '');
                            if (subjectNameInput) subjectNameInput.value = (rows[0].subject_name || '').trim();
                            if (triggerText) { triggerText.textContent = firstLabel; triggerText.classList.remove('text-gray-500'); triggerText.classList.add('text-gray-800'); }
                        }
                    }
                })
                .catch(function() {
                    if (subjectListEl) { subjectListEl.innerHTML = '<div class="p-4 text-slate-500 text-sm text-center">교과목 목록을 불러오지 못했습니다.</div>'; subjectListEl.classList.add('hidden'); }
                    if (triggerText) triggerText.textContent = '교과목 목록을 불러오지 못했습니다.';
                });
        }

        function savePostLectureSurvey() {
            var idEl = document.getElementById('postLectureSurveyId');
            var surveyId = idEl.value ? parseInt(idEl.value, 10) : null;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            if (!courseId) { alert('과정/회차 정보가 없습니다.'); return; }

            // 문항 수집
            var questions = [];
            var qItems = document.querySelectorAll('#postLectureQuestions .post-lecture-q-item');
            qItems.forEach(function(item, idx) {
                var textInput = item.querySelector('input[name="pl_q_text"]');
                var typeSelect = item.querySelector('select[name="pl_q_type"]');
                var text = textInput ? textInput.value.trim() : '';
                var type = typeSelect ? typeSelect.value : 'rating';
                if (text) questions.push({ question_text: text, question_type: type, options: [], order_index: idx + 1 });
            });

            var startDateVal = document.getElementById('postLectureStartDate').value;
            var endDateVal = document.getElementById('postLectureEndDate').value;
            if (!startDateVal || !endDateVal) { alert('시작일과 종료일을 입력해 주세요.'); return; }
            var subjectNameVal = (document.getElementById('postLectureSubjectName') && document.getElementById('postLectureSubjectName').value) ? document.getElementById('postLectureSubjectName').value.trim() : '';
            if (!subjectNameVal) { alert('해당교과목을 선택해 주세요.'); return; }

            var body = {
                type: 'post_lecture',
                title: document.getElementById('postLectureTitle').value.trim() || '강의 후 설문지',
                description: document.getElementById('postLectureDesc').value.trim() || null,
                start_date: startDateVal,
                end_date: endDateVal,
                status: 'active',
                questions: questions,
                subject_name: subjectNameVal
            };

            var parsedCourseId = parseInt(courseId, 10);
            if (isNaN(parsedCourseId)) { alert('유효하지 않은 과정 ID입니다.'); return; }

            if (isHrd) body.session_id = parsedCourseId; else body.course_id = parsedCourseId;

            if (currentUser && currentUser.role === 'admin') {
                var teacherSel = document.getElementById('postLectureTeacherId');
                if (teacherSel && teacherSel.value) {
                    var tid = parseInt(teacherSel.value, 10);
                    if (!isNaN(tid)) body.teacher_id = tid;
                }
            }

            var url = surveyId ? '/api/surveys/' + surveyId : '/api/surveys';
            var method = surveyId ? 'PUT' : 'POST';
            var submitBtn = document.querySelector('#postLectureForm button[type="submit"]');
            
            if (submitBtn) { 
                submitBtn.disabled = true; 
                submitBtn.textContent = '저장 중...'; 
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(body)
            })
                .then(function(r) { 
                    if (!r.ok) {
                        return r.text().then(function(txt) { throw new Error(txt || r.statusText); });
                    }
                    return r.json(); 
                })
                .then(function(res) {
                    if (res && res.success) {
                        alert(surveyId ? '수정되었습니다.' : '강의 후 설문지가 생성되었습니다.');
                        closeModal('postLectureModal');
                        loadSurveys();
                    } else {
                        var msg = res && res.message ? res.message : (surveyId ? '수정에 실패했습니다.' : '생성에 실패했습니다.');
                        alert(msg);
                    }
                })
                .catch(function(err) {
                    console.error('Survey Save Error:', err);
                    alert('저장 중 오류가 발생했습니다: ' + err.message);
                })
                .finally(function() {
                    if (submitBtn) { 
                        submitBtn.disabled = false; 
                        submitBtn.textContent = '저장'; 
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                });
        }


        function startSurvey(id) {
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            fetch('/api/surveys/' + id + '/start', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (res && res.success) { alert(res.message || '설문이 진행 중으로 변경되었습니다.'); loadSurveys(); }
                    else alert(res && res.error ? res.error : '설문 진행 처리에 실패했습니다.');
                })
                .catch(function() { alert('요청 중 오류가 발생했습니다.'); });
        }

        function closeSurvey(id) {
            if (!confirm('이 설문을 진행 종료(마감)하시겠습니까?')) return;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            fetch('/api/surveys/' + id + '/close', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (res && res.success) { alert(res.message || '설문이 마감되었습니다.'); loadSurveys(); }
                    else alert(res && res.error ? res.error : '진행 종료에 실패했습니다.');
                })
                .catch(function() { alert('요청 중 오류가 발생했습니다.'); });
        }

        function deleteSurvey(id) {
            if (!confirm('이 설문을 삭제하시겠습니까? 응답 데이터도 함께 삭제됩니다.')) return;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            fetch('/api/surveys/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (res && res.success) { alert('삭제되었습니다.'); loadSurveys(); }
                    else alert(res && res.message ? res.message : '삭제에 실패했습니다.');
                })
                .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
        }

        /* Create Modal Functions */
        window.openCreateModal = (type, isEdit, surveyId) => {
            var form = document.getElementById('createForm');
            var idEl = document.getElementById('surveyId');
            var titleEl = document.getElementById('modalTitle');
            var qContainer = document.getElementById('questionContainer');
            
            form.reset();
            qContainer.innerHTML = '';
            document.getElementById('surveyType').value = type;
            idEl.value = isEdit ? String(surveyId) : '';
            
            if (!isEdit) {
                titleEl.textContent = type === 'diagnosis' ? '역량 진단 생성' : '새 설문 생성';
                addQuestion();
                document.getElementById('createModal').classList.remove('hidden');
            } else {
                titleEl.textContent = type === 'diagnosis' ? '역량 진단 수정' : '설문 수정';
                var token = localStorage.getItem('token');
                if (!token) { alert('로그인이 필요합니다.'); return; }
                
                qContainer.innerHTML = '<div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오고 있습니다...</div>';
                
                fetch('/api/surveys/' + surveyId, { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (!res || !res.success || !res.data) { alert('설문 정보를 불러오지 못했습니다.'); return; }
                        var s = res.data;
                        document.getElementById('surveyTitle').value = s.title || '';
                        document.getElementById('surveyDesc').value = s.description || '';
                        document.getElementById('startDate').value = (s.start_date || '').split('T')[0];
                        document.getElementById('endDate').value = (s.end_date || '').split('T')[0];
                        
                        qContainer.innerHTML = '';
                        if (s.questions && s.questions.length > 0) {
                            s.questions.forEach(function(q) {
                                addQuestion(q.question_text, q.question_type, q.options);
                            });
                        } else {
                            addQuestion();
                        }
                    })
                    .catch(function() { alert('정보를 불러오는 중 오류가 발생했습니다.'); });
                
                document.getElementById('createModal').classList.remove('hidden');
            }
        };

        window.closeModal = function(id) { document.getElementById(id).classList.add('hidden'); };

        window.addQuestion = (text, type, options) => {
            const tpl = document.getElementById('questionTemplate').content.cloneNode(true);
            const item = tpl.querySelector('.question-item');
            
            if (text) item.querySelector('input[name="q_text"]').value = text;
            if (type) {
                const select = item.querySelector('select[name="q_type"]');
                select.value = type;
                if (type === 'choice') {
                    const area = item.querySelector('.options-area');
                    area.classList.remove('hidden');
                    if (options) {
                        const optVal = Array.isArray(options) ? options.join(',') : (typeof options === 'string' ? options : '');
                        area.querySelector('input').value = optVal;
                    }
                }
            }
            
            document.getElementById('questionContainer').appendChild(tpl);
        };

        window.removeQuestion = (btn) => btn.closest('.question-item').remove();

        window.toggleOptions = (select) => {
            const area = select.parentElement.querySelector('.options-area');
            if (select.value === 'choice') area.classList.remove('hidden');
            else area.classList.add('hidden');
        };

        window.handleSave = (e) => {
            e.preventDefault();
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            if (!courseId) { alert('과정/회차 정보가 없습니다.'); return; }
            
            var surveyId = document.getElementById('surveyId').value;
            var type = document.getElementById('surveyType').value;
            var title = document.getElementById('surveyTitle').value.trim();
            var desc = document.getElementById('surveyDesc').value.trim();
            var startDate = document.getElementById('startDate').value;
            var endDate = document.getElementById('endDate').value;
            
            if (!title || !startDate || !endDate) { alert('제목, 시작일, 종료일을 입력해 주세요.'); return; }
            
            var questions = [];
            document.querySelectorAll('#questionContainer .question-item').forEach(function(item, idx) {
                var text = item.querySelector('input[name="q_text"]') ? item.querySelector('input[name="q_text"]').value.trim() : '';
                var qtype = item.querySelector('select[name="q_type"]') ? item.querySelector('select[name="q_type"]').value : 'rating';
                var options = null;
                if (qtype === 'choice') {
                    var optStr = item.querySelector('.options-area input').value.trim();
                    options = optStr ? optStr.split(',').map(s => s.trim()).filter(Boolean) : [];
                }
                if (text) questions.push({ question_text: text, question_type: qtype, options: options, order_index: idx + 1 });
            });
            
            var body = { 
                type: type, 
                title: title, 
                description: desc || null, 
                start_date: startDate, 
                end_date: endDate, 
                status: 'active', 
                questions: questions 
            };
            
            var parsedCourseId = parseInt(courseId, 10);
            if (isHrd) body.session_id = parsedCourseId; else body.course_id = parsedCourseId;
            
            var btn = e.target.querySelector('button[type="submit"]');
            if (btn) { 
                btn.disabled = true; 
                btn.textContent = '저장 중...'; 
                btn.classList.add('opacity-50');
            }
            
            var url = surveyId ? '/api/surveys/' + surveyId : '/api/surveys';
            var method = surveyId ? 'PUT' : 'POST';
            
            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(body)
            })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res && res.success) { 
                    alert(surveyId ? '설문이 수정되었습니다.' : '설문이 생성되었습니다.'); 
                    closeModal('createModal'); 
                    loadSurveys(); 
                }
                else { 
                    alert(res && res.message ? res.message : '저장에 실패했습니다.'); 
                    if (btn) { btn.disabled = false; btn.textContent = '저장하기'; btn.classList.remove('opacity-50'); } 
                }
            })
            .catch(function(err) { 
                alert('저장 중 오류가 발생했습니다: ' + err.message); 
                if (btn) { btn.disabled = false; btn.textContent = '저장하기'; btn.classList.remove('opacity-50'); } 
            });
        };


    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
