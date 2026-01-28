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
                        <button type="button" onclick="switchPersonnelTab('teaching')" id="tabTeaching" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-personnel transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                            <i class="fas fa-book-open mr-2"></i> 강의이력
                        </button>
                    </div>
                </div>

                <!-- 탭 컨텐츠 영역 -->
                <div class="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                    <!-- 탭 1: 학력 및 경력 -->
                    <div id="contentEducation" class="space-y-6">
                        <!-- 학력 목록 -->
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-university mr-3 text-blue-500"></i> 학력 목록
                                </h5>
                                <button type="button" onclick="openEducationModal()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 학력 추가
                                </button>
                            </div>
                            <div id="educationContainer" class="space-y-4"></div>
                        </div>

                        <!-- 경력 목록 -->
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-briefcase mr-3 text-purple-500"></i> 경력 목록
                                </h5>
                                <button type="button" onclick="openCareerModal()" class="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 경력 추가
                                </button>
                            </div>
                            <div id="careerContainer" class="space-y-4"></div>
                        </div>
                    </div>

                    <!-- 탭 2: 자격증 -->
                    <div id="contentCertifications" class="hidden space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-certificate mr-3 text-orange-500"></i> 자격증 목록
                                </h5>
                                <button type="button" onclick="openCertificationModal()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 자격증 추가
                                </button>
                            </div>
                            <div id="certificationsContainer" class="space-y-4"></div>
                        </div>
                    </div>

                    <!-- 탭 3: 보수교육 -->
                    <div id="contentTraining" class="hidden space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-chalkboard-teacher mr-3 text-green-500"></i> 보수교육 현황
                                </h5>
                                <button type="button" onclick="openTrainingModal()" class="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 보수교육 추가
                                </button>
                            </div>
                            <div id="trainingContainer" class="space-y-4"></div>
                        </div>
                    </div>

                    <!-- 탭 4: 강의이력 -->
                    <div id="contentTeaching" class="hidden space-y-6">
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <div class="flex items-center justify-between mb-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                    <i class="fas fa-book-open mr-3 text-indigo-500"></i> 강의이력
                                </h5>
                                <button type="button" onclick="openTeachingHistoryModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 flex items-center">
                                    <i class="fas fa-plus mr-2"></i> 강의이력 추가
                                </button>
                            </div>
                            <div id="teachingHistoryContainer" class="space-y-4"></div>
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

    <!-- 자격증 입력/수정 모달 -->
    <div id="certificationModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="certModalTitle">자격증 추가</h3>
                <button type="button" onclick="closeCertificationModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="certificationForm" onsubmit="handleSaveCertification(event)">
                    <input type="hidden" id="certModalId" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">자격증명 <span class="text-red-500">*</span></label>
                            <input type="text" id="certModalName" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 정보처리기사">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">발급일</label>
                                <input type="date" id="certModalIssueDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">만료일</label>
                                <input type="date" id="certModalExpiryDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">자격증 파일</label>
                            <input type="file" id="certModalFileInput" accept=".pdf,.jpg,.jpeg,.png" multiple class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            <div id="certModalFileList" class="mt-3 space-y-2">
                                <!-- 파일 목록이 여기에 표시됨 -->
                            </div>
                            <input type="hidden" id="certModalFileUrls" value="[]">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeCertificationModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 강의이력 입력/수정 모달 -->
    <div id="teachingHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="teachingModalTitle">강의이력 추가</h3>
                <button type="button" onclick="closeTeachingHistoryModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="teachingHistoryForm" onsubmit="handleSaveTeachingHistory(event)">
                    <input type="hidden" id="teachingModalId" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">과정명 <span class="text-red-500">*</span></label>
                            <input type="text" id="teachingModalCourseName" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 3D 모델링 기초">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">시작일</label>
                                <input type="date" id="teachingModalStartDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">종료일</label>
                                <input type="date" id="teachingModalEndDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">수강생 수</label>
                            <input type="number" id="teachingModalStudentCount" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 25">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">강의 내용/설명</label>
                            <textarea id="teachingModalDescription" rows="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="강의 내용, 커리큘럼, 주요 학습 내용 등을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">기타 메모</label>
                            <textarea id="teachingModalNotes" rows="2" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="특이사항, 성과, 수강생 반응 등을 입력하세요"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeTeachingHistoryModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 학력 입력/수정 모달 -->
    <div id="educationModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="educationModalTitle">학력 추가</h3>
                <button type="button" onclick="closeEducationModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="educationForm" onsubmit="handleSaveEducation(event)">
                    <input type="hidden" id="educationModalId" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">학교명 <span class="text-red-500">*</span></label>
                            <input type="text" id="educationModalSchool" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 서울대학교">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">학과/전공</label>
                            <input type="text" id="educationModalMajor" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 컴퓨터공학과">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">입학일</label>
                                <input type="date" id="educationModalStartDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">졸업일</label>
                                <input type="date" id="educationModalEndDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">학위</label>
                            <select id="educationModalDegree" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                                <option value="">선택하세요</option>
                                <option value="고등학교">고등학교</option>
                                <option value="전문대학">전문대학</option>
                                <option value="학사">학사</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">비고</label>
                            <textarea id="educationModalNotes" rows="2" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="기타 사항을 입력하세요"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeEducationModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 경력 입력/수정 모달 -->
    <div id="careerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="careerModalTitle">경력 추가</h3>
                <button type="button" onclick="closeCareerModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="careerForm" onsubmit="handleSaveCareer(event)">
                    <input type="hidden" id="careerModalId" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">회사명 <span class="text-red-500">*</span></label>
                            <input type="text" id="careerModalCompany" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: ㈜ABC디자인">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">직책</label>
                            <input type="text" id="careerModalPosition" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 시니어 디자이너">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">입사일</label>
                                <input type="date" id="careerModalStartDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">퇴사일</label>
                                <input type="date" id="careerModalEndDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">담당 업무</label>
                            <textarea id="careerModalDescription" rows="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="담당했던 주요 업무, 프로젝트 등을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">비고</label>
                            <textarea id="careerModalNotes" rows="2" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="기타 사항을 입력하세요"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeCareerModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 보수교육 입력/수정 모달 -->
    <div id="trainingModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="trainingModalTitle">보수교육 추가</h3>
                <button type="button" onclick="closeTrainingModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="trainingForm" onsubmit="handleSaveTraining(event)">
                    <input type="hidden" id="trainingModalId" value="">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">연수명 <span class="text-red-500">*</span></label>
                            <input type="text" id="trainingModalName" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: HRD-Net 보수교육">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">시작일</label>
                                <input type="date" id="trainingModalStartDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">종료일</label>
                                <input type="date" id="trainingModalEndDate" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">교육 시간</label>
                            <input type="number" id="trainingModalHours" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 40">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">교육 기관</label>
                            <input type="text" id="trainingModalInstitution" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 한국산업인력공단">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">교육 내용</label>
                            <textarea id="trainingModalDescription" rows="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="교육 내용, 커리큘럼 등을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2 block">비고</label>
                            <textarea id="trainingModalNotes" rows="2" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="기타 사항을 입력하세요"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" onclick="closeTrainingModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">
                            저장
                        </button>
                    </div>
                </form>
            </div>
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

        // 전역 변수 선언
        let certifications = [];
        let certIdCounter = 0;
        let teachingHistory = [];
        let teachingHistoryIdCounter = 0;
        let education = [];
        let educationIdCounter = 0;
        let career = [];
        let careerIdCounter = 0;
        let training = [];
        let trainingIdCounter = 0;
        
        let currentEducationIndex = null;
        let currentCareerIndex = null;
        let currentTrainingIndex = null;
        let currentCertIndex = null;
        let currentTeachingIndex = null;

        // 파일 다운로드 함수
        async function downloadFile(fileUrl, fileName) {
            try {
                console.log('Downloading file:', fileUrl);
                console.log('File name:', fileName);
                
                const token = localStorage.getItem('token');
                
                // URL이 상대 경로인 경우 절대 경로로 변환
                let downloadUrl = fileUrl;
                if (fileUrl.startsWith('/')) {
                    downloadUrl = fileUrl;
                } else if (!fileUrl.startsWith('http')) {
                    downloadUrl = '/' + fileUrl;
                }
                
                const fullUrl = downloadUrl + (downloadUrl.includes('?') ? '&' : '?') + 'download=true';
                
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (!response.ok) {
                    throw new Error(\`파일 다운로드 실패: \${ response.status }\`);
                }
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || fileUrl.split('/').pop() || '파일';
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            } catch (error) {
                console.error('Download error:', error);
                alert('파일 다운로드 중 오류가 발생했습니다: ' + (error.message || error));
            }
        }
        
        // ==========================================
        //  Sub-Modal Management Functions
        // ==========================================

        // --- Education ---
        window.openEducationModal = function(index = null) {
            currentEducationIndex = index;
            const modal = document.getElementById('educationModal');
            const title = document.getElementById('educationModalTitle');
            const form = document.getElementById('educationForm');
            
            if (index !== null && education[index]) {
                const edu = education[index];
                title.textContent = '학력 수정';
                document.getElementById('educationModalId').value = edu.id || '';
                document.getElementById('educationModalSchool').value = edu.school || '';
                document.getElementById('educationModalMajor').value = edu.major || '';
                document.getElementById('educationModalStartDate').value = edu.start_date ? edu.start_date.split('T')[0] : '';
                document.getElementById('educationModalEndDate').value = edu.end_date ? edu.end_date.split('T')[0] : '';
                document.getElementById('educationModalDegree').value = edu.degree || '';
                document.getElementById('educationModalNotes').value = edu.notes || '';
            } else {
                title.textContent = '학력 추가';
                form.reset();
                document.getElementById('educationModalId').value = '';
            }
            modal.classList.remove('hidden');
        };
        
        window.closeEducationModal = function() {
            document.getElementById('educationModal').classList.add('hidden');
            currentEducationIndex = null;
        };
        
        window.handleSaveEducation = function(event) {
            event.preventDefault();
            const form = event.target;
            const eduData = {
                id: document.getElementById('educationModalId').value || 'edu_' + Date.now(),
                school: document.getElementById('educationModalSchool').value,
                major: document.getElementById('educationModalMajor').value,
                start_date: document.getElementById('educationModalStartDate').value || null,
                end_date: document.getElementById('educationModalEndDate').value || null,
                degree: document.getElementById('educationModalDegree').value || null,
                notes: document.getElementById('educationModalNotes').value || null
            };
            
            if (currentEducationIndex !== null) {
                education[currentEducationIndex] = eduData;
            } else {
                education.push(eduData);
            }
            closeEducationModal();
            loadEducation();
        };

        window.deleteEducation = function(index) {
            if (!confirm('학력을 삭제하시겠습니까?')) return;
            education.splice(index, 1);
            loadEducation();
        };
        
        function loadEducation() {
            const container = document.getElementById('educationContainer');
            if(!container) return;
            container.innerHTML = '';
            if (!education || education.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">등록된 학력이 없습니다.</div>';
                return;
            }
            education.forEach((edu, index) => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative';
                div.innerHTML = \`
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-gray-900">\${ edu.school || '-' }</h4>
                            <div class="text-sm text-gray-600 mt-1">
                                \${ edu.major ? \`<span class="mr-2">\${edu.major}</span>\` : '' }
                                \${ edu.degree ? \`<span class="px-2 py-0.5 bg-gray-100 rounded text-xs">\${edu.degree}</span>\` : '' }
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                \${ edu.start_date || '' } ~ \${ edu.end_date || '' }
                            </div>
                            \${ edu.notes ? \`<p class="text-xs text-gray-400 mt-2">\${edu.notes}</p>\` : '' }
                        </div>
                        <div class="flex space-x-2">
                             <button type="button" onclick="openEducationModal(\${index})" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                             <button type="button" onclick="deleteEducation(\${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                \`;
                container.appendChild(div);
            });
        }

        // --- Career ---
        window.openCareerModal = function(index = null) {
            currentCareerIndex = index;
            const modal = document.getElementById('careerModal');
            const title = document.getElementById('careerModalTitle');
            const form = document.getElementById('careerForm');
            
            if (index !== null && career[index]) {
                const car = career[index];
                title.textContent = '경력 수정';
                document.getElementById('careerModalId').value = car.id || '';
                document.getElementById('careerModalCompany').value = car.company || '';
                document.getElementById('careerModalPosition').value = car.position || '';
                document.getElementById('careerModalStartDate').value = car.start_date ? car.start_date.split('T')[0] : '';
                document.getElementById('careerModalEndDate').value = car.end_date ? car.end_date.split('T')[0] : '';
                document.getElementById('careerModalDescription').value = car.description || '';
                document.getElementById('careerModalNotes').value = car.notes || '';
            } else {
                title.textContent = '경력 추가';
                form.reset();
                document.getElementById('careerModalId').value = '';
            }
            modal.classList.remove('hidden');
        };
        
        window.closeCareerModal = function() {
            document.getElementById('careerModal').classList.add('hidden');
            currentCareerIndex = null;
        };

        window.handleSaveCareer = function(event) {
            event.preventDefault();
            const carData = {
                id: document.getElementById('careerModalId').value || 'car_' + Date.now(),
                company: document.getElementById('careerModalCompany').value,
                position: document.getElementById('careerModalPosition').value || null,
                start_date: document.getElementById('careerModalStartDate').value || null,
                end_date: document.getElementById('careerModalEndDate').value || null,
                description: document.getElementById('careerModalDescription').value || null,
                notes: document.getElementById('careerModalNotes').value || null
            };
            if (currentCareerIndex !== null) {
                career[currentCareerIndex] = carData;
            } else {
                career.push(carData);
            }
            closeCareerModal();
            loadCareer();
        };

        window.deleteCareer = function(index) {
            if (!confirm('경력을 삭제하시겠습니까?')) return;
            career.splice(index, 1);
            loadCareer();
        };

        function loadCareer() {
            const container = document.getElementById('careerContainer');
            if(!container) return;
            container.innerHTML = '';
            if (!career || career.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">등록된 경력이 없습니다.</div>';
                return;
            }
            career.forEach((car, index) => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative';
                div.innerHTML = \`
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-gray-900">\${ car.company || '-' }</h4>
                            <div class="text-sm text-gray-600 mt-1">
                                \${ car.department ? \`<span class="mr-2">\${car.department}</span>\` : '' }
                                \${ car.position ? \`<span class="px-2 py-0.5 bg-gray-100 rounded text-xs">\${car.position}</span>\` : '' }
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                \${ car.start_date || '' } ~ \${ car.end_date || '' }
                            </div>
                            \${ car.tasks ? \`<p class="text-xs text-gray-400 mt-2">\${car.tasks}</p>\` : '' }
                        </div>
                        <div class="flex space-x-2">
                             <button type="button" onclick="openCareerModal(\${index})" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                             <button type="button" onclick="deleteCareer(\${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                \`;
                container.appendChild(div);
            });
        }

        // --- Training ---
        window.openTrainingModal = function(index = null) {
            currentTrainingIndex = index;
            const modal = document.getElementById('trainingModal');
            const title = document.getElementById('trainingModalTitle');
            const form = document.getElementById('trainingForm');
            
            if (index !== null && training[index]) {
                const tr = training[index];
                title.textContent = '보수교육 수정';
                document.getElementById('trainingModalId').value = tr.id || '';
                document.getElementById('trainingModalName').value = tr.name || '';
                document.getElementById('trainingModalStartDate').value = tr.start_date ? tr.start_date.split('T')[0] : '';
                document.getElementById('trainingModalEndDate').value = tr.end_date ? tr.end_date.split('T')[0] : '';
                document.getElementById('trainingModalHours').value = tr.hours || '';
                document.getElementById('trainingModalInstitution').value = tr.institution || '';
                document.getElementById('trainingModalDescription').value = tr.description || '';
                document.getElementById('trainingModalNotes').value = tr.notes || '';
            } else {
                title.textContent = '보수교육 추가';
                form.reset();
                document.getElementById('trainingModalId').value = '';
            }
            modal.classList.remove('hidden');
        };

        window.closeTrainingModal = function() {
            document.getElementById('trainingModal').classList.add('hidden');
            currentTrainingIndex = null;
        };

        window.handleSaveTraining = function(event) {
            event.preventDefault();
            const trData = {
                id: document.getElementById('trainingModalId').value || 'tr_' + Date.now(),
                name: document.getElementById('trainingModalName').value,
                start_date: document.getElementById('trainingModalStartDate').value || null,
                end_date: document.getElementById('trainingModalEndDate').value || null,
                hours: document.getElementById('trainingModalHours').value || null,
                institution: document.getElementById('trainingModalInstitution').value || null,
                description: document.getElementById('trainingModalDescription').value || null,
                notes: document.getElementById('trainingModalNotes').value || null
            };
            if (currentTrainingIndex !== null) {
                training[currentTrainingIndex] = trData;
            } else {
                training.push(trData);
            }
            closeTrainingModal();
            loadTraining();
        };

        window.deleteTraining = function(index) {
            if (!confirm('삭제하시겠습니까?')) return;
            training.splice(index, 1);
            loadTraining();
        };

        function loadTraining() {
            const container = document.getElementById('trainingContainer');
            if(!container) return;
            container.innerHTML = '';
            if (!training || training.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">등록된 보수교육이 없습니다.</div>';
                return;
            }
            training.forEach((tr, index) => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative';
                div.innerHTML = \`
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-gray-900">\${ tr.name || '-' }</h4>
                            <div class="text-sm text-gray-600 mt-1">
                                \${ tr.institution ? \`<span class="mr-2"><i class="fas fa-building mr-1"></i>\${tr.institution}</span>\` : '' }
                                \${ tr.hours ? \`<span><i class="fas fa-clock mr-1"></i>\${tr.hours}시간</span>\` : '' }
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                \${ tr.start_date || '' } ~ \${ tr.end_date || '' }
                            </div>
                        </div>
                        <div class="flex space-x-2">
                             <button type="button" onclick="openTrainingModal(\${index})" class="text-green-500 hover:text-green-700"><i class="fas fa-edit"></i></button>
                             <button type="button" onclick="deleteTraining(\${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                \`;
                container.appendChild(div);
            });
        }

        // --- Teaching History ---
        window.openTeachingHistoryModal = function(index = null) {
            currentTeachingIndex = index;
            const modal = document.getElementById('teachingHistoryModal');
            const title = document.getElementById('teachingModalTitle');
            const form = document.getElementById('teachingHistoryForm');
            
            if (index !== null && teachingHistory[index]) {
                const th = teachingHistory[index];
                title.textContent = '강의이력 수정';
                document.getElementById('teachingModalId').value = th.id || '';
                document.getElementById('teachingModalCourseName').value = th.course_name || '';
                document.getElementById('teachingModalStartDate').value = th.start_date ? th.start_date.split('T')[0] : '';
                document.getElementById('teachingModalEndDate').value = th.end_date ? th.end_date.split('T')[0] : '';
                document.getElementById('teachingModalStudentCount').value = th.student_count || '';
                document.getElementById('teachingModalDescription').value = th.description || '';
                document.getElementById('teachingModalNotes').value = th.notes || '';
            } else {
                title.textContent = '강의이력 추가';
                form.reset();
                document.getElementById('teachingModalId').value = '';
            }
            modal.classList.remove('hidden');
        };

        window.closeTeachingHistoryModal = function() {
            document.getElementById('teachingHistoryModal').classList.add('hidden');
            currentTeachingIndex = null;
        };

        window.handleSaveTeachingHistory = function(event) {
            event.preventDefault();
            const thData = {
                id: document.getElementById('teachingModalId').value || 'th_' + Date.now(),
                course_name: document.getElementById('teachingModalCourseName').value,
                start_date: document.getElementById('teachingModalStartDate').value || null,
                end_date: document.getElementById('teachingModalEndDate').value || null,
                student_count: document.getElementById('teachingModalStudentCount').value || null,
                description: document.getElementById('teachingModalDescription').value || null,
                notes: document.getElementById('teachingModalNotes').value || null
            };
            if (currentTeachingIndex !== null) {
                teachingHistory[currentTeachingIndex] = thData;
            } else {
                teachingHistory.push(thData);
            }
            closeTeachingHistoryModal();
            loadTeachingHistory();
        };

        window.deleteTeachingHistory = function(index) {
            if (!confirm('삭제하시겠습니까?')) return;
            teachingHistory.splice(index, 1);
            loadTeachingHistory();
        };

        function loadTeachingHistory() {
            const container = document.getElementById('teachingHistoryContainer');
            if(!container) return;
            container.innerHTML = '';
            if (!teachingHistory || teachingHistory.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">등록된 강의이력이 없습니다.</div>';
                return;
            }
            teachingHistory.forEach((th, index) => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative';
                div.innerHTML = \`
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-gray-900">\${ th.course_name || '-' }</h4>
                            <div class="text-sm text-gray-600 mt-1">
                                \${ th.student_count ? \`<span><i class="fas fa-users mr-1"></i>\${th.student_count}명</span>\` : '' }
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                \${ th.start_date || '' } ~ \${ th.end_date || '' }
                            </div>
                            \${ th.description ? \`<p class="text-sm text-gray-700 mt-2 line-clamp-2">\${th.description}</p>\` : '' }
                        </div>
                        <div class="flex space-x-2">
                             <button type="button" onclick="openTeachingHistoryModal(\${index})" class="text-indigo-500 hover:text-indigo-700"><i class="fas fa-edit"></i></button>
                             <button type="button" onclick="deleteTeachingHistory(\${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                \`;
                container.appendChild(div);
            });
        }

        // --- Certifications (Updated) ---
        window.openCertificationModal = function(index = null) {
            currentCertIndex = index;
            const modal = document.getElementById('certificationModal');
            const title = document.getElementById('certModalTitle');
            const form = document.getElementById('certificationForm');
            
            if (index !== null && certifications[index]) {
                const cert = certifications[index];
                title.textContent = '자격증 수정';
                document.getElementById('certModalId').value = cert.id || '';
                document.getElementById('certModalName').value = cert.name || '';
                document.getElementById('certModalIssueDate').value = cert.issue_date ? cert.issue_date.split('T')[0] : '';
                document.getElementById('certModalExpiryDate').value = cert.expiry_date ? cert.expiry_date.split('T')[0] : '';
                
                const fileUrls = cert.file_urls || (cert.file_url ? [{url: cert.file_url, name: cert.file_url.split('/').pop()}] : []);
                document.getElementById('certModalFileUrls').value = JSON.stringify(fileUrls);
                displayCertModalFiles(fileUrls);
            } else {
                title.textContent = '자격증 추가';
                form.reset();
                document.getElementById('certModalId').value = '';
                document.getElementById('certModalFileUrls').value = '[]';
                document.getElementById('certModalFileList').innerHTML = '';
            }
            modal.classList.remove('hidden');
        };

        window.closeCertificationModal = function() {
            document.getElementById('certificationModal').classList.add('hidden');
            currentCertIndex = null;
        };

        function displayCertModalFiles(fileUrls) {
            const fileList = document.getElementById('certModalFileList');
            fileList.innerHTML = '';
            if (!fileUrls || fileUrls.length === 0) return;
            
            fileUrls.forEach((fileInfo, index) => {
                const fileName = fileInfo.name || (typeof fileInfo === 'string' ? fileInfo.split('/').pop() : '파일');
                const fileUrl = fileInfo.url || fileInfo;
                
                const div = document.createElement('div');
                div.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200 mb-2';
                div.innerHTML = \`
                    <span class="text-sm text-gray-700 flex items-center"><i class="fas fa-file-pdf text-red-500 mr-2"></i>\${fileName}</span>
                    <div class="flex items-center gap-2">
                        <button type="button" class="text-blue-600 hover:text-blue-800 text-sm" onclick="downloadFile('\${fileUrl}', '\${fileName}')"><i class="fas fa-download"></i></button>
                        <button type="button" class="text-red-600 hover:text-red-800 text-sm" onclick="removeCertModalFile(\${index})"><i class="fas fa-trash"></i></button>
                    </div>
                \`;
                fileList.appendChild(div);
            });
        }

        window.removeCertModalFile = function(index) {
            if(!confirm('파일을 삭제하시겠습니까?')) return;
            const input = document.getElementById('certModalFileUrls');
            let files = JSON.parse(input.value || '[]');
            files.splice(index, 1);
            input.value = JSON.stringify(files);
            displayCertModalFiles(files);
        };

        window.handleSaveCertification = async function(event) {
            event.preventDefault();
            const certId = document.getElementById('certModalId').value || 'new_' + (certIdCounter++);
            const name = document.getElementById('certModalName').value;
            const issueDate = document.getElementById('certModalIssueDate').value;
            const expiryDate = document.getElementById('certModalExpiryDate').value;
            const fileUrlsInput = document.getElementById('certModalFileUrls');
            let fileUrls = JSON.parse(fileUrlsInput.value || '[]');

            // 파일 업로드 처리
            const fileInput = document.getElementById('certModalFileInput');
            if (fileInput.files && fileInput.files.length > 0) {
                const token = localStorage.getItem('token');
                for (let file of fileInput.files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('category', 'documents');
                    formData.append('folder', 'personnel_certs/' + certId);
                    
                    try {
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + token },
                            body: formData
                        });
                        const result = await response.json();
                        if (result.success) {
                            fileUrls.push({ url: result.data.url, name: result.data.originalName || file.name });
                        }
                    } catch(e) { console.error(e); }
                }
            }

            const certData = {
                id: certId,
                name: name,
                issue_date: issueDate || null,
                expiry_date: expiryDate || null,
                file_urls: fileUrls
            };
            
            if (currentCertIndex !== null) {
                certifications[currentCertIndex] = certData;
            } else {
                certifications.push(certData);
            }
            closeCertificationModal();
            loadCertifications();
        };

        window.deleteCertification = function(index) {
             if (!confirm('삭제하시겠습니까?')) return;
             certifications.splice(index, 1);
             loadCertifications();
        };

        function loadCertifications(data) {
             // data 인자가 있으면 초기로드로 간주하고 전역 변수 설정. 없으면 전역 변수 리렌더링.
             if (data !== undefined) {
                 if (Array.isArray(data)) certifications = data;
                 else if (typeof data === 'input' && data) { // JSON string handling
                    try { certifications = JSON.parse(data); } catch { certifications = []; }
                 } else certifications = [];
             }

             const container = document.getElementById('certificationsContainer');
             if(!container) return;
             container.innerHTML = '';
             
             if (!certifications || certifications.length === 0) {
                 container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">등록된 자격증이 없습니다.</div>';
                 return;
             }
             
             certifications.forEach((cert, index) => {
                 let fileButtonsHtml = '';
                 if (cert.file_urls && Array.isArray(cert.file_urls) && cert.file_urls.length > 0) {
                     cert.file_urls.forEach(f => {
                         const url = typeof f === 'string' ? f : f.url;
                         const name = typeof f === 'string' ? (url.split('/').pop() || '파일') : (f.name || f.url.split('/').pop() || '파일');
                         fileButtonsHtml += \`<button onclick="downloadFile('\${url}', '\${name}')" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded inline-flex items-center mr-2 mb-1 mt-1 border border-blue-100"><i class="fas fa-download mr-1"></i> \${name}</button>\`;
                     });
                 } else if (cert.file_url) {
                      const url = cert.file_url;
                      const name = url.split('/').pop() || '파일';
                      fileButtonsHtml = \`<button onclick="downloadFile('\${url}', '\${name}')" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded inline-flex items-center mr-2 mb-1 mt-1 border border-blue-100"><i class="fas fa-download mr-1"></i> \${name}</button>\`;
                 }

                 const div = document.createElement('div');
                 div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow';
                 div.innerHTML = \`
                    <div class="flex justify-between items-start">
                        <div class="flex-1 min-w-0 pr-4">
                            <h4 class="font-bold text-gray-900 truncate">\${ cert.name || '-' }</h4>
                            <div class="text-xs text-gray-500 mt-1">
                                \${ cert.issue_date || '' } ~ \${ cert.expiry_date || '' }
                            </div>
                            <div class="mt-2 flex flex-wrap">
                                \${ fileButtonsHtml }
                            </div>
                        </div>
                        <div class="flex space-x-2 shrink-0">
                             <button type="button" onclick="openCertificationModal(\${index})" class="text-blue-500 hover:text-blue-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"><i class="fas fa-edit"></i></button>
                             <button type="button" onclick="deleteCertification(\${index})" class="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                \`;
                 container.appendChild(div);
             });
        }
        
        // ==========================================
        //  Main Functions
        // ==========================================

        window.closeModal = function(id) {
            document.getElementById(id).classList.add('hidden');
        };

        window.openEditModalById = async function(id) {
             const p = allPersonnel.find(person => person.id == id);
             if (!p) {
                 alert('데이터를 찾을 수 없습니다.');
                 return;
             }
 
             document.getElementById('modalTitle').textContent = '교강사 정보 수정';
             document.getElementById('personnelId').value = p.id;
             
             // Basic Info
             document.getElementById('pName').value = p.name;
             document.getElementById('pPosition').value = p.position || '';
             document.getElementById('pEmail').value = p.email;
             document.getElementById('pPhone').value = p.phone;
             document.getElementById('pSubject').value = p.subject || '';
             document.getElementById('pJoined').value = p.joined_at ? p.joined_at.split('T')[0] : '';
             document.getElementById('pType').value = p.type || 'full';
             document.getElementById('pStatus').value = p.instructor_status || 'active';
             
             // Profile Image
             document.getElementById('pImageUrl').value = p.profile_image || '';
             const preview = document.getElementById('pImagePreview');
             const placeholder = document.getElementById('pImagePlaceholder');
             if (p.profile_image) {
                 preview.src = p.profile_image;
                 preview.classList.remove('hidden');
                 placeholder.classList.add('hidden');
             } else {
                 preview.src = '';
                 preview.classList.add('hidden');
                 placeholder.classList.remove('hidden');
             }
 
             // Parse JSON fields
             try { education = typeof p.education === 'string' ? JSON.parse(p.education) : (p.education || []); } catch { education = []; }
             try { career = typeof p.career === 'string' ? JSON.parse(p.career) : (p.career || []); } catch { career = []; }
             try { certifications = typeof p.certifications === 'string' ? JSON.parse(p.certifications) : (p.certifications || []); } catch { certifications = []; }
             try { training = typeof p.training_history === 'string' ? JSON.parse(p.training_history) : (p.training_history || []); } catch { training = []; }
             try { teachingHistory = typeof p.teaching_history === 'string' ? JSON.parse(p.teaching_history) : (p.teaching_history || []); } catch { teachingHistory = []; }
 
             // UI Refresh
             loadEducation();
             loadCareer();
             loadCertifications();
             loadTraining();
             loadTeachingHistory();
             
             switchPersonnelTab('education');
             document.getElementById('createPersonnelModal').classList.remove('hidden');
        };

        window.handlePImage = async function(input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', 'profile');
                
                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: formData
                    });
                    const result = await response.json();
                    if (result.success) {
                        document.getElementById('pImageUrl').value = result.data.url;
                        document.getElementById('pImagePreview').src = result.data.url;
                        document.getElementById('pImagePreview').classList.remove('hidden');
                        document.getElementById('pImagePlaceholder').classList.add('hidden');
                    }
                } catch (e) { console.error(e); }
            }
        };

        window.clearPImage = function() {
             document.getElementById('pImageUrl').value = '';
             document.getElementById('pImagePreview').classList.add('hidden');
             document.getElementById('pImagePreview').src = '';
             document.getElementById('pImagePlaceholder').classList.remove('hidden');
        };

        async function handleSavePersonnel(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;

            // 상세 데이터 JSON 변환 추가
            data.education = JSON.stringify(education);
            data.career = JSON.stringify(career);
            data.certifications = JSON.stringify(certifications);
            data.training_history = JSON.stringify(training);
            data.teaching_history = JSON.stringify(teachingHistory);

            try {
                let url = '/api/hrd/personnel';
                let method = 'POST';
                if (id) {
                    url = '/api/hrd/personnel/' + id;
                    method = 'PUT';
                }
                
                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    closeModal('createPersonnelModal');
                    loadData();
                } else {
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
            document.getElementById('pStatus').value = 'active';
            
            // 전역 변수 초기화
            education = [];
            career = [];
            certifications = [];
            training = [];
            teachingHistory = [];
            
            clearPImage();
            switchPersonnelTab('education');
            document.getElementById('createPersonnelModal').classList.remove('hidden');
            
            // UI 초기화
            loadEducation();
            loadCareer();
            loadCertifications();
            loadTraining();
            loadTeachingHistory();
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

            // 상세 데이터 파싱 및 로드
            try { education = typeof data.education === 'string' ? JSON.parse(data.education) : (data.education || []); } catch { education = []; }
            try { career = typeof data.career === 'string' ? JSON.parse(data.career) : (data.career || []); } catch { career = []; }
            try { training = typeof data.training_history === 'string' ? JSON.parse(data.training_history) : (data.training_history || []); } catch { training = []; }
            try { teachingHistory = typeof data.teaching_history === 'string' ? JSON.parse(data.teaching_history) : (data.teaching_history || []); } catch { teachingHistory = []; }
            try { certifications = typeof data.certifications === 'string' ? JSON.parse(data.certifications) : (data.certifications || []); } catch { certifications = []; }

            // 배열인지 재확인 (null일 경우 대비)
            if (!Array.isArray(education)) education = [];
            if (!Array.isArray(career)) career = [];
            if (!Array.isArray(training)) training = [];
            if (!Array.isArray(teachingHistory)) teachingHistory = [];
            if (!Array.isArray(certifications)) certifications = [];

            loadEducation();
            loadCareer();
            loadTraining();
            loadTeachingHistory();
            loadCertifications(); // 이미 전역 변수 설정했으므로 인자 없이 호출

            if (data.profile_image) {
                document.getElementById('pImageUrl').value = data.profile_image;
                document.getElementById('pImagePreview').src = data.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
            } else {
                clearPImage();
            }

            switchPersonnelTab('education');
            document.getElementById('createPersonnelModal').classList.remove('hidden');
        }

        window.switchPersonnelTab = function(tab) {
            currentPersonnelTab = tab;
            document.querySelectorAll('.tab-active-personnel, .tab-inactive-personnel').forEach(btn => {
                btn.classList.remove('tab-active-personnel', 'border-blue-600', 'text-blue-600');
                btn.classList.add('tab-inactive-personnel', 'border-transparent', 'text-gray-400');
            });
            document.getElementById('contentEducation').classList.add('hidden');
            document.getElementById('contentCertifications').classList.add('hidden');
            document.getElementById('contentTraining').classList.add('hidden');
            document.getElementById('contentTeaching').classList.add('hidden');
            
            const activeTab = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
            if (activeTab) {
                activeTab.classList.remove('tab-inactive-personnel', 'border-transparent', 'text-gray-400');
                activeTab.classList.add('tab-active-personnel', 'border-blue-600', 'text-blue-600');
            }
            
            const activeContent = document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1));
            if (activeContent) {
                activeContent.classList.remove('hidden');
                // 탭 전환 시 리렌더링 (혹시 모를 UI 꼬임 방지)
                if (tab === 'education') { loadEducation(); loadCareer(); }
                else if (tab === 'certifications') loadCertifications();
                else if (tab === 'training') loadTraining();
                else if (tab === 'teaching') loadTeachingHistory();
            }
        };
        

        // Initialize with default tab
        let currentPersonnelTab = 'education';

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
