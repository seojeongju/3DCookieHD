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
    description: '와우쓰리디쿠키홍대센터 교육 플랫폼',
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
        <title>와우쓰리디쿠키홍대센터 - 3D 프린팅 교육 전문</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                  }
                }
              }
            }
          }
        </script>
        <style>
          .hero-gradient {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
          }
          .hero-slider {
            position: relative;
            height: 600px;
            overflow: hidden;
          }
          .hero-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            background-size: cover;
            background-position: center;
          }
          .hero-slide.active {
            opacity: 1;
          }
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(37, 99, 235, 0.75) 50%, rgba(59, 130, 246, 0.65) 100%);
          }
          .hero-content {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
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
          @media (max-height: 700px) {
            .hero-slider {
              height: 500px;
            }
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 네비게이션 -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center space-x-4">
                        <img src="/logo.png" alt="WOW 3D" class="h-12">
                        <span class="text-xl font-bold text-gray-800">와우쓰리디쿠키홍대센터</span>
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
            <div class="hero-slide active" style="background-image: url('/hero1.jpg')">
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
            <div class="hero-slide" style="background-image: url('/hero2.jpg')">
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
            <div class="hero-slide" style="background-image: url('/hero3.jpg')">
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
            <div class="hero-slide" style="background-image: url('/hero4.jpg')">
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
            <div class="hero-slide" style="background-image: url('/hero5.jpg')">
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

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">와우쓰리디쿠키홍대센터</h3>
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
                    <p>&copy; 2025 와우쓰리디쿠키홍대센터. All rights reserved.</p>
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
