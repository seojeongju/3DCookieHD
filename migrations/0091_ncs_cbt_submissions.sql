-- NCS 평가(CBT 문제 풀기) 제출 여부 저장 - 학생별 회차별 1회 기록
CREATE TABLE IF NOT EXISTS ncs_cbt_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now')),
    UNIQUE(session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ncs_cbt_submissions_user ON ncs_cbt_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_ncs_cbt_submissions_session ON ncs_cbt_submissions(session_id);
