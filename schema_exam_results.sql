CREATE TABLE IF NOT EXISTS ExamResults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    answers TEXT, -- JSON string of student answers
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES Exams(id),
    FOREIGN KEY (student_id) REFERENCES Users(id)
);
