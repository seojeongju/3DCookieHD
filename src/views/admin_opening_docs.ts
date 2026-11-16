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
            @page { size: A4 portrait; margin: 12mm; }
        }
        body { font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; font-size: 12px; color: #111; background: #f1f5f9; margin: 0; }
        .toolbar { max-width: 210mm; margin: 12px auto; display: flex; gap: 8px; }
        .toolbar button { padding: 8px 14px; border: 0; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; }
        .btn-print { background: #2563eb; color: #fff; }
        .btn-close { background: #475569; color: #fff; }
        .sheet { max-width: 210mm; margin: 0 auto 24px; background: #fff; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
        .doc-title { text-align: center; font-size: 20px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
        .doc-sub { text-align: center; font-size: 12px; font-weight: 600; margin: 0 0 14px; color: #222; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-bottom: 12px; font-size: 12px; }
        .meta-grid .label { display: inline-block; width: 72px; color: #555; }
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
        function headerHtml(session, docTitle, opts) {
            opts = opts || {};
            if (opts.checklistStyle) {
                return '<h1 class="doc-title">' + esc(docTitle) + '</h1>' +
                    '<p class="doc-sub">' + esc(sessionSubtitle(session)) + '</p>';
            }
            var period = ((session.training_start_date || '-').toString().slice(0, 10)) + ' ~ ' + ((session.training_end_date || '-').toString().slice(0, 10));
            var course = (session.course_name || '') + (session.session_number != null ? ' (' + session.session_number + '회차)' : '');
            return '<h1 class="doc-title">' + esc(docTitle) + '</h1>' +
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
    D01: '훈련생명단-훈련교사관리',
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
                var docTitle = (data.doc && data.doc.title) || ${JSON.stringify(title)};
                var html = headerHtml(session, docTitle, { checklistStyle: docCode === 'D00' });

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
                    html += '<table class="doc-table">' +
                        '<thead><tr>' +
                        '<th style="width:36px">No</th><th style="width:72px">성명</th><th style="width:40px">성별</th>' +
                        '<th style="width:90px">생년월일</th><th style="width:100px">연락처</th>' +
                        '<th>주소</th><th style="width:72px">유형</th><th style="width:72px">패키지</th>' +
                        '</tr></thead><tbody>';
                    if (!trainees.length) {
                        html += '<tr><td colspan="8" class="empty">배정된 훈련생이 없습니다.</td></tr>';
                    } else {
                        trainees.forEach(function(t) {
                            html += '<tr>' +
                                '<td>' + t.no + '</td>' +
                                '<td class="name">' + esc(t.name) + '</td>' +
                                '<td>' + esc(genderLabel(t.gender)) + '</td>' +
                                '<td>' + esc((t.birthdate || '').toString().slice(0, 10)) + '</td>' +
                                '<td>' + esc(t.phone) + '</td>' +
                                '<td class="addr">' + esc(t.address) + '</td>' +
                                '<td>' + esc(t.student_type) + '</td>' +
                                '<td>' + esc(t.package_type) + '</td>' +
                            '</tr>';
                        });
                    }
                    html += '</tbody></table>' +
                        '<div class="sign-row"><span>훈련교사: ____________ (인)</span><span>확인일: ____ 년 __ 월 __ 일</span></div>' +
                        '<p class="footnote">※ 주민등록번호 등 미보유 항목은 공란으로 두었습니다. 필요 시 수기 기재하세요.</p>';
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
