import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

/** 수업평가 15문항 (긍정화정도 5=강함 ~ 1=약함) */
const INSTRUCTOR_EVAL_QUESTIONS = [
    '출석을 정확히 확인하였다.',
    '수업계획에 따라 성실히 수업을 진행하였다.',
    '수업목표를 명확히 제시하였다.',
    '수업시간을 정확히 준수하였다.',
    '수업에 대한 성실한 자세를 보였다.',
    '적절한 수업운영 방법을 사용하였다.',
    '보조자료를 적절히 활용하였다.',
    '수업 마무리 시 차시 예고를 하였다.',
    '과제를 적절히 부여하고 평가하였다.',
    '수강생 개인의 학습 적응도를 주기적으로 점검하였다.',
    '실기 시 관련 이론을 충분히 설명하였다.',
    '실기 도구를 효과적으로 활용하여 수업을 진행하였다.',
    '실기 도구 사용 시 발생한 문제를 적절히 해결하였다.',
    '본인 강의 내용이 훈련생에게 도움이 된다고 생각한다.',
    '훈련생이 수업목표를 어느 정도 달성하였다고 생각한다.',
];

/** 교강사직무능력평가 작성/수정 폼 */
export const adminLmsInstructorEvalFormHtml = (sidebar: string = hrdSidebar('courses')) => {
    const questionsRows = INSTRUCTOR_EVAL_QUESTIONS.map((q, i) => `
        <tr class="border-b border-slate-100">
            <td class="py-3 px-4 text-sm text-slate-800">${i + 1}. ${q}</td>
            <td class="py-3 px-2 text-center"><input type="radio" name="q${i + 1}" value="5" class="accent-indigo-600"></td>
            <td class="py-3 px-2 text-center"><input type="radio" name="q${i + 1}" value="4" class="accent-indigo-600"></td>
            <td class="py-3 px-2 text-center"><input type="radio" name="q${i + 1}" value="3" class="accent-indigo-600"></td>
            <td class="py-3 px-2 text-center"><input type="radio" name="q${i + 1}" value="2" class="accent-indigo-600"></td>
            <td class="py-3 px-2 text-center"><input type="radio" name="q${i + 1}" value="1" class="accent-indigo-600"></td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교강사직무능력평가 - 와우쓰리디</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}</style>
</head>
<body class="bg-slate-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('instructor-eval')}
                <main class="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                        <div class="p-6 md:p-10">
                            <h1 class="text-2xl font-black text-slate-900 text-center mb-2" id="formTitle">수업평가 (평가자: 본인)</h1>
                            <p class="text-sm text-slate-500 text-center mb-4" id="formSub">-</p>
                            <input type="hidden" id="sessionId" value="">
                            <input type="hidden" id="subjectName" value="">
                            <input type="hidden" id="evaluatorType" value="">
                            <input type="hidden" id="instructorId" value="">
                            <table class="w-full border border-slate-200 rounded-xl overflow-hidden text-sm mb-6">
                                <tbody>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600 w-28">과정명</td><td id="courseTitle" class="py-2 px-4 text-slate-800">-</td><td colspan="2" class="bg-slate-50 py-2 px-4 font-bold text-slate-600 text-center border-l border-slate-200 w-32">결재</td></tr>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">과정 일자</td><td id="courseDates" class="py-2 px-4 text-slate-800">-</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 border-l border-slate-200 w-16">원장</td><td class="bg-slate-50 py-1 px-2 text-center text-slate-600 w-16">담당</td></tr>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">교과목</td><td id="subjectDisplay" class="py-2 px-4 text-slate-800">-</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">담당강사</td><td id="instructorName" class="py-2 px-4 text-slate-800">-</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">평가자</td><td id="evaluatorLabel" class="py-2 px-4 text-slate-800">-</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>
                                    <tr class="border-b border-slate-200"><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">소속</td><td id="affiliation" class="py-2 px-4 text-slate-800">-</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>
                                    <tr><td class="bg-slate-50 py-2 px-4 font-bold text-slate-600">성명</td><td id="evaluatorName" class="py-2 px-4 text-slate-800">-</td><td class="py-2 px-2 border-l border-slate-200"></td><td class="py-2 px-2"></td></tr>
                                </tbody>
                            </table>
                            <table class="w-full border border-slate-200 rounded-2xl overflow-hidden text-sm mb-6">
                                <thead>
                                    <tr class="bg-slate-100 border-b border-slate-200">
                                        <th class="text-left py-3 px-4 font-bold text-slate-700">평가내용</th>
                                        <th class="text-center py-2 px-2 w-14 font-bold text-slate-600">5</th>
                                        <th class="text-center py-2 px-2 w-14 font-bold text-slate-600">4</th>
                                        <th class="text-center py-2 px-2 w-14 font-bold text-slate-600">3</th>
                                        <th class="text-center py-2 px-2 w-14 font-bold text-slate-600">2</th>
                                        <th class="text-center py-2 px-2 w-14 font-bold text-slate-600">1</th>
                                    </tr>
                                    <tr class="bg-slate-50 border-b border-slate-200"><td colspan="6" class="py-1 px-4 text-xs text-slate-500">긍정화정도 (강함=5 ~ 약함=1)</td></tr>
                                </thead>
                                <tbody>${questionsRows}</tbody>
                            </table>
                            <div class="mb-6">
                                <label class="block text-sm font-bold text-slate-700 mb-2">건의사항</label>
                                <textarea id="suggestions" rows="4" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="건의사항을 입력하세요"></textarea>
                            </div>
                            <div class="mb-6 flex justify-end items-center">
                                <label class="text-sm font-bold text-slate-700 mr-3 mb-0">총점</label>
                                <input type="number" id="totalScore" min="15" max="75" readonly class="w-24 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800 text-right">
                                <span class="ml-2 text-slate-600 font-bold">/ 75점 만점</span>
                            </div>
                            <div class="flex gap-3 justify-end">
                                <a href="#" id="backLink" class="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200">목록으로</a>
                                <button type="button" id="submitBtn" class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700">저장</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
    <script>
        (function(){
            var pathParts = window.location.pathname.split('/');
            var courseId = pathParts[pathParts.indexOf('courses')+1];
            var params = new URLSearchParams(window.location.search);
            var subject = params.get('subject') ? decodeURIComponent(params.get('subject')) : '';
            var evaluator = params.get('evaluator') || 'self';
            var instructorId = params.get('instructor_id') || '';
            var token = localStorage.getItem('token');
            var isTeacher = window.location.pathname.indexOf('/teacher') >= 0;
            var basePath = (isTeacher ? '/teacher/courses/' : '/admin/courses/') + courseId + '/lms';
            var qs = window.location.search || '';

            document.getElementById('sessionId').value = courseId;
            document.getElementById('subjectName').value = subject;
            document.getElementById('evaluatorType').value = evaluator;
            document.getElementById('instructorId').value = instructorId;
            document.getElementById('backLink').href = basePath + '/instructor-eval' + qs;
            document.getElementById('formTitle').textContent = evaluator === 'admin' ? '수업평가 (평가자: 원장/관리자)' : '수업평가 (평가자: 본인)';
            document.getElementById('formSub').textContent = subject || '-';
            document.getElementById('subjectDisplay').textContent = subject || '-';
            document.getElementById('evaluatorLabel').textContent = evaluator === 'admin' ? '원장(관리자)' : '담당강사(본인)';

            function fmtDate(s){ if(!s) return ''; var d = (s+'').split('T')[0]; return d ? d.replace(/-/g,'.') : ''; }
            fetch('/api/courses/'+courseId+(qs?'?'+qs.substring(1):''), { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){
                    if(res&&res.success&&res.data){
                        var d = res.data;
                        document.getElementById('courseTitle').textContent = d.title || '-';
                        document.getElementById('courseDates').textContent = (fmtDate(d.start_date) && fmtDate(d.end_date)) ? (fmtDate(d.start_date) + ' ~ ' + fmtDate(d.end_date)) : '-';
                    }
                })
                .catch(function(){});
            fetch('/api/instructor-eval/subjects?session_id='+encodeURIComponent(courseId), { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){
                    if(res&&res.success&&res.data){
                        var sub = (res.data||[]).find(function(row){ return (row.subject_name||'') === subject; });
                        if(sub) document.getElementById('instructorName').textContent = sub.instructor_name || '-';
                    }
                })
                .catch(function(){});

            function updateTotal(){
                var sum = 0;
                for(var i=1;i<=15;i++){
                    var r = document.querySelector('input[name="q'+i+'"]:checked');
                    if(r) sum += parseInt(r.value,10);
                }
                document.getElementById('totalScore').value = sum || '';
            }
            for(var i=1;i<=15;i++){
                var inputs = document.querySelectorAll('input[name="q'+i+'"]');
                inputs.forEach(function(inp){ inp.addEventListener('change', updateTotal); });
            }

            if(token){
                fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer '+token } }).then(function(r){ return r.json(); }).then(function(res){
                    if(res&&res.success&&res.data){ document.getElementById('evaluatorName').textContent = res.data.name || '-'; document.getElementById('affiliation').textContent = '와우쓰리디(WOW3D) 홍대센터'; }
                });
            }

            var byParamsUrl = '/api/instructor-eval/by-params?session_id='+encodeURIComponent(courseId)+'&subject_name='+encodeURIComponent(subject)+'&evaluator_type='+encodeURIComponent(evaluator);
            if(instructorId) byParamsUrl += '&instructor_id='+encodeURIComponent(instructorId);
            fetch(byParamsUrl, { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){
                    if(res&&res.success&&res.data){
                        var d = res.data;
                        for(var i=1;i<=15;i++){
                            var v = d['q'+i];
                            if(v!=null){ var radio = document.querySelector('input[name="q'+i+'"][value="'+String(v)+'"]'); if(radio) radio.checked = true; }
                        }
                        if(d.suggestions) document.getElementById('suggestions').value = d.suggestions || '';
                        if(d.total_score!=null) document.getElementById('totalScore').value = d.total_score;
                        updateTotal();
                    }
                })
                .catch(function(){});

            document.getElementById('submitBtn').addEventListener('click', function(){
                var sessionId = document.getElementById('sessionId').value;
                var subjectName = document.getElementById('subjectName').value;
                var evaluatorType = document.getElementById('evaluatorType').value;
                var instructorIdVal = document.getElementById('instructorId').value;
                var payload = { session_id: parseInt(sessionId,10), subject_name: subjectName, evaluator_type: evaluatorType, instructor_id: instructorIdVal ? parseInt(instructorIdVal,10) : null, suggestions: document.getElementById('suggestions').value };
                for(var i=1;i<=15;i++){
                    var r = document.querySelector('input[name="q'+i+'"]:checked');
                    payload['q'+i] = r ? parseInt(r.value,10) : null;
                }
                var total = 0; for(var i=1;i<=15;i++) if(payload['q'+i]!=null) total += payload['q'+i];
                payload.total_score = total;
                var btn = document.getElementById('submitBtn'); btn.disabled = true; btn.textContent = '저장 중...';
                fetch('/api/instructor-eval', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token }, body: JSON.stringify(payload) })
                    .then(function(r){ return r.json(); })
                    .then(function(res){
                        if(res&&res.success){ alert(res.message || '저장되었습니다.'); window.location.href = basePath + '/instructor-eval' + qs; }
                        else { alert(res&&res.error ? res.error : '저장에 실패했습니다.'); btn.disabled = false; btn.textContent = '저장'; }
                    })
                    .catch(function(){ alert('요청 실패'); btn.disabled = false; btn.textContent = '저장'; });
            });
        })();
    </script>
</body>
</html>
`;
};
