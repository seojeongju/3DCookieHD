
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
                <form onsubmit="handleSave(event)">
                    <input type="hidden" id="personnelId">
                    
                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- 좌측: 기본정보 -->
                        <div class="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 class="text-sm font-bold text-gray-700 border-b pb-2 mb-4 flex justify-between items-center">
                                기본정보 
                                <span class="text-red-500 text-xs font-normal"><i class="fas fa-exclamation-circle mr-1"></i>필수입력</span>
                            </h3>
                            
                            <div class="flex gap-6">
                                <!-- 사진 영역 -->
                                <div class="w-32 flex flex-col items-center gap-2">
                                    <div class="w-32 h-40 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 overflow-hidden relative group">
                                        <img id="previewImage" src="" class="w-full h-full object-cover hidden">
                                        <i id="defaultProfileIcon" class="fas fa-user text-4xl"></i>
                                    </div>
                                    <div class="flex gap-1 w-full">
                                        <button type="button" class="flex-1 text-[10px] border border-gray-300 px-1 py-1 bg-white hover:bg-gray-50">문자</button>
                                        <label for="profileImage" class="flex-1 text-[10px] border border-gray-300 px-1 py-1 bg-white hover:bg-gray-50 text-center cursor-pointer">
                                            사진첨부
                                        </label>
                                        <input type="file" id="profileImage" class="hidden" accept="image/*" onchange="handleImagePreview(this)">
                                    </div>
                                    <p class="text-[10px] text-gray-400 text-center leading-tight">사진첨부 버튼을 클릭하시면 증명사진을 등록 하실 수 있습니다.</p>
                                </div>

                                <!-- 입력 필드 영역 -->
                                <div class="flex-1 space-y-3">
                                    <!-- 성명 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>성명</label>
                                        <input type="text" id="name" required class="flex-1 border border-gray-300 px-2 py-1.5 text-sm rounded-sm focus:border-teal-500 outline-none">
                                    </div>
                                    <!-- 생년월일 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>생년월일</label>
                                        <input type="date" id="birthdate" class="flex-1 border border-gray-300 px-2 py-1.5 text-sm rounded-sm focus:border-teal-500 outline-none">
                                    </div>
                                    <!-- 휴대전화 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>휴대전화</label>
                                        <div class="flex flex-1 gap-1">
                                            <input type="text" id="phone1" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" value="010" maxlength="3">
                                            <input type="text" id="phone2" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" maxlength="4">
                                            <input type="text" id="phone3" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" maxlength="4">
                                        </div>
                                    </div>
                                    <!-- 전화번호 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>전화번호</label>
                                        <div class="flex flex-1 gap-1">
                                            <input type="text" id="tel1" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" maxlength="3">
                                            <input type="text" id="tel2" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" maxlength="4">
                                            <input type="text" id="tel3" class="w-1/3 border border-gray-300 px-2 py-1.5 text-sm text-center rounded-sm focus:border-teal-500 outline-none" maxlength="4">
                                        </div>
                                    </div>
                                    <!-- 이메일 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>이메일</label>
                                        <input type="email" id="email" required class="flex-1 border border-gray-300 px-2 py-1.5 text-sm rounded-sm focus:border-teal-500 outline-none">
                                    </div>
                                    <!-- 비밀번호 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1" id="pwRequired">!</span>비밀번호</label>
                                        <input type="password" id="password" class="flex-1 border border-gray-300 px-2 py-1.5 text-sm rounded-sm focus:border-teal-500 outline-none" placeholder="변경시에만 입력">
                                    </div>
                                    <!-- 주소 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>주소</label>
                                        <div class="flex-1 flex gap-1">
                                            <input type="text" id="address" class="flex-1 border border-gray-300 px-2 py-1.5 text-sm rounded-sm focus:border-teal-500 outline-none">
                                            <button type="button" class="bg-slate-600 text-white text-xs px-3 py-1 rounded-sm hover:bg-slate-700">주소검색</button>
                                        </div>
                                    </div>
                                    <!-- 성별 -->
                                    <div class="flex items-center">
                                        <label class="w-24 text-sm text-gray-600 font-medium"><span class="text-red-500 mr-1">!</span>성별</label>
                                        <div class="flex gap-4">
                                            <label class="flex items-center text-sm cursor-pointer"><input type="radio" name="gender" value="M" class="mr-1"> 남성</label>
                                            <label class="flex items-center text-sm cursor-pointer"><input type="radio" name="gender" value="F" class="mr-1"> 여성</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 우측: 상세정보 -->
                        <div class="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 class="text-sm font-bold text-gray-700 border-b pb-2 mb-4 flex justify-between items-center">
                                상세정보 
                                <span class="text-red-500 text-xs font-normal"><i class="fas fa-exclamation-circle mr-1"></i>필수입력</span>
                            </h3>
                            
                            <div class="space-y-4">
                                <!-- 로그인 아이디 / 교직원 분류 -->
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1 font-medium">로그인 아이디 / 교직원 분류</label>
                                    <div class="flex gap-2 items-center bg-gray-50 p-3 border border-gray-200 rounded-sm">
                                        <span class="text-sm font-bold text-gray-600 w-16">Login Id</span>
                                        <input type="text" id="loginIdDisplay" class="flex-1 bg-gray-100 border border-gray-300 px-2 py-1 text-sm text-gray-500 rounded-sm" readonly value="아이디가 없습니다.">
                                        <span class="text-red-500 mx-2">!</span>
                                        <select id="position" class="flex-1 border border-gray-300 px-2 py-1 text-sm rounded-sm focus:border-teal-500 outline-none">
                                            <option value="">= 직원분류 =</option>
                                            <option value="정직원">정직원</option>
                                            <option value="계약직">계약직</option>
                                            <option value="강사">강사</option>
                                            <option value="퇴사">퇴사</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- 퇴사일 -->
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1 font-medium">퇴사일</label>
                                    <div class="flex items-center">
                                        <input type="date" id="resignedAt" class="border border-gray-300 px-2 py-1.5 text-sm w-40 rounded-sm focus:border-teal-500 outline-none">
                                        <span class="text-[10px] text-gray-400 ml-2">* 직원 분류가 '퇴사' 일시 활성화</span>
                                    </div>
                                </div>

                                <!-- 조직도 정보 -->
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1 font-medium">조직도 정보</label>
                                    <div class="bg-green-50 border border-green-100 p-3 flex items-center justify-between rounded-sm">
                                        <span class="text-sm text-gray-600">조직도 정보가 없습니다.</span>
                                        <button type="button" class="bg-teal-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-teal-600">조직도 관리 바로가기</button>
                                    </div>
                                    <p class="text-[10px] text-gray-400 mt-1 text-right">* 조직도 메뉴에서 지급, 직책, 직무 관리합니다.</p>
                                </div>

                                <!-- 비고 -->
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1 font-medium">비고</label>
                                    <textarea id="memo" class="w-full border border-gray-300 px-2 py-1 text-sm h-24 rounded-sm focus:border-teal-500 outline-none resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 하단 탭 -->
                    <div class="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div class="flex border-b bg-gray-50 rounded-t-lg overflow-hidden">
                            <button type="button" class="px-6 py-3 text-sm font-bold text-gray-800 bg-white border-r border-t-2 border-t-teal-500">최종학력</button>
                            <button type="button" class="px-6 py-3 text-sm text-gray-500 border-r hover:bg-gray-100 transition">경력사항</button>
                            <button type="button" class="px-6 py-3 text-sm text-gray-500 border-r hover:bg-gray-100 transition">자격증</button>
                        </div>
                        <div class="p-8 text-center text-gray-500 text-sm">
                            회원정보 등록이 완료되면 추가정보 등록이 가능해집니다.
                        </div>
                    </div>

                    <!-- 버튼 영역 -->
                    <div class="mt-6 flex justify-between items-center">
                        <div class="flex gap-2">
                            <button type="button" onclick="showList()" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 text-sm font-medium">
                                <i class="fas fa-list mr-1"></i> 목록
                            </button>
                            <button type="button" onclick="showForm('create')" class="px-4 py-2 bg-teal-500 text-white rounded-sm hover:bg-teal-600 text-sm font-medium">
                                <i class="fas fa-pen mr-1"></i> 새로작성
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" id="deleteBtn" onclick="deletePersonnel()" class="hidden px-4 py-2 bg-rose-500 text-white rounded-sm hover:bg-rose-600 text-sm font-medium">
                                <i class="fas fa-trash mr-1"></i> 삭제
                            </button>
                            <button type="submit" class="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 text-sm font-bold shadow-sm">
                                등록
                            </button>
                        </div>
                    </div>
                </form>
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

                tbody.innerHTML = result.data.map((user, index) => {
                    // JSON 데이터 파싱 (info 컬럼이 있다고 가정하거나 phone 필드 등을 활용)
                    let info = {};
                    try {
                        if (user.phone && user.phone.startsWith('{')) {
                            info = JSON.parse(user.phone);
                        }
                    } catch(e) {}

                    return \`
                    <tr class="table-row h-10 text-center hover:bg-gray-50 cursor-pointer" onclick='editPersonnel(\${JSON.stringify(user).replace(/'/g, "&#39;")})'>
                        <td>\${result.data.length - index}</td>
                        <td class="text-left pl-4 font-medium text-gray-900">\${user.name}</td>
                        <td class="text-left pl-4 text-gray-600">\${user.email}</td>
                        <td class="text-gray-600">\${info.phone || user.phone || '-'}</td>
                        <td class="text-gray-500">\${new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                            <button onclick='event.stopPropagation(); editPersonnel(\${JSON.stringify(user).replace(/'/g, "&#39;")})' class="text-blue-600 hover:text-blue-800 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                \`}).join('');

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
            document.getElementById('previewImage').classList.add('hidden');
            document.getElementById('defaultProfileIcon').classList.remove('hidden');
            
            if (mode === 'create') {
                document.getElementById('personnelId').value = '';
                document.getElementById('email').disabled = false;
                document.getElementById('password').required = true;
                document.getElementById('pwRequired').classList.remove('hidden');
                document.getElementById('deleteBtn').classList.add('hidden');
                document.getElementById('menu-create').classList.add('active');
                document.getElementById('menu-list').classList.remove('active');
                document.getElementById('pageSubtitle').textContent = '교직원 등록';
                document.getElementById('loginIdDisplay').value = '아이디가 없습니다.';
            } else {
                document.getElementById('personnelId').value = data.id;
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('email').disabled = true;
                document.getElementById('loginIdDisplay').value = data.email;
                document.getElementById('password').required = false;
                document.getElementById('pwRequired').classList.add('hidden');
                document.getElementById('deleteBtn').classList.remove('hidden');
                document.getElementById('menu-list').classList.add('active');
                document.getElementById('menu-create').classList.remove('active');
                document.getElementById('pageSubtitle').textContent = '교직원 수정';

                // 상세 데이터 파싱 및 바인딩
                try {
                    // phone 필드에 JSON이 저장되어 있다고 가정 (임시)
                    // 실제로는 별도 컬럼이나 API 구조에 맞춰야 함
                    if (data.phone && data.phone.startsWith('{')) {
                        const info = JSON.parse(data.phone);
                        
                        // 휴대전화
                        if (info.phone) {
                            const parts = info.phone.split('-');
                            if (parts.length === 3) {
                                document.getElementById('phone1').value = parts[0];
                                document.getElementById('phone2').value = parts[1];
                                document.getElementById('phone3').value = parts[2];
                            }
                        }
                        
                        // 전화번호
                        if (info.tel) {
                            const parts = info.tel.split('-');
                            if (parts.length === 3) {
                                document.getElementById('tel1').value = parts[0];
                                document.getElementById('tel2').value = parts[1];
                                document.getElementById('tel3').value = parts[2];
                            }
                        }

                        document.getElementById('birthdate').value = info.birthdate || '';
                        document.getElementById('address').value = info.address || '';
                        document.getElementById('position').value = info.position || '';
                        document.getElementById('resignedAt').value = info.resignedAt || '';
                        document.getElementById('memo').value = info.memo || '';
                        
                        if (info.gender) {
                            const radio = document.querySelector(\`input[name="gender"][value="\${info.gender}"]\`);
                            if (radio) radio.checked = true;
                        }

                        if (info.profileImage) {
                            document.getElementById('previewImage').src = info.profileImage;
                            document.getElementById('previewImage').classList.remove('hidden');
                            document.getElementById('defaultProfileIcon').classList.add('hidden');
                        }
                    } else {
                        // 기존 단순 전화번호 데이터 처리
                        document.getElementById('phone2').value = data.phone || '';
                    }
                } catch (e) {
                    console.error('Data parse error:', e);
                }
            }
        }

        function editPersonnel(user) {
            showForm('edit', user);
        }

        function handleImagePreview(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImage').src = e.target.result;
                    document.getElementById('previewImage').classList.remove('hidden');
                    document.getElementById('defaultProfileIcon').classList.add('hidden');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        async function handleSave(e) {
            e.preventDefault();
            const id = document.getElementById('personnelId').value;
            
            // 데이터 수집
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const phone1 = document.getElementById('phone1').value;
            const phone2 = document.getElementById('phone2').value;
            const phone3 = document.getElementById('phone3').value;
            const phone = \`\${phone1}-\${phone2}-\${phone3}\`;

            const tel1 = document.getElementById('tel1').value;
            const tel2 = document.getElementById('tel2').value;
            const tel3 = document.getElementById('tel3').value;
            const tel = \`\${tel1}-\${tel2}-\${tel3}\`;

            const birthdate = document.getElementById('birthdate').value;
            const address = document.getElementById('address').value;
            const position = document.getElementById('position').value;
            const resignedAt = document.getElementById('resignedAt').value;
            const memo = document.getElementById('memo').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;

            // 이미지 처리 (Base64)
            let profileImage = null;
            const imageInput = document.getElementById('profileImage');
            if (imageInput.files && imageInput.files[0]) {
                profileImage = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(imageInput.files[0]);
                });
            } else if (document.getElementById('previewImage').src && !document.getElementById('previewImage').classList.contains('hidden')) {
                profileImage = document.getElementById('previewImage').src;
            }

            // 추가 정보를 JSON으로 묶음 (DB 스키마 한계로 phone 필드에 저장하거나 별도 처리가 필요)
            // 여기서는 API가 알아서 처리하도록 JSON 객체를 보냄
            const detailedInfo = {
                phone, tel, birthdate, address, position, resignedAt, memo, gender, profileImage
            };

            // API 전송 데이터 구성
            // phone 필드에 JSON 문자열을 저장하는 꼼수를 사용 (임시)
            const data = {
                name,
                email,
                password,
                phone: JSON.stringify(detailedInfo) 
            };

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
