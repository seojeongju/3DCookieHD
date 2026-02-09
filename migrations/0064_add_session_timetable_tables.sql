-- 회차별 교시 설정 (1교시 시작/종료 등)
CREATE TABLE IF NOT EXISTS session_period_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  period_number INTEGER NOT NULL,          -- 교시 (1, 2, 3...)
  start_time TEXT NOT NULL,                -- 시작시간 (HH:MM)
  end_time TEXT NOT NULL,                  -- 종료시간 (HH:MM)
  break_minute INTEGER DEFAULT 10,         -- 휴게시간 (분)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_session_period_unique ON session_period_configs(session_id, period_number);

-- 회차별 상세 시간표 배정
CREATE TABLE IF NOT EXISTS session_timetables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  training_date TEXT NOT NULL,             -- 훈련일자 (YYYY-MM-DD)
  period_number INTEGER NOT NULL,          -- 교시 (1, 2, 3...)
  subject_id INTEGER,                      -- 교과목 ID (ncs_approved_curriculum.id)
  instructor_id INTEGER,                   -- 강사 ID (users.id)
  location TEXT,                           -- 강의실/장소
  is_excluded INTEGER DEFAULT 0,           -- 제외 여부 (공휴일 등)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES ncs_approved_curriculum(id) ON DELETE SET NULL,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_session_timetable_lookup ON session_timetables(session_id, training_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_timetable_unique ON session_timetables(session_id, training_date, period_number);
