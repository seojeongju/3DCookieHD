import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

/** 교강사직무능력평가 목록: 과정·교과목별 원장/본인 평가 현황 */
export const adminLmsInstructorEvalHtml = (sidebar: string = hrdSidebar('courses')) => `
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
                <div class="bg-white border-b border-slate-200 sticky top-[6.5rem] z-30">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div>
                            <h2 class="text-xl font-black text-slate-800 tracking-tight">교강사직무능력평가</h2>
                            <p class="text-sm text-slate-500 mt-1">해당 과정·교과목별로 원장(관리자) 평가와 담당강사 본인 평가를 작성할 수 있습니다.</p>
                        </div>
                        <a href="#" id="resultsLink" class="print-hide inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 border border-slate-200/60"> <i class="fas fa-chart-bar"></i> 결과 보기 </a>
                    </div>
                </div>
                <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                        <div class="p-6 md:p-8">
                            <div id="loading" class="py-12 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 불러오는 중...</div>
                            <div id="content" class="hidden">
                                <div class="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                                    <p class="text-sm font-bold text-slate-700" id="courseTitle">-</p>
                                    <p class="text-xs text-slate-500 mt-1" id="courseSub">-</p>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm">
                                        <thead>
                                            <tr class="border-b border-slate-200 bg-slate-50">
                                                <th class="text-left py-3 px-4 font-bold text-slate-600">교과목</th>
                                                <th class="text-left py-3 px-4 font-bold text-slate-600">담당 강사</th>
                                                <th class="text-center py-3 px-4 font-bold text-slate-600">원장(관리자) 평가</th>
                                                <th class="text-center py-3 px-4 font-bold text-slate-600">담당강사(본인) 평가</th>
                                            </tr>
                                        </thead>
                                        <tbody id="listBody"></tbody>
                                    </table>
                                </div>
                                <p id="emptyMsg" class="hidden py-8 text-center text-slate-500">등록된 교과목이 없습니다. 훈련일지/시간표에 교과목이 등록된 회차에서만 평가가 가능합니다.</p>
                            </div>
                            <div id="error" class="hidden py-12 text-center text-red-500 font-bold"></div>
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
            var token = localStorage.getItem('token');
            var isTeacher = window.location.pathname.indexOf('/teacher') >= 0;
            var basePath = isTeacher ? '/teacher/courses/'+courseId+'/lms' : '/admin/courses/'+courseId+'/lms';
            var qs = window.location.search || '';

            if(!courseId || !token){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='권한이 없거나 과정 정보가 없습니다.'; return; }

            document.getElementById('resultsLink').href = basePath + '/instructor-eval/results' + qs;

            function enc(s){ return encodeURIComponent(s||''); }
            function esc(s){ if(s==null)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

            fetch('/api/instructor-eval/list?session_id='+enc(courseId), { headers: { 'Authorization': 'Bearer '+token } })
                .then(function(r){ return r.json(); })
                .then(function(res){
                    document.getElementById('loading').classList.add('hidden');
                    if(!res||!res.success){ document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent = res&&res.error ? res.error : '목록을 불러오지 못했습니다.'; return; }
                    var list = res.data||[];
                    document.getElementById('content').classList.remove('hidden');
                    fetch('/api/courses/'+courseId+(qs?'?'+qs.substring(1):''), { headers: { 'Authorization': 'Bearer '+token } })
                        .then(function(r2){ return r2.json(); })
                        .then(function(cRes){
                            if(cRes&&cRes.success&&cRes.data){ document.getElementById('courseTitle').textContent = cRes.data.title||'-'; document.getElementById('courseSub').textContent = (cRes.data.start_date||'').split('T')[0]+' ~ '+(cRes.data.end_date||'').split('T')[0]; }
                        })
                        .catch(function(){});
                    var tbody = document.getElementById('listBody');
                    var emptyMsg = document.getElementById('emptyMsg');
                    if(list.length===0){ tbody.innerHTML=''; emptyMsg.classList.remove('hidden'); return; }
                    emptyMsg.classList.add('hidden');
                    tbody.innerHTML = list.map(function(row){
                        var subject = enc(row.subject_name);
                        var name = esc(row.instructor_name);
                        var adminDone = row.admin_done; var selfDone = row.self_done;
                        var adminCell = row.can_admin
                            ? (adminDone
                                ? '<span class="text-green-600 text-xs font-bold mr-2">평가완료</span><a href="'+basePath+'/instructor-eval/form?subject='+subject+'&evaluator=admin&instructor_id='+(row.instructor_id||'')+qs+'" class="text-indigo-600 hover:underline font-bold text-xs">수정</a>'
                                : '<a href="'+basePath+'/instructor-eval/form?subject='+subject+'&evaluator=admin&instructor_id='+(row.instructor_id||'')+qs+'" class="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">원장 평가하기</a>')
                            : '-';
                        var selfCell = row.can_self
                            ? (selfDone
                                ? '<span class="text-green-600 text-xs font-bold mr-2">평가완료</span><a href="'+basePath+'/instructor-eval/form?subject='+subject+'&evaluator=self&instructor_id='+(row.instructor_id||'')+qs+'" class="text-amber-600 hover:underline font-bold text-xs">수정</a>'
                                : '<a href="'+basePath+'/instructor-eval/form?subject='+subject+'&evaluator=self&instructor_id='+(row.instructor_id||'')+qs+'" class="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700">본인 평가하기</a>')
                            : '-';
                        return '<tr class="border-b border-slate-100 hover:bg-slate-50/50"><td class="py-4 px-4 font-medium text-slate-800">'+esc(row.subject_name)+'</td><td class="py-4 px-4 text-slate-600">'+name+'</td><td class="py-4 px-4 text-center">'+adminCell+'</td><td class="py-4 px-4 text-center">'+selfCell+'</td></tr>';
                    }).join('');
                })
                .catch(function(){ document.getElementById('loading').classList.add('hidden'); document.getElementById('error').classList.remove('hidden'); document.getElementById('error').textContent='요청 실패'; });
        })();
    </script>
</body>
</html>
`;
