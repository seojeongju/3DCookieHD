import { teacherSidebar } from './components/teacher_sidebar';

export const teacherExamsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 출제/채점 - 강사 대시보드</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
        ${teacherSidebar('exams')}

        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">시험 출제/채점</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                    </div>
                </div>
            </header>

            <div class="p-8">
                <!-- 과정 선택 섹션 -->
                <div id="coursesSection">
                    <div class="mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">배정된 과정 선택</h2>
                        <p class="text-gray-600 mb-6">시험을 출제할 과정을 선택하세요.</p>
                    </div>
                    <div id="coursesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- 과정 카드들이 여기에 동적으로 추가됨 -->
                    </div>
                </div>

                <!-- 시험 목록 섹션 -->
                <div id="examsSection" class="hidden">
                    <div class="mb-6 flex items-center justify-between">
                        <div>
                            <button onclick="backToCourses()" class="text-gray-600 hover:text-gray-800 mb-2 flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> 과정 목록으로
                            </button>
                            <h2 id="selectedCourseTitle" class="text-xl font-bold text-gray-800"></h2>
                        </div>
                        <button onclick="openCreateExamModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                            <i class="fas fa-plus mr-2"></i> 시험 출제
                        </button>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험 제목</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제한시간</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="examsTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 시험 출제 모달 -->
    <div id="createExamModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 class="text-xl font-bold text-gray-800" id="examModalTitle">시험 출제</h3>
                <button onclick="closeModal('createExamModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="examForm" onsubmit="handleSaveExam(event)">
                    <input type="hidden" id="examId" name="id">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">시험 제목 <span class="text-red-500">*</span></label>
                            <input type="text" id="examTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">시험 설명</label>
                            <textarea id="examDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">제한시간 (분)</label>
                                <input type="number" id="examTimeLimit" value="60" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div class="flex items-center pt-8">
                                <input type="checkbox" id="examIsActive" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                <label for="examIsActive" class="ml-2 text-sm font-medium text-gray-700">활성화</label>
                            </div>
                        </div>

                        <div class="border-t border-gray-200 pt-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-lg font-bold text-gray-800">문제</h4>
                                <div class="flex gap-2">
                                    <select id="questionTypeSelect" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                        <option value="multiple_choice">객관식</option>
                                        <option value="short_answer">단답형</option>
                                        <option value="essay">서술형</option>
                                    </select>
                                    <button type="button" onclick="addQuestion()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                        <i class="fas fa-plus mr-1"></i> 문제 추가
                                    </button>
                                </div>
                            </div>
                            <div id="questionsContainer" class="space-y-4">
                                <!-- 문제들이 동적으로 추가됨 -->
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button type="button" onclick="closeModal('createExamModal')" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</button>
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-save mr-2"></i> 저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 채점 모달 -->
    <div id="gradeModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 class="text-xl font-bold text-gray-800">시험 채점</h3>
                <button onclick="closeModal('gradeModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <div id="gradeContent">
                    <!-- 채점 내용이 동적으로 로드됨 -->
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedCourseId = null;
        let selectedCourseTitle = '';
        let questionCounter = 0;
        let currentExamId = null;
        let currentSubmissionId = null;

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadCourses();
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
        }

        async function loadCourses() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const courses = result.success ? result.data : (result.data || []);
                const grid = document.getElementById('coursesGrid');
                
                if (courses.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">배정된 과정이 없습니다.</div>';
                    return;
                }

                grid.innerHTML = courses.map(course => \`
                    <div onclick="selectCourse(\${course.id}, '\${course.title.replace(/'/g, "\\'")}')" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition hover:border-blue-300">
                        <div class="flex items-start justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-800">\${course.title}</h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded">\${course.category || '일반'}</span>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex items-center">
                                <i class="fas fa-users w-5 text-gray-400"></i>
                                <span>수강생: \${course.current_students || 0}명</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar w-5 text-gray-400"></i>
                                <span>\${course.start_date ? new Date(course.start_date).toLocaleDateString() : '-'} ~ \${course.end_date ? new Date(course.end_date).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <button onclick="event.stopPropagation(); selectCourse(\${course.id}, '\${course.title.replace(/'/g, "\\'")}')" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                시험 관리하기
                            </button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Error loading courses:', error);
                document.getElementById('coursesGrid').innerHTML = '<div class="col-span-full text-center py-12 text-red-500">과정 목록을 불러오는데 실패했습니다.</div>';
            }
        }

        function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            selectedCourseTitle = courseTitle;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('examsSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').textContent = courseTitle;
            loadExams();
        }

        function backToCourses() {
            selectedCourseId = null;
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('examsSection').classList.add('hidden');
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const exams = result.success ? result.data : (result.data || []);
                const filteredExams = exams.filter(e => e.course_id === selectedCourseId);
                const tbody = document.getElementById('examsTableBody');
                
                if (filteredExams.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">등록된 시험이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = filteredExams.map(exam => \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">\${exam.title}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">\${exam.time_limit_minutes || 60}분</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full \${exam.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                \${exam.is_active ? '활성' : '비활성'}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">\${exam.created_at ? new Date(exam.created_at).toLocaleDateString() : '-'}</td>
                        <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <button onclick="viewExamStatus(\${exam.id})" class="text-green-600 hover:text-green-900" title="응시 현황 및 채점">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                            <button onclick="editExam(\${exam.id})" class="text-blue-600 hover:text-blue-900" title="수정">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteExam(\${exam.id})" class="text-red-600 hover:text-red-900" title="삭제">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('Error loading exams:', error);
                document.getElementById('examsTableBody').innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-red-500">시험 목록을 불러오는데 실패했습니다.</td></tr>';
            }
        }

        function openCreateExamModal() {
            currentExamId = null;
            document.getElementById('examModalTitle').textContent = '시험 출제';
            document.getElementById('examForm').reset();
            document.getElementById('examId').value = '';
            document.getElementById('examTimeLimit').value = '60';
            document.getElementById('examIsActive').checked = true;
            document.getElementById('questionsContainer').innerHTML = '';
            questionCounter = 0;
            addQuestion();
            document.getElementById('createExamModal').classList.remove('hidden');
        }

        function addQuestion() {
            const type = document.getElementById('questionTypeSelect').value;
            const qId = 'q_' + (questionCounter++);
            const container = document.getElementById('questionsContainer');
            
            let questionHtml = \`
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50" data-question-id="\${qId}">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-sm font-bold text-gray-700">문제 #\${questionCounter}</span>
                        <button type="button" onclick="removeQuestion('\${qId}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">문제 유형</label>
                            <select class="question-type w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" onchange="updateQuestionType('\${qId}', this.value)">
                                <option value="multiple_choice" \${type === 'multiple_choice' ? 'selected' : ''}>객관식</option>
                                <option value="short_answer" \${type === 'short_answer' ? 'selected' : ''}>단답형</option>
                                <option value="essay" \${type === 'essay' ? 'selected' : ''}>서술형</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">문제 내용 <span class="text-red-500">*</span></label>
                            <textarea class="question-text w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" rows="2" required placeholder="문제를 입력하세요"></textarea>
                        </div>
                        <div id="options_\${qId}" class="\${type === 'multiple_choice' ? '' : 'hidden'}">
                            <label class="block text-xs font-medium text-gray-600 mb-1">보기 (각 줄에 하나씩)</label>
                            <textarea class="question-options w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" rows="4" placeholder="보기1\n보기2\n보기3\n보기4"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">정답 <span class="text-red-500">*</span></label>
                                <input type="text" class="question-answer w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" required placeholder="정답 입력">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">배점</label>
                                <input type="number" class="question-points w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" value="5" min="1">
                            </div>
                        </div>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', questionHtml);
        }

        function updateQuestionType(qId, type) {
            const optionsDiv = document.getElementById('options_' + qId);
            if (type === 'multiple_choice') {
                optionsDiv.classList.remove('hidden');
            } else {
                optionsDiv.classList.add('hidden');
            }
        }

        function removeQuestion(qId) {
            document.querySelector(\`[data-question-id="\${qId}"]\`).remove();
        }

        async function editExam(examId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('시험 정보를 불러오는데 실패했습니다.');
                    return;
                }
                
                const exam = result.data;
                currentExamId = examId;
                document.getElementById('examModalTitle').textContent = '시험 수정';
                document.getElementById('examId').value = examId;
                document.getElementById('examTitle').value = exam.title || '';
                document.getElementById('examDescription').value = exam.description || '';
                document.getElementById('examTimeLimit').value = exam.time_limit_minutes || 60;
                document.getElementById('examIsActive').checked = exam.is_active === 1;
                
                const container = document.getElementById('questionsContainer');
                container.innerHTML = '';
                questionCounter = 0;
                
                if (exam.questions && exam.questions.length > 0) {
                    exam.questions.forEach((q, idx) => {
                        const qId = 'q_' + (questionCounter++);
                        const type = q.question_type || 'multiple_choice';
                        const options = Array.isArray(q.options) ? q.options.join('\\n') : '';
                        
                        let questionHtml = \`
                            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50" data-question-id="\${qId}">
                                <div class="flex justify-between items-start mb-3">
                                    <span class="text-sm font-bold text-gray-700">문제 #\${idx + 1}</span>
                                    <button type="button" onclick="removeQuestion('\${qId}')" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-600 mb-1">문제 유형</label>
                                        <select class="question-type w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" onchange="updateQuestionType('\${qId}', this.value)">
                                            <option value="multiple_choice" \${type === 'multiple_choice' ? 'selected' : ''}>객관식</option>
                                            <option value="short_answer" \${type === 'short_answer' ? 'selected' : ''}>단답형</option>
                                            <option value="essay" \${type === 'essay' ? 'selected' : ''}>서술형</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-600 mb-1">문제 내용 <span class="text-red-500">*</span></label>
                                        <textarea class="question-text w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" rows="2" required>\${q.question_text || ''}</textarea>
                                    </div>
                                    <div id="options_\${qId}" class="\${type === 'multiple_choice' ? '' : 'hidden'}">
                                        <label class="block text-xs font-medium text-gray-600 mb-1">보기 (각 줄에 하나씩)</label>
                                        <textarea class="question-options w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" rows="4">\${options}</textarea>
                                    </div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">정답 <span class="text-red-500">*</span></label>
                                            <input type="text" class="question-answer w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" required value="\${q.correct_answer || ''}">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">배점</label>
                                            <input type="number" class="question-points w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" value="\${q.points || 5}" min="1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        \`;
                        container.insertAdjacentHTML('beforeend', questionHtml);
                    });
                } else {
                    addQuestion();
                }
                
                document.getElementById('createExamModal').classList.remove('hidden');
            } catch (error) {
                console.error('Error loading exam:', error);
                alert('시험 정보를 불러오는데 실패했습니다.');
            }
        }

        async function handleSaveExam(e) {
            e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                const questions = [];
                document.querySelectorAll('[data-question-id]').forEach(qEl => {
                    const type = qEl.querySelector('.question-type').value;
                    const text = qEl.querySelector('.question-text').value;
                    const answer = qEl.querySelector('.question-answer').value;
                    const points = parseInt(qEl.querySelector('.question-points').value) || 5;
                    let options = [];
                    
                    if (type === 'multiple_choice') {
                        const optionsText = qEl.querySelector('.question-options').value;
                        options = optionsText.split('\\n').filter(o => o.trim()).map(o => o.trim());
                    }
                    
                    questions.push({
                        question_text: text,
                        question_type: type,
                        options: options,
                        correct_answer: answer,
                        points: points
                    });
                });

                const data = {
                    title: document.getElementById('examTitle').value,
                    course_id: selectedCourseId,
                    description: document.getElementById('examDescription').value,
                    time_limit: parseInt(document.getElementById('examTimeLimit').value) || 60,
                    is_active: document.getElementById('examIsActive').checked ? 1 : 0,
                    questions: questions
                };

                const examId = document.getElementById('examId').value;
                const url = examId ? \`/api/exams/\${examId}\` : '/api/exams';
                const method = examId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success || response.ok) {
                    alert(examId ? '시험이 수정되었습니다.' : '시험이 등록되었습니다.');
                    closeModal('createExamModal');
                    loadExams();
                } else {
                    alert('오류: ' + (result.error || '저장 실패'));
                }
            } catch (error) {
                console.error('Error saving exam:', error);
                alert('시험 저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteExam(examId) {
            if (!confirm('정말 이 시험을 삭제하시겠습니까? 포함된 모든 문제와 제출 내역도 함께 삭제됩니다.')) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const result = await response.json();
                if (result.success || response.ok) {
                    alert('삭제되었습니다.');
                    loadExams();
                } else {
                    alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function viewExamStatus(examId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}/status\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('시험 현황을 불러오는데 실패했습니다.');
                    return;
                }
                
                const { exam, stats, students } = result.data;
                currentExamId = examId;
                
                let html = \`
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">\${exam.title}</h4>
                        <div class="grid grid-cols-3 gap-4 mb-4">
                            <div class="bg-blue-50 rounded-lg p-4">
                                <div class="text-sm text-gray-600">전체 수강생</div>
                                <div class="text-2xl font-bold text-blue-600">\${stats.total_students}</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4">
                                <div class="text-sm text-gray-600">제출 완료</div>
                                <div class="text-2xl font-bold text-green-600">\${stats.submitted_count}</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-4">
                                <div class="text-sm text-gray-600">평균 점수</div>
                                <div class="text-2xl font-bold text-purple-600">\${stats.average_score.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">학생명</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제출 상태</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">점수</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                \`;
                
                students.forEach(student => {
                    const statusBadge = student.has_submitted 
                        ? (student.status === 'graded' 
                            ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">채점 완료</span>'
                            : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">제출 완료</span>')
                        : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">미제출</span>';
                    
                    html += \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm font-medium text-gray-900">\${student.name}</td>
                            <td class="px-4 py-3 text-sm text-gray-500">\${student.email}</td>
                            <td class="px-4 py-3">\${statusBadge}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">\${student.score !== null ? student.score + '점' : '-'}</td>
                            <td class="px-4 py-3 text-right">
                                \${student.has_submitted 
                                    ? \`<button onclick="gradeSubmission(\${examId}, \${student.submission_id}, '\${student.name.replace(/'/g, "\\'")}')" class="text-blue-600 hover:text-blue-900 text-sm">
                                        <i class="fas fa-check-circle mr-1"></i> 채점하기
                                    </button>\`
                                    : '<span class="text-gray-400 text-sm">-</span>'
                                }
                            </td>
                        </tr>
                    \`;
                });
                
                html += \`
                            </tbody>
                        </table>
                    </div>
                \`;
                
                document.getElementById('gradeContent').innerHTML = html;
                document.getElementById('gradeModal').classList.remove('hidden');
            } catch (error) {
                console.error('Error loading exam status:', error);
                alert('시험 현황을 불러오는데 실패했습니다.');
            }
        }

        async function gradeSubmission(examId, submissionId, studentName) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/exams/\${examId}/submissions/\${submissionId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('제출 내역을 불러오는데 실패했습니다.');
                    return;
                }
                
                const { submission, questions } = result.data;
                currentSubmissionId = submissionId;
                
                let html = \`
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">\${studentName} 님의 답안</h4>
                        <div class="text-sm text-gray-600 mb-4">
                            제출일: \${submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '-'} | 
                            현재 점수: <span class="font-bold text-blue-600">\${submission.total_score || 0}점</span>
                        </div>
                    </div>
                    <form id="gradeForm" onsubmit="handleGradeSubmit(event)">
                        <div class="space-y-6">
                \`;
                
                questions.forEach((q, idx) => {
                    const isEssay = q.question_type === 'essay';
                    const options = Array.isArray(q.options) ? q.options : [];
                    const studentAnswer = q.student_answer || '';
                    const currentScore = q.score_awarded || 0;
                    const maxPoints = q.points || 0;
                    
                    html += \`
                        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span class="text-sm font-bold text-gray-700">문제 #\${idx + 1}</span>
                                    <span class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">\${isEssay ? '서술형' : (q.question_type === 'multiple_choice' ? '객관식' : '단답형')}</span>
                                    <span class="ml-2 text-xs text-gray-500">배점: \${maxPoints}점</span>
                                </div>
                                \${!isEssay ? \`<span class="px-2 py-1 text-xs rounded \${q.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">\${q.is_correct ? '정답' : '오답'}</span>\` : ''}
                            </div>
                            <div class="mb-3">
                                <div class="text-sm font-medium text-gray-700 mb-1">문제</div>
                                <div class="text-sm text-gray-900 bg-white p-3 rounded border">\${q.question_text}</div>
                            </div>
                            \${options.length > 0 ? \`
                                <div class="mb-3">
                                    <div class="text-sm font-medium text-gray-700 mb-1">보기</div>
                                    <div class="text-sm text-gray-900 bg-white p-3 rounded border">
                                        \${options.map((opt, i) => \`<div>\${String.fromCharCode(65 + i)}. \${opt}</div>\`).join('')}
                                    </div>
                                </div>
                            \` : ''}
                            <div class="mb-3">
                                <div class="text-sm font-medium text-gray-700 mb-1">정답</div>
                                <div class="text-sm text-gray-900 bg-green-50 p-3 rounded border border-green-200">\${q.correct_answer}</div>
                            </div>
                            <div class="mb-3">
                                <div class="text-sm font-medium text-gray-700 mb-1">학생 답안</div>
                                <div class="text-sm text-gray-900 bg-white p-3 rounded border min-h-[60px] whitespace-pre-wrap">\${studentAnswer || '(답변 없음)'}</div>
                            </div>
                            \${isEssay ? \`
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">점수 (0 ~ \${maxPoints}점)</label>
                                    <input type="number" class="question-score w-full px-3 py-2 border border-gray-300 rounded-lg" 
                                           data-question-id="\${q.id}" 
                                           min="0" max="\${maxPoints}" 
                                           value="\${currentScore}" 
                                           step="0.5">
                                </div>
                            \` : \`
                                <div class="text-sm text-gray-600">
                                    획득 점수: <span class="font-bold \${q.is_correct ? 'text-green-600' : 'text-red-600'}">\${currentScore}점</span> / \${maxPoints}점
                                </div>
                            \`}
                        </div>
                    \`;
                });
                
                html += \`
                        </div>
                        <div class="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button type="button" onclick="closeModal('gradeModal')" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</button>
                            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                <i class="fas fa-save mr-2"></i> 채점 저장
                            </button>
                        </div>
                    </form>
                \`;
                
                document.getElementById('gradeContent').innerHTML = html;
            } catch (error) {
                console.error('Error loading submission:', error);
                alert('제출 내역을 불러오는데 실패했습니다.');
            }
        }

        async function handleGradeSubmit(e) {
            e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                const questionScores = {};
                document.querySelectorAll('.question-score').forEach(input => {
                    const qId = input.getAttribute('data-question-id');
                    const score = parseFloat(input.value) || 0;
                    questionScores[qId] = score;
                });

                const response = await fetch(\`/api/exams/\${currentExamId}/grade\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        submission_id: currentSubmissionId,
                        question_scores: questionScores
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('채점이 완료되었습니다.');
                    closeModal('gradeModal');
                    viewExamStatus(currentExamId);
                } else {
                    alert('오류: ' + (result.error || '채점 실패'));
                }
            } catch (error) {
                console.error('Error grading:', error);
                alert('채점 저장 중 오류가 발생했습니다.');
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }
    </script>
</body>
</html>
`;
