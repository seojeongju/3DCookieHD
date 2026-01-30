-- 승인받은 NCS 등록 — 4단계 훈련시간 설정 (총 일수/시간, NCS 비율)
ALTER TABLE ncs_approved_registrations ADD COLUMN total_training_days INTEGER;
ALTER TABLE ncs_approved_registrations ADD COLUMN daily_training_hours REAL;
ALTER TABLE ncs_approved_registrations ADD COLUMN total_training_hours INTEGER;
ALTER TABLE ncs_approved_registrations ADD COLUMN ncs_lib_arts_pct REAL;
ALTER TABLE ncs_approved_registrations ADD COLUMN ncs_major_pct REAL;
ALTER TABLE ncs_approved_registrations ADD COLUMN non_ncs_pct REAL;
