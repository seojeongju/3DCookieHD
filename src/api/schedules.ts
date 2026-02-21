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
// 통합 일정 조회 (FullCalendar 호환) - 순서 중요: /:id 보다 먼저 정의
// ============================================
app.get('/integrated', async (c) => {
  const { DB } = c.env;
  const startStr = c.req.query('start');
  const endStr = c.req.query('end');

  if (!startStr || !endStr) return c.json([]);

  const queryStartDate = startStr.substring(0, 10);
  const queryEndDate = endStr.substring(0, 10);

  try {
    const events: any[] = [];

    // 1. Courses (정규 과정)
    const { results: courses } = await DB.prepare(`
      SELECT id, title, schedule, start_date, end_date, category, class_days, status
      FROM courses 
      WHERE start_date <= ? AND end_date >= ?
    `).bind(queryEndDate, queryStartDate).all<{
      id: number;
      title: string;
      schedule: string;
      start_date: string | null;
      end_date: string | null;
      category: string;
      class_days: string | null;
      status: string;
    }>();

    // 요일 매핑
    const dayMap: { [key: string]: number } = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };

    for (const course of (courses || [])) {
      let schedule: any = {};
      let daysStr = '';
      try {
        if (typeof course.schedule === 'string') {
          if (course.schedule.trim().startsWith('{')) {
            schedule = JSON.parse(course.schedule);
            daysStr = String(schedule.days || '');
          } else {
            daysStr = course.schedule;
          }
        }
      } catch (e) { daysStr = String(course.schedule || ''); }

      const startTime = schedule.startTime ? (schedule.startTime.length === 5 ? schedule.startTime + ':00' : schedule.startTime) : '09:00:00';
      const endTime = schedule.endTime ? (schedule.endTime.length === 5 ? schedule.endTime + ':00' : schedule.endTime) : '18:00:00';

      // 상태별 스타일 및 접두어 설정
      let statusLabel = '';
      let bgColor = '#3b82f6'; // Default Blue
      let borderColor = '#2563eb';

      switch (course.status) {
        case 'active':
          statusLabel = '[운영] ';
          bgColor = '#3b82f6'; // Blue
          borderColor = '#2563eb';
          break;
        case 'recruiting':
          statusLabel = '[모집] ';
          bgColor = '#6366f1'; // Indigo
          borderColor = '#4f46e5';
          break;
        case 'closed':
        case 'completed':
          statusLabel = '[마감] ';
          bgColor = '#94a3b8'; // Slate
          borderColor = '#64748b';
          break;
        case 'preparing':
          statusLabel = '[준비] ';
          bgColor = '#06b6d4'; // Cyan
          borderColor = '#0891b2';
          break;
      }

      // A. class_days (지정된 수업일) 기반 처리
      if (course.class_days) {
        let classDays: string[] = [];
        try {
          classDays = JSON.parse(course.class_days);
        } catch (e) { }

        if (Array.isArray(classDays) && classDays.length > 0) {
          for (const dateStr of classDays) {
            if (dateStr >= queryStartDate && dateStr <= queryEndDate) {
              events.push({
                id: `course-${course.id}-${dateStr}`,
                title: statusLabel + course.title,
                start: `${dateStr}T${startTime}`,
                end: `${dateStr}T${endTime}`,
                backgroundColor: bgColor,
                borderColor: borderColor,
                textColor: '#ffffff',
                extendedProps: {
                  type: 'course',
                  category: course.category,
                  status: course.status,
                  roomId: schedule.roomId || '미정'
                }
              });
            }
          }
          continue; // class_days가 있으면 이것만 사용
        }
      }

      // B. 기존 반복 로직 (Fallback)
      if (!course.start_date || !course.end_date) continue;

      let targetDayNums: number[] = [];
      if (daysStr) {
        if (daysStr.includes(',')) {
          daysStr.split(',').forEach((d: string) => {
            const trimmed = d.trim();
            if (dayMap[trimmed] !== undefined) targetDayNums.push(dayMap[trimmed]);
            else['일', '월', '화', '수', '목', '금', '토'].forEach((kd, i) => { if (trimmed.includes(kd)) targetDayNums.push(i); });
          });
        } else {
          ['일', '월', '화', '수', '목', '금', '토'].forEach((kd, i) => { if (daysStr.includes(kd)) targetDayNums.push(i); });
        }
      }
      targetDayNums = [...new Set(targetDayNums)]; // Dedup

      if (targetDayNums.length === 0) continue;

      const courseStart = new Date(course.start_date as string);
      const courseEnd = new Date(course.end_date as string);
      const viewStart = new Date(queryStartDate);
      const viewEnd = new Date(queryEndDate);

      let loopDate = new Date(Math.max(courseStart.getTime(), viewStart.getTime()));
      const loopEnd = new Date(Math.min(courseEnd.getTime(), viewEnd.getTime()));

      while (loopDate <= loopEnd) {
        if (targetDayNums.includes(loopDate.getDay())) {
          const dateString = loopDate.toISOString().split('T')[0];
          events.push({
            id: `course-${course.id}-${dateString}`,
            title: statusLabel + course.title,
            start: `${dateString}T${startTime}`,
            end: `${dateString}T${endTime}`,
            backgroundColor: bgColor,
            borderColor: borderColor,
            textColor: '#ffffff',
            extendedProps: {
              type: 'course',
              category: course.category,
              status: course.status,
              roomId: schedule.roomId || '미정'
            }
          });
        }
        loopDate.setDate(loopDate.getDate() + 1);
      }
    }

    // 1.5 진행 중/모집 중 회차 (course_sessions - 운영 중인 과정)
    try {
      const { results: sessions } = await DB.prepare(`
        SELECT s.id, s.session_number, s.status, s.training_start_date, s.training_end_date,
               a.name as course_name
        FROM course_sessions s
        INNER JOIN approved_courses a ON a.id = s.approved_course_id
        WHERE s.status IN ('in_progress', 'recruiting')
        AND s.training_start_date IS NOT NULL AND s.training_end_date IS NOT NULL
        AND (s.training_start_date <= ? AND s.training_end_date >= ?)
      `).bind(queryEndDate, queryStartDate).all<{
        id: number;
        session_number: number | null;
        status: string;
        training_start_date: string | null;
        training_end_date: string | null;
        course_name: string | null;
      }>();

      for (const sess of (sessions || [])) {
        const startDate = (sess.training_start_date || '').substring(0, 10);
        const endDateRaw = (sess.training_end_date || '').substring(0, 10);
        if (!startDate || !endDateRaw) continue;
        const endDate = new Date(endDateRaw);
        endDate.setDate(endDate.getDate() + 1);
        const endDateExclusive = endDate.toISOString().substring(0, 10);
        const num = sess.session_number != null ? sess.session_number : 1;
        const statusLabel = sess.status === 'in_progress' ? '[운영] ' : '[모집] ';
        const title = statusLabel + (sess.course_name || '과정') + ` (${num}회차)`;
        events.push({
          id: `session-${sess.id}`,
          title,
          start: startDate,
          end: endDateExclusive,
          allDay: true,
          backgroundColor: sess.status === 'in_progress' ? '#059669' : '#6366f1', // emerald-600 / indigo-500
          borderColor: sess.status === 'in_progress' ? '#047857' : '#4f46e5',
          textColor: '#ffffff',
          extendedProps: {
            type: 'course',
            status: sess.status,
            roomId: '회차',
            sessionId: sess.id
          }
        });
      }
    } catch (e) {
      console.warn('Course sessions (in_progress) fetch failed:', e);
    }

    // 2. Facilities Reservations (시설 예약)
    try {
      const { results: reservations } = await DB.prepare(`
        SELECT r.*, f.name as facility_name
        FROM hrd_facility_reservations r
        JOIN hrd_facilities f ON r.facility_id = f.id
        WHERE r.status != 'cancelled'
        AND (r.start_date < ? AND r.end_date > ?)
      `).bind(queryEndDate, queryStartDate).all();

      for (const res of (reservations || [])) {
        events.push({
          id: `res-${res.id}`,
          title: `[예약] ${res.facility_name} (${res.user_name || '익명'})`,
          start: res.start_date,
          end: res.end_date,
          backgroundColor: '#10b981', // emerald-500
          borderColor: '#059669',     // emerald-600
          textColor: '#ffffff',
          extendedProps: {
            type: 'facility',
            facilityName: res.facility_name,
            userName: res.user_name,
            purpose: res.purpose,
            status: res.status,
            description: res.memo
          }
        });
      }
    } catch (e) {
      console.warn('Facility reservations table fetch failed:', e);
    }

    // 3. Consultations & Online Inquiries (입학상담 및 온라인 문의)
    try {
      const { results: consultationList } = await DB.prepare(`
        SELECT *
        FROM consultations
        WHERE status != 'cancelled'
        AND (
          (preferred_date BETWEEN ? AND ?) OR
          (date(created_at) BETWEEN ? AND ?)
        )
      `).bind(queryStartDate, queryEndDate, queryStartDate, queryEndDate).all<{
        id: number;
        name: string;
        phone: string;
        preferred_date: string | null;
        preferred_time: string | null;
        message: string | null;
        status: string;
        memo: string | null;
        consultation_type: string | null;
        created_at: string;
      }>();

      for (const item of (consultationList || [])) {
        // 일시 결정: 방문예약일이 있으면 우선, 없으면 작성일 기준
        const createdAt = item.created_at as string;
        const dateStr = item.preferred_date || (createdAt ? createdAt.substring(0, 10) : null);
        if (!dateStr) continue;

        const startTime = (item.preferred_time as string) || (createdAt ? createdAt.substring(11, 16) : '09:00');
        const startDateTime = `${dateStr}T${startTime.length === 5 ? startTime + ':00' : startTime}`;

        const isPending = item.status === 'pending';
        const typeLabel = item.preferred_date ? '상담예약' : '온라인문의';
        const statusLabel = isPending ? '(신규)' : '(완료)';

        events.push({
          id: `cons-${item.id}`,
          title: `[${typeLabel}] ${item.name}${statusLabel}`,
          start: startDateTime,
          backgroundColor: isPending ? '#f97316' : '#94a3b8', // orange-500 (신규) vs slate-400 (완료)
          borderColor: isPending ? '#ea580c' : '#64748b',     // orange-600 vs slate-500
          textColor: '#ffffff',
          extendedProps: {
            type: 'consultation',
            subType: 'inquiry',
            clientName: item.name,
            phone: item.phone,
            description: item.message,
            status: item.status,
            memo: item.memo,
            consultationType: item.consultation_type,
            isInquiry: !item.preferred_date
          }
        });
      }
    } catch (e) { console.warn('Consultations fetch failed:', e); }

    // 4. HRD Counseling Logs (재학생 면담)
    try {
      const { results: logs } = await DB.prepare(`
        SELECT l.*, u.name as student_name
        FROM hrd_counseling_logs l
        JOIN users u ON l.student_id = u.id
        WHERE l.counseling_date BETWEEN ? AND ?
      `).bind(queryStartDate + ' 00:00:00', queryEndDate + ' 23:59:59').all();

      for (const log of (logs || [])) {
        if (!log.counseling_date) continue;

        events.push({
          id: `hrd-cons-${log.id}`,
          title: `[면담] ${log.student_name} (${log.category || '정기'})`,
          start: log.counseling_date,
          backgroundColor: '#e11d48', // rose-600
          borderColor: '#be123c',     // rose-700
          textColor: '#ffffff',
          extendedProps: {
            type: 'consultation',
            subType: 'hrd',
            clientName: log.student_name,
            category: log.category,
            method: log.method,
            description: log.content,
            result: log.result
          }
        });
      }
    } catch (e) { console.warn('HRD Counseling fetch failed:', e); }

    // 5. Calendar Events (일반/학사 일정)
    try {
      const { results: calEvents } = await DB.prepare(`
            SELECT * FROM calendar_events
            WHERE (start_date <= ? AND end_date >= ?)
        `).bind(queryEndDate, queryStartDate).all();

      for (const evt of (calEvents || [])) {
        let color = '#a855f7'; // purple-500 (General)
        if (evt.category === 'academic') color = '#3b82f6'; // blue-500
        if (evt.category === 'holiday') color = '#ef4444'; // red-500

        events.push({
          id: `evt-${evt.id}`,
          title: evt.title,
          start: evt.start_date,
          end: evt.end_date,
          allDay: !!evt.is_all_day,
          backgroundColor: color,
          borderColor: color,
          textColor: '#ffffff',
          extendedProps: {
            type: 'schedule',
            category: evt.category,
            description: evt.description
          }
        });
      }
    } catch (e) { console.warn('Calendar Events fetch failed:', e); }

    return c.json(events);

  } catch (error: any) {
    console.error('Error fetching integrated schedules:', error);
    return c.json({ error: error.message }, 500);
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
        if (typeof course.schedule === 'string' && course.schedule.startsWith('{')) {
          scheduleData = JSON.parse(course.schedule);
        } else {
          continue;
        }
      } catch (e) { continue; }

      if (!scheduleData.days) continue;

      const targetDays = scheduleData.days.split(',').map((d: string) => d.trim());
      const courseStart = new Date(course.start_date as string);
      const courseEnd = new Date(course.end_date as string);

      for (let day = 1; day <= lastDay; day++) {
        const currentDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date(currentDateStr);

        if (currentDate >= courseStart && currentDate <= courseEnd) {
          const dayOfWeek = currentDate.getDay();
          const dayName = ['일', '월', '화', '수', '목', '금', '토'][dayOfWeek];

          if (targetDays.includes(dayName)) {
            schedules.push({
              id: `course-${course.id}-${currentDateStr}`,
              course_id: course.id,
              course_name: course.title,
              category: course.category,
              target_audience: '전체',
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

// ============================================
// 스케줄 상세 조회 (공개 API) - 주의: 반드시 /integrated 및 /calendar 보다 뒤에 위치해야 함
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
// 통합 일정 등록 (시설 예약)
// ============================================
app.post('/events', authMiddleware, async (c) => {
  const { DB } = c.env;
  try {
    const body = await c.req.json();
    const { type, title, start, end, description, meta, allDay } = body;

    // 1. 시설 예약
    if (type === 'facility') {
      await DB.prepare(`
        INSERT INTO hrd_facility_reservations (
          facility_id, user_name, phone, purpose, start_date, end_date, status, memo
        ) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)
      `).bind(
        meta.facilityId,
        meta.userName || '관리자',
        meta.phone || null,
        title,
        start, end,
        description
      ).run();
    }
    // 2. 일반 일정 (학사, 휴일 등)
    else if (type === 'schedule') {
      const category = meta.category || 'general';
      await DB.prepare(`
            INSERT INTO calendar_events (
                title, start_date, end_date, is_all_day, category, description, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
        title, start, end, allDay ? 1 : 0, category, description,
        (c as any).get('user')?.id || null
      ).run();
    }
    // 3. 상담 수동 등록
    else if (type === 'consultation') {
      await DB.prepare(`
            INSERT INTO consultations (
                name, phone, preferred_date, preferred_time, message, status, consultation_type, created_at
            ) VALUES (?, ?, ?, ?, ?, 'scheduled', ?, CURRENT_TIMESTAMP)
        `).bind(
        meta.clientName,
        meta.phone,
        start.split('T')[0], // YYYY-MM-DD
        start.includes('T') ? start.split('T')[1].substring(0, 5) : '09:00', // HH:MM
        description,
        meta.consultationType || 'visit'
      ).run();
    }
    else {
      return c.json({ success: false, error: '지원하지 않는 일정 유형입니다.' }, 400);
    }

    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
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

export default app;
