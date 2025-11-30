
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
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
              },
              rose: {
                400: '#fb7185',
                500: '#f43f5e',
                600: '#e11d48',
              },
              slate: {
                800: '#1e293b',
                900: '#0f172a',
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
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            color: #94a3b8; /* slate-400 */
            transition: all 0.2s;
        }
        .sidebar-item:hover {
            background-color: #334155; /* slate-700 */
            color: white;
        }
        .sidebar-item.active {
            background-color: #334155;
            color: white;
            border-left: 3px solid #14b8a6; /* teal-500 */
        }
        .sidebar-header {
            padding: 1rem 1.5rem;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
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
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <!-- 메인 네비게이션 (GNB) -->
    <nav class="bg-gray-800 text-white z-20 relative h-12 flex-shrink-0">
        <div class="max-w-[1800px] mx-auto px-4 h-full">
            <div class="flex items-center h-full text-sm font-medium overflow-x-auto">
                <a href="/admin/hrd" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">운영</a>
                <a href="/admin/hrd/students" class="gnb-item active flex items-center justify-center px-6 h-full whitespace-nowrap">학생</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">과정</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">인사</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가계획</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가실행</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가결과</a>
                <a href="#" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">역량평가-설문</a>
                <a href="/" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap ml-auto bg-gray-700">홈페이지</a>
            </div>
        </div>
    </nav>

    <!-- 상단 유틸리티 바 (GNB 아래 배치) -->
    <div class="bg-white border-b border-gray-200 z-10 relative h-10 flex-shrink-0">
        <div class="max-w-[1800px] mx-auto px-4 h-full">
            <div class="flex justify-between items-center h-full text-xs text-gray-500">
                <div class="flex items-center gap-2">
                    <button class="bg-teal-500 text-white px-2 py-0.5 rounded-sm"><i class="fas fa-bars"></i></button>
                </div>
                <div class="flex items-center gap-4">
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-list mr-1"></i>사전등록</a>
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-envelope mr-1"></i>문자발송</a>
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-user-lock mr-1"></i>학생로그인인증</a>
                    <div class="flex items-center gap-1">
                        <i class="fas fa-toggle-off text-lg text-gray-400 cursor-pointer"></i>
                        <span>접속유지</span>
                    </div>
                    <a href="/logout" class="hover:text-gray-800 ml-2"><i class="fas fa-sign-out-alt mr-1"></i>Logout</a>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨테이너 (사이드바 + 컨텐츠) -->
    <div class="flex flex-grow w-full h-[calc(100vh-88px)] overflow-hidden">
        
        <!-- 왼쪽 사이드바 (학생 메뉴 서브메뉴) - 어두운 테마 -->
        <aside class="w-60 bg-slate-800 flex-shrink-0 overflow-y-auto text-white">
            <div class="py-4 px-4 border-b border-slate-700">
                <h2 class="text-lg font-bold">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-1">서정주 님 (정직원)</p>
            </div>

            <nav class="flex flex-col mt-2">
                <!-- 훈련생·수료·취업생 그룹 -->
                <div class="sidebar-header hover:bg-slate-700">
                    <div class="flex items-center">
                        <i class="fas fa-user-graduate mr-2 w-5 text-center"></i>
                        <span>훈련생·수료·취업생</span>
                    </div>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-item active">훈련생</a>
                    <a href="#" class="sidebar-item">수료생</a>
                    <a href="#" class="sidebar-item">중도탈락생</a>
                    <a href="#" class="sidebar-item">학생 이동 복사</a>
                </div>

                <!-- 학생로그인인증 -->
                <a href="#" class="sidebar-item mt-2">
                    <i class="fas fa-key mr-2 w-5 text-center"></i>
                    <span>학생로그인인증</span>
                </a>
            </nav>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-grow px-6 py-6 w-full overflow-y-auto bg-gray-50">
            
            <!-- 타이틀 및 브레드크럼 -->
            <div class="mb-4">
                <h1 class="text-2xl font-light text-gray-800 mb-1">MAIN</h1>
                <p class="text-xs text-gray-500">HOME / MAIN - (학생)</p>
            </div>

            <!-- 검색 바 및 액션 버튼 -->
            <div class="flex flex-col xl:flex-row gap-4 mb-4 items-start xl:items-center">
                <!-- 검색 바 -->
                <div class="flex-grow flex flex-wrap items-center bg-white border border-teal-500 min-h-[40px] w-full xl:w-auto">
                    <div class="bg-teal-500 text-white px-4 py-2 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap">
                        통합검색
                    </div>
                    <input type="text" placeholder="검색단어 관련있는 지원자, 학생, 과정, 거래처가 검색됩니다." class="flex-grow px-4 py-2 text-sm outline-none min-w-[200px]">
                    <div class="bg-teal-500 text-white px-4 py-2 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap border-l border-teal-600">
                        검색기간
                    </div>
                    <select class="px-2 py-2 text-sm outline-none text-gray-600 bg-white border-l border-gray-200 min-w-[100px]">
                        <option>::전체기간::</option>
                        <option>최근 1개월</option>
                        <option>최근 3개월</option>
                        <option>최근 6개월</option>
                        <option>최근 1년</option>
                    </select>
                    <button class="bg-teal-500 text-white w-12 py-2 flex items-center justify-center hover:bg-teal-600 transition">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <!-- 진행 상황 버튼 -->
                <div class="flex items-center gap-2 w-full xl:w-auto">
                    <div class="flex gap-1 text-xs">
                        <button class="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600">패키지명</button>
                        <button class="bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">실소패키지 신청</button>
                        <button class="bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600">장애발생 52일</button>
                        <button class="bg-teal-400 text-white px-2 py-1 rounded hover:bg-teal-500">전송데이터 바로가기</button>
                        <button class="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500">동영상 메뉴얼 바로가기</button>
                    </div>
                    <button class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 h-[42px] text-sm font-medium shadow-sm transition whitespace-nowrap rounded-sm ml-auto xl:ml-0">
                        진행 상황 한눈에 보기
                    </button>
                </div>
            </div>
            
            <!-- 공지사항 바 -->
            <div class="flex items-center gap-2 mb-6 text-xs border-b border-gray-200 pb-4">
                <span class="bg-teal-500 text-white px-2 py-0.5 rounded-sm text-[10px]">HRDMarket 공지 및 업데이트 안내</span>
                <a href="#" class="text-blue-500 hover:underline">[공지] 전송 홈페이지 발송 문자 등 공지사항 확인 요망</a>
            </div>

            <!-- 종합 분류별 현황 -->
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="flex items-center gap-3 mb-4">
                    <h2 class="text-xl font-light text-gray-700">종합 분류별 현황</h2>
                    <div class="flex gap-1">
                        <span class="badge bg-blue-500">진행중인 과정 : 2</span>
                        <span class="badge bg-orange-400">2025 년 수료된 과정 : 37</span>
                    </div>
                </div>

                <!-- 탭 메뉴 -->
                <div class="flex border-b border-gray-200 mb-6">
                    <button class="tab-btn active">훈련생 현황</button>
                    <button class="tab-btn">수료생 현황</button>
                    <select class="ml-2 text-sm border border-gray-300 rounded px-2 py-1">
                        <option>2025 년</option>
                    </select>
                </div>

                <!-- 진행중인 과정 현황 -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-light text-gray-700">진행중인 과정 현황</h3>
                        <div class="flex gap-1">
                            <span class="badge bg-gray-400">진행중인과정 : 2</span>
                            <span class="badge bg-blue-500">총 훈련생 : 15</span>
                            <span class="badge bg-rose-500">중도탈락 : 0</span>
                        </div>
                    </div>
                    <p class="text-xs font-bold text-gray-600 mb-2">진행중인 과정별 훈련생현황</p>
                    
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
                    <div class="flex justify-end mt-2 gap-1">
                        <button class="w-6 h-6 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-left"></i></button>
                        <button class="w-6 h-6 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">1</button>
                        <button class="w-6 h-6 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-right"></i></button>
                    </div>
                </div>

                <!-- 하단 2단 그리드 (훈련생 상담관리 / 수료생 취업관리) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 훈련생 상담관리 -->
                    <div>
                        <div class="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                            <h3 class="text-sm font-bold text-gray-700">훈련생 상담관리</h3>
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
                        <div class="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                            <h3 class="text-sm font-bold text-gray-700">수료생 취업관리</h3>
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
                e.preventDefault();
                sidebarItems.forEach(si => si.classList.remove('active'));
                item.classList.add('active');
            });
        });
    </script>
</body>
</html>
`;
