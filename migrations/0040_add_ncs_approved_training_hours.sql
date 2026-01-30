-- 승인받은 NCS 등록 — 4단계 훈련시간설정 (교과목별 이론/실습 시간)
CREATE TABLE IF NOT EXISTS ncs_approved_training_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  curriculum_id INTEGER NOT NULL,
  theory_hours INTEGER DEFAULT 0,
  practice_hours INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (curriculum_id) REFERENCES ncs_approved_curriculum(id) ON DELETE CASCADE,
  UNIQUE(curriculum_id)
);

CREATE INDEX IF NOT EXISTS idx_ncs_approved_training_hours_curriculum ON ncs_approved_training_hours(curriculum_id);
