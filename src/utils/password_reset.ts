/**
 * 비밀번호 재설정 / 본인확인 공통 유틸
 */

/** 전화번호 숫자만 추출 */
export function normalizePhoneDigits(phone: string | null | undefined): string {
  return String(phone || '').replace(/\D/g, '');
}

/** 이름 정규화 (공백 정리) */
export function normalizePersonName(name: string | null | undefined): string {
  return String(name || '').replace(/\s+/g, ' ').trim();
}

/** 두 전화번호가 동일 번호인지 (뒤 10~11자리 허용) */
export function phonesMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  const da = normalizePhoneDigits(a);
  const db = normalizePhoneDigits(b);
  if (!da || !db) return false;
  if (da === db) return true;
  const ta = da.length > 11 ? da.slice(-11) : da;
  const tb = db.length > 11 ? db.slice(-11) : db;
  return ta === tb || ta.endsWith(tb) || tb.endsWith(ta);
}

/** SQLite datetime('now') 비교용 포맷 YYYY-MM-DD HH:MM:SS (UTC) */
export function toSqliteUtcDatetime(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function resetTokenExpiresInOneHour(): string {
  return toSqliteUtcDatetime(new Date(Date.now() + 60 * 60 * 1000));
}
