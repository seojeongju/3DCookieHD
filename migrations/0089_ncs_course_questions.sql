-- 과정별 NCS평가용 문제 풀 (문제은행에서 NCS평가로 추가한 문제)
CREATE TABLE IF NOT EXISTS ncs_course_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    question_bank_id INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_bank_id) REFERENCES question_bank(id) ON DELETE CASCADE,
    UNIQUE(course_id, question_bank_id)
);
CREATE INDEX IF NOT EXISTS idx_ncs_course_questions_course ON ncs_course_questions(course_id);
