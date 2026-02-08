-- 회차별 훈련시간·점심시간 설정 (추가정보용)
ALTER TABLE course_sessions ADD COLUMN training_time_start TEXT;
ALTER TABLE course_sessions ADD COLUMN training_time_end TEXT;
ALTER TABLE course_sessions ADD COLUMN lunch_time_start TEXT;
ALTER TABLE course_sessions ADD COLUMN lunch_time_end TEXT;
