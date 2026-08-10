/** TinyMCE 오픈소스 CDN (Cloud API 키·도메인 등록 불필요) */
export const TINYMCE_VERSION = '6.8.5';
export const TINYMCE_BASE_URL = `https://cdn.jsdelivr.net/npm/tinymce@${TINYMCE_VERSION}`;
export const TINYMCE_SCRIPT_SRC = `${TINYMCE_BASE_URL}/tinymce.min.js`;

/** HTML script 태그 + 전역 기본값 */
export function tinymceScriptTags(): string {
  return `
<script src="${TINYMCE_SCRIPT_SRC}" referrerpolicy="origin"></script>
<script>
  window.TINYMCE_BASE_URL = ${JSON.stringify(TINYMCE_BASE_URL)};
  window.TINYMCE_SUFFIX = '.min';
</script>`;
}

/** tinymce.init에 반드시 넣을 옵션 객체(클라이언트 인라인 스크립트용 문자열) */
export function tinymceBaseInitJs(): string {
  return `base_url: (window.TINYMCE_BASE_URL || '${TINYMCE_BASE_URL}'), suffix: (window.TINYMCE_SUFFIX || '.min')`;
}
