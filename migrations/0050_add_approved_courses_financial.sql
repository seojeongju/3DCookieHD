-- 승인받은 과정 — 훈련 비용 및 시간 정보 추가
ALTER TABLE approved_courses ADD COLUMN hourly_rate INTEGER;
ALTER TABLE approved_courses ADD COLUMN total_days INTEGER;
ALTER TABLE approved_courses ADD COLUMN total_cost INTEGER;
ALTER TABLE approved_courses ADD COLUMN total_hours INTEGER;
ALTER TABLE approved_courses ADD COLUMN daily_hours REAL;
ALTER TABLE approved_courses ADD COLUMN gov_subsidy INTEGER;
