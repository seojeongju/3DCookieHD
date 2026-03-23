-- 포트폴리오 갤러리 공개/비공개 (관리자 UI 및 공개 페이지 필터용)
ALTER TABLE student_portfolios ADD COLUMN status TEXT DEFAULT 'published';
