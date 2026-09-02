-- [사용 중단] 가짜 author_name 시드 후기 — 운영 DB에 넣지 마세요.
-- 실제 수강생 후기는 scripts/seed-real-graduate-reviews*.sql 을 사용합니다.
-- 공개 API는 author_id IS NULL 후기를 노출하지 않습니다.

-- DELETE FROM posts WHERE category = 'review' AND author_id IS NULL;
