-- 교육실적 (센터소개 > 교육실적 페이지용)
CREATE TABLE IF NOT EXISTS education_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  performed_at TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_education_performance_performed ON education_performance(performed_at);
CREATE INDEX IF NOT EXISTS idx_education_performance_created ON education_performance(created_at);
