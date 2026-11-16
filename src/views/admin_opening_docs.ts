import { hrdSidebar } from './components/hrd_sidebar';

/** 개강서류 — 회차 선택 / 서류 리스트 허브 */
export const adminOpeningDocsHubHtml = (sessionId?: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개강서류 준비 - 통합 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -12px rgba(15,23,42,.18); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm" style="background-image:radial-gradient(circle at 1px 1px, rgba(148,163,184,.18) 1px, transparent 0);background-size:24px 24px;">
    <div class="flex h-[100dvh] overflow-hidden min-h-0 min-w-0">
        ${hrdSidebar('courses-opening-docs')}
        <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div class="min-w-0">
                    <h1 class="text-lg font-black tracking-tight text-slate-900 truncate">개강서류 준비</h1>
                    <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Opening Documents · Trainee Pack</p>
                </div>
                <a href="/admin/courses" class="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition">
                    <i class="fas fa-arrow-left text-[10px]"></i> 교육운영 목록
                </a>
            </header>

            <main class="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar min-h-0">
                <div id="sessionPickerPanel" class="mb-6 ${sessionId ? 'hidden' : ''}">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-5 sm:p-6">
                        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div class="flex-1 min-w-0">
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">회차 선택</label>
                                <select id="sessionSelect" class="w-full min-h-[44px] px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500">
                                    <option value="">회차를 선택하세요</option>
                                </select>
                            </div>
                            <button type="button" id="btnLoadSession" class="min-h-[44px] px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black hover:bg-blue-600 transition shadow-sm">
                                서류 목록 보기
                            </button>
                        </div>
                        <p class="mt-3 text-xs text-slate-500 font-medium">모집·개강 전·진행 중 회차에서 훈련생 서류를 출력합니다.</p>
                    </div>
                </div>

                <div id="packPanel" class="${sessionId ? '' : 'hidden'}">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-6">
                        <div class="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-5 sm:p-6">
                            <div class="flex items-start justify-between gap-3 mb-4">
                                <div class="min-w-0">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black mb-2">
                                        <span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> 회차 서류 팩
                                    </span>
                                    <h2 id="packCourseTitle" class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">—</h2>
                                    <p id="packMeta" class="mt-1 text-xs font-medium text-slate-500">—</p>
                                </div>
                                <button type="button" id="btnChangeSession" class="shrink-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">회차 변경</button>
                            </div>
                            <div class="flex flex-wrap gap-3 text-[11px] font-bold text-slate-600">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"><i class="fas fa-user-tie text-slate-400"></i><span id="packInstructor">—</span></span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"><i class="fas fa-map-marker-alt text-slate-400"></i><span id="packLocation">—</span></span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700"><i class="fas fa-users"></i> 배정 <span id="packTraineeCount">0</span>명</span>
                            </div>
                        </div>
                        <div class="lg:col-span-4 bg-slate-900 text-white rounded-[2.5rem] shadow-sm p-5 sm:p-6 flex flex-col justify-between">
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">출력 가능 서류</p>
                                <p class="text-4xl font-black tracking-tight"><span id="packReadyCount">0</span><span class="text-lg text-slate-500 font-bold"> / <span id="packTotalCount">0</span></span></p>
                            </div>
                            <p class="text-xs text-slate-400 font-medium mt-4">구현 완료·기존 연결 서류 수입니다. 나머지는 순차 구현합니다.</p>
                        </div>
                    </div>

                    <div id="docsGrid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"></div>
                </div>
            </main>
        </div>
    </div>
    <script>
        (function() {
            var fixedSessionId = ${sessionId ? JSON.stringify(String(sessionId)) : 'null'};
            var token = localStorage.getItem('token') || '';

            function authHeaders() {
                return { 'Authorization': 'Bearer ' + token };
            }

            function esc(s) {
                return String(s == null ? '' : s)
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            }

            function statusBadge(status) {
                if (status === 'ready') return '<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black">출력 가능</span>';
                if (status === 'link') return '<span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-black">기존 연결</span>';
                return '<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black">준비 중</span>';
            }

            function actionLabel(doc) {
                if (doc.status === 'ready') return '미리보기·인쇄';
                if (doc.status === 'link') return '연결 화면 열기';
                return '추후 구현';
            }

            async function loadSessionOptions() {
                var sel = document.getElementById('sessionSelect');
                if (!sel) return;
                try {
                    var res = await fetch('/api/course-sessions?limit=100&page=1', { headers: authHeaders() });
                    var json = await res.json();
                    if (!json.success) throw new Error(json.error || '회차 목록 실패');
                    var rows = json.data || [];
                    sel.innerHTML = '<option value="">회차를 선택하세요</option>' + rows.map(function(s) {
                        var label = (s.course_name || '과정') + ' ' + (s.session_number != null ? s.session_number + '차' : '') +
                            (s.session_name ? ' ' + s.session_name : '') +
                            (s.training_start_date ? ' (' + String(s.training_start_date).slice(0, 10) + ')' : '');
                        return '<option value="' + s.id + '">' + esc(label) + '</option>';
                    }).join('');
                    if (fixedSessionId) sel.value = String(fixedSessionId);
                } catch (e) {
                    console.error(e);
                    sel.innerHTML = '<option value="">회차 목록을 불러오지 못했습니다</option>';
                }
            }

            async function loadPack(sessionId) {
                var packPanel = document.getElementById('packPanel');
                var picker = document.getElementById('sessionPickerPanel');
                try {
                    var res = await fetch('/api/opening-docs/' + sessionId + '/pack', { headers: authHeaders() });
                    var json = await res.json();
                    if (!json.success) throw new Error(json.error || '팩 조회 실패');
                    var data = json.data;
                    var s = data.session || {};
                    var title = (s.course_name || '') + (s.session_number != null ? ' (' + s.session_number + '회차)' : '') + (s.session_name ? ' - ' + s.session_name : '');
                    document.getElementById('packCourseTitle').textContent = title || '회차';
                    document.getElementById('packMeta').textContent =
                        ((s.training_start_date || '-').toString().slice(0, 10)) + ' ~ ' + ((s.training_end_date || '-').toString().slice(0, 10)) +
                        ' · ' + (s.effective_status || s.status || '');
                    document.getElementById('packInstructor').textContent = s.instructor_name || '강사 미지정';
                    document.getElementById('packLocation').textContent = s.location || '장소 미지정';
                    document.getElementById('packTraineeCount').textContent = String(data.trainee_count || 0);
                    document.getElementById('packReadyCount').textContent = String((data.progress && data.progress.implemented) || 0);
                    document.getElementById('packTotalCount').textContent = String((data.progress && data.progress.total) || 0);

                    var grid = document.getElementById('docsGrid');
                    grid.innerHTML = (data.docs || []).map(function(doc) {
                        var disabled = doc.status === 'planned' || !doc.href;
                        var href = doc.href || '#';
                        var orderLabel = String(doc.order).padStart(2, '0');
                        return '<article class="bento-card bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 transition-all duration-300 ' + (disabled ? 'opacity-70' : '') + '">' +
                            '<div class="flex items-start justify-between gap-2 mb-3">' +
                                '<span class="text-[10px] font-black text-slate-400 tracking-widest">' + orderLabel + ' · ' + esc(doc.code) + '</span>' +
                                statusBadge(doc.status) +
                            '</div>' +
                            '<h3 class="text-sm font-black text-slate-900 leading-snug mb-2">' + esc(doc.title) + '</h3>' +
                            '<p class="text-[11px] text-slate-500 font-medium leading-relaxed mb-4 min-h-[2.5rem]">' + esc(doc.description) + '</p>' +
                            (disabled
                                ? '<button type="button" disabled class="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">' + actionLabel(doc) + '</button>'
                                : '<a href="' + esc(href) + '" target="_blank" rel="noopener" class="w-full min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition">' +
                                    '<i class="fas fa-print text-[10px]"></i> ' + actionLabel(doc) +
                                  '</a>') +
                        '</article>';
                    }).join('');

                    if (picker) picker.classList.add('hidden');
                    if (packPanel) packPanel.classList.remove('hidden');
                    fixedSessionId = String(sessionId);
                    if (history.replaceState) {
                        history.replaceState(null, '', '/admin/courses/sessions/' + sessionId + '/opening-docs');
                    }
                } catch (e) {
                    console.error(e);
                    alert(e.message || '서류 목록을 불러오지 못했습니다.');
                }
            }

            document.getElementById('btnLoadSession').addEventListener('click', function() {
                var v = document.getElementById('sessionSelect').value;
                if (!v) { alert('회차를 선택하세요.'); return; }
                loadPack(v);
            });

            document.getElementById('btnChangeSession').addEventListener('click', function() {
                document.getElementById('packPanel').classList.add('hidden');
                document.getElementById('sessionPickerPanel').classList.remove('hidden');
                if (history.replaceState) history.replaceState(null, '', '/admin/courses/opening-docs');
            });

            loadSessionOptions().then(function() {
                if (fixedSessionId) loadPack(fixedSessionId);
            });
        })();
    </script>
</body>
</html>
`;

/** 개강서류 인쇄 공통 셸 */
function openingDocPrintShell(title: string, bodyScript: string) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            @page { size: A4 portrait; margin: 10mm; }
            @page landscape-sheet { size: A4 landscape; margin: 8mm; }
            .landscape-page { page: landscape-sheet; }
        }
        body { font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; font-size: 12px; color: #111; background: #f1f5f9; margin: 0; }
        .toolbar { max-width: 210mm; margin: 12px auto; display: flex; gap: 8px; }
        .toolbar button { padding: 8px 14px; border: 0; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; }
        .btn-print { background: #2563eb; color: #fff; }
        .btn-close { background: #475569; color: #fff; }
        .sheet { max-width: 210mm; margin: 0 auto 24px; background: #fff; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
        .sheet-wrap { max-width: 210mm; margin: 0 auto 24px; }
        .pledge-page { background: #fff; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); margin-bottom: 16px; page-break-after: always; break-after: page; }
        .pledge-page:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }
        @media print {
            .sheet, .pledge-page { box-shadow: none; margin: 0; }
            body { background: #fff; }
        }
        .doc-brand { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
        .doc-brand img { height: 40px; width: auto; max-width: 180px; object-fit: contain; }
        .doc-brand .brand-name { font-size: 12px; font-weight: 700; color: #334155; text-align: right; line-height: 1.35; }
        .doc-period { margin: 0 0 10px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; font-weight: 700; color: #0f172a; text-align: center; }
        .doc-period .label { color: #64748b; font-weight: 700; margin-right: 8px; }
        .doc-title { text-align: center; font-size: 20px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
        .pledge-id { width: 100%; border-collapse: collapse; margin: 0 0 12px; table-layout: fixed; }
        .pledge-id th, .pledge-id td { border: 1px solid #222; padding: 7px 8px; font-size: 12px; }
        .pledge-id th { width: 88px; background: #f3f4f6; text-align: center; font-weight: 700; }
        .pledge-id td { text-align: left; font-weight: 600; }
        .pledge-body { font-size: 12px; line-height: 1.55; }
        .pledge-body p { margin: 0 0 8px; }
        .pledge-body .lead { font-weight: 700; margin-bottom: 8px; }
        .pledge-body ol { margin: 0 0 10px; padding-left: 18px; }
        .pledge-body ol > li { margin: 0 0 6px; }
        .pledge-body ul { margin: 4px 0 8px; padding-left: 18px; list-style: disc; }
        .pledge-body ul li { margin: 2px 0; }
        .pledge-promise { margin-top: 12px; text-align: justify; word-break: keep-all; }
        .pledge-date { margin-top: 28px; text-align: center; font-size: 13px; font-weight: 600; }
        .pledge-sign { margin-top: 22px; text-align: right; font-size: 13px; padding-right: 24px; }
        .consent-body { font-size: 12.5px; line-height: 1.65; word-break: keep-all; }
        .consent-body .to { font-weight: 700; margin: 8px 0 10px; }
        .consent-body .section-title { font-weight: 800; margin: 12px 0 4px; }
        .consent-body .indent { margin: 0 0 6px 12px; }
        .consent-agree { margin-top: 16px; font-weight: 700; }
        .sd-notes { font-size: 11px; color: #333; margin: 6px 0 10px; line-height: 1.45; }
        .sd-notes p { margin: 2px 0; }
        table.sd-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 10px; }
        table.sd-table th, table.sd-table td { border: 1px solid #222; padding: 2px 2px; text-align: center; vertical-align: middle; }
        table.sd-table th { background: #f3f4f6; font-weight: 700; }
        table.sd-table .name-col { width: 56px; }
        table.sd-table .memo-col { width: 48px; }
        table.sd-table td.name { text-align: left; padding-left: 4px; font-weight: 600; }
        .sd-footer { margin-top: 10px; display: flex; justify-content: flex-end; gap: 28px; font-size: 12px; font-weight: 700; }
        .landscape-page { max-width: 297mm; }
        .doc-sub { text-align: center; font-size: 12px; font-weight: 600; margin: 0 0 14px; color: #222; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-bottom: 12px; font-size: 12px; }
        .meta-grid .label { display: inline-block; width: 72px; color: #555; }
        .info-list { margin: 0 0 14px; padding: 0; list-style: none; font-size: 12.5px; line-height: 1.7; }
        .info-list li { display: flex; gap: 6px; align-items: baseline; }
        .info-list .bullet { font-weight: 800; color: #111; min-width: 88px; }
        .info-list .sep { color: #666; }
        .info-list .val { font-weight: 600; color: #111; }
        .doc-title.spaced { letter-spacing: 0.35em; padding-left: 0.35em; }
        table.doc-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.doc-table th, table.doc-table td { border: 1px solid #222; padding: 5px 6px; text-align: center; vertical-align: middle; word-break: keep-all; }
        table.doc-table th { background: #f3f4f6; font-size: 11px; }
        table.doc-table td.name, table.doc-table td.addr { text-align: left; }
        table.doc-table td.cat { text-align: center; font-size: 11px; line-height: 1.25; white-space: pre-line; }
        table.checklist-table th, table.checklist-table td { height: 28px; }
        .mark-y { color: #111; font-weight: 800; font-size: 14px; }
        .mark-n { color: #94a3b8; }
        .empty { text-align: center; padding: 40px 12px; color: #64748b; }
        .footnote { margin-top: 10px; font-size: 10px; color: #64748b; }
        .sign-row { margin-top: 28px; display: flex; justify-content: flex-end; gap: 40px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="toolbar no-print">
        <button type="button" class="btn-print" onclick="window.print()"><i class="fas fa-print"></i> 인쇄하기</button>
        <button type="button" class="btn-close" onclick="window.close()">닫기</button>
    </div>
    <div class="sheet" id="sheet">
        <div class="empty" id="loading">불러오는 중…</div>
    </div>
    <script>
    ${bodyScript}
    </script>
</body>
</html>`;
}

const sharedPrintHelpers = `
        function qs(name) {
            var p = new URLSearchParams(window.location.search);
            return p.get(name);
        }
        function pathSessionId() {
            var m = location.pathname.match(/\\/sessions\\/(\\d+)\\/opening-docs\\//);
            return m ? m[1] : (qs('sessionId') || '');
        }
        function pathDocCode() {
            var m = location.pathname.match(/\\/opening-docs\\/([A-Za-z0-9]+)\\/print/);
            return m ? m[1].toUpperCase() : '';
        }
        function esc(s) {
            return String(s == null ? '' : s)
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function yn(v) { return v ? '<span class="mark-y">O</span>' : '<span class="mark-n">-</span>'; }
        function genderLabel(g) {
            if (g === 'M' || g === '남' || g === 'male') return '남';
            if (g === 'F' || g === '여' || g === 'female') return '여';
            return g || '';
        }
        function sessionSubtitle(session) {
            var course = session.course_name || '';
            var sess = session.session_number != null ? String(session.session_number) + '차' : '';
            var ban = session.session_name ? String(session.session_name) : '';
            var left = [course, sess].filter(Boolean).join(' + ');
            if (ban) return '( ' + left + ' ,[' + ban + '] )';
            return left ? '( ' + left + ' )' : '';
        }
        function educationPeriodText(session) {
            return formatDotDate(session.training_start_date) + ' ~ ' + formatDotDate(session.training_end_date);
        }
        function educationPeriodLine(session) {
            return '<p class="doc-period"><span class="label">교육기간</span>' + esc(educationPeriodText(session)) + '</p>';
        }
        function brandHtml(session) {
            var logo = session.logo_url || '/static/logo.png';
            var name = session.institution_name || '와우쓰리디홍대센터';
            return '<div class="doc-brand">' +
                '<img src="' + esc(logo) + '" alt="' + esc(name) + '" onerror="this.remove()">' +
                '<div class="brand-name">' + esc(name) + '<br><span style="font-weight:500;color:#64748b;font-size:10px;">교육센터 개강서류</span></div>' +
            '</div>' +
            educationPeriodLine(session);
        }
        function headerHtml(session, docTitle, opts) {
            opts = opts || {};
            if (opts.checklistStyle) {
                return brandHtml(session) +
                    '<h1 class="doc-title">' + esc(docTitle) + '</h1>' +
                    '<p class="doc-sub">' + esc(sessionSubtitle(session)) + '</p>';
            }
            var period = ((session.training_start_date || '-').toString().slice(0, 10)) + ' ~ ' + ((session.training_end_date || '-').toString().slice(0, 10));
            var course = (session.course_name || '') + (session.session_number != null ? ' (' + session.session_number + '회차)' : '');
            return brandHtml(session) +
                '<h1 class="doc-title">' + esc(docTitle) + '</h1>' +
                '<div class="meta-grid">' +
                '<div><span class="label">훈련기관</span> ' + esc(session.institution_name || '') + '</div>' +
                '<div><span class="label">훈련교사</span> ' + esc(session.instructor_name || '') + '</div>' +
                '<div><span class="label">훈련과정</span> ' + esc(course) + '</div>' +
                '<div><span class="label">강의실</span> ' + esc(session.location || '') + '</div>' +
                '<div><span class="label">훈련기간</span> ' + esc(period) + '</div>' +
                '<div><span class="label">배정인원</span> <span id="metaCount"></span>명</div>' +
                '</div>';
        }
        function markO(v) { return v ? '<span class="mark-y">○</span>' : ''; }
        function nl2br(s) { return esc(s).replace(/\\n/g, '<br>'); }
        function formatDotDate(d) {
            if (!d) return '-';
            var s = String(d).slice(0, 10).replace(/-/g, '.');
            if (/^\\d{4}\\.\\d{2}\\.\\d{2}$/.test(s)) return s + '.';
            return s;
        }
        function formatTimeRange(start, end) {
            var a = (start || '').toString().slice(0, 5);
            var b = (end || '').toString().slice(0, 5);
            if (a && b) return a + ' ~ ' + b;
            return a || b || '-';
        }
        function formatDaysOfWeek(raw) {
            if (raw == null || raw === '') return '-';
            var s = String(raw).trim();
            try {
                if (s.charAt(0) === '[') {
                    var arr = JSON.parse(s);
                    if (Array.isArray(arr)) s = arr.join(',');
                }
            } catch (e) {}
            var map = { '0': '일', '1': '월', '2': '화', '3': '수', '4': '목', '5': '금', '6': '토',
                sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토',
                sunday: '일', monday: '월', tuesday: '화', wednesday: '수', thursday: '목', friday: '금', saturday: '토' };
            return s.split(/[,|\\/\\s]+/).filter(Boolean).map(function(p) {
                var k = String(p).trim().toLowerCase();
                return map[k] || p.trim();
            }).join(',');
        }
        /** HWP 예시: 87년 01월 08일 */
        function formatBirthKr(birth) {
            if (!birth) return '';
            var s = String(birth).trim();
            var m = s.match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
            if (m) {
                var yy = String(parseInt(m[1], 10) % 100).padStart(2, '0');
                return yy + '년 ' + m[2] + '월 ' + m[3] + '일';
            }
            m = s.match(/^(\\d{2,4})[.\\/년\\s]+(\\d{1,2})[.\\/월\\s]+(\\d{1,2})/);
            if (m) {
                var y = parseInt(m[1], 10);
                if (y < 100) y = y;
                else y = y % 100;
                return String(y).padStart(2, '0') + '년 ' + String(m[2]).padStart(2, '0') + '월 ' + String(m[3]).padStart(2, '0') + '일';
            }
            return s;
        }
        function courseNameWithSession(session) {
            var course = session.course_name || '';
            var sess = session.session_number != null ? String(session.session_number) + '차' : '';
            return [course, sess].filter(Boolean).join(' + ');
        }
        function rosterInfoHtml(session) {
            var period = formatDotDate(session.training_start_date) + ' ~' + formatDotDate(session.training_end_date);
            return '<ul class="info-list">' +
                '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                '<li><span class="bullet">￭ 훈련 기간</span><span class="sep">:</span><span class="val">' + esc(period) + '</span></li>' +
                '<li><span class="bullet">￭ 훈련 시간</span><span class="sep">:</span><span class="val">' + esc(formatTimeRange(session.training_time_start, session.training_time_end)) + '</span></li>' +
                '<li><span class="bullet">￭ 훈련 요일</span><span class="sep">:</span><span class="val">' + esc(formatDaysOfWeek(session.days_of_week)) + '</span></li>' +
            '</ul>';
        }
        /** HWP 서명일: 2026 년  8 월 11 일 */
        function formatPledgeDate(d) {
            if (!d) return '____ 년  __ 월 __ 일';
            var m = String(d).slice(0, 10).match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
            if (!m) return String(d);
            return m[1] + ' 년  ' + String(parseInt(m[2], 10)) + ' 월 ' + String(parseInt(m[3], 10)) + ' 일';
        }
        function formatPledgePeriod(start, end) {
            function one(v) {
                var m = String(v || '').slice(0, 10).match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
                if (!m) return String(v || '');
                return m[1] + '. ' + m[2] + '. ' + m[3] + '.';
            }
            return one(start) + ' ~ ' + one(end);
        }
        function courseLabelForPledge(session) {
            var name = session.course_name || '';
            var n = session.session_number != null ? String(session.session_number) + '회차' : '';
            return n ? (name + ' ' + n + ' 과정') : (name + ' 과정');
        }
        function isJobseekerTrainee(t) {
            var st = String(t.student_type || '').toLowerCase();
            var pt = String(t.package_type || '').toLowerCase();
            return st === 'jobseeker' || pt === 'unemployed' || pt === 'package1' || pt === 'package2';
        }
        /** HWP「2-2_내일배움_훈련생서약서」수강생 1장 */
        function pledgePageHtml(session, t) {
            var inst = session.institution_name || '와우쓰리디홍대센터';
            var period = formatPledgePeriod(session.training_start_date, session.training_end_date);
            var course = courseLabelForPledge(session);
            var jobLine = isJobseekerTrainee(t)
                ? '<li>본인은 훈련 중 훈련과정 수료 후 적극적인 구직활동을 하겠습니다. (구직자)</li>'
                : '<li>본인은 훈련 중 훈련과정 수료 후 적극적인 구직활동을 하겠습니다. (해당자)</li>';
            return '<section class="pledge-page">' +
                brandHtml(session) +
                '<h1 class="doc-title">[ 국민내일배움 훈련과정] 훈련생 서약서</h1>' +
                '<table class="pledge-id"><tbody>' +
                '<tr><th>성    명</th><td>' + esc(t.name || '') + '</td><th>생년월일</th><td>' + esc(formatBirthKr(t.birthdate)) + '</td></tr>' +
                '<tr><th>전화번호</th><td colspan="3">' + esc(t.phone || '') + '</td></tr>' +
                '</tbody></table>' +
                '<div class="pledge-body">' +
                '<p class="lead">본인은 아래 각 사항에 대하여 충분히 인지하고 있음을 확인합니다.</p>' +
                '<ol>' +
                '<li>본인이 [근로자직업능력개발법령] 제6조제1항 및 법 시행규칙 제 3조에 따른 훈련대상의 요건을 갖추었는지 여부</li>' +
                '<li>실업자 등 직업능력개발훈련 실시규정 중 훈련생의 의무와 권리에 관한 사항</li>' +
                '<li>해당 훈련과정 수료 후 취업 등 진로에 관한 사항</li>' +
                '</ol>' +
                '<p>본인은 정부로부터 훈련기간 동안 훈련비 및 소정의 훈련수당을 지급받을 수 있으며, 해당훈련에 기인하여 상해를 입은 경우 상해치료비등을 지급받을 수 있음을 인지하고 있습니다.</p>' +
                '<p>본인은 최선을 다하여 훈련에 참여하며, 관련 법령 및 규정과 훈련기관이 정한 규정을 성실히 준수하겠습니다.</p>' +
                '<ol start="4">' + jobLine + '</ol>' +
                '<p>본인은 아래와 같은 부정행위를 하지 않겠습니다.</p>' +
                '<ul>' +
                '<li>구직자인 경우 취업상태임을 알리지 않고 훈련에 참여하는 등 부정한 방법으로 훈련에 참여한 경우</li>' +
                '<li>출석부 조작, 대리출석체크 등 거짓이나 그 밖의 부정한 방법으로 출석을 조작하거나 조작하는데 조력한 경우</li>' +
                '<li>훈련장려금의 부당청구 등 위법·부당한 행위를 한 경우</li>' +
                '</ul>' +
                '<p>아울러 아래와 같은 부정행위를 한 경우에는 훈련장려금의 반환, 훈련수강 배제 등 관련 법령 및 규정에 따른 불이익을 감수하겠습니다.</p>' +
                '<p>HRD-Net 행정지원시스템을 통해 훈련종료일 다음날부터 30일 이내에 수강평을 입력하여야 하며, 입력하지 않을 경우 훈련장려금(해당자) 등을 지급받지 못하는 불이익을 받을 수 있습니다.</p>' +
                '<p class="pledge-promise">본인은 ' + esc(period) + ' 훈련기관 (' + esc(inst) + ')에서 ' + esc(course) +
                ' 훈련을 수강함에 있어 상기내용을 충분히 숙지하여 성실하게 훈련을 받을 것임을 약속합니다.</p>' +
                '</div>' +
                '<div class="pledge-date">' + esc(formatPledgeDate(session.training_start_date)) + '</div>' +
                '<div class="pledge-sign">서약자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명 또는 인)</div>' +
            '</section>';
        }
        async function fetchDoc(sessionId, docCode) {
            var res = await fetch('/api/opening-docs/' + sessionId + '/docs/' + docCode, {
                headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
            });
            var json = await res.json();
            if (!json.success) throw new Error(json.error || '조회 실패');
            return json.data;
        }
`;

export const adminOpeningDocPrintHtml = (sessionId: string, docCode: string) => {
  const code = String(docCode || '').toUpperCase();
  const titleMap: Record<string, string> = {
    D00: '훈련생 등록현황 체크리스트',
    D01: '훈 련 생 명 단',
    D22: '[ 국민내일배움 훈련과정] 훈련생 서약서',
    D23: '개인정보 수집·이용 / 제공 동의서',
    D33: '오리엔테이션 참여자 명단',
    D70: '교재지급확인서 관리대장',
    D80: 'SD카드 지급 / 반납 확인서 관리대장',
  };
  const title = titleMap[code] || '개강서류';

  const script = `
        ${sharedPrintHelpers}
        (async function() {
            var sessionId = pathSessionId() || ${JSON.stringify(String(sessionId))};
            var docCode = pathDocCode() || ${JSON.stringify(code)};
            var sheet = document.getElementById('sheet');
            try {
                var data = await fetchDoc(sessionId, docCode);
                if (data.redirect) { location.href = data.redirect; return; }
                var session = data.session || {};
                var trainees = data.trainees || [];
                var trainingDays = data.training_days || [];
                var docTitle = (data.doc && data.doc.title) || ${JSON.stringify(title)};

                function chunkArray(arr, size) {
                    var out = [];
                    for (var i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
                    return out.length ? out : [[]];
                }
                function formatSdDateHeader(day) {
                    // 08월 11일(화)
                    var m = String(day.date || '').match(/^\\d{4}-(\\d{2})-(\\d{2})$/);
                    if (!m) return day.dateShort || '';
                    return m[1] + '월 ' + m[2] + '일(' + (day.dayOfWeek || '') + ')';
                }
                function padRows(list, minCount) {
                    var n = Math.max(list.length, minCount);
                    var rows = [];
                    for (var i = 0; i < n; i++) rows.push(list[i] || null);
                    return rows;
                }

                if (docCode === 'D22') {
                    if (!trainees.length) {
                        sheet.className = 'sheet';
                        sheet.innerHTML = brandHtml(session) +
                            '<h1 class="doc-title">[ 국민내일배움 훈련과정] 훈련생 서약서</h1>' +
                            '<div class="empty">배정된 훈련생이 없습니다. 수강생 등록 후 다시 출력하세요.</div>';
                        return;
                    }
                    sheet.className = 'sheet-wrap';
                    sheet.innerHTML = trainees.map(function(t) { return pledgePageHtml(session, t); }).join('');
                    return;
                }

                var html = docCode === 'D01'
                    ? (brandHtml(session) + '<h1 class="doc-title spaced">' + esc(docTitle) + '</h1>' + rosterInfoHtml(session))
                    : headerHtml(session, docTitle, { checklistStyle: docCode === 'D00' });

                if (docCode === 'D00') {
                    /* HWP「0_훈련생 등록현황 체크리스트」컬럼: NO·구분·성명·연락처·OT참석·교육신청서·자부담 결제·비고 */
                    html += '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:36px">NO</th>' +
                        '<th style="width:78px">구분</th>' +
                        '<th style="width:72px">성명</th>' +
                        '<th style="width:110px">연락처</th>' +
                        '<th style="width:56px">OT참석</th>' +
                        '<th style="width:72px">교육신청서</th>' +
                        '<th style="width:72px">자부담 결제</th>' +
                        '<th>비고</th>' +
                        '</tr></thead><tbody>';
                    var rowCount = Math.max(trainees.length, 15);
                    for (var i = 0; i < rowCount; i++) {
                        var t = trainees[i];
                        if (t) {
                            html += '<tr>' +
                                '<td>' + t.no + '</td>' +
                                '<td class="cat">' + nl2br(t.category_label || '') + '</td>' +
                                '<td class="name">' + esc(t.name) + '</td>' +
                                '<td>' + esc(t.phone) + '</td>' +
                                '<td>' + (t.ot_attended === true ? markO(true) : '') + '</td>' +
                                '<td>' + markO(t.has_application) + '</td>' +
                                '<td>' + markO(t.has_self_pay) + '</td>' +
                                '<td class="addr">' + esc(t.status_memo || '') + '</td>' +
                            '</tr>';
                        } else {
                            html += '<tr>' +
                                '<td>' + (i + 1) + '</td>' +
                                '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                            '</tr>';
                        }
                    }
                    html += '</tbody></table>' +
                        '<p class="footnote">※ OT참석은 수기 체크 · 교육신청서/자부담 결제는 수강생관리 등록 정보를 ○로 표시합니다. (원본: 0_훈련생 등록현황 체크리스트.hwp)</p>';
                } else if (docCode === 'D01') {
                    /* HWP「1_훈련생명단-훈련교사관리」: NO·성명·전화번호·생년월일·비고 */
                    html += '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th>' +
                        '<th style="width:90px">성명</th>' +
                        '<th style="width:120px">전화번호</th>' +
                        '<th style="width:130px">생년월일</th>' +
                        '<th>비고</th>' +
                        '</tr></thead><tbody>';
                    var rosterRows = Math.max(trainees.length, 12);
                    for (var r = 0; r < rosterRows; r++) {
                        var row = trainees[r];
                        if (row) {
                            html += '<tr>' +
                                '<td>' + row.no + '</td>' +
                                '<td class="name">' + esc(row.name) + '</td>' +
                                '<td>' + esc(row.phone) + '</td>' +
                                '<td>' + esc(formatBirthKr(row.birthdate)) + '</td>' +
                                '<td class="addr">' + esc(row.status_memo || '') + '</td>' +
                            '</tr>';
                        } else {
                            html += '<tr>' +
                                '<td>' + (r + 1) + '</td>' +
                                '<td></td><td></td><td></td><td></td>' +
                            '</tr>';
                        }
                    }
                    html += '</tbody></table>' +
                        '<p class="footnote">※ 생년월일은 수강생 등록 정보를 「YY년 MM월 DD일」 형식으로 표시합니다. (원본: 1_훈련생명단-훈련교사관리.hwp)</p>';
                } else if (docCode === 'D23') {
                    /* HWP「2-3_개인정보활용동의서_일반」 */
                    var inst = session.institution_name || '와우쓰리디홍대센터';
                    html = brandHtml(session) +
                        '<h1 class="doc-title">개인정보 수집·이용 / 제공 동의서</h1>' +
                        '<div class="consent-body">' +
                        '<p class="to">3D쿠키 홍대센터( ' + esc(inst) + ' )귀하</p>' +
                        '<p>본인과 관련하여 귀사가 본인의 개인정보를 수집·이용·제공하고자 하는 경우에는「개인정보 보호법」제15조 제1항 제1호, 제17조 제1항 제1호, 제24조 제1항 제1호에 따라 본인의 동의를 얻어야 합니다. 이에 본인은 아래의 내용과 같이 본인의 개인정보를 수집·이용·제공하는 것에 동의합니다.</p>' +
                        '<p class="section-title">￭ 수집·이용 목적</p>' +
                        '<p class="indent">‐ 귀하의 개인정보는 3D쿠키 홍대센터 교육지원사업의 효율적 수행을 위한 활용에 귀하의 개인정보를 제공하기 위한 목적으로 수집·이용됩니다.</p>' +
                        '<p class="section-title">￭ 개인정보의 수집항목</p>' +
                        '<p class="indent">‐ 수강생 개인식별 정보(성명, 생년월일, 전화번호 등)</p>' +
                        '<p class="section-title">￭ 보유 및 이용 기간</p>' +
                        '<p class="indent">‐ 귀하의 개인정보는 수집·이용에 관한 동의일로부터 3년까지 보유·이용됩니다.</p>' +
                        '<p class="consent-agree">본인은 귀사에 위의 목적으로 본인의 개인정보를 수집·이용 및 제공하는 것에 동의합니다.</p>' +
                        '<div class="pledge-date">' + esc(formatPledgeDate(session.training_start_date)) + '</div>' +
                        '</div>' +
                        '<table class="doc-table checklist-table" style="margin-top:14px">' +
                        '<thead><tr><th style="width:40px">No.</th><th style="width:100px">신 청 인</th><th style="width:120px">연 락 처</th><th>서    명</th></tr></thead><tbody>';
                    var consentRows = padRows(trainees, Math.max(trainees.length, 6));
                    consentRows.forEach(function(t, idx) {
                        if (t) {
                            html += '<tr><td>' + (idx + 1) + '</td><td class="name">' + esc(t.name) + '</td><td>' + esc(t.phone) + '</td><td></td></tr>';
                        } else {
                            html += '<tr><td>' + (idx + 1) + '</td><td></td><td></td><td></td></tr>';
                        }
                    });
                    html += '</tbody></table>' +
                        '<p class="footnote">※ 원본: 2-3_개인정보활용동의서_일반.hwp</p>';
                } else if (docCode === 'D33') {
                    /* HWP「3-3_오리엔테이션참여자명단」 */
                    html = brandHtml(session) +
                        '<h1 class="doc-title">오리엔테이션 참여자 명단</h1>' +
                        '<ul class="info-list">' +
                        '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                        '<li><span class="bullet">￭ 훈련 기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + ' ~' + formatDotDate(session.training_end_date)) + '</span></li>' +
                        '<li><span class="bullet">￭ 담 당 자</span><span class="sep">:</span><span class="val">' + esc(session.instructor_name || '') + '</span></li>' +
                        '<li><span class="bullet">￭ 진행회차</span><span class="sep">:</span><span class="val">' + esc(session.session_number != null ? String(session.session_number) + '차' : '') + '</span></li>' +
                        '</ul>' +
                        '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th><th style="width:90px">성명</th><th style="width:120px">전화번호</th>' +
                        '<th style="width:130px">생년월일</th><th>참여자서명</th>' +
                        '</tr></thead><tbody>';
                    padRows(trainees, 15).forEach(function(t, idx) {
                        if (t) {
                            html += '<tr><td>' + t.no + '</td><td class="name">' + esc(t.name) + '</td><td>' + esc(t.phone) + '</td><td>' + esc(formatBirthKr(t.birthdate)) + '</td><td></td></tr>';
                        } else {
                            html += '<tr><td>' + (idx + 1) + '</td><td></td><td></td><td></td><td></td></tr>';
                        }
                    });
                    html += '</tbody></table>' +
                        '<p class="footnote">※ 참여자서명은 수기 기재합니다. (원본: 3-3_오리엔테이션참여자명단.hwp)</p>';
                } else if (docCode === 'D70') {
                    /* HWP「7_.교재지급대장」 */
                    var textbookLabel = session.textbook_label || (session.textbook_names && session.textbook_names.length ? session.textbook_names.join(' / ') : '') || '';
                    var deployDate = (function() {
                        var m = String(session.training_start_date || '').slice(0, 10).match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
                        return m ? (m[1] + '. ' + m[2] + '. ' + m[3]) : formatDotDate(session.training_start_date);
                    })();
                    html = brandHtml(session) +
                        '<h1 class="doc-title">교재지급확인서 관리대장</h1>' +
                        '<ul class="info-list">' +
                        '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                        '<li><span class="bullet">￭ 훈련 기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + '~' + formatDotDate(session.training_end_date)) + '</span></li>' +
                        '<li><span class="bullet">￭ 교 재 명</span><span class="sep">:</span><span class="val">' + esc(textbookLabel || '(승인과정 교재 미등록)') + '</span></li>' +
                        '<li><span class="bullet">￭ 교재배포일</span><span class="sep">:</span><span class="val">' + esc(deployDate) + '</span></li>' +
                        '</ul>' +
                        '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th><th style="width:90px">성명</th><th style="width:120px">전화번호</th>' +
                        '<th style="width:120px">확인(정자체)</th><th>비고</th>' +
                        '</tr></thead><tbody>';
                    padRows(trainees, 15).forEach(function(t, idx) {
                        if (t) {
                            html += '<tr><td>' + t.no + '</td><td class="name">' + esc(t.name) + '</td><td>' + esc(t.phone) + '</td><td></td><td class="addr">' + esc(t.status_memo || '') + '</td></tr>';
                        } else {
                            html += '<tr><td>' + (idx + 1) + '</td><td></td><td></td><td></td><td></td></tr>';
                        }
                    });
                    html += '</tbody></table>' +
                        '<p class="footnote">※ 확인(정자체)는 수기 기재합니다. 교재명은 승인과정 등록 교재를 반영합니다. (원본: 7_.교재지급대장.hwp)</p>';
                } else if (docCode === 'D80') {
                    /* HWP「SD카드 지급반납 확인서 관리대장」 — 훈련일 6일 단위 가로 분할 */
                    var dayChunks = chunkArray(trainingDays, 6);
                    var sdRows = padRows(trainees, 10);
                    var material = session.sd_material_label || '3D프린터운용기능사 출력 연습용 SD카드 (마이크로 sd포함)';
                    sheet.className = 'sheet-wrap';
                    html = dayChunks.map(function(days) {
                        var head1 = '<tr><th class="name-col" rowspan="2">훈련생</th>';
                        var head2 = '<tr>';
                        days.forEach(function(d) {
                            head1 += '<th colspan="3">' + esc(formatSdDateHeader(d)) + '</th>';
                            head2 += '<th>지급</th><th>반납</th><th>출력중</th>';
                        });
                        head1 += '<th class="memo-col" rowspan="2">비고</th></tr>';
                        head2 += '</tr>';
                        var body = '';
                        sdRows.forEach(function(t, idx) {
                            body += '<tr><td class="name">' + (t ? esc(t.name) : '') + '</td>';
                            days.forEach(function() { body += '<td></td><td></td><td></td>'; });
                            body += '<td></td></tr>';
                        });
                        return '<section class="pledge-page landscape-page">' +
                            brandHtml(session) +
                            '<h1 class="doc-title">SD카드 지급 / 반납 확인서 관리대장</h1>' +
                            '<ul class="info-list">' +
                            '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                            '<li><span class="bullet">￭ 훈련기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + ' ~ ' + formatDotDate(session.training_end_date)) + '</span></li>' +
                            '<li><span class="bullet">￭ 교 보 재</span><span class="sep">:</span><span class="val">' + esc(material) + '</span></li>' +
                            '</ul>' +
                            '<div class="sd-notes">' +
                            '<p>* 반납시에는 체크( ✓ ) 표시 해주세요~</p>' +
                            '<p>* 출력 중일 때는 사용 중인 장비명 기입 (200/신도/큐비콘/메이커봇/뱀부 등)</p>' +
                            '<p>* SD카드 분실 시 재지급하지 않습니다. 관리 잘해주세요^^~</p>' +
                            '</div>' +
                            '<table class="sd-table"><thead>' + head1 + head2 + '</thead><tbody>' + body + '</tbody></table>' +
                            '<div class="sd-footer"><span>훈련교사</span><span>확인 ____________</span></div>' +
                        '</section>';
                    }).join('');
                    sheet.innerHTML = html;
                    return;
                } else {
                    html += '<div class="empty">이 서류 인쇄 템플릿은 아직 준비되지 않았습니다.</div>';
                }

                sheet.innerHTML = html;
                var cnt = document.getElementById('metaCount');
                if (cnt) cnt.textContent = String(trainees.length);
            } catch (e) {
                sheet.innerHTML = '<div class="empty">' + esc(e.message || '오류') + '</div>';
            }
        })();
  `;

  return openingDocPrintShell(title, script);
};
