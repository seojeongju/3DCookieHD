PRAGMA foreign_keys=OFF;

-- Create new table without foreign key constraint on course_id
CREATE TABLE IF NOT EXISTS hrd_student_details_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    course_id INTEGER,
    status TEXT DEFAULT 'consulting' CHECK(status IN ('consulting', 'registered', 'learning', 'completed', 'dropout')),
    type TEXT CHECK(type IN ('jobseeker', 'worker', 'general', 'student')),
    package_type TEXT CHECK(package_type IN ('', 'type1', 'type2')),
    payment_method TEXT CHECK(payment_method IN ('', 'card', 'transfer', 'cash')),
    payment_date TEXT,
    self_pay_amount INTEGER DEFAULT 0,
    has_application INTEGER DEFAULT 0,
    has_card INTEGER DEFAULT 0,
    is_hrd_net_registered INTEGER DEFAULT 0,
    status_memo TEXT,
    education TEXT,
    certifications TEXT,
    last_consult TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Copy data from old table to new table
INSERT INTO hrd_student_details_new (
    id, user_id, course_id, status, type, package_type, payment_method, 
    payment_date, self_pay_amount, has_application, has_card, 
    is_hrd_net_registered, status_memo, education, certifications, 
    last_consult, created_at, updated_at
)
SELECT 
    id, user_id, course_id, status, type, package_type, payment_method, 
    payment_date, self_pay_amount, has_application, has_card, 
    is_hrd_net_registered, status_memo, education, certifications, 
    last_consult, created_at, updated_at 
FROM hrd_student_details;

-- Drop old table
DROP TABLE hrd_student_details;

-- Rename new table to original name
ALTER TABLE hrd_student_details_new RENAME TO hrd_student_details;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_user ON hrd_student_details(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_course ON hrd_student_details(course_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_status ON hrd_student_details(status);

PRAGMA foreign_keys=ON;
