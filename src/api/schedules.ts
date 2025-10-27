import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// 스케줄 목록 조회 (공개 API)
// ============================================
app.get('/', async (c) => {
  const { DB } = c.env;
  
  try {
    // 쿼리 파라미터
    const category = c.req.query('category'); // 분류 필터
    const status = c.req.query('status') || 'open'; // 상태 필터 (기본: open)
    const year = c.req.query('year'); // 연도 필터
    const month = c.req.query('month'); // 월 필터

    let query = 'SELECT * FROM schedules WHERE 1=1';
    const params: any[] = [];

    // 필터 조건 추가
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // 연도/월 필터
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = `${year}-${month.padStart(2, '0')}-31`;
      query += ' AND (start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ?)';
      params.push(startDate, endDate, startDate, endDate);
    } else if (year) {
      query += ' AND strftime("%Y", start_date) = ?';
      params.push(year);
    }

    query += ' ORDER BY start_date ASC, start_time ASC';

    const { results } = await DB.prepare(query).bind(...params).all();

    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    });
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch schedules',
      message: error.message
    }, 500);
  }
});

// ============================================
// 스케줄 상세 조회 (공개 API)
// ============================================
app.get('/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');

  try {
    const schedule = await DB.prepare(
      'SELECT * FROM schedules WHERE id = ?'
    ).bind(id).first();

    if (!schedule) {
      return c.json({
        success: false,
        error: 'Not Found',
        message: '스케줄을 찾을 수 없습니다'
      }, 404);
    }

    return c.json({
      success: true,
      data: schedule
    });
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch schedule',
      message: error.message
    }, 500);
  }
});

// ============================================
// 스케줄 생성 (관리자 전용)
// ============================================
app.post('/', authMiddleware, requireAdmin, async (c) => {
  const { DB } = c.env;

  try {
    const body = await c.req.json();
    const {
      category,
      target_audience,
      course_name,
      session_number,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      days_of_week,
      status = 'open'
    } = body;

    // 필수 필드 검증
    if (!category || !target_audience || !course_name || !start_date || !end_date) {
      return c.json({
        success: false,
        error: 'Validation Error',
        message: '필수 필드가 누락되었습니다'
      }, 400);
    }

    const result = await DB.prepare(`
      INSERT INTO schedules (
        category, target_audience, course_name, session_number,
        max_students, start_date, end_date, start_time, end_time,
        days_of_week, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      category,
      target_audience,
      course_name,
      session_number,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      days_of_week,
      status
    ).run();

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        ...body
      },
      message: '스케줄이 생성되었습니다'
    }, 201);
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    return c.json({
      success: false,
      error: 'Failed to create schedule',
      message: error.message
    }, 500);
  }
});

// ============================================
// 스케줄 수정 (관리자 전용)
// ============================================
app.put('/:id', authMiddleware, requireAdmin, async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');

  try {
    const body = await c.req.json();
    const {
      category,
      target_audience,
      course_name,
      session_number,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      days_of_week,
      status
    } = body;

    const result = await DB.prepare(`
      UPDATE schedules SET
        category = ?,
        target_audience = ?,
        course_name = ?,
        session_number = ?,
        max_students = ?,
        start_date = ?,
        end_date = ?,
        start_time = ?,
        end_time = ?,
        days_of_week = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      category,
      target_audience,
      course_name,
      session_number,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      days_of_week,
      status,
      id
    ).run();

    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Not Found',
        message: '스케줄을 찾을 수 없습니다'
      }, 404);
    }

    return c.json({
      success: true,
      message: '스케줄이 수정되었습니다'
    });
  } catch (error: any) {
    console.error('Error updating schedule:', error);
    return c.json({
      success: false,
      error: 'Failed to update schedule',
      message: error.message
    }, 500);
  }
});

// ============================================
// 스케줄 삭제 (관리자 전용)
// ============================================
app.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');

  try {
    const result = await DB.prepare(
      'DELETE FROM schedules WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Not Found',
        message: '스케줄을 찾을 수 없습니다'
      }, 404);
    }

    return c.json({
      success: true,
      message: '스케줄이 삭제되었습니다'
    });
  } catch (error: any) {
    console.error('Error deleting schedule:', error);
    return c.json({
      success: false,
      error: 'Failed to delete schedule',
      message: error.message
    }, 500);
  }
});

// ============================================
// 달력용 스케줄 데이터 (월별)
// ============================================
app.get('/calendar/:year/:month', async (c) => {
  const { DB } = c.env;
  const year = c.req.param('year');
  const month = c.req.param('month');

  try {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    const { results } = await DB.prepare(`
      SELECT * FROM schedules
      WHERE status = 'open'
      AND (
        (start_date BETWEEN ? AND ?)
        OR (end_date BETWEEN ? AND ?)
        OR (start_date <= ? AND end_date >= ?)
      )
      ORDER BY start_date ASC, start_time ASC
    `).bind(startDate, endDate, startDate, endDate, startDate, endDate).all();

    return c.json({
      success: true,
      data: results || [],
      year: parseInt(year),
      month: parseInt(month)
    });
  } catch (error: any) {
    console.error('Error fetching calendar schedules:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch calendar schedules',
      message: error.message
    }, 500);
  }
});

export default app;
