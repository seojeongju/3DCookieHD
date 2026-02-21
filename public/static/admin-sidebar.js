/* Admin/Teacher sidebar - used by hrd_sidebar (admin pages) */
(function () {
    var wrap = document.getElementById('adminSidebarWrap');
    var backdrop = document.getElementById('adminSidebarBackdrop');
    var toggle = document.getElementById('adminSidebarToggle');
    function openSidebar() { wrap && wrap.classList.add('translate-x-0'); wrap && wrap.classList.remove('-translate-x-full'); backdrop && backdrop.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
    function closeSidebar() { wrap && wrap.classList.remove('translate-x-0'); wrap && wrap.classList.add('-translate-x-full'); backdrop && backdrop.classList.add('hidden'); document.body.style.overflow = ''; }
    if (toggle) { toggle.addEventListener('click', function () { wrap && wrap.classList.contains('-translate-x-full') ? openSidebar() : closeSidebar(); }); }
    if (backdrop) { backdrop.addEventListener('click', closeSidebar); }
    if (wrap) { wrap.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSidebar); }); }
    var mainWrap = document.getElementById('adminSidebarWrap') && document.getElementById('adminSidebarWrap').nextElementSibling;
    if (mainWrap) mainWrap.classList.add('pl-14', 'lg:pl-0');
})();

window.logout = function () {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.href = '/login';
    }
};

(function () {
    var pathname = window.location.pathname;
    var userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/login';
        return;
    }
    try {
        var user = JSON.parse(userStr);
        var role = user.role;
        if (pathname.startsWith('/admin')) {
            if (role !== 'admin') {
                console.warn('Unauthorized access to admin page. Redirecting...');
                if (role === 'teacher') {
                    window.location.href = '/teacher';
                } else if (role === 'student' || role === 'user') {
                    window.location.href = '/student';
                } else {
                    window.location.href = '/';
                }
            }
        } else if (pathname.startsWith('/teacher')) {
            if (role !== 'teacher' && role !== 'admin') {
                console.warn('Unauthorized access to teacher page. Redirecting...');
                if (role === 'student' || role === 'user') {
                    window.location.href = '/student';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        var avatarEl = document.getElementById('sidebar-avatar');
        var usernameEl = document.getElementById('sidebar-username');
        var roleEl = document.getElementById('sidebar-userrole');
        var logoBrandEl = document.getElementById('sidebar-logo-brand');
        var logoSubEl = document.getElementById('sidebar-logo-sub');
        if (avatarEl && user.name) {
            avatarEl.textContent = user.name.charAt(0);
        }
        if (usernameEl) {
            usernameEl.textContent = user.name || 'User';
        }
        if (roleEl) {
            var roleLabels = { admin: 'Super Admin', teacher: 'Instructor', student: 'Student', user: 'User' };
            roleEl.textContent = roleLabels[role] || role;
        }
        if (role !== 'admin') {
            if (logoSubEl) logoSubEl.textContent = '홍대센터 LMS';
            document.querySelectorAll('[data-role="admin-only"]').forEach(function (el) {
                el.style.display = 'none';
            });
        }
    } catch (e) {
        console.error('Auth check error:', e);
        window.location.href = '/login';
    }
})();

function initAdminSidebar() {
    var sidebarNav = document.querySelector('aside nav');
    if (sidebarNav) {
        var savedScrollTop = sessionStorage.getItem('sidebarScrollTop');
        if (savedScrollTop) {
            sidebarNav.scrollTop = parseInt(savedScrollTop, 10);
        }
        var links = sidebarNav.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            (function (link) {
                link.addEventListener('click', function () {
                    sessionStorage.setItem('sidebarScrollTop', sidebarNav.scrollTop);
                });
            })(links[i]);
        }
    }
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () { window.logout(); });
    }
    var courseSelector = document.getElementById('sidebarActiveCourseSelector');
    var token = localStorage.getItem('token');
    if (courseSelector && token) {
        fetch('/api/course-sessions?status=in_progress', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (r) { return r.json(); })
            .then(function (res) {
                if (res.success && res.data) {
                    for (var j = 0; j < res.data.length; j++) {
                        var s = res.data[j];
                        var opt = document.createElement('option');
                        opt.value = s.id;

                        var courseName = s.course_name || '';
                        var sessionNum = s.session_number != null ? String(s.session_number) + '회차' : '';
                        var sessionNamePart = (s.session_name || '').trim();
                        var parts = [courseName];
                        if (sessionNum) parts.push(sessionNum);
                        if (sessionNamePart) parts.push(sessionNamePart);
                        opt.textContent = parts.filter(Boolean).join(' + ');

                        courseSelector.appendChild(opt);
                    }
                    var match = location.pathname.match(/\/(admin|teacher)\/courses\/(\d+)\/lms/);
                    if (match && match[2]) courseSelector.value = match[2];
                }
            })
            .catch(function (err) { console.error('Sidebar course load error:', err); });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminSidebar);
} else {
    initAdminSidebar();
}
