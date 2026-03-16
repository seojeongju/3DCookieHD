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
      .year-tab {
        transition: all 0.2s ease;
      }
      .year-tab:hover {
        transform: translateY(-1px);
      }
      .year-tab.active {
        background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        color: white;
        border-color: transparent;
        box-shadow: 0 4px 14px rgba(74, 144, 226, 0.35);
      }
      .perf-item {
        transition: background 0.2s ease, transform 0.15s ease;
      }
      .perf-item:hover {
        background: linear-gradient(90deg, rgba(74, 144, 226, 0.06) 0%, transparent 100%);
      }
      .perf-item:hover .perf-date-badge {
        background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        color: white;
        border-color: transparent;
      }
      .perf-date-badge {
        transition: all 0.2s ease;
      }
      .dot-grid-bg {
        background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
        background-size: 20px 20px;
      }
      .hero-pattern {
        background-image: linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%),
          linear-gradient(225deg, rgba(255,255,255,0.08) 25%, transparent 25%);
        background-size: 24px 24px;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .perf-item {
        animation: fadeInUp 0.35s ease forwards;
      }
      .stats-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .stats-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
      }
    </style>
</head>
<body class="bg-slate-50 text-slate-800">
    ${navigationHtml('education-performance')}

    <!-- Hero -->
    <div class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white py-20 overflow-hidden">
        <div class="hero-pattern absolute inset-0 opacity-50"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-primary-200 text-sm font-semibold tracking-widest uppercase mb-3">Educational Performance</p>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5">
                교육실적
            </h1>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                2015년부터 이어온 국비지원, 진로체험, 자격증·기업·대학 맞춤 교육까지<br class="hidden sm:inline"> 다양한 프로그램 실적을 소개합니다.
            </p>
        </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 dot-grid-bg min-h-[50vh]">
        <div id="loading" class="text-center py-20">
            <div class="inline-flex flex-col items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-center">
                    <i class="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
                </div>
                <p class="text-slate-500 font-medium">교육실적을 불러오는 중입니다.</p>
            </div>
        </div>

        <div id="content" class="hidden">
            <!-- Stats -->
            <div id="statsRow" class="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-10">
                <div class="stats-card col-span-2 sm:flex-1 min-w-[140px] bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">총 실적</p>
                    <p id="statTotal" class="text-2xl font-black text-slate-800">0</p>
                    <p class="text-sm text-slate-500 mt-0.5">건</p>
                </div>
                <div class="stats-card sm:flex-1 min-w-[140px] bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">기간</p>
                    <p id="statRange" class="text-xl font-black text-primary-600">-</p>
                </div>
            </div>

            <!-- Year tabs -->
            <div class="mb-8">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">연도별 보기</p>
                <div id="yearTabs" class="flex flex-wrap gap-2 sm:gap-3"></div>
            </div>

            <!-- List container -->
            <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                <ul id="performanceList" class="divide-y divide-slate-100"></ul>
                <div id="emptyYear" class="hidden px-8 py-16 text-center">
                    <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-calendar-day text-2xl text-slate-400"></i>
                    </div>
                    <p class="text-slate-500 font-medium">해당 연도의 실적이 없습니다.</p>
                </div>
            </div>
        </div>

        <div id="error" class="hidden text-center py-20">
            <div class="inline-flex flex-col items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                    <i class="fas fa-exclamation-circle text-2xl text-red-400"></i>
                </div>
                <p class="text-slate-600 font-medium">교육실적을 불러올 수 없습니다.</p>
                <p class="text-sm text-slate-500">잠시 후 다시 시도해 주세요.</p>
            </div>
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
                    document.getElementById('statTotal').textContent = '0';
                    document.getElementById('statRange').textContent = '-';
                    return;
                }
                document.getElementById('content').classList.remove('hidden');
                document.getElementById('emptyYear').classList.add('hidden');
                document.getElementById('statTotal').textContent = all.length;
                document.getElementById('statRange').textContent = Math.min.apply(null, years) + ' ~ ' + Math.max.apply(null, years);
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
            var count = byYear[y] ? byYear[y].length : 0;
            var isFirst = years.indexOf(y) === 0;
            return '<button type="button" class="year-tab px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600 ' + (isFirst ? 'active' : '') + '" data-year="' + y + '">' + y + '년 <span class="opacity-70 font-normal ml-1">' + count + '</span></button>';
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
        ul.innerHTML = list.map(function(item, idx) {
            var date = escapeHtml(item.performed_at);
            var title = escapeHtml(item.title);
            var cat = item.category ? '<span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-500">' + escapeHtml(item.category) + '</span>' : '';
            return '<li class="perf-item flex flex-wrap sm:flex-nowrap gap-3 sm:gap-5 px-6 sm:px-8 py-4 sm:py-5" style="animation-delay: ' + (idx * 20) + 'ms">' +
                '<span class="perf-date-badge shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 bg-primary-50 border border-primary-200/80 rounded-xl px-3 py-1.5">' +
                '<i class="fas fa-calendar-minus text-[10px]"></i>' + date + '</span>' +
                '<div class="flex-1 min-w-0">' +
                '<p class="text-slate-800 font-medium leading-snug">' + title + '</p>' +
                (cat ? '<div class="mt-2">' + cat + '</div>' : '') +
                '</div></li>';
        }).join('');
    }
    document.addEventListener('DOMContentLoaded', load);
})();
    </script>
</body>
</html>
`;
}
