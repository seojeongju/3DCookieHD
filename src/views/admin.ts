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
                            <span class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">ADMIN</span>
                        </div>
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">와우쓰리디홍대센터</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-home mr-2"></i>홈으로
                    </a>
                    <button onclick="logout()" class="text-gray-700 hover:text-red-600 font-medium">
                        <i class="fas fa-sign-out-alt mr-2"></i>로그아웃
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-bold mb-4 flex items-center">
                <i class="fas fa-cogs mr-4"></i>
                관리자 대시보드
            </h1>
            <p class="text-xl text-gray-300">사이트 통합 관리 시스템</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 메뉴 그리드 -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <!-- 채용공고 관리 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/jobs'">
                <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition">
                    <i class="fas fa-briefcase text-3xl text-blue-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">채용공고 관리</h3>
                <p class="text-gray-600 mb-4">채용 공고를 등록하고 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <!-- 인재풀 관리 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/jobseekers'">
                <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition">
                    <i class="fas fa-user-tie text-3xl text-green-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">인재풀 관리</h3>
                <p class="text-gray-600 mb-4">구직자 정보를 등록하고 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <!-- 과정 관리 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/courses'">
                <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition">
                    <i class="fas fa-book text-3xl text-purple-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">교육과정 관리</h3>
                <p class="text-gray-600 mb-4">교육 과정을 개설하고 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <!-- 수강생 관리 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/students'">
                <div class="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4 group-hover:bg-yellow-200 transition">
                    <i class="fas fa-users text-3xl text-yellow-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">수강생 관리</h3>
                <p class="text-gray-600 mb-4">전체 수강생 현황을 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <!-- 게시판 관리 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/posts'">
                <div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 group-hover:bg-red-200 transition">
                    <i class="fas fa-comments text-3xl text-red-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">게시판 관리</h3>
                <p class="text-gray-600 mb-4">공지사항 및 게시글을 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <!-- 사이트 설정 -->
            <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer group" onclick="location.href='/admin/settings'">
                <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-gray-200 transition">
                    <i class="fas fa-cog text-3xl text-gray-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">사이트 설정</h3>
                <p class="text-gray-600 mb-4">사이트 기본 설정을 관리합니다.</p>
                <button class="text-primary-600 font-semibold hover:text-primary-700">
                    관리하기 <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>

        <!-- 빠른 작업 -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-bolt text-yellow-500 mr-3"></i>
                빠른 작업
            </h2>
            <div class="flex flex-wrap gap-4">
                <button onclick="openModal('createJobModal')" class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-plus mr-2"></i> 채용공고 등록
                </button>
                <button onclick="openModal('createJobseekerModal')" class="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <i class="fas fa-plus mr-2"></i> 인재풀 등록
                </button>
                <button onclick="location.href='/admin/courses/create'" class="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <i class="fas fa-plus mr-2"></i> 과정 개설
                </button>
                <button onclick="location.href='/admin/posts/create?category=notice'" class="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    <i class="fas fa-pen mr-2"></i> 공지사항 작성
                </button>
            </div>
        </div>
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
            location.href = '/login';
        }

        function openModal(id) {
            document.getElementById(id).classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
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
