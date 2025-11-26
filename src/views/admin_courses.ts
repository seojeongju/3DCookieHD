export const adminCoursesListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.tiny.cloud/1/mvw2dv577uz6ru7oboooo1vpsgfgtj25kfa5sci9bblekdy3/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="flex flex-col items-start group">
                        <div class="flex items-center gap-2">
                            <img src="/static/logo.png" alt="WOW 3D" class="h-9 w-auto object-contain mb-0.5">
                            <span class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">ADMIN</span>
                        </div>
                        <span class="text-sm text-gray-600 font-bold tracking-wider group-hover:text-primary-600 transition-colors">와우쓰리디홍대센터</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>대시보드로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">교육과정 관리</h1>
                    <p class="text-gray-600 mt-1">교육 과정을 개설하고 관리합니다.</p>
                </div>
                <button onclick="openModal('createCourseModal')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
                    <i class="fas fa-plus mr-2"></i> 과정 개설
                </button>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 필터 및 검색 -->
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
            <div class="flex gap-2">
                <button onclick="loadCourses()" class="p-2 text-gray-600 hover:text-blue-600">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>

        <!-- 목록 테이블 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명 / 기간</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강료</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정원</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="coursesTableBody" class="bg-white divide-y divide-gray-200">
                    <!-- 데이터가 로드되면 여기에 표시됩니다 -->
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 과정 등록/수정 모달 -->
    <div id="createCourseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">과정 개설</h3>
                <button onclick="closeModal('createCourseModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createCourseForm" onsubmit="handleSaveCourse(event)">
                    <input type="hidden" name="id" id="courseId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">과정명</label>
                            <input type="text" name="title" id="courseTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">카테고리</label>
                                <select name="category" id="courseCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="국비지원">국비지원</option>
                                    <option value="일반과정">일반과정</option>
                                    <option value="특강">특강</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">상태</label>
                                <select name="status" id="courseStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="open">모집중 (Open)</option>
                                    <option value="closed">마감 (Closed)</option>
                                    <option value="preparing">준비중 (Preparing)</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">수강료</label>
                                <input type="number" name="price" id="coursePrice" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">모집 정원</label>
                                <input type="number" name="max_students" id="courseMaxStudents" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">시작일</label>
                                <input type="date" name="start_date" id="courseStartDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">종료일</label>
                                <input type="date" name="end_date" id="courseEndDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">과정 설명</label>
                            <textarea name="description" id="courseDescription" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">썸네일 이미지 URL</label>
                            <input type="text" name="thumbnail_url" id="courseThumbnail" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createCourseModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // 페이지 로드 시 목록 조회
        document.addEventListener('DOMContentLoaded', loadCourses);

        function openModal(id, course = null) {
            const modal = document.getElementById(id);
            const form = document.getElementById('createCourseForm');
            const title = document.getElementById('modalTitle');
            
            if (course) {
                // 수정 모드
                title.textContent = '과정 수정';
                document.getElementById('courseId').value = course.id;
                document.getElementById('courseTitle').value = course.title;
                document.getElementById('courseCategory').value = course.category || '일반과정';
                document.getElementById('courseStatus').value = course.status || 'open';
                document.getElementById('coursePrice').value = course.price || '';
                document.getElementById('courseMaxStudents').value = course.max_students || '';
                document.getElementById('courseStartDate').value = course.start_date ? course.start_date.split('T')[0] : '';
                document.getElementById('courseEndDate').value = course.end_date ? course.end_date.split('T')[0] : '';
                document.getElementById('courseDescription').value = course.description || '';
                document.getElementById('courseThumbnail').value = course.thumbnail_url || '';
            } else {
                // 등록 모드
                title.textContent = '과정 개설';
                form.reset();
                document.getElementById('courseId').value = '';
                document.getElementById('courseStatus').value = 'open';
                document.getElementById('courseCategory').value = '일반과정';
            }
            
            modal.classList.remove('hidden');

            // TinyMCE 초기화 또는 내용 설정
            if (tinymce.get('courseDescription')) {
                tinymce.get('courseDescription').setContent(course ? (course.description || '') : '');
            } else {
                initTinyMCE(course ? (course.description || '') : '');
            }
        }

        function initTinyMCE(initialContent) {
            tinymce.init({
                selector: '#courseDescription',
                height: 400,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image code | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        reject('Image upload failed');
                    };
                    reader.readAsDataURL(blobInfo.blob());
                }),
                setup: function(editor) {
                    editor.on('init', function(e) {
                        editor.setContent(initialContent);
                    });
                }
            });
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        async function loadCourses() {
            const category = document.getElementById('categoryFilter').value;
            const search = document.getElementById('searchInput').value;
            
            let url = '/api/courses?';
            if (category) url += 'category=' + encodeURIComponent(category) + '&';
            if (search) url += 'search=' + encodeURIComponent(search);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('coursesTableBody');
                
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 과정이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(course => \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                                course.status === 'open' ? 'bg-green-100 text-green-800' : 
                                course.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }">
                                \${course.status === 'open' ? '모집중' : course.status === 'closed' ? '마감' : '준비중'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${course.title}</div>
                            <div class="text-xs text-gray-500 mt-1">
                                \${course.start_date ? new Date(course.start_date).toLocaleDateString() : '미정'} ~ 
                                \${course.end_date ? new Date(course.end_date).toLocaleDateString() : '미정'}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${course.price ? Number(course.price).toLocaleString() + '원' : '무료'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${course.max_students || '-'}명
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick='editCourse(\${JSON.stringify(course).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-edit"></i> 수정
                            </button>
                            <button onclick="deleteCourse(\${course.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    </tr>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('coursesTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function editCourse(course) {
            openModal('createCourseModal', course);
        }

        async function handleSaveCourse(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);

            // TinyMCE 내용 동기화
            if (tinymce.get('courseDescription')) {
                tinymce.triggerSave();
                formData.set('description', tinymce.get('courseDescription').getContent());
            }

            const data = Object.fromEntries(formData.entries());
            const id = data.id;
            
            try {
                const token = localStorage.getItem('token');
                const url = id ? '/api/courses/' + id : '/api/courses';
                const method = id ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert(id ? '수정되었습니다.' : '개설되었습니다.');
                    closeModal('createCourseModal');
                    loadCourses(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteCourse(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadCourses(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
