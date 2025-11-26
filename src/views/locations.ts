export const locationsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오시는길 - 와우쓰리디홍대센터</title>
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
    <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">오시는길</h1>
            <p class="text-xl text-gray-300">와우쓰리디홍대센터로 오시는 길을 안내해 드립니다.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- 지도 영역 (이미지 대체) -->
            <div class="w-full h-96 bg-gray-200 flex items-center justify-center relative">
                <!-- 실제 지도 API 연동 시 이 부분을 교체 -->
                <div class="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                        <p class="text-gray-500 font-medium">지도 API 영역</p>
                        <p class="text-sm text-gray-400">(카카오맵/네이버맵 연동 필요)</p>
                    </div>
                </div>
                <!-- 오버레이 핀 예시 -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-4">
                    <div class="bg-primary-600 text-white px-3 py-1 rounded shadow-lg text-sm font-bold mb-1 whitespace-nowrap">와우쓰리디홍대센터</div>
                    <div class="text-primary-600 text-center text-3xl drop-shadow-md"><i class="fas fa-map-marker-alt"></i></div>
                </div>
            </div>
            
            <div class="p-8">
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-building text-primary-600 mr-2"></i> 주소 및 연락처
                        </h3>
                        <ul class="space-y-4 text-gray-600">
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0">주소</span>
                                <span>서울 마포구 홍익로 123, 와우빌딩 3층 (홍대입구역 9번 출구 도보 5분)</span>
                            </li>
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0">전화</span>
                                <span>02-1234-5678</span>
                            </li>
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                <span>info@wow3d.com</span>
                            </li>
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0">운영시간</span>
                                <span>평일 09:00 ~ 22:00 / 토요일 10:00 ~ 18:00 (일요일 휴무)</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-subway text-primary-600 mr-2"></i> 대중교통 안내
                        </h3>
                        <ul class="space-y-4 text-gray-600">
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0 text-green-600"><i class="fas fa-subway"></i> 지하철</span>
                                <div>
                                    <p><span class="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded mr-1">2호선</span> 홍대입구역 9번 출구 (도보 5분)</p>
                                    <p class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded mr-1">공항철도</span> 홍대입구역 7번 출구 (도보 7분)</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="font-bold w-20 flex-shrink-0 text-blue-600"><i class="fas fa-bus"></i> 버스</span>
                                <div>
                                    <p>홍대입구역 정류장 하차</p>
                                    <p class="text-sm text-gray-500 mt-1">간선: 271, 602, 603, 760 / 지선: 5712, 5714, 6712, 6716</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
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
