-- 교육실적 ↔ 교육사진 갤러리(posts) 연동
ALTER TABLE education_performance ADD COLUMN post_id INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS idx_education_performance_post_id ON education_performance(post_id) WHERE post_id IS NOT NULL;
