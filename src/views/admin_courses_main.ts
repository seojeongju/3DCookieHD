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
                        <table class="w-full text-left border-collapse min-w-[700px]">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th class="p-3 w-12 text-center">No.</th>
                                    <th class="p-3 w-20">분류</th>
                                    <th class="p-3">승인 과정명</th>
                                    <th class="p-3 w-24">교·강사</th>
                                    <th class="p-3 w-20 text-center">훈련시간</th>
                                    <th class="p-3 w-16 text-center">회차</th>
                                    <th class="p-3 w-20 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="approvedListBody" class="text-sm divide-y divide-slate-100">
                                <tr><td colspan="7" class="p-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
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
                        <table class="w-full text-left border-collapse min-w-[700px]">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th class="p-3 w-12 text-center">No.</th>
                                    <th class="p-3">개설 과정명</th>
                                    <th class="p-3 w-20 text-center">회차</th>
                                    <th class="p-3 w-24 text-center">상태</th>
                                    <th class="p-3 w-28 text-center">훈련시작일</th>
                                    <th class="p-3 w-24 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="sessionsListBody" class="text-sm divide-y divide-slate-100">
                                <tr><td colspan="6" class="p-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
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
                            tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-400">등록된 승인 과정이 없습니다.</td></tr>';
                            return;
                        }
                        tbody.innerHTML = list.map(function(item, i) {
                            var timeStr = [item.training_time_start, item.training_time_end].filter(Boolean).join('~') || '-';
                            var sessionCount = item.session_count != null ? item.session_count : '-';
                            return '<tr class="hover:bg-slate-50">' +
                                '<td class="p-3 text-center text-slate-500">' + (i + 1) + '</td>' +
                                '<td class="p-3"><span class="text-xs text-slate-600">' + esc(item.category_name || '-') + '</span></td>' +
                                '<td class="p-3"><span class="font-medium text-slate-800">' + esc(item.name) + '</span></td>' +
                                '<td class="p-3 text-slate-600">' + esc(item.instructor_name || '-') + '</td>' +
                                '<td class="p-3 text-center text-slate-500 text-xs">' + esc(timeStr) + '</td>' +
                                '<td class="p-3 text-center">' + sessionCount + '</td>' +
                                '<td class="p-3 text-right"><a href="/admin/courses/approved/register/' + item.id + '" class="text-primary-600 hover:underline text-xs font-bold">상세</a></td>' +
                                '</tr>';
                        }).join('');
                    })
                    .catch(function(e) {
                        console.error(e);
                        tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-red-500">조회 실패</td></tr>';
                    });
            }

            function loadSessions() {
                var tbody = document.getElementById('sessionsListBody');
                fetch('/api/course-sessions?page=1&limit=' + ${RECENT_LIMIT}, { headers: headers })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        var list = json.data || [];
                        var p = json.pagination || {};
                        document.getElementById('sessionsCount').textContent = (p.total != null ? p.total : list.length) + '건';
                        if (list.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400">개설된 회차가 없습니다.</td></tr>';
                            return;
                        }
                        var statusMap = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
                        tbody.innerHTML = list.map(function(item, i) {
                            var startDate = item.training_start_date ? item.training_start_date.toString().substring(0, 10) : '-';
                            var statusText = statusMap[item.status] || item.status || '-';
                            return '<tr class="hover:bg-slate-50">' +
                                '<td class="p-3 text-center text-slate-500">' + (i + 1) + '</td>' +
                                '<td class="p-3"><span class="font-medium text-slate-800">' + esc(item.course_name) + '</span></td>' +
                                '<td class="p-3 text-center">' + esc(item.session_number != null ? item.session_number + '회차' : item.session_name || '-') + '</td>' +
                                '<td class="p-3 text-center"><span class="text-xs text-slate-600">' + esc(statusText) + '</span></td>' +
                                '<td class="p-3 text-center text-slate-500 text-xs">' + esc(startDate) + '</td>' +
                                '<td class="p-3 text-right"><a href="/admin/courses/sessions/' + item.id + '/syllabus" class="text-primary-600 hover:underline text-xs font-bold">상세</a></td>' +
                                '</tr>';
                        }).join('');
                    })
                    .catch(function(e) {
                        console.error(e);
                        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-red-500">조회 실패</td></tr>';
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
