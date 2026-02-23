PRAGMA foreign_keys=OFF;

-- Create new table with relaxed CHECK constraint on status
CREATE TABLE IF NOT EXISTS attendance_logs_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  check_in_time TEXT,
  check_out_time TEXT,
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'early_leave', 'absent', 'public_leave', 'absent_under_50', 'late_and_early')),
  note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Copy data
INSERT INTO attendance_logs_new (id, enrollment_id, date, check_in_time, check_out_time, status, note, created_at, updated_at)
SELECT id, enrollment_id, date, check_in_time, check_out_time, status, note, created_at, updated_at FROM attendance_logs;

-- Drop old table
DROP TABLE attendance_logs;

-- Rename new table
ALTER TABLE attendance_logs_new RENAME TO attendance_logs;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_attendance_logs_enrollment ON attendance_logs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON attendance_logs(date);

PRAGMA foreign_keys=ON;
