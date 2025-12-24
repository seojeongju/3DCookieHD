import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdCounselingHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 훈련생 상담일지 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${hrdSidebar('counseling')}

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">훈련생 상담일지 관리</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">HRD-Admin</span>
                        <div class="relative group">
                            <button class="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
                                <i class="fas fa-user-circle text-2xl mr-2"></i>
                                <span class="font-medium">관리자</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 검색 및 필터 -->
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
                    <div class="relative flex-1 min-w-[300px]">
                        <input type="text" id="searchInput" placeholder="훈련생 이름 또는 상담 내용 검색..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <div>
                        <select id="courseFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">전체 과정</option>
                            <!-- 코스 목록 로드됨 -->
                        </select>
                    </div>
                    <button onclick="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 상담 작성
                    </button>
                </div>

                <!-- 상담 목록 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 일시</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">훈련생</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형/방법</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 내용(요약)</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담자</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="counselingList" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <!-- 상담 작성/수정 모달 -->
    <div id="counselingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <h3 id="modalTitle" class="text-xl font-bold text-gray-900">상담 일지 작성</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-500">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="counselingForm" onsubmit="handleSave(event)">
                <input type="hidden" id="logId">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 일자</label>
                        <input type="date" id="counselingDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">훈련생 선택</label>
                        <select id="studentSelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="">훈련생을 선택하세요</option>
                            <!-- 학생 목록 로드됨 -->
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">관련 과정</label>
                    <select id="courseSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="">선택 안함 (일반 상담)</option>
                        <!-- 코스 목록 로드됨 -->
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 구분</label>
                        <select id="categorySelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="academic">학사/학습</option>
                            <option value="attendance">출결 관리</option>
                            <option value="career">취업/진로</option>
                            <option value="complaint">고충/건의</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 방법</label>
                        <select id="methodSelect" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="face_to_face">대면 상담</option>
                            <option value="phone">유선 상담</option>
                            <option value="online">온라인/메신저</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
                    <textarea id="content" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="상담 내용을 상세히 기록하세요."></textarea>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">조치 결과 및 계획</label>
                    <textarea id="result" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="조치 사항이나 향후 지도 계획을 입력하세요."></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">취소</button>
                    <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">저장</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 오늘 날짜 기본 설정
            document.getElementById('counselingDate').valueAsDate = new Date();
            
            loadCourses();
            loadStudents();
            loadCounselingLogs();

            // 검색 엔터 이벤트
            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadCounselingLogs();
            });
            // 필터 변경 이벤트
            document.getElementById('courseFilter').addEventListener('change', loadCounselingLogs);
        });

        let counselingData = [];

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses'); // LMS 코스 목록 사용
                const result = await response.json();
                const courses = result.data || result; // 응답 구조 대응

                const filterSelect = document.getElementById('courseFilter');
                const modalSelect = document.getElementById('courseSelect');

                courses.forEach(c => {
                    const opt1 = new Option(c.title, c.id);
                    const opt2 = new Option(c.title, c.id);
                    filterSelect.add(opt1);
                    modalSelect.add(opt2);
                });
            } catch (e) {
                console.error('코스 로드 실패', e);
            }
        }

        async function loadStudents() {
            try {
                // HRD 학생 목록 또는 전체 학생 목록 사용 (role='student'인 users)
                // /api/hrd/personnel 대신 /api/users?role=student 등을 사용해야 하나 
                // 기존 /api/hrd/students 엔드포인트가 있는지 확인.
                // admin_hrd_students.ts 에서 사용하는 엔드포인트는 /api/students 였음.
                const response = await fetch('/api/students'); 
                const result = await response.json();
                const students = result.data || result;

                const select = document.getElementById('studentSelect');
                students.forEach(s => {
                    // 수강중인 과정 정보를 함께 표시하면 좋음
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
                const courseId = document.getElementById('courseFilter').value;
                
                let url = '/api/hrd/counseling?';
                if (search) url += \`search=\${encodeURIComponent(search)}&\`;
                if (courseId) url += \`course_id=\${courseId}\`;

                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                counselingData = result.success ? result.data : (Array.isArray(result) ? result : []);

                renderTable(counselingData);
            } catch (e) {
                console.error('상담 일지 로드 실패', e);
                document.getElementById('counselingList').innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        function renderTable(data) {
            const tbody = document.getElementById('counselingList');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">등록된 상담 일지가 없습니다.</td></tr>';
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis overflow-hidden max-w-[150px]">\${log.course_title || '-'}</td>
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
            document.getElementById('courseSelect').value = log.course_id || '';
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
                course_id: document.getElementById('courseSelect').value || null,
                category: document.getElementById('categorySelect').value,
                method: document.getElementById('methodSelect').value,
                content: document.getElementById('content').value,
                result: document.getElementById('result').value,
                counseling_date: document.getElementById('counselingDate').value,
                counselor_id: user.id // 현재 로그인한 사용자 ID
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
</body>
</html>
`;
