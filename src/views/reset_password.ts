
export const resetPasswordHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>비밀번호 재설정 - 3DCookie HD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <div class="text-center mb-10">
            <div class="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6">
                <i class="fas fa-lock-open text-3xl"></i>
            </div>
            <h2 class="text-3xl font-black tracking-tight text-gray-900">비밀번호 재설정</h2>
            <p class="text-sm text-gray-400 mt-2">안전한 새로운 비밀번호를 설정해 주세요.</p>
        </div>

        <form id="resetForm" onsubmit="handleReset(event)" class="space-y-6">
            <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">새 비밀번호</label>
                <div class="relative">
                    <input type="password" id="password" required minlength="8" class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition text-sm" placeholder="8자 이상 입력">
                    <i class="fas fa-key absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
            </div>
            <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">비밀번호 확인</label>
                <div class="relative">
                    <input type="password" id="confirmPassword" required minlength="8" class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition text-sm" placeholder="비밀번호 다시 입력">
                    <i class="fas fa-check-circle absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
            </div>

            <button type="submit" id="submitBtn" class="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-blue-600 transition shadow-xl shadow-gray-200 flex items-center justify-center gap-2">
                비밀번호 변경하기
            </button>
        </form>
    </div>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            alert('잘못된 접근입니다. 비밀번호 찾기를 다시 진행해 주세요.');
            location.href = '/login';
        }

        async function handleReset(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirmPassword').value;
            const btn = document.getElementById('submitBtn');

            if (password !== confirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, new_password: password })
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    location.href = '/login';
                } else {
                    alert('실패: ' + result.error);
                }
            } catch (error) {
                alert('서버 연결 오류가 발생했습니다.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '비밀번호 변경하기';
            }
        }
    </script>
</body>
</html>
`;
