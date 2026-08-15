import { socialLinksDesktopNavHtml, socialLinksMobileNavHtml } from './social_links';

export const navigationHtml = (activeMenu = '') => `
    <!-- 네비게이션 -->
    <nav class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 safe-nav-top">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center min-h-[3.25rem] sm:min-h-[4rem] h-14 sm:h-16">
                <!-- 모바일 메뉴 버튼 (최소 44×44 터치 영역) -->
                <button type="button" id="navMobileToggle" aria-controls="navMobileMenu" aria-expanded="false" aria-label="메뉴 열기" class="lg:hidden shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-50 transition">
                    <i class="fas fa-bars text-xl" aria-hidden="true"></i>
                </button>

                <!-- 로고 -->
                <div class="min-w-0 shrink flex items-center">
                    <a href="/" class="flex flex-col items-start group max-w-[min(100%,11rem)] sm:max-w-none">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-7 sm:h-9 w-auto object-contain mb-0.5">
                        <span class="text-[11px] sm:text-xs md:text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors truncate max-w-full">와우쓰리디홍대센터</span>
                    </a>
                </div>

                <!-- 메인 메뉴 (데스크톱) -->
                <div class="hidden lg:flex space-x-1 items-center">
                    <!-- 과정안내 -->
                    <div class="relative group shrink-0">
                        <a href="/course-sessions" class="px-3 py-2 ${['courses', 'course-sessions'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            과정안내
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </a>
                        <div class="absolute left-0 top-full z-50 mt-0 w-max min-w-[22rem] bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="flex">
                                <div class="w-52 shrink-0 py-2">
                                    <p class="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">모집 과정</p>
                                    <a href="/course-sessions" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">국비지원과정</a>
                                    <a href="/course-sessions?category=일반과정" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">일반과정</a>
                                    <a href="/course-sessions?category=학생" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">체험과정</a>
                                    <a href="/corporate-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">기업단체교육</a>
                                    <a href="/university-education" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">대학맞춤교육</a>
                                </div>
                                <div class="w-52 shrink-0 py-2 border-l border-gray-100 bg-slate-50/60">
                                    <p class="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">학습 가이드</p>
                                    <a href="/guides/national-support" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-primary-600 whitespace-nowrap">국비지원 안내</a>
                                    <a href="/guides/craftsman-license" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-primary-600 whitespace-nowrap">기능사 자격증</a>
                                    <a href="/guides/small-business" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-primary-600 whitespace-nowrap">소상공인 활용</a>
                                    <a href="/guides/prototype" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-primary-600 whitespace-nowrap">시제품 제작</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 센터소개 -->
                    <div class="relative group shrink-0">
                        <button class="px-3 py-2 ${['greeting', 'photos', 'facilities', 'locations', 'education-performance', 'reviews', 'prototype'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            센터소개
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full z-50 mt-0 w-max min-w-[13rem] bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="py-1">
                                <a href="/greeting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">인사말</a>
                                <a href="/education-photos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">교육사진</a>
                                <a href="/education-performance" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">교육실적</a>
                                <!-- 시설안내: 현재 비노출 (필요 시 hidden 제거) -->
                                <a href="/facilities" class="hidden block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">시설안내</a>
                                <a href="/locations" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">오시는길</a>
                                <a href="/locations/hongdae" class="block px-4 py-2 pl-6 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">홍대센터</a>
                                <a href="/locations/gumi" class="block px-4 py-2 pl-6 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">구미센터</a>
                                <a href="/locations/jeonju" class="block px-4 py-2 pl-6 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">전주센터</a>
                                <a href="/reviews" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">수강후기</a>
                                <a href="/prototype-gallery" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">시제품 제작사진</a>
                            </div>
                        </div>
                    </div>

                    <!-- 게시판 (탭 순서: /posts 페이지와 동일) -->
                    <div class="relative group shrink-0">
                        <button class="px-3 py-2 ${['board', 'portfolios'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            게시판
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full z-50 mt-0 w-max min-w-[11rem] bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="py-1">
                                <a href="/posts?category=notice" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">공지사항</a>
                                <a href="/faq" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">FAQ</a>
                                <a href="/posts?category=qna" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">Q&A</a>
                                <a href="/portfolios" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">포트폴리오</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 채용정보 (드롭다운) -->
                    <div class="relative group shrink-0">
                        <button class="px-3 py-2 ${['jobs', 'jobseekers'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            채용정보
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full z-50 mt-0 w-max min-w-[14rem] bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="py-1">
                                <a href="/jobs" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">구인정보 (채용공고)</a>
                                <a href="/jobseekers" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">구직정보 (인재풀)</a>
                            </div>
                        </div>
                    </div>

                    <!-- 상담센터 -->
                    <div class="relative group shrink-0">
                        <button class="px-3 py-2 ${['consulting'].includes(activeMenu) ? 'text-primary-600 font-bold' : 'text-gray-600 font-medium'} hover:text-primary-600 text-sm flex items-center transition-colors">
                            상담센터
                            <i class="fas fa-chevron-down ml-1 text-[10px] text-gray-400"></i>
                        </button>
                        <div class="absolute left-0 top-full z-50 mt-0 w-max min-w-[16rem] bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="py-1">
                                <a href="/online-consulting" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">온라인상담신청</a>
                                <a href="/tomorrow-learning-card" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 whitespace-nowrap">내일배움카드발급안내</a>
                            </div>
                        </div>
                    </div>

                    <!-- 학사관리 (보라색 버튼) -->
                    <div class="relative group ml-2 shrink-0">
                        <button class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded flex items-center transition-colors shadow-sm">
                            <i class="fas fa-graduation-cap mr-1.5 text-xs"></i>
                            학사관리
                            <i class="fas fa-chevron-down ml-1.5 text-[10px] text-purple-200"></i>
                        </button>
                        <div class="absolute left-0 top-full z-50 mt-1 w-max min-w-[11rem] bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                            <div class="py-1 academic-menu-dropdown">
                                <a href="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 whitespace-nowrap"><i class="fas fa-sign-in-alt mr-2"></i>로그인하기</a>
                                <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 whitespace-nowrap"><i class="fas fa-user-plus mr-2"></i>회원가입</a>
                            </div>
                        </div>
                    </div>
                </div>

                ${socialLinksDesktopNavHtml()}

                <!-- 우측 메뉴 (로그인/회원가입) -->
                <div class="flex items-center gap-1 sm:gap-2 shrink-0" id="authMenu">
                    <a href="/login" class="px-2 sm:px-3 py-2 min-h-[44px] sm:min-h-0 flex items-center text-gray-500 hover:text-primary-600 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap">로그인</a>
                    <a href="/register" class="px-2.5 sm:px-4 py-2 min-h-[44px] sm:min-h-0 flex items-center bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">회원가입</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 모바일 메뉴 (드로어) -->
    <div id="navMobileMenu" class="fixed inset-0 z-40 lg:hidden hidden" aria-hidden="true">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="navMobileMenuBackdrop" aria-label="메뉴 닫기"></div>
        <div class="absolute top-0 left-0 right-0 bg-white shadow-xl max-h-[min(92dvh,100%)] overflow-y-auto overscroll-contain rounded-b-2xl safe-pb-menu">
            <div class="flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top,0px))] border-b border-gray-100">
                <span class="font-bold text-gray-800 text-lg">메뉴</span>
                <button type="button" id="navMobileMenuClose" aria-label="메뉴 닫기" class="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 active:bg-gray-50"><i class="fas fa-times text-lg"></i></button>
            </div>
            <div class="py-2 pb-6">
                <a href="/course-sessions" class="block px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-primary-600 transition-colors">과정안내 <i class="fas fa-chevron-right ml-1 text-[8px]"></i></a>
                <a href="/course-sessions" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원과정</a>
                <a href="/course-sessions?category=일반과정" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">일반과정</a>
                <a href="/course-sessions?category=학생" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">체험과정</a>
                <a href="/corporate-education" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">기업단체교육</a>
                <a href="/university-education" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">대학맞춤교육</a>
                <div class="px-2 py-1 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">학습 가이드</div>
                <a href="/guides/national-support" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">국비지원 안내</a>
                <a href="/guides/craftsman-license" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">기능사 자격증</a>
                <a href="/guides/small-business" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">소상공인 활용</a>
                <a href="/guides/prototype" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">시제품 제작</a>
                <div class="px-2 py-1 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">센터소개</div>
                <a href="/greeting" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">인사말</a>
                <a href="/education-photos" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육사진</a>
                <a href="/education-performance" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">교육실적</a>
                <a href="/locations" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">오시는길</a>
                <a href="/locations/hongdae" class="block px-4 py-3 pl-6 text-gray-600 hover:bg-gray-50 hover:text-primary-600">홍대센터</a>
                <a href="/locations/gumi" class="block px-4 py-3 pl-6 text-gray-600 hover:bg-gray-50 hover:text-primary-600">구미센터</a>
                <a href="/locations/jeonju" class="block px-4 py-3 pl-6 text-gray-600 hover:bg-gray-50 hover:text-primary-600">전주센터</a>
                <a href="/reviews" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">수강후기</a>
                <a href="/prototype-gallery" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">시제품 제작사진</a>
                <div class="px-2 py-1 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">게시판</div>
                <a href="/posts?category=notice" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">공지사항</a>
                <a href="/faq" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">FAQ</a>
                <a href="/posts?category=qna" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">Q&A</a>
                <a href="/portfolios" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">포트폴리오</a>
                <div class="px-2 py-1 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">채용정보</div>
                <a href="/jobs" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">구인정보</a>
                <a href="/jobseekers" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">구직정보</a>
                <div class="px-2 py-1 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">상담센터</div>
                <a href="/online-consulting" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">온라인상담신청</a>
                <a href="/tomorrow-learning-card" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600">내일배움카드발급안내</a>
                ${socialLinksMobileNavHtml()}
                <div class="border-t border-gray-100 mt-2 pt-2">
                    <a href="/login" class="block px-4 py-3 text-gray-700 hover:bg-gray-50"><i class="fas fa-sign-in-alt mr-2 text-gray-400"></i>로그인</a>
                    <a href="/register" class="block px-4 py-3 text-primary-600 font-medium hover:bg-primary-50"><i class="fas fa-user-plus mr-2"></i>회원가입</a>
                </div>
            </div>
        </div>
    </div>
    <script>
    (function(){
        var toggle = document.getElementById('navMobileToggle');
        var menu = document.getElementById('navMobileMenu');
        var backdrop = document.getElementById('navMobileMenuBackdrop');
        var closeBtn = document.getElementById('navMobileMenuClose');
        function syncToggleState(isOpen) {
            if (toggle) {
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
            }
        }
        function openMenu(){
            if (!menu) return;
            menu.classList.remove('hidden');
            menu.setAttribute('aria-hidden','false');
            document.body.style.overflow='hidden';
            syncToggleState(true);
        }
        function closeMenu(){
            if (!menu) return;
            menu.classList.add('hidden');
            menu.setAttribute('aria-hidden','true');
            document.body.style.overflow='';
            syncToggleState(false);
        }
        function toggleMenu(){
            if (!menu) return;
            if (menu.classList.contains('hidden')) openMenu();
            else closeMenu();
        }
        if (toggle) toggle.addEventListener('click', function(e){ e.preventDefault(); toggleMenu(); });
        if (backdrop) backdrop.addEventListener('click', closeMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (menu) menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    })();
    </script>
    <script src="/static/academic-menu.js"></script>
`;
