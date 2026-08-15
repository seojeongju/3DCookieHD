-- 회차 단위 공지 (posts.session_id)
ALTER TABLE posts ADD COLUMN session_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_posts_session_id ON posts(session_id);
