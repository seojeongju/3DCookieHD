-- question_bank에 NCS·교과목·배점 컬럼 추가 (exam_questions와 동일하게 복사 시 사용)
ALTER TABLE question_bank ADD COLUMN points INTEGER DEFAULT 1;
ALTER TABLE question_bank ADD COLUMN ncs_ability_unit_code TEXT;
ALTER TABLE question_bank ADD COLUMN ncs_ability_unit_name TEXT;
ALTER TABLE question_bank ADD COLUMN curriculum_id INTEGER;
