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
export async function authMiddleware(c: Context<{ Bindings: Bindings }>, next: Next) {
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
  return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
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
