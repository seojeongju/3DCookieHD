import { socialLinksFooterRowHtml } from './components/social_links';

export const footerHtml = () => `
<footer class="bg-gray-900 text-gray-300 py-10 sm:py-12 border-t border-gray-800 mt-auto pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-8">
            <!-- 회사 정보 -->
            <div>
                <div class="flex items-center mb-6">
                    <img src="/static/logo.png" alt="WOW 3D" class="h-9 mr-2" onerror="this.src='https://placehold.co/150x50/333/FFF?text=WOW3D'">
                </div>
                <p class="text-sm leading-relaxed mb-4 text-gray-400">
                    4차 산업혁명의 핵심 기술인 3D프린팅 전문 교육기관입니다.<br>
                    실무 중심의 커리큘럼과 최신 장비로 여러분의 꿈을 지원합니다.
                </p>
                ${socialLinksFooterRowHtml()}
            </div>

            <!-- 연락처 -->
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

        <div class="border-t border-gray-800 pt-8 mt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
            <div class="mb-0 text-center md:text-left w-full">
                <p class="mb-1 break-words">상호명: 와우쓰리디홍대센터 | 대표자: 김순희 | 사업자등록번호: 898-28-00570</p>
                <p class="mb-1 break-words">홍대센터: 서울특별시 마포구 독막로 93 4층 (상수동, 상수빌딩)</p>
                <p class="mb-1 break-words">구미센터: 경상북도 구미시 산호대로 253 606호 (공단동, 구미첨단의료기술타워)</p>
                <p class="mb-1 break-words">전주센터: 전북 전주시 덕진구 반룡로 109 207호 (팔복동, 테크노빌 A동)</p>
                <p class="mt-2">&copy; 2025 3D Cookie Hongdae Center. All rights reserved.</p>
            </div>
            <div class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 shrink-0">
                <a href="/guides/national-support" class="hover:text-white transition">국비지원</a>
                <a href="/guides/free-education" class="hover:text-white transition">무료·국비</a>
                <a href="/guides/craftsman-license" class="hover:text-white transition">기능사</a>
                <a href="/guides/small-business" class="hover:text-white transition">소상공인</a>
                <a href="/guides/prototype" class="hover:text-white transition">시제품</a>
                <a href="/locations" class="hover:text-white transition">오시는길</a>
                <a href="/terms" class="hover:text-white transition">이용약관</a>
                <a href="/privacy" class="hover:text-white transition">개인정보처리방침</a>
                <a href="/admin" class="hover:text-white transition">관리자 로그인</a>
            </div>
        </div>
    </div>
</footer>
`;
