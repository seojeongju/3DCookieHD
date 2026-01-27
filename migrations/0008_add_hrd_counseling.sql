-- ============================================
-- HRD 훈련생 상담 관리 테이블 추가
-- ============================================

CREATE TABLE IF NOT EXISTS hrd_counseling_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL, -- user_id (student)
    counselor_id INTEGER NOT NULL, -- user_id (admin/teacher)
    course_id INTEGER, -- Related course (optional)
    counseling_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT, -- academic (학사), attendance (출결), career (취업), complaint (고충), other (기타)
    method TEXT, -- face_to_face (대면), phone (유선), online (온라인), other (기타)
    content TEXT,
    result TEXT, -- measures taken
    next_counseling_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_hrd_counseling_student ON hrd_counseling_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_date ON hrd_counseling_logs(counseling_date);
