-- 채용공고 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT DEFAULT '와우쓰리디홍대센터',
  job_type TEXT, -- 정규직, 계약직, 아르바이트, 인턴
  location TEXT,
  salary TEXT,
  requirements TEXT,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, closed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 구직자(인재풀) 테이블
CREATE TABLE IF NOT EXISTS jobseekers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  birth_date DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  education TEXT,
  career TEXT, -- 경력 사항
  skills TEXT, -- 보유 기술
  resume_file TEXT, -- 이력서 파일 URL
  portfolio_file TEXT, -- 포트폴리오 파일 URL
  status TEXT DEFAULT 'active', -- active, hired, inactive
  memo TEXT, -- 관리자 메모
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobseekers_status ON jobseekers(status);
CREATE INDEX IF NOT EXISTS idx_jobseekers_name ON jobseekers(name);
