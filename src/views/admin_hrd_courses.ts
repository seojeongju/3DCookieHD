
export const adminHrdCoursesHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 과정관리</title>
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
        .course-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s;
        }
        .course-item:hover {
            background-color: #f9fafb;
        }
        .btn-xs {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
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
            <!-- 과정등록 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-globe w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">과정등록</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-subitem">과정분류 관리</a>
                    <a href="#" class="sidebar-subitem active">승인받은과정</a>
                    <a href="#" class="sidebar-subitem">회차별 과정개설</a>
                    <a href="#" class="sidebar-subitem">회차별 과정복사</a>
                </div>
            </div>

            <!-- 수강료매출관리 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-calculator w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">수강료매출관리</span>
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
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">
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
                <p class="text-sm text-gray-500">HOME / MAIN - (과정)</p>
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
                <a href="#" class="text-gray-700 hover:text-blue-600 hover:underline font-medium">[공지] 데이터 유실로 인한 보상 안내</a>
            </div>

            <!-- 2단 레이아웃 컨텐츠 -->
            <div class="flex flex-col lg:flex-row gap-6 h-[calc(100%-200px)]">
                
                <!-- 좌측: 승인과정 목록 -->
                <div class="flex-grow lg:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <div class="p-6 border-b border-gray-200">
                        <h2 class="text-lg font-light text-gray-700 mb-1">승인과정 및 회차별 개설 과정 목록</h2>
                        <p class="text-xs text-gray-500">승인과정을 선택하시면 회차별 개설된 과정을 보실 수 있습니다.</p>
                        
                        <div class="mt-4 flex gap-2">
                            <input type="text" placeholder="승인받은 과정명을 검색해주세요." class="flex-grow border border-gray-300 px-3 py-2 text-sm rounded-sm">
                            <button class="bg-teal-500 text-white px-4 py-2 text-sm rounded-sm hover:bg-teal-600"><i class="fas fa-search mr-1"></i>Search</button>
                        </div>
                    </div>

                    <div class="flex-grow overflow-y-auto">
                        <!-- 과정 아이템 1 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2026]3D프린팅 전문교강사 및 실무과정</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>1 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 2 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2026]스마트 제품개발을 위한 3D프린팅...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>0 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 3 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2026]3D프린터운용기능사 실기 집중문제풀...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>0 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 4 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2026]3D프린터운용기능사 실기대비</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>1 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 5 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2026] 퓨전(Fusion) 활용 3D모델...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>1 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 6 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2025-소상공인전문기술교육] 기초2 : 3...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>4 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 7 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2025-소상공인전문기술교육] 기초1 : 3...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>4 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                        <!-- 과정 아이템 8 -->
                        <div class="course-item">
                            <i class="fas fa-search text-gray-400 mr-3"></i>
                            <span class="text-sm text-gray-700 flex-grow truncate">[2025-소상공인전문기술교육] 심화 : 3D...</span>
                            <div class="flex gap-2 ml-4">
                                <span class="bg-blue-500 text-white btn-xs"><i class="fas fa-arrow-up mr-1"></i>10 회 개설</span>
                                <span class="bg-teal-500 text-white btn-xs"><i class="fas fa-check-square mr-1"></i>NCS정보등록 (0/0)</span>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">교수계획서 설계</button>
                                <button class="border border-gray-300 text-gray-600 btn-xs hover:bg-gray-50">세부교수계획서 설계</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 페이지네이션 -->
                    <div class="p-4 border-t border-gray-200 flex justify-center">
                        <div class="flex gap-1">
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-left"></i></button>
                            <button class="w-8 h-8 border border-teal-500 rounded bg-teal-500 text-white text-xs font-bold">1</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">2</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">3</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">4</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">5</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">6</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">7</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">8</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-right"></i></button>
                        </div>
                    </div>
                </div>

                <!-- 우측: 진행상황 패널 -->
                <div class="lg:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h2 class="text-lg font-light text-gray-700 mb-6 border-b border-gray-200 pb-2">진행상황</h2>
                    
                    <div class="mb-8">
                        <p class="text-sm text-gray-800 font-bold mb-1">등록된 승인받은 과정을 선택하지 않았습니다.</p>
                        <p class="text-xs text-gray-500 mb-4">좌측의 승인과정명을 선택하세요.</p>
                        
                        <button class="w-full bg-teal-500 text-white py-3 rounded-sm hover:bg-teal-600 transition flex items-center justify-center">
                            <i class="fas fa-plus-circle mr-2"></i>승인받은 과정 등록하러가기
                        </button>
                        <p class="text-xs text-gray-400 mt-2 text-center">원하시는 과정이 없을 경우 과정을 등록해주세요!</p>
                    </div>

                    <div class="mb-8">
                        <h3 class="text-sm font-bold text-gray-700 mb-2">NCS 훈련과정 추가정보 등록내역</h3>
                        <div class="text-xs text-gray-500 py-4 border-t border-gray-100">
                            과정이 선택되지 않았습니다.
                        </div>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-gray-700 mb-2">진행상황 체크</h3>
                        <div class="text-xs text-gray-500 py-4 border-t border-gray-100 flex items-center">
                            <i class="fas fa-check mr-2"></i>과정을 선택해주세요
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
