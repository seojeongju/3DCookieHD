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
<body class="bg-slate-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('education-performance')}
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 shadow-sm z-10">
                <div>
                    <h2 class="text-xl font-black text-slate-800 tracking-tight">교육실적 관리</h2>
                    <p class="text-sm text-slate-500">센터소개 &gt; 교육실적 페이지에 표시되는 실적을 등록·수정합니다.</p>
                </div>
                <button type="button" onclick="openModal()" class="px-4 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold text-sm shadow-sm border border-slate-200/60">
                    <i class="fas fa-plus mr-2"></i>실적 추가
                </button>
            </header>
            <main class="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden bento-card">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-slate-200/60">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">일자</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">실적 내용</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">카테고리</th>
                                <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="listBody" class="divide-y divide-slate-100">
                            <tr><td colspan="4" class="px-6 py-12 text-center text-slate-400">로딩 중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <div id="modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200/60">
            <div class="p-6 border-b border-slate-100">
                <h3 id="modalTitle" class="text-lg font-bold text-slate-800">실적 추가</h3>
            </div>
            <form id="form" onsubmit="save(event)" class="p-6 space-y-4">
                <input type="hidden" id="editId" value="">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">실적 일자 <span class="text-red-500">*</span></label>
                    <input type="text" id="performed_at" required class="w-full px-4 py-2.5 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 2025. 10">
                    <p class="text-xs text-slate-500 mt-1">예: 2016. 09, 2024. 12</p>
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
        async function load() {
            const tbody = document.getElementById('listBody');
            try {
                const res = await fetch('/api/education-performance', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const json = await res.json();
                if (!json.success) { tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-red-500">목록을 불러올 수 없습니다. ' + (json.error || '') + '</td></tr>'; return; }
                const list = json.data || [];
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400">등록된 교육실적이 없습니다. 실적 추가 버튼으로 등록하세요.</td></tr>';
                    return;
                }
                tbody.innerHTML = list.map(function(u) {
                    var date = (u.performed_at || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var rawTitle = u.title || '';
                    var safeTitle = rawTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var cat = (u.category || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-6 py-4 text-sm text-slate-600 font-medium">' + date + '</td>' +
                        '<td class="px-6 py-4 text-slate-800">' + safeTitle + '</td>' +
                        '<td class="px-6 py-4 text-sm text-slate-500">' + (cat || '-') + '</td>' +
                        '<td class="px-6 py-4 text-right">' +
                        '<button type="button" onclick="edit(' + u.id + ')" class="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium">수정</button> ' +
                        '<button type="button" onclick="delBtn(this)" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium" data-id="' + u.id + '" data-title="' + safeTitle + '">삭제</button>' +
                        '</td></tr>';
                }).join('');
            } catch (e) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-red-500">연결 실패</td></tr>';
            }
        }
        function openModal() {
            document.getElementById('editId').value = '';
            document.getElementById('modalTitle').textContent = '실적 추가';
            document.getElementById('performed_at').value = '';
            document.getElementById('title').value = '';
            document.getElementById('category').value = '';
            document.getElementById('sort_order').value = '0';
            document.getElementById('modal').classList.remove('hidden');
        }
        function closeModal() { document.getElementById('modal').classList.add('hidden'); }
        async function edit(id) {
            const res = await fetch('/api/education-performance', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const json = await res.json();
            const u = (json.data || []).find(function(x) { return x.id === id; });
            if (!u) return;
            document.getElementById('editId').value = u.id;
            document.getElementById('modalTitle').textContent = '실적 수정';
            document.getElementById('performed_at').value = u.performed_at || '';
            document.getElementById('title').value = u.title || '';
            document.getElementById('category').value = u.category || '';
            document.getElementById('sort_order').value = u.sort_order != null ? u.sort_order : '0';
            document.getElementById('modal').classList.remove('hidden');
        }
        async function save(e) {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const performed_at = document.getElementById('performed_at').value.trim();
            const title = document.getElementById('title').value.trim();
            const category = document.getElementById('category').value.trim() || null;
            const sort_order = parseInt(document.getElementById('sort_order').value, 10) || 0;
            const token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            const url = id ? '/api/education-performance/' + id : '/api/education-performance';
            const method = id ? 'PUT' : 'POST';
            const body = id ? { performed_at, title, category, sort_order } : { performed_at, title, category, sort_order };
            try {
                const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(body) });
                const json = await res.json();
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
                const res = await fetch('/api/education-performance/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const json = await res.json();
                if (json.success) { await load(); return; }
                alert(json.error || '삭제 실패');
            } catch (err) { alert('연결 실패'); }
        }
        document.addEventListener('DOMContentLoaded', load);
    </script>
</body>
</html>
`;
