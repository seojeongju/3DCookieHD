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
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- 담당 과정 카드 -->
                    <div onclick="location.href='/teacher/courses'" class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-gray-700 text-sm font-semibold group-hover:text-blue-700 transition-colors">담당 과정</h3>
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-chalkboard text-lg"></i>
                                </div>
                            </div>
                            <div class="flex items-baseline mb-2">
                                <span id="myCourses" class="text-3xl font-bold text-gray-800">-</span>
                                <span class="ml-2 text-sm text-gray-600">개</span>
                            </div>
                            <p class="text-xs text-gray-500">진행 중인 과정</p>
                        </div>
                    </div>
                    
                    <!-- 총 수강생 카드 -->
                    <div onclick="location.href='/teacher/students'" class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-green-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-gray-700 text-sm font-semibold group-hover:text-green-700 transition-colors">총 수강생</h3>
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-users text-lg"></i>
                                </div>
                            </div>
                            <div class="flex items-baseline mb-2">
                                <span id="totalStudents" class="text-3xl font-bold text-gray-800">-</span>
                                <span class="ml-2 text-sm text-gray-600">명</span>
                            </div>
                            <p class="text-xs text-gray-500">승인된 수강생</p>
                        </div>
                    </div>

                    <!-- 채점 대기 카드 -->
                    <div onclick="location.href='/teacher/exams'" class="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-lg p-6 border border-orange-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-gray-700 text-sm font-semibold group-hover:text-orange-700 transition-colors">채점 대기</h3>
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-clipboard-check text-lg"></i>
                                </div>
                            </div>
                            <div class="flex items-baseline mb-2">
                                <span id="pendingGrading" class="text-3xl font-bold text-gray-800">-</span>
                                <span class="ml-2 text-sm text-orange-600 font-medium">건</span>
                            </div>
                            <p class="text-xs text-gray-500">대기 중인 채점</p>
                        </div>
                    </div>

                    <!-- 평균 출석률 카드 -->
                    <div onclick="location.href='/teacher/attendance'" class="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-purple-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-gray-700 text-sm font-semibold group-hover:text-purple-700 transition-colors">평균 출석률</h3>
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-calendar-check text-lg"></i>
                                </div>
                            </div>
                            <div class="flex items-baseline mb-2">
                                <span id="avgAttendance" class="text-3xl font-bold text-gray-800">-</span>
                                <span class="ml-2 text-sm text-gray-600">%</span>
                            </div>
                            <p class="text-xs text-gray-500">전체 과정 평균</p>
                        </div>
                    </div>
                </div>

                <!-- 빠른 작업 섹션 -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-bolt text-yellow-500 mr-2 text-lg"></i> 빠른 작업
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button onclick="location.href='/teacher/attendance'" class="group bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:border-green-300 hover:scale-105 transition-all duration-300 text-left">
                            <div class="flex items-center mb-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-check-circle text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="font-bold text-gray-800 group-hover:text-green-600 transition-colors">출석 체크</h3>
                                    <p class="text-xs text-gray-500">수강생 출석 관리</p>
                                </div>
                            </div>
                        </button>
                        
                        <button onclick="location.href='/teacher/exams'" class="group bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:border-indigo-300 hover:scale-105 transition-all duration-300 text-left">
                            <div class="flex items-center mb-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-file-signature text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">시험 관리</h3>
                                    <p class="text-xs text-gray-500">시험 출제 및 채점</p>
                                </div>
                            </div>
                        </button>

                        <button onclick="location.href='/teacher/courses'" class="group bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:border-blue-300 hover:scale-105 transition-all duration-300 text-left">
                            <div class="flex items-center mb-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-book text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">강의 관리</h3>
                                    <p class="text-xs text-gray-500">과정 및 자료 관리</p>
                                </div>
                            </div>
                        </button>

                        <button onclick="location.href='/teacher/surveys'" class="group bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:border-pink-300 hover:scale-105 transition-all duration-300 text-left">
                            <div class="flex items-center mb-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-poll text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">설문 관리</h3>
                                    <p class="text-xs text-gray-500">설문 및 역량평가</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- 담당 과정 목록 -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-800 flex items-center">
                            <i class="fas fa-chalkboard-teacher text-blue-500 mr-2 text-lg"></i> 담당 과정
                        </h2>
                        <a href="/teacher/courses" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                            전체 보기 <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                    <div id="recentCoursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="text-center py-12 col-span-3">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="text-gray-500 mt-2">과정 정보를 불러오는 중...</p>
                        </div>
                    </div>
                </div>

                <!-- 채점 대기 목록 -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div class="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800 flex items-center text-lg">
                            <i class="fas fa-clipboard-check text-indigo-600 mr-2"></i> 채점 대기 목록
                        </h3>
                        <a href="/teacher/exams" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                            전체 보기 <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                    <div id="pendingGradingListContainer">
                        <div class="px-6 py-12 text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                            <p class="text-gray-500 mt-2">채점 대기 목록을 불러오는 중...</p>
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
                
                // 강사 통계 API 호출
                const response = await fetch('/api/dashboard/teacher-stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.status === 401) {
                    alert('로그인 세션이 만료되었습니다.');
                    location.href = '/login';
                    return;
                }

                const result = await response.json();
                
                if (result.success && result.data) {
                    const data = result.data;
                    updateStats(data);
                    // 데이터가 있으면 표시, 없으면 빈 상태 메시지 표시
                    renderRecentCourses(data.recentCourses || []);
                    renderPendingGrading(data.pendingGradingList || []);
                } else {
                    console.error('Failed to load dashboard data:', result.error);
                    // 로딩 중지하고 에러 메시지 표시
                    stopLoadingAndShowError('대시보드 데이터를 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                // 로딩 중지하고 에러 메시지 표시
                stopLoadingAndShowError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        }

        function updateStats(data) {
            // 담당 과정 수
            document.getElementById('myCourses').textContent = data.myCourses || 0;
            
            // 총 수강생 수
            document.getElementById('totalStudents').textContent = data.totalStudents || 0;
            
            // 채점 대기 건수
            document.getElementById('pendingGrading').textContent = data.pendingGrading || 0;
            
            // 평균 출석률
            document.getElementById('avgAttendance').textContent = data.avgAttendance || 0;
        }

        function renderRecentCourses(courses) {
            const container = document.getElementById('recentCoursesContainer');
            
            // 로딩 상태 제거
            if (!courses || courses.length === 0) {
                container.innerHTML = 
                    '<div class="col-span-3 text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">' +
                        '<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">' +
                            '<i class="fas fa-chalkboard text-2xl text-gray-400"></i>' +
                        '</div>' +
                        '<p class="text-gray-600 font-medium mb-2">담당하는 과정이 없습니다</p>' +
                        '<p class="text-sm text-gray-500">관리자에게 과정 배정을 요청하세요.</p>' +
                    '</div>';
                return;
            }

            container.innerHTML = courses.map(course => {
                const enrolledCount = course.enrolled_count || 0;
                const maxStudents = course.max_students || 0;
                const progressPercent = maxStudents > 0 ? Math.round((enrolledCount / maxStudents) * 100) : 0;
                
                return '<div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer" onclick="location.href=\'/teacher/courses\'">' +
                    '<div class="flex justify-between items-start mb-4">' +
                        '<span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-sm">' + (course.category || '일반') + '</span>' +
                        '<div class="flex items-center text-xs text-gray-500">' +
                            '<i class="fas fa-users mr-1"></i>' +
                            '<span>' + enrolledCount + '/' + maxStudents + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<h3 class="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg">' + (course.title || '과정명 없음') + '</h3>' +
                    '<div class="mb-4">' +
                        '<div class="flex justify-between items-center mb-2">' +
                            '<span class="text-xs text-gray-600 font-medium">수강 진행률</span>' +
                            '<span class="text-xs font-bold text-blue-600">' + progressPercent + '%</span>' +
                        '</div>' +
                        '<div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">' +
                            '<div class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style="width: ' + progressPercent + '%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex justify-between items-center pt-4 border-t border-gray-100">' +
                        '<div class="flex items-center text-sm text-gray-600">' +
                            '<i class="fas fa-user-graduate mr-2 text-blue-500"></i>' +
                            '<span class="font-medium">' + enrolledCount + '명 수강중</span>' +
                        '</div>' +
                        '<span class="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">' +
                            '관리하기 <i class="fas fa-arrow-right ml-1"></i>' +
                        '</span>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function renderPendingGrading(gradingList) {
            const container = document.getElementById('pendingGradingListContainer');
            
            // 로딩 상태 제거
            if (!gradingList || gradingList.length === 0) {
                container.innerHTML = 
                    '<div class="px-6 py-12 text-center">' +
                        '<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">' +
                            '<i class="fas fa-check-circle text-2xl text-gray-400"></i>' +
                        '</div>' +
                        '<p class="text-gray-600 font-medium mb-1">채점 대기 항목이 없습니다</p>' +
                        '<p class="text-sm text-gray-500">모든 시험이 채점 완료되었습니다.</p>' +
                    '</div>';
                return;
            }

            container.innerHTML = gradingList.map(item => {
                const submittedDate = item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '날짜 없음';
                const studentName = item.student_name || '학생';
                const studentInitial = studentName[0] || '?';
                const examTitle = item.exam_title || '시험 제목 없음';
                
                return '<div class="px-6 py-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer group" onclick="location.href=\'/teacher/exams\'">' +
                    '<div class="flex items-center justify-between">' +
                        '<div class="flex-1">' +
                            '<div class="flex items-center mb-2">' +
                                '<div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md mr-3">' +
                                    studentInitial +
                                '</div>' +
                                '<div>' +
                                    '<h4 class="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">' + studentName + '</h4>' +
                                    '<p class="text-sm text-gray-600">' + examTitle + '</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="text-right">' +
                            '<div class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-2">대기중</div>' +
                            '<p class="text-xs text-gray-500">' + submittedDate + '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function stopLoadingAndShowError(message) {
            // 담당 과정 섹션 로딩 중지 및 에러 표시
            const coursesContainer = document.getElementById('recentCoursesContainer');
            if (coursesContainer) {
                coursesContainer.innerHTML = 
                    '<div class="col-span-3 text-center py-16 bg-red-50 rounded-2xl border-2 border-red-200">' +
                        '<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">' +
                            '<i class="fas fa-exclamation-circle text-2xl text-red-500"></i>' +
                        '</div>' +
                        '<p class="text-red-600 font-medium mb-2">데이터를 불러올 수 없습니다</p>' +
                        '<p class="text-sm text-red-500">' + message + '</p>' +
                        '<button onclick="loadDashboardData()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">다시 시도</button>' +
                    '</div>';
            }
            
            // 채점 대기 목록 섹션 로딩 중지 및 에러 표시
            const gradingContainer = document.getElementById('pendingGradingListContainer');
            if (gradingContainer) {
                gradingContainer.innerHTML = 
                    '<div class="px-6 py-12 text-center">' +
                        '<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">' +
                            '<i class="fas fa-exclamation-circle text-2xl text-red-500"></i>' +
                        '</div>' +
                        '<p class="text-red-600 font-medium mb-1">데이터를 불러올 수 없습니다</p>' +
                        '<p class="text-sm text-red-500">' + message + '</p>' +
                    '</div>';
            }
        }

        function showError(message) {
            stopLoadingAndShowError(message);
        }
    </script>
</body>
</html>
`;
