export const studentDashboardHtml = () => `
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
                            <button onclick="switchTab('ncs')" id="btn-ncs" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-certificate mr-2"></i> NCS 평가
                            </button>
                            <button onclick="switchTab('surveys')" id="btn-surveys" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-poll mr-2"></i> 설문/평가
                            </button>
                            <button onclick="switchTab('portfolio')" id="btn-portfolio" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-image mr-2"></i> 포트폴리오
                            </button>
                            <button onclick="switchTab('employment')" id="btn-employment" class="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <i class="fas fa-user-tie mr-2"></i> 취업 성과
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
            ['exams', 'lectures', 'assignments', 'grades', 'ncs', 'surveys', 'portfolio', 'employment'].forEach(t => {
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
                loadLectures();
            } else if (tab === 'grades') {
                title.innerHTML = '<i class="fas fa-history mr-3 text-blue-600"></i> 성적/결과';
                loadGrades();
            } else if (tab === 'ncs') {
                title.innerHTML = '<i class="fas fa-certificate mr-3 text-blue-600"></i> NCS 능력단위 평가';
                loadNcsStatus();
            } else if (tab === 'surveys') {
                title.innerHTML = '<i class="fas fa-poll mr-3 text-blue-600"></i> 설문 및 역량평가';
                loadStudentSurveys();
            } else if (tab === 'portfolio') {
                title.innerHTML = '<i class="fas fa-image mr-3 text-blue-600"></i> 나의 포트폴리오';
                loadStudentPortfolios();
            } else if (tab === 'employment') {
                title.innerHTML = '<i class="fas fa-user-tie mr-3 text-blue-600"></i> 나의 취업 성과';
                loadEmploymentStatus();
            }
        }

        async function loadLectures() {
            try {
                const token = localStorage.getItem('token');
                // Fetch approved enrollments
                const response = await fetch('/api/enrollments?status=approved', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const container = document.getElementById('contentArea');
                
                if (!result.success || result.data.length === 0) {
                    container.innerHTML = \`
                        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                            <i class="fas fa-chalkboard text-4xl text-gray-300 mb-3"></i>
                            <p class="text-gray-500">수강 중인 강의가 없습니다.</p>
                            <a href="/courses" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">과정 둘러보기</a>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = result.data.map(item => \`
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img src="\${item.course_thumbnail || '/static/images/default-course.jpg'}" class="w-full h-full object-cover" alt="\${item.course_title}">
                            </div>
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">\${item.course_category || '일반'}</span>
                                        <span class="text-xs text-gray-500"><i class="far fa-calendar-alt mr-1"></i> \${new Date(item.enrolled_at).toLocaleDateString()} 등록</span>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-800 mb-2">\${item.course_title}</h3>
                                    <p class="text-sm text-gray-600 mb-4 line-clamp-2">\${item.course_category === '국비지원' ? '국비지원 과정입니다.' : '일반 과정입니다.'}</p>
                                </div>
                                <div class="flex items-center justify-between mt-auto">
                                    <div class="flex items-center gap-4 text-sm text-gray-500">
                                        <span><i class="fas fa-check-circle text-green-500 mr-1"></i>승인됨</span>
                                        <span><i class="fas fa-school mr-1"></i>\${item.campus_name || '홍대센터'}</span>
                                    </div>
                                    <a href="/courses/\${item.course_id}" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                        과정 상세 <i class="fas fa-chevron-right ml-1"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                \`).join('');

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">강의 목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                // Use the consolidated exam API
                const response = await fetch('/api/exams', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exams = await response.json();
                
                // Wrap in success check if API returns wrapped response
                const examList = Array.isArray(exams) ? exams : (exams.data || []);
                
                const container = document.getElementById('contentArea');
                
                // 활성화된 시험만 필터링
                const activeExams = examList.filter(e => e.is_active);

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
                                <span class="text-sm text-gray-500"><i class="far fa-clock mr-1"></i> \${exam.time_limit_minutes || exam.time_limit}분</span>
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
                const result = await response.json();
                const results = Array.isArray(result) ? result : (result.data || []);
                
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

        async function loadNcsStatus() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const container = document.getElementById('contentArea');
                
                // 1. Fetch My Results
                const resResults = await fetch('/api/ncs/my-results?studentId=' + user.id);
                const dataResults = await resResults.json();
                
                // 2. Fetch Active Plans (for evidence upload)
                const resPlans = await fetch('/api/ncs/my-plans?studentId=' + user.id);
                const dataPlans = await resPlans.json();

                let html = \`
                    <div class="space-y-6">
                        <section>
                            <h3 class="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span class="w-1 h-5 bg-blue-600 rounded mr-2"></span> 평가 결과 및 이수 현황
                            </h3>
                            <div class="grid grid-cols-1 gap-4">
                \`;

                if (dataResults.success && dataResults.data.length > 0) {
                    html += dataResults.data.map(r => \`
                        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <div class="text-xs text-gray-400 font-medium mb-1">\${r.course_title}</div>
                                    <h4 class="font-bold text-gray-800">[\${r.unit_code}] \${r.unit_name}</h4>
                                </div>
                                <span class="px-2 py-1 \${r.is_passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-bold rounded">
                                    \${r.is_passed ? 'PASS' : 'FAIL'}
                                </span>
                            </div>
                            <div class="flex items-center gap-6 pt-3 border-t border-gray-50">
                                <div>
                                    <div class="text-[10px] text-gray-400">평가방법</div>
                                    <div class="text-sm font-medium">\${r.method}</div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-gray-400">득점</div>
                                    <div class="text-sm font-bold \${r.score >= r.target_score ? 'text-blue-600' : 'text-red-500'}">\${r.score}점</div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-gray-400">기준점수</div>
                                    <div class="text-sm font-medium">\${r.target_score}점</div>
                                </div>
                            </div>
                            \${r.feedback ? \`
                                <div class="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed italic border-l-2 border-gray-200">
                                    <i class="fas fa-quote-left mr-1 opacity-30"></i> \${r.feedback}
                                </div>
                            \` : ''}
                        </div>
                    \`).join('');
                } else {
                    html += '<div class="bg-white rounded-xl p-8 text-center text-gray-400 text-sm border border-dashed">아직 평가된 내역이 없습니다.</div>';
                }

                html += \`
                            </div>
                        </section>

                        <section class="mt-8">
                            <h3 class="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span class="w-1 h-5 bg-purple-600 rounded mr-2"></span> 증빙 자료 (포트폴리오) 제출
                            </h3>
                            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table class="w-full text-left">
                                    <thead class="bg-gray-50 border-b">
                                        <tr>
                                            <th class="px-6 py-4 text-xs font-bold text-gray-500">평가 예정 항목</th>
                                            <th class="px-6 py-4 text-xs font-bold text-gray-500 w-32">상태</th>
                                            <th class="px-6 py-4 text-xs font-bold text-gray-500 w-32 text-right">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-50">
                \`;

                if (dataPlans.success && dataPlans.data.length > 0) {
                    html += dataPlans.data.map(p => \`
                        <tr>
                            <td class="px-6 py-4">
                                <div class="text-xs text-gray-400 mb-0.5">\${p.course_title}</div>
                                <div class="text-sm font-bold text-gray-800">[\${p.unit_code}] \${p.unit_name}</div>
                                <div class="text-[10px] text-gray-500 mt-1"><i class="far fa-calendar-alt mr-1"></i> 예정일: \${p.planned_date || '미정'} / 방법: \${p.method}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span id="status-plan-\${p.id}" class="text-[10px] font-bold text-gray-400">확인 중...</span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button onclick="openUploadModal(\${p.id}, '\${p.unit_name}')" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition shadow-sm">
                                    자료제출
                                </button>
                            </td>
                        </tr>
                    \`).join('');
                } else {
                    html += '<tr><td colspan="3" class="px-6 py-10 text-center text-gray-400 text-sm">진행 중인 평가 계획이 없습니다.</td></tr>';
                }

                html += \`
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <!-- 업로드 모달 -->
                    <div id="uploadModal" class="fixed inset-0 bg-black/60 hidden z-[70] flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                            <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 class="font-bold text-gray-800">실기/과제 증빙 제출</h3>
                                <button onclick="closeUploadModal()" class="text-gray-400 hover:text-gray-600 transition"><i class="fas fa-times text-xl"></i></button>
                            </div>
                            <div class="p-8 space-y-6">
                                <input type="hidden" id="uploadPlanId">
                                <div>
                                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">대상 능력단위</label>
                                    <div id="uploadUnitName" class="text-lg font-bold text-gray-800"></div>
                                </div>
                                <div>
                                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">파일 URL</label>
                                    <input type="text" id="uploadFileUrl" placeholder="첨부파일 링크 또는 구글드라이브 URL" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none transition">
                                    <p class="text-[10px] text-gray-400 mt-2">* 현재 파일 업로드는 준비 중이며, 클라우드 링크 제출만 가능합니다.</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">학생 의견/설명</label>
                                    <textarea id="uploadComment" rows="3" placeholder="제출물에 대한 설명을 적어주세요..." class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none transition"></textarea>
                                </div>
                                <button onclick="submitEvidence()" class="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-100">
                                    제출 완료하기
                                </button>
                            </div>
                        </div>
                    </div>
                \`;

                container.innerHTML = html;

                // Load check status for each plan
                if (dataPlans.success) {
                    dataPlans.data.forEach(p => checkEvidenceStatus(p.id));
                }

            } catch (e) {
                console.error(e);
                document.getElementById('contentArea').innerHTML = '<div class="text-center text-red-500">NCS 정보를 불러오는데 실패했습니다.</div>';
            }
        }

        async function checkEvidenceStatus(planId) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await fetch(\`/api/ncs/evidence?planId=\${planId}&studentId=\${user.id}\`);
                const result = await res.json();
                const statusSpan = document.getElementById('status-plan-' + planId);
                if (result.success && result.data.length > 0) {
                    statusSpan.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>제출함</span>';
                } else {
                    statusSpan.textContent = '미제출';
                }
            } catch (e) { console.error(e); }
        }

        function openUploadModal(planId, unitName) {
            document.getElementById('uploadPlanId').value = planId;
            document.getElementById('uploadUnitName').textContent = unitName;
            document.getElementById('uploadFileUrl').value = '';
            document.getElementById('uploadComment').value = '';
            document.getElementById('uploadModal').classList.remove('hidden');
        }

        function closeUploadModal() { document.getElementById('uploadModal').classList.add('hidden'); }

        async function submitEvidence() {
            const planId = document.getElementById('uploadPlanId').value;
            const fileUrl = document.getElementById('uploadFileUrl').value;
            const comment = document.getElementById('uploadComment').value;
            const user = JSON.parse(localStorage.getItem('user'));

            if (!fileUrl) return alert('파일 URL을 입력해주세요.');

            try {
                const res = await fetch('/api/ncs/evidence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plan_id: parseInt(planId),
                        student_id: user.id,
                        file_name: '증빙자료',
                        file_url: fileUrl,
                        file_type: 'link',
                        comment: comment
                    })
                });
                const result = await res.json();
                if (result.success) {
                    alert('제출되었습니다.');
                    closeUploadModal();
                    loadNcsStatus();
                }
            } catch (e) {
                console.error(e);
                alert('자료 제출에 실패했습니다.');
            }
        }

        // --- 포트폴리오 기능 ---
        let myEnrollments = [];

        async function loadStudentPortfolios() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i></div>';

            try {
                // 1. 참여중인 과정 로드 (모달용)
                const enrollRes = await fetch('/api/enrollments?status=approved', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const enrollData = await enrollRes.json();
                if (enrollData.success) myEnrollments = enrollData.data;

                // 2. 포트폴리오 데이터 로드
                const res = await fetch('/api/portfolios/my', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                
                let html = \`
                    <div class="flex justify-end mb-6">
                        <button onclick="openPortfolioModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                            <i class="fas fa-plus mr-2"></i> 새 포트폴리오 추가
                        </button>
                    </div>
                \`;

                if (result.success && result.data.length > 0) {
                    html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">';
                    result.data.forEach(p => {
                        html += \`
                            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                                <div class="relative h-40 overflow-hidden">
                                    <img src="\${p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                    <div class="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-[10px] font-bold text-gray-600">\${p.category}</div>
                                </div>
                                <div class="p-4">
                                    <h4 class="font-bold text-gray-800 mb-1 line-clamp-1">\${p.title}</h4>
                                    <p class="text-xs text-gray-500 mb-4 line-clamp-2">\${p.description || '설명이 없습니다.'}</p>
                                    <div class="flex justify-between items-center pt-3 border-t border-gray-50">
                                        <a href="\${p.content_url || '#'}" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                            <i class="fas fa-link"></i> 링크보기
                                        </a>
                                        <div class="flex gap-2">
                                            <button onclick="deletePortfolio(\${p.id})" class="text-gray-300 hover:text-red-500 transition"><i class="fas fa-trash-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        \`;
                    });
                    html += '</div>';
                } else {
                    html += '<div class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">등록된 포트폴리오가 없습니다.</div>';
                }
                container.innerHTML = html;
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-12 text-red-500">데이터를 불러오는 데 실패했습니다.</div>';
            }
        }

        function openPortfolioModal() {
            const courseSelect = document.getElementById('portfolioCourseId');
            courseSelect.innerHTML = '<option value="">소속 과정 선택 (선택사항)</option>' + 
                myEnrollments.map(e => \`<option value="\${e.course_id}">\${e.course_title}</option>\`).join('');
            
            document.getElementById('portfolioModal').classList.remove('hidden');
        }

        function closePortfolioModal() { document.getElementById('portfolioModal').classList.add('hidden'); }

        async function handleSavePortfolio(e) {
            e.preventDefault();
            const data = {
                title: document.getElementById('portfolioTitle').value,
                description: document.getElementById('portfolioDescription').value,
                thumbnail_url: document.getElementById('portfolioThumbnail').value,
                content_url: document.getElementById('portfolioContent').value,
                category: document.getElementById('portfolioCategory').value,
                course_id: document.getElementById('portfolioCourseId').value || null
            };

            try {
                const res = await fetch('/api/portfolios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert('포트폴리오가 등록되었습니다.');
                    closePortfolioModal();
                    loadStudentPortfolios();
                } else {
                    alert('등록 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) { 
                console.error(e); 
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        async function deletePortfolio(id) {
            if (!confirm('정말 삭제하시겠습니까?')) return;
            try {
                const res = await fetch(\`/api/portfolios/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    loadStudentPortfolios();
                } else {
                    alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) { 
                console.error(e); 
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function loadEmploymentStatus() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i></div>';

            try {
                const res = await fetch('/api/hrd/my-employment', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                
                if (result.success && result.data.length > 0) {
                    let html = '<div class="space-y-6">';
                    result.data.forEach(item => {
                        let statusText = '';
                        let statusClass = '';
                        switch(item.status) {
                            case 'employed': statusText = '취업 완료'; statusClass = 'bg-green-100 text-green-700'; break;
                            case 'seeking': statusText = '구직 중'; statusClass = 'bg-orange-100 text-orange-700'; break;
                            case 'further_education': statusText = '진학'; statusClass = 'bg-blue-100 text-blue-700'; break;
                            case 'military': statusText = '군입대'; statusClass = 'bg-gray-100 text-gray-700'; break;
                            default: statusText = '기타/미정'; statusClass = 'bg-gray-50 text-gray-400';
                        }

                        html += \`
                            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 class="font-bold text-gray-800 text-lg">\${item.course_title}</h4>
                                        <p class="text-xs text-gray-500 mt-1">이 과정에 대한 나의 현재 취업 정보입니다.</p>
                                    </div>
                                    <span class="px-3 py-1 \${statusClass} text-xs font-bold rounded-full">\${statusText}</span>
                                </div>
                                <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-4">
                                    <div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black mb-1">취업처</div>
                                        <div class="text-sm font-bold text-gray-700">\${item.company_name || '-'}</div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black mb-1">직무</div>
                                        <div class="text-sm font-bold text-gray-700">\${item.job_title || '-'}</div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black mb-1">취업일자</div>
                                        <div class="text-sm font-bold text-gray-700">\${item.employment_date || '-'}</div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black mb-1">보험가입</div>
                                        <div class="text-sm font-bold text-gray-700">\${item.insurance_covered ? '가입됨' : '미가입/미확인'}</div>
                                    </div>
                                </div>
                                <div class="flex justify-end">
                                    <button onclick="openEmploymentModal(\${JSON.stringify(item).replace(/"/g, '&quot;')})" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm">
                                        정보 업데이트
                                    </button>
                                </div>
                            </div>
                        \`;
                    });
                    html += '</div>';
                    
                    // Modal HTML inside the content area for simplicity or added to body below
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<div class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">수강 승인된 과정이 없어 취업 정보를 등록할 수 없습니다.</div>';
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center py-12 text-red-500">데이터를 불러오는 데 실패했습니다.</div>';
            }
        }

        function openEmploymentModal(item) {
            document.getElementById('empCourseId').value = item.course_id;
            document.getElementById('empCourseTitle').textContent = item.course_title;
            document.getElementById('empStatus').value = item.status || 'seeking';
            document.getElementById('empCompanyName').value = item.company_name || '';
            document.getElementById('empJobTitle').value = item.job_title || '';
            document.getElementById('empDate').value = item.employment_date || '';
            document.getElementById('empInsurance').checked = !!item.insurance_covered;
            document.getElementById('empNotes').value = item.notes || '';
            document.getElementById('employmentModal').classList.remove('hidden');
        }

        function closeEmploymentModal() { document.getElementById('employmentModal').classList.add('hidden'); }

        async function loadStudentSurveys() {
            const container = document.getElementById('contentArea');
            container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i><p class="mt-4 text-gray-500">설문 목록을 불러오는 중...</p></div>';

            try {
                // Mock Data for now (Simulating API fetch)
                // In a real app: const res = await fetch('/api/surveys/my-pending', ...);
                await new Promise(r => setTimeout(r, 500)); // Simulate delay
                
                const surveys = [
                    { id: 1, type: 'diagnosis', title: '사전 NC·S 직무 역량 진단', startDate: '2024-01-01', endDate: '2024-12-31', status: 'pending', courseTitle: 'Java 국비지원 과정' },
                    { id: 2, type: 'survey', title: '1개월차 훈련과정 만족도 조사', startDate: '2024-02-01', endDate: '2024-02-05', status: 'completed', courseTitle: 'Java 국비지원 과정' }
                ];

                if (surveys.length === 0) {
                    container.innerHTML = \`
                        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                            <i class="fas fa-poll text-4xl text-gray-300 mb-3"></i>
                            <p class="text-gray-500">진행 중인 설문이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = surveys.map(s => {
                    const isPending = s.status === 'pending';
                    const badgeClass = isPending ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
                    const statusText = isPending ? '미참여' : '완료됨';
                    const btnClass = isPending 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed';
                    
                    return \`
                        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded">\${s.courseTitle}</span>
                                        <span class="px-2 py-0.5 \${s.type === 'diagnosis' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'} text-xs font-bold rounded">
                                            \${s.type === 'diagnosis' ? '역량진단' : '설문조사'}
                                        </span>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-800">\${s.title}</h3>
                                    <p class="text-xs text-gray-500 mt-1"><i class="far fa-calendar-alt mr-1"></i> \${s.startDate} ~ \${s.endDate}</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-bold \${badgeClass}">\${statusText}</span>
                                    <button onclick="\${isPending ? \`alert('설문 페이지로 이동합니다 (구현 예정)')\` : ''}" \${!isPending ? 'disabled' : ''} class="px-6 py-2 rounded-lg font-bold transition shadow-sm \${btnClass}">
                                        \${isPending ? '참여하기' : '완료'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    \`;
                }).join('');

            } catch (e) {
                console.error(e);
                container.innerHTML = '<div class="text-center text-red-500">목록을 불러오는데 실패했습니다.</div>';
            }
        }

        async function handleSaveEmployment(e) {
            e.preventDefault();
            const data = {
                course_id: parseInt(document.getElementById('empCourseId').value),
                status: document.getElementById('empStatus').value,
                company_name: document.getElementById('empCompanyName').value,
                job_title: document.getElementById('empJobTitle').value,
                employment_date: document.getElementById('empDate').value,
                insurance_covered: document.getElementById('empInsurance').checked,
                notes: document.getElementById('empNotes').value
            };

            try {
                const res = await fetch('/api/hrd/my-employment', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert('성공적으로 업데이트되었습니다.');
                    closeEmploymentModal();
                    loadEmploymentStatus();
                } else {
                    alert(result.error || '업데이트에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('업데이트 중 오류가 발생했습니다.');
            }
        }
    </script>

    <!-- 포트폴리오 등록 모달 -->
    <div id="portfolioModal" class="fixed inset-0 bg-black/50 hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
            <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">포트폴리오 등록</h3>
                <button onclick="closePortfolioModal()" class="text-gray-400 hover:text-gray-600 transition"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="portfolioForm" onsubmit="handleSavePortfolio(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">작품 제목 *</label>
                    <input type="text" id="portfolioTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="예: 3D 캐릭터 모델링">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="portfolioDescription" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="작품에 대한 간단한 설명"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">카테고리</label>
                        <select id="portfolioCategory" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">소속 과정</label>
                        <select id="portfolioCourseId" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <!-- JS Load -->
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">썸네일 이미지 URL</label>
                    <input type="url" id="portfolioThumbnail" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://...">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">작품 링크 (URL)</label>
                    <input type="url" id="portfolioContent" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-blue-500" placeholder="Google Drive, Portfolio site 등">
                </div>
                <div class="pt-4 flex gap-3">
                    <button type="button" onclick="closePortfolioModal()" class="flex-1 py-3 border rounded-xl font-bold text-gray-500">취소</button>
                    <button type="submit" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">등록하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 취업 정보 수정 모달 -->
    <div id="employmentModal" class="fixed inset-0 bg-black/60 hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all overflow-hidden">
            <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">취업 정보 업데이트</h3>
                <button onclick="closeEmploymentModal()" class="text-gray-400 hover:text-gray-600 transition"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form onsubmit="handleSaveEmployment(event)" class="p-8 space-y-6">
                <input type="hidden" id="empCourseId">
                <div>
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">과정명</label>
                    <div id="empCourseTitle" class="font-bold text-gray-800 text-lg"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">현재 상태</label>
                        <select id="empStatus" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition uppercase text-xs font-bold">
                            <option value="seeking">구직 중</option>
                            <option value="employed">취업 완료</option>
                            <option value="further_education">진학</option>
                            <option value="military">군입대</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">업체명</label>
                        <input type="text" id="empCompanyName" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">직무</label>
                        <input type="text" id="empJobTitle" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">취업일자</label>
                        <input type="date" id="empDate" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div class="flex items-end pb-3">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="empInsurance" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                            <span class="text-xs font-bold text-gray-600">고용보험 가입</span>
                        </label>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">비고/메모</label>
                        <textarea id="empNotes" rows="2" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition text-sm"></textarea>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button type="button" onclick="closeEmploymentModal()" class="flex-1 py-4 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition">취소</button>
                    <button type="submit" class="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">저장하기</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
`;
