# R2 스토리지 설정 가이드

## 📋 개요

학생 및 교직원의 이력서, 포트폴리오, 증빙자료 등의 파일을 안전하게 저장하기 위해 Cloudflare R2 스토리지를 설정합니다.

## ✅ 완료된 작업

1. ✅ R2 바인딩 설정 (`wrangler.toml`, `wrangler.json`)
2. ✅ 파일 업로드 API 구현 (`/api/upload`)
3. ✅ 파일 다운로드/조회 API 구현 (`/api/upload/files/:path`)
4. ✅ 파일 메타데이터 테이블 생성 (Migration 0026)

## 🚀 설정 단계

### 1. Cloudflare 대시보드에서 R2 버킷 생성

```bash
# Wrangler CLI를 사용하여 버킷 생성
wrangler r2 bucket create education-platform-files
```

또는 Cloudflare 대시보드에서:
1. Cloudflare 대시보드 접속
2. R2 → Create bucket
3. 버킷 이름: `education-platform-files`
4. Location: 가장 가까운 리전 선택

### 2. 로컬 개발 환경 설정

`wrangler.toml`에 이미 R2 바인딩이 설정되어 있습니다:

```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "education-platform-files"
```

### 3. 데이터베이스 마이그레이션 실행

```bash
# 로컬
npm run db:migrate:local

# 프로덕션
npm run db:migrate:prod
```

## 📁 파일 카테고리

다음 카테고리로 파일을 분류하여 저장합니다:

- `resumes` - 이력서
- `portfolios` - 포트폴리오
- `documents` - 일반 문서
- `evidence` - 증빙자료 (NCS 평가 등)
- `assignments` - 과제 제출물
- `materials` - 강의 자료
- `images` - 이미지 파일

## 🔌 API 사용법

### 파일 업로드

```javascript
// FormData로 파일 업로드
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('category', 'resumes'); // resumes, portfolios, documents, evidence, assignments, materials, images
formData.append('folder', 'user123'); // 선택사항: 추가 폴더 경로
formData.append('related_id', '123'); // 선택사항: 관련 엔티티 ID
formData.append('related_type', 'jobseeker'); // 선택사항: 관련 엔티티 타입

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

const result = await response.json();
// result.data.url - 파일 URL
// result.data.path - R2 경로
// result.data.fileName - 저장된 파일명
```

### 파일 다운로드/조회

```javascript
// 파일 URL로 직접 접근
const fileUrl = '/api/upload/files/resumes/user123/resume.pdf';

// 또는 fetch로 가져오기
const response = await fetch(fileUrl);
const blob = await response.blob();
```

### 파일 삭제

```javascript
// 관리자 또는 파일 업로드자만 삭제 가능
const response = await fetch('/api/upload/resumes/user123/resume.pdf', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

## 📝 허용된 파일 형식

### 문서
- PDF (`.pdf`)
- Word (`.doc`, `.docx`)
- Excel (`.xls`, `.xlsx`)
- PowerPoint (`.ppt`, `.pptx`)
- 텍스트 (`.txt`)

### 이미지
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)

### 기타
- ZIP (`.zip`)
- RAR (`.rar`)

### 제한사항
- 최대 파일 크기: **50MB**
- 인증된 사용자만 업로드 가능
- 파일 삭제는 관리자 또는 업로드자만 가능

## 🔒 보안 고려사항

1. **인증**: 모든 업로드는 인증이 필요합니다 (`authMiddleware`)
2. **권한**: 파일 삭제는 관리자 또는 파일 업로드자만 가능
3. **파일 검증**: MIME 타입 및 확장자 검증
4. **파일 크기 제한**: 50MB 제한
5. **파일명 정규화**: 특수문자 제거 및 타임스탬프 추가

## 🔄 기존 코드와의 통합

### 구직자 이력서 업로드

기존 `jobseekers` API를 수정하여 실제 파일 업로드를 지원하도록 할 수 있습니다:

```javascript
// 1. 파일 업로드
const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token },
  body: formData
});
const uploadData = await uploadRes.json();

// 2. 구직자 정보에 파일 URL 저장
await fetch('/api/jobseekers', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token 
  },
  body: JSON.stringify({
    name: '홍길동',
    resume_file: uploadData.data.url, // 업로드된 파일 URL
    // ...
  })
});
```

### 학생 증빙자료 업로드

NCS 증빙자료 업로드도 동일한 방식으로 통합할 수 있습니다:

```javascript
// 1. 파일 업로드
const formData = new FormData();
formData.append('file', file);
formData.append('category', 'evidence');
formData.append('folder', `student_${studentId}`);
formData.append('related_id', planId.toString());
formData.append('related_type', 'ncs_plan');

const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token },
  body: formData
});
const uploadData = await uploadRes.json();

// 2. NCS 증빙자료에 파일 URL 저장
await fetch('/api/ncs/evidence', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token 
  },
  body: JSON.stringify({
    plan_id: planId,
    student_id: studentId,
    file_name: '증빙자료',
    file_url: uploadData.data.url, // 업로드된 파일 URL
    file_type: 'document',
    comment: comment
  })
});
```

## 🌐 프로덕션 배포

### R2 Custom Domain 설정 (선택사항)

공개 URL을 더 깔끔하게 만들려면 R2 Custom Domain을 설정할 수 있습니다:

1. Cloudflare 대시보드 → R2 → `education-platform-files` 버킷
2. Settings → Public Access → Connect Domain
3. 도메인 연결 (예: `files.yourdomain.com`)

그러면 파일 URL이 다음과 같이 변경됩니다:
- 기존: `/api/upload/files/resumes/user123/resume.pdf`
- 변경: `https://files.yourdomain.com/resumes/user123/resume.pdf`

### 환경 변수

프로덕션 배포 시 R2 바인딩이 자동으로 연결됩니다. 추가 설정은 필요 없습니다.

## 📊 파일 메타데이터 조회

파일 목록을 조회하려면 데이터베이스의 `file_metadata` 테이블을 사용합니다:

```sql
-- 특정 카테고리의 파일 목록
SELECT * FROM file_metadata 
WHERE category = 'resumes' 
ORDER BY uploaded_at DESC;

-- 특정 사용자가 업로드한 파일
SELECT * FROM file_metadata 
WHERE uploaded_by = 123;

-- 특정 엔티티와 관련된 파일
SELECT * FROM file_metadata 
WHERE related_type = 'jobseeker' AND related_id = 456;
```

## ⚠️ 주의사항

1. **R2 버킷 생성**: 프로덕션 배포 전에 반드시 R2 버킷을 생성해야 합니다
2. **마이그레이션 실행**: `file_metadata` 테이블을 생성하기 위해 마이그레이션을 실행해야 합니다
3. **파일 크기**: 대용량 파일 업로드 시 타임아웃을 고려해야 합니다
4. **비용**: R2는 사용량 기반 과금이므로 파일 저장량을 모니터링하세요

## 🎯 다음 단계

1. ✅ R2 버킷 생성
2. ✅ 마이그레이션 실행
3. ⏭️ 구직자 이력서 업로드 UI 개선
4. ⏭️ 학생 증빙자료 업로드 UI 개선
5. ⏭️ 파일 관리 대시보드 구현

---

**작성일**: 2026-01-27  
**버전**: 1.0.0
