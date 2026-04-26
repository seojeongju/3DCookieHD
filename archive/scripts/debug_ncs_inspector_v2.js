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
    try {
        const res = await fetch(url);
        const txt = await res.text();
        try {
            const json = JSON.parse(txt);
            const body = json.body?.items || json.response?.body?.items || json.data;

            if (Array.isArray(body) && body.length > 0) {
                console.log(`${op} Items found: ${body.length}`);
                console.log('First Item Full:', JSON.stringify(body[0], null, 2));

                const keys = Object.keys(body[0]);
                console.log('Keys:', keys.join(', '));
            } else {
                console.log(`${op} No items. Raw body length: ${txt.length}`);
                if (txt.length < 500) console.log(txt);
            }
        } catch (e) {
            console.log(`JSON Parse Error for ${op}:`, e.message);
            if (res.status !== 200) console.log('Status:', res.status);
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    const code = '1903110207_23v3';

    // Check NCS006 Full Item for any Criteria
    await inspect('NCS006', { NCS_CL_CD: code });

    // Check NCS009 just in case
    await inspect('NCS009', { NCS_CL_CD: code });

    // Check NCS008 again with different params? Maybe NCS_CL_ELEM_CD?
    // Sample element: 1903110207_23v3_01
    await inspect('NCS008', { NCS_CL_ELEM_CD: code + '_01' });
}

run();
