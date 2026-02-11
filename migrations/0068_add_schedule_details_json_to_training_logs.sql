-- 훈련일지 테이블에 교육상세(시간표) 및 출결요약 정보를 저장할 JSON 컬럼 추가
ALTER TABLE training_logs ADD COLUMN schedule_details_json TEXT DEFAULT NULL;
ALTER TABLE training_logs ADD COLUMN attendance_summary_json TEXT DEFAULT NULL;
