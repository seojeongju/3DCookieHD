import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const reviewsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D프린팅 국비지원·기능사 수강후기 - 와우쓰리디홍대센터</title>
    <meta name="description" content="와우쓰리디 3D프린팅 국비지원·내일배움카드·3D프린터운용기능사 과정 수강생들의 생생한 교육 후기를 확인하세요.">
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    ${navigationHtml('reviews')}


    <script>
        // 로그인 상태 확인 및 메뉴 업데이트
        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const authMenu = document.getElementById('authMenu');
            
            if (token && userStr && authMenu) {
                const user = JSON.parse(userStr);
                let menuHtml = '';
                
                if (user.role === 'admin') {
                    menuHtml += \`
                        <a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold whitespace-nowrap mr-4">
                            <i class="fas fa-cog mr-1"></i> 관리자
                        </a>
                    \`;
                }
                
                menuHtml += \`
                    <span class="text-gray-700 mr-2">
                        <span class="font-bold">\${user.name}</span>님
                    </span>
                    <button onclick="logout()" class="text-gray-500 hover:text-red-600 font-medium whitespace-nowrap">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                \`;
                
                authMenu.innerHTML = menuHtml;
            }
        });

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/';
        }
    </script>
    <script src="/static/academic-menu.js"></script>

    <!-- \ud5e4\ub354 -->
    <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">3D프린팅 교육 수강후기</h1>
            <p class="text-xl text-green-100 max-w-3xl mx-auto">국비지원·내일배움카드·3D프린터운용기능사 과정을 수강한 분들이 전하는 생생한 후기입니다.</p>
            <div class="mt-6 flex flex-wrap justify-center gap-2 text-sm">
                <a href="/guides/craftsman-license" class="inline-flex rounded-full bg-white/15 px-4 py-2 font-bold text-white hover:bg-white/25">기능사·국가자격</a>
                <a href="/guides/national-support" class="inline-flex rounded-full bg-white/15 px-4 py-2 font-bold text-white hover:bg-white/25">국비지원</a>
                <a href="/course-sessions" class="inline-flex rounded-full bg-white/15 px-4 py-2 font-bold text-white hover:bg-white/25">모집 과정</a>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 정렬 (작성은 학생 대시보드 나의 강의실 → 수강후기에서만 가능) -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-gray-600 font-medium">정렬:</span>
                <select id="sortOrder" onchange="loadReviews(1)" class="border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                    <option value="latest">최신순</option>
                    <option value="rating">평점순</option>
                </select>
            </div>
            <p id="reviewCount" class="text-sm text-gray-500"></p>
        </div>

        <!-- 리뷰 목록 -->
        <div id="reviewsList" class="grid md:grid-cols-2 gap-6">
            <!-- 로딩 중 표시 -->
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-green-500 mb-4"></i>
                <p class="text-gray-500">후기를 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center">
            <!-- 페이지네이션 버튼이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 푸터 -->
    <!-- 푸터 -->
    ${footerHtml()}

    <script>
        let currentPage = 1;
        const itemsPerPage = 8;

        document.addEventListener('DOMContentLoaded', () => {
            const urlPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
            loadReviews(urlPage > 0 ? urlPage : 1);
        });

        function getSortParams() {
            const sortOrder = document.getElementById('sortOrder')?.value || 'latest';
            if (sortOrder === 'rating') {
                return { sort: 'rating', order: 'DESC' };
            }
            return { sort: 'created_at', order: 'DESC' };
        }

        function syncPageUrl(page) {
            const url = new URL(window.location.href);
            if (page <= 1) {
                url.searchParams.delete('page');
            } else {
                url.searchParams.set('page', String(page));
            }
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        }

        function renderPagination(pagination) {
            const paginationEl = document.getElementById('pagination');
            if (!paginationEl) return;

            const totalPages = pagination?.totalPages || 1;
            const pageNum = pagination?.page || 1;

            if (totalPages <= 1) {
                paginationEl.innerHTML = '';
                return;
            }

            const radius = 2;
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= pageNum - radius && i <= pageNum + radius)) {
                    pages.push(i);
                } else if (pages[pages.length - 1] !== '...') {
                    pages.push('...');
                }
            }

            let html = '<nav class="flex flex-wrap items-center justify-center gap-2" aria-label="페이지 이동">';
            html += '<button type="button" onclick="loadReviews(' + (pageNum - 1) + ')" ' +
                (pageNum <= 1 ? 'disabled' : '') +
                ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' +
                (pageNum <= 1 ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 bg-white') +
                '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';

            pages.forEach(function(n) {
                if (n === '...') {
                    html += '<span class="px-2 py-2 text-gray-400">…</span>';
                } else {
                    const active = n === pageNum;
                    html += '<button type="button" onclick="loadReviews(' + n + ')" class="min-w-[2.5rem] px-3 py-2 rounded-lg border text-sm font-medium transition ' +
                        (active ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white') +
                        '">' + n + '</button>';
                }
            });

            html += '<button type="button" onclick="loadReviews(' + (pageNum + 1) + ')" ' +
                (pageNum >= totalPages ? 'disabled' : '') +
                ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' +
                (pageNum >= totalPages ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 bg-white') +
                '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
            html += '</nav>';

            paginationEl.innerHTML = html;
        }

        async function loadReviews(page) {
            const reviewsList = document.getElementById('reviewsList');
            const reviewCountEl = document.getElementById('reviewCount');
            const paginationEl = document.getElementById('pagination');

            if (!page || page < 1) page = 1;
            currentPage = page;

            const { sort, order } = getSortParams();
            const url = '/api/posts?category=review&status=published&page=' + page +
                '&limit=' + itemsPerPage + '&sort=' + sort + '&order=' + order;

            reviewsList.innerHTML = \`
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-spinner fa-spin text-4xl text-green-500 mb-4"></i>
                    <p class="text-gray-500">후기를 불러오는 중입니다...</p>
                </div>
            \`;
            if (paginationEl) paginationEl.innerHTML = '';

            try {
                const response = await fetch(url);
                const result = await response.json();

                if (!result.success) {
                    reviewsList.innerHTML = \`
                        <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <p class="text-gray-600">데이터를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                    if (reviewCountEl) reviewCountEl.textContent = '';
                    return;
                }

                const pagination = result.pagination || {};
                const total = pagination.total != null ? pagination.total : (result.data || []).length;
                const totalPages = pagination.totalPages != null ? pagination.totalPages : 1;
                const pageNum = pagination.page != null ? pagination.page : page;

                if (pageNum > totalPages && totalPages > 0) {
                    loadReviews(totalPages);
                    return;
                }

                syncPageUrl(pageNum);

                if (reviewCountEl) {
                    if (total === 0) {
                        reviewCountEl.textContent = '';
                    } else {
                        const start = (pageNum - 1) * itemsPerPage + 1;
                        const end = Math.min(pageNum * itemsPerPage, total);
                        reviewCountEl.textContent = '총 ' + total + '건 · ' + start + '-' + end + '번째';
                    }
                }

                if (!result.data || result.data.length === 0) {
                    reviewsList.innerHTML = \`
                        <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">아직 등록된 후기가 없습니다.</p>
                            <p class="text-gray-500 mt-2">첫 번째 후기의 주인공이 되어보세요!</p>
                        </div>
                    \`;
                    renderPagination(pagination);
                    return;
                }

                reviewsList.innerHTML = result.data.map(review => \`
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 p-6 border border-gray-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">\${maskName(review.author_name)}</p>
                                    <p class="text-xs text-gray-500">\${new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="flex text-yellow-400 text-sm">
                                \${getStarRating(review.rating)}
                            </div>
                        </div>
                        <div class="mb-3">
                            <span class="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md mb-2">
                                \${review.course_title || '과정명 없음'}
                            </span>
                            <h3 class="text-lg font-bold text-gray-800">\${review.title}</h3>
                        </div>
                        <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            \${review.content}
                        </p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <button onclick="markHelpful(\${review.id})" class="text-gray-500 hover:text-green-600 text-sm flex items-center transition">
                                <i class="far fa-thumbs-up mr-1"></i> 도움이 됐어요 (\${review.likes || 0})
                            </button>
                        </div>
                    </div>
                \`).join('');

                renderPagination(pagination);

                if (page > 1) {
                    const listTop = reviewsList.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: listTop, behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error:', error);
                reviewsList.innerHTML = \`
                    <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다.</p>
                    </div>
                \`;
                if (reviewCountEl) reviewCountEl.textContent = '';
            }
        }

        async function markHelpful(id) {
            try {
                await fetch(\`/api/posts/\${id}/like\`, { method: 'POST' });
                loadReviews(currentPage);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function maskName(name) {
            if (!name) return '익명';
            if (name.length <= 2) return name.replace(/.$/, '*');
            return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        }

        function getStarRating(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }
    </script>
</body>
</html>
`;
