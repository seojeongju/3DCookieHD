
import { navigationHtml } from './navigation';
import { footerHtml } from '../footer';

export const layoutHtml = (title: string, content: string, activeMenu = '', headExtra = '') => {
    const hasPageSeo = /rel=["']canonical["']/.test(headExtra);
    const defaultMeta = hasPageSeo
        ? ''
        : `<title>${title} - 와우쓰리디홍대센터</title>
    <meta name="description" content="4차산업 3D프린팅 교육 전문. 와우쓰리디홍대센터에서 3D 모델링·프린팅 국비지원 과정, 실무 교육, NCS 기반 커리큘럼을 만나보세요. 홍대·구미·전주.">
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
