import { hrdSidebar } from './components/hrd_sidebar';

export const adminEducationPerformanceHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육실적 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans custom-scrollbar">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('education-performance')}
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 shadow-sm z-10">
                <div>
                    <h2 class="text-xl font-black text-slate-800 tracking-tight">교육실적 관리</h2>
                    <p class="text-sm text-slate-500">센터소개 &gt; 교육실적 페이지에 표시되는 실적을 등록·수정합니다. 교육사진 갤러리 글과 연동하면 제목·일자가 갤러리와 동일하게 유지됩니다.</p>
                </div>
                <div class="flex gap-2">
                    <button type="button" onclick="openGalleryModal()" class="px-4 py-2.5 bg-white text-slate-800 rounded-2xl hover:bg-slate-50 transition font-bold text-sm shadow-sm border border-slate-200/60">
                        <i class="fas fa-images mr-2 text-emerald-600"></i>교육사진에서 불러오기
                    </button>
                    <button type="button" onclick="openModal()" class="px-4 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold text-sm shadow-sm border border-slate-200/60">
                        <i class="fas fa-plus mr-2"></i>실적 추가
                    </button>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden bento-card">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-slate-200/60">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">연동</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">일자</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">실적 내용</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">카테고리</th>
                                <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="listBody" class="divide-y divide-slate-100">
                            <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400">로딩 중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <div id="galleryModal" class="hidden fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-[2.5rem] shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col border border-slate-200/60">
            <div class="p-6 border-b border-slate-100 shrink-0">
                <h3 class="text-lg font-black text-slate-800 tracking-tight">교육사진 갤러리에서 실적 반영</h3>
                <p class="text-sm text-slate-500 mt-1">체크한 글을 교육실적 리스트에 추가합니다. 이미 등록된 글은 건너뜁니다.</p>
            </div>
            <div id="galleryListWrap" class="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar min-h-[200px]">
                <p class="text-slate-400 text-sm text-center py-8">불러오는 중...</p>
            </div>
            <div class="p-6 border-t border-slate-100 flex gap-3 shrink-0">
                <button type="button" onclick="closeGalleryModal()" class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition">취소</button>
                <button type="button" onclick="submitGalleryImport()" class="flex-1 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition">선택 반영</button>
            </div>
        </div>
    </div>

    <div id="modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200/60">
            <div class="p-6 border-b border-slate-100">
                <h3 id="modalTitle" class="text-lg font-bold text-slate-800">실적 추가</h3>
            </div>
            <form id="form" onsubmit="save(event)" class="p-6 space-y-4">
                <input type="hidden" id="editId" value="">
                <input type="hidden" id="editGalleryLinked" value="0">
                <input type="hidden" id="editPostId" value="">
                <div id="galleryHelpBox" class="hidden rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 space-y-2">
                    <p><i class="fas fa-link mr-1"></i>이 실적은 <strong>교육사진 갤러리</strong> 글과 연동되어 있습니다. 제목·일자는 갤러리 글을 기준으로 표시됩니다.</p>
                    <button type="button" onclick="syncFromGallery()" class="w-full py-2 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-800 text-sm hover:bg-emerald-50 transition">갤러리 글과 제목·일자 동기화</button>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">실적 일자 <span class="text-red-500">*</span></label>
                    <input type="text" id="performed_at" required class="w-full px-4 py-2.5 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 2025. 10">
                    <p class="text-xs text-slate-500 mt-1">예: 2016. 09, 2024. 12 (갤러리 연동 시 갤러리 글 작성일 기준)</p>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">실적 내용 <span class="text-red-500">*</span></label>
                    <input type="text" id="title" required class="w-full px-4 py-2.5 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: OO중학교 3D프린팅 진로체험학습">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">카테고리 (선택)</label>
                    <input type="text" id="category" class="w-full px-4 py-2.5 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 진로체험, 자격증, 기업교육">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">표시 순서</label>
                    <input type="number" id="sort_order" min="0" class="w-full px-4 py-2.5 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="0">
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="closeModal()" class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition">취소</button>
                    <button type="submit" class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition">저장</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        var allList = [];
        var gallerySelectedIds = {};

        function esc(s) {
            if (s == null) return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function setGalleryFormMode(on) {
            var pa = document.getElementById('performed_at');
            var ti = document.getElementById('title');
            var box = document.getElementById('galleryHelpBox');
            if (on) {
                box.classList.remove('hidden');
                pa.setAttribute('readonly', 'readonly');
                ti.setAttribute('readonly', 'readonly');
                pa.classList.add('bg-slate-100', 'cursor-not-allowed');
                ti.classList.add('bg-slate-100', 'cursor-not-allowed');
                pa.removeAttribute('required');
                ti.removeAttribute('required');
            } else {
                box.classList.add('hidden');
                pa.removeAttribute('readonly');
                ti.removeAttribute('readonly');
                pa.classList.remove('bg-slate-100', 'cursor-not-allowed');
                ti.classList.remove('bg-slate-100', 'cursor-not-allowed');
                pa.setAttribute('required', 'required');
                ti.setAttribute('required', 'required');
            }
        }

        async function load() {
            var tbody = document.getElementById('listBody');
            try {
                var res = await fetch('/api/education-performance', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                var json = await res.json();
                if (!json.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">목록을 불러올 수 없습니다. ' + esc(json.error || '') + '</td></tr>';
                    return;
                }
                allList = json.data || [];
                if (allList.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400">등록된 교육실적이 없습니다. 교육사진에서 불러오기 또는 실적 추가로 등록하세요.</td></tr>';
                    return;
                }
                tbody.innerHTML = allList.map(function(u) {
                    var date = esc(u.performed_at || '');
                    var safeTitle = esc(u.title || '');
                    var cat = esc(u.category || '');
                    var isGal = u.source === 'gallery';
                    var badge = isGal
                        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">갤러리</span>'
                        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200/60">직접입력</span>';
                    return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-6 py-4 align-top">' + badge + '</td>' +
                        '<td class="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">' + date + '</td>' +
                        '<td class="px-6 py-4 text-slate-800">' + safeTitle + '</td>' +
                        '<td class="px-6 py-4 text-sm text-slate-500">' + (cat || '-') + '</td>' +
                        '<td class="px-6 py-4 text-right whitespace-nowrap">' +
                        '<button type="button" onclick="edit(' + u.id + ')" class="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium">수정</button> ' +
                        '<button type="button" onclick="delBtn(this)" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium" data-id="' + u.id + '" data-title="' + safeTitle + '">삭제</button>' +
                        '</td></tr>';
                }).join('');
            } catch (e) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-red-500">연결 실패</td></tr>';
            }
        }

        function openModal() {
            document.getElementById('editId').value = '';
            document.getElementById('editGalleryLinked').value = '0';
            document.getElementById('editPostId').value = '';
            document.getElementById('modalTitle').textContent = '실적 추가';
            document.getElementById('performed_at').value = '';
            document.getElementById('title').value = '';
            document.getElementById('category').value = '';
            document.getElementById('sort_order').value = '0';
            setGalleryFormMode(false);
            document.getElementById('modal').classList.remove('hidden');
        }

        function closeModal() { document.getElementById('modal').classList.add('hidden'); }

        async function edit(id) {
            var res = await fetch('/api/education-performance', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            var json = await res.json();
            var u = (json.data || []).find(function(x) { return x.id === id; });
            if (!u) return;
            document.getElementById('editId').value = u.id;
            document.getElementById('modalTitle').textContent = '실적 수정';
            document.getElementById('performed_at').value = u.performed_at || '';
            document.getElementById('title').value = u.title || '';
            document.getElementById('category').value = u.category || '';
            document.getElementById('sort_order').value = u.sort_order != null ? u.sort_order : '0';
            if (u.source === 'gallery') {
                document.getElementById('editGalleryLinked').value = '1';
                document.getElementById('editPostId').value = u.post_id != null ? String(u.post_id) : '';
                setGalleryFormMode(true);
            } else {
                document.getElementById('editGalleryLinked').value = '0';
                document.getElementById('editPostId').value = '';
                setGalleryFormMode(false);
            }
            document.getElementById('modal').classList.remove('hidden');
        }

        async function syncFromGallery() {
            var id = document.getElementById('editId').value;
            var token = localStorage.getItem('token');
            if (!id || !token) { alert('로그인이 필요합니다.'); return; }
            try {
                var res = await fetch('/api/education-performance/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ sync_from_post: true })
                });
                var json = await res.json();
                if (!json.success) { alert(json.error || '동기화 실패'); return; }
                var d = json.data || {};
                if (d.performed_at) document.getElementById('performed_at').value = d.performed_at;
                if (d.title) document.getElementById('title').value = d.title;
                await load();
                alert('갤러리 글 기준으로 제목·일자를 반영했습니다.');
            } catch (err) { alert('연결 실패'); }
        }

        async function save(e) {
            e.preventDefault();
            var id = document.getElementById('editId').value;
            var gallery = document.getElementById('editGalleryLinked').value === '1';
            var performed_at = document.getElementById('performed_at').value.trim();
            var title = document.getElementById('title').value.trim();
            var category = document.getElementById('category').value.trim() || null;
            var sort_order = parseInt(document.getElementById('sort_order').value, 10) || 0;
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            var url = id ? '/api/education-performance/' + id : '/api/education-performance';
            var method = id ? 'PUT' : 'POST';
            var body;
            if (id && gallery) {
                body = { category: category, sort_order: sort_order };
            } else {
                if (!performed_at) { alert('실적 일자를 입력하세요.'); return; }
                if (!title) { alert('실적 내용을 입력하세요.'); return; }
                body = { performed_at: performed_at, title: title, category: category, sort_order: sort_order };
            }
            try {
                var res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(body) });
                var json = await res.json();
                if (json.success) { closeModal(); await load(); return; }
                alert(json.error || '저장 실패');
            } catch (err) { alert('연결 실패'); }
        }

        function delBtn(btn) {
            var id = btn.getAttribute('data-id');
            var titleEl = document.createElement('div');
            titleEl.innerHTML = btn.getAttribute('data-title') || '';
            var title = (titleEl.textContent || titleEl.innerText || '').substring(0, 30);
            if (!confirm('이 실적을 삭제하시겠습니까?\\n' + title + (title.length >= 30 ? '...' : ''))) return;
            del(id);
        }

        async function del(id) {
            try {
                var res = await fetch('/api/education-performance/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                var json = await res.json();
                if (json.success) { await load(); return; }
                alert(json.error || '삭제 실패');
            } catch (err) { alert('연결 실패'); }
        }

        function closeGalleryModal() {
            document.getElementById('galleryModal').classList.add('hidden');
        }

        async function openGalleryModal() {
            var wrap = document.getElementById('galleryListWrap');
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            gallerySelectedIds = {};
            wrap.innerHTML = '<p class="text-slate-400 text-sm text-center py-8">불러오는 중...</p>';
            document.getElementById('galleryModal').classList.remove('hidden');
            try {
                var resPosts = await fetch('/api/posts?category=education_photo&limit=200&sort=created_at&order=DESC', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                var jPosts = await resPosts.json();
                var resEp = await fetch('/api/education-performance', { headers: { 'Authorization': 'Bearer ' + token } });
                var jEp = await resEp.json();
                var usedPostIds = {};
                (jEp.data || []).forEach(function(row) {
                    if (row.post_id != null) usedPostIds[row.post_id] = true;
                });
                var posts = jPosts.data || [];
                if (!jPosts.success) {
                    wrap.innerHTML = '<p class="text-red-500 text-sm text-center py-8">' + esc(jPosts.error || '갤러리 목록을 불러올 수 없습니다') + '</p>';
                    return;
                }
                if (posts.length === 0) {
                    wrap.innerHTML = '<p class="text-slate-500 text-sm text-center py-8">교육사진 갤러리 글이 없습니다. 먼저 갤러리에 글을 등록하세요.</p>';
                    return;
                }
                wrap.innerHTML = posts.map(function(p) {
                    var pid = p.id;
                    var taken = !!usedPostIds[pid];
                    var disabled = taken ? ' disabled' : '';
                    var idStr = 'gchk_' + pid;
                    return '<label class="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 ' + (taken ? 'opacity-60' : '') + '">' +
                        '<input type="checkbox" id="' + idStr + '" class="mt-1 rounded border-slate-300 text-emerald-600"' + disabled + (taken ? '' : ' onchange="galleryToggle(' + pid + ', this.checked)"') + '>' +
                        '<div class="flex-1 min-w-0">' +
                        '<div class="font-bold text-slate-800 text-sm truncate">' + esc(p.title || '(제목 없음)') + '</div>' +
                        '<div class="text-xs text-slate-500 mt-0.5">' + esc(p.created_at || '') + (taken ? ' · <span class="text-amber-700 font-medium">이미 실적에 있음</span>' : '') + '</div>' +
                        '</div></label>';
                }).join('');
            } catch (err) {
                wrap.innerHTML = '<p class="text-red-500 text-sm text-center py-8">연결 실패</p>';
            }
        }

        function galleryToggle(postId, checked) {
            if (checked) gallerySelectedIds[postId] = true;
            else delete gallerySelectedIds[postId];
        }

        async function submitGalleryImport() {
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            var ids = Object.keys(gallerySelectedIds).map(function(k) { return parseInt(k, 10); }).filter(function(n) { return !isNaN(n) && n > 0; });
            if (ids.length === 0) { alert('반영할 갤러리 글을 선택하세요.'); return; }
            try {
                var res = await fetch('/api/education-performance/from-gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ post_ids: ids })
                });
                var json = await res.json();
                if (!json.success) { alert(json.error || '반영 실패'); return; }
                var d = json.data || {};
                closeGalleryModal();
                await load();
                alert('반영 완료: 신규 ' + (d.ok != null ? d.ok : 0) + '건, 건너뜀 ' + (d.skip != null ? d.skip : 0) + '건, 실패 ' + (d.fail != null ? d.fail : 0) + '건');
            } catch (err) { alert('연결 실패'); }
        }

        document.addEventListener('DOMContentLoaded', load);
    </script>
</body>
</html>
`;
