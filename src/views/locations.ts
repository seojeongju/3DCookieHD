
import { footerHtml } from './footer';

import { navigationHtml } from './components/navigation';

/** 옵션: kakaoMapAppKey 있으면 지도 표시 (Cloudflare Pages에서는 Secrets에 KAKAO_MAP_APPKEY 설정) */
export function locationsHtml(options?: { kakaoMapAppKey?: string }) {
    const appKey = (options && options.kakaoMapAppKey) ? options.kakaoMapAppKey : '';
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오시는길 - 와우쓰리디홍대센터</title>
    <meta name="kakao-map-appkey" content="${appKey.replace(/"/g, '&quot;')}">
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
    <style>
        .tab-btn.active {
            background-color: #4a90e2;
            color: white;
            border-color: #4a90e2;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 (공통) -->
    ${navigationHtml('center')}


    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">오시는길</h1>
            <p class="text-xl text-gray-300">전국 와우쓰리디 교육센터로 오시는 길을 안내해 드립니다.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- 탭 메뉴 -->
        <div class="flex justify-center mb-12">
            <div class="inline-flex rounded-md shadow-sm" role="group">
                <button type="button" onclick="switchTab('hongdae')" id="tab-hongdae" class="tab-btn active px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700">
                    서울 홍대센터
                </button>
                <button type="button" onclick="switchTab('gumi')" id="tab-gumi" class="tab-btn px-6 py-3 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700">
                    경북 구미센터
                </button>
                <button type="button" onclick="switchTab('jeonju')" id="tab-jeonju" class="tab-btn px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700">
                    전북 전주센터
                </button>
            </div>
        </div>

        <!-- 홍대센터 컨텐츠 -->
        <div id="content-hongdae" class="center-content">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- 지도 영역 (카카오맵 또는 플레이스홀더) -->
                <div class="relative w-full h-96 bg-gray-200" style="min-height: 24rem;">
                    <div id="map-hongdae" class="absolute inset-0 w-full h-full" style="z-index: 0;"></div>
                    <div id="map-hongdae-placeholder" class="absolute inset-0 flex items-center justify-center bg-gray-200" style="z-index: 1;">
                        <div class="text-center">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">서울 홍대센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2">카카오맵 앱키를 설정하면 지도가 표시됩니다.</p>
                        </div>
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
                                    <span>서울 마포구 독막로 93 상수빌딩 8층 와우쓰리디홍대센터</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>02-332-9010</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">팩스</span>
                                    <span>02-6455-3144</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d@wow3d.co.kr</span>
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
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0 text-blue-600"><i class="fas fa-bus"></i> 버스</span>
                                    <div>
                                        <p>6호선 상수역2번 출구 전방 100m</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 구미센터 컨텐츠 -->
        <div id="content-gumi" class="center-content hidden">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="relative w-full h-96 bg-gray-200" style="min-height: 24rem;">
                    <div id="map-gumi" class="absolute inset-0 w-full h-full" style="z-index: 0;"></div>
                    <div id="map-gumi-placeholder" class="absolute inset-0 flex items-center justify-center bg-gray-200" style="z-index: 1;">
                        <div class="text-center">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">경북 구미센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2">카카오맵 앱키를 설정하면 지도가 표시됩니다.</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-8">
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-building text-green-600 mr-2"></i> 주소 및 연락처
                            </h3>
                            <ul class="space-y-4 text-gray-600">
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">주소</span>
                                    <span>경북 구미시 산호대로 253 구미첨단의료기술타워 606호</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>02-6014-9010</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d@wow3d.co.kr</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-info-circle text-green-600 mr-2"></i> 센터 소개
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                경북 지역의 첨단 의료기술 교육을 선도하는 구미센터입니다. 
                                최신 3D 프린팅 장비와 전문 강사진을 통해 실무 중심의 교육을 제공합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 전주센터 컨텐츠 -->
        <div id="content-jeonju" class="center-content hidden">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="relative w-full h-96 bg-gray-200" style="min-height: 24rem;">
                    <div id="map-jeonju" class="absolute inset-0 w-full h-full" style="z-index: 0;"></div>
                    <div id="map-jeonju-placeholder" class="absolute inset-0 flex items-center justify-center bg-gray-200" style="z-index: 1;">
                        <div class="text-center">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">전북 전주센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2">카카오맵 앱키를 설정하면 지도가 표시됩니다.</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-8">
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-building text-orange-600 mr-2"></i> 주소 및 연락처
                            </h3>
                            <ul class="space-y-4 text-gray-600">
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">주소</span>
                                    <span>전북특별자치도 전주시 덕진구 반룡로 109 벤처지원동 207호</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>02-6015-9010</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d@wow3d.co.kr</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-info-circle text-orange-600 mr-2"></i> 센터 소개
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                전북특별자치도 지역의 3D 프린팅 교육 거점, 전주센터입니다.
                                지역 산업과 연계한 맞춤형 교육 프로그램을 운영하고 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 푸터 -->
    <!-- 푸터 -->
    ${footerHtml()}

    <script>
        var locationMaps = {}; // centerId -> { map, marker }
        var CENTERS = {
            hongdae: { lat: 37.5475, lng: 126.9240, name: '와우쓰리디홍대센터', address: '서울 마포구 독막로 93 상수빌딩 8층' },
            gumi:     { lat: 36.1194, lng: 128.3442, name: '와우쓰리디구미센터', address: '경북 구미시 산호대로 253 구미첨단의료기술타워 606호' },
            jeonju:   { lat: 35.8242, lng: 127.1480, name: '와우쓰리디전주센터', address: '전북특별자치도 전주시 덕진구 반룡로 109 벤처지원동 207호' }
        };

        function switchTab(center) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-primary-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-900');
            });
            const activeBtn = document.getElementById('tab-' + center);
            activeBtn.classList.add('active');
            document.querySelectorAll('.center-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('content-' + center).classList.remove('hidden');
            if (window.kakao && window.kakao.maps && !locationMaps[center]) initMap(center);
            if (locationMaps[center] && locationMaps[center].map) locationMaps[center].map.relayout();
        }

        function initMap(centerId) {
            if (locationMaps[centerId]) return;
            var el = document.getElementById('map-' + centerId);
            var ph = document.getElementById('map-' + centerId + '-placeholder');
            if (!el || !ph) return;
            var c = CENTERS[centerId];
            if (!c) return;
            var container = el;
            var options = { center: new kakao.maps.LatLng(c.lat, c.lng), level: 3 };
            var map = new kakao.maps.Map(container, options);
            var markerPosition = new kakao.maps.LatLng(c.lat, c.lng);
            var marker = new kakao.maps.Marker({ position: markerPosition });
            marker.setMap(map);
            var iw = new kakao.maps.InfoWindow({ content: '<div style="padding:8px 10px;font-size:13px;font-weight:bold;white-space:nowrap;">' + c.name + '</div>' });
            iw.open(map, marker);
            locationMaps[centerId] = { map: map, marker: marker };
            ph.style.display = 'none';
        }

        (function loadKakaoMap() {
            var meta = document.querySelector('meta[name="kakao-map-appkey"]');
            var appkey = (meta && meta.getAttribute('content')) ? meta.getAttribute('content').trim() : '';
            if (!appkey) return;
            var s = document.createElement('script');
            s.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + encodeURIComponent(appkey) + '&autoload=false';
            s.async = true;
            s.onload = function() {
                kakao.maps.load(function() {
                    initMap('hongdae');
                });
            };
            document.head.appendChild(s);
        })();
    </script>
</body>
</html>
`;
}

