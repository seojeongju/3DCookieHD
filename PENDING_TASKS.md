# 📋 PENDING TASKS — 3DCookieHD 교육 플랫폼

> 마지막 업데이트: 2026-03-02 09:52 KST

---

## ✅ 오늘 완료된 작업 (2026-03-02)

### ❗ 유향윤 출석률 100% 버그 수정 (완료)
- **파일**: `src/api/courses.ts`, `src/api/hrd.ts`
- **커밋**: `fix: 단기 과정 출석률 100% 버그 수정 - daysProgressed > total_days 시 clamp 제거`

#### 🔍 원인 분석 과정
1. D1 DB에서 `course_sessions id=4` → `approved_course_id = 1` 확인
2. `approved_courses id=1` → `daily_hours=6, total_days=7, total_hours=42` 확인
3. `attendance_logs enrollment_id=11` (유향윤) → 총 **13일치 기록**, 결석 2일 (2026-01-12, 2026-01-14) 확인

#### 🐛 버그 메커니즘
```
기존 코드 (잘못됨):
  daysProgressed = 13 (실제 기록된 날 수)
  expectedCurrentMinutes = 13 × 6h × 60 = 4680분
  → if (expectedCurrentMinutes > expectedTotalMinutes) → 클램핑!
  expectedCurrentMinutes = min(4680, 2520) = 2520분  ← 여기서 잘못됨
  
  accumulatedMinutes = 11 × 6h × 60 = 3960분  (결석 2일 제외)
  → safeAccumulated = min(3960, 2520) = 2520분  ← 여기서도 잘못됨

  currentRate = 2520 / 2520 = 100%  ❌
```

#### ✅ 수정 내용
```
수정된 코드:
  expectedCurrentMinutes = 13 × 6h × 60 = 4680분  (클램핑 없음)
  rawAccumulated = 11 × 6h × 60 = 3960분  (결석 2일 제외, 클램핑 없음)

  currentRate = min(100, 3960 / 4680 × 100) = 84.6%  ✅ (결석 2일 반영)
  finalRate   = min(100, 3960 / 2520 × 100) = 100%   (전체 과정 완주 기준)
```

#### 💡 핵심 원칙 정립
- `expectedCurrentMinutes` (분모)는 절대 `expectedTotalMinutes`로 클램핑하면 안 됨
- 과정 기간(total_days)보다 실제 일정이 더 길어도(연장 등) 결석은 올바르게 반영되어야 함
- `finalRate`는 total_hours 기준으로 별도 계산 (수료 시점 예상 출석률)

---

## ✅ 이전 세션 완료 작업 (2026-02-28)

### 1. 출석률 100% 오표시 버그 수정 (완료)
- **파일**: `src/api/courses.ts`, `src/api/hrd.ts`
- **문제**: 결석(absent) 날에도 check_in/check_out 시간이 있으면 accumulatedMinutes에 포함됨
- **수정**: 결석 날은 항상 0분 처리, 출석 날은 daily_hours × 60분 고정

### 2. 상단 통계 카드 전체 기간 누적 표시 (완료)
- **파일**: `src/api/courses.ts`, `src/views/admin_lms_attendance.ts`
- **내용**: HRD 과정에서 상단 카드(출석/지각/조퇴/결석/공가 등)가 **전체 과정 기간 누적** 횟수를 표시

### 3. 시간표 출력 페이지 에러 수정 (완료)
- **파일**: `src/views/admin_session_timetable_print.ts`
- **수정**: `const [sRes, tRes, rRes, cRes, iRes]` 로 수정

### 4. 관리자 마감 과정 출석 수정 허용 (완료)
- **파일**: `src/views/admin_lms_attendance.ts`
- **내용**: JWT 토큰에서 role을 파싱하여 admin이면 마감된 과정도 편집 가능

### 5. isLongTerm 판별 기준 수정 (완료)
- **파일**: `src/api/courses.ts`, `src/api/hrd.ts`
- **수정**: `daily_hours`가 있으면 항상 단기(시간 기반) 처리

---

## 📝 다음 세션 작업 목록

### 순서 1
- [ ] 사용자 매뉴얼 작성 (별도 요청됨)
  - 대상: 관리자 / 강사 / 학생
  - 형식: 마크다운 섹션별 분리
  - 내용: HRD 출석관리, 과정관리, 시간표, CBT 등 전 기능

---

## 🗂 주요 파일 참조

| 파일 | 역할 |
|------|------|
| `src/api/courses.ts` | 출석 데이터 API (단기/장기 출석률 계산 핵심) |
| `src/api/hrd.ts` | HRD 학생 단건 조회 출석률 계산 |
| `src/views/admin_lms_attendance.ts` | 출석관리 프론트엔드 (통계 카드, 테이블 렌더링) |
| `src/views/admin_session_timetable_print.ts` | 시간표 출력 |
| `src/views/admin_hrd_attendance_trainee_print.ts` | 훈련생 출결사항 출력 |

## 🔑 핵심 로직 요약 (다음 세션 참고용)

```
출석률 계산 (단기 시간 기반):
  isLongTerm = !daily_hours && (total_days >= 10 && total_hours >= 40)
  
  accumulatedMinutes 계산:
    결석(absent, absent_under_50) → 0분
    그 외 모든 날 → daily_hours × 60분 (고정)
  
  ⚠️ expectedCurrentMinutes = daysProgressed × daily_hours × 60
     → total_hours 기준으로 클램핑 금지! (결석 반영이 왜곡됨)
  
  currentRate = min(100, accumulatedMinutes / expectedCurrentMinutes × 100)
  finalRate   = min(100, accumulatedMinutes / (total_hours × 60) × 100)

출석률 계산 (장기 일수 기반):
  penaltyDays = floor((지각 + 조퇴 + 외출) / 3)
  totalAbsentConverted = 결석횟수 + penaltyDays
  currentRate = (daysProgressed - totalAbsentConverted) / daysProgressed
  finalRate   = (total_days - totalAbsentConverted) / total_days
```
