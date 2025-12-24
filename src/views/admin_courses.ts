import { hrdSidebar } from './components/hrd_sidebar';

export const adminCoursesListHtml = (sidebar = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 관리 - 통합 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.tiny.cloud/1/mvw2dv577uz6ru7oboooo1vpsgfgtj25kfa5sci9bblekdy3/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">교육과정 관리</h1>
                            <p class="text-gray-600 mt-1">교육 과정을 개설하고 관리합니다.</p>
                        </div>
                        <button id="btnCreateCourse" onclick="openModal('createCourseModal')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center shadow-sm">
                            <i class="fas fa-plus mr-2"></i> 과정 개설
                        </button>
                    </div>
                </div>
            </div>
            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div class="flex gap-4 items-center">
                        <select id="categoryFilter" onchange="loadCourses()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">전체 카테고리</option>
                            <option value="국비지원">국비지원</option>
                            <option value="일반과정">일반과정</option>
                            <option value="특강">특강</option>
                        </select>
                        <div class="relative">
                            <input type="text" id="searchInput" placeholder="과정명 검색" onkeyup="if(event.key === 'Enter') loadCourses()" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                    </div>
                    <div>
                        <button onclick="loadCourses()" class="p-2 text-gray-600 hover:text-blue-600" title="새로고침">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명 / 기간</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강료</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정원</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="coursesTableBody" class="bg-white divide-y divide-gray-200 text-sm">
                            <tr><td colspan="6" class="px-6 py-12 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <!-- 모달 등 생략 -->
    <div id="createCourseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">과정 개설</h3>
                <button onclick="closeModal('createCourseModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="createCourseForm" onsubmit="handleSaveCourse(event)">
                    <input type="hidden" name="id" id="courseId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-1">과정명 *</label>
                            <input type="text" name="title" id="courseTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">카테고리</label>
                                <select name="category" id="courseCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="국비지원">국비지원</option><option value="일반과정">일반과정</option><option value="특강">특강</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">상태</label>
                                <select name="status" id="courseStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="open">모집중</option><option value="closed">마감</option><option value="preparing">준비중</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">교강사</label>
                                <select name="instructor_id" id="courseInstructor" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="">교강사 선택</option>
                                    <!-- API로 로드됨 -->
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-gray-700 font-medium mb-1">수강료</label><input type="number" name="price" id="coursePrice" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                            <div><label class="block text-gray-700 font-medium mb-1">정원</label><input type="number" name="max_students" id="courseMaxStudents" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-gray-700 font-medium mb-1">시작일</label><input type="date" name="start_date" id="courseStartDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                            <div><label class="block text-gray-700 font-medium mb-1">종료일</label><input type="date" name="end_date" id="courseEndDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">수업 시간</label>
                                <div class="flex gap-2 items-center"><input type="time" id="courseStartTime" class="w-full px-4 py-2 border border-gray-300 rounded-lg"><span>~</span><input type="time" id="courseEndTime" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">수업 요일</label>
                                <div class="flex gap-2">
                                    <select id="courseType" onchange="updateDaysOfWeek()" class="border border-gray-300 rounded-lg px-2"><option value="custom">직접</option><option value="weekday">주간</option><option value="weekend">주말</option></select>
                                    <input type="text" id="courseDays" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                                </div>
                            </div>
                        </div>
                        <div><label class="block text-gray-700 font-medium mb-1">과정 설명</label><textarea id="courseDescription" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea></div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-1">썸네일</label>
                            <div class="flex gap-2"><input type="text" name="thumbnail_url" id="courseThumbnail" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"><input type="file" id="thumbnailFile" accept="image/*" class="hidden" onchange="handleThumbnailFile(this)"><button type="button" onclick="document.getElementById('thumbnailFile').click()" class="px-4 py-2 bg-gray-200 rounded-lg">파일</button></div>
                            <div id="thumbnailPreview" class="hidden mt-2 relative"><img src="" class="max-h-40 mx-auto"><button type="button" onclick="clearThumbnail()" class="absolute top-0 right-0 p-1 bg-white rounded-full shadow"><i class="fas fa-times"></i></button></div>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3 pt-4 border-t"><button type="button" onclick="closeModal('createCourseModal')" class="px-4 py-2 text-gray-600">취소</button><button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-sm">저장하기</button></div>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => { 
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'teacher') {
                const btn = document.getElementById('btnCreateCourse');
                if (btn) btn.style.display = 'none';
            }
            loadCourses(); 
            loadInstructors(); 
        });
        
        async function loadInstructors() {
            try {
                const res = await fetch('/api/hrd/personnel');
                const result = await res.json();
                if (result.success) {
                    const select = document.getElementById('courseInstructor');
                    result.data.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id; // user_id (not instructor table id) might be better depending on schema, assuming p.id is user_id from query
                        opt.textContent = p.name + ' (' + p.position + ')';
                        select.appendChild(opt);
                    });
                }
            } catch (e) {
                console.error('Failed to load instructors:', e);
            }
        }

        function openModal(id, course = null) {
            const m = document.getElementById(id); const f = document.getElementById('createCourseForm');
            if (course) {
                document.getElementById('modalTitle').textContent = '과정 수정';
                document.getElementById('courseId').value = course.id;
                document.getElementById('courseTitle').value = course.title;
                document.getElementById('courseCategory').value = course.category || '일반과정';
                document.getElementById('courseStatus').value = course.status || 'open';
                document.getElementById('courseInstructor').value = course.instructor_id || '';
                document.getElementById('coursePrice').value = course.price || '';
                document.getElementById('courseMaxStudents').value = course.max_students || '';
                document.getElementById('courseStartDate').value = course.start_date ? course.start_date.split('T')[0] : '';
                document.getElementById('courseEndDate').value = course.end_date ? course.end_date.split('T')[0] : '';
                document.getElementById('courseThumbnail').value = course.thumbnail_url || '';
                updateThumbnailPreview(course.thumbnail_url || '');
                try {
                    if (course.schedule && course.schedule.startsWith('{')) {
                        const s = JSON.parse(course.schedule);
                        document.getElementById('courseStartTime').value = s.startTime || '';
                        document.getElementById('courseEndTime').value = s.endTime || '';
                        document.getElementById('courseDays').value = s.days || '';
                    } else { document.getElementById('courseDays').value = course.schedule || ''; }
                } catch(e) { console.error(e); }
            } else {
                document.getElementById('modalTitle').textContent = '과정 개설'; f.reset(); document.getElementById('courseId').value = ''; updateThumbnailPreview('');
            }
            m.classList.remove('hidden'); initTinyMCE(course ? (course.description || '') : '');
        }
        function initTinyMCE(content) {
            if (tinymce.get('courseDescription')) tinymce.get('courseDescription').remove();
            tinymce.init({
                selector: '#courseDescription', height: 300, menubar: false,
                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'code', 'help', 'wordcount'],
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | code help',
                setup: function(ed) { ed.on('init', function() { ed.setContent(content); }); }
            });
        }
        async function handleThumbnailFile(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) { document.getElementById('courseThumbnail').value = e.target.result; updateThumbnailPreview(e.target.result); };
                reader.readAsDataURL(input.files[0]);
            }
        }
        function updateThumbnailPreview(src) {
            const p = document.getElementById('thumbnailPreview'); const img = p.querySelector('img');
            if (src) { img.src = src; p.classList.remove('hidden'); } else { p.classList.add('hidden'); }
        }
        function clearThumbnail() { document.getElementById('courseThumbnail').value = ''; updateThumbnailPreview(''); }
        function closeModal(id) { document.getElementById(id).classList.add('hidden'); if(tinymce.get('courseDescription')) tinymce.get('courseDescription').remove(); }
        async function loadCourses() {
            const cat = document.getElementById('categoryFilter').value; const s = document.getElementById('searchInput').value;
            let url = '/api/courses?'; if(cat) url += 'category=' + encodeURIComponent(cat) + '&'; if(s) url += 'search=' + encodeURIComponent(s);
            try {
                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const r = await res.json();
                const tbody = document.getElementById('coursesTableBody');
                if (!r.success || r.data.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">데이터가 없습니다.</td></tr>'; return; }
                tbody.innerHTML = r.data.map(c => \`
                    <tr class="hover:bg-gray-100 transition">
                        <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 rounded-full text-xs font-bold \${c.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">\${c.status === 'open' ? '모집중' : '마감'}</span></td>
                        <td class="px-6 py-4"><div class="font-bold">\${c.title}</div><div class="text-xs text-gray-500">\${c.start_date?.split('T')[0]} ~ \${c.end_date?.split('T')[0]}</div></td>
                        <td class="px-6 py-4">\${Number(c.price || 0).toLocaleString()}원</td>
                        <td class="px-6 py-4">\${c.max_students || 0}명</td>
                        <td class="px-6 py-4">\${c.created_at?.split('T')[0]}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <a href="/admin/courses/\${c.id}/lms" class="text-purple-600 hover:underline">관리</a>
                            <button onclick='editCourse(\${JSON.stringify(c).replace(/'/g, "&#39;")})' class="text-blue-600"><i class="fas fa-edit"></i></button>
                            \${JSON.parse(localStorage.getItem('user') || '{}').role !== 'teacher' ? \`<button onclick="deleteCourse(\${c.id})" class="text-red-600"><i class="fas fa-trash"></i></button>\` : ''}
                        </td>
                    </tr>
                \`).join('');
            } catch(e) { console.error(e); }
        }
        async function handleSaveCourse(e) {
            e.preventDefault(); const f = e.target; const fd = new FormData(f);
            if (tinymce.get('courseDescription')) { tinymce.triggerSave(); fd.set('description', tinymce.get('courseDescription').getContent()); }
            const sch = { startTime: document.getElementById('courseStartTime').value, endTime: document.getElementById('courseEndTime').value, days: document.getElementById('courseDays').value };
            fd.set('schedule', JSON.stringify(sch));
            const data = Object.fromEntries(fd.entries()); const id = data.id;
            try {
                const res = await fetch(id ? '/api/courses/'+id : '/api/courses', {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify(data)
                });
                const r = await res.json();
                if (r.success) { alert('성공'); closeModal('createCourseModal'); loadCourses(); } else { alert(r.error); }
            } catch(err) { console.error(err); }
        }
        async function deleteCourse(id) {
            if(!confirm('삭제하시겠습니까?')) return;
            try {
                const res = await fetch('/api/courses/'+id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const r = await res.json(); if (r.success) { alert('삭제됨'); loadCourses(); } else { alert(r.error); }
            } catch(e) { console.error(e); }
        }
        function updateDaysOfWeek() {
            const t = document.getElementById('courseType').value; const d = document.getElementById('courseDays');
            if(t==='weekday') d.value='월,화,수,목,금'; else if(t==='weekend') d.value='토,일'; else d.value='';
        }
    </script>
</body>
</html>
`;
