-- 강의 후 설문지 타입 추가, 회차(session) 연동용 session_id 추가
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS surveys_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  session_id INTEGER,
  type TEXT NOT NULL CHECK(type IN ('survey', 'diagnosis', 'post_lecture')),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed', 'draft')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

INSERT INTO surveys_new (id, course_id, type, title, description, start_date, end_date, status, created_at, updated_at)
SELECT id, course_id, type, title, description, start_date, end_date, status, created_at, updated_at FROM surveys;

DROP TABLE surveys;
ALTER TABLE surveys_new RENAME TO surveys;

CREATE INDEX IF NOT EXISTS idx_surveys_course_id ON surveys(course_id);
CREATE INDEX IF NOT EXISTS idx_surveys_session_id ON surveys(session_id);
CREATE INDEX IF NOT EXISTS idx_surveys_type ON surveys(type);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);

PRAGMA foreign_keys=ON;
