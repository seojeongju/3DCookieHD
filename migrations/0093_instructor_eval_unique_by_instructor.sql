-- 원장 평가도 동일 과목·여러 강사 시 강사별로 구분: 유니크에 instructor_id 포함
CREATE TABLE IF NOT EXISTS instructor_competency_evaluations_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    instructor_id INTEGER,
    evaluator_type TEXT NOT NULL CHECK (evaluator_type IN ('admin', 'self')),
    evaluator_id INTEGER NOT NULL,
    q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
    q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
    q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
    suggestions TEXT,
    total_score INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(session_id, subject_name, evaluator_type, evaluator_id, instructor_id)
);

INSERT INTO instructor_competency_evaluations_new
SELECT id, session_id, subject_name, instructor_id, evaluator_type, evaluator_id,
    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15,
    suggestions, total_score, created_at, updated_at
FROM instructor_competency_evaluations;

DROP TABLE instructor_competency_evaluations;

ALTER TABLE instructor_competency_evaluations_new RENAME TO instructor_competency_evaluations;

CREATE INDEX IF NOT EXISTS idx_instructor_eval_session ON instructor_competency_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_instructor_eval_evaluator ON instructor_competency_evaluations(evaluator_id);
