
export const adminHrdStudentsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 학생관리</title>
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
            color: #9ca3af; /* gray-400 */
            transition: all 0.2s;
            cursor: pointer;
        }
        .sidebar-item:hover {
            background-color: #334155; /* slate-700 */
            color: white;
            padding-left: 1.25rem;
        }
        .sidebar-item.active {
            background-color: #334155;
            color: white;
            font-weight: 600;
            border-left: 3px solid #14b8a6; /* teal-500 */
        }
        .sidebar-subitem {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem 0.5rem 2.5rem;
            font-size: 0.8rem;
            color: #9ca3af;
            transition: all 0.2s;
        }
        .sidebar-subitem:hover {
            color: white;
        }
        .sidebar-subitem.active {
            color: #14b8a6;
            font-weight: 600;
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
        .tab-btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
            color: #374151;
            border-bottom-color: #374151;
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
            <!-- 훈련생·수료·취업생 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-user-graduate w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">훈련생·수료·취업생</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-subitem active">훈련생</a>
                    <a href="#" class="sidebar-subitem">수료생</a>
                    <a href="#" class="sidebar-subitem">중도탈락생</a>
                    <a href="#" class="sidebar-subitem">학생 이동 복사</a>
                </div>
            </div>

            <!-- 학생로그인인증 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-key w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">학생로그인인증</span>
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
                <a href="/admin/hrd" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">
                    운영
                </a>
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">
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
                <p class="text-sm text-gray-500">HOME / MAIN - (학생)</p>
            </div>

            <!-- 검색 바 및 액션 버튼 -->
            <div class="flex flex-col xl:flex-row gap-4 mb-6 items-start xl:items-center">
                <!-- 검색 바 -->
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
                        <option>최근 1개월</option>
                        <option>최근 3개월</option>
                        <option>최근 6개월</option>
                        <option>최근 1년</option>
                    </select>
                    <button class="bg-teal-500 text-white w-14 h-full flex items-center justify-center hover:bg-teal-600 transition">
                        <i class="fas fa-search text-lg"></i>
                    </button>
                </div>

                <!-- 진행 상황 버튼 -->
                <div class="flex items-center gap-2 w-full xl:w-auto">
                    <div class="flex gap-1 text-xs hidden xl:flex">
                        <button class="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600">패키지명</button>
                        <button class="bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">실소패키지 신청</button>
                        <button class="bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600">장애발생 52일</button>
                        <button class="bg-teal-400 text-white px-2 py-1 rounded hover:bg-teal-500">전송데이터 바로가기</button>
                        <button class="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500">동영상 메뉴얼 바로가기</button>
                    </div>
                    <button class="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 h-[46px] text-sm font-bold shadow-md transition whitespace-nowrap rounded-sm ml-auto xl:ml-0">
                        진행 상황 한눈에 보기
                    </button>
                </div>
            </div>
            
            <!-- 공지사항 바 -->
            <div class="flex items-center gap-3 mb-8 text-sm bg-white p-3 border border-gray-200 rounded-sm shadow-sm">
                <span class="bg-teal-500 text-white px-3 py-1 rounded-sm text-xs font-bold">HRDMarket 공지 및 업데이트 안내</span>
                <a href="#" class="text-gray-700 hover:text-blue-600 hover:underline font-medium">[공지] 전송 홈페이지 발송 문자 등 공지사항 확인 요망</a>
            </div>

            <!-- 종합 분류별 현황 -->
            <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div class="flex items-center gap-4 mb-6">
                    <h2 class="text-2xl font-light text-gray-700">종합 분류별 현황</h2>
                    <div class="flex gap-2">
                        <span class="badge bg-blue-500">진행중인 과정 : 2</span>
                        <span class="badge bg-orange-400">2025 년 수료된 과정 : 37</span>
                    </div>
                </div>

                <!-- 탭 메뉴 -->
                <div class="flex border-b border-gray-200 mb-6">
                    <button class="tab-btn active">훈련생 현황</button>
                    <button class="tab-btn">수료생 현황</button>
                    <select class="ml-auto text-sm border border-gray-300 rounded px-2 py-1 mb-1">
                        <option>2025 년</option>
                    </select>
                </div>

                <!-- 진행중인 과정 현황 -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <h3 class="text-lg font-light text-gray-700">진행중인 과정 현황</h3>
                        <div class="flex gap-1">
                            <span class="badge bg-gray-400">진행중인과정 : 2</span>
                            <span class="badge bg-blue-500">총 훈련생 : 15</span>
                            <span class="badge bg-rose-500">중도탈락 : 0</span>
                        </div>
                    </div>
                    <p class="text-xs font-bold text-gray-600 mb-2 pl-2 border-l-4 border-teal-500">진행중인 과정별 훈련생현황</p>
                    
                    <div class="overflow-x-auto border-t-2 border-gray-200">
                        <table class="w-full min-w-[800px]">
                            <thead>
                                <tr class="table-header h-10">
                                    <th class="w-16">회차</th>
                                    <th class="text-left pl-4">과정명</th>
                                    <th class="w-48">훈련기간</th>
                                    <th class="w-24">총인원</th>
                                    <th class="w-24">중도탈락</th>
                                    <th class="w-24">훈련생</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-row h-10 text-center">
                                    <td>3</td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                        [토요반] Fusion 활용 3D모델링 고급심화
                                    </td>
                                    <td class="text-xs text-gray-500">2025-10-25 ~ 2025-12-06</td>
                                    <td>8</td>
                                    <td>0</td>
                                    <td>8</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>8</td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                        [토,일 주말반] 3D프린터운용기능사 실기대비
                                    </td>
                                    <td class="text-xs text-gray-500">2025-11-23 ~ 2025-12-13</td>
                                    <td>7</td>
                                    <td>0</td>
                                    <td>7</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 페이지네이션 -->
                    <div class="flex justify-end mt-4 gap-1">
                        <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-left"></i></button>
                        <button class="w-8 h-8 border border-teal-500 rounded-sm bg-teal-500 text-white text-xs font-bold shadow-sm">1</button>
                        <button class="w-8 h-8 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center transition-colors"><i class="fas fa-angle-right"></i></button>
                    </div>
                </div>

                <!-- 하단 2단 그리드 (훈련생 상담관리 / 수료생 취업관리) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- 훈련생 상담관리 -->
                    <div>
                        <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                            <h3 class="text-sm font-bold text-gray-700 border-l-4 border-teal-500 pl-2">훈련생 상담관리</h3>
                            <i class="fas fa-chevron-up text-gray-400 cursor-pointer"></i>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-xs">
                                <thead>
                                    <tr class="bg-gray-50 border-b border-gray-200 text-gray-600">
                                        <th class="py-2 w-16">학생</th>
                                        <th class="py-2 w-16">분류</th>
                                        <th class="py-2 text-left pl-2">과정</th>
                                        <th class="py-2 w-24">일자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">김진수</td>
                                        <td class="py-2 text-center">일반</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">[토,일 주말반] 3D프린터운용기능사...</td>
                                        <td class="py-2 text-center text-gray-400">2025-11-29</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">유동현</td>
                                        <td class="py-2 text-center">일반</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">[토,일 주말반] 3D프린터운용기능사...</td>
                                        <td class="py-2 text-center text-gray-400">2025-11-29</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">강경민</td>
                                        <td class="py-2 text-center">중도탈락</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">[토요반] Fusion 활용 3D모델...</td>
                                        <td class="py-2 text-center text-gray-400">2025-11-01</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">소승혜</td>
                                        <td class="py-2 text-center">중도탈락</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">[토요반] Fusion 활용 3D모델...</td>
                                        <td class="py-2 text-center text-gray-400">2025-11-01</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 수료생 취업관리 -->
                    <div>
                        <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                            <h3 class="text-sm font-bold text-gray-700 border-l-4 border-teal-500 pl-2">수료생 취업관리</h3>
                            <i class="fas fa-chevron-up text-gray-400 cursor-pointer"></i>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-xs">
                                <thead>
                                    <tr class="bg-gray-50 border-b border-gray-200 text-gray-600">
                                        <th class="py-2 w-16">학생</th>
                                        <th class="py-2 w-16">분류</th>
                                        <th class="py-2 text-left pl-2">업체</th>
                                        <th class="py-2 w-24">일자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">이명재</td>
                                        <td class="py-2 text-center">취업</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">(사)대한노인회중랑구지회</td>
                                        <td class="py-2 text-center text-gray-400"></td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">이영애</td>
                                        <td class="py-2 text-center">취업</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">(사)대한노인회중랑구지회</td>
                                        <td class="py-2 text-center text-gray-400"></td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">임태우</td>
                                        <td class="py-2 text-center">취업</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">카케인</td>
                                        <td class="py-2 text-center text-gray-400">2024-04-08</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">유태오</td>
                                        <td class="py-2 text-center">취업</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">카케인</td>
                                        <td class="py-2 text-center text-gray-400">2024-04-08</td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-2 text-center text-blue-600">임태우</td>
                                        <td class="py-2 text-center">취업</td>
                                        <td class="py-2 pl-2 truncate max-w-[150px] text-gray-500">카케인</td>
                                        <td class="py-2 text-center text-gray-400">2024-04-08</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // 사이드바 메뉴 클릭 시 활성화 처리
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // e.preventDefault(); // 링크가 없으므로 필요 없음
                sidebarItems.forEach(si => si.classList.remove('active'));
                item.classList.add('active');
            });
        });
    </script>
</body>
</html>
`;
