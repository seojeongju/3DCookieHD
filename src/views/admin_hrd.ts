
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
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gnb-item.active {
            background-color: #14b8a6; /* teal-500 */
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #4b5563;
            border-bottom: 1px solid #f3f4f6;
            transition: all 0.2s;
        }
        .sidebar-item:hover {
            background-color: #f0fdfa; /* teal-50 */
            color: #0f766e; /* teal-700 */
            padding-left: 1.25rem;
        }
        .sidebar-item.active {
            background-color: #f0fdfa;
            color: #0d9488; /* teal-600 */
            font-weight: 600;
            border-left: 3px solid #0d9488;
        }
        .sidebar-header {
            background-color: #f9fafb;
            padding: 1rem;
            font-weight: 700;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            border-top: 1px solid #e5e7eb;
        }
        .table-header {
            background-color: #f9fafb;
            color: #374151;
            font-weight: 600;
            font-size: 0.75rem;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }
        .table-row {
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.8rem;
            color: #4b5563;
        }
        .table-row:hover {
            background-color: #f9fafb;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.7rem;
            font-weight: 600;
            color: white;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex font-sans">

    <!-- 왼쪽 사이드바 (전체 높이) -->
    <aside class="w-64 bg-slate-800 flex-shrink-0 flex flex-col text-white transition-all duration-300 z-20">
        <div class="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-700">
            <div>
                <h2 class="text-lg font-bold tracking-tight">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-0.5">서정주 님(정직원)</p>
            </div>
        </div>

        <nav class="flex-grow overflow-y-auto py-4">
            <!-- 지원자관리 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-user w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">지원자관리</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 물품 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-box w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">물품</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 거래처 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-handshake w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">거래처</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 문자 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-envelope w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">문자</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 훈련시설 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-building w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">훈련시설</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 일정 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-calendar-alt w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">일정</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 기초 데이터 등록 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-upload w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">기초 데이터 등록</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 증빙자료 다운로드 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-download w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">증빙자료 다운로드</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>
        </nav>
    </aside>

    <!-- 우측 메인 영역 -->
    <div class="flex-grow flex flex-col h-screen overflow-hidden">

        <!-- 상단 탭 네비게이션 -->
        <header class="bg-gray-800 text-white h-16 flex items-center shadow-md z-10">
            <div class="flex h-full overflow-x-auto no-scrollbar">
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">
                    운영
                </a>
                <a href="/admin/hrd/students" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">
                    학생
                </a>
                <a href="/admin/hrd/courses" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">
                    과정
                </a>
                <a href="/admin/hrd/personnel" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">
                    인사
                </a>
                <a href="/admin/hrd/ncs-plan" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">
                    [NCS] 평가계획
                </a>
                <a href="/admin/hrd/ncs-exec" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">
                    [NCS] 평가실행
                </a>
                <a href="/admin/hrd/ncs-result" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">
                    [NCS] 평가결과
                </a>
                <a href="/admin/hrd/evaluation" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">
                    역량평가 - 설문
                </a>
            </div>
            <div class="ml-auto px-6 flex items-center gap-4 text-sm">
                <button class="text-gray-400 hover:text-white"><i class="fas fa-bell"></i></button>
                <button class="text-gray-400 hover:text-white"><i class="fas fa-cog"></i></button>
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

            <!-- 타이틀 및 브레드크럼 -->
            <div class="mb-6">
                <h1 class="text-3xl font-light text-gray-800 mb-2">MAIN</h1>
                <p class="text-sm text-gray-500">HOME / MAIN - (운영)</p>
            </div>

            <!-- 검색 바 및 액션 버튼 -->
            <div class="flex flex-col xl:flex-row gap-4 mb-6 items-start xl:items-center">
                <div class="flex-grow flex flex-wrap items-center bg-white border border-teal-500 min-h-[46px] w-full xl:w-auto shadow-sm">
                    <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap">
                        통합검색
                    </div>
                    <input type="text" placeholder="검색단어 관련있는 지원자, 학생, 과정, 거래처가 검색됩니다." class="flex-grow px-4 py-2 text-sm outline-none min-w-[200px] h-full">
                    <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap border-l border-teal-600">
                        검색기간
                    </div>
                    <select class="px-3 py-2 text-sm outline-none text-gray-600 bg-white border-l border-gray-200 min-w-[120px] h-full">
                        <option>::전체기간::</option>
                    </select>
                    <button class="bg-teal-500 text-white w-14 h-full flex items-center justify-center hover:bg-teal-600 transition">
                        <i class="fas fa-search text-lg"></i>
                    </button>
                </div>

                <div class="flex items-center gap-2 w-full xl:w-auto">
                    <button class="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 h-[46px] text-sm font-bold shadow-md transition whitespace-nowrap rounded-sm ml-auto xl:ml-0">
                        진행 상황 한눈에 보기
                    </button>
                </div>
            </div>

            <!-- 공지사항 바 -->
            <div class="flex items-center gap-3 mb-8 text-sm bg-white p-3 border border-gray-200 rounded-sm shadow-sm">
                <span class="bg-teal-500 text-white px-3 py-1 rounded-sm text-xs font-bold">HRDMarket 공지 및 업데이트 안내</span>
                <a href="#" class="text-gray-700 hover:text-blue-600 hover:underline font-medium">[공지] 나누미넷 서버 이전으로 인한 서비스 일시 중단 안내</a>
            </div>

            <!-- 모집중인 과정 지원자 현황 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8">
                <div class="flex flex-wrap items-center gap-4 mb-8">
                    <h2 class="text-2xl font-light text-gray-700">모집중인 과정 지원자 현황</h2>
                    <div class="flex flex-wrap gap-2 ml-4">
                        <span class="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-bold border border-gray-300">모집중인과정 : 6</span>
                        <span class="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow-sm">신규 지원자 : 0</span>
                        <span class="px-3 py-1 rounded-full bg-teal-500 text-white text-xs font-bold shadow-sm">접수완료 : 0</span>
                        <span class="px-3 py-1 rounded-full bg-orange-400 text-white text-xs font-bold shadow-sm">결제완료 : 0</span>
                        <span class="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm">지원취소 : 1</span>
                    </div>
                </div>

                <h3 class="text-sm font-bold text-gray-700 mb-3 border-l-4 border-teal-500 pl-2">최근 지원자 목록</h3>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1000px] text-sm">
                        <thead>
                            <tr class="border-t-2 border-b border-gray-200 bg-gray-50 text-gray-700">
                                <th class="py-3 w-24 font-medium">지원자</th>
                                <th class="py-3 w-32 font-medium">진행상황</th>
                                <th class="py-3 w-64 font-medium">진행메모</th>
                                <th class="py-3 text-left pl-6 font-medium">과정명</th>
                                <th class="py-3 w-48 font-medium">훈련기간</th>
                                <th class="py-3 w-32 font-medium">등록일자</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium text-gray-800">조원근</td>
                                <td><span class="text-blue-600">2.온라인수강신청</span></td>
                                <td class="text-gray-400 text-xs">홈페이지 온라인 수강신청</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline truncate max-w-xs font-medium">
                                    <span class="text-gray-400 mr-1 font-normal text-xs">: 6회차 :</span> [소공인전문교육 12회] 기초...
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-12 ~ 2025-12-12</td>
                                <td class="text-gray-500 text-xs">2025-11-25</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium text-gray-800">유서진</td>
                                <td><span class="text-gray-800">9.결제완료</span></td>
                                <td class="text-gray-400 text-xs">2025/10/10 전화상담 및 등록...</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline truncate max-w-xs font-medium">
                                    <span class="text-gray-400 mr-1 font-normal text-xs">: 5회차 :</span> [주말반] 3D프린터운용기능사...
                                </td>
                                <td class="text-gray-500 text-xs">2025-11-09 ~ 2025-11-16</td>
                                <td class="text-gray-500 text-xs">2025-10-11</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium text-gray-800">박소희</td>
                                <td><span class="text-gray-600">3.온라인상담</span></td>
                                <td class="text-gray-400 text-xs">2025/09/11 신청확인</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline truncate max-w-xs font-medium">
                                    <span class="text-gray-400 mr-1 font-normal text-xs">: 4회차 :</span> [소공인전문교육 10회] 기초...
                                </td>
                                <td class="text-gray-500 text-xs">2025-10-12 ~ 2025-10-12</td>
                                <td class="text-gray-500 text-xs">2025-09-11</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium text-gray-800">맹승호</td>
                                <td><span class="text-gray-600">3.온라인상담</span></td>
                                <td class="text-gray-400 text-xs">2025/09/06 수강신청확인</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline truncate max-w-xs font-medium">
                                    <span class="text-gray-400 mr-1 font-normal text-xs">: 4회차 :</span> [소공인전문교육 10회] 기초...
                                </td>
                                <td class="text-gray-500 text-xs">2025-10-12 ~ 2025-10-12</td>
                                <td class="text-gray-500 text-xs">2025-09-07</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium text-gray-800">한승희</td>
                                <td><span class="text-gray-600">3.온라인상담</span></td>
                                <td class="text-gray-400 text-xs">2025/08/28 교육안내문자발송</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline truncate max-w-xs font-medium">
                                    <span class="text-gray-400 mr-1 font-normal text-xs">: 2회차 :</span> [2025년 실기특강] 3D프...
                                </td>
                                <td class="text-gray-500 text-xs">2025-09-14 ~ 2025-10-26</td>
                                <td class="text-gray-500 text-xs">2025-08-28</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 모집중인 과정별 지원 현황 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <h3 class="text-sm font-bold text-gray-700 mb-3 border-l-4 border-teal-500 pl-2">모집중인 과정별 지원 현황</h3>
                <div class="overflow-x-auto mb-6">
                    <table class="w-full min-w-[1000px] text-sm">
                        <thead>
                            <tr class="border-t-2 border-b border-gray-200 bg-gray-50 text-gray-700">
                                <th class="py-3 w-16 font-medium">회차</th>
                                <th class="py-3 text-left pl-6 font-medium">과정</th>
                                <th class="py-3 w-48 font-medium">훈련기간</th>
                                <th class="py-3 w-20 font-medium">신규</th>
                                <th class="py-3 w-20 font-medium">접수완료</th>
                                <th class="py-3 w-20 font-medium">결제완료</th>
                                <th class="py-3 w-56 font-medium">접수불가/등록포기/다음과정희망</th>
                                <th class="py-3 w-20 font-medium">총인원</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium">9</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline font-medium">
                                    [소공인전문기술 12월_마감] 심화_월요반: 3D프린팅 & 몰드 소상공인 ...
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-01 ~ 2025-12-08</td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="font-bold text-gray-800">0</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium">10</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline font-medium">
                                    [소공인전문기술 12월_마감] 심화_일요반: 3D프린팅 & 몰드 소상공인 ...
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-07 ~ 2025-12-14</td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="font-bold text-gray-800">0</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium">6</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline font-medium">
                                    [소공인전문교육 12월_마감] 기초1_금요반_3D프린터 활용 소품제작
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-12 ~ 2025-12-12</td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="font-bold text-gray-800">1</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium">41</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline font-medium">
                                    국제인증자격시험응시 ACU(Autodesk Certified User) ...
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-13 ~ 2025-12-13</td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="font-bold text-gray-800">0</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center transition-colors">
                                <td class="py-3 font-medium">9</td>
                                <td class="text-left pl-6 text-blue-600 cursor-pointer hover:underline font-medium">
                                    [평일저녁반] 3D프린터운용기능사 실기대비
                                </td>
                                <td class="text-gray-500 text-xs">2025-12-16 ~ 2026-01-08</td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="text-gray-400">0</span></td>
                                <td><span class="font-bold text-gray-800">0</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 페이지네이션 -->
                <div class="flex justify-end gap-1">
                    <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-double-left"></i></button>
                    <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-left"></i></button>
                    <button class="w-8 h-8 border border-teal-500 rounded-sm bg-teal-500 text-white text-xs font-bold shadow-sm">1</button>
                    <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-600 hover:bg-gray-50 text-xs transition-colors">2</button>
                    <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-right"></i></button>
                    <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-double-right"></i></button>
                </div>
            </div>
        </main>
    </div>

    <script>
        // 사이드바 메뉴 클릭 시 활성화 처리
        const sidebarItems = document.querySelectorAll('.group > div');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // e.preventDefault(); // 링크가 없으므로 필요 없음
                sidebarItems.forEach(si => {
                    si.classList.remove('bg-slate-700', 'text-white');
                    si.classList.add('text-gray-300');
                });
                item.classList.remove('text-gray-300');
                item.classList.add('bg-slate-700', 'text-white');
            });
        });
    </script>
</body>
</html>
`;
