# 교육 플랫폼 API (Education Platform)

> greenart.co.kr 스타일의 교육 플랫폼 웹사이트

## 📋 프로젝트 개요

- **프로젝트명**: 교육 플랫폼 API
- **목표**: 국비지원 및 자비부담 교육 과정을 관리하고 수강생을 위한 종합 교육 플랫폼 구축
- **기술 스택**: Hono + TypeScript + Cloudflare Workers + D1 Database

## 🌐 배포 URL

- **Production**: https://884570b0.3dcookiehd.pages.dev
- **GitHub**: https://github.com/3DCookieHD/education-platform (branch: education-platform)
- **API Base**: https://884570b0.3dcookiehd.pages.dev/api

## ✅ 완료된 기능

### 1. 인증 API (Authentication)
- ✅ 회원가입 (이메일/비밀번호)
- ✅ 로그인 (JWT 토큰 발급)
- ✅ 프로필 조회 (인증 필요)
- ✅ 프로필 수정 (인증 필요)
- ✅ 비밀번호 변경 (인증 필요)
- ✅ 역할 기반 접근 제어 (student, teacher, admin)

### 2. 과정 API (Courses)
- ✅ 과정 목록 조회 (필터링, 정렬, 페이지네이션)
- ✅ 과정 상세 조회 (조회수 증가)
- ✅ 과정 생성 (관리자 전용)
- ✅ 과정 수정 (관리자 전용)
- ✅ 과정 삭제 (관리자 전용)
- ✅ 필터링: 카테고리, 지역, 가격, 검색어
- ✅ 정렬: 최신순, 인기순, 평점순, 가격순

### 3. 캠퍼스 API (Campuses)
- ✅ 캠퍼스 목록 조회
- ✅ 캠퍼스 상세 조회 (관련 과정 포함)
- ✅ 지역별 캠퍼스 목록
- ✅ 지역 필터링 기능

## 📊 데이터 구조

### 데이터베이스 (Cloudflare D1)
프로덕션 D1 데이터베이스: `education-platform-db`

#### 핵심 테이블
1. **users** - 회원 정보 (학생, 강사, 관리자)
2. **campuses** - 캠퍼스 정보 (강남본점, 신도림, 인천부평, 대전둔산)
3. **courses** - 과정 정보 (웹디자인, 프로그래밍, 영상편집, 건축CAD 등)
4. **enrollments** - 수강 신청 정보
5. **reviews** - 과정 리뷰
6. **posts** - 게시판 (공지사항, FAQ, 포트폴리오, Q&A)
7. **comments** - 댓글
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
?category=웹디자인              # 카테고리 필터
?region=서울                    # 지역 필터
?price=free|paid               # 가격 필터
?search=자바                    # 검색어
?sort=latest|popular|rating|price  # 정렬
?page=1&limit=12               # 페이지네이션
```

### 캠퍼스 (Campuses)
```
GET    /api/campuses            # 캠퍼스 목록
GET    /api/campuses/:id        # 캠퍼스 상세 (관련 과정 포함)
GET    /api/campuses/list/regions # 지역 목록

# 쿼리 파라미터
?region=서울                    # 지역 필터
```

## 📝 사용 가이드

### 1. 과정 검색하기
```bash
# 모든 과정 조회
curl https://884570b0.3dcookiehd.pages.dev/api/courses

# 프로그래밍 카테고리 과정만 조회
curl "https://884570b0.3dcookiehd.pages.dev/api/courses?category=프로그래밍"

# 서울 지역 무료 과정 조회
curl "https://884570b0.3dcookiehd.pages.dev/api/courses?region=서울&price=free"

# 최신순 정렬
curl "https://884570b0.3dcookiehd.pages.dev/api/courses?sort=latest"
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

# 프로필 조회 (JWT 토큰 필요)
curl https://884570b0.3dcookiehd.pages.dev/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. 캠퍼스 정보 조회
```bash
# 모든 캠퍼스 조회
curl https://884570b0.3dcookiehd.pages.dev/api/campuses

# 특정 캠퍼스 상세 조회 (관련 과정 포함)
curl https://884570b0.3dcookiehd.pages.dev/api/campuses/1

# 서울 지역 캠퍼스만 조회
curl "https://884570b0.3dcookiehd.pages.dev/api/campuses?region=서울"
```

## 🚧 미완성 기능

- ⏳ 수강 신청 API (enrollments)
- ⏳ 리뷰 작성/조회 API (reviews)
- ⏳ 게시판 API (posts, comments)
- ⏳ 상담 예약 API (consultations)
- ⏳ 찜하기 API (bookmarks)
- ⏳ 강의 자료 API (course_materials)
- ⏳ 과제 관리 API (assignments, submissions)
- ⏳ 소셜 로그인 (네이버, 카카오, 구글)
- ⏳ 프론트엔드 UI 개발

## 🎯 다음 개발 단계

### Phase 1: 핵심 기능 완성
1. **수강 신청 기능** - 과정 신청, 결제, 승인 관리
2. **리뷰 시스템** - 리뷰 작성, 수정, 삭제, 관리자 승인
3. **게시판 시스템** - 공지사항, FAQ, 포트폴리오, Q&A

### Phase 2: 부가 기능
4. **상담 예약 시스템** - 온라인 상담 예약 및 관리
5. **찜하기 기능** - 관심 과정 저장
6. **강의 자료 관리** - 동영상, PDF, 링크 등

### Phase 3: 고급 기능
7. **과제 제출 시스템** - 과제 등록, 제출, 채점
8. **소셜 로그인** - 네이버, 카카오, 구글 OAuth 연동
9. **알림 시스템** - 이메일, SMS 알림

### Phase 4: 프론트엔드
10. **반응형 웹 UI** - 데스크톱, 태블릿, 모바일 지원
11. **관리자 대시보드** - 과정/회원/상담 관리
12. **마이페이지** - 수강 내역, 과제, 성적 조회

## 🔧 배포 상태

- **플랫폼**: Cloudflare Pages
- **상태**: ✅ Active
- **브랜치**: `education-platform`
- **자동 배포**: GitHub 연동 (Push 시 자동 빌드)
- **데이터베이스**: Cloudflare D1 (프로덕션 마이그레이션 완료)
- **마지막 업데이트**: 2025-10-27

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
  "pagination": { /* 페이지네이션 정보 (목록 API만) */ }
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

## 📄 라이선스

MIT License

## 👥 기여자

- Backend API Development: AI Assistant
- Database Design: AI Assistant
- JWT Implementation: Web Crypto API

---

**Last Updated**: 2025-10-27
**Version**: 1.0.0 (MVP)
