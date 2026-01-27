import { teacherSidebar } from './components/teacher_sidebar';

export const teacherDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강사 대시보드 - 와우쓰리디홍대센터</title>
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
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('dashboard')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">대시보드</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                        <a href="/" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-external-link-alt mr-1"></i> 사이트 바로가기
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 통계 카드 섹션 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">담당 과정</h3>
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <i class="fas fa-chalkboard"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="myCourses" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-gray-500">개 과정 진행 중</span>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">총 수강생</h3>
                            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="totalStudents" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-gray-500">명</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">과제/시험 채점</h3>
                            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                <i class="fas fa-pen-fancy"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="pendingGrading" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-red-500">건 대기 중</span>
                        </div>
                    </div>
                </div>

                <!-- 빠른 작업 섹션 -->
                <div class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-bolt text-yellow-500 mr-2"></i> 빠른 작업
                    </h2>
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex flex-wrap gap-4">
                            <button onclick="location.href='/teacher/attendance'" class="flex items-center px-5 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-100">
                                <div class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 text-green-700">
                                    <i class="fas fa-check-circle text-sm"></i>
                                </div>
                                <span class="font-medium">출석 체크</span>
                            </button>
                            
                            <button onclick="location.href='/teacher/exams'" class="flex items-center px-5 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition border border-indigo-100">
                                <div class="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center mr-3 text-indigo-700">
                                    <i class="fas fa-file-signature text-sm"></i>
                                </div>
                                <span class="font-medium">시험 관리</span>
                            </button>

                            <button onclick="location.href='/teacher/courses'" class="flex items-center px-5 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-100">
                                <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-3 text-blue-700">
                                    <i class="fas fa-book text-sm"></i>
                                </div>
                                <span class="font-medium">강의 자료 업로드</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 담당 과정 목록 -->
                <div class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chalkboard-teacher text-blue-500 mr-2"></i> 담당 과정
                    </h2>
                    <div id="recentCoursesContainer" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center py-8 col-span-3">
                            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                        </div>
                    </div>
                </div>

                <!-- 채점 대기 목록 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800 flex items-center">
                            <i class="fas fa-clipboard-check text-indigo-500 mr-2"></i> 채점 대기 목록
                        </h3>
                        <a href="/teacher/exams" class="text-sm text-blue-600 hover:text-blue-800 font-medium">전체 보기 →</a>
                    </div>
                    <div id="pendingGradingListContainer">
                        <div class="px-6 py-8 text-center">
                            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadDashboardData();
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // Admins are also allowed to view the Teacher Dashboard
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
        }

        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                
                // 1. 담당 과정 목록 조회 (API가 토큰 기반으로 필터링)
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const courses = result.data;
                    updateStats(courses);
                    renderRecentCourses(courses);
                } else {
                    console.error('Failed to load courses:', result.error);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        function updateStats(courses) {
            // 담당 과정 수
            document.getElementById('myCourses').textContent = courses.length;
            
            // 총 수강생 수 (각 과정의 current_students 합계)
            const totalStudents = courses.reduce((sum, course) => sum + (course.current_students || 0), 0);
            document.getElementById('totalStudents').textContent = totalStudents;
            
            // 채점 대기 (임시: 0으로 표시하거나 추후 API 연동)
            document.getElementById('pendingGrading').textContent = '0'; 
        }

        function renderRecentCourses(courses) {
            const container = document.getElementById('recentCoursesContainer');
            
            if (courses.length === 0) {
                container.innerHTML = 
                    '<div class="col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">' +
                        '<p class="text-gray-500 mb-2">담당하는 과정이 없습니다.</p>' +
                        '<p class="text-sm text-gray-400">관리자에게 과정 배정을 요청하세요.</p>' +
                    '</div>';
                return;
            }

            container.innerHTML = courses.slice(0, 6).map(course => 
                '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group">' +
                    '<div class="flex justify-between items-start mb-3">' +
                        '<span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">' + course.category + '</span>' +
                        '<span class="text-xs text-gray-400 font-mono">' + (course.start_date || '일정 미정') + '</span>' +
                    '</div>' +
                    '<h3 class="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition">' + course.title + '</h3>' +
                    '<div class="flex justify-between items-end">' +
                        '<div class="text-sm text-gray-500">' +
                            '<i class="fas fa-user-graduate mr-1"></i> ' + course.current_students + '명 수강중' +
                        '</div>' +
                        '<a href="/teacher/courses" class="text-sm text-blue-600 font-medium hover:underline">관리하기</a>' +
                    '</div>' +
                '</div>'
            ).join('');
        }
    </script>
</body>
</html>
`;
