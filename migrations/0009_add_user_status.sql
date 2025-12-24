-- Add status column to users table
-- active: 정상 이용 가능
-- pending: 승인 대기 (강사 가입 시)
-- suspended: 이용 정지

ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
