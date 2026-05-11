import { hrdSidebar } from './components/hrd_sidebar';

export const adminJobseekersListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>구직정보 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('jobseekers')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">구직정보</h2>
                    <span class="ml-4 text-sm text-gray-500">구직(인재풀) 정보를 등록·조회·수정합니다.</span>
                </div>
                <button onclick="openModal('createJobseekerModal')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm font-medium">
                    <i class="fas fa-plus mr-2"></i> 구직정보 등록
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
        <!-- 필터 및 검색 -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex gap-4 items-center">
                <select id="statusFilter" onchange="loadJobseekers()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">전체 상태</option>
                    <option value="active">구직중 (Active)</option>
                    <option value="hired">채용됨 (Hired)</option>
                    <option value="inactive">비활성 (Inactive)</option>
                </select>
                <div class="relative">
                    <input type="text" id="searchInput" placeholder="이름, 연락처 검색" onkeyup="if(event.key === 'Enter') loadJobseekers()" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="loadJobseekers()" class="p-2 text-gray-600 hover:text-blue-600">
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
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름 / 생년월일</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보유 기술</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="jobseekersTableBody" class="bg-white divide-y divide-gray-200">
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

    <!-- 구직정보 등록/수정 모달 -->
    <div id="createJobseekerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">구직정보 등록</h3>
                <button onclick="closeModal('createJobseekerModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="createJobseekerForm" onsubmit="handleSaveJobseeker(event)">
                    <input type="hidden" name="id" id="jobseekerId">
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">이름</label>
                                <input type="text" name="name" id="jobseekerName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">생년월일</label>
                                <input type="date" name="birth_date" id="jobseekerBirthDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">연락처</label>
                                <input type="text" name="phone" id="jobseekerPhone" required placeholder="010-0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">이메일</label>
                                <input type="email" name="email" id="jobseekerEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">주소</label>
                            <input type="text" name="address" id="jobseekerAddress" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">학력</label>
                            <input type="text" name="education" id="jobseekerEducation" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">상태</label>
                            <select name="status" id="jobseekerStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="active">구직중 (Active)</option>
                                <option value="hired">채용됨 (Hired)</option>
                                <option value="inactive">비활성 (Inactive)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">경력 사항</label>
                            <textarea name="career" id="jobseekerCareer" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">보유 기술</label>
                            <textarea name="skills" id="jobseekerSkills" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                             <div>
                                <label class="block text-gray-700 font-medium mb-2">이력서 URL</label>
                                <input type="text" name="resume_file" id="jobseekerResume" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">포트폴리오 URL</label>
                                <input type="text" name="portfolio_file" id="jobseekerPortfolio" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">관리자 메모</label>
                            <textarea name="memo" id="jobseekerMemo" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createJobseekerModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // 페이지 로드 시 목록 조회
        document.addEventListener('DOMContentLoaded', loadJobseekers);

        function openModal(id, jobseeker = null) {
            const modal = document.getElementById(id);
            const form = document.getElementById('createJobseekerForm');
            const title = document.getElementById('modalTitle');
            
            if (jobseeker) {
                // 수정 모드
                title.textContent = '구직정보 수정';
                document.getElementById('jobseekerId').value = jobseeker.id;
                document.getElementById('jobseekerName').value = jobseeker.name;
                document.getElementById('jobseekerBirthDate').value = jobseeker.birth_date || '';
                document.getElementById('jobseekerPhone').value = jobseeker.phone;
                document.getElementById('jobseekerEmail').value = jobseeker.email || '';
                document.getElementById('jobseekerAddress').value = jobseeker.address || '';
                document.getElementById('jobseekerEducation').value = jobseeker.education || '';
                document.getElementById('jobseekerStatus').value = jobseeker.status;
                document.getElementById('jobseekerCareer').value = jobseeker.career || '';
                document.getElementById('jobseekerSkills').value = jobseeker.skills || '';
                document.getElementById('jobseekerResume').value = jobseeker.resume_file || '';
                document.getElementById('jobseekerPortfolio').value = jobseeker.portfolio_file || '';
                document.getElementById('jobseekerMemo').value = jobseeker.memo || '';
            } else {
                // 등록 모드
                title.textContent = '구직정보 등록';
                form.reset();
                document.getElementById('jobseekerId').value = '';
                document.getElementById('jobseekerStatus').value = 'active';
            }
            
            modal.classList.remove('hidden');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        async function loadJobseekers() {
            const status = document.getElementById('statusFilter').value;
            const search = document.getElementById('searchInput').value;
            
            let url = '/api/jobseekers?';
            if (status) url += 'status=' + status + '&';
            if (search) url += 'search=' + encodeURIComponent(search);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('jobseekersTableBody');
                
                if (!result.success) {
                    // API 오류 발생 시에도 빈 목록으로 표시 (사용자 요청 사항 반영)
                    console.warn('구직자 목록 조회 실패:', result.error);
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 구직자가 없습니다.</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 구직자가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(js => \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                                js.status === 'active' ? 'bg-green-100 text-green-800' : 
                                js.status === 'hired' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }">
                                \${js.status === 'active' ? '구직중' : js.status === 'hired' ? '채용됨' : '비활성'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${js.name}</div>
                            <div class="text-sm text-gray-500">\${js.birth_date || '-'}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">\${js.phone}</div>
                            <div class="text-sm text-gray-500">\${js.email || '-'}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            \${js.skills || '-'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(js.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick='editJobseeker(\${JSON.stringify(js).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-edit"></i> 수정
                            </button>
                            <button onclick="deleteJobseeker(\${js.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    </tr>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('jobseekersTableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function editJobseeker(js) {
            openModal('createJobseekerModal', js);
        }

        async function handleSaveJobseeker(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;
            
            try {
                const token = localStorage.getItem('token');
                const url = id ? '/api/jobseekers/' + id : '/api/jobseekers';
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
                    closeModal('createJobseekerModal');
                    loadJobseekers(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteJobseeker(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/jobseekers/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadJobseekers(); // 목록 새로고침
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
