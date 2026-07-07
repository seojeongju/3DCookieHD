import { lmsHeaderHtml } from './components/lms_header';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsAssignmentsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>과제 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="${LMS_SHELL_ROOT_CLASS}">
        ${sidebar}
        
        <div class="${LMS_SHELL_COLUMN_CLASS}">
            ${lmsFixedHeaderBlock(lmsHeaderHtml('assignments'))}
            ${lmsScrollMainOpen()}

    <!-- 서브 헤더 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">과제 관리</h2>
                <button onclick="openCreateModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                    <i class="fas fa-plus mr-2"></i> 과제 등록
                </button>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <!-- 통계 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-500">전체 과제</h3>
                    <span class="p-2 bg-blue-100 text-blue-600 rounded-lg"><i class="fas fa-tasks"></i></span>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="stat-total">0</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-500">진행 중</h3>
                    <span class="p-2 bg-green-100 text-green-600 rounded-lg"><i class="fas fa-clock"></i></span>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="stat-active">0</div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-500">평균 제출률</h3>
                    <span class="p-2 bg-purple-100 text-purple-600 rounded-lg"><i class="fas fa-chart-line"></i></span>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="stat-submission-rate">0%</div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-500">미채점 과제</h3>
                    <span class="p-2 bg-orange-100 text-orange-600 rounded-lg"><i class="fas fa-exclamation-circle"></i></span>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="stat-ungraded">0</div>
            </div>
        </div>

        <!-- 과제 목록 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h3 class="font-bold text-lg text-gray-800">과제 목록</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">제출현황</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">채점현황</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody id="assignmentList" class="bg-white divide-y divide-gray-200">
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

    <!-- 과제 등록/수정 모달 -->
    <div id="assignmentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all scale-100">
            <div class="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">과제 등록</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <form id="assignmentForm" onsubmit="handleSubmit(event)" class="p-6 space-y-4">
                <input type="hidden" id="assignmentId">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">과제 제목 <span class="text-red-500">*</span></label>
                    <input type="text" id="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 1주차 학습 과제">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">과제 설명</label>
                    <textarea id="description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="과제에 대한 상세 설명을 입력하세요"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">마감일 <span class="text-red-500">*</span></label>
                        <input type="datetime-local" id="dueDate" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">배점</label>
                        <input type="number" id="maxScore" value="100" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">첨부파일 URL</label>
                    <input type="url" id="attachmentUrl" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                    <p class="text-xs text-gray-500 mt-1">파일 공유 링크를 입력하세요 (Google Drive, Dropbox 등)</p>
                </div>
                <div class="pt-6 flex justify-end space-x-3">
                    <button type="button" onclick="closeModal()" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">취소</button>
                    <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 제출 목록 조회 모달 -->
    <div id="submissionsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
                <h3 class="text-xl font-bold text-gray-800" id="submissionsTitle">제출 현황</h3>
                <button onclick="closeSubmissionsModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">학생명</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제출일시</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">점수</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody id="submissionsList" class="bg-white divide-y divide-gray-200">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 채점 모달 -->
    <div id="gradeModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-800">과제 채점</h3>
                <button onclick="closeGradeModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <input type="hidden" id="gradeSubmissionId">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-bold text-gray-700 mb-2">제출 내용</h4>
                    <div id="submissionContent" class="text-sm text-gray-600 whitespace-pre-wrap"></div>
                    <div id="submissionAttachment" class="mt-2"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">점수 <span class="text-red-500">*</span></label>
                    <input type="number" id="score" min="0" max="100" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">피드백</label>
                    <textarea id="feedback" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="학생에게 전달할 피드백을 입력하세요"></textarea>
                </div>
                <div class="pt-4 flex justify-end space-x-3">
                    <button onclick="closeGradeModal()" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">취소</button>
                    <button onclick="submitGrade()" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">채점 완료</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let courseId = null;
        let courseType = '';
        let currentAssignmentId = null;

        document.addEventListener('DOMContentLoaded', () => {
            const pathParts = window.location.pathname.split('/');
            const courseIndex = pathParts.indexOf('courses');
            const _sidQ = new URLSearchParams(window.location.search).get('session_id');
            if (_sidQ) {
                courseId = _sidQ;
            } else if (courseIndex !== -1 && pathParts[courseIndex + 1]) {
                courseId = pathParts[courseIndex + 1];
            }
            courseType = (new URLSearchParams(window.location.search).get('type') || '').toLowerCase();
            if (courseId) loadAssignments();
        });

        async function loadAssignments() {
            if (!courseId) return;

            try {
                const url = \`/api/assignments/courses/\${courseId}\${courseType === 'hrd' ? '?type=hrd' : ''}\`;
                const response = await fetch(url, { headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') } });
                const result = await response.json();

                if (!result.success) throw new Error(result.error);

                const assignments = result.data || [];
                updateStats(assignments);
                renderAssignments(assignments);
            } catch (e) {
                console.error('Failed to load assignments:', e);
                document.getElementById('assignmentList').innerHTML = 
                    '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">과제 목록을 불러오는데 실패했습니다.</td></tr>';
            }
        }

        function updateStats(assignments) {
            const total = assignments.length;
            const now = new Date();
            const active = assignments.filter(a => new Date(a.due_date) > now).length;
            
            let totalSubmissions = 0, totalGraded = 0, totalUngraded = 0;
            assignments.forEach(a => {
                totalSubmissions += a.submission_count || 0;
                totalGraded += a.graded_count || 0;
                totalUngraded += (a.submission_count || 0) - (a.graded_count || 0);
            });

            const submissionRate = total > 0 ? Math.round((totalSubmissions / (total * 20)) * 100) : 0;

            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-active').textContent = active;
            document.getElementById('stat-submission-rate').textContent = submissionRate + '%';
            document.getElementById('stat-ungraded').textContent = totalUngraded;
        }

        function renderAssignments(assignments) {
            const tbody = document.getElementById('assignmentList');

            if (assignments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500"><i class="far fa-folder-open text-3xl mb-3 text-gray-300"></i><br>등록된 과제가 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = assignments.map(a => {
                const dueDate = new Date(a.due_date);
                const isActive = dueDate > new Date();
                const statusBadge = isActive 
                    ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">진행중</span>'
                    : '<span class="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold">마감</span>';

                const submissionRate = a.submission_count && a.submission_count > 0 
                    ? Math.round((a.submission_count / 20) * 100) 
                    : 0;

                return \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4">
                            <div class="font-bold text-gray-800">\${a.title}</div>
                            <div class="text-xs text-gray-500 mt-1">\${a.description ? a.description.substring(0, 50) + '...' : '-'}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">\${new Date(a.due_date).toLocaleString('ko-KR')}</td>
                        <td class="px-6 py-4 text-center">
                            <div class="text-sm font-bold text-gray-700">\${a.submission_count || 0}/20</div>
                            <div class="text-xs text-gray-400">(\${submissionRate}%)</div>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="text-sm font-bold text-gray-700">\${a.graded_count || 0}/\${a.submission_count || 0}</div>
                        </td>
                        <td class="px-6 py-4 text-center">\${statusBadge}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <button onclick='viewSubmissions(\${a.id}, "\${a.title}")' class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs transition">
                                <i class="fas fa-list mr-1"></i>제출현황
                            </button>
                            <button onclick='editAssignment(\${JSON.stringify(a).replace(/'/g, "&#39;")})' class="text-gray-400 hover:text-blue-600 transition p-1">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteAssignment(\${a.id})" class="text-gray-400 hover:text-red-600 transition p-1">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function openCreateModal() {
            document.getElementById('assignmentForm').reset();
            document.getElementById('assignmentId').value = '';
            document.getElementById('modalTitle').textContent = '과제 등록';
            document.getElementById('assignmentModal').classList.remove('hidden');
        }

        function editAssignment(assignment) {
            document.getElementById('assignmentId').value = assignment.id;
            document.getElementById('title').value = assignment.title;
            document.getElementById('description').value = assignment.description || '';
            document.getElementById('dueDate').value = assignment.due_date.replace(' ', 'T').substring(0, 16);
            document.getElementById('maxScore').value = assignment.max_score || 100;
            document.getElementById('attachmentUrl').value = assignment.attachment_url || '';
            document.getElementById('modalTitle').textContent = '과제 수정';
            document.getElementById('assignmentModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('assignmentModal').classList.add('hidden');
        }

        async function handleSubmit(e) {
            e.preventDefault();

            const id = document.getElementById('assignmentId').value;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const data = {
                course_id: courseType === 'hrd' ? null : parseInt(courseId),
                session_id: courseType === 'hrd' ? parseInt(courseId) : null,
                type: courseType === 'hrd' ? 'hrd' : undefined,
                teacher_id: user.id || null,
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                due_date: document.getElementById('dueDate').value.replace('T', ' '),
                max_score: parseInt(document.getElementById('maxScore').value) || 100,
                attachment_url: document.getElementById('attachmentUrl').value || null
            };

            try {
                const url = id ? \`/api/assignments/\${id}\` : '/api/assignments';
                const method = id ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    closeModal();
                    loadAssignments();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error('Save error:', e);
                alert('오류가 발생했습니다.');
            }
        }

        async function deleteAssignment(id) {
            if (!confirm('정말 삭제하시겠습니까?')) return;

            try {
                const response = await fetch(\`/api/assignments/\${id}\`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.success) {
                    loadAssignments();
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (e) {
                console.error('Delete error:', e);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        async function viewSubmissions(assignmentId, title) {
            currentAssignmentId = assignmentId;
            document.getElementById('submissionsTitle').textContent = title + ' - 제출 현황';
            document.getElementById('submissionsModal').classList.remove('hidden');

            try {
                const response = await fetch(\`/api/assignments/\${assignmentId}/submissions\`);
                const result = await response.json();

                if (!result.success) throw new Error(result.error);

                const submissions = result.data || [];
                const tbody = document.getElementById('submissionsList');

                if (submissions.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">제출된 과제가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = submissions.map(s => {
                    const statusBadge = s.status === 'graded'
                        ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">채점완료</span>'
                        : s.status === 'late'
                        ? '<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">지각제출</span>'
                        : '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">제출완료</span>';

                    return \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm font-medium text-gray-800">\${s.student_name}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">\${new Date(s.submitted_at).toLocaleString('ko-KR')}</td>
                            <td class="px-4 py-3 text-center">\${statusBadge}</td>
                            <td class="px-4 py-3 text-center">
                                <span class="text-sm font-bold \${s.score ? 'text-blue-600' : 'text-gray-400'}">\${s.score || '-'}</span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick='gradeSubmission(\${JSON.stringify(s).replace(/'/g, "&#39;")})' class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold">
                                    <i class="fas fa-pen mr-1"></i>채점
                                </button>
                            </td>
                        </tr>
                    \`;
                }).join('');
            } catch (e) {
                console.error('Failed to load submissions:', e);
            }
        }

        function closeSubmissionsModal() {
            document.getElementById('submissionsModal').classList.add('hidden');
        }

        function gradeSubmission(submission) {
            document.getElementById('gradeSubmissionId').value = submission.id;
            document.getElementById('submissionContent').textContent = submission.content || '(제출 내용 없음)';
            
            if (submission.attachment_url) {
                document.getElementById('submissionAttachment').innerHTML = \`
                    <a href="\${submission.attachment_url}" target="_blank" class="text-blue-600 hover:underline text-sm">
                        <i class="fas fa-paperclip mr-1"></i>첨부파일 보기
                    </a>
                \`;
            } else {
                document.getElementById('submissionAttachment').innerHTML = '';
            }

            document.getElementById('score').value = submission.score || '';
            document.getElementById('feedback').value = submission.feedback || '';
            document.getElementById('gradeModal').classList.remove('hidden');
        }

        function closeGradeModal() {
            document.getElementById('gradeModal').classList.add('hidden');
        }

        async function submitGrade() {
            const submissionId = document.getElementById('gradeSubmissionId').value;
            const score = parseInt(document.getElementById('score').value);
            const feedback = document.getElementById('feedback').value;
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            try {
                const response = await fetch(\`/api/assignments/submissions/\${submissionId}/grade\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score, feedback, graded_by: user.id })
                });

                const result = await response.json();
                if (result.success) {
                    closeGradeModal();
                    viewSubmissions(currentAssignmentId, document.getElementById('submissionsTitle').textContent.split(' - ')[0]);
                } else {
                    alert('채점 실패: ' + result.error);
                }
            } catch (e) {
                console.error('Grade error:', e);
                alert('채점 중 오류가 발생했습니다.');
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
