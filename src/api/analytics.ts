/**
 * 접속 통계 API (관리자 전용)
 * website_visits 기반 일/주/월 PV·UV, 역할별·시간대별·페이지별 집계
 * 쿼리: from, to (YYYY-MM-DD, 선택 시 해당 기간만 집계, 최대 90일)
 */
import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidDate(s: string): boolean {
    if (!DATE_RE.test(s)) return false;
    const d = new Date(s);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

app.get('/access-stats', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const fromQ = c.req.query('from')?.trim();
        const toQ = c.req.query('to')?.trim();
        const useRange = fromQ && toQ && isValidDate(fromQ) && isValidDate(toQ) && fromQ <= toQ;
        const maxDays = 90;
        let rangeFrom: string | null = null;
        let rangeTo: string | null = null;
        if (useRange) {
            const from = new Date(fromQ!);
            const to = new Date(toQ!);
            const days = Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1;
            if (days > maxDays) {
                const adjust = new Date(from);
                adjust.setDate(adjust.getDate() + maxDays - 1);
                rangeTo = adjust.toISOString().slice(0, 10);
                rangeFrom = fromQ!;
            } else {
                rangeFrom = fromQ!;
                rangeTo = toQ!;
            }
        }

        const dateFilter = useRange && rangeFrom && rangeTo
            ? ` date(timestamp) BETWEEN ? AND ? `
            : null;
        const bindRange = useRange && rangeFrom && rangeTo ? [rangeFrom, rangeTo] : [];

        if (dateFilter) {
            // 기간 선택 시: 선택 기간 기준으로만 집계
            const rangePV = await DB.prepare(
                `SELECT count(*) as count FROM website_visits WHERE ${dateFilter}`
            ).bind(...bindRange).first<{ count: number }>();
            const rangeUV = await DB.prepare(
                `SELECT count(DISTINCT ip_address) as count FROM website_visits WHERE ${dateFilter}`
            ).bind(...bindRange).first<{ count: number }>();
            const dailyTrend = await DB.prepare(`
                SELECT date(timestamp) as date, count(*) as pv, count(DISTINCT ip_address) as uv
                FROM website_visits WHERE ${dateFilter}
                GROUP BY date ORDER BY date ASC
            `).bind(...bindRange).all<{ date: string; pv: number; uv: number }>();
            const byRole = await DB.prepare(`
                SELECT COALESCE(u.role, 'guest') as role, count(*) as count
                FROM website_visits w LEFT JOIN users u ON w.user_id = u.id
                WHERE date(w.timestamp) BETWEEN ? AND ?
                GROUP BY COALESCE(u.role, 'guest') ORDER BY count DESC
            `).bind(...bindRange).all<{ role: string; count: number }>();
            const byHour = await DB.prepare(`
                SELECT cast(strftime('%H', timestamp) as integer) as hour, count(*) as count
                FROM website_visits WHERE ${dateFilter}
                GROUP BY hour ORDER BY hour ASC
            `).bind(...bindRange).all<{ hour: number; count: number }>();
            const byDayOfWeek = await DB.prepare(`
                SELECT cast(strftime('%w', timestamp) as integer) as dow, count(*) as count
                FROM website_visits WHERE ${dateFilter}
                GROUP BY dow ORDER BY dow ASC
            `).bind(...bindRange).all<{ dow: number; count: number }>();
            const topPages = await DB.prepare(`
                SELECT page_visited as path, count(*) as pv, count(DISTINCT ip_address) as uv
                FROM website_visits WHERE ${dateFilter}
                GROUP BY page_visited ORDER BY pv DESC LIMIT 20
            `).bind(...bindRange).all<{ path: string; pv: number; uv: number }>();
            let topReferrers: { referrer: string; count: number }[] = [];
            try {
                const refResult = await DB.prepare(`
                    SELECT referrer, count(*) as count FROM website_visits
                    WHERE ${dateFilter} AND referrer IS NOT NULL AND referrer != ''
                    GROUP BY referrer ORDER BY count DESC LIMIT 10
                `).bind(...bindRange).all<{ referrer: string; count: number }>();
                topReferrers = refResult.results ?? [];
            } catch (_) {}

            return c.json({
                success: true,
                data: {
                    rangeFrom,
                    rangeTo,
                    rangePv: rangePV?.count ?? 0,
                    rangeUv: rangeUV?.count ?? 0,
                    todayPV: 0,
                    todayUV: 0,
                    weekPV: 0,
                    weekUV: 0,
                    monthPV: 0,
                    monthUV: 0,
                    dailyTrend: dailyTrend.results ?? [],
                    byRole: byRole.results ?? [],
                    byHour: byHour.results ?? [],
                    byDayOfWeek: byDayOfWeek.results ?? [],
                    topPages: topPages.results ?? [],
                    topReferrers,
                },
            });
        }

        // 1. 오늘 PV / UV
        const todayPV = await DB.prepare(`
            SELECT count(*) as count FROM website_visits WHERE date(timestamp) = date('now')
        `).first<{ count: number }>();
        const todayUV = await DB.prepare(`
            SELECT count(DISTINCT ip_address) as count FROM website_visits WHERE date(timestamp) = date('now')
        `).first<{ count: number }>();

        // 2. 최근 7일 일별 PV/UV
        const dailyTrend = await DB.prepare(`
            SELECT date(timestamp) as date,
                   count(*) as pv,
                   count(DISTINCT ip_address) as uv
            FROM website_visits
            WHERE timestamp >= date('now', '-6 days')
            GROUP BY date
            ORDER BY date ASC
        `).all<{ date: string; pv: number; uv: number }>();

        // 3. 최근 7일 / 이번 달 PV·UV
        const weekPV = await DB.prepare(`
            SELECT count(*) as count FROM website_visits WHERE timestamp >= date('now', '-6 days')
        `).first<{ count: number }>();
        const weekUV = await DB.prepare(`
            SELECT count(DISTINCT ip_address) as count FROM website_visits WHERE timestamp >= date('now', '-6 days')
        `).first<{ count: number }>();
        const monthPV = await DB.prepare(`
            SELECT count(*) as count FROM website_visits WHERE timestamp >= date('now', 'start of month')
        `).first<{ count: number }>();
        const monthUV = await DB.prepare(`
            SELECT count(DISTINCT ip_address) as count FROM website_visits WHERE timestamp >= date('now', 'start of month')
        `).first<{ count: number }>();

        // 4. 역할별 접속 (오늘)
        const byRole = await DB.prepare(`
            SELECT COALESCE(u.role, 'guest') as role, count(*) as count
            FROM website_visits w
            LEFT JOIN users u ON w.user_id = u.id
            WHERE date(w.timestamp) = date('now')
            GROUP BY COALESCE(u.role, 'guest')
            ORDER BY count DESC
        `).all<{ role: string; count: number }>();

        // 5. 시간대별 접속 (오늘, 0~23시)
        const byHour = await DB.prepare(`
            SELECT cast(strftime('%H', timestamp) as integer) as hour, count(*) as count
            FROM website_visits
            WHERE date(timestamp) = date('now')
            GROUP BY hour
            ORDER BY hour ASC
        `).all<{ hour: number; count: number }>();

        // 6. 요일별 접속 (최근 7일)
        const byDayOfWeek = await DB.prepare(`
            SELECT cast(strftime('%w', timestamp) as integer) as dow, count(*) as count
            FROM website_visits
            WHERE timestamp >= date('now', '-6 days')
            GROUP BY dow
            ORDER BY dow ASC
        `).all<{ dow: number; count: number }>();

        // 7. 인기 페이지 TOP 20
        const topPages = await DB.prepare(`
            SELECT page_visited as path,
                   count(*) as pv,
                   count(DISTINCT ip_address) as uv
            FROM website_visits
            GROUP BY page_visited
            ORDER BY pv DESC
            LIMIT 20
        `).all<{ path: string; pv: number; uv: number }>();

        // 8. Referrer 상위 10
        let topReferrers: { referrer: string; count: number }[] = [];
        try {
            const refResult = await DB.prepare(`
                SELECT referrer, count(*) as count
                FROM website_visits
                WHERE referrer IS NOT NULL AND referrer != ''
                GROUP BY referrer
                ORDER BY count DESC
                LIMIT 10
            `).all<{ referrer: string; count: number }>();
            topReferrers = refResult.results || [];
        } catch (_) {}

        return c.json({
            success: true,
            data: {
                todayPV: todayPV?.count ?? 0,
                todayUV: todayUV?.count ?? 0,
                weekPV: weekPV?.count ?? 0,
                weekUV: weekUV?.count ?? 0,
                monthPV: monthPV?.count ?? 0,
                monthUV: monthUV?.count ?? 0,
                dailyTrend: dailyTrend.results ?? [],
                byRole: byRole.results ?? [],
                byHour: byHour.results ?? [],
                byDayOfWeek: byDayOfWeek.results ?? [],
                topPages: topPages.results ?? [],
                topReferrers,
            },
        });
    } catch (e) {
        console.error('Analytics access-stats error:', e);
        return c.json({ success: false, error: 'Failed to fetch access stats' }, 500);
    }
});

export default app;
