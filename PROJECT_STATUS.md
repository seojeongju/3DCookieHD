# 와우쓰리디홍대센터 교육 플랫폼 - 프로젝트 현황 파악

**작성일**: 2026-01-27  
**프로젝트명**: 와우쓰리디홍대센터 교육 플랫폼  
**기술 스택**: Hono + TypeScript + Cloudflare Workers + D1 Database + TailwindCSS

---

## 📋 프로젝트 개요

3D 프린팅 교육을 위한 종합 온라인 플랫폼으로, 학생/강사/관리자 역할 기반의 학사관리 시스템(LMS)과 HRD 행정 시스템을 포함한 통합 교육 플랫폼입니다.

### 배포 정보
- **프로덕션 URL**: https://education-platform-6wa.pages.dev
- **GitHub**: https://github.com/seojeongju/3DCookieHD (education-platform 브랜치)
- **데이터베이스**: Cloudflare D1 (ID: 28fc5bec-bc18-46a9-8aea-fc4a4f6e44db)

---

## ✅ 완료된 주요 기능

### 1. 인증 및 사용자 관리
- ✅ JWT 기반 로그인/회원가입
- ✅ 역할 기반 접근 제어 (student, teacher, admin)
- ✅ 사용자 권한 관리 시스템

### 2. 과정 관리 (Courses)
- ✅ 과정 CRUD (관리자)
- ✅ 카테고리별 필터링 (3D모델링, 3D프린팅, 자격증, 창업/실무)
- ✅ 과정 목록/상세 조회

### 3. 수강 관리 (Enrollments)
- ✅ 수강 신청/취소
- ✅ 수강 상태 관리 (pending, approved, rejected, completed, cancelled)
- ✅ 관리자 승인 시스템

### 4. 리뷰 시스템 (Reviews)
- ✅ 후기 작성/수정/삭제
- ✅ 별점 시스템
- ✅ 도움됨 기능
- ✅ 관리자 승인 시스템

### 5. 게시판 시스템 (Posts & Comments)
- ✅ 4개 게시판 (공지사항, FAQ, 포트폴리오, Q&A)
- ✅ 댓글 시스템 (중첩 댓글 지원)
- ✅ 좋아요 기능
- ✅ 조회수 추적

### 6. 스케줄 관리 (Schedules)
- ✅ 달력 형태 개강 일정표
- ✅ 월별 네비게이션
- ✅ 카테고리 필터링
- ✅ 관리자 스케줄 관리 API

### 7. 학사관리 시스템 (LMS)

#### 7.1 출결 관리
- ✅ 출결 기록 (attendance_logs)
- ✅ QR 코드 출석 체크
- ✅ 출석률 자동 계산

#### 7.2 시험 시스템 (CBT)
- ✅ 시험 생성/관리
- ✅ 문제은행 관리
- ✅ 시험 응시 (실전/연습 모드)
- ✅ 자동 채점
- ✅ 시험 결과 분석

#### 7.3 성적 관리
- ✅ 평가 항목 설정
- ✅ 학생별 성적 입력
- ✅ 성적표 출력
- ✅ 석차 계산

#### 7.4 상담 관리
- ✅ 상담 일지 작성
- ✅ 상담 이력 관리
- ✅ 학생별 상담 기록 조회

#### 7.5 훈련 일지
- ✅ 훈련 일지 작성
- ✅ NCS 능력단위 연동
- ✅ 결재 시스템

#### 7.6 기타 LMS 기능
- ✅ 과제 관리 (Assignments)
- ✅ 설문조사 (Surveys)
- ✅ 학습 진도 관리 (Progress)
- ✅ NCS 평가 시스템
- ✅ 취업 추적 (Employment Tracking)

### 8. HRD 행정 시스템

#### 8.1 인사 관리
- ✅ 인력 관리 (Personnel)
- ✅ 학생 관리 (Students)
- ✅ 사용자 상태 관리

#### 8.2 시설 및 장비 관리
- ✅ 시설 관리 (Facilities)
- ✅ 장비 관리 (Items)
- ✅ 장비 대여 (Rentals)
- ✅ 시설 예약 (Reservations)

#### 8.3 상담 관리
- ✅ HRD 상담 기록
- ✅ 상담 이력 관리

### 9. 채용 관리
- ✅ 채용공고 관리 (Jobs)
- ✅ 구직자 관리 (Jobseekers)

### 10. 포트폴리오 갤러리
- ✅ 수강생 포트폴리오 관리
- ✅ 갤러리 형태 표시

### 11. 웹사이트 분석
- ✅ 방문자 추적 (Website Visits)
- ✅ 페이지별 통계
- ✅ 일일 PV/UV 집계
- ✅ 주간 트렌드 분석

### 12. 캘린더 이벤트
- ✅ 캘린더 이벤트 관리
- ✅ 일정 관리

---

## 📊 데이터베이스 구조

### 마이그레이션 이력 (총 25개)

1. `0001_initial_schema.sql` - 기본 스키마 (users, courses, enrollments, reviews, posts 등)
2. `0002_add_schedules.sql` - 스케줄 관리
3. `0003_add_jobs_and_jobseekers.sql` - 채용 관리
4. `0004_add_lms_tables.sql` - LMS 기본 테이블
5. `0004_assignments.sql` - 과제 관리
6. `0005_enhance_consultations.sql` - 상담 테이블 확장
7. `0005_progress_and_qr.sql` - 진도 및 QR 출석
8. `0006_production_test_data.sql` - 테스트 데이터
9. `0007_add_hrd_tables.sql` - HRD 기본 테이블
10. `0008_add_hrd_counseling.sql` - HRD 상담
11. `0009_add_user_status.sql` - 사용자 상태
12. `0010_add_ncs_tables.sql` - NCS 기본 테이블
13. `0011_add_ncs_evaluation_tables.sql` - NCS 평가
14. `0012_add_ncs_elements.sql` - NCS 요소
15. `0013_update_training_logs_ncs.sql` - 훈련일지 NCS 연동
16. `0014_add_employment_tracking.sql` - 취업 추적
17. `0015_add_portfolio_gallery.sql` - 포트폴리오 갤러리
18. `0016_hrd_integration.sql` - HRD 통합
19. `0017_add_user_personal_info.sql` - 사용자 개인정보
20. `0018_add_course_class_days.sql` - 과정 수업일
21. `0019_add_course_subject.sql` - 과정 과목
22. `0020_add_hrd_rentals.sql` - HRD 대여
23. `0021_add_hrd_item_image.sql` - 장비 이미지
24. `0022_add_facility_items_relation.sql` - 시설-장비 관계
25. `0023_add_facility_reservations.sql` - 시설 예약
26. `0024_add_calendar_events.sql` - 캘린더 이벤트
27. `0025_add_website_visits.sql` - 웹사이트 방문 추적 ⭐ **최신**

---

## 🎯 최근 작업 내역

### 마지막으로 추가된 기능들

1. **웹사이트 방문 추적 시스템** (Migration 0025)
   - 방문자 IP, 페이지, User-Agent 추적
   - 일일 PV/UV 집계
   - 주간 트렌드 분석
   - 인기 페이지 분석
   - API: `/api/dashboard/website-stats`

2. **캘린더 이벤트 관리** (Migration 0024)
   - 캘린더 이벤트 생성/관리
   - 일정 통합 관리

3. **시설 예약 시스템** (Migration 0023)
   - 시설 예약 기능
   - 예약 관리

4. **센터소개 메뉴** (프론트엔드)
   - 인사말 페이지
   - 교육사진 갤러리
   - 시설현황
   - 지점안내

---

## 📁 프로젝트 구조

```
src/
├── api/                    # API 라우트 핸들러
│   ├── auth.ts            # 인증
│   ├── courses.ts         # 과정
│   ├── enrollments.ts     # 수강 신청
│   ├── reviews.ts         # 후기
│   ├── posts.ts           # 게시판
│   ├── schedules.ts       # 스케줄
│   ├── exams.ts           # 시험
│   ├── students.ts        # 학생 관리
│   ├── hrd.ts             # HRD 행정
│   ├── ncs.ts             # NCS 평가
│   ├── dashboard.ts       # 대시보드
│   ├── portfolios.ts      # 포트폴리오
│   ├── surveys.ts         # 설문조사
│   ├── assignments.ts     # 과제
│   ├── progress.ts        # 진도
│   ├── attendance_qr.ts   # QR 출석
│   └── ...
│
├── views/                 # HTML 뷰 템플릿
│   ├── admin_*.ts         # 관리자 페이지들
│   ├── admin_lms_*.ts     # LMS 관리 페이지들
│   ├── student_*.ts       # 학생 페이지들
│   ├── teacher_*.ts       # 강사 페이지들
│   ├── components/        # 공통 컴포넌트
│   │   ├── navigation.ts
│   │   ├── hrd_sidebar.ts
│   │   ├── teacher_sidebar.ts
│   │   └── lms_header.ts
│   └── ...
│
├── middleware/            # 미들웨어
│   ├── auth.ts           # 인증 미들웨어
│   ├── cors.ts           # CORS 설정
│   ├── tracking.ts       # 방문 추적 ⭐
│   └── ownership.ts      # 소유권 검증
│
├── utils/                 # 유틸리티
│   ├── database.ts       # DB 헬퍼
│   ├── jwt.ts            # JWT 처리
│   ├── response.ts       # 응답 헬퍼
│   └── imageResize.ts    # 이미지 리사이즈
│
├── types/                 # TypeScript 타입
│   └── index.ts
│
└── index.tsx              # 메인 애플리케이션 (라우팅)

migrations/                # 데이터베이스 마이그레이션
public/                    # 정적 파일
├── static/               # 이미지, CSS 등
└── *.js                  # 프론트엔드 스크립트
```

---

## 🔌 주요 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 과정
- `GET /api/courses` - 과정 목록
- `GET /api/courses/:id` - 과정 상세
- `POST /api/courses` - 과정 생성 (관리자)
- `PUT /api/courses/:id` - 과정 수정 (관리자)
- `DELETE /api/courses/:id` - 과정 삭제 (관리자)

### 수강 신청
- `GET /api/enrollments` - 내 수강 목록
- `POST /api/enrollments` - 수강 신청
- `PUT /api/enrollments/:id/status` - 상태 변경 (관리자)
- `DELETE /api/enrollments/:id` - 수강 취소

### 시험 (CBT)
- `GET /api/exams` - 시험 목록
- `POST /api/exams` - 시험 생성 (관리자)
- `GET /api/exams/:id` - 시험 상세
- `POST /api/exams/:id/submit` - 시험 제출

### HRD
- `GET /api/hrd/personnel` - 인력 목록
- `GET /api/hrd/facilities` - 시설 목록
- `GET /api/hrd/items` - 장비 목록
- `POST /api/hrd/rentals` - 장비 대여

### 대시보드
- `GET /api/dashboard/website-stats` - 웹사이트 통계 ⭐

---

## 🎨 관리자 페이지 목록

### 메인 대시보드
- `/admin` - 관리자 대시보드

### 과정 관리
- `/admin/courses` - 과정 관리
- `/admin/courses/:id/lms` - 과정별 LMS 대시보드

### 학생 관리
- `/admin/students` - 학생 관리
- `/admin/users` - 회원 권한 관리

### LMS 관리
- `/admin/courses/:id/lms/attendance` - 출결 관리
- `/admin/courses/:id/lms/ncs-eval` - NCS 평가
- `/admin/courses/:id/lms/grades` - 성적 관리
- `/admin/courses/:id/lms/counseling` - 상담 관리
- `/admin/courses/:id/lms/training-logs` - 훈련 일지
- `/admin/courses/:id/lms/cbt` - CBT 관리
- `/admin/courses/:id/lms/surveys` - 설문조사
- `/admin/courses/:id/lms/assignments` - 과제 관리
- `/admin/courses/:id/lms/qr-attendance` - QR 출석
- `/admin/courses/:id/lms/employment` - 취업 추적

### HRD 관리
- `/admin/hrd` - HRD 대시보드
- `/admin/personnel` - 인력 관리
- `/admin/items` - 장비 관리
- `/admin/facilities` - 시설 관리
- `/admin/attendance` - 출결 관리
- `/admin/counseling` - 상담 관리

### 기타 관리
- `/admin/exams` - 시험 관리
- `/admin/exams/:id/results` - 시험 결과
- `/admin/reviews` - 후기 관리
- `/admin/posts` - 게시판 관리
- `/admin/schedule` - 스케줄 관리
- `/admin/ncs` - NCS 관리
- `/admin/jobs` - 채용공고 관리
- `/admin/jobseekers` - 구직자 관리
- `/admin/inquiries` - 문의 관리

---

## 👥 사용자 페이지

### 학생
- `/student` - 학생 대시보드
- `/student/exams` - 시험 목록
- `/student/exams/:id` - 시험 응시

### 강사
- `/teacher` - 강사 대시보드
- `/teacher/portfolios` - 포트폴리오 관리
- `/teacher/surveys` - 설문조사 관리
- `/teacher/courses` - 과정 관리
- `/teacher/students` - 학생 관리
- `/teacher/attendance` - 출결 관리
- `/teacher/exams` - 시험 관리

### 공개 페이지
- `/` - 메인 페이지
- `/courses` - 과정 목록
- `/schedule` - 스케줄
- `/reviews` - 수강 후기
- `/posts` - 게시판
- `/portfolios` - 포트폴리오 갤러리
- `/locations` - 지점 안내
- `/login` - 로그인
- `/register` - 회원가입

---

## 🚀 개발 환경 설정

### 필수 도구
- Node.js (v18+)
- npm
- Wrangler CLI
- Cloudflare 계정

### 개발 서버 실행
```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 로컬 개발 (로컬 DB)
npm run dev:sandbox

# 로컬 개발 (프로덕션 DB - 주의!)
wrangler pages dev dist --d1=education-platform-db
```

### 데이터베이스 관리
```bash
# 로컬 마이그레이션
npm run db:migrate:local

# 프로덕션 마이그레이션
npm run db:migrate:prod

# 로컬 DB 초기화
npm run db:reset
```

### 배포
```bash
# 자동 배포 (GitHub Actions)
git push origin education-platform

# 수동 배포
npm run deploy:prod
```

---

## ⏭️ 다음 개발 단계 (TODO)

### Phase 2 - 프론트엔드 완성
- [ ] 로그인/회원가입 모달
- [x] 스케줄 페이지 ✅
- [ ] 과정 목록 페이지 개선
- [ ] 과정 상세 페이지
- [ ] 수강 신청 폼
- [ ] 마이페이지
- [ ] 게시판 UI 개선

### Phase 3 - 관리자 대시보드 개선
- [ ] 통계 대시보드 시각화
- [ ] 갤러리 이미지 업로드
- [ ] 파일 업로드 (R2 Storage)
- [ ] 엑셀 내보내기/가져오기

### Phase 4 - 추가 기능
- [ ] 결제 시스템 (Stripe 연동)
- [ ] 이메일 알림 (SendGrid)
- [ ] 실시간 채팅 지원
- [ ] 모바일 앱 (PWA)

### Phase 5 - 고도화
- [ ] AI 문제 생성 (PDF → 문제은행)
- [ ] 부정행위 방지 (CBT)
- [ ] 실시간 출석 체크
- [ ] 학습 분석 대시보드

---

## 🔍 현재 상태 요약

### ✅ 완료된 주요 모듈
1. 인증 및 권한 관리
2. 과정 및 수강 관리
3. 리뷰 및 게시판
4. 스케줄 관리
5. LMS 전체 기능 (출결, 시험, 성적, 상담, 훈련일지 등)
6. HRD 행정 시스템
7. 채용 관리
8. 포트폴리오 갤러리
9. 웹사이트 방문 추적 ⭐
10. 캘린더 이벤트

### 🎯 최근 작업
- 웹사이트 방문 추적 시스템 구현 (Migration 0025)
- 방문 통계 API 구현 (`/api/dashboard/website-stats`)
- 캘린더 이벤트 관리 (Migration 0024)
- 시설 예약 시스템 (Migration 0023)

### 📝 다음 작업 제안
1. **웹사이트 통계 대시보드 UI** - 방문 통계를 시각화하는 관리자 페이지
2. **캘린더 이벤트 관리 UI** - 이벤트 생성/수정/삭제 인터페이스
3. **시설 예약 관리 UI** - 예약 현황 및 관리 페이지
4. **프론트엔드 개선** - 사용자 경험 향상
5. **성능 최적화** - 쿼리 최적화, 캐싱 전략

---

## 💡 개발 팁

### 코드 구조
- API는 `src/api/` 디렉토리에 모듈별로 분리
- 뷰는 `src/views/` 디렉토리에 페이지별로 분리
- 공통 컴포넌트는 `src/views/components/`에 위치

### 데이터베이스
- 모든 마이그레이션은 `migrations/` 디렉토리에 순차적으로 저장
- 마이그레이션 파일명은 `00XX_description.sql` 형식
- D1은 SQLite 기반이므로 SQLite 문법 사용

### 배포
- `education-platform` 브랜치에 푸시 시 자동 배포
- GitHub Actions가 자동으로 빌드 및 배포 수행

---

**프로젝트 상태**: ✅ 안정적  
**마지막 업데이트**: 2026-01-27  
**다음 작업 준비**: ✅ 완료
