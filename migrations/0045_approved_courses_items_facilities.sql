-- 승인받은 과정 — 교재/소모품/장비/시설 선택 ID 목록
ALTER TABLE approved_courses ADD COLUMN textbook_ids_json TEXT;
ALTER TABLE approved_courses ADD COLUMN consumable_ids_json TEXT;
ALTER TABLE approved_courses ADD COLUMN equipment_ids_json TEXT;
ALTER TABLE approved_courses ADD COLUMN facility_ids_json TEXT;
