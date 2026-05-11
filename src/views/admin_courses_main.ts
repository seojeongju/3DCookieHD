import { hrdSidebar } from './components/hrd_sidebar';

const RECENT_LIMIT = 8;

/**
 * 교육과정관리 메인 대시보드: 승인 과정 + 회차별 개설 통합 관리 (아코디언 형태)
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
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
                <!-- Status Tabs -->
                <div class="flex items-center gap-2 mb-6">
                    <button type="button" onclick="setApprovedStatusFilter('')" id="statusTabAll" class="status-tab px-4 py-2 rounded-full text-xs font-bold bg-slate-800 text-white shadow-sm transition-all border border-transparent">
                        전체
                    </button>
                    <button type="button" onclick="setApprovedStatusFilter('recruiting')" id="statusTabRecruiting" class="status-tab px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                        <span class="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1.5"></span>모집중
                    </button>
                    <button type="button" onclick="setApprovedStatusFilter('in_progress')" id="statusTabInProgress" class="status-tab px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">
                        <span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5"></span>훈련중
                    </button>
                    <button type="button" onclick="setApprovedStatusFilter('completed')" id="statusTabCompleted" class="status-tab px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all">
                        <span class="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1.5"></span>종료
                    </button>
                </div>

                <!-- Section: 과정 통합 관리 (승인 과정 + 회차) -->
                <section class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <span class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                <i class="fas fa-layer-group"></i>
                            </span>
                            <div>
                                <h2 class="font-bold text-slate-800">통합 교육과정 관리</h2>
                                <p class="text-xs text-slate-500">승인과정을 클릭하여 개설된 회차를 확인하고 관리하세요.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span id="approvedCount" class="text-xs font-bold text-slate-400">0건</span>
                            <div class="h-4 w-[1px] bg-slate-200 mx-1"></div>
                            <a href="/admin/courses/approved/register" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition shadow-sm">
                                <i class="fas fa-plus"></i> 승인 과정 신규 등록
                            </a>
                        </div>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse min-w-[1000px]">
                            <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th class="p-4 w-12 text-center"></th>
                                    <th class="p-4 w-20">분류</th>
                                    <th class="p-4">승인 과정명</th>
                                    <th class="p-4 w-24">교·강사</th>
                                    <th class="p-4 w-28 text-center">훈련시간</th>
                                    <th class="p-4 w-16 text-center">정원</th>
                                    <th class="p-4 w-16 text-center">상태</th>
                                    <th class="p-4 w-24 text-center">회차상태</th>
                                    <th class="p-4 w-32 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="approvedListBody" class="text-sm divide-y divide-slate-100">
                                <tr><td colspan="9" class="p-12 text-center text-slate-400"><i class="fas fa-circle-notch fa-spin mr-3 text-lg"></i> 데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Quick links -->
                <div class="flex flex-wrap gap-3">
                    <a href="/admin/courses/sessions/enrollments" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition">
                        <i class="fas fa-user-plus text-emerald-600"></i> 수강생(훈련생) 등록
                    </a>
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
            if (!token) {
                window.location.href = '/login';
                return;
            }
            var headers = { 'Authorization': 'Bearer ' + token };
            var currentStatus = '';

            function esc(s) {
                if (s == null) return '';
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
            }

            window.setApprovedStatusFilter = function(status) {
                currentStatus = status;
                
                // Update UI
                const allTabs = document.querySelectorAll('.status-tab');
                allTabs.forEach(function(el) {
                    el.className = 'status-tab px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 transition-all';
                    
                    if(el.id === 'statusTabAll') {
                        el.className += ' hover:bg-slate-800 hover:text-white';
                         el.innerHTML = '전체';
                    } else if(el.id === 'statusTabRecruiting') {
                        el.className += ' hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200';
                         el.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1.5"></span>모집중';
                    } else if(el.id === 'statusTabInProgress') {
                        el.className += ' hover:bg-green-50 hover:text-green-600 hover:border-green-200';
                         el.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5"></span>훈련중';
                    } else if(el.id === 'statusTabCompleted') {
                        el.className += ' hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300';
                         el.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1.5"></span>종료';
                    }
                });

                if(!status) {
                     const el = document.getElementById('statusTabAll');
                     if(el) el.className = 'status-tab px-4 py-2 rounded-full text-xs font-bold bg-slate-800 text-white shadow-sm transition-all border border-transparent';
                } else if(status === 'recruiting') {
                     const el = document.getElementById('statusTabRecruiting');
                     if(el) {
                        el.className = 'status-tab px-4 py-2 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm transition-all border border-transparent';
                        el.innerHTML = '<i class="fas fa-check mr-1.5"></i>모집중';
                     }
                } else if(status === 'in_progress') {
                     const el = document.getElementById('statusTabInProgress');
                     if(el) {
                        el.className = 'status-tab px-4 py-2 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm transition-all border border-transparent';
                        el.innerHTML = '<i class="fas fa-play mr-1.5"></i>훈련중';
                     }
                } else if(status === 'completed') {
                     const el = document.getElementById('statusTabCompleted');
                     if(el) {
                        el.className = 'status-tab px-4 py-2 rounded-full text-xs font-bold bg-slate-600 text-white shadow-sm transition-all border border-transparent';
                        el.innerHTML = '<i class="fas fa-flag-checkered mr-1.5"></i>종료';
                     }
                }

                loadApproved();
            };

            function loadApproved() {
                var tbody = document.getElementById('approvedListBody');
                let url = '/api/approved-courses?page=1&limit=50';
                if(currentStatus) url += '&session_status=' + currentStatus;

                fetch(url, { headers: headers })
                    .then(function(r) { 
                        if (r.status === 401) {
                            window.location.href = '/login';
                            throw new Error('Unauthorized');
                        }
                        return r.json(); 
                    })
                    .then(function(json) {
                        if (!json.success) {
                            throw new Error(json.error || '데이터 로드 실패');
                        }
                        var list = json.data || [];
                        var p = json.pagination || {};
                        document.getElementById('approvedCount').textContent = (p.total != null ? p.total : list.length) + '건';
                        if (list.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="9" class="p-12 text-center text-slate-400">등록된 승인 과정이 없습니다.</td></tr>';
                            return;
                        }
                        tbody.innerHTML = list.map(function(item, i) {
                            var timeStr = [item.training_time_start, item.training_time_end].filter(Boolean).join('~') || '-';
                            var cap = item.capacity != null ? item.capacity + '명' : '-';
                            var statusBadge = item.status === 'inactive'
                                ? '<span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold whitespace-nowrap">비활성</span>'
                                : '<span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold whitespace-nowrap">활성</span>';
                            
                            var sc = item.session_count != null ? parseInt(item.session_count, 10) : 0;
                            var sessionStatusHtml = sc > 0 
                                ? '<span class="text-primary-600 font-black text-xs">' + sc + '개 회차 운영 중</span>'
                                : '<span class="text-slate-300 text-xs">개설 회차 없음</span>';

                            var nameEsc = esc(item.name || '');
                            return '<tr class="hover:bg-slate-50/50 transition cursor-pointer group" onclick="toggleSessions(' + item.id + ', this)">' +
                                '<td class="p-4 text-center text-slate-300 align-middle"><i class="fas fa-chevron-right chevron-icon transition-transform"></i></td>' +
                                '<td class="p-4 text-slate-400 text-[10px] font-bold uppercase tracking-tighter align-middle whitespace-nowrap">' + esc(item.category_name || '-') + '</td>' +
                                '<td class="p-4 align-middle"><div class="font-bold text-slate-800 text-[14px] group-hover:text-primary-600 transition truncate max-w-[400px]">' + nameEsc + '</div><div class="text-[10px] text-slate-400 mt-0.5">' + (item.approval_org || '-') + '</div></td>' +
                                '<td class="p-4 text-slate-600 text-xs align-middle font-medium">' + esc(item.instructor_name || '-') + '</td>' +
                                '<td class="p-4 text-center text-slate-500 text-[11px] align-middle whitespace-nowrap">' + esc(timeStr) + '</td>' +
                                '<td class="p-4 text-center text-slate-600 text-xs align-middle font-bold">' + cap + '</td>' +
                                '<td class="p-4 text-center align-middle">' + statusBadge + '</td>' +
                                '<td class="p-4 text-center align-middle">' + sessionStatusHtml + '</td>' +
                                '<td class="p-4 text-right align-middle">' +
                                    '<div class="flex items-center justify-end gap-1" onclick="event.stopPropagation()">' +
                                        '<a href="/admin/courses/sessions/register?approvedCourseId=' + item.id + '" class="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition" title="회차 추가"><i class="fas fa-calendar-plus text-xs"></i></a>' +
                                        '<a href="/admin/courses/approved/register/' + item.id + '" class="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-primary-600 hover:text-white transition" title="승인과정 수정"><i class="fas fa-pen text-xs"></i></a>' +
                                        '<button type="button" class="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-red-500 hover:text-white transition btn-delete-approved" data-id="' + item.id + '" data-name="' + nameEsc + '"><i class="fas fa-trash-alt text-xs"></i></button>' +
                                    '</div>' +
                                '</td>' +
                                '</tr>' +
                                '<tr id="sessions-row-' + item.id + '" class="hidden bg-slate-50/50">' +
                                    '<td colspan="9" class="p-0 border-t-0">' +
                                        '<div class="px-14 py-6" id="sessions-container-' + item.id + '">' +
                                            '<div class="flex items-center justify-center py-4 text-slate-400 text-xs"><i class="fas fa-circle-notch fa-spin mr-2"></i> 회차 정보를 불러오는 중...</div>' +
                                        '</div>' +
                                    '</td>' +
                                '</tr>';
                        }).join('');

                        tbody.querySelectorAll('.btn-delete-approved').forEach(function(btn) {
                            btn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                var id = btn.getAttribute('data-id');
                                var name = btn.getAttribute('data-name');
                                if (confirm('승인과정 "' + name + '"과 연결된 모든 회차 정보가 함께 관리됩니다. 정말 삭제하시겠습니까?')) {
                                    fetch('/api/approved-courses/' + id, { method: 'DELETE', headers: headers })
                                        .then(function(r) { return r.json(); })
                                        .then(function(res) { if (res.success) loadApproved(); else alert(res.error || '삭제 실패'); });
                                }
                            });
                        });
                    })
                    .catch(function(err) {
                        if (err.message === 'Unauthorized') return; // Redirected already
                        console.error(err);
                        tbody.innerHTML = '<tr><td colspan="9" class="p-12 text-center text-red-500">데이터 로드 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류') + '</td></tr>';
                    });
            }

            var statusClassMap = { recruiting: 'bg-blue-100 text-blue-700', in_progress: 'bg-emerald-100 text-emerald-700', completed: 'bg-slate-100 text-slate-600', always_open: 'bg-purple-100 text-purple-700', closed: 'bg-red-100 text-red-700' };
            var statusMap = { recruiting: '모집중', in_progress: '훈련중', completed: '종료', always_open: '상시모집', closed: '폐강' };

            window.toggleSessions = function(courseId, row) {
                var subRow = document.getElementById('sessions-row-' + courseId);
                var container = document.getElementById('sessions-container-' + courseId);
                var icon = row.querySelector('.chevron-icon');

                if (!subRow.classList.contains('hidden')) {
                    subRow.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                    return;
                }

                subRow.classList.remove('hidden');
                icon.style.transform = 'rotate(90deg)';

                fetch('/api/course-sessions?approved_course_id=' + courseId, { headers: headers })
                    .then(function(r) { 
                        if (r.status === 401) {
                            window.location.href = '/login';
                            throw new Error('Unauthorized');
                        }
                        return r.json(); 
                    })
                    .then(function(json) {
                        if (!json.success) {
                            throw new Error(json.error || '회차 정보 로드 실패');
                        }
                        var list = json.data || [];
                        if (list.length === 0) {
                            container.innerHTML = '<div class="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs font-bold font-black">개설된 회차가 없습니다. <a href="/admin/courses/sessions/register?approvedCourseId=' + courseId + '" class="text-primary-600 ml-2 underline">새 회차 개설하기</a></div>';
                            return;
                        }

                        var html = '<div class="grid grid-cols-1 gap-3">';
                        list.forEach(function(item) {
                            var statusCls = statusClassMap[item.status] || 'bg-slate-100 text-slate-500';
                            var statusTxt = statusMap[item.status] || item.status;
                            var range = [item.training_start_date, item.training_end_date].filter(Boolean).map(s => s.substring(0, 10)).join(' ~ ') || '-';
                            
                            var homepageBtn = item.homepage_exposed 
                                ? ' <button onclick="event.stopPropagation(); window.dashboardSetHomepageExposed(' + courseId + ',' + item.id + ', 0)" class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition flex items-center gap-1"><i class="fas fa-eye"></i> 노출중</button>'
                                : ' <button onclick="event.stopPropagation(); window.dashboardSetHomepageExposed(' + courseId + ',' + item.id + ', 1)" class="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition flex items-center gap-1"><i class="fas fa-eye-slash"></i> 숨김</button>';

                            var fullCourseName = (item.course_name || '과정') + ' ' + (item.session_number != null ? item.session_number + '차' : '') + (item.session_name ? ' ' + item.session_name : '');
                            var lmsPathId = (item.lms_course_id != null && String(item.lms_course_id).trim() !== '') ? item.lms_course_id : item.id;
                            var lmsQuery = '?type=hrd&session_id=' + encodeURIComponent(String(item.id));
                            html += '<div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition group/card">' +
                                '<div class="flex items-center gap-4 min-w-0">' +
                                    '<div class="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg font-black text-slate-400 text-xs shrink-0">' + item.session_number + '차</div>' +
                                    '<div class="min-w-0">' +
                                        '<div class="flex items-center gap-2 mb-0.5 flex-wrap">' +
                                            '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ' + statusCls + '">' + statusTxt + '</span>' +
                                            '<span class="font-bold text-slate-800 text-[13px] break-words">' + (fullCourseName.replace(/</g, '&lt;')) + '</span>' +
                                        '</div>' +
                                        '<div class="text-[10px] text-slate-400 font-medium"><i class="far fa-calendar-alt mr-1"></i> ' + range + '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">' +
                                    '<a href="/admin/courses/' + lmsPathId + '/lms' + lmsQuery + '" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm"><i class="fas fa-chalkboard-teacher"></i> LMS 관리</a>' +
                                    homepageBtn +
                                    '<div class="h-4 w-[1px] bg-slate-100 mx-1"></div>' +
                                    '<a href="/admin/courses/sessions/enrollments?sessionId=' + item.id + '" class="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition"><i class="fas fa-user-plus mr-1"></i> 수강생 등록</a>' +
                                    '<a href="/admin/courses/sessions/register/' + item.id + '" class="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition">수정</a>' +
                                    '<a href="/admin/courses/sessions/' + item.id + '/timetable" class="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition"><i class="far fa-calendar-alt mr-1"></i> 시간표</a>' +
                                    '<a href="/admin/courses/sessions/' + item.id + '/syllabus" class="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition">교수계획서</a>' +
                                    '<button onclick="event.stopPropagation(); window.dashboardDeleteSession(' + item.id + ')" class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition"><i class="fas fa-trash-alt text-xs"></i></button>' +
                                '</div>' +
                            '</div>';
                        });
                        html += '</div>';
                        container.innerHTML = html;
                    })
                    .catch(function(err) {
                        if (err.message === 'Unauthorized') return;
                        console.error(err);
                        container.innerHTML = '<div class="p-6 text-center text-red-500 text-xs">회차 정보를 불러오지 못했습니다: ' + (err.message || '오류 발생') + '</div>';
                    });
            };

            window.dashboardSetHomepageExposed = function(courseId, id, val) {
                if (!id) return;
                fetch('/api/course-sessions/' + id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ homepage_exposed: val })
                }).then(function(r) { return r.json(); })
                  .then(function(json) { 
                      if (json.success) {
                          // 해당 컨테이너만 부분 리프레시하기 위해 toggleSessions 다시 호출 (이미 열려있는 상태)
                          var subRow = document.getElementById('sessions-row-' + courseId);
                          var row = subRow.previousElementSibling;
                          toggleSessions(courseId, row); 
                      } else alert(json.error || '처리 실패'); 
                  })
                  .catch(function() { alert('처리 중 오류가 발생했습니다.'); });
            };

            window.dashboardDeleteSession = function(id) {
                if (!id || !confirm('이 회차를 삭제할까요?')) return;
                fetch('/api/course-sessions/' + id, { method: 'DELETE', headers: headers })
                    .then(function(r) { return r.json(); })
                    .then(function(json) { if (json.success) location.reload(); else alert(json.error || '삭제 실패'); })
                    .catch(function() { alert('삭제 중 오류가 발생했습니다.'); });
            };

            loadApproved();
        })();
    </script>
</body>
</html>
`;
}
