
export const adminHrdPersonnelHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 시스템 - 인사관리</title>
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
            color: #9ca3af;
            transition: all 0.2s;
            cursor: pointer;
        }
        .sidebar-item:hover {
            background-color: #334155;
            color: white;
            padding-left: 1.25rem;
        }
        .sidebar-item.active {
            background-color: #334155;
            color: white;
            font-weight: 600;
            border-left: 3px solid #14b8a6;
        }
        .sidebar-subitem {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem 0.5rem 2.5rem;
            font-size: 0.8rem;
            color: #9ca3af;
            transition: all 0.2s;
            cursor: pointer;
        }
        .sidebar-subitem:hover {
            color: white;
        }
        .sidebar-subitem.active {
            color: #14b8a6;
            font-weight: 600;
        }
        .table-header {
            background-color: #f9fafb;
            color: #374151;
            font-weight: 600;
            font-size: 0.75rem;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }
        .table-row {
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.8rem;
            color: #4b5563;
        }
        .table-row:hover {
            background-color: #f9fafb;
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
            <!-- 교직원관리 그룹 -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors bg-slate-700">
                    <i class="fas fa-user-tie w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">교직원관리</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
                <div class="bg-slate-900 py-2">
                    <div onclick="showList()" class="sidebar-subitem active" id="menu-list">교직원 관리</div>
                    <div onclick="showForm('create')" class="sidebar-subitem" id="menu-create">교직원 등록</div>
                </div>
            </div>

            <!-- 기타 메뉴들 (생략 가능하지만 UI 유지를 위해 포함) -->
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-money-check-alt w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">급여 및 퇴직정산</span>
                </div>
            </div>
            <div class="group">
                <div class="flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                    <i class="fas fa-sitemap w-6 text-center mr-3"></i>
                    <span class="text-sm font-medium flex-grow">조직도</span>
                </div>
            </div>
        </nav>
    </aside>

    <!-- 우측 메인 영역 -->
    <div class="flex-grow flex flex-col h-screen overflow-hidden">

        <!-- 상단 탭 네비게이션 -->
        <header class="bg-gray-800 text-white h-16 flex items-center shadow-md z-10">
            <div class="flex h-full overflow-x-auto no-scrollbar">
                <a href="/admin/hrd" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">운영</a>
                <a href="/admin/hrd/students" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">학생</a>
                <a href="/admin/hrd/courses" class="flex items-center justify-center px-8 h-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-w-[100px]">과정</a>
                <a href="#" class="flex items-center justify-center px-8 h-full bg-teal-500 font-bold text-white transition-colors min-w-[100px]">인사</a>
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

            <!-- 타이틀 -->
            <div class="mb-6">
                <h1 class="text-3xl font-light text-gray-800 mb-2">교직원 관리</h1>
                <p class="text-sm text-gray-500">HOME / 인사 / 교직원관리 / <span id="pageSubtitle">교직원 관리</span></p>
            </div>

            <!-- 목록 섹션 -->
            <div id="listSection">
                <!-- 검색 바 (UI만 유지) -->
                <div class="flex flex-col xl:flex-row gap-4 mb-6 items-start xl:items-center">
                    <div class="flex-grow flex flex-wrap items-center bg-white border border-teal-500 min-h-[46px] w-full xl:w-auto shadow-sm">
                        <div class="bg-teal-500 text-white px-6 py-3 h-full flex items-center justify-center font-bold text-sm whitespace-nowrap">통합검색</div>
                        <input type="text" placeholder="검색단어 입력" class="flex-grow px-4 py-2 text-sm outline-none min-w-[200px] h-full">
                        <button class="bg-teal-500 text-white w-14 h-full flex items-center justify-center hover:bg-teal-600 transition">
                            <i class="fas fa-search text-lg"></i>
                        </button>
                    </div>
                </div>

                <!-- 교직원 관리 테이블 -->
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 class="text-sm font-bold text-gray-700">교직원 목록</h2>
                        <div class="flex gap-2">
                            <button onclick="showForm('create')" class="bg-teal-500 text-white px-3 py-1 text-xs rounded hover:bg-teal-600">
                                <i class="fas fa-plus mr-1"></i>교직원 추가등록
                            </button>
                            <button onclick="loadPersonnel()" class="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[800px]">
                                <thead>
                                    <tr class="table-header h-10">
                                        <th class="w-12">No</th>
                                        <th class="text-left pl-4">교직원명</th>
                                        <th class="text-left pl-4">이메일</th>
                                        <th class="w-32">휴대전화</th>
                                        <th class="w-24">등록일자</th>
                                        <th class="w-24">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="personnelTableBody">
                                    <tr>
                                        <td colspan="6" class="text-center py-8 text-gray-500">데이터를 불러오는 중...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 등록/수정 섹션 -->
            <div id="formSection" class="hidden">
                <div class="bg-white rounded-lg shadow-md max-w-4xl mx-auto border border-gray-200">
                    <div class="p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <h2 id="formTitle" class="text-xl font-bold text-gray-800">교직원 등록</h2>
                        <p class="text-sm text-gray-500 mt-1">교직원 정보를 입력해주세요.</p>
                    </div>
                    <div class="p-8">
                        <form onsubmit="handleSave(event)">
                            <input type="hidden" id="personnelId">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label class="block text-gray-700 font-bold mb-2">이름 <span class="text-red-500">*</span></label>
                                    <input type="text" id="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-bold mb-2">전화번호</label>
                                    <input type="text" id="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="010-0000-0000">
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-bold mb-2">이메일 (아이디) <span class="text-red-500">*</span></label>
                                    <input type="email" id="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-bold mb-2">비밀번호 <span id="pwRequired" class="text-red-500">*</span></label>
                                    <input type="password" id="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="비밀번호 입력">
                                    <p class="text-xs text-gray-500 mt-1" id="pwHelp">수정 시에는 변경할 경우에만 입력하세요.</p>
                                </div>
                            </div>
                            
                            <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button type="button" onclick="showList()" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">취소</button>
                                <button type="button" id="deleteBtn" onclick="deletePersonnel()" class="hidden px-6 py-2.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 font-medium transition">삭제</button>
                                <button type="submit" class="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition shadow-sm">저장하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadPersonnel();
        });

        async function loadPersonnel() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/personnel', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                const tbody = document.getElementById('personnelTableBody');
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-500">데이터 로드 실패</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">등록된 교직원이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map((user, index) => \`
                    <tr class="table-row h-10 text-center hover:bg-gray-50 cursor-pointer" onclick="editPersonnel(\${user.id}, '\${user.name}', '\${user.email}', '\${user.phone || ''}')">
                        <td>\${result.data.length - index}</td>
                        <td class="text-left pl-4 font-medium text-gray-900">\${user.name}</td>
                        <td class="text-left pl-4 text-gray-600">\${user.email}</td>
                        <td class="text-gray-600">\${user.phone || '-'}</td>
                        <td class="text-gray-500">\${new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                            <button onclick="event.stopPropagation(); editPersonnel(\${user.id}, '\${user.name}', '\${user.email}', '\${user.phone || ''}')" class="text-blue-600 hover:text-blue-800 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                \`).join('');

            } catch (error) {
                console.error('Error:', error);
            }
        }

        function showList() {
            document.getElementById('listSection').classList.remove('hidden');
            document.getElementById('formSection').classList.add('hidden');
            document.getElementById('menu-list').classList.add('active');
            document.getElementById('menu-create').classList.remove('active');
            document.getElementById('pageSubtitle').textContent = '교직원 관리';
        }

        function showForm(mode, data = null) {
            document.getElementById('listSection').classList.add('hidden');
            document.getElementById('formSection').classList.remove('hidden');
            
            const form = document.querySelector('form');
            form.reset();
            
            if (mode === 'create') {
                document.getElementById('formTitle').textContent = '교직원 등록';
                document.getElementById('personnelId').value = '';
                document.getElementById('email').disabled = false;
                document.getElementById('password').required = true;
                document.getElementById('pwRequired').classList.remove('hidden');
                document.getElementById('deleteBtn').classList.add('hidden');
                document.getElementById('menu-create').classList.add('active');
                document.getElementById('menu-list').classList.remove('active');
                document.getElementById('pageSubtitle').textContent = '교직원 등록';
            } else {
                document.getElementById('formTitle').textContent = '교직원 정보 수정';
                document.getElementById('personnelId').value = data.id;
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('email').disabled = true; // 이메일 수정 불가
                document.getElementById('phone').value = data.phone;
                document.getElementById('password').required = false;
                document.getElementById('pwRequired').classList.add('hidden');
                document.getElementById('deleteBtn').classList.remove('hidden');
                document.getElementById('menu-list').classList.add('active'); // 수정은 목록 메뉴 활성화 유지
                document.getElementById('menu-create').classList.remove('active');
                document.getElementById('pageSubtitle').textContent = '교직원 수정';
            }
        }

        function editPersonnel(id, name, email, phone) {
            showForm('edit', { id, name, email, phone });
        }

        async function handleSave(e) {
            e.preventDefault();
            const id = document.getElementById('personnelId').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;

            const data = { name, email, phone, password };
            const method = id ? 'PUT' : 'POST';
            const url = id ? '/api/hrd/personnel/' + id : '/api/hrd/personnel';

            if (!id && !password) {
                alert('비밀번호를 입력해주세요.');
                return;
            }

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
                    showList();
                    loadPersonnel();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deletePersonnel() {
            const id = document.getElementById('personnelId').value;
            if (!id || !confirm('정말 삭제하시겠습니까?')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/hrd/personnel/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();

                if (result.success) {
                    alert('삭제되었습니다.');
                    showList();
                    loadPersonnel();
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
