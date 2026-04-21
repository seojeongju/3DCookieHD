-- posts 테이블에 동영상(videos) 컬럼 추가
-- JSON 배열 형태의 텍스트를 저장합니다.
ALTER TABLE posts ADD COLUMN videos TEXT;
