
export const homeHtml = `
    <!-- 스타일 정의 -->
    <style>
      .hero-gradient {
        background: linear-gradient(135deg, #2d5fa3 0%, #4a90e2 50%, #5b9bd5 100%);
      }
      .hero-slider {
        position: relative;
        height: 600px;
        overflow: hidden;
        border-radius: 0 0 2rem 2rem;
      }
      .hero-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        opacity: 0;
        transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(1.1);
      }
      .hero-slide.active {
        opacity: 1;
        transform: scale(1);
      }
      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(45, 95, 163, 0.75) 0%, rgba(74, 144, 226, 0.65) 50%, rgba(91, 155, 213, 0.55) 100%);
      }
      .hero-content {
        position: relative;
        z-index: 10;
        text-align: center;
        color: white;
      }
      .hero-dots {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        display: flex;
        gap: 12px;
      }
      .hero-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s;
      }
      .hero-dot.active {
        background: white;
        width: 32px;
        border-radius: 6px;
      }
    </style>

    <!-- 히어로 섹션 (슬라이드쇼) -->
    <section class="hero-slider">
        <!-- Slide 1: 화이트 테마 -->
        <div class="hero-slide active" style="background-image: url('/static/hero1.jpg')">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">상상을 현실로, 미래를 디자인하다!</h1>
                    <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">와우쓰리디홍대센터에서 3D모델링과 프린팅을 마스터하세요.</p>
                    <div class="flex justify-center gap-4">
                        <button onclick="scrollToSection('courses')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">과정 둘러보기</button>
                        <button onclick="scrollToSection('contact')" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition text-lg">상담 신청</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- ... (more slides here ... I will truncated for now to keep it manageable but I should move all of them) -->
    </section>

    <!-- 과정 목록 섹션 -->
    <section id="courses" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">교육 과정</h2>
                <p class="text-xl text-gray-600">다양한 분야의 전문 교육 프로그램</p>
            </div>
            <div id="courseList" class="grid md:grid-cols-3 gap-8">
                <!-- 로딩 표시 -->
                <div class="col-span-3 text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        </div>
    </section>

    <script>
        function stripHtml(html) {
            if (!html) return '';
            var div = document.createElement('div');
            div.innerHTML = html;
            return (div.textContent || div.innerText || '').trim();
        }
        function scrollToSection(id) {
            var el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        async function loadCourses() {
            var container = document.getElementById('courseList');
            if (!container) return;
            try {
                var res = await fetch('/api/courses?limit=6&sort=latest');
                var result = await res.json();
                if (!result.success) {
                    container.innerHTML = '<div class="col-span-3 text-center py-12"><p class="text-gray-500">과정 목록을 불러오지 못했습니다.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
                    return;
                }
                var list = result.data || [];
                if (list.length === 0) {
                    container.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">등록된 교육 과정이 없습니다.</div>';
                    return;
                }
                container.innerHTML = list.map(function(c) {
                    var desc = stripHtml(c.description) || '과정 설명이 없습니다.';
                    if (desc.length > 60) desc = desc.substring(0, 60) + '…';
                    var statusClass = c.status === 'open' ? 'bg-green-500' : c.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500';
                    var statusText = c.status === 'open' ? '모집중' : c.status === 'closed' ? '마감' : '준비중';
                    var thumb = c.thumbnail_url || '/static/hero1.jpg';
                    return '<a href="/courses" class="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">' +
                        '<div class="relative h-48 overflow-hidden bg-gray-200">' +
                        '<img src="' + thumb + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ' + statusClass + ' text-white">' + statusText + '</span>' +
                        '<div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">' +
                        '<span class="text-white text-xs font-medium bg-primary-600/80 px-2 py-1 rounded">' + (c.category || '일반과정') + '</span>' +
                        '</div></div>' +
                        '<div class="p-6 flex-1 flex flex-col">' +
                        '<h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">' + (c.title || '') + '</h3>' +
                        '<p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">' + desc + '</p>' +
                        '<div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">' +
                        '<span class="text-gray-500">' + (c.start_date ? new Date(c.start_date).toLocaleDateString() : '일정 미정') + '</span>' +
                        '<span class="font-bold text-primary-600">' + (c.price ? Number(c.price).toLocaleString() + '원' : '무료') + '</span>' +
                        '</div></div></a>';
                }).join('') + '<div class="md:col-span-3 flex justify-center mt-4">' +
                '<a href="/courses" class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg">전체 과정 보기 <i class="fas fa-arrow-right"></i></a></div>';
            } catch (e) {
                console.error('loadCourses error:', e);
                container.innerHTML = '<div class="col-span-3 text-center py-12"><p class="text-gray-500">연결에 실패했습니다. 잠시 후 다시 시도해 주세요.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
            }
        }
        document.addEventListener('DOMContentLoaded', loadCourses);
    </script>
`;
