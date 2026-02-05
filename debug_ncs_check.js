const NCS_API_KEY = "fc6555772b8270d4a2a8a81cd96520dfbbbd615a46a498b4b41c9f943b7a76a9";
const BASE = 'http://apis.data.go.kr/B490007/hrdkapi';

async function test(op, code) {
    const url = `${BASE}/${op}?serviceKey=${NCS_API_KEY}&type=json&pageNo=1&numOfRows=100&NCS_CL_CD=${code}`;
    console.log(`Testing ${op} with ${code}...`);
    try {
        const res = await fetch(url);
        const txt = await res.text();
        try {
            const json = JSON.parse(txt);
            const body = json.body?.items || json.response?.body?.items || json.data;
            console.log(`Result count: ${Array.isArray(body) ? body.length : 0}`);
            if (Array.isArray(body) && body.length > 0) {
                console.log('Sample:', body[0]);
            } else {
                if (txt.length < 500) console.log('Raw:', txt);
            }
        } catch (e) {
            console.log('Parse error, raw:', txt.substring(0, 200));
        }
    } catch (err) {
        console.log('Fetch error:', err.message);
    }
    console.log('-------------------');
}

async function run() {
    // 006: Elements
    await test('NCS006', '1903110207_23v3');
    await test('NCS006', '1903110207');

    // 008: Criteria
    await test('NCS008', '1903110207_23v3');
    await test('NCS008', '1903110207');
}

run();
