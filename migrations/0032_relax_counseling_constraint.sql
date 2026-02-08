-- ============================================
-- 상담 일지 테이블 제약 조건 완화 및 비회원 관리 지원
-- ============================================

-- SQLite에서는 필드 속성(NOT NULL -> NULL) 변경을 위해 테이블 재성성이 필요합니다.
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS hrd_counseling_logs_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER, -- NULL 허용 (비회원 상담 대비)
    counselor_id INTEGER NOT NULL,
    course_id INTEGER,
    counseling_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    method TEXT,
    content TEXT,
    result TEXT,
    next_counseling_date DATETIME,
    counseling_type TEXT DEFAULT 'academic', -- admission, academic
    consultation_id INTEGER, -- 비회원 문의 연동용
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 기존 데이터 이전 (0008 테이블에는 counseling_type, consultation_id 없음 → 기본값 사용)
INSERT INTO hrd_counseling_logs_new (
    id, student_id, counselor_id, course_id, counseling_date, 
    category, method, content, result, next_counseling_date, 
    counseling_type, consultation_id, created_at, updated_at
)
SELECT 
    id, student_id, counselor_id, course_id, counseling_date, 
    category, method, content, result, next_counseling_date, 
    'academic' AS counseling_type,
    NULL AS consultation_id,
    created_at, updated_at
FROM hrd_counseling_logs;

-- 기존 테이블 삭제 및 교체
DROP TABLE hrd_counseling_logs;
ALTER TABLE hrd_counseling_logs_new RENAME TO hrd_counseling_logs;

-- 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_student ON hrd_counseling_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_date ON hrd_counseling_logs(counseling_date);
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_type ON hrd_counseling_logs(counseling_type);
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_consultation ON hrd_counseling_logs(consultation_id);

PRAGMA foreign_keys=ON;
