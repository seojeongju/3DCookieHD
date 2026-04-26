const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'src/views/components/teacher_sidebar.ts');
const studentsPath = path.join(__dirname, 'src/views/teacher_students.ts');

const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
const studentsContent = fs.readFileSync(studentsPath, 'utf8');

const sidebarBodyMatch = sidebarContent.match(/export const teacherSidebar = \(activeMenu: string\) => `([\s\S]*)`;/);
const sidebarBody = sidebarBodyMatch ? sidebarBodyMatch[1] : '';

let simulatedSidebar = sidebarBody.replace(/\$\{activeMenu === 'students' \? '([^']*)' : '([^']*)'\}/g, "$1");
simulatedSidebar = simulatedSidebar.replace(/\$\{activeMenu === '[^']+' \? '([^']*)' : '([^']*)'\}/g, "$2");
simulatedSidebar = simulatedSidebar.replace(/\$\{activeMenu === 'students' \? '([^']*)' : ''\}/g, "$1");

const studentsBodyMatch = studentsContent.match(/export const teacherStudentsHtml = `([\s\S]*)`;/);
const studentsBody = studentsBodyMatch ? studentsBodyMatch[1] : '';

const fullHtml = studentsBody.replace("${teacherSidebar('students')}", simulatedSidebar);
const lines = fullHtml.split('\n');

console.log("Total lines:", lines.length);
console.log("--- Lines 395 to 415 ---");
for (let i = 395; i < 415; i++) {
    if (lines[i - 1] !== undefined) {
        console.log(`${i}: ${JSON.stringify(lines[i - 1])}`);
    }
}
