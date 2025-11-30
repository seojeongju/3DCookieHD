
export const adminHrdEvaluationHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 역량평가-설문</title>
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
        .calendar-header {
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
            font-size: 0.75rem;
            font-weight: 600;
            color: #374151;
            padding: 0.5rem;
        }
        .calendar-cell {
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            height: 100px;
            padding: 0.25rem;
            font-size: 0.75rem;
            color: #6b7280;
            vertical-align: top;
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
            <!-- 평가 및 설문 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-poll-h w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">평가 및 설문</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-subitem">평가 설정</a>
                    <a href="#" class="sidebar-subitem">평가 등록</a>
                    <a href="#" class="sidebar-subitem">교강사 평가</a>
                </div>
            </div>

            <!-- 평가 결과 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-chart-bar w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">평가 결과</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-subitem">지원자평가 결과</a>
                    <a href="#" class="sidebar-subitem">학생평가 결과</a>
                    <a href="#" class="sidebar-subitem">교육사용평가 결과</a>
                </div>
            </div>

            <!-- 평가 통계 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-chart-pie w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">평가 통계</span>
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
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[140px]">
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
                <p class="text-sm text-gray-500">HOME / MAIN - (역량평가-설문)</p>
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
                <a href="#" class="text-gray-700 hover:text-blue-600 hover:underline font-medium">[긴급]시스템 장애로 인한 데이터 유실 안내(완료 및 공지내역 수정)</a>
            </div>

            <!-- 일정 선택 및 목록 (2단 레이아웃) -->
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- 좌측: 일정 선택 -->
                <div class="lg:w-1/4 bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-fit">
                    <h3 class="text-sm font-bold text-gray-700 mb-4">일정 선택</h3>
                    
                    <select class="w-full border border-gray-300 px-2 py-2 text-xs rounded-sm mb-4">
                        <option>:: 개설과정 선택 ::</option>
                    </select>

                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <button class="bg-white border border-gray-300 text-gray-600 py-2 text-xs rounded-sm hover:bg-gray-50">전체일정</button>
                        <button class="bg-teal-400 text-white py-2 text-xs rounded-sm hover:bg-teal-500">일반일정</button>
                        <button class="bg-teal-500 text-white py-2 text-xs rounded-sm hover:bg-teal-600">평가계획</button>
                        <button class="bg-blue-500 text-white py-2 text-xs rounded-sm hover:bg-blue-600">평가진행</button>
                        <button class="bg-orange-400 text-white py-2 text-xs rounded-sm hover:bg-orange-500">사전평가계획</button>
                        <button class="bg-rose-500 text-white py-2 text-xs rounded-sm hover:bg-rose-600">사전평가진행</button>
                    </div>

                    <div class="border-t border-gray-200 pt-4">
                        <h3 class="text-sm font-bold text-gray-700 mb-2">예정 주 훈련 목록</h3>
                        <div class="text-xs text-gray-400 py-4 text-center">
                            목록이 없습니다.
                        </div>
                    </div>
                </div>

                <!-- 우측: 일정 목록 (캘린더) -->
                <div class="lg:w-3/4 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h3 class="text-sm font-bold text-gray-700 mb-4">일정 목록</h3>
                    
                    <div class="flex justify-center items-center gap-2 mb-4">
                        <button class="px-2 py-1 border border-gray-300 rounded text-xs">today</button>
                        <button class="px-2 py-1 border border-gray-300 rounded text-xs"><i class="fas fa-chevron-left"></i></button>
                        <button class="px-2 py-1 border border-gray-300 rounded text-xs"><i class="fas fa-chevron-right"></i></button>
                        <span class="text-lg font-bold text-gray-700">2025년 11월</span>
                        <button class="px-2 py-1 border border-gray-300 rounded text-xs"><i class="fas fa-chevron-right"></i></button>
                        <button class="px-2 py-1 border border-gray-300 rounded text-xs"><i class="fas fa-angle-double-right"></i></button>
                    </div>

                    <div class="border border-gray-200">
                        <!-- 요일 헤더 -->
                        <div class="grid grid-cols-7">
                            <div class="calendar-header text-red-500">Sun</div>
                            <div class="calendar-header">Mon</div>
                            <div class="calendar-header">Tue</div>
                            <div class="calendar-header">Wed</div>
                            <div class="calendar-header">Thu</div>
                            <div class="calendar-header">Fri</div>
                            <div class="calendar-header text-blue-500">Sat</div>
                        </div>
                        
                        <!-- 날짜 그리드 (예시: 11월) -->
                        <div class="grid grid-cols-7 bg-white">
                            <!-- 1주 -->
                            <div class="calendar-cell border-l border-gray-200"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell text-blue-500">1</div>
                            
                            <!-- 2주 -->
                            <div class="calendar-cell border-l border-gray-200 text-red-500">2</div>
                            <div class="calendar-cell">3</div>
                            <div class="calendar-cell">4</div>
                            <div class="calendar-cell">5</div>
                            <div class="calendar-cell">6</div>
                            <div class="calendar-cell">7</div>
                            <div class="calendar-cell text-blue-500">8</div>

                            <!-- 3주 -->
                            <div class="calendar-cell border-l border-gray-200 text-red-500">9</div>
                            <div class="calendar-cell">10</div>
                            <div class="calendar-cell">11</div>
                            <div class="calendar-cell">12</div>
                            <div class="calendar-cell">13</div>
                            <div class="calendar-cell">14</div>
                            <div class="calendar-cell text-blue-500">15</div>

                            <!-- 4주 -->
                            <div class="calendar-cell border-l border-gray-200 text-red-500">16</div>
                            <div class="calendar-cell">17</div>
                            <div class="calendar-cell">18</div>
                            <div class="calendar-cell">19</div>
                            <div class="calendar-cell">20</div>
                            <div class="calendar-cell">21</div>
                            <div class="calendar-cell text-blue-500">22</div>

                            <!-- 5주 -->
                            <div class="calendar-cell border-l border-gray-200 text-red-500">23</div>
                            <div class="calendar-cell">24</div>
                            <div class="calendar-cell">25</div>
                            <div class="calendar-cell">26</div>
                            <div class="calendar-cell">27</div>
                            <div class="calendar-cell">28</div>
                            <div class="calendar-cell text-blue-500">29</div>

                            <!-- 6주 -->
                            <div class="calendar-cell border-l border-gray-200 text-red-500">30</div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
                            <div class="calendar-cell"></div>
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
