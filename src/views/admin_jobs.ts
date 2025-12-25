import { hrdSidebar } from './components/hrd_sidebar';

export const adminJobsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채용공고 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('jobs')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">채용공고 관리</h2>
                    <span class="ml-4 text-sm text-gray-500">등록된 채용공고를 조회하고 관리합니다.</span>
                </div>
                <button onclick="openModal('createJobModal')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium">
                    <i class="fas fa-plus mr-2"></i> 새 공고 등록
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
        <!-- 필터 및 검색 -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex gap-4">
                <select id="statusFilter" onchange="loadJobs()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">전체 상태</option>
                    <option value="active">모집중 (Active)</option>
                    <option value="closed">마감 (Closed)</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button onclick="loadJobs()" class="p-2 text-gray-600 hover:text-blue-600">
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
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목 / 회사</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고용형태</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="jobsTableBody" class="bg-white divide-y divide-gray-200">
                    <!-- 데이터가 로드되면 여기에 표시됩니다 -->
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- 페이지네이션 (추후 구현) -->
        <div class="mt-4 flex justify-center">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <!-- 페이지네이션 버튼이 여기에 들어갈 수 있습니다 -->
            </nav>
        </div>
    </div>

    <!-- 채용공고 등록/수정 모달 -->
    <div id="createJobModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">채용공고 등록</h3>
                <button onclick="closeModal('createJobModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createJobForm" onsubmit="handleSaveJob(event)">
                    <input type="hidden" name="id" id="jobId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">제목</label>
                            <input type="text" name="title" id="jobTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">회사명</label>
                                <input type="text" name="company" id="jobCompany" value="와우쓰리디홍대센터" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">고용 형태</label>
                                <select name="job_type" id="jobType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="아르바이트">아르바이트</option>
                                    <option value="인턴">인턴</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">근무지</label>
                                <input type="text" name="location" id="jobLocation" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">급여</label>
                                <input type="text" name="salary" id="jobSalary" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">상태</label>
                            <select name="status" id="jobStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="active">모집중 (Active)</option>
                                <option value="closed">마감 (Closed)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">자격 요건</label>
                            <textarea name="requirements" id="jobRequirements" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">상세 내용</label>
                            <textarea name="description" id="jobDescription" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createJobModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // 페이지 로드 시 목록 조회
        document.addEventListener('DOMContentLoaded', loadJobs);

        function openModal(id, job = null) {
            const modal = document.getElementById(id);
            const form = document.getElementById('createJobForm');
            const title = document.getElementById('modalTitle');
            
            if (job) {
                // 수정 모드
                title.textContent = '채용공고 수정';
                document.getElementById('jobId').value = job.id;
                document.getElementById('jobTitle').value = job.title;
                document.getElementById('jobCompany').value = job.company;
                document.getElementById('jobType').value = job.job_type;
                document.getElementById('jobLocation').value = job.location;
                document.getElementById('jobSalary').value = job.salary;
                document.getElementById('jobStatus').value = job.status;
                document.getElementById('jobRequirements').value = job.requirements;
                document.getElementById('jobDescription').value = job.description;
            } else {
                // 등록 모드
                title.textContent = '채용공고 등록';
                form.reset();
                document.getElementById('jobId').value = '';
                document.getElementById('jobCompany').value = '와우쓰리디홍대센터';
                document.getElementById('jobStatus').value = 'active';
            }
            
            modal.classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        async function loadJobs() {
            const status = document.getElementById('statusFilter').value;
            let url = '/api/jobs?';
            if (status) url += 'status=' + status;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('jobsTableBody');
                
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 채용공고가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(job => \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                                job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }">
                                \${job.status === 'active' ? '모집중' : '마감'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${job.title}</div>
                            <div class="text-sm text-gray-500">\${job.company}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${job.job_type || '-'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${job.location || '-'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick='editJob(\${JSON.stringify(job).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-edit"></i> 수정
                            </button>
                            <button onclick="deleteJob(\${job.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    </tr>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('jobsTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function editJob(job) {
            openModal('createJobModal', job);
        }

        async function handleSaveJob(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;
            
            try {
                const token = localStorage.getItem('token');
                const url = id ? '/api/jobs/' + id : '/api/jobs';
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
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    closeModal('createJobModal');
                    loadJobs(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteJob(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobs/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadJobs(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    </script>
        </main>
    </div>
</div>
</body>
</html>
`;
