import { hrdSidebar } from './components/hrd_sidebar';

export type StudentJourneyOptions = {
    sidebarHtml?: string;
    backHref?: string;
};

/**
 * 훈련생 여정관리 전용 페이지 (모달 대신 별도 페이지)
 * GET /admin/students/:id/journey or GET /teacher/students/:id/journey
 */
export const adminHrdStudentJourneyHtml = (studentId: string, opts?: StudentJourneyOptions) => {
    const safeId = studentId || '';
    const sidebarHtml = opts?.sidebarHtml ?? hrdSidebar('students');
    const backHref = opts?.backHref ?? '/admin/students';
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>여정 관리 - 훈련생 - 3DCookie HD</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
        .timeline-item:last-child .timeline-line { display: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .tab-active { color: #1e293b; border-bottom: 2px solid #3b82f6; }
        .tab-inactive { color: #94a3b8; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b]">
    <div class="flex h-screen overflow-hidden">
        ${sidebarHtml}
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
                <div class="flex items-center gap-4">
                    <a href="${backHref}" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition font-medium text-sm">
                        <i class="fas fa-arrow-left"></i> 목록으로
                    </a>
                    <div>
                        <h2 class="text-xl font-bold tracking-tight text-gray-900">훈련생 여정 관리</h2>
                        <p class="text-xs text-gray-400 mt-0.5">상담·등록·수료까지 생애주기를 관리합니다.</p>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-hidden flex flex-col bg-white rounded-t-[2.5rem] shadow-sm border border-gray-100">
                <!-- 스테퍼 -->
                <div class="px-10 py-8 border-b border-gray-100 flex flex-col gap-6">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <i class="fas fa-user-astronaut text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-2xl font-black text-gray-900 leading-tight" id="modalStdName">로딩 중...</h3>
                                <p class="text-xs text-gray-400 font-medium" id="modalStdIdDisplay">Student Journey</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between max-w-4xl mx-auto w-full relative h-20 px-8">
                        <div class="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100"></div>
                        <div id="stepperProgress" class="absolute left-16 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 transition-all duration-500" style="width: 0%"></div>
                        <div class="flex flex-col items-center relative z-10 cursor-pointer" onclick="updateStage('consulting')">
                            <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all step-icon" data-stage="consulting"><i class="fas fa-comments text-sm"></i></div>
                            <span class="text-[10px] font-black mt-2 text-gray-400 step-label" data-stage="consulting">초기 상담</span>
                        </div>
                        <div class="flex flex-col items-center relative z-10 cursor-pointer" onclick="updateStage('registered')">
                            <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all step-icon" data-stage="registered"><i class="fas fa-file-signature text-sm"></i></div>
                            <span class="text-[10px] font-black mt-2 text-gray-400 step-label" data-stage="registered">등록·발급</span>
                        </div>
                        <div class="flex flex-col items-center relative z-10 cursor-pointer" onclick="updateStage('learning')">
                            <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all step-icon" data-stage="learning"><i class="fas fa-book-reader text-sm"></i></div>
                            <span class="text-[10px] font-black mt-2 text-gray-400 step-label" data-stage="learning">집중 훈련</span>
                        </div>
                        <div class="flex flex-col items-center relative z-10 cursor-pointer" onclick="updateStage('completed')">
                            <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all step-icon" data-stage="completed"><i class="fas fa-award text-sm"></i></div>
                            <span class="text-[10px] font-black mt-2 text-gray-400 step-label" data-stage="completed">수료 완료</span>
                        </div>
                        <div class="flex flex-col items-center relative z-10 cursor-pointer" onclick="updateStage('employed')">
                            <div class="w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-gray-300 transition-all step-icon" data-stage="employed"><i class="fas fa-rocket text-sm"></i></div>
                            <span class="text-[10px] font-black mt-2 text-gray-400 step-label" data-stage="employed">취업·성공</span>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-hidden flex bg-gray-50/50 min-h-0">
                    <div class="w-[380px] border-r border-gray-100 p-8 overflow-y-auto space-y-6 shrink-0">
                        <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <div class="flex flex-col items-center text-center">
                                <div class="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-4 border-white shadow-xl overflow-hidden mb-4 relative group cursor-pointer" onclick="document.getElementById('stdImageFile').click()">
                                    <img id="modalStdImage" src="https://ui-avatars.com/api/?name=User" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">변경</div>
                                </div>
                                <input type="file" id="stdImageFile" class="hidden" onchange="handleStdImage(this)">
                                <h4 class="text-lg font-bold text-gray-900" id="sidebarStdName">-</h4>
                                <p class="text-xs text-gray-400 font-medium" id="sidebarStdCourse">-</p>
                                <div class="flex gap-2 mt-4">
                                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase" id="sidebarStdStatus">상담중</span>
                                    <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase" id="sidebarStdType">구직자</span>
                                </div>
                                <div class="mt-8 grid grid-cols-2 gap-3 border-t border-gray-50 pt-6 w-full">
                                    <div class="bg-gray-50 p-3 rounded-2xl text-center"><span class="block text-[10px] font-black text-gray-400 uppercase mb-1">출석률</span><span id="sidebarAttendanceRate" class="text-lg font-black text-blue-600">-</span></div>
                                    <div class="bg-gray-50 p-3 rounded-2xl text-center"><span class="block text-[10px] font-black text-gray-400 uppercase mb-1">상담횟수</span><span class="text-lg font-black text-gray-800" id="consultCount">0</span></div>
                                </div>
                                <div id="advancedAttendanceContainer" class="mt-4 w-full text-left bg-gray-50 p-4 rounded-2xl hidden">
                                </div>
                            </div>
                        </div>
                        <form id="studentForm" onsubmit="handleSaveStudent(event)" class="space-y-6 pb-12">
                            <input type="hidden" name="id" id="studentId">
                            <input type="hidden" name="profile_image" id="stdProfileImage">
                            <input type="hidden" name="status" id="stdStatus">
                            <div class="space-y-4">
                                <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest"><i class="fas fa-info-circle mr-2"></i> 필수 인적 정보</h5>
                                <div class="grid grid-cols-1 gap-3">
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">이름</label><input type="text" id="stdName" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"></div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">생년월일</label><input type="date" id="stdBirthdate" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none"></div>
                                        <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">연락처</label><input type="text" id="stdPhone" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none" placeholder="010-0000-0000"></div>
                                    </div>
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">이메일</label><input type="email" id="stdEmail" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none"></div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest"><i class="fas fa-graduation-cap mr-2"></i> 교육 대상 구분</h5>
                                <div class="space-y-3">
                                    <select id="stdCourseId" class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none cursor-pointer"><option value="">과정 선택</option></select>
                                    <div class="grid grid-cols-2 gap-3">
                                        <select id="stdType" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                            <option value="jobseeker">구직자</option><option value="worker">재직자</option><option value="general">일반</option><option value="student">학생</option>
                                        </select>
                                        <select id="stdGender" required class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none">
                                            <option value="M">남성</option><option value="F">여성</option>
                                        </select>
                                    </div>
                                    <textarea id="stdStatusMemo" rows="3" class="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none resize-none" placeholder="비고 및 관리자 메모"></textarea>
                                </div>
                            </div>
                            <button type="submit" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl transition active:scale-95">정보 업데이트</button>
                        </form>
                    </div>
                    <div class="flex-1 p-8 flex flex-col overflow-hidden min-w-0">
                        <div class="flex items-center gap-8 border-b border-gray-100 mb-8">
                            <button onclick="switchTab('timeline')" id="tabTimeline" class="pb-4 text-sm font-black uppercase tab-active transition-all">상담 타임라인</button>
                            <button onclick="switchTab('details')" id="tabDetails" class="pb-4 text-sm font-black uppercase tab-inactive transition-all">행정 상세 정보</button>
                            <button onclick="switchTab('courses')" id="tabCourses" class="pb-4 text-sm font-black uppercase tab-inactive transition-all">수강 관리</button>
                            <button onclick="switchTab('assignment')" id="tabAssignment" class="pb-4 text-sm font-black uppercase tab-inactive transition-all">수강 배정</button>
                        </div>
                        <div id="contentTimeline" class="flex-1 flex flex-col overflow-hidden">
                            <div class="mb-8">
                                <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">상담 및 히스토리 로그</h4>
                                <p class="text-[10px] text-gray-400 font-medium">관리자, 강사의 통합 상담 일지입니다.</p>
                            </div>
                            <div class="bg-blue-600 rounded-3xl p-6 shadow-xl mb-8 border border-blue-500 animate-slide-up">
                                <div class="flex gap-4 mb-4">
                                    <div class="flex-1">
                                        <div class="flex gap-2 mb-2">
                                            <input type="date" id="consultDate" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none">
                                            <select id="consultCategory" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                                                <option value="academic" class="text-gray-900">학사/학습</option><option value="attendance" class="text-gray-900">출결 관리</option><option value="career" class="text-gray-900">취업 지원</option><option value="complaint" class="text-gray-900">고충 건의</option><option value="other" class="text-gray-900">기타</option>
                                            </select>
                                            <select id="consultMethod" class="bg-white/20 border-none rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                                                <option value="face_to_face" class="text-gray-900">대면</option><option value="phone" class="text-gray-900">유선</option><option value="online" class="text-gray-900">온라인</option>
                                            </select>
                                        </div>
                                        <textarea id="consultContent" rows="1" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none overflow-hidden" placeholder="새로운 상담 내용을 작성하세요..." oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
                                    </div>
                                    <button onclick="addConsultationLog()" class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg hover:scale-105 transition"><i class="fas fa-paper-plane text-xl"></i></button>
                                </div>
                            </div>
                            <div id="consultationList" class="flex-1 overflow-y-auto pr-6 space-y-6 pb-20"></div>
                        </div>
                        <div id="contentCourses" class="hidden flex-1 overflow-y-auto pr-6 space-y-6 pb-20">
                            <div class="mb-4">
                                <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">수강 이력 및 성적 관리</h4>
                                <p class="text-[10px] text-gray-400 font-medium">등록된 회차별 수강 정보입니다.</p>
                            </div>
                            <div id="enrolledCoursesList" class="space-y-4">
                                <div class="text-center text-gray-300 py-12 text-sm">로딩 중...</div>
                            </div>
                        </div>
                        <div id="contentAssignment" class="hidden flex-1 overflow-y-auto pr-6 space-y-6 pb-20">
                            <div class="mb-4">
                                <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">수강 과정 배정</h4>
                                <p class="text-[10px] text-gray-400 font-medium">모집 중인 과정을 선택하여 훈련생에게 배정합니다.</p>
                            </div>
                            <div id="availableSessionsList" class="space-y-4">
                                <div class="text-center text-gray-300 py-12 text-sm">로딩 중...</div>
                            </div>
                        </div>
                        <div id="contentDetails" class="hidden flex-1 overflow-y-auto pr-6 space-y-10 pb-20">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase flex items-center"><i class="fas fa-id-card mr-3 text-blue-500"></i> 인적 상세 및 학력</h5>
                                <div class="grid grid-cols-1 gap-6">
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">상세 주소</label><input type="text" id="stdAddress" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="거주지 상세 주소"></div>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">최종 학력</label><input type="text" id="stdEducation" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 00대학교 졸업"></div>
                                        <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">보유 자격증</label><input type="text" id="stdCertifications" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 전산회계 1급"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase flex items-center"><i class="fas fa-credit-card mr-3 text-orange-500"></i> 결제 정보 및 훈련 유형</h5>
                                <div class="grid grid-cols-2 gap-6">
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">지원 유형</label><select id="stdPackageType" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none cursor-pointer"><option value="">유형 선택</option><option value="jobholder">일반훈련생(재직자)</option><option value="unemployed">일반훈련생(일반실업자)</option><option value="package2">취업성공패키지2유형</option><option value="package1">취업성공패키지1유형(2유형중 저소득층)</option><option value="eitc">근로장려금수급자</option><option value="general">일반</option></select></div>
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">자부담금 결제 수단</label><select id="stdPaymentMethod" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none cursor-pointer"><option value="">선택</option><option value="card">카드</option><option value="transfer">계좌이체</option><option value="cash">현금</option></select></div>
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">자부담 결제수단 직접입력</label><input type="text" id="stdPaymentMethodNote" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="예: 결제선생 신한7911"></div>
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">결제일</label><input type="date" id="stdPaymentDate" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none"></div>
                                    <div><label class="text-[10px] font-bold text-gray-400 ml-1 mb-2 block uppercase">자부담 실결제액</label><input type="number" id="stdSelfPay" class="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" placeholder="0"></div>
                                    <div class="col-span-2 flex justify-end"><button type="button" id="btnSavePayment" onclick="window.handleSavePayment && window.handleSavePayment()" class="px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-colors"><i class="fas fa-save mr-2"></i>결재 저장</button></div>
                                </div>
                                <div class="mt-6 pt-6 border-t border-gray-100">
                                    <h6 class="text-xs font-black text-gray-500 uppercase mb-3">저장된 결재 내역</h6>
                                    <div id="paymentListContainer" class="space-y-2 max-h-48 overflow-y-auto rounded-xl bg-gray-50/50 p-3">
                                        <div id="paymentListEmpty" class="text-center text-gray-400 text-sm py-4">저장된 결재가 없습니다. 위에서 입력 후 &#39;결재 저장&#39;을 눌러 주세요.</div>
                                        <ul id="paymentList" class="hidden space-y-2"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                                <h5 class="text-sm font-black text-gray-900 uppercase flex items-center"><i class="fas fa-tasks mr-3 text-emerald-500"></i> 행정 절차 체크리스트</h5>
                                <div class="grid grid-cols-3 gap-4">
                                    <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors"><input type="checkbox" id="stdHasApplication" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500"><span class="text-xs font-bold text-gray-700">훈련 신청서 제출</span></label>
                                    <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors"><input type="checkbox" id="stdHasCard" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500"><span class="text-xs font-bold text-gray-700">내일배움카드 발급</span></label>
                                    <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors"><input type="checkbox" id="stdIsRegistered" class="w-5 h-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500"><span class="text-xs font-bold text-gray-700">HRD-Net 등록 완료</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <!-- 상담 수정 모달 -->
    <div id="consultEditModal" class="fixed inset-0 z-50 hidden bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="consultEditModalTitle">
        <div class="h-full flex items-center justify-center" onclick="if (event.target === this) window.closeConsultEditModal && window.closeConsultEditModal()">
        <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col" onclick="event.stopPropagation()">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h4 id="consultEditModalTitle" class="text-lg font-bold text-gray-900">상담 수정</h4>
                <button type="button" onclick="window.closeConsultEditModal && window.closeConsultEditModal()" class="text-gray-400 hover:text-gray-600 p-1"><i class="fas fa-times"></i></button>
            </div>
            <form id="consultEditForm" class="p-6 space-y-4 overflow-y-auto flex-1" onsubmit="return false;">
                <input type="hidden" id="consultEditLogId" value="">
                <div>
                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">상담일</label>
                    <input type="date" id="consultEditDate" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">상담자</label>
                    <select id="consultEditCounselorId" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option value="">선택하세요</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">유형</label>
                        <select id="consultEditCategory" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none cursor-pointer">
                            <option value="academic" class="text-gray-900">학사/학습</option><option value="attendance" class="text-gray-900">출결 관리</option><option value="career" class="text-gray-900">취업 지원</option><option value="complaint" class="text-gray-900">고충 건의</option><option value="other" class="text-gray-900">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">방식</label>
                        <select id="consultEditMethod" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none cursor-pointer">
                            <option value="face_to_face" class="text-gray-900">대면</option><option value="phone" class="text-gray-900">유선</option><option value="online" class="text-gray-900">온라인</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-gray-400 ml-1 mb-1 block">상담 내용</label>
                    <textarea id="consultEditContent" rows="4" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="상담 내용"></textarea>
                </div>
            </form>
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onclick="window.closeConsultEditModal && window.closeConsultEditModal()" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm">취소</button>
                <button type="button" id="consultEditSubmitBtn" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm">저장</button>
            </div>
        </div>
        </div>
    </div>
    <script>window.JOURNEY_STUDENT_ID = ${JSON.stringify(safeId)};</script>
    <script src="/static/student-journey.js"></script>
</body>
</html>
`;
};
