import { hrdSidebar } from './components/hrd_sidebar';

export const adminReviewsListHtml = (sidebar: string | null = null) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>리뷰 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar || hrdSidebar('reviews')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">리뷰 관리</h2>
                    <span class="ml-4 text-sm text-gray-500">작성된 수강후기를 검토하고 승인합니다.</span>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
        <!-- 필터 및 검색 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div class="flex flex-wrap gap-3 items-center">
                <select id="statusFilter" onchange="loadReviews(1)" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">전체 상태</option>
                    <option value="0">승인 대기</option>
                    <option value="1">승인됨</option>
                </select>
                <button type="button" onclick="loadReviews(1)" class="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition" title="새로고침"><i class="fas fa-sync-alt"></i></button>
                <span id="searchResultText" class="text-sm text-gray-500"></span>
                <label class="flex items-center gap-1.5 text-sm text-gray-500">
                    <span>페이지당</span>
                    <select id="rowsPerPage" onchange="setRowsPerPageReviews(parseInt(this.value, 10))" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>
                    <span>건</span>
                </label>
            </div>
        </div>

        <!-- 목록 테이블 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[320px]">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자 / 과정</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점 / 내용</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="reviewsTableBody" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="5" class="px-6 py-16 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="paginationWrap" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div id="paginationRange" class="text-sm text-gray-600"></div>
            <nav id="paginationReviews" class="flex flex-wrap items-center justify-center gap-1"></nav>
        </div>
    </div>

    <script>
        let currentPageReviews = 1;
        let itemsPerPageReviews = 10;

        function setRowsPerPageReviews(n) {
            itemsPerPageReviews = n;
            document.getElementById('rowsPerPage').value = String(n);
            loadReviews(1);
        }

        document.addEventListener('DOMContentLoaded', () => loadReviews(1));

        async function loadReviews(page) {
            currentPageReviews = page;
            document.getElementById('searchResultText').textContent = '';
            document.getElementById('paginationRange').textContent = '';
            const status = document.getElementById('statusFilter').value;
            
            let url = '/api/reviews?page=' + page + '&limit=' + itemsPerPageReviews;
            if (status !== '') url += '&approved=' + status;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('reviewsTableBody');
                
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    document.getElementById('paginationReviews').innerHTML = '';
                    return;
                }

                const p = result.pagination || {};
                const total = p.total != null ? p.total : 0;
                const totalPages = p.totalPages != null ? p.totalPages : 1;
                const pageNum = p.page != null ? p.page : 1;
                if (p.limit) {
                    itemsPerPageReviews = p.limit;
                    const sel = document.getElementById('rowsPerPage');
                    if (sel) sel.value = String(p.limit);
                }
                document.getElementById('searchResultText').textContent = '검색결과 ' + total + '건';

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center"><div class="flex flex-col items-center text-gray-500"><i class="fas fa-star text-4xl text-gray-300 mb-3"></i><p class="font-medium">등록된 리뷰가 없습니다</p></div></td></tr>';
                    document.getElementById('paginationReviews').innerHTML = '';
                    return;
                }

                tbody.innerHTML = result.data.map(review => \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                                review.approved === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }">
                                \${review.approved === 1 ? '승인됨' : '승인 대기'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${review.user_name || '이름 없음'}</div>
                            <div class="text-xs text-gray-500">\${review.course_title || '과정명 없음'}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex text-yellow-400 text-xs mb-1">
                                \${getStarRating(review.rating)}
                            </div>
                            <div class="text-sm font-bold text-gray-800">\${review.title}</div>
                            <div class="text-sm text-gray-500 truncate max-w-xs">\${review.content}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(review.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            \${review.approved === 0 ? \`
                                <button onclick="approveReview(\${review.id}, true)" class="text-green-600 hover:text-green-900 mr-3">
                                    <i class="fas fa-check"></i> 승인
                                </button>
                            \` : \`
                                <button onclick="approveReview(\${review.id}, false)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                                    <i class="fas fa-ban"></i> 승인 취소
                                </button>
                            \`}
                            <button onclick="deleteReview(\${review.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    </tr>
                \`).join('');

                const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || itemsPerPageReviews) + 1;
                const end = Math.min(pageNum * (p.limit || itemsPerPageReviews), total);
                document.getElementById('paginationRange').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';

                const nav = document.getElementById('paginationReviews');
                if (totalPages <= 1) {
                    nav.innerHTML = '';
                    return;
                }
                const radius = 2;
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= pageNum - radius && i <= pageNum + radius)) pages.push(i);
                    else if (pages[pages.length - 1] !== '...') pages.push('...');
                }
                let html = '';
                html += '<button type="button" onclick="loadReviews(' + (pageNum - 1) + ')" ' + (pageNum <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (pageNum <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
                pages.forEach(function(n) {
                    if (n === '...') html += '<span class="px-2 py-2 text-gray-400">…</span>';
                    else {
                        const active = n === pageNum;
                        html += '<button type="button" onclick="loadReviews(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50') + '">' + n + '</button>';
                    }
                });
                html += '<button type="button" onclick="loadReviews(' + (pageNum + 1) + ')" ' + (pageNum >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (pageNum >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
                nav.innerHTML = html;
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reviewsTableBody').innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
                document.getElementById('paginationReviews').innerHTML = '';
            }
        }

        async function approveReview(id, approved) {
            if (!confirm(approved ? '이 리뷰를 승인하시겠습니까?' : '이 리뷰의 승인을 취소하시겠습니까?')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/reviews/\${id}/approve\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ approved })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('처리되었습니다.');
                    loadReviews(currentPageReviews);
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('처리 중 오류가 발생했습니다.');
            }
        }

        async function deleteReview(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/reviews/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadReviews(currentPageReviews);
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
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
        </main>
    </div>
</div>
</body>
</html>
`;
