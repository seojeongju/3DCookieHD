import { navigationHtml } from './components/navigation';

export const loginHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; overflow-x: hidden; }
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
        .bg-gradient-mesh {
            background-color: #f8fafc;
            background-image: 
                radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(210,100%,95%,1) 0, transparent 50%), 
                radial-gradient(at 100% 100%, hsla(250,100%,98%,1) 0, transparent 50%), 
                radial-gradient(at 0% 100%, hsla(210,100%,95%,1) 0, transparent 50%);
        }
        .floating-obj {
            position: absolute;
            z-index: -1;
            filter: blur(80px);
            opacity: 0.4;
            animation: float 20s infinite alternate;
        }
        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(100px, 50px) scale(1.2); }
        }
        .input-group:focus-within label {
            color: #3b82f6;
            transform: translateY(-2px);
        }
        .login-btn-gradient {
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            transition: all 0.3s ease;
        }
        .login-btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        }
    </style>
</head>
<body class="bg-gradient-mesh min-h-screen relative">
    <!-- 배경 장식 요소 -->
    <div class="floating-obj w-96 h-96 bg-blue-200 top-20 left-10 rounded-full"></div>
    <div class="floating-obj w-80 h-80 bg-purple-100 bottom-20 right-10 rounded-full" style="animation-delay: -5s;"></div>

    <!-- 네비게이션 -->
    ${navigationHtml('login')}

    <!-- 메인 컨티뉴 -->
    <div class="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full glass-card p-10 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
            <div class="text-center mb-10">
                <div class="flex justify-center mb-4">
                    <div class="bg-primary-50 p-3 rounded-2xl">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-10 w-auto">
                    </div>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 tracking-tight">로그인</h2>
                <p class="mt-3 text-gray-500 text-sm">와우쓰리디홍대센터 계정에 접속하세요.</p>
            </div>

            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                <button type="button" id="loginModeNormal" onclick="setLoginMode('normal')" class="py-2.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-sm">로그인</button>
                <button type="button" id="loginModeFirst" onclick="setLoginMode('first')" class="py-2.5 rounded-lg text-xs font-bold transition text-slate-500">처음 이용</button>
            </div>

            <form class="space-y-6" id="loginForm" onsubmit="handleLogin(event)">
                <div class="space-y-5">
                    <div class="input-group">
                        <label for="email" class="block text-sm font-semibold text-gray-600 mb-1.5 transition-all">이메일 주소</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                                <i class="far fa-envelope"></i>
                            </span>
                            <input id="email" name="email" type="email" autocomplete="email" required 
                                class="block w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm" 
                                placeholder="example@email.com">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="password" class="block text-sm font-semibold text-gray-600 mb-1.5 transition-all">비밀번호</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                                <i class="fas fa-lock text-xs"></i>
                            </span>
                            <input id="password" name="password" type="password" autocomplete="current-password" required 
                                class="block w-full pl-10 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm" 
                                placeholder="••••••••">
                            <button type="button" onclick="togglePasswordVisibility()" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors">
                                <i id="passwordToggleIcon" class="far fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" 
                            class="h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-colors">
                        <label for="remember-me" class="ml-2.5 block text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                            로그인 상태 유지
                        </label>
                    </div>

                    <a href="javascript:void(0)" onclick="openForgotModal()" class="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-4 transition-all">
                        비밀번호 찾기
                    </a>
                </div>

                <div class="pt-2">
                    <button type="submit" id="loginBtn" class="login-btn-gradient w-full py-3.5 px-4 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        로그인
                    </button>
                    <div id="loginStatus" class="hidden mt-3 p-3 rounded-lg text-xs font-medium text-center"></div>
                </div>
            </form>

            <form class="space-y-5 hidden" id="firstLoginForm" onsubmit="handleFirstLogin(event)">
                <div class="bg-sky-50/80 rounded-xl p-4">
                    <p class="text-[13px] text-sky-800 leading-relaxed font-medium">
                        관리자가 등록한 수강생은 비밀번호를 따로 받지 않습니다.<br>
                        등록된 <b>이메일</b>과 안내 메일(또는 담당자)로 받은 <b>과정 인증 코드</b>로 비밀번호를 직접 설정하세요.
                    </p>
                </div>
                <div class="input-group">
                    <label for="firstEmail" class="block text-sm font-semibold text-gray-600 mb-1.5">이메일 주소</label>
                    <input id="firstEmail" name="firstEmail" type="email" autocomplete="email" required
                        class="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm"
                        placeholder="등록된 이메일">
                </div>
                <div class="input-group">
                    <label for="firstPin" class="block text-sm font-semibold text-gray-600 mb-1.5">과정 인증 코드 (PIN)</label>
                    <input id="firstPin" name="firstPin" type="text" inputmode="numeric" autocomplete="one-time-code" required maxlength="12"
                        class="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm tracking-[0.3em] text-center font-bold"
                        placeholder="인증 코드">
                </div>
                <div class="input-group">
                    <label for="firstPassword" class="block text-sm font-semibold text-gray-600 mb-1.5">새 비밀번호</label>
                    <input id="firstPassword" name="firstPassword" type="password" autocomplete="new-password" required minlength="6"
                        class="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm"
                        placeholder="6자 이상">
                </div>
                <div class="input-group">
                    <label for="firstPasswordConfirm" class="block text-sm font-semibold text-gray-600 mb-1.5">새 비밀번호 확인</label>
                    <input id="firstPasswordConfirm" name="firstPasswordConfirm" type="password" autocomplete="new-password" required minlength="6"
                        class="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-500 transition-all sm:text-sm"
                        placeholder="비밀번호 재입력">
                </div>
                <button type="submit" id="firstLoginBtn" class="login-btn-gradient w-full py-3.5 px-4 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    비밀번호 설정 후 입장
                </button>
                <div id="firstLoginStatus" class="hidden mt-3 p-3 rounded-lg text-xs font-medium text-center"></div>
            </form>

            <div id="loginFooterLinks">
                <div class="relative pt-6">
                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-gray-100"></div>
                    </div>
                    <div class="relative flex justify-center text-xs">
                        <span class="px-3 bg-white/10 text-gray-400">또는</span>
                    </div>
                </div>

                <div class="text-center pt-2">
                    <p class="text-sm text-gray-600">
                        아직 회원이 아니신가요? 
                        <a href="/register" class="ml-1 font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            회원가입하기
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- 비밀번호 찾기 모달 -->
    <div id="forgotModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] items-center justify-center p-4 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
            <div class="px-6 sm:px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                <h3 class="text-xl font-bold text-gray-900 tracking-tight">비밀번호 찾기</h3>
                <button type="button" onclick="closeForgotModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 shadow-sm transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6 sm:p-8">
                <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                    <button type="button" id="forgotTabIdentity" onclick="setForgotTab('identity')" class="py-2.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-sm">본인 인증</button>
                    <button type="button" id="forgotTabEmail" onclick="setForgotTab('email')" class="py-2.5 rounded-lg text-xs font-bold transition text-slate-500">이메일 링크</button>
                </div>

                <!-- 본인 인증 (기본) -->
                <div id="forgotPanelIdentity" class="space-y-4">
                    <div class="bg-emerald-50/80 rounded-xl p-4">
                        <p class="text-[13px] text-emerald-800 leading-relaxed font-medium">
                            <i class="fas fa-shield-alt mr-1.5 opacity-70"></i>
                            가입 시 등록한 <b>이메일·이름·연락처</b>가 일치하면 바로 새 비밀번호를 설정할 수 있습니다. (학생·강사·관리자 공통)
                        </p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">이메일</label>
                        <input type="email" id="forgotIdEmail" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm" placeholder="example@email.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">이름</label>
                        <input type="text" id="forgotIdName" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm" placeholder="실명">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">연락처</label>
                        <input type="tel" id="forgotIdPhone" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm" placeholder="010-0000-0000">
                    </div>
                    <button type="button" onclick="handleIdentityReset()" id="forgotIdentityBtn" class="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                        본인 확인 후 재설정
                    </button>
                </div>

                <!-- 이메일 링크 -->
                <div id="forgotPanelEmail" class="space-y-4 hidden">
                    <div class="bg-blue-50/50 rounded-xl p-4">
                        <p class="text-[13px] text-blue-700 leading-relaxed font-medium">
                            <i class="fas fa-envelope mr-1.5 opacity-70"></i>
                            등록된 이메일로 재설정 링크를 보냅니다. 메일이 오지 않으면 <b>본인 인증</b> 탭을 이용해 주세요.
                        </p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">이메일 주소</label>
                        <input type="email" id="forgotEmail" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all placeholder-gray-400 text-sm" placeholder="example@email.com">
                    </div>
                    <button type="button" onclick="handleForgotSubmit()" id="forgotBtn" class="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                        재설정 링크 발송
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function setLoginMode(mode) {
            var normalForm = document.getElementById('loginForm');
            var firstForm = document.getElementById('firstLoginForm');
            var tabN = document.getElementById('loginModeNormal');
            var tabF = document.getElementById('loginModeFirst');
            var on = 'py-2.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-sm';
            var off = 'py-2.5 rounded-lg text-xs font-bold transition text-slate-500';
            if (mode === 'first') {
                normalForm.classList.add('hidden');
                firstForm.classList.remove('hidden');
                tabF.className = on;
                tabN.className = off;
                var em = document.getElementById('email');
                var fe = document.getElementById('firstEmail');
                if (em && fe && em.value && !fe.value) fe.value = em.value;
            } else {
                firstForm.classList.add('hidden');
                normalForm.classList.remove('hidden');
                tabN.className = on;
                tabF.className = off;
            }
        }

        function finishAuthSuccess(user, token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            const redirect = new URLSearchParams(location.search).get('redirect');
            if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.toLowerCase().startsWith('/login')) {
                location.href = redirect;
                return;
            }
            if (user.role === 'admin') location.href = '/admin';
            else if (user.role === 'teacher') location.href = '/teacher';
            else if (user.role === 'student' || user.role === 'user') location.href = '/student';
            else location.href = '/';
        }

        async function handleFirstLogin(e) {
            e.preventDefault();
            var email = document.getElementById('firstEmail').value.trim();
            var pin = document.getElementById('firstPin').value.trim();
            var password = document.getElementById('firstPassword').value;
            var confirm = document.getElementById('firstPasswordConfirm').value;
            var btn = document.getElementById('firstLoginBtn');
            var statusDiv = document.getElementById('firstLoginStatus');
            if (password !== confirm) {
                statusDiv.textContent = '비밀번호가 서로 다릅니다.';
                statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-red-50 text-red-700 block';
                return;
            }
            btn.disabled = true;
            var original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            statusDiv.classList.add('hidden');
            try {
                var res = await fetch('/api/auth/student-first-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, pin: pin, password: password })
                });
                var result = await res.json();
                if (result.success && result.data) {
                    statusDiv.textContent = '비밀번호가 설정되었습니다. 이동 중...';
                    statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-green-50 text-green-700 block';
                    setTimeout(function() { finishAuthSuccess(result.data.user, result.data.token); }, 400);
                    return;
                }
                statusDiv.textContent = result.error || '비밀번호 설정에 실패했습니다.';
                statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-red-50 text-red-700 block';
            } catch (err) {
                statusDiv.textContent = '서버 연결 오류가 발생했습니다.';
                statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-red-50 text-red-700 block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = original;
            }
        }

        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const icon = document.getElementById('passwordToggleIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function setForgotTab(tab) {
            var identity = document.getElementById('forgotPanelIdentity');
            var email = document.getElementById('forgotPanelEmail');
            var tabId = document.getElementById('forgotTabIdentity');
            var tabEm = document.getElementById('forgotTabEmail');
            if (tab === 'email') {
                identity.classList.add('hidden');
                email.classList.remove('hidden');
                tabEm.className = 'py-2.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-sm';
                tabId.className = 'py-2.5 rounded-lg text-xs font-bold transition text-slate-500';
            } else {
                email.classList.add('hidden');
                identity.classList.remove('hidden');
                tabId.className = 'py-2.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-sm';
                tabEm.className = 'py-2.5 rounded-lg text-xs font-bold transition text-slate-500';
            }
        }

        function openForgotModal() { 
            const modal = document.getElementById('forgotModal');
            modal.classList.remove('hidden'); 
            modal.classList.add('flex');
            setForgotTab('identity');
            var loginEmail = document.getElementById('email');
            if (loginEmail && loginEmail.value) {
                var fe = document.getElementById('forgotEmail');
                var fie = document.getElementById('forgotIdEmail');
                if (fe) fe.value = loginEmail.value;
                if (fie) fie.value = loginEmail.value;
            }
        }
        function closeForgotModal() { 
            const modal = document.getElementById('forgotModal');
            setTimeout(() => {
                modal.classList.add('hidden'); 
                modal.classList.remove('flex');
            }, 50);
        }

        async function handleIdentityReset() {
            var email = document.getElementById('forgotIdEmail').value.trim();
            var name = document.getElementById('forgotIdName').value.trim();
            var phone = document.getElementById('forgotIdPhone').value.trim();
            if (!email || !name || !phone) { alert('이메일, 이름, 연락처를 모두 입력해 주세요.'); return; }

            var btn = document.getElementById('forgotIdentityBtn');
            var originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 확인 중...';

            try {
                var res = await fetch('/api/auth/verify-identity-reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, name: name, phone: phone })
                });
                var result = await res.json();
                if (result.success && result.data && result.data.reset_token) {
                    location.href = '/reset-password?token=' + encodeURIComponent(result.data.reset_token);
                    return;
                }
                alert(result.error || '본인 확인에 실패했습니다.');
            } catch (e) {
                alert('서버 연결 오류');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }

        async function handleForgotSubmit() {
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) { alert('이메일을 입력해 주세요.'); return; }

            const btn = document.getElementById('forgotBtn');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 발송 중...';

            try {
                const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                const result = await res.json();
                if (result.success) {
                    alert(result.message || '이메일이 발송되었습니다. 메일함(또는 스팸함)을 확인해 주세요.');
                    closeForgotModal();
                } else {
                    alert((result.error || '발송에 실패했습니다.') + '\\n\\n본인 인증 탭에서 이름·연락처로 바로 재설정할 수 있습니다.');
                    setForgotTab('identity');
                    var fie = document.getElementById('forgotIdEmail');
                    if (fie) fie.value = email;
                }
            } catch (e) {
                alert('서버 연결 오류');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const statusDiv = document.getElementById('loginStatus');

            // 로딩 상태 표시
            loginBtn.disabled = true;
            const originalBtnContent = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            statusDiv.classList.add('hidden');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const result = await response.json();
                    if (result.success) {
                        const { user, token } = result.data;
                        statusDiv.textContent = '로그인 성공! 이동 중...';
                        statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-green-50 text-green-700 block';
                        setTimeout(function() { finishAuthSuccess(user, token); }, 400);
                    } else {
                        statusDiv.textContent = result.error || '이메일 또는 비밀번호를 다시 확인해주세요.';
                        statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-red-50 text-red-700 block';
                        loginBtn.disabled = false;
                        loginBtn.innerHTML = originalBtnContent;
                        if (result.error && result.error.indexOf('처음 이용') !== -1) {
                            setLoginMode('first');
                            var fe = document.getElementById('firstEmail');
                            if (fe) fe.value = email;
                        }
                    }
                } else {
                    const text = await response.text();
                    console.error('Server response:', text);
                    alert('서버 오류가 발생했습니다. (응답 형식이 JSON이 아님)');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = originalBtnContent;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다: ' + error.message);
                loginBtn.disabled = false;
                loginBtn.innerHTML = originalBtnContent;
            }
        }
    </script>
</body>
</html>
`;
