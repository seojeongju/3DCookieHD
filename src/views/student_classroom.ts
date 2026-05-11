
import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const studentClassroomHtml = (sessionId: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강의실 입장 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@100..900&display=swap" rel="stylesheet">
    <style>
        .bento-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900">
    ${navigationHtml('classroom')}

    <div id="loadingOverlay" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div class="text-center">
            <i class="fas fa-circle-notch fa-spin text-4xl text-primary-500 mb-4"></i>
            <p class="text-slate-500 font-bold">강의실 입장 중...</p>
        </div>
    </div>

    <div id="pinModal" class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 hidden flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl transform transition-all scale-100 opcaity-100">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <i class="fas fa-lock text-2xl"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 tracking-tight">접근 코드 입력</h2>
                <p class="text-sm text-slate-500 mt-2 font-medium">이 강의실은 보안 코드가 설정되어 있습니다.<br>담당 강사에게 코드를 문의하세요.</p>
            </div>
            <form onsubmit="handlePinSubmit(event)" class="space-y-4">
                <div>
                    <input type="password" id="pinInput" 
                        class="w-full text-center text-2xl font-black tracking-[0.5em] px-4 py-4 border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition placeholder:tracking-normal placeholder:font-medium placeholder:text-sm" 
                        placeholder="PIN 입력" maxlength="6" required autofocus>
                </div>
                <button type="submit" class="w-full py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-slate-900 transition shadow-lg shadow-primary-500/20 active:scale-95">입장하기</button>
            </form>
            <button onclick="history.back()" class="w-full mt-3 py-3 text-slate-400 font-bold text-xs hover:text-slate-600 transition">뒤로가기</button>
        </div>
    </div>

    <main id="classroomContent" class="hidden min-h-screen pt-8 pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- 헤더 섹션 -->
            <div class="mb-8">
                <span class="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black rounded-full uppercase tracking-widest mb-2">CLASSROOM</span>
                <h1 id="courseTitle" class="text-3xl font-black text-slate-900 tracking-tight mb-2">강의명 로딩 중...</h1>
                <p id="sessionInfo" class="text-slate-500 font-medium"></p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- 사이드바 메뉴 -->
                <div class="lg:col-span-3 space-y-4">
                    <div class="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm">
                        <div class="space-y-2">
                            <button onclick="loadTab('home')" id="tab-home" class="w-full text-left px-5 py-3.5 bg-primary-50 text-primary-700 rounded-2xl font-black text-sm transition flex items-center gap-3">
                                <i class="fas fa-home w-5"></i> 홈
                            </button>
                            <button onclick="loadTab('curriculum')" id="tab-curriculum" class="w-full text-left px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition flex items-center gap-3">
                                <i class="fas fa-list-ol w-5"></i> 커리큘럼
                            </button>
                             <button onclick="loadTab('exam')" id="tab-exam" class="w-full text-left px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition flex items-center gap-3">
                                <i class="fas fa-pen-fancy w-5"></i> 시험응시
                            </button>
                            <button onclick="loadTab('assignments')" id="tab-assignments" class="w-full text-left px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition flex items-center gap-3">
                                <i class="fas fa-tasks w-5"></i> 과제제출
                            </button>
                            <button onclick="loadTab('attendance')" id="tab-attendance" class="w-full text-left px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition flex items-center gap-3">
                                <i class="fas fa-clock w-5"></i> 출석현황
                            </button>
                        </div>
                    </div>

                    <!-- 강사 정보 카드 -->
                    <div class="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm">
                        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">담당 강사</h3>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <i class="fas fa-user-tie text-xl"></i>
                            </div>
                            <div>
                                <p id="instructorName" class="font-bold text-slate-800">-</p>
                                <p class="text-[10px] text-slate-400 font-medium">Trainer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 메인 컨텐츠 영역 -->
                <div class="lg:col-span-9">
                    <div id="tabContent" class="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm min-h-[500px]">
                        <!-- 탭 내용이 여기에 로드됨 -->
                    </div>
                </div>
            </div>
        </div>
    </main>

    ${footerHtml()}

    <script>
        const sessionId = ${JSON.stringify(sessionId)};
        let sessionData = null;

        document.addEventListener('DOMContentLoaded', async () => {
            await checkAuth();
            await loadSessionInfo();
        });

        async function checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login?redirect=/student/classroom/' + sessionId;
                return;
            }
        }

        async function loadSessionInfo() {
            try {
                // 1. 세션 정보 로드 (Access Code 유무 확인)
                const res = await fetch('/api/course-sessions/public/' + sessionId + '?source=session');
                const json = await res.json();
                
                if (!json.success || !json.data) {
                    alert('강의 정보를 불러올 수 없습니다.');
                    window.location.href = '/student';
                    return;
                }
                
                sessionData = json.data;
                
                // 2. 접근 권한 확인 (Access Code 검증)
                if (sessionData.has_access_code === 1) {
                    const verifiedKey = 'access_verified_' + sessionId;
                    if (!sessionStorage.getItem(verifiedKey)) {
                        document.getElementById('loadingOverlay').classList.add('hidden');
                        document.getElementById('pinModal').classList.remove('hidden');
                        return;
                    }
                }

                // 3. UI 렌더링
                renderUI();
                
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        async function handlePinSubmit(e) {
            e.preventDefault();
            const pin = document.getElementById('pinInput').value;
            if (!pin) return;

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/course-sessions/' + sessionId + '/verify-access', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ code: pin })
                });
                const json = await res.json();

                if (json.success) {
                    sessionStorage.setItem('access_verified_' + sessionId, 'true');
                    document.getElementById('pinModal').classList.add('hidden');
                    renderUI();
                } else {
                    alert('올바르지 않은 코드입니다. 다시 확인해주세요.');
                    document.getElementById('pinInput').value = '';
                    document.getElementById('pinInput').focus();
                }
            } catch (e) {
                console.error(e);
                alert('검증 중 오류가 발생했습니다.');
            }
        }

        function renderUI() {
            document.getElementById('loadingOverlay').classList.add('hidden');
            document.getElementById('classroomContent').classList.remove('hidden');

            // 기본 정보 채우기
            let title = sessionData.course_name || '제목 없음';
            if (sessionData.session_number) title += ' (' + sessionData.session_number + '회차)';
            document.getElementById('courseTitle').textContent = title;
            
            const start = sessionData.training_start_date ? new Date(sessionData.training_start_date).toLocaleDateString() : '미정';
            const end = sessionData.training_end_date ? new Date(sessionData.training_end_date).toLocaleDateString() : '미정';
            document.getElementById('sessionInfo').innerHTML = \`<i class="far fa-calendar-alt mr-2"></i> \${start} ~ \${end} &nbsp;|&nbsp; <i class="fas fa-map-marker-alt mr-2"></i> \${sessionData.location || '온라인/오프라인'}\`;
            
            document.getElementById('instructorName').textContent = sessionData.instructor_name || '미정';

            // 기본 탭 로드
            loadTab('home');
        }

        window.loadTab = function(tab) {
            // 버튼 스타일 업데이트
            document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                const isActive = btn.id === 'tab-' + tab;
                btn.className = isActive 
                    ? 'w-full text-left px-5 py-3.5 bg-primary-50 text-primary-700 rounded-2xl font-black text-sm transition flex items-center gap-3'
                    : 'w-full text-left px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition flex items-center gap-3';
            });

            const content = document.getElementById('tabContent');
            
            if (tab === 'home') {
                content.innerHTML = \`
                    <div class="text-center py-12">
                        <div class="mb-8">
                            <i class="fas fa-laptop-code text-6xl text-primary-200 mb-4"></i>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">강의실에 오신 것을 환영합니다!</h2>
                            <p class="text-slate-500 mt-2">왼쪽 메뉴를 통해 학습 활동을 진행해주세요.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <div class="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 bento-card cursor-pointer" onclick="loadTab('curriculum')">
                                <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-500 mb-4"><i class="fas fa-list-ol"></i></div>
                                <h3 class="font-bold text-slate-800 mb-1">커리큘럼 확인</h3>
                                <p class="text-xs text-slate-500">전체 학습 계획과 진도율을 확인하세요.</p>
                            </div>
                             <div class="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 bento-card cursor-pointer" onclick="loadTab('assignments')">
                                <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-500 mb-4"><i class="fas fa-tasks"></i></div>
                                <h3 class="font-bold text-slate-800 mb-1">과제 제출</h3>
                                <p class="text-xs text-slate-500">진행 중인 과제를 확인하고 제출하세요.</p>
                            </div>
                        </div>
                    </div>
                \`;
            } else if (tab === 'exam') {
                window.location.href = '/student'; // 시험은 통합 대시보드 사용
            } else {
                content.innerHTML = \`
                    <div class="text-center py-20">
                        <i class="fas fa-tools text-4xl text-slate-300 mb-4"></i>
                        <p class="text-slate-400 font-bold">서비스 준비 중입니다.</p>
                    </div>
                \`;
            }
        }
    </script>
</body>
</html>
`;
