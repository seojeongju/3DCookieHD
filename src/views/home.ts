
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
      @media (max-width: 1023px) {
        .hero-slider {
          min-height: min(72vh, 520px);
          height: 64vh;
        }
        .hero-dots {
          bottom: max(12px, env(safe-area-inset-bottom, 12px));
        }
      }
      @media (min-width: 1024px) {
        .hero-slider {
            height: 600px;
            min-height: 0;
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

      .prototype-marquee {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }
      .prototype-marquee-track {
        display: flex;
        align-items: stretch;
        gap: 1rem;
        width: max-content;
        animation: prototypeMarquee 80s linear infinite;
        will-change: transform;
      }
      .prototype-marquee:hover .prototype-marquee-track {
        animation-play-state: paused;
      }
      .prototype-marquee-item {
        width: 210px;
        flex: 0 0 210px;
      }
      .portfolio-marquee {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }
      .portfolio-marquee-track {
        display: flex;
        align-items: stretch;
        gap: 1rem;
        width: max-content;
        animation: portfolioMarquee 90s linear infinite;
        will-change: transform;
      }
      .portfolio-marquee:hover .portfolio-marquee-track {
        animation-play-state: paused;
      }
      .portfolio-marquee-item {
        width: 210px;
        flex: 0 0 210px;
      }
      .education-photo-marquee {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }
      .education-photo-marquee-track {
        display: flex;
        align-items: stretch;
        gap: 1rem;
        width: max-content;
        animation: educationPhotoMarquee 56s linear infinite;
        will-change: transform;
      }
      .education-photo-marquee:hover .education-photo-marquee-track {
        animation-play-state: paused;
      }
      .education-photo-marquee-item {
        width: 210px;
        flex: 0 0 210px;
      }
      .review-marquee {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }
      .review-marquee-track {
        display: flex;
        align-items: stretch;
        gap: 0.75rem;
        width: max-content;
        animation: reviewMarquee 56s linear infinite;
        will-change: transform;
      }
      .review-marquee:hover .review-marquee-track {
        animation-play-state: paused;
      }
      .review-marquee-item {
        width: 460px;
        max-width: min(92vw, 460px);
        flex: 0 0 460px;
      }
      .education-face-mask {
        filter: blur(1.2px) saturate(0.92) contrast(0.96);
      }
      @media (max-width: 1023px) {
        .prototype-marquee-item {
          width: 170px;
          flex-basis: 170px;
        }
        .portfolio-marquee-item {
          width: 170px;
          flex-basis: 170px;
        }
        .education-photo-marquee-item {
          width: 170px;
          flex-basis: 170px;
        }
        .review-marquee-item {
          width: min(90vw, 360px);
          flex-basis: min(90vw, 360px);
        }
      }
      @keyframes prototypeMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 0.5rem)); }
      }
      @keyframes portfolioMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 0.5rem)); }
      }
      @keyframes educationPhotoMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 0.5rem)); }
      }
      @keyframes reviewMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 0.375rem)); }
      }
      @media (prefers-reduced-motion: reduce) {
        .prototype-marquee-track {
          animation: none;
        }
        .portfolio-marquee-track {
          animation: none;
        }
        .education-photo-marquee-track {
          animation: none;
        }
        .review-marquee-track {
          animation: none;
        }
      }
      
      /* 커스텀 스크롤바 (모달 등) */
      .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      @keyframes bounce-in {
        0% { opacity: 0; transform: scale(0.95); }
        70% { opacity: 1; transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    </style>

    <!-- 히어로 섹션 -->
    <section class="hero-slider relative group" aria-label="메인 비주얼">
        <!-- 슬라이드 1 -->
        <div class="hero-slide active" style="background-image: url('/static/hero1.jpg'); background-color: #2d5fa3;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h1 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">상상을 현실로,<br>미래를 디자인하다!</h1>
                        <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">와우쓰리디홍대센터에서<br>3D모델링과 프린팅을 마스터하세요.</p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none animate-fade-in-up delay-200">
                            <a href="/course-sessions" class="bg-primary-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 text-center w-full sm:w-auto min-h-[48px] flex items-center justify-center">과정 둘러보기</a>
                            <a href="/online-consulting" class="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition text-center w-full sm:w-auto min-h-[48px] flex items-center justify-center">상담 신청</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 슬라이드 2 (지연 로드) -->
        <div class="hero-slide" data-bg="/static/hero2.jpg" style="background-color: #4a90e2;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h2 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">실무 중심의<br>전문 교육 솔루션</h2>
                        <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">현장 경험이 풍부한 전문 강사진과 함께<br>진짜 실력을 키우세요.</p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none animate-fade-in-up delay-200">
                            <a href="/course-sessions" class="bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-center w-full sm:w-auto min-h-[48px] flex items-center justify-center">수강 신청하기</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 슬라이드 3 (지연 로드) -->
        <div class="hero-slide" data-bg="/static/hero3.jpg" style="background-color: #5b9bd5;">
            <div class="hero-overlay bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="hero-content absolute inset-0 flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl text-left">
                        <h2 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 drop-shadow-xl leading-tight text-white animate-fade-in-up">취업과 창업의<br>가장 빠른 지름길</h2>
                        <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 drop-shadow-md text-gray-100 animate-fade-in-up delay-100">체계적인 NCS 기반 커리큘럼으로<br>여러분의 꿈을 현실로 만듭니다.</p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none animate-fade-in-up delay-200">
                            <a href="/online-consulting" class="bg-indigo-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg text-center w-full sm:w-auto min-h-[48px] flex items-center justify-center">무료 상담 받기</a>
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
                    <a href="https://wow3d.step.or.kr/main.do" target="_blank" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-teal-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
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
                    <a href="https://wow3dp.co.kr" target="_blank" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-violet-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
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
                    <a href="https://smartstore.naver.com/wow3d" target="_blank" rel="noopener noreferrer" class="group flex items-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-transparent">
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
    <section class="block lg:hidden bg-gray-50 py-5 sm:py-6 px-3 sm:px-4 -mt-6 relative z-30">
        <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
            <a href="https://wow-cbt-webmain.pages.dev/" target="_blank" class="flex flex-col items-center justify-center min-h-[5.75rem] sm:min-h-0 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><i class="fas fa-pen-nib"></i></div>
                <span class="text-xs sm:text-sm font-bold text-gray-800 text-center leading-snug">문제은행(CBT)</span>
            </a>
            <a href="https://wow3d.step.or.kr/main.do" target="_blank" class="flex flex-col items-center justify-center min-h-[5.75rem] sm:min-h-0 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2"><i class="fas fa-laptop-code"></i></div>
                <span class="text-xs sm:text-sm font-bold text-gray-800 text-center leading-snug">STEP 훈련</span>
            </a>
            <a href="https://wow3dp.co.kr" target="_blank" class="flex flex-col items-center justify-center min-h-[5.75rem] sm:min-h-0 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mb-2"><i class="fas fa-robot"></i></div>
                <span class="text-xs sm:text-sm font-bold text-gray-800 text-center break-keep leading-snug">3D프린팅 AI실시간자동견적</span>
            </a>
            <a href="https://smartstore.naver.com/wow3d" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center min-h-[5.75rem] sm:min-h-0 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2"><i class="fas fa-shopping-cart"></i></div>
                <span class="text-xs sm:text-sm font-bold text-gray-800 text-center leading-snug">와우쓰리디 온라인마켓</span>
            </a>
        </div>
    </section>

    <!-- 센터 소개 -->
    <section class="py-12 sm:py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">와우쓰리디홍대센터</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-1">4차산업 3D프린팅 교육 전문 기관으로, 실무 중심의 커리큘럼과 최신 장비로 여러분의 성장을 지원합니다.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 text-center">
                <a href="/course-sessions" class="block p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition shadow-sm hover:shadow-md text-center group">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-200 group-hover:text-primary-700 transition-colors"><i class="fas fa-cube text-2xl"></i></div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-700">3D 모델링·프린팅</h3>
                    <p class="text-gray-600 text-sm">산업용 3D프린터와 전문 소프트웨어로 실무 역량을 키웁니다.</p>
                </a>
                <a href="/tomorrow-learning-card" class="block p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition shadow-sm hover:shadow-md text-center group">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-200 group-hover:text-primary-700 transition-colors"><i class="fas fa-graduation-cap text-2xl"></i></div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-700 leading-snug">내일배움카드 3D프린팅 국비지원</h3>
                    <p class="text-gray-600 text-sm">국민내일배움카드로 3D프린팅·3D모델링을 수강하는 방법을 안내합니다.</p>
                </a>
                <a href="/locations" class="block p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition shadow-sm hover:shadow-md text-center group">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-200 group-hover:text-primary-700 transition-colors"><i class="fas fa-map-marker-alt text-2xl"></i></div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-700">홍대·구미·전주</h3>
                    <p class="text-gray-600 text-sm">전국 3개 센터에서 편리한 위치에서 수강할 수 있습니다.</p>
                </a>
                <details id="homeGuideMenu" class="group rounded-2xl border border-gray-100 bg-gray-50 shadow-sm open:border-primary-200 open:bg-white open:shadow-md transition text-left">
                    <summary class="flex cursor-pointer list-none flex-col items-center p-6 text-center [&::-webkit-details-marker]:hidden">
                        <span class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-open:bg-primary-600 group-open:text-white mb-4">
                            <i class="fas fa-book-open text-2xl"></i>
                        </span>
                        <span class="block text-lg font-bold text-gray-800 mb-2 group-open:text-primary-700">학습 가이드 보기</span>
                        <span class="block text-gray-600 text-sm">국비지원 · 기능사 · 소상공인 · 시제품</span>
                        <span class="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-600" aria-hidden="true">
                            <span class="group-open:hidden">펼치기</span>
                            <span class="hidden group-open:inline">접기</span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform duration-300 group-open:rotate-180"></i>
                        </span>
                    </summary>
                    <div class="border-t border-gray-100 px-4 pb-5 pt-4 sm:px-5">
                        <nav class="grid grid-cols-1 gap-2.5" aria-label="학습 가이드 목록">
                            <a href="/guides/national-support" class="bento-card flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-3.5 hover:border-primary-200 transition">
                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><i class="fas fa-landmark text-sm"></i></span>
                                <span class="min-w-0 text-left">
                                    <span class="block text-sm font-black tracking-tight text-gray-900">국비지원·내일배움카드</span>
                                    <span class="mt-0.5 block text-xs text-gray-500">무료교육 검색·신청 절차</span>
                                </span>
                            </a>
                            <a href="/guides/craftsman-license" class="bento-card flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-3.5 hover:border-primary-200 transition">
                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><i class="fas fa-id-badge text-sm"></i></span>
                                <span class="min-w-0 text-left">
                                    <span class="block text-sm font-black tracking-tight text-gray-900">3D프린터운용기능사</span>
                                    <span class="mt-0.5 block text-xs text-gray-500">국가자격 실기 대비</span>
                                </span>
                            </a>
                            <a href="/guides/small-business" class="bento-card flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-3.5 hover:border-primary-200 transition">
                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><i class="fas fa-store text-sm"></i></span>
                                <span class="min-w-0 text-left">
                                    <span class="block text-sm font-black tracking-tight text-gray-900">소상공인 3D프린팅</span>
                                    <span class="mt-0.5 block text-xs text-gray-500">쿠키틀·몰드 매장용 교육</span>
                                </span>
                            </a>
                            <a href="/guides/prototype" class="bento-card flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-3.5 hover:border-primary-200 transition">
                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><i class="fas fa-drafting-compass text-sm"></i></span>
                                <span class="min-w-0 text-left">
                                    <span class="block text-sm font-black tracking-tight text-gray-900">시제품 제작 교육</span>
                                    <span class="mt-0.5 block text-xs text-gray-500">모델링·출력·후가공</span>
                                </span>
                            </a>
                        </nav>
                    </div>
                </details>
            </div>
        </div>
    </section>

    <!-- 과정 목록 섹션 -->
    <section id="courses" class="py-12 sm:py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">교육 과정</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">다양한 분야의 전문 교육 프로그램</p>
            </div>
            <div id="courseList" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- 로딩 표시 -->
                <div class="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- 교육사진 섹션 (실데이터) -->
    <section id="education-photos" class="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">교육사진</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">생생한 교육 현장과 수업 모습을 소개합니다.</p>
            </div>
            <div id="educationPhotoList" class="education-photo-marquee">
                <div class="flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center px-2">
                <a href="/education-photos?filter=education_photo" class="inline-flex items-center justify-center gap-2 w-full min-[360px]:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-primary-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-primary-700 transition shadow-lg">
                    교육사진 갤러리 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 포트폴리오 섹션 (수강생 작품, /api/portfolios → /portfolios) -->
    <section id="portfolios" class="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">포트폴리오</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">수강생 우수 작품과 프로젝트 결과물을 소개합니다.</p>
            </div>
            <div id="portfolioList" class="portfolio-marquee">
                <div class="flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center px-2">
                <a href="/portfolios" class="inline-flex items-center justify-center gap-2 w-full min-[360px]:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-gray-800 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-gray-900 transition shadow-lg">
                    포트폴리오 갤러리 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 시제품 제작 사진 섹션 (/api/posts?category=prototype → /prototype-gallery) -->
    <section id="prototype-gallery" class="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">시제품 제작 사진</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">3D 프린팅으로 제작한 시제품과 프로젝트 결과물을 소개합니다.</p>
            </div>
            <div id="prototypeList" class="prototype-marquee">
                <div class="flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center px-2">
                <a href="/prototype-gallery" class="inline-flex items-center justify-center gap-2 w-full min-[360px]:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-gray-800 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-gray-900 transition shadow-lg">
                    시제품·작품 더 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 수강후기 (관리자 승인·공개 게시글만, 비로그인 열람) -->
    <section id="reviews" class="py-12 sm:py-16 bg-gradient-to-b from-emerald-50/80 to-white border-t border-emerald-100/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">수강후기</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">승인된 수강생 후기를 누구나 확인할 수 있습니다.</p>
            </div>
            <div id="homeReviewList" class="review-marquee mb-8">
                <div class="flex justify-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
                </div>
            </div>
            <div class="text-center px-2">
                <a href="/reviews" class="inline-flex items-center justify-center gap-2 w-full min-[360px]:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-emerald-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg">
                    수강후기 전체보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 상담 신청 섹션 -->
    <section id="contact" class="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">상담·문의</h2>
                <p class="text-base sm:text-lg md:text-xl text-gray-600">과정 안내, 수강 신청, 시설 견학 등 편하게 문의해 주세요.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                <a href="/online-consulting" class="block p-6 sm:p-8 rounded-2xl bg-primary-50 border-2 border-primary-100 hover:border-primary-300 hover:bg-primary-100 transition text-center min-h-[140px] sm:min-h-0 flex flex-col items-center justify-center active:scale-[0.99]">
                    <i class="fas fa-envelope text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4"></i>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2">온라인 상담 신청</h3>
                    <p class="text-gray-600 text-sm">24시간 접수 가능합니다.</p>
                </a>
                <a href="/locations" class="block p-6 sm:p-8 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-primary-200 hover:bg-gray-100 transition text-center min-h-[140px] sm:min-h-0 flex flex-col items-center justify-center active:scale-[0.99]">
                    <i class="fas fa-map-marker-alt text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4"></i>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2">오시는 길</h3>
                    <p class="text-gray-600 text-sm">홍대·구미·전주 센터 위치 안내</p>
                </a>
            </div>
            <div class="mt-8 sm:mt-10 text-center text-gray-600 px-2">
                <p class="font-medium text-sm sm:text-base leading-relaxed">전화 문의 <a href="tel:02-3144-3137" class="text-primary-600 font-bold hover:underline whitespace-nowrap">02-3144-3137</a> <span class="text-gray-400 hidden sm:inline">/</span><br class="sm:hidden"> <a href="tel:054-464-3137" class="text-primary-600 font-bold hover:underline whitespace-nowrap">054-464-3137</a></p>
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
        function resolveItemFirstImage(item) {
            if (!item) return '';
            if (item.image_url) return String(item.image_url);
            if (item.images && item.images.length) return item.images[0];
            if (typeof item.images === 'string' && item.images.trim().startsWith('[')) {
                try {
                    var arr = JSON.parse(item.images);
                    if (Array.isArray(arr) && arr.length) return arr[0];
                } catch (e) { /* ignore */ }
            }
            if (item.thumbnail_url) return String(item.thumbnail_url);
            if (item.content) {
                var m = String(item.content).match(/<img[^>]+src=["']([^"']+)["']/i);
                if (m && m[1]) return m[1];
            }
            return '';
        }
        function scrollToSection(id) {
            var el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        async function loadHomeData() {
            try {
                var res = await fetch('/api/home');
                var result = await res.json();
                if (!result || !result.success) return null;
                return result.data || null;
            } catch (e) {
                console.error('loadHomeData error:', e);
                return null;
            }
        }
        var currentSlide = 0;
        var slideInterval;
        function ensureHeroSlideImage(slide) {
            if (!slide) return;
            var bg = slide.getAttribute('data-bg');
            if (!bg) return;
            if (slide.getAttribute('data-bg-loaded') === '1') return;
            slide.style.backgroundImage = "url('" + bg.replace(/'/g, "\\'") + "')";
            slide.setAttribute('data-bg-loaded', '1');
        }
        function setSlide(index) {
            var slides = document.querySelectorAll('.hero-slide');
            var dots = document.querySelectorAll('.hero-dot');
            if (!slides.length) return;
            
            // Wrap index
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            
            currentSlide = index;
            
            slides.forEach(function(slide, i) {
                if (i === index) {
                    ensureHeroSlideImage(slide);
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            var nextSlide = slides[(index + 1) % slides.length];
            ensureHeroSlideImage(nextSlide);
            
            dots.forEach(function(dot, i) {
                if (i === index) dot.classList.add('active');
                else dot.classList.remove('active');
            });
            
            // Reset interval
            clearInterval(slideInterval);
            slideInterval = setInterval(function() { setSlide(currentSlide + 1); }, 5000);
        }
        
        async function loadCourses(prefetchedList) {
            var container = document.getElementById('courseList');
            if (!container) return;
            try {
                var list = Array.isArray(prefetchedList) ? prefetchedList : null;
                if (!list) {
                    var res = await fetch('/api/course-sessions/public?limit=8&page=1');
                    var result = await res.json();
                    if (!result.success) {
                        container.innerHTML = '<div class="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12"><p class="text-gray-500">과정 목록을 불러오지 못했습니다.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
                        return;
                    }
                    list = result.data || [];
                }
                if (list.length === 0) {
                    container.innerHTML = '<div class="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12 text-gray-500">등록된 교육 과정이 없습니다.<br><span class="text-sm">관리자에서 회차별로 &#8216;홈페이지 등록&#8217;을 한 과정만 여기에 노출됩니다.</span></div>';
                    return;
                }
                function statusText(s) {
                    return { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' }[s] || s;
                }
                container.innerHTML = list.map(function(s) {
                    var imgUrl = ((s.image_url || '').trim() || '/static/hero1.jpg');
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
                        '<img src="' + imgUrl.replace(/"/g, '&quot;') + '" alt="" loading="lazy" decoding="async" class="w-full h-full object-contain group-hover:scale-105 transition duration-500" onerror="this.src=\\'\/static\/hero1.jpg\\'">' +
                        '<span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ' + statusClass + '">' + statusText(s.status) + '</span>' +
                        '<div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">' +
                        '<span class="text-white text-xs font-medium bg-primary-600/80 px-2 py-1 rounded">' + (s.category_name || '과정') + '</span>' +
                        '</div></div>' +
                        '<div class="p-6 flex-1 flex flex-col">' +
                        '<h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">' + nameEsc + '</h3>' +
                        '<p class="text-gray-500 text-sm mb-3">' + (s.session_number ? s.session_number + '회차' : '') + (s.instructor_name ? ' · ' + (s.instructor_name || '').replace(/</g, '&lt;') : '') + '</p>' +
                        '<div class="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500"><i class="far fa-calendar-alt mr-2"></i>' + dateStr + '</div></div></a>';
                }).join('') + '<div class="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center mt-4">' +
                '<a href="/course-sessions" class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg">전체 과정 보기 <i class="fas fa-arrow-right"></i></a></div>';
            } catch (e) {
                console.error('loadCourses error:', e);
                container.innerHTML = '<div class="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12"><p class="text-gray-500">연결에 실패했습니다. 잠시 후 다시 시도해 주세요.</p><button onclick="loadCourses()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">다시 시도</button></div>';
            }
        }
        async function loadPrototypes(prefetchedList) {
            var container = document.getElementById('prototypeList');
            if (!container) return;
            try {
                var list = Array.isArray(prefetchedList) ? prefetchedList.slice() : null;
                if (!list) {
                    var res = await fetch('/api/posts?category=prototype&status=published&limit=12');
                    var result = await res.json();
                    if (!result.success) {
                        container.innerHTML = '<div class="text-center py-12 text-gray-500">시제품 목록을 불러오지 못했습니다.</div>';
                        return;
                    }
                    list = (result.data || []).slice();
                }
                list.sort(function(a, b) {
                    var da = parseContentRegDate(a.content) || a.created_at || 0;
                    var db = parseContentRegDate(b.content) || b.created_at || 0;
                    return new Date(db) - new Date(da);
                });
                var withImage = list.filter(function(p) { return !!resolveItemFirstImage(p); });
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 시제품이 없습니다.</p>' +
                        '<a href="/prototype-gallery" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">시제품 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                var cards = withImage.map(function(p) {
                    var img = resolveItemFirstImage(p);
                    var safeTitle = (p.title || '시제품').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = (p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var rawPlain = (p.excerpt != null && String(p.excerpt).trim() !== '') ? String(p.excerpt) : stripHtml(p.content || '').trim();
                    var contentPlain = rawPlain.length > 80 ? rawPlain.substring(0, 80) + '\u2026' : rawPlain;
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<a href="/prototype-gallery" class="prototype-marquee-item block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + img + '" alt="' + safeTitle + '" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                if (withImage.length === 1) {
                    container.innerHTML = '<div class="flex justify-center">' + cards + '</div>';
                    return;
                }
                container.innerHTML =
                    '<div class="prototype-marquee-track">' +
                    cards +
                    cards +
                    '</div>';
            } catch (e) {
                console.error('loadPrototypes error:', e);
                container.innerHTML = '<div class="text-center py-12 text-gray-500">시제품 목록을 불러오지 못했습니다.</div>';
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

        async function loadPortfolios(prefetchedList) {
            var container = document.getElementById('portfolioList');
            if (!container) return;
            try {
                var list = Array.isArray(prefetchedList) ? prefetchedList : null;
                if (!list) {
                    // 통합된 /api/portfolios 엔드포인트 사용 (student_portfolios + posts 통합본)
                    var res = await fetch('/api/portfolios?limit=12');
                    var result = await res.json();
                    if (!result.success) {
                        container.innerHTML = '<div class="text-center py-12 text-gray-500">포트폴리오 목록을 불러오지 못했습니다.</div>';
                        return;
                    }
                    list = result.data || [];
                }
                
                var withImage = list.filter(function(p) { return !!p.thumbnail_url; });
                
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 포트폴리오가 없습니다.</p>' +
                        '<a href="/portfolios" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">포트폴리오 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                
                var cards = withImage.map(function(p) {
                    var safeTitle = (p.title || '포트폴리오').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = safeTitle;
                    function portfolioPlainText(html) {
                        if (!html || typeof html !== 'string') return '';
                        return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                    var rawPlain = (p.description_plain != null && String(p.description_plain).trim() !== '')
                        ? String(p.description_plain)
                        : portfolioPlainText(p.description || '');
                    var contentPlain = rawPlain.length > 80 ? rawPlain.substring(0, 80) + '\u2026' : rawPlain;
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var authorEsc = (p.student_name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    
                    return '<a href="/portfolios" class="portfolio-marquee-item block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + p.thumbnail_url + '" alt="' + safeTitle + '" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (authorEsc ? '<p class="text-xs text-gray-500 mt-0.5 truncate">' + authorEsc + '</p>' : '') +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                if (withImage.length === 1) {
                    container.innerHTML = '<div class="flex justify-center">' + cards + '</div>';
                    return;
                }
                container.innerHTML =
                    '<div class="portfolio-marquee-track">' +
                    cards +
                    cards +
                    '</div>';
            } catch (e) {
                console.error('loadPortfolios error:', e);
                container.innerHTML = '<div class="text-center py-12 text-gray-500">포트폴리오 목록을 불러오지 못했습니다.</div>';
            }
        }
        function maskReviewName(name) {
            if (!name) return '수강생';
            if (name.length <= 2) return name.replace(/.$/, '*');
            return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        }
        function reviewStarsHtml(rating) {
            var n = parseInt(rating, 10) || 0;
            var html = '';
            for (var i = 1; i <= 5; i++) {
                html += i <= n ? '<i class="fas fa-star text-amber-400"></i>' : '<i class="far fa-star text-gray-300"></i>';
            }
            return html;
        }
        async function loadHomeReviews(prefetchedList) {
            var container = document.getElementById('homeReviewList');
            if (!container) return;
            try {
                var list = Array.isArray(prefetchedList) ? prefetchedList : null;
                if (!list) {
                    var res = await fetch('/api/posts?category=review&status=published&limit=12&sort=created_at&order=DESC');
                    var result = await res.json();
                    if (!result.success) {
                        container.innerHTML = '<div class="text-center py-12 text-gray-500">수강후기를 불러오지 못했습니다.</div>';
                        return;
                    }
                    list = result.data || [];
                }
                if (list.length === 0) {
                    container.innerHTML = '<div class="text-center py-12 text-gray-500">' +
                        '<p class="mb-4">아직 공개된 수강후기가 없습니다.</p>' +
                        '<a href="/reviews" class="text-emerald-600 font-bold hover:underline">수강후기 페이지</a>에서 확인해 주세요.</div>';
                    return;
                }
                var cards = list.map(function(r) {
                    var titleEsc = (r.title || '수강후기').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var plain = (r.excerpt != null && String(r.excerpt).trim() !== '') ? String(r.excerpt) : stripHtml(r.content || '').trim();
                    var excerpt = plain.length > 92 ? plain.substring(0, 92) + '\u2026' : plain;
                    var excerptEsc = excerpt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var authorEsc = maskReviewName(r.author_name).replace(/</g, '&lt;');
                    var dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '';
                    return '<a href="/reviews" class="review-marquee-item block bg-white rounded-xl border border-emerald-100/80 shadow-sm hover:shadow-md transition px-4 py-3">' +
                        '<div class="flex items-center gap-3 min-w-0">' +
                        '<span class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0"><i class="fas fa-user text-sm"></i></span>' +
                        '<div class="min-w-0 flex-1">' +
                        '<div class="flex items-center gap-2 text-[11px] text-gray-400 mb-1">' +
                        '<span class="font-bold text-gray-700 truncate max-w-[120px]">' + authorEsc + '</span>' +
                        '<span>·</span>' +
                        '<span class="truncate">' + dateStr + '</span>' +
                        '<span>·</span>' +
                        '<span class="text-amber-400">' + reviewStarsHtml(r.rating) + '</span>' +
                        '</div>' +
                        '<p class="text-sm text-gray-700 leading-relaxed truncate"><span class="font-bold text-gray-900 mr-1">' + titleEsc + '</span>' + excerptEsc + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</a>';
                }).join('');
                if (list.length === 1) {
                    container.innerHTML = '<div class="flex justify-center">' + cards + '</div>';
                    return;
                }
                container.innerHTML =
                    '<div class="review-marquee-track">' +
                    cards +
                    cards +
                    '</div>';
                requestAnimationFrame(function() {
                    applyReviewMarqueeConstantSpeed(container);
                });
            } catch (e) {
                console.error('loadHomeReviews error:', e);
                container.innerHTML = '<div class="text-center py-12 text-gray-500">수강후기를 불러오지 못했습니다.</div>';
            }
        }
        function applyReviewMarqueeConstantSpeed(container) {
            if (!container) return;
            var track = container.querySelector('.review-marquee-track');
            if (!track) return;
            var pxPerSec = 36;
            var distance = (track.scrollWidth / 2) + 6;
            var durationSec = distance / pxPerSec;
            if (!Number.isFinite(durationSec) || durationSec <= 0) return;
            track.style.animationDuration = Math.max(20, durationSec).toFixed(2) + 's';
        }
        async function fetchAllEducationPhotoPosts() {
            // 홈 화면은 최신 일부만 사용해 초기 API/파싱 비용을 줄임
            var res = await fetch('/api/posts?category=education_photo&status=published&page=1&limit=24&sort=created_at&order=DESC');
            var result = await res.json();
            if (!result.success) {
                throw new Error(result.error || '교육사진 목록 조회 실패');
            }
            return Array.isArray(result.data) ? result.data : [];
        }

        function applyEducationMarqueeConstantSpeed(container) {
            if (!container) return;
            var track = container.querySelector('.education-photo-marquee-track');
            if (!track) return;
            // 항목 수가 늘어나도 일정한 체감 속도(px/sec)를 유지하도록 폭 기반으로 duration 계산
            var pxPerSec = 20; // 값이 작을수록 더 천천히 이동
            var distance = (track.scrollWidth / 2) + 8; // keyframes의 calc(-50% - 0.5rem)와 대응
            var durationSec = distance / pxPerSec;
            if (!Number.isFinite(durationSec) || durationSec <= 0) return;
            track.style.animationDuration = Math.max(18, durationSec).toFixed(2) + 's';
        }

        async function loadEducationPhotos(prefetchedList) {
            var container = document.getElementById('educationPhotoList');
            if (!container) return;
            try {
                // 전체 공개 교육사진을 조회한 뒤, 사진이 있는 항목만 메인에 노출
                var list = Array.isArray(prefetchedList) ? prefetchedList : await fetchAllEducationPhotoPosts();
                // 1) 사진이 있는 글을 먼저  2) 그 안에서는 최신순 (등록일 또는 created_at)
                list.sort(function(a, b) {
                    var ia = resolveItemFirstImage(a) ? 1 : 0;
                    var ib = resolveItemFirstImage(b) ? 1 : 0;
                    if (ib !== ia) return ib - ia;
                    var da = parseContentRegDate(a.content) || a.created_at || 0;
                    var db = parseContentRegDate(b.content) || b.created_at || 0;
                    return new Date(db) - new Date(da);
                });
                var withImage = list.filter(function(p) { return !!resolveItemFirstImage(p); });
                if (withImage.length === 0) {
                    container.innerHTML = '<div class="text-center py-12">' +
                        '<p class="text-gray-500 mb-6">등록된 교육사진이 없습니다.</p>' +
                        '<a href="/education-photos?filter=education_photo" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-100 text-primary-700 font-bold rounded-xl hover:bg-primary-200 transition">교육사진 갤러리 보기 <i class="fas fa-arrow-right"></i></a></div>';
                    return;
                }
                var cards = withImage.map(function(p) {
                    var img = resolveItemFirstImage(p);
                    var safeTitle = (p.title || '교육사진').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var titleEsc = (p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    var rawPlain = (p.excerpt != null && String(p.excerpt).trim() !== '') ? String(p.excerpt) : stripHtml(p.content || '').trim();
                    var contentPlain = rawPlain.length > 80 ? rawPlain.substring(0, 80) + '\u2026' : rawPlain;
                    var contentEsc = contentPlain.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    return '<a href="/education-photos?filter=education_photo" class="education-photo-marquee-item block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100">' +
                        '<div class="relative aspect-square bg-gray-200 group">' +
                        '<img src="' + img + '" alt="' + safeTitle + '" loading="lazy" decoding="async" class="w-full h-full object-cover education-face-mask group-hover:scale-105 transition duration-500">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">' +
                        '<span class="text-white text-sm font-bold truncate w-full">' + titleEsc + '</span>' +
                        '</div></div>' +
                        '<div class="p-3">' +
                        '<h3 class="font-bold text-gray-800 text-sm truncate">' + titleEsc + '</h3>' +
                        (contentEsc ? '<p class="text-xs text-gray-500 mt-0.5 overflow-hidden" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + contentEsc + '</p>' : '') +
                        '</div></a>';
                }).join('');
                if (withImage.length === 1) {
                    container.innerHTML = '<div class="flex justify-center">' + cards + '</div>';
                    return;
                }
                container.innerHTML =
                    '<div class="education-photo-marquee-track">' +
                    cards +
                    cards +
                    '</div>';
                requestAnimationFrame(function() {
                    applyEducationMarqueeConstantSpeed(container);
                });
            } catch (e) {
                console.error('loadEducationPhotos error:', e);
                container.innerHTML = '<div class="text-center py-12 text-gray-500">교육사진 목록을 불러오지 못했습니다.</div>';
            }
        }
        document.addEventListener('DOMContentLoaded', function() {
            var homeDataPromise = loadHomeData();
            homeDataPromise.then(function(data) {
                loadCourses(data && data.courses);
            }).catch(function() {
                loadCourses();
            });

            lazyLoadSection('education-photos', function() {
                homeDataPromise.then(function(data) {
                    return loadEducationPhotos(data && data.educationPhotos);
                }).catch(function() {
                    return loadEducationPhotos();
                });
            });
            lazyLoadSection('portfolios', function() {
                homeDataPromise.then(function(data) {
                    return loadPortfolios(data && data.portfolios);
                }).catch(function() {
                    return loadPortfolios();
                });
            });
            lazyLoadSection('prototype-gallery', function() {
                homeDataPromise.then(function(data) {
                    return loadPrototypes(data && data.prototypes);
                }).catch(function() {
                    return loadPrototypes();
                });
            });
            lazyLoadSection('reviews', function() {
                homeDataPromise.then(function(data) {
                    return loadHomeReviews(data && data.reviews);
                }).catch(function() {
                    return loadHomeReviews();
                });
            });
            
            // Init Hero Slider
            if (document.querySelector('.hero-slide')) {
                setSlide(0);
            }
        });

        var lazyLoadedSections = {};
        function lazyLoadSection(sectionId, loader) {
            if (!sectionId || typeof loader !== 'function') return;
            var section = document.getElementById(sectionId);
            if (!section) return;
            if (lazyLoadedSections[sectionId]) return;

            function runOnce() {
                if (lazyLoadedSections[sectionId]) return;
                lazyLoadedSections[sectionId] = true;
                loader();
            }

            if (!('IntersectionObserver' in window)) {
                runOnce();
                return;
            }

            var io = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    runOnce();
                    observer.unobserve(entry.target);
                });
            }, { rootMargin: '300px 0px' });

            io.observe(section);
        }
    </script>
`;
