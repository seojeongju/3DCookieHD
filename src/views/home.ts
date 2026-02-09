
export const homeHtml = `
    <!-- 스타일 정의 -->
    <style>
      .hero-gradient {
        background: linear-gradient(135deg, #2d5fa3 0%, #4a90e2 50%, #5b9bd5 100%);
      }
      .hero-slider {
        position: relative;
        position: relative;
        overflow: hidden;
        border-radius: 0 0 0 2rem;
        background: linear-gradient(135deg, #2d5fa3 0%, #4a90e2 50%, #5b9bd5 100%);
      }
      @media (min-width: 1024px) {
        .hero-slider {
            height: 600px;
            border-radius: 0 0 2rem 0;
        }
      }
      .hero-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #2d5fa3;
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

    <!-- 히어로 섹션 -->
    <!-- 히어로 섹션 -->
    <section class="hero-slider relative group" aria-label="메인 비주얼">
        <!-- 슬라이드 1 -->
        <div class="hero-slide active" style="background-image: url('/static/hero1.jpg'); background-color: #2d5fa3;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">상상을 현실로,<br>미래를 디자인하다!</h1>
                        <p class="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">와우쓰리디홍대센터에서<br>3D모델링과 프린팅을 마스터하세요.</p>
                        <div class="flex gap-4 animate-fade-in-up delay-200">
                            <a href="/course-sessions" class="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 text-center">과정 둘러보기</a>
                            <a href="/online-consulting" class="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition text-center">상담 신청</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 슬라이드 2 -->
        <div class="hero-slide" style="background-image: url('/static/hero2.jpg'); background-color: #4a90e2;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">실무 중심의<br>전문 교육 솔루션</h1>
                        <p class="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">현장 경험이 풍부한 전문 강사진과 함께<br>진짜 실력을 키우세요.</p>
                        <div class="flex gap-4 animate-fade-in-up delay-200">
                            <a href="/course-sessions" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-center">수강 신청하기</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 슬라이드 3 -->
        <div class="hero-slide" style="background-image: url('/static/hero3.jpg'); background-color: #5b9bd5;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">취업과 창업의<br>가장 빠른 지름길</h1>
                        <p class="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">체계적인 NCS 기반 커리큘럼으로<br>여러분의 꿈을 현실로 만듭니다.</p>
                        <div class="flex gap-4 animate-fade-in-up delay-200">
                            <a href="/online-consulting" class="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg text-center">무료 상담 받기</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PC 버전 우측 고정 퀵 메뉴 (Overlay) -->
        <div class="hidden lg:block absolute inset-0 z-20 pointer-events-none">
            <div class="w-full max-w-[1800px] mx-auto px-4 lg:px-12 h-full flex items-center justify-end">
                <div class="w-[360px] pointer-events-auto flex flex-col gap-3">
                    <!-- Card 1 -->
                    <a href="https://wow-cbt-webmain.pages.dev/" target="_blank" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
                        <div class="w-12 h-12 rounded-lg bg-white/10 text-blue-300 flex items-center justify-center text-xl mr-4 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                            <i class="fas fa-pen-nib"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-white text-lg">문제은행(CBT)</h3>
                            <p class="text-xs text-gray-300 group-hover:text-blue-100">기출문제 완벽 분석</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-white/80"></i>
                    </a>
                    <!-- Card 2 -->
                    <a href="/step" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-teal-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
                        <div class="w-12 h-12 rounded-lg bg-white/10 text-teal-300 flex items-center justify-center text-xl mr-4 group-hover:bg-white group-hover:text-teal-600 transition-colors">
                            <i class="fas fa-laptop-code"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-white text-lg">스마트직업훈련 (STEP)</h3>
                            <p class="text-xs text-gray-300 group-hover:text-teal-100">온라인 이러닝 시스템</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-white/80"></i>
                    </a>
                    <!-- Card 3 -->
                    <a href="/auto-quote" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-violet-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
                        <div class="w-12 h-12 rounded-lg bg-white/10 text-violet-300 flex items-center justify-center text-xl mr-4 group-hover:bg-white group-hover:text-violet-600 transition-colors">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-white text-lg">3D프린팅 AI실시간자동견적</h3>
                            <p class="text-xs text-gray-300 group-hover:text-violet-100">1초 스마트 견적</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-white/80"></i>
                    </a>
                    <!-- Card 4 -->
                    <a href="/shop" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
                        <div class="w-12 h-12 rounded-lg bg-white/10 text-orange-300 flex items-center justify-center text-xl mr-4 group-hover:bg-white group-hover:text-orange-600 transition-colors">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-white text-lg">와우쓰리디 온라인마켓</h3>
                            <p class="text-xs text-gray-300 group-hover:text-orange-100">검증된 장비 스토어</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-white/80"></i>
                    </a>
                </div>
            </div>
        </div>

        <div class="hero-dots">
            <div class="hero-dot active" onclick="setSlide(0)"></div>
            <div class="hero-dot" onclick="setSlide(1)"></div>
            <div class="hero-dot" onclick="setSlide(2)"></div>
        </div>
    </section>

    <!-- 모바일 버전 퀵 메뉴 (슬라이더 하단 노출) -->
    <section class="block lg:hidden bg-gray-50 py-6 px-4 -mt-6 relative z-30">
        <div class="grid grid-cols-2 gap-3">
            <a href="https://wow-cbt-webmain.pages.dev/" target="_blank" class="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><i class="fas fa-pen-nib"></i></div>
                <span class="text-sm font-bold text-gray-800 text-center">문제은행(CBT)</span>
            </a>
            <a href="/step" class="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2"><i class="fas fa-laptop-code"></i></div>
                <span class="text-sm font-bold text-gray-800 text-center">STEP 훈련</span>
            </a>
            <a href="/auto-quote" class="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mb-2"><i class="fas fa-robot"></i></div>
                <span class="text-sm font-bold text-gray-800 text-center break-keep">3D프린팅 AI실시간자동견적</span>
            </a>
            <a href="/shop" class="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2"><i class="fas fa-shopping-cart"></i></div>
                <span class="text-sm font-bold text-gray-800 text-center">와우쓰리디 온라인마켓</span>
            </a>
        </div>
    </section>

    <!-- 센터 소개 -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">와우쓰리디홍대센터</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">4차산업 3D프린팅 교육 전문 기관으로, 실무 중심의 커리큘럼과 최신 장비로 여러분의 성장을 지원합니다.</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center"><i class="fas fa-cube text-2xl"></i></div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">3D 모델링·프린팅</h3>
                    <p class="text-gray-600 text-sm">산업용 3D프린터와 전문 소프트웨어로 실무 역량을 키웁니다.</p>
                </div>
                <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center"><i class="fas fa-graduation-cap text-2xl"></i></div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">국비지원 과정</h3>
                    <p class="text-gray-600 text-sm">맞춤형 국비지원 과정으로 부담 없이 학습할 수 있습니다.</p>
                </div>
                <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center"><i class="fas fa-map-marker-alt text-2xl"></i></div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">홍대·구미·전주</h3>
                    <p class="text-gray-600 text-sm">전국 3개 센터에서 편리한 위치에서 수강할 수 있습니다.</p>
                </div>
            </div>
        </div>
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

    <!-- 교육사진 섹션 (실데이터) -->
    <section id="education-photos" class="py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">교육사진</h2>
                <p class="text-xl text-gray-600">생생한 교육 현장과 수업 모습을 소개합니다.</p>
            </div>
            <div id="educationPhotoList" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="col-span-2 md:col-span-4 flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center">
                <a href="/education-photos?filter=education_photo" class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg">
                    교육사진 갤러리 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 포트폴리오 섹션 (수강생 작품, /api/portfolios → /portfolios) -->
    <section id="portfolios" class="py-16 bg-gray-50 border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">포트폴리오</h2>
                <p class="text-xl text-gray-600">수강생 우수 작품과 프로젝트 결과물을 소개합니다.</p>
            </div>
            <div id="portfolioList" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="col-span-2 md:col-span-4 flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center">
                <a href="/portfolios" class="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition shadow-lg">
                    포트폴리오 갤러리 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 시제품 제작 사진 섹션 (/api/posts?category=prototype → /prototype-gallery) -->
    <section id="prototype-gallery" class="py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">시제품 제작 사진</h2>
                <p class="text-xl text-gray-600">3D 프린팅으로 제작한 시제품과 프로젝트 결과물을 소개합니다.</p>
            </div>
            <div id="prototypeList" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="col-span-2 md:col-span-4 flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center">
                <a href="/prototype-gallery" class="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition shadow-lg">
                    시제품·작품 더 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 상담 신청 섹션 -->
    <section id="contact" class="py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">상담·문의</h2>
                <p class="text-xl text-gray-600">과정 안내, 수강 신청, 시설 견학 등 편하게 문의해 주세요.</p>
            </div>
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <a href="/online-consulting" class="block p-8 rounded-2xl bg-primary-50 border-2 border-primary-100 hover:border-primary-300 hover:bg-primary-100 transition text-center">
                    <i class="fas fa-envelope text-4xl text-primary-600 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">온라인 상담 신청</h3>
                    <p class="text-gray-600 text-sm">24시간 접수 가능합니다.</p>
                </a>
                <a href="/locations" class="block p-8 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-primary-200 hover:bg-gray-100 transition text-center">
                    <i class="fas fa-map-marker-alt text-4xl text-primary-600 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">오시는 길</h3>
                    <p class="text-gray-600 text-sm">홍대·구미·전주 센터 위치 안내</p>
                </a>
            </div>
            <div class="mt-10 text-center text-gray-600">
                <p class="font-medium">전화 문의 <a href="tel:02-3144-3137" class="text-primary-600 font-bold hover:underline">02-3144-3137</a> / <a href="tel:054-464-3137" class="text-primary-600 font-bold hover:underline">054-464-3137</a></p>
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
        var currentSlide = 0;
        var slideInterval;
        function setSlide(index) {
            var slides = document.querySelectorAll('.hero-slide');
            var dots = document.querySelectorAll('.hero-dot');
            if (!slides.length) return;
            
            // Wrap index
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            
            currentSlide = index;
            
            slides.forEach(function(slide, i) {
                if (i === index) slide.classList.add('active');
                else slide.classList.remove('active');
            });
            
            dots.forEach(function(dot, i) {
                if (i === index) dot.classList.add('active');
                else dot.classList.remove('active');
            });
            
            // Reset interval
            clearInterval(slideInterval);
            slideInterval = setInterval(function() { setSlide(currentSlide + 1); }, 5000);
        }
        
        async function loadCourses() {
            var container = document.getElementById('courseList');
            if (!container) return;
            try {
                var res = await fetch('/api/course-sessions/public?limit=6&page=1');
                var result = await res.json();
                if (!result.success) {
                    container.innerHTML = '<div class="col-span-3 text-center py-12"><p class="text-gray-500">과정 목록을 불러오지 못했습니다.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
                    return;
                }
                var list = result.data || [];
                if (list.length === 0) {
                    container.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">등록된 교육 과정이 없습니다.<br><span class="text-sm">관리자에서 회차별로 &#8216;홈페이지 등록&#8217;을 한 과정만 여기에 노출됩니다.</span></div>';
                    return;
                }
                function statusText(s) {
                    return { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' }[s] || s;
                }
                container.innerHTML = list.map(function(s) {
                    var imgUrl = (s.image_url || '').trim() || '/static/hero1.jpg';
                    var start = (s.training_start_date || '').trim();
                    var end = (s.training_end_date || '').trim();
                    var dateStr = start && end ? (new Date(start).toLocaleDateString('ko-KR') + ' ~ ' + new Date(end).toLocaleDateString('ko-KR')) : (start ? new Date(start).toLocaleDateString('ko-KR') + '~' : '일정 미정');
                    var statusClass = s.status === 'recruiting' ? 'bg-green-500' : s.status === 'in_progress' ? 'bg-blue-500' : s.status === 'always_open' ? 'bg-emerald-500' : 'bg-gray-500';
                    // 교육과정명 형식: 승인받은 과정명 + 회차 + 회차별과정명
                    var courseName = (s.course_name || '').trim();
                    var sessionNumber = s.session_number ? (s.session_number + '회차') : '';
                    var sessionName = (s.session_name || '').trim();
                    var displayName = courseName;
                    if (sessionNumber) {
                        displayName += ' + ' + sessionNumber;
                    }
                    if (sessionName) {
                        displayName += ' + ' + sessionName;
                    }
                    var nameEsc = displayName.replace(/</g, '&lt;').replace(/"/g, '&quot;');
                    return '<a href="/course-sessions/' + s.id + '" class="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">' +
                        '<div class="relative h-48 overflow-hidden bg-slate-50 border-b border-gray-50">' +
                        '<img src="' + imgUrl.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-contain group-hover:scale-105 transition duration-500" onerror="this.src=\\'\/static\/hero1.jpg\\'">' +
                        '<span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ' + statusClass + '">' + statusText(s.status) + '</span>' +
                        '<div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">' +
                        '<span class="text-white text-xs font-medium bg-primary-600/80 px-2 py-1 rounded">' + (s.category_name || '과정') + '</span>' +
                        '</div></div>' +
                        '<div class="p-6 flex-1 flex flex-col">' +
                        '<h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">' + nameEsc + '</h3>' +
                        '<p class="text-gray-500 text-sm mb-3">' + (s.session_number ? s.session_number + '회차' : '') + (s.instructor_name ? ' · ' + (s.instructor_name || '').replace(/</g, '&lt;') : '') + '</p>' +
                        '<div class="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500"><i class="far fa-calendar-alt mr-2"></i>' + dateStr + '</div></div></a>';
                }).join('') + '<div class="md:col-span-3 flex justify-center mt-4">' +
                '<a href="/course-sessions" class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg">전체 과정 보기 <i class="fas fa-arrow-right"></i></a></div>';
            } catch (e) {
                console.error('loadCourses error:', e);
                container.innerHTML = '<div class="col-span-3 text-center py-12"><p class="text-gray-500">연결에 실패했습니다. 잠시 후 다시 시도해 주세요.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
            }
        }
        async function loadPrototypes() {
            var container = document.getElementById('prototypeList');
            if (!container) return;
            try {
                var res = await fetch('/api/posts?category=prototype&status=published&limit=20');
                var result = await res.json();
                if (!result.success) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">시제품 목록을 불러오지 못했습니다.</div>';
                    return;
                }
                var list = (result.data || []).slice();
                list.sort(function(a, b) {
                    var da = parseContentRegDate(a.content) || a.created_at || 0;
                    var db = parseContentRegDate(b.content) || b.created_at || 0;
                    return new Date(db) - new Date(da);
                });
                function getFirstImage(p) {
                    var img = (p.images && p.images.length) ? p.images[0] : '';
                    if (!img && p.content) {
                        var m = p.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (m && m[1]) img = m[1];
                    }
                    return img;
                }
                var withImage = list.filter(function(p) { return !!getFirstImage(p); });
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 시제품이 없습니다.</p>' +
                        '<a href="/prototype-gallery" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">시제품 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                var cards = withImage.slice(0, 8).map(function(p) {
                    var img = getFirstImage(p);
                    var safeTitle = (p.title || '시제품').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = (p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var contentPlain = stripHtml(p.content || '').trim().substring(0, 80);
                    if (stripHtml(p.content || '').trim().length > 80) contentPlain += '\u2026';
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<a href="/prototype-gallery" class="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + img + '" alt="' + safeTitle + '" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                container.innerHTML = cards;
            } catch (e) {
                console.error('loadPrototypes error:', e);
                container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">시제품 목록을 불러오지 못했습니다.</div>';
            }
        }
        function parseContentRegDate(content) {
            if (!content) return null;
            var text = typeof content === 'string' ? content.replace(/<[^>]+>/g, ' ') : '';
            var m = text.match(/등록일\\s*[:：]\\s*(\\d{4})[-.](\\d{1,2})[-.](\\d{1,2})/);
            if (!m) return null;
            var y = m[1], mon = m[2].padStart(2, '0'), d = m[3].padStart(2, '0');
            return y + '-' + mon + '-' + d;
        }

        async function loadPortfolios() {
            var container = document.getElementById('portfolioList');
            if (!container) return;
            try {
                var res = await fetch('/api/portfolios');
                var result = await res.json();
                if (!result.success) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">포트폴리오 목록을 불러오지 못했습니다.</div>';
                    return;
                }
                var list = (result.data || []).slice();
                list.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
                function getPortfolioImage(p) {
                    return (p.thumbnail_url || '').trim() || '';
                }
                var withImage = list.filter(function(p) { return !!getPortfolioImage(p); });
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 포트폴리오가 없습니다.</p>' +
                        '<a href="/portfolios" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">포트폴리오 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                var cards = withImage.slice(0, 8).map(function(p) {
                    var img = getPortfolioImage(p);
                    var safeTitle = (p.title || '포트폴리오').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = (p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var contentPlain = stripHtml(p.description || '').trim().substring(0, 80);
                    if (stripHtml(p.description || '').trim().length > 80) contentPlain += '\u2026';
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var studentEsc = (p.student_name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return '<a href="/portfolios" class="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + img + '" alt="' + safeTitle + '" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (studentEsc ? '<p class="text-xs text-gray-500 mt-0.5 truncate">' + studentEsc + '</p>' : '') +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                container.innerHTML = cards;
            } catch (e) {
                console.error('loadPortfolios error:', e);
                container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">포트폴리오 목록을 불러오지 못했습니다.</div>';
            }
        }
        async function loadEducationPhotos() {
            var container = document.getElementById('educationPhotoList');
            if (!container) return;
            try {
                var res = await fetch('/api/posts?category=education_photo&status=published&limit=20');
                var result = await res.json();
                if (!result.success) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">교육사진 목록을 불러오지 못했습니다.</div>';
                    return;
                }
                var list = (result.data || []).slice();
                // 최신순 정렬 (등록일 또는 created_at 기준)
                list.sort(function(a, b) {
                    var da = parseContentRegDate(a.content) || a.created_at || 0;
                    var db = parseContentRegDate(b.content) || b.created_at || 0;
                    return new Date(db) - new Date(da);
                });
                // 사진이 있는 항목만 사용 (사진 없으면 다음 항목으로 밀림)
                function getFirstImage(p) {
                    var img = (p.images && p.images.length) ? p.images[0] : '';
                    if (!img && p.content) {
                        var m = p.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (m && m[1]) img = m[1];
                    }
                    return img;
                }
                var withImage = list.filter(function(p) { return !!getFirstImage(p); });
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 교육사진이 없습니다.</p>' +
                        '<a href="/education-photos?filter=education_photo" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-100 text-primary-700 font-bold rounded-xl hover:bg-primary-200 transition">교육사진 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                var cards = withImage.slice(0, 8).map(function(p) {
                    var img = getFirstImage(p);
                    var safeTitle = (p.title || '교육사진').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = (p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var contentPlain = stripHtml(p.content || '').trim().substring(0, 80);
                    if (stripHtml(p.content || '').trim().length > 80) contentPlain += '\u2026';
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<a href="/education-photos?filter=education_photo" class="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + img + '" alt="' + safeTitle + '" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                container.innerHTML = cards;
            } catch (e) {
                console.error('loadEducationPhotos error:', e);
                container.innerHTML = '<div class="col-span-2 md:col-span-4 text-center py-12 text-gray-500">교육사진 목록을 불러오지 못했습니다.</div>';
            }
        }
        document.addEventListener('DOMContentLoaded', function() {
            loadCourses();
            loadEducationPhotos();
            loadPortfolios();
            loadPrototypes();
            
            // Init Hero Slider
            if (document.querySelector('.hero-slide')) {
                setSlide(0);
            }
        });
    </script>
`;
