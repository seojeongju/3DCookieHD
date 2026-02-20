
import { Hono } from 'hono';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/stats', async (c) => {
    try {
        const { DB } = c.env;

        // 각 쿼리를 개별 try-catch로 감싸서 일부 실패해도 전체가 작동하도록 함
        let totalStudents = 0;
        let activeCourses = 0;
        let newInquiries = 0;
        let avgAttendance = 0;
        let monthlyRevenue = 0;
        let monthlyGrowth: { month: string, count: number }[] = [];
        let popularCourses: { title: string, student_count: number }[] = [];
        let pendingApprovals: { id: number, user_name: string, course_title: string, created_at: string }[] = [];
        let abnormalFacilities: { id: number, name: string, status: string, manager_main: string }[] = [];
        let abnormalItems: { id: number, name: string, status: string, facility_name: string }[] = [];

        // 1. 전체 수강생 (Total Students)
        try {
            const studentsResult = await DB.prepare(
                "SELECT count(*) as count FROM users WHERE role = 'student'"
            ).first<{ count: number }>();
            totalStudents = studentsResult?.count || 0;
        } catch (e) { console.error('Error fetching total students:', e); }

        // 2. 과정 현황 (회차 기준 — "운영 중인 과정" 목록과 동일하게 course_sessions 사용)
        let courseStatusBreakdown: Record<string, number> = { active: 0, recruiting: 0, closed: 0 };
        try {
            const statsResult = await DB.prepare(
                `SELECT s.status, count(*) as count FROM course_sessions s
                 INNER JOIN approved_courses a ON a.id = s.approved_course_id
                 GROUP BY s.status`
            ).all<{ status: string, count: number }>();

            if (statsResult.results) {
                statsResult.results.forEach(row => {
                    const status = row.status || '';
                    const count = row.count || 0;
                    if (status === 'in_progress') {
                        courseStatusBreakdown['active'] += count;
                    } else if (status === 'recruiting' || status === 'always_open') {
                        courseStatusBreakdown['recruiting'] += count;
                    } else {
                        courseStatusBreakdown['closed'] += count;
                    }
                });
            }
            activeCourses = courseStatusBreakdown['active'] || 0;
        } catch (e) {
            console.error('Error fetching course-session stats:', e);
        }

        // 3. 문의 현황 (Consultation Status Breakdown)
        let inquiryStats = { pending: 0, completed: 0 };
        try {
            const consultationsResult = await DB.prepare(
                "SELECT status, count(*) as count FROM consultations GROUP BY status"
            ).all<{ status: string, count: number }>();

            if (consultationsResult.results) {
                consultationsResult.results.forEach(row => {
                    if (row.status === 'pending') inquiryStats.pending = row.count;
                    else if (row.status === 'completed') inquiryStats.completed = row.count;
                });
            }
            newInquiries = inquiryStats.pending;
        } catch (e) {
            // consultations 테이블이 없으면 상담 일지에서 조회 시도 (Legacy support)
            try {
                const counselingResult = await DB.prepare(
                    "SELECT count(*) as count FROM hrd_counseling_logs WHERE result IS NULL OR result = ''"
                ).first<{ count: number }>();
                newInquiries = counselingResult?.count || 0;
                inquiryStats.pending = newInquiries;
            } catch (e2) { console.error('Error fetching inquiries:', e2); }
        }

        // 4. 평균 출석률 (Average Attendance)
        try {
            const attendanceResult = await DB.prepare(
                "SELECT avg(attendance) as avg FROM enrollments"
            ).first<{ avg: number }>();
            avgAttendance = Math.round(attendanceResult?.avg || 0);
        } catch (e) { console.error('Error fetching attendance:', e); }

        // 5. 이번 달 매출 (Monthly Revenue) & Breakdown
        let revenueBreakdown = { card: 0, transfer: 0, gov: 0 };
        try {
            const revenueResult = await DB.prepare(`
                SELECT payment_method, sum(payment_amount) as total 
                FROM enrollments 
                WHERE payment_status = 'paid' 
                AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
                GROUP BY payment_method
            `).all<{ payment_method: string, total: number }>();

            let totalRevenue = 0;
            if (revenueResult.results) {
                revenueResult.results.forEach(row => {
                    const amount = row.total || 0;
                    totalRevenue += amount;
                    if (row.payment_method === 'card') revenueBreakdown.card = amount;
                    else if (row.payment_method === 'transfer') revenueBreakdown.transfer = amount;
                    else if (row.payment_method === 'gov_support') revenueBreakdown.gov = amount;
                });
            }
            monthlyRevenue = totalRevenue;
        } catch (e) { console.error('Error fetching revenue:', e); }

        // 6. 월별 가입자 추이 (최근 6개월)
        try {
            const growthTrendResult = await DB.prepare(`
                SELECT strftime('%Y-%m', created_at) as month, count(*) as count
                FROM users
                WHERE created_at >= date('now', '-5 months', 'start of month')
                GROUP BY month
                ORDER BY month ASC
            `).all<{ month: string, count: number }>();
            monthlyGrowth = growthTrendResult.results || [];
        } catch (e) { console.error('Error fetching growth trend:', e); }

        // 7. 인기 과정 TOP 5 (수강생 순)
        try {
            const popularCoursesResult = await DB.prepare(`
                SELECT c.title, count(e.id) as student_count
                FROM courses c
                LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'approved'
                WHERE c.status = 'active'
                GROUP BY c.id
                ORDER BY student_count DESC
                LIMIT 5
            `).all<{ title: string, student_count: number }>();
            popularCourses = popularCoursesResult.results || [];
        } catch (e) { console.error('Error fetching popular courses:', e); }

        // 8. 승인 대기 목록 (최근 5건)
        try {
            const pendingApprovalsResult = await DB.prepare(`
                SELECT e.id, u.name as user_name, c.title as course_title, e.created_at
                FROM enrollments e
                JOIN users u ON e.user_id = u.id
                JOIN courses c ON e.course_id = c.id
                WHERE e.status = 'pending'
                ORDER BY e.created_at DESC
                LIMIT 5
            `).all<{ id: number, user_name: string, course_title: string, created_at: string }>();
            pendingApprovals = pendingApprovalsResult.results || [];
        } catch (e) { console.error('Error fetching pending approvals:', e); }

        // 9. 시설 점검 필요 목록 (최근 5건)
        try {
            const facilitiesResult = await DB.prepare(`
                SELECT id, name, status, manager_main
                FROM hrd_facilities
                WHERE status != '양호'
                ORDER BY id DESC
                LIMIT 5
            `).all<{ id: number, name: string, status: string, manager_main: string }>();
            abnormalFacilities = facilitiesResult.results || [];
        } catch (e) { console.error('Error fetching abnormal facilities:', e); }

        // 10. 비품 점검 필요 목록 (최근 5건)
        try {
            const itemsResult = await DB.prepare(`
                SELECT i.id, i.name, i.status, f.name as facility_name
                FROM hrd_facility_items i
                LEFT JOIN hrd_facilities f ON i.facility_id = f.id
                WHERE i.status != 'good'
                ORDER BY i.id DESC
                LIMIT 5
            `).all<{ id: number, name: string, status: string, facility_name: string }>();
            abnormalItems = itemsResult.results || [];
        } catch (e) { console.error('Error fetching abnormal items:', e); }

        return c.json({
            success: true,
            data: {
                totalStudents,
                activeCourses,
                courseStatusBreakdown,
                newInquiries,
                inquiryStats,
                avgAttendance,
                monthlyRevenue,
                revenueBreakdown,
                monthlyGrowth,
                popularCourses,
                pendingApprovals,
                abnormalFacilities,
                abnormalItems,
                studentGrowth: 0,
                attendanceGrowth: 0
            }
        });
    } catch (e) {
        console.error('Failed to fetch dashboard stats:', e);
        return c.json({ success: false, error: 'Failed to fetch dashboard stats' }, 500);
    }
});

/**
 * GET /api/dashboard/teacher-stats
 * 강사용 대시보드 통계
 */
app.get('/teacher-stats', authMiddleware, async (c) => {
    try {
        const { DB } = c.env;
        const authHeader = c.req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, error: '인증이 필요합니다' }, 401);
        }

        const token = authHeader.substring(7);
        const payload = await verifyToken(token);

        if (!payload || (payload.role !== 'teacher' && payload.role !== 'admin')) {
            return c.json({ success: false, error: '강사 권한이 필요합니다' }, 403);
        }

        const teacherId = payload.userId;

        // 1. 담당 과정 수 (모집중·진행중·종료 등 전체)
        const coursesResult = await DB.prepare(
            "SELECT count(*) as count FROM courses WHERE teacher_id = ?"
        ).bind(teacherId).first<{ count: number }>();
        const myCourses = coursesResult?.count || 0;

        // 2. 총 수강생 수 (담당 과정의 승인된 수강생)
        const studentsResult = await DB.prepare(`
            SELECT count(DISTINCT e.user_id) as count 
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE c.teacher_id = ? AND e.status = 'approved'
        `).bind(teacherId).first<{ count: number }>();
        const totalStudents = studentsResult?.count || 0;

        // 3. 채점 대기 건수 (시험 제출됐지만 아직 채점 안 된 건 - exam_submissions)
        let pendingGrading = 0;
        let pendingGradingList: { id: number; exam_id: number; student_id: number; student_name: string; exam_title: string; submitted_at: string | null }[] = [];
        try {
            const pendingResult = await DB.prepare(`
                SELECT count(*) as count 
                FROM exam_submissions es
                JOIN exams ex ON es.exam_id = ex.id
                JOIN courses c ON ex.course_id = c.id
                WHERE c.teacher_id = ? AND es.status = 'submitted'
            `).bind(teacherId).first<{ count: number }>();
            pendingGrading = pendingResult?.count || 0;

            const pendingList = await DB.prepare(`
                SELECT es.id, es.exam_id, es.student_id, u.name as student_name, ex.title as exam_title, es.submitted_at
                FROM exam_submissions es
                JOIN exams ex ON es.exam_id = ex.id
                JOIN courses c ON ex.course_id = c.id
                JOIN users u ON es.student_id = u.id
                WHERE c.teacher_id = ? AND es.status = 'submitted'
                ORDER BY es.submitted_at DESC
                LIMIT 5
            `).bind(teacherId).all<{ id: number; exam_id: number; student_id: number; student_name: string; exam_title: string; submitted_at: string | null }>();
            pendingGradingList = pendingList?.results || [];
        } catch (e) {
            console.error('Failed to fetch pending grading:', e);
        }

        // 4. 평균 출석률 (담당 과정의 출석률 - enrollments.attendance)
        let avgAttendance = 0;
        try {
            const attendanceResult = await DB.prepare(`
                SELECT avg(e.attendance) as avg 
                FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                WHERE c.teacher_id = ? AND e.status = 'approved'
            `).bind(teacherId).first<{ avg: number }>();
            avgAttendance = Math.round(attendanceResult?.avg || 0);
        } catch (e) {
            console.error('Failed to fetch attendance:', e);
        }

        // 5. 배정된 과정 전체 목록 (모집중·진행중·종료 등 상태 무관)
        const assignedCourses = await DB.prepare(`
            SELECT id, title, category, status, max_students,
            (SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id AND status = 'approved') as enrolled_count
            FROM courses
            WHERE teacher_id = ?
            ORDER BY CASE WHEN status IN ('active', 'open') THEN 0 WHEN status = 'recruiting' THEN 1 ELSE 2 END, created_at DESC
        `).bind(teacherId).all();

        return c.json({
            success: true,
            data: {
                myCourses,
                totalStudents,
                pendingGrading,
                avgAttendance,
                recentCourses: assignedCourses.results || [],
                assignedCourses: assignedCourses.results || [],
                pendingGradingList: pendingGradingList.results || []
            }
        });
    } catch (e) {
        console.error('Failed to fetch teacher stats:', e);
        return c.json({ success: false, error: 'Failed to fetch teacher stats' }, 500);
    }
});

/**
 * GET /api/dashboard/today-attendance
 * 오늘의 출석 현황 (최근 5건)
 */
app.get('/today-attendance', async (c) => {
    try {
        const { DB } = c.env;

        // 오늘 날짜 (YYYY-MM-DD 형식)
        const today = new Date().toISOString().split('T')[0];

        // 오늘의 출석 기록 조회 (최근 5건)
        const attendanceResult = await DB.prepare(`
            SELECT 
                u.name as student_name,
                c.title as course_title,
                al.check_in_time,
                al.status,
                al.date
            FROM attendance_logs al
            JOIN enrollments e ON al.enrollment_id = e.id
            JOIN users u ON e.user_id = u.id
            JOIN courses c ON e.course_id = c.id
            WHERE al.date = ?
            ORDER BY al.check_in_time DESC
            LIMIT 5
        `).bind(today).all<{
            student_name: string;
            course_title: string;
            check_in_time: string;
            status: string;
            date: string;
        }>();

        return c.json({
            success: true,
            data: attendanceResult.results || []
        });
    } catch (e) {
        console.error('Failed to fetch today attendance:', e);
        return c.json({ success: false, error: 'Failed to fetch today attendance' }, 500);
    }
});

export default app;
