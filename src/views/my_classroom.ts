
export const myClassroomHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 강의실 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center gap-2">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto">
                        <span class="font-bold text-gray-800">LMS</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-600 hover:text-primary-600 font-medium">
                        <i class="fas fa-home mr-1"></i> 홈으로
                    </a>
                    <button onclick="logout()" class="text-gray-600 hover:text-red-600 font-medium">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-primary-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold mb-2">나의 강의실</h1>
            <p class="text-primary-200">수강 중인 과정과 학습 현황을 확인하세요.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 수강 중인 과정 목록 -->
        <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div class="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-xl font-bold text-gray-800">수강 중인 과정</h2>
                <div class="flex flex-wrap items-center gap-3">
                    <span id="searchResultTextMyClassroom" class="text-sm text-gray-500"></span>
                    <label class="flex items-center gap-1.5 text-sm text-gray-500">
                        <span>페이지당</span>
                        <select id="rowsPerPageMyClassroom" onchange="setRowsPerPageMyClassroom(parseInt(this.value,10))" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary-500">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50" selected>50</option>
                        </select>
                        <span>건</span>
                    </label>
                </div>
            </div>
            <div id="courseList" class="divide-y divide-gray-200">
                <div class="p-12 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                </div>
            </div>
            <div class="mt-6 px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <div id="paginationRangeMyClassroom" class="text-sm text-gray-600"></div>
                <nav id="paginationContainerMyClassroom" class="flex flex-wrap items-center justify-center gap-1"></nav>
            </div>
        </div>

        <!-- 학습 현황 요약 (예시) -->
        <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">나의 출석률</h3>
                    <i class="fas fa-user-clock text-primary-500 text-2xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-900">92%</div>
                <p class="text-sm text-gray-500 mt-1">지난 달 대비 +2%</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">과제 제출</h3>
                    <i class="fas fa-tasks text-green-500 text-2xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-900">8/10</div>
                <p class="text-sm text-gray-500 mt-1">미제출 과제 2건</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">평균 성적</h3>
                    <i class="fas fa-chart-line text-purple-500 text-2xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-900">88.5</div>
                <p class="text-sm text-gray-500 mt-1">상위 15%</p>
            </div>
        </div>
    </div>

    <script>
        let currentPageMyClassroom = 1;
        let limitMyClassroom = 50;

        document.addEventListener('DOMContentLoaded', () => {
            loadMyCourses(1);
        });

        function setRowsPerPageMyClassroom(n) {
            limitMyClassroom = n;
            var sel = document.getElementById('rowsPerPageMyClassroom');
            if (sel) sel.value = String(n);
            loadMyCourses(1);
        }

        async function loadMyCourses(page) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    window.location.href = '/login';
                    return;
                }
                currentPageMyClassroom = page || 1;
                document.getElementById('searchResultTextMyClassroom').textContent = '';
                document.getElementById('paginationRangeMyClassroom').textContent = '';
                document.getElementById('paginationContainerMyClassroom').innerHTML = '';

                const response = await fetch('/api/enrollments?status=approved&page=' + currentPageMyClassroom + '&limit=' + limitMyClassroom, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (!result.success) {
                    document.getElementById('courseList').innerHTML = '<div class="p-6 text-center text-red-500">수강 목록을 불러올 수 없습니다.</div>';
                    return;
                }
                const list = result.data || [];
                const p = result.pagination || {};
                const total = p.total != null ? p.total : list.length;
                const totalPages = p.totalPages != null ? p.totalPages : 1;
                const pageNum = p.page != null ? p.page : currentPageMyClassroom;
                if (p.limit) {
                    limitMyClassroom = p.limit;
                    var sel = document.getElementById('rowsPerPageMyClassroom');
                    if (sel) sel.value = String(p.limit);
                }
                document.getElementById('searchResultTextMyClassroom').textContent = '검색결과 ' + total + '건';
                const start = total === 0 ? 0 : (pageNum - 1) * (p.limit || limitMyClassroom) + 1;
                const end = Math.min(pageNum * (p.limit || limitMyClassroom), total);
                document.getElementById('paginationRangeMyClassroom').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';

                const courses = list.map(function (e) {
                    var startStr = (e.course_start_date || '').toString().substring(0, 10);
                    var endStr = (e.course_end_date || '').toString().substring(0, 10);
                    var period = (startStr && endStr) ? (startStr + ' ~ ' + endStr) : (startStr || endStr || '-');
                    var statusText = (e.status === 'approved') ? '수강중' : (e.status === 'completed') ? '수료' : (e.status || '');
                    return {
                        id: e.course_id,
                        title: e.course_title || '과정',
                        period: period,
                        progress: Number(e.progress) || 0,
                        status: statusText
                    };
                });
                renderCourses(courses);
                renderPaginationMyClassroom(totalPages, pageNum);

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('courseList').innerHTML = '<div class="p-6 text-center text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function renderPaginationMyClassroom(totalPages, pageNum) {
            var container = document.getElementById('paginationContainerMyClassroom');
            if (!totalPages || totalPages <= 1) { container.innerHTML = ''; return; }
            var current = pageNum != null ? pageNum : currentPageMyClassroom;
            var radius = 2;
            var pages = [];
            for (var i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - radius && i <= current + radius)) pages.push(i);
                else if (pages[pages.length - 1] !== '...') pages.push('...');
            }
            var html = '';
            html += '<button type="button" onclick="loadMyCourses(' + (current - 1) + ')" ' + (current <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (current <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
            pages.forEach(function(n) {
                if (n === '...') html += '<span class="px-2 py-2 text-gray-400">…</span>';
                else {
                    var active = n === current;
                    html += '<button type="button" onclick="loadMyCourses(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50') + '">' + n + '</button>';
                }
            });
            html += '<button type="button" onclick="loadMyCourses(' + (current + 1) + ')" ' + (current >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (current >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
            container.innerHTML = html;
        }

        function renderCourses(courses) {
            const container = document.getElementById('courseList');
            
            if (courses.length === 0) {
                container.innerHTML = '<div class="p-12 text-center text-gray-500">수강 중인 과정이 없습니다.</div>';
                return;
            }

            container.innerHTML = courses.map(course => \`
                <div class="p-6 md:flex items-center justify-between hover:bg-gray-50 transition">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">\${course.status}</span>
                            <span class="text-sm text-gray-500"><i class="far fa-calendar-alt mr-1"></i> \${course.period}</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-2">\${course.title}</h3>
                        <div class="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-1">
                            <div class="bg-primary-600 h-2.5 rounded-full" style="width: \${course.progress}%"></div>
                        </div>
                        <p class="text-xs text-gray-500">진도율 \${course.progress}%</p>
                    </div>
                    <div class="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row gap-2">
                        <a href="/courses/\${course.id}/exams" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium text-center transition">
                            <i class="fas fa-laptop-code mr-2"></i> 시험/CBT
                        </a>
                        <button onclick="alert('준비중입니다')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition">
                            <i class="fas fa-user-clock mr-2"></i> 출결현황
                        </button>
                        <button onclick="alert('준비중입니다')" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition">
                            <i class="fas fa-play-circle mr-2"></i> 강의실 입장
                        </button>
                    </div>
                </div>
            \`).join('');
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    </script>
</body>
</html>
`;
