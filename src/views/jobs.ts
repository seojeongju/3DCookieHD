export const jobsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채용정보 - 와우쓰리디홍대센터</title>
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
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- 로고 -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="flex flex-col items-start group">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">와우쓰리디홍대센터</span>
                    </a>
                </div>

                <!-- 메인 메뉴 (중앙) -->
                <div class="hidden lg:flex space-x-1 items-center">
                    <!-- 과정안내 -->
                    <div class="relative group">
                        <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                            과정안내
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/courses" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">전체 과정 보기</a>
                                <a href="/courses?category=gukbi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원과정</a>
                                <a href="/courses?category=general" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">일반과정</a>
                                <a href="/courses?category=student" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">학생/진학 과정</a>
                            </div>
                        </div>
                    </div>

                    <!-- 센터소개 -->
                    <div class="relative group">
                        <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                            센터소개
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/greeting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">인사말</a>
                                <a href="/education-photos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육사진</a>
                                <a href="/facilities" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">시설안내</a>
                                <a href="/locations" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">오시는길</a>
                            </div>
                        </div>
                    </div>

                    <a href="/reviews" class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">수강후기</a>
                    <a href="#board" class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">게시판</a>
                    <!-- 채용정보 (드롭다운) -->
                    <div class="relative group">
                        <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                            채용정보
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/jobs" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">구인정보 (채용공고)</a>
                                <a href="/jobseekers" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">구직정보 (인재풀)</a>
                            </div>
                        </div>
                    </div>

                    <!-- 상담센터 -->
                    <div class="relative group">
                        <button class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center transition-colors">
                            상담센터
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/online-consulting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">온라인상담신청</a>
                                <a href="/corporate-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">기업단체교육</a>
                                <a href="/university-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">대학맞춤교육</a>
                            </div>
                        </div>
                    </div>

                    <!-- 학사관리 (보라색 버튼) -->
                    <div class="relative group ml-2">
                        <button class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded flex items-center transition-colors shadow-sm">
                            <i class="fas fa-graduation-cap mr-1.5 text-xs"></i>
                            학사관리
                            <i class="fas fa-chevron-down ml-1.5 text-[10px] text-purple-200"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">학생학사관리</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">강사학사관리</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 우측 메뉴 (로그인/회원가입) -->
                <div class="flex items-center space-x-2" id="authMenu">
                    <a href="/login" class="px-3 py-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition-colors">로그인</a>
                    <a href="/register" class="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded transition-colors shadow-sm">회원가입</a>
                </div>
            </div>
        </div>
    </nav>

    <script>
        // 로그인 상태 확인 및 메뉴 업데이트
        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const authMenu = document.getElementById('authMenu');
            
            if (token && userStr && authMenu) {
                const user = JSON.parse(userStr);
                let menuHtml = '';
                
                if (user.role === 'admin') {
                    menuHtml += \`
                        <a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold whitespace-nowrap mr-4">
                            <i class="fas fa-cog mr-1"></i> 관리자
                        </a>
                    \`;
                }
                
                menuHtml += \`
                    <span class="text-gray-700 mr-2">
                        <span class="font-bold">\${user.name}</span>님
                    </span>
                    <button onclick="logout()" class="text-gray-500 hover:text-red-600 font-medium whitespace-nowrap">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                \`;
                
                authMenu.innerHTML = menuHtml;
            }
        });

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/';
        }
    </script>

    <!-- 헤더 -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">채용정보</h1>
            <p class="text-xl text-blue-100">와우쓰리디홍대센터 수료생을 위한 엄선된 채용 정보를 확인하세요.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 검색 필터 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                        <input type="text" id="searchInput" placeholder="채용공고 검색 (제목, 회사명)" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>
                <button onclick="loadJobs()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    검색하기
                </button>
            </div>
        </div>

        <!-- 채용공고 목록 -->
        <div id="jobsList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 로딩 중 표시 -->
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p class="text-gray-500">채용 정보를 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center">
            <!-- 페이지네이션 버튼이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 채용공고 상세 모달 -->
    <div id="jobDetailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-1" id="modalJobTitle"></h2>
                    <p class="text-lg text-blue-600 font-medium" id="modalJobCompany"></p>
                </div>
                <button onclick="closeModal('jobDetailModal')" class="text-gray-400 hover:text-gray-600 p-2">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-6">
                <!-- 기본 정보 -->
                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">고용 형태</p>
                        <p class="font-medium text-gray-800" id="modalJobType"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">급여</p>
                        <p class="font-medium text-gray-800" id="modalJobSalary"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">근무지</p>
                        <p class="font-medium text-gray-800" id="modalJobLocation"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">등록일</p>
                        <p class="font-medium text-gray-800" id="modalJobDate"></p>
                    </div>
                </div>

                <!-- 자격 요건 -->
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">자격 요건</h3>
                    <div class="text-gray-600 leading-relaxed whitespace-pre-wrap bg-white border border-gray-100 p-4 rounded-lg" id="modalJobRequirements"></div>
                </div>

                <!-- 상세 내용 -->
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">상세 모집 내용</h3>
                    <div class="text-gray-600 leading-relaxed whitespace-pre-wrap bg-white border border-gray-100 p-4 rounded-lg" id="modalJobDescription"></div>
                </div>
            </div>
            <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onclick="closeModal('jobDetailModal')" class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                    닫기
                </button>
                <!-- 지원하기 버튼은 추후 구현 -->
                <!-- <button class="ml-3 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    지원하기
                </button> -->
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    <footer class="bg-gray-800 text-white py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-gray-400">&copy; 2025 와우쓰리디홍대센터. All rights reserved.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', loadJobs);

        async function loadJobs() {
            const searchInput = document.getElementById('searchInput');
            // const search = searchInput ? searchInput.value : ''; // 검색 기능은 API 지원 시 추가
            
            try {
                // 모집중인 공고만 조회
                const response = await fetch('/api/jobs?status=active');
                const result = await response.json();
                
                const jobsList = document.getElementById('jobsList');
                
                if (!result.success) {
                    jobsList.innerHTML = \`
                        <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <p class="text-gray-600">데이터를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                    return;
                }

                if (result.data.length === 0) {
                    jobsList.innerHTML = \`
                        <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">현재 진행 중인 채용 공고가 없습니다.</p>
                            <p class="text-gray-500 mt-2">새로운 공고가 등록되면 확인해 주세요.</p>
                        </div>
                    \`;
                    return;
                }

                jobsList.innerHTML = result.data.map(job => \`
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
                        <div class="p-6 flex-1">
                            <div class="flex justify-between items-start mb-4">
                                <span class="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                    \${job.job_type || '정규직'}
                                </span>
                                <span class="text-xs text-gray-400">
                                    \${new Date(job.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition cursor-pointer" onclick='openJobDetail(\${JSON.stringify(job).replace(/'/g, "&#39;")})'>
                                \${job.title}
                            </h3>
                            <p class="text-blue-600 font-medium mb-4 flex items-center">
                                <i class="fas fa-building mr-2 text-sm opacity-70"></i>
                                \${job.company}
                            </p>
                            <div class="space-y-2 text-sm text-gray-500 mb-6">
                                <p class="flex items-center">
                                    <i class="fas fa-map-marker-alt w-5 text-center mr-2 text-gray-400"></i>
                                    \${job.location || '지역 무관'}
                                </p>
                                <p class="flex items-center">
                                    <i class="fas fa-won-sign w-5 text-center mr-2 text-gray-400"></i>
                                    \${job.salary || '회사 내규에 따름'}
                                </p>
                            </div>
                        </div>
                        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                            <button onclick='openJobDetail(\${JSON.stringify(job).replace(/'/g, "&#39;")})' class="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition flex items-center justify-center">
                                상세 정보 보기
                            </button>
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('jobsList').innerHTML = \`
                    <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                    </div>
                \`;
            }
        }

        function openJobDetail(job) {
            document.getElementById('modalJobTitle').textContent = job.title;
            document.getElementById('modalJobCompany').textContent = job.company;
            document.getElementById('modalJobType').textContent = job.job_type || '-';
            document.getElementById('modalJobSalary').textContent = job.salary || '-';
            document.getElementById('modalJobLocation').textContent = job.location || '-';
            document.getElementById('modalJobDate').textContent = new Date(job.created_at).toLocaleDateString();
            document.getElementById('modalJobRequirements').textContent = job.requirements || '내용 없음';
            document.getElementById('modalJobDescription').textContent = job.description || '내용 없음';
            
            document.getElementById('jobDetailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
            document.body.style.overflow = ''; // 배경 스크롤 복원
        }

        // 모달 바깥 클릭 시 닫기
        document.getElementById('jobDetailModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('jobDetailModal');
            }
        });
    </script>
</body>
</html>
`;
