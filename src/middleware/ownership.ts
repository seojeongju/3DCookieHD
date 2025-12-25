// ============================================
// 리소스 소유권 검증 미들웨어
// ============================================

import type { Context, Next } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { forbiddenResponse, notFoundResponse } from '../utils/response';

// Context with user in variables
type AuthContext = Context<{ Bindings: Bindings; Variables: { user?: JWTPayload } }>;


/**
 * 강의 소유권 검증 미들웨어
 * 강사가 자신이 담당하는 강의만 수정/삭제할 수 있도록 검증
 */
export async function verifyCourseOwnership(c: AuthContext, next: Next) {
    const user = c.get('user') as JWTPayload | undefined;

    if (!user) {
        return forbiddenResponse(c, '인증이 필요합니다');
    }

    // 관리자는 모든 강의에 접근 가능
    if (user.role === 'admin') {
        await next();
        return;
    }

    // 강사인 경우 본인 강의만 접근 가능
    if (user.role === 'teacher') {
        const courseId = c.req.param('id');

        if (!courseId) {
            return forbiddenResponse(c, '강의 ID가 필요합니다');
        }

        try {
            const db = c.env.DB;
            const course = await db.prepare(
                'SELECT teacher_id FROM courses WHERE id = ?'
            ).bind(courseId).first();

            if (!course) {
                return notFoundResponse(c, '강의를 찾을 수 없습니다');
            }

            // teacher_id가 현재 사용자 ID와 일치하는지 확인
            if (course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 강의에 대한 권한이 없습니다');
            }

            await next();
        } catch (error) {
            console.error('Course ownership verification error:', error);
            return forbiddenResponse(c, '권한 확인 중 오류가 발생했습니다');
        }
    } else {
        return forbiddenResponse(c, '강사 권한이 필요합니다');
    }
}

/**
 * 학생 데이터 접근 검증 미들웨어
 * 학생이 자신의 데이터만 조회할 수 있도록 검증
 */
export async function verifyStudentDataAccess(c: AuthContext, next: Next) {
    const user = c.get('user') as JWTPayload | undefined;

    if (!user) {
        return forbiddenResponse(c, '인증이 필요합니다');
    }

    // 관리자와 강사는 모든 학생 데이터에 접근 가능
    if (user.role === 'admin' || user.role === 'teacher') {
        await next();
        return;
    }

    // 학생인 경우 본인 데이터만 접근 가능
    if (user.role === 'student') {
        const studentId = c.req.param('studentId') || c.req.query('student_id');

        if (!studentId) {
            // student_id가 없으면 본인 데이터 접근 허용
            await next();
            return;
        }

        if (parseInt(studentId) !== user.userId) {
            return forbiddenResponse(c, '본인의 데이터만 조회할 수 있습니다');
        }

        await next();
    } else {
        return forbiddenResponse(c, '권한이 없습니다');
    }
}

/**
 * 시험 결과 접근 검증 미들웨어
 * 학생이 자신의 시험 결과만 조회할 수 있도록 검증
 */
export async function verifyExamResultAccess(c: AuthContext, next: Next) {
    const user = c.get('user') as JWTPayload | undefined;

    if (!user) {
        return forbiddenResponse(c, '인증이 필요합니다');
    }

    // 관리자와 강사는 모든 시험 결과에 접근 가능
    if (user.role === 'admin' || user.role === 'teacher') {
        await next();
        return;
    }

    // 학생인 경우 본인 시험 결과만 접근 가능
    if (user.role === 'student') {
        const resultId = c.req.param('id');

        if (!resultId) {
            await next();
            return;
        }

        try {
            const db = c.env.DB;
            const result = await db.prepare(
                'SELECT student_id FROM student_scores WHERE id = ?'
            ).bind(resultId).first();

            if (!result) {
                return notFoundResponse(c, '시험 결과를 찾을 수 없습니다');
            }

            if (result.student_id !== user.userId) {
                return forbiddenResponse(c, '본인의 시험 결과만 조회할 수 있습니다');
            }

            await next();
        } catch (error) {
            console.error('Exam result access verification error:', error);
            return forbiddenResponse(c, '권한 확인 중 오류가 발생했습니다');
        }
    } else {
        return forbiddenResponse(c, '권한이 없습니다');
    }
}

/**
 * 수강생 관리 권한 검증 미들웨어
 * 강사가 자신의 강의 수강생만 관리할 수 있도록 검증
 */
export async function verifyEnrollmentManagement(c: AuthContext, next: Next) {
    const user = c.get('user') as JWTPayload | undefined;

    if (!user) {
        return forbiddenResponse(c, '인증이 필요합니다');
    }

    // 관리자는 모든 수강생 관리 가능
    if (user.role === 'admin') {
        await next();
        return;
    }

    // 강사인 경우 본인 강의의 수강생만 관리 가능
    if (user.role === 'teacher') {
        const enrollmentId = c.req.param('id');

        if (!enrollmentId) {
            return forbiddenResponse(c, '수강 신청 ID가 필요합니다');
        }

        try {
            const db = c.env.DB;
            const enrollment = await db.prepare(`
        SELECT e.id, c.teacher_id 
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.id = ?
      `).bind(enrollmentId).first();

            if (!enrollment) {
                return notFoundResponse(c, '수강 신청을 찾을 수 없습니다');
            }

            if (enrollment.teacher_id !== user.userId) {
                return forbiddenResponse(c, '본인 강의의 수강생만 관리할 수 있습니다');
            }

            await next();
        } catch (error) {
            console.error('Enrollment management verification error:', error);
            return forbiddenResponse(c, '권한 확인 중 오류가 발생했습니다');
        }
    } else {
        return forbiddenResponse(c, '강사 권한이 필요합니다');
    }
}
