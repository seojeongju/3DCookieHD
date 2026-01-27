// ============================================
// 캠퍼스 API
// ============================================

import { Hono } from 'hono';
import type { Bindings, Campus } from '../types';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response';
import { getOne, getAll } from '../utils/database';

const campuses = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/campuses
 * 캠퍼스 목록 조회
 */
campuses.get('/', async (c) => {
  try {
    const region = c.req.query('region');
    
    let query = 'SELECT * FROM campuses';
    const params: any[] = [];

    if (region) {
      query += ' WHERE region = ?';
      params.push(region);
    }

    query += ' ORDER BY region, name';

    const campusList = await getAll<Campus>(c.env.DB, query, params);

    // JSON 필드 파싱
    const parsedCampuses = campusList.map(campus => {
      const parsed: any = { ...campus };
      if (campus.facilities) {
        try {
          parsed.facilities = JSON.parse(campus.facilities);
        } catch {}
      }
      if (campus.certifications) {
        try {
          parsed.certifications = JSON.parse(campus.certifications);
        } catch {}
      }
      if (campus.images) {
        try {
          parsed.images = JSON.parse(campus.images);
        } catch {}
      }
      return parsed;
    });

    return successResponse(c, parsedCampuses);

  } catch (error) {
    console.error('Get campuses error:', error);
    return errorResponse(c, '캠퍼스 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /api/campuses/:id
 * 캠퍼스 상세 조회
 */
campuses.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const campus = await getOne<Campus>(
      c.env.DB,
      'SELECT * FROM campuses WHERE id = ?',
      [id]
    );

    if (!campus) {
      return notFoundResponse(c, '캠퍼스를 찾을 수 없습니다');
    }

    // JSON 필드 파싱
    const parsed: any = { ...campus };
    if (campus.facilities) {
      try {
        parsed.facilities = JSON.parse(campus.facilities);
      } catch {}
    }
    if (campus.certifications) {
      try {
        parsed.certifications = JSON.parse(campus.certifications);
      } catch {}
    }
    if (campus.images) {
      try {
        parsed.images = JSON.parse(campus.images);
      } catch {}
    }

    // 해당 캠퍼스의 과정 목록 조회
    const courses = await getAll<any>(
      c.env.DB,
      `SELECT id, title, category, price, thumbnail_url, rating, review_count, status
       FROM courses 
       WHERE campus_id = ? AND status = 'active'
       ORDER BY created_at DESC`,
      [id]
    );

    return successResponse(c, {
      ...parsed,
      courses
    });

  } catch (error) {
    console.error('Get campus error:', error);
    return errorResponse(c, '캠퍼스 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /api/campuses/regions
 * 지역 목록 조회
 */
campuses.get('/list/regions', async (c) => {
  try {
    const regions = await getAll<{ region: string; count: number }>(
      c.env.DB,
      'SELECT region, COUNT(*) as count FROM campuses GROUP BY region ORDER BY region',
      []
    );

    return successResponse(c, regions);

  } catch (error) {
    console.error('Get regions error:', error);
    return errorResponse(c, '지역 목록 조회 중 오류가 발생했습니다', 500);
  }
});

export default campuses;
