-- 회차별 과정개설 추가 정보: 대상자, 요일, 장소
ALTER TABLE course_sessions ADD COLUMN target_audience TEXT;
ALTER TABLE course_sessions ADD COLUMN days_of_week TEXT;
ALTER TABLE course_sessions ADD COLUMN location TEXT;
