import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

/** 설문 결과 분석 전용 페이지: 도넛 차트 + 인쇄 */
export const adminLmsSurveyResultsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설문 결과 분석 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        @media print {
            body * { visibility: hidden; }
            .results-print-area, .results-print-area * { visibility: visible; }
            .results-print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .print-no { display: none !important; }
            .results-print-area .print-chart canvas { max-height: 280px !important; }
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="flex min-h-screen">
        <div class="print-no">${sidebar}</div>
        <div class="flex-1 flex flex-col min-w-0">
            <div class="print-no">${lmsHeaderHtml('surveys')}</div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 results-print-area">
                <div class="max-w-4xl mx-auto">
                    <div class="print-no flex items-center justify-between mb-6">
                        <a href="#" id="resultsBackLink" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                            <i class="fas fa-arrow-left"></i> 목록으로
                        </a>
                        <button type="button" onclick="window.print()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm">
                            <i class="fas fa-print"></i> 인쇄
                        </button>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6 md:p-8">
                            <h1 class="text-xl md:text-2xl font-black text-gray-900 mb-6" id="resultsTitle">설문 결과 분석</h1>
                            <div id="resultsLoading" class="py-16 text-center text-gray-400">
                                <i class="fas fa-spinner fa-spin text-3xl mb-4 block"></i>
                                <p class="text-sm font-bold">결과를 불러오는 중...</p>
                            </div>
                            <div id="resultsContent" class="hidden">
                                <div class="grid grid-cols-3 gap-4 mb-8">
                                    <div class="bg-amber-50 rounded-xl p-4 text-center">
                                        <div class="text-2xl font-black text-amber-700" id="resultTotalResponses">0</div>
                                        <div class="text-xs font-bold text-amber-600">참여 응답</div>
                                    </div>
                                    <div class="bg-slate-50 rounded-xl p-4 text-center">
                                        <div class="text-2xl font-black text-slate-700" id="resultTotalTarget">0</div>
                                        <div class="text-xs font-bold text-slate-600">대상 인원</div>
                                    </div>
                                    <div class="bg-blue-50 rounded-xl p-4 text-center">
                                        <div class="text-2xl font-black text-blue-700" id="resultResponseRate">0%</div>
                                        <div class="text-xs font-bold text-blue-600">참여율</div>
                                    </div>
                                </div>
                                <h2 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">항목별 결과</h2>
                                <div id="resultQuestionCharts" class="space-y-10"></div>
                                <div class="border-t border-gray-200 pt-8 mt-10">
                                    <h2 class="font-bold text-gray-800 mb-4">서술형 응답</h2>
                                    <div id="resultCommentsList" class="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto text-sm text-gray-600 space-y-2"></div>
                                </div>
                            </div>
                            <div id="resultsError" class="hidden py-16 text-center text-red-500 font-bold">결과를 불러오지 못했습니다.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        (function() {
            var pathParts = window.location.pathname.split('/');
            var courseIdx = pathParts.indexOf('courses');
            var surveyIdx = pathParts.indexOf('surveys');
            var courseId = courseIdx >= 0 ? pathParts[courseIdx + 1] : '';
            var surveyId = surveyIdx >= 0 ? pathParts[surveyIdx + 1] : '';
            var isTeacher = pathParts.indexOf('teacher') >= 0;
            var basePath = isTeacher ? '/teacher/courses/' + courseId + '/lms/surveys' : '/admin/courses/' + courseId + '/lms/surveys';
            var backLink = document.getElementById('resultsBackLink');
            if (backLink) backLink.href = basePath + (window.location.search || '');

            if (!surveyId) {
                document.getElementById('resultsLoading').classList.add('hidden');
                document.getElementById('resultsError').classList.remove('hidden');
                document.getElementById('resultsError').textContent = '설문 정보가 없습니다.';
                return;
            }

            var token = localStorage.getItem('token');
            if (!token) {
                document.getElementById('resultsLoading').classList.add('hidden');
                document.getElementById('resultsError').classList.remove('hidden');
                document.getElementById('resultsError').textContent = '로그인이 필요합니다.';
                return;
            }

            var resultCharts = [];
            var scaleLabels = { 1: '매우 아니다', 2: '아니다', 3: '보통', 4: '그렇다', 5: '매우 그렇다' };
            var DONUT_COLORS = ['#fef3c7','#fde68a','#fcd34d','#f59e0b','#d97706'];
            var DONUT_COLORS_BLUE = ['#dbeafe','#93c5fd','#60a5fa','#3b82f6','#2563eb'];

            fetch('/api/surveys/' + surveyId + '/results', { headers: { 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    document.getElementById('resultsLoading').classList.add('hidden');
                    if (!res || !res.success || !res.data) {
                        document.getElementById('resultsError').classList.remove('hidden');
                        return;
                    }
                    var data = res.data;
                    var survey = data.survey || {};
                    var stats = data.stats || {};
                    var questionStats = data.question_stats || [];
                    document.getElementById('resultsContent').classList.remove('hidden');
                    document.getElementById('resultsTitle').textContent = (survey.title || '설문') + ' - 결과 분석';
                    document.getElementById('resultTotalResponses').textContent = stats.total_responses || 0;
                    document.getElementById('resultTotalTarget').textContent = stats.total_target || 0;
                    document.getElementById('resultResponseRate').textContent = (stats.response_rate || 0) + '%';
                    var commentsHtml = [];
                    var container = document.getElementById('resultQuestionCharts');
                    container.innerHTML = '';
                    questionStats.forEach(function(q, idx) {
                        var card = document.createElement('div');
                        card.className = 'bg-gray-50 rounded-xl p-6 border border-gray-100';
                        var title = document.createElement('p');
                        title.className = 'font-bold text-gray-800 mb-4 text-sm';
                        title.textContent = (idx + 1) + '. ' + (q.question_text || '');
                        card.appendChild(title);
                        if (q.question_type === 'rating') {
                            var dist = q.distribution || {};
                            var labels = [1,2,3,4,5].map(function(k) { return k + '(' + (scaleLabels[k] || '') + ')'; });
                            var values = [1,2,3,4,5].map(function(k) { return dist[k] || 0; });
                            var total = values.reduce(function(a,b) { return a + b; }, 0);
                            var canvas = document.createElement('canvas');
                            canvas.className = 'print-chart';
                            canvas.height = 260;
                            var wrap = document.createElement('div');
                            wrap.className = 'flex flex-col md:flex-row md:items-center gap-4';
                            var chartDiv = document.createElement('div');
                            chartDiv.className = 'flex-shrink-0';
                            chartDiv.style.width = '280px';
                            chartDiv.style.height = '260px';
                            chartDiv.appendChild(canvas);
                            wrap.appendChild(chartDiv);
                            var legendDiv = document.createElement('div');
                            legendDiv.className = 'text-sm';
                            legendDiv.innerHTML = total > 0 ? values.map(function(v, i) {
                                var pct = total ? ((v / total) * 100).toFixed(1) : 0;
                                return '<div class="flex items-center gap-2 py-1"><span class="w-3 h-3 rounded-full flex-shrink-0" style="background:' + DONUT_COLORS[i] + '"></span><span>' + labels[i] + ': ' + v + '명 (' + pct + '%)</span></div>';
                            }).join('') : '<p class="text-gray-400">응답 없음</p>';
                            var avg = q.average != null ? q.average.toFixed(1) : '-';
                            legendDiv.innerHTML += '<p class="mt-2 font-bold text-amber-700">평균 ' + avg + '점 · 응답 ' + (q.total_responses || 0) + '명</p>';
                            wrap.appendChild(legendDiv);
                            card.appendChild(wrap);
                            container.appendChild(card);
                            var ch = new Chart(canvas.getContext('2d'), {
                                type: 'doughnut',
                                data: {
                                    labels: labels,
                                    datasets: [{ data: values, backgroundColor: DONUT_COLORS, borderColor: '#fff', borderWidth: 2 }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    cutout: '55%'
                                }
                            });
                            resultCharts.push(ch);
                        } else if (q.question_type === 'choice') {
                            var dist = q.distribution || {};
                            var keys = Object.keys(dist);
                            var choiceValues = keys.map(function(k) { return dist[k]; });
                            var total = choiceValues.reduce(function(a,b) { return a + b; }, 0);
                            var colors = keys.map(function(_, i) { return DONUT_COLORS_BLUE[i % DONUT_COLORS_BLUE.length]; });
                            var canvas = document.createElement('canvas');
                            canvas.className = 'print-chart';
                            canvas.height = 260;
                            var wrap = document.createElement('div');
                            wrap.className = 'flex flex-col md:flex-row md:items-center gap-4';
                            var chartDiv = document.createElement('div');
                            chartDiv.className = 'flex-shrink-0';
                            chartDiv.style.width = '280px';
                            chartDiv.style.height = '260px';
                            chartDiv.appendChild(canvas);
                            wrap.appendChild(chartDiv);
                            var legendDiv = document.createElement('div');
                            legendDiv.className = 'text-sm';
                            legendDiv.innerHTML = total > 0 ? keys.map(function(k, i) {
                                var v = dist[k];
                                var pct = total ? ((v / total) * 100).toFixed(1) : 0;
                                return '<div class="flex items-center gap-2 py-1"><span class="w-3 h-3 rounded-full flex-shrink-0" style="background:' + colors[i] + '"></span><span>' + k + ': ' + v + '명 (' + pct + '%)</span></div>';
                            }).join('') : '<p class="text-gray-400">응답 없음</p>';
                            wrap.appendChild(legendDiv);
                            card.appendChild(wrap);
                            container.appendChild(card);
                            var ch = new Chart(canvas.getContext('2d'), {
                                type: 'doughnut',
                                data: {
                                    labels: keys,
                                    datasets: [{ data: choiceValues, backgroundColor: colors, borderColor: '#fff', borderWidth: 2 }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    cutout: '55%'
                                }
                            });
                            resultCharts.push(ch);
                        } else if (q.question_type === 'text') {
                            var texts = q.text_answers || [];
                            texts.forEach(function(t) { commentsHtml.push('<div class="p-2 border-b border-gray-100">' + String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>'); });
                            var txtWrap = document.createElement('div');
                            txtWrap.className = 'text-sm text-gray-600 bg-white rounded-lg p-4 max-h-40 overflow-y-auto border border-gray-100';
                            txtWrap.innerHTML = texts.length ? texts.map(function(t) { return '<div class="py-1">' + String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>'; }).join('') : '<span class="text-gray-400">응답 없음</span>';
                            card.appendChild(txtWrap);
                            container.appendChild(card);
                        }
                    });
                    document.getElementById('resultCommentsList').innerHTML = commentsHtml.length ? commentsHtml.join('') : '<p class="text-gray-400">서술형 응답이 없습니다.</p>';
                })
                .catch(function() {
                    document.getElementById('resultsLoading').classList.add('hidden');
                    document.getElementById('resultsError').classList.remove('hidden');
                });
        })();
    </script>
</body>
</html>
`;
