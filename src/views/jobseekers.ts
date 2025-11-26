export const jobseekersListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>인재풀 - 와우쓰리디홍대센터</title>
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
    <div class="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">인재풀 (구직정보)</h1>
            <p class="text-xl text-green-100">와우쓰리디홍대센터의 우수한 인재들을 만나보세요.</p>
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
                        <input type="text" id="searchInput" placeholder="인재 검색 (보유 기술, 경력)" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                <button onclick="loadJobseekers()" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    검색하기
                </button>
            </div>
        </div>

        <!-- 인재풀 목록 -->
        <div id="jobseekersList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 로딩 중 표시 -->
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-green-500 mb-4"></i>
                <p class="text-gray-500">인재 정보를 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center">
            <!-- 페이지네이션 버튼이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 인재 상세 모달 -->
    <div id="jobseekerDetailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-1" id="modalName"></h2>
                    <p class="text-lg text-green-600 font-medium" id="modalEducation"></p>
                </div>
                <button onclick="closeModal('jobseekerDetailModal')" class="text-gray-400 hover:text-gray-600 p-2">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-6">
                <!-- 기본 정보 -->
                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">생년월일</p>
                        <p class="font-medium text-gray-800" id="modalBirthDate"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">경력</p>
                        <p class="font-medium text-gray-800" id="modalCareerSummary"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">희망 근무지</p>
                        <p class="font-medium text-gray-800" id="modalAddress"></p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">등록일</p>
                        <p class="font-medium text-gray-800" id="modalDate"></p>
                    </div>
                </div>

                <!-- 보유 기술 -->
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">보유 기술</h3>
                    <div class="text-gray-600 leading-relaxed whitespace-pre-wrap bg-white border border-gray-100 p-4 rounded-lg" id="modalSkills"></div>
                </div>

                <!-- 경력 상세 -->
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">경력 상세</h3>
                    <div class="text-gray-600 leading-relaxed whitespace-pre-wrap bg-white border border-gray-100 p-4 rounded-lg" id="modalCareer"></div>
                </div>

                <!-- 포트폴리오 -->
                <div id="portfolioSection">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">포트폴리오</h3>
                    <div class="flex gap-3">
                        <a id="modalResume" href="#" target="_blank" class="hidden px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center">
                            <i class="fas fa-file-alt mr-2"></i> 이력서 보기
                        </a>
                        <a id="modalPortfolio" href="#" target="_blank" class="hidden px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center">
                            <i class="fas fa-images mr-2"></i> 포트폴리오 보기
                        </a>
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onclick="closeModal('jobseekerDetailModal')" class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                    닫기
                </button>
                <!-- 채용 제안하기 버튼은 추후 구현 -->
                <!-- <button class="ml-3 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    채용 제안하기
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
        document.addEventListener('DOMContentLoaded', loadJobseekers);

        async function loadJobseekers() {
            const searchInput = document.getElementById('searchInput');
            const search = searchInput ? searchInput.value : '';
            
            try {
                // 구직중인 인재만 조회
                let url = '/api/jobseekers?status=active';
                if (search) url += '&search=' + encodeURIComponent(search);

                const response = await fetch(url);
                const result = await response.json();
                
                const list = document.getElementById('jobseekersList');
                
                if (!result.success) {
                    list.innerHTML = \`
                        <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <p class="text-gray-600">데이터를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                    return;
                }

                if (result.data.length === 0) {
                    list.innerHTML = \`
                        <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-user-slash text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">현재 등록된 구직 정보가 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                list.innerHTML = result.data.map(js => \`
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
                        <div class="p-6 flex-1">
                            <div class="flex justify-between items-start mb-4">
                                <span class="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                    구직중
                                </span>
                                <span class="text-xs text-gray-400">
                                    \${new Date(js.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-1 hover:text-green-600 transition cursor-pointer" onclick='openJobseekerDetail(\${JSON.stringify(js).replace(/'/g, "&#39;")})'>
                                \${js.name}
                            </h3>
                            <p class="text-green-600 font-medium mb-4 flex items-center">
                                <i class="fas fa-graduation-cap mr-2 text-sm opacity-70"></i>
                                \${js.education || '학력 정보 없음'}
                            </p>
                            <div class="space-y-2 text-sm text-gray-500 mb-6">
                                <p class="flex items-center">
                                    <i class="fas fa-birthday-cake w-5 text-center mr-2 text-gray-400"></i>
                                    \${js.birth_date || '생년월일 비공개'}
                                </p>
                                <p class="flex items-center line-clamp-1">
                                    <i class="fas fa-tools w-5 text-center mr-2 text-gray-400"></i>
                                    \${js.skills || '기술 정보 없음'}
                                </p>
                            </div>
                        </div>
                        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                            <button onclick='openJobseekerDetail(\${JSON.stringify(js).replace(/'/g, "&#39;")})' class="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-green-600 hover:border-green-300 transition flex items-center justify-center">
                                상세 프로필 보기
                            </button>
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('jobseekersList').innerHTML = \`
                    <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                    </div>
                \`;
            }
        }

        function openJobseekerDetail(js) {
            document.getElementById('modalName').textContent = js.name;
            document.getElementById('modalEducation').textContent = js.education || '-';
            document.getElementById('modalBirthDate').textContent = js.birth_date || '-';
            document.getElementById('modalCareerSummary').textContent = js.career ? '경력 보유' : '신입';
            document.getElementById('modalAddress').textContent = js.address || '-';
            document.getElementById('modalDate').textContent = new Date(js.created_at).toLocaleDateString();
            document.getElementById('modalSkills').textContent = js.skills || '내용 없음';
            document.getElementById('modalCareer').textContent = js.career || '내용 없음';
            
            const resumeBtn = document.getElementById('modalResume');
            const portfolioBtn = document.getElementById('modalPortfolio');
            
            if (js.resume_file) {
                resumeBtn.href = js.resume_file;
                resumeBtn.classList.remove('hidden');
            } else {
                resumeBtn.classList.add('hidden');
            }
            
            if (js.portfolio_file) {
                portfolioBtn.href = js.portfolio_file;
                portfolioBtn.classList.remove('hidden');
            } else {
                portfolioBtn.classList.add('hidden');
            }

            document.getElementById('jobseekerDetailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
            document.body.style.overflow = '';
        }

        document.getElementById('jobseekerDetailModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('jobseekerDetailModal');
            }
        });
    </script>
</body>
</html>
`;
