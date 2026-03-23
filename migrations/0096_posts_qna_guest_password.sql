-- Q&A 비회원 비밀글 비밀번호 해시 (SHA-256, 서버 저장)
ALTER TABLE posts ADD COLUMN guest_password_hash TEXT;
