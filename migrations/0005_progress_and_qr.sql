-- 진도율 추적을 위한 테이블
CREATE TABLE IF NOT EXISTS course_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    total_hours INTEGER DEFAULT 0,
    completed_hours INTEGER DEFAULT 0,
    attendance_rate REAL DEFAULT 0,
    assignment_completion_rate REAL DEFAULT 0,
    exam_completion_rate REAL DEFAULT 0,
    overall_progress REAL DEFAULT 0,
    completion_status TEXT DEFAULT 'in_progress' CHECK(completion_status IN ('in_progress', 'completed', 'dropped')),
    completion_date TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- QR코드 출석 체크를 위한 테이블
CREATE TABLE IF NOT EXISTS attendance_qr_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    session_date TEXT NOT NULL,
    session_type TEXT DEFAULT 'morning' CHECK(session_type IN ('morning', 'afternoon')),
    qr_code TEXT NOT NULL UNIQUE,
    valid_from TEXT NOT NULL,
    valid_until TEXT NOT NULL,
    location_required INTEGER DEFAULT 0,
    latitude REAL,
    longitude REAL,
    radius_meters INTEGER DEFAULT 100,
    created_by INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- QR코드 출석 기록
CREATE TABLE IF NOT EXISTS attendance_qr_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    check_in_time TEXT DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    device_info TEXT,
    status TEXT DEFAULT 'present' CHECK(status IN ('present', 'late', 'invalid')),
    FOREIGN KEY (session_id) REFERENCES attendance_qr_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(session_id, student_id)
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_progress_student ON course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_qr_sessions_course ON attendance_qr_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_qr_sessions_date ON attendance_qr_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_qr_checkins_session ON attendance_qr_checkins(session_id);
CREATE INDEX IF NOT EXISTS idx_qr_checkins_student ON attendance_qr_checkins(student_id);
