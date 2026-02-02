
export const navigationHtml = (activeMenu = '') => `
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
                        <button class="px-3 py-2 ${activeMenu === 'courses' ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            과정안내
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/courses" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">전체 과정 보기</a>
                                <a href="/courses?category=국비지원" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원과정</a>
                                <a href="/courses?category=일반과정" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">일반과정</a>
                                <a href="/courses?category=학생" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">학생/진학 과정</a>
                                <a href="/corporate-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">기업단체교육</a>
                                <a href="/university-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">대학맞춤교육</a>
                            </div>
                        </div>
                    </div>

                    <!-- 센터소개 -->
                    <div class="relative group">
                        <button class="px-3 py-2 ${['greeting', 'photos', 'facilities', 'locations'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            센터소개
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/greeting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">인사말</a>
                                <a href="/education-photos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육사진</a>
                                <!-- 시설안내: 현재 비노출 (필요 시 hidden 제거) -->
                                <a href="/facilities" class="hidden block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">시설안내</a>
                                <a href="/locations" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">오시는길</a>
                            </div>
                        </div>
                    </div>

                    <!-- 게시판 (수강후기 포함) -->
                    <div class="relative group">
                        <button class="px-3 py-2 ${['board', 'reviews', 'portfolios', 'prototype'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            게시판
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/posts?category=notice" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">공지사항</a>
                                <a href="/posts?category=faq" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">FAQ</a>
                                <a href="/posts?category=qna" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Q&A</a>
                                <a href="/reviews" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">수강후기</a>
                                <a href="/portfolios" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">포트폴리오</a>
                                <a href="/prototype-gallery" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">시제품 제작사진</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 채용정보 (드롭다운) -->
                    <div class="relative group">
                        <button class="px-3 py-2 ${['jobs', 'jobseekers'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
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
                        <button class="px-3 py-2 ${['consulting'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            상담센터
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden z-50">
                            <div class="py-1">
                                <a href="/online-consulting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">온라인상담신청</a>
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
                            <div class="py-1 academic-menu-dropdown">
                                <a href="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"><i class="fas fa-sign-in-alt mr-2"></i>로그인하기</a>
                                <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"><i class="fas fa-user-plus mr-2"></i>회원가입</a>
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
    <script src="/static/academic-menu.js"></script>
`;
