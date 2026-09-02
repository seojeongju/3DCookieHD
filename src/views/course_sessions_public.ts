import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

const _navigationHtml = navigationHtml;
const _footerHtml = footerHtml;

/** 연동 홈페이지용 회차별 과정 목록 */
export const courseSessionsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육 과정 안내 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
<body class="bg-gray-50">
    ` + _navigationHtml('course-sessions') + `

    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">3D프린팅 국비지원·내일배움카드 교육과정</h1>
            <p class="text-xl text-blue-100 max-w-3xl mx-auto">모집 중인 3D프린터운용기능사, 국비지원, 소상공인 맞춤 과정의 일정과 장소를 확인하세요.</p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section class="mb-10 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm" aria-label="교육과정 안내 요약">
            <h2 class="text-lg font-black tracking-tight text-slate-900 mb-3">자주 찾는 안내</h2>
            <p class="text-slate-600 text-[15px] leading-relaxed mb-5">
                와우쓰리디는 국민내일배움카드(국비지원)로 3D프린팅을 배울 수 있는 과정을 홍대·구미·전주에서 운영합니다.
                3D프린터 국가자격증(3D프린터운용기능사) 대비와 국비지원(내일배움카드) 문의도 상담으로 안내합니다.
            </p>
            <div class="flex flex-wrap gap-2">
                <a href="/guides/national-support" class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary-300 hover:text-primary-700">국비지원·내일배움카드</a>
                <a href="/guides/craftsman-license" class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary-300 hover:text-primary-700">기능사·국가자격</a>
                <a href="/tomorrow-learning-card" class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary-300 hover:text-primary-700">내일배움카드 발급</a>
                <a href="/faq" class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary-300 hover:text-primary-700">FAQ</a>
            </div>
        </section>

        <div class="flex flex-wrap gap-2 mb-3">
            <button onclick="loadList('')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-primary-600 text-white shadow-md active:scale-95" data-status="">전체</button>
            <button onclick="loadList('recruiting')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="recruiting">모집중</button>
            <button onclick="loadList('in_progress')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="in_progress">진행중</button>
            <button onclick="loadList('always_open')" class="filter-session px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 active:scale-95" data-status="always_open">상시모집</button>
        </div>
        <div class="flex flex-wrap gap-2 mb-8" aria-label="과정 주제 필터">
            <button type="button" onclick="setTopic('')" class="filter-topic px-4 py-2 rounded-full text-sm font-bold border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700" data-topic="">주제 전체</button>
            <button type="button" onclick="setTopic('기능사')" class="filter-topic px-4 py-2 rounded-full text-sm font-bold border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700" data-topic="기능사">3D프린터운용기능사</button>
            <button type="button" onclick="setTopic('국비')" class="filter-topic px-4 py-2 rounded-full text-sm font-bold border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700" data-topic="국비">국비·내일배움카드</button>
            <button type="button" onclick="setTopic('소상공인')" class="filter-topic px-4 py-2 rounded-full text-sm font-bold border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700" data-topic="소상공인">소상공인</button>
        </div>

        <div id="sessionsList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px] transition-opacity duration-300">
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
                <p class="text-gray-500">과정을 불러오는 중입니다...</p>
            </div>
        </div>

        <div id="sessionsPagination" class="mt-8 flex justify-center gap-2"></div>
    </div>

    ` + _footerHtml() + `

    <script>
        var currentPage = 1;
        var currentStatus = '';
        var currentCategory = new URLSearchParams(window.location.search).get('category') || '';
        var currentTopic = '';
        var lastRequestId = 0;

        function statusText(s) {
            return { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' }[s] || s;
        }

        function topicBadges(name, category) {
            var text = String(name || '') + ' ' + String(category || '');
            var badges = '';
            if (/기능사|운용기능사|국가자격/.test(text)) badges += '<span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-violet-100 text-violet-700">기능사</span>';
            if (/국비|내일배움|NCS/.test(text)) badges += '<span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-700">국비</span>';
            if (/소상공인|쿠키|몰드/.test(text)) badges += '<span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-800">소상공인</span>';
            return badges;
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
            document.querySelectorAll('.filter-topic').forEach(function(btn) {
                var active = (btn.dataset.topic || '') === currentTopic;
                btn.className = active
                    ? 'filter-topic px-4 py-2 rounded-full text-sm font-bold border border-primary-500 bg-primary-50 text-primary-700'
                    : 'filter-topic px-4 py-2 rounded-full text-sm font-bold border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700';
            });
        }

        function setTopic(topic) {
            currentTopic = topic || '';
            currentPage = 1;
            loadList();
        }

        function loadList(status) {
            if (status !== undefined) { 
                currentStatus = status || ''; 
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
            if (currentTopic) url += '&q=' + encodeURIComponent(currentTopic);

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
                            var imgUrl = (s.image_url || '').trim() || '/static/course_placeholder.svg';
                            var start = (s.training_start_date || '').trim();
                            var end = (s.training_end_date || '').trim();
                            var dateStr = start && end ? (new Date(start).toLocaleDateString('ko-KR') + ' ~ ' + new Date(end).toLocaleDateString('ko-KR')) : (start ? new Date(start).toLocaleDateString('ko-KR') + '~' : '일정 미정');
                            var statusClass = s.status === 'recruiting' ? 'bg-green-500' : s.status === 'in_progress' ? 'bg-blue-500' : s.status === 'always_open' ? 'bg-emerald-500' : 'bg-gray-500';
                            
                            var detailUrl = s.source === 'session' ? '/course-sessions/' + s.id : '/courses/' + s.id;
                            var sourceBadge = s.source === 'session' ? '' : '<span class="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded bg-black/50 text-white backdrop-blur-sm shadow-sm">일반과정</span>';

                            var dn = (s.course_name || '').trim();
                            if (s.session_number) dn += ' + ' + s.session_number + '회차';
                            if (s.session_name) dn += ' + ' + s.session_name;
                            var nameEsc = dn.replace(/</g, '&lt;').replace(/"/g, '&quot;');
                            var badges = topicBadges(dn, s.category_name);

                            return '<a href="' + detailUrl + '" class="bg-white rounded-lg shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden flex flex-col h-full group">' +
                                '<div class="relative h-48 overflow-hidden bg-white/50 border-b border-gray-50">' +
                                '<img src="' + imgUrl.replace(/"/g, '&quot;') + '" alt="" class="w-full h-full object-contain group-hover:scale-105 transition duration-300" onerror="this.src=\\'/static/course_placeholder.svg\\'">' +
                                '<span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ' + statusClass + '">' + statusText(s.status) + '</span>' + 
                                sourceBadge + '</div>' +
                                '<div class="p-5 flex-1 flex flex-col"><div class="flex flex-wrap items-center gap-1.5 mb-2"><span class="text-xs text-primary-600 font-medium">' + (s.category_name || '과정') + '</span>' + badges + '</div>' +
                                '<h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600">' + nameEsc + '</h3>' +
                                '<p class="text-sm text-gray-500 mb-3">' + (s.session_number ? s.session_number + '회차' : '') + (s.instructor_name ? ' · ' + s.instructor_name : '') + '</p>' +
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
export type CourseDetailSsr = {
    title: string;
    summary: string;
};

function escapeHtmlText(value: string): string {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function courseSessionDetailHtml(
    id: string,
    source: 'session' | 'general' = 'session',
    ssr?: CourseDetailSsr,
) {
    const fallbackTitle = source === 'general' ? `일반 교육과정 ${id}` : `3D프린팅 국비지원 과정 ${id}`;
    const ssrTitle = escapeHtmlText(ssr?.title || fallbackTitle);
    const ssrSummary = escapeHtmlText(
        ssr?.summary ||
            '와우쓰리디에서 운영하는 3D프린팅·3D모델링 교육 과정입니다. 내일배움카드(국비지원)·기능사 대비 일정과 장소를 확인하세요.',
    );
    let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ssrTitle} - 와우쓰리디홍대센터</title>
    <meta name="description" content="${ssrSummary}">
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"></noscript>
    <style>
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); }
        .info-grid-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #f0f7ff; color: #4a90e2; }
        .prose img { border-radius: 1rem; margin: 2rem 0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .course-badge { padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
        footer { margin-top: 0 !important; }
    </style>
</head>
<body class="bg-slate-50 font-sans leading-relaxed text-slate-900">
    ` + _navigationHtml('course-sessions') + `

    <div id="detailContent">
        <div class="max-w-6xl mx-auto px-4 py-12" id="ssrCourseDetail">
            <p class="text-xs font-black uppercase tracking-wider text-primary-600 mb-3">${source === 'general' ? '일반 교육과정' : '국비지원·내일배움카드 과정'}</p>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-4">${ssrTitle}</h1>
            <p class="text-slate-600 leading-relaxed max-w-3xl mb-6">${ssrSummary}</p>
            <div class="flex flex-wrap gap-2 text-sm">
                <a href="/online-consulting" class="inline-flex rounded-xl bg-primary-600 px-4 py-2.5 font-bold text-white">수강 상담</a>
                <a href="/course-sessions" class="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-700">과정 목록</a>
            </div>
            <div class="mt-10 animate-pulse">
                <div class="h-48 bg-slate-200 rounded-[2rem]"></div>
                <p class="mt-4 text-sm text-slate-400 font-bold">상세 정보를 불러오는 중…</p>
            </div>
        </div>
    </div>

    ` + _footerHtml() + `

    <script>
        var sessionId = ` + JSON.stringify(id) + `;
        var source = ` + JSON.stringify(source) + `;
        
        function formatDetail() {
            fetch('/api/course-sessions/public/' + sessionId + '?source=' + source)
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    var container = document.getElementById('detailContent');
                    if (!res.success || !res.data) {
                        container.innerHTML = '<div class="min-h-[60vh] flex items-center justify-center"><div class="text-center"><div class="bg-white p-10 rounded-3xl shadow-lg inline-block"><i class="fas fa-exclamation-triangle text-5xl text-amber-500 mb-4"></i><p class="text-xl font-bold text-slate-800">과정 정보를 찾을 수 없습니다.</p><a href="/course-sessions" class="inline-block mt-6 px-6 py-2 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 transition">목록으로 돌아가기</a></div></div></div>';
                        return;
                    }
                    
                    var s = res.data;
                    var dn = (s.course_name || '').trim();
                    if (s.session_number) dn += ' + ' + s.session_number + '회차';
                    if (s.session_name) dn += ' + ' + s.session_name;
                    var nameEsc = dn.replace(/</g, '&lt;').replace(/"/g, '&quot;');
                    
                    document.title = dn + ' #' + sessionId + ' - 와우쓰리디홍대센터';
                    
                    var statusMap = {
                        recruiting: { label: '모집중', color: 'bg-emerald-500' },
                        in_progress: { label: '진행중', color: 'bg-blue-500' },
                        completed: { label: '종료', color: 'bg-slate-500' },
                        always_open: { label: '상시모집', color: 'bg-indigo-500' },
                        closed: { label: '폐강', color: 'bg-red-500' }
                    };
                    var status = statusMap[s.status] || { label: s.status, color: 'bg-slate-500' };
                    var imgUrl = (s.image_url || s.main_slide_image_url || s.course_list_image_url || '').trim() || '/static/hero1.jpg';
                    
                    var start = (s.training_start_date || '').trim();
                    var end = (s.training_end_date || '').trim();
                    var dateStr = start && end ? (new Date(start).toLocaleDateString('ko-KR') + ' ~ ' + new Date(end).toLocaleDateString('ko-KR')) : (start ? new Date(start).toLocaleDateString('ko-KR') + ' 시작' : '상시 모집');
                    
                    var syllabusBtn = (s.syllabus_exposure === 'expose' && (s.url_plan || s.url_detail_plan)) ? 
                        '<a href="' + (s.url_plan || s.url_detail_plan || '#').replace(/"/g, '&quot;') + '" target="_blank" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition shadow-sm">' +
                        '<i class="fas fa-file-pdf mr-2"></i>수업계획서 확인하기</a>' : '';

                    var inner = "";
                    inner += "<!-- Hero Section -->";
                    inner += "<div class='relative h-[180px] sm:h-[220px] overflow-hidden'>";
                    inner += "<img src='/static/hero1.jpg' alt='' class='w-full h-full object-cover brightness-50 transition duration-700'>";
                    inner += "<div class='absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent'></div>";
                    inner += "<div class='absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 mb-8 sm:mb-12'>";
                    inner += "<div class='mb-2'>"; // 네비게이션 제거 및 여백 축소
                    inner += "<div class='flex flex-wrap items-center gap-2 mb-2'>";
                    inner += "<span class='course-badge text-white " + status.color + " font-extrabold text-[10px]'>" + status.label + "</span>";
                    inner += "<span class='course-badge bg-white/20 backdrop-blur-md text-white border border-white/30 font-extrabold font-black text-[10px]'>" + (source === "general" ? "일반직무" : "국비지원") + "</span>";
                    inner += "</div>";
                    inner += "<h1 class='text-xl sm:text-2xl font-black text-slate-800 leading-tight drop-shadow-sm line-clamp-1'>" + nameEsc + "</h1>";
                    inner += "</div>";
                    inner += "</div>";
                    inner += "</div>";
                    inner += "<!-- Main Content Container -->";
                    inner += "<div class='max-w-6xl mx-auto px-4 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8'>";
                    inner += "<!-- 1. Info Summary Card -->";
                    inner += "<div class='lg:col-span-2'>";
                    inner += "<div class='bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100 overflow-hidden h-full flex flex-col'>";
                    inner += "<h2 class='text-xl font-black text-slate-800 mb-8 flex items-center gap-2'>";
                    inner += "<span class='w-2 h-6 bg-primary-600 rounded-full'></span>주요 교육 정보</h2>";
                    inner += "<div class='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12'>";
                    inner += "<!-- 기간 --><div class='flex items-start gap-4'><div class='info-grid-icon'><i class='far fa-calendar-check'></i></div><div><dt class='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>교육기간</dt><dd class='text-base font-bold text-slate-800 font-black font-extrabold font-bold'>" + dateStr + "</dd></div></div>";
                    inner += "<!-- 시간 --><div class='flex items-start gap-4'><div class='info-grid-icon'><i class='far fa-clock'></i></div><div><dt class='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>총 교육시간</dt><dd class='text-base font-bold text-slate-800 mr-2 font-black font-extrabold font-bold font-black'>" + (s.total_hours ? s.total_hours + "시간" : "-") + "</dd></div></div>";
                    inner += "<!-- 장소 --><div class='flex items-start gap-4'><div class='info-grid-icon'><i class='fas fa-map-marker-alt'></i></div><div><dt class='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>교육장소</dt><dd class='text-base font-bold text-slate-800 font-bold italic font-black font-bold'>" + (s.location || "와우쓰리디홍대센터").replace(/</g, "&lt;") + "</dd></div></div>";
                    inner += "<!-- 강사 --><div class='flex items-start gap-4'><div class='info-grid-icon'><i class='fas fa-user-tie'></i></div><div><dt class='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>담당강사</dt><dd class='text-base font-bold text-slate-800 font-black italic font-bold'>" + (s.instructor_name || "전임 강사").replace(/</g, "&lt;") + "</dd></div></div>";
                    inner += "</div>";
                    inner += "<div class='mt-auto flex flex-wrap gap-4 border-t border-slate-50 pt-8'>";
                    inner += "<button onclick=\\"window.location.href='/online-consulting'\\" class='w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 active:scale-95 font-bold font-black'><i class='fas fa-paper-plane mr-2'></i>수강 신청 / 온라인 상담</button>";
                    inner += syllabusBtn;
                    inner += "</div></div></div>";
                    inner += "<!-- 2. Representative Image Card -->";
                    inner += "<div class='lg:col-span-1'>";
                    inner += "<div class='bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 h-full flex flex-col'>";
                    inner += "<div class='relative group cursor-zoom-in bg-slate-50 flex-1' onclick=\\"window.open('" + imgUrl + "', '_blank')\\"><img src='" + imgUrl + "' alt='' class='w-full h-full object-contain group-hover:scale-105 transition duration-500'><div class='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center'><i class='fas fa-search-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition duration-300'></i></div></div>";
                    inner += "<div class='p-4'><div class='flex items-center justify-between mb-1'><span class='text-[10px] font-bold text-slate-400 uppercase tracking-tighter'>대표이미지</span><span class='text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>VIEW</span></div><h4 class='font-bold text-slate-800 text-xs line-clamp-1'>" + nameEsc + "</h4></div></div></div>";
                    inner += "<!-- 3. Description Section -->";
                    inner += "<div class='lg:col-span-2 space-y-8'>";
                    inner += "<div class='bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-100'>";
                    inner += "<h2 class='text-xl font-black text-slate-800 mb-8 flex items-center gap-2'>";
                    inner += "<span class='w-2 h-6 bg-primary-600 rounded-full'></span>과정 상세 커리큘럼</h2>";
                    inner += "<div class='prose prose-slate max-w-none prose-img:rounded-3xl prose-headings:font-black prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-primary-600 font-medium'>" + (s.course_detail_description || "<div class='py-12 text-center text-slate-400 tracking-tight'><i class='fas fa-info-circle text-4xl mb-4 block opacity-20'></i>등록된 상세 설명이 없습니다. 자세한 사항은 상담문의 바랍니다.</div>") + "</div>";
                    inner += "</div><div class='flex justify-start pt-4'><a href='/course-sessions' class='inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-primary-500 hover:text-white transition group font-bold'><i class='fas fa-arrow-left transition group-hover:-translate-x-1'></i> 목록으로 돌아가기</a></div></div>";
                    inner += "<!-- 4. Floating Contact Sidebar -->";
                    inner += "<div class='lg:col-span-1'>";
                    inner += "<div class='sticky top-24 space-y-6'>";
                    inner += "<div class='bg-gradient-to-br from-primary-600 to-blue-700 rounded-3xl shadow-xl shadow-primary-500/20 p-8 text-white relative overflow-hidden'><i class='fas fa-phone-alt absolute -right-4 -bottom-4 text-7xl opacity-10'></i><h3 class='text-lg font-black mb-2 tracking-tight'>상담이 필요하신가요?</h3><p class='text-white/80 text-sm mb-6 leading-normal font-medium font-bold'>망설이지 말고 문의주세요.<br>전문 상담원이 과정을 안내해드립니다.</p><div class='space-y-3'>";
                    inner += "<a href='tel:02-3144-3137' class='flex items-center gap-3 bg-white/10 hover:bg-white/20 transition p-3 rounded-2xl border border-white/20'><div class='w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600'><i class='fas fa-phone-alt'></i></div><div><p class='text-[10px] font-bold text-white/60 font-black'>홍대센터 직통</p><p class='text-sm font-black tracking-wider'>02-3144-3137</p></div></a>";
                    inner += "<a href='/online-consulting' class='flex items-center gap-3 bg-white text-primary-600 p-3 rounded-2xl font-black text-sm justify-center hover:bg-slate-100 transition shadow-lg font-black font-extrabold'>온라인 신청하기</a>";
                    inner += "</div></div></div></div></div>";
                    
                    container.innerHTML = inner;
                })
                .catch(function(err) {
                    console.error(err);
                    document.getElementById('detailContent').innerHTML = '<div class="min-h-[60vh] flex items-center justify-center"><div class="text-center bg-white p-12 rounded-3xl shadow-lg border border-red-50"><i class="fas fa-times-circle text-5xl text-red-400 mb-4"></i><p class="text-gray-600 font-bold">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p><a href="/course-sessions" class="inline-block mt-6 text-primary-600 font-medium">과정 목록 보기</a></div></div>';
                });
        }
        
        document.addEventListener('DOMContentLoaded', formatDetail);
    </script>
</body>
</html>
`;
    return html;
}
