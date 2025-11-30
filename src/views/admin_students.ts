export const adminStudentsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        <aside class="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
            <div class="h-16 flex items-center px-6 border-b border-gray-200">
                <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto mr-2">
                <span class="font-bold text-gray-800 tracking-tight">관리자 시스템</span>
            </div>
            <div class="flex-1 overflow-y-auto py-4">
                <nav class="px-4 space-y-6">
                    <div>
                        <a href="/admin" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <i class="fas fa-home w-5 h-5 mr-3 text-gray-400"></i>대시보드
                        </a>
                    </div>
                    <div>
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">학사 관리</h3>
                        <ul class="space-y-1">
                            <li><a href="/admin/courses" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"><i class="fas fa-book w-5 h-5 mr-3 text-gray-400"></i>교육과정 관리</a></li>
                            <li><a href="/admin/students" class="flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"><i class="fas fa-users w-5 h-5 mr-3 text-blue-500"></i>수강생 관리</a></li>
                            <li><a href="/admin/exams" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"><i class="fas fa-file-alt w-5 h-5 mr-3 text-gray-400"></i>시험 관리</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">수강생 관리</h1>
                    <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">학사관리</span>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 탭 메뉴 -->
                <div class="bg-white rounded-t-xl border-b border-gray-200 mb-0">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button onclick="switchTab('students')" id="tab-students" class="tab-btn py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                            <i class="fas fa-user-graduate mr-2"></i>수강생 목록
                        </button>
                        <button onclick="switchTab('consultations')" id="tab-consultations" class="tab-btn py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                            <i class="fas fa-comments mr-2"></i>상담 관리
                        </button>
                    </nav>
                </div>

                <!-- 수강생 목록 탭 -->
                <div id="content-students" class="tab-content bg-white rounded-b-xl shadow-sm">
                    <!-- 필터 및 검색 -->
                    <div class="p-4 border-b border-gray-200 flex gap-4 items-center justify-between">
                        <div class="flex gap-4 items-center">
                            <div class="relative">
                                <input type="text" id="studentSearch" placeholder="이름, 이메일, 전화번호 검색..." onkeyup="filterStudents()" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                        <button onclick="loadStudents()" class="p-2 text-gray-600 hover:text-blue-600">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>

                    <!-- 테이블 -->
                    <div class="overflow-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">수강생</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">수강이력</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">최근상담</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 상담 관리 탭 -->
                <div id="content-consultations" class="tab-content bg-white rounded-b-xl shadow-sm hidden">
                    <!-- 필터 -->
                    <div class="p-4 border-b border-gray-200 flex gap-4 items-center justify-between">
                        <div class="flex gap-4">
                            <select id="consultStatusFilter" onchange="loadConsultations()" class="px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="">전체 상태</option>
                                <option value="pending">대기중</option>
                                <option value="confirmed">확정</option>
                                <option value="completed">완료</option>
                                <option value="cancelled">취소</option>
                            </select>
                            <select id="consultTypeFilter" onchange="loadConsultations()" class="px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="">전체 유형</option>
                                <option value="inquiry">문의</option>
                                <option value="phone">전화상담</option>
                                <option value="visit">방문상담</option>
                                <option value="online">온라인상담</option>
                            </select>
                        </div>
                        <button onclick="loadConsultations()" class="p-2 text-gray-600 hover:text-blue-600">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>

                    <!-- 테이블 -->
                    <div class="overflow-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">문의자</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관심과정</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">담당자</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">문의일</th>
                                </tr>
                            </thead>
                            <tbody id="consultationsTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 학생 상세 모달 -->
    <div id="studentDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
        <div class="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-xl bg-white mb-20">
            <div class="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 class="text-2xl font-bold text-gray-900" id="modalStudentName">수강생 상세</h3>
                <button onclick="closeStudentModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>

            <div class="grid grid-cols-3 gap-6 mb-6">
                <!-- 기본 정보 -->
                <div class="col-span-1 bg-gray-50 p-6 rounded-lg">
                    <h4 class="font-bold text-gray-700 mb-4 flex items-center">
                        <i class="fas fa-user mr-2 text-blue-500"></i>기본 정보
                    </h4>
                    <div class="space-y-3 text-sm">
                        <div><span class="text-gray-500">이메일:</span> <span id="detailEmail" class="font-medium"></span></div>
                        <div><span class="text-gray-500">연락처:</span> <span id="detailPhone" class="font-medium"></span></div>
                        <div><span class="text-gray-500">가입일:</span> <span id="detailCreatedAt" class="font-medium"></span></div>
                    </div>
                </div>

                <!-- 수강 현황 -->
                <div class="col-span-2 bg-blue-50 p-6 rounded-lg">
                    <h4 class="font-bold text-gray-700 mb-4 flex items-center">
                        <i class="fas fa-graduation-cap mr-2 text-blue-500"></i>수강 현황
                    </h4>
                    <div id="detailEnrollments" class="space-y-2">
                        <!-- 동적 로드 -->
                    </div>
                </div>
            </div>

            <!-- 상담/관리 이력 (다이어리 스타일) -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-700 flex items-center">
                        <i class="fas fa-book mr-2 text-green-500"></i>상담 다이어리
                    </h4>
                    <button onclick="showAddConsultationForm()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        <i class="fas fa-plus mr-2"></i>상담 기록 추가
                    </button>
                </div>

                <!-- 상담 추가 폼 -->
                <div id="addConsultationForm" class="hidden bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h5 class="font-bold text-gray-700 mb-3">새 상담 기록</h5>
                    <div class="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">상담 유형</label>
                            <select id="newConsultType" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="phone">전화상담</option>
                                <option value="visit">방문상담</option>
                                <option value="online">온라인상담</option>
                                <option value="inquiry">문의</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">관심 과정</label>
                            <select id="newConsultCourse" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="">선택 안함</option>
                                <!-- 동적 로드 -->
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
                        <textarea id="newConsultMemo" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="상담 내용을 상세히 기록하세요..."></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button onclick="hideAddConsultationForm()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</button>
                        <button onclick="submitConsultation()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">저장</button>
                    </div>
                </div>

                <!-- 다이어리 목록 -->
                <div id="detailConsultations" class="space-y-4 max-h-96 overflow-y-auto">
                    <!-- 동적 로드 -->
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStudentId = null;
        let allStudents = [];

        document.addEventListener('DOMContentLoaded', () => {
            loadStudents();
            loadCoursesForDropdown();
        });

        function switchTab(tab) {
            // 탭 버튼 스타일
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            document.getElementById('tab-' + tab).classList.remove('border-transparent', 'text-gray-500');
            document.getElementById('tab-' + tab).classList.add('border-blue-500', 'text-blue-600');

            // 컨텐츠 표시
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('content-' + tab).classList.remove('hidden');

            // 데이터 로드
            if (tab === 'students') loadStudents();
            else if (tab === 'consultations') loadConsultations();
        }

        async function loadStudents() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/students', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                allStudents = result.data || [];
                renderStudents(allStudents);
            } catch (e) {
                console.error(e);
                document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function filterStudents() {
            const search = document.getElementById('studentSearch').value.toLowerCase();
            const filtered = allStudents.filter(s => 
                (s.name && s.name.toLowerCase().includes(search)) ||
                (s.email && s.email.toLowerCase().includes(search)) ||
                (s.phone && s.phone.includes(search))
            );
            renderStudents(filtered);
        }

        function renderStudents(students) {
            const tbody = document.getElementById('studentsTableBody');
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">학생이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = students.map(s => \`
                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewStudentDetail(\${s.id})">
                    <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900">\${s.name}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-500">\${s.email}</div>
                        <div class="text-xs text-gray-400">\${s.phone || '-'}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-700">
                            수강: <span class="font-bold text-blue-600">\${s.enrollment_count || 0}</span>
                            / 수료: <span class="font-bold text-green-600">\${s.completed_count || 0}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        \${s.last_contact_date ? new Date(s.last_contact_date).toLocaleDateString() : '-'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        \${new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="text-blue-600 hover:text-blue-900" onclick="event.stopPropagation(); viewStudentDetail(\${s.id})">
                            <i class="fas fa-eye"></i> 상세보기
                        </button>
                    </td>
                </tr>
            \`).join('');
        }

        async function viewStudentDetail(studentId) {
            currentStudentId = studentId;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/students/\${studentId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (!result.success) {
                    alert('학생 정보를 불러올 수 없습니다.');
                    return;
                }

                const student = result.data;
                
                // 기본 정보
                document.getElementById('modalStudentName').textContent = student.name;
                document.getElementById('detailEmail').textContent = student.email;
                document.getElementById('detailPhone').textContent = student.phone || '-';
                document.getElementById('detailCreatedAt').textContent = new Date(student.created_at).toLocaleDateString();

                // 수강 이력
                const enrollmentsHtml = student.enrollments.length > 0 ? student.enrollments.map(e => \`
                    <div class="bg-white p-3 rounded border border-blue-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="font-bold text-sm text-gray-800">\${e.course_title}</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    진도: \${e.progress || 0}% / 출석: \${e.attendance || 0}%
                                    \${e.grade ? \` / 성적: \${e.grade}\` : ''}
                                </div>
                            </div>
                            <span class="px-2 py-1 text-xs rounded \${
                                e.status === 'completed' ? 'bg-green-100 text-green-800' :
                                e.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }">\${
                                e.status === 'completed' ? '수료' :
                                e.status === 'approved' ? '수강중' : e.status
                            }</span>
        function showAddConsultationForm() {
            document.getElementById('addConsultationForm').classList.remove('hidden');
        }

        function hideAddConsultationForm() {
            document.getElementById('addConsultationForm').classList.add('hidden');
            document.getElementById('newConsultMemo').value = '';
        }

        async function submitConsultation() {
            if (!currentStudentId) return;

            const type = document.getElementById('newConsultType').value;
            const courseId = document.getElementById('newConsultCourse').value;
            const memo = document.getElementById('newConsultMemo').value;

            if (!memo.trim()) {
                alert('상담 내용을 입력해주세요.'); 
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                
                const response = await fetch(\`/api/students/\${currentStudentId}/consultations\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        consultation_type: type,
                        course_id: courseId || null,
                        memo: memo,
                        status: 'completed',
                        consultant_id: user.id
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('상담 기록이 추가되었습니다.');
                    hideAddConsultationForm();
                    viewStudentDetail(currentStudentId); // 새로고침
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        async function loadConsultations() {
            try {
                const status = document.getElementById('consultStatusFilter').value;
                const type = document.getElementById('consultTypeFilter').value;
                
                let url = '/api/students/consultations/all?';
                if (status) url += 'status=' + status + '&';
                if (type) url += 'type=' + type;

                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                const tbody = document.getElementById('consultationsTableBody');
                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">상담 내역이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(c => \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs rounded \${
                                c.status === 'completed' ? 'bg-green-100 text-green-800' :
                                c.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }">\${c.status === 'completed' ? '완료' : c.status === 'confirmed' ? '확정' : '대기'}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs rounded bg-gray-100">\${
                                c.consultation_type === 'phone' ? '전화' :
                                c.consultation_type === 'visit' ? '방문' :
                                c.consultation_type === 'online' ? '온라인' : '문의'
                            }</span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium">\${c.name}</div>
                            <div class="text-xs text-gray-500">\${c.phone} / \${c.email || '-'}</div>
                            \${c.student_name ? \`<div class="text-xs text-blue-600">회원: \${c.student_name}</div>\` : ''}
                        </td>
                        <td class="px-6 py-4 text-sm">\${c.course_title || '-'}</td>
                        <td class="px-6 py-4 text-sm">\${c.consultant_name || '-'}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">\${new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                \`).join('');
            } catch (e) {
                console.error(e);
                document.getElementById('consultationsTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        //다이어리 스타일 렌더링 함수들
        function renderConsultationDiary(consultations) {
            // 날짜별로 그룹화
            const grouped = {};
            consultations.forEach(c => {
                const date = new Date(c.created_at).toLocaleDateString();
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(c);
            });

            // 날짜별로 렌더링
            return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => \`
                <div class="date-group mb-6">
                    <div class="flex items-center mb-3">
                        <div class="flex-1 border-t border-gray-300"></div>
                        <div class="px-4 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                            <i class="fas fa-calendar-day mr-2"></i>\${date}
                        </div>
                        <div class="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div class="space-y-3">
                        \${grouped[date].map(c => renderConsultationCard(c)).join('')}
                    </div>
                </div>
            \`).join('');
        }

        // 상담 카드 렌더링
        function renderConsultationCard(c) {
            const typeColors = {
                phone: 'bg-green-100 text-green-800',
                visit: 'bg-purple-100 text-purple-800',
                online: 'bg-blue-100 text-blue-800',
                inquiry: 'bg-gray-100 text-gray-800'
            };
            const typeLabels = {
                phone: '전화상담',
                visit: '방문상담',
                online: '온라인상담',
                inquiry: '문의'
            };

            return \`
                <div class="consultation-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition group" data-id="\${c.id}">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 text-xs font-bold rounded-full \${typeColors[c.consultation_type] || 'bg-gray-100 text-gray-800'}">
                                \${typeLabels[c.consultation_type] || c.consultation_type}
                            </span>
                            <span class="text-xs text-gray-400">\${new Date(c.created_at).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        <div class="opacity-0 group-hover:opacity-100 transition flex gap-1">
                            <button onclick="editConsultation(\${c.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="수정">
                                <i class="fas fa-edit text-sm"></i>
                            </button>
                            <button onclick="deleteConsultation(\${c.id})" class="p-1.5 text-red-600 hover:bg-red-50 rounded" title="삭제">
                                <i class="fas fa-trash-alt text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <!-- 내용 표시 모드 -->
                    <div id="view-\${c.id}" class="view-mode">
                        \${c.memo ? \`
                            <div class="text-sm text-gray-700 mb-2 whitespace-pre-wrap">\${c.memo}</div>
                        \` : '<div class="text-sm text-gray-400 italic">내용 없음</div>'}
                        <div class="flex flex-wrap gap-3 text-xs text-gray-500">
                            \${c.course_title ? \`<span><i class="fas fa-book mr-1"></i>\${c.course_title}</span>\` : ''}
                            \${c.consultant_name ? \`<span><i class="fas fa-user mr-1"></i>\${c.consultant_name}</span>\` : ''}
                            \${c.campus_name ? \`<span><i class="fas fa-map-marker-alt mr-1"></i>\${c.campus_name}</span>\` : ''}
                        </div>
                    </div>

                    <!-- 편집 모드 -->
                    <div id="edit-\${c.id}" class="edit-mode hidden">
                        <div class="mb-2">
                            <select id="edit-type-\${c.id}" class="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                                <option value="phone" \${c.consultation_type === 'phone' ? 'selected' : ''}>전화상담</option>
                                <option value="visit" \${c.consultation_type === 'visit' ? 'selected' : ''}>방문상담</option>
                                <option value="online" \${c.consultation_type === 'online' ? 'selected' : ''}>온라인상담</option>
                                <option value="inquiry" \${c.consultation_type === 'inquiry' ? 'selected' : ''}>문의</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <select id="edit-course-\${c.id}" class="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                                <option value="">과정 선택 안함</option>
                            </select>
                        </div>
                        <textarea id="edit-memo-\${c.id}" rows="3" class="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2">\${c.memo || ''}</textarea>
                        <div class="flex justify-end gap-2">
                            <button onclick="cancelEditConsultation(\${c.id})" class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">취소</button>
                            <button onclick="saveConsultation(\${c.id})" class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                        </div>
                    </div>
                </div>
            \`;
        }

        // 상담 수정 모드 전환
        function editConsultation(id) {
            document.getElementById(\`view-\${id}\`).classList.add('hidden');
            document.getElementById(\`edit-\${id}\`).classList.remove('hidden');
            loadCoursesIntoSelect(\`edit-course-\${id}\`);
        }

        function cancelEditConsultation(id) {
            document.getElementById(\`view-\${id}\`).classList.remove('hidden');
            document.getElementById(\`edit-\${id}\`).classList.add('hidden');
        }

        async function saveConsultation(id) {
            try {
                const type = document.getElementById(\`edit-type-\${id}\`).value;
                const courseId = document.getElementById(\`edit-course-\${id}\`).value;
                const memo = document.getElementById(\`edit-memo-\${id}\`).value;
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                const response = await fetch(\`/api/students/\${currentStudentId}/consultations/\${id}\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        consultation_type: type,
                        course_id: courseId || null,
                        memo: memo,
                        status: 'completed',
                        consultant_id: user.id
                    })
                });

                const result = await response.json();
                if (result.success) {
                    viewStudentDetail(currentStudentId);
                } else {
                    alert('수정 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        async function deleteConsultation(id) {
            if (!confirm('이 상담 기록을 삭제하시겠습니까?\\n삭제된 데이터는 복구할 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/students/\${currentStudentId}/consultations/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                const result = await response.json();
                if (result.success) {
                    viewStudentDetail(currentStudentId);
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        function loadCoursesIntoSelect(selectId) {
            const select = document.getElementById(selectId);
            if (!select || select.options.length > 1) return;
            const courseSelectTemplate = document.getElementById('newConsultCourse');
            if (courseSelectTemplate) {
                Array.from(courseSelectTemplate.options).forEach(opt => {
                    if (opt.value) {
                        const newOpt = opt.cloneNode(true);
                        select.appendChild(newOpt);
                    }
                });
            }
        }

        async function loadCoursesForDropdown() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('newConsultCourse');
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    </script>
</body>
</html>
`;
