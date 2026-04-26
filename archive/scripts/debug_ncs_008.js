const NCS_API_KEY = "fc6555772b8270d4a2a8a81cd96520dfbbbd615a46a498b4b41c9f943b7a76a9";
const NCS_CLASSIFICATION_API_BASE_DEFAULT = 'http://apis.data.go.kr/B490007/hrdkapi';

async function run() {
    const op = "NCS008"; // Assuming NCS008 is Performance Criteria
    // Parameters might be NCS_CL_CD for the Unit Code.
    const unitCode = "1903110207_23v3";
    const url = `${NCS_CLASSIFICATION_API_BASE_DEFAULT}/${op}?serviceKey=${NCS_API_KEY}&type=json&pageNo=1&numOfRows=10&NCS_CL_CD=${unitCode}`;

    console.log("Fetching:", url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log("Response len:", text.length);
        if (text.length < 500) console.log("Response:", text);

        try {
            const json = JSON.parse(text);
            const body = json.body?.items || json.response?.body?.items || json.data;
            if (body && body.length > 0) {
                console.log("\nFirst item keys:", Object.keys(body[0]));
                console.log("\nFirst item full:", JSON.stringify(body[0], null, 2));
            } else {
                console.log("No items.");
            }
        } catch (e) { console.log(e); }

    } catch (e) { console.error(e); }
}

run();
