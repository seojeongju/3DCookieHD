-- 협력대학 (대학맞춤교육 페이지용)
CREATE TABLE IF NOT EXISTS partner_universities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_partner_universities_sort ON partner_universities(sort_order);

-- 기본 데이터
INSERT INTO partner_universities (name, sort_order) VALUES
  ('서울대학교', 1),
  ('국립금오공과대학교', 2),
  ('경운대학교', 3),
  ('마산대학교', 4),
  ('연성대학교', 5),
  ('호남대학교', 6),
  ('김천대학교', 7),
  ('원광대학교', 8);
