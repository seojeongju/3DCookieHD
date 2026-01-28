-- 설문 및 역량평가 테이블 추가

-- 설문/역량평가 테이블
CREATE TABLE IF NOT EXISTS surveys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  type TEXT NOT NULL CHECK(type IN ('survey', 'diagnosis')), -- survey: 일반 설문, diagnosis: 역량 진단
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed', 'draft')), -- active: 진행중, closed: 마감, draft: 임시저장
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 설문 문항 테이블
CREATE TABLE IF NOT EXISTS survey_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK(question_type IN ('rating', 'choice', 'text')), -- rating: 5점 척도, choice: 객관식, text: 서술형
  options TEXT, -- JSON 형태: 객관식 보기 배열 (choice 타입일 때만 사용)
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- 설문 응답 테이블
CREATE TABLE IF NOT EXISTS survey_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(survey_id, student_id) -- 한 학생당 한 설문에 한 번만 응답 가능
);

-- 설문 답안 테이블
CREATE TABLE IF NOT EXISTS survey_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  response_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer_value TEXT, -- 답변 내용 (rating: 점수, choice: 선택한 옵션, text: 서술형 답변)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_surveys_course_id ON surveys(course_id);
CREATE INDEX IF NOT EXISTS idx_surveys_type ON surveys(type);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_student_id ON survey_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_question_id ON survey_answers(question_id);
