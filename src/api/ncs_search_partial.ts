import { Hono } from 'hono';
import { Bindings, JWTPayload, Variables } from '../types';
import { authMiddleware } from '../middleware/auth';
import { forbiddenResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// NCS 능력단위 목록 조회
app.get('/', async (c) => {
    try {
        const search = c.req.query('search');
        let query = "SELECT * FROM ncs_units WHERE 1=1";
        const params: any[] = [];

        if (search) {
            query += " AND (name LIKE ? OR code LIKE ? OR category LIKE ?)";
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        query += " ORDER BY category ASC, level DESC";
        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch NCS units:', e);
        return c.json({ success: false, error: 'Failed to fetch NCS units' }, 500);
    }
});

// NCS 공공데이터 API 검색
app.get('/search', async (c) => {
    try {
        const keyword = c.req.query('keyword');
        if (!keyword) {
            return c.json({ success: false, error: '검색어를 입력해주세요' }, 400);
        }

        // Mock 데이터 반환 (실제 운영 시에는 공공데이터 API 연동)
        // 공공데이터포털 NCS API: http://apis.data.go.kr/B490007/ncsSearchSvc
        const mockData = [
            {
                code: '1503050101_19v3',
                name: '3D형상모델링',
                category: '3D프린터개발 · 기계장비설비',
                level: 4,
                description: '3차원 형상을 모델링하여 3D 프린팅을 위한 데이터를 생성하는 능력이다.'
            },
            {
                code: '1503050102_19v3',
                name: '3D프린팅제작',
                category: '3D프린터개발 · 기계장비설비',
                level: 3,
                description: '3D프린터를 이용하여 설계된 모델을 실제 제품으로 제작하는 능력이다.'
            },
            {
                code: '2001010101_16v2',
                name: '응용SW기초기술활용',
                category: '응용SW엔지니어링 · 정보통신',
                level: 2,
                description: '응용 소프트웨어 개발에 필요한 기초 기술을 활용하는 능력이다.'
            },
            {
                code: '2001010102_16v2',
                name: '화면설계',
                category: '응용SW엔지니어링 · 정보통신',
                level: 3,
                description: '사용자 요구사항을 기반으로 화면을 설계하는 능력이다.'
            },
            {
                code: '2001010201_16v2',
                name: '인터페이스설계',
                category: '응용SW엔지니어링 · 정보통신',
                level: 4,
                description: '시스템 구성요소 간 또는 시스템 간의 인터페이스를 설계하는 능력이다.'
            },
            {
                code: '2001010202_16v2',
                name: '통합구현',
                category: '응용SW엔지니어링 · 정보통신',
                level: 3,
                description: '설계된 구성 요소들을 통합하여 구현하는 능력이다.'
            }
        ];

        const results = mockData.filter(item =>
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.category.toLowerCase().includes(keyword.toLowerCase()) ||
            item.code.toLowerCase().includes(keyword.toLowerCase())
        );

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('NCS API search error:', e);
        return c.json({ success: false, error: 'NCS 검색 중 오류가 발생했습니다' }, 500);
    }
});

export default app;
