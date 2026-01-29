-- 승인받은 과정 — HRD넷 등 승인받은 과정 기초 데이터
CREATE TABLE IF NOT EXISTS approved_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER,
  training_time_start TEXT,
  training_time_end TEXT,
  capacity INTEGER,
  url_ncs TEXT,
  url_plan TEXT,
  url_detail_plan TEXT,
  approval_org TEXT,
  status TEXT DEFAULT 'active',
  instructor_name TEXT,
  registered_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES course_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_approved_courses_category ON approved_courses(category_id);
CREATE INDEX IF NOT EXISTS idx_approved_courses_registered ON approved_courses(registered_at);
CREATE INDEX IF NOT EXISTS idx_approved_courses_status ON approved_courses(status);
