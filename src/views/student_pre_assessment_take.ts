/**
 * 통합 사전평가 응시 페이지 (과정별 여러 시험을 한 번에 응시)
 * 학생 대시보드와 동일한 헤더·사이드메뉴 레이아웃 적용
 * GET /student/pre-assessment/take?course_id=XXX 또는 ?session_id=XXX
 */
const studentLayoutHeader = `
        <header class="sticky top-0 z-20 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white/95 backdrop-blur-md border-b border-slate-200/60 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <a href="/" class="flex-shrink-0"><img src="/static/logo.png" alt="WOW 3D" class="h-7 sm:h-8 w-auto"></a>
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                        <span class="truncate">나의 강의실</span>
                        <span class="text-[9px] sm:text-[10px] bg-sky-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-widest font-black flex-shrink-0">학생</span>
                    </h1>
                    <p class="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase truncate">지능형 학습 관리 시스템 (학생 모드)</p>
                </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <div class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-100 rounded-xl sm:rounded-2xl border border-slate-200/60">
                    <i class="fas fa-clock text-sky-500 text-[10px] sm:text-xs"></i>
                    <span id="current-time" class="text-[10px] sm:text-xs font-black text-slate-700 tracking-tighter">00:00:00</span>
                </div>
                <a href="/" class="touch-target flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/60 text-slate-500 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm font-bold text-[10px] sm:text-xs"><i class="fas fa-home text-sm"></i><span class="hidden sm:inline">홈페이지로 이동</span></a>
                <div class="hidden sm:block h-6 md:h-8 w-px bg-slate-200"></div>
                <div class="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-white rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-sm">
                    <div class="hidden sm:block text-right flex flex-col min-w-0 max-w-[100px] md:max-w-none">
                        <span id="userName" class="text-xs sm:text-sm font-black text-slate-900 truncate">-</span>
                        <span class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Student</span>
                    </div>
                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-200 border border-white/20 flex-shrink-0"><i class="fas fa-user-graduate text-xs sm:text-sm"></i></div>
                    <button type="button" onclick="logout()" class="touch-target w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0" title="로그아웃"><i class="fas fa-sign-out-alt text-sm"></i></button>
                </div>
            </div>
        </header>`;

const studentLayoutSidebar = `
        <div class="lg:col-span-4 xl:col-span-3">
            <div class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-4 sm:mb-6">
                <div class="p-4 sm:p-5 bg-gradient-to-br from-sky-50 to-slate-50 border-b border-slate-100">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md flex-shrink-0"><i class="fas fa-user-graduate text-sm"></i></div>
                        <div class="min-w-0 flex-1">
                            <p id="profileName" class="text-sm font-black text-slate-800 truncate">-</p>
                            <p id="profileEmail" class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">-</p>
                        </div>
                    </div>
                </div>
                <nav class="p-3 sm:p-4 space-y-6">
                    <div><p class="px-3 py-1.5 text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2 mb-2"><i class="fas fa-graduation-cap opacity-70"></i> 학습</p>
                        <div class="space-y-1">
                            <a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-th-large text-[10px]"></i></span><span>종합 대시보드</span></a>
                            <a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-video text-[10px]"></i></span><span>수강 중인 강의</span></a>
                        </div>
                    </div>
                    <div><p class="px-3 py-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-2"><i class="fas fa-clipboard-check opacity-70"></i> 평가·설문</p>
                        <div class="space-y-1">
                            <div class="nav-side-btn active w-full text-left px-3.5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-3"><span class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0"><i class="fas fa-clipboard-list text-[10px]"></i></span><span>사전평가 (응시 중)</span></div>
                            <a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-certificate text-[10px]"></i></span><span>NCS 평가</span></a>
                            <a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-poll text-[10px]"></i></span><span>설문/평가</span></a>
                            <a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-chart-line text-[10px]"></i></span><span>성적/결과</span></a>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-slate-100"><p class="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><i class="fas fa-cog opacity-70"></i> 계정</p>
                        <div class="space-y-1"><a href="/student" class="nav-side-btn w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 group text-slate-600 hover:bg-slate-50 hover:text-slate-900"><span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0"><i class="fas fa-user-edit text-[10px]"></i></span><span>수강생 정보</span></a></div>
                    </div>
                </nav>
            </div>
        </div>`;

export const studentPreAssessmentTakeHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#0f172a">
    <title>사전평가 응시 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        .option-label { cursor: pointer; transition: all 0.2s; }
        .option-input:checked + .option-label { background-color: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .nav-side-btn.active { background: rgb(240 249 255); color: rgb(7 89 133); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden flex-col">
        ${studentLayoutHeader}
        <main class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            <div class="relative z-10 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    ${studentLayoutSidebar}
                    <div class="lg:col-span-8 xl:col-span-9 min-w-0">
                        <div class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-4 sm:mb-6">
                            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
                                <div class="flex items-center gap-3 min-w-0 flex-1">
                                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg flex-shrink-0"><i class="fas fa-clipboard-list text-xs sm:text-sm"></i></div>
                                    <div class="min-w-0">
                                        <h2 id="examTitle" class="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">사전평가 로딩 중...</h2>
                                        <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">인박스 컨텐츠</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                                    <i class="fas fa-clock mr-1"></i><span id="timer">00:00</span>
                                </div>
                            </div>
                            <div class="p-4 sm:p-6 md:p-8 min-h-[280px] overflow-x-auto">
                                <div id="examInfo" class="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                                    <p id="examDescription" class="text-slate-600 mb-2"></p>
                                    <div class="flex items-center gap-4 text-sm text-slate-500">
                                        <span><i class="fas fa-list-ol mr-1"></i> 총 <span id="questionCount">0</span>문항</span>
                                        <span><i class="fas fa-hourglass-half mr-1"></i> 제한시간 <span id="timeLimit">0</span>분</span>
                                    </div>
                                </div>
                                <form id="examForm" onsubmit="submitExam(event)">
                                    <div id="questionsList" class="space-y-6"></div>
                                    <div class="mt-8 flex justify-center">
                                        <button type="submit" class="bg-sky-600 text-white px-8 py-3.5 rounded-2xl hover:bg-slate-900 font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-100 transition">
                                            제출하기
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
        function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = '/login?redirect=' + encodeURIComponent(location.pathname + location.search); }
        function updateClock() { var d = new Date(); var t = d.toTimeString().split(' ')[0]; var el = document.getElementById('current-time'); if (el) el.textContent = t; }
        setInterval(updateClock, 1000); updateClock();
        var userStr = localStorage.getItem('user');
        if (userStr) try {
            var u = JSON.parse(userStr);
            var nameEl = document.getElementById('userName'); if (nameEl) nameEl.textContent = u.name || u.email || '-';
            var pName = document.getElementById('profileName'); if (pName) pName.textContent = u.name || '-';
            var pEmail = document.getElementById('profileEmail'); if (pEmail) pEmail.textContent = (u.email || '-').toUpperCase();
        } catch (_) {}

        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('course_id');
        const sessionId = params.get('session_id');
        let examData = null;
        let questionToExam = {};
        let timeLeft = 0;
        let timerInterval;

        document.addEventListener('DOMContentLoaded', function() {
            checkLogin();
            if (courseId || sessionId) loadCombinedExam(); else showError('course_id 또는 session_id가 필요합니다.');
        });

        function checkLogin() {
            if (!localStorage.getItem('token')) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
            }
        }

        function showError(msg) {
            document.getElementById('examTitle').textContent = '오류';
            document.getElementById('questionsList').innerHTML = '<div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">' + msg + '<p class="mt-4"><a href="/student" class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition"><i class="fas fa-arrow-left"></i> 학생 대시보드로 돌아가기</a></p></div>';
        }

        async function loadCombinedExam() {
            try {
                const token = localStorage.getItem('token');
                var query = courseId ? ('course_id=' + encodeURIComponent(courseId)) : ('session_id=' + encodeURIComponent(sessionId));
                const res = await fetch('/api/exams/student/pre-assessment-combined?' + query, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json().catch(function() { return {}; });
                if (!res.ok) {
                    showError(json.message || json.error || ('서버 오류 (' + res.status + '). 잠시 후 다시 시도하거나 관리자에게 문의하세요.'));
                    return;
                }
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
                document.getElementById('examDescription').textContent = '';
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
                                return '<div class="relative"><input type="radio" name="q_' + q.id + '" id="q_' + q.id + '_' + (i+1) + '" value="' + (i+1) + '" class="option-input peer sr-only"><label for="q_' + q.id + '_' + (i+1) + '" class="option-label block w-full p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100"><span class="font-medium text-slate-700 mr-2">' + (i+1) + '.</span> ' + (opt + '').replace(/</g, '&lt;') + '</label></div>';
                            }).join('') + '</div>';
                        } else if (q.question_type === 'short_answer') {
                            inputHtml = '<div class="ml-11 mt-2"><input type="text" name="q_' + q.id + '" placeholder="정답을 입력하세요" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"></div>';
                        } else if (q.question_type === 'essay') {
                            inputHtml = '<div class="ml-11 mt-2"><textarea name="q_' + q.id + '" rows="5" placeholder="답안을 서술하세요..." class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"></textarea></div>';
                        } else {
                            inputHtml = '<div class="ml-11 mt-2"><input type="text" name="q_' + q.id + '" placeholder="답 입력" class="w-full px-4 py-3 border border-slate-200 rounded-xl"></div>';
                        }
                        var qHtml = '<div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200/60 mb-4">' +
                            '<div class="flex items-start mb-4">' +
                            '<span class="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold mr-3">' + globalIndex + '</span>' +
                            '<div><h3 class="text-lg font-medium text-slate-900">' + (q.question_text || '').replace(/</g, '&lt;') + '</h3><p class="text-sm text-slate-500 mt-1">배점: ' + (q.points || 0) + '점</p></div></div>' + inputHtml + '</div>';
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
            var studentId = user.userId != null ? user.userId : user.id;

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
                        body: JSON.stringify({ student_id: studentId, answers: answersByExam[examId] })
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
