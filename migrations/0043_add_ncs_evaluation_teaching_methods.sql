-- 승인받은 NCS 등록 — 5단계 평가방법 및 교수학습방법 설정
ALTER TABLE ncs_approved_curriculum ADD COLUMN main_instructor_ids_json TEXT;
ALTER TABLE ncs_approved_curriculum ADD COLUMN evaluator_id INTEGER;
ALTER TABLE ncs_approved_curriculum ADD COLUMN teaching_methods_json TEXT;
ALTER TABLE ncs_approved_curriculum ADD COLUMN evaluation_methods_json TEXT;
ALTER TABLE ncs_approved_curriculum ADD COLUMN textbook_ids_json TEXT;
ALTER TABLE ncs_approved_curriculum ADD COLUMN material_ids_json TEXT;
