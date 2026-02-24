-- 훈련생별 결제 다건 저장 (결재는 여러 번 가능)
CREATE TABLE IF NOT EXISTS hrd_student_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('card', 'transfer', 'cash')),
    payment_method_note TEXT,
    payment_date TEXT,
    amount INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_hrd_student_payments_user ON hrd_student_payments(user_id);
