-- 회차별 과정개설 — 승인받은 과정 기준 회차(1기, 2기 등) 개설
CREATE TABLE IF NOT EXISTS course_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  approved_course_id INTEGER NOT NULL,
  session_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'recruiting',
  training_start_date TEXT,
  training_end_date TEXT,
  url_ncs TEXT,
  url_plan TEXT,
  url_detail_plan TEXT,
  registered_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (approved_course_id) REFERENCES approved_courses(id)
);

CREATE INDEX IF NOT EXISTS idx_course_sessions_approved ON course_sessions(approved_course_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_status ON course_sessions(status);
CREATE INDEX IF NOT EXISTS idx_course_sessions_training_start ON course_sessions(training_start_date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_course_sessions_approved_session ON course_sessions(approved_course_id, session_number);
