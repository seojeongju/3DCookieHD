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
                            <div class="flex flex-wrap gap-3 text-[11px] font-bold text-slate-600 mb-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"><i class="fas fa-user-tie text-slate-400"></i><span id="packInstructor">—</span></span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"><i class="fas fa-map-marker-alt text-slate-400"></i><span id="packLocation">—</span></span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700"><i class="fas fa-users"></i> 배정 <span id="packTraineeCount">0</span>명</span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">국비 <span id="packGovCount">0</span></span>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">일반 <span id="packGeneralCount">0</span></span>
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">대상 구분 필터</p>
                                <div id="fundingFilterGroup" class="inline-flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
                                    <button type="button" data-funding="all" class="funding-filter-btn px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white shadow-sm">전체</button>
                                    <button type="button" data-funding="gov" class="funding-filter-btn px-3.5 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-white/80">국비지원대상</button>
                                    <button type="button" data-funding="general" class="funding-filter-btn px-3.5 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-white/80">일반</button>
                                </div>
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
            var fundingFilter = 'all';
            var lastPackData = null;

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

            async function downloadByUrl(url, openGsheet) {
                var res = await fetch(url, { headers: authHeaders() });
                if (!res.ok) {
                    var errJson = null;
                    try { errJson = await res.json(); } catch (e) {}
                    throw new Error((errJson && errJson.error) || ('다운로드 실패 (' + res.status + ')'));
                }
                var blob = await res.blob();
                var dispo = res.headers.get('Content-Disposition') || '';
                var filename = 'download';
                var m = dispo.match(/filename\*=UTF-8''([^;]+)/i) || dispo.match(/filename=\"?([^\";]+)\"?/i);
                if (m && m[1]) {
                    try { filename = decodeURIComponent(m[1]); } catch (e) { filename = m[1]; }
                }
                var obj = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = obj;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(obj);
                if (openGsheet) {
                    setTimeout(function() {
                        window.open('https://docs.google.com/spreadsheets/u/0/', '_blank', 'noopener');
                        alert('CSV가 다운로드되었습니다.\\n구글 시트에서 [파일 → 가져오기 → 업로드]로 불러오세요.');
                    }, 400);
                }
            }

            function printHrefWithQuery(doc, extraQuery) {
                var printHref = doc.href || doc.href_all || '';
                if (!printHref) return '';
                var sep = printHref.indexOf('?') >= 0 ? '&' : '?';
                return printHref + sep + extraQuery;
            }

            function downloadActionsHtml(doc) {
                var d = doc.downloads || null;
                if (!d && doc.status !== 'ready') return '';
                if (doc.status !== 'ready') return '';
                var pdfHref = printHrefWithQuery(doc, 'autopdf=1');
                if (!pdfHref) return '';
                if ((doc.code === 'D02' || doc.code === 'D03') && d && d.xlsx) {
                    return '<div class="grid grid-cols-2 gap-1.5 mt-1.5">' +
                        '<a href="' + esc(pdfHref) + '" target="_blank" rel="noopener" class="min-h-[36px] inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-rose-600 text-white text-[10px] font-black hover:bg-rose-700 transition"><i class="fas fa-file-pdf"></i> PDF</a>' +
                        '<button type="button" data-dl="' + esc(d.xlsx) + '" class="js-dl min-h-[36px] px-2 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700 transition"><i class="fas fa-file-excel mr-1"></i>Excel</button>' +
                        '<button type="button" data-dl="' + esc(d.gsheet) + '" data-gsheet="1" class="js-dl min-h-[36px] px-2 py-2 rounded-xl bg-green-600 text-white text-[10px] font-black hover:bg-green-700 transition"><i class="fas fa-table mr-1"></i>구글시트</button>' +
                        '<a href="' + esc(printHrefWithQuery(doc, 'autodownload=1')) + '" target="_blank" rel="noopener" class="min-h-[36px] inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-slate-800 text-white text-[10px] font-black hover:bg-slate-900 transition"><i class="fas fa-download"></i> HTML</a>' +
                    '</div>';
                }
                return '<div class="grid grid-cols-2 gap-1.5 mt-1.5">' +
                    '<a href="' + esc(pdfHref) + '" target="_blank" rel="noopener" class="min-h-[36px] inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-rose-600 text-white text-[10px] font-black hover:bg-rose-700 transition"><i class="fas fa-file-pdf"></i> PDF 다운로드</a>' +
                    '<a href="' + esc(printHrefWithQuery(doc, 'autodownload=1')) + '" target="_blank" rel="noopener" class="min-h-[36px] inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl border border-slate-200 text-slate-700 text-[10px] font-black hover:bg-slate-50 transition"><i class="fas fa-download"></i> HTML</a>' +
                '</div>';
            }

            function syncFundingFilterButtons() {
                document.querySelectorAll('.funding-filter-btn').forEach(function(btn) {
                    var on = btn.getAttribute('data-funding') === fundingFilter;
                    btn.className = 'funding-filter-btn px-3.5 py-2 rounded-xl text-xs font-black ' +
                        (on ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white/80');
                });
            }

            function audienceBadge(audience) {
                if (audience === 'gov') return '<span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black">국비지원</span>';
                if (audience === 'general') return '<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black">일반</span>';
                if (audience === 'none') return '<span class="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black">대상없음</span>';
                return '<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black">전체</span>';
            }

            function renderDocsGrid(data) {
                var grid = document.getElementById('docsGrid');
                if (!grid) return;
                grid.innerHTML = (data.docs || []).map(function(doc) {
                    var aud = doc.audience || 'all';
                    var effective = doc.effective_audience || aud;
                    var incompatible = effective === 'none';
                    var disabled = doc.status === 'planned' || (!doc.href && doc.status !== 'ready') || incompatible;
                    var orderLabel = String(doc.order).padStart(2, '0');
                    var cnt = (doc.trainee_count != null) ? doc.trainee_count : 0;
                    var cntGov = doc.trainee_count_gov != null ? doc.trainee_count_gov : 0;
                    var cntGen = doc.trainee_count_general != null ? doc.trainee_count_general : 0;
                    var actions = '';
                    if (doc.status === 'planned') {
                        actions = '<button type="button" disabled class="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">' + actionLabel(doc) + '</button>';
                    } else if (doc.status === 'link' && doc.href) {
                        actions = '<a href="' + esc(doc.href) + '" target="_blank" rel="noopener" class="w-full min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition">' +
                            '<i class="fas fa-external-link-alt text-[10px]"></i> ' + actionLabel(doc) + '</a>';
                    } else if (doc.status === 'ready' && incompatible) {
                        actions = '<button type="button" disabled class="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">현재 필터와 대상이 다름</button>';
                    } else if (doc.status === 'ready') {
                        if (fundingFilter === 'all' && aud === 'all') {
                            actions = '<div class="grid grid-cols-3 gap-1.5">' +
                                '<a href="' + esc(doc.href_all || doc.href || '#') + '" target="_blank" rel="noopener" class="min-h-[40px] inline-flex items-center justify-center px-2 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black hover:bg-blue-600 transition">전체 ' + cnt + '</a>' +
                                '<a href="' + esc(doc.href_gov || '#') + '" target="_blank" rel="noopener" class="min-h-[40px] inline-flex items-center justify-center px-2 py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black hover:bg-amber-600 transition">국비 ' + cntGov + '</a>' +
                                '<a href="' + esc(doc.href_general || '#') + '" target="_blank" rel="noopener" class="min-h-[40px] inline-flex items-center justify-center px-2 py-2 rounded-xl bg-slate-500 text-white text-[10px] font-black hover:bg-slate-600 transition">일반 ' + cntGen + '</a>' +
                            '</div>';
                        } else if (fundingFilter === 'all' && aud === 'gov') {
                            actions = '<a href="' + esc(doc.href_gov || doc.href || '#') + '" target="_blank" rel="noopener" class="w-full min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition">' +
                                '<i class="fas fa-print text-[10px]"></i> 국비 ' + cntGov + '명 인쇄</a>';
                        } else if (fundingFilter === 'all' && aud === 'general') {
                            actions = '<a href="' + esc(doc.href_general || doc.href || '#') + '" target="_blank" rel="noopener" class="w-full min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-600 text-white text-xs font-bold hover:bg-slate-700 transition">' +
                                '<i class="fas fa-print text-[10px]"></i> 일반 ' + cntGen + '명 인쇄</a>';
                        } else {
                            var href = doc.href || '#';
                            var label = fundingFilter === 'gov' ? ('국비 ' + cnt + '명') : fundingFilter === 'general' ? ('일반 ' + cnt + '명') : actionLabel(doc);
                            actions = '<a href="' + esc(href) + '" target="_blank" rel="noopener" class="w-full min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition">' +
                                '<i class="fas fa-print text-[10px]"></i> ' + label + ' 인쇄</a>';
                        }
                    } else {
                        actions = '<button type="button" disabled class="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">' + actionLabel(doc) + '</button>';
                    }

                    return '<article class="bento-card bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 transition-all duration-300 ' + (disabled ? 'opacity-70' : '') + '">' +
                        '<div class="flex items-start justify-between gap-2 mb-3">' +
                            '<span class="text-[10px] font-black text-slate-400 tracking-widest">' + orderLabel + ' · ' + esc(doc.code) + '</span>' +
                            '<div class="flex items-center gap-1.5 flex-wrap justify-end">' + audienceBadge(aud) + statusBadge(doc.status) + '</div>' +
                        '</div>' +
                        '<h3 class="text-sm font-black text-slate-900 leading-snug mb-2">' + esc(doc.title) + '</h3>' +
                        '<p class="text-[11px] text-slate-500 font-medium leading-relaxed mb-2 min-h-[2.5rem]">' + esc(doc.description) + '</p>' +
                        '<p class="text-[10px] font-bold text-slate-400 mb-4">대상 인원 ' + cnt + '명 · 국비 ' + cntGov + ' · 일반 ' + cntGen + '</p>' +
                        actions +
                        (incompatible || doc.status === 'planned' ? '' : downloadActionsHtml(doc)) +
                    '</article>';
                }).join('');

                grid.querySelectorAll('.js-dl').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var url = btn.getAttribute('data-dl');
                        if (!url) return;
                        var openGsheet = btn.getAttribute('data-gsheet') === '1';
                        downloadByUrl(url, openGsheet).catch(function(e) {
                            alert(e.message || '다운로드 실패');
                        });
                    });
                });
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
                    var q = fundingFilter && fundingFilter !== 'all' ? ('?funding=' + encodeURIComponent(fundingFilter)) : '';
                    var res = await fetch('/api/opening-docs/' + sessionId + '/pack' + q, { headers: authHeaders() });
                    var json = await res.json();
                    if (!json.success) throw new Error(json.error || '팩 조회 실패');
                    var data = json.data;
                    lastPackData = data;
                    var s = data.session || {};
                    var title = (s.course_name || '') + (s.session_number != null ? ' (' + s.session_number + '회차)' : '') + (s.session_name ? ' - ' + s.session_name : '');
                    document.getElementById('packCourseTitle').textContent = title || '회차';
                    document.getElementById('packMeta').textContent =
                        ((s.training_start_date || '-').toString().slice(0, 10)) + ' ~ ' + ((s.training_end_date || '-').toString().slice(0, 10)) +
                        ' · ' + (s.effective_status || s.status || '');
                    document.getElementById('packInstructor').textContent = s.instructor_name || '강사 미지정';
                    document.getElementById('packLocation').textContent = s.location || '장소 미지정';
                    document.getElementById('packTraineeCount').textContent = String(data.trainee_count || 0);
                    var govEl = document.getElementById('packGovCount');
                    var genEl = document.getElementById('packGeneralCount');
                    if (govEl) govEl.textContent = String(data.trainee_count_gov != null ? data.trainee_count_gov : 0);
                    if (genEl) genEl.textContent = String(data.trainee_count_general != null ? data.trainee_count_general : 0);
                    document.getElementById('packReadyCount').textContent = String((data.progress && data.progress.implemented) || 0);
                    document.getElementById('packTotalCount').textContent = String((data.progress && data.progress.total) || 0);
                    syncFundingFilterButtons();
                    renderDocsGrid(data);

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

            document.getElementById('fundingFilterGroup').addEventListener('click', function(e) {
                var btn = e.target && e.target.closest ? e.target.closest('.funding-filter-btn') : null;
                if (!btn) return;
                var next = btn.getAttribute('data-funding') || 'all';
                if (next === fundingFilter) return;
                fundingFilter = next;
                syncFundingFilterButtons();
                if (fixedSessionId) loadPack(fixedSessionId);
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
        .toolbar { max-width: 297mm; margin: 12px auto; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .toolbar button, .toolbar a.btn-dl { padding: 8px 14px; border: 0; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-print { background: #2563eb; color: #fff; }
        .btn-close { background: #475569; color: #fff; }
        .btn-xlsx { background: #15803d; color: #fff; }
        .btn-gsheet { background: #0f9d58; color: #fff; }
        .btn-html { background: #0f172a; color: #fff; }
        .btn-pdf { background: #b91c1c; color: #fff; }
        .btn-pdf:disabled { opacity: .65; cursor: wait; }
        .sheet { max-width: 210mm; margin: 0 auto 24px; background: #fff; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
        .sheet.sheet-tt { max-width: 297mm; padding: 14px 16px; }
        table.tt-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 6px 0 10px; }
        table.tt-table th, table.tt-table td { border: 1px solid #222; padding: 5px 4px; text-align: center; vertical-align: middle; font-size: 11px; word-break: keep-all; }
        table.tt-table th { background: #f3f4f6; font-weight: 700; }
        table.tt-table td.subj { white-space: pre-line; font-size: 10px; line-height: 1.35; height: 48px; }
        table.tt-table .time-col { width: 92px; font-size: 10px; }
        .tt-title { text-align: center; font-size: 18px; font-weight: 800; margin: 0 0 6px; white-space: pre-line; line-height: 1.35; }
        .tt-room { text-align: center; font-size: 14px; font-weight: 700; margin: 0 0 6px; }
        .tt-period { text-align: center; font-size: 11px; font-weight: 700; margin: 0 0 10px; padding: 8px; background: #eef6ff; border: 1px solid #cbd5e1; white-space: pre-line; line-height: 1.45; }
        .tt-footer { margin-top: 8px; padding: 10px 12px; border: 1px solid #222; font-size: 11px; line-height: 1.5; white-space: pre-wrap; word-break: keep-all; }
        .hrd-meta { width: 100%; border-collapse: collapse; margin-bottom: 8px; table-layout: fixed; }
        .hrd-meta th, .hrd-meta td { border: 1px solid #222; padding: 4px 6px; font-size: 11px; vertical-align: middle; }
        .hrd-meta th { width: 72px; background: #f3f4f6; text-align: center; font-weight: 700; }
        .hrd-banner { text-align: center; font-weight: 800; font-size: 12px; padding: 6px; margin: 8px 0; background: #fff7ed; border: 1px solid #222; }
        .hrd-title-side { text-align: center; font-weight: 800; font-size: 13px; background: #e0f2fe; border: 1px solid #222; padding: 10px 8px; }
        table.hrd-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9px; margin-top: 6px; }
        table.hrd-table th, table.hrd-table td { border: 1px solid #222; padding: 3px 2px; text-align: center; vertical-align: middle; word-break: keep-all; }
        table.hrd-table th { background: #f3f4f6; font-weight: 700; }
        table.hrd-table .pnum { width: 28px; font-weight: 800; }
        table.hrd-table .ptime { width: 72px; font-size: 8px; line-height: 1.35; }
        table.hrd-table td.hrd-slot { padding: 0; vertical-align: top; height: auto; }
        .hrd-slot-inner { display: flex; width: 100%; min-height: 54px; align-items: stretch; }
        .hrd-slot-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
        .hrd-slot-main .subj { background: #fff7ed; font-weight: 700; font-size: 8.5px; line-height: 1.35; padding: 4px 3px; border-bottom: 1px solid #222; word-break: keep-all; }
        .hrd-slot-main .unit { font-size: 8px; line-height: 1.35; padding: 4px 3px; border-bottom: 1px solid #222; word-break: keep-all; color: #334155; }
        .hrd-slot-main .loc { background: #e0f2fe; font-size: 8px; line-height: 1.35; padding: 4px 3px; word-break: keep-all; color: #0f172a; }
        .hrd-slot-inner .inst { flex: 0 0 22%; width: 22%; max-width: 42px; display: flex; align-items: center; justify-content: center; border-left: 1px solid #222; font-size: 8.5px; font-weight: 700; line-height: 1.3; padding: 3px 2px; word-break: keep-all; }
        .hrd-page { margin-bottom: 18px; page-break-after: always; break-after: page; }
        .hrd-page:last-child { page-break-after: auto; break-after: auto; }
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
        table.sd-table th, table.sd-table td { border: 1px solid #222; padding: 4px 2px; text-align: center; vertical-align: middle; height: 26px; min-height: 26px; line-height: 1.2; box-sizing: border-box; }
        table.sd-table tbody tr { height: 26px; }
        table.sd-table th { background: #f3f4f6; font-weight: 700; height: auto; min-height: 22px; }
        table.sd-table .name-col { width: 64px; }
        table.sd-table .memo-col { width: 48px; }
        table.sd-table td.name { text-align: left; padding-left: 4px; font-weight: 600; white-space: nowrap; }
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
        table.checklist-table th, table.checklist-table td { height: 28px; min-height: 28px; box-sizing: border-box; }
        table.checklist-table tbody tr { height: 28px; }
        .mark-y { color: #111; font-weight: 800; font-size: 14px; }
        .mark-n { color: #94a3b8; }
        .empty { text-align: center; padding: 40px 12px; color: #64748b; }
        .footnote { margin-top: 10px; font-size: 10px; color: #64748b; }
        .sign-row { margin-top: 28px; display: flex; justify-content: flex-end; gap: 40px; font-size: 12px; }
        .ot-wrap { font-size: 12px; line-height: 1.55; word-break: keep-all; }
        .ot-wrap h2 { font-size: 15px; margin: 14px 0 8px; border-left: 4px solid #0f172a; padding-left: 8px; }
        .ot-wrap p { margin: 0 0 8px; }
        .ot-wrap .bullet-line { margin: 0 0 6px; }
        table.ot-table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; table-layout: fixed; }
        table.ot-table th, table.ot-table td { border: 1px solid #222; padding: 5px 6px; font-size: 11px; vertical-align: middle; }
        table.ot-table th { background: #f3f4f6; text-align: center; font-weight: 700; }
        table.ot-table td.l { text-align: left; }
        table.ot-table td.c { text-align: center; }
        .ot-confirm { margin-top: 18px; padding: 12px; border: 1px solid #222; }
        .ot-confirm .ask { font-weight: 700; margin-bottom: 10px; }
        .eval-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .eval-head table { border-collapse: collapse; }
        .eval-head th, .eval-head td { border: 1px solid #222; padding: 4px 8px; font-size: 11px; text-align: center; }
        table.eval-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.eval-table th, table.eval-table td { border: 1px solid #222; padding: 5px 6px; font-size: 11px; }
        table.eval-table th { background: #f3f4f6; }
        table.eval-table td.q { text-align: left; }
        table.eval-table td.score { text-align: center; width: 28px; }
        .survey-intro { font-size: 12px; line-height: 1.55; margin: 0 0 12px; word-break: keep-all; }
        .survey-meta { margin: 0 0 10px; font-size: 12px; }
        .survey-meta div { margin: 3px 0; }
        table.survey-table { width: 100%; border-collapse: collapse; margin: 0 0 12px; }
        table.survey-table th, table.survey-table td { border: 1px solid #222; padding: 5px 4px; font-size: 11px; text-align: center; }
        table.survey-table th { background: #f3f4f6; }
        table.survey-table td.q { text-align: left; padding-left: 6px; }
        .survey-free { min-height: 90px; border: 1px solid #222; margin-top: 6px; }
        table.att-gen { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 10px; }
        table.att-gen th, table.att-gen td { border: 1px solid #222; padding: 4px 3px; text-align: center; vertical-align: middle; height: 36px; min-height: 36px; box-sizing: border-box; }
        table.att-gen tbody tr { height: 36px; }
        table.att-gen th { background: #f3f4f6; font-weight: 700; height: auto; min-height: 22px; font-size: 9px; line-height: 1.2; }
        table.att-gen td.name { text-align: left; padding-left: 4px; font-weight: 600; }
        table.att-gen th.sign-col, table.att-gen td.sign-col { width: 78px; min-width: 78px; }
        table.att-gen th.sum-col, table.att-gen td.sum-col { width: 26px; min-width: 22px; padding: 2px 1px; font-size: 9px; }
        .ledger-note { font-size: 10px; line-height: 1.45; color: #334155; margin-top: 10px; word-break: keep-all; }
    </style>
</head>
<body>
    <div class="toolbar no-print">
        <button type="button" class="btn-print" onclick="window.print()"><i class="fas fa-print"></i> 인쇄하기</button>
        <button type="button" class="btn-pdf" id="btnDlPdf"><i class="fas fa-file-pdf"></i> PDF 저장</button>
        <button type="button" class="btn-html" id="btnDlHtml"><i class="fas fa-download"></i> HTML 저장</button>
        <button type="button" class="btn-xlsx" id="btnDlXlsx" style="display:none"><i class="fas fa-file-excel"></i> Excel</button>
        <button type="button" class="btn-gsheet" id="btnDlGsheet" style="display:none"><i class="fas fa-table"></i> 구글시트</button>
        <button type="button" class="btn-close" onclick="window.close()">닫기</button>
        <span style="margin-left:8px;align-self:center;font-size:11px;font-weight:700;color:#64748b;">대상</span>
        <button type="button" class="btn-close" style="background:#0f172a" onclick="(function(){var u=new URL(location.href);u.searchParams.delete('funding');location.href=u.toString();})()">전체</button>
        <button type="button" class="btn-close" style="background:#d97706" onclick="(function(){var u=new URL(location.href);u.searchParams.set('funding','gov');location.href=u.toString();})()">국비</button>
        <button type="button" class="btn-close" style="background:#64748b" onclick="(function(){var u=new URL(location.href);u.searchParams.set('funding','general');location.href=u.toString();})()">일반</button>
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
        function markO(v) { return v ? '<span class="mark-y">○</span>' : '&nbsp;'; }
        function blankCell() { return '&nbsp;'; }
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
        var __openingDocPrintMeta = { session: null, docTitle: '', docCode: '' };
        function safeDownloadBaseName(raw) {
            var s = String(raw || '')
                .replace(/[\\/:*?"<>|]+/g, '_')
                .replace(/[\\r\\n\\t]+/g, ' ')
                .replace(/\\s+/g, ' ')
                .replace(/^\\.+|\\.+$/g, '')
                .trim();
            if (!s) s = '개강서류';
            if (s.length > 120) s = s.slice(0, 120).trim();
            return s;
        }
        function buildOpeningDocFilename(ext, fallbackCode) {
            var session = __openingDocPrintMeta.session || {};
            var course = String(session.course_name || '').trim();
            var sessNo = session.session_number != null ? (String(session.session_number) + '차') : '';
            var docTitle = String(__openingDocPrintMeta.docTitle || '').trim();
            var code = String(__openingDocPrintMeta.docCode || fallbackCode || '').trim();
            var parts = [];
            if (course) parts.push(course);
            if (sessNo) parts.push(sessNo);
            if (docTitle) parts.push(docTitle);
            else if (code) parts.push(code);
            var base = safeDownloadBaseName(parts.join('_') || (code || '개강서류'));
            var e = String(ext || 'pdf').replace(/^\\./, '');
            return base + '.' + e;
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
        function formatShortDot(d) {
            var m = String(d || '').slice(0, 10).match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
            if (!m) return String(d || '');
            return m[1].slice(2) + '.' + m[2] + '.' + m[3];
        }
        function formatMonthDayHeader(day) {
            var m = String(day.date || '').match(/^\\d{4}-(\\d{2})-(\\d{2})$/);
            if (!m) return day.dateShort || '';
            return m[1] + '월 ' + m[2] + '일';
        }
        /** HWP 3-1/3-2 오리엔테이션 출결·인정일수 본문 */
        function orientationBodyHtml(session, opts) {
            opts = opts || {};
            var rules = session.attendance_rules || {};
            var units = session.unit_periods || [];
            var dayCount = session.training_day_count || session.total_days || units.reduce(function(a, u) { return a + (u.training_days || 0); }, 0) || '';
            var hourCount = session.training_hour_count || session.total_hours || '';
            var period = formatDotDate(session.training_start_date) + ' ~ ' + formatDotDate(session.training_end_date);
            var unitRows = units.map(function(u) {
                return '<tr>' +
                    '<td class="c">' + u.unit + '단위</td>' +
                    '<td class="c">' + esc(formatShortDot(u.start_date) + ' ~ ' + formatShortDot(u.end_date)) + '</td>' +
                    '<td class="c">' + u.training_days + '일 ( ' + u.allowed_absences + '일 )</td>' +
                    '<td class="c">지각 또는 조퇴 1회</td>' +
                '</tr>';
            }).join('');
            if (!unitRows) {
                unitRows = '<tr><td class="c">1단위</td><td class="c">' + esc(formatShortDot(session.training_start_date) + ' ~ ' + formatShortDot(session.training_end_date)) + '</td><td class="c">' + esc(String(dayCount || '')) + '일</td><td class="c">지각 또는 조퇴 1회</td></tr>';
            }
            var html = '<div class="ot-wrap">' +
                '<p class="bullet-line"><strong>출결기준</strong></p>' +
                '<p>○ 훈련기간이 ' + esc(period.replace(/\\./g, '. ')) + ' 총 ' + esc(String(dayCount)) + '일 ' + esc(String(hourCount)) +
                '시간 수업으로 훈련(일)의 100분의 80%이상 출석하셔야 수료가 되는 과정입니다.</p>' +
                '<table class="ot-table"><thead><tr><th style="width:70px">단위기간</th><th>훈련기간</th><th>총수업일수(인정결석일)</th><th style="width:120px">비고</th></tr></thead><tbody>' +
                unitRows + '</tbody></table>' +
                '<p>○ 지각, 조퇴 또는 외출 3회는 1일 결석 처리됩니다. 조퇴 또는 외출로 인하여 출석시간이 1일 소정훈련시간의 100분의 50미만인 경우 결석처리 됩니다.</p>' +
                '<table class="ot-table">' +
                '<tr><th style="width:90px">정상수업시간</th><td class="l">' + esc(rules.normal_time_label || formatTimeRange(session.training_time_start, session.training_time_end)) + '</td></tr>' +
                '<tr><th>지 각</th><td class="l">' + esc(rules.late_rule || '') + '</td></tr>' +
                '<tr><th>조 퇴</th><td class="l">' + esc(rules.early_rule || '') + '</td></tr>' +
                '<tr><th>외 출</th><td class="l">' + esc(rules.outing_rule || '') + '</td></tr>' +
                '</table>' +
                '<p>○ 총 훈련시간이 10일 이상의 훈련의 경우 훈련과 관련한 시험, 면접, 결혼, 사망, 출산 등의 사유로 훈련을 받지 못하는 경우 [출석인정일수]에 따라 훈련을 받은 것으로 인정됩니다.</p>' +
                '<p class="bullet-line"><strong>출석인정일수</strong></p>' +
                '<table class="ot-table">' +
                '<thead><tr><th style="width:110px">구 분</th><th>대 상</th><th style="width:70px">일 수</th></tr></thead><tbody>' +
                '<tr><td class="c">훈련 및 시험, 공민원</td><td class="l">예비군훈련, 민방위훈련, 징병검사, 취업/훈련관련시험(자격증), 입사시험(면접), 기능경기대회 출전, 선거권(기타 공인권)행사</td><td class="c">소요일수</td></tr>' +
                '<tr><td class="c">결혼</td><td class="l">본인 5일 / 자녀 1일</td><td class="c">해당일수</td></tr>' +
                '<tr><td class="c">사망</td><td class="l">배우자·본인 및 배우자의 부모 5일 / 조부모·외조부모 2일 / 자녀와 그 배우자 2일 / 형제자매 1일</td><td class="c">해당일수</td></tr>' +
                '<tr><td class="c">출산</td><td class="l">배우자</td><td class="c">5일</td></tr>' +
                '<tr><td class="c">질병/입원</td><td class="l">본인, 자녀 (진단서·진료확인서·입원확인서·질병확인서 등 증빙) ※ 처방전만으로는 인정되지 않을 수 있음</td><td class="c">증빙일수</td></tr>' +
                '</tbody></table>' +
                '<p>○ 출석인정은 관련 증빙서류를 제출한 경우에 한하며, 사전·사후 신고 절차를 따릅니다.</p>' +
                '<p>○ HRD-Net 출결 단말기(또는 지정 출결 방식)로 입·퇴실을 확인하고, 부정출석·대리출석은 관련 법령에 따라 불이익을 받을 수 있습니다.</p>';
            if (opts.collect) {
                html += '<div class="ot-confirm">' +
                    '<p class="ask">위 출결기준 및 출석인정일수 안내를 충분히 확인하였습니다.</p>' +
                    '<div class="pledge-date">' + esc(formatPledgeDate(session.training_start_date)) + '</div>' +
                    '<div class="pledge-sign">확인자(수강생)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명 또는 인)</div>' +
                '</div>';
            }
            html += '</div>';
            return html;
        }
        /** HWP「2-3_개인정보활용동의서_일반」수강생 1장 */
        function privacyConsentPageHtml(session, t) {
            var inst = session.institution_name || '와우쓰리디홍대센터';
            return '<section class="pledge-page">' +
                brandHtml(session) +
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
                '</div>' +
                '<table class="pledge-id" style="margin-top:16px"><tbody>' +
                '<tr><th>신 청 인</th><td>' + esc(t.name || '') + '</td><th>연 락 처</th><td>' + esc(t.phone || '') + '</td></tr>' +
                '<tr><th>생년월일</th><td>' + esc(formatBirthKr(t.birthdate) || '') + '</td><th>서    명</th><td style="height:42px">&nbsp;</td></tr>' +
                '</tbody></table>' +
                '<div class="pledge-date">' + esc(formatPledgeDate(session.training_start_date)) + '</div>' +
                '<div class="pledge-sign">신청인&nbsp;&nbsp;&nbsp;&nbsp;' + esc(t.name || '') +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명 또는 인)</div>' +
                '<p class="footnote">※ 원본: 2-3_개인정보활용동의서_일반.hwp</p>' +
            '</section>';
        }
        function mediaConsentPageHtml(session, t) {
            var inst = session.institution_name || '와우쓰리디홍대센터';
            return '<section class="pledge-page">' +
                brandHtml(session) +
                '<h1 class="doc-title">미디어 촬영 동의서</h1>' +
                '<p style="font-weight:700;margin:8px 0 6px;">■ 촬영 정보</p>' +
                '<table class="ot-table"><tbody>' +
                '<tr><th style="width:160px">수집하는 정보 항목</th><td class="l">학원내 영상정보처리기기(CCTV) 촬영</td></tr>' +
                '<tr><th>개인정보의 수집 및 이용목적</th><td class="l">수강생의 안전, 분쟁소지 및 입·퇴실 정보 제공을 위한 자료 확보</td></tr>' +
                '<tr><th>보관기간</th><td class="l">수료일로부터 30일</td></tr>' +
                '<tr><th>보관장소</th><td class="l">행정실</td></tr>' +
                '</tbody></table>' +
                '<p style="font-weight:700;margin:12px 0 6px;">■ ' + esc(inst) + ' CCTV 설치현황 (현재)</p>' +
                '<table class="ot-table"><thead><tr><th>시설물명</th><th>위치</th><th style="width:50px">대수</th><th>촬영범위</th><th style="width:60px">비고</th></tr></thead><tbody>' +
                '<tr><td class="l" rowspan="4">' + esc(inst) + '</td><td class="c">제1강의실</td><td class="c">1</td><td class="l">강의실내부</td><td></td></tr>' +
                '<tr><td class="c">3D프린팅실 및 휴게실</td><td class="c">1</td><td class="l">휴게공간 및 프린팅실</td><td></td></tr>' +
                '<tr><td class="c">원장실 및 상담실</td><td class="c">1</td><td class="l">입구</td><td></td></tr>' +
                '<tr><td class="c">계</td><td class="c">3대</td><td class="c">-</td><td></td></tr>' +
                '</tbody></table>' +
                '<p style="margin-top:12px;">[공공기관의 개인정보보호에 관한 법률] 제15조, 제18조 및 제19조의 규정과 [개인정보 보호를 위한 공공기관의 CCTV 설치·운영 지침]에 의거, CCTV 촬영에 동의합니다.</p>' +
                '<p>개인정보 제공자가 동의한 내용 외의 다른 목적으로 활용하지 않으며, 제공된 개인정보의 이용을 거부하고자 할 때에는 개인정보 관리책임자를 통해 열람, 정정, 삭제를 요구할 수 있습니다.</p>' +
                (t ? ('<p style="margin-top:10px;">성명: <strong>' + esc(t.name || '') + '</strong> &nbsp; 연락처: ' + esc(t.phone || '') + '</p>') : '') +
                '<div class="pledge-date">' + esc(formatPledgeDate(session.training_start_date)) + ' 확인자</div>' +
                '<div class="pledge-sign">(서명 또는 인)</div>' +
            '</section>';
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
        function fundingFromQuery() {
            var f = (qs('funding') || 'all').toLowerCase();
            return (f === 'gov' || f === 'general') ? f : 'all';
        }
        function fundingFilterLabel(f) {
            if (f === 'gov') return '국비지원대상';
            if (f === 'general') return '일반';
            if (f === 'none') return '대상 없음';
            return '전체';
        }
        function fundingBannerHtml(funding) {
            var label = fundingFilterLabel(funding);
            var color = funding === 'gov' ? '#b45309' : funding === 'general' ? '#475569' : '#047857';
            var bg = funding === 'gov' ? '#fffbeb' : funding === 'general' ? '#f8fafc' : '#ecfdf5';
            return '<p class="doc-period" style="background:' + bg + ';border-color:' + color + '33;color:' + color + '">' +
                '<span class="label">대상구분</span>' + esc(label) + '</p>';
        }
        async function fetchDoc(sessionId, docCode) {
            var funding = fundingFromQuery();
            var q = funding !== 'all' ? ('?funding=' + encodeURIComponent(funding)) : '';
            var res = await fetch('/api/opening-docs/' + sessionId + '/docs/' + docCode + q, {
                headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
            });
            var json = await res.json();
            if (!json.success) throw new Error(json.error || '조회 실패');
            return json.data;
        }
        async function downloadDocFile(sessionId, docCode, format) {
            var funding = fundingFromQuery();
            var q = '?format=' + encodeURIComponent(format);
            if (funding !== 'all') q += '&funding=' + encodeURIComponent(funding);
            var res = await fetch('/api/opening-docs/' + sessionId + '/docs/' + docCode + '/download' + q, {
                headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
            });
            if (!res.ok) {
                var errJson = null;
                try { errJson = await res.json(); } catch (e) {}
                throw new Error((errJson && errJson.error) || ('다운로드 실패 (' + res.status + ')'));
            }
            var blob = await res.blob();
            var dispo = res.headers.get('Content-Disposition') || '';
            var filename = docCode + '_' + format;
            var m = dispo.match(/filename\\*=UTF-8''([^;]+)/i) || dispo.match(/filename=\"?([^\";]+)\"?/i);
            if (m && m[1]) {
                try { filename = decodeURIComponent(m[1]); } catch (e) { filename = m[1]; }
            }
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            if (format === 'gsheet' || format === 'csv') {
                setTimeout(function() {
                    window.open('https://docs.google.com/spreadsheets/u/0/', '_blank', 'noopener');
                    alert('CSV 파일이 다운로드되었습니다.\\n구글 시트에서 [파일 → 가져오기 → 업로드]로 방금 받은 CSV를 불러오세요.');
                }, 400);
            }
        }
        function downloadRenderedHtml(docCode) {
            var sheetEl = document.getElementById('sheet');
            var bodyHtml = sheetEl ? sheetEl.innerHTML : '';
            var styles = Array.prototype.map.call(document.querySelectorAll('style'), function(s) { return s.outerHTML; }).join('\\n');
            var html = '<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><title>' +
                esc(docCode) + '</title>' + styles +
                '<style>body{background:#fff!important}.no-print,.toolbar{display:none!important}</style></head><body>' +
                bodyHtml + '</body></html>';
            var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = docCode + '_개강서류.html';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
        function loadScriptOnce(src, globalCheck) {
            if (globalCheck()) return Promise.resolve();
            return new Promise(function(resolve, reject) {
                var existed = document.querySelector('script[data-pdf-lib="' + src + '"]');
                if (existed) {
                    existed.addEventListener('load', function() { resolve(); });
                    existed.addEventListener('error', function() { reject(new Error('스크립트 로드 실패')); });
                    return;
                }
                var s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.setAttribute('data-pdf-lib', src);
                s.onload = function() { resolve(); };
                s.onerror = function() { reject(new Error('스크립트 로드 실패: ' + src)); };
                document.head.appendChild(s);
            });
        }
        async function loadPdfLibs() {
            await loadScriptOnce(
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                function() { return !!window.html2canvas; }
            );
            await loadScriptOnce(
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                function() { return !!(window.jspdf && window.jspdf.jsPDF); }
            );
            if (!window.html2canvas || !(window.jspdf && window.jspdf.jsPDF)) {
                throw new Error('PDF 라이브러리를 불러오지 못했습니다');
            }
        }
        function isLandscapeDoc(docCode, sheetEl) {
            // 인쇄 미리보기와 동일: D02는 세로, 가로 전용 서류만 landscape
            if (docCode === 'D03' || docCode === 'D51' || docCode === 'D80') return true;
            if (!sheetEl) return false;
            if (docCode === 'D02') return false;
            return !!sheetEl.querySelector('.landscape-page');
        }
        function collectPdfTargets(sheetEl) {
            var pages = sheetEl.querySelectorAll('.pledge-page, .hrd-page');
            if (pages && pages.length) return Array.prototype.slice.call(pages);
            return [sheetEl];
        }
        function trimCanvasBottomWhitespace(canvas) {
            try {
                var ctx = canvas.getContext('2d');
                var w = canvas.width;
                var h = canvas.height;
                var data = ctx.getImageData(0, 0, w, h).data;
                var bottom = h - 1;
                function rowHasInk(y) {
                    var step = Math.max(1, Math.floor(w / 200));
                    for (var x = 0; x < w; x += step) {
                        var i = (y * w + x) * 4;
                        // 거의 흰색이 아니면 콘텐츠로 판단
                        if (data[i] < 248 || data[i + 1] < 248 || data[i + 2] < 248) return true;
                    }
                    return false;
                }
                while (bottom > 0 && !rowHasInk(bottom)) bottom -= 1;
                bottom = Math.min(h - 1, bottom + 6);
                if (bottom >= h - 2) return canvas;
                var trimmed = document.createElement('canvas');
                trimmed.width = w;
                trimmed.height = Math.max(1, bottom + 1);
                trimmed.getContext('2d').drawImage(canvas, 0, 0);
                return trimmed;
            } catch (e) {
                return canvas;
            }
        }
        function addCanvasToPdf(pdf, canvas, marginMm, opts) {
            opts = opts || {};
            canvas = trimCanvasBottomWhitespace(canvas);
            var pageW = pdf.internal.pageSize.getWidth();
            var pageH = pdf.internal.pageSize.getHeight();
            var usableW = pageW - marginMm * 2;
            var usableH = pageH - marginMm * 2;
            var imgW = usableW;
            var imgH = (canvas.height * imgW) / canvas.width;
            // 인쇄 미리보기처럼 한 장에 맞춤 (비율 유지 축소)
            var fitSingle = opts.fitSinglePage !== false;
            if (fitSingle || imgH <= usableH + 0.5) {
                if (imgH > usableH) {
                    imgH = usableH;
                    imgW = (canvas.width * imgH) / canvas.height;
                }
                var x = marginMm + Math.max(0, (usableW - imgW) / 2);
                var y = marginMm;
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', x, y, imgW, imgH);
                return;
            }
            // 다중 장만 세로 분할
            var pxPerPage = Math.max(1, Math.floor((usableH / imgH) * canvas.height));
            var srcY = 0;
            var first = true;
            while (srcY < canvas.height) {
                var remain = canvas.height - srcY;
                // 남은 영역이 거의 빈 여백이면 중단
                if (!first && remain < Math.max(24, Math.floor(pxPerPage * 0.04))) break;
                if (!first) pdf.addPage();
                first = false;
                var sliceH = Math.min(pxPerPage, remain);
                var slice = document.createElement('canvas');
                slice.width = canvas.width;
                slice.height = sliceH;
                var ctx = slice.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, slice.width, slice.height);
                ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
                slice = trimCanvasBottomWhitespace(slice);
                // 완전 빈 슬라이스 스킵
                if (slice.height < 8) {
                    srcY += sliceH;
                    continue;
                }
                var sliceImgH = (slice.height * imgW) / canvas.width;
                pdf.addImage(slice.toDataURL('image/jpeg', 0.98), 'JPEG', marginMm, marginMm, imgW, sliceImgH);
                srcY += sliceH;
            }
        }
        async function captureElementForPdf(sourceEl, landscape) {
            var widthPx = landscape ? 1123 : 794; // 인쇄 A4와 동일 기준
            var host = document.createElement('div');
            host.setAttribute('data-pdf-capture-host', '1');
            host.setAttribute('aria-hidden', 'true');
            // 화면 밖에 배치해 캡처 중 깜빡임/미리보기 노출 방지
            host.style.cssText = [
                'position:fixed',
                'left:-10000px',
                'top:0',
                'width:' + widthPx + 'px',
                'padding:0',
                'margin:0',
                'background:#ffffff',
                'z-index:-1',
                'opacity:0',
                'box-sizing:border-box',
                'overflow:visible',
                'pointer-events:none',
                'visibility:hidden'
            ].join(';');
            var clone = sourceEl.cloneNode(true);
            clone.style.cssText = [
                'max-width:none',
                'width:100%',
                'margin:0',
                'padding:10px 12px',
                'box-shadow:none',
                'background:#ffffff',
                'box-sizing:border-box',
                '-webkit-print-color-adjust:exact',
                'print-color-adjust:exact',
                'visibility:visible',
                'opacity:1'
            ].join(';');
            clone.classList.remove('sheet-wrap');
            host.appendChild(clone);
            document.body.appendChild(host);
            try {
                await new Promise(function(r) { setTimeout(r, 60); });
                var captureH = Math.max(clone.scrollHeight, clone.offsetHeight, 1);
                // visibility:hidden 호스트는 일부 브라우저에서 빈 캡처가 될 수 있어
                // 캡처 직전만 레이아웃용으로 보이게 하되 화면 밖 유지
                host.style.visibility = 'visible';
                host.style.opacity = '1';
                var canvas = await window.html2canvas(clone, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    width: widthPx,
                    height: captureH,
                    windowWidth: widthPx,
                    windowHeight: captureH,
                    onclone: function(clonedDoc) {
                        var toolbar = clonedDoc.querySelectorAll('.no-print, .toolbar');
                        Array.prototype.forEach.call(toolbar, function(n) { n.style.display = 'none'; });
                        var hostClone = clonedDoc.querySelector('[data-pdf-capture-host]');
                        if (hostClone) {
                            hostClone.style.left = '0';
                            hostClone.style.top = '0';
                            hostClone.style.opacity = '1';
                            hostClone.style.visibility = 'visible';
                            hostClone.style.zIndex = '0';
                        }
                        Array.prototype.forEach.call(clonedDoc.querySelectorAll('.sheet, .pledge-page, .hrd-page, table, td, th, div'), function(n) {
                            n.style.boxShadow = 'none';
                            n.style.webkitPrintColorAdjust = 'exact';
                            n.style.printColorAdjust = 'exact';
                        });
                        Array.prototype.forEach.call(clonedDoc.querySelectorAll('.sheet, .pledge-page, .hrd-page'), function(n) {
                            n.style.margin = '0';
                            n.style.maxWidth = 'none';
                            n.style.width = '100%';
                        });
                    }
                });
                return trimCanvasBottomWhitespace(canvas);
            } finally {
                if (host.parentNode) host.parentNode.removeChild(host);
            }
        }
        async function downloadRenderedPdf(docCode) {
            var sheetEl = document.getElementById('sheet');
            if (!sheetEl) throw new Error('인쇄 영역이 없습니다');
            if (sheetEl.querySelector('#loading')) throw new Error('서류가 아직 로드되지 않았습니다');
            var pdfBtn = document.getElementById('btnDlPdf');
            var prevLabel = pdfBtn ? pdfBtn.innerHTML : '';
            if (pdfBtn) {
                pdfBtn.disabled = true;
                pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PDF 생성 중…';
            }
            try {
                await loadPdfLibs();
                var landscape = isLandscapeDoc(docCode, sheetEl);
                var filename = buildOpeningDocFilename('pdf', docCode);
                var jsPDF = window.jspdf.jsPDF;
                var pdf = new jsPDF({
                    orientation: landscape ? 'landscape' : 'portrait',
                    unit: 'mm',
                    format: 'a4',
                    compress: true
                });
                var marginMm = 8;
                var targets = collectPdfTargets(sheetEl);
                // 단일 시트(D02 등)는 인쇄처럼 1장 맞춤, 수강생별 다장은 장마다 1장
                var fitSingle = targets.length === 1;
                for (var i = 0; i < targets.length; i++) {
                    if (i > 0) pdf.addPage();
                    var canvas = await captureElementForPdf(targets[i], landscape);
                    addCanvasToPdf(pdf, canvas, marginMm, { fitSinglePage: fitSingle });
                }
                pdf.save(filename);
            } finally {
                if (pdfBtn) {
                    pdfBtn.disabled = false;
                    pdfBtn.innerHTML = prevLabel || '<i class="fas fa-file-pdf"></i> PDF 저장';
                }
            }
        }
        function wireDownloadButtons(sessionId, docCode) {
            var htmlBtn = document.getElementById('btnDlHtml');
            var pdfBtn = document.getElementById('btnDlPdf');
            var xlsxBtn = document.getElementById('btnDlXlsx');
            var gsheetBtn = document.getElementById('btnDlGsheet');
            if (htmlBtn) htmlBtn.onclick = function() {
                try { downloadRenderedHtml(docCode); }
                catch (e) {
                    downloadDocFile(sessionId, docCode, 'html').catch(function(err) { alert(err.message || '다운로드 실패'); });
                }
            };
            if (pdfBtn) pdfBtn.onclick = function() {
                downloadRenderedPdf(docCode).catch(function(e) {
                    alert(e.message || 'PDF 저장 실패');
                });
            };
            if (docCode === 'D02' || docCode === 'D03') {
                if (xlsxBtn) {
                    xlsxBtn.style.display = '';
                    xlsxBtn.onclick = function() {
                        downloadDocFile(sessionId, docCode, 'xlsx').catch(function(e) { alert(e.message || '다운로드 실패'); });
                    };
                }
                if (gsheetBtn) {
                    gsheetBtn.style.display = '';
                    gsheetBtn.onclick = function() {
                        downloadDocFile(sessionId, docCode, 'gsheet').catch(function(e) { alert(e.message || '다운로드 실패'); });
                    };
                }
            }
        }
        function renderStudentTimetableHtml(tt) {
            if (!tt) return '<div class="empty">시간표 데이터가 없습니다.</div>';
            var blocks = tt.blocks || [];
            var colors = tt.subject_colors || {};
            var html = '<div class="tt-title">' + esc(tt.title_lines ? tt.title_lines.join('\\n') : '') + '</div>' +
                '<div class="tt-room">' + esc(tt.classroom_label || '') + '</div>' +
                '<div class="tt-period">' + esc(tt.period_summary || '') + '</div>';
            blocks.forEach(function(block) {
                var days = block.days || [];
                var cols = Math.max(days.length, 1);
                var dayNo = days.map(function(d) { return '<td>' + esc(d.day_no_label) + '</td>'; }).join('');
                var dates = days.map(function(d) { return '<td>' + esc(d.date_display) + '</td>'; }).join('');
                var subjs = days.map(function(d) {
                    var bg = colors[d.subject_name] || 'FFC000';
                    return '<td class="subj" style="background:#' + bg + '">' + esc(d.subject_name || '') + '</td>';
                }).join('');
                var teachers = days.map(function(d) { return '<td>' + esc(d.instructor_name || '') + '</td>'; }).join('');
                while (days.length < 6) { /* visual pad not required */ break; }
                html += '<table class="tt-table"><colgroup><col class="time-col"/>' +
                    new Array(cols + 1).join('<col/>') + '</colgroup>' +
                    '<tr><td style="border:none"></td>' + dayNo + '</tr>' +
                    '<tr><th>시간</th>' + dates + '</tr>' +
                    '<tr><th class="time-col">' + esc(tt.time_label || '') + '</th>' + subjs + '</tr>' +
                    '<tr><th>훈련교사</th>' + teachers + '</tr></table>';
            });
            html += '<div class="tt-footer">' + esc(tt.footer_notes || '') + '</div>';
            html += '<p class="footnote">※ 원본 양식: 02수강생배포용시간표.xlsx · Excel/구글시트 다운로드 가능</p>';
            return html;
        }
        function renderHrdTimetableHtml(hrd) {
            if (!hrd) return '<div class="empty">HRD 신고용 시간표 데이터가 없습니다.</div>';
            var pages = hrd.pages || [];
            var periods = hrd.periods || [];
            if (!pages.length) return '<div class="empty">등록된 훈련일이 없습니다.</div>';
            return pages.map(function(page, pi) {
                var days = page.days || [];
                var meta = '<table class="hrd-meta"><tr>' +
                    '<th>교육과정</th><td colspan="3" style="font-weight:800;white-space:pre-line">' + esc(hrd.course_name || '') + '</td>' +
                    '<td rowspan="2" class="hrd-title-side" style="width:34%">' + esc(hrd.sheet_title || '훈련시간표') + '</td></tr>' +
                    '<tr><th>훈련기간</th><td colspan="3">' + esc(hrd.period_label || '') + '</td></tr>' +
                    '<tr><th>훈련회차</th><td style="width:18%">' + esc(hrd.session_number != null ? String(hrd.session_number) : '') + '</td>' +
                    '<th style="width:72px">훈련시간</th><td>' + esc(hrd.time_range_label || '') + '</td><td rowspan="3" class="hrd-title-side">' + esc(hrd.institution_name || '') + '</td></tr>' +
                    '<tr><th>훈련강사</th><td colspan="3">' + esc(hrd.instructor_label || '') + '</td></tr>' +
                    '<tr><th>훈련장소</th><td colspan="3">' + esc(hrd.location_label || '') + '</td></tr></table>';
                var dayHead = days.map(function(d) {
                    return '<th colspan="2">' + esc(String(d.day_no)) + '</th>';
                }).join('');
                var dateHead = days.map(function(d) {
                    return '<th colspan="2" style="background:#e2efda;font-size:8px">' + esc(d.date_display || '') + '</th>';
                }).join('');
                var body = periods.map(function(p) {
                    var block = '';
                    days.forEach(function(d) {
                        var s = (d.slots && d.slots[p.period_number]) ? d.slots[p.period_number] : null;
                        block += '<td colspan="2" class="hrd-slot">' +
                            '<div class="hrd-slot-inner">' +
                            '<div class="hrd-slot-main">' +
                            '<div class="subj">' + esc(s && s.subject_name ? s.subject_name : '') + '</div>' +
                            '<div class="unit">' + esc(s && s.ability_unit_name ? s.ability_unit_name : '') + '</div>' +
                            '<div class="loc">' + esc(s && s.location ? s.location : '') + '</div>' +
                            '</div>' +
                            '<div class="inst">' + esc(s && s.instructor_name ? s.instructor_name : '') + '</div>' +
                            '</div></td>';
                    });
                    return '<tr><td class="pnum">' + p.period_number + '</td>' +
                        '<td class="ptime">' + esc((p.start_time || '') + ' ~ ' + (p.end_time || '')) + '</td>' + block + '</tr>';
                }).join('');
                return '<section class="hrd-page">' + meta +
                    '<div class="hrd-banner">' + esc(hrd.banner_title || '') + '</div>' +
                    '<table class="hrd-table"><thead>' +
                    '<tr><th class="pnum">교시</th><th class="ptime">시간</th>' + dayHead + '</tr>' +
                    '<tr><th></th><th></th>' + dateHead + '</tr></thead><tbody>' + body + '</tbody></table>' +
                    (pi === pages.length - 1 ? '<p class="footnote">※ 원본 양식: HRD 신고용 훈련시간표.xlsx · Excel/구글시트 다운로드 가능</p>' : '') +
                '</section>';
            }).join('');
        }
`;

export const adminOpeningDocPrintHtml = (sessionId: string, docCode: string) => {
  const code = String(docCode || '').toUpperCase();
  const titleMap: Record<string, string> = {
    D00: '훈련생 등록현황 체크리스트',
    D01: '훈 련 생 명 단',
    D02: '수강생 배포용 시간표',
    D03: 'HRD 신고용 시간표',
    D22: '[ 국민내일배움 훈련과정] 훈련생 서약서',
    D23: '개인정보 수집·이용 / 제공 동의서',
    D31: '직업능력개발훈련 오리엔테이션 자료(수거용)',
    D32: '직업능력개발훈련 오리엔테이션 자료(배포용)',
    D33: '오리엔테이션 참여자 명단',
    D40: '미디어 촬영 동의서',
    D51: '출 석 부',
    D53: '출석입력요청대장',
    D70: '교재지급확인서 관리대장',
    D80: 'SD카드 지급 / 반납 확인서 관리대장',
    D90: '수업평가 (평가자: 본인)',
    D91: '강의 후 설문지',
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
                var activeFunding = (data.funding_filter || fundingFromQuery() || 'all');
                var fundingBanner = fundingBannerHtml(activeFunding);
                __openingDocPrintMeta = { session: session, docTitle: docTitle, docCode: docCode };
                wireDownloadButtons(sessionId, docCode);
                function maybeAutodownload() {
                    if (qs('autopdf') === '1') {
                        setTimeout(function() {
                            downloadRenderedPdf(docCode).catch(function(e) {
                                alert(e.message || 'PDF 저장 실패');
                            });
                        }, 400);
                        return;
                    }
                    if (qs('autodownload') === '1') {
                        setTimeout(function() { downloadRenderedHtml(docCode); }, 250);
                    }
                }

                if (docCode === 'D02') {
                    sheet.className = 'sheet sheet-tt';
                    var tt = data.student_timetable || null;
                    if (!tt || !(tt.days && tt.days.length)) {
                        sheet.innerHTML = brandHtml(session) +
                            '<h1 class="doc-title">수강생 배포용 시간표</h1>' +
                            '<div class="empty">등록된 훈련일/시간표가 없습니다. 회차 시간표를 먼저 작성하세요.</div>';
                        return;
                    }
                    sheet.innerHTML = renderStudentTimetableHtml(tt);
                    maybeAutodownload();
                    return;
                }
                if (docCode === 'D03') {
                    sheet.className = 'sheet sheet-tt landscape-page';
                    var hrd = data.hrd_timetable || null;
                    if (!hrd || !(hrd.pages && hrd.pages.length) || !(hrd.total_days > 0)) {
                        sheet.innerHTML = brandHtml(session) +
                            '<h1 class="doc-title">HRD 신고용 시간표</h1>' +
                            '<div class="empty">등록된 훈련일/시간표가 없습니다. 회차 시간표를 먼저 작성하세요.</div>';
                        return;
                    }
                    sheet.innerHTML = renderHrdTimetableHtml(hrd);
                    maybeAutodownload();
                    return;
                }

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
                        sheet.innerHTML = brandHtml(session) + fundingBanner +
                            '<h1 class="doc-title">[ 국민내일배움 훈련과정] 훈련생 서약서</h1>' +
                            '<div class="empty">국비지원대상 훈련생이 없습니다. 대상 구분 확인 후 다시 출력하세요.</div>';
                        maybeAutodownload();
                        return;
                    }
                    sheet.className = 'sheet-wrap';
                    sheet.innerHTML = trainees.map(function(t) { return pledgePageHtml(session, t); }).join('');
                    maybeAutodownload();
                    return;
                }
                if (docCode === 'D40') {
                    sheet.className = 'sheet-wrap';
                    if (!trainees.length) {
                        sheet.className = 'sheet';
                        sheet.innerHTML = brandHtml(session) + fundingBanner +
                            '<h1 class="doc-title">미디어 촬영 동의서</h1>' +
                            '<div class="empty">선택한 대상구분의 훈련생이 없습니다.</div>';
                        maybeAutodownload();
                        return;
                    }
                    sheet.innerHTML = trainees.map(function(t) { return mediaConsentPageHtml(session, t); }).join('');
                    maybeAutodownload();
                    return;
                }
                if (docCode === 'D31' || docCode === 'D32') {
                    var otTitle = '직업능력개발훈련 오리엔테이션 자료';
                    var collect = docCode === 'D31';
                    if (collect && trainees.length) {
                        sheet.className = 'sheet-wrap';
                        sheet.innerHTML = trainees.map(function(t) {
                            return '<section class="pledge-page">' +
                                brandHtml(session) + fundingBanner +
                                '<h1 class="doc-title">' + otTitle + '</h1>' +
                                '<p class="doc-sub">훈련과정명 : ' + esc(courseNameWithSession(session)) + '</p>' +
                                orientationBodyHtml(session, { collect: true }) +
                                '<p style="margin-top:8px;font-size:11px;">수강생: <strong>' + esc(t.name || '') + '</strong> / ' + esc(t.phone || '') +
                                ' · ' + esc(t.funding_label || fundingFilterLabel(t.funding_category)) + '</p>' +
                            '</section>';
                        }).join('');
                        maybeAutodownload();
                        return;
                    }
                    sheet.className = 'sheet';
                    sheet.innerHTML = brandHtml(session) + fundingBanner +
                        '<h1 class="doc-title">' + otTitle + (collect ? ' (수거용)' : ' (배포용)') + '</h1>' +
                        '<p class="doc-sub">훈련과정명 : ' + esc(courseNameWithSession(session)) + '</p>' +
                        orientationBodyHtml(session, { collect: collect }) +
                        '<p class="footnote">※ 원본: 3-' + (collect ? '1_오리엔테이션_수거용' : '2_오리엔테이션_배포용') + '.hwp</p>';
                    maybeAutodownload();
                    return;
                }

                var html = docCode === 'D01'
                    ? (brandHtml(session) + fundingBanner + '<h1 class="doc-title spaced">' + esc(docTitle) + '</h1>' + rosterInfoHtml(session))
                    : (headerHtml(session, docTitle, { checklistStyle: docCode === 'D00' }) + fundingBanner);

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
                                '<td>' + (t.ot_attended === true ? markO(true) : blankCell()) + '</td>' +
                                '<td>' + markO(t.has_application) + '</td>' +
                                '<td>' + markO(t.has_self_pay) + '</td>' +
                                '<td class="addr">' + (t.status_memo ? esc(t.status_memo) : blankCell()) + '</td>' +
                            '</tr>';
                        } else {
                            html += '<tr>' +
                                '<td>' + (i + 1) + '</td>' +
                                '<td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td>' +
                            '</tr>';
                        }
                    }
                    html += '</tbody></table>' +
                        '<p class="footnote">※ OT참석은 수기 체크 · 교육신청서/자부담 결제는 수강생관리 등록 정보를 ○로 표시합니다. (원본: 0_훈련생 등록현황 체크리스트.hwp)</p>';
                } else if (docCode === 'D01') {
                    /* HWP「1_훈련생명단-훈련교사관리」: NO·대상구분·성명·전화번호·생년월일·비고 */
                    html += '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th>' +
                        '<th style="width:72px">대상구분</th>' +
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
                                '<td>' + esc(row.funding_label || fundingFilterLabel(row.funding_category)) + '</td>' +
                                '<td class="name">' + esc(row.name) + '</td>' +
                                '<td>' + esc(row.phone) + '</td>' +
                                '<td>' + esc(formatBirthKr(row.birthdate)) + '</td>' +
                                '<td class="addr">' + (row.status_memo ? esc(row.status_memo) : blankCell()) + '</td>' +
                            '</tr>';
                        } else {
                            html += '<tr>' +
                                '<td>' + (r + 1) + '</td>' +
                                '<td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td>' +
                            '</tr>';
                        }
                    }
                    html += '</tbody></table>' +
                        '<p class="footnote">※ 대상구분은 수강생 등록의 국비지원/일반 구분을 반영합니다. (원본: 1_훈련생명단-훈련교사관리.hwp)</p>';
                } else if (docCode === 'D23') {
                    /* HWP「2-3_개인정보활용동의서_일반」— 일반 수강생별 1장 */
                    if (!trainees.length) {
                        sheet.className = 'sheet';
                        sheet.innerHTML = brandHtml(session) + fundingBanner +
                            '<h1 class="doc-title">개인정보 수집·이용 / 제공 동의서</h1>' +
                            '<div class="empty">일반 대상 수강생이 없습니다. 대상 구분을 확인한 뒤 다시 출력하세요.</div>';
                        maybeAutodownload();
                        return;
                    }
                    sheet.className = 'sheet-wrap';
                    sheet.innerHTML = trainees.map(function(t) { return privacyConsentPageHtml(session, t); }).join('');
                    maybeAutodownload();
                    return;
                } else if (docCode === 'D33') {
                    /* HWP「3-3_오리엔테이션참여자명단」 */
                    html = brandHtml(session) + fundingBanner +
                        '<h1 class="doc-title">오리엔테이션 참여자 명단</h1>' +
                        '<ul class="info-list">' +
                        '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                        '<li><span class="bullet">￭ 훈련 기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + ' ~' + formatDotDate(session.training_end_date)) + '</span></li>' +
                        '<li><span class="bullet">￭ 담 당 자</span><span class="sep">:</span><span class="val">' + esc(session.instructor_name || '') + '</span></li>' +
                        '<li><span class="bullet">￭ 진행회차</span><span class="sep">:</span><span class="val">' + esc(session.session_number != null ? String(session.session_number) + '차' : '') + '</span></li>' +
                        '</ul>' +
                        '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th><th style="width:72px">대상구분</th><th style="width:90px">성명</th><th style="width:120px">전화번호</th>' +
                        '<th style="width:120px">생년월일</th><th>참여자서명</th>' +
                        '</tr></thead><tbody>';
                    padRows(trainees, 15).forEach(function(t, idx) {
                        if (t) {
                            html += '<tr><td>' + t.no + '</td><td>' + esc(t.funding_label || fundingFilterLabel(t.funding_category)) + '</td><td class="name">' + esc(t.name) + '</td><td>' + esc(t.phone) + '</td><td>' + esc(formatBirthKr(t.birthdate) || blankCell()) + '</td><td>' + blankCell() + '</td></tr>';
                        } else {
                            html += '<tr><td>' + (idx + 1) + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td></tr>';
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
                    html = brandHtml(session) + fundingBanner +
                        '<h1 class="doc-title">교재지급확인서 관리대장</h1>' +
                        '<ul class="info-list">' +
                        '<li><span class="bullet">￭ 훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                        '<li><span class="bullet">￭ 훈련 기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + '~' + formatDotDate(session.training_end_date)) + '</span></li>' +
                        '<li><span class="bullet">￭ 교 재 명</span><span class="sep">:</span><span class="val">' + esc(textbookLabel || '(승인과정 교재 미등록)') + '</span></li>' +
                        '<li><span class="bullet">￭ 교재배포일</span><span class="sep">:</span><span class="val">' + esc(deployDate) + '</span></li>' +
                        '</ul>' +
                        '<table class="doc-table checklist-table">' +
                        '<thead><tr>' +
                        '<th style="width:40px">NO</th><th style="width:72px">대상구분</th><th style="width:90px">성명</th><th style="width:110px">전화번호</th>' +
                        '<th style="width:110px">확인(정자체)</th><th>비고</th>' +
                        '</tr></thead><tbody>';
                    padRows(trainees, 15).forEach(function(t, idx) {
                        if (t) {
                            html += '<tr><td>' + t.no + '</td><td>' + esc(t.funding_label || fundingFilterLabel(t.funding_category)) + '</td><td class="name">' + esc(t.name) + '</td><td>' + esc(t.phone) + '</td><td>' + blankCell() + '</td><td class="addr">' + (t.status_memo ? esc(t.status_memo) : blankCell()) + '</td></tr>';
                        } else {
                            html += '<tr><td>' + (idx + 1) + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td><td>' + blankCell() + '</td></tr>';
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
                        var emptyCell = '<td>&nbsp;</td>';
                        sdRows.forEach(function(t) {
                            body += '<tr><td class="name">' + (t && t.name ? esc(t.name) : '&nbsp;') + '</td>';
                            days.forEach(function() { body += emptyCell + emptyCell + emptyCell; });
                            body += emptyCell + '</tr>';
                        });
                        return '<section class="pledge-page landscape-page">' +
                            brandHtml(session) + fundingBanner +
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
                    maybeAutodownload();
                    return;
                } else if (docCode === 'D51') {
                    /* HWP「5-1_출석부_일반수강생용」— 시작/종료는 수기 서명용으로 넓게, 집계란은 좁게 */
                    var dayChunks5 = chunkArray(trainingDays, 4);
                    var attRows = padRows(trainees, Math.max(trainees.length, 4));
                    var prescribed = trainingDays.length || session.training_day_count || '';
                    sheet.className = 'sheet-wrap';
                    html = (dayChunks5.length ? dayChunks5 : [[]]).map(function(days, pageIdx) {
                        var head1 = '<tr><th rowspan="2" style="width:28px">번호</th><th rowspan="2" style="width:52px">성명</th>';
                        var head2 = '<tr>';
                        days.forEach(function(d) {
                            head1 += '<th colspan="2">' + esc(formatMonthDayHeader(d)) + '</th>';
                            head2 += '<th class="sign-col">시작<br><span style="font-weight:500;font-size:8px">(성명)</span></th>' +
                                '<th class="sign-col">종료<br><span style="font-weight:500;font-size:8px">(성명)</span></th>';
                        });
                        head1 += '<th class="sum-col" rowspan="2">소정<br>출석</th><th class="sum-col" rowspan="2">실제<br>출석</th>' +
                            '<th class="sum-col" rowspan="2">결석</th><th class="sum-col" rowspan="2">지각</th><th class="sum-col" rowspan="2">조퇴</th>' +
                            '<th class="sum-col" rowspan="2">확인<br>(교사)</th><th class="sum-col" rowspan="2">기관장<br>결재</th></tr>';
                        head2 += '</tr>';
                        var body = '';
                        attRows.forEach(function(t, idx) {
                            body += '<tr><td>' + (idx + 1) + '</td><td class="name">' + (t && t.name ? esc(t.name) : '&nbsp;') + '</td>';
                            days.forEach(function() { body += '<td class="sign-col">&nbsp;</td><td class="sign-col">&nbsp;</td>'; });
                            body += '<td class="sum-col">' + (pageIdx === 0 && prescribed ? esc(String(prescribed)) : '&nbsp;') + '</td>' +
                                '<td class="sum-col">&nbsp;</td><td class="sum-col">&nbsp;</td><td class="sum-col">&nbsp;</td><td class="sum-col">&nbsp;</td><td class="sum-col">&nbsp;</td><td class="sum-col">&nbsp;</td></tr>';
                        });
                        return '<section class="pledge-page landscape-page">' +
                            brandHtml(session) + fundingBanner +
                            '<h1 class="doc-title spaced">출 석 부</h1>' +
                            '<div style="display:flex;justify-content:flex-end;gap:24px;font-size:11px;margin:-4px 0 8px;"><span>훈련교사</span><span>원장</span></div>' +
                            '<ul class="info-list">' +
                            '<li><span class="bullet">훈련기관명</span><span class="sep">:</span><span class="val">' + esc(session.institution_name || '') + '</span></li>' +
                            '<li><span class="bullet">훈련과정명</span><span class="sep">:</span><span class="val">' + esc(courseNameWithSession(session)) + '</span></li>' +
                            '<li><span class="bullet">훈련기간</span><span class="sep">:</span><span class="val">' + esc(formatDotDate(session.training_start_date) + ' ~ ' + formatDotDate(session.training_end_date)) + '</span></li>' +
                            '</ul>' +
                            '<table class="att-gen"><thead>' + head1 + head2 + '</thead><tbody>' + body + '</tbody></table>' +
                            '<p class="footnote">※ 일반 수강생용. 시작·종료 칸에 본인 성명을 수기로 기재합니다. (원본: 5-1_출석부_일반수강생용.hwp)</p>' +
                        '</section>';
                    }).join('');
                    sheet.innerHTML = html;
                    maybeAutodownload();
                    return;
                } else if (docCode === 'D53') {
                    /* HWP「5-3_출석입력요청대장(별지 제16호)」 */
                    html = brandHtml(session) + fundingBanner +
                        '<p style="text-align:right;font-size:11px;margin:0 0 4px;">■ 국민내일배움카드 운영규정 [별지 제16호서식]</p>' +
                        '<h1 class="doc-title">출석입력요청대장</h1>' +
                        '<p class="doc-sub">( ' + esc(session.institution_name || '') + ' )</p>' +
                        '<table class="ot-table" style="margin-bottom:10px"><tbody>' +
                        '<tr><th style="width:110px">①훈련과정명</th><td class="l" colspan="3">' + esc(courseNameWithSession(session)) + '</td></tr>' +
                        '<tr><th>②훈련기간</th><td class="l">' + esc(formatDotDate(session.training_start_date) + '~' + formatDotDate(session.training_end_date)) +
                        '</td><th style="width:90px">③훈련시간</th><td class="l">' + esc(formatTimeRange(session.training_time_start, session.training_time_end)) + '</td></tr>' +
                        '<tr><th>④ 대장관리자</th><td class="l" colspan="3">' + esc(session.instructor_name || '') + '</td></tr>' +
                        '</tbody></table>' +
                        '<table class="doc-table checklist-table" style="font-size:10px">' +
                        '<thead><tr>' +
                        '<th style="width:36px">⑤일련<br>번호</th><th style="width:70px">⑥발생일</th><th style="width:70px">⑦신청일</th>' +
                        '<th style="width:70px">⑧훈련생<br>성명</th><th>⑨사유</th>' +
                        '<th style="width:72px">⑩입실시간<br>(외출시간)</th><th style="width:72px">⑪퇴실시간<br>(귀원시간)</th>' +
                        '<th style="width:64px">⑫훈련생<br>서명</th><th style="width:64px">⑬관리자<br>서명</th>' +
                        '</tr></thead><tbody>';
                    for (var li = 1; li <= 15; li++) {
                        html += '<tr><td>' + li + '</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                    }
                    html += '</tbody></table>' +
                        '<div class="ledger-note"><strong>작성요령</strong><br>' +
                        '1. 대장은 훈련기관에서 전담자를 두어 별도 작성·관리하여야 하고, 훈련생은 사유발생일 당일에 훈련이 종료된 이후 관리자가 기재한 내용을 확인한 후 훈련생이 직접 본인의 성명을 자필로 정확하게 작성(사인, 특수문자 등은 기재할 수 없음)<br>' +
                        '2. ⑥란 발생일자는 직권입력사유 발생 해당일자 / ⑧란 성명은 전담관리자가 직접 기재 / ⑨란 사유는 카드 분실·훼손, 정전, 단말기 고장, 카드발급 지연 등<br>' +
                        '3. ⑩·⑪란은 직권사유 발생 훈련생의 입실(외출)·퇴실(귀원) 시간을 기재합니다.</div>' +
                        '<p class="footnote">※ 원본: 5-3_출석입력요청대장(별지서식제16호).hwp</p>';
                } else if (docCode === 'D90') {
                    /* HWP「업무수행평가」수업평가(본인) */
                    var evalQs = [
                        '수업시간에 출결사항을 정확히 확인하였습니까?',
                        '수업을 수업계획서에 의해 성실히 진행하였습니까?',
                        '수업목표를 명확히 제시하였습니까?',
                        '수업시간을 정확히 준수하였습니까?',
                        '수업에 임하는 자세가 성실하였습니까?',
                        '수업 운영 방법은 적절하였습니까?',
                        '보조자료를 적절히 사용하였습니까?',
                        '수업 종료시 마다 다음 시간 수업 내용을 예시 하였습니까?',
                        '과제물 부여와 평가는 적절하였습니까?',
                        '개인별 학생의 학습적응을 수시로 점검하였습니까?',
                        '실습시 관련 이론을 충분히 설명 하였습니까?',
                        '실습도구를 이용하여 수업진행을 잘 하였습니까?',
                        '실습도구에 문제 발생시 해결 방안은 적절하였습니까?',
                        '담당하신 강의 내용이 훈련생들에게 유익하다고 생각합니까?',
                        '훈련생들이 수업 목표를 어느정도 달성하였다고 생각합니까?'
                    ];
                    html = brandHtml(session) + fundingBanner +
                        '<div class="eval-head">' +
                        '<h1 class="doc-title" style="margin:0;text-align:left;font-size:18px;">수업평가 (평가자: 본인)</h1>' +
                        '<table><tr><th colspan="2">결 재</th></tr><tr><th style="width:52px">원 장</th><th style="width:52px">팀 장</th></tr>' +
                        '<tr><td style="height:36px">&nbsp;</td><td>&nbsp;</td></tr></table></div>' +
                        '<table class="ot-table" style="margin-bottom:8px"><tbody>' +
                        '<tr><th style="width:70px">소속</th><td class="l">' + esc(session.institution_name || '') +
                        '</td><th style="width:70px">성명</th><td class="l">' + esc(session.instructor_name || '') + '</td></tr>' +
                        '</tbody></table>' +
                        '<table class="eval-table"><thead><tr><th class="q">평 가 내 용</th><th colspan="5">긍정화정도 (강함⇔약함)</th></tr>' +
                        '<tr><th></th><th class="score">5</th><th class="score">4</th><th class="score">3</th><th class="score">2</th><th class="score">1</th></tr></thead><tbody>';
                    evalQs.forEach(function(q, qi) {
                        html += '<tr><td class="q">' + (qi + 1) + '. ' + esc(q) + '</td>' +
                            '<td class="score">&nbsp;</td><td class="score">&nbsp;</td><td class="score">&nbsp;</td><td class="score">&nbsp;</td><td class="score">&nbsp;</td></tr>';
                    });
                    html += '<tr><td class="q">건의사항</td><td colspan="4" style="height:48px">&nbsp;</td><td class="score">총점<br>점</td></tr></tbody></table>' +
                        '<p style="margin-top:12px;font-size:12px;">*' + esc(courseNameWithSession(session)) + '</p>' +
                        '<div class="pledge-date">' + esc(formatPledgeDate(session.training_end_date || session.training_start_date)) + '</div>' +
                        '<div class="pledge-sign">작성자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명 또는 인)</div>' +
                        '<p class="footnote">※ 원본: 업무수행평가.hwp</p>';
                } else if (docCode === 'D91') {
                    /* HWP「강의후설문조사」— 수강생 수만큼(최소 1) */
                    var surveyCount = Math.max(trainees.length, 1);
                    var satQs = [
                        '교육과정에 대해 전반적으로 만족한다.',
                        '교육 내용이 쉽게 구성되었으며, 전반적으로 이해 하였다',
                        '본 교육의 전반적인 만족도는 ?'
                    ];
                    var teacherQs = [
                        '강의 내용을 알기 쉽게 설명 했는가?',
                        '교수는 강의의 중요성을 잘 짚어주었는가?',
                        '교수가 전체적으로 분위기를 잘 이끌었는가?'
                    ];
                    var contentQs = [
                        '강의에 포함된 내용이 흥미로웠는가?',
                        '왕성한 의욕을 갖도록 동기유발을 잘 하였는가?',
                        '교육목표에 적합한 교육계획을 수립하였는가?',
                        '강의 내용이 실력향상에 도움이 되었는가?'
                    ];
                    function surveyBlock(title, qs) {
                        var h = '<p style="font-weight:800;margin:12px 0 4px;">' + title +
                            ' <span style="font-weight:600;font-size:10px;">5(매우 그렇다) 4(그렇다) 3(보통) 2(아니다) 1(매우 아니다)</span></p>' +
                            '<table class="survey-table"><thead><tr><th style="width:36px">No</th><th>문항</th><th style="width:28px">5</th><th style="width:28px">4</th><th style="width:28px">3</th><th style="width:28px">2</th><th style="width:28px">1</th></tr></thead><tbody>';
                        qs.forEach(function(q, i) {
                            h += '<tr><td>' + (i + 1) + '</td><td class="q">' + esc(q) + '</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                        });
                        return h + '</tbody></table>';
                    }
                    sheet.className = 'sheet-wrap';
                    var pages = [];
                    for (var si = 0; si < surveyCount; si++) {
                        pages.push('<section class="pledge-page">' +
                            brandHtml(session) + fundingBanner +
                            '<h1 class="doc-title">강의 후 설문지</h1>' +
                            '<p class="survey-intro">수고하셨습니다. 이 설문지는 오늘 교육과정에 대한 전반적인 사항을 객관적으로 파악하고, 이를 토대로 앞으로 교육을 하는데 기초 자료로 활용하고자 하는 것이 목적입니다. 여러분의 솔직하고 진지한 평가가 차후 보다 나은 교육으로 반영될 것입니다.</p>' +
                            '<div class="survey-meta">' +
                            '<div><strong>교육과정</strong> : ' + esc(courseNameWithSession(session)) + '</div>' +
                            '<div><strong>교육과목</strong> : ________________ / 훈련교사 - ' + esc(session.instructor_name || '') + '</div>' +
                            '<div><strong>설문작성일</strong> : ____ 년 __ 월 __ 일</div>' +
                            '</div>' +
                            surveyBlock('교육만족도', satQs) +
                            surveyBlock('솔루션 평가 및 강사 평가', teacherQs) +
                            surveyBlock('교육내용평가', contentQs) +
                            '<p style="font-weight:700;margin:8px 0 4px;">전반적인 교육 소감을 구체적으로 작성하여 주시기 바랍니다.</p>' +
                            '<div class="survey-free">&nbsp;</div>' +
                            '<p class="footnote">※ 원본: 강의후설문조사.hwp</p>' +
                        '</section>');
                    }
                    sheet.innerHTML = pages.join('');
                    maybeAutodownload();
                    return;
                } else {
                    html += '<div class="empty">이 서류 인쇄 템플릿은 아직 준비되지 않았습니다.</div>';
                }

                sheet.innerHTML = html;
                var cnt = document.getElementById('metaCount');
                if (cnt) cnt.textContent = String(trainees.length);
                maybeAutodownload();
            } catch (e) {
                sheet.innerHTML = '<div class="empty">' + esc(e.message || '오류') + '</div>';
            }
        })();
  `;

  return openingDocPrintShell(title, script);
};
