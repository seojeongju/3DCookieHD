
-- Website Visits Table
CREATE TABLE IF NOT EXISTS website_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_id INTEGER,
  page_visited TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  method TEXT,
  status_code INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_website_visits_timestamp ON website_visits(timestamp);
CREATE INDEX IF NOT EXISTS idx_website_visits_page ON website_visits(page_visited);
