import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const educationGalleryHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육사진 갤러리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50 flex flex-col min-h-screen">
    ${navigationHtml('photos')}

    <!-- 히어로 -->
    <div class="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span class="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full mb-4 inline-block uppercase tracking-widest">GALLERY</span>
            <h1 class="text-5xl font-black mb-6 tracking-tight">교육사진 갤러리</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                교육 현장 사진과 수업 모습을 소개합니다. 포트폴리오는 <a href="/portfolios" class="underline hover:text-white">포트폴리오 갤러리</a>에서 확인하세요.
            </p>
        </div>
    </div>

    <!-- 보기 옵션 + 올리기 (교육 사진만) -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-100">
            <div class="flex flex-wrap gap-4 items-center">
                <p class="text-xs text-gray-500">관리자 &gt; 교육사진 갤러리에서 등록한 사진입니다.</p>
                <span class="hidden sm:inline-block w-px h-8 bg-gray-200"></span>
                <span class="text-xs text-gray-400 font-medium mr-1">보기:</span>
                <button type="button" id="viewBtnGrid" onclick="setViewMode('grid')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition" data-view="grid" title="그리드"><i class="fas fa-th-large mr-1"></i>그리드</button>
                <button type="button" id="viewBtnImage" onclick="setViewMode('image')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-view="image" title="이미지 크게"><i class="fas fa-image mr-1"></i>이미지</button>
            </div>
            <div id="uploadArea" class="hidden flex gap-2">
                <button type="button" onclick="openEducationPhotoModal()" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition"><i class="fas fa-camera mr-2"></i>교육 사진 올리기</button>
            </div>
        </div>
    </div>

    <!-- 갤러리 그리드 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div id="galleryGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div class="col-span-full py-20 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-400 mb-4"></i>
                <p class="text-gray-500 font-bold">갤러리를 불러오는 중입니다...</p>
            </div>
        </div>
        <div id="pagination" class="mt-8 flex justify-center"></div>
    </main>

    <!-- 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/90 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="relative">
                <img id="modalImage" src="" alt="" class="w-full h-80 object-cover rounded-t-2xl">
                <button type="button" onclick="closeDetailModal()" class="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition"><i class="fas fa-times text-xl"></i></button>
                <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-primary-600">교육 사진</span>
            </div>
            <div class="p-8">
                <h2 id="modalTitle" class="text-2xl font-bold text-gray-800 mb-2"></h2>
                <div class="flex gap-4 text-sm text-gray-500 mb-6">
                    <span id="modalAuthor"></span>
                    <span id="modalDate"></span>
                </div>
                <div id="modalContent" class="prose max-w-none text-gray-700 leading-relaxed"></div>
            </div>
        </div>
    </div>

    <!-- 교육 사진 올리기 모달 -->
    <div id="educationPhotoModal" class="fixed inset-0 bg-black/50 hidden z-[80] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">교육 사진 올리기</h3>
                <button type="button" onclick="closeEducationPhotoModal()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="educationPhotoForm" onsubmit="submitEducationPhoto(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-gray-700 font-medium mb-2">제목 <span class="text-red-500">*</span></label>
                    <input type="text" id="epTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="예: 3D 모델링 수업 현장">
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">설명 (선택)</label>
                    <textarea id="epContent" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="사진에 대한 간단한 설명"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">이미지 URL <span class="text-red-500">*</span></label>
                    <input type="url" id="epImageUrl" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://... (이미지 주소)">
                    <p class="text-xs text-gray-500 mt-1">이미지는 먼저 업로드 후 URL을 붙여넣거나, 외부 이미지 주소를 입력하세요.</p>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="closeEducationPhotoModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">취소</button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700">등록</button>
                </div>
            </form>
        </div>
    </div>

    ${footerHtml()}

    <script>
        let galleryViewMode = 'grid';
        let currentPage = 1;
        let itemsPerPage = 12;
        let educationList = [];

        document.addEventListener('DOMContentLoaded', function() {
            loadAll();
            updateAuthMenu();
        });

        function updateAuthMenu() {
            var token = localStorage.getItem('token');
            var userStr = localStorage.getItem('user');
            var authMenu = document.getElementById('authMenu');
            if (!authMenu) return;
            if (token && userStr) {
                var user = JSON.parse(userStr);
                var html = '';
                if (user.role === 'admin') html += '<a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold mr-4"><i class="fas fa-cog mr-1"></i>관리자</a>';
                html += '<span class="text-gray-700 mr-2 font-bold">' + (user.name || '') + '님</span>';
                html += '<button type="button" onclick="logout()" class="text-gray-500 hover:text-red-600 text-sm">로그아웃</button>';
                authMenu.innerHTML = html;
                document.getElementById('uploadArea').classList.remove('hidden');
            }
        }
        function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = '/'; }

        function parseContentRegDate(content) {
            if (!content) return null;
            var text = typeof content === 'string' ? content.replace(/<[^>]+>/g, ' ') : '';
            var m = text.match(/등록일\\s*[:：]\\s*(\\d{4})[-.](\\d{1,2})[-.](\\d{1,2})/);
            if (!m) return null;
            var y = m[1], mon = m[2].padStart(2, '0'), d = m[3].padStart(2, '0');
            return y + '-' + mon + '-' + d;
        }

        function getItemImage(item) {
            var img = (item.images && item.images.length) ? item.images[0] : (item.thumbnail_url || '');
            if (!img && (item.content || item.description)) {
                var text = (item.content || item.description || '');
                var m = text.match(/<img[^>]+src=["']([^"']+)["']/i);
                if (m && m[1]) img = m[1];
            }
            return img;
        }

        async function loadAll() {
            try {
                var eduRes = await fetch('/api/posts?category=education_photo&status=published&limit=2000');
                var eduData = await eduRes.json();
                var eduRaw = (eduData.success && eduData.data) ? eduData.data.map(function(p) {
                    p._type = 'education_photo';
                    p._date = parseContentRegDate(p.content) || p.created_at;
                    return p;
                }) : [];
                educationList = eduRaw;
                educationList.sort(function(a, b) { return new Date(b._date || 0) - new Date(a._date || 0); });
                currentPage = 1;
                renderGrid();
            } catch (e) {
                console.error(e);
                document.getElementById('galleryGrid').innerHTML = '<div class="col-span-full py-20 text-center text-red-500">갤러리를 불러오지 못했습니다.</div>';
            }
        }

        function setViewMode(mode) {
            galleryViewMode = mode;
            var gridBtn = document.getElementById('viewBtnGrid');
            var imageBtn = document.getElementById('viewBtnImage');
            if (gridBtn) {
                gridBtn.className = mode === 'grid' ? 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition' : 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
            }
            if (imageBtn) {
                imageBtn.className = mode === 'image' ? 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition' : 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
            }
            currentPage = 1;
            renderGrid();
        }

        function goToPage(page) {
            var list = educationList;
            var totalPages = Math.max(1, Math.ceil((list.length || 0) / itemsPerPage));
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            renderGrid();
            window.scrollTo({ top: document.getElementById('galleryGrid').offsetTop - 80, behavior: 'smooth' });
        }

        function renderGrid() {
            var grid = document.getElementById('galleryGrid');
            var paginationEl = document.getElementById('pagination');
            if (!grid) return;
            var fullList = educationList;
            var total = fullList.length || 0;
            var totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            var start = (currentPage - 1) * itemsPerPage;
            var pageList = fullList.slice(start, start + itemsPerPage);

            var isImageMode = galleryViewMode === 'image';
            grid.className = isImageMode
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

            if (!pageList.length) {
                grid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500">등록된 항목이 없습니다.</div>';
                if (paginationEl) paginationEl.innerHTML = '';
                return;
            }

            grid.innerHTML = pageList.map(function(item, pageIdx) {
                var idx = start + pageIdx;
                var typeLabel = '교육 사진';
                var typeClass = 'bg-primary-600';
                var img = (item.images && item.images.length) ? item.images[0] : (item.thumbnail_url || '');
                var hasImage = !!img;
                var titleEsc = (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var contentPlain = (item.content || item.description || '').replace(/<[^>]+>/g, '').trim().substring(0, 80);
                if ((item.content || item.description || '').replace(/<[^>]+>/g, '').trim().length > 80) contentPlain += '…';
                if (hasImage) {
                    var aspectClass = isImageMode ? 'aspect-[4/3]' : 'aspect-square';
                    return '<div class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100 cursor-pointer" onclick="openDetail(' + idx + ')" data-idx="' + idx + '">' +
                        '<div class="' + aspectClass + ' bg-gray-200 relative">' +
                        '<img src="' + img.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover hover:scale-105 transition duration-500">' +
                        '<span class="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white ' + typeClass + '">' + typeLabel + '</span>' +
                        '</div>' +
                        '<div class="p-4">' +
                        '<h3 class="font-bold text-gray-800 truncate">' + titleEsc + '</h3>' +
                        '<p class="text-sm text-gray-500 mt-1">' + (item.author_name || item.student_name || '-') + ' · ' + new Date(item._date).toLocaleDateString('ko-KR') + '</p>' +
                        '</div></div>';
                }
                return '<div class="col-span-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition cursor-pointer flex items-center gap-4 px-5 py-4 text-left" onclick="openDetail(' + idx + ')" data-idx="' + idx + '">' +
                    '<span class="shrink-0 px-2 py-1 rounded-lg text-xs font-bold text-white ' + typeClass + '">' + typeLabel + '</span>' +
                    '<div class="min-w-0 flex-1">' +
                    '<h3 class="font-bold text-gray-800 truncate">' + titleEsc + '</h3>' +
                    (contentPlain ? '<p class="text-sm text-gray-500 mt-0.5 truncate">' + contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' : '') +
                    '</div>' +
                    '<p class="text-sm text-gray-400 shrink-0">' + (item.author_name || item.student_name || '-') + ' · ' + new Date(item._date).toLocaleDateString('ko-KR') + '</p>' +
                    '</div>';
            }).join('');

            if (paginationEl) {
                if (totalPages <= 1) {
                    paginationEl.innerHTML = '';
                } else {
                    var prevDisabled = currentPage <= 1 ? ' opacity-50 pointer-events-none' : '';
                    var nextDisabled = currentPage >= totalPages ? ' opacity-50 pointer-events-none' : '';
                    var html = '<nav class="flex items-center justify-center gap-2 flex-wrap" aria-label="페이지 이동">';
                    html += '<button type="button" onclick="goToPage(' + (currentPage - 1) + ')" class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition' + prevDisabled + '"><i class="fas fa-chevron-left"></i></button>';
                    html += '<span class="px-3 py-2 text-sm text-gray-600">' + currentPage + ' / ' + totalPages + '</span>';
                    var maxShow = 5;
                    var from = Math.max(1, currentPage - Math.floor(maxShow / 2));
                    var to = Math.min(totalPages, from + maxShow - 1);
                    if (to - from < maxShow - 1) from = Math.max(1, to - maxShow + 1);
                    for (var p = from; p <= to; p++) {
                        var active = p === currentPage ? ' bg-primary-600 text-white border-primary-600' : ' border-gray-300 text-gray-700 hover:bg-gray-50';
                        html += '<button type="button" onclick="goToPage(' + p + ')" class="px-3 py-2 rounded-lg border transition min-w-[2.5rem]' + active + '">' + p + '</button>';
                    }
                    html += '<button type="button" onclick="goToPage(' + (currentPage + 1) + ')" class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition' + nextDisabled + '"><i class="fas fa-chevron-right"></i></button>';
                    html += '</nav>';
                    paginationEl.innerHTML = html;
                }
            }
        }

        function openDetail(idx) {
            var item = educationList[idx];
            if (!item) return;
            var img = (item.images && item.images.length) ? item.images[0] : (item.thumbnail_url || '');
            var modalImgEl = document.getElementById('modalImage');
            var modalImgWrap = modalImgEl && modalImgEl.parentElement;
            if (modalImgEl) modalImgEl.src = img || '';
            if (modalImgEl) modalImgEl.style.display = img ? 'block' : 'none';
            if (modalImgWrap) modalImgWrap.style.display = img ? 'block' : 'none';
            document.getElementById('modalTitle').textContent = item.title || '';
            document.getElementById('modalAuthor').textContent = (item.author_name || item.student_name || '-');
            document.getElementById('modalDate').textContent = new Date(item._date).toLocaleDateString('ko-KR');
            var content = item.content || item.description || '';
            document.getElementById('modalContent').innerHTML = content ? content : '<p class="text-gray-500">설명이 없습니다.</p>';
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeDetailModal() {
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }

        function openEducationPhotoModal() {
            document.getElementById('educationPhotoForm').reset();
            document.getElementById('educationPhotoModal').classList.remove('hidden');
        }
        function closeEducationPhotoModal() {
            document.getElementById('educationPhotoModal').classList.add('hidden');
        }

        async function submitEducationPhoto(e) {
            e.preventDefault();
            var title = document.getElementById('epTitle').value.trim();
            var content = document.getElementById('epContent').value.trim();
            var imgUrl = document.getElementById('epImageUrl').value.trim();
            if (!title || !imgUrl) { alert('제목과 이미지 URL을 입력하세요.'); return; }
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            try {
                var res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        title: title,
                        content: content || '',
                        category: 'education_photo',
                        status: 'published',
                        images: [imgUrl],
                        pinned: false
                    })
                });
                var result = await res.json();
                if (res.status === 401) { alert('로그인 세션이 만료되었습니다.'); location.href = '/login'; return; }
                if (result.success) {
                    alert('교육 사진이 등록되었습니다.');
                    closeEducationPhotoModal();
                    loadAll();
                } else {
                    alert('오류: ' + (result.error || '등록 실패'));
                }
            } catch (err) {
                console.error(err);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

    </script>
</body>
</html>
`;
