import { hrdSidebar } from './components/hrd_sidebar';

export const adminNcsEvalExecHtml = (sidebar = hrdSidebar('ncs-eval-exec')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS 평가실행 - 교육행정 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shrink-0">
        <div class="px-6 py-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS 평가실행</h1>
              <p class="text-sm text-slate-500 mt-1">1차(본평가) / 2차(재평가) / 3차(재평가) 탭으로 차수를 선택합니다.</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
            <div class="flex flex-col sm:flex-row sm:items-end gap-4">
              <div class="flex-1">
                <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">평가할 과정 선택 *</label>
                <select id="ncsExecCourseSelect" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none text-sm bg-white">
                  <option value="">과정 선택</option>
                </select>
                <p class="text-[11px] text-slate-500 mt-2">과정을 선택한 뒤 탭을 누르면 해당 과정의 실행 페이지로 이동합니다.</p>
              </div>

              <div class="sm:w-[280px]">
                <label class="block text-xs font-black text-sky-600 uppercase tracking-widest mb-2">차수 선택</label>
                <div id="ncsExecRoundTabs" class="flex flex-wrap gap-2">
                  <button type="button" data-round="1" class="ncs-exec-round-btn px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition">
                    1차평가(본평가)
                  </button>
                  <button type="button" data-round="2" class="ncs-exec-round-btn px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">
                    2차평가(재평가)
                  </button>
                  <button type="button" data-round="3" class="ncs-exec-round-btn px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 transition">
                    3차평가(재평가)
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-5">
            <h2 class="text-lg font-black text-slate-900">이동 안내</h2>
            <p class="text-sm text-slate-600 mt-2">
              위에서 과정 선택 후 차수 탭을 누르면
              <span class="font-bold">/admin/courses/:id/lms/ncs-eval-exec</span>
              페이지로 이동합니다. 그 페이지에서 계획 목록과 수강생 결과 입력/저장이 가능합니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  </div>

  <script>
    function setActiveRoundUI(round) {
      document.querySelectorAll('.ncs-exec-round-btn').forEach(btn => {
        const r = parseInt(btn.dataset.round || '1', 10);
        const active = r === round;
        btn.classList.toggle('bg-slate-900', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('hover:bg-slate-800', active);
        btn.classList.toggle('bg-white', !active);
        btn.classList.toggle('text-slate-700', !active);
      });
    }

    async function loadCourseOptions() {
      const sel = document.getElementById('ncsExecCourseSelect');
      if (!sel) return;
      try {
        const res = await fetch('/api/courses?limit=500&page=1');
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json?.results) ? json.results : []);
        const opts = list.filter(c => c && c.id != null).map(c => {
          const st = c.status || '';
          const title = c.title || c.name || '과정';
          return { id: c.id, text: '[' + c.id + '] ' + title + (st ? ' (' + st + ')' : '') };
        });
        opts.forEach(o => {
          const opt = document.createElement('option');
          opt.value = String(o.id);
          opt.textContent = o.text;
          sel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    function redirectToExec(courseId, round) {
      const url = new URL(window.location.href);
      url.pathname = '/admin/courses/' + courseId + '/lms/ncs-eval-exec';
      url.searchParams.set('evaluation_round', String(round));
      window.location.href = url.toString();
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadCourseOptions();

      const params = new URLSearchParams(window.location.search);
      const roundRaw = params.get('evaluation_round');
      const round = roundRaw ? parseInt(roundRaw, 10) : 1;
      setActiveRoundUI(round);

      document.querySelectorAll('.ncs-exec-round-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedRound = parseInt(btn.dataset.round || '1', 10);
          setActiveRoundUI(selectedRound);
          const courseId = document.getElementById('ncsExecCourseSelect').value;
          if (!courseId) {
            alert('먼저 과정을 선택해 주세요.');
            return;
          }
          redirectToExec(courseId, selectedRound);
        });
      });

      const sel = document.getElementById('ncsExecCourseSelect');
      if (sel) {
        sel.addEventListener('change', () => {
          const courseId = sel.value;
          if (!courseId) return;
          // 현재 활성 라운드로 바로 이동
          const activeBtn = document.querySelector('.ncs-exec-round-btn.bg-slate-900');
          const activeRound = activeBtn ? parseInt(activeBtn.dataset.round || '1', 10) : 1;
          redirectToExec(courseId, activeRound);
        });
      }
    });
  </script>
</body>
</html>
`;

