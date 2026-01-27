# 프로덕션 환경 테스트 설정 가이드

## 1. Cloudflare D1 마이그레이션 실행

### 방법 1: Cloudflare 대시보드 사용 (추천)

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com 로그인
   - Workers & Pages → D1 선택

2. **데이터베이스 선택**
   - `education-platform-db` 데이터베이스 클릭

3. **Console 탭에서 SQL 실행**
   
   **Step 1: LMS 테이블 생성**
   ```sql
   -- migrations/0004_add_lms_tables.sql 내용 복사하여 실행
   ```

   **Step 2: 상담 테이블 확장**
   ```sql
   -- migrations/0005_enhance_consultations.sql 내용 복사하여 실행
   ```

   **Step 3: 테스트 데이터 추가**
   ```sql
   -- migrations/0006_production_test_data.sql 내용 복사하여 실행
   ```

### 방법 2: Wrangler CLI 사용

```bash
# wrangler 설치 (아직 없다면)
npm install -g wrangler

# Cloudflare 로그인
wrangler login

# D1 데이터베이스 ID 확인
wrangler d1 list

# wrangler.toml에서 database_id 업데이트 후

# 마이그레이션 실행
wrangler d1 execute education-platform-db --file=./migrations/0004_add_lms_tables.sql
wrangler d1 execute education-platform-db --file=./migrations/0005_enhance_consultations.sql
wrangler d1 execute education-platform-db --file=./migrations/0006_production_test_data.sql
```

## 2. 테스트 계정 정보

### 관리자 계정
- **이메일**: `admin@3dcookiehd.com`
- **비밀번호**: 설정 필요 (아래 참조)

### 학생 계정
- **학생1**: `student1@test.com`
- **학생2**: `student2@test.com`
- **학생3**: `student3@test.com`
- **비밀번호**: 모두 동일하게 설정 필요

## 3. 비밀번호 해시 생성

JavaScript 콘솔에서 실행:
```javascript
// bcrypt 해시 생성 (비밀번호: test1234)
// 실제 해시값으로 0006_production_test_data.sql 업데이트 필요
```

또는 프로덕션 환경에서 회원가입 API를 통해 직접 생성

## 4. 테스트 시나리오

### 수강생 관리 테스트
1. `admin@3dcookiehd.com`으로 로그인
2. `/admin/students` 접속
3. 학생 목록 확인 (김학생, 이학생, 박학생)
4. 학생 상세보기 클릭
5. 수강 현황 및 상담 이력 확인
6. 새 상담 기록 추가 테스트

### 시험 관리 테스트
1. 관리자로 `/admin/exams` 접속
2. 기존 시험 목록 확인:
   - 3D 모델링 중간고사
   - 언리얼 엔진 최종 프로젝트
3. 새 시험 생성 테스트
4. 문제 추가/수정 테스트 (객관식, 단답형, 서술형)

### 학생 시험 응시 테스트
1. `student1@test.com`으로 로그인
2. 대시보드에서 배정된 시험 확인
3. 시험 응시
4. 결과 확인

## 5. 데이터 확인 쿼리

```sql
-- 사용자 목록
SELECT id, email, name, role, status FROM users;

-- 과정 목록
SELECT id, title, instructor, status FROM courses;

-- 시험 및 문제 수
SELECT e.title, COUNT(q.id) as question_count 
FROM exams e 
LEFT JOIN questions q ON e.id = q.exam_id 
GROUP BY e.id;

-- 상담 내역
SELECT name, consultation_type, status, created_at 
FROM consultations 
ORDER BY created_at DESC;
```

## 6. 프로덕션 URL

- **메인**: https://3dcookiehd.pages.dev
- **관리자 로그인**: https://3dcookiehd.pages.dev/login
- **학생 관리**: https://3dcookiehd.pages.dev/admin/students
- **시험 관리**: https://3dcookiehd.pages.dev/admin/exams

## 7. 트러블슈팅

### API 오류 발생 시
- Cloudflare Workers 로그 확인
- D1 데이터베이스 연결 상태 확인
- wrangler.toml의 database_id 올바른지 확인

### 데이터가 보이지 않을 때
- 마이그레이션이 모두 실행되었는지 확인
- D1 Console에서 직접 SELECT 쿼리로 데이터 확인

### 로그인 실패 시
- 비밀번호 해시가 올바르게 생성되었는지 확인
- 또는 회원가입 페이지에서 새 계정 생성
