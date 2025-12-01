
export const adminHrdHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        teal: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            400: '#2dd4bf',
                            500: '#14b8a6',
                            600: '#0d9488',
                            700: '#0f766e',
                        },
                        rose: {
                            400: '#fb7185',
                            500: '#f43f5e',
                            600: '#e11d48',
                            700: '#be123c',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gnb-item.active {
            background-color: #14b8a6;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #4b5563;
            border-bottom: 1px solid #f3f4f6;
            transition: all 0.2s;
        }
        .sidebar-item:hover {
            background-color: #f0fdfa;
            color: #0f766e;
            padding-left: 1.25rem;
        }
        .sidebar-item.active {
            background-color: #f0fdfa;
            color: #0d9488;
            font-weight: 600;
            border-left: 3px solid #0d9488;
        }
        .sidebar-subitem {
            color: #9ca3af;
            transition: all 0.2s;
        }
        .sidebar-subitem:hover {
            color: white;
        }
        .sidebar-subitem.active {
            color: #14b8a6;
            font-weight: 600;
        }
        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex font-sans">

    <!-- 왼쪽 사이드바 -->
    <aside class="w-64 bg-slate-800 flex-shrink-0 flex flex-col text-white transition-all duration-300 z-20">
        <div class="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-700">
            <div>
                <h2 class="text-lg font-bold tracking-tight">학사행정관리시스템</h2>
                <p class="text-xs text-slate-400 mt-0.5">관리자 모드</p>
            </div>
        </div>

        <nav class="flex-grow overflow-y-auto py-4">
            <!-- 지원자관리 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-user w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">지원자관리</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <div onclick="showSection('applicantList')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-applicant-list">지원자 목록</div>
                    <div onclick="showSection('applicantForm')" class="sidebar-subitem cursor-pointer pl-12 py-2 text-sm" id="menu-applicant-create">지원자 등록</div>
                </div>
            </div>

            <!-- 기타 메뉴들 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-box w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">물품</span>
                </div>
            </div>
            <!-- ... (기타 메뉴 생략 가능하지만 UI 유지 위해 둠) ... -->
        </nav>
    </aside>

    <!-- 우측 메인 영역 -->
    <div class="flex-grow flex flex-col h-screen overflow-hidden">

        <!-- 상단 탭 네비게이션 -->
        <header class="bg-gray-800 text-white h-16 flex items-center shadow-md z-10">
            <div class="flex h-full overflow-x-auto no-scrollbar">
                <a href="/admin/hrd" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">운영</a>
                <a href="/admin/hrd/students" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">학생</a>
                <a href="/admin/hrd/courses" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">과정</a>
                <a href="/admin/hrd/personnel" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">인사</a>
                <a href="/admin/hrd/ncs-plan" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가계획</a>
                <a href="/admin/hrd/ncs-exec" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가실행</a>
                <a href="/admin/hrd/ncs-result" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">[NCS] 평가결과</a>
                <a href="/admin/hrd/evaluation" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[140px]">역량평가 - 설문</a>
            </div>
            <div class="ml-auto px-6 flex items-center gap-4 text-sm">
                <a href="/admin" class="text-gray-400 hover:text-white flex items-center gap-2">
                    <i class="fas fa-tachometer-alt"></i> 관리자 대시보드
                </a>
                <a href="/" class="text-gray-400 hover:text-white flex items-center gap-2">
                    <i class="fas fa-home"></i> 홈페이지
                </a>
            </div>
        </header>

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-grow overflow-y-auto bg-gray-50 p-8">

            <!-- 대시보드 섹션 (기본) -->
            <div id="dashboardSection">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">MAIN</h1>
                    <p class="text-sm text-gray-500">HOME / MAIN - (운영)</p>
                </div>
                
                <!-- 기존 대시보드 내용 유지 -->
                <div class="flex flex-col xl:flex-row gap-4 mb-6 items-start xl:items-center">
                    <div class="flex-grow flex flex-wrap items-center bg-white border border-teal-500 min-h-[46px] w-full xl:w-auto shadow-sm">
                        <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap">통합검색</div>
                        <input type="text" placeholder="검색단어 입력" class="flex-grow px-4 py-2 text-sm outline-none min-w-[200px] h-full">
                        <button class="bg-teal-500 text-white w-14 h-full flex items-center justify-center hover:bg-teal-600 transition"><i class="fas fa-search text-lg"></i></button>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8">
                    <h2 class="text-2xl font-light text-gray-700 mb-4">모집중인 과정 지원자 현황</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[1000px] text-sm">
                            <thead>
                                <tr class="border-t-2 border-b border-gray-200 bg-gray-50 text-gray-700">
                                    <th class="py-3 w-24 font-medium">지원자</th>
                                    <th class="py-3 w-32 font-medium">진행상황</th>
                                    <th class="py-3 text-left pl-6 font-medium">과정명</th>
                                    <th class="py-3 w-32 font-medium">등록일자</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600 text-center">
                                <tr><td colspan="4" class="py-4">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 지원자 목록 섹션 -->
            <div id="applicantListSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2">지원자 목록</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 지원자관리 / 지원자 목록</p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex gap-2">
                            <input type="text" id="applicantSearchInput" placeholder="이름, 전화번호 검색" class="border border-gray-300 px-3 py-2 rounded text-sm w-64 focus:outline-none focus:border-teal-500">
                            <button onclick="loadApplicants()" class="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600">검색</button>
                        </div>
                        <button onclick="showSection('applicantForm')" class="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700">
                            <i class="fas fa-plus mr-1"></i> 지원자 등록
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left border-t border-gray-200">
                            <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th class="py-3 px-4 w-16 text-center">No</th>
                                    <th class="py-3 px-4 w-32">이름</th>
                                    <th class="py-3 px-4 w-40">연락처</th>
                                    <th class="py-3 px-4 w-48">이메일</th>
                                    <th class="py-3 px-4">관심과정</th>
                                    <th class="py-3 px-4 w-24 text-center">상태</th>
                                    <th class="py-3 px-4 w-32 text-center">등록일</th>
                                    <th class="py-3 px-4 w-20 text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody id="applicantTableBody" class="text-gray-600">
                                <tr><td colspan="8" class="text-center py-8">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 지원자 등록/수정 폼 섹션 -->
            <div id="applicantFormSection" class="hidden">
                <div class="mb-6">
                    <h1 class="text-3xl font-light text-gray-800 mb-2" id="pageTitle">지원자 등록</h1>
                    <p class="text-sm text-gray-500">HOME / 운영 / 지원자관리 / <span id="pageSubtitle">지원자 등록</span></p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
                    <form onsubmit="handleApplicantSave(event)">
                        <input type="hidden" id="applicantId">
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">이름 <span class="text-red-500">*</span></label>
                                    <input type="text" id="applicantName" required class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-teal-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">연락처 <span class="text-red-500">*</span></label>
                                    <input type="text" id="applicantPhone" required class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-teal-500" placeholder="010-0000-0000">
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">이메일</label>
                                    <input type="email" id="applicantEmail" class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-teal-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">진행상태</label>
                                    <select id="applicantStatus" class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-teal-500">
                                        <option value="pending">상담대기</option>
                                        <option value="contacted">상담완료</option>
                                        <option value="registered">등록완료</option>
                                        <option value="cancelled">취소/포기</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">상담 메모</label>
                                <textarea id="applicantMemo" class="w-full border border-gray-300 px-3 py-2 rounded h-32 focus:outline-none focus:border-teal-500 resize-none"></textarea>
                            </div>
                        </div>

                        <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button type="button" onclick="showSection('applicantList')" class="bg-gray-100 text-gray-700 px-5 py-2.5 rounded hover:bg-gray-200 transition font-medium">취소</button>
                            <button type="button" id="deleteApplicantBtn" onclick="deleteApplicant()" class="hidden bg-rose-100 text-rose-600 px-5 py-2.5 rounded hover:bg-rose-200 transition font-medium">삭제</button>
                            <button type="submit" class="bg-teal-600 text-white px-6 py-2.5 rounded hover:bg-teal-700 transition font-bold shadow-sm">저장하기</button>
                        </div>
                    </form>
                </div>
            </div>

        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 초기 로드 시 대시보드 표시 (또는 URL 파라미터에 따라 분기 가능)
            // loadApplicants(); // 대시보드에도 일부 데이터가 필요할 수 있음
        });

        function showSection(sectionId, data = null) {
            // 모든 섹션 숨김
            document.getElementById('dashboardSection').classList.add('hidden');
            document.getElementById('applicantListSection').classList.add('hidden');
            document.getElementById('applicantFormSection').classList.add('hidden');

            // 메뉴 활성화 상태 초기화
            document.getElementById('menu-applicant-list').classList.remove('active');
            document.getElementById('menu-applicant-create').classList.remove('active');

            // 선택된 섹션 표시
            if (sectionId === 'applicantList') {
                document.getElementById('applicantListSection').classList.remove('hidden');
                document.getElementById('menu-applicant-list').classList.add('active');
                loadApplicants();
            } else if (sectionId === 'applicantForm') {
                document.getElementById('applicantFormSection').classList.remove('hidden');
                
                const form = document.querySelector('#applicantFormSection form');
                form.reset();
                
                if (data) {
                    // 수정 모드
                    document.getElementById('pageTitle').textContent = '지원자 정보 수정';
                    document.getElementById('pageSubtitle').textContent = '지원자 수정';
                    document.getElementById('menu-applicant-list').classList.add('active'); // 목록 메뉴 유지
                    
                    document.getElementById('applicantId').value = data.id;
                    document.getElementById('applicantName').value = data.name;
                    document.getElementById('applicantPhone').value = data.phone;
                    document.getElementById('applicantEmail').value = data.email || '';
                    document.getElementById('applicantStatus').value = data.status || 'pending';
                    document.getElementById('applicantMemo').value = data.memo || '';
                    
                    document.getElementById('deleteApplicantBtn').classList.remove('hidden');
                } else {
                    // 등록 모드
                    document.getElementById('pageTitle').textContent = '지원자 등록';
                    document.getElementById('pageSubtitle').textContent = '지원자 등록';
                    document.getElementById('menu-applicant-create').classList.add('active');
                    
                    document.getElementById('applicantId').value = '';
                    document.getElementById('deleteApplicantBtn').classList.add('hidden');
                }
            } else {
                // 기본 대시보드
                document.getElementById('dashboardSection').classList.remove('hidden');
            }
        }

        async function loadApplicants() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/applicants', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const tbody = document.getElementById('applicantTableBody');

                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-red-500">데이터 로드 실패</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">등록된 지원자가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map((item, index) => {
                    let statusBadge = '';
                    switch(item.status) {
                        case 'pending': statusBadge = '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">상담대기</span>'; break;
                        case 'contacted': statusBadge = '<span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">상담완료</span>'; break;
                        case 'registered': statusBadge = '<span class="bg-teal-100 text-teal-600 px-2 py-1 rounded text-xs">등록완료</span>'; break;
                        case 'cancelled': statusBadge = '<span class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">취소/포기</span>'; break;
                        default: statusBadge = '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">' + item.status + '</span>';
                    }

                    return \`
                    <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onclick='editApplicant(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                        <td class="py-3 px-4 text-center text-gray-400">\${result.data.length - index}</td>
                        <td class="py-3 px-4 font-medium text-gray-900">\${item.name}</td>
                        <td class="py-3 px-4 text-gray-600">\${item.phone}</td>
                        <td class="py-3 px-4 text-gray-500">\${item.email || '-'}</td>
                        <td class="py-3 px-4 text-gray-600 truncate max-w-xs">\${item.course_name || '-'}</td>
                        <td class="py-3 px-4 text-center">\${statusBadge}</td>
                        <td class="py-3 px-4 text-center text-gray-500">\${new Date(item.created_at).toLocaleDateString()}</td>
                        <td class="py-3 px-4 text-center">
                            <button onclick='event.stopPropagation(); editApplicant(\${JSON.stringify(item).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                \`}).join('');

            } catch (error) {
                console.error('Error:', error);
                tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-red-500">오류 발생</td></tr>';
            }
        }

        function editApplicant(data) {
            showSection('applicantForm', data);
        }

        async function handleApplicantSave(e) {
            e.preventDefault();
            const id = document.getElementById('applicantId').value;
            const name = document.getElementById('applicantName').value;
            const phone = document.getElementById('applicantPhone').value;
            const email = document.getElementById('applicantEmail').value;
            const status = document.getElementById('applicantStatus').value;
            const memo = document.getElementById('applicantMemo').value;

            const data = { name, phone, email, status, memo };
            const method = id ? 'PUT' : 'POST';
            const url = id ? '/api/hrd/applicants/' + id : '/api/hrd/applicants';

            try {
                const token = localStorage.getItem('token');
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
                    showSection('applicantList');
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteApplicant() {
            const id = document.getElementById('applicantId').value;
            if (!id || !confirm('정말 삭제하시겠습니까?')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/applicants/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    alert('삭제되었습니다.');
                    showSection('applicantList');
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
