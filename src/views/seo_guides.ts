import { layoutHtml } from './components/layout';
import { buildHowTo, CAMPUSES, getSeoHead, getSeoOptionsForPath, SITE_ORIGIN } from '../utils/seo';

type GuidePage = {
    slug: string;
    kicker: string;
    icon: string;
    h1: string;
    lead: string;
    sections: { h2: string; body: string }[];
    links: { href: string; label: string }[];
};

const PAGES: Record<string, GuidePage> = {
    'national-support': {
        slug: 'national-support',
        kicker: '국비지원 가이드',
        icon: 'fa-landmark',
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
                h2: '3D프린터 무료교육과 국비지원의 차이는?',
                body: '검색에서 말하는 무료교육은 대개 국비지원(내일배움카드)을 의미합니다. 자기부담금은 회차·자격에 따라 다르며, 자세한 안내는 국비·무료 가이드를 참고하세요.',
            },
            {
                h2: '수업은 어느 센터에서 하나요?',
                body: '서울 마포 홍대센터(상수역), 경북 구미센터, 전북 전주센터에서 운영합니다. 회차마다 교육 장소가 다르므로 과정 상세의 장소를 확인하세요.',
            },
        ],
        links: [
            { href: '/tomorrow-learning-card', label: '내일배움카드 안내' },
            { href: '/guides/free-education', label: '국비·무료 안내' },
            { href: '/course-sessions', label: '모집 과정 보기' },
            { href: '/online-consulting', label: '온라인 상담' },
        ],
    },
    'craftsman-license': {
        slug: 'craftsman-license',
        kicker: '자격증 가이드',
        icon: 'fa-id-badge',
        h1: '3D프린터 국가자격증·3D프린팅 기능사, 어디서 준비하나요?',
        lead: '국가기술자격 공식명은 3D프린터운용기능사입니다. 와우쓰리디에서 실기 대비 과정(주말반·평일저녁반)을 운영합니다.',
        sections: [
            {
                h2: '3D프린터 국가자격증이 있나요?',
                body: '있습니다. 국가기술자격 명칭은 3D프린터운용기능사입니다. 흔히 3D프린팅 기능사·3D프린터 자격증으로 불리며, 모델링·출력·후가공 실무 능력을 검증합니다.',
            },
            {
                h2: '3D프린팅 기능사와 3D프린터운용기능사는 다른가요?',
                body: '같은 자격을 가리키는 표현입니다. 공식 명칭은 3D프린터운용기능사이며, 와우쓰리디 과정 안내에서도 이 명칭을 사용합니다.',
            },
            {
                h2: '3D프린터운용기능사 학원은 어디인가요?',
                body: '와우쓰리디 홍대·구미·전주센터에서 실기 대비 집중 과정을 운영합니다. 주말반·평일저녁반 일정은 교육과정 목록의 기능사 회차를 확인하세요.',
            },
            {
                h2: '국비지원·내일배움카드로 들을 수 있나요?',
                body: '개설 회차에 따라 내일배움카드(국비지원) 적용 여부가 다릅니다. 상담 시 해당 회차의 지원 유형과 자기부담금을 안내합니다.',
            },
        ],
        links: [
            { href: '/course-sessions', label: '기능사 과정 목록' },
            { href: '/guides/free-education', label: '국비·무료 안내' },
            { href: '/faq', label: '자주 묻는 질문' },
            { href: '/online-consulting', label: '수강 상담' },
        ],
    },
    'free-education': {
        slug: 'free-education',
        kicker: '국비·비용 가이드',
        icon: 'fa-gift',
        h1: '3D프린터 무료교육, 어떻게 받을 수 있나요?',
        lead: '완전 무료 여부는 회차·자격에 따라 다릅니다. 국민내일배움카드(국비지원)로 훈련비 부담을 크게 줄일 수 있습니다.',
        sections: [
            {
                h2: '3D프린터 무료교육이 있나요?',
                body: '「완전 무료」과정은 개설·자격에 따라 다릅니다. 와우쓰리디 3D프린팅 국비지원 과정은 국민내일배움카드로 수강료 부담을 줄일 수 있으며, 자기부담금·지원율은 회차마다 다릅니다.',
            },
            {
                h2: '내일배움카드로 비용을 줄이려면?',
                body: '고용24에서 국민내일배움카드를 발급받은 뒤, 와우쓰리디 모집 과정에 상담·등록하면 됩니다. 발급 절차 요약은 내일배움카드 안내 페이지를 참고하세요.',
            },
            {
                h2: '기능사·국비 과정은 어디서 보나요?',
                body: '교육과정 목록에서 모집 중인 국비지원·3D프린터운용기능사 회차 일정과 장소를 확인할 수 있습니다. 홍대·구미·전주센터에서 운영합니다.',
            },
            {
                h2: '상담 전에 무엇을 준비하면 되나요?',
                body: '관심 과정(기능사·국비·소상공인 등), 희망 센터, 내일배움카드 보유 여부를 알려주시면 해당 회차 기준의 지원·일정을 안내합니다. 전화 02-3144-3137.',
            },
        ],
        links: [
            { href: '/tomorrow-learning-card', label: '내일배움카드 안내' },
            { href: '/course-sessions', label: '모집 과정 보기' },
            { href: '/guides/craftsman-license', label: '기능사·국가자격' },
            { href: '/online-consulting', label: '온라인 상담' },
        ],
    },
    'small-business': {
        slug: 'small-business',
        kicker: '소상공인 가이드',
        icon: 'fa-store',
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
        kicker: '시제품 가이드',
        icon: 'fa-cubes',
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

function linkClass(href: string, index: number): string {
    const isPrimary = href.includes('/course-sessions') || href.includes('/tomorrow-learning-card') || href.includes('/guides/free-education') || index === 0;
    const isConsult = href.includes('/online-consulting');
    if (isConsult) {
        return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-black text-indigo-700 hover:bg-indigo-50';
    }
    if (isPrimary) {
        return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-slate-900';
    }
    return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-700 hover:border-indigo-200 hover:text-indigo-700';
}

function faqGraphNode(page: GuidePage) {
    return {
        '@type': 'FAQPage',
        '@id': `${SITE_ORIGIN}/guides/${page.slug}#faq`,
        url: `${SITE_ORIGIN}/guides/${page.slug}`,
        mainEntity: page.sections.map((s) => ({
            '@type': 'Question',
            name: s.h2,
            acceptedAnswer: { '@type': 'Answer', text: s.body },
        })),
    };
}

function howToForGuide(page: GuidePage): Record<string, unknown> | null {
    if (page.slug === 'national-support' || page.slug === 'free-education') {
        return buildHowTo(
            page.slug === 'free-education'
                ? '3D프린터 국비·무료교육 수강 준비하기'
                : '3D프린팅 국비지원 신청하기',
            page.lead,
            [
                { name: '내일배움카드 확인', text: '국민내일배움카드가 없으면 고용24에서 발급을 진행합니다.' },
                { name: '과정 확인', text: '와우쓰리디 교육과정 목록에서 모집 중인 3D프린팅 국비지원·기능사 회차를 확인합니다.' },
                { name: '상담·등록', text: '온라인 상담 또는 전화 02-3144-3137로 센터·일정을 상담하고 등록합니다.' },
            ],
        );
    }
    if (page.slug === 'craftsman-license') {
        return buildHowTo(
            '3D프린터운용기능사 준비하기',
            '3D프린터 국가자격증(3D프린터운용기능사) 실기 대비를 위한 안내입니다.',
            [
                { name: '자격 확인', text: '공식 명칭이 3D프린터운용기능사(국가기술자격)임을 확인합니다.' },
                { name: '과정 선택', text: '와우쓰리디 주말반·평일저녁반 등 기능사 대비 회차를 교육과정에서 확인합니다.' },
                { name: '상담 신청', text: '국비(내일배움카드) 적용 여부와 일정을 상담 후 등록합니다.' },
            ],
        );
    }
    return null;
}

export function seoGuideHtml(slug: string): string | null {
    const page = PAGES[slug];
    if (!page) return null;

    const primary = page.links.find((l) => l.href.includes('/course-sessions')) || page.links[0];
    const sections = page.sections
        .map(
            (s, i) => `
            <article class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8 ${i === 0 && page.sections.length % 2 === 1 ? 'lg:col-span-2' : ''}">
                <div class="mb-4 flex items-start gap-3">
                    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-600">${String(i + 1).padStart(2, '0')}</span>
                    <h2 class="text-lg font-black tracking-tight text-slate-900 sm:text-xl">${s.h2}</h2>
                </div>
                <p class="leading-7 text-slate-600">${s.body}</p>
            </article>`
        )
        .join('');

    const ctaButtons = page.links
        .map((l, i) => `<a href="${l.href}" class="${linkClass(l.href, i)}">${l.label}</a>`)
        .join('');

    const campusCards = (Object.keys(CAMPUSES) as Array<keyof typeof CAMPUSES>)
        .map((key) => {
            const campus = CAMPUSES[key];
            const tel = campus.telephone.replace('+82-', '0');
            return `
                <a href="/locations/${campus.slug}" class="bento-card flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm">
                    <span>
                        <span class="block text-sm font-black text-slate-900">${campus.name.replace('와우쓰리디 ', '')}</span>
                        <span class="block text-xs text-slate-500">${campus.locality}</span>
                    </span>
                    <span class="text-xs font-bold text-indigo-600">${tel}</span>
                </a>`;
        })
        .join('');

    const related = Object.values(PAGES)
        .filter((p) => p.slug !== page.slug)
        .map(
            (p) => `
            <a href="/guides/${p.slug}" class="bento-card group flex flex-col rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm">
                <span class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-50">
                    <i class="fas ${p.icon}"></i>
                </span>
                <span class="text-xs font-black uppercase tracking-wider text-indigo-600">${p.kicker}</span>
                <span class="mt-2 font-black tracking-tight text-slate-900">${p.h1}</span>
            </a>`
        )
        .join('');

    return layoutHtml(
        page.h1,
        `
        <style>
            .bento-card { transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s; }
            .bento-card:hover { transform: translateY(-3px); box-shadow: 0 20px 25px -5px rgb(15 23 42 / .08), 0 8px 10px -6px rgb(15 23 42 / .06); }
        </style>
        <div class="custom-scrollbar min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pb-28 pt-8 sm:pb-16 sm:pt-12">
            <div class="mx-auto max-w-6xl px-4 sm:px-6">
                <div class="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
                    <header class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10 lg:col-span-8">
                        <p class="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                            <i class="fas ${page.icon}"></i> ${page.kicker}
                        </p>
                        <h1 class="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">${page.h1}</h1>
                        <p class="mt-4 max-w-2xl leading-7 text-slate-600">${page.lead}</p>
                        <div class="mt-7 flex flex-wrap gap-3">${ctaButtons}</div>
                    </header>
                    <aside class="flex flex-col gap-4 lg:col-span-4">
                        <a href="tel:0231443137" class="bento-card flex items-center gap-4 rounded-[2.5rem] border border-indigo-100 bg-indigo-600 p-6 text-white shadow-sm">
                            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><i class="fas fa-phone"></i></span>
                            <span>
                                <span class="block text-xs font-bold uppercase tracking-wider text-indigo-100">상담 전화</span>
                                <span class="block text-xl font-black tracking-tight">02-3144-3137</span>
                            </span>
                        </a>
                        <div class="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md">
                            <p class="mb-3 px-1 text-xs font-black uppercase tracking-wider text-slate-400">캠퍼스</p>
                            <div class="space-y-2">${campusCards}</div>
                        </div>
                    </aside>
                </div>

                <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">${sections}</section>

                <section class="mt-10">
                    <h2 class="mb-4 px-1 text-lg font-black tracking-tight text-slate-900">다른 학습 가이드</h2>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">${related}</div>
                </section>
            </div>
        </div>
        <div class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 p-3 backdrop-blur-md lg:hidden" style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom));">
            <div class="mx-auto flex max-w-6xl gap-2">
                <a href="tel:0231443137" class="flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-slate-200 text-sm font-black text-slate-800">전화 상담</a>
                <a href="${primary.href}" class="flex min-h-[44px] flex-1 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white">${primary.label}</a>
            </div>
        </div>
        `,
        'course-sessions',
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
        )
    );
}
