/**
 * LMS 과정 내 NCS 본평가 하위 탭 (평가계획 · 평가실행 · 평가결과)
 * 강사/관리자 `/.../courses/:id/lms/ncs-eval-*` 페이지에서 공통 사용.
 */
export function lmsNcsSubnavTabsHtml(active: 'plan' | 'exec' | 'result'): string {
  const item = (key: 'plan' | 'exec' | 'result', label: string, icon: string) => {
    const isOn = active === key;
    return `<a id="lms-ncs-tab-${key}" href="#" class="lms-ncs-subtab inline-flex items-center gap-2 px-4 sm:px-5 py-3 text-[13px] sm:text-sm font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
      isOn
        ? 'border-indigo-600 text-indigo-700 bg-indigo-50/60'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/90'
    }"><i class="fas ${icon} text-[13px] opacity-90"></i>${label}</a>`;
  };

  return `
    <nav class="bg-slate-50/90 border-b border-slate-200/80 shadow-sm" aria-label="NCS 본평가 하위 메뉴">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap gap-0" role="tablist">
          ${item('plan', '평가계획', 'fa-clipboard-list')}
          ${item('exec', '평가실행', 'fa-play-circle')}
          ${item('result', '평가결과', 'fa-poll')}
        </div>
      </div>
    </nav>
    <script>
    (function(){
      function lmsNcsSubnavQuery() {
        try {
          var params = new URLSearchParams(window.location.search);
          if (!params.get('type') && window.location.pathname.indexOf('/lms') !== -1) {
            params.set('type', 'hrd');
          }
          var s = params.toString();
          return s ? '?' + s : '';
        } catch (e) {
          return window.location.search || '?type=hrd';
        }
      }
      function setLmsNcsSubnavHrefs() {
        var pathParts = window.location.pathname.split('/');
        var ix = pathParts.indexOf('courses');
        if (ix < 0) return;
        var courseId = pathParts[ix + 1];
        if (!courseId) return;
        var isAdmin = window.location.pathname.indexOf('/admin') === 0;
        var base = (isAdmin ? '/admin/courses/' : '/teacher/courses/') + courseId + '/lms/';
        var q = lmsNcsSubnavQuery();
        var ids = ['plan', 'exec', 'result'];
        var paths = ['ncs-eval-plan', 'ncs-eval-exec', 'ncs-eval-result'];
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById('lms-ncs-tab-' + ids[i]);
          if (el) el.setAttribute('href', base + paths[i] + q);
        }
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setLmsNcsSubnavHrefs);
      } else {
        setLmsNcsSubnavHrefs();
      }
    })();
    </script>
  `;
}
