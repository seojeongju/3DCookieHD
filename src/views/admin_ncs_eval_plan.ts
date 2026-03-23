import { hrdSidebar } from './components/hrd_sidebar';
import { lmsHeaderHtml } from './components/lms_header';

const NCS_PLAN_TAB_ITEMS = [
  { id: 'minutes', label: '평가계획회의록', icon: 'fa-clipboard' },
  { id: 'schedule', label: '평가실시일자', icon: 'fa-calendar-check' },
  { id: 'questions', label: '평가문항제작', icon: 'fa-list-check' },
  { id: 'tools', label: '평가도구제작', icon: 'fa-screwdriver-wrench' },
  { id: 'rubric', label: '평가도구채점기준표', icon: 'fa-table-list' },
  { id: 'achievement', label: '평가성취수준기준표', icon: 'fa-chart-column' },
  { id: 'review', label: '평가도구검토', icon: 'fa-magnifying-glass-chart' },
] as const;

function ncsPlanTabsHtml(prefix: string) {
  const nav = NCS_PLAN_TAB_ITEMS.map((item, idx) => `
      <button type="button"
        data-plan-tab-btn="${prefix}-${item.id}"
        onclick="switchNcsPlanTab('${prefix}-${item.id}')"
        class="px-4 py-2.5 rounded-xl border text-sm font-bold transition ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
        <i class="fas ${item.icon} mr-1.5"></i>${item.label}
      </button>
  `).join('');

  const panels = NCS_PLAN_TAB_ITEMS.map((item, idx) => `
      <section data-plan-tab-panel="${prefix}-${item.id}" class="${idx === 0 ? '' : 'hidden'}">
          <div class="rounded-[2rem] border border-slate-200/60 shadow-sm bg-white p-6">
              <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-black text-slate-900 tracking-tight">${item.label}</h3>
                  <span class="text-xs font-bold text-slate-400">NCS평가계획</span>
              </div>
              <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p class="text-sm font-semibold text-slate-600">${item.label} 섹션입니다.</p>
                  <p class="text-xs text-slate-500 mt-2">요청하신 탭 구조를 우선 생성했습니다. 세부 입력 폼/저장 API는 다음 단계에서 연결할 수 있습니다.</p>
              </div>
          </div>
      </section>
  `).join('');

  return `
    <div class="rounded-[2rem] border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-md p-4">
        <div class="flex flex-wrap gap-2">
            ${nav}
        </div>
    </div>
    <div class="space-y-4 mt-4">
        ${panels}
    </div>
  `;
}

function ncsPlanTabScript() {
  return `
  <script>
    function switchNcsPlanTab(tabId) {
      document.querySelectorAll('[data-plan-tab-btn]').forEach(function(btn) {
        const isActive = btn.getAttribute('data-plan-tab-btn') === tabId;
        btn.classList.toggle('bg-slate-900', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('border-slate-900', isActive);
        btn.classList.toggle('bg-white', !isActive);
        btn.classList.toggle('text-slate-600', !isActive);
        btn.classList.toggle('border-slate-200', !isActive);
      });
      document.querySelectorAll('[data-plan-tab-panel]').forEach(function(panel) {
        panel.classList.toggle('hidden', panel.getAttribute('data-plan-tab-panel') !== tabId);
      });
    }
  </script>
  `;
}

export const adminNcsEvalPlanHtml = (sidebar = hrdSidebar('ncs-eval-plan')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS평가계획 - 교육행정 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div class="px-6 py-5">
          <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS평가계획</h1>
          <p class="text-sm text-slate-500 mt-1">본평가 준비를 위한 회의록/일정/문항/도구 관련 문서를 탭별로 관리합니다.</p>
        </div>
      </header>
      <main class="p-6">
        ${ncsPlanTabsHtml('admin-ncs-plan')}
      </main>
    </div>
  </div>
  ${ncsPlanTabScript()}
</body>
</html>
`;

export const adminLmsNcsEvalPlanHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LMS NCS평가계획</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      ${lmsHeaderHtml('ncs-eval', 'hrd')}
      <section class="px-6 py-6 border-b border-slate-200/60 bg-white">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">NCS평가계획</h2>
        <p class="text-sm text-slate-500 mt-1">LMS 과정 단위에서 NCS 본평가 계획 문서를 탭으로 구분해 관리합니다.</p>
      </section>
      <main class="p-6">
        ${ncsPlanTabsHtml('lms-ncs-plan')}
      </main>
    </div>
  </div>
  ${ncsPlanTabScript()}
</body>
</html>
`;
