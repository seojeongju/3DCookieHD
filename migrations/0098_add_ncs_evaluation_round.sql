-- NCS 평가 차수 컬럼 추가 (본평가/재평가/재평가)
-- 1 = 1차평가(본평가), 2 = 2차평가(재평가), 3 = 3차평가(재평가)
ALTER TABLE ncs_evaluation_plans ADD COLUMN evaluation_round INTEGER DEFAULT 1;

-- 차수 필터 조회 성능 향상
CREATE INDEX IF NOT EXISTS idx_ncs_plans_course_round ON ncs_evaluation_plans(course_id, evaluation_round);
CREATE INDEX IF NOT EXISTS idx_ncs_plans_round ON ncs_evaluation_plans(evaluation_round);
