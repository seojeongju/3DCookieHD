const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'views', 'admin_hrd_items.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic line 282
content = content.replace(
    /options \+= `<option value="\${facility\.name}">\${facility\.name}<\/option>`;/g,
    "options += '<option value=\"' + facility.name + '\">' + facility.name + '</option>';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully');
