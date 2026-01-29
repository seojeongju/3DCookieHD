
const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'src/views/components/teacher_sidebar.ts');
const coursesPath = path.join(__dirname, 'src/views/teacher_courses.ts');

const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
const coursesContent = fs.readFileSync(coursesPath, 'utf8');

// Extract the template literal content from sidebar
const sidebarBodyMatch = sidebarContent.match(/export const teacherSidebar = \(activeMenu: string\) => `([\s\S]*)`;/);
const sidebarBody = sidebarBodyMatch ? sidebarBodyMatch[1] : '';

// Resolve the sidebar content with activeMenu='courses'
// In the sidebar file, there are interpolations like ${activeMenu === 'dashboard' ? ... : ...}
// We need to simulate this.
// A simple replace might work for simple cases.
let simulatedSidebar = sidebarBody.replace(/\$\{activeMenu === 'courses' \? '([^']*)' : '([^']*)'\}/g, "$1");
simulatedSidebar = simulatedSidebar.replace(/\$\{activeMenu === '[^']+' \? '([^']*)' : '([^']*)'\}/g, "$2");
// Handle the pulse animation conditional
simulatedSidebar = simulatedSidebar.replace(/\$\{activeMenu === 'courses' \? '([^']*)' : ''\}/g, "$1");


// Now constructing the full HTML
// teacher_courses.ts has `export const teacherCoursesHtml = \` ... \``
const coursesBodyMatch = coursesContent.match(/export const teacherCoursesHtml = `([\s\S]*)`;/);
const coursesBody = coursesBodyMatch ? coursesBodyMatch[1] : '';

// Replace ${teacherSidebar('courses')} with simulatedSidebar
const fullHtml = coursesBody.replace('${teacherSidebar(\'courses\')}', simulatedSidebar);

const lines = fullHtml.split('\n');

console.log("Total lines:", lines.length);
console.log("--- Lines 340 to 360 ---");
for (let i = 340; i < 360; i++) {
    if (lines[i - 1] !== undefined) {
        console.log(`${i}: ${lines[i - 1]}`);
    }
}
