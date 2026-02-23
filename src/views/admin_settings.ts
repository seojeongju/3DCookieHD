
import { hrdSidebar } from './components/hrd_sidebar';

export const adminSettingsHtml = (sidebarHtml?: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련기관 정보설정 - 관리자 설정</title>
    <script src="https://cdn.tailwindcss.com"></script>
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

                            <div class="pt-6 border-t border-slate-100 flex justify-end">
                                <button onclick="saveSettings()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group">
                                    <i class="fas fa-save group-hover:scale-110 transition-transform"></i>
                                    변경사항 저장하기
                                </button>
                            </div>
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
                const res = await fetch('/api/settings/institution_name', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    document.getElementById('institutionNameInput').value = result.data;
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            }
        }

        async function saveSettings() {
            const value = document.getElementById('institutionNameInput').value.trim();
            if (!value) {
                alert('훈련기관명을 입력해주세요.');
                return;
            }

            try {
                const res = await fetch('/api/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ key: 'institution_name', value: value })
                });
                const result = await res.json();
                if (result.success) {
                    alert('설정이 저장되었습니다.');
                    location.reload();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                alert('오류가 발생했습니다.');
            }
        }

        window.onload = fetchSettings;
    </script>
</body>
</html>
`;
