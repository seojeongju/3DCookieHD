-- 메인페이지 공지 팝업
CREATE TABLE IF NOT EXISTS home_popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  link_label TEXT DEFAULT '바로가기',
  is_active INTEGER NOT NULL DEFAULT 0,
  start_at TEXT,
  end_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours'))
);

CREATE INDEX IF NOT EXISTS idx_home_popups_active_dates
  ON home_popups (is_active, start_at, end_at, sort_order);
