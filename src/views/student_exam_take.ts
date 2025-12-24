
export const studentExamTakeHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 응시 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
        .omr-check:checked + div {
            background-color: #4a90e2;
            color: white;
            border-color: #4a90e2;
        }
    </style>
</head>
<body class="bg-gray-100 h-screen flex flex-col overflow-hidden">
    <!-- 헤더 (타이머) -->
    <header class="bg-gray-900 text-white shadow-md z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <h1 class="text-lg font-bold" id="examTitle">시험명 로딩중...</h1>
                <span class="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300" id="examType">유형</span>
            </div>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-2 text-xl font-mono font-bold text-yellow-400">
                    <i class="far fa-clock"></i>
                    <span id="timer">00:00:00</span>
                </div>
                <button onclick="submitExam()" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-bold transition">
                    제출하기
                </button>
            </div>
        </div>
    </header>

    <!-- 메인 컨텐츠 (좌: 문제, 우: OMR) -->
    <div class="flex-1 flex overflow-hidden">
        <!-- 문제 영역 -->
        <div class="flex-1 overflow-y-auto p-8" id="questionArea">
            <div class="max-w-4xl mx-auto space-y-8" id="questionList">
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
                    <p>시험 문제를 불러오고 있습니다...</p>
                </div>
            </div>
        </div>

        <!-- OMR 답안지 (우측 사이드바) -->
        <div class="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
            <div class="p-4 border-b border-gray-200 bg-gray-50">
                <h2 class="font-bold text-gray-800 flex items-center">
                    <i class="fas fa-list-ol mr-2 text-gray-500"></i> 답안지
                </h2>
                <div class="text-xs text-gray-500 mt-1">
                    총 <span id="totalQuestions">0</span>문항 / <span id="answeredCount">0</span>문항 작성
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
                <div class="grid grid-cols-5 gap-2" id="omrGrid">
                    <!-- OMR 번호 버튼들이 여기에 생성됨 -->
                </div>
            </div>
        </div>
    </div>

    <script>
        const examId = window.location.pathname.split('/')[2]; // /exams/:id/take
        let questions = [];
        let answers = {};
        let timeRemaining = 0;
        let timerInterval;

        document.addEventListener('DOMContentLoaded', () => {
            loadExamData();
            
            // 페이지 이탈 방지
            window.onbeforeunload = function() {
                return "시험이 진행 중입니다. 페이지를 벗어나면 시험이 종료될 수 있습니다.";
            };
        });

        async function loadExamData() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}/take\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const { exam, questions: examQuestions } = result.data;
                    questions = examQuestions;
                    
                    // 시험 정보 설정
                    document.getElementById('examTitle').textContent = exam.title;
                    document.getElementById('examType').textContent = exam.type;
                    document.getElementById('totalQuestions').textContent = questions.length;
                    
                    // 타이머 설정
                    const endTime = new Date(exam.end_time).getTime();
                    const now = new Date().getTime();
                    const limitMs = exam.time_limit_minutes * 60 * 1000;
                    
                    // 남은 시간 계산 (종료 시간과 제한 시간 중 더 이른 것 기준)
                    // 실제로는 서버 시간 기준으로 계산해야 안전함
                    timeRemaining = Math.min(endTime - now, limitMs) / 1000;
                    startTimer();

                    renderQuestions();
                    renderOmr();
                } else {
                    alert('시험 정보를 불러올 수 없습니다: ' + result.error);
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다.');
            }
        }

        function startTimer() {
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();
                
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert('시험 시간이 종료되었습니다. 답안을 자동으로 제출합니다.');
                    submitExam(true);
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            if (timeRemaining < 0) timeRemaining = 0;
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = Math.floor(timeRemaining % 60);
            
            document.getElementById('timer').textContent = 
                \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
            
            if (timeRemaining < 300) { // 5분 미만
                document.getElementById('timer').classList.replace('text-yellow-400', 'text-red-500');
                document.getElementById('timer').classList.add('animate-pulse');
            }
        }

        function renderQuestions() {
            const container = document.getElementById('questionList');
            container.innerHTML = questions.map((q, index) => \`
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="q-\${index}">
                    <div class="flex gap-3 mb-4">
                        <span class="flex-shrink-0 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">\${index + 1}</span>
                        <div class="flex-1">
                            <div class="text-lg font-medium text-gray-900 mb-4">\${q.question_text}</div>
                            \${renderQuestionInput(q, index)}
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function renderQuestionInput(q, index) {
            if (q.question_type === 'multiple_choice') {
                const options = JSON.parse(q.options || '[]');
                return \`
                    <div class="space-y-3">
                        \${options.map((opt, i) => \`
                            <label class="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                <input type="radio" name="q_\${q.id}" value="\${i + 1}" class="mt-1 mr-3 text-primary-600 focus:ring-primary-500" onchange="handleAnswer(\${index}, \${q.id}, this.value)">
                                <span class="text-gray-700">\${opt}</span>
                            </label>
                        \`).join('')}
                    </div>
                \`;
            } else if (q.question_type === 'short_answer') {
                return \`
                    <input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="정답을 입력하세요" onchange="handleAnswer(\${index}, \${q.id}, this.value)">
                \`;
            } else {
                return \`
                    <textarea rows="5" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="서술형 답안을 입력하세요" onchange="handleAnswer(\${index}, \${q.id}, this.value)"></textarea>
                \`;
            }
        }

        function renderOmr() {
            const grid = document.getElementById('omrGrid');
            grid.innerHTML = questions.map((q, index) => \`
                <button onclick="scrollToQuestion(\${index})" id="omr-\${index}" class="w-full aspect-square flex items-center justify-center rounded border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-100 transition">
                    \${index + 1}
                </button>
            \`).join('');
        }

        function handleAnswer(index, questionId, value) {
            answers[questionId] = value;
            
            // OMR 업데이트
            const omrBtn = document.getElementById(\`omr-\${index}\`);
            if (value && value.trim() !== '') {
                omrBtn.classList.add('bg-primary-600', 'text-white', 'border-primary-600');
                omrBtn.classList.remove('text-gray-500', 'hover:bg-gray-100');
            } else {
                omrBtn.classList.remove('bg-primary-600', 'text-white', 'border-primary-600');
                omrBtn.classList.add('text-gray-500', 'hover:bg-gray-100');
            }

            // 진행률 업데이트
            const answeredCount = Object.keys(answers).length;
            document.getElementById('answeredCount').textContent = answeredCount;
        }

        function scrollToQuestion(index) {
            const el = document.getElementById(\`q-\${index}\`);
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        async function submitExam(force = false) {
            if (!force && !confirm('답안을 제출하시겠습니까?\\n제출 후에는 수정할 수 없습니다.')) {
                return;
            }

            // 페이지 이탈 경고 해제
            window.onbeforeunload = null;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}/submit\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ answers })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('시험이 제출되었습니다. 수고하셨습니다!');
                    window.location.href = '/dashboard'; // 또는 결과 페이지
                } else {
                    alert('제출 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('제출 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
