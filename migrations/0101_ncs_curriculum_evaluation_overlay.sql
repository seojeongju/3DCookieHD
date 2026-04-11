-- 교과목·회차별 평가도구제작 평가내용(criteria_groups) — NCS 불러오기 결과와 별도 보관·병합용
CREATE TABLE IF NOT EXISTS ncs_curriculum_evaluation_overlay (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    curriculum_id INTEGER NOT NULL,
    evaluation_round INTEGER NOT NULL DEFAULT 1,
    criteria_groups_json TEXT NOT NULL DEFAULT '[]',
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (curriculum_id) REFERENCES ncs_approved_curriculum(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ncs_eval_overlay_unique
ON ncs_curriculum_evaluation_overlay(course_id, curriculum_id, evaluation_round);

CREATE INDEX IF NOT EXISTS idx_ncs_eval_overlay_curriculum
ON ncs_curriculum_evaluation_overlay(curriculum_id, evaluation_round);
