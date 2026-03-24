import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { verifyToken } from '../utils/jwt';

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
  evidence: 'evidence',         // 증빙자료
  assignments: 'assignments',   // 과제 제출물
  materials: 'materials',       // 강의 자료
  images: 'images',             // 이미지
  profile: 'images/profile',     // 프로필/교강사 사진
} as const;

type FileCategory = keyof typeof FILE_CATEGORIES;
type MaskLevel = 'soft' | 'medium' | 'strong';
type MaskMode = 'auto' | 'boxes';
type FaceBox = { x: number; y: number; w: number; h: number };

function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function firstExtensionFromMime(mimeType: string): string {
  const exts = ALLOWED_MIME_TYPES[mimeType as keyof typeof ALLOWED_MIME_TYPES];
  if (!exts || !exts.length) return '.bin';
  return exts[0];
}

function safeRemoteImageName(urlText: string, mimeType: string): string {
  let base = 'remote_image';
  try {
    const parsed = new URL(urlText);
    const raw = parsed.pathname.split('/').pop() || '';
    const noExt = raw.replace(/\.[a-zA-Z0-9]+$/, '');
    if (noExt) base = noExt;
  } catch {}
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'remote_image';
  return clean + firstExtensionFromMime(mimeType);
}

function isBlockedRemoteHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '::1') return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const p = h.split('.').map((v) => parseInt(v, 10));
    if (p[0] === 10) return true;
    if (p[0] === 127) return true;
    if (p[0] === 169 && p[1] === 254) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
  }
  return false;
}

function buildStoragePath(basePath: string, folder: string | null, fileName: string): string {
  return folder ? `${basePath}/${folder}/${fileName}` : `${basePath}/${fileName}`;
}

async function getViewer(c: any): Promise<{ userId: number; role: string } | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.substring(7));
  if (!payload) return null;
  return { userId: payload.userId, role: payload.role };
}

function normalizeMaskLevel(v: string | null | undefined): MaskLevel {
  if (v === 'strong') return 'strong';
  if (v === 'medium') return 'medium';
  return 'soft';
}

function maskBlurByLevel(level: MaskLevel): number {
  if (level === 'strong') return 14;
  if (level === 'medium') return 10;
  return 7;
}

function normalizeMaskMode(v: string | null | undefined): MaskMode {
  return v === 'boxes' ? 'boxes' : 'auto';
}

function parseFaceBoxes(raw: string | null): FaceBox[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const out: FaceBox[] = [];
    for (const b of arr) {
      const x = Number(b?.x);
      const y = Number(b?.y);
      const w = Number(b?.w);
      const h = Number(b?.h);
      if (![x, y, w, h].every((n) => Number.isFinite(n))) continue;
      if (w <= 0 || h <= 0) continue;
      // 정규화 좌표(0~1)로 제한
      out.push({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        w: Math.max(0.001, Math.min(1, w)),
        h: Math.max(0.001, Math.min(1, h)),
      });
    }
    return out.slice(0, 50);
  } catch {
    return [];
  }
}

async function createMaskedImageFromR2Object(
  sourceUrl: string,
  mimeType: string,
  maskLevel: MaskLevel
): Promise<ArrayBuffer | null> {
  try {
    const transformed = await fetch(sourceUrl, {
      cf: {
        image: {
          // 1차 MVP: 얼굴 자동 인식 전, 전체 이미지에 약한 소프트 마스크 적용
          blur: maskBlurByLevel(maskLevel),
          quality: 88,
          format: mimeType === 'image/png' ? 'png' : 'webp',
        },
      },
      headers: {
        // 내부 호출 힌트(향후 접근제어 도입 시 조건 분기용)
        'X-Internal-Image-Transform': '1',
      },
    } as RequestInit);
    if (!transformed.ok) return null;
    return await transformed.arrayBuffer();
  } catch (e) {
    console.warn('createMaskedImageFromR2Object failed:', e);
    return null;
  }
}

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
    const maskLevel = normalizeMaskLevel(formData.get('mask_level') as string | null);
    const maskMode = normalizeMaskMode(formData.get('mask_mode') as string | null);
    const faceBoxes = parseFaceBoxes(formData.get('face_boxes') as string | null);

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
    let storedPath = filePath;
    let maskApplied = false;
    let originalPath: string | null = null;

    if (isImageMime(mimeType)) {
      // 1차 MVP: 이미지는 원본/공개본 분리 저장
      // - 원본: private/originals/... (직접 URL 미노출)
      // - 공개본: 기존 경로(filePath), 약한 마스크 적용본
      originalPath = buildStoragePath(`private/originals/${basePath}`, folder, newFileName);
      await R2.put(originalPath, fileBuffer, {
        httpMetadata: {
          contentType: mimeType,
          cacheControl: 'private, max-age=0, no-store',
        },
        customMetadata: {
          originalName: fileName,
          uploadedBy: user.userId.toString(),
          uploadedAt: new Date().toISOString(),
          category: category,
          visibility: 'private-original',
        },
      });

      const origin = new URL(c.req.url).origin;
      const encodedOriginalPath = originalPath.split('/').map(encodeURIComponent).join('/');
      const sourceUrl = `${origin}/api/upload/files/${encodedOriginalPath}`;
      // 3차 인터페이스: face_boxes 전달 시 boxes 모드로 처리(현재 MVP는 전체 마스크 강도 가중 fallback)
      const effectiveMaskLevel =
        maskMode === 'boxes' && faceBoxes.length > 0
          ? (maskLevel === 'soft' ? 'medium' : maskLevel)
          : maskLevel;
      const maskedBuffer = await createMaskedImageFromR2Object(sourceUrl, mimeType, effectiveMaskLevel);
      const publicBuffer = maskedBuffer ?? fileBuffer;
      maskApplied = maskedBuffer != null;

      await R2.put(filePath, publicBuffer, {
        httpMetadata: {
          contentType: mimeType,
          cacheControl: 'public, max-age=31536000', // 1년 캐싱
        },
        customMetadata: {
          originalName: fileName,
          uploadedBy: user.userId.toString(),
          uploadedAt: new Date().toISOString(),
          category: category,
          visibility: 'public-masked',
          maskApplied: String(maskApplied),
          maskLevel: effectiveMaskLevel,
          maskMode,
          faceBoxesJson: faceBoxes.length ? JSON.stringify(faceBoxes) : '',
          originalPath: originalPath,
        },
      });
      storedPath = filePath;
    } else {
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
    }

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
        storedPath,
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
    const publicUrl = `/api/upload/files/${storedPath}`;

    return c.json({
      success: true,
      data: {
        url: publicUrl,
        path: storedPath,
        fileName: newFileName,
        originalName: fileName,
        size: file.size,
        mimeType: mimeType,
        category: category,
        maskApplied,
        maskLevel: isImageMime(mimeType) ? maskLevel : null,
        maskMode: isImageMime(mimeType) ? maskMode : null,
        faceBoxesCount: isImageMime(mimeType) ? faceBoxes.length : 0,
        originalPath,
      },
    }, 201);
  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ success: false, error: '파일 업로드 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * 원격 이미지 URL 가져오기(다운로드 후 R2 저장)
 * POST /api/upload/import-url
 * body(JSON): { url: string, category?: 'images', folder?: string }
 */
app.post('/import-url', authMiddleware, async (c) => {
  try {
    const { R2, DB } = c.env;
    const user = c.get('user');
    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    const body = await c.req.json().catch(() => ({} as any));
    const urlText = String(body?.url || '').trim();
    const category = (String(body?.category || 'images') as FileCategory);
    const folder = body?.folder ? String(body.folder) : null;
    const maskLevel = normalizeMaskLevel(String(body?.mask_level || 'soft'));

    if (!urlText) return c.json({ success: false, error: '이미지 URL이 필요합니다' }, 400);
    if (!category || !FILE_CATEGORIES[category]) {
      return c.json({ success: false, error: '유효한 카테고리가 필요합니다' }, 400);
    }
    if (category !== 'images' && category !== 'profile') {
      return c.json({ success: false, error: '이미지 카테고리만 지원합니다' }, 400);
    }

    let remoteUrl: URL;
    try {
      remoteUrl = new URL(urlText);
    } catch {
      return c.json({ success: false, error: '유효하지 않은 URL입니다' }, 400);
    }
    if (remoteUrl.protocol !== 'http:' && remoteUrl.protocol !== 'https:') {
      return c.json({ success: false, error: 'http/https URL만 허용됩니다' }, 400);
    }
    if (isBlockedRemoteHost(remoteUrl.hostname)) {
      return c.json({ success: false, error: '허용되지 않은 호스트입니다' }, 400);
    }

    const remoteRes = await fetch(remoteUrl.toString(), { redirect: 'follow' });
    if (!remoteRes.ok) {
      return c.json({ success: false, error: `원격 이미지 다운로드 실패 (${remoteRes.status})` }, 400);
    }
    const mimeType = (remoteRes.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!isImageMime(mimeType)) {
      return c.json({ success: false, error: '이미지 URL이 아닙니다' }, 400);
    }
    if (!ALLOWED_MIME_TYPES[mimeType as keyof typeof ALLOWED_MIME_TYPES]) {
      return c.json({ success: false, error: '허용되지 않은 이미지 형식입니다' }, 400);
    }

    const fileBuffer = await remoteRes.arrayBuffer();
    if (fileBuffer.byteLength > MAX_FILE_SIZE) {
      return c.json({ success: false, error: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다` }, 400);
    }

    const originalName = safeRemoteImageName(remoteUrl.toString(), mimeType);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const newFileName = `${timestamp}_${randomStr}_${sanitizedFileName}`;

    const basePath = FILE_CATEGORIES[category];
    const filePath = folder ? `${basePath}/${folder}/${newFileName}` : `${basePath}/${newFileName}`;

    const originalPath = buildStoragePath(`private/originals/${basePath}`, folder, newFileName);
    await R2.put(originalPath, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'private, max-age=0, no-store',
      },
      customMetadata: {
        originalName,
        uploadedBy: user.userId.toString(),
        uploadedAt: new Date().toISOString(),
        category,
        visibility: 'private-original',
        sourceUrl: remoteUrl.toString(),
      },
    });

    const origin = new URL(c.req.url).origin;
    const encodedOriginalPath = originalPath.split('/').map(encodeURIComponent).join('/');
    const sourceUrl = `${origin}/api/upload/files/${encodedOriginalPath}`;
    const maskedBuffer = await createMaskedImageFromR2Object(sourceUrl, mimeType, maskLevel);
    const publicBuffer = maskedBuffer ?? fileBuffer;
    const maskApplied = maskedBuffer != null;

    await R2.put(filePath, publicBuffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000',
      },
      customMetadata: {
        originalName,
        uploadedBy: user.userId.toString(),
        uploadedAt: new Date().toISOString(),
        category,
        visibility: 'public-masked',
        maskApplied: String(maskApplied),
        maskLevel,
        maskMode: 'auto',
        faceBoxesJson: '',
        originalPath,
        sourceUrl: remoteUrl.toString(),
      },
    });

    try {
      await DB.prepare(`
        INSERT INTO file_metadata (
          file_path, file_name, file_size, mime_type, category, folder,
          uploaded_by, related_id, related_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        filePath,
        originalName,
        fileBuffer.byteLength,
        mimeType,
        category,
        folder,
        user.userId,
        null,
        'remote-import'
      ).run();
    } catch (dbError) {
      console.error('Failed to save remote-import metadata:', dbError);
    }

    const publicUrl = `/api/upload/files/${filePath}`;
    return c.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        fileName: newFileName,
        originalName,
        size: fileBuffer.byteLength,
        mimeType,
        category,
        maskApplied,
        maskLevel,
        maskMode: 'auto',
        faceBoxesCount: 0,
        originalPath,
        sourceUrl: remoteUrl.toString(),
      },
    }, 201);
  } catch (error) {
    console.error('Remote image import error:', error);
    return c.json({ success: false, error: '원격 이미지 가져오기 중 오류가 발생했습니다' }, 500);
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

    // 비공개 원본 접근은 관리자/업로드자만 허용
    // (내부 변환 호출은 전용 헤더로 허용)
    const isPrivateOriginalPath = filePath.startsWith('private/originals/');
    const isInternalTransform = c.req.header('X-Internal-Image-Transform') === '1';

    // 파일 조회
    const object = await R2.get(filePath);
    
    console.log('R2 object found:', !!object);

    if (!object) {
      console.error('File not found in R2:', filePath);
      const accept = c.req.header('Accept') || '';
      const wantsHtml = accept.includes('text/html');
      if (wantsHtml) {
        const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>파일을 찾을 수 없습니다</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-100 min-h-screen flex items-center justify-center p-4"><div class="bg-white rounded-xl shadow-lg p-8 max-w-md text-center"><h1 class="text-xl font-bold text-gray-800 mb-2">파일을 찾을 수 없습니다</h1><p class="text-gray-500 text-sm mb-6">요청한 파일이 저장소에 없거나 삭제되었을 수 있습니다.</p><button onclick="window.close()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">창 닫기</button></div></body></html>`;
        return new Response(html, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      return c.json({ success: false, error: `파일을 찾을 수 없습니다: ${filePath}` }, 404);
    }

    if (isPrivateOriginalPath && !isInternalTransform) {
      const viewer = await getViewer(c);
      if (!viewer) {
        return c.json({ success: false, error: '원본 파일 접근 권한이 없습니다' }, 403);
      }
      const uploadedBy = object.customMetadata?.uploadedBy;
      const isOwner = uploadedBy != null && uploadedBy === String(viewer.userId);
      const isAdmin = viewer.role === 'admin';
      if (!isOwner && !isAdmin) {
        return c.json({ success: false, error: '원본 파일 접근 권한이 없습니다' }, 403);
      }
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
    // 공개본 삭제 시 원본 경로가 있으면 함께 정리
    const originalPath = object.customMetadata?.originalPath;
    if (originalPath) {
      try {
        await R2.delete(originalPath);
      } catch (e) {
        console.warn('Failed to delete original image path:', originalPath, e);
      }
    }

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

/**
 * 마스크 재처리 (관리자): 원본 → 공개본 다시 생성
 * POST /api/upload/reprocess-mask
 * body: { path?: string, prefix?: string, mask_level?: 'soft'|'medium'|'strong', limit?: number }
 */
app.post('/reprocess-mask', authMiddleware, requireAdmin, async (c) => {
  try {
    const { R2 } = c.env;
    if (!R2) {
      return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    }

    const body = await c.req.json<{
      path?: string;
      prefix?: string;
      mask_level?: string;
      mask_mode?: string;
      face_boxes?: Array<{ x: number; y: number; w: number; h: number }>;
      limit?: number;
    }>();
    const maskLevel = normalizeMaskLevel(body.mask_level);
    const maskMode = normalizeMaskMode(body.mask_mode);
    const faceBoxes = Array.isArray(body.face_boxes) ? parseFaceBoxes(JSON.stringify(body.face_boxes)) : [];
    const singlePath = body.path ? String(body.path).trim() : '';
    const prefix = body.prefix ? String(body.prefix).trim() : 'images/';
    const limit = Math.max(1, Math.min(500, Number(body.limit || 100)));

    const targets: string[] = [];
    if (singlePath) {
      targets.push(singlePath);
    } else {
      const listed = await R2.list({ prefix, limit });
      for (const obj of listed.objects) targets.push(obj.key);
    }

    let ok = 0;
    let skip = 0;
    let fail = 0;
    for (const path of targets) {
      try {
        const head = await R2.head(path);
        if (!head) {
          fail++;
          continue;
        }
        const mimeType = head.httpMetadata?.contentType || '';
        const originalPath = head.customMetadata?.originalPath;
        if (!originalPath || !isImageMime(mimeType)) {
          skip++;
          continue;
        }
        const origin = new URL(c.req.url).origin;
        const encodedOriginalPath = originalPath.split('/').map(encodeURIComponent).join('/');
        const sourceUrl = `${origin}/api/upload/files/${encodedOriginalPath}`;
        const effectiveMaskLevel =
          maskMode === 'boxes' && faceBoxes.length > 0
            ? (maskLevel === 'soft' ? 'medium' : maskLevel)
            : maskLevel;
        const masked = await createMaskedImageFromR2Object(sourceUrl, mimeType, effectiveMaskLevel);
        if (!masked) {
          fail++;
          continue;
        }
        await R2.put(path, masked, {
          httpMetadata: {
            contentType: mimeType,
            cacheControl: head.httpMetadata?.cacheControl || 'public, max-age=31536000',
          },
          customMetadata: {
            ...(head.customMetadata || {}),
            visibility: 'public-masked',
            maskApplied: 'true',
            maskLevel: effectiveMaskLevel,
            maskMode,
            faceBoxesJson: faceBoxes.length ? JSON.stringify(faceBoxes) : (head.customMetadata?.faceBoxesJson || ''),
            originalPath,
          },
        });
        ok++;
      } catch (e) {
        console.error('reprocess-mask failed for', path, e);
        fail++;
      }
    }

    return c.json({
      success: true,
      data: { ok, skip, fail, total: targets.length, maskLevel, maskMode, faceBoxesCount: faceBoxes.length },
    });
  } catch (e) {
    console.error('reprocess-mask error:', e);
    return c.json({ success: false, error: '마스크 재처리 중 오류가 발생했습니다' }, 500);
  }
});

/**
 * 공개본의 마스크 메타 조회(관리자)
 * GET /api/upload/mask-meta?path=images/...
 */
app.get('/mask-meta', authMiddleware, requireAdmin, async (c) => {
  try {
    const { R2 } = c.env;
    if (!R2) return c.json({ success: false, error: 'R2 스토리지가 설정되지 않았습니다' }, 500);
    const path = String(c.req.query('path') || '').trim();
    if (!path) return c.json({ success: false, error: 'path가 필요합니다' }, 400);
    const head = await R2.head(path);
    if (!head) return c.json({ success: false, error: '파일을 찾을 수 없습니다' }, 404);
    const meta = head.customMetadata || {};
    const faceBoxes = parseFaceBoxes(meta.faceBoxesJson || '');
    return c.json({
      success: true,
      data: {
        path,
        maskApplied: meta.maskApplied === 'true',
        maskLevel: meta.maskLevel || null,
        maskMode: meta.maskMode || null,
        originalPath: meta.originalPath || null,
        faceBoxes,
        faceBoxesCount: faceBoxes.length,
      },
    });
  } catch (e) {
    console.error('mask-meta error:', e);
    return c.json({ success: false, error: '마스크 메타 조회 중 오류가 발생했습니다' }, 500);
  }
});

export default app;
