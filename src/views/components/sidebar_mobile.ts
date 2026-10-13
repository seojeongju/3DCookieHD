/**
 * 관리자·강사 사이드바 공통 모바일(1024px 미만) 상단 바와 반응형 보정
 * - 햄버거 버튼을 고정 상단 바에 넣고, 사이드바 뒤의 본문 열을 바 높이만큼 내린다
 * - 페이지마다 헤더 구조가 달라 본문 영역(#…SidebarWrap 형제)에 공통 보정을 건다
 */
export const sidebarMobileBar = (toggleId: string, barId: string, homeHref: string, label: string) => `
<div id="${barId}" class="sidebar-mobile-bar lg:hidden fixed top-0 inset-x-0 z-[35] h-14 px-3 flex items-center gap-3 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
  <button type="button" id="${toggleId}" aria-label="메뉴 열기" class="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 transition touch-manipulation">
    <i class="fas fa-bars"></i>
  </button>
  <a href="${homeHref}" class="sidebar-mobile-title min-w-0 flex-1 truncate text-sm font-black tracking-tight text-slate-800">${label}</a>
</div>
<script>
(function () {
  var bar = document.getElementById('${barId}');
  var title = bar && bar.querySelector('.sidebar-mobile-title');
  var t = (document.title || '').split(/\\s[-|·]\\s/)[0].trim();
  if (title && t) title.textContent = t;
})();
</script>`;

// 사이드바(또는 사이드바만 감싼 인쇄 숨김용 래퍼) 뒤에 오는 본문 열
const S = ':is(#adminSidebarWrap, #teacherSidebarWrap, :has(> #adminSidebarWrap), :has(> #teacherSidebarWrap))';

export const sidebarMobileCss = `
<style>
@media (max-width: 1023.98px) {
  ${S} ~ :not(script):not(style):not(.fixed) { margin-top: 3.5rem; }
  ${S} ~ .h-full:not(.fixed) { height: calc(100% - 3.5rem); }
  ${S} ~ .h-screen:not(.fixed) { height: calc(100vh - 3.5rem); }
}
@media (max-width: 767.98px) {
  ${S} ~ * header {
    height: auto !important; min-height: 3.5rem; flex-wrap: wrap; row-gap: .5rem;
    padding-left: 1rem !important; padding-right: 1rem !important;
  }
  ${S} ~ * header > div { padding-left: 0; padding-right: 0; }
  ${S} ~ * header :is(h1, h2) { font-size: 1.125rem !important; line-height: 1.4 !important; }
  ${S} ~ * :is(header, .flex) > :is(a, button) { white-space: nowrap; }
  ${S} ~ * :is(th, td > span, td > button, td .font-medium, td .font-semibold) { white-space: nowrap; }
  ${S} ~ * .flex.justify-between,
  ${S} ~ * .flex.justify-between > .flex { flex-wrap: wrap; row-gap: .5rem; }
  ${S} ~ * :is(.overflow-x-auto, .overflow-auto) table { min-width: 640px; }
}
@media (max-width: 639.98px) {
  ${S} ~ * .p-8 { padding: 1.25rem; }
  ${S} ~ * .px-8 { padding-left: 1rem; padding-right: 1rem; }
}
</style>`;
