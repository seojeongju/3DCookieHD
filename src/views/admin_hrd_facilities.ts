import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdFacilitiesHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련시설 관리 - HRD 행정시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .drawer-shadow { box-shadow: -4px 0 25px rgba(0,0,0,0.1); }
        .glass-effect { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 h-screen flex overflow-hidden">
    ${hrdSidebar('facilities')}
    
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 z-20">
            <div class="flex items-center gap-3">
                <div class="bg-blue-600 text-white p-2 rounded-lg shadow-sm shadow-blue-200">
                    <i class="fas fa-building fa-lg"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 leading-tight">훈련시설 관리</h1>
                    <p class="text-xs text-gray-500 font-medium">Facilities Management</p>
                </div>
            </div>
            
            <div class="flex items-center gap-3">
                <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button onclick="setView('grid')" id="viewBtnGrid" class="px-3 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm bg-white text-gray-800"><i class="fas fa-th-large mr-2"></i>그리드</button>
                    <button onclick="setView('list')" id="viewBtnList" class="px-3 py-1.5 rounded-md text-sm font-semibold transition-all text-gray-500 hover:text-gray-800"><i class="fas fa-list mr-2"></i>리스트</button>
                </div>
                <div class="w-px h-8 bg-gray-200 mx-2"></div>
                <button onclick="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 transform active:scale-95">
                    <i class="fas fa-plus"></i>
                    <span>시설 등록</span>
                </button>
            </div>
        </header>

        <!-- Filters -->
        <div class="px-8 py-5 flex items-center justify-between gap-4">
            <div class="relative w-96 group">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchInput" placeholder="시설명, 관리자, 위치 검색..." 
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    onkeyup="if(event.key === 'Enter') loadFacilities()">
            </div>
            
            <div class="flex items-center gap-3">
                <select id="statusFilter" onchange="loadFacilities()" class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none shadow-sm h-[42px]">
                    <option value="all">전체 상태</option>
                    <option value="양호">🟢 운영중 (양호)</option>
                    <option value="점검필요">🟡 점검필요</option>
                    <option value="수리중">🔴 수리/보수중</option>
                </select>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto px-8 pb-8" id="mainContainer">
            <!-- Grid View -->
            <div id="gridView" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                <!-- Cards Injected Here -->
            </div>

            <!-- List View -->
            <div id="listView" class="hidden bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th class="px-6 py-4 w-24">이미지</th>
                            <th class="px-6 py-4">시설명/설명</th>
                            <th class="px-6 py-4">면적 (m²)</th>
                            <th class="px-6 py-4">관리자</th>
                            <th class="px-6 py-4">상태</th>
                            <th class="px-6 py-4">최종점검</th>
                            <th class="px-6 py-4 w-32 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody id="listBody" class="divide-y divide-gray-50"></tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Right Drawer (Detail) -->
    <div id="drawerOverlay" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 hidden transition-opacity opacity-0" onclick="closeDrawer()"></div>
    <div id="drawer" class="fixed inset-y-0 right-0 w-[600px] bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out drawer-shadow flex flex-col">
        <!-- Drawer Header -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white z-10">
            <h2 class="text-lg font-bold text-gray-900">시설 상세 정보</h2>
            <div class="flex items-center gap-2">
                <button onclick="deleteFacility()" class="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"><i class="fas fa-trash-alt mr-1"></i>삭제</button>
                <button onclick="closeDrawer()" class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"><i class="fas fa-times text-xl"></i></button>
            </div>
        </div>
        
        <!-- Drawer Content Container (Dynamic) -->
        <div id="drawerContent" class="flex-1 overflow-y-auto bg-gray-50 relative">
            <!-- Initial Loading State -->
            <div class="flex items-center justify-center h-full text-gray-400">
                <i class="fas fa-circle-notch fa-spin mr-2"></i> 로딩중...
            </div>
        </div>
    </div>

    <!-- Create Modal -->
    <div id="createModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 class="text-lg font-bold text-gray-900">새 훈련시설 등록</h3>
                <button onclick="closeCreateModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">시설명 <span class="text-red-500">*</span></label>
                    <input type="text" id="newFacName" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="예: 제1강의실">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">면적 (m²)</label>
                        <input type="number" id="newFacArea" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="45.5">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">정 관리자</label>
                        <input type="text" id="newFacManager" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="이름">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="newFacDesc" rows="3" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="시설에 대한 간략한 설명"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">시설 이미지</label>
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                            <span class="text-gray-400 text-[10px] text-center p-2" id="newFacImagePlaceholder">이미지 없음</span>
                            <img id="newFacImagePreview" src="" class="w-full h-full object-cover hidden">
                            <button type="button" onclick="clearNewFacImage()" class="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hidden group-hover:block hover:bg-red-50 text-red-500">
                                <i class="fas fa-times text-xs"></i>
                            </button>
                        </div>
                        <div class="flex-1">
                             <input type="hidden" id="newFacImageUrl">
                             <input type="file" id="newFacImageFile" accept="image/*" class="hidden" onchange="handleNewFacImage(this)">
                             <button type="button" onclick="document.getElementById('newFacImageFile').click()" class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center shadow-sm">
                                <i class="fas fa-camera mr-2"></i> 이미지 업로드
                             </button>
                             <p class="text-[10px] text-gray-500 mt-1">800x600 권장 (자동 최적화)</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 flex justify-end gap-2">
                <button onclick="closeCreateModal()" class="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-200 rounded-lg transition-colors">취소</button>
                <button onclick="createFacility()" class="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md transition-all">등록하기</button>
            </div>
        </div>
    </div>

    <!-- Main Logic Script -->
    <!-- Script will be injected here -->
            <script>
        let facilities = [];
        let currentDetailId = null;
        let currentTab = 'info';

        document.addEventListener('DOMContentLoaded', () => {
            loadFacilities();
        });

        function setView(mode) {
            document.getElementById('gridView').classList.toggle('hidden', mode !== 'grid');
            document.getElementById('listView').classList.toggle('hidden', mode !== 'list');
            document.getElementById('viewBtnGrid').className = mode === 'grid' ? 'px-3 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm bg-white text-gray-800' : 'px-3 py-1.5 rounded-md text-sm font-semibold transition-all text-gray-500 hover:text-gray-800';
            document.getElementById('viewBtnList').className = mode === 'list' ? 'px-3 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm bg-white text-gray-800' : 'px-3 py-1.5 rounded-md text-sm font-semibold transition-all text-gray-500 hover:text-gray-800';
        }

        async function loadFacilities() {
            try {
                const search = document.getElementById('searchInput').value;
                const status = document.getElementById('statusFilter').value;
                let url = '/api/hrd/facilities?';
                if(search) url += 'search=' + encodeURIComponent(search) + '&';
                
                const res = await fetch(url);
                const json = await res.json();
                
                if(json.success) {
                    facilities = json.data;
                    if(status !== 'all') {
                        facilities = facilities.filter(f => f.status === status);
                    }
                    renderFacilities();
                }
            } catch(e) { console.error(e); }
        }

        function renderFacilities() {
            const grid = document.getElementById('gridView');
            const listBody = document.getElementById('listBody');
            
            if(facilities.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-400">등록된 훈련시설이 없습니다.</div>';
                listBody.innerHTML = '<tr><td colspan="7" class="text-center py-20 text-gray-400">등록된 훈련시설이 없습니다.</td></tr>';
                return;
            }

            // Grid Render
            grid.innerHTML = facilities.map(f => \`
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group" onclick="openDrawer(\${f.id})" >
        <div class="h-40 bg-gray-100 relative overflow-hidden flex items-center justify-center">
            \${
                f.image_url
                ? \`<img src="\${f.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">\`
                : '<i class="fas fa-building text-4xl text-gray-300 group-hover:scale-110 transition-transform duration-500"></i>'
}
<div class="absolute top-3 right-3" >
    \${ getStatusBadge(f.status) }
</div>
    </div>
    <div class="p-5" >
        <h3 class="font-bold text-gray-900 text-lg mb-1 truncate" > \${ f.name } </h3>
            <div class="flex items-center text-xs text-gray-500 mb-4 space-x-3" >
                <span><i class="fas fa-ruler-combined mr-1" > </i>\${f.area || '-'}m²</span>
                    <span><i class="fas fa-user-tie mr-1" > </i>\${f.manager_main || '미지정'}</span>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-gray-100" >
                            <span class="text-xs text-gray-400" > 최종점검: \${ f.last_check ? f.last_check.split(' ')[0] : '-' } </span>
                                <span class="text-blue-600 text-xs font-bold group-hover:underline" > 상세보기 <i class="fas fa-arrow-right ml-1"></i></span>
                                    </div>
                                    </div>
                                    </div>
                                        \`).join('');

            // List Render
            listBody.innerHTML = facilities.map(f => \`
                                    <tr class="hover:bg-gray-50 transition-colors cursor-pointer text-gray-700" onclick="openDrawer(\${f.id})" >
                                        <td class="px-6 py-4" >
                                            <div class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden" >
                                                \${ f.image_url ? \`<img src="\${f.image_url}" class="w-full h-full object-cover">\` : '<i class="fas fa-building"></i>' }
</div>
    </td>
    <td class="px-6 py-4" >
        <div class="font-bold text-gray-900" > \${ f.name } </div>
            <div class="text-xs text-gray-500 truncate w-48" > \${ f.description || '' } </div>
                </td>
                <td class="px-6 py-4 text-gray-600" > \${ f.area || '-' } </td>
                    <td class="px-6 py-4 text-gray-600" > \${ f.manager_main || '-' } </td>
                        <td class="px-6 py-4" > \${ getStatusBadge(f.status) } </td>
                            <td class="px-6 py-4 text-gray-500 text-sm" > \${ f.last_check ? f.last_check.split(' ')[0] : '-' } </td>
                                <td class="px-6 py-4 text-right" >
                                    <button class="text-gray-400 hover:text-blue-600" > <i class="fas fa-chevron-right" > </i></button>
                                        </td>
                                        </tr>
                                            \`).join('');
            
            // Stats update
            // document.getElementById('totalCount').innerText = facilities.length; // If stats exist
        }

        function getStatusBadge(status) {
            if(status === '양호') return '<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-green-600/20">🟢 양호</span>';
            if(status === '점검필요') return '<span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-yellow-600/20">🟡 점검필요</span>';
            return '<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-red-600/20">🔴 수리중</span>';
        }

        async function openDrawer(id) {
            currentDetailId = id;
            const drawer = document.getElementById('drawer');
            const overlay = document.getElementById('drawerOverlay');
            const content = document.getElementById('drawerContent');
            
            drawer.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);

            try {
                // Fetch details
                const [resFac, resItems, resLogs, resImages] = await Promise.all([
                    fetch('/api/hrd/facilities/' + id).then(r => r.json()),
                    fetch('/api/hrd/facilities/' + id + '/items').then(r => r.json()),
                    fetch('/api/hrd/facilities/' + id + '/maintenance').then(r => r.json()),
                    fetch('/api/hrd/facilities/' + id + '/images').then(r => r.json()),
                ]);

                let facility = resFac.success ? resFac.data : null;
                // Fallback to list object if API empty (though API now updated to return image)
                // If the single GET api doesn't return image_url, we should merge from list if needed, 
                // but simpler to assuming individual re-fetch is okay.
                // NOTE: GET /facilities/:id might not be updated to return image_url yet. 
                // We use resImages to get the latest image.
                const latestImage = (resImages.success && resImages.data.length > 0) ? resImages.data[0].url : null;
                
                if(!facility && facilities.length > 0) facility = facilities.find(f => f.id === id); 
                if(!facility) { content.innerHTML = '<div class="p-10 text-center text-red-500">정보를 불러올 수 없습니다.</div>'; return; }

                // Use latest uploaded image or fallback or existing property
                const displayImage = latestImage || facility.image_url;

                content.innerHTML = \`
                                        <!--Hero Image Area-->
                                            <div class="relative h-48 bg-gray-200 group shrink-0 overflow-hidden" >
                                                \${
                                                    displayImage
                                                        ? \`<img src="\${displayImage}" class="absolute inset-0 w-full h-full object-cover">
                               <div class="absolute inset-0 bg-black/40"></div>\`
                                                        : \`<div class="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-400"><i class="fas fa-image text-4xl"></i></div>
                               <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>\`
}

<div class="absolute inset-0 flex flex-col justify-end p-6 z-10">
    <div class="mb-2 self-start" > \${ getStatusBadge(facility.status) } </div>
        <h3 class="text-2xl font-bold text-white leading-tight drop-shadow-md" > \${ facility.name } </h3>
            <p class="text-white/90 text-sm mt-1 font-medium bg-black/20 inline-block px-2 py-1 rounded backdrop-blur-sm" > \${ facility.area || 0 } m² | \${ facility.manager_main || '관리자 미지정' } </p>
                </div>

                <!--Upload Button-->
                    <div class="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="triggerImageUpload()" class="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur text-sm font-bold flex items-center px-3" >
                            <i class="fas fa-camera mr-2" > </i> 사진 변경
                                </button>
                                <input type="file" id = "imageInput" class="hidden" accept = "image/*" onchange="uploadImage(this)" >
                                    </div>
                                    </div>

                                    <!--Tabs -->
                                        <div class="flex border-b border-gray-200 px-6 shrink-0 bg-white sticky top-0 z-10 shadow-sm" >
                                            <button onclick="switchTab('info')" id = "tabInfo" class="py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 px-4 transition-colors" > 기본 정보 </button>
                                                <button onclick="switchTab('items')" id = "tabItems" class="py-4 text-sm font-medium text-gray-500 hover:text-gray-800 px-4 transition-colors border-b-2 border-transparent" > 보유 비품 </button>
                                                    <button onclick="switchTab('logs')" id = "tabLogs" class="py-4 text-sm font-medium text-gray-500 hover:text-gray-800 px-4 transition-colors border-b-2 border-transparent" > 유지보수 이력 </button>
                                                        </div>

                                                        <!--Content -->
                                                            <div class="p-6 space-y-6 bg-gray-50 min-h-[500px]" >
                                                                <!--Info Tab-->
                                                                    <div id="contentInfo" class="space-y-6 animate-fade-in" >
                                                                        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5" >
                                                                            <h4 class="font-bold text-gray-800 text-sm border-b pb-3 flex justify-between items-center" >
                                                                                시설 정보 수정
                                                                                    <span class="text-xs font-normal text-gray-400" > <i class="fas fa-info-circle mr-1" > </i>자동 저장됩니다</span>
                                                                                        </h4>
                                                                                        <div class="space-y-4" >
                                                                                            <div>
                                                                                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 시설명 </label>
                                                                                                <input type="text" value = "\${facility.name}" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors" onchange="updateFacility(this.value, 'name')" >
                                                                                                    </div>
                                                                                                    <div class="grid grid-cols-2 gap-4" >
                                                                                                        <div>
                                                                                                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 상태 </label>
                                                                                                            <select onchange="updateFacility(this.value, 'status')" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100" >
                                                                                                                <option value="양호" \${ facility.status === '양호' ? 'selected' : '' }>🟢 양호 </option>
                                                                                                                    <option value = "점검필요" \${ facility.status === '점검필요' ? 'selected' : '' }>🟡 점검필요 </option>
                                                                                                                        <option value = "수리중" \${ facility.status === '수리중' ? 'selected' : '' }>🔴 수리중 </option>
                                                                                                                            </select>
                                                                                                                            </div>
                                                                                                                            <div>
                                                                                                                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 면적(m²) </label>
                                                                                                                                <input type="number" value = "\${facility.area || ''}" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100" onchange="updateFacility(this.value, 'area')" >
                                                                                                                                    </div>
                                                                                                                                    </div>
                                                                                                                                    <div class="grid grid-cols-2 gap-4" >
                                                                                                                                        <div>
                                                                                                                                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 정 관리자 </label>
                                                                                                                                            <input type="text" value = "\${facility.manager_main || ''}" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100" onchange="updateFacility(this.value, 'manager_main')" >
                                                                                                                                                </div>
                                                                                                                                                 <div>
                                                                                                                                                 <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 부 관리자 </label>
                                                                                                                                                     <input type="text" value = "\${facility.manager_sub || ''}" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100" onchange="updateFacility(this.value, 'manager_sub')" >
                                                                                                                                                         </div>
                                                                                                                                                         </div>
                                                                                                                                                         <div>
                                                                                                                                                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1" > 설명 </label>
                                                                                                                                                             <textarea rows="4" class="w-full border-gray-200 bg-gray-50 rounded-lg text-sm px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none" onchange="updateFacility(this.value, 'description')" > \${ facility.description || '' } </textarea>
                                                                                                                                                                 </div>
                                                                                                                                                                 <div>
                                                                                                                                                                 <label class="block text-xs font-bold text-gray-500 uppercase mb-2" > 시설 이미지 </label>
                                                                                                                                                                 <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200" >
                                                                                                                                                                     <div class="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative group" >
                                                                                                                                                                         <img id="editFacImagePreview" src="\${displayImage || ''}" class="w-full h-full object-cover \${displayImage ? '' : 'hidden'}" >
                                                                                                                                                                         <i class="fas fa-image text-gray-300 \${displayImage ? 'hidden' : ''}" id="editFacImagePlaceholder" > </i>
                                                                                                                                                                     </div>
                                                                                                                                                                     <div class="flex-1" >
                                                                                                                                                                         <button onclick="triggerImageUpload()" class="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center" >
                                                                                                                                                                             <i class="fas fa-camera mr-2" > </i> 사진 변경
                                                                                                                                                                         </button>
                                                                                                                                                                         <p class="text-[10px] text-gray-500 mt-1" > 이미지를 즉시 업데이트합니다. </p>
                                                                                                                                                                     </div>
                                                                                                                                                                 </div>
                                                                                                                                                                 </div>
                                                                                                                                                                 </div>
                                                                                                                                                                 </div>

                                                                                                                                                                <!--Items Tab(Unchanged)-->
                                                                                                                                                                    <div id="contentItems" class="hidden space-y-4 animate-fade-in" >
                                                                                                                                                                        \${resItems.success && resItems.data.length > 0 ? resItems.data.map(item => \`
                                <div class="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center text-sm shadow-sm hover:shadow-md transition-shadow">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">\${item.quantity}</div>
                                        <div>
                                            <div class="font-bold text-gray-900">\${item.name}</div>
                                            <div class="text-xs text-gray-500 mt-0.5">\${item.model || '-'} | <span class="\${item.status === 'good' ? 'text-green-600' : 'text-orange-600'}">\${item.status}</span></div>
                                        </div>
                                    </div>
                                    <span class="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">\${item.category === 'textbook' ? '교재' : '비품/장비'}</span>
                                </div>
                            \`).join('') : '<div class="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">등록된 비품이 없습니다.</div>'
    }
</div>

    <!--Logs Tab(Unchanged)-->
        <div id="contentLogs" class="hidden space-y-4 animate-fade-in" >
            <div class="grid grid-cols-2 gap-3 mb-4" >
                <button onclick="addLog('check')" class="bg-white border-2 border-gray-100 text-blue-600 font-bold text-sm py-3 rounded-xl hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm" > <i class="fas fa-check mr-2" > </i> 점검 기록 추가</button>
                    <button onclick="addLog('repair')" class="bg-white border-2 border-gray-100 text-orange-600 font-bold text-sm py-3 rounded-xl hover:border-orange-100 hover:bg-orange-50 transition-all shadow-sm" > <i class="fas fa-tools mr-2" > </i> 수리 요청 추가</button>
                        </div>
                        <div id="logsContainer" class="space-y-3">
                            \${
                                resLogs.success && resLogs.data.length > 0 ? resLogs.data.map(log => \`
                                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative pl-4 border-l-4 \${log.status === 'repair' ? 'border-l-orange-500' : 'border-l-green-500'}">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \${log.status === 'repair' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}">\${log.status === 'repair' ? '수리' : '점검'}</span>
                                        <span class="text-xs text-gray-400 font-mono">\${log.date ? log.date.split('T')[0] : '-'}</span>
                                    </div>
                                    <h5 class="font-bold text-gray-800 text-sm mb-1">\${log.title}</h5>
                                    <p class="text-xs text-gray-600 leading-relaxed">\${log.memo || '내용 없음'}</p>
                                    \${log.price ? \`<div class="mt-3 pt-2 border-t border-gray-100 text-xs font-bold text-gray-700 text-right">비용: ₩ \${log.price.toLocaleString()}</div>\` : ''}
                                </div>
                            \`).join('') : '<div class="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">유지보수 이력이 없습니다.</div>'
}
</div>
    </div>
    </div>
        \`;

            } catch(e) {
                console.error(e);
                content.innerHTML = '<div class="p-10 text-center text-red-500">오류가 발생했습니다.</div>';
            }
        }

        // Functions (closeDrawer, switchTab, updateFacility) are same as before
        function closeDrawer() {
            document.getElementById('drawer').classList.add('translate-x-full');
            document.getElementById('drawerOverlay').classList.add('opacity-0');
            setTimeout(() => {
                document.getElementById('drawerOverlay').classList.add('hidden');
                document.getElementById('drawerContent').innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><i class="fas fa-circle-notch fa-spin mr-2"></i> 로딩중...</div>';
            }, 300);
            currentDetailId = null;
        }

        function switchTab(tab) {
            currentTab = tab;
            ['Info', 'Items', 'Logs'].forEach(t => {
                const btn = document.getElementById('tab' + t);
                const content = document.getElementById('content' + t);
                if(t.toLowerCase() === tab) {
                    btn.classList.add('text-blue-600', 'border-blue-600');
                    btn.classList.remove('text-gray-500', 'border-transparent');
                    content.classList.remove('hidden');
                } else {
                    btn.classList.remove('text-blue-600', 'border-blue-600');
                    btn.classList.add('text-gray-500', 'border-transparent');
                    content.classList.add('hidden');
                }
            });
        }

        async function updateFacility(value, field) {
            if(!currentDetailId) return;
            try {
                const current = facilities.find(f => f.id === currentDetailId) || {};
                const data = { ...current, [field]: value };
                current[field] = value; 
                await fetch('/api/hrd/facilities', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                loadFacilities(); 
            } catch(e) { console.error(e); }
        }

        function openCreateModal() {
            document.getElementById('createModal').classList.remove('hidden');
            document.getElementById('newFacName').value = '';
            document.getElementById('newFacArea').value = '';
            document.getElementById('newFacManager').value = '';
            document.getElementById('newFacDesc').value = '';
            clearNewFacImage();
        }

        function closeCreateModal() {
            document.getElementById('createModal').classList.add('hidden');
        }

        function handleNewFacImage(input) {
            if(!input.files || !input.files[0]) return;
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    document.getElementById('newFacImageUrl').value = dataUrl;
                    document.getElementById('newFacImagePreview').src = dataUrl;
                    document.getElementById('newFacImagePreview').classList.remove('hidden');
                    document.getElementById('newFacImagePlaceholder').classList.add('hidden');
                }
            }
        }

        function clearNewFacImage() {
            document.getElementById('newFacImageUrl').value = '';
            document.getElementById('newFacImagePreview').src = '';
            document.getElementById('newFacImagePreview').classList.add('hidden');
            document.getElementById('newFacImagePlaceholder').classList.remove('hidden');
            document.getElementById('newFacImageFile').value = '';
        }

        async function createFacility() {
            const name = document.getElementById('newFacName').value;
            const area = document.getElementById('newFacArea').value;
            const managerMain = document.getElementById('newFacManager').value;
            const description = document.getElementById('newFacDesc').value;
            const image_url = document.getElementById('newFacImageUrl').value;
            
            if(!name) { alert('시설명을 입력해주세요.'); return; }

            try {
                const res = await fetch('/api/hrd/facilities', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, area, managerMain, description, image_url })
                });
                const result = await res.json();
                if(result.success) {
                    closeCreateModal();
                    loadFacilities();
                } else {
                    alert('등록 실패: ' + result.error);
                }
            } catch(e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
        async function deleteFacility() {
            if(!currentDetailId || !confirm('정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) return;
            try { await fetch('/api/hrd/facilities/' + currentDetailId, { method: 'DELETE' }); closeDrawer(); alert('삭제되었습니다.'); loadFacilities(); } catch(e) { console.error(e); }
        }
        async function addLog(type) {
             const title = prompt(type === 'check' ? '점검 내용을 입력하세요:' : '수리 요청 내용을 입력하세요:');
             if(!title) return;
             const price = type === 'repair' ? prompt('비용이 발생했나요? (숫자만 입력, 없으면 0)', '0') : '0';
             try {
                await fetch('/api/hrd/facilities/' + currentDetailId + '/maintenance', {
                    method: 'POST', headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ status: type === 'repair' ? 'repair' : 'check', title: title, price: price, memo: '', date: new Date().toISOString() })
                }); openDrawer(currentDetailId);
             } catch(e) { console.error(e); }
        }

        // Image Upload Logic
        function triggerImageUpload() {
            document.getElementById('imageInput').click();
        }

        async function uploadImage(input) {
            if(!input.files || !input.files[0]) return;
            const file = input.files[0];
            
            // Client-side Resize to avoid huge payload
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    // Send to API
                    fetch('/api/hrd/facilities/' + currentDetailId + '/images', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            name: file.name,
                            size: Math.round(dataUrl.length * 0.75),
                            url: dataUrl
                        })
                    })
                    .then(res => res.json())
                    .then(json => {
                        if(json.success) {
                            // alert('이미지가 등록되었습니다.');
                            openDrawer(currentDetailId); // Reload drawer to show new image
                            loadFacilities(); // Reload list to show thumbnail
                        } else {
                            alert('이미지 업로드 실패: ' + (json.error || 'Unknown error'));
                        }
                    })
                    .catch(console.error);
                }
            }
        }
    </script>
</body>
</html>
`;

