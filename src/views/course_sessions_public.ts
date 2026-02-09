import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

/** 연동 홈페이지용 회차별 과정 목록 */
export const courseSessionsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육 과정 안내 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '#f0f7ff', 100: '#e0effe', 500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3' }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    ${navigationHtml('course-sessions')}

    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">교육 과정 안내</h1>
            <p class="text-xl text-blue-100">현재 모집 중이거나 진행 중인 훈련 과정을 확인하세요.</p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-wrap gap-2 mb-8">
            <button onclick="loadList('')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-primary-600 text-white shadow-md active:scale-95" data-status="">전체</button>
            <button onclick="loadList('recruiting')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="recruiting">모집중</button>
            <button onclick="loadList('in_progress')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="in_progress">진행중</button>
            <button onclick="loadList('always_open')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="always_open">상시모집</button>
        </div>

        <div id="sessionsList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px] transition-opacity duration-300">
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
                <p class="text-gray-500">과정을 불러오는 중입니다...</p>
            </div>
        </div>

        <div id="sessionsPagination" class="mt-8 flex justify-center gap-2"></div>
    </div>

    ${footerHtml()}

    <script>
        var currentPage = 1;
        var currentStatus = '';
        var currentCategory = new URLSearchParams(window.location.search).get('category') || '';
        var lastRequestId = 0;

        function statusText(s) {
            return { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' }[s] || s;
        }

        function updatePageHead() {
            var titleEl = document.querySelector('h1');
            var subEl = document.querySelector('p.text-xl');
            if (currentCategory && titleEl) {
                titleEl.innerText = currentCategory + ' 안내';
                if (subEl) subEl.innerText = '와우쓰리디홍대센터의 ' + currentCategory + ' 목록입니다.';
            }
        }

        function updateTabStyles() {
            document.querySelectorAll('.filter-session').forEach(function(btn) {
                var active = (btn.dataset.status || '') === currentStatus;
                if (active) {
                    btn.className = 'filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-primary-600 text-white shadow-md active:scale-95';
                } else {
                    btn.className = 'filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95';
                }
            });
        }

        function loadList(status) {
            if (status !== undefined) { 
                var newStatus = status || '';
                if (currentStatus === newStatus && currentPage === 1 && lastRequestId !== 0) return; // 중복 요청 방지
                currentStatus = newStatus; 
                currentPage = 1; 
            }
            
            updateTabStyles();
            updatePageHead();

            var requestId = ++lastRequestId;
            var listEl = document.getElementById('sessionsList');
            var paginationEl = document.getElementById('sessionsPagination');

            listEl.style.opacity = '0.5';
            
            var url = '/api/course-sessions/public?page=' + currentPage + '&limit=12';
            if (currentStatus) url += '&status=' + encodeURIComponent(currentStatus);
            if (currentCategory) url += '&category=' + encodeURIComponent(currentCategory);

            fetch(url)
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (requestId !== lastRequestId) return;
                    listEl.style.opacity = '1';
                    if (!res.success) {
                        listEl.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"><p class="text-gray-600">목록을 불러올 수 없습니다.</p></div>';
                        paginationEl.innerHTML = '';
                        return;
                    }

                    var list = res.data || [];
                    if (list.length === 0) {
                        listEl.innerHTML = '<div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm"><i class="fas fa-calendar-check text-4xl text-gray-300 mb-4"></i><p class="text-gray-600">해당 조건의 개설 과정이 없습니다.</p></div>';
                        paginationEl.innerHTML = '';
                        return;
                    }

                    listEl.innerHTML = list.map(function(s) {
                        var imgUrl = (s.image_url || '').trim() || '/static/course_placeholder.jpg';
                        var start = (s.training_start_date || '').trim();
                        var end = (s.training_end_date || '').trim();
                        var dateStr = start && end ? (new Date(start).toLocaleDateString('ko-KR') + ' ~ ' + new Date(end).toLocaleDateString('ko-KR')) : (start ? new Date(start).toLocaleDateString('ko-KR') + '~' : '일정 미정');
                        var statusClass = s.status === 'recruiting' ? 'bg-green-500' : s.status === 'in_progress' ? 'bg-blue-500' : s.status === 'always_open' ? 'bg-emerald-500' : 'bg-gray-500';
                        
                        var detailUrl = s.source === 'session' ? '/course-sessions/' + s.id : '/courses/' + s.id;
                        var sourceBadge = s.source === 'session' ? '' : '<span class="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded bg-black/50 text-white backdrop-blur-sm shadow-sm">일반과정</span>';

                        return '<a href="' + detailUrl + '" class="bg-white rounded-lg shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden flex flex-col h-full group">' +
                            '<div class="relative h-48 overflow-hidden bg-gray-200"><img src="' + imgUrl.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src=\\'/static/course_placeholder.jpg\\'">' +
                            '<span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ' + statusClass + '">' + statusText(s.status) + '</span>' + 
                            sourceBadge + '</div>' +
                            '<div class="p-5 flex-1 flex flex-col"><span class="text-xs text-primary-600 font-medium mb-1">' + (s.category_name || '과정') + '</span>' +
                            '<h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600">' + (s.course_name || '').replace(/</g, '&lt;') + '</h3>' +
                            '<p class="text-sm text-gray-500 mb-3">' + (s.session_number ? s.session_number + '회차' : '') + '</p>' +
                            '<div class="mt-auto pt-3 border-t border-gray-100 text-sm text-gray-500"><i class="far fa-calendar-alt mr-2"></i>' + dateStr + '</div></div></a>';
                    }).join('');

                    var p = res.pagination || {};
                    var totalPages = p.totalPages || 1;
                    if (totalPages <= 1) paginationEl.innerHTML = '';
                    else {
                        var html = '';
                        if (currentPage > 1) html += '<a href="#" onclick="setPage(' + (currentPage - 1) + '); return false;" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm">이전</a>';
                        html += '<span class="px-3 py-1 text-sm text-gray-600">' + currentPage + ' / ' + totalPages + '</span>';
                        if (currentPage < totalPages) html += '<a href="#" onclick="setPage(' + (currentPage + 1) + '); return false;" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm">다음</a>';
                        paginationEl.innerHTML = html;
                    }
                })
                .catch(function(err) {
                    if (requestId !== lastRequestId) return;
                    listEl.style.opacity = '1';
                    listEl.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"><p class="text-gray-600">연결에 실패했습니다.</p></div>';
                    paginationEl.innerHTML = '';
                });
        }

        function setPage(p) { 
            currentPage = p; 
            window.scrollTo({ top: document.getElementById('sessionsList').offsetTop - 100, behavior: 'smooth' });
            loadList(); 
        }

        document.addEventListener('DOMContentLoaded', function() { loadList(); });
    </script>
</body>
</html>
`;

/** 연동 홈페이지용 과전 상세 (id는 클라이언트에서 채움) */
export function courseSessionDetailHtml(id: string, source: 'session' | 'general' = 'session') {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>과정 상세 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script> tailwind.config = { theme: { extend: { colors: { primary: { 500: '#5b9bd5', 600: '#4a90e2' } } } } } </script>
</head>
<body class="bg-gray-50">
    ${navigationHtml('course-sessions')}

    <div id="detailWrap" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
            <p class="text-gray-500">불러오는 중...</p>
        </div>
    </div>

    ${footerHtml()}

    <script>
        var sessionId = ${JSON.stringify(id)};
        var source = ${JSON.stringify(source)};
        fetch('/api/course-sessions/public/' + sessionId + '?source=' + source)
            .then(function(r) { return r.json(); })
            .then(function(res) {
                var wrap = document.getElementById('detailWrap');
                if (!res.success || !res.data) {
                    wrap.innerHTML = '<div class="bg-white rounded-xl shadow-sm p-12 text-center"><p class="text-gray-600">과정을 찾을 수 없습니다.</p><a href="/course-sessions" class="inline-block mt-4 text-primary-600 font-medium">목록으로</a></div>';
                    return;
                }
                var detailTitle = source === 'general' ? '과정 상세' : '회차 상세';
                var s = res.data;
                var statusLabel = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
                var imgUrl = (s.image_url || s.main_slide_image_url || s.course_list_image_url || '').trim() || '/static/course_placeholder.jpg';
                var start = (s.training_start_date || '').trim();
                var end = (s.training_end_date || '').trim();
                var dateStr = start && end ? (new Date(start).toLocaleDateString('ko-KR') + ' ~ ' + new Date(end).toLocaleDateString('ko-KR')) : (start ? new Date(start).toLocaleDateString('ko-KR') : '일정 미정');
                var syllabusHtml = (s.syllabus_exposure === 'expose' && (s.url_plan || s.url_detail_plan)) ? '<div class="mt-6"><a href="' + (s.url_plan || s.url_detail_plan || '#').replace(/"/g, '&quot;') + '" target="_blank" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><i class="fas fa-file-alt mr-2"></i>수업계획서 보기</a></div>' : '';
                var descHtml = (s.course_detail_description || '').trim() ? '<div class="prose prose-slate max-w-none mt-6">' + s.course_detail_description + '</div>' : '';
                wrap.innerHTML = '<div class="bg-white rounded-xl shadow-sm overflow-hidden">' +
                    '<div class="relative h-64 sm:h-80 bg-gray-200"><img src="' + imgUrl.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-cover" onerror="this.src=\\'/static/course_placeholder.jpg\\'">' +
                    '<span class="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold text-white ' + (s.status === 'recruiting' ? 'bg-green-500' : s.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500') + '">' + (statusLabel[s.status] || s.status) + '</span></div>' +
                    '<div class="p-6 sm:p-8">' +
                    '<span class="text-sm text-primary-600 font-medium">' + (s.category_name || '과정') + '</span>' +
                    '<h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">' + (s.course_name || '').replace(/</g, '&lt;') + '</h1>' +
                    '<p class="text-gray-500 mt-1">' + (s.session_number ? s.session_number + '회차' : '') + '</p>' +
                    '<dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">' +
                    '<div><dt class="text-gray-500">교육기간</dt><dd class="font-medium text-gray-800">' + dateStr + '</dd></div>' +
                    '<div><dt class="text-gray-500">훈련시간</dt><dd class="font-medium text-gray-800">' + (s.total_hours ? s.total_hours + '시간' : '-') + '</dd></div>' +
                    (s.instructor_name ? '<div><dt class="text-gray-500">담당 강사</dt><dd class="font-medium text-gray-800">' + String(s.instructor_name).replace(/</g, '&lt;') + '</dd></div>' : '') +
                    (s.location ? '<div><dt class="text-gray-500">교육장소</dt><dd class="font-medium text-gray-800">' + String(s.location).replace(/</g, '&lt;') + '</dd></div>' : '') +
                    '</dl>' + syllabusHtml + descHtml +
                    '</div></div>' +
                    '<div class="mt-6"><a href="/course-sessions" class="inline-flex items-center text-primary-600 font-medium"><i class="fas fa-arrow-left mr-2"></i>목록으로</a></div>';
                document.title = (s.course_name || '과정 상세') + ' - 와우쓰리디홍대센터';
            })
            .catch(function() {
                document.getElementById('detailWrap').innerHTML = '<div class="bg-white rounded-xl shadow-sm p-12 text-center"><p class="text-gray-600">연결에 실패했습니다.</p><a href="/course-sessions" class="inline-block mt-4 text-primary-600 font-medium">목록으로</a></div>';
            });
    </script>
</body>
</html>
`;
}
