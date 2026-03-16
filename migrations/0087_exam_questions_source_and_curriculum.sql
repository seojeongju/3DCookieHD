-- exam_questions에 문제 출처 및 과목 연결 컬럼 추가
-- - source_course_id : 원래 생성된 과정/회차의 LMS 과정 ID (courses.id)
-- - source_exam_id   : 원래 소속된 시험 ID (exams.id)
-- - curriculum_id    : NCS 승인 교과목 ID (ncs_approved_curriculum.id) 또는 과목 식별자

ALTER TABLE exam_questions ADD COLUMN source_course_id INTEGER;
ALTER TABLE exam_questions ADD COLUMN source_exam_id INTEGER;
ALTER TABLE exam_questions ADD COLUMN curriculum_id INTEGER;

