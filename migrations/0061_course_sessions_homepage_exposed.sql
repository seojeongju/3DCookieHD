-- 회차별 홈페이지 노출 여부 (목록에서 등록/삭제 제어)
ALTER TABLE course_sessions ADD COLUMN homepage_exposed INTEGER DEFAULT 0;
