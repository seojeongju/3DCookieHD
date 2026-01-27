import { navigationHtml } from './components/navigation';

export const registerHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 - 와우쓰리디홍대센터</title>
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
    ${navigationHtml('register')}

    <!-- 메인 컨텐츠 -->
    <div class="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    회원가입
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    와우쓰리디홍대센터의 다양한 교육 서비스를 이용해보세요.
                </p>
            </div>
            <form class="mt-8 space-y-6" id="registerForm" onsubmit="handleRegister(event)">
                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input id="name" name="name" type="text" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="홍길동">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                        <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="example@email.com">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input id="password" name="password" type="password" autocomplete="new-password" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="영문, 숫자 포함 8자 이상">
                    </div>
                    <div>
                        <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                        <input id="passwordConfirm" name="passwordConfirm" type="password" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="비밀번호를 다시 입력해주세요">
                    </div>
            <!-- Role Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">가입 유형</label>
                        <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="role" value="student" checked class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" onchange="toggleTeacherNote()">
                                <span class="ml-2 text-sm text-gray-700">일반 훈련생</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="role" value="teacher" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" onchange="toggleTeacherNote()">
                                <span class="ml-2 text-sm text-gray-700">강사</span>
                            </label>
                        </div>
                        <p id="teacherNote" class="mt-2 text-xs text-orange-600 font-medium hidden flex items-center">
                            <i class="fas fa-exclamation-circle mr-1"></i> 강사 회원은 관리자 승인 후 로그인이 가능합니다.
                        </p>
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">휴대전화번호</label>
                        <input id="phone" name="phone" type="tel" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="010-0000-0000">
                    </div>
                </div>

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <i class="fas fa-user-plus text-primary-500 group-hover:text-primary-400"></i>
                        </span>
                        가입하기
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">
                        이미 계정이 있으신가요? 
                        <a href="/login" class="font-medium text-primary-600 hover:text-primary-500">
                            로그인하기
                        </a>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <script>
        function toggleTeacherNote() {
            const isTeacher = document.querySelector('input[name="role"]:checked').value === 'teacher';
            const note = document.getElementById('teacherNote');
            if (isTeacher) note.classList.remove('hidden');
            else note.classList.add('hidden');
        }

        async function handleRegister(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            const phone = document.getElementById('phone').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            // 유효성 검사
            if (password !== passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            if (password.length < 6) {
                alert('비밀번호는 최소 6자 이상이어야 합니다.');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        phone,
                        role
                    })
                });

                const result = await response.json();

                if (result.success) {
                    if (role === 'teacher') {
                        alert('회원가입이 완료되었습니다.\\n관리자 승인 후 로그인이 가능합니다.');
                    } else {
                        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                    }
                    location.href = '/login';
                } else {
                    alert('회원가입 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    </script>
</body>
</html>
`;
