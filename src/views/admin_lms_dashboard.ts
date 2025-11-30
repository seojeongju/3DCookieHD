
export const adminLmsDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>학사관리 대시보드 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="flex flex-col items-start group">
                        <div class="flex items-center gap-2">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                            <span class="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">LMS</span>
                        </div>
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">학사관리 시스템</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin/courses" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>과정 목록으로
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 과정 헤더 -->
    <div class="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 bg-white/20 rounded text-xs font-semibold" id="courseCategory">카테고리</span>
                        <span class="px-2 py-1 bg-green-500 rounded text-xs font-semibold" id="courseStatus">진행중</span>
                    </div>
                    <h1 class="text-3xl font-bold mb-2" id="courseTitle">과정명 로딩중...</h1>
                    <p class="text-purple-100 flex items-center gap-4 text-sm">
                        <span id="coursePeriod"><i class="far fa-calendar-alt mr-1"></i> 2024.01.01 ~ 2024.06.30</span>
                        <span id="courseSchedule"><i class="far fa-clock mr-1"></i> 월~금 09:00-18:00</span>
                    </p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold mb-1" id="studentCount">0</div>
                    <div class="text-sm text-purple-200">수강생 수</div>
                </div>
            </div>
        </div>
        
        <!-- 탭 메뉴 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex space-x-1">
                <a href="#" class="px-6 py-3 bg-white text-purple-700 font-bold rounded-t-lg border-b-2 border-purple-700">
                    <i class="fas fa-tachometer-alt mr-2"></i>대시보드
                </a>
                <a href="attendance" class="px-6 py-3 text-purple-100 hover:bg-white/10 hover:text-white font-medium rounded-t-lg transition">
                    <i class="fas fa-user-clock mr-2"></i>출결관리
                </a>
                <a href="cbt" class="px-6 py-3 text-purple-100 hover:bg-white/10 hover:text-white font-medium rounded-t-lg transition">
                    <i class="fas fa-laptop-code mr-2"></i>CBT/시험
                </a>
                <a href="grades" class="px-6 py-3 text-purple-100 hover:bg-white/10 hover:text-white font-medium rounded-t-lg transition">
                    <i class="fas fa-chart-bar mr-2"></i>성적관리
                </a>
                <a href="counseling" class="px-6 py-3 text-purple-100 hover:bg-white/10 hover:text-white font-medium rounded-t-lg transition">
                    <i class="fas fa-comments mr-2"></i>상담일지
                </a>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 요약 카드 -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">오늘 출석률</h3>
                    <i class="fas fa-user-check text-blue-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="todayAttendanceRate">--%</span>
                    <span class="text-sm text-gray-500 mb-1" id="todayAttendanceCount">(0/0명)</span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">진도율</h3>
                    <i class="fas fa-book-reader text-green-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="courseProgress">--%</span>
                    <span class="text-sm text-gray-500 mb-1" id="courseDayCount">(0/0일)</span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">상담 요망</h3>
                    <i class="fas fa-exclamation-circle text-yellow-500 text-xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="counselingRequiredCount">0</div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">평균 성적</h3>
                    <i class="fas fa-star text-purple-500 text-xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="averageScore">--</div>
            </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- 왼쪽: 출결 현황 차트 -->
            <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">주간 출결 현황</h3>
                <canvas id="attendanceChart" height="200"></canvas>
            </div>

            <!-- 오른쪽: 오늘의 일정 및 할일 -->
            <div class="space-y-6">
                <!-- 오늘의 훈련 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">오늘의 훈련</h3>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="text-xs text-gray-500 mb-1">1교시 (09:00~09:50)</div>
                            <div class="font-medium">HTML5 구조의 이해</div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="text-xs text-gray-500 mb-1">2교시 (10:00~10:50)</div>
                            <div class="font-medium">시맨틱 태그 활용</div>
                        </div>
                        <div class="text-center">
                            <button class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                                + 훈련일지 작성하기
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 공지사항 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">과정 공지사항</h3>
                        <button class="text-xs text-gray-500 hover:text-gray-700">더보기</button>
                    </div>
                    <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex justify-between">
                            <span class="truncate pr-2">다음 주 휴강 안내</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.28</span>
                        </li>
                        <li class="flex justify-between">
                            <span class="truncate pr-2">프로젝트 조 편성 결과</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.25</span>
                        </li>
                        <li class="flex justify-between">
                            <span class="truncate pr-2">교재 배부 안내</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.20</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];

        document.addEventListener('DOMContentLoaded', () => {
            loadCourseInfo();
            loadDashboardStats();
            initChart();
            
            // 링크 href 업데이트
            const links = document.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (['attendance', 'cbt', 'grades', 'counseling'].includes(href)) {
                    link.setAttribute('href', \`/admin/courses/\${courseId}/lms/\${href}\`);
                }
            });
        });

        async function loadCourseInfo() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/courses/\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const course = result.data;
                    document.getElementById('courseTitle').textContent = course.title;
                    document.getElementById('courseCategory').textContent = course.category;
                    document.getElementById('courseStatus').textContent = course.status === 'open' ? '진행중' : '마감';
                    document.getElementById('coursePeriod').innerHTML = \`<i class="far fa-calendar-alt mr-1"></i> \${course.start_date.split('T')[0]} ~ \${course.end_date.split('T')[0]}\`;
                    document.getElementById('courseSchedule').innerHTML = \`<i class="far fa-clock mr-1"></i> \${course.schedule || '시간표 미정'}\`;
                    document.getElementById('studentCount').textContent = course.max_students || 0; // 실제 수강생 수로 교체 필요
                }
            } catch (error) {
                console.error('Error loading course info:', error);
            }
        }

        async function loadDashboardStats() {
            // TODO: 실제 API 연동
            // 임시 데이터
            document.getElementById('todayAttendanceRate').textContent = '92%';
            document.getElementById('todayAttendanceCount').textContent = '(23/25명)';
            document.getElementById('courseProgress').textContent = '45%';
            document.getElementById('courseDayCount').textContent = '(45/100일)';
            document.getElementById('counselingRequiredCount').textContent = '2';
            document.getElementById('averageScore').textContent = '85.4';
        }

        function initChart() {
            const ctx = document.getElementById('attendanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['월', '화', '수', '목', '금'],
                    datasets: [{
                        label: '출석률 (%)',
                        data: [95, 88, 92, 96, 90],
                        backgroundColor: 'rgba(124, 58, 237, 0.6)',
                        borderColor: 'rgba(124, 58, 237, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    </script>
</body>
</html>
`;
