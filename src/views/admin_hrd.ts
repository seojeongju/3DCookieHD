
export const adminHrdHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              teal: {
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
              },
              rose: {
                500: '#f43f5e',
              }
            }
          }
        }
      }
    </script>
    <style>
        .menu-item.active {
            background-color: #14b8a6; /* teal-500 */
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">
    <!-- 상단 유틸리티 바 -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-[1600px] mx-auto px-4">
            <div class="flex justify-between items-center h-10 text-xs text-gray-500">
                <div class="flex items-center gap-2">
                    <!-- 로고 영역 (필요시) -->
                </div>
                <div class="flex items-center gap-4">
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-list mr-1"></i>사전등록</a>
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-envelope mr-1"></i>문자발송</a>
                    <a href="#" class="hover:text-gray-800"><i class="fas fa-user-lock mr-1"></i>학생로그인인증</a>
                    <div class="flex items-center gap-1">
                        <i class="fas fa-toggle-off text-lg text-gray-400 cursor-pointer"></i>
                        <span>접속유지</span>
                    </div>
                    <a href="/logout" class="hover:text-gray-800 ml-2"><i class="fas fa-sign-out-alt mr-1"></i>Logout</a>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 네비게이션 (GNB) -->
    <nav class="bg-gray-800 text-white">
        <div class="max-w-[1600px] mx-auto px-4">
            <div class="flex items-center h-14 text-sm font-medium overflow-x-auto">
                <a href="#" class="menu-item active flex items-center justify-center px-6 h-full whitespace-nowrap">운영</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">학생</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">과정</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">인사</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가계획</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가실행</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">[NCS] 평가결과</a>
                <a href="#" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">역량평가-설문</a>
                <a href="/" class="menu-item hover:bg-gray-700 flex items-center justify-center px-6 h-full whitespace-nowrap">홈페이지</a>
            </div>
        </div>
    </nav>

    <!-- 메인 컨텐츠 -->
    <main class="flex-grow max-w-[1600px] mx-auto px-4 py-8 w-full">
        <!-- 타이틀 및 브레드크럼 -->
        <div class="mb-6">
            <h1 class="text-3xl font-light text-gray-800 mb-1">기초 데이터 등록</h1>
            <p class="text-xs text-gray-500">HOME / 운영 / 기초 데이터 등록 / 기초 데이터 등록</p>
        </div>

        <!-- 검색 바 및 액션 버튼 -->
        <div class="flex flex-col md:flex-row gap-4 mb-2">
            <!-- 검색 바 -->
            <div class="flex-grow flex items-center bg-white border border-teal-500 h-12">
                <div class="bg-teal-500 text-white px-4 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap">
                    통합검색
                </div>
                <input type="text" placeholder="검색단어 관련있는 지원자, 학생, 과정, 거래처가 검색됩니다." class="flex-grow px-4 h-full text-sm outline-none">
                <div class="bg-teal-500 text-white px-4 h-full flex items-center justify-center font-medium text-sm whitespace-nowrap border-l border-teal-600">
                    검색기간
                </div>
                <select class="h-full px-2 text-sm outline-none text-gray-600 bg-white border-l border-gray-200">
                    <option>::전체기간::</option>
                    <option>최근 1개월</option>
                    <option>최근 3개월</option>
                    <option>최근 6개월</option>
                    <option>최근 1년</option>
                </select>
                <button class="bg-teal-500 text-white w-12 h-full flex items-center justify-center hover:bg-teal-600 transition">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            <!-- 진행 상황 버튼 -->
            <button class="bg-rose-500 hover:bg-rose-600 text-white px-8 h-12 text-sm font-medium shadow-sm transition whitespace-nowrap">
                진행 상황 한눈에 보기
            </button>
        </div>
        
        <!-- 공지사항 바 -->
        <div class="flex items-center gap-2 mb-12 text-xs">
            <span class="bg-teal-500 text-white px-2 py-0.5 rounded-sm">HRDMarket 공지 및 업데이트 안내</span>
            <a href="#" class="text-blue-600 hover:underline">[긴급]시스템 장애로 인한 데이터 유실 안내(완료 및 공지내역 수정)</a>
        </div>

        <!-- 기초 데이터 등록 메뉴 (카드 그리드) -->
        <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl font-light text-gray-800 mb-2">기초 데이터 등록 메뉴</h2>
                <p class="text-xs text-gray-500">기초 데이터는 사전에 등록된 데이터를 활용하여 정보가 등록되오니, 순차적으로 등록을 추천합니다.</p>
            </div>

            <!-- 엑셀 업로드 방법 배너 -->
            <div class="bg-teal-500 text-white text-center py-2 text-sm font-medium mb-6 rounded-sm cursor-pointer hover:bg-teal-600 transition">
                엑셀업로드 방법
            </div>

            <!-- 카드 그리드 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <!-- 1. 강사(직원) -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">1. 강사(직원)</div>
                </a>

                <!-- 2. 훈련과정분류 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-sitemap"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">2. 훈련과정분류</div>
                </a>

                <!-- 3. 과정설정(승인과정) -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">3. 과정설정(승인과정)</div>
                </a>

                <!-- 4. 과정개설 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-folder-plus"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">4. 과정개설</div>
                </a>

                <!-- 5. 거래처분류 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-tags"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">5. 거래처분류</div>
                </a>

                <!-- 6. 거래처 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">6. 거래처</div>
                </a>

                <!-- 7. 교재 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">7. 교재</div>
                </a>

                <!-- 8. 훈련생 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">8. 훈련생</div>
                </a>

                <!-- 9. 훈련생 상담관리 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">9. 훈련생 상담관리</div>
                </a>

                <!-- 10. 비품-장비 -->
                <a href="#" class="group block border border-gray-200 rounded p-4 text-center hover:border-teal-500 hover:shadow-md transition bg-white">
                    <div class="text-gray-400 group-hover:text-teal-500 mb-2 text-3xl">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div class="text-sm text-gray-600 font-medium">10. 비품-장비</div>
                </a>
            </div>
        </div>

        <!-- 하단 안내 -->
        <div class="border-t border-gray-200 pt-8">
            <h3 class="text-sm font-bold text-gray-700 mb-4">엑셀업로드 시작하기 <span class="font-normal text-gray-500 ml-2">위 배너를 클릭하시면 해당되는 엑셀 업로드 페이지로 이동됩니다.</span></h3>
            
            <div class="flex items-start gap-2 mb-4">
                <i class="fas fa-exclamation-circle text-rose-500 mt-0.5"></i>
                <div>
                    <h4 class="text-sm font-bold text-gray-700">순차적인 엑셀 업로드와 양식</h4>
                    <div class="mt-2 grid grid-cols-[120px_1fr] gap-2 text-xs text-gray-500">
                        <div>순차적인 업로드</div>
                        <div>기초자료 업로드는 각 배너의 숫자 순서대로 순차적인 업로드를 해야합니다.</div>
                        <div>양식 데이터</div>
                        <div>순차적으로 업로드가 진행 되었을 경우 이전에 업로드한 데이터를 기준으로 작성할 엑셀 데이터가 만들어집니다.</div>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-2 text-xs text-gray-600 mt-6">
                <i class="fas fa-exclamation-triangle text-gray-500"></i>
                <span>아래의 그림처럼 순차적으로 등록을 하게되면, 이전에 등록된 데이터들이 현재 등록될 데이터 양식 기준이 됩니다.</span>
            </div>
        </div>
    </main>

    <script>
        // 메뉴 클릭 시 활성화 처리 (임시)
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 홈페이지 링크는 제외
                if (item.getAttribute('href') === '/') return;
                
                e.preventDefault();
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            });
        });
    </script>
</body>
</html>
`;
