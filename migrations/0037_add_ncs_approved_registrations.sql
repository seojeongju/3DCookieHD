-- 승인받은 NCS 등록 (1. 과정개요) 저장
CREATE TABLE IF NOT EXISTS ncs_approved_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ncs_tab TEXT NOT NULL DEFAULT 'ncs',
  course_type TEXT,
  main_job_code TEXT,
  main_job_name TEXT,
  overview_content TEXT,
  dev_category TEXT,
  large_code TEXT,
  mid_code TEXT,
  small_code TEXT,
  unit_code TEXT,
  unit_name TEXT,
  non_ncs_course_name TEXT,
  non_ncs_overview TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ncs_approved_reg_updated ON ncs_approved_registrations(updated_at);
