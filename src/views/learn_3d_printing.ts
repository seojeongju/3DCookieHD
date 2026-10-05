import { layoutHtml } from './components/layout';
import { breadcrumbsForPath, getSeoHead, getSeoOptionsForPath, SITE_NAME, SITE_ORIGIN } from '../utils/seo';
import {
    collectGlossaryKeys,
    glossaryJsonLd,
    glossarySectionHtml,
    layerHeroSvg,
    learnHeadAssets,
    learnScript,
    renderInfographic,
    term,
    type Infographic,
} from './components/learn_infographics';

type LearnSection = { id: string; h2: string; html: string; figure?: Infographic | Infographic[]; outro?: string };
type LearnFaq = { q: string; a: string };
type LearnTable = { caption: string; head: string[]; rows: string[][]; note?: string };

type LearnPage = {
    topic: '' | 'history' | 'process' | 'materials' | 'safety';
    navLabel: string;
    icon: string;
    kicker: string;
    h1: string;
    hero?: 'layers';
    /** 첫 화면 요약 — 검색·AI 답변에 그대로 인용될 수 있도록 2~3문장으로 정의부터 */
    summary: string;
    keyFacts: Array<[string, string]>;
    sections: LearnSection[];
    table?: LearnTable;
    /** 표를 몇 번째 섹션 뒤에 넣을지 (0부터) */
    tableAfter?: number;
    faqs: LearnFaq[];
};

export const LEARN_BASE_PATH = '/guides/3d-printing';
const PUBLISHED = '2026-10-05';
const MODIFIED = '2026-10-05';

const strong = (t: string) => `<strong class="text-slate-800">${t}</strong>`;
const link = (href: string, label: string) =>
    `<a href="${href}" class="font-bold text-indigo-600 hover:underline">${label}</a>`;
const list = (items: string[]) =>
    `<ul class="mt-3 space-y-2">${items
        .map((i) => `<li class="flex gap-2"><i class="fas fa-circle mt-2 text-[5px] text-indigo-400" aria-hidden="true"></i><span>${i}</span></li>`)
        .join('')}</ul>`;

const PAGES: LearnPage[] = [
    {
        topic: '',
        navLabel: '3D프린팅 개요',
        icon: 'fa-cube',
        kicker: '3D프린팅 기초',
        h1: '3D프린팅이란? 원리·작업 과정·활용 분야 한눈에 보기',
        hero: 'layers',
        summary:
            '3D프린팅은 컴퓨터로 만든 3D 모델 데이터를 바탕으로 재료를 한 층씩 쌓아 올려 입체 형상을 만드는 제조 기술입니다. 국제 표준(ISO/ASTM 52900)에서는 공식 용어로 <strong>적층 제조(Additive Manufacturing, AM)</strong>라고 부르며, 재료를 깎아 내는 절삭 가공과 반대되는 방식입니다.',
        keyFacts: [
            ['공식 용어', '적층 제조(Additive Manufacturing, AM)'],
            ['국제 표준', 'ISO/ASTM 52900 (용어·7가지 공정 분류)'],
            ['기본 원리', '3D 데이터를 얇은 층으로 나눈 뒤 한 층씩 쌓아 올림'],
            ['작업 흐름', '3D 모델링 → 슬라이싱 → 출력 → 후가공'],
            ['관련 국가자격', '3D프린터운용기능사'],
        ],
        sections: [
            {
                id: 'definition',
                h2: '3D프린팅은 어떤 원리로 만드나요?',
                html: `3D프린터는 입체 모델을 아주 얇은 수평 단면(${term('레이어')})으로 잘라, 바닥부터 한 층씩 재료를 굳히거나 붙여 형상을 완성합니다. 한 층의 두께는 방식에 따라 보통 0.025~0.3mm 정도이며, 층이 얇을수록 표면이 매끈해지지만 출력 시간은 길어집니다. 물건을 만드는 방식은 크게 세 가지로 나뉘고, 3D프린팅은 그중 ${term('적층 제조')}에 해당합니다.`,
                figure: {
                    kind: 'methods',
                    caption: '같은 부품이라도 깎을지, 틀에 부을지, 쌓을지에 따라 비용·속도·형상 자유도가 달라집니다.',
                    items: [
                        {
                            visual: 'subtractive',
                            name: '절삭 가공',
                            en: 'Subtractive',
                            summary: 'CNC처럼 덩어리 재료를 공구로 깎아 내 형상을 만듭니다.',
                            facts: [['재료', '덩어리에서 덜어 냄'], ['대표 장비', 'CNC·선반'], ['강점', '높은 정밀도']],
                        },
                        {
                            visual: 'formative',
                            name: '성형 가공',
                            en: 'Formative',
                            summary: '사출·주조처럼 금형에 녹인 재료를 채워 굳힙니다.',
                            facts: [['재료', '금형에 채움'], ['대표 장비', '사출기·주조'], ['강점', '대량 생산 단가']],
                        },
                        {
                            visual: 'additive',
                            name: '적층 제조',
                            en: 'Additive',
                            summary: '필요한 곳에만 재료를 한 층씩 쌓아 올립니다.',
                            facts: [['재료', '필요한 만큼 쌓음'], ['대표 장비', '3D프린터'], ['강점', '복잡한 형상·소량']],
                            highlight: true,
                        },
                    ],
                },
            },
            {
                id: 'workflow',
                h2: '3D프린팅 작업은 어떤 순서로 진행되나요?',
                html: `실무와 교육 현장에서는 아이디어를 실물로 만들 때 아래 5단계를 거칩니다. 출력 결과가 마음에 들지 않으면 모델링이나 ${term('슬라이싱')} 단계로 돌아가 설정을 고치고 다시 출력합니다.`,
                figure: {
                    kind: 'flow',
                    caption: '대부분의 출력 실패는 ③ 슬라이싱 설정(온도·서포트·인필)에서 원인을 찾을 수 있습니다.',
                    steps: [
                        { icon: 'fa-pen-ruler', title: '3D 모델링', desc: `Fusion 360·인벤터·블렌더로 설계하거나 3D 스캐너로 실물을 데이터화`, chips: ['CAD', '스캔'] },
                        { icon: 'fa-file-export', title: '파일 변환', desc: `표면을 삼각형 ${term('메시')}로 바꾼 출력용 파일로 내보내기`, chips: ['STL', '3MF', 'OBJ'] },
                        { icon: 'fa-layer-group', title: '슬라이싱', desc: `${term('슬라이서')}에서 레이어 높이·${term('인필')}·${term('서포트')}·온도 설정`, chips: ['G-code'] },
                        { icon: 'fa-print', title: '출력', desc: '프린터가 명령 파일대로 한 층씩 쌓아 형상 완성', chips: ['FDM', 'SLA'] },
                        { icon: 'fa-wand-magic-sparkles', title: '후가공', desc: '서포트 제거, 세척·2차 경화, 샌딩·도색으로 마감', chips: ['마감'] },
                    ],
                },
                outro: `이 흐름은 ${link('/guides/craftsman-license', '3D프린터운용기능사')} 실기 시험의 과제 구성(모델링 → 슬라이싱 → 출력 → ${term('후가공')})과도 같습니다. 파일 형식은 가장 널리 쓰이는 ${term('STL')}과, 색상·출력 설정까지 담는 ${term('3MF')}를 먼저 익혀 두면 좋습니다. 슬라이서가 만든 ${term('G-code')}를 열어 보면 노즐이 움직일 좌표가 한 줄씩 적혀 있습니다.`,
            },
            {
                id: 'pros-cons',
                h2: '3D프린팅의 장점과 한계는 무엇인가요?',
                html: '3D프린팅은 "적게, 다르게, 빠르게" 만들 때 강하고, "많이, 똑같이" 만들 때는 기존 가공 방식이 유리합니다. 용도에 따라 장점과 한계를 함께 따져 보세요.',
                figure: {
                    kind: 'balance',
                    caption: '시제품·맞춤 제품은 3D프린팅, 같은 제품 수천 개 이상은 사출 성형이 일반적으로 유리합니다.',
                    pros: [
                        { icon: 'fa-bolt', title: '금형 없이 바로 제작', desc: '시제품·소량 생산의 비용과 기간이 크게 줄어듭니다.' },
                        { icon: 'fa-shapes', title: '복잡한 형상', desc: '내부 격자, 일체형 부품처럼 깎거나 붓기 어려운 형상도 만듭니다.' },
                        { icon: 'fa-user-gear', title: '맞춤 제작', desc: '치과 교정장치, 보조기처럼 사람마다 다른 제품을 만들기 쉽습니다.' },
                        { icon: 'fa-leaf', title: '재료 절약', desc: '필요한 곳에만 재료를 써서 버려지는 양이 적습니다.' },
                    ],
                    cons: [
                        { icon: 'fa-boxes-stacked', title: '대량 생산 단가', desc: '같은 제품을 많이 만들면 사출 성형보다 개당 비용·시간이 불리합니다.' },
                        { icon: 'fa-grip-lines', title: '적층 줄무늬', desc: '층이 쌓인 결이 표면에 남아 후가공이 필요한 경우가 많습니다.' },
                        { icon: 'fa-arrows-up-down', title: `Z축 강도 (${term('이방성')})`, desc: '층 사이 결합이 약해 쌓는 방향으로 힘을 받으면 쉽게 갈라집니다.' },
                        { icon: 'fa-maximize', title: `출력 크기 (${term('빌드 볼륨')})`, desc: '장비가 출력할 수 있는 최대 크기 안에서만 한 번에 만들 수 있습니다.' },
                    ],
                },
            },
            {
                id: 'applications',
                h2: '3D프린팅은 어디에 쓰이나요?',
                html: '시제품 제작에서 시작한 3D프린팅은 이제 의료, 항공, 생활 소품까지 쓰임이 넓어졌습니다. 대표적인 6개 분야는 다음과 같습니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '관심 분야를 먼저 정하면 배워야 할 출력 방식과 소재의 우선순위가 분명해집니다.',
                    items: [
                        { icon: 'fa-lightbulb', tone: 'indigo', title: '제품 개발·시제품', desc: '디자인 검증, 조립 확인, 기능 테스트용 시제품', href: '/guides/prototype', linkLabel: '시제품 제작 교육' },
                        { icon: 'fa-tooth', tone: 'sky', title: '의료·치과', desc: '투명 교정장치 모형, 수술 가이드, 환자 맞춤 보조기' },
                        { icon: 'fa-plane', tone: 'violet', title: '항공·자동차', desc: '경량 부품, 지그·고정구, 금속 적층 부품' },
                        { icon: 'fa-graduation-cap', tone: 'emerald', title: '교육·메이커', desc: '학교·직업훈련 실습, 개인 창작 활동' },
                        { icon: 'fa-cookie-bite', tone: 'amber', title: '소상공인·생활', desc: '쿠키틀, 스텐실, 실리콘 몰드 원형, 매장 소품', href: '/guides/small-business', linkLabel: '소상공인 활용 교육' },
                        { icon: 'fa-building', tone: 'rose', title: '건축·디자인', desc: '건축 모형, 조명·가구 디자인, 주얼리 주조용 원형' },
                    ],
                },
            },
            {
                id: 'next',
                h2: '처음 배우는 사람은 무엇부터 공부하면 좋나요?',
                html: `먼저 ${link(`${LEARN_BASE_PATH}/process`, '출력 방식')}과 ${link(`${LEARN_BASE_PATH}/materials`, '출력 소재')}의 차이를 이해하고, 입문용으로 가장 많이 쓰이는 FDM 방식 프린터와 PLA 소재로 출력을 경험해 보는 것을 권합니다. 그다음 3D 모델링 프로그램 한 가지를 익히면 원하는 형상을 직접 만들 수 있습니다. 기술의 발전 과정이 궁금하다면 ${link(`${LEARN_BASE_PATH}/history`, '3D프린팅의 역사')}를 참고하세요. 처음 프린터를 다루기 전에는 ${link(`${LEARN_BASE_PATH}/safety`, '3D프린팅 안전 수칙')}을 꼭 먼저 읽어 보세요.`,
            },
        ],
        faqs: [
            {
                q: '3D프린팅과 적층 제조는 같은 말인가요?',
                a: '네, 같은 기술을 가리킵니다. 적층 제조(Additive Manufacturing)는 국제 표준에서 쓰는 공식 용어이고, 3D프린팅은 일반적으로 널리 쓰이는 이름입니다.',
            },
            {
                q: '3D프린터로 무엇이든 만들 수 있나요?',
                a: '형상 면에서는 자유도가 높지만, 장비의 출력 크기·소재·정밀도에 따라 만들 수 있는 범위가 정해집니다. 강도나 내열성이 필요한 부품은 출력 방식과 소재를 용도에 맞게 골라야 합니다.',
            },
            {
                q: '3D프린팅을 배우려면 어떤 프로그램이 필요한가요?',
                a: '형상을 설계하는 3D 모델링 프로그램(예: Fusion 360)과 출력 설정을 하는 슬라이서 프로그램(예: Cura)이 기본입니다. 두 가지 모두 무료 또는 교육용 라이선스로 시작할 수 있습니다.',
            },
            {
                q: '3D프린팅 관련 국가자격증이 있나요?',
                a: '국가기술자격으로 3D프린터운용기능사가 있습니다. 모델링, 슬라이싱, 출력, 후가공 등 3D프린터 운용 실무 능력을 평가합니다. 시험 일정과 응시 자격은 큐넷(Q-Net) 공지를 확인하세요.',
            },
        ],
    },
    {
        topic: 'history',
        navLabel: '3D프린팅의 역사',
        icon: 'fa-clock-rotate-left',
        kicker: '3D프린팅 기초',
        h1: '3D프린팅의 역사: 1980년대 발명부터 대중화까지',
        summary:
            '3D프린팅은 1980년대 초 광경화 수지를 층층이 굳히는 연구에서 시작되어, 1986년 찰스 헐(Chuck Hull)이 광조형(SLA) 특허를 받으면서 상업화되었습니다. 이후 SLS·FDM 방식이 등장했고, 2009년 전후 FDM 핵심 특허가 만료되면서 저가형 데스크톱 3D프린터가 빠르게 대중화되었습니다.',
        keyFacts: [
            ['기술의 출발', '1980년대 초 광경화 적층 연구'],
            ['최초 상용 방식', '광조형(SLA) — 찰스 헐, 3D Systems'],
            ['STL 파일 형식', '1980년대 후반 3D Systems가 도입'],
            ['대중화 계기', 'FDM 특허 만료(2009년 전후)와 RepRap 오픈소스'],
            ['국내 제도화', '「삼차원프린팅산업 진흥법」 제정(2015년)'],
        ],
        sections: [
            {
                id: 'timeline',
                h2: '3D프린팅의 역사를 한눈에 보면 어떤가요?',
                html: `3D프린팅의 40여 년 역사는 ${strong('발명 → 산업용 시제품 → 대중화 → 생산·자동화')}의 네 시기로 나눌 수 있습니다. 위쪽 시대 버튼을 누르면 해당 구간으로 이동합니다.`,
                figure: {
                    kind: 'timeline',
                    caption: '연도는 특허 출원·등록·발표 시점에 따라 자료마다 1~2년 차이가 날 수 있습니다.',
                    eras: [
                        {
                            period: '1980년대',
                            title: '발명의 시대',
                            icon: 'fa-lightbulb',
                            tone: 'amber',
                            summary: '빛으로 수지를 굳히는 아이디어에서 출발해 지금도 쓰이는 핵심 방식이 잇따라 탄생했습니다.',
                            events: [
                                { year: '1981', title: '고다마 히데오, 광경화 적층 방법 발표', desc: '일본 나고야시 공업연구소. 특허로 이어지지는 못했습니다.' },
                                { year: '1984~1986', title: '찰스 헐, 광조형(SLA) 특허 출원·등록', desc: '3D Systems를 설립해 상업화의 길을 열었습니다.', turning: true },
                                { year: '1980년대 후반', title: `첫 상용 SLA 장비 출시 · ${term('STL')} 파일 형식 도입`, desc: `분말을 레이저로 ${term('소결')}하는 SLS 방식도 개발되었습니다.` },
                                { year: '1989', title: '스콧 크럼프, FDM 특허 출원', desc: '스트라타시스(Stratasys)를 설립했습니다.' },
                            ],
                        },
                        {
                            period: '1990~2000년대',
                            title: '산업용 시제품',
                            icon: 'fa-industry',
                            tone: 'indigo',
                            summary: `수천만~수억 원대 장비로, 기업의 ${term('래피드 프로토타이핑')}에 주로 쓰였습니다.`,
                            events: [
                                { year: '1990년대 초', title: 'MIT, 바인더 젯팅 개발', desc: '"3D Printing"이라는 이름이 이때 쓰이기 시작했습니다.' },
                                { year: '1990~2000년대', title: '자동차·가전·항공 분야 시제품 제작에 확산', desc: '금형을 만들기 전에 형태와 조립을 미리 확인하는 용도였습니다.' },
                                { year: '2005', title: 'RepRap 오픈소스 프린터 프로젝트 시작', desc: '영국 배스대학교 에이드리언 보이어. 설계를 누구나 쓸 수 있게 공개했습니다.' },
                            ],
                        },
                        {
                            period: '2009~2010년대 중반',
                            title: '대중화',
                            icon: 'fa-users',
                            tone: 'emerald',
                            summary: '특허 만료와 오픈소스가 맞물리며 3D프린터가 가정·학교로 들어왔습니다.',
                            events: [
                                { year: '2009년 전후', title: 'FDM 핵심 특허 만료', desc: `RepRap 기반 저가형 데스크톱 프린터가 쏟아지고 ${term('FFF')}라는 이름도 쓰이기 시작했습니다.`, turning: true },
                                { year: '2010년대 초', title: '데스크톱 광중합(SLA) 프린터 등장', desc: '크라우드펀딩으로 개인용 레진 프린터가 나왔습니다.' },
                                { year: '2014년 무렵', title: 'SLS 핵심 특허 만료 · 국내 산업 발전 전략 발표', desc: '분말 방식 장비의 가격도 낮아지기 시작했습니다.' },
                                { year: '2015', title: '「삼차원프린팅산업 진흥법」 제정', desc: '국내 산업 육성과 안전 관리의 법적 근거가 마련되었습니다.' },
                            ],
                        },
                        {
                            period: '2010년대 후반~현재',
                            title: '생산·자동화',
                            icon: 'fa-rocket',
                            tone: 'violet',
                            summary: '시제품을 넘어 최종 제품을 직접 생산하는 단계로 나아가고 있습니다.',
                            events: [
                                { year: '최근', title: '금속 적층으로 항공·의료 부품 직접 생산' },
                                { year: '최근', title: '고속 분말 방식(MJF 등)으로 나일론 부품 소량 양산' },
                                { year: '최근', title: '건설용 대형 프린터, AI 모델 생성·불량 자동 감지' },
                            ],
                        },
                    ],
                },
            },
            {
                id: 'origin',
                h2: '3D프린팅은 언제, 누가 처음 만들었나요?',
                html: `1981년 일본 나고야시 공업연구소의 고다마 히데오(小玉秀男)가 자외선으로 수지를 한 층씩 굳혀 입체를 만드는 방법을 발표했지만 특허로 이어지지는 못했습니다. 1984년 미국의 ${strong('찰스 헐(Chuck Hull)')}이 광조형(Stereolithography, SLA) 특허를 출원해 1986년에 등록했고, 같은 해 3D Systems를 설립해 1980년대 후반 첫 상용 SLA 장비를 내놓았습니다. 그래서 찰스 헐은 흔히 "3D프린팅의 아버지"로 불립니다.`,
                figure: {
                    kind: 'balance',
                    labels: { good: '찰스 헐 (미국)', bad: '고다마 히데오 (일본)', goodIcon: 'fa-certificate', badIcon: 'fa-file-lines', hideCount: true },
                    caption: '먼저 발표한 사람과 특허·상업화로 이어간 사람이 달라, "최초 발명자"를 이야기할 때 두 사람이 함께 언급됩니다.',
                    pros: [
                        { icon: 'fa-stamp', title: '1984년 출원 · 1986년 등록', desc: '광조형(SLA) 특허를 받았습니다.' },
                        { icon: 'fa-building', title: '3D Systems 설립', desc: '1980년대 후반 첫 상용 SLA 장비를 내놓았습니다.' },
                        { icon: 'fa-crown', title: '"3D프린팅의 아버지"', desc: '상업화를 이끈 공로로 흔히 이렇게 불립니다.' },
                    ],
                    cons: [
                        { icon: 'fa-flask', title: '1981년 발표', desc: '자외선으로 수지를 한 층씩 굳히는 방법을 먼저 발표했습니다.' },
                        { icon: 'fa-hourglass-half', title: '특허로는 이어지지 못함', desc: '그래서 상업화의 출발점은 찰스 헐의 SLA가 되었습니다.' },
                        { icon: 'fa-book-open', title: '기록으로 남은 선구자', desc: '최초 발명자를 다룰 때 함께 소개됩니다.' },
                    ],
                },
            },
            {
                id: 'three-methods',
                h2: '주요 출력 방식은 어떻게 등장했나요?',
                html: '1980년대 후반부터 1990년대 초까지, 지금도 쓰이는 핵심 방식이 잇따라 개발되었습니다. 방식마다 만든 사람과 회사가 다릅니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '카드를 누르면 출력 방식 페이지에서 각 방식의 원리를 그림으로 볼 수 있습니다.',
                    items: [
                        { icon: 'fa-sun', tone: 'violet', title: 'SLA (광조형) — 찰스 헐', desc: '1986년 특허 등록, 3D Systems 설립. 레이저로 액체 수지를 한 층씩 굳히는 방식입니다.', href: `${LEARN_BASE_PATH}/process#vat`, linkLabel: '원리 보기' },
                        { icon: 'fa-braille', tone: 'sky', title: 'SLS (선택적 레이저 소결) — 칼 데커드', desc: '미국 텍사스대학교(오스틴)에서 개발. 레이저로 분말을 녹여 붙이는 방식입니다.', href: `${LEARN_BASE_PATH}/process#powder`, linkLabel: '원리 보기' },
                        { icon: 'fa-pen-nib', tone: 'indigo', title: 'FDM (재료 압출) — 스콧 크럼프', desc: '1989년 특허 출원, 스트라타시스 설립. 녹인 플라스틱을 노즐로 쌓는 방식입니다.', href: `${LEARN_BASE_PATH}/process#extrusion`, linkLabel: '원리 보기' },
                        { icon: 'fa-spray-can', tone: 'amber', title: '바인더 젯팅 — MIT 연구진', desc: '1990년대 초 개발. 분말 위에 결합제를 분사하는 방식으로, "3D Printing"이라는 이름이 여기서 쓰였습니다.', href: `${LEARN_BASE_PATH}/process#others`, linkLabel: '원리 보기' },
                    ],
                },
                outro: `당시 장비는 수천만 원에서 수억 원대로, 주로 기업의 시제품 제작(${term('래피드 프로토타이핑')})에 쓰였습니다.`,
            },
            {
                id: 'popularization',
                h2: '3D프린터는 어떻게 대중화되었나요?',
                html: `2005년 영국 배스대학교의 에이드리언 보이어(Adrian Bowyer)가 스스로 부품을 복제하는 ${term('오픈소스 하드웨어', '오픈소스')} 3D프린터 프로젝트 ${strong('RepRap')}을 시작했습니다. 2009년 전후 FDM 관련 핵심 특허가 만료되자 RepRap 설계를 바탕으로 한 저가형 데스크톱 프린터가 쏟아져 나왔습니다. 이때 스트라타시스의 상표인 "FDM" 대신 같은 원리를 가리키는 ${term('FFF')}(Fused Filament Fabrication)라는 이름도 함께 쓰이기 시작했습니다.`,
                figure: {
                    kind: 'flow',
                    caption: '오픈소스 설계와 특허 만료가 함께 작용하면서, 3D프린터는 산업용 장비에서 개인용 도구로 바뀌었습니다.',
                    steps: [
                        { icon: 'fa-code-branch', title: '설계 공개', desc: 'RepRap이 프린터 설계를 누구나 쓸 수 있게 공개했습니다', chips: ['2005', 'RepRap'] },
                        { icon: 'fa-unlock', title: '핵심 특허 만료', desc: 'FDM 원리를 누구나 쓸 수 있게 되었습니다', chips: ['2009 전후'] },
                        { icon: 'fa-boxes-stacked', title: '저가 장비 쏟아짐', desc: '많은 업체가 RepRap 기반 데스크톱 프린터를 내놓았습니다', chips: ['FFF'] },
                        { icon: 'fa-school', title: '가정·학교 보급', desc: '개인과 교육 현장에서도 3D프린터를 쓰게 되었습니다', chips: ['대중화'] },
                    ],
                },
                outro: '2010년대 초에는 크라우드펀딩으로 데스크톱 광경화(SLA) 프린터가 등장했고, 2014년 무렵 SLS 핵심 특허도 만료되면서 분말 방식 장비의 가격도 낮아지기 시작했습니다.',
            },
            {
                id: 'industrial',
                h2: '최근 3D프린팅은 어떤 방향으로 발전하고 있나요?',
                html: `시제품 제작을 넘어 ${strong('최종 제품 생산')}으로 활용이 넓어지고 있습니다.`,
                figure: {
                    kind: 'iconGrid',
                    caption: '공통된 흐름은 "한 개를 빨리 만드는 도구"에서 "필요한 만큼 직접 생산하는 도구"로의 변화입니다.',
                    items: [
                        { icon: 'fa-plane-up', tone: 'rose', title: '금속 최종 부품', desc: '금속 분말 적층(SLM·DMLS)으로 항공기 엔진 부품, 의료용 임플란트를 직접 생산합니다.' },
                        { icon: 'fa-boxes-stacked', tone: 'sky', title: '소량 양산', desc: 'HP 멀티젯 퓨전(MJF) 등 고속 분말 방식으로 나일론 부품을 소량 양산합니다.' },
                        { icon: 'fa-building', tone: 'amber', title: '건설', desc: '대형 프린터로 콘크리트 구조물을 출력합니다.' },
                        { icon: 'fa-robot', tone: 'violet', title: 'AI·자동화', desc: 'AI 기반 3D 모델 생성, 출력 불량 자동 감지 등 소프트웨어 자동화가 진행 중입니다.' },
                    ],
                },
            },
            {
                id: 'korea',
                h2: '우리나라의 3D프린팅 산업과 교육은 어떻게 발전했나요?',
                html: `정부는 2014년 3D프린팅 산업 발전 전략을 발표하고, 2015년 「삼차원프린팅산업 진흥법」을 제정해 산업 육성과 안전 관리의 법적 근거를 마련했습니다. 이후 3D프린터운용기능사 등 국가기술자격이 신설되고, 국민내일배움카드 직업훈련 과정에서도 3D프린팅·3D모델링 교육이 운영되고 있습니다.`,
                figure: {
                    kind: 'flow',
                    caption: '산업 육성 정책이 자격 제도와 직업훈련으로 이어지면서, 3D프린팅은 배워서 취업·창업에 활용하는 직무 기술이 되었습니다.',
                    steps: [
                        { icon: 'fa-chart-line', title: '산업 발전 전략', desc: '정부가 3D프린팅 산업 발전 전략을 발표했습니다', chips: ['2014'] },
                        { icon: 'fa-scale-balanced', title: '진흥법 제정', desc: '「삼차원프린팅산업 진흥법」으로 육성·안전 관리 근거 마련', chips: ['2015'] },
                        { icon: 'fa-id-card', title: '국가기술자격', desc: '3D프린터운용기능사 등 자격이 신설되었습니다', chips: ['자격'] },
                        { icon: 'fa-graduation-cap', title: '직업훈련 확산', desc: '국민내일배움카드 과정에서 3D프린팅·모델링 교육 운영', chips: ['국비 지원'] },
                    ],
                },
                outro: `와우쓰리디의 국비 과정은 ${link('/guides/national-support', '국비지원 가이드')}에서 확인할 수 있습니다.`,
            },
        ],
        faqs: [
            {
                q: '3D프린터를 처음 발명한 사람은 누구인가요?',
                a: '최초의 상용 3D프린팅 기술인 광조형(SLA)을 특허로 등록하고 상업화한 미국의 찰스 헐(Chuck Hull)이 흔히 발명자로 꼽힙니다. 그보다 앞선 1981년 일본의 고다마 히데오가 비슷한 원리를 발표한 기록도 있습니다.',
            },
            {
                q: 'FDM과 FFF는 다른 방식인가요?',
                a: '원리는 같습니다. FDM은 스트라타시스의 상표이고, FFF(Fused Filament Fabrication)는 같은 압출 적층 방식을 상표 없이 부르는 이름입니다.',
            },
            {
                q: '3D프린터 가격이 갑자기 낮아진 이유는 무엇인가요?',
                a: '2009년 전후 FDM 핵심 특허가 만료되고, RepRap 같은 오픈소스 설계가 공유되면서 많은 업체가 저가형 장비를 만들 수 있게 되었기 때문입니다.',
            },
        ],
    },
    {
        topic: 'process',
        navLabel: '출력 방식',
        icon: 'fa-layer-group',
        kicker: '3D프린팅 기초',
        h1: '3D프린팅 출력 방식 7가지 비교: FDM·SLA·SLS 차이',
        summary:
            '국제 표준 ISO/ASTM 52900은 3D프린팅을 재료 압출, 광중합, 분말 융접, 재료 분사, 접착제 분사, 고에너지 직접 적층, 시트 적층의 7가지 방식으로 분류합니다. 입문·교육용으로는 필라멘트를 녹여 쌓는 FDM(재료 압출)이, 정밀한 소형 출력에는 레진을 빛으로 굳히는 SLA·DLP(광중합)가, 튼튼한 기능 부품에는 분말을 녹이는 SLS(분말 융접)가 주로 쓰입니다.',
        keyFacts: [
            ['분류 기준', 'ISO/ASTM 52900 — 7가지 공정'],
            ['가장 보편적인 방식', 'FDM/FFF (재료 압출)'],
            ['고정밀 소형 출력', 'SLA·DLP·LCD (광중합)'],
            ['서포트 없는 기능 부품', 'SLS·MJF (분말 융접)'],
            ['금속 출력', 'SLM·DMLS(분말 융접), DED, 바인더 젯팅'],
        ],
        sections: [
            {
                id: 'map',
                h2: '3D프린팅 방식 7가지는 어떻게 나뉘나요?',
                html: `7가지 방식은 ${strong('어떤 형태의 재료를')} ${strong('어떻게 굳히거나 붙이는지')}로 구분됩니다. 재료 형태별로 묶어 보면 한눈에 정리됩니다.`,
                figure: {
                    kind: 'processMap',
                    caption: '번호는 ISO/ASTM 52900의 7가지 공정입니다. 교육 현장에서 가장 많이 쓰는 방식은 01 재료 압출(FDM)입니다.',
                    groups: [
                        { form: '고체 필라멘트', icon: 'fa-circle-nodes', items: [{ name: '재료 압출', tech: 'FDM · FFF', how: '녹인 플라스틱을 노즐로 짜내며 쌓기', highlight: true }] },
                        {
                            form: '액체 수지',
                            icon: 'fa-droplet',
                            items: [
                                { name: '광중합', tech: 'SLA · DLP · LCD', how: '수조의 레진에 빛을 비춰 한 층씩 굳히기' },
                                { name: '재료 분사', tech: '폴리젯 · 멀티젯', how: '잉크젯처럼 수지 방울을 뿌리고 UV로 굳히기' },
                            ],
                        },
                        {
                            form: '분말',
                            icon: 'fa-braille',
                            items: [
                                { name: '분말 융접', tech: 'SLS · MJF · SLM · DMLS', how: '깔아 둔 분말을 레이저·열로 녹여 붙이기' },
                                { name: '접착제 분사', tech: '바인더 젯팅', how: '분말 위에 결합제를 뿌려 굳히기' },
                            ],
                        },
                        { form: '금속 와이어·분말 공급', icon: 'fa-fire-flame-curved', items: [{ name: '고에너지 직접 적층', tech: 'DED · WAAM', how: '재료를 공급하면서 레이저·아크로 녹여 쌓기' }] },
                        { form: '얇은 시트', icon: 'fa-note-sticky', items: [{ name: '시트 적층', tech: 'LOM · UAM', how: '종이·필름·금속 박판을 붙이고 잘라 쌓기' }] },
                    ],
                },
            },
            {
                id: 'extrusion',
                h2: 'FDM(재료 압출) 방식은 어떻게 출력하나요?',
                html: `실 형태의 플라스틱 ${term('필라멘트')}를 가열된 ${term('노즐')}에서 녹여 짜내며 한 층씩 쌓습니다. 장비와 소재가 저렴하고 사용이 쉬워 가정·학교·직업훈련에서 가장 많이 쓰이며, ${link('/guides/craftsman-license', '3D프린터운용기능사')} 실기에서도 이 방식의 프린터를 다룹니다.`,
                figure: [
                    {
                        kind: 'schematic',
                        visual: 'fdm',
                        caption: '장비에 따라 베드가 움직이는 방식과 노즐이 움직이는 방식(코어XY 등)이 있지만, 녹여서 쌓는 원리는 같습니다.',
                        labels: [
                            { title: '필라멘트 스풀', desc: '지름 1.75mm 플라스틱 실이 감겨 있고, 압출기가 조금씩 당겨 보냅니다.' },
                            { title: '핫엔드(가열부)', desc: '히터가 소재별 온도(PLA 약 200℃)로 필라멘트를 녹입니다.' },
                            { title: '노즐', desc: '보통 지름 0.4mm 구멍으로 녹은 재료를 가늘게 짜냅니다.' },
                            { title: term('히트베드'), desc: '바닥판을 데워 첫 층이 잘 붙고 모서리가 들뜨지 않게 합니다.' },
                        ],
                    },
                    { kind: 'fdmSettings', caption: '출력 품질은 레이어 높이·인필 외에도 노즐·베드 온도, 출력 속도, 서포트 설정에 따라 달라집니다.' },
                ],
                outro: `${strong('장점')}은 저렴한 장비·소재와 다양한 소재 선택, 큰 출력물 제작이고, ${strong('단점')}은 적층 줄무늬가 보이고 미세한 디테일과 Z축 강도가 상대적으로 약하다는 점입니다.`,
            },
            {
                id: 'vat',
                h2: 'SLA·DLP·LCD(광중합) 방식은 무엇이 다른가요?',
                html: `수조에 담긴 액체 ${term('레진')}에 빛을 비춰 한 층씩 굳히는 ${term('광중합')} 방식입니다. 보급형 장비는 대부분 ${term('빌드 플레이트')}가 출력물을 거꾸로 매단 채 한 층씩 올라가는 구조입니다. 세 방식은 ${strong('빛을 비추는 방법')}만 다릅니다.`,
                figure: [
                    {
                        kind: 'schematic',
                        visual: 'vat',
                        caption: '한 층이 굳을 때마다 플레이트가 살짝 올라가 굳은 층을 수조 바닥 필름에서 떼어 냅니다.',
                        labels: [
                            { title: '빌드 플레이트', desc: '출력물이 거꾸로 붙어 만들어지는 판으로, 한 층마다 위로 올라갑니다.' },
                            { title: '레진 수조', desc: '바닥이 투명한 필름(FEP)이라 아래에서 빛이 통과합니다.' },
                            { title: '광원', desc: '레이저(SLA)·프로젝터(DLP)·LCD 화면+UV(LCD)가 단면 모양대로 빛을 비춥니다.' },
                            { title: '경화된 출력물', desc: '빛을 받은 부분만 굳어 층층이 쌓입니다.' },
                        ],
                    },
                    {
                        kind: 'iconGrid',
                        caption: 'LCD 방식은 한 층을 통째로 굳혀 속도가 빠르고 장비가 저렴해 개인·교육용으로 많이 쓰입니다.',
                        items: [
                            { icon: 'fa-crosshairs', tone: 'violet', title: 'SLA', desc: '레이저 점이 단면을 그리듯 이동하며 굳힘' },
                            { icon: 'fa-video', tone: 'indigo', title: 'DLP', desc: '프로젝터가 한 층 전체 이미지를 한 번에 비춤' },
                            { icon: 'fa-display', tone: 'sky', title: 'LCD (MSLA)', desc: 'UV 광원 앞의 LCD 화면이 마스크가 되어 한 층을 통째로 굳힘' },
                        ],
                    },
                ],
                outro: `표면이 매끈하고 정밀해 피규어, 치과 모형, 주얼리 원형에 적합합니다. 다만 출력 후 ${term('IPA')} 세척과 UV ${term('2차 경화')}가 필요하고, 미경화 레진은 피부 자극이 있어 장갑과 환기가 필수입니다.`,
            },
            {
                id: 'powder',
                h2: 'SLS·MJF·금속 프린팅(분말 융접)은 어떤 방식인가요?',
                html: `얇게 깐 분말 위에 열원을 쬐어 단면만 녹이거나 ${term('소결')}하고, 다시 분말을 깔기를 반복합니다. 녹지 않은 주변 분말이 출력물을 받쳐 주므로 폴리머 방식은 ${strong('서포트가 거의 필요 없습니다')}.`,
                figure: [
                    {
                        kind: 'schematic',
                        visual: 'powder',
                        caption: '출력이 끝나면 분말 덩어리 속에서 출력물을 꺼내고, 남은 분말은 걸러서 다시 사용합니다.',
                        labels: [
                            { title: '레이저', desc: '거울로 방향을 바꿔 가며 단면 모양대로 분말을 녹입니다.' },
                            { title: `${term('리코터')}(롤러)`, desc: '한 층이 끝날 때마다 옆 공급부의 분말을 얇게 펴 바릅니다.' },
                            { title: '분말 베드', desc: '나일론·금속 분말이 층층이 깔리는 작업 공간입니다.' },
                            { title: '출력물', desc: '녹은 부분만 굳어 분말 속에 묻힌 채 완성됩니다.' },
                        ],
                    },
                    {
                        kind: 'iconGrid',
                        caption: '금속 분말 방식은 장비와 분말 취급 설비가 필요해 주로 산업 현장과 출력 서비스 업체에서 운용합니다.',
                        items: [
                            { icon: 'fa-bolt', tone: 'indigo', title: 'SLS', desc: '레이저로 나일론(PA12 등) 분말을 소결' },
                            { icon: 'fa-spray-can', tone: 'sky', title: 'MJF', desc: '융해제를 분사한 뒤 적외선으로 한 층을 녹임 (HP 방식)' },
                            { icon: 'fa-gear', tone: 'violet', title: 'SLM · DMLS', desc: '고출력 레이저로 스테인리스·티타늄·알루미늄 분말을 용융' },
                            { icon: 'fa-atom', tone: 'rose', title: 'EBM', desc: '진공 속에서 전자빔으로 금속 분말을 용융' },
                        ],
                    },
                ],
            },
            {
                id: 'others',
                h2: '나머지 4가지 방식은 언제 쓰이나요?',
                html: '재료 분사, 접착제 분사, 고에너지 직접 적층, 시트 적층은 특정 산업 용도에 맞춰 쓰이는 방식입니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '7가지 방식의 재료·장점·용도는 아래 비교표에서 한 번에 확인할 수 있습니다.',
                    items: [
                        { icon: 'fa-palette', tone: 'violet', title: '재료 분사 (Material Jetting)', desc: '잉크젯처럼 광경화 수지 방울을 분사한 뒤 UV로 굳힘. 여러 색·재질을 한 번에 출력해 정밀 시제품에 쓰입니다.' },
                        { icon: 'fa-fill-drip', tone: 'amber', title: '접착제 분사 (Binder Jetting)', desc: '분말 위에 결합제를 뿌려 굳힘. 풀컬러 모형, 주조용 모래 틀, 소결 후 금속 부품에 쓰입니다.' },
                        { icon: 'fa-fire', tone: 'rose', title: '고에너지 직접 적층 (DED)', desc: '금속 분말·와이어를 공급하며 레이저·아크로 녹여 쌓음. 대형 금속 부품 제작과 마모 부품 보수에 쓰입니다.' },
                        { icon: 'fa-layer-group', tone: 'emerald', title: '시트 적층 (Sheet Lamination)', desc: '종이·필름·금속 박판을 한 장씩 붙이고 잘라 쌓음. 저가 모형이나 초음파 금속 접합에 쓰입니다.' },
                    ],
                },
            },
            {
                id: 'choose',
                h2: '용도에 따라 어떤 방식을 고르면 되나요?',
                html: '만들려는 물건의 크기·정밀도·강도와 예산을 기준으로 고르면 됩니다.',
                figure: [
                    {
                        kind: 'decision',
                        caption: '처음 배운다면 FDM으로 원리를 익힌 뒤, 필요에 따라 광중합·분말 방식으로 넓혀 가는 것이 일반적입니다.',
                        options: [
                            { icon: 'fa-graduation-cap', tone: 'indigo', when: '처음 배우거나 큰 시제품을 만들 때', pick: 'FDM (재료 압출)', why: '장비·소재가 저렴하고 출력 실패 원인을 이해하기 쉽습니다.' },
                            { icon: 'fa-gem', tone: 'violet', when: '작고 정밀한 모형이 필요할 때', pick: '광중합 (SLA · DLP · LCD)', why: '피규어, 치과·주얼리 원형처럼 매끈한 표면에 적합합니다.' },
                            { icon: 'fa-gears', tone: 'sky', when: '튼튼한 기능 부품을 소량 생산할 때', pick: '분말 융접 (SLS · MJF)', why: '복잡한 형상도 서포트 없이 출력합니다.' },
                            { icon: 'fa-industry', tone: 'rose', when: '금속 최종 부품이 필요할 때', pick: 'SLM · DMLS 또는 DED', why: '전문 출력 서비스를 이용하는 경우가 많습니다.' },
                        ],
                    },
                    {
                        kind: 'ratings',
                        caption: '5단계 상대 비교로, 장비 등급과 소재에 따라 달라질 수 있습니다. 비용·난이도는 막대가 길수록 부담이 큽니다.',
                        metrics: ['표면 정밀도', '부품 강도', '장비·운영 비용', '입문 난이도'],
                        rows: [
                            { name: 'FDM', sub: '재료 압출', tone: 'indigo', scores: [2, 3, 1, 1] },
                            { name: '광중합', sub: 'SLA·DLP·LCD', tone: 'violet', scores: [5, 2, 2, 3] },
                            { name: '분말 융접', sub: 'SLS·MJF', tone: 'sky', scores: [4, 4, 4, 4] },
                            { name: '금속 분말', sub: 'SLM·DMLS', tone: 'rose', scores: [4, 5, 5, 5] },
                        ],
                    },
                ],
                outro: `각 방식에 맞는 재료는 ${link(`${LEARN_BASE_PATH}/materials`, '3D프린팅 출력 소재')}에서 자세히 비교했습니다.`,
            },
        ],
        table: {
            caption: 'ISO/ASTM 52900 기준 3D프린팅 7가지 방식 비교',
            head: ['방식', '대표 기술', '주 재료', '장점', '주 용도'],
            rows: [
                ['재료 압출', 'FDM, FFF', '열가소성 필라멘트', '저렴·쉬움·소재 다양', '교육, 시제품, 지그'],
                ['광중합', 'SLA, DLP, LCD', '광경화성 레진', '고정밀·매끈한 표면', '피규어, 치과, 주얼리'],
                ['분말 융접', 'SLS, MJF, SLM, DMLS, EBM', '나일론·금속 분말', '고강도·서포트 불필요', '기능 부품, 금속 부품'],
                ['재료 분사', '폴리젯, 멀티젯', '광경화성 수지', '다색·다재질·고정밀', '정밀 시제품, 의료 모형'],
                ['접착제 분사', '바인더 젯팅', '석고·모래·금속 분말', '빠름·풀컬러', '컬러 모형, 주조 틀'],
                ['고에너지 직접 적층', 'DED, WAAM', '금속 분말·와이어', '대형 금속·보수 가능', '항공·조선 부품 보수'],
                ['시트 적층', 'LOM, UAM', '종이·필름·금속 박판', '재료 저렴', '모형, 금속 접합'],
            ],
        },
        tableAfter: 4,
        faqs: [
            {
                q: 'FDM과 SLA의 가장 큰 차이는 무엇인가요?',
                a: 'FDM은 녹인 플라스틱 필라멘트를 노즐로 쌓고, SLA는 액체 레진을 빛으로 굳힙니다. FDM은 저렴하고 큰 출력에 유리하며, SLA는 표면이 매끈하고 정밀하지만 세척·2차 경화 같은 후처리가 필요합니다.',
            },
            {
                q: '입문자에게 추천하는 출력 방식은 무엇인가요?',
                a: 'FDM 방식을 추천합니다. 장비와 소재가 저렴하고 출력 과정이 눈에 보여 문제 원인을 파악하기 쉬우며, 국가자격 실기에서도 같은 방식을 다룹니다.',
            },
            {
                q: '레이어 높이는 어떻게 정하나요?',
                a: 'FDM에서는 보통 노즐 지름의 25~75% 범위(0.4mm 노즐 기준 약 0.1~0.3mm)에서 정합니다. 얇게 할수록 표면이 매끈하지만 출력 시간이 늘어납니다.',
            },
            {
                q: '금속도 3D프린터로 출력할 수 있나요?',
                a: '가능합니다. 레이저로 금속 분말을 녹이는 SLM·DMLS, 금속을 녹이며 쌓는 DED, 결합제로 성형 후 소결하는 바인더 젯팅 등이 있으며 주로 산업용 장비로 운용됩니다.',
            },
        ],
    },
    {
        topic: 'materials',
        navLabel: '출력 소재',
        icon: 'fa-flask',
        kicker: '3D프린팅 기초',
        h1: '3D프린팅 소재 종류와 특징: PLA·ABS·PETG·레진 비교',
        summary:
            '3D프린팅 소재는 출력 방식에 따라 FDM용 필라멘트(PLA, ABS, PETG, TPU 등), 광중합용 레진, 분말 방식용 나일론·금속 분말로 나뉩니다. 입문자에게는 출력이 쉽고 냄새가 적은 PLA가 가장 많이 쓰이며, 내열·내충격이 필요하면 ABS·ASA, 강도와 내화학성이 필요하면 PETG, 유연한 부품에는 TPU를 사용합니다.',
        keyFacts: [
            ['입문 표준 소재', 'PLA (출력 쉬움·냄새 적음)'],
            ['내열·내충격', 'ABS, ASA (실외용은 ASA)'],
            ['강도·내화학성', 'PETG'],
            ['유연 소재', 'TPU'],
            ['보관 핵심', '필라멘트는 습기를 흡수하므로 밀봉·건조 보관'],
        ],
        sections: [
            {
                id: 'filament',
                h2: 'FDM 필라멘트는 어떤 종류가 있나요?',
                html: `${term('필라멘트')}는 보통 지름 1.75mm 규격이 가장 많이 쓰입니다. 대표 소재 8가지의 특징은 다음과 같습니다.`,
                figure: {
                    kind: 'iconGrid',
                    caption: '같은 소재라도 제조사·색상에 따라 출력 특성이 조금씩 다르므로, 처음 쓰는 필라멘트는 작은 테스트 출력부터 해 보세요.',
                    items: [
                        { icon: 'fa-seedling', tone: 'emerald', title: 'PLA', desc: '옥수수 전분 등 식물성 원료의 바이오 플라스틱. 수축·뒤틀림이 적어 출력이 쉽지만 약 60℃ 전후에서 물러집니다.' },
                        { icon: 'fa-shield-halved', tone: 'indigo', title: 'ABS', desc: '단단하고 충격·열에 강합니다. 수축이 커 밀폐형 챔버와 환기가 권장되며, 아세톤으로 표면을 매끈하게 다듬을 수 있습니다.' },
                        { icon: 'fa-bottle-water', tone: 'sky', title: 'PETG', desc: `페트병 소재(PET)를 개량해 강도·내화학성이 좋고 투명 출력이 가능합니다. ${term('스트링')}이 생기기 쉽습니다.` },
                        { icon: 'fa-hand-back-fist', tone: 'violet', title: 'TPU', desc: '고무처럼 휘어지는 유연 소재. 휴대폰 케이스, 패킹, 신발 밑창 시제품에 쓰며 천천히 출력해야 합니다.' },
                        { icon: 'fa-sun', tone: 'amber', title: 'ASA', desc: 'ABS와 비슷하지만 자외선에 강해 실외용 부품에 적합합니다.' },
                        { icon: 'fa-link', tone: 'rose', title: '나일론 (PA)', desc: '질기고 마모에 강하지만 습기를 잘 흡수해 출력 전 건조가 필요합니다.' },
                        { icon: 'fa-dumbbell', tone: 'indigo', title: '복합 소재 (CF·GF)', desc: '탄소섬유·유리섬유를 섞어 강성을 높인 소재. 노즐을 빨리 마모시켜 경화강 노즐을 씁니다.' },
                        { icon: 'fa-droplet', tone: 'sky', title: '서포트 전용 (PVA·HIPS)', desc: 'PVA는 물에, HIPS는 리모넨 용액에 녹아 듀얼 노즐 장비의 서포트로 씁니다.' },
                    ],
                },
            },
            {
                id: 'compare',
                h2: '필라멘트별 출력 온도와 특성은 어떻게 다른가요?',
                html: `소재마다 녹는 온도가 달라 ${term('노즐')}과 ${term('히트베드')} 온도를 다르게 설정해야 합니다. 온도가 높은 소재일수록 대체로 열에 강하지만 출력은 까다로워집니다.`,
                figure: [
                    {
                        kind: 'range',
                        caption: '일반적인 참고 범위입니다. 실제 출력은 필라멘트 제조사 권장값을 우선하세요. PLA의 베드 0℃는 가열 없이도 출력할 수 있다는 뜻입니다.',
                        min: 0,
                        max: 300,
                        step: 50,
                        unit: '℃',
                        series: [
                            { label: '노즐 온도', color: '#f97316' },
                            { label: '베드 온도', color: '#38bdf8' },
                        ],
                        rows: [
                            { name: 'PLA', ranges: [[190, 220], [0, 60]] },
                            { name: 'ABS', ranges: [[220, 250], [90, 110]] },
                            { name: 'PETG', ranges: [[220, 250], [70, 85]] },
                            { name: 'TPU', ranges: [[210, 230], [30, 60]] },
                            { name: 'ASA', ranges: [[230, 260], [90, 110]] },
                            { name: '나일론', ranges: [[240, 270], [70, 90]] },
                        ],
                    },
                    {
                        kind: 'ratings',
                        caption: '일반적인 경향을 5단계로 단순화한 비교입니다. 막대가 길수록 해당 성질이 좋습니다(냄새 항목은 길수록 냄새가 적음).',
                        metrics: ['출력 쉬움', '내열성', '충격 강도', '유연성', '냄새 적음'],
                        rows: [
                            { name: 'PLA', tone: 'emerald', scores: [5, 1, 2, 1, 5] },
                            { name: 'ABS', tone: 'indigo', scores: [2, 4, 4, 1, 1] },
                            { name: 'PETG', tone: 'sky', scores: [4, 3, 4, 2, 4] },
                            { name: 'TPU', tone: 'violet', scores: [2, 2, 5, 5, 4] },
                            { name: 'ASA', tone: 'amber', scores: [2, 4, 4, 1, 1] },
                            { name: '나일론', tone: 'rose', scores: [1, 4, 5, 3, 3] },
                        ],
                    },
                ],
            },
            {
                id: 'resin',
                h2: '광중합(SLA·DLP·LCD) 레진은 어떻게 고르나요?',
                html: `${term('레진')}은 빛에 반응해 굳는 액체 수지로, 용도별로 제품이 나뉩니다.`,
                figure: [
                    {
                        kind: 'iconGrid',
                        caption: '치과·의료용처럼 인체에 닿는 용도는 반드시 해당 용도로 인증된 전용 레진을 사용해야 합니다.',
                        items: [
                            { icon: 'fa-chess-knight', tone: 'indigo', title: '스탠다드 레진', desc: '정밀한 모형·피규어용. 단단하지만 깨지기 쉽습니다.' },
                            { icon: 'fa-hammer', tone: 'sky', title: '터프·ABS 라이크', desc: '충격에 강해 조립 시제품에 적합합니다.' },
                            { icon: 'fa-wave-square', tone: 'violet', title: '플렉시블 레진', desc: '고무처럼 휘어지는 부품용입니다.' },
                            { icon: 'fa-ring', tone: 'amber', title: '캐스터블 레진', desc: '깨끗하게 타서 없어지므로 주얼리 주조 원형에 씁니다.' },
                            { icon: 'fa-tooth', tone: 'emerald', title: '덴탈·바이오 레진', desc: '치과용으로 인증된 전용 제품을 사용해야 합니다.' },
                            { icon: 'fa-faucet-drip', tone: 'rose', title: '수세 레진', desc: `${term('IPA')} 대신 물로 세척하지만, 세척수도 레진 폐기물로 처리해야 합니다.` },
                        ],
                    },
                    {
                        kind: 'flow',
                        caption: '미경화 레진은 피부 자극과 알레르기를 일으킬 수 있습니다. 작업 전후 4단계 안전 수칙을 꼭 지키세요.',
                        steps: [
                            { icon: 'fa-mitten', title: '보호구 착용', desc: '니트릴 장갑과 보안경을 착용합니다', chips: ['장갑', '보안경'] },
                            { icon: 'fa-wind', title: '환기', desc: '냄새와 증기가 빠지도록 환기되는 곳에서 작업합니다', chips: ['환기'] },
                            { icon: 'fa-pump-soap', title: '세척·2차 경화', desc: `출력물을 ${term('IPA')}로 씻고 UV로 ${term('2차 경화')}합니다`, chips: ['IPA', 'UV'] },
                            { icon: 'fa-recycle', title: '굳혀서 폐기', desc: '남은 레진·세척액은 햇빛·UV로 완전히 굳힌 뒤 버립니다', chips: ['배수구 금지'] },
                        ],
                    },
                ],
            },
            {
                id: 'powder-metal',
                h2: '분말·금속 소재에는 무엇이 있나요?',
                html: '분말 소재는 SLS·MJF·금속 프린터에서 쓰이며, 주로 산업용 기능 부품 생산에 활용됩니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '금속 분말은 비산·화재 위험이 있어 전용 설비와 보호 장비를 갖춘 환경에서만 다룹니다.',
                    items: [
                        { icon: 'fa-braille', tone: 'indigo', title: '나일론 분말 (PA12 · PA11)', desc: 'SLS·MJF의 대표 소재. 강도와 내구성이 좋아 기능 부품 생산에 쓰입니다.' },
                        { icon: 'fa-couch', tone: 'violet', title: 'TPU 분말', desc: '유연한 격자 구조, 쿠션 부품에 쓰입니다.' },
                        { icon: 'fa-plane-up', tone: 'sky', title: '금속 분말', desc: '스테인리스강(316L), 티타늄 합금(Ti-6Al-4V), 알루미늄 합금(AlSi10Mg), 인코넬 등. 항공·의료·금형 분야에 쓰입니다.' },
                        { icon: 'fa-flask-vial', tone: 'emerald', title: '기타 소재', desc: '세라믹, 건설용 콘크리트, 초콜릿 같은 식품, 세포를 담은 바이오잉크도 연구·활용되고 있습니다.' },
                    ],
                },
            },
            {
                id: 'storage',
                h2: '필라멘트는 어떻게 보관해야 하나요?',
                html: `대부분의 필라멘트는 공기 중 습기를 빨아들이는 ${term('흡습성')}이 있습니다. 보관 습관만 바꿔도 출력 실패가 크게 줄어듭니다.`,
                figure: {
                    kind: 'balance',
                    labels: { good: '이렇게 보관하세요', bad: '습기를 먹으면', goodIcon: 'fa-box-archive', badIcon: 'fa-droplet' },
                    caption: '나일론·PETG·TPU는 흡습성이 특히 커서, 개봉 후 며칠만 지나도 출력 품질이 떨어질 수 있습니다.',
                    pros: [
                        { icon: 'fa-box', title: '밀봉 + 건조제', desc: '실리카겔과 함께 밀봉 용기나 지퍼백에 보관합니다.' },
                        { icon: 'fa-temperature-arrow-up', title: '출력 전 건조', desc: '흡습성이 큰 소재는 필라멘트 건조기로 말린 뒤 출력합니다.' },
                        { icon: 'fa-thumbtack', title: '끝 고정', desc: '필라멘트 끝을 스풀 구멍에 끼워 엉킴을 막습니다.' },
                    ],
                    cons: [
                        { icon: 'fa-volume-high', title: '탁탁 소리', desc: '출력 중 수분이 끓으며 기포가 터지는 소리가 납니다.' },
                        { icon: 'fa-hand-sparkles', title: '거친 표면', desc: '표면이 거칠어지고 실 늘어짐(스트링)이 늘어납니다.' },
                        { icon: 'fa-heart-crack', title: '강도 저하', desc: '층 사이 결합이 약해져 쉽게 부러집니다.' },
                    ],
                },
            },
            {
                id: 'choose',
                h2: '용도별로 어떤 소재를 고르면 되나요?',
                html: '출력물이 놓일 환경(온도·햇빛·물)과 필요한 성질(단단함·유연함)을 먼저 정하면 소재를 쉽게 고를 수 있습니다.',
                figure: {
                    kind: 'decision',
                    caption: '처음에는 PLA로 출력 감각을 익힌 뒤, 용도에 맞춰 PETG·ABS·TPU로 넓혀 가는 것을 권합니다.',
                    options: [
                        { icon: 'fa-graduation-cap', tone: 'emerald', when: '입문·교육, 외형 확인용 모형', pick: 'PLA', why: '출력이 쉽고 냄새가 적습니다.' },
                        { icon: 'fa-car', tone: 'indigo', when: '열이 나는 곳, 자동차 실내 부품', pick: 'ABS 또는 ASA', why: '열과 충격에 강합니다.' },
                        { icon: 'fa-cloud-sun', tone: 'amber', when: '실외에 두는 부품', pick: 'ASA', why: '자외선에 강해 색이 바래거나 약해지지 않습니다.' },
                        { icon: 'fa-gears', tone: 'sky', when: '기계 부품, 물·약품에 닿는 용기', pick: 'PETG 또는 나일론', why: '강도와 내화학성이 좋습니다.' },
                        { icon: 'fa-hand-back-fist', tone: 'violet', when: '휘어지는 부품', pick: 'TPU', why: '고무처럼 탄성이 있습니다.' },
                        { icon: 'fa-gem', tone: 'rose', when: '정밀한 소형 모형', pick: '광중합 레진', why: '매끈하고 디테일한 표면을 얻을 수 있습니다.' },
                    ],
                },
                outro: `식품에 닿는 용도(쿠키틀 등)는 소재 자체뿐 아니라 노즐·착색제·적층 틈새의 위생까지 고려해야 하므로, 식품용 인증 소재와 사용 방법을 확인하세요. 매장용 쿠키틀·몰드 제작은 ${link('/guides/small-business', '소상공인 활용 교육')}에서 실습합니다.`,
            },
        ],
        table: {
            caption: 'FDM 대표 필라멘트 비교',
            head: ['소재', '노즐 온도(참고)', '베드 온도(참고)', '장점', '주의점'],
            rows: [
                ['PLA', '190~220℃', '0~60℃', '출력 쉬움, 냄새 적음', '내열 약함(약 60℃)'],
                ['ABS', '220~250℃', '90~110℃', '내열·내충격, 후가공 쉬움', '뒤틀림, 냄새·환기 필요'],
                ['PETG', '220~250℃', '70~85℃', '강도·내화학성, 투명', '스트링(실 늘어짐)'],
                ['TPU', '210~230℃', '30~60℃', '유연·탄성', '저속 출력 필요'],
                ['ASA', '230~260℃', '90~110℃', '내자외선·실외용', '뒤틀림, 환기 필요'],
                ['나일론', '240~270℃', '70~90℃', '질김·내마모', '흡습 — 건조 필수'],
            ],
            note: '온도는 일반적인 참고 범위입니다. 실제 출력은 필라멘트 제조사 권장값을 우선하세요.',
        },
        tableAfter: 1,
        faqs: [
            {
                q: '처음 3D프린팅을 할 때 어떤 소재가 좋나요?',
                a: 'PLA를 추천합니다. 낮은 온도에서 출력되고 수축과 뒤틀림이 적어 실패가 적으며, 냄새도 적어 교육용으로 가장 많이 쓰입니다.',
            },
            {
                q: 'PLA와 ABS는 어떻게 다른가요?',
                a: 'PLA는 출력이 쉽지만 열에 약하고, ABS는 열과 충격에 강하지만 수축이 커 출력이 까다롭고 환기가 필요합니다. 외형 확인용은 PLA, 열이나 충격을 받는 부품은 ABS를 주로 씁니다.',
            },
            {
                q: '필라멘트가 습기를 먹으면 어떻게 되나요?',
                a: '출력 중 기포가 터지며 표면이 거칠어지고, 실 늘어짐이 늘어나며 강도가 떨어집니다. 건조기로 말리거나 밀봉 보관해 예방합니다.',
            },
            {
                q: '레진 프린터는 안전한가요?',
                a: '올바르게 쓰면 안전하지만, 미경화 레진은 피부 자극과 알레르기를 일으킬 수 있습니다. 장갑·보안경을 착용하고 환기가 되는 곳에서 사용하며, 남은 레진은 완전히 굳힌 뒤 폐기합니다.',
            },
        ],
    },
    {
        topic: 'safety',
        navLabel: '안전 수칙',
        icon: 'fa-helmet-safety',
        kicker: '3D프린팅 기초',
        h1: '3D프린팅 안전교육: 출력 전·중·후 안전 수칙 총정리',
        summary:
            '3D프린터는 200℃가 넘는 노즐과 뜨거운 히트베드, 출력 중 나오는 초미세입자·휘발성 유기화합물(VOC), 피부를 자극하는 레진처럼 여러 위험 요소를 함께 가진 장비입니다. <strong>환기, 보호구 착용, 출력 중 상태 확인</strong> 세 가지를 습관으로 만들면 대부분의 사고를 예방할 수 있으며, 3D프린팅서비스사업자는 「삼차원프린팅산업 진흥법」에 따라 법정 안전교육을 받아야 합니다.',
        keyFacts: [
            ['주요 위험', '고온 화상, 유해 배출물, 화재·전기, 레진·용제'],
            ['기본 3원칙', '환기 · 보호구 착용 · 출력 중 상태 확인'],
            ['법정 안전교육', '3D프린팅서비스사업 대표자·종업원 (진흥법 제18조)'],
            ['신규 교육', '대표자 8시간 이상 · 종업원 16시간 이상'],
            ['보수 교육', '대표자 2년마다 · 종업원 매년 (각 6시간 이상)'],
        ],
        sections: [
            {
                id: 'hazards',
                h2: '3D프린팅에는 어떤 위험이 있나요?',
                html: '3D프린터는 가정용 전자제품처럼 보이지만, 실제로는 고온 장치이면서 화학물질을 다루는 장비입니다. 위험 요소는 크게 6가지로 나눌 수 있습니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '위험의 종류를 알면 어떤 보호구와 환경이 필요한지도 자연스럽게 정해집니다.',
                    items: [
                        { icon: 'fa-fire-flame-curved', tone: 'rose', title: '고온 화상', desc: `${term('노즐')}은 200℃ 이상, ${term('히트베드')}는 최대 110℃ 안팎까지 뜨거워지며 출력 직후에도 한동안 식지 않습니다.` },
                        { icon: 'fa-smog', tone: 'violet', title: '유해 배출물', desc: `필라멘트가 녹을 때 눈에 보이지 않는 ${term('초미세입자')}와 ${term('VOC')}가 나옵니다.` },
                        { icon: 'fa-bolt', tone: 'amber', title: '화재·전기', desc: '히터 고장, 배선 불량, 먼지 쌓인 전원부는 과열과 화재로 이어질 수 있습니다.' },
                        { icon: 'fa-hand', tone: 'indigo', title: '끼임·베임', desc: '움직이는 축·벨트에 손가락이 끼거나, 스크레이퍼·니퍼로 서포트를 떼다 베일 수 있습니다.' },
                        { icon: 'fa-flask', tone: 'sky', title: '화학물질', desc: `미경화 ${term('레진')}은 피부를 자극하고, ${term('IPA')}·아세톤은 불이 잘 붙습니다.` },
                        { icon: 'fa-head-side-mask', tone: 'emerald', title: '분진', desc: '샌딩·연마 가루와 분말 소재는 호흡기로 들어갈 수 있습니다.' },
                    ],
                },
            },
            {
                id: 'hazard-map',
                h2: 'FDM 프린터의 어느 부분이 위험한가요?',
                html: '교육 현장에서 가장 많이 쓰는 FDM 프린터를 기준으로, 출력 중에 손대면 안 되는 위치를 표시했습니다.',
                figure: {
                    kind: 'schematic',
                    visual: 'hazard',
                    caption: `문을 닫으면 손이 닿지 않는 밀폐형(${term('인클로저')}) 프린터는 화상·끼임 사고와 배출물 확산을 함께 줄여 줍니다.`,
                    labels: [
                        { title: '노즐·핫엔드', desc: '200~260℃. 출력 중이나 직후에는 절대 맨손으로 만지지 않습니다.' },
                        { title: '히트베드', desc: '60~110℃. 출력물은 베드가 충분히 식은 뒤에 떼어 냅니다.' },
                        { title: '움직이는 축·벨트', desc: '출력 중에는 손을 넣지 않고, 긴 머리카락·끈이 말려 들어가지 않게 합니다.' },
                        { title: '전원부·배선', desc: '케이블이 눌리거나 꺾이지 않게 하고, 멀티탭 문어발 연결을 피합니다.' },
                    ],
                },
            },
            {
                id: 'emissions',
                h2: '출력할 때 나오는 냄새와 연기는 해롭나요?',
                html: `FDM 프린터는 필라멘트를 녹이는 과정에서 눈에 보이지 않는 ${term('초미세입자')}와 ${term('VOC')}(휘발성 유기화합물)를 내보냅니다. 일반적으로 ABS·ASA처럼 높은 온도로 출력하는 소재가 PLA보다 배출량이 많은 것으로 알려져 있습니다. ${strong('냄새가 적다고 안전한 것은 아니므로')}, 소재와 관계없이 환기를 기본으로 합니다.`,
                figure: {
                    kind: 'flow',
                    caption: '어린이나 호흡기가 예민한 사람은 출력 공간에 오래 머물지 않도록 하고, 침실처럼 오래 지내는 공간에는 프린터를 두지 않는 것이 좋습니다.',
                    steps: [
                        { icon: 'fa-box', title: '덮개로 가두기', desc: `${term('인클로저')} 안에서 출력해 배출물이 퍼지지 않게 합니다`, chips: ['밀폐형'] },
                        { icon: 'fa-filter', title: '필터로 거르기', desc: 'HEPA 필터는 미세입자를, 활성탄 필터는 냄새·VOC를 줄입니다', chips: ['HEPA', '활성탄'] },
                        { icon: 'fa-wind', title: '바깥으로 내보내기', desc: `창문 환기나 ${term('국소배기')} 장치로 실외로 배출합니다`, chips: ['환기'] },
                        { icon: 'fa-person-walking-arrow-right', title: '거리 두기', desc: '출력 중에는 프린터 바로 옆에서 오래 머물지 않습니다', chips: ['자리 이동'] },
                    ],
                },
            },
            {
                id: 'checklist',
                h2: '출력 전·중·후에 무엇을 확인해야 하나요?',
                html: '출력할 때마다 아래 항목을 확인하는 습관을 들이세요. 항목을 눌러 직접 점검해 볼 수 있습니다.',
                figure: {
                    kind: 'checklist',
                    caption: '이 체크리스트를 출력해 작업장에 붙여 두고, 처음 프린터를 쓰는 사람에게도 같은 기준을 안내하세요.',
                    columns: [
                        {
                            title: '출력 전',
                            icon: 'fa-clipboard-check',
                            tone: 'sky',
                            items: ['창문·배기 장치 등 환기 상태 확인', '프린터 주변의 종이·천 등 타기 쉬운 물건 치우기', '전원 케이블·플러그 손상 여부 확인', '소화기·화재 감지기 위치 확인', '소재에 맞는 노즐·베드 온도 설정 확인'],
                        },
                        {
                            title: '출력 중',
                            icon: 'fa-eye',
                            tone: 'amber',
                            items: ['첫 레이어가 잘 붙는지 지켜보기', '움직이는 부분에 손 넣지 않기', '타는 냄새·연기·이상한 소리가 나면 즉시 정지', '장시간 출력은 주기적으로 상태 확인', '프린터 옆에서 음식 먹지 않기'],
                        },
                        {
                            title: '출력 후',
                            icon: 'fa-broom',
                            tone: 'emerald',
                            items: ['노즐·베드가 충분히 식은 뒤 출력물 떼기', '서포트 제거 때 보안경 착용, 칼날은 몸 바깥 방향으로', '샌딩은 물사포를 쓰거나 방진 마스크 착용', '작업 후 손 씻기', '전원을 끄고 작업대 정리'],
                        },
                    ],
                },
            },
            {
                id: 'ppe',
                h2: '작업별로 어떤 보호구가 필요한가요?',
                html: '필요한 보호구는 작업 종류에 따라 달라집니다. 같은 프린터를 쓰더라도 출력할 때와 후가공할 때 갖춰야 할 것이 다릅니다.',
                figure: {
                    kind: 'matrix',
                    caption: '마스크는 용도를 구분해야 합니다. 샌딩 분진에는 방진 마스크, 레진·용제 증기에는 유기가스용 방독 마스크를 쓰며, 일반 덴탈 마스크로는 증기를 막을 수 없습니다.',
                    columns: [
                        { label: '니트릴 장갑', icon: 'fa-mitten' },
                        { label: '보안경', icon: 'fa-glasses' },
                        { label: '마스크', icon: 'fa-head-side-mask' },
                        { label: '내열 장갑', icon: 'fa-hand-dots' },
                        { label: '환기', icon: 'fa-wind' },
                    ],
                    rows: [
                        { name: 'FDM 출력', note: 'PLA·PETG·ABS 등', cells: [0, 0, 0, 0, 2] },
                        { name: '노즐 교체·막힘 정비', note: '핫엔드 가열 상태', cells: [0, 1, 0, 2, 1] },
                        { name: '서포트 제거·샌딩', cells: [1, 2, 2, 0, 1] },
                        { name: '레진 출력·세척', note: 'SLA·DLP·LCD', cells: [2, 2, 1, 0, 2] },
                        { name: '아세톤 훈증·도색', cells: [2, 2, 2, 0, 2] },
                        { name: '분말·금속 소재', note: '산업용 설비', cells: [2, 2, 2, 1, 2] },
                    ],
                },
            },
            {
                id: 'resin',
                h2: '레진과 세척액은 어떻게 다뤄야 하나요?',
                html: `광중합 프린터의 ${term('레진')}은 굳기 전 액체 상태에서 피부 자극과 알레르기를 일으킬 수 있고, 세척에 쓰는 ${term('IPA')}는 불이 잘 붙습니다. 반복해서 노출되면 처음에는 없던 알레르기가 생길 수 있으므로, 익숙해져도 보호구를 생략하지 않습니다.`,
                figure: {
                    kind: 'balance',
                    labels: { good: '이렇게 하세요', bad: '하지 마세요', goodIcon: 'fa-circle-check', badIcon: 'fa-ban', hideCount: true },
                    caption: '레진 병과 세척액 통에는 내용물과 날짜를 적어 두고, 어린이 손이 닿지 않는 서늘하고 어두운 곳에 보관합니다.',
                    pros: [
                        { icon: 'fa-mitten', title: '니트릴 장갑·보안경 착용', desc: '라텍스보다 화학물질에 강한 니트릴 장갑을 씁니다.' },
                        { icon: 'fa-wind', title: '환기되는 곳에서 작업', desc: '레진·IPA 증기가 쌓이지 않게 합니다.' },
                        { icon: 'fa-sun', title: '완전히 경화한 뒤 맨손으로', desc: `세척과 ${term('2차 경화')}를 마친 출력물만 맨손으로 다룹니다.` },
                        { icon: 'fa-recycle', title: '굳혀서 폐기', desc: '남은 레진·세척액은 햇빛이나 UV로 완전히 굳힌 뒤 버립니다.' },
                    ],
                    cons: [
                        { icon: 'fa-sink', title: '배수구에 버리기', desc: '레진과 세척액을 하수구에 붓지 않습니다.' },
                        { icon: 'fa-hand', title: '맨손으로 만지기', desc: '묻었다면 즉시 비누와 흐르는 물로 씻습니다.' },
                        { icon: 'fa-fire', title: '불 근처에서 IPA 사용', desc: '인화성이 있으므로 화기와 떨어뜨려 쓰고 보관합니다.' },
                        { icon: 'fa-hand-holding-droplet', title: '끈적이는 출력물 방치', desc: '표면이 끈적이면 아직 경화가 덜 된 상태입니다.' },
                    ],
                },
                outro: `레진 종류와 작업 순서는 ${link(`${LEARN_BASE_PATH}/materials#resin`, '출력 소재')} 페이지에서도 확인할 수 있습니다.`,
            },
            {
                id: 'emergency',
                h2: '사고가 나면 어떻게 대처하나요?',
                html: '당황하지 않도록 상황별 대처법을 미리 알아 두세요. 응급처치 후에도 증상이 심하거나 오래가면 반드시 의료기관의 진료를 받습니다.',
                figure: {
                    kind: 'decision',
                    caption: '응급 상황에서는 119에 먼저 연락하세요. 이 내용은 일반적인 응급처치 안내이며 의료인의 판단을 대신하지 않습니다.',
                    options: [
                        { icon: 'fa-fire-flame-curved', tone: 'rose', when: '노즐·베드에 데었을 때', pick: '흐르는 찬물로 15~20분 식히기', why: '얼음을 직접 대거나 물집을 터뜨리지 않습니다.' },
                        { icon: 'fa-hand-dots', tone: 'amber', when: '레진이 피부에 묻었을 때', pick: '비누와 흐르는 물로 바로 씻기', why: 'IPA·알코올로 닦으면 오히려 피부로 더 퍼질 수 있습니다.' },
                        { icon: 'fa-eye', tone: 'sky', when: '눈에 레진·용제가 들어갔을 때', pick: '흐르는 물로 15분 이상 씻기', why: '콘택트렌즈는 빼고, 씻은 뒤 병원 진료를 받습니다.' },
                        { icon: 'fa-smog', tone: 'violet', when: '연기·타는 냄새가 날 때', pick: '출력 정지 후 전원 차단', why: '안전하게 접근할 수 있을 때만 플러그를 뽑고 환기합니다.' },
                        { icon: 'fa-fire-extinguisher', tone: 'rose', when: '불꽃이 보일 때', pick: '소화기 사용 · 119 신고', why: '전기 화재에는 물을 뿌리지 말고, 불이 커지면 즉시 대피합니다.' },
                        { icon: 'fa-head-side-cough', tone: 'emerald', when: '두통·어지러움·기침이 날 때', pick: '작업 중단, 신선한 공기 마시기', why: '환기 상태를 점검하고, 증상이 계속되면 진료를 받습니다.' },
                    ],
                },
            },
            {
                id: 'law',
                h2: '3D프린팅 안전교육은 법으로 정해져 있나요?',
                html: `네. 「삼차원프린팅산업 진흥법」 제18조에 따라 ${strong('3D프린팅서비스사업자')}(이용자와 계약을 맺고 이용자를 위해 3D프린팅을 해 주는 사업자)의 대표자와, 장비·소재로 조형물을 만드는 종업원은 법정 안전교육을 받아야 합니다. 1개월 미만 일용직 근로자는 제외되며, 교육은 집합·현장·온라인 방식으로 받을 수 있습니다.`,
                figure: {
                    kind: 'iconGrid',
                    caption: '교육 시간과 대상은 법령 개정에 따라 바뀔 수 있으므로, 최신 기준과 교육 신청 방법은 과학기술정보통신부와 3D프린팅 안전교육 공식 안내를 확인하세요.',
                    items: [
                        { icon: 'fa-user-tie', tone: 'indigo', title: '대표자 · 신규 교육', desc: '사업 개시 후 3개월 이내 · 8시간 이상' },
                        { icon: 'fa-user-gear', tone: 'sky', title: '종업원 · 신규 교육', desc: '업무 배치 후 3개월 이내 · 16시간 이상' },
                        { icon: 'fa-rotate', tone: 'violet', title: '대표자 · 보수 교육', desc: '2년마다 · 6시간 이상' },
                        { icon: 'fa-calendar-check', tone: 'emerald', title: '종업원 · 보수 교육', desc: '매년 · 6시간 이상' },
                    ],
                },
                outro: `법정 교육은 관련 법령·제도, 프린터 종류별 위험성과 안전한 작업 방법, 소재별 유해성, 보호구 착용, 건강·작업환경 관리, 비상 대응을 다룹니다. 이 페이지의 내용도 같은 주제를 입문자 눈높이로 정리한 것입니다.`,
            },
            {
                id: 'prohibited',
                h2: '3D프린터로 만들면 안 되는 것도 있나요?',
                html: '기술적으로 출력할 수 있더라도 법으로 금지되거나, 다른 사람의 권리를 침해하거나, 안전 기준을 충족하지 못하는 경우가 있습니다.',
                figure: {
                    kind: 'iconGrid',
                    caption: '판매·배포 목적의 출력은 관련 법령과 모델 라이선스를 반드시 먼저 확인하세요.',
                    items: [
                        { icon: 'fa-ban', tone: 'rose', title: '총기·무기', desc: '허가 없이 총포를 만드는 것은 물론, 제조 방법·설계도를 인터넷에 게시·유포하는 것도 「총포화약법」으로 금지됩니다.' },
                        { icon: 'fa-copyright', tone: 'amber', title: '저작권·상표', desc: '캐릭터·브랜드 로고를 그대로 출력해 판매하면 권리 침해가 될 수 있습니다. 공유 모델은 라이선스를 확인하세요.' },
                        { icon: 'fa-utensils', tone: 'emerald', title: '식품·의료 용도', desc: '식품에 닿는 용기나 의료기기는 별도 인증과 기준이 필요합니다. 일반 출력물을 식기·의료용으로 쓰지 않습니다.' },
                    ],
                },
            },
        ],
        faqs: [
            {
                q: '3D프린터를 집이나 교실에서 써도 괜찮나요?',
                a: '환기가 잘 되는 곳이라면 사용할 수 있습니다. 밀폐형 프린터나 필터를 쓰고, 출력 중에는 프린터 바로 옆에 오래 머물지 않으며, 침실처럼 오래 지내는 공간에는 두지 않는 것이 좋습니다.',
            },
            {
                q: 'PLA는 냄새가 적은데 환기하지 않아도 되나요?',
                a: 'PLA도 녹는 과정에서 초미세입자가 나옵니다. ABS보다 적은 편이지만 냄새가 적다고 배출물이 없는 것은 아니므로, 소재와 관계없이 환기를 기본으로 합니다.',
            },
            {
                q: '출력을 걸어 두고 자리를 비워도 되나요?',
                a: '권장하지 않습니다. 특히 첫 레이어와 출력 초반에는 자리를 지키고, 장시간 출력할 때는 화재 감지기와 원격 카메라로 상태를 확인하며 프린터 주변에 타기 쉬운 물건을 두지 않습니다.',
            },
            {
                q: '3D프린팅 안전교육은 누가 받아야 하나요?',
                a: '「삼차원프린팅산업 진흥법」에 따라 3D프린팅서비스사업자의 대표자와 조형물을 제작하는 종업원(1개월 미만 일용직 제외)이 받아야 합니다. 신규 교육은 대표자가 사업 개시 후 3개월 이내 8시간 이상, 종업원이 업무 배치 후 3개월 이내 16시간 이상이며, 이후 대표자는 2년마다, 종업원은 매년 6시간 이상의 보수 교육을 받습니다.',
            },
            {
                q: '레진이 손에 묻으면 어떻게 하나요?',
                a: '즉시 비누와 흐르는 물로 씻어 냅니다. 알코올(IPA)로 닦지 말고, 붉어지거나 가려움이 계속되면 진료를 받습니다. 반복해서 노출되면 알레르기가 생길 수 있으므로 항상 니트릴 장갑을 착용합니다.',
            },
        ],
    },
];

export const LEARN_TOPICS = PAGES.map((p) => p.topic);

function pathOf(page: LearnPage): string {
    return page.topic ? `${LEARN_BASE_PATH}/${page.topic}` : LEARN_BASE_PATH;
}

const plain = (html: string) =>
    html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function sidebarHtml(current: LearnPage): string {
    const nav = PAGES.map((p) => {
        const active = p.topic === current.topic;
        return `<a href="${pathOf(p)}" class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-700'}"><i class="fas ${p.icon} w-4 text-center ${active ? 'text-indigo-100' : 'text-indigo-500'}" aria-hidden="true"></i>${p.navLabel}</a>`;
    }).join('');
    const toc = current.sections
        .map((s) => `<a href="#${s.id}" class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">${s.h2}</a>`)
        .join('');
    return `
        <aside class="hidden lg:block lg:col-span-3">
            <div class="sticky top-24 space-y-4">
                <nav class="rounded-[2rem] border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-md" aria-label="3D프린팅 기초 메뉴">
                    <p class="mb-2 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">3D프린팅 기초</p>
                    <div class="space-y-1">${nav}</div>
                </nav>
                <nav class="rounded-[2rem] border border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-md" aria-label="페이지 목차">
                    <p class="mb-2 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">목차</p>
                    <div class="space-y-0.5">${toc}</div>
                </nav>
                ${studyLinkCardHtml()}
            </div>
        </aside>`;
}

function studyLinkCardHtml(): string {
    return `
        <div class="bento-card rounded-[2rem] border border-indigo-100 bg-indigo-600 p-5 text-white shadow-sm">
            <p class="text-[10px] font-black uppercase tracking-wider text-indigo-100">자격증 준비</p>
            <p class="mt-1 text-base font-black leading-snug">3D프린터운용기능사 필기·실기 대비</p>
            <div class="mt-4 space-y-2 text-sm font-bold">
                <a href="/guides/craftsman-license" class="flex items-center justify-between rounded-xl bg-white/15 px-3 py-2 hover:bg-white/25">기능사 가이드 <i class="fas fa-arrow-right text-[10px]" aria-hidden="true"></i></a>
                <a href="https://wow-cbt-webmain.pages.dev/" target="_blank" rel="noopener" class="flex items-center justify-between rounded-xl bg-white/15 px-3 py-2 hover:bg-white/25">문제은행(CBT) <i class="fas fa-arrow-up-right-from-square text-[10px]" aria-hidden="true"></i></a>
            </div>
        </div>`;
}

function mobileNavHtml(current: LearnPage): string {
    const options = PAGES.map((p) => `<option value="${pathOf(p)}" ${p.topic === current.topic ? 'selected' : ''}>${p.navLabel}</option>`).join('');
    return `
        <div class="mb-6 lg:hidden">
            <label class="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-400">3D프린팅 기초</label>
            <select onchange="if(this.value)location.href=this.value" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm">${options}</select>
        </div>`;
}

function breadcrumbHtml(path: string): string {
    const items = breadcrumbsForPath(path);
    return `<nav aria-label="현재 위치" class="mb-4 text-xs font-bold text-slate-400"><ol class="flex flex-wrap items-center gap-1.5">${items
        .map((item, i) =>
            i === items.length - 1
                ? `<li class="text-slate-600" aria-current="page">${item.name}</li>`
                : `<li><a href="${item.path}" class="hover:text-indigo-600">${item.name}</a></li><li aria-hidden="true"><i class="fas fa-chevron-right text-[8px]"></i></li>`
        )
        .join('')}</ol></nav>`;
}

function keyFactsHtml(page: LearnPage): string {
    const rows = page.keyFacts
        .map(
            ([dt, dd]) => `
            <div class="grid grid-cols-[7rem_1fr] gap-2 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-[9rem_1fr]">
                <dt class="text-xs font-black text-slate-400">${dt}</dt>
                <dd class="text-sm font-bold text-slate-800">${dd}</dd>
            </div>`
        )
        .join('');
    return `
        <section class="mb-6 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" aria-label="핵심 정리">
            <h2 class="mb-3 text-lg font-black tracking-tight text-slate-900"><i class="fas fa-list-check mr-2 text-indigo-500" aria-hidden="true"></i>핵심 정리</h2>
            <dl>${rows}</dl>
        </section>`;
}

function tableHtml(table: LearnTable): string {
    const head = table.head.map((h) => `<th scope="col" class="whitespace-nowrap px-4 py-3 text-left text-xs font-black text-slate-500">${h}</th>`).join('');
    const body = table.rows
        .map(
            (r) =>
                `<tr class="border-t border-slate-100">${r
                    .map((cell, i) => (i === 0 ? `<th scope="row" class="whitespace-nowrap px-4 py-3 text-left text-sm font-black text-slate-900">${cell}</th>` : `<td class="px-4 py-3 text-sm text-slate-600">${cell}</td>`))
                    .join('')}</tr>`
        )
        .join('');
    return `
        <section class="bento-card mb-4 rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm sm:p-7">
            <h2 class="mb-4 text-lg font-black tracking-tight text-slate-900"><i class="fas fa-table mr-2 text-indigo-500" aria-hidden="true"></i>${table.caption}</h2>
            <div class="custom-scrollbar overflow-x-auto rounded-2xl border border-slate-100">
                <table class="min-w-full">
                    <caption class="sr-only">${table.caption}</caption>
                    <thead class="bg-slate-50"><tr>${head}</tr></thead>
                    <tbody>${body}</tbody>
                </table>
            </div>
            ${table.note ? `<p class="mt-3 text-xs leading-5 text-slate-400">${table.note}</p>` : ''}
        </section>`;
}

function sectionsHtml(page: LearnPage): string {
    return page.sections
        .map((s, i) => {
            const card = `
            <section id="${s.id}" class="bento-card mb-4 scroll-mt-28 rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" data-reveal>
                <h2 class="mb-4 flex items-start gap-3 text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600">${String(i + 1).padStart(2, '0')}</span>
                    <span class="pt-0.5">${s.h2}</span>
                </h2>
                <div class="text-[15px] leading-7 text-slate-600">${s.html}</div>
                ${s.figure ? (Array.isArray(s.figure) ? s.figure : [s.figure]).map(renderInfographic).join('') : ''}
                ${s.outro ? `<p class="mt-5 text-[15px] leading-7 text-slate-600">${s.outro}</p>` : ''}
            </section>`;
            return page.table && page.tableAfter === i ? card + tableHtml(page.table) : card;
        })
        .join('');
}

function faqHtml(page: LearnPage): string {
    const items = page.faqs
        .map(
            (f) => `
            <details class="group rounded-2xl border border-slate-200/60 bg-white">
                <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
                    <span class="flex items-start gap-2 text-[15px] font-black text-slate-900"><span class="text-indigo-500">Q.</span>${f.q}</span>
                    <i class="fas fa-chevron-down mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i>
                </summary>
                <p class="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">${f.a}</p>
            </details>`
        )
        .join('');
    return `
        <section class="mt-8 rounded-[2.5rem] border border-slate-200/60 bg-slate-50/80 p-6 sm:p-8" aria-label="자주 묻는 질문">
            <h2 class="mb-4 text-lg font-black tracking-tight text-slate-900"><i class="fas fa-circle-question mr-2 text-indigo-500" aria-hidden="true"></i>자주 묻는 질문</h2>
            <div class="space-y-3">${items}</div>
        </section>`;
}

function prevNextHtml(page: LearnPage): string {
    const idx = PAGES.indexOf(page);
    const prev = PAGES[idx - 1];
    const next = PAGES[idx + 1];
    const card = (p: LearnPage, dir: 'prev' | 'next') => `
        <a href="${pathOf(p)}" class="bento-card flex flex-1 items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm ${dir === 'next' ? 'justify-end text-right' : ''}">
            ${dir === 'prev' ? '<i class="fas fa-arrow-left text-slate-400" aria-hidden="true"></i>' : ''}
            <span><span class="block text-[10px] font-black uppercase tracking-wider text-slate-400">${dir === 'prev' ? '이전 글' : '다음 글'}</span><span class="block text-sm font-black text-slate-900">${p.navLabel}</span></span>
            ${dir === 'next' ? '<i class="fas fa-arrow-right text-slate-400" aria-hidden="true"></i>' : ''}
        </a>`;
    return `<nav class="mt-8 flex flex-col gap-3 sm:flex-row" aria-label="이전·다음 글">${prev ? card(prev, 'prev') : ''}${next ? card(next, 'next') : ''}</nav>`;
}

function ctaHtml(): string {
    return `
        <section class="mt-8 rounded-[2.5rem] border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 class="text-lg font-black tracking-tight text-slate-900">직접 출력해 보며 배우고 싶다면</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">${SITE_NAME}는 홍대·구미·전주센터에서 3D모델링·3D프린팅 실무 과정과 3D프린터운용기능사 대비 과정을 운영합니다. 국민내일배움카드로 수강할 수 있는 회차도 있습니다.</p>
            <div class="mt-5 flex flex-wrap gap-2">
                <a href="/course-sessions" class="inline-flex min-h-[44px] items-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-slate-900">교육과정 보기</a>
                <a href="/guides/craftsman-license" class="inline-flex min-h-[44px] items-center rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-black text-indigo-700 hover:bg-indigo-50">기능사 대비 안내</a>
                <a href="/guides/national-support" class="inline-flex min-h-[44px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 hover:border-indigo-200">국비지원 안내</a>
            </div>
        </section>`;
}

function jsonLd(page: LearnPage, path: string, title: string, description: string, glossaryKeys: string[]): unknown[] {
    const url = `${SITE_ORIGIN}${path}`;
    const article = {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: title,
        description,
        inLanguage: 'ko-KR',
        datePublished: PUBLISHED,
        dateModified: MODIFIED,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        author: { '@id': `${SITE_ORIGIN}/#organization` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        about: { '@type': 'Thing', name: '3D프린팅', alternateName: ['적층 제조', 'Additive Manufacturing'] },
        isPartOf: { '@type': 'CreativeWorkSeries', name: '3D프린팅 기초', url: `${SITE_ORIGIN}${LEARN_BASE_PATH}` },
    };
    const faq = {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };
    const glossary = glossaryJsonLd(url, glossaryKeys);
    return glossary ? [article, faq, glossary] : [article, faq];
}

function headerHtml(page: LearnPage, path: string): string {
    const text = `
        ${breadcrumbHtml(path)}
        <p class="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
            <i class="fas ${page.icon}" aria-hidden="true"></i> ${page.kicker}
        </p>
        <h1 class="break-keep text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">${page.h1}</h1>
        <p class="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-[15px] leading-7 text-slate-700 sm:text-base">${page.summary}</p>
        <p class="mt-4 text-xs font-bold text-slate-400">${SITE_NAME} 교육팀 · 최종 수정 <time datetime="${MODIFIED}">${MODIFIED.replace(/-/g, '.')}</time></p>`;
    if (page.hero !== 'layers') {
        return `<header class="bento-card mb-6 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10">${text}</header>`;
    }
    return `
        <header class="mb-6 overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10">
            <div class="grid items-center gap-6 xl:grid-cols-[1fr_minmax(0,20rem)]">
                <div>${text}</div>
                <div class="mx-auto w-full max-w-sm xl:max-w-none">${layerHeroSvg()}</div>
            </div>
        </header>`;
}

export function learn3dPrintingHtml(topic: string = ''): string | null {
    const page = PAGES.find((p) => p.topic === topic);
    if (!page) return null;
    const path = pathOf(page);
    const seo = getSeoOptionsForPath(path) || { title: page.h1, description: plain(page.summary).slice(0, 160), path };
    const body = sectionsHtml(page);
    const glossaryKeys = collectGlossaryKeys(body);

    return layoutHtml(
        page.h1,
        `
        <style>
            .bento-card { transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s; }
            .bento-card:hover { transform: translateY(-2px); box-shadow: 0 16px 24px -8px rgb(15 23 42 / .08); }
            details > summary::-webkit-details-marker { display: none; }
        </style>
        <div class="custom-scrollbar min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pb-16 pt-8 sm:pt-10">
            <div class="mx-auto max-w-6xl px-4 sm:px-6">
                ${mobileNavHtml(page)}
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    ${sidebarHtml(page)}
                    <article class="lg:col-span-9">
                        ${headerHtml(page, path)}
                        ${keyFactsHtml(page)}
                        ${body}
                        ${faqHtml(page)}
                        ${glossarySectionHtml(glossaryKeys)}
                        ${prevNextHtml(page)}
                        ${ctaHtml()}
                        <div class="mt-6 lg:hidden">${studyLinkCardHtml()}</div>
                    </article>
                </div>
            </div>
        </div>
        ${learnScript()}
        `,
        'learn',
        getSeoHead(SITE_ORIGIN, {
            ...seo,
            ogType: 'article',
            extraJsonLd: jsonLd(page, path, seo.title, seo.description || plain(page.summary), glossaryKeys),
        }) + learnHeadAssets()
    );
}
