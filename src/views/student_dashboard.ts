export const studentDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 강의실 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="min-h-screen flex flex-col">
        <!-- 네비게이션 -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="flex items-center">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto mr-2">
                            <span class="font-bold text-gray-800">나의 강의실</span>
                        </a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span id="userName" class="text-gray-700 font-medium"></span>
                        <button onclick="logout()" class="text-gray-500 hover:text-red-600">
                            <i class="fas fa-sign-out-alt"></i> 로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- 왼쪽 사이드바 -->
                <div class="md:col-span-1">
                    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div class="text-center mb-6">
                            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i class="fas fa-user-graduate text-3xl text-blue-600"></i>
                            </div>
                            <h2 id="profileName" class="text-xl font-bold text-gray-800"></h2>
                            <p id="profileEmail" class="text-sm text-gray-500"></p>
                        </div>
                        <div class="space-y-2">
                            <button onclick="switchTab('exams')" id="btn-exams" class="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium transition">
                                <i class="fas fa-book-open mr-2"></i> 나의 시험
                            </button>
                            <button onclick="switchTab('lectures')" id="btn-lectures" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-video mr-2"></i> 수강 중인 강의
                            </button>
                            <button onclick="switchTab('grades')" id="btn-grades" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-history mr-2"></i> 성적/결과
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 메인 컨텐츠 -->
                <div class="md:col-span-2">
                    <h2 id="contentTitle" class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-edit mr-3 text-blue-600"></i> 진행 중인 시험
                    </h2>

                    <div id="contentArea" class="space-y-4">
                        <!-- 동적 컨텐츠 로드됨 -->
                        <div class="text-center py-12">
                            <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadProfile();
            switchTab('exams');
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
        }

        function loadProfile() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('userName').textContent = user.name;
                document.getElementById('profileName').textContent = user.name;
                document.getElementById('profileEmail').textContent = user.email;
            }
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        function switchTab(tab) {
            // 버튼 스타일 초기화
            ['exams', 'lectures', 'grades'].forEach(t => {
                const btn = document.getElementById('btn-' + t);
                if (t === tab) {
                    btn.className = 'w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium transition';
                } else {
                    btn.className = 'w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition';
                }
            });

            const title = document.getElementById('contentTitle');
            const content = document.getElementById('contentArea');

            if (tab === 'exams') {
                title.innerHTML = '<i class="fas fa-edit mr-3 text-blue-600"></i> 진행 중인 시험';
                loadExams();
            } else if (tab === 'lectures') {
                title.innerHTML = '<i class="fas fa-video mr-3 text-blue-600"></i> 수강 중인 강의';
                content.innerHTML = '<div class="text-center py-12 text-gray-500">수강 중인 강의가 없습니다.</div>';
            } else if (tab === 'grades') {
                title.innerHTML = '<i class="fas fa-history mr-3 text-blue-600"></i> 성적/결과';
                loadGrades();
            }
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exams = await response.json();
                
                const container = document.getElementById('contentArea');
                
                // 활성화된 시험만 필터링
                const activeExams = exams.filter(e => e.is_active);

                if (activeExams.length === 0) {
                    container.innerHTML = \`
                        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                            <i class="fas fa-clipboard-check text-4xl text-gray-300 mb-3"></i>
                            <p class="text-gray-500">현재 진행 중인 시험이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = activeExams.map(exam => \`
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition flex justify-between items-center">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">\${exam.course_title || '일반'}</span>
                                <span class="text-sm text-gray-500"><i class="far fa-clock mr-1"></i> \${exam.time_limit}분</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800">\${exam.title}</h3>
                            <p class="text-sm text-gray-600 mt-1">\${exam.description || '설명 없음'}</p>
                        </div>
                        <button onclick="location.href='/student/exam/\${exam.id}'" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm whitespace-nowrap">
                            응시하기
                        </button>
                    </div>
                \`).join('');

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadGrades() {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await fetch('/api/exams/my-results?student_id=' + user.id, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const results = await response.json();
                
                const container = document.getElementById('contentArea');

                if (results.length === 0) {
                    container.innerHTML = \`
                        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                            <i class="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
                            <p class="text-gray-500">응시한 시험 기록이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = results.map(r => {
                    const scorePercent = (r.score / r.total_points) * 100;
                    let badgeClass = 'bg-gray-100 text-gray-800';
                    let statusText = '완료';
                    
                    if (scorePercent >= 80) {
                        badgeClass = 'bg-green-100 text-green-800';
                        statusText = '우수';
                    } else if (scorePercent < 60) {
                        badgeClass = 'bg-red-100 text-red-800';
                        statusText = '재시험 필요';
                    }

                    return \`
                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-2 inline-block">\${r.course_title || '일반'}</span>
                                    <h3 class="text-lg font-bold text-gray-800">\${r.exam_title}</h3>
                                    <p class="text-sm text-gray-500 mt-1">제출일: \${new Date(r.submitted_at).toLocaleString()}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-bold \${badgeClass}">\${statusText}</span>
                            </div>
                            <div class="flex items-end justify-between border-t border-gray-100 pt-4">
                                <div>
                                    <p class="text-sm text-gray-500">총점</p>
                                    <p class="text-2xl font-bold text-gray-900">\${r.score} <span class="text-sm text-gray-400 font-normal">/ \${r.total_points}</span></p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500">백분율</p>
                                    <p class="text-lg font-bold text-blue-600">\${scorePercent.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    \`;
                }).join('');

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">성적을 불러오는데 실패했습니다.</div>';
            }
        }
    </script>
</body>
</html>
`;
