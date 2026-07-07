import { lmsHeaderHtml } from './lms_header';

/** LMS 과정 페이지: 헤더·탭 고정, 본문만 스크롤 */
export const LMS_SHELL_SCROLL_CLASS =
    'flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0';

export const LMS_SHELL_COLUMN_CLASS =
    'flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative';

export const LMS_SHELL_ROOT_CLASS = 'flex h-screen min-h-0 overflow-hidden min-w-0';

export function lmsFixedHeaderBlock(headerHtml: string): string {
    return `<div class="shrink-0 lms-shell-header">${headerHtml}</div>`;
}

export function lmsHeaderBlock(
    activeTab: string,
    defaultType = '',
    subnavHtml = ''
): string {
    return lmsFixedHeaderBlock(`${lmsHeaderHtml(activeTab, defaultType)}${subnavHtml}`);
}

export function lmsScrollMainOpen(extraClass = ''): string {
    const cls = extraClass ? `${LMS_SHELL_SCROLL_CLASS} ${extraClass}` : LMS_SHELL_SCROLL_CLASS;
    return `<div class="${cls}">`;
}
