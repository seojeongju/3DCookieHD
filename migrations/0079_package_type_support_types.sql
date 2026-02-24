-- 지원유형 옵션 변경: 일반훈련생(재직자), 일반훈련생(일반실업자), 취업성공패키지2유형, 취업성공패키지1유형, 근로장려금수급자, 일반
-- 기존 type1/type2/general/k-digital 값을 새 코드로 매핑하여 적용
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS hrd_student_details_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    course_id INTEGER,
    status TEXT DEFAULT 'consulting' CHECK(status IN ('consulting', 'registered', 'learning', 'completed', 'employed', 'dropout')),
    type TEXT CHECK(type IN ('jobseeker', 'worker', 'general', 'student')),
    package_type TEXT CHECK(package_type IN ('', 'jobholder', 'unemployed', 'package2', 'package1', 'eitc', 'general')),
    payment_method TEXT CHECK(payment_method IN ('', 'card', 'transfer', 'cash')),
    payment_method_note TEXT,
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

INSERT INTO hrd_student_details_new (
    id, user_id, course_id, status, type, package_type, payment_method, payment_method_note,
    payment_date, self_pay_amount, has_application, has_card,
    is_hrd_net_registered, status_memo, education, certifications,
    last_consult, created_at, updated_at
)
SELECT
    id, user_id, course_id, status, type,
    CASE
        WHEN package_type = 'type1' THEN 'package1'
        WHEN package_type = 'type2' THEN 'package2'
        WHEN package_type IN ('general', 'k-digital') THEN 'general'
        WHEN package_type IN ('jobholder', 'unemployed', 'package2', 'package1', 'eitc', 'general') THEN package_type
        ELSE ''
    END,
    payment_method, payment_method_note,
    payment_date, self_pay_amount, has_application, has_card,
    is_hrd_net_registered, status_memo, education, certifications,
    last_consult, created_at, updated_at
FROM hrd_student_details;

DROP TABLE hrd_student_details;
ALTER TABLE hrd_student_details_new RENAME TO hrd_student_details;

CREATE INDEX IF NOT EXISTS idx_hrd_student_details_user ON hrd_student_details(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_course ON hrd_student_details(course_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_status ON hrd_student_details(status);

PRAGMA foreign_keys=ON;
