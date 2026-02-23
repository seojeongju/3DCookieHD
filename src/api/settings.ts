
import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { execute, getOne, getAll } from '../utils/database';
import { successResponse, errorResponse } from '../utils/response';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const settings = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// 모든 설정 조회
settings.get('/', authMiddleware, requireAdmin, async (c) => {
    try {
        const results = await getAll(c.env.DB, 'SELECT * FROM site_settings ORDER BY key ASC');
        return successResponse(c, results);
    } catch (error) {
        console.error('Get settings error:', error);
        return errorResponse(c, '설정 정보를 불러오는 중 오류가 발생했습니다.');
    }
});

// 특정 설정 조회 (public용 가능하게 하려면 authMiddleware 뺄 수 있음)
settings.get('/:key', async (c) => {
    try {
        const key = c.req.param('key');
        const result = await getOne(c.env.DB, 'SELECT value FROM site_settings WHERE key = ?', [key]) as any;
        if (!result) return errorResponse(c, '설정을 찾을 수 없습니다.', 404);
        return successResponse(c, result.value);
    } catch (error) {
        console.error('Get setting error:', error);
        return errorResponse(c, '설정 정보를 불러오는 중 오류가 발생했습니다.');
    }
});

// 설정 업데이트
settings.post('/', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return errorResponse(c, '키와 값이 필요합니다.', 400);
        }

        await execute(c.env.DB, `
            INSERT INTO site_settings (key, value, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET 
            value = EXCLUDED.value,
            updated_at = CURRENT_TIMESTAMP
        `, [key, value]);

        return successResponse(c, null, '설정이 저장되었습니다.');
    } catch (error) {
        console.error('Update setting error:', error);
        return errorResponse(c, '설정 저장 중 오류가 발생했습니다.');
    }
});

export default settings;
