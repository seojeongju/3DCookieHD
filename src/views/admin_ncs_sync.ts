import { hrdSidebar } from './components/hrd_sidebar';

export function adminNcsSyncHtml(): string {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 데이터 동기화 관리</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Noto Sans KR', sans-serif; }</style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        ${hrdSidebar('ncs-sync')}
        <main class="flex-1 overflow-x-hidden overflow-y-auto">
            <header class="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
                <div class="px-8 py-4">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">NCS 관리</p>
                    <h1 class="text-xl font-black text-slate-800 mt-0.5">NCS 데이터 동기화</h1>
                    <p class="text-sm text-slate-600 mt-1">NCS 분류체계 및 데이터를 최신 상태로 관리합니다.</p>
                </div>
            </header>
            <div class="p-8">
                <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6">
                    <div class="mb-6 flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 mb-2">프리셋 직종 동기화</h2>
                            <p class="text-sm text-slate-600">주요 직종의 NCS 데이터를 최신 상태로 동기화합니다.</p>
                        </div>
                        <button id="btnSyncAll" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition flex items-center gap-2">
                             <i class="fas fa-layer-group"></i> 전체 순차 동기화
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="presetContainer">
                        <!-- Items injected by JS -->
                    </div>

                    <div class="mt-8 pt-8 border-t border-slate-100">
                         <h2 class="text-lg font-bold text-slate-800 mb-2">수동 동기화</h2>
                         <div class="flex gap-2 max-w-md items-center">
                            <input type="text" id="manualCode" placeholder="세분류 코드 (8자리, 예: 19031102)" class="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
                            <button id="btnManualSync" class="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition shrink-0">
                                <i class="fas fa-sync-alt mr-1"></i> 동기화
                            </button>
                         </div>
                         <p class="text-xs text-slate-400 mt-2 ml-1">※ 잘못된 코드를 입력하면 데이터가 저장되지 않습니다.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
        const PRESETS = [
            { code: '19031101', name: '3D프린터개발' },
            { code: '19031102', name: '3D프린터운용' },
            { code: '15010201', name: '기계요소설계' },
            { code: '20010202', name: '응용SW엔지니어링' }
        ];

        const presetContainer = document.getElementById('presetContainer');

        function renderPresets() {
            presetContainer.innerHTML = PRESETS.map(p => \`
                <div class="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition relative group bg-white" id="card-\${p.code}">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">\${p.code}</span>
                            <h3 class="font-bold text-slate-800 mt-1 leading-snug">\${p.name}</h3>
                        </div>
                        <div class="status-indicator w-3 h-3 rounded-full bg-slate-200" title="상태 미확인"></div>
                    </div>
                    
                    <div class="text-xs text-slate-500 mb-4 stats-text min-h-[1.5em] flex items-center gap-1">
                        <i class="fas fa-spinner fa-spin text-slate-300"></i> 조회 중...
                    </div>

                    <button onclick="sync('\${p.code}')" class="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2 btn-sync">
                        <i class="fas fa-sync-alt"></i> 데이터 동기화
                    </button>
                </div>
            \`).join('');

            updateAllStatuses();
        }

        async function updateAllStatuses() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/ncs/approved/sync/summary', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    json.data.forEach(item => {
                        updateCardUI(item.code, item.unitCount, item.elementCount);
                    });
                }
            } catch(e) { console.error('Status summary failed', e); }
        }

        async function checkStatus(code) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/ncs/approved/sync/status/' + code, {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (json.success) {
                    updateCardUI(code, json.data.unitCount, json.data.elementCount);
                }
            } catch(e) { console.error(e); }
        }

        function updateCardUI(code, unitCount, elementCount) {
            const card = document.getElementById(\`card-\${code}\`);
            if (!card) return;
            
            const statsHtml = \`
                <span class="bg-slate-50 px-2 py-0.5 rounded text-slate-600">Unit: <b>\${unitCount}</b></span>
                <span class="bg-slate-50 px-2 py-0.5 rounded text-slate-600">Elem: <b>\${elementCount}</b></span>
            \`;
            card.querySelector('.stats-text').innerHTML = statsHtml;
            
            const indicator = card.querySelector('.status-indicator');
            if (unitCount > 0) {
                indicator.classList.remove('bg-slate-200', 'bg-red-400');
                indicator.classList.add('bg-green-500');
                indicator.title = '데이터 있음';
            } else {
                indicator.classList.remove('bg-slate-200', 'bg-green-500');
                indicator.classList.add('bg-red-400');
                indicator.title = '데이터 없음';
            }
        }

        async function sync(code, silent = false) {
            if (!silent && !confirm(code + ' 데이터를 동기화하시겠습니까?\\n(공공 API 호출로 인해 약 10~30초가 소요될 수 있습니다)')) return;
            
            const card = document.getElementById('card-' + code);
            const btn = card ? card.querySelector('.btn-sync') : document.getElementById('btnManualSync');
            
            let originalContent = '';
            if(btn) {
                originalContent = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 동기화 중...';
            }

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/ncs/approved/sync', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ subClassCode: code })
                });
                const json = await res.json();
                if (json.success) {
                    if (!silent) alert('동기화 완료!\\n' + json.message);
                    checkStatus(code);
                } else {
                    if (!silent) alert('실패: ' + json.error);
                }
            } catch (e) {
                if (!silent) alert('오류 발생: ' + e);
            } finally {
                if(btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                }
            }
        }
        
        window.sync = sync;

        document.getElementById('btnSyncAll').addEventListener('click', async function() {
            if (!confirm('설정된 모든 프리셋 직종의 데이터를 동기화하시겠습니까?\\n순차적으로 진행되므로 시간이 다소 소요됩니다.')) return;
            
            this.disabled = true;
            const original = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 전체 진행 중...';
            
            for (const p of PRESETS) {
                await sync(p.code, true);
            }
            
            alert('전체 프리셋 동기화가 완료되었습니다.');
            this.disabled = false;
            this.innerHTML = original;
        });

        document.getElementById('btnManualSync').addEventListener('click', function() {
            const code = document.getElementById('manualCode').value.trim();
            if(!code || code.length !== 8) {
                alert('8자리 코드를 입력하세요.');
                return;
            }
            sync(code);
        });

        renderPresets();
    </script>
</body>
</html>
    `;
}
