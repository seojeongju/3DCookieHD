
import { Hono } from 'hono';
import { Bindings } from '../types';

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

export default app;
