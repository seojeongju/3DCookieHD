-- 강사 강의이력 필드 추가
ALTER TABLE hrd_instructors ADD COLUMN teaching_history TEXT; -- 강의이력 (JSON: [{course_name, start_date, end_date, student_count, description, notes}])
