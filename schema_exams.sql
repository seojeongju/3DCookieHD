DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Exams;

CREATE TABLE Exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 60, -- 분 단위
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, subjective
    options TEXT, -- JSON string for options ["보기1", "보기2", ...]
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 5,
    order_num INTEGER DEFAULT 0,
    FOREIGN KEY (exam_id) REFERENCES Exams(id) ON DELETE CASCADE
);

-- 인덱스 추가
CREATE INDEX idx_exams_course_id ON Exams(course_id);
CREATE INDEX idx_questions_exam_id ON Questions(exam_id);
