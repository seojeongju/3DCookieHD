-- 승인받은 NCS 등록 — 6단계 시설 및 장비 설정 필드 추가
ALTER TABLE ncs_approved_curriculum ADD COLUMN facility_ids_json TEXT;
ALTER TABLE ncs_approved_curriculum ADD COLUMN equipment_ids_json TEXT;
