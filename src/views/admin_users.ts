import { hrdSidebar } from './components/hrd_sidebar';

export const adminUsersHtml = (activeMenu: string = 'users') => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원 관리 - 3DCookie HD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
        .role-badge { @apply px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider; }
        .role-student { @apply bg-blue-50 text-blue-600; }
        .role-teacher { @apply bg-purple-50 text-purple-600; }
        .role-admin { @apply bg-red-50 text-red-600; }
        .status-active { @apply bg-green-50 text-green-600; }
        .status-pending { @apply bg-yellow-50 text-yellow-600; }
        .status-suspended { @apply bg-gray-50 text-gray-600; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b]">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar(activeMenu, { alwaysVisible: true })}
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- 헤더 -->
            <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
                <div>
                    <h2 class="text-xl font-bold tracking-tight text-gray-900">회원 권한 관리</h2>
                    <p class="text-xs text-gray-400 mt-0.5">시스템 사용자 역할 및 권한을 관리합니다.</p>
                </div>
                <div class="flex gap-3 items-center">
                    <div class="text-right mr-2">
                        <p class="text-xs text-gray-400">총 회원 수</p>
                        <p class="text-2xl font-bold text-gray-900" id="totalUsers">0</p>
                    </div>
                    <button onclick="openUserModal()" class="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition flex items-center shadow-lg shadow-gray-200 font-semibold text-sm">
                        <i class="fas fa-user-plus mr-2"></i> 신규 회원 등록
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
                <!-- 필터 섹션 -->
                <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap gap-4 items-center">
                    <div class="relative flex-1 min-w-[300px]">
                        <input type="text" id="searchInput" placeholder="이름, 이메일, 전화번호로 검색" class="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm">
                        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
                    </div>
                    <div class="min-w-[150px]">
                        <select id="roleFilter" class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm cursor-pointer">
                            <option value="">전체 역할</option>
                            <option value="student">수강생</option>
                            <option value="teacher">강사</option>
                            <option value="admin">관리자</option>
                        </select>
                    </div>
                    <div class="min-w-[150px]">
                        <select id="statusFilter" class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm cursor-pointer">
                            <option value="">전체 상태</option>
                            <option value="active">활성</option>
                            <option value="pending">승인대기</option>
                            <option value="suspended">정지</option>
                        </select>
                    </div>
                    <button onclick="loadUsers()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm">
                        <i class="fas fa-filter mr-2"></i> 필터 적용
                    </button>
                </div>

                <!-- 사용자 테이블 -->
                <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">이름</th>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">이메일</th>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">연락처</th>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">역할</th>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">상태</th>
                                <th class="px-8 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">가입일</th>
                                <th class="px-8 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody" class="divide-y divide-gray-100">
                            <tr><td colspan="7" class="px-8 py-20 text-center text-gray-400 font-medium">로딩 중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <!-- 회원 상세/편집 모달 -->
    <div id="userModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div id="modalBackdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
        <div id="modalPanel" class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl scale-95 opacity-0 transition-all duration-300 max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl z-10">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900" id="modalTitle">회원 정보</h3>
                        <p class="text-xs text-gray-400 mt-1" id="modalSubtitle">사용자 역할 및 권한 설정</p>
                    </div>
                    <button onclick="closeUserModal()" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>

            <form id="userForm" onsubmit="handleSaveUser(event)" class="p-6 space-y-6">
                <input type="hidden" id="userId" name="id">
                
                <!-- 기본 정보 -->
                <div class="space-y-4">
                    <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                        <i class="fas fa-user mr-2 text-blue-500"></i> 기본 정보
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">이름 *</label>
                            <input type="text" id="userName" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">생년월일</label>
                            <input type="date" id="userBirthdate" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">이메일 *</label>
                        <input type="email" id="userEmail" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">연락처</label>
                        <input type="tel" id="userPhone" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none" placeholder="010-0000-0000">
                    </div>
                </div>

                <!-- 역할 및 권한 -->
                <div class="space-y-4">
                    <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                        <i class="fas fa-user-shield mr-2 text-purple-500"></i> 역할 및 권한
                    </h4>
                    <div>
                        <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">시스템 역할 *</label>
                        <select id="userRole" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none appearance-none cursor-pointer">
                            <option value="student">수강생 (Student)</option>
                            <option value="teacher">강사 (Teacher)</option>
                            <option value="admin">관리자 (Admin)</option>
                        </select>
                        <p class="text-xs text-gray-400 mt-2 ml-1">
                            <i class="fas fa-info-circle mr-1"></i>
                            수강생: 학습 기능만 이용 | 강사: 수업 관리 가능 | 관리자: 전체 시스템 관리
                        </p>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">계정 상태</label>
                        <select id="userStatus" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none appearance-none cursor-pointer">
                            <option value="active">활성 (Active)</option>
                            <option value="pending">승인대기 (Pending)</option>
                            <option value="suspended">정지 (Suspended)</option>
                        </select>
                    </div>
                </div>

                <!-- 비밀번호 재설정 (선택사항) -->
                <div class="space-y-4 border-t border-gray-100 pt-6">
                    <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                        <i class="fas fa-key mr-2 text-orange-500"></i> 비밀번호 설정 (선택)
                    </h4>
                    <div>
                        <label class="text-xs font-bold text-gray-500 ml-1 mb-2 block">새 비밀번호</label>
                        <input type="password" id="userPassword" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none" placeholder="변경 시에만 입력">
                        <p class="text-xs text-gray-400 mt-2 ml-1">비밀번호는 최소 8자 이상이어야 합니다.</p>
                    </div>
                </div>

                <!-- 저장 버튼 -->
                <div class="flex gap-3 pt-6">
                    <button type="button" onclick="closeUserModal()" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                        취소
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                        <i class="fas fa-save mr-2"></i> 저장
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 배정 해제 모달 (삭제 불가 시 표시) -->
    <div id="assignmentsModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div id="assignmentsBackdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
        <div id="assignmentsPanel" class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col scale-95 opacity-0 transition-all duration-300">
            <div class="flex-none border-b border-gray-100 p-6 rounded-t-3xl">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900">삭제를 막는 배정 목록</h3>
                        <p id="assignmentsModalMessage" class="text-sm text-gray-500 mt-1">아래 항목에서 배정을 해제한 후 회원 삭제를 시도해 주세요.</p>
                    </div>
                    <button type="button" onclick="closeAssignmentsModal()" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            <div id="assignmentsContent" class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- 과정, 훈련일지, 과제 목록이 여기 채워짐 -->
            </div>
            <div class="flex-none border-t border-gray-100 p-6 rounded-b-3xl flex gap-3">
                <button type="button" onclick="closeAssignmentsModal()" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">닫기</button>
                <button type="button" id="assignmentsRetryDeleteBtn" onclick="retryDeleteAfterAssignments()" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition hidden">
                    <i class="fas fa-trash-alt mr-2"></i>삭제 다시 시도
                </button>
            </div>
        </div>
    </div>

    <script>
        let usersData = [];

        document.addEventListener('DOMContentLoaded', () => {
            loadUsers();
            
            // 검색 및 필터 이벤트
            document.getElementById('searchInput').addEventListener('input', debounce(loadUsers, 300));
            document.getElementById('roleFilter').addEventListener('change', loadUsers);
            document.getElementById('statusFilter').addEventListener('change', loadUsers);
        });

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        async function loadUsers() {
            const tbody = document.getElementById('usersTableBody');
            const totalCount = document.getElementById('totalUsers');
            const search = document.getElementById('searchInput').value.trim();
            const role = document.getElementById('roleFilter').value;
            const status = document.getElementById('statusFilter').value;

            try {
                let url = '/api/users?';
                if (search) url += 'search=' + encodeURIComponent(search) + '&';
                if (role) url += 'role=' + role + '&';
                if (status) url += 'status=' + status;

                const token = localStorage.getItem('token');
                if (!token) {
                    location.href = '/login';
                    return;
                }

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.status === 401 || response.status === 403) {
                    location.href = '/login';
                    return;
                }

                const result = await response.json();

                if (result.success) {
                    usersData = result.data || [];
                    if (totalCount) totalCount.textContent = usersData.length;

                    if (usersData.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" class="px-8 py-20 text-center text-gray-400 font-medium">검색 결과가 없습니다.</td></tr>';
                        return;
                    }

                    tbody.innerHTML = usersData.map(user => getUserRowHtml(user)).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-8 py-20 text-center text-red-400 font-medium">오류: ' + (result.error || '데이터를 불러올 수 없습니다.') + '</td></tr>';
                }
            } catch (e) {
                console.error('사용자 로딩 실패:', e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-8 py-20 text-center text-red-400 font-medium">서버 연결 실패</td></tr>';
            }
        }

        function getUserRowHtml(user) {
            const roleLabels = { student: '수강생', teacher: '강사', admin: '관리자' };
            const roleClasses = { student: 'role-student', teacher: 'role-teacher', admin: 'role-admin' };
            const statusLabels = { active: '활성', pending: '승인대기', suspended: '정지' };
            const statusClasses = { active: 'status-active', pending: 'status-pending', suspended: 'status-suspended' };

            const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-';

            return \`
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-8 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                \${user.name?.charAt(0) || '?'}
                            </div>
                            <span class="font-semibold text-gray-900">\${user.name || '-'}</span>
                        </div>
                    </td>
                    <td class="px-8 py-4 text-sm text-gray-600">\${user.email || '-'}</td>
                    <td class="px-8 py-4 text-sm text-gray-600">\${user.phone || '-'}</td>
                    <td class="px-8 py-4">
                        <span class="role-badge \${roleClasses[user.role] || 'bg-gray-100 text-gray-600'}">
                            \${roleLabels[user.role] || user.role || '-'}
                        </span>
                    </td>
                    <td class="px-8 py-4">
                        <span class="role-badge \${statusClasses[user.status] || 'bg-gray-100 text-gray-600'}">
                            \${statusLabels[user.status] || user.status || 'active'}
                        </span>
                    </td>
                    <td class="px-8 py-4 text-sm text-gray-500">\${createdAt}</td>
                    <td class="px-8 py-4">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="editUser(\${user.id})" class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition" title="수정">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <button onclick="resetPassword(\${user.id})" class="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition" title="비밀번호 초기화">
                                <i class="fas fa-key text-xs"></i>
                            </button>
                            <button onclick="deleteUser(\${user.id})" class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition" title="삭제">
                                <i class="fas fa-trash text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            \`;
        }

        async function resetPassword(id) {
            const user = usersData.find(u => u.id == id);
            if (!user) return;
            
            if (!confirm(user.name + ' 님의 비밀번호를 초기화하시겠습니까?\\n\\n초기화 시 무작위 임시 비밀번호가 생성되며, 사용자는 로그인 시 비밀번호 변경 안내를 받게 됩니다.')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/users/' + id + '/reset-password', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const result = await response.json();
                if (result.success) {
                    showTempPasswordModal(user.name, result.temp_password);
                } else {
                    alert('초기화 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) {
                console.error('비밀번호 초기화 실패:', e);
                alert('서버 연결 실패');
            }
        }

        function showTempPasswordModal(userName, tempPassword) {
            const modalHtml = \`
                <div id="tempPasswordModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100">
                        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                            <i class="fas fa-key text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">비밀번호 초기화 성공</h3>
                        <p class="text-sm text-gray-500 mb-6">\${userName} 님의 신규 비밀번호입니다.</p>
                        
                        <div class="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                            <code class="text-2xl font-black text-blue-600 tracking-wider flex-1 ml-4">\${tempPassword}</code>
                            <button onclick="copyPasswordToClipboard('\${tempPassword}')" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 transition flex items-center justify-center shadow-sm">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        
                        <button onclick="document.getElementById('tempPasswordModal').remove()" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition shadow-lg">
                            확인 및 닫기
                        </button>
                    </div>
                </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        function copyPasswordToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('비밀번호가 복사되었습니다. 사용자에게 전달해 주세요.');
            });
        }

        function openUserModal() {
            const modal = document.getElementById('userModal');
            const backdrop = document.getElementById('modalBackdrop');
            const panel = document.getElementById('modalPanel');

            modal.classList.remove('hidden');
            setTimeout(() => {
                backdrop.classList.add('opacity-100');
                panel.classList.remove('scale-95', 'opacity-0');
                panel.classList.add('scale-100', 'opacity-100');
            }, 10);

            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('modalTitle').textContent = '신규 회원 등록';
            document.getElementById('modalSubtitle').textContent = '새로운 사용자를 시스템에 추가합니다.';
        }

        function closeUserModal() {
            const modal = document.getElementById('userModal');
            const backdrop = document.getElementById('modalBackdrop');
            const panel = document.getElementById('modalPanel');

            backdrop.classList.remove('opacity-100');
            panel.classList.remove('scale-100', 'opacity-100');
            panel.classList.add('scale-95', 'opacity-0');

            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }

        async function editUser(id) {
            const user = usersData.find(u => u.id == id);
            if (!user) return;

            openUserModal();
            
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name || '';
            document.getElementById('userEmail').value = user.email || '';
            document.getElementById('userPhone').value = user.phone || '';
            document.getElementById('userBirthdate').value = user.birthdate || '';
            document.getElementById('userRole').value = user.role || 'student';
            document.getElementById('userStatus').value = user.status || 'active';
            
            document.getElementById('modalTitle').textContent = user.name + ' 회원 정보 수정';
            document.getElementById('modalSubtitle').textContent = 'ID: #' + user.id + ' | ' + user.email;
        }

        async function handleSaveUser(e) {
            e.preventDefault();

            const id = document.getElementById('userId').value;
            const formData = {
                id: id || undefined,
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                phone: document.getElementById('userPhone').value.trim() || null,
                birthdate: document.getElementById('userBirthdate').value || null,
                role: document.getElementById('userRole').value,
                status: document.getElementById('userStatus').value || 'active',
                password: document.getElementById('userPassword').value || undefined
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/users', {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (result.success) {
                    alert('회원 정보가 ' + (id ? '수정' : '등록') + '되었습니다.');
                    closeUserModal();
                    await loadUsers();
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (e) {
                console.error('저장 실패:', e);
                alert('서버 연결 실패');
            }
        }

        let _assignmentsUserId = null;

        async function deleteUser(id) {
            if (!confirm('정말 이 회원을 삭제하시겠습니까?\\n\\n이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/users/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                const result = await response.json();
                if (result.success) {
                    alert('회원이 삭제되었습니다.');
                    await loadUsers();
                } else {
                    if (result.assignments && (result.assignments.courses?.length || result.assignments.training_logs?.length || result.assignments.assignments?.length)) {
                        _assignmentsUserId = id;
                        openAssignmentsModal(id, result.error, result.assignments);
                    } else {
                        alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
                    }
                }
            } catch (e) {
                console.error('삭제 실패:', e);
                alert('서버 연결 실패');
            }
        }

        function openAssignmentsModal(userId, message, data) {
            document.getElementById('assignmentsModal').classList.remove('hidden');
            document.getElementById('assignmentsModalMessage').textContent = message || '아래 항목에서 배정을 해제한 후 삭제해 주세요.';
            document.getElementById('assignmentsRetryDeleteBtn').classList.add('hidden');
            renderAssignmentsContent(data);
            setTimeout(() => {
                document.getElementById('assignmentsBackdrop').classList.add('opacity-100');
                document.getElementById('assignmentsPanel').classList.remove('scale-95', 'opacity-0');
                document.getElementById('assignmentsPanel').classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeAssignmentsModal() {
            document.getElementById('assignmentsBackdrop').classList.remove('opacity-100');
            document.getElementById('assignmentsPanel').classList.remove('scale-100', 'opacity-100');
            document.getElementById('assignmentsPanel').classList.add('scale-95', 'opacity-0');
            setTimeout(() => { document.getElementById('assignmentsModal').classList.add('hidden'); _assignmentsUserId = null; }, 300);
        }

        function renderAssignmentsContent(data) {
            const d = data || { courses: [], training_logs: [], assignments: [] };
            const courses = d.courses || [];
            const logs = d.training_logs || [];
            const assignments = d.assignments || [];
            
            let html = '';
            if (courses.length) {
                html += '<div><h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center"><i class="fas fa-chalkboard-teacher mr-2 text-purple-500"></i>과정 강사 배정 (' + courses.length + '건)</h4><ul class="space-y-2">';
                html += courses.map(c => '<li class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"><span class="text-sm text-gray-800">' + escapeHtml(c.title || '과정 #'+c.id) + '</span><button type="button" onclick="unassignCourse(' + c.id + ')" class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-200 transition">배정 해제</button></li>').join('');
                html += '</ul></div>';
            }
            if (logs.length) {
                html += '<div class="mt-6"><h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center"><i class="fas fa-clipboard-list mr-2 text-blue-500"></i>훈련일지 강사 배정 (' + logs.length + '건)</h4><ul class="space-y-2">';
                html += logs.map(l => '<li class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"><span class="text-sm text-gray-800">' + escapeHtml((l.course_title || '과정') + ' · ' + (l.date || '')) + '</span><button type="button" onclick="unassignTrainingLog(' + l.id + ')" class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-200 transition">배정 해제</button></li>').join('');
                html += '</ul></div>';
            }
            if (!courses.length && !logs.length && !assignments.length) {
                html = '<p class="text-sm text-gray-500 py-4 text-center">해제할 배정이 없습니다. 삭제를 다시 시도해 주세요.</p>';
            }
            
            document.getElementById('assignmentsContent').innerHTML = html;
            const total = courses.length + logs.length + assignments.length;
            document.getElementById('assignmentsRetryDeleteBtn').classList.toggle('hidden', total > 0);
        }

        function escapeHtml(s) {
            if (s == null) return '';
            const div = document.createElement('div');
            div.textContent = s;
            return div.innerHTML;
        }

        async function unassignCourse(courseId) {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/courses/' + courseId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ teacher_id: null })
            });
            const json = await res.json();
            if (json.success) { await refreshAssignmentsModal(); return; }
            alert('과정 배정 해제 실패');
        }

        async function unassignTrainingLog(logId) {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/hrd/training-logs/' + logId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ instructor_id: null })
            });
            const json = await res.json();
            if (json.success) { await refreshAssignmentsModal(); return; }
            alert('훈련일지 배정 해제 실패');
        }

        async function refreshAssignmentsModal() {
            if (!_assignmentsUserId) return;
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/' + _assignmentsUserId + '/assignments', { headers: { 'Authorization': 'Bearer ' + token } });
            const json = await res.json();
            if (json.success && json.data) {
                renderAssignmentsContent(json.data);
            }
        }

        async function retryDeleteAfterAssignments() {
            if (!_assignmentsUserId) return;
            closeAssignmentsModal();
            await deleteUser(_assignmentsUserId);
        }
    </script>
</body>
</html>
`;
