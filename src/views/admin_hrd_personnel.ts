
export const adminHrdPersonnelHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 인사관리</title>
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
            <!-- 교직원관리 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-user-tie w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">교직원관리</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <a href="#" class="sidebar-subitem active">교직원 관리</a>
                </div>
            </div>

            <!-- 급여 및 퇴직정산 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-money-check-alt w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">급여 및 퇴직정산</span>
                    <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                </div>
            </div>

            <!-- 조직도 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-sitemap w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">조직도</span>
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
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">
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
                <h1 class="text-3xl font-light text-gray-800 mb-2">교직원 관리</h1>
                <p class="text-sm text-gray-500">HOME / 인사 / 교직원관리 / 교직원 관리</p>
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

            <!-- SEARCH & TIP -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer">
                    <h2 class="text-sm font-bold text-gray-700">SEARCH & TIP</h2>
                    <i class="fas fa-chevron-up text-gray-400"></i>
                </div>
                <div class="p-4 bg-gray-50">
                    <div class="flex flex-wrap gap-2 mb-4">
                        <select class="border border-gray-300 px-2 py-1 text-sm rounded-sm text-gray-600">
                            <option>:: 직원명 ::</option>
                        </select>
                        <input type="text" placeholder="직원명" class="border border-gray-300 px-2 py-1 text-sm rounded-sm">
                        <input type="text" placeholder="전화번호" class="border border-gray-300 px-2 py-1 text-sm rounded-sm">
                        <input type="text" placeholder="휴대전화" class="border border-gray-300 px-2 py-1 text-sm rounded-sm">
                        <button class="bg-white border border-gray-300 px-3 py-1 text-sm rounded-sm hover:bg-gray-100">검색</button>
                    </div>
                    <div class="bg-blue-50 border border-blue-100 p-3 rounded text-xs text-blue-800">
                        1. 인사행정 사용자 추가는 최종관리자가 환경설정에서 아이디와 패스워드를 부여할 수 있습니다.
                    </div>
                </div>
            </div>

            <!-- 교직원 관리 테이블 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-sm font-bold text-gray-700">교직원 관리</h2>
                    <i class="fas fa-chevron-up text-gray-400 cursor-pointer"></i>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-xs text-gray-600">
                            Show 
                            <select class="border border-gray-300 rounded px-1 mx-1">
                                <option>15</option>
                            </select>
                            entries
                        </div>
                        <div class="flex gap-1">
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">Copy</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">CSV</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">Excel</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">PDF</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">Print</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">교직원 추가등록</button>
                            <button class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">교직원 목록 다운로드</button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[800px]">
                            <thead>
                                <tr class="table-header h-10">
                                    <th class="w-12">no</th>
                                    <th class="w-16">문자전송</th>
                                    <th class="text-left pl-4">교직원명</th>
                                    <th class="w-24">레벨</th>
                                    <th class="w-32">휴대전화</th>
                                    <th class="w-24">등록일자</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 데이터 로우 (예시) -->
                                <tr class="table-row h-10 text-center">
                                    <td>29</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">강석</td>
                                    <td>계약직 강사</td>
                                    <td>010-9792-3352</td>
                                    <td>2024-08-22</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>28</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">김단아</td>
                                    <td>정직원</td>
                                    <td>010-6644-8156</td>
                                    <td>2024-08-20</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>27</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">현장평가 위원</td>
                                    <td>퇴사</td>
                                    <td>010-0000-0000</td>
                                    <td>2024-08-14</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>26</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">이주진</td>
                                    <td>정직원</td>
                                    <td>010-6300-9730</td>
                                    <td>2024-07-26</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>25</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">장진영</td>
                                    <td>퇴사</td>
                                    <td>010-6802-0007</td>
                                    <td>2023-11-27</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>24</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">오우정</td>
                                    <td>정직원</td>
                                    <td>010-0700-5026</td>
                                    <td>2023-09-27</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>23</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">지민선</td>
                                    <td>정규직 강사</td>
                                    <td>010-2674-2375</td>
                                    <td>2023-05-03</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>22</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">황현석</td>
                                    <td>계약직 강사</td>
                                    <td>010-4820-7186</td>
                                    <td>2023-05-03</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>21</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">심미수</td>
                                    <td>정직원</td>
                                    <td>010-4252-0780</td>
                                    <td>2022-12-19</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>20</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">이기호</td>
                                    <td>퇴사</td>
                                    <td>010-5526-3799</td>
                                    <td>2022-01-07</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>19</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">김시오</td>
                                    <td>퇴사</td>
                                    <td>010-6602-2270</td>
                                    <td>2020-03-10</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>18</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">한지섭</td>
                                    <td>정규직 강사</td>
                                    <td>010-8829-0687</td>
                                    <td>2020-01-29</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>17</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">김시호</td>
                                    <td>퇴사</td>
                                    <td>010-2838-6801</td>
                                    <td>2019-08-08</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>16</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">강성선</td>
                                    <td>퇴사</td>
                                    <td>010-7743-0564</td>
                                    <td>2019-06-11</td>
                                </tr>
                                <tr class="table-row h-10 text-center">
                                    <td>15</td>
                                    <td><i class="far fa-envelope text-gray-400 cursor-pointer hover:text-blue-500"></i></td>
                                    <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">이현수</td>
                                    <td>퇴사</td>
                                    <td>010-4820-9376</td>
                                    <td>2019-06-08</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <div class="flex gap-1">
                            <button class="bg-teal-500 text-white px-3 py-1 text-xs rounded hover:bg-teal-600">교직원 추가등록</button>
                            <button class="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600">교직원 목록 다운로드</button>
                        </div>
                        <div class="flex gap-1">
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">Previous</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">1</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">2</button>
                            <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">Next</button>
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
