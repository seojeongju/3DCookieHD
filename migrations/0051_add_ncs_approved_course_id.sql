ALTER TABLE ncs_approved_registrations ADD COLUMN approved_course_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_ncs_approved_reg_course_id ON ncs_approved_registrations(approved_course_id);
