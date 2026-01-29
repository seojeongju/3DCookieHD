-- 상담 일지 구분 필드 추가 및 수강 전 상담 지원
-- 1. student_id NULL 허용을 위해 테이블 재생성 또는 필드 변경이 필요할 수 있으나, SQLite에서는 필드 속성 변경이 복잡하므로 
-- 일단 상담 유형 필드와 링크 필드만 추가하고, API 레벨에서 대응하거나 나중에 스키마를 정리합니다.

ALTER TABLE hrd_counseling_logs ADD COLUMN counseling_type TEXT DEFAULT 'academic'; -- 'admission' (입학), 'academic' (학사)
ALTER TABLE hrd_counseling_logs ADD COLUMN consultation_id INTEGER; -- Link to consultations table for admissions

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_type ON hrd_counseling_logs(counseling_type);
CREATE INDEX IF NOT EXISTS idx_hrd_counseling_consultation ON hrd_counseling_logs(consultation_id);
