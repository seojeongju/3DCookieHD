
import { footerHtml } from './footer';

import { navigationHtml } from './components/navigation';

/** 옵션: kakaoMapAppKey 있으면 지도 표시 (Cloudflare Pages에서는 Secrets에 KAKAO_MAP_APPKEY 설정) */
export function locationsHtml(options?: { kakaoMapAppKey?: string; initialTab?: 'hongdae' | 'gumi' | 'jeonju' }) {
    const appKey = (options && options.kakaoMapAppKey) ? options.kakaoMapAppKey : '';
    const initialTab = options?.initialTab || 'hongdae';
    const campusCopy = {
        hongdae: {
            title: '홍대 3D프린팅 학원 오시는 길',
            lead: '서울 마포 상수역 인근 와우쓰리디홍대센터에서 3D프린팅 국비지원·내일배움카드·기능사 교육을 운영합니다.',
            faqs: [
                { q: '홍대에서 3D프린팅을 배울 수 있는 곳은 어디인가요?', a: '서울 마포구 독막로 93 4층(상수역 2번 출구) 와우쓰리디홍대센터입니다. 전화 02-3144-3137.' },
                { q: '홍대센터에서 내일배움카드로 수강할 수 있나요?', a: '가능합니다. 국민내일배움카드(국비지원) 3D프린팅·3D모델링 과정을 운영하며, 모집 회차는 교육과정 목록에서 확인하세요.' },
                { q: '3D프린터운용기능사 과정도 홍대에서 하나요?', a: '네. 3D프린터 국가자격증(3D프린터운용기능사) 실기 대비 과정(주말반·평일저녁반)을 홍대센터에서 운영합니다.' },
            ],
        },
        gumi: {
            title: '구미 3D프린팅 학원 오시는 길',
            lead: '경북 구미시 산호대로 와우쓰리디 구미센터에서 3D프린팅 국비지원·실무 교육을 안내합니다.',
            faqs: [
                { q: '구미에서 3D프린팅 교육을 받을 수 있나요?', a: '경북 구미시 산호대로 253 606호 와우쓰리디 구미센터에서 3D프린팅 교육을 운영합니다. 전화 054-464-3137.' },
                { q: '구미센터도 내일배움카드 과정이 있나요?', a: '개설 회차에 따라 국민내일배움카드(국비지원) 과정이 있습니다. 일정은 교육과정 목록과 상담으로 확인하세요.' },
                { q: '구미센터 위치는 어디인가요?', a: '구미첨단의료기술타워 606호(공단동)입니다. 오시는 길 페이지의 구미 탭에서 지도를 확인할 수 있습니다.' },
            ],
        },
        jeonju: {
            title: '전주 3D프린팅 교육 오시는 길',
            lead: '전북 전주시 덕진구 와우쓰리디 전주센터에서 3D프린팅 직업훈련·국비지원 교육을 운영합니다.',
            faqs: [
                { q: '전주에서 3D프린팅을 배울 수 있나요?', a: '전북 전주시 덕진구 반룡로 109 207호 와우쓰리디 전주센터에서 3D프린팅 교육을 운영합니다.' },
                { q: '전주센터도 국비지원이 되나요?', a: '개설 회차에 따라 내일배움카드(국비지원) 적용이 가능합니다. 상담 시 해당 회차 기준으로 안내합니다.' },
                { q: '전주센터 연락처는?', a: '대표 상담 전화 02-3144-3137, 이메일 wow3d16@naver.com으로 문의하시면 전주센터 일정을 안내합니다.' },
            ],
        },
    } as const;
    const copy = campusCopy[initialTab];
    const allFaqs = campusCopy[initialTab].faqs;
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
    const faqCards = allFaqs.map((item, index) => `
        <details class="group rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-black tracking-tight text-slate-900">
                <span><span class="mr-2 text-primary-600">Q${index + 1}.</span>${item.q}</span>
                <i class="fas fa-chevron-down text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i>
            </summary>
            <div class="border-t border-slate-100 px-5 py-4 text-slate-700 leading-7">${item.a}</div>
        </details>`).join('');

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${copy.title} - 와우쓰리디홍대센터</title>
    <meta name="description" content="${copy.lead}">
    <meta name="kakao-map-appkey" content="${appKey.replace(/"/g, '&quot;')}">
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script type="application/ld+json">${JSON.stringify(faqJsonLd).replace(/</g, '\\u003c')}</script>
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
    ${navigationHtml('locations')}


    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-3xl sm:text-4xl font-bold mb-4">${copy.title}</h1>
            <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">${copy.lead}</p>
            <div class="mt-6 flex flex-wrap justify-center gap-2">
                <a href="/course-sessions" class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/25">모집 과정</a>
                <a href="/guides/national-support" class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/25">국비지원</a>
                <a href="/guides/craftsman-license" class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/25">기능사·국가자격</a>
                <a href="/tomorrow-learning-card" class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/25">내일배움카드</a>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <section class="mb-10 space-y-3" aria-label="센터 자주 묻는 질문">
            <h2 class="text-xl font-black tracking-tight text-slate-900 px-1">자주 묻는 질문</h2>
            ${faqCards}
        </section>
        
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
                        <div class="text-center px-4">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">서울 홍대센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2" id="map-hongdae-msg">카카오맵 JavaScript 키를 설정하면 지도가 표시됩니다. (관리자 &gt; 훈련기관 정보설정)</p>
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
                                    <span>서울특별시 마포구 독막로 93 4층 (상수동, 상수빌딩)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>02-3144-3137</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">팩스</span>
                                    <span>02-6455-3144</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d16@naver.com</span>
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
                                        <p><span class="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded mr-1">6호선</span> 상수역 2번 출구 전방 50m</p>
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
                        <div class="text-center px-4">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">경북 구미센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2">카카오맵 JavaScript 키를 설정하면 지도가 표시됩니다.</p>
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
                                    <span>경상북도 구미시 산호대로 253 606호 (공단동, 구미첨단의료기술타워)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>054-464-3137</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d16@naver.com</span>
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
                        <div class="text-center px-4">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500 font-medium">전북 전주센터 지도</p>
                            <p class="text-xs text-gray-400 mt-2">카카오맵 JavaScript 키를 설정하면 지도가 표시됩니다.</p>
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
                                    <span>전북 전주시 덕진구 반룡로 109 207호 (팔복동, 테크노빌 A동)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">전화</span>
                                    <span>02-3144-3137</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-bold w-20 flex-shrink-0">이메일</span>
                                    <span>wow3d16@naver.com</span>
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
            hongdae: { lat: 37.5475, lng: 126.9240, name: '와우쓰리디홍대센터', address: '서울특별시 마포구 독막로 93 4층 (상수동, 상수빌딩)' },
            gumi:     { lat: 36.1194, lng: 128.3442, name: '와우쓰리디구미센터', address: '경상북도 구미시 산호대로 253 606호 (공단동, 구미첨단의료기술타워)' },
            jeonju:   { lat: 35.8242, lng: 127.1480, name: '와우쓰리디전주센터', address: '전북 전주시 덕진구 반룡로 109 207호 (팔복동, 테크노빌 A동)' }
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

        function setPlaceholderMessage(centerId, msg) {
            var ph = document.getElementById('map-' + centerId + '-placeholder');
            if (!ph) return;
            var p = ph.querySelector('p.text-xs');
            if (p) p.textContent = msg;
        }

        function initMap(centerId) {
            if (locationMaps[centerId]) return;
            var el = document.getElementById('map-' + centerId);
            var ph = document.getElementById('map-' + centerId + '-placeholder');
            if (!el || !ph) return;
            var c = CENTERS[centerId];
            if (!c) return;
            var kakao = window.kakao;
            if (!kakao || !kakao.maps) return;
            var container = el;
            var geocoder = kakao.maps.services && new kakao.maps.services.Geocoder();
            if (geocoder) {
                geocoder.addressSearch(c.address, function(result, status) {
                    var coords;
                    if (status === kakao.maps.services.Status.OK && result && result[0]) {
                        coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    } else {
                        coords = new kakao.maps.LatLng(c.lat, c.lng);
                    }
                    var options = { center: coords, level: 3 };
                    var map = new kakao.maps.Map(container, options);
                    var marker = new kakao.maps.Marker({ position: coords });
                    marker.setMap(map);
                    var iw = new kakao.maps.InfoWindow({ content: '<div style="padding:8px 10px;font-size:13px;font-weight:bold;white-space:nowrap;">' + c.name + '</div>' });
                    iw.open(map, marker);
                    locationMaps[centerId] = { map: map, marker: marker };
                    ph.style.display = 'none';
                });
            } else {
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
        }

        (function loadKakaoMap() {
            var meta = document.querySelector('meta[name="kakao-map-appkey"]');
            var appkey = (meta && meta.getAttribute('content')) ? meta.getAttribute('content').trim() : '';
            if (!appkey) return;
            var s = document.createElement('script');
            s.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + encodeURIComponent(appkey) + '&autoload=false&libraries=services';
            s.async = true;
            s.onload = function() {
                if (typeof window.kakao === 'undefined' || !window.kakao.maps) {
                    ['hongdae','gumi','jeonju'].forEach(function(id) { setPlaceholderMessage(id, '지도 로드 실패. JavaScript 키와 카카오 개발자 콘솔의 웹 도메인 설정을 확인해 주세요.'); });
                    return;
                }
                window.kakao.maps.load(function() {
                    initMap(${JSON.stringify(initialTab)});
                });
            };
            s.onerror = function() {
                ['hongdae','gumi','jeonju'].forEach(function(id) { setPlaceholderMessage(id, '지도 스크립트 로드 실패. 앱키와 도메인(카카오 개발자 콘솔)을 확인해 주세요.'); });
            };
            document.head.appendChild(s);
        })();
        switchTab(${JSON.stringify(initialTab)});
    </script>
</body>
</html>
`;
}

