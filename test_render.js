
import { teacherSidebar } from './src/views/components/teacher_sidebar';
import { teacherCoursesHtml } from './src/views/teacher_courses';

try {
    const rendered = teacherCoursesHtml.replace('${teacherSidebar(\'courses\')}', teacherSidebar('courses'));
    const lines = rendered.split('\n');
    console.log('Total Lines:', lines.length);
    console.log('Line 351:', lines[350]);
    console.log('Line 350-352:');
    console.log(lines.slice(349, 352).join('\n'));
} catch (e) {
    console.error(e);
}
