
import { Hono } from 'hono';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';
import { getEffectiveSessionStatus } from '../utils/course_session_status';
import { resolveSessionToLmsCourseId } from '../utils/sessionCourseResolution';

const app = new Hono<{ Bindings: Bindings }>();

/** KST 기준 이번 주 월~일 날짜·라벨 */
function getCurrentWeekDatesKst(): { labels: string[]; dates: string[] } {
    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dow = kstNow.getUTCDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(kstNow);
        d.setUTCDate(kstNow.getUTCDate() + mondayOffset + i);
        dates.push(d.toISOString().slice(0, 10));
    }
    return { labels, dates };
}

/** 강사 주간 출석·학습완료(제출) 추이 */
async function buildTeacherWeeklyPerformance(
    DB: D1Database,
    teacherId: number,
    totalStudents: number
): Promise<{ labels: string[]; dates: string[]; attendance: number[]; completion: number[] }> {
    const { labels, dates } = getCurrentWeekDatesKst();
    const attendance: number[] = [];
    const completion: number[] = [];

    for (const date of dates) {
        let attTotal = 0;
        let attOk = 0;
        let submitCount = 0;

        try {
            const hrdAtt = await DB.prepare(`
                SELECT COUNT(*) as total,
                    SUM(CASE WHEN al.status IN ('present','late','early_leave','public_leave') THEN 1 ELSE 0 END) as ok
                FROM attendance_logs al
                JOIN course_session_enrollments cse ON al.enrollment_id = cse.id
                JOIN session_timetable st ON cse.session_id = st.session_id AND st.instructor_id = ?
                WHERE al.date = ?
            `).bind(teacherId, date).first<{ total: number; ok: number }>();
            attTotal += hrdAtt?.total ?? 0;
            attOk += hrdAtt?.ok ?? 0;
        } catch { /* ignore */ }

        try {
            const legAtt = await DB.prepare(`
                SELECT COUNT(*) as total,
                    SUM(CASE WHEN al.status IN ('present','late','early_leave','public_leave') THEN 1 ELSE 0 END) as ok
                FROM attendance_logs al
                JOIN enrollments e ON al.enrollment_id = e.id
                JOIN courses c ON e.course_id = c.id AND c.teacher_id = ?
                WHERE al.date = ?
            `).bind(teacherId, date).first<{ total: number; ok: number }>();
            attTotal += legAtt?.total ?? 0;
            attOk += legAtt?.ok ?? 0;
        } catch { /* ignore */ }

        try {
            const examSubs = await DB.prepare(`
                SELECT COUNT(DISTINCT es.student_id) as cnt
                FROM exam_submissions es
                JOIN exams ex ON es.exam_id = ex.id
                JOIN courses c ON ex.course_id = c.id
                WHERE c.teacher_id = ? AND substr(es.submitted_at, 1, 10) = ?
            `).bind(teacherId, date).first<{ cnt: number }>();
            submitCount += examSubs?.cnt ?? 0;
        } catch { /* ignore */ }

        try {
            const assignSubs = await DB.prepare(`
                SELECT COUNT(DISTINCT s.student_id) as cnt
                FROM assignment_submissions s
                JOIN assignments a ON s.assignment_id = a.id
                JOIN session_timetable st ON a.session_id = st.session_id AND st.instructor_id = ?
                WHERE substr(s.submitted_at, 1, 10) = ?
            `).bind(teacherId, date).first<{ cnt: number }>();
            submitCount += assignSubs?.cnt ?? 0;
        } catch { /* ignore */ }

        attendance.push(attTotal > 0 ? Math.round((attOk / attTotal) * 100) : 0);
        completion.push(
            totalStudents > 0 ? Math.min(100, Math.round((submitCount / totalStudents) * 100)) : 0
        );
    }

    return { labels, dates, attendance, completion };
}

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
        const user = c.get('user');
        const teacherId = user?.userId;

        if (!teacherId || (user.role !== 'teacher' && user.role !== 'admin')) {
            return c.json({ success: false, error: '강사 권한이 필요합니다' }, 403);
        }

        // ------------------ Legacy Courses ------------------
        let legacyCourses: any[] = [];
        try {
            const coursesResult = await DB.prepare(
                "SELECT id, title, category, status, max_students, end_date FROM courses WHERE teacher_id = ?"
            ).bind(teacherId).all();
            
            const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
            legacyCourses = (coursesResult.results || []).map((course: any) => {
                const courseEndDate = (course.end_date || '').slice(0, 10);
                let courseStatus = course.status || '';
                if (courseEndDate && courseEndDate < nowKst) {
                    if (!['completed', 'closed'].includes(courseStatus)) {
                        courseStatus = 'completed';
                    }
                }
                return { ...course, status: courseStatus };
            });
        } catch (e) {
            console.error('Legacy courses fetch error:', e);
        }

        let totalStudents = 0;
        let avgAttendanceData = { total: 0, count: 0 };

        // Legacy enrolled count and attendance
        for (const course of legacyCourses) {
            try {
                const enrollData = await DB.prepare(`
                    SELECT count(*) as cnt, avg(attendance) as avgA 
                    FROM enrollments 
                    WHERE course_id = ? AND status = 'approved'
                `).bind(course.id).first<{ cnt: number, avgA: number }>();

                (course as any).enrolled_count = enrollData?.cnt || 0;
                totalStudents += enrollData?.cnt || 0;
                if (enrollData?.avgA) {
                    avgAttendanceData.total += enrollData.avgA;
                    avgAttendanceData.count += 1;
                }
                (course as any).is_hrd = false;
            } catch (e) {
                console.error(`Error processing legacy course ${course.id}:`, e);
            }
        }

        // ------------------ HRD Course Sessions ------------------
        let hrdCourses: any[] = [];
        try {
            const hrdRows = await DB.prepare(`
                SELECT DISTINCT s.id, s.session_number, s.session_name, s.status, s.training_start_date, s.training_end_date,
                       s.lms_course_id, a.name as course_name, cc.name as category_name
                FROM session_timetable st
                INNER JOIN course_sessions s ON st.session_id = s.id
                INNER JOIN approved_courses a ON s.approved_course_id = a.id
                LEFT JOIN course_categories cc ON a.category_id = cc.id
                WHERE st.instructor_id = ?
            `).bind(teacherId).all<{
                id: number;
                session_number: number;
                session_name: string | null;
                status: string;
                training_start_date: string | null;
                training_end_date: string | null;
                lms_course_id: number | null;
                course_name: string;
                category_name: string;
            }>();

            hrdCourses = [];
            for (const r of hrdRows.results || []) {
                const sessionId = Number(r.id);
                let lmsCourseId =
                    r.lms_course_id != null && Number(r.lms_course_id) > 0 ? Number(r.lms_course_id) : null;
                if (!lmsCourseId) {
                    lmsCourseId = await resolveSessionToLmsCourseId(DB, sessionId);
                }
                const sessionLabel = r.session_number != null ? ' (' + r.session_number + '회차)' : '';
                const nameSuffix = r.session_name ? ' - ' + r.session_name : '';
                const title = (r.course_name || '') + sessionLabel + nameSuffix;
                const effStatus = getEffectiveSessionStatus({
                    status: r.status,
                    training_start_date: r.training_start_date,
                    training_end_date: r.training_end_date,
                });
                hrdCourses.push({
                    id: lmsCourseId ?? sessionId,
                    session_id: sessionId,
                    lms_course_id: lmsCourseId,
                    title,
                    category: r.category_name || '국비지원',
                    status: effStatus,
                    start_date: r.training_start_date,
                    end_date: r.training_end_date,
                    training_start_date: r.training_start_date,
                    training_end_date: r.training_end_date,
                    max_students: 0,
                    current_students: 0,
                    is_hrd: true,
                    enrolled_count: 0,
                });
            }

            for (const hCourse of hrdCourses) {
                try {
                    // enrollment counts for HRD course_sessions
                    const enrollData = await DB.prepare(`
                        SELECT count(*) as cnt
                        FROM course_session_enrollments
                        WHERE session_id = ? AND status IN ('approved', 'enrolled')
                    `).bind(hCourse.session_id).first<{ cnt: number }>();
                    hCourse.enrolled_count = enrollData?.cnt || 0;
                    hCourse.current_students = enrollData?.cnt || 0;
                    totalStudents += enrollData?.cnt || 0;

                    // Attendance for HRD
                    const hrdAtt = await DB.prepare(`
                        SELECT count(*) as total_logs,
                               sum(case when status = 'present' then 1 else 0 end) as present_cnt
                        FROM attendance_logs al
                        JOIN course_session_enrollments cse ON al.enrollment_id = cse.id
                        WHERE cse.session_id = ?
                    `).bind(hCourse.session_id).first<{ total_logs: number, present_cnt: number }>();

                    if (hrdAtt && hrdAtt.total_logs > 0) {
                        const present = hrdAtt.present_cnt || 0;
                        const rat = (present / hrdAtt.total_logs) * 100;
                        avgAttendanceData.total += rat;
                        avgAttendanceData.count += 1;
                    }
                } catch (e) {
                    console.error(`Error processing HRD course ${hCourse.session_id}:`, e);
                }
            }
        } catch (e) {
            console.error('HRD courses fetch error:', e);
        }

        const myCourses = legacyCourses.length + hrdCourses.length;
        const avgAttendance = avgAttendanceData.count > 0 ? Math.round(avgAttendanceData.total / avgAttendanceData.count) : 0;

        let combinedCourses = [...legacyCourses, ...hrdCourses];
        combinedCourses.sort((a, b) => {
            const sa = (a.status === 'active' || a.status === 'open' || a.status === 'in_progress') ? 0 : (a.status === 'recruiting' ? 1 : 2);
            const sb = (b.status === 'active' || b.status === 'open' || b.status === 'in_progress') ? 0 : (b.status === 'recruiting' ? 1 : 2);
            return sa - sb;
        });

        // ------------------ Pending Grading ------------------
        let pendingGrading = 0;
        let pendingGradingList: any[] = [];

        try {
            // Legacy exams
            const pendingList1 = await DB.prepare(`
                SELECT es.id, es.exam_id, es.student_id, u.name as student_name, ex.title as exam_title, es.submitted_at
                FROM exam_submissions es
                JOIN exams ex ON es.exam_id = ex.id
                JOIN courses c ON ex.course_id = c.id
                JOIN users u ON es.student_id = u.id
                WHERE c.teacher_id = ? AND es.status = 'submitted'
                ORDER BY es.submitted_at DESC
                LIMIT 5
            `).bind(teacherId).all<any>();
            const list1 = pendingList1?.results || [];

            // HRD assignments
            const pendingList2 = await DB.prepare(`
                SELECT s.id, s.assignment_id as exam_id, s.student_id, u.name as student_name, a.title as exam_title, s.submitted_at
                FROM assignment_submissions s
                JOIN assignments a ON s.assignment_id = a.id
                JOIN session_timetable st ON a.session_id = st.session_id
                JOIN users u ON s.student_id = u.id
                WHERE st.instructor_id = ? AND s.status = 'submitted'
                GROUP BY s.id
                ORDER BY s.submitted_at DESC
                LIMIT 5
            `).bind(teacherId).all<any>();
            const list2 = pendingList2?.results || [];

            pendingGradingList = [...list1, ...list2].sort((a, b) => {
                const da = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
                const db = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
                return db - da; // desc
            }).slice(0, 5);

            // Total pending
            const pcount1 = await DB.prepare(`
                SELECT count(*) as count 
                FROM exam_submissions es
                JOIN exams ex ON es.exam_id = ex.id
                JOIN courses c ON ex.course_id = c.id
                WHERE c.teacher_id = ? AND es.status = 'submitted'
            `).bind(teacherId).first<{ count: number }>();

            const pcount2 = await DB.prepare(`
                SELECT count(DISTINCT s.id) as count 
                FROM assignment_submissions s
                JOIN assignments a ON s.assignment_id = a.id
                JOIN session_timetable st ON a.session_id = st.session_id
                WHERE st.instructor_id = ? AND s.status = 'submitted'
            `).bind(teacherId).first<{ count: number }>();

            pendingGrading = (pcount1?.count || 0) + (pcount2?.count || 0);
        } catch (e) {
            console.error('Pending grading fetch error:', e);
        }

        const weeklyPerformance = await buildTeacherWeeklyPerformance(DB, teacherId, totalStudents);

        return c.json({
            success: true,
            data: {
                myCourses,
                totalStudents,
                pendingGrading,
                avgAttendance,
                weeklyPerformance,
                recentCourses: combinedCourses,
                assignedCourses: combinedCourses,
                pendingGradingList: pendingGradingList
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
