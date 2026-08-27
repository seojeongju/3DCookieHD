import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export type PortfolioDetailSsr = {
  title: string;
  summary: string;
  studentName?: string;
  courseTitle?: string;
};

function escapeHtmlText(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const portfolioDetailHtml = (id: string, ssr?: PortfolioDetailSsr) => {
  const title = escapeHtmlText(ssr?.title || `수강생 포트폴리오 ${id}`);
  const summary = escapeHtmlText(
    ssr?.summary ||
      '와우쓰리디 교육생의 3D모델링·3D프린팅 작품입니다. 수강 과정에서 완성한 포트폴리오를 소개합니다.',
  );
  const student = escapeHtmlText(ssr?.studentName || '수강생');
  const course = escapeHtmlText(ssr?.courseTitle || '');

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 와우쓰리디홍대센터</title>
  <meta name="description" content="${summary}">
  <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  </head>
<body class="bg-gray-50 flex flex-col min-h-screen">
  ${navigationHtml('portfolios')}

  <main class="flex-1">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center justify-between gap-3 mb-6">
        <a href="/portfolios" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50">
          <i class="fas fa-arrow-left"></i> 목록으로
        </a>
        <a id="externalLinkTop" href="#" target="_blank" class="hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white font-black hover:bg-black">
          보러가기 <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>

      <div id="ssrPortfolio" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
        <p class="text-xs font-black uppercase tracking-wider text-primary-600 mb-2">수강생 포트폴리오</p>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-3">${title}</h1>
        <p class="text-slate-600 leading-relaxed mb-3">${summary}</p>
        <p class="text-sm font-bold text-slate-500">${student}${course ? ' · ' + course : ''}</p>
      </div>

      <div id="detailLoading" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-300 mb-4"></i>
        <p class="font-bold">포트폴리오를 불러오는 중입니다…</p>
      </div>

      <div id="detailError" class="hidden bg-white rounded-3xl border border-rose-100 shadow-sm p-10 text-center text-rose-600 font-bold"></div>

      <article id="detailRoot" class="hidden bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="relative">
          <img id="detailThumbnail" src="" alt="" class="w-full max-h-[520px] object-cover bg-gray-100">
          <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
            <span id="detailCategory" class="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-[0.2em] mb-4 inline-block">CATEGORY</span>
            <p id="detailTitle" class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">TITLE</p>
            <p class="mt-2 text-sm text-gray-500 font-bold" id="detailMeta"></p>
          </div>
        </div>

        <div class="p-6 sm:p-10">
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <section>
              <h2 class="text-[11px] font-black text-primary-600 uppercase tracking-[0.3em] mb-5 flex items-center">
                <span class="w-8 h-px bg-primary-200 mr-4"></span> Project Overview
              </h2>
              <div id="detailDescription" class="prose max-w-none prose-img:rounded-2xl prose-a:text-primary-700"></div>
            </section>
            <aside class="space-y-4">
              <div class="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-500 font-bold text-lg" id="detailStudentInitial">S</div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Creator</p>
                    <p class="text-base font-black text-gray-800 truncate" id="detailStudentName">-</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-300 text-lg"><i class="fas fa-graduation-cap"></i></div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Course</p>
                    <p class="text-sm font-bold text-gray-700 truncate" id="detailCourseTitle">-</p>
                  </div>
                </div>
              </div>
              <a id="externalLink" href="#" target="_blank" class="hidden w-full py-4 bg-gray-900 text-white font-black rounded-[1.5rem] hover:bg-black transition-all text-center flex items-center justify-center gap-3 shadow-xl">
                보러가기 <i class="fas fa-arrow-right text-xs"></i>
              </a>
            </aside>
          </div>
        </div>
      </article>
    </div>
  </main>

  ${footerHtml()}

  <script>
    (function() {
      var id = ${JSON.stringify(id || '')};
      var loading = document.getElementById('detailLoading');
      var errorEl = document.getElementById('detailError');
      var root = document.getElementById('detailRoot');
      var ssrEl = document.getElementById('ssrPortfolio');

      function esc(s) {
        return String(s || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      async function load() {
        try {
          var res = await fetch('/api/portfolios/' + encodeURIComponent(id));
          var json = await res.json();
          if (!json || !json.success || !json.data) throw new Error((json && json.error) ? String(json.error) : '불러오기에 실패했습니다.');

          var p = json.data;
          var thumb = (p.thumbnail_url || '').trim() || (p.images && p.images.length ? p.images[0] : '') || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=1200';

          document.title = (p.title ? (p.title + ' (#' + id + ') | ') : '') + (p.student_name || p.author_name || '수강생') + ' 3D프린팅 포트폴리오';

          var catEl = document.getElementById('detailCategory');
          var titleEl = document.getElementById('detailTitle');
          var metaEl = document.getElementById('detailMeta');
          var imgEl = document.getElementById('detailThumbnail');
          var descEl = document.getElementById('detailDescription');
          var sNameEl = document.getElementById('detailStudentName');
          var sInitEl = document.getElementById('detailStudentInitial');
          var courseEl = document.getElementById('detailCourseTitle');

          if (imgEl) imgEl.src = thumb;
          if (catEl) catEl.textContent = String(p.category || 'other');
          if (titleEl) titleEl.textContent = String(p.title || '');

          var created = p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR') : '';
          var author = p.student_name || p.author_name || '수강생';
          if (metaEl) metaEl.textContent = (created ? ('작성일 ' + created) : '') + (author ? (created ? (' · ' + author) : author) : '');

          if (descEl) descEl.innerHTML = p.description || '';
          if (sNameEl) sNameEl.textContent = author;
          if (sInitEl) sInitEl.textContent = String(author || 'U').slice(0, 1);
          if (courseEl) courseEl.textContent = p.course_title || '일반 참여';

          var link = (p.content_url || '').trim();
          var linkBtn = document.getElementById('externalLink');
          var linkTop = document.getElementById('externalLinkTop');
          if (link) {
            if (linkBtn) { linkBtn.href = link; linkBtn.classList.remove('hidden'); }
            if (linkTop) { linkTop.href = link; linkTop.classList.remove('hidden'); }
          }

          if (ssrEl) ssrEl.classList.add('hidden');
          if (loading) loading.classList.add('hidden');
          if (root) root.classList.remove('hidden');
        } catch (e) {
          console.error(e);
          if (loading) loading.classList.add('hidden');
          if (errorEl) {
            errorEl.textContent = (e && e.message) ? String(e.message) : '오류가 발생했습니다.';
            errorEl.classList.remove('hidden');
          }
        }
      }

      if (!id) {
        if (loading) loading.classList.add('hidden');
        if (errorEl) {
          errorEl.textContent = '잘못된 접근입니다.';
          errorEl.classList.remove('hidden');
        }
        return;
      }

      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
      else load();
    })();
  </script>
</body>
</html>
`;
};
