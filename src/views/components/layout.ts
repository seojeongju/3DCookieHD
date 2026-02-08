
import { navigationHtml } from './navigation';
import { footerHtml } from '../footer';

export const layoutHtml = (title: string, content: string, activeMenu = '', headExtra = '') => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/style.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#3b7bc9', 800: '#2d5fa3', 900: '#1e4175',
              }
            }
          }
        }
      }
    </script>
    ${headExtra}
</head>
<body class="bg-gray-50 overflow-x-hidden">
    ${navigationHtml(activeMenu)}
    <main>
        ${content}
    </main>
    ${footerHtml()}
</body>
</html>
`;
