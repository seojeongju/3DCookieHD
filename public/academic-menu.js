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
                        menuHTML = `
                            <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-user-shield mr-2"></i>관리자 대시보드
                            </a>
                            <a href="/admin/hrd" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-building mr-2"></i>HRD 시스템
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
}

// DOM 로드 시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAcademicMenu);
} else {
    updateAcademicMenu();
}
