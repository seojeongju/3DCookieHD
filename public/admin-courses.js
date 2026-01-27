// 교육과정 관리 JavaScript

let tinymceInitialized = false;

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
        const res = await fetch('/api/hrd/personnel', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const result = await res.json();
        if (result.success && result.data) {
            const select = document.getElementById('courseInstructor');
            select.innerHTML = '<option value="">강사 선택</option>';
            result.data.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.user_id || p.id;
                opt.textContent = p.name + ' (' + (p.position || '강사') + ')';
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.error('Failed to load instructors:', e);
    }
}

function openModal(id, course = null) {
    const modal = document.getElementById(id);
    const form = document.getElementById('createCourseForm');

    if (course) {
        document.getElementById('modalTitle').textContent = '과정 수정';
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseCategory').value = course.category || '일반과정';
        document.getElementById('courseStatus').value = course.status || 'open';
        document.getElementById('courseInstructor').value = course.instructor_id || course.teacher_id || '';
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
            } else {
                document.getElementById('courseDays').value = course.schedule || '';
            }
        } catch (e) {
            console.error('Schedule parse error:', e);
        }

        initTinyMCE(course.description || '');
    } else {
        document.getElementById('modalTitle').textContent = '과정 개설';
        form.reset();
        document.getElementById('courseId').value = '';
        updateThumbnailPreview('');
        initTinyMCE('');
    }

    modal.classList.remove('hidden');
}

function editCourse(course) {
    openModal('createCourseModal', course);
}

function initTinyMCE(content) {
    if (typeof tinymce === 'undefined') {
        console.error('TinyMCE is not loaded');
        return;
    }

    if (tinymce.get('courseDescription')) {
        tinymce.get('courseDescription').remove();
    }

    tinymce.init({
        selector: '#courseDescription',
        height: 300,
        menubar: false,
        plugins: ['advlist', '                autolink', 'lists', 'link', 'image', 'code', 'help', 'wordcount'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | code help',
        setup: function (editor) {
            editor.on('init', function () {
                editor.setContent(content);
                tinymceInitialized = true;
            });
        }
    });
}

async function handleThumbnailFile(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('이미지 크기는 5MB를 초과할 수 없습니다.');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('courseThumbnail').value = e.target.result;
            updateThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function updateThumbnailPreview(src) {
    const preview = document.getElementById('thumbnailPreview');
    const img = preview.querySelector('img');

    if (src) {
        img.src = src;
        preview.classList.remove('hidden');
    } else {
        img.src = '';
        preview.classList.add('hidden');
    }
}

function clearThumbnail() {
    document.getElementById('courseThumbnail').value = '';
    document.getElementById('courseThumbnailFile').value = '';
    updateThumbnailPreview('');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    if (typeof tinymce !== 'undefined' && tinymce.get('courseDescription')) {
        tinymce.get('courseDescription').remove();
    }
    tinymceInitialized = false;
}

async function loadCourses() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value;

    let url = '/api/courses?';
    if (category) url += 'category=' + encodeURIComponent(category) + '&';
    if (search) url += 'search=' + encodeURIComponent(search);

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const result = await res.json();
        const tbody = document.getElementById('coursesTableBody');

        if (!result.success || !result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">데이터가 없습니다.</td></tr>';
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isTeacher = user.role === 'teacher';

        tbody.innerHTML = result.data.map(c => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs font-bold ${c.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${c.status === 'open' ? '모집중' : '마감'}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-bold text-gray-900">${c.title}</div>
                    <div class="text-xs text-gray-500 mt-1">${c.start_date ? c.start_date.split('T')[0] : '-'} ~ ${c.end_date ? c.end_date.split('T')[0] : '-'}</div>
                </td>
                <td class="px-6 py-4">${Number(c.price || 0).toLocaleString()}원</td>
                <td class="px-6 py-4">${c.max_students || 0}명</td>
                <td class="px-6 py-4 text-gray-500">${c.created_at ? c.created_at.split('T')[0] : '-'}</td>
                <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button onclick='editCourse(${JSON.stringify(c).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-800" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!isTeacher ? `
                        <button onclick="deleteCourse(${c.id})" class="text-red-600 hover:text-red-800" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Load courses error:', e);
        const tbody = document.getElementById('coursesTableBody');
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
    }
}

async function handleSaveCourse(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // TinyMCE 내용 가져오기
    if (typeof tinymce !== 'undefined' && tinymce.get('courseDescription')) {
        tinymce.triggerSave();
        formData.set('description', tinymce.get('courseDescription').getContent());
    }

    // 스케줄 JSON 생성
    const schedule = {
        startTime: document.getElementById('courseStartTime').value,
        endTime: document.getElementById('courseEndTime').value,
        days: document.getElementById('courseDays').value
    };
    formData.set('schedule', JSON.stringify(schedule));

    const data = Object.fromEntries(formData.entries());
    const id = data.id;

    // 빈 값 제거
    Object.keys(data).forEach(key => {
        if (data[key] === '') data[key] = null;
    });

    try {
        const url = id ? `/api/courses/${id}` : '/api/courses';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert(id ? '과정이 수정되었습니다.' : '과정이 개설되었습니다.');
            closeModal('createCourseModal');
            loadCourses();
        } else {
            alert('오류: ' + (result.error || '알 수 없는 오류'));
        }
    } catch (err) {
        console.error('Save course error:', err);
        alert('저장 중 오류가 발생했습니다.');
    }
}

async function deleteCourse(id) {
    if (!confirm('정말 이 과정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        return;
    }

    try {
        const res = await fetch(`/api/courses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const result = await res.json();

        if (result.success) {
            alert('과정이 삭제되었습니다.');
            loadCourses();
        } else {
            alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
        }
    } catch (e) {
        console.error('Delete course error:', e);
        alert('삭제 중 오류가 발생했습니다.');
    }
}

function updateDaysOfWeek() {
    const type = document.getElementById('courseType').value;
    const daysInput = document.getElementById('courseDays');

    if (type === 'weekday') {
        daysInput.value = '월,화,수,목,금';
    } else if (type === 'weekend') {
        daysInput.value = '토,일';
    } else {
        daysInput.value = '';
    }
}
