
# 학사관리 시스템(LMS) 기능 구현 PRD (Product Requirements Document)

## 1. 개요 (Overview)
본 문서는 와우쓰리디홍대센터 교육 플랫폼의 **학사관리(LMS)** 기능을 HRD(인적자원개발) 시스템 표준 및 관행에 맞추어 고도화하기 위한 요구사항을 정의합니다. 
주요 목표는 **학생학사관리**와 **강사학사관리** 기능을 체계적으로 구현하여, 훈련 과정의 품질을 높이고 행정 업무의 효율성을 극대화하는 것입니다.

## 2. 목표 (Goals)
*   **HRD 규정 준수**: 고용노동부 HRD-Net 시스템과 유사한 수준의 출결, 성적, 훈련 관리 기능 구현.
*   **데이터 통합 관리**: 학생의 입학부터 수료까지의 전 과정을 데이터로 기록 및 관리.
*   **사용자 편의성**: 관리자, 강사, 학생 모두가 직관적으로 사용할 수 있는 UI/UX 제공.

## 3. 유저 페르소나 (User Personas)
*   **관리자 (Admin)**: 전체 학사 운영 총괄. 학생/강사 정보 관리, 출결 마감, 성적 처리, 수료증 발급 등 행정 업무 수행.
*   **강사 (Instructor)**: 배정된 강의의 출결 확인, 훈련 일지 작성, 학생 평가 및 성적 입력, 학생 상담 수행.
*   **학생 (Student)**: 본인의 출결 현황 조회, 성적 확인, 과제 제출, 상담 신청.

## 4. 상세 기능 요구사항 (Functional Requirements)

### 4.1. 학생학사관리 (Student Management)

#### A. 수강생 통합 관리
*   **기능**: 과정별 수강생 목록 조회, 검색(이름, 연락처), 필터링(수료, 중도탈락, 수강중).
*   **상세 정보**: 학생 기본 정보, 수강 이력, 출결률, 종합 성적 한눈에 보기.
*   **상태 관리**: 수강 상태 변경 (승인, 취소, 수료, 제적 등) 및 사유 기록.

#### B. 출결 관리 (Attendance)
*   **일자별 출결**: 캘린더 또는 리스트 형태로 일자별 입실/퇴실 시간 기록.
*   **출결 상태**: 출석, 지각, 조퇴, 외출, 결석 공결 등 HRD 기준 상태 구분.
*   **출석률 계산**: 총 훈련 일수 대비 출석 일수를 기반으로 출석률 자동 계산 (80% 이상 수료 기준).
*   **이의 신청**: 학생이 출결 정정 요청 시 관리자/강사가 승인/반려.

#### C. 성적/평가 관리 (Evaluation)
*   **평가 기준 설정**: 과정별 평가 항목(출석, 필기, 실기, 과제, 태도 등) 및 배점 비율 설정.
*   **점수 입력**: 강사가 학생별 점수 입력 및 피드백 작성.
*   **이력 관리**: 평가 결과 저장 및 성적표 출력 기능.

#### D. 상담 관리 (Counseling)
*   **상담 일지**: 학생과의 정기/수시 상담 내용 기록 (진로, 고충, 학습 태도 등).
*   **상담 이력**: 학생별 누적 상담 기록 조회.

### 4.3. CBT(온라인시험) 시스템 (CBT System)

#### A. 문제은행 관리 (Question Bank)
*   **문제 등록**: 과목별, 난이도별, 유형별(객관식/주관식) 문제 등록 및 대량 업로드(Excel).
*   **AI 문제 생성 (PDF)**: PDF 형식의 기출문제나 학습 자료를 업로드하면, AI가 텍스트와 이미지를 분석하여 자동으로 문제, 보기, 정답을 추출하고 문제은행에 등록.
*   **문제 관리**: 문제 수정, 삭제, 태그 관리, 해설 및 이미지 첨부.

#### B. 시험 관리 (Exam Management)
*   **시험 생성**: 정기 평가, 수시 평가, 자격증 대비 모의고사 등 시험 생성.
*   **출제 방식**: 문제은행에서 직접 선택하거나 조건(난이도, 단원)에 따른 랜덤 출제 지원.
*   **시험 설정**: 응시 대상, 기간, 제한 시간, 문항별 배점, 감점 기준 설정.

#### C. 시험 응시 (Exam Taking)
*   **응시 환경**: 실제 자격증 시험(CBT)과 유사한 UI 제공 (OMR 마킹, 남은 시간 표시).
*   **응시 모드**: 
    *   **실전 모드**: 제한 시간 내 풀이 및 제출.
    *   **연습 모드**: 문제 풀이 후 즉시 정답 및 해설 확인 가능.
*   **부정행위 방지**: (고도화) 브라우저 이탈 감지, 복사/붙여넣기 방지.

#### D. 채점 및 결과 분석 (Grading & Analysis)
*   **자동 채점**: 객관식/단답형 즉시 채점.
*   **결과 리포트**: 점수, 석차, 문항별 정답 여부, 오답 노트 제공.
*   **통계 분석**: 전체 응시자의 평균 점수, 문항별 정답률, 난이도 분석.

### 4.2. 강사학사관리 (Instructor Management)

#### A. 강사 정보 및 배정
*   **프로필 관리**: 강사 인적사항, 자격증, 경력, 강의 가능 분야 관리.
*   **강의 배정**: 특정 과정에 주강사/보조강사 배정 및 시간표 매칭.

#### B. 훈련 일지 (Training Logs)
*   **일지 작성**: 매 훈련일마다 훈련 내용, 훈련 방법, 특이사항(장비 고장, 학생 특이사항 등) 작성.
*   **결재 시스템**: 강사 작성 -> 관리자 승인 프로세스 (전자 결재 개념).
*   **NCS 연동**: (추후 고도화) NCS 능력단위별 훈련 진도 체크.

## 5. 데이터 모델링 제안 (Data Modeling)

기존 DB 스키마(`users`, `courses`, `enrollments`)에 다음 테이블을 추가/보완해야 합니다.

### 5.1. 신규 테이블
*   **`attendance_logs` (출결 기록)**
    *   `id`, `enrollment_id`, `date`, `check_in_time`, `check_out_time`, `status` (present, late, early_leave, absent), `note`
*   **`evaluations` (평가 항목)**
    *   `id`, `course_id`, `title` (중간고사, 기말고사 등), `type` (exam, assignment), `max_score`, `weight` (비중)
*   **`student_scores` (학생 성적)**
    *   `id`, `evaluation_id`, `enrollment_id`, `score`, `feedback`
*   **`counseling_logs` (상담 일지)**
    *   `id`, `enrollment_id`, `counselor_id` (강사/관리자), `date`, `category`, `content`, `action_taken`
*   **`training_logs` (훈련 일지)**
    *   `id`, `course_id`, `instructor_id`, `date`, `topic`, `content`, `teaching_method`, `issues`, `approval_status`
*   **`exams` (시험 정보)**
    *   `id`, `course_id`, `title`, `description`, `start_time`, `end_time`, `time_limit_minutes`, `is_active`, `type` (midterm, final, mock, practice)
*   **`question_bank` (문제 은행)**
    *   `id`, `category`, `difficulty`, `question_text`, `question_type`, `options`, `correct_answer`, `explanation`, `image_url`
*   **`exam_questions` (시험 문제)**
    *   `id`, `exam_id`, `question_bank_id` (optional, if linked), `question_text`, `question_type`, `options`, `correct_answer`, `points`, `order_index`
*   **`exam_submissions` (시험 제출)**
    *   `id`, `exam_id`, `student_id`, `started_at`, `submitted_at`, `total_score`, `status`
*   **`exam_answers` (제출 답안)**
    *   `id`, `submission_id`, `question_id`, `student_answer`, `is_correct`, `score_awarded`

## 6. UI/UX 요구사항
*   **대시보드**: 관리자 접속 시 오늘의 출결 현황, 미작성 훈련 일지, 상담 요망 학생 등을 위젯으로 표시.
*   **반응형 웹**: 강사가 강의실에서 태블릿/모바일로 출결 체크 및 일지 작성이 가능하도록 모바일 친화적 UI 구현.
*   **데이터 시각화**: 학생 출석률 추이 그래프, 성적 분포도 차트 제공.

## 7. 개발 로드맵 (Roadmap)
1.  **Phase 1 (기반 구축)**: DB 스키마 변경 및 API 설계 (현재 단계).
2.  **Phase 2 (학생 관리)**: 수강생 목록, 상세 조회, 출결 관리 기능 구현.
3.  **Phase 3 (강사 관리)**: 훈련 일지 작성 및 관리자 승인 기능 구현.
4.  **Phase 4 (고도화)**: 성적 처리, 통계 대시보드, 상담 관리 기능 추가.

---
**작성자**: Antigravity (AI Agent)
**작성일**: 2025-11-30
