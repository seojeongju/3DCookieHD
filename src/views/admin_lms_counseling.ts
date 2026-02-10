import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsCounselingHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상담 일지 - 와우쓰리디홍대센터</title>
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
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('courses')}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('counseling')}

    <!-- 서브 헤더 -->
    <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">상담 일지 관리</h2>
                <div class="flex gap-2">
                    <button onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 상담 작성
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <!-- 검색 필터 -->
        <div class="mb-6 flex gap-4">
            <div class="relative flex-1 max-w-md">
                <input type="text" id="searchInput" placeholder="학생 이름 또는 상담 내용 검색..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 일시</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생명</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분/방법</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 내용(요약)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담자</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="counselingList" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 상담 일지를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>

    <!-- 상담 작성/수정 모달 -->
    <div id="counselingModal" class="fixed inset-0 bg-black bg-opacity-50 hidden overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6">
            <div class="flex justify-between items-center mb-6 border-b pb-4">
                <h3 id="modalTitle" class="text-xl font-bold text-gray-800">상담 일지 작성</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="counselingForm" onsubmit="handleSave(event)">
                <input type="hidden" id="logId">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 일자</label>
                        <input type="date" id="counselingDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학생 선택</label>
                        <select id="studentSelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">학생을 선택하세요</option>
                            <!-- 학생 목록 로드됨 -->
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 구분</label>
                        <select id="categorySelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="academic">학사/학습</option>
                            <option value="attendance">출결 관리</option>
                            <option value="career">취업/진로</option>
                            <option value="complaint">고충/건의</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 방법</label>
                        <select id="methodSelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="face_to_face">대면 상담</option>
                            <option value="phone">유선 상담</option>
                            <option value="online">온라인/메신저</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
                    <textarea id="content" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="상담 내용을 상세히 기록하세요."></textarea>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">조치 결과 및 계획</label>
                    <textarea id="result" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="조치 사항이나 향후 지도 계획을 입력하세요."></textarea>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">취소</button>
                    <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">저장</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        let counselingData = [];

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('counselingDate').valueAsDate = new Date();
            loadStudents();
            loadCounselingLogs();

            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadCounselingLogs();
            });
        });

        async function loadStudents() {
            try {
                const token = localStorage.getItem('token');
                // 이 과정에 등록된 학생만 로드해야 함. 
                // /api/enrollments?course_id=... or /api/courses/:id/students
                // 기존 API 활용
                const response = await fetch(\`/api/courses/\${courseId}/students\`, {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const select = document.getElementById('studentSelect');
                // enrollments API 구조에 따라 user 정보 추출 필요.
                // 여기서는 result.data가 [{student: {id, name, ...}}, ...] 형태라고 가정하거나, flat list라고 가정.
                // 보통 수강생 API는 user정보를 포함함.
                const students = result.data || [];
                students.forEach(item => {
                    const s = item.student || item; // 구조 대응
                    const opt = new Option(\`\${s.name} (\${s.email})\`, s.id);
                    select.add(opt);
                });
            } catch (e) {
                console.error('학생 로드 실패', e);
            }
        }

        async function loadCounselingLogs() {
            try {
                const search = document.getElementById('searchInput').value;
                const token = localStorage.getItem('token');
                
                let url = \`/api/hrd/counseling?course_id=\${courseId}&\`;
                if (search) url += \`search=\${encodeURIComponent(search)}\`;

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                counselingData = result.success ? result.data : [];

                renderTable(counselingData);
            } catch (e) {
                console.error('상담 일지 로드 실패', e);
                document.getElementById('counselingList').innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        function renderTable(data) {
            const tbody = document.getElementById('counselingList');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">등록된 상담 일지가 없습니다.</td></tr>';
                return;
            }

            const typeMap = {
                'academic': '<span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">학사</span>',
                'attendance': '<span class="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">출결</span>',
                'career': '<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">취업</span>',
                'complaint': '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">고충</span>',
                'other': '<span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">기타</span>'
            };

            const methodMap = {
                'face_to_face': '대면', 'phone': '유선', 'online': '온라인', 'other': '기타'
            };

            tbody.innerHTML = data.map(log => \`
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${new Date(log.counseling_date).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900">\${log.student_name || '알 수 없음'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        \${typeMap[log.category] || log.category} <span class="text-gray-400 mx-1">|</span> \${methodMap[log.method] || log.method}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate" title="\${log.content}">
                        \${log.content}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${log.counselor_name || '관리자'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="editLog(\${log.id})" class="text-blue-600 hover:text-blue-900 mr-3">수정</button>
                        <button onclick="deleteLog(\${log.id})" class="text-red-600 hover:text-red-900">삭제</button>
                    </td>
                </tr>
            \`).join('');
        }

        function openModal() {
            document.getElementById('counselingForm').reset();
            document.getElementById('logId').value = '';
            document.getElementById('modalTitle').textContent = '상담 일지 작성';
            document.getElementById('counselingDate').valueAsDate = new Date();
            document.getElementById('counselingModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('counselingModal').classList.add('hidden');
        }

        function editLog(id) {
            const log = counselingData.find(d => d.id === id);
            if (!log) return;

            document.getElementById('logId').value = log.id;
            document.getElementById('modalTitle').textContent = '상담 일지 수정';
            document.getElementById('studentSelect').value = log.student_id;
            document.getElementById('categorySelect').value = log.category;
            document.getElementById('methodSelect').value = log.method;
            document.getElementById('content').value = log.content;
            document.getElementById('result').value = log.result || '';
            document.getElementById('counselingDate').value = log.counseling_date.split('T')[0];

            document.getElementById('counselingModal').classList.remove('hidden');
        }

        async function handleSave(e) {
            e.preventDefault();
            const id = document.getElementById('logId').value;
            const method = id ? 'PUT' : 'POST';
            const url = id ? \`/api/hrd/counseling/\${id}\` : '/api/hrd/counseling';
            
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const data = {
                student_id: document.getElementById('studentSelect').value,
                course_id: courseId, // 현재 코스로 고정
                category: document.getElementById('categorySelect').value,
                method: document.getElementById('methodSelect').value,
                content: document.getElementById('content').value,
                result: document.getElementById('result').value,
                counseling_date: document.getElementById('counselingDate').value,
                counselor_id: user.id
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('저장되었습니다.');
                    closeModal();
                    loadCounselingLogs();
                } else {
                    alert('저장에 실패했습니다.');
                }
            } catch (err) {
                console.error(err);
                alert('오류가 발생했습니다.');
            }
        }

        async function deleteLog(id) {
            if (!confirm('정말 삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/hrd/counseling/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (response.ok) {
                    loadCounselingLogs();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
