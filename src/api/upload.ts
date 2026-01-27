import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// 허용된 파일 타입
const ALLOWED_MIME_TYPES = {
  // 문서
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  // 이미지
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  // 기타
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
};

// 최대 파일 크기 (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 파일 카테고리별 경로
const FILE_CATEGORIES = {
  resumes: 'resumes',           // 이력서
  portfolios: 'portfolios',     // 포트폴리오
  documents: 'documents',       // 일반 문서
  evidence: 'evidence',          // 증빙자료
  assignments: 'assignments',   // 과제 제출물
  materials: 'materials',       // 강의 자료
  images: 'images',             // 이미지
} as const;

type FileCategory = keyof typeof FILE_CATEGORIES;

/**
 * 파일 업로드
 * POST /api/upload
 * 
 * FormData:
 * - file: File (필수)
 * - category: string (필수) - resumes, portfolios, documents, evidence, assignments, materials, images
 * - folder?: string (선택) - 추가 폴더 경로 (예: user_id, course_id 등)
 */
app.post('/', authMiddleware, async (c) => {
  try {
    const { R2 } = c.env;
    const user = c.get('user');

    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as FileCategory;
    const folder = formData.get('folder') as string | null;

    // 유효성 검사
    if (!file) {
      return c.json({ success: false, error: '파일이 필요합니다' }, 400);
    }

    if (!category || !FILE_CATEGORIES[category]) {
      return c.json({ success: false, error: '유효한 카테고리가 필요합니다' }, 400);
    }

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ success: false, error: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다` }, 400);
    }

    // MIME 타입 검사
    const mimeType = file.type;
    if (!ALLOWED_MIME_TYPES[mimeType as keyof typeof ALLOWED_MIME_TYPES]) {
      return c.json({ success: false, error: '허용되지 않은 파일 형식입니다' }, 400);
    }

    // 파일 확장자 검사
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ALLOWED_MIME_TYPES[mimeType as keyof typeof ALLOWED_MIME_TYPES];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return c.json({ success: false, error: '파일 확장자가 MIME 타입과 일치하지 않습니다' }, 400);
    }

    // 파일명 생성 (타임스탬프 + 랜덤 문자열 + 원본 파일명)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const newFileName = `${timestamp}_${randomStr}_${sanitizedFileName}`;

    // R2 경로 생성
    const basePath = FILE_CATEGORIES[category];
    const filePath = folder 
      ? `${basePath}/${folder}/${newFileName}`
      : `${basePath}/${newFileName}`;

    // 파일을 R2에 업로드
    const fileBuffer = await file.arrayBuffer();
    await R2.put(filePath, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000', // 1년 캐싱
      },
      customMetadata: {
        originalName: fileName,
        uploadedBy: user.userId.toString(),
        uploadedAt: new Date().toISOString(),
        category: category,
      },
    });

    // 파일 메타데이터를 데이터베이스에 저장
    const { DB } = c.env;
    const relatedId = formData.get('related_id') ? parseInt(formData.get('related_id') as string) : null;
    const relatedType = formData.get('related_type') as string | null;

    try {
      await DB.prepare(`
        INSERT INTO file_metadata (
          file_path, file_name, file_size, mime_type, category, folder,
          uploaded_by, related_id, related_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        filePath,
        fileName,
        file.size,
        mimeType,
        category,
        folder,
        user.userId,
        relatedId,
        relatedType
      ).run();
    } catch (dbError) {
      console.error('Failed to save file metadata:', dbError);
      // 메타데이터 저장 실패해도 파일 업로드는 성공으로 처리
    }

    // 공개 URL 생성 (Cloudflare R2 Public URL)
    // 실제 배포 환경에서는 R2 Custom Domain을 사용하거나
    // Workers를 통해 파일을 서빙해야 합니다
    const publicUrl = `/api/upload/files/${filePath}`;

    return c.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        fileName: newFileName,
        originalName: fileName,
        size: file.size,
        mimeType: mimeType,
        category: category,
      },
    }, 201);
  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ success: false, error: '파일 업로드 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * 파일 다운로드/조회
 * GET /api/upload/files/:path(*)
 * 
 * 경로 예시:
 * - /api/upload/files/documents/personnel_certs/new_0/file.pdf
 * - /api/upload/files/resumes/user123/resume.pdf
 */
app.get('/files/*', async (c) => {
  try {
    const { R2 } = c.env;
    
    // URL에서 파일 경로 추출
    const url = new URL(c.req.url);
    const pathname = url.pathname;
    console.log('Full URL pathname:', pathname);
    
    // /api/upload/files/ 부분을 제거하여 실제 파일 경로만 추출
    let filePath = pathname.replace(/^\/api\/upload\/files\//, '');
    
    // 만약 여전히 /files/로 시작하면 제거
    if (filePath.startsWith('files/')) {
      filePath = filePath.replace(/^files\//, '');
    }
    
    console.log('Extracted file path:', filePath);

    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    // 파일 경로 정규화 (URL 디코딩)
    try {
      filePath = decodeURIComponent(filePath);
    } catch (e) {
      console.warn('Failed to decode file path:', e);
    }
    
    console.log('Normalized file path:', filePath);

    // 파일 조회
    const object = await R2.get(filePath);
    
    console.log('R2 object found:', !!object);

    if (!object) {
      // 파일이 없으면 더 자세한 정보 로깅
      console.error('File not found in R2:', filePath);
      return c.json({ success: false, error: `파일을 찾을 수 없습니다: ${filePath}` }, 404);
    }

    // 파일 메타데이터
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Content-Length', object.size.toString());
    headers.set('Cache-Control', object.httpMetadata?.cacheControl || 'public, max-age=31536000');
    
    // 원본 파일명이 있으면 Content-Disposition 헤더 추가
    // 다운로드 요청인지 확인 (download 쿼리 파라미터)
    const isDownload = c.req.query('download') === 'true';
    if (object.customMetadata?.originalName) {
      const disposition = isDownload ? 'attachment' : 'inline';
      // 파일명에 특수문자가 있을 수 있으므로 인코딩
      const encodedFileName = encodeURIComponent(object.customMetadata.originalName);
      headers.set('Content-Disposition', `${disposition}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
    } else if (isDownload) {
      // 원본 파일명이 없어도 다운로드 모드로 설정
      const fileName = filePath.split('/').pop() || 'file';
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    }

    // 파일 스트림 반환
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('File retrieval error:', error);
    return c.json({ success: false, error: '파일 조회 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * 파일 삭제
 * DELETE /api/upload/:path(*)
 * 
 * 관리자 또는 파일 업로드자만 삭제 가능
 */
app.delete('/*', authMiddleware, async (c) => {
  try {
    const { R2 } = c.env;
    const user = c.get('user');
    // 와일드카드 경로 추출
    const fullPath = c.req.path;
    // /api/upload/ 부분을 제거하여 실제 파일 경로만 추출
    let filePath = fullPath.replace('/api/upload/', '');

    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    // 파일 메타데이터 조회
    const object = await R2.head(filePath);

    if (!object) {
      return c.json({ success: false, error: '파일을 찾을 수 없습니다' }, 404);
    }

    // 권한 검사: 관리자이거나 파일 업로드자인지 확인
    const uploadedBy = object.customMetadata?.uploadedBy;
    if (user.role !== 'admin' && uploadedBy !== user.userId.toString()) {
      return c.json({ success: false, error: '파일 삭제 권한이 없습니다' }, 403);
    }

    // 파일 삭제
    await R2.delete(filePath);

    return c.json({
      success: true,
      message: '파일이 삭제되었습니다',
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return c.json({ success: false, error: '파일 삭제 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * 파일 목록 조회
 * GET /api/upload?category=resumes&folder=user123
 * 
 * 관리자 전용
 */
app.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const { R2 } = c.env;
    const category = c.req.query('category') as FileCategory | undefined;
    const folder = c.req.query('folder');

    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    // 경로 구성
    let prefix = '';
    if (category && FILE_CATEGORIES[category]) {
      prefix = FILE_CATEGORIES[category];
      if (folder) {
        prefix = `${prefix}/${folder}`;
      }
    } else if (folder) {
      prefix = folder;
    }

    // R2에서 파일 목록 조회
    // 주의: R2는 list API가 제한적이므로, 실제로는 데이터베이스에 파일 메타데이터를 저장하는 것이 좋습니다
    // 여기서는 기본적인 구현만 제공합니다

    return c.json({
      success: true,
      data: {
        prefix,
        message: '파일 목록 조회는 데이터베이스의 파일 메타데이터를 통해 수행하는 것을 권장합니다',
      },
    });
  } catch (error) {
    console.error('File list error:', error);
    return c.json({ success: false, error: '파일 목록 조회 중 오류가 발생했습니다' }, 500);
  }
});

export default app;
