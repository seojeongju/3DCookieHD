import { layoutHtml } from './components/layout';
import { buildHowTo, CAMPUSES, getSeoHead, getSeoOptionsForPath, SITE_NAME, SITE_ORIGIN } from '../utils/seo';
import { learnHeadAssets, learnScript, renderInfographic, type Infographic } from './components/learn_infographics';

type GuideSection = {
    id: string;
    h2: string;
    /** FAQ 구조화 데이터의 답변으로도 쓰이므로 질문에 대한 완결된 문장으로 작성 */
    body: string;
    figure?: Infographic | Infographic[];
    outro?: string;
};

type GuideStep = {
    title: string;
    text: string;
    href?: string;
    linkLabel?: string;
};

type GuidePage = {
    slug: string;
    kicker: string;
    icon: string;
    h1: string;
    lead: string;
    scopeNote: string;
    banner?: string;
    showCampusStrip?: boolean;
    factRows?: Array<[string, string]>;
    factNote?: string;
    sections: GuideSection[];
    steps?: GuideStep[];
    links: { href: string; label: string; primary?: boolean }[];
    /** cards: 아코디언 대신 인포그래픽 카드로 펼쳐 보여줌 (절차 타임라인은 섹션 인포그래픽으로 대체) */
    layout?: 'cards';
    hero?: 'card' | 'license';
};

const CAMPUS_TONES = ['indigo', 'sky', 'emerald'] as const;

const campusIconGrid: Infographic = {
    kind: 'iconGrid',
    caption: '국비 과정 운영 센터',
    items: (Object.keys(CAMPUSES) as Array<keyof typeof CAMPUSES>).map((key, i) => {
        const c = CAMPUSES[key];
        return {
            icon: 'fa-map-marker-alt',
            tone: CAMPUS_TONES[i % CAMPUS_TONES.length],
            title: c.name.replace('와우쓰리디 ', ''),
            desc: `${c.region} ${c.locality} ${c.street}`,
            href: `/locations/${c.slug}`,
            linkLabel: '오시는길',
        };
    }),
};

const GUIDE_NAV: Array<{ slug: string; label: string; icon: string }> = [
    { slug: 'national-support', label: '국비지원·내일배움카드', icon: 'fa-landmark' },
    { slug: 'craftsman-license', label: '기능사·국가자격', icon: 'fa-id-badge' },
    { slug: 'small-business', label: '소상공인 활용', icon: 'fa-store' },
    { slug: 'prototype', label: '시제품 제작', icon: 'fa-drafting-compass' },
    { slug: '3d-printing', label: '3D프린팅 기초', icon: 'fa-lightbulb' },
];

const PAGES: Record<string, GuidePage> = {
    'national-support': {
        slug: 'national-support',
        kicker: '국비·비용 가이드',
        icon: 'fa-landmark',
        h1: '3D프린팅 국비지원·내일배움카드, 어떻게 신청하나요?',
        lead: '「3D프린터 무료교육」 검색은 대개 국민내일배움카드(국비지원)를 뜻합니다. 카드 한도·자기부담금·신청 자격부터 와우쓰리디 과정 등록까지 인포그래픽으로 한눈에 정리했습니다.',
        scopeNote: '내일배움카드 핵심 요약·국비 과정 수강 등록 안내',
        banner: '<i class="fas fa-info-circle mr-2"></i>금액·자격 기준은 <strong>2026년 고용노동부 기준 요약</strong>입니다. 실제 적용은 <a href="https://www.work24.go.kr" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:no-underline">고용24</a> 공지와 개인 심사 결과가 우선하며, 발급 FAQ는 <a href="/tomorrow-learning-card" class="font-bold underline hover:no-underline">내일배움카드 발급 안내</a>에서 볼 수 있습니다.',
        layout: 'cards',
        hero: 'card',
        factRows: [
            ['지원 제도', '국민내일배움카드(고용노동부)'],
            ['훈련비 한도', '5년간 300만원 (특정 대상 최대 500만원)'],
            ['자기부담', '일반 훈련 0~55% · 특화 훈련 10% 이하'],
            ['신청 창구', '고용24 온라인 또는 관할 고용센터'],
            ['캠퍼스', '홍대·구미·전주'],
            ['대표 과정', 'Fusion 3D모델링·기능사·스마트제품개발·교강사'],
        ],
        factNote: '한도·자부담률·제외 대상은 연도별 고시와 개인 심사 결과가 우선합니다. 최신 기준은 <a href="https://www.work24.go.kr" target="_blank" rel="noopener noreferrer" class="font-bold text-indigo-600 hover:underline">고용24</a> 공지를 확인하세요.',
        sections: [
            {
                id: 'at-a-glance',
                h2: '내일배움카드, 숫자로 한눈에 보면?',
                body: '국민내일배움카드는 발급일부터 <strong class="text-slate-800">5년</strong> 동안 <strong class="text-slate-800">300만원</strong> 한도 안에서 직업훈련비를 지원받는 계좌입니다. 저소득층 등 정부가 정한 대상자는 200만원이 추가되어 최대 500만원까지 쓸 수 있고, 일반 훈련은 훈련비의 0~55%를 본인이 부담합니다.',
                figure: [
                    {
                        kind: 'stats',
                        caption: '2026년 기준 핵심 숫자',
                        items: [
                            { icon: 'fa-wallet', tone: 'indigo', value: 300, unit: '만원', label: '기본 훈련비 한도', desc: '5년 동안 여러 과정에 나눠 사용' },
                            { icon: 'fa-plus-circle', tone: 'violet', prefix: '+', value: 200, unit: '만원', label: '추가 지원', desc: '저소득층 등 특정 대상, 최대 500만원' },
                            { icon: 'fa-hourglass-half', tone: 'sky', value: 5, unit: '년', label: '유효기간', desc: '발급일부터 5년, 만료 후 재발급 신청' },
                            { icon: 'fa-percent', tone: 'amber', prefix: '0~', value: 55, unit: '%', label: '일반 훈련 자부담', desc: '직종 취업률 등에 따라 차등' },
                        ],
                    },
                    {
                        kind: 'stackBar',
                        caption: '훈련비 계좌 한도 구조',
                        unit: '만원',
                        max: 500,
                        segments: [
                            { label: '기본 한도', value: 300, tone: 'indigo', note: '발급자 공통 · 5년간 여러 과정에 나눠 사용' },
                            { label: '추가 지원', value: 200, tone: 'violet', optional: true, note: '저소득층 등 정부가 정한 대상자에 한해 추가' },
                        ],
                    },
                ],
            },
            {
                id: 'what-is',
                h2: '3D프린팅 국비지원이란?',
                body: '고용노동부 <strong class="text-slate-800">국민내일배움카드</strong>로 직업훈련비를 지원받아 3D프린팅·3D모델링을 배우는 제도입니다. 정부는 카드 발급과 훈련비를 지원하고, 수강생은 카드로 과정을 신청하며, 와우쓰리디는 NCS 기반 훈련을 <strong class="text-slate-800">홍대·구미·전주</strong>센터에서 운영합니다. 회차별로 모집 일정·장소·자기부담금이 다릅니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '국비지원에 참여하는 세 주체',
                    items: [
                        { icon: 'fa-landmark', tone: 'sky', title: '고용노동부 · 고용센터', desc: '카드 발급 심사, 훈련비 지원, 훈련 과정 인정' },
                        { icon: 'fa-user', tone: 'indigo', title: '수강생 (나)', desc: '카드 발급 신청, 과정 선택·수강 신청, 출석 관리' },
                        { icon: 'fa-school', tone: 'emerald', title: '와우쓰리디', desc: '국비 과정 운영, 수강 상담, 실습·출결 관리' },
                    ],
                },
            },
            {
                id: 'free-edu',
                h2: '「무료교육」 검색, 실제로는 무엇을 뜻하나요?',
                body: '검색·광고에서 말하는 무료교육은 대부분 <strong class="text-slate-800">국비지원(내일배움카드) 수강</strong>을 가리킵니다. 실제로는 훈련비의 일부를 본인이 부담하는 경우가 많고, 완전 0원 여부는 회차·훈련 유형·개인 자격에 따라 달라지므로 희망 회차 기준으로 상담 시 확정 안내합니다.',
            },
            {
                id: 'card-needed',
                h2: '내일배움카드가 꼭 필요한가요?',
                body: '국비지원 회차 수강에는 일반적으로 카드가 필요합니다. 아직 없다면 아래 자격과 5단계 절차를 확인한 뒤 고용24에서 신청하세요. 자주 묻는 발급 질문은 <a href="/tomorrow-learning-card" class="font-bold text-indigo-600 hover:underline">내일배움카드 발급 안내</a>에 정리되어 있습니다.',
            },
            {
                id: 'eligibility',
                h2: '누가 카드를 발급받을 수 있나요?',
                body: '실업자·재직자·자영업자·특수형태근로종사자 등 <strong class="text-slate-800">국민 누구나 신청할 수 있는 것이 원칙</strong>입니다. 다만 공무원·사립학교 교직원, 만 75세 이상, 일정 소득·매출 이상인 재직자·자영업자, 졸업까지 2년 넘게 남은 대학 재학생 등은 지원에서 제외됩니다. 세부 예외는 고용24 공지와 개인 심사 결과가 우선합니다.',
                figure: {
                    kind: 'balance',
                    caption: '신청 가능 대상과 제외 대상',
                    labels: { good: '신청할 수 있어요', bad: '지원 제외 대상', goodIcon: 'fa-check', badIcon: 'fa-ban', hideCount: true },
                    pros: [
                        { icon: 'fa-user-clock', title: '실업자·구직자', desc: '고용24 구직신청 후 카드 신청' },
                        { icon: 'fa-briefcase', title: '재직자·비정규직', desc: '재직 중에도 신청 가능 (일부 고소득 대기업 재직자 제외)' },
                        { icon: 'fa-store', title: '자영업자·특수형태근로종사자', desc: '매출·소득 기준 이하라면 신청 가능' },
                        { icon: 'fa-user-graduate', title: '졸업 예정 학생', desc: '졸업까지 2년 이내 대학생, 고등학교 3학년 등' },
                    ],
                    cons: [
                        { icon: 'fa-landmark', title: '공무원·사립학교 교직원', desc: '별도 교육 제도 적용 대상' },
                        { icon: 'fa-user', title: '만 75세 이상', desc: '연령 기준으로 지원 제외' },
                        { icon: 'fa-coins', title: '고소득 재직·자영업자', desc: '대기업 45세 미만 월 300만원 이상, 특고 월 500만원 이상, 연 매출 4억원 이상 자영업자 등' },
                        { icon: 'fa-school', title: '재학생 일부', desc: '졸업까지 2년 넘게 남은 대학생, 고등학교 1~2학년' },
                        { icon: 'fa-hand-holding-heart', title: '생계급여 수급자', desc: '조건부 수급자는 신청 가능' },
                    ],
                },
            },
            {
                id: 'process',
                h2: '카드 발급부터 수강 시작까지 어떤 순서인가요?',
                body: '실업자는 고용24에서 <strong class="text-slate-800">구직신청</strong>을 먼저 하고(재직자·자영업자는 대개 생략), 고용24 온라인 또는 관할 고용센터에서 카드를 신청합니다. 심사를 거쳐 카드를 받으면 와우쓰리디 회차를 골라 상담한 뒤, 고용24에서 수강신청을 하고 훈련을 시작합니다.',
                figure: {
                    kind: 'flow',
                    caption: '내일배움카드 국비 수강 5단계',
                    steps: [
                        { icon: 'fa-search', title: '구직 신청', desc: '실업자는 고용24 구직신청 먼저', chips: ['실업자'] },
                        { icon: 'fa-id-card', title: '카드 발급 신청', desc: '고용24 온라인 또는 고용센터 방문', chips: ['고용24'] },
                        { icon: 'fa-clipboard-check', title: '심사·카드 수령', desc: '자격 심사 후 발급, 거절 시 이의신청 가능' },
                        { icon: 'fa-comments', title: '과정 선택·상담', desc: '와우쓰리디 회차 확인, 자부담 안내', chips: ['02-3144-3137'] },
                        { icon: 'fa-play-circle', title: '수강 신청·시작', desc: '고용24에서 수강신청 후 훈련 시작' },
                    ],
                },
            },
            {
                id: 'which-case',
                h2: '내 상황에서는 무엇부터 하면 되나요?',
                body: '실업 중이라면 고용24 구직신청부터, 재직자라면 바로 카드 신청부터 시작합니다. 자영업자는 매출·소득 기준을, 대학생은 졸업 예정 시기를 먼저 확인하세요. 이미 카드가 있다면 고용24에서 잔액·유효기간을 확인한 뒤 희망 회차를 상담하면 됩니다.',
                figure: {
                    kind: 'decision',
                    caption: '상황별 시작점',
                    options: [
                        { when: '실업·구직 중이에요', pick: '고용24 구직신청 → 카드 신청', why: '구직신청이 되어 있어야 카드 신청이 진행됩니다.', icon: 'fa-user-clock', tone: 'sky' },
                        { when: '회사에 다니고 있어요', pick: '바로 카드 신청', why: '재직자도 신청할 수 있어요. 평일 저녁·주말 회차를 상담해 보세요.', icon: 'fa-briefcase', tone: 'indigo' },
                        { when: '자영업·프리랜서예요', pick: '매출·소득 기준 확인 후 신청', why: '기준 이하라면 재직자와 같은 방법으로 신청합니다.', icon: 'fa-store', tone: 'amber' },
                        { when: '대학생이에요', pick: '졸업 예정 시기 확인', why: '졸업까지 2년 이내라면 신청할 수 있습니다.', icon: 'fa-user-graduate', tone: 'violet' },
                        { when: '이미 카드가 있어요', pick: '잔액·유효기간 확인 후 상담', why: '고용24에서 잔액을 확인하고 희망 회차를 상담하세요.', icon: 'fa-credit-card', tone: 'emerald' },
                    ],
                },
            },
            {
                id: 'cost',
                h2: '비용·자기부담금은 어떻게 되나요?',
                body: '정부가 인정한 훈련비 중 일부를 본인이 부담합니다. <strong class="text-slate-800">일반 훈련은 0~55%</strong>로 직종 평균 취업률·국민취업지원제도 참여·근로장려금 수급 여부에 따라 달라지고, 국가기간·전략산업직종 등 <strong class="text-slate-800">특화 훈련은 90% 이상</strong>(자부담 상한 60만원) 지원됩니다. 와우쓰리디는 회차마다 훈련 유형이 다르므로 상담 시 해당 회차 기준 금액을 안내합니다.',
                figure: [
                    {
                        kind: 'range',
                        caption: '훈련 유형별 훈련비 부담 비율',
                        min: 0,
                        max: 100,
                        step: 25,
                        unit: '%',
                        series: [
                            { label: '본인 부담', color: '#f59e0b' },
                            { label: '정부 지원', color: '#6366f1' },
                        ],
                        rows: [
                            { name: '일반 훈련', ranges: [[0, 55], [45, 100]] },
                            { name: '특화 훈련', ranges: [[0, 10], [90, 100]] },
                        ],
                    },
                    {
                        kind: 'iconGrid',
                        caption: '자기부담률을 바꾸는 요인',
                        items: [
                            { icon: 'fa-chart-line', tone: 'indigo', title: '직종 평균 취업률', desc: '훈련 직종의 취업률에 따라 자부담 비율이 차등 적용' },
                            { icon: 'fa-hands-helping', tone: 'emerald', title: '국민취업지원제도 참여', desc: '참여 유형에 따라 자부담 감면' },
                            { icon: 'fa-receipt', tone: 'amber', title: '근로장려금 수급', desc: '수급 가구는 자부담 감면 대상' },
                            { icon: 'fa-star', tone: 'violet', title: '특화 훈련 과정', desc: '유효기간 중 1회, 훈련비 90% 이상 지원 (계좌에서 200만원 차감)' },
                        ],
                    },
                ],
                outro: '140시간 이상 과정에서 출석률 80% 이상 등 요건을 채우면 <strong class="text-slate-800">훈련장려금</strong>을 받을 수 있습니다(실업급여 수급 중 제외). 지급액은 고용24 공지를 확인하세요.',
            },
            {
                id: 'courses',
                h2: '와우쓰리디에서 수강할 수 있는 국비 과정은?',
                body: '대표 과정은 <strong class="text-slate-800">Fusion 3D모델링, 3D프린터운용기능사, 스마트 제품개발, 3D프린팅 교강사</strong>입니다. 세부 일정·모집 여부는 <a href="/course-sessions" class="font-bold text-indigo-600 hover:underline">교육과정 목록</a>에서 확인하세요.',
                figure: {
                    kind: 'iconGrid',
                    caption: '대표 국비 과정',
                    items: [
                        { icon: 'fa-cube', tone: 'indigo', title: 'Fusion 3D모델링', desc: 'CAD 모델링·어셈블리 실무', href: '/course-sessions', linkLabel: '과정 보기' },
                        { icon: 'fa-certificate', tone: 'amber', title: '3D프린터운용기능사', desc: '국가자격 실기 대비 (모델링·출력·후가공)', href: '/guides/craftsman-license', linkLabel: '기능사 가이드' },
                        { icon: 'fa-microchip', tone: 'sky', title: '스마트 제품개발', desc: '3D프린팅·아두이노·설계 융합', href: '/course-sessions', linkLabel: '과정 보기' },
                        { icon: 'fa-chalkboard-teacher', tone: 'emerald', title: '3D프린팅 교강사', desc: '교육·실습 지도 역량', href: '/course-sessions', linkLabel: '과정 보기' },
                    ],
                },
            },
            {
                id: 'checklist',
                h2: '수강 전에 무엇을 준비하면 되나요?',
                body: '카드 발급 여부와 고용24의 잔액·유효기간을 확인하고, 희망 과정·센터·일정을 정해 자기부담금을 상담받은 뒤 고용24에서 수강신청을 마치면 됩니다. 수강 중에는 출석률 80% 이상을 유지해야 수료와 훈련장려금 요건을 채울 수 있습니다.',
                figure: {
                    kind: 'checklist',
                    caption: '국비 수강 준비 체크리스트',
                    columns: [
                        { title: '카드 준비', icon: 'fa-id-card', tone: 'indigo', items: ['내일배움카드 발급 완료', '고용24에서 잔액·유효기간 확인', '본인 명의 카드인지 확인'] },
                        { title: '과정 준비', icon: 'fa-list-check', tone: 'sky', items: ['희망 과정·센터·일정 선택', '자기부담금·훈련 유형 상담', '고용24 수강신청 완료'] },
                        { title: '수강 중', icon: 'fa-calendar-check', tone: 'emerald', items: ['출석률 80% 이상 유지', '결석·지각 시 증빙 서류 준비', '수료 후 취업·자격 연계 상담'] },
                    ],
                },
            },
            {
                id: 'campus',
                h2: '어느 센터에서 수강할 수 있나요?',
                body: '홍대·구미·전주센터에서 국비 과정을 운영합니다. 회차마다 교육 장소가 다르므로 과정 상세의 교육장소를 확인하세요. 센터별 주소·연락처는 <a href="/locations" class="font-bold text-indigo-600 hover:underline">오시는길</a>에서 볼 수 있습니다.',
                figure: campusIconGrid,
            },
        ],
        steps: [
            { title: '구직 신청 (실업자)', text: '실업자는 고용24에서 구직신청을 먼저 합니다. 재직자·자영업자는 대개 생략합니다.' },
            { title: '카드 발급 신청', text: '고용24 온라인 또는 관할 고용센터에서 내일배움카드를 신청합니다.', href: '/tomorrow-learning-card', linkLabel: '발급 안내 보기' },
            { title: '심사·카드 수령', text: '자격 심사를 거쳐 카드를 받습니다. 거절되면 이의신청할 수 있습니다.' },
            { title: '과정 선택·상담', text: '교육과정 목록에서 회차를 고르고 온라인 상담 또는 전화(02-3144-3137)로 자기부담금을 안내받습니다.', href: '/course-sessions', linkLabel: '과정 목록' },
            { title: '수강 신청·훈련 시작', text: '고용24에서 수강신청을 마치고 훈련을 시작합니다.', href: '/online-consulting', linkLabel: '상담 신청' },
        ],
        links: [
            { href: '/course-sessions', label: '모집 과정 보기', primary: true },
            { href: '/online-consulting', label: '온라인 상담', primary: true },
            { href: '/tomorrow-learning-card', label: '내일배움카드 발급 상세' },
            { href: '/guides/craftsman-license', label: '기능사·국가자격' },
            { href: '/guides/3d-printing', label: '3D프린팅 기초' },
            { href: '/faq', label: 'FAQ' },
        ],
    },
    'craftsman-license': {
        slug: 'craftsman-license',
        kicker: '자격증 가이드',
        icon: 'fa-id-badge',
        h1: '3D프린터운용기능사·개발산업기사, 어떻게 준비하나요?',
        lead: '3D프린터 국가기술자격은 출력·운용 실무를 검증하는 3D프린터운용기능사와 장비 설계·제어를 검증하는 3D프린터개발산업기사 두 종목입니다. 시험 구성·응시 자격·실기 흐름·성장 로드맵을 인포그래픽으로 정리했습니다.',
        scopeNote: '3D프린터운용기능사·3D프린터개발산업기사 시험 구성과 준비 안내',
        banner: '<i class="fas fa-info-circle mr-2"></i>시험 구성은 <strong>한국산업인력공단 출제기준(2024~) 요약</strong>입니다. 일정·응시 자격·원서 접수·공개문제는 <a href="https://www.q-net.or.kr" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:no-underline">Q-Net(큐넷)</a> 공식 공지가 우선합니다.',
        layout: 'cards',
        hero: 'license',
        factRows: [
            ['국가자격 종목', '3D프린터운용기능사 · 3D프린터개발산업기사'],
            ['시행기관', '한국산업인력공단 (큐넷)'],
            ['기능사 시험', '필기 60문항·60분 / 실기 작업형 약 4시간'],
            ['산업기사 시험', '필기 4과목 80문항·2시간 / 실기 필답형 1시간+작업형 약 4시간'],
            ['와우쓰리디 강점', '실기 모델링·출력·후가공 반복 연습'],
            ['캠퍼스', '홍대·구미·전주'],
        ],
        factNote: '시험 일정·합격 기준·응시 자격은 한국산업인력공단 <a href="https://www.q-net.or.kr" target="_blank" rel="noopener noreferrer" class="font-bold text-indigo-600 hover:underline">Q-Net</a> 공지가 우선합니다.',
        sections: [
            {
                id: 'official-name',
                h2: '3D프린터 국가자격증의 공식 명칭과 종류는?',
                body: '3D프린터 국가기술자격은 <strong class="text-slate-800">3D프린터운용기능사</strong>와 <strong class="text-slate-800">3D프린터개발산업기사</strong> 두 종목이며, 모두 한국산업인력공단이 시행합니다. 「3D프린팅 기능사」「3D프린터 자격증」 검색은 대개 운용기능사를 가리킵니다. 운용기능사는 모델링·슬라이싱·출력·후가공 등 <strong class="text-slate-800">장비를 다루는 실무</strong>를, 개발산업기사는 기구·회로·제어 프로그램 등 <strong class="text-slate-800">장비를 만드는 능력</strong>을 검증합니다.',
                figure: {
                    kind: 'specCompare',
                    caption: '두 자격 한눈에 비교 (출제기준 2024년~ 요약)',
                    columns: [
                        { title: '3D프린터운용기능사', sub: 'Craftsman · 운용', icon: 'fa-print', tone: 'indigo' },
                        { title: '3D프린터개발산업기사', sub: 'Industrial Engineer · 개발', icon: 'fa-microchip', tone: 'violet' },
                    ],
                    rows: [
                        { label: '핵심 직무', icon: 'fa-briefcase', values: ['데이터 생성, 3D프린터 설정, 제품 출력, 안전관리', '기구·제어회로·구동장치·제어 프로그램 설계, 테스트'] },
                        { label: '응시 자격', icon: 'fa-user-check', values: ['제한 없음 (누구나)', '기능사+실무 1년, 관련학과 졸업(예정), 실무 2년 등'] },
                        { label: '필기', icon: 'fa-pen', values: ['객관식 60문항 · 60분', '4과목 80문항 · 2시간'] },
                        { label: '실기', icon: 'fa-tools', values: ['작업형 약 4시간 (모델링·출력·후가공)', '필답형 1시간 + 작업형 약 4시간 (조립·회로·프로그램)'] },
                        { label: '합격 기준', icon: 'fa-flag-checkered', values: ['필기·실기 각 60점 이상', '필기 과목당 40점·평균 60점, 실기 60점 이상'] },
                        { label: '추천 대상', icon: 'fa-user', values: ['입문자·비전공자, 출력 실무·교육 희망자', '전자·기계·SW 전공자, 장비 개발·유지보수 희망자'] },
                    ],
                },
            },
            {
                id: 'roadmap',
                h2: '기능사에서 산업기사까지 어떤 순서로 준비하나요?',
                body: '처음이라면 3D모델링·슬라이싱 기초를 익혀 <strong class="text-slate-800">운용기능사</strong>부터 취득하는 것이 일반적입니다. 이후 동일·유사 직무분야에서 1년 이상 실무 경력을 쌓으면 <strong class="text-slate-800">개발산업기사</strong> 응시 자격이 생기고, 관련학과 졸업(예정)자는 바로 산업기사에 응시할 수 있습니다.',
                figure: {
                    kind: 'flow',
                    caption: '3D프린터 국가자격 성장 로드맵',
                    steps: [
                        { icon: 'fa-cube', title: '기초 학습', desc: '3D모델링·슬라이서·출력 원리', chips: ['입문'] },
                        { icon: 'fa-print', title: '운용기능사 취득', desc: '필기 60문항 → 작업형 실기', chips: ['기능사'] },
                        { icon: 'fa-briefcase', title: '실무 경력 1년+', desc: '동일·유사 직무분야 경력 (관련학과는 생략 가능)' },
                        { icon: 'fa-microchip', title: '개발산업기사 취득', desc: '회로·제어 필답형 + 조립·프로그램 작업형', chips: ['산업기사'] },
                    ],
                },
            },
            {
                id: 'exam-structure',
                h2: '3D프린터운용기능사 시험은 어떻게 구성되나요?',
                body: '필기는 데이터 생성, 3D프린터 설정, 제품 출력 및 안전관리 범위에서 <strong class="text-slate-800">객관식 60문항을 60분</strong> 동안 CBT로 풉니다. 실기는 <strong class="text-slate-800">작업형(약 4시간)</strong>으로 큐넷에 공개된 도면 중 하나를 모델링·출력·후가공해 제출하며, 필기·실기 모두 100점 만점에 60점 이상이면 합격입니다.',
                figure: {
                    kind: 'stats',
                    caption: '3D프린터운용기능사 핵심 숫자',
                    items: [
                        { icon: 'fa-pen', tone: 'indigo', value: 60, unit: '문항', label: '필기 문항 수', desc: '객관식 4지 택일 · 60분 CBT' },
                        { icon: 'fa-stopwatch', tone: 'sky', prefix: '약 ', value: 4, unit: '시간', label: '실기 작업형', desc: '모델링·출력·후가공 (출제기준)' },
                        { icon: 'fa-drafting-compass', tone: 'violet', value: 27, unit: '형', label: '공개 도면', desc: '큐넷 공개문제 중 출제 (2026년 2회~)' },
                        { icon: 'fa-flag-checkered', tone: 'emerald', value: 60, unit: '점', label: '합격 기준', desc: '필기·실기 각 100점 만점' },
                    ],
                },
            },
            {
                id: 'craftsman-practical',
                h2: '운용기능사 실기는 어떤 순서로 진행되나요?',
                body: '공개 도면을 확인해 부품을 <strong class="text-slate-800">3D 모델링·조립</strong>하고, 슬라이서에서 지지대와 출력 조건을 설정해 G코드를 만든 뒤 출력합니다. 출력 중 오류에 대응하고, 출력물을 안전하게 회수해 지지대 제거 등 <strong class="text-slate-800">후가공</strong>까지 마쳐 제출합니다.',
                figure: {
                    kind: 'flow',
                    caption: '운용기능사 실기 작업 흐름',
                    steps: [
                        { icon: 'fa-file-image', title: '도면 확인', desc: '공개 도면 중 출제 형별 확인' },
                        { icon: 'fa-cubes', title: '모델링·조립', desc: '부품 3D 모델링 후 어셈블리', chips: ['CAD'] },
                        { icon: 'fa-layer-group', title: '슬라이싱', desc: '지지대·출력 조건 설정, G코드 생성', chips: ['G-code'] },
                        { icon: 'fa-print', title: '출력·오류 대응', desc: '장비 설정 후 출력, 오류 시 조치' },
                        { icon: 'fa-hand-sparkles', title: '회수·후가공', desc: '지지대 제거·정리 후 제출' },
                    ],
                },
                outro: '실격·감점 기준과 지참물은 회차별 <a href="https://www.q-net.or.kr" target="_blank" rel="noopener noreferrer" class="font-bold text-indigo-600 hover:underline">큐넷 공개문제</a>의 수험자 유의사항을 꼭 확인하세요.',
            },
            {
                id: 'engineer-exam',
                h2: '3D프린터개발산업기사 시험은 어떻게 구성되나요?',
                body: '필기는 <strong class="text-slate-800">4과목(회로 및 기구, 장치, 프로그램, 품질보증 및 안전관리)</strong>에서 과목당 20문항씩 총 80문항을 2시간 동안 풀며, 과목당 40점 이상·전과목 평균 60점 이상이면 합격합니다. 실기 「3D프린터 개발실무」는 <strong class="text-slate-800">필답형 1시간(45점)과 작업형 약 4시간(55점)</strong>을 합산해 60점 이상이면 합격입니다.',
                figure: [
                    {
                        kind: 'stats',
                        caption: '3D프린터개발산업기사 핵심 숫자',
                        items: [
                            { icon: 'fa-pen', tone: 'violet', value: 80, unit: '문항', label: '필기 문항 수', desc: '4과목 × 20문항 · 2시간' },
                            { icon: 'fa-balance-scale', tone: 'amber', value: 40, unit: '점', label: '과목별 과락', desc: '과목당 40점 이상, 평균 60점 이상' },
                            { icon: 'fa-stopwatch', tone: 'sky', prefix: '약 ', value: 5, unit: '시간', label: '실기 시간', desc: '필답형 1시간 + 작업형 약 4시간' },
                            { icon: 'fa-flag-checkered', tone: 'emerald', value: 60, unit: '점', label: '실기 합격', desc: '필답형·작업형 합산 100점 만점' },
                        ],
                    },
                    {
                        kind: 'iconGrid',
                        caption: '필기 4과목',
                        items: [
                            { icon: 'fa-project-diagram', tone: 'indigo', title: '3D프린터 회로 및 기구', desc: '제어 회로, 기구부 구조와 설계' },
                            { icon: 'fa-cogs', tone: 'sky', title: '3D프린터 장치', desc: '구동장치·센서·모터·압출부' },
                            { icon: 'fa-code', tone: 'violet', title: '3D프린터 프로그램', desc: '제어 프로그램·펌웨어·G코드' },
                            { icon: 'fa-shield-alt', tone: 'emerald', title: '품질보증 및 안전관리', desc: '테스트·품질 점검·안전 기준' },
                        ],
                    },
                    {
                        kind: 'stackBar',
                        caption: '실기 배점 구조 (100점 만점, 60점 이상 합격)',
                        unit: '점',
                        max: 100,
                        segments: [
                            { label: '필답형', value: 45, tone: 'violet', note: '1시간 · 회로·장치·제어 이론 주관식' },
                            { label: '작업형', value: 55, tone: 'indigo', note: '약 4시간 · 조립·회로 결선·제어 프로그램' },
                        ],
                    },
                ],
            },
            {
                id: 'engineer-practical',
                h2: '개발산업기사 실기 작업형에서는 무엇을 하나요?',
                body: '큐넷 공개문제 기준으로 <strong class="text-slate-800">아두이노 기반 제어 과제</strong>가 출제됩니다. 주어진 부품으로 회로를 결선하고 모터·센서·LCD 등을 제어하는 프로그램을 작성·업로드한 뒤 요구 동작을 검증합니다. 전자 회로와 C/C++ 기초가 있으면 준비가 수월합니다.',
                figure: {
                    kind: 'flow',
                    caption: '개발산업기사 실기 작업형 흐름 (공개문제 기준)',
                    steps: [
                        { icon: 'fa-book-open', title: '과제·데이터시트 확인', desc: '요구 동작과 부품 사양 파악' },
                        { icon: 'fa-plug', title: '회로 결선', desc: '모터·센서·LCD를 보드에 연결', chips: ['Arduino'] },
                        { icon: 'fa-code', title: '제어 프로그램 작성', desc: '라이브러리 활용, 입출력·모터 제어', chips: ['C/C++'] },
                        { icon: 'fa-upload', title: '업로드·디버깅', desc: '보드에 업로드 후 오류 수정' },
                        { icon: 'fa-check-double', title: '동작 검증', desc: '요구사항대로 작동하는지 확인' },
                    ],
                },
            },
            {
                id: 'eligibility',
                h2: '응시 자격은 어떻게 되나요?',
                body: '3D프린터운용기능사는 <strong class="text-slate-800">응시 자격 제한이 없어</strong> 누구나 응시할 수 있습니다. 3D프린터개발산업기사는 기능사 취득 후 동일·유사 직무분야 실무 1년 이상, 관련학과 전문대·대학 졸업(예정), 동일·유사 직무분야 실무 2년 이상 등 요건 중 하나를 갖춰야 합니다. 개인별 응시 가능 여부는 큐넷 응시자격 자가진단으로 최종 확인하세요.',
                figure: {
                    kind: 'iconGrid',
                    caption: '응시 자격 요약 (개인별 확인은 큐넷 자가진단)',
                    items: [
                        { icon: 'fa-door-open', tone: 'indigo', title: '운용기능사: 누구나', desc: '학력·경력 제한 없이 응시 가능' },
                        { icon: 'fa-id-badge', tone: 'violet', title: '산업기사: 기능사 + 실무 1년', desc: '기능사 취득 후 동일·유사 직무분야 1년 이상' },
                        { icon: 'fa-user-graduate', tone: 'sky', title: '산업기사: 관련학과 졸업(예정)', desc: '전문대·대학 관련학과 졸업자 또는 졸업 예정자' },
                        { icon: 'fa-briefcase', tone: 'amber', title: '산업기사: 실무 2년', desc: '동일·유사 직무분야 2년 이상 경력' },
                        { icon: 'fa-chalkboard-teacher', tone: 'emerald', title: '산업기사: 훈련과정 이수', desc: '산업기사 수준 기술훈련과정 이수(예정)자' },
                        { icon: 'fa-route', tone: 'rose', title: '과정평가형 (두 종목 모두)', desc: '지정 교육·훈련과정 이수 후 평가로 취득', href: 'https://c.q-net.or.kr', linkLabel: '과정평가형 안내' },
                    ],
                },
            },
            {
                id: 'which-one',
                h2: '나에게 맞는 자격은 무엇인가요?',
                body: '3D프린터로 모델링·출력·후가공을 하고 싶거나 비전공 입문자라면 <strong class="text-slate-800">운용기능사</strong>가 적합합니다. 장비를 직접 설계·제어·유지보수하고 싶은 전자·기계·SW 전공자라면 <strong class="text-slate-800">개발산업기사</strong>를 목표로 하되, 운용기능사로 장비 이해를 먼저 쌓는 것도 좋은 방법입니다.',
                figure: {
                    kind: 'decision',
                    caption: '목표별 추천 자격',
                    options: [
                        { when: '3D프린팅을 처음 배워요', pick: '운용기능사부터', why: '응시 제한이 없고 모델링·출력 기본기를 체계적으로 익힙니다.', icon: 'fa-seedling', tone: 'emerald' },
                        { when: '출력·시제품 제작 일을 하고 싶어요', pick: '운용기능사', why: '모델링·슬라이싱·후가공 실무를 그대로 검증합니다.', icon: 'fa-print', tone: 'indigo' },
                        { when: '3D프린팅 강사·교육이 목표예요', pick: '운용기능사 + 교강사 과정', why: '자격과 함께 실습 지도 역량을 갖추면 유리합니다.', icon: 'fa-chalkboard-teacher', tone: 'sky' },
                        { when: '장비 개발·제어·유지보수에 관심 있어요', pick: '개발산업기사', why: '기구·회로·아두이노 제어 등 장비 개발 역량을 검증합니다.', icon: 'fa-microchip', tone: 'violet' },
                    ],
                },
            },
            {
                id: 'curriculum',
                h2: '와우쓰리디 실기 대비 과정은 어떻게 구성되어 있나요?',
                body: '운용기능사 출제 유형에 맞춰 <strong class="text-slate-800">모델링 → 슬라이서 설정 → 출력 → 품질 점검 → 후가공</strong> 흐름을 반복하고, 강사 피드백으로 치수·품질·마감을 교정합니다. 실기대비 정규반(주말·평일저녁), 집중문제풀이, 재수강·보완 등 회차별로 운영하며, 산업기사 대비 과정 개설 여부는 교육과정 목록과 상담으로 확인하세요.',
                figure: {
                    kind: 'iconGrid',
                    caption: '대표 과정 형태 (회차별 상이)',
                    items: [
                        { icon: 'fa-calendar-week', tone: 'indigo', title: '실기대비 정규반', desc: '주말반·평일저녁반 등 반복 실습', href: '/course-sessions', linkLabel: '과정 목록' },
                        { icon: 'fa-bolt', tone: 'amber', title: '집중문제풀이', desc: '시험 형식 반복·실기 시간 확대', href: '/course-sessions', linkLabel: '과정 목록' },
                        { icon: 'fa-redo', tone: 'emerald', title: '재수강·보완', desc: '이전 수강 후 부족한 부분 추가 연습', href: '/online-consulting', linkLabel: '상담 신청' },
                    ],
                },
            },
            {
                id: 'checklist',
                h2: '시험 준비는 무엇부터 점검하면 되나요?',
                body: '큐넷에서 원서 접수 일정을 확인하고 필기 기출을 반복한 뒤, 실기는 공개 도면 모델링과 슬라이서 설정·후가공을 충분히 연습합니다. 산업기사를 준비한다면 응시자격 자가진단과 회로·아두이노 기초 학습을 먼저 점검하세요.',
                figure: {
                    kind: 'checklist',
                    caption: '자격시험 준비 체크리스트',
                    columns: [
                        { title: '접수·필기', icon: 'fa-pen', tone: 'indigo', items: ['큐넷 원서 접수 일정 확인', '필기 기출 반복 (CBT 대비)', '신분증·수험표 준비'] },
                        { title: '기능사 실기', icon: 'fa-print', tone: 'sky', items: ['공개 도면 모델링 반복', '지지대·G코드 설정 연습', '출력 오류 대응·후가공 연습'] },
                        { title: '산업기사', icon: 'fa-microchip', tone: 'violet', items: ['응시자격 자가진단', '회로·아두이노 기초 학습', '공개문제 과제 실습'] },
                    ],
                },
            },
            {
                id: 'national-support',
                h2: '기능사 과정도 국비(내일배움카드)가 되나요?',
                body: '개설 회차에 따라 <strong class="text-slate-800">국민내일배움카드(국비지원)</strong> 적용 여부가 다릅니다. 자기부담금·모집 요건도 회차별로 상이하므로, 희망 회차를 고른 뒤 상담 시 확정 안내합니다. 카드 한도·자부담·신청 절차는 <a href="/guides/national-support" class="font-bold text-indigo-600 hover:underline">국비지원 가이드</a>에서 인포그래픽으로 확인할 수 있습니다.',
            },
            {
                id: 'campus',
                h2: '어느 센터에서 수강할 수 있나요?',
                body: '홍대·구미·전주센터에서 기능사 대비 과정을 운영합니다. 회차마다 교육 장소·개강 일정이 다르므로 과정 상세의 교육장소를 확인하세요. 수강생 후기는 <a href="/reviews" class="font-bold text-indigo-600 hover:underline">수강후기</a>에서 볼 수 있습니다.',
                figure: campusIconGrid,
            },
        ],
        steps: [
            { title: '자격·시험 정보 확인', text: '운용기능사·개발산업기사의 시험 구성과 응시 자격을 Q-Net에서 확인합니다.', href: 'https://www.q-net.or.kr', linkLabel: 'Q-Net 바로가기' },
            { title: '대비 과정 선택', text: '주말반·평일저녁반·집중문제풀이 등 모집 회차를 과정 목록에서 고릅니다.', href: '/course-sessions', linkLabel: '기능사 과정 목록' },
            { title: '상담·등록', text: '국비 적용 여부·일정·자기부담금을 상담 후 등록합니다.', href: '/online-consulting', linkLabel: '상담 신청' },
        ],
        links: [
            { href: '/course-sessions', label: '기능사 과정 목록', primary: true },
            { href: '/online-consulting', label: '수강 상담', primary: true },
            { href: '/guides/national-support', label: '국비지원 신청' },
            { href: '/guides/3d-printing', label: '3D프린팅 기초' },
            { href: '/reviews', label: '수강후기' },
            { href: '/faq', label: 'FAQ' },
        ],
    },
    'small-business': {
        slug: 'small-business',
        kicker: '소상공인 가이드',
        icon: 'fa-store',
        h1: '소상공인 3D프린팅, 매장에 바로 쓰는 교육',
        lead: '쿠키틀·몰드·스텐실·소품 제품화 등 매장·제작 현장에 바로 적용하는 단기 실습 과정입니다. 내일배움카드 정규 국비과정과 목적·일정·수강 요건이 다릅니다.',
        scopeNote: '소상공인·매장용 3D프린팅 단기 실습 (쿠키틀·몰드·제품화)',
        banner: '<i class="fas fa-store mr-2"></i>이 페이지는 <strong>소상공인·매장 활용 단기 과정</strong> 안내입니다. NCS 정규 국비과정·내일배움카드 수강 흐름은 <a href="/guides/national-support" class="font-bold underline hover:no-underline">국비지원 가이드</a>를 참고하세요.',
        showCampusStrip: true,
        factRows: [
            ['대표 활용', '쿠키틀·스텐실·몰드·소품 제품화'],
            ['과정 성격', '단기 실습·매장 맞춤'],
            ['주요 개설', '홍대센터 (회차별 상이)'],
            ['국비 정규과정', '별도 — 국비지원 가이드 참고'],
        ],
        factNote: '소상공인 전문기술교육 등 공고명·지원 요건은 회차별 공지와 상담 안내가 우선입니다.',
        sections: [
            {
                id: 'content',
                h2: '어떤 내용을 배우나요?',
                body: '매장·제작에 바로 쓰는 실습 중심 커리큘럼입니다.<ul class="mt-3 space-y-2 pl-1"><li class="flex gap-2"><i class="fas fa-cookie-bite mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">쿠키틀·스텐실</strong> — 3D프린터 커스텀 제작</span></li><li class="flex gap-2"><i class="fas fa-shapes mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">실리콘·레진 몰드</strong> — 복제·양면 몰드 활용</span></li><li class="flex gap-2"><i class="fas fa-gift mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">소품 제품화</strong> — 아이디어에서 판매용 제품까지</span></li><li class="flex gap-2"><i class="fas fa-print mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">프린터·후처리 기초</strong> — 출력 품질·마감</span></li></ul>',
            },
            {
                id: 'who',
                h2: '누가 수강하면 좋나요?',
                body: '베이커리·카페·공방·핸드메이드 쇼핑몰 등 <strong class="text-slate-800">소규모 매장·제작자</strong>에게 적합합니다. 3D프린터를 처음 접하더라도 단기 집중 실습으로 매장용 아이템을 직접 만들어 보는 것이 목표인 분께 추천합니다. 제품·부품 시제품 중심 교육은 <a href="/guides/prototype" class="font-bold text-indigo-600 hover:underline">시제품 가이드</a>를 참고하세요.',
            },
            {
                id: 'course-tracks',
                h2: '과정 단계는 어떻게 나뉘나요?',
                body: '회차명에 따라 단계가 구분됩니다. 예시는 아래와 같으며, 실제 모집 과정은 <a href="/course-sessions" class="font-bold text-indigo-600 hover:underline">교육과정 목록</a>에서 확인하세요.<ul class="mt-3 space-y-2 pl-1"><li class="flex gap-2"><i class="fas fa-layer-group mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">기초</strong> — 쿠키틀·스텐실 실전 제작</span></li><li class="flex gap-2"><i class="fas fa-layer-group mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">기초2·심화</strong> — 소품 제품화·몰드 맞춤 아이템</span></li><li class="flex gap-2"><i class="fas fa-layer-group mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">특화</strong> — AI·3D모델·실리콘·레진 복제 등</span></li></ul>',
            },
            {
                id: 'vs-national',
                h2: '국비지원(내일배움카드) 과정과 무엇이 다른가요?',
                body: '소상공인 과정은 <strong class="text-slate-800">매장 활용·단기 실습·제작 목적</strong>에 맞춘 커리큘럼입니다. NCS 기반 정규 직업훈련(국비)과는 수강 기간·평가·지원 제도·자격 요건이 다를 수 있습니다. 국비 정규과정을 희망하면 <a href="/guides/national-support" class="font-bold text-indigo-600 hover:underline">국비지원 가이드</a>와 병행해 상담하세요.',
            },
            {
                id: 'apply',
                h2: '어디서·어떻게 신청하나요?',
                body: '주로 <strong class="text-slate-800">홍대센터</strong> 단기 회차로 개설됩니다(회차별 상이). 교육과정 목록에서 소상공인·소공인 관련 과정을 확인한 뒤, 온라인 상담 또는 전화(02-3144-3137)로 희망 일정·제작 목적을 알려주시면 등록을 안내합니다.',
            },
            {
                id: 'tips',
                h2: '수강 전 알아두면 좋은 점',
                body: '만들고 싶은 아이템(쿠키틀, 스텐실, 간판 소품 등)을 미리 정리해 오시면 실습 방향을 맞추기 쉽습니다. 회차별 준비물·장비 안내는 등록 후 안내됩니다. 국가자격(3D프린터운용기능사) 준비가 목적이라면 <a href="/guides/craftsman-license" class="font-bold text-indigo-600 hover:underline">기능사 가이드</a>가 더 적합합니다.',
            },
        ],
        steps: [
            { title: '과정·일정 확인', text: '교육과정 목록에서 소상공인 관련 모집 회차를 확인합니다.', href: '/course-sessions', linkLabel: '과정 목록' },
            { title: '목적·일정 상담', text: '만들고 싶은 아이템과 희망 일정을 온라인·전화로 상담합니다.', href: '/online-consulting', linkLabel: '상담 신청' },
            { title: '등록·실습 시작', text: '회차별 안내에 따라 등록 후 실습을 시작합니다.' },
        ],
        links: [
            { href: '/course-sessions', label: '소상공인 과정 보기', primary: true },
            { href: '/online-consulting', label: '맞춤 상담', primary: true },
            { href: '/guides/national-support', label: '국비지원 가이드' },
            { href: '/guides/prototype', label: '시제품 제작 교육' },
            { href: '/locations/hongdae', label: '홍대센터 오시는길' },
        ],
    },
    prototype: {
        slug: 'prototype',
        kicker: '시제품 가이드',
        icon: 'fa-drafting-compass',
        h1: '3D프린팅 시제품 제작 교육',
        lead: '아이디어·도면을 시제품으로 만드는 모델링·출력·후가공 실무 교육입니다. 단기 워크숍부터 NCS 정규·기업 맞춤까지 회차별로 운영하며, 소상공인 단기 과정과 목적·대상이 다릅니다.',
        scopeNote: '시제품 모델링·출력·후가공 실무 교육 (개인·기업)',
        banner: '<i class="fas fa-drafting-compass mr-2"></i>이 페이지는 <strong>제품·부품 시제품 제작</strong> 교육 안내입니다. 매장용 쿠키틀·몰드 단기 과정은 <a href="/guides/small-business" class="font-bold underline hover:no-underline">소상공인 가이드</a>를 참고하세요.',
        showCampusStrip: true,
        factRows: [
            ['교육 범위', '모델링·슬라이싱·출력·후가공'],
            ['대상', '개인·스타트업·기업 실무자'],
            ['과정 형태', '단기 워크숍·NCS 정규·기업 맞춤'],
            ['사례 확인', '시제품 갤러리·포트폴리오'],
        ],
        factNote: '기업 맞춤 일정·인원·커리큘럼은 상담 후 확정됩니다. 국비 정규과정은 국비지원 가이드를 참고하세요.',
        sections: [
            {
                id: 'scope',
                h2: '시제품 교육에서 배우는 범위는?',
                body: '설계·모델링부터 슬라이싱, 출력, 후가공까지 <strong class="text-slate-800">시제품 제작 전 과정</strong>을 다룹니다. CAD·Fusion 360 등 모델링 도구, 슬라이서 설정, 출력물 품질 점검, 샌딩·도색 등 마감까지 실무 흐름을 연습합니다. 소상공인 단기 과정(쿠키틀·몰드)보다 제품·부품 시제품에 가깝습니다.',
            },
            {
                id: 'who',
                h2: '누가 수강하면 좋나요?',
                body: '제품 개발·창업·메이커 활동을 하는 <strong class="text-slate-800">개인·스타트업·기업 실무자</strong>에게 적합합니다. 아이디어를 실물로 검증하거나, 도면·스케치를 출력 가능한 모델로 바꾸는 역량이 필요한 분께 추천합니다. 매장용 소품 제작 목적이라면 <a href="/guides/small-business" class="font-bold text-indigo-600 hover:underline">소상공인 가이드</a>가 더 적합할 수 있습니다.',
            },
            {
                id: 'course-types',
                h2: '어떤 과정 형태가 있나요?',
                body: '회차·목적에 따라 형태가 다릅니다. 대표 예시는 아래와 같으며, 세부 일정은 <a href="/course-sessions" class="font-bold text-indigo-600 hover:underline">교육과정 목록</a>과 <a href="/corporate-education" class="font-bold text-indigo-600 hover:underline">기업교육</a> 안내에서 확인하세요.<ul class="mt-3 space-y-2 pl-1"><li class="flex gap-2"><i class="fas fa-bolt mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">단기 워크숍</strong> — 시제품 제작 입문·집중 실습</span></li><li class="flex gap-2"><i class="fas fa-graduation-cap mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">NCS 정규 훈련</strong> — 모델링·출력 심화 (회차별 상이)</span></li><li class="flex gap-2"><i class="fas fa-building mt-1 text-indigo-500 text-xs"></i><span><strong class="text-slate-800">기업 맞춤</strong> — 일정·인원·과제 맞춤 교육</span></li></ul>',
            },
            {
                id: 'vs-small-business',
                h2: '소상공인 과정과 무엇이 다른가요?',
                body: '시제품 교육은 <strong class="text-slate-800">제품·부품 개발·검증</strong>에 초점을 둡니다. 소상공인 과정은 쿠키틀·스텐실·몰드 등 매장 활용 단기 실습 중심으로, 커리큘럼·수강 기간·대상이 다릅니다. 두 과정 모두 3D프린팅을 다루지만 목적에 맞게 선택하세요.',
            },
            {
                id: 'gallery',
                h2: '제작 사례는 어디서 보나요?',
                body: '<a href="/prototype-gallery" class="font-bold text-indigo-600 hover:underline">시제품 제작사진</a> 갤러리에서 출력·후가공 사례를 확인할 수 있습니다. 수강생 포트폴리오·교육 실적은 <a href="/education-performance" class="font-bold text-indigo-600 hover:underline">교육 실적</a> 페이지에서도 볼 수 있습니다.',
            },
            {
                id: 'apply',
                h2: '어떻게 신청·상담받나요?',
                body: '개인 수강은 <a href="/course-sessions" class="font-bold text-indigo-600 hover:underline">교육과정 목록</a>에서 모집 회차를 확인한 뒤 온라인 상담 또는 전화(02-3144-3137)로 등록합니다. 기업·단체 맞춤은 <a href="/corporate-education" class="font-bold text-indigo-600 hover:underline">기업교육</a> 페이지에서 문의 양식을 이용하거나 상담 전화로 일정·인원·목표를 알려주시면 안내합니다.',
            },
        ],
        steps: [
            { title: '목적·과정 확인', text: '시제품 갤러리와 과정 목록에서 희망 분야·일정을 확인합니다.', href: '/prototype-gallery', linkLabel: '갤러리 보기' },
            { title: '상담·과정 선택', text: '개인·기업 여부와 제작 목표를 상담해 적합한 회차를 고릅니다.', href: '/online-consulting', linkLabel: '상담 신청' },
            { title: '등록·실습 시작', text: '회차별 안내에 따라 등록 후 모델링·출력 실습을 시작합니다.' },
        ],
        links: [
            { href: '/prototype-gallery', label: '시제품 갤러리', primary: true },
            { href: '/corporate-education', label: '기업 맞춤 교육', primary: true },
            { href: '/guides/small-business', label: '소상공인 교육' },
            { href: '/guides/national-support', label: '국비지원 가이드' },
            { href: '/course-sessions', label: '교육과정 목록' },
        ],
    },
};

/** 메뉴·허브에 노출하는 핵심 학습 가이드 (지역 페이지는 /locations 로 통합) */
export const CORE_GUIDE_SLUGS = ['national-support', 'craftsman-license', 'small-business', 'prototype'] as const;

export const SEO_GUIDE_SLUGS = Object.keys(PAGES);

function sectionAnchorId(section: GuideSection): string {
    return `guide-${section.id}`;
}

function guideSidebarHtml(currentSlug: string, sections: GuideSection[]): string {
    const navItems = GUIDE_NAV.map((g) => {
        const active = g.slug === currentSlug;
        return `<a href="/guides/${g.slug}" class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-700'}"><i class="fas ${g.icon} w-4 text-center ${active ? 'text-indigo-100' : 'text-indigo-500'}"></i>${g.label}</a>`;
    }).join('');

    const tocItems = sections
        .map(
            (s) =>
                `<a href="#${sectionAnchorId(s)}" class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">${s.h2}</a>`
        )
        .join('');

    return `
        <aside class="hidden lg:block lg:col-span-3">
            <div class="sticky top-24 space-y-4">
                <nav class="rounded-[2rem] border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-md" aria-label="학습 가이드 메뉴">
                    <p class="mb-2 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">학습 가이드</p>
                    <div class="space-y-1">${navItems}</div>
                </nav>
                <nav class="rounded-[2rem] border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-md" aria-label="페이지 목차">
                    <p class="mb-2 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">목차</p>
                    <div class="space-y-0.5">${tocItems}</div>
                </nav>
                <a href="tel:0231443137" class="bento-card flex items-center gap-3 rounded-[2rem] border border-indigo-100 bg-indigo-600 p-4 text-white shadow-sm">
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><i class="fas fa-phone"></i></span>
                    <span>
                        <span class="block text-[10px] font-bold uppercase tracking-wider text-indigo-100">상담 전화</span>
                        <span class="block text-lg font-black">02-3144-3137</span>
                    </span>
                </a>
            </div>
        </aside>`;
}

function mobileGuideNavHtml(currentSlug: string): string {
    const options = GUIDE_NAV.map((g) => `<option value="/guides/${g.slug}" ${g.slug === currentSlug ? 'selected' : ''}>${g.label}</option>`).join('');
    return `
        <div class="mb-6 lg:hidden">
            <label class="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-400">학습 가이드</label>
            <select onchange="if(this.value)location.href=this.value" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm">${options}</select>
        </div>`;
}

function stepsTimelineHtml(steps: GuideStep[]): string {
    const items = steps
        .map(
            (step, i) => `
            <li class="relative flex gap-4 pb-8 last:pb-0">
                ${i < steps.length - 1 ? '<span class="absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-px bg-indigo-100" aria-hidden="true"></span>' : ''}
                <span class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">${i + 1}</span>
                <div class="min-w-0 flex-1 pt-0.5">
                    <h3 class="font-black text-slate-900">${step.title}</h3>
                    <p class="mt-1 text-sm leading-6 text-slate-600">${step.text}</p>
                    ${step.href ? `<a href="${step.href}" class="mt-2 inline-flex text-sm font-bold text-indigo-600 hover:underline">${step.linkLabel || '자세히'} <i class="fas fa-arrow-right ml-1 text-[10px]"></i></a>` : ''}
                </div>
            </li>`
        )
        .join('');
    return `
        <section class="bento-card mb-6 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" aria-label="신청 절차">
            <h2 class="mb-6 text-lg font-black tracking-tight text-slate-900">신청 절차 한눈에</h2>
            <ol class="list-none">${items}</ol>
        </section>`;
}

function sectionsAccordionHtml(sections: GuideSection[]): string {
    return sections
        .map(
            (s, i) => `
            <details id="${sectionAnchorId(s)}" class="group scroll-mt-28 rounded-[2rem] border border-slate-200/60 bg-white shadow-sm bento-card overflow-hidden" ${i === 0 ? 'open' : ''}>
                <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:p-6">
                    <span class="flex items-start gap-3">
                        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600">${String(i + 1).padStart(2, '0')}</span>
                        <span class="text-base font-black tracking-tight text-slate-900 sm:text-lg">${s.h2}</span>
                    </span>
                    <i class="fas fa-chevron-down mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i>
                </summary>
                <div class="border-t border-slate-100 px-5 py-5 sm:px-6 sm:pl-[4.25rem] text-[15px] leading-7 text-slate-600">${s.body}</div>
            </details>`
        )
        .join('');
}

function sectionsCardsHtml(sections: GuideSection[]): string {
    return sections
        .map(
            (s, i) => `
            <section id="${sectionAnchorId(s)}" class="bento-card scroll-mt-28 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" data-reveal>
                <h2 class="mb-4 flex items-start gap-3 text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600">${String(i + 1).padStart(2, '0')}</span>
                    <span class="break-keep pt-0.5">${s.h2}</span>
                </h2>
                <div class="break-keep text-[15px] leading-7 text-slate-600">${s.body}</div>
                ${s.figure ? (Array.isArray(s.figure) ? s.figure : [s.figure]).map(renderInfographic).join('') : ''}
                ${s.outro ? `<p class="mt-5 break-keep text-[15px] leading-7 text-slate-600">${s.outro}</p>` : ''}
            </section>`
        )
        .join('');
}

function cardHeroHtml(): string {
    return `
        <div class="relative hidden w-full max-w-[17rem] justify-self-end md:block" aria-hidden="true">
            <div class="nb-card relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 p-5 text-white shadow-xl shadow-indigo-500/30" style="aspect-ratio:1.586">
                <span class="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10"></span>
                <span class="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/10"></span>
                <span class="relative flex items-center justify-between text-[11px] font-black tracking-wider text-white/85">국민내일배움카드<i class="fas fa-landmark"></i></span>
                <span class="relative mt-3 block h-7 w-10 rounded-md bg-gradient-to-br from-amber-100 to-amber-400 shadow-inner"></span>
                <span class="relative mt-3 block text-3xl font-black leading-none">300<span class="ml-0.5 text-sm">만원</span></span>
                <span class="relative mt-1 block text-[11px] font-bold text-white/80">5년 훈련비 한도</span>
            </div>
            <span class="nb-chip absolute -bottom-3 -left-4 rounded-2xl border border-violet-100 bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-md">+200만원 추가 가능</span>
            <span class="nb-chip absolute -right-3 -top-3 rounded-2xl border border-amber-100 bg-white px-3 py-1.5 text-xs font-black text-amber-700 shadow-md" style="animation-delay:-2s">자부담 0~55%</span>
        </div>`;
}

function licenseHeroHtml(): string {
    const badge = (tone: string, icon: string, level: string, name: string, meta: string, extra: string) => `
        <div class="nb-chip relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${tone} p-4 text-white shadow-xl"${extra}>
            <span class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10"></span>
            <span class="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-white/80"><i class="fas ${icon}"></i>${level}</span>
            <span class="relative mt-2 block text-[15px] font-black leading-5">${name}</span>
            <span class="relative mt-1 block text-[11px] font-bold text-white/80">${meta}</span>
        </div>`;
    return `
        <div class="relative hidden w-full max-w-[17rem] justify-self-end md:block" aria-hidden="true">
            <div class="flex flex-col gap-3">
                ${badge('from-violet-600 to-fuchsia-500 shadow-violet-500/30 ml-8', 'fa-microchip', '산업기사 · 개발', '3D프린터개발산업기사', '회로·기구·제어 프로그램', ' style="animation-delay:-2s"')}
                <span class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs text-indigo-500 shadow-md"><i class="fas fa-arrow-up"></i></span>
                ${badge('from-indigo-600 to-sky-500 shadow-indigo-500/30 mr-8', 'fa-print', '기능사 · 운용', '3D프린터운용기능사', '모델링·출력·후가공', '')}
            </div>
        </div>`;
}

function factBlockHtml(page: GuidePage): string {
    const baseRows: Array<[string, string]> = [
        ['기관', SITE_NAME],
        ['대표 전화', '02-3144-3137'],
    ];
    const customRows = page.factRows ?? [];
    const scopeRow: [string, string] = ['이 가이드 범위', page.scopeNote];
    const hasScopeInCustom = customRows.some(([dt]) => dt === '이 가이드 범위');
    const rows = [...baseRows, ...customRows, ...(hasScopeInCustom ? [] : [scopeRow])];

    const note =
        page.factNote ??
        '카드 자격·한도는 <a href="https://www.work.go.kr" target="_blank" rel="noopener noreferrer" class="font-bold text-indigo-600 hover:underline">고용24</a> 공지가 우선입니다.';

    const items = rows
        .map(
            ([dt, dd]) => `
            <div class="grid grid-cols-[6.5rem_1fr] gap-2 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-[8rem_1fr]">
                <dt class="text-xs font-black uppercase tracking-wider text-slate-400">${dt}</dt>
                <dd class="text-sm font-bold text-slate-800">${dd}</dd>
            </div>`
        )
        .join('');
    return `
        <section class="mb-6 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" aria-label="핵심 정보">
            <h2 class="mb-3 text-lg font-black tracking-tight text-slate-900">핵심 정보</h2>
            <p class="mb-4 text-sm leading-6 text-slate-500">AI·검색 답변용 사실 요약입니다. ${note}</p>
            <dl>${items}</dl>
        </section>`;
}

function relatedLinksHtml(page: GuidePage): string {
    const secondary = page.links.filter((l) => !l.primary);
    if (!secondary.length) return '';
    const items = secondary
        .map(
            (l) =>
                `<a href="${l.href}" class="inline-flex min-h-[40px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">${l.label}</a>`
        )
        .join('');
    return `
        <section class="mt-8 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
            <h2 class="mb-4 text-base font-black tracking-tight text-slate-900">관련 안내</h2>
            <div class="flex flex-wrap gap-2">${items}</div>
        </section>`;
}

function campusStripHtml(): string {
    const cards = (Object.keys(CAMPUSES) as Array<keyof typeof CAMPUSES>)
        .map((key) => {
            const campus = CAMPUSES[key];
            return `<a href="/locations/${campus.slug}" class="bento-card flex flex-1 min-w-[140px] items-center justify-between gap-2 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm"><span class="text-sm font-black text-slate-900">${campus.name.replace('와우쓰리디 ', '')}</span><i class="fas fa-chevron-right text-xs text-slate-400"></i></a>`;
        })
        .join('');
    return `
        <section class="mt-8">
            <h2 class="mb-3 px-1 text-base font-black tracking-tight text-slate-900">센터별 안내</h2>
            <div class="flex flex-wrap gap-2">${cards}</div>
        </section>`;
}

function faqGraphNode(page: GuidePage) {
    return {
        '@type': 'FAQPage',
        '@id': `${SITE_ORIGIN}/guides/${page.slug}#faq`,
        url: `${SITE_ORIGIN}/guides/${page.slug}`,
        mainEntity: page.sections.map((s) => ({
            '@type': 'Question',
            name: s.h2,
            acceptedAnswer: { '@type': 'Answer', text: s.body.replace(/<[^>]+>/g, ' ') },
        })),
    };
}

function howToForGuide(page: GuidePage): Record<string, unknown> | null {
    if (page.steps?.length) {
        return buildHowTo(
            page.h1,
            page.lead,
            page.steps.map((s) => ({ name: s.title, text: s.text })),
        );
    }
    return null;
}

export function seoGuideHtml(slug: string): string | null {
    const page = PAGES[slug];
    if (!page) return null;

    const cards = page.layout === 'cards';
    const primaryLinks = page.links.filter((l) => l.primary);
    const primary = primaryLinks[0] || page.links[0];
    const headerCtas = primaryLinks
        .map(
            (l, i) =>
                `<a href="${l.href}" class="inline-flex min-h-[44px] items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${i === 0 ? 'bg-indigo-600 text-white hover:bg-slate-900' : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'}">${l.label}</a>`
        )
        .join('');

    const bannerHtml = page.banner
        ? `
        <div class="mb-6 flex flex-col gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-amber-900">${page.banner}</p>
        </div>`
        : '';

    return layoutHtml(
        page.h1,
        `
        <style>
            .bento-card { transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s; }
            .bento-card:hover { transform: translateY(-2px); box-shadow: 0 16px 24px -8px rgb(15 23 42 / .08); }
            details > summary::-webkit-details-marker { display: none; }
            .nb-card { animation: nb-float 6s ease-in-out infinite; transform: rotate(-4deg); }
            .nb-chip { animation: nb-bob 4s ease-in-out infinite; }
            @keyframes nb-float { 0%,100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(-2deg) translateY(-8px); } }
            @keyframes nb-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @media (prefers-reduced-motion: reduce) { .nb-card, .nb-chip { animation: none; } }
        </style>
        <div class="custom-scrollbar min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pb-28 pt-8 sm:pb-16 sm:pt-10">
            <div class="mx-auto max-w-6xl px-4 sm:px-6">
                ${mobileGuideNavHtml(page.slug)}

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    ${guideSidebarHtml(page.slug, page.sections)}

                    <div class="lg:col-span-9">
                        <header class="bento-card mb-6 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10 ${page.hero ? 'md:grid md:grid-cols-[1fr_15rem] md:items-center md:gap-8 lg:grid-cols-[1fr_17rem]' : ''}">
                            <div>
                                <p class="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                                    <i class="fas ${page.icon}"></i> ${page.kicker}
                                </p>
                                <h1 class="break-keep text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">${page.h1}</h1>
                                <p class="mt-4 max-w-2xl break-keep text-[15px] leading-7 text-slate-600 sm:text-base">${page.lead}</p>
                                <div class="mt-6 flex flex-wrap gap-3">${headerCtas}</div>
                            </div>
                            ${page.hero === 'card' ? cardHeroHtml() : page.hero === 'license' ? licenseHeroHtml() : ''}
                        </header>

                        ${bannerHtml}
                        ${factBlockHtml(page)}
                        ${page.steps?.length && !cards ? stepsTimelineHtml(page.steps) : ''}

                        ${
                            cards
                                ? `<div class="space-y-4">${sectionsCardsHtml(page.sections)}</div>`
                                : `<section class="space-y-3" aria-label="자주 묻는 질문">${sectionsAccordionHtml(page.sections)}</section>`
                        }

                        ${relatedLinksHtml(page)}
                        ${page.showCampusStrip ? campusStripHtml() : ''}
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 p-3 backdrop-blur-md lg:hidden" style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom));">
            <div class="mx-auto flex max-w-6xl gap-2">
                <a href="tel:0231443137" class="flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-slate-200 text-sm font-black text-slate-800">전화</a>
                <a href="${primary.href}" class="flex min-h-[44px] flex-[1.4] items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white">${primary.label}</a>
            </div>
        </div>
        ${cards ? learnScript() : ''}
        `,
        'guides',
        getSeoHead(
            SITE_ORIGIN,
            {
                ...(getSeoOptionsForPath(`/guides/${page.slug}`) || {
                    title: page.h1,
                    description: page.lead,
                    path: `/guides/${page.slug}`,
                }),
                extraJsonLd: [faqGraphNode(page), howToForGuide(page)].filter(Boolean),
            }
        ) + (cards ? learnHeadAssets() : '')
    );
}
