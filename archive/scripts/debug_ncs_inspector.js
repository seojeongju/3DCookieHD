const NCS_API_KEY = "fc6555772b8270d4a2a8a81cd96520dfbbbd615a46a498b4b41c9f943b7a76a9";
const BASE = 'http://apis.data.go.kr/B490007/hrdkapi';

async function inspect(op, params) {
    const query = new URLSearchParams({
        serviceKey: NCS_API_KEY,
        type: 'json',
        pageNo: '1',
        numOfRows: '10',
        ...params
    });
    const url = `${BASE}/${op}?${query}`;
    console.log(`\n=== Testing ${op} ===`);
    console.log(`URL: ${url}`);
    try {
        const res = await fetch(url);
        const txt = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', txt.substring(0, 1000));
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    const code = '1903110207_23v3';
    const plainCode = '1903110207';

    // NCS005: 능력단위 목록 (혹은 상세?) - 보통 세분류 코드로 목록 조회
    // 19031102 (세분류)
    await inspect('NCS005', { NCS_SUBD_CD: '19031102' });

    // NCS006: 능력단위 요소
    await inspect('NCS006', { NCS_CL_CD: code });
    await inspect('NCS006', { NCS_CL_CD: plainCode });

    // NCS008: 수행준거 (API 명칭 확인 필요)
    await inspect('NCS008', { NCS_CL_CD: code });

    // Probing approach check: NCS006 with NCS_CL_ELEM_CD? (Not standard but check)
    // await inspect('NCS006', { NCS_CL_ELEM_CD: code + '_01' }); 
}

run();
