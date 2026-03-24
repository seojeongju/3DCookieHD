-- NCS 평가계획 문서를 탭별 다건(리스트)으로 저장할 수 있도록 유니크 제약을 제거
DROP INDEX IF EXISTS idx_ncs_plan_docs_unique;

-- 탭별 최신 문서 조회 성능용 인덱스
CREATE INDEX IF NOT EXISTS idx_ncs_plan_docs_lookup
ON ncs_plan_documents(course_id, evaluation_round, doc_type, updated_at DESC, id DESC);
