-- 훈련이수체계도(2단계)에서 선택한 능력단위 저장 — 교과목편성(3단계)에서 사용
ALTER TABLE ncs_approved_registrations ADD COLUMN selected_training_elements_json TEXT;
