
import { hrdSidebar } from './components/hrd_sidebar';

export function adminNcsUploadHtml(): string {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 데이터 업로드 — WOW3D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- PapaParse for CSV parsing -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
    <style>
        body { font-family: 'Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('ncs-upload')}

        <main class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">NCS 데이터 업로드</h1>
                    <span class="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">OFFLINE DATA</span>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-4xl mx-auto space-y-8">
                    
                    <!-- 안내 카드 -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                                <i class="fas fa-file-csv text-2xl"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-slate-800 mb-2">CSV 파일 업로드 안내</h3>
                                <p class="text-slate-600 text-sm leading-relaxed mb-4">
                                    NCS 분류 및 능력단위 데이터를 CSV 파일로 업로드하여 서버 데이터베이스를 업데이트합니다.<br>
                                    기존 데이터와 코드가 중복될 경우, 업로드된 파일의 내용으로 <strong>덮어쓰기</strong> 됩니다.
                                </p>
                                <div class="bg-slate-50 rounded-lg p-4 text-xs font-mono text-slate-500 overflow-x-auto border border-slate-100">
                                    대분류,중분류,소분류,직종명,직종코드,능력단위명,능력단위코드,수준
                                </div>
                                <p class="text-xs text-slate-400 mt-2">
                                    * 헤더(첫 줄)는 자동으로 인식하여 건너뜁니다. 순서를 지켜주세요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 업로드 영역 -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h3 class="text-lg font-bold text-slate-800 mb-6">파일 선택</h3>
                        
                        <div id="dropZone" class="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
                            <input type="file" id="csvFile" accept=".csv" class="hidden">
                            <div class="text-slate-300 group-hover:text-blue-500 transition-colors mb-4">
                                <i class="fas fa-cloud-upload-alt text-4xl"></i>
                            </div>
                            <p class="text-slate-600 font-medium mb-1">CSV 파일을 여기로 드래그하거나 클릭하여 선택하세요</p>
                            <p class="text-slate-400 text-sm" id="fileName">선택된 파일 없음</p>
                        </div>

                        <div id="previewArea" class="mt-8 hidden">
                            <div class="flex justify-between items-end mb-4">
                                <h4 class="font-bold text-slate-700">데이터 미리보기 <span id="recordCount" class="text-blue-600 text-sm font-normal ml-2"></span></h4>
                                <button id="btnUpload" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <i class="fas fa-upload mr-2"></i> 데이터 반영 시작
                                </button>
                            </div>
                            <div class="overflow-x-auto border border-slate-200 rounded-lg max-h-[300px] custom-scrollbar">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 text-slate-500 font-medium sticky top-0">
                                        <tr>
                                            <th class="px-4 py-2">직종명</th>
                                            <th class="px-4 py-2">직종코드</th>
                                            <th class="px-4 py-2">능력단위명</th>
                                            <th class="px-4 py-2">코드</th>
                                            <th class="px-4 py-2">수준</th>
                                        </tr>
                                    </thead>
                                    <tbody id="previewBody" class="divide-y divide-slate-100"></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- 진행 상태 -->
                        <div id="progressArea" class="mt-8 hidden">
                            <div class="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                <span id="progressStatus">업로드 중...</span>
                                <span id="progressPercent">0%</span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div id="progressBar" class="h-full bg-blue-500 transition-all duration-300 w-0"></div>
                            </div>
                            <div id="logArea" class="mt-4 h-32 bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-lg overflow-y-auto custom-scrollbar"></div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('csvFile');
        const fileNameDisplay = document.getElementById('fileName');
        const previewArea = document.getElementById('previewArea');
        const previewBody = document.getElementById('previewBody');
        const btnUpload = document.getElementById('btnUpload');
        const progressArea = document.getElementById('progressArea');
        const progressBar = document.getElementById('progressBar');
        const logArea = document.getElementById('logArea');
        
        let parsedData = [];

        // Drag & Drop
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('bg-blue-50', 'border-blue-300'); });
        dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dropZone.classList.remove('bg-blue-50', 'border-blue-300'); });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('bg-blue-50', 'border-blue-300');
            if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFile(e.target.files[0]);
        });

        function handleFile(file) {
            fileNameDisplay.textContent = file.name;
            
            Papa.parse(file, {
                header: false, // 배열로 받아서 인덱스로 처리 (헤더가 한글일수도 영어일수도 있으므로)
                skipEmptyLines: true,
                complete: function(results) {
                    if (results.data.length < 2) {
                        alert('데이터가 없는 파일입니다.');
                        return;
                    }
                    
                    // 첫 줄(헤더) 제거 및 데이터 매핑
                    // 가정: 대분류(0), 중분류(1), 소분류(2), 직종명(3), 직종코드(4), 능력단위명(5), 능력단위코드(6), 수준(7)
                    parsedData = results.data.slice(1).map(row => ({
                        large: row[0],
                        mid: row[1],
                        small: row[2],
                        jobName: row[3],
                        jobCode: row[4],
                        unitName: row[5],
                        unitCode: row[6],
                        level: row[7]
                    })).filter(r => r.unitCode && r.jobCode); // 코드가 있는 것만 유효

                    showPreview();
                },
                error: function(err) {
                    alert('CSV 파싱 오류: ' + err.message);
                }
            });
        }

        function showPreview() {
            previewArea.classList.remove('hidden');
            document.getElementById('recordCount').textContent = \`총 \${parsedData.length}건\`;
            
            // 처음 5개만 보여주기
            previewBody.innerHTML = parsedData.slice(0, 5).map(r => \`
                <tr>
                    <td class="px-4 py-2">\${r.jobName}</td>
                    <td class="px-4 py-2 font-mono text-slate-500">\${r.jobCode}</td>
                    <td class="px-4 py-2">\${r.unitName}</td>
                    <td class="px-4 py-2 font-mono text-slate-500">\${r.unitCode}</td>
                    <td class="px-4 py-2 text-center">\${r.level}</td>
                </tr>
            \`).join('') + (parsedData.length > 5 ? \`<tr><td colspan="5" class="px-4 py-2 text-center text-slate-400">...외 \${parsedData.length - 5}건</td></tr>\` : '');
        }

        function log(msg) {
            const div = document.createElement('div');
            div.textContent = '> ' + msg;
            logArea.appendChild(div);
            logArea.scrollTop = logArea.scrollHeight;
        }

        btnUpload.addEventListener('click', async () => {
            if (parsedData.length === 0) return;
            
            if (!confirm(\`총 \${parsedData.length}건의 데이터를 업로드하시겠습니까?\\n기존 데이터는 업데이트됩니다.\`)) return;

            btnUpload.disabled = true;
            progressArea.classList.remove('hidden');
            previewArea.classList.add('opacity-50');
            
            const BATCH_SIZE = 50;
            const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);
            
            log('업로드를 시작합니다...');

            for (let i = 0; i < totalBatches; i++) {
                const batch = parsedData.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
                try {
                    const res = await fetch('/api/ncs/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: batch })
                    });
                    
                    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
                    
                    const result = await res.json();
                    if (!result.success) throw new Error(result.error);

                    const progress = Math.round(((i + 1) / totalBatches) * 100);
                    progressBar.style.width = progress + '%';
                    document.getElementById('progressPercent').textContent = progress + '%';
                    log(\`배치 \${i + 1}/\${totalBatches} 완료 (\${batch.length}건)\`);

                } catch (e) {
                    log(\`[오류] 배치 \${i + 1} 실패: \${e.message}\`);
                    console.error(e);
                    alert('업로드 중 오류가 발생했습니다. 로그를 확인해주세요.');
                    btnUpload.disabled = false;
                    previewArea.classList.remove('opacity-50');
                    return;
                }
            }

            log('모든 데이터 업로드 완료!');
            progressBar.classList.add('bg-green-500');
            document.getElementById('progressStatus').textContent = '완료됨';
            document.getElementById('progressPercent').className = 'text-green-600';
            
            alert('성공적으로 업로드되었습니다.');
            btnUpload.disabled = false;
            previewArea.classList.remove('opacity-50');
        });
    </script>
</body>
</html>
    `;
}
