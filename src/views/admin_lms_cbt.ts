import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsCbtHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBT/시험 관리 - 와우쓰리디홍대센터</title>
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
    <style>
        .tab-btn.active {
            border-bottom: 2px solid #4a90e2;
            color: #4a90e2;
            font-weight: bold;
        }
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
                ${lmsHeaderHtml('cbt')}

    <!-- 서브 헤더 (CBT 전용) -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">CBT / 시험 관리</h2>
                <div class="flex gap-2">
                    <button onclick="openExamModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 시험 생성
                    </button>
                    <button onclick="openQuestionModal()" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center shadow-sm">
                        <i class="fas fa-question-circle mr-2"></i> 문제 등록
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 탭 메뉴 -->
        <div class="flex border-b border-gray-200 mb-6">
            <button onclick="switchTab('exams')" id="tab-exams" class="tab-btn active px-6 py-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                시험 목록
            </button>
            <button onclick="switchTab('questions')" id="tab-questions" class="tab-btn px-6 py-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                문제 은행
            </button>
            <button onclick="switchTab('results')" id="tab-results" class="tab-btn px-6 py-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                결과 분석
            </button>
        </div>

        <!-- 시험 목록 탭 -->
        <div id="content-exams" class="tab-content">
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험명</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">응시 기간</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">제한시간</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody id="examListBody" class="bg-white divide-y divide-gray-200">
                        <tr><td colspan="6" class="px-6 py-12 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩중...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 문제 은행 탭 -->
        <div id="content-questions" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
                <div class="flex gap-4">
                    <select id="questionTypeFilter" class="border rounded-lg px-3 py-2 text-sm" onchange="applyQuestionFilters()">
                        <option value="">전체 유형</option>
                        <option value="multiple_choice">객관식</option>
                        <option value="short_answer">단답형</option>
                        <option value="essay">서술형</option>
                    </select>
                    <select id="difficultyFilter" class="border rounded-lg px-3 py-2 text-sm" onchange="applyQuestionFilters()">
                        <option value="">전체 난이도</option>
                        <option value="high">상</option>
                        <option value="medium">중</option>
                        <option value="low">하</option>
                    </select>
                    <select id="ncsUnitFilter" class="border rounded-lg px-3 py-2 text-sm min-w-[180px]" onchange="applyQuestionFilters()">
                        <option value="">전체 NCS 능력단위</option>
                    </select>
                </div>
                <div class="flex gap-2">
                    <button onclick="document.getElementById('pdfUploadInput').click()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center">
                        <i class="fas fa-file-pdf mr-2"></i> AI 문제 생성 (PDF)
                    </button>
                    <input type="file" id="pdfUploadInput" accept=".pdf" class="hidden" onchange="handlePdfUpload(this)">
                </div>
            </div>

            <div class="grid gap-4" id="questionList">
                <!-- 문제 카드들이 여기에 렌더링됨 -->
            </div>
        </div>

        <!-- 결과 분석 탭 -->
        <div id="content-results" class="tab-content hidden">
            <div class="space-y-6">
                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800">시험별 응시 현황</h3>
                        <button type="button" onclick="loadResults()" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"><i class="fas fa-sync-alt mr-1"></i> 새로고침</button>
                    </div>
                    <div id="resultsSummaryTableWrap" class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시험명</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">응시 수</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">평균 점수</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">만점</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">상세</th>
                                </tr>
                            </thead>
                            <tbody id="resultsSummaryBody" class="bg-white divide-y divide-gray-200">
                                <tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="resultsDetailSection" class="hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800" id="resultsDetailTitle">시험 상세</h3>
                        <button type="button" onclick="closeResultsDetail()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="p-6 space-y-6">
                        <div>
                            <h4 class="text-sm font-bold text-gray-700 mb-2">제출 목록</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full text-sm">
                                    <thead class="bg-gray-50"><tr><th class="px-3 py-2 text-left text-xs text-gray-500">이름</th><th class="px-3 py-2 text-right text-xs text-gray-500">점수</th><th class="px-3 py-2 text-right text-xs text-gray-500">제출 일시</th></tr></thead>
                                    <tbody id="resultsDetailSubmissions"></tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-gray-700 mb-2">문제별 정답률</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full text-sm">
                                    <thead class="bg-gray-50"><tr><th class="px-3 py-2 text-left text-xs text-gray-500">#</th><th class="px-3 py-2 text-left text-xs text-gray-500">문제</th><th class="px-3 py-2 text-center text-xs text-gray-500">정답/응시</th><th class="px-3 py-2 text-center text-xs text-gray-500">정답률</th></tr></thead>
                                    <tbody id="resultsDetailQuestionStats"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 시험 생성/수정 모달 -->
    <div id="examModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="examModalTitle">시험 생성</h3>
                <button onclick="closeModal('examModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="examForm" onsubmit="handleSaveExam(event)">
                    <input type="hidden" name="exam_id" id="examIdInput" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">시험명</label>
                            <input type="text" name="title" id="examFormTitle" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 유형</label>
                                <select name="type" id="examFormType" class="w-full border rounded-lg px-3 py-2">
                                    <option value="midterm">중간평가</option>
                                    <option value="final">기말평가</option>
                                    <option value="mock">모의고사</option>
                                    <option value="practice">연습문제</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">제한 시간 (분)</label>
                                <input type="number" name="time_limit_minutes" id="examFormTimeLimit" value="60" class="w-full border rounded-lg px-3 py-2">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">시작 일시</label>
                                <input type="datetime-local" name="start_time" id="examFormStartTime" required class="w-full border rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">종료 일시</label>
                                <input type="datetime-local" name="end_time" id="examFormEndTime" required class="w-full border rounded-lg px-3 py-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <textarea name="description" id="examFormDescription" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('examModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" id="examSubmitBtn" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">생성하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 문제 등록/수정 모달 -->
    <div id="questionModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="questionModalTitle">문제 등록</h3>
                <button onclick="closeModal('questionModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="questionForm" onsubmit="handleSaveQuestion(event)">
                    <input type="hidden" name="question_id" id="questionIdInput" value="">
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">문제 유형</label>
                                <select name="question_type" id="questionType" onchange="toggleOptionsField()" class="w-full border rounded-lg px-3 py-2">
                                    <option value="multiple_choice">객관식</option>
                                    <option value="short_answer">단답형</option>
                                    <option value="essay">서술형</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">난이도</label>
                                <select name="difficulty" class="w-full border rounded-lg px-3 py-2">
                                    <option value="low">하</option>
                                    <option value="medium" selected>중</option>
                                    <option value="high">상</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">NCS 능력단위</label>
                            <select name="ncs_ability_unit" id="ncsAbilityUnitSelect" class="w-full border rounded-lg px-3 py-2">
                                <option value="">선택 안 함</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">질문 내용</label>
                            <textarea name="question_text" id="questionFormText" required rows="3" class="w-full border rounded-lg px-3 py-2" placeholder="문제를 입력하세요"></textarea>
                        </div>
                        
                        <!-- 객관식 보기 영역 -->
                        <div id="optionsArea" class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">보기 (정답에 체크)</label>
                            <div class="flex items-center gap-2">
                                <input type="radio" name="correct_option" value="1" class="text-purple-600">
                                <input type="text" name="option_1" placeholder="보기 1" class="flex-1 border rounded px-3 py-1 text-sm">
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="radio" name="correct_option" value="2" class="text-purple-600">
                                <input type="text" name="option_2" placeholder="보기 2" class="flex-1 border rounded px-3 py-1 text-sm">
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="radio" name="correct_option" value="3" class="text-purple-600">
                                <input type="text" name="option_3" placeholder="보기 3" class="flex-1 border rounded px-3 py-1 text-sm">
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="radio" name="correct_option" value="4" class="text-purple-600">
                                <input type="text" name="option_4" placeholder="보기 4" class="flex-1 border rounded px-3 py-1 text-sm">
                            </div>
                        </div>

                        <!-- 주관식 정답 영역 -->
                        <div id="answerArea" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 mb-1">정답</label>
                            <input type="text" name="correct_answer_text" class="w-full border rounded-lg px-3 py-2" placeholder="정답을 입력하세요">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">해설</label>
                            <textarea name="explanation" rows="2" class="w-full border rounded-lg px-3 py-2" placeholder="문제 풀이 해설을 입력하세요 (선택)"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('questionModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" id="questionSubmitBtn" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];

        document.addEventListener('DOMContentLoaded', () => {
            loadExams();
            loadQuestions();
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') === 'results') switchTab('results');
        });

        function switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tab-' + tabName).classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('content-' + tabName).classList.remove('hidden');
            if (tabName === 'results') loadResults();
        }

        function openExamModal() {
            document.getElementById('examIdInput').value = '';
            document.getElementById('examModalTitle').textContent = '시험 생성';
            document.getElementById('examSubmitBtn').textContent = '생성하기';
            document.getElementById('examForm').reset();
            document.getElementById('examFormTimeLimit').value = '60';
            document.getElementById('examModal').classList.remove('hidden');
        }
        function openEditExam(examId) {
            const exam = examListCache.find(function(e) { return e.id === parseInt(String(examId), 10); });
            if (!exam) return;
            document.getElementById('examIdInput').value = exam.id;
            document.getElementById('examModalTitle').textContent = '시험 수정';
            document.getElementById('examSubmitBtn').textContent = '수정하기';
            document.getElementById('examFormTitle').value = exam.title || '';
            document.getElementById('examFormType').value = exam.type || 'practice';
            document.getElementById('examFormTimeLimit').value = exam.time_limit_minutes != null ? exam.time_limit_minutes : 60;
            document.getElementById('examFormStartTime').value = toDatetimeLocal(exam.start_time);
            document.getElementById('examFormEndTime').value = toDatetimeLocal(exam.end_time);
            document.getElementById('examFormDescription').value = exam.description || '';
            document.getElementById('examModal').classList.remove('hidden');
        }
        async function deleteExam(examId) {
            if (!confirm('이 시험을 삭제할까요? (해당 시험의 모든 문제도 함께 삭제됩니다.)')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`/api/cbt/exams/\${examId}\`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                if (json.success) { loadExams(); } else { alert('삭제 실패: ' + (json.error || '알 수 없음')); }
            } catch (e) {
                console.error(e);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function openQuestionModal() {
            document.getElementById('questionIdInput').value = '';
            document.getElementById('questionModalTitle').textContent = '문제 등록';
            document.getElementById('questionSubmitBtn').textContent = '등록하기';
            document.getElementById('questionForm').reset();
            toggleOptionsField();
            document.getElementById('questionModal').classList.remove('hidden');
            const selectEl = document.getElementById('ncsAbilityUnitSelect');
            if (selectEl) {
                selectEl.innerHTML = '<option value="">선택 안 함</option>';
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(\`/api/cbt/course-ability-units?course_id=\${courseId}\`, { headers: { 'Authorization': 'Bearer ' + token } });
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data)) {
                        json.data.forEach(function(u) {
                            const opt = document.createElement('option');
                            opt.value = (u.code || '') + '::' + (u.name || '');
                            opt.textContent = (u.name || u.code || '');
                            selectEl.appendChild(opt);
                        });
                    }
                } catch (e) { console.error('NCS 능력단위 목록 로드 실패:', e); }
            }
        }
        function openEditQuestion(questionId) {
            const q = allQuestions.find(function(x) { return x.id === parseInt(String(questionId), 10); });
            if (!q) return;
            document.getElementById('questionIdInput').value = q.id;
            document.getElementById('questionModalTitle').textContent = '문제 수정';
            document.getElementById('questionSubmitBtn').textContent = '수정하기';
            document.getElementById('questionType').value = q.question_type || 'multiple_choice';
            document.querySelector('select[name="difficulty"]').value = q.difficulty || 'medium';
            document.getElementById('questionFormText').value = q.question_text || '';
            if (q.question_type === 'multiple_choice') {
                const opts = (function() { try { return JSON.parse(q.options || '[]'); } catch (_) { return []; } })();
                document.querySelector('input[name="option_1"]').value = opts[0] || '';
                document.querySelector('input[name="option_2"]').value = opts[1] || '';
                document.querySelector('input[name="option_3"]').value = opts[2] || '';
                document.querySelector('input[name="option_4"]').value = opts[3] || '';
                const correctNum = parseInt(String(q.correct_answer), 10);
                const radio = document.querySelector('input[name="correct_option"][value="' + (isNaN(correctNum) ? '1' : Math.max(1, Math.min(4, correctNum))) + '"]');
                if (radio) radio.checked = true;
            } else {
                document.querySelector('input[name="correct_answer_text"]').value = q.correct_answer || '';
            }
            toggleOptionsField();
            const ncsSelect = document.getElementById('ncsAbilityUnitSelect');
            if (ncsSelect) {
                ncsSelect.innerHTML = '<option value="">선택 안 함</option>';
                const ncsVal = (q.ncs_ability_unit_code || '') + '::' + (q.ncs_ability_unit_name || '');
                if (q.ncs_ability_unit_name || q.ncs_ability_unit_code) {
                    const opt = document.createElement('option');
                    opt.value = ncsVal.trim() ? ncsVal : '';
                    opt.textContent = q.ncs_ability_unit_name || q.ncs_ability_unit_code || '';
                    opt.selected = true;
                    ncsSelect.appendChild(opt);
                }
                const otherOpts = [...new Set(allQuestions.map(function(x) { return (x.ncs_ability_unit_name || ''); }).filter(Boolean))].filter(function(n) { return n !== (q.ncs_ability_unit_name || ''); }).sort();
                otherOpts.forEach(function(n) {
                    const o = document.createElement('option');
                    o.textContent = n;
                    o.value = n;
                    ncsSelect.appendChild(o);
                });
            }
            document.getElementById('questionModal').classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        function toggleOptionsField() {
            const type = document.getElementById('questionType').value;
            if (type === 'multiple_choice') {
                document.getElementById('optionsArea').classList.remove('hidden');
                document.getElementById('answerArea').classList.add('hidden');
            } else {
                document.getElementById('optionsArea').classList.add('hidden');
                document.getElementById('answerArea').classList.remove('hidden');
            }
        }



        let examListCache = [];
        function toDatetimeLocal(val) {
            if (!val) return '';
            const d = new Date(val);
            const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
            const h = String(d.getHours()).padStart(2, '0'), min = String(d.getMinutes()).padStart(2, '0');
            return y + '-' + m + '-' + day + 'T' + h + ':' + min;
        }
        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/cbt/exams?course_id=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                examListCache = (result.success && Array.isArray(result.data)) ? result.data : [];
                const tbody = document.getElementById('examListBody');
                if (examListCache.length > 0) {
                    tbody.innerHTML = examListCache.map(exam => \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">\${exam.title}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${getExamTypeName(exam.type)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                \${new Date(exam.start_time).toLocaleString()} ~ <br>
                                \${new Date(exam.end_time).toLocaleString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">\${exam.time_limit_minutes}분</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span class="px-2 py-1 text-xs rounded-full \${exam.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                    \${exam.is_active ? '진행중' : '마감/대기'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button type="button" onclick="openEditExam(\${exam.id})" class="text-blue-600 hover:text-blue-900 mr-3">수정</button>
                                <button type="button" onclick="deleteExam(\${exam.id})" class="text-red-600 hover:text-red-900">삭제</button>
                            </td>
                        </tr>
                    \`).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 시험이 없습니다.</td></tr>';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        let allQuestions = [];
        function applyQuestionFilters() {
            const typeVal = (document.getElementById('questionTypeFilter') || {}).value || '';
            const diffVal = (document.getElementById('difficultyFilter') || {}).value || '';
            const ncsVal = (document.getElementById('ncsUnitFilter') || {}).value || '';
            const filtered = allQuestions.filter(q => {
                if (typeVal && q.question_type !== typeVal) return false;
                if (diffVal && q.difficulty !== diffVal) return false;
                if (ncsVal && (q.ncs_ability_unit_name || '') !== ncsVal) return false;
                return true;
            });
            renderQuestionList(filtered);
        }
        function renderQuestionList(questions) {
            const list = document.getElementById('questionList');
            if (!list) return;
            if (questions.length === 0) {
                list.innerHTML = '<div class="text-center py-12 text-gray-500">조건에 맞는 문제가 없습니다.</div>';
                return;
            }
            list.innerHTML = questions.map(q => \`
                <div class="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition bento-card" data-question-id="\${q.id}">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex gap-2 flex-wrap">
                            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">\${getQuestionTypeName(q.question_type)}</span>
                            \${(q.difficulty && getDifficultyName(q.difficulty)) ? \`<span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">\${getDifficultyName(q.difficulty)}</span>\` : ''}
                            \${(q.ncs_ability_unit_name && String(q.ncs_ability_unit_name) !== 'undefined') ? \`<span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded" title="NCS 능력단위">\${escapeHtml(q.ncs_ability_unit_name)}</span>\` : ''}
                        </div>
                        <div class="flex gap-1">
                            <button type="button" onclick="openEditQuestion(\${q.id})" class="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50" title="수정"><i class="fas fa-pen text-sm"></i></button>
                            <button type="button" onclick="deleteQuestion(\${q.id})" class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="삭제"><i class="fas fa-trash text-sm"></i></button>
                        </div>
                    </div>
                    <p class="text-gray-800 font-medium mb-2">\${escapeHtml(q.question_text)}</p>
                    \${renderQuestionContent(q)}
                </div>
            \`).join('');
        }
        function escapeHtml(s) {
            if (s == null) return '';
            const div = document.createElement('div');
            div.textContent = s;
            return div.innerHTML;
        }
        async function loadQuestions() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/cbt/questions?course_id=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                allQuestions = (result.success && result.data) ? result.data : [];
                const ncsSelect = document.getElementById('ncsUnitFilter');
                if (ncsSelect) {
                    const opts = [...new Set(allQuestions.map(q => q.ncs_ability_unit_name).filter(Boolean))].filter(n => String(n) !== 'undefined').sort();
                    ncsSelect.innerHTML = '<option value="">전체 NCS 능력단위</option>' + opts.map(n => \`<option value="\${escapeHtml(n)}">\${escapeHtml(n)}</option>\`).join('');
                }
                applyQuestionFilters();
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('questionList').innerHTML = '<div class="text-center py-12 text-red-500">문제 목록을 불러오지 못했습니다.</div>';
            }
        }
        async function deleteQuestion(id) {
            if (!confirm('이 문제를 삭제할까요?')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`/api/cbt/questions/\${id}\`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                if (json.success) { loadQuestions(); } else { alert('삭제 실패: ' + (json.error || '알 수 없음')); }
            } catch (e) {
                console.error(e);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function loadResults() {
            const tbody = document.getElementById('resultsSummaryBody');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">불러오는 중...</td></tr>';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`/api/cbt/results?course_id=\${courseId}\`, { headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                const exams = (json.success && json.data && json.data.exams) ? json.data.exams : [];
                if (!exams.length) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 시험이 없습니다.</td></tr>';
                    return;
                }
                const typeNames = { midterm: '중간', final: '기말', mock: '모의', practice: '연습' };
                tbody.innerHTML = exams.map(e => \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 font-medium text-gray-900">\${e.title || '-'}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">\${typeNames[e.type] || e.type}</td>
                        <td class="px-6 py-4 text-center text-sm text-gray-600">\${e.submission_count}명</td>
                        <td class="px-6 py-4 text-center text-sm text-gray-600">\${e.submission_count ? (e.avg_score != null ? e.avg_score + '점' : '-') : '-'}</td>
                        <td class="px-6 py-4 text-center text-sm text-gray-500">\${e.max_score}점</td>
                        <td class="px-6 py-4 text-right">
                            <button type="button" onclick="openResultsDetail(\${e.id})" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">상세</button>
                        </td>
                    </tr>
                \`).join('');
            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-red-500">결과를 불러오지 못했습니다.</td></tr>';
            }
        }
        function openResultsDetail(examId) {
            document.getElementById('resultsDetailSection').classList.remove('hidden');
            loadResultsDetail(examId);
        }
        async function loadResultsDetail(examId) {
            const titleEl = document.getElementById('resultsDetailTitle');
            const subTbody = document.getElementById('resultsDetailSubmissions');
            const statTbody = document.getElementById('resultsDetailQuestionStats');
            if (!subTbody || !statTbody) return;
            subTbody.innerHTML = '<tr><td colspan="3" class="px-3 py-4 text-center text-gray-500">불러오는 중...</td></tr>';
            statTbody.innerHTML = '';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`/api/cbt/exams/\${examId}/results\`, { headers: { 'Authorization': 'Bearer ' + token } });
                const json = await res.json();
                if (!json.success || !json.data) {
                    subTbody.innerHTML = '<tr><td colspan="3" class="px-3 py-4 text-center text-red-500">데이터를 불러오지 못했습니다.</td></tr>';
                    return;
                }
                const d = json.data;
                if (titleEl) titleEl.textContent = (d.exam && d.exam.title) ? d.exam.title + ' 상세' : '시험 상세';
                const subs = d.submissions || [];
                if (!subs.length) {
                    subTbody.innerHTML = '<tr><td colspan="3" class="px-3 py-4 text-center text-gray-500">제출된 답안이 없습니다.</td></tr>';
                } else {
                    subTbody.innerHTML = subs.map(s => \`
                        <tr class="border-t border-gray-100">
                            <td class="px-3 py-2">\${s.student_name || '이름 없음'}</td>
                            <td class="px-3 py-2 text-right">\${s.total_score != null ? s.total_score + '점' : '-'}</td>
                            <td class="px-3 py-2 text-right text-gray-500">\${s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '-'}</td>
                        </tr>
                    \`).join('');
                }
                const stats = d.question_stats || [];
                if (!stats.length) {
                    statTbody.innerHTML = '<tr><td colspan="4" class="px-3 py-4 text-center text-gray-500">문제가 없습니다.</td></tr>';
                } else {
                    statTbody.innerHTML = stats.map((q, i) => \`
                        <tr class="border-t border-gray-100">
                            <td class="px-3 py-2 text-gray-500">\${q.order_index != null ? q.order_index + 1 : i + 1}</td>
                            <td class="px-3 py-2 max-w-xs truncate">\${q.question_text || '-'}</td>
                            <td class="px-3 py-2 text-center">\${q.correct_count}/\${q.total_answered}</td>
                            <td class="px-3 py-2 text-center">\${q.correct_rate != null ? q.correct_rate + '%' : '-'}</td>
                        </tr>
                    \`).join('');
                }
            } catch (e) {
                console.error(e);
                subTbody.innerHTML = '<tr><td colspan="3" class="px-3 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }
        function closeResultsDetail() {
            document.getElementById('resultsDetailSection').classList.add('hidden');
        }

        function getExamTypeName(type) {
            const types = { midterm: '중간평가', final: '기말평가', mock: '모의고사', practice: '연습문제' };
            return types[type] || type;
        }

        function getQuestionTypeName(type) {
            const types = { multiple_choice: '객관식', short_answer: '단답형', essay: '서술형' };
            return types[type] || type;
        }

        function getDifficultyName(diff) {
            if (diff == null || diff === '') return '';
            const diffs = { low: '하', medium: '중', high: '상' };
            return diffs[diff] || String(diff);
        }

        function renderQuestionContent(q) {
            if (q.question_type === 'multiple_choice') {
                const options = JSON.parse(q.options || '[]');
                return \`
                    <ul class="space-y-1 text-sm text-gray-600 ml-4 list-decimal">
                        \${options.map((opt, i) => \`<li class="\${(i+1) == q.correct_answer ? 'text-green-600 font-bold' : ''}">\${opt}</li>\`).join('')}
                    </ul>
                \`;
            } else {
                return \`<p class="text-sm text-green-600 mt-2">정답: \${q.correct_answer}</p>\`;
            }
        }

        async function handleSaveExam(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const examId = (document.getElementById('examIdInput') || {}).value;
            const isEdit = examId && String(examId).trim() !== '';

            data.course_id = courseId;
            data.is_active = 1;

            try {
                const token = localStorage.getItem('token');
                const url = isEdit ? \`/api/cbt/exams/\${examId}\` : '/api/cbt/exams';
                const method = isEdit ? 'PUT' : 'POST';
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
                    alert(isEdit ? '시험이 수정되었습니다.' : '시험이 생성되었습니다.');
                    closeModal('examModal');
                    document.getElementById('examIdInput').value = '';
                    document.getElementById('examModalTitle').textContent = '시험 생성';
                    document.getElementById('examSubmitBtn').textContent = '생성하기';
                    loadExams();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function handleSaveQuestion(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const type = formData.get('question_type');
            const questionId = (document.getElementById('questionIdInput') || {}).value;
            const isEdit = questionId && String(questionId).trim() !== '';

            let data = {
                question_text: formData.get('question_text'),
                question_type: type,
                points: 1
            };
            if (type === 'multiple_choice') {
                const options = [
                    formData.get('option_1'),
                    formData.get('option_2'),
                    formData.get('option_3'),
                    formData.get('option_4')
                ];
                data.options = options;
                data.correct_answer = formData.get('correct_option');
            } else {
                data.correct_answer = formData.get('correct_answer_text');
            }

            if (!isEdit) {
                const ncsVal = formData.get('ncs_ability_unit');
                let ncsCode = '', ncsName = '';
                if (ncsVal && String(ncsVal).includes('::')) {
                    const parts = String(ncsVal).split('::');
                    ncsCode = (parts[0] || '').trim();
                    ncsName = (parts[1] || '').trim();
                }
                data.course_id = courseId;
                data.difficulty = formData.get('difficulty');
                data.explanation = formData.get('explanation');
                data.category = 'general';
                data.ncs_ability_unit_code = ncsCode || undefined;
                data.ncs_ability_unit_name = ncsName || undefined;
            }

            try {
                const token = localStorage.getItem('token');
                const url = isEdit ? \`/api/cbt/questions/\${questionId}\` : '/api/cbt/questions';
                const method = isEdit ? 'PATCH' : 'POST';
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
                    alert(isEdit ? '문제가 수정되었습니다.' : '문제가 등록되었습니다.');
                    closeModal('questionModal');
                    document.getElementById('questionIdInput').value = '';
                    document.getElementById('questionModalTitle').textContent = '문제 등록';
                    document.getElementById('questionSubmitBtn').textContent = '등록하기';
                    loadQuestions();
                    e.target.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        function handlePdfUpload(input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                alert(\`PDF 파일 '\${file.name}'을 분석하여 문제를 생성합니다.\\n(현재는 데모 기능으로 실제 분석은 수행되지 않습니다.)\`);
                // TODO: 실제 파일 업로드 및 AI 분석 API 호출
                // const formData = new FormData();
                // formData.append('file', file);
                // fetch('/api/cbt/ai-generate', { method: 'POST', body: formData }) ...
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
