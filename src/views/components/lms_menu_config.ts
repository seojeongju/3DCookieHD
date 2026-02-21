/**
 * 통합 성과 관리 / LMS 메뉴 공통 설정
 * - 왼쪽 사이드바(통합 성과 관리)와 LMS 상단 탭 메뉴의 순서·메뉴명을 동일하게 유지
 */

export type LmsMenuItem = {
  /** 사이드바 tab 파라미터 및 활성 메뉴 식별 */
  tab: string;
  /** LMS 경로 세그먼트 (예: students, cbt, ncs-eval). null이면 LMS 탭에 미표시 */
  path: string | null;
  /** 통일된 메뉴 라벨 */
  label: string;
  /** FontAwesome 아이콘 클래스 (fa- 제외) */
  icon: string;
  /** true면 LMS 탭에는 없고 사이드바에만 표시 */
  onlySidebar?: boolean;
};

/** 대시보드는 LMS에만 있음 */
export const LMS_DASHBOARD = {
  tab: 'dashboard',
  path: '',
  label: '대시보드',
  icon: 'fa-tachometer-alt',
} as const;

/**
 * 통합 성과 관리 하위 메뉴 = LMS 탭 메뉴 (순서 동일)
 * path가 null이거나 onlySidebar면 LMS 탭에는 미표시
 */
export const LMS_MENU_ITEMS: LmsMenuItem[] = [
  { tab: 'students', path: 'students', label: '수강생 관리', icon: 'fa-user-graduate' },
  { tab: 'attendance', path: 'attendance', label: '출석 관리', icon: 'fa-calendar-check' },
  { tab: 'counseling', path: 'counseling', label: '상담일지', icon: 'fa-comments' },
  { tab: 'training-logs', path: 'training-logs', label: '훈련일지', icon: 'fa-book-open' },
  { tab: 'assignments', path: 'assignments', label: '과제 관리', icon: 'fa-tasks' },
  { tab: 'exams', path: 'cbt', label: '시험/평가 및 채점', icon: 'fa-file-contract' },
  { tab: 'grades', path: 'grades', label: '성적 관리', icon: 'fa-chart-line' },
  { tab: 'surveys', path: 'surveys', label: '설문/진단 관리', icon: 'fa-poll-h' },
  { tab: 'ncs', path: 'ncs-eval', label: 'NCS 평가 관리', icon: 'fa-certificate' },
  { tab: 'portfolios', path: null, label: '포트폴리오 관리', icon: 'fa-briefcase', onlySidebar: true },
  { tab: 'employment', path: 'employment', label: '취업 성과 관리', icon: 'fa-user-tie' },
];

/** LMS 탭에 표시할 항목 (대시보드 + path 있는 항목, onlySidebar 제외) */
export function getLmsTabItems(): { tab: string; path: string; label: string; icon: string }[] {
  const dash = { tab: LMS_DASHBOARD.tab, path: LMS_DASHBOARD.path, label: LMS_DASHBOARD.label, icon: LMS_DASHBOARD.icon };
  const rest = LMS_MENU_ITEMS
    .filter((item) => item.path != null && !item.onlySidebar)
    .map((item) => ({ tab: item.tab, path: item.path!, label: item.label, icon: item.icon }));
  return [dash, ...rest];
}

/** 사이드바 통합 성과 관리에 표시할 항목 (전체) */
export function getSidebarPerformanceItems(): LmsMenuItem[] {
  return [...LMS_MENU_ITEMS];
}

/** LMS path → tab (사이드바 활성 메뉴용) */
export function pathToTab(path: string): string {
  if (path === '' || path === 'dashboard') return 'dashboard';
  const item = LMS_MENU_ITEMS.find((m) => m.path === path);
  return item ? item.tab : path;
}
