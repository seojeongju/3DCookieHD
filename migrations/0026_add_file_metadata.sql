-- 파일 메타데이터 테이블
-- R2에 업로드된 파일의 정보를 관리합니다
CREATE TABLE IF NOT EXISTS file_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_path TEXT NOT NULL UNIQUE, -- R2 경로
  file_name TEXT NOT NULL, -- 원본 파일명
  file_size INTEGER NOT NULL, -- 파일 크기 (bytes)
  mime_type TEXT NOT NULL, -- MIME 타입
  category TEXT NOT NULL, -- resumes, portfolios, documents, evidence, assignments, materials, images
  folder TEXT, -- 추가 폴더 경로 (user_id, course_id 등)
  uploaded_by INTEGER NOT NULL, -- 업로드한 사용자 ID
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  related_id INTEGER, -- 관련 엔티티 ID (jobseeker_id, student_id, assignment_id 등)
  related_type TEXT, -- 관련 엔티티 타입 (jobseeker, student, assignment 등)
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_file_metadata_category ON file_metadata(category);
CREATE INDEX IF NOT EXISTS idx_file_metadata_uploaded_by ON file_metadata(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_metadata_related ON file_metadata(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_file_metadata_folder ON file_metadata(folder);
