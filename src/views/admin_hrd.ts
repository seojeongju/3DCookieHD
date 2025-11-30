
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
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
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
        .menu-item.active {
            background-color: #14b8a6; /* teal-500 */
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
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-[1800px] mx-auto px-4">
            <div class="flex justify-between items-center h-10 text-xs text-gray-500">
                <div class="flex items-center gap-2">
                    <!-- 로고 영역 (필요시) -->
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
    <nav class="bg-white border-b border-gray-200">
        <div class="max-w-[1800px] mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-light text-gray-800">MAIN</h1>
                    <p class="text-xs text-gray-400">HOME / MAIN - (운영)</p>
                </div>
                <!-- GNB 메뉴는 이미지상으로는 안보이지만, 기존 구조 유지 또는 숨김 처리 -->
                <!-- 여기서는 이미지의 깔끔한 헤더 느낌을 살리기 위해 GNB를 간소화하거나 생략할 수도 있지만, 
                     기능 접근을 위해 우측이나 별도 영역에 배치하는 것이 좋음. 
                     일단 이미지와 동일하게 구성하기 위해 기존 GNB는 주석처리하거나 다른 방식으로 표현 -->
            </div>
        </div>
    </nav>

    <!-- 메인 컨텐츠 -->
    <main class="flex-grow max-w-[1800px] mx-auto px-4 py-6 w-full">
        
        <!-- 검색 바 및 액션 버튼 -->
        <div class="flex flex-col md:flex-row gap-4 mb-4 items-center">
            <!-- 검색 바 -->
            <div class="flex-grow flex items-center bg-white border border-teal-500 h-10 w-full md:w-auto">
                <div class="bg-teal-500 text-white px-4 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap">
                    통합검색
                </div>
                <input type="text" placeholder="검색단어 관련있는 지원자, 학생, 과정, 거래처가 검색됩니다." class="flex-grow px-4 h-full text-sm outline-none w-full">
                <div class="bg-teal-500 text-white px-4 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap border-l border-teal-600">
                    검색기간
                </div>
                <select class="h-full px-2 text-sm outline-none text-gray-600 bg-white border-l border-gray-200 min-w-[100px]">
                    <option>::전체기간::</option>
                    <option>최근 1개월</option>
                    <option>최근 3개월</option>
                    <option>최근 6개월</option>
                    <option>최근 1년</option>
                </select>
                <button class="bg-teal-500 text-white w-10 h-full flex items-center justify-center hover:bg-teal-600 transition">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            <!-- 진행 상황 버튼 -->
            <button class="bg-rose-500 hover:bg-rose-600 text-white px-8 h-10 text-sm font-medium shadow-sm transition whitespace-nowrap w-full md:w-auto rounded-sm">
                진행 상황 한눈에 보기
            </button>
        </div>
        
        <!-- 공지사항 바 -->
        <div class="flex items-center gap-2 mb-8 text-xs border-b border-gray-100 pb-4">
            <span class="bg-teal-500 text-white px-2 py-0.5 rounded-sm text-[10px]">HRDMarket 공지 및 업데이트 안내</span>
            <a href="#" class="text-blue-500 hover:underline">! 안내(공지) hrdmarket 운영 기관 변경 예정</a>
        </div>

        <!-- 모집중인 과정 지원자 현황 -->
        <div class="mb-12">
            <div class="flex items-center gap-3 mb-4">
                <h2 class="text-xl font-medium text-gray-700">모집중인 과정 지원자 현황</h2>
                <div class="flex gap-1">
                    <span class="badge bg-gray-400">모집중인개설 : 6</span>
                    <span class="badge bg-blue-500">신규 지원자 : 0</span>
                    <span class="badge bg-green-500">접수완료 : 0</span>
                    <span class="badge bg-orange-400">결제완료 : 0</span>
                    <span class="badge bg-rose-500">중도탈락 : 1</span>
                </div>
            </div>

            <h3 class="text-sm font-bold text-gray-600 mb-2">최근 지원자 목록</h3>
            <div class="overflow-x-auto bg-white border-t-2 border-gray-200">
                <table class="w-full min-w-[800px]">
                    <thead>
                        <tr class="table-header h-10">
                            <th class="w-24">지원자</th>
                            <th class="w-32">진행상황</th>
                            <th class="w-48">진행메모</th>
                            <th class="text-left pl-4">과정명</th>
                            <th class="w-40">훈련기간</th>
                            <th class="w-32">등록일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-row h-10 text-center">
                            <td>조원근</td>
                            <td>2.온라인수강신청</td>
                            <td class="text-gray-400 text-xs">홈페이지 온라인 수강신청</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline truncate max-w-xs">
                                <span class="text-gray-400 text-xs mr-1">:6 회차 :</span> [소공인전문교육 12회] 기초...
                            </td>
                            <td class="text-xs text-gray-500">2025-12-12 ~ 2025-12-12</td>
                            <td class="text-xs text-gray-500">2025-11-25</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>유서진</td>
                            <td>9.결제완료</td>
                            <td class="text-gray-400 text-xs">2025/10/10 전화상담 및 등록...</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline truncate max-w-xs">
                                <span class="text-gray-400 text-xs mr-1">:5 회차 :</span> [주말반] 3D프린터운용기능사...
                            </td>
                            <td class="text-xs text-gray-500">2025-11-09 ~ 2025-11-16</td>
                            <td class="text-xs text-gray-500">2025-10-11</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>박소희</td>
                            <td>3.온라인상담</td>
                            <td class="text-gray-400 text-xs">2025/09/11 신청확인</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline truncate max-w-xs">
                                <span class="text-gray-400 text-xs mr-1">:4 회차 :</span> [소공인전문교육 10회] 기초...
                            </td>
                            <td class="text-xs text-gray-500">2025-10-12 ~ 2025-10-12</td>
                            <td class="text-xs text-gray-500">2025-09-11</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>맹승호</td>
                            <td>3.온라인상담</td>
                            <td class="text-gray-400 text-xs">2025/09/06 수강신청확인</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline truncate max-w-xs">
                                <span class="text-gray-400 text-xs mr-1">:4 회차 :</span> [소공인전문교육 10회] 기초...
                            </td>
                            <td class="text-xs text-gray-500">2025-10-12 ~ 2025-10-12</td>
                            <td class="text-xs text-gray-500">2025-09-07</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>한승희</td>
                            <td>3.온라인상담</td>
                            <td class="text-gray-400 text-xs">2025/08/28 교육안내문자발송</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline truncate max-w-xs">
                                <span class="text-gray-400 text-xs mr-1">:2 회차 :</span> [2025년 실기특강] 3D프...
                            </td>
                            <td class="text-xs text-gray-500">2025-09-14 ~ 2025-10-26</td>
                            <td class="text-xs text-gray-500">2025-08-28</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 모집중인 과정별 지원 현황 -->
        <div class="mb-12">
            <h3 class="text-sm font-bold text-gray-600 mb-2">모집중인 과정별 지원 현황</h3>
            <div class="overflow-x-auto bg-white border-t-2 border-gray-200">
                <table class="w-full min-w-[1000px]">
                    <thead>
                        <tr class="table-header h-10">
                            <th class="w-16">회차</th>
                            <th class="text-left pl-4">과정</th>
                            <th class="w-40">훈련기간</th>
                            <th class="w-20">신규</th>
                            <th class="w-20">접수완료</th>
                            <th class="w-20">결제완료</th>
                            <th class="w-48">접수불가/중도포기/다른과정희망</th>
                            <th class="w-20">총인원</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-row h-10 text-center">
                            <td>9</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                [소공인전문기술 12월_마감] 심화_월요반 : 3D프린팅&몰드 소상공인 ...
                            </td>
                            <td class="text-xs text-gray-500">2025-12-01 ~ 2025-12-08</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>10</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                [소공인전문기술 12월_마감] 심화_일요반 : 3D프린팅&몰드 소상공인 ...
                            </td>
                            <td class="text-xs text-gray-500">2025-12-07 ~ 2025-12-14</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>6</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                [소공인전문교육 12월_마감] 기초1_금요반_3D프린터 활용 소품제작
                            </td>
                            <td class="text-xs text-gray-500">2025-12-12 ~ 2025-12-12</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>1</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>41</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                국제인증자격시험응시 ACU(Autodesk Certified User) ...
                            </td>
                            <td class="text-xs text-gray-500">2025-12-13 ~ 2025-12-13</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                        <tr class="table-row h-10 text-center">
                            <td>9</td>
                            <td class="text-left pl-4 text-blue-600 cursor-pointer hover:underline">
                                [평일저녁반] 3D프린터운용기능사 실기대비
                            </td>
                            <td class="text-xs text-gray-500">2025-12-16 ~ 2026-01-08</td>
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
            <div class="flex justify-center mt-4 gap-1">
                <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-double-left"></i></button>
                <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-left"></i></button>
                <button class="w-8 h-8 border border-teal-500 rounded bg-teal-500 text-white text-xs font-bold">1</button>
                <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs">2</button>
                <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-right"></i></button>
                <button class="w-8 h-8 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50 text-xs"><i class="fas fa-angle-double-right"></i></button>
            </div>
        </div>
    </main>

    <script>
        // 필요한 스크립트 추가
    </script>
</body>
</html>
`;
