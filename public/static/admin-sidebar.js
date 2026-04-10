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
    var token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
    }
    fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(function (r) { return r.json(); })
        .then(function (result) {
            if (!result || !result.success || !result.data) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return;
            }
            var user = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            var role = user.role;
            if (pathname.startsWith('/admin')) {
                if (role !== 'admin') {
                    if (role === 'teacher') {
                        window.location.href = '/teacher';
                    } else if (role === 'student' || role === 'user') {
                        window.location.href = '/student';
                    } else {
                        window.location.href = '/';
                    }
                    return;
                }
            } else if (pathname.startsWith('/teacher')) {
                if (role !== 'teacher' && role !== 'admin') {
                    if (role === 'student' || role === 'user') {
                        window.location.href = '/student';
                    } else {
                        window.location.href = '/login';
                    }
                    return;
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
        })
        .catch(function () {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
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

    var accordionToggles = document.querySelectorAll('.sidebar-accordion-toggle');
    for (var k = 0; k < accordionToggles.length; k++) {
        accordionToggles[k].addEventListener('click', function() {
            var isOpen = this.classList.contains('open');
            var content = this.nextElementSibling;
            var chevron = this.querySelector('.chevron-icon');
            
            if (isOpen) {
                this.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('max-h-[1000px]', 'opacity-100', 'mt-1');
                content.classList.add('max-h-0', 'opacity-0');
                if (chevron) chevron.classList.remove('rotate-180');
            } else {
                this.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-[1000px]', 'opacity-100', 'mt-1');
                if (chevron) chevron.classList.add('rotate-180');
            }
        });
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
                        // URL /courses/{id}/lms 는 LMS courses.id 기준. 회차 PK(s.id)와 숫자가 겹치면 잘못된 과정이 선택됨 → lms_course_id 우선
                        var lmsId = s.lms_course_id != null && String(s.lms_course_id).trim() !== '' ? String(s.lms_course_id) : String(s.id);
                        opt.value = lmsId;

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
                    if (match && match[2]) {
                        var urlCid = String(match[2]);
                        var has = Array.prototype.some.call(courseSelector.options, function (o) {
                            return o.value === urlCid;
                        });
                        if (has) courseSelector.value = urlCid;
                    }
                }
            })
            .catch(function (err) { console.error('Sidebar course load error:', err); });
    }

    // Fetch and update institution name in sidebar
    fetch('/api/settings/institution_name')
        .then(function (r) { return r.json(); })
        .then(function (res) {
            if (res.success && res.data) {
                var brandEl = document.getElementById('sidebar-logo-brand');
                var subEl = document.getElementById('sidebar-logo-sub');
                if (brandEl) {
                    var parts = res.data.split(' ');
                    brandEl.textContent = parts[0];
                    if (subEl) {
                        subEl.textContent = (parts.slice(1).join(' ') || '센터') + ' ADMIN';
                    }
                }
            }
        }).catch(function (e) { });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminSidebar);
} else {
    initAdminSidebar();
}
