-- ============================================
-- HRD 행정시스템 관련 테이블 추가
-- ============================================

-- 1. 물품 관리 테이블
CREATE TABLE IF NOT EXISTS hrd_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- textbook, equipment, consumable
    name TEXT NOT NULL,
    model TEXT,
    quantity INTEGER DEFAULT 0,
    location TEXT,
    status TEXT DEFAULT 'good', -- good, repair, discard, shortage
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 훈련시설 테이블
CREATE TABLE IF NOT EXISTS hrd_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT '양호', -- 양호, 점검필요
    last_check DATETIME,
    area REAL,
    manager_main TEXT,
    manager_sub TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 시설 관리 대장 테이블
CREATE TABLE IF NOT EXISTS hrd_facility_maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    status TEXT NOT NULL, -- check, repair
    title TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    vendor TEXT,
    manager TEXT,
    memo TEXT,
    date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES hrd_facilities (id) ON DELETE CASCADE
);

-- 4. 시설 이미지 테이블
CREATE TABLE IF NOT EXISTS hrd_facility_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    name TEXT,
    size TEXT,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES hrd_facilities (id) ON DELETE CASCADE
);

-- 5. 교강사 상세 정보 테이블
CREATE TABLE IF NOT EXISTS hrd_instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    position TEXT,
    subject TEXT,
    type TEXT DEFAULT 'full', -- full, part, external
    status TEXT DEFAULT 'active', -- active, leave, retired
    joined_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 6. 훈련생 상세 프로필 테이블
CREATE TABLE IF NOT EXISTS hrd_student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    birthdate TEXT,
    gender TEXT, -- M, F
    address TEXT,
    education TEXT,
    certifications TEXT,
    type TEXT DEFAULT 'jobseeker', -- jobseeker, worker, general, student
    package_type TEXT,
    payment_method TEXT,
    payment_date DATETIME,
    self_pay_amount INTEGER DEFAULT 0,
    has_application BOOLEAN DEFAULT 0,
    has_card BOOLEAN DEFAULT 0,
    is_hrd_net_registered BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'consulting', -- consulting, registered, learning, completed, dropout
    status_memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hrd_items_category ON hrd_items(category);
CREATE INDEX IF NOT EXISTS idx_hrd_facilities_name ON hrd_facilities(name);
CREATE INDEX IF NOT EXISTS idx_hrd_instructors_user ON hrd_instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_profiles_user ON hrd_student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_hrd_student_profiles_status ON hrd_student_profiles(status);
