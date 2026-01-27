-- 시설-물품 연결 테이블 (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS hrd_facility_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES hrd_facilities (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES hrd_items (id) ON DELETE CASCADE,
    UNIQUE(facility_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_facility_items_facility ON hrd_facility_items(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_items_item ON hrd_facility_items(item_id);
