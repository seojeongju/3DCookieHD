-- 회차 수강 중도탈락: status='dropped' + 탈락일·사유(employment/personal/attendance/other)·메모
-- 런타임에서도 ensureEnrollmentDropColumns()가 같은 변경을 보장한다
ALTER TABLE course_session_enrollments ADD COLUMN dropped_at TEXT;
ALTER TABLE course_session_enrollments ADD COLUMN drop_reason TEXT;
ALTER TABLE course_session_enrollments ADD COLUMN drop_memo TEXT;
