/**
 * attendance_logs.enrollment_id는 회차 수강(course_session_enrollments.id)과
 * 일반 수강(enrollments.id)을 함께 쓰므로 번호가 겹치면 다른 과정 출결이 섞인다.
 * enrollment_type으로 구분하고, 구분 전 기록(NULL)은 양쪽에서 보이도록 둔다.
 */
export type AttendanceEnrollmentKind = 'session' | 'course';

let columnReady = false;

export async function ensureAttendanceEnrollmentType(DB: D1Database): Promise<void> {
  if (columnReady) return;
  try {
    await DB.prepare('ALTER TABLE attendance_logs ADD COLUMN enrollment_type TEXT').run();
  } catch (e) {
    if (!/duplicate column/i.test(String((e as Error)?.message ?? e))) throw e;
  }
  columnReady = true;
}

/** 조회 조건: 해당 종류이거나 구분 전 기록 */
export function attendanceKindSql(alias: string, kind: AttendanceEnrollmentKind): string {
  const col = alias ? `${alias}.enrollment_type` : 'enrollment_type';
  return `(${col} IS NULL OR ${col} = '${kind}')`;
}

/** 출결 1건 저장 (같은 수강·날짜면 갱신하며 종류를 기록) */
export async function upsertAttendanceLog(
  DB: D1Database,
  kind: AttendanceEnrollmentKind,
  enrollmentId: number,
  date: string,
  fields: { check_in?: string | null; check_out?: string | null; status: string; note?: string | null },
): Promise<void> {
  const existing = await DB.prepare(
    `SELECT id FROM attendance_logs WHERE enrollment_id = ? AND date = ? AND ${attendanceKindSql('', kind)}
     ORDER BY (enrollment_type IS NULL) LIMIT 1`,
  ).bind(enrollmentId, date).first<{ id: number }>();
  if (existing) {
    await DB.prepare(
      `UPDATE attendance_logs SET check_in_time = ?, check_out_time = ?, status = ?, note = ?, enrollment_type = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    ).bind(fields.check_in ?? null, fields.check_out ?? null, fields.status, fields.note ?? null, kind, existing.id).run();
  } else {
    await DB.prepare(
      `INSERT INTO attendance_logs (enrollment_id, enrollment_type, date, check_in_time, check_out_time, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(enrollmentId, kind, date, fields.check_in ?? null, fields.check_out ?? null, fields.status, fields.note ?? null).run();
  }
}

/** 저장 대상 수강 번호가 해당 회차/과정 소속인지 확인 */
export async function enrollmentBelongs(
  DB: D1Database,
  kind: AttendanceEnrollmentKind,
  enrollmentId: number,
  scopeId: number,
): Promise<boolean> {
  const row = kind === 'session'
    ? await DB.prepare('SELECT 1 AS ok FROM course_session_enrollments WHERE id = ? AND session_id = ?').bind(enrollmentId, scopeId).first()
    : await DB.prepare('SELECT 1 AS ok FROM enrollments WHERE id = ? AND course_id = ?').bind(enrollmentId, scopeId).first();
  return !!row;
}
