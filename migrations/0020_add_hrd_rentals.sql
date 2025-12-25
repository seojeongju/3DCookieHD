CREATE TABLE IF NOT EXISTS hrd_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    quantity INTEGER DEFAULT 0,
    location TEXT,
    status TEXT DEFAULT 'good',
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrd_item_rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    phone TEXT,
    rented_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_at DATETIME,
    status TEXT DEFAULT 'rented', -- rented, returned
    memo TEXT,
    FOREIGN KEY (item_id) REFERENCES hrd_items (id) ON DELETE CASCADE
);
