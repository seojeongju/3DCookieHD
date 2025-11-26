export const coursesListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 - 와우쓰리디홍대센터</title>
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
                                <a href="/courses?category=국비지원" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원과정</a>
                                <a href="/courses?category=일반과정" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">일반과정</a>
                                <a href="/courses?category=학생" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">학생/진학 과정</a>
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
            <h1 class="text-4xl font-bold mb-4">교육과정</h1>
            <p class="text-xl text-blue-100">와우쓰리디홍대센터의 전문적인 교육 과정을 만나보세요.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    <button onclick="filterCategory('')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white transition" data-category="">전체</button>
                    <button onclick="filterCategory('국비지원')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-category="국비지원">국비지원</button>
                    <button onclick="filterCategory('일반과정')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-category="일반과정">일반과정</button>
                    <button onclick="filterCategory('학생')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition" data-category="학생">학생/진학</button>
                </div>
                <div class="relative w-full md:w-64">
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    <input type="text" id="searchInput" placeholder="과정명 검색" onkeyup="if(event.key === 'Enter') loadCourses()" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
            </div>
        </div>

        <!-- 과정 목록 -->
        <div id="coursesList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 로딩 중 표시 -->
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
                <p class="text-gray-500">교육과정을 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center">
            <!-- 페이지네이션 버튼이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 과정 상세 모달 -->
    <div id="courseDetailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                    <span class="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full mb-2 inline-block" id="modalCategory"></span>
                    <h2 class="text-2xl font-bold text-gray-800" id="modalTitle"></h2>
                </div>
                <button onclick="closeModal('courseDetailModal')" class="text-gray-400 hover:text-gray-600 p-2">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-8">
                <!-- 썸네일 및 기본 정보 -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="w-full md:w-1/2">
                        <img id="modalImage" src="" alt="Course Thumbnail" class="w-full h-64 object-cover rounded-lg shadow-sm bg-gray-100">
                    </div>
                    <div class="w-full md:w-1/2 space-y-4">
                        <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span class="text-gray-500">수강료</span>
                            <span class="text-xl font-bold text-gray-800" id="modalPrice"></span>
                        </div>
                        <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span class="text-gray-500">교육기간</span>
                            <span class="font-medium text-gray-800" id="modalDuration"></span>
                        </div>
                        <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span class="text-gray-500">모집정원</span>
                            <span class="font-medium text-gray-800" id="modalMaxStudents"></span>
                        </div>
                        <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span class="text-gray-500">상태</span>
                            <span id="modalStatus"></span>
                        </div>
                        <div class="pt-4">
                            <button class="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition shadow-lg transform hover:-translate-y-0.5">
                                수강신청 / 상담문의
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 상세 설명 -->
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-4 border-l-4 border-primary-500 pl-3">과정 소개</h3>
                    <div class="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap" id="modalDescription"></div>
                </div>
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
        let currentCategory = '';
        
        const categoryMap = {
            'gukbi': '국비지원',
            'general': '일반과정',
            'student': '학생',
            'special': '특강'
        };
        
        const reverseCategoryMap = {
            '국비지원': 'gukbi',
            '일반과정': 'general',
            '학생': 'student',
            '특강': 'special'
        };

        document.addEventListener('DOMContentLoaded', () => {
            // URL 파라미터에서 카테고리 확인
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam) {
                // URL 파라미터(영어)를 DB 값(한글)으로 매핑
                currentCategory = categoryMap[categoryParam] || categoryParam;
                updateFilterButtons();
            }
            loadCourses();
        });

        function filterCategory(category) {
            currentCategory = category;
            updateFilterButtons();
            
            // URL 업데이트 (페이지 새로고침 없이)
            const url = new URL(window.location);
            if (category) {
                // DB 값(한글)을 URL 파라미터(영어)로 변환
                const urlValue = reverseCategoryMap[category] || category;
                url.searchParams.set('category', urlValue);
            } else {
                url.searchParams.delete('category');
            }
            window.history.pushState({}, '', url);
            
            loadCourses();
        }

        function updateFilterButtons() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.category === currentCategory) {
                    btn.classList.remove('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
                    btn.classList.add('bg-primary-600', 'text-white');
                } else {
                    btn.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
                    btn.classList.remove('bg-primary-600', 'text-white');
                }
            });
        }

        async function loadCourses() {
            const searchInput = document.getElementById('searchInput');
            const search = searchInput ? searchInput.value : '';
            
            try {
                let url = '/api/courses?';
                
                if (currentCategory) url += '&category=' + encodeURIComponent(currentCategory);
                if (search) url += '&search=' + encodeURIComponent(search);

                const response = await fetch(url);
                const result = await response.json();
                
                const list = document.getElementById('coursesList');
                
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
                            <i class="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">등록된 교육과정이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                list.innerHTML = result.data.map(course => \`
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group cursor-pointer" onclick='openCourseDetail(\${JSON.stringify(course).replace(/'/g, "&#39;")})'>
                        <div class="relative h-48 overflow-hidden bg-gray-200">
                            <img src="\${course.thumbnail_url || '/static/course_placeholder.jpg'}" alt="\${course.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                            <div class="absolute top-3 right-3">
                                <span class="px-2.5 py-1 text-xs font-bold rounded-full \${
                                    course.status === 'open' ? 'bg-green-500 text-white' : 
                                    course.status === 'closed' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                                } shadow-md">
                                    \${course.status === 'open' ? '모집중' : course.status === 'closed' ? '마감' : '준비중'}
                                </span>
                            </div>
                            <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                <span class="text-white text-xs font-medium bg-primary-600/80 px-2 py-1 rounded backdrop-blur-sm">
                                    \${course.category || '일반과정'}
                                </span>
                            </div>
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                \${course.title}
                            </h3>
                            <p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                                \${stripHtml(course.description) || '과정 설명이 없습니다.'}
                            </p>
                            
                            <div class="space-y-2 mt-auto pt-4 border-t border-gray-100">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-500"><i class="far fa-calendar-alt mr-2"></i>기간</span>
                                    <span class="font-medium text-gray-700">
                                        \${course.start_date ? new Date(course.start_date).toLocaleDateString() : '미정'}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-500"><i class="fas fa-won-sign mr-2"></i>수강료</span>
                                    <span class="font-bold text-primary-600">
                                        \${course.price ? Number(course.price).toLocaleString() + '원' : '무료'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('coursesList').innerHTML = \`
                    <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                    </div>
                \`;
            }
        }

        function openCourseDetail(course) {
            document.getElementById('modalTitle').textContent = course.title;
            document.getElementById('modalCategory').textContent = course.category || '일반과정';
            document.getElementById('modalImage').src = course.thumbnail_url || '/static/course_placeholder.jpg';
            document.getElementById('modalPrice').textContent = course.price ? Number(course.price).toLocaleString() + '원' : '무료';
            
            let durationText = '';
            if (course.start_date && course.end_date) {
                durationText = \`\${new Date(course.start_date).toLocaleDateString()} ~ \${new Date(course.end_date).toLocaleDateString()}\`;
            } else {
                durationText = '일정 미정';
            }
            document.getElementById('modalDuration').textContent = durationText;
            
            document.getElementById('modalMaxStudents').textContent = (course.max_students || '-') + '명';
            
            const statusMap = {
                'open': '<span class="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">모집중</span>',
                'closed': '<span class="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">마감</span>',
                'preparing': '<span class="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">준비중</span>'
            };
            document.getElementById('modalStatus').innerHTML = statusMap[course.status] || statusMap['open'];
            
            document.getElementById('modalDescription').innerHTML = course.description || '상세 설명이 없습니다.';

            document.getElementById('courseDetailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function stripHtml(html) {
            if (!html) return '';
            const tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
            document.body.style.overflow = '';
        }

        document.getElementById('courseDetailModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('courseDetailModal');
            }
        });
    </script>
</body>
</html>
`;
