-- 교강사 상세 정보 필드 추가
-- 최종학력, 경력사항, 자격증, 보수교육현황

ALTER TABLE hrd_instructors ADD COLUMN education TEXT; -- 최종학력
ALTER TABLE hrd_instructors ADD COLUMN career TEXT; -- 경력사항 (JSON 또는 텍스트)
ALTER TABLE hrd_instructors ADD COLUMN certifications TEXT; -- 자격증 (JSON: [{name, issue_date, expiry_date, file_url}])
ALTER TABLE hrd_instructors ADD COLUMN training_history TEXT; -- 보수교육현황 (JSON 또는 텍스트)
