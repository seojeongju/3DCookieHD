import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdTrainingLogsReviewHtml = (sidebar = hrdSidebar('training-logs')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련일지 회차 점검 - 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .dot-grid { background-image: radial-gradient(circle, rgba(148,163,184,0.25) 1px, transparent 1px); background-size: 20px 20px; }
        .bento-card { transition: transform .2s ease, box-shadow .2s ease; }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -12px rgba(15,23,42,0.18); }
    </style>
</head>
<body class="bg-slate-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 dot-grid">
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex-shrink-0">
                <div class="px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
                    <div class="min-w-0">
                        <a href="/admin/training-logs" class="text-xs font-bold text-slate-400 hover:text-indigo-600"><i class="fas fa-arrow-left mr-1"></i>통합 훈련일지 현황</a>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-800 mt-1">훈련일지 회차 점검</h1>
                        <p class="text-slate-500 mt-1 text-sm">회차가 지정되지 않은 예전 일지를 확인하고, 실제 회차로 지정합니다. 일지 내용은 바뀌지 않습니다.</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="applyBtn" onclick="applyTimetable()" class="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed">
                            <i class="fas fa-calendar-check mr-1.5"></i>시간표로 확인된 <span id="applyCount">0</span>건 일괄 지정
                        </button>
                        <button onclick="loadReview()" class="p-2.5 bg-white border border-slate-200/60 rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm" title="새로고침"><i class="fas fa-sync-alt"></i></button>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bento-card bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                            <div class="text-xs text-slate-400 font-bold tracking-wider mb-1">회차 미지정 일지</div>
                            <div class="text-3xl font-black text-slate-800" id="statTotal">-</div>
                        </div>
                        <div class="bento-card bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                            <div class="text-xs text-slate-400 font-bold tracking-wider mb-1">시간표로 자동 확인</div>
                            <div class="text-3xl font-black text-emerald-600" id="statAuto">-</div>
                        </div>
                        <div class="bento-card bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                            <div class="text-xs text-slate-400 font-bold tracking-wider mb-1">관리자 확인 필요</div>
                            <div class="text-3xl font-black text-rose-600" id="statReview">-</div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 flex flex-col lg:flex-row lg:items-center gap-3">
                        <select id="reasonFilter" onchange="render()" class="bg-slate-50 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="all">전체 사유</option>
                        </select>
                        <div class="flex items-center bg-slate-50 rounded-xl px-3 py-2 flex-1 lg:max-w-sm focus-within:ring-2 focus-within:ring-indigo-500">
                            <i class="fas fa-search text-slate-400 mr-2 text-sm"></i>
                            <input id="search" oninput="render()" placeholder="주제·강사·회차명 검색" class="bg-transparent outline-none text-sm w-full">
                        </div>
                        <div class="text-xs text-slate-400 lg:ml-auto">
                            <i class="fas fa-info-circle mr-1"></i>추천 회차는 그 날짜에 시간표 수업이 있는 회차입니다.
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-slate-100">
                                <thead class="bg-slate-50/60">
                                    <tr>
                                        <th class="px-5 py-3 text-left text-[11px] font-bold text-slate-400 whitespace-nowrap">훈련일</th>
                                        <th class="px-5 py-3 text-left text-[11px] font-bold text-slate-400">일지</th>
                                        <th class="px-5 py-3 text-left text-[11px] font-bold text-slate-400">현재 보이는 회차</th>
                                        <th class="px-5 py-3 text-left text-[11px] font-bold text-slate-400">사유</th>
                                        <th class="px-5 py-3 text-left text-[11px] font-bold text-slate-400 w-[320px]">지정할 회차</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody" class="divide-y divide-slate-50"></tbody>
                            </table>
                        </div>
                        <div class="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                            <div class="text-xs font-bold text-slate-500">총 <span id="count" class="text-indigo-600">0</span>건</div>
                            <div id="pager" class="flex items-center gap-1"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        var token = localStorage.getItem('token');
        var reviewData = { needsReview: [], sessions: [] };
        var page = 1;
        var PAGE_SIZE = 20;
        var DOW = ['일', '월', '화', '수', '목', '금', '토'];

        function esc(s) {
            return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        function withDow(d) {
            var dt = new Date(d + 'T00:00:00');
            return isNaN(dt) ? d : d + ' (' + DOW[dt.getDay()] + ')';
        }

        async function api(method, url, body) {
            var res = await fetch(url, {
                method: method,
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined
            });
            if (res.status === 401) { location.href = '/login'; return null; }
            return res.json();
        }

        async function loadReview() {
            document.getElementById('tbody').innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400"><i class="fas fa-circle-notch fa-spin mr-2"></i>불러오는 중...</td></tr>';
            var json = await api('GET', '/api/hrd/training-logs/legacy-review');
            if (!json) return;
            if (!json.success) {
                document.getElementById('tbody').innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center text-rose-500">' + esc(json.error || '불러오기 실패') + '</td></tr>';
                return;
            }
            reviewData = json.data;
            document.getElementById('statTotal').textContent = reviewData.total;
            document.getElementById('statAuto').textContent = reviewData.assigned;
            document.getElementById('statReview').textContent = reviewData.needsReview.length;
            document.getElementById('applyCount').textContent = reviewData.assigned;
            document.getElementById('applyBtn').disabled = reviewData.assigned === 0;

            var reasons = Array.from(new Set(reviewData.needsReview.map(function (r) { return r.reason; })));
            var sel = document.getElementById('reasonFilter');
            var prev = sel.value;
            sel.innerHTML = '<option value="all">전체 사유</option>' + reasons.map(function (r) {
                return '<option value="' + esc(r) + '">' + esc(r) + '</option>';
            }).join('');
            if (reasons.indexOf(prev) >= 0) sel.value = prev;
            render();
        }

        function filtered() {
            var reason = document.getElementById('reasonFilter').value;
            var q = document.getElementById('search').value.trim().toLowerCase();
            return reviewData.needsReview.filter(function (r) {
                if (reason !== 'all' && r.reason !== reason) return false;
                if (!q) return true;
                var hay = [r.topic, r.instructor_name, r.content_preview]
                    .concat(r.current_sessions.map(function (s) { return s.title; }))
                    .join(' ').toLowerCase();
                return hay.indexOf(q) >= 0;
            });
        }

        function sessionOptions(r) {
            var used = {};
            function group(label, list) {
                var opts = list.filter(function (s) { return !used[s.session_id]; }).map(function (s) {
                    used[s.session_id] = true;
                    return '<option value="' + s.session_id + '">' + esc(s.title) + '</option>';
                }).join('');
                return opts ? '<optgroup label="' + label + '">' + opts + '</optgroup>' : '';
            }
            return '<option value="">회차 선택</option>'
                + group('추천: 그날 시간표 수업 있음', r.timetable_sessions)
                + group('운영기간·요일 일치', r.period_sessions)
                + group('전체 회차', reviewData.sessions);
        }

        function render() {
            var rows = filtered();
            var totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
            if (page > totalPages) page = totalPages;
            var slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
            document.getElementById('count').textContent = rows.length;

            var tbody = document.getElementById('tbody');
            if (slice.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400">확인이 필요한 일지가 없습니다.</td></tr>';
            } else {
                tbody.innerHTML = slice.map(function (r) {
                    var current = r.current_sessions.length
                        ? r.current_sessions.map(function (s) { return '<div class="text-xs text-slate-600">' + esc(s.title) + '</div>'; }).join('')
                        : '<span class="text-xs text-slate-300">없음</span>';
                    return '<tr class="hover:bg-indigo-50/30 align-top">'
                        + '<td class="px-5 py-4 text-sm font-bold text-slate-700 whitespace-nowrap">' + esc(withDow(r.date)) + '<div class="text-[10px] text-slate-400 font-medium mt-1">일지 #' + r.id + '</div></td>'
                        + '<td class="px-5 py-4 max-w-[280px]"><div class="text-sm font-bold text-slate-800 break-words">' + esc(r.topic || '-') + '</div>'
                        + '<div class="text-xs text-slate-500 mt-1">' + esc(r.instructor_name || '강사 미지정') + '</div>'
                        + (r.content_preview ? '<div class="text-[11px] text-slate-400 mt-1 line-clamp-2 break-words">' + esc(r.content_preview) + '</div>' : '')
                        + '</td>'
                        + '<td class="px-5 py-4 max-w-[240px]">' + current + '</td>'
                        + '<td class="px-5 py-4 max-w-[220px]"><span class="inline-block px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold ring-1 ring-rose-100">' + esc(r.reason) + '</span></td>'
                        + '<td class="px-5 py-4"><div class="flex gap-2">'
                        + '<select id="sel-' + r.id + '" class="flex-1 min-w-0 bg-slate-50 rounded-xl px-2 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">' + sessionOptions(r) + '</select>'
                        + '<button onclick="assign(' + r.id + ')" class="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 whitespace-nowrap">지정</button>'
                        + '</div></td>'
                        + '</tr>';
                }).join('');
            }

            var pager = document.getElementById('pager');
            if (totalPages <= 1) { pager.innerHTML = ''; return; }
            var html = '';
            for (var i = 1; i <= totalPages; i++) {
                html += '<button onclick="goPage(' + i + ')" class="w-8 h-8 rounded-lg text-xs font-black ' + (i === page ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white') + '">' + i + '</button>';
            }
            pager.innerHTML = html;
        }

        function goPage(p) { page = p; render(); }

        async function assign(logId) {
            var sel = document.getElementById('sel-' + logId);
            var sessionId = sel && sel.value;
            if (!sessionId) { alert('지정할 회차를 선택해 주세요.'); return; }
            var title = sel.options[sel.selectedIndex].text;
            if (!confirm('일지 #' + logId + '을(를) "' + title + '" 회차로 지정할까요?')) return;
            var json = await api('POST', '/api/hrd/training-logs/' + logId + '/assign-session', { session_id: Number(sessionId) });
            if (!json) return;
            if (!json.success) { alert(json.error || '지정 실패'); return; }
            reviewData.needsReview = reviewData.needsReview.filter(function (r) { return r.id !== logId; });
            reviewData.total -= 1;
            document.getElementById('statTotal').textContent = reviewData.total;
            document.getElementById('statReview').textContent = reviewData.needsReview.length;
            render();
        }

        async function applyTimetable() {
            if (!confirm('시간표로 소속이 확인된 일지 ' + reviewData.assigned + '건에 회차를 지정할까요?')) return;
            var btn = document.getElementById('applyBtn');
            btn.disabled = true;
            var json = await api('POST', '/api/hrd/training-logs/legacy-review/apply');
            if (json && json.success) alert(json.message);
            else if (json) alert(json.error || '처리 실패');
            loadReview();
        }

        document.addEventListener('DOMContentLoaded', loadReview);
    </script>
</body>
</html>
`;
