// ============================================
// 인증 미들웨어
// ============================================

import type { Context, Next } from 'hono';
import type { Bindings, JWTPayload, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';
import { unauthorizedResponse, forbiddenResponse } from '../utils/response';

/**
 * JWT 인증 미들웨어
 */
export async function authMiddleware(c: Context<{ Bindings: Bindings; Variables: { user: JWTPayload } }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse(c, '인증 토큰이 필요합니다');
  }

  const token = authHeader.substring(7); // "Bearer " 제거

  try {
    const payload = await verifyToken(token);

    if (!payload) {
      return unauthorizedResponse(c, '유효하지 않은 토큰입니다');
    }

    // Context에 사용자 정보 저장
    c.set('user', payload);

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return unauthorizedResponse(c, '인증에 실패했습니다');
  }
}

/**
 * 역할 기반 인증 미들웨어 팩토리
 */
export function requireRole(...roles: UserRole[]) {
  return async (c: Context<{ Bindings: Bindings; Variables: { user: JWTPayload } }>, next: Next) => {
    const user = c.get('user') as JWTPayload | undefined;

    if (!user) {
      return unauthorizedResponse(c, '인증이 필요합니다');
    }

    if (!roles.includes(user.role)) {
      return forbiddenResponse(c, '권한이 없습니다');
    }

    await next();
  };
}

/**
 * 관리자 전용 미들웨어
 */
export const requireAdmin = requireRole('admin');

/**
 * 강사 이상 권한 미들웨어
 */
export const requireTeacher = requireRole('teacher', 'admin');


/**
 * 로그인 사용자 미들웨어 (역할 무관)
 */
export const requireAuth = authMiddleware;

/**
 * 수강 등록 여부 확인 미들웨어 (강의장 입장 등)
 * :sessionId 파라미터 또는 쿼리가 필요함
 */
export const requireEnrollment = async (c: Context<{ Bindings: Bindings; Variables: { user: JWTPayload } }>, next: Next) => {
  const user = c.get('user') as JWTPayload;
  if (!user) return unauthorizedResponse(c, '로그인이 필요합니다');

  // 관리자나 강사는 통과
  if (['admin', 'teacher'].includes(user.role)) {
    await next();
    return;
  }

  const sessionId = c.req.param('sessionId') || c.req.query('sessionId');
  if (!sessionId) {
    return c.json({ success: false, error: '회차 ID가 필요합니다' }, 400);
  }

  const { DB } = c.env;
  // 수강 상태 확인 (enrolled or completed)
  const enrollment = await DB.prepare(`
        SELECT status FROM course_session_enrollments 
        WHERE session_id = ? AND user_id = ? 
        AND status IN ('enrolled', 'completed')
    `).bind(sessionId, user.userId).first();

  if (!enrollment) {
    return forbiddenResponse(c, '이 과정에 등록되지 않은 수강생입니다.');
  }

  await next();
};

