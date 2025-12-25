import { lmsHeaderHtml } from './components/lms_header';

export const adminLmsTrainingLogsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련일지 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- LMS Shared Header -->
    ${lmsHeaderHtml('training-logs')}

    <!-- 서브 헤더 (훈련일지 전용) -->
     <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">훈련일지 관리 & NCS 연동</h1>
            <div class="flex gap-2">
                <button onclick="openLogModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center shadow-sm">
                    <i class="fas fa-pen-nib mr-2"></i> 오늘 일지 작성
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- 왼쪽: 통계 및 필터 -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 class="font-bold text-gray-800 mb-4">NCS 이수 현황</h3>
                    <div id="ncsProgress" class="space-y-4">
                        <!-- JS Load -->
                        <div class="text-center text-gray-400 py-4 text-sm">기록을 불러오는 중...</div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽: 일지 목록 -->
            <div class="lg:col-span-3">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 w-32">일자</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500">훈련 주제 및 내용</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 w-48">NCS 연동</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 w-20 text-center">시간</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 w-16"></th>
                            </tr>
                        </thead>
                        <tbody id="logTableBody" class="divide-y divide-gray-50">
                            <!-- JS Load -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- 일지 등록 모달 -->
    <div id="logModal" class="fixed inset-0 bg-black/60 hidden z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden">
            <div class="p-6 border-b bg-slate-50 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">훈련일지 작성</h3>
                <button onclick="closeLogModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="logForm" onsubmit="handleSaveLog(event)" class="p-8 space-y-6">
                <input type="hidden" id="logId">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">훈련 일자 *</label>
                        <input type="date" id="logDate" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">훈련 시간 (h) *</label>
                        <input type="number" id="logHours" value="8" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                    </div>
                </div>
                
                <div class="space-y-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <h4 class="text-xs font-black text-purple-600 uppercase tracking-widest">NCS 연동 설정</h4>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">진행 중인 NCS 능력단위</label>
                        <select id="logNcsUnitId" class="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                            <option value="">능력단위 선택 (해당 없음)</option>
                        </select>
                    </div>
                    <div id="elementsPicker" class="hidden">
                        <label class="block text-sm font-bold text-gray-700 mb-2">수행준거 선택</label>
                        <div id="elementCheckboxes" class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto bg-white p-3 rounded-xl border border-purple-100">
                            <!-- JS Load -->
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">훈련 주제 *</label>
                    <input type="text" id="logTopic" required placeholder="예: HTML 기초 및 시맨틱 태그 활용" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">훈련 내용 세부사항</label>
                    <textarea id="logContent" rows="4" placeholder="오늘 진행된 교육 내용을 간략히 입력하세요..." class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100"></textarea>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="closeLogModal()" class="flex-1 px-6 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">취소</button>
                    <button type="submit" class="flex-1 px-6 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        let assignedUnits = [];

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('logDate').valueAsDate = new Date();
            loadLogs();
            loadAssignedUnits();
        });

        async function loadAssignedUnits() {
            try {
                const res = await fetch(\`/api/ncs/courses/\${courseId}\`);
                const result = await res.json();
                if (result.success) {
                    assignedUnits = result.data;
                    const select = document.getElementById('logNcsUnitId');
                    assignedUnits.forEach(u => {
                        const opt = document.createElement('option');
                        opt.value = u.ncs_unit_id;
                        opt.textContent = \`[\${u.code}] \${u.name}\`;
                        select.appendChild(opt);
                    });
                }
            } catch (e) { console.error(e); }
        }

        document.getElementById('logNcsUnitId').addEventListener('change', async (e) => {
            const unitId = e.target.value;
            const picker = document.getElementById('elementsPicker');
            const container = document.getElementById('elementCheckboxes');
            
            if (!unitId) {
                picker.classList.add('hidden');
                return;
            }

            try {
                const res = await fetch(\`/api/ncs/units/\${unitId}/elements\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success && result.data.length > 0) {
                    picker.classList.remove('hidden');
                    container.innerHTML = result.data.map(el => \`
                        <label class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                            <input type="checkbox" name="ncs_element" value="\${el.id}" class="w-4 h-4 text-purple-600 rounded">
                            <div class="text-sm">
                                <span class="font-bold text-gray-400 mr-2">\${el.code}</span>
                                <span class="text-gray-700">\${el.name}</span>
                            </div>
                        </label>
                    \`).join('');
                } else {
                    picker.classList.add('hidden');
                }
            } catch (e) { console.error(e); }
        });

        async function loadLogs() {
            try {
                const res = await fetch(\`/api/hrd/training-logs?courseId=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    renderLogs(result.data);
                    calculateNcsProgress();
                }
            } catch (e) { console.error(e); }
        }

        function renderLogs(logs) {
            const tbody = document.getElementById('logTableBody');
            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-20 text-center text-gray-400 font-medium whitespace-pre-line">등록된 훈련일지가 없습니다.\\n새로운 일지를 작성하여 NCS 이수 시간을 관리하세요.</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(log => \`
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">\${log.date}</td>
                    <td class="px-6 py-4">
                        <div class="font-bold text-gray-800 mb-0.5">\${log.topic}</div>
                        <div class="text-xs text-gray-400 truncate max-w-lg">\${log.content || '-'}</div>
                    </td>
                    <td class="px-6 py-4">
                        \${log.ncs_unit_name ? \`
                            <div class="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded text-[10px] font-bold border border-purple-100 mb-1">
                                \${log.ncs_unit_code}
                            </div>
                            <div class="text-[10px] text-gray-500 font-medium truncate">\${log.ncs_unit_name}</div>
                        \` : '<span class="text-gray-300 text-xs">-</span>'}
                    </td>
                    <td class="px-6 py-4 text-center font-black text-gray-700 text-sm">\${log.training_hours}h</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick='editLog(\${JSON.stringify(log).replace(/'/g, "&#39;")})' class="text-gray-400 hover:text-purple-600 transition"><i class="fas fa-edit"></i></button>
                    </td>
                </tr>
            \`).join('');
        }

        async function calculateNcsProgress() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                const container = document.getElementById('ncsProgress');
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        return \`
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition">
                                <div class="flex justify-between text-[10px] font-bold mb-1.5">
                                    <span class="text-gray-400">\${item.unit_code}</span>
                                    <span class="text-purple-600 font-black">\${item.current_hours} / \${item.target_hours}h (\${percent.toFixed(0)}%)</span>
                                </div>
                                <div class="text-xs font-bold text-gray-700 truncate mb-2">\${item.unit_name}</div>
                                <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.4)]" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    container.innerHTML = '<div class="text-center text-gray-400 py-10 text-xs font-medium border-2 border-dashed rounded-xl">NCS 배정 정보가 없습니다.</div>';
                }
            } catch (e) {
                console.error(e);
                document.getElementById('ncsProgress').innerHTML = '<div class="text-center text-red-400 py-4 text-xs font-medium">데이터 로드 실패</div>';
            }
        }

        function openLogModal() {
            document.getElementById('logId').value = '';
            document.getElementById('logTopic').value = '';
            document.getElementById('logContent').value = '';
            document.getElementById('logHours').value = '8';
            document.getElementById('logNcsUnitId').value = '';
            document.getElementById('elementsPicker').classList.add('hidden');
            document.getElementById('modalTitle').textContent = '훈련일지 작성';
            document.getElementById('logModal').classList.remove('hidden');
        }

        async function editLog(log) {
            document.getElementById('logId').value = log.id;
            document.getElementById('logDate').value = log.date;
            document.getElementById('logTopic').value = log.topic;
            document.getElementById('logContent').value = log.content || '';
            document.getElementById('logHours').value = log.training_hours;
            document.getElementById('logNcsUnitId').value = log.ncs_unit_id || '';
            
            // Trigger unit change to load elements
            const event = new Event('change');
            document.getElementById('logNcsUnitId').dispatchEvent(event);
            
            // Wait a bit for elements to load, then check them
            setTimeout(() => {
                if (log.ncs_elements_json) {
                    const selectedIds = JSON.parse(log.ncs_elements_json);
                    const checks = document.querySelectorAll('input[name="ncs_element"]');
                    checks.forEach(c => {
                        if (selectedIds.includes(parseInt(c.value))) c.checked = true;
                    });
                }
            }, 500);

            document.getElementById('modalTitle').textContent = '훈련일지 수정';
            document.getElementById('logModal').classList.remove('hidden');
        }

        function closeLogModal() { document.getElementById('logModal').classList.add('hidden'); }

        async function handleSaveLog(e) {
            e.preventDefault();
            const elementIds = Array.from(document.querySelectorAll('input[name="ncs_element"]:checked')).map(i => parseInt(i.value));
            
            const data = {
                id: document.getElementById('logId').value ? parseInt(document.getElementById('logId').value) : null,
                course_id: parseInt(courseId),
                instructor_id: user.id,
                date: document.getElementById('logDate').value,
                topic: document.getElementById('logTopic').value,
                content: document.getElementById('logContent').value,
                teaching_method: '주입식/실습', // 가변화 가능
                ncs_unit_id: document.getElementById('logNcsUnitId').value ? parseInt(document.getElementById('logNcsUnitId').value) : null,
                training_hours: parseInt(document.getElementById('logHours').value),
                ncs_elements_json: JSON.stringify(elementIds)
            };

            try {
                const res = await fetch('/api/hrd/training-logs', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                if ((await res.json()).success) {
                    closeLogModal();
                    loadLogs();
                    calculateNcsProgress();
                }
            } catch (e) { console.error(e); }
        }
    </script>
</body>
</html>
`;
