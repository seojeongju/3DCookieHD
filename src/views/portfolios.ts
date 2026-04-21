import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const portfoliosListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 갤러리 - 와우쓰리디홍대센터</title>
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
      /* 포트폴리오 상세 모달: 본문 영역만 스크롤 + 브랜드 톤 스크롤바 */
      .portfolio-modal-body {
        scrollbar-width: thin;
        scrollbar-color: rgba(74, 144, 226, 0.55) rgba(241, 245, 249, 0.9);
      }
      .portfolio-modal-body::-webkit-scrollbar {
        width: 8px;
      }
      .portfolio-modal-body::-webkit-scrollbar-track {
        background: linear-gradient(180deg, rgba(241, 245, 249, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
        border-radius: 999px;
        margin: 6px 0;
      }
      .portfolio-modal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #7dbcfb 0%, #4a90e2 45%, #2d5fa3 100%);
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.85);
        background-clip: padding-box;
      }
      .portfolio-modal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #4a90e2 0%, #2d5fa3 100%);
      }
    </style>
</head>
<body class="bg-gray-50 flex flex-col min-h-screen">
    <!-- 네비게이션 -->
    ${navigationHtml('portfolios')}

    <!-- 히어로 섹션 -->
    <div class="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span class="px-3 py-1 bg-primary-500 text-white text-[10px] font-black rounded-full mb-4 inline-block uppercase tracking-widest">SHOWCASE</span>
            <h1 class="text-5xl font-black mb-6 tracking-tight">수강생 우수 포트폴리오</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                와우쓰리디홍대센터에서 꿈을 실현한 수강생들의 뛰어난 작품들을 소개합니다.<br>
                실무 중심 교육의 성과를 직접 확인해보세요.
            </p>
        </div>
    </div>

    <!-- 필터 및 검색 바 -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div class="bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                <button onclick="filterCategory('')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-primary-600 text-white shadow-lg shadow-primary-100 transition duration-300" data-category="">전체</button>
                <button onclick="filterCategory('3d_modeling')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="3d_modeling">3D 모델링</button>
                <button onclick="filterCategory('design')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="design">디자인</button>
                <button onclick="filterCategory('coding')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="coding">코딩/개발</button>
                <button onclick="filterCategory('other')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="other">기타</button>
            </div>
            <div class="flex items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" id="featuredOnly" onchange="loadPortfolios()" class="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary-600 focus:ring-primary-100 transition">
                    <span class="text-sm font-bold text-gray-600 group-hover:text-primary-600 transition">추천 작품만 보기</span>
                </label>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div id="portfolioGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <div class="col-span-full py-20 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-300 mb-4"></i>
                <p class="text-gray-400 font-bold">포트폴리오를 불러오는 중입니다...</p>
            </div>
        </div>
    </main>

    <!-- 상세 모달: 히어로 고정 + 본문만 스크롤(스크롤바 정돈) -->
    <div id="detailModal" class="fixed inset-0 z-[70] hidden flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onclick="closeModal()" aria-hidden="true"></div>
        <div class="relative w-full max-w-5xl max-h-[min(92vh,900px)] flex flex-col rounded-[1.75rem] sm:rounded-[2rem] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.45)] ring-1 ring-white/10 overflow-hidden" onclick="event.stopPropagation()">
            <div class="relative h-[min(42vh,22rem)] sm:h-96 flex-shrink-0 bg-slate-900" id="modalImageWrap">
                <img id="modalThumbnail" src="" alt="" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-slate-900/25 pointer-events-none"></div>
                <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent pointer-events-none"></div>
                <button type="button" onclick="closeModal()" class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white bg-black/45 hover:bg-black/65 border border-white/25 shadow-lg backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 z-20" aria-label="닫기">
                    <i class="fas fa-times text-lg"></i>
                </button>
                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pt-16 sm:pt-20">
                    <span id="modalCategory" class="px-3.5 py-1.5 bg-primary-600 text-white text-[10px] font-black rounded-full shadow-md uppercase tracking-[0.18em] mb-3 inline-block">CATEGORY</span>
                    <h3 id="modalTitle" class="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight drop-shadow-sm">TITLE</h3>
                </div>
            </div>
            
            <!-- 비디오 섹션 (존재할 경우) -->
            <div id="modalVideoSection" class="hidden px-8 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                <div id="modalVideoContainer" class="max-w-4xl mx-auto space-y-6"></div>
            </div>
            <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-0 lg:gap-0 border-t border-slate-100/90 bg-gradient-to-b from-slate-50/80 to-white">
                <div class="flex-1 min-h-0 overflow-y-auto portfolio-modal-body px-6 sm:px-10 py-8 sm:py-9">
                    <h4 class="text-[11px] font-black text-primary-600 uppercase tracking-[0.28em] mb-5 flex items-center">
                        <span class="w-8 h-px bg-primary-200 mr-3 shrink-0"></span> Project Overview
                    </h4>
                    <div id="modalDescription" class="text-slate-600 leading-relaxed text-base sm:text-[1.0625rem] font-medium whitespace-pre-wrap"></div>
                </div>
                <div class="w-full lg:w-[min(100%,20rem)] flex-shrink-0 lg:border-l border-slate-100 bg-white/90 px-6 sm:px-8 py-7 sm:py-9 space-y-6">
                    <div class="rounded-2xl border border-slate-100/90 bg-gradient-to-br from-white to-slate-50/90 p-6 sm:p-7 shadow-sm flex flex-col gap-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center shadow-inner text-primary-600 font-black text-lg ring-1 ring-primary-100/80" id="studentInitial">S</div>
                            <div class="min-w-0">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Creator</p>
                                <p class="text-base font-black text-slate-800 truncate" id="modalStudentName">Student Name</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner text-primary-500 text-lg shrink-0 ring-1 ring-slate-100"><i class="fas fa-graduation-cap"></i></div>
                            <div class="min-w-0">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</p>
                                <p class="text-sm font-bold text-slate-700 leading-snug" id="modalCourseTitle">Course Title</p>
                            </div>
                        </div>
                    </div>
                    <a id="modalContentLink" href="#" target="_blank" rel="noopener noreferrer" class="w-full py-4 sm:py-[1.125rem] bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black rounded-2xl hover:from-primary-800 hover:to-slate-900 transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-slate-900/15 hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base">
                        보러가기 <i class="fas fa-arrow-right text-xs opacity-90"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    ${footerHtml()}

    <script>
        let currentPortfolios = [];
        let activeCategory = '';

        document.addEventListener('DOMContentLoaded', () => {
            loadPortfolios();
            updateAuthMenu();
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                const modal = document.getElementById('detailModal');
                if (modal && !modal.classList.contains('hidden')) closeModal();
            });
        });

        async function loadPortfolios() {
            const isFeatured = document.getElementById('featuredOnly').checked;
            const grid = document.getElementById('portfolioGrid');
            
            try {
                const res = await fetch('/api/portfolios?limit=200' + (isFeatured ? '&isFeatured=true' : ''));
                const result = await res.json();
                
                if (!result.success) {
                  throw new Error(result.error);
                }
                
                currentPortfolios = result.data.map(p => ({
                    id: p.id,
                    title: p.title,
                    thumbnail_url: (p.thumbnail_url || '').trim(),
                    student_name: p.student_name || '수강생',
                    description: p.description || '',
                    category: p.category || 'other',
                    course_title: p.course_title,
                    content_url: p.content_url,
                    is_featured: !!p.is_featured,
                    created_at: p.created_at,
                    videos: p.videos || [],
                    source: 'post'
                }));
                
                if (activeCategory) {
                    currentPortfolios = currentPortfolios.filter(p => p.category === activeCategory);
                }
                
                renderPortfolios();
            } catch (e) { 
                console.error(e); 
                grid.innerHTML = '<div class="col-span-full py-20 text-center text-red-400 font-bold">오류가 발생했습니다.</div>';
            }
        }

        function renderPortfolios() {
            const grid = document.getElementById('portfolioGrid');
            if (currentPortfolios.length === 0) {
                grid.innerHTML = '<div class="col-span-full py-32 text-center text-gray-300 font-bold text-xl">등록된 작품이 없습니다.</div>';
                return;
            }

            grid.innerHTML = currentPortfolios.map(p => {
                var thumb = p.thumbnail_url;
                var hasVideo = p.videos && p.videos.length > 0;
                
                var displayImg = thumb;
                var isVideoThumb = false;
                if (!displayImg && hasVideo) {
                    var vUrl = p.videos[0];
                    var ytMatch = vUrl.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
                    if (ytMatch && ytMatch[1]) {
                        displayImg = 'https://img.youtube.com/vi/' + ytMatch[1] + '/mqdefault.jpg';
                        isVideoThumb = true;
                    }
                }
                
                var mediaHtml = '';
                if (displayImg) {
                    mediaHtml = '<img src="' + displayImg + '" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110">';
                } else if (hasVideo) {
                    mediaHtml = '<div class="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 transition duration-500"><i class="fas fa-video text-4xl mb-3"></i><span class="text-[10px] font-black tracking-widest uppercase opacity-70">Video</span></div>';
                } else {
                    mediaHtml = '<img src="https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110">';
                }

                return '<div class="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-700 cursor-pointer flex flex-col h-full" onclick="openModal(\\'' + p.id + '\\')">' +
                    '<div class="relative overflow-hidden h-72">' +
                        mediaHtml +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">' +
                            '<span class="text-white text-xs font-black uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">' + p.category + '</span>' +
                            '<h4 class="text-white text-xl font-black mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">' + p.title + '</h4>' +
                            '<div class="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">' +
                                '<span class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold">' + (p.student_name || 'U')[0] + '</span>' +
                                '<span class="text-white/80 text-xs font-bold">' + p.student_name + '</span>' +
                            '</div>' +
                        '</div>' +
                        (hasVideo ? '<div class="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/90 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition duration-300"><i class="fas fa-play ml-1"></i></div>' : '') +
                        (p.is_featured ? '<div class="absolute top-6 left-6 px-3 py-1 bg-yellow-400 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5 z-10"><i class="fas fa-star text-[8px]"></i> RECOMMENDED</div>' : '') +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function filterCategory(cat) {
            activeCategory = cat;
            document.querySelectorAll('.cat-btn').forEach(btn => {
                if (btn.dataset.category === cat) {
                    btn.className = 'cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-primary-600 text-white shadow-lg shadow-primary-100 transition duration-300';
                } else {
                    btn.className = 'cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300';
                }
            });
            loadPortfolios();
        }

        function openModal(id) {
            // API id는 숫자, onclick 인자는 문자열인 경우가 많아 === 로는 매칭 실패함
            const p = currentPortfolios.find(function(item) {
                return String(item.id) === String(id);
            });
            if (!p) return;

            var thumbUrl = p.thumbnail_url;
            var hasVideo = p.videos && p.videos.length > 0;
            if (!thumbUrl && hasVideo) {
                var vUrl = p.videos[0];
                var ytMatch = vUrl.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
                if (ytMatch && ytMatch[1]) {
                    thumbUrl = 'https://img.youtube.com/vi/' + ytMatch[1] + '/maxresdefault.jpg';
                }
            }

            const thumb = document.getElementById('modalThumbnail');
            var modalImgWrap = document.getElementById('modalImageWrap');
            
            thumb.src = thumbUrl || '';
            thumb.alt = p.title ? '포트폴리오 썸네일: ' + p.title : '';
            thumb.style.display = thumbUrl ? 'block' : 'none';
            
            if (modalImgWrap) {
                modalImgWrap.style.display = 'block';
                if (!thumbUrl) {
                    modalImgWrap.classList.add('bg-slate-800');
                } else {
                    modalImgWrap.classList.remove('bg-slate-800');
                }
            }
            
            document.getElementById('modalCategory').textContent = p.category;
            document.getElementById('modalTitle').textContent = p.title;
            
            const descEl = document.getElementById('modalDescription');
            descEl.innerHTML = p.description;
            
            document.getElementById('modalStudentName').textContent = p.student_name;
            document.getElementById('studentInitial').textContent = (p.student_name || 'U')[0];
            document.getElementById('modalCourseTitle').textContent = p.course_title || '일반 참여';
            
            const linkBtn = document.getElementById('modalContentLink');
            if (p.content_url) {
                linkBtn.href = p.content_url;
                linkBtn.classList.remove('hidden');
            } else {
                linkBtn.classList.add('hidden');
            }
            
            // 비디오 섹션 처리
            var videoSection = document.getElementById('modalVideoSection');
            var videoContainer = document.getElementById('modalVideoContainer');
            if (videoSection && videoContainer) {
                videoContainer.innerHTML = '';
                if (p.videos && p.videos.length > 0) {
                    videoSection.classList.remove('hidden');
                    p.videos.forEach(function(v) {
                        videoContainer.innerHTML += renderVideoPlayer(v);
                    });
                } else {
                    videoSection.classList.add('hidden');
                }
            }
            
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function renderVideoPlayer(url) {
            if (!url) return '';
            var ytMatch = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
            if (ytMatch && ytMatch[1]) {
                return '<div class="video-container shadow-lg rounded-xl overflow-hidden aspect-video relative"><iframe src="https://www.youtube.com/embed/' + ytMatch[1] + '" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe></div>';
            }
            var vimeoMatch = url.match(/vimeo\\.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|album\\/(\\d+)\\/video\\/|video\\/|)(\\d+)(?:$|\\/|\\?)/);
            if (vimeoMatch && vimeoMatch[3]) {
                return '<div class="video-container shadow-lg rounded-xl overflow-hidden aspect-video relative"><iframe src="https://player.vimeo.com/video/' + vimeoMatch[3] + '" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe></div>';
            }
            return '<div class="video-container shadow-lg rounded-xl overflow-hidden bg-black flex justify-center"><video controls src="' + url + '" class="max-w-full max-h-[600px]"></video></div>';
        }

        function closeModal() {
            var videoContainer = document.getElementById('modalVideoContainer');
            if (videoContainer) videoContainer.innerHTML = ''; // 재생 멈춤
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }

        function updateAuthMenu() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                const user = JSON.parse(userStr);
                const authMenu = document.getElementById('authMenu');
                if (authMenu) {
                    const dashboardPath = user.role === 'admin' ? 'admin' : (user.role === 'teacher' ? 'teacher' : 'student');
                    authMenu.innerHTML = '<a href="/' + dashboardPath + '" class="px-4 py-2 bg-primary-50 text-primary-600 font-bold text-sm rounded-xl hover:bg-primary-100 transition">나의 메뉴</a>';
                }
            }
        }
</script>
    </body>
    </html>
        `;
