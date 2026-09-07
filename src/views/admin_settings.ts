
import { hrdSidebar } from './components/hrd_sidebar';

export const adminSettingsHtml = (sidebarHtml?: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련기관 정보설정 - 관리자 설정</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-[100dvh] overflow-hidden">
        ${sidebarHtml || hrdSidebar('settings')}

        <main class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">훈련기관 정보설정</h1>
                    <span class="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">SETTINGS</span>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-8 relative z-10">
                <div class="max-w-4xl mx-auto">
                    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="p-8 border-b border-slate-200/60 bg-slate-50/50">
                            <h2 class="text-lg font-black text-slate-800">기본 정보 설정</h2>
                            <p class="text-sm text-slate-500 mt-1">훈련일지 및 문서 출력물에 사용될 훈련기관 정보를 설정합니다.</p>
                        </div>
                        
                        <div class="p-8 space-y-8">
                            <!-- 기관 명칭 설정 -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">훈련기관명</label>
                                    <p class="text-xs text-slate-500 leading-relaxed">훈련일지에 표시되는 공식 기관 명칭입니다.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <div class="relative group">
                                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i class="fas fa-university text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        </div>
                                        <input type="text" id="institutionNameInput" 
                                            class="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                            placeholder="예: 쓰리디쿠키 홍대센터">
                                    </div>
                                </div>
                            </div>

                            <!-- 카카오맵 JavaScript 키 (오시는길 페이지) -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-6 border-t border-slate-100">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">카카오맵 JavaScript 키</label>
                                    <p class="text-xs text-slate-500 leading-relaxed">오시는길(<a href="/locations" target="_blank" class="text-indigo-600 font-semibold hover:underline">/locations</a>) 지도 표시용. <strong class="font-bold text-slate-600">JavaScript 키</strong>만 입력하세요 (REST API 키 아님).</p>
                                    <p id="kakaoMapKeyStatus" class="mt-2 text-xs font-bold hidden"></p>
                                </div>
                                <div class="md:col-span-2 space-y-3">
                                    <div class="relative group">
                                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i class="fas fa-map-marked-alt text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        </div>
                                        <input type="text" id="kakaoMapAppkeyInput" autocomplete="off"
                                            class="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-mono text-sm text-slate-800"
                                            placeholder="카카오 디벨로퍼스 JavaScript 키 붙여넣기">
                                    </div>
                                    <a href="/locations" target="_blank" class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                                        <i class="fas fa-external-link-alt"></i> 오시는길에서 지도 확인
                                    </a>
                                </div>
                            </div>

                            <!-- OpenAI API 키 (AI 문제 생성 등) -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-6 border-t border-slate-100">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">OpenAI API 키</label>
                                    <p class="text-xs text-slate-500 leading-relaxed">문제은행의 AI 문제 생성(PDF) 기능에 사용됩니다. OpenAI 플랫폼에서 API 키를 발급받아 입력하세요. 새 키를 입력하면 기존 키를 대체합니다.</p>
                                </div>
                                <div class="md:col-span-2 space-y-2">
                                    <p id="openaiKeyStatus" class="text-xs text-slate-500 hidden"><span class="font-medium text-slate-600">현재 설정됨</span> (마지막 4자: <span id="openaiKeyMasked" class="font-mono"></span>)</p>
                                    <div class="relative group">
                                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i class="fas fa-key text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        </div>
                                        <input type="password" id="openaiApiKeyInput" autocomplete="off"
                                            class="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-mono text-sm text-slate-800"
                                            placeholder="새 키를 입력하면 기존 키를 대체합니다 (비워두면 유지)">
                                    </div>
                                </div>
                            </div>

                            <div class="pt-6 border-t border-slate-100 flex justify-end">
                                <button onclick="saveSettings()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group">
                                    <i class="fas fa-save group-hover:scale-110 transition-transform"></i>
                                    변경사항 저장하기
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 카카오맵 설정 가이드 -->
                    <div class="mt-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="p-8 border-b border-slate-200/60 bg-sky-50/80">
                            <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                                <i class="fas fa-map-marked-alt text-sky-600"></i>
                                카카오맵 API 설정 가이드
                            </h2>
                            <p class="text-sm text-slate-500 mt-1">지도가 안 보이면 대부분 <strong class="font-bold text-slate-700">JavaScript 키</strong> 또는 <strong class="font-bold text-slate-700">SDK 도메인 미등록</strong>입니다.</p>
                        </div>
                        <div class="p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
                            <ol class="space-y-4 list-decimal ml-5">
                                <li>
                                    <a href="https://developers.kakao.com/" target="_blank" rel="noopener" class="font-bold text-sky-700 hover:underline">카카오 디벨로퍼스</a>에 로그인 후
                                    <strong class="font-bold">내 애플리케이션</strong>에서 앱을 생성하거나 기존 앱을 선택합니다.
                                </li>
                                <li>
                                    좌측 <strong class="font-bold">제품 설정 → 카카오맵</strong>에서 사용 설정을 <strong class="font-bold text-emerald-700">ON</strong>으로 켭니다.
                                </li>
                                <li>
                                    <strong class="font-bold">앱 → 플랫폼 키 → JavaScript 키</strong>를 연 뒤 키 값을 복사해 위 입력란에 붙여넣고 저장합니다.
                                    <span class="block text-xs text-slate-500 mt-1">※ REST API 키·네이티브 앱 키가 아니라 JavaScript 키여야 합니다.</span>
                                </li>
                                <li>
                                    같은 JavaScript 키 상세의 <strong class="font-bold">JavaScript SDK 도메인</strong>에 아래 주소를 모두 등록합니다.
                                    <ul id="kakaoDomainChecklist" class="mt-3 space-y-2 font-mono text-xs bg-slate-50 rounded-2xl border border-slate-200 p-4">
                                        <li class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>https://3dcookiehd.com</span></li>
                                        <li class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>https://www.3dcookiehd.com</span></li>
                                        <li class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>http://localhost:5173</span> <span class="text-slate-400 font-sans">(로컬 개발 시)</span></li>
                                        <li class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>http://127.0.0.1:5173</span></li>
                                        <li class="flex items-start gap-2 text-slate-500"><i class="fas fa-info-circle text-sky-500 mt-0.5"></i><span class="font-sans">Cloudflare Pages 미리보기 도메인(<code class="bg-white px-1 rounded">*.pages.dev</code>)도 사용 중이면 해당 Origin을 추가하세요.</span></li>
                                    </ul>
                                </li>
                                <li>
                                    저장 후 <a href="/locations" target="_blank" class="font-bold text-sky-700 hover:underline">오시는길</a>을 새로고침해 지도를 확인합니다.
                                    도메인 반영까지 수 분이 걸릴 수 있습니다.
                                </li>
                            </ol>
                            <p class="text-xs text-slate-500 border-t border-slate-100 pt-4">
                                참고: 도메인 등록 위치가 예전 <em>앱 → 플랫폼 → Web</em>에서
                                <strong class="font-bold text-slate-700">앱 → 플랫폼 키 → JavaScript 키 → JavaScript SDK 도메인</strong>으로 변경되었습니다.
                            </p>
                        </div>
                    </div>

                    <!-- 안내 카드 -->
                    <div class="mt-8 bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex gap-6">
                        <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <i class="fas fa-info-circle text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-amber-900 mb-1">유의사항</h3>
                            <ul class="text-sm text-amber-800/80 space-y-1 ml-4 list-disc">
                                <li>훈련기관명을 변경하면 기존에 작성된 모든 훈련일지의 출력 양식에 즉시 반영됩니다.</li>
                                <li>공식적인 행정 처리를 위해 정확한 명칭을 입력해 주시기 바랍니다.</li>
                                <li>카카오맵 키는 브라우저에 노출되는 공개 키입니다. 반드시 JavaScript SDK 도메인을 제한해 주세요.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        async function fetchSettings() {
            try {
                const token = 'Bearer ' + localStorage.getItem('token');
                const [instRes, kakaoRes, openaiRes] = await Promise.all([
                    fetch('/api/settings/institution_name', { headers: { 'Authorization': token } }),
                    fetch('/api/settings/kakao_map_appkey', { headers: { 'Authorization': token } }),
                    fetch('/api/settings/openai_api_key', { headers: { 'Authorization': token } })
                ]);
                const instResult = await instRes.json();
                if (instResult.success && instResult.data != null) {
                    document.getElementById('institutionNameInput').value = instResult.data;
                }
                const kakaoResult = await kakaoRes.json();
                const kakaoStatus = document.getElementById('kakaoMapKeyStatus');
                if (kakaoResult.success && kakaoResult.data != null && String(kakaoResult.data).trim() !== '') {
                    document.getElementById('kakaoMapAppkeyInput').value = kakaoResult.data;
                    if (kakaoStatus) {
                        kakaoStatus.classList.remove('hidden', 'text-amber-600');
                        kakaoStatus.classList.add('text-emerald-600');
                        kakaoStatus.textContent = '키 저장됨 · 지도가 안 보이면 SDK 도메인 등록을 확인하세요.';
                    }
                } else if (kakaoStatus) {
                    kakaoStatus.classList.remove('hidden', 'text-emerald-600');
                    kakaoStatus.classList.add('text-amber-600');
                    kakaoStatus.textContent = '미설정 · 아래 가이드대로 JavaScript 키를 발급해 입력하세요.';
                }
                const openaiResult = await openaiRes.json();
                if (openaiResult.success && openaiResult.data != null) {
                    const data = openaiResult.data;
                    if (typeof data === 'object' && data.masked && data.value) {
                        document.getElementById('openaiKeyStatus').classList.remove('hidden');
                        document.getElementById('openaiKeyMasked').textContent = data.value.slice(-4);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            }
        }

        async function saveSettings() {
            const institutionName = document.getElementById('institutionNameInput').value.trim();
            const kakaoMapAppkey = document.getElementById('kakaoMapAppkeyInput').value.trim();
            const openaiApiKey = document.getElementById('openaiApiKeyInput').value.trim();
            if (!institutionName) {
                alert('훈련기관명을 입력해주세요.');
                return;
            }

            try {
                const token = 'Bearer ' + localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json', 'Authorization': token };
                await fetch('/api/settings', { method: 'POST', headers, body: JSON.stringify({ key: 'institution_name', value: institutionName }) });
                await fetch('/api/settings', { method: 'POST', headers, body: JSON.stringify({ key: 'kakao_map_appkey', value: kakaoMapAppkey }) });
                if (openaiApiKey) {
                    await fetch('/api/settings', { method: 'POST', headers, body: JSON.stringify({ key: 'openai_api_key', value: openaiApiKey }) });
                }
                alert('설정이 저장되었습니다.');
                location.reload();
            } catch (e) {
                alert('오류가 발생했습니다.');
            }
        }

        window.onload = function() {
            fetchSettings();
            var list = document.getElementById('kakaoDomainChecklist');
            if (list && window.location.origin) {
                var li = document.createElement('li');
                li.className = 'flex items-start gap-2';
                li.innerHTML = '<i class="fas fa-star text-amber-500 mt-0.5"></i><span>' + window.location.origin + '</span> <span class="text-amber-700 font-sans font-bold">(지금 접속 중인 Origin — 반드시 등록)</span>';
                list.insertBefore(li, list.firstChild);
            }
        };
    </script>
</body>
</html>
`;
