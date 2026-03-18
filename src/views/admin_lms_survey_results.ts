import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

/** 강의후 설문 조사 결과: 과정정보 테이블 + 섹션별 구분(교육만족도/솔루션·강사/교육내용/주관식) + 원형 차트 + 인쇄 */
export const adminLmsSurveyResultsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강의후 설문 조사 결과 - 와우쓰리디</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .bento-card { transition: box-shadow 0.2s, transform 0.2s; }
        .bento-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .chart-legend-dot { width: 10px; height: 10px; border-radius: 9999px; flex-shrink: 0; }
        @media print {
            body * { visibility: hidden; }
            .results-print-area, .results-print-area * { visibility: visible; }
            .results-print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .print-no { display: none !important; }
            .results-print-area .print-chart canvas { max-width: 140px !important; max-height: 140px !important; }
        }
    </style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        <div class="print-no">${sidebar}</div>
        <div class="flex-1 flex flex-col min-w-0">
            <div class="print-no">${lmsHeaderHtml('surveys')}</div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 results-print-area">
                <div class="max-w-4xl mx-auto">
                    <div class="print-no flex items-center justify-between mb-6">
                        <a href="#" id="resultsBackLink" class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl text-slate-700 font-black text-sm hover:bg-slate-100 transition shadow-sm">
                            <i class="fas fa-arrow-left"></i> 목록으로
                        </a>
                        <button type="button" onclick="window.print()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition shadow-sm">
                            <i class="fas fa-print"></i> 인쇄
                        </button>
                    </div>
                    <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden bento-card">
                        <div class="p-6 md:p-10">
                            <h1 class="text-2xl md:text-3xl font-black text-slate-900 text-center tracking-tight mb-6" id="resultsTitle">강의후 설문 조사 결과</h1>
                            <div id="resultsLoading" class="py-16 text-center text-slate-400">
                                <i class="fas fa-spinner fa-spin text-3xl mb-4 block"></i>
                                <p class="text-sm font-bold">결과를 불러오는 중...</p>
                            </div>
                            <div id="resultsContent" class="hidden">
                                <table class="w-full border border-slate-200 rounded-2xl overflow-hidden mb-8 text-sm">
                                    <tr class="bg-slate-50">
                                        <td class="px-4 py-3 font-bold text-slate-600 w-28 border-b border-r border-slate-200">설문일자</td>
                                        <td id="resultSurveyDate" class="px-4 py-3 border-b border-slate-200">-</td>
                                    </tr>
                                    <tr class="bg-slate-50">
                                        <td class="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">교육과정</td>
                                        <td id="resultCourseTitle" class="px-4 py-3 border-b border-slate-200">-</td>
                                    </tr>
                                    <tr class="bg-slate-50">
                                        <td class="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">교육과목</td>
                                        <td id="resultSubjectTitle" class="px-4 py-3 border-b border-slate-200">-</td>
                                    </tr>
                                    <tr class="bg-slate-50">
                                        <td class="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">담당교사</td>
                                        <td id="resultTeacherName" class="px-4 py-3 border-b border-slate-200">-</td>
                                    </tr>
                                    <tr class="bg-slate-50">
                                        <td class="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">설문인원</td>
                                        <td id="resultSurveyCount" class="px-4 py-3">-</td>
                                    </tr>
                                </table>
                                <div id="resultSections" class="space-y-8"></div>
                                <div id="resultOpenEndedSection" class="hidden border border-slate-200 rounded-2xl overflow-hidden mt-8">
                                    <div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 text-sm border-b border-slate-200">설문 4 : 주관식 의견 (개방형)</div>
                                    <div class="p-4 bg-white">
                                        <p class="text-slate-600 text-sm font-medium mb-3">전반적인 교육 의견을 구체적으로 작성하여 주시기 바랍니다.</p>
                                        <div id="resultCommentsList" class="space-y-2 text-sm text-slate-600"></div>
                                    </div>
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
            var RATING_COLORS = ['#64748b','#f59e0b','#94a3b8','#dc2626','#2563eb'];

            var sections = [
                { title: '설문 1 : 교육 만족도', countLabel: '3문항', start: 0, end: 3 },
                { title: '설문 2 : 솔루션 평가 및 강사 평가', countLabel: '3문항', start: 3, end: 6 },
                { title: '설문 3 : 교육 내용 평가', countLabel: '4문항', start: 6, end: 10 }
            ];

            function escapeHtml(s) {
                if (s == null) return '';
                return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
            }

            function formatSurveyDate(d) {
                if (!d) return '-';
                var date = new Date(d);
                var y = date.getFullYear();
                var m = String(date.getMonth() + 1).padStart(2, '0');
                var day = String(date.getDate()).padStart(2, '0');
                var dayNames = ['일','월','화','수','목','금','토'];
                return y + '. ' + m + '. ' + day + '. (' + dayNames[date.getDay()] + ')';
            }

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
                    document.getElementById('resultSurveyDate').textContent = formatSurveyDate(survey.created_at || survey.start_date);
                    document.getElementById('resultCourseTitle').textContent = survey.course_title || '-';
                    document.getElementById('resultSubjectTitle').textContent = survey.subject_title || survey.subject_name || survey.course_title || '-';
                    document.getElementById('resultTeacherName').textContent = survey.teacher_name || '-';
                    document.getElementById('resultSurveyCount').textContent = (stats.total_target || 0) + '명 중 ' + (stats.total_responses || 0) + '명';

                    var ratingQuestions = questionStats.filter(function(q) { return q.question_type === 'rating'; });
                    var textQuestions = questionStats.filter(function(q) { return q.question_type === 'text'; });

                    var sectionsHtml = '';
                    sections.forEach(function(sec) {
                        var items = ratingQuestions.slice(sec.start, sec.end);
                        if (items.length === 0) return;
                        var actualCount = items.length;
                        sectionsHtml += '<div class="border border-slate-200 rounded-2xl overflow-hidden bento-card">';
                        sectionsHtml += '<div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 text-sm border-b border-slate-200">' + sec.title + ' (' + actualCount + '문항)</div>';
                        sectionsHtml += '<div class="p-4 md:p-5 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">';
                        items.forEach(function(q, i) {
                            var dist = q.distribution || {};
                            var chartId = 'chart_' + sec.start + '_' + i;
                            sectionsHtml += '<div class="border border-slate-200/60 rounded-xl p-3 flex flex-col gap-2 bento-card">';
                            sectionsHtml += '<p class="font-bold text-slate-800 text-xs leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + (i + 1) + '. ' + escapeHtml(q.question_text) + '</p>';
                            sectionsHtml += '<div class="flex items-center justify-center"><canvas id="' + chartId + '" class="print-chart" width="140" height="140"></canvas></div>';
                            sectionsHtml += '</div>';
                        });
                        sectionsHtml += '</div></div>';
                    });
                    document.getElementById('resultSections').innerHTML = sectionsHtml;

                    var allTexts = [];
                    textQuestions.forEach(function(q) { (q.text_answers || []).forEach(function(t) { allTexts.push(t); }); });
                    if (textQuestions.length > 0) {
                        document.getElementById('resultOpenEndedSection').classList.remove('hidden');
                        document.getElementById('resultCommentsList').innerHTML = allTexts.length ? allTexts.map(function(t) { return '<div class="p-2 border-b border-slate-100 last:border-0">' + escapeHtml(t) + '</div>'; }).join('') : '<p class="text-slate-400">응답 없음</p>';
                    }

                    var chartColorsOrder = [RATING_COLORS[4], RATING_COLORS[3], RATING_COLORS[2], RATING_COLORS[1], RATING_COLORS[0]];
                    if (typeof Chart !== 'undefined' && Chart.registry && Chart.registry.getPlugin('datalabels') === undefined) {
                        Chart.register(ChartDataLabels);
                    }
                    sections.forEach(function(sec) {
                        var items = ratingQuestions.slice(sec.start, sec.end);
                        items.forEach(function(q, i) {
                            var chartId = 'chart_' + sec.start + '_' + i;
                            var canvas = document.getElementById(chartId);
                            if (!canvas) return;
                            var dist = q.distribution || {};
                            var values = [5,4,3,2,1].map(function(k) { return dist[k] || 0; });
                            var labels = [5,4,3,2,1].map(function(k) { return scaleLabels[k] || ''; });
                            var total = values.reduce(function(a,b) { return a + b; }, 0);
                            var ch = new Chart(canvas.getContext('2d'), {
                                type: 'pie',
                                data: {
                                    labels: labels,
                                    datasets: [{ data: values, backgroundColor: chartColorsOrder, borderColor: '#fff', borderWidth: 2 }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: { display: false },
                                        datalabels: {
                                            color: '#1e293b',
                                            font: { size: 10, weight: 'bold' },
                                            formatter: function(val, ctx) {
                                                var t = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                                                var pct = t > 0 ? ((val / t) * 100).toFixed(0) : '0';
                                                var lbl = ctx.chart.data.labels[ctx.dataIndex] || '';
                                                return val > 0 ? lbl + ' ' + pct + '%' : '';
                                            },
                                            display: function(ctx) { return ctx.dataset.data[ctx.dataIndex] > 0; },
                                            anchor: 'center',
                                            align: 'center'
                                        }
                                    }
                                }
                            });
                            resultCharts.push(ch);
                        });
                    });
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
