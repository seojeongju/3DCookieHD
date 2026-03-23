import { hrdSidebar } from './components/hrd_sidebar';

export const adminReviewsListHtml = (sidebar: string | null = null) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강후기 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar || hrdSidebar('reviews')}
        <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 min-w-0">
            <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 shrink-0">
                <div class="flex items-center min-w-0 gap-3">
                    <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">수강후기 관리</h2>
                    <span class="hidden sm:inline text-sm text-slate-500 truncate">홈페이지 노출은 <code class="text-xs bg-slate-100 px-1 rounded">공개(published)</code> 상태입니다.</span>
                </div>
                <button type="button" onclick="openReviewCreateModal()" class="shrink-0 px-4 py-2.5 rounded-2xl bg-sky-600 text-white text-sm font-black shadow-sm hover:bg-slate-900 transition">
                    <i class="fas fa-plus mr-2"></i>수강후기 등록
                </button>
            </header>

            <main class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
                    <div class="flex flex-wrap gap-3 items-center">
                        <select id="statusFilter" onchange="loadReviews(1)" class="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm font-bold text-slate-700">
                            <option value="">전체 상태</option>
                            <option value="hidden">승인 대기(비공개)</option>
                            <option value="published">공개됨</option>
                        </select>
                        <button type="button" onclick="loadReviews(1)" class="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-sky-600 transition" title="새로고침"><i class="fas fa-sync-alt"></i></button>
                        <span id="searchResultText" class="text-sm text-slate-500"></span>
                        <label class="flex items-center gap-1.5 text-sm text-slate-500">
                            <span>페이지당</span>
                            <select id="rowsPerPage" onchange="setRowsPerPageReviews(parseInt(this.value, 10))" class="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-sky-500">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <span>건</span>
                        </label>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[320px]">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-200">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">상태</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">작성자 / 과정</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">평점 / 내용</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">작성일</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="reviewsTableBody" class="bg-white divide-y divide-slate-200">
                                <tr>
                                    <td colspan="5" class="px-6 py-16 text-center text-slate-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="paginationWrap" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div id="paginationRange" class="text-sm text-slate-600"></div>
                    <nav id="paginationReviews" class="flex flex-wrap items-center justify-center gap-1"></nav>
                </div>
            </main>
        </div>
    </div>

    <!-- 등록 모달 -->
    <div id="reviewCreateModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="text-lg font-black text-slate-900">수강후기 등록</h3>
                <button type="button" onclick="closeReviewCreateModal()" class="text-slate-400 hover:text-slate-700 p-2"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="reviewCreateForm" onsubmit="submitReviewCreate(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">작성자 사용자 ID *</label>
                    <input type="number" name="author_id" id="reviewAuthorId" required min="1" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-mono text-sm" placeholder="users.id">
                    <p class="text-[11px] text-slate-500 mt-1">후기가 속할 수강생 계정의 회원 번호입니다.</p>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">과정 *</label>
                    <select id="reviewCourseSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm mb-2">
                        <option value="">— 목록에서 선택 —</option>
                    </select>
                    <input type="number" name="course_id" id="reviewCourseId" required min="1" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-mono text-sm" placeholder="과정 ID (courses 또는 승인과정 id)">
                    <p class="text-[11px] text-slate-500 mt-1">목록 선택 시 자동 입력됩니다. 국비 과정만 해당되면 승인과정 ID를 직접 입력하세요.</p>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">평점 *</label>
                    <select name="rating" id="reviewRating" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm">
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">제목 *</label>
                    <input type="text" name="title" required maxlength="200" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm" placeholder="후기 제목">
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">내용 *</label>
                    <textarea name="content" required rows="5" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm custom-scrollbar" placeholder="후기 내용"></textarea>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">공개 여부</label>
                    <select name="status" id="reviewInitialStatus" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm">
                        <option value="published">바로 공개 (홈페이지 노출)</option>
                        <option value="hidden">비공개 (추후 승인)</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeReviewCreateModal()" class="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">취소</button>
                    <button type="submit" class="px-6 py-3 rounded-2xl bg-sky-600 text-white text-sm font-black hover:bg-slate-900 transition">등록</button>
                </div>
            </form>
        </div>
    </div>

    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>

    <script>
        let currentPageReviews = 1;
        let itemsPerPageReviews = 10;

        function setRowsPerPageReviews(n) {
            itemsPerPageReviews = n;
            document.getElementById('rowsPerPage').value = String(n);
            loadReviews(1);
        }

        function escapeHtml(s) {
            if (s == null) return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function openReviewCreateModal() {
            document.getElementById('reviewCreateModal').classList.remove('hidden');
            document.getElementById('reviewCreateModal').classList.add('flex');
            loadCourseOptionsForModal();
        }

        function closeReviewCreateModal() {
            document.getElementById('reviewCreateModal').classList.add('hidden');
            document.getElementById('reviewCreateModal').classList.remove('flex');
        }

        async function loadCourseOptionsForModal() {
            const sel = document.getElementById('reviewCourseSelect');
            if (!sel || sel.dataset.loaded === '1') return;
            try {
                const res = await fetch('/api/courses?limit=500&page=1');
                const json = await res.json();
                const list = (json.data || json.results || json) || [];
                const rows = Array.isArray(list) ? list : [];
                rows.forEach(function(c) {
                    if (!c || c.id == null) return;
                    const opt = document.createElement('option');
                    opt.value = String(c.id);
                    opt.textContent = '[' + c.id + '] ' + (c.title || c.name || '과정');
                    sel.appendChild(opt);
                });
                sel.dataset.loaded = '1';
            } catch (e) {
                console.error(e);
            }
            sel.onchange = function() {
                const v = sel.value;
                const manual = document.getElementById('reviewCourseId');
                if (manual && v) manual.value = v;
            };
        }

        document.addEventListener('DOMContentLoaded', () => loadReviews(1));

        async function loadReviews(page) {
            currentPageReviews = page;
            document.getElementById('searchResultText').textContent = '';
            document.getElementById('paginationRange').textContent = '';
            const status = document.getElementById('statusFilter').value;

            let url = '/api/posts?category=review&page=' + page + '&limit=' + itemsPerPageReviews + '&sort=created_at&order=DESC';
            if (status !== '') url += '&status=' + encodeURIComponent(status);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                const tbody = document.getElementById('reviewsTableBody');

                if (response.status === 401) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">로그인이 필요합니다.</td></tr>';
                    return;
                }

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
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center"><div class="flex flex-col items-center text-slate-500"><i class="fas fa-star text-4xl text-slate-300 mb-3"></i><p class="font-bold">등록된 수강후기가 없습니다</p></div></td></tr>';
                    document.getElementById('paginationReviews').innerHTML = '';
                    return;
                }

                tbody.innerHTML = result.data.map(function(review) {
                    const isPub = review.status === 'published';
                    const stClass = isPub ? 'bg-emerald-100 text-emerald-800' : (review.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800');
                    const stLabel = isPub ? '공개' : (review.status === 'draft' ? '임시' : '비공개');
                    const courseTitle = review.course_title || ('과정 #' + (review.course_id || ''));
                    const contentPlain = escapeHtml((review.content || '').replace(/<[^>]+>/g, ' ').trim().substring(0, 120));
                    return '<tr class="hover:bg-slate-50 transition">' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap">' +
                        '<span class="px-2 py-1 inline-flex text-xs font-bold rounded-full ' + stClass + '">' + stLabel + '</span>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4">' +
                        '<div class="text-sm font-bold text-slate-900">' + escapeHtml(review.author_name || '—') + ' <span class="text-slate-400 font-mono text-xs">(id:' + escapeHtml(String(review.author_id || '')) + ')</span></div>' +
                        '<div class="text-xs text-slate-500">' + escapeHtml(courseTitle) + '</div>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4">' +
                        '<div class="flex text-amber-400 text-xs mb-1">' + getStarRating(review.rating) + '</div>' +
                        '<div class="text-sm font-bold text-slate-800">' + escapeHtml(review.title || '') + '</div>' +
                        '<div class="text-sm text-slate-500 truncate max-w-md">' + contentPlain + (contentPlain.length >= 120 ? '…' : '') + '</div>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">' +
                        escapeHtml(new Date(review.created_at).toLocaleString('ko-KR')) +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">' +
                        (isPub
                            ? '<button type="button" onclick="setReviewPublished(' + review.id + ', false)" class="text-amber-600 hover:text-amber-900 mr-2 font-bold"><i class="fas fa-eye-slash"></i> 비공개</button>'
                            : '<button type="button" onclick="setReviewPublished(' + review.id + ', true)" class="text-emerald-600 hover:text-emerald-900 mr-2 font-bold"><i class="fas fa-check"></i> 공개</button>') +
                        '<button type="button" onclick="deleteReview(' + review.id + ')" class="text-red-600 hover:text-red-900 font-bold"><i class="fas fa-trash"></i> 삭제</button>' +
                        '</td>' +
                        '</tr>';
                }).join('');

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
                html += '<button type="button" onclick="loadReviews(' + (pageNum - 1) + ')" ' + (pageNum <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold ' + (pageNum <= 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
                pages.forEach(function(n) {
                    if (n === '...') html += '<span class="px-2 py-2 text-slate-400">…</span>';
                    else {
                        const active = n === pageNum;
                        html += '<button type="button" onclick="loadReviews(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-xl text-sm font-bold ' + (active ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50') + '">' + n + '</button>';
                    }
                });
                html += '<button type="button" onclick="loadReviews(' + (pageNum + 1) + ')" ' + (pageNum >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold ' + (pageNum >= totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
                nav.innerHTML = html;

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reviewsTableBody').innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
                document.getElementById('paginationReviews').innerHTML = '';
            }
        }

        async function setReviewPublished(id, published) {
            if (!confirm(published ? '이 후기를 공개(홈페이지 노출)하시겠습니까?' : '비공개(승인 대기)로 바꾸시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/posts/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ status: published ? 'published' : 'hidden' })
                });
                const result = await response.json();
                if (result.success) {
                    alert('처리되었습니다.');
                    loadReviews(currentPageReviews);
                } else {
                    alert('오류: ' + (result.error || '알 수 없음'));
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
                const response = await fetch('/api/posts/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadReviews(currentPageReviews);
                } else {
                    alert('오류: ' + (result.error || '알 수 없음'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function submitReviewCreate(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }
            const authorId = parseInt(document.getElementById('reviewAuthorId').value, 10);
            const courseId = parseInt(document.getElementById('reviewCourseId').value, 10);
            const rating = parseInt(document.getElementById('reviewRating').value, 10);
            const title = (document.querySelector('#reviewCreateForm [name="title"]').value || '').trim();
            const content = (document.querySelector('#reviewCreateForm [name="content"]').value || '').trim();
            const status = document.getElementById('reviewInitialStatus').value;
            if (!authorId || !courseId || !title || !content) {
                alert('작성자 ID, 과정 ID, 제목, 내용을 입력해 주세요.');
                return;
            }
            try {
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        category: 'review',
                        author_id: authorId,
                        course_id: courseId,
                        rating: rating,
                        title: title,
                        content: content,
                        status: status
                    })
                });
                const result = await res.json();
                if (result.success) {
                    alert('수강후기가 등록되었습니다.');
                    closeReviewCreateModal();
                    document.getElementById('reviewCreateForm').reset();
                    document.getElementById('reviewCourseSelect').value = '';
                    loadReviews(1);
                } else {
                    alert(result.error || '등록에 실패했습니다.');
                }
            } catch (err) {
                console.error(err);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        function getStarRating(rating) {
            let stars = '';
            const r = parseInt(rating, 10) || 0;
            for (let i = 1; i <= 5; i++) {
                stars += i <= r ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }
            return stars;
        }
    </script>
</body>
</html>
`;
