
import { footerHtml } from './footer';

import { navigationHtml } from './components/navigation';

export const achievementsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육실적 - 와우쓰리디홍대센터</title>
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
    ${navigationHtml('')}


    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">교육실적</h1>
            <p class="text-xl text-blue-200">와우쓰리디홍대센터의 주요 교육 성과와 현황을 소개합니다.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- 주요 교육 과정 -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
                <i class="fas fa-book-open text-primary-600 mr-3"></i>
                주요 교육 과정 운영
            </h2>
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <h3 class="text-lg font-bold text-blue-800 mb-3">전문가 양성 과정</h3>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                            <span>3D프린팅 전문교강사 자격증 대비반 (연성대학교 치기공과 협력)</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                            <span>3D프린터 및 3D스캐너 활용 3D모델링 실무 과정</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                            <span>3D프린터운용기능사 취득 과정</span>
                        </li>
                    </ul>
                </div>
                <div class="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                    <h3 class="text-lg font-bold text-indigo-800 mb-3">맞춤형 교육</h3>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-indigo-500 mt-1 mr-2"></i>
                            <span>훈련대상의 수준/연령에 따른 맞춤 훈련</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-indigo-500 mt-1 mr-2"></i>
                            <span>온/오프라인 혼합 교육 (Blended Learning)</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-indigo-500 mt-1 mr-2"></i>
                            <span>기업 및 단체 위탁 교육 운영</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 운영 센터 현황 -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
                <i class="fas fa-network-wired text-primary-600 mr-3"></i>
                전국 센터 운영 현황
            </h2>
            <div class="grid md:grid-cols-3 gap-6">
                <!-- 서울 홍대센터 -->
                <!-- 서울 홍대센터 -->
                <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span class="font-bold text-primary-700">서울</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800">홍대 본점</h3>
                    </div>
                    <p class="text-gray-600 text-sm mb-2"><i class="fas fa-phone-alt mr-2 text-gray-400"></i>02-3144-3137</p>
                    <p class="text-gray-600 text-sm mb-2"><i class="fas fa-fax mr-2 text-gray-400"></i>02-6455-3144</p>
                    <p class="text-gray-600 text-sm mb-2"><i class="fas fa-envelope mr-2 text-gray-400"></i>3dcookiehd@naver.com</p>
                    <p class="text-gray-600 text-sm"><i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>서울 마포구 홍익로 123, 와우빌딩 3층</p>
                </div>

                <!-- 경북 구미센터 -->
                <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span class="font-bold text-green-700">경북</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800">구미 센터</h3>
                    </div>
                    <p class="text-gray-600 text-sm mb-2"><i class="fas fa-phone-alt mr-2 text-gray-400"></i>054-464-3137</p>
                    <p class="text-gray-600 text-sm"><i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>경북 구미시 산호대로 253 구미첨단의료기술타워606호</p>
                </div>

                <!-- 전북 전주센터 -->
                <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span class="font-bold text-orange-700">전북</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800">전주 센터</h3>
                    </div>
                    <p class="text-gray-600 text-sm mb-2"><i class="fas fa-phone-alt mr-2 text-gray-400"></i>063-XXX-XXXX</p>
                    <p class="text-gray-600 text-sm"><i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>전북특별자치도 전주시 덕진구 반룡로 109 A동 207호</p>
                </div>
            </div>
        </div>

        <!-- 온라인 교육 플랫폼 -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 text-white">
            <div class="md:flex items-center justify-between">
                <div class="mb-6 md:mb-0">
                    <h2 class="text-2xl font-bold mb-2">온라인 교육 플랫폼</h2>
                    <p class="text-gray-400">시공간의 제약 없는 스마트한 학습 환경을 제공합니다.</p>
                </div>
                <div class="flex gap-4">
                    <a href="http://wow3d.step.or.kr" target="_blank" class="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-bold transition flex items-center">
                        <i class="fas fa-laptop mr-2"></i>
                        STEP 온라인 연수원
                    </a>
                </div>
            </div>
        </div>

    </div>

    <!-- 푸터 -->
    <!-- 푸터 -->
    ${footerHtml()}
</body>
</html>
`;
