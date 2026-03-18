import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

const QUESTION_LABELS = [
    '출석을 정확히 확인하였다.', '수업계획에 따라 성실히 수업을 진행하였다.', '수업목표를 명확히 제시하였다.',
    '수업시간을 정확히 준수하였다.', '수업에 대한 성실한 자세를 보였다.', '적절한 수업운영 방법을 사용하였다.',
    '보조자료를 적절히 활용하였다.', '수업 마무리 시 차시 예고를 하였다.', '과제를 적절히 부여하고 평가하였다.',
    '수강생 개인의 학습 적응도를 주기적으로 점검하였다.', '실기 시 관련 이론을 충분히 설명하였다.',
    '실기 도구를 효과적으로 활용하여 수업을 진행하였다.', '실기 도구 사용 시 발생한 문제를 적절히 해결하였다.',
    '본인 강의 내용이 훈련생에게 도움이 된다고 생각한다.', '훈련생이 수업목표를 어느 정도 달성하였다고 생각한다.',
];

/** 교강사직무능력평가 결과 보기/인쇄 */
export const adminLmsInstructorEvalResultsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교강사직무능력평가 결과 - 와우쓰리디</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}
        @media print{ body *{visibility:hidden} .results-print-area,.results-print-area *{visibility:visible} .results-print-area{position:absolute;left:0;top:0;width:100%} .print-hide{display:none!important} }
    </style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        <div class="print-hide">${sidebar}</div>
        <div class="flex-1 flex flex-col min-w-0">
            <div class="print-hide">${lmsHeaderHtml('instructor-eval')}</div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 results-print-area">
                <div class="max-w-4xl mx-auto">
                    <div class="print-hide flex items-center justify-between mb-6">
                        <a href="#" id="backLink" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50"> <i class="fas fa-arrow-left"></i> 목록으로 </a>
                        <button type="button" onclick="window.print()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"> <i class="fas fa-print"></i> 인쇄 </button>
                    </div>
                    <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                        <div class="p-6 md:p-10">
                            <h1 class="text-2xl font-black text-slate-900 text-center mb-2">교강사직무능력평가 결과</h1>
                            <p class="text-sm text-slate-500 text-center mb-6" id="courseTitle">-</p>
                            <div id="loading" class="py-12 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 불러오는 중...</div>
                            <div id="content" class="hidden space-y-8"></div>
                            <div id="empty" class="hidden py-12 text-center text-slate-500">저장된 평가 결과가 없습니다.</div>
                            <div id="error" class="hidden py-12 text-center text-red-500 font-bold"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        (function(){
            var pathParts = window.location.pathname.split('/');
            var courseId = pathParts[pathParts.indexOf('courses')+1];
            var token = localStorage.getItem('token');
            var isTeacher = window.location.pathname.indexOf('/teacher') >= 0;
            var basePath = (isTeacher ? '/teacher/courses/' : '/admin/courses/') + courseId + '/lms';
            var qs = window.location.search || '';

            document.getElementById('backLink').href = basePath + '/instructor-eval' + qs;

            if(!courseId || !token){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='권한이 없습니다.'; return; }

            fetch('/api/courses/'+courseId+(qs?'?'+qs.substring(1):''), { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){ if(res&&res.success&&res.data) document.getElementById('courseTitle').textContent = res.data.title||'-'; })
                .catch(function(){});

            fetch('/api/instructor-eval/results?session_id='+encodeURIComponent(courseId), { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){
                    document.getElementById('loading').classList.add('hidden');
                    if(!res||!res.success){ document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent = res&&res.error ? res.error : '불러오기 실패'; return; }
                    var evals = res.data||[];
                    if(evals.length===0){ document.getElementById('empty').classList.remove('hidden'); return; }
                    document.getElementById('content').classList.remove('hidden');

                    var bySubject = {};
                    evals.forEach(function(e){
                        if(!bySubject[e.subject_name]) bySubject[e.subject_name] = { admin: null, self: null };
                        if(e.evaluator_type==='admin') bySubject[e.subject_name].admin = e;
                        else bySubject[e.subject_name].self = e;
                    });

                    var questionLabels = ${JSON.stringify(QUESTION_LABELS)};
                    var html = '';
                    Object.keys(bySubject).sort().forEach(function(subject){
                        var row = bySubject[subject];
                        html += '<div class="border border-slate-200 rounded-2xl overflow-hidden">';
                        html += '<div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + subject.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
                        html += '<div class="p-4 space-y-6">';

                        ['admin','self'].forEach(function(typ){
                            var ev = typ==='admin' ? row.admin : row.self;
                            var label = typ==='admin' ? '원장(관리자) 평가' : '담당강사(본인) 평가';
                            if(!ev){ html += '<div class="text-sm text-slate-500">' + label + ': 미작성</div>'; return; }
                            html += '<div class="border border-slate-100 rounded-xl p-4">';
                            html += '<p class="font-bold text-slate-700 mb-2">' + label + ' <span class="text-slate-500 font-normal">(' + (ev.evaluator_name||'') + ', 총 ' + (ev.total_score!=null ? ev.total_score : '-') + '점)</span></p>';
                            html += '<table class="w-full text-xs border border-slate-200 rounded-lg overflow-hidden"><thead><tr class="bg-slate-50"><th class="text-left py-2 px-3 font-bold text-slate-600">문항</th><th class="text-center w-10">점수</th></tr></thead><tbody>';
                            for(var i=1;i<=15;i++){
                                var v = ev['q'+i];
                                var qLabel = questionLabels[i-1] || '';
                                html += '<tr class="border-t border-slate-100"><td class="py-1.5 px-3 text-slate-700">'+i+'. '+qLabel+'</td><td class="text-center font-bold">'+(v!=null?v:'-')+'</td></tr>';
                            }
                            html += '</tbody></table>';
                            if(ev.suggestions && ev.suggestions.trim()) html += '<p class="mt-3 text-sm text-slate-600"><span class="font-bold">건의사항:</span> ' + (ev.suggestions+'').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>';
                            html += '</div>';
                        });
                        html += '</div></div>';
                    });
                    document.getElementById('content').innerHTML = html;
                })
                .catch(function(){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='요청 실패'; });
        })();
    </script>
</body>
</html>
`;
