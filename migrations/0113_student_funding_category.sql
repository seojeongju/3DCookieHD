-- 훈련생 대상구분: 국비지원대상(gov) / 일반(general)
ALTER TABLE hrd_student_details ADD COLUMN funding_category TEXT DEFAULT 'gov';
