import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export function educationPerformanceHtml() {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육실적 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
      .year-tab.active { background-color: #4a90e2; color: white; border-color: #4a90e2; }
    </style>
</head>
<body class="bg-gray-50">
    ${navigationHtml('education-performance')}

    <div class="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                <i class="fas fa-chart-line mr-4"></i>
                교육실적
            </h1>
            <p class="text-xl text-blue-100">2015년부터 이어온 다양한 교육 과정</p>
            <p class="mt-4 text-blue-100/90 max-w-2xl mx-auto">와우쓰리디홍대센터는 국비지원, 진로체험, 자격증 과정, 기업·대학 맞춤 교육 등 다양한 프로그램을 진행해 왔습니다.</p>
        </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="loading" class="text-center py-12 text-gray-500">
            <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
            <p>교육실적을 불러오는 중입니다.</p>
        </div>
        <div id="content" class="hidden">
            <div class="mb-6 flex flex-wrap gap-2 justify-center" id="yearTabs"></div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ul id="performanceList" class="divide-y divide-gray-100"></ul>
                <div id="emptyYear" class="hidden px-6 py-12 text-center text-gray-400">해당 연도의 실적이 없습니다.</div>
            </div>
        </div>
        <div id="error" class="hidden text-center py-12 text-red-500">
            <i class="fas fa-exclamation-circle text-3xl mb-4"></i>
            <p>교육실적을 불러올 수 없습니다.</p>
        </div>
    </div>

    ${footerHtml()}

    <script>
(function() {
    var all = [];
    var byYear = {};
    function extractYear(performedAt) {
        if (!performedAt || typeof performedAt !== 'string') return null;
        var m = performedAt.trim().match(/^(\\d{4})/);
        return m ? parseInt(m[1], 10) : null;
    }
    function load() {
        fetch('/api/education-performance')
            .then(function(r) { return r.json(); })
            .then(function(res) {
                document.getElementById('loading').classList.add('hidden');
                if (!res.success || !res.data) {
                    document.getElementById('error').classList.remove('hidden');
                    return;
                }
                all = res.data;
                byYear = {};
                all.forEach(function(item) {
                    var y = extractYear(item.performed_at);
                    if (y) {
                        if (!byYear[y]) byYear[y] = [];
                        byYear[y].push(item);
                    }
                });
                var years = Object.keys(byYear).map(Number).sort(function(a,b) { return b - a; });
                if (years.length === 0) {
                    document.getElementById('content').classList.remove('hidden');
                    document.getElementById('performanceList').innerHTML = '';
                    document.getElementById('emptyYear').classList.remove('hidden');
                    return;
                }
                document.getElementById('content').classList.remove('hidden');
                document.getElementById('emptyYear').classList.add('hidden');
                renderTabs(years);
                var firstYear = years[0];
                renderList(firstYear);
                document.querySelectorAll('.year-tab').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var y = parseInt(this.getAttribute('data-year'), 10);
                        document.querySelectorAll('.year-tab').forEach(function(b) { b.classList.remove('active'); });
                        this.classList.add('active');
                        renderList(y);
                    });
                });
            })
            .catch(function() {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
            });
    }
    function renderTabs(years) {
        var html = years.map(function(y) {
            return '<button type="button" class="year-tab px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 ' + (years.indexOf(y) === 0 ? 'active' : '') + '" data-year="' + y + '">' + y + '년</button>';
        }).join('');
        document.getElementById('yearTabs').innerHTML = html;
    }
    function escapeHtml(s) {
        if (!s) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function renderList(year) {
        var list = byYear[year] || [];
        var ul = document.getElementById('performanceList');
        var empty = document.getElementById('emptyYear');
        if (list.length === 0) {
            ul.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }
        empty.classList.add('hidden');
        ul.innerHTML = list.map(function(item) {
            var date = escapeHtml(item.performed_at);
            var title = escapeHtml(item.title);
            var cat = item.category ? '<span class="text-xs text-gray-500 ml-2">' + escapeHtml(item.category) + '</span>' : '';
            return '<li class="px-6 py-4 hover:bg-gray-50 flex flex-wrap items-baseline gap-2"><span class="text-sm font-medium text-primary-600 shrink-0">' + date + '</span><span class="text-gray-800">' + title + '</span>' + cat + '</li>';
        }).join('');
    }
    document.addEventListener('DOMContentLoaded', load);
})();
    </script>
</body>
</html>
`;
}
