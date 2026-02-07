-- 회차별 과정 개설에 강사(담당 강사) 필드 추가
ALTER TABLE course_sessions ADD COLUMN instructor_name TEXT;
