-- ============================================
-- 교육 플랫폼 데이터베이스 스키마
-- 작성일: 2025-10-27
-- ============================================

-- 1. 회원 테이블 (users)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- 소셜 로그인 시 NULL 가능
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student', -- student, teacher, admin
  social_provider TEXT, -- naver, kakao, google, null
  social_id TEXT,
  profile_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 캠퍼스 테이블 (campuses)
CREATE TABLE IF NOT EXISTS campuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  region TEXT NOT NULL, -- 서울, 경기, 인천 등
  address TEXT,
  phone TEXT,
  email TEXT,
  lat REAL, -- 위도 (지도 API용)
  lng REAL, -- 경도 (지도 API용)
  description TEXT,
  facilities TEXT, -- JSON 형태: 시설 정보
  certifications TEXT, -- JSON 형태: 인증 내역 (5년 인증 등)
  images TEXT, -- JSON 형태: 시설 사진 URL 배열
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 과정 테이블 (courses)
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL, -- 웹디자인, 프로그래밍, 영상편집, 건축CAD 등
  description TEXT,
  curriculum TEXT, -- JSON 형태: 주차별 커리큘럼
  duration_months INTEGER, -- 기간 (개월)
  duration_hours INTEGER, -- 총 시간
  price INTEGER DEFAULT 0, -- 수강료 (원)
  discount_price INTEGER, -- 할인가
  thumbnail_url TEXT,
  detail_images TEXT, -- JSON 형태: 상세 이미지 URL 배열
  campus_id INTEGER,
  teacher_id INTEGER,
  status TEXT DEFAULT 'active', -- active, closed, full
  max_students INTEGER DEFAULT 20, -- 정원
  current_students INTEGER DEFAULT 0, -- 현재 수강생 수
  start_date DATE,
  end_date DATE,
  schedule TEXT, -- 수업 시간 (예: 월~금 09:00-18:00)
  tags TEXT, -- JSON 형태: 태그 배열 (국비지원, 실무중심 등)
  rating REAL DEFAULT 0, -- 평점
  review_count INTEGER DEFAULT 0, -- 리뷰 수
  view_count INTEGER DEFAULT 0, -- 조회수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE SET NULL,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. 수강 신청 테이블 (enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed, cancelled
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_amount INTEGER,
  payment_method TEXT, -- card, transfer, gov_support (국비지원)
  payment_date DATETIME,
  progress INTEGER DEFAULT 0, -- 진도율 (0-100)
  attendance INTEGER DEFAULT 0, -- 출석률 (0-100)
  grade TEXT, -- A+, A, B+, B, C+, C, D, F
  certificate_url TEXT, -- 수료증 URL
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5. 리뷰 테이블 (reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrollment_id INTEGER,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), -- 1-5점
  title TEXT,
  content TEXT,
  images TEXT, -- JSON 형태: 리뷰 이미지 URL 배열
  approved BOOLEAN DEFAULT 0, -- 관리자 승인 여부
  helpful_count INTEGER DEFAULT 0, -- 도움이 됐어요 수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
);

-- 6. 게시판 테이블 (posts)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- notice, faq, portfolio, qna
  title TEXT NOT NULL,
  content TEXT,
  author_id INTEGER,
  author_name TEXT, -- 비회원 작성 시 사용
  images TEXT, -- JSON 형태: 첨부 이미지 URL 배열
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT 0, -- 상단 고정
  status TEXT DEFAULT 'published', -- draft, published, hidden
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. 댓글 테이블 (comments)
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER,
  user_name TEXT, -- 비회원 댓글 시 사용
  content TEXT NOT NULL,
  parent_id INTEGER, -- 대댓글용
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 8. 상담 예약 테이블 (consultations)
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  campus_id INTEGER,
  course_id INTEGER, -- 관심 과정
  preferred_date DATE,
  preferred_time TEXT, -- 09:00, 14:00 등
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled, noshow
  memo TEXT, -- 상담원 메모
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 9. 찜하기 테이블 (bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- 10. 강의 자료 테이블 (course_materials)
CREATE TABLE IF NOT EXISTS course_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- video, pdf, image, link
  file_url TEXT,
  file_size INTEGER, -- bytes
  description TEXT,
  week INTEGER, -- 주차
  order_index INTEGER DEFAULT 0, -- 정렬 순서
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 11. 과제 테이블 (assignments)
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATETIME,
  max_score INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 12. 과제 제출 테이블 (assignment_submissions)
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  file_url TEXT,
  content TEXT,
  score INTEGER,
  feedback TEXT, -- 강사 피드백
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(assignment_id, user_id)
);

-- ============================================
-- 인덱스 생성
-- ============================================

-- 회원 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_social ON users(social_provider, social_id);

-- 과정 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_campus ON courses(campus_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_start_date ON courses(start_date);

-- 수강신청 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- 리뷰 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- 게시판 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- 댓글 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 상담예약 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_consultations_campus ON consultations(campus_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(preferred_date);

-- 찜하기 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_course ON bookmarks(course_id);

-- 강의자료 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_week ON course_materials(week);

-- 과제 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user ON assignment_submissions(user_id);
