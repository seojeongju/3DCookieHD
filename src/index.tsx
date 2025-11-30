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
import jobs from './api/jobs';
import jobseekers from './api/jobseekers';
import exams from './api/exams';
import students from './api/students';
import { adminDashboardHtml } from './views/admin';
import { adminJobsListHtml } from './views/admin_jobs';
import { adminJobseekersListHtml } from './views/admin_jobseekers';
import { jobsListHtml } from './views/jobs';
import { jobseekersListHtml } from './views/jobseekers';
import { adminCoursesListHtml } from './views/admin_courses';
import { adminStudentsListHtml } from './views/admin_students';
import { adminExamsHtml, adminExamCreateHtml, adminExamEditHtml } from './views/admin_exams';
import { studentExamHtml } from './views/student_exam';
import { studentDashboardHtml } from './views/student_dashboard';
import { adminGradesHtml } from './views/admin_grades';
import { reviewsListHtml } from './views/reviews';
import { loginHtml } from './views/login';
import { registerHtml } from './views/register';
import { adminReviewsListHtml } from './views/admin_reviews';
import { adminPostsListHtml } from './views/admin_posts';
import { postsListHtml } from './views/posts';
import { scheduleHtml } from './views/schedule';
import { locationsHtml } from './views/locations';
import { coursesListHtml } from './views/courses';
import { achievementsHtml } from './views/achievements';

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
app.use('/static/*', serveStatic({ root: './public', manifest: {} as any }));

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

// 채용공고 API
app.route('/api/jobs', jobs);

// 구직자 API
app.route('/api/jobseekers', jobseekers);

// 시험 API
app.route('/api/exams', exams);

// 학생 관리 API
app.route('/api/students', students);

// ============================================
// 페이지 라우트
// ============================================
app.get('/jobs', (c) => c.html(jobsListHtml));
app.get('/jobseekers', (c) => c.html(jobseekersListHtml));
app.get('/courses', (c) => c.html(coursesListHtml));
app.get('/posts', (c) => c.html(postsListHtml));
app.get('/schedule', (c) => c.html(scheduleHtml));
app.get('/locations', (c) => c.html(locationsHtml));
app.get('/achievements', (c) => c.html(achievementsHtml));
app.get('/reviews', (c) => c.html(reviewsListHtml));

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
        <title>와우쓰리디홍대센터 - 4차산업 3D프린팅 교육 전문</title>
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
          /* 드롭다운 스크롤바 스타일링 */
          #coursesDropdown::-webkit-scrollbar {
            width: 6px;
          }
          #coursesDropdown::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          #coursesDropdown::-webkit-scrollbar-thumb {
            background: #5b9bd5;
            border-radius: 10px;
          }
          #coursesDropdown::-webkit-scrollbar-thumb:hover {
            background: #4a90e2;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 네비게이션 -->
        <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- 로고 -->
                    <!-- 로고 -->
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/" class="flex flex-col items-start group">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">와우쓰리디홍대센터</span>
                    </a>
                    </div>

                    <!-- 메인 메뉴 (중앙) -->
                    <div class="hidden lg:flex space-x-1 items-center">
                        <!-- 과정안내 -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                                과정안내
                                <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                                <div class="py-1">
                                    <a href="/courses" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">전체 과정 보기</a>
                                    <a href="/courses?category=gukbi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원과정</a>
                                    <a href="/courses?category=general" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">일반과정</a>
                                    <a href="/courses?category=student" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">학생/진학 과정</a>
                                </div>
                            </div>
                        </div>

                        <!-- 센터소개 -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                                센터소개
                                <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                                <div class="py-1">
                                    <a href="/greeting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">인사말</a>
                                    <a href="/education-photos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육사진</a>
                                    <a href="/achievements" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육실적</a>
                                    <a href="/facilities" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">시설안내</a>
                                    <a href="/locations" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">오시는길</a>
                                </div>
                            </div>
                        </div>

                        <a href="/reviews" class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">수강후기</a>
                        <!-- 게시판 (드롭다운) -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                                게시판
                                <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                                <div class="py-1">
                                    <a href="/posts?category=notice" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">공지사항</a>
                                    <a href="/posts?category=faq" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">FAQ</a>
                                    <a href="/posts?category=portfolio" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">포트폴리오</a>
                                    <a href="/posts?category=qna" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Q&A</a>
                                </div>
                            </div>
                        </div>
                        <!-- 채용정보 (드롭다운) -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                                채용정보
                                <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                                <div class="py-1">
                                    <a href="/jobs" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">구인정보 (채용공고)</a>
                                    <a href="/jobseekers" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">구직정보 (인재풀)</a>
                                </div>
                            </div>
                        </div>

                        <!-- 상담센터 -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                                상담센터
                                <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                                <div class="py-1">
                                    <a href="/online-consulting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">온라인상담신청</a>
                                    <a href="/corporate-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">기업단체교육</a>
                                    <a href="/university-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">대학맞춤교육</a>
                                </div>
                            </div>
                        </div>

                        <!-- 학사관리 (보라색 버튼) -->
                        <div class="relative group ml-2">
                            <button class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded flex items-center transition-colors shadow-sm">
                                <i class="fas fa-graduation-cap mr-1.5 text-xs"></i>
                                학사관리
                                <i class="fas fa-chevron-down ml-1.5 text-[10px] text-purple-200"></i>
                            </button>
                            <div class="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">학생학사관리</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">강사학사관리</a>
                            </div>
                        </div>
                        </div>
                    </div>

                    <!-- 우측 메뉴 (로그인/회원가입) -->
                    <div class="flex items-center space-x-2" id="authMenu">
                        <a href="/login" class="px-3 py-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition-colors">로그인</a>
                        <a href="/register" class="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded transition-colors shadow-sm">회원가입</a>
                    </div>
                </div>
            </div>
        </nav>

        <script>
            // 로그인 상태 확인 및 메뉴 업데이트
            document.addEventListener('DOMContentLoaded', () => {
                loadLatestNotice();
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                const authMenu = document.getElementById('authMenu');
                
                if (token && userStr && authMenu) {
                    const user = JSON.parse(userStr);
                    let menuHtml = '';
                    
                    if (user.role === 'admin') {
                        menuHtml += \`
                            <a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold whitespace-nowrap mr-4">
                                <i class="fas fa-cog mr-1"></i> 관리자
                            </a>
                        \`;
                    } else {
                        menuHtml += \`
                            <a href="/my-classroom" class="text-blue-600 hover:text-blue-700 font-bold whitespace-nowrap mr-4">
                                <i class="fas fa-chalkboard-teacher mr-1"></i> 나의 강의실
                            </a>
                        \`;
                    }
                    
                    menuHtml += \`
                        <span class="text-gray-700 mr-2">
                            <span class="font-bold">\${user.name}</span>님
                        </span>
                        <button onclick="logout()" class="text-gray-500 hover:text-red-600 font-medium whitespace-nowrap">
                            <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                        </button>
                    \`;
                    
                    authMenu.innerHTML = menuHtml;
                }
            });

            async function loadLatestNotice() {
                try {
                    const response = await fetch('/api/posts?category=notice&limit=1');
                    const result = await response.json();
                    if (result.success && result.data.length > 0) {
                        const notice = result.data[0];
                        const noticeElement = document.getElementById('latestNoticeTitle');
                        if (noticeElement) {
                            noticeElement.textContent = notice.title;
                            noticeElement.parentElement.onclick = () => location.href = '/posts?category=notice';
                            noticeElement.parentElement.style.cursor = 'pointer';
                        }
                    } else {
                         const noticeElement = document.getElementById('latestNoticeTitle');
                         if (noticeElement) noticeElement.textContent = '등록된 공지사항이 없습니다.';
                    }
                } catch (e) {
                    console.error('Failed to load notice:', e);
                }
            }

            function logout() {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.href = '/';
            }
        </script>
                        


        <!-- 히어로 섹션 (슬라이드쇼) -->
        <section class="hero-slider">
            <!-- Slide 1: 화이트 테마 -->
            <div class="hero-slide active" style="background-image: url('/static/hero1.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            상상을 현실로, 미래를 디자인하다!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg">
                            와우쓰리디홍대센터에서 4차 산업혁명의 핵심 기술,<br>
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

            <!-- Slide 2: 골드/노란색 테마 -->
            <div class="hero-slide" style="background-image: url('/static/hero2.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-300">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                            국가자격증 합격의 지름길!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg text-yellow-100" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                            3D프린터운용기능사, 오토데스크 ACU 등<br>
                            공신력 있는 교육과 자격증 시험을 한 곳에서 준비하세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: 민트/청록색 테마 -->
            <div class="hero-slide" style="background-image: url('/static/hero3.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-cyan-300">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                            초보부터 전문가까지, 맞춤 교육!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg text-cyan-100" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                            국민내일배움카드, 재직자, 일반 등<br>
                            모두를 위한 다양한 과정을 만나보세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-cyan-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-cyan-300 transition text-lg shadow-lg">
                                과정 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: 코랄/주황색 테마 -->
            <div class="hero-slide" style="background-image: url('/static/hero4.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-orange-300">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                            당신의 아이디어를 현실로!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg text-orange-100" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                            지금 바로 와우쓰리디홍대센터에서<br>
                            혁신적인 3D프린팅 전문가의 여정을 시작하세요!
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('contact')" class="bg-orange-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-orange-300 transition text-lg shadow-lg">
                                상담 신청
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: 라벤더/보라색 테마 -->
            <div class="hero-slide" style="background-image: url('/static/hero5.jpg')">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-purple-300">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                            실무 중심의 전문 커리큘럼!
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 drop-shadow-lg text-purple-100" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                            시제품 제작부터 제품화까지!<br>
                            취업과 창업에 바로 연결되는 실무 교육을 경험하세요.
                        </p>
                        <div class="flex justify-center gap-4">
                            <button onclick="scrollToSection('courses')" class="bg-purple-400 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-300 transition text-lg shadow-lg">
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
                        
                        <a href="/locations" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-map-marker-alt text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">위치안내</span>
                        </a>
                        
                        <a href="/posts?category=portfolio" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-image text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">포트폴리오</span>
                        </a>
                        
                        <a href="/reviews" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-pencil-alt text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">수강후기</span>
                        </a>
                        
                        <a href="/posts" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
                            <div class="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary-50 transition quick-menu-icon">
                                <i class="fas fa-clipboard-list text-lg text-gray-700 group-hover:text-primary-600"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700 group-hover:text-primary-600">게시판</span>
                        </a>
                        
                        <a href="/courses" class="flex flex-col items-center min-w-[70px] hover:text-primary-600 transition group quick-menu-item">
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
                            <p class="text-sm text-gray-700 truncate" id="latestNoticeTitle">
                                공지사항을 불러오는 중...
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
                <!-- 필터 (심플 탭 스타일) -->
                <div class="flex justify-center mb-10 border-b border-gray-200">
                    <button onclick="filterCourses('all')" class="filter-btn active px-6 py-3 text-primary-600 border-b-2 border-primary-600 font-bold transition-colors focus:outline-none">
                        전체
                    </button>
                    <button onclick="filterCourses('3D프린팅')" class="filter-btn px-6 py-3 text-gray-500 hover:text-primary-600 font-medium transition-colors focus:outline-none border-b-2 border-transparent hover:border-gray-300">
                        3D 프린팅
                    </button>
                    <button onclick="filterCourses('메이커')" class="filter-btn px-6 py-3 text-gray-500 hover:text-primary-600 font-medium transition-colors focus:outline-none border-b-2 border-transparent hover:border-gray-300">
                        메이커
                    </button>
                    <button onclick="filterCourses('프로그래밍')" class="filter-btn px-6 py-3 text-gray-500 hover:text-primary-600 font-medium transition-colors focus:outline-none border-b-2 border-transparent hover:border-gray-300">
                        프로그래밍
                    </button>
                    <button onclick="filterCourses('디자인')" class="filter-btn px-6 py-3 text-gray-500 hover:text-primary-600 font-medium transition-colors focus:outline-none border-b-2 border-transparent hover:border-gray-300">
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
                <div id="campusList" class="grid md:grid-cols-3 gap-8">
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
                        <p class="text-gray-600">3D프린터를 활용한 시제품제작-제품품</p>
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
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item h-48">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-graduation-cap text-2xl text-primary-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1 text-xs leading-tight whitespace-nowrap">(주)한국HRD훈련지원센터</h3>
                                    <p class="text-xs text-gray-500 text-center">교육 훈련 지원</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 2: 3D프린팅산업협회 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item h-48">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-industry text-2xl text-blue-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1 text-xs leading-tight whitespace-nowrap">(사)3D프린팅산업협회</h3>
                                    <p class="text-xs text-gray-500 text-center">산업 협력</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 3: 와우쓰리디 온라인교육 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item h-48">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-laptop text-2xl text-green-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1 text-xs leading-tight whitespace-nowrap">와우쓰리디 온라인교육</h3>
                                    <p class="text-xs text-gray-500 text-center">온라인 강좌</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 4: 와우쓰리디 쇼핑몰 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="#" target="_blank" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item h-48">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-shopping-cart text-2xl text-purple-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1 text-xs leading-tight whitespace-nowrap">와우쓰리디 쇼핑몰</h3>
                                    <p class="text-xs text-gray-500 text-center">장비 및 소모품</p>
                                </div>
                            </a>
                        </div>
                        
                        <!-- 파트너 5: 한국산업인력공단 -->
                        <div class="flex-shrink-0 w-56">
                            <a href="https://www.hrdkorea.or.kr/" target="_blank" rel="noopener noreferrer" class="block bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition group/item h-48">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4 group-hover/item:scale-110 transition">
                                        <i class="fas fa-certificate text-2xl text-orange-600"></i>
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-center mb-1 text-xs leading-tight whitespace-nowrap">한국산업인력공단</h3>
                                    <p class="text-xs text-gray-500 text-center">자격 및 훈련</p>
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
                <div class="border-t border-gray-700 mt-8 pt-8">
                    <!-- 푸터 링크 -->
                    <div class="flex justify-center items-center gap-6 mb-4 text-sm">
                        <a href="/terms" class="text-gray-400 hover:text-white transition">이용약관</a>
                        <span class="text-gray-600">|</span>
                        <a href="/privacy" class="text-gray-400 hover:text-white transition">개인보호정책</a>
                        <span class="text-gray-600">|</span>
                        <a href="/partnership" class="text-gray-400 hover:text-white transition">제휴제안</a>
                        <span class="text-gray-600">|</span>
                        <a href="/sitemap" class="text-gray-400 hover:text-white transition">사이트맵</a>
                    </div>
                    <p class="text-center text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <!-- 교육과정 상세 모달 -->
        <div id="courseModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeCourseModal()"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-2xl leading-6 font-bold text-gray-900 mb-2" id="modalCourseTitle">
                                    과정 제목
                                </h3>
                                <div class="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                                    <span class="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded" id="modalCourseCategory">카테고리</span>
                                    <span class="text-sm text-gray-500" id="modalCourseDuration">기간</span>
                                </div>
                                <div class="mt-2">
                                    <img id="modalCourseImage" src="" alt="Course Image" class="w-full h-64 object-cover rounded-lg mb-4 hidden">
                                    <div class="text-sm text-gray-500 mb-4 prose max-w-none text-left" id="modalCourseDescription">
                                        과정 설명
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-left">
                                        <h4 class="font-bold text-gray-800 mb-2">수강 정보</h4>
                                        <ul class="text-sm text-gray-600 space-y-1">
                                            <li><strong>수강료:</strong> <span id="modalCoursePrice"></span></li>
                                            <li><strong>난이도:</strong> <span id="modalCourseDifficulty"></span></li>
                                            <li><strong>정원:</strong> <span id="modalCourseCapacity"></span>명</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onclick="closeCourseModal()">
                            닫기
                        </button>
                        <a href="/online-consulting" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            상담 신청
                        </a>
                    </div>
                </div>
            </div>
        </div>

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
            // loadCoursesForNav(); // 네비게이션 드롭다운용 과정 로드 (HTML 요소 부재로 인한 에러 방지)
          });
          
          // ============================================
          // 네비게이션 드롭다운 과정 로드
          // ============================================
          async function loadCoursesForNav() {
            try {
              const response = await fetch(\`\${API_BASE}/courses\`);
              const result = await response.json();
              
              if (result.success && result.data.length > 0) {
                const coursesList = document.getElementById('coursesList');
                const coursesHtml = result.data.map(course => \`
                  <a href="#courses" onclick="filterCourseByTitle('\${course.title}')" class="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <span class="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2"></span>
                      </div>
                      <div class="ml-3">
                        <div class="font-medium">\${course.title}</div>
                        <div class="text-xs text-gray-500 mt-1">\${course.category} | \${course.duration}</div>
                      </div>
                    </div>
                  </a>
                \`).join('');
                
                coursesList.innerHTML = coursesHtml;
              }
            } catch (error) {
              console.error('Error loading courses for nav:', error);
              document.getElementById('coursesList').innerHTML = '<div class="px-6 py-3 text-red-500 text-sm text-center">과정을 불러오지 못했습니다.</div>';
            }
          }
          
          // 과정 제목으로 필터링
          function filterCourseByTitle(title) {
            // 과정 섹션으로 스크롤
            scrollToSection('courses');
            
            // 잠시 후 해당 과정 카드 강조
            setTimeout(() => {
              const cards = document.querySelectorAll('.course-card');
              cards.forEach(card => {
                const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
                if (cardTitle === title) {
                  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  card.classList.add('ring-4', 'ring-primary-400');
                  setTimeout(() => {
                    card.classList.remove('ring-4', 'ring-primary-400');
                  }, 2000);
                }
              });
            }, 500);
          }
          
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
          
          // HTML 태그 제거 함수
          function stripHtml(html) {
            if (!html) return '';
            const tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
          }

          // 과정 카드 표시
          function displayCourses(courses) {
            const html = courses.map(course => {
                const description = stripHtml(course.description);
                const thumbnailHtml = course.thumbnail_url 
                    ? \`<img src="\${course.thumbnail_url}" alt="\${course.title}" class="w-full h-full object-cover">\`
                    : \`<div class="h-full w-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"><i class="fas fa-cube text-white text-6xl"></i></div>\`;
                
                const statusBadge = course.status === 'open' 
                    ? '<span class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-md">모집중</span>'
                    : course.status === 'closed'
                    ? '<span class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-md">마감</span>'
                    : '<span class="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-md">준비중</span>';

                return \`
              <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition course-card" data-category="\${course.category}">
                <div class="h-48 relative">
                  \${thumbnailHtml}
                  \${statusBadge}
                </div>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-semibold text-primary-600">\${course.category}</span>
                    <span class="text-sm text-gray-500">\${course.campus_region || '홍대'}</span>
                  </div>
                  <h3 class="text-xl font-bold mb-2">\${course.title}</h3>
                  <p class="text-gray-600 mb-4">\${course.subtitle || description.substring(0, 50) + (description.length > 50 ? '...' : '')}</p>
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-sm text-gray-500">
                      <i class="far fa-clock"></i> \${course.duration_months ? course.duration_months + '개월' : ''} \${course.duration_hours ? '(' + course.duration_hours + '시간)' : ''}
                    </div>
                    <div class="text-lg font-bold text-primary-600">
                      \${course.price === 0 ? '국비지원' : course.discount_price ? Number(course.discount_price).toLocaleString() + '원' : (course.price ? Number(course.price).toLocaleString() + '원' : '무료')}
                    </div>
                  </div>
                  <button onclick="showCourseDetail(\${course.id})" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                    자세히 보기
                  </button>
                </div>
              </div>
            \`}).join('');
            
            document.getElementById('courseList').innerHTML = html;
          }
          
          // 캠퍼스 목록 로드
          async function loadCampuses() {
            // 하드코딩된 캠퍼스 데이터 (홍대, 강남, 온라인)
            const campuses = [
                {
                    name: '홍대센터',
                    description: '3D프린팅/모델링 전문 교육의 중심, 와우쓰리디 홍대센터입니다.',
                    address: '서울 마포구 홍익로 123, 와우빌딩 3층',
                    phone: '02-3144-3137',
                    email: '3dcookiehd@naver.com'
                },
                {
                    name: '구미센터',
                    description: '경북 지역 첨단 의료기술 교육센터, 와우쓰리디 구미센터입니다.',
                    address: '경북 구미시 산호대로 253 구미첨단의료기술타워606호',
                    phone: '054-464-3137',
                    email: '3dcookiehd@naver.com'
                },
                {
                    name: '전주센터',
                    description: '전북특별자치도 지역 3D프린팅 교육의 거점, 와우쓰리디 전주센터입니다.',
                    address: '전북특별자치도 전주시 덕진구 반룡로 109 A동 207호',
                    phone: '063-XXX-XXXX',
                    email: '3dcookiehd@naver.com'
                }
            ];

            const html = campuses.map(campus => \`
              <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition h-full flex flex-col">
                <h3 class="text-2xl font-bold mb-4 text-primary-600">\${campus.name}</h3>
                <div class="space-y-3 text-gray-600 flex-grow">
                  <p class="flex items-start"><i class="fas fa-map-marker-alt text-primary-600 w-6 mt-1"></i> <span>\${campus.address}</span></p>
                  <p class="flex items-center"><i class="fas fa-phone text-primary-600 w-6"></i> \${campus.phone}</p>
                  <p class="flex items-center"><i class="fas fa-envelope text-primary-600 w-6"></i> \${campus.email}</p>
                </div>
                <p class="mt-6 text-gray-600 border-t pt-4">\${campus.description}</p>
              </div>
            \`).join('');
            
            document.getElementById('campusList').innerHTML = html;
          }
          
          // 필터링
          // 필터링
          function filterCourses(category) {
            const cards = document.querySelectorAll('.course-card');
            const buttons = document.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => {
              btn.classList.remove('active', 'text-primary-600', 'border-primary-600', 'font-bold');
              btn.classList.add('text-gray-500', 'font-medium', 'border-transparent');
            });
            
            const target = event.target;
            target.classList.add('active', 'text-primary-600', 'border-primary-600', 'font-bold');
            target.classList.remove('text-gray-500', 'font-medium', 'border-transparent');
            
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
          // 과정 상세 모달 열기
          async function showCourseDetail(id) {
            try {
                // API 호출
                const response = await fetch(\`\${API_BASE}/courses/\${id}\`);
                const result = await response.json();

                if (result.success) {
                    const course = result.data;
                    
                    // 모달 내용 채우기
                    document.getElementById('modalCourseTitle').textContent = course.title;
                    document.getElementById('modalCourseCategory').textContent = course.category;
                    
                    let durationText = '';
                    if (course.duration_months) durationText += \`\${course.duration_months}개월\`;
                    if (course.duration_hours) durationText += (durationText ? ' ' : '') + \`(\${course.duration_hours}시간)\`;
                    document.getElementById('modalCourseDuration').textContent = durationText;
                    
                    document.getElementById('modalCourseDescription').innerHTML = course.description;
                    
                    const priceText = course.price === 0 ? '국비지원' : 
                                     (course.discount_price ? Number(course.discount_price).toLocaleString() + '원' : 
                                     (course.price ? Number(course.price).toLocaleString() + '원' : '무료'));
                    document.getElementById('modalCoursePrice').textContent = priceText;
                    document.getElementById('modalCourseDifficulty').textContent = course.difficulty || '정보 없음';
                    document.getElementById('modalCourseCapacity').textContent = course.capacity || '0';

                    const img = document.getElementById('modalCourseImage');
                    if (course.thumbnail_url) {
                        img.src = course.thumbnail_url;
                        img.classList.remove('hidden');
                    } else {
                        img.classList.add('hidden');
                    }

                    // 모달 표시
                    document.getElementById('courseModal').classList.remove('hidden');
                } else {
                    alert('과정 정보를 불러오지 못했습니다.');
                }
            } catch (e) {
                console.error('Error fetching course detail:', e);
                alert('오류가 발생했습니다.');
            }
          }

          // 과정 상세 모달 닫기
          function closeCourseModal() {
            document.getElementById('courseModal').classList.add('hidden');
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
// 이용약관 페이지
// ============================================
app.get('/terms', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>이용약관 - 와우쓰리디홍대센터</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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

        <!-- 컨텐츠 -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-8">이용약관</h1>
            
            <div class="bg-white rounded-lg shadow-md p-8 space-y-8">
                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제1조 (목적)</h2>
                    <p class="text-gray-600 leading-relaxed">
                        본 약관은 와우쓰리디홍대센터(이하 "회사")가 제공하는 교육 서비스 및 관련 제반 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제2조 (정의)</h2>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>"서비스"란 회사가 제공하는 3D 프린팅 교육 및 관련 온라인/오프라인 서비스를 의미합니다.</li>
                        <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                        <li>"회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디를 부여받은 자를 의미합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제3조 (약관의 효력 및 변경)</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        ① 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
                    </p>
                    <p class="text-gray-600 leading-relaxed">
                        ② 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지함으로써 효력이 발생합니다.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제4조 (서비스의 제공)</h2>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>3D 프린팅 교육 과정 제공</li>
                        <li>온라인 학습 자료 제공</li>
                        <li>수강생 포트폴리오 관리</li>
                        <li>교육 상담 및 취업 지원</li>
                        <li>기타 회사가 정하는 서비스</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제5조 (이용자의 의무)</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        이용자는 다음 행위를 하여서는 안 됩니다:
                    </p>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>허위 정보 등록 또는 타인의 정보 도용</li>
                        <li>회사의 서비스 운영을 고의로 방해하는 행위</li>
                        <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
                        <li>저작권 등 지적재산권을 침해하는 행위</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제6조 (환불 정책)</h2>
                    <p class="text-gray-600 leading-relaxed">
                        수강료 환불은 평생교육법 시행령 제23조 및 학원의 설립·운영 및 과외교습에 관한 법률 시행령 제18조에 따라 처리됩니다.
                    </p>
                </section>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 개인정보보호정책 페이지
// ============================================
app.get('/privacy', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>개인정보보호정책 - 와우쓰리디홍대센터</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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

        <!-- 컨텐츠 -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-8">개인정보보호정책</h1>
            
            <div class="bg-white rounded-lg shadow-md p-8 space-y-8">
                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        와우쓰리디홍대센터는 다음의 목적을 위하여 개인정보를 수집하고 있습니다:
                    </p>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>회원 가입 및 관리</li>
                        <li>교육 서비스 제공 및 상담</li>
                        <li>수강료 결제 및 환불 처리</li>
                        <li>교육 관련 공지사항 전달</li>
                        <li>고객 문의 및 불만 처리</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">2. 수집하는 개인정보 항목</h2>
                    <div class="text-gray-600 space-y-4">
                        <div>
                            <p class="font-semibold mb-2">필수 항목:</p>
                            <ul class="list-disc list-inside space-y-1 ml-4">
                                <li>이름, 생년월일, 연락처(전화번호, 이메일)</li>
                                <li>주소</li>
                                <li>결제정보 (계좌번호, 카드정보)</li>
                            </ul>
                        </div>
                        <div>
                            <p class="font-semibold mb-2">선택 항목:</p>
                            <ul class="list-disc list-inside space-y-1 ml-4">
                                <li>학력, 경력</li>
                                <li>관심 분야</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">3. 개인정보의 보유 및 이용기간</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
                    </p>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>수강 관련 기록: 5년 (평생교육법)</li>
                        <li>결제 및 환불 기록: 5년 (전자상거래법)</li>
                        <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">4. 개인정보의 제3자 제공</h2>
                    <p class="text-gray-600 leading-relaxed">
                        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
                    </p>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside mt-4">
                        <li>이용자가 사전에 동의한 경우</li>
                        <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">5. 이용자의 권리</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">
                        이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
                    </p>
                    <ul class="text-gray-600 space-y-2 list-disc list-inside">
                        <li>개인정보 열람 요구</li>
                        <li>개인정보 정정 요구</li>
                        <li>개인정보 삭제 요구</li>
                        <li>개인정보 처리정지 요구</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">6. 개인정보 보호책임자</h2>
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <p class="text-gray-600 mb-2"><strong>담당부서:</strong> 고객지원팀</p>
                        <p class="text-gray-600 mb-2"><strong>전화:</strong> 02-1234-5678</p>
                        <p class="text-gray-600"><strong>이메일:</strong> privacy@wow3dcookie.kr</p>
                    </div>
                </section>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 제휴제안 페이지
// ============================================
app.get('/partnership', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>제휴제안 - 와우쓰리디홍대센터</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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

        <!-- 컨텐츠 -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-8">제휴제안</h1>
            
            <div class="bg-white rounded-lg shadow-md p-8 space-y-8">
                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">함께 성장하는 파트너를 찾습니다</h2>
                    <p class="text-gray-600 leading-relaxed">
                        와우쓰리디홍대센터는 3D 프린팅 교육 분야의 선도적인 기관으로서, 다양한 기업 및 기관과의 협력을 통해 더 나은 교육 서비스를 제공하고자 합니다.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제휴 분야</h2>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="border border-gray-200 rounded-lg p-6">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-building text-3xl text-blue-600 mr-4"></i>
                                <h3 class="text-xl font-bold text-gray-800">기업 교육 제휴</h3>
                            </div>
                            <p class="text-gray-600">임직원 대상 3D 프린팅 교육 및 기술 세미나</p>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-6">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-university text-3xl text-green-600 mr-4"></i>
                                <h3 class="text-xl font-bold text-gray-800">교육기관 제휴</h3>
                            </div>
                            <p class="text-gray-600">대학 및 전문학교와의 산학 협력 프로그램</p>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-6">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-handshake text-3xl text-purple-600 mr-4"></i>
                                <h3 class="text-xl font-bold text-gray-800">장비 및 자재 제휴</h3>
                            </div>
                            <p class="text-gray-600">3D 프린터 및 관련 자재 공급 업체</p>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-6">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-rocket text-3xl text-orange-600 mr-4"></i>
                                <h3 class="text-xl font-bold text-gray-800">취업 연계 제휴</h3>
                            </div>
                            <p class="text-gray-600">수료생 채용 및 인턴십 프로그램</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제휴 혜택</h2>
                    <ul class="text-gray-600 space-y-3 list-disc list-inside">
                        <li>우수한 3D 프린팅 전문 인력 양성 및 채용 기회</li>
                        <li>최신 3D 프린팅 기술 및 교육 노하우 공유</li>
                        <li>공동 마케팅 및 홍보 활동</li>
                        <li>교육 시설 및 장비 공동 활용</li>
                        <li>산업 네트워크 확대</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제휴 문의</h2>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p class="text-gray-700 mb-4">
                            제휴에 관심이 있으시거나 문의사항이 있으시면 아래 연락처로 연락 주시기 바랍니다.
                        </p>
                        <div class="space-y-2">
                            <p class="text-gray-700">
                                <i class="fas fa-envelope mr-2 text-blue-600"></i>
                                <strong>이메일:</strong> partnership@wow3dcookie.kr
                            </p>
                            <p class="text-gray-700">
                                <i class="fas fa-phone mr-2 text-blue-600"></i>
                                <strong>전화:</strong> 02-1234-5678
                            </p>
                            <p class="text-gray-700">
                                <i class="fas fa-fax mr-2 text-blue-600"></i>
                                <strong>팩스:</strong> 02-1234-5679
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">제휴 제안서 제출</h2>
                    <p class="text-gray-600 mb-4">
                        제휴 제안서는 아래 이메일로 제출해 주시기 바랍니다. 검토 후 3~5 영업일 내에 회신 드리겠습니다.
                    </p>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <p class="text-gray-700 font-semibold">제출 이메일: partnership@wow3dcookie.kr</p>
                        <p class="text-gray-600 text-sm mt-2">※ 제안서에는 기업/기관 소개, 제휴 목적, 제휴 분야, 연락처를 포함해 주세요.</p>
                    </div>
                </section>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 사이트맵 페이지
// ============================================
app.get('/sitemap', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>사이트맵 - 와우쓰리디홍대센터</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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

        <!-- 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-8">사이트맵</h1>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- 메인 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-home text-blue-600 mr-2"></i>
                        메인
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/" class="text-gray-600 hover:text-blue-600 transition">홈페이지</a></li>
                        <li><a href="/#courses" class="text-gray-600 hover:text-blue-600 transition">과정 안내</a></li>
                        <li><a href="/#campuses" class="text-gray-600 hover:text-blue-600 transition">캠퍼스 안내</a></li>
                        <li><a href="/#reviews" class="text-gray-600 hover:text-blue-600 transition">수강 후기</a></li>
                    </ul>
                </div>

                <!-- 교육 과정 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-book text-green-600 mr-2"></i>
                        교육 과정
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/#courses" class="text-gray-600 hover:text-blue-600 transition">전체 과정</a></li>
                        <li><a href="/schedule" class="text-gray-600 hover:text-blue-600 transition">개강 일정표</a></li>
                        <li><a href="/#courses" class="text-gray-600 hover:text-blue-600 transition">3D 프린팅</a></li>
                        <li><a href="/#courses" class="text-gray-600 hover:text-blue-600 transition">메이커 교육</a></li>
                        <li><a href="/#courses" class="text-gray-600 hover:text-blue-600 transition">자격증 과정</a></li>
                    </ul>
                </div>

                <!-- 캠퍼스 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-map-marker-alt text-red-600 mr-2"></i>
                        캠퍼스
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/#campuses" class="text-gray-600 hover:text-blue-600 transition">캠퍼스 소개</a></li>
                        <li><a href="/#campuses" class="text-gray-600 hover:text-blue-600 transition">위치 안내</a></li>
                        <li><a href="/#campuses" class="text-gray-600 hover:text-blue-600 transition">시설 안내</a></li>
                    </ul>
                </div>

                <!-- 수강생 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-users text-purple-600 mr-2"></i>
                        수강생
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/#reviews" class="text-gray-600 hover:text-blue-600 transition">수강 후기</a></li>
                        <li><a href="/#portfolio" class="text-gray-600 hover:text-blue-600 transition">포트폴리오</a></li>
                        <li><a href="/#prototype-gallery" class="text-gray-600 hover:text-blue-600 transition">시제품 갤러리</a></li>
                    </ul>
                </div>

                <!-- 고객 지원 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-headset text-orange-600 mr-2"></i>
                        고객 지원
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/#contact" class="text-gray-600 hover:text-blue-600 transition">상담 신청</a></li>
                        <li><a href="/#board" class="text-gray-600 hover:text-blue-600 transition">게시판</a></li>
                        <li><a href="/#search" class="text-gray-600 hover:text-blue-600 transition">수강료 조회</a></li>
                    </ul>
                </div>

                <!-- 협력 기관 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-handshake text-teal-600 mr-2"></i>
                        협력 기관
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/#partners" class="text-gray-600 hover:text-blue-600 transition">협력 기관 소개</a></li>
                        <li><a href="/partnership" class="text-gray-600 hover:text-blue-600 transition">제휴 제안</a></li>
                    </ul>
                </div>

                <!-- 정보 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-info-circle text-gray-600 mr-2"></i>
                        정보
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/terms" class="text-gray-600 hover:text-blue-600 transition">이용약관</a></li>
                        <li><a href="/privacy" class="text-gray-600 hover:text-blue-600 transition">개인정보보호정책</a></li>
                        <li><a href="/sitemap" class="text-gray-600 hover:text-blue-600 transition">사이트맵</a></li>
                    </ul>
                </div>

                <!-- API -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-code text-indigo-600 mr-2"></i>
                        개발자
                    </h2>
                    <ul class="space-y-2">
                        <li><a href="/api" class="text-gray-600 hover:text-blue-600 transition">API 문서</a></li>
                        <li><a href="/api/health" class="text-gray-600 hover:text-blue-600 transition">헬스체크</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 학생학사행정시스템 페이지
// ============================================
app.get('/student-admin', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>학생학사행정시스템 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4 flex items-center">
                    <i class="fas fa-user-graduate mr-4"></i>
                    학생학사행정시스템
                </h1>
                <p class="text-xl text-blue-100">학생을 위한 종합 학사 관리 시스템</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 메뉴 그리드 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- 수강 신청 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <i class="fas fa-edit text-3xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">수강 신청</h3>
                    <p class="text-gray-600 mb-4">개설된 과정에 수강 신청을 할 수 있습니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 수강 내역 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <i class="fas fa-list-ul text-3xl text-green-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">수강 내역</h3>
                    <p class="text-gray-600 mb-4">나의 수강 신청 내역과 진행 상황을 확인합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 성적 조회 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <i class="fas fa-chart-line text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">성적 조회</h3>
                    <p class="text-gray-600 mb-4">수강한 과정의 성적과 평가를 확인합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 수료증 발급 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                        <i class="fas fa-certificate text-3xl text-yellow-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">수료증 발급</h3>
                    <p class="text-gray-600 mb-4">과정 수료 후 수료증을 발급받을 수 있습니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 학습 자료실 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <i class="fas fa-folder-open text-3xl text-red-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">학습 자료실</h3>
                    <p class="text-gray-600 mb-4">강의 자료와 참고 자료를 다운로드합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 개인정보 수정 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <i class="fas fa-user-cog text-3xl text-indigo-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">개인정보 수정</h3>
                    <p class="text-gray-600 mb-4">나의 개인정보와 프로필을 관리합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>

            <!-- 공지사항 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <i class="fas fa-bullhorn text-primary-600 mr-3"></i>
                    학사 공지사항
                </h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <div class="flex items-center space-x-4">
                            <span class="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">중요</span>
                            <span class="text-gray-800 font-medium">2025년 1학기 수강신청 일정 안내</span>
                        </div>
                        <span class="text-gray-500 text-sm">2025-01-15</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <div class="flex items-center space-x-4">
                            <span class="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">일반</span>
                            <span class="text-gray-800 font-medium">학사일정 변경 안내</span>
                        </div>
                        <span class="text-gray-500 text-sm">2025-01-10</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <div class="flex items-center space-x-4">
                            <span class="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">행사</span>
                            <span class="text-gray-800 font-medium">수료생 작품 전시회 개최</span>
                        </div>
                        <span class="text-gray-500 text-sm">2025-01-05</span>
                    </div>
                </div>
            </div>

            <!-- 도움말 -->
            <div class="bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg">
                <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-info-circle text-primary-600 mr-2"></i>
                    시스템 이용 안내
                </h3>
                <ul class="space-y-2 text-gray-700">
                    <li><i class="fas fa-check text-green-600 mr-2"></i>로그인 후 모든 기능을 이용하실 수 있습니다.</li>
                    <li><i class="fas fa-check text-green-600 mr-2"></i>수강신청은 개강 2주 전부터 가능합니다.</li>
                    <li><i class="fas fa-check text-green-600 mr-2"></i>문의사항은 고객센터(02-1234-5678)로 연락 주세요.</li>
                </ul>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 강사학사행정시스템 페이지
// ============================================
app.get('/teacher-admin', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>강사학사행정시스템 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-green-600 to-teal-700 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4 flex items-center">
                    <i class="fas fa-chalkboard-teacher mr-4"></i>
                    강사학사행정시스템
                </h1>
                <p class="text-xl text-green-100">강사를 위한 종합 학사 관리 시스템</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 메뉴 그리드 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- 강의 관리 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <i class="fas fa-chalkboard text-3xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">강의 관리</h3>
                    <p class="text-gray-600 mb-4">담당 강의 목록과 강의 계획을 관리합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 수강생 관리 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <i class="fas fa-users text-3xl text-green-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">수강생 관리</h3>
                    <p class="text-gray-600 mb-4">수강생 명단과 출결 현황을 확인합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 성적 입력 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <i class="fas fa-pencil-alt text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">성적 입력</h3>
                    <p class="text-gray-600 mb-4">수강생들의 과제 및 시험 성적을 입력합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 출결 관리 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                        <i class="fas fa-clipboard-check text-3xl text-yellow-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">출결 관리</h3>
                    <p class="text-gray-600 mb-4">수강생들의 출석 상황을 기록하고 관리합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 강의 자료 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <i class="fas fa-file-upload text-3xl text-red-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">강의 자료</h3>
                    <p class="text-gray-600 mb-4">강의 자료와 과제를 업로드하고 관리합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>

                <!-- 강의 평가 -->
                <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                    <div class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <i class="fas fa-star text-3xl text-indigo-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">강의 평가</h3>
                    <p class="text-gray-600 mb-4">수강생들의 강의 평가 결과를 확인합니다.</p>
                    <button class="text-primary-600 font-semibold hover:text-primary-700">
                        바로가기 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>

            <!-- 강의 일정 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <i class="fas fa-calendar-alt text-primary-600 mr-3"></i>
                    이번 주 강의 일정
                </h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center space-x-4">
                            <div class="flex flex-col items-center bg-primary-600 text-white rounded-lg p-3 min-w-[60px]">
                                <span class="text-xs font-semibold">월</span>
                                <span class="text-2xl font-bold">27</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800">3D 프린팅 기초과정</h4>
                                <p class="text-sm text-gray-600">09:00 - 12:00 | 홍대센터 A강의실</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">진행예정</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center space-x-4">
                            <div class="flex flex-col items-center bg-primary-600 text-white rounded-lg p-3 min-w-[60px]">
                                <span class="text-xs font-semibold">화</span>
                                <span class="text-2xl font-bold">28</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800">Fusion 360 모델링</h4>
                                <p class="text-sm text-gray-600">14:00 - 18:00 | 홍대센터 B강의실</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">진행예정</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center space-x-4">
                            <div class="flex flex-col items-center bg-primary-600 text-white rounded-lg p-3 min-w-[60px]">
                                <span class="text-xs font-semibold">목</span>
                                <span class="text-2xl font-bold">30</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800">산업용 3D 프린팅</h4>
                                <p class="text-sm text-gray-600">10:00 - 13:00 | 홍대센터 C강의실</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">진행예정</span>
                    </div>
                </div>
            </div>

            <!-- 통계 -->
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-lg font-semibold">진행 중인 강의</h4>
                        <i class="fas fa-chalkboard text-2xl opacity-75"></i>
                    </div>
                    <p class="text-4xl font-bold">3</p>
                    <p class="text-sm text-blue-100 mt-2">개 과정</p>
                </div>
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-lg font-semibold">총 수강생</h4>
                        <i class="fas fa-users text-2xl opacity-75"></i>
                    </div>
                    <p class="text-4xl font-bold">48</p>
                    <p class="text-sm text-green-100 mt-2">명</p>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-lg font-semibold">평균 출석률</h4>
                        <i class="fas fa-chart-line text-2xl opacity-75"></i>
                    </div>
                    <p class="text-4xl font-bold">92%</p>
                    <p class="text-sm text-purple-100 mt-2">지난 달 기준</p>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-lg font-semibold">강의 평가</h4>
                        <i class="fas fa-star text-2xl opacity-75"></i>
                    </div>
                    <p class="text-4xl font-bold">4.8</p>
                    <p class="text-sm text-orange-100 mt-2">/ 5.0</p>
                </div>
            </div>

            <!-- 도움말 -->
            <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-info-circle text-green-600 mr-2"></i>
                    시스템 이용 안내
                </h3>
                <ul class="space-y-2 text-gray-700">
                    <li><i class="fas fa-check text-green-600 mr-2"></i>로그인 후 모든 기능을 이용하실 수 있습니다.</li>
                    <li><i class="fas fa-check text-green-600 mr-2"></i>출결 및 성적 입력은 매주 금요일까지 완료해 주세요.</li>
                    <li><i class="fas fa-check text-green-600 mr-2"></i>문의사항은 교무팀(02-1234-5679)으로 연락 주세요.</li>
                </ul>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 관리자 대시보드 페이지
// ============================================
app.get('/admin', (c) => {
    return c.html(adminDashboardHtml);
});

// 관리자 - 채용공고 관리 페이지
app.get('/admin/jobs', (c) => {
    return c.html(adminJobsListHtml);
});

// 관리자 - 인재풀 관리 페이지
app.get('/admin/jobseekers', (c) => {
    return c.html(adminJobseekersListHtml);
});

// 관리자 - 교육과정 관리 페이지
app.get('/admin/courses', (c) => {
    return c.html(adminCoursesListHtml);
});

// 관리자 - 수강생 관리 페이지
app.get('/admin/students', (c) => {
    return c.html(adminStudentsListHtml);
});

// 관리자 - 시험/문제 관리 페이지
app.get('/admin/exams', (c) => {
    return c.html(adminExamsHtml);
});

app.get('/admin/exams/create', (c) => {
    return c.html(adminExamCreateHtml);
});

app.get('/admin/exams/:id/edit', (c) => {
    return c.html(adminExamEditHtml);
});

// 관리자 - 성적 관리 페이지
app.get('/admin/grades', (c) => {
    return c.html(adminGradesHtml);
});

// 학생 - 시험 응시 페이지
app.get('/student/exam/:id', (c) => {
    return c.html(studentExamHtml);
});

// 학생 - 나의 강의실 (대시보드)
app.get('/my-classroom', (c) => {
    return c.html(studentDashboardHtml);
});

// 관리자 - 리뷰 관리 페이지
app.get('/admin/reviews', (c) => {
    return c.html(adminReviewsListHtml);
});

// 관리자 - 게시판 관리 페이지
app.get('/admin/posts', (c) => {
    return c.html(adminPostsListHtml);
});

// ============================================
// 인사말 페이지
// ============================================
app.get('/greeting', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>인사말 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    <i class="fas fa-hands-helping mr-4"></i>
                    원장 인사말
                </h1>
                <p class="text-xl text-blue-100">와우쓰리디홍대센터와 함께하는 미래</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 센터장 소개 카드 -->
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                <div class="grid md:grid-cols-5 gap-0">
                    <!-- 센터장 사진 영역 -->
                    <div class="md:col-span-2 bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-12">
                        <div class="text-center">
                            <div class="w-48 h-48 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <i class="fas fa-user-tie text-7xl text-primary-600"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">김순희 / 서정주</h3>
                            <p class="text-lg text-gray-600 font-semibold">원장</p>
                            <div class="mt-6 space-y-2">
                                <div class="flex items-center justify-center text-gray-700">
                                    <i class="fas fa-envelope mr-2 text-primary-600"></i>
                                    <span class="text-sm">director@wow3dcookie.kr</span>
                                </div>
                                <div class="flex items-center justify-center text-gray-700">
                                    <i class="fas fa-phone mr-2 text-primary-600"></i>
                                    <span class="text-sm">02-1234-5678</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 인사말 내용 -->
                    <div class="md:col-span-3 p-8 md:p-12">
                        <div class="prose prose-lg max-w-none">
                            <h2 class="text-3xl font-bold text-gray-800 mb-6">
                                미래를 함께 만들어가는<br>
                                <span class="text-primary-600">와우쓰리디홍대센터</span>
                            </h2>
                            
                            <div class="space-y-6 text-gray-700 leading-relaxed">
                                <p class="text-lg">
                                    안녕하십니까. 와우쓰리디홍대센터 원장 김순희/서정주입니다.
                                </p>
                                
                                <p>
                                    4차 산업혁명 시대를 맞이하여 3D프린팅 기술은 제조업의 혁신을 이끄는 핵심 기술로 자리매김하고 있습니다. 
                                    와우쓰리디홍대센터는 이러한 시대적 요구에 부응하여 3D프린팅 전문 인력 양성에 힘쓰고 있습니다.
                                </p>
                                
                                <p>
                                    저희 센터는 <strong class="text-primary-600">체계적인 교육 커리큘럼</strong>과 <strong class="text-primary-600">최신 장비</strong>를 갖추고 있으며, 
                                    산업현장에서 요구하는 실무 중심의 교육을 제공합니다. 
                                    국가자격증 취득부터 실무 프로젝트 수행까지, 학생 여러분의 성공적인 커리어를 위해 최선을 다하겠습니다.
                                </p>
                                
                                <p>
                                    또한 기업 맞춤형 교육과 대학 산학협력 프로그램을 통해 산업계와 교육계의 가교 역할을 충실히 수행하고 있습니다.
                                </p>
                                
                                <p class="text-lg font-semibold text-gray-800">
                                    와우쓰리디홍대센터가 여러분의 꿈을 현실로 만드는 든든한 동반자가 되겠습니다.
                                </p>
                                
                                <p class="text-right mt-8">
                                    <span class="text-gray-600">감사합니다.</span><br>
                                    <strong class="text-xl text-gray-800">원장 김순희 / 서정주</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 센터 비전 & 목표 -->
            <div class="grid md:grid-cols-3 gap-8 mb-12">
                <div class="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-primary-600">
                    <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-bullseye text-3xl text-primary-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">교육 목표</h3>
                    <p class="text-gray-600 leading-relaxed">
                        실무 중심의 3D프린팅 전문가 양성과 국가자격증 합격률 최고 달성
                    </p>
                </div>
                
                <div class="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-600">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-lightbulb text-3xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">핵심 가치</h3>
                    <p class="text-gray-600 leading-relaxed">
                        혁신적인 교육 방법과 학생 중심의 맞춤형 지도로 최고의 교육 품질 제공
                    </p>
                </div>
                
                <div class="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-indigo-600">
                    <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-rocket text-3xl text-indigo-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">미래 비전</h3>
                    <p class="text-gray-600 leading-relaxed">
                        대한민국 최고의 3D프린팅 교육기관으로 성장하여 산업 발전에 기여
                    </p>
                </div>
            </div>

            <!-- 센터 연혁 -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <i class="fas fa-history text-primary-600 mr-3"></i>
                    센터 연혁
                </h2>
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-32 font-bold text-primary-600 text-lg">2024.03</div>
                        <div class="flex-1 border-l-4 border-primary-200 pl-6 pb-6">
                            <div class="font-semibold text-gray-800 mb-2">전주센터 개설</div>
                            <p class="text-gray-600">전북특별자치도 지역 3D프린팅 교육 확대</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-32 font-bold text-primary-600 text-lg">2023.09</div>
                        <div class="flex-1 border-l-4 border-primary-200 pl-6 pb-6">
                            <div class="font-semibold text-gray-800 mb-2">구미센터 개설</div>
                            <p class="text-gray-600">경북 지역 첨단 의료기술 교육센터 설립</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-32 font-bold text-primary-600 text-lg">2022.05</div>
                        <div class="flex-1 border-l-4 border-primary-200 pl-6 pb-6">
                            <div class="font-semibold text-gray-800 mb-2">대학 산학협력 프로그램 시작</div>
                            <p class="text-gray-600">10개 대학과 3D프린팅 교육 협력</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-32 font-bold text-primary-600 text-lg">2021.01</div>
                        <div class="flex-1 border-l-4 border-primary-200 pl-6">
                            <div class="font-semibold text-gray-800 mb-2">와우쓰리디홍대센터 설립</div>
                            <p class="text-gray-600">서울 마포구 홍대 지역에 본점 개설</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA 버튼 -->
            <div class="text-center">
                <a href="/online-consulting" class="inline-block bg-gradient-to-r from-primary-600 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl">
                    <i class="fas fa-comments mr-2"></i>
                    상담 신청하기
                </a>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 교육사진 갤러리 페이지
// ============================================
app.get('/education-photos', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>교육사진 - 와우쓰리디홍대센터</title>
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
          .gallery-item {
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            align-items: center;
            justify-content: center;
          }
          .modal.active {
            display: flex;
          }
          .modal-content {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
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
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    <i class="fas fa-images mr-4"></i>
                    교육사진 갤러리
                </h1>
                <p class="text-xl text-purple-100">생생한 교육 현장을 만나보세요</p>
            </div>
        </div>

        <!-- 갤러리 필터 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-wrap justify-center gap-4 mb-8">
                <button onclick="filterGallery('all')" class="filter-btn px-6 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">
                    전체보기
                </button>
                <button onclick="filterGallery('class')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition border border-gray-300">
                    수업 현장
                </button>
                <button onclick="filterGallery('equipment')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition border border-gray-300">
                    장비 및 시설
                </button>
                <button onclick="filterGallery('projects')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition border border-gray-300">
                    학생 작품
                </button>
                <button onclick="filterGallery('events')" class="filter-btn px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition border border-gray-300">
                    행사 및 이벤트
                </button>
            </div>

            <!-- 갤러리 그리드 -->
            <div id="galleryGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <!-- 수업 현장 사진들 -->
                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="class" onclick="openModal('/static/gallery1.jpg', '3D 모델링 수업')">
                    <div class="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <i class="fas fa-chalkboard-teacher text-6xl text-blue-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">3D 모델링 수업</h3>
                        <p class="text-sm text-gray-600">실습 중심의 수업 진행</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="class" onclick="openModal('/static/gallery2.jpg', '프린팅 실습')">
                    <div class="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <i class="fas fa-users text-6xl text-green-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">프린팅 실습</h3>
                        <p class="text-sm text-gray-600">학생들의 실습 현장</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="class" onclick="openModal('/static/gallery3.jpg', '강사 시연')">
                    <div class="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <i class="fas fa-user-graduate text-6xl text-purple-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">강사 시연</h3>
                        <p class="text-sm text-gray-600">전문 강사의 실무 시연</p>
                    </div>
                </div>

                <!-- 장비 및 시설 사진들 -->
                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="equipment" onclick="openModal('/static/gallery4.jpg', '3D 프린터')">
                    <div class="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <i class="fas fa-print text-6xl text-orange-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">3D 프린터</h3>
                        <p class="text-sm text-gray-600">최신 3D 프린팅 장비</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="equipment" onclick="openModal('/static/gallery5.jpg', '실습실')">
                    <div class="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                        <i class="fas fa-desktop text-6xl text-cyan-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">실습실</h3>
                        <p class="text-sm text-gray-600">쾌적한 실습 환경</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="equipment" onclick="openModal('/static/gallery6.jpg', '3D 스캐너')">
                    <div class="aspect-square bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <i class="fas fa-camera text-6xl text-red-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">3D 스캐너</h3>
                        <p class="text-sm text-gray-600">고성능 3D 스캐닝 장비</p>
                    </div>
                </div>

                <!-- 학생 작품 사진들 -->
                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="projects" onclick="openModal('/static/gallery7.jpg', '작품 전시')">
                    <div class="aspect-square bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                        <i class="fas fa-palette text-6xl text-indigo-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">작품 전시</h3>
                        <p class="text-sm text-gray-600">학생들의 우수 작품</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="projects" onclick="openModal('/static/gallery8.jpg', '프로젝트 결과물')">
                    <div class="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                        <i class="fas fa-cube text-6xl text-pink-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">프로젝트 결과물</h3>
                        <p class="text-sm text-gray-600">실무 프로젝트 완성작</p>
                    </div>
                </div>

                <!-- 행사 및 이벤트 사진들 -->
                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="events" onclick="openModal('/static/gallery9.jpg', '수료식')">
                    <div class="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                        <i class="fas fa-certificate text-6xl text-yellow-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">수료식</h3>
                        <p class="text-sm text-gray-600">과정 수료 기념</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="events" onclick="openModal('/static/gallery10.jpg', '특강')">
                    <div class="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <i class="fas fa-microphone text-6xl text-teal-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">특강</h3>
                        <p class="text-sm text-gray-600">산업 전문가 특강</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="events" onclick="openModal('/static/gallery11.jpg', '워크샵')">
                    <div class="aspect-square bg-gradient-to-br from-lime-100 to-lime-200 flex items-center justify-center">
                        <i class="fas fa-hands-helping text-6xl text-lime-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">워크샵</h3>
                        <p class="text-sm text-gray-600">실무 워크샵 진행</p>
                    </div>
                </div>

                <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md" data-category="class" onclick="openModal('/static/gallery12.jpg', '그룹 스터디')">
                    <div class="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                        <i class="fas fa-user-friends text-6xl text-rose-600"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-1">그룹 스터디</h3>
                        <p class="text-sm text-gray-600">팀별 협업 학습</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 이미지 모달 -->
        <div id="imageModal" class="modal" onclick="closeModal()">
            <button class="absolute top-8 right-8 text-white text-4xl hover:text-gray-300 transition z-50" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
            <img id="modalImage" class="modal-content" src="" alt="">
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold bg-black bg-opacity-50 px-6 py-3 rounded-lg" id="modalCaption"></div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>

        <script>
          // 갤러리 필터 함수
          function filterGallery(category) {
            const items = document.querySelectorAll('.gallery-item');
            const buttons = document.querySelectorAll('.filter-btn');
            
            // 버튼 스타일 업데이트
            buttons.forEach(btn => {
              btn.classList.remove('bg-primary-600', 'text-white');
              btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            event.target.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            event.target.classList.add('bg-primary-600', 'text-white');
            
            // 아이템 필터링
            items.forEach(item => {
              if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                  item.style.opacity = '1';
                  item.style.transform = 'scale(1)';
                }, 10);
              } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                  item.style.display = 'none';
                }, 300);
              }
            });
          }

          // 모달 열기
          function openModal(imageSrc, caption) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const modalCaption = document.getElementById('modalCaption');
            
            modal.classList.add('active');
            modalImg.src = imageSrc;
            modalCaption.textContent = caption;
            document.body.style.overflow = 'hidden';
          }

          // 모달 닫기
          function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
          }

          // ESC 키로 모달 닫기
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              closeModal();
            }
          });
        </script>
    </body>
    </html>
  `);
});

// ============================================
// 시설현황 페이지
// ============================================
app.get('/facilities', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>시설현황 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    <i class="fas fa-building mr-4"></i>
                    시설 현황
                </h1>
                <p class="text-xl text-indigo-100">최첨단 교육 시설과 장비를 갖춘 학습 환경</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 시설 개요 -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">최고의 교육 환경</h2>
                <p class="text-lg text-gray-700 text-center leading-relaxed max-w-4xl mx-auto mb-8">
                    와우쓰리디홍대센터는 최신 3D프린팅 장비와 쾌적한 교육 시설을 갖추고 있습니다.<br>
                    실무 중심의 교육을 위한 최적의 학습 환경을 제공합니다.
                </p>
                
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div class="text-4xl font-bold text-primary-600 mb-2">500㎡</div>
                        <div class="text-gray-700 font-semibold">총 교육공간</div>
                    </div>
                    <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div class="text-4xl font-bold text-green-600 mb-2">50대</div>
                        <div class="text-gray-700 font-semibold">최신 PC 장비</div>
                    </div>
                    <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div class="text-4xl font-bold text-purple-600 mb-2">30대</div>
                        <div class="text-gray-700 font-semibold">3D 프린터</div>
                    </div>
                    <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                        <div class="text-4xl font-bold text-orange-600 mb-2">10대</div>
                        <div class="text-gray-700 font-semibold">3D 스캐너</div>
                    </div>
                </div>
            </div>

            <!-- 주요 시설 -->
            <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">주요 시설</h2>
            
            <div class="space-y-8 mb-12">
                <!-- 실습실 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="grid md:grid-cols-2 gap-0">
                        <div class="aspect-video bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center">
                            <i class="fas fa-desktop text-8xl text-blue-600"></i>
                        </div>
                        <div class="p-8">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-desktop text-xl text-blue-600"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-800">실습실</h3>
                            </div>
                            <p class="text-gray-700 mb-4 leading-relaxed">
                                최신 사양의 고성능 워크스테이션을 갖춘 실습실입니다. 
                                각 좌석마다 듀얼 모니터가 설치되어 있어 효율적인 3D 모델링 작업이 가능합니다.
                            </p>
                            <ul class="space-y-2 text-gray-600">
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                    고성능 워크스테이션 50대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                    듀얼 모니터 시스템
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                    최신 3D 소프트웨어 라이선스
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                    개인별 독립 작업 공간
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 3D 프린팅실 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="grid md:grid-cols-2 gap-0">
                        <div class="aspect-video bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center md:order-2">
                            <i class="fas fa-print text-8xl text-green-600"></i>
                        </div>
                        <div class="p-8 md:order-1">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-print text-xl text-green-600"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-800">3D 프린팅실</h3>
                            </div>
                            <p class="text-gray-700 mb-4 leading-relaxed">
                                다양한 방식의 3D 프린터를 보유하고 있어 여러 재료와 기술을 실습할 수 있습니다.
                                FDM, SLA, SLS 등 산업 현장에서 사용되는 모든 방식을 경험할 수 있습니다.
                            </p>
                            <ul class="space-y-2 text-gray-600">
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                                    FDM 방식 프린터 20대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                                    SLA 레진 프린터 7대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                                    산업용 SLS 프린터 3대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                                    후처리 장비 완비
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 3D 스캐닝실 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="grid md:grid-cols-2 gap-0">
                        <div class="aspect-video bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                            <i class="fas fa-camera text-8xl text-purple-600"></i>
                        </div>
                        <div class="p-8">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-camera text-xl text-purple-600"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-800">3D 스캐닝실</h3>
                            </div>
                            <p class="text-gray-700 mb-4 leading-relaxed">
                                정밀한 3D 스캐닝 장비를 통해 실제 물체를 디지털 데이터로 변환하는 기술을 습득할 수 있습니다.
                                휴대용부터 고정식 스캐너까지 다양한 장비를 보유하고 있습니다.
                            </p>
                            <ul class="space-y-2 text-gray-600">
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-purple-600 mr-3"></i>
                                    고정밀 데스크탑 스캐너 5대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-purple-600 mr-3"></i>
                                    휴대용 핸드헬드 스캐너 5대
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-purple-600 mr-3"></i>
                                    대형 물체 스캔 가능
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-purple-600 mr-3"></i>
                                    역설계 전용 소프트웨어
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 휴게실 및 편의시설 -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="grid md:grid-cols-2 gap-0">
                        <div class="aspect-video bg-gradient-to-br from-orange-100 to-yellow-200 flex items-center justify-center md:order-2">
                            <i class="fas fa-coffee text-8xl text-orange-600"></i>
                        </div>
                        <div class="p-8 md:order-1">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-coffee text-xl text-orange-600"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-800">휴게실 및 편의시설</h3>
                            </div>
                            <p class="text-gray-700 mb-4 leading-relaxed">
                                학습의 효율을 높이는 쾌적한 휴게 공간과 다양한 편의시설을 제공합니다.
                                학생들이 편안하게 쉬면서 네트워킹할 수 있는 공간입니다.
                            </p>
                            <ul class="space-y-2 text-gray-600">
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-orange-600 mr-3"></i>
                                    넓은 휴게 라운지
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-orange-600 mr-3"></i>
                                    무료 커피 & 음료
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-orange-600 mr-3"></i>
                                    전자레인지, 냉장고 구비
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle text-orange-600 mr-3"></i>
                                    사물함 및 개인 보관함
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 보유 장비 목록 -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <i class="fas fa-list-ul text-primary-600 mr-3"></i>
                    주요 보유 장비
                </h2>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <!-- 소프트웨어 -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-laptop-code text-blue-600 mr-2"></i>
                            3D 소프트웨어
                        </h3>
                        <ul class="space-y-3">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Autodesk Fusion 360 (50 라이선스)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                SolidWorks Professional (30 라이선스)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Blender (오픈소스)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Ultimaker Cura (슬라이싱)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Meshmixer (메쉬 편집)
                            </li>
                        </ul>
                    </div>

                    <!-- 하드웨어 -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-hdd text-green-600 mr-2"></i>
                            PC 사양
                        </h3>
                        <ul class="space-y-3">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                CPU: Intel Core i7-13700K / AMD Ryzen 9
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                GPU: NVIDIA RTX 4070 이상
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                RAM: 32GB DDR5
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Storage: 1TB NVMe SSD
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Monitor: 27" QHD 듀얼 모니터
                            </li>
                        </ul>
                    </div>

                    <!-- 3D 프린터 브랜드 -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-print text-purple-600 mr-2"></i>
                            3D 프린터 브랜드
                        </h3>
                        <ul class="space-y-3">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Stratasys (산업용)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Ultimaker S5 (FDM)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Formlabs Form 3 (SLA)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Creality CR-10 (교육용)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Prusa i3 MK3S+ (오픈소스)
                            </li>
                        </ul>
                    </div>

                    <!-- 3D 스캐너 -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-camera text-orange-600 mr-2"></i>
                            3D 스캐너 브랜드
                        </h3>
                        <ul class="space-y-3">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Artec Eva (휴대용)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                EinScan Pro 2X Plus (다목적)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Revopoint POP 2 (소형 물체)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Matter and Form V2 (데스크탑)
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-angle-right text-primary-600 mr-3"></i>
                                Creality CR-Scan 01 (입문용)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- CTA 섹션 -->
            <div class="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-xl shadow-2xl p-12 text-center text-white">
                <h2 class="text-3xl font-bold mb-4">최고의 시설에서 배우세요!</h2>
                <p class="text-xl mb-8 text-blue-100">직접 방문하여 시설을 둘러보실 수 있습니다</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="/locations" class="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        지점 안내
                    </a>
                    <a href="/online-consulting" class="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-lg">
                        <i class="fas fa-comments mr-2"></i>
                        시설 견학 신청
                    </a>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 지점안내 페이지
// ============================================
app.get('/locations', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>지점안내 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    <i class="fas fa-map-marker-alt mr-4"></i>
                    지점 안내
                </h1>
                <p class="text-xl text-green-100">전국 3개 지점에서 최고의 교육을 제공합니다</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 지점 개요 -->
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">전국 어디서나 만나는 와우쓰리디</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    서울, 구미, 전주 3개 지점에서 동일한 고품질 교육 서비스를 제공합니다.<br>
                    가까운 지점을 방문하여 상담받으세요.
                </p>
            </div>

            <!-- 지점 카드들 -->
            <div class="space-y-8 mb-12">
                <!-- 서울 본점 -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-primary-600">
                    <div class="grid md:grid-cols-5 gap-0">
                        <!-- 지점 정보 -->
                        <div class="md:col-span-3 p-8">
                            <div class="flex items-center mb-6">
                                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-building text-3xl text-primary-600"></i>
                                </div>
                                <div>
                                    <h3 class="text-3xl font-bold text-gray-800">서울 홍대센터</h3>
                                    <span class="inline-block bg-primary-600 text-white text-sm px-3 py-1 rounded-full mt-2 font-semibold">본점</span>
                                </div>
                            </div>
                            
                            <div class="space-y-4 mb-6">
                                <div class="flex items-start">
                                    <i class="fas fa-map-marker-alt text-primary-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">주소</div>
                                        <div class="text-gray-700">서울 마포구 독막로 93 상수빌딩 4층</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-phone text-primary-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">전화번호</div>
                                        <div class="text-gray-700">02-1234-5678</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-envelope text-primary-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">이메일</div>
                                        <div class="text-gray-700">seoul@wow3dcookie.kr</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-clock text-primary-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">운영시간</div>
                                        <div class="text-gray-700">
                                            평일 09:00 - 18:00<br>
                                            주말 10:00 - 17:00 (일요일 휴무)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <a href="https://map.naver.com/p/search/서울%20마포구%20독막로%2093" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                                    <i class="fas fa-map mr-2"></i>
                                    네이버 지도
                                </a>
                                <a href="https://map.kakao.com/link/search/서울%20마포구%20독막로%2093" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
                                    <i class="fas fa-map-marked-alt mr-2"></i>
                                    카카오맵
                                </a>
                                <a href="/online-consulting" class="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                                    <i class="fas fa-comments mr-2"></i>
                                    상담 신청
                                </a>
                            </div>
                        </div>

                        <!-- 지점 특징 -->
                        <div class="md:col-span-2 bg-gradient-to-br from-primary-50 to-blue-100 p-8">
                            <h4 class="text-xl font-bold text-gray-800 mb-6">센터 특징</h4>
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">본점</div>
                                        <div class="text-sm text-gray-600">2021년 설립, 최고 시설</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">교통 편리</div>
                                        <div class="text-sm text-gray-600">홍대입구역 도보 10분</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">최대 규모</div>
                                        <div class="text-sm text-gray-600">500㎡ 교육 공간</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">전 과정 운영</div>
                                        <div class="text-sm text-gray-600">모든 교육과정 개설</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 구미센터 -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-green-600">
                    <div class="grid md:grid-cols-5 gap-0">
                        <!-- 지점 정보 -->
                        <div class="md:col-span-3 p-8">
                            <div class="flex items-center mb-6">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-building text-3xl text-green-600"></i>
                                </div>
                                <div>
                                    <h3 class="text-3xl font-bold text-gray-800">구미센터</h3>
                                    <span class="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded-full mt-2 font-semibold">경북 지역</span>
                                </div>
                            </div>
                            
                            <div class="space-y-4 mb-6">
                                <div class="flex items-start">
                                    <i class="fas fa-map-marker-alt text-green-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">주소</div>
                                        <div class="text-gray-700">경북 구미시 산호대로 253 구미첨단의료기술타워 606호</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-phone text-green-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">전화번호</div>
                                        <div class="text-gray-700">054-456-7890</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-envelope text-green-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">이메일</div>
                                        <div class="text-gray-700">gumi@wow3dcookie.kr</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-clock text-green-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">운영시간</div>
                                        <div class="text-gray-700">
                                            평일 09:00 - 18:00<br>
                                            주말 예약제 운영
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <a href="https://map.naver.com/p/search/경북%20구미시%20산호대로%20253" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                                    <i class="fas fa-map mr-2"></i>
                                    네이버 지도
                                </a>
                                <a href="https://map.kakao.com/link/search/경북%20구미시%20산호대로%20253" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
                                    <i class="fas fa-map-marked-alt mr-2"></i>
                                    카카오맵
                                </a>
                                <a href="/online-consulting" class="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                                    <i class="fas fa-comments mr-2"></i>
                                    상담 신청
                                </a>
                            </div>
                        </div>

                        <!-- 지점 특징 -->
                        <div class="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-100 p-8">
                            <h4 class="text-xl font-bold text-gray-800 mb-6">센터 특징</h4>
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">의료기술 특화</div>
                                        <div class="text-sm text-gray-600">첨단의료 3D프린팅 교육</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">산업단지 인접</div>
                                        <div class="text-sm text-gray-600">구미 국가산업단지 근처</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">기업 연계</div>
                                        <div class="text-sm text-gray-600">지역 기업 맞춤 교육</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">주차 편리</div>
                                        <div class="text-sm text-gray-600">무료 주차 가능</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 전주센터 -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-purple-600">
                    <div class="grid md:grid-cols-5 gap-0">
                        <!-- 지점 정보 -->
                        <div class="md:col-span-3 p-8">
                            <div class="flex items-center mb-6">
                                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-building text-3xl text-purple-600"></i>
                                </div>
                                <div>
                                    <h3 class="text-3xl font-bold text-gray-800">전주센터</h3>
                                    <span class="inline-block bg-purple-600 text-white text-sm px-3 py-1 rounded-full mt-2 font-semibold">전북특별자치도</span>
                                </div>
                            </div>
                            
                            <div class="space-y-4 mb-6">
                                <div class="flex items-start">
                                    <i class="fas fa-map-marker-alt text-purple-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">주소</div>
                                        <div class="text-gray-700">전북특별자치도 전주시 덕진구 반룡로 109 테크노빌 A동 207호</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-phone text-purple-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">전화번호</div>
                                        <div class="text-gray-700">063-234-5678</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-envelope text-purple-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">이메일</div>
                                        <div class="text-gray-700">jeonju@wow3dcookie.kr</div>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-clock text-purple-600 text-xl mr-4 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-gray-800 mb-1">운영시간</div>
                                        <div class="text-gray-700">
                                            평일 09:00 - 18:00<br>
                                            주말 예약제 운영
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <a href="https://map.naver.com/p/search/전북특별자치도%20전주시%20덕진구%20반룡로%20109" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                                    <i class="fas fa-map mr-2"></i>
                                    네이버 지도
                                </a>
                                <a href="https://map.kakao.com/link/search/전북특별자치도%20전주시%20덕진구%20반룡로%20109" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
                                    <i class="fas fa-map-marked-alt mr-2"></i>
                                    카카오맵
                                </a>
                                <a href="/online-consulting" class="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                                    <i class="fas fa-comments mr-2"></i>
                                    상담 신청
                                </a>
                            </div>
                        </div>

                        <!-- 지점 특징 -->
                        <div class="md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-100 p-8">
                            <h4 class="text-xl font-bold text-gray-800 mb-6">센터 특징</h4>
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">신규 개설</div>
                                        <div class="text-sm text-gray-600">2024년 최신 시설</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">대학 인접</div>
                                        <div class="text-sm text-gray-600">전북대, 전주대 근처</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">학생 할인</div>
                                        <div class="text-sm text-gray-600">대학생 특별 프로그램</div>
                                    </div>
                                </li>
                                <li class="flex items-start">
                                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">지역 밀착</div>
                                        <div class="text-sm text-gray-600">전북 지역 특화 교육</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 비교 표 -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">지점별 비교</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left font-bold text-gray-800">구분</th>
                                <th class="px-6 py-4 text-center font-bold text-primary-600">서울 홍대센터</th>
                                <th class="px-6 py-4 text-center font-bold text-green-600">구미센터</th>
                                <th class="px-6 py-4 text-center font-bold text-purple-600">전주센터</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 font-semibold text-gray-800">교육 공간</td>
                                <td class="px-6 py-4 text-center">500㎡</td>
                                <td class="px-6 py-4 text-center">350㎡</td>
                                <td class="px-6 py-4 text-center">300㎡</td>
                            </tr>
                            <tr class="bg-gray-50">
                                <td class="px-6 py-4 font-semibold text-gray-800">3D 프린터</td>
                                <td class="px-6 py-4 text-center">30대</td>
                                <td class="px-6 py-4 text-center">20대</td>
                                <td class="px-6 py-4 text-center">15대</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold text-gray-800">PC 장비</td>
                                <td class="px-6 py-4 text-center">50대</td>
                                <td class="px-6 py-4 text-center">35대</td>
                                <td class="px-6 py-4 text-center">30대</td>
                            </tr>
                            <tr class="bg-gray-50">
                                <td class="px-6 py-4 font-semibold text-gray-800">주차</td>
                                <td class="px-6 py-4 text-center">유료 주차</td>
                                <td class="px-6 py-4 text-center">무료 주차</td>
                                <td class="px-6 py-4 text-center">무료 주차</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold text-gray-800">주말 운영</td>
                                <td class="px-6 py-4 text-center text-green-600 font-semibold">토요일 정규</td>
                                <td class="px-6 py-4 text-center text-orange-600">예약제</td>
                                <td class="px-6 py-4 text-center text-orange-600">예약제</td>
                            </tr>
                            <tr class="bg-gray-50">
                                <td class="px-6 py-4 font-semibold text-gray-800">특화 분야</td>
                                <td class="px-6 py-4 text-center">전 분야</td>
                                <td class="px-6 py-4 text-center">의료/산업</td>
                                <td class="px-6 py-4 text-center">교육/문화</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- CTA 섹션 -->
            <div class="bg-gradient-to-r from-primary-600 to-purple-700 rounded-xl shadow-2xl p-12 text-center text-white">
                <h2 class="text-3xl font-bold mb-4">가까운 지점을 방문하세요!</h2>
                <p class="text-xl mb-8 text-blue-100">무료 상담 및 시설 견학이 가능합니다</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="/online-consulting" class="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                        <i class="fas fa-comments mr-2"></i>
                        온라인 상담 신청
                    </a>
                    <a href="tel:02-1234-5678" class="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-lg">
                        <i class="fas fa-phone mr-2"></i>
                        전화 문의하기
                    </a>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 온라인상담신청 페이지
// ============================================
app.get('/online-consulting', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>온라인상담신청 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4 flex items-center">
                    <i class="fas fa-comments mr-4"></i>
                    온라인 상담 신청
                </h1>
                <p class="text-xl text-blue-100">궁금하신 사항을 편하게 문의해주세요</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 상담 신청 폼 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">상담 신청서</h2>
                <form class="space-y-6">
                    <!-- 이름 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            이름 <span class="text-red-500">*</span>
                        </label>
                        <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="이름을 입력해주세요" required>
                    </div>

                    <!-- 연락처 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            연락처 <span class="text-red-500">*</span>
                        </label>
                        <input type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="010-0000-0000" required>
                    </div>

                    <!-- 이메일 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            이메일 <span class="text-red-500">*</span>
                        </label>
                        <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="email@example.com" required>
                    </div>

                    <!-- 상담 유형 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            상담 유형 <span class="text-red-500">*</span>
                        </label>
                        <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" required>
                            <option value="">선택해주세요</option>
                            <option value="course">과정 문의</option>
                            <option value="schedule">일정 문의</option>
                            <option value="price">수강료 문의</option>
                            <option value="certificate">자격증 문의</option>
                            <option value="etc">기타 문의</option>
                        </select>
                    </div>

                    <!-- 관심 과정 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            관심 과정
                        </label>
                        <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600">
                            <option value="">선택해주세요</option>
                            <option value="basic">3D 프린팅 기초과정</option>
                            <option value="fusion360">Fusion 360 모델링</option>
                            <option value="industrial">산업용 3D 프린팅</option>
                            <option value="youth">청소년 메이커 교육</option>
                            <option value="scanning">3D 스캐닝 & 리버스 엔지니어링</option>
                        </select>
                    </div>

                    <!-- 상담 내용 -->
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            상담 내용 <span class="text-red-500">*</span>
                        </label>
                        <textarea rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="궁금하신 사항을 자유롭게 작성해주세요" required></textarea>
                    </div>

                    <!-- 개인정보 동의 -->
                    <div class="flex items-start">
                        <input type="checkbox" id="privacy" class="mt-1 mr-2" required>
                        <label for="privacy" class="text-sm text-gray-600">
                            개인정보 수집 및 이용에 동의합니다. (필수)
                        </label>
                    </div>

                    <!-- 제출 버튼 -->
                    <button type="submit" class="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg">
                        상담 신청하기
                    </button>
                </form>
            </div>

            <!-- 안내 사항 -->
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-clock text-blue-600 mr-2"></i>
                        상담 시간
                    </h3>
                    <ul class="space-y-2 text-gray-700">
                        <li><i class="fas fa-check text-blue-600 mr-2"></i>평일: 09:00 - 18:00</li>
                        <li><i class="fas fa-check text-blue-600 mr-2"></i>주말: 10:00 - 17:00</li>
                        <li><i class="fas fa-check text-blue-600 mr-2"></i>공휴일 휴무</li>
                    </ul>
                </div>

                <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-phone text-green-600 mr-2"></i>
                        전화 상담
                    </h3>
                    <ul class="space-y-2 text-gray-700">
                        <li><i class="fas fa-check text-green-600 mr-2"></i>대표번호: 02-1234-5678</li>
                        <li><i class="fas fa-check text-green-600 mr-2"></i>팩스: 02-1234-5679</li>
                        <li><i class="fas fa-check text-green-600 mr-2"></i>이메일: info@wow3dcookie.kr</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 기업단체교육 페이지
// ============================================
app.get('/corporate-education', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>기업단체교육 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4 flex items-center">
                    <i class="fas fa-building mr-4"></i>
                    기업단체교육
                </h1>
                <p class="text-xl text-purple-100">귀사의 성장을 위한 맞춤형 3D프린팅 교육 솔루션</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 교육 소개 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-6">왜 기업교육이 필요한가요?</h2>
                <p class="text-gray-600 text-lg leading-relaxed mb-6">
                    4차 산업혁명 시대, 3D프린팅 기술은 제조업의 혁신을 이끌고 있습니다. 
                    와우쓰리디홍대센터는 기업의 실무에 바로 적용 가능한 실전 중심의 교육 프로그램을 제공합니다.
                </p>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center p-6 bg-blue-50 rounded-lg">
                        <div class="text-4xl font-bold text-blue-600 mb-2">200+</div>
                        <div class="text-gray-700">기업 교육 실적</div>
                    </div>
                    <div class="text-center p-6 bg-green-50 rounded-lg">
                        <div class="text-4xl font-bold text-green-600 mb-2">95%</div>
                        <div class="text-gray-700">교육 만족도</div>
                    </div>
                    <div class="text-center p-6 bg-purple-50 rounded-lg">
                        <div class="text-4xl font-bold text-purple-600 mb-2">1,500+</div>
                        <div class="text-gray-700">교육 이수 인원</div>
                    </div>
                </div>
            </div>

            <!-- 교육 프로그램 -->
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">맞춤형 교육 프로그램</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <i class="fas fa-cube text-3xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">3D프린팅 입문</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>3D프린팅 기술 이해</li>
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>실무 활용 사례 학습</li>
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>기초 모델링 실습</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">교육기간: 2일 (16시간)</div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <i class="fas fa-industry text-3xl text-green-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">제조업 특화</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-green-600 mr-2"></i>시제품 제작 프로세스</li>
                            <li><i class="fas fa-check text-green-600 mr-2"></i>역설계 및 3D스캐닝</li>
                            <li><i class="fas fa-check text-green-600 mr-2"></i>품질 관리 및 후처리</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">교육기간: 5일 (40시간)</div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                            <i class="fas fa-pencil-ruler text-3xl text-purple-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">설계 전문가 과정</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-purple-600 mr-2"></i>Fusion 360 마스터</li>
                            <li><i class="fas fa-check text-purple-600 mr-2"></i>파라메트릭 설계</li>
                            <li><i class="fas fa-check text-purple-600 mr-2"></i>CAM 가공 프로그래밍</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">교육기간: 10일 (80시간)</div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <i class="fas fa-chart-line text-3xl text-orange-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">경영진 워크샵</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-orange-600 mr-2"></i>3D프린팅 비즈니스 전략</li>
                            <li><i class="fas fa-check text-orange-600 mr-2"></i>디지털 전환 로드맵</li>
                            <li><i class="fas fa-check text-orange-600 mr-2"></i>투자 수익률(ROI) 분석</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">교육기간: 1일 (8시간)</div>
                    </div>
                </div>
            </div>

            <!-- 교육 혜택 -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-12 text-white">
                <h2 class="text-3xl font-bold mb-8 text-center">기업교육 특별 혜택</h2>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <i class="fas fa-percentage text-4xl mb-3"></i>
                        <h4 class="font-bold mb-2">단체 할인</h4>
                        <p class="text-sm text-blue-100">10명 이상 최대 30% 할인</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-map-marker-alt text-4xl mb-3"></i>
                        <h4 class="font-bold mb-2">방문 교육</h4>
                        <p class="text-sm text-blue-100">귀사로 직접 찾아가는 교육</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-calendar-alt text-4xl mb-3"></i>
                        <h4 class="font-bold mb-2">유연한 일정</h4>
                        <p class="text-sm text-blue-100">기업 일정에 맞춤 조율</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-certificate text-4xl mb-3"></i>
                        <h4 class="font-bold mb-2">수료증 발급</h4>
                        <p class="text-sm text-blue-100">공식 교육 이수증 제공</p>
                    </div>
                </div>
            </div>

            <!-- 문의하기 -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">기업교육 문의</h2>
                <div class="max-w-2xl mx-auto">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="text-center p-6 bg-gray-50 rounded-lg">
                            <i class="fas fa-phone text-3xl text-primary-600 mb-3"></i>
                            <h4 class="font-bold text-gray-800 mb-2">전화 문의</h4>
                            <p class="text-gray-600">02-1234-5678</p>
                            <p class="text-sm text-gray-500 mt-1">평일 09:00 - 18:00</p>
                        </div>
                        <div class="text-center p-6 bg-gray-50 rounded-lg">
                            <i class="fas fa-envelope text-3xl text-primary-600 mb-3"></i>
                            <h4 class="font-bold text-gray-800 mb-2">이메일 문의</h4>
                            <p class="text-gray-600">corporate@wow3dcookie.kr</p>
                            <p class="text-sm text-gray-500 mt-1">24시간 접수 가능</p>
                        </div>
                    </div>
                    <a href="/online-consulting" class="block w-full bg-primary-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg">
                        온라인 상담 신청하기
                    </a>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 채용정보 페이지 (공개)
// ============================================
app.get('/jobs', (c) => {
    return c.html(jobsListHtml);
});

// ============================================
// 수강후기 페이지 (공개)
// ============================================
app.get('/reviews', (c) => {
    return c.html(reviewsListHtml);
});

// ============================================
// 로그인/회원가입 페이지
// ============================================
app.get('/login', (c) => {
    return c.html(loginHtml);
});

app.get('/register', (c) => {
    return c.html(registerHtml);
});

// ============================================
// 대학맞춤교육 페이지
// ============================================
app.get('/university-education', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>대학맞춤교육 - 와우쓰리디홍대센터</title>
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
        <div class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-4 flex items-center">
                    <i class="fas fa-university mr-4"></i>
                    대학맞춤교육
                </h1>
                <p class="text-xl text-teal-100">대학교와 함께하는 미래 인재 양성 프로그램</p>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- 교육 소개 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-6">대학 특화 교육 프로그램</h2>
                <p class="text-gray-600 text-lg leading-relaxed mb-6">
                    와우쓰리디홍대센터는 대학교와 협력하여 학생들의 실무 역량 강화를 위한 
                    산학협력 교육 프로그램을 운영합니다. 이론과 실습을 결합한 체계적인 커리큘럼으로 
                    취업 경쟁력을 높이고 창의적인 메이커를 양성합니다.
                </p>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="text-center p-6 bg-teal-50 rounded-lg">
                        <div class="text-4xl font-bold text-teal-600 mb-2">30+</div>
                        <div class="text-gray-700">협력 대학</div>
                    </div>
                    <div class="text-center p-6 bg-cyan-50 rounded-lg">
                        <div class="text-4xl font-bold text-cyan-600 mb-2">2,000+</div>
                        <div class="text-gray-700">교육 학생 수</div>
                    </div>
                    <div class="text-center p-6 bg-blue-50 rounded-lg">
                        <div class="text-4xl font-bold text-blue-600 mb-2">150+</div>
                        <div class="text-gray-700">취업 연계</div>
                    </div>
                    <div class="text-center p-6 bg-indigo-50 rounded-lg">
                        <div class="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                        <div class="text-gray-700">과정 이수율</div>
                    </div>
                </div>
            </div>

            <!-- 교육 과정 -->
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">교육 과정</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                            <i class="fas fa-graduation-cap text-3xl text-teal-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">정규 교과목</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-teal-600 mr-2"></i>학점 인정 과목 개설</li>
                            <li><i class="fas fa-check text-teal-600 mr-2"></i>전공 연계 커리큘럼</li>
                            <li><i class="fas fa-check text-teal-600 mr-2"></i>실습 장비 지원</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">학기당 3학점</div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                            <i class="fas fa-certificate text-3xl text-cyan-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">자격증 특강</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-cyan-600 mr-2"></i>3D프린터운용기능사</li>
                            <li><i class="fas fa-check text-cyan-600 mr-2"></i>오토데스크 ACU</li>
                            <li><i class="fas fa-check text-cyan-600 mr-2"></i>합격률 95% 이상</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">2주 집중과정</div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                        <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <i class="fas fa-project-diagram text-3xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">캡스톤 디자인</h3>
                        <ul class="space-y-2 text-gray-600 mb-4">
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>실무 프로젝트 수행</li>
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>멘토링 및 컨설팅</li>
                            <li><i class="fas fa-check text-blue-600 mr-2"></i>작품 전시 및 발표</li>
                        </ul>
                        <div class="text-primary-600 font-semibold">한 학기 프로젝트</div>
                    </div>
                </div>
            </div>

            <!-- 협력 모델 -->
            <div class="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg shadow-lg p-8 mb-12 text-white">
                <h2 class="text-3xl font-bold mb-8 text-center">산학협력 모델</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-book text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-xl mb-2">교육 과정 개발</h4>
                        <p class="text-sm text-teal-100">대학 특성에 맞춘<br>맞춤형 커리큘럼 설계</p>
                    </div>
                    <div class="text-center">
                        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chalkboard-teacher text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-xl mb-2">강사 파견</h4>
                        <p class="text-sm text-teal-100">실무 경험 풍부한<br>전문 강사진 지원</p>
                    </div>
                    <div class="text-center">
                        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-tools text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-xl mb-2">장비 지원</h4>
                        <p class="text-sm text-teal-100">최신 3D프린터 및<br>소프트웨어 제공</p>
                    </div>
                </div>
            </div>

            <!-- 협력 대학 -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">주요 협력 대학</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">서울대학교</div>
                        <div class="text-sm text-gray-500">공과대학</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">고려대학교</div>
                        <div class="text-sm text-gray-500">미디어학부</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">연세대학교</div>
                        <div class="text-sm text-gray-500">공학대학</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">한양대학교</div>
                        <div class="text-sm text-gray-500">디자인대학</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">성균관대학교</div>
                        <div class="text-sm text-gray-500">기계공학부</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">홍익대학교</div>
                        <div class="text-sm text-gray-500">산업디자인</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">경희대학교</div>
                        <div class="text-sm text-gray-500">산업경영공학</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="font-semibold text-gray-800">중앙대학교</div>
                        <div class="text-sm text-gray-500">예술대학</div>
                    </div>
                </div>
            </div>

            <!-- 문의하기 -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">대학교육 협력 문의</h2>
                <div class="max-w-2xl mx-auto">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="text-center p-6 bg-gray-50 rounded-lg">
                            <i class="fas fa-phone text-3xl text-primary-600 mb-3"></i>
                            <h4 class="font-bold text-gray-800 mb-2">전화 문의</h4>
                            <p class="text-gray-600">02-1234-5680</p>
                            <p class="text-sm text-gray-500 mt-1">산학협력 담당자</p>
                        </div>
                        <div class="text-center p-6 bg-gray-50 rounded-lg">
                            <i class="fas fa-envelope text-3xl text-primary-600 mb-3"></i>
                            <h4 class="font-bold text-gray-800 mb-2">이메일 문의</h4>
                            <p class="text-gray-600">university@wow3dcookie.kr</p>
                            <p class="text-sm text-gray-500 mt-1">24시간 접수 가능</p>
                        </div>
                    </div>
                    <a href="/online-consulting" class="block w-full bg-primary-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg">
                        협력 제안서 신청하기
                    </a>
                </div>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// ============================================
// 뷰 라우팅
// ============================================
app.get('/jobs', (c) => c.html(jobsListHtml));
app.get('/reviews', (c) => c.html(reviewsListHtml));
app.get('/login', (c) => c.html(loginHtml));
app.get('/register', (c) => c.html(registerHtml));

// 관리자 페이지 라우팅
app.get('/admin', (c) => c.html(adminDashboardHtml));
app.get('/admin/jobs', (c) => c.html(adminJobsListHtml));
app.get('/admin/jobseekers', (c) => c.html(adminJobseekersListHtml));
app.get('/admin/courses', (c) => c.html(adminCoursesListHtml));
app.get('/admin/students', (c) => c.html(adminStudentsListHtml));
app.get('/admin/reviews', (c) => c.html(adminReviewsListHtml));
app.get('/admin/posts', (c) => c.html(adminPostsListHtml));

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
