export const scheduleHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시간표 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 (공통) -->
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- 로고 -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="flex flex-col items-start group">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">와우쓰리디홍대센터</span>
                    </a>
                </div>
                <!-- 우측 메뉴 (로그인/회원가입) -->
                <div class="flex items-center space-x-2">
                    <a href="/" class="px-3 py-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition-colors">홈으로</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">교육 시간표</h1>
            <p class="text-xl text-blue-100">와우쓰리디홍대센터의 월별 교육 일정을 확인하세요.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800">2025년 11월 강의 일정</h2>
                <div class="flex gap-2">
                    <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><i class="fas fa-chevron-left"></i> 이전달</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">다음달 <i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <!-- 시간표 예시 (테이블) -->
            <div class="overflow-x-auto">
                <table class="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">시간 / 요일</th>
                            <th class="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 w-1/5">월</th>
                            <th class="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 w-1/5">화</th>
                            <th class="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 w-1/5">수</th>
                            <th class="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 w-1/5">목</th>
                            <th class="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 w-1/5">금</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50">오전 (10:00~13:00)</td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-blue-50 text-blue-800">
                                <div class="font-bold">3D프린터운용기능사</div>
                                <div class="text-xs mt-1">실기 대비반 A</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center"></td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-blue-50 text-blue-800">
                                <div class="font-bold">3D프린터운용기능사</div>
                                <div class="text-xs mt-1">실기 대비반 A</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center"></td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-blue-50 text-blue-800">
                                <div class="font-bold">3D프린터운용기능사</div>
                                <div class="text-xs mt-1">실기 대비반 A</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50">오후 (14:00~17:00)</td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-green-50 text-green-800">
                                <div class="font-bold">Fusion 360 마스터</div>
                                <div class="text-xs mt-1">모델링 기초</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-purple-50 text-purple-800">
                                <div class="font-bold">제품 디자인 포트폴리오</div>
                                <div class="text-xs mt-1">심화 과정</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-green-50 text-green-800">
                                <div class="font-bold">Fusion 360 마스터</div>
                                <div class="text-xs mt-1">모델링 기초</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-purple-50 text-purple-800">
                                <div class="font-bold">제품 디자인 포트폴리오</div>
                                <div class="text-xs mt-1">심화 과정</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-green-50 text-green-800">
                                <div class="font-bold">Fusion 360 마스터</div>
                                <div class="text-xs mt-1">모델링 기초</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50">저녁 (19:00~22:00)</td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-orange-50 text-orange-800">
                                <div class="font-bold">직장인 국비지원</div>
                                <div class="text-xs mt-1">3D프린팅 입문</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center"></td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center bg-orange-50 text-orange-800">
                                <div class="font-bold">직장인 국비지원</div>
                                <div class="text-xs mt-1">3D프린팅 입문</div>
                            </td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center"></td>
                            <td class="border border-gray-200 px-4 py-3 text-sm text-center"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-6 text-center text-gray-500 text-sm">
                * 상기 일정은 센터 사정에 따라 변경될 수 있습니다. 자세한 사항은 상담 문의 바랍니다.
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    <footer class="bg-gray-800 text-white py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
`;
