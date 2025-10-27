// ============================================
// 데이터베이스 유틸리티
// ============================================

/**
 * SQL 쿼리 결과를 단일 객체로 반환
 */
export async function getOne<T>(
  db: D1Database,
  query: string,
  params: any[] = []
): Promise<T | null> {
  const stmt = db.prepare(query);
  const result = await stmt.bind(...params).first<T>();
  return result || null;
}

/**
 * SQL 쿼리 결과를 배열로 반환
 */
export async function getAll<T>(
  db: D1Database,
  query: string,
  params: any[] = []
): Promise<T[]> {
  const stmt = db.prepare(query);
  const result = await stmt.bind(...params).all<T>();
  return result.results || [];
}

/**
 * INSERT/UPDATE/DELETE 실행
 */
export async function execute(
  db: D1Database,
  query: string,
  params: any[] = []
): Promise<D1Result> {
  const stmt = db.prepare(query);
  return await stmt.bind(...params).run();
}

/**
 * 트랜잭션 실행 (D1은 현재 트랜잭션을 직접 지원하지 않으므로 batch 사용)
 */
export async function transaction(
  db: D1Database,
  queries: Array<{ query: string; params?: any[] }>
): Promise<D1Result[]> {
  const statements = queries.map(({ query, params = [] }) => 
    db.prepare(query).bind(...params)
  );
  
  const results = await db.batch(statements);
  return results;
}

/**
 * 페이지네이션 계산
 */
export function calculatePagination(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  return { limit, offset };
}

/**
 * 총 페이지 수 계산
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

/**
 * JSON 필드 파싱
 */
export function parseJsonField<T>(field: string | null | undefined, defaultValue: T): T {
  if (!field) return defaultValue;
  try {
    return JSON.parse(field) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * JSON 필드 문자열화
 */
export function stringifyJsonField(value: any): string {
  return JSON.stringify(value);
}

/**
 * 현재 시간 (ISO 8601 포맷)
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * WHERE 절 조건 빌더
 */
export function buildWhereClause(
  conditions: Record<string, any>,
  startIndex: number = 1
): { clause: string; params: any[] } {
  const entries = Object.entries(conditions).filter(([_, value]) => value !== undefined);
  
  if (entries.length === 0) {
    return { clause: '', params: [] };
  }
  
  const clauses = entries.map(([key, _], index) => `${key} = ?${startIndex + index}`);
  const params = entries.map(([_, value]) => value);
  
  return {
    clause: `WHERE ${clauses.join(' AND ')}`,
    params
  };
}

/**
 * LIKE 검색 조건 빌더
 */
export function buildSearchClause(
  fields: string[],
  searchTerm: string,
  startIndex: number = 1
): { clause: string; params: any[] } {
  if (!searchTerm || fields.length === 0) {
    return { clause: '', params: [] };
  }
  
  const likeTerm = `%${searchTerm}%`;
  const clauses = fields.map(field => `${field} LIKE ?`);
  const params = fields.map(() => likeTerm);
  
  return {
    clause: `(${clauses.join(' OR ')})`,
    params
  };
}

/**
 * ORDER BY 절 빌더
 */
export function buildOrderByClause(
  sort: string | undefined,
  allowedFields: Record<string, string>
): string {
  if (!sort || !allowedFields[sort]) {
    return '';
  }
  
  return `ORDER BY ${allowedFields[sort]}`;
}
