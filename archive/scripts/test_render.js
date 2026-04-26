
import { teacherSidebar } from './src/views/components/teacher_sidebar';
import { teacherCoursesHtml } from './src/views/teacher_courses';

try {
    const rendered = teacherCoursesHtml('courses');
    const lines = rendered.split('\n');
    console.log('Total Lines:', lines.length);
    // Find the line containing viewCourseDetail
    const matchLine = lines.findIndex(l => l.includes('viewCourseDetail'));
    if (matchLine !== -1) {
        console.log('Line ' + (matchLine + 1) + ':', lines[matchLine]);
        console.log('Context:');
        console.log(lines.slice(matchLine - 2, matchLine + 3).join('\n'));
    } else {
        console.log('viewCourseDetail not found in rendered HTML');
    }
} catch (e) {
    console.error(e);
}
