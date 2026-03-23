-- 관리자 회원관리 POST /api/users 신규 등록 시 사용
-- 비밀번호 초기화·최초 로그인 안내 플래그
ALTER TABLE users ADD COLUMN is_initial_login INTEGER DEFAULT 0;
