// ============================================
// CORS 미들웨어
// ============================================

import { cors } from 'hono/cors';

/**
 * CORS 설정
 */
export const corsMiddleware = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://*.pages.dev', // Cloudflare Pages 도메인
    // 운영 도메인 추가
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
});
