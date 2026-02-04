-- NCS 능력단위요소(NCS006) 정보를 저장하기 위한 JSON 컬럼 추가
ALTER TABLE ncs_units ADD COLUMN elements_json TEXT;
