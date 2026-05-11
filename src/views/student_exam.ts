export const studentExamHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 응시 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .option-label {
            cursor: pointer;
            transition: all 0.2s;
        }
        .option-input:checked + .option-label {
            background-color: #eff6ff;
            border-color: #3b82f6;
            color: #1d4ed8;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans select-none">
    <div class="min-h-screen flex flex-col">
        <!-- 헤더 -->
        <header class="bg-white shadow-sm sticky top-0 z-10">
            <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 id="examTitle" class="text-xl font-bold text-gray-800">시험 로딩 중...</h1>
                <div class="flex items-center space-x-4">
                    <div class="text-red-600 font-bold flex items-center bg-red-50 px-3 py-1 rounded-full">
                        <i class="fas fa-clock mr-2"></i>
                        <span id="timer">00:00</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
            <div id="examInfo" class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <p id="examDescription" class="text-gray-600 mb-4"></p>
                <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-list-ol mr-1"></i> 총 <span id="questionCount">0</span>문제</span>
                    <span><i class="fas fa-hourglass-half mr-1"></i> 제한시간 <span id="timeLimit">0</span>분</span>
                </div>
            </div>

            <form id="examForm" onsubmit="submitExam(event)">
                <div id="questionsList" class="space-y-6">
                    <!-- 문제 로드됨 -->
                </div>

                <div class="mt-8 flex justify-center">
                    <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg shadow-lg transform transition hover:-translate-y-1">
                        제출하기
                    </button>
                </div>
            </form>
        </main>
    </div>

    <script>
        const examId = window.location.pathname.split('/')[3]; // /student/exam/:id
        let timeLeft = 0;
        let timerInterval;

        document.addEventListener('DOMContentLoaded', async () => {
            checkLogin();
            await loadExam();
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
        }

        async function loadExam() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams/' + examId + '/take', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exam = await response.json();

                if (exam.error) {
                    alert('시험을 불러올 수 없습니다: ' + exam.error);
                    window.location.href = '/';
                    return;
                }

                // 정보 표시
                document.getElementById('examTitle').textContent = exam.title;
                document.getElementById('examDescription').textContent = exam.description;
                document.getElementById('questionCount').textContent = exam.questions.length;
                document.getElementById('timeLimit').textContent = exam.time_limit;

                // 타이머 설정
                timeLeft = exam.time_limit * 60;
                startTimer();

                // 문제 렌더링
                const container = document.getElementById('questionsList');
                exam.questions.forEach((q, index) => {
                    let inputHtml = '';
                    
                    if (q.question_type === 'multiple_choice') {
                        inputHtml = \`
                            <div class="space-y-3 ml-11">
                                \${q.options.map((opt, i) => \`
                                    <div class="relative">
                                        <input type="radio" name="q_\${q.id}" id="q_\${q.id}_\${i+1}" value="\${i+1}" class="option-input peer sr-only">
                                        <label for="q_\${q.id}_\${i+1}" class="option-label block w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                                            <span class="font-medium text-gray-700 mr-2">\${i+1}.</span> \${opt}
                                        </label>
                                    </div>
                                \`).join('')}
                            </div>
                        \`;
                    } else if (q.question_type === 'short_answer') {
                        inputHtml = \`
                            <div class="ml-11 mt-2">
                                <input type="text" name="q_\${q.id}" placeholder="정답을 입력하세요" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <p class="text-xs text-gray-500 mt-2"><i class="fas fa-info-circle"></i> 단답형 문제입니다. 정확한 답을 입력해주세요.</p>
                            </div>
                        \`;
                    } else if (q.question_type === 'essay') {
                        inputHtml = \`
                            <div class="ml-11 mt-2">
                                <textarea name="q_\${q.id}" rows="5" placeholder="답안을 서술하세요..." 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                <p class="text-xs text-gray-500 mt-2"><i class="fas fa-info-circle"></i> 서술형 문제입니다.</p>
                            </div>
                        \`;
                    }

                    const qHtml = \`
                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div class="flex items-start mb-4">
                                <span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">\${index + 1}</span>
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">\${q.question_text}</h3>
                                    <p class="text-sm text-gray-500 mt-1">배점: \${q.points}점</p>
                                </div>
                            </div>
                            \${inputHtml}
                        </div>
                    \`;
                    container.insertAdjacentHTML('beforeend', qHtml);
                });

            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        function startTimer() {
            const timerDisplay = document.getElementById('timer');
            
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('제한시간이 종료되었습니다. 답안을 제출합니다.');
                    submitExam(new Event('submit'));
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = 
                \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
            
            if (timeLeft < 300) { // 5분 미만
                document.getElementById('timer').parentElement.classList.add('animate-pulse');
            }
        }

        async function submitExam(e) {
            e.preventDefault();
            
            if (!confirm('정말 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) return;

            clearInterval(timerInterval);

            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('로그인 정보가 없습니다.');
                return;
            }
            const user = JSON.parse(userStr);

            // 답안 수집
            const answers = {};
            
            // Radio buttons (Multiple Choice)
            const radioInputs = document.querySelectorAll('input[type="radio"][name^="q_"]');
            radioInputs.forEach(input => {
                if (input.checked) {
                    const qId = input.name.replace('q_', '');
                    answers[qId] = input.value;
                }
            });

            // Text inputs (Short Answer) & Textareas (Essay)
            const textInputs = document.querySelectorAll('input[type="text"][name^="q_"], textarea[name^="q_"]');
            textInputs.forEach(input => {
                const qId = input.name.replace('q_', '');
                answers[qId] = input.value;
            });

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams/' + examId + '/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        student_id: user.id,
                        answers: answers
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert(\`시험이 종료되었습니다.\\n점수: \${result.score} / \${result.totalPoints}\`);
                    window.location.href = '/'; 
                } else {
                    alert('제출 실패: ' + result.error);
                }
            } catch (error) {
                console.error(error);
                alert('제출 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
