-- HRD 회차 과제 지원: session_id 컬럼 추가
-- HRD 과제: session_id 설정, course_id는 기존 과정 하나를 placeholder로 사용. 목록은 session_id로 조회.
ALTER TABLE assignments ADD COLUMN session_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_assignments_session ON assignments(session_id);
