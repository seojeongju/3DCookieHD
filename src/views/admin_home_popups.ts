import { hrdSidebar } from './components/hrd_sidebar';

export const adminHomePopupsHtml = (sidebarHtml?: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>메인 팝업 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-[100dvh] overflow-hidden">
        ${sidebarHtml || hrdSidebar('home-popups')}

        <main class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-4 sm:px-8 py-5 flex flex-wrap gap-3 justify-between items-center">
                <div class="flex items-center gap-3 min-w-0">
                    <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">메인 팝업 관리</h1>
                    <span class="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shrink-0">POPUP</span>
                </div>
                <button type="button" onclick="openPopupModal()" class="shrink-0 px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
                    <i class="fas fa-plus mr-2"></i>팝업 등록
                </button>
            </header>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 relative z-10">
                <div class="max-w-6xl mx-auto space-y-6">
                    <div class="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex gap-4">
                        <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="text-sm text-amber-900/80 leading-relaxed">
                            <p class="font-bold text-amber-900 mb-1">사용 안내</p>
                            <ul class="list-disc ml-4 space-y-1">
                                <li>활성 상태이고 게시 기간에 해당하는 팝업만 메인(/)에 표시됩니다.</li>
                                <li>방문자는 「오늘 하루 보지 않기」를 선택할 수 있습니다.</li>
                                <li>이미지가 있으면 이미지 중심, 없으면 제목·내용 텍스트로 표시됩니다.</li>
                                <li><strong>팝업 크기</strong>와 <strong>화면 위치</strong>를 등록 시 지정할 수 있습니다.</li>
                            </ul>
                        </div>
                    </div>

                    <div id="popupCards" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div class="col-span-full text-center py-16 text-slate-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i>불러오는 중…
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <div id="popupModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200/60">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 id="popupModalTitle" class="text-lg font-black tracking-tight">팝업 등록</h3>
                <button type="button" onclick="closePopupModal()" class="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-500"><i class="fas fa-times"></i></button>
            </div>
            <form id="popupForm" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5" onsubmit="return savePopup(event)">
                <input type="hidden" id="popupId" value="">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">제목 *</label>
                    <input type="text" id="popupTitle" required maxlength="120"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">내용</label>
                    <textarea id="popupContent" rows="4" maxlength="5000"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-y"
                        placeholder="간단한 안내 문구"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">이미지 URL</label>
                    <div class="flex gap-2">
                        <input type="text" id="popupImageUrl" maxlength="500"
                            class="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-mono text-sm"
                            placeholder="/api/upload/files/... 또는 https://...">
                        <label class="shrink-0 px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold cursor-pointer hover:bg-slate-800 transition">
                            <i class="fas fa-upload mr-1"></i>업로드
                            <input type="file" id="popupImageFile" accept="image/*" class="hidden" onchange="uploadPopupImage(this)">
                        </label>
                    </div>
                    <img id="popupImagePreview" src="" alt="" class="hidden mt-3 max-h-40 rounded-2xl border border-slate-200 object-contain bg-slate-50">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">링크 URL</label>
                        <input type="text" id="popupLinkUrl" maxlength="500"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                            placeholder="/course-sessions 또는 https://...">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">링크 버튼명</label>
                        <input type="text" id="popupLinkLabel" maxlength="40" value="바로가기"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold">
                    </div>
                </div>
                <div class="rounded-[2rem] border border-slate-200/60 bg-slate-50/80 p-5 space-y-4">
                    <p class="text-sm font-black text-slate-800 tracking-tight"><i class="fas fa-expand-arrows-alt text-indigo-500 mr-2"></i>표시 레이아웃</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">팝업 크기</label>
                            <select id="popupSize"
                                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold">
                                <option value="sm">작게 (320px)</option>
                                <option value="md" selected>보통 (448px)</option>
                                <option value="lg">크게 (512px)</option>
                                <option value="xl">매우 크게 (672px)</option>
                                <option value="xxl">전체형 (896px)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">화면 위치</label>
                            <select id="popupPosition"
                                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold">
                                <option value="center" selected>가운데</option>
                                <option value="top">상단 중앙</option>
                                <option value="bottom">하단 중앙</option>
                                <option value="top-left">좌상단</option>
                                <option value="top-center">상단 중앙 (여백)</option>
                                <option value="top-right">우상단</option>
                                <option value="center-left">좌측 중앙</option>
                                <option value="center-right">우측 중앙</option>
                                <option value="bottom-left">좌하단</option>
                                <option value="bottom-center">하단 중앙 (여백)</option>
                                <option value="bottom-right">우하단</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-500 mb-2">위치 미리보기 (클릭)</p>
                        <div id="popupPositionGrid" class="grid grid-cols-3 gap-1.5 max-w-[12rem] p-2 bg-white rounded-2xl border border-slate-200/60"></div>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">게시 시작일</label>
                        <input type="date" id="popupStartAt"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">게시 종료일</label>
                        <input type="date" id="popupEndAt"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">정렬 순서</label>
                        <input type="number" id="popupSortOrder" value="0"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold">
                    </div>
                </div>
                <label class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" id="popupIsActive" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <span class="text-sm font-bold text-slate-800">메인에 즉시 표시 (활성)</span>
                </label>
                <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
                    <button type="button" onclick="closePopupModal()" class="px-5 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">취소</button>
                    <button type="submit" class="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200">저장</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function authHeaders(json) {
            var h = { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') };
            if (json) h['Content-Type'] = 'application/json';
            return h;
        }
        function escapeHtml(s) {
            return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
        function formatPeriod(start, end) {
            if (!start && !end) return '상시';
            return (start || '시작일 없음') + ' ~ ' + (end || '종료일 없음');
        }
        var POPUP_SIZE_LABELS = { sm: '작게', md: '보통', lg: '크게', xl: '매우크게', xxl: '전체형' };
        var POPUP_POSITION_LABELS = {
            center: '가운데', top: '상단', bottom: '하단',
            'top-left': '좌상', 'top-center': '상중', 'top-right': '우상',
            'center-left': '좌중', 'center-right': '우중',
            'bottom-left': '좌하', 'bottom-center': '하중', 'bottom-right': '우하'
        };
        var POPUP_POSITION_GRID = [
            'top-left', 'top-center', 'top-right',
            'center-left', 'center', 'center-right',
            'bottom-left', 'bottom-center', 'bottom-right'
        ];

        function setPopupPositionValue(val) {
            var sel = document.getElementById('popupPosition');
            if (sel) sel.value = val || 'center';
            syncPositionGridHighlight();
        }
        function syncPositionGridHighlight() {
            var current = (document.getElementById('popupPosition') || {}).value || 'center';
            document.querySelectorAll('[data-popup-pos]').forEach(function(btn) {
                var on = btn.getAttribute('data-popup-pos') === current;
                btn.className = 'h-8 rounded-lg text-[10px] font-black transition ' +
                    (on ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200');
            });
        }
        function initPopupPositionGrid() {
            var grid = document.getElementById('popupPositionGrid');
            if (!grid || grid.dataset.ready) return;
            grid.dataset.ready = '1';
            grid.innerHTML = POPUP_POSITION_GRID.map(function(pos) {
                return '<button type="button" data-popup-pos="' + pos + '" class="h-8 rounded-lg text-[10px] font-black bg-slate-100">' +
                    escapeHtml(POPUP_POSITION_LABELS[pos] || pos) + '</button>';
            }).join('');
            grid.addEventListener('click', function(ev) {
                var btn = ev.target && ev.target.closest ? ev.target.closest('[data-popup-pos]') : null;
                if (btn) setPopupPositionValue(btn.getAttribute('data-popup-pos'));
            });
            syncPositionGridHighlight();
        }
        document.getElementById('popupPosition').addEventListener('change', syncPositionGridHighlight);

        var popupList = [];

        async function loadPopups() {
            var wrap = document.getElementById('popupCards');
            try {
                var res = await fetch('/api/home-popups', { headers: authHeaders() });
                var result = await res.json();
                if (!result.success) throw new Error(result.error || '조회 실패');
                popupList = result.data || [];
                if (!popupList.length) {
                    wrap.innerHTML = '<div class="col-span-full bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-12 text-center text-slate-500">' +
                        '<i class="fas fa-window-restore text-4xl text-slate-300 mb-4"></i>' +
                        '<p class="font-bold">등록된 팝업이 없습니다.</p>' +
                        '<button type="button" onclick="openPopupModal()" class="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold">첫 팝업 만들기</button></div>';
                    return;
                }
                wrap.innerHTML = popupList.map(function(p) {
                    var active = Number(p.is_active) === 1;
                    var img = p.image_url ? '<img src="' + escapeHtml(p.image_url) + '" alt="" class="w-full h-36 object-cover rounded-2xl bg-slate-100">' : '<div class="w-full h-36 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400"><i class="fas fa-image text-3xl"></i></div>';
                    return '<article class="bento-card bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5 flex flex-col gap-4">' +
                        img +
                        '<div class="flex items-start justify-between gap-3">' +
                        '<div class="min-w-0">' +
                        '<h3 class="font-black tracking-tight text-slate-900 truncate">' + escapeHtml(p.title) + '</h3>' +
                        '<p class="text-xs text-slate-500 mt-1">' + escapeHtml(formatPeriod(p.start_at, p.end_at)) + ' · 정렬 ' + (p.sort_order || 0) +
                        ' · ' + escapeHtml(POPUP_SIZE_LABELS[p.popup_size] || '보통') + ' · ' + escapeHtml(POPUP_POSITION_LABELS[p.popup_position] || '가운데') + '</p>' +
                        '</div>' +
                        '<span class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black ' + (active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500') + '">' + (active ? '활성' : '비활성') + '</span>' +
                        '</div>' +
                        (p.content ? '<p class="text-sm text-slate-600 line-clamp-3">' + escapeHtml(p.content) + '</p>' : '') +
                        '<div class="mt-auto pt-2 flex flex-wrap gap-2">' +
                        '<button type="button" onclick="togglePopupActive(' + p.id + ',' + (active ? 0 : 1) + ')" class="px-3 py-2 rounded-xl text-xs font-bold ' + (active ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700') + '">' + (active ? '비활성' : '활성') + '</button>' +
                        '<button type="button" onclick="openPopupModal(' + p.id + ')" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">수정</button>' +
                        '<button type="button" onclick="deletePopup(' + p.id + ')" class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700">삭제</button>' +
                        '</div></article>';
                }).join('');
            } catch (e) {
                console.error(e);
                wrap.innerHTML = '<div class="col-span-full text-center py-16 text-rose-600 font-bold">목록을 불러오지 못했습니다.</div>';
            }
        }

        function openPopupModal(id) {
            document.getElementById('popupForm').reset();
            document.getElementById('popupId').value = '';
            document.getElementById('popupLinkLabel').value = '바로가기';
            document.getElementById('popupSortOrder').value = '0';
            document.getElementById('popupSize').value = 'md';
            setPopupPositionValue('center');
            document.getElementById('popupIsActive').checked = false;
            initPopupPositionGrid();
            var preview = document.getElementById('popupImagePreview');
            preview.classList.add('hidden');
            preview.src = '';
            document.getElementById('popupModalTitle').textContent = id ? '팝업 수정' : '팝업 등록';
            if (id) {
                var p = popupList.find(function(x) { return Number(x.id) === Number(id); });
                if (p) {
                    document.getElementById('popupId').value = String(p.id);
                    document.getElementById('popupTitle').value = p.title || '';
                    document.getElementById('popupContent').value = p.content || '';
                    document.getElementById('popupImageUrl').value = p.image_url || '';
                    document.getElementById('popupLinkUrl').value = p.link_url || '';
                    document.getElementById('popupLinkLabel').value = p.link_label || '바로가기';
                    document.getElementById('popupStartAt').value = (p.start_at || '').slice(0, 10);
                    document.getElementById('popupEndAt').value = (p.end_at || '').slice(0, 10);
                    document.getElementById('popupSortOrder').value = String(p.sort_order || 0);
                    document.getElementById('popupIsActive').checked = Number(p.is_active) === 1;
                    document.getElementById('popupSize').value = p.popup_size || 'md';
                    setPopupPositionValue(p.popup_position || 'center');
                    if (p.image_url) {
                        preview.src = p.image_url;
                        preview.classList.remove('hidden');
                    }
                }
            }
            var modal = document.getElementById('popupModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closePopupModal() {
            var modal = document.getElementById('popupModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        async function uploadPopupImage(input) {
            if (!input.files || !input.files[0]) return;
            var fd = new FormData();
            fd.append('file', input.files[0]);
            fd.append('category', 'images');
            fd.append('folder', 'home-popups');
            try {
                var res = await fetch('/api/upload', { method: 'POST', headers: authHeaders(), body: fd });
                var result = await res.json();
                var url = (result.data && (result.data.url || result.data.path)) || result.url || '';
                if (!result.success && !url) throw new Error(result.error || '업로드 실패');
                document.getElementById('popupImageUrl').value = url;
                var preview = document.getElementById('popupImagePreview');
                preview.src = url;
                preview.classList.remove('hidden');
            } catch (e) {
                alert(e.message || '이미지 업로드에 실패했습니다.');
            } finally {
                input.value = '';
            }
        }

        async function savePopup(e) {
            e.preventDefault();
            var id = document.getElementById('popupId').value;
            var payload = {
                title: document.getElementById('popupTitle').value.trim(),
                content: document.getElementById('popupContent').value.trim(),
                image_url: document.getElementById('popupImageUrl').value.trim(),
                link_url: document.getElementById('popupLinkUrl').value.trim(),
                link_label: document.getElementById('popupLinkLabel').value.trim() || '바로가기',
                start_at: document.getElementById('popupStartAt').value || null,
                end_at: document.getElementById('popupEndAt').value || null,
                sort_order: parseInt(document.getElementById('popupSortOrder').value, 10) || 0,
                is_active: document.getElementById('popupIsActive').checked ? 1 : 0,
                popup_size: document.getElementById('popupSize').value || 'md',
                popup_position: document.getElementById('popupPosition').value || 'center'
            };
            try {
                var res = await fetch(id ? '/api/home-popups/' + id : '/api/home-popups', {
                    method: id ? 'PUT' : 'POST',
                    headers: authHeaders(true),
                    body: JSON.stringify(payload)
                });
                var result = await res.json();
                if (!result.success) throw new Error(result.error || '저장 실패');
                closePopupModal();
                await loadPopups();
            } catch (err) {
                alert(err.message || '저장에 실패했습니다.');
            }
            return false;
        }

        async function togglePopupActive(id, next) {
            try {
                var res = await fetch('/api/home-popups/' + id + '/active', {
                    method: 'PATCH',
                    headers: authHeaders(true),
                    body: JSON.stringify({ is_active: next })
                });
                var result = await res.json();
                if (!result.success) throw new Error(result.error || '변경 실패');
                await loadPopups();
            } catch (e) {
                alert(e.message || '상태 변경에 실패했습니다.');
            }
        }

        async function deletePopup(id) {
            if (!confirm('이 팝업을 삭제할까요?')) return;
            try {
                var res = await fetch('/api/home-popups/' + id, { method: 'DELETE', headers: authHeaders() });
                var result = await res.json();
                if (!result.success) throw new Error(result.error || '삭제 실패');
                await loadPopups();
            } catch (e) {
                alert(e.message || '삭제에 실패했습니다.');
            }
        }

        document.getElementById('popupImageUrl').addEventListener('input', function() {
            var preview = document.getElementById('popupImagePreview');
            var v = this.value.trim();
            if (v) { preview.src = v; preview.classList.remove('hidden'); }
            else { preview.classList.add('hidden'); preview.src = ''; }
        });

        initPopupPositionGrid();
        window.onload = loadPopups;
    </script>
</body>
</html>
`;
