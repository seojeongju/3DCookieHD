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

    <!-- 교강사 등록/수정 모달 (고도화된 UI) -->
    <div id="createPersonnelModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl mx-4 overflow-hidden max-h-[95vh] flex flex-col transform transition-all">
            <!-- 모달 헤더 -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <i class="fas fa-chalkboard-teacher text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-black text-white" id="modalTitle">교강사 등록</h3>
                            <p class="text-xs text-white/80 font-medium mt-1">교강사 정보를 입력하고 관리하세요</p>
                        </div>
                    </div>
                    <button onclick="closeModal('createPersonnelModal')" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/10 text-white/90 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <form id="personnelForm" onsubmit="handleSavePersonnel(event)" class="flex-1 overflow-hidden flex flex-col">
                <input type="hidden" name="id" id="personnelId">
                
                <!-- 기초 정보 섹션 (상단 고정) -->
                <div class="bg-gradient-to-br from-gray-50 to-blue-50/30 px-8 py-6 border-b border-gray-200">
                    <div class="flex items-start gap-6">
                        <!-- 프로필 이미지 -->
                        <div class="flex-shrink-0">
                            <div class="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden relative group cursor-pointer" onclick="document.getElementById('pImageFile').click()">
                                <i class="fas fa-user text-gray-300 text-5xl absolute inset-0 flex items-center justify-center" id="pImagePlaceholder"></i>
                                <img id="pImagePreview" src="" class="w-full h-full object-cover hidden">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                    <i class="fas fa-camera mr-2"></i> 변경
                                </div>
                            </div>
                            <input type="hidden" name="profile_image" id="pImageUrl">
                            <input type="file" id="pImageFile" accept="image/*" class="hidden" onchange="handlePImage(this)">
                        </div>

                        <!-- 기본 정보 그리드 -->
                        <div class="flex-1 grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">이름 <span class="text-red-500">*</span></label>
                                <input type="text" name="name" id="pName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">직위</label>
                                <input type="text" name="position" id="pPosition" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 전임강사">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">이메일 <span class="text-red-500">*</span></label>
                                <input type="email" name="email" id="pEmail" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">연락처 <span class="text-red-500">*</span></label>
                                <input type="text" name="phone" id="pPhone" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="010-0000-0000">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">담당 과목</label>
                                <input type="text" name="subject" id="pSubject" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 3D 모델링, 제품디자인">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">입사일</label>
                                <input type="date" name="joined_at" id="pJoined" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">고용 형태</label>
                                <select name="type" id="pType" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition cursor-pointer">
                                    <option value="full">전임</option>
                                    <option value="part">파트타임</option>
                                    <option value="external">외부강사</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">상태</label>
                                <select name="instructor_status" id="pStatus" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition cursor-pointer">
                                    <option value="active">재직</option>
                                    <option value="leave">휴직</option>
                                    <option value="retired">퇴직</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 탭 네비게이션 -->
                <div class="bg-white border-b border-gray-200 px-8">
                    <div class="flex items-center gap-8">
                        <button type="button" onclick="switchPersonnelTab('education')" id="tabEducation" class="pb-4 text-sm font-black uppercase tracking-widest tab-active-personnel transition-all border-b-2 border-blue-600 text-blue-600">
                            <i class="fas fa-graduation-cap mr-2"></i> 학력 및 경력
                        </button>
                        <button type="button" onclick="switchPersonnelTab('certifications')" id="tabCertifications" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-personnel transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                            <i class="fas fa-certificate mr-2"></i> 자격증
                        </button>
                        <button type="button" onclick="switchPersonnelTab('training')" id="tabTraining" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-personnel transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                            <i class="fas fa-chalkboard-teacher mr-2"></i> 보수교육
                        </button>
                    </div>
                </div>

                <!-- 탭 컨텐츠 영역 -->
                <div class="flex-1 overflow-y-auto bg-gray-50/50">
                    <!-- 탭 1: 학력 및 경력 -->
                    <div id="contentEducation" class="p-8 space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                <i class="fas fa-university mr-3 text-blue-500"></i> 최종 학력
                            </h5>
                            <div>
                                <input type="text" name="education" id="pEducation" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 서울대학교 컴퓨터공학과 학사">
                            </div>
                        </div>

                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                <i class="fas fa-briefcase mr-3 text-purple-500"></i> 경력 사항
                            </h5>
                            <div>
                                <textarea name="career" id="pCareer" rows="6" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="회사명, 기간, 직책 등을 입력하세요&#10;&#10;예:&#10;- 2020.01 ~ 2023.12: ㈜ABC디자인, 시니어 디자이너&#10;- 2018.03 ~ 2019.12: XYZ스튜디오, 주임"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 탭 2: 자격증 -->
                    <div id="contentCertifications" class="hidden p-8 space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-certificate mr-3 text-orange-500"></i> 자격증 목록
                                </h5>
                                <button type="button" onclick="addCertification()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 자격증 추가
                                </button>
                            </div>
                            <div id="certificationsContainer" class="space-y-4">
                                <!-- 자격증 항목들이 여기에 동적으로 추가됨 -->
                            </div>
                        </div>
                    </div>

                    <!-- 탭 3: 보수교육 -->
                    <div id="contentTraining" class="hidden p-8 space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                <i class="fas fa-chalkboard-teacher mr-3 text-green-500"></i> 보수교육 현황
                            </h5>
                            <div>
                                <textarea name="training_history" id="pTrainingHistory" rows="8" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="보수교육 이력, 연수명, 기간 등을 입력하세요&#10;&#10;예:&#10;- 2024.03: HRD-Net 보수교육 (40시간)&#10;- 2023.09: 디지털 교육 역량 강화 연수 (20시간)"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 하단 버튼 -->
                <div class="bg-white border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
                    <button type="button" onclick="closeModal('createPersonnelModal')" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                        취소
                    </button>
                    <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                        <i class="fas fa-save mr-2"></i> 저장하기
                    </button>
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
                        <button onclick="openEditModalById(\${p.id})" class="text-blue-600 hover:text-blue-900 mr-3" title="수정"><i class="fas fa-edit"></i></button>
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

        // 자격증 관리
        let certifications = [];
        let certIdCounter = 0;

        function addCertification(certData = null) {
            const certId = certData ? certData.id : 'new_' + (certIdCounter++);
            const container = document.getElementById('certificationsContainer');
            
            const certHtml = \`
                <div class="cert-item border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-all" data-cert-id="\${certId}">
                    <div class="flex justify-between items-start mb-4">
                        <h5 class="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center">
                            <i class="fas fa-certificate mr-2 text-orange-500"></i> 자격증 정보
                        </h5>
                        <button type="button" class="remove-cert-btn w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition" data-cert-id="\${certId}">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">자격증명</label>
                            <input type="text" class="cert-name w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" 
                                   placeholder="예: 컴퓨터활용능력 1급" value="\${certData ? certData.name || '' : ''}">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">발급일</label>
                            <input type="date" class="cert-issue-date w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" 
                                   value="\${certData && certData.issue_date ? certData.issue_date.split('T')[0] : ''}">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">만료일 (선택)</label>
                        <input type="date" class="cert-expiry-date w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" 
                               value="\${certData && certData.expiry_date ? certData.expiry_date.split('T')[0] : ''}">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">자격증 파일</label>
                        <div class="space-y-3">
                            <!-- 파일 업로드 섹션 -->
                            <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-cloud-upload-alt text-blue-600"></i>
                                        <span class="text-xs font-bold text-blue-800">파일 업로드</span>
                                    </div>
                                    <button type="button" class="cert-upload-btn px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center" 
                                            data-cert-id="\${certId}">
                                        <i class="fas fa-upload mr-1"></i> 파일 선택
                                    </button>
                                </div>
                                <input type="file" class="cert-file hidden" accept=".pdf,.jpg,.jpeg,.png" 
                                       data-cert-id="\${certId}">
                                <div class="cert-upload-status text-xs text-gray-600" id="upload-status-\${certId}"></div>
                            </div>
                            
                            <!-- 업로드된 파일 목록 -->
                            <div class="cert-file-list space-y-2" id="file-list-\${certId}">
                                \${certData && certData.file_urls && Array.isArray(certData.file_urls) && certData.file_urls.length > 0
                                    ? certData.file_urls.map((fileInfo, idx) => {
                                        // fileInfo가 객체면 {url, name}, 문자열이면 URL만
                                        const fileUrl = typeof fileInfo === 'string' ? fileInfo : fileInfo.url;
                                        const fileName = typeof fileInfo === 'string' 
                                            ? fileInfo.split('/').pop() || '파일'
                                            : (fileInfo.name || fileInfo.url.split('/').pop() || '파일');
                                        return \`
                                            <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3" data-file-url="\${fileUrl}" data-file-name="\${fileName}" data-file-index="\${idx}">
                                                <div class="flex items-center gap-2 flex-1 min-w-0">
                                                    <i class="fas fa-file-pdf text-green-600"></i>
                                                    <span class="text-xs font-medium text-gray-700 truncate" title="\${fileName}">\${fileName}</span>
                                                </div>
                                                <div class="flex items-center gap-2 ml-2">
                                                    <a href="\${fileUrl}" target="_blank" class="px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center">
                                                        <i class="fas fa-download mr-1"></i> 다운로드
                                                    </a>
                                                    <button type="button" class="cert-file-remove-btn px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center" 
                                                            data-cert-id="\${certId}" data-file-url="\${fileUrl}">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        \`;
                                    }).join('')
                                    : certData && certData.file_url
                                        ? \`
                                            <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3" data-file-url="\${certData.file_url}" data-file-index="0">
                                                <div class="flex items-center gap-2 flex-1 min-w-0">
                                                    <i class="fas fa-file-pdf text-green-600"></i>
                                                    <span class="text-xs font-medium text-gray-700 truncate">\${certData.file_url.split('/').pop() || '파일'}</span>
                                                </div>
                                                <div class="flex items-center gap-2 ml-2">
                                                    <a href="\${certData.file_url}" target="_blank" class="px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center">
                                                        <i class="fas fa-download mr-1"></i> 다운로드
                                                    </a>
                                                    <button type="button" class="cert-file-remove-btn px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center" 
                                                            data-cert-id="\${certId}" data-file-url="\${certData.file_url}">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        \`
                                        : '<div class="text-xs text-gray-400 text-center py-2">업로드된 파일이 없습니다</div>'}
                            </div>
                        </div>
                        <input type="hidden" class="cert-file-urls" value="\${certData ? JSON.stringify(certData.file_urls || (certData.file_url ? [certData.file_url] : [])) : '[]'}">
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', certHtml);
            
            // 이벤트 리스너 추가 (인라인 onclick 대신)
            const certItem = container.querySelector(\`[data-cert-id="\${certId}"]\`);
            if (certItem) {
                const fileInput = certItem.querySelector('.cert-file');
                const uploadBtn = certItem.querySelector('.cert-upload-btn');
                const removeBtn = certItem.querySelector('.remove-cert-btn');
                const fileUrlsInput = certItem.querySelector('.cert-file-urls');
                const fileList = certItem.querySelector(\`#file-list-\${certId}\`);
                const uploadStatus = certItem.querySelector(\`#upload-status-\${certId}\`);
                
                // 파일 업로드 버튼 클릭
                if (uploadBtn && fileInput) {
                    uploadBtn.addEventListener('click', () => {
                        fileInput.click();
                    });
                }
                
                // 파일 선택 시 업로드 시작
                if (fileInput) {
                    fileInput.addEventListener('change', async (e) => {
                        await handleCertFileUpload(e.target, certId, fileList, uploadStatus, fileUrlsInput);
                    });
                }
                
                // 자격증 삭제 버튼
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        removeCertification(certId);
                    });
                }
                
                // 파일 삭제 버튼들 (기존 파일이 있을 때)
                const removeFileBtns = certItem.querySelectorAll('.cert-file-remove-btn');
                removeFileBtns.forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const fileUrl = btn.getAttribute('data-file-url');
                        if (fileUrl && confirm('파일을 삭제하시겠습니까?')) {
                            await removeCertFile(certId, fileUrl, fileList, fileUrlsInput);
                        }
                    });
                });
            }
            
            if (certData) {
                // 구버전 호환: file_url이 있으면 file_urls 배열로 변환
                if (certData.file_url && !certData.file_urls) {
                    certData.file_urls = [certData.file_url];
                }
                certifications.push(certData);
            } else {
                certifications.push({ id: certId, name: '', issue_date: '', expiry_date: '', file_urls: [] });
            }
        }

        function removeCertification(certId) {
            if (!confirm('자격증 정보를 삭제하시겠습니까?')) return;
            
            const item = document.querySelector(\`[data-cert-id="\${certId}"]\`);
            const fileUrlsInput = item?.querySelector('.cert-file-urls');
            const fileList = item?.querySelector(\`#file-list-\${certId}\`);
            
            // 모든 파일 삭제
            if (fileList && fileUrlsInput) {
                const fileItems = fileList.querySelectorAll('[data-file-url]');
                const deletePromises = Array.from(fileItems).map(fileItem => {
                    const fileUrl = fileItem.getAttribute('data-file-url');
                    return removeCertFile(certId, fileUrl, fileList, fileUrlsInput);
                });
                
                Promise.all(deletePromises).then(() => {
                    if (item) item.remove();
                    certifications = certifications.filter(c => c.id !== certId);
                });
            } else {
                if (item) item.remove();
                certifications = certifications.filter(c => c.id !== certId);
            }
        }
        
        async function deleteCertFile(certId, fileUrl, showAlert = true) {
            try {
                const token = localStorage.getItem('token');
                
                // 파일 URL에서 경로 추출 (예: /api/upload/files/documents/...)
                let filePath = fileUrl;
                if (fileUrl.startsWith('/api/upload/files/')) {
                    filePath = fileUrl.replace('/api/upload/files/', '');
                } else if (fileUrl.startsWith('/api/upload/')) {
                    filePath = fileUrl.replace('/api/upload/', '');
                } else if (fileUrl.includes('/api/upload/')) {
                    filePath = fileUrl.split('/api/upload/')[1];
                }
                
                // R2에서 파일 삭제
                const deleteRes = await fetch(\`/api/upload/\${filePath}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const deleteResult = await deleteRes.json();
                
                if (deleteResult.success || deleteRes.status === 200) {
                    // UI에서 파일 정보 제거
                    const certItem = document.querySelector(\`[data-cert-id="\${certId}"]\`);
                    if (certItem) {
                        const fileUrlInput = certItem.querySelector('.cert-file-url');
                        const fileNameSpan = certItem.querySelector('.cert-file-name');
                        const deleteFileBtn = certItem.querySelector('.delete-cert-file-btn');
                        const fileLink = certItem.querySelector('a[target="_blank"]');
                        
                        if (fileUrlInput) fileUrlInput.value = '';
                        if (fileNameSpan) {
                            fileNameSpan.textContent = '';
                            fileNameSpan.classList.remove('text-green-600');
                        }
                        if (deleteFileBtn) deleteFileBtn.remove();
                        if (fileLink) fileLink.remove();
                    }
                    
                    // certifications 배열에서 파일 URL 제거
                    const cert = certifications.find(c => c.id === certId);
                    if (cert) {
                        cert.file_url = null;
                    }
                    
                    if (showAlert) {
                        alert('파일이 삭제되었습니다.');
                    }
                } else {
                    if (showAlert) {
                        alert('파일 삭제 실패: ' + (deleteResult.error || '알 수 없는 오류'));
                    }
                }
            } catch (e) {
                console.error('File deletion error:', e);
                if (showAlert) {
                    alert('파일 삭제 중 오류가 발생했습니다.');
                }
            }
        }

        // 파일 업로드 처리 (새로운 방식: 저장 전에 업로드, 여러 파일 지원)
        async function handleCertFileUpload(input, certId, fileList, uploadStatus, fileUrlsInput) {
            if (!input.files || !input.files[0]) return;
            
            const file = input.files[0];
            
            // 업로드 상태 표시
            if (uploadStatus) {
                uploadStatus.innerHTML = \`<span class="text-blue-600 font-bold"><i class="fas fa-spinner fa-spin mr-1"></i> 업로드 중: \${file.name}</span>\`;
            }
            
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', 'documents');
                formData.append('folder', \`personnel_certs/\${certId}\`);
                formData.append('related_type', 'personnel_cert');
                
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                
                const uploadResult = await uploadRes.json();
                console.log('Upload result:', uploadResult);
                
                if (uploadResult.success && uploadResult.data) {
                    const fileUrl = uploadResult.data.url;
                    const originalFileName = uploadResult.data.originalName || file.name;
                    
                    console.log('File uploaded successfully, URL:', fileUrl);
                    console.log('Original file name:', originalFileName);
                    
                    // 파일 목록에 추가 (기존 파일 제거하지 않음 - 여러 파일 허용)
                    if (fileList) {
                        // 기존 "파일 없음" 메시지 제거
                        const emptyMsg = fileList.querySelector('.text-gray-400');
                        if (emptyMsg) emptyMsg.remove();
                        
                        // 중복 체크: 같은 URL의 파일이 이미 있는지 확인
                        const existingFile = fileList.querySelector(\`[data-file-url="\${fileUrl}"]\`);
                        if (existingFile) {
                            alert('이미 업로드된 파일입니다.');
                            if (uploadStatus) uploadStatus.innerHTML = '';
                            input.value = '';
                            return;
                        }
                        
                        // 새 파일 항목 추가 (원본 파일명 사용)
                        const fileItem = document.createElement('div');
                        fileItem.className = 'flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3';
                        fileItem.setAttribute('data-file-url', fileUrl);
                        fileItem.setAttribute('data-file-name', originalFileName);
                        fileItem.innerHTML = \`
                            <div class="flex items-center gap-2 flex-1 min-w-0">
                                <i class="fas fa-file-pdf text-green-600"></i>
                                <span class="text-xs font-medium text-gray-700 truncate" title="\${originalFileName}">\${originalFileName}</span>
                            </div>
                            <div class="flex items-center gap-2 ml-2">
                                <a href="\${fileUrl}" target="_blank" class="px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center">
                                    <i class="fas fa-download mr-1"></i> 다운로드
                                </a>
                                <button type="button" class="cert-file-remove-btn px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center" 
                                        data-cert-id="\${certId}" data-file-url="\${fileUrl}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        \`;
                        
                        // 파일 삭제 버튼 이벤트 연결
                        const removeBtn = fileItem.querySelector('.cert-file-remove-btn');
                        if (removeBtn) {
                            removeBtn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                if (confirm('파일을 삭제하시겠습니까?')) {
                                    await removeCertFile(certId, fileUrl, fileList, fileUrlsInput);
                                }
                            });
                        }
                        
                        fileList.appendChild(fileItem);
                        
                        // Hidden input 업데이트 (파일 정보 객체 배열로 저장: {url, name})
                        if (fileUrlsInput) {
                            const existingFiles = fileUrlsInput.value ? JSON.parse(fileUrlsInput.value) : [];
                            // 기존 URL 문자열을 객체로 변환 (구버전 호환)
                            const normalizedFiles = existingFiles.map(f => {
                                if (typeof f === 'string') {
                                    return { url: f, name: f.split('/').pop() || '파일' };
                                }
                                return f;
                            });
                            
                            // 새 파일 추가 (URL과 원본 파일명 함께 저장)
                            normalizedFiles.push({ url: fileUrl, name: originalFileName });
                            fileUrlsInput.value = JSON.stringify(normalizedFiles);
                            console.log('File info updated:', normalizedFiles);
                        }
                    }
                    
                    // 업로드 상태 업데이트
                    if (uploadStatus) {
                        uploadStatus.innerHTML = \`<span class="text-green-600 font-bold"><i class="fas fa-check-circle mr-1"></i> 업로드 완료: \${originalFileName}</span>\`;
                        setTimeout(() => {
                            uploadStatus.innerHTML = '';
                        }, 3000);
                    }
                    
                    // certifications 배열 업데이트 (여러 파일 지원, 원본 파일명 포함)
                    const cert = certifications.find(c => c.id === certId);
                    if (cert) {
                        // file_urls 배열로 변환 (기존 file_url이 있으면 배열로 변환)
                        if (!cert.file_urls) {
                            cert.file_urls = cert.file_url ? [{ url: cert.file_url, name: cert.file_url.split('/').pop() || '파일' }] : [];
                            delete cert.file_url; // 구버전 필드 제거
                        }
                        // file_urls가 문자열 배열이면 객체 배열로 변환
                        if (cert.file_urls.length > 0 && typeof cert.file_urls[0] === 'string') {
                            cert.file_urls = cert.file_urls.map(url => ({ url, name: url.split('/').pop() || '파일' }));
                        }
                        // 새 파일 추가 (URL과 원본 파일명 함께 저장)
                        const fileExists = cert.file_urls.some(f => {
                            const fileUrlToCheck = typeof f === 'string' ? f : f.url;
                            return fileUrlToCheck === fileUrl;
                        });
                        if (!fileExists) {
                            cert.file_urls.push({ url: fileUrl, name: originalFileName });
                        }
                        console.log('Updated cert in array:', cert);
                    } else {
                        // 배열에 없으면 추가
                        const certItem = document.querySelector(\`[data-cert-id="\${certId}"]\`);
                        const newCert = {
                            id: certId,
                            name: certItem?.querySelector('.cert-name')?.value || '',
                            issue_date: certItem?.querySelector('.cert-issue-date')?.value || '',
                            expiry_date: certItem?.querySelector('.cert-expiry-date')?.value || '',
                            file_urls: [{ url: fileUrl, name: originalFileName }]
                        };
                        certifications.push(newCert);
                        console.log('Added new cert to array:', newCert);
                    }
                    
                    // 파일 입력 초기화
                    input.value = '';
                    
                    console.log('Current certifications array:', certifications);
                } else {
                    const errorMsg = uploadResult.error || '알 수 없는 오류';
                    console.error('File upload failed:', errorMsg, uploadResult);
                    if (uploadStatus) {
                        uploadStatus.innerHTML = \`<span class="text-red-600 font-bold"><i class="fas fa-exclamation-circle mr-1"></i> 업로드 실패: \${errorMsg}</span>\`;
                    }
                    alert('파일 업로드 실패: ' + errorMsg);
                }
            } catch (e) {
                console.error('File upload error:', e);
                if (uploadStatus) {
                    uploadStatus.innerHTML = \`<span class="text-red-600 font-bold"><i class="fas fa-exclamation-circle mr-1"></i> 오류: \${e.message}</span>\`;
                }
                alert('파일 업로드 중 오류가 발생했습니다: ' + e.message);
            }
        }
        
        // 파일 제거 (UI에서만 제거, R2 삭제는 선택사항, 여러 파일 지원)
        async function removeCertFile(certId, fileUrl, fileList, fileUrlsInput) {
            if (!confirm('파일을 목록에서 제거하시겠습니까?')) return;
            
            try {
                // R2에서 파일 삭제 시도 (선택사항)
                const token = localStorage.getItem('token');
                let filePath = fileUrl;
                if (fileUrl.startsWith('/api/upload/files/')) {
                    filePath = fileUrl.replace('/api/upload/files/', '');
                } else if (fileUrl.startsWith('/api/upload/')) {
                    filePath = fileUrl.replace('/api/upload/', '');
                }
                
                try {
                    await fetch(\`/api/upload/\${filePath}\`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                } catch (e) {
                    console.warn('Failed to delete file from R2:', e);
                    // R2 삭제 실패해도 UI에서는 제거
                }
                
                // UI에서 파일 항목 제거
                const fileItem = fileList.querySelector(\`[data-file-url="\${fileUrl}"]\`);
                if (fileItem) {
                    fileItem.remove();
                }
                
                // 파일 목록이 비어있으면 메시지 표시
                if (fileList.children.length === 0) {
                    fileList.innerHTML = '<div class="text-xs text-gray-400 text-center py-2">업로드된 파일이 없습니다</div>';
                }
                
                // Hidden input 업데이트 (파일 URL 배열에서 제거)
                if (fileUrlsInput) {
                    const existingUrls = fileUrlsInput.value ? JSON.parse(fileUrlsInput.value) : [];
                    const updatedUrls = existingUrls.filter(url => url !== fileUrl);
                    fileUrlsInput.value = JSON.stringify(updatedUrls);
                    console.log('File URLs after removal:', updatedUrls);
                }
                
                // certifications 배열에서 파일 URL 제거
                const cert = certifications.find(c => c.id === certId);
                if (cert) {
                    if (cert.file_urls && Array.isArray(cert.file_urls)) {
                        cert.file_urls = cert.file_urls.filter(url => url !== fileUrl);
                    } else if (cert.file_url === fileUrl) {
                        // 구버전 호환: file_url이 있으면 제거
                        cert.file_url = null;
                    }
                }
                
                console.log('File removed from UI');
            } catch (e) {
                console.error('Error removing file:', e);
                alert('파일 제거 중 오류가 발생했습니다.');
            }
        }

        function loadCertifications(certificationsJson) {
            document.getElementById('certificationsContainer').innerHTML = '';
            certifications = [];
            
            console.log('Loading certifications:', certificationsJson);
            console.log('Type:', typeof certificationsJson);
            
            // null, undefined, 빈 문자열 체크
            if (!certificationsJson || 
                certificationsJson === 'null' || 
                certificationsJson === 'undefined' || 
                (typeof certificationsJson === 'string' && certificationsJson.trim() === '')) {
                console.log('No certifications data provided or empty');
                return;
            }
            
            try {
                let certs;
                if (typeof certificationsJson === 'string') {
                    // JSON 문자열 파싱
                    certs = JSON.parse(certificationsJson);
                } else if (Array.isArray(certificationsJson)) {
                    // 이미 배열인 경우
                    certs = certificationsJson;
                } else if (typeof certificationsJson === 'object') {
                    // 객체인 경우 배열로 변환
                    certs = [certificationsJson];
                } else {
                    console.warn('Unexpected certifications format:', certificationsJson);
                    return;
                }
                
                console.log('Parsed certifications:', certs);
                
                if (Array.isArray(certs) && certs.length > 0) {
                    certs.forEach((cert, index) => {
                        console.log(\`Loading cert \${index}:\`, cert);
                        // certId가 없으면 생성
                        if (!cert.id) {
                            cert.id = 'loaded_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substr(2, 9);
                        }
                        
                        // 구버전 호환: file_url이 있으면 file_urls 배열로 변환
                        if (cert.file_url && !cert.file_urls) {
                            cert.file_urls = [{ url: cert.file_url, name: cert.file_url.split('/').pop() || '파일' }];
                        }
                        
                        // file_urls가 없으면 빈 배열로 초기화
                        if (!cert.file_urls) {
                            cert.file_urls = [];
                        }
                        
                        // file_urls가 문자열 배열이면 객체 배열로 변환 (원본 파일명 보존)
                        if (Array.isArray(cert.file_urls) && cert.file_urls.length > 0 && typeof cert.file_urls[0] === 'string') {
                            cert.file_urls = cert.file_urls.map(url => ({ url, name: url.split('/').pop() || '파일' }));
                        }
                        
                        console.log('Adding certification with data:', cert);
                        addCertification(cert);
                    });
                } else {
                    console.log('Certifications is not an array or is empty');
                }
            } catch (e) {
                console.error('Failed to parse certifications:', e);
                console.error('Raw data:', certificationsJson);
                // 파싱 실패해도 계속 진행 (빈 상태로)
            }
        }

        async function handleSavePersonnel(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;

            // 자격증 데이터 수집
            const certItems = document.querySelectorAll('.cert-item');
            const certsArray = [];
            certItems.forEach(item => {
                const certId = item.getAttribute('data-cert-id');
                const nameInput = item.querySelector('.cert-name');
                const issueDateInput = item.querySelector('.cert-issue-date');
                const expiryDateInput = item.querySelector('.cert-expiry-date');
                const fileUrlsInput = item.querySelector('.cert-file-urls');
                
                const name = nameInput ? nameInput.value : '';
                const issueDate = issueDateInput ? issueDateInput.value : '';
                const expiryDate = expiryDateInput ? expiryDateInput.value : '';
                
                // 파일 정보 배열 가져오기 (URL과 원본 파일명 포함)
                let fileInfos = [];
                if (fileUrlsInput && fileUrlsInput.value) {
                    try {
                        const parsed = JSON.parse(fileUrlsInput.value);
                        if (Array.isArray(parsed)) {
                            fileInfos = parsed;
                        } else if (parsed) {
                            // 구버전 호환: 단일 값이면 배열로 변환
                            fileInfos = [parsed];
                        }
                    } catch (e) {
                        console.warn('Failed to parse file info:', e);
                        fileInfos = [];
                    }
                }
                
                // fileInfos를 정규화 (문자열이면 객체로 변환)
                const normalizedFileInfos = fileInfos.map(f => {
                    if (typeof f === 'string') {
                        return { url: f, name: f.split('/').pop() || '파일' };
                    }
                    return f;
                });
                
                // 디버깅 로그
                console.log('Cert data:', { certId, name, issueDate, expiryDate, fileInfos: normalizedFileInfos });
                
                // 정보가 하나라도 있으면 저장
                if (name || issueDate || expiryDate || normalizedFileInfos.length > 0) {
                    certsArray.push({
                        id: certId,
                        name: name || null,
                        issue_date: issueDate || null,
                        expiry_date: expiryDate || null,
                        file_urls: normalizedFileInfos.length > 0 ? normalizedFileInfos : null,
                        // 구버전 호환을 위해 첫 번째 파일 URL을 file_url로도 저장
                        file_url: normalizedFileInfos.length > 0 ? normalizedFileInfos[0].url : null
                    });
                }
            });
            
            console.log('Certifications array:', certsArray);
            
            // 빈 배열이어도 저장해야 함 (null이 아닌 빈 배열 JSON)
            if (certsArray.length === 0) {
                data.certifications = '[]';
            } else {
                data.certifications = JSON.stringify(certsArray);
            }
            
            console.log('Certifications JSON to save:', data.certifications);
            console.log('Certifications JSON length:', data.certifications.length);

            try {
                let url = '/api/hrd/personnel';
                let method = 'POST';
                if (id) {
                    url = '/api/hrd/personnel/' + id;
                    method = 'PUT';
                }

                console.log('Sending request to:', url, 'Method:', method);
                console.log('Request body:', JSON.stringify(data, null, 2));
                
                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log('Save response:', result);
                
                if (result.success) {
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    closeModal('createPersonnelModal');
                    // 데이터 새로고침 전에 잠시 대기 (DB 업데이트 반영 시간)
                    setTimeout(() => {
                        loadData();
                    }, 500);
                } else {
                    console.error('Save failed:', result);
                    alert('실패: ' + (result.error || '알 수 없는 오류'));
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
            // 자격증 컨테이너 초기화
            document.getElementById('certificationsContainer').innerHTML = '';
            certifications = [];
            // 첫 번째 탭으로 리셋
            switchPersonnelTab('education');
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

        // ID로 모달 열기 (API에서 최신 데이터 가져오기)
        async function openEditModalById(id) {
            try {
                const response = await fetch('/api/hrd/personnel');
                const result = await response.json();
                
                console.log('API Response:', result);
                
                if (result.success && result.data) {
                    const personnel = result.data.find(p => p.id == id);
                    console.log('Found personnel:', personnel);
                    console.log('Personnel certifications:', personnel?.certifications);
                    console.log('Type of certifications:', typeof personnel?.certifications);
                    
                    if (personnel) {
                        openEditModal(personnel);
                    } else {
                        alert('교강사 정보를 찾을 수 없습니다.');
                    }
                } else {
                    alert('교강사 정보를 불러오는데 실패했습니다.');
                }
            } catch (e) {
                console.error('Failed to load personnel data:', e);
                alert('오류가 발생했습니다.');
            }
        }

        function openEditModal(data) {
            console.log('Opening edit modal with data:', data);
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
            
            // 새 필드 설정
            document.getElementById('pEducation').value = data.education || '';
            document.getElementById('pCareer').value = data.career || '';
            document.getElementById('pTrainingHistory').value = data.training_history || '';
            
            // 자격증 데이터 로드 (디버깅 포함)
            console.log('Full data object:', data);
            console.log('Certifications data from API:', data.certifications);
            console.log('Type of certifications:', typeof data.certifications);
            
            // certifications가 null이거나 빈 문자열인 경우 처리
            let certsData = data.certifications;
            
            // 이미 파싱된 객체/배열인 경우 그대로 사용
            if (certsData !== null && certsData !== undefined) {
                // 문자열인 경우 파싱 시도
                if (typeof certsData === 'string') {
                    if (certsData.trim() === '' || certsData === 'null' || certsData === 'undefined') {
                        console.log('Certifications is empty/null string');
                        certsData = null;
                    } else {
                        try {
                            certsData = JSON.parse(certsData);
                            console.log('Parsed certifications from string:', certsData);
                        } catch (e) {
                            console.error('Failed to parse certifications string:', e);
                            certsData = null;
                        }
                    }
                } else if (Array.isArray(certsData) || typeof certsData === 'object') {
                    // 이미 파싱된 경우
                    console.log('Certifications is already parsed:', certsData);
                }
            } else {
                console.log('Certifications is null/undefined');
                certsData = null;
            }
            
            loadCertifications(certsData);
            
            if (data.profile_image) {
                document.getElementById('pImageUrl').value = data.profile_image;
                document.getElementById('pImagePreview').src = data.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
            } else {
                clearPImage();
            }

            // 첫 번째 탭으로 리셋
            switchPersonnelTab('education');
            document.getElementById('createPersonnelModal').classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        // 탭 전환 함수
        let currentPersonnelTab = 'education';
        function switchPersonnelTab(tab) {
            currentPersonnelTab = tab;
            
            // 모든 탭 버튼 비활성화
            document.querySelectorAll('.tab-active-personnel, .tab-inactive-personnel').forEach(btn => {
                btn.classList.remove('tab-active-personnel', 'border-blue-600', 'text-blue-600');
                btn.classList.add('tab-inactive-personnel', 'border-transparent', 'text-gray-400');
            });
            
            // 모든 컨텐츠 숨기기
            document.getElementById('contentEducation').classList.add('hidden');
            document.getElementById('contentCertifications').classList.add('hidden');
            document.getElementById('contentTraining').classList.add('hidden');
            
            // 선택된 탭 활성화
            const activeTab = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
            if (activeTab) {
                activeTab.classList.remove('tab-inactive-personnel', 'border-transparent', 'text-gray-400');
                activeTab.classList.add('tab-active-personnel', 'border-blue-600', 'text-blue-600');
            }
            
            // 선택된 컨텐츠 표시
            const activeContent = document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1));
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        }

        // 검색 엔터 처리
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderTable();
        });
    </script>
    <style>
        .tab-active-personnel {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }
        .tab-inactive-personnel {
            color: #9ca3af;
        }
        .tab-inactive-personnel:hover {
            color: #4b5563;
        }
    </style>
</body>
</html>
`;
