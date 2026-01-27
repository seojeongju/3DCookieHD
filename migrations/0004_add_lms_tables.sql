-- LMS & CBT 관련 테이블 추가

-- 1. 출결 기록 (attendance_logs)
CREATE TABLE IF NOT EXISTS attendance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  check_in_time TEXT, -- HH:MM:SS
  check_out_time TEXT, -- HH:MM:SS
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'early_leave', 'absent', 'public_leave')),
  note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

-- 2. 평가 항목 (evaluations)
CREATE TABLE IF NOT EXISTS evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('exam', 'assignment', 'attendance', 'attitude')),
  max_score INTEGER DEFAULT 100,
  weight INTEGER DEFAULT 0, -- 가중치 (%)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 3. 학생 성적 (student_scores)
CREATE TABLE IF NOT EXISTS student_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evaluation_id INTEGER NOT NULL,
  enrollment_id INTEGER NOT NULL,
  score REAL,
  feedback TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id),
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

-- 4. 상담 일지 (counseling_logs)
CREATE TABLE IF NOT EXISTS counseling_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_id INTEGER NOT NULL,
  counselor_id INTEGER NOT NULL, -- 상담자 (users.id)
  date TEXT NOT NULL,
  category TEXT NOT NULL, -- 진로, 고충, 학습, 기타
  content TEXT NOT NULL,
  action_taken TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
  FOREIGN KEY (counselor_id) REFERENCES users(id)
);

-- 5. 훈련 일지 (training_logs)
CREATE TABLE IF NOT EXISTS training_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  instructor_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  topic TEXT,
  content TEXT,
  teaching_method TEXT,
  issues TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- 6. 문제 은행 (question_bank)
CREATE TABLE IF NOT EXISTS question_bank (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT, -- 과목/분류
  difficulty TEXT CHECK (difficulty IN ('low', 'medium', 'high')),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer', 'essay')),
  options TEXT, -- JSON string for choices
  correct_answer TEXT,
  explanation TEXT,
  image_url TEXT,
  tags TEXT, -- JSON string array
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 7. 시험 정보 (exams)
CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER, -- 특정 과정에 종속되지 않은 시험일 수도 있으므로 nullable 가능하게 하거나, 공통 시험은 course_id=null
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('midterm', 'final', 'mock', 'practice')),
  start_time TEXT,
  end_time TEXT,
  time_limit_minutes INTEGER,
  is_active INTEGER DEFAULT 0, -- 0: false, 1: true
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 8. 시험 문제 (exam_questions)
CREATE TABLE IF NOT EXISTS exam_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  question_bank_id INTEGER, -- 문제은행에서 가져온 경우
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT,
  correct_answer TEXT,
  points INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (question_bank_id) REFERENCES question_bank(id)
);

-- 9. 시험 제출 (exam_submissions)
CREATE TABLE IF NOT EXISTS exam_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  started_at TEXT,
  submitted_at TEXT,
  total_score REAL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- 10. 제출 답안 (exam_answers)
CREATE TABLE IF NOT EXISTS exam_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  student_answer TEXT,
  is_correct INTEGER, -- 0: false, 1: true
  score_awarded REAL,
  FOREIGN KEY (submission_id) REFERENCES exam_submissions(id),
  FOREIGN KEY (question_id) REFERENCES exam_questions(id)
);
