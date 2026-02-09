-- 회차별 개설과정 수강생 등록 (회차 ↔ 훈련생 매핑)
CREATE TABLE IF NOT EXISTS course_session_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'enrolled',
  enrolled_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(session_id, user_id),
  FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cse_session ON course_session_enrollments(session_id);
CREATE INDEX IF NOT EXISTS idx_cse_user ON course_session_enrollments(user_id);
