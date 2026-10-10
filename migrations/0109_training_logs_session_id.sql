-- 훈련일지 소속 회차(course_sessions.id) 고정
-- 기존 일지는 NULL로 두고, 시간표로 확인되거나 관리자가 지정할 때만 채운다
-- 런타임에서도 ensureTrainingLogSessionColumn()이 같은 변경을 보장한다
ALTER TABLE training_logs ADD COLUMN session_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_training_logs_session_date ON training_logs(session_id, date);
