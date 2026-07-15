/**
 * 검색엔진(네이버, 구글 등) 최적화용 메타·OG·JSON-LD 생성
 * 외부 도메인 연동 시 검색 노출 및 SNS 공유 미리보기용
 */

export const SITE_ORIGIN = 'https://3dcookiehd.com';
export const SITE_NAME = '와우쓰리디홍대센터';
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

export type SiteVerification = {
    google?: string;
    naver?: string;
};

/**
 * 페이지별 <head>에 넣을 SEO 메타·OG·Twitter·캐노니컬·JSON-LD HTML 문자열 반환
 * @param baseUrl 사이트 루트 URL (예: https://example.com, 마지막 슬래시 제외)
 */
export function getSeoHead(baseUrl: string, options: SeoOptions, verification: SiteVerification = {}): string {
    const origin = (baseUrl || SITE_ORIGIN).replace(/\/$/, '');
    const title = options.title.includes(SITE_NAME) ? options.title : `${options.title} - ${SITE_NAME}`;
    const description = options.description ?? DEFAULT_DESCRIPTION;
    const keywords = options.keywords ?? DEFAULT_KEYWORDS;
    const image = options.image
        ? (options.image.startsWith('http') ? options.image : `${origin}${options.image.replace(/^\//, '/')}`)
        : '';
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
        `<meta property="og:locale" content="ko_KR">`,
        // Twitter Card
        `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
        `<meta name="twitter:title" content="${escapeAttr(title)}">`,
        `<meta name="twitter:description" content="${escapeAttr(description)}">`,
    ];
    if (image) {
        metaTags.push(
            `<meta property="og:image" content="${escapeAttr(image)}">`,
            `<meta name="twitter:image" content="${escapeAttr(image)}">`,
        );
    }
    if (verification.google) {
        metaTags.push(`<meta name="google-site-verification" content="${escapeAttr(verification.google)}">`);
    }
    for (const token of (verification.naver || '').split(',').map((value) => value.trim()).filter(Boolean)) {
        metaTags.push(`<meta name="naver-site-verification" content="${escapeAttr(token)}">`);
    }

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

/** 교육기관 + 웹사이트 + 페이지 JSON-LD */
function getJsonLd(origin: string, title: string, description: string, url: string): string {
    const organization = {
        '@type': 'EducationalOrganization',
        '@id': `${origin}/#organization`,
        name: SITE_NAME,
        legalName: '와우쓰리디홍대센터',
        url: origin,
        description: DEFAULT_DESCRIPTION,
        email: 'wow3d16@naver.com',
        telephone: '+82-2-3144-3137',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '독막로 93 4층 (상수동, 상수빌딩)',
            addressLocality: '마포구',
            addressRegion: '서울특별시',
            addressCountry: 'KR',
        },
    };
    const webSite = {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        description,
        publisher: { '@id': `${origin}/#organization` },
        inLanguage: 'ko-KR',
    };
    const page = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: title,
        description,
        url,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
        inLanguage: 'ko-KR',
    };
    return `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [organization, webSite, page],
    })}</script>`;
}

const PAGE_SEO: Record<string, Pick<SeoOptions, 'title' | 'description' | 'keywords' | 'ogType'>> = {
    '/': {
        title: '4차산업 3D프린팅 교육 전문',
        description: DEFAULT_DESCRIPTION,
    },
    '/greeting': {
        title: '센터 소개',
        description: '와우쓰리디홍대센터의 교육 철학과 3D프린팅 전문 교육 방향을 소개합니다.',
    },
    '/education-photos': {
        title: '교육 현장',
        description: '3D모델링과 3D프린팅 실무 교육 현장을 사진으로 확인하세요.',
    },
    '/facilities': {
        title: '교육시설 및 장비',
        description: '와우쓰리디홍대센터의 3D프린터, 실습실 및 전문 교육시설을 안내합니다.',
    },
    '/locations': {
        title: '오시는 길',
        description: '와우쓰리디 홍대·구미·전주 교육센터의 주소와 연락처를 안내합니다.',
    },
    '/online-consulting': {
        title: '교육 상담 신청',
        description: '3D프린팅 국비지원 과정과 실무 교육에 대해 온라인으로 상담을 신청하세요.',
    },
    '/tomorrow-learning-card': {
        title: '국민내일배움카드 교육',
        description: '국민내일배움카드로 참여 가능한 3D프린팅·3D모델링 직업훈련 과정을 안내합니다.',
    },
    '/corporate-education': {
        title: '기업 맞춤형 교육',
        description: '기업의 업무와 기술 수준에 맞춘 3D프린팅·3D모델링 실무 교육을 제공합니다.',
    },
    '/university-education': {
        title: '대학 맞춤형 교육',
        description: '대학과 학과의 교육 목표에 맞춘 3D프린팅 실습 및 프로젝트 교육을 제공합니다.',
    },
    '/course-sessions': {
        title: '교육과정',
        description: '현재 모집 중인 국비지원 및 3D프린팅 실무 교육과정의 일정과 교육 내용을 확인하세요.',
    },
    '/schedule': {
        title: '교육 일정',
        description: '와우쓰리디홍대센터의 교육과정 일정과 모집 현황을 확인하세요.',
    },
    '/jobs': {
        title: '채용정보',
        description: '3D프린팅·설계·디자인 분야의 채용정보를 확인하세요.',
    },
    '/jobseekers': {
        title: '구직정보',
        description: '3D프린팅 교육 수료생과 전문 인재의 구직정보를 확인하세요.',
    },
    '/reviews': {
        title: '교육 후기',
        description: '와우쓰리디홍대센터 교육생들의 생생한 수강 후기를 확인하세요.',
    },
    '/portfolios': {
        title: '수강생 포트폴리오',
        description: '3D모델링과 3D프린팅 교육을 통해 완성한 수강생 작품을 확인하세요.',
    },
    '/posts': {
        title: '공지사항 및 FAQ',
        description: '교육과정 공지사항, 자주 묻는 질문과 답변을 확인하세요.',
    },
    '/faq': {
        title: '자주 묻는 질문',
        description: '국비지원, 국민내일배움카드, 수강 신청과 3D프린팅 교육에 대한 자주 묻는 질문을 확인하세요.',
    },
    '/prototype-gallery': {
        title: '시제품 제작 사례',
        description: '3D프린팅 기술로 제작한 다양한 시제품과 제작 사례를 확인하세요.',
    },
    '/education-performance': {
        title: '교육 실적',
        description: '와우쓰리디홍대센터의 기업·대학·직업훈련 교육 실적을 확인하세요.',
    },
    '/achievements': {
        title: '주요 성과',
        description: '3D프린팅 전문 교육기관 와우쓰리디홍대센터의 주요 성과와 역량을 소개합니다.',
    },
    '/terms': { title: '이용약관', description: '와우쓰리디홍대센터 웹사이트 이용약관입니다.' },
    '/privacy': { title: '개인정보처리방침', description: '와우쓰리디홍대센터 개인정보처리방침입니다.' },
    '/partnership': { title: '교육 제휴 문의', description: '기업·대학·기관 대상 3D프린팅 교육 제휴를 문의하세요.' },
    '/sitemap': { title: '사이트맵', description: '와우쓰리디홍대센터 웹사이트의 주요 메뉴를 안내합니다.' },
};

export function getSeoOptionsForPath(path: string): SeoOptions | null {
    if (PAGE_SEO[path]) return { ...PAGE_SEO[path], path };
    if (/^\/course-sessions\/[0-9]+$/.test(path)) {
        return {
            title: '교육과정 상세',
            description: '교육과정의 기간, 교육시간, 장소, 강사와 상세 커리큘럼을 확인하세요.',
            path,
        };
    }
    if (/^\/courses\/[0-9]+$/.test(path)) {
        return {
            title: '일반 교육과정 상세',
            description: '3D프린팅 일반 교육과정의 일정과 상세 교육 내용을 확인하세요.',
            path,
        };
    }
    if (/^\/portfolios\/[0-9]+$/.test(path)) {
        return {
            title: '수강생 포트폴리오 상세',
            description: '와우쓰리디 교육생이 완성한 3D모델링·3D프린팅 작품을 소개합니다.',
            path,
            ogType: 'article',
        };
    }
    return null;
}

export function isNoindexPath(path: string): boolean {
    return /^(\/api(?:\/|$)|\/admin(?:\/|$)|\/teacher(?:\/|$)|\/student(?:\/|$)|\/login$|\/register$|\/reset-password(?:\/|$))/.test(path);
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
    '/faq',
    '/prototype-gallery',
    '/education-performance',
    '/achievements',
    '/terms',
    '/privacy',
    '/partnership',
    '/sitemap',
];
