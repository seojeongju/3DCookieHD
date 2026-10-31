-- 능력단위 요소는 ncs_unit_id(FK)로만 연결한다.
-- (ncs_unit_id, code) 조합 UNIQUE로 sync/import upsert가 스키마와 일치하도록 한다.
CREATE UNIQUE INDEX IF NOT EXISTS idx_ncs_elements_unit_id_code
  ON ncs_elements(ncs_unit_id, code);
