
import type { Context, Next } from 'hono';
import type { Bindings, JWTPayload } from '../types';
import { execute } from '../utils/database';

/**
 * Website Visit Tracking Middleware
 * Intercepts requests and logs metadata to the website_visits table.
 */
export async function trackingMiddleware(c: Context<{ Bindings: Bindings; Variables: { user: JWTPayload } }>, next: Next) {
    // Skip static files, favicon, etc. to avoid noise
    const url = new URL(c.req.url);
    const path = url.pathname;

    const isStatic = path.startsWith('/static/') ||
        path.endsWith('.ico') ||
        path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.js') ||
        path.endsWith('.css');

    // Skip API health checks or internal setups
    const isInternal = path.startsWith('/api/health') ||
        path.startsWith('/api/setup');

    await next();

    if (!isStatic && !isInternal) {
        try {
            const { DB } = c.env;
            const user = c.get('user') as JWTPayload | undefined;

            const ip = c.req.header('cf-connecting-ip') ||
                c.req.header('x-forwarded-for') ||
                'unknown';

            const userAgent = c.req.header('user-agent') || '';
            const referrer = c.req.header('referer') || '';
            const method = c.req.method;
            const statusCode = c.res.status;

            // Log the visit asynchronously
            // We use execute instead of simple DB.prepare().run() if we want consistent utils usage
            execute(DB, `
        INSERT INTO website_visits (
          ip_address, user_id, page_visited, user_agent, referrer, method, status_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                ip,
                user?.userId || null,
                path,
                userAgent,
                referrer,
                method,
                statusCode
            ]).catch(err => {
                console.error('Tracking middleware logging error:', err);
            });

        } catch (error) {
            // Fail silently to not disrupt the user request
            console.error('Tracking middleware error:', error);
        }
    }
}
