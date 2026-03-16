# 시험/문제관리 – 과정 무관 문제은행 및 LMS 연동 구현 제안

## 1. 목표

- **과정 무관 문제은행**: 한 곳에 문제를 등록해 두고, 원하는 과정/시험에 골라서 추가할 수 있게 한다.
- **LMS 자동 반영**: 각 과정의 사전평가/LMS에서 생성한 문제가 문제은행 목록에 자동으로 들어가, 다른 과정에서도 재사용할 수 있게 한다.

---

## 2. 현재 구조

| 구분 | 내용 |
|------|------|
| **question_bank** (마이그레이션 0004) | 과정·시험과 무관한 **전역 문제 풀**용 테이블. `category`, `difficulty`, `question_text`, `question_type`, `options`, `correct_answer`, `explanation` 등 보유. **현재 미사용.** |
| **exam_questions** | 시험별로 소속된 문제. `exam_id` 필수, 선택적으로 `question_bank_id`로 문제은행 출처 표시. 과정 LMS·통합 시험 모두 여기에만 저장 중. |
| **GET /api/cbt/question-bank** | `course_id` 기준으로 **exam_questions**만 조회 → “해당 과정 시험에 있는 문제”만 보임. |
| **POST /api/cbt/questions** (LMS) | **exam_questions**에만 INSERT. 문제은행 테이블에는 넣지 않음. |
| **통합 시험 “문제 등록”** | 현재는 `course_id` 넣어서 **exam_questions**에만 저장 → 과정에 묶임. |

정리하면, **전역 풀용 테이블(question_bank)은 있으나 쓰지 않고**, 모든 문제가 **exam_questions(과정/시험 단위)** 에만 있어 “과정 무관 문제은행”이 되지 않는 상태입니다.

---

## 3. 제안 방향: question_bank를 단일 전역 풀로 사용

- **문제은행 = question_bank 테이블**  
  과정/시험과 무관하게 “한 번 등록하면 재사용 가능한 문제”만 관리.
- **시험에 문제 추가 = exam_questions에 복사본 생성**  
  시험별로 `exam_id`, `order_index`와 함께 저장하고, 출처 추적을 위해 `question_bank_id`를 넣는다.
- **LMS에서 문제 생성 시**  
  - 1) **question_bank**에 한 번 넣고  
  - 2) 해당 과정 시험에 **exam_questions**로도 넣되 `question_bank_id`로 연결  
  → 과정 LMS에서 만든 문제도 전역 문제은행에 자동으로 쌓이게 한다.

이렇게 하면:

- 통합 시험 화면에서는 **과정 선택 없이** “전체 문제은행”만 보고, 골라서 **선택한 과정의 시험**에만 추가할 수 있고,
- 과정별 LMS에서 만든 문제는 자동으로 그 전역 문제은행에 들어가서, 다른 과정에서도 “문제은행에서 선택해 시험에 추가”로 쓸 수 있습니다.

---

## 4. 데이터 흐름 요약

```
[통합 시험 - 문제 등록]     →  question_bank 에만 INSERT (과정 무관)
[통합 시험 - 문제은행 목록]  →  question_bank 전체 조회 (과정 필터 없음)
[통합 시험 - 선택 문제 시험에 추가] →  question_bank ID 기준으로
                                       해당 시험의 exam_questions 에 복사 INSERT (question_bank_id 설정)

[과정 LMS - 문제 등록]      →  1) question_bank INSERT
                              2) 해당 과정 시험의 exam_questions INSERT (question_bank_id 연결)
                              → 두 곳에 저장되므로 “자동으로 문제은행에도 저장” 효과
```

---

## 5. 구현 단계 제안

### 5-1. DB (마이그레이션)

- **question_bank**  
  - 이미 있는 컬럼만으로도 기본 동작 가능.  
  - NCS/교과목 연동이 필요하면 예: `ncs_ability_unit_code`, `ncs_ability_unit_name`, `curriculum_id` 등을 추가하는 마이그레이션을 한 번 더 두면 됨.
- **exam_questions**  
  - 이미 `question_bank_id` 있음.  
  - “시험에 추가” 시 question_bank 한 건 → exam_questions 한 건 복사 시 그대로 사용.

### 5-2. API

| API | 변경 내용 |
|-----|-----------|
| **GET /api/cbt/question-bank** | **쿼리 파라미터에 따라 분기**<br>• `course_id` 없음 또는 `global=1` → **question_bank** 테이블만 조회 (유형/키워드/난이도 등 필터 유지). 과정 무관 목록.<br>• `course_id` 있음 (기존 호환) → 기존처럼 **exam_questions**만 해당 과정 기준으로 조회 (선택 사항, 필요 시 유지). |
| **POST /api/cbt/bank-questions** (신규) | 통합 시험용 “문제은행에만 등록”. Body: `question_text`, `question_type`, `options`, `correct_answer`, `points`, `difficulty`, `category`(또는 curriculum_id) 등. **question_bank**에만 INSERT. |
| **POST /api/cbt/questions** (LMS용) | **1)** 위와 동일한 형식으로 **question_bank**에 INSERT → `bank_id` 획득.<br>**2)** 기존 로직으로 **exam_questions** INSERT 시 `question_bank_id = bank_id` 설정, 나머지 내용 동일. |
| **POST /api/cbt/exams/:id/import-questions** | Body에 **question_bank_ids** 추가.<br>• `question_bank_ids` 있으면: question_bank에서 해당 ID들 조회 후, 각각 exam_questions에 복사 INSERT (`question_bank_id` 설정).<br>• 기존 `question_ids`(exam_questions ID)는 그대로 두고, “기존 시험 문제 복사”용으로 유지 가능. |

### 5-3. 프론트 (통합 시험 페이지 `/admin/exams`)

- **문제은행 목록**  
  - 회차/과정 선택과 무관하게 “전체 문제은행” 호출:  
    `GET /api/cbt/question-bank` (course_id 없이 또는 `global=1`).  
  - 기존 필터(유형, 키워드, 과목 등)는 그대로 두고, 서버에서 question_bank 기준으로 필터링.
- **“문제 등록” 버튼**  
  - 현재처럼 모달에서 입력 후 **POST /api/cbt/bank-questions** 호출 (과정 선택 없음).
- **“선택 문제 시험에 추가”**  
  - 선택한 항목이 **question_bank id**라고 가정하고,  
    `POST /api/cbt/exams/:id/import-questions`에 **question_bank_ids** 배열로 전달.  
  - 회차/시험 선택은 “어느 시험에 넣을지”만 결정하고, 문제 목록은 항상 전역 문제은행 기준.

### 5-4. 과정 LMS (사전평가/문제 등록)

- **POST /api/cbt/questions** 호출부는 그대로 두고,  
  서버만 수정:  
  - 먼저 question_bank INSERT  
  - 그다음 exam_questions INSERT (해당 과정 시험, `question_bank_id` 설정).  
- 과정별 문제 목록(해당 과정 시험에 소속된 문제)은 기존대로 **exam_questions** 기준으로 조회하면 되고, “전역 문제은행”에는 위 API 변경만으로 자동 반영됨.

---

## 6. 정리

- **과정 무관 문제 등록·재사용**: **question_bank**를 전역 풀로 쓰고, 통합 시험에서는 여기만 조회/등록하며, “시험에 추가”는 exam_questions로 복사 + `question_bank_id`로 출처만 남긴다.
- **LMS 문제가 문제은행에 자동 저장**: LMS용 **POST /api/cbt/questions**에서 question_bank 1건 + exam_questions 1건 둘 다 넣고, exam_questions에 `question_bank_id`를 달아 주면 된다.

이렇게 하면 “시험/문제관리의 문제은행은 과정과 관계없이 등록해 두고, 선택한 과정에만 추가하는 방식”과 “각 과정 LMS에서 만든 문제도 문제은행에 자동으로 쌓이게 하는 방식” 둘 다 만족할 수 있습니다.  
원하시면 다음 단계로 마이그레이션 스키마(필요 시 question_bank 컬럼 추가)와 API 핸들러 수정 예시 코드까지 이어서 제안하겠습니다.
