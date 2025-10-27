# 와우쓰리디쿠키홍대센터 교육 플랫폼

> 3D 프린팅과 메이커 교육의 중심 - 국비지원부터 자비부담까지 체계적인 교육 프로그램

## 📋 프로젝트 개요

- **프로젝트명**: 와우쓰리디쿠키홍대센터 교육 플랫폼
- **목표**: 3D 프린팅, 메이커 교육을 위한 종합 교육 플랫폼 구축
- **기술 스택**: Hono + TypeScript + Cloudflare Workers + D1 Database
- **프론트엔드**: Tailwind CSS + Vanilla JavaScript

## 🌐 배포 URL

- **Production**: https://884570b0.3dcookiehd.pages.dev
- **GitHub**: https://github.com/seojeongju/3DCookieHD (branch: education-platform)
- **API Base**: https://884570b0.3dcookiehd.pages.dev/api
- **API Documentation**: https://884570b0.3dcookiehd.pages.dev/api

## ✅ 완료된 기능 (Phase 1)

### 1. 프론트엔드 UI
- ✅ **블루 계열 메인 페이지** - 반응형 디자인, 히어로 섹션
- ✅ **로고 통합** - 와우쓰리디 로고 적용
- ✅ **네비게이션** - 스티키 헤더, 섹션별 이동
- ✅ **과정 필터링** - 카테고리별 필터 (3D프린팅, 메이커, 프로그래밍, 디자인)
- ✅ **API 연동** - 실시간 과정/캠퍼스 정보 로드

### 2. 인증 API (Authentication)
- ✅ 회원가입 (이메일/비밀번호)
- ✅ 로그인 (JWT 토큰 발급)
- ✅ 프로필 조회/수정 (인증 필요)
- ✅ 비밀번호 변경 (인증 필요)
- ✅ 역할 기반 접근 제어 (student, teacher, admin)

### 3. 과정 API (Courses)
- ✅ 과정 목록 조회 (필터링, 정렬, 페이지네이션)
- ✅ 과정 상세 조회 (조회수 증가)
- ✅ 과정 생성/수정/삭제 (관리자 전용)
- ✅ 필터링: 카테고리, 지역, 가격, 검색어
- ✅ 정렬: 최신순, 인기순, 평점순, 가격순

### 4. 캠퍼스 API (Campuses)
- ✅ 캠퍼스 목록 조회
- ✅ 캠퍼스 상세 조회 (관련 과정 포함)
- ✅ 지역별 캠퍼스 목록
- ✅ 지역 필터링 기능

### 5. 수강 신청 API (Enrollments) ⭐ NEW
- ✅ 수강 신청 목록 조회 (본인/관리자)
- ✅ 수강 신청 상세 조회
- ✅ 수강 신청 생성 (중복 검사, 정원 확인)
- ✅ 수강 신청 상태 변경 (관리자 전용)
- ✅ 수강 신청 취소 (본인/관리자)

### 6. 리뷰 시스템 API (Reviews) ⭐ NEW
- ✅ 리뷰 목록 조회 (승인된 리뷰만 표시)
- ✅ 리뷰 상세 조회
- ✅ 리뷰 작성 (인증 필요, 중복 방지)
- ✅ 리뷰 수정/삭제 (본인/관리자)
- ✅ 리뷰 승인/거부 (관리자 전용)
- ✅ 도움이 됐어요 기능
- ✅ 과정 평점 자동 업데이트

### 7. 게시판 시스템 API (Posts & Comments) ⭐ NEW
- ✅ 게시글 목록 조회 (카테고리, 검색, 상태 필터)
- ✅ 게시글 상세 조회 (댓글 포함, 조회수 증가)
- ✅ 게시글 작성/수정/삭제 (권한 검증)
- ✅ 게시글 카테고리 (공지사항, FAQ, 포트폴리오, Q&A)
- ✅ 댓글 작성/삭제 (대댓글 지원)
- ✅ 게시글 좋아요 기능
- ✅ 상단 고정 (관리자 전용)

## 📊 데이터 구조

### 데이터베이스 (Cloudflare D1)
프로덕션 D1 데이터베이스: `education-platform-db`

#### 전체 테이블 (12개)
1. **users** - 회원 정보 (학생, 강사, 관리자)
2. **campuses** - 캠퍼스 정보 (홍대 중심)
3. **courses** - 과정 정보 (3D 프린팅, 메이커, 프로그래밍, 디자인)
4. **enrollments** ⭐ - 수강 신청 정보
5. **reviews** ⭐ - 과정 리뷰 (승인 시스템)
6. **posts** ⭐ - 게시판 (공지사항, FAQ, 포트폴리오, Q&A)
7. **comments** ⭐ - 댓글 (대댓글 지원)
8. **consultations** - 상담 예약
9. **bookmarks** - 찜하기
10. **course_materials** - 강의 자료
11. **assignments** - 과제
12. **assignment_submissions** - 과제 제출

### 테스트 데이터
- **캠퍼스**: 강남본점, 신도림, 인천부평, 대전둔산 (4개)
- **과정**: UI/UX 웹디자인, JAVA 풀스택, 영상편집, 건축CAD, Python 데이터분석 (5개)
- **사용자**: 관리자, 강사, 학생 (3명)

## 🔌 API 엔드포인트

### 헬스 체크
```
GET /api/health
GET /api           # API 정보 및 전체 엔드포인트 목록
```

### 인증 (Authentication)
```
POST   /api/auth/register       # 회원가입
POST   /api/auth/login          # 로그인
GET    /api/auth/me             # 현재 사용자 정보 (인증 필요)
PUT    /api/auth/profile        # 프로필 수정 (인증 필요)
POST   /api/auth/change-password # 비밀번호 변경 (인증 필요)
```

### 과정 (Courses)
```
GET    /api/courses             # 과정 목록
GET    /api/courses/:id         # 과정 상세
POST   /api/courses             # 과정 생성 (관리자)
PUT    /api/courses/:id         # 과정 수정 (관리자)
DELETE /api/courses/:id         # 과정 삭제 (관리자)

# 쿼리 파라미터
?category=3D프린팅              # 카테고리 필터
?region=서울                    # 지역 필터
?price=free|paid               # 가격 필터
?search=키워드                  # 검색어
?sort=latest|popular|rating|price  # 정렬
?page=1&limit=12               # 페이지네이션
```

### 캠퍼스 (Campuses)
```
GET    /api/campuses            # 캠퍼스 목록
GET    /api/campuses/:id        # 캠퍼스 상세
GET    /api/campuses/list/regions # 지역 목록

# 쿼리 파라미터
?region=서울                    # 지역 필터
```

### 수강 신청 (Enrollments) ⭐ NEW
```
GET    /api/enrollments         # 신청 목록 (인증 필요)
GET    /api/enrollments/:id     # 신청 상세 (인증 필요)
POST   /api/enrollments         # 신청 생성 (인증 필요)
PUT    /api/enrollments/:id/status # 상태 변경 (관리자)
DELETE /api/enrollments/:id     # 신청 취소 (인증 필요)

# 쿼리 파라미터
?status=pending|approved|rejected|completed|cancelled
?page=1&limit=10
```

### 리뷰 (Reviews) ⭐ NEW
```
GET    /api/reviews             # 리뷰 목록
GET    /api/reviews/:id         # 리뷰 상세
POST   /api/reviews             # 리뷰 작성 (인증 필요)
PUT    /api/reviews/:id         # 리뷰 수정 (인증 필요)
DELETE /api/reviews/:id         # 리뷰 삭제 (인증 필요)
PUT    /api/reviews/:id/approve # 리뷰 승인 (관리자)
POST   /api/reviews/:id/helpful # 도움이 됐어요

# 쿼리 파라미터
?course_id=1                    # 특정 과정 리뷰만
?approved=1                     # 승인 여부
?page=1&limit=10
```

### 게시판 (Posts & Comments) ⭐ NEW
```
GET    /api/posts               # 게시글 목록
GET    /api/posts/:id           # 게시글 상세 (댓글 포함)
POST   /api/posts               # 게시글 작성 (인증 필요)
PUT    /api/posts/:id           # 게시글 수정 (인증 필요)
DELETE /api/posts/:id           # 게시글 삭제 (인증 필요)
POST   /api/posts/:id/like      # 게시글 좋아요

POST   /api/posts/:id/comments  # 댓글 작성 (인증 필요)
DELETE /api/posts/:post_id/comments/:comment_id # 댓글 삭제

# 쿼리 파라미터
?category=notice|faq|portfolio|qna # 카테고리
?search=키워드                    # 검색
?status=published|draft|hidden   # 상태
?page=1&limit=12
```

## 📝 사용 가이드

### 1. 메인 페이지 접속
```
https://884570b0.3dcookiehd.pages.dev/
```

### 2. 회원가입 및 로그인
```bash
# 회원가입
curl -X POST https://884570b0.3dcookiehd.pages.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"홍길동","phone":"010-1234-5678"}'

# 로그인
curl -X POST https://884570b0.3dcookiehd.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. 수강 신청
```bash
# 과정 목록 조회
curl https://884570b0.3dcookiehd.pages.dev/api/courses

# 수강 신청
curl -X POST https://884570b0.3dcookiehd.pages.dev/api/enrollments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id":1,"payment_method":"card"}'
```

### 4. 리뷰 작성
```bash
# 리뷰 작성
curl -X POST https://884570b0.3dcookiehd.pages.dev/api/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id":1,"rating":5,"title":"정말 유익했습니다","content":"강사님이 친절하시고 실습 중심으로 진행되어 좋았습니다"}'
```

### 5. 게시판 이용
```bash
# 게시글 목록 (공지사항)
curl https://884570b0.3dcookiehd.pages.dev/api/posts?category=notice

# 게시글 작성
curl -X POST https://884570b0.3dcookiehd.pages.dev/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"qna","title":"3D 프린터 재료 문의","content":"어떤 재료를 사용하나요?"}'
```

## 🚧 미완성 기능 (Phase 2)

- ⏳ 상담 예약 API (consultations)
- ⏳ 찜하기 API (bookmarks)
- ⏳ 강의 자료 API (course_materials)
- ⏳ 과제 관리 API (assignments, submissions)
- ⏳ 소셜 로그인 (네이버, 카카오, 구글)
- ⏳ 결제 연동 (토스페이먼츠, 이니시스)
- ⏳ 이메일/SMS 알림
- ⏳ 관리자 대시보드
- ⏳ 파일 업로드 (R2 Storage)

## 🎯 다음 개발 단계

### Phase 2: 부가 기능 (예정)
1. **상담 예약 시스템** - 온라인 상담 예약 및 관리
2. **찜하기 기능** - 관심 과정 북마크
3. **강의 자료 관리** - 동영상, PDF, 링크 등
4. **과제 제출 시스템** - 과제 등록, 제출, 채점
5. **파일 업로드** - R2 Storage 연동

### Phase 3: 고급 기능 (예정)
6. **소셜 로그인** - 네이버, 카카오, 구글 OAuth
7. **결제 연동** - 토스페이먼츠, 카카오페이
8. **알림 시스템** - 이메일, SMS 알림
9. **관리자 대시보드** - 종합 관리 화면
10. **실시간 채팅** - 학생-강사 소통

## 🔧 배포 상태

- **플랫폼**: Cloudflare Pages
- **상태**: ✅ Active
- **브랜치**: `education-platform`
- **자동 배포**: GitHub 연동 (Push 시 자동 빌드)
- **데이터베이스**: Cloudflare D1 (프로덕션 마이그레이션 완료)
- **마지막 업데이트**: 2025-10-27 (Phase 1 완료)

## 🛠️ 로컬 개발 환경

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 로컬 DB 마이그레이션 적용
npm run db:migrate:local

# 테스트 데이터 삽입
npm run db:seed

# 개발 서버 시작 (PM2)
npm run build
pm2 start ecosystem.config.cjs

# 로컬 테스트
curl http://localhost:3000/api/health
curl http://localhost:3000/
```

### 프로덕션 배포
```bash
# GitHub에 푸시 (자동 배포)
git add .
git commit -m "Update"
git push origin education-platform

# 또는 수동 배포
npm run deploy
```

## 📖 기술 문서

### 프론트엔드
- **Tailwind CSS** - 블루 계열 primary 색상 테마
- **Vanilla JavaScript** - API 연동, 필터링, 동적 렌더링
- **Font Awesome** - 아이콘
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

### JWT 인증
- Web Crypto API 기반 JWT 구현
- Authorization 헤더: `Bearer <token>`
- 토큰 만료: 24시간
- 비밀번호 해싱: SHA-256

### 데이터베이스
- Cloudflare D1 (SQLite)
- 마이그레이션 파일: `migrations/0001_initial_schema.sql`
- 로컬 개발: `--local` 플래그 사용
- 프로덕션: Cloudflare Dashboard 또는 Wrangler CLI

### API 응답 형식
```json
{
  "success": true,
  "data": { /* 데이터 */ },
  "pagination": { /* 페이지네이션 (목록 API만) */ }
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

## 🎨 디자인 시스템

### 색상 테마 (블루 계열)
- Primary 50: #eff6ff
- Primary 100: #dbeafe
- Primary 200: #bfdbfe
- Primary 300: #93c5fd
- Primary 400: #60a5fa
- Primary 500: #3b82f6
- Primary 600: #2563eb (주요 버튼)
- Primary 700: #1d4ed8
- Primary 800: #1e40af
- Primary 900: #1e3a8a

### 그라데이션
- Hero 배경: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)

## 📄 라이선스

MIT License

## 👥 Contributors

- Backend API Development: AI Assistant
- Frontend Development: AI Assistant  
- Database Design: AI Assistant
- JWT Implementation: Web Crypto API

---

**Last Updated**: 2025-10-27  
**Version**: 2.0.0 (Phase 1 완료)  
**Site**: 와우쓰리디쿠키홍대센터 교육 플랫폼
