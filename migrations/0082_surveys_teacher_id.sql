-- 설문 담당 강사(teacher_id) 컬럼 추가: 관리자는 드롭다운 선택, 강사는 본인 자동 설정
ALTER TABLE surveys ADD COLUMN teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_surveys_teacher_id ON surveys(teacher_id);
