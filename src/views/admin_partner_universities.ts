import { hrdSidebar } from './components/hrd_sidebar';

export const adminPartnerUniversitiesHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>협력대학 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('partner-universities')}
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">협력대학 관리</h2>
                    <p class="text-sm text-gray-500">대학맞춤교육 페이지에 표시되는 주요 협력 대학 목록을 관리합니다.</p>
                </div>
                <button type="button" onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                    <i class="fas fa-plus mr-2"></i>대학 추가
                </button>
            </header>
            <main class="flex-1 overflow-y-auto p-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">순서</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">대학명</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">로고</th>
                                <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">관리</th>
                            </tr>
                        </thead>
                        <tbody id="listBody" class="divide-y divide-gray-100">
                            <tr><td colspan="4" class="px-6 py-12 text-center text-gray-400">로딩 중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <!-- 추가/수정 모달 -->
    <div id="modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div class="p-6 border-b border-gray-100">
                <h3 id="modalTitle" class="text-lg font-bold text-gray-800">대학 추가</h3>
            </div>
            <form id="form" onsubmit="save(event)" class="p-6 space-y-4">
                <input type="hidden" id="editId" value="">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">대학명 <span class="text-red-500">*</span></label>
                    <input type="text" id="name" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 서울대학교">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">로고 이미지 (로컬 파일)</label>
                    <input type="file" id="logo_file" accept="image/jpeg,image/png,image/gif,image/webp" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" onchange="onLogoFileChange(this)">
                    <p class="text-xs text-gray-500 mt-1">선택하지 않으면 기존 로고를 유지합니다. (추가 시 생략 가능)</p>
                    <input type="hidden" id="logo_url" value="">
                    <div id="logo_preview" class="mt-2 hidden"><img id="logo_preview_img" src="" alt="미리보기" class="h-16 object-contain border border-gray-200 rounded"></div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">표시 순서</label>
                    <input type="number" id="sort_order" min="0" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="0">
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="closeModal()" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition">취소</button>
                    <button type="submit" class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition">저장</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        async function load() {
            const tbody = document.getElementById('listBody');
            try {
                const res = await fetch('/api/partner-universities', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const json = await res.json();
                if (!json.success) { tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-red-500">목록을 불러올 수 없습니다.</td></tr>'; return; }
                const list = json.data || [];
                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-gray-400">등록된 협력대학이 없습니다. 대학 추가 버튼으로 등록하세요.</td></tr>';
                    return;
                }
                tbody.innerHTML = list.map(function(u) {
                    var rawName = u.name || '';
                    var safeName = rawName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<tr class="hover:bg-gray-50">' +
                        '<td class="px-6 py-4 text-sm text-gray-600">' + (u.sort_order != null ? u.sort_order : '-') + '</td>' +
                        '<td class="px-6 py-4 font-medium text-gray-800">' + safeName + '</td>' +
                        '<td class="px-6 py-4 text-sm text-gray-500">' + (u.logo_url ? '<span class="text-blue-600">URL 등록됨</span>' : '-') + '</td>' +
                        '<td class="px-6 py-4 text-right">' +
                        '<button type="button" onclick="edit(' + u.id + ')" class="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">수정</button> ' +
                        '<button type="button" onclick="delBtn(this)" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium" data-id="' + u.id + '" data-name="' + safeName + '">삭제</button>' +
                        '</td></tr>';
                }).join('');
            } catch (e) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-red-500">연결 실패</td></tr>';
            }
        }

        function openModal() {
            document.getElementById('editId').value = '';
            document.getElementById('modalTitle').textContent = '대학 추가';
            document.getElementById('name').value = '';
            var logoFile = document.getElementById('logo_file');
            if (logoFile) logoFile.value = '';
            document.getElementById('logo_url').value = '';
            document.getElementById('sort_order').value = '0';
            var prev = document.getElementById('logo_preview');
            if (prev) { prev.classList.add('hidden'); var pi = prev.querySelector('img'); if (pi) pi.src = ''; }
            document.getElementById('modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('modal').classList.add('hidden');
        }

        async function edit(id) {
            const res = await fetch('/api/partner-universities', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const json = await res.json();
            const u = (json.data || []).find(function(x) { return x.id === id; });
            if (!u) return;
            document.getElementById('editId').value = u.id;
            document.getElementById('modalTitle').textContent = '대학 수정';
            document.getElementById('name').value = u.name || '';
            var logoFile = document.getElementById('logo_file');
            if (logoFile) logoFile.value = '';
            document.getElementById('logo_url').value = u.logo_url || '';
            document.getElementById('sort_order').value = u.sort_order != null ? u.sort_order : '';
            var prev = document.getElementById('logo_preview');
            var prevImg = prev && prev.querySelector('img');
            if (u.logo_url && prevImg) { prevImg.src = u.logo_url; prev.classList.remove('hidden'); } else if (prev) { prev.classList.add('hidden'); if (prevImg) prevImg.src = ''; }
            document.getElementById('modal').classList.remove('hidden');
        }

        function onLogoFileChange(input) {
            var file = input && input.files && input.files[0];
            var prev = document.getElementById('logo_preview');
            var prevImg = prev && prev.querySelector('img');
            if (file && /^image\\/(jpeg|png|gif|webp)$/i.test(file.type)) {
                var url = URL.createObjectURL(file);
                if (prevImg) prevImg.src = url;
                if (prev) prev.classList.remove('hidden');
            } else {
                if (prev) prev.classList.add('hidden');
                if (prevImg) prevImg.src = '';
            }
        }

        async function save(e) {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const name = document.getElementById('name').value.trim();
            var logo_url = document.getElementById('logo_url').value.trim() || null;
            const logoFileInput = document.getElementById('logo_file');
            const token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            if (logoFileInput && logoFileInput.files && logoFileInput.files[0]) {
                try {
                    const fd = new FormData();
                    fd.append('file', logoFileInput.files[0]);
                    fd.append('category', 'images');
                    fd.append('folder', 'partner-universities');
                    const upRes = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
                    const upJson = await upRes.json();
                    if (!upJson.success) { alert(upJson.error || '로고 업로드 실패'); return; }
                    logo_url = (upJson.data && (upJson.data.url || upJson.data.file_url)) || logo_url;
                } catch (err) {
                    alert('로고 업로드 중 오류가 발생했습니다.');
                    return;
                }
            }
            const sort_order = parseInt(document.getElementById('sort_order').value, 10) || 0;
            const url = id ? '/api/partner-universities/' + id : '/api/partner-universities';
            const method = id ? 'PUT' : 'POST';
            const body = id ? { name, logo_url, sort_order } : { name, logo_url, sort_order };
            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(body)
                });
                const json = await res.json();
                if (json.success) { closeModal(); await load(); return; }
                alert(json.error || '저장 실패');
            } catch (err) {
                alert('연결 실패');
            }
        }

        function delBtn(btn) {
            var id = btn.getAttribute('data-id');
            var nameEl = document.createElement('div');
            nameEl.innerHTML = btn.getAttribute('data-name') || '';
            var name = nameEl.textContent || nameEl.innerText || '';
            del(id, name);
        }

        async function del(id, name) {
            if (!confirm('"' + name + '" 협력대학을 삭제하시겠습니까?')) return;
            try {
                const res = await fetch('/api/partner-universities/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const json = await res.json();
                if (json.success) { await load(); return; }
                alert(json.error || '삭제 실패');
            } catch (err) {
                alert('연결 실패');
            }
        }

        document.addEventListener('DOMContentLoaded', load);
    </script>
</body>
</html>
`;
