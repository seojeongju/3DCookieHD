import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware, requireAdmin } from './middleware/auth';

// API 라우트 임포트
import auth from './api/auth';
import courses from './api/courses';
import campuses from './api/campuses';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 글로벌 미들웨어
// ============================================
app.use('*', logger());

// CORS 설정 (API에만 적용)
app.use('/api/*', corsMiddleware);

// ============================================
// 정적 파일 서빙
// ============================================
app.use('/static/*', serveStatic({ root: './public' }));

// ============================================
// API 라우트
// ============================================

// 인증 API (인증 불필요)
app.route('/api/auth', auth);

// 과정 API
app.route('/api/courses', courses);

// 캠퍼스 API
app.route('/api/campuses', campuses);

// ============================================
// 헬스체크 엔드포인트
// ============================================
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'education-platform-api'
  });
});

// ============================================
// API 정보 엔드포인트
// ============================================
app.get('/api', (c) => {
  return c.json({
    name: 'Education Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (인증 필요)',
        profile: 'PUT /api/auth/profile (인증 필요)',
        changePassword: 'POST /api/auth/change-password (인증 필요)'
      },
      courses: {
        list: 'GET /api/courses',
        detail: 'GET /api/courses/:id',
        create: 'POST /api/courses (관리자 전용)',
        update: 'PUT /api/courses/:id (관리자 전용)',
        delete: 'DELETE /api/courses/:id (관리자 전용)'
      },
      campuses: {
        list: 'GET /api/campuses',
        detail: 'GET /api/campuses/:id',
        regions: 'GET /api/campuses/list/regions'
      }
    }
  });
});

// ============================================
// 메인 페이지 (임시)
// ============================================
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>교육 플랫폼 API</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-6">
                    🎓 교육 플랫폼 API
                </h1>
                
                <div class="space-y-6">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-green-800 mb-2">✅ API 서버 실행 중</h2>
                        <p class="text-green-700">백엔드 API가 정상적으로 작동하고 있습니다.</p>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-blue-800 mb-3">📚 API 엔드포인트</h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-semibold text-blue-700 mb-2">인증 (Auth)</h3>
                                <ul class="text-sm text-gray-700 space-y-1 ml-4">
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">POST /api/auth/register</code> - 회원가입</li>
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">POST /api/auth/login</code> - 로그인</li>
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">GET /api/auth/me</code> - 내 정보 조회</li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="font-semibold text-blue-700 mb-2">과정 (Courses)</h3>
                                <ul class="text-sm text-gray-700 space-y-1 ml-4">
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">GET /api/courses</code> - 과정 목록</li>
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">GET /api/courses/:id</code> - 과정 상세</li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="font-semibold text-blue-700 mb-2">캠퍼스 (Campuses)</h3>
                                <ul class="text-sm text-gray-700 space-y-1 ml-4">
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">GET /api/campuses</code> - 캠퍼스 목록</li>
                                    <li>• <code class="bg-blue-100 px-2 py-1 rounded">GET /api/campuses/:id</code> - 캠퍼스 상세</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-yellow-800 mb-2">🔧 개발 중</h2>
                        <p class="text-yellow-700">프론트엔드 UI는 현재 개발 중입니다.</p>
                        <p class="text-yellow-700 mt-2">API 테스트: Postman, Thunder Client 등을 사용하세요.</p>
                    </div>

                    <div class="flex gap-4 mt-6">
                        <a href="/api" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            API 정보 보기
                        </a>
                        <a href="/api/health" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                            헬스체크
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// ============================================
// 404 핸들러
// ============================================
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: '요청하신 리소스를 찾을 수 없습니다'
  }, 404);
});

// ============================================
// 에러 핸들러
// ============================================
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: '서버 오류가 발생했습니다'
  }, 500);
});

export default app;
