-- 포트폴리오 갤러리 테이블 추가
CREATE TABLE IF NOT EXISTS student_portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    content_url TEXT, -- 포트폴리오 링크 (Google Drive, 개인 사이트, YouTube 등)
    category TEXT, -- '3d_modeling', 'design', 'coding', 'other'
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_student ON student_portfolios(student_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_course ON student_portfolios(course_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON student_portfolios(is_featured);
