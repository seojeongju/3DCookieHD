-- 수료생 취업 관리 테이블 추가
CREATE TABLE IF NOT EXISTS employment_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    status TEXT DEFAULT 'seeking', -- 'employed', 'seeking', 'further_education', 'military', 'other'
    company_name TEXT,
    job_title TEXT,
    employment_date TEXT,
    insurance_covered BOOLEAN DEFAULT 0,
    salary_range TEXT,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX IF NOT EXISTS idx_employment_student ON employment_status(student_id);
CREATE INDEX IF NOT EXISTS idx_employment_course ON employment_status(course_id);
