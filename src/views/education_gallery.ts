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
            <h1 class="text-5xl font-black mb-6 tracking-tight">교육사진 · 포트폴리오 갤러리</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                교육 현장 사진과 수강생 포트폴리오를 한곳에서 만나보세요.
            </p>
        </div>
    </div>

    <!-- 필터 + 올리기 -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-100">
            <div class="flex gap-2 flex-wrap">
                <button type="button" onclick="setFilter('all')" class="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-600 text-white transition" data-filter="all">전체</button>
                <button type="button" onclick="setFilter('education_photo')" class="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-filter="education_photo">교육 사진</button>
                <button type="button" onclick="setFilter('portfolio')" class="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-filter="portfolio">포트폴리오</button>
            </div>
            <div id="uploadArea" class="hidden flex gap-2">
                <button type="button" onclick="openEducationPhotoModal()" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition"><i class="fas fa-camera mr-2"></i>교육 사진 올리기</button>
                <button type="button" onclick="openPortfolioModal()" class="px-4 py-2.5 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition"><i class="fas fa-folder-plus mr-2"></i>포트폴리오 올리기</button>
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
                <span id="modalTypeBadge" class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-primary-600"></span>
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

    <!-- 포트폴리오 올리기 모달 -->
    <div id="portfolioModal" class="fixed inset-0 bg-black/50 hidden z-[80] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">포트폴리오 올리기</h3>
                <button type="button" onclick="closePortfolioModal()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="portfolioForm" onsubmit="submitPortfolio(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-gray-700 font-medium mb-2">제목 <span class="text-red-500">*</span></label>
                    <input type="text" id="pfTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="예: 3D 캐릭터 모델링">
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">설명</label>
                    <textarea id="pfDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="작품에 대한 설명"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">썸네일 이미지 URL</label>
                    <input type="url" id="pfThumbnail" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://...">
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">작품 링크 (선택)</label>
                    <input type="url" id="pfContentUrl" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://... (Google Drive, 포트폴리오 사이트 등)">
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">분류</label>
                    <select id="pfCategory" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                        <option value="3d_modeling">3D 모델링</option>
                        <option value="design">디자인</option>
                        <option value="coding">코딩/개발</option>
                        <option value="other">기타</option>
                    </select>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="closePortfolioModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">취소</button>
                    <button type="submit" class="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900">등록</button>
                </div>
            </form>
        </div>
    </div>

    ${footerHtml()}

    <script>
        let currentFilter = 'all';
        let educationList = [];
        let portfolioList = [];
        let mergedList = [];

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

        async function loadAll() {
            try {
                var [postsRes, portRes] = await Promise.all([
                    fetch('/api/posts?category=education_photo&status=published&limit=100'),
                    fetch('/api/portfolios')
                ]);
                var postsData = await postsRes.json();
                var portData = await portRes.json();
                educationList = (postsData.success && postsData.data) ? postsData.data.map(function(p) { p._type = 'education_photo'; p._date = p.created_at; return p; }) : [];
                portfolioList = (portData.success && portData.data) ? portData.data.map(function(p) { p._type = 'portfolio'; p._date = p.created_at; p.author_name = p.student_name; return p; }) : [];
                mergeAndRender();
            } catch (e) {
                console.error(e);
                document.getElementById('galleryGrid').innerHTML = '<div class="col-span-full py-20 text-center text-red-500">갤러리를 불러오지 못했습니다.</div>';
            }
        }

        function mergeAndRender() {
            mergedList = educationList.concat(portfolioList);
            mergedList.sort(function(a, b) { return new Date(b._date) - new Date(a._date); });
            setFilter(currentFilter);
        }

        function setFilter(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(function(btn) {
                if (btn.dataset.filter === filter) {
                    btn.className = 'filter-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-600 text-white transition';
                } else {
                    btn.className = 'filter-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
                }
            });
            var list = filter === 'all' ? mergedList : filter === 'education_photo' ? educationList : portfolioList;
            renderGrid(list);
        }

        function renderGrid(list) {
            var grid = document.getElementById('galleryGrid');
            if (!list || list.length === 0) {
                grid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500">등록된 항목이 없습니다.</div>';
                document.getElementById('pagination').innerHTML = '';
                return;
            }
            grid.innerHTML = list.map(function(item, idx) {
                var typeLabel = item._type === 'education_photo' ? '교육 사진' : '포트폴리오';
                var typeClass = item._type === 'education_photo' ? 'bg-primary-600' : 'bg-gray-700';
                var img = '';
                if (item._type === 'education_photo') {
                    img = (item.images && item.images.length) ? item.images[0] : '';
                } else {
                    img = item.thumbnail_url || '';
                }
                var title = (item.title || '').substring(0, 30);
                if ((item.title || '').length > 30) title += '…';
                return '<div class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100 cursor-pointer" onclick="openDetail(' + idx + ')" data-idx="' + idx + '">' +
                    '<div class="aspect-square bg-gray-200 relative">' +
                    (img ? '<img src="' + img.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover hover:scale-105 transition duration-500">' : '<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-image text-5xl"></i></div>') +
                    '<span class="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white ' + typeClass + '">' + typeLabel + '</span>' +
                    '</div>' +
                    '<div class="p-4">' +
                    '<h3 class="font-bold text-gray-800 truncate">' + (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h3>' +
                    '<p class="text-sm text-gray-500 mt-1">' + (item.author_name || item.student_name || '-') + ' · ' + new Date(item._date).toLocaleDateString('ko-KR') + '</p>' +
                    '</div></div>';
            }).join('');
            document.getElementById('pagination').innerHTML = '';
        }

        function getCurrentList() {
            return currentFilter === 'all' ? mergedList : currentFilter === 'education_photo' ? educationList : portfolioList;
        }

        function openDetail(idx) {
            var list = getCurrentList();
            var item = list[idx];
            if (!item) return;
            var img = item._type === 'education_photo' ? ((item.images && item.images.length) ? item.images[0] : '') : (item.thumbnail_url || '');
            document.getElementById('modalImage').src = img || '';
            document.getElementById('modalImage').style.display = img ? 'block' : 'none';
            document.getElementById('modalTypeBadge').textContent = item._type === 'education_photo' ? '교육 사진' : '포트폴리오';
            document.getElementById('modalTitle').textContent = item.title || '';
            document.getElementById('modalAuthor').textContent = (item.author_name || item.student_name || '-');
            document.getElementById('modalDate').textContent = new Date(item._date).toLocaleDateString('ko-KR');
            var content = item._type === 'education_photo' ? (item.content || '') : (item.description || '');
            document.getElementById('modalContent').innerHTML = content ? content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>') : '<p class="text-gray-500">설명이 없습니다.</p>';
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

        function openPortfolioModal() {
            document.getElementById('portfolioForm').reset();
            document.getElementById('portfolioModal').classList.remove('hidden');
        }
        function closePortfolioModal() {
            document.getElementById('portfolioModal').classList.add('hidden');
        }

        async function submitPortfolio(e) {
            e.preventDefault();
            var title = document.getElementById('pfTitle').value.trim();
            var description = document.getElementById('pfDescription').value.trim();
            var thumbnail_url = document.getElementById('pfThumbnail').value.trim() || null;
            var content_url = document.getElementById('pfContentUrl').value.trim() || null;
            var category = document.getElementById('pfCategory').value;
            if (!title) { alert('제목을 입력하세요.'); return; }
            var token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            try {
                var res = await fetch('/api/portfolios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        title: title,
                        description: description || null,
                        thumbnail_url: thumbnail_url,
                        content_url: content_url,
                        category: category,
                        course_id: null
                    })
                });
                var result = await res.json();
                if (res.status === 401) { alert('로그인 세션이 만료되었습니다.'); location.href = '/login'; return; }
                if (result.success) {
                    alert('포트폴리오가 등록되었습니다.');
                    closePortfolioModal();
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
