const NCS_API_KEY = "fc6555772b8270d4a2a8a81cd96520dfbbbd615a46a498b4b41c9f943b7a76a9";
// Based on src/api/ncs.ts:
const NCS_CLASSIFICATION_API_BASE_DEFAULT = 'http://apis.data.go.kr/B490007/hrdkapi';

async function run() {
    const op = "NCS004";
    const url = `${NCS_CLASSIFICATION_API_BASE_DEFAULT}/${op}?serviceKey=${NCS_API_KEY}&type=json&pageNo=1&numOfRows=10&NCS_LCLAS_CD=15&NCS_MCLAS_CD=01&NCS_SCLAS_CD=02`;

    console.log("Fetching:", url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log("Raw Response:", text);

        // Attempt parse
        try {
            const json = JSON.parse(text);
            const body = json.body?.items || json.response?.body?.items || json.data;
            if (body && body.length > 0) {
                console.log("\nFirst item keys:", Object.keys(body[0]));
                // Dump the first item completely
                console.log("\nFirst item full:", JSON.stringify(body[0], null, 2));
            } else {
                console.log("\nNo items found in response body.");
            }
        } catch (e) {
            console.log("JSON Parse error:", e);
        }

    } catch (e) { console.error("Fetch error:", e); }
}

run();
