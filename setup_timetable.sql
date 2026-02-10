
CREATE TABLE IF NOT EXISTS session_period_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    period_number INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    break_minute INTEGER DEFAULT 10,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    training_date TEXT NOT NULL,
    period_number INTEGER NOT NULL,
    subject_id INTEGER,
    instructor_id INTEGER,
    location TEXT,
    is_excluded INTEGER DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE
);
