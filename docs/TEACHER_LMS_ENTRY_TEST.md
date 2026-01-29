# 강사 LMS 진입 경로 테스트 체크리스트

나의 강의 → ?tab= → 과정 선택 → 해당 LMS 탭 이동 플로우를 수동으로 검증할 때 사용합니다.

## 사전 조건

- [ ] 개발 서버 실행: `npm run dev` (http://localhost:5173)
- [ ] 강사 또는 관리자 계정으로 로그인

---

## 1. 리다이렉트 (구 강사 메뉴 → 나의 강의 + tab)

| 단계 | 동작 | 기대 결과 | ✓ |
|------|------|-----------|---|
| 1-1 | 주소창에 `http://localhost:5173/teacher/students` 입력 후 이동 | `/teacher/courses?tab=students` 로 리다이렉트 | |
| 1-2 | `/teacher/attendance` 이동 | `/teacher/courses?tab=attendance` 로 리다이렉트 | |
| 1-3 | `/teacher/exams` 이동 | `/teacher/courses?tab=exams` 로 리다이렉트 | |
| 1-4 | `/teacher/surveys` 이동 | `/teacher/courses?tab=surveys` 로 리다이렉트 | |

---

## 2. 나의 강의 페이지 (tab 반영)

| 단계 | 동작 | 기대 결과 | ✓ |
|------|------|-----------|---|
| 2-1 | `/teacher/courses?tab=students` 접속 | 상단에 파란색 안내 배너: 「수강생」 탭으로 바로 이동 안내 표시 | |
| 2-2 | 위와 동일 | 사이드바에서 **수강생 분석** 메뉴가 활성(파란 배경) | |
| 2-3 | `/teacher/courses?tab=attendance` 접속 | 안내 배너: 「출결관리」, 사이드바 **출석 관리** 활성 | |
| 2-4 | `/teacher/courses?tab=exams` 접속 | 안내 배너: 「CBT/시험」, 사이드바 **평가 및 채점** 활성 | |
| 2-5 | `/teacher/courses?tab=surveys` 접속 | 안내 배너: 「설문/평가」, 사이드바 **설문 및 역량진단** 활성 | |
| 2-6 | `/teacher/courses` (tab 없음) 접속 | 안내 배너 숨김, 과정 목록만 표시 | |

---

## 3. 과정 선택 → LMS 해당 탭 이동

**전제**: 나의 강의 목록에 최소 1개 과정이 있음.

| 단계 | 동작 | 기대 결과 | ✓ |
|------|------|-----------|---|
| 3-1 | `/teacher/courses?tab=students` 에서 특정 과정 카드의 **강의실 입장** 클릭 | `/admin/courses/{과정ID}/lms/students` 로 이동 (수강생 탭) | |
| 3-2 | `/teacher/courses?tab=attendance` 에서 **강의실 입장** 클릭 | `/admin/courses/{과정ID}/lms/attendance` 로 이동 (출결관리 탭) | |
| 3-3 | `/teacher/courses?tab=exams` 에서 **강의실 입장** 클릭 | `/admin/courses/{과정ID}/lms/cbt` 로 이동 (CBT/시험 탭) | |
| 3-4 | `/teacher/courses?tab=surveys` 에서 **강의실 입장** 클릭 | `/admin/courses/{과정ID}/lms/surveys` 로 이동 (설문/평가 탭) | |
| 3-5 | `/teacher/courses` (tab 없음) 에서 **강의실 입장** 클릭 | `/admin/courses/{과정ID}/lms` 로 이동 (LMS 대시보드) | |
| 3-6 | 위와 동일 | **관리**(톱니 아이콘) 버튼 클릭 시에도 3-1~3-5와 동일한 탭/대시보드로 이동 | |

---

## 4. 강사 대시보드에서 진입

| 단계 | 동작 | 기대 결과 | ✓ |
|------|------|-----------|---|
| 4-1 | `/teacher` 에서 **수강생 분석** 카드(또는 링크) 클릭 | `/teacher/courses?tab=students` 로 이동 | |
| 4-2 | **출석 관리**, **평가 및 채점**, **설문 및 역량진단** 클릭 | 각각 `?tab=attendance`, `?tab=exams`, `?tab=surveys` 로 이동 | |
| 4-3 | **나의 강의 관리** 클릭 | `/teacher/courses` 로 이동 (tab 없음) | |

---

## 5. LMS 페이지 내 탭 전환

| 단계 | 동작 | 기대 결과 | ✓ |
|------|------|-----------|---|
| 5-1 | `/admin/courses/{id}/lms/students` 에서 상단 탭 메뉴 **대시보드** 클릭 | `/admin/courses/{id}/lms` 로 이동 | |
| 5-2 | **출결관리**, **수강생** 등 다른 탭 클릭 | 해당 `/admin/courses/{id}/lms/{탭}` 로 이동 | |

---

## 문제 발생 시 확인 사항

- **로그인 안 됨**: `/teacher/*` 접속 시 `/login` 으로 리다이렉트되는지 확인.
- **과정 목록 빈 경우**: 강사 계정에 배정된 과정이 있는지, 또는 관리자로 과정을 먼저 등록했는지 확인.
- **403/404**: 해당 라우트가 `index.tsx` 에 등록되어 있는지 확인 (`/admin/courses/:id/lms/students` 등).

---

*마지막 업데이트: 2026-01-29*
