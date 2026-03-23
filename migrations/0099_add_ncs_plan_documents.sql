-- NCS 평가계획 문서 저장 테이블
CREATE TABLE IF NOT EXISTS ncs_plan_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    evaluation_round INTEGER NOT NULL DEFAULT 1, -- 1/2/3차
    doc_type TEXT NOT NULL,                      -- minutes/schedule/questions/tools/rubric/achievement/review
    title TEXT,
    payload_json TEXT,                           -- 문서별 입력 데이터(JSON)
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ncs_plan_docs_unique
ON ncs_plan_documents(course_id, evaluation_round, doc_type);

CREATE INDEX IF NOT EXISTS idx_ncs_plan_docs_course_round
ON ncs_plan_documents(course_id, evaluation_round);
