// 학사관리 메뉴 동적 업데이트 스크립트

function updateAcademicMenu() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // 학사관리 드롭다운 찾기
    const academicMenus = document.querySelectorAll('.academic-menu-dropdown');

    if (!academicMenus || academicMenus.length === 0) return;

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);

            academicMenus.forEach(menu => {
                let menuHTML = '';

                switch (user.role) {
                    case 'student':
                        menuHTML = `
                            <a href="/student" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-user-graduate mr-2"></i>학생 대시보드
                            </a>
                        `;
                        break;

                    case 'teacher':
                        menuHTML = `
                            <a href="/teacher" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-chalkboard-teacher mr-2"></i>강사 대시보드
                            </a>
                        `;
                        break;

                    case 'admin':
                        // 홈페이지 학사관리 하위메뉴: 대시보드 3개만 표시
                        menuHTML = `
                            <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-chart-line mr-2 text-purple-600"></i>통합 관리자 대시보드
                            </a>
                            <a href="/teacher" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-chalkboard-teacher mr-2 text-blue-600"></i>강사 대시보드
                            </a>
                            <a href="/student" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-user-graduate mr-2 text-green-600"></i>학생 대시보드
                            </a>
                        `;
                        break;

                    default:
                        // 로그인했지만 역할이 없는 경우
                        menuHTML = `
                            <a href="/login" class="block px-4 py-2 text-sm text-gray-500 italic">
                                로그인이 필요합니다
                            </a>
                        `;
                }

                menu.innerHTML = menuHTML;
            });
        } catch (e) {
            console.error('Failed to parse user data:', e);
        }
    } else {
        // 비로그인 상태
        academicMenus.forEach(menu => {
            menu.innerHTML = `
                <a href="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    <i class="fas fa-sign-in-alt mr-2"></i>로그인하기
                </a>
                <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    <i class="fas fa-user-plus mr-2"></i>회원가입
                </a>
            `;
        });
    }

    // Auth Menu (Top Right) Update
    const authMenu = document.getElementById('authMenu');
    if (authMenu) {
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                let menuHtml = '';

                // Dashboard Link based on role
                // Dashboard Link based on role
                if (user.role === 'admin') {
                    // 관리자는 학사관리 메뉴를 통해 대시보드로 이동하므로 헤더에는 별도 링크 없음
                } else if (user.role === 'teacher') {
                    menuHtml += `
                        <a href="/teacher" class="text-blue-600 hover:text-blue-700 font-bold whitespace-nowrap mr-4">
                            <i class="fas fa-chalkboard-teacher mr-1"></i> 강사 대시보드
                        </a>
                    `;
                } else {
                    menuHtml += `
                        <a href="/student" class="text-blue-600 hover:text-blue-700 font-bold whitespace-nowrap mr-4">
                            <i class="fas fa-user-graduate mr-1"></i> 나의 강의실
                        </a>
                    `;
                }

                menuHtml += `
                    <span class="text-gray-700 mr-2 text-sm">
                        <span class="font-bold">${user.name}</span>님
                    </span>
                    <button onclick="logout()" class="text-gray-500 hover:text-red-600 font-medium whitespace-nowrap text-sm">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                `;

                authMenu.innerHTML = menuHtml;
            } catch (e) {
                console.error('Failed to parse user data for auth menu:', e);
            }
        } else {
            // Not logged in - reset to default (Login/Register)
            // navigation.ts already provides the default, but if we need to reset it dynamically:
            authMenu.innerHTML = `
                <a href="/login" class="px-3 py-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition-colors">로그인</a>
                <a href="/register" class="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded transition-colors shadow-sm">회원가입</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// DOM 로드 시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAcademicMenu);
} else {
    updateAcademicMenu();
}
