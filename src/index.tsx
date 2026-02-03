import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware, requireAdmin } from './middleware/auth';
import { trackingMiddleware } from './middleware/tracking';

// API 라우트 임포트
import auth from './api/auth';
import courses from './api/courses';
import courseCategories from './api/course_categories';
import approvedCourses from './api/approved_courses';
import courseSessions from './api/course_sessions';
import campuses from './api/campuses';
import enrollments from './api/enrollments';
import reviews from './api/reviews';
import posts from './api/posts';

import schedules from './api/schedules';
import jobs from './api/jobs';
import jobseekers from './api/jobseekers';
import exams from './api/exams';
import students from './api/students';
import users from './api/users';
import consultations from './api/consultations';
import hrd from './api/hrd';
import ncs from './api/ncs';
import dashboard from './api/dashboard';
import portfolios from './api/portfolios';
import surveys from './api/surveys';
import assignments from './api/assignments';
import progress from './api/progress';
import attendance_qr from './api/attendance_qr';
import upload from './api/upload';
import partnerUniversities from './api/partner_universities';
import { setupApi } from './api/setup';
import { adminDashboardHtml } from './views/admin';
import { adminJobsListHtml } from './views/admin_jobs';
import { adminJobseekersListHtml } from './views/admin_jobseekers';
import { jobsListHtml } from './views/jobs';
import { jobseekersListHtml } from './views/jobseekers';
import { adminCoursesListHtml } from './views/admin_courses';
import {
    adminCoursesCategoriesHtml,
    adminCoursesApprovedHtml,
    adminCoursesApprovedRegisterHtml,
    adminCoursesSessionsHtml,
    adminCoursesSessionsRegisterHtml,
    adminCoursesCopyHtml,
} from './views/admin_courses_sub';
import { adminStudentsListHtml } from './views/admin_students';
import { adminHrdHtml } from './views/admin_hrd';
import { adminHrdPersonnelHtml } from './views/admin_hrd_personnel';
import { adminHrdItemsHtml } from './views/admin_hrd_items';
import { adminHrdItemsTransactionsHtml } from './views/admin_hrd_items_transactions';
import { adminHrdStudentsHtml } from './views/admin_hrd_students';
import { adminUsersHtml } from './views/admin_users';
import { adminHrdFacilitiesHtml } from './views/admin_hrd_facilities';
import { adminHrdAttendanceHtml } from './views/admin_hrd_attendance';
import { adminHrdAttendancePrintHtml } from './views/admin_hrd_attendance_print';
import { adminHrdCounselingHtml } from './views/admin_hrd_counseling';
import { adminNcsHtml } from './views/admin_ncs';
import { adminNcsViewerHtml } from './views/admin_ncs_viewer';
import { adminNcsApprovedHtml, adminNcsApprovedListHtml } from './views/admin_ncs_approved';
import { adminLmsDashboardHtml } from './views/admin_lms_dashboard';
import { adminLmsStudentsHtml } from './views/admin_lms_students';
import { adminLmsAttendanceHtml } from './views/admin_lms_attendance';
import { adminLmsNcsHtml } from './views/admin_lms_ncs';
import { adminLmsTrainingLogsHtml } from './views/admin_lms_training_logs';
import { adminHrdTrainingLogsHtml } from './views/admin_hrd_training_logs';
import { adminLmsNcsReportHtml } from './views/admin_lms_ncs_report';
import { adminLmsNcsStudentReportHtml } from './views/admin_lms_ncs_student_report';
import { adminLmsEmploymentHtml } from './views/admin_lms_employment';
import { adminLmsGradesHtml } from './views/admin_lms_grades';
import { adminLmsCounselingHtml } from './views/admin_lms_counseling';
import { adminLmsCbtHtml } from './views/admin_lms_cbt';
import { adminLmsSurveysHtml } from './views/admin_lms_surveys';
import { adminScheduleHtml } from './views/admin_schedule';
import { adminLmsAssignmentsHtml } from './views/admin_lms_assignments';
import { adminHrdAssignmentsHtml } from './views/admin_hrd_assignments';
import { adminHrdExamsHtml } from './views/admin_hrd_exams';
import { adminLmsQrAttendanceHtml } from './views/admin_lms_qr_attendance';
import { adminExamsHtml, adminExamCreateHtml, adminExamEditHtml } from './views/admin_exams';
import { adminExamResultsHtml } from './views/admin_exam_results';
import { studentExamHtml } from './views/student_exam';
import { studentDashboardHtml } from './views/student_dashboard';
import { teacherDashboardHtml } from './views/teacher_dashboard';
import { teacherPortfoliosHtml } from './views/teacher_portfolios';
import { teacherProfileHtml } from './views/teacher_profile';
import { teacherCoursesHtml } from './views/teacher_courses';
import { teacherStudentsHtml } from './views/teacher_students';
import { teacherAttendanceHtml } from './views/teacher_attendance';
import { teacherExamsHtml } from './views/teacher_exams';
import { teacherSidebar } from './views/components/teacher_sidebar';
import { hrdSidebar } from './views/components/hrd_sidebar';
import { adminHrdGradesHtml } from './views/admin_hrd_grades';
import { adminHrdNcsEvalHtml } from './views/admin_hrd_ncs_eval';
import { adminHrdSurveysHtml } from './views/admin_hrd_surveys';
import { reviewsListHtml } from './views/reviews';
import { loginHtml } from './views/login';
import { registerHtml } from './views/register';
import { adminReviewsListHtml } from './views/admin_reviews';
import { adminPostsListHtml } from './views/admin_posts';
import { adminInquiriesHtml } from './views/admin_inquiries';
import { adminPartnerUniversitiesHtml } from './views/admin_partner_universities';
// import { adminPortfoliosHtml } from './views/admin_portfolios'; // 게시판 관리에서 통합 관리
import { portfoliosListHtml } from './views/portfolios';
import { postsListHtml } from './views/posts';
import { prototypeGalleryHtml } from './views/prototype_gallery';
import { adminPrototypeGalleryHtml } from './views/admin_prototype_gallery';
import { educationGalleryHtml } from './views/education_gallery';
import { adminEducationGalleryHtml } from './views/admin_education_gallery';
import { scheduleHtml } from './views/schedule';
import { locationsHtml } from './views/locations';
import { coursesListHtml } from './views/courses';
import { achievementsHtml } from './views/achievements';
import { footerHtml } from './views/footer';
import { navigationHtml } from './views/components/navigation';
import { homeHtml } from './views/home';
import { layoutHtml } from './views/components/layout';


const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 글로벌 미들웨어
// ============================================
app.use('*', logger());
app.use('*', trackingMiddleware);

// CORS 설정 (API에만 적용)
app.use('/api/*', corsMiddleware);

// ============================================
// 정적 파일 서빙
// ============================================
app.use('/static/*', serveStatic({ root: './public', manifest: {} as any }));

// Favicon 핸들러 (404 에러 방지)
app.get('/favicon.ico', (c) => {
    // 빈 SVG 아이콘 반환
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍪</text></svg>`;
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400'
        }
    });
});

// ============================================
// API 라우트
// ============================================

// 인증 API (인증 불필요)
app.route('/api/auth', auth);

// 과정 API
app.route('/api/courses', courses);
app.route('/api/course-categories', courseCategories);
app.route('/api/approved-courses', approvedCourses);
app.route('/api/course-sessions', courseSessions);
app.route('/api/surveys', surveys);
app.route('/api/assignments', assignments);
app.route('/api/progress', progress);
app.route('/api/attendance-qr', attendance_qr);
app.route('/api/upload', upload);

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

// 포트폴리오 API
app.route('/api/portfolios', portfolios);

// 학생 관리 API
app.route('/api/students', students);

// 회원 관리 API (역할 및 권한)
app.route('/api/users', users);

// 협력대학 API (공개 GET + 관리자 CRUD)
app.route('/api/partner-universities', partnerUniversities);

// HRD 행정 API
app.route('/api/hrd', hrd);
app.route('/api/dashboard', dashboard);
app.get('/api/dashboard/website-stats', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;

        // 1. Total PV Today
        const todayPV = await DB.prepare(`
            SELECT count(*) as count FROM website_visits 
            WHERE date(timestamp) = date('now')
        `).first<{ count: number }>();

        // 2. Unique UV Today
        const todayUV = await DB.prepare(`
            SELECT count(DISTINCT ip_address) as count FROM website_visits 
            WHERE date(timestamp) = date('now')
        `).first<{ count: number }>();

        // 3. Weekly PV Trend (Last 7 days)
        const weeklyTrend = await DB.prepare(`
            SELECT date(timestamp) as date, count(*) as count 
            FROM website_visits 
            WHERE timestamp >= date('now', '-6 days')
            GROUP BY date
            ORDER BY date ASC
        `).all<{ date: string, count: number }>();

        // 4. Most Visited Pages
        const topPages = await DB.prepare(`
            SELECT page_visited, count(*) as count 
            FROM website_visits 
            GROUP BY page_visited 
            ORDER BY count DESC 
            LIMIT 5
        `).all<{ page_visited: string, count: number }>();

        return c.json({
            success: true,
            data: {
                todayPV: todayPV?.count || 0,
                todayUV: todayUV?.count || 0,
                weeklyTrend: weeklyTrend.results || [],
                topPages: topPages.results || []
            }
        });
    } catch (e) {
        console.error('Failed to fetch website stats:', e);
        return c.json({ success: false, error: 'Failed to fetch website stats' }, 500);
    }
});
app.route('/api/consultations', consultations);
app.route('/api/ncs', ncs);
app.route('/api/setup', setupApi);

app.get('/admin', (c) => c.html(adminDashboardHtml));
app.get('/admin/jobs', (c) => c.html(adminJobsListHtml));
app.get('/admin/jobseekers', (c) => c.html(adminJobseekersListHtml));
app.get('/admin/courses', (c) => c.html(adminCoursesListHtml()));
app.get('/admin/courses/categories', (c) => c.html(adminCoursesCategoriesHtml()));
app.get('/admin/courses/approved', (c) => c.html(adminCoursesApprovedHtml()));
app.get('/admin/courses/approved/register', (c) => c.html(adminCoursesApprovedRegisterHtml(c.req.query('id'))));

app.get('/admin/courses/approved/register/:id', (c) => c.html(adminCoursesApprovedRegisterHtml(c.req.param('id'))));
app.get('/admin/courses/sessions', (c) => c.html(adminCoursesSessionsHtml()));
app.get('/admin/courses/sessions/register', (c) => c.html(adminCoursesSessionsRegisterHtml()));
app.get('/admin/courses/sessions/register/:id', (c) => c.html(adminCoursesSessionsRegisterHtml(c.req.param('id'))));
app.get('/admin/courses/copy', (c) => c.html(adminCoursesCopyHtml()));
app.get('/admin/partner-universities', (c) => c.html(adminPartnerUniversitiesHtml));
app.get('/admin/users', (c) => c.html(adminUsersHtml())); // 회원관리 - 역할 및 권한 관리
app.get('/admin/hrd', (c) => c.html(adminHrdHtml()));
app.get('/admin/personnel', (c) => c.html(adminHrdPersonnelHtml()));
app.get('/admin/items', (c) => c.html(adminHrdItemsHtml()));
app.get('/admin/items/transactions', (c) => c.html(adminHrdItemsTransactionsHtml()));
app.get('/admin/students', (c) => c.html(adminHrdStudentsHtml()));
app.get('/admin/facilities', (c) => c.html(adminHrdFacilitiesHtml()));
app.get('/admin/schedule', (c) => c.html(adminScheduleHtml));
app.get('/admin/attendance', (c) => c.html(adminHrdAttendanceHtml()));
app.get('/admin/attendance/print', (c) => c.html(adminHrdAttendancePrintHtml));
app.get('/admin/training-logs', (c) => c.html(adminHrdTrainingLogsHtml()));
app.get('/admin/assignments', (c) => c.html(adminHrdAssignmentsHtml()));
app.get('/admin/counseling', (c) => c.html(adminHrdCounselingHtml));
app.get('/admin/ncs', (c) => c.html(adminNcsHtml));
app.get('/admin/ncs/viewer', (c) => c.html(adminNcsViewerHtml()));
app.get('/admin/ncs/approved', (c) => c.redirect('/admin/courses/approved'));
app.get('/admin/ncs/approved/list', (c) => c.redirect('/admin/courses/approved'));
app.get('/admin/ncs/approved/:step', (c) => {
    const id = c.req.query('id');
    if (id) {
        return c.redirect(`/admin/courses/approved/register?id=${id}&tab=ncs`);
    }
    return c.redirect('/admin/courses/approved');
});
app.get('/admin/exams', (c) => c.html(adminHrdExamsHtml()));
app.get('/admin/exams/:id/results', (c) => c.html(adminExamResultsHtml()));
app.get('/admin/grades', (c) => c.html(adminHrdGradesHtml()));
app.get('/admin/ncs-eval', (c) => c.html(adminHrdNcsEvalHtml()));
app.get('/admin/surveys', (c) => c.html(adminHrdSurveysHtml()));
// app.get('/admin/portfolios', (c) => c.html(adminPortfoliosHtml)); // 게시판 관리에서 통합 관리
app.get('/admin/reviews', (c) => c.html(adminReviewsListHtml(hrdSidebar('reviews'))));
app.get('/admin/posts', (c) => c.html(adminPostsListHtml(hrdSidebar('posts'))));
app.get('/admin/prototype-gallery', (c) => c.html(adminPrototypeGalleryHtml(hrdSidebar('prototype-gallery'))));
app.get('/admin/education-gallery', (c) => c.html(adminEducationGalleryHtml(hrdSidebar('education-gallery'))));
app.get('/admin/inquiries', (c) => c.html(adminInquiriesHtml(hrdSidebar('inquiries'))));

// 과정별 LMS 상세 관리 (LMS Dashboard & Inner Pages)
app.get('/admin/courses/:id/lms', (c) => c.html(adminLmsDashboardHtml));
app.get('/admin/courses/:id/lms/students', (c) => c.html(adminLmsStudentsHtml));
app.get('/admin/courses/:id/lms/attendance', (c) => c.html(adminLmsAttendanceHtml));
app.get('/admin/courses/:id/lms/ncs-eval', (c) => c.html(adminLmsNcsHtml));
app.get('/admin/courses/:id/lms/ncs-report', (c) => c.html(adminLmsNcsReportHtml));
app.get('/admin/courses/:id/lms/ncs-report/:studentId', (c) => c.html(adminLmsNcsStudentReportHtml));
app.get('/admin/courses/:id/lms/employment', (c) => c.html(adminLmsEmploymentHtml));
app.get('/admin/courses/:id/lms/training-logs', (c) => c.html(adminLmsTrainingLogsHtml));
app.get('/admin/courses/:id/lms/cbt', (c) => c.html(adminLmsCbtHtml));
app.get('/admin/courses/:id/lms/grades', (c) => c.html(adminLmsGradesHtml));
app.get('/admin/courses/:id/lms/counseling', (c) => c.html(adminLmsCounselingHtml));
app.get('/admin/courses/:id/lms/surveys', (c) => c.html(adminLmsSurveysHtml));
app.get('/admin/courses/:id/lms/assignments', (c) => c.html(adminLmsAssignmentsHtml));
app.get('/admin/courses/:id/lms/qr-attendance', (c) => c.html(adminLmsQrAttendanceHtml));

// Student Dashboard
app.get('/student', (c) => c.html(studentDashboardHtml()));

// Teacher Dashboard
app.get('/teacher', (c) => c.html(teacherDashboardHtml));
app.get('/teacher/portfolios', (c) => c.html(teacherPortfoliosHtml));
app.get('/teacher/profile', (c) => c.html(teacherProfileHtml));
app.get('/teacher/courses', (c) => {
    const tab = c.req.query('tab');
    return c.html(teacherCoursesHtml(tab));
});
app.get('/teacher/students', (c) => c.redirect('/teacher/courses?tab=students'));
app.get('/teacher/attendance', (c) => c.redirect('/teacher/courses?tab=attendance'));
app.get('/teacher/exams', (c) => c.redirect('/teacher/courses?tab=exams'));
app.get('/teacher/surveys', (c) => c.redirect('/teacher/courses?tab=surveys'));
app.get('/teacher/posts', (c) => c.html(adminPostsListHtml(teacherSidebar('posts'))));

// ============================================
// 페이지 라우트
// ============================================
app.get('/login', (c) => c.html(loginHtml));
app.get('/register', (c) => c.html(registerHtml));
app.get('/jobs', (c) => c.html(jobsListHtml));
app.get('/jobseekers', (c) => c.html(jobseekersListHtml));
app.get('/courses', (c) => c.html(coursesListHtml));
app.get('/portfolios', (c) => c.html(portfoliosListHtml));
app.get('/posts', (c) => c.html(postsListHtml));
app.get('/prototype-gallery', (c) => c.html(prototypeGalleryHtml));
app.get('/schedule', (c) => c.html(scheduleHtml));
app.get('/locations', (c) => c.html(locationsHtml({ kakaoMapAppKey: (c.env as Record<string, string>).KAKAO_MAP_APPKEY })));
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
    return c.html(layoutHtml('와우쓰리디홍대센터 - 4차산업 3D프린팅 교육 전문', homeHtml, 'home'));
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
                                ${navigationHtml('')}

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
                                            ${navigationHtml('')}

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
                                                        ${navigationHtml('')}

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
                                                                    ${navigationHtml('')}

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
                                                                                    <li><a href="/online-consulting" class="text-gray-600 hover:text-blue-600 transition">상담 신청</a></li>
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
                                                                                ${navigationHtml('')}

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
                                                                                            ${navigationHtml('')}

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
    return c.html(adminCoursesListHtml());
});

// 관리자 - 수강생 관리 페이지
// 관리자 - 훈련생 관리 페이지 (161번 라인으로 이동됨 - adminHrdStudentsHtml 사용)


// 관리자 - 시험/문제 관리 페이지
app.get('/admin/exams', (c) => {
    return c.html(adminExamsHtml());
});

app.get('/admin/exams/create', (c) => {
    return c.html(adminExamCreateHtml);
});

app.get('/admin/exams/:id/edit', (c) => {
    return c.html(adminExamEditHtml);
});


// 학생 - 시험 응시 페이지
app.get('/student/exam/:id', (c) => {
    return c.html(studentExamHtml);
});

// 학생 - 나의 강의실 (대시보드)
app.get('/my-classroom', (c) => {
    return c.html(studentDashboardHtml());
});

// 관리자 - 리뷰 관리 페이지 (4988번 라인으로 이동됨 - hrdSidebar 포함)


// 관리자 - 게시판 관리 페이지 (4989번 라인으로 이동됨 - hrdSidebar 포함)


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
                                                                                                        ${navigationHtml('greeting')}

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

// 교육사진 갤러리 (통합 페이지: 교육사진 + 포트폴리오)
app.get('/education-photos', (c) => c.html(educationGalleryHtml));

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
                                                                                                                                ${navigationHtml('facilities')}

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
                                                                                                                                            ${navigationHtml('locations')}

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
                                                                                                                                                        ${navigationHtml('consulting')}

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
                                                                                                                                                                <form id="consultForm" class="space-y-6" onsubmit="return submitConsultation(event)">
                                                                                                                                                                    <!-- 이름 -->
                                                                                                                                                                    <div>
                                                                                                                                                                        <label class="block text-gray-700 font-semibold mb-2">
                                                                                                                                                                            이름 <span class="text-red-500">*</span>
                                                                                                                                                                        </label>
                                                                                                                                                                        <input type="text" name="name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="이름을 입력해주세요" required>
                                                                                                                                                                    </div>

                                                                                                                                                                    <!-- 연락처 -->
                                                                                                                                                                    <div>
                                                                                                                                                                        <label class="block text-gray-700 font-semibold mb-2">
                                                                                                                                                                            연락처 <span class="text-red-500">*</span>
                                                                                                                                                                        </label>
                                                                                                                                                                        <input type="tel" name="phone" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="010-0000-0000" required>
                                                                                                                                                                    </div>

                                                                                                                                                                    <!-- 이메일 -->
                                                                                                                                                                    <div>
                                                                                                                                                                        <label class="block text-gray-700 font-semibold mb-2">
                                                                                                                                                                            이메일 <span class="text-red-500">*</span>
                                                                                                                                                                        </label>
                                                                                                                                                                        <input type="email" name="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="email@example.com" required>
                                                                                                                                                                    </div>

                                                                                                                                                                    <!-- 상담 유형 -->
                                                                                                                                                                    <div>
                                                                                                                                                                        <label class="block text-gray-700 font-semibold mb-2">
                                                                                                                                                                            상담 유형 <span class="text-red-500">*</span>
                                                                                                                                                                        </label>
                                                                                                                                                                        <select name="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" required>
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
                                                                                                                                                                        <select name="interest_course" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600">
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
                                                                                                                                                                        <textarea name="message" rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600" placeholder="궁금하신 사항을 자유롭게 작성해주세요" required></textarea>
                                                                                                                                                                    </div>

                                                                                                                                                                    <!-- 개인정보 동의 -->
                                                                                                                                                                    <div class="flex items-start">
                                                                                                                                                                        <input type="checkbox" id="privacy" name="privacy_agree" class="mt-1 mr-2" required>
                                                                                                                                                                            <label for="privacy" class="text-sm text-gray-600">
                                                                                                                                                                                개인정보 수집 및 이용에 동의합니다. (필수)
                                                                                                                                                                            </label>
                                                                                                                                                                    </div>

                                                                                                                                                                    <!-- 제출 버튼 -->
                                                                                                                                                                    <button type="submit" id="consultSubmitBtn" class="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg">
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

                                                                                                                                                        <script>
                                                                                                                                                        async function submitConsultation(e) {
                                                                                                                                                            e.preventDefault();
                                                                                                                                                            var form = document.getElementById('consultForm');
                                                                                                                                                            var btn = document.getElementById('consultSubmitBtn');
                                                                                                                                                            var name = (form.name && form.name.value) ? form.name.value.trim() : '';
                                                                                                                                                            var phone = (form.phone && form.phone.value) ? form.phone.value.trim() : '';
                                                                                                                                                            var email = (form.email && form.email.value) ? form.email.value.trim() : '';
                                                                                                                                                            var category = (form.category && form.category.value) ? form.category.value : '';
                                                                                                                                                            var interest = (form.interest_course && form.interest_course.value) ? form.interest_course.value : '';
                                                                                                                                                            var message = (form.message && form.message.value) ? form.message.value.trim() : '';
                                                                                                                                                            var privacy = form.privacy_agree && form.privacy_agree.checked;
                                                                                                                                                            if (!name || !phone || !privacy) { alert('이름, 연락처, 개인정보 동의는 필수입니다.'); return false; }
                                                                                                                                                            var fullMessage = (email ? '[이메일: ' + email + ']\\n' : '') + (category ? '[상담유형: ' + category + ']\\n' : '') + (interest ? '[관심과정: ' + interest + ']\\n' : '') + '\\n' + message;
                                                                                                                                                            btn.disabled = true;
                                                                                                                                                            btn.textContent = '접수 중...';
                                                                                                                                                            try {
                                                                                                                                                                var res = await fetch('/api/consultations', {
                                                                                                                                                                    method: 'POST',
                                                                                                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                                                                                                    body: JSON.stringify({ name: name, phone: phone, category: category, message: fullMessage, privacy_agree: true })
                                                                                                                                                                });
                                                                                                                                                                var json = await res.json();
                                                                                                                                                                if (json.success) { alert('상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.'); form.reset(); } else { alert(json.error || '접수에 실패했습니다.'); }
                                                                                                                                                            } catch (err) { alert('접수 중 오류가 발생했습니다.'); }
                                                                                                                                                            btn.disabled = false;
                                                                                                                                                            btn.textContent = '상담 신청하기';
                                                                                                                                                            return false;
                                                                                                                                                        }
                                                                                                                                                        </script>

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
                                                                                                                                                                    ${navigationHtml('courses')}

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
                                                                                                                                                                                    <div class="text-4xl font-bold text-blue-600 mb-2">100+</div>
                                                                                                                                                                                    <div class="text-gray-700">기업 교육 실적</div>
                                                                                                                                                                                </div>
                                                                                                                                                                                <div class="text-center p-6 bg-green-50 rounded-lg">
                                                                                                                                                                                    <div class="text-4xl font-bold text-green-600 mb-2">95%</div>
                                                                                                                                                                                    <div class="text-gray-700">교육 만족도</div>
                                                                                                                                                                                </div>
                                                                                                                                                                                <div class="text-center p-6 bg-purple-50 rounded-lg">
                                                                                                                                                                                    <div class="text-4xl font-bold text-purple-600 mb-2">1,000+</div>
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
                                                                                                                                                                                    <p class="text-sm text-blue-100">10명 이상 최대 20% 할인</p>
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
                                                                                                                                                                                        <p class="text-gray-600">02-3144-3137</p>
                                                                                                                                                                                        <p class="text-sm text-gray-500 mt-1">평일 09:00 - 18:00</p>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                                                                                                                                                                                        <i class="fas fa-envelope text-3xl text-primary-600 mb-3"></i>
                                                                                                                                                                                        <h4 class="font-bold text-gray-800 mb-2">이메일 문의</h4>
                                                                                                                                                                                        <p class="text-gray-600">3dcookiehd@naver.com</p>
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
                                                                                                                                                                                ${navigationHtml('courses')}

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
                                                                                                                                                                                                <div class="text-primary-600 font-semibold">학기당 1~3학점</div>
                                                                                                                                                                                            </div>

                                                                                                                                                                                            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                                                                                                                                                                                                <div class="flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                                                                                                                                                                                                    <i class="fas fa-certificate text-3xl text-cyan-600"></i>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <h3 class="text-xl font-bold text-gray-800 mb-3">자격증 특강</h3>
                                                                                                                                                                                                <ul class="space-y-2 text-gray-600 mb-4">
                                                                                                                                                                                                    <li><i class="fas fa-check text-cyan-600 mr-2"></i>3D프린터운용기능사</li>
                                                                                                                                                                                                    <li><i class="fas fa-check text-cyan-600 mr-2"></i>오토데스크 ACU</li>
                                                                                                                                                                                                    <li><i class="fas fa-check text-cyan-600 mr-2"></i>합격률 80% 이상</li>
                                                                                                                                                                                                </ul>
                                                                                                                                                                                                <div class="text-primary-600 font-semibold">1~2주 집중과정</div>
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

                                                                                                                                                                                    <!-- 협력 대학 (오른쪽→왼쪽 슬라이드) -->
                                                                                                                                                                                    <div class="bg-white rounded-lg shadow-lg p-8 mb-12 overflow-hidden">
                                                                                                                                                                                        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">주요 협력 대학</h2>
                                                                                                                                                                                        <div class="partner-marquee-wrap overflow-hidden">
                                                                                                                                                                                            <div id="partnerMarqueeTrack" class="partner-marquee-track flex gap-6 whitespace-nowrap">
                                                                                                                                                                                                <!-- API로 채워짐 -->
                                                                                                                                                                                                <div class="col-span-full text-center py-8 text-gray-400 text-sm">로딩 중...</div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <style>
                                                                                                                                                                                            .partner-marquee-wrap { mask-image: linear-gradient(90deg, transparent, black 5%, black 95%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, black 5%, black 95%, transparent); }
                                                                                                                                                                                            .partner-marquee-track { animation: partnerSlide 40s linear infinite; }
                                                                                                                                                                                            .partner-marquee-track > * { flex-shrink: 0; }
                                                                                                                                                                                            @keyframes partnerSlide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                                                                                                                                                                                        </style>
                                                                                                                                                                                        <script>
                                                                                                                                                                                            (function() {
                                                                                                                                                                                                fetch('/api/partner-universities').then(function(r) { return r.json(); }).then(function(res) {
                                                                                                                                                                                                    var list = (res && res.data) ? res.data : [];
                                                                                                                                                                                                    var track = document.getElementById('partnerMarqueeTrack');
                                                                                                                                                                                                    if (!track) return;
                                                                                                                                                                                                    if (list.length === 0) { track.innerHTML = '<div class="text-gray-400 text-sm py-4">등록된 협력대학이 없습니다.</div>'; return; }
                                                                                                                                                                                                    var itemHtml = function(u) {
                                                                                                                                                                                                        return '<div class="inline-flex items-center justify-center px-8 py-4 bg-gray-50 rounded-xl border border-gray-100">' +
                                                                                                                                                                                                            (u.logo_url ? '<img src="' + u.logo_url.replace(/"/g, '&quot;') + '" alt="" class="h-10 w-auto max-w-[140px] object-contain">' : '<span class="font-semibold text-gray-800">' + (u.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>') +
                                                                                                                                                                                                            '</div>';
                                                                                                                                                                                                    };
                                                                                                                                                                                                    var html = list.map(itemHtml).join('') + list.map(itemHtml).join('');
                                                                                                                                                                                                    track.innerHTML = html;
                                                                                                                                                                                                }).catch(function() {
                                                                                                                                                                                                    var track = document.getElementById('partnerMarqueeTrack');
                                                                                                                                                                                                    if (track) track.innerHTML = '<div class="text-gray-500 text-sm py-4">목록을 불러올 수 없습니다.</div>';
                                                                                                                                                                                                });
                                                                                                                                                                                            })();
                                                                                                                                                                                        </script>
                                                                                                                                                                                    </div>

                                                                                                                                                                                    <!-- 문의하기 -->
                                                                                                                                                                                    <div class="bg-white rounded-lg shadow-lg p-8">
                                                                                                                                                                                        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">대학교육 협력 문의</h2>
                                                                                                                                                                                        <div class="max-w-2xl mx-auto">
                                                                                                                                                                                            <div class="grid md:grid-cols-2 gap-6 mb-6">
                                                                                                                                                                                                <div class="text-center p-6 bg-gray-50 rounded-lg">
                                                                                                                                                                                                    <i class="fas fa-phone text-3xl text-primary-600 mb-3"></i>
                                                                                                                                                                                                    <h4 class="font-bold text-gray-800 mb-2">전화 문의</h4>
                                                                                                                                                                                                    <p class="text-gray-600">02-3144-3137</p>
                                                                                                                                                                                                    <p class="text-sm text-gray-500 mt-1">산학협력 담당자</p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div class="text-center p-6 bg-gray-50 rounded-lg">
                                                                                                                                                                                                    <i class="fas fa-envelope text-3xl text-primary-600 mb-3"></i>
                                                                                                                                                                                                    <h4 class="font-bold text-gray-800 mb-2">이메일 문의</h4>
                                                                                                                                                                                                    <p class="text-gray-600">3dcookiehd@naver.com</p>
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
                                                                                                                                                                                ${footerHtml()}
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

