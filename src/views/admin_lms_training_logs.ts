
import { lmsHeaderHtml } from './components/lms_header';

export const adminLmsTrainingLogsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련일지 관리 - 교육행정 시스템</title>
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
    \${lmsHeaderHtml('training-logs')}

    <!-- 서브 헤더 (훈련일지 전용) -->
     <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">훈련일지 관리 & NCS 연동</h1>
            <div class="flex gap-2">
                <button onclick="openLogModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                    <i class="fas fa-pen-nib mr-2"></i> 오늘 일지 작성
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- 왼쪽: NCS 이수 현황 -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-tasks text-indigo-500 mr-2"></i> NCS 이수 현황
                    </h3>
                    <div id="ncsProgress" class="space-y-4">
                        <div class="text-center text-gray-400 py-4 text-sm">기록을 불러오는 중...</div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽: 일지 목록 -->
            <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50/50 border-b">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">일자</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">훈련 주제 및 내용</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">NCS 연동</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">시간</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24"></th>
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
    <div id="logModal" class="fixed inset-0 bg-black/60 hidden z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden border border-white/20">
            <div class="p-6 border-b bg-indigo-50/50 flex justify-between items-center">
                <h3 class="text-xl font-bold text-indigo-900" id="modalTitle">훈련일지 작성</h3>
                <button onclick="closeLogModal()" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><i class="fas fa-times"></i></button>
            </div>
            <form id="logForm" onsubmit="handleSaveLog(event)" class="p-8 space-y-6">
                <input type="hidden" id="logId">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap">훈련 일자 *</label>
                        <input type="date" id="logDate" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap">훈련 시간 (h) *</label>
                        <input type="number" id="logHours" value="8" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium">
                    </div>
                </div>
                
                <div class="space-y-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 shadow-inner">
                    <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center">
                        <i class="fas fa-link mr-1.5"></i> NCS 연동 설정
                    </h4>
                    <div>
                        <label class="block text-[11px] font-bold text-indigo-400 mb-1.5 uppercase tracking-wider">능력단위 선택</label>
                        <select id="logNcsUnitId" class="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-4 focus:ring-indigo-200 transition-all text-sm font-bold text-indigo-900">
                            <option value="">해당 사항 없음</option>
                        </select>
                    </div>
                    <div id="elementsPicker" class="hidden">
                        <label class="block text-[11px] font-bold text-indigo-400 mb-1.5 uppercase tracking-wider">수행준거 선택</label>
                        <div id="elementCheckboxes" class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto bg-white/80 p-3 rounded-xl border border-indigo-100 shadow-sm scrollbar-hide">
                            <!-- JS Load -->
                        </div>
                    </div>
                </div>

                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">훈련 주제 *</label>
                        <input type="text" id="logTopic" required placeholder="예: HTML 기초 및 시맨틱 태그 활용" class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">훈련 내용 세부사항</label>
                        <textarea id="logContent" rows="4" placeholder="오늘 진행된 교육 내용을 간략히 입력하세요..." class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"></textarea>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="closeLogModal()" class="flex-1 px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all">취소</button>
                    <button type="submit" class="flex-1 px-6 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 transform active:scale-95">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        let assignedUnits = [];

        document.addEventListener('DOMContentLoaded', () => {
            const logDateInput = document.getElementById('logDate');
            if (logDateInput) logDateInput.valueAsDate = new Date();
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
                    if (select) {
                        assignedUnits.forEach(u => {
                            const opt = document.createElement('option');
                            opt.value = u.ncs_unit_id;
                            opt.textContent = \`[\${u.code}] \${u.name}\`;
                            select.appendChild(opt);
                        });
                    }
                }
            } catch (e) { console.error(e); }
        }

        const unitSelect = document.getElementById('logNcsUnitId');
        if (unitSelect) {
            unitSelect.addEventListener('change', async (e) => {
                const unitId = e.target.value;
                const picker = document.getElementById('elementsPicker');
                const container = document.getElementById('elementCheckboxes');
                
                if (!unitId || !picker || !container) {
                    if (picker) picker.classList.add('hidden');
                    return;
                }

                try {
                    const res = await fetch(\`/api/ncs/units/\${unitId}/elements\`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const result = await res.json();
                    if (result.success && result.data.length > 0) {
                        picker.classList.remove('hidden');
                        container.innerHTML = result.data.map(el => \`
                            <label class="flex items-center gap-3 p-2.5 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-100 group">
                                <input type="checkbox" name="ncs_element" value="\${el.id}" class="w-5 h-5 text-indigo-600 rounded-lg border-gray-200 focus:ring-indigo-500 transition-all">
                                <div class="text-sm">
                                    <span class="font-black text-indigo-300 mr-2 uppercase tracking-tighter group-hover:text-indigo-500 transition-all font-mono">\${el.code}</span>
                                    <span class="text-gray-600 font-bold group-hover:text-indigo-900 transition-all">\${el.name}</span>
                                </div>
                            </label>
                        \`).join('');
                    } else {
                        picker.classList.add('hidden');
                    }
                } catch (e) { console.error(e); }
            });
        }

        async function loadLogs() {
            try {
                const res = await fetch(\`/api/hrd/training-logs?courseId=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
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
            if (!tbody) return;
            if (!logs || logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">등록된 훈련일지가 없습니다.\\n새로운 일지를 작성하여 NCS 이수 시간을 관리하세요.</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(log => \`
                <tr class="hover:bg-indigo-50/30 transition-all duration-200 group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">
                    <td class="px-6 py-5 whitespace-nowrap text-[11px] font-black text-indigo-300 uppercase tracking-widest">\${log.date}</td>
                    <td class="px-6 py-5">
                        <div class="font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">\${log.topic}</div>
                        <div class="text-xs text-gray-400 truncate max-w-lg font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all">\${log.content || '-'}</div>
                    </td>
                    <td class="px-6 py-5">
                        \${log.ncs_unit_name ? \\\`
                            <div class="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-md text-[9px] font-black border border-indigo-100/50 mb-1 shadow-sm">
                                \${log.ncs_unit_code}
                            </div>
                            <div class="text-[10px] text-gray-500 font-black truncate leading-none opacity-60 group-hover:opacity-100 transition-all font-sans uppercase tracking-tighter">\${log.ncs_unit_name}</div>
                        \\\` : '<span class="text-gray-200 text-xs font-black tracking-widest leading-none">-</span>'}
                    </td>
                    <td class="px-6 py-5 text-center font-black text-slate-700 text-sm shadow-[inset_1px_0_0_0_rgba(248,250,252,1)] shadow-[inset_-1px_0_0_0_rgba(248,250,252,1)]">\${log.training_hours}h</td>
                    <td class="px-6 py-5 text-right">
                        <div class="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                            <button onclick='editLog(\${JSON.stringify(log).replace(/'/g, "&#39;")})' class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all rounded-xl active:scale-90">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <button onclick="deleteLog(\${log.id})" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-md transition-all rounded-xl active:scale-90">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            \`).join('');
        }

        async function deleteLog(id) {
            if (!confirm('정말로 이 일지를 삭제하시겠습니까?\\n관련 NCS 이수 시간도 함께 삭제됩니다.')) return;
            
            try {
                const res = await fetch(\`/api/hrd/training-logs/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    loadLogs();
                    calculateNcsProgress();
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        async function calculateNcsProgress() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                const container = document.getElementById('ncsProgress');
                if (!container) return;
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        const isComplete = percent >= 100;
                        
                        return \`
                            <div class="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">\${item.unit_code}</span>
                                        <span class="text-xs font-black text-slate-700 truncate max-w-[120px] transition-colors group-hover:text-indigo-600 uppercase tracking-tight">\${item.unit_name}</span>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-[10px] font-black \${isComplete ? 'text-emerald-500' : 'text-indigo-500' }">\${item.current_hours} / \${item.target_hours}h</span>
                                        <span class="text-[10px] font-black text-slate-300 group-hover:text-indigo-300 transition-all font-mono italic">\${percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden shadow-inner ring-1 ring-slate-50">
                                    <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)] \${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    container.innerHTML = '<div class="text-center text-slate-400 py-10 text-xs font-bold border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 uppercase tracking-widest opacity-60">NCS 배정 정보 없음</div>';
                }
            } catch (e) {
                console.error(e);
                const container = document.getElementById('ncsProgress');
                if (container) container.innerHTML = '<div class="text-center text-rose-400 py-4 text-xs font-bold uppercase tracking-widest ring-1 ring-rose-50 rounded-xl bg-rose-50/10">데이터 로드 실패</div>';
            }
        }

        function openLogModal() {
            const elId = document.getElementById('logId');
            const elTopic = document.getElementById('logTopic');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elUnitId = document.getElementById('logNcsUnitId');
            const elPicker = document.getElementById('elementsPicker');

            if (elId) elId.value = '';
            if (elTopic) elTopic.value = '';
            if (elContent) elContent.value = '';
            if (elHours) elHours.value = '8';
            if (elUnitId) {
                elUnitId.value = '';
                const event = new Event('change');
                elUnitId.dispatchEvent(event);
            }
            if (elPicker) elPicker.classList.add('hidden');
            
            const elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 작성';
            
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }

        async function editLog(log) {
            const elId = document.getElementById('logId');
            const elDate = document.getElementById('logDate');
            const elTopic = document.getElementById('logTopic');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elUnitId = document.getElementById('logNcsUnitId');

            if (elId) elId.value = log.id;
            if (elDate) elDate.value = log.date;
            if (elTopic) elTopic.value = log.topic;
            if (elContent) elContent.value = log.content || '';
            if (elHours) elHours.value = log.training_hours;
            
            if (elUnitId) {
                elUnitId.value = log.ncs_unit_id || '';
                const event = new Event('change');
                elUnitId.dispatchEvent(event);
                
                setTimeout(() => {
                    if (log.ncs_elements_json) {
                        const selectedIds = JSON.parse(log.ncs_elements_json);
                        const checks = document.querySelectorAll('input[name="ncs_element"]');
                        checks.forEach(c => {
                            if (selectedIds.includes(parseInt(c.value))) c.checked = true;
                        });
                    }
                }, 400);
            }

            const elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 수정';
            
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }

        function closeLogModal() { 
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.add('hidden'); 
        }

        async function handleSaveLog(e) {
            e.preventDefault();
            const elementIds = Array.from(document.querySelectorAll('input[name="ncs_element"]:checked')).map(i => parseInt(i.value));
            
            const idVal = document.getElementById('logId').value;
            const dateVal = document.getElementById('logDate').value;
            const topicVal = document.getElementById('logTopic').value;
            const contentVal = document.getElementById('logContent').value;
            const unitIdVal = document.getElementById('logNcsUnitId').value;
            const hoursVal = document.getElementById('logHours').value;

            const data = {
                id: idVal ? parseInt(idVal) : null,
                course_id: parseInt(courseId),
                instructor_id: user.id || 0,
                date: dateVal,
                topic: topicVal,
                content: contentVal,
                teaching_method: '주입식/실습', 
                ncs_unit_id: unitIdVal ? parseInt(unitIdVal) : null,
                training_hours: parseInt(hoursVal),
                ncs_elements_json: JSON.stringify(elementIds)
            };

            try {
                const res = await fetch('/api/hrd/training-logs', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    closeLogModal();
                    loadLogs();
                    calculateNcsProgress();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
\`;
