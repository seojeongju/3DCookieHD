/**
 * 검색엔진(네이버, 구글 등) 최적화용 메타·OG·JSON-LD 생성
 * 외부 도메인 연동 시 검색 노출 및 SNS 공유 미리보기용
 */

export const SITE_ORIGIN = 'https://3dcookiehd.com';
export const SITE_NAME = '와우쓰리디홍대센터';
const DEFAULT_DESCRIPTION = '4차산업 3D프린팅 교육 전문. 와우쓰리디홍대센터에서 3D 모델링·프린팅 국비지원 과정, 실무 교육, NCS 기반 커리큘럼을 만나보세요. 홍대·구미·전주.';

function toPlainMeta(text: string, max = 160): string {
    return String(text || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max);
}
const DEFAULT_KEYWORDS = '3D프린팅 국비지원, 내일배움카드 3D프린팅, 3D프린터운용기능사, 3D프린터 국가자격증, 3D프린팅 기능사, 3D프린터 무료교육, 3D프린팅 학원 홍대, 와우쓰리디, 3D모델링, 구미 3D프린팅, 전주 3D프린팅, 소상공인 3D프린팅';
const DEFAULT_OG_IMAGE = '/static/hero1.jpg';

export const CAMPUSES = {
    hongdae: {
        slug: 'hongdae',
        name: '와우쓰리디 홍대센터',
        telephone: '+82-2-3144-3137',
        street: '독막로 93 4층 (상수동, 상수빌딩)',
        locality: '마포구',
        region: '서울특별시',
        postalCode: '04072',
        keyword: '홍대 3D프린팅 학원',
    },
    gumi: {
        slug: 'gumi',
        name: '와우쓰리디 구미센터',
        telephone: '+82-54-464-3137',
        street: '산호대로 253 606호 (공단동, 구미첨단의료기술타워)',
        locality: '구미시',
        region: '경상북도',
        postalCode: '39371',
        keyword: '구미 3D프린팅 학원',
    },
    jeonju: {
        slug: 'jeonju',
        name: '와우쓰리디 전주센터',
        telephone: '+82-2-3144-3137',
        street: '반룡로 109 207호 (팔복동, 테크노빌 A동)',
        locality: '전주시 덕진구',
        region: '전북특별자치도',
        postalCode: '54810',
        keyword: '전주 3D프린팅 교육',
    },
} as const;

export type CampusSlug = keyof typeof CAMPUSES;

export type SeoOptions = {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    path?: string;
    noindex?: boolean;
    ogType?: 'website' | 'article';
    extraJsonLd?: unknown[];
};

export type SiteVerification = {
    google?: string;
    naver?: string;
};

export function formatSeoTitle(title: string): string {
    return title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
}

/**
 * 페이지별 <head>에 넣을 SEO 메타·OG·Twitter·캐노니컬·JSON-LD HTML 문자열 반환
 */
export function getSeoHead(baseUrl: string, options: SeoOptions, verification: SiteVerification = {}): string {
    const origin = (baseUrl || SITE_ORIGIN).replace(/\/$/, '');
    const title = formatSeoTitle(options.title);
    const description = options.description ?? DEFAULT_DESCRIPTION;
    const keywords = options.keywords ?? DEFAULT_KEYWORDS;
    const rawImage = options.image || DEFAULT_OG_IMAGE;
    const image = rawImage.startsWith('http') ? rawImage : `${origin}${rawImage.startsWith('/') ? rawImage : '/' + rawImage}`;
    const url = `${origin}${(options.path ?? '/').replace(/^\//, '/')}`.replace(/([^/])\/$/, '$1');
    const noindex = options.noindex === true;
    const ogType = options.ogType ?? 'website';

    const metaTags: string[] = [
        `<title>${escapeAttr(title)}</title>`,
        `<meta name="description" content="${escapeAttr(description)}">`,
        `<meta name="keywords" content="${escapeAttr(keywords)}">`,
        `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}">`,
        `<link rel="canonical" href="${escapeAttr(url)}">`,
        `<meta property="og:type" content="${ogType}">`,
        `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
        `<meta property="og:title" content="${escapeAttr(title)}">`,
        `<meta property="og:description" content="${escapeAttr(description)}">`,
        `<meta property="og:url" content="${escapeAttr(url)}">`,
        `<meta property="og:locale" content="ko_KR">`,
        `<meta property="og:image" content="${escapeAttr(image)}">`,
        `<meta property="og:image:alt" content="${escapeAttr(title)}">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${escapeAttr(title)}">`,
        `<meta name="twitter:description" content="${escapeAttr(description)}">`,
        `<meta name="twitter:image" content="${escapeAttr(image)}">`,
    ];
    if (verification.google) {
        metaTags.push(`<meta name="google-site-verification" content="${escapeAttr(verification.google)}">`);
    }
    for (const token of (verification.naver || '').split(',').map((value) => value.trim()).filter(Boolean)) {
        metaTags.push(`<meta name="naver-site-verification" content="${escapeAttr(token)}">`);
    }

    const jsonLd = getJsonLd(origin, title, description, url, options.path, options.extraJsonLd);
    return metaTags.join('\n    ') + '\n    ' + jsonLd;
}

export function escapeAttr(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** BreadcrumbList JSON-LD */
export function buildBreadcrumbList(
    origin: string,
    items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
    const base = origin.replace(/\/$/, '');
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${base}${item.path === '/' ? '/' : item.path}`,
        })),
    };
}

/** HowTo JSON-LD (발급·신청 절차 등) */
export function buildHowTo(
    name: string,
    description: string,
    steps: Array<{ name: string; text: string }>,
): Record<string, unknown> {
    return {
        '@type': 'HowTo',
        name,
        description,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
        })),
    };
}

const BREADCRUMB_LABELS: Record<string, string> = {
    '': '홈',
    greeting: '센터 소개',
    'education-photos': '교육 현장',
    facilities: '교육시설',
    locations: '오시는 길',
    hongdae: '홍대센터',
    gumi: '구미센터',
    jeonju: '전주센터',
    'online-consulting': '교육 상담',
    'tomorrow-learning-card': '내일배움카드',
    'corporate-education': '기업 교육',
    'university-education': '대학 교육',
    'course-sessions': '교육과정',
    courses: '일반과정',
    schedule: '교육 일정',
    jobs: '채용정보',
    jobseekers: '구직정보',
    reviews: '교육 후기',
    portfolios: '포트폴리오',
    posts: '공지·게시판',
    faq: 'FAQ',
    guides: '학습 가이드',
    'national-support': '국비지원',
    'craftsman-license': '기능사·국가자격',
    'free-education': '무료·국비 교육',
    'hongdae-3d-printing': '홍대 3D프린팅',
    'gumi-3d-printing': '구미 3D프린팅',
    'jeonju-3d-printing': '전주 3D프린팅',
    'small-business': '소상공인',
    prototype: '시제품 교육',
    'prototype-gallery': '시제품 사례',
    'education-performance': '교육 실적',
    achievements: '주요 성과',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    partnership: '제휴 문의',
    sitemap: '사이트맵',
};

export function breadcrumbsForPath(path: string): Array<{ name: string; path: string }> {
    const clean = (path || '/').split('?')[0].replace(/\/$/, '') || '/';
    if (clean === '/') return [{ name: '홈', path: '/' }];
    const parts = clean.split('/').filter(Boolean);
    const items: Array<{ name: string; path: string }> = [{ name: '홈', path: '/' }];
    let acc = '';
    for (const part of parts) {
        acc += `/${part}`;
        if (/^\d+$/.test(part)) {
            items.push({ name: part, path: acc });
        } else {
            items.push({ name: BREADCRUMB_LABELS[part] || part, path: acc });
        }
    }
    return items;
}

function campusLocalBusiness(origin: string, slug: CampusSlug) {
    const campus = CAMPUSES[slug];
    return {
        '@type': 'EducationalOrganization',
        '@id': `${origin}/locations/${slug}#place`,
        name: campus.name,
        url: `${origin}/locations/${slug}`,
        telephone: campus.telephone,
        parentOrganization: { '@id': `${origin}/#organization` },
        address: {
            '@type': 'PostalAddress',
            streetAddress: campus.street,
            addressLocality: campus.locality,
            addressRegion: campus.region,
            postalCode: campus.postalCode,
            addressCountry: 'KR',
        },
        areaServed: campus.region,
    };
}

function getJsonLd(
    origin: string,
    title: string,
    description: string,
    url: string,
    path?: string,
    extraJsonLd?: unknown[],
): string {
    const organization = {
        '@type': 'EducationalOrganization',
        '@id': `${origin}/#organization`,
        name: SITE_NAME,
        legalName: '와우쓰리디홍대센터',
        url: origin,
        description: DEFAULT_DESCRIPTION,
        email: 'wow3d16@naver.com',
        telephone: '+82-2-3144-3137',
        sameAs: ['https://wow3dp.co.kr'],
        address: {
            '@type': 'PostalAddress',
            streetAddress: CAMPUSES.hongdae.street,
            addressLocality: CAMPUSES.hongdae.locality,
            addressRegion: CAMPUSES.hongdae.region,
            addressCountry: 'KR',
        },
        department: (Object.keys(CAMPUSES) as CampusSlug[]).map((slug) => ({ '@id': `${origin}/locations/${slug}#place` })),
    };
    const webSite = {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        description,
        publisher: { '@id': `${origin}/#organization` },
        inLanguage: 'ko-KR',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/course-sessions?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
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
    const graph: unknown[] = [organization, webSite, page];
    if (path && path !== '/') {
        graph.push(buildBreadcrumbList(origin, breadcrumbsForPath(path)));
    }
    if (path === '/' || path === '/locations' || (path && path.startsWith('/locations/'))) {
        (Object.keys(CAMPUSES) as CampusSlug[]).forEach((slug) => graph.push(campusLocalBusiness(origin, slug)));
    }
    if (extraJsonLd?.length) graph.push(...extraJsonLd);
    return `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
    })}</script>`;
}

export function inferCampusLabel(location?: string | null): string {
    const loc = String(location || '');
    if (/구미/.test(loc)) return '구미';
    if (/전주|전북/.test(loc)) return '전주';
    if (/홍대|마포|상수|서울/.test(loc)) return '홍대';
    return '홍대';
}

export function buildCourseJsonLd(origin: string, row: {
    id: number;
    course_name?: string | null;
    session_number?: number | null;
    session_name?: string | null;
    training_start_date?: string | null;
    training_end_date?: string | null;
    location?: string | null;
    instructor_name?: string | null;
    description?: string | null;
}): Record<string, unknown> {
    const name = [row.course_name, row.session_number ? `${row.session_number}회차` : '', row.session_name]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    const start = String(row.training_start_date || '').slice(0, 10);
    const end = String(row.training_end_date || '').slice(0, 10);
    return {
        '@type': 'Course',
        name: name || '3D프린팅 국비지원 과정',
        description: row.description || `${name} 국비지원(내일배움카드) 3D프린팅 교육. ${inferCampusLabel(row.location)}센터.`,
        url: `${origin}/course-sessions/${row.id}`,
        provider: { '@id': `${origin}/#organization` },
        inLanguage: 'ko-KR',
        ...(start ? { hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'onsite',
            startDate: start,
            ...(end ? { endDate: end } : {}),
            location: row.location || CAMPUSES.hongdae.name,
            instructor: row.instructor_name || undefined,
        } } : {}),
    };
}

export async function seoOptionsForSession(
    db: D1Database,
    id: number,
    source: 'session' | 'general',
): Promise<SeoOptions | null> {
    try {
        if (source === 'general') {
            const row = await db.prepare(
                'SELECT id, title, description, thumbnail_url, start_date, end_date FROM courses WHERE id = ?'
            ).bind(id).first<{ id: number; title: string; description?: string; thumbnail_url?: string; start_date?: string; end_date?: string }>();
            if (!row) return null;
            const name = (row.title || `일반과정 ${id}`).trim();
            const dates = [String(row.start_date || '').slice(0, 10), String(row.end_date || '').slice(0, 10)].filter(Boolean).join('~');
            const title = `${name}${dates ? ` (${dates})` : ` #${id}`} | 3D프린팅 교육`;
            const description = toPlainMeta(
                row.description || `${name} 3D프린팅 일반 교육 과정입니다.${dates ? ` 교육기간 ${dates}.` : ''} 와우쓰리디에서 일정을 확인하세요.`,
                160,
            );
            return {
                title,
                description,
                keywords: `${name}, 3D프린팅 교육, 와우쓰리디`,
                image: row.thumbnail_url || DEFAULT_OG_IMAGE,
                path: `/courses/${id}`,
                extraJsonLd: [buildCourseJsonLd(SITE_ORIGIN, {
                    id: row.id,
                    course_name: name,
                    training_start_date: row.start_date,
                    training_end_date: row.end_date,
                    description,
                })],
            };
        }
        const row = await db.prepare(`
            SELECT s.id, s.session_number, s.session_name, s.training_start_date, s.training_end_date,
                   s.location, s.instructor_name, s.main_slide_image_url, s.course_list_image_url,
                   a.name as course_name
            FROM course_sessions s
            LEFT JOIN approved_courses a ON a.id = s.approved_course_id
            WHERE s.id = ?
        `).bind(id).first<{
            id: number;
            session_number: number | null;
            session_name: string | null;
            training_start_date: string | null;
            training_end_date: string | null;
            location: string | null;
            instructor_name: string | null;
            main_slide_image_url: string | null;
            course_list_image_url: string | null;
            course_name: string | null;
        }>();
        if (!row) return null;
        const campus = inferCampusLabel(row.location);
        const display = [row.course_name, row.session_number ? `${row.session_number}회차` : '', row.session_name]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim() || `3D프린팅 교육과정 ${id}`;
        const dates = [String(row.training_start_date || '').slice(0, 10), String(row.training_end_date || '').slice(0, 10)].filter(Boolean).join('~');
        const isCraftsman = /기능사|운용기능사|국가자격/.test(display);
        const titleSuffix = isCraftsman
            ? ` 3D프린터운용기능사 | ${campus}`
            : ` 국비지원 | ${campus} 3D프린팅`;
        const title = `${display}${dates ? ` ${dates}` : ''}${titleSuffix}`;
        const description = toPlainMeta(
            isCraftsman
                ? `${display} 3D프린터 국가자격증(3D프린터운용기능사) 대비 과정입니다. ${campus}센터${dates ? `, 교육기간 ${dates}` : ''}. 내일배움카드 적용 여부는 상담 시 안내합니다.`
                : `${display} 내일배움카드(국비지원) 과정입니다. ${campus}센터${dates ? `, 교육기간 ${dates}` : ''}. 과정번호 ${id}. 와우쓰리디에서 수강 상담하세요.`,
            170,
        );
        return {
            title,
            description,
            keywords: `${display}, 3D프린팅 국비지원, 내일배움카드 3D프린팅, ${campus} 3D프린팅 학원, 3D프린터운용기능사, 3D프린터 국가자격증, 3D프린팅 기능사`,
            image: row.main_slide_image_url || row.course_list_image_url || DEFAULT_OG_IMAGE,
            path: `/course-sessions/${id}`,
            extraJsonLd: [buildCourseJsonLd(SITE_ORIGIN, {
                ...row,
                description,
            })],
        };
    } catch {
        return null;
    }
}

export async function seoOptionsForPortfolio(db: D1Database, id: number): Promise<SeoOptions | null> {
    try {
        const row = await db.prepare(`
            SELECT p.id, p.title, p.description, p.thumbnail_url, p.category,
                   u.name as student_name, c.title as course_title
            FROM student_portfolios p
            LEFT JOIN users u ON p.student_id = u.id
            LEFT JOIN courses c ON p.course_id = c.id
            WHERE p.id = ?
        `).bind(id).first<{
            id: number;
            title?: string | null;
            description?: string | null;
            thumbnail_url?: string | null;
            category?: string | null;
            student_name?: string | null;
            course_title?: string | null;
        }>();
        if (!row) return null;
        const work = (row.title || `포트폴리오 ${id}`).trim();
        const author = (row.student_name || '수강생').trim();
        const course = (row.course_title || '').trim();
        const excerpt = toPlainMeta(row.description || '', 90);
        const title = `${work} | ${author} 3D프린팅 포트폴리오`;
        const description = toPlainMeta(
            [excerpt || `${author}의 3D모델링·3D프린팅 작품 ${work}`, course ? `과정: ${course}` : '', '와우쓰리디 수강생 포트폴리오'].filter(Boolean).join('. '),
            170,
        );
        return {
            title,
            description,
            keywords: `${work}, 3D프린팅 포트폴리오, 3D모델링 작품, ${author}, 와우쓰리디`,
            image: row.thumbnail_url || DEFAULT_OG_IMAGE,
            path: `/portfolios/${id}`,
            ogType: 'article',
        };
    } catch {
        return null;
    }
}

export function llmsTxt(origin: string): string {
    return [
        '# 와우쓰리디홍대센터',
        '',
        `> 4차산업 3D프린팅 직업훈련 기관. 공식 사이트: ${origin}`,
        '',
        '## 기관',
        `- 이름: ${SITE_NAME}`,
        '- 이메일: wow3d16@naver.com',
        '- 교육: 3D프린팅·3D모델링 국비지원(국민내일배움카드), 3D프린터운용기능사, 소상공인 맞춤, 시제품 제작, 기업·대학 교육',
        '',
        '## 캠퍼스',
        ...((Object.keys(CAMPUSES) as CampusSlug[]).map((slug) => {
            const c = CAMPUSES[slug];
            return `- ${c.name}: ${c.region} ${c.locality} ${c.street} / ${c.telephone} / ${origin}/locations/${slug}`;
        })),
        '',
        '## 주요 페이지',
        `- 과정 목록: ${origin}/course-sessions`,
        `- 내일배움카드: ${origin}/tomorrow-learning-card`,
        `- 3D프린팅 국비지원 안내: ${origin}/guides/national-support`,
        `- 3D프린터 국가자격증·기능사: ${origin}/guides/craftsman-license`,
        `- 3D프린터 무료·국비 교육: ${origin}/guides/free-education`,
        `- 홍대 3D프린팅 학원: ${origin}/guides/hongdae-3d-printing`,
        `- 구미 3D프린팅 학원: ${origin}/guides/gumi-3d-printing`,
        `- 전주 3D프린팅 교육: ${origin}/guides/jeonju-3d-printing`,
        `- 소상공인 교육: ${origin}/guides/small-business`,
        `- 시제품 교육: ${origin}/guides/prototype`,
        `- FAQ: ${origin}/faq`,
        `- 상담: ${origin}/online-consulting`,
        '',
        '## 핵심 키워드 정의',
        '- 3D프린터 국가자격증 / 3D프린팅 기능사 = 국가기술자격 3D프린터운용기능사',
        '- 3D프린터 무료교육 = 대개 국민내일배움카드(국비지원)로 훈련비 부담을 줄이는 교육 (완전 무료는 회차·자격에 따라 다름)',
        '- 내일배움카드 = 고용노동부 국민내일배움카드로 와우쓰리디 3D프린팅 국비지원 과정 수강 가능',
        '',
        '수강 신청은 관리자 등록 후 학생이 이메일과 과정 인증 코드로 처음 비밀번호를 설정합니다.',
        '',
    ].join('\n');
}

const PAGE_SEO: Record<string, Pick<SeoOptions, 'title' | 'description' | 'keywords' | 'ogType' | 'image'>> = {
    '/': {
        title: '3D프린팅 국비지원 교육 전문',
        description: '홍대·구미·전주 와우쓰리디에서 국민내일배움카드 3D프린팅·3D모델링 국비지원 교육을 운영합니다. 기능사·소상공인·시제품 과정과 상담을 안내합니다.',
        keywords: DEFAULT_KEYWORDS,
        image: '/static/hero1.jpg',
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
        title: '오시는 길 | 홍대·구미·전주 3D프린팅 학원',
        description: '와우쓰리디 홍대(마포 상수)·구미·전주 3D프린팅 교육센터 주소, 전화, 대중교통을 안내합니다.',
        keywords: '홍대 3D프린팅 학원, 구미 3D프린팅 학원, 전주 3D프린팅 교육, 오시는 길',
    },
    '/locations/hongdae': {
        title: '홍대 3D프린팅 학원 오시는 길',
        description: '서울 마포구 상수역 인근 와우쓰리디홍대센터. 독막로 93 4층. 전화 02-3144-3137. 3D프린팅 국비지원 교육을 운영합니다.',
        keywords: '홍대 3D프린팅 학원, 마포 3D프린팅 교육, 상수역 3D프린팅',
    },
    '/locations/gumi': {
        title: '구미 3D프린팅 학원 오시는 길',
        description: '경북 구미시 산호대로 253 와우쓰리디 구미센터. 전화 054-464-3137. 구미 3D프린팅 국비지원 교육을 안내합니다.',
        keywords: '구미 3D프린팅 학원, 구미 3D프린터 교육',
    },
    '/locations/jeonju': {
        title: '전주 3D프린팅 교육 오시는 길',
        description: '전북 전주시 덕진구 반룡로 109 와우쓰리디 전주센터. 전주 3D프린팅 직업훈련을 운영합니다.',
        keywords: '전주 3D프린팅 교육, 전주 3D프린팅 학원',
    },
    '/online-consulting': {
        title: '교육 상담 신청',
        description: '3D프린팅 국비지원 과정과 실무 교육에 대해 온라인으로 상담을 신청하세요.',
    },
    '/tomorrow-learning-card': {
        title: '내일배움카드 3D프린팅 국비지원',
        description: '국민내일배움카드로 3D프린팅·3D모델링 국비지원 과정을 수강할 수 있습니다. 발급 절차와 와우쓰리디 모집 과정, 무료·국비 안내를 확인하세요.',
        keywords: '내일배움카드 3D프린팅, 3D프린팅 국비지원, 국민내일배움카드, 3D프린터 무료교육',
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
        title: '3D프린팅 국비지원·내일배움카드 교육과정',
        description: '모집 중인 3D프린팅 국비지원·내일배움카드 과정, 3D프린터운용기능사(국가자격), 소상공인 맞춤 과정의 일정과 장소를 확인하세요.',
        keywords: '3D프린팅 국비지원, 3D프린터운용기능사, 내일배움카드 3D프린팅, 3D프린터 무료교육, 소상공인 3D프린팅 교육',
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
        title: '3D프린팅 국비지원·기능사 수강후기',
        description: '와우쓰리디 3D프린팅 국비지원·내일배움카드·3D프린터운용기능사 과정 수강생들의 생생한 교육 후기를 확인하세요.',
        keywords: '3D프린팅 수강후기, 국비지원 후기, 3D프린터운용기능사 후기, 내일배움카드 후기',
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
        title: '3D프린팅 국비지원 FAQ',
        description: '3D프린터 국가자격증, 3D프린팅 기능사, 내일배움카드, 3D프린터 무료교육, 홍대 학원 위치 등 자주 묻는 질문에 답합니다.',
        keywords: '3D프린팅 국비지원 신청, 내일배움카드 3D프린팅, 3D프린터운용기능사, 3D프린터 무료교육',
    },
    '/guides/national-support': {
        title: '3D프린팅 국비지원 받는 방법',
        description: '3D프린팅 국비지원은 국민내일배움카드로 와우쓰리디홍대·구미·전주센터에서 수강할 수 있습니다. 신청 절차와 모집 과정을 안내합니다.',
        keywords: '3D프린팅 국비지원, 내일배움카드 3D프린팅, 3D프린터 무료교육',
        image: '/static/hero2.jpg',
    },
    '/guides/craftsman-license': {
        title: '3D프린터 국가자격증·3D프린팅 기능사 학원',
        description: '3D프린터운용기능사(국가자격) 실기 대비 과정을 와우쓰리디에서 운영합니다. 3D프린팅 기능사 준비, 주말반·평일저녁반 일정과 상담 방법을 확인하세요.',
        keywords: '3D프린터 국가자격증, 3D프린팅 기능사, 3D프린터운용기능사, 3D프린터운용기능사 학원',
        image: '/static/hero5.jpg',
    },
    '/guides/free-education': {
        title: '3D프린터 무료교육·국비지원 안내',
        description: '3D프린터 무료교육은 대개 내일배움카드 국비지원을 의미합니다. 와우쓰리디에서 훈련비 부담을 줄이는 방법과 모집 과정을 안내합니다.',
        keywords: '3D프린터 무료교육, 3D프린팅 국비지원, 내일배움카드 3D프린팅',
        image: '/static/hero3.jpg',
    },
    '/guides/hongdae-3d-printing': {
        title: '홍대 3D프린팅 학원 | 상수역 와우쓰리디',
        description: '홍대·상수역 인근 와우쓰리디홍대센터에서 3D프린팅 국비지원·내일배움카드·3D프린터운용기능사 교육을 운영합니다. 독막로 93 4층.',
        keywords: '홍대 3D프린팅 학원, 마포 3D프린팅 교육, 상수역 3D프린팅, 홍대 내일배움카드',
        image: '/static/hero1.jpg',
    },
    '/guides/gumi-3d-printing': {
        title: '구미 3D프린팅 학원 | 와우쓰리디 구미센터',
        description: '경북 구미 와우쓰리디 구미센터에서 3D프린팅 국비지원·실무 교육을 안내합니다. 산호대로 253 606호.',
        keywords: '구미 3D프린팅 학원, 구미 3D프린터 교육, 구미 내일배움카드',
        image: '/static/hero2.jpg',
    },
    '/guides/jeonju-3d-printing': {
        title: '전주 3D프린팅 교육 | 와우쓰리디 전주센터',
        description: '전북 전주 와우쓰리디 전주센터에서 3D프린팅 직업훈련·국비지원 교육을 운영합니다. 반룡로 109 207호.',
        keywords: '전주 3D프린팅 교육, 전주 3D프린팅 학원, 전주 내일배움카드',
        image: '/static/hero4.jpg',
    },
    '/guides/small-business': {
        title: '소상공인 3D프린팅 교육',
        description: '쿠키틀·몰드·소품 제품화를 위한 소상공인 3D프린팅 맞춤 교육을 홍대센터에서 운영합니다.',
        keywords: '소상공인 3D프린팅 교육, 쿠키틀 3D프린팅',
    },
    '/guides/prototype': {
        title: '3D프린팅 시제품 제작 교육',
        description: '3D프린팅 시제품 제작 교육과 사례를 안내합니다. 기업·개인 실무에 바로 쓰는 모델링·출력 과정을 운영합니다.',
        keywords: '3D프린팅 시제품 제작 교육, 시제품 3D프린팅',
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
    const sessionId = path.match(/^\/course-sessions\/([0-9]+)$/)?.[1];
    if (sessionId) {
        return {
            title: `3D프린팅 국비지원 과정 ${sessionId}회차 상세`,
            description: `와우쓰리디 교육과정 ${sessionId}의 기간, 장소, 강사와 커리큘럼을 확인하세요. 내일배움카드 국비지원 3D프린팅 과정입니다.`,
            path,
        };
    }
    const courseId = path.match(/^\/courses\/([0-9]+)$/)?.[1];
    if (courseId) {
        return {
            title: `일반 교육과정 ${courseId} 상세`,
            description: `와우쓰리디 일반 교육과정 ${courseId}의 일정과 3D프린팅 교육 내용을 확인하세요.`,
            path,
        };
    }
    const portfolioId = path.match(/^\/portfolios\/([0-9]+)$/)?.[1];
    if (portfolioId) {
        return {
            title: `수강생 포트폴리오 ${portfolioId}`,
            description: `와우쓰리디 교육생 작품 ${portfolioId}번. 3D모델링·3D프린팅 포트폴리오를 소개합니다.`,
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
    '/locations/hongdae',
    '/locations/gumi',
    '/locations/jeonju',
    '/guides/national-support',
    '/guides/craftsman-license',
    '/guides/free-education',
    '/guides/hongdae-3d-printing',
    '/guides/gumi-3d-printing',
    '/guides/jeonju-3d-printing',
    '/guides/small-business',
    '/guides/prototype',
];
