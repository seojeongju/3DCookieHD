import { Hono } from 'hono';
import { Bindings, Variables } from '../types';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// 학생 진도율 조회
app.get('/student/:studentId/course/:courseId', async (c) => {
    try {
        const studentId = c.req.param('studentId');
        const courseId = c.req.param('courseId');

        const progress = await c.env.DB.prepare(`
            SELECT * FROM course_progress 
            WHERE student_id = ? AND course_id = ?
        `).bind(studentId, courseId).first();

        if (!progress) {
            // 초기 진도율 생성
            await c.env.DB.prepare(`
                INSERT INTO course_progress (student_id, course_id)
                VALUES (?, ?)
            `).bind(studentId, courseId).run();

            return c.json({
                success: true,
                data: {
                    overall_progress: 0,
                    attendance_rate: 0,
                    assignment_completion_rate: 0,
                    exam_completion_rate: 0
                }
            });
        }

        return c.json({ success: true, data: progress });
    } catch (e) {
        console.error('Failed to fetch progress:', e);
        return c.json({ success: false, error: 'Failed to fetch progress' }, 500);
    }
});

// 진도율 업데이트 (자동 계산)
app.post('/calculate/:studentId/:courseId', async (c) => {
    try {
        const studentId = c.req.param('studentId');
        const courseId = c.req.param('courseId');

        // 출석률 계산
        const attendanceData = await c.env.DB.prepare(`
            SELECT 
                COUNT(*) as total_sessions,
                SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as attended
            FROM attendance_qr_checkins ac
            JOIN attendance_qr_sessions s ON ac.session_id = s.id
            WHERE ac.student_id = ? AND s.course_id = ?
        `).bind(studentId, courseId).first();

        const attendanceRate = attendanceData && attendanceData.total_sessions > 0
            ? (attendanceData.attended / attendanceData.total_sessions) * 100
            : 0;

        // 과제 완료율 계산
        const assignmentData = await c.env.DB.prepare(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT s.assignment_id) as submitted
            FROM assignments a
            LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
            WHERE a.course_id = ?
        `).bind(studentId, courseId).first();

        const assignmentRate = assignmentData && assignmentData.total_assignments > 0
            ? (assignmentData.submitted / assignmentData.total_assignments) * 100
            : 0;

        // 시험 완료율 계산 (Mock)
        const examRate = 75; // TODO: 실제 시험 데이터 기반 계산

        // 전체 진도율 = (출석 40% + 과제 30% + 시험 30%)
        const overallProgress = (attendanceRate * 0.4) + (assignmentRate * 0.3) + (examRate * 0.3);

        // 진도율 업데이트
        await c.env.DB.prepare(`
            INSERT INTO course_progress (
                student_id, course_id, attendance_rate, 
                assignment_completion_rate, exam_completion_rate, overall_progress, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(student_id, course_id) DO UPDATE SET
                attendance_rate = ?,
                assignment_completion_rate = ?,
                exam_completion_rate = ?,
                overall_progress = ?,
                updated_at = CURRENT_TIMESTAMP
        `).bind(
            studentId, courseId, attendanceRate, assignmentRate, examRate, overallProgress,
            attendanceRate, assignmentRate, examRate, overallProgress
        ).run();

        return c.json({
            success: true,
            data: {
                overall_progress: Math.round(overallProgress * 10) / 10,
                attendance_rate: Math.round(attendanceRate * 10) / 10,
                assignment_completion_rate: Math.round(assignmentRate * 10) / 10,
                exam_completion_rate: Math.round(examRate * 10) / 10
            }
        });
    } catch (e) {
        console.error('Failed to calculate progress:', e);
        return c.json({ success: false, error: 'Failed to calculate progress' }, 500);
    }
});

// 과정별 전체 학생 진도율
app.get('/course/:courseId', async (c) => {
    try {
        const courseId = c.req.param('courseId');

        const { results } = await c.env.DB.prepare(`
            SELECT p.*, u.name as student_name, u.email
            FROM course_progress p
            JOIN users u ON p.student_id = u.id
            WHERE p.course_id = ?
            ORDER BY p.overall_progress DESC
        `).bind(courseId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch course progress:', e);
        return c.json({ success: false, error: 'Failed to fetch course progress' }, 500);
    }
});

export default app;
