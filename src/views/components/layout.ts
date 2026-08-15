
import { navigationHtml } from './navigation';
import { footerHtml } from '../footer';

export const layoutHtml = (title: string, content: string, activeMenu = '', headExtra = '') => {
    const hasPageSeo = /rel=["']canonical["']/.test(headExtra);
    const defaultMeta = hasPageSeo
        ? ''
        : `<title>${title} - 와우쓰리디홍대센터</title>
    <meta name="description" content="${title} 페이지. 와우쓰리디홍대센터 3D프린팅 국비지원·실무 교육을 안내합니다.">
    <meta name="keywords" content="와우쓰리디, 3D프린팅, 3D모델링, 국비지원교육, NCS, 홍대교육, 구미교육, 전주교육, 4차산업, 직업훈련">`;
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    ${defaultMeta}
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/style.css" rel="stylesheet">
    ${headExtra}
</head>
<body class="bg-gray-50 overflow-x-hidden min-h-[100dvh] antialiased">
    ${navigationHtml(activeMenu)}
    <main>
        ${content}
    </main>
    ${footerHtml()}
</body>
</html>
`;
};
