import { hrdSidebar } from './components/hrd_sidebar';

export const adminReviewsListHtml = (sidebar: string | null = null) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>?섍컯?꾧린 愿由?- ??곗벐由щ뵒?띾??쇳꽣</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar || hrdSidebar('reviews')}
        <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 min-w-0">
            <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 shrink-0">
                <div class="flex items-center min-w-0 gap-3">
                    <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">?섍컯?꾧린 愿由?/h2>
                    <span class="hidden sm:inline text-sm text-slate-500 truncate">?덊럹?댁? ?몄텧? <code class="text-xs bg-slate-100 px-1 rounded">怨듦컻(published)</code> ?곹깭?낅땲??</span>
                </div>
                <button type="button" onclick="openReviewCreateModal()" class="shrink-0 px-4 py-2.5 rounded-2xl bg-sky-600 text-white text-sm font-black shadow-sm hover:bg-slate-900 transition">
                    <i class="fas fa-plus mr-2"></i>?섍컯?꾧린 ?깅줉
                </button>
            </header>

            <main class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
                    <div class="flex flex-wrap gap-3 items-center">
                        <select id="statusFilter" onchange="loadReviews(1)" class="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm font-bold text-slate-700">
                            <option value="">?꾩껜 ?곹깭</option>
                            <option value="hidden">?뱀씤 ?湲?鍮꾧났媛?</option>
                            <option value="published">怨듦컻??/option>
                        </select>
                        <button type="button" onclick="loadReviews(1)" class="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-sky-600 transition" title="?덈줈怨좎묠"><i class="fas fa-sync-alt"></i></button>
                        <span id="searchResultText" class="text-sm text-slate-500"></span>
                        <label class="flex items-center gap-1.5 text-sm text-slate-500">
                            <span>?섏씠吏??/span>
                            <select id="rowsPerPage" onchange="setRowsPerPageReviews(parseInt(this.value, 10))" class="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-sky-500">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <span>嫄?/span>
                        </label>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[320px]">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-200">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">?곹깭</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">?묒꽦??/ 怨쇱젙</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">?됱젏 / ?댁슜</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">?묒꽦??/th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">愿由?/th>
                                </tr>
                            </thead>
                            <tbody id="reviewsTableBody" class="bg-white divide-y divide-slate-200">
                                <tr>
                                    <td colspan="5" class="px-6 py-16 text-center text-slate-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> ?곗씠?곕? 遺덈윭?ㅻ뒗 以?..
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

    <!-- ?깅줉 紐⑤떖 -->
    <div id="reviewCreateModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="text-lg font-black text-slate-900">?섍컯?꾧린 ?깅줉</h3>
                <button type="button" onclick="closeReviewCreateModal()" class="text-slate-400 hover:text-slate-700 p-2"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="reviewCreateForm" onsubmit="submitReviewCreate(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">?묒꽦???ъ슜??ID *</label>
                    <select id="reviewAuthorSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm mb-2">
                        <option value="">??怨쇱젙??癒쇱? ?좏깮?섏꽭????/option>
                    </select>
                    <input type="number" name="author_id" id="reviewAuthorId" required min="1" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-mono text-sm" placeholder="users.id">
                    <p class="text-[11px] text-slate-500 mt-1">怨쇱젙 ?좏깮 ???뱀씤???섍컯??紐⑸줉?먯꽌 ?좏깮?????덉뒿?덈떎. ?꾩슂 ???뚯썝 踰덊샇瑜?吏곸젒 ?낅젰???섎룄 ?덉뒿?덈떎.</p>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">怨쇱젙 *</label>
                    <select id="reviewCourseSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm mb-2">
                        <option value="">??紐⑸줉?먯꽌 ?좏깮 ??/option>
                    </select>
                    <input type="number" name="course_id" id="reviewCourseId" required min="1" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none font-mono text-sm" placeholder="怨쇱젙 ID (courses ?먮뒗 ?뱀씤怨쇱젙 id)">
                    <p class="text-[11px] text-slate-500 mt-1">紐⑸줉 ?좏깮 ???먮룞 ?낅젰?⑸땲?? 援?퉬 怨쇱젙留??대떦?섎㈃ ?뱀씤怨쇱젙 ID瑜?吏곸젒 ?낅젰?섏꽭??</p>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">?됱젏 *</label>
                    <select name="rating" id="reviewRating" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm">
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">?쒕ぉ *</label>
                    <input type="text" name="title" required maxlength="200" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm" placeholder="?꾧린 ?쒕ぉ">
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">?댁슜 *</label>
                    <textarea name="content" required rows="5" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm custom-scrollbar" placeholder="?꾧린 ?댁슜"></textarea>
                </div>
                <div>
                    <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">怨듦컻 ?щ?</label>
                    <select name="status" id="reviewInitialStatus" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm">
                        <option value="published">諛붾줈 怨듦컻 (?덊럹?댁? ?몄텧)</option>
                        <option value="hidden">鍮꾧났媛?(異뷀썑 ?뱀씤)</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeReviewCreateModal()" class="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">痍⑥냼</button>
                    <button type="submit" class="px-6 py-3 rounded-2xl bg-sky-600 text-white text-sm font-black hover:bg-slate-900 transition">?깅줉</button>
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
            resetReviewAuthorOptions();
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
                    opt.textContent = '[' + c.id + '] ' + (c.title || c.name || '怨쇱젙');
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
                loadAuthorOptionsByCourse(v);
            };
        }

        function resetReviewAuthorOptions() {
            const authorSel = document.getElementById('reviewAuthorSelect');
            if (!authorSel) return;
            authorSel.innerHTML = '<option value="">??怨쇱젙??癒쇱? ?좏깮?섏꽭????/option>';
            authorSel.onchange = function() {
                const v = authorSel.value;
                if (v) document.getElementById('reviewAuthorId').value = v;
            };
        }

        async function loadAuthorOptionsByCourse(courseIdRaw) {
            const authorSel = document.getElementById('reviewAuthorSelect');
            if (!authorSel) return;
            const courseId = parseInt(courseIdRaw, 10);
            if (!courseId) {
                resetReviewAuthorOptions();
                return;
            }
            authorSel.innerHTML = '<option value="">?섍컯??紐⑸줉 遺덈윭?ㅻ뒗 以?..</option>';
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/enrollments?course_id=' + courseId + '&status=approved&limit=500', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                const list = Array.isArray(json?.data) ? json.data : [];
                const uniq = new Map();
                list.forEach(function(r) {
                    const uid = Number(r.user_id);
                    if (!uid || uniq.has(uid)) return;
                    uniq.set(uid, r);
                });
                if (uniq.size === 0) {
                    authorSel.innerHTML = '<option value="">?뱀씤???섍컯?앹씠 ?놁뒿?덈떎. ?ъ슜??ID瑜?吏곸젒 ?낅젰?섏꽭??/option>';
                    return;
                }
                authorSel.innerHTML = '<option value="">???섍컯???좏깮 ??/option>';
                Array.from(uniq.values()).forEach(function(r) {
                    const opt = document.createElement('option');
                    opt.value = String(r.user_id);
                    opt.textContent = '[' + r.user_id + '] ' + (r.user_name || '?대쫫 ?놁쓬') + (r.user_email ? ' 쨌 ' + r.user_email : '');
                    authorSel.appendChild(opt);
                });
                authorSel.onchange = function() {
                    const v = authorSel.value;
                    if (v) document.getElementById('reviewAuthorId').value = v;
                };
            } catch (e) {
                console.error(e);
                authorSel.innerHTML = '<option value="">?섍컯??紐⑸줉 濡쒕뱶 ?ㅽ뙣 (吏곸젒 ?낅젰 媛??</option>';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadReviews(1);
            const courseManual = document.getElementById('reviewCourseId');
            if (courseManual) {
                courseManual.addEventListener('change', function() {
                    loadAuthorOptionsByCourse(courseManual.value);
                });
                courseManual.addEventListener('blur', function() {
                    loadAuthorOptionsByCourse(courseManual.value);
                });
            }
        });

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
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">濡쒓렇?몄씠 ?꾩슂?⑸땲??</td></tr>';
                    return;
                }

                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">?곗씠?곕? 遺덈윭?ㅻ뒗???ㅽ뙣?덉뒿?덈떎.</td></tr>';
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
                document.getElementById('searchResultText').textContent = '寃?됯껐怨?' + total + '嫄?;

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center"><div class="flex flex-col items-center text-slate-500"><i class="fas fa-star text-4xl text-slate-300 mb-3"></i><p class="font-bold">?깅줉???섍컯?꾧린媛 ?놁뒿?덈떎</p></div></td></tr>';
                    document.getElementById('paginationReviews').innerHTML = '';
                    return;
                }

                tbody.innerHTML = result.data.map(function(review) {
                    const isPub = review.status === 'published';
                    const stClass = isPub ? 'bg-emerald-100 text-emerald-800' : (review.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800');
                    const stLabel = isPub ? '怨듦컻' : (review.status === 'draft' ? '?꾩떆' : '鍮꾧났媛?);
                    const courseTitle = review.course_title || ('怨쇱젙 #' + (review.course_id || ''));
                    const contentPlain = escapeHtml((review.content || '').replace(/<[^>]+>/g, ' ').trim().substring(0, 120));
                    return '<tr class="hover:bg-slate-50 transition">' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap">' +
                        '<span class="px-2 py-1 inline-flex text-xs font-bold rounded-full ' + stClass + '">' + stLabel + '</span>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4">' +
                        '<div class="text-sm font-bold text-slate-900">' + escapeHtml(review.author_name || '??) + ' <span class="text-slate-400 font-mono text-xs">(id:' + escapeHtml(String(review.author_id || '')) + ')</span></div>' +
                        '<div class="text-xs text-slate-500">' + escapeHtml(courseTitle) + '</div>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4">' +
                        '<div class="flex text-amber-400 text-xs mb-1">' + getStarRating(review.rating) + '</div>' +
                        '<div class="text-sm font-bold text-slate-800">' + escapeHtml(review.title || '') + '</div>' +
                        '<div class="text-sm text-slate-500 truncate max-w-md">' + contentPlain + (contentPlain.length >= 120 ? '?? : '') + '</div>' +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">' +
                        escapeHtml(new Date(review.created_at).toLocaleString('ko-KR')) +
                        '</td>' +
                        '<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">' +
                        (isPub
                            ? '<button type="button" onclick="setReviewPublished(' + review.id + ', false)" class="text-amber-600 hover:text-amber-900 mr-2 font-bold"><i class="fas fa-eye-slash"></i> 鍮꾧났媛?/button>'
                            : '<button type="button" onclick="setReviewPublished(' + review.id + ', true)" class="text-emerald-600 hover:text-emerald-900 mr-2 font-bold"><i class="fas fa-check"></i> 怨듦컻</button>') +
                        '<button type="button" onclick="deleteReview(' + review.id + ')" class="text-red-600 hover:text-red-900 font-bold"><i class="fas fa-trash"></i> ??젣</button>' +
                        '</td>' +
                        '</tr>';
                }).join('');

                const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || itemsPerPageReviews) + 1;
                const end = Math.min(pageNum * (p.limit || itemsPerPageReviews), total);
                document.getElementById('paginationRange').textContent = total > 0 ? start + '-' + end + ' / ' + total + '嫄? : '';

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
                html += '<button type="button" onclick="loadReviews(' + (pageNum - 1) + ')" ' + (pageNum <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold ' + (pageNum <= 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '"><i class="fas fa-chevron-left mr-1"></i> ?댁쟾</button>';
                pages.forEach(function(n) {
                    if (n === '...') html += '<span class="px-2 py-2 text-slate-400">??/span>';
                    else {
                        const active = n === pageNum;
                        html += '<button type="button" onclick="loadReviews(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-xl text-sm font-bold ' + (active ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50') + '">' + n + '</button>';
                    }
                });
                html += '<button type="button" onclick="loadReviews(' + (pageNum + 1) + ')" ' + (pageNum >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold ' + (pageNum >= totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50') + '">?ㅼ쓬 <i class="fas fa-chevron-right ml-1"></i></button>';
                nav.innerHTML = html;

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reviewsTableBody').innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.</td></tr>';
                document.getElementById('paginationReviews').innerHTML = '';
            }
        }

        async function setReviewPublished(id, published) {
            if (!confirm(published ? '???꾧린瑜?怨듦컻(?덊럹?댁? ?몄텧)?섏떆寃좎뒿?덇퉴?' : '鍮꾧났媛??뱀씤 ?湲?濡?諛붽씀?쒓쿋?듬땲源?')) return;
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
                    alert('泥섎━?섏뿀?듬땲??');
                    loadReviews(currentPageReviews);
                } else {
                    alert('?ㅻ쪟: ' + (result.error || '?????놁쓬'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('泥섎━ 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.');
            }
        }

        async function deleteReview(id) {
            if (!confirm('?뺣쭚 ??젣?섏떆寃좎뒿?덇퉴? ???묒뾽? ?섎룎由????놁뒿?덈떎.')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/posts/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    alert('??젣?섏뿀?듬땲??');
                    loadReviews(currentPageReviews);
                } else {
                    alert('?ㅻ쪟: ' + (result.error || '?????놁쓬'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.');
            }
        }

        async function submitReviewCreate(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                alert('濡쒓렇?몄씠 ?꾩슂?⑸땲??');
                return;
            }
            const authorId = parseInt(document.getElementById('reviewAuthorId').value, 10);
            const courseId = parseInt(document.getElementById('reviewCourseId').value, 10);
            const rating = parseInt(document.getElementById('reviewRating').value, 10);
            const title = (document.querySelector('#reviewCreateForm [name="title"]').value || '').trim();
            const content = (document.querySelector('#reviewCreateForm [name="content"]').value || '').trim();
            const status = document.getElementById('reviewInitialStatus').value;
            if (!authorId || !courseId || !title || !content) {
                alert('?묒꽦??ID, 怨쇱젙 ID, ?쒕ぉ, ?댁슜???낅젰??二쇱꽭??');
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
                    alert('?섍컯?꾧린媛 ?깅줉?섏뿀?듬땲??');
                    closeReviewCreateModal();
                    document.getElementById('reviewCreateForm').reset();
                    document.getElementById('reviewCourseSelect').value = '';
                    loadReviews(1);
                } else {
                    alert(result.error || '?깅줉???ㅽ뙣?덉뒿?덈떎.');
                }
            } catch (err) {
                console.error(err);
                alert('?깅줉 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.');
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
