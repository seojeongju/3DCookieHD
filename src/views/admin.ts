import { hrdSidebar } from './components/hrd_sidebar';

export const adminDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관리자 대시보드 - 와우쓰리디홍대센터</title>
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
    <style>
        .sidebar-menu-item.active {
            background-color: #eff6ff;
            color: #2563eb;
            border-right: 3px solid #2563eb;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${hrdSidebar('dashboard')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">종합 현황 대시보드</h1>
                    <div class="flex items-center space-x-4">
                        <span id="user-badge" class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">ADMIN</span>
                        <a href="/" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-external-link-alt mr-1"></i> 사이트 바로가기
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 1. 핵심 지표 카드 섹션 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- 회원 카드 -->
                    <div onclick="location.href='/admin/users'" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium group-hover:text-blue-600 transition-colors">전체 회원</h3>
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="stat-total-students" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-gray-500">명</span>
                        </div>
                    </div>
                    
                    <!-- 운영 과정 카드 -->
                    <div onclick="location.href='/admin/courses'" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all duration-200 group">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium group-hover:text-purple-600 transition-colors">운영 중인 과정</h3>
                            <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                <i class="fas fa-book-open"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="stat-active-courses" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-gray-500">개</span>
                        </div>
                    </div>

                    <!-- 매출 카드 -->
                    <div onclick="location.href='/admin/enrollments'" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200 group">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium group-hover:text-green-600 transition-colors">이번 달 매출</h3>
                            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                <i class="fas fa-won-sign"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="stat-monthly-revenue" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-gray-500">원</span>
                        </div>
                    </div>

                    <!-- 문의 카드 -->
                    <div onclick="location.href='/admin/counseling'" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md hover:border-red-200 transition-all duration-200 group">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium group-hover:text-red-600 transition-colors">신규 문의 (대기)</h3>
                            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span id="stat-new-inquiries" class="text-2xl font-bold text-gray-800">-</span>
                            <span class="ml-2 text-sm text-red-500">건</span>
                        </div>
                    </div>
                </div>

                <!-- 2. 차트 영역 -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <!-- 월별 가입자 추이 -->
                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">월별 가입자 추이</h3>
                        <div class="relative h-72">
                            <canvas id="growthChart"></canvas>
                        </div>
                    </div>
                    <!-- 인기 과정 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">인기 과정 TOP 5</h3>
                        <div class="relative h-72">
                            <canvas id="popularCoursesChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 3. 실시간 현황 영역 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- 실시간 출석 현황 (HRD 통합) -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                             <h3 class="font-bold text-gray-800">
                                <i class="fas fa-clock text-green-500 mr-2"></i>실시간 출석 현황
                            </h3>
                            <a href="/admin/attendance" class="text-sm text-gray-500 hover:text-primary-600">전체보기</a>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th class="px-6 py-3">이름</th>
                                        <th class="px-6 py-3">과정</th>
                                        <th class="px-6 py-3">시간</th>
                                        <th class="px-6 py-3">상태</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceTableBody" class="divide-y divide-gray-100">
                                    <tr><td colspan="4" class="px-6 py-4 text-center text-gray-400">데이터 로딩 중...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 승인 대기 목록 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 class="font-bold text-gray-800">
                                <i class="fas fa-check-circle text-orange-500 mr-2"></i>수강 승인 대기
                            </h3>
                            <a href="/admin/enrollments" class="text-sm text-gray-500 hover:text-primary-600">전체보기</a>
                        </div>
                        <div id="pending-approvals-list" class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                            <!-- JS로 주입됨 -->
                            <div class="p-8 text-center text-gray-400">데이터를 불러오는 중...</div>
                        </div>
                    </div>
                </div>

                <!-- 4. 하단 빠른 작업 영역 -->
                <div class="mb-8">
                        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 class="font-bold text-gray-800">
                                <i class="fas fa-bolt text-yellow-500 mr-2"></i> 빠른 작업
                            </h3>
                        </div>
                        <div class="p-6">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button onclick="location.href='/admin/courses/create'" class="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition border border-purple-100">
                                    <div class="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-2 text-purple-700">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <span class="font-medium">과정 개설</span>
                                </button>
                                
                                <button onclick="location.href='/admin/students'" class="flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-100">
                                    <div class="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mb-2 text-green-700">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <span class="font-medium">훈련생 관리</span>
                                </button>

                                <button onclick="openModal('createJobModal')" class="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-100">
                                    <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mb-2 text-blue-700">
                                        <i class="fas fa-briefcase"></i>
                                    </div>
                                    <span class="font-medium">채용공고</span>
                                </button>

                                <button onclick="openModal('createPostModal')" class="flex flex-col items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition border border-red-100">
                                    <div class="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center mb-2 text-red-700">
                                        <i class="fas fa-bullhorn"></i>
                                    </div>
                                    <span class="font-medium">공지사항</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 채용공고 등록 모달 -->
    <div id="createJobModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">채용공고 등록</h3>
                <button onclick="closeModal('createJobModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createJobForm" onsubmit="handleCreateJob(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">제목</label>
                            <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">회사명</label>
                                <input type="text" name="company" value="와우쓰리디홍대센터" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">고용 형태</label>
                                <select name="job_type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="아르바이트">아르바이트</option>
                                    <option value="인턴">인턴</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">근무지</label>
                                <input type="text" name="location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">급여</label>
                                <input type="text" name="salary" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">자격 요건</label>
                            <textarea name="requirements" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">상세 내용</label>
                            <textarea name="description" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createJobModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- 공지사항 등록 모달 (간소화) -->
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                 <h3 class="text-xl font-bold text-gray-800">공지사항 작성</h3>
                 <button onclick="closeModal('createPostModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 flex flex-col items-center">
                 <p class="text-gray-600 mb-6">공지사항 관리 페이지로 이동하시겠습니까?</p>
                 <div class="flex gap-4">
                     <button onclick="closeModal('createPostModal')" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
                     <button onclick="location.href='/admin/posts/create?category=notice'" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">이동하기</button>
                 </div>
            </div>
        </div>
    </div>

    <script>
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/login';
        }

        function openModal(id) {
            document.getElementById(id).classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        document.addEventListener('DOMContentLoaded', () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    // 강사 등 role check logic preserved if needed
                    if (user.role === 'teacher') {
                        const badge = document.getElementById('user-badge');
                        if (badge) {
                            badge.textContent = 'TEACHER';
                            badge.className = 'px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full';
                        }
                    }
                } catch(e) {}
            }
            loadDashboardStats();
            loadAttendance();
        });

        async function loadAttendance() {
            try {
                // 상위 5개의 실시간 출석 현황만 가져옴
                const response = await fetch('/api/hrd/students?status=active');
                const result = await response.json();
                const tbody = document.getElementById('attendanceTableBody');
                
                if (result.success && result.data.length > 0) {
                    tbody.innerHTML = result.data.slice(0, 5).map(s => 
                        '<tr class="hover:bg-gray-50 transition-colors">' +
                            '<td class="px-6 py-4 font-medium text-gray-800">' + s.name + '</td>' +
                            '<td class="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">' + (s.course_id || '과정 미정') + '</td>' +
                            '<td class="px-6 py-4 text-gray-600">09:00</td>' + // 임시 입실시간
                            '<td class="px-6 py-4"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">출석</span></td>' +
                        '</tr>'
                    ).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-gray-500">금일 출석 데이터가 없습니다.</td></tr>';
                }
            } catch (e) {
                console.error('Failed to load attendance:', e);
                document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="4" class="px-6 py-6 text-center text-red-400">데이터 로드 실패</td></tr>';
            }
        }

        async function loadDashboardStats() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/dashboard/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    
                    // 1. Text Stats
                    document.getElementById('stat-total-students').textContent = data.totalStudents.toLocaleString();
                    document.getElementById('stat-active-courses').textContent = data.activeCourses.toLocaleString();
                    document.getElementById('stat-monthly-revenue').textContent = (data.monthlyRevenue || 0).toLocaleString();
                    document.getElementById('stat-new-inquiries').textContent = data.newInquiries.toLocaleString();

                    // 2. Charts
                    initCharts(data);

                    // 3. Pending List
                    renderPendingList(data.pendingApprovals);
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        }

        function initCharts(data) {
            // Growth Chart
            const growthCtx = document.getElementById('growthChart').getContext('2d');
            const growthLabels = data.monthlyGrowth ? data.monthlyGrowth.map(item => item.month) : [];
            const growthData = data.monthlyGrowth ? data.monthlyGrowth.map(item => item.count) : [];

            new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: growthLabels,
                    datasets: [{
                        label: '신규 회원 수',
                        data: growthData,
                        borderColor: '#2563eb', // primary-600
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            // Popular Courses Chart
            const popularCtx = document.getElementById('popularCoursesChart').getContext('2d');
            const popLabels = data.popularCourses ? data.popularCourses.map(c => c.title.substring(0, 10) + '...') : [];
            const popData = data.popularCourses ? data.popularCourses.map(c => c.student_count) : [];

            new Chart(popularCtx, {
                type: 'bar',
                data: {
                    labels: popLabels,
                    datasets: [{
                        label: '수강생 수',
                        data: popData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y', // Horizontal Bar
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }

        function renderPendingList(list) {
            const container = document.getElementById('pending-approvals-list');
            if (!list || list.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-gray-500">대기 중인 항목이 없습니다.</div>';
                return;
            }

            container.innerHTML = list.map(item => \`
                <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition">
                    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-800">\${item.user_name} - \${item.course_title}</p>
                        <p class="text-xs text-gray-500">수강 승인 요청</p>
                    </div>
                    <span class="ml-auto text-xs text-gray-400">\${new Date(item.created_at).toLocaleDateString()}</span>
                </div>
            \`).join('');
        }

        async function handleCreateJob(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('등록되었습니다.');
                    closeModal('createJobModal');
                    form.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch(e) { console.error(e); alert('오류 발생'); }
        }
    </script>
</body>
</html>
`;
