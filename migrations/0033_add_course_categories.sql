-- 과정 분류(카테고리) 관리 테이블 — 과정 등록 기초 데이터
CREATE TABLE IF NOT EXISTS course_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  is_system_default INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_course_categories_system ON course_categories(is_system_default);
CREATE INDEX IF NOT EXISTS idx_course_categories_sort ON course_categories(sort_order);

-- 시스템 기본값 (수정/삭제 불가)
INSERT OR IGNORE INTO course_categories (name, is_system_default, sort_order) VALUES
  ('통합과정', 1, 1),
  ('내일배움(계좌제)', 1, 2),
  ('국가기간전략산업직종', 1, 3),
  ('근로자직무능력향상', 1, 4),
  ('사업주위탁', 1, 5),
  ('일반·대학생', 1, 6);
