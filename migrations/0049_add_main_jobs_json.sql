-- 직종 멀티 선택: 여러 직종(세분류) 저장
ALTER TABLE ncs_approved_registrations ADD COLUMN main_jobs_json TEXT;
