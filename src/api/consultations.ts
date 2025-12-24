import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

// 상담 신청 생성
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { name, phone, campus_name, category, message, privacy_agree } = body;

        // 유효성 검사
        if (!name || !phone || !privacy_agree) {
            return c.json({ success: false, error: '필수 항목을 입력해주세요.' }, 400);
        }

        // 캠퍼스 ID 찾기 (이름으로)
        // 편의상 1: 홍대, 2: 강남, 3: 온라인 등으로 매핑하거나, 그냥 DB에서 조회
        // 여기서는 간단히 처리하기 위해 campus_id는 null로 두고 message에 지점명 포함

        const fullMessage = `[지점: ${campus_name || '미지정'}]\n[희망분야: ${category || '미지정'}]\n\n${message || ''}`;

        const { results } = await c.env.DB.prepare(
            `INSERT INTO consultations (name, phone, message, status) VALUES (?, ?, ?, 'pending') RETURNING id`
        ).bind(name, phone, fullMessage).run();

        return c.json({ success: true, data: { id: results[0].id } });
    } catch (e) {
        console.error('Failed to create consultation:', e);
        return c.json({ success: false, error: '상담 신청 중 오류가 발생했습니다.' }, 500);
    }
});

export default app;
