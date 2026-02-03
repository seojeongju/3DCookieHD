-- NCS 직종(세분류)별 동기화 상태 및 대/중/소 명칭 저장
CREATE TABLE IF NOT EXISTS ncs_job_hierarchy (
    job_code TEXT PRIMARY KEY, -- 8자리 세분류 코드
    job_name TEXT NOT NULL,
    large_name TEXT,
    mid_name TEXT,
    small_name TEXT,
    unit_count INTEGER DEFAULT 0,
    element_count INTEGER DEFAULT 0,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기존 ncs_units에 job_code 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_ncs_units_job_code ON ncs_units(code);
