export const adminExamsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험/문제 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 (admin.ts와 동일한 구조) -->
        <aside class="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
            <div class="h-16 flex items-center px-6 border-b border-gray-200">
                <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto mr-2">
                <span class="font-bold text-gray-800 tracking-tight">관리자 시스템</span>
            </div>
            <div class="flex-1 overflow-y-auto py-4">
                <nav class="px-4 space-y-6">
                    <div>
                        <a href="/admin" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <i class="fas fa-home w-5 h-5 mr-3 text-gray-400"></i>
                            대시보드
                        </a>
                    </div>
                    <div>
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">학사 관리</h3>
                        <ul class="space-y-1">
                            <li><a href="/admin/courses" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-book w-5 h-5 mr-3 text-gray-400"></i>교육과정 관리</a></li>
                            <li><a href="/admin/students" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-users w-5 h-5 mr-3 text-gray-400"></i>수강생 관리</a></li>
                            <li>
                                <a href="/admin/exams" class="flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition-colors">
                                    <i class="fas fa-file-alt w-5 h-5 mr-3 text-blue-500"></i>
                                    시험/문제 관리
                                </a>
                            </li>
                            <li><a href="/admin/grades" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-chart-line w-5 h-5 mr-3 text-gray-400"></i>성적/채점 관리</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">시험/문제 관리</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">LMS</span>
                        <a href="/" class="text-gray-500 hover:text-primary-600 transition"><i class="fas fa-external-link-alt mr-1"></i> 사이트 바로가기</a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 상단 액션 -->
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input type="text" id="searchInput" placeholder="시험 제목 검색..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <select id="courseFilter" class="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">전체 과정</option>
                        </select>
                    </div>
                    <button onclick="location.href='/admin/exams/create'" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                        <i class="fas fa-plus mr-2"></i> 시험 등록
                    </button>
                </div>

                <!-- 시험 목록 테이블 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험 제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제한시간</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="examList" class="bg-white divide-y divide-gray-200">
                            <!-- JS로 로드됨 -->
                            <tr>
                                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <script>
        // 초기 로드
        document.addEventListener('DOMContentLoaded', () => {
            loadExams();
            loadCoursesForFilter();
        });

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exams = await response.json();
                
                const tbody = document.getElementById('examList');
                if (exams.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">등록된 시험이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = exams.map(exam => \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#\${exam.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">\${exam.course_title || '-'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${exam.title}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${exam.time_limit_minutes}분</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${exam.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                \${exam.is_active ? '활성' : '비활성'}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick="location.href='/admin/exams/' + \${exam.id} + '/edit'" class="text-blue-600 hover:text-blue-900"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteExam(\${exam.id})" class="text-red-600 hover:text-red-900 ml-3"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('examList').innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        async function loadCoursesForFilter() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('courseFilter');
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function deleteExam(id) {
            if (!confirm('정말 이 시험을 삭제하시겠습니까? 포함된 모든 문제도 함께 삭제됩니다.')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (response.ok) {
                    alert('삭제되었습니다.');
                    loadExams();
                } else {
                    alert('삭제 실패');
                }
            } catch (e) {
                console.error(e);
                alert('오류 발생');
            }
        }
    </script>
</body>
</html>
`;

export const adminExamCreateHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 등록 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gray-800 px-8 py-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold text-white flex items-center">
                    <i class="fas fa-file-signature mr-3"></i> 새 시험 등록
                </h1>
                <button onclick="history.back()" class="text-gray-300 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-8">
                <form id="createExamForm" onsubmit="handleSubmit(event)">
                    <!-- 기본 정보 섹션 -->
                    <div class="mb-8 border-b border-gray-200 pb-8">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">1. 시험 기본 정보</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 제목</label>
                                <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="예: 3D 모델링 기초 중간평가">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">연관 과정</label>
                                <select name="course_id" id="courseSelect" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">과정 선택...</option>
                                    <!-- JS 로드 -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">제한 시간 (분)</label>
                                <input type="number" name="time_limit" value="60" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 설명</label>
                                <textarea name="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 문제 등록 섹션 -->
                    <div class="mb-8">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-gray-800">2. 문제 등록</h2>
                            <div class="flex gap-2">
                                <select id="questionTypeSelect" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                    <option value="multiple_choice">객관식</option>
                                    <option value="short_answer">단답형</option>
                                    <option value="essay">서술형</option>
                                </select>
                                <button type="button" onclick="addQuestion()" class="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium">
                                    <i class="fas fa-plus mr-1"></i> 문제 추가
                                </button>
                            </div>
                        </div>
                        
                        <div id="questionsContainer" class="space-y-6">
                            <!-- 동적 문제 카드 추가됨 -->
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button type="button" onclick="history.back()" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">취소</button>
                        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
                            <i class="fas fa-save mr-2"></i> 시험 저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        let questionCount = 0;

        document.addEventListener('DOMContentLoaded', () => {
            loadCourses();
            addQuestion(); // 기본 1개 추가
        });

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('courseSelect');
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        function addQuestion(type = null) {
            if (!type) {
                const select = document.getElementById('questionTypeSelect');
                type = select ? select.value : 'multiple_choice';
            }

            const container = document.getElementById('questionsContainer');
            const index = questionCount++;
            
            const div = document.createElement('div');
            div.className = 'question-card bg-gray-50 rounded-xl p-6 border border-gray-200 relative group';
            div.dataset.index = index;
            div.dataset.type = type;

            let answerHtml = '';
            let optionsHtml = '';

            if (type === 'multiple_choice') {
                optionsHtml = \`
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><input type="text" name="questions[\${index}][options][]" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 1"></div>
                        <div><input type="text" name="questions[\${index}][options][]" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 2"></div>
                        <div><input type="text" name="questions[\${index}][options][]" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 3"></div>
                        <div><input type="text" name="questions[\${index}][options][]" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 4"></div>
                    </div>
                \`;
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">정답 (1-4)</label>
                    <select name="questions[\${index}][correct_answer]" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="1">1번</option>
                        <option value="2">2번</option>
                        <option value="3">3번</option>
                        <option value="4">4번</option>
                    </select>
                \`;
            } else if (type === 'short_answer') {
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">정답 (단답형)</label>
                    <input type="text" name="questions[\${index}][correct_answer]" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="정답 텍스트 입력">
                \`;
            } else if (type === 'essay') {
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">모범 답안 / 가이드</label>
                    <textarea name="questions[\${index}][correct_answer]" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="채점 기준 등 입력"></textarea>
                \`;
            }

            div.innerHTML = \`
                <button type="button" onclick="removeQuestion(this)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <div class="mb-2">
                    <span class="px-2 py-1 bg-gray-200 text-xs rounded font-bold">\${type === 'multiple_choice' ? '객관식' : type === 'short_answer' ? '단답형' : '서술형'}</span>
                    <input type="hidden" name="questions[\${index}][question_type]" value="\${type}">
                </div>
                <div class="mb-4 pr-8">
                    <label class="block text-sm font-medium text-gray-700 mb-1">문제 내용</label>
                    <input type="text" name="questions[\${index}][question_text]" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="문제를 입력하세요">
                </div>
                \${optionsHtml}
                <div class="flex gap-4">
                    <div class="w-2/3">
                        \${answerHtml}
                    </div>
                    <div class="w-1/3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">배점</label>
                        <input type="number" name="questions[\${index}][points]" value="5" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            \`;

            container.appendChild(div);
        }

        function removeQuestion(btn) {
            const card = btn.closest('.question-card');
            if (document.querySelectorAll('.question-card').length > 1) {
                card.remove();
            } else {
                alert('최소 1개의 문제는 있어야 합니다.');
            }
        }

        async function handleSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            const questions = [];
            
            // Collect questions data
            const cards = document.querySelectorAll('.question-card');
            cards.forEach(card => {
                const index = card.dataset.index;
                const type = card.dataset.type;
                
                const qText = form.querySelector(\`input[name="questions[\${index}][question_text]"]\`).value;
                const points = form.querySelector(\`input[name="questions[\${index}][points]"]\`).value;
                let answer = '';
                let options = [];

                if (type === 'multiple_choice') {
                    const opts = form.querySelectorAll(\`input[name="questions[\${index}][options][]"]\`);
                    options = Array.from(opts).map(o => o.value);
                    answer = form.querySelector(\`select[name="questions[\${index}][correct_answer]"]\`).value;
                } else if (type === 'short_answer') {
                    answer = form.querySelector(\`input[name="questions[\${index}][correct_answer]"]\`).value;
                } else if (type === 'essay') {
                    answer = form.querySelector(\`textarea[name="questions[\${index}][correct_answer]"]\`).value;
                }

                questions.push({
                    question_text: qText,
                    question_type: type,
                    options: options,
                    correct_answer: answer,
                    points: parseInt(points)
                });
            });

            const payload = {
                title: formData.get('title'),
                course_id: formData.get('course_id'),
                description: formData.get('description'),
                time_limit: formData.get('time_limit'),
                questions: questions
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.success) {
                    alert('시험이 성공적으로 등록되었습니다.');
                    location.href = '/admin/exams';
                } else {
                    alert('등록 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('서버 통신 오류');
            }
        }
    </script>
</body>
</html>
`;

export const adminExamEditHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 수정 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gray-800 px-8 py-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold text-white flex items-center">
                    <i class="fas fa-edit mr-3"></i> 시험 수정
                </h1>
                <button onclick="history.back()" class="text-gray-300 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-8">
                <form id="editExamForm" onsubmit="handleSubmit(event)">
                    <!-- 기본 정보 섹션 -->
                    <div class="mb-8 border-b border-gray-200 pb-8">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">1. 시험 기본 정보</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 제목</label>
                                <input type="text" name="title" id="examTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">연관 과정</label>
                                <select name="course_id" id="courseSelect" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">과정 선택...</option>
                                    <!-- JS 로드 -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">제한 시간 (분)</label>
                                <input type="number" name="time_limit" id="examTimeLimit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
                                <select name="is_active" id="examStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="1">활성 (진행중)</option>
                                    <option value="0">비활성 (시험종료)</option>
                                </select>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">시험 설명</label>
                                <textarea name="description" id="examDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 문제 등록 섹션 -->
                    <div class="mb-8">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-gray-800">2. 문제 등록</h2>
                            <div class="flex gap-2">
                                <select id="questionTypeSelect" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                    <option value="multiple_choice">객관식</option>
                                    <option value="short_answer">단답형</option>
                                    <option value="essay">서술형</option>
                                </select>
                                <button type="button" onclick="addQuestion()" class="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium">
                                    <i class="fas fa-plus mr-1"></i> 문제 추가
                                </button>
                            </div>
                        </div>
                        
                        <div id="questionsContainer" class="space-y-6">
                            <!-- 동적 문제 카드 추가됨 -->
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button type="button" onclick="history.back()" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">취소</button>
                        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
                            <i class="fas fa-save mr-2"></i> 수정사항 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const examId = window.location.pathname.split('/')[3];
        let questionCount = 0;

        document.addEventListener('DOMContentLoaded', () => {
            loadCourses().then(() => {
                loadExamData();
            });
        });

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('courseSelect');
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function loadExamData() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams/' + examId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const exam = await response.json();
                
                document.getElementById('examTitle').value = exam.title;
                document.getElementById('courseSelect').value = exam.course_id;
                document.getElementById('examTimeLimit').value = exam.time_limit_minutes;
                document.getElementById('examStatus').value = exam.is_active ? '1' : '0';
                document.getElementById('examDescription').value = exam.description || '';

                // Load questions
                if (exam.questions && exam.questions.length > 0) {
                    exam.questions.forEach(q => {
                        addQuestion(q.question_type, q);
                    });
                } else {
                    addQuestion(); // 기본 1개
                }

            } catch (e) {
                console.error(e);
                alert('데이터 로드 실패');
            }
        }

        function addQuestion(type = null, data = null) {
            if (!type) {
                const select = document.getElementById('questionTypeSelect');
                type = select ? select.value : 'multiple_choice';
            }

            const container = document.getElementById('questionsContainer');
            const index = questionCount++;
            
            const div = document.createElement('div');
            div.className = 'question-card bg-gray-50 rounded-xl p-6 border border-gray-200 relative group';
            div.dataset.index = index;
            div.dataset.type = type;

            let answerHtml = '';
            let optionsHtml = '';

            // 데이터가 있으면 값 채우기
            const qText = data ? data.question_text : '';
            const points = data ? data.points : 5;
            const correct = data ? data.correct_answer : '';
            const opts = data ? (typeof data.options === 'string' ? JSON.parse(data.options) : data.options) : ['', '', '', ''];

            if (type === 'multiple_choice') {
                optionsHtml = \`
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><input type="text" name="questions[\${index}][options][]" value="\${opts[0] || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 1"></div>
                        <div><input type="text" name="questions[\${index}][options][]" value="\${opts[1] || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 2"></div>
                        <div><input type="text" name="questions[\${index}][options][]" value="\${opts[2] || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 3"></div>
                        <div><input type="text" name="questions[\${index}][options][]" value="\${opts[3] || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="보기 4"></div>
                    </div>
                \`;
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">정답 (1-4)</label>
                    <select name="questions[\${index}][correct_answer]" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="1" \${correct == 1 ? 'selected' : ''}>1번</option>
                        <option value="2" \${correct == 2 ? 'selected' : ''}>2번</option>
                        <option value="3" \${correct == 3 ? 'selected' : ''}>3번</option>
                        <option value="4" \${correct == 4 ? 'selected' : ''}>4번</option>
                    </select>
                \`;
            } else if (type === 'short_answer') {
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">정답 (단답형)</label>
                    <input type="text" name="questions[\${index}][correct_answer]" value="\${correct || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="정답 텍스트 입력">
                \`;
            } else if (type === 'essay') {
                answerHtml = \`
                    <label class="block text-sm font-medium text-gray-700 mb-1">모범 답안 / 가이드</label>
                    <textarea name="questions[\${index}][correct_answer]" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="채점 기준 등 입력">\${correct || ''}</textarea>
                \`;
            }

            div.innerHTML = \`
                <button type="button" onclick="removeQuestion(this)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <div class="mb-2">
                    <span class="px-2 py-1 bg-gray-200 text-xs rounded font-bold">\${type === 'multiple_choice' ? '객관식' : type === 'short_answer' ? '단답형' : '서술형'}</span>
                    <input type="hidden" name="questions[\${index}][question_type]" value="\${type}">
                </div>
                <div class="mb-4 pr-8">
                    <label class="block text-sm font-medium text-gray-700 mb-1">문제 내용</label>
                    <input type="text" name="questions[\${index}][question_text]" value="\${qText}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="문제를 입력하세요">
                </div>
                \${optionsHtml}
                <div class="flex gap-4">
                    <div class="w-2/3">
                        \${answerHtml}
                    </div>
                    <div class="w-1/3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">배점</label>
                        <input type="number" name="questions[\${index}][points]" value="\${points}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            \`;

            container.appendChild(div);
        }

        function removeQuestion(btn) {
            const card = btn.closest('.question-card');
            if (document.querySelectorAll('.question-card').length > 1) {
                card.remove();
            } else {
                alert('최소 1개의 문제는 있어야 합니다.');
            }
        }

        async function handleSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            const questions = [];
            
            const cards = document.querySelectorAll('.question-card');
            cards.forEach(card => {
                const index = card.dataset.index;
                const type = card.dataset.type;
                
                const qText = form.querySelector(\`input[name="questions[\${index}][question_text]"]\`).value;
                const points = form.querySelector(\`input[name="questions[\${index}][points]"]\`).value;
                let answer = '';
                let options = [];

                if (type === 'multiple_choice') {
                    const opts = form.querySelectorAll(\`input[name="questions[\${index}][options][]"]\`);
                    options = Array.from(opts).map(o => o.value);
                    answer = form.querySelector(\`select[name="questions[\${index}][correct_answer]"]\`).value;
                } else if (type === 'short_answer') {
                    answer = form.querySelector(\`input[name="questions[\${index}][correct_answer]"]\`).value;
                } else if (type === 'essay') {
                    answer = form.querySelector(\`textarea[name="questions[\${index}][correct_answer]"]\`).value;
                }

                questions.push({
                    question_text: qText,
                    question_type: type,
                    options: options,
                    correct_answer: answer,
                    points: parseInt(points)
                });
            });

            const payload = {
                title: formData.get('title'),
                course_id: formData.get('course_id'),
                description: formData.get('description'),
                time_limit: formData.get('time_limit'),
                is_active: formData.get('is_active'),
                questions: questions
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams/' + examId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.success) {
                    alert('시험이 성공적으로 수정되었습니다.');
                    location.href = '/admin/exams';
                } else {
                    alert('수정 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('서버 통신 오류');
            }
        }
    </script>
</body>
</html>
`;
