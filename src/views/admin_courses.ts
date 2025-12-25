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
                            <label class="block text-gray-700 font-medium mb-1">과정명 *</label>
                            <input type="text" name="title" id="courseTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-1">교육과목</label>
                            <input type="text" name="subject" id="courseSubject" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="예: Java 프로그래밍, 3D 모델링">
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
                            <div><label class="block text-gray-700 font-medium mb-1">시작일</label><input type="date" name="start_date" id="courseStartDate" onchange="renderCalendar()" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                            <div><label class="block text-gray-700 font-medium mb-1">종료일</label><input type="date" name="end_date" id="courseEndDate" onchange="renderCalendar()" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">수업 시간</label>
                                <div class="flex gap-2 items-center"><input type="time" id="courseStartTime" class="w-full px-4 py-2 border border-gray-300 rounded-lg"><span>~</span><input type="time" id="courseEndTime" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></div>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-1">수업 요일(요약)</label>
                                <input type="text" id="courseDays" placeholder="일정이 선택되면 자동 입력됨" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" readonly>
                            </div>
                        </div>
                        <!-- 캘린더 영역 -->
                        <div class="col-span-2 mt-2">
                             <label class="block text-gray-700 font-medium mb-1">상세 수업 일정 <span class="text-xs text-gray-500 font-normal ml-1">📅 달력을 클릭하여 수업일을 추가하세요</span></label>
                             <div class="flex flex-wrap gap-2 mb-3">
                                <button type="button" onclick="presetDays([1,3])" class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition">월/수</button>
                                <button type="button" onclick="presetDays([2,4])" class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition">화/목</button>
                                <button type="button" onclick="presetDays([1,3,5])" class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition">월/수/금</button>
                                <button type="button" onclick="presetDays([0,6])" class="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100 transition">주말(토/일)</button>
                                <button type="button" onclick="presetDays([1,2,3,4,5])" class="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 transition">평일 매일</button>
                                <button type="button" onclick="clearCalendarSelection()" class="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200 hover:bg-gray-200 transition ml-auto">선택 초기화</button>
                             </div>
                             <div id="calendarContainer" class="border rounded-lg bg-white p-4 max-h-96 overflow-y-auto custom-scrollbar select-none">
                                <div class="text-center text-gray-400 py-8 flex flex-col items-center">
                                    <i class="fas fa-calendar-alt text-4xl mb-3 text-gray-300"></i>
                                    <span>시작일과 종료일을 설정하면 전체 달력이 표시됩니다.</span>
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

    <script src="/static/admin-courses.js"></script>
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
            selectedDates.clear();

            if (course) {
                document.getElementById('modalTitle').textContent = '과정 수정';
                document.getElementById('courseId').value = course.id;
                document.getElementById('courseTitle').value = course.title;
                document.getElementById('courseSubject').value = course.subject || '';
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

                    if (course.class_days) {
                        const days = typeof course.class_days === 'string' ? JSON.parse(course.class_days) : course.class_days;
                        if(Array.isArray(days)) days.forEach(d => selectedDates.add(d));
                    }
                } catch(e) { console.error(e); }
            } else {
                document.getElementById('modalTitle').textContent = '과정 개설'; f.reset(); document.getElementById('courseId').value = ''; updateThumbnailPreview('');
                selectedDates.clear();
            }
            m.classList.remove('hidden'); initTinyMCE(course ? (course.description || '') : '');
            setTimeout(renderCalendar, 100);
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
            
            const sch = { 
                startTime: document.getElementById('courseStartTime').value, 
                endTime: document.getElementById('courseEndTime').value, 
                days: document.getElementById('courseDays').value 
            };
            fd.set('schedule', JSON.stringify(sch));
            
            const data = Object.fromEntries(fd.entries());
            data.class_days = Array.from(selectedDates).sort();

            const id = data.id;
            try {
                const res = await fetch(id ? '/api/courses/'+id : '/api/courses', {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify(data)
                });
                const r = await res.json();
                if (r.success) { alert('저장되었습니다.'); closeModal('createCourseModal'); loadCourses(); } else { alert(r.error); }
            } catch(err) { console.error(err); }
        }
        async function deleteCourse(id) {
            if(!confirm('삭제하시겠습니까?')) return;
            try {
                const res = await fetch('/api/courses/'+id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const r = await res.json(); if (r.success) { alert('삭제됨'); loadCourses(); } else { alert(r.error); }
            } catch(e) { console.error(e); }
        }
        function editCourse(course) {
            openModal('createCourseModal', course);
        }
        // 캘린더 및 날짜 선택 로직
        let selectedDates = new Set();
        
        function renderCalendar() {
            const startStr = document.getElementById('courseStartDate').value;
            const endStr = document.getElementById('courseEndDate').value;
            const container = document.getElementById('calendarContainer');
            
            if (!startStr || !endStr) {
                container.innerHTML = '<div class="text-center text-gray-400 py-8 flex flex-col items-center"><i class="fas fa-calendar-alt text-4xl mb-3 text-gray-300"></i><span>시작일과 종료일을 설정하면 전체 달력이 표시됩니다.</span></div>';
                return;
            }

            const start = new Date(startStr);
            const end = new Date(endStr);
            
            if (start > end) {
                container.innerHTML = '<div class="text-center text-red-500 py-8">종료일은 시작일보다 뒤여야 합니다.</div>';
                return;
            }

            let html = '<div class="space-y-6">';
            let curr = new Date(startStr);
            curr.setDate(1); 
            
            while (curr <= end || (curr.getMonth() === end.getMonth() && curr.getFullYear() === end.getFullYear())) {
                const year = curr.getFullYear();
                const month = curr.getMonth();
                
                html += '<div class="border rounded-lg overflow-hidden bg-white shadow-sm">';
                html += '<div class="bg-gray-100 px-4 py-2 font-bold text-center border-b flex justify-between items-center"><span>' + year + '년 ' + (month + 1) + '월</span></div>';
                html += '<div class="grid grid-cols-7 gap-px bg-gray-200 text-sm border-b">';
                html += '<div class="bg-red-50 p-2 text-center text-red-500 font-bold">일</div><div class="bg-gray-50 p-2 text-center font-bold">월</div><div class="bg-gray-50 p-2 text-center font-bold">화</div><div class="bg-gray-50 p-2 text-center font-bold">수</div><div class="bg-gray-50 p-2 text-center font-bold">목</div><div class="bg-gray-50 p-2 text-center font-bold">금</div><div class="bg-blue-50 p-2 text-center text-blue-500 font-bold">토</div>';
                html += '</div><div class="grid grid-cols-7 gap-px bg-gray-200 text-sm">';

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const firstDayOfWeek = firstDay.getDay();
                
                for (let i = 0; i < firstDayOfWeek; i++) {
                    html += '<div class="bg-white p-2 min-h-[3rem]"></div>';
                }

                for (let d = 1; d <= lastDay.getDate(); d++) {
                    const dateObj = new Date(year, month, d);
                    const y = dateObj.getFullYear();
                    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const dateStr = y + '-' + m + '-' + day;
                    
                    const isInRange = dateStr >= startStr && dateStr <= endStr;
                    const isSelected = selectedDates.has(dateStr);
                    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                    
                    let classes = "bg-white p-1 min-h-[3rem] cursor-pointer hover:bg-purple-50 flex flex-col items-center justify-center transition relative";
                    let textClass = "font-medium";
                    
                    if (!isInRange) {
                        classes = "bg-gray-50 p-1 min-h-[3rem] text-gray-300 cursor-not-allowed";
                    } else if (isSelected) {
                        classes = "bg-purple-600 text-white p-1 min-h-[3rem] cursor-pointer shadow-inner";
                    } else if (isWeekend) {
                        textClass = "font-medium text-red-500";
                        classes += " bg-red-50 hover:bg-red-100";
                    }

                    const onClick = isInRange ? 'onclick="toggleDate(\\'' + dateStr + '\\')"' : '';
                    
                    html += '<div class="' + classes + '" ' + onClick + '><span class="' + textClass + '">' + d + '</span>' + (isSelected ? '<i class="fas fa-check text-xs mt-1"></i>' : '') + '</div>';
                }
                
                const lastDayOfWeek = lastDay.getDay();
                for (let i = lastDayOfWeek; i < 6; i++) {
                     html += '<div class="bg-white p-2 min-h-[3rem]"></div>';
                }
                
                html += '</div></div>';

                curr.setMonth(curr.getMonth() + 1);
                if (curr > end && curr.getMonth() !== end.getMonth()) break;
                if (curr.getFullYear() > end.getFullYear()) break;
            }
            html += '</div>';
            container.innerHTML = html;
            updateCourseDaysSummary();
        }

        function toggleDate(dateStr) {
            if (selectedDates.has(dateStr)) {
                selectedDates.delete(dateStr);
            } else {
                selectedDates.add(dateStr);
            }
            renderCalendar();
        }

        function presetDays(days) {
            const startStr = document.getElementById('courseStartDate').value;
            const endStr = document.getElementById('courseEndDate').value;
            if (!startStr || !endStr) { alert('기간을 먼저 설정하세요.'); return; }
            
            const start = new Date(startStr);
            const end = new Date(endStr);
            const targetDays = new Set(days);

            let curr = new Date(startStr);
            while (curr <= end) {
                if (targetDays.has(curr.getDay())) {
                     const y = curr.getFullYear();
                     const m = String(curr.getMonth() + 1).padStart(2, '0');
                     const d = String(curr.getDate()).padStart(2, '0');
                     const dateStr = y + '-' + m + '-' + d;
                     selectedDates.add(dateStr);
                }
                curr.setDate(curr.getDate() + 1);
            }
            renderCalendar();
        }

        function clearCalendarSelection() {
            selectedDates.clear();
            renderCalendar();
        }

        function updateCourseDaysSummary() {
            const count = selectedDates.size;
            const input = document.getElementById('courseDays');
            if (count === 0) {
                input.value = '';
            } else {
                input.value = '총 ' + count + '일 선택됨';
            }
        }
    </script>
</body>
</html>
`;
