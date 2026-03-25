import { hrdSidebar } from './components/hrd_sidebar';

/** HRD: 과정(LMS 연동 ID) 선택 후 LMS 통합현황 대시보드로 이동 */
export const adminNcsEvalDashboardHubHtml = (sidebar = hrdSidebar('ncs-eval-dashboard-hub')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 본평가 과정별 통합현황 - 교육행정</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50">
  <div class="flex min-h-screen">
    ${sidebar}
    <div class="flex-1 overflow-y-auto">
      <header class="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div class="px-6 py-5 max-w-5xl mx-auto">
          <h1 class="text-2xl font-black text-slate-900">NCS 본평가 · 과정별 통합현황</h1>
          <p class="text-sm text-slate-600 mt-1">개설 과정을 선택하면 <strong>차수별 계획·문항·실행·결과</strong>를 한 화면에서 확인하는 LMS 통합현황으로 이동합니다.</p>
          <nav class="flex flex-wrap gap-2 mt-4 text-xs font-bold">
            <a href="/admin/ncs-eval-plan" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">NCS평가계획(전역)</a>
            <a href="/admin/ncs-eval-exec" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">NCS평가실행</a>
            <a href="/admin/ncs-eval-result" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">NCS평가결과</a>
            <a href="/admin/ncs-eval" class="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100">종합 NCS 평가 현황</a>
          </nav>
        </div>
      </header>
      <main class="p-6 max-w-5xl mx-auto">
        <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 mb-6">
          <i class="fas fa-circle-info mr-1"></i>
          HRD 메뉴의 <strong>NCS평가계획</strong>은 과정을 고르지 않는 <strong>전역 문서</strong> 화면입니다. 통합현황 표는 <strong>과정(회차) ID</strong>가 필요하므로 아래에서 과정을 고른 뒤 이동해 주세요.
        </div>
        <div id="hubLoading" class="text-sm text-slate-500 py-10 text-center">목록을 불러오는 중…</div>
        <div id="hubTableWrap" class="hidden bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="px-4 py-3">과정</th>
                <th class="px-4 py-3">담당</th>
                <th class="px-4 py-3 text-right">이동</th>
              </tr>
            </thead>
            <tbody id="hubBody" class="divide-y divide-slate-100"></tbody>
          </table>
        </div>
        <p id="hubError" class="hidden text-sm text-rose-600 py-6"></p>
      </main>
    </div>
  </div>
  <script>
    (function() {
      var token = localStorage.getItem('token');
      function esc(s) {
        return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }
      async function load() {
        var loading = document.getElementById('hubLoading');
        var wrap = document.getElementById('hubTableWrap');
        var body = document.getElementById('hubBody');
        var errEl = document.getElementById('hubError');
        try {
          var res = await fetch('/api/hrd/ncs-eval/summary', {
            headers: { 'Authorization': 'Bearer ' + (token || '') }
          });
          var json = await res.json();
          if (!json || !json.success) {
            if (loading) loading.classList.add('hidden');
            if (errEl) { errEl.textContent = (json && json.error) ? json.error : '목록을 불러오지 못했습니다.'; errEl.classList.remove('hidden'); }
            return;
          }
          var rows = Array.isArray(json.data) ? json.data : [];
          if (loading) loading.classList.add('hidden');
          if (!rows.length) {
            if (body) body.innerHTML = '<tr><td colspan="3" class="px-4 py-10 text-center text-slate-400">표시할 과정이 없습니다.</td></tr>';
            if (wrap) wrap.classList.remove('hidden');
            return;
          }
          if (body) {
            body.innerHTML = rows.map(function(c) {
              var id = c.id;
              var href = '/admin/courses/' + encodeURIComponent(id) + '/lms/ncs-eval-dashboard?type=hrd';
              return '<tr class="hover:bg-slate-50">' +
                '<td class="px-4 py-3 font-semibold text-slate-800">' + esc(c.title) + '</td>' +
                '<td class="px-4 py-3 text-slate-600">' + esc(c.teacher_name || '-') + '</td>' +
                '<td class="px-4 py-3 text-right">' +
                '<a href="' + href + '" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700">통합현황 열기</a>' +
                '</td></tr>';
            }).join('');
          }
          if (wrap) wrap.classList.remove('hidden');
        } catch (e) {
          console.error(e);
          if (loading) loading.classList.add('hidden');
          if (errEl) { errEl.textContent = '오류가 발생했습니다.'; errEl.classList.remove('hidden'); }
        }
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
      else load();
    })();
  </script>
</body>
</html>
`;
