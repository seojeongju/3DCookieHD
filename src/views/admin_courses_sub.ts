import { hrdSidebar } from './components/hrd_sidebar';
import { adminNcsEmbedHtml } from './admin_ncs_approved';

const courseSubPageLayout = (
    activeMenu: string,
    title: string,
    description: string,
    icon: string,
    contentHtml: string
) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 통합 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
        body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 text-sm">
    <div class="flex h-[100dvh] overflow-hidden min-h-0 min-w-0">
        ${hrdSidebar(activeMenu)}
        <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            <!-- Header -->
            <header class="bg-white border-b border-slate-200 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div class="flex items-center gap-4">
                    <h1 class="text-lg font-bold text-slate-800">${title}</h1>
                    <nav class="hidden sm:flex items-center text-xs text-slate-500 gap-2">
                        <span>홈</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span>과정관리</span>
                        <i class="fas fa-chevron-right text-[10px]"></i>
                        <span class="font-bold text-slate-700">${title}</span>
                    </nav>
                </div>
                <div class="bg-slate-100 rounded px-3 py-1 text-xs text-slate-600 hidden md:block">
                     <i class="fas ${icon} mr-1.5 text-slate-400"></i> ${description}
                </div>
            </header>

            <!-- Main Content (모바일 패딩) -->
            <main class="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar bg-slate-50 min-h-0">
                ${contentHtml}
            </main>
        </div>
    </div>
</body>
</html>
`;

export const adminCoursesCategoriesHtml = () =>
    courseSubPageLayout(
        'courses-categories',
        '과정분류관리',
        '과정 등록을 위한 기초 데이터(카테고리)를 관리합니다.',
        'fa-tags',
        `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Register Panel -->
        <div class="space-y-6">
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 class="font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <i class="far fa-edit text-slate-400"></i> 과정분류 등록
                </h2>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">분류명 <span class="text-red-500">*</span></label>
                    <div class="flex gap-2">
                        <input type="text" id="categoryNameInput" placeholder="예: 일반과정, 특강" class="flex-1 px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                        <button type="button" id="btnRegisterCategory" class="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 transition">
                            등록
                        </button>
                    </div>
                    <p class="mt-2 text-xs text-slate-400">* 분류명은 과정명이 아닙니다. 과정에 부여할 카테고리입니다.</p>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 class="font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <i class="fas fa-link text-slate-400"></i> 바로가기
                </h2>
                <div class="flex gap-2">
                    <a href="/admin/courses/approved" class="flex-1 py-2 text-center border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                        승인 과정 관리
                    </a>
                    <a href="/admin/courses/sessions" class="flex-1 py-2 text-center border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                        회차별 과정 개설
                    </a>
                </div>
            </div>
            
            <!-- Info Panel -->
            <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800">
                <h3 class="font-bold mb-2 flex items-center gap-2"><i class="fas fa-info-circle"></i> 참고사항</h3>
                <ul class="space-y-1 list-disc list-inside opacity-80">
                    <li>시스템 기본값 분류는 수정·삭제할 수 없습니다.</li>
                    <li>해당 분류로 과정이 등록되어 있으면 삭제할 수 없습니다.</li>
                </ul>
            </div>
        </div>

        <!-- List Panel -->
        <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full max-h-[600px] flex flex-col">
            <h2 class="font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 shrink-0">
                <i class="fas fa-list text-slate-400"></i> 등록된 분류 목록
            </h2>
            <div class="flex-1 overflow-auto custom-scrollbar">
                <table class="w-full text-sm text-left border-collapse">
                    <thead class="bg-slate-100 text-slate-500 font-bold text-xs uppercase sticky top-0">
                        <tr>
                            <th class="p-3 border-b border-slate-200 w-1/2">분류명</th>
                            <th class="p-3 border-b border-slate-200 w-1/4">유형</th>
                            <th class="p-3 border-b border-slate-200 w-1/4 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody id="categoryListBody" class="divide-y divide-slate-100">
                        <tr><td colspan="3" class="p-6 text-center text-slate-400 text-xs">로딩 중...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editCategoryModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div class="bg-slate-800 text-white p-3 px-4 flex justify-between items-center">
                <h3 class="font-bold text-sm">분류 수정</h3>
                <button type="button" onclick="closeEditModal()" class="text-slate-400 hover:text-white"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-5">
                <input type="hidden" id="editCategoryId">
                <label class="block text-xs font-bold text-slate-500 mb-1">분류명</label>
                <input type="text" id="editCategoryName" class="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 mb-4">
                <div class="flex gap-2 justify-end">
                    <button type="button" onclick="closeEditModal()" class="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">취소</button>
                    <button type="button" id="btnSaveEdit" class="px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700">저장</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            async function loadCategories() {
                const tbody = document.getElementById('categoryListBody');
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + token } });
                    const json = await res.json();
                    if (!json.success) { tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-500 text-xs">조회 실패</td></tr>'; return; }
                    const list = json.data || [];
                    if (list.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-400 text-xs">데이터 없음</td></tr>';
                        return;
                    }
                    tbody.innerHTML = list.map(item => {
                        const isSystem = item.is_system_default === 1;
                        const typeLabel = isSystem ? '<span class="text-xs text-slate-400">시스템</span>' : '<span class="text-xs text-slate-600">사용자</span>';
                        const nameEsc = (item.name || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
                        
                        let btns = '';
                        if(isSystem) {
                             btns = '<span class="text-[10px] text-slate-300">수정불가</span>';
                        } else {
                            btns = \`
                                <button type="button" class="text-slate-500 hover:text-primary-600 mr-2 btn-edit-category" data-id="\${item.id}" data-name="\${nameEsc}"><i class="fas fa-pen"></i></button>
                                <button type="button" class="text-slate-500 hover:text-red-500 btn-delete-category" data-id="\${item.id}" data-name="\${nameEsc}"><i class="fas fa-trash-alt"></i></button>
                            \`;
                        }
                        
                        return \`
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 text-slate-700">\${item.name}</td>
                                <td class="p-3">\${typeLabel}</td>
                                <td class="p-3 text-center">\${btns}</td>
                            </tr>
                        \`;
                    }).join('');

                    tbody.querySelectorAll('.btn-edit-category').forEach(btn => {
                        btn.addEventListener('click', () => window.editCategory(parseInt(btn.getAttribute('data-id')), btn.getAttribute('data-name')));
                    });
                    tbody.querySelectorAll('.btn-delete-category').forEach(btn => {
                        btn.addEventListener('click', () => window.deleteCategory(parseInt(btn.getAttribute('data-id')), btn.getAttribute('data-name')));
                    });

                } catch (e) {
                    tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-500 text-xs">오류 발생</td></tr>';
                }
            }

            window.editCategory = (id, name) => {
                document.getElementById('editCategoryId').value = id;
                document.getElementById('editCategoryName').value = name;
                document.getElementById('editCategoryModal').classList.remove('hidden');
            };
            window.closeEditModal = () => document.getElementById('editCategoryModal').classList.add('hidden');
            
            window.deleteCategory = async (id, name) => {
                if (!confirm(\`'\${name}' 분류를 삭제하시겠습니까?\\n(사용중인 분류는 삭제되지 않습니다)\`)) return;
                try {
                    const res = await fetch('/api/course-categories/' + id, { 
                        method: 'DELETE', 
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } 
                    });
                    const json = await res.json();
                    if (json.success) loadCategories();
                    else alert(json.error || '삭제 실패');
                } catch (e) { alert('오류 발생'); }
            };

            document.getElementById('btnRegisterCategory').addEventListener('click', async () => {
                const name = document.getElementById('categoryNameInput').value.trim();
                if (!name) return alert('분류명을 입력하세요.');
                try {
                    const res = await fetch('/api/course-categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: JSON.stringify({ name })
                    });
                    const json = await res.json();
                    if (json.success) {
                         document.getElementById('categoryNameInput').value = '';
                         loadCategories();
                    } else {
                        alert(json.error || '등록 실패');
                    }
                } catch (e) { alert('오류 발생'); }
            });

            document.getElementById('btnSaveEdit').addEventListener('click', async () => {
                const id = document.getElementById('editCategoryId').value;
                const name = document.getElementById('editCategoryName').value.trim();
                if (!name) return alert('분류명을 입력하세요.');
                try {
                    const res = await fetch('/api/course-categories/' + id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: JSON.stringify({ name })
                    });
                    const json = await res.json();
                    if (json.success) {
                        window.closeEditModal();
                        loadCategories();
                    } else {
                        alert(json.error || '수정 실패');
                    }
                } catch (e) { alert('오류 발생'); }
            });

            loadCategories();
        })();
    </script>
    `
    );

export const adminCoursesApprovedHtml = () =>
    courseSubPageLayout(
        'courses-approved',
        '승인받은 과정 관리',
        'HRD-Net 승인 정보를 기반으로 과정을 등록하고 관리합니다.',
        'fa-check-double',
        `
    <!-- 1. Search Filter Panel -->
    <div class="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <i class="fas fa-search text-slate-400"></i>
            <h2 class="font-bold text-slate-700">승인 과정 검색</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">과정분류</label>
                <select id="approvedFilterCategory" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">전체 분류</option>
                </select>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">과정명</label>
                <input type="text" id="approvedFilterName" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" placeholder="과정명 검색">
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">교·강사명</label>
                <input type="text" id="approvedFilterInstructor" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" placeholder="교·강사명 검색">
            </div>
             <div class="space-y-1 flex items-end">
                <div class="flex gap-1 w-full">
                    <button type="button" id="approvedBtnSearch" class="flex-1 bg-slate-800 text-white rounded text-xs font-bold py-2 hover:bg-slate-700 transition">검색</button>
                    <button type="button" id="approvedBtnReset" class="w-20 border border-slate-200 text-slate-600 rounded text-xs font-bold py-2 hover:bg-slate-50 transition">초기화</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Data Grid -->
    <div class="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-[600px]">
        <!-- Grid Toolbar -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
             <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-700">등록 현황</span>
                <div class="h-4 w-px bg-slate-300"></div>
                 <select id="approvedPageSize" class="text-xs border-none bg-transparent focus:ring-0 text-slate-500 p-0 font-bold">
                    <option value="15">15개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
            </div>
            <div class="flex items-center gap-2">
                <a href="/admin/courses/approved/register" class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700 transition">
                    <i class="fas fa-plus"></i> 승인 과정 신규 등록
                </a>
                 <button type="button" id="approvedBtnRefresh" class="text-slate-500 hover:text-slate-700 p-2"><i class="fas fa-sync-alt"></i></button>
            </div>
        </div>

        <!-- Table: 고정 레이아웃으로 열 너비·행 높이 통일, 가독성 개선 -->
        <style>
            .approved-list-table { table-layout: fixed; }
            .approved-list-table tbody td { vertical-align: middle !important; }
            .approved-list-table .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: keep-all; }
            .approved-list-table .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .approved-list-table .approved-col-instructor { min-width: 0; white-space: nowrap; }
            .approved-list-table .approved-col-status { white-space: nowrap; min-width: 3.5rem; }
            .approved-list-table tr.approved-row-selected { background-color: rgb(238 242 255) !important; }
        </style>
        <div class="flex-1 overflow-auto custom-scrollbar relative">
            <table class="approved-list-table w-full text-left border-collapse table-fixed" style="min-width: 990px;">
                <thead class="bg-slate-100 text-slate-500 text-xs font-bold uppercase sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="p-3 w-12 text-center border-b border-slate-200">No.</th>
                        <th class="p-3 w-20 border-b border-slate-200">분류</th>
                        <th class="p-3 border-b border-slate-200" style="width: 260px;">승인 과정명</th>
                        <th class="p-3 border-b border-slate-200 approved-col-instructor" style="width: 120px;">교·강사</th>
                        <th class="p-3 w-20 text-center border-b border-slate-200">훈련시간</th>
                        <th class="p-3 text-center border-b border-slate-200">정원</th>
                        <th class="p-3 w-20 text-center border-b border-slate-200">승인기관</th>
                        <th class="p-3 text-center border-b border-slate-200 approved-col-status">상태</th>
                        <th class="p-3 text-center border-b border-slate-200 w-20">회차</th>
                        <th class="p-3 text-right border-b border-slate-200" style="width: 130px;">관리</th>
                    </tr>
                </thead>
                <tbody id="approvedListBody" class="text-sm divide-y divide-slate-100">
                    <tr><td colspan="10" class="p-12 text-center text-slate-400">데이터 로딩 중...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 bg-slate-50" id="approvedPagination">
            <!-- JS Rendered -->
        </div>
    </div>

    <script src="/static/approved-courses.js"></script>
    `
    );

/** 승인받은 과정 등록/수정 전용 서브 페이지 (모달 대신 별도 페이지) */
export const adminCoursesApprovedRegisterHtml = (editId?: string) => {
    const isEdit = !!editId;
    const pageTitle = isEdit ? '승인받은 과정 수정' : '승인받은 과정 등록';
    const breadcrumb = isEdit ? '승인받은과정 > 수정' : '승인받은과정 > 등록';

    // NCS 탭 콘텐츠 미리 생성
    const ncsContent = isEdit ? adminNcsEmbedHtml(editId) : `
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <i class="fas fa-lock text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-700">과정 정보가 저장되지 않았습니다</h3>
            <p class="text-slate-500 mt-2 text-sm">
                먼저 [기본정보] 탭에서 과정을 등록하고 저장해주세요.<br>
                저장이 완료되면 자동으로 NCS 설계 탭이 활성화됩니다.
            </p>
        </div>
    `;

    return courseSubPageLayout(
        'courses-approved',
        pageTitle,
        '과정 등록과 NCS 설계를 한곳에서 관리합니다.',
        'fa-check-double',
        `
    <!-- Tab Navigation -->
    <div class="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
        <button onclick="switchTab('basic')" id="tab-basic" class="tab-btn active px-6 py-3 text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 transition-colors whitespace-nowrap flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">1</div>
            기본정보
        </button>
        <button onclick="switchTab('ncs')" id="tab-ncs" class="tab-btn px-6 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent hover:text-slate-700 transition-colors whitespace-nowrap flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">2</div>
            NCS 설계
        </button>
        ${editId ? `<a id="tab-syllabus-link" href="/admin/courses/sessions/register?approvedCourseId=${encodeURIComponent(editId)}" class="tab-btn px-6 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent hover:text-slate-700 transition-colors whitespace-nowrap flex items-center gap-2 no-underline">
            <div class="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">3</div>
            교수계획서
        </a>` : `<button type="button" onclick="alert('먼저 과정을 저장한 후 회차 개설 페이지에서 교수계획서를 이용할 수 있습니다.');" class="tab-btn px-6 py-3 text-sm font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition-colors whitespace-nowrap flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center text-[10px]">3</div>
            교수계획서
        </button>`}
    </div>

    <!-- Content: Basic Info -->
    <div id="content-basic" class="tab-content block animate-[fadeIn_0.2s_ease-out]">
        <!-- Old Register Form Container -->
        <div class="bento-card bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80 flex flex-wrap justify-between items-center gap-3">
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">${breadcrumb}</p>
                    <h2 class="font-black text-slate-800 tracking-tight mt-0.5">${pageTitle}</h2>
                </div>
                <a href="/admin/courses/approved" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2">
                    <i class="fas fa-list"></i> 목록으로
                </a>
            </div>
            <div class="p-6 md:p-8">
                <form id="approvedRegisterForm" class="space-y-8">
                    <input type="hidden" id="approvedFormId" value="${editId || ''}">

                    <section class="space-y-4">
                        <h3 class="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                            <i class="fas fa-info-circle text-emerald-500"></i> 기본정보
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-bold text-slate-700 mb-1">과정명 <span class="text-red-500">*</span></label>
                                <input type="text" id="approvedFormName" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="예: [2026] 퓨전(Fusion) 활동 3D모델링 고급심화">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">모집인원</label>
                                <input type="number" id="approvedFormCapacity" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="10">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">수업계획서</label>
                                <div class="flex gap-2">
                                    <input type="text" id="approvedFormPlanFile" readonly class="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="파일 선택">
                                    <button type="button" id="approvedFormPlanAttach" class="px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">파일첨부</button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">등록일</label>
                                <input type="date" id="approvedFormRegisteredAt" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">과정분류</label>
                                <select id="approvedFormCategory" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                                    <option value="">선택</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">승인기관</label>
                                <input type="text" id="approvedFormApprovalOrg" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="승인기관">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-bold text-slate-700 mb-2">교·강사 선택</label>
                                <div id="approvedFormInstructorList" class="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[60px] max-h-48 overflow-y-auto">
                                    <span class="text-slate-400 text-sm">교직원 정보를 불러오는 중...</span>
                                </div>
                                <div class="mt-3 flex flex-wrap items-center gap-3">
                                    <div class="flex-1 min-w-[200px]">
                                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">배정된 교·강사명 (쉼표로 구분)</label>
                                        <input type="text" id="approvedFormInstructor" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="선택 시 자동 입력되거나 직접 입력">
                                    </div>
                                    <div class="flex items-end gap-2 px-4 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl">
                                        <div>
                                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">목록에 없는 강사 추가</label>
                                            <input type="text" id="approvedFormInstructorNameQuick" class="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm" placeholder="이름 입력">
                                        </div>
                                        <button type="button" id="approvedFormInstructorAdd" class="h-9 px-3 bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1">
                                            <i class="fas fa-plus"></i> 추가
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">상태</label>
                                <select id="approvedFormStatus" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                                    <option value="active">활성</option>
                                    <option value="inactive">비활성</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section class="space-y-4">
                        <h3 class="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                            <i class="fas fa-clock text-emerald-500"></i> 시간설정
                        </h3>
                        <div class="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-3 text-sm font-bold mb-4 flex items-center gap-2">
                             <i class="fas fa-coins"></i> 시간을 설정 하시면 월별 과정매출이 자동 계산됩니다.
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">시간당 단가</label>
                                <input type="number" id="approvedFormHourlyRate" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="0" value="0">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">총 훈련일수</label>
                                <input type="number" id="approvedFormTotalDays" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="20" value="20">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">총 훈련비</label>
                                <input type="number" id="approvedFormTotalCost" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="0" value="0">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">총 훈련시간</label>
                                <input type="number" id="approvedFormTotalHours" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="100" value="100">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">일일 훈련시간</label>
                                <input type="number" id="approvedFormDailyHours" min="0" step="0.5" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="5" value="5">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">정부지원금</label>
                                <input type="number" id="approvedFormGovSubsidy" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="0" value="0">
                            </div>
                        </div>
                    </section>
                    
                    <!-- Additional URL Section Omitted for brevity if not strictly needed in new design, or kept -->
                    <!-- Let's keep URLs but hide if not used much, or keep them for compatibility -->
                     <section class="space-y-4">
                        <h3 class="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">외부 시스템 연동 (선택)</h3>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">NCS교과 URL</label>
                                <input type="url" id="approvedFormUrlNcs" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="https://">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">교수계획서 URL</label>
                                <input type="url" id="approvedFormUrlPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="https://">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">세부교수계획서 URL</label>
                                <input type="url" id="approvedFormUrlDetailPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="https://">
                            </div>
                        </div>
                    </section>

                    <div class="flex flex-wrap gap-3 pt-6 border-t border-slate-200/60 sticky bottom-0 bg-white pb-4 z-10">
                        <a href="/admin/courses/approved" class="px-6 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</a>
                        <button type="submit" id="approvedFormSubmit" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition shadow-lg shadow-emerald-600/20">
                            <i class="fas fa-check mr-2"></i> ${isEdit ? '저장하기' : '등록 후 NCS 설계하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Content: NCS Design -->
    <div id="content-ncs" class="tab-content hidden animate-[fadeIn_0.2s_ease-out]">
         ${ncsContent}
    </div>

    <script>
        window.switchTab = function(tabName) {
            if(tabName === 'ncs' && !document.getElementById('approvedFormId').value) {
                return alert('기본정보를 먼저 저장해야 NCS 설계가 가능합니다.');
            }
            
            // UI Toggle
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('text-emerald-600', 'border-emerald-600', 'active');
                b.classList.add('text-slate-500', 'border-transparent');
                
                // Icon/Number reset
                const badge = b.querySelector('div');
                if(badge) {
                     badge.classList.remove('bg-emerald-100', 'text-emerald-600');
                     badge.classList.add('bg-slate-100', 'text-slate-500');
                }
            });
            
            const activeBtn = document.getElementById('tab-' + tabName);
            activeBtn.classList.remove('text-slate-500', 'border-transparent');
            activeBtn.classList.add('text-emerald-600', 'border-emerald-600', 'active');
             
            const activeBadge = activeBtn.querySelector('div');
            if(activeBadge) {
                 activeBadge.classList.remove('bg-slate-100', 'text-slate-500');
                 activeBadge.classList.add('bg-emerald-100', 'text-emerald-600');
            }

            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById('content-' + tabName).classList.remove('hidden');
        };
        
        // Auto-switch tab from URL param
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('tab') === 'ncs') {
             setTimeout(() => window.switchTab('ncs'), 100);
        }
        // 교수계획서 탭: 회차가 있으면 해당 회차 교수계획서로 바로 이동, 없으면 회차 개설 페이지로
        (function(){
            var link = document.getElementById('tab-syllabus-link');
            if (!link) return;
            link.addEventListener('click', function(e) {
                var approvedId = document.getElementById('approvedFormId') && document.getElementById('approvedFormId').value;
                if (!approvedId) return;
                e.preventDefault();
                var fallbackUrl = link.getAttribute('href');
                var token = localStorage.getItem('token');
                fetch('/api/course-sessions?approved_course_id=' + encodeURIComponent(approvedId) + '&limit=1', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        if (json.success && json.data && json.data.length > 0) {
                            window.location.href = '/admin/courses/sessions/' + json.data[0].id + '/syllabus';
                        } else {
                            window.location.href = fallbackUrl;
                        }
                    })
                    .catch(function() { window.location.href = fallbackUrl; });
            });
        })();
    </script>
    <script src="/static/approved-register.js"></script>
    ${isEdit ? '<script src="/static/ncs-approved.js"></script>' : ''}
    `
    );
};

export const adminCoursesSessionsHtml = () =>
    courseSubPageLayout(
        'courses-sessions',
        '회차별 과정 개설 관리',
        '동일 과정의 회차(1기, 2기 등)를 개설하고 운영 현황을 관리합니다.',
        'fa-calendar-plus',
        `
    <!-- 1. Search Filter Panel -->
    <div class="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <i class="fas fa-search text-slate-400"></i>
            <h2 class="font-bold text-slate-700">회차 과정 검색</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">과정분류</label>
                <select id="sessionsFilterCategory" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">전체 분류</option>
                </select>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">진행상황</label>
                <select id="sessionsFilterStatus" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">전체 상태</option>
                    <option value="recruiting">모집중</option>
                    <option value="in_progress">진행중</option>
                    <option value="completed">종료</option>
                    <option value="always_open">상시모집</option>
                    <option value="closed">폐강</option>
                </select>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">과정명</label>
                <input type="text" id="sessionsFilterName" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" placeholder="과정명 검색">
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500">교·강사명</label>
                <input type="text" id="sessionsFilterInstructor" class="w-full py-1.5 px-3 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" placeholder="교·강사명 검색">
            </div>
            <div class="space-y-1 flex items-end">
                <div class="flex gap-1 w-full">
                    <button type="button" id="sessionsBtnSearch" class="flex-1 bg-slate-800 text-white rounded text-xs font-bold py-2 hover:bg-slate-700 transition">검색</button>
                    <button type="button" id="sessionsBtnReset" class="w-20 border border-slate-200 text-slate-600 rounded text-xs font-bold py-2 hover:bg-slate-50 transition">초기화</button>
                </div>
            </div>
        </div>
        
        <!-- Stats Summary -->
        <div class="mt-4 pt-4 border-t border-slate-100">
             <div id="sessionsStats" class="flex flex-wrap gap-2 text-xs">
                <span class="text-slate-400">통계 로딩 중...</span>
            </div>
        </div>
    </div>

    <!-- 2. Data Grid -->
    <div class="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-[600px]">
        <!-- Grid Toolbar -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
             <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-700">개설 현황</span>
                <div class="h-4 w-px bg-slate-300"></div>
                 <select id="sessionsPageSize" class="text-xs border-none bg-transparent focus:ring-0 text-slate-500 p-0 font-bold">
                    <option value="15">15개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
                <span id="sessionsSummary" class="text-[10px] text-slate-400">Loading...</span>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" id="sessionsBtnSyncStatus" class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition" title="개강일·종료일 기준으로 모집중/훈련중/종료 자동 반영">
                    <i class="fas fa-calendar-check"></i> 상태 동기화
                </button>
                <a href="/admin/courses/sessions/enrollments" class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition">
                    <i class="fas fa-user-plus"></i> 수강생 등록
                </a>
                <a href="/admin/courses/sessions/register" class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700 transition">
                    <i class="fas fa-plus"></i> 회차별 과정 신규 개설
                </a>
                 <button type="button" id="sessionsBtnRefresh" class="text-slate-500 hover:text-slate-700 p-2"><i class="fas fa-sync-alt"></i></button>
            </div>
        </div>

        <!-- Table (모바일 가로 스크롤) -->
        <div class="flex-1 overflow-auto custom-scrollbar relative">
            <div class="overflow-x-auto min-w-0">
            <table class="w-full text-left border-collapse min-w-[800px]">
                <thead class="bg-slate-100 text-slate-500 text-xs font-bold uppercase sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="p-3 w-16 text-center border-b border-slate-200">No.</th>
                        <th class="p-3 border-b border-slate-200">개설 과정명</th>
                        <th class="p-3 w-20 text-center border-b border-slate-200">회차</th>
                        <th class="p-3 w-24 text-center border-b border-slate-200">상태</th>
                        <th class="p-3 w-32 text-center border-b border-slate-200">훈련시작일</th>
                        <th class="p-3 w-24 text-center border-b border-slate-200">등록일</th>
                        <th class="p-3 w-24 text-center border-b border-slate-200">홈페이지</th>
                        <th class="p-3 w-28 text-right border-b border-slate-200">관리</th>
                    </tr>
                </thead>
                <tbody id="sessionsListBody" class="text-sm divide-y divide-slate-100">
                    <tr><td colspan="8" class="p-12 text-center text-slate-400">데이터 로딩 중...</td></tr>
                </tbody>
            </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="p-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 bg-slate-50" id="sessionsPagination">
            <!-- JS Rendered -->
        </div>
    </div>

    <script src="/static/course-sessions.js"></script>
    `
    );

/** 회차별 과정개설 등록/수정 전용 서브 페이지 — 참조 UI: 상세 보기·탭·2열 과정정보·훈련/점심시간 */
export const adminCoursesSessionsRegisterHtml = (editId?: string) => {
    const isEdit = !!editId;
    const pageTitle = isEdit ? '회차별 과정개설 수정' : '회차별 과정개설 등록';
    return courseSubPageLayout(
        'courses-sessions',
        '회차별 과정개설 상세 보기',
        '과정을 개설하기 위해선 승인받은 과정이 사전 등록되어야 합니다. 승인받은 과정으로 회차별 과정을 개설합니다.',
        'fa-calendar-plus',
        `
    <div class="bento-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-200 bg-white">
            <div class="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 class="text-xl font-black text-slate-800">회차별 과정개설 상세 보기</h1>
                    <p id="sessionsPageCourseName" class="text-slate-600 mt-1 font-medium">과정명 : <span class="text-slate-400">승인 과정을 선택하세요</span></p>
                    <p class="text-slate-500 text-sm mt-2">과정을 개설하기 위해선 승인받은 과정이 사전 등록이 되어야 합니다. 승인받은 과정으로 회차별 과정을 개설합니다.</p>
                </div>
                <a href="/admin/courses/sessions" class="shrink-0 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2">
                    <i class="fas fa-list"></i> 목록으로
                </a>
            </div>
        </div>

        <!-- 탭 -->
        <div class="border-b border-slate-200 bg-slate-50/80 px-6">
            <div class="flex gap-0">
                <button type="button" class="session-detail-tab active px-5 py-3.5 text-sm font-bold border-b-2 border-emerald-600 bg-white text-emerald-700 -mb-px" data-tab="detail">회차별 개설과정 상세보기</button>
                <button type="button" class="session-detail-tab px-5 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 border-b-2 border-transparent" data-tab="ncs">NCS 훈련과정 개설정보</button>
                <a id="sessionsTabUrlPlan" href="#" target="_blank" class="session-detail-tab-link px-5 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 border-b-2 border-transparent">교수계획서 실행</a>
                <a id="sessionsTabUrlDetailPlan" href="#" target="_blank" class="session-detail-tab-link px-5 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 border-b-2 border-transparent">세부교수계획서 실행</a>
            </div>
        </div>

        <!-- NCS 훈련과정 개설정보 (승인과정 관리에서 등록) -->
        <div id="sessionsTabContentNcs" class="hidden px-6 py-5 border-b border-slate-100 bg-amber-50/50">
            <p class="text-slate-700 text-sm font-medium mb-2">NCS 훈련과정 개설정보(과정개요, 교과목 편성, 훈련시간 설정, 평가·교수학습방법 등)는 <strong>승인받은 과정 관리</strong>에서 등록·수정합니다.</p>
            <p class="text-slate-600 text-sm mb-4">회차별 과정개설은 “어떤 승인과정의 몇 회차를, 언제, 어디서, 누가 진행하는지”만 정하며, 과정의 NCS 내용은 승인과정 쪽에서 한 번만 등록하면 됩니다.</p>
            <div id="sessionsNcsRegisterLinkWrap" class="hidden">
                <a id="sessionsNcsRegisterLink" href="#" class="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700">
                    <i class="fas fa-edit mr-2"></i>선택한 과정의 NCS 훈련과정 개설정보 등록/보기
                </a>
            </div>
            <p id="sessionsNcsNotice" class="text-slate-500 text-sm mt-4">승인받은 과정을 선택하면 위 버튼으로 해당 과정의 NCS 정보 페이지로 이동할 수 있습니다.</p>
        </div>

        <!-- 회차별 개설과정 정보 -->
        <div class="p-6 md:p-8">
            <form id="sessionsRegisterForm" class="space-y-8">
                <input type="hidden" id="sessionsFormId" value="${editId || ''}">

                <section class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
                    <div class="px-5 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <h2 class="font-black text-slate-800">회차별 개설과정 정보</h2>
                        <span class="flex items-center gap-1.5 text-red-600 text-xs font-bold"><i class="fas fa-exclamation-circle"></i> 필수등록</span>
                    </div>
                    <p class="px-5 py-2 text-sm text-slate-500">승인받은 과정을 선택한 뒤, 이 회차만의 일정·진행상황·강사·장소 등을 등록하세요. 과정 상세·NCS 훈련과정 개설정보는 승인받은 과정 관리에서 등록합니다.</p>

                    <div class="p-5">
                        <div class="flex flex-wrap items-center gap-2 mb-4">
                            <label class="text-sm font-bold text-slate-700">승인받은 과정 선택</label>
                            <span class="text-red-500 text-xs font-bold">*</span>
                        </div>
                        <select id="sessionsFormApprovedCourse" class="w-full max-w-md px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            <option value="">선택</option>
                        </select>

                        <!-- 선택한 승인과정 요약 (상세·NCS는 승인과정 관리에서) -->
                        <div id="sessionsCourseDetailBox" class="mt-6 hidden rounded-xl border border-slate-200 bg-white p-4">
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">선택한 승인과정</p>
                            <p id="sessionsDetailCourseName" class="font-bold text-slate-800 mb-2"></p>
                            <p id="sessionsCourseSummaryLine" class="text-sm text-slate-600 mb-3"></p>
                            <p id="sessionsDetailPlanText" class="text-sm text-slate-500 mb-3">등록된 수업계획서가 없습니다.</p>
                            <a id="sessionsApprovedCourseLink" href="#" class="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                <i class="fas fa-external-link-alt mr-2"></i>승인과정 상세 및 NCS 훈련과정 개설정보 등록/보기
                            </a>
                        </div>
                    </div>
                </section>

                <!-- 회차별 과정개설 추가 정보 (참조 UI) -->
                <section class="border border-slate-200 rounded-xl p-5 bg-white">
                    <div class="flex items-center gap-2 mb-4">
                        <h3 class="font-bold text-slate-800">회차별 과정개설 추가 정보</h3>
                        <span class="flex items-center gap-1 text-red-600 text-xs font-bold"><i class="fas fa-exclamation-circle"></i> 필수등록</span>
                    </div>

                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1"><span class="text-red-500">*</span> 회차</label>
                                <input type="number" id="sessionsFormSessionNumber" min="1" class="w-full max-w-xs px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="1">
                                <p class="text-xs text-slate-500 mt-1">원하는 회차 번호를 직접 입력하세요. 같은 승인과정 내 회차는 중복될 수 없습니다. (비어 있으면 다음 회차가 자동 제안됩니다)</p>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">회차별과정명</label>
                                <input type="text" id="sessionsFormSessionName" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="예: 1기 실무반">
                                <p class="text-xs text-slate-500 mt-1">승인받은 과정명 + 회차 + 이 입력값(회차별과정명)으로 표시됩니다. 비워두면 과정명 + 회차만 사용됩니다.</p>
                                <p id="sessionsFormSessionNamePreview" class="text-xs text-emerald-600 mt-1.5 font-medium truncate" aria-live="polite"></p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-slate-700 mb-1">접근 인증 코드 (PIN)</label>
                                <input type="text" id="sessionsFormAccessCode" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="예: 1234 (입력 시 수강생 입실/출석 인증용 사용)">
                                <p class="text-xs text-slate-500 mt-1">이 코드를 설정하면 수강생이 강의실 입장 시 입력해야 합니다. (비워두면 인증 생략)</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2"><span class="text-red-500">*</span> 대상자</label>
                            <div class="flex flex-wrap gap-x-6 gap-y-2">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="실업자" class="rounded text-emerald-600"> 실업자</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="재직자" class="rounded text-emerald-600"> 재직자</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="일반" class="rounded text-emerald-600"> 일반</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="통합" class="rounded text-emerald-600"> 실업자/재직자/일반(통합)</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="구직자" class="rounded text-emerald-600"> 구직자</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="산재근로자" class="rounded text-emerald-600"> 산재근로자</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="일반고" class="rounded text-emerald-600"> 일반고</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsTargetAudience" value="기타" class="rounded text-emerald-600"> 기타</label>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1"><span class="text-red-500">*</span> 진행상황</label>
                            <select id="sessionsFormStatus" class="w-full max-w-xs px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                <option value="recruiting">모집중</option>
                                <option value="in_progress">진행중</option>
                                <option value="completed">종료</option>
                                <option value="always_open">상시모집</option>
                                <option value="closed">폐강</option>
                            </select>
                            <p class="text-xs text-slate-500 mt-1">상시모집인 경우 진행상황 수정은 수동으로 하셔야 합니다.</p>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2"><span class="text-red-500">*</span> 요일</label>
                            <div class="flex flex-wrap gap-x-6 gap-y-2">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="일" class="rounded text-emerald-600"> 일요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="월" class="rounded text-emerald-600"> 월요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="화" class="rounded text-emerald-600"> 화요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="수" class="rounded text-emerald-600"> 수요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="목" class="rounded text-emerald-600"> 목요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="금" class="rounded text-emerald-600"> 금요일</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="sessionsDaysOfWeek" value="토" class="rounded text-emerald-600"> 토요일</label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1"><span class="text-red-500">*</span> 시작일</label>
                                <input type="date" id="sessionsFormTrainingStart" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1"><span class="text-red-500">*</span> 종료일</label>
                                <div class="flex gap-2">
                                    <input type="date" id="sessionsFormTrainingEnd" class="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                                    <button type="button" id="btnOpenScheduleCalendar" class="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2 whitespace-nowrap">
                                        <i class="fas fa-calendar-alt text-emerald-500"></i> 일정관리
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                            <div>
                                <h3 class="text-sm font-bold text-slate-700 mb-3">훈련시간</h3>
                                <div class="flex flex-wrap items-center gap-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-slate-500 text-sm">시작</span>
                                        <input type="time" id="sessionsFormTrainingTimeStart" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 bg-white">
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-slate-500 text-sm">종료</span>
                                        <input type="time" id="sessionsFormTrainingTimeEnd" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 bg-white">
                                    </div>
                                    <span id="sessionsDailyHoursPreview" class="text-xs font-bold text-emerald-600"></span>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-700 mb-3">점심시간</h3>
                                <div class="flex flex-wrap items-center gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" id="sessionsFormLunchNone" class="rounded text-emerald-600 border-slate-300 focus:ring-emerald-500">
                                        <span class="text-sm text-slate-700">점심시간 없음</span>
                                    </label>
                                    <div id="sessionsFormLunchTimeWrap" class="flex flex-wrap items-center gap-4">
                                        <div class="flex items-center gap-2">
                                            <span class="text-slate-500 text-sm">시작</span>
                                            <input type="time" id="sessionsFormLunchTimeStart" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 bg-white" value="12:00">
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-slate-500 text-sm">종료</span>
                                            <input type="time" id="sessionsFormLunchTimeEnd" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 bg-white" value="13:00">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 시간설정 (자동계산) -->
                        <div id="sessionsCalculationResultBox" class="hidden rounded-xl border border-blue-100 bg-blue-50/30 p-5 space-y-4">
                            <h3 class="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                                <i class="fas fa-calculator"></i> 시간설정 (자동계산)
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">최종 훈련일수</label>
                                    <div class="flex items-center gap-2">
                                        <input type="text" id="sessionsCalcTotalDays" readonly class="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-black text-blue-600 focus:ring-0 cursor-default" placeholder="0">
                                        <span class="text-xs font-bold text-slate-500">일</span>
                                    </div>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">수업 기간 및 요일</label>
                                    <input type="text" id="sessionsCalcClassDays" readonly class="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 focus:ring-0 cursor-default" placeholder="시작일, 종료일, 요일을 선택하세요">
                                </div>
                                <div class="md:col-span-3">
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">공강(제외) 일자</label>
                                    <div id="sessionsExcludedDatesPreview" class="flex flex-wrap gap-2 min-h-[2.5rem] p-3 bg-white/50 border border-blue-100 rounded-xl text-xs text-slate-500 italic">
                                        중간 공강일이 없습니다.
                                    </div>
                                    <input type="hidden" id="sessionsFormExcludedDates" value="">
                                </div>
                            </div>
                            <p class="text-[10px] text-blue-500 font-medium"><i class="fas fa-info-circle mr-1"></i> [일정관리] 버튼을 눌러 달력에서 특정 날짜를 공강일로 지정할 수 있습니다.</p>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">장소(교육장소)</label>
                            <select id="sessionsFormLocationSelect" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white mb-2" aria-label="등록된 훈련시설 선택">
                                <option value="">등록된 훈련시설 선택 (또는 아래 직접 입력)</option>
                            </select>
                            <input type="text" id="sessionsFormLocation" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="예: 3D쿠키홍대센터 제1강의실">
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">등록일</label>
                            <input type="date" id="sessionsFormRegisteredAt" class="w-full max-w-xs px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                        </div>
                    </div>
                </section>

                <section class="border border-slate-200 rounded-xl p-5 bg-white">
                    <h3 class="font-bold text-slate-800 mb-4">강사(담당 강사)</h3>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">강사</label>
                        <div id="sessionsFormInstructorList" class="flex flex-wrap gap-x-6 gap-y-2 min-h-[2.5rem] px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm">
                            <span class="text-slate-400">강사 목록 로딩 중...</span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">여러 명 선택 시 저장 후 쉼표로 구분되어 표시됩니다.</p>
                    </div>
                </section>

                <section class="border border-slate-200 rounded-xl p-5 bg-white">
                    <h3 class="font-bold text-slate-800 mb-4">연동 홈페이지 설정</h3>
                    <p class="text-xs text-slate-500 mb-4">연동홈페이지에 대표이미지·과정설명이 노출되는 홈페이지에만 해당됩니다.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">홈페이지 노출</label>
                            <div class="flex gap-4">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormHomepageExposed" value="1" class="text-emerald-600"> 등록(노출)</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormHomepageExposed" value="0" class="text-emerald-600" checked> 미등록(비노출)</label>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">등록 시 개설 과정(회차별) 목록에 노출됩니다. 목록에서도 등록/삭제 가능합니다.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">모집상황</label>
                            <select id="sessionsFormRecruitmentStatus" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                                <option value="normal">정상</option>
                                <option value="suspended">유예</option>
                                <option value="closed">마감</option>
                            </select>
                            <p class="text-xs text-slate-500 mt-1">정상일 경우에 수강신청을 받을 수 있습니다.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">대표이미지 노출</label>
                            <div class="flex gap-4">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormRepImageExposure" value="expose" class="text-emerald-600" checked> 노출</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormRepImageExposure" value="hide" class="text-emerald-600"> 미노출</label>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">메인 슬라이드에 과정을 노출 시킵니다.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">모집유예기간</label>
                            <input type="number" id="sessionsFormRecruitmentGracePeriod" min="0" value="0" class="w-full max-w-[8rem] px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            <p class="text-xs text-slate-500 mt-1">과정시작일에서 등록된 수만큼 모집기간이 늘어납니다.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">수업계획서 노출</label>
                            <div class="flex gap-4">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormSyllabusExposure" value="expose" class="text-emerald-600"> 노출</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="sessionsFormSyllabusExposure" value="hide" class="text-emerald-600" checked> 미노출</label>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">수업계획서 노출시 연동홈페이지 과정상세보기 페이지에 노출 시킵니다.</p>
                        </div>
                    </div>
                </section>

                <section class="border border-slate-200 rounded-xl p-5 bg-white bg-blue-50/30">
                    <h3 class="font-bold text-slate-800 mb-4">과정 대표 이미지</h3>
                    <p class="text-xs text-slate-500 mb-4">연동홈페이지에 대표이미지가 노출되는 홈페이지에만 해당됩니다.</p>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">메인 슬라이드 대표 이미지</label>
                            <div class="flex items-center gap-3 flex-wrap">
                                <input type="file" id="sessionsFormMainSlideImage" accept="image/*" class="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold">
                                <span id="sessionsFormMainSlideImageInfo" class="text-xs text-slate-500"></span>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">권장 사이즈: 가로 1000 / 세로 370px. 모집중인 과정만 노출됩니다.</p>
                            <input type="hidden" id="sessionsFormMainSlideImageUrl" value="">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">과정 목록 대표 이미지</label>
                            <div class="flex items-center gap-3 flex-wrap">
                                <input type="file" id="sessionsFormCourseListImage" accept="image/*" class="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold">
                                <span id="sessionsFormCourseListImageInfo" class="text-xs text-slate-500"></span>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">권장 사이즈: 가로 350px / 세로 175px. 과정 목록 전체에 노출됩니다.</p>
                            <input type="hidden" id="sessionsFormCourseListImageUrl" value="">
                        </div>
                        <p class="text-xs text-slate-500">과정 대표 이미지가 슬라이드 되는 연동 홈페이지일 경우 메인 슬라이드 대표 이미지 사이즈로 등록해주세요.</p>
                    </div>
                </section>

                <section class="border border-slate-200 rounded-xl p-5 bg-white">
                    <h3 class="font-bold text-slate-800 mb-4">과정 상세 정보(과정설명)</h3>
                    <p class="text-xs text-slate-500 mb-4">상세 정보 등록시 연동홈페이지의 각 과정 수강신청 버튼 하단에 과정 설명이 노출됩니다. <b>에디터에 고해상도 이미지를 직접 끌어다 넣거나 복사해서 붙여넣을 수 있습니다.</b></p>
                    
                    <!-- 멀티 이미지 업로드 존 (교육사진 갤러리와 동일 기능) -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 mb-2">사진 여러 장 한꺼번에 올리기</label>
                        <div id="multiImageDropZone" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 transition cursor-pointer">
                            <input type="file" id="multiImageInput" accept="image/*" multiple class="hidden">
                            <p class="text-slate-500 text-sm mb-1"><i class="fas fa-cloud-upload-alt text-2xl text-emerald-500 mb-2"></i></p>
                            <p class="text-slate-600 font-medium text-sm">클릭하거나 이미지를 여기에 끌어다 놓으세요</p>
                            <p class="text-slate-400 text-xs mt-1">여러 장 선택 가능 (JPG, PNG 등) - 에디터에 자동 삽입됩니다.</p>
                            <div id="multiImageProgress" class="hidden mt-3 text-sm text-emerald-600 font-bold"></div>
                            <div id="multiImageThumbs" class="hidden mt-3 flex flex-wrap gap-2 justify-center"></div>
                        </div>
                    </div>

                    <textarea id="sessionsFormCourseDetailDescription" class="w-full min-h-[280px] border border-slate-200 rounded-xl text-sm p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="과정 설명을 입력하세요 (HTML 지원)"></textarea>
                </section>

                <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                    <a href="/admin/courses/sessions" class="px-6 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</a>
                    <button type="submit" id="sessionsFormSubmit" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition">${isEdit ? '저장' : '등록'}</button>
                </div>
            </form>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/tinymce@6.8.5/tinymce.min.js" referrerpolicy="origin"></script>
    <script>window.TINYMCE_BASE_URL='https://cdn.jsdelivr.net/npm/tinymce@6.8.5';window.TINYMCE_SUFFIX='.min';</script>

    <!-- 훈련 일정 관리 달력 모달 -->
    <div id="scheduleCalendarModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-bounce-in">
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-2xl font-black tracking-tight">훈련 일정 및 공강 관리</h3>
                        <p class="text-emerald-50/80 text-sm mt-1">달력에서 날짜를 클릭하여 훈련일/공강일을 토글하세요.</p>
                    </div>
                    <button type="button" id="btnCloseScheduleCalendar" class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="mt-6 flex flex-wrap gap-4 text-xs font-bold">
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                        <span class="w-3 h-3 rounded-full bg-emerald-400"></span> 훈련일
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                        <span class="w-3 h-3 rounded-full bg-rose-400"></span> 공강/휴강일 (제외)
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                        <span class="w-3 h-3 rounded-full bg-slate-400"></span> 비훈련 요일
                    </div>
                </div>
            </div>

            <div class="p-6 sm:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <!-- 달력 컨트롤 -->
                <div class="flex items-center justify-between mb-6">
                    <h4 id="calendarMonthTitle" class="text-xl font-black text-slate-800">2026년 2월</h4>
                    <div class="flex gap-2">
                        <button type="button" id="btnPrevMonth" class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button type="button" id="btnNextMonth" class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <!-- 달력 그리드 -->
                <div class="border border-slate-200 rounded-2xl overflow-hidden">
                    <div class="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                        <div class="py-3 text-center text-[10px] font-black text-rose-500 uppercase">일</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-400 uppercase">월</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-400 uppercase">화</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-400 uppercase">수</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-400 uppercase">목</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-400 uppercase">금</div>
                        <div class="py-3 text-center text-[10px] font-black text-slate-600 uppercase">토</div>
                    </div>
                    <div id="scheduleCalendarGrid" class="grid grid-cols-7 divide-x divide-y divide-slate-100">
                        <!-- JS Rendered -->
                    </div>
                </div>

                <div class="mt-8 flex flex-wrap justify-between items-center gap-4 border-t border-slate-100 pt-6">
                    <div class="flex items-center gap-6">
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-0.5">선택된 공강</p>
                            <p class="text-lg font-black text-rose-600"><span id="calendarExcludedCount">0</span>일</p>
                        </div>
                        <div class="w-px h-8 bg-slate-200"></div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-0.5">최종 훈련일수</p>
                            <p class="text-lg font-black text-emerald-600"><span id="calendarTotalCount">0</span>일</p>
                        </div>
                    </div>
                    <button type="button" id="btnApplySchedule" class="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
                        설정 완료 및 적용
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="/static/course-sessions-register.js"></script>
    `
    );
};

export const adminCoursesCopyHtml = () =>
    courseSubPageLayout(
        'courses-copy',
        '회차별 과정복사',
        '과정 등록을 위한 기초 데이터 — 기존 과정·회차를 복사해 새 회차를 빠르게 등록합니다.',
        'fa-copy',
        `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">회차별 과정개설 리스트</h2>
            </div>
            <div class="p-6">
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" id="copySessionSearch" placeholder="과정명·회차 검색..." class="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <ul id="copySessionList" class="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <li class="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm font-medium text-slate-500">불러오는 중...</li>
                </ul>
            </div>
        </div>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">복사 옵션</h2>
            </div>
            <div class="p-6 space-y-4">
                <p id="copySelectedInfo" class="text-sm text-slate-500">왼쪽에서 복사할 회차를 선택하세요.</p>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">새 회차명</label>
                    <input type="text" id="copyNewSessionName" placeholder="예: 2025년 1기" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">복사할 항목</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" id="copyOptSchedule" class="rounded text-purple-600" checked> 교육일정</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" id="copyOptPlan" class="rounded text-purple-600" checked> 강의계획</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" id="copyOptNcs" class="rounded text-purple-600" checked> NCS 능력단위</label>
                    </div>
                </div>
                <button type="button" id="copyExecuteBtn" class="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2" disabled>
                    <i class="fas fa-copy"></i> 과정 복사 실행
                </button>
            </div>
        </div>
    </div>
    <p class="text-sm text-slate-500 text-center">기초 데이터로 복사한 회차는 과정등록 시 바로 사용할 수 있습니다.</p>
    <script>
(function() {
    var listEl = document.getElementById('copySessionList');
    var searchEl = document.getElementById('copySessionSearch');
    var selectedInfo = document.getElementById('copySelectedInfo');
    var executeBtn = document.getElementById('copyExecuteBtn');
    var allSessions = [];
    var selectedSessionId = null;

    function formatDate(str) {
        if (!str) return '-';
        try { return new Date(str).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }); } catch (e) { return str; }
    }
    function statusLabel(s) {
        var map = { recruiting: '모집중', in_progress: '진행중', completed: '종료', always_open: '상시모집', closed: '폐강' };
        return map[s] || s;
    }

    function renderList(sessions) {
        if (!listEl) return;
        if (sessions.length === 0) {
            listEl.innerHTML = '<li class="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-slate-500">등록된 회차가 없습니다.</li>';
            return;
        }
        listEl.innerHTML = sessions.map(function(s) {
            var parts = [];
            if (s.course_name) parts.push(s.course_name);
            if (s.session_number != null) parts.push(s.session_number + '차');
            if (s.session_name) parts.push(s.session_name);
            
            var name = parts.join(' ');
            if (!name) name = '과정 (id:' + s.id + ')';
            
            var sub = formatDate(s.training_start_date) + ' · ' + statusLabel(s.status);
            
            var active = selectedSessionId === s.id ? ' ring-2 ring-purple-500 bg-purple-50 border-purple-200' : '';
            return '<li class="copy-session-item px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition' + active + '" data-id="' + s.id + '" data-name="' + (name || '').replace(/"/g, '&quot;') + '" data-course="' + (s.course_name || '').replace(/"/g, '&quot;') + '">' +
                '<div class="font-bold text-slate-800">' + (name || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
                '<div class="text-xs text-slate-500 mt-0.5">' + (sub || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
            '</li>';
        }).join('');
        listEl.querySelectorAll('.copy-session-item').forEach(function(li) {
            li.addEventListener('click', function() {
                selectedSessionId = parseInt(li.getAttribute('data-id'), 10);
                var name = li.getAttribute('data-name') || '';
                if (selectedInfo) selectedInfo.textContent = '선택: ' + name;
                if (executeBtn) executeBtn.disabled = false;
                listEl.querySelectorAll('.copy-session-item').forEach(function(el) {
                    if (parseInt(el.getAttribute('data-id'), 10) === selectedSessionId) {
                        el.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50', 'border-purple-200');
                        el.classList.remove('border-slate-200/60');
                    } else {
                        el.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-50', 'border-purple-200');
                        el.classList.add('border-slate-200/60');
                    }
                });
            });
        });
    }

    function filterAndRender() {
        var q = (searchEl && searchEl.value) ? searchEl.value.trim().toLowerCase() : '';
        var list = allSessions;
        if (q) {
            list = allSessions.filter(function(s) {
                var course = (s.course_name || '').toLowerCase();
                var sessionName = (s.session_name || '').toLowerCase();
                var num = String(s.session_number || '');
                return course.indexOf(q) !== -1 || sessionName.indexOf(q) !== -1 || num.indexOf(q) !== -1;
            });
        }
        renderList(list);
    }

    function loadSessions() {
        if (!listEl) return;
        var token = localStorage.getItem('token');
        if (!token) {
            listEl.innerHTML = '<li class="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">로그인이 필요합니다.</li>';
            return;
        }
        listEl.innerHTML = '<li class="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-slate-500"><i class="fas fa-spinner fa-spin mr-2"></i>불러오는 중...</li>';
        fetch('/api/course-sessions?page=1&limit=500', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (json.success && Array.isArray(json.data)) {
                    allSessions = json.data;
                    filterAndRender();
                } else {
                    listEl.innerHTML = '<li class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">목록을 불러오지 못했습니다.</li>';
                }
            })
            .catch(function() {
                listEl.innerHTML = '<li class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">목록을 불러오지 못했습니다.</li>';
            });
    }

    if (searchEl) searchEl.addEventListener('input', filterAndRender);
    if (searchEl) searchEl.addEventListener('keyup', filterAndRender);
    if (executeBtn) {
        executeBtn.addEventListener('click', async function() {
            if (!selectedSessionId) return alert('복사할 회차를 선택하세요.');
            var newName = document.getElementById('copyNewSessionName').value.trim();
            if (!newName) return alert('새 회차명을 입력하세요.');
            
            var optSchedule = document.getElementById('copyOptSchedule').checked;
            var optPlan = document.getElementById('copyOptPlan').checked;
            var optNcs = document.getElementById('copyOptNcs').checked;

            if (!confirm('선택한 회차를 복사하여 새 회차를 생성하시겠습니까?')) return;

            try {
                executeBtn.disabled = true;
                executeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mb-1"></i> 처리 중...';
                
                var token = localStorage.getItem('token');
                var res = await fetch('/api/course-sessions/' + selectedSessionId + '/copy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        new_session_name: newName,
                        copy_options: {
                            schedule: optSchedule,
                            plan: optPlan,
                            ncs: optNcs
                        }
                    })
                });
                
                var json = await res.json();
                if (json.success) {
                    if (json.new_session_id && confirm('과정 복사가 완료되었습니다.\\n복사된 과정의 세부 정보를 수정하시겠습니까?')) {
                        window.location.href = '/admin/courses/sessions/register/' + json.new_session_id;
                        return;
                    }
                    alert('과정 복사가 완료되었습니다.');
                    document.getElementById('copyNewSessionName').value = '';
                    selectedSessionId = null;
                    if (selectedInfo) selectedInfo.textContent = '왼쪽에서 복사할 회차를 선택하세요.';
                    executeBtn.disabled = true;
                    loadSessions();
                } else {
                    alert(json.error || '복사 실패');
                }
            } catch (e) {
                alert('오류가 발생했습니다.');
                console.error(e);
            } finally {
                if (selectedSessionId) executeBtn.disabled = false;
                executeBtn.innerHTML = '<i class="fas fa-copy"></i> 과정 복사 실행';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSessions);
    } else {
        loadSessions();
    }
})();
    </script>
    `
    );

/** 교수계획서 작성 페이지 — 회차별 교과목 선택 후 NCS 학습목표/평가기준 로드 */
export const adminSyllabusHtml = (sessionId: string) => {
    return courseSubPageLayout(
        'courses-sessions',
        '교수계획서',
        '과정·회차별 교과목을 선택하여 교수계획서를 작성합니다. 학습목표와 평가기준은 NCS 능력단위에서 불러옵니다.',
        'fa-file-alt',
        `
    <div class="bento-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-200 bg-white">
            <div class="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 class="text-xl font-black text-slate-800">교수계획서</h1>
                    <p id="syllabusCourseName" class="text-slate-600 mt-1 font-medium">과정명 : <span class="text-slate-400">로딩 중...</span></p>
                    <p class="text-slate-500 text-sm mt-2">개설과정 회차 선택 시 해당 회차별 교수계획서로 변경됩니다. 교과목별로 작성할 수 있습니다.</p>
                </div>
                <a href="/admin/courses/sessions" class="shrink-0 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2">
                    <i class="fas fa-list"></i> 목록
                </a>
            </div>
        </div>

        <div class="border-b border-slate-200 bg-slate-50/80 px-6">
            <p class="py-3 text-sm text-slate-600">교과목명을 선택하시면 해당 교과목의 교수계획서 작성 폼이 표시됩니다.</p>
            <div id="syllabusSubjectTabs" class="flex flex-wrap gap-2 pb-3">
                <span class="text-slate-400 text-sm">교과목 로딩 중...</span>
            </div>
        </div>

        <div id="syllabusFormArea" class="p-6 hidden">
            <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h2 id="syllabusSubjectTitle" class="text-lg font-bold text-slate-800">선택된 교과목 : <span class="text-emerald-600"></span></h2>
                <div class="flex gap-2">
                    <button type="button" id="syllabusLoadNcs" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">
                        <i class="fas fa-sync-alt mr-1"></i> NCS에서 학습목표·평가기준 불러오기
                    </button>
                </div>
            </div>

            <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table class="w-full text-sm border-collapse">
                    <tbody>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">과정명</td><td class="p-3" id="syllabusCourseNameCell">-</td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">훈련수준</td><td class="p-3"><input type="text" id="syllabusTrainingLevel" class="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg" placeholder="예: 2수준"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">훈련시간</td><td class="p-3"><input type="text" id="syllabusTrainingHours" class="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg" placeholder="예: 33"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">훈련교사</td><td class="p-3"><input type="text" id="syllabusInstructors" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg" placeholder="예: 홍길동, 김철수"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">수업방법</td><td class="p-3"><input type="text" id="syllabusTeachingMethod" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg" placeholder="예: 혼합형"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">훈련생</td><td class="p-3"><input type="text" id="syllabusTrainees" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">저자</td><td class="p-3"><input type="text" id="syllabusAuthor" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">교재명</td><td class="p-3"><input type="text" id="syllabusTextbook" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">출판자</td><td class="p-3"><input type="text" id="syllabusPublisher" class="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg"></td></tr>
                        <tr class="border-b border-slate-100"><td class="bg-slate-50 w-32 font-bold text-slate-600 p-3">발행년도</td><td class="p-3"><input type="text" id="syllabusPubYear" class="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg" placeholder="예: 2022-01-01"></td></tr>
                        <tr class="border-b border-slate-100">
                            <td class="bg-slate-50 w-32 font-bold text-slate-600 p-3 align-top">학습목표</td>
                            <td class="p-3"><textarea id="syllabusLearningObjectives" rows="5" class="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="NCS에서 불러오기 또는 직접 입력"></textarea></td>
                        </tr>
                        <tr class="border-b border-slate-100">
                            <td class="bg-slate-50 w-32 font-bold text-slate-600 p-3 align-top">평가기준</td>
                            <td class="p-3"><textarea id="syllabusEvaluationCriteria" rows="5" class="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="NCS에서 불러오기 또는 직접 입력"></textarea></td>
                        </tr>
                        <tr class="border-b border-slate-100">
                            <td class="bg-slate-50 w-32 font-bold text-slate-600 p-3 align-top">지시사항</td>
                            <td class="p-3"><textarea id="syllabusInstructions" rows="3" class="w-full px-3 py-2 border border-slate-200 rounded-lg"></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="syllabusStep6Section" class="mt-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <div class="px-4 py-3 border-b border-slate-200 bg-slate-100/80">
                    <h3 class="text-sm font-bold text-slate-700"><i class="fas fa-building mr-1.5 text-blue-600"></i>시설·장비 (NCS 6단계)</h3>
                    <p class="text-xs text-slate-500 mt-0.5">NCS 설계 6단계에서 저장한 시설·장비·교재·소모품이 아래에 표시됩니다. 수정 후 저장하면 NCS 6단계 데이터가 반영됩니다.</p>
                </div>
                <div id="syllabusStep6List" class="p-4 text-sm text-slate-600">
                    <span class="text-slate-400">교과목 선택 시 여기에 시설·장비 목록이 표시됩니다.</span>
                </div>
                <div id="syllabusStep6Edit" class="hidden p-4 border-t border-slate-200 bg-white">
                    <p class="text-xs text-slate-500 mb-3">좌측에서 항목을 클릭하면 선택됨(우측)으로 이동, 우측 클릭 시 해제됩니다.</p>
                    <div id="syllabusStep6EditContent" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    <div class="mt-3 flex gap-2">
                        <button type="button" id="syllabusStep6BtnSave" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">시설·장비 저장</button>
                        <button type="button" id="syllabusStep6BtnCancel" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300">취소</button>
                    </div>
                </div>
                <div class="px-4 py-2 border-t border-slate-200 bg-white flex gap-2">
                    <button type="button" id="syllabusStep6BtnToggleEdit" class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200">
                        <i class="fas fa-edit mr-1"></i>수정
                    </button>
                    <a id="syllabusStep6LinkNcs" href="#" target="_blank" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 inline-flex items-center gap-1">NCS 6단계에서 편집 <i class="fas fa-external-link-alt text-[10px]"></i></a>
                </div>
            </div>

            <div class="mt-4 flex gap-2">
                <button type="button" id="syllabusSaveDoc" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700">
                    <i class="fas fa-save mr-1"></i> 문서저장
                </button>
                <a href="/admin/courses/sessions" class="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 inline-flex items-center gap-1"><i class="fas fa-list"></i> 목록</a>
            </div>
        </div>

        <div id="syllabusEmptyState" class="p-12 text-center text-slate-400">
            <i class="fas fa-book-open text-4xl mb-3 block"></i>
            <p class="font-medium">교과목을 선택해주세요</p>
            <p class="text-sm mt-1">위에서 교과목을 선택하면 해당 과목의 교수계획서 작성 폼이 표시됩니다.</p>
        </div>
    </div>
    <script>
        window.SYLLABUS_SESSION_ID = ${JSON.stringify(sessionId)};
    </script>
    <script src="/static/syllabus.js"></script>
    `
    );
};

/** 수강생 등록 페이지: 회차 선택 후 훈련생 목록에서 수강생 등록 */
export const adminCoursesSessionEnrollmentsHtml = (sessionId?: string) =>
    courseSubPageLayout(
        'courses-session-enrollments',
        '수강생 등록',
        '회차별 개설과정에 수강생을 등록합니다. 훈련생 목록에서 선택해 등록하세요.',
        'fa-user-plus',
        `
    <div class="space-y-6">
        <!-- 회차 선택 -->
        <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 class="font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <i class="fas fa-calendar-alt text-slate-400"></i> 회차 선택
            </h2>
            <div class="flex flex-wrap items-end gap-4">
                <div class="min-w-[280px]">
                    <label class="block text-xs font-bold text-slate-500 mb-1">개설 회차</label>
                    <select id="enrollSessionSelect" class="w-full py-2.5 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="">회차를 선택하세요</option>
                    </select>
                </div>
                <button type="button" id="enrollLoadSession" class="px-4 py-2.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition">
                    <i class="fas fa-sync-alt mr-1"></i> 조회
                </button>
            </div>
            <div id="enrollSessionInfo" class="hidden mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <h3 id="enrollCourseName" class="font-bold text-lg text-emerald-900 mb-1"></h3>
                <div id="enrollSessionDetail" class="text-sm text-emerald-700 flex flex-wrap gap-x-4 gap-y-1"></div>
            </div>
            <p id="enrollSessionSummary" class="mt-2 text-xs text-slate-500 hidden"></p>
        </div>

        <div id="enrollContent" class="hidden">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <!-- 등록된 수강생 -->
                <div class="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <h3 class="font-bold text-slate-700 flex items-center gap-2">
                            <i class="fas fa-users text-emerald-500"></i> 등록된 수강생
                            <span id="enrolledCount" class="text-slate-400 text-xs font-normal">0명</span>
                        </h3>
                    </div>
                    <div class="flex-1 overflow-auto custom-scrollbar min-h-[200px] max-h-[400px]">
                        <table class="w-full text-sm border-collapse">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase sticky top-0">
                                <tr>
                                    <th class="p-2 text-left border-b border-slate-200">이름</th>
                                    <th class="p-2 text-left border-b border-slate-200">연락처</th>
                                    <th class="p-2 w-20 text-center border-b border-slate-200">관리</th>
                                </tr>
                            </thead>
                            <tbody id="enrolledListBody" class="divide-y divide-slate-100">
                                <tr><td colspan="3" class="p-4 text-center text-slate-400 text-xs">회차를 선택한 뒤 조회하세요.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 훈련생 목록에서 등록 -->
                <div class="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <h3 class="font-bold text-slate-700 flex items-center gap-2">
                            <i class="fas fa-user-plus text-primary-500"></i> 훈련생 목록에서 등록
                        </h3>
                        <div class="flex gap-2">
                            <input type="text" id="enrollStudentSearch" placeholder="이름·연락처 검색" class="px-2 py-1.5 border border-slate-200 rounded text-xs w-36 focus:ring-1 focus:ring-primary-500">
                            <button type="button" id="enrollAddSelected" class="px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700 transition">
                                <i class="fas fa-plus mr-1"></i> 선택 등록
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 overflow-auto custom-scrollbar min-h-[200px] max-h-[400px]">
                        <table class="w-full text-sm border-collapse">
                            <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase sticky top-0">
                                <tr>
                                    <th class="p-2 w-8 text-center border-b border-slate-200"><input type="checkbox" id="enrollSelectAll" title="전체 선택"></th>
                                    <th class="p-2 text-left border-b border-slate-200">이름</th>
                                    <th class="p-2 text-left border-b border-slate-200">연락처</th>
                                </tr>
                            </thead>
                            <tbody id="candidateListBody" class="divide-y divide-slate-100">
                                <tr><td colspan="3" class="p-4 text-center text-slate-400 text-xs">회차 선택 후 훈련생 목록이 표시됩니다.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id="enrollEmptyState" class="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <i class="fas fa-calendar-check text-4xl mb-3 block text-slate-300"></i>
            <p class="font-medium">위에서 회차를 선택한 뒤 [조회]를 누르세요.</p>
        </div>
    </div>

    <script>
        window.ENROLL_SESSION_ID = ${sessionId ? JSON.stringify(sessionId) : 'null'};
    </script>
    <script src="/static/session-enrollments.js"></script>
    `
    );
