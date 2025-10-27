// ============================================
// API Response 유틸리티
// ============================================

import type { Context } from 'hono';
import type { ApiResponse, PaginatedResponse } from '../types';

/**
 * 성공 응답 생성
 */
export function successResponse<T>(c: Context, data: T, message?: string, status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return c.json(response, status);
}

/**
 * 에러 응답 생성
 */
export function errorResponse(c: Context, error: string, status: number = 400) {
  const response: ApiResponse = {
    success: false,
    error
  };
  return c.json(response, status);
}

/**
 * 페이지네이션 응답 생성
 */
export function paginatedResponse<T>(
  c: Context,
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
  
  return c.json(response);
}

/**
 * 생성 성공 응답
 */
export function createdResponse<T>(c: Context, data: T, message: string = '생성되었습니다') {
  return successResponse(c, data, message, 201);
}

/**
 * 삭제 성공 응답
 */
export function deletedResponse(c: Context, message: string = '삭제되었습니다') {
  return successResponse(c, null, message, 200);
}

/**
 * 404 Not Found 응답
 */
export function notFoundResponse(c: Context, message: string = '리소스를 찾을 수 없습니다') {
  return errorResponse(c, message, 404);
}

/**
 * 401 Unauthorized 응답
 */
export function unauthorizedResponse(c: Context, message: string = '인증이 필요합니다') {
  return errorResponse(c, message, 401);
}

/**
 * 403 Forbidden 응답
 */
export function forbiddenResponse(c: Context, message: string = '권한이 없습니다') {
  return errorResponse(c, message, 403);
}

/**
 * 500 Internal Server Error 응답
 */
export function serverErrorResponse(c: Context, message: string = '서버 오류가 발생했습니다') {
  return errorResponse(c, message, 500);
}
