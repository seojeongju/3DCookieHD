
import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const studentClassroomHtml = (sessionId: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>강의실 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .bento-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
        .nav-tab.active { background: rgb(240 249 255); color: rgb(7 89 133); font-weight: 900; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900">
    ${navigationHtml('classroom')}

    <div id="loadingOverlay" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div class="text-center">
            <i class="fas fa-circle-notch fa-spin text-4xl text-sky-500 mb-4"></i>
            <p class="text-slate-500 font-bold">강의실 입장 중...</p>
        </div>
    </div>

    <div id="pinModal" class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 hidden flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <i class="fas fa-lock text-2xl"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 tracking-tight">접근 코드 입력</h2>
                <p class="text-sm text-slate-500 mt-2 font-medium">이 강의실은 보안 코드가 설정되어 있습니다.<br>담당 강사에게 코드를 문의하세요.</p>
            </div>
            <form onsubmit="handlePinSubmit(event)" class="space-y-4">
                <input type="password" id="pinInput" class="w-full text-center text-2xl font-black tracking-[0.5em] px-4 py-4 border-2 border-slate-200 rounded-2xl focus:border-sky-500 outline-none" placeholder="PIN 입력" maxlength="8" required autofocus>
                <button type="submit" class="w-full py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-slate-900 transition">입장하기</button>
            </form>
            <a href="/student" class="block w-full mt-3 py-3 text-center text-slate-400 font-bold text-xs hover:text-slate-600">나의 강의실로</a>
        </div>
    </div>

    <div id="assignModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
        <div class="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl">
            <h3 class="text-lg font-black tracking-tight mb-2" id="assignModalTitle">과제 제출</h3>
            <p class="text-sm text-slate-500 mb-4" id="assignModalDue"></p>
            <textarea id="assignContent" rows="6" class="w-full rounded-2xl border border-slate-200 p-4 text-sm mb-4 outline-none focus:border-sky-500" placeholder="제출 내용 또는 작업 링크를 입력하세요."></textarea>
            <div class="flex gap-2">
                <button type="button" onclick="closeAssignModal()" class="flex-1 min-h-[44px] rounded-2xl border border-slate-200 font-black text-sm">취소</button>
                <button type="button" onclick="submitAssignment()" class="flex-1 min-h-[44px] rounded-2xl bg-sky-600 text-white font-black text-sm">제출</button>
            </div>
        </div>
    </div>

    <main id="classroomContent" class="hidden min-h-screen pt-6 pb-24 sm:pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <a href="/student" class="inline-flex items-center gap-1 text-xs font-black text-sky-600 mb-2"><i class="fas fa-arrow-left"></i> 나의 강의실</a>
                    <span class="block text-[10px] font-black uppercase tracking-widest text-sky-600 mb-1">CLASSROOM</span>
                    <h1 id="courseTitle" class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">강의명 로딩 중...</h1>
                    <p id="sessionInfo" class="text-slate-500 font-medium text-sm"></p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                <div class="lg:col-span-3 space-y-4">
                    <div class="bg-white rounded-[2rem] p-4 sm:p-6 border border-slate-200/60 shadow-sm">
                        <div class="grid grid-cols-2 lg:grid-cols-1 gap-2" id="tabNav">
                            <button onclick="loadTab('home')" id="tab-home" class="nav-tab active w-full text-left px-4 py-3 rounded-2xl text-sm transition flex items-center gap-3"><i class="fas fa-home w-5"></i> 홈</button>
                            <button onclick="loadTab('curriculum')" id="tab-curriculum" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-list-ol w-5"></i> 커리큘럼</button>
                            <button onclick="loadTab('exam')" id="tab-exam" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-pen-fancy w-5"></i> 시험응시</button>
                            <button onclick="loadTab('assignments')" id="tab-assignments" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-tasks w-5"></i> 과제제출</button>
                            <button onclick="loadTab('attendance')" id="tab-attendance" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-clock w-5"></i> 출석현황</button>
                            <button onclick="loadTab('notices')" id="tab-notices" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-bullhorn w-5"></i> 공지</button>
                            <button onclick="loadTab('materials')" id="tab-materials" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-download w-5"></i> 자료</button>
                            <button onclick="loadTab('surveys')" id="tab-surveys" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-poll w-5"></i> 설문</button>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm">
                        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">담당 강사</h3>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600"><i class="fas fa-user-tie text-xl"></i></div>
                            <div>
                                <p id="instructorName" class="font-bold text-slate-800">-</p>
                                <p class="text-[10px] text-slate-400 font-medium">Trainer</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-9">
                    <div id="tabContent" class="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/60 shadow-sm min-h-[420px] custom-scrollbar"></div>
                </div>
            </div>
        </div>
    </main>

    ${footerHtml()}

    <script>
        const sessionId = ${JSON.stringify(sessionId)};
        let overview = null;
        let currentUser = null;
        let submitAssignmentId = null;

        function authHeaders() {
            return { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' };
        }
        function esc(v) {
            return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
        }
        function fmtDate(v) {
            if (!v) return '미정';
            var d = new Date(v);
            if (isNaN(d.getTime())) return String(v).slice(0, 10);
            return d.toLocaleDateString('ko-KR');
        }
        function emptyState(icon, msg) {
            return '<div class="text-center py-16"><i class="fas ' + icon + ' text-4xl text-slate-300 mb-4"></i><p class="text-slate-500 font-bold">' + msg + '</p></div>';
        }

        document.addEventListener('DOMContentLoaded', async () => {
            await checkAuth();
            await loadOverview();
        });

        async function checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login?redirect=/student/classroom/' + sessionId;
                return;
            }
            try {
                const res = await fetch('/api/auth/me', { headers: authHeaders() });
                const json = await res.json();
                currentUser = json.data || json;
            } catch (e) {}
        }

        async function loadOverview() {
            try {
                const res = await fetch('/api/student/classroom/' + sessionId, { headers: authHeaders() });
                const json = await res.json();
                if (res.status === 401) {
                    window.location.href = '/login?redirect=/student/classroom/' + sessionId;
                    return;
                }
                if (!json.success || !json.data) {
                    alert(json.error || '이 강의실에 등록되어 있지 않습니다.');
                    window.location.href = '/student';
                    return;
                }
                overview = json.data;
                if (overview.has_access_code === 1 && !sessionStorage.getItem('access_verified_' + sessionId)) {
                    document.getElementById('loadingOverlay').classList.add('hidden');
                    document.getElementById('pinModal').classList.remove('hidden');
                    return;
                }
                renderShell();
            } catch (e) {
                console.error(e);
                alert('강의실을 불러오지 못했습니다.');
            }
        }

        async function handlePinSubmit(e) {
            e.preventDefault();
            const pin = document.getElementById('pinInput').value;
            try {
                const res = await fetch('/api/course-sessions/' + sessionId + '/verify-access', {
                    method: 'POST', headers: authHeaders(), body: JSON.stringify({ code: pin })
                });
                const json = await res.json();
                if (json.success) {
                    sessionStorage.setItem('access_verified_' + sessionId, 'true');
                    document.getElementById('pinModal').classList.add('hidden');
                    renderShell();
                } else {
                    alert('올바르지 않은 코드입니다.');
                    document.getElementById('pinInput').value = '';
                }
            } catch (err) {
                alert('검증 중 오류가 발생했습니다.');
            }
        }

        function renderShell() {
            document.getElementById('loadingOverlay').classList.add('hidden');
            document.getElementById('classroomContent').classList.remove('hidden');
            let title = overview.course_name || '제목 없음';
            if (overview.session_number) title += ' (' + overview.session_number + '회차)';
            document.getElementById('courseTitle').textContent = title;
            document.getElementById('sessionInfo').innerHTML = '<i class="far fa-calendar-alt mr-2"></i>' + fmtDate(overview.training_start_date) + ' ~ ' + fmtDate(overview.training_end_date) + ' &nbsp;|&nbsp; <i class="fas fa-map-marker-alt mr-2"></i> ' + esc(overview.location || '장소 미정');
            document.getElementById('instructorName').textContent = overview.instructor_name || '미정';
            loadTab('home');
        }

        window.loadTab = async function(tab) {
            document.querySelectorAll('.nav-tab').forEach(function(btn) {
                btn.classList.toggle('active', btn.id === 'tab-' + tab);
                if (btn.id !== 'tab-' + tab) {
                    btn.classList.add('text-slate-600');
                } else {
                    btn.classList.remove('text-slate-600');
                }
            });
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            if (tab === 'home') return renderHome();
            if (tab === 'curriculum') return renderCurriculum();
            if (tab === 'exam') return renderExams();
            if (tab === 'assignments') return renderAssignments();
            if (tab === 'attendance') return renderAttendance();
            if (tab === 'notices') return renderNotices();
            if (tab === 'materials') return renderMaterials();
            if (tab === 'surveys') return renderSurveys();
        };

        function renderHome() {
            const att = overview.attendance || {};
            const upcoming = overview.upcoming || [];
            let html = '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">';
            html += '<div class="rounded-[2rem] bg-sky-50 border border-sky-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-sky-600">출석률</p><p class="text-3xl font-black mt-1">' + (att.rate || 0) + '%</p><p class="text-xs text-slate-500 mt-1">' + (att.attended || 0) + ' / ' + (att.recorded || 0) + '일</p></div>';
            html += '<div class="rounded-[2rem] bg-slate-50 border border-slate-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-slate-400">기간</p><p class="text-sm font-black mt-2 leading-relaxed">' + fmtDate(overview.training_start_date) + '<br>~ ' + fmtDate(overview.training_end_date) + '</p></div>';
            html += '<div class="rounded-[2rem] bg-slate-50 border border-slate-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-slate-400">장소</p><p class="text-sm font-black mt-2">' + esc(overview.location || '미정') + '</p></div>';
            html += '</div><h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">다가오는 수업</h3>';
            if (!upcoming.length) {
                html += emptyState('fa-calendar', '예정된 시간표가 없습니다.');
            } else {
                html += '<div class="space-y-3">' + upcoming.map(function(row) {
                    return '<div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"><div><p class="text-sm font-black">' + esc(row.subject_name || '수업') + '</p><p class="text-xs text-slate-500">' + esc(row.training_date) + ' · ' + (row.period_number || '') + '교시 ' + esc((row.start_time || '') + (row.end_time ? '–' + row.end_time : '')) + '</p></div><span class="text-xs font-bold text-slate-400">' + esc(row.instructor_name || overview.instructor_name || '') + '</span></div>';
                }).join('') + '</div>';
            }
            document.getElementById('tabContent').innerHTML = html;
        }

        async function renderCurriculum() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/timetable', { headers: authHeaders() });
            const json = await res.json();
            const rows = json.data || [];
            if (!rows.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-list-ol', '등록된 커리큘럼(시간표)이 없습니다.');
                return;
            }
            const groups = {};
            rows.forEach(function(r) {
                const key = r.training_date || '미정';
                if (!groups[key]) groups[key] = [];
                groups[key].push(r);
            });
            let html = '<div class="space-y-6">';
            Object.keys(groups).forEach(function(date) {
                html += '<div><h3 class="text-sm font-black text-slate-800 mb-3">' + esc(date) + '</h3><div class="space-y-2">';
                groups[date].forEach(function(r) {
                    html += '<div class="rounded-2xl border border-slate-100 px-4 py-3 flex flex-wrap items-center justify-between gap-2"><div><span class="text-[10px] font-black text-sky-600 mr-2">' + (r.period_number || '') + '교시</span><span class="font-black text-sm">' + esc(r.subject_name || '교과') + '</span><p class="text-xs text-slate-500 mt-0.5">' + esc((r.start_time || '') + (r.end_time ? ' – ' + r.end_time : '')) + (r.location ? ' · ' + esc(r.location) : '') + '</p></div><span class="text-xs font-bold text-slate-400">' + esc(r.instructor_name || '') + '</span></div>';
                });
                html += '</div></div>';
            });
            html += '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        function examTypeLabel(type) {
            if (type === 'practice') return '사전평가';
            if (type === 'midterm') return '중간';
            if (type === 'final') return '기말';
            if (type === 'mock') return '모의';
            return '시험';
        }

        async function renderExams() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/exams', { headers: authHeaders() });
            const json = await res.json();
            const exams = json.data || [];
            if (!exams.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-pen-fancy', '이 회차에 배정된 시험이 없습니다.');
                return;
            }
            const html = '<div class="space-y-4">' + exams.map(function(e) {
                const submitted = !!e.has_submitted;
                const takeUrl = e.type === 'practice'
                    ? '/student/pre-assessment/take?session_id=' + encodeURIComponent(sessionId) + (e.course_id ? '&course_id=' + e.course_id : '')
                    : '/student/exam/' + e.id;
                const btn = submitted
                    ? '<span class="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black">응시완료</span>'
                    : '<a href="' + takeUrl + '" class="px-4 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black">응시하기</a>';
                return '<div class="rounded-[1.5rem] border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + examTypeLabel(e.type) + '</span><h3 class="font-black mt-1">' + esc(e.title) + '</h3><p class="text-xs text-slate-500 mt-1">' + esc(e.description || '') + (e.time_limit_minutes ? ' · ' + e.time_limit_minutes + '분' : '') + '</p></div>' + btn + '</div>';
            }).join('') + '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        async function renderAssignments() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/assignments', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            window._classroomAssignments = items;
            if (!items.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-tasks', '등록된 과제가 없습니다.');
                return;
            }
            const html = '<div class="space-y-4">' + items.map(function(a) {
                const submitted = !!a.submission_id;
                const status = submitted ? (a.submission_status === 'graded' ? '채점완료 ' + (a.score != null ? a.score + '점' : '') : '제출됨') : '미제출';
                const btn = submitted
                    ? '<button type="button" onclick="openAssignModal(' + a.id + ')" class="px-4 py-2.5 border border-slate-200 rounded-2xl text-[10px] font-black">다시 제출</button>'
                    : '<button type="button" onclick="openAssignModal(' + a.id + ')" class="px-4 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black">제출하기</button>';
                return '<div class="rounded-[1.5rem] border border-slate-100 p-5"><div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3"><div><h3 class="font-black">' + esc(a.title) + '</h3><p class="text-xs text-slate-500 mt-1">마감 ' + fmtDate(a.due_date) + (a.max_score ? ' · ' + a.max_score + '점 만점' : '') + '</p><p class="text-sm text-slate-600 mt-2">' + esc(a.description || '') + '</p>' + (a.feedback ? '<p class="text-xs text-emerald-700 mt-2">피드백: ' + esc(a.feedback) + '</p>' : '') + '</div><div class="text-right shrink-0"><p class="text-[10px] font-black mb-2 ' + (submitted ? 'text-emerald-600' : 'text-amber-600') + '">' + status + '</p>' + btn + '</div></div></div>';
            }).join('') + '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        window.openAssignModal = function(id) {
            submitAssignmentId = id;
            const list = window._classroomAssignments || [];
            const a = list.find(function(x) { return x.id === id; }) || {};
            document.getElementById('assignModalTitle').textContent = a.title || '과제 제출';
            document.getElementById('assignModalDue').textContent = a.due_date ? ('마감: ' + fmtDate(a.due_date)) : '';
            document.getElementById('assignContent').value = '';
            const m = document.getElementById('assignModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        };
        window.closeAssignModal = function() {
            const m = document.getElementById('assignModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        };
        window.submitAssignment = async function() {
            if (!submitAssignmentId || !currentUser || !currentUser.id) {
                alert('로그인 정보를 확인할 수 없습니다.');
                return;
            }
            const content = document.getElementById('assignContent').value.trim();
            if (!content) { alert('제출 내용을 입력하세요.'); return; }
            const res = await fetch('/api/assignments/' + submitAssignmentId + '/submit', {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({ student_id: currentUser.id, content: content })
            });
            const json = await res.json();
            if (json.success) {
                closeAssignModal();
                loadTab('assignments');
            } else {
                alert(json.error || '제출에 실패했습니다.');
            }
        };

        async function renderAttendance() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/attendance', { headers: authHeaders() });
            const json = await res.json();
            const data = json.data || {};
            const logs = data.logs || [];
            const sum = data.summary || {};
            let html = '<div class="rounded-[2rem] bg-sky-50 border border-sky-100 p-5 mb-6 flex items-end justify-between"><div><p class="text-[10px] font-black uppercase tracking-widest text-sky-600">내 출석률</p><p class="text-3xl font-black">' + (sum.rate || 0) + '%</p></div><p class="text-sm font-bold text-slate-500">' + (sum.attended || 0) + '일 출석 / ' + (sum.recorded || 0) + '일 기록</p></div>';
            if (!logs.length) {
                html += emptyState('fa-clock', '출석 기록이 아직 없습니다.');
            } else {
                html += '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-[10px] font-black uppercase tracking-widest text-slate-400"><th class="py-2">날짜</th><th>상태</th><th>입실</th><th>퇴실</th></tr></thead><tbody>';
                logs.forEach(function(l) {
                    html += '<tr class="border-t border-slate-100"><td class="py-3 font-bold">' + esc(l.date) + '</td><td class="font-black ' + (l.attended ? 'text-emerald-600' : 'text-rose-500') + '">' + esc(l.label) + '</td><td class="text-slate-500">' + esc(l.check_in_time || '-') + '</td><td class="text-slate-500">' + esc(l.check_out_time || '-') + '</td></tr>';
                });
                html += '</tbody></table></div>';
            }
            document.getElementById('tabContent').innerHTML = html;
        }

        async function renderNotices() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/notices', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            if (!items.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-bullhorn', '이 과정에 등록된 공지가 없습니다.');
                return;
            }
            document.getElementById('tabContent').innerHTML = '<div class="space-y-3">' + items.map(function(p) {
                return '<button type="button" onclick="openNotice(' + p.id + ')" class="w-full text-left rounded-[1.5rem] border border-slate-100 p-5 hover:border-sky-200 transition"><div class="flex items-center gap-2 mb-1">' + (p.pinned ? '<span class="text-[10px] font-black text-rose-500">고정</span>' : '') + '<span class="text-xs text-slate-400">' + fmtDate(p.created_at) + '</span></div><h3 class="font-black">' + esc(p.title) + '</h3><p class="text-sm text-slate-500 mt-1 line-clamp-2">' + esc(p.excerpt || '') + '</p></button>';
            }).join('') + '</div>';
        }

        window.openNotice = async function(id) {
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            const res = await fetch('/api/posts/' + id, { headers: authHeaders() });
            const json = await res.json();
            const p = json.data || json;
            const body = String(p.content || '').replace(/\[R2:[^\]]+\]/g, '');
            content.innerHTML = '<button type="button" onclick="loadTab(\'notices\')" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button><h2 class="text-xl font-black mb-2">' + esc(p.title) + '</h2><p class="text-xs text-slate-400 mb-6">' + fmtDate(p.created_at) + (p.author_name ? ' · ' + esc(p.author_name) : '') + '</p><div class="prose prose-sm max-w-none text-slate-700 leading-7 whitespace-pre-wrap">' + body + '</div>';
        };

        async function renderMaterials() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/materials', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            if (!items.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-download', '다운로드할 자료가 없습니다.');
                return;
            }
            document.getElementById('tabContent').innerHTML = '<div class="space-y-3">' + items.map(function(m) {
                const url = m.file_url || '#';
                const badge = m.source === 'assignment' ? '과제첨부' : (m.type || '자료');
                return '<a href="' + esc(url) + '" target="_blank" rel="noopener" class="flex items-center justify-between gap-3 rounded-[1.5rem] border border-slate-100 p-5 hover:border-sky-200"><div><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + esc(badge) + '</span><h3 class="font-black mt-1">' + esc(m.title) + '</h3>' + (m.description ? '<p class="text-xs text-slate-500 mt-1">' + esc(m.description) + '</p>' : '') + '</div><i class="fas fa-download text-slate-300"></i></a>';
            }).join('') + '</div>';
        }

        function surveyTypeLabel(type) {
            if (type === 'diagnosis') return '역량진단';
            if (type === 'post_lecture') return '강의평가';
            return '설문';
        }

        async function renderSurveys() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/surveys', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            if (!items.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-poll', '이 회차에 진행 중인 설문이 없습니다.');
                return;
            }
            document.getElementById('tabContent').innerHTML = '<div class="space-y-4">' + items.map(function(s) {
                const pending = s.response_status === 'pending';
                const btn = pending
                    ? '<button type="button" onclick="openSurvey(' + s.id + ')" class="px-4 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black">참여하기</button>'
                    : '<span class="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black">완료</span>';
                return '<div class="rounded-[1.5rem] border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + surveyTypeLabel(s.type) + '</span><h3 class="font-black mt-1">' + esc(s.title) + (s.subject_name ? ' · ' + esc(s.subject_name) : '') + '</h3><p class="text-xs text-slate-500 mt-1">' + fmtDate(s.start_date) + ' ~ ' + fmtDate(s.end_date) + '</p></div>' + btn + '</div>';
            }).join('') + '</div>';
        }

        window.openSurvey = async function(surveyId) {
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            const res = await fetch('/api/surveys/' + surveyId, { headers: authHeaders() });
            const json = await res.json();
            if (!json.success || !json.data) {
                content.innerHTML = emptyState('fa-poll', '설문을 불러올 수 없습니다.') + '<button type="button" onclick="loadTab(\'surveys\')" class="mt-4 text-xs font-black text-sky-600">목록으로</button>';
                return;
            }
            const survey = json.data;
            const questions = survey.questions || [];
            let html = '<button type="button" onclick="loadTab(\'surveys\')" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button>';
            html += '<h2 class="text-xl font-black mb-2">' + esc(survey.title) + '</h2>';
            html += '<p class="text-sm text-slate-500 mb-6 whitespace-pre-wrap">' + esc(survey.description || '') + '</p>';
            html += '<form id="classroomSurveyForm" class="space-y-5" onsubmit="submitSurvey(event, ' + surveyId + ')">';
            questions.forEach(function(q, idx) {
                html += '<div class="rounded-2xl border border-slate-100 p-4"><p class="font-bold text-sm mb-3">' + (idx + 1) + '. ' + esc(q.question_text) + '</p>';
                if (q.question_type === 'text') {
                    html += '<textarea name="q_' + q.id + '" rows="4" class="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="의견을 입력하세요"></textarea>';
                } else {
                    html += '<div class="flex flex-wrap gap-2">';
                    for (var k = 5; k >= 1; k--) {
                        html += '<label class="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"><input type="radio" required name="q_' + q.id + '" value="' + k + '" class="accent-sky-600"> ' + k + '점</label>';
                    }
                    html += '</div>';
                }
                html += '</div>';
            });
            html += '<button type="submit" class="w-full min-h-[44px] rounded-2xl bg-sky-600 text-white font-black">제출하기</button></form>';
            content.innerHTML = html;
        };

        window.submitSurvey = async function(e, surveyId) {
            e.preventDefault();
            const form = document.getElementById('classroomSurveyForm');
            const fd = new FormData(form);
            const answers = [];
            fd.forEach(function(val, key) {
                if (key.indexOf('q_') !== 0) return;
                answers.push({ question_id: parseInt(key.slice(2), 10), answer_value: val });
            });
            const res = await fetch('/api/surveys/' + surveyId + '/submit', {
                method: 'POST', headers: authHeaders(), body: JSON.stringify({ answers: answers })
            });
            const json = await res.json();
            if (json.success) {
                alert('설문이 제출되었습니다.');
                loadTab('surveys');
            } else {
                alert(json.error || json.message || '제출에 실패했습니다.');
            }
        };
    </script>
</body>
</html>
`;
