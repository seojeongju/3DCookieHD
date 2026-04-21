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
    <style>
      .education-face-mask {
        filter: blur(1.2px) saturate(0.92) contrast(0.96);
      }
      .education-face-mask-modal {
        filter: blur(0.9px) saturate(0.94) contrast(0.97);
      }
      /* 상세 모달 본문에 에디터 HTML로 삽입된 이미지도 동일하게 얼굴 블러 적용 */
      #modalContent img {
        filter: blur(0.9px) saturate(0.94) contrast(0.97);
      }
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
    </style>
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

    <!-- 보기 옵션 -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-100">
            <div class="flex flex-wrap gap-4 items-center">
                <p class="text-xs text-gray-500">관리자 &gt; 교육사진 갤러리에서 등록한 사진입니다.</p>
                <span class="hidden sm:inline-block w-px h-8 bg-gray-200"></span>
                <span class="text-xs text-gray-400 font-medium mr-1">보기:</span>
                <button type="button" id="viewBtnGrid" onclick="setViewMode('grid')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-primary-100 text-primary-700 transition" data-view="grid" title="그리드"><i class="fas fa-th-large mr-1"></i>그리드</button>
                <button type="button" id="viewBtnImage" onclick="setViewMode('image')" class="view-mode-btn px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-view="image" title="이미지 크게"><i class="fas fa-image mr-1"></i>이미지</button>
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
    <div id="detailModal" class="fixed inset-0 z-[70] hidden flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onclick="closeDetailModal()" aria-hidden="true"></div>
        <div class="relative w-full max-w-5xl max-h-[min(92vh,900px)] flex flex-col rounded-[1.75rem] sm:rounded-[2rem] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.45)] ring-1 ring-white/10 overflow-hidden" onclick="event.stopPropagation()">
            <div class="relative h-[min(42vh,22rem)] sm:h-96 flex-shrink-0 bg-slate-900" id="modalImageWrap">
                <img id="modalImage" src="" alt="" class="w-full h-full object-cover education-face-mask-modal">
                <div class="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-slate-900/25 pointer-events-none"></div>
                <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent pointer-events-none"></div>
                <button type="button" onclick="closeDetailModal()" class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white bg-black/45 hover:bg-black/65 border border-white/25 shadow-lg backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 z-20" aria-label="닫기">
                    <i class="fas fa-times text-lg"></i>
                </button>
                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pt-16 sm:pt-20">
                    <span class="px-3.5 py-1.5 bg-primary-600 text-white text-[10px] font-black rounded-full shadow-md uppercase tracking-[0.18em] mb-3 inline-block">교육 사진</span>
                    <h2 id="modalTitle" class="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight drop-shadow-sm"></h2>
                </div>
            </div>
            
            <!-- 비디오 섹션 (존재할 경우) -->
            <div id="modalVideoSection" class="hidden px-8 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                <div id="modalVideoContainer" class="max-w-4xl mx-auto space-y-6"></div>
            </div>
            <div class="flex-1 min-h-0 flex flex-col lg:flex-row border-t border-slate-100/90 bg-gradient-to-b from-slate-50/80 to-white">
                <div class="flex-1 min-h-0 overflow-y-auto gallery-modal-body px-6 sm:px-10 py-8 sm:py-9">
                    <h4 class="text-[11px] font-black text-primary-600 uppercase tracking-[0.28em] mb-5 flex items-center">
                        <span class="w-8 h-px bg-primary-200 mr-3 shrink-0"></span> Photo Description
                    </h4>
                    <div id="modalContent" class="prose max-w-none text-slate-600 leading-relaxed text-base sm:text-[1.0625rem]"></div>
                </div>
                <div class="w-full lg:w-[min(100%,20rem)] flex-shrink-0 lg:border-l border-slate-100 bg-white/90 px-6 sm:px-8 py-7 sm:py-9 space-y-6">
                    <div class="rounded-2xl border border-slate-100/90 bg-gradient-to-br from-white to-slate-50/90 p-6 sm:p-7 shadow-sm space-y-4">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author</p>
                            <p id="modalAuthor" class="text-base font-black text-slate-800"></p>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                            <p id="modalDate" class="text-sm font-bold text-slate-700"></p>
                        </div>
                    </div>
                </div>
            </div>
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
                html += '<button type="button" onclick="logout()" class="text-gray-500 hover:text-red-600 text-sm">로그아웃</button>';
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
                var contentPlain = (item.content || item.description || '').replace(/<[^>]+>/g, '').trim().substring(0, 80);
                if ((item.content || item.description || '').replace(/<[^>]+>/g, '').trim().length > 80) contentPlain += '…';
                
                var hasMedia = !!displayImg || hasVideo;
                
                if (hasMedia) {
                    var aspectClass = isImageMode ? 'aspect-[4/3]' : 'aspect-square';
                    var mediaHtml = '';
                    if (displayImg) {
                        mediaHtml = '<img src="' + displayImg.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover education-face-mask transition duration-500">';
                    } else {
                        mediaHtml = '<div class="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 transition duration-500"><i class="fas fa-video text-4xl mb-3"></i><span class="text-[10px] font-black tracking-widest uppercase opacity-70">Video</span></div>';
                    }
                    
                    return '<div class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100 cursor-pointer" onclick="openDetail(' + idx + ')" data-idx="' + idx + '">' +
                        '<div class="' + aspectClass + ' bg-gray-200 relative overflow-hidden shrink-0">' +
                        mediaHtml +
                        '<span class="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white ' + typeClass + '">' + typeLabel + '</span>' +
                        (hasVideo ? '<div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent"><i class="fas fa-play-circle text-white text-2xl drop-shadow-md"></i></div>' : '') +
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
            var img = getItemImage(item);
            
            var videos = item.videos || [];
            if (typeof videos === 'string') { try { videos = JSON.parse(videos); } catch(e) { videos = []; } }
            var hasVideo = videos.length > 0;
            
            if (!img && hasVideo) {
                var vUrl = videos[0];
                var ytMatch = vUrl.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
                if (ytMatch && ytMatch[1]) {
                    img = 'https://img.youtube.com/vi/' + ytMatch[1] + '/maxresdefault.jpg';
                }
            }
            
            var modalImgEl = document.getElementById('modalImage');
            var modalImgWrap = document.getElementById('modalImageWrap');
            if (modalImgEl) {
                modalImgEl.src = img || '';
                modalImgEl.alt = item.title ? '교육 사진: ' + item.title : '';
                modalImgEl.style.display = img ? 'block' : 'none';
            }
            if (modalImgWrap) {
                modalImgWrap.style.display = 'block';
                if (!img) {
                    modalImgWrap.classList.add('bg-slate-800');
                } else {
                    modalImgWrap.classList.remove('bg-slate-800');
                }
            }
            
            // 비디오 처리
            var videoSection = document.getElementById('modalVideoSection');
            var videoContainer = document.getElementById('modalVideoContainer');
            if (videoSection && videoContainer) {
                videoContainer.innerHTML = '';
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
            document.getElementById('modalAuthor').textContent = (item.author_name || item.student_name || '-');
            document.getElementById('modalDate').textContent = new Date(item._date).toLocaleDateString('ko-KR');
            var content = item.content || item.description || '';
            document.getElementById('modalContent').innerHTML = content ? content : '<p class="text-gray-500">설명이 없습니다.</p>';
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function renderVideoPlayer(url) {
            if (!url) return '';
            
            // 유튜브
            var ytMatch = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
            if (ytMatch && ytMatch[1]) {
                return '<div class="video-container shadow-lg rounded-xl overflow-hidden aspect-video relative"><iframe src="https://www.youtube.com/embed/' + ytMatch[1] + '" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe></div>';
            }
            
            // 비메오
            var vimeoMatch = url.match(/vimeo\\.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|album\\/(\\d+)\\/video\\/|video\\/|)(\\d+)(?:$|\\/|\\?)/);
            if (vimeoMatch && vimeoMatch[3]) {
                return '<div class="video-container shadow-lg rounded-xl overflow-hidden aspect-video relative"><iframe src="https://player.vimeo.com/video/' + vimeoMatch[3] + '" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe></div>';
            }
            
            // 직접 업로드된 동영상
            return '<div class="video-container shadow-lg rounded-xl overflow-hidden bg-black flex justify-center"><video controls src="' + url + '" class="max-w-full max-h-[600px]"></video></div>';
        }

        function closeDetailModal() {
            var videoContainer = document.getElementById('modalVideoContainer');
            if (videoContainer) videoContainer.innerHTML = ''; // 모달 닫을때 비디오 재생 멈춤
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }

    </script>
</body>
</html>
`;
