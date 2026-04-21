import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const prototypeGalleryHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시제품 제작 사진 - 와우쓰리디홍대센터</title>
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
    <style>
      .gallery-modal-body {
        scrollbar-width: thin;
        scrollbar-color: rgba(74, 144, 226, 0.55) rgba(241, 245, 249, 0.9);
      }
      .gallery-modal-body::-webkit-scrollbar { width: 8px; }
      .gallery-modal-body::-webkit-scrollbar-track {
        background: linear-gradient(180deg, rgba(241, 245, 249, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
        border-radius: 999px;
        margin: 6px 0;
      }
      .gallery-modal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #7dbcfb 0%, #4a90e2 45%, #2d5fa3 100%);
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.85);
        background-clip: padding-box;
      }
      .gallery-modal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #4a90e2 0%, #2d5fa3 100%);
      }
      .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        border-radius: 1rem;
        background: #000;
      }
      .video-container iframe, .video-container video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
    </style>
</head>
<body class="bg-gray-50 flex flex-col min-h-screen">
    ${navigationHtml('prototype')}

    <!-- 히어로 -->
    <div class="bg-gradient-to-br from-gray-800 to-primary-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span class="px-3 py-1 bg-amber-500 text-gray-900 text-[10px] font-black rounded-full mb-4 inline-block uppercase tracking-widest">PROTOTYPE</span>
            <h1 class="text-5xl font-black mb-6 tracking-tight">시제품 제작 사진</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                3D 프린팅으로 제작한 시제품과 프로젝트 결과물을 소개합니다.
            </p>
        </div>
    </div>

    <!-- 보기 옵션 -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl p-4 flex justify-end border border-gray-100">
            <span class="text-xs text-gray-400 font-medium mr-2">보기:</span>
            <button type="button" id="viewBtnGrid" onclick="setViewMode('grid')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition" data-view="grid" title="그리드"><i class="fas fa-th-large mr-1"></i>그리드</button>
            <button type="button" id="viewBtnImage" onclick="setViewMode('image')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-view="image" title="이미지 크게"><i class="fas fa-image mr-1"></i>이미지</button>
        </div>
    </div>

    <!-- 갤러리 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div id="galleryGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div class="col-span-full py-20 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-300 mb-4"></i>
                <p class="text-gray-400 font-bold">시제품 사진을 불러오는 중입니다...</p>
            </div>
        </div>
        <div id="pagination" class="mt-12 flex justify-center"></div>
    </main>

    <!-- 상세 모달 (고도화된 UI/UX) -->
    <div id="detailModal" class="fixed inset-0 z-[70] hidden flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onclick="closeDetailModal()" aria-hidden="true"></div>
        <div class="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[2.5rem] bg-white shadow-[0_35px_100px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/20 overflow-hidden transform transition-all" onclick="event.stopPropagation()">
            
            <!-- 상단 컴팩트 히어로 배너 -->
            <div class="relative h-56 sm:h-64 lg:h-72 flex-shrink-0 group" id="modalImageWrap">
                <img id="modalImage" src="" alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>
                
                <!-- 닫기 버튼 -->
                <button type="button" onclick="closeDetailModal()" class="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-white bg-black/30 hover:bg-black/60 border border-white/20 shadow-xl backdrop-blur-md transition-all active:scale-95 z-20" aria-label="닫기">
                    <i class="fas fa-times"></i>
                </button>

                <!-- 타이틀 오버레이 (하단 정렬) -->
                <div class="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                    <div class="flex flex-col gap-2">
                        <span class="w-max px-3 py-1 bg-amber-500 text-gray-900 text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest animate-pulse">PROTOTYPE</span>
                        <h2 id="modalTitle" class="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight drop-shadow-md"></h2>
                    </div>
                </div>
            </div>

            <!-- 비디오 섹션 (존재할 경우) -->
            <div id="modalVideoSection" class="hidden px-8 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                <div id="modalVideoContainer" class="max-w-4xl mx-auto space-y-6"></div>
            </div>

            <!-- 하단 상세 정보 영역 -->
            <div class="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
                <!-- 본문 컨텐츠 (스크롤 가능) -->
                <div class="flex-1 min-h-0 overflow-y-auto gallery-modal-body px-8 sm:px-10 py-10">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="h-px flex-1 bg-gradient-to-r from-primary-500 to-transparent opacity-20"></div>
                        <span class="text-[11px] font-black text-primary-600 uppercase tracking-[0.3em]">Project Details</span>
                        <div class="h-px flex-1 bg-gradient-to-l from-primary-500 to-transparent opacity-20"></div>
                    </div>
                    <div id="modalContent" class="prose prose-slate max-w-none prose-img:rounded-3xl prose-img:shadow-2xl prose-headings:font-black prose-p:leading-relaxed text-slate-600 text-base sm:text-lg">
                        <!-- TinyMCE 컨텐츠 삽입 -->
                    </div>
                </div>

                <!-- 사이드바 정보 영역 -->
                <div class="w-full lg:w-80 flex-shrink-0 bg-slate-50/50 lg:border-l border-slate-100 p-8 sm:p-10 space-y-8">
                    <div class="space-y-6">
                        <div class="group">
                            <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-primary-500 transition-colors">CREATED BY</h5>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xs">
                                    <i class="fas fa-user-edit"></i>
                                </div>
                                <p id="modalAuthor" class="text-base font-black text-slate-800"></p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 lg:grid-cols-1 gap-6">
                            <div>
                                <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">DATE</h5>
                                <p id="modalDate" class="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <i class="far fa-calendar-alt text-primary-400"></i>
                                    <span id="modalDateVal"></span>
                                </p>
                            </div>
                            <div>
                                <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">VIEWS</h5>
                                <p class="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <i class="far fa-eye text-primary-400"></i>
                                    <span id="modalViews">0</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-slate-200/60">
                        <button onclick="closeDetailModal()" class="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-left text-xs text-slate-400"></i>
                            Back to Gallery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    ${footerHtml()}

    <script>
        let currentPage = 1;
        let galleryViewMode = 'grid';
        let itemsPerPage = 12;
        let currentList = [];

        document.addEventListener('DOMContentLoaded', () => {
            loadAll();
            updateAuthMenu();
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                var modal = document.getElementById('detailModal');
                if (modal && !modal.classList.contains('hidden')) closeDetailModal();
            });
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
                html += '<button onclick="logout()" class="text-gray-500 hover:text-red-600 text-sm">로그아웃</button>';
                authMenu.innerHTML = html;
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
            if (!img && (item.content || '')) {
                var m = (item.content || '').match(/<img[^>]+src=["']([^"']+)["']/i);
                if (m && m[1]) img = m[1];
            }
            return img;
        }

        async function loadAll() {
            try {
                var res = await fetch('/api/posts?category=prototype&status=published&limit=100');
                var result = await res.json();
                if (!result.success) {
                    document.getElementById('galleryGrid').innerHTML = '<div class="col-span-full py-20 text-center text-red-500">데이터를 불러오는데 실패했습니다.</div>';
                    return;
                }
                var raw = (result.data || []).map(function(p) {
                    p._date = parseContentRegDate(p.content) || p.created_at;
                    return p;
                });
                raw.sort(function(a, b) { return new Date(b._date || 0) - new Date(a._date || 0); });
                currentList = raw.filter(function(p) {
                    var videos = p.videos || [];
                    if (typeof videos === 'string') { try { videos = JSON.parse(videos); } catch(e) { videos = []; } }
                    return !!getItemImage(p) || (videos && videos.length > 0);
                });
                currentPage = 1;
                renderGrid();
            } catch (e) {
                console.error(e);
                document.getElementById('galleryGrid').innerHTML = '<div class="col-span-full py-20 text-center text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function setViewMode(mode) {
            galleryViewMode = mode;
            var gridBtn = document.getElementById('viewBtnGrid');
            var imageBtn = document.getElementById('viewBtnImage');
            if (gridBtn) gridBtn.className = mode === 'grid' ? 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition' : 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
            if (imageBtn) imageBtn.className = mode === 'image' ? 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition' : 'view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
            currentPage = 1;
            renderGrid();
        }

        function goToPage(page) {
            var totalPages = Math.max(1, Math.ceil((currentList.length || 0) / itemsPerPage));
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            renderGrid();
            window.scrollTo({ top: document.getElementById('galleryGrid').offsetTop - 80, behavior: 'smooth' });
        }

        function renderGrid() {
            var grid = document.getElementById('galleryGrid');
            var paginationEl = document.getElementById('pagination');
            if (!grid) return;
            var total = currentList.length || 0;
            var totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
            var start = (currentPage - 1) * itemsPerPage;
            var pageList = currentList.slice(start, start + itemsPerPage);
            var isImageMode = galleryViewMode === 'image';
            grid.className = isImageMode ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

            if (!pageList.length) {
                grid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500 font-medium">등록된 시제품 사진이 없습니다.</div>';
                if (paginationEl) paginationEl.innerHTML = '';
                return;
            }

            grid.innerHTML = pageList.map(function(item, pageIdx) {
                var idx = start + pageIdx;
                var img = getItemImage(item);
                var videos = item.videos || [];
                if (typeof videos === 'string') { try { videos = JSON.parse(videos); } catch(e) { videos = []; } }
                var hasVideo = videos.length > 0;
                
                var displayImg = img;
                var isVideoThumb = false;
                if (!displayImg && hasVideo) {
                    var vUrl = videos[0];
                    var ytMatch = vUrl.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
                    if (ytMatch && ytMatch[1]) {
                        displayImg = 'https://img.youtube.com/vi/' + ytMatch[1] + '/mqdefault.jpg';
                        isVideoThumb = true;
                    }
                }

                var titleEsc = (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var aspectClass = isImageMode ? 'aspect-[4/3]' : 'aspect-square';
                
                if (displayImg) {
                    return '<div class="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100 cursor-pointer" onclick="openDetail(' + idx + ')">' +
                        '<div class="' + aspectClass + ' bg-gray-200 relative">' +
                        '<img src="' + displayImg.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        (hasVideo ? '<div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent"><i class="fas fa-play-circle text-white text-xl"></i></div>' : '') +
                        '</div>' +
                        '<div class="p-5">' +
                        '<h3 class="font-bold text-gray-800 truncate">' + titleEsc + '</h3>' +
                        '<p class="text-sm text-gray-500 mt-1">' + (item.author_name || '-') + ' · ' + new Date(item._date).toLocaleDateString('ko-KR') + '</p>' +
                        '</div></div>';
                }

                var contentPlain = (item.content || '').replace(/<[^>]+>/g, '').trim().substring(0, 80);
                if ((item.content || '').replace(/<[^>]+>/g, '').trim().length > 80) contentPlain += '…';
                
                return '<div class="col-span-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition cursor-pointer flex items-center gap-4 px-5 py-4 text-left" onclick="openDetail(' + idx + ')">' +
                    '<span class="shrink-0 w-12 h-12 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">' +
                    (hasVideo ? '<i class="fas fa-video"></i>' : '<i class="fas fa-cube"></i>') +
                    '</span>' +
                    '<div class="min-w-0 flex-1">' +
                    '<h3 class="font-bold text-gray-800 truncate">' + titleEsc + '</h3>' +
                    (contentPlain ? '<p class="text-sm text-gray-500 mt-0.5 truncate">' + contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' : '') +
                    '</div>' +
                    '<p class="text-sm text-gray-400 shrink-0">' + (item.author_name || '-') + ' · ' + new Date(item._date).toLocaleDateString('ko-KR') + '</p>' +
                    '</div>';
            }).join('');

            if (paginationEl) {
                if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
                var prevDisabled = currentPage <= 1 ? ' opacity-50 pointer-events-none' : '';
                var nextDisabled = currentPage >= totalPages ? ' opacity-50 pointer-events-none' : '';
                var html = '<nav class="flex items-center justify-center gap-2 flex-wrap" aria-label="페이지 이동">';
                html += '<button type="button" onclick="goToPage(' + (currentPage - 1) + ')" class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition' + prevDisabled + '"><i class="fas fa-chevron-left"></i></button>';
                html += '<span class="px-3 py-2 text-sm text-gray-600">' + currentPage + ' / ' + totalPages + '</span>';
                var maxShow = 5, from = Math.max(1, currentPage - Math.floor(maxShow / 2)), to = Math.min(totalPages, from + maxShow - 1);
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

        function openDetail(idx) {
            var item = currentList[idx];
            if (!item) return;
            var img = (item.images && item.images.length) ? item.images[0] : '';
            var modalImgEl = document.getElementById('modalImage');
            var modalImgWrap = document.getElementById('modalImageWrap');
            if (modalImgEl) modalImgEl.src = img || '';
            if (modalImgEl) modalImgEl.alt = item.title ? '시제품 이미지: ' + item.title : '';
            if (modalImgEl) modalImgEl.style.display = img ? 'block' : 'none';
            if (modalImgWrap) modalImgWrap.style.display = img ? 'block' : 'none';
 
            // 비디오 처리
            var videoSection = document.getElementById('modalVideoSection');
            var videoContainer = document.getElementById('modalVideoContainer');
            if (videoSection && videoContainer) {
                videoContainer.innerHTML = '';
                var videos = item.videos || [];
                if (typeof videos === 'string') { try { videos = JSON.parse(videos); } catch(e) { videos = []; } }
                
                if (videos && videos.length > 0) {
                    videoSection.classList.remove('hidden');
                    videos.forEach(function(v) {
                        videoContainer.innerHTML += renderVideoPlayer(v);
                    });
                } else {
                    videoSection.classList.add('hidden');
                }
            }
 
            document.getElementById('modalTitle').textContent = item.title || '';
            document.getElementById('modalAuthor').textContent = item.author_name || '관리자';
            document.getElementById('modalDate').textContent = new Date(item._date).toLocaleDateString('ko-KR');
            document.getElementById('modalViews').textContent = item.views || 0;
            var content = item.content || '';
            document.getElementById('modalContent').innerHTML = content || '<p class="text-gray-500">내용이 없습니다.</p>';
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
 
        function renderVideoPlayer(url) {
            if (!url) return '';
            
            // 유튜브
            var ytMatch = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
            if (ytMatch && ytMatch[1]) {
                return '<div class="video-container shadow-lg"><iframe src="https://www.youtube.com/embed/' + ytMatch[1] + '" allowfullscreen></iframe></div>';
            }
            
            // 비메오
            var vimeoMatch = url.match(/vimeo\\.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|album\\/(\\d+)\\/video\\/|video\\/|)(\\d+)(?:$|\\/|\\?)/);
            if (vimeoMatch && vimeoMatch[3]) {
                return '<div class="video-container shadow-lg"><iframe src="https://player.vimeo.com/video/' + vimeoMatch[3] + '" allowfullscreen></iframe></div>';
            }
            
            // 직접 업로드 (HTML5 video)
            return '<div class="video-container shadow-lg"><video controls preload="metadata" class="bg-black"><source src="' + url + '" type="video/mp4"><p>브라우저가 동영상을 지원하지 않습니다.</p></video></div>';
        }

        function closeDetailModal() {
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }
    </script>
</body>
</html>
`;
