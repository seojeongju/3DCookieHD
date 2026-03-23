/**
 * 검색엔진(네이버, 구글 등) 최적화용 메타·OG·JSON-LD 생성
 * 외부 도메인 연동 시 검색 노출 및 SNS 공유 미리보기용
 */

const SITE_NAME = '와우쓰리디홍대센터';
const DEFAULT_DESCRIPTION = '4차산업 3D프린팅 교육 전문. 와우쓰리디홍대센터에서 3D 모델링·프린팅 국비지원 과정, 실무 교육, NCS 기반 커리큘럼을 만나보세요. 홍대·구미·전주.';
const DEFAULT_KEYWORDS = '와우쓰리디, 3D프린팅, 3D모델링, 국비지원교육, NCS, 홍대교육, 구미교육, 전주교육, 4차산업, 직업훈련';

export type SeoOptions = {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    /** 현재 페이지 경로 (앞에 / 포함, 예: /course-sessions) */
    path?: string;
    /** true면 검색엔진 색인 제외 (관리자·로그인 전용 페이지 등) */
    noindex?: boolean;
    /** og:type (기본: website) */
    ogType?: 'website' | 'article';
};

/**
 * 페이지별 <head>에 넣을 SEO 메타·OG·Twitter·캐노니컬·JSON-LD HTML 문자열 반환
 * @param baseUrl 사이트 루트 URL (예: https://example.com, 마지막 슬래시 제외)
 */
export function getSeoHead(baseUrl: string, options: SeoOptions): string {
    const origin = baseUrl.replace(/\/$/, '');
    const title = options.title.includes(SITE_NAME) ? options.title : `${options.title} - ${SITE_NAME}`;
    const description = options.description ?? DEFAULT_DESCRIPTION;
    const keywords = options.keywords ?? DEFAULT_KEYWORDS;
    const image = options.image?.startsWith('http') ? options.image : `${origin}${(options.image ?? '/static/hero1.jpg').replace(/^\//, '/')}`;
    const url = `${origin}${(options.path ?? '/').replace(/^\//, '/')}`.replace(/([^/])\/$/, '$1');
    const noindex = options.noindex === true;
    const ogType = options.ogType ?? 'website';

    const metaTags: string[] = [
        `<meta name="description" content="${escapeAttr(description)}">`,
        `<meta name="keywords" content="${escapeAttr(keywords)}">`,
        `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}">`,
        `<link rel="canonical" href="${escapeAttr(url)}">`,
        // Open Graph (네이버·페이스북·카카오 등)
        `<meta property="og:type" content="${ogType}">`,
        `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
        `<meta property="og:title" content="${escapeAttr(title)}">`,
        `<meta property="og:description" content="${escapeAttr(description)}">`,
        `<meta property="og:url" content="${escapeAttr(url)}">`,
        `<meta property="og:image" content="${escapeAttr(image)}">`,
        `<meta property="og:locale" content="ko_KR">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        // Twitter Card
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${escapeAttr(title)}">`,
        `<meta name="twitter:description" content="${escapeAttr(description)}">`,
        `<meta name="twitter:image" content="${escapeAttr(image)}">`,
    ];

    const jsonLd = getJsonLd(origin, title, description, url);
    return metaTags.join('\n    ') + '\n    ' + jsonLd;
}

function escapeAttr(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Organization + WebSite JSON-LD (구글 검색 결과 고급 스니펫용) */
function getJsonLd(origin: string, title: string, description: string, url: string): string {
    const organization = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: origin,
        description: DEFAULT_DESCRIPTION,
        logo: `${origin}/static/hero1.jpg`,
    };
    const webSite = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: origin,
        description,
        potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${origin}/course-sessions?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
        },
    };
    const page = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url,
    };
    const script = [
        JSON.stringify(organization),
        JSON.stringify(webSite),
        JSON.stringify(page),
    ]
        .map((j) => `<script type="application/ld+json">${j}</script>`)
        .join('\n    ');
    return script;
}

/** sitemap.xml에 넣을 공개 URL 목록 (경로만, 앞에 / 포함) */
export const PUBLIC_PATHS: string[] = [
    '/',
    '/greeting',
    '/education-photos',
    '/facilities',
    '/locations',
    '/online-consulting',
    '/tomorrow-learning-card',
    '/corporate-education',
    '/university-education',
    '/course-sessions',
    '/schedule',
    '/jobs',
    '/jobseekers',
    '/reviews',
    '/portfolios',
    '/posts',
    '/prototype-gallery',
    '/education-performance',
    '/achievements',
    '/login',
    '/register',
    '/terms',
    '/privacy',
    '/partnership',
    '/sitemap',
];
