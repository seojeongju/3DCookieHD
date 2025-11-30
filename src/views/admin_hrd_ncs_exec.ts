
export const adminHrdNcsExecHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - NCS 평가실행</title>
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
        .step-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 1.25rem;
            border-radius: 9999px;
            background-color: #f43f5e;
            color: white;
            font-size: 0.65rem;
            font-weight: bold;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <!-- 메인 네비게이션 (GNB) -->
    <nav class="bg-gray-800 text-white z-20 relative h-12 flex-shrink-0">
        <div class="max-w-[1800px] mx-auto px-4 h-full">
            <div class="flex items-center h-full text-sm font-medium overflow-x-auto">
                <a href="/admin/hrd" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">운영</a>
                <a href="/admin/hrd/students" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">학생</a>
                <a href="/admin/hrd/courses" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">과정</a>
                <a href="/admin/hrd/personnel" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">인사</a>
                <a href="/admin/hrd/ncs-plan" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가계획</a>
                <a href="/admin/hrd/ncs-exec" class="gnb-item active flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가실행</a>
                <a href="/admin/hrd/ncs-result" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가결과</a>
                <a href="/admin/hrd/evaluation" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">역량평가-설문</a>
                <a href="/" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap ml-auto bg-gray-700">홈페이지</a>
            </div>
        </div>
    </nav>

    <!-- 상단 유틸리티 바 -->
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

    <!-- 메인 컨테이너 -->
    <div class="flex flex-grow w-full h-[calc(100vh-88px)] overflow-hidden">
        
        <!-- 왼쪽 사이드바 -->
        <aside class="w-60 bg-slate-800 flex-shrink-0 overflow-y-auto text-white">
            <div class="py-4 px-4 border-b border-slate-700">
                <h2 class="text-lg font-bold">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-1">서정주 님 (정직원)</p>
            </div>

            <nav class="flex flex-col mt-2">
                <!-- 사전평가 그룹 -->
                <div class="sidebar-header hover:bg-slate-700">
                    <div class="flex items-center">
                        <i class="fas fa-edit mr-2 w-5 text-center"></i>
                        <span>사전평가</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- NCS훈련성과평가 그룹 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-pen-nib mr-2 w-5 text-center"></i>
                        <span>NCS훈련성과평가</span>
                    </div>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-item active">1차 평가(본평가)</a>
                    <a href="#" class="sidebar-item">2차 평가(재평가)</a>
                    <a href="#" class="sidebar-item">3차 평가(재평가)</a>
                </div>
            </nav>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-grow px-6 py-6 w-full overflow-y-auto bg-gray-50">
            
            <!-- 타이틀 및 브레드크럼 -->
            <div class="mb-4">
                <h1 class="text-2xl font-light text-gray-800 mb-1">MAIN</h1>
                <p class="text-xs text-gray-500">HOME / MAIN - ([NCS] 평가실행)</p>
            </div>

            <!-- 검색 바 및 액션 버튼 -->
            <div class="flex flex-col xl:flex-row gap-4 mb-4 items-start xl:items-center">
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
                    </select>
                    <button class="bg-teal-500 text-white w-12 py-2 flex items-center justify-center hover:bg-teal-600 transition">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

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
                <a href="#" class="text-blue-500 hover:underline">[공지] 데이터 유실로 인한 보상 안내</a>
            </div>

            <!-- [NCS] 평가 실행 목록 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-light text-gray-700">[NCS] 평가 실행 목록</h2>
                </div>
                
                <!-- 안내 박스 -->
                <div class="p-4">
                    <div class="bg-blue-50 border border-blue-100 rounded p-4 mb-4">
                        <h3 class="text-sm font-bold text-blue-800 mb-2">NCS 훈련성과평가 진행방법 <span class="bg-blue-600 text-white px-1 rounded text-[10px] ml-1">사전데이터 등록바로가기</span></h3>
                        <div class="space-y-1 text-xs text-gray-600">
                            <div class="flex items-start">
                                <span class="step-badge">Step1</span>
                                <span>평가에 필요한 사전 데이터를 등록합니다.</span>
                            </div>
                            <div class="flex items-start">
                                <span class="step-badge">Step2</span>
                                <span>하단에 과정을 선택합니다. (승인받은 과정 NCS 정보 1-7번, 회차별 개설 과정 NCS 정보 1번 등록시 노출)</span>
                            </div>
                            <div class="flex items-start">
                                <span class="step-badge">Step3</span>
                                <span>평가 진행에 필요한 필수항목을 등록합니다. (평가일정, 평가도구, 채점기준표, 성취수준 기준표)</span>
                            </div>
                            <div class="flex items-start">
                                <span class="step-badge">Step4</span>
                                <span>필수항목 등록이 완료된 단원(능력단위)은 <span class="bg-gray-200 px-1 rounded text-[10px]">미리보기</span> 버튼을 클릭 하시고 평가진행 메뉴에서 평가 시작일과 종료일을 입력합니다.</span>
                            </div>
                            <div class="flex items-start">
                                <span class="step-badge">Step5</span>
                                <span>학생 학사행정시스템에서 평가 시작일과 종료일 사이에 학생들이 평가 응시가 가능합니다.</span>
                            </div>
                        </div>
                    </div>

                    <div class="text-xs text-rose-500 mb-2">
                        * 승인받은 과정의 NCS 승인 정보 1-7번, 회차별 개설과정의 NCS 개설 정보 1번이 등록된 목록만 출력됩니다.
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <button class="bg-teal-500 text-white px-3 py-1 text-xs rounded-sm">과정선택</button>
                        <select class="border border-gray-300 px-2 py-1 text-xs rounded-sm min-w-[200px]">
                            <option>:: 개설 과정 선택 ::</option>
                        </select>
                    </div>
                </div>
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
