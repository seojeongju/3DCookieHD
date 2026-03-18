-- 교강사직무능력평가: 해당 과정(회차)·교과목별 원장(관리자)/담당강사(본인) 평가
-- evaluator_type: 'admin' 원장(관리자), 'self' 담당강사(본인)
-- 15문항 5점 척도 (q1~q15) + 건의사항 + 총점
CREATE TABLE IF NOT EXISTS instructor_competency_evaluations (
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
    UNIQUE(session_id, subject_name, evaluator_type, evaluator_id)
);

CREATE INDEX IF NOT EXISTS idx_instructor_eval_session ON instructor_competency_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_instructor_eval_evaluator ON instructor_competency_evaluations(evaluator_id);
