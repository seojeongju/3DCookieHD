-- NCS 능력단위별 평가방법 및 교수학습방법 저장 컬럼 추가
ALTER TABLE ncs_units ADD COLUMN evaluation_methods_json TEXT;
ALTER TABLE ncs_units ADD COLUMN teaching_methods_json TEXT;
