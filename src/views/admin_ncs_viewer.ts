import { hrdSidebar } from './components/hrd_sidebar';

export function adminNcsViewerHtml(): string {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 분류 및 능력단위 조회 — WOW3D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .select-item.active { background-color: #eff6ff; color: #2563eb; font-weight: 700; border-right: 3px solid #2563eb; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('ncs-viewer')}

        <main class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center whitespace-nowrap">
                <div class="flex items-center gap-4">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">NCS 분류보기</h1>
                    <span id="user-badge" class="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">NAVIGATOR</span>
                </div>
                <div class="flex items-center gap-3 flex-wrap">
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input type="text" id="ncsViewerSearch" placeholder="대·중·소·직종 이름 또는 코드 검색" class="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button type="button" id="ncsViewerRefresh" class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-bold transition-colors">
                        <i class="fas fa-sync-alt" id="ncsViewerRefreshIcon"></i> 새로고침
                    </button>
                    <span class="text-sm text-slate-500 font-medium hidden sm:inline">NCS 포털 실시간 데이터 연동</span>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1400px] mx-auto space-y-8">
                    
                    <!-- 분류 선택 섹션 (전체 과정 보기: 높이 확대) -->
                    <section class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                        <div class="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
                            <!-- 대분류 -->
                            <div class="flex flex-col min-h-[380px] max-h-[55vh] md:h-[55vh]">
                                <div class="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">대분류</span>
                                    <span id="cntLarge" class="text-[10px] font-bold text-slate-400">0</span>
                                </div>
                                <div id="listLarge" class="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                                    <div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>
                                </div>
                            </div>
                            <!-- 중분류 -->
                            <div class="flex flex-col min-h-[380px] max-h-[55vh] md:h-[55vh]">
                                <div class="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">중분류</span>
                                    <span id="cntMid" class="text-[10px] font-bold text-slate-400">0</span>
                                </div>
                                <div id="listMid" class="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                                    <div class="p-10 text-center text-slate-300 text-xs font-medium">대분류를 선택하세요</div>
                                </div>
                            </div>
                            <!-- 소분류 -->
                            <div class="flex flex-col min-h-[380px] max-h-[55vh] md:h-[55vh]">
                                <div class="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">소분류</span>
                                    <span id="cntSmall" class="text-[10px] font-bold text-slate-400">0</span>
                                </div>
                                <div id="listSmall" class="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                                    <div class="p-10 text-center text-slate-300 text-xs font-medium">중분류를 선택하세요</div>
                                </div>
                            </div>
                            <!-- 세분류(직종) -->
                            <div class="flex flex-col min-h-[380px] max-h-[55vh] md:h-[55vh]">
                                <div class="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">세분류(직종)</span>
                                    <span id="cntJob" class="text-[10px] font-bold text-slate-400">0</span>
                                </div>
                                <div id="listJob" class="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                                    <div class="p-10 text-center text-slate-300 text-xs font-medium">소분류를 선택하세요</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 능력단위 목록 테이블 -->
                    <section class="space-y-4">
                        <div class="flex items-center justify-between px-2">
                            <h2 class="text-lg font-black text-slate-800 flex items-center gap-2 tracking-tight">
                                <i class="fas fa-list-ul text-blue-600"></i>
                                능력단위 목록 <span id="selectedJobName" class="text-blue-500 ml-2"></span>
                            </h2>
                            <div id="unitTotalCount" class="text-xs font-bold text-slate-400 uppercase tracking-widest">총 0개</div>
                        </div>

                        <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50/80 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th class="px-6 py-4 w-16 text-center">No</th>
                                        <th class="px-6 py-4 w-48">분류번호</th>
                                        <th class="px-6 py-4">능력단위명</th>
                                        <th class="px-6 py-4 w-24 text-center">수준</th>
                                        <th class="px-6 py-4 w-48">소분류(직종)</th>
                                        <th class="px-6 py-4 w-52">과정명</th>
                                    </tr>
                                </thead>
                                <tbody id="unitTableBody" class="divide-y divide-slate-50">
                                    <tr>
                                        <td colspan="6" class="px-6 py-20 text-center">
                                            <div class="text-slate-300 mb-2 italic">세분류(직종)를 선택하여 상시 능력단위 목록을 조회하세요.</div>
                                            <i class="fas fa-search text-slate-200 text-4xl"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>

    <script>
        (function() {
            let state = {
                large: null, largeName: '',
                mid: null, midName: '',
                small: null, smallName: '',
                job: null, jobName: ''
            };

            const listLarge = document.getElementById('listLarge');
            const listMid = document.getElementById('listMid');
            const listSmall = document.getElementById('listSmall');
            const listJob = document.getElementById('listJob');
            const unitTableBody = document.getElementById('unitTableBody');

            async function api(path, method = 'GET', body = null) {
                const token = localStorage.getItem('token');
                const options = {
                    method,
                    headers: {
                        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
                        ...(body ? { 'Content-Type': 'application/json' } : {})
                    }
                };
                if (body) options.body = JSON.stringify(body);
                
                const res = await fetch('/api/ncs' + path, { ...options });
                return await res.json();
            }

            let _midCache = [];
            let _smallCache = [];
            let _jobCache = [];
            let ncsSearchQuery = '';

            function filterBySearch(items, idKey, nameKey) {
                if (!ncsSearchQuery || !items) return items;
                const q = ncsSearchQuery.trim().toLowerCase();
                if (!q) return items;
                return items.filter(it => {
                    const id = String(it[idKey] || '').toLowerCase();
                    const name = String(it[nameKey] || '').toLowerCase();
                    return id.indexOf(q) >= 0 || name.indexOf(q) >= 0;
                });
            }
            function applyNcsFilter() {
                if (window._largeCache) {
                    const filtered = filterBySearch(window._largeCache, 'code', 'name');
                    renderList(listLarge, filtered, 'code', 'name', null, state.large);
                }
                if (_midCache.length) {
                    const filtered = filterBySearch(_midCache, 'code', 'name');
                    renderList(listMid, filtered, 'code', 'name', null, state.mid);
                }
                if (_smallCache.length) {
                    const filtered = filterBySearch(_smallCache, 'code', 'name');
                    renderList(listSmall, filtered, 'code', 'name', null, state.small);
                }
                if (_jobCache.length) {
                    const filtered = filterBySearch(_jobCache, 'code', 'name');
                    renderList(listJob, filtered, 'code', 'name', null, state.job);
                }
            }

            function renderList(el, items, idKey, nameKey, onClick, currentId) {
                if (!items || items.length === 0) {
                    el.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">데이터가 없습니다</div>';
                    document.getElementById('cnt' + el.id.replace('list', '')).textContent = '0';
                    return;
                }
                document.getElementById('cnt' + el.id.replace('list', '')).textContent = items.length;
                
                const isJob = el.id === 'listJob';

                el.innerHTML = items.map(it => {
                    const isActive = it[idKey] === currentId;
                    const synced = it.isSynced;
                    var nameVal = (it[nameKey] != null && it[nameKey] !== '') ? String(it[nameKey]).trim() : '';
                    var codeStr = it[idKey] != null ? String(it[idKey]) : '';
                    var nameEsc = (nameVal || codeStr).replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
                    var displayName = (nameVal && nameVal !== codeStr) ? (codeStr + ' ' + nameVal) : (codeStr || '-');
                    return \`
                    <div onclick="window._ncsClick('\${el.id}', '\${String(it[idKey] || '').replace(/'/g, "\\\\'")}', '\${nameEsc}')" 
                         class="select-item px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer rounded-lg transition-all flex justify-between items-center group \${isActive ? 'active' : ''}">
                        <div class="flex flex-col min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="text-[9px] font-black text-slate-400 group-hover:text-blue-400 leading-none">\${it[idKey]}</span>
                                \${isJob && synced ? '<span class="px-1 py-0.5 bg-green-100 text-green-600 text-[8px] font-black rounded uppercase">SYNCED</span>' : ''}
                            </div>
                            <span class="truncate font-medium">\${displayName}</span>
                        </div>
                        <div class="flex items-center gap-2">
                             <i class="fas fa-chevron-right text-[10px] text-slate-300 group-hover:text-blue-400"></i>
                        </div>
                    </div>
                \`;}).join('');
            }



            window._ncsClick = async function(listId, id, name) {
                if (listId === 'listLarge') {
                    state.large = id; state.largeName = name;
                    state.mid = null; state.midName = '';
                    state.small = null; state.smallName = '';
                    state.job = null; state.jobName = '';
                    listMid.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';
                    listSmall.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">중분류를 선택하세요</div>';
                    listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs text-center">소분류를 선택하세요</div>';
                    
                    const res = await api('/approved/classification?ncsLclasCd=' + id);
                    if (res.success) {
                        const mids = [];
                        const seen = new Set();
                        res.data.forEach(d => {
                            if (d.midCode && !seen.has(d.midCode)) {
                                seen.add(d.midCode);
                                mids.push({ code: d.midCode, name: d.midName });
                            }
                        });
                        _midCache = mids;
                        const largeFiltered = filterBySearch(window._largeCache, 'code', 'name');
                        renderList(listLarge, largeFiltered, 'code', 'name', null, state.large);
                        renderList(listMid, filterBySearch(mids, 'code', 'name'), 'code', 'name', null, state.mid);
                    }
                } else if (listId === 'listMid') {
                    state.mid = id; state.midName = name;
                    state.small = null; state.smallName = '';
                    state.job = null; state.jobName = '';
                    listSmall.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';
                    listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">소분류를 선택하세요</div>';

                    const res = await api('/approved/classification?ncsLclasCd=' + state.large);
                    if (res.success) {
                        const smalls = [];
                        const seen = new Set();
                        res.data.filter(d => d.midCode === id).forEach(d => {
                            if (d.smallCode && !seen.has(d.smallCode)) {
                                seen.add(d.smallCode);
                                smalls.push({ code: d.smallCode, name: d.smallName });
                            }
                        });
                        _smallCache = smalls;
                        const mids = [];
                        const seen2 = new Set();
                        res.data.forEach(d => {
                            if (d.midCode && !seen2.has(d.midCode)) {
                                seen2.add(d.midCode);
                                mids.push({ code: d.midCode, name: d.midName });
                            }
                        });
                        _midCache = mids;
                        renderList(listSmall, filterBySearch(smalls, 'code', 'name'), 'code', 'name', null, state.small);
                        renderList(listMid, filterBySearch(mids, 'code', 'name'), 'code', 'name', null, state.mid);
                    }
                } else if (listId === 'listSmall') {
                    state.small = id; state.smallName = name;
                    state.job = null; state.jobName = '';
                    listJob.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';

                    const res = await api('/approved/jobs?l=' + state.large + '&m=' + state.mid + '&s=' + id);
                    if (res.success) {
                        _jobCache = res.data;
                        renderList(listJob, filterBySearch(res.data, 'code', 'name'), 'code', 'name', null, state.job);
                        const resC = await api('/approved/classification?ncsLclasCd=' + state.large);
                        const smalls = [];
                        const seen = new Set();
                        resC.data.filter(d => d.midCode === state.mid).forEach(d => {
                            if (d.smallCode && !seen.has(d.smallCode)) {
                                seen.add(d.smallCode);
                                smalls.push({ code: d.smallCode, name: d.smallName });
                            }
                        });
                        _smallCache = smalls;
                        renderList(listSmall, filterBySearch(smalls, 'code', 'name'), 'code', 'name', null, state.small);
                    }
                } else if (listId === 'listJob') {
                    state.job = id; state.jobName = name;
                    const fullJobCode = state.large + state.mid + state.small + id;
                    loadUnits(fullJobCode, name);
                    const resJ = await api('/approved/jobs?l=' + state.large + '&m=' + state.mid + '&s=' + state.small);
                    _jobCache = resJ.data || [];
                    renderList(listJob, filterBySearch(_jobCache, 'code', 'name'), 'code', 'name', null, state.job);
                }
            };

            async function loadUnits(jobCode, jobName) {
                document.getElementById('selectedJobName').textContent = ' > ' + jobName;
                unitTableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-20 text-center"><i class="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i><br><span class="text-slate-400">능력단위를 불러오는 중...</span></td></tr>';
                
                const res = await api('/approved/units-by-job?jobCode=' + jobCode);
                if (res.success) {
                    const units = res.data;
                    document.getElementById('unitTotalCount').textContent = '총 ' + units.length + '개';
                    if (units.length === 0) {
                        unitTableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-20 text-center text-slate-400 italic">조회된 능력단위가 없습니다. 직접 등록이 필요할 수 있습니다.</td></tr>';
                        return;
                    }
                    unitTableBody.innerHTML = units.map((u, idx) => {
                        const courseTitles = (u.course_titles && Array.isArray(u.course_titles)) ? u.course_titles : [];
                        const courseNamesText = courseTitles.length > 0 ? courseTitles.join(', ') : '-';
                        return \`
                        <tr class="hover:bg-slate-50 transition-colors group">
                            <td class="px-6 py-4 text-center text-slate-400 font-bold">\${idx + 1}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-tight font-mono">\${u.code}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-800">\${u.name}</div>
                                \${u.elements ? \`<div class="mt-2 flex flex-wrap gap-1">\${u.elements.slice(0, 3).map(e => \`<span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-medium">\${e.name}</span>\`).join('')}\${u.elements.length > 3 ? '<span class="text-[9px] text-slate-300">...</span>' : ''}</div>\` : ''}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black">\${u.level}수준</span>
                            </td>
                            <td class="px-6 py-4 text-slate-500 text-sm font-medium">\${jobName}</td>
                            <td class="px-6 py-4 text-slate-600 text-sm">\${courseNamesText}</td>
                        </tr>
                    \`;}).join('');
                } else {
                    unitTableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-20 text-center text-red-400">오류가 발생했습니다: ' + res.error + '</td></tr>';
                }
            }

            async function init() {
                const res = await api('/approved/large-classes');
                if (res.success) {
                    window._largeCache = res.data;
                    renderList(listLarge, filterBySearch(res.data, 'code', 'name'), 'code', 'name', null, state.large);
                }
            }

            /** 새로고침: 대분류부터 다시 불러온 뒤, 기존 선택 경로가 있으면 복원 */
            async function refresh() {
                const btn = document.getElementById('ncsViewerRefresh');
                const icon = document.getElementById('ncsViewerRefreshIcon');
                if (btn.disabled) return;
                const saved = { ...state };
                btn.disabled = true;
                if (icon) icon.classList.add('fa-spin');

                try {
                    await init();
                    if (saved.large) {
                        listMid.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';
                        const res = await api('/approved/classification?ncsLclasCd=' + saved.large);
                        if (res.success) {
                            const mids = [];
                            const seen = new Set();
                            res.data.forEach(d => {
                                if (d.midCode && !seen.has(d.midCode)) {
                                    seen.add(d.midCode);
                                    mids.push({ code: d.midCode, name: d.midName });
                                }
                            });
                            _midCache = mids;
                            renderList(listMid, filterBySearch(mids, 'code', 'name'), 'code', 'name', null, saved.mid);
                            if (saved.mid) {
                                listSmall.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';
                                const smalls = [];
                                const seenS = new Set();
                                res.data.filter(d => d.midCode === saved.mid).forEach(d => {
                                    if (d.smallCode && !seenS.has(d.smallCode)) {
                                        seenS.add(d.smallCode);
                                        smalls.push({ code: d.smallCode, name: d.smallName });
                                    }
                                });
                                _smallCache = smalls;
                                renderList(listSmall, filterBySearch(smalls, 'code', 'name'), 'code', 'name', null, saved.small);
                                if (saved.small) {
                                    listJob.innerHTML = '<div class="p-8 text-center text-slate-300"><i class="fas fa-spinner fa-spin"></i></div>';
                                    const resJ = await api('/approved/jobs?l=' + saved.large + '&m=' + saved.mid + '&s=' + saved.small);
                                    if (resJ.success) {
                                        _jobCache = resJ.data || [];
                                        renderList(listJob, filterBySearch(_jobCache, 'code', 'name'), 'code', 'name', null, saved.job);
                                        if (saved.job && saved.jobName) {
                                            const fullJobCode = saved.large + saved.mid + saved.small + saved.job;
                                            await loadUnits(fullJobCode, saved.jobName);
                                        } else {
                                            listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">소분류를 선택하세요</div>';
                                            document.getElementById('cntJob').textContent = '0';
                                        }
                                    }
                                } else {
                                    listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">소분류를 선택하세요</div>';
                                    document.getElementById('cntJob').textContent = '0';
                                }
                            } else {
                                listSmall.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">중분류를 선택하세요</div>';
                                listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">소분류를 선택하세요</div>';
                                document.getElementById('cntSmall').textContent = '0';
                                document.getElementById('cntJob').textContent = '0';
                            }
                        }
                    } else {
                        listMid.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">대분류를 선택하세요</div>';
                        listSmall.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">중분류를 선택하세요</div>';
                        listJob.innerHTML = '<div class="p-10 text-center text-slate-300 text-xs">소분류를 선택하세요</div>';
                        document.getElementById('cntMid').textContent = '0';
                        document.getElementById('cntSmall').textContent = '0';
                        document.getElementById('cntJob').textContent = '0';
                        unitTableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-20 text-center"><div class="text-slate-300 mb-2 italic">세분류(직종)를 선택하여 상시 능력단위 목록을 조회하세요.</div><i class="fas fa-search text-slate-200 text-4xl"></i></td></tr>';
                        document.getElementById('selectedJobName').textContent = '';
                        document.getElementById('unitTotalCount').textContent = '총 0개';
                    }
                } finally {
                    btn.disabled = false;
                    if (icon) icon.classList.remove('fa-spin');
                }
            }

            init();

            document.getElementById('ncsViewerRefresh').addEventListener('click', refresh);
            document.getElementById('ncsViewerSearch').addEventListener('input', function() {
                ncsSearchQuery = this.value;
                applyNcsFilter();
            });
        })();
    </script>
</body>
</html>
    `;
}
