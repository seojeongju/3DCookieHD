-- 문제은행 분류용 NCS 교과목 전용 테이블 (중복·엉뚱한 데이터 없이 관리)
CREATE TABLE IF NOT EXISTS question_bank_ncs_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_bank_ncs_subjects_name ON question_bank_ncs_subjects(name);

-- 문제은행 문항이 참조할 분류 ID (기존 curriculum_id는 ncs_approved_curriculum용, 이 컬럼은 전용 목록용)
ALTER TABLE question_bank ADD COLUMN ncs_subject_id INTEGER REFERENCES question_bank_ncs_subjects(id);
