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
                        // 관리자는 모든 페이지 접근 가능
                        menuHTML = `
                            <div class="px-2 py-1">
                                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">대시보드</p>
                            </div>
                            <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-user-shield mr-2 text-purple-600"></i>관리자 대시보드
                            </a>
                            <a href="/teacher" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-chalkboard-teacher mr-2 text-blue-600"></i>강사 대시보드
                            </a>
                            <a href="/student" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-user-graduate mr-2 text-green-600"></i>학생 대시보드
                            </a>
                            <div class="border-t border-gray-100 my-1"></div>
                            <div class="px-2 py-1">
                                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">HRD 시스템</p>
                            </div>
                            <a href="/admin/hrd" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-building mr-2 text-orange-600"></i>HRD 메인
                            </a>
                            <a href="/admin/personnel" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-users mr-2"></i>인원 관리
                            </a>
                            <a href="/admin/attendance" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                                <i class="fas fa-clipboard-check mr-2"></i>출결 관리
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
