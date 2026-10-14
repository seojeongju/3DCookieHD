// 학사관리 메뉴 동적 업데이트 스크립트 (데스크톱 드롭다운 + 모바일 드로어 공용)

function escapeMenuText(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

// 역할별 학사관리 링크 목록
function getAcademicLinks(user) {
    if (!user) {
        return [
            { href: '/login', icon: 'fa-sign-in-alt', label: '로그인하기' },
            { href: '/register', icon: 'fa-user-plus', label: '회원가입' },
        ];
    }
    switch (user.role) {
        case 'student':
            return [{ href: '/student', icon: 'fa-user-graduate', label: '학생 대시보드' }];
        case 'teacher':
            return [{ href: '/teacher', icon: 'fa-chalkboard-teacher', label: '강사 대시보드' }];
        case 'admin':
            // 홈페이지 학사관리 하위메뉴: 대시보드 3개만 표시
            return [
                { href: '/admin', icon: 'fa-chart-line', color: 'text-purple-600', label: '통합 관리자 대시보드' },
                { href: '/teacher', icon: 'fa-chalkboard-teacher', color: 'text-blue-600', label: '강사 대시보드' },
                { href: '/student', icon: 'fa-user-graduate', color: 'text-green-600', label: '학생 대시보드' },
            ];
        default:
            return [{ href: '/login', icon: 'fa-sign-in-alt', label: '로그인이 필요합니다' }];
    }
}

function readStoredUser() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
    }
}

function updateAcademicMenu() {
    const user = readStoredUser();
    const links = getAcademicLinks(user);

    document.querySelectorAll('.academic-menu-dropdown').forEach(function (menu) {
        menu.innerHTML = links.map(function (l) {
            return '<a href="' + l.href + '" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 whitespace-nowrap">' +
                '<i class="fas ' + l.icon + ' mr-2 ' + (l.color || '') + '"></i>' + l.label + '</a>';
        }).join('');
    });

    document.querySelectorAll('.academic-menu-mobile').forEach(function (menu) {
        menu.innerHTML = links.map(function (l) {
            return '<a href="' + l.href + '" class="flex items-center px-4 py-3 text-gray-700 font-medium hover:bg-purple-100/60 hover:text-purple-700">' +
                '<i class="fas ' + l.icon + ' w-5 text-center mr-2.5 text-xs ' + (l.color || 'text-purple-500') + '" aria-hidden="true"></i>' + l.label +
                '<i class="fas fa-chevron-right ml-auto text-[10px] text-gray-300" aria-hidden="true"></i></a>';
        }).join('');
    });

    // 모바일 드로어 하단: 로그인 상태면 사용자 이름 + 로그아웃
    const mobileAuth = document.getElementById('navMobileAuth');
    if (mobileAuth && user) {
        mobileAuth.innerHTML =
            '<div class="flex items-center justify-between px-4 py-3">' +
            '<span class="text-sm text-gray-700"><i class="fas fa-user-circle mr-2 text-gray-400"></i><span class="font-bold">' + escapeMenuText(user.name) + '</span>님</span>' +
            '<button type="button" onclick="logout()" class="text-sm text-gray-500 hover:text-red-600 font-medium"><i class="fas fa-sign-out-alt mr-1"></i>로그아웃</button>' +
            '</div>';
    }

    // 상단 우측 메뉴: 좁은 화면에서는 대시보드 링크를 아이콘만, 이름은 숨김
    const authMenu = document.getElementById('authMenu');
    if (!authMenu) return;
    if (user) {
        let menuHtml = '';
        // 관리자는 데스크톱에서 학사관리 버튼으로 이동하므로 바로가기 아이콘은 모바일에서만 노출
        if (user.role === 'admin') {
            menuHtml += '<a href="/admin" title="관리자 대시보드" class="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-purple-600 hover:text-purple-700">' +
                '<i class="fas fa-chart-line"></i></a>';
        } else if (user.role === 'teacher') {
            menuHtml += '<a href="/teacher" title="강사 대시보드" class="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-blue-600 hover:text-blue-700 font-bold whitespace-nowrap sm:mr-3">' +
                '<i class="fas fa-chalkboard-teacher sm:mr-1"></i><span class="hidden sm:inline"> 강사 대시보드</span></a>';
        } else {
            menuHtml += '<a href="/student" title="나의 강의실" class="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-blue-600 hover:text-blue-700 font-bold whitespace-nowrap sm:mr-3">' +
                '<i class="fas fa-user-graduate sm:mr-1"></i><span class="hidden sm:inline"> 나의 강의실</span></a>';
        }
        menuHtml +=
            '<span class="hidden sm:inline text-gray-700 mr-2 text-sm"><span class="font-bold">' + escapeMenuText(user.name) + '</span>님</span>' +
            '<button type="button" onclick="logout()" title="로그아웃" class="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-500 hover:text-red-600 font-medium whitespace-nowrap text-sm">' +
            '<i class="fas fa-sign-out-alt sm:mr-1"></i><span class="hidden sm:inline"> 로그아웃</span></button>';
        authMenu.innerHTML = menuHtml;
    } else {
        authMenu.innerHTML =
            '<a href="/login" class="px-2 sm:px-3 py-2 min-h-[44px] sm:min-h-0 flex items-center text-gray-500 hover:text-primary-600 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap">로그인</a>' +
            '<a href="/register" class="px-2.5 sm:px-4 py-2 min-h-[44px] sm:min-h-0 flex items-center bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">회원가입</a>';
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
