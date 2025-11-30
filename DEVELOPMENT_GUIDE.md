# 프로덕션과 동일한 로컬 개발 환경 가이드

## ✅ 완료된 설정

1. **Cloudflare D1 데이터베이스 연결** ✅
   - Database ID: `28fc5bec-bc18-46a9-8aea-fc4a4f6e44db`
   - 모든 마이그레이션 적용 완료

2. **Wrangler 설정** ✅
   - `wrangler.toml` 구성 완료
   - Cloudflare 로그인 완료

## 🚀 프로덕션 환경으로 개발하기

### 방법 1: Wrangler Dev (추천 - 실제 D1 DB 사용)

```bash
# 빌드 먼저 실행
npm run build

# Wrangler 개발 서버 실행 (프로덕션 DB 연결)
wrangler pages dev dist --d1=education-platform-db
```

**특징:**
- ✅ **실제 프로덕션 D1 데이터베이스** 사용
- ✅ 프로덕션과 **100% 동일한 환경**
- ✅ 변경사항이 실제 배포 환경에 반영
- ⚠️ 주의: 실제 DB를 사용하므로 테스트 데이터에 주의

### 방법 2: 로컬 D1 DB 사용 (안전한 개발)

```bash
# 로컬 D1 데이터베이스 초기화
npm run db:migrate:local

# 테스트 데이터 추가
npm run db:seed

# 로컬 개발 서버 실행
npm run dev:sandbox
```

**특징:**
- ✅ 로컬 DB로 안전하게 개발
- ✅ 프로덕션과 동일한 스키마
- ✅ 실수해도 프로덕션 영향 없음
- ⚠️ 로컬 DB는 `.wrangler/` 폴더에 저장

## 📝 개발 워크플로우

### 1단계: 로컬에서 개발 및 테스트
```bash
# 로컬 DB로 안전하게 개발
npm run dev:sandbox

# 또는 Vite 개발 서버 (더 빠른 HMR)
npm run dev
```

### 2단계: 실제 프로덕션 데이터로 테스트
```bash
# 프로덕션 DB 연결하여 테스트
npm run build
wrangler pages dev dist --d1=education-platform-db
```

### 3단계: 배포
```bash
# education-platform 브랜치에 푸시
git add .
git commit -m "feature: 새 기능 추가"
git push origin education-platform

# 자동 배포 트리거됨!
```

## 🗄️ 데이터베이스 관리

### 로컬 DB 초기화
```bash
# 로컬 DB 완전 초기화
npm run db:reset

# 마이그레이션만 실행
npm run db:migrate:local

# 시드 데이터만 추가
npm run db:seed
```

### 프로덕션 DB 직접 쿼리
```bash
# 프로덕션 DB 콘솔
npm run db:console:prod

# 예시: 사용자 목록 조회
wrangler d1 execute education-platform-db --command "SELECT * FROM users LIMIT 10" --remote

# 예시: 시험 목록 조회
wrangler d1 execute education-platform-db --command "SELECT id, title, status FROM exams" --remote
```

### 로컬 DB 콘솔
```bash
# 로컬 DB 콘솔
npm run db:console:local
```

## 🧪 테스트 시나리오

### 1. 시험 관리 테스트

**로컬에서:**
```bash
# 1. 로컬 DB로 시작
npm run dev:sandbox

# 2. 브라우저에서 http://localhost:3000 접속
# 3. /admin/exams 에서 시험 생성 테스트
```

**프로덕션 데이터로:**
```bash
# 1. 실제 DB로 실행
npm run build
wrangler pages dev dist --d1=education-platform-db --local

# 2. 실제 학생/과정 데이터로 테스트
```

### 2. 수강생 관리 테스트

**프로덕션 환경에서:**
- https://3dcookiehd.pages.dev/admin/students
- 실제 학생 데이터 확인
- 상담 기록 추가/수정 테스트

## 🔧 유용한 명령어

### 개발 서버
```bash
npm run dev                 # Vite 개발 서버 (빠른 HMR)
npm run dev:sandbox         # Wrangler + 로컬 DB
npm run build               # 프로덕션 빌드
npm run preview             # Wrangler 프리뷰
```

### 데이터베이스
```bash
npm run db:migrate:local    # 로컬 DB 마이그레이션
npm run db:migrate:prod     # 프로덕션 DB 마이그레이션
npm run db:seed             # 로컬 DB 시드 데이터
npm run db:reset            # 로컬 DB 초기화
```

### 배포
```bash
npm run deploy              # Cloudflare Pages 배포
npm run deploy:prod         # 프로덕션 배포
```

## 📊 현재 프로덕션 DB 상태

### 테이블 구조
- ✅ `users` - 사용자 (학생, 관리자)
- ✅ `courses` - 과정
- ✅ `enrollments` - 수강 신청
- ✅ `consultations` - 상담 기록
- ✅ `exams` - 시험
- ✅ `questions` - 시험 문제
- ✅ `exam_results` - 시험 결과

### 마이그레이션 이력
1. ✅ `0001_initial_schema.sql` - 기본 스키마
2. ✅ `0002_add_schedules.sql` - 일정 관리
3. ✅ `0003_add_jobs_and_jobseekers.sql` - 채용 관리
4. ✅ `0004_add_lms_tables.sql` - LMS 테이블 (시험, CBT)
5. ✅ `0005_enhance_consultations.sql` - 상담 테이블 확장
6. ⏸️ `0006_production_test_data.sql` - 테스트 데이터 (선택)

## ⚠️ 주의사항

### 프로덕션 DB 사용 시
- **실제 데이터**를 다루므로 조심히 작업
- 테스트용 계정으로 로그인 권장
- 삭제 작업은 신중하게

### 로컬 DB 사용 시
- `.wrangler/` 폴더 삭제 시 데이터 초기화됨
- `npm run db:reset`으로 언제든 초기화 가능

## 🎯 추천 개발 프로세스

1. **새 기능 개발**: `npm run dev` (Vite - 빠름)
2. **DB 연동 테스트**: `npm run dev:sandbox` (로컬 DB)
3. **최종 검증**: 프로덕션 DB로 테스트
4. **배포**: `git push origin education-platform`

## 🌐 접속 URL

- **로컬 개발**: http://localhost:5173 (Vite) 또는 http://localhost:3000 (Wrangler)
- **프로덕션**: https://3dcookiehd.pages.dev
- **Preview**: https://[commit-hash].3dcookiehd.pages.dev

---

**이제 로컬 환경이 프로덕션과 100% 동일하게 설정되었습니다!** 🎉
