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
        .tab-btn{ padding:0.75rem 1.5rem; font-weight:700; border-radius:1rem; transition:all 0.2s; }
        .tab-btn.active{ background:#4f46e5; color:#fff; }
        .tab-btn:not(.active){ background:#f1f5f9; color:#64748b; }
        .tab-btn:not(.active):hover{ background:#e2e8f0; }
        .tab-panel{ display:none; }
        .tab-panel.active{ display:block; }
        @media print{
            body *{visibility:hidden}
            .results-print-area,.results-print-area *{visibility:visible}
            .results-print-area{position:absolute;left:0;top:0;width:100%}
            .print-hide{display:none!important}
            .eval-subject-panel{display:none!important}
            .eval-subject-panel.print-this{display:block!important;visibility:visible}
            .eval-subject-panel.print-this .tab-panel.active{display:block!important;visibility:visible}
            .eval-subject-panel.print-this .tab-panel:not(.active){display:none!important}
            .accordion-btn { display: none !important; }
            .accordion-content { border: none !important; padding: 0 !important; margin: 0 !important; }
            .accordion-item { margin: 0 !important; }
        }
        .accordion-btn { w-full; text-align:left; padding:1.25rem 1.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:1rem; font-weight:700; color:#334155; display:flex; justify-content:space-between; align-items:center; transition:all 0.2s; cursor:pointer;}
        .accordion-btn:hover { background:#f1f5f9; border-color:#cbd5e1; }
        .accordion-btn.open { background:#e2e8f0; border-color:#cbd5e1; border-bottom-left-radius:0; border-bottom-right-radius:0; color:#0f172a; border-bottom-color:transparent; }
        .accordion-btn .icon { transition:transform 0.2s; }
        .accordion-btn.open .icon { transform:rotate(180deg); }
        .accordion-content { display:none; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:1rem; border-bottom-right-radius:1rem; padding:1.5rem; background:#fff; margin-bottom:1rem; }
        .accordion-content.open { display:block; }
        .eval-subject-panel{ display:block; } /* accordion wraps this */
    </style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        <div class="print-hide">${sidebar}</div>
        <div class="flex-1 flex flex-col min-w-0">
            <div class="print-hide">${lmsHeaderHtml('instructor-eval')}</div>
            <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0 p-6 md:p-10 results-print-area">
                <div class="max-w-4xl mx-auto">
                    <div class="print-hide flex items-center justify-between mb-6">
                        <a href="#" id="backLink" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50"> <i class="fas fa-arrow-left"></i> 목록으로 </a>
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
                            <div id="content" class="hidden">
                                <div id="subjectContentAreas" class="space-y-4"></div>
                            </div>
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
            var courseId = new URLSearchParams(window.location.search).get('session_id') || pathParts[pathParts.indexOf('courses')+1];
            var token = localStorage.getItem('token');
            var isTeacher = window.location.pathname.indexOf('/teacher') >= 0;
            var basePath = (isTeacher ? '/teacher/courses/' : '/admin/courses/') + courseId + '/lms';
            var qsParams = new URLSearchParams(window.location.search);
            qsParams.delete('subject'); qsParams.delete('evaluator'); qsParams.delete('instructor_id');
            var cleanQs = qsParams.toString() ? '?' + qsParams.toString() : '';

            document.getElementById('backLink').href = basePath + '/instructor-eval' + cleanQs;

            if(!courseId || !token){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='권한이 없습니다.'; return; }

            function fmtDate(s){ if(!s) return ''; var d = (s+'').split('T')[0]; return d ? d.replace(/-/g,'.') : ''; }
            function esc(s){ if(s==null) return ''; return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

            Promise.all([
                fetch('/api/courses/'+courseId+cleanQs, { headers: { 'Authorization': 'Bearer '+token } }).then(function(r){ return r.json(); }),
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
                function renderBlock(typ, row, instructorName, courseTitle, courseDates){
                    var ev = typ==='admin' ? row.admin : row.self;
                    var label = typ==='admin' ? '원장(관리자) 평가' : '담당강사(본인) 평가';
                    var out = '';
                    if(!ev){ out += '<div class="border border-slate-200 rounded-xl overflow-hidden"><div class="bg-slate-50 px-4 py-3 font-bold text-slate-600">' + label + '</div><div class="p-4 text-sm text-slate-500">미작성</div></div>'; return out; }
                    out += '<div class="border border-slate-200 rounded-xl overflow-hidden">';
                    out += '<div class="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + label + ' 결과표</div>';
                    out += '<div class="p-4">';
                    out += '<table class="w-full border border-slate-200 rounded-xl overflow-hidden text-sm mb-4"><tbody>';
                    out += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600 w-28">교과목</td><td class="py-2 px-4 text-slate-800">' + esc(row.subject_name) + '</td><td colspan="2" class="bg-slate-50 py-2 px-4 font-bold text-slate-600 text-center border-l border-slate-200 w-32">결재</td></tr>';
                    out += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">담당강사</td><td class="py-2 px-4 text-slate-800">' + esc(instructorName) + '</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 border-l border-slate-200 w-16">원장</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 w-16">담당</td></tr>';
                    out += '<tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">평가자 / 소속</td><td class="py-2 px-4 text-slate-800">' + (typ==='admin' ? '원장(관리자) / 와우쓰리디(WOW3D) 홍대센터' : '담당강사(본인) / 와우쓰리디(WOW3D) 홍대센터') + '</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>';
                    out += '</tbody></table>';
                    var scoreDisplay = ev.total_score != null ? (ev.total_score + ' / 75점 만점') : '-';
                    out += '<p class="text-sm font-bold text-slate-700 mb-2 text-right">총점 <span class="text-indigo-700">' + scoreDisplay + '</span></p>';
                    out += '<table class="w-full text-xs border border-slate-200 rounded-lg overflow-hidden"><thead><tr class="bg-slate-50"><th class="text-left py-2 px-3 font-bold text-slate-600">문항</th><th class="text-center w-10">점수</th></tr></thead><tbody>';
                    for(var i=1;i<=15;i++){
                        var v = ev['q'+i];
                        var qLabel = questionLabels[i-1] || '';
                        out += '<tr class="border-t border-slate-100"><td class="py-1.5 px-3 text-slate-700">'+i+'. '+qLabel+'</td><td class="text-center font-bold">'+(v!=null?v:'-')+'</td></tr>';
                    }
                    out += '</tbody></table>';
                    if(ev.suggestions && ev.suggestions.trim()) out += '<p class="mt-3 text-sm text-slate-600"><span class="font-bold">건의사항:</span> ' + esc(ev.suggestions) + '</p>';
                    out += '</div></div>';
                    return out;
                }
                var subjectContentHtml = '';

                keys.forEach(function(key, idx){
                    var row = bySubjectInstructor[key];
                    var instructorName = row.instructor_name || (row.admin && row.admin.instructor_name) || (row.self && row.self.instructor_name) || '-';
                    var safeId = 'subj-' + idx;
                    
                    var isOpen = idx === 0 ? 'open' : '';
                    
                    subjectContentHtml += '<div class="accordion-item" data-id="' + safeId + '">';
                    subjectContentHtml += '<button type="button" class="accordion-btn ' + isOpen + ' w-full text-left" data-target="' + safeId + '"><span>' + esc(row.subject_name) + ' (' + esc(instructorName) + ')</span><i class="fas fa-chevron-down icon"></i></button>';
                    
                    subjectContentHtml += '<div id="' + safeId + '" class="accordion-content ' + isOpen + '">';
                    subjectContentHtml += '<div class="eval-subject-panel active">'; // always active inside open accordion
                    
                    subjectContentHtml += '<div class="print-hide flex items-center justify-between mb-6">';
                    subjectContentHtml += '<div class="flex gap-2">';
                    subjectContentHtml += '<button type="button" class="tab-btn active" data-subj="' + safeId + '" data-tab="admin">원장평가</button>';
                    subjectContentHtml += '<button type="button" class="tab-btn" data-subj="' + safeId + '" data-tab="self">강사평가</button>';
                    subjectContentHtml += '</div>';
                    subjectContentHtml += '<button type="button" class="print-local-btn inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200" data-subj="' + safeId + '"><i class="fas fa-print"></i> 현재 탭 인쇄</button>';
                    subjectContentHtml += '</div>';
                    
                    subjectContentHtml += '<div id="' + safeId + '-admin" class="tab-panel active" data-tab="admin">';
                    subjectContentHtml += '<div class="border border-slate-200 rounded-2xl overflow-hidden mb-8"><div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + esc(row.subject_name) + ' · 담당강사 ' + esc(instructorName) + '</div><div class="p-4 space-y-8">' + renderBlock('admin', row, instructorName, courseTitle, courseDates) + '</div></div>';
                    subjectContentHtml += '</div>';

                    subjectContentHtml += '<div id="' + safeId + '-self" class="tab-panel" data-tab="self">';
                    subjectContentHtml += '<div class="border border-slate-200 rounded-2xl overflow-hidden mb-8"><div class="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">' + esc(row.subject_name) + ' · 담당강사 ' + esc(instructorName) + '</div><div class="p-4 space-y-8">' + renderBlock('self', row, instructorName, courseTitle, courseDates) + '</div></div>';
                    subjectContentHtml += '</div>';
                    
                    subjectContentHtml += '</div>'; // eval-subject-panel
                    subjectContentHtml += '</div>'; // accordion-content
                    subjectContentHtml += '</div>'; // accordion-item
                });
                
                document.getElementById('subjectContentAreas').innerHTML = subjectContentHtml;

                // 아코디언 토글 이벤트
                document.querySelectorAll('.accordion-btn').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        var targetId = this.getAttribute('data-target');
                        var content = document.getElementById(targetId);
                        
                        // 아코디언은 여러 개 열어둘 수도 있지만, 이전에 작성된 활성화 로직 유지 차원에서 열린 탭 닫기 후 현재 탭만 토글
                        document.querySelectorAll('.accordion-btn').forEach(function(b){ if(b !== btn) b.classList.remove('open'); });
                        document.querySelectorAll('.accordion-content').forEach(function(c){ if(c !== content) c.classList.remove('open'); });
                        
                        this.classList.toggle('open');
                        content.classList.toggle('open');
                    });
                });

                // 하위 탭 (원장 / 강사) 이벤트
                document.querySelectorAll('.tab-btn').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        var t = this.getAttribute('data-tab');
                        var subj = this.getAttribute('data-subj');
                        
                        // 해당 과목(subj) 내의 탭 버튼들만 on/off
                        var parentPanel = document.getElementById(subj);
                        parentPanel.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
                        parentPanel.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
                        
                        this.classList.add('active');
                        document.getElementById(subj + '-' + t).classList.add('active');
                    });
                });

                document.querySelectorAll('.print-local-btn').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        var subj = this.getAttribute('data-subj');
                        var activeSubjPanel = document.getElementById(subj).querySelector('.eval-subject-panel');
                        if(activeSubjPanel) {
                            activeSubjPanel.classList.add('print-this');
                            window.print();
                            activeSubjPanel.classList.remove('print-this');
                        }
                    });
                });
            }).catch(function(){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='요청 실패'; });
        })();
    </script>
</body>
</html>
`;
