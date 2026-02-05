-- NCS 요소별 수행준거 및 K/S/A 저장
ALTER TABLE ncs_elements ADD COLUMN criteria_text TEXT;
ALTER TABLE ncs_elements ADD COLUMN knowledge_text TEXT;
ALTER TABLE ncs_elements ADD COLUMN skill_text TEXT;
ALTER TABLE ncs_elements ADD COLUMN attitude_text TEXT;
