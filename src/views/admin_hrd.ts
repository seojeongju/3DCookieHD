
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
    </style>
</head>
<body class="bg-white min-h-screen flex flex-col font-sans">
    <!-- 상단 유틸리티 바 -->
    <div class="bg-white border-b border-gray-200 z-20 relative">
        <div class="max-w-[1800px] mx-auto px-4">
            <div class="flex justify-between items-center h-10 text-xs text-gray-500">
                <div class="flex items-center gap-2">
                    <!-- 로고 영역 -->
                </div>
                <div class="flex items-center gap-2">
                    <button class="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600 transition">패키지명</button>
                    <button class="bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition">실소패키지 생성</button>
                    <button class="bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600 transition">환불 52일</button>
                    <button class="bg-teal-400 text-white px-2 py-1 rounded hover:bg-teal-500 transition">멘토페이지 바로가기</button>
                    <button class="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500 transition">동영상 메뉴얼 바로가기</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 네비게이션 (GNB) -->
    <nav class="bg-gray-800 text-white z-10 relative">
        <div class="max-w-[1800px] mx-auto px-4">
            <div class="flex items-center h-12 text-sm font-medium overflow-x-auto">
                <a href="#" class="gnb-item active flex items-center justify-center px-6 h-full whitespace-nowrap">운영</a>
                <a href="/admin/hrd/students" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">학생</a>
                <a href="/admin/hrd/courses" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">과정</a>
                <a href="/admin/hrd/personnel" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">인사</a>
                <a href="/admin/hrd/ncs-plan" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가계획</a>
                <a href="/admin/hrd/ncs-exec" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가실행</a>
                <a href="/admin/hrd/ncs-result" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가결과</a>
                <a href="/admin/hrd/evaluation" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">역량평가-설문</a>
                <a href="/" class="gnb-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap ml-auto bg-gray-700">홈페이지</a>
            </div>
        </div>
    </nav>

    <!-- 메인 컨테이너 (사이드바 + 컨텐츠) -->
    <div class="flex flex-grow max-w-[1800px] mx-auto w-full">
        
        <!-- 왼쪽 사이드바 (운영 메뉴 서브메뉴) -->
        <aside class="w-60 bg-slate-800 flex-shrink-0 overflow-y-auto text-white">
            <div class="py-4 px-4 border-b border-slate-700">
                <h2 class="text-lg font-bold">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-1">서정주 님 (정직원)</p>
            </div>

            <nav class="flex flex-col mt-2">
                <!-- 지원자관리 -->
                <div class="sidebar-header hover:bg-slate-700">
                    <div class="flex items-center">
                        <i class="fas fa-user mr-2 w-5 text-center"></i>
                        <span>지원자관리</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 물품 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-box mr-2 w-5 text-center"></i>
                        <span>물품</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 거래처 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-handshake mr-2 w-5 text-center"></i>
                        <span>거래처</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 문자 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-envelope mr-2 w-5 text-center"></i>
                        <span>문자</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 훈련시설 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-building mr-2 w-5 text-center"></i>
                        <span>훈련시설</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 일정 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-calendar-alt mr-2 w-5 text-center"></i>
                        <span>일정</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 기초 데이터 등록 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-upload mr-2 w-5 text-center"></i>
                        <span>기초 데이터 등록</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
                </div>

                <!-- 증빙자료 다운로드 -->
                <div class="sidebar-header hover:bg-slate-700 mt-2">
                    <div class="flex items-center">
                        <i class="fas fa-download mr-2 w-5 text-center"></i>
                        <span>증빙자료 다운로드</span>
                    </div>
                    <i class="fas fa-chevron-right text-xs"></i>
            </nav>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-grow px-6 py-6 w-full overflow-x-hidden bg-gray-50">
            
            <!-- 타이틀 및 브레드크럼 -->
            <div class="mb-4">
                <h1 class="text-2xl font-light text-gray-800 mb-1">MAIN</h1>
                <p class="text-xs text-gray-500">HOME / MAIN - (운영)</p>
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
                <a href="#" class="text-blue-500 hover:underline">[공지] 나누미넷 서버 이전으로 인한 서비스 일시 중단 안내</a>
            </div>

            <!-- 모집중인 과정 지원자 현황 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <div class="flex flex-wrap items-center gap-3 mb-6">
                    <h2 class="text-xl font-light text-gray-700">모집중인 과정 지원자 현황</h2>
                    <div class="flex flex-wrap gap-1">
                        <span class="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">모집중인과정 : 6</span>
                        <span class="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">신규 지원자 : 0</span>
                        <span class="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold">접수완료 : 0</span>
                        <span class="px-2 py-0.5 rounded-full bg-orange-400 text-white text-[10px] font-bold">결제완료 : 0</span>
                        <span class="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">지원취소 : 1</span>
                    </div>
                </div>

                <h3 class="text-xs font-bold text-gray-700 mb-2">최근 지원자 목록</h3>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1000px] text-xs">
                        <thead>
                            <tr class="border-t border-b border-gray-200 bg-gray-50 text-gray-600">
                                <th class="py-2 w-20 font-normal">지원자</th>
                                <th class="py-2 w-32 font-normal">진행상황</th>
                                <th class="py-2 w-48 font-normal">진행메모</th>
                                <th class="py-2 text-left pl-4 font-normal">과정명</th>
                                <th class="py-2 w-40 font-normal">훈련기간</th>
                                <th class="py-2 w-24 font-normal">등록일자</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">조원근</td>
                                <td>2.온라인수강신청</td>
                                <td class="text-gray-400">홈페이지 온라인 수강신청</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline truncate max-w-xs">
                                    <span class="text-gray-400 mr-1">:6 회차 :</span> [소공인전문교육 12회] 기초...
                                </td>
                                <td class="text-gray-400">2025-12-12 ~ 2025-12-12</td>
                                <td class="text-gray-400">2025-11-25</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">유서진</td>
                                <td>9.결제완료</td>
                                <td class="text-gray-400">2025/10/10 전화상담 및 등록...</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline truncate max-w-xs">
                                    <span class="text-gray-400 mr-1">:5 회차 :</span> [주말반] 3D프린터운용기능사...
                                </td>
                                <td class="text-gray-400">2025-11-09 ~ 2025-11-16</td>
                                <td class="text-gray-400">2025-10-11</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">박소희</td>
                                <td>3.온라인상담</td>
                                <td class="text-gray-400">2025/09/11 신청확인</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline truncate max-w-xs">
                                    <span class="text-gray-400 mr-1">:4 회차 :</span> [소공인전문교육 10회] 기초...
                                </td>
                                <td class="text-gray-400">2025-10-12 ~ 2025-10-12</td>
                                <td class="text-gray-400">2025-09-11</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">맹승호</td>
                                <td>3.온라인상담</td>
                                <td class="text-gray-400">2025/09/06 수강신청확인</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline truncate max-w-xs">
                                    <span class="text-gray-400 mr-1">:4 회차 :</span> [소공인전문교육 10회] 기초...
                                </td>
                                <td class="text-gray-400">2025-10-12 ~ 2025-10-12</td>
                                <td class="text-gray-400">2025-09-07</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">한승희</td>
                                <td>3.온라인상담</td>
                                <td class="text-gray-400">2025/08/28 교육안내문자발송</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline truncate max-w-xs">
                                    <span class="text-gray-400 mr-1">:2 회차 :</span> [2025년 실기특강] 3D프...
                                </td>
                                <td class="text-gray-400">2025-09-14 ~ 2025-10-26</td>
                                <td class="text-gray-400">2025-08-28</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 모집중인 과정별 지원 현황 -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 class="text-xs font-bold text-gray-700 mb-2">모집중인 과정별 지원 현황</h3>
                <div class="overflow-x-auto mb-4">
                    <table class="w-full min-w-[1000px] text-xs">
                        <thead>
                            <tr class="border-t border-b border-gray-200 bg-gray-50 text-gray-600">
                                <th class="py-2 w-16 font-normal">회차</th>
                                <th class="py-2 text-left pl-4 font-normal">과정</th>
                                <th class="py-2 w-40 font-normal">훈련기간</th>
                                <th class="py-2 w-16 font-normal">신규</th>
                                <th class="py-2 w-16 font-normal">접수완료</th>
                                <th class="py-2 w-16 font-normal">결제완료</th>
                                <th class="py-2 w-48 font-normal">접수불가/등록포기/다음과정희망</th>
                                <th class="py-2 w-16 font-normal">총인원</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">9</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline">
                                    [소공인전문기술 12월_마감] 심화_월요반 : 3D프린팅&몰드 소상공인 ...
                                </td>
                                <td class="text-gray-400">2025-12-01 ~ 2025-12-08</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">10</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline">
                                    [소공인전문기술 12월_마감] 심화_일요반 : 3D프린팅&몰드 소상공인 ...
                                </td>
                                <td class="text-gray-400">2025-12-07 ~ 2025-12-14</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">6</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline">
                                    [소공인전문교육 12월_마감] 기초1_금요반_3D프린터 활용 소품제작
                                </td>
                                <td class="text-gray-400">2025-12-12 ~ 2025-12-12</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>1</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">41</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline">
                                    국제인증자격시험응시 ACU(Autodesk Certified User) ...
                                </td>
                                <td class="text-gray-400">2025-12-13 ~ 2025-12-13</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 text-center">
                                <td class="py-2">9</td>
                                <td class="text-left pl-4 text-blue-500 cursor-pointer hover:underline">
                                    [평일저녁반] 3D프린터운용기능사 실기대비
                                </td>
                                <td class="text-gray-400">2025-12-16 ~ 2026-01-08</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- 페이지네이션 -->
                <div class="flex justify-end gap-1">
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center"><i class="fas fa-angle-double-left"></i></button>
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center"><i class="fas fa-angle-left"></i></button>
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-600 hover:bg-gray-50 text-xs font-bold">1</button>
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-600 hover:bg-gray-50 text-xs">2</button>
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center"><i class="fas fa-angle-right"></i></button>
                    <button class="w-6 h-6 border border-gray-300 rounded-sm bg-white text-gray-500 hover:bg-gray-50 text-xs flex items-center justify-center"><i class="fas fa-angle-double-right"></i></button>
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
