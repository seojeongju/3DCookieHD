-- HRD 훈련생 통합 마이그레이션
-- users 테이블을 기본으로 사용하고, HRD 관련 정보만 별도 테이블로 관리

-- HRD 훈련생 상세 정보 테이블 (users 테이블과 1:1 관계)
CREATE TABLE IF NOT EXISTS hrd_student_details (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- HRD 훈련생 상담 이력 테이블
CREATE TABLE IF NOT EXISTS hrd_consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    manager TEXT NOT NULL,
    message TEXT NOT NULL,
    consult_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_user ON hrd_student_details(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_course ON hrd_student_details(course_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_details_status ON hrd_student_details(status);
CREATE INDEX IF NOT EXISTS idx_hrd_consultations_user ON hrd_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_consultations_date ON hrd_consultations(consult_date);

-- 기존 hrd_students 데이터를 users + hrd_student_details로 마이그레이션
-- (실행 시 기존 데이터가 있다면 이동)
-- INSERT INTO users (name, email, phone, role, birthdate, gender, address, created_at)
-- SELECT name, email, phone, 'student', birthdate, gender, address, created_at
-- FROM hrd_students 
-- WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.email = hrd_students.email);

-- INSERT INTO hrd_student_details (user_id, course_id, status, type, ...)
-- SELECT u.id, hs.course_id, hs.status, hs.type, ...
-- FROM hrd_students hs
-- JOIN users u ON u.email = hs.email;
