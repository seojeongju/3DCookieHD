import { lmsHeaderHtml } from './components/lms_header';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsEmploymentHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>취업 현황 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="${LMS_SHELL_ROOT_CLASS}">
        ${sidebar}
        
        <div class="${LMS_SHELL_COLUMN_CLASS}">
            ${lmsFixedHeaderBlock(lmsHeaderHtml('employment'))}
            ${lmsScrollMainOpen()}

    <!-- 서브 헤더 (취업 관리 전용) -->
    <header class="bg-white border-b sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">수료생 취업 현황 관리</h2>
                
                <div class="flex gap-4 items-center">
                    <div class="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-4">
                        <div class="text-center">
                            <div class="text-[10px] text-gray-400 font-bold uppercase">전체 인원</div>
                            <div class="text-lg font-black text-blue-700" id="totalCount">0</div>
                        </div>
                        <div class="w-px h-8 bg-blue-200"></div>
                        <div class="text-center">
                            <div class="text-[10px] text-gray-400 font-bold uppercase">취업 완료</div>
                            <div class="text-lg font-black text-green-600" id="employedCount">0</div>
                        </div>
                        <div class="w-px h-8 bg-blue-200"></div>
                        <div class="text-center">
                            <div class="text-[10px] text-gray-400 font-bold uppercase">취업률</div>
                            <div class="text-lg font-black text-purple-600" id="employmentRate">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">성명 / 연락처</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">취업처 / 직무</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">취업일자</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">보험가입</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">관리</th>
                    </tr>
                </thead>
                <tbody id="studentList" class="divide-y divide-gray-50">
                    <tr><td colspan="6" class="px-6 py-10 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                </tbody>
            </table>
        </div>
    </main>

    <!-- 취업 정보 수정 모달 -->
    <div id="editModal" class="fixed inset-0 bg-black/60 hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all overflow-hidden">
            <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">취업 정보 수정</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="editForm" onsubmit="handleSave(event)" class="p-8 space-y-6">
                <input type="hidden" id="editStudentId">
                <div class="flex items-center gap-4 bg-blue-50 p-4 rounded-xl mb-4">
                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600">
                        <i class="fas fa-user-graduate text-xl"></i>
                    </div>
                    <div>
                        <div id="editStudentName" class="font-bold text-gray-800 text-lg"></div>
                        <div id="editStudentPhone" class="text-xs text-blue-600"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">취업 상태</label>
                        <select id="editStatus" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                            <option value="seeking">구직 중</option>
                            <option value="employed">취업 완료</option>
                            <option value="further_education">진학</option>
                            <option value="military">군입대</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">업체명</label>
                        <input type="text" id="editCompany" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">직무</label>
                        <input type="text" id="editJob" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">취업일자</label>
                        <input type="date" id="editDate" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition">
                    </div>
                    <div class="col-span-2 sm:col-span-1 flex items-end pb-3">
                        <label class="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" id="editInsurance" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                            <span class="text-sm font-bold text-gray-600 group-hover:text-gray-800 transition">고용보험 가입여부</span>
                        </label>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">비고 / 메모</label>
                        <textarea id="editNotes" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition"></textarea>
                    </div>
                </div>

                <div class="pt-4 flex gap-4">
                    <button type="button" onclick="closeModal()" class="flex-1 py-4 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition">취소</button>
                    <button type="submit" class="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const courseId = new URLSearchParams(window.location.search).get('session_id') || window.location.pathname.split('/')[3];
        let students = [];

        document.addEventListener('DOMContentLoaded', () => {
            loadEmploymentData();
        });

        async function loadEmploymentData() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/employment\`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    students = result.data;
                    renderTable();
                    updateStats();
                }
            } catch (e) { console.error(e); }
        }

        function renderTable() {
            const tbody = document.getElementById('studentList');
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-400">등록된 수강생이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = students.map(s => {
                let statusBadge = '';
                switch(s.status) {
                    case 'employed': statusBadge = '<span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">취업완료</span>'; break;
                    case 'seeking': statusBadge = '<span class="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">구직중</span>'; break;
                    case 'further_education': statusBadge = '<span class="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">진학</span>'; break;
                    case 'military': statusBadge = '<span class="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">군입대</span>'; break;
                    default: statusBadge = '<span class="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded">기타</span>';
                }

                return \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4">
                            <div class="font-bold text-gray-800">\${s.name}</div>
                            <div class="text-[10px] text-gray-400 font-mono">\${s.phone || '-'}</div>
                        </td>
                        <td class="px-6 py-4">\${statusBadge}</td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-700">\${s.company_name || '-'}</div>
                            <div class="text-[10px] text-gray-400">\${s.job_title || ''}</div>
                        </td>
                        <td class="px-6 py-4 text-xs font-mono text-gray-500">\${s.employment_date || '-'}</td>
                        <td class="px-6 py-4 text-center">
                            \${s.insurance_covered ? '<i class="fas fa-check-circle text-blue-500"></i>' : '<i class="fas fa-times text-gray-300"></i>'}
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="openEditModal(\${JSON.stringify(s).replace(/"/g, '&quot;')})" class="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition shadow-sm">
                                정보수정
                            </button>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function updateStats() {
            const total = students.length;
            const employed = students.filter(s => s.status === 'employed').length;
            const rate = total > 0 ? Math.round((employed / total) * 100) : 0;

            document.getElementById('totalCount').textContent = total;
            document.getElementById('employedCount').textContent = employed;
            document.getElementById('employmentRate').textContent = rate + '%';
        }

        function openEditModal(student) {
            document.getElementById('editStudentId').value = student.student_id;
            document.getElementById('editStudentName').textContent = student.name;
            document.getElementById('editStudentPhone').textContent = student.phone || '연락처 없음';
            document.getElementById('editStatus').value = student.status || 'seeking';
            document.getElementById('editCompany').value = student.company_name || '';
            document.getElementById('editJob').value = student.job_title || '';
            document.getElementById('editDate').value = student.employment_date || '';
            document.getElementById('editInsurance').checked = student.insurance_covered === 1;
            document.getElementById('editNotes').value = student.notes || '';
            
            document.getElementById('editModal').classList.remove('hidden');
        }

        function closeModal() { document.getElementById('editModal').classList.add('hidden'); }

        async function handleSave(e) {
            e.preventDefault();
            const data = {
                student_id: parseInt(document.getElementById('editStudentId').value),
                course_id: parseInt(courseId),
                status: document.getElementById('editStatus').value,
                company_name: document.getElementById('editCompany').value,
                job_title: document.getElementById('editJob').value,
                employment_date: document.getElementById('editDate').value,
                insurance_covered: document.getElementById('editInsurance').checked,
                notes: document.getElementById('editNotes').value
            };

            try {
                const res = await fetch('/api/hrd/employment', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    closeModal();
                    loadEmploymentData();
                }
            } catch (e) { console.error(e); }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
