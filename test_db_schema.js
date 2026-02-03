
const sqlite3 = require('sqlite3').verbose();
const path = 'd:\\Documents\\program_DEV\\3DCookieHD-education-platform\\.wrangler\\state\\v3\\d1\\miniflare-D1DatabaseObject\\c784f4e7ea2e2ce124417d774e2374f3a18c4f0ad0e9df450a8702a4749b458f.sqlite';
const db = new sqlite3.Database(path);

db.serialize(() => {
    db.all("PRAGMA table_info(ncs_approved_registrations)", (err, rows) => {
        if (err) {
            console.error('Error fetching table info:', err);
        } else {
            console.log('Columns in ncs_approved_registrations:');
            rows.forEach(row => console.log(`- ${row.name} (${row.type})`));
        }
    });
});
db.close();
