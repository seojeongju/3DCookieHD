import { layoutHtml } from './components/layout';

type GuidePage = {
    slug: string;
    h1: string;
    lead: string;
    sections: { h2: string; body: string }[];
    links: { href: string; label: string }[];
};

const PAGES: Record<string, GuidePage> = {
    'national-support': {
        slug: 'national-support',
        h1: '3D프린팅 국비지원, 어디서 받나요?',
        lead: '3D프린팅 국비지원은 국민내일배움카드로 와우쓰리디 홍대·구미·전주센터에서 수강할 수 있습니다.',
        sections: [
            {
                h2: '3D프린팅 국비지원은 어떻게 신청하나요?',
                body: '국민내일배움카드를 발급받은 뒤, 와우쓰리디 모집 과정에 상담·등록하면 됩니다. 카드가 없으면 고용센터 또는 HRD-Net에서 발급을 진행하세요. 센터 상담은 02-3144-3137, 온라인 상담 페이지에서도 가능합니다.',
            },
            {
                h2: '내일배움카드로 3D프린팅을 들을 수 있나요?',
                body: '가능합니다. 와우쓰리디는 내일배움카드(국비지원) 3D프린팅·3D모델링 직업훈련을 운영합니다. 현재 모집 회차는 교육과정 목록에서 일정과 장소를 확인하세요.',
            },
            {
                h2: '수업은 어느 센터에서 하나요?',
                body: '서울 마포 홍대센터(상수역), 경북 구미센터, 전북 전주센터에서 운영합니다. 회차마다 교육 장소가 다르므로 과정 상세의 장소를 확인하세요.',
            },
        ],
        links: [
            { href: '/tomorrow-learning-card', label: '내일배움카드 안내' },
            { href: '/course-sessions', label: '모집 과정 보기' },
            { href: '/online-consulting', label: '온라인 상담' },
        ],
    },
    'craftsman-license': {
        slug: 'craftsman-license',
        h1: '3D프린터운용기능사, 어디서 준비하나요?',
        lead: '3D프린터운용기능사 실기 대비 과정은 와우쓰리디에서 주말반·평일저녁반으로 운영합니다.',
        sections: [
            {
                h2: '3D프린터운용기능사 학원은 어디인가요?',
                body: '와우쓰리디홍대센터에서 3D프린터운용기능사 실기 대비 집중 과정을 운영합니다. 회차별 일정은 교육과정 목록의 기능사 과정을 확인하세요.',
            },
            {
                h2: '국비지원으로 들을 수 있나요?',
                body: '개설 회차에 따라 내일배움카드(국비지원) 적용 여부가 다릅니다. 상담 시 해당 회차의 지원 유형을 안내합니다.',
            },
        ],
        links: [
            { href: '/course-sessions', label: '기능사 과정 목록' },
            { href: '/faq', label: '자주 묻는 질문' },
            { href: '/online-consulting', label: '수강 상담' },
        ],
    },
    'small-business': {
        slug: 'small-business',
        h1: '소상공인도 3D프린팅 교육을 들을 수 있나요?',
        lead: '가능합니다. 쿠키틀·몰드·소품 제품화를 위한 소상공인 맞춤 3D프린팅 과정을 운영합니다.',
        sections: [
            {
                h2: '어떤 내용을 배우나요?',
                body: '3D프린터 커스텀, 쿠키틀·스텐실, 실리콘·레진 몰드, 소품 제품화 등 매장·제작에 바로 쓰는 실습 중심으로 진행합니다.',
            },
            {
                h2: '어디서 수강하나요?',
                body: '주로 홍대센터에서 단기 회차로 개설됩니다. 일정은 교육과정 목록의 소상공인 과정을 확인하세요.',
            },
        ],
        links: [
            { href: '/course-sessions', label: '소상공인 과정 보기' },
            { href: '/prototype-gallery', label: '시제품·제작 사례' },
            { href: '/online-consulting', label: '맞춤 상담' },
        ],
    },
    prototype: {
        slug: 'prototype',
        h1: '3D프린팅 시제품은 어떻게 배우나요?',
        lead: '모델링부터 출력·후가공까지 시제품 제작 실무를 교육합니다. 기업·개인 모두 상담 후 과정에 참여할 수 있습니다.',
        sections: [
            {
                h2: '시제품 제작 교육은 얼마나 걸리나요?',
                body: '과정·회차마다 다릅니다. 단기 소상공인 과정부터 NCS 기반 정규 훈련까지 있으며, 일정은 과정 상세에서 확인하세요.',
            },
            {
                h2: '제작 사례를 볼 수 있나요?',
                body: '시제품 제작사진 갤러리와 수강생 포트폴리오에서 출력 사례를 볼 수 있습니다.',
            },
        ],
        links: [
            { href: '/prototype-gallery', label: '시제품 갤러리' },
            { href: '/corporate-education', label: '기업 맞춤 교육' },
            { href: '/course-sessions', label: '교육과정' },
        ],
    },
};

export const SEO_GUIDE_SLUGS = Object.keys(PAGES);

export function seoGuideHtml(slug: string): string | null {
    const page = PAGES[slug];
    if (!page) return null;
    const sections = page.sections
        .map(
            (s) => `
            <article class="rounded-[2.5rem] border border-slate-200/60 bg-white p-7 shadow-sm bento-card sm:p-9">
                <h2 class="text-xl font-black tracking-tight text-slate-900">${s.h2}</h2>
                <p class="mt-4 leading-7 text-slate-600">${s.body}</p>
            </article>`
        )
        .join('');
    const links = page.links
        .map(
            (l) =>
                `<a href="${l.href}" class="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-slate-900">${l.label}</a>`
        )
        .join('');
    return layoutHtml(
        page.h1,
        `
        <div class="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] py-12 sm:py-16">
            <div class="mx-auto max-w-4xl px-4 sm:px-6">
                <header class="mb-8 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10">
                    <p class="mb-3 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">GUIDE</p>
                    <h1 class="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">${page.h1}</h1>
                    <p class="mt-4 max-w-2xl leading-7 text-slate-600">${page.lead}</p>
                    <div class="mt-6 flex flex-wrap gap-3">${links}</div>
                </header>
                <section class="space-y-4">${sections}</section>
            </div>
        </div>
        `,
        'course-sessions'
    );
}
