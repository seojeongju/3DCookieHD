
import { Hono } from 'hono';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/stats', async (c) => {
    try {
        const { DB } = c.env;

        // 1. 전체 수강생 (Total Students)
        // role이 'student'인 사용자 수
        const studentsResult = await DB.prepare(
            "SELECT count(*) as count FROM users WHERE role = 'student'"
        ).first<{ count: number }>();
        const totalStudents = studentsResult?.count || 0;

        // 지난 달 수강생 수 (성장률 계산용 - 임시로 이번 달 가입자 기반으로 계산하거나 생략)
        // 여기서는 간단히 전체 수강생 수만 반환하고, 성장률은 0으로 설정하거나 프론트에서 처리
        // 만약 성장률을 계산하려면 created_at을 기준으로 지난달 가입자 수를 구해야 함.

        // 2. 진행 중인 과정 (Ongoing Courses)
        // status가 'active'인 과정 수
        const coursesResult = await DB.prepare(
            "SELECT count(*) as count FROM courses WHERE status = 'active'"
        ).first<{ count: number }>();
        const activeCourses = coursesResult?.count || 0;

        // 3. 신규 문의 (New Inquiries)
        // status가 'pending'인 상담 신청 수
        const consultationsResult = await DB.prepare(
            "SELECT count(*) as count FROM consultations WHERE status = 'pending'"
        ).first<{ count: number }>();
        const newInquiries = consultationsResult?.count || 0;

        // 4. 평균 출석률 (Average Attendance)
        // enrollments 테이블의 attendance 평균
        const attendanceResult = await DB.prepare(
            "SELECT avg(attendance) as avg FROM enrollments"
        ).first<{ avg: number }>();
        const avgAttendance = Math.round(attendanceResult?.avg || 0);

        return c.json({
            success: true,
            data: {
                totalStudents,
                activeCourses,
                newInquiries,
                avgAttendance,
                // 성장률은 일단 0이나 임의의 값으로 두거나, 추후 구현
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

        // 1. 담당 과정 수
        const coursesResult = await DB.prepare(
            "SELECT count(*) as count FROM courses WHERE teacher_id = ? AND status = 'active'"
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

        // 3. 채점 대기 건수 (제출되었지만 채점 안 된 시험 결과)
        const pendingGradingResult = await DB.prepare(`
            SELECT count(*) as count 
            FROM student_scores ss
            JOIN exams e ON ss.exam_id = e.id
            JOIN courses c ON e.course_id = c.id
            WHERE c.teacher_id = ? 
            AND ss.graded_at IS NULL
            AND ss.submitted_at IS NOT NULL
        `).bind(teacherId).first<{ count: number }>();
        const pendingGrading = pendingGradingResult?.count || 0;

        // 4. 평균 출석률 (담당 과정의 출석률)
        const attendanceResult = await DB.prepare(`
            SELECT avg(e.attendance) as avg 
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE c.teacher_id = ? AND e.status = 'approved'
        `).bind(teacherId).first<{ avg: number }>();
        const avgAttendance = Math.round(attendanceResult?.avg || 0);

        // 5. 담당 과정 목록 (최근 3개)
        const recentCourses = await DB.prepare(`
            SELECT id, title, category, max_students,
            (SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id AND status = 'approved') as enrolled_count
            FROM courses
            WHERE teacher_id = ? AND status = 'active'
            ORDER BY created_at DESC
            LIMIT 3
        `).bind(teacherId).all();

        // 6. 최근 채점 대기 목록
        const pendingGradingList = await DB.prepare(`
            SELECT 
                ss.id,
                ss.exam_id,
                ss.student_id,
                u.name as student_name,
                e.title as exam_title,
                ss.submitted_at
            FROM student_scores ss
            JOIN exams e ON ss.exam_id = e.id
            JOIN courses c ON e.course_id = c.id
            JOIN users u ON ss.student_id = u.id
            WHERE c.teacher_id = ? 
            AND ss.graded_at IS NULL
            AND ss.submitted_at IS NOT NULL
            ORDER BY ss.submitted_at DESC
            LIMIT 5
        `).bind(teacherId).all();

        return c.json({
            success: true,
            data: {
                myCourses,
                totalStudents,
                pendingGrading,
                avgAttendance,
                recentCourses: recentCourses.results || [],
                pendingGradingList: pendingGradingList.results || []
            }
        });
    } catch (e) {
        console.error('Failed to fetch teacher stats:', e);
        return c.json({ success: false, error: 'Failed to fetch teacher stats' }, 500);
    }
});

export default app;
