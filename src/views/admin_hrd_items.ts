import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdItemsHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>물품 관리 - HRD 행정시스템</title>
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
        <!-- 사이드바 -->
        ${hrdSidebar('items')}

        <!-- 메인 콘텐츠 -->
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">물품 관리</h2>
                    <span class="ml-4 text-sm text-gray-500">교재, 비품, 장비, 소모품 등 자산 및 재고 관리</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="openModal('createItemModal')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                        <i class="fas fa-plus mr-2"></i> 물품 등록
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
                <!-- 상단 탭 및 필터 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <!-- 탭 메뉴 -->
                        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            <button onclick="filterCategory('all')" id="tab-all" class="px-4 py-2 text-sm font-medium rounded-md bg-white text-blue-600 shadow-sm transition-all">전체</button>
                            <button onclick="filterCategory('textbook')" id="tab-textbook" class="px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-all">교재</button>
                            <button onclick="filterCategory('equipment')" id="tab-equipment" class="px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-all">비품/장비</button>
                            <button onclick="filterCategory('consumable')" id="tab-consumable" class="px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-all">소모품</button>
                        </div>

                        <!-- 검색 -->
                        <div class="relative w-full md:w-64">
                            <input type="text" id="searchInput" placeholder="물품명 또는 관리번호 검색" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                <!-- 물품 목록 테이블 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 w-16">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                </th>
                                <th class="px-6 py-4 w-20">이미지</th>
                                <th class="px-6 py-4">구분</th>
                                <th class="px-6 py-4">물품명</th>
                                <th class="px-6 py-4">규격/모델명</th>
                                <th class="px-6 py-4 w-24">수량/재고</th>
                                <th class="px-6 py-4">위치/보관장소</th>
                                <th class="px-6 py-4 w-24">상태</th>
                                <th class="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody id="itemsTableBody" class="divide-y divide-gray-100">
                            <!-- 데이터 로드 시 여기에 표시 -->
                            <tr>
                                <td colspan="8" class="px-6 py-10 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div id="paginationContainer" class="flex justify-center mt-6 h-8"></div>
            </main>
        </div>
    </div>

    <!-- 물품 등록/수정 모달 -->
    <div id="createItemModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden transform transition-all">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800" id="modalTitle">물품 등록</h3>
                <button onclick="closeModal('createItemModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <form id="itemForm" onsubmit="handleSaveItem(event)" class="p-6 space-y-4">
                <input type="hidden" name="id" id="itemId">
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">구분 <span class="text-red-500">*</span></label>
                    <select name="category" id="itemCategory" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option value="textbook">교재</option>
                        <option value="equipment">비품/장비</option>
                        <option value="consumable">소모품</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">물품명 <span class="text-red-500">*</span></label>
                    <input type="text" name="name" id="itemName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="예: 3D프린터 운용기능사 필기">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">물품 이미지</label>
                    <div class="flex items-center gap-4">
                        <div class="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                            <span class="text-gray-400 text-xs text-center p-2" id="imagePlaceholder">이미지<br>없음</span>
                            <img id="itemImagePreview" src="" class="w-full h-full object-cover hidden">
                            <button type="button" onclick="clearItemImage()" class="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hidden group-hover:block hover:bg-red-50 text-red-500">
                                <i class="fas fa-times text-xs"></i>
                            </button>
                        </div>
                        <div class="flex-1">
                             <input type="hidden" name="image_url" id="itemImageUrl">
                             <input type="file" id="itemImageFile" accept="image/*" class="hidden" onchange="handleItemImage(this)">
                             <button type="button" onclick="document.getElementById('itemImageFile').click()" class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-camera mr-2"></i> 이미지 업로드
                             </button>
                             <p class="text-xs text-gray-500 mt-2">1MB 이하 권장</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">규격/모델명</label>
                        <input type="text" name="model" id="itemModel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">수량 <span class="text-red-500">*</span></label>
                        <input type="number" name="quantity" id="itemQuantity" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">보관 장소</label>
                        <input type="text" name="location" id="itemLocation" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="예: 제1강의실">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
                        <select name="status" id="itemStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <option value="good">양호</option>
                            <option value="repair">수리필요</option>
                            <option value="discard">폐기예정</option>
                            <option value="shortage">부족</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">비고</label>
                    <textarea name="memo" id="itemMemo" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                </div>

                <div class="pt-4 flex justify-end space-x-3">
                    <button type="button" onclick="closeModal('createItemModal')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">저장하기</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- 대여 관리 모달 (고도화) -->
    <div id="rentalHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden h-[80vh] flex flex-col">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800">대여/반납 관리 (<span id="rentalItemName" class="text-blue-600"></span>)</h3>
                <button onclick="closeModal('rentalHistoryModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <!-- 신규 대여 폼 -->
                <div class="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                    <h4 class="font-bold text-blue-800 mb-2 text-sm"><i class="fas fa-plus-circle mr-1"></i> 신규 대여 등록</h4>
                    <form onsubmit="handleRentItem(event)" id="rentForm" class="flex flex-col sm:flex-row gap-2 sm:items-end">
                        <input type="hidden" id="rentItemId">
                        <div class="flex-1">
                            <label class="block text-xs text-gray-600 mb-1">대여자 이름 <span class="text-red-500">*</span></label>
                            <input type="text" name="user_name" required class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500">
                        </div>
                        <div class="flex-1">
                            <label class="block text-xs text-gray-600 mb-1">연락처</label>
                            <input type="text" name="phone" placeholder="010-0000-0000" class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500">
                        </div>
                         <div class="flex-1">
                            <label class="block text-xs text-gray-600 mb-1">메모</label>
                            <input type="text" name="memo" class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500">
                        </div>
                        <button type="submit" class="w-full sm:w-auto px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium h-[34px]">대여</button>
                    </form>
                </div>

                <!-- 대여 이력 테이블 -->
                <h4 class="font-bold text-gray-800 mb-2 text-sm">대여 이력</h4>
                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th class="px-4 py-2">상태</th>
                                <th class="px-4 py-2">대여자</th>
                                <th class="px-4 py-2">연락처</th>
                                <th class="px-4 py-2">대여일시</th>
                                <th class="px-4 py-2">반납일시</th>
                                <th class="px-4 py-2 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody id="rentalListBody" class="divide-y divide-gray-100">
                             <tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">이력을 불러오는 중...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 text-right">
                <button onclick="closeModal('rentalHistoryModal')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">닫기</button>
            </div>
        </div>
    </div>

    <script>
        let currentCategory = 'all';
        let currentPage = 1;

        document.addEventListener('DOMContentLoaded', () => {
            loadItems();
        });

        function filterCategory(category) {
            currentCategory = category;
            
            document.querySelectorAll('[id^="tab-"]').forEach(el => {
                el.className = 'px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-all';
            });
            const activeTab = document.getElementById('tab-' + category);
            if (activeTab) {
                activeTab.className = 'px-4 py-2 text-sm font-medium rounded-md bg-white text-blue-600 shadow-sm transition-all';
            }

            loadItems();
        }

        async function loadItems(page = 1) {
            currentPage = page;
            try {
                const search = document.getElementById('searchInput').value;
                let url = '/api/hrd/items?';
                if (currentCategory !== 'all') url += 'category=' + currentCategory + '&';
                if (search) url += 'search=' + encodeURIComponent(search);
                url += '&page=' + page + '&limit=10';

                const response = await fetch(url);
                const result = await response.json();
                const tbody = document.getElementById('itemsTableBody');
                
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-10 text-center text-gray-500">등록된 물품이 없습니다.</td></tr>';
                    document.getElementById('paginationContainer').innerHTML = '';
                    return;
                }

                tbody.innerHTML = result.data.map(item => {
                    const itemData = JSON.stringify(item).replace(/"/g, '&quot;');
                    
                    const categoryLabel = item.category === 'textbook' ? '교재' : item.category === 'equipment' ? '비품/장비' : '소모품';
                    const categoryClass = item.category === 'textbook' ? 'bg-green-100 text-green-800' :
                                        item.category === 'equipment' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
                    
                    const statusLabel = item.status === 'good' ? '양호' :
                                      item.status === 'repair' ? '수리필요' :
                                      item.status === 'discard' ? '폐기예정' :
                                      item.status === 'shortage' ? '부족' : '-';
                    
                    const statusClass = item.status === 'good' ? 'text-green-700 bg-green-50' :
                                      item.status === 'repair' ? 'text-red-700 bg-red-50' :
                                      item.status === 'shortage' ? 'text-orange-700 bg-orange-50' : 'text-gray-700 bg-gray-50';
                    const statusDotClass = item.status === 'good' ? 'bg-green-500' :
                                         item.status === 'repair' ? 'bg-red-500' :
                                         item.status === 'shortage' ? 'bg-orange-500' : 'bg-gray-500';

                    return \`
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4"><input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"></td>
                            <td class="px-6 py-4">
                                <div class="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                                    \${item.image_url ? \`<img src="\${item.image_url}" class="w-full h-full object-cover cursor-pointer hover:opacity-90" onclick="window.open('\${item.image_url}')">\` : \`<i class="fas fa-box text-gray-300 text-2xl"></i>\`}
                                </div>
                            </td>
                            <td class="px-6 py-4"><span class="px-2 py-1 text-xs font-semibold rounded-full \${categoryClass}">\${categoryLabel}</span></td>
                            <td class="px-6 py-4 font-medium text-gray-900">\${item.name}</td>
                            <td class="px-6 py-4 text-gray-600">\${item.model || '-'}</td>
                            <td class="px-6 py-4 font-medium">\${item.quantity}</td>
                            <td class="px-6 py-4 text-gray-600">\${item.location || '-'}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium \${statusClass}">
                                    <span class="w-1.5 h-1.5 rounded-full \${statusDotClass}"></span>
                                    \${statusLabel}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <button onclick="openRentalModal(\${itemData})" class="text-blue-600 hover:text-blue-800 transition-colors mr-3" title="대여/반납"><i class="fas fa-clipboard-list"></i></button>
                                <button onclick="editItem(\${itemData})" class="text-gray-400 hover:text-blue-600 transition-colors mr-2" title="수정"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteItem(\${item.id})" class="text-gray-400 hover:text-red-600 transition-colors" title="삭제"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    \`;
                }).join('');
                
                renderPagination(result.total, result.page, result.limit);

            } catch (e) {
                console.error(e);
                document.getElementById('itemsTableBody').innerHTML = '<tr><td colspan="9" class="px-6 py-10 text-center text-red-500">오류 발생</td></tr>';
            }
        }
        
        function renderPagination(total, page, limit) {
            const totalPages = Math.ceil(total / limit);
            const container = document.getElementById('paginationContainer');
            if(totalPages <= 1 && page === 1) { container.innerHTML = ''; return; }

            let html = '<div class="flex items-center space-x-2">';
            
            // Prev
            const prevDisabled = page === 1;
            html += \`<button onclick="loadItems(\${page - 1})" \${prevDisabled ? 'disabled' : ''} class="px-3 py-1 rounded border \${prevDisabled ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-600'}"><i class="fas fa-chevron-left"></i></button>\`;

            // Numbers
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, page + 2);
            
            if(startPage > 1) html += '<span class="px-2 text-gray-400">...</span>';

            for(let i=startPage; i<=endPage; i++) {
                if (i === page) {
                    html += \`<button class="px-3 py-1 rounded bg-blue-600 text-white font-medium shadow-sm">\${i}</button>\`;
                } else {
                    html += \`<button onclick="loadItems(\${i})" class="px-3 py-1 rounded border bg-white hover:bg-gray-50 text-gray-600">\${i}</button>\`;
                }
            }
            
            if(endPage < totalPages) html += '<span class="px-2 text-gray-400">...</span>';

            // Next
            const nextDisabled = page === totalPages;
            html += \`<button onclick="loadItems(\${page + 1})" \${nextDisabled ? 'disabled' : ''} class="px-3 py-1 rounded border \${nextDisabled ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-600'}"><i class="fas fa-chevron-right"></i></button>\`;

            html += '</div>';
            container.innerHTML = html;
        }

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    if (id === 'createItemModal') {
        document.getElementById('modalTitle').textContent = '물품 등록';
        document.getElementById('itemForm').reset();
        document.getElementById('itemId').value = '';
        document.getElementById('itemStatus').value = 'good';
        clearItemImage();
    }
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function editItem(item) {
    openModal('createItemModal');
    document.getElementById('modalTitle').textContent = '물품 수정';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemModel').value = item.model || '';
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemLocation').value = item.location || '';
    document.getElementById('itemStatus').value = item.status || 'good';
    document.getElementById('itemMemo').value = item.memo || '';

    if (item.image_url) {
        document.getElementById('itemImageUrl').value = item.image_url;
        document.getElementById('itemImagePreview').src = item.image_url;
        document.getElementById('itemImagePreview').classList.remove('hidden');
        document.getElementById('imagePlaceholder').classList.add('hidden');
    } else {
        clearItemImage();
    }
}

function handleItemImage(input) {
    if (input.files && input.files[0]) {
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
                document.getElementById('itemImageUrl').value = dataUrl;
                document.getElementById('itemImagePreview').src = dataUrl;
                document.getElementById('itemImagePreview').classList.remove('hidden');
                document.getElementById('imagePlaceholder').classList.add('hidden');
            }
        }
    }
}

function clearItemImage() {
    const urlInput = document.getElementById('itemImageUrl');
    const preview = document.getElementById('itemImagePreview');
    const placeholder = document.getElementById('imagePlaceholder');
    const fileInput = document.getElementById('itemImageFile');

    if (urlInput) urlInput.value = '';
    if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    if (placeholder) placeholder.classList.remove('hidden');
    if (fileInput) fileInput.value = '';
}

async function handleSaveItem(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        let url = '/api/hrd/items';
        let method = 'POST';
        if (data.id) {
            url = '/api/hrd/items/' + data.id;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert('저장되었습니다.');
            closeModal('createItemModal');
            loadItems();
        } else {
            alert('저장 실패: ' + result.error);
        }
    } catch (e) {
        console.error(e);
        alert('오류가 발생했습니다.');
    }
}

async function deleteItem(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        const response = await fetch('/api/hrd/items/' + id, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('삭제되었습니다.');
            loadItems();
        } else {
            alert('삭제 실패: ' + result.error);
        }
    } catch (e) {
        console.error(e);
        alert('오류가 발생했습니다.');
    }
}

// ===== 대여 관리 기능 =====

function openRentalModal(item) {
    document.getElementById('rentalHistoryModal').classList.remove('hidden');
    document.getElementById('rentalItemName').textContent = item.name;
    document.getElementById('rentItemId').value = item.id;
    document.getElementById('rentForm').reset();
    loadRentals(item.id);
}

async function loadRentals(itemId) {
    const tbody = document.getElementById('rentalListBody');
    try {
        const res = await fetch(\`/api/hrd/items/\${itemId}/rentals\`);
                const result = await res.json();
                
                if(!result.success || result.data.length === 0) {
                     tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">대여 이력이 없습니다.</td></tr>';
                     return;
                }
                
                tbody.innerHTML = result.data.map(r => {
                    const isRented = r.status === 'rented';
                    const statusBadge = isRented 
                        ? '<span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">대여중</span>'
                        : '<span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">반납완료</span>';
                        
                    const actionBtn = isRented
                        ? \`<button onclick="returnItem(\${r.id}, \${itemId})" class="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-100">반납처리</button>\`
                        : '-';
                        
                    return \`
                        <tr class="hover:bg-gray-50 border-b last:border-0 text-xs">
                            <td class="px-4 py-3">\${statusBadge}</td>
                            <td class="px-4 py-3 font-medium">\${r.user_name}</td>
                            <td class="px-4 py-3 text-gray-500">\${r.phone || '-'}</td>
                            <td class="px-4 py-3 text-gray-500">\${r.rented_at.split(' ')[0]}</td>
                            <td class="px-4 py-3 text-gray-500">\${r.returned_at ? r.returned_at.split(' ')[0] : '-'}</td>
                            <td class="px-4 py-3 text-right">\${actionBtn}</td>
                        </tr>
                    \`;
                }).join('');
                
             } catch(e) {
                 console.error(e);
                 tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">오류 발생</td></tr>';
             }
        }
        
        async function handleRentItem(e) {
             e.preventDefault();
             const formData = new FormData(e.target);
             const itemId = document.getElementById('rentItemId').value;
             const data = Object.fromEntries(formData.entries());
             
             try {
                 const res = await fetch(\`/api/hrd/items/\${itemId}/rent\`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(data)
                 });
                 const r = await res.json();
                 if(r.success) {
                     alert('대여 처리되었습니다.');
                     e.target.reset();
                     loadRentals(itemId);
                 } else {
                     alert(r.error);
                 }
             } catch(err) { console.error(err); }
        }
        
        async function returnItem(rentalId, itemId) {
            if(!confirm('반납 처리하시겠습니까?')) return;
            try {
                 const res = await fetch(\`/api/hrd/rentals/\${rentalId}/return\`, { method: 'PUT' });
                 const r = await res.json();
                 if(r.success) {
                     alert('반납 완료되었습니다.');
                     loadRentals(itemId);
                 } else {
                     alert(r.error);
                 }
            } catch(err) { console.error(err); }
        }

        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadItems();
        });
    </script>
</body>
</html>
`;
