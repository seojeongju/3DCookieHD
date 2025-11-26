export const reviewsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강후기 - 와우쓰리디홍대센터</title>
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
                    <a href="/jobs" class="px-3 py-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">채용정보</a>

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
    <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">수강후기</h1>
            <p class="text-xl text-green-100">수강생들이 직접 전하는 생생한 교육 후기를 만나보세요.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 상단 액션 바 -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">정렬:</span>
                <select id="sortOrder" onchange="loadReviews()" class="border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                    <option value="latest">최신순</option>
                    <option value="rating">평점순</option>
                </select>
            </div>
            <button onclick="openWriteModal()" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md flex items-center">
                <i class="fas fa-pen mr-2"></i> 후기 작성하기
            </button>
        </div>

        <!-- 리뷰 목록 -->
        <div id="reviewsList" class="grid md:grid-cols-2 gap-6">
            <!-- 로딩 중 표시 -->
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-green-500 mb-4"></i>
                <p class="text-gray-500">후기를 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center">
            <!-- 페이지네이션 버튼이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 후기 작성 모달 -->
    <div id="writeReviewModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">수강후기 작성</h3>
                <button onclick="closeModal('writeReviewModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="writeReviewForm" onsubmit="handleSubmitReview(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">수강 과정</label>
                            <select name="course_id" id="courseSelect" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">과정을 선택해주세요</option>
                                <!-- 과정 목록이 동적으로 로드됩니다 -->
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">평점</label>
                            <div class="flex space-x-2 text-2xl text-gray-300" id="starRating">
                                <button type="button" onclick="setRating(1)" class="hover:text-yellow-400 focus:outline-none"><i class="fas fa-star"></i></button>
                                <button type="button" onclick="setRating(2)" class="hover:text-yellow-400 focus:outline-none"><i class="fas fa-star"></i></button>
                                <button type="button" onclick="setRating(3)" class="hover:text-yellow-400 focus:outline-none"><i class="fas fa-star"></i></button>
                                <button type="button" onclick="setRating(4)" class="hover:text-yellow-400 focus:outline-none"><i class="fas fa-star"></i></button>
                                <button type="button" onclick="setRating(5)" class="hover:text-yellow-400 focus:outline-none"><i class="fas fa-star"></i></button>
                            </div>
                            <input type="hidden" name="rating" id="ratingInput" required>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">제목</label>
                            <input type="text" name="title" required placeholder="후기 제목을 입력해주세요" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">내용</label>
                            <textarea name="content" rows="5" required placeholder="수강 후기를 자세히 적어주세요. 다른 분들에게 큰 도움이 됩니다." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('writeReviewModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">등록하기</button>
                    </div>
                </form>
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
        document.addEventListener('DOMContentLoaded', () => {
            loadReviews();
            loadCourses();
        });

        async function loadReviews() {
            try {
                const response = await fetch('/api/reviews?approved=1');
                const result = await response.json();
                
                const reviewsList = document.getElementById('reviewsList');
                
                if (!result.success) {
                    reviewsList.innerHTML = \`
                        <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <p class="text-gray-600">데이터를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                    return;
                }

                if (result.data.length === 0) {
                    reviewsList.innerHTML = \`
                        <div class="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">아직 등록된 후기가 없습니다.</p>
                            <p class="text-gray-500 mt-2">첫 번째 후기의 주인공이 되어보세요!</p>
                        </div>
                    \`;
                    return;
                }

                reviewsList.innerHTML = result.data.map(review => \`
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 p-6 border border-gray-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">\${maskName(review.user_name)}</p>
                                    <p class="text-xs text-gray-500">\${new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="flex text-yellow-400 text-sm">
                                \${getStarRating(review.rating)}
                            </div>
                        </div>
                        <div class="mb-3">
                            <span class="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md mb-2">
                                \${review.course_title || '과정명 없음'}
                            </span>
                            <h3 class="text-lg font-bold text-gray-800">\${review.title}</h3>
                        </div>
                        <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            \${review.content}
                        </p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <button onclick="markHelpful(\${review.id})" class="text-gray-500 hover:text-green-600 text-sm flex items-center transition">
                                <i class="far fa-thumbs-up mr-1"></i> 도움이 됐어요 (\${review.helpful_count || 0})
                            </button>
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reviewsList').innerHTML = \`
                    <div class="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다.</p>
                    </div>
                \`;
            }
        }

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                
                if (result.success) {
                    const select = document.getElementById('courseSelect');
                    result.data.forEach(course => {
                        if (course.status === 'open' || course.status === 'closed') {
                            const option = document.createElement('option');
                            option.value = course.id;
                            option.textContent = course.title;
                            select.appendChild(option);
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        }

        function openWriteModal() {
            const token = localStorage.getItem('token');
            if (!token) {
                if(confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
                    location.href = '/login';
                }
                return;
            }
            document.getElementById('writeReviewModal').classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        function setRating(rating) {
            document.getElementById('ratingInput').value = rating;
            const stars = document.getElementById('starRating').children;
            for (let i = 0; i < 5; i++) {
                if (i < rating) {
                    stars[i].classList.add('text-yellow-400');
                    stars[i].classList.remove('text-gray-300');
                } else {
                    stars[i].classList.remove('text-yellow-400');
                    stars[i].classList.add('text-gray-300');
                }
            }
        }

        async function handleSubmitReview(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('후기가 등록되었습니다. 관리자 승인 후 게시됩니다.');
                    closeModal('writeReviewModal');
                    form.reset();
                    setRating(0);
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        async function markHelpful(id) {
            try {
                await fetch(\`/api/reviews/\${id}/helpful\`, { method: 'POST' });
                loadReviews(); // 카운트 갱신을 위해 목록 다시 로드
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function maskName(name) {
            if (!name) return '익명';
            if (name.length <= 2) return name.replace(/.$/, '*');
            return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        }

        function getStarRating(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }
    </script>
</body>
</html>
`;
