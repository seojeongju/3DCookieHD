import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdStudentsHtml = (activeMenu: string = 'students') => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련생 관리 센터 - 3DCookie HD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
        .glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .step-active { color: #3b82f6; border-color: #3b82f6; }
        .step-completed { color: #10b981; border-color: #10b981; }
        .timeline-item:last-child .timeline-line { display: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        
        .tab-active { color: #1e293b; border-bottom: 2px solid #3b82f6; }
        .tab-inactive { color: #94a3b8; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b]">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar(activeMenu)}
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- 브레드크럼 및 헤더 -->
            <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
                <div>
                    <h2 class="text-xl font-bold tracking-tight text-gray-900">훈련생 통합 관리</h2>
                    <p class="text-xs text-gray-400 mt-0.5">상담부터 취업까지, 훈련생의 전 생애주기를 관리합니다.</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="openStudentModal()" class="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition flex items-center shadow-lg shadow-gray-200 font-semibold text-sm">
                        <i class="fas fa-plus mr-2"></i> 신규 훈련생 등록
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
                <!-- 검색 필터 섹션 -->
                <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap gap-4 items-center">
                    <div class="relative flex-1 min-w-[300px]">
                        <input type="text" id="searchInput" placeholder="이름, 연락처, 또는 수강 과정을 입력하세요" class="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm">
                        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
                    </div>
                    <div class="min-w-[150px]">
                        <select id="statusFilter" class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm cursor-pointer">
                            <option value="">전체 상태</option>
                            <option value="consulting">상담중</option>
                            <option value="registered">등록완료</option>
                            <option value="learning">수강중</option>
                            <option value="completed">수료</option>
                            <option value="dropout">중도탈락</option>
                        </select>
                    </div>
                    <button onclick="loadStudents()" class="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold text-sm">검색 적용</button>
                </div>

                <!-- 수강생 리스트 테이블 -->
                <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-white border-b border-gray-50">
                                <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">훈련생 정보</th>
                                <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">연락처 및 이메일</th>
                                <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">현재 수강 과정</th>
                                <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">여정 상태</th>
                                <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">최근 기록</th>
                                <th class="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody id="studentListBody" class="divide-y divide-gray-50">
                            <!-- 로딩 스켈레톤 또는 데이터 -->
                        </tbody>
                    </table>
                    <div class="px-8 py-6 bg-gray-50/50 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total <span id="totalCount" class="text-blue-600 ml-1">0</span> Students</span>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 고도화된 훈련생 생애주기 통합 모달 -->
    <div id="studentModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
        <div id="modalBackdrop" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity opacity-0 duration-300" onclick="closeStudentModal()"></div>
        
        <div id="modalPanel" class="relative bg-white w-full max-w-[1240px] h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
            
            <!-- 모달 헤더: 생애주기 스테퍼 -->
            <div class="bg-white px-10 py-8 border-b border-gray-100 flex flex-col gap-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                            <i class="fas fa-user-astronaut text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-black text-gray-900 leading-tight" id="modalStdName">훈련생 프로필</h3>
                            <p class="text-xs text-gray-400 font-medium" id="modalStdIdDisplay">Student Journey Path</p>
                        </div>
                    </div>
                    <button onclick="closeStudentModal()" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 text-gray-400 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- 여정 스테퍼 UI -->
                <div class="flex items-center justify-between max-w-4xl mx-auto w-full relative h-20 px-8">
                    <div class="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100"></div>
                    <div id="stepperProgress" class="absolute left-16 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 transition-all duration-500" style="width: 0%"></div>
                    
                    <div class="flex flex-col items-center relative z-10 group cursor-pointer" onclick="updateStage('consulting')">
                        <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon" data-stage="consulting">
                            <i class="fas fa-comments text-sm"></i>
                        </div>
                        <span class="text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label" data-stage="consulting">초기 상담</span>
                    </div>
                    <div class="flex flex-col items-center relative z-10 group cursor-pointer" onclick="updateStage('registered')">
                        <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon" data-stage="registered">
                            <i class="fas fa-file-signature text-sm"></i>
                        </div>
                        <span class="text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label" data-stage="registered">등록·발급</span>
                    </div>
                    <div class="flex flex-col items-center relative z-10 group cursor-pointer" onclick="updateStage('learning')">
                        <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon" data-stage="learning">
                            <i class="fas fa-book-reader text-sm"></i>
                        </div>
                        <span class="text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label" data-stage="learning">집중 훈련</span>
                    </div>
                    <div class="flex flex-col items-center relative z-10 group cursor-pointer" onclick="updateStage('completed')">
                        <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon" data-stage="completed">
                            <i class="fas fa-award text-sm"></i>
                        </div>
                        <span class="text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label" data-stage="completed">수료 완료</span>
                    </div>
                    <div class="flex flex-col items-center relative z-10 group cursor-pointer" onclick="updateStage('employed')">
                        <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon" data-stage="employed">
                            <i class="fas fa-rocket text-sm"></i>
                        </div>
                        <span class="text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label" data-stage="employed">취업·성공</span>
                    </div>
                </div>
            </div>

            <!-- 모달 바디: 스플릿 뷰 -->
            <div class="flex-1 overflow-hidden flex bg-gray-50/50">
                
                <!-- 왼쪽 사이드바 (정보 카드) -->
                <div class="w-[380px] border-r border-gray-100 p-8 overflow-y-auto space-y-6">
                    
                    <!-- 이미지 및 핵심 정보 -->
                    <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-hidden relative">
                        <div class="flex flex-col items-center text-center">
                            <div class="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-4 border-white shadow-xl overflow-hidden mb-4 relative group cursor-pointer" onclick="document.getElementById('stdImageFile').click()">
                                <img id="modalStdImage" src="https://ui-avatars.com/api/?name=User" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">변경</div>
                            </div>
                            <input type="file" id="stdImageFile" class="hidden" onchange="handleStdImage(this)">
                            
                            <h4 class="text-lg font-bold text-gray-900" id="sidebarStdName">-</h4>
                            <p class="text-xs text-gray-400 font-medium" id="sidebarStdCourse">-</p>
                            
                            <div class="flex gap-2 mt-4">
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider" id="sidebarStdStatus">상담중</span>
                                <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider" id="sidebarStdType">구직자</span>
                            </div>
                        </div>

                        <div class="mt-8 grid grid-cols-2 gap-3 border-t border-gray-50 pt-6">
                            <div class="bg-gray-50 p-3 rounded-2xl text-center">
                                <span class="block text-[10px] font-black text-gray-400 uppercase mb-1">출석률</span>
                                <span class="text-lg font-black text-blue-600">92%</span>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-2xl text-center">
                                <span class="block text-[10px] font-black text-gray-400 uppercase mb-1">상담횟수</span>
                                <span class="text-lg font-black text-gray-800" id="consultCount">0</span>
                            </div>
                        </div>
                    </div>

                    <!-- 상세 입력 폼 섹션 (핵심 정보) -->
                    <form id="studentForm" onsubmit="handleSaveStudent(event)" class="space-y-6 pb-12">
                        <input type="hidden" name="id" id="studentId">
                        <input type="hidden" name="profile_image" id="stdProfileImage">
                        <input type="hidden" name="status" id="stdStatus">

                        <div class="space-y-4">
                            <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                                <i class="fas fa-info-circle mr-2"></i> 필수 인적 정보
                            </h5>
                            <div class="grid grid-cols-1 gap-3">
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">이름</label>
                                    <input type="text" id="stdName" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10">
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">생년월일</label>
                                        <input type="date" id="stdBirthdate" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                    </div>
                                    <div>
                                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">연락처</label>
                                        <input type="text" id="stdPhone" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none" placeholder="010-0000-0000">
                                    </div>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">이메일</label>
                                    <input type="email" id="stdEmail" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                                <i class="fas fa-graduation-cap mr-2"></i> 교육 대상 구분
                            </h5>
                            <div class="space-y-3">
                                <select id="stdCourseId" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none appearance-none cursor-pointer">
                                    <option value="">과정 선택</option>
                                </select>
                                <div class="grid grid-cols-2 gap-3">
                                    <select id="stdType" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                        <option value="jobseeker">구직자</option>
                                        <option value="worker">재직자</option>
                                        <option value="general">일반</option>
                                        <option value="student">학생</option>
                                    </select>
                                    <select id="stdGender" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                        <option value="M">남성</option>
                                        <option value="F">여성</option>
                                    </select>
                                </div>
                                <textarea id="stdStatusMemo" rows="3" class="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none resize-none" placeholder="비고 및 관리자 메모"></textarea>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-200 transition active:scale-95">정보 업데이트</button>
                    </form>
                </div>

                <!-- 오른쪽 메인 (탭 뷰) -->
                <div class="flex-1 p-8 flex flex-col overflow-hidden">
                    <!-- 탭 헤더 -->
                    <div class="flex items-center gap-8 border-b border-gray-100 mb-8">
                        <button onclick="switchTab('timeline')" id="tabTimeline" class="pb-4 text-sm font-black uppercase tracking-widest tab-active transition-all">
                            상담 타임라인
                        </button>
                        <button onclick="switchTab('details')" id="tabDetails" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive transition-all">
                            행정 상세 정보
                        </button>
                    </div>

                    <!-- 탭 컨텐츠: 타임라인 -->
                    <div id="contentTimeline" class="flex-1 flex flex-col overflow-hidden">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">상담 및 히스토리 로그</h4>
                                <p class="text-[10px] text-gray-400 font-medium">관리자, 강사의 통합 상담 일지입니다.</p>
                            </div>
                        </div>

                        <!-- 인라인 상담 추가 박스 -->
                        <div class="bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-500/20 mb-8 border border-blue-500 animate-slide-up">
                            <div class="flex gap-4 mb-4">
                                <div class="flex-1">
                                    <div class="flex gap-2 mb-2">
                                        <input type="date" id="consultDate" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none">
                                        <select id="consultCategory" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                                            <option value="academic" class="text-gray-900">학사/학습</option>
                                            <option value="attendance" class="text-gray-900">출결 관리</option>
                                            <option value="career" class="text-gray-900">취업 지원</option>
                                            <option value="complaint" class="text-gray-900">고충 건의</option>
                                            <option value="other" class="text-gray-900">기타</option>
                                        </select>
                                        <select id="consultMethod" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                                            <option value="face_to_face" class="text-gray-900">대면</option>
                                            <option value="phone" class="text-gray-900">유선</option>
                                            <option value="online" class="text-gray-900">온라인</option>
                                        </select>
                                    </div>
                                    <textarea id="consultContent" rows="1" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none overflow-hidden" placeholder="새로운 상담 내용을 작성하세요..." oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
                                </div>
                                <button onclick="addConsultationLog()" class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg hover:scale-105 transition active:scale-95">
                                    <i class="fas fa-paper-plane text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 타임라인 리스트 -->
                        <div id="consultationList" class="flex-1 overflow-y-auto pr-6 space-y-6 pb-20">
                            <!-- 타임라인 아이템 로드됨 -->
                        </div>
                    </div>

                    <!-- 탭 컨텐츠: 행정 상세 정보 -->
                    <div id="contentDetails" class="hidden flex-1 overflow-y-auto pr-6 space-y-10 pb-20">
                        <!-- 행정 카드 1: 인적 상세 -->
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                <i class="fas fa-id-card mr-3 text-blue-500"></i> 인적 상세 및 학력
                            </h5>
                            <div class="grid grid-cols-1 gap-6">
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">상세 주소</label>
                                    <input type="text" id="stdAddress" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="거주지 상세 주소를 입력하세요">
                                </div>
                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">최종 학력</label>
                                        <input type="text" id="stdEducation" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 00대학교 졸업">
                                    </div>
                                    <div>
                                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">보유 자격증</label>
                                        <input type="text" id="stdCertifications" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 전산회계 1급, GTQ">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 행정 카드 2: 결제 및 유형 -->
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                <i class="fas fa-credit-card mr-3 text-orange-500"></i> 결제 정보 및 훈련 유형
                            </h5>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">지원 유형</label>
                                    <select id="stdPackageType" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none appearance-none cursor-pointer">
                                        <option value="">유형 선택</option>
                                        <option value="type1">국기 (I유형)</option>
                                        <option value="type2">일반 (II유형)</option>
                                        <option value="k-digital">K-Digital Training</option>
                                        <option value="general">일반 실업자/재직자</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">자부담금 결제 수단</label>
                                    <input type="text" id="stdPaymentMethod" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 신한카드">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">결제일</label>
                                    <input type="date" id="stdPaymentDate" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">자부담 실결제액</label>
                                    <input type="number" id="stdSelfPay" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="0">
                                </div>
                            </div>
                        </div>

                        <!-- 행정 카드 3: 체크리스트 -->
                        <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                            <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                <i class="fas fa-tasks mr-3 text-emerald-500"></i> 행정 절차 체크리스트
                            </h5>
                            <div class="grid grid-cols-3 gap-4">
                                <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors group">
                                    <input type="checkbox" id="stdHasApplication" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500">
                                    <span class="text-xs font-bold text-gray-700 group-hover:text-emerald-700">훈련 신청서 제출</span>
                                </label>
                                <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors group">
                                    <input type="checkbox" id="stdHasCard" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500">
                                    <span class="text-xs font-bold text-gray-700 group-hover:text-emerald-700">내일배움카드 발급</span>
                                </label>
                                <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors group">
                                    <input type="checkbox" id="stdIsRegistered" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500">
                                    <span class="text-xs font-bold text-gray-700 group-hover:text-emerald-700">HRD-Net 등록 완료</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 rounded-[1.5rem] p-6 text-blue-600 flex items-start gap-4">
                            <i class="fas fa-lightbulb mt-1"></i>
                            <div class="text-[11px] font-medium leading-relaxed">
                                <strong>Tip:</strong> 행정 상세 정보는 훈련생 본인이 직접 수정할 수 없으며, 관리자 권한으로만 수정 가능합니다. 모든 수정사항은 자동으로 로그에 저장됩니다.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let studentsData = [];
        let coursesData = [];
        let currentStudentId = null;

        document.addEventListener('DOMContentLoaded', async () => { 
            await loadCourses(); 
            await loadStudents(); 
        });

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses?limit=1000');
                const result = await response.json();
                if (result.success) {
                    coursesData = result.data;
                    const select = document.getElementById('stdCourseId');
                    if (select) {
                        select.innerHTML = '<option value="">교육 과정 선택</option>' + coursesData.map(c => 
                            \`<option value="\${c.id}">\${c.title}</option>\`
                        ).join('');
                    }
                }
            } catch (e) { console.error(e); }
        }

        async function loadStudents() {
            const tbody = document.getElementById('studentListBody');
            const totalCount = document.getElementById('totalCount');
            const search = document.getElementById('searchInput').value;
            const status = document.getElementById('statusFilter').value;

            try {
                let url = '/api/hrd/students?';
                if (search) url += 'search=' + encodeURIComponent(search) + '&';
                if (status) url += 'status=' + status;

                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    studentsData = result.data;
                    if (totalCount) totalCount.textContent = studentsData.length;
                    
                    if (studentsData.length === 0) {
                        tbody.innerHTML = \`<tr><td colspan="6" class="px-8 py-20 text-center text-gray-400 font-medium">일치하는 훈련생 데이터가 없습니다.</td></tr>\`;
                        return;
                    }
                    tbody.innerHTML = studentsData.map(s => getStudentRowHtml(s)).join('');
                }
            } catch (e) { console.error(e); }
        }

        function getStudentRowHtml(s) {
            const courseTitle = coursesData.find(c => c.id == s.course_id)?.title || '과정 미지정';
            const statusLabels = { consulting: '상담중', registered: '등록완료', learning: '수강중', completed: '수료완료', dropout: '중도탈락' };
            const statusColors = { consulting: 'bg-yellow-50 text-yellow-600', registered: 'bg-blue-50 text-blue-600', learning: 'bg-green-50 text-green-600', completed: 'bg-indigo-50 text-indigo-600', dropout: 'bg-red-50 text-red-600' };

            return \`
                <tr class="hover:bg-gray-50/50 transition-all group border-b border-gray-50 last:border-0">
                    <td class="px-8 py-5">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-white group-hover:scale-105 transition-transform">
                                <img src="\${s.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name)}" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-gray-900">\${s.name}</h4>
                                <p class="text-[10px] text-gray-400 font-medium tracking-tight">\${s.birthdate || '-'} (\${s.gender === 'M' ? '남' : '여'})</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5">
                        <div class="text-sm font-bold text-gray-600">\${s.phone || '-'}</div>
                        <div class="text-[10px] text-gray-300 font-medium">\${s.email || '-'}</div>
                    </td>
                    <td class="px-8 py-5">
                        <div class="text-sm font-bold text-gray-500 max-w-[200px] truncate">\${courseTitle}</div>
                    </td>
                    <td class="px-8 py-5">
                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider \${statusColors[s.status] || 'bg-gray-50'} border border-transparent shadow-sm">\${statusLabels[s.status] || s.status}</span>
                    </td>
                    <td class="px-8 py-5 text-center">
                        <div class="text-[10px] font-bold text-gray-400 tracking-tighter uppercase mb-0.5">최근 상담</div>
                        <div class="text-xs font-black text-gray-400 tracking-tight">\${s.last_consult ? s.last_consult.split(' ')[0] : '기록 없음'}</div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <button onclick="editStudent(\${s.id})" class="px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 ml-auto">
                            <i class="fas fa-rocket"></i> 여정 관리
                        </button>
                    </td>
                </tr>
            \`;
        }

        function switchTab(tab) {
            const isTimeline = tab === 'timeline';
            document.getElementById('tabTimeline').className = isTimeline ? 'pb-4 text-sm font-black uppercase tracking-widest tab-active transition-all' : 'pb-4 text-sm font-black uppercase tracking-widest tab-inactive transition-all';
            document.getElementById('tabDetails').className = isTimeline ? 'pb-4 text-sm font-black uppercase tracking-widest tab-inactive transition-all' : 'pb-4 text-sm font-black uppercase tracking-widest tab-active transition-all';
            
            document.getElementById('contentTimeline').classList.toggle('hidden', !isTimeline);
            document.getElementById('contentDetails').classList.toggle('hidden', isTimeline);
        }

        function openStudentModal() {
            const modal = document.getElementById('studentModal');
            const backdrop = document.getElementById('modalBackdrop');
            const panel = document.getElementById('modalPanel');
            
            if(!modal || !backdrop || !panel) return;
            
            modal.classList.remove('hidden');
            setTimeout(() => {
                backdrop.classList.add('opacity-100');
                backdrop.classList.remove('opacity-0');
                panel.classList.remove('scale-95', 'opacity-0');
                panel.classList.add('scale-100', 'opacity-100');
            }, 10);

            const form = document.getElementById('studentForm');
            if (form) form.reset();
            
            // 행정 상세 필드 리셋
            ['stdAddress', 'stdEducation', 'stdCertifications', 'stdPackageType', 'stdPaymentMethod', 'stdPaymentDate', 'stdSelfPay'].forEach(id => {
                 const el = document.getElementById(id);
                 if(el) el.value = '';
            });
            ['stdHasApplication', 'stdHasCard', 'stdIsRegistered'].forEach(id => {
                const el = document.getElementById(id);
                if(el) el.checked = false;
            });

            document.getElementById('studentId').value = '';
            document.getElementById('modalStdName').textContent = '신규 훈련생 등록';
            document.getElementById('modalStdIdDisplay').textContent = 'New Student Registration';
            document.getElementById('modalStdImage').src = 'https://ui-avatars.com/api/?name=New';
            document.getElementById('consultCount').textContent = '0';
            document.getElementById('consultationList').innerHTML = '<div class="text-center text-gray-300 py-20 text-sm font-medium">신규 등록 후 상담 기록 작성이 가능합니다.</div>';
            
            switchTab('timeline');
            updateStepper('consulting');
        }

        function closeStudentModal() {
            const modal = document.getElementById('studentModal');
            const backdrop = document.getElementById('modalBackdrop');
            const panel = document.getElementById('modalPanel');

            if(!backdrop || !panel) return;

            backdrop.classList.remove('opacity-100');
            panel.classList.remove('scale-100', 'opacity-100');
            panel.classList.add('scale-95', 'opacity-0');

            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }

        async function editStudent(id) {
            if (!id) return;
            // ID comparison: use == to handle string vs number
            const student = studentsData.find(s => s.id == id);
            if (!student) {
                console.warn('Student not found for ID:', id);
                return;
            }
            currentStudentId = student.id;
            
            openStudentModal();
            document.getElementById('modalStdName').textContent = student.name + ' 훈련생';
            document.getElementById('modalStdIdDisplay').textContent = 'STUDENT ID: #' + student.id;
            document.getElementById('sidebarStdName').textContent = student.name;
            document.getElementById('sidebarStdCourse').textContent = coursesData.find(c => c.id == student.course_id)?.title || '과정 미지정';
            document.getElementById('studentId').value = student.id;
            document.getElementById('stdName').value = student.name;
            document.getElementById('stdBirthdate').value = student.birthdate || '';
            document.getElementById('stdPhone').value = student.phone || '';
            document.getElementById('stdEmail').value = student.email || '';
            document.getElementById('stdCourseId').value = student.course_id || '';
            document.getElementById('stdType').value = student.type || 'jobseeker';
            document.getElementById('stdGender').value = student.gender || 'M';
            document.getElementById('stdStatus').value = student.status || 'consulting';
            document.getElementById('stdStatusMemo').value = student.status_memo || '';
            document.getElementById('modalStdImage').src = student.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name);
            document.getElementById('stdProfileImage').value = student.profile_image || '';

            // 행정 상세 필드 채우기
            document.getElementById('stdAddress').value = student.address || '';
            document.getElementById('stdEducation').value = student.education || '';
            document.getElementById('stdCertifications').value = student.certifications || '';
            document.getElementById('stdPackageType').value = student.package_type || '';
            document.getElementById('stdPaymentMethod').value = student.payment_method || '';
            document.getElementById('stdPaymentDate').value = student.payment_date || '';
            document.getElementById('stdSelfPay').value = student.self_pay_amount || 0;
            document.getElementById('stdHasApplication').checked = !!student.has_application;
            document.getElementById('stdHasCard').checked = !!student.has_card;
            document.getElementById('stdIsRegistered').checked = !!student.is_hrd_net_registered;
            
            document.getElementById('sidebarStdStatus').textContent = translateStatus(student.status);
            document.getElementById('sidebarStdType').textContent = translateType(student.type);

            updateStepper(student.status);
            loadConsultations(id);
        }

        function translateStatus(s) { const m = { consulting: '상담중', registered: '등록완료', learning: '수강중', completed: '수료완료', dropout: '중도탈락' }; return m[s] || s; }
        function translateType(t) { const m = { jobseeker: '구직자', worker: '재직자', general: '일반', student: '학생' }; return m[t] || t; }

        function updateStepper(activeStage) {
            const stages = ['consulting', 'registered', 'learning', 'completed', 'employed'];
            let currentIdx = stages.indexOf(activeStage);
            if (currentIdx === -1) currentIdx = 0; 

            const progress = (currentIdx / (stages.length - 1)) * 100;
            const progressBarr = document.getElementById('stepperProgress');
            if (progressBarr) progressBarr.style.width = \`\${progress}%\`;

            document.querySelectorAll('.step-icon').forEach(icon => {
                const stage = icon.getAttribute('data-stage');
                const idx = stages.indexOf(stage);
                icon.className = 'w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center text-gray-300 transition-all duration-300 step-icon';
                const label = document.querySelector(\`.step-label[data-stage="\${stage}"]\`);
                if(!label) return;
                label.className = 'text-[10px] font-black mt-2 text-gray-400 tracking-tighter uppercase step-label';

                if (idx < currentIdx) {
                    icon.classList.add('border-emerald-500', 'text-emerald-500');
                    label.classList.add('text-emerald-600');
                } else if (idx === currentIdx) {
                    icon.classList.add('border-blue-500', 'text-blue-500', 'scale-125', 'shadow-lg', 'shadow-blue-500/20');
                    label.classList.add('text-blue-600');
                } else {
                    icon.classList.add('border-gray-100', 'text-gray-300');
                }
            });
        }

        async function updateStage(newStage) {
            if (!currentStudentId) return;
            const student = studentsData.find(s => s.id == currentStudentId);
            if (!student) return;

            document.getElementById('stdStatus').value = newStage;
            updateStepper(newStage);
        }

        async function handleSaveStudent(e) {
            e.preventDefault();
            const id = document.getElementById('studentId').value;
            
            // 기존 데이터 보존을 위해 현재 데이터를 먼저 가져옴
            const existingStudent = (studentsData && studentsData.find(s => s.id == id)) || {};
            
            const formData = {
                ...existingStudent,
                id,
                name: document.getElementById('stdName').value.trim(),
                birthdate: document.getElementById('stdBirthdate').value || null,
                phone: document.getElementById('stdPhone').value.trim(),
                email: document.getElementById('stdEmail').value.trim() || null,
                course_id: document.getElementById('stdCourseId').value || null,
                type: document.getElementById('stdType').value,
                gender: document.getElementById('stdGender').value,
                status: document.getElementById('stdStatus').value || 'consulting',
                status_memo: document.getElementById('stdStatusMemo').value.trim() || null,
                profile_image: document.getElementById('stdProfileImage').value,
                // 행정 상세 필드 수집 (비어있는 경우 null 처리로 리셋 방지 및 깔끔한 데이터 유지)
                address: document.getElementById('stdAddress').value.trim() || null,
                education: document.getElementById('stdEducation').value.trim() || null,
                certifications: document.getElementById('stdCertifications').value.trim() || null,
                package_type: document.getElementById('stdPackageType').value || null,
                payment_method: document.getElementById('stdPaymentMethod').value.trim() || null,
                payment_date: document.getElementById('stdPaymentDate').value || null,
                self_pay_amount: parseInt(document.getElementById('stdSelfPay').value) || 0,
                has_application: document.getElementById('stdHasApplication').checked,
                has_card: document.getElementById('stdHasCard').checked,
                is_hrd_net_registered: document.getElementById('stdIsRegistered').checked
            };

            const token = localStorage.getItem('token');
            const response = await fetch('/api/hrd/students', {
                method: id ? 'PUT' : 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                alert('훈련생 정보가 업데이트 되었습니다.');
                await loadStudents(); // Wait for data refresh
                
                // 신규 생성인 경우 생성된 ID로 모달 다시 열기 (정보 동기화)
                const newId = id || result.data?.id;
                if (newId) {
                    editStudent(newId);
                }
            } else {
                alert('업데이트 실패: ' + (result.error || '알 수 없는 오류'));
            }
        }

        async function loadConsultations(studentId) {
            const list = document.getElementById('consultationList');
            const token = localStorage.getItem('token');
            const response = await fetch(\`/api/hrd/students/\${studentId}/consultations\`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();

            if (result.success) {
                const logs = result.data;
                const countElem = document.getElementById('consultCount');
                if(countElem) countElem.textContent = logs.length;
                
                if (logs.length === 0) {
                    list.innerHTML = '<div class="text-center text-gray-300 py-20 text-sm font-medium">작성된 상담 내역이 없습니다.</div>';
                    return;
                }

                const catStyles = { academic: 'bg-blue-50 text-blue-600', attendance: 'bg-yellow-50 text-yellow-600', career: 'bg-emerald-50 text-emerald-600', complaint: 'bg-red-50 text-red-600', other: 'bg-gray-50 text-gray-500' };
                const catLabels = { academic: '학사지휘', attendance: '출결행정', career: '취업비전', complaint: '고충상담', other: '기타' };

                list.innerHTML = logs.map(log => {
                    const isPrincipal = log.counselor_role === 'admin';
                    return \`
                        <div class="relative pl-10 timeline-item">
                            <div class="absolute inset-y-0 left-[21px] w-0.5 bg-gray-100 timeline-line"></div>
                            <div class="absolute left-0 top-0 w-11 h-11 bg-white border-2 \${isPrincipal ? 'border-blue-500' : 'border-gray-100'} rounded-2xl flex items-center justify-center z-10 shadow-sm">
                                <i class="fas \${isPrincipal ? 'fa-user-tie text-blue-500' : 'fa-chalkboard-teacher text-gray-400'} text-sm"></i>
                            </div>
                            <div class="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:shadow-gray-200/40 transition-all">
                                <div class="flex justify-between items-center mb-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-black text-gray-900">\${log.memo || '관리자'}</span>
                                        <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg \${isPrincipal ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}">\${isPrincipal ? 'Principal' : 'Instructor'}</span>
                                        <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg \${catStyles[log.category] || catStyles.other}">\${catLabels[log.category] || '일반'}</span>
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-300 tracking-tighter">\${log.consult_date?.split('T')[0] || log.created_at?.split(' ')[0]}</span>
                                </div>
                                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">\${log.message}</p>
                            </div>
                        </div>
                    \`;
                }).join('');
            }
        }

        async function addConsultationLog() {
            const studentId = document.getElementById('studentId').value;
            if (!studentId) return;
            const content = document.getElementById('consultContent').value;
            if (!content) return;

            const category = document.getElementById('consultCategory').value;
            const method = document.getElementById('consultMethod').value;
            const date = document.getElementById('consultDate').value || new Date().toISOString().split('T')[0];

            const token = localStorage.getItem('token');
            const response = await fetch(\`/api/hrd/students/\${studentId}/consultations\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ content, manager: '자동', date, category, method, course_id: document.getElementById('stdCourseId').value })
            });

            if (response.ok) {
                document.getElementById('consultContent').value = '';
                loadConsultations(studentId);
            }
        }

        function handleStdImage(input) {
            if(!input.files || !input.files[0]) return;
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    if (width > height) { if (width > 400) { height *= 400/width; width = 400; } }
                    else { if (height > 400) { width *= 400/height; height = 400; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    document.getElementById('stdProfileImage').value = dataUrl;
                    document.getElementById('modalStdImage').src = dataUrl;
                }
            }
        }
    </script>
</body>
</html>
`;
