-- 일반 일정 및 학사 일정 테이블
CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT 0,
    category TEXT DEFAULT 'general', -- general(일반), academic(학사), holiday(휴일)
    description TEXT,
    location TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_range ON calendar_events(start_date, end_date);
