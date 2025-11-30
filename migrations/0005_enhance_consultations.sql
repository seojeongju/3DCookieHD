-- ============================================
-- 상담 관리 기능 강화
-- ============================================

-- Consultations 테이블에 컬럼 추가
ALTER TABLE consultations ADD COLUMN consultant_id INTEGER; -- 상담 담당자 (관리자/강사 ID)
ALTER TABLE consultations ADD COLUMN consultation_type TEXT DEFAULT 'inquiry'; -- inquiry (문의), phone (전화상담), visit (방문상담), email (이메일), online (온라인)
ALTER TABLE consultations ADD COLUMN completed_date DATETIME; -- 상담 완료 일시

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_consultant ON consultations(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultations_type ON consultations(consultation_type);
