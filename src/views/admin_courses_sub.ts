import { hrdSidebar } from './components/hrd_sidebar';

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
    <title>${title} - 과정 등록 기초 데이터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'] },
            borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
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
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar(activeMenu)}
        <main class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
            <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-8 py-5 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-100">
                        <i class="fas ${icon} text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-black text-slate-900 tracking-tight">${title}</h1>
                        <p class="text-sm font-medium text-slate-500 mt-0.5">${description}</p>
                    </div>
                </div>
                <a href="/admin/courses" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm text-slate-700">
                    <i class="fas fa-arrow-left"></i> 과정목록
                </a>
            </header>
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1600px] mx-auto space-y-8">
                    ${contentHtml}
                </div>
            </div>
        </main>
    </div>
</body>
</html>
`;

export const adminCoursesCategoriesHtml = () =>
  courseSubPageLayout(
    'courses-categories',
    '과정분류관리',
    '과정 등록을 위한 기초 데이터 — 카테고리(국비지원, 일반과정, 특강 등)를 등록·수정합니다.',
    'fa-tags',
    `
    <!-- 검색 & 팁 (접기/펼치기) -->
    <div class="bento-card bg-sky-50/80 rounded-[2.5rem] border border-sky-200/60 overflow-hidden">
        <button type="button" id="tipToggle" class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sky-50/50 transition">
            <span class="font-black text-slate-800 tracking-tight text-sm uppercase">검색 & 팁</span>
            <i id="tipIcon" class="fas fa-chevron-up text-slate-500 text-sm transition-transform duration-300"></i>
        </button>
        <div id="tipContent" class="px-6 pb-5 pt-0 border-t border-sky-200/40">
            <ul class="text-sm text-slate-700 space-y-2 mt-4">
                <li class="flex items-start gap-2"><span class="text-sky-500 mt-0.5">•</span> 시스템 기본값 분류는 수정·삭제할 수 없습니다.</li>
                <li class="flex items-start gap-2"><span class="text-sky-500 mt-0.5">•</span> 해당 분류로 과정이 등록되어 있으면 삭제할 수 없습니다.</li>
                <li class="flex items-start gap-2"><span class="text-sky-500 mt-0.5">•</span> 삭제하려면 해당 분류를 사용하는 과정의 분류 설정을 먼저 변경하세요.</li>
            </ul>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 왼쪽: 과정분류 등록 -->
        <div class="space-y-6">
            <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                    <h2 class="font-black text-slate-800 tracking-tight">과정분류 등록</h2>
                </div>
                <div class="p-6">
                    <label class="block text-sm font-bold text-slate-700 mb-2">분류명 <span class="text-red-500">*</span></label>
                    <input type="text" id="categoryNameInput" placeholder="예: 일반과정, 특강" class="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                    <p class="mt-2 text-xs text-slate-500"><span class="text-red-500">*</span> 분류명은 과정명이 아닙니다.</p>
                    <button type="button" id="btnRegisterCategory" class="mt-4 w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                        <i class="fas fa-plus"></i> 과정 분류 등록하기
                    </button>
                </div>
            </div>
            <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden p-6">
                <div class="flex flex-col sm:flex-row gap-3">
                    <a href="/admin/courses/approved" class="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 whitespace-nowrap">승인받은 과정 등록하기</a>
                    <a href="/admin/courses/sessions" class="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 whitespace-nowrap">회차별 과정 개설하기</a>
                </div>
                <p class="mt-3 text-xs text-slate-500 text-center break-words leading-relaxed">승인받은 과정 등록 및 회차별 과정 개설은 위 메뉴에서 진행해 주세요.</p>
            </div>
            <!-- 과정분류 등록 참고사항 (핑크 패널) -->
            <div class="bento-card bg-rose-50/80 rounded-[2.5rem] border border-rose-200/60 overflow-hidden p-6">
                <h3 class="font-black text-slate-800 tracking-tight text-sm flex items-center gap-2 mb-3">
                    <i class="fas fa-exclamation-triangle text-rose-500"></i> 과정분류 등록 참고사항
                </h3>
                <ul class="text-sm text-rose-800/90 space-y-2 break-words leading-relaxed">
                    <li class="flex items-start gap-2"><span class="text-rose-500 mt-0.5 shrink-0">1.</span> 분류명은 과정명이 아닙니다.</li>
                    <li class="flex items-start gap-2"><span class="text-rose-500 mt-0.5 shrink-0">2.</span> 과정분류는 과정에 대분류(카테고리)를 부여하는 기능입니다.</li>
                    <li class="flex items-start gap-2"><span class="text-rose-500 mt-0.5 shrink-0">3.</span> 해당 분류로 과정이 등록되어 있으면 삭제할 수 없습니다.</li>
                </ul>
            </div>
        </div>

        <!-- 오른쪽: 등록된 과정분류 목록 (수정/삭제 가능) -->
        <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">등록된 과정분류 목록</h2>
            </div>
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left min-w-[320px]">
                    <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-4 py-3 min-w-0">과정분류명</th>
                            <th class="px-4 py-3 w-28 sm:w-36 shrink-0">시스템 기본값</th>
                            <th class="px-4 py-3 w-36 sm:w-44 text-right shrink-0">동작</th>
                        </tr>
                    </thead>
                    <tbody id="categoryListBody" class="divide-y divide-slate-100">
                        <tr><td colspan="3" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 수정 모달 -->
    <div id="editCategoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/60">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center">
                <h3 class="text-lg font-black text-slate-800 tracking-tight">분류 수정</h3>
                <button type="button" onclick="closeEditModal()" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <input type="hidden" id="editCategoryId">
                <label class="block text-sm font-bold text-slate-700 mb-2">분류명</label>
                <input type="text" id="editCategoryName" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                <div class="mt-4 flex gap-3">
                    <button type="button" onclick="closeEditModal()" class="flex-1 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</button>
                    <button type="button" id="btnSaveEdit" class="flex-1 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold text-sm transition">저장</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            const tipToggle = document.getElementById('tipToggle');
            const tipContent = document.getElementById('tipContent');
            const tipIcon = document.getElementById('tipIcon');
            if (tipToggle && tipContent) {
                tipToggle.addEventListener('click', function() {
                    const hidden = tipContent.classList.contains('hidden');
                    tipContent.classList.toggle('hidden');
                    if (tipIcon) tipIcon.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
                });
            }

            async function loadCategories() {
                const tbody = document.getElementById('categoryListBody');
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/course-categories', { headers: { 'Authorization': 'Bearer ' + token } });
                    const json = await res.json();
                    if (!json.success) { tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-red-500 break-words">조회 실패</td></tr>'; return; }
                    const list = json.data || [];
                    if (list.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-slate-400">등록된 분류가 없습니다.</td></tr>';
                        return;
                    }
                    tbody.innerHTML = list.map(function(item) {
                        const isSystem = item.is_system_default === 1;
                        const typeLabel = isSystem ? '시스템 기본값' : '사용자 설정값';
                        const nameEsc = (item.name || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
                        const nameDisplay = (item.name || '').replace(/</g, '&lt;');
                        const modBtn = isSystem ? '<span class="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-400 bg-slate-100 whitespace-nowrap">수정 불가</span>' : '<button type="button" class="btn-edit-category inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition whitespace-nowrap" data-id="' + item.id + '" data-name="' + nameEsc + '"><i class="fas fa-pen mr-1"></i>수정</button>';
                        const delBtn = isSystem ? '<span class="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-400 bg-slate-100 whitespace-nowrap ml-1.5">삭제 불가</span>' : '<button type="button" class="btn-delete-category inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition ml-1.5 whitespace-nowrap" data-id="' + item.id + '" data-name="' + nameEsc + '"><i class="fas fa-trash-alt mr-1"></i>삭제</button>';
                        return '<tr class="hover:bg-slate-50/50"><td class="px-4 py-3 font-medium text-slate-800 break-words min-w-0 max-w-[200px] sm:max-w-none">' + nameDisplay + '</td><td class="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">' + typeLabel + '</td><td class="px-4 py-3 text-right whitespace-nowrap">' + modBtn + delBtn + '</td></tr>';
                    }).join('');
                    tbody.querySelectorAll('.btn-edit-category').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.editCategory(parseInt(btn.getAttribute('data-id'), 10), btn.getAttribute('data-name') || ''); });
                    });
                    tbody.querySelectorAll('.btn-delete-category').forEach(function(btn) {
                        btn.addEventListener('click', function() { window.deleteCategory(parseInt(btn.getAttribute('data-id'), 10), btn.getAttribute('data-name') || ''); });
                    });
                } catch (e) {
                    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-red-500">로드 실패</td></tr>';
                }
            }

            window.editCategory = function(id, name) {
                var decoded = (typeof name === 'string' && name) ? name.replace(/&quot;/g, '"').replace(/&lt;/g, '<') : '';
                document.getElementById('editCategoryId').value = id;
                document.getElementById('editCategoryName').value = decoded;
                document.getElementById('editCategoryModal').classList.remove('hidden');
            };
            window.closeEditModal = function() {
                document.getElementById('editCategoryModal').classList.add('hidden');
            };
            window.deleteCategory = async function(id, name) {
                var displayName = (typeof name === 'string' && name) ? name.replace(/&quot;/g, '"').replace(/&lt;/g, '<') : ('ID ' + id);
                if (!confirm('"' + displayName + '" 분류를 삭제하시겠습니까?\\n(해당 분류를 사용 중인 과정이 있으면 삭제할 수 없습니다.)')) return;
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/course-categories/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                    const json = await res.json();
                    if (json.success) { loadCategories(); return; }
                    alert(json.error || '삭제 실패');
                } catch (e) { alert('삭제 중 오류가 발생했습니다.'); }
            };

            document.getElementById('btnRegisterCategory').addEventListener('click', async function() {
                const input = document.getElementById('categoryNameInput');
                const name = (input.value || '').trim();
                if (!name) { alert('분류명을 입력하세요.'); return; }
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/course-categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ name: name })
                    });
                    const json = await res.json();
                    if (json.success) { input.value = ''; loadCategories(); return; }
                    alert(json.error || '등록 실패');
                } catch (e) { alert('등록 중 오류가 발생했습니다.'); }
            });

            document.getElementById('btnSaveEdit').addEventListener('click', async function() {
                const id = document.getElementById('editCategoryId').value;
                const name = (document.getElementById('editCategoryName').value || '').trim();
                if (!name) { alert('분류명을 입력하세요.'); return; }
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/course-categories/' + id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ name: name })
                    });
                    const json = await res.json();
                    if (json.success) { window.closeEditModal(); loadCategories(); return; }
                    alert(json.error || '수정 실패');
                } catch (e) { alert('수정 중 오류가 발생했습니다.'); }
            });

            document.addEventListener('DOMContentLoaded', loadCategories);
        })();
    </script>
    `
  );

export const adminCoursesApprovedHtml = () =>
  courseSubPageLayout(
    'courses-approved',
    '승인받은과정',
    '과정 등록을 위한 기초 데이터 — HRD넷 등 승인받은 과정 목록을 등록·조회합니다.',
    'fa-check-double',
    `
    <!-- SEARCH & TIP -->
    <div class="bento-card bg-sky-50/80 rounded-[2.5rem] border border-sky-200/60 overflow-hidden">
        <button type="button" id="approvedTipToggle" class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sky-50/50 transition">
            <span class="font-black text-slate-800 tracking-tight text-sm uppercase">검색 & 팁</span>
            <i id="approvedTipIcon" class="fas fa-chevron-up text-slate-500 text-sm transition-transform duration-300"></i>
        </button>
        <div id="approvedTipContent" class="px-6 pb-5 pt-0 border-t border-sky-200/40">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">과정분류</label>
                    <select id="approvedFilterCategory" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                        <option value="">전체</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">과정명</label>
                    <input type="text" id="approvedFilterName" placeholder="과정명 검색" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">강사명</label>
                    <input type="text" id="approvedFilterInstructor" placeholder="강사명 검색" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                </div>
                <div class="flex items-end gap-2">
                    <button type="button" id="approvedBtnSearch" class="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition">검색</button>
                    <button type="button" id="approvedBtnReset" class="py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">초기화</button>
                </div>
            </div>
            <div class="flex flex-wrap gap-4 mt-4 items-center">
                <span class="text-xs font-bold text-slate-600">검색기간</span>
                <input type="date" id="approvedFilterFrom" class="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <span class="text-slate-400">~</span>
                <input type="date" id="approvedFilterTo" class="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" id="approvedFilterAllPeriod" class="rounded text-purple-600"> 전체기간</label>
            </div>
        </div>
    </div>

    <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80 flex flex-wrap justify-between items-center gap-3">
            <h2 class="font-black text-slate-800 tracking-tight">승인받은과정</h2>
            <div class="flex items-center gap-2">
                <select id="approvedPageSize" class="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20">
                    <option value="15" selected>15개씩</option>
                    <option value="30">30개씩</option>
                    <option value="50">50개씩</option>
                </select>
                <button type="button" id="approvedBtnRegister" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2">
                    <i class="fas fa-plus"></i> 승인받은 과정 등록
                </button>
                <button type="button" id="approvedBtnRefresh" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">새로고침</button>
            </div>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-sm text-left min-w-[800px]">
                <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                        <th class="px-4 py-3 w-12 shrink-0">No</th>
                        <th class="px-4 py-3 min-w-0">과정명</th>
                        <th class="px-4 py-3 w-32 shrink-0">과정분류</th>
                        <th class="px-4 py-3 w-28 shrink-0">훈련시간</th>
                        <th class="px-4 py-3 w-20 shrink-0">모집인원</th>
                        <th class="px-4 py-3 w-36 shrink-0">바로가기</th>
                        <th class="px-4 py-3 w-24 shrink-0">등록일자</th>
                        <th class="px-4 py-3 w-24 shrink-0">승인기관</th>
                        <th class="px-4 py-3 w-20 shrink-0">상태</th>
                        <th class="px-4 py-3 w-24 shrink-0">강사명</th>
                        <th class="px-4 py-3 w-28 text-right shrink-0">관리</th>
                    </tr>
                </thead>
                <tbody id="approvedListBody" class="divide-y divide-slate-100">
                    <tr><td colspan="11" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                </tbody>
            </table>
        </div>
        <div id="approvedPagination" class="px-6 py-4 border-t border-slate-200/60 flex justify-end items-center gap-2 flex-wrap"></div>
    </div>

    <!-- 등록/수정 모달 -->
    <div id="approvedFormModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200/60 flex flex-col">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center shrink-0">
                <h3 id="approvedFormModalTitle" class="text-lg font-black text-slate-800 tracking-tight">승인받은 과정 등록</h3>
                <button type="button" id="approvedFormModalClose" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                <input type="hidden" id="approvedFormId">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2">
                        <label class="block text-sm font-bold text-slate-700 mb-1">과정명 <span class="text-red-500">*</span></label>
                        <input type="text" id="approvedFormName" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="예: [2026] 퓨전(Fusion) 활동 3D모델링 고급심화">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">과정분류</label>
                        <select id="approvedFormCategory" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                            <option value="">선택</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">모집인원</label>
                        <input type="number" id="approvedFormCapacity" min="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="0">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">훈련시간 (시작)</label>
                        <input type="text" id="approvedFormTimeStart" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="00:00">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">훈련시간 (종료)</label>
                        <input type="text" id="approvedFormTimeEnd" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="00:00">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">강사명</label>
                        <input type="text" id="approvedFormInstructor" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="강사명">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">승인기관</label>
                        <input type="text" id="approvedFormApprovalOrg" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="승인기관">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">등록일자</label>
                        <input type="date" id="approvedFormRegisteredAt" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">상태</label>
                        <select id="approvedFormStatus" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                            <option value="active">활성</option>
                            <option value="inactive">비활성</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-sm font-bold text-slate-700 mb-1">NCS교과 URL</label>
                        <input type="url" id="approvedFormUrlNcs" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-sm font-bold text-slate-700 mb-1">교수계획서 설계 URL</label>
                        <input type="url" id="approvedFormUrlPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-sm font-bold text-slate-700 mb-1">세부교수계획서 설계 URL</label>
                        <input type="url" id="approvedFormUrlDetailPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-slate-200/60 flex gap-3 shrink-0">
                <button type="button" id="approvedFormModalClose2" class="flex-1 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</button>
                <button type="button" id="approvedFormSubmit" class="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition">등록</button>
            </div>
        </div>
    </div>

    <script src="/static/approved-courses.js"></script>
    `
  );

export const adminCoursesSessionsHtml = () =>
  courseSubPageLayout(
    'courses-sessions',
    '회차별 과정개설',
    '과정 등록을 위한 기초 데이터 — 동일 과정의 회차(1기, 2기 등) 개설·관리합니다.',
    'fa-calendar-plus',
    `
    <!-- SEARCH & TIP -->
    <div class="bento-card bg-sky-50/80 rounded-[2.5rem] border border-sky-200/60 overflow-hidden">
        <button type="button" id="sessionsTipToggle" class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sky-50/50 transition">
            <span class="font-black text-slate-800 tracking-tight text-sm uppercase">검색 & 팁</span>
            <i id="sessionsTipIcon" class="fas fa-chevron-up text-slate-500 text-sm transition-transform duration-300"></i>
        </button>
        <div id="sessionsTipContent" class="px-6 pb-5 pt-0 border-t border-sky-200/40">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">과정분류</label>
                    <select id="sessionsFilterCategory" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                        <option value="">전체</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">진행상황</label>
                    <select id="sessionsFilterStatus" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                        <option value="">전체</option>
                        <option value="recruiting">모집중</option>
                        <option value="in_progress">진행중</option>
                        <option value="completed">종료</option>
                        <option value="always_open">상시모집</option>
                        <option value="closed">폐강</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">과정명</label>
                    <input type="text" id="sessionsFilterName" placeholder="과정명 검색" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">강사명</label>
                    <input type="text" id="sessionsFilterInstructor" placeholder="강사명 검색" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                </div>
                <div class="flex items-end gap-2">
                    <label class="block text-xs font-bold text-slate-600 mb-1 w-full">훈련 시작일</label>
                    <input type="date" id="sessionsFilterTrainingStart" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
                <button type="button" id="sessionsBtnSearch" class="py-2.5 px-4 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition">검색</button>
                <button type="button" id="sessionsBtnReset" class="py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">초기화</button>
            </div>
        </div>
    </div>

    <!-- 진행상황 통계 -->
    <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden p-6">
        <p class="text-xs text-slate-500 mb-3">위 검색 조건에 따라 진행상황 통계가 바뀌며, 통계 값을 선택하면 해당 진행상황의 과정만 표시됩니다.</p>
        <div id="sessionsStats" class="flex flex-wrap gap-3">
            <span class="text-slate-400 text-sm">로딩 중...</span>
        </div>
    </div>

    <div class="bento-card bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80 flex flex-wrap justify-between items-center gap-3">
            <h2 class="font-black text-slate-800 tracking-tight">회차별 과정개설</h2>
            <div class="flex items-center gap-2">
                <select id="sessionsPageSize" class="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20">
                    <option value="15" selected>15개씩</option>
                    <option value="30">30개씩</option>
                    <option value="50">50개씩</option>
                </select>
                <span id="sessionsSummary" class="text-sm text-slate-600 hidden sm:inline">Showing 0 entries</span>
                <button type="button" id="sessionsBtnRegister" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2">
                    <i class="fas fa-plus"></i> 글등록
                </button>
                <button type="button" id="sessionsBtnRefresh" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">새로고침</button>
            </div>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-sm text-left min-w-[800px]">
                <thead class="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                        <th class="px-4 py-3 w-12 shrink-0">No</th>
                        <th class="px-4 py-3 min-w-0">과정명</th>
                        <th class="px-4 py-3 w-20 shrink-0">회차</th>
                        <th class="px-4 py-3 w-24 shrink-0">진행상황</th>
                        <th class="px-4 py-3 w-40 shrink-0">훈련 시작일</th>
                        <th class="px-4 py-3 w-40 shrink-0">바로가기</th>
                        <th class="px-4 py-3 w-24 shrink-0">등록일자</th>
                        <th class="px-4 py-3 w-28 text-right shrink-0">관리</th>
                    </tr>
                </thead>
                <tbody id="sessionsListBody" class="divide-y divide-slate-100">
                    <tr><td colspan="8" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                </tbody>
            </table>
        </div>
        <div id="sessionsPagination" class="px-6 py-4 border-t border-slate-200/60 flex justify-end items-center gap-2 flex-wrap"></div>
    </div>

    <!-- 등록/수정 모달 -->
    <div id="sessionsFormModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-slate-200/60 flex flex-col">
            <div class="p-6 border-b border-slate-200/60 flex justify-between items-center shrink-0">
                <h3 id="sessionsFormModalTitle" class="text-lg font-black text-slate-800 tracking-tight">회차 등록</h3>
                <button type="button" id="sessionsFormModalClose" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                <input type="hidden" id="sessionsFormId">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">승인받은 과정 <span class="text-red-500">*</span></label>
                        <select id="sessionsFormApprovedCourse" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                            <option value="">선택</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">회차 <span class="text-red-500">*</span></label>
                        <input type="number" id="sessionsFormSessionNumber" min="1" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="1">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">진행상황</label>
                        <select id="sessionsFormStatus" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                            <option value="recruiting">모집중</option>
                            <option value="in_progress">진행중</option>
                            <option value="completed">종료</option>
                            <option value="always_open">상시모집</option>
                            <option value="closed">폐강</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">훈련 시작일</label>
                        <input type="date" id="sessionsFormTrainingStart" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">훈련 종료일</label>
                        <input type="date" id="sessionsFormTrainingEnd" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">등록일자</label>
                        <input type="date" id="sessionsFormRegisteredAt" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">NCS교과 URL</label>
                        <input type="url" id="sessionsFormUrlNcs" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">교수계획서 실행 URL</label>
                        <input type="url" id="sessionsFormUrlPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">세부교수계획서 실행 URL</label>
                        <input type="url" id="sessionsFormUrlDetailPlan" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="https://">
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-slate-200/60 flex gap-3 shrink-0">
                <button type="button" id="sessionsFormModalClose2" class="flex-1 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition">취소</button>
                <button type="button" id="sessionsFormSubmit" class="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition">등록</button>
            </div>
        </div>
    </div>

    <script src="/static/course-sessions.js"></script>
    `
  );

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
                <h2 class="font-black text-slate-800 tracking-tight">복사할 과정 선택</h2>
            </div>
            <div class="p-6">
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" placeholder="과정명 검색..." class="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <ul class="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <li class="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm font-medium text-slate-700 cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition">검색 후 목록에서 선택하세요</li>
                </ul>
            </div>
        </div>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                <h2 class="font-black text-slate-800 tracking-tight">복사 옵션</h2>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">새 회차명</label>
                    <input type="text" placeholder="예: 2025년 1기" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">복사할 항목</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> 교육일정</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> 강의계획</label>
                        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded text-purple-600"> NCS 능력단위</label>
                    </div>
                </div>
                <button class="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <i class="fas fa-copy"></i> 과정 복사 실행
                </button>
            </div>
        </div>
    </div>
    <p class="text-sm text-slate-500 text-center">기초 데이터로 복사한 회차는 과정등록 시 바로 사용할 수 있습니다.</p>
    `
  );
