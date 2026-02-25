# 세션 인계 문서
> 마지막 업데이트: 2026-02-25

---

## 📁 프로젝트 정보

- **레포지토리**: `d:\Documents\program_DEV\3DCookieHD-education-platform`
- **GitHub**: `https://github.com/seojeongju/3DCookieHD.git`
- **브랜치**: `education-platform`
- **배포 URL**: `https://3dcookiehd.pages.dev`
- **배포 방식**: Cloudflare Pages (wrangler)
  - 배포 명령어: `wrangler pages deploy dist --project-name 3dcookiehd --branch education-platform --commit-message="영문 메시지"`
  - ⚠️ 주의: 커밋 메시지가 한글이면 Cloudflare API가 거부함 → `--commit-message` 옵션으로 영문 메시지 사용 필수
- **기술 스택**: Hono (Cloudflare Workers) + Vite + D1 (SQLite) + Tailwind CSS

---

## ✅ 이번 세션에서 완료된 작업 (2026-02-25)

### 1. 학생 대시보드 종합 개선
- **종합 대시보드**: 첫 진입 화면을 종합 대시보드로 변경, 수강 중인 강의 상단·진행 중인 시험 요약 표시 (`src/views/student_dashboard.ts`)
- **사이드메뉴**: 기능별 그룹화(학습 / 평가·설문 / 성과 / 계정), 프로필 요약·섹션 라벨·아이콘 버튼 UI 고도화
- **메뉴 순서**: 종합 대시보드 → 수강 중인 강의 → 나의 시험 → 성적/결과 → 설문/평가 → 포트폴리오 → NCS 평가 → 취업 성과 → 수강생 정보
- **학사관리**: 홈페이지 학사관리 하위메뉴를 관리자/강사/학생 대시보드 3개만 표시 (`public/static/academic-menu.js`); 관리자·강사가 학생 대시보드 진입 시 리다이렉트 제거
- **스크립트 오류 수정**: 인라인 스크립트 내 TypeScript `as` 제거, 정규식 `/<` → `new RegExp('<','g')`, 동적 onclick 내 `\'` → `&#39;` 로 수정해 SyntaxError 해소
- **커밋**: `0734ed4`, `5b83577`, `bcf110d`, `70360c9`

### 2. (이전) 수강생 대시보드 접속 오류 수정
- **문제**: 수강생 로그인 후 `/student` 대시보드 접속 불가
- **원인**: `src/views/student_dashboard.ts`의 `window.onload`에서 **존재하지 않는 함수** 호출 → `updateTime()`, `updateDate()`, `loadDashboardData()` → ReferenceError로 스크립트 중단
- **수정**:
  - `window.onload` 성공 시 `updateWelcomeTime()`, `setInterval(updateWelcomeTime, 1000)`, `loadStudentStats()` 호출로 변경
  - 초기 로그인 모달 표시 시 `getElementById('initialLoginModal')` null 체크 추가
- **로그인**: `src/views/login.ts` — 역할 `user`인 경우에도 `/student`로 리디렉션하도록 추가
- **커밋**: `ddf3d49` — fix(student): 수강생 대시보드 접속 오류 수정

### 2. (이전 세션) 출석 실데이터 표시
- **파일**: `src/views/admin_lms_attendance.ts`
- **내용**: 마감 과정에서 미입력 옵션, 해당일 미기록 표시, 통계에서 null 제외
- **커밋**: `3273f5f`

### 3. (이전) 역할 기반 접근 제어 (Admin Role Access Fix)
- **파일**: `src/views/components/hrd_sidebar.ts`
- **내용**: `/admin` 경로 접근 시 역할 검사 IIFE 추가
  - `teacher` → `/teacher` 리디렉션
  - `student` → `/student` 리디렉션
  - 비로그인 → `/login` 리디렉션
- **커밋**: `93bc4eb`

### 4. LMS 헤더 교육 시간 표시 개선
- **파일**: `src/views/components/lms_header.ts`
- **내용**: `recruiting`, `active` 상태를 "진행중"으로 표시, 요일 정보 없어도 시간 표시
- **커밋**: `93bc4eb`

### 5. 과정 상세 API 수정
- **파일**: `src/api/courses.ts`
- **내용**: HRD 과정 상세 조회 시 `training_time_start`(→ `start_time`), `training_time_end`(→ `end_time`), `status` 반환 추가
- **커밋**: `93bc4eb`

### 6. CBT 시험 생성 에러 수정 (중요)
- **문제**: `/admin/courses/:id/lms/cbt` 페이지에서 시험 생성 클릭 시 404 에러
- **원인**: `/api/cbt/exams`, `/api/cbt/questions` 백엔드 라우트가 미등록
- **수정**:
  - `src/api/cbt.ts` **신규 생성** - CBT 전용 API
  - `src/index.tsx` - `import cbt` 추가 + `app.route('/api/cbt', cbt)` 등록
- **커밋**: `c615399`
- **지원 엔드포인트**:
  - `GET  /api/cbt/exams?course_id=` - 시험 목록
  - `POST /api/cbt/exams` - 시험 생성
  - `PUT  /api/cbt/exams/:id` - 시험 수정
  - `DELETE /api/cbt/exams/:id` - 시험 삭제
  - `GET  /api/cbt/questions?course_id=` - 문제 목록
  - `POST /api/cbt/questions` - 문제 등록
  - `DELETE /api/cbt/questions/:id` - 문제 삭제

---

## ⚠️ 미완성 / 추가 개선 필요 사항

### CBT 페이지 추가 기능 미구현
- **파일**: `src/views/admin_lms_cbt.ts`
- **미완성 기능**:
  - 시험 수정/삭제 버튼 연결 (현재 버튼은 있지만 함수 미구현)
  - 문제 삭제 버튼 연결 (trash 아이콘 있지만 onclick 없음)
  - 결과 분석 탭 (`content-results`) 실제 데이터 연동 미구현
  - AI 문제 생성 (PDF 업로드) - 현재는 alert만 표시

### teacher LMS 페이지 공유 CBT 접근 검토
- `/teacher/courses/:id/lms/cbt` 경로가 있는지 확인 필요
- 현재 `admin_lms_cbt.ts`가 teacher URL에서도 사용되는지 확인

### 배포 스크립트 개선 검토
- `package.json`의 `deploy` 스크립트가 한글 커밋 메시지로 인해 Cloudflare 거부됨
- 스크립트를 아래처럼 수정하면 자동화 가능:
  ```json
  "deploy": "npm run build && wrangler pages deploy dist --project-name 3dcookiehd --branch education-platform --commit-message='deploy: latest build'"
  ```

---

## 📊 현재 Git 상태

```
브랜치: education-platform
최신 커밋: 70360c9 - fix(student): onclick location.href quote escape to fix Unexpected string error
이전 커밋: bcf110d - feat(student): 사이드메뉴 기능별 그룹화 및 UI 고도화, 메뉴순서 및 onclick 수정
origin과 동기화됨
배포: npm run deploy 후 https://*.3dcookiehd.pages.dev
```

---

## 🗂️ 주요 파일 위치 참고

| 역할 | 파일 경로 |
|------|-----------|
| 메인 라우터 | `src/index.tsx` |
| HRD 사이드바 | `src/views/components/hrd_sidebar.ts` |
| LMS 헤더 | `src/views/components/lms_header.ts` |
| CBT 페이지 HTML | `src/views/admin_lms_cbt.ts` |
| CBT API | `src/api/cbt.ts` (신규) |
| 일반 시험 API | `src/api/exams.ts` |
| HRD API | `src/api/hrd.ts` |
| 인증 미들웨어 | `src/middleware/auth.ts` |
| DB 스키마 마이그레이션 | `migrations/` 디렉토리 |

---

## 🔑 다음 세션 시작 시 권장 작업

1. `admin_lms_cbt.ts` 에서 **수정/삭제 버튼 연결** 및 **결과 분석 탭 구현**
2. CBT 시험 생성 후 실제 동작 확인 (`https://3dcookiehd.pages.dev/admin/courses/6/lms/cbt?type=hrd`)
3. `package.json` `deploy` 스크립트 수정으로 배포 자동화
