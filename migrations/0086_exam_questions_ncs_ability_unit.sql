-- CBT 문제에 NCS 능력단위 연결 (사전평가 등)
ALTER TABLE exam_questions ADD COLUMN ncs_ability_unit_code TEXT;
ALTER TABLE exam_questions ADD COLUMN ncs_ability_unit_name TEXT;
