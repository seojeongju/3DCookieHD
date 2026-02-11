-- 교과목별 직종명 (과정개설 시 설정) — 시간표 등에서 직종 표시용
-- 0056이 수동 실행용이었으므로 실제 ALTER 추가. 이미 job_name이 있으면 "duplicate column" 오류는 무시 가능.
ALTER TABLE ncs_approved_curriculum ADD COLUMN job_name TEXT;
