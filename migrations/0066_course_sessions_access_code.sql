-- 회차별 접근 인증 코드 (PIN)
ALTER TABLE course_sessions ADD COLUMN access_code TEXT;
