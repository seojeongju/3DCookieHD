import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

/** 공개 페이지용 HTML 404 (소프트 404 방지 · noindex) */
export function publicNotFoundHtml(message = '요청하신 페이지를 찾을 수 없습니다.', backHref = '/') {
  const safeMsg = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeBack = String(backHref).replace(/"/g, '&quot;');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>페이지를 찾을 수 없습니다 - 와우쓰리디홍대센터</title>
  <meta name="description" content="요청하신 페이지를 찾을 수 없습니다. 와우쓰리디홍대센터 홈으로 이동해 주세요.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://3dcookiehd.com/">
  <link rel="stylesheet" href="/static/tailwind-app.css">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 font-sans text-slate-900">
  ${navigationHtml()}
  <main class="max-w-3xl mx-auto px-4 py-20 text-center">
    <p class="text-6xl font-black text-slate-300 mb-4">404</p>
    <h1 class="text-2xl font-black tracking-tight mb-3">페이지를 찾을 수 없습니다</h1>
    <p class="text-slate-600 mb-8">${safeMsg}</p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="${safeBack}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700">돌아가기</a>
      <a href="/" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100">홈</a>
      <a href="/course-sessions" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100">과정 안내</a>
    </div>
  </main>
  ${footerHtml()}
</body>
</html>`;
}
