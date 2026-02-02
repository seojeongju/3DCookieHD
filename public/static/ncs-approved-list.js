(function() {
    var tbody = document.getElementById('ncsApprovedListBody');
    if (!tbody) return;

    function escapeHtml(s) {
        if (s == null) return '';
        var a = document.createElement('span');
        a.textContent = s;
        return a.innerHTML;
    }

    function redirectToLogin() {
        var returnUrl = encodeURIComponent(window.location.pathname + (window.location.search || ''));
        window.location.href = '/login?redirect=' + returnUrl;
    }

    function load() {
        var token = localStorage.getItem('token');
        if (!token) {
            redirectToLogin();
            return;
        }
        fetch('/api/ncs/approved/registrations', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function(r) {
                if (r.status === 401) {
                    redirectToLogin();
                    return Promise.reject(new Error('Unauthorized'));
                }
                return r.json();
            })
            .then(function(json) {
                if (!json) return;
                if (!json.success || !Array.isArray(json.data)) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">목록을 불러올 수 없습니다.</td></tr>';
                    return;
                }
                var list = json.data;
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-12 text-center text-slate-500">등록된 과정개요가 없습니다.</td></tr>';
                    return;
                }
                tbody.innerHTML = list.map(function(row, i) {
                    var typ = row.ncs_tab === 'non_ncs' ? '비NCS' : 'NCS';
                    var name = row.ncs_tab === 'non_ncs'
                        ? (row.non_ncs_course_name || '-')
                        : (row.main_job_name ? (row.main_job_code || '') + '. ' + row.main_job_name : '-');
                    var updated = (row.updated_at || row.created_at || '').slice(0, 10);
                    return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-4 py-3">' + (i + 1) + '</td>' +
                        '<td class="px-4 py-3">' + escapeHtml(typ) + '</td>' +
                        '<td class="px-4 py-3">' + escapeHtml(name) + '</td>' +
                        '<td class="px-4 py-3">' + escapeHtml(updated) + '</td>' +
                        '<td class="px-4 py-3 text-right">' +
                        '<a href="/admin/ncs/approved/1?id=' + row.id + '" class="inline-block px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 mr-1">수정</a>' +
                        '<button type="button" class="ncs-approved-list-delete px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100" data-id="' + row.id + '">삭제</button>' +
                        '</td></tr>';
                }).join('');
                tbody.querySelectorAll('.ncs-approved-list-delete').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var id = btn.getAttribute('data-id');
                        if (!id || !confirm('이 과정개요를 삭제하시겠습니까?')) return;
                        var token = localStorage.getItem('token');
                        if (!token) { redirectToLogin(); return; }
                        fetch('/api/ncs/approved/registrations/' + id, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + token }
                        })
                            .then(function(r) {
                                if (r.status === 401) { redirectToLogin(); return null; }
                                return r.json();
                            })
                            .then(function(json) {
                                if (!json) return;
                                if (json.success) load();
                                else alert(json.error || '삭제 실패');
                            })
                            .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
                    });
                });
            })
            .catch(function(err) {
                if (err && err.message === 'Unauthorized') return;
                tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-red-500">목록을 불러오는데 실패했습니다.</td></tr>';
            });
    }

    load();
})();
