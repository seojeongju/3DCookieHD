-- 회차별 과정개설: 공강일(훈련 제외일) 컬럼 추가
ALTER TABLE course_sessions ADD COLUMN excluded_dates TEXT;
