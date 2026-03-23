/**
 * 공식 SNS·커뮤니티 링크 (푸터 / 네비게이션 공용)
 */
export const SOCIAL_LINKS = [
  {
    href: 'https://www.band.us/@3dcookiehd',
    label: '네이버밴드',
    iconClass: 'fas fa-users',
    title: '네이버밴드',
  },
  {
    href: 'https://blog.naver.com/3dcookiehd',
    label: '네이버블로그',
    iconClass: 'fas fa-blog',
    title: '네이버 블로그',
  },
  {
    href: 'https://www.instagram.com/3dcookie_hd/',
    label: 'Instagram',
    iconClass: 'fab fa-instagram',
    title: 'Instagram',
  },
  {
    href: 'https://ko-kr.facebook.com/3dfabcafe/',
    label: 'Facebook',
    iconClass: 'fab fa-facebook-f',
    title: 'Facebook',
  },
] as const;

/** 데스크톱 상단: 아이콘만 (헤더 우측) */
export function socialLinksDesktopNavHtml(): string {
  return `
    <div class="hidden lg:flex items-center gap-0.5 shrink-0 border-l border-gray-200 pl-3 ml-2" role="navigation" aria-label="SNS 바로가기">
      ${SOCIAL_LINKS.map(
        (s) => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" title="${s.title}" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors" aria-label="${s.title}">
        <i class="${s.iconClass} text-lg"></i>
      </a>`
      ).join('')}
    </div>`;
}

/** 모바일 드로어: 라벨 포함 리스트 */
export function socialLinksMobileNavHtml(): string {
  return `
    <div class="px-2 py-1 mt-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">SNS·커뮤니티</div>
    <div class="px-4 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
      ${SOCIAL_LINKS.map(
        (s) => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition border border-gray-100">
        <span class="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary-600 shrink-0"><i class="${s.iconClass}"></i></span>
        <span class="text-sm font-bold">${s.label}</span>
      </a>`
      ).join('')}
    </div>`;
}

/** 푸터: 칩 스타일 링크 줄 */
export function socialLinksFooterRowHtml(): string {
  return `
    <div class="mt-5">
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SNS·커뮤니티</p>
      <div class="flex flex-wrap gap-2">
        ${SOCIAL_LINKS.map(
          (s) => `
        <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-semibold transition">
          <i class="${s.iconClass} text-primary-400"></i>
          <span>${s.label}</span>
        </a>`
        ).join('')}
      </div>
    </div>`;
}
