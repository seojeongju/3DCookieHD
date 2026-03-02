import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

/** 강의 후 설문지 미리보기 페이지 (교육과정·교육과목·담당교사·설문작성일 + 4개 섹션) */
export const adminLmsSurveyPreviewHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강의 후 설문지 - 와우쓰리디</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto p-6 md:p-10">
                ${lmsHeaderHtml('surveys')}
                <div class="max-w-4xl mx-auto mt-8">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-8 md:p-10">
                            <h1 class="text-2xl md:text-3xl font-black text-center text-gray-900 mb-4">강의 후 설문지</h1>
                            <p class="text-sm text-gray-600 text-center mb-8 leading-relaxed">
                                수고하셨습니다. 오늘 교육 프로그램에 대한 전반적인 부분을 객관적으로 파악하고, 향후 교육의 기초 자료로 활용하고자 설문을 진행합니다. 더 나은 교육을 위해 솔직한 평가 부탁드립니다.
                            </p>

                            <table class="w-full border border-gray-200 rounded-lg overflow-hidden mb-8 text-sm">
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-bold text-gray-600 w-28 border-b border-r border-gray-200">교육과정</td>
                                    <td id="preview-course" class="px-4 py-3 border-b border-gray-200">-</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-bold text-gray-600 border-r border-gray-200">교육과목</td>
                                    <td id="preview-subject" class="px-4 py-3">-</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 text-[10px] text-gray-400 border-r border-gray-200 pl-4"></td>
                                    <td id="preview-teacher" class="px-4 py-2 text-xs text-gray-500">담당교사 : -</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-bold text-gray-600 border-r border-t border-gray-200">설문작성일</td>
                                    <td id="preview-date" class="px-4 py-3 border-t border-gray-200">-</td>
                                </tr>
                            </table>

                            <form id="adminSurveyForm">
                                <div id="preview-sections" class="space-y-6">
                                    <div class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin mr-2"></i> 설문 문항을 불러오는 중...</div>
                                </div>
                                <div id="preview-submit-area" class="hidden pt-6 flex gap-3 justify-between border-t border-gray-100 mt-6">
                                    <a href="#" id="preview-back" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-300 transition"><i class="fas fa-arrow-left"></i> 설문 관리로 돌아가기</a>
                                    <button type="submit" class="px-8 py-2.5 bg-sky-600 text-white rounded-xl font-black text-sm hover:bg-slate-900 transition shadow-lg shadow-sky-100"><i class="fas fa-paper-plane mr-2"></i>제출하기</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        (function() {
            var pathParts = window.location.pathname.split('/');
            var courseId = pathParts[pathParts.indexOf('courses') + 1];
            var surveyId = pathParts[pathParts.indexOf('surveys') + 1];
            var token = localStorage.getItem('token');
            var backUrl = '/admin/courses/' + courseId + '/lms/surveys' + (window.location.search || '');
            var backLink = document.getElementById('preview-back');
            if (backLink) backLink.href = backUrl;

            if (!surveyId || !token) {
                document.getElementById('preview-sections').innerHTML = '<p class="text-red-500 text-center py-8">설문 정보를 불러올 수 없습니다.</p>';
                return;
            }

            fetch('/api/surveys/' + surveyId, { headers: { 'Authorization': 'Bearer ' + token } })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res || !res.success || !res.data) {
                        document.getElementById('preview-sections').innerHTML = '<p class="text-red-500 text-center py-8">설문을 찾을 수 없습니다.</p>';
                        return;
                    }
                    var s = res.data;
                    document.getElementById('preview-course').textContent = s.course_title || '-';
                    document.getElementById('preview-subject').textContent = s.subject_title || s.course_title || '-';
                    document.getElementById('preview-teacher').textContent = '담당교사 : ' + (s.teacher_name || '-');
                    var d = s.created_at ? new Date(s.created_at) : new Date();
                    var y = d.getFullYear(); var m = String(d.getMonth() + 1).padStart(2, '0'); var day = String(d.getDate()).padStart(2, '0');
                    var dayNames = ['일','월','화','수','목','금','토'];
                    document.getElementById('preview-date').textContent = y + '. ' + m + '. ' + day + '. (' + dayNames[d.getDay()] + ')';

                    var questions = s.questions || [];
                    var sections = [
                        { title: '교육만족도', start: 0, end: 3 },
                        { title: '솔루션 평가 및 강사 평가', start: 3, end: 6 },
                        { title: '교육내용평가', start: 6, end: 10 },
                        { title: '전반적인 교육 소감을 구체적으로 작성하여 주시기 바랍니다.', start: 10, end: 11, isText: true }
                    ];
                    var scaleLabels = ['매우 아니다','아니다','보통','그렇다','매우 그렇다'];
                    var html = '';
                    sections.forEach(function(sec) {
                        var items = questions.slice(sec.start, sec.end);
                        if (items.length === 0 && !sec.isText) return;
                        html += '<div class="border border-gray-200 rounded-xl overflow-hidden">';
                        html += '<div class="bg-gray-100 px-4 py-3 font-bold text-gray-700 text-sm text-center">' + sec.title + '</div>';
                        if (sec.isText) {
                            var qLast = items[0];
                            var qIdLast = qLast ? qLast.id : 'text_0';
                            html += '<div class="p-4"><textarea name="q_' + qIdLast + '" rows="5" class="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-sky-500 resize-none" placeholder="교육 소감을 작성해 주세요."></textarea></div>';
                        } else {
                            html += '<table class="w-full text-sm"><thead><tr><th class="text-left py-2 pl-4 font-medium text-gray-600 w-1/2">문항</th>';
                            for (var i = 5; i >= 1; i--) html += '<th class="py-2 text-center text-xs text-gray-500 font-medium">' + i + '<br><span class="text-[10px] font-normal">' + scaleLabels[i-1] + '</span></th>';
                            html += '</tr></thead><tbody>';
                            items.forEach(function(q) {
                                html += '<tr class="border-t border-gray-100"><td class="py-3 pl-4 pr-2 text-gray-800">' + (q.question_text || '').replace(/</g,'&lt;') + '</td>';
                                for (var k = 5; k >= 1; k--) html += '<td class="py-3 text-center"><input type="radio" name="q_' + q.id + '" value="' + k + '" class="w-4 h-4 cursor-pointer accent-sky-600"></td>';
                                html += '</tr>';
                            });
                            html += '</tbody></table>';
                        }
                        html += '</div>';
                    });
                    document.getElementById('preview-sections').innerHTML = html || '<p class="text-gray-500 text-center py-4">문항이 없습니다.</p>';

                    // 제출 버튼 영역 표시
                    var submitArea = document.getElementById('preview-submit-area');
                    if (submitArea) submitArea.classList.remove('hidden');
                })
                .catch(function() {
                    document.getElementById('preview-sections').innerHTML = '<p class="text-red-500 text-center py-8">불러오기 실패</p>';
                });

            // 폼 제출 처리
            var form = document.getElementById('adminSurveyForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var answers = [];
                    var seen = {};
                    var inputs = form.querySelectorAll('input[name^="q_"], textarea[name^="q_"]');
                    for (var i = 0; i < inputs.length; i++) {
                        var el = inputs[i];
                        var name = el.getAttribute('name');
                        if (!name || name.indexOf('q_') !== 0) continue;
                        var qid = name.replace('q_', '');
                        if (seen[qid]) continue;
                        seen[qid] = true;
                        var val;
                        if (el.type === 'radio') {
                            var checked = form.querySelector('input[name="' + name + '"]:checked');
                            val = checked ? checked.value : '';
                        } else {
                            val = el.value || '';
                        }
                        answers.push({ question_id: parseInt(qid, 10), answer_value: val });
                    }
                    var btn = form.querySelector('button[type="submit"]');
                    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>제출 중...'; }
                    fetch('/api/surveys/' + surveyId + '/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ answers: answers })
                    })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        if (json && json.success) {
                            alert(json.message || '설문에 참여해 주셔서 감사합니다.');
                            window.location.href = backUrl;
                        } else {
                            alert(json && json.error ? json.error : '제출에 실패했습니다.');
                            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>제출하기'; }
                        }
                    })
                    .catch(function() {
                        alert('제출 중 오류가 발생했습니다.');
                        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>제출하기'; }
                    });
                });
            }
        })();
    </script>
</body>
</html>
`;
