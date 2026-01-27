-- ============================================
-- 시설 예약 관리 테이블 추가
-- ============================================

CREATE TABLE IF NOT EXISTS hrd_facility_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    user_id INTEGER,  -- 로그인한 사용자 ID (Optional)
    user_name TEXT,   -- 예약자 이름 (비회원/수기 입력)
    phone TEXT,       -- 연락처
    purpose TEXT NOT NULL, -- 사용 목적
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, cancelled
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES hrd_facilities (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reservations_facility_id ON hrd_facility_reservations(facility_id);
CREATE INDEX IF NOT EXISTS idx_reservations_range ON hrd_facility_reservations(start_date, end_date);
