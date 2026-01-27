-- NCS 수행준거(Elements) 테이블
CREATE TABLE ncs_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ncs_unit_id INTEGER NOT NULL,
    code TEXT NOT NULL,         -- 수행준거 번호 (예: 01, 02)
    name TEXT NOT NULL,         -- 수행준거 명칭
    criteria TEXT,              -- 세부 수행 기준 (Performance Criteria)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ncs_unit_id) REFERENCES ncs_units(id) ON DELETE CASCADE
);

-- 평가 항목 세분화 (평가 계획 내 세부 항목)
CREATE TABLE ncs_evaluation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    ncs_element_id INTEGER NOT NULL,
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES ncs_evaluation_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (ncs_element_id) REFERENCES ncs_elements(id) ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX idx_ncs_elements_unit ON ncs_elements(ncs_unit_id);
CREATE INDEX idx_ncs_eval_items_plan ON ncs_evaluation_items(plan_id);

-- 샘플 데이터 (3D형상모델링 - 1503050101_19v3 의 수행준거 일부)
-- 실제 운영 시에는 ncs_units의 ID를 확인하여 매핑해야 하므로, 여기서는 구조만 생성하고
-- API에서 등록할 수 있도록 기능을 제공합니다.
