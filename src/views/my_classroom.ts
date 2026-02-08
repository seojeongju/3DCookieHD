
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
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-800">수강 중인 과정</h2>
            </div>
            <div id="courseList" class="divide-y divide-gray-200">
                <div class="p-12 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                </div>
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
        document.addEventListener('DOMContentLoaded', () => {
            loadMyCourses();
        });

        async function loadMyCourses() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch('/api/enrollments?status=approved&limit=50', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (!result.success) {
                    document.getElementById('courseList').innerHTML = '<div class="p-6 text-center text-red-500">수강 목록을 불러올 수 없습니다.</div>';
                    return;
                }
                const list = result.data || [];
                const courses = list.map(function (e) {
                    var start = (e.course_start_date || '').toString().substring(0, 10);
                    var end = (e.course_end_date || '').toString().substring(0, 10);
                    var period = (start && end) ? (start + ' ~ ' + end) : (start || end || '-');
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

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('courseList').innerHTML = '<div class="p-6 text-center text-red-500">오류가 발생했습니다.</div>';
            }
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
