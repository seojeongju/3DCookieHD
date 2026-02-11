-- 회차(course_sessions)별 LMS 과정(courses) 연결 — 훈련일지 등에서 회차 ID로 접근 시 사용
ALTER TABLE course_sessions ADD COLUMN lms_course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL;
