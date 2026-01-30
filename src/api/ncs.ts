import { Hono } from 'hono';
import { Bindings, JWTPayload, Variables } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { forbiddenResponse } from '../utils/response';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function isD1SchemaError(e: unknown): boolean {
    const s = String((e as Error)?.message ?? e);
    return /no such column|no such table|syntax error/i.test(s);
}

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

// NCS 공공데이터 API 검색 (NCS_API_KEY 있으면 실제 API, 없으면 Mock)
const NCS_MOCK_DATA = [
    { code: '1503050101_19v3', name: '3D형상모델링', category: '3D프린터개발', level: 4, description: '3차원 형상을 모델링하여 3D 프린팅을 위한 데이터를 생성하는 능력이다.' },
    { code: '1503050102_19v3', name: '3D프린팅제작', category: '3D프린터개발', level: 3, description: '3D프린터를 이용하여 설계된 모델을 실제 제품으로 제작하는 능력이다.' },
    { code: '2001010101_16v2', name: '응용SW기초기술활용', category: '응용SW엔지니어링', level: 2, description: '응용 소프트웨어 개발에 필요한 기초 기술을 활용하는 능력이다.' },
    { code: '2001010102_16v2', name: '화면설계', category: '응용SW엔지니어링', level: 3, description: '사용자 요구사항을 기반으로 화면을 설계하는 능력이다.' },
    { code: '2001010201_16v2', name: '인터페이스설계', category: '응용SW엔지니어링', level: 4, description: '시스템 구성요소 간 인터페이스를 설계하는 능력이다.' }
];

/** 공공데이터 NCS 훈련과정정보 API 호출 (대분류 + 능력단위명 검색). 키 없으면 null */
async function fetchNcsPublicApi(apiKey: string, keyword: string, ncsLclasCd = '01'): Promise<{ code: string; name: string; category: string; level: number; description: string }[] | null> {
    const base = 'http://apis.data.go.kr/B490007/ncsTrainingCource';
    const params = new URLSearchParams({
        serviceKey: apiKey,
        pageNo: '1',
        numOfRows: '50',
        returnType: 'json',
        ncsLclasCd: ncsLclasCd || '01',
        cdName: keyword
    });
    const url = `${base}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json() as {
        response?: { body?: { items?: { item?: unknown } } };
    };
    const item = json?.response?.body?.items?.item;
    if (item == null) return [];
    const list = Array.isArray(item) ? item : [item];
    return list.map((row: Record<string, unknown>) => ({
        code: String(row.ncsClCd ?? row.ncsClcd ?? ''),
        name: String(row.compeUnitName ?? row.compeunitname ?? ''),
        category: String(row.ncsSclasCdnm ?? row.ncssclascdnm ?? row.ncsLclasCdnm ?? ''),
        level: Number(row.compeUnitLevel ?? row.compeunitlevel ?? 0) || 0,
        description: String(row.trainGoal ?? row.goal ?? '') || ''
    })).filter((r: { code: string }) => r.code);
}

/** 대분류 기준 훈련과정 목록 (중·소분류 포함) — 승인받은 NCS 등록용 */
type TrainingItem = {
    largeCode: string;
    largeName: string;
    midCode: string;
    midName: string;
    smallCode: string;
    smallName: string;
    unitCode: string;
    unitName: string;
};

async function fetchNcsTrainingPage(apiKey: string, ncsLclasCd: string, pageNo: number): Promise<{ items: TrainingItem[]; totalPage: number }> {
    const base = 'http://apis.data.go.kr/B490007/ncsTrainingCource';
    const params = new URLSearchParams({
        serviceKey: apiKey,
        pageNo: String(pageNo),
        numOfRows: '1000',
        returnType: 'json',
        ncsLclasCd: ncsLclasCd || '01'
    });
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return { items: [], totalPage: 1 };
    const json = await res.json() as {
        response?: {
            body?: {
                items?: { item?: unknown };
                totalCount?: number;
                totalPage?: number;
                totalpage?: number;
            };
        };
    };
    const body = json?.response?.body;
    const item = body?.items?.item;
    const totalCount = typeof body?.totalCount === 'number' ? body.totalCount : 0;
    const totalPage = body?.totalPage ?? body?.totalpage ?? Math.max(1, Math.ceil(totalCount / 1000));
    if (item == null) return { items: [], totalPage };
    const list = Array.isArray(item) ? item : [item];
    const mapped = list.map((row: Record<string, unknown>) => ({
        largeCode: String(row.ncsLclasCd ?? row.ncslclascd ?? ''),
        largeName: String(row.ncsLclasCdnm ?? row.ncslclascdnm ?? ''),
        midCode: String(row.ncsMclasCd ?? row.ncsmclascd ?? ''),
        midName: String(row.ncsMclasCdnm ?? row.ncsmclascdnm ?? ''),
        smallCode: String(row.ncsSclasCd ?? row.ncssclascd ?? ''),
        smallName: String(row.ncsSclasCdnm ?? row.ncssclascdnm ?? ''),
        unitCode: String(row.ncsClCd ?? row.ncsclcd ?? ''),
        unitName: String(row.compeUnitName ?? row.compeunitname ?? '')
    })).filter((r: TrainingItem) => r.unitCode) as TrainingItem[];
    return { items: mapped, totalPage };
}

async function fetchNcsTrainingByLarge(apiKey: string, ncsLclasCd: string): Promise<TrainingItem[]> {
    const all: TrainingItem[] = [];
    let pageNo = 1;
    let totalPage = 1;
    do {
        const { items, totalPage: tp } = await fetchNcsTrainingPage(apiKey, ncsLclasCd, pageNo);
        totalPage = tp;
        all.push(...items);
        if (items.length === 0 || pageNo >= totalPage) break;
        pageNo += 1;
    } while (pageNo <= totalPage);
    return all;
}

const NCS_MOCK_TRAINING: TrainingItem[] = [
    { largeCode: '15', largeName: '기계', midCode: '01', midName: '기계제작', smallCode: '01', smallName: '기계요소설계', unitCode: '15010201_19v3', unitName: '기계요소설계' },
    { largeCode: '15', largeName: '기계', midCode: '01', midName: '기계제작', smallCode: '02', smallName: '3D모델링', unitCode: '1503050101_19v3', unitName: '3D형상모델링' },
    { largeCode: '15', largeName: '기계', midCode: '03', midName: '3D프린터개발', smallCode: '01', smallName: '3D프린터개발', unitCode: '1503050102_19v3', unitName: '3D프린팅제작' },
    { largeCode: '01', largeName: '사업관리', midCode: '01', midName: '사업관리', smallCode: '01', smallName: '프로젝트관리', unitCode: '0101010101_17v2', unitName: '프로젝트관리' },
    { largeCode: '20', largeName: '정보통신', midCode: '01', midName: '응용SW엔지니어링', smallCode: '01', smallName: '응용SW엔지니어링', unitCode: '2001010101_16v2', unitName: '응용SW기초기술활용' },
    { largeCode: '20', largeName: '정보통신', midCode: '01', midName: '응용SW엔지니어링', smallCode: '02', smallName: 'SW개발', unitCode: '2001010201_16v2', unitName: '인터페이스설계' },
    { largeCode: '19', largeName: '전기·전자', midCode: '01', midName: '전기', smallCode: '01', smallName: '전기', unitCode: '1901010101_19v3', unitName: '전기설비설계' },
    { largeCode: '19', largeName: '전기·전자', midCode: '02', midName: '전자기기일반', smallCode: '01', smallName: '전자기기', unitCode: '1902010101_19v3', unitName: '전자기기일반' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '07', smallName: '디스플레이개발', unitCode: '1903070101_19v3', unitName: '디스플레이개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '08', smallName: '로봇개발', unitCode: '1903080101_19v3', unitName: '로봇개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '09', smallName: '의료장비제조', unitCode: '1903090101_19v3', unitName: '의료장비제조' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '10', smallName: '광기술개발', unitCode: '1903100101_19v3', unitName: '광기술개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', unitCode: '1903110101_19v3', unitName: '3D프린터개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', unitCode: '1903110201_19v3', unitName: '3D프린터용 제품제작' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', unitCode: '1903110301_19v3', unitName: '3D프린팅 소재개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '12', smallName: '가상훈련시스템개발', unitCode: '1903120101_19v3', unitName: '가상훈련시스템개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '13', smallName: '착용형스마트기기', unitCode: '1903130101_19v3', unitName: '착용형스마트기기' },
];

/** NCS 대분류 24개 고정 목록 (훈련직종 검색용) */
const NCS_LARGE_CLASSES: { code: string; name: string }[] = [
    { code: '01', name: '사업관리' },
    { code: '02', name: '경영·회계·사무' },
    { code: '03', name: '금융·보험' },
    { code: '04', name: '교육' },
    { code: '05', name: '법무·보안' },
    { code: '06', name: '보건·의료' },
    { code: '07', name: '사회복지·종교' },
    { code: '08', name: '문화·예술·디자인·방송' },
    { code: '09', name: '운송·물류' },
    { code: '10', name: '영업·판매·고객관리' },
    { code: '11', name: '숙박·여행·오락·스포츠' },
    { code: '12', name: '음식·조리' },
    { code: '13', name: '건설' },
    { code: '14', name: '부동산·임대' },
    { code: '15', name: '기계' },
    { code: '16', name: '금속·재료' },
    { code: '17', name: '화학' },
    { code: '18', name: '섬유·의복' },
    { code: '19', name: '전기·전자' },
    { code: '20', name: '정보통신' },
    { code: '21', name: '식품가공' },
    { code: '22', name: '인쇄·목재·가구·공예' },
    { code: '23', name: '환경·에너지·안전' },
    { code: '24', name: '농림·어업' },
];

app.get('/approved/large-classes', async (c) => {
    return c.json({ success: true, data: NCS_LARGE_CLASSES });
});

app.get('/approved/training', async (c) => {
    try {
        const ncsLclasCd = c.req.query('ncsLclasCd') || '01';
        const apiKey = c.env.NCS_API_KEY?.trim();
        if (apiKey) {
            try {
                const fromApi = await fetchNcsTrainingByLarge(apiKey, ncsLclasCd);
                if (fromApi.length > 0) return c.json({ success: true, data: fromApi });
            } catch (e) {
                console.warn('NCS approved/training API failed, using mock:', e);
            }
        }
        const filtered = NCS_MOCK_TRAINING.filter((r) => r.largeCode === ncsLclasCd);
        return c.json({ success: true, data: filtered });
    } catch (e) {
        console.error('NCS approved/training error:', e);
        return c.json({ success: false, error: '훈련과정 조회 실패' }, 500);
    }
});

// 승인받은 NCS 등록(과정개요) CRUD — 저장/수정/삭제
app.get('/approved/registrations', authMiddleware, requireAdmin, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_registrations ORDER BY updated_at DESC'
        ).all();
        return c.json({ success: true, data: results || [] });
    } catch (e) {
        console.error('ncs approved registrations list:', e);
        return c.json({ success: false, error: '목록 조회 실패' }, 500);
    }
});

app.get('/approved/registrations/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const row = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_registrations WHERE id = ?'
        ).bind(id).first();
        if (!row) return c.json({ success: false, error: '조회할 수 없습니다' }, 404);
        return c.json({ success: true, data: row });
    } catch (e) {
        console.error('ncs approved registration get:', e);
        return c.json({ success: false, error: '조회 실패' }, 500);
    }
});

app.post('/approved/registrations', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json<{
            ncs_tab?: string; course_type?: string; main_job_code?: string; main_job_name?: string;
            overview_content?: string; dev_category?: string; large_code?: string; mid_code?: string;
            small_code?: string; unit_code?: string; unit_name?: string;
            non_ncs_course_name?: string; non_ncs_overview?: string;
            course_name?: string; training_level?: string; prereq_skill?: string;
        }>();
        const ncsTab = (body.ncs_tab || 'ncs').trim();
        const courseType = (body.course_type || '').trim() || null;
        const mainJobCode = (body.main_job_code || '').trim() || null;
        const mainJobName = (body.main_job_name || '').trim() || null;
        const overviewContent = (body.overview_content || '').trim() || null;
        const devCategory = (body.dev_category || '').trim() || null;
        const largeCode = (body.large_code || '').trim() || null;
        const midCode = (body.mid_code || '').trim() || null;
        const smallCode = (body.small_code || '').trim() || null;
        const unitCode = (body.unit_code || '').trim() || null;
        const unitName = (body.unit_name || '').trim() || null;
        const nonNcsCourseName = (body.non_ncs_course_name || '').trim() || null;
        const nonNcsOverview = (body.non_ncs_overview || '').trim() || null;
        const courseName = (body.course_name || '').trim() || null;
        const trainingLevel = (body.training_level || '').trim() || null;
        const prereqSkill = (body.prereq_skill || '').trim() || null;

        const r = await c.env.DB.prepare(
            `INSERT INTO ncs_approved_registrations (
                ncs_tab, course_type, main_job_code, main_job_name, overview_content,
                dev_category, large_code, mid_code, small_code, unit_code, unit_name,
                non_ncs_course_name, non_ncs_overview, course_name, training_level, prereq_skill
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            ncsTab, courseType, mainJobCode, mainJobName, overviewContent,
            devCategory, largeCode, midCode, smallCode, unitCode, unitName,
            nonNcsCourseName, nonNcsOverview, courseName, trainingLevel, prereqSkill
        ).run();
        const id = Number(r.meta?.last_row_id ?? 0);
        const row = await c.env.DB.prepare('SELECT * FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        return c.json({ success: true, data: row }, 201);
    } catch (e) {
        console.error('ncs approved registration create:', e);
        const msg = isD1SchemaError(e)
            ? 'DB 스키마가 최신이 아닙니다. npm run db:migrate:prod 실행 후 다시 시도해 주세요.'
            : '등록 실패';
        return c.json({ success: false, error: msg }, 500);
    }
});

app.put('/approved/registrations/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const body = await c.req.json<{
            ncs_tab?: string; course_type?: string; main_job_code?: string; main_job_name?: string;
            overview_content?: string; dev_category?: string; large_code?: string; mid_code?: string;
            small_code?: string; unit_code?: string; unit_name?: string;
            non_ncs_course_name?: string; non_ncs_overview?: string;
            course_name?: string; training_level?: string; prereq_skill?: string;
        }>();
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '수정할 수 없습니다' }, 404);

        const ncsTab = (body.ncs_tab ?? '').toString().trim() || 'ncs';
        const courseType = (body.course_type || '').trim() || null;
        const mainJobCode = (body.main_job_code || '').trim() || null;
        const mainJobName = (body.main_job_name || '').trim() || null;
        const overviewContent = (body.overview_content || '').trim() || null;
        const devCategory = (body.dev_category || '').trim() || null;
        const largeCode = (body.large_code || '').trim() || null;
        const midCode = (body.mid_code || '').trim() || null;
        const smallCode = (body.small_code || '').trim() || null;
        const unitCode = (body.unit_code || '').trim() || null;
        const unitName = (body.unit_name || '').trim() || null;
        const nonNcsCourseName = (body.non_ncs_course_name || '').trim() || null;
        const nonNcsOverview = (body.non_ncs_overview || '').trim() || null;
        const courseName = (body.course_name || '').trim() || null;
        const trainingLevel = (body.training_level || '').trim() || null;
        const prereqSkill = (body.prereq_skill || '').trim() || null;

        await c.env.DB.prepare(
            `UPDATE ncs_approved_registrations SET
                ncs_tab = ?, course_type = ?, main_job_code = ?, main_job_name = ?, overview_content = ?,
                dev_category = ?, large_code = ?, mid_code = ?, small_code = ?, unit_code = ?, unit_name = ?,
                non_ncs_course_name = ?, non_ncs_overview = ?, course_name = ?, training_level = ?, prereq_skill = ?,
                updated_at = datetime('now')
            WHERE id = ?`
        ).bind(
            ncsTab, courseType, mainJobCode, mainJobName, overviewContent,
            devCategory, largeCode, midCode, smallCode, unitCode, unitName,
            nonNcsCourseName, nonNcsOverview, courseName, trainingLevel, prereqSkill, id
        ).run();
        const row = await c.env.DB.prepare('SELECT * FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        return c.json({ success: true, data: row });
    } catch (e) {
        console.error('ncs approved registration update:', e);
        const msg = isD1SchemaError(e)
            ? 'DB 스키마가 최신이 아닙니다. npm run db:migrate:prod 실행 후 다시 시도해 주세요.'
            : '수정 실패';
        return c.json({ success: false, error: msg }, 500);
    }
});

app.delete('/approved/registrations/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '삭제할 수 없습니다' }, 404);
        await c.env.DB.prepare('DELETE FROM ncs_approved_registrations WHERE id = ?').bind(id).run();
        return c.json({ success: true, message: '삭제되었습니다' });
    } catch (e) {
        console.error('ncs approved registration delete:', e);
        return c.json({ success: false, error: '삭제 실패' }, 500);
    }
});

/** 훈련이수체계도용: 등록 id → 주직종 + 수준별 능력단위/요소 */
app.get('/approved/registrations/:id/training-system', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const reg = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_registrations WHERE id = ?'
        ).bind(id).first() as { unit_code?: string; unit_name?: string; main_job_code?: string; main_job_name?: string; ncs_tab?: string; non_ncs_course_name?: string; selected_training_elements_json?: string | null } | null;
        if (!reg) return c.json({ success: false, error: '등록 정보 없음' }, 404);

        let selected: string[] = [];
        try {
            const raw = (reg as { selected_training_elements_json?: string | null }).selected_training_elements_json;
            if (raw && typeof raw === 'string') {
                const parsed = JSON.parse(raw);
                selected = Array.isArray(parsed) ? parsed.filter((x: unknown) => typeof x === 'string') : [];
            }
        } catch (_) { /* ignore */ }

        const mainJob = {
            code: (reg.unit_code || reg.main_job_code || '').trim() || null,
            name: (reg.unit_name || reg.main_job_name || '').trim() || null
        };
        if (reg.ncs_tab === 'non_ncs') {
            return c.json({
                success: true,
                data: {
                    mainJob: { code: null, name: (reg.non_ncs_course_name || '').trim() || null },
                    levels: { 5: [], 4: [], 3: [] },
                    basicAbility: [],
                    selected,
                    elements: []
                }
            });
        }

        const unitCode = mainJob.code || '';
        const unitName = mainJob.name || '';
        const levels: { 5: { name: string; code?: string }[]; 4: { name: string; code?: string }[]; 3: { name: string; code?: string }[] } = { 5: [], 4: [], 3: [] };
        let basicAbility: { name: string; code?: string }[] = [];
        let elementsFlat: { name: string; code?: string }[] = [];

        const unit = await c.env.DB.prepare(
            'SELECT id, level FROM ncs_units WHERE code = ?'
        ).bind(unitCode).first() as { id: number; level?: number } | null;

        if (unit) {
            const { results: elements } = await c.env.DB.prepare(
                'SELECT code, name FROM ncs_elements WHERE ncs_unit_id = ? ORDER BY code ASC'
            ).bind(unit.id).all() as { results: { code?: string; name: string }[] };
            const list = (elements || []).map((e) => ({ name: e.name || '', code: (e.code || '').trim() || undefined }));
            elementsFlat = list;
            const n = list.length;
            const g1 = Math.ceil(n / 3);
            const g2 = Math.ceil((n - g1) / 2) + g1;
            levels[5] = list.slice(0, g1);
            levels[4] = list.slice(g1, g2);
            levels[3] = list.slice(g2);
        } else if (unitName) {
            const mock = [
                { name: unitName + ' 기획', level: 5 as const },
                { name: unitName + ' 평가', level: 5 as const },
                { name: unitName + ' 시장조사', level: 4 as const },
                { name: unitName + ' 개발요소 선정', level: 4 as const },
                { name: unitName + ' 품질 관리', level: 4 as const },
                { name: unitName + ' 출력', level: 3 as const },
                { name: unitName + ' 안전관리', level: 3 as const }
            ];
            mock.forEach((m) => levels[m.level].push({ name: m.name }));
            elementsFlat = [...levels[5], ...levels[4], ...levels[3]];
        }

        return c.json({
            success: true,
            data: { mainJob: { code: unitCode || null, name: unitName || null }, levels, basicAbility, selected, elements: elementsFlat }
        });
    } catch (e) {
        console.error('ncs approved training-system:', e);
        return c.json({ success: false, error: '훈련이수체계도 조회 실패' }, 500);
    }
});

/** 훈련이수체계도(2단계) 선택 직종 저장 — 교과목편성(3단계)에서 사용 */
app.put('/approved/registrations/:id/training-system-selection', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const body = await c.req.json<{ selected?: string[] }>();
        const selected = Array.isArray(body.selected) ? body.selected.filter((x): x is string => typeof x === 'string') : [];
        const json = JSON.stringify(selected);
        await c.env.DB.prepare(
            'UPDATE ncs_approved_registrations SET selected_training_elements_json = ?, updated_at = datetime(\'now\') WHERE id = ?'
        ).bind(json, id).run();
        return c.json({ success: true, data: { selected } });
    } catch (e) {
        console.error('ncs approved training-system-selection put:', e);
        if (isD1SchemaError(e)) {
            return c.json({ success: false, error: '선택 저장을 위해 DB 마이그레이션이 필요합니다. migrations/0041_add_selected_training_elements.sql 을 적용해 주세요.' }, 503);
        }
        return c.json({ success: false, error: '선택 저장 실패' }, 500);
    }
});

/** 교과목 편성(3단계) 조회 */
app.get('/approved/registrations/:id/curriculum', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all();
        return c.json({ success: true, data: results || [] });
    } catch (e) {
        console.error('ncs approved curriculum get:', e);
        return c.json({ success: false, error: '교과목 편성 조회 실패' }, 500);
    }
});

/** 교과목 편성(3단계) 저장 — 전건 교체 */
app.put('/approved/registrations/:id/curriculum', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const body = await c.req.json<{ items?: { type: string; name: string; classification?: string; ability_units?: string[]; units?: string[]; objectives?: string[] }[] }>();
        const items = Array.isArray(body.items) ? body.items : [];

        await c.env.DB.prepare('DELETE FROM ncs_approved_curriculum WHERE registration_id = ?').bind(id).run();
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            const type = String(it.type || 'ncs').trim();
            const name = String(it.name || '').trim();
            const classification = (it.classification || '').trim() || null;
            const abilityUnitsJson = it.ability_units && Array.isArray(it.ability_units)
                ? JSON.stringify(it.ability_units) : null;
            const unitsJson = it.units && Array.isArray(it.units) ? JSON.stringify(it.units) : null;
            const objectivesJson = it.objectives && Array.isArray(it.objectives) ? JSON.stringify(it.objectives) : null;
            await c.env.DB.prepare(
                `INSERT INTO ncs_approved_curriculum (registration_id, type, name, classification, ability_units_json, units_json, objectives_json, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(id, type, name, classification, abilityUnitsJson, unitsJson, objectivesJson, i).run();
        }
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all();
        return c.json({ success: true, data: results || [] });
    } catch (e) {
        console.error('ncs approved curriculum put:', e);
        return c.json({ success: false, error: '교과목 편성 저장 실패' }, 500);
    }
});

/** 훈련시간설정(4단계) 조회 — 교과목 목록 + 교과목별 이론/실습 시간 */
app.get('/approved/registrations/:id/training-hours', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const { results: curriculum } = await c.env.DB.prepare(
            'SELECT id, type, name, classification, sort_order FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all();
        const curriculumIds = (curriculum || []).map((r: { id: number }) => r.id);
        let hoursMap: Record<number, { theory_hours: number; practice_hours: number }> = {};
        if (curriculumIds.length) {
            const placeholders = curriculumIds.map(() => '?').join(',');
            const { results: hoursRows } = await c.env.DB.prepare(
                `SELECT curriculum_id, theory_hours, practice_hours FROM ncs_approved_training_hours WHERE curriculum_id IN (${placeholders})`
            ).bind(...curriculumIds).all();
            (hoursRows || []).forEach((row: { curriculum_id: number; theory_hours: number; practice_hours: number }) => {
                hoursMap[row.curriculum_id] = { theory_hours: row.theory_hours ?? 0, practice_hours: row.practice_hours ?? 0 };
            });
        }
        const data = (curriculum || []).map((row: { id: number; type: string; name: string; classification: string | null; sort_order: number }) => {
            const h = hoursMap[row.id] || { theory_hours: 0, practice_hours: 0 };
            return {
                curriculum_id: row.id,
                type: row.type,
                name: row.name,
                classification: row.classification,
                sort_order: row.sort_order,
                theory_hours: h.theory_hours,
                practice_hours: h.practice_hours
            };
        });
        return c.json({ success: true, data });
    } catch (e) {
        console.error('ncs approved training-hours get:', e);
        return c.json({ success: false, error: '훈련시간 조회 실패' }, 500);
    }
});

/** 훈련시간설정(4단계) 저장 — 교과목별 이론/실습 시간 */
app.put('/approved/registrations/:id/training-hours', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const body = await c.req.json<{ items?: { curriculum_id: number; theory_hours?: number; practice_hours?: number }[] }>();
        const items = Array.isArray(body.items) ? body.items : [];
        for (const it of items) {
            const curriculumId = Number(it.curriculum_id);
            if (!curriculumId) continue;
            const theory = Math.max(0, Math.floor(Number(it.theory_hours) || 0));
            const practice = Math.max(0, Math.floor(Number(it.practice_hours) || 0));
            await c.env.DB.prepare(
                `INSERT INTO ncs_approved_training_hours (curriculum_id, theory_hours, practice_hours, updated_at)
                 VALUES (?, ?, ?, datetime('now'))
                 ON CONFLICT(curriculum_id) DO UPDATE SET theory_hours = excluded.theory_hours, practice_hours = excluded.practice_hours, updated_at = datetime('now')`
            ).bind(curriculumId, theory, practice).run();
        }
        const { results: curriculum } = await c.env.DB.prepare(
            'SELECT id FROM ncs_approved_curriculum WHERE registration_id = ?'
        ).bind(id).all();
        const curriculumIds = (curriculum || []).map((r: { id: number }) => r.id);
        let hoursMap: Record<number, { theory_hours: number; practice_hours: number }> = {};
        if (curriculumIds.length) {
            const placeholders = curriculumIds.map(() => '?').join(',');
            const { results: hoursRows } = await c.env.DB.prepare(
                `SELECT curriculum_id, theory_hours, practice_hours FROM ncs_approved_training_hours WHERE curriculum_id IN (${placeholders})`
            ).bind(...curriculumIds).all();
            (hoursRows || []).forEach((row: { curriculum_id: number; theory_hours: number; practice_hours: number }) => {
                hoursMap[row.curriculum_id] = { theory_hours: row.theory_hours ?? 0, practice_hours: row.practice_hours ?? 0 };
            });
        }
        const data = (curriculum || []).map((r: { id: number }) => ({
            curriculum_id: r.id,
            ...(hoursMap[r.id] || { theory_hours: 0, practice_hours: 0 })
        }));
        return c.json({ success: true, data });
    } catch (e) {
        console.error('ncs approved training-hours put:', e);
        return c.json({ success: false, error: '훈련시간 저장 실패' }, 500);
    }
});

app.get('/search', async (c) => {
    try {
        const keyword = c.req.query('keyword');
        if (!keyword) {
            return c.json({ success: false, error: '검색어를 입력해주세요' }, 400);
        }

        const apiKey = c.env.NCS_API_KEY?.trim();
        const ncsLclasCd = c.req.query('ncsLclasCd') || '01'; // 대분류코드(2자리), 미지정 시 01
        if (apiKey) {
            try {
                const fromApi = await fetchNcsPublicApi(apiKey, keyword, ncsLclasCd);
                if (fromApi != null) {
                    return c.json({ success: true, data: fromApi });
                }
            } catch (e) {
                console.warn('NCS public API failed, using mock:', e);
            }
        }

        const results = NCS_MOCK_DATA.filter(item =>
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

// NCS 능력단위 등록
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { code, name, level, category, description } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO ncs_units (code, name, level, category, description)
            VALUES (?, ?, ?, ?, ?)
        `).bind(code, name, level, category, description).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create NCS unit:', e);
        return c.json({ success: false, error: 'Failed to create NCS unit' }, 500);
    }
});

// NCS 능력단위 수정
app.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { code, name, level, category, description } = body;

        await c.env.DB.prepare(`
            UPDATE ncs_units SET code = ?, name = ?, level = ?, category = ?, description = ?
            WHERE id = ?
        `).bind(code, name, level, category, description, id).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update NCS unit:', e);
        return c.json({ success: false, error: 'Failed to update NCS unit' }, 500);
    }
});

// NCS 능력단위 삭제
app.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM ncs_units WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete NCS unit:', e);
        return c.json({ success: false, error: 'Failed to delete NCS unit' }, 500);
    }
});

// 과정별 NCS 편성 조회
app.get('/courses/:courseId', async (c) => {
    try {
        const courseId = c.req.param('courseId');
        const { results } = await c.env.DB.prepare(`
            SELECT m.*, u.code, u.name, u.level, u.category
            FROM course_ncs_units m
            JOIN ncs_units u ON m.ncs_unit_id = u.id
            WHERE m.course_id = ?
            ORDER BY u.code ASC
        `).bind(courseId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to get course NCS units:', e);
        return c.json({ success: false, error: 'Failed to get course NCS units' }, 500);
    }
});

// 과정에 NCS 능력단위 배정
app.post('/courses/:courseId', async (c) => {
    try {
        const courseId = c.req.param('courseId');
        const body = await c.req.json();
        const { ncs_unit_id, training_hours } = body;

        // 중복 체크
        const exists = await c.env.DB.prepare(
            "SELECT id FROM course_ncs_units WHERE course_id = ? AND ncs_unit_id = ?"
        ).bind(courseId, ncs_unit_id).first();

        if (exists) {
            return c.json({ success: false, error: 'This unit is already assigned to the course' }, 400);
        }

        await c.env.DB.prepare(`
            INSERT INTO course_ncs_units (course_id, ncs_unit_id, training_hours)
            VALUES (?, ?, ?)
        `).bind(courseId, ncs_unit_id, training_hours).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to assign NCS unit:', e);
        return c.json({ success: false, error: 'Failed to assign NCS unit' }, 500);
    }
});

// 과정에서 NCS 능력단위 제거
app.delete('/courses/:courseId/:unitId', async (c) => {
    try {
        const courseId = c.req.param('courseId');
        const unitId = c.req.param('unitId');

        await c.env.DB.prepare(
            "DELETE FROM course_ncs_units WHERE course_id = ? AND ncs_unit_id = ?"
        ).bind(courseId, unitId).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to remove NCS unit:', e);
        return c.json({ success: false, error: 'Failed to remove NCS unit' }, 500);
    }
});

// ==========================================
// NCS 평가 계획 (Evaluation Plans)
// ==========================================

// 평가 계획 조회
app.get('/plans', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const courseId = c.req.query('courseId');
        if (!courseId) return c.json({ success: false, error: 'Course ID is required' }, 400);

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(courseId).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        const { results } = await c.env.DB.prepare(`
            SELECT p.*, u.name as unit_name, u.code as unit_code, u.level as unit_level
            FROM ncs_evaluation_plans p
            JOIN ncs_units u ON p.ncs_unit_id = u.id
            WHERE p.course_id = ?
            ORDER BY u.code ASC
        `).bind(courseId).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch evaluation plans:', e);
        return c.json({ success: false, error: 'Failed to fetch evaluation plans' }, 500);
    }
});

// 평가 계획 등록
app.post('/plans', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const body = await c.req.json();
        const { course_id, ncs_unit_id, method, target_score, planned_date, status } = body;

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        const result = await c.env.DB.prepare(`
            INSERT INTO ncs_evaluation_plans (course_id, ncs_unit_id, method, target_score, planned_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(course_id, ncs_unit_id, method, target_score, planned_date, status || 'draft').run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create evaluation plan:', e);
        return c.json({ success: false, error: 'Failed to create evaluation plan' }, 500);
    }
});

// 평가 계획 삭제
app.delete('/plans/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM ncs_evaluation_plans WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete evaluation plan:', e);
        return c.json({ success: false, error: 'Failed to delete evaluation plan' }, 500);
    }
});

// ==========================================
// NCS 평가 결과 (Evaluation Results)
// ==========================================

// 과정별 수강생 평가 목록 조회 (입력용)
app.get('/evaluations/:planId', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const planId = c.req.param('planId');

        // 1. Plan 정보 조회
        const plan: any = await c.env.DB.prepare("SELECT * FROM ncs_evaluation_plans WHERE id = ?").bind(planId).first();
        if (!plan) return c.json({ success: false, error: 'Plan not found' }, 404);

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(plan.course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        // 2. 수강생 목록 및 기존 성적 조회
        const query = `
            SELECT 
                u.id as student_id, u.name, u.phone,
                er.score, er.is_passed, er.feedback, er.id as result_id
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            LEFT JOIN ncs_evaluation_results er ON er.plan_id = ? AND er.student_id = u.id
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;
        const { results } = await c.env.DB.prepare(query).bind(planId, plan.course_id).all();

        return c.json({ success: true, data: results, plan });
    } catch (e) {
        console.error('Failed to fetch evaluation targets:', e);
        return c.json({ success: false, error: 'Failed to fetch evaluation targets' }, 500);
    }
});

// 평가 결과 저장 (일괄 저장)
app.post('/results', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const body = await c.req.json();
        const { planId, results } = body; // results: [{ studentId, score, isPassed, feedback }]

        if (!planId || !results) return c.json({ success: false, error: 'Missing data' }, 400);

        // 권한 확인
        const plan: any = await c.env.DB.prepare("SELECT course_id FROM ncs_evaluation_plans WHERE id = ?").bind(planId).first();
        if (!plan) return c.json({ success: false, error: 'Plan not found' }, 404);

        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(plan.course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        // Batch update is tricky in D1/SQLite without transactions or multi-statement, so we loop.
        for (const res of results) {
            // Check existing
            const existing: any = await c.env.DB.prepare(
                "SELECT id FROM ncs_evaluation_results WHERE plan_id = ? AND student_id = ?"
            ).bind(planId, res.studentId).first();

            if (existing) {
                await c.env.DB.prepare(`
                    UPDATE ncs_evaluation_results 
                    SET score = ?, is_passed = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(res.score, res.isPassed, res.feedback, existing.id).run();
            } else {
                await c.env.DB.prepare(`
                    INSERT INTO ncs_evaluation_results (plan_id, student_id, score, is_passed, feedback)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(planId, res.studentId, res.score, res.isPassed, res.feedback).run();
            }
        }

        // Plan 상태를 'confirmed'로 업데이트 (선택사항)
        // await c.env.DB.prepare("UPDATE ncs_evaluation_plans SET status = 'confirmed' WHERE id = ?").bind(planId).run();

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to save evaluation results:', e);
        return c.json({ success: false, error: 'Failed to save evaluation results' }, 500);
    }
});

// ==========================================
// 학생용 NCS 조회 API
// ==========================================

// 학생별 NCS 평가 결과 조회 (나의 성적)
app.get('/my-results', async (c) => {
    try {
        const studentId = c.req.query('studentId');
        if (!studentId) return c.json({ success: false, error: 'Student ID is required' }, 400);

        const query = `
            SELECT 
                er.id as result_id, er.score, er.is_passed, er.feedback, er.graded_at,
                p.id as plan_id, p.method, p.target_score, p.planned_date,
                u.name as unit_name, u.code as unit_code,
                co.title as course_title
            FROM ncs_evaluation_results er
            JOIN ncs_evaluation_plans p ON er.plan_id = p.id
            JOIN ncs_units u ON p.ncs_unit_id = u.id
            JOIN courses co ON p.course_id = co.id
            WHERE er.student_id = ?
            ORDER BY er.graded_at DESC
        `;
        const { results } = await c.env.DB.prepare(query).bind(studentId).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch student results:', e);
        return c.json({ success: false, error: 'Failed to fetch student results' }, 500);
    }
});

// 학생별 관련 평가 계획 조회 (증빙 업로드용)
app.get('/my-plans', async (c) => {
    try {
        const studentId = c.req.query('studentId');
        if (!studentId) return c.json({ success: false, error: 'Student ID is required' }, 400);

        const query = `
            SELECT 
                p.*, u.name as unit_name, u.code as unit_code,
                co.title as course_title
            FROM ncs_evaluation_plans p
            JOIN ncs_units u ON p.ncs_unit_id = u.id
            JOIN courses co ON p.course_id = co.id
            JOIN enrollments e ON e.course_id = co.id
            WHERE e.user_id = ? AND e.status = 'approved'
            ORDER BY p.planned_date DESC
        `;
        const { results } = await c.env.DB.prepare(query).bind(studentId).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch student plans:', e);
        return c.json({ success: false, error: 'Failed to fetch student plans' }, 500);
    }
});

// ==========================================
// NCS 수행준거 (Elements)
// ==========================================

// 능력단위별 수행준거 조회
app.get('/units/:unitId/elements', async (c) => {
    try {
        const unitId = c.req.param('unitId');
        const { results } = await c.env.DB.prepare(`
        SELECT * FROM ncs_elements WHERE ncs_unit_id = ? ORDER BY code ASC
            `).bind(unitId).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch ncs elements:', e);
        return c.json({ success: false, error: 'Failed to fetch ncs elements' }, 500);
    }
});

// 수행준거 등록
app.post('/elements', async (c) => {
    try {
        const body = await c.req.json();
        const { ncs_unit_id, code, name, criteria } = body;
        const result = await c.env.DB.prepare(`
            INSERT INTO ncs_elements(ncs_unit_id, code, name, criteria)
        VALUES(?, ?, ?, ?)
            `).bind(ncs_unit_id, code, name, criteria).run();
        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to create ncs element:', e);
        return c.json({ success: false, error: 'Failed to create ncs element' }, 500);
    }
});

// ==========================================
// 세부 평가 항목 (Evaluation Items)
// ==========================================

// 평가 계획별 항목 조회
app.get('/plans/:planId/items', async (c) => {
    try {
        const planId = c.req.param('planId');
        const { results } = await c.env.DB.prepare(`
            SELECT i.*, e.name as element_name, e.code as element_code, e.criteria as element_criteria
            FROM ncs_evaluation_items i
            JOIN ncs_elements e ON i.ncs_element_id = e.id
            WHERE i.plan_id = ?
            ORDER BY e.code ASC
                `).bind(planId).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch evaluation items:', e);
        return c.json({ success: false, error: 'Failed to fetch evaluation items' }, 500);
    }
});

// ==========================================
// NCS 증빙 자료 (Evidence / Portfolio)
// ==========================================

// 증빙 자료 목록 조회
app.get('/evidence', async (c) => {
    try {
        const planId = c.req.query('planId');
        const studentId = c.req.query('studentId');

        let query = "SELECT * FROM ncs_evidence WHERE plan_id = ?";
        const params: any[] = [planId];

        if (studentId) {
            query += " AND student_id = ?";
            params.push(studentId);
        }

        query += " ORDER BY uploaded_at DESC";
        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch evidence:', e);
        return c.json({ success: false, error: 'Failed to fetch evidence' }, 500);
    }
});

// 증빙 자료 등록
app.post('/evidence', async (c) => {
    try {
        const body = await c.req.json();
        const { plan_id, student_id, file_name, file_url, file_type, comment } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO ncs_evidence(plan_id, student_id, file_name, file_url, file_type, comment)
        VALUES(?, ?, ?, ?, ?, ?)
            `).bind(plan_id, student_id, file_name, file_url, file_type, comment).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to upload evidence:', e);
        return c.json({ success: false, error: 'Failed to upload evidence' }, 500);
    }
});

// 평가 결과 CSV 내보내기 (HRD-Net 업로드용)
app.get('/plans/:planId/export-csv', async (c) => {
    try {
        const planId = c.req.param('planId');

        // 데이터 조회
        const query = `
            SELECT 
                u.name as student_name, u.phone,
                p.method, p.planned_date,
                un.code as unit_code, un.name as unit_name,
                er.score, er.is_passed
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            JOIN ncs_evaluation_plans p ON e.course_id = p.course_id
            JOIN ncs_units un ON p.ncs_unit_id = un.id
            LEFT JOIN ncs_evaluation_results er ON er.plan_id = p.id AND er.student_id = u.id
            WHERE p.id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;
        const { results } = await c.env.DB.prepare(query).bind(planId).all();

        if (!results || results.length === 0) return c.json({ success: false, error: 'No data to export' }, 404);

        // CSV 헤더 생성
        let csv = "성명,연락처,능력단위코드,능력단위명,평가방법,평가일자,득점,이수여부\\n";

        // 데이터 행 추가
        results.forEach((r: any) => {
            const score = r.score !== null ? r.score : '';
            const isPassed = r.score !== null ? (r.is_passed ? '이수' : '미이수') : '미평가';
            const date = r.planned_date || '';
            const phone = r.phone || '';

            csv += `"${r.student_name}","${phone}","${r.unit_code}","${r.unit_name}","${r.method}","${date}","${score}","${isPassed}"\n`;
        });

        // 엑셀 인식용 BOM(UTF-8) 추가하여 반환
        return new Response("\\uFEFF" + csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="ncs_results_${planId}.csv"`
            }
        });
    } catch (e) {
        console.error('Failed to export CSV:', e);
        return c.json({ success: false, error: 'Failed to export CSV' }, 500);
    }
});

export default app;
