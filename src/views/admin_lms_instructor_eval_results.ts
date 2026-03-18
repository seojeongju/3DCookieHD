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
                            <div class="border border-slate-200 rounded-xl overflow-hidden text-sm mb-6">
                                <table class="w-full"><tbody>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600 w-28">과정명</td><td id="courseTitle" class="py-2 px-4 text-slate-800">-</td></tr>
                                    <tr><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">과정 일자</td><td id="courseDates" class="py-2 px-4 text-slate-800">-</td></tr>
                                </tbody></table>
                            </div>
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

            function fmtDate(s){ if(!s) return ''; var d = (s+'').split('T')[0]; return d ? d.replace(/-/g,'.') : ''; }
            function esc(s){ if(s==null) return ''; return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

            Promise.all([
                fetch('/api/courses/'+courseId+(qs?'?'+qs.substring(1):''), { headers: { 'Authorization': 'Bearer '+token } }).then(function(r){ return r.json(); }),
                fetch('/api/instructor-eval/results?session_id='+encodeURIComponent(courseId), { headers: { 'Authorization': 'Bearer '+token } }).then(function(r){ return r.json(); })
            ]).then(function(results){
                var courseRes = results[0], evalRes = results[1];
                var courseTitle = '-', courseDates = '-';
                if(courseRes&&courseRes.success&&courseRes.data){ var d = courseRes.data; courseTitle = d.title||'-'; courseDates = (fmtDate(d.start_date)&&fmtDate(d.end_date)) ? (fmtDate(d.start_date)+' ~ '+fmtDate(d.end_date)) : '-'; }
                document.getElementById('courseTitle').textContent = courseTitle;
                document.getElementById('courseDates').textContent = courseDates;

                document.getElementById('loading').classList.add('hidden');
                if(!evalRes||!evalRes.success){ document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent = evalRes&&evalRes.error ? evalRes.error : '불러오기 실패'; return; }
                var evals = evalRes.data||[];
                if(evals.length===0){ document.getElementById('empty').classList.remove('hidden'); return; }
                document.getElementById('content').classList.remove('hidden');

                var bySubjectInstructor = {};
                evals.forEach(function(e){
                    var key = (e.subject_name || '') + '\t' + (e.instructor_id != null ? e.instructor_id : '');
                    if(!bySubjectInstructor[key]) bySubjectInstructor[key] = { subject_name: e.subject_name, instructor_id: e.instructor_id, instructor_name: null, admin: null, self: null };
                    if(e.evaluator_type==='admin') bySubjectInstructor[key].admin = e;
                    else bySubjectInstructor[key].self = e;
                    if(e.instructor_name) bySubjectInstructor[key].instructor_name = e.instructor_name;
                });
                var keys = Object.keys(bySubjectInstructor).sort(function(a,b){ var sa = a.split('\t')[0], sb = b.split('\t')[0]; if(sa!==sb) return sa.localeCompare(sb); return a.localeCompare(b); });

                var questionLabels = ${JSON.stringify(QUESTION_LABELS)};
                var html = '';
                keys.forEach(function(key){
                    var row = bySubjectInstructor[key];
                    var instructorName = row.instructor_name || (row.admin && row.admin.instructor_name) || (row.self && row.self.instructor_name) || '-';
                    html += '<div class="border border-slate-200 rounded-2xl overflow-hidden mb-8">';
                    html += '<div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + esc(row.subject_name) + ' · 담당강사 ' + esc(instructorName) + '</div>';
                    html += '<div class="p-4 space-y-8">';

                    ['admin','self'].forEach(function(typ){
                        var ev = typ==='admin' ? row.admin : row.self;
                        var label = typ==='admin' ? '원장(관리자) 평가' : '담당강사(본인) 평가';
                        if(!ev){ html += '<div class="border border-slate-200 rounded-xl overflow-hidden"><div class="bg-slate-50 px-4 py-3 font-bold text-slate-600">' + label + '</div><div class="p-4 text-sm text-slate-500">미작성</div></div>'; return; }
                        html += '<div class="border border-slate-200 rounded-xl overflow-hidden">';
                        html += '<div class="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + label + ' 결과표</div>';
                        html += '<div class="p-4">';
                        html += '<table class="w-full border border-slate-200 rounded-xl overflow-hidden text-sm mb-4"><tbody>';
                        html += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600 w-28">과정명</td><td class="py-2 px-4 text-slate-800">' + esc(courseTitle) + '</td><td colspan="2" class="bg-slate-50 py-2 px-4 font-bold text-slate-600 text-center border-l border-slate-200 w-32">결재</td></tr>';
                        html += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">과정 일자</td><td class="py-2 px-4 text-slate-800">' + esc(courseDates) + '</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 border-l border-slate-200 w-16">원장</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 w-16">담당</td></tr>';
                        html += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">교과목</td><td class="py-2 px-4 text-slate-800">' + esc(row.subject_name) + '</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>';
                        html += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">담당강사</td><td class="py-2 px-4 text-slate-800">' + esc(instructorName) + '</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>';
                        html += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">평가자</td><td class="py-2 px-4 text-slate-800">' + (typ==='admin' ? '원장(관리자)' : '담당강사(본인)') + '</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>';
                        html += '<tr><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">성명</td><td class="py-2 px-4 text-slate-800">' + esc(ev.evaluator_name) + '</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>';
                        html += '</tbody></table>';
                        var scoreText = ev.total_score != null ? (ev.total_score + '/75점') : '-';
                        html += '<p class="text-sm font-bold text-slate-700 mb-2">75점 만점 / 총점 <span class="text-slate-800">' + scoreText + '</span></p>';
                        html += '<table class="w-full text-xs border border-slate-200 rounded-lg overflow-hidden"><thead><tr class="bg-slate-50"><th class="text-left py-2 px-3 font-bold text-slate-600">문항</th><th class="text-center w-10">점수</th></tr></thead><tbody>';
                        for(var i=1;i<=15;i++){
                            var v = ev['q'+i];
                            var qLabel = questionLabels[i-1] || '';
                            html += '<tr class="border-t border-slate-100"><td class="py-1.5 px-3 text-slate-700">'+i+'. '+qLabel+'</td><td class="text-center font-bold">'+(v!=null?v:'-')+'</td></tr>';
                        }
                        html += '</tbody></table>';
                        if(ev.suggestions && ev.suggestions.trim()) html += '<p class="mt-3 text-sm text-slate-600"><span class="font-bold">건의사항:</span> ' + esc(ev.suggestions) + '</p>';
                        html += '</div></div>';
                    });
                    html += '</div></div>';
                });
                document.getElementById('content').innerHTML = html;
            }).catch(function(){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='요청 실패'; });
        })();
    </script>
</body>
</html>
`;
