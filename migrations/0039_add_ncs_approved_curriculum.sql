-- 승인받은 NCS 등록 — 3단계 교과목 편성
CREATE TABLE IF NOT EXISTS ncs_approved_curriculum (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  classification TEXT,
  ability_units_json TEXT,
  units_json TEXT,
  objectives_json TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (registration_id) REFERENCES ncs_approved_registrations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ncs_approved_curriculum_reg ON ncs_approved_curriculum(registration_id);
