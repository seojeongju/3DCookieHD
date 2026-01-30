-- 세분류 코드 저장 (훈련직종 검색: 대→중→소→세분류)
ALTER TABLE ncs_approved_registrations ADD COLUMN sub_code TEXT;
