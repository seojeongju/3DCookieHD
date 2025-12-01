
export const adminHrdHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        teal: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            400: '#2dd4bf',
                            500: '#14b8a6',
                            600: '#0d9488',
                            700: '#0f766e',
                        },
                        rose: {
                            400: '#fb7185',
                            500: '#f43f5e',
                            600: '#e11d48',
                            700: '#be123c',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gnb-item.active { background-color: #14b8a6; }
        .sidebar-item { display: flex; align-items: center; padding: 0.75rem 1rem; font-size: 0.875rem; color: #4b5563; border-bottom: 1px solid #f3f4f6; transition: all 0.2s; }
        .sidebar-item:hover { background-color: #f0fdfa; color: #0f766e; padding-left: 1.25rem; }
        .sidebar-item.active { background-color: #f0fdfa; color: #0d9488; font-weight: 600; border-left: 3px solid #0d9488; }
        .sidebar-subitem { color: #9ca3af; transition: all 0.2s; }
        .sidebar-subitem:hover { color: white; }
        .sidebar-subitem.active { color: #14b8a6; font-weight: 600; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex font-sans">

    <!-- 왼쪽 사이드바 -->
    <aside class="w-64 bg-slate-800 flex-shrink-0 flex flex-col text-white transition-all duration-300 z-20">
        <div class="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-700">
            <div>
                <h2 class="text-lg font-bold tracking-tight">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-0.5">관리자 모드</p>
            </div>
        </div>

        <nav class="flex-grow overflow-y-auto py-4">
            <!-- 학생/지원자 관리 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-user-graduate w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">학생/지원자 관리</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <div onclick="showSection('applicantList')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-applicant-list">지원자 목록 (상담)</div>
                    <div onclick="showSection('applicantForm')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-applicant-create">지원자/수강생 상담관리</div>
                    <div onclick="showSection('studentList')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-student-list">수강생 목록 (등록)</div>
                    <div onclick="showSection('traineeDashboard')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-trainee-dashboard">훈련생/수료생/취업생 현황</div>
                </div>
            </div>

            <!-- 기타 메뉴들 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-box w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">물품</span>
                </div>
            </div>
        </nav>
    </aside>

    <!-- 우측 메인 영역 -->
    <div class="flex-grow flex flex-col h-screen overflow-hidden">

        <!-- 상단 탭 네비게이션 -->
        <header class="bg-gray-800 text-white h-16 flex items-center shadow-md z-10">
            <div class="flex h-full overflow-x-auto no-scrollbar">
                <a href="/admin/hrd" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">수강생관리</a>
                <a href="/admin/hrd/students" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">운영관리</a>
                <a href="/admin/hrd/courses" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">과정관리</a>
                <a href="/admin/hrd/personnel" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">강사관리</a>
                <a href="/admin/hrd/ncs-plan" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가계획</a>
                <a href="/admin/hrd/ncs-exec" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가실행</a>
                <a href="/admin/hrd/ncs-result" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가결과</a>
                <a href="/admin/hrd/evaluation" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">역량평가-설문</a>
            </div>
            <div class="ml-auto px-6 flex items-center gap-4 text-sm">
                <a href="/admin" class="text-gray-400 hover:text-white flex items-center gap-2">
                    <i class="fas fa-tachometer-alt"></i> 관리자 대시보드
                </a>
                <a href="/" class="text-gray-400 hover:text-white flex items-center gap-2">
                    <i class="fas fa-home"></i> 홈페이지
                </a>
            </div>
        </header>

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-grow overflow-y-auto bg-gray-50 p-8">

            <!-- 대시보드 섹션 -->
            <div id="dashboardSection">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">MAIN</h1>
                    <p class="text-sm text-gray-500">HOME / MAIN - (운영)</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8">
                    <h2 class="text-2xl font-light text-gray-700 mb-4">모집중인 과정 지원자 현황</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[1000px] text-sm">
                            <thead>
                                <tr class="border-t-2 border-b border-gray-200 bg-gray-50 text-gray-700">
                                    <th class="py-3 w-24 font-medium">지원자</th>
                                    <th class="py-3 w-32 font-medium">진행상황</th>
                                    <th class="py-3 text-left pl-6 font-medium">과정명</th>
                                    <th class="py-3 w-32 font-medium">등록일자</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600 text-center">
                                <tr><td colspan="4" class="py-4">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 지원자 목록 섹션 -->
            <div id="applicantListSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">지원자 목록</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 학생/지원자 관리 / 지원자 목록</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex gap-2">
                            <input type="text" id="applicantSearchInput" placeholder="이름, 전화번호 검색" class="border border-gray-300 px-3 py-2 rounded text-sm w-64 focus:outline-none focus:border-teal-500">
                            <button onclick="loadApplicants()" class="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600">검색</button>
                        </div>
                        <button onclick="showSection('applicantForm')" class="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700">
                            <i class="fas fa-plus mr-1"></i> 지원자 등록
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left border-t border-gray-200">
                            <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th class="py-3 px-4 w-16 text-center">No</th>
                                    <th class="py-3 px-4 w-32">이름</th>
                                    <th class="py-3 px-4 w-40">연락처</th>
                                    <th class="py-3 px-4 w-48">이메일</th>
                                    <th class="py-3 px-4">관심과정</th>
                                    <th class="py-3 px-4 w-24 text-center">상태</th>
                                    <th class="py-3 px-4 w-32 text-center">등록일</th>
                                    <th class="py-3 px-4 w-20 text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody id="applicantTableBody" class="text-gray-600">
                                <tr><td colspan="8" class="text-center py-8">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 지원자 등록/수정 폼 섹션 -->
            <div id="applicantFormSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2" id="pageTitle">지원자 등록</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 학생/지원자 관리 / <span id="pageSubtitle">지원자 등록</span></p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-5xl mx-auto">
                    <form onsubmit="handleApplicantSave(event)">
                        <input type="hidden" id="applicantId">
                        
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- 왼쪽: 상담 및 현황 정보 -->
                            <div>
                                <h3 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2">1. 상담 및 현황 정보</h3>
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">상담일자</label>
                                            <input type="date" id="app_created_at" class="w-full border border-gray-300 px-3 py-2 rounded text-sm" disabled>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">상담자</label>
                                            <input type="text" class="w-full border border-gray-300 px-3 py-2 rounded text-sm bg-gray-50" value="관리자" disabled>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">상담유형</label>
                                            <select id="app_consultation_type" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="online">온라인상담</option>
                                                <option value="visit">방문상담</option>
                                                <option value="phone">전화상담</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">진행상태</label>
                                            <select id="app_status" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="pending">상담대기</option>
                                                <option value="contacted">상담완료</option>
                                                <option value="registered">등록완료</option>
                                                <option value="completed">수료</option>
                                                <option value="dropped">중도탈락</option>
                                                <option value="cancelled">취소</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">과정명</label>
                                        <select id="app_course_id" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                            <option value="">과정 선택</option>
                                            <!-- 동적 로드 -->
                                        </select>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">회차</label>
                                            <input type="text" id="app_course_round" class="w-full border border-gray-300 px-3 py-2 rounded text-sm" placeholder="예: 1회차">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">개강공지문자</label>
                                            <select id="app_is_sms_sent" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="false">발송전</option>
                                                <option value="true">발송완료</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">고용형태</label>
                                            <select id="app_employment_type" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="">선택</option>
                                                <option value="employed">재직자</option>
                                                <option value="unemployed">구직자</option>
                                                <option value="self_employed">자영업자</option>
                                                <option value="student">학생</option>
                                                <option value="other">기타</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">지원유형</label>
                                            <select id="app_support_type" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="">선택</option>
                                                <option value="hrd_card">국민내일배움카드</option>
                                                <option value="general">일반</option>
                                                <option value="company">사업주위탁</option>
                                                <option value="other">기타</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">취업성공패키지</label>
                                            <select id="app_tsp_type" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="">해당없음</option>
                                                <option value="type1">1유형</option>
                                                <option value="type2">2유형</option>
                                                <option value="kua">국민취업지원제도</option>
                                            </select>
                                        </div>
                                        <div class="flex items-end gap-4 pb-2">
                                            <label class="flex items-center text-xs text-gray-700">
                                                <input type="checkbox" id="app_has_hrd_card" class="mr-1"> 내일배움카드 소지
                                            </label>
                                            <label class="flex items-center text-xs text-gray-700">
                                                <input type="checkbox" id="app_is_hrd_net_registered" class="mr-1"> 고용24 입력
                                            </label>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-3 gap-2">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">수납방법</label>
                                            <select id="app_payment_method" class="w-full border border-gray-300 px-2 py-2 rounded text-sm">
                                                <option value="">미수납</option>
                                                <option value="card">카드</option>
                                                <option value="cash">현금</option>
                                                <option value="transfer">계좌이체</option>
                                                <option value="online">온라인결제</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">수납일자</label>
                                            <input type="date" id="app_payment_date" class="w-full border border-gray-300 px-2 py-2 rounded text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">자비부담금</label>
                                            <input type="number" id="app_payment_amount" class="w-full border border-gray-300 px-2 py-2 rounded text-sm" placeholder="원">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">특이사항/비고 (요약)</label>
                                        <textarea id="app_memo" class="w-full border border-gray-300 px-3 py-2 rounded text-sm h-16 resize-none" placeholder="전체적인 특이사항이나 요약 내용을 입력하세요."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- 오른쪽: 개인 정보 -->
                            <div>
                                <h3 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2">2. 개인 정보</h3>
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">이름 <span class="text-red-500">*</span></label>
                                            <input type="text" id="app_name" required class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">연락처 <span class="text-red-500">*</span></label>
                                            <input type="text" id="app_phone" required class="w-full border border-gray-300 px-3 py-2 rounded text-sm" placeholder="010-0000-0000">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">이메일</label>
                                        <input type="email" id="app_email" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">생년월일</label>
                                            <input type="date" id="app_birth_date" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-gray-600 mb-1">성별</label>
                                            <select id="app_gender" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                                <option value="">선택</option>
                                                <option value="male">남</option>
                                                <option value="female">여</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">주소</label>
                                        <input type="text" id="app_address" class="w-full border border-gray-300 px-3 py-2 rounded text-sm" placeholder="전체 주소 입력">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">최종학력</label>
                                        <select id="app_education_level" class="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                                            <option value="">선택</option>
                                            <option value="high_school">고졸</option>
                                            <option value="college">초대졸</option>
                                            <option value="university">대졸</option>
                                            <option value="graduate">대학원졸</option>
                                            <option value="other">기타</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-600 mb-1">자격증 취득 현황</label>
                                        <textarea id="app_certificates" class="w-full border border-gray-300 px-3 py-2 rounded text-sm h-24 resize-none" placeholder="보유 자격증 입력"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 상담 다이어리 섹션 -->
                        <div class="mt-8 border-t border-gray-100 pt-6">
                            <h3 class="text-lg font-bold text-gray-700 mb-4">3. 상담 다이어리</h3>
                            <div id="diarySection" class="bg-gray-50 rounded-lg p-6 hidden">
                                <div id="diaryInputArea" class="mb-6">
                                    <div class="flex gap-2 mb-2">
                                        <input type="text" id="logContent" class="flex-grow border border-gray-300 px-3 py-2 rounded text-sm" placeholder="상담 내용을 입력하세요...">
                                        <button type="button" onclick="saveApplicantLog()" class="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600">기록</button>
                                    </div>
                                </div>
                                <div id="diaryList" class="space-y-3 max-h-60 overflow-y-auto">
                                    <!-- 로그 목록 동적 생성 -->
                                </div>
                            </div>
                            <div id="diaryPlaceholder" class="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                                지원자 정보를 먼저 저장한 후 상담 다이어리를 작성할 수 있습니다.
                            </div>
                        </div>

                        <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button type="button" onclick="showSection('applicantList')" class="bg-gray-100 text-gray-700 px-5 py-2.5 rounded hover:bg-gray-200 transition font-medium">취소</button>
                            <button type="button" id="deleteApplicantBtn" onclick="deleteApplicant()" class="hidden bg-rose-100 text-rose-600 px-5 py-2.5 rounded hover:bg-rose-200 transition font-medium">삭제</button>
                            <button type="submit" class="bg-teal-600 text-white px-6 py-2.5 rounded hover:bg-teal-700 transition font-bold shadow-sm">저장하기</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- 수강생 목록 섹션 -->
            <div id="studentListSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">수강생 목록</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 학생/지원자 관리 / 수강생 목록</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex gap-2">
                            <input type="text" id="studentSearchInput" placeholder="이름, 이메일, 전화번호 검색" class="border border-gray-300 px-3 py-2 rounded text-sm w-64 focus:outline-none focus:border-teal-500">
                            <button onclick="loadStudents()" class="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600">검색</button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left border-t border-gray-200">
                            <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th class="py-3 px-4">이름</th>
                                    <th class="py-3 px-4">연락처</th>
                                    <th class="py-3 px-4">이메일</th>
                                    <th class="py-3 px-4">수강현황</th>
                                    <th class="py-3 px-4">가입일</th>
                                    <th class="py-3 px-4">관리</th>
                                </tr>
                            </thead>
                            <tbody id="studentTableBody" class="text-gray-600">
                                <tr><td colspan="6" class="text-center py-8">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 훈련생/수료생/취업생 현황 섹션 -->
            <div id="traineeDashboardSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">훈련생/수료생/취업생 현황</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 학생/지원자 관리 / 현황</p>
                </div>

                <!-- 검색 바 및 액션 버튼 -->
                <div class="flex flex-col xl:flex-row gap-4 mb-6 items-start xl:items-center">
                    <div class="flex-grow flex flex-wrap items-center bg-white border border-teal-500 min-h-[46px] w-full xl:w-auto shadow-sm">
                        <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap">통합검색</div>
                        <input type="text" placeholder="검색단어 관련있는 지원자, 학생, 과정, 거래처가 검색됩니다." class="flex-grow px-4 py-2 text-sm outline-none min-w-[200px] h-full">
                        <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap border-l border-teal-600">검색기간</div>
                        <select class="px-3 py-2 text-sm outline-none text-gray-600 bg-white border-l border-gray-200 min-w-[120px] h-full">
                            <option>::전체기간::</option>
                            <option>최근 1개월</option>
                        </select>
                        <button class="bg-teal-500 text-white w-14 h-full flex items-center justify-center hover:bg-teal-600 transition"><i class="fas fa-search text-lg"></i></button>
                    </div>
                </div>
                
                <!-- 종합 분류별 현황 -->
                <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div class="flex items-center gap-4 mb-6">
                        <h2 class="text-2xl font-light text-gray-700">종합 분류별 현황</h2>
                        <div class="flex gap-2">
                            <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">진행중인 과정 : 2</span>
                            <span class="bg-orange-400 text-white px-2 py-1 rounded text-xs font-bold">2025 년 수료된 과정 : 37</span>
                        </div>
                    </div>

                    <!-- 탭 메뉴 -->
                    <div class="flex border-b border-gray-200 mb-6">
                        <button class="px-4 py-2 text-sm font-bold text-gray-700 border-b-2 border-gray-700">훈련생 현황</button>
                        <button class="px-4 py-2 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-700">수료생 현황</button>
                    </div>

                    <!-- 진행중인 과정 현황 -->
                    <div class="mb-8">
                        <div class="flex items-center gap-3 mb-4">
                            <h3 class="text-lg font-light text-gray-700">진행중인 과정 현황</h3>
                        </div>
                        <div class="overflow-x-auto border-t-2 border-gray-200">
                            <table class="w-full min-w-[800px] text-sm text-center">
                                <thead class="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                    <tr>
                                        <th class="py-2 w-16">회차</th>
                                        <th class="py-2 text-left pl-4">과정명</th>
                                        <th class="py-2 w-48">훈련기간</th>
                                        <th class="py-2 w-24">총인원</th>
                                        <th class="py-2 w-24">훈련생</th>
                                    </tr>
                                </thead>
                                <tbody class="text-gray-600">
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2">3</td>
                                        <td class="py-2 text-left pl-4 text-blue-600">[토요반] Fusion 활용 3D모델링 고급심화</td>
                                        <td class="py-2 text-xs text-gray-500">2025-10-25 ~ 2025-12-06</td>
                                        <td class="py-2">8</td>
                                        <td class="py-2">8</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2">8</td>
                                        <td class="py-2 text-left pl-4 text-blue-600">[토,일 주말반] 3D프린터운용기능사 실기대비</td>
                                        <td class="py-2 text-xs text-gray-500">2025-11-23 ~ 2025-12-13</td>
                                        <td class="py-2">7</td>
                                        <td class="py-2">7</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 하단 2단 그리드 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- 훈련생 상담관리 -->
                        <div>
                            <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <h3 class="text-sm font-bold text-gray-700 border-l-4 border-teal-500 pl-2">훈련생 상담관리</h3>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-xs text-center">
                                    <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                                        <tr>
                                            <th class="py-2 w-16">학생</th>
                                            <th class="py-2 w-16">분류</th>
                                            <th class="py-2 text-left pl-2">과정</th>
                                            <th class="py-2 w-24">일자</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                                            <td class="py-2 text-blue-600">김진수</td>
                                            <td class="py-2">일반</td>
                                            <td class="py-2 text-left pl-2 text-gray-500 truncate max-w-[150px]">[토,일 주말반] 3D프린터운용...</td>
                                            <td class="py-2 text-gray-400">2025-11-29</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <!-- 수료생 취업관리 -->
                        <div>
                            <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <h3 class="text-sm font-bold text-gray-700 border-l-4 border-teal-500 pl-2">수료생 취업관리</h3>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-xs text-center">
                                    <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                                        <tr>
                                            <th class="py-2 w-16">학생</th>
                                            <th class="py-2 w-16">분류</th>
                                            <th class="py-2 text-left pl-2">업체</th>
                                            <th class="py-2 w-24">일자</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                                            <td class="py-2 text-blue-600">이명재</td>
                                            <td class="py-2">취업</td>
                                            <td class="py-2 text-left pl-2 text-gray-500 truncate max-w-[150px]">(사)대한노인회중랑구지회</td>
                                            <td class="py-2 text-gray-400"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <!-- 수강생 상세 모달 -->
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
                    <div id="detailEnrollments" class="space-y-2"></div>
                </div>
            </div>
            <!-- 상담/관리 이력 -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-700 flex items-center">
                        <i class="fas fa-book mr-2 text-green-500"></i>상담 다이어리
                    </h4>
                </div>
                <div id="detailConsultations" class="space-y-4 max-h-96 overflow-y-auto"></div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 초기 로드 시 대시보드 표시
            loadCoursesForApplicantForm();
        });

        async function loadCoursesForApplicantForm() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('app_course_id');
                    // 기존 옵션 초기화 (첫번째 '과정 선택'만 남김)
                    select.innerHTML = '<option value="">과정 선택</option>';
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

        function showSection(sectionId, data = null) {
            // 모든 섹션 숨김
            document.getElementById('dashboardSection').classList.add('hidden');
            document.getElementById('applicantListSection').classList.add('hidden');
            document.getElementById('applicantFormSection').classList.add('hidden');
            document.getElementById('studentListSection').classList.add('hidden');
            document.getElementById('traineeDashboardSection').classList.add('hidden');

            // 메뉴 활성화 상태 초기화
            document.getElementById('menu-applicant-list').classList.remove('active');
            document.getElementById('menu-applicant-create').classList.remove('active');
            document.getElementById('menu-student-list').classList.remove('active');
            document.getElementById('menu-trainee-dashboard').classList.remove('active');

            // 선택된 섹션 표시
            if (sectionId === 'applicantList') {
                document.getElementById('applicantListSection').classList.remove('hidden');
                document.getElementById('menu-applicant-list').classList.add('active');
                loadApplicants();
            } else if (sectionId === 'traineeDashboard') {
                document.getElementById('traineeDashboardSection').classList.remove('hidden');
                document.getElementById('menu-trainee-dashboard').classList.add('active');
            } else if (sectionId === 'applicantForm') {
                document.getElementById('applicantFormSection').classList.remove('hidden');
                const form = document.querySelector('#applicantFormSection form');
                form.reset();
                
                if (data) {
                    // 수정 모드
                    document.getElementById('pageTitle').textContent = '지원자 정보 수정';
                    document.getElementById('pageSubtitle').textContent = '지원자 수정';
                    document.getElementById('menu-applicant-list').classList.add('active');
                    
                    document.getElementById('applicantId').value = data.id;
                    document.getElementById('deleteApplicantBtn').classList.remove('hidden');
                    
                    // 필드 값 채우기
                    document.getElementById('app_created_at').value = data.created_at ? data.created_at.split('T')[0] : '';
                    document.getElementById('app_consultation_type').value = data.consultation_type || 'online';
                    document.getElementById('app_status').value = data.status || 'pending';
                    document.getElementById('app_course_id').value = data.course_id || '';
                    document.getElementById('app_course_round').value = data.course_round || '';
                    document.getElementById('app_is_sms_sent').value = data.is_sms_sent ? 'true' : 'false';
                    document.getElementById('app_employment_type').value = data.employment_type || '';
                    document.getElementById('app_support_type').value = data.support_type || '';
                    document.getElementById('app_tsp_type').value = data.tsp_type || '';
                    document.getElementById('app_has_hrd_card').checked = !!data.has_hrd_card;
                    document.getElementById('app_is_hrd_net_registered').checked = !!data.is_hrd_net_registered;
                    document.getElementById('app_payment_method').value = data.payment_method || '';
                    document.getElementById('app_payment_date').value = data.payment_date || '';
                    document.getElementById('app_payment_amount').value = data.payment_amount || '';
                    document.getElementById('app_memo').value = data.memo || '';
                    
                    document.getElementById('app_name').value = data.name;
                    document.getElementById('app_phone').value = data.phone;
                    document.getElementById('app_email').value = data.email || '';
                    document.getElementById('app_birth_date').value = data.birth_date || '';
                    document.getElementById('app_gender').value = data.gender || '';
                    document.getElementById('app_address').value = data.address || '';
                    document.getElementById('app_education_level').value = data.education_level || '';
                    document.getElementById('app_certificates').value = data.certificates || '';

                    // 다이어리 섹션 활성화 및 로그 로드
                    document.getElementById('diarySection').classList.remove('hidden');
                    document.getElementById('diaryPlaceholder').classList.add('hidden');
                    loadApplicantLogs(data.id);

                } else {
                    // 등록 모드
                    document.getElementById('pageTitle').textContent = '지원자 등록';
                    document.getElementById('pageSubtitle').textContent = '지원자 등록';
                    document.getElementById('menu-applicant-create').classList.add('active');
                    document.getElementById('applicantId').value = '';
                    document.getElementById('deleteApplicantBtn').classList.add('hidden');
                    
                    // 오늘 날짜 설정
                    document.getElementById('app_created_at').value = new Date().toISOString().split('T')[0];

                    // 다이어리 섹션 비활성화
                    document.getElementById('diarySection').classList.add('hidden');
                    document.getElementById('diaryPlaceholder').classList.remove('hidden');
                }
            } else if (sectionId === 'studentList') {
                document.getElementById('studentListSection').classList.remove('hidden');
                document.getElementById('menu-student-list').classList.add('active');
                loadStudents();
            } else {
                document.getElementById('dashboardSection').classList.remove('hidden');
            }
        }

        // ==========================================
        // 지원자 관리 (Applicants)
        // ==========================================
        async function loadApplicants() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/applicants', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const tbody = document.getElementById('applicantTableBody');

                if (!result.success || result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">등록된 지원자가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map((item, index) => {
                    let statusBadge = '';
                    switch(item.status) {
                        case 'pending': statusBadge = '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">상담대기</span>'; break;
                        case 'contacted': statusBadge = '<span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">상담완료</span>'; break;
                        case 'registered': statusBadge = '<span class="bg-teal-100 text-teal-600 px-2 py-1 rounded text-xs">등록완료</span>'; break;
                        case 'cancelled': statusBadge = '<span class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">취소/포기</span>'; break;
                        default: statusBadge = '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">' + item.status + '</span>';
                    }
                    return \`
                    <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onclick='editApplicant(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                        <td class="py-3 px-4 text-center text-gray-400">\${result.data.length - index}</td>
                        <td class="py-3 px-4 font-medium text-gray-900">\${item.name}</td>
                        <td class="py-3 px-4 text-gray-600">\${item.phone}</td>
                        <td class="py-3 px-4 text-gray-500">\${item.email || '-'}</td>
                        <td class="py-3 px-4 text-gray-600 truncate max-w-xs">\${item.course_name || '-'}</td>
                        <td class="py-3 px-4 text-center">\${statusBadge}</td>
                        <td class="py-3 px-4 text-center text-gray-500">\${new Date(item.created_at).toLocaleDateString()}</td>
                        <td class="py-3 px-4 text-center">
                            <button onclick='event.stopPropagation(); editApplicant(\${JSON.stringify(item).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-800"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>
                \`}).join('');
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function editApplicant(data) {
            showSection('applicantForm', data);
        }

        async function handleApplicantSave(e) {
            e.preventDefault();
            const id = document.getElementById('applicantId').value;
            
            const data = {
                name: document.getElementById('app_name').value,
                phone: document.getElementById('app_phone').value,
                email: document.getElementById('app_email').value,
                birth_date: document.getElementById('app_birth_date').value,
                gender: document.getElementById('app_gender').value,
                address: document.getElementById('app_address').value,
                education_level: document.getElementById('app_education_level').value,
                certificates: document.getElementById('app_certificates').value,
                
                consultation_type: document.getElementById('app_consultation_type').value,
                status: document.getElementById('app_status').value,
                course_id: document.getElementById('app_course_id').value || null,
                course_round: document.getElementById('app_course_round').value,
                is_sms_sent: document.getElementById('app_is_sms_sent').value === 'true',
                employment_type: document.getElementById('app_employment_type').value,
                support_type: document.getElementById('app_support_type').value,
                tsp_type: document.getElementById('app_tsp_type').value,
                has_hrd_card: document.getElementById('app_has_hrd_card').checked,
                is_hrd_net_registered: document.getElementById('app_is_hrd_net_registered').checked,
                payment_method: document.getElementById('app_payment_method').value,
                payment_date: document.getElementById('app_payment_date').value,
                payment_amount: document.getElementById('app_payment_amount').value ? parseInt(document.getElementById('app_payment_amount').value) : null,
                memo: document.getElementById('app_memo').value
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? '/api/hrd/applicants/' + id : '/api/hrd/applicants';

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    if (!id) {
                        // 새로 등록한 경우, 수정 모드로 전환하여 다이어리 입력 가능하게 함
                        showSection('applicantList'); // 목록으로 이동 (간단하게)
                    } else {
                        // 수정인 경우 그대로 유지하거나 목록으로
                        showSection('applicantList');
                    }
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteApplicant() {
            const id = document.getElementById('applicantId').value;
            if (!id || !confirm('정말 삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/applicants/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    alert('삭제되었습니다.');
                    showSection('applicantList');
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        // ==========================================
        // 상담 다이어리 (Consultation Logs)
        // ==========================================
        async function loadApplicantLogs(applicantId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/hrd/applicants/\${applicantId}/logs\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const list = document.getElementById('diaryList');
                
                if (!result.success || result.data.length === 0) {
                    list.innerHTML = '<div class="text-center text-gray-400 text-sm py-4">저장된 상담 기록이 없습니다.</div>';
                    return;
                }

                list.innerHTML = result.data.map(log => \`
                    <div class="bg-white border border-gray-200 rounded p-3 shadow-sm">
                        <div class="flex justify-between items-start mb-1">
                            <span class="text-xs font-bold text-gray-700">\${log.writer || '관리자'}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-400">\${new Date(log.created_at).toLocaleString()}</span>
                                <button onclick="deleteApplicantLog(\${log.id}, \${applicantId})" class="text-gray-400 hover:text-red-500">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-sm text-gray-800 whitespace-pre-wrap">\${log.content}</div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function saveApplicantLog() {
            const applicantId = document.getElementById('applicantId').value;
            const content = document.getElementById('logContent').value;
            
            if (!applicantId) {
                alert('지원자 정보가 없습니다.');
                return;
            }
            if (!content.trim()) {
                alert('내용을 입력해주세요.');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/hrd/applicants/\${applicantId}/logs\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ content })
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('logContent').value = '';
                    loadApplicantLogs(applicantId);
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다.');
            }
        }

        async function deleteApplicantLog(logId, applicantId) {
            if (!confirm('삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/hrd/applicants/logs/\${logId}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    loadApplicantLogs(applicantId);
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('오류가 발생했습니다.');
            }
        }

        // ==========================================
        // 수강생 관리 (Students)
        // ==========================================
        async function loadStudents() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/students', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const tbody = document.getElementById('studentTableBody');

                if (!result.success || !result.data || result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">등록된 수강생이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(s => \`
                    <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onclick="viewStudentDetail(\${s.id})">
                        <td class="py-3 px-4 font-medium text-gray-900">\${s.name}</td>
                        <td class="py-3 px-4 text-gray-600">\${s.phone || '-'}</td>
                        <td class="py-3 px-4 text-gray-500">\${s.email}</td>
                        <td class="py-3 px-4">
                            <span class="text-blue-600 font-bold">\${s.enrollment_count || 0}</span>건
                        </td>
                        <td class="py-3 px-4 text-gray-500">\${new Date(s.created_at).toLocaleDateString()}</td>
                        <td class="py-3 px-4">
                            <button class="text-blue-600 hover:text-blue-800" onclick="event.stopPropagation(); viewStudentDetail(\${s.id})">
                                <i class="fas fa-eye"></i> 상세보기
                            </button>
                        </td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('studentTableBody').innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        async function viewStudentDetail(studentId) {
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

                document.getElementById('modalStudentName').textContent = student.name;
                document.getElementById('detailEmail').textContent = student.email;
                document.getElementById('detailPhone').textContent = student.phone || '-';
                document.getElementById('detailCreatedAt').textContent = new Date(student.created_at).toLocaleDateString();

                const enrollmentsHtml = student.enrollments.length > 0 ? student.enrollments.map(e => \`
                    <div class="bg-white p-3 rounded border border-blue-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="font-bold text-sm text-gray-800">\${e.course_title}</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    진도: \${e.progress || 0}% / 출석: \${e.attendance || 0}%
                                </div>
                            </div>
                            <span class="px-2 py-1 text-xs rounded \${
                                e.status === 'completed' ? 'bg-green-100 text-green-800' :
                                e.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }">\${e.status}</span>
                        </div>
                    </div>
                \`).join('') : '<div class="text-sm text-gray-500">수강 이력이 없습니다.</div>';
                document.getElementById('detailEnrollments').innerHTML = enrollmentsHtml;

                const consultationsHtml = student.consultations.length > 0 ? student.consultations.map(c => \`
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <div class="flex justify-between items-start mb-1">
                            <span class="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">\${c.consultation_type}</span>
                            <span class="text-xs text-gray-400">\${new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <div class="text-sm text-gray-700">\${c.memo}</div>
                    </div>
                \`).join('') : '<div class="text-sm text-gray-500 text-center py-4">상담 이력이 없습니다.</div>';
                document.getElementById('detailConsultations').innerHTML = consultationsHtml;

                document.getElementById('studentDetailModal').classList.remove('hidden');
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        function closeStudentModal() {
            document.getElementById('studentDetailModal').classList.add('hidden');
        }
    </script>
</body>
</html>
`;
