-- NCS 평가 계획 테이블
CREATE TABLE ncs_evaluation_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    ncs_unit_id INTEGER NOT NULL,
    method TEXT NOT NULL,       -- 평가 방법 (예: 서술형시험, 실기시험, 포트폴리오 등)
    target_score INTEGER DEFAULT 60, -- 통과 기준 점수
    planned_date DATE,          -- 평가 예정일
    status TEXT DEFAULT 'draft', -- draft(작성중), confirmed(확정)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (ncs_unit_id) REFERENCES ncs_units(id) ON DELETE CASCADE
);

-- NCS 평가 결과 테이블
CREATE TABLE ncs_evaluation_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score INTEGER,              -- 획득 점수
    is_passed BOOLEAN DEFAULT 0, -- 이수 여부 (0: 미이수, 1: 이수)
    feedback TEXT,              -- 평가 피드백/총평
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES ncs_evaluation_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX idx_ncs_plans_course ON ncs_evaluation_plans(course_id);
CREATE INDEX idx_ncs_results_plan ON ncs_evaluation_results(plan_id);
CREATE INDEX idx_ncs_results_student ON ncs_evaluation_results(student_id);
