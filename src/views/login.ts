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
            </form>
        </div>
    </div>

    <!-- 비밀번호 찾기 모달 -->
    <div id="forgotModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 class="text-xl font-bold text-gray-900 tracking-tight">비밀번호 찾기</h3>
                <button onclick="closeForgotModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 shadow-sm transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-8">
                <div class="bg-blue-50/50 rounded-xl p-4 mb-6">
                    <p class="text-[13px] text-blue-700 leading-relaxed font-medium">
                        <i class="fas fa-info-circle mr-1.5 opacity-70"></i>
                        가입 시 사용한 이메일 주소를 입력해 주세요. 비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>
                <div class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">이메일 주소</label>
                        <input type="email" id="forgotEmail" 
                            class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all placeholder-gray-400" 
                            placeholder="example@email.com">
                    </div>
                    <button onclick="handleForgotSubmit()" id="forgotBtn" 
                        class="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                        재설정 링크 발송
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
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

        function openForgotModal() { 
            const modal = document.getElementById('forgotModal');
            modal.classList.remove('hidden'); 
            modal.classList.add('flex');
            setTimeout(() => {
                modal.querySelector('div').classList.add('scale-100');
                modal.querySelector('div').classList.remove('scale-95');
            }, 10);
        }
        function closeForgotModal() { 
            const modal = document.getElementById('forgotModal');
            modal.querySelector('div').classList.add('scale-95');
            modal.querySelector('div').classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden'); 
                modal.classList.remove('flex');
            }, 200);
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
                    body: JSON.stringify({ email })
                });
                const result = await res.json();
                if (result.success) {
                    alert('이메일이 발송되었습니다. 메일함(또는 스팸함)을 확인해 주세요.');
                    closeForgotModal();
                } else {
                    alert('발송 실패: ' + result.error);
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
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));
                        
                        statusDiv.textContent = '로그인 성공! 이동 중...';
                        statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-green-50 text-green-700 block';

                        const redirect = new URLSearchParams(location.search).get('redirect');
                        setTimeout(() => {
                            if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.toLowerCase().startsWith('/login')) {
                                location.href = redirect;
                                return;
                            }
                            if (user.role === 'admin') {
                                location.href = '/admin';
                            } else if (user.role === 'teacher') {
                                location.href = '/teacher';
                            } else if (user.role === 'student' || user.role === 'user') {
                                location.href = '/student';
                            } else {
                                location.href = '/';
                            }
                        }, 500);
                    } else {
                        statusDiv.textContent = result.error || '이메일 또는 비밀번호를 다시 확인해주세요.';
                        statusDiv.className = 'mt-3 p-3 rounded-lg text-xs font-medium text-center bg-red-50 text-red-700 block';
                        loginBtn.disabled = false;
                        loginBtn.innerHTML = originalBtnContent;
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
