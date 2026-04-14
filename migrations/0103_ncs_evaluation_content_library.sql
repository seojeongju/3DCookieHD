-- 과정 간 공유: 동일 능력단위명·수준·능력단위요소명·평가회차 기준 평가내용(criteria 라인)
CREATE TABLE IF NOT EXISTS ncs_evaluation_content_library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_level_key TEXT NOT NULL,
    element_key TEXT NOT NULL,
    evaluation_round INTEGER NOT NULL DEFAULT 1,
    lines_json TEXT NOT NULL DEFAULT '[]',
    element_title_snapshot TEXT,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_level_key, element_key, evaluation_round)
);

CREATE INDEX IF NOT EXISTS idx_ncs_eval_content_lib_lookup
ON ncs_evaluation_content_library(unit_level_key, evaluation_round);
