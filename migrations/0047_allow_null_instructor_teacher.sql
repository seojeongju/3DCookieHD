-- 훈련일지·과제에서 강사/담당자 배정 해제를 위해 NULL 허용

-- training_logs: instructor_id NULL 허용
CREATE TABLE IF NOT EXISTS training_logs_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  instructor_id INTEGER,
  date TEXT NOT NULL,
  topic TEXT,
  content TEXT,
  teaching_method TEXT,
  issues TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  ncs_unit_id INTEGER REFERENCES ncs_units(id),
  training_hours INTEGER DEFAULT 0,
  ncs_elements_json TEXT,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (instructor_id) REFERENCES users(id)
);
INSERT INTO training_logs_new SELECT id, course_id, instructor_id, date, topic, content, teaching_method, issues, approval_status, created_at, updated_at, ncs_unit_id, training_hours, ncs_elements_json FROM training_logs;
DROP TABLE training_logs;
ALTER TABLE training_logs_new RENAME TO training_logs;
CREATE INDEX IF NOT EXISTS idx_training_logs_course ON training_logs(course_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_instructor ON training_logs(instructor_id);

-- assignments: teacher_id NULL 허용
CREATE TABLE IF NOT EXISTS assignments_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  teacher_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  max_score INTEGER DEFAULT 100,
  attachment_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO assignments_new SELECT id, course_id, teacher_id, title, description, due_date, max_score, attachment_url, created_at, updated_at FROM assignments;
DROP TABLE assignments;
ALTER TABLE assignments_new RENAME TO assignments;
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
