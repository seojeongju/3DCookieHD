# 🎓 교육 플랫폼 API

그린컴퓨터아트학원(greenart.co.kr)을 참조하여 구축한 교육 플랫폼 백엔드 API

## 📋 프로젝트 개요

- **프로젝트명**: webapp (교육 플랫폼)
- **목적**: 온/오프라인 교육 플랫폼 구축
- **기술 스택**: Hono + TypeScript + Cloudflare D1 + Cloudflare Pages

## ✅ 현재 완료된 기능

### 1. 데이터베이스 설계
- ✅ 12개 테이블 구조 설계 완료
  - users (회원)
  - campuses (캠퍼스)
  - courses (과정)
  - enrollments (수강신청)
  - reviews (리뷰)
  - posts (게시판)
  - comments (댓글)
  - consultations (상담예약)
  - bookmarks (찜하기)
  - course_materials (강의자료)
  - assignments (과제)
  - assignment_submissions (과제제출)

### 2. 인증 API (완료)
- ✅ `POST /api/auth/register` - 회원가입
- ✅ `POST /api/auth/login` - 로그인 (JWT)
- ✅ `GET /api/auth/me` - 내 정보 조회
- ✅ `PUT /api/auth/profile` - 프로필 수정
- ✅ `POST /api/auth/change-password` - 비밀번호 변경

### 3. 과정(Course) API (완료)
- ✅ `GET /api/courses` - 과정 목록 조회
  - 필터링: 카테고리, 지역, 캠퍼스, 가격대, 검색어
  - 정렬: 최신순, 인기순, 가격순, 평점순
  - 페이지네이션
- ✅ `GET /api/courses/:id` - 과정 상세 조회
- ✅ `POST /api/courses` - 과정 생성 (관리자 전용)
- ✅ `PUT /api/courses/:id` - 과정 수정 (관리자 전용)
- ✅ `DELETE /api/courses/:id` - 과정 삭제 (관리자 전용)

### 4. 캠퍼스 API (완료)
- ✅ `GET /api/campuses` - 캠퍼스 목록 조회
- ✅ `GET /api/campuses/:id` - 캠퍼스 상세 조회
- ✅ `GET /api/campuses/list/regions` - 지역 목록 조회

### 5. 유틸리티 및 미들웨어
- ✅ JWT 인증 미들웨어 (Web Crypto API)
- ✅ 역할 기반 권한 관리 (student, teacher, admin)
- ✅ CORS 설정
- ✅ 에러 핸들링
- ✅ 응답 포맷 표준화

## 🔧 미구현 기능 (추후 개발 예정)

### 1. 수강신청 API
- `POST /api/enrollments` - 수강신청
- `GET /api/enrollments/my` - 내 수강 내역
- `PUT /api/enrollments/:id` - 수강 상태 변경

### 2. 리뷰 API
- `POST /api/reviews` - 리뷰 작성
- `GET /api/reviews` - 리뷰 목록
- `PUT /api/reviews/:id` - 리뷰 수정

### 3. 게시판/커뮤니티 API
- `GET /api/posts` - 게시글 목록 (공지사항, FAQ, 포트폴리오)
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:id` - 게시글 상세

### 4. 상담예약 API
- `POST /api/consultations` - 상담 예약
- `GET /api/consultations` - 상담 내역

### 5. 찜하기 API
- `POST /api/bookmarks` - 찜하기 추가
- `DELETE /api/bookmarks/:id` - 찜하기 제거
- `GET /api/bookmarks/my` - 내 찜 목록

## 🗄️ 데이터 모델

### 주요 테이블 관계
```
users (회원)
  ├── enrollments (수강신청) → courses (과정)
  ├── reviews (리뷰) → courses
  ├── posts (게시글)
  └── consultations (상담예약)

campuses (캠퍼스)
  ├── courses (과정)
  └── consultations (상담예약)

courses (과정)
  ├── enrollments (수강신청)
  ├── reviews (리뷰)
  ├── course_materials (강의자료)
  └── assignments (과제)
```

## 🚀 로컬 개발 환경 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 데이터베이스 마이그레이션
```bash
# 로컬 D1 데이터베이스 마이그레이션
npm run db:migrate:local

# 테스트 데이터 삽입
npm run db:seed
```

### 3. 빌드
```bash
npm run build
```

### 4. 개발 서버 시작
```bash
# PM2로 시작 (권장)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 5. API 테스트
```bash
# 헬스체크
curl http://localhost:3000/api/health

# 과정 목록 조회
curl http://localhost:3000/api/courses

# 캠퍼스 목록 조회
curl http://localhost:3000/api/campuses
```

## 📊 초기 테스트 데이터

### 사용자
- 관리자: admin@greenart.co.kr
- 강사: teacher1@greenart.co.kr, teacher2@greenart.co.kr
- 학생: student1@example.com, student2@example.com

### 캠퍼스 (4개)
- 강남본점 (서울)
- 신도림 (서울)
- 인천(부평)
- 대전(둔산)

### 과정 (5개)
1. UI/UX 반응형 웹디자인 & 웹퍼블리셔
2. React 프론트엔드 개발자 양성
3. 유튜브 크리에이터 영상편집
4. AutoCAD & 건축설계 실무
5. Python 데이터 분석 & 머신러닝

## 📡 API 엔드포인트 목록

### 인증
```
POST   /api/auth/register        - 회원가입
POST   /api/auth/login           - 로그인
GET    /api/auth/me              - 내 정보 조회 (인증 필요)
PUT    /api/auth/profile         - 프로필 수정 (인증 필요)
POST   /api/auth/change-password - 비밀번호 변경 (인증 필요)
```

### 과정
```
GET    /api/courses              - 과정 목록 조회
GET    /api/courses/:id          - 과정 상세 조회
POST   /api/courses              - 과정 생성 (관리자)
PUT    /api/courses/:id          - 과정 수정 (관리자)
DELETE /api/courses/:id          - 과정 삭제 (관리자)
```

### 캠퍼스
```
GET    /api/campuses             - 캠퍼스 목록 조회
GET    /api/campuses/:id         - 캠퍼스 상세 조회
GET    /api/campuses/list/regions - 지역 목록 조회
```

### 시스템
```
GET    /api                      - API 정보
GET    /api/health               - 헬스체크
```

## 🔒 인증 방식

### JWT Bearer Token
```bash
# 로그인 후 받은 토큰을 Authorization 헤더에 포함
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/auth/me
```

## 🌐 배포

### Cloudflare Pages 배포 (추후)
```bash
# 프로덕션 D1 데이터베이스 생성
wrangler d1 create webapp-production

# 마이그레이션 적용
npm run db:migrate:prod

# 배포
npm run deploy:prod
```

## 📦 패키지 스크립트

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "deploy": "npm run build && wrangler pages deploy",
  "deploy:prod": "npm run build && wrangler pages deploy dist --project-name webapp",
  "db:migrate:local": "wrangler d1 migrations apply webapp-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply webapp-production",
  "db:seed": "wrangler d1 execute webapp-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
  "test": "curl http://localhost:3000"
}
```

## 🛠️ 기술 스택

- **프레임워크**: Hono ^4.10.3
- **런타임**: Cloudflare Workers / Pages
- **데이터베이스**: Cloudflare D1 (SQLite)
- **언어**: TypeScript
- **빌드 도구**: Vite ^6.3.5
- **배포 도구**: Wrangler ^4.4.0
- **프로세스 관리**: PM2

## 📝 다음 단계

1. ✅ **백엔드 API 구축 완료**
2. ⏳ **추가 API 구현** (수강신청, 리뷰, 게시판)
3. ⏳ **프론트엔드 UI 개발** (React/Vue 또는 Vanilla JS + TailwindCSS)
4. ⏳ **결제 시스템 연동** (토스페이먼츠/아임포트)
5. ⏳ **소셜 로그인** (네이버, 카카오, 구글)
6. ⏳ **파일 업로드** (Cloudflare R2)
7. ⏳ **알림 시스템** (이메일/SMS)

## 📞 API 테스트 예제

### 1. 회원가입
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "홍길동",
    "phone": "010-1234-5678"
  }'
```

### 2. 로그인
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. 과정 목록 조회 (필터링)
```bash
# 카테고리별
curl "http://localhost:3000/api/courses?category=웹디자인"

# 검색
curl "http://localhost:3000/api/courses?search=React"

# 지역별
curl "http://localhost:3000/api/courses?region=서울"

# 정렬
curl "http://localhost:3000/api/courses?sort=rating"
```

## 📄 라이선스

MIT

## 👨‍💻 개발자

- AI Assistant
- 개발 기간: 2025-10-27
- 상태: 백엔드 API 개발 완료, 프론트엔드 개발 대기 중
