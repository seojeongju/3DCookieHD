-- 연동 홈페이지 설정: 모집상황, 대표이미지/수업계획서 노출, 모집유예기간, 대표 이미지 URL, 과정 상세 설명
ALTER TABLE course_sessions ADD COLUMN recruitment_status TEXT DEFAULT 'normal';
ALTER TABLE course_sessions ADD COLUMN representative_image_exposure TEXT DEFAULT 'expose';
ALTER TABLE course_sessions ADD COLUMN recruitment_grace_period INTEGER DEFAULT 0;
ALTER TABLE course_sessions ADD COLUMN syllabus_exposure TEXT DEFAULT 'hide';
ALTER TABLE course_sessions ADD COLUMN main_slide_image_url TEXT;
ALTER TABLE course_sessions ADD COLUMN course_list_image_url TEXT;
ALTER TABLE course_sessions ADD COLUMN course_detail_description TEXT;
