export const adminDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관리자 대시보드 - 와우쓰리디홍대센터</title>
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
        <aside class="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
            <!-- 로고 영역 -->
            <div class="h-16 flex items-center px-6 border-b border-gray-200">
                <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto mr-2">
                <span class="font-bold text-gray-800 tracking-tight">관리자 시스템</span>
            </div>

            <!-- 메뉴 영역 -->
            <div class="flex-1 overflow-y-auto py-4">
                <nav class="px-4 space-y-6">
                    <!-- 대시보드 -->
                    <div>
                        <a href="/admin" class="sidebar-menu-item active flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <i class="fas fa-home w-5 h-5 mr-3 text-gray-400"></i>
                            대시보드
                        </a>
                    </div>

                    <!-- 학사 관리 (LMS) -->
                    <div>
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">학사 관리</h3>
                        <ul class="space-y-1">
                            <li>
                                <a href="/admin/courses" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-book w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    교육과정 관리
                                </a>
                            </li>
                            <li>
                                <a href="/admin/students" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-users w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    수강생 관리
                                </a>
                            </li>
                            <li>
                                <a href="/admin/exams" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-file-alt w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    시험/문제 관리
                                </a>
                            </li>
                            <li>
                                <a href="/admin/grades" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-chart-line w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    성적/채점 관리
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- 운영 관리 (관리자 전용) -->
                    <div id="group-operation">
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">운영 관리</h3>
                        <ul class="space-y-1">
                            <li id="menu-jobs">
                                <a href="/admin/jobs" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-briefcase w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    채용공고 관리
                                </a>
                            </li>
                            <li id="menu-jobseekers">
                                <a href="/admin/jobseekers" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-user-tie w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    인재풀 관리
                                </a>
                            </li>
                            <li id="menu-posts">
                                <a href="/admin/posts" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-comments w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    게시판 관리
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- 시스템 (관리자 전용) -->
                    <div id="group-system">
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">시스템</h3>
                        <ul class="space-y-1">
                            <li id="menu-settings">
                                <a href="/admin/settings" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-cog w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"></i>
                                    사이트 설정
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <!-- 하단 프로필 영역 -->
            <div class="p-4 border-t border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700" id="user-name">관리자</p>
                        <p class="text-xs text-gray-500 cursor-pointer hover:text-red-600" onclick="logout()">로그아웃</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">대시보드</h1>
                    <div class="flex items-center space-x-4">
                        <span id="user-badge" class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">ADMIN</span>
                        <a href="/" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-external-link-alt mr-1"></i> 사이트 바로가기
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 통계 카드 섹션 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">전체 수강생</h3>
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span class="text-2xl font-bold text-gray-800">1,234</span>
                            <span class="ml-2 text-sm text-green-500"><i class="fas fa-arrow-up"></i> 12%</span>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">진행 중인 과정</h3>
                            <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <i class="fas fa-book-open"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span class="text-2xl font-bold text-gray-800">8</span>
                            <span class="ml-2 text-sm text-gray-500">개설 강좌</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">신규 문의</h3>
                            <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span class="text-2xl font-bold text-gray-800">15</span>
                            <span class="ml-2 text-sm text-red-500">미답변</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-gray-500 text-sm font-medium">평균 출석률</h3>
                            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="flex items-baseline">
                            <span class="text-2xl font-bold text-gray-800">92%</span>
                            <span class="ml-2 text-sm text-green-500"><i class="fas fa-arrow-up"></i> 3%</span>
                        </div>
                    </div>
                </div>

                <!-- 빠른 작업 섹션 (상단 배치) -->
                <div class="mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-bolt text-yellow-500 mr-2"></i> 빠른 작업
                    </h2>
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex flex-wrap gap-4">
                            <button id="btn-create-course" onclick="location.href='/admin/courses/create'" class="flex items-center px-5 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition border border-purple-100">
                                <div class="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-3 text-purple-700">
                                    <i class="fas fa-plus text-sm"></i>
                                </div>
                                <span class="font-medium">과정 개설</span>
                            </button>
                            
                            <button id="btn-create-exam" onclick="location.href='/admin/exams/create'" class="flex items-center px-5 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition border border-indigo-100">
                                <div class="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center mr-3 text-indigo-700">
                                    <i class="fas fa-file-signature text-sm"></i>
                                </div>
                                <span class="font-medium">문제 등록</span>
                            </button>

                            <button id="btn-create-job" onclick="openModal('createJobModal')" class="flex items-center px-5 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-100">
                                <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-3 text-blue-700">
                                    <i class="fas fa-briefcase text-sm"></i>
                                </div>
                                <span class="font-medium">채용공고 등록</span>
                            </button>

                            <button id="btn-create-jobseeker" onclick="openModal('createJobseekerModal')" class="flex items-center px-5 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-100">
                                <div class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 text-green-700">
                                    <i class="fas fa-user-plus text-sm"></i>
                                </div>
                                <span class="font-medium">인재풀 등록</span>
                            </button>

                            <button id="btn-create-post" onclick="location.href='/admin/posts/create?category=notice'" class="flex items-center px-5 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition border border-red-100">
                                <div class="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center mr-3 text-red-700">
                                    <i class="fas fa-bullhorn text-sm"></i>
                                </div>
                                <span class="font-medium">공지사항 작성</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 최근 활동 로그 등 (예시) -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800">최근 활동 내역</h3>
                        <button class="text-sm text-gray-500 hover:text-primary-600">더보기</button>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                                <i class="fas fa-user-plus"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-800">신규 수강생 등록</p>
                                <p class="text-xs text-gray-500">홍길동님이 '3D 모델링 기초' 과정에 등록했습니다.</p>
                            </div>
                            <span class="ml-auto text-xs text-gray-400">10분 전</span>
                        </div>
                        <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                                <i class="fas fa-check"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-800">과제 제출 완료</p>
                                <p class="text-xs text-gray-500">김철수님이 '중간 평가 과제'를 제출했습니다.</p>
                            </div>
                            <span class="ml-auto text-xs text-gray-400">1시간 전</span>
                        </div>
                        <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition">
                            <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-800">시스템 알림</p>
                                <p class="text-xs text-gray-500">서버 점검이 예정되어 있습니다. (12/01 02:00~04:00)</p>
                            </div>
                            <span class="ml-auto text-xs text-gray-400">어제</span>
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

    <!-- 인재풀 등록 모달 -->
    <div id="createJobseekerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">인재풀 등록</h3>
                <button onclick="closeModal('createJobseekerModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createJobseekerForm" onsubmit="handleCreateJobseeker(event)">
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">이름</label>
                                <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">생년월일</label>
                                <input type="date" name="birth_date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">연락처</label>
                                <input type="text" name="phone" required placeholder="010-0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">이메일</label>
                                <input type="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">주소</label>
                            <input type="text" name="address" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">학력</label>
                            <input type="text" name="education" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">경력 사항</label>
                            <textarea name="career" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">보유 기술</label>
                            <textarea name="skills" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">관리자 메모</label>
                            <textarea name="memo" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createJobseekerModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">등록하기</button>
                    </div>
                </form>
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

        // 권한별 메뉴 제어
        document.addEventListener('DOMContentLoaded', () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    
                    // 사용자 이름 표시
                    const userNameEl = document.getElementById('user-name');
                    if (userNameEl && user.name) {
                        userNameEl.textContent = user.name + (user.role === 'teacher' ? ' 강사님' : ' 관리자님');
                    }

                    // 강사(teacher)인 경우 불필요한 메뉴 숨김
                    if (user.role === 'teacher') {
                        // 사이드바 메뉴 그룹 숨김 (운영 관리, 시스템)
                        const groupsToHide = ['group-operation', 'group-system'];
                        groupsToHide.forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.style.display = 'none';
                        });

                        // 빠른 작업 버튼 숨김
                        const btnsToHide = ['btn-create-job', 'btn-create-jobseeker', 'btn-create-post'];
                        btnsToHide.forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.style.display = 'none';
                        });
                        
                        // 관리자 뱃지 텍스트 변경
                        const badge = document.getElementById('user-badge');
                        if (badge) {
                            badge.textContent = 'TEACHER';
                            badge.classList.remove('bg-red-100', 'text-red-600');
                            badge.classList.add('bg-blue-100', 'text-blue-600');
                        }
                    }
                } catch (e) {
                    console.error('User parse error', e);
                }
            }
        });

        async function handleCreateJob(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('채용공고가 등록되었습니다.');
                    closeModal('createJobModal');
                    form.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        async function handleCreateJobseeker(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobseekers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('인재풀이 등록되었습니다.');
                    closeModal('createJobseekerModal');
                    form.reset();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('등록 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
