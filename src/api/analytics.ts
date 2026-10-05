/**
 * 접속 통계 API (관리자 전용)
 * - website_visits 기반 PV·UV, 접속 유형(기기·브라우저·OS·봇), 유입 경로(채널·도메인·검색어·랜딩 페이지)
 * - 날짜는 모두 한국 시간(KST) 기준. DB timestamp(UTC)는 범위 조건으로만 비교해 인덱스를 사용한다.
 * - scope: public(사람 방문 페이지, 기본) | bots(봇·크롤러) | all(전체 요청)
 * - 목록 API(/pages, /referrers, /visitors, /logs)는 page·size 페이지네이션 지원
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

type Rule = { label: string; any: readonly string[]; none?: readonly string[] };
type SourceRule = Rule & { group: string };

/** User-Agent에 포함되면 봇·자동화 요청으로 본다 (소문자, 부분 일치) */
const BOT_PATTERNS = [
    'bot', 'crawl', 'spider', 'slurp', 'yeti', 'daumoa', 'facebookexternalhit', 'meta-externalagent',
    'headless', 'python', 'curl', 'wget', 'go-http', 'axios', 'node-fetch', 'okhttp', 'java/',
    'httpclient', 'lighthouse', 'monitor', 'scrap', 'ahrefs', 'semrush', 'bytespider', 'petalbot',
] as const;

const DEVICE_RULES: readonly Rule[] = [
    { label: '태블릿', any: ['ipad', 'tablet', 'kindle', 'silk', 'playbook'] },
    { label: '태블릿', any: ['android'], none: ['mobile'] },
    { label: '모바일', any: ['mobi', 'iphone', 'ipod', 'android', 'phone'] },
];

const BROWSER_RULES: readonly Rule[] = [
    { label: '카카오톡', any: ['kakaotalk'] },
    { label: '네이버 앱', any: ['naver('] },
    { label: '인스타그램', any: ['instagram'] },
    { label: '페이스북', any: ['fban', 'fbav'] },
    { label: '삼성 인터넷', any: ['samsungbrowser'] },
    { label: '웨일', any: ['whale'] },
    { label: 'Edge', any: ['edg/', 'edga/', 'edgios/'] },
    { label: 'Opera', any: ['opr/', 'opera'] },
    { label: 'Firefox', any: ['firefox', 'fxios'] },
    { label: 'Chrome', any: ['crios', 'chrome'] },
    { label: 'Safari', any: ['safari'] },
];

const OS_RULES: readonly Rule[] = [
    { label: 'iOS', any: ['iphone', 'ipad', 'ipod'] },
    { label: 'Android', any: ['android'] },
    { label: 'Windows', any: ['windows'] },
    { label: 'ChromeOS', any: ['cros'] },
    { label: 'macOS', any: ['macintosh', 'mac os x'] },
    { label: 'Linux', any: ['linux'] },
];

const BOT_NAME_RULES: readonly Rule[] = [
    { label: '구글', any: ['googlebot', 'google-inspectiontool', 'googleother', 'adsbot-google', 'mediapartners-google'] },
    { label: '네이버 Yeti', any: ['yeti'] },
    { label: '다음 Daumoa', any: ['daum'] },
    { label: 'Bing', any: ['bingbot', 'bingpreview'] },
    { label: 'OpenAI', any: ['gptbot', 'oai-searchbot', 'chatgpt-user'] },
    { label: 'Anthropic', any: ['claudebot', 'claude-', 'anthropic'] },
    { label: 'Perplexity', any: ['perplexity'] },
    { label: 'Meta', any: ['facebookexternalhit', 'meta-externalagent'] },
    { label: '카카오 미리보기', any: ['kakaotalk-scrap'] },
    { label: 'Apple', any: ['applebot'] },
    { label: 'SEO 도구', any: ['ahrefs', 'semrush', 'mj12bot', 'dotbot'] },
    { label: '스크립트·모니터링', any: ['python', 'curl', 'wget', 'go-http', 'axios', 'node-fetch', 'okhttp', 'java/', 'httpclient', 'headless', 'lighthouse', 'monitor'] },
];

const INTERNAL_HOSTS = ['//3dcookiehd.com', '//www.3dcookiehd.com', '3dcookiehd.pages.dev', '//localhost', '//127.0.0.1'] as const;

/** 위에서부터 순서대로 매칭 (예: gemini.google 은 구글 검색보다 먼저) */
const SOURCE_RULES: readonly SourceRule[] = [
    { label: '내부 이동', group: '내부', any: INTERNAL_HOSTS },
    { label: 'ChatGPT', group: 'AI 검색', any: ['chatgpt.com', 'openai.com'] },
    { label: 'Perplexity', group: 'AI 검색', any: ['perplexity.ai'] },
    { label: 'Claude', group: 'AI 검색', any: ['claude.ai'] },
    { label: 'Gemini', group: 'AI 검색', any: ['gemini.google'] },
    { label: 'Copilot', group: 'AI 검색', any: ['copilot.microsoft'] },
    { label: '네이버 검색', group: '검색', any: ['search.naver.com'] },
    { label: '네이버 블로그', group: 'SNS·커뮤니티', any: ['blog.naver.com'] },
    { label: '네이버 카페', group: 'SNS·커뮤니티', any: ['cafe.naver.com'] },
    { label: '네이버 기타', group: '검색', any: ['naver.com', 'naver.me'] },
    { label: '구글', group: '검색', any: ['google.'] },
    { label: '다음 검색', group: '검색', any: ['daum.net'] },
    { label: 'Bing', group: '검색', any: ['bing.com'] },
    { label: '유튜브', group: 'SNS·커뮤니티', any: ['youtube.', 'youtu.be'] },
    { label: '인스타그램', group: 'SNS·커뮤니티', any: ['instagram.'] },
    { label: '페이스북', group: 'SNS·커뮤니티', any: ['facebook.', '//fb.com', 'fb.me'] },
    { label: '카카오', group: 'SNS·커뮤니티', any: ['kakao.'] },
    { label: '스레드·X', group: 'SNS·커뮤니티', any: ['threads.net', 'threads.com', '//t.co/', 'twitter.', '//x.com'] },
    { label: '고용24·HRD-Net', group: '공공 포털', any: ['hrd.go.kr', 'work24.go.kr', 'work.go.kr'] },
];
const SOURCE_DIRECT = '직접 유입';
const SOURCE_OTHER = '기타 사이트';

export const SOURCE_GROUP: Record<string, string> = {
    [SOURCE_DIRECT]: '직접',
    [SOURCE_OTHER]: '기타',
    ...Object.fromEntries(SOURCE_RULES.map((r) => [r.label, r.group])),
};

const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;
const likeAny = (col: string, pats: readonly string[]) =>
    `(${pats.map((p) => `${col} LIKE ${sqlStr(`%${p}%`)}`).join(' OR ')})`;
const ruleCond = (col: string, r: Rule) =>
    r.none?.length ? `(${likeAny(col, r.any)} AND NOT ${likeAny(col, r.none)})` : likeAny(col, r.any);
const caseSql = (col: string, rules: readonly Rule[], fallback: string) =>
    `CASE ${rules.map((r) => `WHEN ${ruleCond(col, r)} THEN ${sqlStr(r.label)}`).join(' ')} ELSE ${sqlStr(fallback)} END`;

function classify(value: string | null | undefined, rules: readonly Rule[], fallback: string): string {
    const v = (value ?? '').toLowerCase();
    for (const r of rules) {
        if (r.any.some((p) => v.includes(p)) && !(r.none ?? []).some((p) => v.includes(p))) return r.label;
    }
    return fallback;
}

const UA = `COALESCE(w.user_agent, '')`;
const REF = `COALESCE(w.referrer, '')`;
const BOT_SQL = `(${UA} = '' OR ${likeAny(UA, BOT_PATTERNS)})`;
const DEVICE_SQL = `CASE WHEN ${BOT_SQL} THEN '봇' ELSE ${caseSql(UA, DEVICE_RULES, 'PC')} END`;
const BROWSER_SQL = caseSql(UA, BROWSER_RULES, '기타');
const OS_SQL = caseSql(UA, OS_RULES, '기타');
const BOT_NAME_SQL = caseSql(UA, BOT_NAME_RULES, '기타 봇');
const SOURCE_SQL = `CASE WHEN ${REF} = '' THEN ${sqlStr(SOURCE_DIRECT)} ELSE ${caseSql(REF, SOURCE_RULES, SOURCE_OTHER)} END`;
const EXTERNAL_REF_SQL = `(${REF} <> '' AND NOT ${likeAny(REF, INTERNAL_HOSTS)})`;

/** 사람이 실제로 본 공개 페이지만: GET·정상 응답·관리/API/크롤링 파일 제외·봇 제외 */
export const PUBLIC_VISIT_SQL = [
    `w.method = 'GET'`,
    `w.page_visited NOT LIKE '/api/%'`,
    `w.page_visited NOT LIKE '/admin%'`,
    `w.page_visited NOT LIKE '/teacher%'`,
    `w.page_visited NOT LIKE '/student%'`,
    `w.page_visited NOT IN ('/robots.txt', '/sitemap.xml', '/llms.txt', '/favicon.ico')`,
    `COALESCE(w.status_code, 200) < 400`,
    `NOT ${BOT_SQL}`,
].join(' AND ');

type Scope = 'public' | 'bots' | 'all';
const SCOPE_SQL: Record<Scope, string> = { public: PUBLIC_VISIT_SQL, bots: BOT_SQL, all: '1 = 1' };
const parseScope = (v?: string): Scope => (v === 'bots' || v === 'all' ? v : 'public');

export function describeVisit(ua: string | null, referrer: string | null) {
    const isBot = !ua || BOT_PATTERNS.some((p) => ua.toLowerCase().includes(p));
    const source = referrer ? classify(referrer, SOURCE_RULES, SOURCE_OTHER) : SOURCE_DIRECT;
    return {
        device: isBot ? '봇' : classify(ua, DEVICE_RULES, 'PC'),
        browser: isBot ? classify(ua, BOT_NAME_RULES, '기타 봇') : classify(ua, BROWSER_RULES, '기타'),
        os: isBot ? '-' : classify(ua, OS_RULES, '기타'),
        source,
        channel: SOURCE_GROUP[source] ?? '기타',
    };
}

/* ---------- KST 날짜 범위 ---------- */

const DAY_MS = 86_400_000;
const MAX_DAYS = 180;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const kstToday = (now = Date.now()) => new Date(now + 9 * 3_600_000).toISOString().slice(0, 10);
export function addDays(ymd: string, n: number): string {
    return new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}
/** KST 날짜의 0시를 DB(UTC) timestamp 문자열로 변환 */
export const kstStartUtc = (ymd: string) =>
    new Date(`${ymd}T00:00:00+09:00`).toISOString().replace('T', ' ').slice(0, 19);
const isValidDate = (s?: string): s is string =>
    !!s && DATE_RE.test(s) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;

type Range = { from: string; to: string; days: number; start: string; end: string };

function parseRange(c: Context): Range {
    const today = kstToday();
    const fromQ = c.req.query('from')?.trim();
    const toQ = c.req.query('to')?.trim();
    let from = addDays(today, -6);
    let to = today;
    if (isValidDate(fromQ) && isValidDate(toQ) && fromQ <= toQ) {
        from = fromQ;
        to = toQ;
    }
    let days = Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1;
    if (days > MAX_DAYS) {
        from = addDays(to, -(MAX_DAYS - 1));
        days = MAX_DAYS;
    }
    return { from, to, days, start: kstStartUtc(from), end: kstStartUtc(addDays(to, 1)) };
}

function parsePaging(c: Context) {
    const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1);
    const size = Math.min(100, Math.max(5, parseInt(c.req.query('size') ?? '20', 10) || 20));
    return { page, size, offset: (page - 1) * size };
}

/** 번호 매긴 바인딩(?1, ?2 …) 빌더: 같은 값을 한 쿼리에서 여러 번 참조할 수 있다 */
function params() {
    const values: unknown[] = [];
    return {
        values,
        p(v: unknown) {
            values.push(v);
            return `?${values.length}`;
        },
    };
}

const paged = <T>(rows: T[], total: number, page: number, size: number) => ({
    rows,
    total,
    page,
    size,
    totalPages: Math.max(1, Math.ceil(total / size)),
});

type LabelCount = { label: string; pv: number; uv: number };

/* ---------- 요약·분포 ---------- */

app.get('/access-stats', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const range = parseRange(c);
        const scope = parseScope(c.req.query('scope'));
        const scopeSql = SCOPE_SQL[scope];
        const today = kstToday();
        const todayStart = kstStartUtc(today);
        const weekStart = kstStartUtc(addDays(today, -6));
        const monthStart = kstStartUtc(`${today.slice(0, 8)}01`);
        const summaryLower = weekStart < monthStart ? weekStart : monthStart;

        const W = `w.timestamp >= ?1 AND w.timestamp < ?2`;
        const WS = `${W} AND ${scopeSql}`;
        const rb = [range.start, range.end];
        const dim = (expr: string, extra = '') =>
            DB.prepare(`SELECT ${expr} AS label, count(*) AS pv, count(DISTINCT w.ip_address) AS uv
                FROM website_visits w WHERE ${WS}${extra} GROUP BY label ORDER BY pv DESC`).bind(...rb);

        const results = await DB.batch([
            DB.prepare(`SELECT
                    sum(CASE WHEN w.timestamp >= ?1 THEN 1 ELSE 0 END) AS todayPv,
                    count(DISTINCT CASE WHEN w.timestamp >= ?1 THEN w.ip_address END) AS todayUv,
                    sum(CASE WHEN w.timestamp >= ?2 THEN 1 ELSE 0 END) AS weekPv,
                    count(DISTINCT CASE WHEN w.timestamp >= ?2 THEN w.ip_address END) AS weekUv,
                    sum(CASE WHEN w.timestamp >= ?3 THEN 1 ELSE 0 END) AS monthPv,
                    count(DISTINCT CASE WHEN w.timestamp >= ?3 THEN w.ip_address END) AS monthUv
                FROM website_visits w WHERE w.timestamp >= ?4 AND ${scopeSql}`)
                .bind(todayStart, weekStart, monthStart, summaryLower),
            DB.prepare(`SELECT count(*) AS pv, count(DISTINCT w.ip_address) AS uv,
                    count(DISTINCT w.user_id) AS members, count(DISTINCT w.page_visited) AS pages,
                    sum(CASE WHEN ${EXTERNAL_REF_SQL} THEN 1 ELSE 0 END) AS externalIn
                FROM website_visits w WHERE ${WS}`).bind(...rb),
            DB.prepare(`SELECT count(*) AS n FROM website_visits w WHERE ${W} AND ${BOT_SQL}`).bind(...rb),
            DB.prepare(`SELECT date(w.timestamp, '+9 hours') AS date, count(*) AS pv, count(DISTINCT w.ip_address) AS uv
                FROM website_visits w WHERE ${WS} GROUP BY date ORDER BY date`).bind(...rb),
            DB.prepare(`SELECT CAST(strftime('%H', w.timestamp, '+9 hours') AS INTEGER) AS hour, count(*) AS count
                FROM website_visits w WHERE ${WS} GROUP BY hour`).bind(...rb),
            DB.prepare(`SELECT CAST(strftime('%w', w.timestamp, '+9 hours') AS INTEGER) AS dow, count(*) AS count
                FROM website_visits w WHERE ${WS} GROUP BY dow`).bind(...rb),
            DB.prepare(`SELECT COALESCE(u.role, 'guest') AS role, count(*) AS count
                FROM website_visits w LEFT JOIN users u ON w.user_id = u.id
                WHERE ${WS} GROUP BY role ORDER BY count DESC`).bind(...rb),
            dim(DEVICE_SQL),
            dim(BROWSER_SQL, ` AND NOT ${BOT_SQL}`),
            dim(OS_SQL, ` AND NOT ${BOT_SQL}`),
            dim(SOURCE_SQL),
            DB.prepare(`SELECT ${BOT_NAME_SQL} AS label, count(*) AS pv, count(DISTINCT w.ip_address) AS uv
                FROM website_visits w WHERE ${W} AND ${BOT_SQL} GROUP BY label ORDER BY pv DESC`).bind(...rb),
            DB.prepare(`SELECT w.referrer AS ref, count(*) AS n FROM website_visits w
                WHERE ${WS} AND ${likeAny(REF, ['search.naver.com', 'search.daum.net', 'bing.com/search', 'google.'])}
                  AND ${likeAny(REF, ['query=', 'q='])}
                GROUP BY w.referrer ORDER BY n DESC LIMIT 1000`).bind(...rb),
            DB.prepare(`SELECT w.page_visited AS path, count(*) AS pv, count(DISTINCT w.ip_address) AS uv
                FROM website_visits w WHERE ${WS} AND ${EXTERNAL_REF_SQL}
                GROUP BY w.page_visited ORDER BY pv DESC LIMIT 10`).bind(...rb),
        ]);
        const rows = <T>(i: number) => (results[i]?.results ?? []) as T[];
        const one = <T>(i: number) => rows<T>(i)[0];

        const s = one<Record<string, number | null>>(0) ?? {};
        const totals = one<{ pv: number; uv: number; members: number; pages: number; externalIn: number | null }>(1);
        const dailyMap = new Map(rows<{ date: string; pv: number; uv: number }>(3).map((r) => [r.date, r]));
        const dailyTrend = Array.from({ length: range.days }, (_, i) => {
            const date = addDays(range.from, i);
            const r = dailyMap.get(date);
            return { date, pv: r?.pv ?? 0, uv: r?.uv ?? 0 };
        });
        const hourMap = new Map(rows<{ hour: number; count: number }>(4).map((r) => [r.hour, r.count]));
        const dowMap = new Map(rows<{ dow: number; count: number }>(5).map((r) => [r.dow, r.count]));

        const sources = rows<LabelCount>(10).map((r) => ({ ...r, group: SOURCE_GROUP[r.label] ?? '기타' }));
        const channelMap = new Map<string, LabelCount>();
        for (const r of sources) {
            const cur = channelMap.get(r.group) ?? { label: r.group, pv: 0, uv: 0 };
            cur.pv += r.pv;
            cur.uv += r.uv;
            channelMap.set(r.group, cur);
        }

        const keywordMap = new Map<string, number>();
        for (const { ref, n } of rows<{ ref: string; n: number }>(12)) {
            try {
                const u = new URL(ref);
                const kw = (u.searchParams.get('query') ?? u.searchParams.get('q') ?? '').trim().replace(/\s+/g, ' ');
                if (kw) keywordMap.set(kw, (keywordMap.get(kw) ?? 0) + n);
            } catch {
                /* 잘못된 URL 무시 */
            }
        }
        const keywords = [...keywordMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30)
            .map(([keyword, count]) => ({ keyword, count }));

        const num = (k: string) => Number(s[k] ?? 0);
        return c.json({
            success: true,
            data: {
                scope,
                range: { from: range.from, to: range.to, days: range.days, today },
                summary: {
                    today: { pv: num('todayPv'), uv: num('todayUv') },
                    week: { pv: num('weekPv'), uv: num('weekUv') },
                    month: { pv: num('monthPv'), uv: num('monthUv') },
                },
                totals: {
                    pv: totals?.pv ?? 0,
                    uv: totals?.uv ?? 0,
                    members: totals?.members ?? 0,
                    pages: totals?.pages ?? 0,
                    externalIn: totals?.externalIn ?? 0,
                    bots: one<{ n: number }>(2)?.n ?? 0,
                },
                dailyTrend,
                byHour: Array.from({ length: 24 }, (_, h) => hourMap.get(h) ?? 0),
                byDayOfWeek: Array.from({ length: 7 }, (_, d) => dowMap.get(d) ?? 0),
                byRole: rows<{ role: string; count: number }>(6),
                devices: rows<LabelCount>(7),
                browsers: rows<LabelCount>(8),
                os: rows<LabelCount>(9),
                sources,
                channels: [...channelMap.values()].sort((a, b) => b.pv - a.pv),
                crawlers: rows<LabelCount>(11),
                keywords,
                landingPages: rows<{ path: string; pv: number; uv: number }>(13),
            },
        });
    } catch (e) {
        console.error('Analytics access-stats error:', e);
        return c.json({ success: false, error: 'Failed to fetch access stats' }, 500);
    }
});

/* ---------- 페이지네이션 목록 ---------- */

/** 페이지별 접속: q(경로 검색), sort(pv|uv|recent|entries) */
app.get('/pages', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const range = parseRange(c);
        const scope = parseScope(c.req.query('scope'));
        const { page, size, offset } = parsePaging(c);
        const q = c.req.query('q')?.trim();
        const sortKey = c.req.query('sort');
        const order =
            sortKey === 'uv' ? 'uv DESC' : sortKey === 'recent' ? 'lastVisit DESC' : sortKey === 'entries' ? 'entries DESC' : 'pv DESC';

        const b = params();
        let where = `w.timestamp >= ${b.p(range.start)} AND w.timestamp < ${b.p(range.end)} AND ${SCOPE_SQL[scope]}`;
        if (q) where += ` AND w.page_visited LIKE ${b.p(`%${q}%`)}`;
        const filterBinds = b.values.slice();

        const [list, count] = await DB.batch([
            DB.prepare(`SELECT w.page_visited AS path, count(*) AS pv, count(DISTINCT w.ip_address) AS uv,
                    sum(CASE WHEN ${EXTERNAL_REF_SQL} THEN 1 ELSE 0 END) AS entries,
                    datetime(max(w.timestamp), '+9 hours') AS lastVisit
                FROM website_visits w WHERE ${where}
                GROUP BY w.page_visited ORDER BY ${order}, path LIMIT ${b.p(size)} OFFSET ${b.p(offset)}`).bind(...b.values),
            DB.prepare(`SELECT count(DISTINCT w.page_visited) AS n FROM website_visits w WHERE ${where}`).bind(...filterBinds),
        ]);
        const total = (count.results?.[0] as { n?: number } | undefined)?.n ?? 0;
        return c.json({ success: true, data: paged(list.results ?? [], total, page, size) });
    } catch (e) {
        console.error('Analytics pages error:', e);
        return c.json({ success: false, error: 'Failed to fetch pages' }, 500);
    }
});

/** 외부 유입 도메인: 내부 이동·직접 유입 제외, 호스트별 집계 */
app.get('/referrers', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const range = parseRange(c);
        const scope = parseScope(c.req.query('scope'));
        const { page, size, offset } = parsePaging(c);
        const cte = `WITH r AS (
                SELECT w.ip_address AS ip, w.referrer AS ref, w.timestamp AS ts,
                    CASE WHEN instr(w.referrer, '://') > 0 THEN substr(w.referrer, instr(w.referrer, '://') + 3) ELSE w.referrer END AS rest
                FROM website_visits w
                WHERE w.timestamp >= ?1 AND w.timestamp < ?2 AND ${SCOPE_SQL[scope]} AND ${EXTERNAL_REF_SQL}
            ), h AS (
                SELECT lower(CASE WHEN instr(rest, '/') > 0 THEN substr(rest, 1, instr(rest, '/') - 1) ELSE rest END) AS host, ip, ref, ts FROM r
            )`;
        const [list, count] = await DB.batch([
            DB.prepare(`${cte} SELECT host, count(*) AS pv, count(DISTINCT ip) AS uv, max(ref) AS sample,
                    datetime(max(ts), '+9 hours') AS lastVisit
                FROM h GROUP BY host ORDER BY pv DESC, host LIMIT ?3 OFFSET ?4`).bind(range.start, range.end, size, offset),
            DB.prepare(`${cte} SELECT count(DISTINCT host) AS n FROM h`).bind(range.start, range.end),
        ]);
        const rows = ((list.results ?? []) as { host: string; pv: number; uv: number; sample: string; lastVisit: string }[]).map(
            (r) => {
                const source = classify(`https://${r.host}/`, SOURCE_RULES, SOURCE_OTHER);
                return { ...r, source, channel: SOURCE_GROUP[source] ?? '기타' };
            },
        );
        const total = (count.results?.[0] as { n?: number } | undefined)?.n ?? 0;
        return c.json({ success: true, data: paged(rows, total, page, size) });
    } catch (e) {
        console.error('Analytics referrers error:', e);
        return c.json({ success: false, error: 'Failed to fetch referrers' }, 500);
    }
});

/** 접속자: 로그인 사용자·IP 단위, kind(all|member|guest), q(이메일·이름·IP), sort(pv|recent) */
app.get('/visitors', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const range = parseRange(c);
        const scope = parseScope(c.req.query('scope'));
        const { page, size, offset } = parsePaging(c);
        const kind = c.req.query('kind');
        const q = c.req.query('q')?.trim();
        const order = c.req.query('sort') === 'recent' ? 'lastVisit DESC' : 'pv DESC';

        const b = params();
        let where = `w.timestamp >= ${b.p(range.start)} AND w.timestamp < ${b.p(range.end)} AND ${SCOPE_SQL[scope]}`;
        if (kind === 'member') where += ` AND w.user_id IS NOT NULL`;
        if (kind === 'guest') where += ` AND w.user_id IS NULL`;
        if (q) {
            const like = b.p(`%${q}%`);
            where += ` AND (w.ip_address LIKE ${like} OR u.email LIKE ${like} OR u.name LIKE ${like})`;
        }
        const filterBinds = b.values.slice();
        const from = `FROM website_visits w LEFT JOIN users u ON w.user_id = u.id WHERE ${where}`;

        const [list, count] = await DB.batch([
            DB.prepare(`SELECT w.user_id AS userId, w.ip_address AS ip, u.email AS email, u.name AS name, u.role AS role,
                    count(*) AS pv, count(DISTINCT w.page_visited) AS pages,
                    datetime(min(w.timestamp), '+9 hours') AS firstVisit,
                    datetime(max(w.timestamp), '+9 hours') AS lastVisit,
                    max(w.user_agent) AS ua
                ${from} GROUP BY w.user_id, w.ip_address
                ORDER BY ${order} LIMIT ${b.p(size)} OFFSET ${b.p(offset)}`).bind(...b.values),
            DB.prepare(`SELECT count(*) AS n FROM (SELECT 1 ${from} GROUP BY w.user_id, w.ip_address)`).bind(...filterBinds),
        ]);
        type Row = {
            userId: number | null; ip: string | null; email: string | null; name: string | null; role: string | null;
            pv: number; pages: number; firstVisit: string; lastVisit: string; ua: string | null;
        };
        const rows = ((list.results ?? []) as Row[]).map(({ ua, ...r }) => {
            const d = describeVisit(ua, null);
            return { ...r, device: d.device, browser: d.browser, os: d.os };
        });
        const total = (count.results?.[0] as { n?: number } | undefined)?.n ?? 0;
        return c.json({ success: true, data: paged(rows, total, page, size) });
    } catch (e) {
        console.error('Analytics visitors error:', e);
        return c.json({ success: false, error: 'Failed to fetch visitors' }, 500);
    }
});

/** 상세 접속 로그: device·source·kind(member|guest)·q(경로) 필터 */
app.get('/logs', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const range = parseRange(c);
        const scope = parseScope(c.req.query('scope'));
        const { page, size, offset } = parsePaging(c);
        const device = c.req.query('device')?.trim();
        const source = c.req.query('source')?.trim();
        const kind = c.req.query('kind');
        const q = c.req.query('q')?.trim();

        const b = params();
        let where = `w.timestamp >= ${b.p(range.start)} AND w.timestamp < ${b.p(range.end)} AND ${SCOPE_SQL[scope]}`;
        if (device) where += ` AND (${DEVICE_SQL}) = ${b.p(device)}`;
        if (source) where += ` AND (${SOURCE_SQL}) = ${b.p(source)}`;
        if (kind === 'member') where += ` AND w.user_id IS NOT NULL`;
        if (kind === 'guest') where += ` AND w.user_id IS NULL`;
        if (q) where += ` AND w.page_visited LIKE ${b.p(`%${q}%`)}`;
        const filterBinds = b.values.slice();

        const [list, count] = await DB.batch([
            DB.prepare(`SELECT w.id, datetime(w.timestamp, '+9 hours') AS ts, w.page_visited AS path, w.method, w.status_code AS status,
                    w.referrer, w.ip_address AS ip, w.user_id AS userId, u.email AS email, u.name AS name, u.role AS role, w.user_agent AS ua
                FROM website_visits w LEFT JOIN users u ON w.user_id = u.id
                WHERE ${where} ORDER BY w.id DESC LIMIT ${b.p(size)} OFFSET ${b.p(offset)}`).bind(...b.values),
            DB.prepare(`SELECT count(*) AS n FROM website_visits w WHERE ${where}`).bind(...filterBinds),
        ]);
        type Row = {
            id: number; ts: string; path: string; method: string; status: number | null; referrer: string | null;
            ip: string | null; userId: number | null; email: string | null; name: string | null; role: string | null; ua: string | null;
        };
        const rows = ((list.results ?? []) as Row[]).map((r) => ({ ...r, ...describeVisit(r.ua, r.referrer) }));
        const total = (count.results?.[0] as { n?: number } | undefined)?.n ?? 0;
        return c.json({ success: true, data: paged(rows, total, page, size) });
    } catch (e) {
        console.error('Analytics logs error:', e);
        return c.json({ success: false, error: 'Failed to fetch logs' }, 500);
    }
});

export default app;
