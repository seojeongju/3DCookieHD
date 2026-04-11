import { hrdSidebar } from './components/hrd_sidebar';

/**
 * NCS 분류보기 — 국가직무능력표준(ncs.go.kr) NCS 정보 보기·분류보기 UI에 맞춘 조회 화면
 * 좌측: 정보 유형 메뉴 / 우측: 대·중·소 선택 → 검색 → 직무별 rowspan 표, 펼침 시 능력단위(분류번호·명)
 */
export function adminNcsViewerHtml(): string {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 분류보기 — WOW3D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif; }
        .ncs-portal-nav a.active { background: #2563eb; color: #fff; }
        .ncs-portal-nav a:not(.active):hover { background: #eff6ff; color: #1d4ed8; }
        .ncs-table-wrap { border: 1px solid #c5d4e5; }
        .ncs-thead { background: linear-gradient(180deg, #1e4a6e 0%, #163a58 100%); color: #fff; }
        .ncs-thead th { font-weight: 700; font-size: 13px; padding: 12px 10px; border-right: 1px solid rgba(255,255,255,.15); }
        .ncs-thead th:last-child { border-right: none; }
        .ncs-tbody td { border: 1px solid #e2e8f0; font-size: 13px; vertical-align: middle; }
        .ncs-tbody tr:hover:not(.ncs-detail-row) { background: #f8fafc; }
        .ncs-detail-row td { background: #f1f5f9; padding: 0 !important; }
        .ncs-inner-table th { background: #e8f0f8; color: #1e3a5f; font-size: 12px; padding: 8px 10px; border: 1px solid #cbd5e1; }
        .ncs-inner-table td { border: 1px solid #e2e8f0; padding: 8px 10px; font-size: 12px; }
        .ncs-badge { font-family: ui-monospace, monospace; font-size: 11px; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    </style>
</head>
<body class="bg-slate-100 text-slate-900 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('ncs-viewer')}

        <div class="flex flex-1 min-w-0 min-h-0 flex-col md:flex-row">
            <!-- 국가표준 스타일: 좌측 NCS 정보 유형 메뉴 -->
            <aside class="w-full md:w-[220px] shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
                <div class="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NCS 정보 보기</p>
                </div>
                <nav class="ncs-portal-nav flex md:flex-col gap-1 p-2 overflow-x-auto md:overflow-y-auto custom-scrollbar text-sm">
                    <a href="/admin/ncs/viewer" class="active whitespace-nowrap rounded-lg px-3 py-2.5 font-bold transition">NCS 분류보기</a>
                    <a href="/admin/ncs/viewer#keyword" class="text-slate-600 whitespace-nowrap rounded-lg px-3 py-2.5 font-medium transition" title="추후 연동">키워드</a>
                    <a href="/admin/ncs/viewer#code" class="text-slate-600 whitespace-nowrap rounded-lg px-3 py-2.5 font-medium transition" title="추후 연동">코드</a>
                    <a href="/admin/ncs/viewer#print" class="text-slate-600 whitespace-nowrap rounded-lg px-3 py-2.5 font-medium transition" title="추후 연동">직무기술서 출력</a>
                </nav>
                <div class="hidden md:block mt-auto p-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                    출처: <a href="https://www.ncs.go.kr" target="_blank" rel="noopener" class="text-blue-600 hover:underline">국가직무능력표준 ncs.go.kr</a>
                </div>
            </aside>

            <main class="flex-1 flex flex-col overflow-hidden min-w-0">
                <header class="bg-white border-b border-slate-200 shadow-sm px-4 md:px-6 py-3 md:py-4 shrink-0">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <h1 class="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">NCS 분류보기</h1>
                        <p class="text-[11px] text-slate-500">
                            내부 DB·분류 API · <a href="https://www.ncs.go.kr/index.do" target="_blank" rel="noopener" class="text-blue-600 hover:underline">ncs.go.kr</a> 체계
                        </p>
                    </div>
                </header>

                <!-- 필터: 대·중·소 + 직무 필터 + 검색 + 엑셀 -->
                <div class="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 shrink-0">
                    <div class="flex flex-col xl:flex-row xl:items-end gap-3 md:gap-4 flex-wrap">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-w-0">
                            <label class="block">
                                <span class="block text-[11px] font-bold text-slate-600 mb-1">대분류</span>
                                <select id="ncsSelLarge" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                    <option value="">선택</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="block text-[11px] font-bold text-slate-600 mb-1">중분류</span>
                                <select id="ncsSelMid" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" disabled>
                                    <option value="">대분류 선택</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="block text-[11px] font-bold text-slate-600 mb-1">소분류</span>
                                <select id="ncsSelSmall" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" disabled>
                                    <option value="">중분류 선택</option>
                                </select>
                            </label>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input type="text" id="ncsFilterKeyword" placeholder="직무명·코드 필터" class="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-44 md:w-48 focus:ring-2 focus:ring-blue-500 outline-none">
                            </div>
                            <button type="button" id="ncsBtnSearch" class="inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition">
                                <i class="fas fa-search"></i> 검색하기
                            </button>
                            <button type="button" id="ncsBtnExcel" class="inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#163a58] hover:bg-[#0f2d44] shadow-sm transition">
                                <i class="fas fa-file-excel"></i> 엑셀 다운로드
                            </button>
                            <button type="button" id="ncsBtnRefresh" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                                <i class="fas fa-sync-alt" id="ncsRefreshIcon"></i> 새로고침
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 통합 표 -->
                <div class="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6">
                    <div class="max-w-[1600px] mx-auto">
                        <div class="bg-white rounded-lg shadow-sm ncs-table-wrap overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full border-collapse min-w-[900px]">
                                    <thead class="ncs-thead">
                                        <tr>
                                            <th class="text-left w-[14%]">대분류</th>
                                            <th class="text-left w-[14%]">중분류</th>
                                            <th class="text-left w-[14%]">소분류</th>
                                            <th class="text-left w-[22%]">소분류(직무)</th>
                                            <th class="text-center w-[10%]">NCS</th>
                                            <th class="text-center w-[12%]">학습모듈</th>
                                            <th class="text-center w-[14%] w-min">펼침</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ncsMainTbody" class="ncs-tbody text-slate-800">
                                        <tr>
                                            <td colspan="7" class="px-6 py-16 text-center text-slate-400">
                                                <i class="fas fa-layer-group text-3xl mb-3 block text-slate-300"></i>
                                                <p class="text-sm">대·중·소분류를 선택한 뒤 <strong class="text-slate-600">검색하기</strong>를 눌러 주세요.</p>
                                                <p class="text-xs mt-2 text-slate-400">직무 행의 <i class="fas fa-plus text-blue-500"></i> 로 능력단위(분류번호·능력단위명)를 확인할 수 있습니다.</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-3 px-1">
                            ※ 분류번호(능력단위) 형식: 10자리 숫자_개발연도2자리v버전 (예: 1903110201_15v1)
                        </p>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        (function() {
            var selL = document.getElementById('ncsSelLarge');
            var selM = document.getElementById('ncsSelMid');
            var selS = document.getElementById('ncsSelSmall');
            var tbody = document.getElementById('ncsMainTbody');
            var keywordEl = document.getElementById('ncsFilterKeyword');

            var state = {
                large: '', largeName: '',
                mid: '', midName: '',
                small: '', smallName: '',
                jobs: [],
                jobsFull: [],
                unitsCache: {},
                classRes: null
            };

            function api(path, method, body) {
                var token = localStorage.getItem('token');
                var opt = { method: method || 'GET', headers: {} };
                if (token) opt.headers['Authorization'] = 'Bearer ' + token;
                if (body) {
                    opt.headers['Content-Type'] = 'application/json';
                    opt.body = JSON.stringify(body);
                }
                return fetch('/api/ncs' + path, opt).then(function(r) { return r.json(); });
            }

            function esc(s) {
                if (s == null) return '';
                return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
            }

            function moduleYearFromCode(code) {
                var m = String(code || '').match(/_([0-9]{2})v/i);
                if (!m) return '-';
                var yy = parseInt(m[1], 10);
                if (isNaN(yy)) return '-';
                return (yy > 50 ? '19' : '20') + String(yy).padStart(2, '0');
            }

            function fillSelect(sel, items, placeholder, valueKey, labelFn) {
                var v = sel.value;
                sel.innerHTML = '<option value="">' + esc(placeholder) + '</option>';
                (items || []).forEach(function(it) {
                    var val = it[valueKey];
                    var opt = document.createElement('option');
                    opt.value = val;
                    opt.textContent = labelFn(it);
                    sel.appendChild(opt);
                });
                sel.value = v;
            }

            async function loadLarge() {
                var res = await api('/approved/large-classes');
                if (res.success && res.data) {
                    fillSelect(selL, res.data, '선택', 'code', function(it) {
                        return it.code + '. ' + (it.name || '');
                    });
                }
            }

            async function loadMidLarge(ncsLclasCd) {
                selM.innerHTML = '<option value="">불러오는 중…</option>';
                selM.disabled = true;
                var res = await api('/approved/classification?ncsLclasCd=' + encodeURIComponent(ncsLclasCd));
                state.classRes = res.success ? res.data : null;
                selM.disabled = false;
                if (!res.success || !res.data) {
                    selM.innerHTML = '<option value="">오류</option>';
                    return;
                }
                var mids = [];
                var seen = {};
                res.data.forEach(function(d) {
                    if (d.midCode && !seen[d.midCode]) {
                        seen[d.midCode] = true;
                        var mn = (d.midName && String(d.midName).trim() && String(d.midName).trim() !== String(d.midCode)) ? d.midName : ('중분류 ' + d.midCode);
                        mids.push({ code: d.midCode, name: mn });
                    }
                });
                fillSelect(selM, mids, '선택', 'code', function(it) { return it.code + '. ' + it.name; });
            }

            function loadSmallForMid(midCode) {
                if (!state.classRes) return;
                var smalls = [];
                var seen = {};
                state.classRes.filter(function(d) { return d.midCode === midCode; }).forEach(function(d) {
                    if (d.smallCode && !seen[d.smallCode]) {
                        seen[d.smallCode] = true;
                        var sn = (d.smallName && String(d.smallName).trim() && String(d.smallName).trim() !== String(d.smallCode)) ? d.smallName : ('소분류 ' + d.smallCode);
                        smalls.push({ code: d.smallCode, name: sn });
                    }
                });
                selS.disabled = false;
                fillSelect(selS, smalls, '선택', 'code', function(it) { return it.code + '. ' + it.name; });
            }

            selL.addEventListener('change', function() {
                state.mid = ''; state.small = ''; state.classRes = null;
                selS.innerHTML = '<option value="">중분류 선택</option>';
                selS.disabled = true;
                if (!selL.value) {
                    selM.innerHTML = '<option value="">대분류 선택</option>';
                    selM.disabled = true;
                    return;
                }
                selM.disabled = false;
                loadMidLarge(selL.value);
            });

            selM.addEventListener('change', function() {
                state.small = '';
                if (!selM.value) {
                    selS.innerHTML = '<option value="">중분류 선택</option>';
                    selS.disabled = true;
                    return;
                }
                loadSmallForMid(selM.value);
            });

            function filterJobs(jobs) {
                var q = (keywordEl.value || '').trim().toLowerCase();
                if (!q) return jobs.slice();
                return jobs.filter(function(j) {
                    var c = String(j.code || '').toLowerCase();
                    var n = String(j.name || '').toLowerCase();
                    return c.indexOf(q) >= 0 || n.indexOf(q) >= 0;
                });
            }

            function renderEmpty(msg) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-14 text-center text-slate-400 text-sm">' + esc(msg) + '</td></tr>';
            }

            function renderJobTable() {
                state.jobs = filterJobs(state.jobsFull);
                if (state.jobs.length === 0) {
                    renderEmpty(state.jobsFull.length ? '필터에 맞는 직무가 없습니다.' : '조건에 맞는 직무가 없습니다.');
                    return;
                }
                var n = state.jobs.length;
                var lHtml = '<td rowspan="' + n + '" class="px-3 py-3 align-top bg-white font-semibold text-slate-800">' + esc(state.largeName) + '</td>';
                var mHtml = '<td rowspan="' + n + '" class="px-3 py-3 align-top bg-white font-semibold text-slate-800">' + esc(state.midName) + '</td>';
                var sHtml = '<td rowspan="' + n + '" class="px-3 py-3 align-top bg-white font-semibold text-slate-800">' + esc(state.smallName) + '</td>';
                var html = '';
                state.jobs.forEach(function(j, idx) {
                    var jobLabel = esc(j.code) + '. ' + esc(j.name);
                    html += '<tr>';
                    if (idx === 0) html += lHtml + mHtml + sHtml;
                    html += '<td class="px-3 py-3"><span class="font-medium text-slate-800">' + jobLabel + '</span></td>';
                    html += '<td class="px-2 py-3 text-center"><span class="text-slate-500 text-xs">—</span></td>';
                    html += '<td class="px-2 py-3 text-center text-sm text-slate-600"><span class="text-slate-400">펼침 참조</span></td>';
                    html += '<td class="px-2 py-3 text-center"><button type="button" id="ncs-exp-' + idx + '" onclick="window._ncsToggle(' + idx + ')" class="w-9 h-9 rounded border border-slate-200 bg-white hover:bg-blue-50" title="능력단위 보기"><i class="fas fa-plus text-blue-600"></i></button></td>';
                    html += '</tr>';
                    html += '<tr id="ncs-detail-' + idx + '" class="ncs-detail-row hidden" data-open="0"><td colspan="7" class="border-t-0"><div class="ncs-inner-wrap px-4 py-3"></div></td></tr>';
                });
                tbody.innerHTML = html;
            }

            window._ncsToggle = async function(jobIdx) {
                var j = state.jobs[jobIdx];
                if (!j) return;
                var fullCode = j.fullJobCode;
                var rowDetail = document.getElementById('ncs-detail-' + jobIdx);
                var btn = document.getElementById('ncs-exp-' + jobIdx);
                if (!rowDetail || !btn) return;

                var open = rowDetail.getAttribute('data-open') === '1';
                if (open) {
                    rowDetail.setAttribute('data-open', '0');
                    rowDetail.classList.add('hidden');
                    btn.innerHTML = '<i class="fas fa-plus text-blue-600"></i>';
                    return;
                }

                if (!state.unitsCache[fullCode]) {
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-slate-500"></i>';
                    var res = await api('/approved/units-by-job?jobCode=' + encodeURIComponent(fullCode));
                    if (!res.success) {
                        btn.innerHTML = '<i class="fas fa-plus text-blue-600"></i>';
                        rowDetail.querySelector('.ncs-inner-wrap').innerHTML = '<p class="p-4 text-red-500 text-sm">불러오기 실패</p>';
                        rowDetail.classList.remove('hidden');
                        rowDetail.setAttribute('data-open', '1');
                        return;
                    }
                    state.unitsCache[fullCode] = res.data || [];
                }

                var units = state.unitsCache[fullCode];
                var inner = '<table class="w-full ncs-inner-table border-collapse"><thead><tr>' +
                    '<th class="w-[38%]">분류번호</th><th class="w-[42%]">능력단위명</th><th class="w-[10%]">수준</th><th class="w-[10%]">학습모듈</th></tr></thead><tbody>';
                if (units.length === 0) {
                    inner += '<tr><td colspan="4" class="text-center text-slate-400 py-6">등록된 능력단위가 없습니다.</td></tr>';
                } else {
                    units.forEach(function(u) {
                        inner += '<tr><td class="ncs-badge text-slate-700">' + esc(u.code) + '</td><td class="font-medium">' + esc(u.name) + '</td>' +
                            '<td class="text-center">' + esc(u.level) + '</td><td class="text-center">' + esc(moduleYearFromCode(u.code)) + '</td></tr>';
                    });
                }
                inner += '</tbody></table>';
                rowDetail.querySelector('.ncs-inner-wrap').innerHTML = inner;
                rowDetail.classList.remove('hidden');
                rowDetail.setAttribute('data-open', '1');
                btn.innerHTML = '<i class="fas fa-minus text-blue-600"></i>';
            };

            async function runSearch() {
                var l = selL.value;
                var m = selM.value;
                var s = selS.value;
                if (!l || !m || !s) {
                    alert('대분류·중분류·소분류를 모두 선택해 주세요.');
                    return;
                }

                state.large = l;
                state.mid = m;
                state.small = s;
                state.largeName = selL.options[selL.selectedIndex] ? selL.options[selL.selectedIndex].text : '';
                state.midName = selM.options[selM.selectedIndex] ? selM.options[selM.selectedIndex].text : '';
                state.smallName = selS.options[selS.selectedIndex] ? selS.options[selS.selectedIndex].text : '';

                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500"><i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i><p class="mt-2 text-sm">직무 목록을 불러오는 중…</p></td></tr>';

                var res = await api('/approved/jobs?l=' + encodeURIComponent(l) + '&m=' + encodeURIComponent(m) + '&s=' + encodeURIComponent(s));
                if (!res.success || !res.data) {
                    renderEmpty('직무 목록을 불러오지 못했습니다.');
                    state.jobs = [];
                    state.jobsFull = [];
                    return;
                }

                state.jobsFull = res.data.map(function(j) {
                    return {
                        code: j.code,
                        name: j.name || '',
                        fullJobCode: l + m + s + j.code
                    };
                });
                state.unitsCache = {};
                renderJobTable();
            }

            async function exportExcel() {
                if (!state.jobsFull || state.jobsFull.length === 0) {
                    alert('먼저 검색하여 직무 목록을 불러오세요.');
                    return;
                }
                var rows = [];
                rows.push(['대분류', '중분류', '소분류', '직종코드', '직종명(세분류)', '분류번호', '능력단위명', '수준', '학습모듈(연도)']);
                var lN = state.largeName, mN = state.midName, sN = state.smallName;

                for (var i = 0; i < state.jobsFull.length; i++) {
                    var j = state.jobsFull[i];
                    var fc = j.fullJobCode;
                    if (!state.unitsCache[fc]) {
                        var res = await api('/approved/units-by-job?jobCode=' + encodeURIComponent(fc));
                        state.unitsCache[fc] = res.success ? (res.data || []) : [];
                    }
                    var units = state.unitsCache[fc];
                    if (units.length === 0) {
                        rows.push([lN, mN, sN, j.code, j.name, '', '', '', '']);
                    } else {
                        units.forEach(function(u) {
                            rows.push([lN, mN, sN, j.code, j.name, u.code || '', u.name || '', String(u.level != null ? u.level : ''), moduleYearFromCode(u.code)]);
                        });
                    }
                }

                var csv = rows.map(function(r) {
                    return r.map(function(cell) {
                        var t = String(cell == null ? '' : cell).replace(/"/g, '""');
                        if (/[",\\n\\r]/.test(t)) return '"' + t + '"';
                        return t;
                    }).join(',');
                }).join('\\r\\n');
                var blob = new Blob([String.fromCharCode(0xfeff) + csv], { type: 'text/csv;charset=utf-8;' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'ncs_classification_' + (state.large || 'export') + '_' + Date.now() + '.csv';
                a.click();
                URL.revokeObjectURL(a.href);
            }

            document.getElementById('ncsBtnSearch').addEventListener('click', runSearch);
            document.getElementById('ncsBtnExcel').addEventListener('click', exportExcel);
            document.getElementById('ncsBtnRefresh').addEventListener('click', async function() {
                var icon = document.getElementById('ncsRefreshIcon');
                var btn = document.getElementById('ncsBtnRefresh');
                btn.disabled = true;
                if (icon) icon.classList.add('fa-spin');
                await loadLarge();
                selM.innerHTML = '<option value="">대분류 선택</option>';
                selM.disabled = true;
                selS.innerHTML = '<option value="">중분류 선택</option>';
                selS.disabled = true;
                state.jobs = [];
                state.jobsFull = [];
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-16 text-center text-slate-400"><p class="text-sm">대·중·소분류를 선택한 뒤 검색하기를 눌러 주세요.</p></td></tr>';
                btn.disabled = false;
                if (icon) icon.classList.remove('fa-spin');
            });

            var _kwTimer;
            keywordEl.addEventListener('input', function() {
                clearTimeout(_kwTimer);
                _kwTimer = setTimeout(function() {
                    if (state.jobsFull && state.jobsFull.length) renderJobTable();
                }, 200);
            });

            loadLarge();
        })();
    </script>
</body>
</html>
    `;
}
