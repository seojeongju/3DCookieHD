-- 출결 수강 번호 종류: 'session'(course_session_enrollments.id) / 'course'(enrollments.id)
-- 기존 기록은 NULL (양쪽 조회에 포함). 런타임에서도 ensureAttendanceEnrollmentType()이 같은 변경을 보장한다
ALTER TABLE attendance_logs ADD COLUMN enrollment_type TEXT;
