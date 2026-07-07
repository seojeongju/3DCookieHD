import { lmsHeaderHtml } from './components/lms_header';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { teacherSidebar } from './components/teacher_sidebar';

/**
 * 강사 전용 수강생 상담 페이지
 * GET /teacher/courses/:courseId/lms/students/:studentId/consultation
 * - 상담 목록 조회(?all=1로 해당 수강생 전체 상담)
 * - 새 상담 등록 → 관리자 여정과 동일 API로 연동
 */
export function teacherStudentConsultationHtml(courseId: string, studentId: string) {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강생 상담 - 학사관리</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
</head>
<body class="bg-slate-50 overflow-hidden">
    <div class="${LMS_SHELL_ROOT_CLASS}">
        ${teacherSidebar('students')}
        <div class="${LMS_SHELL_COLUMN_CLASS}">
            ${lmsFixedHeaderBlock(lmsHeaderHtml('students', 'hrd'))}
            ${lmsScrollMainOpen()}

                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="mb-6">
                        <a href="/teacher/courses/${courseId}/lms/students?type=hrd" class="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
                            <i class="fas fa-arrow-left"></i> 수강생 목록으로
                        </a>
                    </div>

                    <div class="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                            <div class="flex items-center gap-4">
                                <div class="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl" id="consultStudentInitial">-</div>
                                <div>
                                    <h1 class="text-xl font-black text-slate-900 tracking-tight" id="consultStudentName">로딩 중...</h1>
                                    <p class="text-xs font-bold text-slate-400 mt-0.5" id="consultStudentContact">-</p>
                                </div>
                            </div>
                            <p class="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">이 수강생에 대한 상담 기록을 작성하면 관리자 여정에 연동됩니다.</p>
                        </div>

                        <div class="p-8">
                            <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <i class="fas fa-plus-circle text-indigo-500"></i> 새 상담 등록
                            </h2>
                            <form id="consultForm" class="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 mb-8">
                                <input type="hidden" id="consultCourseId" value="${courseId}">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">상담일</label>
                                        <input type="date" id="consultDate" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">유형</label>
                                        <select id="consultCategory" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="academic">학사/학습</option>
                                            <option value="attendance">출결 관리</option>
                                            <option value="career">취업 지원</option>
                                            <option value="complaint">고충 건의</option>
                                            <option value="other">기타</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">방식</label>
                                        <select id="consultMethod" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="face_to_face">대면</option>
                                            <option value="phone">유선</option>
                                            <option value="online">온라인</option>
                                            <option value="other">기타</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">상담 내용</label>
                                    <textarea id="consultContent" rows="4" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="상담 내용을 입력하세요..."></textarea>
                                </div>
                                <div class="mt-4 flex justify-end">
                                    <button type="submit" class="px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-lg">
                                        <i class="fas fa-paper-plane mr-2"></i>상담 기록 저장
                                    </button>
                                </div>
                            </form>

                            <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <i class="fas fa-history text-slate-500"></i> 상담 기록 목록
                            </h2>
                            <div id="consultationList" class="space-y-4 min-h-[200px]">
                                <div class="text-center text-slate-400 py-12 text-sm">로딩 중...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            var courseId = ${JSON.stringify(courseId)};
            var studentId = ${JSON.stringify(studentId)};
            var token = localStorage.getItem('token');
            if (!token) { location.href = '/login'; return; }

            var catLabels = { academic: '학사/학습', attendance: '출결', career: '취업', complaint: '고충', other: '기타' };
            var methodLabels = { face_to_face: '대면', phone: '유선', online: '온라인', other: '기타' };
            var catStyles = { academic: 'bg-blue-50 text-blue-600', attendance: 'bg-yellow-50 text-yellow-600', career: 'bg-emerald-50 text-emerald-600', complaint: 'bg-red-50 text-red-600', other: 'bg-slate-100 text-slate-600' };

            function setToday() {
                var el = document.getElementById('consultDate');
                if (el && !el.value) {
                    var d = new Date();
                    el.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                }
            }

            function loadStudent() {
                fetch('/api/hrd/students/' + studentId, { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (res.success && res.data) {
                            var s = res.data;
                            document.getElementById('consultStudentName').textContent = s.name || '-';
                            document.getElementById('consultStudentContact').textContent = (s.phone || '') + (s.email ? ' · ' + s.email : '');
                            var initial = (s.name && s.name[0]) ? s.name[0] : '?';
                            document.getElementById('consultStudentInitial').textContent = initial;
                        }
                    })
                    .catch(function() { document.getElementById('consultStudentName').textContent = '수강생 정보를 불러올 수 없습니다.'; });
            }

            function loadConsultations() {
                var list = document.getElementById('consultationList');
                fetch('/api/hrd/students/' + studentId + '/consultations?all=1', { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (!res.success) { list.innerHTML = '<div class="text-center text-red-500 py-8 text-sm">상담 목록을 불러올 수 없습니다.</div>'; return; }
                        var logs = res.data || [];
                        if (logs.length === 0) {
                            list.innerHTML = '<div class="text-center text-slate-400 py-12 text-sm">등록된 상담 기록이 없습니다. 위 폼에서 새 상담을 등록해 보세요.</div>';
                            return;
                        }
                        var html = '';
                        for (var i = 0; i < logs.length; i++) {
                            var log = logs[i];
                            var dateStr = (log.consult_date && log.consult_date.split('T')[0]) || (log.created_at && log.created_at.split('T')[0]) || '';
                            var cat = log.category || 'other';
                            var method = log.method || 'face_to_face';
                            var counselor = log.memo || (log.counselor_role === 'teacher' ? '강사' : '관리자');
                            html += '<div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">' +
                                '<div class="flex flex-wrap items-center gap-2 mb-2">' +
                                '<span class="text-[10px] font-black text-slate-400 uppercase">' + dateStr + '</span>' +
                                '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ' + (catStyles[cat] || catStyles.other) + '">' + (catLabels[cat] || cat) + '</span>' +
                                '<span class="text-[10px] text-slate-400">' + (methodLabels[method] || method) + '</span>' +
                                '<span class="text-[10px] text-slate-400 ml-auto">' + counselor + '</span>' +
                                '</div>' +
                                '<p class="text-sm text-slate-700 whitespace-pre-wrap">' + (log.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' +
                                '</div>';
                        }
                        list.innerHTML = html;
                    })
                    .catch(function() { list.innerHTML = '<div class="text-center text-red-500 py-8 text-sm">오류가 발생했습니다.</div>'; });
            }

            document.getElementById('consultForm').addEventListener('submit', function(e) {
                e.preventDefault();
                var content = document.getElementById('consultContent').value.trim();
                var date = document.getElementById('consultDate').value;
                var category = document.getElementById('consultCategory').value;
                var method = document.getElementById('consultMethod').value;
                var courseIdVal = document.getElementById('consultCourseId').value;
                if (!content) { alert('상담 내용을 입력해 주세요.'); return; }
                fetch('/api/hrd/students/' + studentId + '/consultations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ content: content, date: date, category: category, method: method, course_id: courseIdVal || null })
                })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (res.success) {
                            document.getElementById('consultContent').value = '';
                            setToday();
                            loadConsultations();
                            alert('상담 기록이 저장되었습니다. 관리자 여정에서도 확인할 수 있습니다.');
                        } else {
                            alert('저장 실패: ' + (res.error || '알 수 없는 오류'));
                        }
                    })
                    .catch(function() { alert('저장 중 오류가 발생했습니다.'); });
            });

            setToday();
            loadStudent();
            loadConsultations();
        })();
    </script>
</body>
</html>
`;
}
