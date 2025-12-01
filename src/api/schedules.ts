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
// 달력용 스케줄 데이터 (월별) - courses 테이블 기반
// ============================================
app.get('/calendar/:year/:month', async (c) => {
  const { DB } = c.env;
  const year = parseInt(c.req.param('year'));
  const month = parseInt(c.req.param('month'));

  try {
    // 해당 월의 시작일과 종료일
    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    // 기간이 겹치는 과정 조회 (status가 open인 것만)
    const { results } = await DB.prepare(`
      SELECT * FROM courses
      WHERE status = 'open'
      AND (
        (start_date <= ? AND end_date >= ?)
      )
    `).bind(endDateStr, startDateStr).all();

    const schedules = [];

    for (const course of results) {
      if (!course.start_date || !course.end_date || !course.schedule) continue;

      let scheduleData;
      try {
        // JSON 파싱 시도
        if (typeof course.schedule === 'string' && course.schedule.startsWith('{')) {
          scheduleData = JSON.parse(course.schedule);
        } else {
          // 기존 텍스트 형식일 경우 처리하지 않음 (또는 필요한 경우 파싱 로직 추가)
          continue;
        }
      } catch (e) {
        continue;
      }

      if (!scheduleData.days) continue;

      const targetDays = scheduleData.days.split(',').map((d: string) => d.trim());
      const courseStart = new Date(course.start_date as string);
      const courseEnd = new Date(course.end_date as string);

      // 해당 월의 날짜 순회
      for (let day = 1; day <= lastDay; day++) {
        const currentDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date(currentDateStr);

        // 과정 기간 내인지 확인
        if (currentDate >= courseStart && currentDate <= courseEnd) {
          // 요일 확인 (0: 일, 1: 월, ...)
          const dayOfWeek = currentDate.getDay();
          const dayName = ['일', '월', '화', '수', '목', '금', '토'][dayOfWeek];

          if (targetDays.includes(dayName)) {
            schedules.push({
              id: `course-${course.id}-${currentDateStr}`, // 고유 ID
              course_id: course.id,
              course_name: course.title,
              category: course.category,
              target_audience: '전체', // 기본값
              start_date: currentDateStr,
              end_date: currentDateStr,
              start_time: scheduleData.startTime || '',
              end_time: scheduleData.endTime || '',
              days_of_week: scheduleData.days,
              max_students: course.max_students
            });
          }
        }
      }
    }

    // 날짜/시간순 정렬
    schedules.sort((a, b) => {
      if (a.start_date !== b.start_date) return a.start_date.localeCompare(b.start_date);
      return (a.start_time || '').localeCompare(b.start_time || '');
    });

    return c.json({
      success: true,
      data: schedules
    });

  } catch (error: any) {
    console.error('Error fetching calendar schedules:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch schedules',
      message: error.message
    }, 500);
  }
});

export default app;
