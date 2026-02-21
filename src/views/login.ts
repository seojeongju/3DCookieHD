import { navigationHtml } from './components/navigation';

export const loginHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 - 와우쓰리디홍대센터</title>
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
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    ${navigationHtml('login')}


    <!-- 메인 컨텐츠 -->
    <div class="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    로그인
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    와우쓰리디홍대센터에 오신 것을 환영합니다.
                </p>
            </div>
            <form class="mt-8 space-y-6" id="loginForm" onsubmit="handleLogin(event)">
                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                        <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="example@email.com">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="비밀번호 입력">
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                            로그인 상태 유지
                        </label>
                    </div>

                    <div class="text-sm">
                    <div class="text-sm">
                        <a href="javascript:void(0)" onclick="openForgotModal()" class="font-medium text-primary-600 hover:text-primary-500">
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
                </div>

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <i class="fas fa-sign-in-alt text-primary-500 group-hover:text-primary-400"></i>
                        </span>
                        로그인
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">
                        아직 회원이 아니신가요? 
                        <a href="/register" class="font-medium text-primary-600 hover:text-primary-500">
                            회원가입하기
                        </a>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <!-- 비밀번호 찾기 모달 -->
    <div id="forgotModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-900 tracking-tight">비밀번호 찾기</h3>
                <button onclick="closeForgotModal()" class="text-gray-400 hover:text-gray-600 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-8">
                <p class="text-sm text-gray-500 mb-6 leading-relaxed">가입 시 사용한 이메일 주소를 입력해 주세요.<br>비밀번호 재설정 링크를 보내드립니다.</p>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">이메일 주소</label>
                        <input type="email" id="forgotEmail" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-100 outline-none transition" placeholder="example@email.com">
                    </div>
                    <button onclick="handleForgotSubmit()" id="forgotBtn" class="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition flex items-center justify-center gap-2">
                        재설정 링크 발송
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openForgotModal() { document.getElementById('forgotModal').classList.remove('hidden'); }
        function closeForgotModal() { document.getElementById('forgotModal').classList.add('hidden'); }

        async function handleForgotSubmit() {
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) { alert('이메일을 입력해 주세요.'); return; }

            const btn = document.getElementById('forgotBtn');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 발송 중...';

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
                        const redirect = new URLSearchParams(location.search).get('redirect');
                        if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.toLowerCase().startsWith('/login')) {
                            location.href = redirect;
                            return;
                        }
                        if (user.role === 'admin') {
                            location.href = '/admin';
                        } else if (user.role === 'teacher') {
                            location.href = '/teacher';
                        } else if (user.role === 'student') {
                            location.href = '/student';
                        } else {
                            location.href = '/';
                        }
                    } else {
                        alert('로그인 실패: ' + result.error);
                    }
                } else {
                    const text = await response.text();
                    console.error('Server response:', text);
                    alert('서버 오류가 발생했습니다. (응답 형식이 JSON이 아님) ' + text.substring(0, 100));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다: ' + error.message);
            }
        }
    </script>
</body>
</html>
`;
