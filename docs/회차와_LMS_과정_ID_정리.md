# 회차 ID vs LMS 과정 ID — 왜 둘 다 쓰는가

## 요약: 혼동이 생기는 이유

- **URL 경로**는 `/admin/courses/:id/lms/...` 처럼 **"courses"** 를 쓰지만,
- **HRD(교육운영) 흐름**에서는 이 `:id` 가 **회차 ID(`course_sessions.id`)** 로 쓰입니다.
- 한편 **훈련일지·설문·수강생** 등 실제 데이터는 **LMS 과정 ID(`courses.id`)** 로 저장됩니다.

그래서 “회차의 아이디”를 말할 때 **회차 ID**, **LMS 과정 ID**, **코스 ID** 등 여러 용어가 섞여 혼동이 생깁니다.

---

## 1. 두 가지 “과정/회차” 개념

이 시스템에는 **도메인이 다른** 두 축이 있습니다.

| 구분 | 테이블 | 주 식별자 | 용도 |
|------|--------|-----------|------|
| **HRD(훈련/국비)** | `approved_courses` + **`course_sessions`** | **`course_sessions.id`** (회차 ID) | 승인과정의 N회차, 출석·상담·시간표·NCS 등 |
| **LMS(학습관리)** | **`courses`** | **`courses.id`** (LMS 과정 ID) | 훈련일지, 설문, 과제, 수강생(enrollments) 등 |

- **회차 ID** = “이번 기수/회차”를 가리키는 **HRD 쪽 주 키** → `course_sessions.id`
- **LMS 과정 ID(코스 ID)** = “LMS에서의 한 과정(한 기수)”를 가리키는 **LMS 쪽 주 키** → `courses.id`

즉, **회차**와 **LMS 과정**이 1:1로 대응하지만, **키가 서로 다릅니다.**

---

## 2. 왜 ID가 둘로 나뉘어 있나

1. **역사적/도메인 분리**  
   - HRD: “승인된 과정 + 회차” 단위 운영 (모집, 훈련일정, NCS, 출석 등).  
   - LMS: “과정 하나 = 한 기수” 단위로 수강·과제·설문 등 관리.  
   → 처음부터 **회차(course_sessions)** 와 **LMS 과정(courses)** 가 별도 테이블로 설계됨.

2. **데이터 소스가 다름**  
   - `course_sessions`: 승인과정·회차 개설·시간표 등 **훈련 운영** 중심.  
   - `courses`: 제목이 `"과정명 (N회차)"` 형태인 **LMS 과정** 하나씩.  
   → 훈련일지(`training_logs`), 설문(`surveys`), 수강(`enrollments`) 등은 전부 **`courses.id`** 를 참조.

3. **한 회차 = LMS 과정 하나**  
   - “2025년 1회차” 같은 **회차**를 LMS에서 쓰려면, 그에 대응하는 **LMS 과정 한 행**이 필요함.  
   - 그 대응 관계를 저장하는 것이 **`course_sessions.lms_course_id`** (→ `courses.id`).

---

## 3. 어떤 ID가 어디에 쓰이는지

| 사용처 | 쓰는 ID | 설명 |
|--------|---------|------|
| **URL** `/admin/courses/12/lms/...` | **12 = 회차 ID** (`course_sessions.id`) | HRD 사이드바 “운영 과정 바로가기”에서 선택한 값이 회차 ID |
| **훈련일지·설문·과제 API** | 내부에서 **`courses.id`** 사용 | `training_logs.course_id`, `surveys.course_id` 등은 모두 `courses.id` |
| **회차 → LMS 과정 찾기** | **`course_sessions.lms_course_id`** | 회차 12에 연결된 LMS 과정 = `course_sessions.lms_course_id` (없으면 제목 매칭으로 보완) |
| **출석·상담·시간표 API** | **회차 ID** (`course_sessions.id`) | 예: `?courseId=12` → 12는 회차 ID |

정리하면:

- **화면/URL/HRD 메뉴**에서는 주로 **회차 ID**.
- **DB에 저장되는 일지·설문·수강**은 **LMS 과정 ID**.
- **회차 ID → LMS 과정 ID** 변환은 **`lms_course_id`**(와 필요 시 제목 매칭)로 함.

---

## 4. 개발 시 주의할 점

- **`/admin/courses/:id/lms/...` 의 `:id`**  
  - HRD 진입 시: **회차 ID** (`course_sessions.id`).  
  - 이 값을 그대로 `courses.id`로 쓰면 안 되고, **`lms_course_id` 또는 제목 매칭으로 `courses.id`를 구한 뒤** 사용해야 함.

- **API 파라미터 이름**  
  - `courseId` 가 **회차 ID**인 API(훈련일지 목록, 출석 등)와 **LMS 과정 ID**를 기대하는 API를 구분해서 문서/주석에 적어 두는 것이 좋음.

- **훈련일지·설문 등**  
  - “회차 12의 훈련일지” = “회차 12에 연결된 **LMS 과정**의 훈련일지”이므로,  
    회차 12 → `lms_course_id` → `courses.id` → 그 ID로 `training_logs` 조회.

---

## 5. 훈련일지: 과정명 풀네임 + 회차별 별도 LMS(1:1)

훈련일지 조회/등록 시에는 다음 원칙을 적용합니다.

- **과정명 풀네임만 사용**: 회차 제목 `"과정명 (N회차)"` 또는 `"과정명 (N회차) - 세션명"` 과 **완전 일치**하는 `courses.title` 만 연결에 사용합니다. LIKE·부분 일치로 다른 회차 과정을 가져오지 않습니다.
- **회차별 별도 LMS 과정(1:1)**: 한 LMS 과정(`courses.id`)은 **한 회차에만** 연결됩니다. 이미 다른 회차에 연결된 과정은 사용하지 않고, 필요 시 해당 회차 전용 새 과정을 생성합니다.

이렇게 해서 회차 12에 회차 4의 일지가 섞여 보이는 문제를 방지합니다.

---

## 6. 정리

- **회차 ID** = `course_sessions.id` (HRD 회차의 주 키).  
- **LMS 과정 ID(코스 ID)** = `courses.id` (LMS 과정의 주 키).  
- **둘 다 쓰는 이유** = HRD “회차”와 LMS “과정”이 **같은 실체를 다른 테이블에서 다른 키로 다루기 때문**이고,  
  **`course_sessions.lms_course_id`** 가 그 둘을 이어 주는 연결 컬럼입니다.

이 문서는 `docs/회차와_LMS_과정_ID_정리.md` 에 있으며, 훈련일지/설문 등 회차–과정 연결 로직은 `src/api/hrd.ts` 의 `lms_course_id` 우선 사용 로직을 참고하면 됩니다.
