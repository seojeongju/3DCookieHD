/**
 * 통합 사전평가 응시 페이지 (과정별 여러 시험을 한 번에 응시)
 * GET /student/pre-assessment/take?course_id=XXX
 */
export const studentPreAssessmentTakeHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사전평가 응시 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .option-label { cursor: pointer; transition: all 0.2s; }
        .option-input:checked + .option-label { background-color: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
    </style>
</head>
<body class="bg-gray-50 font-sans select-none">
    <div class="min-h-screen flex flex-col">
        <header class="bg-white shadow-sm sticky top-0 z-10">
            <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 id="examTitle" class="text-xl font-bold text-gray-800">사전평가 로딩 중...</h1>
                <div class="flex items-center space-x-4">
                    <div class="text-red-600 font-bold flex items-center bg-red-50 px-3 py-1 rounded-full">
                        <i class="fas fa-clock mr-2"></i>
                        <span id="timer">00:00</span>
                    </div>
                </div>
            </div>
        </header>

        <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
            <div id="examInfo" class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <p id="examDescription" class="text-gray-600 mb-4"></p>
                <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-4"><i class="fas fa-list-ol mr-1"></i> 총 <span id="questionCount">0</span>문항</span>
                    <span><i class="fas fa-hourglass-half mr-1"></i> 제한시간 <span id="timeLimit">0</span>분</span>
                </div>
            </div>

            <form id="examForm" onsubmit="submitExam(event)">
                <div id="questionsList" class="space-y-6"></div>
                <div class="mt-8 flex justify-center">
                    <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg shadow-lg transform transition hover:-translate-y-1">
                        제출하기
                    </button>
                </div>
            </form>
        </main>
    </div>

    <script>
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('course_id');
        let examData = null;
        let questionToExam = {};
        let timeLeft = 0;
        let timerInterval;

        document.addEventListener('DOMContentLoaded', function() {
            checkLogin();
            if (courseId) loadCombinedExam(); else showError('course_id가 없습니다.');
        });

        function checkLogin() {
            if (!localStorage.getItem('token')) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
            }
        }

        function showError(msg) {
            document.getElementById('examTitle').textContent = '오류';
            document.getElementById('questionsList').innerHTML = '<div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">' + msg + '</div>';
        }

        async function loadCombinedExam() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/exams/student/pre-assessment-combined?course_id=' + encodeURIComponent(courseId), {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                const data = json.success && json.data ? json.data : json;
                if (!data || !data.exams || data.exams.length === 0) {
                    showError('진행 중인 사전평가가 없거나 접근 권한이 없습니다.');
                    return;
                }
                examData = data;
                const allQuestions = [];
                data.exams.forEach(function(exam) {
                    (exam.questions || []).forEach(function(q) {
                        allQuestions.push({ examId: exam.id, examTitle: exam.title, question: q });
                        questionToExam[q.id] = exam.id;
                    });
                });
                if (allQuestions.length === 0) {
                    showError('출제된 문항이 없습니다.');
                    return;
                }
                const totalMinutes = data.exams.reduce(function(sum, e) { return sum + (e.time_limit_minutes || e.time_limit || 0); }, 0);
                document.getElementById('examTitle').textContent = '사전평가 - ' + (data.course_title || '');
                document.getElementById('examDescription').textContent = '이 과정의 사전평가 ' + data.exams.length + '개 시험을 한 번에 응시합니다.';
                document.getElementById('questionCount').textContent = allQuestions.length;
                document.getElementById('timeLimit').textContent = totalMinutes || 60;
                timeLeft = (totalMinutes || 60) * 60;
                startTimer();

                const container = document.getElementById('questionsList');
                let globalIndex = 0;
                data.exams.forEach(function(exam) {
                    if (!exam.questions || exam.questions.length === 0) return;
                    var sectionHtml = '<div class="border-t border-slate-200 pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0"><h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">' + (exam.title || '').replace(/</g, '&lt;') + '</h3></div>';
                    container.insertAdjacentHTML('beforeend', sectionHtml);
                    var wrap = container.lastElementChild;
                    exam.questions.forEach(function(q) {
                        globalIndex++;
                        var inputHtml = '';
                        if (q.question_type === 'multiple_choice') {
                            var opts = q.options && Array.isArray(q.options) ? q.options : [];
                            inputHtml = '<div class="space-y-3 ml-11">' + opts.map(function(opt, i) {
                                return '<div class="relative"><input type="radio" name="q_' + q.id + '" id="q_' + q.id + '_' + (i+1) + '" value="' + (i+1) + '" class="option-input peer sr-only"><label for="q_' + q.id + '_' + (i+1) + '" class="option-label block w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"><span class="font-medium text-gray-700 mr-2">' + (i+1) + '.</span> ' + (opt + '').replace(/</g, '&lt;') + '</label></div>';
                            }).join('') + '</div>';
                        } else if (q.question_type === 'short_answer') {
                            inputHtml = '<div class="ml-11 mt-2"><input type="text" name="q_' + q.id + '" placeholder="정답을 입력하세요" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div>';
                        } else if (q.question_type === 'essay') {
                            inputHtml = '<div class="ml-11 mt-2"><textarea name="q_' + q.id + '" rows="5" placeholder="답안을 서술하세요..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea></div>';
                        } else {
                            inputHtml = '<div class="ml-11 mt-2"><input type="text" name="q_' + q.id + '" placeholder="답 입력" class="w-full px-4 py-3 border border-gray-300 rounded-lg"></div>';
                        }
                        var qHtml = '<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-4">' +
                            '<div class="flex items-start mb-4">' +
                            '<span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">' + globalIndex + '</span>' +
                            '<div><h3 class="text-lg font-medium text-gray-900">' + (q.question_text || '').replace(/</g, '&lt;') + '</h3><p class="text-sm text-gray-500 mt-1">배점: ' + (q.points || 0) + '점</p></div></div>' + inputHtml + '</div>';
                        wrap.insertAdjacentHTML('beforeend', qHtml);
                    });
                });
            } catch (e) {
                console.error(e);
                showError('사전평가를 불러오는데 실패했습니다.');
            }
        }

        function startTimer() {
            function update() {
                var m = Math.floor(timeLeft / 60);
                var s = timeLeft % 60;
                document.getElementById('timer').textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
                if (timeLeft < 300) document.getElementById('timer').parentElement.classList.add('animate-pulse');
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('제한시간이 종료되었습니다. 답안을 제출합니다.');
                    submitExam(new Event('submit'));
                }
            }
            update();
            timerInterval = setInterval(function() { timeLeft--; update(); }, 1000);
        }

        async function submitExam(e) {
            e.preventDefault();
            if (!confirm('정말 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) return;
            clearInterval(timerInterval);

            var userStr = localStorage.getItem('user');
            if (!userStr) { alert('로그인 정보가 없습니다.'); return; }
            var user = JSON.parse(userStr);
            var token = localStorage.getItem('token');

            var answersByExam = {};
            Object.keys(questionToExam).forEach(function(qId) {
                var examId = questionToExam[qId];
                if (!answersByExam[examId]) answersByExam[examId] = {};
                var input = document.querySelector('[name="q_' + qId + '"]');
                if (input && input.type === 'radio') {
                    var checked = document.querySelector('input[name="q_' + qId + '"]:checked');
                    answersByExam[examId][qId] = checked ? checked.value : '';
                } else if (input) {
                    answersByExam[examId][qId] = input.value || '';
                }
            });

            var submitted = 0;
            var failed = 0;
            for (var examId in answersByExam) {
                try {
                    var res = await fetch('/api/exams/' + examId + '/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ student_id: user.id, answers: answersByExam[examId] })
                    });
                    var result = await res.json();
                    if (result.success) submitted++; else failed++;
                } catch (err) {
                    failed++;
                }
            }
            var total = Object.keys(answersByExam).length;
            if (failed === 0) {
                alert('사전평가가 모두 제출되었습니다.\\n제출된 시험: ' + submitted + '건');
            } else {
                alert('제출 완료: ' + submitted + '건\\n제출 실패: ' + failed + '건');
            }
            window.location.href = '/student';
        }
    </script>
</body>
</html>
`;
