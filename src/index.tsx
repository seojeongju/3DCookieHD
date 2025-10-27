import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware, requireAdmin } from './middleware/auth';

// API 라우트 임포트
import auth from './api/auth';
import courses from './api/courses';
import campuses from './api/campuses';
import enrollments from './api/enrollments';
import reviews from './api/reviews';
import posts from './api/posts';
import schedules from './api/schedules';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 글로벌 미들웨어
// ============================================
app.use('*', logger());

// CORS 설정 (API에만 적용)
app.use('/api/*', corsMiddleware);

// ============================================
// 정적 파일 서빙
// ============================================
app.use('/static/*', serveStatic({ root: './public' }));

// ============================================
// API 라우트
// ============================================

// 인증 API (인증 불필요)
app.route('/api/auth', auth);

// 과정 API
app.route('/api/courses', courses);

// 캠퍼스 API
app.route('/api/campuses', campuses);

// 수강 신청 API
app.route('/api/enrollments', enrollments);

// 리뷰 API
app.route('/api/reviews', reviews);

// 게시판 API
app.route('/api/posts', posts);

// 스케줄 API
app.route('/api/schedules', schedules);

// ============================================
// 헬스체크 엔드포인트
// ============================================
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'education-platform-api'
  });
});

// ============================================
// API 정보 엔드포인트
// ============================================
app.get('/api', (c) => {
  return c.json({
    name: 'Education Platform API',
    version: '2.0.0',
    description: '와우쓰리디홍대센터 교육 플랫폼',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (인증 필요)',
        profile: 'PUT /api/auth/profile (인증 필요)',
        changePassword: 'POST /api/auth/change-password (인증 필요)'
      },
      courses: {
        list: 'GET /api/courses',
        detail: 'GET /api/courses/:id',
        create: 'POST /api/courses (관리자 전용)',
        update: 'PUT /api/courses/:id (관리자 전용)',
        delete: 'DELETE /api/courses/:id (관리자 전용)'
      },
      campuses: {
        list: 'GET /api/campuses',
        detail: 'GET /api/campuses/:id',
        regions: 'GET /api/campuses/list/regions'
      },
      enrollments: {
        list: 'GET /api/enrollments (인증 필요)',
        detail: 'GET /api/enrollments/:id (인증 필요)',
        create: 'POST /api/enrollments (인증 필요)',
        updateStatus: 'PUT /api/enrollments/:id/status (관리자 전용)',
        cancel: 'DELETE /api/enrollments/:id (인증 필요)'
      },
      reviews: {
        list: 'GET /api/reviews',
        detail: 'GET /api/reviews/:id',
        create: 'POST /api/reviews (인증 필요)',
        update: 'PUT /api/reviews/:id (인증 필요)',
        delete: 'DELETE /api/reviews/:id (인증 필요)',
        approve: 'PUT /api/reviews/:id/approve (관리자 전용)',
        helpful: 'POST /api/reviews/:id/helpful'
      },
      posts: {
        list: 'GET /api/posts',
        detail: 'GET /api/posts/:id',
        create: 'POST /api/posts (인증 필요)',
        update: 'PUT /api/posts/:id (인증 필요)',
        delete: 'DELETE /api/posts/:id (인증 필요)',
        like: 'POST /api/posts/:id/like',
        createComment: 'POST /api/posts/:id/comments (인증 필요)',
        deleteComment: 'DELETE /api/posts/:post_id/comments/:comment_id (인증 필요)'
      }
    }
  });
});

// ============================================
// 메인 페이지
// ============================================
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>와우쓰리디홍대센터 - 3D 프린팅 교육 전문</title>
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
                    700: '#3b7bc9',
                    800: '#2d5fa3',
                    900: '#1e4175',
                  }
                }
              }
            }
          }
        </script>
        <style>
          .hero-gradient {
            background: linear-gradient(135deg, #2d5fa3 0%, #4a90e2 50%, #5b9bd5 100%);
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
          }
          .hero-slider {
            position: relative;
            height: 600px;
            overflow: hidden;
            cursor: pointer;
          }
          .hero-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out, transform 0.5s ease-out;
            background-size: cover;
            background-position: center;
            transform: scale(1);
          }
          .hero-slide.active {
            opacity: 1;
          }
          .hero-slider:hover .hero-slide.active {
            transform: scale(1.05);
          }
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(45, 95, 163, 0.75) 0%, rgba(74, 144, 226, 0.65) 50%, rgba(91, 155, 213, 0.55) 100%);
            transition: background 0.4s ease;
          }
          .hero-slider:hover .hero-overlay {
            background: linear-gradient(135deg, rgba(45, 95, 163, 0.55) 0%, rgba(74, 144, 226, 0.45) 50%, rgba(91, 155, 213, 0.35) 100%);
          }
          .hero-content {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.4s ease;
          }
          .hero-slider:hover .hero-content {
            transform: translateY(-10px);
          }
          .hero-content h1 {
            transition: all 0.4s ease;
          }
          .hero-slider:hover .hero-content h1 {
            transform: scale(1.05);
            text-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
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
          .hero-dot:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: scale(1.3);
          }
          .hero-dot.active {
            background: white;
            width: 32px;
            border-radius: 6px;
          }
          .hero-slider.paused::after {
            content: '';
            position: absolute;
            bottom: 80px;
            right: 30px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            z-index: 25;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @media (max-height: 700px) {
            .hero-slider {
              height: 500px;
            }
          }
          /* 빠른 메뉴 네비게이션 스타일 */
          .quick-menu-item {
            transition: all 0.3s ease;
          }
          .quick-menu-item:hover {
            transform: translateY(-4px);
          }
          .quick-menu-icon {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .quick-menu-item:hover .quick-menu-icon {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.25);
          }
          .quick-menu-item:active .quick-menu-icon {
            transform: scale(0.95);
          }
          /* 커스텀 스크롤바 */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #5b9bd5;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4a90e2;
          }
          @media (max-width: 1024px) {
            /* 태블릿: 공지사항 숨김 */
            .quick-menu-notice {
              display: none;
            }
          }
          @media (max-width: 768px) {
            /* 모바일: 메뉴만 스크롤 가능 */
            .quick-menu-nav {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .quick-menu-nav::-webkit-scrollbar {
              height: 4px;
            }
            .quick-menu-nav::-webkit-scrollbar-thumb {
              background: #5b9bd5;
              border-radius: 4px;
            }
          }
          /* 갤러리 스크롤바 숨김 */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 네비게이션 -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center space-x-4">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-12">
                        <span class="text-xl font-bold text-gray-800">와우쓰리디홍대센터</span>
                    </div>
                    <div class="hidden md:flex space-x-8">
                        <a href="#courses" class="text-gray-700 hover:text-primary-600 font-medium">과정 안내</a>
                        <a href="#campuses" class="text-gray-700 hover:text-primary-600 font-medium">캠퍼스</a>
                        <a href="#reviews" class="text-gray-700 hover:text-primary-600 font-medium">수강 후기</a>
                        <a href="#board" class="text-gray-700 hover:text-primary-600 font-medium">게시판</a>
                        <a href="#contact" class="text-gray-700 hover:text-primary-600 font-medium">상담 신청</a>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="showLoginModal()" class="text-primary-600 hover:text-primary-700 font-medium px-4 py-2">
                            로그인
                        </button>
                        <button onclick="showRegisterModal()" class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- 히어로 섹션 (슬라이드쇼) -->
        <section class="hero-slider">
            <!-- Slide 1 -->
            <div class="hero-slide active" style="background-image: url('/static/hero1.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            상상을 현실로, 미래를 디자인하다!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            3D쿠키 홍대센터에서 4차 산업혁명의 핵심 기술,<br>
                            3D모델링과 프린팅을 마스터하세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                            <button onclick="scrollToSection('contact')" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition text-lg">
                                상담 신청
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="hero-slide" style="background-image: url('/static/hero2.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            국가자격증 합격의 지름길!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            3D프린터운용기능사, 오토데스크 ACU 등<br>
                            공신력 있는 교육과 자격증 시험을 한 곳에서 준비하세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="hero-slide" style="background-image: url('/static/hero3.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            초보부터 전문가까지, 맞춤 교육!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            국민내일배움카드, 재직자, 일반 등<br>
                            모두를 위한 다양한 과정을 만나보세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4 -->
            <div class="hero-slide" style="background-image: url('/static/hero4.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            당신의 아이디어를 세상에!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            지금 바로 3D쿠키 홍대센터에서<br>
                            혁신적인 3D프린팅 전문가의 여정을 시작하세요!
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('contact')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">
                                상담 신청
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5 -->
            <div class="hero-slide" style="background-image: url('/static/hero5.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            실무 중심의 전문 커리큘럼!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            시제품 제작부터 제품화까지!<br>
                            취업과 창업에 바로 연결되는 실무 교육을 경험하세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation Dots -->
            <div class="hero-dots">
                <div class="hero-dot active" onclick="goToSlide(0)"></div>
                <div class="hero-dot" onclick="goToSlide(1)"></div>
                <div class="hero-dot" onclick="goToSlide(2)"></div>
                <div class="hero-dot" onclick="goToSlide(3)"></div>
                <div class="hero-dot" onclick="goToSlide(4)"></div>
            </div>
        </section>

        <!-- 빠른 메뉴 네비게이션 -->
        <section class="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between gap-6">
                    <!-- 메뉴 아이템들 -->
                    <div class="flex items-center gap-6 flex-shrink-0">
                        <a href="/schedule" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-calendar-alt text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">시간표</span>
                        </a>
                        
                        <a href="#campuses" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-map-marker-alt text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">위치안내</span>
                        </a>
                        
                        <a href="#portfolio" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-image text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">포트폴리오</span>
                        </a>
                        
                        <a href="#reviews" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-pencil-alt text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">수강후기</span>
                        </a>
                        
                        <a href="#board" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-clipboard-list text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">게시판</span>
                        </a>
                        
                        <a href="#search" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-primary-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-700 transition quick-menu-icon">
                                <i class="fas fa-search text-lg text-white"></i>
                            </div>
                            <span class="text-xs font-medium text-primary-600 group-hover:text-primary-700">수강료조회</span>
                        </a>
                    </div>
                    
                    <!-- 공지사항 (오른쪽) -->
                    <div class="hidden lg:flex items-center flex-1 min-w-0 pl-6 border-l border-gray-200 quick-menu-notice">
                        <span class="bg-primary-600 text-white px-3 py-1 rounded text-xs font-bold flex-shrink-0">NOTICE</span>
                        <div class="flex items-center justify-between flex-1 ml-3 min-w-0">
                            <p class="text-sm text-gray-700 truncate">
                                '상상'구조변대학을 등 목적분'우수프리타 산업
                            </p>
                            <button class="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                                <i class="fas fa-chevron-right text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 특징 섹션 -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-graduation-cap text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">국비 지원</h3>
                        <p class="text-gray-600">내일배움카드로 무료 수강</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-laptop-code text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">실무 중심</h3>
                        <p class="text-gray-600">프로젝트 기반 학습</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">소수 정예</h3>
                        <p class="text-gray-600">최대 20명 밀착 관리</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-certificate text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">취업 연계</h3>
                        <p class="text-gray-600">포트폴리오 & 취업 지원</p>
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

                <!-- 필터 -->
                <div class="flex justify-center mb-8 gap-3 flex-wrap">
                    <button onclick="filterCourses('all')" class="filter-btn active px-6 py-2 rounded-full bg-primary-600 text-white font-medium">
                        전체
                    </button>
                    <button onclick="filterCourses('3D프린팅')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-medium hover:bg-primary-50">
                        3D 프린팅
                    </button>
                    <button onclick="filterCourses('메이커')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-medium hover:bg-primary-50">
                        메이커
                    </button>
                    <button onclick="filterCourses('프로그래밍')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-medium hover:bg-primary-50">
                        프로그래밍
                    </button>
                    <button onclick="filterCourses('디자인')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-medium hover:bg-primary-50">
                        디자인
                    </button>
                </div>

                <!-- 과정 카드 목록 -->
                <div id="courseList" class="grid md:grid-cols-3 gap-8">
                    <!-- 로딩 표시 -->
                    <div class="col-span-3 text-center py-12">
                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p class="mt-4 text-gray-600">과정 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 수강후기 & 빠른 수강조회 섹션 -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-2 gap-8">
                    <!-- 수강후기 (왼쪽) -->
                    <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-bold text-gray-800">수강후기</h3>
                            <a href="#reviews" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                더보기 <i class="fas fa-chevron-right ml-1"></i>
                            </a>
                        </div>
                        
                        <!-- 후기 목록 (스크롤) -->
                        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <!-- 후기 아이템 1 -->
                            <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="flex items-center mb-1">
                                            <span class="font-bold text-gray-800 mr-2">김민수</span>
                                            <div class="flex text-yellow-400">
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">3D프린팅 전문가 과정</p>
                                    </div>
                                    <span class="text-xs text-gray-400">2024.10.15</span>
                                </div>
                                <p class="text-sm text-gray-700 line-clamp-3">
                                    강사님께서 정말 친절하게 알려주셔서 3D 프린팅의 기초부터 실무까지 탄탄하게 배울 수 있었습니다. 실습 위주의 수업이라 실제 프로젝트에 바로 적용할 수 있었어요!
                                </p>
                            </div>
                            
                            <!-- 후기 아이템 2 -->
                            <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="flex items-center mb-1">
                                            <span class="font-bold text-gray-800 mr-2">박지영</span>
                                            <div class="flex text-yellow-400">
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">메이커 스타트업 과정</p>
                                    </div>
                                    <span class="text-xs text-gray-400">2024.10.10</span>
                                </div>
                                <p class="text-sm text-gray-700 line-clamp-3">
                                    국비지원으로 부담 없이 수강할 수 있어서 좋았고, 소수 정예라 개인별 맞춤 지도를 받을 수 있었습니다. 포트폴리오 준비에도 큰 도움이 되었어요.
                                </p>
                            </div>
                            
                            <!-- 후기 아이템 3 -->
                            <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="flex items-center mb-1">
                                            <span class="font-bold text-gray-800 mr-2">이준호</span>
                                            <div class="flex text-yellow-400">
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="far fa-star text-sm"></i>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">3D모델링 기초 과정</p>
                                    </div>
                                    <span class="text-xs text-gray-400">2024.10.05</span>
                                </div>
                                <p class="text-sm text-gray-700 line-clamp-3">
                                    처음 3D 모델링을 배우는데 걱정이 많았는데, 기초부터 차근차근 배워서 자신감이 생겼습니다. 시설도 깨끗하고 최신 장비로 실습할 수 있어 좋았어요.
                                </p>
                            </div>

                            <!-- 후기 아이템 4 -->
                            <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="flex items-center mb-1">
                                            <span class="font-bold text-gray-800 mr-2">최수연</span>
                                            <div class="flex text-yellow-400">
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">3D프린팅 자격증 과정</p>
                                    </div>
                                    <span class="text-xs text-gray-400">2024.09.28</span>
                                </div>
                                <p class="text-sm text-gray-700 line-clamp-3">
                                    자격증 합격을 목표로 수강했는데, 체계적인 커리큘럼 덕분에 한 번에 합격했습니다! 실기 준비도 철저하게 해주셔서 감사합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 빠른 수강조회 (오른쪽) -->
                    <div class="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">빠른 수강료 조회</h3>
                        <p class="text-sm text-gray-600 mb-6">수강료를 빠르게 안내해드립니다.</p>
                        
                        <form id="quickInquiryForm" class="space-y-4">
                            <!-- 지점선택 -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 bg-primary-600 text-white px-3 py-2 rounded">
                                    지점선택
                                </label>
                                <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="">||지점선택||</option>
                                    <option value="hongdae">홍대센터</option>
                                    <option value="gangnam">강남센터</option>
                                    <option value="online">온라인</option>
                                </select>
                            </div>
                            
                            <!-- 희망분야 -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 bg-primary-600 text-white px-3 py-2 rounded">
                                    희망분야
                                </label>
                                <div class="grid grid-cols-2 gap-3">
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">웹개발</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">편집디자인</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">IT개발</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">영상/게임/VR</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">세무회계 OA</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">건축 산업디자인</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                                        <span class="text-sm">AI</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- 이름 -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 bg-primary-600 text-white px-3 py-2 rounded">
                                    이름
                                </label>
                                <input type="text" placeholder="이름을 입력해주세요." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            
                            <!-- 연락처 -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 bg-primary-600 text-white px-3 py-2 rounded">
                                    연락처
                                </label>
                                <div class="flex gap-2">
                                    <select class="w-1/3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                        <option>010</option>
                                        <option>011</option>
                                        <option>016</option>
                                        <option>017</option>
                                        <option>019</option>
                                    </select>
                                    <input type="text" placeholder="" maxlength="4" class="w-1/3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <input type="text" placeholder="" maxlength="4" class="w-1/3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                </div>
                            </div>
                            
                            <!-- 개인정보 동의 -->
                            <div class="flex items-start space-x-2">
                                <input type="checkbox" id="privacyAgree" class="w-4 h-4 mt-1 text-primary-600 rounded focus:ring-primary-500">
                                <label for="privacyAgree" class="text-xs text-gray-600">
                                    개인정보 수집 이용을 동의합니다. 
                                    <a href="#" class="text-primary-600 underline">[내용보기]</a>
                                </label>
                            </div>
                            
                            <!-- 제출 버튼 -->
                            <button type="submit" class="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition flex items-center justify-center gap-2">
                                <i class="fas fa-search"></i>
                                수강료조회
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- 캠퍼스 섹션 -->
        <section id="campuses" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-800 mb-4">캠퍼스 안내</h2>
                    <p class="text-xl text-gray-600">홍대를 중심으로 한 편리한 교육 환경</p>
                </div>
                <div id="campusList" class="grid md:grid-cols-2 gap-8">
                    <!-- 로딩 -->
                    <div class="col-span-2 text-center py-12">
                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 시제품 제작 갤러리 -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">시제품 제작 갤러리</h2>
                        <p class="text-gray-600">수강생들이 직접 제작한 3D 프린팅 작품들</p>
                    </div>
                    <a href="#prototype-gallery" class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                        더보기 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                
                <!-- 가로 스크롤 갤러리 -->
                <div class="relative group">
                    <!-- 왼쪽 화살표 -->
                    <button onclick="scrollGallery('prototype', -1)" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-left text-gray-800"></i>
                    </button>
                    
                    <!-- 이미지 컨테이너 -->
                    <div id="prototypeGallery" class="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
                        <!-- 갤러리 아이템 1 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-cube text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">FDM방식 3D프린터 활용...</h3>
                                    <p class="text-sm text-gray-500">2025-08-28</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 2 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-cube text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">네오 익셉셔널의 적용사품 가...</h3>
                                    <p class="text-sm text-gray-500">2025-08-12</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 3 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-cube text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">FDM방식 3D프린터 활용...</h3>
                                    <p class="text-sm text-gray-500">2025-08-07</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 4 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-cube text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">SLA-DLP방식 3D프린터...</h3>
                                    <p class="text-sm text-gray-500">2025-07-16</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 5 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-cube text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">SLA-DLP방식 3D프린터...</h3>
                                    <p class="text-sm text-gray-500">2025-07-11</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 오른쪽 화살표 -->
                    <button onclick="scrollGallery('prototype', 1)" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-right text-gray-800"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- 수강생 포트폴리오 갤러리 -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">수강생 포트폴리오</h2>
                        <p class="text-gray-600">창의적인 아이디어와 기술이 결합된 작품들</p>
                    </div>
                    <a href="#portfolio-gallery" class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                        더보기 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                
                <!-- 가로 스크롤 갤러리 -->
                <div class="relative group">
                    <!-- 왼쪽 화살표 -->
                    <button onclick="scrollGallery('portfolio', -1)" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-left text-gray-800"></i>
                    </button>
                    
                    <!-- 이미지 컨테이너 -->
                    <div id="portfolioGallery" class="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
                        <!-- 갤러리 아이템 1 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-palette text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">[2025 0월 소상공인전문...</h3>
                                    <p class="text-sm text-gray-500">2025-10-02</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 2 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-palette text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">[2025 소상공인 전문가양...</h3>
                                    <p class="text-sm text-gray-500">2025-09-26</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 3 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-palette text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">[2025 0월 소상공인전문...</h3>
                                    <p class="text-sm text-gray-500">2025-03-14</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 4 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-palette text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">Fusion 활용 고급모델링...</h3>
                                    <p class="text-sm text-gray-500">2025-06-17</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 갤러리 아이템 5 -->
                        <div class="flex-shrink-0 w-72">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group/item">
                                <div class="relative aspect-square bg-gray-200">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i class="fas fa-palette text-6xl text-gray-300"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition"></div>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">[2025 7월 소상공인전문...</h3>
                                    <p class="text-sm text-gray-500">2025-07-21</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 오른쪽 화살표 -->
                    <button onclick="scrollGallery('portfolio', 1)" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-right text-gray-800"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- 협력기관 및 사이트 -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">협력기관 및 사이트</h2>
                    <p class="text-gray-600">함께 성장하는 파트너</p>
                </div>
                
                <!-- 가로 스크롤 파트너 -->
                <div class="relative group">
                    <!-- 왼쪽 화살표 -->
                    <button onclick="scrollGallery('partners', -1)" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-left text-gray-800"></i>
                    </button>
                    
                    <!-- 파트너 컨테이너 -->
                    <div id="partnersGallery" class="flex gap-8 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
                        <!-- 파트너 1: 한국HRD훈련지원센터 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item">
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-graduation-cap text-2xl text-primary-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1">(주)한국HRD훈련지원센터</h3>
                                    <p class="text-xs text-gray-500 text-center">교육 훈련 지원</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 2: 3D프린팅산업협회 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item">
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-industry text-2xl text-blue-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1">(사)3D프린팅산업협회</h3>
                                    <p class="text-xs text-gray-500 text-center">산업 협력</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 3: 와우쓰리디 온라인교육 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item">
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-laptop text-2xl text-green-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1">와우쓰리디 온라인교육</h3>
                                    <p class="text-xs text-gray-500 text-center">온라인 강좌</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 4: 와우쓰리디 쇼핑몰 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item">
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-shopping-cart text-2xl text-purple-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1">와우쓰리디 쇼핑몰</h3>
                                    <p class="text-xs text-gray-500 text-center">장비 및 소모품</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 5: 추가 파트너 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item">
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-handshake text-2xl text-orange-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1">협력 파트너</h3>
                                    <p class="text-xs text-gray-500 text-center">제휴 기관</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    
                    <!-- 오른쪽 화살표 -->
                    <button onclick="scrollGallery('partners', 1)" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-chevron-right text-gray-800"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">와우쓰리디홍대센터</h3>
                        <p class="text-gray-400">3D 프린팅과 메이커 교육의 선두주자</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">문의</h3>
                        <p class="text-gray-400">전화: 02-1234-5678</p>
                        <p class="text-gray-400">이메일: info@wow3dcookie.kr</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">SNS</h3>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-facebook text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-instagram text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-youtube text-2xl"></i></a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script>
          // API Base URL
          const API_BASE = '/api';
          
          // ============================================
          // 히어로 슬라이드쇼
          // ============================================
          let currentSlide = 0;
          const slides = document.querySelectorAll('.hero-slide');
          const dots = document.querySelectorAll('.hero-dot');
          const totalSlides = slides.length;
          let slideInterval;
          
          // 슬라이드 변경 함수
          function showSlide(index) {
            // 인덱스 범위 체크
            if (index >= totalSlides) {
              currentSlide = 0;
            } else if (index < 0) {
              currentSlide = totalSlides - 1;
            } else {
              currentSlide = index;
            }
            
            // 모든 슬라이드 숨기기
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // 현재 슬라이드 표시
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
          }
          
          // 다음 슬라이드
          function nextSlide() {
            showSlide(currentSlide + 1);
          }
          
          // 특정 슬라이드로 이동
          function goToSlide(index) {
            showSlide(index);
            // 자동 재생 재시작
            clearInterval(slideInterval);
            startSlideShow();
          }
          
          // 자동 슬라이드쇼 시작
          function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000); // 5초마다 변경
          }
          
          // 마우스 호버 시 슬라이드쇼 일시정지
          const heroSlider = document.querySelector('.hero-slider');
          let isPaused = false;
          
          heroSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
            isPaused = true;
            heroSlider.classList.add('paused');
          });
          
          heroSlider.addEventListener('mouseleave', () => {
            if (isPaused) {
              startSlideShow();
              isPaused = false;
              heroSlider.classList.remove('paused');
            }
          });
          
          // 페이지 로드 시 슬라이드쇼 시작
          document.addEventListener('DOMContentLoaded', () => {
            startSlideShow();
          });
          
          // 과정 목록 로드
          async function loadCourses() {
            try {
              const response = await fetch(\`\${API_BASE}/courses\`);
              const result = await response.json();
              
              if (result.success) {
                displayCourses(result.data);
              }
            } catch (error) {
              console.error('Error loading courses:', error);
              document.getElementById('courseList').innerHTML = '<div class="col-span-3 text-center text-red-600">과정 정보를 불러오는데 실패했습니다.</div>';
            }
          }
          
          // 과정 카드 표시
          function displayCourses(courses) {
            const html = courses.map(course => \`
              <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition course-card" data-category="\${course.category}">
                <div class="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <i class="fas fa-cube text-white text-6xl"></i>
                </div>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-semibold text-primary-600">\${course.category}</span>
                    <span class="text-sm text-gray-500">\${course.campus_region}</span>
                  </div>
                  <h3 class="text-xl font-bold mb-2">\${course.title}</h3>
                  <p class="text-gray-600 mb-4">\${course.subtitle || course.description?.substring(0, 50) + '...'}</p>
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-sm text-gray-500">
                      <i class="far fa-clock"></i> \${course.duration_months}개월 (\${course.duration_hours}시간)
                    </div>
                    <div class="text-lg font-bold text-primary-600">
                      \${course.price === 0 ? '국비지원' : course.discount_price ? course.discount_price.toLocaleString() + '원' : course.price.toLocaleString() + '원'}
                    </div>
                  </div>
                  <button onclick="showCourseDetail(\${course.id})" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                    자세히 보기
                  </button>
                </div>
              </div>
            \`).join('');
            
            document.getElementById('courseList').innerHTML = html;
          }
          
          // 캠퍼스 목록 로드
          async function loadCampuses() {
            try {
              const response = await fetch(\`\${API_BASE}/campuses\`);
              const result = await response.json();
              
              if (result.success) {
                const html = result.data.map(campus => \`
                  <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-2xl font-bold mb-4 text-primary-600">\${campus.name}</h3>
                    <div class="space-y-3 text-gray-600">
                      <p><i class="fas fa-map-marker-alt text-primary-600 w-6"></i> \${campus.address}</p>
                      <p><i class="fas fa-phone text-primary-600 w-6"></i> \${campus.phone}</p>
                      <p><i class="fas fa-envelope text-primary-600 w-6"></i> \${campus.email}</p>
                    </div>
                    <p class="mt-4 text-gray-600">\${campus.description}</p>
                  </div>
                \`).join('');
                
                document.getElementById('campusList').innerHTML = html;
              }
            } catch (error) {
              console.error('Error loading campuses:', error);
            }
          }
          
          // 필터링
          function filterCourses(category) {
            const cards = document.querySelectorAll('.course-card');
            const buttons = document.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => {
              btn.classList.remove('active', 'bg-primary-600', 'text-white');
              btn.classList.add('bg-white', 'text-gray-700');
            });
            
            event.target.classList.add('active', 'bg-primary-600', 'text-white');
            event.target.classList.remove('bg-white', 'text-gray-700');
            
            cards.forEach(card => {
              if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            });
          }
          
          // 스크롤
          function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
          }
          
          // 과정 상세 (임시)
          function showCourseDetail(id) {
            alert('과정 상세 페이지는 곧 준비됩니다!');
          }
          
          // 로그인/회원가입 모달 (임시)
          function showLoginModal() {
            alert('로그인 기능은 곧 준비됩니다!');
          }
          
          function showRegisterModal() {
            alert('회원가입 기능은 곧 준비됩니다!');
          }
          
          // 갤러리 스크롤 함수
          function scrollGallery(galleryType, direction) {
            let galleryId;
            if (galleryType === 'prototype') {
              galleryId = 'prototypeGallery';
            } else if (galleryType === 'portfolio') {
              galleryId = 'portfolioGallery';
            } else if (galleryType === 'partners') {
              galleryId = 'partnersGallery';
            }
            
            const gallery = document.getElementById(galleryId);
            const scrollAmount = 300; // 한 번에 스크롤할 픽셀 수
            
            if (direction === -1) {
              // 왼쪽으로 스크롤
              gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
              });
            } else {
              // 오른쪽으로 스크롤
              gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
              });
            }
          }
          
          // 페이지 로드 시 데이터 로드
          document.addEventListener('DOMContentLoaded', () => {
            loadCourses();
            loadCampuses();
          });
        </script>
    </body>
    </html>
  `);
});

// ============================================
// 스케줄 페이지 (달력 형태)
// ============================================
app.get('/schedule', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>개강 일정표 - 와우쓰리디홍대센터</title>
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
                    700: '#3b7bc9',
                    800: '#2d5fa3',
                    900: '#1e4175',
                  }
                }
              }
            }
          }
        </script>
        <style>
          .calendar-day {
            min-height: 120px;
            transition: all 0.2s;
          }
          .calendar-day:hover {
            background-color: #f0f7ff;
            transform: scale(1.02);
          }
          .schedule-item {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            margin-bottom: 0.25rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .schedule-item:hover {
            transform: translateX(2px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .schedule-badge {
            display: inline-block;
            padding: 0.125rem 0.375rem;
            font-size: 0.625rem;
            border-radius: 0.25rem;
            font-weight: 600;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 네비게이션 -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center space-x-4">
                        <a href="/" class="flex items-center space-x-4">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-12">
                            <span class="text-xl font-bold text-gray-800">와우쓰리디홍대센터</span>
                        </a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/" class="text-gray-700 hover:text-primary-600 font-medium">
                            <i class="fas fa-home mr-2"></i>홈으로
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- 헤더 -->
        <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4">
                    <i class="fas fa-calendar-alt mr-3"></i>전체 개강 일정표
                </h1>
                <p class="text-xl text-white/90">
                    모든 과정의 일정을 한눈에 확인하세요
                </p>
            </div>
        </section>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- 달력 컨트롤 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <button onclick="changeMonth(-1)" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        <i class="fas fa-chevron-left"></i> 이전 달
                    </button>
                    <h2 id="currentMonth" class="text-2xl font-bold text-gray-800"></h2>
                    <button onclick="changeMonth(1)" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        다음 달 <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <!-- 필터 -->
                <div class="flex flex-wrap gap-3 mb-6">
                    <button onclick="filterSchedules('all')" class="filter-btn active px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium">
                        전체
                    </button>
                    <button onclick="filterSchedules('통합과정')" class="filter-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                        통합과정
                    </button>
                    <button onclick="filterSchedules('단기과정')" class="filter-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                        단기과정
                    </button>
                </div>

                <!-- 달력 -->
                <div class="grid grid-cols-7 gap-2">
                    <!-- 요일 헤더 -->
                    <div class="text-center font-bold py-3 bg-red-50 text-red-600 rounded">일</div>
                    <div class="text-center font-bold py-3 bg-gray-50">월</div>
                    <div class="text-center font-bold py-3 bg-gray-50">화</div>
                    <div class="text-center font-bold py-3 bg-gray-50">수</div>
                    <div class="text-center font-bold py-3 bg-gray-50">목</div>
                    <div class="text-center font-bold py-3 bg-gray-50">금</div>
                    <div class="text-center font-bold py-3 bg-blue-50 text-blue-600 rounded">토</div>
                    
                    <!-- 달력 날짜 -->
                    <div id="calendarGrid" class="col-span-7 grid grid-cols-7 gap-2">
                        <!-- JavaScript로 동적 생성 -->
                    </div>
                </div>
            </div>

            <!-- 테이블 형태 리스트 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-list mr-2"></i>전체 일정 목록
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">분류</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">대상</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">과정명</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">회차</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">기간</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">시간</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">요일</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">모집인원</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- JavaScript로 동적 생성 -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 스케줄 상세 모달 -->
        <div id="scheduleModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <h3 id="modalTitle" class="text-2xl font-bold text-gray-800"></h3>
                        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <div id="modalContent" class="space-y-4">
                        <!-- JavaScript로 동적 생성 -->
                    </div>
                    <div class="mt-6 flex gap-3">
                        <button onclick="closeModal()" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            닫기
                        </button>
                        <button class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                            수강 신청하기
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
          const API_BASE = '/api';
          let currentYear = new Date().getFullYear();
          let currentMonth = new Date().getMonth() + 1;
          let allSchedules = [];
          let currentFilter = 'all';

          // 달력 데이터 로드
          async function loadSchedules() {
            try {
              const response = await fetch(\`\${API_BASE}/schedules/calendar/\${currentYear}/\${currentMonth}\`);
              const result = await response.json();
              
              if (result.success) {
                allSchedules = result.data;
                renderCalendar();
                renderTable();
              }
            } catch (error) {
              console.error('Error loading schedules:', error);
            }
          }

          // 달력 렌더링
          function renderCalendar() {
            const firstDay = new Date(currentYear, currentMonth - 1, 1);
            const lastDay = new Date(currentYear, currentMonth, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            document.getElementById('currentMonth').textContent = \`\${currentYear}년 \${currentMonth}월\`;

            let html = '';

            // 이전 달 빈 칸
            for (let i = 0; i < startingDayOfWeek; i++) {
              html += '<div class="calendar-day bg-gray-50 rounded border border-gray-200 p-2"></div>';
            }

            // 현재 달 날짜
            for (let day = 1; day <= daysInMonth; day++) {
              const dateStr = \`\${currentYear}-\${String(currentMonth).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
              const daySchedules = allSchedules.filter(s => {
                const start = new Date(s.start_date);
                const end = new Date(s.end_date);
                const current = new Date(dateStr);
                return current >= start && current <= end;
              }).filter(s => currentFilter === 'all' || s.category === currentFilter);

              const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

              html += \`
                <div class="calendar-day bg-white rounded border border-gray-200 p-2 \${isToday ? 'ring-2 ring-primary-500' : ''}">
                  <div class="font-bold text-sm mb-1 \${isToday ? 'text-primary-600' : 'text-gray-700'}">\${day}</div>
                  <div class="space-y-1">
                    \${daySchedules.slice(0, 3).map(s => \`
                      <div onclick="showScheduleDetail(\${s.id})" class="schedule-item bg-primary-100 text-primary-800 hover:bg-primary-200">
                        <div class="font-semibold truncate">\${s.course_name}</div>
                        <div class="text-[0.6rem] text-primary-600">\${s.start_time || ''} ~ \${s.end_time || ''}</div>
                      </div>
                    \`).join('')}
                    \${daySchedules.length > 3 ? \`<div class="text-xs text-gray-500 text-center">+\${daySchedules.length - 3}개 더보기</div>\` : ''}
                  </div>
                </div>
              \`;
            }

            document.getElementById('calendarGrid').innerHTML = html;
          }

          // 테이블 렌더링
          function renderTable() {
            const filteredSchedules = currentFilter === 'all' 
              ? allSchedules 
              : allSchedules.filter(s => s.category === currentFilter);

            const html = filteredSchedules.map(s => \`
              <tr class="hover:bg-gray-50 cursor-pointer" onclick="showScheduleDetail(\${s.id})">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="schedule-badge bg-primary-100 text-primary-800">\${s.category}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">\${s.target_audience}</td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">\${s.course_name}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">\${s.session_number || '-'}회차</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  \${s.start_date} ~ \${s.end_date}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  \${s.start_time || ''} ~ \${s.end_time || ''}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">\${s.days_of_week || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">\${s.max_students || '-'}명</td>
              </tr>
            \`).join('');

            document.getElementById('scheduleTableBody').innerHTML = html || \`
              <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  일정이 없습니다.
                </td>
              </tr>
            \`;
          }

          // 월 변경
          function changeMonth(delta) {
            currentMonth += delta;
            if (currentMonth > 12) {
              currentMonth = 1;
              currentYear++;
            } else if (currentMonth < 1) {
              currentMonth = 12;
              currentYear--;
            }
            loadSchedules();
          }

          // 필터링
          function filterSchedules(category) {
            currentFilter = category;
            
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => {
              btn.classList.remove('active', 'bg-primary-600', 'text-white');
              btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            
            event.target.classList.add('active', 'bg-primary-600', 'text-white');
            event.target.classList.remove('bg-gray-100', 'text-gray-700');

            renderCalendar();
            renderTable();
          }

          // 스케줄 상세 보기
          async function showScheduleDetail(id) {
            try {
              const response = await fetch(\`\${API_BASE}/schedules/\${id}\`);
              const result = await response.json();
              
              if (result.success) {
                const s = result.data;
                document.getElementById('modalTitle').textContent = s.course_name;
                document.getElementById('modalContent').innerHTML = \`
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500 mb-1">분류</p>
                      <p class="font-medium">\${s.category}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">대상</p>
                      <p class="font-medium">\${s.target_audience}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">회차</p>
                      <p class="font-medium">\${s.session_number || '-'}회차</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">모집인원</p>
                      <p class="font-medium">\${s.max_students || '-'}명</p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-sm text-gray-500 mb-1">교육기간</p>
                      <p class="font-medium">\${s.start_date} ~ \${s.end_date}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">교육시간</p>
                      <p class="font-medium">\${s.start_time || ''} ~ \${s.end_time || ''}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">교육요일</p>
                      <p class="font-medium">\${s.days_of_week || '-'}</p>
                    </div>
                  </div>
                \`;
                document.getElementById('scheduleModal').classList.remove('hidden');
              }
            } catch (error) {
              console.error('Error loading schedule detail:', error);
            }
          }

          // 모달 닫기
          function closeModal() {
            document.getElementById('scheduleModal').classList.add('hidden');
          }

          // 페이지 로드
          document.addEventListener('DOMContentLoaded', () => {
            loadSchedules();
          });
        </script>
    </body>
    </html>
  `);
});

// ============================================
// 404 핸들러
// ============================================
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: '요청하신 리소스를 찾을 수 없습니다'
  }, 404);
});

// ============================================
// 에러 핸들러
// ============================================
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: '서버 오류가 발생했습니다'
  }, 500);
});

export default app;
