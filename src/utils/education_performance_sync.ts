/** 교육사진 갤러리(posts.category = education_photo) ↔ 교육실적(education_performance) 자동 동기화 */

function performedAtFromPostCreated(createdAt: string | null | undefined): string {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}. ${m}`;
}

type PostRow = {
  id: number;
  title: string | null;
  created_at: string | null;
  status: string | null;
  category: string | null;
};

/**
 * 공개(published)인 교육사진 글이면 실적에 반영하고,
 * 비공개·초안이면 해당 post_id 실적 행을 제거합니다.
 */
export async function syncEducationPerformanceFromEducationPhotoPost(
  DB: D1Database,
  post: PostRow
): Promise<void> {
  if (post.category !== 'education_photo') return;

  const status = (post.status || '').toLowerCase();
  if (status !== 'published') {
    await DB.prepare(`DELETE FROM education_performance WHERE post_id = ?`).bind(post.id).run();
    return;
  }

  const performedAt = performedAtFromPostCreated(post.created_at ?? undefined);
  const title = (post.title || '').trim() || '교육사진';

  const existing = await DB.prepare(`SELECT id FROM education_performance WHERE post_id = ?`)
    .bind(post.id)
    .first<{ id: number }>();

  if (existing) {
    await DB.prepare(`UPDATE education_performance SET performed_at = ?, title = ? WHERE post_id = ?`)
      .bind(performedAt, title, post.id)
      .run();
    return;
  }

  const maxSort = await DB.prepare(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM education_performance`)
    .first<{ m: number }>();
  const nextOrder = (maxSort?.m ?? -1) + 1;

  try {
    await DB.prepare(`
      INSERT INTO education_performance (performed_at, title, category, sort_order, post_id)
      VALUES (?, ?, NULL, ?, ?)
    `)
      .bind(performedAt, title, nextOrder, post.id)
      .run();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('UNIQUE') && msg.includes('post_id')) {
      await DB.prepare(`UPDATE education_performance SET performed_at = ?, title = ? WHERE post_id = ?`)
        .bind(performedAt, title, post.id)
        .run();
      return;
    }
    throw e;
  }
}

export async function removeEducationPerformanceByPostId(DB: D1Database, postId: number): Promise<void> {
  await DB.prepare(`DELETE FROM education_performance WHERE post_id = ?`).bind(postId).run();
}
