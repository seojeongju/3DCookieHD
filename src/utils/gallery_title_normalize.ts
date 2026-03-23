/**
 * 교육사진 갤러리 제목 중복 판별용 정규화.
 * 전각/반각·유니코드 호환형 문자·보이지 않는 문자·공백 차이를 줄입니다.
 */
export function normalizeGalleryTitleKey(title: string | null | undefined): string {
  let s = String(title ?? '');
  try {
    s = s.normalize('NFKC');
  } catch {
    /* ignore */
  }
  s = s.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '');
  s = s.replace(/\s+/g, ' ').trim().toLowerCase();
  return s;
}
