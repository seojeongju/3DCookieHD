import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsCbtHtml = `
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
        ${hrdSidebar('courses')}
        
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
                    <select id="questionTypeFilter" class="border rounded-lg px-3 py-2 text-sm">
                        <option value="">전체 유형</option>
                        <option value="multiple_choice">객관식</option>
                        <option value="short_answer">단답형</option>
                        <option value="essay">서술형</option>
                    </select>
                    <select id="difficultyFilter" class="border rounded-lg px-3 py-2 text-sm">
                        <option value="">전체 난이도</option>
                        <option value="high">상</option>
                        <option value="medium">중</option>
                        <option value="low">하</option>
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
            <div class="bg-white rounded-lg shadow p-8 text-center">
                <i class="fas fa-chart-pie text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">아직 진행된 시험이 없습니다.</p>
            </div>
        </div>
    </div>

    <!-- 시험 생성 모달 -->
    <div id="examModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">시험 생성</h3>
                <button onclick="closeModal('examModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="examForm" onsubmit="handleSaveExam(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">시험명</label>
                            <input type="text" name="title" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 유형</label>
                                <select name="type" class="w-full border rounded-lg px-3 py-2">
                                    <option value="midterm">중간평가</option>
                                    <option value="final">기말평가</option>
                                    <option value="mock">모의고사</option>
                                    <option value="practice">연습문제</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">제한 시간 (분)</label>
                                <input type="number" name="time_limit_minutes" value="60" class="w-full border rounded-lg px-3 py-2">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">시작 일시</label>
                                <input type="datetime-local" name="start_time" required class="w-full border rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">종료 일시</label>
                                <input type="datetime-local" name="end_time" required class="w-full border rounded-lg px-3 py-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <textarea name="description" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('examModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">생성하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 문제 등록 모달 -->
    <div id="questionModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">문제 등록</h3>
                <button onclick="closeModal('questionModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="questionForm" onsubmit="handleSaveQuestion(event)">
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">질문 내용</label>
                            <textarea name="question_text" required rows="3" class="w-full border rounded-lg px-3 py-2" placeholder="문제를 입력하세요"></textarea>
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
                        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">등록하기</button>
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
        });

        function switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tab-' + tabName).classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('content-' + tabName).classList.remove('hidden');
        }

        function openExamModal() {
            document.getElementById('examModal').classList.remove('hidden');
        }

        function openQuestionModal() {
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



        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/cbt/exams?course_id=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('examListBody');
                if (result.success && result.data.length > 0) {
                    tbody.innerHTML = result.data.map(exam => \`
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
                                <button class="text-blue-600 hover:text-blue-900 mr-3">수정</button>
                                <button class="text-red-600 hover:text-red-900">삭제</button>
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

        async function loadQuestions() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/cbt/questions?course_id=\${courseId}\`, { // 실제로는 category 등으로 필터링
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const list = document.getElementById('questionList');
                if (result.success && result.data.length > 0) {
                    list.innerHTML = result.data.map(q => \`
                        <div class="bg-white border rounded-lg p-4 hover:shadow-md transition">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex gap-2">
                                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">\${getQuestionTypeName(q.question_type)}</span>
                                    <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">\${getDifficultyName(q.difficulty)}</span>
                                </div>
                                <button class="text-gray-400 hover:text-red-500"><i class="fas fa-trash"></i></button>
                            </div>
                            <p class="text-gray-800 font-medium mb-2">\${q.question_text}</p>
                            \${renderQuestionContent(q)}
                        </div>
                    \`).join('');
                } else {
                    list.innerHTML = '<div class="text-center py-12 text-gray-500">등록된 문제가 없습니다.</div>';
                }
            } catch (error) {
                console.error('Error:', error);
            }
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
            const diffs = { low: '하', medium: '중', high: '상' };
            return diffs[diff] || diff;
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
            data.course_id = courseId;
            data.is_active = 1; // 기본 활성화

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/cbt/exams', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('시험이 생성되었습니다.');
                    closeModal('examModal');
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
            
            let data = {
                question_text: formData.get('question_text'),
                question_type: type,
                difficulty: formData.get('difficulty'),
                explanation: formData.get('explanation'),
                category: 'general' // 임시 카테고리
            };

            if (type === 'multiple_choice') {
                const options = [
                    formData.get('option_1'),
                    formData.get('option_2'),
                    formData.get('option_3'),
                    formData.get('option_4')
                ];
                data.options = JSON.stringify(options);
                data.correct_answer = formData.get('correct_option');
            } else {
                data.correct_answer = formData.get('correct_answer_text');
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/cbt/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('문제가 등록되었습니다.');
                    closeModal('questionModal');
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
