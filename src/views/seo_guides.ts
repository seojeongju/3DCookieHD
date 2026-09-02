import { layoutHtml } from './components/layout';
import { buildHowTo, CAMPUSES, getSeoHead, getSeoOptionsForPath, SITE_NAME, SITE_ORIGIN } from '../utils/seo';

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
        kicker: '국비·비용 가이드',
        icon: 'fa-landmark',
        h1: '3D프린팅 국비지원·내일배움카드, 어떻게 신청하나요?',
        lead: '검색의 「3D프린터 무료교육」은 대개 국민내일배움카드(국비지원)를 말합니다. 와우쓰리디 홍대·구미·전주에서 신청·수강 절차를 한눈에 안내합니다.',
        sections: [
            {
                h2: '3D프린팅 국비지원이란?',
                body: '고용노동부 국민내일배움카드로 직업훈련비를 지원받는 제도입니다. 와우쓰리디는 3D프린팅·3D모델링 국비지원 과정을 홍대·구미·전주센터에서 운영합니다.',
            },
            {
                h2: '「무료교육」과 국비지원은 같은가요?',
                body: '검색에서 말하는 무료교육은 대부분 국비지원을 가리킵니다. 완전 0원 여부는 회차·수강 자격·자기부담금에 따라 다르며, 상담 시 해당 회차 기준으로 안내합니다.',
            },
            {
                h2: '신청 절차는 어떻게 되나요?',
                body: '① 고용24에서 내일배움카드 발급 → ② 교육과정 목록에서 모집 회차 확인 → ③ 온라인 상담 또는 전화(02-3144-3137)로 등록. 카드가 없으면 발급 절차부터 함께 안내합니다.',
            },
            {
                h2: '카드 발급·비용 안내는 어디서 보나요?',
                body: '발급 단계·유의사항은 내일배움카드 안내 페이지에, 모집 일정·장소는 교육과정 목록에 정리되어 있습니다. 기능사(국가자격) 대비는 별도 기능사 가이드를 참고하세요.',
            },
        ],
        links: [
            { href: '/tomorrow-learning-card', label: '내일배움카드 발급 안내' },
            { href: '/course-sessions', label: '모집 과정 보기' },
            { href: '/guides/craftsman-license', label: '기능사·국가자격' },
            { href: '/online-consulting', label: '온라인 상담' },
        ],
    },
    'craftsman-license': {
        slug: 'craftsman-license',
        kicker: '자격증 가이드',
        icon: 'fa-id-badge',
        h1: '3D프린터운용기능사(국가자격), 어디서 준비하나요?',
        lead: '국가기술자격 공식명은 3D프린터운용기능사입니다. 와우쓰리디에서 실기 대비(주말반·평일저녁반)를 운영합니다.',
        sections: [
            {
                h2: '3D프린터 국가자격증의 공식 명칭은?',
                body: '3D프린터운용기능사입니다. 흔히 3D프린팅 기능사·3D프린터 자격증으로 불리며, 모델링·출력·후가공 실무 능력을 검증합니다.',
            },
            {
                h2: '실기 대비 과정은 어떻게 구성되어 있나요?',
                body: '실기 과제에 맞춘 모델링·슬라이싱·출력·후가공 연습 중심으로 진행합니다. 주말반·평일저녁반 등 개설 형태는 회차마다 다르니 과정 목록에서 확인하세요.',
            },
            {
                h2: '어느 센터에서 수강할 수 있나요?',
                body: '홍대·구미·전주센터에서 기능사 대비 과정을 운영합니다. 회차별 장소는 과정 상세의 교육장소를 확인하세요.',
            },
            {
                h2: '기능사 과정도 국비(내일배움카드)가 되나요?',
                body: '개설 회차에 따라 다릅니다. 국비 적용 여부와 자기부담금은 해당 회차 상담 시 안내하며, 국비 신청 절차 자체는 국비지원 가이드를 참고하세요.',
            },
        ],
        links: [
            { href: '/course-sessions', label: '기능사 과정 목록' },
            { href: '/guides/national-support', label: '국비지원 신청' },
            { href: '/faq', label: '자주 묻는 질문' },
            { href: '/online-consulting', label: '수강 상담' },
        ],
    },
    'small-business': {
        slug: 'small-business',
        kicker: '소상공인 가이드',
        icon: 'fa-store',
        h1: '소상공인 3D프린팅, 매장에 바로 쓰는 교육',
        lead: '쿠키틀·몰드·스텐실·소품 제품화 등 매장·제작에 바로 적용하는 단기 실습 과정입니다. 국비 정규과정과는 목적·일정이 다릅니다.',
        sections: [
            {
                h2: '어떤 내용을 배우나요?',
                body: '3D프린터 커스텀, 쿠키틀·스텐실, 실리콘·레진 몰드, 소품 제품화 등 매장용 실습 중심으로 진행합니다.',
            },
            {
                h2: '국비지원 과정과 무엇이 다른가요?',
                body: '소상공인 과정은 매장 활용·단기 실습에 초점을 둡니다. 내일배움카드 정규 직업훈련(국비)과는 커리큘럼·수강 요건이 다를 수 있어, 국비 희망 시 국비지원 가이드와 상담을 병행하세요.',
            },
            {
                h2: '어디서·어떻게 신청하나요?',
                body: '주로 홍대센터 단기 회차로 개설됩니다. 교육과정 목록의 소상공인 과정을 확인한 뒤 온라인 상담 또는 전화로 등록하세요.',
            },
        ],
        links: [
            { href: '/course-sessions', label: '소상공인 과정 보기' },
            { href: '/guides/prototype', label: '시제품 제작 교육' },
            { href: '/online-consulting', label: '맞춤 상담' },
        ],
    },
    prototype: {
        slug: 'prototype',
        kicker: '시제품 가이드',
        icon: 'fa-drafting-compass',
        h1: '3D프린팅 시제품 제작 교육',
        lead: '아이디어·도면을 시제품으로 만드는 모델링·출력·후가공 실무 교육입니다. 기업·개인 맞춤 상담 후 과정에 참여할 수 있습니다.',
        sections: [
            {
                h2: '시제품 교육에서 배우는 범위는?',
                body: '설계·모델링부터 슬라이싱, 출력, 후가공까지 시제품 제작 흐름을 다룹니다. 소상공인 단기 과정(쿠키틀·몰드)보다 제품·부품 시제품에 가깝습니다.',
            },
            {
                h2: '기간·대상은 어떻게 되나요?',
                body: '단기 워크숍부터 NCS 기반 정규 훈련·기업 맞춤까지 회차마다 다릅니다. 일정은 과정 상세와 기업교육 안내에서 확인하세요.',
            },
            {
                h2: '제작 사례는 어디서 보나요?',
                body: '시제품 제작사진 갤러리와 수강생 포트폴리오에서 출력·후가공 사례를 볼 수 있습니다.',
            },
        ],
        links: [
            { href: '/prototype-gallery', label: '시제품 갤러리' },
            { href: '/corporate-education', label: '기업 맞춤 교육' },
            { href: '/guides/small-business', label: '소상공인 교육' },
            { href: '/course-sessions', label: '교육과정' },
        ],
    },
};

/** 메뉴·허브에 노출하는 핵심 학습 가이드 (지역 페이지는 /locations 로 통합) */
export const CORE_GUIDE_SLUGS = ['national-support', 'craftsman-license', 'small-business', 'prototype'] as const;

export const SEO_GUIDE_SLUGS = Object.keys(PAGES);

function linkClass(href: string, index: number): string {
    const isPrimary = href.includes('/course-sessions') || href.includes('/tomorrow-learning-card') || href.includes('/guides/national-support') || index === 0;
    const isConsult = href.includes('/online-consulting');
    if (isConsult) {
        return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-black text-indigo-700 hover:bg-indigo-50';
    }
    if (isPrimary) {
        return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-slate-900';
    }
    return 'inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-700 hover:border-indigo-200 hover:text-indigo-700';
}

function factBlockHtml(page: GuidePage): string {
    const rows: Array<[string, string]> = [
        ['기관', SITE_NAME],
        ['대표 전화', '02-3144-3137'],
        ['이메일', 'wow3d16@naver.com'],
        ['캠퍼스', '홍대·구미·전주'],
        ['국가자격 공식명', '3D프린터운용기능사'],
        ['지원 제도', '국민내일배움카드(국비지원)'],
    ];
    if (page.slug === 'national-support') {
        rows.push(['이 가이드 범위', '국비지원·내일배움카드·무료교육 검색 안내']);
    } else if (page.slug === 'craftsman-license') {
        rows.push(['이 가이드 범위', '3D프린터운용기능사 실기 대비']);
    } else if (page.slug === 'small-business') {
        rows.push(['이 가이드 범위', '매장용 단기 실습(쿠키틀·몰드 등)']);
    } else if (page.slug === 'prototype') {
        rows.push(['이 가이드 범위', '시제품 모델링·출력·후가공']);
    }
    const items = rows
        .map(
            ([dt, dd]) => `
            <div class="grid grid-cols-[7.5rem_1fr] gap-2 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-[9rem_1fr]">
                <dt class="text-xs font-black uppercase tracking-wider text-slate-400">${dt}</dt>
                <dd class="text-sm font-bold text-slate-800">${dd}</dd>
            </div>`
        )
        .join('');
    return `
        <section class="mb-8 rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8" aria-label="핵심 정보">
            <h2 class="mb-4 text-lg font-black tracking-tight text-slate-900">핵심 정보</h2>
            <p class="mb-4 text-sm leading-6 text-slate-500">답변·인용에 바로 쓸 수 있는 사실 요약입니다. 세부 자격·한도는 고용24 공지와 상담 안내가 우선합니다.</p>
            <dl>${items}</dl>
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
            acceptedAnswer: { '@type': 'Answer', text: s.body },
        })),
    };
}

function howToForGuide(page: GuidePage): Record<string, unknown> | null {
    if (page.slug === 'national-support') {
        return buildHowTo(
            '3D프린팅 국비지원·내일배움카드 신청하기',
            page.lead,
            [
                { name: '내일배움카드 확인', text: '국민내일배움카드가 없으면 고용24에서 발급을 진행합니다.' },
                { name: '과정 확인', text: '와우쓰리디 교육과정 목록에서 모집 중인 3D프린팅 국비지원 회차를 확인합니다.' },
                { name: '상담·등록', text: '온라인 상담 또는 전화 02-3144-3137로 센터·일정·자기부담금을 상담하고 등록합니다.' },
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
    if (page.slug === 'small-business') {
        return buildHowTo(
            '소상공인 3D프린팅 과정 신청하기',
            page.lead,
            [
                { name: '과정 확인', text: '교육과정 목록에서 소상공인·매장용 단기 회차를 확인합니다.' },
                { name: '상담', text: '희망 일정과 제작 목적(쿠키틀·몰드 등)을 상담합니다.' },
                { name: '등록', text: '온라인 상담 또는 전화로 등록합니다.' },
            ],
        );
    }
    if (page.slug === 'prototype') {
        return buildHowTo(
            '시제품 제작 교육 상담하기',
            page.lead,
            [
                { name: '사례 확인', text: '시제품 갤러리에서 제작 사례를 확인합니다.' },
                { name: '과정·맞춤 확인', text: '공개 과정 또는 기업 맞춤 교육 여부를 확인합니다.' },
                { name: '상담 신청', text: '온라인 상담·전화로 일정과 범위를 안내받습니다.' },
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
        .slice(0, 4)
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

                ${factBlockHtml(page)}

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
