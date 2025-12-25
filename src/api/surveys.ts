import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings, Variables: { user: any } }>();

// GET /api/surveys/my-pending (For Students)
app.get('/my-pending', async (c) => {
    try {
        const user = c.get('user'); // Assuming authMiddleware populates this
        // In a real implementation:
        // 1. Get student's enrolled courses
        // 2. Find surveys for those courses
        // 3. Filter out those already responded to by this student

        // Mock Response
        return c.json({
            success: true,
            data: [
                { id: 1, type: 'diagnosis', title: '사전 NC·S 직무 역량 진단', startDate: '2024-01-01', endDate: '2024-12-31', status: 'pending', courseTitle: 'Java 국비지원 과정' },
                { id: 2, type: 'survey', title: '1개월차 훈련과정 만족도 조사', startDate: '2024-02-01', endDate: '2024-02-05', status: 'completed', courseTitle: 'Java 국비지원 과정' }
            ]
        });
    } catch (e) {
        return c.json({ success: false, error: (e as Error).message }, 500);
    }
});

// GET /api/surveys/teacher (For Teachers)
app.get('/teacher', async (c) => {
    try {
        const user = c.get('user');
        // 1. Get teacher's assigned courses
        // 2. Get surveys linked to those courses

        // Mock Response
        return c.json({
            success: true,
            data: [
                { id: 1, courseId: 101, type: 'diagnosis', title: '사전 NC·S 직무 역량 진단', startDate: '2024-01-01', endDate: '2024-12-31', responseCount: 15, totalTarget: 20, status: 'active', courseTitle: 'Java 국비지원 과정' },
                { id: 2, courseId: 101, type: 'survey', title: '1개월차 훈련과정 만족도 조사', startDate: '2024-02-01', endDate: '2024-02-05', responseCount: 18, totalTarget: 20, status: 'completed', courseTitle: 'Java 국비지원 과정' }
            ]
        });
    } catch (e) {
        return c.json({ success: false, error: (e as Error).message }, 500);
    }
});

// POST /api/surveys (Create Survey)
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        // Insert into DB
        return c.json({ success: true, message: 'Survey created successfully', id: 123 });
    } catch (e) {
        return c.json({ success: false, error: (e as Error).message }, 500);
    }
});

export default app;
