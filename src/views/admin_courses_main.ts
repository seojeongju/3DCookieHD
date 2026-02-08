import { hrdSidebar } from './components/hrd_sidebar';

const RECENT_LIMIT = 8;

/**
 * 교육과정관리 메인 대시보드: 승인 과정 + 회차별 개설 요약 섹션
 */
export function adminCoursesMainHtml(): string {
  const sidebar = hrdSidebar('courses');
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 관리 - 통합 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
                <div class="flex items-center gap-4">
                    <h1 class="text-lg font-bold text-slate-800">교육과정 관리</h1>
                    <nav class="hidden sm:flex items-center text-xs text-slate-500 gap-2">
                        <span>홈</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span>과정관리</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span class="font-bold text-slate-700">교육과정 관리</span>
                    </nav>
                </div>
                <div class="flex items-center gap-2">
                    <a href="/admin/courses/register" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition">
                        <i class="fas fa-plus"></i> 일반과정 등록
                    </a>
                </div>
            </header>

            <main class="flex-1 overflow-auto p-6 custom-scrollbar bg-slate-50 space-y-8">
                <!-- Section 1: 승인받은 과정 -->
                <section class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <span class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                <i class="fas fa-check-double"></i>
                            </span>
                            <div>
                                <h2 class="font-bold text-slate-800">승인받은 과정</h2>
                                <p class="text-xs text-slate-500">HRD-Net 승인 과정 등록·관리</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span id="approvedCount" class="text-xs font-bold text-slate-400">0건</span>
                            <a href="/admin/courses/approved" class="inline-flex items-center gap-1.5 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-bold transition">
                                전체보기 <i class="fas fa-chevron-right text-[10px]"></i>
                            </a>
                            <a href="/admin/courses/approved/register" class="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition">
                                <i class="fas fa-plus"></i> 승인 과정 등록
                            </a>
                        </div>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse min-w-[1000px]">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th class="p-3 w-12 text-center">No.</th>
                                    <th class="p-3 w-20">분류</th>
                                    <th class="p-3">승인 과정명</th>
                                    <th class="p-3 w-24">교·강사</th>
                                    <th class="p-3 w-20 text-center">훈련시간</th>
                                    <th class="p-3 w-16 text-center">정원</th>
                                    <th class="p-3 w-24 text-center">승인기관</th>
                                    <th class="p-3 w-20 text-center">상태</th>
                                    <th class="p-3 w-20 text-center">회차</th>
                                    <th class="p-3 w-28 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="approvedListBody" class="text-sm divide-y divide-slate-100">
                                <tr><td colspan="10" class="p-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Section 2: 회차별 과정 개설 -->
                <section class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <span class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <i class="fas fa-calendar-plus"></i>
                            </span>
                            <div>
                                <h2 class="font-bold text-slate-800">회차별 과정 개설</h2>
                                <p class="text-xs text-slate-500">동일 과정의 회차(1기, 2기 등) 개설·운영</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span id="sessionsCount" class="text-xs font-bold text-slate-400">0건</span>
                            <a href="/admin/courses/sessions" class="inline-flex items-center gap-1.5 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-bold transition">
                                전체보기 <i class="fas fa-chevron-right text-[10px]"></i>
                            </a>
                            <a href="/admin/courses/sessions/register" class="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition">
                                <i class="fas fa-plus"></i> 회차 개설 등록
                            </a>
                        </div>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse min-w-[920px]">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th class="p-3 w-12 text-center">No.</th>
                                    <th class="p-3">개설 과정명</th>
                                    <th class="p-3 w-20 text-center">회차</th>
                                    <th class="p-3 w-20 text-center">상태</th>
                                    <th class="p-3 w-36 text-center">훈련시작일</th>
                                    <th class="p-3 w-24 text-center">등록일</th>
                                    <th class="p-3 w-20 text-center">홈페이지</th>
                                    <th class="p-3 w-28 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="sessionsListBody" class="text-sm divide-y divide-slate-100">
                                <tr><td colspan="8" class="p-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Quick links -->
                <div class="flex flex-wrap gap-3">
                    <a href="/admin/courses/register" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition">
                        <i class="fas fa-graduation-cap text-slate-500"></i> 일반과정 등록/리스트
                    </a>
                    <a href="/admin/courses/categories" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition">
                        <i class="fas fa-tags text-slate-500"></i> 과정분류관리
                    </a>
                    <a href="/admin/courses/copy" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition">
                        <i class="fas fa-copy text-slate-500"></i> 회차별 과정복사
                    </a>
                </div>
            </main>
        </div>
    </div>

    <script>
        (function() {
            var token = localStorage.getItem('token');
            var headers = token ? { 'Authorization': 'Bearer ' + token } : {};

            function esc(s) {
                if (s == null) return '';
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
            }

            function loadApproved() {
                var tbody = document.getElementById('approvedListBody');
                fetch('/api/approved-courses?page=1&limit=' + ${RECENT_LIMIT}, { headers: headers })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        var list = json.data || [];
                        var p = json.pagination || {};
                        document.getElementById('approvedCount').textContent = (p.total != null ? p.total : list.length) + '건';
                        if (list.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-slate-400">등록된 승인 과정이 없습니다.</td></tr>';
                            return;
                        }
                        tbody.innerHTML = list.map(function(item, i) {
                            var timeStr = [item.training_time_start, item.training_time_end].filter(Boolean).join('~') || '-';
                            var cap = item.capacity != null ? item.capacity + '명' : '-';
                            var approvalOrg = (item.approval_org || '').trim();
                            var approvalDisplay = approvalOrg ? (approvalOrg.length > 8 ? approvalOrg.slice(0, 7) + '\u2026' : approvalOrg) : '-';
                            var statusBadge = item.status === 'inactive'
                                ? '<span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold whitespace-nowrap">비활성</span>'
                                : '<span class="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold whitespace-nowrap">활성</span>';
                            var sc = item.session_count != null ? parseInt(item.session_count, 10) : 0;
                            var sessionCell = sc > 0
                                ? '<a href="/admin/courses/sessions?approved_course_id=' + item.id + '" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold hover:bg-blue-100 transition whitespace-nowrap" title="회차 목록"><i class="fas fa-list-ol"></i> ' + sc + '회차</a>'
                                : '<span class="text-slate-300 text-[10px]">0회차</span>';
                            var nameEsc = esc(item.name || '');
                            var mgmt = '<div class="flex items-center justify-end gap-0.5 flex-nowrap">' +
                                '<a href="/admin/courses/sessions/register?approvedCourseId=' + item.id + '" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition whitespace-nowrap" title="회차 개설"><i class="fas fa-calendar-plus"></i> 회차</a>' +
                                '<a href="/admin/courses/approved/register/' + item.id + '" class="p-1.5 text-slate-400 hover:text-primary-600 transition" title="수정"><i class="fas fa-pen"></i></a>' +
                                '<button type="button" class="btn-approved-delete p-1.5 text-slate-400 hover:text-red-500 transition" data-id="' + item.id + '" data-name="' + nameEsc + '" title="삭제"><i class="fas fa-trash-alt"></i></button>' +
                                '</div>';
                            return '<tr class="hover:bg-slate-50/80 transition align-middle">' +
                                '<td class="p-3 text-center text-slate-500 text-xs align-middle">' + (i + 1) + '</td>' +
                                '<td class="p-3 text-slate-600 text-xs font-medium align-middle whitespace-nowrap">' + esc(item.category_name || '-') + '</td>' +
                                '<td class="p-3 align-middle min-w-0" title="' + nameEsc + '"><div class="font-bold text-slate-700 text-sm line-clamp-2 leading-tight">' + nameEsc + '</div></td>' +
                                '<td class="p-3 text-slate-600 text-xs align-middle min-w-0"><span class="block truncate">' + esc(item.instructor_name || '-') + '</span></td>' +
                                '<td class="p-3 text-center text-slate-600 text-xs align-middle whitespace-nowrap">' + esc(timeStr) + '</td>' +
                                '<td class="p-3 text-center text-slate-600 text-xs align-middle">' + cap + '</td>' +
                                '<td class="p-3 text-center text-slate-600 text-xs align-middle overflow-hidden" style="max-width: 80px;" title="' + esc(approvalOrg) + '"><span class="block truncate">' + esc(approvalDisplay) + '</span></td>' +
                                '<td class="p-3 text-center align-middle">' + statusBadge + '</td>' +
                                '<td class="p-3 text-center align-middle">' + sessionCell + '</td>' +
                                '<td class="p-3 text-right align-middle">' + mgmt + '</td>' +
                                '</tr>';
                        }).join('');
                        tbody.querySelectorAll('.btn-approved-delete').forEach(function(btn) {
                            btn.addEventListener('click', function() {
                                var id = parseInt(btn.getAttribute('data-id'), 10);
                                var name = btn.getAttribute('data-name') || '';
                                if (!confirm('승인 과정 "' + name + '"을(를) 삭제하시겠습니까?')) return;
                                fetch('/api/approved-courses/' + id, { method: 'DELETE', headers: headers })
                                    .then(function(r) { return r.json().catch(function() { return {}; }); })
                                    .then(function(res) {
                                        if (res.ok !== false && res.success !== false) loadApproved();
                                        else alert(res.message || '삭제에 실패했습니다.');
                                    })
                                    .catch(function() { alert('삭제 요청에 실패했습니다.'); });
                            });
                        });
                    })
                    .catch(function(e) {
                        console.error(e);
                        tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-red-500">조회 실패</td></tr>';
                    });
            }

            var statusClassMap = { recruiting: 'bg-blue-100 text-blue-700', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-slate-100 text-slate-600', always_open: 'bg-slate-100 text-slate-500', closed: 'bg-red-100 text-red-700' };

            window.dashboardSetHomepageExposed = function(id, val) {
                if (!id) return;
                fetch('/api/course-sessions/' + id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ homepage_exposed: val })
                }).then(function(r) { return r.json(); })
                  .then(function(json) { if (json.success) loadSessions(); else alert(json.error || '처리 실패'); })
                  .catch(function() { alert('처리 중 오류가 발생했습니다.'); });
            };

            window.dashboardDeleteSession = function(id) {
                if (!id || !confirm('이 회차를 삭제할까요?')) return;
                fetch('/api/course-sessions/' + id, { method: 'DELETE', headers: headers })
                    .then(function(r) { return r.json(); })
                    .then(function(json) { if (json.success) loadSessions(); else alert(json.error || '삭제 실패'); })
                    .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
            };

            function loadSessions() {
                var tbody = document.getElementById('sessionsListBody');
                fetch('/api/course-sessions?page=1&limit=' + ${RECENT_LIMIT}, { headers: headers })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        var list = json.data || [];
                        var p = json.pagination || {};
                        document.getElementById('sessionsCount').textContent = (p.total != null ? p.total : list.length) + '건';
                        if (list.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-slate-400">개설된 회차가 없습니다.</td></tr>';
                            return;
                        }
                        var statusMap = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
                        tbody.innerHTML = list.map(function(item, i) {
                            var startStr = item.training_start_date ? item.training_start_date.toString().substring(0, 10) : '';
                            var endStr = item.training_end_date ? item.training_end_date.toString().substring(0, 10) : '';
                            var trainingRange = [startStr, endStr].filter(Boolean).join(' ~ ') || '-';
                            var regDate = (item.registered_at || item.created_at || '').toString().substring(0, 10) || '-';
                            var statusText = statusMap[item.status] || item.status || '-';
                            var statusCls = statusClassMap[item.status] || 'bg-slate-100 text-slate-600';
                            var isExposed = item.homepage_exposed === 1 || item.homepage_exposed === true;
                            var homepageBtn = isExposed
                                ? '<button type="button" onclick="window.dashboardSetHomepageExposed(' + item.id + ', 0)" class="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition" title="홈페이지에서 삭제">삭제</button>'
                                : '<button type="button" onclick="window.dashboardSetHomepageExposed(' + item.id + ', 1)" class="px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition" title="홈페이지에 등록">등록</button>';
                            return '<tr class="hover:bg-slate-50">' +
                                '<td class="p-3 text-center text-slate-500">' + (i + 1) + '</td>' +
                                '<td class="p-3"><span class="font-medium text-slate-800">' + esc(item.course_name) + '</span></td>' +
                                '<td class="p-3 text-center font-bold text-slate-600 text-xs">' + (item.session_number != null ? item.session_number + '회차' : esc(item.session_name || '-')) + '</td>' +
                                '<td class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold ' + statusCls + '">' + esc(statusText) + '</span></td>' +
                                '<td class="p-3 text-center text-slate-600 text-xs">' + esc(trainingRange) + '</td>' +
                                '<td class="p-3 text-center text-slate-500 text-xs">' + esc(regDate) + '</td>' +
                                '<td class="p-3 text-center">' + homepageBtn + '</td>' +
                                '<td class="p-3 text-right">' +
                                '<div class="flex items-center justify-end gap-1">' +
                                '<a href="/admin/courses/sessions/' + item.id + '/syllabus" class="p-1.5 text-slate-400 hover:text-primary-600 transition" title="상세"><i class="fas fa-file-alt"></i></a>' +
                                '<a href="/admin/courses/sessions/register/' + item.id + '" class="p-1.5 text-slate-400 hover:text-primary-600 transition" title="수정"><i class="fas fa-pen"></i></a>' +
                                '<button type="button" onclick="window.dashboardDeleteSession(' + item.id + ')" class="p-1.5 text-slate-400 hover:text-red-500 transition" title="삭제"><i class="fas fa-trash-alt"></i></button>' +
                                '</div></td></tr>';
                        }).join('');
                    })
                    .catch(function(e) {
                        console.error(e);
                        tbody.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-red-500">조회 실패</td></tr>';
                    });
            }

            loadApproved();
            loadSessions();
        })();
    </script>
</body>
</html>
`;
}
