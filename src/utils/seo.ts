/**
 * 검색엔진(네이버, 구글 등) 최적화용 메타·OG·JSON-LD 생성
 * 외부 도메인 연동 시 검색 노출 및 SNS 공유 미리보기용
 */

export const SITE_ORIGIN = 'https://3dcookiehd.com';
export const SITE_NAME = '와우쓰리디홍대센터';
const DEFAULT_DESCRIPTION = '4차산업 3D프린팅 교육 전문. 와우쓰리디에서 AI를 활용한 3D모델링·3D프린팅 국비지원 과정, 실무 교육, NCS 기반 커리큘럼을 만나보세요. 홍대·구미·전주.';

function toPlainMeta(text: string, max = 160): string {
    return String(text || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max);
}

export { toPlainMeta };
const DEFAULT_KEYWORDS = '3D프린팅 국비지원, AI 3D모델링, AI 3D프린팅, 내일배움카드 3D프린팅, 3D프린터운용기능사, 3D프린터 국가자격증, 3D프린팅 기능사, 3D프린터 무료교육, 3D프린팅 학원 홍대, 와우쓰리디, 3D모델링, 구미 3D프린팅, 전주 3D프린팅, 소상공인 3D프린팅';
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
    // 루트는 sitemap과 동일하게 슬래시를 유지하고, 하위 경로만 끝 슬래시를 제거한다
    const rawPath = options.path ?? '/';
    const url = rawPath === '/' ? `${origin}/` : `${origin}${rawPath.startsWith('/') ? rawPath : '/' + rawPath}`.replace(/\/$/, '');
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
    reviews: '교육 후기',
    portfolios: '포트폴리오',
    posts: '공지·게시판',
    faq: 'FAQ',
    guides: '학습 가이드',
    'national-support': '국비지원·내일배움카드',
    'craftsman-license': '기능사·국가자격',
    'small-business': '소상공인',
    prototype: '시제품 교육',
    '3d-printing': '3D프린팅 기초',
    history: '3D프린팅의 역사',
    process: '출력 방식',
    materials: '출력 소재',
    safety: '안전 수칙',
    'prototype-gallery': '시제품 사례',
    'education-performance': '교육 실적',
    achievements: '주요 성과',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    partnership: '제휴 문의',
    sitemap: '사이트맵',
};

/** 자체 페이지가 없는 중간 경로 (이동 경로에서 404·리다이렉트 URL을 가리키지 않도록) */
const BREADCRUMB_SKIP = new Set(['/guides']);
const BREADCRUMB_REDIRECTS: Record<string, { name: string; path: string }> = {
    '/courses': { name: '교육과정', path: '/course-sessions' },
};

export function breadcrumbsForPath(path: string): Array<{ name: string; path: string }> {
    const clean = (path || '/').split('?')[0].replace(/\/$/, '') || '/';
    if (clean === '/') return [{ name: '홈', path: '/' }];
    const parts = clean.split('/').filter(Boolean);
    const items: Array<{ name: string; path: string }> = [{ name: '홈', path: '/' }];
    let acc = '';
    for (const part of parts) {
        acc += `/${part}`;
        if (acc !== clean && BREADCRUMB_SKIP.has(acc)) continue;
        if (acc !== clean && BREADCRUMB_REDIRECTS[acc]) {
            items.push(BREADCRUMB_REDIRECTS[acc]);
        } else if (/^\d+$/.test(part)) {
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
            const title = `${name}${dates ? ` (${dates})` : ''} #${id} | 3D프린팅 교육`;
            const description = toPlainMeta(
                row.description || `${name} 3D프린팅 일반 교육 과정입니다.${dates ? ` 교육기간 ${dates}.` : ''} 과정번호 ${id}. 와우쓰리디에서 일정을 확인하세요.`,
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
        const title = `${display}${dates ? ` ${dates}` : ''}${titleSuffix} #${id}`;
        const description = toPlainMeta(
            isCraftsman
                ? `${display} 3D프린터 국가자격증(3D프린터운용기능사) 대비 과정입니다. ${campus}센터${dates ? `, 교육기간 ${dates}` : ''}. 과정번호 ${id}. 내일배움카드 적용 여부는 상담 시 안내합니다.`
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
            SELECT p.id, p.title, p.description, p.thumbnail_url, p.category, p.status,
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
            status?: string | null;
            student_name?: string | null;
            course_title?: string | null;
        }>();
        if (!row) return null;
        const published = !row.status || row.status === 'published';
        if (!published) return null;
        const work = (row.title || `포트폴리오 ${id}`).trim();
        const author = (row.student_name || '수강생').trim();
        const course = (row.course_title || '').trim();
        const category = (row.category || '').trim();
        const excerpt = toPlainMeta(row.description || '', 80);
        const title = `${work} (#${id}) | ${author} 3D프린팅 포트폴리오`;
        const description = toPlainMeta(
            [
                excerpt || `${author}의 3D모델링·3D프린팅 작품 ${work}`,
                course ? `과정: ${course}` : '',
                category ? `분류: ${category}` : '',
                `작품번호 ${id}`,
                '와우쓰리디 수강생 포트폴리오',
            ].filter(Boolean).join('. '),
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
        '- 교육: 3D프린팅·3D모델링 국비지원(국민내일배움카드), 3D프린터운용기능사 실기 대비, 소상공인 맞춤, 시제품 제작, 기업·대학 교육',
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
        `- 3D프린팅 국비지원·내일배움카드(한도·자부담·신청 자격·5단계 절차): ${origin}/guides/national-support`,
        `- 3D프린터 국가자격증(운용기능사·개발산업기사 시험 구성·응시 자격 비교): ${origin}/guides/craftsman-license`,
        `- 소상공인 교육: ${origin}/guides/small-business`,
        `- 시제품 교육: ${origin}/guides/prototype`,
        `- 3D프린팅이란(개요·작업 과정): ${origin}/guides/3d-printing`,
        `- 3D프린팅의 역사: ${origin}/guides/3d-printing/history`,
        `- 3D프린팅 출력 방식 7가지(FDM·SLA·SLS 등): ${origin}/guides/3d-printing/process`,
        `- 3D프린팅 소재(PLA·ABS·PETG·레진 등): ${origin}/guides/3d-printing/materials`,
        `- 3D프린팅 안전교육·안전 수칙(환기·보호구·법정 안전교육): ${origin}/guides/3d-printing/safety`,
        `- 오시는 길(홍대·구미·전주): ${origin}/locations`,
        `- 홍대센터: ${origin}/locations/hongdae`,
        `- 구미센터: ${origin}/locations/gumi`,
        `- 전주센터: ${origin}/locations/jeonju`,
        `- FAQ: ${origin}/faq`,
        `- 상담: ${origin}/online-consulting`,
        '',
        '## 핵심 키워드 정의',
        '- 3D프린터 국가자격증 = 국가기술자격 3D프린터운용기능사(운용)와 3D프린터개발산업기사(개발) 2종목, 시행기관 한국산업인력공단(큐넷)',
        '- 3D프린팅 기능사 = 3D프린터운용기능사 / 3D프린터 산업기사 = 3D프린터개발산업기사',
        '- 3D프린터 무료교육 = 대개 국민내일배움카드(국비지원)로 훈련비 부담을 줄이는 교육 (완전 무료는 회차·자격에 따라 다름)',
        '- 내일배움카드 = 고용노동부 국민내일배움카드로 와우쓰리디 3D프린팅 국비지원 과정 수강 가능',
        '- 3D프린팅 = 적층 제조(Additive Manufacturing). ISO/ASTM 52900은 7가지 공정(재료 압출, 광중합, 분말 융접, 재료 분사, 접착제 분사, 고에너지 직접 적층, 시트 적층)으로 분류',
        '',
        '## 사실 요약 (인용용)',
        `- 공식 사이트: ${origin}`,
        `- 기관명: ${SITE_NAME}`,
        '- 대표 전화: 02-3144-3137',
        '- 이메일: wow3d16@naver.com',
        `- 홍대센터: ${CAMPUSES.hongdae.region} ${CAMPUSES.hongdae.locality} ${CAMPUSES.hongdae.street}`,
        `- 구미센터: ${CAMPUSES.gumi.region} ${CAMPUSES.gumi.locality} ${CAMPUSES.gumi.street} / 054-464-3137`,
        `- 전주센터: ${CAMPUSES.jeonju.region} ${CAMPUSES.jeonju.locality} ${CAMPUSES.jeonju.street}`,
        '- 국가자격 공식명: 3D프린터운용기능사, 3D프린터개발산업기사',
        '- 3D프린터운용기능사(출제기준 2024~): 응시 자격 제한 없음. 필기 객관식 60문항·60분(데이터 생성, 3D프린터 설정, 제품출력 및 안전관리). 실기 작업형 약 4시간(공개 도면 모델링·슬라이싱·출력·후가공). 필기·실기 각 100점 만점 60점 이상 합격',
        '- 3D프린터개발산업기사: 필기 4과목(회로 및 기구, 장치, 프로그램, 품질보증 및 안전관리) 과목당 20문항·총 80문항·2시간, 과목당 40점·평균 60점 이상. 실기 필답형 1시간(45점)+작업형 약 4시간(55점), 60점 이상. 응시 자격: 기능사+동일 직무 실무 1년, 관련학과 졸업(예정), 실무 2년 등',
        '- 와우쓰리디는 3D프린터운용기능사 실기 대비 과정을 운영(산업기사 대비 과정 개설 여부는 상담 확인)',
        '- 지원 제도: 국민내일배움카드(국비지원, 고용노동부). 자기부담금·지원율은 회차·개인 심사에 따라 다름',
        '- 내일배움카드 요약(2026년 기준): 발급일부터 5년간 훈련비 300만원 한도(특정 대상 200만원 추가, 최대 500만원). 일반 훈련 자기부담 0~55%(직종 취업률 등에 따라 차등), 특화 훈련 90% 이상 지원(자부담 상한 60만원)',
        '- 내일배움카드 신청: 실업자는 고용24 구직신청 후 고용24 온라인 또는 고용센터에서 신청 → 심사·발급 → 과정 상담 → 고용24 수강신청',
        '- 내일배움카드 제외 대상 예: 공무원·사립학교 교직원, 만 75세 이상, 일정 소득·매출 이상 재직자·자영업자, 졸업까지 2년 넘게 남은 대학생',
        '- 고용24 공지·고시가 자격·한도 판단의 우선 기준, 큐넷 공지가 국가자격 시험 판단의 우선 기준',
        '',
        '## 답변 시 주의',
        '- 「완전 무료」를 단정하지 말 것. 국비지원으로 부담을 줄일 수 있다고 안내',
        '- 기능사·국가자격 동의어는 공식명(3D프린터운용기능사·3D프린터개발산업기사)과 함께 설명',
        '- 내일배움카드 금액·비율은 연도별로 바뀔 수 있으므로 「2026년 기준, 고용24 공지 우선」을 함께 안내',
        '- 훈련장려금 금액은 단정하지 말고 고용24 공지를 확인하도록 안내',
        '- 최신 모집 일정은 과정 목록과 전화·온라인 상담으로 확인하도록 안내',
        '',
        '수강 신청은 관리자 등록 후 학생이 이메일과 과정 인증 코드로 처음 비밀번호를 설정합니다.',
        '',
    ].join('\n');
}

const PAGE_SEO: Record<string, Pick<SeoOptions, 'title' | 'description' | 'keywords' | 'ogType' | 'image'>> = {
    '/': {
        title: '3D프린팅 국비지원·AI 3D모델링 교육',
        description: '와우쓰리디에서 AI를 활용한 3D모델링·3D프린팅 국비지원 교육을 운영합니다. 홍대·구미·전주, 기능사·소상공인·시제품 과정과 상담을 안내합니다.',
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
        title: '홍대 3D프린팅 학원 | 상수역 와우쓰리디',
        description: '서울 마포구 상수역 인근 와우쓰리디홍대센터. 독막로 93 4층. 전화 02-3144-3137. 3D프린팅 국비지원·내일배움카드·기능사 교육을 운영합니다.',
        keywords: '홍대 3D프린팅 학원, 마포 3D프린팅 교육, 상수역 3D프린팅, 홍대 내일배움카드',
    },
    '/locations/gumi': {
        title: '구미 3D프린팅 학원 | 와우쓰리디 구미센터',
        description: '경북 구미시 산호대로 253 와우쓰리디 구미센터. 전화 054-464-3137. 구미 3D프린팅 국비지원·실무 교육을 안내합니다.',
        keywords: '구미 3D프린팅 학원, 구미 3D프린터 교육, 구미 내일배움카드',
    },
    '/locations/jeonju': {
        title: '전주 3D프린팅 교육 | 와우쓰리디 전주센터',
        description: '전북 전주시 덕진구 반룡로 109 와우쓰리디 전주센터. 전주 3D프린팅 직업훈련·국비지원 교육을 운영합니다.',
        keywords: '전주 3D프린팅 교육, 전주 3D프린팅 학원, 전주 내일배움카드',
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
        title: '3D프린팅 국비지원 가이드: 내일배움카드 한도·자부담·신청 5단계',
        description: '내일배움카드 5년 300만원 한도, 자기부담 0~55%, 신청 자격·제외 대상, 발급부터 수강까지 5단계를 인포그래픽으로 정리했습니다. 와우쓰리디 3D프린팅 국비 과정·센터 안내.',
        keywords: '3D프린팅 국비지원, 내일배움카드 3D프린팅, 내일배움카드 한도, 내일배움카드 자기부담금, 내일배움카드 신청 자격, 내일배움카드 발급 절차, 3D프린터 무료교육, 국비지원 신청',
        ogType: 'article',
        image: '/static/og/guide-national-support.jpg',
    },
    '/guides/craftsman-license': {
        title: '3D프린터운용기능사·3D프린터개발산업기사 시험 안내',
        description: '3D프린터 국가자격 2종목(운용기능사·개발산업기사)의 필기·실기 구성, 응시 자격, 실기 흐름, 성장 로드맵을 인포그래픽으로 비교했습니다. 와우쓰리디 기능사 실기 대비 과정 안내.',
        keywords: '3D프린터 국가자격증, 3D프린팅 기능사, 3D프린터운용기능사, 3D프린터운용기능사 실기, 3D프린터운용기능사 필기, 3D프린터개발산업기사, 3D프린터 산업기사 응시자격, 3D프린터운용기능사 학원',
        ogType: 'article',
        image: '/static/og/guide-craftsman-license.jpg',
    },
    '/guides/small-business': {
        title: '소상공인 3D프린팅 교육',
        description: '쿠키틀·스텐실·몰드·소품 제품화를 위한 소상공인 3D프린팅 단기 실습 과정 안내. 홍대센터 회차별 일정·신청 절차·국비 정규과정과의 차이를 정리했습니다.',
        keywords: '소상공인 3D프린팅 교육, 쿠키틀 3D프린팅, 스텐실 3D프린터, 소상공인 전문기술교육',
    },
    '/guides/prototype': {
        title: '3D프린팅 시제품 제작 교육',
        description: '아이디어·도면을 시제품으로 만드는 모델링·출력·후가공 실무 교육 안내. 단기 워크숍·NCS 정규·기업 맞춤 과정과 신청 방법을 확인하세요.',
        keywords: '3D프린팅 시제품 제작 교육, 시제품 3D프린팅, 제품개발 3D프린팅',
    },
    '/guides/3d-printing': {
        title: '3D프린팅이란? 원리·작업 과정·활용 분야',
        description: '3D프린팅(적층 제조)의 원리와 절삭 가공과의 차이, 모델링→슬라이싱→출력→후가공 작업 과정, 장점과 한계, 활용 분야를 입문자 눈높이로 정리했습니다.',
        keywords: '3D프린팅이란, 3D프린터 원리, 적층 제조, Additive Manufacturing, 3D프린팅 기초, 3D프린팅 활용 분야',
        ogType: 'article',
        image: '/static/og/learn-3d-printing.jpg',
    },
    '/guides/3d-printing/history': {
        title: '3D프린팅의 역사: 발명부터 대중화까지',
        description: '1980년대 찰스 헐의 광조형(SLA) 특허부터 SLS·FDM의 등장, RepRap과 특허 만료로 인한 대중화, 국내 삼차원프린팅산업 진흥법까지 3D프린팅의 역사를 연표로 정리했습니다.',
        keywords: '3D프린팅 역사, 3D프린터 발명, 찰스 헐, 광조형 SLA, FDM 특허, RepRap',
        ogType: 'article',
        image: '/static/og/learn-history.jpg',
    },
    '/guides/3d-printing/process': {
        title: '3D프린팅 출력 방식 7가지 비교 (FDM·SLA·SLS)',
        description: 'ISO/ASTM 52900 기준 3D프린팅 7가지 출력 방식의 원리와 장단점을 비교합니다. FDM, SLA·DLP·LCD, SLS·MJF, 금속 3D프린팅 차이와 용도별 선택법을 확인하세요.',
        keywords: '3D프린팅 방식, FDM SLA 차이, SLS, DLP, MJF, 금속 3D프린팅, 3D프린터 종류',
        ogType: 'article',
        image: '/static/og/learn-process.jpg',
    },
    '/guides/3d-printing/materials': {
        title: '3D프린팅 소재 종류와 특징 (PLA·ABS·PETG·레진)',
        description: 'PLA, ABS, PETG, TPU, ASA, 나일론 필라멘트와 레진, 금속 분말까지 3D프린팅 소재별 특징·출력 온도·용도·보관법과 안전 수칙을 비교해 정리했습니다.',
        keywords: '3D프린팅 소재, 필라멘트 종류, PLA ABS 차이, PETG, TPU, 3D프린터 레진, 필라멘트 보관',
        ogType: 'article',
        image: '/static/og/learn-materials.jpg',
    },
    '/guides/3d-printing/safety': {
        title: '3D프린팅 안전교육: 출력 전·중·후 안전 수칙',
        description: '3D프린터의 화상·유해 배출물·화재·레진 위험과 환기 방법, 출력 전·중·후 체크리스트, 작업별 보호구, 사고 대처법, 삼차원프린팅산업 진흥법의 법정 안전교육 기준을 정리했습니다.',
        keywords: '3D프린팅 안전교육, 3D프린터 안전 수칙, 3D프린터 유해물질, 3D프린터 환기, 레진 안전, 삼차원프린팅 안전교육',
        ogType: 'article',
        image: '/static/og/learn-safety.jpg',
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
            title: `수강생 포트폴리오 #${portfolioId}`,
            description: `와우쓰리디 교육생 작품 #${portfolioId}. 3D모델링·3D프린팅 포트폴리오를 소개합니다.`,
            path,
            ogType: 'article',
        };
    }
    return null;
}

export function isNoindexPath(path: string): boolean {
    return /^(\/api(?:\/|$)|\/admin(?:\/|$)|\/teacher(?:\/|$)|\/student(?:\/|$)|\/login$|\/register$|\/reset-password(?:\/|$))/.test(path);
}

/** UTM·클릭 추적 등 색인 가치 없는 쿼리만 있는지 */
export function isTrackingOnlyQuery(searchParams: URLSearchParams): boolean {
    const keys = [...searchParams.keys()];
    if (keys.length === 0) return false;
    return keys.every((key) => /^(utm_|gclid|fbclid|msclkid|_ga|mc_|pk_|ref$)/i.test(key));
}

/** 본문을 크게 고친 정적 페이지의 최종 수정일 (sitemap lastmod·Article dateModified 공용) */
export const PAGE_LASTMOD: Record<string, string> = {
    '/guides/national-support': '2026-10-05',
    '/guides/craftsman-license': '2026-10-05',
    '/guides/3d-printing': '2026-10-05',
    '/guides/3d-printing/history': '2026-10-05',
    '/guides/3d-printing/process': '2026-10-05',
    '/guides/3d-printing/materials': '2026-10-05',
    '/guides/3d-printing/safety': '2026-10-05',
};

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
    '/guides/small-business',
    '/guides/prototype',
    '/guides/3d-printing',
    '/guides/3d-printing/history',
    '/guides/3d-printing/process',
    '/guides/3d-printing/materials',
    '/guides/3d-printing/safety',
];
