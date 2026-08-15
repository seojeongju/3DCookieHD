
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
            <label class="block mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">첨부 파일 (선택)</span>
                <input type="file" id="assignFile" class="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-xs file:font-black file:text-sky-700">
            </label>
            <div class="flex gap-2">
                <button type="button" onclick="closeAssignModal()" class="flex-1 min-h-[44px] rounded-2xl border border-slate-200 font-black text-sm">취소</button>
                <button type="button" onclick="submitAssignment()" class="flex-1 min-h-[44px] rounded-2xl bg-sky-600 text-white font-black text-sm">제출</button>
            </div>
        </div>
    </div>

    <div id="evidenceModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
        <div class="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl">
            <h3 class="text-lg font-black tracking-tight mb-1">NCS 증빙 제출</h3>
            <p class="text-sm text-slate-500 mb-4" id="evidenceUnitName"></p>
            <input type="hidden" id="evidencePlanId">
            <input id="evidenceFileName" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm mb-3" placeholder="제출물 제목">
            <input id="evidenceFileUrl" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm mb-3" placeholder="파일 URL 또는 링크">
            <textarea id="evidenceComment" rows="3" class="w-full rounded-2xl border border-slate-200 p-3 text-sm mb-4" placeholder="메모 (선택)"></textarea>
            <div class="flex gap-2">
                <button type="button" onclick="closeEvidenceModal()" class="flex-1 min-h-[44px] rounded-2xl border border-slate-200 font-black text-sm">취소</button>
                <button type="button" onclick="submitEvidence()" class="flex-1 min-h-[44px] rounded-2xl bg-sky-600 text-white font-black text-sm">제출</button>
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
                <div class="lg:col-span-3 space-y-4 hidden lg:block">
                    <div class="bg-white rounded-[2rem] p-4 sm:p-6 border border-slate-200/60 shadow-sm">
                        <div class="grid grid-cols-1 gap-2" id="tabNav">
                            <button onclick="loadTab('home')" id="tab-home" class="nav-tab active w-full text-left px-4 py-3 rounded-2xl text-sm transition flex items-center gap-3"><i class="fas fa-home w-5"></i> 홈</button>
                            <button onclick="loadTab('curriculum')" id="tab-curriculum" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-list-ol w-5"></i> 커리큘럼</button>
                            <button onclick="loadTab('exam')" id="tab-exam" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-pen-fancy w-5"></i> 시험응시</button>
                            <button onclick="loadTab('assignments')" id="tab-assignments" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-tasks w-5"></i> 과제제출</button>
                            <button onclick="loadTab('attendance')" id="tab-attendance" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-clock w-5"></i> 출석현황</button>
                            <button onclick="loadTab('notices')" id="tab-notices" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-bullhorn w-5"></i> 공지</button>
                            <button onclick="loadTab('qna')" id="tab-qna" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-comments w-5"></i> 질문</button>
                            <button onclick="loadTab('materials')" id="tab-materials" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-download w-5"></i> 자료</button>
                            <button onclick="loadTab('surveys')" id="tab-surveys" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-poll w-5"></i> 설문</button>
                            <button onclick="loadTab('grades')" id="tab-grades" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-chart-bar w-5"></i> 성적</button>
                            <button onclick="loadTab('review')" id="tab-review" class="nav-tab w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"><i class="fas fa-star w-5"></i> 후기</button>
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
                    <div class="lg:hidden mb-4 overflow-x-auto pb-1 -mx-4 px-4">
                        <div class="flex gap-2 min-w-max" id="mobileTabPills"></div>
                    </div>
                    <div id="tabContent" class="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/60 shadow-sm min-h-[420px] custom-scrollbar"></div>
                </div>
            </div>
        </div>
    </main>

    ${footerHtml()}

    <nav id="mobileBottomNav" class="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md" style="padding-bottom: max(0.4rem, env(safe-area-inset-bottom));">
        <div class="grid grid-cols-6 text-center">
            <button type="button" onclick="loadTab('home')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="home"><i class="fas fa-home block text-base mb-0.5"></i>홈</button>
            <button type="button" onclick="loadTab('exam')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="exam"><i class="fas fa-pen-fancy block text-base mb-0.5"></i>시험</button>
            <button type="button" onclick="loadTab('assignments')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="assignments"><i class="fas fa-tasks block text-base mb-0.5"></i>과제</button>
            <button type="button" onclick="loadTab('attendance')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="attendance"><i class="fas fa-clock block text-base mb-0.5"></i>출석</button>
            <button type="button" onclick="loadTab('notices')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="notices"><i class="fas fa-bullhorn block text-base mb-0.5"></i>공지</button>
            <button type="button" onclick="loadTab('qna')" class="mobile-bottom py-2 text-[10px] font-black text-slate-500" data-tab="qna"><i class="fas fa-comments block text-base mb-0.5"></i>질문</button>
        </div>
    </nav>

    <script>
        const sessionId = ${JSON.stringify(sessionId)};
        const TAB_ITEMS = [
            { id: 'home', label: '홈' },
            { id: 'curriculum', label: '커리큘럼' },
            { id: 'exam', label: '시험' },
            { id: 'assignments', label: '과제' },
            { id: 'attendance', label: '출석' },
            { id: 'notices', label: '공지' },
            { id: 'qna', label: '질문' },
            { id: 'materials', label: '자료' },
            { id: 'surveys', label: '설문' },
            { id: 'grades', label: '성적' },
            { id: 'review', label: '후기' }
        ];
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
            const pills = document.getElementById('mobileTabPills');
            if (pills && !pills.dataset.ready) {
                pills.innerHTML = TAB_ITEMS.map(function(t) {
                    return '<button type="button" data-tab="' + t.id + '" class="nav-tab-pill whitespace-nowrap px-3 py-2 rounded-full text-xs font-black border border-slate-200 bg-white text-slate-600">' + t.label + '</button>';
                }).join('');
                pills.addEventListener('click', function(ev) {
                    var b = ev.target.closest('[data-tab]');
                    if (b) loadTab(b.getAttribute('data-tab'));
                });
                pills.dataset.ready = '1';
            }
            const hashTab = (location.hash || '').replace('#', '');
            loadTab(TAB_ITEMS.some(function(t) { return t.id === hashTab; }) ? hashTab : 'home');
        }

        window.addEventListener('hashchange', function() {
            const hashTab = (location.hash || '').replace('#', '');
            if (TAB_ITEMS.some(function(t) { return t.id === hashTab; })) loadTab(hashTab);
        });

        window.loadTab = async function(tab) {
            if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
            document.querySelectorAll('.nav-tab').forEach(function(btn) {
                btn.classList.toggle('active', btn.id === 'tab-' + tab);
                if (btn.id !== 'tab-' + tab) {
                    btn.classList.add('text-slate-600');
                } else {
                    btn.classList.remove('text-slate-600');
                }
            });
            document.querySelectorAll('.nav-tab-pill').forEach(function(btn) {
                var on = btn.getAttribute('data-tab') === tab;
                btn.classList.toggle('bg-sky-600', on);
                btn.classList.toggle('text-white', on);
                btn.classList.toggle('border-sky-600', on);
                btn.classList.toggle('bg-white', !on);
                btn.classList.toggle('text-slate-600', !on);
            });
            document.querySelectorAll('.mobile-bottom').forEach(function(btn) {
                btn.classList.toggle('text-sky-600', btn.getAttribute('data-tab') === tab);
                btn.classList.toggle('text-slate-500', btn.getAttribute('data-tab') !== tab);
            });
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            if (tab === 'home') return renderHome();
            if (tab === 'curriculum') return renderCurriculum();
            if (tab === 'exam') return renderExams();
            if (tab === 'assignments') return renderAssignments();
            if (tab === 'attendance') return renderAttendance();
            if (tab === 'notices') return renderNotices();
            if (tab === 'qna') return renderQna();
            if (tab === 'materials') return renderMaterials();
            if (tab === 'surveys') return renderSurveys();
            if (tab === 'grades') return renderGrades();
            if (tab === 'review') return renderReview();
        };

        function renderHome() {
            const att = overview.attendance || {};
            const upcoming = overview.upcoming || [];
            let html = '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">';
            html += '<div class="rounded-[2rem] bg-sky-50 border border-sky-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-sky-600">출석률</p><p class="text-3xl font-black mt-1">' + (att.rate || 0) + '%</p><p class="text-xs text-slate-500 mt-1">' + (att.attended || 0) + ' / ' + (att.recorded || 0) + '일</p></div>';
            html += '<div class="rounded-[2rem] bg-slate-50 border border-slate-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-slate-400">기간</p><p class="text-sm font-black mt-2 leading-relaxed">' + fmtDate(overview.training_start_date) + '<br>~ ' + fmtDate(overview.training_end_date) + '</p></div>';
            html += '<div class="rounded-[2rem] bg-slate-50 border border-slate-100 p-5"><p class="text-[10px] font-black uppercase tracking-widest text-slate-400">장소</p><p class="text-sm font-black mt-2">' + esc(overview.location || '미정') + '</p></div>';
            html += '</div>';
            const pending = overview.pending || {};
            html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">';
            html += '<button type="button" onclick="loadTab(&#39;exam&#39;)" class="rounded-2xl border border-slate-100 p-4 text-left"><p class="text-[10px] font-black text-slate-400">미응시 시험</p><p class="text-2xl font-black mt-1">' + (pending.exams || 0) + '</p></button>';
            html += '<button type="button" onclick="loadTab(&#39;assignments&#39;)" class="rounded-2xl border border-slate-100 p-4 text-left"><p class="text-[10px] font-black text-slate-400">미제출 과제</p><p class="text-2xl font-black mt-1">' + (pending.assignments || 0) + '</p></button>';
            html += '<button type="button" onclick="loadTab(&#39;surveys&#39;)" class="rounded-2xl border border-slate-100 p-4 text-left"><p class="text-[10px] font-black text-slate-400">미참여 설문</p><p class="text-2xl font-black mt-1">' + (pending.surveys || 0) + '</p></button>';
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
            const [examRes, ncsRes, planRes] = await Promise.all([
                fetch('/api/student/classroom/' + sessionId + '/exams', { headers: authHeaders() }),
                fetch('/api/student/classroom/' + sessionId + '/ncs', { headers: authHeaders() }),
                fetch('/api/student/classroom/' + sessionId + '/ncs-plans', { headers: authHeaders() })
            ]);
            const json = await examRes.json();
            const ncsJson = await ncsRes.json();
            const planJson = await planRes.json();
            const exams = json.data || [];
            const ncs = ncsJson.data || {};
            const plans = planJson.data || [];
            window._ncsPlans = plans;
            let html = '';
            if (ncs.question_count > 0) {
                const ncsBtn = ncs.has_submitted
                    ? '<span class="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black">응시완료</span>'
                    : '<button type="button" onclick="openNcsExam()" class="px-4 py-2.5 bg-amber-500 text-white rounded-2xl text-[10px] font-black">응시하기</button>';
                html += '<div class="rounded-[1.5rem] border border-amber-100 bg-amber-50/60 p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span class="text-[10px] font-black uppercase tracking-widest text-amber-600">NCS 본평가</span><h3 class="font-black mt-1">과정 본평가</h3><p class="text-xs text-slate-500 mt-1">' + ncs.question_count + '문항</p></div>' + ncsBtn + '</div>';
            }
            if (plans.length) {
                html += '<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">NCS 증빙 자료</h3><div class="space-y-3 mb-6">';
                plans.forEach(function(p) {
                    const done = !!p.has_evidence;
                    html += '<div class="rounded-[1.5rem] border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p class="text-[10px] font-black text-sky-600">[' + esc(p.unit_code || '') + ']</p><h3 class="font-black text-sm">' + esc(p.unit_name) + '</h3><p class="text-xs text-slate-500 mt-1">예정 ' + fmtDate(p.planned_date) + (p.method ? ' · ' + esc(p.method) : '') + '</p></div>' + (done ? '<span class="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black">제출완료</span>' : '<button type="button" onclick="openEvidenceModal(' + p.id + ')" class="px-4 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black">제출</button>') + '</div>';
                });
                html += '</div>';
            }
            if (!exams.length && ncs.question_count <= 0 && !plans.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-pen-fancy', '이 회차에 배정된 시험이 없습니다.');
                return;
            }
            html += '<div class="space-y-4">' + exams.map(function(e) {
                const submitted = !!e.has_submitted;
                const takeUrl = e.type === 'practice'
                    ? '/student/pre-assessment/take?session_id=' + encodeURIComponent(sessionId) + (e.course_id ? '&course_id=' + e.course_id : '') + '&from=' + encodeURIComponent('/student/classroom/' + sessionId + '#exam')
                    : '/student/exam/' + e.id + '?from=' + encodeURIComponent('/student/classroom/' + sessionId + '#exam');
                const btn = submitted
                    ? '<span class="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black">응시완료</span>'
                    : '<a href="' + takeUrl + '" class="px-4 py-2.5 bg-sky-600 text-white rounded-2xl text-[10px] font-black">응시하기</a>';
                return '<div class="rounded-[1.5rem] border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + examTypeLabel(e.type) + '</span><h3 class="font-black mt-1">' + esc(e.title) + '</h3><p class="text-xs text-slate-500 mt-1">' + esc(e.description || '') + (e.time_limit_minutes ? ' · ' + e.time_limit_minutes + '분' : '') + '</p></div>' + btn + '</div>';
            }).join('') + '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        window.openNcsExam = async function() {
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i><p class="mt-3 text-sm font-bold">NCS 본평가를 불러오는 중...</p></div>';
            try {
                const res = await fetch('/api/cbt/ncs-course-questions?session_id=' + sessionId, { headers: authHeaders() });
                const json = await res.json();
                const questions = (json && json.success && Array.isArray(json.data)) ? json.data : [];
                if (!questions.length) {
                    content.innerHTML = emptyState('fa-pen-fancy', '이 회차에 NCS 본평가 문제가 없습니다.') + '<button type="button" onclick="loadTab(&#39;exam&#39;)" class="mt-4 text-xs font-black text-sky-600">목록으로</button>';
                    return;
                }
                let html = '<button type="button" onclick="loadTab(&#39;exam&#39;)" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button>';
                html += '<h2 class="text-xl font-black mb-1">NCS 본평가</h2><p class="text-xs text-slate-500 mb-6">총 ' + questions.length + '문항</p>';
                html += '<form id="ncsExamForm" onsubmit="event.preventDefault(); submitNcsExam();" class="space-y-5">';
                questions.forEach(function(q, idx) {
                    html += '<div class="rounded-2xl border border-slate-100 p-5 bg-slate-50/50"><p class="font-bold text-slate-800 mb-3">' + (idx + 1) + '. ' + esc(q.question_text) + '</p>';
                    if (q.question_type === 'multiple_choice' && q.options) {
                        var opts = typeof q.options === 'string' ? (function(){ try { return JSON.parse(q.options); } catch(e){ return []; } })() : (Array.isArray(q.options) ? q.options : []);
                        opts.forEach(function(opt, i) {
                            html += '<label class="flex items-center gap-3 py-2 cursor-pointer"><input type="radio" name="ncs_' + q.id + '" value="' + (i + 1) + '" class="accent-amber-600"> <span>' + esc(opt) + '</span></label>';
                        });
                    } else {
                        html += '<input type="text" name="ncs_' + q.id + '" class="w-full px-4 py-3 border border-slate-200 rounded-xl" placeholder="답을 입력하세요">';
                    }
                    html += '</div>';
                });
                html += '<button type="submit" class="w-full min-h-[44px] rounded-2xl bg-amber-500 text-white font-black">제출하기</button></form>';
                content.innerHTML = html;
            } catch (e) {
                content.innerHTML = emptyState('fa-pen-fancy', '문제를 불러오지 못했습니다.') + '<button type="button" onclick="loadTab(&#39;exam&#39;)" class="mt-4 text-xs font-black text-sky-600">목록으로</button>';
            }
        };

        window.submitNcsExam = async function() {
            const form = document.getElementById('ncsExamForm');
            const content = document.getElementById('tabContent');
            if (!form) return;
            var answers = {};
            form.querySelectorAll('input[name^="ncs_"]').forEach(function(inp) {
                if (inp.type === 'radio') { if (inp.checked) answers[inp.name.replace('ncs_', '')] = inp.value; }
                else answers[inp.name.replace('ncs_', '')] = inp.value || '';
            });
            try {
                const res = await fetch('/api/cbt/ncs-submit', {
                    method: 'POST', headers: authHeaders(),
                    body: JSON.stringify({ session_id: parseInt(sessionId, 10), answers: answers })
                });
                const json = await res.json();
                if (json && json.success && json.data) {
                    var d = json.data;
                    var total = d.total || 0;
                    var score = d.score != null ? d.score : d.correct_count || 0;
                    var pct = total > 0 ? Math.round((score / total) * 100) : 0;
                    content.innerHTML = '<div class="text-center py-10"><div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4"><i class="fas fa-check-double text-2xl"></i></div><h3 class="text-xl font-black">제출 완료</h3><p class="text-3xl font-black text-amber-600 mt-2">' + score + ' / ' + total + ' (' + pct + '%)</p><button type="button" onclick="loadTab(&#39;exam&#39;)" class="mt-6 px-6 py-3 bg-amber-500 text-white rounded-2xl font-black">목록으로</button></div>';
                } else {
                    alert(json.error || '제출에 실패했습니다.');
                }
            } catch (e) {
                alert('제출 중 오류가 발생했습니다.');
            }
        };

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
                return '<div class="rounded-[1.5rem] border border-slate-100 p-5"><div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3"><div><h3 class="font-black">' + esc(a.title) + '</h3><p class="text-xs text-slate-500 mt-1">마감 ' + fmtDate(a.due_date) + (a.max_score ? ' · ' + a.max_score + '점 만점' : '') + '</p><p class="text-sm text-slate-600 mt-2">' + esc(a.description || '') + '</p>' + (a.attachment_url ? '<a href="' + esc(a.attachment_url) + '" target="_blank" class="text-xs font-black text-sky-600 mt-2 inline-block">과제 안내 파일</a>' : '') + (a.submission_file ? '<a href="' + esc(a.submission_file) + '" target="_blank" class="text-xs font-black text-emerald-600 mt-1 inline-block">내 제출 파일</a>' : '') + (a.feedback ? '<p class="text-xs text-emerald-700 mt-2">피드백: ' + esc(a.feedback) + '</p>' : '') + '</div><div class="text-right shrink-0"><p class="text-[10px] font-black mb-2 ' + (submitted ? 'text-emerald-600' : 'text-amber-600') + '">' + status + '</p>' + btn + '</div></div></div>';
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
            const fileEl = document.getElementById('assignFile');
            if (fileEl) fileEl.value = '';
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
            const fileEl = document.getElementById('assignFile');
            const file = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;
            if (!content && !file) { alert('제출 내용 또는 첨부 파일을 입력하세요.'); return; }
            let attachmentUrl = '';
            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('category', 'assignments');
                fd.append('folder', String(currentUser.id));
                const up = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: fd
                });
                const upJson = await up.json();
                attachmentUrl = (upJson.data && upJson.data.url) || upJson.url || '';
                if (!upJson.success || !attachmentUrl) {
                    alert(upJson.error || '파일 업로드에 실패했습니다.');
                    return;
                }
            }
            const res = await fetch('/api/assignments/' + submitAssignmentId + '/submit', {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({ student_id: currentUser.id, content: content || (file ? file.name : ''), attachment_url: attachmentUrl || null })
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
            html += '<form class="rounded-[1.5rem] border border-slate-100 p-5 mb-6" onsubmit="submitQrCheckin(event)"><p class="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2">QR 출석</p><p class="text-xs text-slate-500 mb-3">강사가 보여 주는 QR 코드 값을 입력하면 출석 처리됩니다.</p><div class="flex gap-2"><input id="qrCodeInput" class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="QR 코드" required><button type="submit" class="px-4 rounded-2xl bg-sky-600 text-white text-xs font-black">체크인</button></div></form>';
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

        window.submitQrCheckin = async function(e) {
            e.preventDefault();
            if (!currentUser || !currentUser.id) { alert('로그인 정보를 확인할 수 없습니다.'); return; }
            const code = document.getElementById('qrCodeInput').value.trim();
            if (!code) return;
            const res = await fetch('/api/attendance-qr/checkin', {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({ qr_code: code, student_id: currentUser.id, session_id: parseInt(sessionId, 10), device_info: navigator.userAgent })
            });
            const json = await res.json();
            if (json.success) {
                alert('출석 체크인이 완료되었습니다.');
                loadTab('attendance');
                return;
            }
            const err = String(json.error || '');
            if (err === 'Invalid QR code') alert('올바르지 않은 QR 코드입니다.');
            else if (err === 'QR code expired') alert('유효 시간이 지난 QR 코드입니다.');
            else if (err === 'Already checked in') alert('이미 체크인했습니다.');
            else alert(err || '체크인에 실패했습니다.');
        };

        async function renderGrades() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/grades', { headers: authHeaders() });
            const json = await res.json();
            const data = json.data || {};
            const exams = data.exams || [];
            const assignments = data.assignments || [];
            if (!exams.length && !assignments.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-chart-bar', '채점된 성적 기록이 없습니다.');
                return;
            }
            let html = '<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">시험</h3>';
            if (!exams.length) html += '<p class="text-sm text-slate-400 mb-6">시험 성적이 없습니다.</p>';
            else html += '<div class="space-y-2 mb-8">' + exams.map(function(e) {
                return '<div class="flex justify-between rounded-2xl border border-slate-100 px-4 py-3"><span class="font-black text-sm">' + esc(e.title) + '</span><span class="font-black text-sky-600">' + (e.score != null ? e.score : '-') + (e.total_points ? ' / ' + e.total_points : '') + '</span></div>';
            }).join('') + '</div>';
            html += '<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">과제</h3>';
            if (!assignments.length) html += '<p class="text-sm text-slate-400">과제 성적이 없습니다.</p>';
            else html += '<div class="space-y-2">' + assignments.map(function(a) {
                return '<div class="rounded-2xl border border-slate-100 px-4 py-3"><div class="flex justify-between"><span class="font-black text-sm">' + esc(a.title) + '</span><span class="font-black text-sky-600">' + (a.score != null ? a.score : (a.status || '제출')) + (a.max_score ? ' / ' + a.max_score : '') + '</span></div>' + (a.feedback ? '<p class="text-xs text-slate-500 mt-1">' + esc(a.feedback) + '</p>' : '') + '</div>';
            }).join('') + '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        async function renderNotices() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/notices', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            const canPost = currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher');
            let html = '';
            if (canPost) {
                html += '<form id="classroomNoticeForm" class="rounded-[1.5rem] border border-slate-100 p-5 mb-6" onsubmit="submitClassroomNotice(event)"><p class="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-3">이 회차 공지 등록</p><input id="noticeTitle" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm mb-3" placeholder="제목"><textarea id="noticeContent" required rows="4" class="w-full rounded-xl border border-slate-200 p-3 text-sm mb-3" placeholder="내용"></textarea><button type="submit" class="min-h-[44px] px-5 rounded-2xl bg-sky-600 text-white text-xs font-black">등록</button></form>';
            }
            if (!items.length) {
                html += emptyState('fa-bullhorn', '이 회차에 등록된 공지가 없습니다.');
                document.getElementById('tabContent').innerHTML = html;
                return;
            }
            html += '<div class="space-y-3">' + items.map(function(p) {
                const scope = p.session_id ? '회차' : '과정';
                return '<button type="button" onclick="openNotice(' + p.id + ')" class="w-full text-left rounded-[1.5rem] border border-slate-100 p-5 hover:border-sky-200 transition"><div class="flex items-center gap-2 mb-1">' + (p.pinned ? '<span class="text-[10px] font-black text-rose-500">고정</span>' : '') + '<span class="text-[10px] font-black text-sky-600">' + scope + '</span><span class="text-xs text-slate-400">' + fmtDate(p.created_at) + '</span></div><h3 class="font-black">' + esc(p.title) + '</h3><p class="text-sm text-slate-500 mt-1 line-clamp-2">' + esc(p.excerpt || '') + '</p></button>';
            }).join('') + '</div>';
            document.getElementById('tabContent').innerHTML = html;
        }

        window.submitClassroomNotice = async function(e) {
            e.preventDefault();
            const title = document.getElementById('noticeTitle').value.trim();
            const content = document.getElementById('noticeContent').value.trim();
            const res = await fetch('/api/student/classroom/' + sessionId + '/notices', {
                method: 'POST', headers: authHeaders(), body: JSON.stringify({ title: title, content: content })
            });
            const json = await res.json();
            if (json.success) loadTab('notices');
            else alert(json.error || '등록에 실패했습니다.');
        };

        window.openNotice = async function(id) {
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            const res = await fetch('/api/posts/' + id, { headers: authHeaders() });
            const json = await res.json();
            const p = json.data || json;
            const body = esc(String(p.content || '').replace(/\[R2:[^\]]+\]/g, ''));
            content.innerHTML = '<button type="button" onclick="loadTab(&#39;notices&#39;)" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button><h2 class="text-xl font-black mb-2">' + esc(p.title) + '</h2><p class="text-xs text-slate-400 mb-6">' + fmtDate(p.created_at) + (p.author_name ? ' · ' + esc(p.author_name) : '') + '</p><div class="prose prose-sm max-w-none text-slate-700 leading-7 whitespace-pre-wrap">' + body + '</div>';
        };

        async function renderMaterials() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/materials', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            if (!items.length) {
                document.getElementById('tabContent').innerHTML = emptyState('fa-download', '다운로드할 자료가 없습니다.');
                return;
            }
            const groups = {};
            items.forEach(function(m) {
                const key = m.week != null && m.week !== '' ? ('week-' + m.week) : (m.source === 'assignment' ? 'assignment' : 'other');
                if (!groups[key]) groups[key] = [];
                groups[key].push(m);
            });
            const order = Object.keys(groups).sort(function(a, b) {
                if (a === 'assignment') return 1;
                if (b === 'assignment') return -1;
                if (a === 'other') return 1;
                if (b === 'other') return -1;
                return parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10);
            });
            let html = '';
            order.forEach(function(key) {
                const label = key === 'assignment' ? '과제 첨부' : (key === 'other' ? '기타 자료' : (key.slice(5) + '주차'));
                html += '<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 mt-6 first:mt-0">' + label + '</h3><div class="space-y-3 mb-2">';
                groups[key].forEach(function(m) {
                    const url = m.file_url || '#';
                    const badge = m.source === 'assignment' ? '과제첨부' : (m.type || '자료');
                    const isVideo = String(m.type || '').indexOf('video') >= 0 || /\.(mp4|webm|m3u8)(\?|$)/i.test(url);
                    if (isVideo) {
                        html += '<div class="rounded-[1.5rem] border border-slate-100 p-5"><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + esc(badge) + '</span><h3 class="font-black mt-1 mb-3">' + esc(m.title) + '</h3><video controls class="w-full rounded-2xl bg-black" src="' + esc(url) + '"></video></div>';
                    } else {
                        html += '<a href="' + esc(url) + '" target="_blank" rel="noopener" class="flex items-center justify-between gap-3 rounded-[1.5rem] border border-slate-100 p-5 hover:border-sky-200"><div><span class="text-[10px] font-black uppercase tracking-widest text-sky-600">' + esc(badge) + '</span><h3 class="font-black mt-1">' + esc(m.title) + '</h3>' + (m.description ? '<p class="text-xs text-slate-500 mt-1">' + esc(m.description) + '</p>' : '') + '</div><i class="fas fa-download text-slate-300"></i></a>';
                    }
                });
                html += '</div>';
            });
            document.getElementById('tabContent').innerHTML = html;
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
                content.innerHTML = emptyState('fa-poll', '설문을 불러올 수 없습니다.') + '<button type="button" onclick="loadTab(&#39;surveys&#39;)" class="mt-4 text-xs font-black text-sky-600">목록으로</button>';
                return;
            }
            const survey = json.data;
            const questions = survey.questions || [];
            let html = '<button type="button" onclick="loadTab(&#39;surveys&#39;)" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button>';
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

        async function renderQna() {
            const res = await fetch('/api/student/classroom/' + sessionId + '/qna', { headers: authHeaders() });
            const json = await res.json();
            const items = json.data || [];
            let html = '<form id="classroomQnaForm" class="rounded-[1.5rem] border border-slate-100 p-5 mb-6" onsubmit="submitClassroomQna(event)"><p class="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-3">이 회차에 질문하기</p><input id="qnaTitle" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm mb-3" placeholder="제목"><textarea id="qnaContent" required rows="4" class="w-full rounded-xl border border-slate-200 p-3 text-sm mb-3" placeholder="질문 내용"></textarea><button type="submit" class="min-h-[44px] px-5 rounded-2xl bg-sky-600 text-white text-xs font-black">등록</button></form>';
            if (!items.length) {
                html += emptyState('fa-comments', '등록된 질문이 없습니다.');
            } else {
                html += '<div class="space-y-3">' + items.map(function(p) {
                    return '<button type="button" onclick="openQna(' + p.id + ')" class="w-full text-left rounded-[1.5rem] border border-slate-100 p-5 hover:border-sky-200 transition"><div class="flex items-center gap-2 mb-1"><span class="text-xs text-slate-400">' + fmtDate(p.created_at) + '</span><span class="text-[10px] font-black text-slate-400">댓글 ' + (p.comment_count || 0) + '</span></div><h3 class="font-black">' + esc(p.title) + '</h3><p class="text-sm text-slate-500 mt-1 line-clamp-2">' + esc(p.excerpt || '') + '</p></button>';
                }).join('') + '</div>';
            }
            document.getElementById('tabContent').innerHTML = html;
        }

        window.submitClassroomQna = async function(e) {
            e.preventDefault();
            const title = document.getElementById('qnaTitle').value.trim();
            const content = document.getElementById('qnaContent').value.trim();
            const res = await fetch('/api/student/classroom/' + sessionId + '/qna', {
                method: 'POST', headers: authHeaders(), body: JSON.stringify({ title: title, content: content })
            });
            const json = await res.json();
            if (json.success) loadTab('qna');
            else alert(json.error || '등록에 실패했습니다.');
        };

        window.openQna = async function(id) {
            const content = document.getElementById('tabContent');
            content.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-circle-notch fa-spin text-2xl"></i></div>';
            const res = await fetch('/api/posts/' + id, { headers: authHeaders() });
            const json = await res.json();
            const p = json.data || json;
            const comments = p.comments || [];
            const body = String(p.content || '').replace(/\[R2:[^\]]+\]/g, '');
            let html = '<button type="button" onclick="loadTab(&#39;qna&#39;)" class="text-xs font-black text-sky-600 mb-4"><i class="fas fa-arrow-left mr-1"></i>목록</button>';
            html += '<h2 class="text-xl font-black mb-2">' + esc(p.title) + '</h2>';
            html += '<p class="text-xs text-slate-400 mb-6">' + fmtDate(p.created_at) + (p.author_name ? ' · ' + esc(p.author_name) : '') + '</p>';
            html += '<div class="text-slate-700 leading-7 whitespace-pre-wrap mb-8">' + esc(body) + '</div>';
            html += '<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">댓글</h3>';
            if (!comments.length) html += '<p class="text-sm text-slate-400 mb-4">아직 댓글이 없습니다.</p>';
            else html += '<div class="space-y-3 mb-6">' + comments.map(function(cm) {
                return '<div class="rounded-2xl bg-slate-50 border border-slate-100 p-4"><p class="text-xs font-black mb-1">' + esc(cm.user_name || cm.author_name || '수강생') + '</p><p class="text-sm whitespace-pre-wrap">' + esc(cm.content) + '</p></div>';
            }).join('') + '</div>';
            html += '<form onsubmit="submitQnaComment(event, ' + id + ')"><textarea id="qnaComment" required rows="3" class="w-full rounded-xl border border-slate-200 p-3 text-sm mb-3" placeholder="댓글을 입력하세요"></textarea><button type="submit" class="min-h-[44px] px-5 rounded-2xl bg-sky-600 text-white text-xs font-black">댓글 등록</button></form>';
            content.innerHTML = html;
        };

        window.submitQnaComment = async function(e, postId) {
            e.preventDefault();
            const text = document.getElementById('qnaComment').value.trim();
            const res = await fetch('/api/posts/' + postId + '/comments', {
                method: 'POST', headers: authHeaders(), body: JSON.stringify({ content: text })
            });
            const json = await res.json();
            if (json.success) openQna(postId);
            else alert(json.error || '댓글 등록에 실패했습니다.');
        };

        async function renderReview() {
            const courseId = overview && overview.approved_course_id;
            let html = '<p class="text-xs text-slate-500 mb-6">작성한 후기는 관리자 승인 후 홈페이지에 공개됩니다.</p>';
            if (!courseId) {
                html += emptyState('fa-star', '이 회차에 연결된 승인 과정이 없어 후기를 작성할 수 없습니다.');
                document.getElementById('tabContent').innerHTML = html;
                return;
            }
            const mineRes = await fetch('/api/posts?category=review&mine=1&limit=50', { headers: authHeaders() });
            const mineJson = await mineRes.json();
            const mine = (mineJson.data || []).filter(function(r) { return Number(r.course_id) === Number(courseId); });
            if (mine.length) {
                html += '<div class="space-y-3">' + mine.map(function(r) {
                    return '<div class="rounded-[1.5rem] border border-slate-100 p-5"><p class="text-[10px] font-black text-sky-600 mb-1">내 후기 · ' + (r.status === 'published' ? '공개' : '승인 대기') + '</p><h3 class="font-black">' + esc(r.title) + '</h3><p class="text-sm text-slate-600 mt-2 whitespace-pre-wrap">' + esc(r.content) + '</p></div>';
                }).join('') + '</div>';
            } else {
                html += '<form id="classroomReviewForm" class="rounded-[1.5rem] border border-slate-100 p-5" onsubmit="submitClassroomReview(event)"><input id="reviewTitle" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm mb-3" placeholder="제목"><div class="flex gap-2 mb-3" id="reviewStars">';
                for (var n = 1; n <= 5; n++) html += '<button type="button" class="review-star text-2xl text-slate-300" data-rating="' + n + '" onclick="setReviewRating(' + n + ')"><i class="fas fa-star"></i></button>';
                html += '</div><input type="hidden" id="reviewRating" value=""><textarea id="reviewContent" required rows="5" class="w-full rounded-xl border border-slate-200 p-3 text-sm mb-3" placeholder="수강 경험을 적어 주세요"></textarea><button type="submit" class="w-full min-h-[44px] rounded-2xl bg-sky-600 text-white font-black text-sm">제출하기</button></form>';
            }
            document.getElementById('tabContent').innerHTML = html;
        }

        window.setReviewRating = function(n) {
            var input = document.getElementById('reviewRating');
            if (input) input.value = n;
            document.querySelectorAll('.review-star').forEach(function(btn) {
                var r = parseInt(btn.getAttribute('data-rating'), 10);
                btn.classList.toggle('text-amber-400', r <= n);
                btn.classList.toggle('text-slate-300', r > n);
            });
        };

        window.submitClassroomReview = async function(e) {
            e.preventDefault();
            var rating = parseInt(document.getElementById('reviewRating').value, 10);
            if (!rating) { alert('평점을 선택해 주세요.'); return; }
            var res = await fetch('/api/posts', {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({
                    category: 'review',
                    course_id: overview.approved_course_id,
                    session_id: parseInt(sessionId, 10),
                    rating: rating,
                    title: document.getElementById('reviewTitle').value.trim(),
                    content: document.getElementById('reviewContent').value.trim()
                })
            });
            var json = await res.json();
            if (json.success) {
                alert('수강후기가 접수되었습니다. 관리자 승인 후 공개됩니다.');
                loadTab('review');
            } else {
                alert(json.error || '등록에 실패했습니다.');
            }
        };

        window.openEvidenceModal = function(planId) {
            const plans = window._ncsPlans || [];
            const p = plans.find(function(x) { return x.id === planId; }) || {};
            document.getElementById('evidencePlanId').value = planId;
            document.getElementById('evidenceUnitName').textContent = p.unit_name || '능력단위';
            document.getElementById('evidenceFileName').value = (overview.course_name || '') + ' - ' + (p.unit_name || '');
            document.getElementById('evidenceFileUrl').value = '';
            document.getElementById('evidenceComment').value = '';
            const m = document.getElementById('evidenceModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        };
        window.closeEvidenceModal = function() {
            const m = document.getElementById('evidenceModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        };
        window.submitEvidence = async function() {
            if (!currentUser || !currentUser.id) { alert('로그인 정보를 확인할 수 없습니다.'); return; }
            const planId = document.getElementById('evidencePlanId').value;
            const fileName = document.getElementById('evidenceFileName').value.trim();
            const fileUrl = document.getElementById('evidenceFileUrl').value.trim();
            if (!fileName || !fileUrl) { alert('제목과 파일 URL을 입력하세요.'); return; }
            const res = await fetch('/api/ncs/evidence', {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({
                    plan_id: parseInt(planId, 10),
                    student_id: currentUser.id,
                    file_name: fileName,
                    file_url: fileUrl,
                    file_type: 'link',
                    comment: document.getElementById('evidenceComment').value.trim()
                })
            });
            const json = await res.json();
            if (json.success) {
                closeEvidenceModal();
                loadTab('exam');
            } else {
                alert(json.error || '제출에 실패했습니다.');
            }
        };
    </script>
</body>
</html>
`;
