import { teacherSidebar } from './components/teacher_sidebar';

export const teacherProfileHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개인정보 수정 - 강사 대시보드</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
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
        ${teacherSidebar('profile')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">개인정보 수정</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                        <a href="/teacher" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-arrow-left mr-1"></i> 대시보드로
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-5xl mx-auto">
                <!-- 개인정보 수정 폼 -->
                <form id="profileForm" onsubmit="handleSaveProfile(event)" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            </div>
                        </div>
                    </div>

                    <!-- 탭 네비게이션 -->
                    <div class="bg-white border-b border-gray-200 px-8">
                        <div class="flex items-center gap-8">
                            <button type="button" data-tab="education" id="tabEducation" class="pb-4 text-sm font-black uppercase tracking-widest tab-active-profile transition-all border-b-2 border-blue-600 text-blue-600">
                                <i class="fas fa-graduation-cap mr-2"></i> 학력 및 경력
                            </button>
                            <button type="button" data-tab="certifications" id="tabCertifications" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-certificate mr-2"></i> 자격증
                            </button>
                            <button type="button" data-tab="training" id="tabTraining" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-chalkboard-teacher mr-2"></i> 보수교육
                            </button>
                            <button type="button" data-tab="teaching" id="tabTeaching" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-book-open mr-2"></i> 강의이력
                            </button>
                        </div>
                    </div>

                    <!-- 탭 컨텐츠 영역 -->
                    <div class="bg-gray-50/50 p-8">
                        <!-- 탭 1: 학력 및 경력 -->
                        <div id="contentEducation" class="space-y-6">
                            <!-- 학력 목록 -->
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div class="flex items-center justify-between mb-6">
                                    <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i class="fas fa-university mr-3 text-blue-500"></i> 학력 목록
                                    </h5>
                                    <button type="button" data-action="openEducationModal" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                                        <i class="fas fa-plus mr-2"></i> 학력 추가
                                    </button>
                                </div>
                                <div id="educationContainer" class="space-y-4">
                                    <!-- 학력 목록이 여기에 동적으로 표시됨 -->
                                </div>
                            </div>

                            <!-- 경력 목록 -->
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div class="flex items-center justify-between mb-6">
                                    <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i class="fas fa-briefcase mr-3 text-purple-500"></i> 경력 목록
                                    </h5>
                                    <button type="button" data-action="openCareerModal" class="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/20 flex items-center">
                                        <i class="fas fa-plus mr-2"></i> 경력 추가
                                    </button>
                                </div>
                                <div id="careerContainer" class="space-y-4">
                                    <!-- 경력 목록이 여기에 동적으로 표시됨 -->
                                </div>
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
                                <div id="certificationsContainer" class="space-y-4">
                                    <!-- 자격증 목록이 여기에 동적으로 표시됨 -->
                                </div>
                            </div>
                        </div>

                        <!-- 탭 3: 보수교육 -->
                        <div id="contentTraining" class="hidden space-y-6">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div class="flex items-center justify-between mb-6">
                                    <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i class="fas fa-chalkboard-teacher mr-3 text-green-500"></i> 보수교육 목록
                                    </h5>
                                    <button type="button" data-action="openTrainingModal" class="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/20 flex items-center">
                                        <i class="fas fa-plus mr-2"></i> 보수교육 추가
                                    </button>
                                </div>
                                <div id="trainingContainer" class="space-y-4">
                                    <!-- 보수교육 목록이 여기에 동적으로 표시됨 -->
                                </div>
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
                                <div id="teachingHistoryContainer" class="space-y-4">
                                    <!-- 강의이력 목록이 여기에 동적으로 표시됨 -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 하단 버튼 -->
                    <div class="bg-white border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
                        <button type="button" onclick="location.href='/teacher'" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                            <i class="fas fa-save mr-2"></i> 저장하기
                        </button>
                    </div>
                </form>
            </div>
        </main>
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
                <button type="button" onclick="window.closeEducationModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="educationForm" onsubmit="window.handleSaveEducation(event)">
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
                        <button type="button" onclick="window.closeEducationModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
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
                <button type="button" onclick="window.closeCareerModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="careerForm" onsubmit="window.handleSaveCareer(event)">
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
                        <button type="button" onclick="window.closeCareerModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
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
                <button type="button" onclick="window.closeTrainingModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="trainingForm" onsubmit="window.handleSaveTraining(event)">
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
                        <button type="button" onclick="window.closeTrainingModal()" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
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
        let currentProfileTab = 'education';
        let currentUserId = null;

        // 전역 함수들을 즉시 정의 (HTML 파싱 전에 접근 가능하도록)
        // 학력 모달 관리 변수
        let currentEducationIndex = null;
        let currentCareerIndex = null;
        let currentTrainingIndex = null;
        
        // 학력 모달 함수들
        window.openEducationModal = function(index = null) {
            currentEducationIndex = index;
            const modal = document.getElementById('educationModal');
            const title = document.getElementById('educationModalTitle');
            const form = document.getElementById('educationForm');
            
            if (!modal || !title || !form) {
                console.error('Education modal elements not found');
                return;
            }
            
            if (index !== null && education[index]) {
                // 수정 모드
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
                // 추가 모드
                title.textContent = '학력 추가';
                form.reset();
                document.getElementById('educationModalId').value = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeEducationModal = function() {
            const modal = document.getElementById('educationModal');
            if (modal) {
                modal.classList.add('hidden');
            }
            currentEducationIndex = null;
        };
        
        // 경력 모달 함수들
        window.openCareerModal = function(index = null) {
            currentCareerIndex = index;
            const modal = document.getElementById('careerModal');
            const title = document.getElementById('careerModalTitle');
            const form = document.getElementById('careerForm');
            
            if (!modal || !title || !form) {
                console.error('Career modal elements not found');
                return;
            }
            
            if (index !== null && career[index]) {
                // 수정 모드
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
                // 추가 모드
                title.textContent = '경력 추가';
                form.reset();
                document.getElementById('careerModalId').value = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeCareerModal = function() {
            const modal = document.getElementById('careerModal');
            if (modal) {
                modal.classList.add('hidden');
            }
            currentCareerIndex = null;
        };
        
        // 보수교육 모달 함수들
        window.openTrainingModal = function(index = null) {
            currentTrainingIndex = index;
            const modal = document.getElementById('trainingModal');
            const title = document.getElementById('trainingModalTitle');
            const form = document.getElementById('trainingForm');
            
            if (!modal || !title || !form) {
                console.error('Training modal elements not found');
                return;
            }
            
            if (index !== null && training[index]) {
                // 수정 모드
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
                // 추가 모드
                title.textContent = '보수교육 추가';
                form.reset();
                document.getElementById('trainingModalId').value = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeTrainingModal = function() {
            const modal = document.getElementById('trainingModal');
            if (modal) {
                modal.classList.add('hidden');
            }
            currentTrainingIndex = null;
        };
        
        // switchProfileTab 함수 - 탭 전환 기능
        window.switchProfileTab = function(tab) {
            if (typeof currentProfileTab === 'undefined') {
                currentProfileTab = 'education';
            }
            currentProfileTab = tab;
            
            // 탭 버튼 스타일 업데이트
            ['education', 'certifications', 'training', 'teaching'].forEach(t => {
                const btnId = 'tab' + t.charAt(0).toUpperCase() + t.slice(1);
                const contentId = 'content' + t.charAt(0).toUpperCase() + t.slice(1);
                const btn = document.getElementById(btnId);
                const content = document.getElementById(contentId);
                
                if (!btn || !content) {
                    console.warn('Tab element not found:', t, 'btnId:', btnId, 'contentId:', contentId);
                    return;
                }
                
                if (t === tab) {
                    btn.className = 'pb-4 text-sm font-black uppercase tracking-widest tab-active-profile transition-all border-b-2 border-blue-600 text-blue-600';
                    content.classList.remove('hidden');
                    
                    // 탭이 활성화될 때 해당 데이터 다시 로드
                    setTimeout(() => {
                        if (t === 'education' && typeof loadEducation === 'function') {
                            loadEducation();
                        } else if (t === 'certifications' && typeof loadCertifications === 'function') {
                            loadCertifications();
                        } else if (t === 'training' && typeof loadTraining === 'function') {
                            loadTraining();
                        } else if (t === 'teaching' && typeof loadTeachingHistory === 'function') {
                            loadTeachingHistory();
                        }
                    }, 50);
                } else {
                    btn.className = 'pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600';
                    content.classList.add('hidden');
                }
            });
        };

        // 탭 버튼과 모달 버튼에 이벤트 리스너 추가
        function setupEventListeners() {
            // 탭 버튼
            const tabButtons = document.querySelectorAll('[data-tab]');
            tabButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tab = this.getAttribute('data-tab');
                    if (tab && window.switchProfileTab) {
                        window.switchProfileTab(tab);
                    }
                });
            });
            
            // 모달 열기 버튼
            const modalButtons = document.querySelectorAll('[data-action]');
            modalButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const action = this.getAttribute('data-action');
                    if (action && window[action]) {
                        window[action]();
                    } else {
                        console.error('Function not found:', action);
                    }
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded fired');
            try {
                checkLogin();
                console.log('checkLogin completed');
                loadProfileData();
                console.log('loadProfileData called');
                setupEventListeners();
                console.log('setupEventListeners completed');
            } catch (error) {
                console.error('Error in DOMContentLoaded:', error);
            }
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
            // user.id를 숫자로 변환 (문자열이어도 숫자로 변환)
            const userIdNum = parseInt(user.id);
            currentUserId = isNaN(userIdNum) ? user.id : userIdNum;
        }

        async function loadProfileData() {
            console.log('loadProfileData started');
            try {
                const token = localStorage.getItem('token');
                console.log('Token exists:', !!token);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('User data:', user);
                
                if (!token) {
                    console.error('No token found');
                    populateBasicInfo(user);
                    return;
                }
                
                // user.id를 숫자로 변환
                const userIdNum = parseInt(user.id);
                const userId = isNaN(userIdNum) ? user.id : userIdNum;
                console.log('Looking for userId:', userId);
                
                // 교강사 목록에서 본인 정보 찾기
                console.log('Fetching personnel data...');
                const response = await fetch('/api/hrd/personnel', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    console.error('Response not OK:', response.status, response.statusText);
                    populateBasicInfo(user);
                    return;
                }
                
                const result = await response.json();
                console.log('API result:', result);
                
                if (result.success && result.data) {
                    // ID 타입을 고려하여 찾기 (숫자와 문자열 모두 비교)
                    const myData = result.data.find(p => {
                        const pIdNum = parseInt(p.id);
                        const pId = isNaN(pIdNum) ? p.id : pIdNum;
                        return pId === userId || p.id === userId || p.id === user.id;
                    });
                    
                    if (myData) {
                        console.log('Found profile data:', myData);
                        populateForm(myData);
                    } else {
                        console.log('Profile data not found in personnel list, using basic info');
                        console.log('Available personnel IDs:', result.data.map(p => p.id));
                        // 교강사 정보가 없으면 기본 정보만 표시
                        populateBasicInfo(user);
                    }
                } else {
                    console.error('Failed to load profile:', result.error || 'Unknown error');
                    populateBasicInfo(user);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                populateBasicInfo(user);
            }
        }

        function populateBasicInfo(user) {
            console.log('populateBasicInfo called with user:', user);
            try {
                const nameEl = document.getElementById('pName');
                const emailEl = document.getElementById('pEmail');
                const phoneEl = document.getElementById('pPhone');
                
                if (!nameEl || !emailEl || !phoneEl) {
                    console.error('Form elements not found:', { nameEl: !!nameEl, emailEl: !!emailEl, phoneEl: !!phoneEl });
                    return;
                }
                
                nameEl.value = user.name || '';
                emailEl.value = user.email || '';
                phoneEl.value = user.phone || '';
                console.log('Basic info populated:', { name: user.name, email: user.email, phone: user.phone });
                
                if (user.profile_image) {
                    const imgPreview = document.getElementById('pImagePreview');
                    const imgPlaceholder = document.getElementById('pImagePlaceholder');
                    const imgUrl = document.getElementById('pImageUrl');
                    
                    if (imgPreview && imgPlaceholder && imgUrl) {
                        imgPreview.src = user.profile_image;
                        imgPreview.classList.remove('hidden');
                        imgPlaceholder.classList.add('hidden');
                        imgUrl.value = user.profile_image;
                    }
                }
            } catch (error) {
                console.error('Error in populateBasicInfo:', error);
            }
        }

        function populateForm(data) {
            console.log('populateForm called with data:', data);
            try {
                // 기본 정보
                const nameEl = document.getElementById('pName');
                const emailEl = document.getElementById('pEmail');
                const phoneEl = document.getElementById('pPhone');
                const positionEl = document.getElementById('pPosition');
                const subjectEl = document.getElementById('pSubject');
                const typeEl = document.getElementById('pType');
                const joinedEl = document.getElementById('pJoined');
                
                if (!nameEl || !emailEl || !phoneEl) {
                    console.error('Required form elements not found');
                    return;
                }
                
                nameEl.value = data.name || '';
                emailEl.value = data.email || '';
                phoneEl.value = data.phone || '';
                if (positionEl) positionEl.value = data.position || '';
                if (subjectEl) subjectEl.value = data.subject || '';
                if (typeEl) typeEl.value = data.type || 'full';
                if (joinedEl && data.joined_at) {
                    joinedEl.value = data.joined_at.split('T')[0];
                }
                console.log('Basic form fields populated');
                
                // 프로필 이미지
                if (data.profile_image) {
                    document.getElementById('pImagePreview').src = data.profile_image;
                    document.getElementById('pImagePreview').classList.remove('hidden');
                    document.getElementById('pImagePlaceholder').classList.add('hidden');
                    document.getElementById('pImageUrl').value = data.profile_image;
                }
                
                    // 상세 정보 - JSON 배열로 파싱
                // 학력
                if (data.education) {
                    try {
                        const eduData = typeof data.education === 'string' ? JSON.parse(data.education) : data.education;
                        education = Array.isArray(eduData) ? eduData : [];
                    } catch (e) {
                        // 기존 텍스트 형식인 경우 빈 배열로 처리
                        console.log('Education is not JSON array, treating as empty:', e);
                        education = [];
                    }
                } else {
                    education = [];
                }
                
                // 경력
                if (data.career) {
                    try {
                        const carData = typeof data.career === 'string' ? JSON.parse(data.career) : data.career;
                        career = Array.isArray(carData) ? carData : [];
                    } catch (e) {
                        // 기존 텍스트 형식인 경우 빈 배열로 처리
                        console.log('Career is not JSON array, treating as empty:', e);
                        career = [];
                    }
                } else {
                    career = [];
                }
                
                // 보수교육
                if (data.training_history) {
                    try {
                        const trData = typeof data.training_history === 'string' ? JSON.parse(data.training_history) : data.training_history;
                        training = Array.isArray(trData) ? trData : [];
                    } catch (e) {
                        // 기존 텍스트 형식인 경우 빈 배열로 처리
                        console.log('Training history is not JSON array, treating as empty:', e);
                        training = [];
                    }
                } else {
                    training = [];
                }
                
                // 자격증
                if (data.certifications) {
                    try {
                        let certs = [];
                        if (Array.isArray(data.certifications)) {
                            certs = data.certifications;
                        } else if (typeof data.certifications === 'string') {
                            const parsed = JSON.parse(data.certifications);
                            certs = Array.isArray(parsed) ? parsed : [];
                        }
                        certifications = certs || [];
                        console.log('Loaded certifications:', certifications);
                    } catch (e) {
                        console.error('Failed to parse certifications:', e, data.certifications);
                        certifications = [];
                    }
                } else {
                    certifications = [];
                }
                
                // 탭이 활성화되면 리스트 로드
                setTimeout(() => {
                    if (currentProfileTab === 'education') {
                        loadEducation();
                        loadCareer();
                    } else if (currentProfileTab === 'certifications') {
                        loadCertifications();
                    } else if (currentProfileTab === 'training') {
                        loadTraining();
                    } else if (currentProfileTab === 'teaching') {
                        loadTeachingHistory();
                    }
                }, 100);
                
                // 강의이력
                if (data.teaching_history) {
                    try {
                        let history = [];
                        if (Array.isArray(data.teaching_history)) {
                            history = data.teaching_history;
                        } else if (typeof data.teaching_history === 'string') {
                            const parsed = JSON.parse(data.teaching_history);
                            history = Array.isArray(parsed) ? parsed : [];
                        }
                        teachingHistory = history || [];
                        console.log('Loaded teaching history:', teachingHistory);
                    } catch (e) {
                        console.error('Failed to parse teaching_history:', e, data.teaching_history);
                        teachingHistory = [];
                    }
                } else {
                    teachingHistory = [];
                }
            } catch (error) {
                console.error('Error in populateForm:', error);
            }
        }

        // switchProfileTab은 이미 위에서 window 객체에 할당됨

        // 프로필 이미지 업로드
        window.handlePImage = async function(input) {
            if (!input.files || !input.files[0]) return;
            
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'images');
            formData.append('folder', 'profiles');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                
                const result = await response.json();
                if (result.success) {
                    const imageUrl = result.data.url;
                    document.getElementById('pImagePreview').src = imageUrl;
                    document.getElementById('pImagePreview').classList.remove('hidden');
                    document.getElementById('pImagePlaceholder').classList.add('hidden');
                    document.getElementById('pImageUrl').value = imageUrl;
                } else {
                    alert('이미지 업로드 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Image upload error:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        };

        // 자격증 모달 관리
        let currentCertIndex = null;
        
        window.openCertificationModal = function(index = null) {
            currentCertIndex = index;
            const modal = document.getElementById('certificationModal');
            const title = document.getElementById('certModalTitle');
            const form = document.getElementById('certificationForm');
            
            if (index !== null && certifications[index]) {
                // 수정 모드
                const cert = certifications[index];
                title.textContent = '자격증 수정';
                document.getElementById('certModalId').value = cert.id || '';
                document.getElementById('certModalName').value = cert.name || '';
                document.getElementById('certModalIssueDate').value = cert.issue_date ? cert.issue_date.split('T')[0] : '';
                document.getElementById('certModalExpiryDate').value = cert.expiry_date ? cert.expiry_date.split('T')[0] : '';
                
                // 파일 목록 표시
                const fileUrls = cert.file_urls || [];
                document.getElementById('certModalFileUrls').value = JSON.stringify(fileUrls);
                displayCertModalFiles(fileUrls);
            } else {
                // 추가 모드
                title.textContent = '자격증 추가';
                form.reset();
                document.getElementById('certModalId').value = '';
                document.getElementById('certModalFileUrls').value = '[]';
                document.getElementById('certModalFileList').innerHTML = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeCertificationModal = function() {
            const modal = document.getElementById('certificationModal');
            modal.classList.add('hidden');
            currentCertIndex = null;
        };
        
        function displayCertModalFiles(fileUrls) {
            const fileList = document.getElementById('certModalFileList');
            fileList.innerHTML = '';
            
            if (!fileUrls || fileUrls.length === 0) return;
            
            fileUrls.forEach((fileInfo, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200 mb-2';
                const fileName = fileInfo.name || (typeof fileInfo === 'string' ? fileInfo.split('/').pop() : '파일');
                const fileUrl = fileInfo.url || fileInfo;
                fileItem.innerHTML = 
                    '<span class="text-sm text-gray-700 flex items-center">' +
                        '<i class="fas fa-file-pdf text-red-500 mr-2"></i>' +
                        fileName +
                    '</span>' +
                    '<div class="flex items-center gap-2">' +
                        '<button type="button" onclick="downloadCertFile(\'' + fileUrl + '\', \'' + fileName + '\')" class="text-blue-600 hover:text-blue-800 text-sm">' +
                            '<i class="fas fa-download"></i>' +
                        '</button>' +
                        '<button type="button" onclick="removeCertModalFile(' + index + ')" class="text-red-600 hover:text-red-800 text-sm">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</div>';
                fileList.appendChild(fileItem);
            });
        }
        
        function removeCertModalFile(index) {
            if (!confirm('파일을 삭제하시겠습니까?')) return;
            
            const fileUrlsInput = document.getElementById('certModalFileUrls');
            let files = JSON.parse(fileUrlsInput.value || '[]');
            files.splice(index, 1);
            fileUrlsInput.value = JSON.stringify(files);
            displayCertModalFiles(files);
        };
        
        window.handleSaveCertification = async function(event) {
            event.preventDefault();
            
            const form = event.target;
            const certId = document.getElementById('certModalId').value || 'new_' + (certIdCounter++);
            const name = document.getElementById('certModalName').value;
            const issueDate = document.getElementById('certModalIssueDate').value;
            const expiryDate = document.getElementById('certModalExpiryDate').value;
            const fileUrlsInput = document.getElementById('certModalFileUrls');
            let fileUrls = [];
            try {
                fileUrls = JSON.parse(fileUrlsInput.value || '[]');
            } catch (e) {}
            
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
                            fileUrls.push({
                                url: result.data.url,
                                name: result.data.originalName || file.name
                            });
                        }
                    } catch (error) {
                        console.error('File upload error:', error);
                    }
                }
            }
            
            const certData = {
                id: certId,
                name: name || null,
                issue_date: issueDate || null,
                expiry_date: expiryDate || null,
                file_urls: fileUrls
            };
            
            if (currentCertIndex !== null) {
                // 수정
                certifications[currentCertIndex] = certData;
            } else {
                // 추가
                certifications.push(certData);
            }
            
            closeCertificationModal();
            loadCertifications();
        };
        
        window.deleteCertification = function(index) {
            if (!confirm('자격증을 삭제하시겠습니까?')) return;
            certifications.splice(index, 1);
            loadCertifications();
        };
        
        // 기존 addCertification 함수는 더 이상 사용하지 않음 (하위 호환성을 위해 유지)
        function addCertification(certData = null) {
            // 이 함수는 더 이상 사용하지 않지만 호환성을 위해 유지
            console.warn('addCertification is deprecated, use openCertificationModal instead');
        }

        // 이 함수는 더 이상 사용하지 않음 (모달 구조로 변경됨)
        async function handleCertFileUpload(event, certId) {
            const files = event.target.files;
            if (!files || files.length === 0) return;
            
            const token = localStorage.getItem('token');
            const fileListEl = event.target.closest('[data-cert-id]').querySelector('.cert-file-list');
            const fileUrlsInput = event.target.closest('[data-cert-id]').querySelector('.cert-file-urls');
            
            // 기존 파일 URL 가져오기
            let existingFiles = [];
            try {
                const existingValue = fileUrlsInput.value;
                if (existingValue && existingValue !== '[]') {
                    existingFiles = JSON.parse(existingValue);
                }
            } catch (e) {}
            
            for (let file of files) {
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
                        const fileInfo = {
                            url: result.data.url,
                            name: result.data.originalName || file.name
                        };
                        existingFiles.push(fileInfo);
                        
                        // 파일 목록에 추가
                        const fileItem = document.createElement('div');
                        fileItem.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200';
                        fileItem.setAttribute('data-file-name', fileInfo.name);
                        // URL과 파일명을 이스케이프 처리 (HTML 속성용)
                        const escapedUrl = fileInfo.url.replace(/'/g, "&#39;").replace(/"/g, '&quot;').replace(/&/g, '&amp;');
                        const escapedName = (fileInfo.name || '').replace(/'/g, "&#39;").replace(/"/g, '&quot;').replace(/&/g, '&amp;');
                        
                        fileItem.innerHTML = '<span class="text-sm text-gray-700 flex items-center">' +
                            '<i class="fas fa-file-pdf text-red-500 mr-2"></i>' +
                            escapedName +
                            '</span>' +
                            '<div class="flex items-center gap-2">' +
                            '<button type="button" onclick="window.downloadCertFile(\'' + fileInfo.url.replace(/'/g, "\\'") + '\', \'' + (fileInfo.name || '').replace(/'/g, "\\'") + '\')" class="text-blue-600 hover:text-blue-800 text-sm">' +
                            '<i class="fas fa-download"></i>' +
                            '</button>' +
                            '<button type="button" onclick="window.removeCertFile(this, \'' + fileInfo.url.replace(/'/g, "\\'") + '\')" class="text-red-600 hover:text-red-800 text-sm">' +
                            '<i class="fas fa-trash"></i>' +
                            '</button>' +
                            '</div>';
                        fileListEl.appendChild(fileItem);
                    }
                } catch (error) {
                    console.error('File upload error:', error);
                    alert('파일 업로드 중 오류가 발생했습니다: ' + file.name);
                }
            }
            
            // 파일 URL 업데이트
            fileUrlsInput.value = JSON.stringify(existingFiles);
        }

        // 이 함수는 더 이상 사용하지 않음 (모달 구조로 변경됨)
        function loadCertFiles(certId, fileUrls) {
            const certEl = document.querySelector(\`[data-cert-id="\${certId}"]\`);
            if (!certEl) return;
            
            const fileListEl = certEl.querySelector('.cert-file-list');
            const fileUrlsInput = certEl.querySelector('.cert-file-urls');
            
            // fileUrls를 배열로 정규화
            let files = [];
            if (Array.isArray(fileUrls)) {
                files = fileUrls.map(f => {
                    if (typeof f === 'string') {
                        return { url: f, name: f.split('/').pop() || '파일' };
                    }
                    return f;
                });
            } else if (fileUrls) {
                files = [{ url: fileUrls, name: fileUrls.split('/').pop() || '파일' }];
            }
            
            fileListEl.innerHTML = '';
            files.forEach(fileInfo => {
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200';
                fileItem.setAttribute('data-file-name', fileInfo.name || fileInfo.url.split('/').pop());
                // URL과 파일명을 이스케이프 처리
                const fileName = fileInfo.name || fileInfo.url.split('/').pop();
                // URL과 파일명을 이스케이프 처리 (HTML 속성용)
                const escapedUrl = fileInfo.url.replace(/'/g, "&#39;").replace(/"/g, '&quot;').replace(/&/g, '&amp;');
                const escapedName = (fileName || '').replace(/'/g, "&#39;").replace(/"/g, '&quot;').replace(/&/g, '&amp;');
                
                fileItem.innerHTML = '<span class="text-sm text-gray-700 flex items-center">' +
                    '<i class="fas fa-file-pdf text-red-500 mr-2"></i>' +
                    escapedName +
                    '</span>' +
                    '<div class="flex items-center gap-2">' +
                    '<button type="button" onclick="window.downloadCertFile(\'' + fileInfo.url.replace(/'/g, "\\'") + '\', \'' + (fileName || '').replace(/'/g, "\\'") + '\')" class="text-blue-600 hover:text-blue-800 text-sm">' +
                    '<i class="fas fa-download"></i>' +
                    '</button>' +
                    '<button type="button" onclick="window.removeCertFile(this, \'' + fileInfo.url.replace(/'/g, "\\'") + '\')" class="text-red-600 hover:text-red-800 text-sm">' +
                    '<i class="fas fa-trash"></i>' +
                    '</button>' +
                    '</div>';
                fileListEl.appendChild(fileItem);
            });
            
            fileUrlsInput.value = JSON.stringify(files);
        }

        window.removeCertFile = function(button, fileUrl) {
            if (!confirm('파일을 삭제하시겠습니까?')) return;
            
            const fileItem = button.closest('[data-file-name]');
            const certEl = fileItem.closest('[data-cert-id]');
            const fileUrlsInput = certEl.querySelector('.cert-file-urls');
            
            try {
                let files = JSON.parse(fileUrlsInput.value || '[]');
                files = files.filter(f => f.url !== fileUrl);
                fileUrlsInput.value = JSON.stringify(files);
                fileItem.remove();
            } catch (e) {
                console.error('Failed to remove file from list:', e);
            }
        };

        window.downloadCertFile = async function(fileUrl, fileName) {
            try {
                const token = localStorage.getItem('token');
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
                    throw new Error(\`파일 다운로드 실패: \${response.status}\`);
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
        };

        function loadCertifications() {
            const container = document.getElementById('certificationsContainer');
            if (!container) {
                console.warn('certificationsContainer not found');
                return;
            }
            
            console.log('loadCertifications called, certifications:', certifications);
            container.innerHTML = '';
            
            if (!certifications || certifications.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-certificate text-4xl mb-3 opacity-50"></i><p class="text-sm">자격증이 없습니다.</p><p class="text-xs mt-1">추가 버튼을 클릭하여 자격증을 추가하세요.</p></div>';
                return;
            }
            
            // 리스트 형태로 표시
            certifications.forEach((cert, index) => {
                const certCard = document.createElement('div');
                certCard.className = 'bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition';
                certCard.innerHTML = 
                    '<div class="flex items-start justify-between">' +
                        '<div class="flex-1">' +
                            '<h6 class="font-bold text-gray-800 mb-2">' + (cert.name || '자격증명 없음') + '</h6>' +
                            '<div class="flex flex-wrap gap-4 text-sm text-gray-600">' +
                                (cert.issue_date ? '<div><i class="fas fa-calendar-alt mr-1 text-blue-500"></i> 발급일: ' + cert.issue_date.split('T')[0] + '</div>' : '') +
                                (cert.expiry_date ? '<div><i class="fas fa-calendar-times mr-1 text-orange-500"></i> 만료일: ' + cert.expiry_date.split('T')[0] + '</div>' : '') +
                                (cert.file_urls && cert.file_urls.length > 0 ? '<div><i class="fas fa-file-pdf mr-1 text-red-500"></i> 파일 ' + cert.file_urls.length + '개</div>' : '') +
                            '</div>' +
                        '</div>' +
                        '<div class="flex items-center gap-2 ml-4">' +
                            '<button type="button" onclick="openCertificationModal(' + index + ')" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition">' +
                                '<i class="fas fa-edit mr-1"></i> 수정' +
                            '</button>' +
                            '<button type="button" onclick="deleteCertification(' + index + ')" class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">' +
                                '<i class="fas fa-trash mr-1"></i> 삭제' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                container.appendChild(certCard);
            });
        }

        // 강의이력 모달 관리
        let currentTeachingIndex = null;
        
        window.openTeachingHistoryModal = function(index = null) {
            currentTeachingIndex = index;
            const modal = document.getElementById('teachingHistoryModal');
            const title = document.getElementById('teachingModalTitle');
            const form = document.getElementById('teachingHistoryForm');
            
            if (index !== null && teachingHistory[index]) {
                // 수정 모드
                const history = teachingHistory[index];
                title.textContent = '강의이력 수정';
                document.getElementById('teachingModalId').value = history.id || '';
                document.getElementById('teachingModalCourseName').value = history.course_name || '';
                document.getElementById('teachingModalStartDate').value = history.start_date ? history.start_date.split('T')[0] : '';
                document.getElementById('teachingModalEndDate').value = history.end_date ? history.end_date.split('T')[0] : '';
                document.getElementById('teachingModalStudentCount').value = history.student_count || '';
                document.getElementById('teachingModalDescription').value = history.description || '';
                document.getElementById('teachingModalNotes').value = history.notes || '';
            } else {
                // 추가 모드
                title.textContent = '강의이력 추가';
                form.reset();
                document.getElementById('teachingModalId').value = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeTeachingHistoryModal = function() {
            const modal = document.getElementById('teachingHistoryModal');
            modal.classList.add('hidden');
            currentTeachingIndex = null;
        };
        
        window.handleSaveTeachingHistory = function(event) {
            event.preventDefault();
            
            const historyId = document.getElementById('teachingModalId').value || 'teaching_' + (teachingHistoryIdCounter++);
            const courseName = document.getElementById('teachingModalCourseName').value;
            const startDate = document.getElementById('teachingModalStartDate').value;
            const endDate = document.getElementById('teachingModalEndDate').value;
            const studentCount = document.getElementById('teachingModalStudentCount').value;
            const description = document.getElementById('teachingModalDescription').value;
            const notes = document.getElementById('teachingModalNotes').value;
            
            const historyData = {
                id: historyId,
                course_name: courseName || null,
                start_date: startDate || null,
                end_date: endDate || null,
                student_count: studentCount || null,
                description: description || null,
                notes: notes || null
            };
            
            if (currentTeachingIndex !== null) {
                // 수정
                teachingHistory[currentTeachingIndex] = historyData;
            } else {
                // 추가
                teachingHistory.push(historyData);
            }
            
            closeTeachingHistoryModal();
            loadTeachingHistory();
        };
        
        window.deleteTeachingHistory = function(index) {
            if (!confirm('강의이력을 삭제하시겠습니까?')) return;
            teachingHistory.splice(index, 1);
            loadTeachingHistory();
        };
        
        // 기존 addTeachingHistory 함수는 더 이상 사용하지 않음 (하위 호환성을 위해 유지)
        function addTeachingHistory(historyData = null) {
            // 이 함수는 더 이상 사용하지 않지만 호환성을 위해 유지
            console.warn('addTeachingHistory is deprecated, use openTeachingHistoryModal instead');
            
            const historyHtml = \`
                <div class="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200" data-teaching-id="\${historyId}">
                    <div class="flex justify-between items-start mb-4">
                        <h6 class="text-sm font-bold text-gray-800">강의이력 정보</h6>
                        <button type="button" onclick="removeTeachingHistory('\${historyId}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">과정명 <span class="text-red-500">*</span></label>
                            <input type="text" class="teaching-course-name w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   placeholder="예: 3D 모델링 기초" value="\${historyData ? (historyData.course_name || '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">수강생 수</label>
                            <input type="number" class="teaching-student-count w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   placeholder="예: 25" value="\${historyData ? (historyData.student_count || '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">시작일</label>
                            <input type="date" class="teaching-start-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   value="\${historyData && historyData.start_date ? historyData.start_date.split('T')[0] : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">종료일</label>
                            <input type="date" class="teaching-end-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   value="\${historyData && historyData.end_date ? historyData.end_date.split('T')[0] : ''}">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="text-xs font-medium text-gray-600 mb-1 block">강의 내용/설명</label>
                        <textarea class="teaching-description w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm resize-none" 
                                  rows="3" placeholder="강의 내용, 커리큘럼, 주요 학습 내용 등을 입력하세요">\${historyData ? (historyData.description || '') : ''}</textarea>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-600 mb-1 block">기타 메모</label>
                        <textarea class="teaching-notes w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm resize-none" 
                                  rows="2" placeholder="특이사항, 성과, 수강생 반응 등을 입력하세요">\${historyData ? (historyData.notes || '') : ''}</textarea>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', historyHtml);
            
            // DOM에 추가되었는지 확인
            const historyElement = container.querySelector(\`[data-teaching-id="\${historyId}"]\`);
            if (!historyElement) {
                console.error('Failed to find history element after insertAdjacentHTML');
            }
            
            // 중복 추가 방지
            const existingIndex = teachingHistory.findIndex(h => h.id === historyId);
            if (existingIndex >= 0) {
                // 이미 존재하면 업데이트
                teachingHistory[existingIndex] = historyData || { id: historyId, course_name: '', start_date: '', end_date: '', student_count: '', description: '', notes: '' };
            } else {
                // 새로 추가
                if (historyData) {
                    teachingHistory.push(historyData);
                } else {
                    teachingHistory.push({ id: historyId, course_name: '', start_date: '', end_date: '', student_count: '', description: '', notes: '' });
                }
            }
        }

        function removeTeachingHistory(historyId) {
            if (!confirm('강의이력을 삭제하시겠습니까?')) return;
            
            const historyEl = document.querySelector(\`[data-teaching-id="\${historyId}"]\`);
            if (historyEl) {
                historyEl.remove();
            }
            teachingHistory = teachingHistory.filter(h => h.id !== historyId);
        }

        function loadTeachingHistory() {
            const container = document.getElementById('teachingHistoryContainer');
            if (!container) {
                console.warn('teachingHistoryContainer not found');
                return;
            }
            
            console.log('loadTeachingHistory called, teachingHistory:', teachingHistory);
            container.innerHTML = '';
            
            if (!teachingHistory || teachingHistory.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-book-open text-4xl mb-3 opacity-50"></i><p class="text-sm">강의이력이 없습니다.</p><p class="text-xs mt-1">추가 버튼을 클릭하여 이력을 추가하세요.</p></div>';
                return;
            }
            
            // 리스트 형태로 표시
            teachingHistory.forEach((history, index) => {
                const historyCard = document.createElement('div');
                historyCard.className = 'bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition';
                historyCard.innerHTML = 
                    '<div class="flex items-start justify-between">' +
                        '<div class="flex-1">' +
                            '<h6 class="font-bold text-gray-800 mb-2">' + (history.course_name || '과정명 없음') + '</h6>' +
                            '<div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">' +
                                (history.start_date ? '<div><i class="fas fa-calendar-alt mr-1 text-blue-500"></i> 시작: ' + history.start_date.split('T')[0] + '</div>' : '') +
                                (history.end_date ? '<div><i class="fas fa-calendar-check mr-1 text-green-500"></i> 종료: ' + history.end_date.split('T')[0] + '</div>' : '') +
                                (history.student_count ? '<div><i class="fas fa-users mr-1 text-purple-500"></i> 수강생: ' + history.student_count + '명</div>' : '') +
                            '</div>' +
                            (history.description ? '<p class="text-sm text-gray-600 mb-1 line-clamp-2">' + history.description + '</p>' : '') +
                            (history.notes ? '<p class="text-xs text-gray-500 italic">' + history.notes + '</p>' : '') +
                        '</div>' +
                        '<div class="flex items-center gap-2 ml-4">' +
                            '<button type="button" onclick="openTeachingHistoryModal(' + index + ')" class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition">' +
                                '<i class="fas fa-edit mr-1"></i> 수정' +
                            '</button>' +
                            '<button type="button" onclick="deleteTeachingHistory(' + index + ')" class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">' +
                                '<i class="fas fa-trash mr-1"></i> 삭제' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                container.appendChild(historyCard);
            });
        }

        // 학력 모달 저장/삭제 함수들 (이미 위에서 openEducationModal, closeEducationModal 정의됨)
        window.handleSaveEducation = function(event) {
            event.preventDefault();
            
            const school = document.getElementById('educationModalSchool').value;
            const major = document.getElementById('educationModalMajor').value;
            const startDate = document.getElementById('educationModalStartDate').value;
            const endDate = document.getElementById('educationModalEndDate').value;
            const degree = document.getElementById('educationModalDegree').value;
            const notes = document.getElementById('educationModalNotes').value;
            const id = document.getElementById('educationModalId').value;
            
            const eduData = {
                id: id || 'edu_' + Date.now(),
                school: school || null,
                major: major || null,
                start_date: startDate || null,
                end_date: endDate || null,
                degree: degree || null,
                notes: notes || null
            };
            
            if (currentEducationIndex !== null) {
                education[currentEducationIndex] = eduData;
            } else {
                education.push(eduData);
            }
            
            window.closeEducationModal();
            loadEducation();
        };
        
        window.deleteEducation = function(index) {
            if (!confirm('학력을 삭제하시겠습니까?')) return;
            education.splice(index, 1);
            loadEducation();
        };
        
        function loadEducation() {
            const container = document.getElementById('educationContainer');
            if (!container) {
                console.warn('educationContainer not found');
                return;
            }
            
            container.innerHTML = '';
            
            if (!education || education.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-university text-4xl mb-3 opacity-50"></i><p class="text-sm">학력이 없습니다.</p><p class="text-xs mt-1">추가 버튼을 클릭하여 학력을 추가하세요.</p></div>';
                return;
            }
            
            education.forEach((edu, index) => {
                const eduCard = document.createElement('div');
                eduCard.className = 'bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition';
                eduCard.innerHTML = 
                    '<div class="flex items-start justify-between">' +
                        '<div class="flex-1">' +
                            '<h6 class="font-bold text-gray-800 mb-2">' + (edu.school || '학교명 없음') + '</h6>' +
                            '<div class="flex flex-wrap gap-4 text-sm text-gray-600">' +
                                (edu.major ? '<div><i class="fas fa-graduation-cap mr-1 text-blue-500"></i> ' + edu.major + '</div>' : '') +
                                (edu.degree ? '<div><i class="fas fa-certificate mr-1 text-purple-500"></i> ' + edu.degree + '</div>' : '') +
                                (edu.start_date ? '<div><i class="fas fa-calendar-alt mr-1 text-green-500"></i> 입학: ' + edu.start_date.split('T')[0] + '</div>' : '') +
                                (edu.end_date ? '<div><i class="fas fa-calendar-check mr-1 text-orange-500"></i> 졸업: ' + edu.end_date.split('T')[0] + '</div>' : '') +
                            '</div>' +
                            (edu.notes ? '<p class="text-xs text-gray-500 italic mt-2">' + edu.notes + '</p>' : '') +
                        '</div>' +
                        '<div class="flex items-center gap-2 ml-4">' +
                            '<button type="button" onclick="window.openEducationModal(' + index + ')" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition">' +
                                '<i class="fas fa-edit mr-1"></i> 수정' +
                            '</button>' +
                            '<button type="button" onclick="window.deleteEducation(' + index + ')" class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">' +
                                '<i class="fas fa-trash mr-1"></i> 삭제' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                container.appendChild(eduCard);
            });
        }

        // 경력 모달 저장 함수 (이미 위에서 openCareerModal, closeCareerModal 정의됨)
        window.handleSaveCareer = function(event) {
            event.preventDefault();
            
            const company = document.getElementById('careerModalCompany').value;
            const position = document.getElementById('careerModalPosition').value;
            const startDate = document.getElementById('careerModalStartDate').value;
            const endDate = document.getElementById('careerModalEndDate').value;
            const description = document.getElementById('careerModalDescription').value;
            const notes = document.getElementById('careerModalNotes').value;
            const id = document.getElementById('careerModalId').value;
            
            const carData = {
                id: id || 'career_' + Date.now(),
                company: company || null,
                position: position || null,
                start_date: startDate || null,
                end_date: endDate || null,
                description: description || null,
                notes: notes || null
            };
            
            if (currentCareerIndex !== null) {
                career[currentCareerIndex] = carData;
            } else {
                career.push(carData);
            }
            
            window.closeCareerModal();
            loadCareer();
        };
        
        window.deleteCareer = function(index) {
            if (!confirm('경력을 삭제하시겠습니까?')) return;
            career.splice(index, 1);
            loadCareer();
        };
        
        function loadCareer() {
            const container = document.getElementById('careerContainer');
            if (!container) {
                console.warn('careerContainer not found');
                return;
            }
            
            container.innerHTML = '';
            
            if (!career || career.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-briefcase text-4xl mb-3 opacity-50"></i><p class="text-sm">경력이 없습니다.</p><p class="text-xs mt-1">추가 버튼을 클릭하여 경력을 추가하세요.</p></div>';
                return;
            }
            
            career.forEach((car, index) => {
                const carCard = document.createElement('div');
                carCard.className = 'bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition';
                carCard.innerHTML = 
                    '<div class="flex items-start justify-between">' +
                        '<div class="flex-1">' +
                            '<h6 class="font-bold text-gray-800 mb-2">' + (car.company || '회사명 없음') + '</h6>' +
                            '<div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">' +
                                (car.position ? '<div><i class="fas fa-user-tie mr-1 text-purple-500"></i> ' + car.position + '</div>' : '') +
                                (car.start_date ? '<div><i class="fas fa-calendar-alt mr-1 text-blue-500"></i> 입사: ' + car.start_date.split('T')[0] + '</div>' : '') +
                                (car.end_date ? '<div><i class="fas fa-calendar-check mr-1 text-green-500"></i> 퇴사: ' + car.end_date.split('T')[0] + '</div>' : '') +
                            '</div>' +
                            (car.description ? '<p class="text-sm text-gray-600 mb-1 line-clamp-2">' + car.description + '</p>' : '') +
                            (car.notes ? '<p class="text-xs text-gray-500 italic">' + car.notes + '</p>' : '') +
                        '</div>' +
                        '<div class="flex items-center gap-2 ml-4">' +
                            '<button type="button" onclick="window.openCareerModal(' + index + ')" class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition">' +
                                '<i class="fas fa-edit mr-1"></i> 수정' +
                            '</button>' +
                            '<button type="button" onclick="window.deleteCareer(' + index + ')" class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">' +
                                '<i class="fas fa-trash mr-1"></i> 삭제' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                container.appendChild(carCard);
            });
        }

        // 보수교육 모달 저장 함수 (이미 위에서 openTrainingModal, closeTrainingModal 정의됨)
        window.handleSaveTraining = function(event) {
            currentTrainingIndex = index;
            const modal = document.getElementById('trainingModal');
            const title = document.getElementById('trainingModalTitle');
            const form = document.getElementById('trainingForm');
            
            if (index !== null && training[index]) {
                // 수정 모드
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
                // 추가 모드
                title.textContent = '보수교육 추가';
                form.reset();
                document.getElementById('trainingModalId').value = '';
            }
            
            modal.classList.remove('hidden');
        };
        
        window.closeTrainingModal = function() {
            const modal = document.getElementById('trainingModal');
            modal.classList.add('hidden');
            currentTrainingIndex = null;
        };
        
        window.handleSaveTraining = function(event) {
            event.preventDefault();
            
            const name = document.getElementById('trainingModalName').value;
            const startDate = document.getElementById('trainingModalStartDate').value;
            const endDate = document.getElementById('trainingModalEndDate').value;
            const hours = document.getElementById('trainingModalHours').value;
            const institution = document.getElementById('trainingModalInstitution').value;
            const description = document.getElementById('trainingModalDescription').value;
            const notes = document.getElementById('trainingModalNotes').value;
            const id = document.getElementById('trainingModalId').value;
            
            const trData = {
                id: id || 'training_' + Date.now(),
                name: name || null,
                start_date: startDate || null,
                end_date: endDate || null,
                hours: hours || null,
                institution: institution || null,
                description: description || null,
                notes: notes || null
            };
            
            if (currentTrainingIndex !== null) {
                training[currentTrainingIndex] = trData;
            } else {
                training.push(trData);
            }
            
            window.closeTrainingModal();
            loadTraining();
        };
        
        window.deleteTraining = function(index) {
            if (!confirm('보수교육을 삭제하시겠습니까?')) return;
            training.splice(index, 1);
            loadTraining();
        };
        
        function loadTraining() {
            const container = document.getElementById('trainingContainer');
            if (!container) {
                console.warn('trainingContainer not found');
                return;
            }
            
            container.innerHTML = '';
            
            if (!training || training.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-chalkboard-teacher text-4xl mb-3 opacity-50"></i><p class="text-sm">보수교육이 없습니다.</p><p class="text-xs mt-1">추가 버튼을 클릭하여 보수교육을 추가하세요.</p></div>';
                return;
            }
            
            training.forEach((tr, index) => {
                const trCard = document.createElement('div');
                trCard.className = 'bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition';
                trCard.innerHTML = 
                    '<div class="flex items-start justify-between">' +
                        '<div class="flex-1">' +
                            '<h6 class="font-bold text-gray-800 mb-2">' + (tr.name || '연수명 없음') + '</h6>' +
                            '<div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">' +
                                (tr.institution ? '<div><i class="fas fa-building mr-1 text-green-500"></i> ' + tr.institution + '</div>' : '') +
                                (tr.hours ? '<div><i class="fas fa-clock mr-1 text-blue-500"></i> ' + tr.hours + '시간</div>' : '') +
                                (tr.start_date ? '<div><i class="fas fa-calendar-alt mr-1 text-purple-500"></i> 시작: ' + tr.start_date.split('T')[0] + '</div>' : '') +
                                (tr.end_date ? '<div><i class="fas fa-calendar-check mr-1 text-orange-500"></i> 종료: ' + tr.end_date.split('T')[0] + '</div>' : '') +
                            '</div>' +
                            (tr.description ? '<p class="text-sm text-gray-600 mb-1 line-clamp-2">' + tr.description + '</p>' : '') +
                            (tr.notes ? '<p class="text-xs text-gray-500 italic">' + tr.notes + '</p>' : '') +
                        '</div>' +
                        '<div class="flex items-center gap-2 ml-4">' +
                            '<button type="button" onclick="window.openTrainingModal(' + index + ')" class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition">' +
                                '<i class="fas fa-edit mr-1"></i> 수정' +
                            '</button>' +
                            '<button type="button" onclick="window.deleteTraining(' + index + ')" class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">' +
                                '<i class="fas fa-trash mr-1"></i> 삭제' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                container.appendChild(trCard);
            });
        }

        window.handleSaveProfile = async function(event) {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const form = event.target;
                
                // 자격증 데이터 수집
                const certs = [];
                document.querySelectorAll('[data-cert-id]').forEach(certEl => {
                    const certId = certEl.getAttribute('data-cert-id');
                    const name = certEl.querySelector('.cert-name').value;
                    const issueDate = certEl.querySelector('.cert-issue-date').value;
                    const expiryDate = certEl.querySelector('.cert-expiry-date').value;
                    const fileUrlsInput = certEl.querySelector('.cert-file-urls');
                    
                    let fileUrls = [];
                    try {
                        fileUrls = JSON.parse(fileUrlsInput.value || '[]');
                    } catch (e) {}
                    
                    if (name || issueDate || expiryDate || fileUrls.length > 0) {
                        certs.push({
                            id: certId,
                            name: name || null,
                            issue_date: issueDate || null,
                            expiry_date: expiryDate || null,
                            file_urls: fileUrls
                        });
                    }
                });
                
                // 강의이력 데이터 수집
                const teachingHistoryData = [];
                document.querySelectorAll('[data-teaching-id]').forEach(historyEl => {
                    const historyId = historyEl.getAttribute('data-teaching-id');
                    const courseName = historyEl.querySelector('.teaching-course-name').value;
                    const startDate = historyEl.querySelector('.teaching-start-date').value;
                    const endDate = historyEl.querySelector('.teaching-end-date').value;
                    const studentCount = historyEl.querySelector('.teaching-student-count').value;
                    const description = historyEl.querySelector('.teaching-description').value;
                    const notes = historyEl.querySelector('.teaching-notes').value;
                    
                    if (courseName || startDate || endDate || studentCount || description || notes) {
                        teachingHistoryData.push({
                            id: historyId,
                            course_name: courseName || null,
                            start_date: startDate || null,
                            end_date: endDate || null,
                            student_count: studentCount || null,
                            description: description || null,
                            notes: notes || null
                        });
                    }
                });
                
                // 폼 데이터 수집
                const data = {
                    name: form.pName.value,
                    email: form.pEmail.value,
                    phone: form.pPhone.value,
                    position: form.pPosition.value || null,
                    subject: form.pSubject.value || null,
                    type: form.pType.value,
                    joined_at: form.pJoined.value || null,
                    profile_image: form.pImageUrl.value || null,
                    education: education.length > 0 ? JSON.stringify(education) : '[]',
                    career: career.length > 0 ? JSON.stringify(career) : '[]',
                    certifications: certifications.length > 0 ? JSON.stringify(certifications) : '[]',
                    training_history: training.length > 0 ? JSON.stringify(training) : '[]',
                    teaching_history: teachingHistory.length > 0 ? JSON.stringify(teachingHistory) : '[]'
                };
                
                // API 호출
                const response = await fetch(\`/api/hrd/personnel/\${currentUserId}\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('개인정보가 저장되었습니다.');
                    // 사용자 정보 업데이트
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    user.name = data.name;
                    user.email = data.email;
                    user.phone = data.phone;
                    user.profile_image = data.profile_image;
                    localStorage.setItem('user', JSON.stringify(user));
                    // 데이터 다시 로드
                    loadProfileData();
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('저장 중 오류가 발생했습니다: ' + (error.message || error));
            }
        };
    </script>
    <style>
        .tab-active-profile {
            border-bottom-color: #2563eb;
            color: #2563eb;
        }
        .tab-inactive-profile {
            border-bottom-color: transparent;
            color: #9ca3af;
        }
        .tab-inactive-profile:hover {
            color: #4b5563;
        }
    </style>
</body>
</html>
`;
