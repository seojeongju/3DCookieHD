-- 교수계획서 폼 저장 (회차별·교과목별)
CREATE TABLE IF NOT EXISTS syllabus_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  curriculum_id INTEGER NOT NULL,
  training_level TEXT,
  training_hours TEXT,
  instructors TEXT,
  teaching_method TEXT,
  trainees TEXT,
  author TEXT,
  textbook TEXT,
  publisher TEXT,
  pub_year TEXT,
  learning_objectives TEXT,
  evaluation_criteria TEXT,
  instructions TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(session_id, curriculum_id),
  FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_id) REFERENCES ncs_approved_curriculum(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_syllabus_documents_session ON syllabus_documents(session_id);
