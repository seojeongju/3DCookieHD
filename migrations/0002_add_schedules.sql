-- 스케줄 테이블 생성
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,           -- 분류 (통합과정, 단기과정 등)
  target_audience TEXT NOT NULL,    -- 대상 (실업자/재직자/일반(등록) 등)
  course_name TEXT NOT NULL,        -- 과정명
  session_number INTEGER,           -- 회차
  max_students INTEGER,             -- 모집인원
  start_date TEXT NOT NULL,         -- 시작일 (YYYY-MM-DD)
  end_date TEXT NOT NULL,           -- 종료일 (YYYY-MM-DD)
  start_time TEXT,                  -- 시작 시간 (HH:MM)
  end_time TEXT,                    -- 종료 시간 (HH:MM)
  days_of_week TEXT,                -- 요일 (월, 화, 수, 목, 금, 토, 일)
  status TEXT DEFAULT 'open',       -- 상태 (open: 모집중, closed: 마감, cancelled: 취소)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_schedules_dates ON schedules(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_category ON schedules(category);

-- 샘플 데이터 삽입 (이미지 기반)
INSERT INTO schedules (category, target_audience, course_name, session_number, max_students, start_date, end_date, start_time, end_time, days_of_week, status) VALUES
('통합과정', '실업자/재직자/일반(등록)', '[주말반] 스마트 제품개발을 위한 3D프린팅,아두이노,30설계', 2, 14, '2025-12-20', '2026-01-25', '09:00', '15:30', '월, 토', 'open'),
('통합과정', '실업자/재직자/일반(등록)', '[토,일 주말반] 3D프린터운용기능사 실기 대비', 8, 14, '2025-11-22', '2025-12-13', '09:00', '15:30', '월, 토', 'open'),
('통합과정', '실업자/재직자/일반(등록)', '[평일저녁반] 3D프린터운용기능사 실기 집중준비반', 6, 14, '2025-11-10', '2025-11-18', '19:00', '22:00', '월, 화, 수, 목', 'open'),
('통합과정', '실업자/재직자/일반(등록)', '[주말반] 3D프린터운용기능사 실기 집중분제풀이', 5, 14, '2025-11-09', '2025-11-16', '09:00', '15:30', '월, 토', 'open'),
('통합과정', '실업자/재직자/일반(등록)', '[평일저녁반] 아두이노, 활용 제품만들기 과정', 2, 14, '2025-11-03', '2025-11-07', '18:50', '22:30', '월, 화, 수, 목, 금', 'open');
