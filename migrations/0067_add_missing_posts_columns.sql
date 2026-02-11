-- posts 테이블에 누락된 컬럼 추가
ALTER TABLE posts ADD COLUMN sub_category TEXT;
ALTER TABLE posts ADD COLUMN course_id INTEGER;
ALTER TABLE posts ADD COLUMN enrollment_id INTEGER;
ALTER TABLE posts ADD COLUMN rating INTEGER;
ALTER TABLE posts ADD COLUMN content_url TEXT;
ALTER TABLE posts ADD COLUMN teacher_feedback TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_posts_course ON posts(course_id);
