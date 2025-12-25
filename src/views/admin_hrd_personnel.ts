import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdPersonnelHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교강사 관리 - HRD 행정시스템</title>
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
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${hrdSidebar('personnel')}

        <!-- 메인 콘텐츠 -->
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">교강사 관리</h2>
                    <span class="ml-4 text-sm text-gray-500">전체 교강사 목록 및 승인 관리</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="openCreateModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 교강사 등록
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
                <!-- 탭 메뉴 -->
                <div class="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
                    <button onclick="switchTab('list')" id="tab-list" class="px-6 py-2 rounded-md text-sm font-medium transition-all bg-white text-gray-800 shadow-sm">
                        교강사 목록
                    </button>
                    <button onclick="switchTab('pending')" id="tab-pending" class="px-6 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-800 relative">
                        승인 대기
                        <span id="pendingBadge" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full hidden"></span>
                    </button>
                </div>

                <!-- 필터 및 검색 (목록 탭에서만 표시) -->
                <div id="filterSection" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div class="flex flex-wrap gap-4 items-center justify-between">
                        <div class="flex gap-4">
                            <select id="typeFilter" onchange="loadPersonnel()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">전체 구분</option>
                                <option value="full">전임</option>
                                <option value="part">파트타임</option>
                                <option value="external">외부강사</option>
                            </select>
                            <select id="statusFilter" onchange="loadPersonnel()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">전체 상태</option>
                                <option value="active">재직</option>
                                <option value="leave">휴직</option>
                                <option value="retired">퇴직</option>
                            </select>
                        </div>
                        <div class="relative">
                            <input type="text" id="searchInput" placeholder="이름 또는 연락처 검색" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                <!-- 교강사 목록 테이블 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 w-16">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                </th>
                                <th class="px-6 py-4">이름/직위</th>
                                <th class="px-6 py-4">담당 과목</th>
                                <th class="px-6 py-4">연락처</th>
                                <th class="px-6 py-4">고용 형태</th>
                                <th class="px-6 py-4">상태</th>
                                <th class="px-6 py-4">가입일/등록일</th>
                                <th class="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody id="personnelTableBody" class="divide-y divide-gray-100">
                            <tr>
                                <td colspan="8" class="px-6 py-10 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <!-- 페이지네이션 (간소화) -->
                    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span class="text-sm text-gray-500">총 <span id="totalCount">0</span>명</span>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 교강사 등록/수정 모달 -->
    <div id="createPersonnelModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="modalTitle">교강사 등록</h3>
                <button onclick="closeModal('createPersonnelModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <form id="personnelForm" onsubmit="handleSavePersonnel(event)" class="p-6 space-y-4">
                <input type="hidden" name="id" id="personnelId">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">이름 <span class="text-red-500">*</span></label>
                        <input type="text" name="name" id="pName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">직위</label>
                        <input type="text" name="position" id="pPosition" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 전임강사">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">이메일 <span class="text-red-500">*</span></label>
                    <input type="email" name="email" id="pEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">연락처 <span class="text-red-500">*</span></label>
                    <input type="text" name="phone" id="pPhone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="010-0000-0000">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">프로필 사진</label>
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                            <i class="fas fa-user text-gray-300 text-2xl" id="pImagePlaceholder"></i>
                            <img id="pImagePreview" src="" class="w-full h-full object-cover hidden">
                            <button type="button" onclick="clearPImage()" class="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="flex-1">
                             <input type="hidden" name="profile_image" id="pImageUrl">
                             <input type="file" id="pImageFile" accept="image/*" class="hidden" onchange="handlePImage(this)">
                             <button type="button" onclick="document.getElementById('pImageFile').click()" class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center">
                                <i class="fas fa-camera mr-2"></i> 이미지 선택
                             </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">담당 과목</label>
                    <input type="text" name="subject" id="pSubject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 3D 모델링, 제품디자인">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">고용 형태</label>
                        <select name="type" id="pType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="full">전임</option>
                            <option value="part">파트타임</option>
                            <option value="external">외부강사</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
                        <select name="instructor_status" id="pStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="active">재직</option>
                            <option value="leave">휴직</option>
                            <option value="retired">퇴직</option>
                        </select>
                    </div>
                </div>
                
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">입사일</label>
                     <input type="date" name="joined_at" id="pJoined" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>

                <div class="pt-4 flex justify-end space-x-3">
                    <button type="button" onclick="closeModal('createPersonnelModal')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let currentTab = 'list';
        let allPersonnel = [];

        document.addEventListener('DOMContentLoaded', () => {
             loadData();
        });

        async function loadData() {
            try {
                const response = await fetch('/api/hrd/personnel');
                const result = await response.json();
                if (result.success) {
                    allPersonnel = result.data;
                    updateBadge();
                    renderTable();
                } else {
                    document.getElementById('personnelTableBody').innerHTML = '<tr><td colspan="8" class="text-center py-10 text-red-500">데이터 로드 실패</td></tr>';
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        function updateBadge() {
            const pendingCount = allPersonnel.filter(p => p.user_status === 'pending').length;
            const badge = document.getElementById('pendingBadge');
            if (pendingCount > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function switchTab(tab) {
            currentTab = tab;
            document.getElementById('tab-list').className = tab === 'list' 
                ? 'px-6 py-2 rounded-md text-sm font-medium transition-all bg-white text-gray-800 shadow-sm'
                : 'px-6 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-800';
            
            document.getElementById('tab-pending').className = tab === 'pending'
                ? 'px-6 py-2 rounded-md text-sm font-medium transition-all bg-white text-gray-800 shadow-sm relative'
                : 'px-6 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-800 relative';
            
            // 필터 보이기/숨기기
            const filterSection = document.getElementById('filterSection');
            if (tab === 'list') filterSection.classList.remove('hidden');
            else filterSection.classList.add('hidden');

            renderTable();
        }

        function renderTable() {
            // 필터 값 가져오기
            const search = document.getElementById('searchInput').value.toLowerCase();
            const type = document.getElementById('typeFilter').value;
            const status = document.getElementById('statusFilter').value;

            // 데이터 필터링
            let filtered = allPersonnel;

            if (currentTab === 'pending') {
                filtered = filtered.filter(p => p.user_status === 'pending');
            } else {
                // 목록 탭
                filtered = filtered.filter(p => p.user_status !== 'pending');

                if (type) filtered = filtered.filter(p => p.type === type);
                
                if (status) {
                    filtered = filtered.filter(p => p.instructor_status === status);
                } else {
                    // 기본적으로 '퇴직' 상태는 숨김 (삭제된 효과)
                    filtered = filtered.filter(p => p.instructor_status !== 'retired');
                }
            }
            
            // 공통 검색
            if (search) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(search) || 
                    p.phone.includes(search) ||
                    p.email.toLowerCase().includes(search)
                );
            }

            const tbody = document.getElementById('personnelTableBody');
            const totalCount = document.getElementById('totalCount');
            totalCount.textContent = filtered.length;

             if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-gray-500">데이터가 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = filtered.map(p => {
                // 데이터 직렬화 (따옴표 이스케이프)
                const pData = JSON.stringify(p).replace(/"/g, '&quot;');
                
                // 상태 뱃지
                let statusBadge = '';
                if (p.user_status === 'pending') {
                    statusBadge = '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">승인 대기</span>';
                } else if (p.user_status === 'suspended') {
                    statusBadge = '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">이용 정지</span>';
                } else if (p.instructor_status === 'active') {
                    statusBadge = '<span class="inline-flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>재직</span>';
                } else {
                    statusBadge = \`<span class="inline-flex items-center"><span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>\${p.instructor_status === 'retired' ? '퇴직' : p.instructor_status || '미정'}</span>\`;
                }
                
                // 관리 버튼
                let actionBtns = '';
                if (currentTab === 'pending') {
                    actionBtns = \`
                        <button onclick="approveTeacher(\${p.id})" class="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-600 px-2 py-1 rounded mr-1">승인</button>
                        <button onclick="rejectTeacher(\${p.id})" class="text-red-500 hover:text-red-700 font-medium text-xs border border-red-500 px-2 py-1 rounded">거절</button>
                    \`;
                } else {
                    actionBtns = \`
                        <button onclick="openEditModal(\${pData})" class="text-blue-600 hover:text-blue-900 mr-3" title="수정"><i class="fas fa-edit"></i></button>
                        <button onclick="deletePersonnel(\${p.id})" class="text-red-600 hover:text-red-900" title="퇴직(삭제)"><i class="fas fa-trash"></i></button>
                    \`;
                }

                return \`
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                \${p.profile_image 
                                    ? \`<img src="\${p.profile_image}" class="w-8 h-8 rounded-full object-cover mr-3">\`
                                    : \`<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">\${p.name.charAt(0)}</div>\`
                                }
                                <div>
                                    <div class="font-medium text-gray-800">\${p.name}</div>
                                    <div class="text-xs text-gray-500">\${p.position || '-'}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-600">\${p.subject || '-'}</td>
                        <td class="px-6 py-4 text-gray-600">\${p.phone}<br><span class="text-xs text-gray-400">\${p.email}</span></td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 \${
                                p.type === 'full' ? 'bg-blue-50 text-blue-700' :
                                p.type === 'part' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'
                            } rounded text-xs font-medium">
                                \${p.type === 'full' ? '전임' : p.type === 'part' ? '파트타임' : '외부강사'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            \${statusBadge}
                        </td>
                        <td class="px-6 py-4 text-gray-500">\${(p.joined_at || '-').split(' ')[0]}</td>
                        <td class="px-6 py-4 text-right">
                            \${actionBtns}
                        </td>
                    </tr>
                \`;
            }).join('');
        }
        
        window.loadPersonnel = renderTable;

        // Approve Function
        async function approveTeacher(id) {
            if (!confirm('해당 강사를 승인하시겠습니까?')) return;
            try {
                const response = await fetch(\`/api/hrd/personnel/\${id}/approve\`, { method: 'PUT' });
                const result = await response.json();
                if (result.success) {
                    alert('승인되었습니다.');
                    loadData(); 
                } else {
                    alert('실패: ' + result.error);
                }
            } catch(e) {
                console.error(e);
                alert('오류 발생');
            }
        }

        // Reject Function
        async function rejectTeacher(id) {
            if (!confirm('승인을 거절하고 계정을 정지하시겠습니까?')) return;
            try {
                const response = await fetch(\`/api/hrd/personnel/\${id}/reject\`, { method: 'PUT' });
                const result = await response.json();
                if (result.success) {
                    alert('승인이 거절되었습니다.');
                    loadData();
                } else {
                    alert('실패: ' + result.error);
                }
            } catch(e) {
                console.error(e);
                alert('오류 발생');
            }
        }
        
        // Delete Function
        async function deletePersonnel(id) {
            if (!confirm('해당 교강사를 퇴직(삭제) 처리하시겠습니까?\\n(목록에서 사라지거나 퇴직 상태로 변경됩니다)')) return;
             try {
                const response = await fetch(\`/api/hrd/personnel/\${id}\`, { method: 'DELETE' });
                const result = await response.json();
                if (result.success) {
                    alert('처리되었습니다.');
                    loadData();
                } else {
                    alert('실패: ' + result.error);
                }
            } catch(e) {
                console.error(e);
                alert('오류 발생');
            }
        }

        async function handleSavePersonnel(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;

            try {
                let url = '/api/hrd/personnel';
                let method = 'POST';
                if (id) {
                    url = '/api/hrd/personnel/' + id;
                    method = 'PUT';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    closeModal('createPersonnelModal');
                    loadData();
                } else {
                    alert('실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        function openCreateModal() {
            document.getElementById('modalTitle').textContent = '교강사 등록';
            document.getElementById('personnelForm').reset();
            document.getElementById('personnelId').value = '';
            // 기본값 설정
            document.getElementById('pStatus').value = 'active';
            clearPImage();
            document.getElementById('createPersonnelModal').classList.remove('hidden');
        }

        function handlePImage(input) {
            if(!input.files || !input.files[0]) return;
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX = 400; // Profile needs smaller size

                    if (width > height) {
                        if (width > MAX) { height *= MAX / width; width = MAX; }
                    } else {
                        if (height > MAX) { width *= MAX / height; height = MAX; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    document.getElementById('pImageUrl').value = dataUrl;
                    document.getElementById('pImagePreview').src = dataUrl;
                    document.getElementById('pImagePreview').classList.remove('hidden');
                    document.getElementById('pImagePlaceholder').classList.add('hidden');
                }
            }
        }

        function clearPImage() {
            document.getElementById('pImageUrl').value = '';
            document.getElementById('pImagePreview').src = '';
            document.getElementById('pImagePreview').classList.add('hidden');
            document.getElementById('pImagePlaceholder').classList.remove('hidden');
            document.getElementById('pImageFile').value = '';
        }

        function openEditModal(data) {
            document.getElementById('modalTitle').textContent = '교강사 정보 수정';
            document.getElementById('personnelId').value = data.id;
            document.getElementById('pName').value = data.name;
            document.getElementById('pEmail').value = data.email;
            document.getElementById('pPhone').value = data.phone;
            document.getElementById('pPosition').value = data.position || '';
            document.getElementById('pSubject').value = data.subject || '';
            document.getElementById('pType').value = data.type || 'full';
            document.getElementById('pStatus').value = data.instructor_status || 'active';
            if (data.joined_at) document.getElementById('pJoined').value = data.joined_at.split(' ')[0];
            
            if (data.profile_image) {
                document.getElementById('pImageUrl').value = data.profile_image;
                document.getElementById('pImagePreview').src = data.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
            } else {
                clearPImage();
            }

            document.getElementById('createPersonnelModal').classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        // 검색 엔터 처리
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderTable();
        });
    </script>
</body>
</html>
`;
