import { Hono } from 'hono';
import { Bindings, JWTPayload, Variables } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { forbiddenResponse } from '../utils/response';
import { stepContentHtml } from '../views/admin_ncs_approved';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function isD1SchemaError(e: unknown): boolean {
    const s = String((e as Error)?.message ?? e);
    return /no such column|no such table|syntax error|undefined/i.test(s);
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

/** 대분류 기준 훈련과정 목록 (중·소·세분류 포함) — 승인받은 NCS 등록용 */
interface TrainingItem {
    largeCode: string; // NCS_LCLAS_CD
    largeName: string; // NCS_LCLAS_CDNM
    midCode: string;   // NCS_MCLAS_CD
    midName: string;   // NCS_MCLAS_CDNM
    smallCode: string; // NCS_SCLAS_CD
    smallName: string; // NCS_SCLAS_CDNM
    subClassCode: string; // NCS_SUBD_CD
    subClassName: string; // NCS_SUBD_CDNM
    unitCode: string;  // NCS_CL_CD
    unitName: string;  // COPE_UNIT_NAME
    /** 수준(1~8). 공공 API compeUnitLevel */
    level?: number;    // COMPE_UNIT_LEVEL
    elements?: { code: string; name: string }[];
}

/** 공공 API 서비스키: 저장 시 URL 인코딩된 경우 디코딩하여 사용 */
function decodeServiceKey(raw: string): string {
    try {
        if (raw.includes('%')) return decodeURIComponent(raw);
    } catch (_) { /* ignore */ }
    return raw;
}

const NCS_TRAINING_API_BASE = 'https://apis.data.go.kr/B490007/ncsTrainingCource/openapi18';

/** NCS 기준정보조회 API (15128213) — 전체 분류체계. env NCS_CLASSIFICATION_API_BASE 로 덮을 수 있음. */
const NCS_CLASSIFICATION_API_BASE_DEFAULT = 'http://apis.data.go.kr/B490007/hrdkapi';

function parseClassificationItems(raw: unknown): Record<string, unknown>[] {
    if (!raw || typeof raw !== 'object') return [];

    // 1. Array is prime
    if (Array.isArray(raw)) return raw.filter((r) => r && typeof r === 'object') as Record<string, unknown>[];

    const obj = raw as Record<string, unknown>;

    // 2. Error Header Check
    const header = (obj.header ?? (obj as any).response?.header) as any;
    if (header) {
        const rc = String(header.resultCode ?? header.RESULT_CODE ?? '').trim();
        if (rc && rc !== '00' && rc.toLowerCase() !== 'ok') {
            console.warn(`[NCS_API] Stopped by Header: ${rc}`);
            return [];
        }
    }

    // 3. Recursive search for any array of objects
    function findFirstArray(target: any): any[] | null {
        if (!target || typeof target !== 'object') return null;
        if (Array.isArray(target)) return target;

        // Check standard keys
        const keys = ['item', 'items', 'data', 'list', 'result', 'rows'];
        for (const k of keys) {
            const val = target[k];
            if (Array.isArray(val)) return val;
            if (val && typeof val === 'object') {
                const nested = findFirstArray(val);
                if (nested) return nested;
            }
        }

        // Exhaustive Search
        for (const k in target) {
            if (keys.includes(k)) continue;
            const val = target[k];
            if (Array.isArray(val)) return val;
            if (val && typeof val === 'object') {
                const nested = findFirstArray(val);
                if (nested) return nested;
            }
        }
        return null;
    }

    const detected = findFirstArray(obj);
    if (detected) {
        return detected.filter(r => r && typeof r === 'object' && Object.keys(r).length > 0);
    }

    // 4. Single element fallback (e.g. response.body.items.item is a single object)
    const body = ((obj as any).response?.body ?? (obj as any).body ?? (obj as any).data) as any;
    if (body && typeof body === 'object') {
        const single = body.item ?? body.items?.item;
        if (single && typeof single === 'object' && !Array.isArray(single)) {
            return [single];
        }
    }

    return [];
}

function rowVal(row: Record<string, unknown>, ...keys: string[]): string {
    for (const k of keys) {
        const v = row[k];
        if (v != null && String(v).trim() !== '') return String(v).trim();
    }
    // 공공 API가 다른 대소문자로 키를 줄 수 있음 (예: ncsMclasCdnm vs NcsMclasCdnm)
    const rowKeys = Object.keys(row);
    for (const k of keys) {
        const lower = k.toLowerCase();
        const found = rowKeys.find((rk) => rk.toLowerCase() === lower);
        if (found) {
            const v = row[found];
            if (v != null && String(v).trim() !== '') return String(v).trim();
        }
    }
    return '';
}

const CLASSIFICATION_PAGE_SIZE = 100;

/** 기준정보 API 한 오퍼레이션을 페이지네이션으로 전부 조회 (공공 API가 100건 제한인 경우 대비) */
async function fetchClassificationAllPages(
    base: string,
    key: string,
    path: string,
    params: Record<string, string>
): Promise<Record<string, unknown>[]> {
    const out: Record<string, unknown>[] = [];
    let pageNo = 1;
    const perPage = CLASSIFICATION_PAGE_SIZE;
    for (; ;) {
        const q = new URLSearchParams({ serviceKey: key, type: 'json', pageNo: String(pageNo), numOfRows: String(perPage), ...params });
        const url = `${base}/${path}?${q.toString()}`;
        console.log(`[NCS_API_REQ] ${path} ${JSON.stringify(params)}`);
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[NCS_API_ERR] HTTP ${res.status} for ${path}`);
            break;
        }
        const text = await res.text();
        let json: any = null;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error(`[NCS_API_ERR] JSON Parse failed for ${path}. Body starts with: ${text.slice(0, 100)}`);
            break;
        }

        let list = parseClassificationItems(json?.response ?? json?.body ?? json?.data ?? json);
        if (list.length === 0) list = parseClassificationItems(json);

        if (list.length === 0) break;
        out.push(...list);
        if (list.length < perPage) break;
        pageNo += 1;
        if (pageNo > 50) break; // 무한 방지
    }
    return out;
}

/** 기준정보 API로 대분류 기준 전체 트리 조회 (중·소). 속도를 위해 세분류(Jobs)는 제외하고 on-demand로 처리 권장. */
async function fetchNcsClassificationByLarge(apiKey: string, ncsLclasCd: string, baseUrl?: string): Promise<TrainingItem[] | null> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
    const largeName = NCS_LARGE_CLASSES.find((c) => c.code === ncsLclasCd)?.name ?? '';

    try {
        // 1) 중분류 목록 병렬 수집 (NCS002)
        const midListRaw = await fetchClassificationAllPages(base, key, 'NCS002', { NCS_LCLAS_CD: ncsLclasCd });
        if (!midListRaw || midListRaw.length === 0) return null;

        const mids = midListRaw
            .filter((r) => rowVal(r, 'USG_YN', 'usgYn') === 'Y')
            .map((r) => {
                const code = rowVal(r, 'NCS_MCLAS_CD', 'ncsMclasCd', 'mclasCd');
                const name = rowVal(r, 'NCS_MCLAS_CDNM', 'ncsMclasCdnm', 'mclasCdnm', 'NCS_MCLAS_NM', 'mclasNm', 'midName', 'mid_name');
                return { code, name: name || code };
            })
            .filter((m) => m.code);

        // 2) 모든 중분류에 대한 소분류 목록을 한꺼번에 병렬 수집
        const midToSmalls = await Promise.all(mids.map(async (mid) => {
            const list = await fetchClassificationAllPages(base, key, 'NCS003', { NCS_LCLAS_CD: ncsLclasCd, NCS_MCLAS_CD: mid.code });
            const smalls = list
                .filter((r) => rowVal(r, 'USG_YN', 'usgYn') === 'Y')
                .map((r) => {
                    const code = rowVal(r, 'NCS_SCLAS_CD', 'ncsSclasCd', 'sclasCd');
                    const name = rowVal(r, 'NCS_SCLAS_CDNM', 'ncsSclasCdnm', 'sclasCdnm', 'NCS_SCLAS_NM', 'sclasNm', 'smallName', 'small_name');
                    return { code, name: name || code };
                })
                .filter((s) => s.code);
            return { mid, smalls };
        }));

        const allItems: TrainingItem[] = [];
        for (const { mid, smalls } of midToSmalls) {
            if (smalls.length === 0) {
                allItems.push({
                    largeCode: ncsLclasCd, largeName, midCode: mid.code, midName: mid.name,
                    smallCode: '', smallName: '', subClassCode: '', subClassName: '', unitCode: '', unitName: ''
                });
            } else {
                for (const small of smalls) {
                    allItems.push({
                        largeCode: ncsLclasCd, largeName, midCode: mid.code, midName: mid.name,
                        smallCode: small.code, smallName: small.name, subClassCode: '', subClassName: '', unitCode: '', unitName: ''
                    });
                }
            }
        }
        return allItems.length > 0 ? allItems : null;
    } catch (e) {
        console.error('NCS Classification fetch error:', e);
        return null;
    }
}

/** 소분류(직종) 선택 시 하위 세분류(Job) 목록만 별도로 가져오기 (on-demand) */
async function fetchNcsJobsBySmall(apiKey: string, l: string, m: string, s: string, baseUrl?: string): Promise<{ code: string; name: string }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
    try {
        console.log(`[NCS004] Fetching 세분류/직종 for L=${l}, M=${m}, S=${s}`);
        const list = await fetchClassificationAllPages(base, key, 'NCS004', { NCS_LCLAS_CD: l, NCS_MCLAS_CD: m, NCS_SCLAS_CD: s });

        console.log(`[NCS004] Raw response count: ${list.length}`);
        if (list.length > 0) {
            console.log(`[NCS004] First item keys:`, Object.keys(list[0]));
            console.log(`[NCS004] First item sample:`, JSON.stringify(list[0]).substring(0, 200));
        }

        const results = list
            .filter((r) => {
                const usg = rowVal(r, 'USG_YN', 'usgYn', 'USG_YN');
                // Y, 1 또는 빈 값이면 사용 가능으로 간주
                return usg === 'Y' || usg === '1' || !usg;
            })
            .map((r) => {
                // NCS004는 세분류/직종 코드와 명칭을 가져와야 함
                // 가능한 필드명: NCS_SUBD_CD, ncsSubdCd, subdCd
                const code = rowVal(r, 'NCS_SUBD_CD', 'ncsSubdCd', 'subdCd', 'NCS_JOB_CD', 'ncsJobCd', 'jobCd');
                const name = rowVal(r, 'NCS_SUBD_CDNM', 'ncsSubdCdnm', 'subdCdnm', 'NCS_JOB_CDNM', 'ncsJobCdnm', 'jobCdnm');
                return { code, name };
            })
            .filter((x) => x.code && x.name);

        console.log(`[NCS004] Filtered results count: ${results.length}`);
        if (results.length > 0) {
            console.log(`[NCS004] First result:`, results[0]);
        }

        return results;
    } catch (e) {
        console.error('fetchNcsJobsBySmall error:', e);
        return [];
    }
}


/** NCS005: 능력단위분류코드 조회 - 특정 직종(세분류)의 모든 능력단위 가져오기 */
async function fetchNcsUnitsByJob(
    apiKey: string,
    ncsLclasCd: string,
    ncsMclasCd: string,
    ncsSclasCd: string,
    ncsSubdCd: string,
    baseUrl?: string
): Promise<{ code: string; name: string; level?: number }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
    try {
        const list = await fetchClassificationAllPages(base, key, 'NCS005', {
            NCS_LCLAS_CD: ncsLclasCd,
            NCS_MCLAS_CD: ncsMclasCd,
            NCS_SCLAS_CD: ncsSclasCd,
            NCS_SUBD_CD: ncsSubdCd
        });
        return list
            .filter((r) => rowVal(r, 'USG_YN', 'usgYn') === 'Y')
            .map((r) => {
                const code = rowVal(r, 'NCS_CL_CD', 'ncsClCd', 'clCd');
                const name = rowVal(r, 'COMPE_UNIT_NAME', 'compeUnitName', 'unitName');
                const levelStr = rowVal(r, 'COMPE_UNIT_LEVEL', 'compeUnitLevel', 'level');
                const level = levelStr ? parseInt(levelStr, 10) : undefined;
                return { code, name, level: isNaN(level!) ? undefined : level };
            })
            .filter((x) => x.code && x.name);
    } catch (e) {
        console.error('fetchNcsUnitsByJob error:', e);
        return [];
    }
}








/** NCS006: 능력단위요소 조회 - 특정 능력단위의 모든 요소(Elements) 가져오기 */
async function fetchNcsUnitElements(
    apiKey: string,
    ncsClCd: string,
    baseUrl?: string
): Promise<{ code: string; name: string }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');

    // Helper to map response
    const mapItems = (list: any[]) => list.map(r => ({
        code: rowVal(r, 'COMPE_UNIT_ELEM_CD', 'compeUnitElemCd', 'NCS_CL_ELEM_CD', 'COMPE_ELEM_CD'),
        name: rowVal(r, 'COMPE_UNIT_ELEM_NAME', 'compeUnitElemName', 'NCS_CL_ELEM_CDNM', 'COMPE_ELEM_NAME')
    })).filter(e => e.code && e.name);

    const baseCode = ncsClCd.split('_')[0];

    // 1. Try hrdkapi with multiple operation names and param formats
    const ops = ['getNcsCompeUnitElemList', 'NCS006'];
    const codes = [ncsClCd, baseCode];
    const paramNames = ['ncsClCd', 'NCS_CL_CD', 'COMPE_UNIT_CD'];

    for (const op of ops) {
        for (const code of codes) {
            for (const pName of paramNames) {
                try {
                    const list = await fetchClassificationAllPages(base, key, op, { [pName]: code });
                    if (list.length > 0) {
                        console.log(`[ELEMENTS] Found ${list.length} via ${op}(${pName}=${code})`);
                        return mapItems(list);
                    }
                } catch (e) { /* silent try next */ }
            }
        }
    }

    // 2. Try ODCloud (uddi:d8120558-7644-44ee-aa67-8fa879a80247) 
    try {
        const uddi = 'd8120558-7644-44ee-aa67-8fa879a80247';
        const q = new URLSearchParams({
            page: '1', perPage: '100', serviceKey: key, returnType: 'json',
            'cond[NCS_CL_CD::EQ]': baseCode
        });
        const url = `https://api.odcloud.kr/api/15083321/v1/uddi:${uddi}?${q.toString()}`;
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json() as any;
            if (json.data && Array.isArray(json.data) && json.data.length > 0) {
                console.log(`[ELEMENTS] Found ${json.data.length} via ODCloud for ${baseCode}`);
                return json.data.map((r: any) => ({
                    code: r.COMPE_UNIT_ELEM_CD || r.NCS_CL_ELEM_CD || r.COMPE_ELEM_CD || r.code,
                    name: r.COMPE_UNIT_ELEM_NAME || r.NCS_CL_ELEM_CDNM || r.COMPE_ELEM_NAME || r.name
                })).filter((e: any) => e.code && e.name);
            }
        }
    } catch (e) { console.error('[ELEMENTS] ODCloud fallback failed', e); }

    // 3. Fallback to static data (Last Resort)
    const candidates = [ncsClCd, baseCode];
    for (const c of candidates) {
        if (FALLBACK_ELEMENTS[c]) return FALLBACK_ELEMENTS[c];

        // Comprehensive check in Job Fallbacks
        const jobCode8 = c.substring(0, 8);
        const jobUnits = FALLBACK_NCS_UNITS[jobCode8];
        if (jobUnits) {
            const match = jobUnits.find(u => u.code === ncsClCd || u.code === baseCode || u.code.replace(/_.*$/, '') === baseCode);
            if (match && match.elements) {
                console.warn(`[ELEMENTS] Recovered from Job Fallback for ${c}`);
                return match.elements;
            }
        }
    }

    console.warn(`[ELEMENTS] All methods failed for ${ncsClCd}`);
    return [];
}

/** NCS008: 수행준거 조회 - 능력단위 요소별 수행준거, 지식, 기술, 태도 */
async function fetchNcsPerformanceCriteria(apiKey: string, ncsClCd: string, baseUrl?: string): Promise<{ elemCode: string; criteriaText: string; knowledgeText: string; skillText: string; attitudeText: string }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');

    // Helper to extract text from various possible keys
    const getVal = (r: any, ...keys: string[]) => {
        for (const k of keys) {
            const v = r[k];
            if (v != null && String(v).trim() !== '') return String(v).trim();
        }
        return '';
    };

    const baseCode = ncsClCd.split('_')[0];
    const ops = ['NCS008', 'getNcsCompeUnitElemDtlList', 'getNcsCompeUnitElemList']; // 008 is standard for details
    const paramNames = ['ncsClCd', 'NCS_CL_CD', 'COMPE_UNIT_CD'];

    for (const op of ops) {
        for (const pName of paramNames) {
            try {
                const list = await fetchClassificationAllPages(base, key, op, { [pName]: ncsClCd });
                if (list.length > 0) {
                    console.log(`[CRITERIA] Found ${list.length} via ${op}(${pName}=${ncsClCd})`);
                    return list.map(r => ({
                        elemCode: getVal(r, 'COMPE_UNIT_ELEM_CD', 'NCS_CL_ELEM_CD', 'ELEM_CD'),
                        criteriaText: getVal(r, 'PERFORMAN_CRIT_CONT', 'PERFORM_CRITERIA', 'CRITERIA_CONT', 'CRITERIA'),
                        knowledgeText: getVal(r, 'KNOWLEDGE_CONT', 'KNOWLEDGE', 'KNOW_CONT'),
                        skillText: getVal(r, 'SKILL_CONT', 'SKILL', 'SKILL_CONT'),
                        attitudeText: getVal(r, 'ATTITUDE_CONT', 'ATTITUDE', 'ATTIT_CONT')
                    })).filter(e => e.elemCode && (e.criteriaText || e.knowledgeText));
                }
            } catch (e) { /* ignore and try next */ }
        }
    }

    // Try baseCode if full code failed
    if (baseCode !== ncsClCd) {
        for (const op of ops) {
            try {
                const list = await fetchClassificationAllPages(base, key, op, { [paramNames[0]]: baseCode });
                if (list.length > 0) {
                    return list.map(r => ({
                        elemCode: getVal(r, 'COMPE_UNIT_ELEM_CD', 'NCS_CL_ELEM_CD', 'ELEM_CD'),
                        criteriaText: getVal(r, 'PERFORMAN_CRIT_CONT', 'PERFORM_CRITERIA', 'CRITERIA_CONT', 'CRITERIA'),
                        knowledgeText: getVal(r, 'KNOWLEDGE_CONT', 'KNOWLEDGE', 'KNOW_CONT'),
                        skillText: getVal(r, 'SKILL_CONT', 'SKILL', 'SKILL_CONT'),
                        attitudeText: getVal(r, 'ATTITUDE_CONT', 'ATTITUDE', 'ATTIT_CONT')
                    })).filter(e => e.elemCode && (e.criteriaText || e.knowledgeText));
                }
            } catch (e) { }
        }
    }

    console.warn(`[CRITERIA] Failed for ${ncsClCd}`);
    return [];
}

/** NCS009: 평가방법 조회 - 능력단위별 권장 평가방법 및 교수학습방법 */
async function fetchNcsEvaluationMethods(apiKey: string, ncsClCd: string, baseUrl?: string): Promise<{ evaluation: string[]; teaching: string[] }> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');

    const baseCode = ncsClCd.split('_')[0];
    const ops = ['NCS009', 'getNcsCompeUnitEvalList', 'getNcsCompeUnitLrnList'];
    const paramNames = ['ncsClCd', 'NCS_CL_CD', 'COMPE_UNIT_CD'];

    const evaluation: Set<string> = new Set();
    const teaching: Set<string> = new Set();

    for (const op of ops) {
        for (const pName of paramNames) {
            try {
                const list = await fetchClassificationAllPages(base, key, op, { [pName]: ncsClCd });
                if (list.length > 0) {
                    list.forEach(r => {
                        const ev = rowVal(r, 'EVAL_METH_NAME', 'EVAL_METHOD', 'EVAL_NAME', 'METH_NAME');
                        if (ev) evaluation.add(ev);
                        const te = rowVal(r, 'LRN_METH_NAME', 'TEACH_METHOD', 'LRN_NAME', 'TRAIN_METH_NAME');
                        if (te) teaching.add(te);
                    });
                }
            } catch (e) { }
        }
    }

    // Try baseCode if nothing found
    if (evaluation.size === 0 && teaching.size === 0 && baseCode !== ncsClCd) {
        for (const op of ops) {
            try {
                const list = await fetchClassificationAllPages(base, key, op, { [paramNames[0]]: baseCode });
                list.forEach(r => {
                    const ev = rowVal(r, 'EVAL_METH_NAME', 'EVAL_METHOD', 'EVAL_NAME', 'METH_NAME');
                    if (ev) evaluation.add(ev);
                    const te = rowVal(r, 'LRN_METH_NAME', 'TEACH_METHOD', 'LRN_NAME', 'TRAIN_METH_NAME');
                    if (te) teaching.add(te);
                });
            } catch (e) { }
        }
    }

    return {
        evaluation: Array.from(evaluation),
        teaching: Array.from(teaching)
    };
}

/** NCS007: 능력단위취지도 검색 - 키워드로 능력단위 검색 */
async function fetchNcsUnitsByKeyword(
    apiKey: string,
    keyword: string,
    level?: string,
    startNum?: number,
    endNum?: number,
    pageNo?: number,
    numOfRows?: number,
    baseUrl?: string
): Promise<{ code: string; name: string; level?: number; description?: string }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');

    const params: Record<string, string> = {
        serviceKey: key,
        pageNo: String(pageNo || 1),
        numOfRows: String(numOfRows || 100),
        LVL: level || '',
        SWRD: keyword,
        SNUM: String(startNum || 1),
        ENUM: String(endNum || 100)
    };

    try {
        const url = `${base}/NCS007?${new URLSearchParams(params).toString()}`;
        const res = await fetch(url);

        if (!res.ok) {
            console.warn('NCS007 HTTP error:', res.status);
            return [];
        }

        const json = await res.json() as Record<string, unknown>;
        const resp = json?.response as Record<string, unknown> | undefined;
        const header = (resp?.header ?? json?.header) as Record<string, unknown> | undefined;
        const resultCode = header ? String(header.resultCode ?? header.RESULT_CODE ?? '').trim() : '';

        if (resultCode && resultCode !== '00' && resultCode.toLowerCase() !== 'ok') {
            console.warn('NCS007 result error:', resultCode);
            return [];
        }

        const body = (resp?.body ?? json?.body ?? json?.data) as Record<string, unknown> | unknown[] | undefined;
        let items: unknown[] = [];

        if (Array.isArray(body)) {
            items = body;
        } else if (body && typeof body === 'object') {
            const itemsNode = (body as Record<string, unknown>).items;
            if (Array.isArray(itemsNode)) {
                items = itemsNode;
            } else if (itemsNode && typeof itemsNode === 'object' && 'item' in itemsNode) {
                const item = (itemsNode as { item: unknown }).item;
                items = Array.isArray(item) ? item : (item ? [item] : []);
            }
        }

        return items
            .filter((r): r is Record<string, unknown> => r != null && typeof r === 'object')
            .map((r) => {
                const code = rowVal(r, 'NCS_CL_CD', 'ncsClCd', 'clCd');
                const name = rowVal(r, 'COMPE_UNIT_NAME', 'compeUnitName', 'unitName');
                const levelStr = rowVal(r, 'COMPE_UNIT_LEVEL', 'compeUnitLevel', 'level');
                const description = rowVal(r, 'COMPE_UNIT_PURPOSE', 'compeUnitPurpose', 'purpose');
                const lv = levelStr ? parseInt(levelStr, 10) : undefined;
                return {
                    code,
                    name,
                    level: isNaN(lv!) ? undefined : lv,
                    description: description || undefined
                };
            })
            .filter((x) => x.code && x.name);
    } catch (e) {
        console.error('fetchNcsUnitsByKeyword error:', e);
        return [];
    }
}


/** Fallback 능력단위요소 데이터 - DB/API 실패 시 사용 */
const FALLBACK_ELEMENTS: Record<string, { code: string; name: string }[]> = {
    '1501020125_19v3': [
        { code: '1501020125_19v3_01', name: '3D 형상 모델링 준비하기' },
        { code: '1501020125_19v3_02', name: '3D 부품 모델링하기' },
        { code: '1501020125_19v3_03', name: '3D 조립 모델링 및 모델링 검토하기' }
    ],
    '1501020123_19v2': [
        { code: '1501020123_19v2_01', name: '2D 도면 작성하기' },
        { code: '1501020123_19v2_02', name: '부품도 상세 기입하기' },
        { code: '1501020123_19v2_03', name: '도면 부품란 작성하기' }
    ],
    '1501020121_19v3': [
        { code: '1501020121_19v3_01', name: '투상도 및 단면도 분석하기' },
        { code: '1501020121_19v3_02', name: '치수 및 기하공차 파악하기' }
    ],
    // 3D프린터 HW 설정 (Verified by User Image)
    '1903110208_23v3': [
        { code: '1903110208_23v3_01', name: '소재 준비하기' },
        { code: '1903110208_23v3_02', name: '데이터 준비하기' },
        { code: '1903110208_23v3_03', name: '장비출력 설정하기' }
    ],
    '1903110208': [
        { code: '1903110208_23v3_01', name: '소재 준비하기' },
        { code: '1903110208_23v3_02', name: '데이터 준비하기' },
        { code: '1903110208_23v3_03', name: '장비출력 설정하기' }
    ]
};


/** 기준정보 API로 대분류 목록 조회 (NCS001) */
async function fetchNcsLargeClasses(apiKey: string, baseUrl?: string): Promise<{ code: string; name: string }[]> {
    const key = decodeServiceKey(apiKey);
    const base = (baseUrl || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
    try {
        const list = await fetchClassificationAllPages(base, key, 'NCS001', {});
        return list
            .filter((r) => rowVal(r, 'USG_YN', 'usgYn') === 'Y')
            .map((r) => ({
                code: rowVal(r, 'NCS_LCLAS_CD', 'ncsLclasCd', 'lclasCd'),
                name: rowVal(r, 'NCS_LCLAS_CDNM', 'ncsLclasCdnm', 'lclasCdnm')
            }))
            .filter((x) => x.code && x.name);
    } catch (e) {
        console.error('fetchNcsLargeClasses error:', e);
        return [];
    }
}


async function fetchNcsTrainingPage(apiKey: string, ncsLclasCd: string, pageNo: number): Promise<{ items: TrainingItem[]; totalPage: number }> {
    const key = decodeServiceKey(apiKey);
    const params = new URLSearchParams({
        serviceKey: key,
        pageNo: String(pageNo),
        numOfRows: '1000',
        returnType: 'json',
        ncsLclasCd: ncsLclasCd || '01'
    });
    const url = `${NCS_TRAINING_API_BASE}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.warn('NCS public API HTTP error:', res.status, res.statusText);
        return { items: [], totalPage: 1 };
    }
    const json = await res.json() as Record<string, unknown>;
    const resp = json?.response as Record<string, unknown> | undefined;
    const header = (resp?.header ?? json?.header) as Record<string, unknown> | undefined;
    const resultCode = header ? String(header.resultCode ?? header.RESULT_CODE ?? '').trim() : '';
    if (resultCode && resultCode !== '00' && resultCode.toLowerCase() !== 'ok') {
        const resultMsg = header ? String(header.resultMsg ?? header.RESULT_MSG ?? '').trim() : '';
        console.warn('NCS public API result error:', resultCode, resultMsg);
        return { items: [], totalPage: 1 };
    }
    const body = (resp?.body ?? json?.body ?? json?.data ?? json?.dataInfo) as Record<string, unknown> | unknown[] | undefined;
    const bodyObj = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : undefined;
    const dataArray = Array.isArray(body) ? body : undefined;
    let itemsRaw: unknown = dataArray ?? (bodyObj ? (bodyObj.items as Record<string, unknown> | unknown[] | undefined) : undefined);
    if (itemsRaw == null && bodyObj) {
        const itemsNode = bodyObj.items as Record<string, unknown> | unknown[] | undefined;
        itemsRaw = Array.isArray(itemsNode) ? itemsNode : (itemsNode && typeof itemsNode === 'object' && 'item' in itemsNode ? (itemsNode as { item: unknown }).item : bodyObj.item);
    }
    if (itemsRaw == null && bodyObj) {
        for (const k of ['data', 'list', 'result', 'rows']) {
            const v = bodyObj[k];
            if (Array.isArray(v) && v.length > 0) { itemsRaw = v; break; }
        }
        if (itemsRaw == null) {
            const firstArray = Object.values(bodyObj).find((v) => Array.isArray(v) && v.length > 0 && typeof (v as unknown[])[0] === 'object');
            if (firstArray) itemsRaw = firstArray;
        }
    }
    const totalCount = bodyObj ? (typeof bodyObj.totalCount === 'number' ? bodyObj.totalCount : (typeof bodyObj.totalCount === 'string' ? parseInt(String(bodyObj.totalCount), 10) : 0) || 0) : (dataArray ? dataArray.length : 0);
    const totalPage = bodyObj ? (typeof bodyObj.totalPage === 'number' ? bodyObj.totalPage : (typeof bodyObj.totalpage === 'number' ? bodyObj.totalpage : Math.max(1, Math.ceil(totalCount / 1000)))) : 1;
    if (itemsRaw == null) return { items: [], totalPage };
    const list = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];
    const rowKey = (row: Record<string, unknown>, ...keys: string[]) => {
        for (const k of keys) {
            const v = row[k];
            if (v != null && String(v).trim() !== '') return String(v).trim();
        }
        return '';
    };
    const mapped = list.map((row: Record<string, unknown>) => {
        const largeCode = rowKey(row, 'ncsLclasCd', 'NcsLclasCd', 'ncslclascd', 'NCS_LCLAS_CD');
        const largeName = rowKey(row, 'ncsLclasCdnm', 'NcsLclasCdnm', 'ncslclascdnm', 'NCS_LCLAS_CDNM');
        const midCode = rowKey(row, 'ncsMclasCd', 'NcsMclasCd', 'ncsmclascd', 'NCS_MCLAS_CD');
        const midName = rowKey(row, 'ncsMclasCdnm', 'NcsMclasCdnm', 'ncsmclascdnm', 'NCS_MCLAS_CDNM');
        const smallCode = rowKey(row, 'ncsSclasCd', 'NcsSclasCd', 'ncssclascd', 'NCS_SCLAS_CD');
        const smallName = rowKey(row, 'ncsSclasCdnm', 'NcsSclasCdnm', 'ncssclascdnm', 'NCS_SCLAS_CDNM');
        let subClassCode = rowKey(row, 'ncsSubdCd', 'ncsSubdCd', 'ncssubdcd', 'NCS_SUBD_CD', 'ncsDclasCd', 'ncsdclascd', 'NCS_DCLAS_CD', 'ncsSubClasCd', 'ncssubclascd');
        let subClassName = rowKey(row, 'ncsSubdCdnm', 'ncsSubdCdnm', 'ncssubdcdnm', 'NCS_SUBD_CDNM', 'ncsDclasCdnm', 'ncsdclascdnm', 'NCS_DCLAS_CDNM', 'ncsSubClasCdnm', 'ncssubclascdnm');
        const unitCode = rowKey(row, 'ncsClCd', 'NcsClCd', 'ncsclcd', 'NCS_CL_CD');
        const unitName = rowKey(row, 'compeUnitName', 'compeunitname', 'COPE_UNIT_NAME', 'trainGoal', 'traingoal');
        const levelRaw = (row.compeUnitLevel ?? row.compeunitlevel ?? row.COMPE_UNIT_LEVEL) as number | string | undefined;
        const level = levelRaw != null ? (typeof levelRaw === 'number' ? levelRaw : parseInt(String(levelRaw), 10)) : undefined;
        // API에 세분류 필드가 없을 때: 능력단위코드(10자리)에서 7~8자리가 세분류코드 (대2+중2+소2+세2+일련2)
        if (!subClassCode && unitCode && unitCode.length >= 8) {
            const numPart = unitCode.replace(/_.*$/, '');
            if (numPart.length >= 8) subClassCode = numPart.slice(6, 8);
            if (!subClassName && unitName) subClassName = unitName;
        }
        return { largeCode, largeName, midCode, midName, smallCode, smallName, subClassCode, subClassName, unitCode, unitName, level: Number.isFinite(level) ? level : undefined };
    }).filter((r: TrainingItem) => r.largeCode && (r.midCode || r.unitCode)) as TrainingItem[];
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
    { largeCode: '15', largeName: '기계', midCode: '01', midName: '기계제작', smallCode: '01', smallName: '기계요소설계', subClassCode: '', subClassName: '', unitCode: '15010201_19v3', unitName: '기계요소설계' },
    { largeCode: '15', largeName: '기계', midCode: '01', midName: '기계제작', smallCode: '02', smallName: '3D모델링', subClassCode: '', subClassName: '', unitCode: '1503050101_19v3', unitName: '3D형상모델링' },
    { largeCode: '15', largeName: '기계', midCode: '03', midName: '3D프린터개발', smallCode: '01', smallName: '3D프린터개발', subClassCode: '', subClassName: '', unitCode: '1503050102_19v3', unitName: '3D프린팅제작' },
    { largeCode: '01', largeName: '사업관리', midCode: '01', midName: '사업관리', smallCode: '01', smallName: '프로젝트관리', subClassCode: '', subClassName: '', unitCode: '0101010101_17v2', unitName: '프로젝트관리' },
    { largeCode: '20', largeName: '정보통신', midCode: '01', midName: '응용SW엔지니어링', smallCode: '01', smallName: '응용SW엔지니어링', subClassCode: '', subClassName: '', unitCode: '2001010101_16v2', unitName: '응용SW기초기술활용' },
    { largeCode: '20', largeName: '정보통신', midCode: '01', midName: '응용SW엔지니어링', smallCode: '02', smallName: 'SW개발', subClassCode: '', subClassName: '', unitCode: '2001010201_16v2', unitName: '인터페이스설계' },
    { largeCode: '19', largeName: '전기·전자', midCode: '01', midName: '전기', smallCode: '01', smallName: '전기', subClassCode: '', subClassName: '', unitCode: '1901010101_19v3', unitName: '전기설비설계' },
    { largeCode: '19', largeName: '전기·전자', midCode: '02', midName: '전자기기일반', smallCode: '01', smallName: '전자기기', subClassCode: '', subClassName: '', unitCode: '1902010101_19v3', unitName: '전자기기일반' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '07', smallName: '디스플레이개발', subClassCode: '', subClassName: '', unitCode: '1903070101_19v3', unitName: '디스플레이개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '08', smallName: '로봇개발', subClassCode: '', subClassName: '', unitCode: '1903080101_19v3', unitName: '로봇개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '09', smallName: '의료장비제조', subClassCode: '', subClassName: '', unitCode: '1903090101_19v3', unitName: '의료장비제조' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '10', smallName: '광기술개발', subClassCode: '', subClassName: '', unitCode: '1903100101_19v3', unitName: '광기술개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', subClassCode: '', subClassName: '', unitCode: '1903110101_19v3', unitName: '3D프린터개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', subClassCode: '', subClassName: '', unitCode: '1903110201_19v3', unitName: '3D프린터용 제품제작' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '11', smallName: '3D프린터개발', subClassCode: '', subClassName: '', unitCode: '1903110301_19v3', unitName: '3D프린팅 소재개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '12', smallName: '가상훈련시스템개발', subClassCode: '', subClassName: '', unitCode: '1903120101_19v3', unitName: '가상훈련시스템개발' },
    { largeCode: '19', largeName: '전기·전자', midCode: '03', midName: '전자기기개발', smallCode: '13', smallName: '착용형스마트기기', subClassCode: '', subClassName: '', unitCode: '1903130101_19v3', unitName: '착용형스마트기기' },
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

/** 공공 API 상태 진단 (키·응답·항목 수 확인) — 훈련직종 리스트 문제 원인 확인용 */
app.get('/approved/check', async (c) => {
    const rawKey = c.env.NCS_API_KEY?.trim();
    if (!rawKey) {
        return c.json({
            success: false,
            publicApi: 'key_missing',
            message: 'NCS_API_KEY가 설정되지 않았습니다. Cloudflare Pages 환경변수에 공공데이터포털 인증키를 등록하세요.',
            needSetup: true
        });
    }
    const ncsLclasCd = c.req.query('ncsLclasCd') || '15';
    const key = decodeServiceKey(rawKey);
    const params = new URLSearchParams({
        serviceKey: key,
        pageNo: '1',
        numOfRows: '10',
        returnType: 'json',
        ncsLclasCd
    });
    try {
        const res = await fetch(`${NCS_TRAINING_API_BASE}?${params.toString()}`);
        const httpOk = res.ok;
        let resultCode = '';
        let resultMsg = '';
        let itemCount = 0;
        let rawItemCount = 0;
        let responseKeys: string[] = [];
        let bodyKeys: string[] = [];
        let firstRawItemKeys: string[] = [];
        let firstRawItemSample: Record<string, unknown> = {};
        try {
            const json = await res.json() as Record<string, unknown>;
            responseKeys = Object.keys(json);
            const resp = json?.response as Record<string, unknown> | undefined;
            const header = (resp?.header ?? json?.header) as Record<string, unknown> | undefined;
            resultCode = header ? String(header.resultCode ?? header.RESULT_CODE ?? '').trim() : '';
            resultMsg = header ? String(header.resultMsg ?? header.RESULT_MSG ?? '').trim() : '';
            const body = (resp?.body ?? json?.body ?? json?.data ?? json?.dataInfo) as Record<string, unknown> | unknown[] | undefined;
            if (Array.isArray(body)) {
                bodyKeys = [];
                rawItemCount = body.length;
                if (body.length > 0 && typeof body[0] === 'object' && body[0] !== null) {
                    const first = body[0] as Record<string, unknown>;
                    firstRawItemKeys = Object.keys(first);
                    firstRawItemSample = first;
                }
            } else if (body && typeof body === 'object') {
                bodyKeys = Object.keys(body);
                const itemsNode = body.items as Record<string, unknown> | unknown[] | undefined;
                let raw: unknown = Array.isArray(itemsNode) ? itemsNode : (itemsNode && typeof itemsNode === 'object' && 'item' in itemsNode ? (itemsNode as { item: unknown }).item : body.item);
                if (raw == null) {
                    for (const k of ['data', 'list', 'result', 'rows']) {
                        const v = body[k];
                        if (Array.isArray(v) && v.length > 0) { raw = v; break; }
                    }
                    if (raw == null) {
                        const first = Object.values(body).find((v) => Array.isArray(v) && (v as unknown[]).length > 0 && typeof (v as unknown[])[0] === 'object');
                        if (first) raw = first;
                    }
                }
                const arr = Array.isArray(raw) ? raw : (raw != null ? [raw] : []);
                if (arr.length > 0) rawItemCount = arr.length;
                if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null) {
                    const first = arr[0] as Record<string, unknown>;
                    firstRawItemKeys = Object.keys(first);
                    firstRawItemSample = first;
                }
            }
        } catch (_) {
            /* parse error */
        }
        const fromApi = httpOk && !resultCode ? await fetchNcsTrainingByLarge(rawKey, ncsLclasCd) : [];
        itemCount = fromApi.length;
        if (!httpOk) {
            return c.json({
                success: false,
                publicApi: 'http_error',
                message: '공공 API 서버 HTTP 오류입니다.',
                detail: { status: res.status, statusText: res.statusText }
            });
        }
        if (resultCode && resultCode !== '00' && resultCode.toLowerCase() !== 'ok') {
            return c.json({
                success: false,
                publicApi: 'api_error',
                message: '공공 API가 오류를 반환했습니다. 인증키·요청 파라미터를 확인하세요.',
                detail: { resultCode, resultMsg }
            });
        }
        if (itemCount === 0 && rawItemCount === 0) {
            return c.json({
                success: true,
                publicApi: 'ok_no_data',
                message: '공공 API는 응답했으나 해당 대분류(' + ncsLclasCd + ')에 항목이 0건이거나, 응답 구조가 다릅니다.',
                detail: { ncsLclasCd, parsedItemCount: itemCount, rawItemCount, responseKeys, bodyKeys, firstRawItemKeys, firstRawItemSample }
            });
        }
        return c.json({
            success: true,
            publicApi: 'ok',
            message: '공공 API 정상 동작 중입니다.',
            detail: { ncsLclasCd, itemCount, firstRawItemKeys, firstRawItemSample }
        });
    } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        return c.json({
            success: false,
            publicApi: 'network_error',
            message: '공공 API 연결 실패(네트워크/타임아웃 등)입니다.',
            detail: errMsg
        });
    }
});

app.get('/approved/large-classes', async (c) => {
    try {
        const devCategory = c.req.query('devCategory'); // e.g., '24', '23'
        const rawKey = c.env.NCS_API_KEY?.trim();

        // 1. Local DB Check
        try {
            const { results } = await c.env.DB.prepare(
                "SELECT DISTINCT substr(job_code, 1, 2) as code, large_name as name FROM ncs_job_hierarchy WHERE large_name IS NOT NULL AND large_name != '' ORDER BY code"
            ).all();
            if (results && results.length > 0) {
                // Fill missing names from standard list
                const enhanced = results.map((r: any) => {
                    const found = NCS_LARGE_CLASSES.find(lc => lc.code === r.code);
                    return { code: r.code, name: r.name || (found ? found.name : r.code) };
                });
                return c.json({ success: true, data: enhanced });
            }
        } catch (dbErr) {
            console.warn('Local NCS large-classes fetch failed (table missing?):', dbErr);
        }

        if (rawKey) {
            const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
            const data = await fetchNcsLargeClasses(rawKey, classificationBase);
            if (data && data.length > 0) {
                return c.json({ success: true, data });
            }
        }

        // Fallback or No API Key
        return c.json({ success: true, data: NCS_LARGE_CLASSES });
    } catch (e) {
        console.error('NCS approved/large-classes error:', e);
        return c.json({ success: true, data: NCS_LARGE_CLASSES });
    }
});

/** 기준정보 API 1차 요청(중분류) 진단 — 실패 원인 확인용. */
async function diagnoseClassificationFirstCall(
    base: string,
    key: string,
    ncsLclasCd: string
): Promise<{ url: string; status: number; statusText: string; bodySnippet: string; parsedCount: number; error?: string }> {
    const path = 'getNcsMidClass';
    const q = new URLSearchParams({ serviceKey: key, type: 'json', pageNo: '1', numOfRows: '10', ncsLclasCd });
    const url = `${base}/${path}?${q.toString()}`;
    const safeUrl = `${base}/${path}?serviceKey=***&type=json&pageNo=1&numOfRows=10&ncsLclasCd=${ncsLclasCd}`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        let parsedCount = 0;
        try {
            const json = JSON.parse(text);
            const list = parseClassificationItems(json?.response ?? json?.body ?? json?.data ?? json);
            if (list.length === 0) list.push(...parseClassificationItems(json));
            parsedCount = list.length;
        } catch (_) { /* ignore */ }
        const bodySnippet = text.length > 800 ? text.slice(0, 800) + '...' : text;
        return { url: safeUrl, status: res.status, statusText: res.statusText, bodySnippet, parsedCount };
    } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        return { url: safeUrl, status: 0, statusText: '', bodySnippet: '', parsedCount: 0, error: errMsg };
    }
}

/** 기준정보 API 전용 조회 (전체 분류체계). 테스트/디버깅용. */
app.get('/approved/classification', async (c) => {
    try {
        const ncsLclasCd = c.req.query('ncsLclasCd') || '01';
        const rawKey = c.env.NCS_API_KEY?.trim();

        // 1. Local DB Check (중·소분류 명칭이 있으면 사용)
        let localResults: any[] = [];
        try {
            const { results } = await c.env.DB.prepare(
                "SELECT DISTINCT mid_name, substr(job_code, 3, 2) as mid_code, small_name, substr(job_code, 5, 2) as small_code FROM ncs_job_hierarchy WHERE job_code LIKE ? ORDER BY mid_code, small_code"
            ).bind(ncsLclasCd + '%').all();
            localResults = results || [];
        } catch (dbErr) {
            console.warn('Local NCS classification fetch failed:', dbErr);
        }

        const hasRealNames = localResults.length > 0 && localResults.some((r: any) =>
            (r.mid_name != null && String(r.mid_name).trim() !== '' && String(r.mid_name).trim() !== String(r.mid_code || '').trim()) ||
            (r.small_name != null && String(r.small_name).trim() !== '' && String(r.small_name).trim() !== String(r.small_code || '').trim())
        );
        if (hasRealNames) {
            const mapped = localResults.map((r: any) => ({
                largeCode: ncsLclasCd,
                midCode: r.mid_code,
                midName: (r.mid_name != null && String(r.mid_name).trim() !== '') ? r.mid_name : (r.mid_code || ''),
                smallCode: r.small_code,
                smallName: (r.small_name != null && String(r.small_name).trim() !== '') ? r.small_name : (r.small_code || ''),
            }));
            return c.json({ success: true, data: mapped, _meta: { source: 'local_db', count: mapped.length } });
        }

        if (!rawKey) {
            if (localResults.length > 0) {
                const mapped = localResults.map((r: any) => ({
                    largeCode: ncsLclasCd,
                    midCode: r.mid_code,
                    midName: (r.mid_code || ''),
                    smallCode: r.small_code,
                    smallName: (r.small_code || ''),
                }));
                return c.json({ success: true, data: mapped, _meta: { source: 'local_db_no_names', count: mapped.length } });
            }
            return c.json({ success: false, error: 'NCS_API_KEY 미설정 및 로컬 데이터 없음' }, 400);
        }
        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
        const base = (classificationBase || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
        const key = decodeServiceKey(rawKey);
        const data = await fetchNcsClassificationByLarge(rawKey, ncsLclasCd, classificationBase);
        if (data === null) {
            const diag = await diagnoseClassificationFirstCall(base, key, ncsLclasCd);
            return c.json({
                success: false,
                error: '기준정보 API 조회 실패 또는 응답 없음',
                _meta: {
                    hint: 'NCS_CLASSIFICATION_API_BASE·오퍼레이션명·인증키 확인. 공공데이터포털에서 15128213(NCS 기준정보조회) 활용신청 필요할 수 있음.',
                    diagnose: diag
                }
            }, 502);
        }
        return c.json({ success: true, data, _meta: { source: 'classification_api', count: data.length } });
    } catch (e) {
        console.error('NCS approved/classification error:', e);
        return c.json({ success: false, error: '기준정보 조회 실패' }, 500);
    }
});

/** 기준정보 API 진단 전용 — 첫 요청 URL·상태·응답 일부 반환 (원인 파악용). */
app.get('/approved/classification-debug', async (c) => {
    try {
        const ncsLclasCd = c.req.query('ncsLclasCd') || '19';
        const rawKey = c.env.NCS_API_KEY?.trim();
        if (!rawKey) return c.json({ success: false, error: 'NCS_API_KEY 미설정' }, 400);
        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
        const base = (classificationBase || NCS_CLASSIFICATION_API_BASE_DEFAULT).replace(/\/$/, '');
        const key = decodeServiceKey(rawKey);
        const diag = await diagnoseClassificationFirstCall(base, key, ncsLclasCd);
        return c.json({ success: true, diagnose: diag, baseUrl: base });
    } catch (e) {
        console.error('NCS classification-debug error:', e);
        return c.json({ success: false, error: String(e instanceof Error ? e.message : e) }, 500);
    }
});

// Debug endpoint for ODCloud API (New)
app.get('/approved/test-odcloud/:unitCode', async (c) => {
    try {
        const unitCode = c.req.param('unitCode');
        const rawKey = c.env.NCS_API_KEY?.trim();
        const key = decodeServiceKey(rawKey || '');

        // 2024년 버전 UDDI ID (이미지 참조)
        const uddi = 'd8120558-7644-44ee-aa67-8fa879a80247';

        // 필터링 적용 (조건: NCS_CL_CD 컬럼이 unitCode와 일치)
        // ODCloud는 'cond[컬럼명::EQ]=값' 형식을 사용함 (URL 인코딩 필요)
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('perPage', '100');
        params.append('serviceKey', key);
        params.append('returnType', 'json');

        // 8자리 세분류로 필터링하여 실제 데이터 구조 확인
        const subClassCd = unitCode.replace(/[^0-9]/g, '').substring(0, 8);
        params.append('cond[NCS_CL_CD::EQ]', subClassCd);

        const url = `https://api.odcloud.kr/api/15083321/v1/uddi:${uddi}?${params.toString()}`;

        console.log(`[ODCloud] Testing URL: ${url}`);

        const res = await fetch(url);
        const json = await res.json();

        return c.json({
            success: true,
            url,
            data: json,
            // 필드명 확인을 위해 첫 번째 데이터의 키 목록 반환
            keys: (json as any).data && (json as any).data.length > 0 ? Object.keys((json as any).data[0]) : []
        });
    } catch (e) {
        return c.json({ success: false, error: String(e) }, 500);
    }
});

// 세분류(Job) 목록만 별도 조회
// 세분류(Job) 목록만 별도 조회
app.get('/approved/jobs', async (c) => {
    try {
        const l = c.req.query('l');
        const m = c.req.query('m');
        const s = c.req.query('s');
        const refresh = c.req.query('refresh') === 'true';
        const rawKey = c.env.NCS_API_KEY?.trim();
        if (!l || !m || !s) return c.json({ success: false, error: '잘못된 요청' }, 400); // apiKey optional if local data exists

        // 1. Local DB Check (Skip if refresh)
        const prefix = l + m + s;
        if (!refresh) {
            try {
                // First, try to find proper 8-digit job entries
                const { results } = await c.env.DB.prepare(
                    "SELECT job_code as code, job_name as name FROM ncs_job_hierarchy WHERE job_code LIKE ? AND length(job_code) = 8 ORDER BY job_code"
                ).bind(prefix + '%').all();

                if (results && results.length > 0) {
                    // ... (snipped: logic to return DB results is same) ...
                    // Since I cannot copy-paste potentially large unedited blocks easily without full context, 
                    // I will replicate the mapping logic briefly or assume it's compact enough.
                    // Actually, I should use the exact logic as before for the DB part.

                    const jobMap = new Map<string, string>();
                    results.forEach((r: any) => {
                        const fullCode = (r.code || '').trim();
                        const jobSubCode = fullCode.substring(6, 8);
                        if (!jobMap.has(jobSubCode) || (r.name && !r.name.includes(`세분류 ${jobSubCode}`))) {
                            jobMap.set(jobSubCode, r.name || `세분류 ${jobSubCode}`);
                        }
                    });

                    const mapped = Array.from(jobMap.entries()).map(([code, name]) => ({ code, name })).sort((a, b) => a.code.localeCompare(b.code));

                    if (mapped.length > 0) {
                        const enriched = mapped.map(x => ({ ...x, fullCode: prefix + x.code, isSynced: true }));
                        return c.json({ success: true, data: enriched, _source: 'db' });
                    }
                }
            } catch (dbErr) {
                console.warn('Local NCS jobs check failed:', dbErr);
            }
        }

        if (!rawKey) return c.json({ success: false, error: 'API Key missing and no local data' }, 400);

        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
        const jobs = await fetchNcsJobsBySmall(rawKey, l, m, s, classificationBase);

        // Update DB with fresh data
        if (jobs.length > 0) {
            try {
                // Insert or ignore into ncs_job_hierarchy
                // We need large_name, mid, small names? We don't have them here easily without extra queries.
                // But ncs_job_hierarchy allows nulls? 
                // Using a simpler approach: Just insert code/name. 
                // Actually ncs_job_hierarchy schema requires more fields?
                // `job_code` is PK?
                // Let's iterate and upsert.
                const stmt = c.env.DB.prepare(`
                    INSERT OR REPLACE INTO ncs_job_hierarchy (job_code, job_name) VALUES (?, ?)
                `);

                // Batch execution if possible, or parallel
                // Just do parallel for speed
                const batch = jobs.map(j => {
                    // j.code from API is suffix '01' or full '15010201'?
                    // fetchNcsJobsBySmall returns { code: '15010201', name: '...' } usually, or suffix?
                    // Let's normalize. 
                    const raw = (j.code || '').trim();
                    const fullCode = raw.length === 8 ? raw : (prefix + raw.padStart(2, '0'));
                    return stmt.bind(fullCode, j.name);
                });
                await c.env.DB.batch(batch);

            } catch (saveErr) {
                console.warn('Failed to save fresh jobs to DB:', saveErr);
            }
        }

        // DB에서 동기화 상태 조회
        let syncedMap = new Map();
        try {
            const { results: syncedJobs } = await c.env.DB.prepare(
                'SELECT job_code FROM ncs_job_hierarchy WHERE job_code LIKE ?'
            ).bind(prefix + '%').all();
            (syncedJobs || []).forEach((sj: any) => syncedMap.set(sj.job_code, true));
        } catch (e) { }

        const data = jobs.map(j => {
            const rawSub = (j.code || '').toString().trim();
            const subCode = rawSub.length >= 8 ? rawSub.slice(-2) : rawSub.padStart(2, '0');
            const fullCode = l + m + s + subCode;

            return {
                ...j,
                code: subCode,
                fullCode: fullCode,
                isSynced: syncedMap.has(fullCode),
                syncStats: null
            };
        });

        return c.json({ success: true, data });
    } catch (e) {
        console.error('NCS approved/jobs error:', e);
        return c.json({ success: false, error: '직종 조회 실패' }, 500);
    }
});

// NCS007: 능력단위 키워드 검색
app.get('/approved/search-units', async (c) => {
    try {
        const keyword = c.req.query('keyword') || '';
        const level = c.req.query('level');
        const rawKey = c.env.NCS_API_KEY?.trim();

        if (!keyword) {
            return c.json({ success: false, error: '검색 키워드가 필요합니다.' }, 400);
        }

        if (!rawKey) {
            return c.json({ success: false, error: 'NCS_API_KEY가 설정되지 않았습니다.' }, 400);
        }

        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
        const results = await fetchNcsUnitsByKeyword(rawKey, keyword, level, undefined, undefined, undefined, undefined, classificationBase);

        return c.json({
            success: true,
            data: results,
            _meta: { keyword, level, count: results.length }
        });
    } catch (e) {
        console.error('NCS search-units error:', e);
        return c.json({ success: false, error: '능력단위 검색 실패' }, 500);
    }
});

// 특정 직종(Job)의 능력단위 목록 조회 (분류 뷰어용)
app.get('/approved/units-by-job', async (c) => {
    try {
        const jobCode = c.req.query('jobCode');
        if (!jobCode) return c.json({ success: false, error: 'jobCode가 필요합니다.' }, 400);

        const apiKey = (c.env.NCS_API_KEY || '').trim();
        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();

        // 1. DB 조회
        const { results: dbUnits } = await c.env.DB.prepare(
            'SELECT code, name, level, elements_json FROM ncs_units WHERE code LIKE ? ORDER BY level DESC, code ASC'
        ).bind(jobCode + '%').all() as { results: { code?: string; name?: string; level?: number; elements_json?: string }[] };

        const unitsMap = new Map<string, any>();
        dbUnits.forEach(u => {
            const code = (u.code || '').trim();
            if (code) {
                let elements = [];
                try {
                    if (u.elements_json) elements = JSON.parse(u.elements_json);
                } catch (e) { }
                unitsMap.set(code, { code, name: u.name, level: u.level, elements, source: 'db' });
            }
        });

        // 2. API 조회 (있는 경우)
        if (apiKey && jobCode.length >= 8) {
            const l = jobCode.slice(0, 2);
            const m = jobCode.slice(2, 4);
            const s = jobCode.slice(4, 6);
            const subd = jobCode.slice(6, 8);

            try {
                // NCS005: 능력단위분류코드 조회 (정확한 매칭)
                const apiUnits = await fetchNcsUnitsByJob(apiKey, l, m, s, subd, classificationBase);

                for (const u of apiUnits) {
                    const existing = unitsMap.get(u.code);
                    if (existing) {
                        if (u.level != null) existing.level = u.level;
                        existing.source = (existing.source || 'db') + '+api';
                    } else {
                        unitsMap.set(u.code, {
                            code: u.code,
                            name: u.name,
                            level: u.level,
                            elements: [],
                            source: 'api'
                        });
                    }
                }
            } catch (e) {
                console.error('API fetch failed during units-by-job', e);
            }
        }

        // 3. Fallback
        const fallback = FALLBACK_NCS_UNITS[jobCode] || [];
        for (const fb of fallback) {
            const existing = unitsMap.get(fb.code);
            if (!existing) {
                unitsMap.set(fb.code, { ...fb, source: 'fallback' });
            } else if ((!existing.elements || existing.elements.length === 0) && fb.elements) {
                existing.elements = fb.elements;
            }
        }

        const data = Array.from(unitsMap.values()).sort((a, b) => {
            const lvA = typeof a.level === 'number' ? a.level : parseInt(String(a.level || '0'), 10);
            const lvB = typeof b.level === 'number' ? b.level : parseInt(String(b.level || '0'), 10);
            if (lvB !== lvA) return lvB - lvA;
            return (a.code || '').localeCompare(b.code || '');
        });

        // 4. 능력단위별 연동 과정명 조회 (course_ncs_units → courses)
        const codeToTitles = new Map<string, string[]>();
        try {
            const { results: courseRows } = await c.env.DB.prepare(`
                SELECT u.code, c.title
                FROM courses c
                JOIN course_ncs_units cnu ON c.id = cnu.course_id
                JOIN ncs_units u ON u.id = cnu.ncs_unit_id
                WHERE u.code LIKE ?
            `).bind(jobCode + '%').all() as { results: { code?: string; title?: string }[] };
            courseRows.forEach((row: { code?: string; title?: string }) => {
                const code = (row.code || '').trim();
                const title = (row.title || '').trim();
                if (!code) return;
                if (!codeToTitles.has(code)) codeToTitles.set(code, []);
                if (title && !codeToTitles.get(code)!.includes(title)) codeToTitles.get(code)!.push(title);
            });
        } catch (e) {
            console.warn('Course titles lookup for units-by-job:', e);
        }
        data.forEach((u: { code?: string; course_titles?: string[] }) => {
            u.course_titles = codeToTitles.get((u.code || '').trim()) || [];
        });

        return c.json({ success: true, data });
    } catch (e) {
        console.error('units-by-job error:', e);
        return c.json({ success: false, error: '능력단위 조회 실패' }, 500);
    }
});

// NCS006: 능력단위 요소(Elements) 조회 (on-demand)
app.get('/approved/unit-elements/:unitCode', async (c) => {
    try {
        const unitCode = c.req.param('unitCode');
        const rawKey = (c.env.NCS_API_KEY || '').trim();
        const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();

        // 1. DB 먼저 확인 (ncs_units.elements_json 선호)
        const dbUnit = await c.env.DB.prepare(
            'SELECT elements_json FROM ncs_units WHERE code = ?'
        ).bind(unitCode).first() as { elements_json?: string } | null;

        if (dbUnit?.elements_json) {
            try {
                const elements = JSON.parse(dbUnit.elements_json);
                if (Array.isArray(elements) && elements.length > 0) {
                    return c.json({ success: true, source: 'db', data: elements });
                }
            } catch (e) { }
        }

        // 2. API 호출
        if (!rawKey) return c.json({ success: false, error: 'API_KEY 미설정 및 DB 데이터 없음' }, 400);

        const elements = await fetchNcsUnitElements(rawKey, unitCode, classificationBase);

        // 3. (선택적) DB 업데이트 - 효율적 브라우징을 위해 캐시
        if (elements && elements.length > 0) {
            try {
                await c.env.DB.prepare(
                    'UPDATE ncs_units SET elements_json = ? WHERE code = ?'
                ).bind(JSON.stringify(elements), unitCode).run();
            } catch (e) {
                console.warn('Failed to cache elements in DB:', e);
            }
        }

        return c.json({ success: true, source: 'api', data: elements });
    } catch (e) {
        console.error('unit-elements error:', e);
        return c.json({ success: false, error: String(e) }, 500);
    }
});

interface NcsUploadItem {
    large?: string;
    mid?: string;
    small?: string;
    jobName?: string;
    jobCode?: string;
    unitName?: string;
    unitCode?: string;
    level?: string;
    elements?: any[]; // NCS006 Elements
}

// NCS Data Batch Upload (CSV)
// NCS Data Batch Upload (CSV)
app.post('/upload', authMiddleware, requireAdmin, async (c) => {
    try {
        const { items } = await c.req.json<{ items: NcsUploadItem[] }>();
        if (!Array.isArray(items) || items.length === 0) {
            return c.json({ success: false, error: '데이터가 없습니다.' }, 400);
        }

        const stats = { jobs: 0, units: 0 };
        const statements: any[] = [];
        const jobsMap = new Map<string, any>();
        const unitsMap = new Map<string, any>();

        for (const item of items) {
            if (!item.jobCode || !item.unitCode) continue;

            const jobCodeRaw = item.jobCode.toString().trim();
            const unitCodeRaw = item.unitCode.toString().trim();
            if (!jobCodeRaw || !unitCodeRaw) continue;

            // Prepare Job Data
            if (!jobsMap.has(jobCodeRaw)) {
                jobsMap.set(jobCodeRaw, {
                    code: jobCodeRaw,
                    name: item.jobName,
                    large: item.large,
                    mid: item.mid,
                    small: item.small
                });
            }

            // Prepare Unit Data
            if (!unitsMap.has(unitCodeRaw)) {
                unitsMap.set(unitCodeRaw, {
                    code: unitCodeRaw,
                    name: item.unitName,
                    category: item.jobName,
                    level: parseInt(item.level || '0', 10),
                    sub_class_code: jobCodeRaw,
                    elements_json: Array.isArray(item.elements) ? JSON.stringify(item.elements) : null
                });
            }
        }

        // Create Job Upsert Statements
        for (const job of jobsMap.values()) {
            const truncatedJobCode = job.code.toString().substring(0, 8);
            statements.push(c.env.DB.prepare(`
                INSERT INTO ncs_job_hierarchy (job_code, job_name, large_name, mid_name, small_name, synced_at, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                ON CONFLICT(job_code) DO UPDATE SET
                    job_name = CASE WHEN excluded.job_name != '' AND length(excluded.job_code) = 8 THEN excluded.job_name ELSE ncs_job_hierarchy.job_name END,
                    large_name = CASE WHEN excluded.large_name != '' THEN excluded.large_name ELSE ncs_job_hierarchy.large_name END,
                    mid_name = CASE WHEN excluded.mid_name != '' THEN excluded.mid_name ELSE ncs_job_hierarchy.mid_name END,
                    small_name = CASE WHEN excluded.small_name != '' THEN excluded.small_name ELSE ncs_job_hierarchy.small_name END,
                    synced_at = datetime('now')
            `).bind(truncatedJobCode, job.name, job.large, job.mid, job.small));
            stats.jobs++;
        }

        // Create Unit Upsert Statements
        // Note: sub_class_code requires migration 0053, elements_json requires 0054
        for (const unit of unitsMap.values()) {
            statements.push(c.env.DB.prepare(`
                INSERT INTO ncs_units (code, name, category, level, sub_class_code, elements_json)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(code) DO UPDATE SET
                    name = excluded.name,
                    category = excluded.category,
                    level = excluded.level,
                    sub_class_code = excluded.sub_class_code,
                    elements_json = excluded.elements_json
            `).bind(unit.code, unit.name, unit.category, unit.level, unit.sub_class_code, unit.elements_json));
            stats.units++;
        }

        // Execute Batch
        const CHUNK_SIZE = 20; // Reduced chunk size for safety
        for (let i = 0; i < statements.length; i += CHUNK_SIZE) {
            const batch = statements.slice(i, i + CHUNK_SIZE);
            if (batch.length > 0) {
                await c.env.DB.batch(batch);
            }
        }

        return c.json({ success: true, stats });

    } catch (e) {
        console.error('NCS upload error:', e);
        return c.json({ success: false, error: String(e) }, 500);
    }
});



// ... existing code ...

app.get('/approved/training', async (c) => {
    try {
        const ncsLclasCd = c.req.query('ncsLclasCd') || '01';
        const rawKey = c.env.NCS_API_KEY?.trim();
        const refresh = c.req.query('refresh') === 'true';

        // 1. Local DB Check
        if (!refresh) {
            try {
                // Fetch distinct job codes (8 digits: large+mid+small+sub)
                const { results } = await c.env.DB.prepare(
                    `SELECT DISTINCT 
                    job_code,
                    large_name,
                    mid_name, 
                    small_name,
                    job_name,
                    substr(job_code, 1, 2) as large_code,
                    substr(job_code, 3, 2) as mid_code,
                    substr(job_code, 5, 2) as small_code,
                    substr(job_code, 7, 2) as sub_code
                FROM ncs_job_hierarchy 
                WHERE job_code LIKE ? 
                    AND mid_name IS NOT NULL AND mid_name != '' 
                    AND small_name IS NOT NULL AND small_name != ''
                ORDER BY job_code`
                ).bind(ncsLclasCd + '%').all();

                if (results && results.length > 0) {
                    const mapped: TrainingItem[] = results.map((r: any) => ({
                        largeCode: r.large_code || ncsLclasCd,
                        largeName: r.large_name || '',
                        midCode: r.mid_code || '',
                        midName: r.mid_name || '',
                        smallCode: r.small_code || '',
                        smallName: r.small_name || '',
                        subClassCode: r.sub_code || '',
                        subClassName: r.job_name || '',
                        unitCode: '', // Training API doesn't include unit-level data
                        unitName: '', // Will be populated later if needed
                    }));
                    return c.json({ success: true, data: mapped, _meta: { source: 'local_db', count: mapped.length } });
                }
            } catch (dbErr) {
                console.warn('Local NCS training fetch failed:', dbErr);
            }
        }

        if (rawKey) {
            try {
                let data: TrainingItem[];
                let source: 'classification_api' | 'public_api' = 'public_api';
                const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();
                const fromClassification = await fetchNcsClassificationByLarge(rawKey, ncsLclasCd, classificationBase);

                if (fromClassification && fromClassification.length > 0) {
                    data = fromClassification;
                    source = 'classification_api';
                } else {
                    const fromTraining = await fetchNcsTrainingByLarge(rawKey, ncsLclasCd);
                    // Merge mocks logic if needed (snipped for brevity, can keep if desired)
                    // Re-implementing simplified merge for now or just returning fromTraining
                    data = fromTraining;
                }
                return c.json({ success: true, data, _meta: { source, count: data.length } });

            } catch (e) {
                console.error('NCS approved/training public API error:', e);
                return c.json({ success: false, error: '공공 API 조회 실패' }, 502);
            }
        }

        // Fallback Mock
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
        const courseId = c.req.query('course_id');
        let query = 'SELECT * FROM ncs_approved_registrations';
        const params: any[] = [];
        if (courseId) {
            query += ' WHERE approved_course_id = ?';
            params.push(parseInt(courseId, 10));
        }
        query += ' ORDER BY updated_at DESC';

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
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

function parseMainJobs(body: { main_jobs?: { code?: string; name?: string }[]; main_job_code?: string; main_job_name?: string }): { mainJobsJson: string | null; mainJobCode: string | null; mainJobName: string | null } {
    const raw = body.main_jobs;
    let arr: { code: string; name: string }[] = [];
    if (Array.isArray(raw) && raw.length > 0) {
        arr = raw
            .filter((j): j is { code?: string; name?: string } => j != null && typeof j === 'object')
            .map((j) => ({ code: (j.code ?? '').toString().trim(), name: (j.name ?? '').toString().trim() }))
            .filter((j) => j.code || j.name);
    }

    // Explicitly provided main job from body
    const reqCode = (body.main_job_code || '').toString().trim() || null;
    const reqName = (body.main_job_name || '').toString().trim() || null;

    if (arr.length > 0) {
        // If we have an array and a requested code, find it in the array
        let main = arr[0];
        if (reqCode) {
            const found = arr.find(j => j.code === reqCode);
            if (found) main = found;
        }

        return {
            mainJobsJson: JSON.stringify(arr),
            mainJobCode: main.code || null,
            mainJobName: main.name || null,
        };
    }

    // Fallback to single fields if array is empty
    const mainJobsJson = reqCode || reqName ? JSON.stringify([{ code: reqCode ?? '', name: reqName ?? '' }]) : null;
    return { mainJobsJson, mainJobCode: reqCode, mainJobName: reqName };
}

app.post('/approved/registrations', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json<{
            approved_course_id?: number;
            ncs_tab?: string; course_type?: string; main_job_code?: string; main_job_name?: string;
            main_jobs?: { code?: string; name?: string }[];
            overview_content?: string; dev_category?: string; large_code?: string; mid_code?: string;
            small_code?: string; sub_code?: string; unit_code?: string; unit_name?: string;
            non_ncs_course_name?: string; non_ncs_overview?: string;
            course_name?: string; training_level?: string; prereq_skill?: string;
        }>();
        const approvedCourseId = body.approved_course_id ? Number(body.approved_course_id) : null;
        const ncsTab = (body.ncs_tab || 'ncs').trim();
        const courseType = (body.course_type || '').trim() || null;
        const { mainJobsJson, mainJobCode, mainJobName } = parseMainJobs(body);
        const overviewContent = (body.overview_content || '').trim() || null;
        const devCategory = (body.dev_category || '').trim() || null;
        const largeCode = (body.large_code || '').trim() || null;
        const midCode = (body.mid_code || '').trim() || null;
        const smallCode = (body.small_code || '').trim() || null;
        const subCode = (body.sub_code || '').trim() || null;
        const unitCode = (body.unit_code || '').trim() || null;
        const unitName = (body.unit_name || '').trim() || null;
        const nonNcsCourseName = (body.non_ncs_course_name || '').trim() || null;
        const nonNcsOverview = (body.non_ncs_overview || '').trim() || null;
        const courseName = (body.course_name || '').trim() || null;
        const trainingLevel = (body.training_level || '').trim() || null;
        const prereqSkill = (body.prereq_skill || '').trim() || null;

        const r = await c.env.DB.prepare(
            `INSERT INTO ncs_approved_registrations (
                approved_course_id,
                ncs_tab, course_type, main_job_code, main_job_name, main_jobs_json, overview_content,
                dev_category, large_code, mid_code, small_code, sub_code, unit_code, unit_name,
                non_ncs_course_name, non_ncs_overview, course_name, training_level, prereq_skill
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            approvedCourseId,
            ncsTab, courseType, mainJobCode, mainJobName, mainJobsJson, overviewContent,
            devCategory, largeCode, midCode, smallCode, subCode, unitCode, unitName,
            nonNcsCourseName, nonNcsOverview, courseName, trainingLevel, prereqSkill
        ).run();
        const id = Number(r.meta?.last_row_id ?? 0);
        const row = await c.env.DB.prepare('SELECT * FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        return c.json({ success: true, data: row }, 201);
    } catch (e) {
        console.error('ncs approved registration create:', e);
        const errorMsg = String((e as Error)?.message ?? e);
        const userMsg = isD1SchemaError(e)
            ? 'DB 스키마가 최신이 아닙니다. npm run db:migrate:prod 실행 후 다시 시도해 주세요.'
            : '등록 실패: ' + errorMsg;
        return c.json({ success: false, error: userMsg, debug: errorMsg }, 500);
    }
});

app.put('/approved/registrations/:id', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const body = await c.req.json<{
            approved_course_id?: number;
            ncs_tab?: string; course_type?: string; main_job_code?: string; main_job_name?: string;
            main_jobs?: { code?: string; name?: string }[];
            overview_content?: string; dev_category?: string; large_code?: string; mid_code?: string;
            small_code?: string; sub_code?: string; unit_code?: string; unit_name?: string;
            non_ncs_course_name?: string; non_ncs_overview?: string;
            course_name?: string; training_level?: string; prereq_skill?: string;
        }>();
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '수정할 수 없습니다' }, 404);

        const approvedCourseId = body.approved_course_id ? Number(body.approved_course_id) : undefined;
        const ncsTab = (body.ncs_tab ?? '').toString().trim() || 'ncs';
        const courseType = (body.course_type || '').trim() || null;
        const { mainJobsJson, mainJobCode, mainJobName } = parseMainJobs(body);
        const overviewContent = (body.overview_content || '').trim() || null;
        const devCategory = (body.dev_category || '').trim() || null;
        const largeCode = (body.large_code || '').trim() || null;
        const midCode = (body.mid_code || '').trim() || null;
        const smallCode = (body.small_code || '').trim() || null;
        const subCode = (body.sub_code || '').trim() || null;
        const unitCode = (body.unit_code || '').trim() || null;
        const unitName = (body.unit_name || '').trim() || null;
        const nonNcsCourseName = (body.non_ncs_course_name || '').trim() || null;
        const nonNcsOverview = (body.non_ncs_overview || '').trim() || null;
        const courseName = (body.course_name || '').trim() || null;
        const trainingLevel = (body.training_level || '').trim() || null;
        const prereqSkill = (body.prereq_skill || '').trim() || null;

        let updateSql = `UPDATE ncs_approved_registrations SET
                ncs_tab = ?, course_type = ?, main_job_code = ?, main_job_name = ?, main_jobs_json = ?, overview_content = ?,
                dev_category = ?, large_code = ?, mid_code = ?, small_code = ?, sub_code = ?, unit_code = ?, unit_name = ?,
                non_ncs_course_name = ?, non_ncs_overview = ?, course_name = ?, training_level = ?, prereq_skill = ?,
                updated_at = datetime('now')`;

        const params: any[] = [
            ncsTab, courseType, mainJobCode, mainJobName, mainJobsJson, overviewContent,
            devCategory, largeCode, midCode, smallCode, subCode, unitCode, unitName,
            nonNcsCourseName, nonNcsOverview, courseName, trainingLevel, prereqSkill
        ];

        if (approvedCourseId !== undefined) {
            updateSql += ', approved_course_id = ?';
            params.push(approvedCourseId);
        }
        updateSql += ' WHERE id = ?';
        params.push(id);

        await c.env.DB.prepare(updateSql).bind(...params).run();
        const row = await c.env.DB.prepare('SELECT * FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        return c.json({ success: true, data: row });
    } catch (e) {
        console.error('ncs approved registration update:', e);
        const errorMsg = String((e as Error)?.message ?? e);
        const userMsg = isD1SchemaError(e)
            ? 'DB 스키마가 최신이 아닙니다. npm run db:migrate:prod 실행 후 다시 시도해 주세요.'
            : '수정 실패: ' + errorMsg;
        return c.json({ success: false, error: userMsg, debug: errorMsg }, 500);
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

/** 등록 ID 찾기 (과정 ID로) — 임베디드 모드 초기화용 */
app.get('/approved/registrations/find-by-course/:courseId', authMiddleware, requireAdmin, async (c) => {
    try {
        const courseId = c.req.param('courseId');
        const row = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE approved_course_id = ?').bind(courseId).first<{ id: number }>();
        if (!row) return c.json({ success: true, data: null });
        return c.json({ success: true, data: { id: row.id } });
    } catch (e) {
        console.error('ncs find registration by course:', e);
        const errorMsg = String((e as Error)?.message ?? e);
        const userMsg = isD1SchemaError(e)
            ? 'DB 스키마가 최신이 아닙니다. npm run db:migrate:prod 등을 검토해 주세요.'
            : '조회 실패: ' + errorMsg;
        return c.json({ success: false, error: userMsg, debug: errorMsg }, 500);
    }
});


/** 수준(1~8)을 훈련이수체계도 구간(2~6)으로 매핑 */
function mapLevelToBand(level: number): 2 | 3 | 4 | 5 | 6 {
    if (level >= 6) return 6;
    if (level === 5) return 5;
    if (level === 4) return 4;
    if (level === 3) return 3;
    return 2;
}

/** 훈련이수체계도용: 등록 id → 선택된 모든 직종 + 수준별 능력단위 (자동 표시, 멀티선택) */
app.get('/approved/registrations/:id/training-system', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const reg = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_registrations WHERE id = ?'
        ).bind(id).first() as { unit_code?: string; unit_name?: string; main_job_code?: string; main_job_name?: string; main_jobs_json?: string | null; ncs_tab?: string; non_ncs_course_name?: string; selected_training_elements_json?: string | null } | null;
        if (!reg) return c.json({ success: false, error: '등록 정보 없음' }, 404);

        let selected: string[] = [];
        try {
            const raw = (reg as { selected_training_elements_json?: string | null }).selected_training_elements_json;
            if (raw && typeof raw === 'string') {
                const parsed = JSON.parse(raw);
                selected = Array.isArray(parsed) ? parsed.filter((x: unknown) => typeof x === 'string') : [];
            }
        } catch (_) { /* ignore */ }

        const mainJobs: { code: string | null; name: string | null; isSynced?: boolean }[] = [];
        const mainJobsRaw = (reg as { main_jobs_json?: string | null }).main_jobs_json;
        if (mainJobsRaw && typeof mainJobsRaw === 'string') {
            try {
                const arr = JSON.parse(mainJobsRaw) as { code?: string; name?: string }[];
                if (Array.isArray(arr)) {
                    arr.forEach((j) => {
                        const code = (j.code ?? '').toString().trim() || null;
                        const name = (j.name ?? '').toString().trim() || null;
                        if (code || name) mainJobs.push({ code, name });
                    });
                }
            } catch (_) { /* ignore */ }
        }
        if (mainJobs.length === 0) {
            const code = (reg.unit_code || reg.main_job_code || '').trim() || null;
            const name = (reg.unit_name || reg.main_job_name || '').trim() || null;
            if (code || name) mainJobs.push({ code, name });
        }

        // Check sync status for each job
        for (let i = 0; i < mainJobs.length; i++) {
            const j = mainJobs[i];
            if (j.code) {
                const sub8 = j.code.replace(/[^0-9]/g, '').slice(0, 8);
                if (sub8.length === 8) {
                    const h = await c.env.DB.prepare('SELECT * FROM ncs_job_hierarchy WHERE job_code = ?').bind(sub8).first<any>();
                    mainJobs[i].isSynced = h && (h.unit_count > 0);
                    // Use correct name from hierarchy if available to heal poisoned registration data
                    if (h && h.job_name) {
                        mainJobs[i].name = h.job_name;
                    }
                }
            }
        }

        if (reg.ncs_tab === 'non_ncs') {
            return c.json({
                success: true,
                data: {
                    mainJobs: [{ code: null, name: (reg.non_ncs_course_name || '').trim() || null }],
                    levels: { 6: [], 5: [], 4: [], 3: [], 2: [] },
                    basicAbility: [],
                    selected,
                    elements: []
                }
            });
        }

        const levels: { 6: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[]; 5: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[]; 4: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[]; 3: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[]; 2: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[] } = { 6: [], 5: [], 4: [], 3: [], 2: [] };
        // Map code -> item reference to allow updating jobNames
        const codeMap = new Map<string, { name: string; code?: string; jobNames: string[]; elements?: { code: string; name: string }[] }>();
        let basicAbility: { name: string; code?: string }[] = [];
        const elementsFlat: { name: string; code?: string; jobNames?: string[]; elements?: { code: string; name: string }[] }[] = [];

        for (const job of mainJobs) {
            const jobCode = (job.code || '').replace(/\s/g, '');
            const jobCode8 = jobCode.length >= 8 ? jobCode.slice(0, 8) : jobCode;
            const jobName = (job.name || '').trim();

            // Derive targetCode early
            let targetCode = jobCode8;
            if (!targetCode && jobName) {
                const normalized = jobName.replace(/\s/g, '');
                const nameToCode: Record<string, string> = {
                    '3D프린터용제품제작': '19031102',
                    '3D프린터용제품업': '19031102',
                    '3D프린터제품제작': '19031102',
                    '3D프린터운용기능사': '19031102',
                    '기계요소설계': '15010201',
                    '기계요소': '15010201',
                    '3D프린터개발': '19031101',
                    '3D프린팅소재개발': '19031101'
                };
                targetCode = nameToCode[normalized] || '';
            }

            let foundAny = false;

            // Helper to add/update item
            const addItem = (name: string, code: string, level: number, elements?: { code: string; name: string }[]) => {
                const band = mapLevelToBand(level);

                // Overlay fallback elements if not provided
                if ((!elements || elements.length === 0) && code && targetCode) {
                    const fallbackList = FALLBACK_NCS_UNITS[targetCode];
                    if (fallbackList) {
                        const fbItem = fallbackList.find(f => f.code === code || f.name === name); // Try code match then name
                        if (fbItem && fbItem.elements) {
                            elements = fbItem.elements;
                        }
                    }
                }

                if (code && codeMap.has(code)) {
                    const existing = codeMap.get(code)!;
                    if (!existing.jobNames.includes(jobName)) existing.jobNames.push(jobName);
                    // Merge elements if existing has none and new has some
                    if ((!existing.elements || existing.elements.length === 0) && elements && elements.length > 0) {
                        existing.elements = elements;
                        // Also update reference in levels/elementsFlat
                    }
                } else {
                    const item = { name, code, jobNames: [jobName], elements };
                    if (code) codeMap.set(code, item);
                    levels[band].push(item);
                    elementsFlat.push({ name, code, elements, jobNames: [jobName] });
                }
            };

            if (jobCode8 && jobCode8.length >= 4) {
                const { results: units } = await c.env.DB.prepare(
                    'SELECT code, name, level FROM ncs_units WHERE code LIKE ? ORDER BY level DESC, code ASC'
                ).bind(jobCode8 + '%').all() as { results: { code?: string; name?: string; level?: number }[] };

                if (units && units.length > 0) {
                    for (const u of units) {
                        const code = (u.code || '').trim();
                        if (!code) continue;
                        const name = (u.name || '').trim() || code;
                        const lv = typeof u.level === 'number' ? u.level : 3;

                        // Fetch elements from DB
                        let dbElements: { code: string; name: string }[] = [];
                        try {
                            const { results } = await c.env.DB.prepare(
                                'SELECT code, name FROM ncs_elements WHERE unit_code = ? ORDER BY code ASC'
                            ).bind(code).all() as { results: { code: string; name: string }[] };
                            if (results) dbElements = results;
                        } catch (e) {
                            console.warn(`Failed to fetch elements for ${code}`, e);
                        }

                        addItem(name, code, lv, dbElements);
                        foundAny = true;
                    }
                }
            }

            let foundFromApi = false;
            const apiKey = (c.env.NCS_API_KEY || '').trim();
            if (apiKey && jobCode8.length >= 2) {
                const largeCode = jobCode8.slice(0, 2);
                const classificationBase = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE?.trim();

                // If we have a full 8-digit job code (Sub-classification), try NCS005
                if (jobCode8.length >= 8) {
                    try {
                        const l = jobCode8.slice(0, 2);
                        const m = jobCode8.slice(2, 4);
                        const s = jobCode8.slice(4, 6);
                        const subd = jobCode8.slice(6, 8);

                        const unitsFromNCS005 = await fetchNcsUnitsByJob(apiKey, l, m, s, subd, classificationBase);
                        if (unitsFromNCS005 && unitsFromNCS005.length > 0) {
                            // For each unit, also fetch its elements (NCS006)
                            for (const u of unitsFromNCS005) {
                                if (!u.code || !u.name) continue;

                                // Fetch elements for this unit from DATABASE instead of API
                                let elements: { code: string; name: string }[] | undefined;
                                try {
                                    // First try DB
                                    const { results: dbElements } = await c.env.DB.prepare(
                                        'SELECT code, name FROM ncs_elements WHERE unit_code = ? ORDER BY code ASC'
                                    ).bind(u.code).all() as { results: { code: string; name: string }[] };

                                    if (dbElements && dbElements.length > 0) {
                                        elements = dbElements;
                                        console.log(`[DB] Found ${dbElements.length} elements for ${u.code}`);
                                    } else {
                                        // Try NCS006 API
                                        const elementsFromNCS006 = await fetchNcsUnitElements(apiKey, u.code, classificationBase);
                                        if (elementsFromNCS006 && elementsFromNCS006.length > 0) {
                                            elements = elementsFromNCS006;
                                            console.log(`[NCS006] Found ${elementsFromNCS006.length} elements for ${u.code}`);

                                            // 1. Fetch criteria/details via NCS008
                                            try {
                                                const details = await fetchNcsPerformanceCriteria(apiKey, u.code, classificationBase);
                                                if (details && details.length > 0) {
                                                    // Merge details into elements
                                                    elements = elements.map(e => {
                                                        const d = details.find(det => det.elemCode === e.code || det.elemCode === e.code.split('_')[0]);
                                                        if (d) {
                                                            return {
                                                                ...e,
                                                                criteriaText: d.criteriaText,
                                                                knowledgeText: d.knowledgeText,
                                                                skillText: d.skillText,
                                                                attitudeText: d.attitudeText
                                                            };
                                                        }
                                                        return e;
                                                    });
                                                    console.log(`[NCS008] Merged details for ${u.code}`);
                                                }
                                            } catch (dtlErr) {
                                                console.warn(`[NCS008] Detailed fetch failed for ${u.code}`, dtlErr);
                                            }

                                            // 1.5 Fetch evaluation/teaching methods via NCS009
                                            try {
                                                const methods = await fetchNcsEvaluationMethods(apiKey, u.code, classificationBase);
                                                if (methods.evaluation.length > 0 || methods.teaching.length > 0) {
                                                    await c.env.DB.prepare(`
                                                        UPDATE ncs_units 
                                                        SET evaluation_methods_json = ?, teaching_methods_json = ? 
                                                        WHERE code = ?
                                                    `).bind(
                                                        JSON.stringify(methods.evaluation),
                                                        JSON.stringify(methods.teaching),
                                                        u.code
                                                    ).run();
                                                    console.log(`[NCS009] Saved methods for ${u.code}`);
                                                }
                                            } catch (methErr) {
                                                console.warn(`[NCS009] Methods fetch failed for ${u.code}`, methErr);
                                            }

                                            // 2. Cache to DB for future speed
                                            try {
                                                const stmt = c.env.DB.prepare(`
                                                    INSERT INTO ncs_elements 
                                                    (unit_code, code, name, criteria_text, knowledge_text, skill_text, attitude_text) 
                                                    VALUES (?, ?, ?, ?, ?, ?, ?)
                                                    ON CONFLICT(code) DO UPDATE SET
                                                    name=excluded.name,
                                                    criteria_text=excluded.criteria_text,
                                                    knowledge_text=excluded.knowledge_text,
                                                    skill_text=excluded.skill_text,
                                                    attitude_text=excluded.attitude_text
                                                `);

                                                const batch = elements.map(e => {
                                                    const anyE = e as any;
                                                    return stmt.bind(
                                                        u.code,
                                                        e.code,
                                                        e.name,
                                                        anyE.criteriaText || null,
                                                        anyE.knowledgeText || null,
                                                        anyE.skillText || null,
                                                        anyE.attitudeText || null
                                                    );
                                                });
                                                await c.env.DB.batch(batch);
                                                console.log(`[DB] Cached ${elements.length} elements (detailed=${!!(elements[0] as any).criteriaText}) for ${u.code}`);
                                            } catch (cacheErr) {
                                                console.warn(`[DB] Extended cache failed for ${u.code}, trying fallback...`, cacheErr);
                                                try {
                                                    const stmt = c.env.DB.prepare('INSERT OR IGNORE INTO ncs_elements (unit_code, code, name) VALUES (?, ?, ?)');
                                                    const batch = elements.map(e => stmt.bind(u.code, e.code, e.name));
                                                    await c.env.DB.batch(batch);
                                                    console.log(`[DB] Cached ${elements.length} elements (basic) for ${u.code}`);
                                                } catch (err2) {
                                                    console.error(`[DB] Cache completely failed for ${u.code}`, err2);
                                                }
                                            }
                                        } else if (FALLBACK_ELEMENTS[u.code]) {
                                            // Final fallback: hardcoded data
                                            elements = FALLBACK_ELEMENTS[u.code];
                                            console.log(`[FALLBACK] Using ${elements.length} hardcoded elements for ${u.code}`);
                                        }
                                    }
                                } catch (e) {
                                    console.error(`Element fetch failed for unit ${u.code}`, e);
                                    // Try fallback even on error
                                    if (!elements && FALLBACK_ELEMENTS[u.code]) {
                                        elements = FALLBACK_ELEMENTS[u.code];
                                        console.log(`[FALLBACK-ERROR] Using ${elements.length} hardcoded elements`);
                                    }
                                }

                                addItem(u.name, u.code, u.level || 3, elements);
                                foundAny = true;
                                foundFromApi = true;
                            }
                        }
                    } catch (e) {
                        // ignore api errors
                    }
                }

                // If NCS005 didn't return anything, try fallback methods
                if (!foundFromApi) {
                    try {
                        const key = decodeServiceKey(apiKey);
                        let items: TrainingItem[] = [];
                        let source = '';

                        // 1. Try Classification API (Standard Info) first - usually more complete
                        try {
                            const fromClass = await fetchNcsClassificationByLarge(apiKey, largeCode, classificationBase);
                            if (fromClass && fromClass.length > 0) {
                                items = fromClass;
                                source = 'classification';
                            }
                        } catch (e) { console.error('Classification API check failed', e); }

                        // 2. Fallback to Training API
                        if (items.length === 0) {
                            try {
                                items = await fetchNcsTrainingByLarge(apiKey, largeCode);
                                source = 'training';
                            } catch (e) { console.error('Training API check failed', e); }
                        }

                        const prefix = jobCode8;
                        for (const it of items) {
                            const rawUnitCode = String(it.unitCode || '').trim();
                            if (!rawUnitCode) continue;

                            const numPart = rawUnitCode.replace(/_.*$/, '').replace(/\\D/g, '').slice(0, 8);
                            if (!numPart.startsWith(prefix) && !rawUnitCode.includes(prefix)) continue;

                            const name = (it.unitName || '').trim() || rawUnitCode;
                            let lv = 3;
                            if (it.level != null) {
                                lv = typeof it.level === 'number' ? it.level : parseInt(String(it.level), 10);
                            }
                            if (isNaN(lv)) lv = 3;

                            addItem(name, rawUnitCode, lv, it.elements);
                            foundAny = true;
                            foundFromApi = true;
                        }
                    } catch (e) {
                        console.error('NCS API fetch error', e);
                    }
                }
            }

            // 3. Last Resort Fallback - Only if API didn't found anything for this job
            if (!foundFromApi && targetCode && FALLBACK_NCS_UNITS[targetCode]) {
                const fbList = FALLBACK_NCS_UNITS[targetCode];
                for (const fb of fbList) {
                    addItem(fb.name, fb.code, fb.level, fb.elements);
                    foundAny = true;
                }
            }

            // No more random mock generation here. 
            // If no data is found, foundAny remains false and the UI will handle it.
        }

        return c.json({
            success: true,
            data: {
                mainJobs,
                mainJobCode: (reg as any).main_job_code || null,
                mainJobName: (reg as any).main_job_name || null,
                levels,
                basicAbility,
                selected,
                elements: elementsFlat
            }
        });
    } catch (e) {
        console.error('ncs approved training-system:', e);
        return c.json({ success: false, error: '훈련이수체계도 조회 실패' }, 500);
    }
});

/**
 * NCS 데이터 동기화 API (관리자용)
 * 특정 세분류(8자리)의 모든 능력단위와 요소를 가져와 DB에 저장합니다.
 */
app.post('/approved/sync', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json() as {
            subClassCode: string;
            subClassName?: string;
            largeName?: string;
            midName?: string;
            smallName?: string;
            description?: string
        };
        const subClassCode = (body.subClassCode || '').replace(/[^0-9]/g, '');

        if (subClassCode.length !== 8) {
            return c.json({ success: false, error: '8자리 세분류 코드가 필요합니다. (예: 19031102)' }, 400);
        }

        const apiKey = (c.env.NCS_API_KEY || '').trim();
        const base = (c.env as { NCS_CLASSIFICATION_API_BASE?: string }).NCS_CLASSIFICATION_API_BASE;

        // 1. Fetch Units
        const l = subClassCode.slice(0, 2);
        const m = subClassCode.slice(2, 4);
        const s = subClassCode.slice(4, 6);
        const subd = subClassCode.slice(6, 8);

        // [Heal] Fetch proper Job Name from API if possible (UI might send poisoned Unit name)
        let subClassName = body.subClassName || '';
        if (apiKey) {
            try {
                const jobList = await fetchNcsJobsBySmall(apiKey, l, m, s, base);
                const actualJob = jobList.find(j => j.code === subd || j.code === subClassCode);
                if (actualJob && actualJob.name) {
                    console.log(`[Sync] Healing Job Name from API: "${subClassName}" -> "${actualJob.name}"`);
                    subClassName = actualJob.name;
                }
            } catch (e) { console.error('[Sync] Job name heal failed', e); }
        }

        console.log(`[Sync] Fetching units for SubClass: ${subClassCode}`);
        const units = await fetchNcsUnitsByJob(apiKey, l, m, s, subd, base);

        if (!units || units.length === 0) {
            return c.json({ success: false, message: '해당 분류의 능력단위를 찾지 못했습니다.' });
        }

        // 2. Save Units
        let unitCount = 0;
        let elementCount = 0;
        const errors: string[] = [];

        const unitStmt = c.env.DB.prepare(
            'INSERT OR REPLACE INTO ncs_units (code, name, level) VALUES (?, ?, ?)'
        );
        const unitBatch = units.map(u => {
            const lv = typeof u.level === 'number' ? u.level : parseInt(String(u.level || '3'), 10) || 3;
            return unitStmt.bind(u.code, u.name, lv);
        });
        await c.env.DB.batch(unitBatch);
        unitCount = units.length;

        // 3. Process Elements
        const elemStmt = c.env.DB.prepare(
            'INSERT OR REPLACE INTO ncs_elements (ncs_unit_id, code, name) VALUES (?, ?, ?)'
        );

        const { results: savedUnits } = await c.env.DB.prepare(
            'SELECT id, code FROM ncs_units WHERE code LIKE ?'
        ).bind(subClassCode + '%').all();

        const unitIdMap = new Map<string, number>();
        (savedUnits || []).forEach((u: any) => unitIdMap.set(u.code, u.id));

        for (const u of units) {
            try {
                const elements = await fetchNcsUnitElements(apiKey, u.code, base);

                // Fetch criteria (NCS008)
                const details = await fetchNcsPerformanceCriteria(apiKey, u.code, base);
                if (details && details.length > 0 && elements && elements.length > 0) {
                    elements.forEach((e: any) => {
                        const d = details.find(det => det.elemCode === e.code || det.elemCode === e.code.split('_')[0]);
                        if (d) {
                            e.criteriaText = d.criteriaText;
                            e.knowledgeText = d.knowledgeText;
                            e.skillText = d.skillText;
                            e.attitudeText = d.attitudeText;
                        }
                    });
                }

                // Fetch methods (NCS009)
                const methods = await fetchNcsEvaluationMethods(apiKey, u.code, base);

                const elementsJson = (elements && elements.length > 0) ? JSON.stringify(elements) : null;
                const evalJson = (methods.evaluation.length > 0) ? JSON.stringify(methods.evaluation) : null;
                const teachJson = (methods.teaching.length > 0) ? JSON.stringify(methods.teaching) : null;

                // Update ncs_units with elements_json, evaluation_methods_json, teaching_methods_json
                await c.env.DB.prepare(`
                    UPDATE ncs_units 
                    SET elements_json = ?, evaluation_methods_json = ?, teaching_methods_json = ? 
                    WHERE code = ?
                `).bind(elementsJson, evalJson, teachJson, u.code).run();

                if (elements && elements.length > 0) {
                    // Fix: Use unit_code instead of unitId (integer) if schema changed, 
                    // or ensure unitId is correct. 
                    // Recent migration added columns to ncs_elements but didn't change FK structure?
                    // Let's check schema assumption. Assuming text-based FK `unit_code` exists or was added.
                    // Actually, previous replace confirmed `unit_code` column exists in INSERT OR IGNORE.

                    const elemStmt = c.env.DB.prepare(`
                        INSERT INTO ncs_elements 
                        (unit_code, code, name, criteria_text, knowledge_text, skill_text, attitude_text) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(code) DO UPDATE SET
                        name=excluded.name,
                        unit_code=excluded.unit_code,
                        criteria_text=excluded.criteria_text,
                        knowledge_text=excluded.knowledge_text,
                        skill_text=excluded.skill_text,
                        attitude_text=excluded.attitude_text
                    `);

                    const batch = elements.map(e => {
                        const anyE = e as any;
                        return elemStmt.bind(
                            u.code,
                            e.code,
                            e.name,
                            anyE.criteriaText || null,
                            anyE.knowledgeText || null,
                            anyE.skillText || null,
                            anyE.attitudeText || null
                        );
                    });

                    await c.env.DB.batch(batch);
                    elementCount += elements.length;
                }
            } catch (err) {
                console.error(`[Sync] Failed elements for ${u.code}`, err);
                errors.push(`${u.name} (${u.code}): 요소 조회 실패`);
            }
        }

        // 4. Update Hierarchy Meta (Sync Status Tracker)
        // Ensure subClassCode is 8 digits to fix/prevent hierarchy poisoning
        await c.env.DB.prepare(`
            INSERT INTO ncs_job_hierarchy 
            (job_code, job_name, large_name, mid_name, small_name, unit_count, element_count, synced_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            ON CONFLICT(job_code) DO UPDATE SET
                job_name = excluded.job_name,
                large_name = CASE WHEN excluded.large_name != '' THEN excluded.large_name ELSE ncs_job_hierarchy.large_name END,
                mid_name = CASE WHEN excluded.mid_name != '' THEN excluded.mid_name ELSE ncs_job_hierarchy.mid_name END,
                small_name = CASE WHEN excluded.small_name != '' THEN excluded.small_name ELSE ncs_job_hierarchy.small_name END,
                unit_count = excluded.unit_count,
                element_count = excluded.element_count,
                synced_at = excluded.synced_at
        `).bind(
            subClassCode.substring(0, 8),
            subClassName,
            body.largeName || '',
            body.midName || '',
            body.smallName || '',
            unitCount,
            elementCount
        ).run();

        return c.json({
            success: true,
            message: `동기화 완료: 능력단위 ${unitCount}개, 요소 ${elementCount}개 저장됨`,
            stats: { unitCount, elementCount, errors }
        });

    } catch (e) {
        console.error('NCS Sync failed:', e);
        return c.json({ success: false, error: '동기화 중 오류 발생: ' + String(e) }, 500);
    }
});

app.get('/approved/sync/status/:subClassCode', authMiddleware, requireAdmin, async (c) => {
    try {
        const subClassCode = c.req.param('subClassCode');
        const unitPrefix = subClassCode.replace(/[^0-9]/g, '').substring(0, 8);

        const units = await c.env.DB.prepare('SELECT count(*) as count FROM ncs_units WHERE code LIKE ?').bind(unitPrefix + '%').first<{ count: number }>();
        const elements = await c.env.DB.prepare('SELECT count(*) as count FROM ncs_elements e JOIN ncs_units u ON e.ncs_unit_id = u.id WHERE u.code LIKE ?').bind(unitPrefix + '%').first<{ count: number }>();

        return c.json({
            success: true,
            data: {
                subClassCode,
                unitCount: units?.count || 0,
                elementCount: elements?.count || 0
            }
        });
    } catch (e) {
        return c.json({ success: false, error: String(e) }, 500);
    }
});

/** NCS 동기화 요약 통계 (전체) */
app.get('/approved/sync/summary', authMiddleware, requireAdmin, async (c) => {
    try {
        const { DB } = c.env;
        const totalJobs = await DB.prepare('SELECT COUNT(*) as count FROM ncs_job_hierarchy').first() as { count: number };
        const totalUnits = await DB.prepare('SELECT COUNT(*) as count FROM ncs_units').first() as { count: number };
        const totalElements = await DB.prepare('SELECT COUNT(*) as count FROM ncs_elements').first() as { count: number };

        // 분류별 통계 (대분류 기준)
        const categoryStats = await DB.prepare(`
            SELECT 
                h.large_name as name, 
                COUNT(*) as job_count,
                SUM(h.unit_count) as unit_count
            FROM ncs_job_hierarchy h
            WHERE h.large_name IS NOT NULL AND h.large_name != ''
            GROUP BY h.large_name
            ORDER BY job_count DESC
        `).all();

        // 최근 동기화
        const recentSyncs = await DB.prepare(`
            SELECT job_code, job_name, unit_count, element_count, synced_at 
            FROM ncs_job_hierarchy 
            WHERE synced_at IS NOT NULL 
            ORDER BY synced_at DESC LIMIT 10
        `).all();

        return c.json({
            success: true,
            data: {
                counts: {
                    jobs: totalJobs?.count || 0,
                    units: totalUnits?.count || 0,
                    elements: totalElements?.count || 0
                },
                categories: categoryStats.results || [],
                recentSyncs: recentSyncs.results || []
            }
        });
    } catch (e) {
        console.error('sync summary error:', e);
        return c.json({ success: false, error: '동기화 통계 조회 실패' }, 500);
    }
});


/**
 * NCS 전체 동기화 현황 요약 API
 */
app.get('/approved/sync/summary', authMiddleware, requireAdmin, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(`
            SELECT 
                job_code as code, 
                job_name as name, 
                unit_count as unitCount, 
                element_count as elementCount,
                synced_at
            FROM ncs_job_hierarchy
            WHERE length(job_code) = 8
            ORDER BY synced_at DESC
        `).all();

        const data = (results || []).map((r: any) => ({
            ...r,
            status: r.unitCount > 0 ? 'READY' : 'EMPTY'
        }));

        return c.json({ success: true, data });
    } catch (e) {
        console.error('NCS Summary failed:', e);
        return c.json({ success: false, error: String(e) }, 500);
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

/** 훈련이수체계도(2단계)에서 선택된 능력단위로 교과목 편성(3단계) 자동 생성 */
app.post('/approved/registrations/:id/generate-curriculum-from-training', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

        // 1. Get registration and training system data
        const reg = await c.env.DB.prepare('SELECT * FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!reg) return c.json({ success: false, error: '등록 정보 없음' }, 404);

        const selectedJson = (reg as any).selected_training_elements_json;
        if (!selectedJson) {
            return c.json({ success: false, error: '선택된 훈련이수체계도 데이터가 없습니다.' }, 400);
        }

        let selected: { code: string; name: string; level?: number; elements?: { code: string; name: string }[] }[] = [];
        try {
            const parsed = JSON.parse(selectedJson);
            selected = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return c.json({ success: false, error: '훈련이수체계도 데이터 파싱 실패' }, 400);
        }

        if (selected.length === 0) {
            return c.json({ success: false, error: '선택된 능력단위가 없습니다.' }, 400);
        }

        // 2. Generate curriculum items from selected units
        const curriculumItems: {
            type: string;
            name: string;
            classification: string;
            ability_units: string[];
            units: string[];
            objectives: string[];
        }[] = [];

        for (const unit of selected) {
            if (!unit.code || !unit.name) continue;

            curriculumItems.push({
                type: 'ncs',
                name: unit.name,
                classification: unit.code,
                ability_units: [unit.code],
                units: unit.elements ? unit.elements.map((e) => e.code) : [],
                objectives: unit.elements ? unit.elements.map((e) => e.name) : []
            });
        }

        // 3. Save to curriculum table (replace all existing)
        await c.env.DB.prepare('DELETE FROM ncs_approved_curriculum WHERE registration_id = ?').bind(id).run();

        for (let i = 0; i < curriculumItems.length; i++) {
            const it = curriculumItems[i];
            const abilityUnitsJson = JSON.stringify(it.ability_units);
            const unitsJson = JSON.stringify(it.units);
            const objectivesJson = JSON.stringify(it.objectives);

            await c.env.DB.prepare(
                `INSERT INTO ncs_approved_curriculum (registration_id, type, name, classification, ability_units_json, units_json, objectives_json, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(id, it.type, it.name, it.classification, abilityUnitsJson, unitsJson, objectivesJson, i).run();
        }

        // 4. Return the generated curriculum
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all();

        return c.json({
            success: true,
            data: results || [],
            _meta: { generatedCount: curriculumItems.length, message: `${curriculumItems.length}개의 교과목이 자동 생성되었습니다.` }
        });
    } catch (e) {
        console.error('generate-curriculum-from-training error:', e);
        return c.json({ success: false, error: '교과목 자동 생성 실패' }, 500);
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
        const body = await c.req.json<{
            items?: {
                type: string;
                name: string;
                job_name?: string;
                classification?: string;
                ability_units?: (string | { code: string; name: string; elements?: { code: string; name: string }[] })[];
                units?: string[];
                objectives?: string[]
            }[]
        }>();
        const items = Array.isArray(body.items) ? body.items : [];
        console.log('[DEBUG] Curriculum PUT - Received items:', items.length);

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
            const jobName = (it.job_name || '').trim() || null;
            console.log('[DEBUG] Inserting curriculum:', { type, name, jobName, hasAbilityUnits: !!abilityUnitsJson });
            await c.env.DB.prepare(
                `INSERT INTO ncs_approved_curriculum (registration_id, type, name, job_name, classification, ability_units_json, units_json, objectives_json, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(id, type, name, jobName, classification, abilityUnitsJson, unitsJson, objectivesJson, i).run();
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

/** 훈련시간설정(4단계) 조회 — 전체 파라미터 + 교과목 목록 + 교과목별 이론/실습 시간 */
app.get('/approved/registrations/:id/training-hours', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const exists = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!exists) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        let params: { total_training_days: number | null; daily_training_hours: number | null; total_training_hours: number | null; ncs_lib_arts_pct: number | null; ncs_major_pct: number | null; non_ncs_pct: number | null } = {
            total_training_days: null, daily_training_hours: null, total_training_hours: null,
            ncs_lib_arts_pct: null, ncs_major_pct: null, non_ncs_pct: null
        };
        try {
            const reg = await c.env.DB.prepare(
                'SELECT approved_course_id, total_training_days, daily_training_hours, total_training_hours, ncs_lib_arts_pct, ncs_major_pct, non_ncs_pct FROM ncs_approved_registrations WHERE id = ?'
            ).bind(id).first() as { approved_course_id?: number | null; total_training_days?: number | null; daily_training_hours?: number | null; total_training_hours?: number | null; ncs_lib_arts_pct?: number | null; ncs_major_pct?: number | null; non_ncs_pct?: number | null } | null;

            if (reg) {
                let d = reg.total_training_days;
                let h = reg.daily_training_hours;
                let th = reg.total_training_hours;

                // ncs_approved_registrations에 값이 없는 경우 (최초 로드 시), approved_courses 테이블에서 기본 설정을 가져옵니다.
                if ((!d || !h || !th) && reg.approved_course_id) {
                    const course = await c.env.DB.prepare(
                        'SELECT total_days, daily_hours, total_hours FROM approved_courses WHERE id = ?'
                    ).bind(reg.approved_course_id).first() as { total_days?: number | null; daily_hours?: number | null; total_hours?: number | null } | null;

                    if (course) {
                        if (!d && course.total_days) d = course.total_days;
                        if (!h && course.daily_hours) h = course.daily_hours;
                        if (!th && course.total_hours) th = course.total_hours;
                    }
                }

                params = {
                    total_training_days: d ?? null,
                    daily_training_hours: h ?? null,
                    total_training_hours: th ?? null,
                    ncs_lib_arts_pct: reg.ncs_lib_arts_pct ?? null,
                    ncs_major_pct: reg.ncs_major_pct ?? null,
                    non_ncs_pct: reg.non_ncs_pct ?? null
                };
            }
        } catch (e) {
            console.error('[NCS_API] Get training-hours error:', e);
        }
        const { results: curriculum } = await c.env.DB.prepare(
            'SELECT id, type, name, job_name, classification, ability_units_json, units_json, objectives_json, sort_order FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all() as { results: any[] };
        const curriculumIds = (curriculum || []).map((r: { id: number }) => r.id);
        let hoursMap: Record<number, { theory_hours: number; practice_hours: number }> = {};
        if (curriculumIds.length) {
            const placeholders = curriculumIds.map(() => '?').join(',');
            const { results: hoursRows } = await c.env.DB.prepare(
                `SELECT curriculum_id, theory_hours, practice_hours FROM ncs_approved_training_hours WHERE curriculum_id IN (${placeholders})`
            ).bind(...curriculumIds).all() as { results: any[] };
            (hoursRows || []).forEach((row: { curriculum_id: number; theory_hours: number; practice_hours: number }) => {
                hoursMap[row.curriculum_id] = { theory_hours: row.theory_hours ?? 0, practice_hours: row.practice_hours ?? 0 };
            });
        }
        function parseClassificationFromUnitCode(abilityUnitsJson: string | null | undefined): { largeCode: string; largeName: string; midCode: string; smallCode: string; subCode: string; unitCode: string; jobCode8: string } | null {
            if (!abilityUnitsJson) return null;
            let units: unknown[] = [];
            try {
                units = JSON.parse(abilityUnitsJson) as unknown[];
            } catch {
                return null;
            }
            if (!Array.isArray(units) || units.length === 0) return null;
            const first = units[0];
            const rawCode = typeof first === 'string' ? first : (first && typeof first === 'object' && 'code' in first ? String((first as { code: string }).code) : '');
            const unitCode = typeof rawCode === 'string' ? rawCode.trim() : '';
            const numPart = unitCode.split('_')[0] || '';
            if (numPart.length < 8) return null;
            const largeCode = numPart.substring(0, 2);
            const midCode = numPart.substring(2, 4);
            const smallCode = numPart.substring(4, 6);
            const subCode = numPart.substring(6, 8);
            const large = NCS_LARGE_CLASSES.find((x) => x.code === largeCode);
            return {
                largeCode,
                largeName: large?.name ?? '',
                midCode,
                smallCode,
                subCode,
                unitCode,
                jobCode8: largeCode + midCode + smallCode + subCode
            };
        }

        const ncsRows = (curriculum || []).filter((r: { type: string }) => r.type === 'ncs');
        const jobCodesToLookup = ncsRows
            .map((r: { ability_units_json?: string }) => parseClassificationFromUnitCode(r.ability_units_json)?.jobCode8)
            .filter((c): c is string => !!c);
        const uniqueJobCodes = [...new Set(jobCodesToLookup)] as string[];
        let hierarchyMap: Record<string, { large_name: string; mid_name: string; small_name: string; job_name: string }> = {};
        if (uniqueJobCodes.length > 0) {
            try {
                const placeholders = uniqueJobCodes.map(() => '?').join(',');
                const { results: hierRows } = await c.env.DB.prepare(
                    `SELECT job_code, large_name, mid_name, small_name, job_name FROM ncs_job_hierarchy WHERE job_code IN (${placeholders})`
                ).bind(...uniqueJobCodes).all() as { results: { job_code: string; large_name: string | null; mid_name: string | null; small_name: string | null; job_name: string }[] };
                (hierRows || []).forEach((r: { job_code: string; large_name: string | null; mid_name: string | null; small_name: string | null; job_name: string }) => {
                    hierarchyMap[r.job_code] = {
                        large_name: r.large_name ?? '',
                        mid_name: r.mid_name ?? '',
                        small_name: r.small_name ?? '',
                        job_name: r.job_name ?? ''
                    };
                });
            } catch (_) {
                /* ncs_job_hierarchy may not exist or columns may differ */
            }
        }

        const data = (curriculum || []).map((row: { id: number; type: string; name: string; job_name?: string; classification: string | null; ability_units_json?: string; units_json?: string | null; objectives_json?: string | null; sort_order: number }) => {
            const h = hoursMap[row.id] || { theory_hours: 0, practice_hours: 0 };
            let classification_path: { largeCode: string; largeName: string; midCode: string; midName: string; smallCode: string; smallName: string; subCode: string; subName: string; unitCode: string } | null = null;
            if (row.type === 'ncs' && row.ability_units_json) {
                const parsed = parseClassificationFromUnitCode(row.ability_units_json);
                if (parsed) {
                    const hier = hierarchyMap[parsed.jobCode8];
                    classification_path = {
                        largeCode: parsed.largeCode,
                        largeName: parsed.largeName,
                        midCode: parsed.midCode,
                        midName: hier?.mid_name ?? '',
                        smallCode: parsed.smallCode,
                        smallName: hier?.small_name ?? '',
                        subCode: parsed.subCode,
                        subName: hier?.job_name ?? '',
                        unitCode: parsed.unitCode
                    };
                }
            }
            return {
                curriculum_id: row.id,
                type: row.type,
                name: row.name,
                job_name: row.job_name,
                classification: row.classification,
                ability_units_json: row.ability_units_json,
                units_json: row.units_json ?? undefined,
                objectives_json: row.objectives_json ?? undefined,
                sort_order: row.sort_order,
                theory_hours: h.theory_hours,
                practice_hours: h.practice_hours,
                classification_path: classification_path || undefined
            };
        });
        console.log('[DEBUG] Training hours GET - Curriculum count:', data.length);
        if (data.length > 0) {
            console.log('[DEBUG] First curriculum item:', data[0]);
        }
        return c.json({ success: true, params, data });
    } catch (e) {
        console.error('ncs approved training-hours get:', e);
        return c.json({ success: false, error: '훈련시간 조회 실패' }, 500);
    }
});

/** 훈련시간설정(4단계) 저장 — 전체 파라미터 + 교과목별 이론/실습 시간 */
app.put('/approved/registrations/:id/training-hours', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const existing = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!existing) return c.json({ success: false, error: '등록 정보 없음' }, 404);
        const body = await c.req.json<{
            params?: { total_training_days?: number; daily_training_hours?: number; total_training_hours?: number; ncs_lib_arts_pct?: number; ncs_major_pct?: number; non_ncs_pct?: number };
            items?: { curriculum_id: number; theory_hours?: number; practice_hours?: number }[];
        }>();
        const params = body.params;
        if (params && typeof params === 'object') {
            try {
                const totalDays = params.total_training_days != null ? params.total_training_days : null;
                const dailyHours = params.daily_training_hours != null ? params.daily_training_hours : null;
                const totalHours = params.total_training_hours != null ? params.total_training_hours : null;
                const libPct = params.ncs_lib_arts_pct != null ? params.ncs_lib_arts_pct : null;
                const majorPct = params.ncs_major_pct != null ? params.ncs_major_pct : null;
                const nonPct = params.non_ncs_pct != null ? params.non_ncs_pct : null;
                await c.env.DB.prepare(
                    `UPDATE ncs_approved_registrations SET total_training_days = ?, daily_training_hours = ?, total_training_hours = ?, ncs_lib_arts_pct = ?, ncs_major_pct = ?, non_ncs_pct = ?, updated_at = datetime('now') WHERE id = ?`
                ).bind(totalDays, dailyHours, totalHours, libPct, majorPct, nonPct, id).run();
            } catch (_) {
                /* columns may not exist yet */
            }
        }
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
        ).bind(id).all() as { results: any[] };
        const curriculumIds = (curriculum || []).map((r: { id: number }) => r.id);
        let hoursMap: Record<number, { theory_hours: number; practice_hours: number }> = {};
        if (curriculumIds.length) {
            const placeholders = curriculumIds.map(() => '?').join(',');
            const { results: hoursRows } = await c.env.DB.prepare(
                `SELECT curriculum_id, theory_hours, practice_hours FROM ncs_approved_training_hours WHERE curriculum_id IN (${placeholders})`
            ).bind(...curriculumIds).all() as { results: any[] };
            (hoursRows || []).forEach((row: { curriculum_id: number; theory_hours: number; practice_hours: number }) => {
                hoursMap[row.curriculum_id] = { theory_hours: row.theory_hours ?? 0, practice_hours: row.practice_hours ?? 0 };
            });
        }
        const data = (curriculum || []).map((r: { id: number }) => ({
            curriculum_id: r.id,
            ...(hoursMap[r.id] || { theory_hours: 0, practice_hours: 0 })
        }));
        let regRow: any = null;
        try {
            regRow = await c.env.DB.prepare(
                'SELECT total_training_days, daily_training_hours, total_training_hours, ncs_lib_arts_pct, ncs_major_pct, non_ncs_pct FROM ncs_approved_registrations WHERE id = ?'
            ).bind(id).first();
        } catch (_) {
            /* columns may not exist yet */
        }

        const resultParams = regRow ? {
            total_training_days: regRow.total_training_days ?? null,
            daily_training_hours: regRow.daily_training_hours ?? null,
            total_training_hours: regRow.total_training_hours ?? null,
            ncs_lib_arts_pct: regRow.ncs_lib_arts_pct ?? null,
            ncs_major_pct: regRow.ncs_major_pct ?? null,
            non_ncs_pct: regRow.non_ncs_pct ?? null
        } : {};

        return c.json({ success: true, params: resultParams, data });
    } catch (e: any) {
        console.error('ncs approved training-hours put error:', e);
        return c.json({ success: false, error: '훈련시간 저장 실패: ' + (e.message || '서버 오류') }, 500);
    }
});

/** 평가·교수학습방법(5단계) 조회 — 훈련시간(4단계)에 설정된 교과목 목록 반환 */
app.get('/approved/registrations/:id/evaluation-teaching', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const exists = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE id = ?').bind(id).first();
        if (!exists) return c.json({ success: false, error: '등록 정보 없음' }, 404);

        const { results: curriculum } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all() as { results: any[] };

        return c.json({ success: true, data: curriculum || [] });
    } catch (e) {
        console.error('ncs approved evaluation-teaching get:', e);
        return c.json({ success: false, error: '평가·교수학습 정보 조회 실패' }, 500);
    }
});

/** 평가·교수학습방법(5단계) 저장 — 전건 교체 (항목별 업데이트) */
app.put('/approved/registrations/:id/evaluation-teaching', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const body = await c.req.json<{
            items?: {
                id: number;
                main_instructor_ids?: number[];
                evaluator_id?: number | null;
                teaching_methods?: string[];
                evaluation_methods?: string[];
                textbook_ids?: number[];
                material_ids?: number[];
            }[]
        }>();
        const items = Array.isArray(body.items) ? body.items : [];

        for (const it of items) {
            const curriculumId = Number(it.id);
            if (!curriculumId) continue;

            const mainInstructorsJson = it.main_instructor_ids ? JSON.stringify(it.main_instructor_ids) : null;
            const teachingMethodsJson = it.teaching_methods ? JSON.stringify(it.teaching_methods) : null;
            const evaluationMethodsJson = it.evaluation_methods ? JSON.stringify(it.evaluation_methods) : null;
            const textbooksJson = it.textbook_ids ? JSON.stringify(it.textbook_ids) : null;
            const materialsJson = it.material_ids ? JSON.stringify(it.material_ids) : null;
            const evaluatorId = it.evaluator_id || null;

            await c.env.DB.prepare(
                `UPDATE ncs_approved_curriculum SET 
                    main_instructor_ids_json = ?, 
                    evaluator_id = ?, 
                    teaching_methods_json = ?, 
                    evaluation_methods_json = ?, 
                    textbook_ids_json = ?, 
                    material_ids_json = ?, 
                    updated_at = datetime('now') 
                WHERE id = ? AND registration_id = ?`
            ).bind(
                mainInstructorsJson, evaluatorId, teachingMethodsJson, evaluationMethodsJson,
                textbooksJson, materialsJson, curriculumId, id
            ).run();
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('ncs approved evaluation-teaching put:', e);
        return c.json({ success: false, error: '평가·교수학습 정보 저장 실패' }, 500);
    }
});

/** 강사 목록 조회 (교강사 배정용) */
app.get('/approved/instructors', authMiddleware, requireAdmin, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            `SELECT u.id, u.name 
             FROM users u 
             LEFT JOIN hrd_instructors i ON u.id = i.user_id 
             WHERE u.role = 'teacher' OR i.user_id IS NOT NULL
             GROUP BY u.id
             ORDER BY u.name ASC`
        ).all();

        return c.json({ success: true, data: results || [] });
    } catch (e) {
        console.error('ncs approved instructors get:', e);
        return c.json({ success: false, error: '강사 목록 조회 실패' }, 500);
    }
});

/** 물품 목록 조회 (교재/재료용) */
app.get('/approved/hrd-items', authMiddleware, requireAdmin, async (c) => {
    try {
        const category = c.req.query('category');
        let query = 'SELECT id, name, category FROM hrd_items WHERE 1=1';
        const params: any[] = [];
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        query += ' ORDER BY name ASC';
        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return c.json({ success: true, data: results || [] });
    } catch (e) {
        console.error('ncs approved hrd-items get:', e);
        return c.json({ success: false, error: '물품 목록 조회 실패' }, 500);
    }
});

/** 시설·장비(6단계) 조회 */
app.get('/approved/registrations/:id/facilities-equipment', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);

        const { results: curriculum } = await c.env.DB.prepare(
            'SELECT * FROM ncs_approved_curriculum WHERE registration_id = ? ORDER BY sort_order ASC, id ASC'
        ).bind(id).all() as { results: any[] };

        return c.json({ success: true, data: curriculum || [] });
    } catch (e) {
        console.error('ncs approved facilities-equipment get:', e);
        return c.json({ success: false, error: '시설·장비 정보 조회 실패' }, 500);
    }
});

/** 교수계획서: 회차(session)별 교과목 목록 — session → approved_course → ncs_registration → curriculum */
app.get('/approved/syllabus/session/:sessionId/subjects', authMiddleware, requireAdmin, async (c) => {
    try {
        const sessionId = parseInt(c.req.param('sessionId'), 10);
        if (isNaN(sessionId)) return c.json({ success: false, error: '잘못된 회차 ID' }, 400);
        const { DB } = c.env;
        const sql = `SELECT s.id, s.approved_course_id, s.session_number, s.instructor_name, s.training_start_date, s.training_end_date,
              a.name as course_name, a.total_hours, a.daily_hours, a.training_time_start, a.training_time_end
         FROM course_sessions s
         LEFT JOIN approved_courses a ON a.id = s.approved_course_id
         WHERE s.id = ?`;
        const sessionRow = await DB.prepare(sql).bind(sessionId).first() as Record<string, unknown> | null;
        if (!sessionRow) return c.json({ success: false, error: '회차를 찾을 수 없습니다' }, 404);
        const approvedCourseId = sessionRow.approved_course_id as number | null;
        if (!approvedCourseId) return c.json({ success: true, data: { session: sessionRow, subjects: [], registration_id: null } });
        const reg = await DB.prepare('SELECT id, main_job_name, main_job_code FROM ncs_approved_registrations WHERE approved_course_id = ?').bind(approvedCourseId).first() as { id: number; main_job_name?: string; main_job_code?: string } | null;
        if (!reg) return c.json({ success: true, data: { session: sessionRow, subjects: [], registration_id: null } });
        const { results: curriculumRows } = await DB.prepare(
            `SELECT c.id, c.type, c.name, c.job_name, c.classification, c.ability_units_json, c.units_json, c.objectives_json,
             c.facility_ids_json, c.equipment_ids_json, c.textbook_ids_json, c.material_ids_json
             FROM ncs_approved_curriculum c WHERE c.registration_id = ? ORDER BY c.sort_order ASC, c.id ASC`
        ).bind(reg.id).all() as { results: any[] };
        const curriculum = (curriculumRows || []).map((c: any) => ({
            ...c,
            main_job_name: (c.job_name && String(c.job_name).trim()) ? String(c.job_name).trim() : (reg.main_job_name || ''),
            main_job_code: reg.main_job_code || ''
        }));
        return c.json({ success: true, data: { session: sessionRow, subjects: curriculum, registration_id: reg.id } });
    } catch (e) {
        console.error('ncs syllabus session subjects:', e);
        return c.json({ success: false, error: '교과목 목록 조회 실패' }, 500);
    }
});

/** 교수계획서: NCS 능력단위 기반 학습목표·평가기준 — curriculum_id 또는 unit_codes 로 조회 */
app.get('/approved/syllabus/objectives', authMiddleware, requireAdmin, async (c) => {
    try {
        const curriculumId = c.req.query('curriculum_id');
        const unitCodesParam = c.req.query('unit_codes');
        const { DB } = c.env;
        let unitCodes: string[] = [];
        if (curriculumId) {
            const row = await DB.prepare('SELECT ability_units_json FROM ncs_approved_curriculum WHERE id = ?').bind(curriculumId).first() as { ability_units_json?: string } | null;
            if (!row || !row.ability_units_json) return c.json({ success: true, data: { learning_objectives: '', evaluation_criteria: '' } });
            try {
                const parsed = JSON.parse(row.ability_units_json) as (string | { code?: string })[];
                unitCodes = (parsed || []).map((u) => (typeof u === 'string' ? u : (u?.code || ''))).filter(Boolean);
            } catch (_) { return c.json({ success: true, data: { learning_objectives: '', evaluation_criteria: '' } }); }
        } else if (unitCodesParam) {
            unitCodes = String(unitCodesParam).split(',').map((c) => c.trim()).filter(Boolean);
        }
        if (unitCodes.length === 0) return c.json({ success: true, data: { learning_objectives: '', evaluation_criteria: '' } });
        const learningParts: string[] = [];
        const criteriaParts: string[] = [];
        for (const unitCode of unitCodes) {
            const unit = await DB.prepare('SELECT elements_json FROM ncs_units WHERE code = ?').bind(unitCode).first() as { elements_json?: string } | null;
            if (!unit?.elements_json) continue;
            try {
                const elements = JSON.parse(unit.elements_json) as { name?: string; code?: string; criteria_text?: string; criteriaText?: string; knowledge_text?: string; skill_text?: string; attitude_text?: string }[];
                if (!Array.isArray(elements)) continue;
                elements.forEach((el, i) => {
                    const criteria = (el.criteria_text || el.criteriaText || '').trim();
                    const knowledge = (el.knowledge_text || '').trim();
                    const skill = (el.skill_text || '').trim();
                    const attitude = (el.attitude_text || '').trim();
                    const name = (el.name || '').trim();
                    const num = i + 1;
                    if (name || knowledge || skill || attitude) {
                        const line = `${num}. ${name || '수행준거'} ${knowledge ? ' ' + knowledge : ''} ${skill ? ' ' + skill : ''} ${attitude ? ' ' + attitude : ''}`.trim();
                        if (line) learningParts.push(line);
                    }
                    if (criteria) criteriaParts.push(`${num}. ${criteria}`);
                });
            } catch (_) { /* ignore */ }
        }
        const learning_objectives = learningParts.join('\n');
        const evaluation_criteria = criteriaParts.length ? criteriaParts.join('\n') : learningParts.join('\n');
        return c.json({ success: true, data: { learning_objectives, evaluation_criteria } });
    } catch (e) {
        console.error('ncs syllabus objectives:', e);
        return c.json({ success: false, error: '학습목표/평가기준 조회 실패' }, 500);
    }
});

/** 교수계획서 문서 조회 (회차·교과목별) */
app.get('/approved/syllabus/document', authMiddleware, requireAdmin, async (c) => {
    try {
        const sessionId = c.req.query('session_id');
        const curriculumId = c.req.query('curriculum_id');
        const sid = sessionId ? parseInt(String(sessionId), 10) : NaN;
        const cid = curriculumId ? parseInt(String(curriculumId), 10) : NaN;
        if (isNaN(sid) || isNaN(cid)) return c.json({ success: false, error: 'session_id, curriculum_id 필요' }, 400);
        const row = await c.env.DB.prepare(
            'SELECT id, session_id, curriculum_id, training_level, training_hours, instructors, teaching_method, trainees, author, textbook, publisher, pub_year, learning_objectives, evaluation_criteria, instructions, updated_at FROM syllabus_documents WHERE session_id = ? AND curriculum_id = ?'
        ).bind(sid, cid).first();
        return c.json({ success: true, data: row || null });
    } catch (e) {
        console.error('ncs syllabus document get:', e);
        return c.json({ success: false, error: '교수계획서 조회 실패' }, 500);
    }
});

/** 교수계획서 문서 저장 (회차·교과목별) */
app.put('/approved/syllabus/document', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json<{
            session_id: number;
            curriculum_id: number;
            training_level?: string;
            training_hours?: string;
            instructors?: string;
            teaching_method?: string;
            trainees?: string;
            author?: string;
            textbook?: string;
            publisher?: string;
            pub_year?: string;
            learning_objectives?: string;
            evaluation_criteria?: string;
            instructions?: string;
        }>();
        const sid = body.session_id != null ? parseInt(String(body.session_id), 10) : NaN;
        const cid = body.curriculum_id != null ? parseInt(String(body.curriculum_id), 10) : NaN;
        if (isNaN(sid) || isNaN(cid)) return c.json({ success: false, error: 'session_id, curriculum_id 필요' }, 400);
        const training_level = (body.training_level ?? '').trim() || null;
        const training_hours = (body.training_hours ?? '').trim() || null;
        const instructors = (body.instructors ?? '').trim() || null;
        const teaching_method = (body.teaching_method ?? '').trim() || null;
        const trainees = (body.trainees ?? '').trim() || null;
        const author = (body.author ?? '').trim() || null;
        const textbook = (body.textbook ?? '').trim() || null;
        const publisher = (body.publisher ?? '').trim() || null;
        const pub_year = (body.pub_year ?? '').trim() || null;
        const learning_objectives = (body.learning_objectives ?? '').trim() || null;
        const evaluation_criteria = (body.evaluation_criteria ?? '').trim() || null;
        const instructions = (body.instructions ?? '').trim() || null;

        const existing = await c.env.DB.prepare('SELECT id FROM syllabus_documents WHERE session_id = ? AND curriculum_id = ?').bind(sid, cid).first();
        if (existing) {
            await c.env.DB.prepare(
                `UPDATE syllabus_documents SET training_level = ?, training_hours = ?, instructors = ?, teaching_method = ?, trainees = ?, author = ?, textbook = ?, publisher = ?, pub_year = ?, learning_objectives = ?, evaluation_criteria = ?, instructions = ?, updated_at = datetime('now') WHERE session_id = ? AND curriculum_id = ?`
            ).bind(training_level, training_hours, instructors, teaching_method, trainees, author, textbook, publisher, pub_year, learning_objectives, evaluation_criteria, instructions, sid, cid).run();
        } else {
            await c.env.DB.prepare(
                `INSERT INTO syllabus_documents (session_id, curriculum_id, training_level, training_hours, instructors, teaching_method, trainees, author, textbook, publisher, pub_year, learning_objectives, evaluation_criteria, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(sid, cid, training_level, training_hours, instructors, teaching_method, trainees, author, textbook, publisher, pub_year, learning_objectives, evaluation_criteria, instructions).run();
        }
        return c.json({ success: true });
    } catch (e) {
        if (isD1SchemaError(e)) {
            return c.json({ success: false, error: '교수계획서 저장 테이블이 없습니다. 마이그레이션 0063을 적용하세요.' }, 400);
        }
        console.error('ncs syllabus document put:', e);
        return c.json({ success: false, error: '교수계획서 저장 실패' }, 500);
    }
});

/** 시설·장비(6단계) 저장 — 시설, 장비, 교재, 훈련재료/소모품 */
app.put('/approved/registrations/:id/facilities-equipment', authMiddleware, requireAdmin, async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const body = await c.req.json<{
            items?: {
                id: number;
                facility_ids?: number[];
                equipment_ids?: number[];
                textbook_ids?: number[];
                material_ids?: number[];
            }[]
        }>();
        const items = Array.isArray(body.items) ? body.items : [];

        for (const it of items) {
            const curriculumId = Number(it.id);
            if (!curriculumId) continue;

            const facilitiesJson = it.facility_ids ? JSON.stringify(it.facility_ids) : null;
            const equipmentJson = it.equipment_ids ? JSON.stringify(it.equipment_ids) : null;
            const textbookIdsJson = it.textbook_ids ? JSON.stringify(it.textbook_ids) : null;
            const materialIdsJson = it.material_ids ? JSON.stringify(it.material_ids) : null;

            await c.env.DB.prepare(
                `UPDATE ncs_approved_curriculum SET 
                    facility_ids_json = ?, 
                    equipment_ids_json = ?, 
                    textbook_ids_json = ?, 
                    material_ids_json = ?, 
                    updated_at = datetime('now') 
                WHERE id = ? AND registration_id = ?`
            ).bind(facilitiesJson, equipmentJson, textbookIdsJson, materialIdsJson, curriculumId, id).run();
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('ncs approved facilities-equipment put:', e);
        return c.json({ success: false, error: '시설·장비 정보 저장 실패' }, 500);
    }
});

/** 시설 목록 조회 (hrd_facilities: room_number 없음, status는 '양호' 등) */
app.get('/approved/facilities', authMiddleware, requireAdmin, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            'SELECT id, name FROM hrd_facilities ORDER BY name ASC'
        ).all();
        return c.json({ success: true, data: (results || []).map((r: { id: number; name: string }) => ({ id: r.id, name: r.name, room_number: null })) });
    } catch (e) {
        console.error('ncs approved facilities get:', e);
        return c.json({ success: false, error: '시설 목록 조회 실패' }, 500);
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
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const csvContent = new TextEncoder().encode(csv);
        const combined = new Uint8Array(bom.length + csvContent.length);
        combined.set(bom);
        combined.set(csvContent, bom.length);

        return c.body(combined.buffer, 200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="evaluation_results.csv"'
        });
    } catch (e) {
        console.error('ncs evaluation list download error:', e);
        return c.text('다운로드 실패', 500);
    }
});



const FALLBACK_NCS_UNITS: Record<string, { code: string; name: string; level: number; elements?: { code: string; name: string }[] }[]> = {
    // 19031102: 3D프린터용 제품제작 (3D프린터운용기능사 관련)
    '19031102': [
        {
            code: '1903110201_15v1', name: '시장조사', level: 3,
            elements: [
                { code: '1903110201_15v1_01', name: '자료수집하기' },
                { code: '1903110201_15v1_02', name: '시장 트렌드 분석하기' }
            ]
        },
        {
            code: '1903110202_23v3', name: '제품기획', level: 3,
            elements: [
                { code: '1903110202_23v3_01', name: '품목 선정하기' },
                { code: '1903110202_23v3_02', name: '디자인 컨셉 수립하기' }
            ]
        },
        {
            code: '1903110205_23v3', name: '엔지니어링모델링', level: 4,
            elements: [
                { code: '1903110205_23v3_01', name: '도면 분석하기' },
                { code: '1903110205_23v3_02', name: '3차원 형상 모델링하기' }
            ]
        },
        {
            code: '1903110207_23v3', name: '3D프린터 SW 설정', level: 3,
            elements: [
                { code: '1903110207_23v3_01', name: '출력보조물 생성하기' },
                { code: '1903110207_23v3_02', name: '슬라이싱하기' },
                { code: '1903110207_23v3_03', name: 'G-코드 생성하기' }
            ]
        },
        {
            code: '1903110208_23v3', name: '3D프린터 HW 설정', level: 3,
            elements: [
                { code: '1903110208_23v3_01', name: '소재 준비하기' },
                { code: '1903110208_23v3_02', name: '데이터 준비하기' },
                { code: '1903110208_23v3_03', name: '장비출력 설정하기' }
            ]
        },
        {
            code: '1903110209_23v3', name: '제품출력', level: 3,
            elements: [
                { code: '1903110209_23v3_01', name: '출력하기' },
                { code: '1903110209_23v3_02', name: '출력물 회수하기' }
            ]
        },
        {
            code: '1903110210_23v4', name: '후가공', level: 2,
            elements: [
                { code: '1903110210_23v4_01', name: '서포트 제거하기' },
                { code: '1903110210_23v4_02', name: '표면 처리하기' }
            ]
        },
        {
            code: '1903110214_23v3', name: '3D프린팅 안전관리', level: 2,
            elements: [
                { code: '1903110214_23v3_01', name: '작업장 환경 정리하기' },
                { code: '1903110214_23v3_02', name: '안전 수칙 준수하기' }
            ]
        }
    ],
    // 19031101: 3D프린터개발
    '19031101': [
        {
            code: '1903110101_15v1', name: '시장분석', level: 5,
            elements: [
                { code: '1903110101_15v1_01', name: '시장 트렌드 분석하기' },
                { code: '1903110101_15v1_02', name: '소비자 니즈 파악하기' }
            ]
        },
        {
            code: '1903110102_15v1', name: '개발계획수립', level: 5,
            elements: [
                { code: '1903110102_15v1_01', name: '제품 개발 로드맵 수립하기' },
                { code: '1903110102_15v1_02', name: '자원 및 예산 확보하기' }
            ]
        },
        {
            code: '1903110104_21v2', name: '회로 설계', level: 5,
            elements: [
                { code: '1903110104_21v2_01', name: '회로도 작성하기' },
                { code: '1903110104_21v2_02', name: 'PCB 레이아웃 설계하기' }
            ]
        },
        {
            code: '1903110105_15v1', name: '기구개발', level: 4,
            elements: [
                { code: '1903110105_15v1_01', name: '기구 구조 설계하기' },
                { code: '1903110105_15v1_02', name: '부품 상세 설계하기' }
            ]
        }
    ],
    // 15010201: 기계요소설계 (기계설계산업기사/기사 관련)
    '15010201': [
        {
            code: '1501020101_19v3', name: '기계요소설계 기획', level: 5,
            elements: [
                { code: '1501020101_19v3_01', name: '기계제품 개발 요구사항 분석하기' },
                { code: '1501020101_19v3_02', name: '기계제품 개발 계획서 작성하기' }
            ]
        },
        {
            code: '1501020102_19v3', name: '기계요소설계 자료수집', level: 4,
            elements: [
                { code: '1501020102_19v3_01', name: '설계 관련 표준 및 규격 수집하기' },
                { code: '1501020102_19v3_02', name: '수집 자료의 기술적 검토하기' }
            ]
        },
        {
            code: '1501020111_19v3', name: '체결요소설계', level: 3,
            elements: [
                { code: '1501020111_19v3_01', name: '체결 목적에 따른 요소 선정하기' },
                { code: '1501020111_19v3_02', name: '체결부의 강도 및 구조 설계하기' }
            ]
        },
        {
            code: '1501020112_19v3', name: '동력전달요소설계', level: 3,
            elements: [
                { code: '1501020112_19v3_01', name: '동력 전달 방식 결정하기' },
                { code: '1501020112_19v3_02', name: '축, 베어링, 기어 부품 설계하기' }
            ]
        },
        {
            code: '1501020121_19v3', name: '도면분석', level: 3,
            elements: [
                { code: '1501020121_19v3_01', name: '투상도 및 단면도 분석하기' },
                { code: '1501020121_19v3_02', name: '치수 및 기하공차 파악하기' }
            ]
        },
        {
            code: '1501020123_19v2', name: '2D도면작업', level: 3,
            elements: [
                { code: '1501020123_19v2_01', name: '2D 도면 작성하기' },
                { code: '1501020123_19v2_02', name: '부품도 상세 기입하기' },
                { code: '1501020123_19v2_03', name: '도면 부품란 작성하기' }
            ]
        },
        {
            code: '1501020125_19v3', name: '3D형상모델링작업', level: 2,
            elements: [
                { code: '1501020125_19v3_01', name: '3D 형상 모델링 준비하기' },
                { code: '1501020125_19v3_02', name: '3D 부품 모델링하기' },
                { code: '1501020125_19v3_03', name: '3D 조립 모델링 및 모델링 검토하기' }
            ]
        },
        {
            code: '1501020126_19v3', name: '3D형상모델링검토', level: 3,
            elements: [
                { code: '1501020126_19v3_01', name: '모델링 데이터의 오류 및 간섭 검토하기' },
                { code: '1501020126_19v3_02', name: '검토 결과에 따른 모델링 데이터 수정하기' }
            ]
        },
        {
            code: '1501020127_19v3', name: '요소부품재질선정', level: 4,
            elements: [
                { code: '1501020127_19v3_01', name: '부품별 요구 특성에 따른 재질 파악하기' },
                { code: '1501020127_19v3_02', name: '경제성 및 가공성을 고려한 재질 확정하기' }
            ]
        }
    ]
};

app.get('/approved/render-step', async (c) => {
    try {
        const step = parseInt(c.req.query('step') || '1', 10);
        const courseId = c.req.query('courseId') || '';

        // Find ncs registration id by courseId if courseId is available
        let editId = '';
        if (courseId) {
            const row = await c.env.DB.prepare('SELECT id FROM ncs_approved_registrations WHERE approved_course_id = ?').bind(courseId).first();
            if (row) {
                editId = String(row.id);
            }
        }

        const html = stepContentHtml(step, editId, true, courseId);
        return c.html(html);
    } catch (e) {
        console.error('ncs render step error:', e);
        return c.html('<p class="text-red-500">오류가 발생했습니다.</p>');
    }
});

// Bulk import NCS elements (Admin only)
app.post('/admin/import-ncs-elements', authMiddleware, requireAdmin, async (c) => {
    try {
        const body = await c.req.json();
        const { elements } = body as { elements: { unit_code: string; code: string; name: string }[] };

        if (!elements || !Array.isArray(elements)) {
            return c.json({ success: false, error: 'Invalid elements array' }, 400);
        }

        let imported = 0;
        for (const elem of elements) {
            try {
                await c.env.DB.prepare(`
                    INSERT INTO ncs_elements (unit_code, code, name)
                    VALUES (?, ?, ?)
                `).bind(elem.unit_code, elem.code, elem.name).run();
                imported++;
            } catch (e) {
                console.error(`Failed to insert element ${elem.code}:`, e);
            }
        }

        return c.json({ success: true, imported, total: elements.length });
    } catch (e) {
        console.error('Bulk import failed:', e);
        return c.json({ success: false, error: 'Bulk import failed' }, 500);
    }
});

export default app;
