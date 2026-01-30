-- 과정개요 고도화: 과정명, 훈련수준, 선수능력
ALTER TABLE ncs_approved_registrations ADD COLUMN course_name TEXT;
ALTER TABLE ncs_approved_registrations ADD COLUMN training_level TEXT;
ALTER TABLE ncs_approved_registrations ADD COLUMN prereq_skill TEXT;
