/**
 * 사이트 접속정보 페이지 (관리자 전용)
 * /api/analytics/access-stats 기반 페이지뷰·순 방문자, 일별 추이, 역할/시간대/요일별, 인기 페이지, 유입 경로
 */
import { hrdSidebar } from './components/hrd_sidebar';

export const adminAnalyticsHtml = (sidebar = hrdSidebar('analytics')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사이트 접속정보 - 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">사이트 접속정보</h1>
                            <p class="text-gray-500 mt-1 text-sm">사용자·페이지 접속 현황 및 통계를 확인합니다.</p>
                        </div>
                        <button onclick="loadAccessStats()" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">
                    <!-- 기간 필터 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-4">
                        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">기간</span>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" onclick="setPeriod('today')" class="px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition">오늘</button>
                            <button type="button" onclick="setPeriod('week')" class="px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition">최근 7일</button>
                            <button type="button" onclick="setPeriod('month')" class="px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition">이번 달</button>
                            <button type="button" onclick="setPeriod('clear')" class="px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition">기간 해제</button>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <input type="date" id="filterFrom" class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                            <span class="text-gray-400">~</span>
                            <input type="date" id="filterTo" class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                            <button type="button" onclick="loadAccessStats()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">조회</button>
                        </div>
                        <span id="rangeLabel" class="text-xs text-gray-400 hidden"></span>
                    </div>

                    <!-- 요약 카드: 기본(오늘/주간/월간) -->
                    <div id="defaultCards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">오늘 페이지뷰</div>
                            <div class="text-2xl font-black text-gray-800" id="stat-today-pv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">오늘 순 방문자</div>
                            <div class="text-2xl font-black text-indigo-600" id="stat-today-uv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">최근 7일 페이지뷰</div>
                            <div class="text-2xl font-black text-gray-800" id="stat-week-pv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">최근 7일 순 방문자</div>
                            <div class="text-2xl font-black text-indigo-600" id="stat-week-uv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">이번 달 페이지뷰</div>
                            <div class="text-2xl font-black text-gray-800" id="stat-month-pv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">이번 달 순 방문자</div>
                            <div class="text-2xl font-black text-indigo-600" id="stat-month-uv">-</div>
                        </div>
                    </div>
                    <!-- 요약 카드: 선택 기간 (기간 필터 사용 시) -->
                    <div id="rangeCards" class="hidden grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100">
                            <div class="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">선택 기간 페이지뷰</div>
                            <div class="text-2xl font-black text-gray-800" id="stat-range-pv">-</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100">
                            <div class="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">선택 기간 순 방문자</div>
                            <div class="text-2xl font-black text-indigo-600" id="stat-range-uv">-</div>
                        </div>
                    </div>

                    <!-- 일별 추이 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight" id="dailyTrendTitle">일별 접속 추이 (최근 7일)</h3>
                        <div class="h-72">
                            <canvas id="dailyTrendChart"></canvas>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight" id="byHourTitle">시간대별 접속 (0~23시)</h3>
                            <div class="h-64">
                                <canvas id="byHourChart"></canvas>
                            </div>
                        </div>
                        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight" id="byDayOfWeekTitle">요일별 접속 (일~토)</h3>
                            <div class="h-64">
                                <canvas id="byDayOfWeekChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight" id="byRoleTitle">역할별 접속</h3>
                        <div id="byRoleList" class="flex flex-wrap gap-3">
                            <span class="text-gray-400">로딩 중...</span>
                        </div>
                    </div>

                    <!-- 인기 페이지 TOP 20 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-8 py-6 border-b border-gray-50">
                            <h3 class="text-lg font-black text-gray-800 tracking-tight">인기 페이지 TOP 20</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50">
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">순위</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">경로</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">페이지뷰</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">순 방문자</th>
                                    </tr>
                                </thead>
                                <tbody id="topPagesBody" class="divide-y divide-gray-50">
                                    <tr><td colspan="4" class="px-6 py-8 text-center text-gray-400">데이터를 불러오고 있습니다...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 유입 경로 상위 10 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight">유입 경로 상위 10</h3>
                        <ul id="topReferrersList" class="space-y-2 text-sm text-gray-600">
                            <li class="text-gray-400">로딩 중...</li>
                        </ul>
                    </div>

                    <!-- 접속 사용자 (사용자 ID·IP 구분) -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-8 py-6 border-b border-gray-50">
                            <h3 class="text-lg font-black text-gray-800 tracking-tight">접속 사용자</h3>
                            <p class="text-sm text-gray-500 mt-1">사용자 ID(로그인) 또는 IP 주소(비로그인)별 접속 현황. 기간 필터와 동일하게 적용됩니다.</p>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50">
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">구분</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">사용자 / IP 주소</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">역할</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">페이지뷰</th>
                                        <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">마지막 접속</th>
                                    </tr>
                                </thead>
                                <tbody id="visitorsBody" class="divide-y divide-gray-50">
                                    <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">데이터를 불러오고 있습니다...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        const token = localStorage.getItem('token');
        let dailyTrendChartInst = null;
        let byHourChartInst = null;
        let byDayOfWeekChartInst = null;

        function ymd(d) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        }
        function setPeriod(p) {
            const today = new Date();
            const fromEl = document.getElementById('filterFrom');
            const toEl = document.getElementById('filterTo');
            if (p === 'today') {
                fromEl.value = toEl.value = ymd(today);
            } else if (p === 'week') {
                const from = new Date(today);
                from.setDate(from.getDate() - 6);
                fromEl.value = ymd(from);
                toEl.value = ymd(today);
            } else if (p === 'month') {
                const from = new Date(today.getFullYear(), today.getMonth(), 1);
                fromEl.value = ymd(from);
                toEl.value = ymd(today);
            } else {
                fromEl.value = toEl.value = '';
            }
            loadAccessStats();
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadAccessStats();
        });

        async function loadAccessStats() {
            try {
                const fromEl = document.getElementById('filterFrom');
                const toEl = document.getElementById('filterTo');
                let url = '/api/analytics/access-stats';
                if (fromEl && toEl && fromEl.value && toEl.value) {
                    url += '?from=' + encodeURIComponent(fromEl.value) + '&to=' + encodeURIComponent(toEl.value);
                }
                const res = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (res.status === 401) {
                    location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
                    return;
                }
                const result = await res.json();
                if (!result.success) {
                    document.getElementById('stat-today-pv').textContent = '오류';
                    return;
                }
                const d = result.data;
                const isRange = d.rangeFrom && d.rangeTo;

                const defaultCards = document.getElementById('defaultCards');
                const rangeCards = document.getElementById('rangeCards');
                const rangeLabel = document.getElementById('rangeLabel');
                if (isRange) {
                    if (defaultCards) defaultCards.classList.add('hidden');
                    if (rangeCards) {
                        rangeCards.classList.remove('hidden');
                        rangeCards.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2');
                    }
                    if (rangeLabel) {
                        rangeLabel.textContent = d.rangeFrom + ' ~ ' + d.rangeTo;
                        rangeLabel.classList.remove('hidden');
                    }
                    document.getElementById('stat-range-pv').textContent = (d.rangePv ?? 0).toLocaleString();
                    document.getElementById('stat-range-uv').textContent = (d.rangeUv ?? 0).toLocaleString();
                    document.getElementById('dailyTrendTitle').textContent = '일별 접속 추이 (' + d.rangeFrom + ' ~ ' + d.rangeTo + ')';
                    document.getElementById('byHourTitle').textContent = '시간대별 접속 (선택 기간, 0~23시)';
                    document.getElementById('byDayOfWeekTitle').textContent = '요일별 접속 (선택 기간, 일~토)';
                    document.getElementById('byRoleTitle').textContent = '역할별 접속 (선택 기간)';
                } else {
                    if (defaultCards) defaultCards.classList.remove('hidden');
                    if (rangeCards) {
                        rangeCards.classList.add('hidden');
                        rangeCards.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2');
                    }
                    if (rangeLabel) rangeLabel.classList.add('hidden');
                    document.getElementById('stat-today-pv').textContent = (d.todayPV ?? 0).toLocaleString();
                    document.getElementById('stat-today-uv').textContent = (d.todayUV ?? 0).toLocaleString();
                    document.getElementById('stat-week-pv').textContent = (d.weekPV ?? 0).toLocaleString();
                    document.getElementById('stat-week-uv').textContent = (d.weekUV ?? 0).toLocaleString();
                    document.getElementById('stat-month-pv').textContent = (d.monthPV ?? 0).toLocaleString();
                    document.getElementById('stat-month-uv').textContent = (d.monthUV ?? 0).toLocaleString();
                    document.getElementById('dailyTrendTitle').textContent = '일별 접속 추이 (최근 7일)';
                    document.getElementById('byHourTitle').textContent = '오늘 시간대별 접속 (0~23시)';
                    document.getElementById('byDayOfWeekTitle').textContent = '요일별 접속 (최근 7일, 일~토)';
                    document.getElementById('byRoleTitle').textContent = '역할별 접속 (오늘)';
                }

                const dailyTrend = d.dailyTrend || [];
                const labels = dailyTrend.map(t => (t.date || '').substring(5));
                if (dailyTrendChartInst) dailyTrendChartInst.destroy();
                dailyTrendChartInst = new Chart(document.getElementById('dailyTrendChart').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            { label: '페이지뷰', data: dailyTrend.map(t => t.pv ?? 0), backgroundColor: 'rgba(99, 102, 241, 0.6)', borderRadius: 4 },
                            { label: '순 방문자', data: dailyTrend.map(t => t.uv ?? 0), backgroundColor: 'rgba(16, 185, 129, 0.6)', borderRadius: 4 }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });

                const byHour = d.byHour || [];
                const hourLabels = Array.from({ length: 24 }, (_, i) => i + '시');
                const hourData = Array.from({ length: 24 }, (_, i) => (byHour.find(h => h.hour === i) || {}).count ?? 0);
                if (byHourChartInst) byHourChartInst.destroy();
                byHourChartInst = new Chart(document.getElementById('byHourChart').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: hourLabels,
                        datasets: [{ label: '접속 수', data: hourData, backgroundColor: 'rgba(99, 102, 241, 0.5)', borderRadius: 4 }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true }, x: { max: 24 } }
                    }
                });

                const dowNames = ['일', '월', '화', '수', '목', '금', '토'];
                const byDow = d.byDayOfWeek || [];
                const dowLabels = dowNames;
                const dowData = dowNames.map((_, i) => (byDow.find(x => x.dow === i) || {}).count ?? 0);
                if (byDayOfWeekChartInst) byDayOfWeekChartInst.destroy();
                byDayOfWeekChartInst = new Chart(document.getElementById('byDayOfWeekChart').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: dowLabels,
                        datasets: [{ label: '접속 수', data: dowData, backgroundColor: 'rgba(16, 185, 129, 0.5)', borderRadius: 4 }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                    }
                });

                const byRole = d.byRole || [];
                document.getElementById('byRoleList').innerHTML = byRole.length
                    ? byRole.map(r => '<span class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">' + (r.role === 'guest' ? '비로그인' : r.role) + ': ' + (r.count || 0).toLocaleString() + '</span>').join('')
                    : '<span class="text-gray-400">데이터 없음</span>';

                const topPages = d.topPages || [];
                const tbody = document.getElementById('topPagesBody');
                if (topPages.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-gray-400">집계된 데이터가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = topPages.map((p, i) => '<tr class="hover:bg-gray-50"><td class="px-6 py-4 font-bold text-gray-500">' + (i + 1) + '</td><td class="px-6 py-4 text-gray-800 font-medium truncate max-w-md">' + (p.path || '-').replace(/</g, '&lt;') + '</td><td class="px-6 py-4 text-center font-black text-indigo-600">' + (p.pv ?? 0).toLocaleString() + '</td><td class="px-6 py-4 text-center font-bold text-gray-700">' + (p.uv ?? 0).toLocaleString() + '</td></tr>').join('');
                }

                const refs = d.topReferrers || [];
                const refEl = document.getElementById('topReferrersList');
                if (refs.length === 0) {
                    refEl.innerHTML = '<li class="text-gray-400">유입 경로 데이터가 없습니다.</li>';
                } else {
                    refEl.innerHTML = refs.map((r, i) => '<li class="flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">' + (i + 1) + '</span><span class="truncate flex-1" title="' + (r.referrer || '').replace(/"/g, '&quot;') + '">' + (r.referrer || '-').replace(/</g, '&lt;').substring(0, 80) + (r.referrer && r.referrer.length > 80 ? '…' : '') + '</span><span class="font-bold text-indigo-600">' + (r.count || 0).toLocaleString() + '</span></li>').join('');
                }

                loadVisitors();
            } catch (e) {
                console.error('loadAccessStats error:', e);
                document.getElementById('stat-today-pv').textContent = '오류';
                document.getElementById('topPagesBody').innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-red-500">데이터 로드 실패</td></tr>';
                document.getElementById('visitorsBody').innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        async function loadVisitors() {
            const tbody = document.getElementById('visitorsBody');
            try {
                const fromEl = document.getElementById('filterFrom');
                const toEl = document.getElementById('filterTo');
                let url = '/api/analytics/visitors';
                if (fromEl && toEl && fromEl.value && toEl.value) {
                    url += '?from=' + encodeURIComponent(fromEl.value) + '&to=' + encodeURIComponent(toEl.value);
                }
                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                if (res.status === 401) return;
                const result = await res.json();
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">접속 사용자 데이터를 불러올 수 없습니다.</td></tr>';
                    return;
                }
                const visitors = result.data.visitors || [];
                function esc(s) { return (s ?? '').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
                function fmtDate(iso) {
                    if (!iso) return '-';
                    const d = new Date(iso);
                    return isNaN(d.getTime()) ? iso : d.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
                }
                if (visitors.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">해당 기간 접속 사용자가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = visitors.map(function(v) {
                        var kind = v.userId != null ? '로그인' : '비로그인(IP)';
                        var who = v.userId != null ? (v.email || ('사용자#' + v.userId)) : (v.ipAddress || '-');
                        var role = (v.role || '-');
                        return '<tr class="hover:bg-gray-50"><td class="px-6 py-4"><span class="px-2.5 py-1 rounded-lg text-xs font-bold ' + (v.userId != null ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600') + '">' + esc(kind) + '</span></td><td class="px-6 py-4 text-gray-800 font-medium">' + esc(who) + '</td><td class="px-6 py-4 text-center text-gray-600">' + esc(role) + '</td><td class="px-6 py-4 text-center font-black text-indigo-600">' + (v.pv ?? 0).toLocaleString() + '</td><td class="px-6 py-4 text-sm text-gray-500">' + esc(fmtDate(v.lastVisit)) + '</td></tr>';
                    }).join('');
                }
            } catch (e) {
                console.error('loadVisitors error:', e);
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-red-500">접속 사용자 데이터 로드 실패</td></tr>';
            }
        }
    </script>
</body>
</html>
`;
