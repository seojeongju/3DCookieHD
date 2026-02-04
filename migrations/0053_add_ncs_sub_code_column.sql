-- NCS 단위 요소와 직종 간의 관계를 명확히 하기 위한 컬럼 추가
-- 기존 ncs_units 테이블에 job_code(세분류코드) 컬럼 추가가 권장됨 (조회 효율성)
-- 하지만 SQLite에서 ALTER TABLE add column은 제약조건 등에서 제한적일 수 있음.
-- 일단 기존 구조를 활용하되, ncs_job_hierarchy 와 ncs_units 를 CSV로부터 채우는 방식을 사용.

-- 변경 없음 (기존 테이블 사용)
-- ncs_job_hierarchy: 직종 정보 저장
-- ncs_units: 능력단위 정보 저장

-- 다만, ncs_units에 직종 코드(sub_class_code)가 명시적으로 있으면 좋음.
-- Migration 0053: ncs_units에 sub_class_code 추가
ALTER TABLE ncs_units ADD COLUMN sub_class_code TEXT;
CREATE INDEX IF NOT EXISTS idx_ncs_units_sub_class_code ON ncs_units(sub_class_code);
