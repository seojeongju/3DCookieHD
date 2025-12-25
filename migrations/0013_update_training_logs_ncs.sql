-- 훈련일지에 NCS 연동 필드 추가
ALTER TABLE training_logs ADD COLUMN ncs_unit_id INTEGER REFERENCES ncs_units(id);
ALTER TABLE training_logs ADD COLUMN training_hours INTEGER DEFAULT 0; -- 해당 일자에 진행한 NCS 교육 시간
ALTER TABLE training_logs ADD COLUMN ncs_elements_json TEXT; -- 추가: 해당 날짜에 다룬 수행준거 (JSON array)

-- 훈련생 포트폴리오(산출물) 테이블 추가 (Feature 3 대비)
CREATE TABLE IF NOT EXISTS ncs_evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT, -- document, image, portfolio 등
    comment TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES ncs_evaluation_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
