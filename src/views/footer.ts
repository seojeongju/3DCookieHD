export const footerHtml = () => `
<footer class="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- 회사 정보 -->
            <div class="col-span-1 md:col-span-2">
                <div class="flex items-center mb-6">
                    <img src="/static/logo.png" alt="WOW 3D" class="h-9 mr-2" onerror="this.src='https://placehold.co/150x50/333/FFF?text=WOW3D'">
                </div>
                <p class="text-sm leading-relaxed mb-4 text-gray-400">
                    4차 산업혁명의 핵심 기술인 3D프린팅 전문 교육기관입니다.<br>
                    실무 중심의 커리큘럼과 최신 장비로 여러분의 꿈을 지원합니다.
                </p>
                <div class="flex space-x-4">
                    <a href="https://blog.naver.com/wow3d16" target="_blank" class="text-gray-400 hover:text-white transition"><i class="fab fa-blog"></i></a>
                </div>
            </div>

            <!-- 바로가기 -->
            <div>
                <h3 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">바로가기</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/courses" class="hover:text-primary-400 transition">교육과정</a></li>
                    <li><a href="/schedule" class="hover:text-primary-400 transition">교육일정</a></li>
                    <li><a href="/online-consulting" class="hover:text-primary-400 transition">온라인 상담 신청</a></li>
                    <li><a href="/posts?category=notice" class="hover:text-primary-400 transition">공지사항</a></li>
                    <li><a href="/reviews" class="hover:text-primary-400 transition">수강후기</a></li>
                    <li><a href="/locations" class="hover:text-primary-400 transition">오시는 길</a></li>
                </ul>
            </div>

            <!-- 고객센터 -->
            <div>
                <h3 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">CONTACT US</h3>
                <ul class="space-y-2 text-sm">
                    <li class="flex items-start">
                        <i class="fas fa-envelope mt-1 mr-2 text-primary-500"></i>
                        <span>wow3d16@naver.com</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-envelope mt-1 mr-2 text-primary-500"></i>
                        <span>3dcookiehd@naver.com</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-phone mt-1 mr-2 text-primary-500"></i>
                        <span>홍대: 02-3144-3137</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-phone mt-1 mr-2 text-primary-500"></i>
                        <span>구미: 054-464-3137</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-phone mt-1 mr-2 text-primary-500"></i>
                        <span>전주: 02-3144-3137</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-gray-800 pt-8 mt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0 text-center md:text-left w-full">
                <p class="mb-1">상호명: 와우쓰리디홍대센터 | 대표자: 김순희 | 사업자등록번호: 898-28-00570</p>
                <p class="mb-1">홍대센터: 서울특별시 마포구 독막로 93 4층 (상수동, 상수빌딩)</p>
                <p class="mb-1">구미센터: 경상북도 구미시 산호대로 253 606호 (공단동, 구미첨단의료기술타워)</p>
                <p class="mb-1">전주센터: 전북 전주시 덕진구 반룡로 109 207호 (팔복동, 테크노빌 A동)</p>
                <p class="mt-2">&copy; 2025 3D Cookie Hongdae Center. All rights reserved.</p>
            </div>
            <div class="flex space-x-6 whitespace-nowrap">
                <a href="/terms" class="hover:text-white transition">이용약관</a>
                <a href="/privacy" class="hover:text-white transition">개인정보처리방침</a>
                <a href="/admin" class="hover:text-white transition">관리자 로그인</a>
            </div>
        </div>
    </div>
</footer>
`;
